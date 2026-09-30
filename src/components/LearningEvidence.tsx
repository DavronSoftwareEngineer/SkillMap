import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { calculateAssessment, emptyAssessmentRecord } from '../lib/assessment';
import { readRecords } from '../lib/record-storage';
import type { AssessmentRecord } from '../types';
import { SAVED_EVENT, RESTORED_EVENT } from '../lib/storage';
import { LearnerOutcomes } from './LearnerOutcomes';

export function LearningEvidence() {
  const {course,courseId}=useStore();const [,refresh]=useState(0);
  useEffect(()=>{const reload=()=>refresh(n=>n+1);window.addEventListener(SAVED_EVENT,reload);window.addEventListener(RESTORED_EVENT,reload);window.addEventListener('storage',reload);
    return()=>{window.removeEventListener(SAVED_EVENT,reload);window.removeEventListener(RESTORED_EVENT,reload);window.removeEventListener('storage',reload);};},[]);
  const notebooks=readRecords<Record<string,string>>(courseId+'_practice').records;
  const evidenceModules=course.modules.filter(m=>notebooks[m.zoom]?.evidence?.trim()).length;
  const records=readRecords<AssessmentRecord>(courseId+'_assessment').records;
  const projects=course.modules.flatMap(m=>m.project?.assessment?[m.project.assessment]:[]);
  return <section className="evidence-panel" aria-label="Amaliy dalillar va baholash">
    <h3>Amaliy dalillar va baholash</h3>
    <p><b>{evidenceModules}/{course.modules.length}</b> modulda amaliy dalil qayd etilgan. Havola yoki yozuv mavjudligi ishning to‘g‘riligini tasdiqlamaydi.</p>
    {projects.map(a=>{const record={...emptyAssessmentRecord(),...records[a.id]};const result=calculateAssessment(a,record);
      return <div key={a.id}><h4>{a.title}</h4><p>Majburiy dalillar: {result.completedEvidence}/{result.requiredEvidence}.</p>
        <p>{result.reviewComplete?`Qo‘lda qayd etilgan reviewer bahosi: ${result.score}/${result.totalPoints}.`:'Reviewer bahosi hali to‘liq qayd etilmagan.'}</p>
        <p>Mahalliy reviewer yozuvi mustaqil tasdiqlangan natija hisoblanmaydi. Ishni tashqi reviewerga eksport qilib, uning bahosi va izohini qo‘lda qayd eting.</p></div>;
    })}
    <LearnerOutcomes key={courseId}/>
  </section>;
}
