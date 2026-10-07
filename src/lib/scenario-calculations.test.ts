import {describe,it,expect} from 'vitest';
import {calculateScenario} from './scenario-calculations';
const values=(kind:Parameters<typeof calculateScenario>[0],v:Record<string,number>)=>Object.fromEntries(calculateScenario(kind,v).map(r=>[r.label,r.value]));
describe('original project scenario calculations',()=>{
  it('compares income with total effort and does not hide a capacity shortfall',()=>{
    const base={price:2,direct:.3,orders:4,hours:10,fixed:.8,salesHours:8,capacity:40};
    expect(values('income',base)).toMatchObject({'Oylik tushum (mln)':8,'Xarajatlardan keyingi qoldiq (mln)':6,'Jami ish soati':48,'Bir soatga qoldiq (mln)':.125,'Quvvatdan ortiq soat':8,'Vaqtga sig‘adigan buyurtmalar':3});
    const higher=values('income',{...base,price:2.5,orders:3});
    expect(higher['Xarajatlardan keyingi qoldiq (mln)']).toBeCloseTo(5.8);
    expect(higher['Bir soatga qoldiq (mln)']).toBeCloseTo(5.8/38);
    expect(higher['Quvvatdan ortiq soat']).toBe(0);
    expect(values('income',{...base,orders:0,salesHours:0})['Xarajatlardan keyingi qoldiq (mln)']).toBe(-.8);
    expect(typeof values('income',{...base,orders:0,salesHours:0})['Bir soatga qoldiq (mln)']).toBe('string');
    expect(typeof values('income',{...base,direct:3})['Xarajatni qoplash uchun buyurtmalar']).toBe('string');
    for(const change of [{orders:1.5},{price:0},{hours:0},{fixed:-1},{capacity:NaN}])expect(()=>values('income',{...base,...change})).toThrow();
  });
  it('includes the upfront fee in the one-payment teaching example',()=>{
    expect(values('loan',{nominal:10,fee:.2,repayment:11})['Bir yillik xarajat (%)']).toBeCloseTo(12.2449);
    expect(()=>values('loan',{nominal:10,fee:10,repayment:11})).toThrow();
  });
  it('never counts an invoice advance twice and sorts cash dates',()=>{
    const base={opening:10,invoice:15,advance:0,first:8,second:3,paymentDay:60};
    expect(values('cash',base)).toMatchObject({'15-kun oxiri':-1,'60-kun oxiri':14,'Birinchi manfiy kun':15});
    expect(values('cash',{...base,advance:5})).toMatchObject({'15-kun oxiri':4,'60-kun oxiri':14,'Birinchi manfiy kun':'Yo‘q','Qolgan invoice to‘lovi':10});
    expect(values('cash',{...base,paymentDay:5})).toMatchObject({'5-kun oxiri':17,'15-kun oxiri':14});
    expect(()=>values('cash',{...base,advance:16})).toThrow();
  });
  it('distinguishes margin from markup under a price/support shock',()=>{
    expect(values('margin',{price:1.6,infra:.2,support:.5,delivery:.3,factor:2})['Margin (%)']).toBeCloseTo(6.25);
    expect(()=>values('margin',{price:0,infra:0,support:0,delivery:0,factor:1})).toThrow();
  });
  it('keeps units, negative error budgets and invalid counts visible',()=>{
    const base={users:400,interval:10,peak:3,kb:50,eligible:20000,bad:25,slo:99.9};
    const r=values('capacity',base);expect(r['Peak req/s']).toBe(120);expect(r['Peak MB/s (decimal)']).toBe(6);expect(r['Qolgan error budget']).toBeCloseTo(-5);
    expect(()=>values('capacity',{...base,bad:20001})).toThrow();expect(()=>values('capacity',{...base,interval:0})).toThrow();
  });
  it('does not turn nodata into zero, and accepts negative NDVI',()=>{
    expect(values('raster',{sum:0,valid:0,total:4,threshold:.8})).toMatchObject({Mean:'null',Holat:'nodata'});
    expect(values('raster',{sum:-.6,valid:2,total:4,threshold:.8})).toMatchObject({Mean:-.3,Coverage:.5,Holat:'insufficient'});
    expect(()=>values('raster',{sum:1,valid:0,total:4,threshold:.8})).toThrow();
  });
  it('rejects fabricated acceptance counts and handles zero accepted tasks',()=>{
    expect(values('ai-cost',{tasks:10,accepted:8,tokens:4000,minutes:20})['Token / qabul qilingan natija']).toBe(500);
    expect(typeof values('ai-cost',{tasks:10,accepted:0,tokens:4000,minutes:20})['Token / qabul qilingan natija']).toBe('string');
    expect(()=>values('ai-cost',{tasks:10,accepted:11,tokens:4000,minutes:20})).toThrow();
    expect(()=>values('ai-cost',{tasks:10,accepted:8,tokens:NaN,minutes:20})).toThrow();
  });
});
