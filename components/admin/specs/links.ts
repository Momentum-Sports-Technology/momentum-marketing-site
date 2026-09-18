import type { SpecFor } from "@/components/admin/form/spec";
import type { LinksContent } from "@/lib/schemas";

export const linksSpec: SpecFor<LinksContent> = {
  title: { kind: "text", label: "Page title" },
  intro: {
    kind: "textarea",
    rows: 2,
    label: "Intro",
    help: "One or two lines under the title. Leave blank for none.",
  },
  links: {
    kind: "list",
    label: "Links",
    itemName: "Link",
    minItems: 1,
    itemLabel: (item) => String(item.label ?? ""),
    help: "Shown in this order. Put what most people came for at the top.",
    fields: {
      label: { kind: "text", label: "Label" },
      description: {
        kind: "text",
        label: "Description",
        help: "Small print under the label. Optional.",
      },
      href: {
        kind: "text",
        label: "Link",
        placeholder: "/book",
        help: "A page on this site like /book, a booking-site path like /events/basingstoke or /my-bookings, or a full address starting https://",
      },
      primary: {
        kind: "checkbox",
        label: "Highlight this one",
        help: "Gives it the solid orange button. Use it on one link only.",
      },
    },
  },
};
