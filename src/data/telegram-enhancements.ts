import type { Module } from "../types";

const TELEGRAM_PRODUCTION_LAB: Module = {
  zoom: "TL1",
  title: "Telegram Production Lab",
  sub: "webhook / initData / retry drills",
  coord: "Telegram / executable lab",
  eyebrow: "TELEGRAM / SECURITY / RELIABILITY",
  mtitle: "Nazariyani tekshiriladigan failure drillga aylantir",
  lede: "Bu modul Telegramga xos production oqimlarini amalda tekshiradi: webhook secret, duplicate update, Mini App session va notification retry. Umumiy Node backend arxitekturasi Backend kursining egasi bo'lib qoladi.",
  doc: "<h3>Lab kontrakti</h3><p><code>labs/telegram-bot</code> ichidagi starter webhook endpoint, notification enqueue va health check beradi. U production bot tayyor deb da'vo qilmaydi: persistent idempotency, haqiqiy grammY handler, PostgreSQL migration va real Mini App HMAC verification keyingi evidence milestone'laridir.</p><h3>Majburiy drilllar</h3><p>Noto'g'ri webhook secret 401, bitta update ikki marta kelsa bir xil event, Mini App expired/tampered session 401, Telegram 429 <code>retry_after</code> bo'lsa bounded retry va userga aniq status. Har drill test yoki reproducible command bilan qayd etiladi.</p>",
  code: [{ heading: { h: "Webhook boundary", p: "Har request Telegramdan kelgani tekshiriladi." }, title: "webhook.ts", lang: "ts", code: "const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');\nif (!timingSafeEqual(secret, process.env.TELEGRAM_WEBHOOK_SECRET)) {\n  return Response.json({ error: 'unauthorized' }, { status: 401 });\n}\n// update_id unique bo'lishi shart: retry ikkinchi side effect yaratmaydi." }],
  tasks: [{ id: "tl1-1", html: "Telegram lab testlarini ishga tushirdim", crit: "Webhook secret va duplicate update testlari o'tadi" }, { id: "tl1-2", html: "Mini App initData uchun expired/tampered negative test yozdim", crit: "Client payloadi serverda rad etiladi" }, { id: "tl1-3", html: "429 retry_after va worker outage drill o'tkazdim", crit: "Bounded retry, failed holat va runbook mavjud" }, { id: "tl1-4", html: "Telegram production lab CI gate'ini yashil qildim", crit: "Test va compose contract GitHub Actions'da o'tadi" }],
  resources: [{ type: "doc", url: "https://core.telegram.org/bots/api#setwebhook", title: "setWebhook", desc: "Secret token va webhook sozlashning rasmiy manbasi.", host: "core.telegram.org" }, { type: "doc", url: "https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app", title: "Mini App initData validation", desc: "Server-side verification qoidalari.", host: "core.telegram.org" }],
  project: { tag: "Executable lab", title: "Telegram Failure Drill Report", desc: "Webhook, duplicate update, initData va retry holatlarini test hamda runbook bilan topshir.", features: ["secret verification", "duplicate protection", "initData negative test", "429 retry drill", "CI"], rubric: ["Nojo'ya request rad etiladi", "Duplicate side effect yo'q", "Failure yashirilmagan", "Dalil qayta bajariladi"] },
  quiz: [{ q: "Telegram webhook update'i takror kelishi mumkin bo'lsa, qaysi kalit saqlanishi kerak?", a: ["message rangi", "update_id yoki domain idempotency key", "CSS class", "browser title"], c: 1, w: "Takror update bir xil biznes side effectni qayta yaratmasligi shart.", level: "scenario" }],
};

export const TELEGRAM_ENHANCEMENTS_AFTER: Record<string, Module[]> = { TG8: [TELEGRAM_PRODUCTION_LAB] };
