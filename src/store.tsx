import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { loadJSON, saveJSON } from "./lib/storage";
import type { QuizScore } from "./types";
import { COURSES, COURSE_BY_ID, loadCourseModules } from "./data/courses";
import type { Course } from "./data/courses";
import type { SrsState, Grade } from "./lib/srs";
import { grade as gradeCard } from "./lib/srs";
import type { Streak } from "./lib/streak";
import { EMPTY_STREAK, dayKey, registerActivity } from "./lib/streak";
import { applyBackup, downloadBackup } from "./lib/backup";

type Progress = Record<string, boolean>;
type QuizScores = Record<string, QuizScore>;

const STREAK_KEY = "myacademy_streak";

interface StoreValue {
  courseId: string;
  course: Course;
  courseLoading: boolean;
  setCourse: (id: string) => void;
  theme: string;
  toggleTheme: () => void;
  progress: Progress;
  quizScores: QuizScores;
  srs: SrsState;
  streak: Streak;
  toggleTask: (id: string) => void;
  isDone: (id: string) => boolean;
  recordQuiz: (zoom: string, best: number, total: number) => void;
  gradeVocab: (word: string, g: Grade) => void;
  resetSrs: () => void;
  exportBackup: () => void;
  importBackup: (text: string) => void;
  toast: (msg: string) => void;
}

const Ctx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [courseId, setCourseId] = useState<string>(() => {
    // Eski/yaroqsiz active_course localStorage'da qolgan bo'lsa - birinchi kursga qaytamiz
    // (aks holda COURSE_BY_ID[courseId] undefined bo'lib, ilova ishlamay qoladi).
    const saved = loadJSON<string>("active_course", COURSES[0].id);
    return COURSE_BY_ID[saved] ? saved : COURSES[0].id;
  });
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>(() => {
    const o: Record<string, Progress> = {};
    COURSES.forEach((c) => (o[c.id] = loadJSON(c.id + "_progress", {})));
    return o;
  });
  const [quizMap, setQuizMap] = useState<Record<string, QuizScores>>(() => {
    const o: Record<string, QuizScores> = {};
    COURSES.forEach((c) => (o[c.id] = loadJSON(c.id + "_quiz", {})));
    return o;
  });
  const [srsMap, setSrsMap] = useState<Record<string, SrsState>>(() => {
    const o: Record<string, SrsState> = {};
    COURSES.forEach((c) => (o[c.id] = loadJSON(c.id + "_srs", {})));
    return o;
  });
  const [streak, setStreak] = useState<Streak>(() => loadJSON(STREAK_KEY, EMPTY_STREAK));
  const [modulesMap, setModulesMap] = useState<Record<string, Course["modules"]>>({});
  const [courseLoading, setCourseLoading] = useState(true);

  const [theme, setThemeState] = useState<string>(() => {
    const saved = loadJSON<string | null>("myacademy_theme", null);
    if (saved === "light" || saved === "dark") return saved;
    // Saqlanmagan bo'lsa - tizim sozlamasiga ergashamiz (sukut: dark).
    const prefersLight =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  });

  // Mavzuni <html data-theme> ga yozamiz va saqlaymiz.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveJSON("myacademy_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => saveJSON("active_course", courseId), [courseId]);

  useEffect(() => {
    let cancelled = false;
    if (modulesMap[courseId]) {
      setCourseLoading(false);
      return;
    }
    setCourseLoading(true);
    loadCourseModules(courseId)
      .then((modules) => {
        if (cancelled) return;
        setModulesMap((m) => ({ ...m, [courseId]: modules }));
        setCourseLoading(false);
      })
      .catch(() => {
        if (!cancelled) setCourseLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, modulesMap]);

  const setCourse = useCallback((id: string) => setCourseId(id), []);

  // Har qanday o'rganish harakatida kunlik odat (streak) qayd etiladi.
  const bumpStreak = useCallback(() => {
    setStreak((s) => {
      const next = registerActivity(s, dayKey(new Date()));
      if (next !== s) saveJSON(STREAK_KEY, next);
      return next;
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setProgressMap((m) => {
      const cur = { ...(m[courseId] || {}) };
      if (cur[id]) delete cur[id];
      else cur[id] = true;
      saveJSON(courseId + "_progress", cur);
      return { ...m, [courseId]: cur };
    });
    bumpStreak();
  }, [courseId, bumpStreak]);

  const isDone = useCallback((id: string) => !!progressMap[courseId]?.[id], [progressMap, courseId]);

  const recordQuiz = useCallback((zoom: string, best: number, total: number) => {
    setQuizMap((m) => {
      const cur = { ...(m[courseId] || {}) };
      const prev = cur[zoom]?.best ?? -1;
      if (best >= prev) cur[zoom] = { best, total };
      saveJSON(courseId + "_quiz", cur);
      return { ...m, [courseId]: cur };
    });
    bumpStreak();
  }, [courseId, bumpStreak]);

  const gradeVocab = useCallback((word: string, g: Grade) => {
    setSrsMap((m) => {
      const cur = { ...(m[courseId] || {}) };
      cur[word] = gradeCard(cur[word], g, Date.now());
      saveJSON(courseId + "_srs", cur);
      return { ...m, [courseId]: cur };
    });
    bumpStreak();
  }, [courseId, bumpStreak]);

  const resetSrs = useCallback(() => {
    setSrsMap((m) => {
      saveJSON(courseId + "_srs", {});
      return { ...m, [courseId]: {} };
    });
  }, [courseId]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2400);
  }, []);

  const exportBackup = useCallback(() => {
    downloadBackup(new Date());
    toast("Zaxira fayli yuklab olindi");
  }, [toast]);

  // Import qilingach localStorage'dan qaytadan o'qiymiz (sahifani yangilamasdan).
  const reloadFromStorage = useCallback(() => {
    const p: Record<string, Progress> = {};
    const q: Record<string, QuizScores> = {};
    const s: Record<string, SrsState> = {};
    COURSES.forEach((c) => {
      p[c.id] = loadJSON(c.id + "_progress", {});
      q[c.id] = loadJSON(c.id + "_quiz", {});
      s[c.id] = loadJSON(c.id + "_srs", {});
    });
    setProgressMap(p);
    setQuizMap(q);
    setSrsMap(s);
    setStreak(loadJSON(STREAK_KEY, EMPTY_STREAK));
    setCourseId(loadJSON<string>("active_course", COURSES[0].id));
  }, []);

  const importBackup = useCallback((text: string) => {
    try {
      applyBackup(text);
      reloadFromStorage();
      toast("Zaxira tiklandi");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Faylni o'qib bo'lmadi");
    }
  }, [reloadFromStorage, toast]);

  const value: StoreValue = {
    courseId,
    course: { ...(COURSE_BY_ID[courseId] || COURSES[0]), modules: modulesMap[courseId] || [] },
    courseLoading,
    setCourse,
    theme,
    toggleTheme,
    progress: progressMap[courseId] || {},
    quizScores: quizMap[courseId] || {},
    srs: srsMap[courseId] || {},
    streak,
    toggleTask,
    isDone,
    recordQuiz,
    gradeVocab,
    resetSrs,
    exportBackup,
    importBackup,
    toast,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={"toast" + (toastMsg ? " show" : "")}>{toastMsg}</div>
    </Ctx.Provider>
  );
}

export function useStore(): StoreValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}
