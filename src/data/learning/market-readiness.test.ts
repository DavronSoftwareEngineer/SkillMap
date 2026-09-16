import { describe, expect, it } from 'vitest';
import { COURSES, loadCourseModules } from '../courses';
import { LEARNING_TRACKS } from './index';
import { MARKET_CASES, MARKET_SOURCES } from './market-readiness';

describe('market requirements stay in their owning Geospatial modules', () => {
  it('adds five unique cases to existing modules, with actionable teaching steps', async () => {
    const modules = await loadCourseModules('webgis');
    expect(MARKET_CASES.map(c => c.modules[0])).toEqual(['cn1', 'py2', 'z19', 'z26', 'z32']);
    expect(new Set(MARKET_CASES.map(c => c.id)).size).toBe(5);
    for (const item of MARKET_CASES) {
      const owners = modules.filter(m => m.learningCases?.some(c => c.id === item.id));
      expect(owners.map(m => m.zoom)).toEqual(item.modules);
      expect(owners[0].tasks.filter(t => t.id === `practice-${item.id}`)).toHaveLength(1);
      expect(item.worked.length).toBeGreaterThanOrEqual(5);
      expect(item.rubric.length).toBeGreaterThanOrEqual(4);
      for (const field of ['prerequisite', 'outcome', 'scenario', 'guided', 'expected', 'transfer', 'recall'] as const) {
        expect(item[field].length).toBeGreaterThan(25);
      }
      expect(item.check.a[item.check.c]).toBeTruthy();
    }
  });

  it('attaches source links only to the intended modules, without duplicates', async () => {
    const modules = await loadCourseModules('webgis');
    for (const source of MARKET_SOURCES) {
      const owner = modules.find(m => m.zoom === source.module)!;
      expect(owner.resources.filter(r => r.url === source.url)).toHaveLength(1);
      expect(new URL(source.url).protocol).toBe('https:');
    }
  });

  it('does not spread vendor or salary cases into unrelated courses', async () => {
    for (const course of COURSES.filter(c => c.id !== 'webgis')) {
      const modules = await loadCourseModules(course.id);
      expect(modules.flatMap(m => m.learningCases || []).filter(c => c.id.startsWith('market-'))).toEqual([]);
    }
    expect(Object.values(LEARNING_TRACKS).flatMap(t => t.cases)).toHaveLength(74);
  });
});
