# SkillMap — Netlify Functions va tashqi PostgreSQL

React frontend va TypeScript backend bitta repositoryda. Backend Netlify
Functions orqali ishlaydi; baza tashqi PostgreSQL xizmatida (masalan Neon Free)
saqlanadi. Netlify hisob tarifini almashtirish talab qilinmaydi.

## Deploy xatosi va tuzatish

03b9ee9 deploy logida createSiteDatabase uchun 403 qaytdi:
database feature not available for this account.
Netlify Database faqat credit-based hisoblarda mavjud. Avtomatik provisioningni
ishga tushiruvchi @netlify/database dependency olib tashlandi.
Sxema server/database/migrations ichida; yangi build bazani yaratishga urinmaydi.

## Lokal ishga tushirish

Node 22.12+ (Node 22 LTSning eng yangi versiyasi tavsiya), npm va Docker kerak.

    npm ci --no-audit --no-fund
    docker compose -p skillmap-fullstack-local -f compose.fullstack.yml up -d --wait
    Copy-Item .env.example .env

.env ichida lokal database URL tayyor. SYNC_ENCRYPTION_KEY uchun 64 belgili kalit yarating:

    node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

Qiymatni .env ga yozing, keyin:

    npm run db:migrate:local
    npm run dev:api

Ikkinchi terminalda:

    npm run dev -- --host 127.0.0.1 --port 4173 --strictPort

Brauzer: http://127.0.0.1:4173. Hisob va cloud → Yangi hisob.
API 8788 portda; Vite /sync so‘rovlarini unga uzatadi.
Docker down konteynerni to‘xtatadi; progressni saqlash uchun --volumes ishlatmang.

## Tashqi PostgreSQLni ulash — Neon misoli

1. Neon hisobingizda Free loyiha va alohida skillmap bazasini yarating.
   Netlify va Neon har biri o‘z xizmat/usage limitlariga ega.
2. Shu bazaning SQL Editor oynasida server/database/migrations/0001_accounts.sql
   faylini bir marta bajaring. Faqat yangi SkillMap bazasidan foydalaning;
   boshqa mavjud loyiha bazasini tanlamang.
3. Connect oynasidan pooled PostgreSQL connection stringni oling. Ichida
   login/parol bor — chatga yoki GitHubga yubormang.
4. Netlify → Project configuration → Environment variables orqali
   SKILLMAP_DATABASE_URL ga shu connection stringni kiriting. Faqat production
   kontekst va Functions runtime uchun mavjud bo‘lsin. Localhost URLni qo‘ymang.
5. Yuqoridagi randomBytes buyrug‘i bilan doimiy SYNC_ENCRYPTION_KEY yarating va
   production kontekst/Functions runtime uchun qo‘shing. Lokal demo kalitini ishlatmang.
6. O‘zgarishlardan keyin production deployni qayta boshlang.

DATABASE_URL fallback sifatida qo‘llab-quvvatlanadi. Mavjud Netlify managed baza
bo‘lsa NETLIFY_DB_URL ham ishlaydi, lekin loyiha uni yaratmaydi va sxemani avtomatik
qo‘llamaydi. Uzoq bazalar verified TLS bilan ulanadi. Baza hali ulanmagan bo‘lsa
frontend va function deploy bo‘ladi; hisob/cloud endpointlari 503 sozlash xabarini beradi.

Preview deploylar production bazasiga yozmasligi uchun URL va keyni production
kontekstga cheklang. Preview uchun alohida baza va alohida shifrlash kaliti kerak.

## GitHub → Netlify

Repo branch master; base repository root; build npm run build; publish dist.
netlify.toml Node 22 va netlify/functions directoryni belgilaydi.
.env, .npm-cache va .netlify Gitga kirmaydi. Hech bir backend secretga VITE_ prefiksi
qo‘ymang. Dist papkasini drag-and-drop qilish Functionsni deploy qilmaydi.

Login qilinmagan /sync/me so‘rovi 401 JSON qaytarsa function yo‘li ishlayapti.
Baza ishlashini bilish uchun ikki browser profilida hisob yaratish → saqlash →
kirish → tiklashni bajaring. 401ning o‘zi baza tayyorligini tasdiqlamaydi.

## Saqlash va himoyalar

Progress, quiz, lug‘at/SRS, amaliy ish, assessment, o‘quvchi qaydlari va streak cloudga
kiradi. AI kalitlari, theme, faol kurs va hisob sessiyasi snapshotga kirmaydi.
Cloud tugmalar orqali saqlanadi/tiklanadi; davriy polling yoki cron yo‘q.
Butun snapshot almashtiriladi — avval JSON zaxira oling. Eski revision bilan
parallel yozish 409 qaytaradi; avtomatik field merge mavjud emas.
Tiklash paytida local progress o‘zgarsa, tiklash rad etiladi va recovery saqlanadi.
Reviewer bahosi cloudga ko‘chishi uni tasdiqlangan bahoga aylantirmaydi.

Async scrypt, 7 kunlik opaque hashed sessiyalar, HttpOnly/SameSite=Strict/Secure cookie,
Origin tekshiruvi, parametrli SQL, account ID tekshiruvi, 2 MB limit va schema whitelist.
Progress AES-256-GCM bilan user IDga bog‘lanadi. Kalitni zaxiralang: yo‘qotish yoki
almashtirish oldingi cloud yozuvlarini ochishni to‘xtatadi.
Auth IP uchun 15 daqiqada 20 urinish; function domain/IP uchun daqiqasiga 120 request.
Pool har function instance uchun 3 connection; uzoq bazalarda sertifikat tekshiriladi.
Loglar parol, cookie, payload yoki database URLni chiqarmaydi.

Parol almashtirish barcha sessiyalarni bekor qiladi. Hisobni o‘chirish joriy parolni
talab qiladi; cloud progress va sessiyalarni o‘chiradi, lokal nusxa qoladi.
Email/OAuth/password recovery hozir mavjud emas.

## Tekshirish

    npm run build
    npm run test:production
    npm run test:e2e -- frontend-outcomes.spec.ts reliability.spec.ts learning-flow.spec.ts practice-notebook.spec.ts --workers=2

Full-stack sinovi faqat alohida lokal skillmap_test bazasida ishlaydi:

    docker run --detach --rm --name skillmap-fullstack-tests -e POSTGRES_USER=skillmap -e POSTGRES_PASSWORD=skillmap_test -e POSTGRES_DB=skillmap_test -p 127.0.0.1:54328:5432 postgres:17-alpine
    $env:SKILLMAP_TEST_DATABASE_URL='postgres://skillmap:skillmap_test@127.0.0.1:54328/skillmap_test'
    npm run test:fullstack
    docker stop skillmap-fullstack-tests

Demo API 8788 portda ishlasa, testdan oldin uni to‘xtating. Script test jadvallarini
qayta yaratadi, keyin shu baza bilan API va Vite ishga tushiradi. Production
database manzillari test scriptda rad etiladi. GitHub CI ham shu tekshiruvni bajaradi.
GeoPulse FastAPI/PostGIS laboratoriyasi alohida loyiha bo‘lib qoladi.

Rasmiy manbalar: [Functions](https://docs.netlify.com/build/functions/configuration/),
[Netlify Database plan talabi](https://docs.netlify.com/build/data-and-storage/netlify-database/),
[Neon Free](https://neon.com/blog/new-usage-based-pricing),
[Neon TLS](https://neon.com/blog/avoid-mitm-attacks-with-psql-postgres-16).
