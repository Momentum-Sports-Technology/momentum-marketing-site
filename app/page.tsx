"use client";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Calendar, Trophy, Star } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero
        title="The South's Premier
Netball League"
        subtitle="Welcome to Momentum Netball – join the action today!"
        ctaText="Book a Session"
        ctaLink="#leagues"
        badge="500+ Active Players"
        image="/images/momentum-womens.jpg"
      />

      <section id="leagues" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600">
              Momentum Netball offers competitive leagues for players of all abilities across Hampshire and surrounding areas. From mixed leagues to women's competitions, with flexible booking and welcoming communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link
              href="/mixed"
              className="group bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-momentum-orange"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-momentum-orange rounded-2xl mb-6">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 group-hover:text-momentum-orange transition-all">
                Momentum Mixed
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Our flagship mixed-gender league. Open to all abilities, with flexible team options and multiple Hampshire venues. Competitive yet social netball for everyone.
              </p>
              <span className="inline-flex items-center text-momentum-orange font-semibold group-hover:translate-x-2 transition-transform">
                Book Now →
              </span>
            </Link>

            <div className="bg-white p-10 rounded-3xl shadow-lg border-2 border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-2xl mb-6">
                <span className="text-gray-400 font-bold text-2xl">W</span>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-400">Women's Leagues</h3>
              <p className="text-gray-500 text-lg mb-6">
                Traditional women's netball leagues and competitions. Full details, booking, and results available on our main Momentum Netball website.
              </p>
              <a href="https://momentumnetball.co.uk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-400 hover:text-momentum-orange font-semibold transition-colors">
                Visit Main Site →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Stats
        title="Results"
        subtitle="Join Hampshire's growing netball community"
        stats={[
          { value: "500", suffix: "+", label: "Active Players" },
          { value: "40", suffix: "+", label: "Weekly Sessions" },
          { value: "8", label: "Venues Across Hampshire" },
        ]}
      />

      {/* Venues Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Us</h2>
            <p className="text-xl text-gray-600">
              Multiple venues across Hampshire and surrounding areas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Hampshire", description: "Multiple indoor venues" },
              { name: "Surrounding Areas", description: "Expanding coverage" },
              { name: "Indoor Courts", description: "Year-round playing" },
            ].map((venue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-200"
              >
                <MapPin className="mx-auto mb-4 text-momentum-orange" size={32} />
                <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
                <p className="text-gray-600">{venue.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Players of the Season */}
      <section className="py-24 bg-gradient-to-br from-momentum-light to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-momentum-orange rounded-2xl mb-6">
              <Trophy className="text-white" size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Players of the Season</h2>
            <p className="text-xl text-gray-600">
              Celebrating outstanding achievements and commitment across our leagues
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200">
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-lg">
                Momentum Netball recognises players who demonstrate exceptional skill, sportsmanship,
                and dedication throughout the season.
              </p>
              <p className="text-gray-600">
                Winners are announced at our end-of-season celebrations. Visit our main website to
                see current award winners and league standings.
              </p>
              <Link
                href="https://momentumnetball.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-momentum-orange hover:text-momentum-orange/80 font-semibold transition-colors"
              >
                View Awards →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Code of Conduct */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Code of Conduct</h2>
              <p className="text-xl text-gray-600">
                Momentum Netball is committed to providing a safe, welcoming, and inclusive
                environment for all players
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Respect all players, officials, and spectators",
                "Maintain sportsmanship and fair play",
                "Follow safety guidelines and rules",
                "Be inclusive and welcoming to all",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-3 bg-gray-50 p-6 rounded-xl"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-momentum-orange rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <p className="text-gray-700 font-medium">{item}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-8"
            >
              <Link
                href="https://momentumnetball.co.uk/code-of-conduct"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-momentum-orange hover:text-momentum-orange/80 font-semibold transition-colors"
              >
                Read Full Code of Conduct →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-momentum-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Players Say</h2>
            <p className="text-xl text-gray-300">
              Join a community of players who love the game
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "Momentum Mixed has been amazing! So welcoming and fun. Made great friends through netball.",
                author: "Sarah M.",
                rating: 5,
              },
              {
                quote:
                  "Love that it's flexible - can come as a team or individually. Perfect for my schedule.",
                author: "James T.",
                rating: 5,
              },
              {
                quote:
                  "Best netball league in Hampshire. Competitive but friendly, and venues are convenient.",
                author: "Emma K.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-momentum-orange fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <p className="text-sm text-gray-400 font-semibold">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQ
        title="Common Questions"
        items={[
          {
            question: "Who can play at Momentum Netball?",
            answer:
              "Momentum welcomes players of all abilities and genders. Our mixed leagues are open to everyone, while our women's leagues offer traditional netball competitions. Whether you're completely new to netball or have years of experience, there's a place for you.",
          },
          {
            question: "How do I book a session?",
            answer:
              "Booking is easy through our online booking system. Visit momentumnetball.co.uk for women's leagues or mixed-league.momentumnetball.co.uk for mixed sessions. You can book as a team or as an individual player.",
          },
          {
            question: "Where are the venues?",
            answer:
              "We operate across multiple venues in Hampshire and surrounding areas. Sessions take place at indoor sports halls and netball facilities with proper court markings and equipment. Check our booking system for specific venue locations.",
          },
          {
            question: "What is the cost?",
            answer:
              "Pricing varies by venue and session type, typically ranging from £5-8 per person per session. All fees cover court hire, equipment (bibs and balls), and organisation. Team bookings may have different rates than individual places.",
          },
          {
            question: "Do I need to bring a team?",
            answer:
              "Not at all! Individual players are very welcome. We help arrange teams or integrate individual players into existing teams. Many of our regular teams formed when individuals met through Momentum sessions.",
          },
          {
            question: "What should I bring?",
            answer:
              "Just comfortable sports clothing and non-marking indoor trainers (court shoes). We provide bibs and match balls. Proper netball trainers are great but not essential – any sports trainers will work to get started.",
          },
        ]}
      />
    </>
  );
}

