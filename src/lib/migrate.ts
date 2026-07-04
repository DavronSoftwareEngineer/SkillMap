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

// Telegram kursi qayta tartiblandi:
//  - eski TG11 (Advanced Architecture) -> yangi TG9
//  - eski TG9 (capstone) eski TG10 (final) ga birlashtirildi -> yagona TG10
// Test ballari (telegram_quiz) zoom bo'yicha, progress esa task id bo'yicha saqlanadi.
const TELEGRAM_MIGRATED_KEY = "telegram_zoom_migrated_v1";

type QuizScore = { best: number; total: number };

export function migrateTelegramReorder(): void {
  try {
    if (loadJSON<boolean>(TELEGRAM_MIGRATED_KEY, false)) return;

    // 1) Quiz ballari: TG11 -> TG9, TG9(capstone) -> TG10 (final bilan to'qnashsa - yuqori bali qoladi).
    const quiz = loadJSON<Record<string, QuizScore>>("telegram_quiz", {});
    if (quiz && typeof quiz === "object" && Object.keys(quiz).length > 0) {
      const zoomMap: Record<string, string> = { TG11: "TG9", TG9: "TG10" };
      const next: Record<string, QuizScore> = {};
      for (const [oldZoom, score] of Object.entries(quiz)) {
        const target = zoomMap[oldZoom] ?? oldZoom;
        const existing = next[target];
        // To'qnashuvda (TG9 va TG10 ikkalasi TG10 ga) eng yuqori natijani saqlaymiz.
        if (!existing || (score?.best ?? -1) > (existing.best ?? -1)) next[target] = score;
      }
      saveJSON("telegram_quiz", next);
    }

    // 2) Task progressi: eski capstone (tg9-*) tasklari olib tashlandi - o'chiramiz
    // (aks holda yangi TG9 advanced tasklari yolg'ondan bajarilgan ko'rinadi).
    // Advanced modul tasklari tg11-* -> tg9-* ga ko'chiriladi.
    const progress = loadJSON<Record<string, boolean>>("telegram_progress", {});
    if (progress && typeof progress === "object" && Object.keys(progress).length > 0) {
      const next: Record<string, boolean> = {};
      for (const [id, done] of Object.entries(progress)) {
        if (/^tg9-/.test(id)) continue; // eski capstone taski - endi mavjud emas
        if (/^tg11-/.test(id)) next[id.replace(/^tg11-/, "tg9-")] = done;
        else next[id] = done;
      }
      saveJSON("telegram_progress", next);
    }

    saveJSON(TELEGRAM_MIGRATED_KEY, true);
  } catch {
    /* migratsiya majburiy emas - xato bo'lsa jimgina o'tamiz */
  }
}

// Webgis oxiri qayta tuzildi:
//  - "Karyera" (eski z20) eng oxiriga -> z32
//  - Lab Track + labs (eski z21..z26) bittaga suriladi -> z20..z25
//  - 5 ta yangi advanced modul (z26..z30: AWS/K8s, Queue, MLOps, 3D, Edge) qo'shildi
//  - Final (eski z27) -> z31
// Test ballari (webgis_quiz) zoom bo'yicha; task id'lar o'zgarmagani uchun progress tegilmaydi.
// Yangi z26..z30 modullarida oldin ball bo'lmagan - ular xaritaga kirmaydi.
const WEBGIS_CAREER_MIGRATED_KEY = "webgis_reorder_v2";

export function migrateWebgisCareerReorder(): void {
  try {
    if (loadJSON<boolean>(WEBGIS_CAREER_MIGRATED_KEY, false)) return;
    const quiz = loadJSON<Record<string, unknown>>("webgis_quiz", {});
    if (quiz && typeof quiz === "object" && Object.keys(quiz).length > 0) {
      // asl (git HEAD) -> yangi joylashuv
      const map: Record<string, string> = {
        z20: "z32", z21: "z20", z22: "z21", z23: "z22",
        z24: "z23", z25: "z24", z26: "z25", z27: "z31",
      };
      const next: Record<string, unknown> = {};
      for (const [oldZoom, score] of Object.entries(quiz)) {
        next[map[oldZoom] ?? oldZoom] = score;
      }
      saveJSON("webgis_quiz", next);
    }
    saveJSON(WEBGIS_CAREER_MIGRATED_KEY, true);
  } catch {
    /* migratsiya majburiy emas - xato bo'lsa jimgina o'tamiz */
  }
}

export function runMigrations(): void {
  migrateWebgisZooms();
  migrateWebgisCareerReorder();
  migrateTelegramReorder();
}
