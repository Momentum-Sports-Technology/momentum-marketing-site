import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chrome from "@/components/Chrome";
import { getContent } from "@/lib/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const blackMango = localFont({
  src: "../public/fonts/BlackMango-Regular.ttf",
  variable: "--font-black-mango",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://momentumnetball.co.uk"),
  title: "Momentum Netball - The South's Premier Netball League",
  description:
    "Join the action at Momentum Netball. Women's leagues, mixed leagues, coaching, and pay-to-play netball across Hampshire and the South.",
  keywords: [
    "netball",
    "Hampshire",
    "Andover",
    "mixed netball",
    "netball league",
    "women's netball",
  ],
  openGraph: {
    type: "website",
    siteName: "Momentum Netball",
    title: "Momentum Netball - The South's Premier Netball League",
    description:
      "Women's leagues, mixed leagues, coaching, and pay-to-play netball across Hampshire. Book a session or register your team.",
    url: "/",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Momentum Netball" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Momentum Netball - The South's Premier Netball League",
    description:
      "Women's leagues, mixed leagues, coaching, and pay-to-play netball across Hampshire. Book a session or register your team.",
    images: ["/images/og-image.jpg"],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { contact } = await getContent("site");

  return (
    <html lang="en" className={`${inter.variable} ${blackMango.variable}`}>
      <body className={inter.className}>
        <Chrome>
          <Navigation />
        </Chrome>
        <main>{children}</main>
        <Chrome>
          <Footer
            email={contact.email}
            reviewUrl={contact.reviewUrl}
            instagram={contact.instagram}
            facebook={contact.facebook}
            area={contact.area}
          />
        </Chrome>
      </body>
    </html>
  );
}
