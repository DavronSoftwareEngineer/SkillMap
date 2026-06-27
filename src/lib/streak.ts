// Kunlik odat (streak) hisoblagichi - barcha kurslar uchun umumiy.
export interface Streak {
  last: string; // oxirgi faol kun "YYYY-MM-DD"
  current: number;
  best: number;
}

export const EMPTY_STREAK: Streak = { last: "", current: 0, best: 0 };

// Mahalliy vaqt bo'yicha "YYYY-MM-DD".
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function diffDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

// Bugun faollik qayd etilganda streakni yangilaydi.
// Bir kunda necha marta chaqirilsa ham natija o'zgarmaydi (idempotent).
export function registerActivity(s: Streak, today: string): Streak {
  if (s.last === today) return s; // bugun allaqachon hisoblangan
  let current: number;
  if (!s.last) current = 1;
  else {
    const gap = diffDays(s.last, today);
    if (gap === 1) current = s.current + 1; // ketma-ket kun
    else if (gap <= 0) return s; // kelajak/o'tmish anomaliyasi - tegmaymiz
    else current = 1; // uzilish - qaytadan
  }
  return { last: today, current, best: Math.max(s.best, current) };
}

// Streak hali "tirik"mi (bugun yoki kecha faollik bo'lgan)?
export function isAlive(s: Streak, today: string): boolean {
  if (!s.last) return false;
  return diffDays(s.last, today) <= 1;
}
