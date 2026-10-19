import { quizMetadata } from "@/lib/site";
import RandomQuiz from "../_components/RandomQuiz";

export const metadata = quizMetadata("romaji-hiragana");

export default function RomajiHiraganaPage() {
  return <RandomQuiz mode="romaji-hiragana" />;
}
