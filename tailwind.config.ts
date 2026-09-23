import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        momentum: {
          orange: "#ba521f",
          // Same brand hue, kept light for text and icons on momentum-dark.
          // No single orange clears 4.5:1 on both white and #1A1A2E.
          "orange-on-dark": "#e58f65",
          purple: "#6B46C1",
          pink: "#E91E63",
          blue: "#2563EB",
          dark: "#1A1A2E",
          light: "#F8F9FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        "black-mango": ["var(--font-black-mango)", "sans-serif"],
      },
      keyframes: {
        // The hero's entrance, previously framer-motion. As CSS it runs off the
        // first paint instead of waiting for hydration.
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-scale": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-scale": "fade-scale 0.8s ease-out both",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-momentum": "linear-gradient(135deg, #ba521f 0%, #E91E63 100%)",
        "gradient-momentum-alt": "linear-gradient(135deg, #6B46C1 0%, #ba521f 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
