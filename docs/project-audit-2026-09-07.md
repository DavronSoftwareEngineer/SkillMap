# SkillMap: funksional audit va tuzatishlar

## Qamrov

Asosiy React/TypeScript ilovasi, kurs yuklash/navigatsiya, 13 kursning 224 moduli,
qidiruv, progress/backup, quiz, workshop, AI Playground, HTML render xavfsizligi,
service worker va deploy headerlari ko‘rildi. Oldingi kurs o‘zgarishlari saqlandi.
Bu hujjat real tashqi API, barcha manba havolalari yoki har darsning ilmiy mazmuni
mutlaq tekshirildi degan da’vo emas.

## Topilgan va tuzatilgan muammolar

| Muhimlik | Muammo | Tuzatish / dalil |
| --- | --- | --- |
| P1 | SW activate boshqa ilovalarning cachelarini ham o‘chirardi | Faqat `skillmap-` prefiksli eski keshlar; alohida regression test |
| P1 | Navigatsiyadagi 503/xato javobi offline shellni almashtirardi | Faqat muvaffaqiyatli HTML saqlanadi; xatoda mavjud shell; offline miss uchun haqiqiy 503 |
| P1 | SVG `xlink:href` va animation attribute yo‘llari sanitizerda yopilmagan | Xavfli URL, animation, foreignObject, srcset/ping olib tashlandi; xavfsiz path/link saqlanishi testlangan |
| P1 | To‘g‘ri JSON, ammo noto‘g‘ri shakldagi saved state dashboardni buzishi mumkin | Progress/quiz/SRS/streak o‘qishda mavjud schema validatsiyasi; raw qiymat recovery uchun o‘chirilmaydi |
| P2 | Cache hit bo‘lsa ham tarmoqqa ortiqcha request ketardi; arbitrary GET cachelanardi | Public same-origin assetlarda cache-first; API va external so‘rovlarga tegilmaydi |
| P2 | Yangi workshop/case matni va task mezoni qidirilmasdi | Qidiruv indeksi kengaytirildi; modules o‘zgarganda qayta hisoblanadi |
| P2 | Tasklar faqat sichqoncha bilan belgilangan | Focusable checkbox semantikasi, Enter/Space va persisted state E2E |
| P2 | AI request cheksiz kutilishi yoki eski provider javobi bilan chalkashishi mumkin | AbortController, 60s timeout, cancel, unmount cleanup, provider switch lock |
| P2 | BYOK matni kalitning sessionStorage’da saqlanishini yetarlicha aniq aytmagan | Browser-local saqlash, origin skriptlari uchun ochiqlik va clear-key zarurati yozildi |
| P2 | Deploy microphone policy birinchi tomon mikrofon foydalanishini ham taqiqlagan | Netlify/Vercel `microphone=(self)`; user permission va browser support baribir kerak |
| P2 | Dev dependencies’da 8 audit ogohlantirishi | Mos transitive patchlar: nanoid 3.3.18, postcss 8.5.28, undici 7.29.1; major almashtirilmagan |

## Qarorlar va trade-off

- Arxitektura o‘zgarmadi: offline-first statik o‘quv ilovasi; accounts/cloud sync qo‘shilmadi.
- Cache faqat public assetlar uchun. Tashqi font/audio/API endi offline kafolatiga kirmaydi.
  O‘quvchi hali ochmagan lazy-loaded kurs internet bo‘lmasa mavjud bo‘lmasligi mumkin.
- Sanitizer qo‘shimcha himoya; untrusted CMS/import uchun bu custom sanitizerning
  o‘zi security audit o‘rnini bosa olmaydi. Repository kontenti asosiy ishonch chegarasi.
- BYOK saqlandi, server proxy qo‘shilmadi. Bekor qilish lokal kutishni to‘xtatadi;
  provider allaqachon hisoblagan token to‘lovi qaytarilishini kafolatlamaydi.
- Noto‘g‘ri saqlangan state UI’da fallback bilan ochiladi, diskdagi raw dalil
  saqlanadi. Bu buzilgan tarixni avtomatik to‘liq tiklash emas.
- Module/task ID va localStorage keylari o‘zgartirilmadi. Oldingi uncommitted
  kurs ishlari, FieldVision `output/` va `tools/` fayllari olib tashlanmadi.

## Tekshiruvlar

- `npm run build`: 27 Vitest fayli / 181 test, TypeScript va production build o‘tdi.
- `npm audit --json`: prod + dev bo‘yicha 0 ma’lum vulnerability (shu tekshiruv vaqtida).
- Python System Design laboratoriyasi: 11/11 test o‘tdi.
- `git diff --check`: whitespace xatosi yo‘q; faqat Windows LF/CRLF ogohlantirishlari.
- Browser regression: 24/24 Chromium E2E test o‘tdi (1.4 daqiqa). All-modules testi har bir 224 modulning mavjud panelini ochadi;
  qolgan testlar search→module, keyboard progress, corrupted state, writing persistence,
  backup/restore, recovery, mobile va kirill navigatsiyani tekshiradi.

## Tashqi tekshiruv chegaralari

Haqiqiy pullik AI so‘rovi, real mikrofon/browser speech service, Netlify deploydagi
headerlarning live javobi, production service-worker upgrade/offline lifecycle,
GeoPulse PostGIS/GPU/cloud integratsiyasi va barcha tashqi resurs URLlari bu turn’da
tekshirilmadi. SW mantig‘i izolyatsiyalangan VM testlarida, UI esa Chromium dev
serverda tekshirildi. Shuning uchun butun tizimda hech qanday bug qolmadi deyilmaydi.
Commit/push/deploy bajarilmadi.
