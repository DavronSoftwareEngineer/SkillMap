import { checkpoint as q } from './types';
import type { QuizQuestion } from '../../types';

export const FOUNDER_REVIEW: Record<string, QuizQuestion> = {
  TF0:q('20 soat capacitydan 5 soat support oldi. Reja uchun qancha qoldi?', ['20','15','25'],1,'Scope qolgan15 soatga mos qayta rejalashtiriladi.'),
  TF1:q('IT security team purchasega veto qo‘ya oladi. Buyer mapda uni qayerga qo‘yasiz?', ['E’tiborsiz tashrifchi','Faqat end user','Approval/blocker stakeholder'],2,'Xarid vakolati bo‘lmagan stakeholder ham procurementni to‘xtata oladi.'),
  TF2:q('Mijoz “reportga taxminan45 minut ketadi” dedi. Hujjatdagi belgi?', ['Measured benchmark','Interview estimate, observation bilan tekshiriladi','Tasdiqlangan industry average'],1,'Intervyudagi taxminni kuzatib o‘lchangan faktga aylantirib yozmang.'),
  TF3:q('“Reporting vaqtini50% kamaytiramiz” hali test qilinmagan. Taklifda qanday yoziladi?', ['Kafolatlangan natija','Olib tashlangan barcha maqsadlar','Pilotda baseline bilan tekshiriladigan gipoteza'],2,'Outcome maqsadi va isbotlangan natija alohida.'),
  TF4:q('Pilotdagi reportni founder qo‘lda tayyorlamoqda. Mijozga?', ['To‘liq avtomatik deb ko‘rsataman','Concierge jarayon va chegarasini ochiq aytaman','Mijozga report bermayman'],1,'Concierge MVP yaroqli, lekin avtomatlashtirish darajasini noto‘g‘ri ko‘rsatish emas.'),
  TF5:q('“Redis o‘rnatildi” va “operator reportni ochdi”dan qaysi biri user outcome?', ['Ikkinchisi','Birinchisi','Ikkisi har doim teng'],0,'Texnik output foydalanuvchi natijasi bilan tekshiriladi.'),
  TF6:q('Imzolangan4 haftalik pilotga yangi integration qo‘shildi. Nima qilasiz?', ['Cheksiz bepul qo‘shaman','Talabni yashiraman','Scope/cost/deadline change kelishaman'],2,'Change control manfaatlarni ochiq boshqaradi.'),
  TF7:q('Narx3 mln, direct cost1.8 mln. Contribution margin?', ['40%','60%','66.7%'],0,'Contribution1.2; margin1.2/3=40%. Markup boshqa denominatorga ega.'),
  TF8:q('Pul10 mln, xarajat8+3 mln, invoice60 kundan keyin. Interim cash?', ['+14','-1','+15'],1,'Receivable hozir to‘lanadigan xarajatni qoplamaydi;10-8-3=-1.'),
  TF9:q('Contract “darhol butunlay o‘chirish” deydi, backup30 kun immutable. Muammo?', ['Hech qanday','Va’da texnik retentionga mos emas','Faqat UI matni'],1,'Retention, deletion va backup expiry majburiyatlari mos kelishi kerak.'),
  TF10:q('40 qualified leaddan8 pilot,4 paid. Pilot→paid conversion?', ['10%','20%','50%'],2,'4/8=50%; qualified→paid esa4/40=10%.'),
  TF11:q('Oldingi ish90 birlik. AI20+human correction80 birlik. Sof tejash?', ['+70','-10','+10'],1,'Jami100; oldingi90dan10 ko‘p. Ops xarajati hali kiritilmagan.'),
  TF12:q('Delegatsiyada access berildi, lekin acceptance/owner yo‘q. Nima yetishmaydi?', ['Yana bir dashboard','Natija mezoni, javobgarlik va escalation','Ko‘proq meeting nomi'],1,'Delegatsiya task topshirishdan tashqari natija va javobgarlik chegarasini talab qiladi.'),
};
