import type { Module } from "../types";

export const WEBGIS_FLAGSHIP_MODULE: Module = {
  zoom: "FG",
  title: "GeoPulse Flagship",
  sub: "3 oylik capstone",
  coord: "Portfolio loyiha / Flagship",
  eyebrow: "FLAGSHIP / GEOSPATIAL / PRODUCTION",
  mtitle: "GeoPulse: bitta katta, haqiqiy portfolio loyihasi",
  lede:
    "Bu modul barcha kurslardagi bilimni bitta <strong>deploy qilingan geospatial platforma</strong>ga yig'adi: React xarita, FastAPI API, PostGIS, Telegram bildirishnoma va production infratuzilmasi.",
  doc: `
    <p><strong>GeoPulse</strong> hududiy obyektlar, hodisalar yoki infratuzilmani kuzatish uchun platforma. Foydalanuvchi xaritada obyektlarni qidiradi va filtrlaydi; administrator ma'lumotni boshqaradi; foydalanuvchilar esa muhim hodisalar haqida Telegram orqali bildirishnoma oladi.</p>
    <h3>Mahsulot arxitekturasi</h3>
    <div class="chips">
      <span class="chip t">React + MapLibre UI</span><span class="chip">Python + FastAPI API</span>
      <span class="chip">PostgreSQL + PostGIS</span><span class="chip t">Telegram Bot</span>
      <span class="chip">Docker Compose + Nginx</span><span class="chip">CI/CD + monitoring</span>
    </div>
    <h3>1-oy: mahsulot poydevori</h3>
    <p>React dashboard, login, obyektlar ro'yxati, qidiruv va filtr qur. FastAPI API orqali CRUD, pagination, validation, PostgreSQL migration va role-based access control qo'sh.</p>
    <div class="callout"><div><p>Oy yakuni</p><p>Auth bilan himoyalangan, deploy qilishga tayyor dashboard va API. Foydalanuvchi hamda admin rollari alohida ishlaydi.</p></div></div>
    <h3>2-oy: GIS va performance</h3>
    <p>GeoJSON, raster/vector farqi, CRS/EPSG, MapLibre layerlar va viewport bo'yicha qidiruvni amalda ishlat. PostGIS spatial query hamda GIST index bilan katta data uchun tezlikni o'lcha. GDAL/Rasterio orqali COG pipeline qur, window read natijasini tekshir. OSM licensing, data quality va location privacy'ni hujjatlashtir.</p>
    <div class="callout"><div><p>Oy yakuni</p><p>Interaktiv xarita, spatial qidiruv va real geodata bilan ishlaydigan, tezkor WebGIS interfeysi.</p></div></div>
    <h3>3-oy: production tayyorgarligi</h3>
    <p>YOLO uchun kichik, hujjatlashtirilgan dataset bilan baseline va evaluation tayyorla. Telegram subscription va notification flow, background queue, Docker Compose, Nginx, CI/CD, structured logging, Prometheus metriclari, health check, audit log va amalda sinalgan backup/restore qo'shiladi.</p>
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
      code: `services:\n  web:\n    build: ./web\n    environment:\n      VITE_API_URL: http://localhost:8000\n  api:\n    build: ./api\n    env_file: .env\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgis/postgis\n    environment:\n      POSTGRES_DB: geopulse\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres"]`,
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
    { id: "fg-2", html: "React dashboard va FastAPI API uchun alohida papkalar yaratdim", crit: "web/ va api/ mustaqil ishga tushadi" },
    { id: "fg-3", html: "Auth, validation va user/admin role'larini qo'shdim", crit: "admin bo'lmagan foydalanuvchi boshqaruv endpointiga kira olmaydi" },
    { id: "fg-4", html: "PostgreSQL/PostGIS migration va real yoki namunaviy geodata seed qildim", crit: "yangi database bo'sh holatdan bitta buyruq bilan to'ladi" },
    { id: "fg-5", html: "MapLibre xaritasida layer, filtr va bbox qidiruv ishladi", crit: "xaritani surishda faqat ko'rinayotgan hudud ma'lumoti olinadi" },
    { id: "fg-6", html: "PostGIS spatial index yaratib, query tezligini solishtirdim", crit: "EXPLAIN ANALYZE natijasi README'da qisqacha izohlangan" },
    { id: "fg-7", html: "Telegram botda subscription va bitta notification flow yozdim", crit: "test foydalanuvchiga real xabar yetib boradi" },
    { id: "fg-8", html: "Unit, API integration va bitta frontend user-flow test yozdim", crit: "CI ichida uchala turdagi tekshiruv ishlaydi" },
    { id: "fg-9", html: "Docker Compose, health check va Nginx reverse proxy sozladim", crit: "yangi kompyuterda bitta buyruq bilan lokal servislar ko'tariladi" },
    { id: "fg-10", html: "Demo, README va arxitektura sxemasini tayyorladim", crit: "boshqa dasturchi loyihani hujjat orqali ishga tushira oladi" },
    { id: "fg-11", html: "GDAL/Rasterio bilan rasterdan COG yaratish va window read pipeline yozdim", crit: "pipeline qayta ishga tushiriladi; metadata, overview va window read avtomatik tekshiriladi" },
    { id: "fg-12", html: "YOLO baseline modelini alohida validation/test to'plamida baholadim", crit: "precision, recall, mAP, confusion matrix va xato tahlili hisobotda bor" },
    { id: "fg-13", html: "Prometheus metriclari, structured log va kamida bitta alert qo'shdim", crit: "request latency, error rate va worker holati dashboard yoki query orqali ko'rinadi" },
    { id: "fg-14", html: "Audit log hamda backup/restore runbookini real mashqda tekshirdim", crit: "toza database backupdan tiklanadi va vaqt/natija dalil sifatida saqlanadi" },
  ],
  resources: [
    { type: "doc", url: "https://postgis.net/docs/", title: "PostGIS rasmiy hujjatlari", desc: "Spatial query, index va geodata modelini tekshirish uchun.", host: "postgis.net" },
    { type: "doc", url: "https://maplibre.org/maplibre-gl-js/docs/", title: "MapLibre GL JS", desc: "Xarita layerlari va interaktiv UX uchun.", host: "maplibre.org" },
    { type: "doc", url: "https://docs.docker.com/compose/", title: "Docker Compose", desc: "Lokal va production servislarni birlashtirish uchun.", host: "docs.docker.com" },
    { type: "doc", url: "https://core.telegram.org/bots/api", title: "Telegram Bot API", desc: "Subscription va notification flow uchun rasmiy API.", host: "core.telegram.org" },
    { type: "doc", url: "https://gdal.org/en/stable/", title: "GDAL rasmiy hujjatlari", desc: "Raster transform, COG va geoprocessing pipeline uchun.", host: "gdal.org" },
    { type: "doc", url: "https://rasterio.readthedocs.io/en/stable/", title: "Rasterio hujjatlari", desc: "Python orqali raster metadata va window read uchun.", host: "rasterio.readthedocs.io" },
    { type: "doc", url: "https://docs.ultralytics.com/", title: "Ultralytics YOLO", desc: "Dataset, train, validation va model metriclari uchun.", host: "docs.ultralytics.com" },
    { type: "doc", url: "https://prometheus.io/docs/introduction/overview/", title: "Prometheus hujjatlari", desc: "Metric, query va production alertlar uchun.", host: "prometheus.io" },
  ],
  project: {
    tag: "Flagship / Portfolio / Production",
    title: "GeoPulse Geospatial Monitoring Platform",
    desc: "Barcha kurslardagi asosiy ko'nikmalarni bitta real, deploy qilingan mahsulotga aylantir.",
    features: [
      "React + MapLibre xarita, qidiruv va filtrlar",
      "FastAPI API, auth, role va validation",
      "PostgreSQL + PostGIS spatial query va index",
      "GDAL/Rasterio COG pipeline va YOLO evaluation",
      "Telegram subscription va notification",
      "Docker Compose, Nginx, CI/CD va observability",
      "Testlar, audit log, backup/restore va batafsil README",
    ],
    assessment: {
      id: "geopulse-professional-v1",
      version: "1.0",
      title: "GeoPulse Professional Final Assessment",
      summary: "Production darajadagi geospatial mahsulotni artefaktlar, tashqi reviewer va jonli himoya orqali tekshiradi. Kurs tasklarini belgilashning o'zi assessmentdan o'tish hisoblanmaydi.",
      passScore: 80,
      assessorRequired: true,
      criteria: [
        {
          id: "product-ux",
          title: "Mahsulot talabi va field UX",
          description: "Muammo, foydalanuvchi rollari va asosiy operator oqimi aniq; xarita real field vazifasini ortiqcha qadamlarsiz bajaradi.",
          points: 12,
          minimumPoints: 7,
          indicators: [
            "README'da muammo, scope, acceptance criteria va cheklovlar bor.",
            "Loading, empty, error, offline/degraded va mobile holatlar ishlangan.",
            "Asosiy qidiruv-filtr-detail oqimi accessibility bilan ishlaydi.",
          ],
          evidence: ["repository", "live-demo", "demo-video"],
        },
        {
          id: "mapping-frontend",
          title: "React, TypeScript va MapLibre",
          description: "Xarita state'i, layer lifecycle va katta dataset renderi boshqariladigan, testlanadigan arxitekturaga ega.",
          points: 14,
          minimumPoints: 8,
          indicators: [
            "Viewport query, abort/cancellation va stale response himoyasi mavjud.",
            "Clustering yoki vector tile strategiyasi data hajmi bilan asoslangan.",
            "Layer/source lifecycle memory leak va duplicate eventlarsiz ishlaydi.",
          ],
          evidence: ["repository", "live-demo", "ci-run"],
        },
        {
          id: "api-security",
          title: "FastAPI, auth va security",
          description: "Typed API contract, validation, RBAC, audit va xavfsizlik nazoratlari real endpointlarda isbotlangan.",
          points: 15,
          minimumPoints: 9,
          indicators: [
            "Migration, pagination, idempotency va xato formati hujjatlashtirilgan.",
            "Role bypass, input validation va rate-limit integration testlari bor.",
            "Secretlar repositoryda yo'q; audit log muhim amallarni qayd qiladi.",
          ],
          evidence: ["repository", "ci-run", "architecture"],
        },
        {
          id: "spatial-performance",
          title: "PostGIS data modeli va performance",
          description: "CRS, geometry validity, spatial index va query plan qarorlari o'lchov bilan himoya qilingan.",
          points: 16,
          minimumPoints: 10,
          indicators: [
            "Realistik data hajmida EXPLAIN (ANALYZE, BUFFERS) oldin/keyin solishtirilgan.",
            "BBox, nearby/intersection va pagination querylari to'g'ri SRID bilan ishlaydi.",
            "N+1, limit, timeout va noto'g'ri geometriya holatlari boshqarilgan.",
          ],
          evidence: ["repository", "performance-report", "architecture"],
        },
        {
          id: "processing-ai",
          title: "Raster/COG va YOLO evaluation",
          description: "Qayta ishlatiladigan geoprocessing pipeline hamda model natijasini halol baholash mavjud.",
          points: 10,
          minimumPoints: 5,
          indicators: [
            "GDAL/Rasterio pipeline valid COG, overview va metadata hosil qiladi.",
            "YOLO train/validation/test ajratilishi va dataset versiyasi qayd etilgan.",
            "Precision, recall, mAP va xato tahlili use-case thresholdiga bog'langan.",
          ],
          evidence: ["repository", "performance-report", "model-report"],
        },
        {
          id: "quality-reliability",
          title: "Test va reliability",
          description: "Muhim biznes va geospatial oqimlar avtomatik testlar hamda failure-mode mashqlari bilan himoyalangan.",
          points: 12,
          minimumPoints: 7,
          indicators: [
            "Backend unit/integration, spatial query va frontend user-flow testlari bor.",
            "CI lint, typecheck, test, migration va image buildni bloklovchi gate sifatida ishlatadi.",
            "Queue retry/idempotency, network xatosi va database unavailable holati sinalgan.",
          ],
          evidence: ["repository", "ci-run", "operations-report"],
        },
        {
          id: "deployment-operations",
          title: "Deploy, observability va recovery",
          description: "Tizim takrorlanuvchi deploy, kuzatuv va tekshirilgan tiklash amaliyotiga ega.",
          points: 11,
          minimumPoints: 6,
          indicators: [
            "Docker/Nginx konfiguratsiyasi health/readiness va least-privilege bilan ishlaydi.",
            "Log, metric va alert real incident savoliga javob bera oladi.",
            "Backupdan toza muhitga restore bajarilgan va RPO/RTO qayd etilgan.",
          ],
          evidence: ["live-demo", "ci-run", "operations-report"],
        },
        {
          id: "documentation-defense",
          title: "Hujjat, ownership va jonli himoya",
          description: "Nomzod arxitektura qarorlarini, trade-offlarni va o'z hissasini kod ustida mustaqil himoya qiladi.",
          points: 10,
          minimumPoints: 6,
          indicators: [
            "README, ADR, diagramma, runbook va API contract bir-biriga mos.",
            "AI va uchinchi tomon yordami shaffof logda ko'rsatilgan.",
            "Tasodifiy debugging yoki change request jonli bajarilgan.",
          ],
          evidence: ["architecture", "operations-report", "ai-use-log", "demo-video"],
        },
      ],
      evidence: [
        { id: "repository", label: "Git repository", description: "Commit tarixi, source code, README, migration va testlar mavjud repository.", kind: "url", placeholder: "https://github.com/...", required: true },
        { id: "live-demo", label: "Ishlaydigan demo", description: "Reviewer kira oladigan HTTPS deployment yoki vaqtincha preview muhiti.", kind: "url", placeholder: "https://demo.example.com", required: true },
        { id: "ci-run", label: "CI pipeline natijasi", description: "Lint, typecheck, test, migration va image build o'tgan run.", kind: "url", placeholder: "https://github.com/.../actions/runs/...", required: true },
        { id: "architecture", label: "Arxitektura va ADR", description: "System diagram, data flow, threat boundary va asosiy trade-off qarorlari.", kind: "url", placeholder: "https://github.com/.../docs/architecture.md", required: true },
        { id: "performance-report", label: "Performance hisoboti", description: "PostGIS query plan, load natijasi, COG window read va bottleneck xulosasi.", kind: "url", placeholder: "https://github.com/.../docs/performance.md", required: true },
        { id: "model-report", label: "YOLO model card", description: "Dataset versiyasi, split, metriclar, threshold, limitation va xato tahlili.", kind: "url", placeholder: "https://github.com/.../docs/model-card.md", required: true },
        { id: "operations-report", label: "Operations runbook", description: "Deploy, monitoring, incident, audit, backup va real restore dalili.", kind: "url", placeholder: "https://github.com/.../docs/runbook.md", required: true },
        { id: "ai-use-log", label: "AI-use log", description: "AI qayerda ishlatilgani, nimalar tekshirilgani va muallifning mustaqil hissasi.", kind: "url", placeholder: "https://github.com/.../docs/ai-use.md", required: true },
        { id: "demo-video", label: "Qisqa demo video", description: "5-8 daqiqada field flow, observability va failure recovery ko'rsatiladi.", kind: "url", placeholder: "https://...", required: false },
      ],
      criticalFails: [
        { id: "unavailable", title: "Loyiha ishga tushmaydi", description: "Repository ko'rsatmasi bilan toza muhitda servislar ko'tarilmaydi yoki asosiy flow bajarilmaydi." },
        { id: "secret-exposure", title: "Secret yoki shaxsiy data oshkor qilingan", description: "Token, credential, maxfiy dataset yoki shaxsiy geolokatsiya repository/log ichida himoyasiz qolgan." },
        { id: "access-bypass", title: "Auth/RBAC bypass", description: "Oddiy foydalanuvchi admin amali yoki boshqa tenant ma'lumotiga ruxsatsiz kira oladi." },
        { id: "fabricated-evidence", title: "Soxta yoki o'zlashtirilgan dalil", description: "Metric, test, commit, model natijasi yoki kod muallifligi noto'g'ri ko'rsatilgan." },
        { id: "license-privacy", title: "License/privacy buzilishi", description: "Dataset litsenziyasi, attribution yoki location privacy talabi jiddiy buzilgan." },
        { id: "restore-failure", title: "Recovery isbotlanmagan", description: "Backup mavjud deb ko'rsatilgan, lekin toza muhitga restore mashqi bajarilmaydi." },
      ],
      defense: {
        durationMinutes: 45,
        liveChangeMinutes: 15,
        format: [
          "5 daqiqa: muammo, foydalanuvchi va acceptance criteria.",
          "12 daqiqa: asosiy field flow va degraded/error holatlari demosi.",
          "10 daqiqa: arxitektura, PostGIS plan, COG va YOLO metriclari.",
          "8 daqiqa: test, observability, incident va restore dalili.",
          "10 daqiqa: reviewer savollari; keyin alohida tasodifiy change request.",
        ],
        questions: [
          "1 million obyektga o'tganda qaysi qatlam birinchi bottleneck bo'ladi va buni qanday o'lchaysiz?",
          "Nega bu query uchun GIST indeks ishladi yoki ishlamadi? EXPLAIN natijasidan ko'rsating.",
          "COG window read oddiy GeoTIFF yuklashdan qayerda va nima uchun ustun?",
          "YOLO thresholdini oshirsangiz field operator uchun qaysi xato turi o'zgaradi?",
          "Database yoki worker ishlamay qolsa foydalanuvchi, log, metric va recovery oqimi qanday bo'ladi?",
          "Reviewer tanlagan kichik endpoint/layer o'zgarishini test bilan jonli kiriting.",
        ],
      },
    },
    variants: [
      { title: "Shahar infratuzilmasi", desc: "Yo'l, yoritish, chiqindi yoki kommunal muammolarni xaritada kuzatadigan platforma.", deliverables: ["Muammo kategoriyalari", "Hudud bo'yicha filtr", "Operator Telegram notification"] },
      { title: "Biznes joylashuv analitikasi", desc: "Savdo nuqtalari, mijozlar yoki filiallar bo'yicha hududiy tahlil dashboardi.", deliverables: ["Branch layer", "Catchment/nearby tahlil", "Admin export"] },
      { title: "Ekologik monitoring", desc: "Havo sifati, suv nuqtalari yoki yashil hududlarni kuzatish uchun ochiq data platformasi.", deliverables: ["Vaqt bo'yicha filtr", "Alert threshold", "Public map view"] },
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
