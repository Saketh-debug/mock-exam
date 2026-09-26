export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          deep: "#264653",
          teal: "#2A9D8F",
          gold: "#E9C46A",
          orange: "#F4A261",
          coral: "#E76F51",
          dark: "#122027",
        },
        forest: "#163832",
        coral: "#E76F51",
        teal: "#2A9D8F",
        gold: "#E9C46A",
        orange: "#F4A261",
        mint: "#AFE7D9",
        "soft-mint": "#B9DED8",
        "pale-mint": "#E8F4F1",
        "soft-coral": "#E8C2B5",
        "mint-border": "#D7EAE5",
        warm: {
          bg: "#122027",
          surface: "#1B313B",
          elevated: "#264653",
          white: "#FAFAF9",
          border: "rgba(42, 157, 143, 0.25)",
          "border-hover": "#2A9D8F",
        },
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Space Grotesk", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        editorial: ["Plus Jakarta Sans", "Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
}
