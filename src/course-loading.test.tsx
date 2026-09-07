import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { StoreProvider, useStore } from "./store";
import * as courses from "./data/courses";

afterEach(() => vi.restoreAllMocks());
it("exposes course failure and supports a successful retry", async () => {
  const load = vi.spyOn(courses, "loadCourseModules").mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce([]);
  const { result } = renderHook(() => useStore(), { wrapper: StoreProvider });
  await waitFor(() => expect(result.current.courseError).toContain("Kurs yuklanmadi"));
  expect(result.current.courseLoading).toBe(false);
  act(() => result.current.retryCourse());
  await waitFor(() => expect(result.current.courseError).toBeNull());
  await waitFor(() => expect(result.current.courseLoading).toBe(false));
  expect(load).toHaveBeenCalledTimes(2);
});
