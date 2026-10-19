import { quizMetadata } from "@/lib/site";
import RandomQuiz from "../_components/RandomQuiz";

export const metadata = quizMetadata("romaji-katakana");

export default function RomajiKatakanaPage() {
  return <RandomQuiz mode="romaji-katakana" />;
}
