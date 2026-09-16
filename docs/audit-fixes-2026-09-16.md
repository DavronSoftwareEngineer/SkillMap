# SkillMap audit tuzatishlari — 2026-09-16

## Bajarilgan ishlar

1. `src/lib/learning-storage.ts`, `src/store.tsx`: progress, quiz, SRS va streak
   eng yangi saqlangan holatdan yangilanadi. HTTPS/localhost'da Web Locks bir
   kalitdagi parallel tab yozuvlarini navbatga qo'yadi. Storage event ochiq
   tabdagi natijalarni yangilaydi, kursni majburan almashtirmaydi. React state
   updater ichida storage yozish yo'q. Yaroqsiz JSON/schema ustiga yozilmaydi;
   yozish muvaffaqiyatsiz bo'lsa UI muvaffaqiyatli saqlandi deb ko'rsatmaydi.
2. `EnglishWorkLab`: null, array, noto'g'ri record va buzilgan JSON xavfsiz
   o'qiladi. Yaroqli yozuvlar ko'rsatiladi; buzilgan asl ma'lumot o'zgarmaydi.
   Yangi draft xotirada qoladi, Markdown eksport va yaroqli backupdan tiklash
   mavjud. Saqlanmagan draft sahifa yopilsa yo'qolishi mumkin.
3. `BookReader`, `GoogleBookViewer`, `Books`: rasmiy manba/Google Books xavfsiz
   yangi tabda ochiladi (`noopener noreferrer`). CSP yumshatilmadi. Ichki
   iframe/Google skriptiga bog'liqlik olib tashlandi. Tashqi manba availability,
   login, narx yoki publisher preview cheklovlari kafolatlanmaydi.
4. Root va GeoPulse Vitest `4.1.11`ga yangilandi. GeoPulse alohida auditida
   aniqlangan MapLibre zaifligi uchun `6.4.1`, nanoid/postcss uchun mos
   lockfile yangilanishlari qo'llandi. MapLibre v6 named imports va Vite orqali
   alohida ESM worker URL bilan moslashtirildi. Bu laboratoriya endi zamonaviy
   ES2022/WebGL2 brauzerini talab qiladi.
5. Backend laboratoriyasi uchun alohida `backend-lab.yml`: Node contract
   testlari, Compose validation, servislar readiness/liveness smoke testi.
6. Asosiy CI'ga production CSP testi; GeoPulse CI'ga mock data bilan haqiqiy
   WebGL render/popup/zoom testi qo'shildi. Progress concurrency va English
   recovery uchun regression testlar qo'shildi.

## Mahalliy tekshiruv natijalari

| Buyruq | Natija |
| --- | --- |
| `npm run build` | 221 unit test, TypeScript va production build o'tdi |
| `npm run test:e2e` | 31 Chromium testi o'tdi; 224 modul render oqimi ham qamralgan |
| `npm run test:production` | Build + aynan Netlify CSP ostida ikkala kitob havolasi ochildi; CSP violation yo'q |
| `node --test labs/backend-api/api/test/*.node.mjs labs/telegram-bot/api/test/*.node.mjs` | 6 test o'tdi |
| GeoPulse frontend: `npm test`, `npm run build` | 1 test, TypeScript va build o'tdi |
| `node scripts/test-geopulse-map.mjs` | Local ESM worker, synthetic point, popup, zoomdan keyingi API so'rovi o'tdi |
| Root va GeoPulse frontend: `npm audit` | Har ikkisi 0 ma'lum zaiflik qaytardi |
| `docker compose -f labs/backend-api/compose.yaml config --quiet` | Config valid; Docker foydalanuvchi config ruxsati haqida ogohlantirish bor |

Unit/UI testlar production xizmatlarining barcha holatini isbotlamaydi.
Docker servislarini to'liq ishga tushirish, jonli Netlify deploy va GitHub Actions
ijrosi bu o'zgarishlarda tasdiqlanmadi. Compose smoke bosqichi CI'da bajarilishi
kerak. Real PostGIS o'rniga frontend tekshiruvi faqat sun'iy fixture ishlatdi.

## Chegaralar

- Web Locks bo'lmagan eski/insecure HTTP kontekstida parallel yozuv atomikligi
  kafolatlanmaydi. Bitta tab yoki HTTPS/localhost tavsiya qilinadi.
- Cloud sync qo'shilmadi. Mahalliy progress uchun backup kerak.
- Kurslar mazmuni, modul/task ID'lari va mavjud storage key'lar o'zgartirilmadi.
- Real o'quvchi natijalari va mustaqil pedagogik baho bajarilgan deb belgilanmadi.
- Commit/push/deploy bu ish doirasida bajarilmadi.

## Dependency qarorlari manbalari

- [Vitest advisory](https://github.com/advisories/GHSA-82fw-gwwq-j7x9)
- [MapLibre advisory](https://github.com/advisories/GHSA-jrc7-96c5-q579)
- [MapLibre v6 migration changes](https://github.com/maplibre/maplibre-gl-js/releases/tag/v6.0.0)
