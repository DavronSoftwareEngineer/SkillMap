import type { Module } from "../types";

type PolishSpec = Pick<Module, "zoom" | "title" | "sub" | "coord" | "eyebrow" | "mtitle" | "lede" | "doc" | "tasks" | "resources" | "project" | "quiz" | "exercises">;

const module = (spec: PolishSpec): Module => ({ ...spec, code: [] });

// These are deliberately post-final, evidence-first extensions. Existing
// modules, zoom codes, task IDs and saved progress remain unchanged.
export const PROFESSIONAL_POLISH: Record<string, Module[]> = {
  frontend: [module({
    zoom: "FE14", title: "Browser E2E & Production Handoff", sub: "Reliability", coord: "Professional / Handoff", eyebrow: "14 / Real user flow", mtitle: "Frontendni brauzerda isbotlang",
    lede: "Component testi yetarli emas: user ko‘radigan eng muhim oqimlar <strong>haqiqiy brauzerda</strong> tekshirilishi va handoff hujjati bilan topshirilishi kerak.",
    doc: "<div class='prose'><h3>Production handoff</h3><p>Critical user flow tanla: login, search, checkout yoki map filter. E2E test shu flow'ni brauzerda bajaradi. Natijaga release note, known limitation va rollback signali qo'shiladi.</p><h3>Mezon</h3><p>Test faqat yashil bo'lishi emas: loading, empty, error va degraded holatlarni ko'rsatishi kerak.</p></div>",
    tasks: [
      { id: "fe14-1", html: "Bitta critical user-flow uchun Playwright/Cypress E2E test yozdim", crit: "test real brauzerda primary action va visible natijani tekshiradi" },
      { id: "fe14-2", html: "Loading, error va empty state uchun screenshot yoki test dalili tayyorladim", crit: "har holatda user uchun keyingi action tushunarli" },
      { id: "fe14-3", html: "Frontend handoff note yozdim", crit: "deploy URL, environment, known limitation, rollback va monitoring signal bor" },
    ],
    resources: [{ type: "doc", url: "https://playwright.dev/docs/intro", title: "Playwright docs", desc: "Browser E2E testlar uchun rasmiy qo'llanma.", host: "playwright.dev" }],
    project: { tag: "Production proof", title: "User-flow release pack", desc: "Ishlaydigan UI flow'ni test va handoff dalili bilan topshir.", features: ["E2E spec", "state screenshots", "release/rollback note"], rubric: ["Critical flow browserda takrorlanadi.", "Failure holati yashirilmagan.", "Handoff boshqa developerga yetarli." ] },
    quiz: [{ q: "E2E test nimani tekshiradi?", a: ["Faqat bitta function", "User ko'radigan butun browser oqimi", "Faqat CSS ranglari", "Faqat TypeScript type"], c: 1, w: "E2E test browserdagi real user flow'ni tekshiradi.", level: "practical" }],
    exercises: [{ type: "choice", q: "Release handoffda qaysi ma'lumot muhim?", options: ["Faqat design link", "Deploy URL, known limitation va rollback signal", "Faqat component nomi", "Faqat screenshot"], correct: 1, why: "Handoff ishlatish va muammo bo'lsa xavfsiz qaytish uchun kerak." }],
  })],
  backend: [module({
    zoom: "BE14", title: "Incident & Capacity Drill", sub: "Operations", coord: "Professional / Operations", eyebrow: "14 / Failure under load", mtitle: "API muammosini boshqaring",
    lede: "Senior backend faqat endpoint yozmaydi: sekin query, queue backlog yoki xato ko'payganda <strong>dalil bilan triage</strong> qiladi va xavfsiz tiklash rejasini yuritadi.",
    doc: "<div class='prose'><h3>Drill oqimi</h3><p>Bitta kontrollangan failure tanla: sekin Postgres query, Redis unavailable yoki queue retry. Signal, impact, vaqtinchalik mitigation, root cause va follow-upni yoz. Soxta benchmark yozma; faqat o'lchagan natijani kirit.</p></div>",
    tasks: [
      { id: "be14-1", html: "Kontrollangan API failure yoki slow-query drill o'tkazdim", crit: "reproduce qadam, vaqt va ta'sir qayd etilgan" },
      { id: "be14-2", html: "Structured log, metric yoki trace orqali triage qildim", crit: "taxmin emas, kamida bitta signal incident qarorini asoslaydi" },
      { id: "be14-3", html: "Incident report va follow-up ticketlar yozdim", crit: "impact, mitigation, root cause, owner va deadline bor" },
    ],
    resources: [{ type: "doc", url: "https://sre.google/sre-book/table-of-contents/", title: "Google SRE book", desc: "Reliability va incident response asoslari.", host: "sre.google" }],
    project: { tag: "Operations proof", title: "API reliability drill", desc: "Failure paytida API'ni kuzatish va tiklashni dalil bilan ko'rsat.", features: ["reproduction", "signal", "mitigation", "post-incident actions"], rubric: ["O'lchov haqiqiy.", "Retry/idempotency xavfi ko'rilgan.", "Follow-up egalari aniq." ] },
    quiz: [{ q: "Incidentda birinchi muhim narsa qaysi?", a: ["Darrov barcha kodni qayta yozish", "Impact va signalni tasdiqlash", "Soxta benchmark qo'shish", "Loglarni o'chirish"], c: 1, w: "Avval foydalanuvchi ta'siri va dalilni aniqlash kerak.", level: "scenario" }],
    exercises: [{ type: "gap", q: "A retry must be ___ so the same job does not create duplicate data.", answers: ["idempotent"], why: "Idempotency retry'larda duplicate side effectning oldini oladi." }],
  })],
  git: [module({
    zoom: "GT14", title: "Repository Stewardship", sub: "Maintainer", coord: "Professional / Maintainer", eyebrow: "14 / Healthy repository", mtitle: "Repo egasidek boshqaring",
    lede: "Release qilishni bilish boshqa, repozitoriy sog'lig'ini uzoq muddat ushlash boshqa. Bu modul <strong>maintainer</strong> qarorlarini mashq qildiradi.",
    doc: "<div class='prose'><h3>Repository stewardship</h3><p>Contribution qoidasi, CODEOWNERS, branch protection, issue template, dependency update va release cadence birga ishlaydi. Maqsad jarayonni byurokratiya qilish emas, review va release xavfini kamaytirish.</p></div>",
    tasks: [
      { id: "gt14-1", html: "CONTRIBUTING va PR template yozdim", crit: "test, docs, risk va rollback bo'limlari bor" },
      { id: "gt14-2", html: "CODEOWNERS/branch protection siyosatini loyihaladim", crit: "kim review qiladi va qaysi check merge'ni to'sishi aniq" },
      { id: "gt14-3", html: "Dependency update yoki release candidate review qildim", crit: "change, risk, verification va rollback qarori yozilgan" },
    ],
    resources: [{ type: "doc", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners", title: "GitHub CODEOWNERS", desc: "Review ownership rasmiy hujjati.", host: "docs.github.com" }],
    project: { tag: "Maintainer proof", title: "Repository governance pack", desc: "Bitta repoga contributor va release boshqaruvini qo'sh.", features: ["contribution guide", "PR template", "ownership", "dependency/release decision"], rubric: ["Qoidalar bajariladigan.", "Review ownerlari aniq.", "Rollback ko'zda tutilgan." ] },
    quiz: [{ q: "CODEOWNERS nimaga xizmat qiladi?", a: ["Parol saqlash", "Muayyan fayl/soha uchun review owner belgilash", "Git tarixini o'chirish", "Buildni tezlatish"], c: 1, w: "CODEOWNERS review mas'uliyatini avtomatlashtiradi.", level: "practical" }],
    exercises: [{ type: "choice", q: "PR template'da qaysi bo'lim foydali?", options: ["Risk va verification", "Faqat emoji", "Shaxsiy parol", "Boshqa jamoa aybi"], correct: 0, why: "Risk va tekshiruv review sifatini oshiradi." }],
  })],
  cybersecurity: [module({
    zoom: "CY15", title: "Secure Delivery Gate", sub: "DevSecOps", coord: "Professional / Secure delivery", eyebrow: "15 / Prevent before production", mtitle: "Xavfsizlikni release oqimiga qo'shing",
    lede: "Security finding faqat reportda qolmasin: u <strong>CI, review va release gate</strong>ga aylanishi kerak.",
    doc: "<div class='prose'><h3>Secure delivery</h3><p>Secret scan, dependency review, SAST va manual threat review har xil signal beradi. Ularning natijasini severity, exception expiry va verification bilan boshqar. Tool alertini avtomatik haqiqat deb qabul qilma.</p></div>",
    tasks: [
      { id: "cy15-1", html: "CI uchun secret/dependency/security scan gate loyihaladim", crit: "qaysi severity buildni to'xtatishi va false positive oqimi yozilgan" },
      { id: "cy15-2", html: "Bitta findingni reproduce, fix va verification bilan yopdim", crit: "oldin/keyin dalili va risk qarori bor" },
      { id: "cy15-3", html: "Security exception register yozdim", crit: "owner, sabab, compensating control va expiry sanasi mavjud" },
    ],
    resources: [{ type: "doc", url: "https://owasp.org/www-project-devsecops-guideline/", title: "OWASP DevSecOps", desc: "Secure delivery lifecycle qo'llanmasi.", host: "owasp.org" }],
    project: { tag: "Secure release", title: "Security gate pack", desc: "Security signalini release qaroriga bog'lang.", features: ["scan policy", "verified fix", "exception register"], rubric: ["Severity siyosati aniq.", "Finding dalil bilan yopilgan.", "Exception abadiy emas." ] },
    quiz: [{ q: "Security exception uchun nima shart?", a: ["Muddatsiz ignore", "Owner, compensating control va expiry", "Scan natijasini o'chirish", "Faqat chat xabari"], c: 1, w: "Risk vaqtincha qabul qilinsa ham, egalik va expiry kerak.", level: "scenario" }],
    exercises: [{ type: "choice", q: "Scanner high finding chiqarsa nima qilinadi?", options: ["Tekshirmasdan productionga chiqarish", "Reproduce va impactni tekshirib, fix yoki vaqtli exception qarori", "Logni o'chirish", "Parolni commit qilish"], correct: 1, why: "Tool signalini tekshirish va izchil qaror qilish kerak." }],
  })],
  prompting: [module({
    zoom: "P8", title: "Human-in-the-Loop AI Delivery", sub: "Integration", coord: "Professional / AI delivery", eyebrow: "08 / Safe automation", mtitle: "AI natijasini xavfsiz ish oqimiga ulang",
    lede: "Prompt yaxshi bo‘lishi yetmaydi. AI output <strong>schema, review queue, audit trail va fallback</strong> bilan real workflow'ga kirishi kerak.",
    doc: "<div class='prose'><h3>Human-in-the-loop</h3><p>AI tavsiya beradi, lekin yuqori riskdagi actionni inson tasdiqlaydi. Input/output contract serverda validate qilinadi; prompt/model versiyasi, reviewer qarori va fallback qayd etiladi.</p></div>",
    tasks: [
      { id: "p8-1", html: "AI output uchun JSON schema va server-side validation yozdim", crit: "invalid/missing field holati test bilan rad etilgan" },
      { id: "p8-2", html: "Human review queue va approve/reject qarorini loyihaladim", crit: "AI hech qachon ruxsatsiz irreversible action qilmaydi" },
      { id: "p8-3", html: "Fallback, audit log va regression case yozdim", crit: "model/prompt xato bersa user-safe behavior aniq" },
    ],
    resources: [{ type: "doc", url: "https://www.nist.gov/itl/ai-risk-management-framework", title: "NIST AI RMF", desc: "AI riskini boshqarish bo'yicha rasmiy framework.", host: "nist.gov" }],
    project: { tag: "Safe AI", title: "Reviewed AI workflow", desc: "AI yordamchisini real, tekshiriladigan va qaytariladigan oqimga ulang.", features: ["output contract", "human approval", "audit trail", "fallback"], rubric: ["Schema serverda tekshiriladi.", "High-impact action odam tasdig'isiz ketmaydi.", "Regression dalili bor." ] },
    quiz: [{ q: "Human-in-the-loop qachon kerak?", a: ["AI irreversible yoki yuqori risk qaror qilganda", "Faqat rang tanlashda", "Hech qachon", "Faqat prompt uzun bo'lsa"], c: 0, w: "Yuqori ta'sirli qarorlarda inson nazorati muhim.", level: "scenario" }],
    exercises: [{ type: "gap", q: "The server must ___ the structured output before using it.", answers: ["validate"], why: "Structured output ham ishonchsiz input sifatida serverda validate qilinadi." }],
  })],
  finance: [module({
    zoom: "F12", title: "Freelancer Cash-Flow System", sub: "Income volatility", coord: "Personal / Freelance finance", eyebrow: "12 / Variable income", mtitle: "O'zgaruvchan daromadni boshqaring",
    lede: "Bu investitsiya tavsiyasi emas. Freelancer yoki contract ishda asosiy ko‘nikma — <strong>cash-flow, soliq zaxirasi va runway</strong>ni ko'rish.",
    doc: "<div class='prose'><h3>Variable income qoidasi</h3><p>Eng yaxshi oy bo'yicha emas, konservativ bazaviy daromad bo'yicha majburiy xarajat rejalashtiriladi. Soliq va biznes xarajatlari alohida zaxiraga ajratiladi. Mahalliy qonun/soliq masalasida litsenziyalangan mutaxassisdan tekshir.</p></div>",
    tasks: [
      { id: "f12-1", html: "Shaxsiy va loyiha/freelance pul oqimini ajratdim", crit: "daromad, business expense, tax reserve va personal expense alohida ko'rinadi" },
      { id: "f12-2", html: "Conservative monthly runway hisobladim", crit: "formula, taxminlar va favqulodda holat ssenariysi yozilgan" },
      { id: "f12-3", html: "Invoice, contract va payment follow-up checklist yaratdim", crit: "due date, payment status va overdue action bor" },
    ],
    resources: [{ type: "doc", url: "https://www.consumerfinance.gov/consumer-tools/budgeting/", title: "Budgeting tools", desc: "Byudjet va cash-flow asoslari.", host: "consumerfinance.gov" }],
    project: { tag: "Personal system", title: "Freelancer cash-flow board", desc: "O'zgaruvchan daromad uchun shaffof reja tuzing.", features: ["separate buckets", "runway", "invoice tracker"], rubric: ["Taxminlar ko'rsatilgan.", "Shaxsiy va biznes pul aralashmagan.", "Mahalliy soliq maslahati sifatida ko'rsatilmagan." ] },
    quiz: [{ q: "Variable income bilan qaysi baza xavfsizroq?", a: ["Eng yuqori oy daromadi", "Konservativ odatiy daromad", "Tasodifiy raqam", "Faqat kredit"], c: 1, w: "Majburiy xarajatlar konservativ baza bilan boshqariladi.", level: "practical" }],
    exercises: [{ type: "choice", q: "Tax reserve qayerda ko'rinishi kerak?", options: ["Personal spending bilan aralash", "Alohida belgilangan bucketda", "Hisobsiz", "Faqat yil oxirida"], correct: 1, why: "Alohida zaxira cash-flow riskini ko'rishga yordam beradi." }],
  })],
  russian: [module({
    zoom: "RU12", title: "Technical Russian Delivery", sub: "Workplace", coord: "Professional / Technical Russian", eyebrow: "12 / Team communication", mtitle: "Texnik ishni ruscha topshiring",
    lede: "CIS jamoasida ishlash uchun grammar yetmaydi: issue, handoff, status va clarificationni <strong>aniq hamda professional</strong> yozish kerak.",
    doc: "<div class='prose'><h3>Ishdagi rus tili</h3><p>Yaxshi status update: nima bajarildi, nima bloklayapti, kimdan nima kerak va qachon keyingi update beriladi. Tarjimon yordamchi bo'lishi mumkin, lekin jo'natishdan oldin texnik ma'no va ism/raqamlarni o'zing tekshir.</p></div>",
    tasks: [
      { id: "ru-pro-1", html: "Ruscha bug report yoki issue yozdim", crit: "reproduce, expected/actual behavior va severity bor" },
      { id: "ru-pro-2", html: "Ruscha technical status update va clarification savolini yozdim", crit: "owner, blocker va next step tushunarli" },
      { id: "ru-pro-3", html: "Map/API qarorini 2 daqiqada ruscha tushuntirdim", crit: "problem, qaror, trade-off va follow-up recordingda bor" },
    ],
    resources: [{ type: "doc", url: "https://www.gramota.ru/", title: "\u0413\u0440\u0430\u043c\u043e\u0442\u0430.\u0440\u0443", desc: "Rus tili imlo va qo'llanish ma'lumotnomasi.", host: "gramota.ru" }],
    project: { tag: "Workplace proof", title: "Russian technical handoff pack", desc: "Bitta real geospatial taskni ruscha ish yozishmalari bilan topshir.", features: ["issue", "status update", "clarification", "spoken explanation"], rubric: ["Ma'no texnik jihatdan aniq.", "Action/owner ko'rsatilgan.", "Tarjima ko'r-ko'rona yuborilmagan." ] },
    quiz: [{ q: "Yaxshi status update nimani bildiradi?", a: ["Faqat 'ishlayapman'", "Bajarilgan ish, blocker, owner va next step", "Faqat emoji", "Faqat muammo"], c: 1, w: "Status update jamoaga qaror qilish uchun aniq kontekst beradi.", level: "practical" }],
    exercises: [{ type: "choice", q: "Clarification so'rashning maqsadi nima?", options: ["Talabni taxmin qilish", "Noaniq talabni tasdiqlash", "Ishni yashirish", "Reviewni o'tkazib yuborish"], correct: 1, why: "Noaniqlikni erta aniqlash qayta ishlash riskini kamaytiradi." }],
  })],
  arabic: [module({
    zoom: "AR16", title: "Mustaqil o'qish tizimi", sub: "Retention", coord: "Final / Independent practice", eyebrow: "16 / Uzoq muddat", mtitle: "Kursdan keyin ham davom eting",
    lede: "Arab tili uzoq masofa. Yakuniy maqsad — yangi matnni <strong>mustaqil, halol va muntazam</strong> o'qiy olish uchun sustainable tizim yaratish.",
    doc: "<div class='prose'><h3>Retention tizimi</h3><p>Haftalik kichik matn, SRS takrorlash, root/grammar note va audio self-checkni birlashtir. Tarjima yoki tafsirni matnning o'rniga qo'yma: avval o'zing tahlil qil, keyin ishonchli manba bilan tekshir.</p></div>",
    tasks: [
      { id: "ar16-1", html: "4 haftalik Arabic reading va SRS maintenance rejasini tuzdim", crit: "haftalik vaqt, matn turi va review kuni aniq" },
      { id: "ar16-2", html: "Yangi qisqa matnni mustaqil tahlil qildim", crit: "so'z/root, grammar taxmini va keyingi manba bilan verification ajratilgan" },
      { id: "ar16-3", html: "O'qish audio self-review yozdim", crit: "talaffuzdagi 3 yaxshilash nuqtasi va keyingi mashq bor" },
    ],
    resources: [{ type: "doc", url: "https://corpus.quran.com/", title: "Quranic Arabic Corpus", desc: "So'z va grammar tahlili uchun manba.", host: "corpus.quran.com" }],
    project: { tag: "Long-term practice", title: "Arabic independent study system", desc: "Kursdan keyingi o'qish, takrorlash va tekshiruv tizimini dalil bilan quring.", features: ["4-week plan", "independent analysis", "verification log", "audio review"], rubric: ["Mustaqil urinish va tekshiruv farqlangan.", "Reja davom ettiriladigan.", "Talaffuz self-review bor." ] },
    quiz: [{ q: "Mustaqil tahlildan keyingi to'g'ri qadam nima?", a: ["Hech qachon tekshirmaslik", "Ishonchli manba bilan taxminni verification qilish", "Faqat tarjimani yodlash", "SRSni to'xtatish"], c: 1, w: "Mustaqil urinishdan keyin verification xatoni o'rganishga aylantiradi.", level: "practical" }],
    exercises: [{ type: "choice", q: "Sustainable til tizimi nimani talab qiladi?", options: ["Bir kunda juda ko'p, keyin to'xtash", "Kichik muntazam reading, SRS va review", "Faqat tarjima", "Faqat test"], correct: 1, why: "Uzluksiz kichik amaliyot retention uchun kuchliroq." }],
  })],
};
