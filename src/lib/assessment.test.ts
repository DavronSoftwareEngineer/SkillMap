import { describe, expect, it } from "vitest";
import type { ProfessionalAssessment } from "../types";
import {
  calculateAssessment,
  emptyAssessmentRecord,
  isEvidenceValid,
} from "./assessment";

const assessment: ProfessionalAssessment = {
  id: "test-assessment",
  version: "1.0",
  title: "Test assessment",
  summary: "Test",
  passScore: 80,
  assessorRequired: true,
  criteria: [
    {
      id: "build",
      title: "Build",
      description: "Build quality",
      points: 60,
      minimumPoints: 30,
      indicators: ["Ishlaydi"],
      evidence: ["repo"],
    },
    {
      id: "ops",
      title: "Operations",
      description: "Production quality",
      points: 40,
      minimumPoints: 20,
      indicators: ["Deploy qilingan"],
      evidence: ["demo"],
    },
  ],
  evidence: [
    { id: "repo", label: "Repo", description: "Source", kind: "url", required: true },
    { id: "demo", label: "Demo", description: "Deploy", kind: "url", required: true },
  ],
  criticalFails: [
    { id: "secret", title: "Secret", description: "Secret oshkor qilingan" },
  ],
  defense: { durationMinutes: 30, liveChangeMinutes: 10, format: ["Demo"], questions: ["Nega?"] },
};

describe("professional assessment", () => {
  it("faqat http(s) evidence URLni qabul qiladi", () => {
    const item = assessment.evidence[0];
    expect(isEvidenceValid(item, "github.com/acme/repo")).toBe(false);
    expect(isEvidenceValid(item, "https://github.com/acme/repo")).toBe(true);
  });

  it("dalillar bo'lmasa tayyor deb hisoblamaydi", () => {
    const result = calculateAssessment(assessment, emptyAssessmentRecord());
    expect(result.status).toBe("evidence-missing");
    expect(result.completedEvidence).toBe(0);
  });

  it("80 ballning o'zi jonli himoyasiz yetarli emas", () => {
    const record = {
      ...emptyAssessmentRecord(),
      evidence: { repo: "https://github.com/acme/repo", demo: "https://demo.example.com" },
      scores: { build: 50, ops: 30 },
      reviewer: "Senior reviewer",
      submittedAt: "2026-07-10T10:00:00.000Z",
    };
    expect(calculateAssessment(assessment, record).status).toBe("awaiting-review");
  });

  it("jami o'tish bali bo'lsa ham mezon minimumini tekshiradi", () => {
    const record = {
      ...emptyAssessmentRecord(),
      evidence: { repo: "https://github.com/acme/repo", demo: "https://demo.example.com" },
      scores: { build: 60, ops: 19 },
      reviewer: "Senior reviewer",
      defenseCompleted: true,
      submittedAt: "2026-07-10T10:00:00.000Z",
      reviewedAt: "2026-07-10T11:00:00.000Z",
    };
    const result = calculateAssessment(assessment, record);
    expect(result.status).toBe("revision");
    expect(result.floorFailures).toEqual(["ops"]);
  });

  it("critical fail o'tish natijasini bekor qiladi", () => {
    const record = {
      ...emptyAssessmentRecord(),
      evidence: { repo: "https://github.com/acme/repo", demo: "https://demo.example.com" },
      scores: { build: 55, ops: 35 },
      criticalFails: { secret: true },
      reviewer: "Senior reviewer",
      defenseCompleted: true,
      submittedAt: "2026-07-10T10:00:00.000Z",
      reviewedAt: "2026-07-10T11:00:00.000Z",
    };
    expect(calculateAssessment(assessment, record).status).toBe("critical-fail");
  });

  it("barcha gate bajarilganda o'tadi", () => {
    const record = {
      ...emptyAssessmentRecord(),
      evidence: { repo: "https://github.com/acme/repo", demo: "https://demo.example.com" },
      scores: { build: 50, ops: 35 },
      reviewer: "Senior reviewer",
      defenseCompleted: true,
      submittedAt: "2026-07-10T10:00:00.000Z",
      reviewedAt: "2026-07-10T11:00:00.000Z",
    };
    expect(calculateAssessment(assessment, record).status).toBe("passed");
  });
});
