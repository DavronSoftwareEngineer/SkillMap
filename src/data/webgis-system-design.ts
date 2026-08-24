import type { Module } from "../types";

export const SYSTEM_DESIGN_WEB_FLOW_MODULE: Module = {
  zoom: "sd1",
  title: "Web System Design: 0 dan Productiongacha",
  sub: "Frontend / API / DB / queue / operations",
  coord: "System design / GeoOps vertical slice",
  eyebrow: "SYSTEM DESIGN / FULL-STACK / GEOSPATIAL",
  mtitle: "Katta WebGIS tizimi qanday ishlaydi — oddiy so'rovdan ishonchli GeoOps platformagacha",
  lede:
    "Bu modul texnologiya nomlarini yodlash emas. Sen browserdagi bitta tugma bosilishi qanday qilib API, PostGIS, fayl storage va background job orqali biznes natijasiga aylanishini ko'rasan; keyin shu oqimni katta geospatial mahsulotda xavfsiz, kuzatiladigan va tiklanadigan qilasan.",
  doc: `
    <h3>Avval eng oddiy tasavvur</h3>
    <p>Web tizimni restoran kabi tasavvur qil. <strong>Frontend</strong> — mijoz ko'radigan menyu va ofitsiant; <strong>backend</strong> — buyurtma qoidalarini tekshiradigan oshxona; <strong>database</strong> — ombor va hisob daftar; <strong>worker</strong> — uzoq davom etadigan ishni keyin bajaradigan alohida xodim. Xarita tizimida esa MapLibre ekranni chizadi, FastAPI qoidani bajaradi, PostGIS geo-obyektlarni saqlaydi.</p>
    <div class="tree">Foydalanuvchi -> React UI -> FastAPI API -> PostGIS -> FastAPI response -> React + MapLibre</div>
    <p>Masalan operator xaritada quvurga nosozlik taski yaratadi. Frontend koordinata, sarlavha va prioritetni yuboradi. Backend foydalanuvchi ruxsatini hamda inputni tekshiradi, transaction ichida taskni saqlaydi va tez javob qaytaradi. Foto processing yoki Telegram xabari request ichida kutmaydi: ular queue orqali workerga o'tadi.</p>

    <h3>Bitta GeoOps vertical slice</h3>
    <div class="exlist">
      <div class="ex"><b>Frontend</b><span>MapLibre viewport va layerlarni chizadi; React task form, loading, empty, error hamda degraded holatlarni ko'rsatadi. Browser hech qachon database'ga bevosita ulanmaydi.</span></div>
      <div class="ex"><b>API / domain</b><span>FastAPI auth, Pydantic validation, business qoida va response contractini boshqaradi. Masalan faqat dispatcher task yaratishi, field worker esa o'z taskini yakunlashi mumkin.</span></div>
      <div class="ex"><b>Data</b><span>PostGIS asset, task, geometry va audit tarixini transaction bilan saqlaydi. GIST index bbox va near-by querylarni tezlashtiradi.</span></div>
      <div class="ex"><b>Async work</b><span>Import, katta GeoJSON processing, PDF report, notification va GeoAI inference Redis queue orqali workerga boradi. HTTP javob tez qoladi.</span></div>
      <div class="ex"><b>Operations</b><span>Docker Compose servislarni birga ko'taradi; health check, log, metric, backup va alert tizim ishlayotganini isbotlaydi.</span></div>
    </div>

    <h3>Professional arxitektura: minimal, lekin to'liq</h3>
    <figure class='svgfig'><svg viewBox='0 0 760 270' role='img' aria-label='GeoOps full-stack architecture'>
      <rect class='boxa' x='16' y='36' width='130' height='52' rx='8'/><text x='81' y='59' text-anchor='middle'>React</text><text x='81' y='76' text-anchor='middle' class='muted'>MapLibre UI</text>
      <path class='edga' d='M146 62 H236' marker-end='url(#sda)'/><rect class='box' x='236' y='36' width='138' height='52' rx='8'/><text x='305' y='59' text-anchor='middle'>FastAPI</text><text x='305' y='76' text-anchor='middle' class='muted'>auth + domain</text>
      <path class='edge' d='M305 88 V142' marker-end='url(#sda)'/><rect class='box' x='236' y='142' width='138' height='52' rx='8'/><text x='305' y='165' text-anchor='middle'>PostGIS</text><text x='305' y='182' text-anchor='middle' class='muted'>assets + tasks</text>
      <path class='edge' d='M374 62 H454' marker-end='url(#sda)'/><rect class='box' x='454' y='36' width='132' height='52' rx='8'/><text x='520' y='59' text-anchor='middle'>Redis</text><text x='520' y='76' text-anchor='middle' class='muted'>queue + cache</text>
      <path class='edge' d='M520 88 V142' marker-end='url(#sda)'/><rect class='box' x='454' y='142' width='132' height='52' rx='8'/><text x='520' y='165' text-anchor='middle'>Worker</text><text x='520' y='182' text-anchor='middle' class='muted'>import + notify</text>
      <path class='edge' d='M586 168 H668' marker-end='url(#sda)'/><rect class='box' x='668' y='142' width='78' height='52' rx='8'/><text x='707' y='165' text-anchor='middle'>MinIO</text><text x='707' y='182' text-anchor='middle' class='muted'>files</text>
      <defs><marker id='sda' markerWidth='9' markerHeight='9' refX='7' refY='3' orient='auto'><path d='M0 0 L7 3 L0 6 Z' fill='currentColor'/></marker></defs>
    </svg><figcaption>Avval modular monolith: bitta API, bitta database va bitta worker. Microservice faqat o'lchangan ehtiyoj bo'lsa.</figcaption></figure>

    <h3>Har qaror oldidan beriladigan 6 savol</h3>
    <ol>
      <li><strong>Kim va nima uchun?</strong> User, rol, bitta asosiy workflow va acceptance criteria nima?</li>
      <li><strong>Data qayerda?</strong> Qaysi data PostGIS, qaysi fayl MinIO, qaysi cache va data owner kim?</li>
      <li><strong>Qaysi ish tez javob berishi kerak?</strong> HTTP ichida faqat qisqa ish; og'ir ish workerga.</li>
      <li><strong>Nima buzilishi mumkin?</strong> Internet, database, tashqi API, duplicate request, noto'g'ri geo-data.</li>
      <li><strong>Buni qayerdan bilamiz?</strong> Log, metric, trace, health check va user-facing error holati.</li>
      <li><strong>Qanday tiklaymiz?</strong> Backup, restore mashqi, retry siyosati va rollback.</li>
    </ol>

    <h3>"Yiqilmaydigan" emas, tiklanadigan tizim</h3>
    <p>100% xatosiz tizim va'da qilinmaydi. Professional tizim xatoni yashirmaydi: <strong>aniqlaydi, foydalanuvchiga to'g'ri holat ko'rsatadi, data yo'qotmaydi va tiklanish yo'liga ega bo'ladi.</strong> Google SRE yondashuvida reliability o'lchanadigan SLI/SLO bilan boshqariladi; AWS Well-Architected esa operational excellence, security, reliability, performance va cost trade-offlarini birga ko'rishni tavsiya qiladi.</p>
    <div class="callout"><div><p>GeoOps uchun minimal SLO misoli</p><p><code>GET /health</code> va task yaratish so'rovi 30 kunda 99.5% muvaffaqiyatli bo'lishini maqsad qil. Bu marketing raqami emas: metric bilan o'lchanadi. SLO buzilsa yangi feature emas, avval sabab va recovery ustida ishlanadi.</p></div></div>

    <h3>Murakkablikni qachon qo'shish kerak?</h3>
    <p><strong>Hozir:</strong> modular monolith + PostGIS + Redis worker + object storage. <strong>Keyin:</strong> real bottleneckni metric bilan ko'rsatgandan keyin CDN, read replica, alohida processing service yoki event broker. Kubernetes, Kafka va microservice texnologik bezak emas; ular operatsion xarajat ham olib keladi.</p>
    <div class="tree">Requirement -> small vertical slice -> test -> measure -> ADR -> deploy -> observe -> improve</div>

    <h3>AI bilan ishlash qoidasi</h3>
    <p>AI'dan architecture variant, SQL review yoki failure-mode checklist so'rash mumkin. Lekin u bergan kod yoki xulosani tayyor haqiqat deb qabul qilma: taxminlarni ajrat, rasmiy docs bilan tekshir, test yoz va qarorni ADR'da qayd qil. AI prompt — fikrlashni almashtirish emas, fikrlashni tezlashtirish vositasi.</p>
  `,
  code: [
    {
      heading: { h: "1. Frontend: foydalanuvchi holatlarini yashirma", p: "Map yoki API har doim muvaffaqiyatli bo'lmaydi; UI buni aniq ko'rsatadi." },
      title: "TaskPanel.tsx",
      lang: "tsx",
      code: `type State = "loading" | "ready" | "empty" | "error" | "degraded";\n\nexport function TaskPanel({ state }: { state: State }) {\n  if (state === "loading") return <p>Tasklar yuklanmoqda...</p>;\n  if (state === "empty") return <p>Bu hududda task yo'q.</p>;\n  if (state === "error") return <p>Ma'lumot olinmadi. Qayta urinib ko'ring.</p>;\n  if (state === "degraded") return <p>Oxirgi saqlangan ma'lumot ko'rsatilmoqda.</p>;\n  return <TaskList />;\n}`,
    },
    {
      heading: { h: "2. Backend: API database'ga faqat tekshirilgan buyruq yuboradi", p: "Pydantic contract noto'g'ri inputni domain logikasiga yetmasidan qaytaradi." },
      title: "routers/tasks.py",
      lang: "py",
      code: `@router.post("/tasks", status_code=201)\ndef create_task(payload: TaskCreate, actor: CurrentUser, db: SessionDep):\n    require_role(actor, "dispatcher")\n    task = Task(\n        organization_id=actor.organization_id,\n        title=payload.title,\n        geom=from_geojson(payload.geometry),\n        status="open",\n    )\n    db.add(task)\n    db.flush()\n    enqueue_notification.delay(task.id)  # request kutmaydi\n    return TaskRead.model_validate(task)`,
    },
    {
      heading: { h: "3. PostGIS: tenant va geo-query birga himoyalangan", p: "Har query organization chegarasi hamda spatial indexdan foydalanish imkonini hisobga oladi." },
      title: "tasks.sql",
      lang: "sql",
      code: `CREATE INDEX tasks_organization_idx ON tasks (organization_id);\nCREATE INDEX tasks_geom_gix ON tasks USING GIST (geom);\n\nSELECT id, title, status, ST_AsGeoJSON(geom) AS geometry\nFROM tasks\nWHERE organization_id = $1\n  AND geom && ST_MakeEnvelope($2, $3, $4, $5, 4326)\nORDER BY created_at DESC\nLIMIT 500;`,
    },
    {
      heading: { h: "4. Worker: duplicate ishni xavfsiz boshqar", p: "Retry bo'lganda bir notification ikki marta ketmasligi uchun idempotency key kerak." },
      title: "jobs/notify.py",
      lang: "py",
      code: `@celery.task(bind=True, autoretry_for=(TimeoutError,), retry_backoff=True, max_retries=5)\ndef notify_task_created(self, task_id: str) -> None:\n    key = f"task-created:{task_id}"\n    if redis.get(key):\n        return\n    task = load_task(task_id)\n    send_telegram_message(task)\n    redis.set(key, "sent", ex=86_400)`,
    },
    {
      heading: { h: "5. ADR: qarorni keyingi o'zingiz ham tushunishi uchun yozing", p: "Bir sahifalik qaror keyinchalik keraksiz tortishuv va tasodifiy murakkablikni kamaytiradi." },
      title: "docs/adr/001-modular-monolith.md",
      lang: "md",
      code: `# ADR-001: modular monolith\n\n## Context\nBitta kichik jamoa GeoOps MVP qurmoqda; background import bor.\n## Decision\nFastAPI modular monolith + PostGIS + Redis/Celery tanlandi.\n## Rejected\nMicroservice va Kafka: hozir mustaqil deploy/scale dalili yo'q.\n## Consequence\nDomen modullari qat'iy ajratiladi; worker API'dan alohida ishlaydi.\n## Revisit trigger\nProcessing queue API resursiga o'lchangan bosim bersa yoki mustaqil release talab qilinsa.`,
    },
  ],
  tasks: [
    { id: "sd1-1", html: "GeoOps uchun bitta user flow chizdim: operator task yaratadi, field worker bajaradi", crit: "Frontend, API, PostGIS, worker va fayl storage qadamlarida input/output yozilgan" },
    { id: "sd1-2", html: "Loading, empty, error va degraded UI holatlarini implement qildim", crit: "API xatosi va offline/cached holati qo'lda yoki testda ko'rsatilgan" },
    { id: "sd1-3", html: "Task create endpointiga typed validation, role check va transaction qo'shdim", crit: "Noto'g'ri geometry va ruxsatsiz user uchun integration test bor" },
    { id: "sd1-4", html: "Viewport bo'yicha task qidiruvini PostGIS query va index bilan o'lchadim", crit: "EXPLAIN ANALYZE oldin/keyin natijasi hamda feature limit README'da bor" },
    { id: "sd1-5", html: "Bitta og'ir ishni queue/workerga ajratdim", crit: "HTTP tez javob beradi; retry va duplicate request xulqi testlangan" },
    { id: "sd1-6", html: "ADR-001 yozdim", crit: "Context, constraints, decision, rejected alternative, trade-off va revisit trigger bor" },
    { id: "sd1-7", html: "Health check, structured log va kamida 3 operational metric tanladim", crit: "Latency, error rate va queue depth qanday o'lchanishi yozilgan; secret logga chiqmaydi" },
    { id: "sd1-8", html: "Backup/restore va failure drill rejasini yozdim", crit: "Database restore, Redis yo'qolishi va tashqi notification timeout holati uchun owner hamda recovery qadami bor" },
  ],
  resources: [
    { type: "doc", url: "https://aws.amazon.com/architecture/well-architected/", title: "AWS Well-Architected", desc: "Reliability, security, performance, cost va operations trade-offlari uchun rasmiy framework.", host: "aws.amazon.com" },
    { type: "doc", url: "https://sre.google/workbook/implementing-slos/", title: "Google SRE: Implementing SLOs", desc: "Reliabilityni SLI/SLO va error budget bilan o'lchashning amaliy qo'llanmasi.", host: "sre.google" },
    { type: "doc", url: "https://fastapi.tiangolo.com/tutorial/", title: "FastAPI tutorial", desc: "Typed request/response, dependency va API contract asoslari.", host: "fastapi.tiangolo.com" },
    { type: "doc", url: "https://postgis.net/docs/", title: "PostGIS documentation", desc: "Spatial schema, index va geo-querylarni tekshirish uchun.", host: "postgis.net" },
    { type: "doc", url: "https://owasp.org/API-Security/", title: "OWASP API Security", desc: "Authorization, input va API security failurelarini tekshirish uchun.", host: "owasp.org" },
  ],
  project: {
    tag: "System Design Lab / GeoOps",
    title: "GeoOps Vertical Slice: Taskdan tiklanishgacha",
    desc: "Bitta real workflow'ni frontend, API, PostGIS, worker va operations dalillari bilan productionga yaqin vertikal slice sifatida qur.",
    features: ["MapLibre task form", "FastAPI typed API", "PostGIS geometry + index", "RBAC", "async notification", "ADR", "health/metrics", "recovery runbook"],
    rubric: [
      "Bitta user flow boshidan oxirigacha ishlaydi va error holatlari ko'rsatilgan",
      "Frontend backend/database'ga bevosita bog'lanmaydi; API contract aniq",
      "Tenant/role chegarasi va input validation testlangan",
      "Og'ir ish HTTP requestdan ajratilgan va retry/idempotency siyosati bor",
      "Geo-query index va feature limit bilan o'lchangan",
      "ADR qarorni hamda trade-offni halol yozadi",
      "Health, log, metric va backup/restore qadamlarida dalil bor",
    ],
  },
  quiz: [
    { q: "Frontend nega PostGIS database'ga to'g'ridan-to'g'ri ulanmasligi kerak?", a: ["MapLibre taqiqlaydi", "Auth, business rule va data access server tomonda boshqarilishi uchun", "SQL sekinligi sabab", "CSS sabab"], c: 1, w: "API authorization, validation va domain qoidalar uchun aniq boundary yaratadi.", level: "easy" },
    { q: "Qaysi ishni background workerga o'tkazish eng to'g'ri?", a: ["Formdagi sarlavhani tekshirish", "500 MB GeoJSON import va notification yuborish", "Bitta taskni ekranga chiqarish", "Button rangini o'zgartirish"], c: 1, w: "Uzoq yoki tashqi servisga bog'liq ish HTTP javobini kutmasligi kerak.", level: "practical" },
    { q: "Tizim 'yiqilmaydigan' bo'lishi nimani anglatadi?", a: ["Hech qachon xato bo'lmaydi", "Xato aniqlanadi, data saqlanadi va recovery yo'li sinalgan", "Kubernetes ishlatiladi", "Frontendda loader bor"], c: 1, w: "Reliability xatoni inkor qilish emas, uni boshqarish va tiklanishni amalda sinashdir.", level: "scenario" },
  ],
  exercises: [
    { type: "choice", q: "Task yaratishda Telegram API sekin javob berdi. Eng to'g'ri xulq qaysi?", options: ["Browser 30 soniya kutadi", "Task transactionini saqlab, notificationni workerga berish", "Taskni o'chirib yuborish", "Frontendda secret token saqlash"], correct: 1, why: "Core business transaction tashqi notificationdan mustaqil saqlanadi; worker retry qiladi." },
    { type: "choice", q: "Cache sekin tile muammosini to'liq bartaraf etmayapti. Birinchi professional qadam?", options: ["Yana bitta cache qo'shish", "TTFB, tile size, cache hit-rate va render vaqtini o'lchash", "PostGISni o'chirish", "Barcha layerni z0da chizish"], correct: 1, why: "Metric bo'lmasdan qaysi qatlam bottleneck ekanini bilib bo'lmaydi." },
    { type: "gap", q: "Bir operation retry bo'lsa ham bir xil natija berish xususiyati: ___", answers: ["idempotency", "idempotent"], why: "Idempotency duplicate update yoki xabar yuborishni nazorat qiladi." },
  ],
  vocab: [
    { w: "vertical slice", uz: "bitta user flow'ning UI dan database/operationsgacha to'liq ishlaydigan kesimi", ex: "Avval GeoOps task flow'ini vertical slice qilamiz." },
    { w: "degraded mode", uz: "tizimning qisman cheklangan, lekin foydali ishlash holati", ex: "Internet uzilganda app cached data bilan degraded mode'ga o'tadi." },
    { w: "idempotency", uz: "bir ish qayta yuborilganda natija takrorlanib buzilmasligi", ex: "Notification job idempotency key bilan himoyalangan." },
    { w: "SLO", uz: "xizmat ishonchliligi uchun o'lchanadigan maqsad", ex: "Task API uchun 99.5% SLO belgilandi." },
  ],
  grammar: [
    { topic: "Request oqimi", rule: "UI -> API -> domain -> database -> response", ex: "Operator task yuboradi, API uni tekshiradi va PostGISga saqlaydi." },
    { topic: "Asinxron oqim", rule: "API -> queue -> worker -> external service", ex: "Task saqlangach worker Telegram notification yuboradi." },
  ],
};
