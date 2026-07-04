// Bir martalik migratsiyalar - ilova ishga tushishidan oldin (store o'qishidan avval) chaqiriladi.
import { loadJSON, saveJSON } from "./storage";

// Webgis moduli zoom kodlari ketma-ket qilib qayta nomlandi (z0..z20).
// Test ballari (webgis_quiz) zoom bo'yicha saqlanadi, shuning uchun eski
// kalitlarni yangisiga ko'chiramiz. Task progressi task id bo'yicha - o'zgarmaydi.
const WEBGIS_ZOOM_MAP: Record<string, string> = {
  z0: "z0", z2: "z1", z3: "z2", z4: "z3", z6: "z4", z10: "z5",
  z26: "z6", z28: "z7", z13: "z8", z16: "z9", z18: "z10", z30: "z11",
  z32: "z12", z24: "z13", z34: "z14", z36: "z15", z38: "z16", z40: "z17",
  z42: "z18", z20: "z19", z22: "z20",
};

const WEBGIS_MIGRATED_KEY = "webgis_zoom_migrated_v1";

// MUHIM: eski kalitlar bilan yangi qiymatlar ustma-ust tushadi (masalan yangi "z6"
// eski "z26" ning maqsadi, lekin "z6" eski kalit ham). Shuning uchun bir martagina
// (flag bilan) ishlashi SHART - takror ishlasa ma'lumot buziladi.
export function migrateWebgisZooms(): void {
  try {
    if (loadJSON<boolean>(WEBGIS_MIGRATED_KEY, false)) return;
    const quiz = loadJSON<Record<string, unknown>>("webgis_quiz", {});
    if (quiz && typeof quiz === "object" && Object.keys(quiz).length > 0) {
      const next: Record<string, unknown> = {};
      for (const [oldZoom, score] of Object.entries(quiz)) {
        const newZoom = WEBGIS_ZOOM_MAP[oldZoom] ?? oldZoom;
        next[newZoom] = score;
      }
      saveJSON("webgis_quiz", next);
    }
    saveJSON(WEBGIS_MIGRATED_KEY, true);
  } catch {
    /* migratsiya majburiy emas - xato bo'lsa jimgina o'tamiz */
  }
}

export function runMigrations(): void {
  migrateWebgisZooms();
}
