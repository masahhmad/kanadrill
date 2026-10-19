import { quizMetadata } from "@/lib/site";
import RandomQuiz from "../_components/RandomQuiz";

export const metadata = quizMetadata("hiragana-romaji");

export default function HiraganaRomajiPage() {
  return <RandomQuiz mode="hiragana-romaji" />;
}
