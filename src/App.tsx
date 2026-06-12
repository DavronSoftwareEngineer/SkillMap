import { useEffect, useState } from "react";
import { useStore } from "./store";
import { Topo } from "./components/Topo";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { ModuleView } from "./components/ModuleView";
import { Dashboard } from "./components/Dashboard";
import { Flashcards } from "./components/Flashcards";
import { Reference } from "./components/Reference";
import { Search } from "./components/Search";
import { Playground } from "./components/Playground";

type View = number | "dash" | "flash" | "ref" | "search" | "play";

export default function App() {
  const { progress, course, courseId } = useStore();
  const [view, setView] = useState<View>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setView(0);
  }, [courseId]);

  const modules = course.modules;
  const totalTasks = modules.reduce((a, m) => a + m.tasks.length, 0);
  const doneTasks = modules.reduce((a, m) => a + m.tasks.filter((t) => progress[t.id]).length, 0);
  const overall = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const goModule = (i: number) => {
    setView(i);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goView = (v: View) => {
    setView(v);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const safeIndex = typeof view === "number" ? Math.min(view, modules.length - 1) : -1;
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
      : modules[safeIndex].coord;

  return (
    <div className={"app course-" + courseId}>
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
            onSelect={goModule}
            onDash={() => goView("dash")}
            onFlash={() => goView("flash")}
            onRef={() => goView("ref")}
            onSearch={() => goView("search")}
            onPlay={() => goView("play")}
            onClose={() => setMenuOpen(false)}
          />
          <main className="main" key={courseId}>
            {view === "dash" && <Dashboard onGo={goModule} />}
            {view === "flash" && <Flashcards />}
            {view === "ref" && <Reference />}
            {view === "search" && <Search onGo={goModule} />}
            {view === "play" && <Playground />}
            {typeof view === "number" && <ModuleView index={safeIndex} onGo={goModule} />}
          </main>
        </div>
      </div>
    </div>
  );
}
