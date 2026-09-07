import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyBackup, RECOVERY_KEY } from "./backup";
import { RESTORED_EVENT, saveJSONChecked, STORAGE_ERROR_EVENT } from "./storage";

const payload = (data: unknown, version = 1) => JSON.stringify({ app: "SkillMap", version, data });
beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());
describe("safe backup restore", () => {
  it.each([
    { myacademy_streak: null }, { english_srs: { word: null } },
    { english_quiz: { A0: { best: 8, total: 3 } } }, { english_progress: [] },
    { active_course: "unknown" }, { english_assessment: { final: { evidence: { repo: 42 } } } },
    { english_worklabs: { draft: { text: null } } },
  ])("rejects malformed values before writes: %j", data => {
    localStorage.setItem("english_progress", '{"old":true}');
    const spy = vi.spyOn(Storage.prototype, "setItem");
    expect(() => applyBackup(payload({ english_progress: { new: true }, ...data }))).toThrow();
    expect(spy).not.toHaveBeenCalled();
    expect(localStorage.getItem("english_progress")).toBe('{"old":true}');
  });
  it("rejects unsupported versions and null root", () => {
    expect(() => applyBackup(payload({}, 2))).toThrow();
    expect(() => applyBackup(payload(null))).toThrow();
  });
  it("rolls back a partially written backup and retains recovery", () => {
    localStorage.setItem("english_progress", '{"old":true}');
    const original = Storage.prototype.setItem;
    let failed = false;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      if (key === "english_quiz" && !failed) { failed = true; throw new Error("quota"); }
      original.call(this, key, value);
    });
    expect(() => applyBackup(payload({ english_progress: { new: true }, english_quiz: {} }))).toThrow(/qaytarildi/);
    expect(localStorage.getItem("english_progress")).toBe('{"old":true}');
    expect(localStorage.getItem("english_quiz")).toBeNull();
    expect(localStorage.getItem(RECOVERY_KEY)).not.toBeNull();
  });
  it("aborts before mutation when recovery cannot be stored", () => {
    localStorage.setItem("english_progress", '{"old":true}');
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    expect(() => applyBackup(payload({ english_progress: {} }))).toThrow();
    expect(localStorage.getItem("english_progress")).toBe('{"old":true}');
  });
  it("notifies mounted consumers only after successful restore", () => {
    const listener = vi.fn();
    window.addEventListener(RESTORED_EVENT, listener);
    applyBackup(payload({ english_worklabs: { writing: { draft: "Hello" } } }));
    expect(listener).toHaveBeenCalledOnce();
    expect(JSON.parse(localStorage.getItem("english_worklabs")!).writing.draft).toBe("Hello");
    window.removeEventListener(RESTORED_EVENT, listener);
  });
  it("reports storage failures without claiming success", () => {
    const listener = vi.fn();
    window.addEventListener(STORAGE_ERROR_EVENT, listener);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    expect(saveJSONChecked("english_progress", {})).toBe(false);
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(STORAGE_ERROR_EVENT, listener);
  });
});
