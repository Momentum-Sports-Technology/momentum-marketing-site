import fs from "fs";
import path from "path";
import { z } from "zod";
import { contentFiles, type ContentSlug, type MixedLeagueContent } from "./schemas";

// Reading and writing the content files. The schemas themselves live in
// lib/schemas.ts so client code (the admin form) can validate before saving
// without pulling `fs` into the browser bundle.

export * from "./schemas";

const contentDirectory = process.env.CONTENT_DIR || path.join(process.cwd(), "content");

function filePathFor(slug: ContentSlug) {
  return path.join(contentDirectory, `${slug}.json`);
}

export async function getContent<S extends ContentSlug>(
  slug: S
): Promise<z.infer<(typeof contentFiles)[S]>> {
  const raw = fs.readFileSync(filePathFor(slug), "utf8");
  return contentFiles[slug].parse(JSON.parse(raw)) as z.infer<(typeof contentFiles)[S]>;
}

/**
 * Like `getContent`, but `null` rather than ENOENT when the file is absent.
 * Production seeds the content volume from the image on first run only, so a
 * newly added content file is genuinely missing there until someone puts it
 * in. A page that can say "not found" should use this; one whose content has
 * always existed should not hide a broken deployment behind it.
 */
export async function getContentIfExists<S extends ContentSlug>(
  slug: S
): Promise<z.infer<(typeof contentFiles)[S]> | null> {
  if (!fs.existsSync(filePathFor(slug))) return null;
  return getContent(slug);
}

/**
 * Validates then writes, keeping the previous version alongside as
 * `<slug>.prev.json`. Throws a ZodError on invalid input.
 *
 * The backup is one step deep on purpose: an admin edit goes live instantly,
 * so the thing worth having is the version from before this save, not a
 * history. Restore with
 * `docker exec momentum-marketing-prod sh -c 'cp /app/content/<slug>.prev.json /app/content/<slug>.json'`.
 */
export async function updateContent(slug: ContentSlug, data: unknown): Promise<void> {
  const parsed = contentFiles[slug].parse(data);
  const file = filePathFor(slug);
  if (fs.existsSync(file)) {
    try {
      fs.copyFileSync(file, path.join(contentDirectory, `${slug}.prev.json`));
    } catch (error) {
      // A failed backup must not block the edit.
      console.warn(`[content] could not back up ${slug}:`, error);
    }
  }
  fs.writeFileSync(file, JSON.stringify(parsed, null, 2) + "\n", "utf8");
}

// Kept for the existing mixed-league page and admin.
export const getMixedLeagueContent = () => getContent("mixed-league");
export const updateMixedLeagueContent = (c: MixedLeagueContent) => updateContent("mixed-league", c);

export { BOOKING_URL, resolveCta } from "./urls";
