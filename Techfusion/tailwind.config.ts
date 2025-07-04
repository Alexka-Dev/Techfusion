import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--text-primary)",
        secundary: "var(--text-secundary)",
      },
      screens: {
        xs: "375px",
        sm: "480px",
      },
      fontFamily: {
        title: ["Bebas_Neue, sans-serif"],
        tech: ["Exo_2, sans-serif"],
      },
      container: {
        center: true, // Centra automáticamente todos los contenedores
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
