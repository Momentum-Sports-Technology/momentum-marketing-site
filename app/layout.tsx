import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
    images: ["/images/momentum-womens.jpg"],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { contact } = await getContent("site");

  return (
    <html lang="en" className={`${inter.variable} ${blackMango.variable}`}>
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer
          email={contact.email}
          instagram={contact.instagram}
          facebook={contact.facebook}
          area={contact.area}
        />
      </body>
    </html>
  );
}
