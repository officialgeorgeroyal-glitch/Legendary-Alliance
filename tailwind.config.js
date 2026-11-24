/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080C0E",
        foreground: "#F3F4F6",
        card: {
          DEFAULT: "#0F161B",
          foreground: "#F9FAFB",
          border: "#1C2730",
        },
        gold: {
          50: "#FCF9EE",
          100: "#F7F1D6",
          200: "#EFE2AD",
          300: "#E5D07E",
          400: "#DBBE53",
          500: "#D4AF37", // Primary Legendary Gold
          600: "#B89228",
          700: "#93701E",
          800: "#75571D",
          900: "#60471C",
          950: "#36260B",
        },
        emerald: {
          500: "#059669",
          600: "#047857",
          700: "#065F46",
        },
        slate: {
          850: "#121920",
          900: "#0B1015",
          950: "#06090C",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "Georgia", "serif"],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'emerald-glow': '0 0 25px -5px rgba(5, 150, 105, 0.25)',
      }
    },
  },
  plugins: [],
};
