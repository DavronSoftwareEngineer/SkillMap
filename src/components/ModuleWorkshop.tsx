import type { ModuleWorkshop as Workshop } from '../data/learning/workshop-types';
import './LearningPractice.css';

export function ModuleWorkshop({ item }: { item: Workshop }) {
  return <section className="learning-case" aria-label="Modulga xos mustaqil amaliyot">
    <small>SHU MODULNING AMALIYOTI</small>
    <h3>Tushunishdan mustaqil bajarishgacha</h3>
    <p>{item.concept}</p>
    <h4>1. Avval o‘zingiz javob bering</h4>
    <p>{item.input}</p>
    <details><summary>Yechim va sababini ko‘rish</summary>
      {item.answer.split('\n\n').map((text,i)=><p key={i}>{text}</p>)}
    </details>
    <h4>2. Shartni o‘zgartirib bajaring</h4><p>{item.variation}</p>
    <h4>3. Natijangizni tekshiring</h4><p>{item.acceptance}</p>
    <p className="learning-recall">Birinchi urinish, xato sababi, tuzatish va natija dalilini saqlang. Bir kundan keyin namunani yopib, boshqa misolda qayta bajaring. Natijani topshiriqlar ro‘yxatida belgilang.</p>
  </section>;
}
