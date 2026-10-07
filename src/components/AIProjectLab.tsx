import { useEffect, useRef, useState } from 'react';
import { readRecords } from '../lib/record-storage';
import { RESTORED_EVENT, saveJSONChecked } from '../lib/storage';
import { downloadLab } from '../lib/prompt-lab';
import { auditDelivery, auditResearch, DELIVERY_BAD, DELIVERY_GOOD, RESEARCH_DRAFT, researchPack, researchSolution } from '../lib/ai-projects';
import './PromptLab.css';
const KEY='prompting_worklabs';
type Records=Record<string,Record<string,string>>;
let pending:{records:Records;raw:string|null}|undefined;
const raw=()=>{try{return localStorage.getItem(KEY);}catch{return null;}};
const pretty=(v:unknown)=>JSON.stringify(v,null,2);
export default function AIProjectLab({mode}:{mode:string}) {
  const [records,setRecords]=useState<Records>(()=>pending?.records || readRecords<Record<string,string>>(KEY).records);
  const base=useRef(pending?pending.raw:raw());
  const [dirty,setDirty]=useState(!!pending);
  const [status,setStatus]=useState('');
  const [saving,setSaving]=useState(false);
  const id='studio-'+mode;
  const entry=records[id] || {};
  const field=(key:string)=>entry[key] || '';
  const changed=field('scenario')==='changed';
  const result=mode==='P-Research'?auditResearch(field('answer'),changed):mode==='P-Delivery'?auditDelivery(field('answer'),field('budget')):null;
  useEffect(()=>{
    const unload=(e:BeforeUnloadEvent)=>{if(pending){e.preventDefault();e.returnValue='';}};
    const restore=()=>{
      if(pending){setStatus('Yangi import bor; qoralamangizni eksport qiling va sahifani yangilang.');return;}
      setRecords(readRecords<Record<string,string>>(KEY).records);base.current=raw();setStatus('Zaxiradan yangilandi.');
    };
    window.addEventListener('beforeunload',unload);window.addEventListener(RESTORED_EVENT,restore);
    return()=>{window.removeEventListener('beforeunload',unload);window.removeEventListener(RESTORED_EVENT,restore);};
  },[]);
  function change(values:Record<string,string>) {
    const next={...records,[id]:{...entry,...values}};
    setRecords(next);pending={records:next,raw:base.current};setDirty(true);setStatus('Qoralama o‘zgardi — saqlang yoki eksport qiling.');
  }
  async function save(){
    if(saving)return;setSaving(true);
    const snapshot=records;
    const commit=()=>{
      if(!readRecords(KEY).writable||raw()!==base.current){setStatus('Saqlanmadi: manba o‘zgargan yoki buzilgan. Qoralamani eksport qiling.');return;}
      if(saveJSONChecked(KEY,snapshot)){base.current=JSON.stringify(snapshot);pending=undefined;setDirty(false);setStatus('Loyiha yozuvlari shu brauzerda saqlandi.');}
      else setStatus('Saqlanmadi. Qoralamani eksport qilib saqlab oling.');
    };
    try {if(navigator.locks?.request)await navigator.locks.request('skillmap:'+KEY,commit);else commit();}
    catch {setStatus('Saqlash bajarilmadi. Qoralamani eksport qiling.');}finally{setSaving(false);}
  }
  const textField=(key:string,label:string,rows=4)=><label className="pg-field"><span>{label}</span><textarea aria-label={label} rows={rows} maxLength={30000} value={field(key)} onChange={e=>change({[key]:e.target.value})}/></label>;
  function exportWork(){downloadLab('skillmap-ai-project.json',{app:'SkillMap',version:1,exportedAt:new Date().toISOString(),provenance:'Manual learner records; synthetic fixture checks, not a verified AI run or real release.',data:{[KEY]:records},report:{mode,scenario:changed?'changed':'base',result}});}
  return <section className="prompt-lab ai-project-lab" aria-label="AI loyiha laboratoriyasi">
    <h2>{mode==='P-Scout'?'Yangi imkoniyatni baholash kundaligi':mode==='P-Research'?'Evidence Desk — manbali qaror hisoboti':'Delivery Desk — agent ishini qabul qilish'}</h2>
    <p>Bu laboratoriya frontendda ishlaydi. Tashqi AI yoki agentni o‘zingiz ishlatasiz; bu yerda dalil va natijani qayd etasiz. Namunalar sun’iy. Tekshiruv haqiqiy model runi, reviewer shaxsi yoki production tayyorligini tasdiqlamaydi.</p>
    <fieldset disabled={saving}>
    {mode==='P-Scout'?<>
      <ol><li>Rasmiy yangilikni o‘qing va hisobingizda imkoniyat borligini tekshiring.</li><li>Bir xil vazifada baseline va yangi vositani sinang.</li><li>Sifat, sarf va cheklovga qarab qabul qilish yoki kutish qarorini yozing.</li></ol>
      {textField('source','Rasmiy manba, versiya va tekshirilgan sana',2)}
      {textField('access','Hisobimdagi mavjudlik va ruxsatlar',2)}
      {textField('hypothesis','Vazifa, faraz va oldindan belgilangan qabul mezoni')}
      {textField('baseline','Eski usul: raw natija, sifat, vaqt va sarf')}
      {textField('candidate','Yangi usul: raw natija, sifat, vaqt va sarf')}
      {textField('decision','Qaror, cheklov va qayta tekshirish triggeri')}
      <p>Bu kundalik avtomatik yangilik kuzatuvchisi emas. Model/vosita yoki talab o‘zgarsa yoxud yangi xato topsangiz, asl yozuvni eksport qilib yangi sinovni boshlang.</p>
    </>:mode==='P-Research'?<>
      <ol><li>Manba paketidagi eski reja, qaror, QA va CSV’ni ajrating.</li><li>Xato draftni tahlil qiling; tashqi AI’dan manbali tuzatish so‘rang.</li><li>To‘rt field uchun qiymat va bitta asosiy source ID kiriting.</li><li>Hisobotni yozing, talabni o‘zgartiring va qayta tekshiring.</li></ol>
      <label className="pg-field"><span>Manba ssenariysi</span><select value={changed?'changed':'base'} onChange={e=>change({scenario:e.target.value})}><option value="base">Boshlang‘ich paket</option><option value="changed">Yangi qaror va QA — transfer sinovi</option></select></label>
      <div className="project-sources">{researchPack(changed).map(s=><article key={s.id}><h3>{s.id} · {s.kind}</h3><small>{s.date} · sun’iy</small><pre>{s.text}</pre></article>)}</div>
      <p>Maydonlar: budget — mln so‘m; testedCapacity — sinovdan o‘tgan yozuvlar soni; deadline — tasdiqlangan sana yoki null; monthlySaving — taxminiy so‘m/oy. Har biriga bitta asosiy manba yoziladi. Bu cheklangan fixture tekshiruvi, erkin matnning umumiy fakt auditi emas.</p>
      {!field('answer')&&<button className="pg-chip" onClick={()=>change({answer:pretty(RESEARCH_DRAFT),scenario:field('scenario')||'base'})}>Xato draft bilan boshlash</button>}
      {textField('answer','Claimlar JSON',12)}
      <details><summary>Ishlangan yechim va izoh</summary><pre>{pretty(researchSolution(changed))}</pre><p>Eski S1 budjeti o‘tmaydi. Quvvat maqsadini QA o‘lchovi bilan almashtirmang. Tasdiqlanmagan sanani null qoldiring. 50 × 150 / 60 × 3600 = 450 000 so‘m/oy — bu prognoz.</p></details>
      {textField('memo','Qaror hisoboti: tavsiya, manbalar, taxminlar va ochiq savollar',6)}
      <button className="pg-chip" onClick={()=>downloadLab('evidence-desk-source-pack.json',researchPack(changed))}>Manba paketini olish</button>
    </>:<>
      <ol><li>Vazifa: qidiruvda bo‘sh holat va klaviatura boshqaruvini qo‘shish.</li><li>Contract → implementation → unit → integration → review → release izini ko‘rib chiqing.</li><li>Yiqilgan testni tuzatish, qayta sinov va inson tasdig‘ini modellashtiring.</li><li>Yangi revision, qayta urinish sarfi va budjetni ham hisoblang.</li></ol>
      <p>Trace’dagi evidence — qo‘lda kiritilgan dalil manzili/izohi. Validator uning mazmunini ochmaydi. Eski revision qadamlarining sarfi hisoblanadi, lekin ular yangi revisionni tasdiqlamaydi. Vaqt — qadamlar daqiqalari yig‘indisi; parallel elapsed vaqt emas.</p>
      <label className="pg-field"><span>Token budjeti (o‘quv chegarasi)</span><input aria-label="Token budjeti" type="number" min="1" value={field('budget')} onChange={e=>change({budget:e.target.value})}/></label>
      {!field('answer')&&<button className="pg-chip" onClick={()=>change({answer:pretty(DELIVERY_BAD),budget:field('budget')||'6000'})}>Xato trace bilan boshlash</button>}
      {textField('answer','Agent trace JSON',16)}
      <details><summary>Ishlangan yechim va izoh</summary><pre>{pretty(DELIVERY_GOOD)}</pre><p>Jami 4 600 token, 14 qadam-daqiqa. Bu oldingi failed runni yashirish uchun emas, alohida sun’iy yaxshi run namunasi. Real urinishni tuzatsangiz failed qadamlar va sarfini tarixda qoldiring. “release” faqat simulyatsiya; saytni deploy qilmaydi.</p></details>
      {textField('memo','Integratsiya qarori, haqiqiy test dalili va rollback rejasi',6)}
    </>}
    {result&&field('answer')&&<div className="lab-summary" role="status"><h3>{result.ready?'Fixture tekshiruvi o‘tdi':'Tuzatish kerak'}</h3>{'passed' in result?<p>Dalilga mos claimlar: {result.passed}/{result.total}</p>:<p>Joriy bosqichlar: {result.completed}/6. Jami token: {result.tokens}. Qadam-daqiqa: {result.minutes}.</p>}{result.errors.map((e,i)=><p className="lab-error" key={i}>{e}</p>)}</div>}
    <div className="lab-actions"><button className="pg-chip" disabled={!dirty} onClick={()=>void save()}>Loyihani saqlash</button><button className="pg-chip" onClick={exportWork}>Loyiha va hisobotni eksport qilish</button></div>
    </fieldset><p role="status">{status}</p><p>Yozuvlar shu brauzerda saqlanadi. Eksport dashboard’dagi “Tiklash import” bilan tiklanadi. Boshqa tabdagi o‘zgarish bo‘lsa ustidan yozilmaydi.</p>
  </section>;
}
