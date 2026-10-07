import { expect, it } from 'vitest';
import { auditDelivery, auditResearch, DELIVERY_BAD, DELIVERY_GOOD, RESEARCH_DRAFT, researchSolution } from './ai-projects';
const json=JSON.stringify;
it('rejects stale citations, unsupported dates and old conclusions after a source change',()=>{
  expect(auditResearch(json(RESEARCH_DRAFT))).toMatchObject({ready:false,passed:1});
  expect(auditResearch(json(researchSolution()))).toMatchObject({ready:true,passed:4});
  expect(auditResearch(json(researchSolution()),true)).toMatchObject({ready:false,passed:1});
  expect(auditResearch(json(researchSolution(true)),true).ready).toBe(true);
  const fake=researchSolution();fake[0].sources=['S404'];
  expect(auditResearch(json(fake)).ready).toBe(false);
});
it('does not award claims for malformed, duplicate or excess JSON',()=>{
  for(const text of ['null','{}','[]','bad',json([...researchSolution(),researchSolution()[0]]),json(Array(4).fill(researchSolution()[0]))]) expect(auditResearch(text).ready).toBe(false);
});
it('blocks release with missing tests, permission or an exceeded budget',()=>{
  expect(auditDelivery(json(DELIVERY_BAD),'6000').ready).toBe(false);
  expect(auditDelivery(json(DELIVERY_GOOD),'6000')).toMatchObject({ready:true,tokens:4600,minutes:14,completed:6});
  expect(auditDelivery(json(DELIVERY_GOOD),'4000').ready).toBe(false);
  expect(auditDelivery(json({...DELIVERY_GOOD,approved:false}),'6000').ready).toBe(false);
  for(const budget of ['', 'NaN','Infinity','-1']) expect(auditDelivery(json(DELIVERY_GOOD),budget).ready).toBe(false);
});
it('charges old revisions and failed retries but does not reuse their proof',()=>{
  const old=DELIVERY_GOOD.steps.map(step=>({...step,revision:'v1'}));
  expect(auditDelivery(json({...DELIVERY_GOOD,steps:old}),'6000')).toMatchObject({ready:false,tokens:4600,completed:0});
  const steps=[...DELIVERY_GOOD.steps.slice(0,2),{...DELIVERY_GOOD.steps[2],result:'fail'},...DELIVERY_GOOD.steps.slice(2)];
  expect(auditDelivery(json({...DELIVERY_GOOD,steps}),'6000')).toMatchObject({ready:true,tokens:5300});
  expect(auditDelivery(json({...DELIVERY_GOOD,steps:[...DELIVERY_GOOD.steps,DELIVERY_GOOD.steps[1]]}),'9000').ready).toBe(false);
  expect(auditDelivery(json({...DELIVERY_GOOD,steps:[...old,...DELIVERY_GOOD.steps]}),'6000')).toMatchObject({ready:false,tokens:9200});
});
it('rejects empty evidence, invalid numeric data and malformed runs',()=>{
  for(const text of ['null','[]','bad',json({...DELIVERY_GOOD,steps:[{...DELIVERY_GOOD.steps[0],evidence:' '}]}),json({...DELIVERY_GOOD,steps:[{...DELIVERY_GOOD.steps[0],tokens:-10}]})]) expect(auditDelivery(text,'6000').ready).toBe(false);
});
