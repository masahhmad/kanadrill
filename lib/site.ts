import type { Metadata } from "next";
import { modes, type Mode } from "./quiz";

// Set NEXT_PUBLIC_SITE_URL to the production domain; Vercel's own URL is the fallback.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteName = "Kana Drill";

const ogImage = { url: "/og.png", width: 1200, height: 630, alt: "Kana Drill — Latihan Hiragana & Katakana" };

export const modeTitle = (mode: Mode) => modes[mode].label.replace(" ➔ ", " ke ");

/** Title, description, canonical, Open Graph and Twitter tags for one page. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "id_ID", siteName, url: path, title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}

export function quizMetadata(mode: Mode): Metadata {
  const { script, toKana } = modes[mode];
  const title = `Kuis ${modeTitle(mode)}`;
  const description = toKana
    ? `Latihan menulis ${script}: ubah romaji kosakata Jepang menjadi ${script}. Soal acak, gratis, tanpa daftar.`
    : `Latihan membaca ${script}: tebak romaji dari kosakata Jepang dan lihat artinya dalam bahasa Indonesia. Soal acak, gratis, tanpa daftar.`;
  return pageMetadata(title, description, `/${mode}`);
}
