import { it, expect } from 'vitest';
import { latestLoader } from './viewport-reference';

it('ignores delayed A success and A failure after B, even if abort is ignored',async()=>{
  for(const rejectOld of [false,true]){
    const pending = new Map<string,{resolve:(v:string)=>void;reject:(e:Error)=>void}>();
    const output: unknown[]=[];
    const loader=latestLoader<string>((query)=>new Promise((resolve,reject)=>{
      pending.set(query,{resolve,reject});
    }),state=>output.push(state));
    const a=loader.load('A');
    const b=loader.load('B');
    pending.get('B')!.resolve('new'); await b;
    if(rejectOld) pending.get('A')!.reject(new Error('late failure'));
    else pending.get('A')!.resolve('old');
    await a;
    expect(output).toEqual([{query:'A',loading:true},{query:'B',loading:true},
      {query:'B',data:'new',loading:false}]);
  }
});
it('does not publish after disposal and does report current errors',async()=>{
  const output:unknown[]=[];
  let resolve!: (v:string)=>void;
  const loader=latestLoader<string>(()=>new Promise(r=>{resolve=r;}),s=>output.push(s));
  const task=loader.load('A'); loader.dispose(); resolve('done'); await task;
  expect(output).toHaveLength(1);
  const failing=latestLoader(async()=>{throw new Error('403');},s=>output.push(s));
  await failing.load('B');
  expect(output[output.length-1]).toEqual({query:'B',loading:false,error:'403'});
});
