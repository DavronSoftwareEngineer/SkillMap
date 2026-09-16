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
  it("a stale tab keeps other quiz results and the newer best score", () => {
    const { result } = render();
    localStorage.setItem('webgis_quiz', JSON.stringify({z1:{best:5,total:5},z2:{best:2,total:3}}));
    act(() => result.current.recordQuiz('z1',1,5));
    expect(result.current.quizScores).toEqual({z1:{best:5,total:5},z2:{best:2,total:3}});
  });
  it("storage events update progress without switching the active course", () => {
    const { result } = render();
    localStorage.setItem('active_course','"english"');
    localStorage.setItem('webgis_progress','{"remote":true}');
    act(() => window.dispatchEvent(new StorageEvent('storage',{key:'webgis_progress',storageArea:localStorage})));
    expect(result.current.isDone('remote')).toBe(true);
    expect(result.current.courseId).toBe('webgis');
  });
  it("SRS writes keep other cards and reset is persisted", () => {
    const { result } = render();
    localStorage.setItem('webgis_srs','{"remote":{"box":2,"due":100}}');
    act(() => result.current.gradeVocab('local','good'));
    expect(result.current.srs.remote).toEqual({box:2,due:100});
    act(() => result.current.resetSrs());
    expect(localStorage.getItem('webgis_srs')).toBe('{}');
  });
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
