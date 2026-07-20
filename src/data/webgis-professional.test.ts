import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { loadCourseModules } from "./courses";

const ENHANCEMENT_IDS = ["g0", "s1", "py1", "py2", "cn1", "rs1", "ai1", "ops1", "d3", "f1"];

describe("WebGIS professional learning path", () => {
  it("keeps prerequisites, defense, flagship, and career in a coherent order", async () => {
    const modules = await loadCourseModules("webgis");
    const ids = modules.map((module) => module.zoom);

    expect(modules).toHaveLength(44);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.indexOf("g0")).toBeGreaterThan(ids.indexOf("z0"));
    expect(ids.indexOf("s1")).toBeGreaterThan(ids.indexOf("z1"));
    expect(ids.indexOf("py1")).toBeGreaterThan(ids.indexOf("z3"));
    expect(ids.indexOf("py2")).toBeGreaterThan(ids.indexOf("py1"));
    expect(ids.indexOf("cn1")).toBeGreaterThan(ids.indexOf("z8"));
    expect(ids.indexOf("rs1")).toBeGreaterThan(ids.indexOf("z15"));
    expect(ids.indexOf("ai1")).toBeGreaterThan(ids.indexOf("z18"));
    expect(ids.indexOf("d3")).toBeGreaterThan(ids.indexOf("z29"));
    expect(ids.indexOf("f1")).toBeGreaterThan(ids.indexOf("z30"));
    expect(ids.indexOf("FG")).toBeGreaterThan(ids.indexOf("z31"));
    expect(ids.indexOf("FG")).toBeLessThan(ids.indexOf("z32"));
  });

  it("requires substantial evidence in every new module", async () => {
    const modules = await loadCourseModules("webgis");

    ENHANCEMENT_IDS.forEach((id) => {
      const module = modules.find((item) => item.zoom === id);
      expect(module, `${id} exists`).toBeDefined();
      expect(module!.doc.length, `${id} theory depth`).toBeGreaterThan(1000);
      expect(module!.code.length, `${id} code examples`).toBeGreaterThanOrEqual(2);
      expect(module!.tasks.length, `${id} practical tasks`).toBeGreaterThanOrEqual(5);
      expect(module!.resources.length, `${id} authoritative resources`).toBeGreaterThanOrEqual(3);
      expect(module!.project?.rubric?.length, `${id} project rubric`).toBeGreaterThanOrEqual(5);
      expect(module!.quiz.length, `${id} quiz`).toBeGreaterThanOrEqual(2);
    });
  });

  it("keeps the roadmap, encoding, and executable lab from regressing", () => {
    const root = process.cwd();
    const core = fs.readFileSync(path.join(root, "src/data/webgis.json"), "utf8");
    const roadmap = fs.readFileSync(path.join(root, "docs/flagship-geospatial-roadmap.md"), "utf8");
    const labPackage = JSON.parse(
      fs.readFileSync(path.join(root, "labs/geopulse/frontend/package.json"), "utf8"),
    ) as { devDependencies: Record<string, string> };
    const mapView = fs.readFileSync(
      path.join(root, "labs/geopulse/frontend/src/MapView.tsx"),
      "utf8",
    );

    expect(core).not.toMatch(/[\u0400-\u04ff]/);
    expect(roadmap).toContain("Python / FastAPI API");
    expect(roadmap).not.toContain("Node.js / TypeScript API");
    expect(Number.parseInt(labPackage.devDependencies.vite, 10)).toBeGreaterThanOrEqual(8);
    expect(Number.parseInt(labPackage.devDependencies.vitest, 10)).toBeGreaterThanOrEqual(4);
    expect(mapView).toContain("https://tiles.openfreemap.org/styles/liberty");

    [
      "labs/geopulse/README.md",
      "labs/geopulse/compose.yaml",
      "labs/geopulse/database/001_init.sql",
      "labs/geopulse/api/app/main.py",
      "labs/geopulse/api/tests/test_bbox.py",
      "labs/geopulse/frontend/src/MapView.tsx",
      "labs/geopulse/scripts/smoke-test.sh",
      "labs/geopulse/docs/evidence-checklist.md",
      ".github/workflows/geopulse-lab.yml",
    ].forEach((relativePath) => {
      expect(fs.existsSync(path.join(root, relativePath)), relativePath).toBe(true);
    });
  });
});
