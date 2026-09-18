import type { Field, SpecFor } from "@/components/admin/form/spec";
import type { SiteContent } from "@/lib/schemas";

/** Shared by the homepage hero and the Mixed League hero. */
export const heroFields: Record<string, Field> = {
  title: {
    kind: "textarea",
    rows: 2,
    label: "Headline",
    help: "Each line break starts a new line on the page.",
  },
  subtitle: { kind: "textarea", rows: 3, label: "Supporting text" },
  ctaText: { kind: "text", label: "Button text" },
  ctaLink: { kind: "text", label: "Button link", placeholder: "/book" },
  badge: {
    kind: "text",
    label: "Badge",
    help: "Small pill above the headline, e.g. 500+ Active Players. Leave blank for none.",
  },
  image: {
    kind: "text",
    label: "Photo",
    placeholder: "/images/momentum-womens.jpg",
    help: "Path to a file in the public/images folder.",
  },
};

/** Shared by the homepage stats and the Mixed League stats. */
export const statFields: Record<string, Field> = {
  value: { kind: "text", label: "Number" },
  suffix: { kind: "text", label: "Suffix", help: "Sits after the number, e.g. +. Optional." },
  label: { kind: "text", label: "Caption" },
  source: {
    kind: "select",
    label: "Keep up to date from the league",
    allowEmpty: true,
    emptyLabel: "No, use the number above",
    help: "Takes the number from the running league instead, so it cannot go stale.",
    options: [
      { value: "teams", label: "Number of teams" },
      { value: "weeklyMatches", label: "Matches per week" },
      { value: "divisions", label: "Number of divisions" },
    ],
  },
};

const faqFields: Record<string, Field> = {
  question: { kind: "text", label: "Question" },
  answer: { kind: "textarea", rows: 3, label: "Answer" },
};

export const siteSpec: SpecFor<SiteContent> = {
  contact: {
    kind: "group",
    label: "Contact details",
    fields: {
      email: { kind: "text", label: "Email address" },
      phone: { kind: "text", label: "Phone", help: "Optional." },
      reviewUrl: {
        kind: "text",
        label: "Google review link",
        help: "Shown in the footer and under the reviews. Leave blank to hide it.",
      },
      instagram: { kind: "text", label: "Instagram" },
      facebook: { kind: "text", label: "Facebook" },
      area: {
        kind: "text",
        label: "Area covered",
        help: "Used under Find Us and in the footer.",
      },
    },
  },
  hero: { kind: "group", label: "Top of the homepage", fields: heroFields },
  about: {
    kind: "group",
    label: "Who We Are",
    fields: {
      title: { kind: "text", label: "Heading" },
      body: {
        kind: "stringList",
        label: "Paragraphs",
        itemName: "Paragraph",
        rows: 4,
      },
    },
  },
  programmes: {
    kind: "list",
    label: "Programmes",
    itemName: "Programme",
    itemLabel: (item) => String(item.name ?? ""),
    help: "The cards on /book, and the featured ones on the homepage.",
    fields: {
      slug: {
        kind: "text",
        label: "Short name",
        help: "Lower case, no spaces. Used internally, not shown.",
      },
      name: { kind: "text", label: "Name" },
      tagline: { kind: "text", label: "Tagline", help: "Small capitals above the name." },
      description: { kind: "textarea", rows: 3, label: "Description" },
      price: {
        kind: "textarea",
        rows: 2,
        label: "Price note",
        help: "Shown in a box on the card. Leave blank for none.",
      },
      ctaText: { kind: "text", label: "Button text" },
      ctaHref: {
        kind: "text",
        label: "Button link",
        placeholder: "/#contact",
        help: "A link starting /events/ or /my-bookings goes to the booking site, and moves this card out of the editorial section on /book. Anything else is a page on this site or a full address.",
      },
      featured: {
        kind: "checkbox",
        label: "Show on the homepage",
        help: "Featured programmes appear under What We Do.",
      },
    },
  },
  stats: {
    kind: "list",
    label: "Momentum in numbers",
    itemName: "Statistic",
    itemLabel: (item) => String(item.label ?? ""),
    fields: statFields,
  },
  fixtures: {
    kind: "group",
    label: "Results and fixtures",
    fields: {
      title: { kind: "text", label: "Heading" },
      subtitle: { kind: "text", label: "Subheading" },
      leagues: {
        kind: "list",
        label: "Leagues",
        itemName: "League",
        itemLabel: (item) => String(item.name ?? ""),
        help: "Newest first. The running league is shown first; finished ones list their champions.",
        fields: {
          name: { kind: "text", label: "Name" },
          mstLeagueId: {
            kind: "text",
            label: "League number",
            help: "The number from the league's share link in Momentum Sports Technology.",
          },
        },
      },
    },
  },
  venues: {
    kind: "list",
    label: "Venues",
    itemName: "Venue",
    itemLabel: (item) => String(item.name ?? ""),
    fields: {
      name: { kind: "text", label: "Name" },
      town: { kind: "text", label: "Town" },
      description: {
        kind: "text",
        label: "Description",
        help: "e.g. Both inside and outside courts",
      },
      what3words: {
        kind: "text",
        label: "what3words",
        placeholder: "reward.crunching.forgives",
        help: "Three words, no slashes. Leave blank to hide the link.",
      },
      mapUrl: {
        kind: "text",
        label: "Map link",
        help: "Optional. Defaults to the what3words address above.",
      },
    },
  },
  events: {
    kind: "list",
    label: "Coming Soon",
    itemName: "Item",
    itemLabel: (item) => String(item.title ?? ""),
    help: "Remove them all to hide the section.",
    fields: {
      title: { kind: "text", label: "Title" },
      date: { kind: "text", label: "When", help: "Free text, e.g. New for this season." },
      description: { kind: "textarea", rows: 3, label: "Description" },
    },
  },
  reviews: {
    kind: "list",
    label: "What Players Say",
    itemName: "Review",
    itemLabel: (item) => String(item.author ?? ""),
    fields: {
      quote: { kind: "textarea", rows: 5, label: "Quote", help: "No quote marks needed." },
      author: { kind: "text", label: "Name" },
      rating: {
        kind: "select",
        label: "Stars",
        numeric: true,
        options: [5, 4, 3, 2, 1].map((n) => ({ value: n, label: `${n} stars` })),
      },
    },
  },
  faq: {
    kind: "list",
    label: "Common Questions",
    itemName: "Question",
    itemLabel: (item) => String(item.question ?? ""),
    fields: faqFields,
  },
};

export { faqFields };
