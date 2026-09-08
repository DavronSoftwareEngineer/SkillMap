export const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);
const number = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;
const integer = (v: unknown) => number(v) && Number.isInteger(v);
const dictionary = (v: unknown, test: (item: unknown) => boolean): boolean =>
  isObject(v) && Object.entries(v).every(([k, item]) => !["__proto__", "constructor", "prototype"].includes(k) && test(item));
const strings = (v: unknown) => dictionary(v, item => typeof item === "string");
const booleans = (v: unknown) => dictionary(v, item => typeof item === "boolean");

export function validBackupValue(key: string, value: unknown, courseIds: string[]): boolean {
  if (key === "active_course") return typeof value === "string" && courseIds.includes(value);
  if (key === "myacademy_theme") return value === "light" || value === "dark";
  if (key === "myacademy_streak") return isObject(value) && typeof value.last === "string" &&
    (value.last === "" || /^\d{4}-\d{2}-\d{2}$/.test(value.last)) && integer(value.current) && integer(value.best) && Number(value.best) >= Number(value.current);
  if (key.endsWith("_progress") || key.endsWith("_vocab")) return booleans(value);
  if (key.endsWith("_quiz")) return dictionary(value, v => isObject(v) && integer(v.best) && integer(v.total) && Number(v.best) <= Number(v.total));
  if (key.endsWith("_srs")) return dictionary(value, v => isObject(v) && integer(v.box) && Number(v.box) <= 5 && number(v.due));
  if (key.endsWith("_assessment")) return dictionary(value, v => isObject(v) && Object.entries(v).every(([field, item]) => {
    if (field === "evidence") return strings(item);
    if (field === "scores") return dictionary(item, number);
    if (field === "criticalFails") return booleans(item);
    if (["reviewer", "notes"].includes(field)) return typeof item === "string";
    if (field === "defenseCompleted") return typeof item === "boolean";
    if (["submittedAt", "reviewedAt"].includes(field)) return item === null || (typeof item === "string" && Number.isFinite(Date.parse(item)));
    return false;
  }));
  if (key.endsWith("_worklabs")) return dictionary(value, v => strings(v));
  if (key.endsWith("_practice")) return dictionary(value, v => isObject(v) && Object.entries(v).every(([field,item]) => ['attempt','reason','transfer','evidence','review','recall'].includes(field) && typeof item === 'string' && item.length <= 30000));
  return false;
}
