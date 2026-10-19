import type { Metadata, Viewport } from "next";
import { Fredoka, M_PLUS_Rounded_1c } from "next/font/google";
import { pageMetadata, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

// Japanese glyphs come as unicode-range slices, so no subset to preload
const kana = M_PLUS_Rounded_1c({
  variable: "--font-kana",
  weight: ["700", "900"],
  preload: false,
});

const home = pageMetadata(
  "Kana Drilll — Hiragana & Katakana Practice",
  "Free hiragana and katakana practice with random Japanese vocabulary quizzes and English meanings: hiragana to romaji, romaji to hiragana, katakana to romaji, and romaji to katakana.",
  "/",
);

export const metadata: Metadata = {
  ...home,
  metadataBase: new URL(siteUrl),
  title: { default: home.title as string, template: `%s | ${siteName}` },
  applicationName: siteName,
  keywords: [
    "hiragana practice",
    "katakana practice",
    "learn hiragana",
    "learn katakana",
    "kana quiz",
    "romaji",
    "learn Japanese",
    "Japanese vocabulary",
  ],
};

export const viewport: Viewport = {
  themeColor: "#fca742",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${kana.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
