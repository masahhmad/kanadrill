// Romaji per kana unit (hiragana keys; katakana is mapped onto them).
// First spelling is the canonical (as pronounced) one shown to users, the rest are also accepted.
const TABLE: Record<string, string[]> = {};

`あ:a い:i う:u え:e お:o か:ka き:ki く:ku け:ke こ:ko さ:sa し:shi,si す:su せ:se そ:so
た:ta ち:chi,ti つ:tsu,tu て:te と:to な:na に:ni ぬ:nu ね:ne の:no は:ha ひ:hi ふ:fu,hu へ:he ほ:ho
ま:ma み:mi む:mu め:me も:mo や:ya ゆ:yu よ:yo ら:ra り:ri る:ru れ:re ろ:ro わ:wa を:o,wo
が:ga ぎ:gi ぐ:gu げ:ge ご:go ざ:za じ:ji,zi ず:zu ぜ:ze ぞ:zo だ:da ぢ:ji,di づ:zu,du で:de ど:do
ば:ba び:bi ぶ:bu べ:be ぼ:bo ぱ:pa ぴ:pi ぷ:pu ぺ:pe ぽ:po
ふぁ:fa ふぃ:fi ふぇ:fe ふぉ:fo てぃ:ti でぃ:di うぃ:wi うぇ:we うぉ:wo しぇ:she,sye ちぇ:che,tye じぇ:je,zye`
  .split(/\s+/)
  .forEach((pair) => {
    const [kana, romaji] = pair.split(":");
    TABLE[kana] = romaji.split(",");
  });

// yoon: き + ゃ = kya, し + ゃ = sha / sya, ...
const YOON: Record<string, string> = {
  き: "ky", ぎ: "gy", に: "ny", ひ: "hy", び: "by", ぴ: "py", み: "my", り: "ry",
  し: "sh,sy", ち: "ch,ty,cy", じ: "j,zy,jy",
};
for (const [kana, heads] of Object.entries(YOON)) {
  for (const [small, vowel] of [["ゃ", "a"], ["ゅ", "u"], ["ょ", "o"]]) {
    TABLE[kana + small] = heads.split(",").map((h) => h + vowel);
  }
}

export const EXTENDED = new Set(["ふぁ", "ふぃ", "ふぇ", "ふぉ", "てぃ", "でぃ", "うぃ", "うぇ", "うぉ", "しぇ", "ちぇ", "じぇ"]);
export const KANA_UNITS = Object.keys(TABLE).concat("ん", "っ");

const toHiragana = (s: string) =>
  s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

export const toKatakana = (s: string) =>
  s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));

/** Splits a word into kana units, e.g. "キャンプ" -> ["キャ", "ン", "プ"]. */
export function splitUnits(word: string): string[] {
  const hira = toHiragana(word);
  const units: string[] = [];
  for (let i = 0; i < hira.length; ) {
    const len = TABLE[hira.slice(i, i + 2)] ? 2 : 1;
    units.push(word.slice(i, i + len));
    i += len;
  }
  return units;
}

/**
 * Accepted romaji spellings per unit, written as pronounced: っ doubles the next unit,
 * ー repeats the previous vowel, おう reads "oo" and (in hiragana) えい reads "ee".
 */
function romajiOptions(word: string): string[][] {
  const keys = splitUnits(word).map(toHiragana);
  const hiragana = !/[ァ-ー]/.test(word); // katakana loanwords keep "ei", e.g. ウェイター
  const out: string[][] = [];
  keys.forEach((key, i) => {
    if (key === "っ") return;
    const prevVowel = (out.at(-1)?.[0] ?? "").slice(-1);
    let options: string[];
    if (key === "ー") options = [prevVowel, "-"];
    else if (key === "う" && prevVowel === "o") options = ["o"];
    else if (key === "い" && prevVowel === "e" && hiragana) options = ["e"];
    else if (key === "ん") {
      const next = TABLE[keys[i + 1]]?.[0] ?? "";
      options = /^[aiueoy]/.test(next) ? ["n'", "n", "nn"] : /^[bmp]/.test(next) ? ["n", "m", "nn"] : ["n", "nn"];
    } else {
      options = TABLE[key];
      if (!options) throw new Error(`Unknown kana "${key}" in "${word}"`);
    }
    if (keys[i - 1] === "っ") {
      options = options.flatMap((r) => (r.startsWith("ch") ? ["t" + r, "c" + r] : [r[0] + r]));
    }
    out.push(options);
  });
  return out;
}

export const toRomaji = (word: string) => romajiOptions(word).map((o) => o[0]).join("");

/** Kana answer: the word itself, or same-script kana that reads the same (はなぢ / はなじ). */
export function matchesKana(word: string, input: string) {
  if (input === word) return true;
  const script = /[\u30a1-\u30fc]/.test(word) ? /^[\u30a1-\u30fc]+$/ : /^[\u3041-\u3096]+$/;
  if (!script.test(input)) return false;
  try {
    return toRomaji(input) === toRomaji(word);
  } catch {
    return false; // not a valid kana sequence, e.g. a lone small ゃ
  }
}

export function matchesRomaji(word: string, input: string) {
  const pattern = romajiOptions(word).map((o) => `(?:${o.join("|")})`).join("");
  return new RegExp(`^${pattern}$`).test(input);
}
