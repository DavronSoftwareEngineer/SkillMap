import type { Module } from "../types";

const FRONTEND_PRODUCT_INTEGRATION: Module = {
  zoom: "FX1",
  title: "Product API Integration",
  sub: "React TS / contracts / resilient UI",
  coord: "Frontend / full-stack bridge",
  eyebrow: "FRONTEND / API / DELIVERY",
  mtitle: "Frontend'ni haqiqiy backend bilan ulash",
  lede: "Frontend kursidagi React bilimini mustaqil Node.js/TypeScript mahsulotiga qo'llaysan: typed contract, auth holati va loading/empty/error/retry UI bilan.",
  doc: "<h3>Client responsibility</h3><p>React API formatini taxmin qilmaydi: contract, response status va error modelini biladi. Loading, bo'sh ro'yxat, permission yo'q va server xatosi alohida UX holatlari. Authorization esa faqat serverda.</p><h3>TeamOps client</h3><p>TeamOps Board uchun workspace switcher, task list, filter va create form qur. Form validation qulaylik beradi; backend validation va RBAC haqiqiy himoya bo'lib qoladi.</p>",
  code: [{ heading: { h: "Resilient query", p: "Tarmoq xatosi foydalanuvchini jim qoldirmaydi." }, title: "useTasks.ts", lang: "ts", code: "type State = { kind: 'loading' } | { kind: 'ready'; tasks: Task[] } | { kind: 'empty' } | { kind: 'error'; message: string };\n\nexport async function loadTasks(): Promise<State> {\n  try {\n    const response = await fetch('/api/tasks');\n    if (!response.ok) throw new Error('Server xatosi');\n    const tasks = await response.json() as Task[];\n    return tasks.length ? { kind: 'ready', tasks } : { kind: 'empty' };\n  } catch { return { kind: 'error', message: 'Qayta urinib ko\'ring' }; }\n}" }],
  tasks: [{ id: "fx1-1", html: "TeamOps uchun typed API client yozdim", crit: "Response/error contract bitta joyda" }, { id: "fx1-2", html: "Loading, empty, error va retry UI yaratdim", crit: "Har holat screenshot yoki component test bilan isbotlangan" }, { id: "fx1-3", html: "Frontend authorizationga ishonmasligini tekshirdim", crit: "Boshqa workspace request'i backendda rad etiladi" }],
  resources: [{ type: "doc", url: "https://react.dev/learn", title: "React Learn", desc: "State va UI holatlari uchun rasmiy qo'llanma.", host: "react.dev" }],
  project: { tag: "Full-stack bridge", title: "TeamOps Client", desc: "Backend kursidagi TeamOps API bilan ishlaydigan responsive React client.", features: ["typed contract", "resilient states", "workspace UX", "component tests"], rubric: ["Error UX mavjud", "Client secret saqlamaydi", "API contract takrorlanmaydi"] },
  quiz: [{ q: "Frontenddagi yashirilgan tugma authorization bo'la oladimi?", a: ["Ha, doim", "Yo'q, server RBAC ham tekshirishi kerak", "Faqat dark mode'da", "Faqat productionda"], c: 1, w: "UI faqat qulaylik; requestni server tekshiradi.", level: "scenario" }],
};

const BACKEND_TEAMOPS: Module = {
  zoom: "BX4",
  title: "TeamOps Full-Stack API",
  sub: "Node TS / PostgreSQL / RBAC",
  coord: "Backend / full-stack project",
  eyebrow: "BACKEND / PRODUCT / RBAC",
  mtitle: "React client uchun multi-workspace API",
  lede: "Mustaqil professional loyiha: Node.js/TypeScript API, PostgreSQL migration va React client bilan TeamOps Board quriladi. Frontend qismi Frontend kursidagi FX1 modulida bajariladi.",
  doc: "<h3>Domain</h3><p>User -> Workspace -> Membership -> Task. Har query workspace membership orqali scope qilinadi. ID bilish access bermaydi. API inputni validate qiladi, migration schema tarixini saqlaydi va integration test cross-workspace leak bo'lmasligini isbotlaydi.</p><h3>Deliverable</h3><p>Auth/RBAC, task CRUD, pagination/filter, migration, integration test, Docker Compose va frontend contract. Bu GeoPulse emas — Node.js/TypeScript'ni mustaqil ko'rsatadigan portfolio mahsulot.</p>",
  code: [{ heading: { h: "Tenant boundary", p: "Queryning o'zi ownershipni tekshiradi." }, title: "tasks.repository.ts", lang: "ts", code: "const task = await db.task.findFirst({\n  where: { id: taskId, workspace: { members: { some: { userId } } } },\n});\nif (!task) throw new HttpError(404, 'Task topilmadi');" }],
  tasks: [{ id: "bx4-1", html: "Workspace/membership/task migrationlarini yozdim", crit: "Foreign key va unique constraintlar aniq" }, { id: "bx4-2", html: "Cross-workspace access manfiy testini yozdim", crit: "Boshqa tenant taskini o'qish/yozish rad etiladi" }, { id: "bx4-3", html: "Frontend uchun versionlangan API contract berdim", crit: "OpenAPI yoki typed shared schema bor" }, { id: "bx4-4", html: "Docker Compose bilan API/DB ishga tushishini tekshirdim", crit: "README buyruqlari yangi muhitda ishlaydi" }],
  resources: [{ type: "doc", url: "https://www.postgresql.org/docs/", title: "PostgreSQL docs", desc: "Constraint va transactionlar.", host: "postgresql.org" }],
  project: { tag: "Full-stack project 1", title: "TeamOps Board", desc: "React client bilan integratsiyalashgan multi-workspace task platforma.", features: ["Node TS API", "PostgreSQL", "RBAC", "React contract", "integration tests"], rubric: ["Tenant isolation isbotlangan", "Migration bor", "Client failure holatlari bor"] },
  quiz: [{ q: "Multi-tenant data leak'ni oldini olish uchun nima shart?", a: ["Faqat React filter", "Backend queryda membership scope", "Faqat CSS", "README"], c: 1, w: "Haqiqiy data boundary server va database queryda bo'ladi.", level: "practical" }],
};

const BACKEND_ORDERFLOW: Module = {
  zoom: "BX5",
  title: "OrderFlow Reliability Project",
  sub: "Redis / worker / idempotency",
  coord: "Backend / full-stack project",
  eyebrow: "BACKEND / RELIABILITY / DELIVERY",
  mtitle: "CRUD'dan tiklanadigan mahsulotgacha",
  lede: "Ikkinchi mustaqil loyiha order yoki booking oqimini Redis worker, idempotency va recovery bilan quradi. React checkout/status UI Frontend kursidagi resilient UI qoidalarini ishlatadi.",
  doc: "<h3>Failure contract</h3><p>Create endpoint Idempotency-Key talab qiladi. Bir xil key yangi order yoki job yaratmaydi. PostgreSQL transaction/outbox yoki durable queue bilan job yo'qolmaydi; retry cheklangan, failed state operatorga ko'rinadi.</p><h3>Professional dalil</h3><p>Duplicate request, worker crash, retry, failed va recovery holatlari testda bajariladi. Health endpoint, structured log, correlation ID, CI va runbook yakuniy deliverable hisoblanadi.</p>",
  code: [{ heading: { h: "Safe create", p: "Network retry duplicate side effect qilmaydi." }, title: "orders.service.ts", lang: "ts", code: "const existing = await orderRepo.findByIdempotencyKey(actor.id, key);\nif (existing) return existing;\n\nreturn db.transaction(async (tx) => {\n  const order = await orderRepo.createPending(tx, { actorId: actor.id, key });\n  await outboxRepo.add(tx, { type: 'order.created', orderId: order.id });\n  return order;\n});" }],
  tasks: [{ id: "bx5-1", html: "Idempotency key uchun unique constraint va parallel test yozdim", crit: "Ikki request bitta order qaytaradi" }, { id: "bx5-2", html: "Redis worker retry/backoff va failed state qurdim", crit: "Retry limiti va recovery oqimi bor" }, { id: "bx5-3", html: "Health, structured log va correlation ID qo'shdim", crit: "Operator request/job oqimini kuzata oladi" }, { id: "bx5-4", html: "Failure/recovery runbook va CI dalilini yozdim", crit: "Qayta bajariladigan buyruq va yashil CI run bor" }],
  resources: [{ type: "doc", url: "https://redis.io/docs/latest/", title: "Redis docs", desc: "Queue va reliability patternlari.", host: "redis.io" }],
  project: { tag: "Full-stack project 2", title: "OrderFlow", desc: "React checkout/status UI bilan order/booking platforma.", features: ["idempotency", "durable job", "retry", "observability", "recovery test"], rubric: ["Duplicate side effect yo'q", "Failure yashirilmaydi", "Runbook va CI bor"] },
  quiz: [{ q: "Worker bajarilmagan job uchun nima qaytarmasligi kerak?", a: ["accepted", "done", "failed", "retrying"], c: 1, w: "Bajarilmagan ishni done deyish foydalanuvchi va operatorni chalg'itadi.", level: "scenario" }],
};

export const FRONTEND_ENHANCEMENTS_AFTER: Record<string, Module[]> = { FE12: [FRONTEND_PRODUCT_INTEGRATION] };
export const BACKEND_FULLSTACK_ENHANCEMENTS_AFTER: Record<string, Module[]> = { BE9: [BACKEND_TEAMOPS], BE10: [BACKEND_ORDERFLOW] };
