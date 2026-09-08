import { expect, it } from 'vitest';
import { readRecords } from './record-storage';

it.each(['null','[]','42','{broken'])('blocks invalid source %s without replacing it',raw=>{
  localStorage.setItem('frontend_practice',raw);
  expect(readRecords('frontend_practice')).toEqual({records:{},writable:false});
  expect(localStorage.getItem('frontend_practice')).toBe(raw);
});
it('reads an absent store as writable and excludes prototype keys from recovery',()=>{
  expect(readRecords('arabic_practice')).toEqual({records:{},writable:true});
  localStorage.setItem('arabic_practice','{"__proto__":{},"AR0":{"attempt":"safe"}}');
  const result=readRecords('arabic_practice');
  expect(result.writable).toBe(false);
  expect(Object.keys(result.records)).toEqual(['AR0']);
});
