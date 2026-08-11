import type { Module } from "../types";

// Existing English module zoom/task IDs stay untouched. These additions have
// their own stable IDs so previously saved progress remains valid.
export const ENGLISH_PLACEMENT_MODULE: Module = {
  zoom: "Diag",
  title: "Placement & Learning Plan",
  sub: "Diagnostic",
  coord: "Start / Diagnostic",
  eyebrow: "00 / CEFR diagnostikasi",
  mtitle: "Qayerdan boshlashni aniqlang",
  lede: "Bu rasmiy IELTS yoki CEFR sertifikati emas. U <strong>boshlash nuqtasi</strong>ni tanlash, kuchli/zaif skillni ko'rish va shaxsiy haftalik rejani tuzish uchun diagnostika.",
  doc: `<div class='prose'><h3>Nega diagnostika kerak?</h3><p>Hamma A0 dan boshlamaydi. Grammar, listening, writing va speaking darajasi turlicha bo'lishi mumkin. Shuning uchun natijani faqat bitta test bilan emas, to'rtta skill dalili bilan bahola.</p><h3>Qanday o'qiysan?</h3><ol><li>Quyidagi qisqa grammar/vocabulary mashqlarini bajar.</li><li>1-2 daqiqalik English audio tinglab 5 ta fakt yoz.</li><li>120 so'zli self-introduction yoz.</li><li>60-90 sekund ovoz yozib o'zingni va hozirgi ish tajribangni tushuntir.</li></ol><div class='callout'><div><p>Halol natija</p><p>Translator yoki AI bilan tayyorlangan matn diagnostika natijasini buzadi. Ularni keyin feedback uchun ishlatish mumkin, lekin birinchi draft mustaqil bo'lsin.</p></div></div><h3>Yo'nalish tanlash</h3><table class='gtable'><thead><tr><th>Natija</th><th>Tavsiya</th></tr></thead><tbody><tr><td>Asosiy gaplar qiyin</td><td>A0/A1 dan boshlang</td></tr><tr><td>Oddiy muloqot bor, lekin tense/vocabulary zaif</td><td>A2/B1 dan boshlang</td></tr><tr><td>Texnik fikrni tushuntirish va yozish qiyin</td><td>B1/B2 + Geo English</td></tr><tr><td>Ish suhbatini bemalol olib borasiz</td><td>Job, Geo English va Final assessment</td></tr></tbody></table></div>`,
  code: [],
  tasks: [
    { id: "en-diag-1", html: "20 daqiqalik grammar/vocabulary diagnostikasini bajardim", crit: "natija va xato bo'lgan 5 mavzu yozib qo'yilgan" },
    { id: "en-diag-2", html: "Unseen audio bo'yicha 5 ta fakt yozdim", crit: "audio qayta-qayta to'xtatmasdan tinglangan; fakt va taxmin ajratilgan" },
    { id: "en-diag-3", html: "120 so'zli mustaqil self-introduction yozdim", crit: "rol, tajriba, maqsad va bitta loyiha misoli bor" },
    { id: "en-diag-4", html: "60-90 sekund speaking recording qildim", crit: "yozuv qayta tinglangan va 3 ta yaxshilash nuqtasi qayd etilgan" },
    { id: "en-diag-5", html: "Keyingi 4 hafta uchun skill-priority reja tuzdim", crit: "haftada kamida 4 session, aniq skill va deliverable ko'rsatilgan" },
  ],
  resources: [
    { type: "doc", url: "https://www.cambridgeenglish.org/test-your-english/", title: "Cambridge English test", desc: "Boshlang'ich self-check uchun rasmiy amaliy test.", host: "cambridgeenglish.org" },
    { type: "doc", url: "https://www.coe.int/en/web/common-european-framework-reference-languages", title: "CEFR descriptors", desc: "Darajani real qila olishlar orqali tushunish.", host: "coe.int" },
  ],
  project: {
    tag: "Baseline",
    title: "English baseline pack",
    desc: "Boshlang'ich holatingni dalil bilan saqla; kurs oxirida shu pack bilan solishtirasan.",
    features: ["grammar/vocabulary natijasi", "unseen listening notes", "120 so'zli writing", "speaking recording", "4 haftalik reja"],
    rubric: ["Mustaqil birinchi urinish saqlangan.", "Har skill uchun bitta dalil bor.", "Keyingi modul tanlovi natijaga asoslangan."],
  },
  quiz: [
    { q: "Placement diagnostikasining vazifasi nima?", a: ["Rasmiy IELTS sertifikati berish", "Boshlash nuqtasi va skill-priorityni topish", "Faqat grammar ballini olish", "AI bilan essay yozish"], c: 1, w: "Diagnostika yo'lni tanlash uchun; u rasmiy sertifikat emas.", level: "practical" },
    { q: "Nega listening, writing va speakingni ham tekshirish kerak?", a: ["Bitta grammar testi hammasini o'lchaydi", "Skilllar har doim bir xil rivojlanadi", "Har skill darajasi har xil bo'lishi mumkin", "Faqat IELTS uchun"], c: 2, w: "Til profili notekis bo'lishi mumkin; to'rtta skill alohida dalil bilan tekshiriladi.", level: "scenario" },
  ],
  exercises: [
    { type: "choice", q: "I have worked with geospatial data for two years.", options: ["Men geodata bilan ikki yil ishladim.", "Men geodata bilan ikki yil ishlayapman.", "Men geodata bilan ikki yil ishlaganman."], correct: 1, why: "Present perfect continuous / present perfect experience hozirgacha davom etgan tajribani ifodalaydi." },
    { type: "gap", q: "I ___ a web map last month.", answers: ["built", "created", "developed"], why: "Last month tugallangan o'tgan vaqt, shuning uchun past simple ishlatiladi." },
    { type: "speak", q: "Boshlang'ich tajribangni ayt.", say: "I build web maps and work with spatial data.", lang: "en-US", why: "Qisqa, aniq gapni yozib ko'ring; keyin pace va tushunarliligini baholang." },
  ],
};

export const GEOSPATIAL_ENGLISH_MODULE: Module = {
  zoom: "GeoEN",
  title: "Geospatial English in Practice",
  sub: "Workplace English",
  coord: "Professional / Geospatial English",
  eyebrow: "13B / Maps, APIs and stakeholders",
  mtitle: "Geo loyihani inglizcha tushuntiring",
  lede: "React/MapLibre, FastAPI va PostGIS bilimini <strong>inglizcha aniq tushuntirish</strong> — remote jamoa, documentation, interview va client uchrashuvi uchun alohida ko'nikma.",
  doc: `<div class='prose'><h3>Texnik English = terminlar ro'yxati emas</h3><p>Professional javob muammo, dalil, qaror, trade-off va keyingi qadamni bog'laydi. Masalan: <em>"We use bbox loading to reduce payload size; the trade-off is that cached data can be stale, so we show the refresh state."</em></p><h3>Asosiy geospatial vocabulary</h3><div class='chips'><span class='chip'>CRS / projection</span><span class='chip'>vector tile</span><span class='chip'>raster resolution</span><span class='chip'>spatial index</span><span class='chip'>bbox query</span><span class='chip'>geometry validity</span><span class='chip'>trade-off</span><span class='chip'>data provenance</span></div><h3>Ishdagi 4 vaziyat</h3><ol><li>Bug report: muammo, impact, reproduce step va expected behavior.</li><li>API/design note: request, response, constraint va error behavior.</li><li>Stakeholder update: progress, risk, owner va deadline.</li><li>Architecture review: qarorni himoya qilish va limitationni ochiq aytish.</li></ol><div class='callout'><div><p>AI bilan ishlash qoidasi</p><p>AI grammar va clarity uchun reviewer bo'lishi mumkin. Ammo fact, metric, benchmark va loyiha natijasini faqat o'zing tekshirgan dalil bilan yoz. AI yaratgan matnni tushunmasdan yuborma.</p></div></div></div>`,
  code: [],
  tasks: [
    { id: "en-geo-1", html: "20 ta geospatial/workplace term uchun glossary tuzdim", crit: "har term: English definition, o'zbekcha ma'no va real loyiha misoli bilan" },
    { id: "en-geo-2", html: "Map bug report yozdim", crit: "steps to reproduce, expected/actual behavior, impact, screenshot yoki video link va environment bor" },
    { id: "en-geo-3", html: "Bitta GeoJSON yoki bbox API uchun English API note yozdim", crit: "endpoint, input/output, CRS/coordinate order, error va limitation aniq" },
    { id: "en-geo-4", html: "2-3 daqiqalik GeoPulse yoki shaxsiy map loyiha demosini yozib gapirdim", crit: "problem, architecture, trade-off, evidence va next step bor; recording saqlangan" },
    { id: "en-geo-5", html: "Architecture review uchun ADR summary yozdim", crit: "qaror, alternatives, trade-off va rollback/next action ko'rsatilgan" },
  ],
  resources: [
    { type: "doc", url: "https://developers.google.com/tech-writing", title: "Google Technical Writing", desc: "Aniq va qisqa technical documentation yozish.", host: "developers.google.com" },
    { type: "doc", url: "https://docs.ogc.org/", title: "OGC Standards", desc: "WMS, WFS, tiles va geospatial standards terminology.", host: "docs.ogc.org" },
    { type: "doc", url: "https://postgis.net/docs/", title: "PostGIS documentation", desc: "Spatial SQL va geometry terminology manbasi.", host: "postgis.net" },
    { type: "doc", url: "https://maplibre.org/maplibre-gl-js/docs/", title: "MapLibre GL JS docs", desc: "Map frontend terminology va real docs o'qish mashqi.", host: "maplibre.org" },
  ],
  project: {
    tag: "Portfolio / Geospatial",
    title: "English geospatial case study",
    desc: "Ishlaydigan map loyihangni remote jamoa yoki client tushunadigan English case studyga aylantir.",
    features: ["problem va users", "architecture diagram", "API/map behavior", "CRS/data quality note", "trade-off va limitations", "2-3 minute demo recording"],
    rubric: ["Technical factlar dalil bilan tasdiqlangan.", "Terminlar auditoriyaga mos izohlangan.", "Trade-off va noma'lumlik yashirilmagan.", "Demo script o'qilmay, follow-up savolga javob berilgan."],
  },
  quiz: [
    { q: "Bbox loadingning asosiy foydasi nima?", a: ["Hamma data doim yuklanadi", "Ko'rinayotgan viewport uchun data yuklab, payloadni kamaytiradi", "CRSni avtomatik tanlaydi", "Database kerak emas"], c: 1, w: "Bbox/viewport loading odatda keraksiz data transferini kamaytiradi.", level: "practical" },
    { q: "Professional bug reportda qaysi ma'lumot kerak?", a: ["Faqat 'map ishlamayapti'", "Reproduce steps, expected/actual behavior va impact", "Faqat screenshot", "Faqat yechim"], c: 1, w: "Yaxshi report muammoni qayta ko'rish va prioritizatsiya qilishga imkon beradi.", level: "scenario" },
    { q: "Architecture trade-offni qanday yozish to'g'ri?", a: ["Limitationni yashirish", "Faqat tool nomini aytish", "Qaror, alternativa, foyda, cheklov va keyingi chorani aytish", "AI javobini tekshirmasdan yuborish"], c: 2, w: "Senior communication qarorning narxi va cheklovini ham ochiq ko'rsatadi.", level: "scenario" },
  ],
  exercises: [
    { type: "gap", q: "The API returns features within the current ___.", answers: ["bounding box", "bbox", "viewport"], why: "bbox/viewport mapdagi joriy ko'rinadigan hududni bildiradi." },
    { type: "choice", q: "Which sentence explains a trade-off clearly?", options: ["PostGIS is the best.", "We chose PostGIS because spatial queries are fast with a GiST index; it adds operational complexity.", "The database works.", "Use more servers."], correct: 1, why: "Sabab va cheklovni birga aytish professional trade-off explanation hisoblanadi." },
    { type: "speak", q: "API qarorini qisqa tushuntiring.", say: "We return GeoJSON for small viewport queries and use vector tiles for high-volume map rendering.", lang: "en-US", why: "Gapni aytib yozing; keyin ma'no, pace va talaffuzni tekshiring." },
  ],
  vocab: [
    { w: "bounding box", pos: "noun", uz: "chegaralovchi to'rtburchak hudud", ex: "The client sends a bounding box with every viewport request." },
    { w: "spatial index", pos: "noun", uz: "fazoviy indeks", ex: "A spatial index keeps intersection queries responsive." },
    { w: "projection", pos: "noun", uz: "proyeksiya", ex: "We documented the projection before calculating area." },
    { w: "trade-off", pos: "noun", uz: "muvozanatli tanlov / evaziga cheklov", ex: "Tile caching improves speed but can delay fresh data." },
    { w: "provenance", pos: "noun", uz: "ma'lumot kelib chiqishi", ex: "Dataset provenance is recorded in the metadata." },
  ],
};
