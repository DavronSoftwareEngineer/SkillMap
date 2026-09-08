import { isObject, validBackupValue } from './backup-validation';

// Recover valid records for display, but never overwrite a malformed source.
export function readRecords<T>(key: string): { records: Record<string, T>; writable: boolean } {
  try {
    const raw = localStorage.getItem(key);
    const value: unknown = raw === null ? {} : JSON.parse(raw);
    if (validBackupValue(key, value, [])) return { records: value as Record<string, T>, writable: true };
    const records: Record<string, T> = {};
    if (isObject(value)) for (const [id, record] of Object.entries(value)) {
      if (validBackupValue(key, { [id]: record }, [])) records[id] = record as T;
    }
    return { records, writable: false };
  } catch {
    return { records: {}, writable: false };
  }
}
