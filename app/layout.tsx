import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const blackMango = localFont({
  src: "../public/fonts/BlackMango-Regular.ttf",
  variable: "--font-black-mango",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Momentum Netball - The South's Premier Netball League",
  description:
    "Join the action at Momentum Netball. Mixed leagues, women's leagues, and social netball across Hampshire and the South.",
  keywords: ["netball", "Hampshire", "mixed netball", "netball league", "sports"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${blackMango.variable}`}>
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

