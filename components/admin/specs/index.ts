// Slug -> field spec. Every content file in lib/schemas.ts needs one here, or
// the admin has no form for it.

import type { Field } from "@/components/admin/form/spec";
import type { ContentSlug } from "@/lib/schemas";
import { siteSpec } from "./site";
import { linksSpec } from "./links";
import { mixedLeagueSpec } from "./mixedLeague";
import { basingstokeSpec } from "./basingstoke";
import { playersOfTheSeasonSpec } from "./playersOfTheSeason";
import { codeOfConductSpec } from "./codeOfConduct";
import { shopSpec } from "./shop";

export const specs: Record<ContentSlug, Record<string, Field>> = {
  site: siteSpec,
  "mixed-league": mixedLeagueSpec,
  basingstoke: basingstokeSpec,
  "players-of-the-season": playersOfTheSeasonSpec,
  "code-of-conduct": codeOfConductSpec,
  shop: shopSpec,
  links: linksSpec,
};
