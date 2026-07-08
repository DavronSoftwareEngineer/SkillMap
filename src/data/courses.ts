import type { Module, Book } from "../types";
import { WEBGIS_FLAGSHIP_MODULE } from "./webgis-flagship";

export interface CourseMeta {
  id: string;
  name: string;
  brandTitle: string;
  brandSub: string;
  labels: Record<string, string>;
  playground?: boolean;
  books?: Book[];
  // Modul (zoom) -> kitob n: shu modulga oid kitob eslatmasi uchun.
  moduleBooks?: Record<string, number>;
}

export type Course = CourseMeta & { modules: Module[] };

type CourseModuleImport = { default: unknown };

const COURSE_LOADERS: Record<string, () => Promise<CourseModuleImport>> = {
  webgis: () => import("./webgis.json"),
  frontend: () => import("./frontend.json"),
  backend: () => import("./backend.json"),
  git: () => import("./git.json"),
  telegram: () => import("./telegram.json"),
  cybersecurity: () => import("./cybersecurity.json"),
  english: () => import("./english.json"),
  finance: () => import("./finance.json"),
  russian: () => import("./russian.json"),
  arabic: () => import("./arabic.json"),
  prompting: () => import("./prompting.json"),
};

export async function loadCourseModules(id: string): Promise<Module[]> {
  const loader = COURSE_LOADERS[id] || COURSE_LOADERS.webgis;
  const data = await loader();
  const modules = data.default as Module[];
  return id === "webgis" ? [...modules, WEBGIS_FLAGSHIP_MODULE] : modules;
}

// Urg'u ranglari (kartalar uchun) - aylanib ishlatiladi.
const A = "#34d6c0",
  B = "#9a8cff",
  C = "#4ea1ff",
  D = "#f4a23c",
  E = "#ff7a9c",
  F = "#6ee7a8";

export const COURSES: CourseMeta[] = [
  {
    id: "webgis",
    name: "Geospatial",
    brandTitle: "Geospatial Full-Stack Academy",
    brandSub: "React TS / MapLibre / FastAPI / PostGIS / GDAL / YOLO / Docker",
    labels: {
      doc: "Hujjat",
      code: "Kod misollari",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Loyiha",
    },
    books: [
      { n: 1, accent: A, title: "Eloquent JavaScript", author: "Marijn Haverbeke", isbn: "9781593279509", note: "Frontend poydevori - JS tilini chuqur tushunish. Kurs React qismidan oldin o'qib qo'y." },
      { n: 2, accent: B, title: "Programming TypeScript", author: "Boris Cherny", isbn: "9781492037651", note: "TypeScript noldan: tiplar, generiklar, xavfsiz kod. JS'dan keyin - kurs React TS qismidan oldin o'qib qo'y." },
      { n: 3, accent: C, title: "The Road to React", author: "Robin Wieruch", note: "React'ni noldan amaliy o'rgatadi - kursning frontend modullariga to'g'ridan-to'g'ri yordam beradi." },
      { n: 4, accent: D, title: "PostGIS in Action", author: "Regina Obe, Leo Hsu", isbn: "9781617294860", note: "Geofazoviy ma'lumotlar bazasi - PostGIS modullari uchun asosiy manba." },
      { n: 5, accent: E, title: "Web Mapping Illustrated", author: "Tyler Mitchell", isbn: "9780596008659", note: "Web xarita asoslari: proyeksiya, tile, server. Tegola/MapLibre modullaridan oldin foydali." },
      { n: 6, accent: F, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781449373320", note: "Backend va ma'lumot tizimlari chuqur. Kurs oxirida - production darajaga chiqqach o'qi." },
      { n: 7, accent: A, title: "Python Crash Course", author: "Eric Matthes", isbn: "9781718502703", note: "Python/FastAPI va GIS processing modullariga kirishdan oldin Python poydevorini mustahkamlaydi." },
      { n: 8, accent: B, title: "Geospatial Data Science with Python", author: "M. O. Idowu", note: "GeoPandas, Shapely, Rasterio va geospatial data processing bo'limlari uchun amaliy yo'nalish." },
    ],
    moduleBooks: { z0: 1, z2: 3, z3: 7, z4: 7, z5: 4, z8: 5, z6: 7, z7: 8, z11: 8, z12: 6, z14: 6, z15: 4, z16: 6, z17: 6, z18: 6 },
  },
  {
    id: "frontend",
    name: "Frontend",
    brandTitle: "Professional Frontend Academy",
    brandSub: "0 -> Senior / HTML / CSS / JS / TS / React",
    labels: {
      doc: "Dars",
      code: "Kod misollari",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Loyiha",
    },
    books: [
      { n: 1, accent: A, title: "Eloquent JavaScript", author: "Marijn Haverbeke", isbn: "9781593279509", note: "JS poydevori - tilni chuqur tushunish. FE4 (JS asoslari) bilan birga o'qi." },
      { n: 2, accent: B, title: "You Don't Know JS Yet", author: "Kyle Simpson", isbn: "9781091210099", note: "JS'ning ichki mexanikasi: scope, closure, this. Modern JS modulida foydali." },
      { n: 3, accent: C, title: "CSS in Depth", author: "Keith J. Grant", isbn: "9781617293450", note: "CSS'ni chuqur: layout, specificity, custom properties. CSS modullari uchun." },
      { n: 4, accent: D, title: "Programming TypeScript", author: "Boris Cherny", isbn: "9781492037651", note: "TypeScript noldan: tiplar, generiklar. FE7 (TypeScript) bilan birga." },
      { n: 5, accent: E, title: "The Road to React", author: "Robin Wieruch", note: "React'ni amaliy noldan. FE8 (React asoslari) uchun asosiy manba." },
      { n: 6, accent: F, title: "Refactoring UI", author: "Adam Wathan, Steve Schoger", note: "Dasturchilar uchun amaliy dizayn - chiroyli UI'ni qoidalar bilan qurish." },
    ],
    moduleBooks: { FE2: 3, FE4: 1, FE5: 2, FE7: 4, FE8: 5, FE3: 6 },
  },
  {
    id: "backend",
    name: "Backend",
    brandTitle: "Professional Backend Academy",
    brandSub: "0 -> Senior / Node.js / TypeScript / DB / API / DevOps",
    labels: {
      doc: "Dars",
      code: "Kod misollari",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Loyiha",
    },
    books: [
      { n: 1, accent: A, title: "Node.js Design Patterns", author: "Mario Casciaro, Luciano Mammino", isbn: "9781839214110", note: "Node arxitektura va patternlar - BE8 (arxitektura) bilan birga, o'rta darajada." },
      { n: 2, accent: B, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781449373320", note: "Ma'lumot tizimlari bibliyasi - masshtab, izchillik, replikatsiya. Senior tomon." },
      { n: 3, accent: C, title: "Programming TypeScript", author: "Boris Cherny", isbn: "9781492037651", note: "Backend ham TS - tiplar, generiklar. Boshida o'qib qo'y." },
      { n: 4, accent: D, title: "Database Internals", author: "Alex Petrov", isbn: "9781492040347", note: "Ma'lumotlar bazasi ichkarisi: index, storage engine. BE4 (SQL) bilan chuqurlashuv." },
      { n: 5, accent: E, title: "System Design Interview", author: "Alex Xu", isbn: "9798664653403", note: "Tizim dizayni - masshtablash, trade-off. BE11 (senior) va suhbatlar uchun." },
      { n: 6, accent: F, title: "Web Scalability for Startup Engineers", author: "Artur Ejsmont", isbn: "9780071843652", note: "Amaliy masshtablash: kesh, navbat, load balancer." },
    ],
    moduleBooks: { BE0: 3, BE4: 4, BE8: 1, BE10: 2, BE11: 5 },
  },
  {
    id: "git",
    name: "Git & GitHub",
    brandTitle: "Professional Git Academy",
    brandSub: "Git / GitHub / GitLab / Branching / CI/CD / Team Workflow",
    labels: {
      doc: "Dars",
      code: "Buyruqlar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Loyiha",
    },
    books: [
      { n: 1, accent: A, title: "Pro Git", author: "Scott Chacon, Ben Straub", isbn: "9781484200773", note: "Git'ning rasmiy kitobi - git-scm.com'da BEPUL. Kurs davomida asosiy hamroh: har modulga mos bo'limi bor." },
      { n: 2, accent: B, title: "Version Control with Git", author: "Prem Kumar Ponuthorai, Jon Loeliger", isbn: "9781492091196", note: "Ichki model va murakkab holatlar chuqur - rebase/senior modullariga yetganingda o'qi." },
      { n: 3, accent: C, title: "Learning GitHub Actions", author: "Brent Laster", isbn: "9781098131074", note: "CI/CD modulining kengaytmasi: workflow, action yozish, xavfsizlik amaliy." },
      { n: 4, accent: D, title: "Automating DevOps with GitLab CI/CD Pipelines", author: "Christopher Cowell, Nicholas Lotz, Chris Timberlake", isbn: "9781803233000", note: "GitLab pipeline'lari amaliy va chuqur - GitLab moduli va DevOps yo'nalishi uchun." },
    ],
    moduleBooks: { GT0: 1, GT5: 2, GT8: 4, GT10: 3, GT11: 2 },
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    brandTitle: "Professional Telegram Bot Academy",
    brandSub: "Node.js / TypeScript / Bot API / Webhook / Mini Apps / Payments",
    labels: {
      doc: "Dars",
      code: "Kod misollari",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Loyiha",
    },
    books: [
      { n: 1, accent: A, title: "Telegram Bot API", author: "Telegram Core Docs", note: "Rasmiy Bot API hujjatlari: update, method, webhook, payment va Mini App imkoniyatlari uchun asosiy manba." },
      { n: 2, accent: B, title: "grammY Guide", author: "grammY", note: "TypeScript botlar uchun zamonaviy framework: middleware, session, menu, runner va deployment patternlari." },
      { n: 3, accent: C, title: "Node.js Design Patterns", author: "Mario Casciaro, Luciano Mammino", isbn: "9781839214110", note: "Middleware, modul, queue, error handling va arxitekturani toza qurish uchun." },
      { n: 4, accent: D, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781449373320", note: "Bot state, DB, izchillik, audit va katta trafikdagi ma'lumot oqimlarini tushunish uchun." },
      { n: 5, accent: E, title: "Web Scalability for Startup Engineers", author: "Artur Ejsmont", isbn: "9780071843652", note: "Webhook, scaling, monitoring, cache va production barqarorligi uchun amaliy manba." },
    ],
    moduleBooks: { TG0: 1, TG1: 2, TG2: 4, TG4: 5, TG8: 3 },
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    brandTitle: "Professional Cybersecurity Academy",
    brandSub: "Defense / Network / Web / Cloud / SOC / IR / GRC",
    labels: {
      doc: "Dars",
      code: "Lab misollari",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Portfolio",
    },
    books: [
      { n: 1, accent: A, title: "Computer Networking: A Top-Down Approach", author: "Kurose, Ross", isbn: "9780136681557", note: "Tarmoq poydevori: TCP/IP, DNS, HTTP, TLS. Cybersecurity uchun avval trafikni tushunish shart." },
      { n: 2, accent: B, title: "Linux Basics for Hackers", author: "OccupyTheWeb", isbn: "9781593278557", note: "Linux, shell, tarmoq utilitalari va lab muhitini boshqarish uchun amaliy kirish." },
      { n: 3, accent: C, title: "Web Application Hacker's Handbook", author: "Dafydd Stuttard, Marcus Pinto", isbn: "9781118026472", note: "Web zaifliklarni chuqur tushuntiradi. Faqat ruxsatli lab va himoya maqsadida ishlat." },
      { n: 4, accent: D, title: "Security Engineering", author: "Ross Anderson", isbn: "9781119642787", note: "Tizim, risk, odam va jarayonni birga ko'radigan professional xavfsizlik fikrlashi." },
      { n: 5, accent: E, title: "Blue Team Handbook: SOC, SIEM and Threat Hunting", author: "Don Murdoch", note: "SOC, log, alert, hunting va incident handling uchun ixcham amaliy qo'llanma." },
      { n: 6, accent: F, title: "Incident Response & Computer Forensics", author: "Luttgens, Pepe, Mandia", isbn: "9780071798686", note: "IR, dalil saqlash, timeline, containment va recovery jarayonlarini professional darajada tushunish." },
    ],
    moduleBooks: { CY0: 4, CY1: 1, CY2: 2, CY3: 3, CY6: 5, CY8: 6, CY9: 4, CY10: 4, CY11: 6 },
  },
  {
    id: "english",
    name: "English",
    brandTitle: "English Academy",
    brandSub: "0 -> IELTS / Listening / Reading / Writing / Speaking",
    labels: {
      doc: "Dars",
      code: "Namunalar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    books: [
      { n: 1, accent: A, title: "English Grammar in Use", author: "Raymond Murphy", isbn: "9781108457651", note: "Grammatika uchun eng mashhur kitob. Har bir mavzu - bir sahifa tushuntirish + mashq. A1'dan boshla." },
      { n: 2, accent: B, title: "English Vocabulary in Use", author: "Stuart Redman", isbn: "9780521136204", note: "Lug'atni mavzular bo'yicha o'rgatadi. Kursdagi flashcardlar bilan birga ishlat." },
      { n: 3, accent: C, title: "Word Power Made Easy", author: "Norman Lewis", isbn: "9780143429302", note: "So'z boyligini ildiz/affiks orqali kengaytiradi. O'rta darajada o'qiganing yaxshi." },
      { n: 4, accent: D, title: "Practical English Usage", author: "Michael Swan", isbn: "9780194202411", note: "Shubhali grammatika holatlari uchun ma'lumotnoma. Yoningda turishi kerak bo'lgan kitob." },
      { n: 5, accent: E, title: "The Official Cambridge Guide to IELTS", author: "Pauline Cullen", isbn: "9781107620698", note: "IELTS'ga tayyorgarlik - 4 ko'nikma + namuna testlar. Imtihon modullaridan oldin." },
    ],
    moduleBooks: { A1: 1, Voc: 2, B1: 3, B2: 4, Exam: 5 },
  },
  {
    id: "finance",
    name: "Moliya",
    brandTitle: "Moliyaviy Savodxonlik",
    brandSub: "Byudjet / Jamg'arma / Qarz / Xavfsizlik / Investitsiya",
    labels: {
      doc: "Dars",
      code: "Misollar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    books: [
      { n: 1, accent: A, title: "Atom odatlar", author: "Jeyms Klir / Atomic Habits", isbn: "9780735211292", note: "Shu yerdan boshla. Pulni boshqarish - odat: xarajat yozish, tejash, ortiqcha sarflamaslik. Intizom shu yerda shakllanadi." },
      { n: 2, accent: B, title: "Pul oqimining kvadranti", author: "R. Kiyosaki / Cashflow Quadrant", isbn: "9781612680057", note: "Pul topishning yo'llari: ishchi, mutaxassis, biznes egasi, investor fikrlashi. 100% qoida emas - fikrni kengaytiruvchi kitob." },
      { n: 3, accent: C, title: "Bank 4.0", author: "Brett King", isbn: "9781119506508", note: "Raqamli moliya, fintech, zamonaviy to'lov tizimlari. IT sohasidagilarga ayniqsa qiziq - lekin 1-kitob bo'lishi shart emas." },
      { n: 4, accent: D, title: "O'yla va boy bo'l", author: "Napoleon Hill / Think and Grow Rich", isbn: "9781585424337", note: "Motivatsiya va maqsad qo'yish uchun. Amaliy moliyani o'rgatmaydi - qo'shimcha sifatida o'qi." },
      { n: 5, accent: E, title: "Marketing A dan Ya gacha", author: "Filip Kotler", isbn: "9780471268673", note: "Biznes va marketing uchun. O'z mahsulot / startap / xizmat sotmoqchi bo'lsang - keyinroq o'qi." },
      { n: 6, accent: F, title: "Biografiyalar", author: "Alibaba / Ilon Mask / Rejali ayol", note: "Ilhom beradi, lekin pul boshqarishni to'g'ridan-to'g'ri o'rgatmaydi. Eng oxirida o'qisang bo'ladi." },
    ],
    moduleBooks: { F0: 1, F6: 3, F7: 2, F8: 4 },
  },
  {
    id: "russian",
    name: "Rus tili",
    brandTitle: "Rus tili Akademiyasi",
    brandSub: "0 -> B1 / Alifbo / Kelishiklar / Fe'l aspekti / Suhbat",
    labels: {
      doc: "Dars",
      code: "Namunalar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    books: [
      { n: 1, accent: A, title: "Поехали!", author: "С. Чернышов", note: "Noldan boshlovchilar uchun mashhur darslik. Talaffuz, alifbo, oddiy suhbat - kursning birinchi modullariga mos." },
      { n: 2, accent: B, title: "Русский язык в упражнениях", author: "Хавронина, Широченская", note: "Grammatika + mashqlar. Kelishiklar va fe'l aspekti modullari uchun amaliyot manbasi." },
      { n: 3, accent: C, title: "The New Penguin Russian Course", author: "Nicholas Brown", isbn: "9780140120417", note: "Ingliz tilida tushuntiruvchi to'liq kurs - grammatikani tizimli o'rganishga yaxshi." },
    ],
    moduleBooks: { "Алф": 1, "А2": 2, "Б1": 3 },
  },
  {
    id: "arabic",
    name: "Arab tili",
    brandTitle: "Arab tili Akademiyasi",
    brandSub: "0 -> Professional / Alifbo / Nahv / Sarf / Qur'on matni",
    labels: {
      doc: "Dars",
      code: "Namunalar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    books: [
      { n: 1, accent: A, title: "Alif Baa", author: "Brustad, Al-Batal, Al-Tonsi", isbn: "9781589016322", note: "Alifbo va tovushlar poydevori - AR0-AR2 modullari bilan birga, yozuv va talaffuzni mustahkamlaydi." },
      { n: 2, accent: B, title: "Madinah Arabic Reader (Durus al-lug'a)", author: "Dr. V. Abdur Rahim", note: "Qur'on arabchasiga mo'ljallangan klassik kurs - grammatika modullari (AR3 dan boshlab) bilan parallel o'qi." },
      { n: 3, accent: C, title: "Arabic Through the Qur'an", author: "Alan Jones", isbn: "9780946621675", note: "Grammatikani to'g'ridan-to'g'ri Qur'on matni orqali o'rgatadi - sarf/nahv modullaridan keyin boshla." },
      { n: 4, accent: D, title: "80% of Qur'anic Words", author: "Abdulazeez Abdulraheem", note: "Chastota bo'yicha Qur'on lug'ati - AR10 moduli uchun asosiy yodlash manbasi, bepul tarqatiladi." },
      { n: 5, accent: E, title: "A Dictionary of Modern Written Arabic", author: "Hans Wehr", isbn: "9780879500030", note: "O'zak bo'yicha izlanadigan asosiy lug'at - mustaqil matn o'qishga o'tishda (AR11) zarur ko'nikma." },
    ],
    moduleBooks: { AR0: 1, AR3: 2, AR9: 3, AR10: 4, AR11: 5 },
  },
  {
    id: "prompting",
    name: "AI Prompt",
    brandTitle: "AI bilan ishlash",
    brandSub: "Prompting / Aniqlik / Rol / Few-shot / Xavfsizlik",
    labels: {
      doc: "Dars",
      code: "Promptlar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    playground: true,
    books: [
      { n: 1, accent: A, title: "Co-Intelligence", author: "Ethan Mollick", isbn: "9780593716717", note: "AI bilan birga ishlash falsafasi va amaliyoti. Promptingga to'g'ri munosabat shu yerdan boshlanadi." },
      { n: 2, accent: B, title: "Prompt Engineering for Generative AI", author: "James Phoenix, Mike Taylor", isbn: "9781098153434", note: "Prompt texnikalari amaliy va tizimli: rol, few-shot, zanjir. Kursning asosiy mavzulariga mos." },
      { n: 3, accent: C, title: "Build a Large Language Model (From Scratch)", author: "Sebastian Raschka", isbn: "9781633437166", note: "AI ichkarisi qanday ishlashini tushunmoqchi bo'lsang - chuqurroq, ixtiyoriy daraja." },
    ],
    moduleBooks: { P0: 1, P2: 2, P5: 3 },
  },
];

export const COURSE_BY_ID: Record<string, CourseMeta> = Object.fromEntries(
  COURSES.map((c) => [c.id, c])
);
