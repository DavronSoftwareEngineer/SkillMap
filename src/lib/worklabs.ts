export const WRITING_CRITERIA = ["Clarity", "Structure", "Grammar & tone", "Actionability", "Technical accuracy"];
export type LabRecord = Record<string, string>;
export type LabRecords = Record<string, LabRecord>;

export function writingResult(record: LabRecord) {
  const scores = WRITING_CRITERIA.map((_, i) => record[`score${i}`]);
  const complete = scores.every(s => ["0", "1", "2"].includes(s));
  const total = scores.reduce((sum, s) => sum + (Number(s) || 0), 0);
  const evidence = WRITING_CRITERIA.every((_, i) => Boolean(record[`reason${i}`]?.trim()));
  const ready = complete && total >= 8 && record.score4 === "2" && evidence &&
    Boolean(record.draft?.trim() && record.revision?.trim() && record.factCheck?.trim());
  return { total, ready, complete };
}

export function safeEvidenceUrl(value: string): boolean {
  if (!value) return true;
  try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; }
}

export function exportLab(record: LabRecord, title: string) {
  const text = `# ${title}\n\nSelf-review / manual feedback; independently unverified.\n\n` +
    Object.entries(record).map(([key, value]) => `## ${key}\n\n${value}\n`).join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `skillmap-${title.replace(/[^a-z0-9-]/gi, "-")}.md`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
