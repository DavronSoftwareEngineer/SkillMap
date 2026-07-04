import { useStore, useTheme } from "../store";

export function TopBar({
  coord,
  overall,
  onDash,
  onMenu,
}: {
  coord: string;
  overall: number;
  onDash: () => void;
  onMenu: () => void;
}) {
  const { course } = useStore();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  return (
    <div className="topbar">
      <div className="brand">
        <button className="menubtn" onClick={onMenu} aria-label="Bo'limlar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="compass">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="var(--teal)" strokeWidth="1.4" />
            <path d="M12 5 L15 12 L12 19 L9 12 Z" fill="#F4A23C" />
            <circle cx="12" cy="12" r="1.4" fill="#0B1014" />
          </svg>
        </div>
        <div className="brand-txt">
          <h1>{course.brandTitle}</h1>
          <p>{course.brandSub}</p>
        </div>
      </div>
      <div className="topbar-right">
        <div className="coords">
          <span className="dot" />
          <span>{coord}</span>
        </div>
        <button
          className="themebtn"
          onClick={toggleTheme}
          aria-label={isLight ? "Tungi rejim" : "Kunduzgi rejim"}
          title={isLight ? "Tungi rejimga o'tish" : "Kunduzgi rejimga o'tish"}
        >
          {isLight ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          )}
        </button>
        <button className="progress-pill" onClick={onDash} aria-label="Tayyorlik paneli">
          <div className="bar">
            <i style={{ width: overall + "%" }} />
          </div>
          <b>{overall}%</b>
        </button>
      </div>
    </div>
  );
}
