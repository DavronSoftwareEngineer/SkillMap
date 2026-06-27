import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { StoreProvider, useStore } from "./store";
import { COURSES } from "./data/courses";

const wrapper = ({ children }: { children: ReactNode }) => (
  <StoreProvider>{children}</StoreProvider>
);

const render = () => renderHook(() => useStore(), { wrapper });

describe("store - kurs almashish", () => {
  it("standart kurs ro'yxatdagi birinchi kurs", () => {
    const { result } = render();
    expect(result.current.courseId).toBe(COURSES[0].id);
  });

  it("setCourse faol kursni almashtiradi", () => {
    const { result } = render();
    act(() => result.current.setCourse("english"));
    expect(result.current.courseId).toBe("english");
    expect(result.current.course.name).toBe("English");
  });
});

describe("store - progress kurslar bo'yicha alohida", () => {
  it("bir kursdagi topshiriq boshqa kursga ta'sir qilmaydi", () => {
    const { result } = render();

    act(() => result.current.toggleTask("t1"));
    expect(result.current.isDone("t1")).toBe(true);

    // Boshqa kursga o'tganda o'sha topshiriq belgilanmagan bo'lishi kerak.
    act(() => result.current.setCourse("english"));
    expect(result.current.isDone("t1")).toBe(false);

    // Birinchi kursga qaytsak - belgi saqlangan.
    act(() => result.current.setCourse(COURSES[0].id));
    expect(result.current.isDone("t1")).toBe(true);
  });

  it("toggleTask ikki marta bosilsa belgini olib tashlaydi", () => {
    const { result } = render();
    act(() => result.current.toggleTask("t1"));
    act(() => result.current.toggleTask("t1"));
    expect(result.current.isDone("t1")).toBe(false);
  });

  it("progress localStorage'ga yoziladi", () => {
    const { result } = render();
    act(() => result.current.toggleTask("t1"));
    const saved = JSON.parse(localStorage.getItem(COURSES[0].id + "_progress") || "{}");
    expect(saved.t1).toBe(true);
  });
});

describe("store - recordQuiz eng yaxshi natijani saqlaydi", () => {
  it("faqat oldingidan yuqori (yoki teng) natija yoziladi", () => {
    const { result } = render();

    act(() => result.current.recordQuiz("z1", 3, 5));
    expect(result.current.quizScores.z1).toEqual({ best: 3, total: 5 });

    // Pastroq natija eski rekordni buzmaydi.
    act(() => result.current.recordQuiz("z1", 1, 5));
    expect(result.current.quizScores.z1.best).toBe(3);

    // Yuqoriroq natija yangilanadi.
    act(() => result.current.recordQuiz("z1", 5, 5));
    expect(result.current.quizScores.z1.best).toBe(5);
  });
});
