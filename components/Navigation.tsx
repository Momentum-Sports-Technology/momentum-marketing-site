"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mixed", label: "Mixed League" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span
              className={`font-bold text-2xl md:text-3xl transition-colors font-black-mango ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              MOMENTUM NETBALL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  isScrolled
                    ? "text-gray-700 hover:text-momentum-orange"
                    : "text-white hover:text-momentum-orange/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/mixed#register"
              className="bg-momentum-orange text-white px-6 py-3 rounded-lg hover:shadow-lg hover:bg-momentum-orange/90 transition-all font-semibold"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled
                ? "text-gray-700 hover:text-momentum-orange"
                : "text-white hover:text-momentum-orange/80"
            }`}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="py-4 space-y-4">
                {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-momentum-orange transition-colors"
                >
                  {link.label}
                </Link>
                ))}
                <div className="px-4">
                  <Link
                    href="/mixed#register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center bg-gradient-momentum text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

