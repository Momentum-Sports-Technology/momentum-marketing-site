import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import InterestForm from "@/components/InterestForm";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Momentum Netball Basingstoke - Register your interest",
  description:
    "Momentum Netball is coming to Basingstoke. Friendly, social netball for every ability. Leave your details to hear first when booking opens.",
};

export default async function BasingstokePage() {
  const content = await getContent("basingstoke");

  return (
    <>
      <PageHeader eyebrow="Coming soon" title={content.title} subtitle={content.launchDate} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <p className="text-xl text-gray-600 leading-relaxed text-center mb-10">{content.intro}</p>

          <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8">
            <InterestForm
              source="basingstoke"
              successMessage={content.successMessage}
              smallprint={content.smallprint}
            />
          </div>

          <p className="flex items-center justify-center gap-2 text-gray-500 mt-8">
            <MapPin size={18} className="text-momentum-orange" />
            Basingstoke, Hampshire
          </p>
        </div>
      </section>
    </>
  );
}
