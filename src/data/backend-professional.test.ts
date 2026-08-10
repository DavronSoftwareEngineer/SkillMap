import { describe, expect, it } from "vitest";

import { loadCourseModules } from "./courses";

describe("Backend supporting-skill path", () => {
  it("adds platform and reliability work without changing core module IDs", async () => {
    const modules = await loadCourseModules("backend");
    const ids = modules.map((module) => module.zoom);

    expect(ids).toContain("BE0");
    expect(ids).toContain("BE13");
    expect(ids).toContain("BX1");
    expect(ids).toContain("BX2");
    expect(ids.indexOf("BX1")).toBe(ids.indexOf("BE0") + 1);
    expect(ids.indexOf("BX2")).toBe(ids.indexOf("BE10") + 1);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires production evidence in the standalone backend work", async () => {
    const modules = await loadCourseModules("backend");
    const content = modules.map((module) => JSON.stringify(module)).join("\n");

    ["ADR", "idempotency", "OpenTelemetry", "backup/restore", "Node.js + TypeScript"].forEach(
      (term) => expect(content, term).toContain(term),
    );
  });

  it("keeps the standalone Node.js capstone primary", async () => {
    const modules = await loadCourseModules("backend");
    const stackDecision = modules.find((module) => module.zoom === "BX1");
    expect(stackDecision?.lede).toContain("Node.js + TypeScript");
  });
});
