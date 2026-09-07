"use client";

import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface StatsProps {
  title: string;
  subtitle?: string;
  stats: Stat[];
}

export default function Stats({ title, subtitle, stats }: StatsProps) {
  return (
    <section className="py-24 bg-momentum-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-xl text-gray-400">{subtitle}</p>}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-baseline justify-center mb-4">
                <span className="text-6xl md:text-7xl font-bold gradient-text">{stat.value}</span>
                {stat.suffix && (
                  <span className="text-4xl font-bold gradient-text ml-2">{stat.suffix}</span>
                )}
              </div>
              <p className="text-xl text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
