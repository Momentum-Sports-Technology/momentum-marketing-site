import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";
import { BOOKING_URL } from "@/lib/urls";

interface FooterProps {
  email: string;
  reviewUrl?: string;
  instagram: string;
  facebook: string;
  area: string;
}

export default function Footer({ email, reviewUrl, instagram, facebook, area }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      heading: "Play",
      links: [
        { href: "/book", label: "Book" },
        { href: `${BOOKING_URL}/my-bookings`, label: "My Bookings" },
        { href: "/mixed", label: "Mixed League" },
        { href: "/#fixtures", label: "Fixtures & Results" },
        { href: "/#venues", label: "Venues" },
        { href: "/basingstoke", label: "Basingstoke" },
      ],
    },
    {
      heading: "Club",
      links: [
        { href: "/#about", label: "About Us" },
        { href: "/player-of-the-season", label: "Players of the Season" },
        { href: "/code-of-conduct", label: "Code of Conduct" },
        { href: "/shop", label: "Shop" },
        { href: "/#faq", label: "FAQ" },
      ],
    },
  ];

  return (
    <footer className="bg-momentum-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/images/logo-white.png" alt="" className="w-11 h-11" />
              <span className="font-bold text-xl font-black-mango">Momentum Netball</span>
            </div>
            <p className="text-gray-400 text-sm">
              Built for players and teams who care deeply, about every person and every game.
            </p>
            <div className="flex space-x-4">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-momentum-orange transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-momentum-orange transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="text-gray-400 hover:text-momentum-orange transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="font-semibold text-lg mb-4">{column.heading}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>{area}</li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">
                  Contact form
                </Link>
              </li>
              {reviewUrl && (
                <li>
                  <a
                    href={reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Leave a Google review
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Momentum Netball Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
