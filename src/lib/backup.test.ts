import { describe, it, expect, beforeEach } from "vitest";
import { buildBackup, applyBackup } from "./backup";

// Oddiy in-memory localStorage (node muhitида yo'q).
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
  it("buildBackup mavjud kalitlarni yig'ади", () => {
    localStorage.setItem("webgis_progress", JSON.stringify({ "z0-1": true }));
    localStorage.setItem("active_course", JSON.stringify("english"));
    const b = buildBackup(new Date(2026, 0, 1));
    expect(b.app).toBe("MyAcademy");
    expect(b.data["webgis_progress"]).toEqual({ "z0-1": true });
    expect(b.data["active_course"]).toBe("english");
  });

  it("applyBackup yaroqсиз faylда xato beради", () => {
    expect(() => applyBackup("{}")).toThrow();
    expect(() => applyBackup('{"app":"Other","data":{}}')).toThrow();
  });

  it("applyBackup faqat ma'lум kalitlarни tiklайди", () => {
    const payload = JSON.stringify({
      app: "MyAcademy",
      version: 1,
      data: { english_quiz: { A0: { best: 3, total: 3 } }, evil_key: 1 },
    });
    applyBackup(payload);
    expect(JSON.parse(localStorage.getItem("english_quiz")!)).toEqual({ A0: { best: 3, total: 3 } });
    expect(localStorage.getItem("evil_key")).toBeNull(); // noma'lum kalit o'tказилмайди
  });

  it("buildBackup → applyBackup aylanмаси ma'lумотни saqлайди", () => {
    localStorage.setItem("finance_srs", JSON.stringify({ word: { box: 2, due: 123 } }));
    const text = JSON.stringify(buildBackup(new Date(2026, 0, 1)));
    localStorage.clear();
    applyBackup(text);
    expect(JSON.parse(localStorage.getItem("finance_srs")!)).toEqual({ word: { box: 2, due: 123 } });
  });
});
