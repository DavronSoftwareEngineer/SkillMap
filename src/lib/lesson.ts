export interface LessonSection {
  id: string;
  title: string;
}

export interface PreparedLesson {
  html: string;
  sections: LessonSection[];
  readingMinutes: number;
  wordCount: number;
  collapsible: boolean;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const CORE_TECH_GLOSSARY: GlossaryTerm[] = [
  { term: "vector tile", definition: "Xaritani tez chizish uchun kichik tilelarga bo'lingan vektor ma'lumot." },
  { term: "observability", definition: "Log, metric va trace orqali tizim ichki holatini tushunish qobiliyati." },
  { term: "idempotency", definition: "Bir xil so'rov takrorlansa ham natija buzilmasligi yoki ikki marta bajarilmasligi." },
  { term: "benchmark", definition: "Tezlik, xotira yoki hajmni takrorlanadigan usulda o'lchash." },
  { term: "deployment", definition: "Ilovani tekshirilgan muhitga chiqarish jarayoni." },
  { term: "pipeline", definition: "Ma'lumot yoki kod ketma-ket bosqichlardan o'tadigan avtomatlashtirilgan jarayon." },
  { term: "GeoJSON", definition: "Geometriya va atributlarni JSON ko'rinishida almashish formati." },
  { term: "PostGIS", definition: "PostgreSQL uchun geometriya, indeks va spatial query imkoniyatlarini beruvchi kengaytma." },
  { term: "raster", definition: "Hududni piksel kataklari orqali ifodalovchi fazoviy ma'lumot." },
  { term: "cache", definition: "Qayta hisoblashni kamaytirish uchun vaqtincha saqlanadigan natija." },
  { term: "queue", definition: "Uzoq yoki asinxron ishlarni navbat bilan bajarish mexanizmi." },
  { term: "CRS", definition: "Koordinatalarning Yer yuzasidagi o'rni va o'lchovini belgilovchi tizim." },
  { term: "STAC", definition: "Fazoviy-vaqtli assetlar katalogi va qidiruvi uchun ochiq spetsifikatsiya." },
  { term: "COG", definition: "HTTP range request bilan qisman o'qiladigan optimallashtirilgan GeoTIFF." },
  { term: "RBAC", definition: "Ruxsatlarni foydalanuvchi roli orqali boshqarish modeli." },
  { term: "ADR", definition: "Muhim arxitektura qarori, sababi va oqibatini yozib boruvchi hujjat." },
  { term: "SLO", definition: "Xizmat sifati uchun o'lchanadigan maqsad ko'rsatkichi." },
  { term: "API", definition: "Dasturlar o'rtasida aniq contract orqali muloqot qilish interfeysi." },
];

export function prepareLessonHtml(html: string, idPrefix: string): PreparedLesson {
  const template = document.createElement("template");
  template.innerHTML = html;

  const wordCount = countWords(template.content.textContent || "");
  const headings = Array.from(template.content.querySelectorAll<HTMLHeadingElement>("h3"));
  const safePrefix = idPrefix.replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "");
  const sections = headings.map((heading, index) => ({
    id: `${safePrefix || "lesson"}-section-${index + 1}`,
    title: heading.textContent?.trim() || `Bo'lim ${index + 1}`,
  }));
  const collapsible = sections.length >= 5 || wordCount >= 700;

  const plans = headings.map((heading) => {
    const content: ChildNode[] = [];
    let node = heading.nextSibling;
    while (node && !(node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === "H3")) {
      content.push(node);
      node = node.nextSibling;
    }
    return { heading, content };
  });

  plans.forEach(({ heading, content }, index) => {
    const parent = heading.parentNode;
    if (!parent) return;

    const details = document.createElement("details");
    details.className = "lesson-section";
    details.id = sections[index].id;
    details.dataset.sectionIndex = String(index);
    if (!collapsible || index < 2) details.open = true;

    const summary = document.createElement("summary");
    const number = document.createElement("span");
    const title = document.createElement("span");
    const chevron = document.createElement("span");
    number.className = "lesson-section-number";
    number.textContent = String(index + 1).padStart(2, "0");
    title.className = "lesson-section-title";
    title.innerHTML = heading.innerHTML;
    chevron.className = "lesson-section-chevron";
    chevron.setAttribute("aria-hidden", "true");
    summary.append(number, title, chevron);

    const body = document.createElement("div");
    body.className = "lesson-section-body";
    content.forEach((item) => body.appendChild(item));

    parent.insertBefore(details, heading);
    heading.remove();
    details.append(summary, body);
  });

  return {
    html: template.innerHTML,
    sections,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 170)),
    wordCount,
    collapsible,
  };
}

export function stripHtml(html: string): string {
  const template = document.createElement("template");
  template.innerHTML = html;
  return (template.content.textContent || "").replace(/\s+/g, " ").trim();
}

export function buildLessonGlossary(
  moduleTerms: Array<{ w: string; uz: string; ex?: string }>,
  lessonHtml: string,
  includeTechTerms: boolean,
): GlossaryTerm[] {
  const lessonText = stripHtml(lessonHtml).toLocaleLowerCase();
  const candidates: GlossaryTerm[] = moduleTerms
    .filter((item) => item.w.trim().length >= 3)
    .map((item) => ({
      term: item.w.trim(),
      definition: `${item.uz.trim()}${item.ex?.trim() ? ` Misol: ${item.ex.trim()}` : ""}`,
    }));

  if (includeTechTerms) {
    candidates.push(
      ...CORE_TECH_GLOSSARY.filter((item) => lessonText.includes(item.term.toLocaleLowerCase())),
    );
  }

  const unique = new Map<string, GlossaryTerm>();
  candidates.forEach((item) => {
    const key = item.term.toLocaleLowerCase();
    if (!unique.has(key)) unique.set(key, item);
  });
  return Array.from(unique.values()).slice(0, 8);
}

export function annotateGlossaryTerms(root: HTMLElement, glossary: GlossaryTerm[]): void {
  [...glossary]
    .sort((a, b) => b.term.length - a.term.length)
    .forEach(({ term, definition }) => {
      if (term.length < 3) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();

      while (current) {
        const parent = current.parentElement;
        if (parent && !parent.closest("pre, code, a, button, abbr, summary, .chip, .codehead")) {
          const match = findWholeTerm(current.textContent || "", term);
          if (match) {
            const text = current.textContent || "";
            const fragment = document.createDocumentFragment();
            const abbr = document.createElement("abbr");
            abbr.className = "lesson-inline-term";
            abbr.textContent = text.slice(match.index, match.index + match.length);
            abbr.title = definition;
            abbr.dataset.definition = definition;
            abbr.tabIndex = 0;
            abbr.setAttribute("aria-label", `${abbr.textContent}: ${definition}`);
            fragment.append(text.slice(0, match.index), abbr, text.slice(match.index + match.length));
            current.parentNode?.replaceChild(fragment, current);
            return;
          }
        }
        current = walker.nextNode();
      }
    });
}

function countWords(text: string): number {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized ? normalized.split(" ").length : 0;
}

function findWholeTerm(text: string, term: string): { index: number; length: number } | null {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(
    `(^|[^\\p{L}\\p{N}_])(${escaped})(?=$|[^\\p{L}\\p{N}_])`,
    "iu",
  );
  const match = expression.exec(text);
  if (!match) return null;
  return { index: match.index + match[1].length, length: match[2].length };
}
