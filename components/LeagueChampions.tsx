import { Star, Trophy } from "lucide-react";
import type { League, PlayerAward } from "@/lib/mst";

export interface TieBreak {
  mstLeagueId: string;
  division: string;
  name: string;
  team: string;
}

function pick(
  leaders: PlayerAward[],
  tieBreak: TieBreak | undefined
): { winners: PlayerAward[]; tiedCount: number } {
  if (leaders.length > 1 && tieBreak) {
    const chosen = leaders.find(
      (p) =>
        p.name.toLowerCase() === tieBreak.name.trim().toLowerCase() &&
        p.team.toLowerCase() === tieBreak.team.trim().toLowerCase()
    );
    if (chosen) return { winners: [chosen], tiedCount: leaders.length };
  }
  return { winners: leaders, tiedCount: leaders.length };
}

/** Division winners, runners-up and players of the season for completed MST leagues, newest first. */
export default function LeagueChampions({
  leagues,
  tieBreaks = [],
}: {
  leagues: League[];
  tieBreaks?: TieBreak[];
}) {
  const finished = leagues.filter((league) => league.completed);
  if (finished.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-momentum-light to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-14">
        {finished.map((league) => (
          <div key={league.id}>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{league.name}</h2>
              {league.dates && <p className="text-gray-500">{league.dates}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {league.divisions.map((division) => {
                const [winner, runnerUp] = division.standings;
                if (!winner) return null;
                const { winners, tiedCount } = pick(
                  division.playersOfSeason,
                  tieBreaks.find((t) => t.mstLeagueId === league.id && t.division === division.name)
                );
                return (
                  <div
                    key={division.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center"
                  >
                    <Trophy className="mx-auto text-momentum-orange mb-3" size={32} />
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      {division.name}
                    </p>
                    <p className="text-xl font-bold text-gray-900 mb-1">{winner.team}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {winner.points} pts · {winner.won}W {winner.drawn}D {winner.lost}L
                    </p>
                    {runnerUp && (
                      <p className="text-sm text-gray-600 border-t border-gray-100 pt-3">
                        Runners-up: <span className="font-semibold">{runnerUp.team}</span>
                      </p>
                    )}
                    {winners.length > 0 && (
                      <div className="mt-4 rounded-xl bg-orange-50 px-3 py-3">
                        <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-momentum-orange mb-1">
                          <Star size={14} className="fill-current" />
                          Player of the Season
                        </p>
                        <ul className="space-y-0.5">
                          {winners.map((p) => (
                            <li key={`${p.team}-${p.name}`} className="text-sm">
                              <span className="font-bold text-gray-900">{p.name}</span>{" "}
                              <span className="text-gray-500">({p.team})</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-gray-500 mt-1">
                          {winners.length > 1 ? "Joint winners, " : ""}
                          {winners[0].awards} player of the match{" "}
                          {winners[0].awards === 1 ? "award" : "awards"}
                          {winners.length === 1 && tiedCount > 1
                            ? `, chosen from a ${tiedCount}-way tie`
                            : ""}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center mt-6">
              <a
                href={`${league.shareUrl}?tab=standings`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-momentum-orange font-semibold hover:underline"
              >
                Final tables for {league.name}
              </a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
