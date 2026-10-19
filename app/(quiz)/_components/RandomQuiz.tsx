import { connection } from "next/server";
import { Suspense } from "react";
import Quiz from "./Quiz";
import { getWords, pickNext, type Mode } from "@/lib/quiz";

async function Shuffled({ mode }: { mode: Mode }) {
  await connection(); // random first word per request, nothing cached
  return <Quiz mode={mode} first={pickNext(getWords(mode), new Set())} />;
}

export default function RandomQuiz({ mode }: { mode: Mode }) {
  return (
    <Suspense>
      <Shuffled mode={mode} />
    </Suspense>
  );
}
