import type { Module } from "../types";

export const WEBGIS_FLAGSHIP_MODULE: Module = {
  zoom: "FG",
  title: "GeoPulse Flagship",
  sub: "3 oylik capstone",
  coord: "Portfolio loyiha / Flagship",
  eyebrow: "FLAGSHIP / GEOSPATIAL / PRODUCTION",
  mtitle: "GeoPulse: bitta katta, haqiqiy portfolio loyihasi",
  lede:
    "Bu modul barcha kurslardagi bilimni bitta <strong>deploy qilingan geospatial platforma</strong>ga yig'adi: React xarita, TypeScript API, PostGIS, Telegram bildirishnoma va production infratuzilmasi.",
  doc: `
    <p><strong>GeoPulse</strong> hududiy obyektlar, hodisalar yoki infratuzilmani kuzatish uchun platforma. Foydalanuvchi xaritada obyektlarni qidiradi va filtrlaydi; administrator ma'lumotni boshqaradi; foydalanuvchilar esa muhim hodisalar haqida Telegram orqali bildirishnoma oladi.</p>
    <h3>Mahsulot arxitekturasi</h3>
    <div class="chips">
      <span class="chip t">React + MapLibre UI</span><span class="chip">Node.js + TypeScript API</span>
      <span class="chip">PostgreSQL + PostGIS</span><span class="chip t">Telegram Bot</span>
      <span class="chip">Docker Compose + Nginx</span><span class="chip">CI/CD + monitoring</span>
    </div>
    <h3>1-oy: mahsulot poydevori</h3>
    <p>React dashboard, login, obyektlar ro'yxati, qidiruv va filter qur. TypeScript API orqali CRUD, pagination, validation, PostgreSQL migration va role-based access control qo'sh.</p>
    <div class="callout"><div><p>Oy yakuni</p><p>Auth bilan himoyalangan, deploy qilishga tayyor dashboard va API. Foydalanuvchi hamda admin rollari alohida ishlaydi.</p></div></div>
    <h3>2-oy: GIS va performance</h3>
    <p>GeoJSON, raster/vector farqi, CRS/EPSG, MapLibre layerlar va viewport bo'yicha qidiruvni amalda ishlat. PostGIS spatial query hamda GIST index bilan katta data uchun tezlikni o'lcha. OSM licensing, data quality va location privacy'ni hujjatlashtir.</p>
    <div class="callout"><div><p>Oy yakuni</p><p>Interaktiv xarita, spatial qidiruv va real geodata bilan ishlaydigan, tezkor WebGIS interfeysi.</p></div></div>
    <h3>3-oy: production tayyorgarligi</h3>
    <p>Telegram subscription va notification flow, background job yoki queue, Docker Compose, Nginx, CI/CD, structured logging, health check va backup rejasi qo'shiladi.</p>
    <div class="callout"><div><p>Oy yakuni</p><p>Ommaga ko'rsatish mumkin bo'lgan deploy qilingan mahsulot: demo, README, arxitektura sxemasi va testlar bilan.</p></div></div>
    <h3>System design savollari</h3>
    <div class="chips">
      <span class="chip">10 ming user: qaysi query index talab qiladi?</span>
      <span class="chip">1 mln obyekt: marker yoki vector tile?</span>
      <span class="chip">Qayerda cache kerak?</span>
      <span class="chip">Queue qaysi ishni HTTP'dan ajratadi?</span>
    </div>
  `,
  code: [
    {
      heading: { h: "Boshlang'ich arxitektura", p: "Barcha servislar lokal development uchun bitta buyruq bilan turishi kerak." },
      title: "docker-compose.yml skeleti",
      lang: "yaml",
      code: `services:\n  web:\n    build: ./web\n    environment:\n      VITE_API_URL: http://localhost:4000\n  api:\n    build: ./api\n    env_file: .env\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgis/postgis\n    environment:\n      POSTGRES_DB: geopulse\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres"]`,
    },
    {
      heading: { h: "Spatial query", p: "Viewport ichidagi obyektlarni index yordamida olish uchun minimal query." },
      title: "PostGIS bbox qidiruvi",
      lang: "sql",
      code: `CREATE INDEX objects_geom_gix ON objects USING GIST (geom);\n\nSELECT id, name, category, ST_AsGeoJSON(geom) AS geometry\nFROM objects\nWHERE geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)\nLIMIT 500;`,
    },
  ],
  tasks: [
    { id: "fg-1", html: "GeoPulse uchun bitta aniq muammo va foydalanuvchi rolini tanladim", crit: "README'da muammo, user va admin oqimi 5-10 qatorda yozilgan" },
    { id: "fg-2", html: "React dashboard va TypeScript API uchun alohida papkalar yaratdim", crit: "web/ va api/ mustaqil ishga tushadi" },
    { id: "fg-3", html: "Auth, validation va user/admin role'larini qo'shdim", crit: "admin bo'lmagan foydalanuvchi boshqaruv endpointiga kira olmaydi" },
    { id: "fg-4", html: "PostgreSQL/PostGIS migration va real yoki namunaviy geodata seed qildim", crit: "yangi database bo'sh holatdan bitta buyruq bilan to'ladi" },
    { id: "fg-5", html: "MapLibre xaritasida layer, filter va bbox qidiruv ishladi", crit: "xaritani surishda faqat ko'rinayotgan hudud ma'lumoti olinadi" },
    { id: "fg-6", html: "PostGIS spatial index yaratib, query tezligini solishtirdim", crit: "EXPLAIN ANALYZE natijasi README'da qisqacha izohlangan" },
    { id: "fg-7", html: "Telegram botda subscription va bitta notification flow yozdim", crit: "test foydalanuvchiga real xabar yetib boradi" },
    { id: "fg-8", html: "Unit, API integration va bitta frontend user-flow test yozdim", crit: "CI ichida uchala turdagi tekshiruv ishlaydi" },
    { id: "fg-9", html: "Docker Compose, health check va Nginx reverse proxy sozladim", crit: "yangi kompyuterda bitta buyruq bilan lokal servislar ko'tariladi" },
    { id: "fg-10", html: "Demo, README, arxitektura sxemasi va backup rejasini tayyorladim", crit: "boshqa dasturchi loyihani ishga tushira oladi" },
  ],
  resources: [
    { type: "doc", url: "https://postgis.net/docs/", title: "PostGIS rasmiy hujjatlari", desc: "Spatial query, index va geodata modelini tekshirish uchun.", host: "postgis.net" },
    { type: "doc", url: "https://maplibre.org/maplibre-gl-js/docs/", title: "MapLibre GL JS", desc: "Xarita layerlari va interaktiv UX uchun.", host: "maplibre.org" },
    { type: "doc", url: "https://docs.docker.com/compose/", title: "Docker Compose", desc: "Lokal va production servislarni birlashtirish uchun.", host: "docs.docker.com" },
    { type: "doc", url: "https://core.telegram.org/bots/api", title: "Telegram Bot API", desc: "Subscription va notification flow uchun rasmiy API.", host: "core.telegram.org" },
  ],
  project: {
    tag: "Flagship / Portfolio / Production",
    title: "GeoPulse Geospatial Monitoring Platform",
    desc: "Barcha kurslardagi asosiy ko'nikmalarni bitta real, deploy qilingan mahsulotga aylantir.",
    features: [
      "React + MapLibre xarita, qidiruv va filterlar",
      "TypeScript API, auth, role va validation",
      "PostgreSQL + PostGIS spatial query va index",
      "Telegram subscription va notification",
      "Docker Compose, Nginx, CI/CD va health check",
      "Testlar, logging, backup rejasi va batafsil README",
    ],
    rubric: [
      "Foydalanuvchi xaritada obyektni qidirib, filtrlab va ko'rib chiqadi.",
      "API auth, role, validation va rate limit bilan himoyalangan.",
      "PostGIS spatial index va kamida bitta real spatial query ishlatilgan.",
      "Telegram bildirishnomasi ishlaydigan end-to-end flowga ega.",
      "Unit, integration va user-flow testlar CI orqali bajariladi.",
      "Loyiha Docker orqali deploy qilinadi; log va backup rejasi yozilgan.",
      "README, demo va arxitektura sxemasi boshqa dasturchiga tushunarli.",
    ],
    variants: [
      { title: "Shahar infratuzilmasi", desc: "Yo'l, yoritish, chiqindi yoki kommunal muammolarni xaritada kuzatadigan platforma.", deliverables: ["Muammo kategoriyalari", "Hudud bo'yicha filter", "Operator Telegram notification"] },
      { title: "Biznes joylashuv analitikasi", desc: "Savdo nuqtalari, mijozlar yoki filiallar bo'yicha hududiy tahlil dashboardi.", deliverables: ["Branch layer", "Catchment/nearby tahlil", "Admin export"] },
      { title: "Ekologik monitoring", desc: "Havo sifati, suv nuqtalari yoki yashil hududlarni kuzatish uchun ochiq data platformasi.", deliverables: ["Vaqt bo'yicha filter", "Alert threshold", "Public map view"] },
    ],
  },
  quiz: [
    { q: "GeoPulse'da PostGIS spatial indexining asosiy vazifasi nima?", a: ["UI rangini o'zgartirish", "Bbox/spatial qidiruvni tezlashtirish", "Telegram xabarini yuborish", "Docker image yaratish"], c: 1, w: "GIST spatial index geo-querylar uchun kerakli satrlarni tez topishga yordam beradi.", level: "easy" },
    { q: "1 million obyektni xaritada oddiy marker sifatida birdan render qilish muammoli. Eng to'g'ri keyingi qadam qaysi?", a: ["Yana ko'p marker qo'shish", "Clustering yoki vector tiles ishlatish", "Database'ni o'chirish", "Auth'ni olib tashlash"], c: 1, w: "Katta data uchun clustering, viewport query yoki vector tiles browser yukini kamaytiradi.", level: "practical" },
    { q: "Nega notification yuborishni HTTP request ichida uzoq ishlatish yomon?", a: ["Xabarlar chiroyli chiqmaydi", "API javobi sekinlashadi va xato xavfi oshadi", "PostGIS ishlamaydi", "MapLibre taqiqlaydi"], c: 1, w: "Og'ir yoki tashqi servis ishlari queue/background workerga ajratiladi.", level: "scenario" },
  ],
  exercises: [
    { type: "choice", q: "GeoPulse'da browser xaritasini qaysi qatlam render qiladi?", options: ["PostGIS", "MapLibre + React", "Nginx", "Telegram Bot"], correct: 1, why: "MapLibre browserda xaritani, React esa UI holatini boshqaradi." },
    { type: "choice", q: "Secret tokenni qayerda saqlash kerak?", options: ["Frontend source code ichida", ".env yoki deployment secretlarida", "README misolida", "Git commit nomida"], correct: 1, why: "Secretlar version controlga kiritilmaydi; environment secret sifatida beriladi." },
    { type: "gap", q: "Geo obyektlar uchun PostgreSQL kengaytmasi: ___", answers: ["postgis", "PostGIS"], why: "PostGIS PostgreSQL'ga spatial tiplar va querylarni qo'shadi.", hint: "P harfi bilan boshlanadi" },
  ],
  vocab: [
    { w: "flagship project", uz: "eng katta, asosiy portfolio loyihasi", ex: "GeoPulse mening flagship projectim bo'ladi." },
    { w: "spatial index", uz: "geo-qidiruvni tezlashtiruvchi indeks", ex: "Spatial index bbox so'rovini tezlashtiradi." },
    { w: "observability", uz: "tizim holatini log, metric va trace orqali kuzatish", ex: "Observability xatoni tez topishga yordam beradi." },
  ],
  grammar: [
    { topic: "Ma'lumot oqimi", rule: "UI -> API -> PostGIS -> API -> UI", ex: "MapLibre viewport yuboradi, API PostGIS'dan GeoJSON qaytaradi." },
    { topic: "Production oqimi", rule: "Push -> CI -> Test -> Build -> Deploy -> Monitor", ex: "Har pull request testdan o'tmasdan deploy qilinmaydi." },
  ],
};
