// Barcha progress/test/lug'at/streak ma'lumotini bitta JSON faylga eksport/import.
import { COURSES } from "../data/courses";

const SUFFIXES = ["_progress", "_quiz", "_vocab", "_srs"];
const GLOBAL_KEYS = ["active_course", "myacademy_streak"];

export interface Backup {
  app: "MyAcademy";
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
  return { app: "MyAcademy", version: 1, exportedAt: now.toISOString(), data };
}

// Eksport faylini brauzerda yuklab beradi.
export function downloadBackup(now: Date): void {
  const blob = new Blob([JSON.stringify(buildBackup(now), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `myacademy-backup-${now.toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// JSON matnini tekshirib, localStorage'ga yozadi. Xato bo'lsa throw qiladi.
export function applyBackup(text: string): void {
  const parsed = JSON.parse(text) as Partial<Backup>;
  if (!parsed || parsed.app !== "MyAcademy" || typeof parsed.data !== "object") {
    throw new Error("Bu MyAcademy zaxira fayli emas.");
  }
  const valid = new Set(allKeys());
  Object.entries(parsed.data as Record<string, unknown>).forEach(([k, v]) => {
    if (valid.has(k)) localStorage.setItem(k, JSON.stringify(v));
  });
}
