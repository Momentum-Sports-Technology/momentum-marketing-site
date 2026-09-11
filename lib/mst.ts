// Server-only: reads Momentum Sports Technology's public league API.
//
// MST's share pages cannot be framed from another domain (its nginx sends
// X-Frame-Options: SAMEORIGIN), so this site renders standings, results,
// fixtures and champions itself from the public JSON instead of an iframe.

const MST_URL = process.env.NEXT_PUBLIC_MST_URL || "https://momentumsportstechnology.com";
const TTL_MS = 5 * 60 * 1000;
const RESULTS_SHOWN = 6;
const FIXTURES_SHOWN = 6;

type RawTeam = { name?: string } | null | undefined;

interface RawLeague {
  league: {
    id: number;
    name: string;
    status: string;
    start_date?: string;
    end_date?: string;
    divisions: Array<{ id: number; name: string; displayName?: string; sortOrder?: number }>;
  };
  standings: Array<{
    divisionId: number;
    team: RawTeam;
    position: number | null;
    points: number;
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    gamesDraw: number;
    goalDifference: number;
  }>;
  matches: Array<{
    id: number;
    divisionId: number;
    homeTeam: RawTeam;
    awayTeam: RawTeam;
    scheduledDate: string;
    status: string;
    homeScore: number | null;
    awayScore: number | null;
    venue?: { name?: string } | null;
    venueCourt?: { name?: string } | null;
  }>;
}

export interface StandingRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDifference: number;
  points: number;
}

export interface LeagueMatch {
  id: number;
  when: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  venue: string;
}

export interface LeagueDivision {
  id: number;
  name: string;
  standings: StandingRow[];
  results: LeagueMatch[];
  upcoming: LeagueMatch[];
}

export interface League {
  id: string;
  name: string;
  completed: boolean;
  dates: string;
  shareUrl: string;
  divisions: LeagueDivision[];
}

const matchFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/London",
});
const dayFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/London",
});

function teamName(team: RawTeam): string {
  return team?.name?.trim() || "";
}

function toLeague(id: string, raw: RawLeague, now: number): League {
  const divisions = [...raw.league.divisions]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((division) => {
      const standings = raw.standings
        .filter((s) => s.divisionId === division.id && teamName(s.team))
        .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
        .map((s, index) => ({
          position: s.position ?? index + 1,
          team: teamName(s.team),
          played: s.gamesPlayed,
          won: s.gamesWon,
          drawn: s.gamesDraw,
          lost: s.gamesLost,
          goalDifference: s.goalDifference,
          points: s.points,
        }));

      // Split-phase placeholders have no teams until the pots are drawn.
      const matches = raw.matches.filter(
        (m) => m.divisionId === division.id && teamName(m.homeTeam) && teamName(m.awayTeam)
      );
      const toMatch = (m: RawLeague["matches"][number]): LeagueMatch => ({
        id: m.id,
        when: matchFmt.format(new Date(m.scheduledDate)),
        home: teamName(m.homeTeam),
        away: teamName(m.awayTeam),
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        venue: [m.venue?.name, m.venueCourt?.name].filter(Boolean).join(", "),
      });

      // Walkovers can be recorded ahead of their date; only show a result
      // once its date has passed.
      const results = matches
        .filter((m) => m.status === "completed" && Date.parse(m.scheduledDate) <= now)
        .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))
        .slice(0, RESULTS_SHOWN)
        .map(toMatch);
      const upcoming = matches
        .filter((m) => m.status === "scheduled" && Date.parse(m.scheduledDate) >= now)
        .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
        .slice(0, FIXTURES_SHOWN)
        .map(toMatch);

      return {
        id: division.id,
        name: division.displayName || division.name,
        standings,
        results,
        upcoming,
      };
    });

  const { start_date, end_date } = raw.league;
  const dates =
    start_date && end_date
      ? `${dayFmt.format(new Date(start_date))} to ${dayFmt.format(new Date(end_date))}`
      : "";

  return {
    id,
    name: raw.league.name,
    completed: raw.league.status === "completed",
    dates,
    shareUrl: `${MST_URL}/share/leagues/${encodeURIComponent(id)}`,
    divisions,
  };
}

const cache = new Map<string, { at: number; value: League | null }>();

/** One league, cached for five minutes. Returns the last good copy, or null, if MST is unreachable. */
export async function getLeague(id: string): Promise<League | null> {
  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value;

  let value: League | null = null;
  try {
    const response = await fetch(`${MST_URL}/api/public/leagues/${encodeURIComponent(id)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const raw = (await response.json()) as RawLeague;
      if (raw?.league) value = toLeague(id, raw, Date.now());
    }
  } catch (error) {
    console.warn(`[mst] league ${id} unavailable:`, error instanceof Error ? error.message : error);
  }

  if (!value && hit) value = hit.value;
  cache.set(id, { at: Date.now(), value });
  return value;
}

/** Leagues in the order given, skipping any that could not be loaded. */
export async function getLeagues(ids: string[]): Promise<League[]> {
  const leagues = await Promise.all(ids.map(getLeague));
  return leagues.filter((league): league is League => league !== null);
}
