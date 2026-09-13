import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, CalendarDays, Ticket } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import InterestForm from "@/components/InterestForm";
import { getContent } from "@/lib/content";
import { resolveCta } from "@/lib/urls";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Momentum Netball Basingstoke - Book a session",
  description:
    "Friendly, social netball in Basingstoke on Tuesday evenings, 6-8pm at The Costello School. £5 a session, book week by week, every ability welcome.",
};

export default async function BasingstokePage() {
  const content = await getContent("basingstoke");
  const { booking } = content;

  return (
    <>
      <PageHeader
        eyebrow={booking ? "Now booking" : "Coming soon"}
        title={content.title}
        subtitle={content.launchDate}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <p className="text-xl text-gray-600 leading-relaxed text-center mb-10">{content.intro}</p>

          {booking && (
            <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8 mb-12">
              <dl className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CalendarDays size={20} className="text-momentum-orange shrink-0 mt-1" />
                  <div>
                    <dt className="font-semibold">When</dt>
                    <dd className="text-gray-600">{booking.runs}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-momentum-orange shrink-0 mt-1" />
                  <div>
                    <dt className="font-semibold">Where</dt>
                    <dd className="text-gray-600">{booking.venue}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ticket size={20} className="text-momentum-orange shrink-0 mt-1" />
                  <div>
                    <dt className="font-semibold">Cost</dt>
                    <dd className="text-gray-600">{booking.price}</dd>
                  </div>
                </div>
              </dl>

              <Link
                href={resolveCta(booking.href)}
                className="block w-full text-center bg-momentum-orange text-white px-8 py-4 rounded-lg hover:bg-momentum-orange/90 hover:shadow-lg transition-all font-semibold text-lg"
              >
                {booking.ctaText}
              </Link>
            </div>
          )}

          <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8">
            {booking && (
              <h2 className="font-heading text-2xl text-center mb-6">{booking.interestHeading}</h2>
            )}
            <InterestForm
              source="basingstoke"
              successMessage={content.successMessage}
              smallprint={content.smallprint}
            />
          </div>

          <p className="flex items-center justify-center gap-2 text-gray-500 mt-8">
            <MapPin size={18} className="text-momentum-orange" />
            Basingstoke, Hampshire
          </p>
        </div>
      </section>
    </>
  );
}
