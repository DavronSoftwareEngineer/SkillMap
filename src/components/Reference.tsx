import { useMemo, useState } from "react";
import { useStore } from "../store";

export function Reference() {
  const { course, courseId } = useStore();
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    return course.modules
      .map((m) => ({
        zoom: m.zoom,
        title: m.title,
        items: (m.grammar || []).filter((g) => {
          if (!q.trim()) return true;
          const s = (g.topic + " " + g.rule + " " + g.ex).toLowerCase();
          return s.includes(q.trim().toLowerCase());
        }),
      }))
      .filter((grp) => grp.items.length > 0);
  }, [course, courseId, q]);

  const total = course.modules.reduce((a, m) => a + (m.grammar?.length || 0), 0);

  if (total === 0) {
    return (
      <div className="dash">
        <div className="eyebrow">Ma'lumotnoma · Reference</div>
        <h2 className="mtitle">Ma'lumotnoma</h2>
        <p className="mlede">Bu kursda grammatika ma'lumotnomasi hozircha yo'q.</p>
      </div>
    );
  }

  return (
    <div className="dash">
      <div className="eyebrow">Ma'lumotnoma · Reference</div>
      <h2 className="mtitle">Grammatika ma'lumotnomasi</h2>
      <p className="mlede">Barcha qoidalar bitta joyda — qidirib, tez eslab ol.</p>

      <input
        className="ref-search"
        placeholder="Qidirish (masalan: passive, present perfect, article...)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {groups.length === 0 && <p className="dnote">Hech narsa topilmadi.</p>}

      {groups.map((grp) => (
        <div className="ref-group" key={grp.zoom}>
          <h3 className="dash-h">
            {grp.zoom} · {grp.title}
          </h3>
          <div className="ref-list">
            {grp.items.map((g, i) => (
              <div className="ref-item" key={i}>
                <div className="ref-topic">{g.topic}</div>
                <div className="ref-rule">{g.rule}</div>
                <div className="ref-ex">{g.ex}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
