# SkillMap

## Qo'shimcha yo'l xaritasi

- [GeoPulse flagship loyiha va 3 oylik reja](docs/flagship-geospatial-roadmap.md)

Bitta ilova, aniq ierarxiyadagi **o'n ikkita kurs**:

- **Main Career Track — Geospatial Full-Stack Engineering:** React TS / MapLibre / FastAPI / PostGIS / GDAL / GeoAI / Docker. YOLO GeoAI ichidagi object detection va segmentation vositalaridan biri.
- **Supporting Skills:** Frontend va Backend alohida chuqur kurslar; full-stack product loyihalari shu ikki kurs ichiga taqsimlangan. Git & GitHub, Telegram Bot, Cybersecurity, English va AI Prompting asosiy geospatial yo'lni mahsulot, delivery, xavfsizlik va muloqot tomondan kuchaytiradi.
- **Personal Development:** Moliya, Rus tili va Arab tili professional trekdan mustaqil shaxsiy rivojlanish yo'nalishlari.

React 18 / TypeScript / Vite. Tashqi UI kutubxonasiz, sof CSS.

## Ishga tushirish

Node.js (LTS) va Python 3 kerak.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ ga yig'ish
npm test         # lib mantiqi testlari (vitest)
```

## GeoPulse professional laboratoriyasi

`labs/geopulse/` - kursdagi nazariyani haqiqiy productionga yaqin tizimda bajarish uchun
ishlaydigan boshlang'ich loyiha. Unda React/TypeScript/MapLibre frontend, FastAPI backend,
PostGIS ma'lumotlar bazasi, Nginx gateway, testlar, smoke-test va GitHub Actions pipeline bor. Maqsadli arxitektura — **modular monolith + Redis/Celery background worker + PostGIS**; microservice, Kubernetes yoki Kafka faqat o'lchangan ehtiyoj bo'lsa ADR orqali ko'rib chiqiladi.

```bash
cd labs/geopulse
docker compose up --build --wait
./scripts/smoke-test.sh
docker compose down --volumes
```

Windows PowerShell'da smoke-test uchun `./scripts/smoke-test.ps1` ishlatiladi. Bosqichlar,
dalillar va professional baholash mezonlari [lab qo'llanmasida](labs/geopulse/README.md) yozilgan.

## Backend Reliability Lab

`labs/backend-api/` — Backend supporting-skill kursi uchun alohida Node.js Docker Compose starter. U GeoPulse'ning default backend'i emas; GeoPulse FastAPI-first arxitekturada qoladi. Lab Node API,
PostgreSQL va Redis readiness tekshiruvini hamda in-memory idempotency contractini ishga tushiradi.
Durable queue, auth, telemetry va migrationlar tayyor deb da'vo qilinmaydi — ular evidence bilan
bajariladigan milestone sifatida [lab qo'llanmasida](labs/backend-api/README.md) yozilgan.

Backend kursining mustaqil Node.js/TypeScript production yo'li va yakuniy portfolio talablari
[Professional Backend roadmap](docs/backend-professional-roadmap.md)da berilgan. GeoPulse'ning optional
webhook/worker integration moduli Geospatial kursining yakunida; uning asosiy stacki FastAPI/Python bo'lib qoladi.

## Telegram Production Lab

`labs/telegram-bot/` Telegram kursining executable companion'i. U webhook secret,
duplicate update idempotency va Mini App invalid-session contractlarini testlaydi; unga mos
GitHub Actions quality gate ham bor. grammY handler, persistent database/queue va haqiqiy
Mini App HMAC verification starterda tayyor deb ko'rsatilmaydi — ular evidence milestone'laridir.

## Quality, sync va deploy preparation

- Root GitHub Actions gate TypeScript/unit test/build hamda Playwright E2E oqimlarini tekshiradi.
- `npm run test:e2e` Vite test serverini o'zi boshqarib, test tugashi bilan yopadi; Windows va CI'da
  orphan process qoldirmaydi.
- AI Playground **BYOK** modelida ishlaydi: loyiha API kalitni qabul qilmaydi yoki saqlamaydi; kalit
  faqat browserning joriy sessiyasida turadi va tanlangan provayderga bevosita yuboriladi. Production
  server secret yoki umumiy loyiha kaliti sifatida ishlatilmaydi.
- `services/skillmap-sync/` local-first progress uchun optional cloud-sync contractini hujjatlashtiradi;
  real identity provider, database va privacy qarorisiz u yoqilmaydi.
- GeoPulse public deploy uchun [deployment runbook](labs/geopulse/docs/deployment-runbook.md) bor;
  hosting va secretlar qo'yilmaguncha u live deployment emas.

## Frontend + Backend ichidagi Full-Stack loyihalar

Full-stack productlar alohida sidebar kursi emas. Frontend kursidagi API integration moduli React
client, loading/empty/error UX va typed contractni beradi; Backend kursidagi TeamOps Board va
OrderFlow modullari Node/PostgreSQL/Redis, idempotency, worker va recovery'ni beradi. Yakuniy
capstone'larda shu ikkisi bir mahsulot sifatida topshiriladi. Bu GeoPulse'dan alohida
Node.js/TypeScript portfolio dalili; GeoPulse esa FastAPI/PostGIS geospatial flagship bo'lib qoladi.

## Deploy (Netlify / Vercel)

Loyiha statik SPA - `dist/` ni istalgan statik hostga qo'yish mumkin.

- **Netlify:** `netlify.toml` tayyor. Git ulang yoki `npm run build` qilib `dist/` ni drag-drop qiling. SPA redirect avtomatik.
- **Vercel:** `vercel.json` tayyor. Repo'ni import qiling - build buyrug'i va chiqish papkasi o'qiladi.

`vite.config.ts` da `base: "./"` - ildizda ham, subkatalogda (masalan GitHub Pages) ham ishlaydi.

## Kurslar bir-biriga xalaqit bermaydi

- Yon panel tepasidagi kurs almashtirgich bilan kurslar orasida o'tasan.
- Har kursning **progressi va test natijalari alohida** saqlanadi:
  `webgis_*`, `frontend_*`, `backend_*`, `git_*`, `telegram_*`, `cybersecurity_*`,
  `english_*`, `finance_*`, `russian_*`, `arabic_*`, `prompting_*` (progress / quiz / srs - localStorage).
  Kunlik seriya - `myacademy_streak`.
- Tayyorlik paneli ham har kurs uchun **alohida** hisoblanadi.
- Har kursning o'z urg'u rangi bor (English binafsha, Moliya yashil, Cybersecurity qizil,
  Telegram ko'k, AI Prompt pushti, Frontend to'q sariq, Backend oltin sariq, Git lime yashil,
  Rus tili och ko'k, Arab tili moviy/cyan...) - qaysi kursdaliging darrov bilinadi.
- Kurs kontenti lazy-load qilinadi - faqat ochilgan kursning JSON'i yuklanadi.
- **URL hash-router:** har modul/bo'limning o'z havolasi bor - `#webgis/z5`, `#english/dash`.
  Sahifani yangilasang joyingda qolasan, havolani ulashsang boshqalar ham o'sha modulga tushadi.
  Brauzer orqaga/oldinga tugmalari ishlaydi (`lib/router.ts`).

## Tuzilishi

```
src/
  data/
    webgis.json        Geospatial kursning z0->z32 asosiy modullari
    webgis-foundations.ts Spatial fundamentals va professional GeoPython modullari
    webgis-modern.ts   OGC API, cloud-native raster/vector, GeoAI, 3D va field reliability
    webgis-flagship.ts Mustaqil reviewerli GeoPulse flagship assessment
    webgis-enhancements.ts Qo'shimcha modullarni asosiy ketma-ketlikka biriktiradi
    frontend.json      Frontend kursi (14 modul: FE0->FE13)
    backend.json       Backend kursi (14 modul: BE0->BE13)
    fullstack-bridges.ts Frontend/Backend ichiga biriktirilgan full-stack project modullari
    git.json           Git & GitHub kursi (14 modul: GT0->GT13)
    telegram.json      Telegram Bot kursi (11 asosiy modul: TG0->TG10; TG9 advanced arxitektura, TG10 yakuniy capstone)
    telegram-enhancements.ts Telegram production failure-drill moduli (TL1)
    cybersecurity.json Cybersecurity kursi (15 modul: CY0->CY14)
    english.json       English kurs (14 modul: A0->B2 + 4 ko'nikma + Exam + Idm)
    finance.json       Moliya kursi (12 modul: F0->F11)
    russian.json       Rus tili kursi (12 modul: Алф->Фин)
    arabic.json        Arab tili kursi (16 modul: AR0->AR11 asosiy + AR12->AR15 professional trek; Qur'on va islomiy adabiyot o'qishga yo'naltirilgan)
    prompting.json     AI Prompt kursi (9 modul; RAG/tool-calling + Playground bilan)
    courses.ts         kurslar registri (brand + kitoblar + lazy-load)
  types.ts
  lib/router.ts      hash-router (#kurs/modul havolalari)
  lib/content.ts     kurs JSON'lari validatsiyasi
  lib/migrate.ts     bir martalik localStorage migratsiyalari (webgis zoom kalitlari)
  lib/highlight.ts   sintaksis ranglagich
  lib/storage.ts     localStorage + clipboard
  lib/speech.ts      talaffuz (Web Speech API)
  lib/srs.ts         interval takror (Leitner)
  lib/streak.ts      kunlik odat hisoblagichi
  lib/backup.ts      progress eksport/import
  lib/pwa.ts         service worker ro'yxatga olish
  store.tsx          kurs-aware: progress + test + srs + streak + backup + toast
  components/        TopBar, Sidebar (+switcher), ModuleView, CodeBlock,
                     Quiz, Exercises, Flashcards, Reference, Search,
                     Dashboard, Playground, Books, RichHtml, Topo
  App.tsx, main.tsx, styles.css
public/
  manifest.webmanifest, sw.js, icon.svg   (PWA / offline)
```

## Yangi imkoniyatlar

- **Interval takror (SRS):** Lug'at flashcardlari Leitner qutilari bilan ishlaydi - `Qiyin / Bilaman / Oson` baholaysan, so'z keyingi takrorga reja bo'yicha qaytadi (`lib/srs.ts`). Klaviatura: Space - ag'dar, 1/2/3 - baho, -> - keyingisi.
- **Kunlik odat (streak):** har o'rganish harakati kunlik seriyani oshiradi; Dashboard'da Streak joriy va eng yaxshi seriya ko'rinadi (`lib/streak.ts`).
- **Zaxira (eksport/import):** Dashboard'dan butun progressni JSON faylga eksport qil yoki tiklab ol (`lib/backup.ts`) - localStorage yo'qolsa ham ma'lumot saqlanadi.
- **Zaxira eslatmasi:** progress bor-u, zaxira 14 kundan eski (yoki umuman qilinmagan) bo'lsa, Dashboard'da eslatma chiqadi - ma'lumot yo'qolishining oldini oladi.
- **Global qidiruv:** yon paneldagi *Qidiruv* - darslar, topshiriqlar, lug'at, grammatika va testlar bo'ylab qidirib, to'g'ridan-to'g'ri modulga o'tadi.
- **Kitoblar:** har kursga o'qish tartibi bilan tavsiya kitoblar ro'yxati biriktirilgan - tegishli modulda kitob eslatmasi chiqadi (`data/courses.ts`, `components/Books.tsx`).
- **Tinglash va talaffuz mashqlari (til kurslari):** `listen` turidagi mashq jumlani ovoz bilan o'qiydi, sen eshitganingni yozasan; `speak` turida sen talaffuz qilasan, brauzer nutqni tanib tekshiradi (English, Rus tili, Arab tili - `lib/speech.ts`).
- **Offline / PWA:** ilova service worker bilan internetsiz ishlaydi va telefonga "o'rnatiladi" (`public/sw.js`, `manifest.webmanifest`).
- **Geospatial professional trek:** 44 modulda spatial fundamentals, JS/TS'dan Python ko'prigi, GeoPython/xarray, FastAPI/PostGIS, MapLibre, GDAL/COG/STAC, OGC API/GeoParquet/PMTiles, PyTorch asosidagi GeoAI (YOLO, segmentation, land-cover, change detection, satellite embeddings), offline field sync, observability/security/testing/system design va mustaqil GeoPulse flagship assessment bor.
- **Bajariladigan capstone:** `labs/geopulse/` ichida frontend, API, PostGIS, Nginx, Docker, testlar va CI bilan real starter repository berilgan; talaba uni milestone'lar bo'yicha production portfolio darajasiga olib chiqadi.
- **Frontend + Backend ichidagi Full-Stack loyihalar:** TeamOps Board va OrderFlow orqali React/Node/PostgreSQL/Redis productlarini qurish; finalda deploy, CI, reliability evidence va external defense talab qilinadi.
- **Telegram production lab:** webhook secret, duplicate update va Mini App invalid-session uchun executable contract testlari; keyingi milestone'lar 429 retry, persistent storage va real HMAC verificationni talab qiladi.
- **Quiz klaviaturasi:** raqam tugmalari birinchi javob berilmagan savol variantini tanlaydi.
- **Talaffuz / audio:** flashcard va dars misollaridagi Audio tugmasi so'z/jumlani brauzer ovozi (Web Speech API) bilan o'qiydi - o'rnatish shart emas. Til kursiga qarab ovoz tili avtomatik: English `en-US`, Rus tili `ru-RU`, Arab tili `ar-SA`.
- **Arab tili kursi:** Qur'on va islomiy adabiyotlarni o'qishga yo'naltirilgan 16 modul: asosiy kurs (alifbo -> harakatlar -> nahv/sarf -> i'rob -> Qur'on matni tahlili -> hadis va o'rta yakuniy baholash) + **professional trek** (zaif fe'llar to'liq, 300 so'zlik chastota lug'ati, Oyatul-Kursiy va tafsir uslubidagi matn praktikumi, balag'at asoslari va professional yakuniy loyiha). Barcha arabcha matn to'liq harakatli, transliteratsiya va tarjima bilan; arabcha satrlar `.ar-line` klassi orqali kattaroq va o'ngdan chapga ko'rsatiladi (`styles.css`).
- **Vizual diagrammalar:** dars matnlarida inline SVG sxemalar (oqim, arxitektura, jarayon) - 11 kurs bo'ylab 160+ diagramma. `.svgfig` CSS klassi orqali mavzuga (dark/light) ergashadi va responsive (`styles.css`). Diagramma qo'shish: doc HTML ichiga `<figure class='svgfig'><svg viewBox=...>...</svg><figcaption>..</figcaption></figure>` - ranglar uchun `.box/.boxa/.edge/.edga/.muted/.accent` klasslaridan foydalan (rang hardkod qilinmaydi).

## Testlar va kontent validatsiyasi

`npm test` - sof mantiq (SRS, streak, backup, router), komponentlar (Quiz, Flashcards, store)
va **kontent validatsiyasi** uchun vitest testlari.

Kontent validatsiyasi (`src/lib/content.ts` + `src/data/content.test.ts`) barcha kurs JSON'larini
tekshiradi: quiz javob indeksi chegarada, task id'lari takrorlanmagan, resurs URL'lari to'g'ri,
mashq maydonlari to'liq va h.k. `npm run build` avval testlarni ishga tushiradi (`prebuild`) -
xato kontent deploy'ga chiqmaydi.

## Kontentni o'zgartirish

`src/data/` dagi tegishli kurs JSON'ini tahrirla (masalan `webgis.json`, `frontend.json`) - har modul:
doc (HTML), code[], tasks[] (id+html+crit), quiz[] (q/a/c/w), resources[], project.
Yangi kurs qo'shish uchun `src/data/courses.ts` da registrga meta + loader yozasan.
