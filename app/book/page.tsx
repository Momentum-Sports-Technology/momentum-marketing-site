import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProgrammeCard from "@/components/ProgrammeCard";
import BookableCard from "@/components/BookableCard";
import { BOOKING_URL, getContent } from "@/lib/content";
import { getBookableProgrammes } from "@/lib/booking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book - Momentum Netball",
  description:
    "Book a place in Momentum Netball's women's and mixed leagues, coaching, and pay-to-play sessions across Hampshire.",
};

export default async function BookPage() {
  const site = await getContent("site");
  const bookable = await getBookableProgrammes();

  // Anything pointing at the booking site is described by the booking site
  // itself. The rest are enquiries, and stay editorial.
  const enquiries = site.programmes.filter((p) => !p.ctaHref.startsWith("/events/"));

  // If the booking site is unreachable we still have the editorial copy, so
  // the page degrades to what it was rather than to nothing.
  const fallback = bookable.length === 0;
  const firstSection = fallback ? site.programmes : enquiries;

  return (
    <>
      <PageHeader
        eyebrow="Book"
        title="Get on court"
        subtitle="Pick a programme below. Bookings and payments are handled on our secure booking site."
      />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {!fallback && (
            <div className="max-w-6xl mx-auto mb-20">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Book now</h2>
                <p className="text-lg text-gray-600">
                  Live from our booking system, so dates and places are always up to date.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookable.map((programme) => (
                  <BookableCard key={programme.slug} programme={programme} />
                ))}
              </div>
            </div>
          )}

          {firstSection.length > 0 && (
            <div className="max-w-6xl mx-auto">
              {!fallback && (
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">Other ways to play</h2>
                  <p className="text-lg text-gray-600">
                    Get in touch and we will find you a team, a session or a coach.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {firstSection.map((programme) => (
                  <ProgrammeCard key={programme.slug} programme={programme} compact />
                ))}
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto mt-20 bg-white rounded-3xl p-8 md:p-10 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-3">Already booked?</h2>
            <p className="text-gray-600 mb-6">
              View your upcoming sessions, manage your bookings, and make sure you never miss out on
              the action.
            </p>
            <a
              href={`${BOOKING_URL}/my-bookings`}
              className="inline-flex items-center bg-momentum-orange text-white px-8 py-4 rounded-lg hover:bg-momentum-orange/90 hover:shadow-lg transition-all font-semibold"
            >
              My Bookings
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
