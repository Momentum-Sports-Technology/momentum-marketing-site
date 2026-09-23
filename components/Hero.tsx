import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  image?: string;
}

/**
 * Server component on purpose. This was a client component animating every
 * block with framer-motion, which meant the markup arrived as `opacity: 0` and
 * the hero — including the LCP image — stayed invisible until the whole page
 * had hydrated. That was 7.6s of the 9.6s LCP on mobile.
 *
 * The entrance is the same fade/slide/scale with the same delays, expressed as
 * CSS keyframes (see tailwind.config.ts) so it runs off the first paint and
 * needs no JavaScript.
 */
export default function Hero({ title, subtitle, ctaText, ctaLink, badge, image }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-momentum-dark">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/momentum-hero-background.jpg"
          alt="Netball action background"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        {/* Orange hue overlay */}
        <div className="absolute inset-0 bg-momentum-orange/40" />
      </div>

      {/* Background logo offset */}
      <div className="absolute -top-[100px] -left-[150px] w-[1000px] h-[1000px] opacity-30 z-10">
        <Image
          src="/images/momentum-logo-background-white.png"
          alt=""
          fill
          sizes="1000px"
          className="object-contain"
        />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-momentum-purple/20 rounded-full blur-3xl z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-momentum-pink/20 rounded-full blur-3xl z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-up space-y-8">
            {badge && (
              <div className="animate-fade-scale [animation-duration:300ms] [animation-delay:200ms] inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
                <span className="text-sm font-semibold text-white">{badge}</span>
              </div>
            )}

            <h1 className="animate-fade-up [animation-delay:300ms] text-5xl md:text-7xl font-bold leading-tight text-white">
              {title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="animate-fade-up [animation-delay:400ms] text-xl text-white max-w-xl">
              {subtitle}
            </p>

            <div className="animate-fade-up [animation-delay:500ms] flex flex-col sm:flex-row gap-4">
              <Link
                href={ctaLink}
                className="group inline-flex items-center justify-center bg-momentum-orange text-white px-8 py-4 rounded-lg hover:shadow-2xl hover:bg-momentum-orange/90 transition-all font-semibold text-lg"
              >
                {ctaText}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="animate-fade-scale [animation-delay:600ms] relative">
            <div className="relative w-full h-72 sm:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-momentum-orange flex items-center justify-center">
                  <span className="text-white text-6xl font-bold opacity-20">M</span>
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-momentum-purple/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
