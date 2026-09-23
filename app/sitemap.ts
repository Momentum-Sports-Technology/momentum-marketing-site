import type { MetadataRoute } from "next";

/**
 * `public/robots.txt` points search engines at /sitemap.xml, so this has to
 * exist. Only the pages meant to be found from search are listed: /admin is
 * private and /links is deliberately noindex (see app/links/page.tsx).
 *
 * No `lastModified`. Content is edited in admin without a rebuild, so any
 * date baked in here at build time would be wrong within the day.
 */
const paths = [
  "/",
  "/book",
  "/shop",
  "/mixed",
  "/basingstoke",
  "/player-of-the-season",
  "/code-of-conduct",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://momentumnetball.co.uk";
  return paths.map((path) => ({ url: new URL(path, base).toString() }));
}
