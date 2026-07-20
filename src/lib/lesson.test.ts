import { describe, expect, it } from "vitest";

import {
  annotateGlossaryTerms,
  buildLessonGlossary,
  prepareLessonHtml,
} from "./lesson";

describe("dars o'qish oqimi", () => {
  it("qisqa darsni bo'limlarga ajratadi va hammasini ochiq qoldiradi", () => {
    const lesson = prepareLessonHtml(
      "<h3>Kirish</h3><p>Birinchi mavzu.</p><h3>Amaliyot</h3><p>Ikkinchi mavzu.</p><h3>Xulosa</h3><p>Yakun.</p>",
      "webgis-g0",
    );

    const template = document.createElement("template");
    template.innerHTML = lesson.html;
    const sections = Array.from(template.content.querySelectorAll("details"));

    expect(lesson.sections.map((section) => section.title)).toEqual([
      "Kirish",
      "Amaliyot",
      "Xulosa",
    ]);
    expect(lesson.readingMinutes).toBeGreaterThanOrEqual(1);
    expect(lesson.collapsible).toBe(false);
    expect(sections).toHaveLength(3);
    expect(sections.every((section) => section.hasAttribute("open"))).toBe(true);
  });

  it("uzun darsda faqat birinchi ikki bo'limni dastlab ochadi", () => {
    const html = Array.from(
      { length: 5 },
      (_, index) => `<h3>Mavzu ${index + 1}</h3><p>Izoh va amaliy misol.</p>`,
    ).join("");
    const lesson = prepareLessonHtml(html, "professional");
    const template = document.createElement("template");
    template.innerHTML = lesson.html;
    const sections = Array.from(template.content.querySelectorAll("details"));

    expect(lesson.collapsible).toBe(true);
    expect(sections.filter((section) => section.hasAttribute("open"))).toHaveLength(2);
  });

  it("modul lug'atidagi izohni ustun qo'yadi va darsdagi texnik terminlarni qo'shadi", () => {
    const glossary = buildLessonGlossary(
      [{ w: "PostGIS", uz: "Fazoviy ma'lumotlar bazasi" }],
      "<p>PostGIS API orqali GeoJSON qaytaradi.</p>",
      true,
    );

    expect(glossary.find((item) => item.term === "PostGIS")?.definition).toBe(
      "Fazoviy ma'lumotlar bazasi",
    );
    expect(glossary.some((item) => item.term === "API")).toBe(true);
    expect(glossary.some((item) => item.term === "GeoJSON")).toBe(true);
  });

  it("terminning birinchi matnli uchrashuvini izohlaydi, kodga tegmaydi", () => {
    const root = document.createElement("div");
    root.innerHTML = "<p>PostGIS spatial so'rovlarni bajaradi.</p><pre><code>PostGIS</code></pre>";

    annotateGlossaryTerms(root, [
      { term: "PostGIS", definition: "PostgreSQL spatial kengaytmasi." },
    ]);

    expect(root.querySelectorAll("abbr.lesson-inline-term")).toHaveLength(1);
    expect(root.querySelector("abbr")?.getAttribute("title")).toBe(
      "PostgreSQL spatial kengaytmasi.",
    );
    expect(root.querySelector("code")?.innerHTML).toBe("PostGIS");
  });
});
