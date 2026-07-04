import { describe, it, expect, beforeEach } from "vitest";
import { migrateWebgisZooms } from "./migrate";

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
