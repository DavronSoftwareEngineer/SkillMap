import type { Module } from '../types';

// Keep the answer attached to its text; never mutate imported course data.
export function shuffleChoices(options: string[], correct: number, random = Math.random) {
  const order = options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { options: order.map(i => options[i]), correct: order.indexOf(correct) };
}

export function shuffleModuleChoices(module: Module): Module {
  return {
    ...module,
    quiz: module.quiz.map(q => {
      const shuffled = shuffleChoices(q.a, q.c);
      return { ...q, a: shuffled.options, c: shuffled.correct };
    }),
    exercises: module.exercises?.map(ex => {
      if (ex.type !== 'choice' || !ex.options || ex.correct === undefined) return ex;
      const shuffled = shuffleChoices(ex.options, ex.correct);
      return { ...ex, options: shuffled.options, correct: shuffled.correct };
    }),
  };
}
