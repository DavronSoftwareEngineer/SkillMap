// Read-only curriculum inventory. Counts describe coverage, not teaching quality.
// Run: node scripts/audit-education.mjs
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { COURSES, loadCourseModules } = await server.ssrLoadModule('/src/data/courses.ts');
  const totals = { courses: COURSES.length, modules: 0, questions: 0, tasks: 0, exercises: 0 };
  for (const course of COURSES) {
    const modules = await loadCourseModules(course.id);
    const questions = modules.flatMap(module => module.quiz);
    const answerSets = new Map();
    for (const module of modules) {
      for (const question of module.quiz) {
        const key = JSON.stringify([question.a, question.c]);
        answerSets.set(key, [...(answerSets.get(key) || []), module.zoom]);
      }
    }
    const row = {
      course: course.id,
      learningCases: new Set(modules.flatMap(module => (module.learningCases || []).map(item => item.id))).size,
      modulesWithPractice: modules.filter(module => module.workshop).length,
      modules: modules.length,
      questions: questions.length,
      tasks: modules.reduce((n, module) => n + module.tasks.length, 0),
      exercises: modules.reduce((n, module) => n + (module.exercises?.length || 0), 0),
      finals: modules.filter(module => module.project?.assessment).map(module => module.zoom),
      repeatedAnswerSets: [...answerSets.values()].filter(ids => ids.length > 2),
      inventory: modules.map(module => ({
        id: module.zoom,
        title: module.title,
        // Includes diagram labels; excludes lede/code/tasks/resources. Not a quality score.
        approximateDocWords: module.doc.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length,
        questions: module.quiz.length,
        tasks: module.tasks.length,
        exercises: module.exercises?.length || 0,
        project: module.project?.title || null,
      })),
    };
    for (const key of ['modules', 'questions', 'tasks', 'exercises']) totals[key] += row[key];
    console.log(JSON.stringify(row));
  }
  console.log(JSON.stringify({ totals }));
} finally {
  await server.close();
}
