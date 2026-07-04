import { describe, it, expect, beforeEach } from "vitest";
import {
  buildBackup,
  applyBackup,
  daysSinceBackup,
  shouldRemindBackup,
  hasAnyProgress,
  markBackupDone,
  loadLastBackup,
  REMIND_AFTER_DAYS,
} from "./backup";

// Oddiy in-memory localStorage (node muhitida yo'q).
class MemStorage {
  private m = new Map<string, string>();
  getItem(k: string) {
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  clear() {
    this.m.clear();
  }
}

beforeEach(() => {
  (globalThis as unknown as { localStorage: MemStorage }).localStorage = new MemStorage();
});

describe("backup", () => {
  it("buildBackup mavjud kalitlarni yig'adi", () => {
    localStorage.setItem("webgis_progress", JSON.stringify({ "z0-1": true }));
    localStorage.setItem("active_course", JSON.stringify("english"));
    const b = buildBackup(new Date(2026, 0, 1));
    expect(b.app).toBe("SkillMap");
    expect(b.data["webgis_progress"]).toEqual({ "z0-1": true });
    expect(b.data["active_course"]).toBe("english");
  });

  it("applyBackup yaroqsiz faylda xato beradi", () => {
    expect(() => applyBackup("{}")).toThrow();
    expect(() => applyBackup('{"app":"Other","data":{}}')).toThrow();
  });

  it("applyBackup faqat ma'lum kalitlarni tiklaydi", () => {
    const payload = JSON.stringify({
      app: "SkillMap",
      version: 1,
      data: { english_quiz: { A0: { best: 3, total: 3 } }, evil_key: 1 },
    });
    applyBackup(payload);
    expect(JSON.parse(localStorage.getItem("english_quiz")!)).toEqual({ A0: { best: 3, total: 3 } });
    expect(localStorage.getItem("evil_key")).toBeNull(); // noma'lum kalit o'tkazilmaydi
  });

  it("eski MyAcademy zaxira faylini ham qabul qiladi", () => {
    applyBackup(JSON.stringify({ app: "MyAcademy", version: 1, data: { webgis_progress: { "z0-1": true } } }));
    expect(JSON.parse(localStorage.getItem("webgis_progress")!)).toEqual({ "z0-1": true });
  });

  it("buildBackup -> applyBackup aylanmasi ma'lumotni saqlaydi", () => {
    localStorage.setItem("finance_srs", JSON.stringify({ word: { box: 2, due: 123 } }));
    const text = JSON.stringify(buildBackup(new Date(2026, 0, 1)));
    localStorage.clear();
    applyBackup(text);
    expect(JSON.parse(localStorage.getItem("finance_srs")!)).toEqual({ word: { box: 2, due: 123 } });
  });
});

describe("backup eslatmasi", () => {
  const NOW = new Date("2026-07-03T12:00:00Z");
  const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86400000).toISOString();

  it("daysSinceBackup to'liq kunlarni hisoblaydi", () => {
    expect(daysSinceBackup(null, NOW)).toBeNull();
    expect(daysSinceBackup("bu-sana-emas", NOW)).toBeNull();
    expect(daysSinceBackup(daysAgo(0), NOW)).toBe(0);
    expect(daysSinceBackup(daysAgo(3), NOW)).toBe(3);
  });

  it("progress bo'lmasa eslatmaydi", () => {
    expect(shouldRemindBackup(null, NOW, false)).toBe(false);
  });

  it("progress bor-u zaxira yo'q bo'lsa eslatadi", () => {
    expect(shouldRemindBackup(null, NOW, true)).toBe(true);
  });

  it("zaxira yangi bo'lsa eslatmaydi, eskirsa eslatadi", () => {
    expect(shouldRemindBackup(daysAgo(1), NOW, true)).toBe(false);
    expect(shouldRemindBackup(daysAgo(REMIND_AFTER_DAYS - 1), NOW, true)).toBe(false);
    expect(shouldRemindBackup(daysAgo(REMIND_AFTER_DAYS), NOW, true)).toBe(true);
    expect(shouldRemindBackup(daysAgo(REMIND_AFTER_DAYS + 30), NOW, true)).toBe(true);
  });

  it("markBackupDone sanani yozadi, loadLastBackup o'qiydi", () => {
    expect(loadLastBackup()).toBeNull();
    markBackupDone(NOW);
    expect(loadLastBackup()).toBe(NOW.toISOString());
  });

  it("hasAnyProgress faqat haqiqiy ma'lumotda true qaytaradi", () => {
    expect(hasAnyProgress()).toBe(false);
    localStorage.setItem("webgis_progress", "{}"); // bo'sh obyekt - progress emas
    expect(hasAnyProgress()).toBe(false);
    localStorage.setItem("english_quiz", JSON.stringify({ A0: { best: 3, total: 3 } }));
    expect(hasAnyProgress()).toBe(true);
  });
});
