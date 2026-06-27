import { COURSES } from "../data/courses";
import { useStore } from "../store";

const RING_C = 2 * Math.PI * 10;

export function Sidebar({
  open,
  active,
  dashActive,
  flashActive,
  refActive,
  searchActive,
  playActive,
  booksActive,
  onSelect,
  onDash,
  onFlash,
  onRef,
  onSearch,
  onPlay,
  onBooks,
  onClose,
}: {
  open: boolean;
  active: number;
  dashActive: boolean;
  flashActive: boolean;
  refActive: boolean;
  searchActive: boolean;
  playActive: boolean;
  booksActive: boolean;
  onSelect: (i: number) => void;
  onDash: () => void;
  onFlash: () => void;
  onRef: () => void;
  onSearch: () => void;
  onPlay: () => void;
  onBooks: () => void;
  onClose: () => void;
}) {
  const { course, courseId, setCourse, progress } = useStore();
  const modules = course.modules;
  const hasPlayground = !!course.playground;
  const hasBooks = (course.books?.length || 0) > 0;
  const hasVocab = modules.some((m) => (m.vocab?.length || 0) > 0);
  const hasGrammar = modules.some((m) => (m.grammar?.length || 0) > 0);
  const chooseCourse = (id: string) => {
    setCourse(id);
    onClose();
  };

  return (
    <>
      <div className={"scrim" + (open ? " show" : "")} onClick={onClose} />
      <aside className={"side" + (open ? " open" : "")}>
        <div className="course-switch">
          {COURSES.map((c) => (
            <button
              key={c.id}
              className={c.id === courseId ? "active" : ""}
              onClick={() => chooseCourse(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        <button className={"navitem toolbtn" + (searchActive ? " active" : "")} onClick={onSearch}>
          <span className="zoom dz2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <span className="nt"><b>Qidiruv</b><span>Search</span></span>
        </button>

        <button className={"navitem dashbtn" + (dashActive ? " active" : "")} onClick={onDash}>
          <span className="zoom dz">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 3v18h18" />
              <rect x="7" y="10" width="3" height="7" />
              <rect x="12" y="6" width="3" height="11" />
              <rect x="17" y="13" width="3" height="4" />
            </svg>
          </span>
          <span className="nt">
            <b>Tayyorlik paneli</b>
            <span>Dashboard</span>
          </span>
        </button>

        {hasPlayground && (
          <button className={"navitem toolbtn" + (playActive ? " active" : "")} onClick={onPlay}>
            <span className="zoom dz2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M13 2L3 14h7l-1 8 11-12h-7l0-8z" />
              </svg>
            </span>
            <span className="nt"><b>Playground</b><span>Jonli AI</span></span>
          </button>
        )}
        {hasVocab && (
          <button className={"navitem toolbtn" + (flashActive ? " active" : "")} onClick={onFlash}>
            <span className="zoom dz2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="14" height="16" rx="2" />
                <path d="M7 20h14V8" />
              </svg>
            </span>
            <span className="nt"><b>Lug'at</b><span>Flashcards</span></span>
          </button>
        )}
        {hasGrammar && (
          <button className={"navitem toolbtn" + (refActive ? " active" : "")} onClick={onRef}>
            <span className="zoom dz2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            <span className="nt"><b>Ma'lumotnoma</b><span>Grammar</span></span>
          </button>
        )}

        {hasBooks && (
          <button className={"navitem toolbtn" + (booksActive ? " active" : "")} onClick={onBooks}>
            <span className="zoom dz2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M9 7h7M9 11h7" />
              </svg>
            </span>
            <span className="nt"><b>Kitoblar</b><span>O'qish ro'yxati</span></span>
          </button>
        )}

        <span className="side-label">Bosqichlar / Layers</span>
        <nav>
          {modules.map((m, i) => {
            const total = m.tasks.length;
            const done = m.tasks.filter((t) => progress[t.id]).length;
            const frac = total ? done / total : 0;
            return (
              <button
                key={m.zoom}
                className={"navitem" + (!dashActive && active === i ? " active" : "")}
                onClick={() => onSelect(i)}
              >
                <span className="zoom">{m.zoom}</span>
                <span className="nt">
                  <b>{m.title}</b>
                  <span>{m.sub}</span>
                </span>
                <span className="ring">
                  <svg width="26" height="26">
                    <circle className="bg" cx="13" cy="13" r="10" fill="none" strokeWidth="2.5" />
                    <circle
                      className="fg"
                      cx="13"
                      cy="13"
                      r="10"
                      fill="none"
                      strokeWidth="2.5"
                      strokeDasharray={RING_C}
                      strokeDashoffset={RING_C * (1 - frac)}
                    />
                  </svg>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
