import { useEffect, useState } from 'react';
import type { Module } from '../types';
import { saveJSONChecked, RESTORED_EVENT } from '../lib/storage';
import { readRecords } from '../lib/record-storage';
import { COURSE_PRACTICUMS } from '../data/learning/course-practicums';
import './PracticeNotebook.css';

const pending=new Map<string,Record<string,string>>();
const read=(key:string)=>readRecords<Record<string,string>>(key);
export function PracticeNotebook({courseId,module,previous}:{courseId:string;module:Module;previous?:Module}) {
  const key=courseId+'_practice';
  const identity=key+'/'+module.zoom;
  const [entry,setEntry]=useState(()=>pending.get(identity) || read(key).records[module.zoom] || {});
  const [status,setStatus]=useState(pending.has(identity)?'Saqlanmagan matn bor — eksport qiling.':!read(key).writable?'Saqlangan ma’lumot buzilgan. Asl yozuv saqlandi; backup eksport qilib tiklang.':'');
  useEffect(()=>{
    const reload=()=>{pending.delete(identity);setEntry(read(key).records[module.zoom]||{});setStatus('Zaxiradan yangilandi');};
    window.addEventListener(RESTORED_EVENT,reload);
    return ()=>window.removeEventListener(RESTORED_EVENT,reload);
  },[key,identity,module.zoom]);
  useEffect(()=>{
    const warn=(e:BeforeUnloadEvent)=>{if(pending.has(identity)){e.preventDefault();e.returnValue='';}};
    window.addEventListener('beforeunload',warn);
    return ()=>window.removeEventListener('beforeunload',warn);
  },[identity]);
  function update(field:string,value:string){
    const source=read(key);
    const latest=source.records[module.zoom]||{};
    const conflict=latest[field]!==entry[field] && latest[field]!==value;
    const draft={...entry,[field]:value};
    // Failed/conflicting drafts must not silently overwrite a newer record.
    if(!source.writable || conflict || pending.has(identity)) {
      setEntry(draft);pending.set(identity,draft);
      setStatus(!source.writable?'Saqlanmadi: manba buzilgan. Asl yozuv o‘zgarmadi; matnni eksport qiling.':'Saqlanmadi: boshqa tabdagi o‘zgarish yoki saqlanmagan draft bor. Eksport qilib, qayta oching.');
      return;
    }
    const next={...latest,[field]:value};setEntry(next);
    const saved=saveJSONChecked(key,{...source.records,[module.zoom]:next});
    if(saved)pending.delete(identity);else pending.set(identity,next);
    setStatus(saved?'Shu brauzerda saqlandi':'Saqlanmadi. Matningizni eksport qiling.');
  }
  function exportText(){
    const text=`# ${courseId} / ${module.zoom}: ${module.title}\n\n`+fields.map(([id,label])=>`## ${label}\n\n${entry[id]||'Hali yozilmagan'}\n`).join('\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=`skillmap-${courseId}-${module.zoom}-practice.md`;a.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const fields=[
    ['attempt','1. Birinchi mustaqil urinish','Yechimni ochmasdan taxmin, hisob, kod yoki jumlangizni yozing.'],
    ['reason','2. Xato sababi va tuzatish','Namunadan qaysi joyi farq qildi? Nega? To‘g‘rilangan natijani alohida yozing.'],
    ['transfer','3. Yangi shartdagi mustaqil natija','Modulning o‘zgartirilgan shartini bajaring. Kutilgan va kuzatilgan natijani solishtiring.'],
    ['evidence','4. Tekshirish dalili','Commit, test chiqishi, hisob, matn yoki recording havolasi. Faqat ballning o‘zi yetmaydi.'],
    ['review','5. Review va qayta ishlash','Kim tekshirdi, qaysi mezon yetishmadi va nima tuzatildi? Self-review bo‘lsa shunday yozing.'],
    ['recall','6. Keyingi qayta urinish','1 va 7 kundan keyin namunasiz takrorlang. Sana, natija va yordam kerak bo‘lgan joyni yozing.'],
  ];
  return <section className="learning-case practice-notebook" aria-label="Mustaqil ish daftari">
    <h3>{module.title}: mustaqil ish daftari</h3>
    {previous && <p>Tayanch bilimni tekshirish uchun: <a href={`#${courseId}/${encodeURIComponent(previous.zoom)}`}>{previous.title}</a>. Oldingi mavzuni tushuntira olmasangiz, kichik misoliga qayting.</p>}
    <p>{module.workshop?.input}</p>
    <details><summary>Shu modul uchun yechim eslatmasi</summary><p>{module.workshop?.answer}</p></details>
    <h4>Mustaqil vazifa</h4><p>{module.workshop?.variation}</p>
    <h4>Qabul mezoni</h4><p>{module.workshop?.acceptance}</p>
    <p>Kurs finaliga yig‘iladigan dalillar: {COURSE_PRACTICUMS[courseId].deliverables.join('; ')}.</p>
    {fields.map(([id,label,hint])=><label key={id}>{label}<small>{hint}</small><textarea rows={4} maxLength={30000} value={entry[id]||''} onChange={e=>update(id,e.target.value)}/></label>)}
    <p role="status">{status}</p>
    <button type="button" onClick={exportText}>Mustaqil ishni Markdown eksport qilish</button>
    <p>Yozuv saqlangani topshiriq baholanganini bildirmaydi. Tekshiruv mezonini bajargach, topshiriqlar ro‘yxatida o‘zingiz belgilang.</p>
  </section>;
}
