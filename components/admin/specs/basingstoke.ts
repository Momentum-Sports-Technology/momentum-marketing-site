import type { SpecFor } from "@/components/admin/form/spec";
import type { BasingstokeContent } from "@/lib/schemas";

export const basingstokeSpec: SpecFor<BasingstokeContent> = {
  title: { kind: "text", label: "Page title" },
  launchDate: {
    kind: "text",
    label: "Day and time",
    help: "Free text shown near the top of the page, e.g. Tuesdays, 6-8pm.",
  },
  intro: { kind: "textarea", rows: 3, label: "Intro" },
  smallprint: {
    kind: "text",
    label: "Small print",
    help: "Shown under the interest form, e.g. a no-spam reassurance.",
  },
  successMessage: {
    kind: "text",
    label: "Thank you message",
    help: "Shown after someone registers their interest.",
  },
  booking: {
    kind: "optionalGroup",
    label: "Booking",
    toggleLabel: "Booking is open",
    help: "Turning it on switches the page from interest-capture to booking, so every field inside needs filling in first.",
    fields: {
      href: {
        kind: "text",
        label: "Booking link",
        placeholder: "/events/basingstoke",
        help: "A link starting /events/ goes to the booking site. Anything else is used as-is.",
      },
      ctaText: { kind: "text", label: "Button text" },
      venue: { kind: "text", label: "Venue address" },
      price: { kind: "text", label: "Price note" },
      runs: {
        kind: "text",
        label: "Dates",
        help: "Free text, e.g. Every Tuesday, 15 September to 27 October.",
      },
      interestHeading: {
        kind: "text",
        label: "Heading for people who can't make it",
        help: "Shown above the interest form once booking is open.",
      },
    },
  },
};
