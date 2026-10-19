import { quizMetadata } from "@/lib/site";
import RandomQuiz from "../_components/RandomQuiz";

export const metadata = quizMetadata("katakana-romaji");

export default function KatakanaRomajiPage() {
  return <RandomQuiz mode="katakana-romaji" />;
}
