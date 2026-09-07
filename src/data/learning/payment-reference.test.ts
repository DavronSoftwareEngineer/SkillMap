import { describe, it, expect } from 'vitest';
import { recordPayment, type OrderTerms, type PaymentEvent } from './payment-reference';
const order: OrderTerms = { id:'o1',userId:7,currency:'XTR',amount:250,recurring:true };
const event: PaymentEvent = { orderId:'o1',userId:7,currency:'XTR',amount:250,recurring:true,chargeId:'c1',expiresAt:1000 };
describe('payment teaching reference',()=>{
  it('records renewals, deduplicates a charge and never shortens expiry on delayed delivery',()=>{
    const first=recordPayment(order,event,[]);
    const renewal=recordPayment(order,{...event,chargeId:'c2',expiresAt:2000},first.ledger);
    const duplicate=recordPayment(order,event,renewal.ledger);
    expect(duplicate.ledger).toHaveLength(2);
    expect(duplicate.duplicate).toBe(true);
    expect(duplicate.expiresAt).toBe(2000);
  });
  it.each([{userId:8},{currency:'USD'},{amount:249},{orderId:'o2'},{recurring:false},{expiresAt:undefined}])('rejects mismatched payment %j',change=>{
    expect(()=>recordPayment(order,{...event,...change},[])).toThrow();
  });
  it('rejects a conflicting replay instead of silently accepting the charge ID',()=>{
    expect(()=>recordPayment(order,{...event,expiresAt:2000},[event])).toThrow('collision');
  });
  it('does not mutate input or accept a second one-time charge',()=>{
    const once={...order,recurring:false};
    const payment={...event,recurring:false,expiresAt:undefined};
    const ledger=Object.freeze([] as PaymentEvent[]);
    const result=recordPayment(once,payment,ledger);
    expect(ledger).toHaveLength(0);
    expect(()=>recordPayment(once,{...payment,chargeId:'c2'},result.ledger)).toThrow('Second charge');
  });
});
