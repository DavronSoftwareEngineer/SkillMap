import { useMemo, useRef } from "react";
import type { ChangeEvent } from "react";
import { useStore } from "../store";
import { dayKey, isAlive } from "../lib/streak";

export function Dashboard({ onGo }: { onGo: (i: number) => void }) {
  const { progress, quizScores, course, streak, exportBackup, importBackup } = useStore();
  const MODULES = course.modules;
  const fileRef = useRef<HTMLInputElement>(null);
  const streakAlive = isAlive(streak, dayKey(new Date()));

  const onImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importBackup(String(reader.result || ""));
    reader.readAsText(file);
    e.target.value = "";
  };

  const d = useMemo(() => {
    const mods = MODULES.map((m, i) => {
      const total = m.tasks.length;
      const done = m.tasks.filter((t) => progress[t.id]).length;
      const qz = quizScores[m.zoom];
      return {
        i,
        title: m.title,
        sub: m.sub,
        zoom: m.zoom,
        done,
        total,
        tpct: total ? Math.round((done / total) * 100) : 0,
        quiz: qz ? Math.round((qz.best / qz.total) * 100) : null,
      };
    });
    const totalTasks = mods.reduce((a, m) => a + m.total, 0);
    const doneTasks = mods.reduce((a, m) => a + m.done, 0);
    const overall = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const att = mods.filter((m) => m.quiz !== null);
    const quizAvg = att.length
      ? Math.round(att.reduce((a, m) => a + (m.quiz as number), 0) / att.length)
      : null;
    const fullMods = mods.filter((m) => m.tpct === 100).length;
    const next = mods.find((m) => m.tpct < 100);
    const weak = mods
      .filter((m) => m.tpct < 100)
      .sort((a, b) => a.tpct - b.tpct || (a.quiz ?? 101) - (b.quiz ?? 101))
      .slice(0, 3);
    return { mods, totalTasks, doneTasks, overall, quizAvg, fullMods, next, weak };
  }, [progress, quizScores, MODULES]);

  let level: string;
  let msg: string;
  if (d.overall < 25) {
    level = "Boshlang'ich";
    msg = "Asoslarni qo'yyapsan - davom et.";
  } else if (d.overall < 55) {
    level = "Asoslar shakllanmoqda";
    msg = "Yaxshi ketyapsan, sur'atni saqla.";
  } else if (d.overall < 80) {
    level = "O'rta daraja";
    msg = "Yarmidan oshding - chuqurlash.";
  } else if (d.overall < 95) {
    level = "Yuqori daraja";
    msg = "Deyarli tayyor - amaliyotni kuchaytir.";
  } else {
    level = "Tayyor";
    msg = "Barchasini o'zlashtirding - endi qo'llab mustahkamla.";
  }

  const C = 2 * Math.PI * 52;

  return (
    <div className="dash command-center">
      <section className="cc-hero">
        <div className="cc-copy">
          <div className="eyebrow">Tayyorlik paneli / {course.name}</div>
          <h2 className="mtitle">Bugungi yo'l xaritang</h2>
          <p className="mlede">
            Kursni oddiy ro'yxat emas, bosqichma-bosqich yo'l sifatida kuzat. Keyingi qadam,
            zaif joylar va umumiy tayyorlik shu yerda jamlangan.
          </p>
          {d.next && (
            <button className="cc-primary" onClick={() => onGo(d.next!.i)}>
              {d.next.zoom} modulni davom ettirish
            </button>
          )}
        </div>
        <div className="dash-ring">
          <svg width="150" height="150">
            <circle cx="75" cy="75" r="52" fill="none" stroke="#263340" strokeWidth="10" />
            <circle
              className="ring-fg"
              cx="75"
              cy="75"
              r="52"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - d.overall / 100)}
            />
          </svg>
          <div className="pct">
            <b>{d.overall}%</b>
            <span>tayyorlik</span>
          </div>
        </div>
      </section>

      <div className="dash-top">
        <div className="dash-summary">
          <div className="dash-level">{level}</div>
          <p className="dash-levelmsg">{msg}</p>
          <div className="dash-stats">
            <div className="dstat">
              <b>{d.doneTasks}/{d.totalTasks}</b>
              <span>topshiriq</span>
            </div>
            <div className="dstat">
              <b>{d.quizAvg !== null ? d.quizAvg + "%" : "-"}</b>
              <span>test o'rtachasi</span>
            </div>
            <div className="dstat">
              <b>{d.fullMods}/{d.mods.length}</b>
              <span>tugatilgan modul</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-next">
        {d.next ? (
          <>
            <b>Keyingi qadam:</b> {d.next.zoom} / {d.next.title} - amaliyot {d.next.tpct}% bajarilgan.{" "}
            <button className="dgo" onClick={() => onGo(d.next!.i)}>
              O'tish -&gt;
            </button>
          </>
        ) : (
          <>
            <b>Ajoyib!</b> Bu kursdagi barcha topshiriq bajarilgan. Endi o'rganganingni amalda qo'llab
            mustahkamla.
          </>
        )}
      </div>

      {d.quizAvg !== null && d.quizAvg < 70 && (
        <p className="dnote">
          Test o'rtachang {d.quizAvg}% - zaif modullar testini qayta ishlab mustahkamla.
        </p>
      )}

      <div className="dash-streak">
        <div className={"streak-chip" + (streakAlive ? " alive" : "")}>
          <span className="streak-fire" aria-hidden="true">Streak</span>
          <div>
            <b>{streak.current} kun</b>
            <span>{streakAlive ? "joriy seriya" : "seriya uzildi - bugun davom ettir"}</span>
          </div>
          <div className="streak-best">
            <b>{streak.best}</b>
            <span>eng yaxshi</span>
          </div>
        </div>
        <div className="backup-row">
          <button className="backup-btn" onClick={exportBackup}>
            Zaxira eksport
          </button>
          <button className="backup-btn" onClick={() => fileRef.current?.click()}>
            Tiklash import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={onImportFile}
          />
        </div>
      </div>

      <h3 className="dash-h">Learning journey</h3>
      <div className="journey-map">
        {d.mods.map((m, order) => (
          <button
            className={"journey-node" + (m.tpct === 100 ? " done" : d.next?.i === m.i ? " current" : "")}
            key={m.zoom}
            onClick={() => onGo(m.i)}
          >
            <span className="jn-step">{String(order + 1).padStart(2, "0")}</span>
            <span className="jn-main">
              <b>{m.title}</b>
              <small>{m.zoom} / {m.sub}</small>
            </span>
            <span className="jn-pct">{m.tpct}%</span>
          </button>
        ))}
      </div>

      <h3 className="dash-h">Modullar bo'yicha</h3>
      <div className="dash-mods">
        {d.mods.map((m) => (
          <div className="dash-modrow" key={m.zoom} onClick={() => onGo(m.i)}>
            <div className="dmod-info">
              <b>{m.zoom} / {m.title}</b>
              <span>{m.sub}</span>
            </div>
            <div className="dmod-metrics">
              <div className="dbar">
                <i style={{ width: m.tpct + "%" }} />
              </div>
              <span className="dmod-pct">{m.tpct}%</span>
              <span className={"dquiz " + (m.quiz === null ? "none" : m.quiz >= 70 ? "good" : "low")}>
                {m.quiz === null ? "test -" : "test " + m.quiz + "%"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {d.weak.length > 0 && (
        <>
          <h3 className="dash-h">Eng zaif joylar</h3>
          <div className="dash-weak">
            {d.weak.map((m) => (
              <button className="weakchip" key={m.zoom} onClick={() => onGo(m.i)}>
                {m.zoom} / {m.title} ({m.tpct}%)
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
