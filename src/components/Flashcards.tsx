import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store";
import { speak, canSpeak } from "../lib/speech";
import { dueWords, masteredCount, isMastered, MAX_BOX } from "../lib/srs";
import type { Grade } from "../lib/srs";
import type { Vocab } from "../types";

function SpeakBtn({ text, lang, label }: { text: string; lang: string; label: string }) {
  if (!canSpeak()) return null;
  return (
    <button
      className="speakbtn"
      title="Eshitish"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        speak(text, lang);
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M19 5a9 9 0 0 1 0 14" />
      </svg>
    </button>
  );
}

export function Flashcards() {
  const { course, courseId, srs, gradeVocab, resetSrs } = useStore();
  const isLang = courseId === "english" || courseId === "russian";
  const speakLang = courseId === "russian" ? "ru-RU" : "en-US";

  const allVocab = useMemo(() => {
    const list: Vocab[] = [];
    const seen = new Set<string>();
    course.modules.forEach((m) =>
      (m.vocab || []).forEach((v) => {
        if (!seen.has(v.w)) {
          seen.add(v.w);
          list.push(v);
        }
      })
    );
    return list;
  }, [course, courseId]);

  const words = useMemo(() => allVocab.map((v) => v.w), [allVocab]);
  // Takror navbati — bir marta hisoblanadi (har baholashда qayta tartiblanib
  // sakrab ketmasligi uchun). Baholangan so'z navbatdан olib tashlanadi.
  const initialQueue = useMemo(
    () => dueWords(words, srs, Date.now()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [words]
  );
  const [queue, setQueue] = useState<string[]>(initialQueue);
  const [flipped, setFlipped] = useState(false);

  // Kurs almashganda navbatни yangilaymiz.
  useEffect(() => {
    setQueue(dueWords(words, srs, Date.now()));
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, words]);

  const byWord = useMemo(() => {
    const o: Record<string, Vocab> = {};
    allVocab.forEach((v) => (o[v.w] = v));
    return o;
  }, [allVocab]);

  const mastered = masteredCount(words, srs);
  const current = queue[0];
  const card = current ? byWord[current] : null;

  const doGrade = (g: Grade) => {
    if (!current) return;
    gradeVocab(current, g);
    setFlipped(false);
    setQueue((q) => q.slice(1));
  };
  const skip = () => {
    setFlipped(false);
    setQueue((q) => (q.length > 1 ? [...q.slice(1), q[0]] : q));
  };
  const restart = () => {
    setQueue(words.slice());
    setFlipped(false);
  };

  // Klaviatura: Space = ag'darish, 1/2/3 = baho, → = keyingisi.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!card) return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "1") doGrade("again");
      else if (e.key === "2") doGrade("good");
      else if (e.key === "3") doGrade("easy");
      else if (e.key === "ArrowRight") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, current]);

  if (allVocab.length === 0) {
    return (
      <div className="dash">
        <div className="eyebrow">Lug'at · Flashcards</div>
        <h2 className="mtitle">Lug'at</h2>
        <p className="mlede">Bu kursда flashcard lug'at hozircha yo'q.</p>
      </div>
    );
  }

  const done = !card;

  return (
    <div className="dash">
      <div className="eyebrow">Lug'at · Flashcards (interval takror)</div>
      <h2 className="mtitle">Lug'at takrori</h2>
      <p className="mlede">
        Kartani ag'darib ma'noni ko'r, keyin o'zingni bahola:{" "}
        <strong>Qiyin</strong> tez qaytadi, <strong>Bilaman</strong> kechroq, <strong>Oson</strong> eng
        kech. So'z {MAX_BOX}-darajaga yetса — o'zlashtirilgan hisoblanadi.
        {isLang && canSpeak() && " Talaffuz uchun 🔊."}
        <br />
        <small style={{ opacity: 0.7 }}>Klaviatura: Space — ag'dar · 1 Qiyin · 2 Bilaman · 3 Oson · → keyingisi</small>
      </p>

      <div className="fc-head">
        <span className="qscore">
          O'zlashtirilgan: {mastered} / {words.length} &nbsp;·&nbsp; navbatда: {queue.length}
        </span>
        <button className="qreset" onClick={resetSrs}>
          Progressни tozalash
        </button>
      </div>

      {done ? (
        <div className="fc-done">
          <b>Barakalla!</b> Bugungi takror tugadi — hozir takror qilinishi kerak bo'lgan so'z qolmadi.
          Ertaga yana qayt yoki{" "}
          <button className="dgo" onClick={restart}>
            hammasini qaytadan ko'r
          </button>
          .
        </div>
      ) : (
        <>
          <button className={"flashcard" + (flipped ? " flipped" : "")} onClick={() => setFlipped((f) => !f)}>
            {!flipped ? (
              <div className="fc-front">
                <div className="fc-word">
                  <b>{card!.w}</b>
                  {isLang && <SpeakBtn text={card!.w} lang={speakLang} label={"Eshitish: " + card!.w} />}
                </div>
                {card!.ipa && <span className="fc-ipa">{card!.ipa}</span>}
                {card!.pos && <span className="fc-pos">{card!.pos}</span>}
                <span className="fc-tap">ma'no uchun bosing (Space)</span>
              </div>
            ) : (
              <div className="fc-back">
                <b>{card!.uz}</b>
                <div className="fc-exrow">
                  <span className="fc-ex">{card!.ex}</span>
                  {isLang && <SpeakBtn text={card!.ex} lang={speakLang} label="Misol gapni eshitish" />}
                </div>
                {isMastered(srs[current!]) && <span className="fc-pos">o'zlashtirilgan ✓</span>}
              </div>
            )}
          </button>

          <div className="fc-actions srs">
            <button className="fc-grade again" onClick={() => doGrade("again")}>
              Qiyin <small>1</small>
            </button>
            <button className="fc-grade good" onClick={() => doGrade("good")}>
              Bilaman <small>2</small>
            </button>
            <button className="fc-grade easy" onClick={() => doGrade("easy")}>
              Oson <small>3</small>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
