import type { Field, SpecFor } from "@/components/admin/form/spec";
import type { MixedLeagueContent } from "@/lib/schemas";
import { heroFields, statFields, faqFields } from "./site";

const featureFields: Record<string, Field> = {
  number: { kind: "text", label: "Number" },
  title: { kind: "text", label: "Title" },
  description: { kind: "textarea", rows: 3, label: "Description" },
};

export const mixedLeagueSpec: SpecFor<MixedLeagueContent> = {
  hero: { kind: "group", label: "Top of the page", fields: heroFields },
  about: {
    kind: "group",
    label: "What is Momentum Mixed?",
    fields: {
      title: { kind: "text", label: "Heading" },
      description: { kind: "textarea", rows: 4, label: "Description" },
    },
  },
  features: {
    kind: "list",
    label: "Features",
    itemName: "Feature",
    itemLabel: (item) => String(item.title ?? ""),
    fields: featureFields,
  },
  howItWorks: {
    kind: "group",
    label: "How Momentum Mixed Works",
    fields: {
      title: { kind: "text", label: "Heading" },
      steps: {
        kind: "list",
        label: "Steps",
        itemName: "Step",
        itemLabel: (item) => String(item.title ?? ""),
        fields: {
          step: { kind: "text", label: "Number" },
          title: { kind: "text", label: "Title" },
          description: { kind: "textarea", rows: 3, label: "Description" },
        },
      },
    },
  },
  stats: {
    kind: "group",
    label: "Why Momentum?",
    fields: {
      title: { kind: "text", label: "Heading" },
      subtitle: { kind: "text", label: "Subheading" },
      stats: {
        kind: "list",
        label: "Statistics",
        itemName: "Statistic",
        itemLabel: (item) => String(item.label ?? ""),
        fields: statFields,
      },
    },
  },
  faq: {
    kind: "group",
    label: "Frequently Asked Questions",
    fields: {
      title: { kind: "text", label: "Heading" },
      items: {
        kind: "list",
        label: "Questions",
        itemName: "Question",
        itemLabel: (item) => String(item.question ?? ""),
        fields: faqFields,
      },
    },
  },
};
