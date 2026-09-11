import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LeagueChampions from "@/components/LeagueChampions";
import { getContent } from "@/lib/content";
import { getLeagues } from "@/lib/mst";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Players of the Season - Momentum Netball",
  description: "Momentum Netball players of the season, by division and season.",
};

export default async function PlayersOfTheSeasonPage() {
  const [content, site] = await Promise.all([
    getContent("players-of-the-season"),
    getContent("site"),
  ]);
  const leagues = await getLeagues(site.fixtures.leagues.map((l) => l.mstLeagueId));

  return (
    <>
      <PageHeader eyebrow="Awards" title={content.title} subtitle={content.intro} />

      <LeagueChampions leagues={leagues} tieBreaks={content.tieBreaks} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
          {content.divisions.length > 0 && (
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Previous seasons</h2>
              <p className="text-gray-500">
                Players of the Season from our John Hanson leagues, one per team.
              </p>
            </div>
          )}
          {content.divisions.map((division) => (
            <div key={division.name}>
              <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
                <Trophy className="text-momentum-orange mr-3" size={32} />
                {division.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {division.seasons.map((season) => (
                  <div
                    key={season.name}
                    className="bg-gray-50 rounded-2xl border border-gray-200 p-6"
                  >
                    <h4 className="text-xl font-bold font-black-mango mb-4">{season.name}</h4>
                    <ul className="space-y-2">
                      {season.players.map((player) => (
                        <li
                          key={`${player.name}-${player.team}`}
                          className="flex justify-between gap-4 border-b border-gray-200 last:border-0 pb-2"
                        >
                          <span className="font-semibold">{player.name}</span>
                          <span className="text-gray-500">{player.team}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
