// Barcha kurs JSON'lari uchun kontent validatsiyasi.
// Build oldidan ham ishlaydi (package.json: prebuild) - xato kontent deploy'ga chiqmaydi.
import { describe, it, expect } from "vitest";
import { COURSES, loadCourseModules } from "./courses";
import { validateModules, validateCourseMeta } from "../lib/content";
import type { Module } from "../types";

const v = validateModules;

describe("kontent validatsiyasi - barcha kurslar", () => {
  COURSES.forEach((meta) => {
    it(`${meta.id} kontenti yaroqli`, async () => {
      const modules = await loadCourseModules(meta.id);
      const errors = [...validateModules(meta.id, modules), ...validateCourseMeta(meta, modules)];
      expect(errors).toEqual([]);
    });
  });
});

describe("kontent validatsiyasi - xatolarni ushlaydi", () => {
  const base: Module = {
    zoom: "t1",
    title: "T",
    sub: "",
    coord: "",
    eyebrow: "",
    mtitle: "T",
    lede: "",
    doc: "<p>ok</p>",
    code: [],
    tasks: [],
    resources: [],
    project: null,
    quiz: [],
  };

  it("chegaradan tashqari quiz javobi xato", () => {
    const bad = { ...base, quiz: [{ q: "?", a: ["a", "b"], c: 2, w: "izoh" }] };
    expect(v("x", [bad]).join("\n")).toContain("chegarasidan tashqarida");
  });

  it("takrorlangan task id xato", () => {
    const bad = {
      ...base,
      tasks: [
        { id: "a1", html: "x", crit: "y" },
        { id: "a1", html: "x", crit: "y" },
      ],
    };
    expect(v("x", [bad]).join("\n")).toContain("takrorlangan");
  });

  it("takrorlangan zoom xato", () => {
    expect(v("x", [base, { ...base }]).join("\n")).toContain("zoom takrorlangan");
  });

  it("http bo'lmagan resurs xato", () => {
    const bad = {
      ...base,
      resources: [{ type: "doc" as const, url: "ftp://x", title: "t", desc: "", host: "" }],
    };
    expect(v("x", [bad]).join("\n")).toContain("http(s) emas");
  });

  it("choice mashqida correct chegarada bo'lishi shart", () => {
    const bad = {
      ...base,
      exercises: [{ type: "choice" as const, q: "?", options: ["a", "b"], correct: 5, why: "w" }],
    };
    expect(v("x", [bad]).join("\n")).toContain("correct");
  });

  it("toza modul xatosiz o'tadi", () => {
    expect(v("x", [base])).toEqual([]);
  });
});
