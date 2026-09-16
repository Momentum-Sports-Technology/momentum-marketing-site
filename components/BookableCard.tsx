import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Ticket } from "lucide-react";
import type { BookableProgramme } from "@/lib/booking";
import { resolveCta } from "@/lib/urls";

interface BookableCardProps {
  programme: BookableProgramme;
}

/**
 * A programme as the booking system describes it: real price, real next date,
 * real places left. Contrast with ProgrammeCard, which renders the editorial
 * copy from content/site.json.
 */
export default function BookableCard({ programme }: BookableCardProps) {
  const soldOut = programme.placesLeft === 0;
  const scheduled = programme.nextDate !== "";

  const cta = !scheduled ? "View programme" : soldOut ? "See other dates" : "Book a session";

  return (
    <Link
      href={resolveCta(programme.href)}
      className="group flex flex-col bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-momentum-orange transition-all"
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {scheduled ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-momentum-orange">
            <CalendarDays size={14} />
            Next: {programme.nextDate}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
            <CalendarDays size={14} />
            No dates yet
          </span>
        )}
        <PlacesPill placesLeft={programme.placesLeft} />
      </div>

      <h3 className="text-2xl font-bold mb-3 group-hover:text-momentum-orange transition-colors">
        {programme.name}
      </h3>

      {programme.description && <p className="text-gray-600 mb-5">{programme.description}</p>}

      <dl className="space-y-2 text-sm text-gray-700 mb-6">
        {programme.location && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-momentum-orange shrink-0" />
            <dt className="sr-only">Where</dt>
            <dd>{programme.location}</dd>
          </div>
        )}
        {programme.price && (
          <div className="flex items-center gap-2">
            <Ticket size={16} className="text-momentum-orange shrink-0" />
            <dt className="sr-only">Price</dt>
            <dd>{programme.price} a session</dd>
          </div>
        )}
      </dl>

      <span className="mt-auto inline-flex items-center text-momentum-orange font-semibold group-hover:translate-x-2 transition-transform">
        {cta}
        <ArrowRight className="ml-2" size={18} />
      </span>
    </Link>
  );
}

/**
 * "Only 2 left" or "Full". Nothing while places are plentiful: a healthy
 * count says nothing useful and a thin one puts people off.
 */
function PlacesPill({ placesLeft }: { placesLeft: number | null }) {
  if (placesLeft === null || placesLeft > 3) return null;

  const full = placesLeft === 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
        full ? "bg-gray-100 text-gray-600" : "bg-amber-50 text-amber-700"
      }`}
    >
      {full ? "Full" : `Only ${placesLeft} left`}
    </span>
  );
}
