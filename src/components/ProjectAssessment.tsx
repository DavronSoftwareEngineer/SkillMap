import { useMemo, useState } from "react";
import { useToast } from "../store";
import { calculateAssessment, emptyAssessmentRecord, isEvidenceValid } from "../lib/assessment";
import { loadJSON, saveJSON } from "../lib/storage";
import type { AssessmentRecord, ProfessionalAssessment } from "../types";

type AssessmentRecords = Record<string, AssessmentRecord>;

const STATUS_COPY = {
  "evidence-missing": {
    label: "Dalillar yetishmaydi",
    detail: "Barcha majburiy artefaktlarni yaroqli havola bilan kiriting.",
  },
  ready: {
    label: "Topshirishga tayyor",
    detail: "Dalil paketi to'liq. Uni baholash uchun tayyor deb belgilang.",
  },
  "awaiting-review": {
    label: "Tashqi baholash kutilmoqda",
    detail: "Reviewer mezonlarni baholashi va jonli himoyani tasdiqlashi kerak.",
  },
  revision: {
    label: "Qayta ishlash kerak",
    detail: "Umumiy ball yoki kamida bitta mezon minimumi bajarilmadi.",
  },
  passed: {
    label: "Professional assessment o'tdi",
    detail: "Ball, mezon minimumlari, jonli himoya va integrity gate bajarildi.",
  },
  "critical-fail": {
    label: "Critical fail",
    detail: "Kritik shart buzilgan. Ball yetarli bo'lsa ham assessment o'tmaydi.",
  },
} as const;

function normalizeRecord(value: AssessmentRecord | undefined): AssessmentRecord {
  const empty = emptyAssessmentRecord();
  return {
    ...empty,
    ...value,
    evidence: value?.evidence || {},
    scores: value?.scores || {},
    criticalFails: value?.criticalFails || {},
  };
}

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function ProjectAssessment({
  courseId,
  assessment,
}: {
  courseId: string;
  assessment: ProfessionalAssessment;
}) {
  const toast = useToast();
  const storageKey = `${courseId}_assessment`;
  const [records, setRecords] = useState<AssessmentRecords>(() =>
    loadJSON<AssessmentRecords>(storageKey, {}),
  );
  const record = normalizeRecord(records[assessment.id]);
  const result = useMemo(
    () => calculateAssessment(assessment, record),
    [assessment, record],
  );
  const statusCopy = STATUS_COPY[result.status];

  const updateRecord = (updater: (current: AssessmentRecord) => AssessmentRecord) => {
    setRecords((currentRecords) => {
      const nextRecord = updater(normalizeRecord(currentRecords[assessment.id]));
      const nextRecords = { ...currentRecords, [assessment.id]: nextRecord };
      saveJSON(storageKey, nextRecords);
      return nextRecords;
    });
  };

  const updateEvidence = (id: string, value: string) => {
    updateRecord((current) => ({
      ...current,
      evidence: { ...current.evidence, [id]: value },
      submittedAt: null,
      reviewedAt: null,
    }));
  };

  const updateScore = (id: string, rawValue: string, maximum: number) => {
    updateRecord((current) => {
      const scores = { ...current.scores };
      if (rawValue === "") delete scores[id];
      else scores[id] = Math.min(maximum, Math.max(0, Number(rawValue)));
      return { ...current, scores, reviewedAt: null };
    });
  };

  const markSubmitted = () => {
    if (!result.evidenceComplete) {
      toast("Avval barcha majburiy dalillarni to'ldiring");
      return;
    }
    updateRecord((current) => ({
      ...current,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
    }));
    toast("Dalil paketi baholashga tayyorlandi");
  };

  const reviewerReady =
    (!assessment.assessorRequired || record.reviewer.trim().length >= 3) &&
    record.defenseCompleted &&
    result.scoresComplete &&
    Boolean(record.submittedAt);

  const finalizeReview = () => {
    if (!reviewerReady) {
      toast("Reviewer, barcha ballar va jonli himoya tasdig'i talab qilinadi");
      return;
    }
    updateRecord((current) => ({ ...current, reviewedAt: new Date().toISOString() }));
    toast("Professional baholash yakunlandi");
  };

  return (
    <section className="assessment" aria-labelledby={`${assessment.id}-title`}>
      <header className="assessment-head">
        <div>
          <span className="assessment-kicker">PROFESSIONAL ASSESSMENT / {assessment.version}</span>
          <h3 id={`${assessment.id}-title`}>{assessment.title}</h3>
          <p>{assessment.summary}</p>
        </div>
        <div className="assessment-metrics" aria-label="Baholash chegaralari">
          <span><b>{result.totalPoints}</b><small>jami ball</small></span>
          <span><b>{assessment.passScore}</b><small>o'tish bali</small></span>
          <span><b>{assessment.criteria.length}</b><small>mezon</small></span>
        </div>
      </header>

      <div className={`assessment-status ${result.status}`} role="status">
        <div>
          <span>Joriy holat</span>
          <b>{statusCopy.label}</b>
          <p>{statusCopy.detail}</p>
        </div>
        <div className="assessment-score">
          <b>{result.score}</b>
          <span>/ {result.totalPoints}</span>
        </div>
      </div>

      <section className="assessment-section" aria-labelledby={`${assessment.id}-criteria`}>
        <div className="assessment-section-head">
          <div>
            <span>01</span>
            <h4 id={`${assessment.id}-criteria`}>Baholash mezonlari</h4>
          </div>
          <p>Har bir mezonning o'z minimumi bor; faqat umumiy ball yetarli emas.</p>
        </div>
        <div className="criteria-table">
          {assessment.criteria.map((criterion) => (
            <article className="criterion-row" key={criterion.id}>
              <div className="criterion-points">
                <b>{criterion.points}</b>
                <span>min {criterion.minimumPoints}</span>
              </div>
              <div className="criterion-copy">
                <h5>{criterion.title}</h5>
                <p>{criterion.description}</p>
                <ul>
                  {criterion.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)}
                </ul>
              </div>
              <div className="criterion-evidence">
                <span>Dalillar</span>
                {criterion.evidence.map((evidenceId) => {
                  const evidence = assessment.evidence.find((item) => item.id === evidenceId);
                  return evidence ? <small key={evidenceId}>{evidence.label}</small> : null;
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="assessment-section" aria-labelledby={`${assessment.id}-evidence`}>
        <div className="assessment-section-head">
          <div>
            <span>02</span>
            <h4 id={`${assessment.id}-evidence`}>Dalil paketi</h4>
          </div>
          <p>{result.completedEvidence}/{result.requiredEvidence} majburiy dalil yaroqli</p>
        </div>
        <progress
          className="evidence-progress"
          max={result.requiredEvidence || 1}
          value={result.completedEvidence}
        />
        <div className="evidence-fields">
          {assessment.evidence.map((item) => {
            const value = record.evidence[item.id] || "";
            const invalid = value.length > 0 && !isEvidenceValid(item, value);
            return (
              <label className={`evidence-field${invalid ? " invalid" : ""}`} key={item.id}>
                <span>
                  <b>{item.label}{item.required ? " *" : ""}</b>
                  <small>{item.description}</small>
                </span>
                {item.kind === "url" ? (
                  <input
                    type="url"
                    value={value}
                    placeholder={item.placeholder || "https://"}
                    aria-invalid={invalid}
                    onChange={(event) => updateEvidence(item.id, event.currentTarget.value)}
                  />
                ) : (
                  <textarea
                    value={value}
                    placeholder={item.placeholder}
                    aria-invalid={invalid}
                    onChange={(event) => updateEvidence(item.id, event.currentTarget.value)}
                  />
                )}
                {invalid && <em>Yaroqli {item.kind === "url" ? "http(s) havola" : "matn"} kiriting.</em>}
              </label>
            );
          })}
        </div>
        <div className="assessment-action-row">
          <button type="button" onClick={markSubmitted} disabled={!result.evidenceComplete || Boolean(record.submittedAt)}>
            {record.submittedAt ? `Tayyorlangan: ${formatDate(record.submittedAt)}` : "Baholashga tayyor deb belgilash"}
          </button>
          <span>Dalil o'zgarsa, avvalgi tasdiq va baholash avtomatik bekor qilinadi.</span>
        </div>
      </section>

      <section className="assessment-section assessment-gates" aria-labelledby={`${assessment.id}-gates`}>
        <div className="assessment-section-head">
          <div>
            <span>03</span>
            <h4 id={`${assessment.id}-gates`}>Critical-fail gate</h4>
          </div>
          <p>Quyidagilardan bittasi tasdiqlansa, umumiy balldan qat'i nazar assessment o'tmaydi.</p>
        </div>
        <div className="critical-list">
          {assessment.criticalFails.map((item) => (
            <div key={item.id}>
              <b>{item.title}</b>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="assessment-section" aria-labelledby={`${assessment.id}-defense`}>
        <div className="assessment-section-head">
          <div>
            <span>04</span>
            <h4 id={`${assessment.id}-defense`}>Jonli himoya</h4>
          </div>
          <p>{assessment.defense.durationMinutes} daqiqa himoya + {assessment.defense.liveChangeMinutes} daqiqa tasodifiy o'zgarish</p>
        </div>
        <div className="defense-grid">
          <div>
            <h5>Format</h5>
            <ol>{assessment.defense.format.map((item) => <li key={item}>{item}</li>)}</ol>
          </div>
          <div>
            <h5>Savol namunalari</h5>
            <ol>{assessment.defense.questions.map((item) => <li key={item}>{item}</li>)}</ol>
          </div>
        </div>
      </section>

      <details className="review-panel">
        <summary>
          <span>Tashqi baholovchi paneli</span>
          <b>{record.reviewedAt ? `Yakunlangan: ${formatDate(record.reviewedAt)}` : "Baholanmagan"}</b>
        </summary>
        <div className="review-body">
          <label className="reviewer-field">
            <span>Reviewer ismi va roli</span>
            <input
              value={record.reviewer}
              placeholder="Masalan: Senior GIS Engineer, kompaniya"
              onChange={(event) => updateRecord((current) => ({
                ...current,
                reviewer: event.currentTarget.value,
                reviewedAt: null,
              }))}
            />
          </label>

          <div className="score-sheet">
            {assessment.criteria.map((criterion) => (
              <label key={criterion.id}>
                <span>
                  <b>{criterion.title}</b>
                  <small>Minimum {criterion.minimumPoints}, maksimum {criterion.points}</small>
                </span>
                <input
                  type="number"
                  min="0"
                  max={criterion.points}
                  value={record.scores[criterion.id] ?? ""}
                  onChange={(event) => updateScore(criterion.id, event.currentTarget.value, criterion.points)}
                />
              </label>
            ))}
          </div>

          <fieldset className="critical-checks">
            <legend>Critical-fail tekshiruvi</legend>
            {assessment.criticalFails.map((item) => (
              <label key={item.id}>
                <input
                  type="checkbox"
                  checked={Boolean(record.criticalFails[item.id])}
                  onChange={(event) => updateRecord((current) => ({
                    ...current,
                    criticalFails: { ...current.criticalFails, [item.id]: event.currentTarget.checked },
                    reviewedAt: null,
                  }))}
                />
                <span><b>{item.title}</b><small>{item.description}</small></span>
              </label>
            ))}
          </fieldset>

          <label className="defense-check">
            <input
              type="checkbox"
              checked={record.defenseCompleted}
              onChange={(event) => updateRecord((current) => ({
                ...current,
                defenseCompleted: event.currentTarget.checked,
                reviewedAt: null,
              }))}
            />
            <span><b>Jonli himoya o'tkazildi</b><small>Demo, savol-javob va tasodifiy o'zgarish reviewer oldida bajarildi.</small></span>
          </label>

          <label className="review-notes">
            <span>Reviewer xulosasi</span>
            <textarea
              value={record.notes}
              placeholder="Kuchli tomonlar, kamchiliklar va qayta topshirish talablari"
              onChange={(event) => updateRecord((current) => ({ ...current, notes: event.currentTarget.value }))}
            />
          </label>

          {result.floorFailures.length > 0 && (
            <p className="review-warning">Minimum bajarilmagan mezonlar: {result.floorFailures.join(", ")}</p>
          )}
          <div className="review-footer">
            <output>{result.score}/{result.totalPoints} ball</output>
            <button type="button" onClick={finalizeReview} disabled={!reviewerReady || Boolean(record.reviewedAt)}>
              {record.reviewedAt ? "Baholash yakunlangan" : "Baholashni yakunlash"}
            </button>
          </div>
        </div>
      </details>
    </section>
  );
}
