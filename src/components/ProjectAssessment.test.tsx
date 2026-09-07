import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ProjectAssessment } from "./ProjectAssessment";
import { loadCourseModules } from "../data/courses";
import { applyBackup } from "../lib/backup";

it("reloads mounted assessment after import without overwriting restored evidence", async () => {
  const modules = await loadCourseModules("english");
  const assessment = modules.find(m => m.project?.assessment)?.project?.assessment;
  expect(assessment).toBeDefined();
  render(<ProjectAssessment courseId="english" assessment={assessment!} />);
  const evidence = assessment!.evidence[0];
  act(() => applyBackup(JSON.stringify({ app: "SkillMap", version: 1, data: { english_assessment: {
    [assessment!.id]: { evidence: { [evidence.id]: "https://example.com/imported" }, reviewer: "Imported Reviewer" },
  } } })));
  expect(screen.getByDisplayValue("https://example.com/imported")).toBeInTheDocument();
  fireEvent.change(screen.getByDisplayValue("Imported Reviewer"), { target: { value: "Updated Reviewer" } });
  const saved = JSON.parse(localStorage.getItem("english_assessment")!)[assessment!.id];
  expect(saved.evidence[evidence.id]).toBe("https://example.com/imported");
  expect(saved.reviewer).toBe("Updated Reviewer");
});
