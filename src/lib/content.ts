// Kurs kontenti (JSON) uchun validatsiya - xatolarni build/test vaqtida ushlaydi.
// Har xato "kursId/zoom: xabar" ko'rinishida qaytadi; bo'sh massiv = hammasi joyida.
import type { Module } from "../types";
import type { CourseMeta } from "../data/courses";
import { getBookLink } from "./books";

const EXERCISE_TYPES = ["gap", "choice", "listen", "speak"];

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
      } else if (e.type === "speak") {
        // speak: talaffuz qilinadigan nishon matn (say) shart, answers ixtiyoriy
        if (!isNonEmptyString(e.say)) {
          err(where, `exercises[${ei}].say (talaffuz qilinadigan matn) bo'sh`);
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

    const assessment = m.project?.assessment;
    if (assessment) {
      if (!isNonEmptyString(assessment.id)) err(where, "assessment.id bo'sh");
      if (!isNonEmptyString(assessment.version)) err(where, "assessment.version bo'sh");
      if (!isNonEmptyString(assessment.title)) err(where, "assessment.title bo'sh");
      if (!Array.isArray(assessment.criteria) || assessment.criteria.length === 0) {
        err(where, "assessment.criteria bo'sh");
      }
      if (!Array.isArray(assessment.evidence) || assessment.evidence.length === 0) {
        err(where, "assessment.evidence bo'sh");
      }

      const evidenceIds = new Set<string>();
      assessment.evidence.forEach((item, ei) => {
        if (!isNonEmptyString(item.id)) err(where, `assessment.evidence[${ei}].id bo'sh`);
        else if (evidenceIds.has(item.id)) err(where, `assessment evidence id "${item.id}" takrorlangan`);
        else evidenceIds.add(item.id);
        if (!isNonEmptyString(item.label)) err(where, `assessment.evidence[${ei}].label bo'sh`);
        if (item.kind !== "url" && item.kind !== "text") {
          err(where, `assessment.evidence[${ei}].kind noma'lum`);
        }
      });

      const criterionIds = new Set<string>();
      let totalPoints = 0;
      assessment.criteria.forEach((criterion, ci) => {
        if (!isNonEmptyString(criterion.id)) err(where, `assessment.criteria[${ci}].id bo'sh`);
        else if (criterionIds.has(criterion.id)) err(where, `assessment criterion id "${criterion.id}" takrorlangan`);
        else criterionIds.add(criterion.id);
        if (!isNonEmptyString(criterion.title)) err(where, `assessment.criteria[${ci}].title bo'sh`);
        if (!Number.isInteger(criterion.points) || criterion.points <= 0) {
          err(where, `assessment.criteria[${ci}].points musbat butun son emas`);
        } else totalPoints += criterion.points;
        if (
          !Number.isInteger(criterion.minimumPoints) ||
          criterion.minimumPoints < 0 ||
          criterion.minimumPoints > criterion.points
        ) {
          err(where, `assessment.criteria[${ci}].minimumPoints chegaradan tashqarida`);
        }
        if (!Array.isArray(criterion.indicators) || !criterion.indicators.every(isNonEmptyString)) {
          err(where, `assessment.criteria[${ci}].indicators yaroqsiz`);
        }
        (criterion.evidence || []).forEach((evidenceId) => {
          if (!evidenceIds.has(evidenceId)) {
            err(where, `assessment criterion "${criterion.id}" noma'lum evidence "${evidenceId}"ga ishora qiladi`);
          }
        });
      });
      if (totalPoints !== 100) err(where, `assessment jami ${totalPoints} ball, 100 bo'lishi kerak`);
      if (
        !Number.isInteger(assessment.passScore) ||
        assessment.passScore <= 0 ||
        assessment.passScore > totalPoints
      ) {
        err(where, "assessment.passScore chegaradan tashqarida");
      }

      const criticalIds = new Set<string>();
      if (!Array.isArray(assessment.criticalFails) || assessment.criticalFails.length === 0) {
        err(where, "assessment.criticalFails bo'sh");
      }
      (assessment.criticalFails || []).forEach((item, fi) => {
        if (!isNonEmptyString(item.id)) err(where, `assessment.criticalFails[${fi}].id bo'sh`);
        else if (criticalIds.has(item.id)) err(where, `assessment critical fail id "${item.id}" takrorlangan`);
        else criticalIds.add(item.id);
        if (!isNonEmptyString(item.title)) err(where, `assessment.criticalFails[${fi}].title bo'sh`);
      });

      if (!assessment.defense || assessment.defense.durationMinutes <= 0) {
        err(where, "assessment.defense.durationMinutes yaroqsiz");
      } else {
        if (assessment.defense.liveChangeMinutes <= 0) {
          err(where, "assessment.defense.liveChangeMinutes yaroqsiz");
        }
        if (!Array.isArray(assessment.defense.format) || !assessment.defense.format.every(isNonEmptyString)) {
          err(where, "assessment.defense.format yaroqsiz");
        }
        if (!Array.isArray(assessment.defense.questions) || !assessment.defense.questions.every(isNonEmptyString)) {
          err(where, "assessment.defense.questions yaroqsiz");
        }
      }
    }
  });

  return errors;
}

// Kurs metasi: kitob katalogi va moduleBooks ko'rsatkichlarini tekshiradi.
export function validateCourseMeta(meta: CourseMeta, modules: Module[]): string[] {
  const errors: string[] = [];
  const zooms = new Set(modules.map((m) => m.zoom));
  const books = meta.books || [];
  const bookNs = new Set<number>();

  books.forEach((book, index) => {
    const where = `${meta.id}: books[${index}]`;
    if (!Number.isInteger(book.n) || book.n < 1) errors.push(`${where}: n yaroqsiz`);
    else if (bookNs.has(book.n)) errors.push(`${where}: n ${book.n} takrorlangan`);
    else bookNs.add(book.n);

    if (!isNonEmptyString(book.title)) errors.push(`${where}: title bo'sh`);
    if (!isNonEmptyString(book.author)) errors.push(`${where}: author bo'sh`);
    if (!isNonEmptyString(book.note)) errors.push(`${where}: note bo'sh`);
    if (book.isbn && !/^(?:\d{10}|\d{13})$/.test(book.isbn)) {
      errors.push(`${where}: ISBN faqat 10 yoki 13 raqam bo'lishi kerak`);
    }

    const link = getBookLink(book);
    if (!link) errors.push(`${where}: qonuniy elektron manba topilmadi`);
    else if (!/^https:\/\//.test(link.url)) errors.push(`${where}: kitob manbasi HTTPS emas`);
  });

  Object.entries(meta.moduleBooks || {}).forEach(([zoom, n]) => {
    if (!zooms.has(zoom)) errors.push(`${meta.id}: moduleBooks "${zoom}" moduli mavjud emas`);
    if (!bookNs.has(n)) errors.push(`${meta.id}: moduleBooks "${zoom}" -> ${n}-kitob mavjud emas`);
  });
  return errors;
}
