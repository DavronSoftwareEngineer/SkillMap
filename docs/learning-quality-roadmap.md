# SkillMap: ta’lim sifatini kuchaytirish

**2026-09-08 yangilanishi:** quyidagi oldingi bosqichning test sonlari tarixiy.
Hozirgi o‘zgarishlar va natijalar [yangi hisobotda](course-practicum-review-2026-09-08.md):
13 kursga kursga xos practicum, 224 modulga saqlanadigan mustaqil ish daftari,
184 unit test, 26 brauzer testi va 19 Python laboratoriya testi.

2026-09-07. Maqsad — barcha kurslarni professional o‘quv dasturi sifatida 9.5/10 mezoniga yaqinlashtirish. Quyidagi implementatsiya yakunlandi; 9.5 mustaqil ta’lim natijasi sifatida hali tasdiqlanmagan.

## Amalga oshirilgan qatlam

13 kurs, mavjud 224 modul. 69 ta qo‘lda yozilgan amaliy case: kirish bilimi, natija, konkret input, qadamli yechim, tipik xato, yordamli mashq, ochiladigan javob, mustaqil o‘zgartirilgan vazifa, review mezonlari va 1/7 kunlik retrieval savoli. Bir case bir nechta bog‘liq modul uchun davomiy kontekst bo‘lishi mumkin; bu 224 ta alohida yangi dars degani emas.

| Kurs | Case | Amaliy yo‘l |
|---|---:|---|
| Geospatial | 5 | Coordinate xatolari → tile delivery o‘lchovi → nodata/coverage → spatial AI split → release/rollback |
| System Design | 15 | Har modulga alohida request, state, transaction, outbox, offline conflict, capacity, SLO, security, deploy, recovery yoki ADR vaziyati |
| Founder | 14 | Capacity → buyer → interview → positioning → MVP → PM → pilot → narx → cash-flow → trust → funnel → AI cost → delegation → defense |
| Frontend | 3 | Accessible form → async race → release va browser evidence |
| Backend | 3 | Runtime contract → concurrent invariant → durable worker/retry |
| Git | 3 | Index/worktree → recovery → tested release artifact |
| Telegram | 3 | Update deduplication → trust boundary → recurring payment ledger |
| Cybersecurity | 3 | Authorization threat → incident timeline → fix/retest evidence |
| English | 6 | Baseline → present → past → evidence/reasoning → meeting → work writing |
| Finance | 3 | Cash timing → total cost/real return → runway/stress |
| Russian | 4 | Basic forms → cases → aspect → professional communication |
| Arabic | 4 | Harakat → syntax → morphology → context transfer |
| AI Prompting | 3 | Output contract → held-out evaluation → tool permission boundary |

Har casening mustaqil vazifasi birinchi tegishli moduldagi task ro‘yxatiga bir marta qo‘shiladi. Jami task 1333 dan 1402 ga oshdi; mavjud quizlar soni 737, exercises 769. Bu sonlar sifat bahosi emas.

## Tuzatilgan aniq xatolar

- Founder’dagi 13 modulda bir xil javob variantlarini takrorlagan testlar 26 ta mavzuga xos savolga almashtirildi. System Design’dagi 15 takror template savol o‘rniga alohida scenario berildi.
- Speech recognition natijasi “zo‘r talaffuz” deb baholanmaydi: vosita transkripsiyadagi maqsad so‘zlarini topishini ochiq ko‘rsatadi. Accent, pronunciation va fluency uchun recording/human review kerak.
- Final assessment UI qo‘lda qayd etilgan baholash ekanini bildiradi; reviewer identity va havola mazmuni avtomatik tasdiqlangan deb ko‘rsatilmaydi.
- English present perfect simple izohi tuzatildi. Real audio vazifasida tasdiqlanmagan accentni taxmin qilish talabi olib tashlandi; browser TTS alohida belgilandi.
- Rus tilida aspekt boshqa tillarda umuman mavjud emas degan noto‘g‘ri da’vo tuzatildi.
- Geospatial z26 Kubernetes barcha professional ishlar uchun shart degan framingdan ixtiyoriy AWS/Kubernetes laboratoriyasiga o‘zgartirildi. EKS topshiriqlari shu yo‘lni tanlaganlar uchun qoladi.
- Telegram payment namunasi unit testli domain modelga almashtirildi: immutable order terms, payer/currency/amount, charge deduplication, renewal expiry va collision tekshiriladi. Network, durable transaction va refund bu reference tomonidan implementatsiya qilinmagan; ular alohida integration laboratoriya vazifasi.
- README kurslar soni 13 ga tuzatildi.

## Moslik qarorlari

Module ID, mavjud task ID, final assessment ID va localStorage keylari saqlandi. Yangi tasklar sabab progress denominator oshadi, shu bois foiz kamayishi mumkin; eski bajarilgan tasklar o‘chirilmaydi. Eski quiz best score tarixiy natija bo‘lib qoladi: yangilangan savollarni qayta bajarish tavsiya etiladi.

Case ma’lumotlari course loaderda ulanadi. `LearningPractice` komponenti lesson ortidan interaktiv amaliyotni chiqaradi. Javobni tanlash professional completionni avtomatik yozmaydi. Transfer artifactlari o‘quvchining fayl/repositorysida va mavjud final evidence maydonlarida saqlanadi.

## Tekshirish dalili

- `npm test`: 22 fayl, 168 test o‘tdi. Course-content validatsiya, ID/task saqlanishi, 224 modul case mappingi, takror javoblar yo‘qligi, practice UI va payment domain misoli shu jumlada.
- `npm run build`: TypeScript va Vite production build o‘tdi.
- `npm run test:e2e`: 8 Chromium test o‘tdi. Mobil practice, hidden answer, tanlov feedbacki, kirill modul linki, kurs navigation, backup/restore va writing persistence tekshirildi.
- `git diff --check`: whitespace xatosi yo‘q.
- Mobil Founder TF7 screenshot ko‘rib chiqildi; horizontal overflow testi o‘tdi.

Bu testlar ta’lim samaradorligini yoki haqiqiy Telegram/PostGIS/cloud integrationni isbotlamaydi. Real provider yoki production benchmark bajarilgani haqida da’vo yo‘q.

## 9.5/10 ni qabul qilish mezoni

### System Design: ikkinchi chuqurlashtirish bosqichi

15 modulga modulga xos oddiy analogiya, atamalar, kutilgan natija, shartni
o‘zgartirish mashqi va qabul mezoni qo‘shildi. `labs/system-design`da 11 ta
standart Python/SQLite testi bajarildi: ikki connection bilan concurrent booking,
idempotency payload conflict, transaction rollback, outbox replay, tenant boundary,
stale version, additive migration, backup/restore, capacity va SLO.
Frontend latest-request-wins reference uchun 2 test delayed success/error va
dispose holatlarini tekshiradi. Bu modeldagi testlar haqiqiy PostgreSQL
concurrency, tashqi provider yoki xarita FPS benchmarki sifatida ko‘rsatilmaydi.

Professional transfer va o‘quvchi pilot dalili hali talab qilinadi. Kursdagi
ikki bosqich ochiq: avval kichik tushuncha laboratoriyasi, keyin GeoPulse
React/FastAPI/PostGIS integratsiyasi va mustaqil himoya.

Bir xil ochiq rubric: ilmiy/texnik to‘g‘rilik 20, ketma-ketlik va prerequisite 15, ishlangan misol va yordam 20, mustaqil mashq va feedback 20, real transfer/defense 15, usability/accessibility 10. Jami 100. Kritik noto‘g‘ri bilim yoki bajarilmagan ishni bajarildi deyish mavjud bo‘lsa yuqori umumiy ball bilan yopilmaydi.

95 ballni asoslash uchun keyingi dalillar kerak:

1. Har kurs bo‘yicha soha reviewerining to‘liq kontent ko‘rigi: izohlar, tuzatishlar va qabul natijasi. Ayniqsa Arabic va Russian uchun til mutaxassisi, Finance uchun tegishli kontekstda malakali reviewer.
2. Boshlovchi va tajribali o‘quvchilar bilan pilot: prerequisite baseline, yordam so‘rash holatlari, qayerda adashgani, mustaqil transfer va 7 kunlik retention. Kichik pilot natijasi butun auditoriyaga kafolat sifatida berilmaydi.
3. Texnik kurslarning integration vazifalarini o‘quvchi muhitida bajarish: real concurrency, restore, provider, raster va region split dalillari. Reference unit testini production natijasiga tenglashtirmaslik.
4. English uchun tanlangan real audio assetlarning daraja/transcript/foydalanish shartlarini yakuniy tekshirish va odam tomonidan speaking feedback; matnli/TTS mashqning o‘zi buni yopmaydi.
5. Pilotda aniqlangan murakkab yoki sayoz modullar uchun qo‘shimcha yordam. Modulga xos misollar endi barcha 224 modulga bog‘langan; quyidagi yakuniy bosqichga qarang.

## Barcha kurslarni yakunlash bosqichi — 2026-09-07

195 yangi individual workshop qo‘shildi; Founder/System Design’dagi 29 individual
case bilan qamrov 224/224. Umumiy case matnining bog‘liq modullarda qayta-qayta
chiqishi olib tashlandi; mavjud task identifikatorlari saqlandi.
Yakuniy tekshiruv: 171 unit/kontent testi, 9 E2E, 11 Python lab testi va production build.
Oldingi bo‘limlardagi 168/170 test sonlari avvalgi bosqichning tarixiy natijasidir.
[Kurslar kesimidagi yakuniy hisobot](course-quality-completion-2026-09-07.md).

## Asoslar

- [CMU Eberly Center — alignment](https://www.cmu.edu/teaching/designteach/design/assessments.html): o‘quv natijasi, mashq va baholashni bir-biriga bog‘lash.
- [Google SRE — SLO](https://sre.google/sre-book/service-level-objectives/): target, indicator va observed natijani ajratish.
- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html): invariantni database darajasida tekshirish.
- [Telegram SuccessfulPayment](https://core.telegram.org/bots/api#successfulpayment): charge ID va recurring expiration semantikasi.
- [British Council listening](https://learnenglish.britishcouncil.org/free-resources/listening): darajaga mos haqiqiy listening materiallari.
- Har kursning birinchi modulidagi manbalar shu kursga tegishli qo‘shimcha hujjatlarni beradi.
