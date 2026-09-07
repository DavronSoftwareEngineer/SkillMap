import type { QuizQuestion } from '../../types';

export interface LearningCase {
  id: string;
  modules: string[];
  title: string;
  level: 'foundation' | 'applied' | 'professional';
  prerequisite: string;
  outcome: string;
  scenario: string;
  worked: string[];
  mistake: string;
  guided: string;
  expected: string;
  transfer: string;
  rubric: string[];
  recall: string;
  check: QuizQuestion;
  code?: { lang: string; title: string; code: string };
}

export interface LearningTrack {
  scope: string;
  prerequisite: string;
  finalEvidence: string;
  sources: { title: string; url: string }[];
  cases: LearningCase[];
}

export function checkpoint(q: string, a: string[], c: number, w: string): QuizQuestion {
  return { q, a, c, w, level: 'scenario' };
}
