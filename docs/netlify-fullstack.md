# SkillMap — Netlify Functions va Netlify Database

React frontend va TypeScript backend bitta repositoryda. Production backend
Netlify Functions orqali ishlaydi; PostgreSQL Netlify Database ichida saqlanadi.
@netlify/database joriy deployning bazasini tanlaydi; pg parametrli query va
transactionlarni bajaradi. Neon uchun alohida hisob ochish talab qilinmaydi.

## Netlify bazasi tayyor bo‘lganda

Netlify → Data & storage → Database oynasida Your database is ready! va
production branch ko‘rinishi baza yaratilganini bildiradi. Oldingi deploydagi
createSiteDatabase 403 xatosi baza mavjud emasligi yoki hisob ruxsatiga tegishli;
faqat yangi muvaffaqiyatli deploy xato bartaraf etilganini tasdiqlaydi.

Repositoryda @netlify/database dependency va netlify/database/migrations ichida
0001_accounts.sql bor. Netlify mavjud bazani ishlatadi va hali qo‘llanmagan
migrationsni deploy e’lon qilinishidan oldin avtomatik bajaradi. SQLni qo‘lda
qayta bajarish kerak emas. SkillMap jadvallari boshqa loyiha jadvallarini o‘chirmaydi.

1. Netlify → Environment variables orqali SYNC_ENCRYPTION_KEY qo‘shing.
   Qiymat kriptografik tasodifiy 64 belgili hex bo‘lsin. Mavjud production kaliti
   bo‘lsa uni saqlang; yangisini yozish oldingi cloud snapshotlarni ochishni buzadi.
2. Yangi kalitni o‘z terminalingizda quyidagicha yarating:

       node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

3. Kalitni production kontekstda Functions runtime uchun saqlang. VITE_ prefiksini
   ishlatmang. Kalitni GitHubga yoki chatga yubormang, maxfiy joyda zaxiralang.
4. GitHub master push orqali deployni boshlang. Netlify avtomatik NETLIFY_DB_URL
   beradi; URL yoki database parolini qo‘lda kiritish kerak emas.
5. Deploy Published bo‘lgandan keyin quyidagi hisob va snapshot tekshiruvini bajaring.

Preview branchlar Netlify tomonidan alohida yaratiladi. SYNC_ENCRYPTION_KEY faqat
productionda berilgan bo‘lsa previewda hisob/cloud 503 sozlash xabarini beradi.
Preview sinovi uchun alohida kalit kerak. Netlify managed URL tashqi URLlardan
ustun turadi, shunda preview production bazasiga tasodifan ulanmaydi.

Netlify Database credit-based hisoblarda mavjud va o‘z usage/kredit xarajatlariga
ega. Baza yaratish mavjud tarifni yoki bepul limitni o‘z-o‘zidan tasdiqlamaydi.

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

## Muqobil tashqi PostgreSQL

Production uchun tanlangan yo‘l Netlify Database. Agar boshqa hostingda tashqi
PostgreSQL kerak bo‘lsa, managed Netlify URL yo‘qligida SKILLMAP_DATABASE_URL yoki
DATABASE_URL ishlatiladi. Shu alohida yangi bazaga migrationsni qo‘lda qo‘llash,
preview bazasini ajratish va URLni runtime secret sifatida saqlash zarur.
Lokal testlar faqat loopback skillmap_local yoki skillmap_test bazalarini qabul qiladi.
Uzoq bazalar verified TLS bilan ulanadi. Runtime hech qachon jadvallarni o‘zi yaratmaydi.

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
[Netlify Database setup](https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/),
[avtomatik migrations](https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/),
[database URL API](https://docs.netlify.com/build/data-and-storage/netlify-database/api/).
