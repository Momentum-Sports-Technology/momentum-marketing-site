import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProgrammeCard from "@/components/ProgrammeCard";
import { BOOKING_URL, getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book - Momentum Netball",
  description:
    "Book a place in Momentum Netball's women's and mixed leagues, coaching, and pay-to-play sessions across Hampshire.",
};

export default async function BookPage() {
  const site = await getContent("site");

  return (
    <>
      <PageHeader
        eyebrow="Book"
        title="Get on court"
        subtitle="Pick a programme below. Bookings and payments are handled on our secure booking site."
      />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {site.programmes.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} compact />
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 bg-white rounded-3xl p-8 border border-gray-200 text-center">
            <h2 className="text-2xl font-bold mb-3">Already booked?</h2>
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
