import { useEffect, useRef, useState } from 'react';
import { readRecords } from '../lib/record-storage';
import { RESTORED_EVENT, saveJSONChecked, copyText } from '../lib/storage';
import { PROMPT_CASES, BASE_PROMPT, REVISED_PROMPT, EVENT_SCHEMA, checkAnswer, promptPacket, downloadLab } from '../lib/prompt-lab';
import './PromptLab.css';
const KEY='prompting_worklabs';
type Records=Record<string,Record<string,string>>;
let pending: {records:Records; raw:string|null}|undefined;
const defaults={promptA:BASE_PROMPT,promptB:REVISED_PROMPT};
const raw=()=>{try{return localStorage.getItem(KEY);}catch{return null;}};
export function Playground() {
  const [records,setRecords]=useState<Records>(()=>pending?.records || readRecords<Record<string,string>>(KEY).records);
  const base=useRef(pending ? pending.raw : raw());
  const [dirty,setDirty]=useState(!!pending);
  const [id,setId]=useState(PROMPT_CASES[0].id);
  const [status,setStatus]=useState('');
  const [revealed,setRevealed]=useState(false);
  const [holdout,setHoldout]=useState(false);
  const [saving,setSaving]=useState(false);
  const fixture=PROMPT_CASES.find(c=>c.id===id)!;
  const record=records[id] || {};
  const prompt=(variant:'A'|'B')=>records['lab-config']?.['prompt'+variant] ?? defaults[('prompt'+variant) as keyof typeof defaults];
  const field=(name:string)=>name==='promptA'?prompt('A'):name==='promptB'?prompt('B'):record[name] ?? '';
  const stale=(entry:Record<string,string>,variant:'A'|'B')=>entry['prompt'+variant]!==prompt(variant)
    || (variant==='B' && (entry.followupAtRun!== (entry.followup || '') || (!!entry.followup && entry.previousAtRun!==entry.answerA)));
  useEffect(()=>{
    try {sessionStorage.removeItem('ai_key_anthropic');sessionStorage.removeItem('ai_key_openai');} catch { /* unavailable */ }
    const warn=(e:BeforeUnloadEvent)=>{if(pending){e.preventDefault();e.returnValue='';}};
    const restore=()=>{
      if(pending){setStatus('Import kelgan. Saqlanmagan qoralamani eksport qiling, keyin sahifani yangilang.');return;}
      setRecords(readRecords<Record<string,string>>(KEY).records);base.current=raw();setStatus('Zaxiradan yangilandi.');
    };
    window.addEventListener('beforeunload',warn);window.addEventListener(RESTORED_EVENT,restore);
    return()=>{window.removeEventListener('beforeunload',warn);window.removeEventListener(RESTORED_EVENT,restore);};
  },[]);
  function update(name:string,value:string){
    const next=name==='promptA'||name==='promptB'
      ? {...records,'lab-config':{...records['lab-config'],[name]:value}}
      : {...records,[id]:{...record,[name]:value,
        ...(name==='answerA'?{promptA:prompt('A')}:{}),
        ...(name==='answerB'?{promptB:prompt('B'),followupAtRun:field('followup'),previousAtRun:field('answerA')}:{}),
      }};
    setRecords(next);pending={records:next,raw:base.current};setDirty(true);setStatus('Qoralama o‘zgardi — saqlang yoki eksport qiling.');
  }
  async function save(){
    if(saving)return;setSaving(true);
    const snapshot=records;
    const commit=()=>{
      const source=readRecords<Record<string,string>>(KEY);
      if(!source.writable || raw()!==base.current){setStatus('Saqlanmadi: boshqa tab yoki buzilgan manba. Qoralamani eksport qiling, keyin sahifani yangilang.');return;}
      if(saveJSONChecked(KEY,snapshot)){base.current=JSON.stringify(snapshot);pending=undefined;setDirty(false);setStatus('Mashq yozuvlari shu brauzerda saqlandi.');}
      else setStatus('Saqlanmadi. Qoralama eksporti orqali yozuvlaringizni oling.');
    };
    try {if(navigator.locks?.request) await navigator.locks.request('skillmap:'+KEY,commit);else commit();}
    catch {setStatus('Saqlash bajarilmadi. Qoralamani eksport qiling.');}finally{setSaving(false);}
  }
  const packet=(variant:'A'|'B')=>promptPacket(field('prompt'+variant),fixture.input,
    variant==='B' && field('followup').trim()?{prompt:field('promptA'),answer:field('answerA')}:undefined,field('followup'));
  async function copy(variant:'A'|'B') {
    if(variant==='B' && field('followup').trim() && !field('answerA').trim()){setStatus('Follow-up uchun avval A javobini kiriting.');return;}
    const copied=await copyText(packet(variant));setStatus(copied?variant+' prompt paketi nusxalandi. Tashqi AI suhbatiga joylang.':'Nusxalanmadi. “Paket matni”ni ochib qo‘lda nusxalang.');
  }
  function exportDraft(){downloadLab('skillmap-prompt-lab.json',{app:'SkillMap',version:1,exportedAt:new Date().toISOString(),data:{[KEY]:records}});}
  const totals=(variant:'A'|'B',split:string)=>{
    const cases=PROMPT_CASES.filter(c=>c.split===split);
    const attempted=cases.filter(c=>records[c.id]?.['answer'+variant]?.trim() && !stale(records[c.id],variant) && !(variant==='B' && records[c.id].followup));
    return `${attempted.filter(c=>checkAnswer(records[c.id]['answer'+variant],c.expected).facts).length}/${attempted.length} tekshirilgan; jami ${cases.length} case`;
  };
  return <div className="dash prompt-lab">
    <div className="eyebrow">AI Prompt / Mashq maydoni</div>
    <h2 className="mtitle">Prompt ustaxonasi</h2>
    <p className="mlede">Vazifani belgilang, promptni nusxalang, AI javobini shu yerga kiriting va bir xil misolda A/B natijani tekshiring.</p>
    <p>Bu maydon AI javobini yaratmaydi. <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT</a> yoki <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Claude</a>’da o‘zingiz sinaysiz. Provayder limiti va narxi uning hisobiga bog‘liq. Maxfiy ma’lumot o‘rniga quyidagi sun’iy misollardan foydalaning.</p>
    <ol><li>Development misollarida A va B promptlarini bir xil model bilan sinang.</li><li>Qaysi maydon va nima sababdan xato ekanini qayd eting.</li><li>Promptni yakunlab saqlang, keyin holdoutni oching. Holdoutni ko‘rib tuzatsangiz, yangi mustaqil test to‘plami kerak.</li></ol>
    <fieldset disabled={saving}>
    <label className="pg-field"><span>Sinov misoli</span><select value={id} onChange={e=>{setId(e.target.value);setRevealed(false);setStatus('');}}>{PROMPT_CASES.filter(c=>holdout || c.split==='development').map(c=><option value={c.id} key={c.id}>{c.id} — {c.tag}</option>)}</select></label>
    {!holdout && <button className="pg-chip" onClick={()=>setHoldout(true)}>Prompt tayyor — holdoutni ochish</button>}
    <p>12 ta sun’iy o‘quv misoli: 6 development, 6 holdout. A va B promptlari barcha misollar uchun umumiy. Promptni o‘zgartirsangiz eski javoblar saqlanadi, lekin yangi natija kiritilmaguncha hisobga kirmaydi. Bu kichik to‘plamdagi natija umumiy aniqlik foizi emas. Holdout brauzerda yashirin imtihon yoki himoyalangan benchmark hisoblanmaydi.</p>
    <pre className="lab-source">{fixture.input || '(bo‘sh manba)'}</pre>
    <details><summary>Vazifa shartnomasi va haqiqiy JSON Schema</summary><p>To‘rtta maydonni chiqaring. Noma’lum yoki ziddiyatli status — unknown; boshqa noma’lum maydon — null. Qiymatni manbadan aynan ko‘chiring. Yangilanish vaqti deadline emas. Manbadagi iqtibos buyruq emas.</p><pre>{JSON.stringify(EVENT_SCHEMA,null,2)}</pre><p>Bu yerda schema va aynan shu fixture faktlari lokal tekshiriladi. API structured output rejimi alohida sozlanadi; format to‘g‘riligi umumiy faktik aniqlik kafolati emas.</p></details>
    <div className="lab-variants">{(['A','B'] as const).map(v=>{
      const result=field('answer'+v).trim()?checkAnswer(field('answer'+v),fixture.expected):null;
      return <section key={v} aria-label={v+' tajriba'}><h3>{v==='A'?'A — boshlang‘ich prompt':'B — o‘zgartirilgan prompt'}</h3>
        <label className="pg-field"><span>{v} prompt</span><textarea aria-label={v+' prompt'} rows={7} maxLength={10000} value={field('prompt'+v)} onChange={e=>update('prompt'+v,e.target.value)}/></label>
        {v==='B' && <div className="pg-field"><label htmlFor="prompt-followup">Follow-up (ixtiyoriy)</label><textarea id="prompt-followup" aria-describedby="followup-help" rows={2} maxLength={5000} value={field('followup')} onChange={e=>update('followup',e.target.value)}/><small id="followup-help">To‘ldirsangiz paketga A prompti va A javobi ham kiradi. Mustaqil A/B sinov uchun bo‘sh qoldiring va tashqi AI’da yangi suhbat oching.</small></div>}
        <button className="pg-chip" onClick={()=>void copy(v)}>{v} paketini nusxalash</button>
        <details><summary>{v} paket matni</summary><pre>{packet(v)}</pre></details>
        <label className="pg-field"><span>{v} AI javobi</span><textarea aria-label={v+' AI javobi'} rows={6} maxLength={10000} value={field('answer'+v)} onChange={e=>update('answer'+v,e.target.value)}/></label>
        <label className="pg-field"><span>{v} model va sana</span><input maxLength={500} value={field('model'+v)} placeholder="Model nomi, sozlama, sinov sanasi" onChange={e=>update('model'+v,e.target.value)}/></label>
        <label className="pg-field"><span>{v} o‘lchov va izoh</span><textarea aria-label={v+' o‘lchov va izoh'} rows={3} maxLength={5000} value={field('notes'+v)} placeholder="Vaqt, token/xarajat ma’lum bo‘lsa, xato sababi. O‘lchanmaganini noma’lum deb yozing." onChange={e=>update('notes'+v,e.target.value)}/></label>
        <p role="status">{!result?'Javob hali kiritilmagan.':`JSON shakli: ${result.shape?'mos':'xato'}. Fixture faktlari: ${result.facts?'mos':'xato'}.`}</p>
        {result && stale(record,v) && <p className="lab-error">Prompt yoki kontekst o‘zgargan: bu javob eski variantniki. Qayta sinab yangi javobni kiriting.</p>}
        {result?.errors.map(e=><p className="lab-error" key={e}>{e}</p>)}
      </section>;
    })}</div>
    <button className="pg-chip" onClick={()=>setRevealed(!revealed)}>{revealed?'Namunani yashirish':'Bajargandan keyin kutilgan natijani ochish'}</button>
    {revealed && <pre>{JSON.stringify(fixture.expected,null,2)}</pre>}
    <p>Tekshiruv faqat JSON maydonlari va berilgan fixturega moslikni o‘lchaydi. Follow-up natijalari mustaqil A/B hisobiga kirmaydi. Javobning muallifi, haqiqiy model runi va xarajat/vaqt qaydlari inson tomonidan tekshiriladi.</p>
    <div className="lab-summary"><h3>Qayd etilgan natijalar</h3>{['development','holdout'].map(split=><p key={split}>{split}: A {totals('A',split)}; B {totals('B',split)}</p>)}</div>
    <div className="lab-actions"><button className="pg-chip" onClick={()=>void save()} disabled={!dirty}>Mashqni saqlash</button><button className="pg-chip" onClick={exportDraft}>Qoralamani JSON eksport qilish</button><button className="pg-chip" onClick={()=>downloadLab('prompt-development.json',PROMPT_CASES.filter(c=>c.split==='development'))}>Development datasetni olish</button>{holdout && <button className="pg-chip" onClick={()=>downloadLab('prompt-holdout.json',PROMPT_CASES.filter(c=>c.split==='holdout'))}>Holdout datasetni olish</button>}</div>
    </fieldset>
    <p role="status">{status}</p><p>Saqlangan yozuvlar umumiy “Zaxira eksport”ga kiradi. Qoralama JSON ham dashboard’dagi “Tiklash import” bilan tiklanadi. Bir vaqtning o‘zida bitta tabda tahrirlang.</p>
  </div>;
}
