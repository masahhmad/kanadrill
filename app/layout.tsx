import type { Metadata } from "next";
import { Fredoka, M_PLUS_Rounded_1c } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Kana Drill",
  description: "Latihan Hiragana dan Katakana",
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
