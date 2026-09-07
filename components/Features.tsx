"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Feature {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface FeaturesProps {
  title: string;
  subtitle?: string;
  features: Feature[];
}

export default function Features({ title, subtitle, features }: FeaturesProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-momentum-orange/50 transition-all hover:shadow-xl">
                {/* Number badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-momentum-orange rounded-xl mb-6 text-white font-bold text-lg">
                  {feature.number}
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-momentum-orange transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
