module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./datas/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        lt: "var(--light-top)",
        ll: "var(--light-left)",
        ltLl: "var(--light-top), var(--light-left)",
        ltSr: "var(--light-top), var(--shade-right)",
        sr: "var(--shade-right)",
        sb: "var(--shade-bottom)",
        sbSr: "var(--shade-bottom), var(--shade-right)",
        ltLlSr: "var(--light-top), var(--light-left), var(--shade-right)",
        ltLlSb: "var(--light-top), var(--light-left), var(--shade-bottom)",
        llSb: "var(--light-left), var(--shade-bottom)",
        llSr: "var(--light-left), var(--shade-right)",
        llSbSr: "var(--light-left), var(--shade-bottom), var(--shade-right)",
        ltSbSr: "var(--light-top), var(--shade-bottom), var(--shade-right)",
        ltSb: "var(--light-top), var(--shade-bottom)",
        it: "var(--inner-top)",
        il: "var(--inner-left)",
        itIl: "var(--inner-top), var(--inner-left)",
      },
      fontFamily: {
        amethysta: ["Amethysta", "serif"],
      },
      screens: {
        "420+": "420px",
      },
    },

    colors: {
      white: "#FFF",
      black: "#000",
      champagne: {
        500: "#F9E8CA",
        600: "#ead9bb",
      },
      blue: {
        400: "#23C6E8",
        500: "#0DB6E2",
        600: "#04A5C4",
        700: "#1C93A4",
        800: "#347478",
      },
      anthracite: {
        500: "#515151",
      },
      red: {
        500: "#ff0000",
      },
      green: {
        500: "#00ff00",
      },
      magenta: {
        500: "#EB308A",
        700: "#cc2472",
      },
    },
  },
  plugins: [],
};
