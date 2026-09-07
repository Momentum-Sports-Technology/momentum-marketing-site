import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import RegistrationForm from "@/components/RegistrationForm";
import { getMixedLeagueContent } from "@/lib/content";

export const metadata = {
  title: "Mixed League - Momentum Netball",
  description: "Join the South's fastest-growing mixed netball league. All skill levels welcome.",
};

export default async function MixedLeaguePage() {
  const content = await getMixedLeagueContent();

  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        ctaText={content.hero.ctaText}
        ctaLink={content.hero.ctaLink}
        badge={content.hero.badge}
      />

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{content.about.title}</h2>
            <p className="text-xl text-gray-600 leading-relaxed">{content.about.description}</p>
          </div>
        </div>
      </section>

      <Features
        title="Control your game in seconds"
        subtitle="Everything you need for the perfect netball experience"
        features={content.features}
      />

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-momentum-light to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{content.howItWorks.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {content.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-momentum rounded-full mb-6 text-white font-bold text-2xl">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Stats
        title={content.stats.title}
        subtitle={content.stats.subtitle}
        stats={content.stats.stats}
      />

      <RegistrationForm />

      <FAQ title={content.faq.title} items={content.faq.items} />
    </>
  );
}
