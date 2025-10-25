"use client";

import { motion } from "framer-motion";
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

export default function Hero({ title, subtitle, ctaText, ctaLink, badge, image }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-momentum-dark">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/momentum-hero-background.jpg"
          alt="Netball action background"
          className="w-full h-full object-cover"
        />
        {/* Orange hue overlay */}
        <div className="absolute inset-0 bg-[#e58f65]/40" />
      </div>

      {/* Background logo offset */}
      <div className="absolute -top-[100px] -left-[150px] w-[1000px] h-[1000px] opacity-30 z-10">
        <img
          src="/images/momentum-logo-background-white.png"
          alt="Momentum logo background"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-momentum-purple/20 rounded-full blur-3xl z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-momentum-pink/20 rounded-full blur-3xl z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20"
              >
                <span className="text-sm font-semibold text-white">{badge}</span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold leading-tight text-white"
            >
              {title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-white max-w-xl"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href={ctaLink}
                className="group inline-flex items-center justify-center bg-momentum-orange text-white px-8 py-4 rounded-lg hover:shadow-2xl hover:bg-momentum-orange/90 transition-all font-semibold text-lg"
              >
                {ctaText}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-momentum-orange flex items-center justify-center">
                  <span className="text-white text-6xl font-bold opacity-20">M</span>
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-momentum-purple/20 to-transparent" />
            </div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-momentum-orange rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">4.9</span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Player Rating</p>
                  <p className="font-semibold text-white">Trusted by 100+ players</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

