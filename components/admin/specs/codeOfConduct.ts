import type { SpecFor } from "@/components/admin/form/spec";
import type { CodeOfConductContent } from "@/lib/schemas";

export const codeOfConductSpec: SpecFor<CodeOfConductContent> = {
  title: { kind: "text", label: "Page title" },
  strapline: { kind: "text", label: "Strapline" },
  intro: { kind: "textarea", rows: 4, label: "Intro" },
  sections: {
    kind: "list",
    label: "Sections",
    itemName: "Section",
    itemLabel: (item) => String(item.heading ?? ""),
    fields: {
      heading: { kind: "text", label: "Heading" },
      items: { kind: "stringList", label: "Points", itemName: "Point", rows: 2 },
    },
  },
  closing: { kind: "textarea", rows: 2, label: "Closing line" },
};
