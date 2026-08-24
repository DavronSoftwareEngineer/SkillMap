import type { Module, ProfessionalAssessment } from "../types";
import { SYSTEM_DESIGN_WEB_FLOW_MODULE } from "./webgis-system-design";

const SYSTEM_DESIGN_ASSESSMENT: ProfessionalAssessment = {
  id: "geoops-system-design-v1",
  version: "1.0",
  title: "GeoOps System Design Defense",
  summary: "Katta geospatial mahsulot uchun talabdan recoverygacha bo'lgan qarorlarni ishlaydigan vertical slice va dalil bilan himoya qilish.",
  passScore: 75,
  assessorRequired: true,
  criteria: [
    { id: "requirements", title: "Talab va boundary", description: "User flow, acceptance criteria, ownership va data boundary aniq.", points: 20, minimumPoints: 12, indicators: ["rol va workflow", "data classification", "error/degraded UX"], evidence: ["repo", "architecture"] },
    { id: "architecture", title: "Arxitektura va trade-off", description: "Modular monolith, PostGIS, worker va storage qarori asoslangan.", points: 25, minimumPoints: 15, indicators: ["ADR", "sync/async ajratish", "tenant boundary"], evidence: ["architecture", "adr"] },
    { id: "quality", title: "Ishlaydigan vertical slice", description: "UI, API, database va background flow test bilan ishlaydi.", points: 25, minimumPoints: 15, indicators: ["typed API", "spatial query", "idempotent job"], evidence: ["repo", "tests", "demo"] },
    { id: "operations", title: "Reliability va recovery", description: "Metric, health check, incident hamda restore dalili mavjud.", points: 30, minimumPoints: 18, indicators: ["SLI/SLO", "structured logs", "backup/restore"], evidence: ["operations", "tests", "demo"] },
  ],
  evidence: [
    { id: "repo", label: "Repository", description: "Qayta ishga tushiriladigan source code va README.", kind: "url", placeholder: "https://github.com/...", required: true },
    { id: "architecture", label: "Architecture diagram", description: "Data flow, trust boundary va dependencylar bilan diagram.", kind: "url", placeholder: "https://github.com/.../architecture.md", required: true },
    { id: "adr", label: "ADR to'plami", description: "Kamida ikki muhim qaror va trade-offlar.", kind: "url", placeholder: "https://github.com/.../docs/adr", required: true },
    { id: "tests", label: "Test / failure evidence", description: "Unit, integration yoki smoke test hamda failure drill dalili.", kind: "url", placeholder: "https://github.com/.../actions/runs/...", required: true },
    { id: "operations", label: "Operations runbook", description: "SLO, alert, incident va restore qadamlari.", kind: "url", placeholder: "https://github.com/.../runbook.md", required: true },
    { id: "demo", label: "Demo", description: "Ishlaydigan deployment yoki qisqa video demo.", kind: "url", placeholder: "https://...", required: true },
  ],
  criticalFails: [
    { id: "not-running", title: "Vertical slice ishlamaydi", description: "README bo'yicha asosiy user flow ko'tarilmaydi." },
    { id: "data-leak", title: "Tenant yoki secret buzilishi", description: "Boshqa mijoz ma'lumoti yoki secret ruxsatsiz ko'rinadi." },
    { id: "fabricated", title: "Soxta dalil", description: "O'lchanmagan metric yoki bajarilmagan funksiya tayyor deb ko'rsatilgan." },
    { id: "no-recovery", title: "Recovery isbotlanmagan", description: "Backup borligi aytilgan, lekin restore mashqi o'tmagan." },
  ],
  defense: {
    durationMinutes: 40,
    liveChangeMinutes: 10,
    format: ["5 daqiqa: user va muammo", "10 daqiqa: end-to-end demo", "10 daqiqa: architecture/ADR", "10 daqiqa: failure va recovery", "5 daqiqa: savol-javob"],
    questions: ["Nega microservice emas modular monolith?", "Database vaqtincha ishlamasa user nima ko'radi?", "Duplicate job qaysi joyda va qanday to'xtatiladi?", "Qaysi metric keyingi scale qarorini isbotlaydi?"],
  },
};

const ARCHITECTURE_FOUNDATIONS_MODULE: Module = {
  zoom: "SD0",
  title: "System Thinking Foundations",
  sub: "Talab / boundary / user flow",
  coord: "System Design / boshlash",
  eyebrow: "SYSTEM DESIGN / FOUNDATION",
  mtitle: "Texnologiyadan oldin muammoni va tizim chegarasini chizish",
  lede: "Katta tizim server tanlashdan boshlanmaydi. Avval kim nima qilishi, qaysi data qimmatligi va qaysi holatda foydalanuvchi zarar ko'rishini yozasan.",
  doc: `<h3>Oddiy misol</h3><p>Uy qurishda avval "nechta xona, kim yashaydi, suv qayerdan keladi?" deyiladi. System design ham shunday: avval user flow, data owner va failure sababini aniqlaysan; keyin React, FastAPI yoki database tanlaysan.</p><h3>GeoOps case</h3><div class="tree">Dispatcher task yaratadi -> field worker bajaradi -> foto/joylashuv qo'shadi -> manager tasdiqlaydi</div><p>Bu bitta flow kursning har modulida kengayadi. Har qadam uchun input, output, ruxsat, xato holati va acceptance criteria yoziladi.</p><h3>Architecture brief</h3><div class="chips"><span class="chip t">user</span><span class="chip">workflow</span><span class="chip t">data owner</span><span class="chip">security boundary</span><span class="chip t">SLO</span><span class="chip">recovery</span></div><div class="callout"><div><p>Qoida</p><p>"Katta loyiha" degani ko'p servis emas. Eng kichik, ishlaydigan vertical slice'ni qurib, o'lchangan muammo chiqmaguncha murakkablik qo'shma.</p></div></div>`,
  code: [{ heading: { h: "Bir sahifalik architecture brief", p: "Koddan oldin kelishilgan contract." }, title: "docs/brief.md", lang: "md", code: `# GeoOps task flow\nUser: dispatcher va field worker\nSuccess: task 2 soniyada yaratiladi, field worker uni ko'radi\nData: task geometry PostGISda, foto object storageda\nFailure: internet bo'lmasa mobil app queue qiladi\nMetric: create-task success rate, p95 latency, queue depth\nOut of scope: real-time routing` }],
  tasks: [{ id: "sd0-1", html: "Bitta GeoOps user flow tanladim", crit: "User, trigger, success va failure yozilgan" }, { id: "sd0-2", html: "Data ownership jadvalini tuzdim", crit: "Public, tenant va secret data ajratilgan" }, { id: "sd0-3", html: "Architecture brief yozdim", crit: "Scope va out-of-scope aniq" }],
  resources: [{ type: "doc", url: "https://learn.microsoft.com/en-us/azure/well-architected/what-is-well-architected-framework", title: "Microsoft Well-Architected", desc: "Architecture qarorlarini reliability, security va cost bilan baholash uchun.", host: "learn.microsoft.com" }, { type: "doc", url: "https://sre.google/resources/", title: "Google SRE resources", desc: "Katta tizimlarni user-focused reliability bilan boshqarish amaliyoti.", host: "sre.google" }],
  project: { tag: "Design Brief", title: "GeoOps Problem & Boundary", desc: "Bitta user flow uchun professional architecture brief yoz.", features: ["user flow", "data boundary", "failure list"], rubric: ["Scope aniq", "Data owner aniq", "Failure holati bor"] }, quiz: [{ q: "System designdagi birinchi savol qaysi?", a: ["Qaysi cloud?", "User qanday muammoni hal qiladi?", "Qaysi microservice?", "Qaysi CSS?"], c: 1, w: "Texnologiya user muammosi va acceptance criteriadan keyin tanlanadi.", level: "easy" }],
};

const DATA_ASYNC_MODULE: Module = {
  zoom: "SD2",
  title: "Data, Async Work & Scale",
  sub: "PostGIS / cache / queue / idempotency",
  coord: "System Design / data flow",
  eyebrow: "SYSTEM DESIGN / DATA / ASYNC",
  mtitle: "Qaysi ish databasega, qaysi ish queuega, qaysi javob cachega boradi?",
  lede: "Tizim tezligi faqat server kuchi emas. To'g'ri data boundary, query budget va async flow foydalanuvchi kutishini kamaytiradi.",
  doc: `<h3>Oddiy misol</h3><p>Restoranda kassir ovqat pishishini kutib turmaydi: buyurtmani qabul qiladi, oshxonaga beradi va keyingi mijozga o'tadi. API ham katta import yoki notificationni workerga beradi.</p><h3>GeoOps qarori</h3><div class="exlist"><div class="ex"><b>PostGIS</b><span>Asset, task, geometry, audit va permissionga bog'liq truth data.</span></div><div class="ex"><b>Redis</b><span>Qisqa cache, queue va rate limit; master source emas.</span></div><div class="ex"><b>MinIO</b><span>Foto, video, import fayli; metadata PostGISda.</span></div></div><p>Cache hit bo'lsa tezlik ortadi, lekin eskirgan data xavfi bor. Shuning uchun TTL va invalidation business requirement bilan belgilanadi. Worker retry qilishi mumkin; shu sabab idempotency key shart.</p>`,
  code: [{ heading: { h: "Queue contract", p: "Job qayta yuborilsa data ikki marta buzilmasin." }, title: "job-contract.md", lang: "md", code: `job: import-assets\nidempotency key: tenant + uploaded-file checksum\nsource: object storage URI\nstatus: queued -> running -> succeeded | failed\nretry: only timeout/temporary network failures\nresult: imported count + rejected rows report` }, { heading: { h: "Query budget", p: "Katta viewport ham cheksiz feature qaytarmaydi." }, title: "assets.sql", lang: "sql", code: `SELECT id, category, geom\nFROM assets\nWHERE organization_id = $1\n  AND geom && ST_MakeEnvelope($2,$3,$4,$5,4326)\nLIMIT 1000;\n-- EXPLAIN (ANALYZE, BUFFERS) bilan tekshir.` }],
  tasks: [{ id: "sd2-1", html: "PostGIS, Redis va MinIO data boundarysini yozdim", crit: "Har data turi uchun owner va retention bor" }, { id: "sd2-2", html: "Bitta og'ir ish uchun queue contract yozdim", crit: "Retry va idempotency key bor" }, { id: "sd2-3", html: "Bbox query uchun feature limit va index tekshirdim", crit: "EXPLAIN dalili bor" }, { id: "sd2-4", html: "Cache TTL/invalidation qarorini ADRga yozdim", crit: "Stale data oqibati ko'rsatilgan" }],
  resources: [{ type: "doc", url: "https://www.postgresql.org/docs/current/transaction-iso.html", title: "PostgreSQL transactions", desc: "Data consistency va transaction trade-offlari.", host: "postgresql.org" }, { type: "doc", url: "https://docs.celeryq.dev/en/stable/", title: "Celery documentation", desc: "Worker, retry va task lifecycle uchun.", host: "docs.celeryq.dev" }, { type: "doc", url: "https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/", title: "Redis patterns", desc: "Distributed state va retry muammolarini ehtiyotkor boshqarish uchun.", host: "redis.io" }],
  project: { tag: "Data Flow Lab", title: "Import & Notification Pipeline", desc: "GeoOps import yoki notification flowini queue, retry va observability bilan qur.", features: ["job status", "idempotency", "rejected rows"], rubric: ["HTTP bloklanmaydi", "Duplicate xavfi boshqarilgan", "Failure ko'rinadi", "Data owner aniq", "Query o'lchangan"] }, quiz: [{ q: "Redis qaysi rol uchun ko'proq mos?", a: ["Hamma master geo-data", "Queue/cache/rate limit", "Browser UI", "SVG render"], c: 1, w: "Redis tezkor vaqtinchalik state uchun foydali; durable master data PostGISda qoladi.", level: "practical" }],
};

const RELIABILITY_MODULE: Module = {
  zoom: "SD3",
  title: "Reliability, Security & Operations",
  sub: "SLO / observability / backup / incident",
  coord: "System Design / production",
  eyebrow: "SYSTEM DESIGN / RELIABILITY / SECURITY",
  mtitle: "Deploy qilingan tizimni qanday kuzatasiz, himoya qilasiz va tiklaysiz?",
  lede: "Productionga chiqish deploy bilan tugamaydi. Tizimning holati o'lchanadi, xato tez topiladi va restore oldindan mashq qilinadi.",
  doc: `<h3>Monitoring paneli misoli</h3><p>Operator "map sekin" desa, professional javob taxmin emas: p95 API latency, tile TTFB, error rate, queue depth, database connection va cache hit-rate ko'riladi.</p><h3>Security</h3><p>Frontendga secret qo'yilmaydi. API role/tenantni har requestda tekshiradi. File upload type/size bilan validatsiya qilinadi. Audit log kim qaysi assetni o'zgartirganini saqlaydi.</p><h3>Recovery</h3><div class="tree">backup -> isolated restore -> smoke test -> vaqt/natija dalili -> runbookni yangilash</div><p>Backup mavjudligi yetarli emas; undan tiklash real mashqda isbotlanadi. SLO buzilganda feature chiqarishni vaqtincha to'xtatib, reliability ishini ustun qilish mumkin.</p>`,
  code: [{ heading: { h: "Health contract", p: "Load balancer va operator har bir service holatini tushunadi." }, title: "health.json", lang: "json", code: `{"status":"ok","database":"ok","queue":"degraded","version":"2026.08.24"}` }, { heading: { h: "Incident template", p: "Aybdor emas, sabab va oldini olish topiladi." }, title: "docs/incidents/template.md", lang: "md", code: `# Incident\nImpact: kimga va qancha vaqt\nTimeline: metric/log evidence\nRoot cause: taxmin emas, dalil\nMitigation: hozir nima qilindi\nFollow-up: owner + sana\nLearning: qaysi alert/runbook yetishmadi` }],
  tasks: [{ id: "sd3-1", html: "3 ta SLI va bitta real SLO belgiladim", crit: "Formula, owner va review sanasi yozilgan" }, { id: "sd3-2", html: "Structured log va correlation/request id qo'shdim", crit: "Secret logda yo'q" }, { id: "sd3-3", html: "Health check va error-rate alert rejasini yozdim", crit: "Alert kimga va qachon borishi aniq" }, { id: "sd3-4", html: "Backupdan toza databasega restore mashqini bajardim", crit: "Vaqt, command va smoke test dalili bor" }, { id: "sd3-5", html: "Bitta incident postmortem yozdim", crit: "Root cause va follow-up ownerlari bor" }],
  resources: [{ type: "doc", url: "https://sre.google/workbook/implementing-slos/", title: "Google SRE: SLO", desc: "SLI, SLO va error budgetni o'lchanadigan amaliyot sifatida qo'llash.", host: "sre.google" }, { type: "doc", url: "https://opentelemetry.io/docs/", title: "OpenTelemetry", desc: "Trace, metric va log observability standartlari.", host: "opentelemetry.io" }, { type: "doc", url: "https://owasp.org/API-Security/", title: "OWASP API Security", desc: "API authorization va input xavflarini tekshirish uchun.", host: "owasp.org" }],
  project: { tag: "Operations Lab", title: "GeoOps Reliability Drill", desc: "Tizimni failure scenario bilan tekshir, tikla va dalilni runbookka yoz.", features: ["SLO", "health", "logs", "restore", "postmortem"], rubric: ["Metric user impactga bog'langan", "Security boundary ko'rsatilgan", "Restore isbotlangan", "Alert actionable", "Postmortem dalilli"] }, quiz: [{ q: "Backup qachon haqiqiy recovery deb hisoblanadi?", a: ["Fayl diskda bo'lsa", "Toza muhitga restore va smoke test o'tsa", "READMEda yozilsa", "Docker image bo'lsa"], c: 1, w: "Recovery faqat restore mashqi bilan isbotlanadi.", level: "scenario" }],
};

type LabSpec = {
  zoom: string;
  title: string;
  sub: string;
  mtitle: string;
  lede: string;
  doc: string;
  codeTitle: string;
  codeLang: string;
  code: string;
  tasks: Array<[string, string]>;
  resources: Module["resources"];
  projectTitle: string;
  projectDesc: string;
  features: string[];
  rubric: string[];
  quiz: Module["quiz"];
};

function createLabModule(spec: LabSpec): Module {
  return {
    zoom: spec.zoom,
    title: spec.title,
    sub: spec.sub,
    coord: "System Design / professional lab",
    eyebrow: "SYSTEM DESIGN / PROFESSIONAL LAB",
    mtitle: spec.mtitle,
    lede: spec.lede,
    doc: spec.doc,
    code: [{ heading: { h: "Amaliy contract", p: "Bu artefaktni GeoOps repositorysiga qo'shib, test yoki review bilan tasdiqla." }, title: spec.codeTitle, lang: spec.codeLang, code: spec.code }],
    tasks: spec.tasks.map(([html, crit], index) => ({ id: `${spec.zoom.toLowerCase()}-${index + 1}`, html, crit })),
    resources: spec.resources,
    project: { tag: "Professional Lab", title: spec.projectTitle, desc: spec.projectDesc, features: spec.features, rubric: spec.rubric },
    quiz: spec.quiz,
  };
}

const FRONTEND_ARCHITECTURE_MODULE = createLabModule({
  zoom: "SD-FE",
  title: "Frontend Architecture & Map UX",
  sub: "State / API contract / degraded UI",
  mtitle: "React UI katta tizimda qanday tartibli, tez va xatoga chidamli bo'ladi?",
  lede: "Frontend faqat komponentlar yig'indisi emas: user niyati, server state, map state va xato holatlari orasidagi aniq contract.",
  doc: `<h3>Oddiy misol</h3><p>Dispetcher paneli oshxona zaliga o'xshaydi: foydalanuvchi faqat natijani ko'rishi kerak. API ishlamay qolsa "hech narsa" ko'rsatish emas, aniq error yoki oxirgi cached holat ko'rsatiladi.</p><h3>Professional chegara</h3><div class="tree">route state + UI state | server/API state | MapLibre map state</div><p>React component ichida hamma request, map event va business qoida yig'ilsa tizim tez murakkablashadi. API client typed contractga, feature state hook/storega, MapLibre adapterga, ekran esa user-flowga ajratiladi. Viewport so'rovi debounce/cancel qilinadi; eski javob yangi viewportni bosib ketmasligi kerak.</p><h3>GeoOps case</h3><p>Operator xaritani suradi: layerlar loading holatini ko'rsatadi, bbox request yuboriladi, previous request abort qilinadi, empty hudud message bilan chiqadi. Bu UX ham performance, ham ishonchlilik masalasi.</p>`,
  codeTitle: "features/tasks/useViewportTasks.ts",
  codeLang: "ts",
  code: `const controller = new AbortController();\nconst query = new URLSearchParams({ bbox: bbox.join(",") });\nconst response = await fetch(\`/api/tasks?\${query}\`, { signal: controller.signal });\nif (!response.ok) throw new Error("tasks_load_failed");\nreturn response.json();\n// cleanup: controller.abort() when viewport changes`,
  tasks: [["Map/API state ownership jadvalini chizdim", "React, MapLibre va server state alohida yozilgan"], ["Loading, empty, error, degraded holatlarini qurdim", "Har holat screenshot yoki component test bilan dalillangan"], ["Viewport request cancellation qo'shdim", "Eski response yangi viewport data'sini almashtirmaydi"], ["Accessibility va mobile map UXni tekshirdim", "Keyboard/focus va kichik ekran uchun acceptance criteria bor"]],
  resources: [{ type: "doc", url: "https://react.dev/learn/managing-state", title: "React state management", desc: "UI state ownership va component boundary uchun.", host: "react.dev" }, { type: "doc", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController", title: "MDN AbortController", desc: "Bekor qilingan requestlarni to'g'ri boshqarish uchun.", host: "developer.mozilla.org" }, { type: "doc", url: "https://maplibre.org/maplibre-gl-js/docs/", title: "MapLibre GL JS", desc: "Map lifecycle va viewport layerlar uchun.", host: "maplibre.org" }],
  projectTitle: "GeoOps Operator Console", projectDesc: "Bbox loader, typed API client va degraded UX bilan operator paneli.", features: ["viewport loader", "cancel", "error UX", "accessible controls"], rubric: ["State ownership aniq", "Network race yo'q", "Error userga tushunarli", "Map performance o'lchangan"], quiz: [{ q: "Viewport tez o'zgarganda oldingi request natijasi nega xavfli?", a: ["CSS buziladi", "Eski bbox yangi xarita holatini noto'g'ri almashtirishi mumkin", "PostGIS o'chadi", "JWT yangilanadi"], c: 1, w: "Cancellation yoki request identity stale javobni oldini oladi.", level: "scenario" }],
});

const BACKEND_DOMAIN_MODULE = createLabModule({
  zoom: "SD-BE",
  title: "Backend Domain & API Contracts",
  sub: "Domain / validation / transaction / RBAC",
  mtitle: "FastAPI endpointlarini endpointlar to'plami emas, biznes qoidalari sifatida qurish",
  lede: "Professional backendda router HTTP bilan, service domain qoidasi bilan, repository data access bilan shug'ullanadi; hammasi bitta funksiyaga yig'ilmaydi.",
  doc: `<h3>Oddiy misol</h3><p>"Taskni yopish" faqat statusni almashtirish emas: qaysi rol yopishi mumkin, foto majburiymi, oldingi status nima, auditga nima yoziladi? Shu savollar domain qoidasi.</p><h3>API contract</h3><p>Request va response Pydantic schema bilan yoziladi. API versiyasi, xato kodi, pagination va idempotency biznes kelishuvi sifatida qaraladi. Router database querylarni bilishi mumkin, lekin murakkab policy service qatlamida qoladi.</p><div class="callout"><div><p>GeoOps rule</p><p>Field worker faqat o'ziga biriktirilgan taskni <code>in_progress</code> yoki <code>done</code>ga o'tkazadi; dispatcher boshqa foydalanuvchiga biriktiradi; har o'zgarish audit event bo'ladi.</p></div></div>`,
  codeTitle: "domain/tasks.py",
  codeLang: "py",
  code: `def close_task(task: Task, actor: User, proof_uri: str | None) -> None:\n    if task.assignee_id != actor.id and not actor.has_role("dispatcher"):\n        raise Forbidden("task ownership required")\n    if not proof_uri:\n        raise DomainRuleError("completion proof required")\n    task.status = "done"\n    task.completed_by = actor.id\n    audit.record("task.closed", task_id=task.id, actor_id=actor.id)`,
  tasks: [["Task state-machine yozdim", "Ruxsatli va taqiqlangan transitionlar bor"], ["Pydantic request/response contract yaratdim", "Invalid input API chegarasida qaytadi"], ["Role va tenant checkni integration test bilan isbotladim", "Boshqa tenant taskiga access yo'q"], ["Domain xato va HTTP xato mappingini yozdim", "User-facing error va log context farqlangan"]],
  resources: [{ type: "doc", url: "https://fastapi.tiangolo.com/tutorial/body/", title: "FastAPI request body", desc: "Typed API request/response contractlar uchun.", host: "fastapi.tiangolo.com" }, { type: "doc", url: "https://docs.pydantic.dev/latest/", title: "Pydantic", desc: "Validation va schema modelini to'g'ri qurish uchun.", host: "docs.pydantic.dev" }, { type: "doc", url: "https://owasp.org/API-Security/", title: "OWASP API Security", desc: "Authorization va object-level access xatarlarini tekshirish uchun.", host: "owasp.org" }],
  projectTitle: "Task Lifecycle API", projectDesc: "RBAC, audit va testlangan task state-machine bilan FastAPI domain moduli.", features: ["Pydantic", "RBAC", "audit", "state machine"], rubric: ["Business rule testlangan", "Auth routerdan o'tib ketmaydi", "Error contract aniq", "Audit bor"], quiz: [{ q: "Business rule qayerda yashashi ma'qul?", a: ["Faqat React componentda", "Domain/service qatlamida, test bilan", "SQL commentda", "Nginxda"], c: 1, w: "Domain qoidasi bir nechta API yoki worker tomonidan qayta ishlatilishi mumkin.", level: "practical" }],
});

const DATABASE_DESIGN_MODULE = createLabModule({
  zoom: "SD-DB",
  title: "Database Design & Spatial Data",
  sub: "Schema / migration / index / transaction",
  mtitle: "PostGIS database — faqat jadval emas, mahsulotning ishonchli xotirasi",
  lede: "Schema biznes qoidani ifodalaydi; index esa o'lchangan queryni tezlashtiradi. Ikkisini ham migration va test bilan boshqarasiz.",
  doc: `<h3>Model</h3><p>Organization, user, asset, task va audit event alohida entity. Geometry qaysi CRSda, qaysi feature qanchalik aniq, qaysi data qancha saqlanishi schema contractda yoziladi.</p><h3>Index falsafasi</h3><p>Har ustunga index qo'yilmaydi. Avval real query, cardinality va <code>EXPLAIN ANALYZE</code> ko'riladi; keyin btree, GiST yoki composite strategiyasi tanlanadi. Geometry validity va SRID import vaqtida tekshiriladi.</p><h3>Migration</h3><p>Production schema qo'lda o'zgartirilmaydi. Alembic migration forward/backward qarori, data migration, backup va rollback rejasi bilan version controlga kiradi.</p>`,
  codeTitle: "database/002_tasks.sql",
  codeLang: "sql",
  code: `CREATE TABLE tasks (\n  id uuid PRIMARY KEY,\n  organization_id uuid NOT NULL REFERENCES organizations(id),\n  status text NOT NULL CHECK (status IN ('open','in_progress','done')),\n  geom geometry(Point, 4326) NOT NULL,\n  created_at timestamptz NOT NULL DEFAULT now()\n);\nCREATE INDEX tasks_org_idx ON tasks (organization_id);\nCREATE INDEX tasks_geom_gix ON tasks USING GIST (geom);`,
  tasks: [["ER diagram va data retention siyosatini yaratdim", "Owner, relation va deletion policy aniq"], ["Alembic migrationni fresh databasega qo'lladim", "Upgrade natijasi testlangan"], ["Bitta spatial query uchun EXPLAIN ANALYZE oldim", "Index qarori dalil bilan yozilgan"], ["SRID/validity import guard yozdim", "Noto'g'ri geodata reject qilinadi"]],
  resources: [{ type: "doc", url: "https://www.postgresql.org/docs/current/ddl.html", title: "PostgreSQL DDL", desc: "Schema constraint va database design uchun.", host: "postgresql.org" }, { type: "doc", url: "https://postgis.net/docs/", title: "PostGIS docs", desc: "Geometry, SRID va spatial indexlar uchun.", host: "postgis.net" }, { type: "doc", url: "https://alembic.sqlalchemy.org/en/latest/", title: "Alembic", desc: "Versioned database migrationlar uchun.", host: "alembic.sqlalchemy.org" }],
  projectTitle: "GeoOps Data Contract", projectDesc: "Versioned schema, spatial quality gate va benchmark bilan PostGIS model.", features: ["ERD", "migration", "GiST", "quality guard"], rubric: ["Schema domainni ifodalaydi", "Migration repeatable", "Query o'lchangan", "CRS/validity aniq"], quiz: [{ q: "Index qachon qo'shiladi?", a: ["Har yangi column bilan", "Real query va query plan asosida", "UI sekin bo'lsa avtomatik", "Docker buildda"], c: 1, w: "Index write cost ham olib keladi; uni o'lchangan query uchun tanlash kerak.", level: "scenario" }],
});

const DISTRIBUTED_MODULE = createLabModule({
  zoom: "SD-DIST",
  title: "Distributed Systems & Real-time",
  sub: "Consistency / events / WebSocket / failure",
  mtitle: "Bir nechta process va tarmoq bor joyda xabarlar kechiksa yoki takrorlansa nima qilasiz?",
  lede: "Queue, WebSocket va tashqi API bilan ishlashda timeout, duplicate, ordering va partial failure odatiy holat.",
  doc: `<h3>Oddiy misol</h3><p>Kuryer xati ikki marta keldi yoki kechikdi. Sizning tizim ham eventni ikki marta qabul qilishi, javobni olmasligi yoki tarmoq uzilishi mumkin. Shuning uchun eventni "bir marta albatta" keladi deb yozish xavfli.</p><h3>GeoOps case</h3><p>Field xodim offline taskni ikki marta sync qildi. Server operation id bilan duplicate'ni taniydi, birinchi natijani qaytaradi, audit eventga correlation id yozadi. Live dashboard WebSocket uzilsa poll/reconnect fallback ishlatadi.</p><h3>Trade-off</h3><p>Strong consistency hamma joyda shart emas. Lekin task status, permission va paymentga o'xshash critical data transactionga; map presence yoki live cursor esa eventual consistencyga mos bo'lishi mumkin.</p>`,
  codeTitle: "events/task-events.json",
  codeLang: "json",
  code: `{"event_id":"01J...","type":"task.updated","aggregate_id":"task-42","operation_id":"mobile-req-9","occurred_at":"2026-08-24T12:00:00Z","version":3}`,
  tasks: [["Bitta event contract va version siyosatini yozdim", "Event id, operation id va schema version bor"], ["Offline sync duplicate ssenariysini test qildim", "Ikki yuborishda bitta domain natija"], ["WebSocket reconnect/fallback qarorini yozdim", "Tarmoq uzilishi UXda ko'rinadi"], ["Critical va eventually-consistent data ro'yxatini ajratdim", "Business sabab ko'rsatilgan"]],
  resources: [{ type: "doc", url: "https://www.postgresql.org/docs/current/transaction-iso.html", title: "PostgreSQL isolation", desc: "Consistency va transaction isolation tushunchalari.", host: "postgresql.org" }, { type: "doc", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", title: "MDN WebSocket", desc: "Browser live connection lifecycle uchun.", host: "developer.mozilla.org" }, { type: "doc", url: "https://microservices.io/patterns/data/transactional-outbox.html", title: "Transactional outbox pattern", desc: "DB va event publish orasidagi failure trade-offini o'rganish uchun.", host: "microservices.io" }],
  projectTitle: "Offline Field Sync Contract", projectDesc: "Duplicate-safe task sync va live update fallback bilan mobile/WebGIS flow.", features: ["operation id", "event version", "reconnect", "audit"], rubric: ["Duplicate xavfi boshqarilgan", "Offline holat ochiq", "Critical data transactionda", "Event schema versionlangan"], quiz: [{ q: "WebSocket uzilganda professional UI nima qiladi?", a: ["Userga hech narsa demaydi", "Reconnect/fallback qiladi va live holat cheklanganini bildiradi", "Databasega direct ulanadi", "Secret yuboradi"], c: 1, w: "Tarmoq uzilishi normal failure mode; UX va retry siyosati bo'lishi kerak.", level: "scenario" }],
});

const PERFORMANCE_MODULE = createLabModule({
  zoom: "SD-PERF",
  title: "Performance, Capacity & Cost",
  sub: "Load test / cache / CDN / budgets",
  mtitle: "Tizimni sezgi bilan emas, latency, throughput va cost bilan tezlashtirish",
  lede: "Katta map sekin bo'lsa avval bottleneck o'lchanadi: frontend render, tile TTFB, Tegola cache, PostGIS query yoki tarmoqdan qaysi biri muammo ekanini ajrating.",
  doc: `<h3>To'rt o'lchov</h3><div class="chips"><span class="chip t">p50/p95 latency</span><span class="chip">throughput</span><span class="chip t">error rate</span><span class="chip">cost per workload</span></div><p>Map uchun tile byte size, TTFB, cache hit-rate, visible feature count va browser FPS alohida o'lchanadi. CDN originni emas, userga yaqin deliveryni tezlashtiradi; og'ir query yoki GPU render muammosini o'zi tuzatmaydi.</p><h3>Capacity</h3><p>Avval normal traffic va eng og'ir user flow uchun budget yoziladi. So'ng load test bosqichma-bosqich o'tkaziladi. Database connection limit, worker concurrency, memory, tile cache disk va object storage egress kuzatiladi.</p>`,
  codeTitle: "docs/performance-budget.md",
  codeLang: "md",
  code: `## GeoOps budget\n- task create p95: <= 500 ms\n- viewport API p95: <= 800 ms\n- vector tile p95 TTFB: <= 400 ms (warm cache)\n- map interaction: no long task > 50 ms\n- max features per viewport response: 1,000\n- test: cold vs warm cache reported separately`,
  tasks: [["Asosiy GeoOps flowlar uchun performance budget yozdim", "p95 va error targetlar bor"], ["Cold/warm cache benchmark qildim", "Natijalar aralashtirilmagan"], ["EXPLAIN, network va browser profiler bilan bottleneck ajratdim", "Bitta o'lchangan xulosa bor"], ["Load test va capacity limit rejasini yozdim", "Test data, concurrency va exit criteria bor"]],
  resources: [{ type: "doc", url: "https://grafana.com/docs/k6/latest/", title: "k6 documentation", desc: "HTTP load test va thresholdlar uchun.", host: "grafana.com" }, { type: "doc", url: "https://developer.chrome.com/docs/devtools/performance", title: "Chrome Performance", desc: "Browser long task va render bottleneckini ko'rish uchun.", host: "developer.chrome.com" }, { type: "doc", url: "https://developer.mozilla.org/en-US/docs/Web/Performance", title: "MDN Web Performance", desc: "Browser va network performance tushunchalari.", host: "developer.mozilla.org" }],
  projectTitle: "Map Performance Report", projectDesc: "GeoOps map/API flowini cold/warm cache va browser/network dalillari bilan optimizatsiya qil.", features: ["budget", "profile", "load test", "capacity note"], rubric: ["Metric aniq", "Bottleneck ajratilgan", "Benchmark halol", "Trade-off/cost yozilgan"], quiz: [{ q: "CDN qaysi muammoni to'g'ridan-to'g'ri hal qilmaydi?", a: ["Userga yaqin cached delivery", "Og'ir PostGIS query va browser render", "Static tile latency", "Origin traffic"], c: 1, w: "CDN deliveryni tezlashtiradi; origin query yoki render muammosi alohida o'lchanadi.", level: "practical" }],
});

const SECURITY_MODULE = createLabModule({
  zoom: "SD-SEC",
  title: "Security, Multi-tenancy & Privacy",
  sub: "Threat model / RBAC / secrets / audit",
  mtitle: "Bir mijoz data'si boshqasiga chiqmasligi va secretlar oshkor bo'lmasligi qanday ta'minlanadi?",
  lede: "Security feature oxirida qo'shiladigan checkbox emas; data model, API va deployment boundarylarida boshidan qaror qilinadi.",
  doc: `<h3>Threat model</h3><p>Kim hujum qilishi mumkin, nimani olishni xohlaydi, qaysi endpointga kiradi va qaysi control to'xtatadi? GeoOps'da eng qimmat narsa ko'pincha asset joylashuvi, GPS trek va mijoz hujjatlari.</p><h3>Multi-tenant qoida</h3><p>Har request identitydan organization olish kerak; client yuborgan tenant idga ishonilmaydi. Query, file URI, cache key va background job ham tenant scope bilan yuradi. RBAC esa "admin" nomi emas, aniq ruxsatlar ro'yxati.</p><h3>Privacy</h3><p>Field xodim live locationi uchun retention, ko'rish roli, export policy va consent/contract yoziladi. OSM, satellite va third-party data license/attribution ham product requirement.</p>`,
  codeTitle: "security/tenant-policy.md",
  codeLang: "md",
  code: `Request identity -> organization_id is server-derived\nQuery rule -> WHERE organization_id = current_actor.organization_id\nObject key -> tenants/{organization_id}/{uuid}\nCache key -> tenant:{organization_id}:...\nAudit -> actor, action, target, timestamp, request_id\nSecrets -> deployment secret manager; never frontend bundle or git`,
  tasks: [["GeoOps threat model yozdim", "Asset, actor, attack path va control bor"], ["Tenant isolation integration test yozdim", "Cross-tenant GET/PUT/file access bloklangan"], ["Secret scan va config siyosatini qo'shdim", "Repositoryda secret yo'q"], ["Location privacy/retention policy yozdim", "Owner, retention va export ruxsati aniq"]],
  resources: [{ type: "doc", url: "https://owasp.org/www-project-api-security/", title: "OWASP API Security Top 10", desc: "API authorization va input xavflari uchun.", host: "owasp.org" }, { type: "doc", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", title: "OWASP Authorization", desc: "Role/object authorization amaliyoti.", host: "cheatsheetseries.owasp.org" }, { type: "doc", url: "https://docs.github.com/en/code-security/secret-scanning", title: "GitHub secret scanning", desc: "Secretlarni repositoryda topish va oldini olish uchun.", host: "docs.github.com" }],
  projectTitle: "GeoOps Security Review", projectDesc: "Multi-tenant API, secret va location privacy boundarylarini threat model hamda test bilan himoya qil.", features: ["threat model", "tenant test", "audit", "retention"], rubric: ["Cross-tenant access yo'q", "Secrets boshqarilgan", "Audit yoziladi", "Privacy/licensing ko'rsatilgan"], quiz: [{ q: "Tenant id qayerdan olinishi xavfsizroq?", a: ["Frontend request bodydan", "Server tasdiqlagan user identitydan", "URL querydan", "Map layer nomidan"], c: 1, w: "Client yuborgan tenant id manipulyatsiya qilinishi mumkin; server identity scope belgilaydi.", level: "scenario" }],
});

const DELIVERY_MODULE = createLabModule({
  zoom: "SD-DEL",
  title: "Delivery, CI/CD & Configuration",
  sub: "Docker / pipeline / rollback / environments",
  mtitle: "Kodning laptopdan productiongacha xavfsiz va qayta tiklanadigan yo'li",
  lede: "Deploy bitta command emas: build, test, migration, config, health check va rollbackdan iborat release tizimi.",
  doc: `<h3>Environmentlar</h3><p>Local, test/staging va production bir xil source code, lekin boshqa config/secret bilan ishlaydi. "Laptopda ishlaydi" production isboti emas. Docker image versiyalanadi; config image ichiga hardcode qilinmaydi.</p><h3>Pipeline</h3><div class="tree">format/lint -> unit -> integration -> build image -> migration plan -> deploy -> smoke test -> monitor -> rollback if needed</div><p>Database migration bilan deploy birga rejalashtiriladi. Backward-compatible schema va feature flag katta o'zgarish riskini kamaytiradi. Rollback ham oldindan amalda sinovdan o'tadi.</p>`,
  codeTitle: ".github/workflows/quality.yml",
  codeLang: "yaml",
  code: `jobs:\n  verify:\n    steps:\n      - run: npm ci && npm test && npm run build\n      - run: pytest\n      - run: docker compose -f compose.test.yaml up --build --wait\n      - run: ./scripts/smoke-test.sh\n  # deploy faqat verify o'tgach va environment approvaldan keyin`,
  tasks: [["Environment/config matrix yozdim", "Qaysi secret qayerda berilishi aniq"], ["CI pipeline test/build/smoke gate qo'shdim", "Fail bo'lsa deploy bo'lmaydi"], ["Migration/deploy rollback rejasini yozdim", "Backward compatibility tekshirilgan"], ["Release runbook va version policy tuzdim", "On-call/owner va smoke test bor"]],
  resources: [{ type: "doc", url: "https://docs.docker.com/compose/", title: "Docker Compose", desc: "Local multi-service environmentni qayta yaratish uchun.", host: "docs.docker.com" }, { type: "doc", url: "https://docs.github.com/en/actions", title: "GitHub Actions", desc: "CI/CD quality gate va release pipeline uchun.", host: "docs.github.com" }, { type: "doc", url: "https://12factor.net/config", title: "Twelve-Factor Config", desc: "Configuration va secretlarni code'dan ajratish uchun.", host: "12factor.net" }],
  projectTitle: "GeoOps Delivery Pipeline", projectDesc: "Testlangan Docker stack va rollback-aware CI/CD pipeline.", features: ["Compose", "CI", "migration plan", "smoke test"], rubric: ["Fresh start ishlaydi", "Config secret emas", "Deploy gate bor", "Rollback yozilgan"], quiz: [{ q: "Production config qayerda bo'lishi kerak?", a: ["Frontend bundle ichida", "Versioned code'dan tashqaridagi environment/secretsda", "Git commit xabarida", "Map style JSON ichida"], c: 1, w: "Config va secret image/source code'dan ajratiladi.", level: "easy" }],
});

const RECOVERY_MODULE = createLabModule({
  zoom: "SD-REC",
  title: "Data Lifecycle & Disaster Recovery",
  sub: "Backup / restore / audit / retention",
  mtitle: "Data yo'qolsa, noto'g'ri import bo'lsa yoki servis buzilsa nima qilasiz?",
  lede: "Backup siyosati recovery emas. Recovery — vaqt va dalil bilan sinovdan o'tgan tiklanish jarayoni.",
  doc: `<h3>Data lifecycle</h3><p>Har data uchun owner, source, license, retention, backup, export va deletion qoidasi bor. PostGIS transactional data, MinIO file, Redis temporary cache va observability loglari bir xil retentionga ega bo'lmaydi.</p><h3>RPO/RTO</h3><p><strong>RPO</strong> — qancha data yo'qolishi mumkin; <strong>RTO</strong> — qancha vaqtda tiklanishi kerak. Ular business bilan kelishiladi, texnik taxmin bilan emas.</p><h3>Drill</h3><p>Isolated environmentga backup restore qilinadi, migration version tekshiriladi, smoke test o'tadi va natija runbookga yoziladi. Noto'g'ri import uchun atomic publish yoki versioned dataset rollback strategiyasi kerak.</p>`,
  codeTitle: "docs/recovery-plan.md",
  codeLang: "md",
  code: `RPO: 24 hours for assets; 15 minutes for active tasks\nRTO: 4 hours for operator API\nBackup: encrypted daily PostGIS dump + object-storage versioning\nRestore drill: monthly isolated restore -> migration check -> smoke test\nOwner: platform engineer\nEvidence: restore timestamp, duration, failed/success checks`,
  tasks: [["Data inventory va retention matrix yaratdim", "PostGIS/MinIO/Redis/log farqlangan"], ["RPO/RTOni business impact bilan belgiladim", "Owner tasdiqlagan"], ["Isolated restore drill o'tkazdim", "Duration va smoke test dalili bor"], ["Noto'g'ri import rollback siyosatini test qildim", "Eski valid dataset saqlangan"]],
  resources: [{ type: "doc", url: "https://www.postgresql.org/docs/current/backup.html", title: "PostgreSQL backup", desc: "Backup/restore strategiyalari uchun rasmiy docs.", host: "postgresql.org" }, { type: "doc", url: "https://min.io/docs/minio/linux/administration/object-management/object-versioning.html", title: "MinIO versioning", desc: "Object file versioning va rollback uchun.", host: "min.io" }, { type: "doc", url: "https://sre.google/workbook/postmortem-culture/", title: "Google SRE postmortems", desc: "Incidentdan o'rganish va recovery process uchun.", host: "sre.google" }],
  projectTitle: "GeoOps Recovery Drill", projectDesc: "Data lifecycle, RPO/RTO va real restore evidence bilan recovery plan.", features: ["inventory", "RPO/RTO", "restore", "rollback"], rubric: ["Data owner aniq", "Restore testlangan", "RPO/RTO asoslangan", "Rollback xavfsiz"], quiz: [{ q: "RTO nimani bildiradi?", a: ["Qancha data yo'qolishi mumkin", "Xizmatni tiklash uchun ruxsat etilgan vaqt", "Tile zoom", "Database index"], c: 1, w: "RTO recovery vaqt maqsadi; RPO data-loss chegarasi.", level: "easy" }],
});

const STYLES_MODULE = createLabModule({
  zoom: "SD-STYLE",
  title: "Architecture Styles & Trade-offs",
  sub: "Monolith / modular monolith / microservice",
  mtitle: "Qaysi arxitektura uslubi muammoingizga mos — va qachon o'zgartirish kerak?",
  lede: "Arxitektura modaga ergashish emas. Team size, domain, deploy, failure va observability xarajatlarini birga tortish.",
  doc: `<h3>Uch variant</h3><div class="exlist"><div class="ex"><b>Monolith</b><span>Tez boshlash, bitta deploy. Kichik product uchun foydali, lekin ichki boundary bo'lmasa vaqt o'tib chalkashadi.</span></div><div class="ex"><b>Modular monolith</b><span>Bitta deploy, lekin domain modulelari qat'iy: task, asset, import, auth. GeoOps uchun boshlang'ich tavsiya.</span></div><div class="ex"><b>Microservice</b><span>Mustaqil scale/release imkoniyati, lekin network failure, contract, tracing, deploy va ownership xarajati katta.</span></div></div><p>Service ajratishning isboti: o'lchangan resource bottleneck, boshqa release cadence, alohida ownership yoki security boundary. "Katta ko'rinadi" — sabab emas.</p>`,
  codeTitle: "docs/adr/002-processing-boundary.md",
  codeLang: "md",
  code: `Context: raster import CPU/RAM og'ir, API latencyga ta'sir qilmoqda.\nDecision: import workerini API processdan alohida containerga ajratish.\nNot chosen: barcha domainni microservice qilish.\nTrade-off: queue/retry/observability qo'shiladi.\nRevisit: worker mustaqil release yoki autoscale talab qilsa service boundary qayta baholanadi.`,
  tasks: [["Current GeoOps uchun context diagram chizdim", "Domain va external dependencylar aniq"], ["Modular monolith boundarylarini yozdim", "Auth/task/asset/import mas'uliyati ajratilgan"], ["Bitta microservice taklifini ADR bilan rad/yoki qabul qildim", "Metric yoki business evidence bor"], ["Coupling va failure dependencylarni ro'yxatladim", "Har birida mitigation bor"]],
  resources: [{ type: "doc", url: "https://martinfowler.com/articles/microservices.html", title: "Microservices", desc: "Microservice trade-offlarini tushunish uchun klassik maqola.", host: "martinfowler.com" }, { type: "doc", url: "https://www.oreilly.com/library/view/software-architecture-the/9781492086881/", title: "Software architecture reference", desc: "Architecture characteristics va trade-offlar haqida professional manba.", host: "oreilly.com" }, { type: "doc", url: "https://aws.amazon.com/architecture/well-architected/", title: "AWS Well-Architected", desc: "Operational, security va cost qarorlarini baholash uchun.", host: "aws.amazon.com" }],
  projectTitle: "GeoOps Architecture ADR Set", projectDesc: "Modular monolith qarorini va keyingi ajratish triggerlarini dalil bilan himoya qil.", features: ["context diagram", "module boundary", "ADR", "revisit trigger"], rubric: ["Trade-off halol", "Overengineering yo'q", "Boundarylar aniq", "Metric trigger bor"], quiz: [{ q: "Microservice qachon kuchli qaror bo'lishi mumkin?", a: ["Hamma loyiha uchun doim", "Mustaqil scale/release/ownership talabi dalil bilan bo'lsa", "React ishlatilsa", "Database kichik bo'lsa"], c: 1, w: "Microservice foydasi uning operatsion xarajatini qoplashi kerak.", level: "scenario" }],
});

const GEOOPS_CASE_MODULE = createLabModule({
  zoom: "SD-GEO",
  title: "GeoOps Case Studies",
  sub: "WebGIS / field / tiles / offline",
  mtitle: "Bir xil system-design prinsiplari katta geospatial mahsulotlarda qanday ko'rinadi?",
  lede: "GeoOps case study kursdagi hamma qarorni bitta productionga yaqin WebGIS mahsulotiga yig'adi.",
  doc: `<h3>Case 1: Asset registry</h3><p>Base map OSM/Tegola/MVT bilan, mijoz assetlari PostGIS va tenant boundary bilan. Xaritada faqat viewport data'si olinadi; katta static qatlam cache/PMTiles distribution orqali berilishi mumkin.</p><h3>Case 2: Field operation</h3><p>Mobil app offline task update'ni local queuega saqlaydi. Internet qaytganda idempotency operation bilan API sync qiladi. Foto object storagega, metadata/audit PostGISga boradi.</p><h3>Case 3: Slow tile</h3><p>"Map sekin" degan xulosadan oldin tile TTFB, cache hit-rate, PBF byte size, PostGIS plan va browser render ajratiladi. Arxitektura o'zgartirish faqat o'lchovdan keyin qilinadi.</p>`,
  codeTitle: "docs/geoops-layer-policy.md",
  codeLang: "md",
  code: `Base layer: OSM roads/buildings -> Tegola MVT + cache\nOperational layer: tenant assets/tasks -> FastAPI/PostGIS, permission-aware\nLive layer: GPS/status -> bbox API or WebSocket\nOffline package: versioned public base data only\nRule: private/permission data never bundled into public PMTiles`,
  tasks: [["Base/operational/live layerlarni ajratdim", "Har layerning source, update rate va permissioni bor"], ["Tile performance investigation template yozdim", "TTFB, size, hit-rate va render metriclari bor"], ["Offline sync caseini failure mode bilan chizdim", "Duplicate/conflict/data freshness ko'rsatilgan"], ["Data licensing/attribution checklist tuzdim", "OSM va mijoz data ownershipi ajratilgan"]],
  resources: [{ type: "doc", url: "https://tegola.io/documentation/", title: "Tegola documentation", desc: "PostGISdan vector tile delivery va cache uchun.", host: "tegola.io" }, { type: "doc", url: "https://docs.protomaps.com/pmtiles/", title: "PMTiles documentation", desc: "Static/offline tile distribution trade-offlari uchun.", host: "docs.protomaps.com" }, { type: "doc", url: "https://www.openstreetmap.org/copyright", title: "OpenStreetMap copyright", desc: "OSM attribution va license talablarini tekshirish uchun.", host: "openstreetmap.org" }],
  projectTitle: "GeoOps Architecture Review", projectDesc: "O'zingizning WebGIS yoki GeoOps tizimingizda layer/data/operations qarorlarini audit qil.", features: ["layer policy", "tile report", "offline flow", "license checklist"], rubric: ["Layer purpose aniq", "Permission xavfsiz", "Performance o'lchangan", "License hujjatlashtirilgan"], quiz: [{ q: "Private tenant assetlari public PMTiles ichiga qo'shilishi mumkinmi?", a: ["Ha, cache tez bo'ladi", "Yo'q, permission data public static packagega kirmaydi", "Faqat z15da", "Faqat MapLibre bilan"], c: 1, w: "Permissionga bog'liq data dynamic, access-controlled oqimda qolishi kerak.", level: "scenario" }],
});

const CAPSTONE_MODULE: Module = {
  zoom: "SDF",
  title: "GeoOps System Design Capstone",
  sub: "Architecture defense",
  coord: "System Design / final",
  eyebrow: "SYSTEM DESIGN / CAPSTONE / DEFENSE",
  mtitle: "GeoOps tizimini seniorcha qarorlar va ishlaydigan dalillar bilan himoya qil",
  lede: "Yakuniy loyiha texnologiya logotiplari emas: bitta user flow, aniq boundary, ishlaydigan vertical slice, failure drill va tiklanish dalili.",
  doc: `<h3>Capstone vazifasi</h3><p>GeoOps uchun dispatcher -> field worker -> manager oqimini yoki o'zingizdagi real WebGIS workflow'ni tanlang. React/MapLibre, FastAPI, PostGIS, worker va object storage bilan minimal, lekin ishlaydigan tizim yarating. Har katta qaror ADR orqali himoyalanadi.</p><h3>Himoya tartibi</h3><div class="tree">Muammo -> demo -> diagram -> ADR -> test/failure -> metric -> restore -> savol-javob</div><div class="callout"><div><p>Halollik qoidasi</p><p>AI yordami ishlatilgan bo'lsa, qayerda ishlatilgani va mustaqil tekshiruv yoziladi. O'lchanmagan benchmark, ishlamagan deploy yoki tekshirilmagan security tayyor deb ko'rsatilmaydi.</p></div></div>`,
  code: [{ heading: { h: "Portfolio evidence", p: "Reviewer loyiha ishlashini o'zi tekshira olishi kerak." }, title: "README checklist", lang: "md", code: `- [ ] local start command\n- [ ] demo URL/video\n- [ ] architecture diagram\n- [ ] ADRs\n- [ ] test command + result\n- [ ] SLO/metrics screenshot\n- [ ] backup restore evidence\n- [ ] AI-use log` }],
  tasks: [{ id: "sdf-1", html: "Capstone scope va acceptance criteria tanladim", crit: "Bitta user flow 10 qatordan kam briefda" }, { id: "sdf-2", html: "Vertical slice ishga tushdi", crit: "UI/API/DB/worker flow ko'rsatiladi" }, { id: "sdf-3", html: "Arxitektura diagram va ADR tayyorladim", crit: "Trade-offlar bor" }, { id: "sdf-4", html: "Failure/restore drill o'tkazdim", crit: "Dalil URL yoki reportda" }, { id: "sdf-5", html: "Tashqi reviewer uchun defense tayyorladim", crit: "Barcha required evidence biriktirilgan" }],
  resources: [{ type: "doc", url: "https://github.com/joelparkerhenderson/architecture-decision-record", title: "ADR template", desc: "Arxitektura qarorlarini izchil hujjatlashtirish uchun.", host: "github.com" }, { type: "doc", url: "https://sre.google/workbook/postmortem-culture/", title: "Google SRE postmortems", desc: "Blameless incident learning amaliyoti.", host: "sre.google" }],
  project: { tag: "System Design / Final", title: "GeoOps Production Architecture", desc: "Bitta geospatial product flowini seniorcha arxitektura va evidence bilan himoya qil.", features: ["vertical slice", "ADR", "SLO", "recovery"], rubric: ["Ishlaydi", "Trade-offlar aniq", "Recovery sinalgan", "Dalil halol"], assessment: SYSTEM_DESIGN_ASSESSMENT }, quiz: [{ q: "Capstone himoyasining eng kuchli dalili nima?", a: ["Ko'p texnologiya nomi", "Ishlaydigan flow, test, metric va ADR", "Chiroyli diagram yolg'iz", "AI generatsiya qilgan README"], c: 1, w: "Professional dalil ishlab turgan tizim va tekshiriladigan qarorlardan iborat.", level: "scenario" }],
};

type Deepening = { failure: string; decision: string; review: string };

const DEEPENING: Record<string, Deepening> = {
  SD0: {
    failure: "Product owner 'xarita qiling' deydi, lekin user, success metric va data owner aniqlanmagan. Scope-ni rad etish yoki discovery savollari bilan qayta yozish kerak.",
    decision: "Bitta vertical slice va out-of-scope ro'yxatini ADR/briefda himoya qil.",
    review: "Qaysi user zarari eng katta va uni qaysi metric bilan ko'rasiz?",
  },
  sd1: {
    failure: "Task saqlanadi, lekin Telegram timeout bo'ladi; browser userga to'g'ri success holatini ko'rsatishi va job keyin retry qilishi kerak.",
    decision: "Synchronous API transaction bilan asynchronous notification chegarasini ADRda yoz.",
    review: "Qaysi dependency ishlamasa ham task data yo'qolmasligi kerak?",
  },
  "SD-FE": {
    failure: "User xaritani tez suradi; eski bbox response yangi viewportdagi data ustiga yozib yuboradi.",
    decision: "Abort, request identity yoki cache strategiyasidan birini tanlab, UX trade-offini yoz.",
    review: "Offline yoki stale holatda operator nimani ko'radi va nimani qila olmaydi?",
  },
  "SD-BE": {
    failure: "Field worker boshqa tenant task ID'sini topib PUT yuboradi yoki status transitionni chetlab o'tadi.",
    decision: "Object-level authorization va state-machine qayerda tekshirilishini yoz.",
    review: "Nega business rule faqat frontendda qolmasligi kerak?",
  },
  "SD-DB": {
    failure: "Yangi migration katta jadvalni lock qilib, operator API'ni to'xtatadi yoki invalid geometry import qilinadi.",
    decision: "Migration rollout, index va geodata quality gate siyosatini yoz.",
    review: "Query plan indexdan foydalanmasa, keyingi qadam nima bo'ladi?",
  },
  SD2: {
    failure: "Import job retry bo'ldi va bir xil assetlar ikki marta yaratildi; Redis vaqtincha yo'qolishi ham mumkin.",
    decision: "Idempotency key, durable state va retryable/non-retryable xatolarni tanla.",
    review: "Nega Redis master source bo'lmasligi kerak?",
  },
  "SD-DIST": {
    failure: "Mobil app offline update'ni ikki marta yubordi, WebSocket uzildi va eventlar kechikdi.",
    decision: "Consistency talabi va reconnect/fallback oqimini yoz.",
    review: "Qaysi GeoOps data eventual consistencyga mos emas?",
  },
  "SD-PERF": {
    failure: "Kuchli kompyuterda pan/zoom yaxshi, lekin ayrim tile'lar sekin chiziladi; CDN ham queryni tuzatmadi.",
    decision: "Cache, query/index, tile budget yoki frontend renderdan qaysi biri bottleneck ekanini o'lchab tanla.",
    review: "Cold cache va warm cache natijasini nega alohida berasiz?",
  },
  SD3: {
    failure: "Database qisqa muddatga ishlamadi, alert kech keldi va operatorga noto'g'ri 'hammasi yaxshi' holati ko'rindi.",
    decision: "SLI/SLO, alert threshold va degraded response siyosatini yoz.",
    review: "SLO buzilganda qaysi feature ishini to'xtatasiz va nega?",
  },
  "SD-SEC": {
    failure: "Browser bundle yoki logda secret chiqdi, yoxud bitta tenant file URI orqali boshqa tenant data'sini ko'rdi.",
    decision: "Identity-derived scope, object key va audit siyosatini yoz.",
    review: "Client yuborgan organization_id nega ishonchli emas?",
  },
  "SD-DEL": {
    failure: "Deploy bilan migration mos kelmadi; yangi API eski schema bilan error qaytardi va rollback ham tayyor emas edi.",
    decision: "Backward-compatible migration va release/rollback gate tanlovini yoz.",
    review: "Nega build muvaffaqiyatli bo'lishi production readiness emas?",
  },
  "SD-REC": {
    failure: "Noto'g'ri import current datasetni buzdi yoki backup restore qilinganda object file metadata mos kelmadi.",
    decision: "RPO/RTO, atomic publish va restore verification qoidalarini yoz.",
    review: "Backup borligi bilan recovery isbotlanganligi orasida farq nima?",
  },
  "SD-STYLE": {
    failure: "Team barcha modullarni microservicega ajratdi, lekin tracing, ownership va deploy xarajati feature tezligini tushirdi.",
    decision: "Modular monolith yoki service extraction triggerini metric bilan yoz.",
    review: "Qaysi dalil service ajratishni oqlaydi?",
  },
  "SD-GEO": {
    failure: "Private asset layer public static packagega tushib qoldi yoki cache eskirgan tile qaytardi.",
    decision: "Base, operational va live layer data classification hamda invalidation siyosatini yoz.",
    review: "PMTiles qaysi layer uchun mos, qaysi layer uchun xavfli?",
  },
  SDF: {
    failure: "Reviewer database uzilishi, duplicate job yoki cross-tenant access holatini jonli ko'rsatishni so'raydi.",
    decision: "Capstone architecture qarorlarini ADR, test va runbook bilan himoya qil.",
    review: "Qaysi architecture qarorini keyingi quarterda qayta ko'rib chiqasiz?",
  },
};

function deepenModule(module: Module): Module {
  const deep = DEEPENING[module.zoom];
  const baseProject = module.project;
  if (!deep || !baseProject) return module;

  const requiredResource = {
    type: "doc" as const,
    url: "https://aws.amazon.com/architecture/well-architected/",
    title: "Architecture review framework",
    desc: "Reliability, security, performance, cost va operations trade-offlarini birga tekshirish uchun.",
    host: "aws.amazon.com",
  };
  const resources = module.resources.some((resource) => resource.url === requiredResource.url)
    ? module.resources
    : [...module.resources, requiredResource];

  return {
    ...module,
    doc: `${module.doc}
      <h3>Executable GeoPulse lab</h3>
      <p>Bu mavzu faqat o'qilmaydi: <code>labs/geopulse/docs/system-design-labs.md</code> ichidagi <strong>${module.zoom}</strong> milestone bilan bitta ishlaydigan repositoryda bajariladi. Har milestone'da command/test, failure drill, ADR va evidence report majburiy.</p>
      <h3>Professional deep-dive: failure lab</h3>
      <p>${deep.failure}</p>
      <p><strong>Vazifa:</strong> avval failure'ni test yoki drill bilan qayta yarating; keyin symptom, root cause, user impact va recovery vaqtini yozing. "Tuzatdim" degan gap dalil emas.</p>
      <h3>Professional deep-dive: arxitektura qarori</h3>
      <p>${deep.decision}</p>
      <p>ADR ichida context, constraints, tanlangan variant, rad etilgan variant, trade-off, consequence va revisit trigger bo'lishi shart.</p>
      <h3>Architecture review savoli</h3>
      <div class="callout"><div><p>${deep.review}</p><p>Javob diagram, query plan, test, metric yoki runbook daliliga tayangan bo'lishi kerak.</p></div></div>`,
    code: [
      ...module.code,
      {
        heading: { h: "GeoPulse lab gate", p: "Baseline buzilmaganini va dalil qayerga yozilishini tekshir." },
        title: "PowerShell",
        lang: "powershell",
        code: `cd labs/geopulse\ndocker compose up --build --wait\n./scripts/smoke-test.ps1\n# So'ng: docs/evidence/${module.zoom.toLowerCase()}-review.md ni to'ldir`,
      },
      {
        heading: { h: "Failure evidence matrix", p: "Har modulda failure, test va recovery dalili bir joyda turadi." },
        title: `docs/evidence/${module.zoom.toLowerCase()}-review.md`,
        lang: "md",
        code: `# ${module.title} review\n\n| Scenario | User impact | Detection | Test/drill | Recovery | Evidence |\n| --- | --- | --- | --- | --- | --- |\n| ${deep.failure} |  |  |  |  |  |\n\n## ADR\n- Decision:\n- Rejected alternative:\n- Trade-off:\n- Revisit trigger:`,
      },
    ],
    tasks: [
      ...module.tasks,
      { id: `${module.zoom.toLowerCase()}-failure-drill`, html: "Failure labni ataylab qayta yaratdim", crit: "Symptom, user impact, metric/log va recovery dalili bitta reportda" },
      { id: `${module.zoom.toLowerCase()}-adr`, html: "Shu modulning asosiy trade-offi uchun ADR yozdim", crit: "Rad etilgan variant va revisit trigger bor" },
      { id: `${module.zoom.toLowerCase()}-review`, html: "Architecture review savoliga dalil bilan javob berdim", crit: "Javob test, metric, query plan yoki runbook havolasiga tayangan" },
    ],
    resources,
    project: {
      ...baseProject,
      rubric: [
        ...(baseProject.rubric || []),
        "Failure scenario test yoki drill bilan qayta yaratilgan",
        "ADR trade-off va revisit trigger bilan yozilgan",
        "Dalil test, metric, trace, query plan yoki runbook orqali tekshiriladi",
      ],
    },
    quiz: [
      ...module.quiz,
      {
        q: `${module.title} modulida professional qarorni nima isbotlaydi?`,
        a: ["Texnologiya nomi", "AI javobi", "Test, metric, ADR va recovery dalili", "Faqat diagram"],
        c: 2,
        w: "Professional qaror o'lchanadigan va qayta tekshiriladigan dalil bilan himoya qilinadi.",
        level: "scenario",
      },
    ],
  };
}

export const SYSTEM_DESIGN_COURSE_MODULES: Module[] = [
  ARCHITECTURE_FOUNDATIONS_MODULE,
  SYSTEM_DESIGN_WEB_FLOW_MODULE,
  FRONTEND_ARCHITECTURE_MODULE,
  BACKEND_DOMAIN_MODULE,
  DATABASE_DESIGN_MODULE,
  DATA_ASYNC_MODULE,
  DISTRIBUTED_MODULE,
  PERFORMANCE_MODULE,
  RELIABILITY_MODULE,
  SECURITY_MODULE,
  DELIVERY_MODULE,
  RECOVERY_MODULE,
  STYLES_MODULE,
  GEOOPS_CASE_MODULE,
  CAPSTONE_MODULE,
].map(deepenModule);
