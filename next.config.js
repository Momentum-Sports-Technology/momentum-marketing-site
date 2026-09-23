const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "https://booking.momentumnetball.co.uk";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    // URL parity with the WordPress site. See docs/PLAN-wordpress-replacement.md.
    return [
      { source: "/my-bookings", destination: `${BOOKING_URL}/my-bookings`, permanent: true },
      // `:path+` not `:slug`: WooCommerce product URLs are two segments deep
      // (/shop/product/<slug>), which a single-segment pattern misses.
      { source: "/shop/:path+", destination: "/shop", permanent: true },
      { source: "/product/:path+", destination: "/shop", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/mixed-league", destination: "/mixed", permanent: true },
      // WooCommerce and WordPress-only paths with no equivalent here.
      { source: "/my-account", destination: "/book", permanent: true },
      { source: "/my-account/:path+", destination: "/book", permanent: true },
      { source: "/basket", destination: "/shop", permanent: true },
      { source: "/checkout", destination: "/shop", permanent: true },
      { source: "/thanks", destination: "/", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/player-of-the-season/:path+", destination: "/player-of-the-season", permanent: true },
    ];
  },
};

module.exports = nextConfig;
