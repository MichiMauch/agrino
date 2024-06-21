import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customYellow: {
          DEFAULT: '#C8D300',
          100: '#F0F4B4',  // Hinzugefügte Helligkeitsstufen
          200: '#E2E899', // Fügen Sie weitere Helligkeitsstufen hinzu, falls erforderlich
          400: '#D4DB00',  // Hinzugefügte Helligkeitsstufen
          600: '#B0B600',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
