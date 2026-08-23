import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Palette Kagette : beige / marron / vert forêt (#2C4F3E).
        // Les clés historiques (framboise/feuille/mangue/prune/creme) sont
        // conservées pour ne pas retoucher chaque composant — seules les
        // valeurs hexadécimales changent de sens.
        kagette: {
          framboise: {
            // vert forêt — couleur de marque principale (CTA, liens, accent produits)
            50: "#eef3f0",
            100: "#d7e5dd",
            300: "#7fa38d",
            500: "#2C4F3E",
            600: "#213c2f",
            700: "#172a20",
          },
          feuille: {
            // marron — accent secondaire (catégorie fruits)
            50: "#f7f1e8",
            100: "#e9dac0",
            300: "#c39a63",
            500: "#8a5a35",
            600: "#6e4527",
          },
          mangue: {
            // beige tan — accent tertiaire (badges, callouts)
            50: "#faf5ea",
            300: "#e3cd9e",
            500: "#cdb478",
            600: "#a88f56",
          },
          prune: {
            // marron foncé — texte
            500: "#5c4530",
            700: "#3b2a1c",
            900: "#241a10",
          },
          creme: "#f7f1e3",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // "serif" = police display (Poppins, gras) pour les titres — nom
        // conservé pour ne pas renommer les classes déjà posées.
        serif: ["var(--font-serif)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
