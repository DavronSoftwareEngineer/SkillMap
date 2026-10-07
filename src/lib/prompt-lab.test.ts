import { expect, it } from 'vitest';
import { checkAnswer, PROMPT_CASES, promptPacket } from './prompt-lab';
import { shuffleChoices } from './shuffle-choices';
it('distinguishes schema from fixture facts and rejects malformed or excess fields',()=>{
  const expected=PROMPT_CASES[0].expected;
  for(const value of ['bad JSON','null','[]',JSON.stringify({...expected,extra:true}),JSON.stringify({...expected,owner:3})]) {
    expect(checkAnswer(value,expected).shape).toBe(false);
  }
  expect(checkAnswer(JSON.stringify({...expected,deadline:'tomorrow'}),expected)).toMatchObject({shape:true,facts:false});
  for(const fixture of PROMPT_CASES) expect(checkAnswer(JSON.stringify(fixture.expected),fixture.expected).facts).toBe(true);
  expect(PROMPT_CASES.filter(c=>c.split==='holdout')).toHaveLength(6);
});
it('includes the source, previous instruction and answer only for a follow-up',()=>{
  const plain=promptPacket('Extract','Source');
  expect(plain).not.toContain('PREVIOUS');
  const follow=promptPacket('Fix','Source',{prompt:'Extract',answer:'Wrong'},'Check facts');
  for(const part of ['Source','Extract','Wrong','Check facts']) expect(follow).toContain(part);
});
it('shuffles every choice position while preserving the answer and input',()=>{
  const original=['a','b','c','d'];
  for(let correct=0;correct<4;correct++) {
    const result=shuffleChoices(original,correct,()=>0);
    expect(result.options[result.correct]).toBe(original[correct]);
    expect(result.correct).not.toBe(correct);
    expect(new Set(result.options)).toEqual(new Set(original));
  }
  expect(original).toEqual(['a','b','c','d']);
});
