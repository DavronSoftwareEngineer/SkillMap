import { CLOUD_KEYS, MAX_CLOUD_BYTES, validCloudData } from './cloud-data';
import type { CloudData } from './cloud-data';
import { RESTORED_EVENT } from './storage';
import { RECOVERY_KEY } from './backup';
export function readCloudData(): CloudData {
  const data: CloudData = {};
  for (const key of CLOUD_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try { data[key] = JSON.parse(raw); }
      catch { throw new Error('Mahalliy ma’lumot noto‘g‘ri. Avval JSON zaxira oling.'); }
    }
  }
  if (!validCloudData(data)) throw new Error('Mahalliy ma’lumot tuzilishi noto‘g‘ri. Avval JSON zaxira oling.');
  if (new TextEncoder().encode(JSON.stringify(data)).length > MAX_CLOUD_BYTES - 1024) throw new Error('Cloud uchun 2 MB chegaradan oshdi. JSON zaxiradan foydalaning.');
  return data;
}
// Complete snapshots remove absent keys, unlike partial JSON imports.
export function restoreCloudData(data: CloudData) {
  if (!validCloudData(data)) throw new Error('Cloud nusxa noto‘g‘ri.');
  const previous = CLOUD_KEYS.map(key => [key, localStorage.getItem(key)] as const);
  localStorage.setItem(RECOVERY_KEY, JSON.stringify({ createdAt: new Date().toISOString(), entries: previous }));
  try {
    for (const key of CLOUD_KEYS) {
      if (Object.prototype.hasOwnProperty.call(data, key)) localStorage.setItem(key, JSON.stringify(data[key]));
      else localStorage.removeItem(key);
    }
  } catch {
    let recovered = true;
    for (const [key, raw] of previous) {
      try { if (raw === null) localStorage.removeItem(key); else localStorage.setItem(key, raw); }
      catch { recovered = false; }
    }
    throw new Error(recovered ? 'Tiklash saqlanmadi. Mahalliy nusxa qaytarildi.' : 'Tiklash tugamadi. Sahifani yopmang; skillmap_pre_import_recovery nusxasini saqlang.');
  }
  window.dispatchEvent(new Event(RESTORED_EVENT));
}
