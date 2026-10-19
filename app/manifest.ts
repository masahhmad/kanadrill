import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kana Drill — Latihan Hiragana & Katakana",
    short_name: "Kana Drill",
    description: "Latihan hiragana dan katakana lewat kuis kosakata acak.",
    start_url: "/",
    display: "standalone",
    background_color: "#fca742",
    theme_color: "#fca742",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
