# SkillMap hisob va cloud — Netlify

React frontend, TypeScript Netlify Function va PostgreSQL bir repositoryda.
Frontend offline o‘qish va mahalliy progress bilan ishlaydi. Cloud alohida tugmalar
orqali saqlanadi/tiklanadi. Davriy polling yoki cron yo‘q.

## Lokal ishga tushirish

Node 22.12+ (22 LTSning eng yangi versiyasi tavsiya), npm va Docker kerak.

```powershell
npm ci --no-audit --no-fund
docker compose -p skillmap-fullstack-local -f compose.fullstack.yml up -d --wait
Copy-Item .env.example .env
```

`.env` ichida lokal database URL tayyor. `SYNC_ENCRYPTION_KEY`ga quyidagi buyruq
chiqargan 64 belgili kalitni yozing:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
npm run db:migrate:local
npm run dev:api
```

Ikkinchi terminalda:

```powershell
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Brauzer: http://127.0.0.1:4173. “Hisob va cloud” → “Yangi hisob”.
Login 3–32 ta lotin harfi/raqam/underscore, parol 12–128 belgi.
Backend 8788 portda, Vite `/sync` so‘rovlarini unga uzatadi. Productionga
Docker yoki lokal database URL yuborilmaydi. `docker compose ... down` konteynerni
to‘xtatadi; `--volumes` qo‘shmang, agar progress bazasini saqlamoqchi bo‘lsangiz.

## GitHub → Netlify

1. Kodni GitHubga commit/push qiling. Netlify’da mavjud projectni shu repo bilan
   ulang yoki Import from Git → GitHub orqali project oching.
2. Build command: `npm run build`; publish directory: `dist`; base: repository root.
   `netlify.toml` Functions directory va Node 22 sozlamasini beradi.
3. Project configuration → Environment variables orqali yangi, doimiy
   `SYNC_ENCRYPTION_KEY` qo‘shing. Yuqoridagi randomBytes buyrug‘i bilan yarating.
   Functions runtime uchun mavjud bo‘lsin. Maxfiy qiymatni `.env` yoki GitHubga
   commit qilmang; `VITE_` prefiksi ishlatmang. Lokal demo kalitini productionga ko‘chirmang.
4. Netlify Database credit-based plan bilan ishlaydi. SDK va
   `netlify/database/migrations/0001_accounts.sql` deploy vaqtida database
   provision/migratsiyasini ishga tushiradi. Data & Storage → Database’da tayyorligini
   tekshiring. Netlify o‘zi `NETLIFY_DB_URL`ni beradi; productionda
   `SKILLMAP_DATABASE_URL`ni qo‘ymang.
5. Deploy tugagach, haqiqiy `.netlify.app` manzilida ikkita alohida brauzer/profil
   bilan ro‘yxatdan o‘tish → saqlash → kirish → tiklashni tekshiring. Function
   loglarida xato bo‘lmasin. GitHub CI PostgreSQL integratsiya va brauzer sinovlarini bajaradi.

`dist` papkasining o‘zini drag-and-drop qilish Functions/database bilan full-stack
deployni bajarmaydi. Git integrationdan foydalaning.

## Saqlash qoidalari

- Progress, quiz, lug‘at/SRS, amaliy ish, assessment, o‘quvchi qaydlari va streak cloudga kiradi.
  AI kalitlari, theme, faol kurs va hisob sessiyasi progress JSONga kirmaydi.
- Cloud butun snapshot sifatida saqlanadi. “Bu brauzerni cloudga saqlash” cloud
  nusxani almashtiradi. “Cloud bilan bu brauzerni almashtirish” barcha kurslarning
  mahalliy qaydlarini cloud snapshot bilan almashtiradi. Avval JSON zaxira oling.
- Ikki qurilma bitta revisiondan saqlasa, faqat bittasi yutadi. Ikkinchisiga 409
  qaytadi. Yangilangan nusxani ko‘rib, kerakli o‘zgarishlarni qo‘lda birlashtiring.
  Avtomatik field merge mavjud emas.
- Tiklashdan oldin backenddan revision qayta tekshiriladi. So‘rov davomida mahalliy
  progress o‘zgarsa, tiklash rad etiladi. Oldingi storage recovery sifatida saqlanadi.
- Qo‘lda kiritilgan reviewer bahosi cloudga ko‘chishi uni tasdiqlangan bahoga aylantirmaydi.
  Haqiqiy o‘quvchi pilotini tashkilotchi alohida o‘tkazadi.
- Parolni almashtirish barcha sessiyalarni bekor qiladi. Hisobni o‘chirish joriy
  parolni talab qiladi, database progress va sessiyalarni cascade bilan o‘chiradi.
  Brauzerdagi lokal nusxa qoladi. Email/OAuth/password recovery hozir mavjud emas.

## Backend himoyalari

Async scrypt parol hash, 7 kunlik opaque hashed sessiyalar,
HttpOnly/SameSite=Strict/Secure cookie, mutationlarda aniq Origin tekshiruvi,
SQL parametrlar, account ID tekshiruvi, 2 MB payload chegarasi va schema whitelist.
Progress AES-256-GCM orqali foydalanuvchi ID bilan bog‘lab shifrlanadi.
Shifrlash kalitini xavfsiz zaxiralang; yo‘qotish yoki almashtirish oldingi cloud
yozuvlarini ochishni to‘xtatadi. Database rollback bilan birga kalit mosligini saqlang.

Auth urinishlari PostgreSQLda IP uchun 15 daqiqada 20 ta bilan cheklanadi.
Netlify function yo‘liga domain/IP uchun daqiqasiga 120 request limiti qo‘yilgan.
Loglar request body, parol, cookie yoki database URLni chiqarmaydi.

## Tekshirish

```powershell
npm run build
npm run test:production
npm run test:e2e -- frontend-outcomes.spec.ts reliability.spec.ts learning-flow.spec.ts practice-notebook.spec.ts --workers=2
```

Full-stack sinovi faqat alohida lokal `skillmap_test` bazasida ishlaydi:

```powershell
docker run --detach --rm --name skillmap-fullstack-tests -e POSTGRES_USER=skillmap -e POSTGRES_PASSWORD=skillmap_test -e POSTGRES_DB=skillmap_test -p 127.0.0.1:54328:5432 postgres:17-alpine
$env:SKILLMAP_TEST_DATABASE_URL='postgres://skillmap:skillmap_test@127.0.0.1:54328/skillmap_test'
npm run test:fullstack
docker stop skillmap-fullstack-tests
```

Lokal demo API 8788 portda ishlab turgan bo‘lsa, testdan oldin uni to‘xtating.
Test script avval test jadvalini qayta yaratadi, keyin shu database bilan API va
Vite ishga tushiradi. Production database manzillari rad etiladi. CI aynan shu
scriptni PostgreSQL service bilan bajaradi.

## Tarif va cheklovlar

Netlify credit-based Free tarifida sarflanadigan compute, bandwidth va deploy
resurslari mavjud. Database ham usage sarflaydi; bepul doimiy cheksiz hosting
kafolatlanmaydi. Database idle sleepdan foydalana olishi uchun ilova bekor turganda
so‘rov yubormaydi. Joriy hisob limiti va sarfini Netlify Billing’dan kuzating.
GeoPulse FastAPI/PostGIS laboratoriyasi SkillMap Functions ichida deploy qilinmaydi.

Rasmiy manbalar: [Functions routing](https://docs.netlify.com/build/functions/configuration/),
[Database setup](https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/),
[migrations](https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/),
[rate limits](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/),
[pricing](https://www.netlify.com/pricing/).
