import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop - Momentum Netball",
  description: "Momentum Netball kit and accessories.",
};

export default async function ShopPage() {
  const shop = await getContent("shop");

  return (
    <>
      <PageHeader eyebrow="Kit" title={shop.title} subtitle={shop.intro} />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {shop.products.map((product) => (
              <div
                key={product.name}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={64} />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-4 flex-1">{product.description}</p>
                  <p className="text-2xl font-bold mb-4">{product.price}</p>
                  {product.paymentLinkUrl ? (
                    <a
                      href={product.paymentLinkUrl}
                      className="inline-flex items-center justify-center bg-momentum-orange text-white px-6 py-3 rounded-lg hover:bg-momentum-orange/90 hover:shadow-lg transition-all font-semibold"
                    >
                      Buy now
                    </a>
                  ) : (
                    <span className="inline-flex items-center justify-center bg-gray-200 text-gray-500 px-6 py-3 rounded-lg font-semibold">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
