import { useMemo, useState } from 'react';
import type { Module } from '../types';
import { PROJECT_PATHS } from '../data/learning/project-paths';
import { PracticeNotebook } from './PracticeNotebook';
import { calculateScenario, CALCULATORS, type CalculationKind } from '../lib/scenario-calculations';
import './CourseStudio.css';

const kinds:Record<string,CalculationKind>={finance:'cash',founder:'margin',systemdesign:'capacity',webgis:'raster',prompting:'ai-cost'};
function Calculator({kind}:{kind:CalculationKind}) {
  const spec=CALCULATORS[kind];
  const [values,setValues]=useState<Record<string,string>>(()=>Object.fromEntries(spec.fields.map(([key,,value])=>[key,String(value)])));
  const report=useMemo(()=>{try {
    if(Object.values(values).some(v=>v.trim()===''))throw new Error('Bo‘sh maydonlarni to‘ldiring.');
    return {rows:calculateScenario(kind,Object.fromEntries(Object.entries(values).map(([k,v])=>[k,Number(v)]))),error:''};
  }catch(e){return {rows:[],error:e instanceof Error?e.message:'Hisob xatosi'};}},[kind,values]);
  function download(){const url=URL.createObjectURL(new Blob([JSON.stringify({kind,values,report,synthetic:true},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`skillmap-${kind}-experiment.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  return <section className="learning-case scenario-calculator" aria-label="Ssenariy hisoblagichi">
    <h3>{spec.title}</h3><p>Sun’iy misolni o‘zgartirib, natijani solishtiring. Hisobni eksport qiling yoki pastdagi daftarga yozing; bu maydonlar vaqtinchalik.</p>
    <div className="scenario-fields">{spec.fields.map(([key,label])=><label key={key}>{label}<input type="number" step="any" min={kind==='raster'&&key==='sum'?undefined:0} value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value})}/></label>)}</div>
    {report.error?<p role="alert">{report.error}</p>:<dl aria-live="polite">{report.rows.map(row=><div key={row.label}><dt>{row.label}</dt><dd>{typeof row.value==='number'?Number(row.value.toFixed(4)):row.value}</dd></div>)}</dl>}
    <button type="button" onClick={download}>Hisobni eksport qilish</button>
    <p>{kind==='income'?'Qoldiq soliqdan oldin; egasining alohida mehnat haqi chiqarilmagan. Buyurtma soni taxmin, to‘lov sanasi cash rejasida tekshiriladi.':kind==='loan'?'Faqat bir yil oxiridagi bitta to‘lov. Oylik to‘lovlar grafigi yoki bankning rasmiy effective rate hisoblagichi emas.':kind==='cash'?'Qoldiq kun oxiri bo‘yicha; bir kun ichidagi to‘lov tartibini ko‘rsatmaydi.':kind==='margin'?'Bu contribution hisobi; overhead, tax va cash timing kiritilmagan.':kind==='capacity'?'Workload taxmini benchmark emas; haqiqiy yuk sinovi alohida.':kind==='raster'?'Bu agregat sonlar hisobi; raster fayli yoki CRSni o‘zi tekshirmaydi.':'Token sarfi pul qiymati emas; tarif va kritik xatolar alohida tekshiriladi.'}</p>
  </section>;
}
export default function CourseStudio({courseId,module}:{courseId:string;module:Module}) {
  const path=PROJECT_PATHS[courseId];const stage=path?.stages.find(s=>s.module===module.zoom);
  if(!stage)return null;
  const notebook:Module={...module,zoom:`project-${module.zoom}`,title:stage.title,workshop:{concept:stage.brief,input:stage.input,answer:stage.worked,variation:stage.transfer,acceptance:stage.acceptance}};
  return <section className="course-studio" aria-label="Kurs loyihasi ustaxonasi">
    <header className="learning-case"><h2>{path.title}</h2><p>{path.boundary}</p>
      <ol>{path.stages.map(s=><li key={s.module}><a href={`#${courseId}/${encodeURIComponent(s.module)}`} aria-current={s===stage?'step':undefined}>{s.title}</a>{s===stage?' — shu bosqich':''}</li>)}</ol>
      <p>Bosqich havolasidan keyin «Loyiha ustaxonasi»ni oching. Birinchi urinishni yechimni ko‘rmasdan yozing, keyin yangi shartda takrorlang.</p>
    </header>
    {kinds[courseId]&&<Calculator key={module.zoom} kind={courseId==='finance' ? (['F14','F15','F17'].includes(module.zoom)?'income':module.zoom==='F4'?'loan':'cash') : kinds[courseId]}/>}
    <PracticeNotebook key={`${courseId}/project-${module.zoom}`} courseId={courseId} module={notebook}/>
  </section>;
}
