import Image from "next/image";
import Link from "next/link";

const modes = [
  { glyph: "あ", from: "Hiragana", to: "Romaji" },
  { glyph: "ka", from: "Romaji", to: "Hiragana" },
  { glyph: "ア", from: "Katakana", to: "Romaji" },
  { glyph: "sa", from: "Romaji", to: "Katakana" },
];

export default function Home() {
  return (
    <main
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-3 py-5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      <header className="relative flex flex-col items-center gap-1 p-5">
        <h1 className="text-5xl leading-[60px] font-bold tracking-[2.4px] text-[#fffef2] uppercase [-webkit-text-stroke:5px_#1e1943] [paint-order:stroke_fill] text-shadow-[4px_4px_0px_#2a2259]">
          Kana Drill
        </h1>
        <p className="rounded-full border-2 border-[#1e1943] bg-[#fffeec] px-[18px] py-1.5 text-xs leading-4 font-black tracking-[0.3px] text-[#1e1943] drop-shadow-[0px_4px_0px_#1e1943]">
          🇯🇵 Latihan Kana
        </p>
      </header>

      <section className="flex flex-col gap-3.5 px-5 py-[15px]">
        {modes.map((mode, i) => {
          const odd = i % 2 === 0;
          return (
            <article
              key={i}
              className="overflow-clip rounded-2xl border-2 border-[#1e1943] bg-[#fffdf5] p-0.5 shadow-[4px_5px_0px_0px_#281f54]"
            >
              <div
                className={`flex items-center justify-between border-b-2 border-[#1e1943] px-3 pt-1.5 pb-2 ${odd ? "bg-[#ffd276]" : "bg-[#ffc66a]"}`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`size-3.5 rounded-full border-2 border-[#1e1943] ${odd ? "bg-[#fca742]" : "bg-[#fa8f42]"}`}
                  />
                  <span className="text-[11px] leading-[16.5px] font-extrabold tracking-[0.55px] text-[#1e1943] uppercase">
                    Mode #{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 p-3.5">
                <div className="flex flex-col gap-[3px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-[#1e1943] bg-[#ffe89c] text-[#1e1943] ${mode.glyph.length > 1 ? "text-xs font-black" : "text-base font-medium"}`}
                    >
                      {mode.glyph}
                    </span>
                    <h2 className="text-base leading-[22px] font-bold text-[#1e1943]">
                      {mode.from} <span className="font-normal text-[#ff5c5c]">➔</span> {mode.to}
                    </h2>
                  </div>
                  <p className="text-xs leading-[19.5px] font-semibold text-[#374151]">
                    Tebak {mode.to} dari {mode.from}
                  </p>
                </div>
                <Link
                  href={`/${mode.from}-${mode.to}`.toLowerCase()}
                  className="flex shrink-0 items-center gap-1 rounded-full border-2 border-[#1e1943] bg-[#ffea9f] px-4 py-2.5 text-xs leading-4 font-bold text-[#1e1943] drop-shadow-[0px_3px_0px_#d89f1f] transition-transform active:translate-y-0.5"
                >
                  MULAI
                  <Image src="/play.svg" alt="" width={14} height={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
