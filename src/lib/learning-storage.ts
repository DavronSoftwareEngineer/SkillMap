import { validBackupValue } from './backup-validation';
import { saveJSONChecked, STORAGE_ERROR_EVENT } from './storage';

// Serialize read-modify-write across tabs on HTTPS/localhost. Never perform a
// storage side effect in a React state updater (StrictMode may replay it).
export function updateLearningState<T>(
  key: string, fallback: T, change: (current: T) => T, saved: (value: T) => void,
): void {
  const report = () => window.dispatchEvent(new CustomEvent(STORAGE_ERROR_EVENT, { detail: { key } }));
  const commit = () => {
    try {
      const raw = localStorage.getItem(key);
      const current: unknown = raw === null ? fallback : JSON.parse(raw);
      if (!validBackupValue(key, current, [])) { report(); return; }
      const next = change(current as T);
      if (!validBackupValue(key, next, [])) { report(); return; }
      if (saveJSONChecked(key, next)) saved(next);
    } catch { report(); }
  };
  if (navigator.locks?.request) {
    void navigator.locks.request(`skillmap:${key}`, commit).catch(report);
  } else {
    // Legacy/insecure contexts: read the latest value, not the mounted snapshot.
    // Truly simultaneous writes need Web Locks (serve over HTTPS/localhost).
    commit();
  }
}
