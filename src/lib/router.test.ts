import { describe, it, expect } from "vitest";
import { parseHash, buildHash, VIEW_NAMES } from "./router";

const IDS = ["webgis", "english", "russian"];

describe("router - parseHash", () => {
  it("bo'sh hash - bo'sh marshrut", () => {
    expect(parseHash("", IDS)).toEqual({ courseId: null, view: null, zoom: null });
    expect(parseHash("#", IDS)).toEqual({ courseId: null, view: null, zoom: null });
    expect(parseHash("#/", IDS)).toEqual({ courseId: null, view: null, zoom: null });
  });

  it("faqat kurs - zoom ham view ham yo'q (1-modul)", () => {
    expect(parseHash("#webgis", IDS)).toEqual({ courseId: "webgis", view: null, zoom: null });
  });

  it("kurs + zoom", () => {
    expect(parseHash("#webgis/z5", IDS)).toEqual({ courseId: "webgis", view: null, zoom: "z5" });
  });

  it("kurs + nomlangan ko'rinish", () => {
    VIEW_NAMES.forEach((v) => {
      expect(parseHash(`#english/${v}`, IDS)).toEqual({ courseId: "english", view: v, zoom: null });
    });
  });

  it("noma'lum kurs - yaroqsiz marshrut", () => {
    expect(parseHash("#nomalum/z5", IDS)).toEqual({ courseId: null, view: null, zoom: null });
  });

  it("kirillcha zoom kodlangan holda ishlaydi", () => {
    const h = buildHash("russian", "Алф");
    expect(parseHash(h, IDS)).toEqual({ courseId: "russian", view: null, zoom: "Алф" });
  });

  it("buzuq percent-encoding yiqilmaydi", () => {
    expect(() => parseHash("#webgis/%E0%A4%A", IDS)).not.toThrow();
  });
});

describe("router - buildHash", () => {
  it("maqsadsiz - faqat kurs", () => {
    expect(buildHash("webgis", null)).toBe("#webgis");
  });

  it("zoom va view bilan", () => {
    expect(buildHash("webgis", "z5")).toBe("#webgis/z5");
    expect(buildHash("english", "dash")).toBe("#english/dash");
  });

  it("parseHash(buildHash(...)) aylanmasi o'zgarmas", () => {
    const r = parseHash(buildHash("english", "flash"), IDS);
    expect(r).toEqual({ courseId: "english", view: "flash", zoom: null });
  });
});
