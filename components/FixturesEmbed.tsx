"use client";

import { useState } from "react";

const MST_URL = process.env.NEXT_PUBLIC_MST_URL || "https://momentumsportstechnology.com";

interface League {
  name: string;
  mstLeagueId: string;
}

interface FixturesEmbedProps {
  title: string;
  subtitle?: string;
  leagues: League[];
}

/**
 * Live fixtures and standings from Momentum Sports Technology's public league
 * page, embedded with its chrome-free `?embed=1` mode. One tab per league.
 */
export default function FixturesEmbed({ title, subtitle, leagues }: FixturesEmbedProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (leagues.length === 0) {
    return (
      <section id="fixtures" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-600">
            Live fixtures and standings for the new season are on the way. Follow us on social media
            for results in the meantime.
          </p>
        </div>
      </section>
    );
  }

  const active = leagues[Math.min(activeIndex, leagues.length - 1)];
  const src = `${MST_URL}/share/leagues/${active.mstLeagueId}?embed=1`;

  return (
    <section id="fixtures" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
        </div>

        {leagues.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {leagues.map((league, index) => (
              <button
                key={league.mstLeagueId}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`px-5 py-2 rounded-full font-semibold transition-colors ${
                  index === activeIndex
                    ? "bg-momentum-orange text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-momentum-orange"
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        )}

        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <iframe
            key={src}
            src={src}
            title={`${active.name} fixtures and standings`}
            loading="lazy"
            className="w-full h-[700px] border-0"
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          <a
            href={`${MST_URL}/share/leagues/${active.mstLeagueId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-momentum-orange"
          >
            Open {active.name} in a new tab
          </a>
        </p>
      </div>
    </section>
  );
}
