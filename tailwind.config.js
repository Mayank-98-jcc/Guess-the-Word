/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#050816",
        midnight: "#0b1020",
        panel: "#11182b",
        glow: "#5eead4",
        ember: "#fb7185",
        warning: "#f59e0b",
      },
      boxShadow: {
        neon: "0 0 40px rgba(94, 234, 212, 0.15)",
      },
      fontFamily: {
        display: ['"Avenir Next"', "Montserrat", "Segoe UI", "sans-serif"],
        body: ['"Trebuchet MS"', '"Segoe UI"', "sans-serif"],
      },
      backgroundImage: {
        stars:
          "radial-gradient(circle at 20% 20%, rgba(94,234,212,0.14), transparent 28%), radial-gradient(circle at 80% 0%, rgba(251,113,133,0.16), transparent 25%), linear-gradient(160deg, #050816 0%, #0b1020 50%, #11182b 100%)",
      },
    },
  },
  plugins: [],
};
