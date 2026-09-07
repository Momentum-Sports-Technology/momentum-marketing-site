// Safe to import from client components: no Node APIs.

export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL || "https://booking.momentumnetball.co.uk";

/** Programme CTA hrefs that start with "/" are paths on the booking site. */
export function resolveCta(href: string): string {
  return href.startsWith("/") ? `${BOOKING_URL}${href}` : href;
}
