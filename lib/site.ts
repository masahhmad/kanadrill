import type { Metadata } from "next";
import { modes, type Mode } from "./quiz";

// Set NEXT_PUBLIC_SITE_URL to the production domain; Vercel's own URL is the fallback.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteName = "Kana Drilll";

const ogImage = { url: "/og.png", width: 1200, height: 630, alt: "Kana Drilll — Hiragana & Katakana Practice" };

export const modeTitle = (mode: Mode) => modes[mode].label.replace(" ➔ ", " to ");

/** Title, description, canonical, Open Graph and Twitter tags for one page. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "en_US", siteName, url: path, title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}

export function quizMetadata(mode: Mode): Metadata {
  const { script, toKana } = modes[mode];
  const title = `${modeTitle(mode)} Quiz`;
  const description = toKana
    ? `Practice writing ${script}: turn the romaji of Japanese words into ${script}. Random questions, free, no sign-up.`
    : `Practice reading ${script}: type the romaji of Japanese words and see their English meaning. Random questions, free, no sign-up.`;
  return pageMetadata(title, description, `/${mode}`);
}
