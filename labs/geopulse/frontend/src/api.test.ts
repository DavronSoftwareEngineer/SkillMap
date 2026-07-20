import { describe, expect, it } from "vitest";

import { formatBbox } from "./api";

describe("formatBbox", () => {
  it("keeps west,south,east,north order and stable precision", () => {
    expect(formatBbox([69.1, 41.2, 69.4, 41.4])).toBe(
      "69.100000,41.200000,69.400000,41.400000",
    );
  });
});
