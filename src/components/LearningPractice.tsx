import { useState } from 'react';
import type { LearningCase } from '../data/learning/types';
import { CodeBlock } from './CodeBlock';
import './LearningPractice.css';

function Case({ item }: { item: LearningCase }) {
  const [pick, setPick] = useState<number | null>(null);
  const q = item.check;
  return <article className="learning-case">
    <header><small>{item.level === 'foundation' ? '1 · Poydevor' : item.level === 'applied' ? '2 · Amaliyot' : '3 · Professional transfer'}</small><h3>{item.title}</h3></header>
    <p><strong>Oldin bilish kerak:</strong> {item.prerequisite}</p>
    <p><strong>Natija:</strong> {item.outcome}</p>
    <ol className="learning-sequence" aria-label="Mashq ketma-ketligi"><li>Misolni tushun</li><li>Yordam bilan bajar</li><li>Mustaqil o'zgartir</li><li>Tekshir va qayta esla</li></ol>
    <h4>Vaziyat va kirish ma'lumoti</h4><p>{item.scenario}</p>
    <h4>To'liq ishlangan misol</h4><ol>{item.worked.map((step, i) => <li key={i}>{step}</li>)}</ol>
    {item.code && <CodeBlock block={{ ...item.code, heading: null }} />}
    <p className="learning-mistake"><strong>Nega xato chiqadi?</strong> {item.mistake}</p>
    <h4>Endi yordam bilan bajaring</h4><p>{item.guided}</p>
    <details><summary>Bajargandan keyin kutilgan natijani oching</summary><p>{item.expected}</p></details>
    <fieldset className="learning-check"><legend>{q.q}</legend>
      {q.a.map((answer, index) => <button type="button" key={index} aria-pressed={pick === index} onClick={() => setPick(index)}>{answer}</button>)}
      {pick !== null && <p role="status"><strong>{pick === q.c ? "To'g'ri qaror." : "Qayta ko'rib chiqing."}</strong> {q.w}</p>}
    </fieldset>
    <h4>Mustaqil topshiriq: boshqa shart bilan</h4><p>{item.transfer}</p>
    <h4>Tekshirish va qayta topshirish</h4><ul>{item.rubric.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <p>Har mezon uchun natijangizdan bir dalil ko'rsating. Yetishmagan bandni tuzating va birinchi urinish bilan farqini yozing. Namuna javobni ko'chirish mustaqil bajarish hisoblanmaydi.</p>
    <p className="learning-recall"><strong>1 va 7 kundan keyin, misolni yopib:</strong> {item.recall}</p>
    <p className="learning-note">Hisoblar va vaziyatlar o'quv misoli. Bu tezkor savol sertifikat yoki professional baho bermaydi. Mustaqil ishni o'z faylingiz/repositoryngizda saqlang, finalning tegishli dalil maydoniga havola bering.</p>
  </article>;
}

export function LearningPractice({ cases }: { cases: LearningCase[] }) {
  return <section aria-label="Bosqichli amaliyot" className="learning-practice">
    {cases.map(item => <Case key={item.id} item={item} />)}
  </section>;
}
