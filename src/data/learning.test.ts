import { describe, it, expect } from 'vitest';
import { COURSES, loadCourseModules, loadBaseCourseModules } from './courses';
import { LEARNING_TRACKS } from './learning';
import { MODULE_WORKSHOPS } from './learning/module-workshops';

describe('learning integration and stable progress identifiers',()=>{
  for(const course of COURSES) it(`${course.id}: valid case mapping and preserved identifiers`,async()=>{
    const original=await loadBaseCourseModules(course.id);
    const enhanced=await loadCourseModules(course.id);
    expect(enhanced.map(m=>m.zoom)).toEqual(original.map(m=>m.zoom));
    const track=LEARNING_TRACKS[course.id];
    expect(track).toBeDefined();
    const ids=new Set(enhanced.map(m=>m.zoom));
    expect(new Set(track.cases.map(c=>c.id)).size).toBe(track.cases.length);
    for(const item of track.cases){
      for(const id of item.modules) expect(ids.has(id),`${item.id} -> ${id}`).toBe(true);
      expect(item.check.a[item.check.c]).toBeDefined();
      expect(new Set(item.check.a).size).toBe(item.check.a.length);
    }
    for(const [index,module] of enhanced.entries()){
      expect(module.workshop,`${course.id}/${module.zoom} missing workshop`).toBeDefined();
      for(const value of Object.values(module.workshop!)) expect(value.trim()).not.toBe('');
      expect(module.tasks.slice(0,original[index].tasks.length).map(t=>t.id)).toEqual(original[index].tasks.map(t=>t.id));
      expect(new Set(module.tasks.map(t=>t.id)).size).toBe(module.tasks.length);
    }
    const independentTasks=enhanced.flatMap(m=>m.tasks).filter(t=>t.id.startsWith('practice-'));
    expect(independentTasks).toHaveLength(track.cases.length);
    expect(Object.keys(MODULE_WORKSHOPS[course.id]).sort()).toEqual([...ids].sort());
    expect(new Set(enhanced.map(m=>m.workshop!.input)).size).toBe(enhanced.length);
    // Broad cases should not be repeated verbatim in each related module.
    expect(enhanced.flatMap(m=>m.learningCases || [])).toHaveLength(track.cases.length);
  });
  it('Founder and System Design no longer share repeated template answer sets',async()=>{
    for(const id of ['founder','systemdesign']){
      const modules=await loadCourseModules(id);
      const questions=modules.flatMap(m=>m.quiz);
      expect(new Set(questions.map(q=>JSON.stringify(q.a))).size).toBe(questions.length);
    }
  });
});
