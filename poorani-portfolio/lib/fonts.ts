import localFont from "next/font/local";

// Font files live in lib/fonts (OFL licensed). Self-hosted via next/font: preloaded, hashed, cached immutably, with metric-matched fallbacks to cut layout shift.

export const display = localFont({
  src: [
    { path: "./fonts/big-shoulders-display-latin-700-normal.woff2", weight: "700" },
    { path: "./fonts/big-shoulders-display-latin-800-normal.woff2", weight: "800" },
    { path: "./fonts/big-shoulders-display-latin-900-normal.woff2", weight: "900" },
  ],
  variable: "--ff-display",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

export const sans = localFont({
  src: [
    { path: "./fonts/familjen-grotesk-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/familjen-grotesk-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/familjen-grotesk-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/familjen-grotesk-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--ff-sans",
  display: "swap",
});

export const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--ff-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--ff-mono",
  display: "swap",
  preload: false,
});
