import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Facebook, Instagram, Mail } from "lucide-react";
import { getContent, getContentIfExists } from "@/lib/content";
import { resolveCta } from "@/lib/urls";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Momentum Netball - Links",
  description: "Everywhere Momentum Netball lives: book a session, fixtures, shop, get in touch.",
  // Opened from the Instagram bio, not from search. Indexing it would put a
  // page of bare links in front of the pages it points at.
  robots: { index: false, follow: true },
};

/**
 * The link tree for the Instagram bio (#761). Renders without the site's
 * navigation and footer — see `components/Chrome.tsx`.
 *
 * `content/links.json` is editorial: the order and the wording are marketing
 * choices, not a dump of `site.programmes`. It is edited in admin.
 */
export default async function LinksPage() {
  const content = await getContentIfExists("links");
  // Production seeds the content volume on first run only, so this file is
  // absent there until it is put in. 404 is the honest answer meanwhile.
  if (!content) notFound();

  const { contact } = await getContent("site");

  return (
    <div className="min-h-screen bg-momentum-dark text-white">
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="text-center mb-10">
          <img src="/images/logo-white.png" alt="" className="mx-auto h-16 w-16 mb-5" />
          <h1 className="font-black-mango text-3xl mb-3">{content.title}</h1>
          {content.intro && (
            <p className="text-gray-400 leading-relaxed text-sm">{content.intro}</p>
          )}
        </div>

        <ul className="space-y-3">
          {content.links.map((link) => {
            const href = resolveCta(link.href);
            const external = href.startsWith("http");
            const className = `flex min-h-[64px] flex-col justify-center rounded-xl px-5 py-3 text-center transition-all ${
              link.primary
                ? "bg-momentum-orange text-white hover:bg-momentum-orange/90 hover:shadow-lg"
                : "bg-white/10 border border-white/20 hover:bg-white/15"
            }`;

            const body = (
              <>
                <span className="font-semibold text-lg">{link.label}</span>
                {link.description && (
                  <span
                    className={`text-sm mt-0.5 ${link.primary ? "text-white/80" : "text-gray-400"}`}
                  >
                    {link.description}
                  </span>
                )}
              </>
            );

            return (
              <li key={link.href + link.label}>
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                    {body}
                  </a>
                ) : (
                  <Link href={href} className={className}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex justify-center gap-6">
          <a
            href={contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-400 hover:text-momentum-orange transition-colors"
          >
            <Instagram size={24} />
          </a>
          <a
            href={contact.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-gray-400 hover:text-momentum-orange transition-colors"
          >
            <Facebook size={24} />
          </a>
          <a
            href={`mailto:${contact.email}`}
            aria-label="Email"
            className="text-gray-400 hover:text-momentum-orange transition-colors"
          >
            <Mail size={24} />
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            momentumnetball.co.uk
          </Link>
        </p>
      </div>
    </div>
  );
}
