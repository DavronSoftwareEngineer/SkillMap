import type { Module } from "../types";

// New stable module IDs: existing English progress and deep links stay intact.
export const ENGLISH_PRO_WORK_LABS: Module[] = [
  {
    zoom: "AudioLab",
    title: "Real Audio & Meeting Lab",
    sub: "Listening in context",
    coord: "Professional / Real audio",
    eyebrow: "13C / ACCENTS, MEETINGS, CLIENT CALLS",
    mtitle: "Sun'iy emas, haqiqiy nutqni tushuning",
    lede: "Brauzer ovozi talaffuz uchun foydali, lekin ishdagi English turli accent, tezlik, interrupt va noaniq talablar bilan keladi. Bu lab <strong>haqiqiy audio + transcript + action note</strong> orqali quloqni ish holatiga o'rgatadi.",
    doc: `<div class='prose'><h3>Bir audio bilan uch marta ishlang</h3><ol><li><strong>1-tinglash:</strong> transcript'siz gist, speaker maqsadi va 3 ta actionni yozing.</li><li><strong>2-tinglash:</strong> transcript bilan tushunmagan ibora, raqam va decisionni tekshiring.</li><li><strong>3-tinglash:</strong> 45-60 sekundlik qismini shadowing qiling va o'zingizni yozib eshiting.</li></ol><h3>Real meeting uchun note formati</h3><div class='tree'>Context / decision needed\nOwner / action / deadline\nRisk or unknown\nClarification question</div><div class='callout'><div><p>Accent maqsadi</p><p>Har accentni mukammal tushunish emas. Sizning maqsadingiz — noaniq joyni aniqlash, clarification so'rash va keyingi actionni noto'g'ri qilmaslik.</p></div></div></div>`,
    code: [{ heading: { h: "Meeting action note", p: "Audio tugagach, 90 sekund ichida shu minimal formatni to'ldiring." }, title: "meeting-note.md", lang: "md", code: `# Meeting note\n\n- Decision: ...\n- Owner: ...\n- Deadline: ...\n- Risk / unknown: ...\n- Clarification to send: ...` }],
    tasks: [
      { id: "en-audio-1", html: "3 xil accentdagi 3 ta real audio tanladim", crit: "kamida bitta British, bitta American va bitta boshqa accent; source va duration qayd etilgan" },
      { id: "en-audio-2", html: "Har audio uchun gist, 3 action va 2 noma'lum ibora yozdim", crit: "birinchi note transcript'siz, keyingi tuzatish transcript bilan alohida ko'rsatilgan" },
      { id: "en-audio-3", html: "Bitta technical talk yoki meeting audio'sidan action note tayyorladim", crit: "decision, owner, deadline, risk va clarification savoli mavjud" },
      { id: "en-audio-4", html: "60 sekundlik shadowing recording qildim", crit: "original audio linki, recording va o'zim belgilagan 3 pronunciation/pace nuqta saqlangan" },
      { id: "en-audio-5", html: "Noaniq talab bo'yicha clarification message yozdim", crit: "taxmin qilinmagan; aniq savol, context va next step inglizcha yozilgan" },
    ],
    resources: [
      { type: "doc", url: "https://learnenglish.britishcouncil.org/skills/listening", title: "British Council Listening", desc: "Transcript va level bilan haqiqiy listening practice.", host: "learnenglish.britishcouncil.org" },
      { type: "video", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english", title: "BBC 6 Minute English", desc: "Tabiiy British English, qisqa audio va vocabulary.", host: "bbc.co.uk" },
      { type: "video", url: "https://www.ted.com/talks", title: "TED Talks", desc: "Turli accentdagi professional talklar; transcript va tezlik boshqaruvi bor.", host: "ted.com" },
      { type: "video", url: "https://www.youtube.com/@GoogleDevelopers", title: "Google for Developers", desc: "Technical presentation va API/product terminology uchun real nutq manbasi.", host: "youtube.com" },
    ],
    project: { tag: "Listening evidence", title: "Three-accent meeting pack", desc: "Real audio asosida note, transcript correction, clarification va shadowing dalilini yig'ing.", features: ["3 audio source", "first-pass notes", "transcript corrections", "action summary", "shadowing recording"], rubric: ["Fact va inference aralashmagan.", "Action/owner/deadline aniq.", "Noma'lum joy taxmin qilinmay, clarificationga aylantirilgan."] },
    quiz: [
      { q: "Real meeting audio'sini birinchi marta tinglaganda asosiy maqsad nima?", a: ["Har so'zni tarjima qilish", "Gist, decision va actionni ushlash", "Transcriptni darhol ochish", "Accentni ko'chirish"], c: 1, w: "Birinchi pass umumiy ma'no va amaliy harakatlarni topish uchun.", level: "practical" },
      { q: "Speaker talabi noaniq bo'lsa nima qilasiz?", a: ["Taxmin qilib taskni boshlayman", "Professional clarification savoli beraman", "Xabarni e'tiborsiz qoldiraman", "Faqat translator ishlataman"], c: 1, w: "Noaniqlikni erta tasdiqlash xato deliveryning oldini oladi.", level: "scenario" },
    ],
    exercises: [
      { type: "listen", q: "Audio-style update: asosiy actionni toping.", say: "The tile API is stable again. Davron will verify the cache headers before tomorrow's release.", answers: ["Davron will verify the cache headers", "verify the cache headers"], lang: "en-US", why: "Listeningda kim nima qilishini ajrating." },
      { type: "speak", q: "Clarification so'rang.", say: "Could you clarify which regions and date range should be included in the report?", lang: "en-US", why: "Savol contextni aniqlaydi va noto'g'ri taxminni kamaytiradi." },
    ],
  },
  {
    zoom: "WriteLab",
    title: "Writing Feedback & Evidence Lab",
    sub: "Clear technical writing",
    coord: "Professional / Writing review",
    eyebrow: "13D / DRAFT, REVIEW, REVISION",
    mtitle: "Yozing, rubric bilan tekshiring, dalil qoldiring",
    lede: "Professional writing faqat grammatik emas. Reader <strong>nima bo'ldi, nima kerak, kim javobgar va qachon</strong>ligini bir o'qishda tushunishi kerak. Bu lab writingni draft → rubric → revision oqimida baholaydi.",
    doc: `<div class='prose'><h3>5 mezonli ichki rubric</h3><table class='gtable'><thead><tr><th>Mezon</th><th>0</th><th>1</th><th>2</th></tr></thead><tbody><tr><td>Clarity</td><td>maqsad noaniq</td><td>qisman aniq</td><td>birinchi o'qishda aniq</td></tr><tr><td>Structure</td><td>tarqoq</td><td>qisman tartibli</td><td>context → decision → action</td></tr><tr><td>Grammar & tone</td><td>ma'no buziladi</td><td>mayda xato bor</td><td>professional va tushunarli</td></tr><tr><td>Actionability</td><td>keyingi qadam yo'q</td><td>qisman bor</td><td>owner + deadline aniq</td></tr><tr><td>Technical accuracy</td><td>fact tekshirilmagan</td><td>noaniqlik bor</td><td>fact/limitation dalil bilan</td></tr></tbody></table><p><strong>8/10+</strong> — yuborishga tayyor. 8 dan past bo'lsa, faqat grammar emas, structure yoki missing actionni ham tuzating.</p><div class='callout'><div><p>AI reviewer, author emas</p><p>Birinchi draft mustaqil yoziladi. AI faqat clarity/grammar reviewer bo'lishi mumkin. Fact, metric va technical claimni siz manba yoki test bilan tekshirasiz.</p></div></div></div>`,
    code: [{ heading: { h: "Self-review sheet", p: "Draft va revision orasidagi o'zgarishni ko'rinadigan qiling." }, title: "writing-review.md", lang: "md", code: `# Writing review\n\n| Criterion | Score /2 | Evidence or change |\n| --- | ---: | --- |\n| Clarity | | |\n| Structure | | |\n| Grammar & tone | | |\n| Actionability | | |\n| Technical accuracy | | |\n\nFirst draft: <link>\nRevision: <link>\nReviewer / AI use disclosed: ...` }],
    tasks: [
      { id: "en-write-1", html: "Unseen vaziyat bo'yicha 120-180 so'zli technical email yozdim", crit: "context, impact, decision/request, owner va deadline bor; birinchi draft saqlangan" },
      { id: "en-write-2", html: "Draftni 5 mezonli rubric bilan baholadim", crit: "har mezon 0-2 ball, konkret evidence yoki change note bilan yozilgan" },
      { id: "en-write-3", html: "Reviewer yoki AI feedbackdan keyin revision qildim", crit: "AI ishlatilgan bo'lsa prompt va qabul/qilinmagan o'zgarishlar qayd etilgan; technical factlar mustaqil tekshirilgan" },
      { id: "en-write-4", html: "Bitta bug report va bitta async progress update yozdim", crit: "bug reportda reproduce/expected/actual/impact; update'da status/risk/owner/next step bor" },
      { id: "en-write-5", html: "Final writing packni assessment evidence uchun saqladim", crit: "prompt, first draft, rubric, revision va reviewer feedback bitta sharable linkda" },
    ],
    resources: [
      { type: "doc", url: "https://developers.google.com/tech-writing", title: "Google Technical Writing", desc: "Clarity, active voice va technical writing uchun rasmiy qo'llanma.", host: "developers.google.com" },
      { type: "doc", url: "https://www.writethedocs.org/guide/writing/beginners-guide-to-docs/", title: "Write the Docs guide", desc: "Technical documentationni reader-first yozish.", host: "writethedocs.org" },
      { type: "doc", url: "https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue", title: "GitHub issue guide", desc: "Issue va professional work item yozish formati.", host: "docs.github.com" },
    ],
    project: { tag: "Writing evidence", title: "Technical writing revision pack", desc: "Bitta email, bug report va progress update'ni draft-review-revision sifatida ko'rsating.", features: ["unseen prompt", "first draft", "5-score rubric", "revision", "feedback disclosure"], rubric: ["Reader keyingi actionni tushunadi.", "Factlar tekshirilgan.", "Revision faqat grammar emas, structure/clarityni ham yaxshilagan."] },
    quiz: [
      { q: "Professional progress updateda nima bo'lishi kerak?", a: ["Faqat 'working on it'", "status, risk, owner va next step", "Faqat uzun texnik detail", "Faqat emoji"], c: 1, w: "Async jamoa qaror va keyingi harakatni tez tushunishi kerak.", level: "scenario" },
      { q: "AI writing feedbackdan keyin nima majburiy?", a: ["Hammasini ko'rmasdan qabul qilish", "Fact va metricni mustaqil tekshirish", "First draftni o'chirish", "Reviewer nomini yashirish"], c: 1, w: "AI uslubni yaxshilashi mumkin, lekin technical truthni tasdiqlamaydi.", level: "practical" },
    ],
    exercises: [
      { type: "choice", q: "Qaysi status update actionabilityni ko'rsatadi?", options: ["The map is almost done.", "The API is ready; I will share the staging link by 15:00. The remaining risk is cache invalidation.", "There are some issues.", "Please check it."], correct: 1, why: "Status, owner, deadline va risk bitta aniq updatega birlashgan." },
      { type: "gap", q: "Please ___ the expected coordinate order before I update the API contract.", answers: ["confirm", "clarify"], why: "Professional writingda noaniq talabni tasdiqlash kerak." },
    ],
  },
  {
    zoom: "WorkLab",
    title: "Real Work English Lab",
    sub: "Six-week delivery sprint",
    coord: "Professional / Work simulation",
    eyebrow: "13E / SHIP, REVIEW, INTERVIEW",
    mtitle: "Ishdagi Englishni har hafta ishlab ko'ring",
    lede: "Tilni alohida o'rganib, keyin ishga olib o'tish qiyin. Bu labda har hafta real engineering vaziyati: <strong>issue, update, review, ADR, outreach va live interview</strong> bilan bitta portfolio pack quriladi.",
    doc: `<div class='prose'><h3>6 haftalik sprint</h3><div class='tree'>1-hafta  GitHub issue + clarification\n2-hafta  Async progress update + risk\n3-hafta  PR review comment + respectful disagreement\n4-hafta  ADR / architecture decision\n5-hafta  Cold outreach + discovery call prep\n6-hafta  15-minute mock interview + retrospective</div><h3>Qanday baholanadi?</h3><p>Har artefakt real loyihadan yoki aniq simulated scenario'dan bo'ladi. AI yordam bergan bo'lsa disclosure yoziladi. Reviewda “nice English” emas, <strong>tushunarli qaror va bajariladigan next step</strong> baholanadi.</p><div class='callout'><div><p>Portfolio natijasi</p><p>Sprint oxirida sizda GitHub/Notion/Drive'da share qilinadigan English professional communication pack bo'ladi. Uni recruiter yoki clientga yuborishdan oldin maxfiy mijoz ma'lumotlarini olib tashlang.</p></div></div></div>`,
    code: [{ heading: { h: "Weekly delivery log", p: "Kichik, tekshiriladigan ishlar orqali Englishni real deliveryga bog'lang." }, title: "work-english-log.md", lang: "md", code: `# Week 1 — Issue & clarification\nLink: ...\nWhat I wrote independently: ...\nFeedback received: ...\nRevision: ...\n\n# Week 2 — Async update\n...` }],
    tasks: [
      { id: "en-work-1", html: "GitHub issue va clarification comment yozdim", crit: "problem, reproduce/impact, acceptance criteria va bitta noaniqlashtiruvchi savol bor" },
      { id: "en-work-2", html: "Async progress update yozdim", crit: "status, completed work, risk, owner, deadline va next step aniq" },
      { id: "en-work-3", html: "PR review comment hamda respectful disagreement yozdim", crit: "claim, evidence, alternative va so'ralgan action bor; shaxsga emas kod/qarorga qaratilgan" },
      { id: "en-work-4", html: "Bitta architecture decision record yozdim", crit: "context, options, decision, trade-off va rollback/next action mavjud" },
      { id: "en-work-5", html: "Potential client yoki recruiter uchun cold outreach xati yozdim", crit: "generic emas; ularning muammosi, sizning relevant proof va past-friction call so'rovi bor" },
      { id: "en-work-6", html: "15 daqiqalik mock interview va retrospective qildim", crit: "recording yoki live witness, kamida 5 unseen follow-up va 3 improvement action saqlangan" },
    ],
    resources: [
      { type: "doc", url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests", title: "GitHub pull request reviews", desc: "Reviewni constructive va evidence-based yozish.", host: "docs.github.com" },
      { type: "doc", url: "https://adr.github.io/", title: "Architecture Decision Records", desc: "Qarorni context va trade-off bilan yozish amaliyoti.", host: "adr.github.io" },
      { type: "doc", url: "https://www.atlassian.com/blog/productivity/how-to-write-a-status-update", title: "Status update guide", desc: "Async status, risk va next stepni aniq yozish.", host: "atlassian.com" },
    ],
    project: { tag: "Career / Remote-ready", title: "English delivery communication pack", desc: "Remote jamoa yoki client bilan ishlashga tayyorligingizni isbotlaydigan 6 haftalik artefaktlar paketi.", features: ["issue + clarification", "async update", "PR review", "ADR", "cold outreach", "mock interview recording"], rubric: ["Har artefakt audience va maqsadga mos.", "Claimlar evidence bilan bog'langan.", "AI/tutor yordamidan foydalanish shaffof yozilgan.", "Maxfiy data redaction qilingan."] },
    quiz: [
      { q: "PR reviewda disagreementni qanday yozish professional?", a: ["Bu kod yomon", "Could we consider X? It reduces Y risk; the trade-off is Z.", "Buni o'zgartiring", "Men haqliman"], c: 1, w: "Evidence, alternativa va trade-off discussionni konstruktiv qiladi.", level: "scenario" },
      { q: "Cold outreach xatining eng muhim qismi nima?", a: ["Juda uzun biography", "Mijoz muammosi + relevant proof + kichik next step", "Faqat rate", "Generic salom"], c: 1, w: "Mijoz sizning unga aniq qanday foyda berishingizni tez ko'rishi kerak.", level: "practical" },
    ],
    exercises: [
      { type: "speak", q: "Mock interview yakunida professional savol bering.", say: "How do you measure success for this role in the first six months?", lang: "en-US", why: "Yaxshi savol ownership va business contextga qiziqishni ko'rsatadi." },
      { type: "choice", q: "Qaysi cold outreach aniqroq?", options: ["I need a job.", "I build fast WebGIS systems with MapLibre and PostGIS. I noticed your field teams work across multiple regions; would a 20-minute call next week be useful to discuss offline inspection workflows?", "Hello, please hire me.", "I know many technologies."], correct: 1, why: "Relevant problem, proof va past-friction next step bor." },
    ],
  },
];
