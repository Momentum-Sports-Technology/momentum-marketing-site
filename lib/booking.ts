// Server-only: reads the booking site's public API so /book shows what is
// actually bookable rather than a hand-kept copy of it.
//
// The booking system (mini-momentum, events deployment) is the source of
// truth for programmes, prices and session dates. Editing a session there and
// remembering to edit content/site.json here is how the two drift, so this
// page reads across instead. Cached for five minutes, with the last good copy
// served if the booking site is briefly unreachable.

import { BOOKING_URL } from "./urls";

const TTL_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 5000;

interface RawCategory {
  categorySlug: string;
  categoryName: string;
  description?: string | null;
  location?: string | null;
  priceAmount?: number | null;
  enrollmentOpen?: boolean;
  isActive?: boolean;
}

interface RawEvent {
  eventDate: string;
  eventTime?: string | null;
  priceAmount?: number | null;
  available?: number | null;
  status?: string | null;
}

export interface BookableProgramme {
  slug: string;
  name: string;
  description: string;
  location: string;
  /** Formatted price of one session, e.g. "£5.00". Empty when free. */
  price: string;
  /** Next session, e.g. "Tue 15 Sep". Empty when nothing is scheduled. */
  nextDate: string;
  /** Places left at that next session. Null when unknown. */
  placesLeft: number | null;
  /** Path on the booking site; resolveCta turns it into a URL. */
  href: string;
}

function formatPrice(pence: number | null | undefined): string {
  if (!pence) return "";
  return `£${(pence / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

async function getJSON<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${BOOKING_URL}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[booking] ${path} unavailable:`, error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * The next open session for a category. Past dates are already excluded by the
 * booking site, but a session can be closed or full, so this takes the first
 * one someone could actually book.
 */
function nextSession(events: RawEvent[]): RawEvent | null {
  const upcoming = events
    .filter((e) => e.status !== "cancelled")
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  return upcoming[0] ?? null;
}

let cache: { at: number; value: BookableProgramme[] } | null = null;

/**
 * Everything currently bookable, in the booking site's own order. Returns an
 * empty list if the booking site cannot be reached and nothing was cached —
 * callers fall back to the editorial list in that case.
 */
export async function getBookableProgrammes(): Promise<BookableProgramme[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;

  const categories = await getJSON<RawCategory[]>("/api/event-categories");
  if (!categories) return cache?.value ?? [];

  const open = categories.filter((c) => c.enrollmentOpen !== false && c.isActive !== false);

  const programmes = await Promise.all(
    open.map(async (category) => {
      const events =
        (await getJSON<RawEvent[]>(
          `/api/event-availability?category_slug=${encodeURIComponent(category.categorySlug)}`
        )) ?? [];
      const next = nextSession(events);

      return {
        slug: category.categorySlug,
        name: category.categoryName,
        description: category.description ?? "",
        location: category.location ?? "",
        price: formatPrice(next?.priceAmount ?? category.priceAmount),
        nextDate: next ? formatDate(next.eventDate) : "",
        placesLeft: next?.available ?? null,
        href: `/events/${category.categorySlug}`,
      };
    })
  );

  // A programme with nothing scheduled is still worth showing — it says when
  // sessions return — but the ones people can book come first.
  const value = programmes.sort((a, b) => Number(!a.nextDate) - Number(!b.nextDate));
  cache = { at: Date.now(), value };
  return value;
}
