import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "./store";
import { COURSES } from "./data/courses";
import { parseHash, buildHash } from "./lib/router";
import type { ViewName } from "./lib/router";
import { Topo } from "./components/Topo";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { ModuleView } from "./components/ModuleView";
import { Dashboard } from "./components/Dashboard";
import { Flashcards } from "./components/Flashcards";
import { Reference } from "./components/Reference";
import { Search } from "./components/Search";
import { Playground } from "./components/Playground";
import { Books } from "./components/Books";

type View = number | ViewName;

const COURSE_IDS = COURSES.map((c) => c.id);

// Hashchange kelganda boshqa kurs moduliga o'tish kerak bo'lsa,
// modullar yuklangunicha maqsadni shu yerda saqlab turamiz.
interface PendingTarget {
  zoom?: string;
  view?: ViewName;
}

export default function App() {
  const { progress, course, courseId, courseLoading, setCourse } = useStore();

  // Boshlang'ich ko'rinish URL hash'dan: #kurs/dash -> dash, #kurs/z5 -> z5 (modullar yuklangach).
  const initialRoute = useMemo(
    () => parseHash(window.location.hash, COURSE_IDS),
    []
  );
  const [view, setView] = useState<View>(() => initialRoute.view ?? 0);
  const pendingTarget = useRef<PendingTarget | null>(
    initialRoute.zoom ? { zoom: initialRoute.zoom } : null
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const modules = course.modules;

  // Listener ichida eskirmagan qiymatlar kerak - ref orqali.
  const courseIdRef = useRef(courseId);
  courseIdRef.current = courseId;
  const modulesRef = useRef(modules);
  modulesRef.current = modules;

  // Hash faqat aniq navigatsiya harakatlarida yoziladi (holat-effekt poygasi bo'lmasin).
  // replace=true - tarixga yangi yozuv qo'shmaydi (normallashtirish uchun).
  const writeHash = useCallback((target: ViewName | string | null, replace = false) => {
    const h = buildHash(courseIdRef.current, target);
    if (window.location.hash === h) return;
    if (replace) window.history.replaceState(null, "", h);
    else window.location.hash = h;
  }, []);

  // Boshlang'ich normallashtirish: hash bo'sh/yaroqsiz bo'lsa joriy kursni yozamiz.
  useEffect(() => {
    const r = parseHash(window.location.hash, COURSE_IDS);
    if (!r.courseId) writeHash(initialRoute.view ?? null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kurs almashganda: kutayotgan maqsad bo'lsa - unga, bo'lmasa 1-modulga.
  const prevCourse = useRef(courseId);
  useEffect(() => {
    if (prevCourse.current === courseId) return;
    prevCourse.current = courseId;
    const t = pendingTarget.current;
    if (t?.view) {
      setView(t.view);
      pendingTarget.current = null;
    } else if (!t?.zoom) {
      // UI orqali almashtirilgan - 1-modul (#kurs shakli shuni bildiradi).
      setView(0);
      writeHash(null);
    }
    // t?.zoom bo'lsa - quyidagi effekt modullar yuklangach hal qiladi.
  }, [courseId, writeHash]);

  // Kutayotgan zoom maqsadi modullar yuklangach indeksga aylanadi.
  useEffect(() => {
    const zoom = pendingTarget.current?.zoom;
    if (!zoom || modules.length === 0) return;
    pendingTarget.current = null;
    const i = modules.findIndex((m) => m.zoom === zoom);
    setView(i >= 0 ? i : 0);
    // Topilmagan zoom'ni hashdan olib tashlaymiz (tarixni bulg'amasdan).
    if (i < 0) writeHash(null, true);
  }, [modules, writeHash]);

  // URL hash -> holat (orqaga/oldinga tugmalari, qo'lda kiritilgan havola).
  useEffect(() => {
    const onHash = () => {
      const r = parseHash(window.location.hash, COURSE_IDS);
      if (!r.courseId) return;
      if (r.courseId !== courseIdRef.current) {
        pendingTarget.current = {
          zoom: r.zoom ?? undefined,
          view: r.view ?? undefined,
        };
        setCourse(r.courseId);
        return;
      }
      if (r.view) {
        setView(r.view);
        return;
      }
      const mods = modulesRef.current;
      if (!r.zoom) {
        setView(0);
        return;
      }
      const i = mods.findIndex((m) => m.zoom === r.zoom);
      if (i >= 0) {
        setView(i);
      } else if (mods.length === 0) {
        pendingTarget.current = { zoom: r.zoom }; // modullar hali yuklanmagan
      } else {
        setView(0);
        writeHash(null, true); // yaroqsiz zoom - normallashtiramiz
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [setCourse, writeHash]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const totalTasks = modules.reduce((a, m) => a + m.tasks.length, 0);
  const doneTasks = modules.reduce((a, m) => a + m.tasks.filter((t) => progress[t.id]).length, 0);
  const overall = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const goModule = (i: number) => {
    setView(i);
    writeHash(modules[i]?.zoom ?? null);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goView = (v: View) => {
    setView(v);
    writeHash(typeof v === "number" ? modules[v]?.zoom ?? null : v);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const safeIndex = typeof view === "number" && modules.length > 0 ? Math.min(view, modules.length - 1) : -1;
  const coord =
    view === "dash"
      ? "Tayyorlik paneli"
      : view === "flash"
      ? "Lug'at"
      : view === "ref"
      ? "Ma'lumotnoma"
      : view === "search"
      ? "Qidiruv"
      : view === "play"
      ? "Playground"
      : view === "books"
      ? "Kitoblar"
      : (modules[safeIndex]?.coord ?? "");

  return (
    <div className={"app course-" + courseId + (menuOpen ? " menu-open" : "")}>
      <Topo />
      <div className="wrap">
        <TopBar coord={coord} overall={overall} onDash={() => goView("dash")} onMenu={() => setMenuOpen((o) => !o)} />
        <div className="shell">
          <Sidebar
            open={menuOpen}
            active={typeof view === "number" ? safeIndex : -1}
            dashActive={view === "dash"}
            flashActive={view === "flash"}
            refActive={view === "ref"}
            searchActive={view === "search"}
            playActive={view === "play"}
            booksActive={view === "books"}
            onSelect={goModule}
            onDash={() => goView("dash")}
            onFlash={() => goView("flash")}
            onRef={() => goView("ref")}
            onSearch={() => goView("search")}
            onPlay={() => goView("play")}
            onBooks={() => goView("books")}
            onClose={() => setMenuOpen(false)}
          />
          <main className="main" key={courseId}>
            {courseLoading && (
              <div className="dash">
                <div className="eyebrow">{course.name}</div>
                <h2 className="mtitle">Kurs yuklanmoqda</h2>
                <p className="mlede">Darslar tayyorlanmoqda. Bir lahza...</p>
              </div>
            )}
            {!courseLoading && view === "dash" && <Dashboard onGo={goModule} />}
            {!courseLoading && view === "flash" && <Flashcards />}
            {!courseLoading && view === "ref" && <Reference />}
            {!courseLoading && view === "search" && <Search onGo={goModule} />}
            {!courseLoading && view === "play" && <Playground />}
            {!courseLoading && view === "books" && <Books />}
            {!courseLoading && typeof view === "number" && modules.length > 0 && (
              <ModuleView index={safeIndex} onGo={goModule} onBooks={() => goView("books")} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
