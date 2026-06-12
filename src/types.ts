export interface CodeHeading {
  h: string | null;
  p: string | null;
}
export interface CodeBlock {
  heading: CodeHeading | null;
  title: string;
  lang: string;
  code: string;
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
}
export interface QuizQuestion {
  q: string;
  a: string[];
  c: number;
  w: string;
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
export type QuizScore = { best: number; total: number };
