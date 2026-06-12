import { describe, it, expect } from "vitest";
import { registerActivity, isAlive, EMPTY_STREAK, dayKey } from "./streak";

describe("streak.registerActivity", () => {
  it("birinchi faollik streakни 1 qiladi", () => {
    const s = registerActivity(EMPTY_STREAK, "2026-01-01");
    expect(s.current).toBe(1);
    expect(s.best).toBe(1);
    expect(s.last).toBe("2026-01-01");
  });

  it("ketma-ket kun streakни oshiradi", () => {
    let s = registerActivity(EMPTY_STREAK, "2026-01-01");
    s = registerActivity(s, "2026-01-02");
    expect(s.current).toBe(2);
    expect(s.best).toBe(2);
  });

  it("bir kunда qayta chaqирилса o'zgармайди (idempotent)", () => {
    let s = registerActivity(EMPTY_STREAK, "2026-01-01");
    const again = registerActivity(s, "2026-01-01");
    expect(again).toBe(s);
  });

  it("uzilишда streak 1 ga tushади, best saqланади", () => {
    let s = registerActivity(EMPTY_STREAK, "2026-01-01");
    s = registerActivity(s, "2026-01-02"); // current 2, best 2
    s = registerActivity(s, "2026-01-05"); // 3 kun uzilиш
    expect(s.current).toBe(1);
    expect(s.best).toBe(2);
  });
});

describe("streak.isAlive", () => {
  it("bugun yoki kecha faollik bo'lса tirik", () => {
    expect(isAlive({ last: "2026-01-10", current: 3, best: 3 }, "2026-01-10")).toBe(true);
    expect(isAlive({ last: "2026-01-09", current: 3, best: 3 }, "2026-01-10")).toBe(true);
    expect(isAlive({ last: "2026-01-08", current: 3, best: 3 }, "2026-01-10")).toBe(false);
  });
});

describe("streak.dayKey", () => {
  it("YYYY-MM-DD formatида qaytаради", () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
