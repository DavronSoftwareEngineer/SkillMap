// Barcha kurs JSON'lari uchun kontent validatsiyasi.
// Build oldidan ham ishlaydi (package.json: prebuild) - xato kontent deploy'ga chiqmaydi.
import { describe, it, expect } from "vitest";
import { COURSES, loadCourseModules } from "./courses";
import { validateModules, validateCourseMeta } from "../lib/content";
import type { Module, ProfessionalAssessment } from "../types";

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

describe("professional final - barcha kurslar", () => {
  COURSES.forEach((meta) => {
    it(`${meta.id} kursida bitta tashqi baholanadigan final bor`, async () => {
      const modules = await loadCourseModules(meta.id);
      const finals = modules.filter((module) => module.project?.assessment);

      expect(finals, `${meta.id}: professional assessment soni`).toHaveLength(1);
      expect(finals[0].project?.assessment?.assessorRequired).toBe(true);
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

  const validAssessment: ProfessionalAssessment = {
    id: "assessment-v1",
    version: "1.0",
    title: "Professional assessment",
    summary: "Dalil asosidagi baholash",
    passScore: 80,
    assessorRequired: true,
    criteria: [{
      id: "delivery",
      title: "Delivery",
      description: "Ishlaydigan loyiha",
      points: 100,
      minimumPoints: 60,
      indicators: ["Loyiha ishlaydi"],
      evidence: ["repo"],
    }],
    evidence: [{ id: "repo", label: "Repository", description: "Source", kind: "url", required: true }],
    criticalFails: [{ id: "broken", title: "Ishlamaydi", description: "Loyiha ishga tushmaydi" }],
    defense: { durationMinutes: 30, liveChangeMinutes: 10, format: ["Demo"], questions: ["Nega?"] },
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

  it("professional assessment jami 100 ball bo'lishi shart", () => {
    const bad = {
      ...base,
      project: {
        tag: "Final",
        title: "Capstone",
        desc: "Final loyiha",
        features: ["Demo"],
        assessment: {
          ...validAssessment,
          criteria: [{ ...validAssessment.criteria[0], points: 90 }],
        },
      },
    };
    expect(v("x", [bad]).join("\n")).toContain("jami 90 ball");
  });

  it("assessment mezoni faqat mavjud evidence'ga ishora qiladi", () => {
    const bad = {
      ...base,
      project: {
        tag: "Final",
        title: "Capstone",
        desc: "Final loyiha",
        features: ["Demo"],
        assessment: {
          ...validAssessment,
          criteria: [{ ...validAssessment.criteria[0], evidence: ["unknown"] }],
        },
      },
    };
    expect(v("x", [bad]).join("\n")).toContain("noma'lum evidence");
  });

  it("toza modul xatosiz o'tadi", () => {
    expect(v("x", [base])).toEqual([]);
  });
});

describe("kitob katalogi validatsiyasi", () => {
  const meta = {
    id: "books-test",
    name: "Books",
    brandTitle: "Books",
    brandSub: "Books",
    labels: {},
  };

  it("ISBNsiz va katalogda yo'q kitobni ushlaydi", () => {
    const errors = validateCourseMeta({
      ...meta,
      books: [{ n: 1, title: "Unknown", author: "Author", accent: "#fff", note: "Note" }],
    }, []);

    expect(errors.join("\n")).toContain("qonuniy elektron manba topilmadi");
  });

  it("noto'g'ri ISBNni ushlaydi", () => {
    const errors = validateCourseMeta({
      ...meta,
      books: [{ n: 1, title: "Book", author: "Author", isbn: "12-x", accent: "#fff", note: "Note" }],
    }, []);

    expect(errors.join("\n")).toContain("ISBN faqat 10 yoki 13 raqam");
  });
});
