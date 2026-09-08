import { COURSE_PRACTICUMS } from '../data/learning/course-practicums';

export function CoursePracticum({courseId}:{courseId:string}) {
  const item=COURSE_PRACTICUMS[courseId];
  if(!item)return null;
  return <section className="learning-case" aria-label="Kursni amalda bajarish yo‘li">
    <h3>Kichik misoldan yakuniy loyihagacha</h3>
    <p>{item.purpose}</p>
    <h4>Tayyorlanish</h4><p>{item.setup}</p>
    <h4>Yechilgan misol</h4><p>{item.example}</p>
    <h4>Nega shunday?</h4><p>{item.explanation}</p>
    <h4>Bajarish ketma-ketligi</h4><ol>{item.steps.map(step=><li key={step}>{step}</li>)}</ol>
    <h4>Kutilgan natija</h4><p>{item.expected}</p>
    <h4>Xato holatini ataylab sinang</h4><p>{item.failure}</p>
    <h4>Endi mustaqil o‘zgartiring</h4><p>{item.independent}</p>
    <h4>Topshiriladigan ish</h4><ul>{item.deliverables.map(d=><li key={d}>{d}</li>)}</ul>
    <p>Darslarni bajarayotganda shu kichik loyiha natijasiga qayting. Katta topshiriq og‘ir bo‘lsa, avval misoldagi eng kichik holatni yordamsiz takrorlang.</p>
    <p>Chuqur misollarga havolalar quyidagi o‘quv yo‘li bo‘limida berilgan.</p>
  </section>;
}
