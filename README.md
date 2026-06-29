# SkillMap

## Qo'shimcha yo'l xaritasi

- [GeoPulse flagship loyiha va 3 oylik reja](docs/flagship-geospatial-roadmap.md)

Bitta ilova, **oltita mustaqil kurs**:
- **Geospatial** - WebGIS Full-Stack (React TS, MapLibre, FastAPI/Python, PostGIS, GDAL/Rasterio/YOLO, Docker/Nginx/Redis)
- **English** - 0 dan IELTS gacha (A1->B2 + Listening/Reading/Writing/Speaking)
- **Moliya** - Moliyaviy savodxonlik (byudjet -> jamg'arma -> qarz -> xavfsizlik -> investitsiya)
- **Rus tili** - 0 -> B1 (kirill alifbosi, kelishiklar, fe'l aspekti, suhbat; talaffuz audiosi bilan)
- **AI Prompt** - AI bilan ishlash (prompting, aniqlik, rol, few-shot, xavfsizlik; interaktiv Playground bilan)
- **Cybersecurity** - defensive security, network, web, cloud, SOC, IR va GRC

React 18 / TypeScript / Vite. Tashqi UI kutubxonasiz, sof CSS.

## Ishga tushirish

Node.js (LTS) va Python 3 kerak.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ ga yig'ish
npm test         # lib mantiqi testlari (vitest)
```

## Deploy (Netlify / Vercel)

Loyiha statik SPA - `dist/` ni istalgan statik hostga qo'yish mumkin.

- **Netlify:** `netlify.toml` tayyor. Git ulang yoki `npm run build` qilib `dist/` ni drag-drop qiling. SPA redirect avtomatik.
- **Vercel:** `vercel.json` tayyor. Repo'ni import qiling - build buyrug'i va chiqish papkasi o'qiladi.

`vite.config.ts` da `base: "./"` - ildizda ham, subkatalogda (masalan GitHub Pages) ham ishlaydi.

## Kurslar bir-biriga xalaqit bermaydi

- Yon panel tepasidagi **Geospatial / English** tugmasi bilan almashasan.
- Har kursning **progressi va test natijalari alohida** saqlanadi:
  `webgis_*`, `english_*`, `finance_*`, `russian_*`, `prompting_*` (progress / quiz / srs - localStorage). Kunlik seriya - `myacademy_streak`.
- Tayyorlik paneli ham har kurs uchun **alohida** hisoblanadi.
- English kursi **binafsha**, Geospatial **feruza** urg'u rangida - qaysi kursdaliging darrov bilinadi.

## Tuzilishi

```
src/
  data/
    webgis.json      Geospatial kurs (21 modul: JS/TS -> Python ko'prigi + professional FastAPI/PostGIS/AI-GIS/Senior tartibida)
    english.json     English kurs (12 modul: A0->Exam)
    finance.json     Moliya kursi (10 modul: F0->F9)
    russian.json     Rus tili kursi (10 modul: Алф->Речь)
    prompting.json   AI Prompt kursi (6 modul; Playground bilan)
    cybersecurity.json Cybersecurity kursi (12 modul: CY0->CY11)
    courses.ts       kurslar registri (brand + tab nomlari)
  types.ts
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
                     Dashboard, Playground, RichHtml, Topo
  App.tsx, main.tsx, styles.css
public/
  manifest.webmanifest, sw.js, icon.svg   (PWA / offline)
```

## Yangi imkoniyatlar

- **Interval takror (SRS):** Lug'at flashcardlari Leitner qutilari bilan ishlaydi - `Qiyin / Bilaman / Oson` baholaysan, so'z keyingi takrorga reja bo'yicha qaytadi (`lib/srs.ts`). Klaviatura: Space - ag'dar, 1/2/3 - baho, -> - keyingisi.
- **Kunlik odat (streak):** har o'rganish harakati kunlik seriyani oshiradi; Dashboard'da Streak joriy va eng yaxshi seriya ko'rinadi (`lib/streak.ts`).
- **Zaxira (eksport/import):** Dashboard'dan butun progressni JSON faylga eksport qil yoki tiklab ol (`lib/backup.ts`) - localStorage yo'qolsa ham ma'lumot saqlanadi.
- **Global qidiruv:** yon paneldagi *Qidiruv* - darslar, topshiriqlar, lug'at, grammatika va testlar bo'ylab qidirib, to'g'ridan-to'g'ri modulga o'tadi.
- **Tinglash mashqi (English):** `listen` turidagi mashq jumlani ovoz bilan o'qiydi, sen eshitganingni yozasan - darhol tekshiriladi.
- **Offline / PWA:** ilova service worker bilan internetsiz ishlaydi va telefonga "o'rnatiladi" (`public/sw.js`, `manifest.webmanifest`).
- **Geospatial kengaytirildi:** JS/TS biladiganlar uchun Python ko'prigi, professional tartib, arxitektura chizmalari, FastAPI/PostGIS/GDAL/YOLO misollari, Senior performance/security/testing/system-design bloklari va production checklistlari qo'shildi.
- **Quiz klaviaturasi:** raqam tugmalari birinchi javob berilmagan savol variantini tanlaydi.
- **Talaffuz / audio:** flashcard va dars misollaridagi Audio tugmasi so'z/jumlani brauzer ovozi (Web Speech API) bilan o'qiydi - o'rnatish shart emas.

## Testlar

`npm test` - sof mantiq (SRS, streak, backup) uchun vitest testlari (`src/lib/*.test.ts`).

## Kontentni o'zgartirish

`src/data/webgis.json` yoki `src/data/english.json` ni tahrirla - har modul:
doc (HTML), code[], tasks[] (id+html+crit), quiz[] (q/a/c/w), resources[], project.
