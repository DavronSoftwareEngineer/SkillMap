import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { OUTCOME_TASKS, OUTCOME_RUBRIC, OUTCOME_PROTOCOL } from '../data/outcome-tasks';
import { readRecords } from '../lib/record-storage';
import { saveJSONChecked, RESTORED_EVENT } from '../lib/storage';

type Phase = 'baseline' | 'final';
type Draft = Record<string, string>;
const phases: Phase[] = ['baseline', 'final'];

function reviewedScore(record: Draft | undefined): number | null {
  if (!record?.attempt?.trim() || !record.reviewer?.trim() || !record.reviewNotes?.trim()) return null;
  const values = Object.keys(OUTCOME_RUBRIC).map(id => record['score_' + id]);
  return values.every(v => /^[0-4]$/.test(v ?? '')) ? values.reduce((sum, v) => sum + Number(v), 0) : null;
}

function download(filename: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function LearnerOutcomes() {
  const { courseId } = useStore();
  const key = courseId + '_outcomes';
  const [phase, setPhase] = useState<Phase>('baseline');
  const [drafts, setDrafts] = useState(() => readRecords<Draft>(key).records);
  const baseline = useRef(drafts);
  const [status, setStatus] = useState('');
  const draft = drafts[phase] || {};
  const task = OUTCOME_TASKS[courseId]?.[phase === 'baseline' ? 0 : 1] || '';

  useEffect(() => {
    const restore = () => { const restored = readRecords<Draft>(key).records; baseline.current = restored; setDrafts(restored); setStatus('Zaxiradan tiklangan yozuvlar ochildi.'); };
    window.addEventListener(RESTORED_EVENT, restore);
    return () => window.removeEventListener(RESTORED_EVENT, restore);
  }, [key]);

  function update(field: string, value: string) {
    const source = readRecords<Draft>(key);
    const latest = source.records[phase] || {};
    const metadata = { task: latest.task || task, protocol: latest.protocol || OUTCOME_PROTOCOL, updatedAt: new Date().toISOString() };
    const entry = { ...draft, ...metadata, [field]: value };
    setDrafts(v => ({ ...v, [phase]: entry }));
    const original = baseline.current[phase] || {};
    const edits = Object.entries({ ...draft, [field]: value }).filter(([k, v]) => v !== original[k]);
    if (!source.writable || edits.some(([k, v]) => latest[k] !== original[k] && latest[k] !== v)) {
      setStatus('Yozuv saqlanmadi: manba buzilgan yoki boshqa tab yangilagan. Hozirgi yozuvlarni eksport qiling.');
      return;
    }
    const saved = { ...latest, ...Object.fromEntries(edits), ...metadata };
    if (saveJSONChecked(key, { ...source.records, [phase]: saved })) {
      baseline.current = { ...baseline.current, [phase]: saved };
      setDrafts(v => ({ ...v, [phase]: saved }));
      setStatus('Yozuv shu brauzerda saqlandi.');
    } else setStatus('Yozuv saqlanmadi; hozirgi yozuvlarni eksport qiling.');
  }

  const before = reviewedScore(drafts.baseline), after = reviewedScore(drafts.final);
  const paired = before !== null && after !== null && !!drafts.baseline?.participant?.trim() &&
    drafts.baseline.participant.trim() === drafts.final?.participant?.trim() &&
    drafts.baseline.protocol === OUTCOME_PROTOCOL && drafts.final.protocol === OUTCOME_PROTOCOL;
  const change = paired ? after! - before! : null;

  return <details className="outcome-panel">
    <summary>O‘quvchi natijasi va feedback — mahalliy qaydlar</summary>
    <section aria-label="O‘quvchi natijasi sinovi">
      <h3>O‘quvchi natijasi sinovi</h3>
      <p>Boshlang‘ich ish → o‘rganish → yangi shartdagi yakuniy ish → tashqi reviewer bahosi.</p>
      <p>Yozuvlar shu brauzerda saqlanadi va JSON zaxiraga kiradi. Eksport faylini reviewerga o‘zingiz bering, uning bahosi va izohini keyin qayd eting. Reviewer shaxsi va bahosi sayt tomonidan tasdiqlanmaydi.</p>
      <p>Har mezon 0–4: 0 — dalil yo‘q; 1 — katta xato/yordam; 2 — qisman; 3 — mustaqil to‘g‘ri; 4 — asoslangan va xato holati tekshirilgan. Jami 16 ball.</p>
      <button aria-pressed={phase === 'baseline'} onClick={() => setPhase('baseline')}>Boshlang‘ich ish</button>
      <button aria-pressed={phase === 'final'} onClick={() => setPhase('final')}>Yakuniy transfer</button>
      <h4>{phase === 'baseline' ? 'Boshlang‘ich topshiriq' : 'Yangi shartdagi topshiriq'}</h4>
      <p>{draft.task || task}</p>
      <p>Avval namunasiz urinib ko‘ring. Yordam ishlatsangiz belgilang. Ikki bosqich uchun bir xil ishtirokchi kodini kiriting; ism yoki boshqa shaxsiy ma’lumot shart emas.</p>
      <label>Ishtirokchi kodi<input value={draft.participant || ''} maxLength={100} onChange={e => update('participant', e.target.value)}/></label>
      <label>Urinish va izoh<textarea rows={5} maxLength={30000} value={draft.attempt || ''} onChange={e => update('attempt', e.target.value)}/></label>
      <label>Dalil havolasi<input type="url" value={draft.evidence || ''} maxLength={2000} onChange={e => update('evidence', e.target.value)}/></label>
      <label>Sinov guruhi (ixtiyoriy)<input value={draft.cohort || ''} maxLength={100} onChange={e => update('cohort', e.target.value)}/></label>
      <label>Ishlatilgan yordam<select value={draft.assistance || 'none'} onChange={e => update('assistance', e.target.value)}><option value="none">Yordamsiz</option><option value="notes">Dars yoki qaydlar</option><option value="ai">AI</option><option value="person">Boshqa odam</option></select></label>
      <label>Interfeysdan foydalanish qiyinligi<select value={draft.difficulty || '3'} onChange={e => update('difficulty', e.target.value)}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}{n === 1 ? ' — oson' : n === 5 ? ' — juda qiyin' : ''}</option>)}</select></label>
      <label>Qayerda tushunmay qoldingiz?<textarea maxLength={10000} value={draft.feedback || ''} onChange={e => update('feedback', e.target.value)}/></label>
      <fieldset><legend>Tashqi baholashni qo‘lda qayd qilish</legend>
        <label>Reviewer nomi yoki kodi<input value={draft.reviewer || ''} maxLength={100} onChange={e => update('reviewer', e.target.value)}/></label>
        {Object.entries(OUTCOME_RUBRIC).map(([id, label]) => <label key={id}>{label}<input type="number" min={0} max={4} step={1} value={draft['score_' + id] ?? ''} onChange={e => update('score_' + id, e.target.value)}/></label>)}
        <label>Reviewer izohi<textarea maxLength={10000} value={draft.reviewNotes || ''} onChange={e => update('reviewNotes', e.target.value)}/></label>
      </fieldset>
      {phases.map(p => <p key={p}>{p === 'baseline' ? 'Boshlang‘ich' : 'Yakuniy'} baho: {reviewedScore(drafts[p]) === null ? 'hali to‘liq qayd etilmagan' : reviewedScore(drafts[p]) + '/16 — qo‘lda kiritilgan, tasdiqlanmagan'}</p>)}
      {change !== null && <p><b>Qo‘lda qayd etilgan farq: {change > 0 ? '+' : ''}{change} ball / 16.</b> Vazifa, yordam va baholovchi farqlari natijaga ta’sir qiladi. Bu tasdiqlangan malaka yoki kurs samaradorligi isboti emas.</p>}
      <button onClick={() => download('skillmap-' + courseId + '-outcomes.json', {
        app: 'SkillMap', version: 1, course: courseId, exportedAt: new Date().toISOString(),
        provenance: 'Local editable records; reviewer identity and scores are not verified', rubric: OUTCOME_RUBRIC,
        data: { [key]: drafts },
      })}>Hozirgi yozuvlarni eksport qilish</button>
      <p>Bu faylni boshqa qurilmada “Tiklash import” orqali ochish mumkin. Import shu kursning mavjud natija yozuvlarini almashtiradi; avval zaxira eksport qiling. Sayt faylni reviewerga avtomatik yubormaydi.</p>
      <p role="status">{status}</p>
    </section>
  </details>;
}
