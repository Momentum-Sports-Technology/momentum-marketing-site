import type { SpecFor } from "@/components/admin/form/spec";
import type { ShopContent } from "@/lib/schemas";

export const shopSpec: SpecFor<ShopContent> = {
  title: { kind: "text", label: "Page title" },
  intro: { kind: "textarea", rows: 2, label: "Intro" },
  products: {
    kind: "list",
    label: "Products",
    itemName: "Product",
    itemLabel: (item) => String(item.name ?? ""),
    fields: {
      name: { kind: "text", label: "Name" },
      description: { kind: "textarea", rows: 3, label: "Description" },
      price: { kind: "text", label: "Price" },
      image: {
        kind: "text",
        label: "Photo",
        placeholder: "/images/shop/water-bottle.jpg",
        help: "Path to a file in the public/images folder.",
      },
      paymentLinkUrl: {
        kind: "text",
        label: "Stripe payment link",
        help: "Leaving it blank shows the product as coming soon.",
      },
    },
  },
};
