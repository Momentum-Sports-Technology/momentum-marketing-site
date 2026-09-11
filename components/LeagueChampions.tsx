import { Trophy } from "lucide-react";
import type { League } from "@/lib/mst";

/** Division winners and runners-up for completed MST leagues, newest first. */
export default function LeagueChampions({ leagues }: { leagues: League[] }) {
  const finished = leagues.filter((league) => league.completed);
  if (finished.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-momentum-light to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-14">
        {finished.map((league) => (
          <div key={league.id}>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{league.name} champions</h2>
              {league.dates && <p className="text-gray-500">{league.dates}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {league.divisions.map((division) => {
                const [winner, runnerUp] = division.standings;
                if (!winner) return null;
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
