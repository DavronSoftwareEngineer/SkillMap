import { useEffect, useState } from "react";
import { useStore } from "../store";
import { RichHtml } from "./RichHtml";
import { CodeBlock } from "./CodeBlock";
import { Quiz } from "./Quiz";
import { Exercises } from "./Exercises";
import { BookCover } from "./Books";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#0B1014" strokeWidth={3}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CheckTeal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export function ModuleView({
  index,
  onGo,
  onBooks,
}: {
  index: number;
  onGo: (i: number) => void;
  onBooks: () => void;
}) {
  const { course, isDone, toggleTask } = useStore();
  const modules = course.modules;
  const L = course.labels;
  const m = modules[index];
  const [tab, setTab] = useState("doc");

  // Shu modulga biriktirilgan kitob (kurs moduleBooks[zoom] -> books[] dan).
  const refN = course.moduleBooks?.[m.zoom];
  const refBook = refN ? course.books?.find((b) => b.n === refN) : undefined;

  useEffect(() => {
    setTab("doc");
  }, [index, course.id]);

  const doneCount = m.tasks.filter((t) => isDone(t.id)).length;
  const donePct = m.tasks.length ? Math.round((doneCount / m.tasks.length) * 100) : 0;

  const tabs = [
    { p: "doc", label: L.doc, show: true, badge: "" },
    { p: "code", label: L.code, show: m.code.length > 0, badge: "" },
    { p: "ex", label: L.ex, show: (m.exercises?.length || 0) > 0, badge: `${m.exercises?.length || 0}` },
    { p: "task", label: L.task, show: m.tasks.length > 0, badge: `${doneCount}/${m.tasks.length}` },
    { p: "quiz", label: L.quiz, show: m.quiz.length > 0, badge: `${m.quiz.length}` },
    { p: "vid", label: L.vid, show: m.resources.length > 0, badge: "" },
    { p: "proj", label: L.proj, show: !!m.project, badge: "" },
  ].filter((t) => t.show);

  const prev = modules[index - 1];
  const next = modules[index + 1];

  return (
    <div className="module-view learning-workspace" key={course.id + "-" + index}>
      <section className="module-hero">
        <div className="module-hero-copy">
          <div className="eyebrow">{m.eyebrow}</div>
          <h2 className="mtitle">{m.mtitle}</h2>
          <p className="mlede" dangerouslySetInnerHTML={{ __html: m.lede }} />
        </div>
        <aside className="module-status-card" aria-label="Modul holati">
          <span className="msc-kicker">Learning workspace</span>
          <b>{m.zoom}</b>
          <span>{m.sub}</span>
          <div className="msc-bar">
            <i style={{ width: donePct + "%" }} />
          </div>
          <div className="msc-row">
            <span>{doneCount}/{m.tasks.length} task</span>
            <span>{donePct}%</span>
          </div>
          <div className="msc-mini">
            <span>{tabs.length} bo'lim</span>
            {m.quiz.length > 0 && <span>{m.quiz.length} test</span>}
          </div>
        </aside>
      </section>

      {refBook && (
        <button className="modbook" style={{ ["--bc" as string]: refBook.accent }} onClick={onBooks}>
          <BookCover book={refBook} />
          <span className="mb-tx">
            <small>Kitob Bu modulga oid kitob</small>
            <b>{refBook.title}</b>
            <span>{refBook.author}</span>
          </span>
          <span className="mb-go">Kitoblar -&gt;</span>
        </button>
      )}

      <section className="workspace-panel">
        <div className="tabs">
          {tabs.map((t) => (
            <button key={t.p} className={"tab" + (tab === t.p ? " active" : "")} onClick={() => setTab(t.p)}>
              {t.label}
              {t.badge && <span className="cnt">{t.badge}</span>}
            </button>
          ))}
        </div>

        <div className="panel active" key={tab}>
        {tab === "doc" && <RichHtml className="prose" html={m.doc} />}

        {tab === "code" && (
          <div>
            {m.code.map((block, i) => (
              <CodeBlock key={i} block={block} />
            ))}
          </div>
        )}

        {tab === "ex" && <Exercises items={m.exercises || []} />}

        {tab === "task" && (
          <div className="tasklist">
            {m.tasks.map((t) => {
              const done = isDone(t.id);
              return (
                <div key={t.id} className={"task" + (done ? " checked" : "")} onClick={() => toggleTask(t.id)}>
                  <div className="box">
                    <CheckIcon />
                  </div>
                  <div className="tx">
                    <span dangerouslySetInnerHTML={{ __html: t.html }} />
                    {t.crit && <small className="crit">{t.crit}</small>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "quiz" && <Quiz zoom={m.zoom} questions={m.quiz} />}

        {tab === "vid" && (
          <div className="reslist">
            {m.resources.map((r, i) => (
              <a key={i} className={"res" + (r.type === "doc" ? " doc" : "")} href={r.url} target="_blank" rel="noopener noreferrer">
                <span className="ric">{r.type === "doc" ? <DocIcon /> : <PlayIcon />}</span>
                <div>
                  <b>{r.title}</b>
                  <span>{r.desc}</span>
                  <span className="host">{r.host}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {tab === "proj" && m.project && (
          <div className="project">
            <div className="phead">
              <span className="tag">{m.project.tag}</span>
              <h3>{m.project.title}</h3>
              <p>{m.project.desc}</p>
            </div>
            <div className="pbody">
              <div className="feat">
                {m.project.features.map((f, i) => (
                  <div key={i}>
                    <CheckTeal />
                    {f}
                  </div>
                ))}
              </div>
              {m.project.rubric && (
                <div className="rubric">
                  <h4>Yakuniy loyiha rubrikasi</h4>
                  <ul>
                    {m.project.rubric.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {m.project.variants && (
                <div className="project-variants">
                  <h4>Tanlov variantlari</h4>
                  <div className="variant-grid">
                    {m.project.variants.map((variant, i) => (
                      <article className="variant-card" key={i}>
                        <b>{variant.title}</b>
                        <p>{variant.desc}</p>
                        <ul>
                          {variant.deliverables.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </section>

      <div className="pager">
        {prev ? (
          <button onClick={() => onGo(index - 1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="lab">
              <small>Oldingi</small>
              <b>{prev.title}</b>
            </span>
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button className="next" onClick={() => onGo(index + 1)}>
            <span className="lab">
              <small>Keyingi</small>
              <b>{next.title}</b>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
