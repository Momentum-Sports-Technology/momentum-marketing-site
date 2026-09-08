// Safe to import from client components: no Node APIs.

export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL || "https://booking.momentumnetball.co.uk";

/** Paths that live on the booking site rather than here. */
const BOOKING_PATH_PREFIXES = ["/events/", "/my-bookings"];

/**
 * Programme CTA hrefs: "/events/<slug>" and "/my-bookings" resolve to the
 * booking site; every other value (site paths, anchors, absolute URLs) is
 * used as-is.
 */
export function resolveCta(href: string): string {
  return BOOKING_PATH_PREFIXES.some((p) => href.startsWith(p)) ? `${BOOKING_URL}${href}` : href;
}
