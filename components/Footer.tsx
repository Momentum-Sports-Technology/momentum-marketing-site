import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-momentum-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-momentum rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl">Momentum Netball</span>
            </div>
            <p className="text-gray-400 text-sm">
              Built for players and teams who care deeply—about every person and every game.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/momentumnetball"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-momentum-pink transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/momentumnetball"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-momentum-pink transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="mailto:hello@momentumnetball.co.uk"
                className="text-gray-400 hover:text-momentum-pink transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/mixed" className="text-gray-400 hover:text-white transition-colors">
                  Mixed League
                </Link>
              </li>
              <li>
                <Link href="/#venues" className="text-gray-400 hover:text-white transition-colors">
                  Venues
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/code-of-conduct"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Hampshire & Surrounding Areas</li>
              <li>
                <a
                  href="mailto:hello@momentumnetball.co.uk"
                  className="hover:text-white transition-colors"
                >
                  hello@momentumnetball.co.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Momentum Netball Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
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

