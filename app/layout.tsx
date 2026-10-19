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
  "Kana Drill — Latihan Hiragana & Katakana",
  "Latihan membaca dan menulis hiragana & katakana gratis lewat kuis kosakata acak lengkap dengan arti bahasa Indonesia: hiragana ke romaji, romaji ke hiragana, katakana ke romaji, dan romaji ke katakana.",
  "/",
);

export const metadata: Metadata = {
  ...home,
  metadataBase: new URL(siteUrl),
  title: { default: home.title as string, template: `%s | ${siteName}` },
  applicationName: siteName,
  keywords: [
    "latihan hiragana",
    "latihan katakana",
    "belajar hiragana",
    "belajar katakana",
    "kuis kana",
    "romaji",
    "belajar bahasa Jepang",
    "kosakata bahasa Jepang",
  ],
};

export const viewport: Viewport = {
  themeColor: "#fca742",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${fredoka.variable} ${kana.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
