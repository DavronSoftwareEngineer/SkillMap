import type { Module } from "../types";

const BACKEND_PLATFORM_DECISION: Module = {
  zoom: "BX1",
  title: "Backend Stack qarori",
  sub: "Node.js / modular monolith / ADR",
  coord: "Backend / platform decision",
  eyebrow: "BACKEND / FASTAPI / ARCHITECTURE",
  mtitle: "Mustaqil production API uchun asosiy stackni tanlash",
  lede: "Backend kursining mustaqil capstone'i Node.js + TypeScript modular monolith sifatida quriladi. GeoPulse esa FastAPI-first alohida mahsulot; bu ikkisini aralashtirish emas, domain va portfolio maqsadiga qarab to'g'ri stack tanlashni o'rganasan.",
  doc: `
    <h3>Chegara, ikki backend emas</h3>
    <p>Mustaqil backend loyiha uchun bir HTTP API bir asosiy texnologiyada qoladi: <strong>Node.js + TypeScript</strong>, PostgreSQL va Redis. Bu kursda Node domain, auth, queue va deploy egasi. GeoPulse'da esa raster, GDAL, PostGIS, GeoAI va Telegram webhook <strong>FastAPI</strong>da qoladi.</p>
    <div class="exlist"><div class="ex"><b>Node.js + TypeScript</b><span>Bu kursning API, auth, typed contract, SaaS domain, Redis job va deploy poydevori.</span></div><div class="ex"><b>PostgreSQL + Redis</b><span>Transactional data, idempotency, cache va background job contracti.</span></div><div class="ex"><b>FastAPI + Celery</b><span>GeoPulse'ning alohida geospatial mahsuloti uchun tanlangan stack; Backend capstone'iga majburiy emas.</span></div></div>
    <h3>Tanlov qoidasi</h3><div class="tree">requirements -> options -> measured constraint -> ADR -> implementation -> test -> revisit trigger</div>
    <p>"Bun eng tez" yoki "Zod standart" kabi absolyut gaplar qaror emas. Runtime, validator va framework tanlovi versiya, benchmark, deploy target, library compatibility va jamoa ko'nikmasi bilan tekshiriladi.</p>
  `,
  code: [{ heading: { h: "ADR skeleton", p: "Qaror isbot bilan yoziladi." }, title: "docs/adr-006-backend-stack.md", lang: "md", code: `# ADR-006: Backend capstone stack\n\n## Context\nThe standalone portfolio API needs typed contracts, auth, PostgreSQL, Redis jobs and one deploy unit.\n\n## Decision\nUse Node.js + TypeScript modular monolith, PostgreSQL and Redis.\n\n## Rejected\nSplit into microservices: duplicate deployment, tracing and data consistency work before a measured need.\n\n## Revisit when\nIndependent team ownership or measured load requires a separable boundary.` }],
  tasks: [
    { id: "bx1-1", html: "Mustaqil backend API uchun Node.js/TypeScript, PostgreSQL va Redis boundarysini chizdim", crit: "API, worker va data ownership diagramda aniq" },
    { id: "bx1-2", html: "Modular monolith qarori uchun ADR yozdim", crit: "Kamida 2 variant, trade-off va revisit trigger bor" },
    { id: "bx1-3", html: "Bir domain qoidasi bir nechta servisga ko'chib ketmasligini tekshirdim", crit: "Single owner va API contract aniq" },
    { id: "bx1-4", html: "Runtime/validator da'volarini rasmiy docs yoki qayta bajariladigan benchmark bilan tekshirdim", crit: "Versiya, buyruq va natija qayd etilgan; marketing da'vosi yo'q" },
  ],
  resources: [
    { type: "doc", url: "https://fastapi.tiangolo.com/", title: "FastAPI documentation", desc: "Python API, schema va dependency patternlari.", host: "fastapi.tiangolo.com" },
    { type: "doc", url: "https://nodejs.org/en/learn", title: "Node.js documentation", desc: "Node runtime va server-side JavaScript uchun rasmiy manba.", host: "nodejs.org" },
    { type: "doc", url: "https://adr.github.io/", title: "ADR guide", desc: "Architecture Decision Record formati.", host: "adr.github.io" },
  ],
  project: { tag: "Architecture / ADR", title: "Standalone Backend Stack Decision", desc: "Mustaqil Node.js/TypeScript production API uchun modular monolith va worker chegaralarini asoslab yoz.", features: ["domain map", "ADR", "trade-off", "revisit trigger"], rubric: ["Domain ownership takrorlanmaydi", "Qaror o'lchov yoki constraint bilan himoyalangan", "Migration va test boundary aniq" ] },
  quiz: [{ q: "GeoPulse spatial domainini Node'ga qayta yozishning asosiy xavfi?", a: ["Ranglar o'zgaradi", "Business rule va migrationlar ikki joyda takrorlanadi", "Docker ishlamaydi", "HTTP yo'qoladi"], c: 1, w: "Bitta domenning ikki egasi drift va xato xavfini oshiradi.", level: "scenario" }],
};

const BACKEND_RELIABILITY_LAB: Module = {
  zoom: "BX2",
  title: "Production Reliability Lab",
  sub: "Redis / retry / traces / recovery",
  coord: "Backend / reliability lab",
  eyebrow: "BACKEND / RELIABILITY / OPERATIONS",
  mtitle: "HTTP 200 dan tiklanadigan backendgacha",
  lede: "Queue, retry va observabilityni faqat nomlab o'tmaysan: duplicate request, Redis outage va restore holatlarini o'lchanadigan test orqali isbotlaysan.",
  doc: `<h3>Minimal reliable stack</h3><div class="tree">Nginx -> API modular monolith -> PostgreSQL\n                         -> Redis -> one background worker</div><p>Job uchun idempotency key, bounded retry/backoff, failed state va operator ko'radigan correlation id kerak. Distributed trace API, database va worker oqimini bog'laydi; secret logga tushmaydi.</p><h3>Failure contract</h3><p>Redis yoki worker ishlamasa endpoint yolg'on <code>done</code> qaytarmaydi. Foydalanuvchi aniq accepted/failed holatni, operator esa metric, structured log va runbookni oladi.</p>`,
  code: [{ heading: { h: "Idempotent enqueue", p: "Bir kalit faqat bitta side effect yaratadi." }, title: "jobs.ts", lang: "ts", code: `const key = request.headers.get("Idempotency-Key");\nif (!key) return Response.json({ error: "idempotency key required" }, { status: 400 });\n\nconst existing = await jobs.findByKey(key);\nif (existing) return Response.json(existing, { status: 200 });\n\nconst job = await jobs.createPending({ key, requestId });\nawait queue.enqueue(job.id);\nreturn Response.json(job, { status: 202 });` }],
  tasks: [
    { id: "bx2-1", html: "labs/backend-api starterni clean environmentda ishga tushirdim", crit: "API, PostgreSQL va Redis health checklari o'tadi" },
    { id: "bx2-2", html: "Queue jobiga idempotency key qo'shdim", crit: "Parallel duplicate request bitta side effect yaratishini integration test isbotlaydi" },
    { id: "bx2-3", html: "Retry/backoff va failed job holatini yozdim", crit: "Bounded retry va operatorga ko'rinadigan failure reason bor" },
    { id: "bx2-4", html: "OpenTelemetry yoki ekvivalent trace qo'shdim", crit: "API -> DB/Redis -> worker correlation ID bilan ko'rinadi" },
    { id: "bx2-5", html: "Rate limit, secret redaction va health/readiness tekshiruvini qo'shdim", crit: "Negative testlar hamda config boundary mavjud" },
    { id: "bx2-6", html: "Backup/restore va Redis outage drill o'tkazdim", crit: "Runbook, vaqt, natija va recovery dalili saqlangan" },
  ],
  resources: [
    { type: "doc", url: "https://redis.io/docs/latest/", title: "Redis documentation", desc: "Cache, stream va broker konseptlari.", host: "redis.io" },
    { type: "doc", url: "https://opentelemetry.io/docs/", title: "OpenTelemetry", desc: "Trace, metric va log telemetry standartlari.", host: "opentelemetry.io" },
    { type: "doc", url: "https://www.postgresql.org/docs/", title: "PostgreSQL documentation", desc: "Backup, restore va recovery bo'yicha rasmiy manba.", host: "postgresql.org" },
  ],
  project: { tag: "Reliability / Failure Lab", title: "Recoverable Job API", desc: "Queue-backed endpointni duplicate request va outage holatida aniq, kuzatiladigan qilib qur.", features: ["Redis", "idempotency", "retry/backoff", "trace", "rate limit", "restore drill"], rubric: ["Yolg'on success yo'q", "Failure testlari qayta bajariladi", "Secret telemetryga chiqmaydi", "Recovery runbook isbotlangan" ] },
  quiz: [{ q: "Retrydan oldin qaysi property kerak?", a: ["Ko'proq log", "Idempotency", "Yangi port", "CSS"], c: 1, w: "Idempotency retry duplicate side effect yaratmasligini ta'minlaydi.", level: "practical" }],
};

export const GEOPULSE_OPTIONAL_INTEGRATION: Module = {
  zoom: "GI1",
  title: "GeoPulse Integration (Optional)",
  sub: "FastAPI / Celery / evidence",
  coord: "Geospatial / optional integration",
  eyebrow: "GEOPULSE / BACKEND / PORTFOLIO",
  mtitle: "Backend capstone'ni GeoPulse portfolioga ulash",
  lede: "GeoPulse yakunida tanlanadigan optional portfolio moduli: FastAPI/Celery arxitekturasiga contract, test va operational fikrlash bilan webhook, notification worker yoki operator API qo'shasan.",
  doc: `<h3>Variantlar</h3><div class="exlist"><div class="ex"><b>FastAPI Telegram webhook</b><span>Typed update, subscription command, validation va FastAPI domain qoidalari bilan bitta API ichida ishlaydi.</span></div><div class="ex"><b>Celery notification worker</b><span>Geo eventdan idempotent notification job, retry, user preference va audit trail.</span></div><div class="ex"><b>Operator API</b><span>RBAC, pagination, filter, audit va error contract bilan boshqaruv surface.</span></div></div><p>Qaysi variant tanlanmasin, FastAPI/worker boundary, contract test, ADR va evidence README'da bo'ladi. Node.js faqat GeoPulse scope'idan tashqari mustaqil sabab bilan keyinchalik ko'rib chiqiladi. AI yordamida yozilgan kod ham test, review va tushuntirishdan o'tadi.</p>`,
  code: [{ heading: { h: "Contract test", p: "Adapter asosiy API contractini taxmin qilmaydi." }, title: "notification.contract.test.ts", lang: "ts", code: `test("notification payload has a stable event contract", async () => {\n  const event = buildGeoEvent({ featureId: "a-1" });\n  expect(event).toMatchObject({ type: "feature.changed", featureId: "a-1" });\n  expect(event.requestId).toEqual(expect.any(String));\n});` }],
  tasks: [
    { id: "gi1-1", html: "GeoPulse uchun FastAPI Telegram webhooki, notification worker yoki operator API variantini tanladim", crit: "Muammo, user va acceptance criteria yozilgan" },
    { id: "gi1-2", html: "FastAPI/Celery/worker contractini typed schema bilan belgiladim", crit: "Happy va invalid payload contract testlari o'tadi" },
    { id: "gi1-3", html: "Auth/RBAC yoki webhook verificationni negative test bilan himoyaladim", crit: "Unauthorized flow muvaffaqiyatsiz bo'lishi isbotlangan" },
    { id: "gi1-4", html: "Queue, audit va recovery dalilini GeoPulse README'ga bog'ladim", crit: "ADR, trace/log va runbook URLlari mavjud" },
    { id: "gi1-5", html: "AI yordamidagi kod yoki tahlilni mustaqil tekshirdim", crit: "Review note, test natijasi va cheklovlar qayd etilgan" },
  ],
  resources: [
    { type: "doc", url: "https://core.telegram.org/bots/api", title: "Telegram Bot API", desc: "Webhook va update contracti.", host: "core.telegram.org" },
    { type: "doc", url: "https://owasp.org/www-project-api-security/", title: "OWASP API Security", desc: "Auth, input va abuse case nazorati.", host: "owasp.org" },
    { type: "doc", url: "https://docs.github.com/en/actions", title: "GitHub Actions", desc: "Contract test va CI quality gate.", host: "docs.github.com" },
  ],
  project: { tag: "Optional GeoPulse Integration", title: "Production Worker or Operator API", desc: "GeoPulse'ga webhook, worker yoki operator API qo'shish uchun optional portfolio kengaytmasi.", features: ["typed contract", "security test", "queue/audit", "ADR", "CI evidence"], rubric: ["GeoPulse boundary aniq", "Contract va negative test bor", "Worker failurei yashirilmagan", "AI output tekshirilgan" ] },
  quiz: [{ q: "GeoPulse adapteri uchun contract test nimani himoya qiladi?", a: ["Xarita rangini", "Servislar orasidagi payload va versiya mosligini", "Docker image hajmini", "Keyboard shortcutni"], c: 1, w: "Contract test mustaqil servislar orasidagi taxminlarni buzilishdan saqlaydi.", level: "practical" }],
};

export const BACKEND_ENHANCEMENTS_AFTER: Record<string, Module[]> = {
  BE0: [BACKEND_PLATFORM_DECISION],
  BE10: [BACKEND_RELIABILITY_LAB],
};
