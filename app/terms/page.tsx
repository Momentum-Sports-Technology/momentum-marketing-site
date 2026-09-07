import type { Metadata } from "next";
import { FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Terms and Conditions - Momentum Netball",
  description: "Terms of participation in Momentum Netball leagues.",
};

const TERMS_PDF = "/docs/Momentum-TCs-V1.4-July-2025.pdf";

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms and Conditions"
        subtitle="Terms of participation in Momentum Netball leagues. Version 1.4, reviewed 12 July 2025."
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Momentum Netball Ltd provides its service on the following Terms and Conditions. When a
            team, player, or group joins Momentum Netball, or participates in a game, training
            session, or tournament we organise, the participants are forming a contract subject to
            these terms and are committing to the duration of the game, training, or tournament.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            The full terms cover acceptance, our service, health and safety at venues, team and
            player responsibilities, payments, cancellations, and conduct. Please read them before
            taking part.
          </p>
          <a
            href={TERMS_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-momentum-orange text-white px-8 py-4 rounded-lg hover:bg-momentum-orange/90 hover:shadow-lg transition-all font-semibold text-lg"
          >
            <FileText className="mr-2" size={22} />
            Read the full Terms and Conditions (PDF)
          </a>
        </div>
      </section>
    </>
  );
}
