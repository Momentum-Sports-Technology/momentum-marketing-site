import Link from "next/link";
import { MapPin, Calendar, Star, ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import ProgrammeCard from "@/components/ProgrammeCard";
import LeagueCentre from "@/components/LeagueCentre";
import LeagueChampions from "@/components/LeagueChampions";
import ContactForm from "@/components/ContactForm";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getContent } from "@/lib/content";
import { getLeagues } from "@/lib/mst";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [site, players] = await Promise.all([
    getContent("site"),
    getContent("players-of-the-season"),
  ]);
  const leagues = await getLeagues(site.fixtures.leagues.map((l) => l.mstLeagueId));
  // Open on the running league if there is one, otherwise the most recent.
  const currentLeague = leagues.find((l) => !l.completed) ?? leagues[0];
  const featured = site.programmes.filter((p) => p.featured);
  const interests = [...site.programmes.map((p) => p.name), "Something else"];

  return (
    <>
      <Hero
        title={site.hero.title}
        subtitle={site.hero.subtitle}
        ctaText={site.hero.ctaText}
        ctaLink={site.hero.ctaLink}
        badge={site.hero.badge}
        image={site.hero.image}
      />

      {/* Who we are */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{site.about.title}</h2>
            {site.about.body.map((paragraph, index) => (
              <p key={index} className="text-xl text-gray-600 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section id="leagues" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Do</h2>
            <p className="text-xl text-gray-600">
              Competitive leagues, coaching, and pay-to-play sessions for every ability across
              Hampshire and the surrounding areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
            {featured.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/book"
              className="inline-flex items-center bg-momentum-orange text-white px-8 py-4 rounded-lg hover:bg-momentum-orange/90 hover:shadow-lg transition-all font-semibold text-lg"
            >
              See everything you can book
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      <LeagueCentre
        title={site.fixtures.title}
        subtitle={site.fixtures.subtitle}
        leagues={leagues}
        initialLeagueId={currentLeague?.id}
      />

      <LeagueChampions leagues={leagues} tieBreaks={players.tieBreaks} />

      <Stats title="Momentum in numbers" subtitle={site.contact.area} stats={site.stats} />

      {/* Find us */}
      <section id="venues" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Us</h2>
            <p className="text-xl text-gray-600">{site.contact.area}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {site.venues.map((venue) => (
              <div
                key={venue.name}
                className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-200"
              >
                <MapPin className="mx-auto mb-4 text-momentum-orange" size={32} />
                <h3 className="text-xl font-bold mb-1">{venue.name}</h3>
                <p className="text-gray-500 mb-3">{venue.town}</p>
                <p className="text-gray-600 mb-3">{venue.description}</p>
                {venue.what3words && (
                  <a
                    href={venue.mapUrl || `https://what3words.com/${venue.what3words}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-mono text-momentum-orange hover:underline"
                  >
                    ///{venue.what3words}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon */}
      {site.events.length > 0 && (
        <section id="events" className="py-24 bg-gradient-to-br from-momentum-light to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Coming Soon</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {site.events.map((event) => (
                <div
                  key={event.title}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
                >
                  <p className="inline-flex items-center text-sm font-semibold text-momentum-orange mb-3">
                    <Calendar className="mr-2" size={16} />
                    {event.date}
                  </p>
                  <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-24 bg-momentum-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Players Say</h2>
          </div>
          <div
            className={`grid grid-cols-1 ${site.reviews.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : ""} gap-8 max-w-6xl mx-auto`}
          >
            {site.reviews.map((review) => (
              <blockquote
                key={review.author}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
              >
                <div
                  className="flex items-center mb-4"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="text-momentum-orange fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed">“{review.quote}”</p>
                <footer className="text-sm text-gray-400 font-semibold">— {review.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <ContactForm interests={interests} email={site.contact.email} />

      <FAQ title="Common Questions" items={site.faq} />

      <NewsletterSignup />
    </>
  );
}
