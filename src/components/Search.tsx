import { useMemo, useState } from "react";
import { useStore } from "../store";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
}

interface Hit {
  i: number;
  zoom: string;
  title: string;
  kind: string;
  snippet: string;
}

// Topilgan so'z atrofidan qisqa parcha kesib oladi.
function snippet(text: string, q: string): string {
  const at = text.toLowerCase().indexOf(q);
  if (at < 0) return text.slice(0, 120);
  const start = Math.max(0, at - 40);
  const end = Math.min(text.length, at + q.length + 60);
  return (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
}

export function Search({ onGo }: { onGo: (i: number) => void }) {
  const { course, courseId } = useStore();
  const [q, setQ] = useState("");

  // Har modul uchun qidiriladigan matnni oldindan tayyorlaymiz.
  const index = useMemo(() => {
    return course.modules.map((m) => ({
      zoom: m.zoom,
      title: m.title,
      fields: [
        { kind: "Dars", text: stripHtml(m.doc) },
        { kind: "Sarlavha", text: m.title + " " + m.sub + " " + m.mtitle },
        { kind: "Topshiriq", text: m.tasks.map((t) => stripHtml(t.html)).join(" / ") },
        { kind: "Lug'at", text: (m.vocab || []).map((v) => `${v.w} ${v.uz} ${v.ex}`).join(" / ") },
        { kind: "Grammatika", text: (m.grammar || []).map((g) => `${g.topic} ${g.rule} ${g.ex}`).join(" / ") },
        { kind: "Test", text: m.quiz.map((qq) => qq.q).join(" / ") },
      ].filter((f) => f.text.trim().length > 0),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const hits: Hit[] = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    const out: Hit[] = [];
    index.forEach((m, i) => {
      m.fields.forEach((f) => {
        if (f.text.toLowerCase().includes(needle)) {
          out.push({ i, zoom: m.zoom, title: m.title, kind: f.kind, snippet: snippet(f.text, needle) });
        }
      });
    });
    return out;
  }, [q, index]);

  return (
    <div className="dash">
      <div className="eyebrow">Qidiruv / {course.name}</div>
      <h2 className="mtitle">Kurs bo'ylab qidirish</h2>
      <p className="mlede">
        Darslar, topshiriqlar, lug'at, grammatika va testlar ichidan qidir - to'g'ridan-to'g'ri kerakli
        modulga o't.
      </p>

      <input
        className="ref-search"
        placeholder="Kamida 2 harf yoz (masalan: PostGIS, present perfect, byudjet...)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />

      {q.trim().length >= 2 && (
        <p className="dnote">
          {hits.length > 0 ? `${hits.length} ta natija topildi` : "Hech narsa topilmadi."}
        </p>
      )}

      <div className="search-hits">
        {hits.map((h, k) => (
          <button className="dash-modrow" key={k} onClick={() => onGo(h.i)}>
            <div className="dmod-info">
              <b>
                {h.zoom} / {h.title}
              </b>
              <span>{h.snippet}</span>
            </div>
            <span className="search-kind">{h.kind}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
