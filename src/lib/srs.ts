// Leitner-uslubidagi oddiy interval takror (SRS). Tashqi bog'liqliksiz.
// Har so'z uchun: box (0..5) va due (keyingi takror vaqti, ms).
export interface SrsCard {
  box: number;
  due: number; // epoch ms
}

export type SrsState = Record<string, SrsCard>; // word -> card
export type Grade = "again" | "good" | "easy";

// Box bo'yicha interval (kunlarda). box 0 = bugun/yangi.
export const BOX_DAYS = [0, 1, 3, 7, 16, 35];
export const MAX_BOX = BOX_DAYS.length - 1;
const DAY = 24 * 60 * 60 * 1000;

// So'z "o'zlashtirilgan" deb hisoblanadi (oxirgi box).
export function isMastered(card: SrsCard | undefined): boolean {
  return !!card && card.box >= MAX_BOX;
}

// Takror vaqti kelganmi?
export function isDue(card: SrsCard | undefined, now: number): boolean {
  if (!card) return true; // hali ko'rilmagan - darhol o'rganishga tayyor
  return card.due <= now;
}

// Bahodan keyin kartaning yangi holatini hisoblaydi.
export function grade(card: SrsCard | undefined, g: Grade, now: number): SrsCard {
  const cur = card?.box ?? 0;
  let box: number;
  if (g === "again") box = 0;
  else if (g === "easy") box = Math.min(cur + 2, MAX_BOX);
  else box = Math.min(cur + 1, MAX_BOX);
  return { box, due: now + BOX_DAYS[box] * DAY };
}

// Hozir takror qilinishi kerak bo'lgan so'zlar ro'yxati (tartib: eng eskisi oldinda,
// ko'rilmaganlar oxirida - avval bilganini mustahkamlaymiz).
export function dueWords(words: string[], state: SrsState, now: number): string[] {
  return words
    .filter((w) => isDue(state[w], now))
    .sort((a, b) => (state[a]?.due ?? Infinity) - (state[b]?.due ?? Infinity));
}

export function masteredCount(words: string[], state: SrsState): number {
  return words.filter((w) => isMastered(state[w])).length;
}
