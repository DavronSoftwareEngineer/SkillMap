import type {
  AssessmentEvidence,
  AssessmentRecord,
  ProfessionalAssessment,
} from "../types";

export type AssessmentStatus =
  | "evidence-missing"
  | "ready"
  | "awaiting-review"
  | "revision"
  | "passed"
  | "critical-fail";

export interface AssessmentResult {
  status: AssessmentStatus;
  score: number;
  totalPoints: number;
  completedEvidence: number;
  requiredEvidence: number;
  evidenceComplete: boolean;
  scoresComplete: boolean;
  reviewComplete: boolean;
  floorFailures: string[];
  criticalFailure: boolean;
}

export function emptyAssessmentRecord(): AssessmentRecord {
  return {
    evidence: {},
    scores: {},
    criticalFails: {},
    reviewer: "",
    notes: "",
    defenseCompleted: false,
    submittedAt: null,
    reviewedAt: null,
  };
}

export function isEvidenceValid(item: AssessmentEvidence, rawValue: string | undefined): boolean {
  const value = rawValue?.trim() || "";
  if (!value) return false;
  if (item.kind === "url") {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }
  return value.length >= (item.minimumLength || 1);
}

export function calculateAssessment(
  assessment: ProfessionalAssessment,
  record: AssessmentRecord,
): AssessmentResult {
  const totalPoints = assessment.criteria.reduce((sum, criterion) => sum + criterion.points, 0);
  const requiredItems = assessment.evidence.filter((item) => item.required);
  const completedEvidence = requiredItems.filter((item) =>
    isEvidenceValid(item, record.evidence[item.id]),
  ).length;
  const evidenceComplete = completedEvidence === requiredItems.length;
  const scoresComplete = assessment.criteria.every((criterion) => {
    const score = record.scores[criterion.id];
    return Number.isFinite(score) && score >= 0 && score <= criterion.points;
  });
  const score = assessment.criteria.reduce(
    (sum, criterion) => sum + (record.scores[criterion.id] || 0),
    0,
  );
  const floorFailures = scoresComplete
    ? assessment.criteria
        .filter((criterion) => record.scores[criterion.id] < criterion.minimumPoints)
        .map((criterion) => criterion.id)
    : [];
  const criticalFailure = assessment.criticalFails.some(
    (item) => record.criticalFails[item.id],
  );
  const assessorComplete = !assessment.assessorRequired || record.reviewer.trim().length >= 3;
  const reviewComplete = Boolean(
    record.reviewedAt && scoresComplete && record.defenseCompleted && assessorComplete,
  );

  let status: AssessmentStatus;
  if (!evidenceComplete) status = "evidence-missing";
  else if (!record.submittedAt) status = "ready";
  else if (!reviewComplete) status = "awaiting-review";
  else if (criticalFailure) status = "critical-fail";
  else if (score >= assessment.passScore && floorFailures.length === 0) status = "passed";
  else status = "revision";

  return {
    status,
    score,
    totalPoints,
    completedEvidence,
    requiredEvidence: requiredItems.length,
    evidenceComplete,
    scoresComplete,
    reviewComplete,
    floorFailures,
    criticalFailure,
  };
}
