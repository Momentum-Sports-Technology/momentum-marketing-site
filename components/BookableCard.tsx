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

  return (
    <Link
      href={resolveCta(programme.href)}
      className="group flex flex-col bg-white rounded-3xl p-8 border border-gray-200 hover:border-momentum-orange hover:shadow-lg transition-all"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 bg-momentum-orange rounded-2xl mb-5">
        <span className="text-white font-bold text-2xl">{programme.name.charAt(0)}</span>
      </div>

      <h3 className="text-2xl font-bold mb-3 group-hover:text-momentum-orange transition-colors">
        {programme.name}
      </h3>

      {programme.description && <p className="text-gray-600 mb-5">{programme.description}</p>}

      <dl className="space-y-2 text-sm text-gray-700 mb-6">
        {programme.nextDate && (
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-momentum-orange shrink-0" />
            <dt className="sr-only">Next session</dt>
            <dd>
              Next: {programme.nextDate}
              {placesLabel(programme.placesLeft)}
            </dd>
          </div>
        )}
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
        {soldOut ? "See other dates" : "Book a session"}
        <ArrowRight className="ml-2" size={18} />
      </span>
    </Link>
  );
}

/** " - 3 places left" / " - full", or nothing when the count is unknown. */
function placesLabel(placesLeft: number | null): string {
  if (placesLeft === null) return "";
  if (placesLeft === 0) return " - full";
  return ` - ${placesLeft} ${placesLeft === 1 ? "place" : "places"} left`;
}
