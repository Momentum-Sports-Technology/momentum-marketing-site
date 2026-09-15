import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Programme } from "@/lib/content";
import { resolveCta } from "@/lib/urls";

interface ProgrammeCardProps {
  programme: Programme;
  compact?: boolean;
}

export default function ProgrammeCard({ programme, compact = false }: ProgrammeCardProps) {
  const href = resolveCta(programme.ctaHref);
  const external = href.startsWith("http");
  const initial = programme.name.charAt(0);

  const cta = (
    <span className="mt-auto inline-flex items-center text-momentum-orange font-semibold group-hover:translate-x-2 transition-transform">
      {programme.ctaText}
      <ArrowRight className="ml-2" size={18} />
    </span>
  );

  const body = (
    <>
      <div className="inline-flex items-center justify-center w-14 h-14 bg-momentum-orange rounded-2xl mb-5">
        <span className="text-white font-bold text-2xl">{initial}</span>
      </div>
      <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
        {programme.tagline}
      </p>
      <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-momentum-orange transition-colors">
        {programme.name}
      </h3>
      <p className={`text-gray-600 mb-5 ${compact ? "text-base" : "text-lg"}`}>
        {programme.description}
      </p>
      {programme.price && !compact && (
        <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
          {programme.price}
        </p>
      )}
      {cta}
    </>
  );

  const className =
    "group flex flex-col h-full bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-momentum-orange";

  return external ? (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}
