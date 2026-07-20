import { useEffect, useRef, useState } from "react";

import type { Task } from "../types";
import type { GlossaryTerm, PreparedLesson } from "../lib/lesson";
import { stripHtml } from "../lib/lesson";
import { RichHtml } from "./RichHtml";

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="m12 3-9 5 9 5 9-5-9-5Z" />
    <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
  </svg>
);

const GaugeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="M20 13a8 8 0 1 0-16 0" />
    <path d="m12 13 4-4" />
    <path d="M5 18h14" />
  </svg>
);

const ExpandIcon = ({ collapse }: { collapse: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    {collapse ? (
      <>
        <path d="m7 10 5-5 5 5" />
        <path d="m7 14 5 5 5-5" />
      </>
    ) : (
      <>
        <path d="m7 5 5 5 5-5" />
        <path d="m7 19 5-5 5 5" />
      </>
    )}
  </svg>
);

export function LessonReader({
  lesson,
  tasks,
  glossary,
  level,
}: {
  lesson: PreparedLesson;
  tasks: Task[];
  glossary: GlossaryTerm[];
  level: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [allOpen, setAllOpen] = useState(!lesson.collapsible);
  const objectives = tasks.slice(0, 3).map((task) => stripHtml(task.html));

  useEffect(() => {
    setActiveIndex(0);
    setAllOpen(!lesson.collapsible);
  }, [lesson.html, lesson.collapsible]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || lesson.sections.length < 2) return;
    const sections = Array.from(root.querySelectorAll<HTMLDetailsElement>(".lesson-section"));

    const updateActive = () => {
      const anchor = Math.min(210, window.innerHeight * 0.3);
      let current = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= anchor) current = index;
      });
      setActiveIndex(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [lesson.html, lesson.sections.length]);

  const syncOpenState = () => {
    const sections = Array.from(
      rootRef.current?.querySelectorAll<HTMLDetailsElement>(".lesson-section") || [],
    );
    setAllOpen(sections.length > 0 && sections.every((section) => section.open));
  };

  const goToSection = (index: number) => {
    const section = rootRef.current?.querySelector<HTMLDetailsElement>(
      `#${lesson.sections[index].id}`,
    );
    if (!section) return;
    section.open = true;
    setActiveIndex(index);
    setAllOpen(false);
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const toggleAllSections = () => {
    const sections = Array.from(
      rootRef.current?.querySelectorAll<HTMLDetailsElement>(".lesson-section") || [],
    );
    const shouldOpen = sections.some((section) => !section.open);
    sections.forEach((section, index) => {
      section.open = shouldOpen || index === activeIndex;
    });
    setAllOpen(shouldOpen);
  };

  const progress = lesson.sections.length
    ? Math.round(((activeIndex + 1) / lesson.sections.length) * 100)
    : 100;

  return (
    <div className="lesson-reader" ref={rootRef} onClick={() => window.setTimeout(syncOpenState, 0)}>
      <section className="lesson-guide" aria-labelledby="lesson-guide-title">
        <div className="lesson-guide-top">
          <div>
            <span className="lesson-kicker">DARS KARTASI</span>
            <h3 id="lesson-guide-title">Nimani o'zlashtirasiz</h3>
          </div>
          <div className="lesson-facts" aria-label="Dars ko'rsatkichlari">
            <span title="Taxminiy nazariya o'qish vaqti">
              <ClockIcon /> {lesson.readingMinutes} daqiqa
            </span>
            <span title="Darsdagi mavzu bo'limlari">
              <LayersIcon /> {lesson.sections.length || 1} bo'lim
            </span>
            <span title="Modul murakkablik bosqichi">
              <GaugeIcon /> {level}
            </span>
          </div>
        </div>

        {objectives.length > 0 && (
          <ol className="lesson-objectives" aria-label="Asosiy amaliy natijalar">
            {objectives.map((objective, index) => (
              <li key={`${index}-${objective}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{objective}</p>
              </li>
            ))}
          </ol>
        )}

        {glossary.length > 0 && (
          <div className="lesson-glossary" aria-label="Dars terminlari">
            <b>Terminlar</b>
            {glossary.map((item) => (
              <abbr key={item.term} title={item.definition} tabIndex={0}>
                {item.term}
              </abbr>
            ))}
          </div>
        )}
      </section>

      {lesson.sections.length > 1 && (
        <nav className="lesson-outline" aria-label="Dars bo'limlari">
          <div className="lesson-outline-head">
            <div>
              <b>Dars bo'limlari</b>
              <span>{activeIndex + 1}/{lesson.sections.length} bo'lim</span>
            </div>
            <button
              type="button"
              className="lesson-expand"
              onClick={toggleAllSections}
              aria-label={allOpen ? "Faqat joriy bo'limni ochiq qoldirish" : "Barcha bo'limlarni ochish"}
              title={allOpen ? "Faqat joriy bo'limni ochiq qoldirish" : "Barcha bo'limlarni ochish"}
            >
              <ExpandIcon collapse={allOpen} />
            </button>
          </div>
          <div className="lesson-progress" aria-hidden="true">
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="lesson-outline-list">
            {lesson.sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                className={index === activeIndex ? "active" : ""}
                aria-current={index === activeIndex ? "step" : undefined}
                onClick={() => goToSection(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{section.title}</b>
              </button>
            ))}
          </div>
        </nav>
      )}

      <RichHtml className="prose lesson-prose" html={lesson.html} glossary={glossary} />
    </div>
  );
}
