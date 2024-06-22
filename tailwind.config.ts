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
          100: '#F0F4B4',
          200: '#E2E899',
          400: '#D4DB00',
          600: '#B0B600',
        },
      },
      backdropBlur: {
        sm: '4px', // Hier können Sie die Weichzeichnung anpassen
      },
    },
  },
  plugins: [],
};

export default config;
