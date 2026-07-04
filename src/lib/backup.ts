// Barcha progress/test/lug'at/streak ma'lumotini bitta JSON faylga eksport/import.
import { COURSES } from "../data/courses";

const SUFFIXES = ["_progress", "_quiz", "_vocab", "_srs"];
const GLOBAL_KEYS = ["active_course", "myacademy_streak", "myacademy_theme"];

// Oxirgi eksport sanasi - eslatma uchun (zaxira fayliga kirmaydi).
export const LAST_BACKUP_KEY = "myacademy_last_backup";
// Shuncha kundan keyin (yoki umuman qilinmagan bo'lsa) eslatamiz.
export const REMIND_AFTER_DAYS = 14;

type BackupApp = "SkillMap" | "MyAcademy";

export interface Backup {
  app: BackupApp;
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

function allKeys(): string[] {
  const keys = [...GLOBAL_KEYS];
  COURSES.forEach((c) => SUFFIXES.forEach((s) => keys.push(c.id + s)));
  return keys;
}

export function buildBackup(now: Date): Backup {
  const data: Record<string, unknown> = {};
  allKeys().forEach((k) => {
    const raw = localStorage.getItem(k);
    if (raw != null) {
      try {
        data[k] = JSON.parse(raw);
      } catch {
        data[k] = raw;
      }
    }
  });
  return { app: "SkillMap", version: 1, exportedAt: now.toISOString(), data };
}

// Eksport faylini brauzerda yuklab beradi.
export function downloadBackup(now: Date): void {
  const blob = new Blob([JSON.stringify(buildBackup(now), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `skillmap-backup-${now.toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  markBackupDone(now);
}

// Eksport bo'lganini qayd etadi - eslatma hisoblagichi shu sanadan boshlanadi.
export function markBackupDone(now: Date): void {
  try {
    localStorage.setItem(LAST_BACKUP_KEY, now.toISOString());
  } catch {
    /* storage unavailable - ignore */
  }
}

export function loadLastBackup(): string | null {
  try {
    return localStorage.getItem(LAST_BACKUP_KEY);
  } catch {
    return null;
  }
}

// Oxirgi zaxiradan beri to'liq kunlar. Hech qachon qilinmagan bo'lsa - null.
export function daysSinceBackup(lastIso: string | null, now: Date): number | null {
  if (!lastIso) return null;
  const t = Date.parse(lastIso);
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((now.getTime() - t) / 86400000));
}

// Eslatish kerakmi: progress bor-u, zaxira eskirgan (yoki umuman yo'q) bo'lsa - true.
export function shouldRemindBackup(lastIso: string | null, now: Date, hasProgress: boolean): boolean {
  if (!hasProgress) return false;
  const days = daysSinceBackup(lastIso, now);
  return days === null || days >= REMIND_AFTER_DAYS;
}

// Birorta kursda saqlangan progress/test/srs bormi (localStorage bo'ylab).
export function hasAnyProgress(): boolean {
  try {
    return COURSES.some((c) =>
      SUFFIXES.some((s) => {
        const raw = localStorage.getItem(c.id + s);
        return raw != null && raw !== "{}" && raw !== "[]";
      })
    );
  } catch {
    return false;
  }
}

// JSON matnini tekshirib, localStorage'ga yozadi. Xato bo'lsa throw qiladi.
export function applyBackup(text: string): void {
  const parsed = JSON.parse(text) as Partial<Backup>;
  if (!parsed || (parsed.app !== "SkillMap" && parsed.app !== "MyAcademy") || typeof parsed.data !== "object") {
    throw new Error("Bu SkillMap zaxira fayli emas.");
  }
  const valid = new Set(allKeys());
  Object.entries(parsed.data as Record<string, unknown>).forEach(([k, v]) => {
    if (valid.has(k)) localStorage.setItem(k, JSON.stringify(v));
  });
}
