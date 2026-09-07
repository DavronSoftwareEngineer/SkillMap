# Barcha kurslar: amaliy ta’lim qatlamini yakunlash

## Bajarilgan qamrov

| Kurs | Modul | Modulga xos amaliyot |
| --- | ---: | ---: |
| Geospatial | 45 | 45 |
| System Design | 15 | 15 |
| Founder | 14 | 14 |
| Frontend | 16 | 16 |
| Backend | 19 | 19 |
| Git | 15 | 15 |
| Telegram | 12 | 12 |
| Cybersecurity | 16 | 16 |
| English | 19 | 19 |
| Finance | 13 | 13 |
| Russian | 13 | 13 |
| Arabic | 17 | 17 |
| AI Prompting | 10 | 10 |
| Jami | 224 | 224 |

195 yangi modul workshopi va Founder/System Design uchun 29 chuqur individual case.
Har workshop: tushuncha → konkret savol/vaziyat → yashirin namunaviy yechim va sabab →
sharti o‘zgargan mustaqil vazifa → qabul mezoni. Bu mavjud dars, kod, quiz va
portfolio topshiriqlarini almashtirmaydi; ularni amaliy o‘rganish bilan to‘ldiradi.
69 katta bosqichli case kanonik modulida bir marta ko‘rsatiladi.

## Konkret farqlar

- Geospatial: koordinata xatosi, nodata, CRS/units, tile schema, COG window,
  spatial leakage, satellite clusterning label emasligi, offline asset va failure drill.
- Frontend/Backend: stale response, state/lifecycle, runtime validation,
  authorization, transaction, queue, retry va release vaziyatlari.
- Git/Telegram/Cybersecurity: recovery, webhook/payment, tenant boundary,
  ruxsatli xavfsizlik sinovi va incident dalillari.
- Tillar: grammatik kontrmisol, kontekst, yangi matnga transfer, mustaqil
  speaking/writing review. Speech-to-text talaffuz bahosi deb berilmaydi.
- Finance/Founder/Prompting: hisob shartlari, cash-flow, mijoz dalili,
  qaror mezoni, model javobini manba bilan tekshirish va inson tasdig‘i.

## Saqlangan moslik

Mavjud kurs, modul va task IDlari o‘zgartirilmadi. localStorage keylari saqlandi.
195 yangi task alohida `workshop-<moduleId>` bilan qo‘shildi. Oldingi progress
o‘chmaydi; yangi vazifalar sabab foizning maxraji oshadi.
Jami: 737 quiz savoli, 1597 topshiriq, 769 mavjud exercise; workshoplar
exercise hisobiga sun’iy qo‘shilmagan.

## Tekshirilgan natijalar

- 24 Vitest fayli, 171 test: kontent validatsiyasi, barcha module mappinglari,
  ID/task mosligi, kanonik caselar va interaktiv komponentlar.
- 9 Chromium E2E test: 11 yangi workshop kursi hamda Founder/System Design
  oqimi, hidden answer, mobil overflow, kirill linklar, progress backup/restore.
- 11 Python laboratoriya testi: concurrency modeli, rollback, outbox replay,
  idempotency, tenant boundary, migration, backup/restore, capacity va SLO.
- TypeScript va Vite production build muvaffaqiyatli.
- Geospatial mobil workshop screenshoti vizual ko‘rib chiqildi.

## Bahoning chegarasi

Bu hisobot barcha kurslarga kod va kontent darajasidagi o‘zgarishlar kiritilganini
tasdiqlaydi, mustaqil akademik 9.5/10 sertifikati emas. 9.5 maqsadini dalillash uchun
roadmapdagi 100 ballik rubric asosida soha revieweri va real o‘quvchi pilotining
transfer/retention natijalari kerak. Bajarilmagan production integratsiya,
benchmark, audio pronunciation bahosi yoki tashqi review bajarildi deb ko‘rsatilmaydi.
Hozirgi davrning implementatsiyasi tugallandi; pilot tashqi validatsiya bosqichidir.

## Asosiy fayllar

- `src/data/learning/workshops-*.ts`: modulga xos kontent.
- `src/data/learning/module-workshops.ts`, `index.ts`: qamrov va integratsiya.
- `src/components/ModuleWorkshop.tsx`, `ModuleView.tsx`: foydalanuvchi oqimi.
- `src/data/learning.test.ts`, `ModuleWorkshop.test.tsx`, `e2e/learning-practice.spec.ts`: regressiya himoyasi.
- `README.md`, `docs/learning-quality-roadmap.md`: hujjatlashtirish.
