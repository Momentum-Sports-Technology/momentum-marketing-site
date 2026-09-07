import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Code of Conduct - Momentum Netball",
  description: "Momentum Netball's code of conduct for players, captains, parents, and spectators.",
};

export default async function CodeOfConductPage() {
  const content = await getContent("code-of-conduct");

  return (
    <>
      <PageHeader eyebrow="Our standards" title={content.title} subtitle={content.strapline} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <p className="text-xl text-gray-600 leading-relaxed mb-12">{content.intro}</p>

          <div className="space-y-10">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{section.heading}</h2>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start bg-gray-50 p-4 rounded-xl">
                      <span className="flex-shrink-0 w-6 h-6 bg-momentum-orange rounded-full flex items-center justify-center mt-0.5 mr-3">
                        <span className="w-2 h-2 bg-white rounded-full" />
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-lg text-gray-700 mt-12">{content.closing}</p>
          <p className="text-gray-500 mt-4">
            Our full{" "}
            <Link href="/terms" className="text-momentum-orange font-semibold">
              Terms and Conditions
            </Link>{" "}
            cover participation, payments, and cancellations.
          </p>
        </div>
      </section>
    </>
  );
}
