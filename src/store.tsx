import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { loadJSON, saveJSON } from "./lib/storage";
import type { QuizScore } from "./types";
import { COURSES, COURSE_BY_ID, loadCourseModules } from "./data/courses";
import type { Course } from "./data/courses";
import type { SrsState, Grade } from "./lib/srs";
import { grade as gradeCard } from "./lib/srs";
import type { Streak } from "./lib/streak";
import { EMPTY_STREAK, dayKey, registerActivity } from "./lib/streak";
import { applyBackup, downloadBackup, loadLastBackup } from "./lib/backup";
import { parseHash } from "./lib/router";

type Progress = Record<string, boolean>;
type QuizScores = Record<string, QuizScore>;

const STREAK_KEY = "myacademy_streak";
const COURSE_IDS = COURSES.map((c) => c.id);

/* ------------------------------ Toast ------------------------------ */
// Alohida kontekst: toast chiqishi asosiy store iste'molchilarini re-render qilmaydi.

type ToastFn = (msg: string) => void;
const ToastCtx = createContext<ToastFn>(() => {});

export function useToast(): ToastFn {
  return useContext(ToastCtx);
}

function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const toast = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2400);
  }, []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className={"toast" + (msg ? " show" : "")}>{msg}</div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------ Theme ------------------------------ */

interface ThemeValue {
  theme: string;
  toggleTheme: () => void;
}
const ThemeCtx = createContext<ThemeValue | null>(null);

export function useTheme(): ThemeValue {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme must be used within StoreProvider");
  return v;
}

function ThemeProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

/* --------------------------- Asosiy store --------------------------- */

interface StoreValue {
  courseId: string;
  course: Course;
  courseLoading: boolean;
  setCourse: (id: string) => void;
  progress: Progress;
  quizScores: QuizScores;
  srs: SrsState;
  streak: Streak;
  lastBackup: string | null;
  toggleTask: (id: string) => void;
  isDone: (id: string) => boolean;
  recordQuiz: (zoom: string, best: number, total: number) => void;
  gradeVocab: (word: string, g: Grade) => void;
  resetSrs: () => void;
  exportBackup: () => void;
  importBackup: (text: string) => void;
  toast: ToastFn;
}

const Ctx = createContext<StoreValue | null>(null);

function CourseStoreProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  const [courseId, setCourseId] = useState<string>(() => {
    // URL hash birinchi o'rinda (#english/dash kabi havola ulashilgan bo'lsa),
    // keyin localStorage. Eski/yaroqsiz qiymat bo'lsa - birinchi kursga qaytamiz.
    const fromHash =
      typeof window !== "undefined"
        ? parseHash(window.location.hash, COURSE_IDS).courseId
        : null;
    if (fromHash) return fromHash;
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
  const [lastBackup, setLastBackup] = useState<string | null>(() => loadLastBackup());
  const [modulesMap, setModulesMap] = useState<Record<string, Course["modules"]>>({});
  const [courseLoading, setCourseLoading] = useState(true);

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

  const exportBackup = useCallback(() => {
    const now = new Date();
    downloadBackup(now);
    setLastBackup(now.toISOString());
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
    setLastBackup(loadLastBackup());
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

  // Memoizatsiya: faqat haqiqiy holat o'zgarganda iste'molchilar re-render bo'ladi
  // (toast xabari kabi yon holatlar bunga kirmaydi).
  const value = useMemo<StoreValue>(
    () => ({
      courseId,
      course: { ...(COURSE_BY_ID[courseId] || COURSES[0]), modules: modulesMap[courseId] || [] },
      courseLoading,
      setCourse,
      progress: progressMap[courseId] || {},
      quizScores: quizMap[courseId] || {},
      srs: srsMap[courseId] || {},
      streak,
      lastBackup,
      toggleTask,
      isDone,
      recordQuiz,
      gradeVocab,
      resetSrs,
      exportBackup,
      importBackup,
      toast,
    }),
    [
      courseId,
      modulesMap,
      courseLoading,
      setCourse,
      progressMap,
      quizMap,
      srsMap,
      streak,
      lastBackup,
      toggleTask,
      isDone,
      recordQuiz,
      gradeVocab,
      resetSrs,
      exportBackup,
      importBackup,
      toast,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ThemeProvider>
        <CourseStoreProvider>{children}</CourseStoreProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export function useStore(): StoreValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}
