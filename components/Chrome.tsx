"use client";

import { usePathname } from "next/navigation";

/** Routes that render without the site's navigation and footer. */
const BARE_ROUTES = ["/links"];

/**
 * Hides the site chrome on the few pages that are entry points rather than
 * destinations. `/links` is opened from an Instagram bio: a link tree whose
 * first element is a nav bar full of other links is a link tree twice.
 *
 * Exact match, not `startsWith` — a future `/links-for-schools` should keep
 * the chrome unless someone decides otherwise.
 */
export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE_ROUTES.includes(pathname)) return null;
  return <>{children}</>;
}
