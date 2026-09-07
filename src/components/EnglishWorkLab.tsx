import { useEffect, useState } from "react";
import { loadJSON, RESTORED_EVENT, saveJSONChecked } from "../lib/storage";
import { exportLab, safeEvidenceUrl, WRITING_CRITERIA, writingResult } from "../lib/worklabs";
import type { LabRecord, LabRecords } from "../lib/worklabs";
import { AUDIO_LESSONS } from "../data/english-audio-library";
import "./EnglishWorkLab.css";

const KEY = "english_worklabs";
// Failed writes survive in-app navigation until export/retry or a page reload.
const unsaved = new Map<string, LabRecord>();
window.addEventListener(RESTORED_EVENT, () => unsaved.clear());
const SCENARIOS = [
  ["GitHub issue", "Tilelar ayrim hududlarda kechikmoqda. Repro, expected/actual, dalil, noma'lum holat va acceptance criteria yozing. O'lchanmagan latency raqamini o'ylab topmang."],
  ["Client progress update", "Raster import yakunlanmagan, chunki source faylda CRS noma'lum. Bajarilgan ish, blocker, mijozdan so'raladigan ma'lumot va keyingi update vaqtini yozing."],
  ["PR review", "PRdagi endpoint tenant bo'yicha filter qo'ymagan. Hurmatli review comment: risk, aniq o'zgarish va ikki tenant bilan isolation testini so'rang."],
  ["Architecture decision", "Ma'lumot oyiga yangilanadi, ayrim qatlamlar esa tahrirlanadi. PMTiles va Tegola tanlovi uchun context, ikkita variant, trade-off, decision va qayta ko'rish triggerini yozing."],
  ["Cold outreach", "Mapping platformasi bor kompaniyaga 100 so'zdan oshmagan xat yozing: kuzatilgan muammo, haqiqiy tajribangiz, bitta dalil va bosimsiz qisqa suhbat taklifi."],
  ["Mock interview", "15 daqiqa: 2 daqiqa tanishuv, 5 daqiqa loyiha, 5 daqiqa failure/trade-off, 3 daqiqa savollar. Faqat o'zingiz qilgan ishni da'vo qiling."],
];

function LabForm({ id, mode }: { id: string; mode: string }) {
  const [record, setRecord] = useState<LabRecord>(() => unsaved.get(id) || loadJSON<LabRecords>(KEY, {})[id] || {});
  const [status, setStatus] = useState(unsaved.has(id) ? "Saqlanmadi — matnni eksport qiling" : "");
  useEffect(() => {
    const reload = () => { setRecord(loadJSON<LabRecords>(KEY, {})[id] || {}); setStatus("Zaxiradan yangilandi"); };
    window.addEventListener(RESTORED_EVENT, reload);
    return () => window.removeEventListener(RESTORED_EVENT, reload);
  }, [id]);
  useEffect(() => {
    if (status !== "Saqlanmagan o'zgarishlar" && status !== "Saqlanmadi — matnni eksport qiling") return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);
  function update(key: string, value: string) {
    const next = { ...record, [key]: value };
    setRecord(next);
    // Merge the latest persisted records so other labs are not overwritten.
    const ok = saveJSONChecked(KEY, { ...loadJSON<LabRecords>(KEY, {}), [id]: next });
    if (ok) unsaved.delete(id); else unsaved.set(id, next);
    setStatus(ok ? "Shu brauzerda saqlandi" : "Saqlanmadi — matnni eksport qiling");
  }
  const area = (key: string, label: string, hint?: string) => <label className="lab-field" key={key}>{label}
    {hint && <small>{hint}</small>}<textarea rows={4} maxLength={30000} value={record[key] || ""} onChange={e => update(key, e.target.value)} /></label>;
  const result = writingResult(record);
  return <div className="lab-form">
    <p className="lab-disclosure">Self-review va qo'lda kiritilgan feedback. AI avtomatik baholamaydi; reviewer shaxsi tasdiqlanmaydi. Maxfiy mijoz ma'lumotlarini kiritmang.</p>
    {mode === "AudioLab" ? <>
      {area("duration", "Audio davomiyligi va tinglangan qism", "Playerdagi mm:ss va siz tinglagan interval")}
      {area("firstListen", "Birinchi tinglash: javoblar", "Transcriptni ochmasdan savollarga javob bering.")}
      {area("corrections", "Transcript bilan tekshirish", "Xato tushungan joy, vaqt belgisi va tuzatilgan ma'no")}
      {area("actionNote", "Action note", "Decision / owner / deadline / unknown / clarification")}
    </> : <>
      {area("draft", "Birinchi draft", "Mustaqil yozing; tuzatilgan variantni pastdagi alohida maydonda saqlang.")}
      <fieldset><legend>Writing rubric: har mezon 0–2</legend>
        {WRITING_CRITERIA.map((criterion, i) => <div className="lab-criterion" key={criterion}>
          <label>{criterion}<select value={record[`score${i}`] ?? ""} onChange={e => update(`score${i}`, e.target.value)}>
            <option value="">Baholanmagan</option><option value="0">0 — yetishmaydi</option><option value="1">1 — tuzatish kerak</option><option value="2">2 — dalil bilan aniq</option>
          </select></label>
          {area(`reason${i}`, `${criterion}: dalil yoki izoh`)}
        </div>)}
      </fieldset>
      {area("factCheck", "Faktlarni tekshirish dalili", "Manba, test yoki o'lchov. AI aytgani mustaqil dalil emas.")}
      {area("revision", "Tuzatilgan variant")}
      <p role="status">{result.total}/10 — {result.ready ? "Self-review bo'yicha tayyor (mustaqil tasdiq emas)" : "Qayta ishlash kerak"}. Texnik to'g'rilik 2/2, barcha mezon izohi, draft, revision va tekshirish dalili majburiy.</p>
    </>}
    <fieldset><legend>Speaking evidence / urinishlarni taqqoslash</legend>
      <label className="lab-field">Joriy audio/video yozuv havolasi<input type="url" value={record.recording || ""} onChange={e => update("recording", e.target.value)} aria-invalid={!safeEvidenceUrl(record.recording || "")} /></label>
      {!safeEvidenceUrl(record.recording || "") && <p role="alert">Faqat to'liq http/https havola kiriting.</p>}
      <p>Yozuvni telefon yoki kompyuterda yozib, ruxsati cheklangan saqlash xizmatidagi havolasini kiriting. Audio faylining o'zi SkillMap'ga yuklanmaydi.</p>
      {area("previousAttempt", "Oldingi urinish: havola va sana")}
      {area("selfReview", "Speaking self-review", "Clarity, pace, pronunciation: vaqt belgisi bilan 3 misol")}
      {area("comparison", "Oldingi urinishdan nima yaxshilandi?")}
      {area("reviewer", "Reviewer ismi va review sanasi")}
      {area("feedback", "Assessor feedback", "Nima yaxshi, nima tuzatiladi va keyingi mashq")}
      {area("aiDisclosure", "AI yoki tutor yordami", "Qayerda ishlatildi, qaysi faktlar mustaqil tekshirildi?")}
    </fieldset>
    <div className="lab-actions"><button onClick={() => exportLab(record, id)}>Matnni Markdown eksport qilish</button>{status.startsWith("Saqlanmadi") && <button onClick={() => update("retriedAt", new Date().toISOString())}>Qayta saqlash</button>}<span role="status">{status}</span></div>
    <p>Yozuvlar faqat shu brauzerda. Qurilma almashtirish uchun umumiy Backup'dan foydalaning. Eksportdan oldin maxfiy ma'lumotlarni olib tashlang.</p>
  </div>;
}

export default function EnglishWorkLab({ mode }: { mode: string }) {
  const [selection, setSelection] = useState("0");
  const index = Number(selection);
  const lesson = AUDIO_LESSONS[index] || AUDIO_LESSONS[0];
  const id = mode === "AudioLab" ? lesson.id : mode === "WorkLab" ? `week-${index + 1}` : "writing-main";
  return <section className="english-worklab" aria-label="English amaliy laboratoriya">
    <h3>Amaliy laboratoriya</h3>
    {mode === "AudioLab" ? <>
      <label className="lab-field">Tinglash darsi<select value={selection} onChange={e => setSelection(e.target.value)}>{AUDIO_LESSONS.map((l, i) => <option key={l.id} value={i}>{l.title}</option>)}</select></label>
      <article className="lab-source"><h4>{lesson.title}</h4><p>{lesson.source} · {lesson.level}</p><p>{lesson.accent}</p><p>{lesson.practice}</p>
        <a href={lesson.url} target="_blank" rel="noopener noreferrer">Audio/video va transcriptni manbada ochish</a>
        <p>Audio va transcript qayta joylashtirilmagan. Internet kerak; manba ochilmasa boshqa darsni tanlang. Bu uch dars to'liq uch-accent kutubxonasi emas.</p>
        <ol>{lesson.questions.map(q => <li key={q}>{q}</li>)}</ol><details key={lesson.id}><summary>Tinglagandan keyin tekshirish</summary><p>{lesson.check}</p></details>
      </article>
    </> : mode === "WorkLab" ? <>
      <label className="lab-field">Haftalik vazifa<select value={selection} onChange={e => setSelection(e.target.value)}>{SCENARIOS.map(([title], i) => <option key={title} value={i}>{i + 1}-hafta: {title}</option>)}</select></label>
      <p>{SCENARIOS[index]?.[1]}</p>
    </> : <p>Scenario: mijozga raster import kechikishi haqida 120–180 so'zli email yozing. Sabab: CRS noma'lum. Holat, kerakli ma'lumot, keyingi qadam va keyingi xabar vaqtini aniq ayting. Taxminiy muddatni kafolat sifatida bermang.</p>}
    <LabForm key={id} id={id} mode={mode} />
  </section>;
}
