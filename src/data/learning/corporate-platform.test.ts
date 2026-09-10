import { describe, expect, it } from 'vitest';
import { CORPORATE_CASES, CORPORATE_LINKS } from './corporate-platform';
import { COURSES, loadCourseModules, loadBaseCourseModules } from '../courses';

describe('corporate curriculum integration', () => {
  it('exposes runnable starter instructions in SDK, tile and worker lessons', async () => {
    for (const [course, id, command] of [
      ['frontend', 'FE9', 'npm run test:corporate-sdk'],
      ['webgis', 'z8', 'python -m unittest discover'],
      ['backend', 'BX2', 'python -m unittest discover'],
    ]) {
      const module = (await loadCourseModules(course)).find(m => m.zoom === id)!;
      expect(module.doc).toContain(command);
      expect(module.doc).toContain('Ishga tushiriladigan starter');
    }
  });
  it('places every cross-course task on an existing route', async () => {
    for (const link of CORPORATE_LINKS) {
      const modules = await loadCourseModules(link.course);
      const target = modules.find(m => m.zoom === link.module)!;
      expect(target).toBeDefined();
      expect(target.tasks.some(t => t.id === `corporate-link-${link.target}`)).toBe(true);
      expect(CORPORATE_CASES.some(c => c.id === link.target)).toBe(true);
    }
  });
  it('adds exactly seven owned cases to existing modules, without a new course', async () => {
    expect(CORPORATE_CASES).toHaveLength(7);
    expect(new Set(CORPORATE_CASES.map(c => c.id)).size).toBe(7);
    for (const c of CORPORATE_CASES) {
      const modules = await loadCourseModules(c.course);
      const target = modules.find(m => m.zoom === c.module)!;
      expect(target).toBeDefined();
      expect(target.doc).toContain(c.title);
      expect(target.doc).toContain('Mock-only');
      expect(target.code.some(block => block.code === c.code)).toBe(true);
      expect(target.tasks.some(t => t.id === `corporate-${c.id}`)).toBe(true);
      expect(c.steps.length).toBeGreaterThanOrEqual(4);
      for (const text of [c.exercise, c.acceptance, c.decision]) expect(text.length).toBeGreaterThan(90);
    }
  });
  it('preserves old module, task and code identifiers across all courses', async () => {
    for (const course of COURSES) {
      const base = await loadBaseCourseModules(course.id);
      const enhanced = await loadCourseModules(course.id);
      expect(enhanced.map(m => m.zoom)).toEqual(base.map(m => m.zoom));
      base.forEach((m, i) => {
        expect(enhanced[i].tasks.slice(0, m.tasks.length)).toEqual(m.tasks);
        expect(enhanced[i].code.slice(0, m.code.length)).toEqual(m.code);
      });
    }
  });
});
