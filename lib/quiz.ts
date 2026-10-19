import { hiragana } from "./data/hiragana";
import { katakana } from "./data/katakana";
import { EXTENDED, KANA_UNITS, splitUnits, toKatakana, toRomaji } from "./kana";

// Units with no common words in that script, so they are left out of its drill.
const HIRAGANA_SKIP = ["みゅ", "ひゅ", "びゅ", "ぴゅ"];
const KATAKANA_SKIP = ["を", "ぢ", "づ", "ひゃ", "びゃ", "びょ", "ぴゃ", "みょ", "りょ"].map(toKatakana);

const SCRIPTS = {
  hiragana: {
    data: hiragana,
    units: KANA_UNITS.filter((u) => !EXTENDED.has(u) && !HIRAGANA_SKIP.includes(u)),
  },
  katakana: {
    data: katakana,
    units: KANA_UNITS.map(toKatakana).filter((u) => !KATAKANA_SKIP.includes(u)).concat("ー"),
  },
};

export const modes = {
  "hiragana-romaji": { label: "Hiragana ➔ Romaji", script: "hiragana", toKana: false },
  "romaji-hiragana": { label: "Romaji ➔ Hiragana", script: "hiragana", toKana: true },
  "katakana-romaji": { label: "Katakana ➔ Romaji", script: "katakana", toKana: false },
  "romaji-katakana": { label: "Romaji ➔ Katakana", script: "katakana", toKana: true },
} as const;

export type Mode = keyof typeof modes;
export type Word = { kana: string; meaning: string; romaji: string; units: string[] };

const WORDS = {
  hiragana: build("hiragana"),
  katakana: build("katakana"),
};

export const getWords = (mode: Mode) => WORDS[modes[mode].script];

function build(script: keyof typeof SCRIPTS): Word[] {
  const { data, units } = SCRIPTS[script];
  const words = data.map(([kana, meaning]) => ({
    kana,
    meaning,
    romaji: toRomaji(kana),
    units: [...new Set(splitUnits(kana))],
  }));
  if (process.env.NODE_ENV !== "production") validate(script, words, units);
  return words;
}

// Guards the data files: every unit drilled, nothing unknown, 2 words per unit.
function validate(script: string, words: Word[], units: string[]) {
  const allowed = new Set(units);
  const used = new Set<string>();
  const kana = new Set<string>();
  for (const w of words) {
    if (kana.has(w.kana)) throw new Error(`${script}: duplicate word ${w.kana}`);
    kana.add(w.kana);
    const parts = splitUnits(w.kana);
    if (parts.at(-1) === "っ" || parts.at(-1) === "ッ" || parts[0] === "ー") {
      throw new Error(`${script}: ${w.kana} starts with ー or ends with っ`);
    }
    for (const u of parts) {
      if (!allowed.has(u)) throw new Error(`${script}: unit ${u} in ${w.kana} is not drilled`);
      used.add(u);
    }
  }
  const missing = units.filter((u) => !used.has(u));
  if (missing.length) throw new Error(`${script}: no word uses ${missing.join(" ")}`);
  if (words.length !== units.length * 2) {
    throw new Error(`${script}: ${words.length} words, expected ${units.length * 2}`);
  }
}

/** Random word index not shown yet; `used` is cleared once every word has been shown. */
export function pickNext(words: Word[], used: Set<number>) {
  if (used.size >= words.length) used.clear();
  const left = words.map((_, i) => i).filter((i) => !used.has(i));
  return left[Math.floor(Math.random() * left.length)];
}
