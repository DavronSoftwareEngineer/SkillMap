// @vitest-environment node
import {describe,it,expect} from 'vitest';
import vm from 'node:vm';
import * as crypto from 'node:crypto';
import ts from 'typescript';
import telegram from './telegram.json';
import {COURSES,loadBaseCourseModules,loadCourseModules} from './courses';
import {PROJECT_PATHS} from './learning/project-paths';

const snippet=telegram.find(m=>m.zoom==='TG7')!.code.find(b=>b.title==='src/verify-init-data.ts')!.code;
const output=ts.transpileModule(snippet,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const box={exports:{} as {verifyInitData:(data:string,token:string)=>unknown},require:()=>crypto,Buffer,URLSearchParams,Date};
vm.runInNewContext(output,box);
const token='synthetic-fixture-token';
function signed(fields:Record<string,string>){
  const p=new URLSearchParams(fields);const key=crypto.createHmac('sha256','WebAppData').update(token).digest();
  const text=[...p.entries()].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>`${k}=${v}`).join('\n');
  p.set('hash',crypto.createHmac('sha256',key).update(text).digest('hex'));return p;
}
describe('the actual Telegram lesson snippet',()=>{
  it('accepts canonical line-feed signatures and rejects tampering',()=>{
    const p=signed({auth_date:String(Math.floor(Date.now()/1000)),user:JSON.stringify({id:7,first_name:'Fixture'})});
    expect(box.exports.verifyInitData(p.toString(),token)).toMatchObject({user:{id:7}});
    p.set('user',JSON.stringify({id:8}));expect(()=>box.exports.verifyInitData(p.toString(),token)).toThrow();
  });
  it('rejects expired, malformed, future and duplicate dates',()=>{
    for(const auth_date of ['NaN','0',String(Math.floor(Date.now()/1000)-7200),String(Math.floor(Date.now()/1000)+3600)]){
      expect(()=>box.exports.verifyInitData(signed({auth_date}).toString(),token)).toThrow();
    }
    const p=signed({auth_date:String(Math.floor(Date.now()/1000))});p.append('auth_date','0');expect(()=>box.exports.verifyInitData(p.toString(),token)).toThrow();
  });
});
describe('course-specific project paths',()=>{
  for(const course of COURSES)it(`${course.id}: all stages resolve, shuffled answers retain meaning`,async()=>{
    const modules=await loadCourseModules(course.id);const original=await loadBaseCourseModules(course.id);
    expect(PROJECT_PATHS[course.id].stages).toHaveLength(course.id==='finance'?6:3);
    for(const stage of PROJECT_PATHS[course.id].stages)expect(modules.some(m=>m.zoom===stage.module),stage.module).toBe(true);
    for(const [index,module] of modules.entries())for(const [q,question] of module.quiz.entries())expect(question.a[question.c]).toBe(original[index].quiz[q].a[original[index].quiz[q].c]);
  });
  it('allows a 3D specialization without a mandatory AI-only artifact',async()=>{
    const final=(await loadCourseModules('webgis')).find(m=>m.zoom==='FG')!;
    expect(final.project!.assessment!.id).toBe('geopulse-professional-v2');
    expect(final.project!.assessment!.evidence.find(e=>e.id==='model-report')!.description).toContain('3D');
    expect(final.tasks.find(t=>t.id==='fg-12')!.crit).toContain('3D');
  });
});
