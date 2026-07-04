// Kurs kontenti (JSON) uchun validatsiya - xatolarni build/test vaqtida ushlaydi.
// Har xato "kursId/zoom: xabar" ko'rinishida qaytadi; bo'sh massiv = hammasi joyida.
import type { Module } from "../types";
import type { CourseMeta } from "../data/courses";

const EXERCISE_TYPES = ["gap", "choice", "listen"];

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function validateModules(courseId: string, modules: Module[]): string[] {
  const errors: string[] = [];
  const err = (where: string, msg: string) => errors.push(`${courseId}/${where}: ${msg}`);

  if (!Array.isArray(modules) || modules.length === 0) {
    err("-", "modullar ro'yxati bo'sh");
    return errors;
  }

  const zooms = new Set<string>();
  const taskIds = new Set<string>();

  modules.forEach((m, mi) => {
    const where = m.zoom || `#${mi}`;

    if (!isNonEmptyString(m.zoom)) err(where, "zoom bo'sh");
    else if (zooms.has(m.zoom)) err(where, "zoom takrorlangan");
    else zooms.add(m.zoom);

    if (!isNonEmptyString(m.title)) err(where, "title bo'sh");
    if (!isNonEmptyString(m.mtitle)) err(where, "mtitle bo'sh");
    if (typeof m.doc !== "string") err(where, "doc satr emas");

    (m.tasks || []).forEach((t, ti) => {
      if (!isNonEmptyString(t.id)) err(where, `tasks[${ti}].id bo'sh`);
      else if (taskIds.has(t.id)) err(where, `tasks[${ti}].id "${t.id}" kurs ichida takrorlangan`);
      else taskIds.add(t.id);
      if (!isNonEmptyString(t.html)) err(where, `tasks[${ti}].html bo'sh`);
      if (!isNonEmptyString(t.crit)) err(where, `tasks[${ti}].crit bo'sh`);
    });

    (m.quiz || []).forEach((q, qi) => {
      if (!isNonEmptyString(q.q)) err(where, `quiz[${qi}].q bo'sh`);
      if (!Array.isArray(q.a) || q.a.length < 2) {
        err(where, `quiz[${qi}].a kamida 2 variant bo'lishi kerak`);
      } else if (!Number.isInteger(q.c) || q.c < 0 || q.c >= q.a.length) {
        err(where, `quiz[${qi}].c=${q.c} variantlar chegarasidan tashqarida (0..${q.a.length - 1})`);
      }
      if (!isNonEmptyString(q.w)) err(where, `quiz[${qi}].w (izoh) bo'sh`);
    });

    (m.exercises || []).forEach((e, ei) => {
      if (!EXERCISE_TYPES.includes(e.type)) {
        err(where, `exercises[${ei}].type "${e.type}" noma'lum`);
        return;
      }
      if (!isNonEmptyString(e.q)) err(where, `exercises[${ei}].q bo'sh`);
      if (!isNonEmptyString(e.why)) err(where, `exercises[${ei}].why bo'sh`);
      if (e.type === "choice") {
        if (!Array.isArray(e.options) || e.options.length < 2) {
          err(where, `exercises[${ei}].options kamida 2 ta bo'lishi kerak`);
        } else if (
          e.correct === undefined ||
          !Number.isInteger(e.correct) ||
          e.correct < 0 ||
          e.correct >= e.options.length
        ) {
          err(where, `exercises[${ei}].correct variantlar chegarasidan tashqarida`);
        }
      } else {
        // gap / listen javob(lar)ni talab qiladi
        if (!Array.isArray(e.answers) || e.answers.length === 0 || !e.answers.every(isNonEmptyString)) {
          err(where, `exercises[${ei}].answers bo'sh`);
        }
        if (e.type === "listen" && !isNonEmptyString(e.say)) {
          err(where, `exercises[${ei}].say (o'qiladigan matn) bo'sh`);
        }
      }
    });

    (m.resources || []).forEach((r, ri) => {
      if (!/^https?:\/\//.test(r.url || "")) err(where, `resources[${ri}].url http(s) emas: "${r.url}"`);
      if (!isNonEmptyString(r.title)) err(where, `resources[${ri}].title bo'sh`);
    });

    (m.code || []).forEach((c, ci) => {
      // Variantli blokda (JS/TS almashtirgich) tepadagi code bo'sh bo'lishi mumkin.
      const hasVariants = Array.isArray(c.variants) && c.variants.length > 0;
      if (!hasVariants && !isNonEmptyString(c.code)) err(where, `code[${ci}].code bo'sh`);
      (c.variants || []).forEach((v, vi) => {
        if (!isNonEmptyString(v.code)) err(where, `code[${ci}].variants[${vi}].code bo'sh`);
        if (!isNonEmptyString(v.label)) err(where, `code[${ci}].variants[${vi}].label bo'sh`);
      });
    });

    (m.vocab || []).forEach((v, vi) => {
      if (!isNonEmptyString(v.w)) err(where, `vocab[${vi}].w bo'sh`);
      if (!isNonEmptyString(v.uz)) err(where, `vocab[${vi}].uz bo'sh`);
    });
  });

  return errors;
}

// Kurs metasi: moduleBooks ko'rsatkichlari mavjud modul va kitobga ishora qilishini tekshiradi.
export function validateCourseMeta(meta: CourseMeta, modules: Module[]): string[] {
  const errors: string[] = [];
  const zooms = new Set(modules.map((m) => m.zoom));
  const bookNs = new Set((meta.books || []).map((b) => b.n));
  Object.entries(meta.moduleBooks || {}).forEach(([zoom, n]) => {
    if (!zooms.has(zoom)) errors.push(`${meta.id}: moduleBooks "${zoom}" moduli mavjud emas`);
    if (!bookNs.has(n)) errors.push(`${meta.id}: moduleBooks "${zoom}" -> ${n}-kitob mavjud emas`);
  });
  return errors;
}
