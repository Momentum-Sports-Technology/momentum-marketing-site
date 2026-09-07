interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

/** Compact dark header for inner pages, sized to clear the fixed nav. */
export default function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <section className="relative bg-momentum-dark text-white pt-36 pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/momentum-hero-background.jpg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#e58f65]/30" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
        {eyebrow && (
          <p className="text-momentum-orange font-semibold uppercase tracking-widest text-sm mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-gray-200">{subtitle}</p>}
      </div>
    </section>
  );
}
