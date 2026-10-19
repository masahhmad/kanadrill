"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { matchesKana, matchesRomaji } from "@/lib/kana";
import { getWords, modes, pickNext, type Mode } from "@/lib/quiz";

type Status = "idle" | "correct" | "wrong";

// Progress lives only in component state: leaving the page resets it.
export default function Quiz({ mode, first }: { mode: Mode; first: number }) {
  const { label, script, toKana } = modes[mode];
  const words = getWords(mode);
  const [current, setCurrent] = useState(first);
  const [total, setTotal] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [missed, setMissed] = useState(false); // current word already counted as a mistake
  const [status, setStatus] = useState<Status>("idle");
  const [input, setInput] = useState("");
  const used = useRef(new Set<number>());
  const inputRef = useRef<HTMLInputElement>(null);

  const word = words[current];

  // Next keeps a left page alive (hidden) for back/forward; reset when it is hidden so
  // coming back starts a fresh session.
  useEffect(
    () => () => {
      used.current.clear();
      setCurrent(pickNext(words, used.current));
      setTotal(0);
      setMistakes(0);
      setMissed(false);
      setStatus("idle");
      setInput("");
    },
    [words],
  );

  function markMissed() {
    if (!missed) setMistakes((m) => m + 1);
    setMissed(true);
  }

  function next() {
    used.current.add(current);
    setCurrent(pickNext(words, used.current));
    setTotal((t) => t + 1);
    setMissed(false);
    setStatus("idle");
    setInput("");
    inputRef.current?.focus();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "correct") return next();
    const answer = input.trim();
    if (!answer) return;
    const correct = toKana ? matchesKana(word.kana, answer) : matchesRomaji(word.kana, answer.toLowerCase());
    if (correct) return setStatus("correct");
    markMissed();
    setStatus("wrong");
  }

  function giveUp() {
    markMissed();
    next();
  }

  return (
    <>
      <header className="flex items-center justify-between pt-1 pb-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border-2 border-[#3a2e2b] bg-[#fffbea] px-4 py-2 text-xs leading-4 font-bold drop-shadow-[0px_3px_0px_#3a2e2b] transition-transform active:translate-y-0.5"
        >
          <Image src="/back.svg" alt="" width={16} height={16} />
          Home
        </Link>
        <h1 className="flex items-center gap-1 rounded-full border-2 border-[#3a2e2b] bg-[#fffbea] px-3.5 py-1.5 text-xs leading-4 font-bold text-[#51387d] drop-shadow-[0px_3px_0px_#3a2e2b]">
          <span className="size-2 rounded-full bg-[#10b981]" />
          {label}
        </h1>
      </header>

      <div className="pt-2 pb-3">
        <section className="overflow-clip rounded-3xl border-3 border-[#3a2e2b] bg-[#fffdf0] p-[3px] shadow-[0px_8px_0px_0px_#3a2e2b]">
          <div className="flex items-center gap-2 border-b-3 border-[#3a2e2b] bg-[#fcd875] px-4 pt-2.5 pb-[13px]">
            <span className="size-4 rounded-full border-2 border-[#3a2e2b] bg-[#ffa73b]" />
            <span className="text-xs leading-4 font-bold tracking-[0.6px] uppercase">Question</span>
          </div>

          <div className="flex min-h-[190px] flex-col items-center justify-center p-5 text-center">
            <p className="pb-1 text-xs leading-4 font-bold tracking-[0.6px] text-[#75594c] uppercase">
              {toKana ? `Write it in ${script}:` : "Type the reading in romaji:"}
            </p>
            <p className="py-2 font-kana text-[min(3.75rem,11vw)] leading-[1.1] font-black tracking-[-1.5px] [overflow-wrap:anywhere] text-[#442b76] drop-shadow-[0px_1px_0.5px_rgba(0,0,0,0.05)]">
              {toKana ? word.romaji : word.kana}
            </p>
            {/* fixed height so the card doesn't jump when the result pill appears */}
            <div aria-live="polite" className="flex h-[34px] items-center">
              {status === "correct" && (
                <p className="rounded-full border border-[#ffa73b]/30 bg-[#ffa73b]/10 px-[13px] py-[3px] font-kana text-lg leading-7 font-bold text-[#ffa73b]">
                  {word.meaning}
                </p>
              )}
              {status === "wrong" && (
                <p className="rounded-full border border-[#e5533d]/30 bg-[#e5533d]/10 px-[13px] py-[3px] font-kana text-lg leading-7 font-bold text-[#e5533d]">
                  Wrong!
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <form onSubmit={submit} className="flex flex-col">
        <div className="py-2">
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (status === "wrong") setStatus("idle");
            }}
            readOnly={status === "correct"}
            placeholder={toKana ? `Type ${script} here...` : "Type romaji here..."}
            aria-label="Answer"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className={`h-14 w-full rounded-2xl border bg-[#fffdf0] px-4 text-center text-lg font-bold shadow-[0px_3px_0px_0px_#3a2e2b] outline-none placeholder:text-[#a79285] focus:border-[#2563eb] focus:shadow-[0px_0px_0px_4px_rgba(253,224,71,0.6),0px_3px_0px_0px_#3a2e2b] ${status === "wrong" ? "border-[#e5533d]" : "border-[#3a2e2b]"}`}
          />
        </div>

        <div className="flex flex-col gap-2.5 py-2">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-3 border-[#3a2e2b] bg-[#ffe494] py-[17px] text-base leading-6 font-bold drop-shadow-[0px_5px_0px_#3a2e2b] transition-transform active:translate-y-1"
          >
            <Image src="/check.svg" alt="" width={20} height={20} />
            {status === "correct" ? "NEXT" : "SUBMIT"}
          </button>
          {status !== "correct" && (
            <button
              type="button"
              onClick={giveUp}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border-3 border-[#3a2e2b] bg-[#fff0e2] py-[17px] text-sm leading-5 font-bold text-[#944d30] drop-shadow-[0px_5px_0px_#3a2e2b] transition-transform active:translate-y-1"
            >
              <Image src="/skip.svg" alt="" width={16} height={16} />
              GIVE UP
            </button>
          )}
        </div>
      </form>

      <footer className="pt-3 pb-2">
        <div className="flex items-center justify-between rounded-2xl border-3 border-[#3a2e2b] bg-[#fffbea] p-[15px] text-xs leading-4 font-bold drop-shadow-[0px_3px_0px_#3a2e2b]">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-[#3b82f6]" />
            Questions:
            <span className="rounded-md border-2 border-[#3a2e2b] bg-white px-2.5 py-1 text-[#1e3a8a]">
              {total}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Image src="/wrong.png" alt="" width={14} height={14} />
            Mistakes:
            <span className="rounded-md border-2 border-[#3a2e2b] bg-[#ffe4e6] px-2.5 py-1 text-[#9f1239]">
              {mistakes}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
