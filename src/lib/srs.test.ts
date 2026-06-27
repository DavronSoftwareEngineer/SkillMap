import { describe, it, expect } from "vitest";
import { grade, isDue, isMastered, dueWords, masteredCount, BOX_DAYS, MAX_BOX } from "./srs";

const DAY = 86400000;
const T0 = 1_700_000_000_000; // sobit "hozir"

describe("srs.grade", () => {
  it("yangi so'z 'good' baholansa box 1 ga o'tadi", () => {
    const c = grade(undefined, "good", T0);
    expect(c.box).toBe(1);
    expect(c.due).toBe(T0 + BOX_DAYS[1] * DAY);
  });

  it("'again' har doim box 0 ga qaytaradi", () => {
    const c = grade({ box: 4, due: T0 }, "again", T0);
    expect(c.box).toBe(0);
    expect(c.due).toBe(T0);
  });

  it("'easy' ikki box oshiradi, MAX_BOX dan oshmaydi", () => {
    expect(grade({ box: 1, due: 0 }, "easy", T0).box).toBe(3);
    expect(grade({ box: MAX_BOX - 1, due: 0 }, "easy", T0).box).toBe(MAX_BOX);
  });
});

describe("srs.isDue / isMastered", () => {
  it("ko'rilmagan so'z (undefined) doim due", () => {
    expect(isDue(undefined, T0)).toBe(true);
  });
  it("kelajakdagi due hali kelmagan", () => {
    expect(isDue({ box: 1, due: T0 + DAY }, T0)).toBe(false);
    expect(isDue({ box: 1, due: T0 - 1 }, T0)).toBe(true);
  });
  it("oxirgi box - o'zlashtirilgan", () => {
    expect(isMastered({ box: MAX_BOX, due: 0 })).toBe(true);
    expect(isMastered({ box: 1, due: 0 })).toBe(false);
  });
});

describe("srs.dueWords / masteredCount", () => {
  const words = ["a", "b", "c"];
  const state = {
    a: { box: 1, due: T0 + DAY }, // hali kelmagan
    b: { box: 2, due: T0 - DAY }, // due
    // c - ko'rilmagan -> due
  };
  it("faqat due so'zlarni qaytaradi", () => {
    const due = dueWords(words, state, T0);
    expect(due).toContain("b");
    expect(due).toContain("c");
    expect(due).not.toContain("a");
  });
  it("masteredCount o'zlashtirilganni sanaydi", () => {
    expect(masteredCount(words, { a: { box: MAX_BOX, due: 0 } })).toBe(1);
  });
});
