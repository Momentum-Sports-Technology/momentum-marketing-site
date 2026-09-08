"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BOOKING_URL } from "@/lib/urls";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book" },
  { href: `${BOOKING_URL}/my-bookings`, label: "My Bookings", external: true },
  { href: "/#fixtures", label: "Fixtures" },
  { href: "/player-of-the-season", label: "Players of the Season" },
  { href: "/code-of-conduct", label: "Code of Conduct" },
  { href: "/shop", label: "Shop" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Pages without a dark hero (admin) need the solid bar from the top.
  const isScrolled = scrolled || pathname.startsWith("/admin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = isScrolled
    ? "text-gray-700 hover:text-momentum-orange"
    : "text-white hover:text-momentum-orange/80";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-black/10 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src={isScrolled ? "/images/logo.png" : "/images/logo-white.png"}
              alt=""
              className="h-11 w-11"
            />
            <span
              className={`font-bold text-lg lg:text-2xl transition-colors font-black-mango ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              MOMENTUM NETBALL
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium ${linkClass}`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium ${linkClass}`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/#contact"
              className="bg-momentum-orange text-white px-5 py-3 rounded-lg hover:shadow-lg hover:bg-momentum-orange/90 transition-all font-semibold"
            >
              Contact
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className={`lg:hidden p-2 transition-colors ${linkClass}`}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 rounded-b-2xl shadow-xl">
            <div className="py-4 space-y-1">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-momentum-orange transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-momentum-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="px-4 pt-3">
                <Link
                  href="/#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-momentum-orange text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
