# SkillMap — barcha kurslar ta'lim sifati auditi

Sana: 2026-09-07. Asos: `b20fe3f` commitidagi kontent va runtime orqali yig'ilgan kurslar.

## Xulosa va audit chegarasi

SkillMap kuchli mustaqil o'qish xaritasi va portfolio topshiriqlari tizimiga aylangan. Biroq mavjud kontentning o'zi barcha yo'nalishlarda boshlovchini professional darajaga yetkazadigan to'liq akademiya ekanini isbotlamaydi. Asosiy kamchilik: final talablarining murakkabligi bilan ularni bosqichma-bosqich o'rgatadigan darslar chuqurligi o'rtasidagi farq.

Bu audit barcha **13 kursni** qamrab oladi. `loadCourseModules` orqali JSON va TypeScript extensionlar birga tekshirildi: **224 modul, 737 quiz savoli, 1 333 task, 769 mashq**. Har kursda bitta professional final mavjud. README'dagi "o'n to'rtta kurs" yozuvi amaldagi katalogga mos emas.

Qamrov: barcha modullarning tartibi, sarlavhasi, dars hajmi, mashq/task/quiz/project mavjudligi, final va takroriy javoblar avtomatik tekshirildi. Har kursdagi tanlangan boshlang'ich, o'rta yoki final materiallari, umumiy assessment mexanizmi, English laboratoriyalari va lab qo'llanmalari mazmunan tekshirildi. Bu har bir jumla, tashqi havola yoki kod namunasining to'liq ekspert verifikatsiyasi emas. O'quvchilar bilan pre/post-test, uzoq muddatli retention va jonli pedagogik kuzatuv o'tkazilmadi. Arab tili uchun mutaxassis ko'rigi, moliyaviy kontent uchun mahalliy huquqiy/tarif tekshiruvi alohida qoladi.

Shu sabab ballar **tahririy pedagogik baho**, akkreditatsiya, o'quv natijasi yoki foydalanuvchining malaka bali emas. Taxminan ±0.5 ball noaniqlik bilan o'qish kerak. Ilova testlarining o'tishi mazmun to'g'riligi va pedagogik samaradorlikni avtomatik tasdiqlamaydi.

## Baholash mezoni

Carnegie Mellon Eberly Center yondashuviga ko'ra maqsad, o'qitish faoliyati va baholash bir-biriga mos kelishi kerak. Masalan, tizimni tahlil qilish maqsadini faqat atamani eslash savoli bilan o'lchab bo'lmaydi. Manba: https://www.cmu.edu/teaching/assessment/basics/alignment.html

Har mezon 0–4 ball: 0 — yo'q; 1 — nom/shablon darajasida; 2 — bor, ammo katta bo'shliqlar mavjud; 3 — izchil va foydali, ayrim bo'shliqlar bor; 4 — to'liq yo'l, ishlangan namuna, mustaqil transfer va feedback bilan mustahkamlangan. Yakuniy baho besh mezon yig'indisi / 2.

- **M:** maqsad, scope va prerequisite izchilligi.
- **T:** tushuntirish, worked example va bosqichli chuqurlik.
- **A:** amaliy mashq, loyiha va bajarish uchun tayanch.
- **B:** baholash, xato feedbacki va mustaqil bilim tekshiruvi.
- **O:** o'qish tajribasi, manba, qayta ishlash va takrorlash imkoniyati.

Kod bloki bo'lmagani til yoki moliya kursini avtomatik pasaytirmaydi; u yerda matn, dialog, hisoblangan misol va feedback muhim. Dars uzunligi ham o'zi sifat mezoni emas.

| Kurs | Modul / quiz / task / mashq | M | T | A | B | O | Baho / 10 |
|---|---|---:|---:|---:|---:|---:|---:|
| Geospatial | 45 / 168 / 358 / 72 | 3 | 3 | 3 | 3 | 3 | 7.5 |
| Frontend | 16 / 51 / 81 / 39 | 3 | 3 | 3 | 2 | 3 | 7.0 |
| Backend | 19 / 45 / 83 / 39 | 3 | 3 | 3 | 2 | 3 | 7.0 |
| Git & GitHub | 15 / 54 / 75 / 3 | 3 | 3 | 3 | 3 | 3 | 7.5 |
| Telegram Bot | 12 / 38 / 62 / 50 | 3 | 3 | 3 | 2 | 3 | 7.0 |
| Cybersecurity | 16 / 57 / 100 / 33 | 3 | 2 | 3 | 2 | 3 | 6.5 |
| English | 19 / 73 / 108 / 165 | 2 | 2 | 3 | 2 | 3 | 6.0 |
| Finance | 13 / 45 / 73 / 85 | 3 | 3 | 3 | 2 | 3 | 7.0 |
| Russian | 13 / 44 / 61 / 94 | 2 | 2 | 3 | 2 | 3 | 6.0 |
| Arabic | 17 / 63 / 83 / 152 | 3 | 3 | 3 | 2 | 3 | 7.0 |
| AI Prompting | 10 / 39 / 55 / 34 | 3 | 2 | 3 | 2 | 3 | 6.5 |
| System Design | 15 / 32 / 110 / 3 | 3 | 2 | 3 | 1 | 3 | 6.0 |
| Technical Founder | 14 / 28 / 84 / 0 | 3 | 1 | 2 | 1 | 3 | 5.0 |

Founder pastroq baholanishining sababi mavzu yomonligi emas: ko'p kontent bir xil qaror/evidence shablonidan yaratilgan, mavzuga xos o'rgatish va tekshirish zaif. Tajribali mutaxassis uchun checklist sifatidagi foydasi ushbu mustaqil o'rgatish bahosidan yuqoriroq bo'lishi mumkin.

## Eng muhim topilmalar

### P1 — Founder va System Design quizlari bilimni yetarlicha ajratmaydi

`src/data/technical-founder-course.ts:90` generatori TF0–TF12 uchun bir xil ikkita javob to'plamini beradi. 28 savoldan 26 tasida shu shablonlar ishlatilgan; bir savolda faqat mavzu prefiksi almashadi, ikkinchisi bir xil. `src/data/system-design-course.ts:450` barcha 15 modulga bir xil javob variantli evidence savolini qo'shadi. System Design'da jami 32 savol bor.

Ikkala kursda ham to'g'ri javoblar faqat ikkinchi yoki uchinchi pozitsiyada. Buning o'zi xato bahoni isbotlamaydi, lekin mazmuniy takror bilan birga testni yodlash orqali o'tishni osonlashtiradi. `level: scenario` yorlig'i savolni real scenario qilmaydi.

Tuzatish: mavjud savollarni almashtirish; TF7 uchun tushum/xarajatdan margin hisoblash, TF2 uchun suhbat dalillarini tahlil qilish, SD-DB uchun ikki concurrent transaction natijasini topish, SD-REC uchun RPO/RTO buzilishini vaqt jadvalidan aniqlash. Variantlar ishonarli bo'lsin; har noto'g'ri yo'l uchun tushuntirish va qayta mashq berilsin. Javob pozitsiyasini aralashtirish ikkilamchi ish.

### P1 — Geospatial'da arxitektura bo'yicha qarama-qarshi yo'nalish qolgan

FG modular monolith + worker + PostGIS va o'lchangan ehtiyojdan keyin murakkablashtirishni talab qiladi. Lekin `src/data/webgis.json:6795` dagi z26 "global ish AWS + Kubernetes talab qiladi" deydi va EKS deployni topshiriqqa aylantiradi. Bu mavjud default arxitektura siyosatiga mos kelmaydi; ish e'lonlari haqidagi umumlashtirish ham dalilsiz.

Tuzatish: z26 ID saqlanadi, lekin cloud deploy variantlarini solishtiruvchi elective sifatida belgilansin. Compose/VPS yoki managed container bilan o'tish mumkin bo'lsin; EKS faqat asoslangan alohida yo'l. Elective yakuniy majburiy readiness talabiga qo'shilmasin.

### P1 — Talaffuzga berilayotgan feedback o'lchovdan ortiqcha da'vo qiladi

`src/components/Exercises.tsx:16` transkripsiyadagi so'zlarni Set bilan solishtiradi. So'z tartibi, fonema, urg'u va intonatsiyani o'lchamaydi. `:254` esa 80% moslikni "Zo'r talaffuz" deb chiqaradi. Teskari tartibdagi ayni so'zlar ham yuqori ball olishi mumkin. Bu English, Russian va Arabic speaking mashqlariga taalluqli.

Tuzatish: "Transkripsiyada maqsad so'zlarining X% topildi" deb ko'rsatish; talaffuzni recording + vaqt belgili inson feedbacki bilan alohida baholash. Nutq tanish ishlamasa teng qiymatli qo'lda recording yo'li bo'lsin.

### P1 — Final assessment tashqi reviewni texnik tasdiqlamaydi

`src/lib/assessment.ts:81` reviewer uchun uch belgili ismni tekshiradi; ball va himoya tasdig'i o'sha brauzerda kiritiladi. URL dalilning haqiqiy yoki ishlaydigan ekanini tekshirmaydi. Bu lokal o'quv daftari uchun foydali, ammo mustaqil sertifikatsiya sifatida talqin qilinmasligi kerak. EnglishWorkLab allaqachon reviewer shaxsi tasdiqlanmasligini ochiq yozadi; umumiy final panelidagi "tashqi baholash" va "integrity gate" matni ham shunga mos aniqlashtirilishi kerak.

Tuzatish: self-review/qo'lda kiritilgan reviewer bahosini aniq nomlash, signed review yoki ishonchli assessor jarayonini alohida qo'shish. Hamma foydalanuvchiga murakkab backend majburiy emas.

### P1 — Telegram payment namunasi production mezoniga yetmaydi

TG6 `payment-stars.ts` misolida pre-checkout amount/statusni tekshiradi, lekin currency va order egasi tekshiruvi ko'rinmaydi. Successful payment handleri `invoice_payload` + pending status bilan yangilaydi; recurring paymentni alohida ledger va davr bo'yicha ishlamaydi. Birinchi to'lovdan keyin order paid bo'lgach keyingi davr uchun shu update yo'li ishlamay qolishi mumkin. Refund misolida ham bir nechta orderdan qaysi biri tanlanishi aniq foydalanuvchi oqimiga bog'lanmagan.

Rasmiy API'da recurring payment va subscription expiration maydonlari mavjud: https://core.telegram.org/bots/api#successfulpayment . Tuzatish uchun payer/order/currency/amount validatsiyasi, unique charge ledger, recurring period update, duplicate/renewal/refund testlari kerak. Bu auditda real Telegram to'lovi yuborilmadi, namunalar kompilyatsiyasi ham tekshirilmadi.

### P2 — Final talabidan oldin yetarli o'rgatish ko'prigi yo'q

Masalan BE14 dars matni taxminan 32 so'z, P8 taxminan 25 so'z; ularda murakkab incident yoki AI delivery artefakti so'raladi. Bular post-final extension ekanligi kod kommentida yozilgan, shuning uchun joylashuvning o'zi bug emas. Ammo mustaqil o'rgatish vazifasi qo'yilsa, buyruq/fixture/kutilgan natija/xato tahlili yetishmaydi. Backend va Telegram lablari README'da starter ekanini halol yozgan; durable queue/auth/HMAC kabi milestone'lar tayyor reference implementation emas.

Tuzatish: har muhim kompetensiyada bitta to'liq ishlangan namuna → qisman tayyor mashq → boshqa shartli mustaqil vazifa → feedback → qayta topshirish zanjiri. Hamma modulga yana alohida katta loyiha qo'shish shart emas.

## Kurslar bo'yicha tavsiyalar va qabul mezonlari

### Geospatial — 7.5/10

Kuchli: developer/GIS kirish yo'llari, fundamentals, Python, tiles, raster, GeoAI, ops va GeoPulse finali bir mahsulotga bog'langan. Finalda spatial split, per-region metric, georeferenced output, restore va jonli himoya talab qilinadi.

Bo'shliq: z26 arxitektura qarama-qarshiligi; ayrim advanced modullarda katta topshiriq oldidan qisqa izoh. Quizning ba'zi variantlari "CSS rangini o'zgartirish" kabi oson rad qilinadi. Bir xil GeoPulse loyiha bosqichlari uchun prerequisite va optional status aniqroq bo'lishi kerak.

Qabul mezoni: CRS xatosi, stale bbox response va spatial leakage uchun fixture + expected natija; z26 elective; FG mezonlarining har biri avvalgi aniq dars va lab natijasiga xaritalangan bo'lsin.

### Frontend — 7/10

Kuchli: HTML → CSS → JS → TS → React, a11y, test va TeamOps API integration ketma-ketligi. FE1 semantik HTMLni sabab va misol bilan tushuntiradi.

Bo'shliq: props/state kabi boshlang'ich savoldan production capstone'iga o'tish keskin. FX1 va FE14 qisqa brief. React 19 namunalarini o'quv ilovasining React 18 dependency'siga nusxalash mumkin deb o'ylamasligi uchun alohida sample environment/version talabi kerak.

Qabul mezoni: bitta pinlangan starterda form validation, request cancellation, focus recovery va xatodan tiklanish uchun worked example + test; unseen UI bugni mustaqil tuzatish.

### Backend — 7/10

Kuchli: Node/TypeScript mustaqil yo'li, SQL, validation, auth, ORM, API, observability va OrderFlow/TeamOps bor. GeoPulse FastAPI bilan domenni takrorlamaslik chegarasi yozilgan.

Bo'shliq: BE8 misolida import qilinadigan service alohida ko'rsatiladi, to'liq ishga tushirish muhiti har snippetga bog'lanmagan. Controller/service ajratishning afzalligi tushuntirilgan, ammo "bunday kodni sinab bo'lmaydi" kabi absolyut gaplarni yumshatish kerak. Lab durable queue va authni hali tayyor bermaydi.

Qabul mezoni: race condition → transaction/unique constraint → retry/idempotency bo'yicha to'liq OrderFlow mashqi; eski va yangi API versiyasi uchun contract test; crashdan keyin jobning davom etishi dalili.

### Git & GitHub — 7.5/10

Kuchli: staging, branch, review, rebase, rescue va release oqimi o'zaro bog'langan; terminalda kichik amaliyot qilish oson. Scope boshqa kurslarga qaraganda torroq va dars bilan topshiriq mosligi yaxshiroq.

Bo'shliq: konflikt va history recovery holatlarini o'quvchi o'zi yasashi kerak. GT14 governance tavsifi qisqa. "Abadiy tarix" metaforasi reflog/garbage collection bilan chegaralanishi kerak.

Qabul mezoni: oldindan tayyorlangan repo fixtureda merge conflict, noto'g'ri reset va revert/rebase tanlovi; yakunda graph va diff kutilgan holatga mosligini tekshirish. Buyruqni yodlash emas, yo'qolgan ishni dalil bilan tiklash baholansin.

### Telegram Bot — 7/10

Kuchli: update, middleware, state, webhook, payment, Mini App va failure drilllar bor. Digital/physical payment yo'llarini ajratish foydali.

Bo'shliq: yuqoridagi payment namunasi va real HMAC/reference testlarining yetishmasligi. TL1 starter negative contractni tekshiradi, haqiqiy to'liq botni emas.

Qabul mezoni: test token talab qilmaydigan fixture bilan valid/expired/tampered initData; 429 retry_after; duplicate update; recurring payment va refund re-entry testlari. Keyin kichik haqiqiy bot smoke-testini foydalanuvchi alohida bajaradi.

### Cybersecurity — 6.5/10

Kuchli: scope/ruxsat, risk, network, Linux, AppSec, SOC, IR, evidence va report ajratilishi bor. CY8 vaqt/hash/timeline orqali xulosani dalilga bog'laydi.

Bo'shliq: keng AppSec/SOC/GRC yo'nalishlari nisbatan ixcham darslarga joylangan. Tanlangan triage misoli o'quvchining lokal hostiga tayanadi; ma'lum javobli log/capture fixture bilan analitik aniqlik tekshiruvi kuchsiz.

Qabul mezoni: xavfsiz lokal lab va anonim log dataset; normal hodisa bilan haqiqiy incidentni ajratish, false positive izohi, evidence chain va remediation retesti. Bitta asosiy rolga yo'l ko'rsatish, qolganlarini elective qilish.

### English — 6/10 (ishdagi muloqot laboratoriyalari kuchliroq)

Kuchli: 165 mashq, SRS, Job → GeoEN → AudioLab/WriteLab/WorkLab → Final; writing draft/revision, recording linki, reviewer izohi va eksport mavjud. Real Work Lab'da olti ish vaziyati bor.

Bo'shliq: A1, A2, B1, B2 har biri bitta umumlashtirilgan modul; ularning nomi o'sha darajani to'liq o'rgatishini isbotlamaydi. Diagnostika 2 quiz va qisqa mashqlar bilan haqiqiy placement bo'la olmaydi; u self-planning sifatida ishlatilishi kerak. Audio kutubxonada 3 tashqi dars bor; UI cheklovni halol yozadi, lekin kurs loyihasida "Three-accent meeting pack" nomi hali uch tasdiqlangan accent taassurotini beradi. Talaffuz feedbacki yuqorida qayd etilgan.

Qabul mezoni: CEFR can-do maqsadlari bo'yicha reading/listening/writing/speaking alohida diagnostika va exit task; har bosqichda graded matn/dialog; kamida bir nechta annotatsiyalangan draft → revision misoli; unseen meetingdan action items chiqarish. CEFR manbasi: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors

### Finance — 7/10

Kuchli: xarajat jurnali → byudjet → zaxira → qarz → moliyaviy xavfsizlik → reja. Amaliy shaxsiy artefaktlar mos. Bank tariflari shartnomaga qarab o'zgarishini ochiq aytadi.

Bo'shliq: ayrim quizlar atama tanishga qaratilgan; freelance cash-flow briefida hisoblangan worked example yo'q. Real foiz ayirmasi taxmin sifatida berilgan, ammo aniq formula bilan farqni ko'rsatish ta'limni kuchaytiradi. Bu audit bank/soliq tavsiyalarini tasdiqlamaydi.

Qabul mezoni: sun'iy o'quv datasetida notekis daromad, kredit komissiyasi va kechikkan invoice bilan uch oylik cash-flow; formula va tekshiruv javobi; alohida stress scenario. Real mijozning maxfiy pul ma'lumoti shart emas.

### Russian — 6/10

Kuchli: alifbo, zamon, kelishik, aspekt va dialoglardan ishdagi handoffga yo'l bor; 94 mashq.

Bo'shliq: keng grammatika mavzularida qisqa tavsif va oz kontekstli mashqlar. А2/Б1/Падежи bir mavzuning bosqichlari ekanini exit mezonlari bilan ajratish kerak; takror nomning o'zi zararli duplicate ekanini isbotlamaydi. Aspekt uchun bir marta/natija soddalashtirishi boshlang'ich qoida ekanini chegaralash kerak.

Qabul mezoni: holatga qarab aspekt/kelishik tanlash dialoglari, tabiiy audio va transcript, unseen suhbat, izohli yozuv revisioni. Texnik rus tili vazifalariga yaxshi/o'rtacha/xato namuna qo'shish.

### Arabic — 7/10, Qur'oniy matn o'qish yo'nalishi doirasida

Kuchli: alifbo → sarf/nahv → zaif fe'l → matn praktikumi → balag'at yo'li boshqa til kurslariga nisbatan mazmunan kengroq. AR15 finalida manba, til tahlili, tarjima taqqoslash va unseen matn talabi bor.

Bo'shliq: bu general conversational Arabic kursi emas; ish/kunlik muloqot darajasini va'da qilmasligi kerak. Inson talaffuz feedbacki va harakatsiz matnda xato tashxisini beradigan namunalar zarur. Arab matni, i'rob va diniy talqinlarning barcha faktlari bu auditda mutaxassis tomonidan tekshirilmagan.

Qabul mezoni: ustoz tekshirgan matn + audio + annotatsiyalangan tahlil; yangi matn bilan sarf/nahv transfer testi; foydalanuvchi yordami va noaniq tahlilni aniq qayd etish.

### AI Prompting — 6.5/10

Kuchli: task/context/format/constraints, iteratsiya, safety va P7 eval-driven final. Finalda 50+ case, holdout, regression, cost/latency va human review talab qilinadi.

Bo'shliq: boshlang'ich prompt shablonidan reproducible eval pipeline'iga sakrash katta. P4M tool calling misolini simulyatsiya deb yozgani yaxshi, lekin real workflow reference'i o'rgatish uchun yetarli emas. P1 dagi "bitta to'g'ri yo'l" va output barqarorligi haqidagi gaplar ehtimoliy natijani haddan tashqari soddalashtiradi.

Qabul mezoni: kichik anonim development/holdout fixture, deterministic schema checker, human rubric, baseline va revision solishtirish; bo'sh retrieval, rad etilgan tool, timeout va noto'g'ri JSON holatlari. Promptning aniqligi faktik to'g'rilik kafolati emasligi aniq yozilsin.

### System Design — 6/10

Kuchli: sodda restoran analogiyasidan frontend/API/DB/worker chegaralariga o'tadi; SLO, capacity, recovery, security, ADR va GeoOps vertical slice bor. 15 milestone bitta labga bog'langan.

Bo'shliq: 15 takror evidence savoli; ko'p advanced darslar asosan nimalarni hujjatlashtirishni aytadi. Generic visual qadam yorliqlari ayrim diagrammalarda mavzuga xos data/owner/failure farqini ochmaydi. Umumiy nazariyani boshqa domenga ko'chirish sinovi kam.

Qabul mezoni: bitta mukammal ishlangan design case (talab, trafik hisob-kitobi, data modeli, failure timeline, variantlar va qaror), so'ng e-commerce yoki booking bo'yicha unseen case; javobni tekshiradigan rubric va namunaviy xato tahlili.

### Technical Founder — 5/10

Kuchli: customer discovery, buyer/ICP, paid pilot, pricing, cash-flow, trust, AI va stop/change qarorlari to'g'ri qamrab olingan. Soxta tractionni dalil qilib ko'rsatmaslik qoidasi bor.

Bo'shliq: TF0–TF12 bir xil decision record va scoreboard bilan tuzilgan; ikkita takror quiz tijoriy fikrlashni tekshirmaydi. Pricing, cash-flow va funnel tushunchalarini haqiqiy sonlar bilan qanday ishlatishni o'rgatadigan to'liq misol kam. Blank shablon boshlovchiga uni qanday to'ldirishni ko'rsatmaydi.

Qabul mezoni: bitta anonim/sintetik GeoOps biznesi bo'yicha to'ldirilgan interview notes → ICP → offer → narx → cash-flow → pilot natijasi zanjiri. Har hisob taxminlari bilan yechilgan bo'lsin; keyin boshqa dataset bilan mustaqil vazifa. Real mijoz topilmagan holatda simulyatsiya va commercial validation statusi aniq ajratilsin; o'quv natijasini faqat pullik mijoz borligiga bog'lamaslik kerak.

## 9–9.5/10 maqsadiga borish tartibi

1. P1 noto'g'ri/ortiqcha signalni tuzatish: takror quizlar, pronunciation yorlig'i, final review statusi, z26 va payment namunalari.
2. Yangi kurs/modul ko'paytirishdan oldin mavjud core darslarga worked example, fixture va feedback qo'shish. ID va localStorage keylarini saqlash.
3. Har final mezonini oldingi dars, guided lab, independent task va reviewga xaritalash. Bir artefakt bir nechta kursga xizmat qilsa, contribution va rubricni ajratish.
4. Til kurslarida daraja nomidan oldin can-do va exit evidence; texnik kurslarda clean environmentda ishlaydigan starter va kutilgan output.
5. Kamida kichik boshlovchi/tajribali o'quvchi pilotida qayerda tiqilish, hint ehtiyoji, unseen task natijasi va bir necha hafta keyingi retentionni qayd etish. Guruh hajmi va cheklovlarni yozish; kichik pilotni statistik isbot deb ko'rsatmaslik.
6. Shundan keyin ballni qayta ko'rish. Kontent qo'shilganining o'zi avtomatik 9.5 degani emas.

## Texnik tekshiruv va qayta bajarish

- `npm test`: **19 test fayli, 144 test o'tdi**.
- `npm run build`: prebuild testlar, TypeScript va Vite production build **o'tdi**.
- `npm run test:e2e`: **Chromium'da 7/7 test o'tdi** (9.9 soniya). Kurs almashish, direct link, extensionlar, writing draft/eksport, backup, storage xatosi va course download recovery oqimlari tekshirildi.
- Kurs inventari: `node scripts/audit-education.mjs`. Skript faqat o'qiydi va stdout'ga hisobot chiqaradi, ball bermaydi.
- Kontent validatori struktura va finalning mavjudligini tekshiradi; tashqi havolaning ochilishi, quiz pedagogik sifati yoki kod namunalarining to'g'riligini to'liq tekshirmaydi.
- Docker lablar, tashqi audio xizmatlari, haqiqiy payment, har bir dars kodi va deploy bu auditda to'liq bajarilmadi.

Audit mahsuloti: ushbu hisobot va qayta bajariladigan inventar skripti. Kurs kontenti, module ID, localStorage yoki progress bu auditda o'zgartirilmadi; commit/push qilinmadi.
