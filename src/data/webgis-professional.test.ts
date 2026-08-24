import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { COURSES, COURSE_GROUPS, loadCourseModules } from "./courses";

const ENHANCEMENT_IDS = ["g0", "s1", "py1", "py2", "cn1", "rs1", "ai1", "ops1", "d3", "f1"];

describe("WebGIS professional learning path", () => {
  it("positions one main career track, supporting skills, and personal development", () => {
    const groupedIds = COURSE_GROUPS.flatMap((group) => [...group.ids]);

    expect(COURSE_GROUPS[0]).toEqual({ label: "Main Career Track", ids: ["webgis"] });
    expect(COURSE_GROUPS[1].ids).toEqual([
      "frontend", "backend", "git", "telegram", "cybersecurity", "english", "prompting", "systemdesign", "founder",
    ]);
    expect(COURSE_GROUPS[2].ids).toEqual(["finance", "russian", "arabic"]);
    expect(new Set(groupedIds).size).toBe(COURSES.length);
    expect(new Set(groupedIds)).toEqual(new Set(COURSES.map((course) => course.id)));
    expect(COURSES.find((course) => course.id === "webgis")?.brandSub).toBe(
      "React TS / MapLibre / FastAPI / PostGIS / GDAL / GeoAI / Docker",
    );
  });

  it("keeps prerequisites, defense, flagship, and career in a coherent order", async () => {
    const modules = await loadCourseModules("webgis");
    const ids = modules.map((module) => module.zoom);

    expect(modules).toHaveLength(45);
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
    expect(ids.indexOf("GI1")).toBeGreaterThan(ids.indexOf("z31"));
    expect(ids.indexOf("GI1")).toBeLessThan(ids.indexOf("z32"));
    expect(ids.indexOf("FG")).toBeGreaterThan(ids.indexOf("z31"));
    expect(ids.indexOf("FG")).toBeLessThan(ids.indexOf("z32"));
  });

  it("keeps system design as a standalone supporting course without duplicating it in WebGIS", async () => {
    const webgis = await loadCourseModules("webgis");
    const systemDesign = await loadCourseModules("systemdesign");

    expect(webgis.some((module) => module.zoom === "sd1")).toBe(false);
    expect(systemDesign.map((module) => module.zoom)).toEqual([
      "SD0", "sd1", "SD-FE", "SD-BE", "SD-DB", "SD2", "SD-DIST", "SD-PERF", "SD3",
      "SD-SEC", "SD-DEL", "SD-REC", "SD-STYLE", "SD-GEO", "SDF",
    ]);
    expect(systemDesign.find((module) => module.zoom === "SDF")?.project?.assessment?.assessorRequired).toBe(true);
  });

  it("requires deep theory, failure drills, ADRs, and evidence in every system design module", async () => {
    const modules = await loadCourseModules("systemdesign");

    modules.forEach((module) => {
      expect(module.doc.length, `${module.zoom}: deep theory`).toBeGreaterThan(1_000);
      expect(module.code.length, `${module.zoom}: implementation + evidence examples`).toBeGreaterThanOrEqual(2);
      expect(module.tasks.length, `${module.zoom}: hands-on + failure work`).toBeGreaterThanOrEqual(6);
      expect(module.resources.length, `${module.zoom}: authoritative references`).toBeGreaterThanOrEqual(3);
      expect(module.project?.rubric?.length, `${module.zoom}: delivery rubric`).toBeGreaterThanOrEqual(5);
      expect(module.quiz.length, `${module.zoom}: scenario verification`).toBeGreaterThanOrEqual(2);
      expect(module.doc).toContain("failure lab");
      expect(module.doc).toContain("arxitektura qarori");
      expect(module.doc).toContain("labs/geopulse/docs/system-design-labs.md");
    });
  });

  it("ships a standalone, evidence-based technical founder academy", async () => {
    const modules = await loadCourseModules("founder");

    expect(modules.map((module) => module.zoom)).toEqual([
      "TF0", "TF1", "TF2", "TF3", "TF4", "TF5", "TF6", "TF7", "TF8", "TF9", "TF10", "TF11", "TF12", "TFF",
    ]);
    modules.forEach((module) => {
      expect(module.doc.length, `${module.zoom}: professional theory`).toBeGreaterThan(1_000);
      expect(module.code.length, `${module.zoom}: practical templates`).toBeGreaterThanOrEqual(2);
      expect(module.tasks.length, `${module.zoom}: evidence tasks`).toBeGreaterThanOrEqual(6);
      expect(module.resources.length, `${module.zoom}: authoritative resources`).toBeGreaterThanOrEqual(3);
      expect(module.project?.rubric?.length, `${module.zoom}: delivery rubric`).toBeGreaterThanOrEqual(5);
      expect(module.quiz.length, `${module.zoom}: scenario verification`).toBeGreaterThanOrEqual(2);
      expect(module.doc).toContain("failure");
      expect(module.doc).toContain("arxitektura qarori");
    });
    expect(modules.find((module) => module.zoom === "TFF")?.project?.assessment?.assessorRequired).toBe(true);
  });

  it("ships one executable GeoPulse milestone and review gate for every system design module", () => {
    const root = process.cwd();
    const guidePath = path.join(root, "labs/geopulse/docs/system-design-labs.md");
    const reviewPath = path.join(root, "labs/geopulse/docs/architecture-review-checklist.md");
    const guide = fs.readFileSync(guidePath, "utf8");

    expect(fs.existsSync(reviewPath)).toBe(true);
    ["SD0", "sd1", "SD-FE", "SD-BE", "SD-DB", "SD2", "SD-DIST", "SD-PERF", "SD3", "SD-SEC", "SD-DEL", "SD-REC", "SD-STYLE", "SD-GEO", "SDF"].forEach((id) => {
      expect(guide, `${id} milestone`).toContain(`| ${id} |`);
    });
    expect(guide).toContain("failure drill");
    expect(guide).toContain("ADR");
    expect(fs.existsSync(path.join(root, "labs/geopulse/docs/founder-labs.md"))).toBe(true);
    expect(fs.readFileSync(path.join(root, "labs/geopulse/docs/founder-labs.md"), "utf8")).toContain("TF11");
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

  it("covers the professional geospatial stack without promoting YOLO above GeoAI", async () => {
    const modules = await loadCourseModules("webgis");
    const content = modules.map((module) => JSON.stringify(module)).join("\n");

    [
      "MapLibre", "viewport", "PMTiles", "GeoParquet", "TiTiler", "xarray/rioxarray",
      "ST_DWithin", "geometry", "geography", "PyTorch", "land-cover", "change detection",
      "satellite embeddings", "spatial split", "model card", "OpenTelemetry", "Celery",
      "idempotency", "backup/restore", "licensing", "provenance", "ADR",
    ].forEach((term) => expect(content, term).toContain(term));

    const meta = COURSES.find((course) => course.id === "webgis");
    expect(meta?.brandSub).not.toContain("YOLO");
    expect(content).toContain("YOLO");
  });
});
