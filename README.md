# SkillMap

## Qo'shimcha yo'l xaritasi

- [GeoPulse flagship loyiha va 3 oylik reja](docs/flagship-geospatial-roadmap.md)

Bitta ilova, **o'n bitta mustaqil kurs**:
- **Geospatial** - WebGIS Full-Stack (React TS, MapLibre, FastAPI/Python, PostGIS, GDAL/Rasterio/YOLO, Docker/Nginx/Redis)
- **Frontend** - 0 dan Senior gacha (HTML, CSS, JS, TS, React)
- **Backend** - 0 dan Senior gacha (Node.js, TypeScript, DB, API, DevOps)
- **Git & GitHub** - 0 dan Senior gacha (Git, GitHub, GitLab, branching, rebase, CI/CD, jamoa workflow)
- **Telegram Bot** - Bot API, Webhook, Mini Apps, Payments (Node.js/TS)
- **Cybersecurity** - defensive security, network, web, cloud, SOC, IR va GRC
- **English** - 0 dan IELTS gacha (A1->B2 + Listening/Reading/Writing/Speaking)
- **Moliya** - Moliyaviy savodxonlik (byudjet -> jamg'arma -> qarz -> xavfsizlik -> investitsiya)
- **Rus tili** - 0 -> B1 (kirill alifbosi, kelishiklar, fe'l aspekti, suhbat; talaffuz audiosi bilan)
- **Arab tili** - 0 dan professionalgacha (alifbo, tajvid asoslari, nahv, sarf; Qur'on va islomiy adabiyotlarni o'qishga yo'naltirilgan)
- **AI Prompt** - AI bilan ishlash (prompting, aniqlik, rol, few-shot, xavfsizlik; interaktiv Playground bilan)

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

- Yon panel tepasidagi kurs almashtirgich bilan kurslar orasida o'tasan.
- Har kursning **progressi va test natijalari alohida** saqlanadi:
  `webgis_*`, `frontend_*`, `backend_*`, `git_*`, `telegram_*`, `cybersecurity_*`,
  `english_*`, `finance_*`, `russian_*`, `arabic_*`, `prompting_*` (progress / quiz / srs - localStorage).
  Kunlik seriya - `myacademy_streak`.
- Tayyorlik paneli ham har kurs uchun **alohida** hisoblanadi.
- Har kursning o'z urg'u rangi bor (English binafsha, Moliya yashil, Cybersecurity qizil,
  Telegram ko'k, AI Prompt pushti, Frontend to'q sariq, Backend oltin sariq, Git lime yashil...) -
  qaysi kursdaliging darrov bilinadi.
- Kurs kontenti lazy-load qilinadi - faqat ochilgan kursning JSON'i yuklanadi.
- **URL hash-router:** har modul/bo'limning o'z havolasi bor - `#webgis/z5`, `#english/dash`.
  Sahifani yangilasang joyingda qolasan, havolani ulashsang boshqalar ham o'sha modulga tushadi.
  Brauzer orqaga/oldinga tugmalari ishlaydi (`lib/router.ts`).

## Tuzilishi

```
src/
  data/
    webgis.json        Geospatial kurs (33 modul, z0->z32: JS/TS -> Python ko'prigi + FastAPI/PostGIS/AI-GIS/Senior + Production Lab Track + Advanced (AWS/K8s, Queue, MLOps, 3D reconstruction, Edge/GeoDjango) + Final; z32 Karyera oxirida)
    webgis-flagship.ts GeoPulse flagship moduli (webgis'ga runtime'da qo'shiladi)
    frontend.json      Frontend kursi (14 modul: FE0->FE13)
    backend.json       Backend kursi (14 modul: BE0->BE13)
    git.json           Git & GitHub kursi (14 modul: GT0->GT13)
    telegram.json      Telegram Bot kursi (11 modul: TG0->TG10; TG9 advanced arxitektura, TG10 yakuniy capstone)
    cybersecurity.json Cybersecurity kursi (15 modul: CY0->CY14)
    english.json       English kurs (14 modul: A0->B2 + 4 ko'nikma + Exam + Idm)
    finance.json       Moliya kursi (12 modul: F0->F11)
    russian.json       Rus tili kursi (12 modul: Алф->Фин)
    arabic.json        Arab tili kursi (12 modul: AR0->AR11; Qur'on va islomiy adabiyot o'qishga yo'naltirilgan)
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
- **Tinglash mashqi (English):** `listen` turidagi mashq jumlani ovoz bilan o'qiydi, sen eshitganingni yozasan - darhol tekshiriladi.
- **Offline / PWA:** ilova service worker bilan internetsiz ishlaydi va telefonga "o'rnatiladi" (`public/sw.js`, `manifest.webmanifest`).
- **Geospatial kengaytirildi:** JS/TS biladiganlar uchun Python ko'prigi, professional tartib, arxitektura chizmalari, FastAPI/PostGIS/GDAL/YOLO misollari, Senior performance/security/testing/system-design bloklari va production checklistlari qo'shildi.
- **Quiz klaviaturasi:** raqam tugmalari birinchi javob berilmagan savol variantini tanlaydi.
- **Talaffuz / audio:** flashcard va dars misollaridagi Audio tugmasi so'z/jumlani brauzer ovozi (Web Speech API) bilan o'qiydi - o'rnatish shart emas.
- **Vizual diagrammalar:** dars matnlarida inline SVG sxemalar (oqim, arxitektura, jarayon) - 10 kurs bo'ylab 140+ diagramma. `.svgfig` CSS klassi orqali mavzuga (dark/light) ergashadi va responsive (`styles.css`). Diagramma qo'shish: doc HTML ichiga `<figure class='svgfig'><svg viewBox=...>...</svg><figcaption>..</figcaption></figure>` - ranglar uchun `.box/.boxa/.edge/.edga/.muted/.accent` klasslaridan foydalan (rang hardkod qilinmaydi).

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
