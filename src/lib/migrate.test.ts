import { describe, it, expect, beforeEach } from "vitest";
import { migrateWebgisZooms, migrateWebgisCareerReorder, migrateTelegramReorder } from "./migrate";

// jsdom localStorage mavjud; har test oldidan tozalaymiz.
beforeEach(() => localStorage.clear());

describe("migrateWebgisZooms", () => {
  it("eski zoom kalitlarini yangisiga ko'chiradi", () => {
    localStorage.setItem(
      "webgis_quiz",
      JSON.stringify({ z26: { best: 5, total: 5 }, z2: { best: 3, total: 4 } })
    );
    migrateWebgisZooms();
    const q = JSON.parse(localStorage.getItem("webgis_quiz")!);
    expect(q.z6).toEqual({ best: 5, total: 5 }); // z26 -> z6
    expect(q.z1).toEqual({ best: 3, total: 4 }); // z2 -> z1
    expect(q.z26).toBeUndefined();
    expect(q.z2).toBeUndefined();
  });

  it("ikki marta chaqirilsa ma'lumotni buzmaydi (idempotent flag)", () => {
    localStorage.setItem("webgis_quiz", JSON.stringify({ z26: { best: 5, total: 5 } }));
    migrateWebgisZooms();
    migrateWebgisZooms(); // ikkinchi marta - hech narsa o'zgarmasligi kerak
    const q = JSON.parse(localStorage.getItem("webgis_quiz")!);
    expect(q.z6).toEqual({ best: 5, total: 5 });
    expect(Object.keys(q)).toEqual(["z6"]);
  });

  it("z0 o'zgarmaydi (o'ziga xarita)", () => {
    localStorage.setItem("webgis_quiz", JSON.stringify({ z0: { best: 2, total: 3 } }));
    migrateWebgisZooms();
    const q = JSON.parse(localStorage.getItem("webgis_quiz")!);
    expect(q.z0).toEqual({ best: 2, total: 3 });
  });

  it("quiz bo'sh bo'lsa ham flag qo'yiladi, xato bermaydi", () => {
    migrateWebgisZooms();
    expect(JSON.parse(localStorage.getItem("webgis_zoom_migrated_v1")!)).toBe(true);
  });
});

describe("migrateWebgisCareerReorder", () => {
  it("Career z20 -> z32, labs -> z20.., Final z27 -> z31", () => {
    localStorage.setItem(
      "webgis_quiz",
      JSON.stringify({
        z5: { best: 4, total: 5 }, // o'zgarmaydi
        z20: { best: 3, total: 3 }, // Career -> z32
        z21: { best: 5, total: 5 }, // Lab Track -> z20
        z26: { best: 4, total: 4 }, // Deploy Lab -> z25
        z27: { best: 2, total: 4 }, // Final -> z31
      })
    );
    migrateWebgisCareerReorder();
    const q = JSON.parse(localStorage.getItem("webgis_quiz")!);
    expect(q.z5).toEqual({ best: 4, total: 5 });
    expect(q.z32).toEqual({ best: 3, total: 3 }); // eski Career
    expect(q.z20).toEqual({ best: 5, total: 5 }); // eski Lab Track z21
    expect(q.z25).toEqual({ best: 4, total: 4 }); // eski Deploy Lab z26
    expect(q.z31).toEqual({ best: 2, total: 4 }); // eski Final z27
  });

  it("ikki marta chaqirilsa buzmaydi (idempotent flag)", () => {
    localStorage.setItem("webgis_quiz", JSON.stringify({ z20: { best: 3, total: 3 } }));
    migrateWebgisCareerReorder();
    migrateWebgisCareerReorder();
    const q = JSON.parse(localStorage.getItem("webgis_quiz")!);
    expect(q.z32).toEqual({ best: 3, total: 3 });
    expect(Object.keys(q)).toEqual(["z32"]);
  });
});

describe("migrateTelegramReorder", () => {
  it("quiz: TG11 -> TG9, capstone TG9 final TG10 ga qo'shiladi (yuqori bal qoladi)", () => {
    localStorage.setItem(
      "telegram_quiz",
      JSON.stringify({
        TG8: { best: 3, total: 3 }, // o'zgarmaydi
        TG11: { best: 4, total: 4 }, // -> TG9
        TG9: { best: 2, total: 2 }, // eski capstone -> TG10
        TG10: { best: 3, total: 4 }, // final -> TG10 (yuqori bal qoladi)
      })
    );
    migrateTelegramReorder();
    const q = JSON.parse(localStorage.getItem("telegram_quiz")!);
    expect(q.TG8).toEqual({ best: 3, total: 3 });
    expect(q.TG9).toEqual({ best: 4, total: 4 }); // eski TG11
    expect(q.TG10).toEqual({ best: 3, total: 4 }); // TG10 > TG9(capstone) bali
    expect(q.TG11).toBeUndefined();
  });

  it("progress: tg11-* -> tg9-*, eski capstone tg9-* o'chadi", () => {
    localStorage.setItem(
      "telegram_progress",
      JSON.stringify({ "tg8-1": true, "tg11-3": true, "tg9-2": true, "tg10-1": true })
    );
    migrateTelegramReorder();
    const p = JSON.parse(localStorage.getItem("telegram_progress")!);
    expect(p["tg8-1"]).toBe(true);
    expect(p["tg9-3"]).toBe(true); // tg11-3 -> tg9-3
    expect(p["tg10-1"]).toBe(true);
    expect(p["tg9-2"]).toBeUndefined(); // eski capstone taski - o'chdi
    expect(p["tg11-3"]).toBeUndefined();
  });

  it("ikki marta chaqirilsa buzmaydi (idempotent flag)", () => {
    localStorage.setItem("telegram_quiz", JSON.stringify({ TG11: { best: 5, total: 5 } }));
    migrateTelegramReorder();
    migrateTelegramReorder();
    const q = JSON.parse(localStorage.getItem("telegram_quiz")!);
    expect(q.TG9).toEqual({ best: 5, total: 5 });
    expect(Object.keys(q)).toEqual(["TG9"]);
  });
});
