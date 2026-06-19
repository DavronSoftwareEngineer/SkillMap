export interface CodeHeading {
  h: string | null;
  p: string | null;
}
export interface CodeVariant {
  label: string; // "JS" yoki "TS"
  lang: string;
  code: string;
}
export interface CodeBlock {
  heading: CodeHeading | null;
  title: string;
  lang: string;
  code: string;
  // Agar bor bo'lsa — blokda til almashtirgich (JS/TS) chiqadi.
  variants?: CodeVariant[];
}
export interface Task {
  id: string;
  html: string;
  crit: string;
}
export interface Resource {
  type: "doc" | "video";
  url: string;
  title: string;
  desc: string;
  host: string;
}
export interface Project {
  tag: string;
  title: string;
  desc: string;
  features: string[];
  rubric?: string[];
  variants?: {
    title: string;
    desc: string;
    deliverables: string[];
  }[];
}
export interface QuizQuestion {
  q: string;
  a: string[];
  c: number;
  w: string;
  level?: "easy" | "practical" | "scenario";
}
export interface Exercise {
  type: "gap" | "choice" | "listen";
  q: string;
  answers?: string[];
  options?: string[];
  correct?: number;
  hint?: string;
  why: string;
  say?: string; // "listen" turi uchun: ovoz chiqarib o'qiladigan matn
  lang?: string; // "listen" turi uchun til (en-US / ru-RU)
}
export interface Vocab {
  w: string;
  ipa?: string;
  pos?: string;
  uz: string;
  ex: string;
}
export interface Grammar {
  topic: string;
  rule: string;
  ex: string;
}
export interface Module {
  zoom: string;
  title: string;
  sub: string;
  coord: string;
  eyebrow: string;
  mtitle: string;
  lede: string;
  doc: string;
  code: CodeBlock[];
  tasks: Task[];
  resources: Resource[];
  project: Project | null;
  quiz: QuizQuestion[];
  exercises?: Exercise[];
  vocab?: Vocab[];
  grammar?: Grammar[];
}
export interface Book {
  n: number; // tartib raqami (o'qish ketma-ketligi)
  title: string; // o'zbekcha nom
  author: string; // muallif (+ original nom, ixtiyoriy)
  isbn?: string; // Open Library muqovasi uchun (yo'q bo'lsa dizayn-karta)
  accent: string; // karta urg'u rangi
  note: string; // qisqa izoh — nega/qachon o'qish
}
export type QuizScore = { best: number; total: number };
