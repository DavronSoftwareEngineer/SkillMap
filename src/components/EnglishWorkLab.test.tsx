import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EnglishWorkLab from "./EnglishWorkLab";
import { applyBackup } from "../lib/backup";
import { writingResult } from "../lib/worklabs";

describe("English work lab", () => {
  it("persists writing on edit and restores after remount", () => {
    const view = render(<EnglishWorkLab mode="WriteLab" />);
    fireEvent.change(screen.getByLabelText(/Birinchi draft/), { target: { value: "The import is blocked by an unknown CRS." } });
    expect(screen.getByText("Shu brauzerda saqlandi")).toBeInTheDocument();
    view.unmount();
    render(<EnglishWorkLab mode="WriteLab" />);
    expect(screen.getByLabelText(/Birinchi draft/)).toHaveValue("The import is blocked by an unknown CRS.");
  });
  it("refreshes mounted draft after import and preserves the imported fields on edit", () => {
    render(<EnglishWorkLab mode="WriteLab" />);
    act(() => applyBackup(JSON.stringify({ app: "SkillMap", version: 1, data: { english_worklabs: { "writing-main": { draft: "Imported", revision: "New revision" } } } })));
    expect(screen.getByLabelText(/Birinchi draft/)).toHaveValue("Imported");
    fireEvent.change(screen.getByLabelText(/Assessor feedback/), { target: { value: "Clear update" } });
    expect(JSON.parse(localStorage.getItem("english_worklabs")!)["writing-main"].revision).toBe("New revision");
  });
  it("keeps weekly evidence separate", () => {
    render(<EnglishWorkLab mode="WorkLab" />);
    fireEvent.change(screen.getByLabelText(/Birinchi draft/), { target: { value: "Week one" } });
    fireEvent.change(screen.getByLabelText("Haftalik vazifa"), { target: { value: "1" } });
    expect(screen.getByLabelText(/Birinchi draft/)).toHaveValue("");
    fireEvent.change(screen.getByLabelText("Haftalik vazifa"), { target: { value: "0" } });
    expect(screen.getByLabelText(/Birinchi draft/)).toHaveValue("Week one");
  });
  it("does not pass technically incorrect writing even at 8/10", () => {
    const record = { score0: "2", score1: "2", score2: "2", score3: "2", score4: "0", draft: "d", revision: "r", factCheck: "test", reason0: "a", reason1: "a", reason2: "a", reason3: "a", reason4: "a" };
    expect(writingResult(record)).toMatchObject({ total: 8, ready: false });
    expect(writingResult({ ...record, score4: "2" }).ready).toBe(true);
    expect(writingResult({ ...record, score4: "2", reason2: "" }).ready).toBe(false);
  });
  it("provides a real source and flags unsafe recording links", () => {
    render(<EnglishWorkLab mode="AudioLab" />);
    expect(screen.getByRole("link", { name: /manbada ochish/ })).toHaveAttribute("href", "https://learnenglish.britishcouncil.org/comment/204958");
    fireEvent.change(screen.getByLabelText("Joriy audio/video yozuv havolasi"), { target: { value: "javascript:alert(1)" } });
    expect(screen.getByRole("alert")).toHaveTextContent("http/https");
  });
});
