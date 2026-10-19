import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kana Drilll — Hiragana & Katakana Practice",
    short_name: "Kana Drilll",
    description: "Hiragana and katakana practice with random vocabulary quizzes.",
    start_url: "/",
    display: "standalone",
    background_color: "#fca742",
    theme_color: "#fca742",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
