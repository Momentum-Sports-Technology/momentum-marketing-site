import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas. Every content file has one, and the admin PUT validates against it.
// ---------------------------------------------------------------------------

const heroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
  badge: z.string().optional(),
  image: z.string().optional(),
});

const faqItemSchema = z.object({ question: z.string(), answer: z.string() });
const statSchema = z.object({
  value: z.string(),
  suffix: z.string().optional(),
  label: z.string(),
  /** Take the number from the current league instead of `value`. */
  source: z.enum(["weeklyMatches", "divisions", "teams"]).optional(),
});
const featureSchema = z.object({ number: z.string(), title: z.string(), description: z.string() });

export const mixedLeagueSchema = z.object({
  hero: heroSchema,
  about: z.object({ title: z.string(), description: z.string() }),
  features: z.array(featureSchema),
  howItWorks: z.object({
    title: z.string(),
    steps: z.array(z.object({ step: z.string(), title: z.string(), description: z.string() })),
  }),
  stats: z.object({ title: z.string(), subtitle: z.string(), stats: z.array(statSchema) }),
  faq: z.object({ title: z.string(), items: z.array(faqItemSchema) }),
});

export const programmeSchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  price: z.string().optional(),
  ctaText: z.string(),
  /** "/events/<slug>" or "/my-bookings" resolve to the booking site; anything else is used as-is */
  ctaHref: z.string(),
  featured: z.boolean().optional(),
});

export const siteSchema = z.object({
  contact: z.object({
    email: z.string(),
    phone: z.string().optional(),
    /** Google review link, shown in the footer when set. */
    reviewUrl: z.string().optional(),
    instagram: z.string(),
    facebook: z.string(),
    area: z.string(),
  }),
  hero: heroSchema,
  about: z.object({ title: z.string(), body: z.array(z.string()) }),
  programmes: z.array(programmeSchema),
  stats: z.array(statSchema),
  fixtures: z.object({
    title: z.string(),
    subtitle: z.string(),
    /** MST leagues, newest first. The homepage shows the running one; finished ones list their champions. */
    leagues: z.array(z.object({ name: z.string(), mstLeagueId: z.string() })),
  }),
  venues: z.array(
    z.object({
      name: z.string(),
      town: z.string(),
      description: z.string(),
      what3words: z.string().optional(),
      mapUrl: z.string().optional(),
    })
  ),
  events: z.array(z.object({ title: z.string(), date: z.string(), description: z.string() })),
  reviews: z.array(
    z.object({ quote: z.string(), author: z.string(), rating: z.number().min(1).max(5) })
  ),
  faq: z.array(faqItemSchema),
});

export const playersOfTheSeasonSchema = z.object({
  title: z.string(),
  intro: z.string(),
  /** Organisers' pick when several players tie on player of the match awards in a division. */
  tieBreaks: z
    .array(
      z.object({
        mstLeagueId: z.string(),
        division: z.string(),
        name: z.string(),
        team: z.string(),
      })
    )
    .default([]),
  divisions: z.array(
    z.object({
      name: z.string(),
      seasons: z.array(
        z.object({
          name: z.string(),
          players: z.array(z.object({ name: z.string(), team: z.string() })),
        })
      ),
    })
  ),
});

export const codeOfConductSchema = z.object({
  title: z.string(),
  strapline: z.string(),
  intro: z.string(),
  sections: z.array(z.object({ heading: z.string(), items: z.array(z.string()) })),
  closing: z.string(),
});

export const shopSchema = z.object({
  title: z.string(),
  intro: z.string(),
  products: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.string(),
      image: z.string().optional(),
      /** Stripe Payment Link. Empty string shows the product as "coming soon". */
      paymentLinkUrl: z.string(),
    })
  ),
});

export const basingstokeSchema = z.object({
  title: z.string(),
  launchDate: z.string(),
  intro: z.string(),
  smallprint: z.string(),
  successMessage: z.string(),
  /** Set once booking is open. Without it the page only captures interest. */
  booking: z
    .object({
      href: z.string(),
      ctaText: z.string(),
      venue: z.string(),
      price: z.string(),
      runs: z.string(),
      interestHeading: z.string(),
    })
    .optional(),
});

export const linksSchema = z.object({
  title: z.string(),
  intro: z.string().optional(),
  links: z
    .array(
      z.object({
        label: z.string(),
        description: z.string().optional(),
        /** A site path, "/events/<slug>" or "/my-bookings" on the booking site, or an absolute URL */
        href: z.string(),
        /** One link gets the solid button. Use it for the thing most people came for. */
        primary: z.boolean().optional(),
      })
    )
    .min(1),
});

export type MixedLeagueContent = z.infer<typeof mixedLeagueSchema>;
export type SiteContent = z.infer<typeof siteSchema>;
export type Programme = z.infer<typeof programmeSchema>;
export type PlayersOfTheSeasonContent = z.infer<typeof playersOfTheSeasonSchema>;
export type CodeOfConductContent = z.infer<typeof codeOfConductSchema>;
export type ShopContent = z.infer<typeof shopSchema>;
export type LinksContent = z.infer<typeof linksSchema>;
export type BasingstokeContent = z.infer<typeof basingstokeSchema>;

// Re-exported for existing component props.
export type HeroContent = z.infer<typeof heroSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type FAQItem = z.infer<typeof faqItemSchema>;
export type Stat = z.infer<typeof statSchema>;

// ---------------------------------------------------------------------------
// Registry: slug -> schema. The admin API only accepts slugs listed here.
// ---------------------------------------------------------------------------

export const contentFiles = {
  "mixed-league": mixedLeagueSchema,
  site: siteSchema,
  "players-of-the-season": playersOfTheSeasonSchema,
  "code-of-conduct": codeOfConductSchema,
  shop: shopSchema,
  basingstoke: basingstokeSchema,
  links: linksSchema,
} as const;

export type ContentSlug = keyof typeof contentFiles;

export function isContentSlug(slug: string): slug is ContentSlug {
  return Object.prototype.hasOwnProperty.call(contentFiles, slug);
}
