"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { League, LeagueMatch } from "@/lib/mst";

interface LeagueCentreProps {
  title: string;
  subtitle?: string;
  /** Newest first. */
  leagues: League[];
  /** League shown first; defaults to the first in the list. */
  initialLeagueId?: string;
}

function MatchList({
  heading,
  matches,
  empty,
  showScore,
}: {
  heading: string;
  matches: LeagueMatch[];
  empty: string;
  showScore: boolean;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3">{heading}</h3>
      {matches.length === 0 ? (
        <p className="text-gray-500 text-sm">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {matches.map((m) => (
            <li key={m.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">
                {m.when}
                {m.venue && ` · ${m.venue}`}
              </p>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-gray-900 flex-1 text-right">{m.home}</span>
                <span className="font-mono font-bold text-momentum-orange whitespace-nowrap">
                  {showScore ? `${m.homeScore ?? "-"} – ${m.awayScore ?? "-"}` : "v"}
                </span>
                <span className="font-semibold text-gray-900 flex-1">{m.away}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Standings, results and fixtures from MST, one league and one division at a
 * time. The running league shows next fixtures; a finished league shows its
 * final table and last results.
 */
export default function LeagueCentre({
  title,
  subtitle,
  leagues,
  initialLeagueId,
}: LeagueCentreProps) {
  const [leagueId, setLeagueId] = useState(initialLeagueId ?? leagues[0]?.id);
  const [divisionIndex, setDivisionIndex] = useState(0);

  const league = leagues.find((l) => l.id === leagueId) ?? leagues[0];

  if (!league || league.divisions.length === 0) {
    return (
      <section id="fixtures" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-600">
            Live fixtures and standings are on the way. Follow us on social media for results in the
            meantime.
          </p>
        </div>
      </section>
    );
  }

  const division = league.divisions[Math.min(divisionIndex, league.divisions.length - 1)];

  const handleSelectLeague = (id: string) => {
    setLeagueId(id);
    setDivisionIndex(0);
  };

  return (
    <section id="fixtures" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
        </div>

        {leagues.length > 1 && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex flex-wrap justify-center rounded-2xl bg-white border border-gray-200 p-1 gap-1">
              {leagues.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => handleSelectLeague(l.id)}
                  aria-pressed={l.id === league.id}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    l.id === league.id
                      ? "bg-momentum-dark text-white"
                      : "text-gray-600 hover:text-momentum-orange"
                  }`}
                >
                  {l.name}
                  <span className="ml-2 text-xs font-normal opacity-75">
                    {l.completed ? "Final" : "Live"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-gray-500 mb-6">
          {league.name}
          {league.dates && ` · ${league.dates}`}
          {league.completed && " · Final tables"}
        </p>

        {league.divisions.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {league.divisions.map((d, index) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDivisionIndex(index)}
                className={`px-5 py-2 rounded-full font-semibold transition-colors ${
                  d.id === division.id
                    ? "bg-momentum-orange text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-momentum-orange"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-3 self-start bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-momentum-dark text-white">
                  <tr>
                    <th className="px-3 py-3 text-left">#</th>
                    <th className="px-3 py-3 text-left">Team</th>
                    <th className="px-3 py-3 text-center">P</th>
                    <th className="px-3 py-3 text-center">W</th>
                    <th className="px-3 py-3 text-center">D</th>
                    <th className="px-3 py-3 text-center">L</th>
                    <th className="px-3 py-3 text-center">GD</th>
                    <th className="px-3 py-3 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {division.standings.map((row) => (
                    <tr
                      key={row.team}
                      className={`border-t border-gray-100 ${row.position === 1 ? "bg-orange-50" : ""}`}
                    >
                      <td className="px-3 py-3 font-semibold text-gray-500">{row.position}</td>
                      <td className="px-3 py-3 font-semibold text-gray-900">{row.team}</td>
                      <td className="px-3 py-3 text-center">{row.played}</td>
                      <td className="px-3 py-3 text-center">{row.won}</td>
                      <td className="px-3 py-3 text-center">{row.drawn}</td>
                      <td className="px-3 py-3 text-center">{row.lost}</td>
                      <td className="px-3 py-3 text-center">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="px-3 py-3 text-center font-bold">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {!league.completed && (
              <MatchList
                heading="Next fixtures"
                matches={division.upcoming}
                empty="No fixtures scheduled."
                showScore={false}
              />
            )}
            <MatchList
              heading={league.completed ? "Final results" : "Latest results"}
              matches={division.results}
              empty="No results yet."
              showScore
            />
          </div>
        </div>

        <p className="text-center mt-8">
          <a
            href={league.completed ? `${league.shareUrl}?tab=standings` : league.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-momentum-orange font-semibold hover:underline"
          >
            Full fixtures, results and tables for {league.name}
            <ExternalLink size={16} />
          </a>
        </p>
      </div>
    </section>
  );
}
