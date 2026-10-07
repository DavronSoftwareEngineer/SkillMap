export type CalculationKind = 'cash' | 'loan' | 'margin' | 'capacity' | 'raster' | 'ai-cost' | 'income';
export interface Calculation { label:string; value:number|string }
export const CALCULATORS:Record<CalculationKind,{title:string;fields:[string,string,number][]}> = {
  income:{title:'Daromad: narx, buyurtma va vaqt',fields:[['price','Bir buyurtma narxi (mln so‘m)',2],['direct','Bir buyurtma xarajati (mln so‘m)',0.3],['orders','Oyda buyurtmalar soni',4],['hours','Bir buyurtmaga jami soat',10],['fixed','Oylik doimiy xarajat (mln so‘m)',0.8],['salesHours','Sotuv va admin soatlari',8],['capacity','Oyda mavjud ish soati',40]]},
  loan:{title:'Bir yillik, bir to‘lovli kredit misoli',fields:[['nominal','Nominal qarz',10],['fee','Boshlang‘ich komissiya',0.2],['repayment','Bir yil oxiridagi jami to‘lov',11]]},
  cash:{title:'Pul oqimi: invoice va advance',fields:[['opening','Boshlang‘ich pul',10],['invoice','Invoice jami',15],['advance','1-kundagi advance',0],['first','5-kundagi xarajat',8],['second','15-kundagi xarajat',3],['paymentDay','Qolgan to‘lov kuni',60]]},
  margin:{title:'Narx va support stressi',fields:[['price','Narx',2],['infra','Infra xarajati',0.2],['support','Support xarajati',0.5],['delivery','Delivery xarajati',0.3],['factor','Support ko‘paytiruvchisi',1]]},
  capacity:{title:'Workload va error budget',fields:[['users','User soni',400],['interval','So‘rov oralig‘i (sekund)',10],['peak','Peak ko‘paytiruvchisi',3],['kb','Javob hajmi (KB)',50],['eligible','Eligible so‘rovlar',20000],['bad','Yomon so‘rovlar',15],['slo','SLO foizi',99.9]]},
  raster:{title:'Raster: coverage va nodata',fields:[['sum','Yaroqli piksel qiymatlari yig‘indisi',1.2],['valid','Yaroqli piksel soni',3],['total','Jami piksel soni',4],['threshold','Minimal coverage (0–1)',0.8]]},
  'ai-cost':{title:'AI: qabul qilingan natija sarfi',fields:[['tasks','Jami vazifalar',10],['accepted','Qabul qilingan vazifalar',8],['tokens','Retry bilan jami token',4000],['minutes','Human correction (minut)',20]]},
};
export function calculateScenario(kind:CalculationKind, values:Record<string,number>):Calculation[] {
  const rows=calculate(kind,values);
  if(rows.some(r=>typeof r.value==='number'&&!Number.isFinite(r.value)))throw new Error('Hisob diapazondan oshdi. Kichikroq qiymat kiriting.');
  return rows;
}
function calculate(kind:CalculationKind, values:Record<string,number>):Calculation[] {
  for(const [key] of CALCULATORS[kind].fields) if(!Number.isFinite(values[key]) || (values[key]<0 && !(kind==='raster'&&key==='sum'))) throw new Error('Chekli son kiriting; NDVI yig‘indisidan tashqari manfiy qiymat mumkin emas.');
  const v=values;const result=(label:string,value:number|string)=>({label,value});
  const integer=(...keys:string[])=>{if(keys.some(k=>!Number.isSafeInteger(v[k])))throw new Error('Sanoq va kun maydonlari butun son bo‘lsin.');};
  if(kind==='income') {
    integer('orders');
    if(v.price<=0||v.hours<=0)throw new Error('Narx va bir buyurtma uchun soat 0 dan katta bo‘lsin.');
    const revenue=v.price*v.orders, contribution=v.price-v.direct;
    const remaining=contribution*v.orders-v.fixed, time=v.hours*v.orders+v.salesHours;
    return [result('Oylik tushum (mln)',revenue),result('Xarajatlardan keyingi qoldiq (mln)',remaining),
      result('Jami ish soati',time),result('Bir soatga qoldiq (mln)',time?remaining/time:'Hisoblanmaydi: ish soati yo‘q'),
      result('Quvvatdan ortiq soat',Math.max(0,time-v.capacity)),
      result('Vaqtga sig‘adigan buyurtmalar',Math.floor(Math.max(0,v.capacity-v.salesHours)/v.hours)),
      result('Xarajatni qoplash uchun buyurtmalar',contribution>0?Math.ceil(v.fixed/contribution):'Narx bevosita xarajatni qoplamaydi')];
  }
  if(kind==='loan') {const received=v.nominal-v.fee;if(received<=0)throw new Error('Komissiyadan keyin olingan pul 0 dan katta bo‘lsin.');return[result('Amalda olingan pul',received),result('Jami ortiqcha to‘lov',v.repayment-received),result('Bir yillik xarajat (%)',(v.repayment/received-1)*100)];}
  if(kind==='cash') {
    integer('paymentDay');
    if(v.advance>v.invoice || v.paymentDay<=1)throw new Error('Advance invoicedan oshmasin; qolgan to‘lov kuni 1 dan katta bo‘lsin.');
    // Aggregate same-day receipts/expenses: end-of-day balances, not intraday solvency.
    const daily=new Map<number,number>();
    for(const [day,delta] of [[1,v.advance],[5,-v.first],[15,-v.second],[v.paymentDay,v.invoice-v.advance]])daily.set(day,(daily.get(day)||0)+delta);
    let balance=v.opening,minimum=balance,firstGap:number|string='Yo‘q';const rows:Calculation[]=[];
    for(const [day,delta] of [...daily].sort((a,b)=>a[0]-b[0])){balance+=delta;minimum=Math.min(minimum,balance);if(balance<0&&firstGap==='Yo‘q')firstGap=day;rows.push(result(`${day}-kun oxiri`,balance));}
    return [...rows,result('Eng kam qoldiq',minimum),result('Birinchi manfiy kun',firstGap),result('Qolgan invoice to‘lovi',v.invoice-v.advance)];
  }
  if(kind==='margin') {if(v.price<=0)throw new Error('Narx 0 dan katta bo‘lsin.');const cost=v.infra+v.support*v.factor+v.delivery;return [result('Direct cost',cost),result('Contribution',v.price-cost),result('Margin (%)',(v.price-cost)/v.price*100),result('40% margin uchun narx',cost/0.6)];}
  if(kind==='capacity') {integer('users','eligible','bad');if(v.interval<=0||v.eligible<=0||v.bad>v.eligible||v.slo>100||v.peak<1)throw new Error('Interval va eligible >0; bad ≤ eligible; SLO ≤100; peak ≥1.');const average=v.users/v.interval;return[result('O‘rtacha req/s',average),result('Peak req/s',average*v.peak),result('Peak MB/s (decimal)',average*v.peak*v.kb/1000),result('Qolgan error budget',v.eligible*(1-v.slo/100)-v.bad),result('Observed success (%)',(v.eligible-v.bad)/v.eligible*100)];}
  if(kind==='raster') {integer('valid','total');if(v.valid>v.total||v.threshold>1||Math.abs(v.sum)>v.valid)throw new Error('Valid ≤ total; threshold ≤1; NDVI yig‘indisi −valid va +valid oralig‘ida.');const coverage=v.total? v.valid/v.total:0;return[result('Mean',v.valid?v.sum/v.valid:'null'),result('Coverage',coverage),result('Holat',v.valid===0?'nodata':coverage<v.threshold?'insufficient':'coverage yetarli — agronomik xulosa emas')];}
  integer('tasks','accepted','tokens');if(v.accepted>v.tasks)throw new Error('Qabul qilingan son jami vazifadan oshmasin.');return[result('Token / qabul qilingan natija',v.accepted?v.tokens/v.accepted:'Hisoblanmaydi: qabul qilingan natija yo‘q'),result('Correction / qabul qilingan natija (min)',v.accepted?v.minutes/v.accepted:'Hisoblanmaydi'),result('Qabul ulushi (%)',v.tasks?v.accepted/v.tasks*100:'Hisoblanmaydi')];
}
