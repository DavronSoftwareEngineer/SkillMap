import { useEffect, useRef, useState } from "react";
import type { Exercise } from "../types";
import { speak, canSpeak, canRecognize, recognize } from "../lib/speech";
import type { SpeechListener } from "../lib/speech";

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:'"]+/g, "")
    .replace(/\s+/g, " ");
}

// Talaffuz baholash: nishon so'zlarining nechtasi aytilganда uchraydi (0..1).
// STT mukammal emas, shuning uchun aniq moslik emas - so'z qamrovi o'lchanadi.
function speechScore(target: string, spoken: string): number {
  const t = normalize(target).split(" ").filter(Boolean);
  const s = new Set(normalize(spoken).split(" ").filter(Boolean));
  if (t.length === 0) return 0;
  const hit = t.filter((w) => s.has(w)).length;
  return hit / t.length;
}

function GapItem({ ex, idx }: { ex: Exercise; idx: number }) {
  const [val, setVal] = useState("");
  const [state, setState] = useState<null | "ok" | "no">(null);
  const accepted = (ex.answers || []).map(normalize);
  const parts = ex.q.split("___");

  const check = () => {
    if (!val.trim()) return;
    setState(accepted.includes(normalize(val)) ? "ok" : "no");
  };

  return (
    <div className={"exc" + (state ? " " + state : "")}>
      <div className="exc-q">
        <span className="exc-n">{idx + 1}.</span>
        <span>
          {parts[0]}
          <input
            className="exc-input"
            value={val}
            placeholder="..."
            disabled={state === "ok"}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
          />
          {parts[1] || ""}
        </span>
      </div>
      <div className="exc-row">
        <button className="exc-btn" onClick={check} disabled={state === "ok"}>
          Tekshir
        </button>
        {ex.hint && state !== "ok" && <span className="exc-hint">Maslahat: {ex.hint}</span>}
        {state === "ok" && <span className="exc-fb ok">To'g'ri ✓</span>}
        {state === "no" && (
          <span className="exc-fb no">
            Xato - to'g'ri javob: <b>{(ex.answers || [])[0]}</b>
          </span>
        )}
      </div>
      {state && <div className="exc-why">{ex.why}</div>}
    </div>
  );
}

function ChoiceItem({ ex, idx }: { ex: Exercise; idx: number }) {
  const [pick, setPick] = useState<number | null>(null);
  const locked = pick !== null;
  return (
    <div className={"exc" + (locked ? (pick === ex.correct ? " ok" : " no") : "")}>
      <div className="exc-q">
        <span className="exc-n">{idx + 1}.</span>
        <span>{ex.q}</span>
      </div>
      <div className="exc-opts">
        {(ex.options || []).map((o, i) => {
          let cls = "exc-opt";
          if (locked) {
            if (i === ex.correct) cls += " correct";
            else if (i === pick) cls += " wrong";
            cls += " locked";
          }
          return (
            <button key={i} className={cls} onClick={() => !locked && setPick(i)}>
              {o}
            </button>
          );
        })}
      </div>
      {locked && <div className="exc-why">{ex.why}</div>}
    </div>
  );
}

function ListenItem({ ex, idx }: { ex: Exercise; idx: number }) {
  const [val, setVal] = useState("");
  const [state, setState] = useState<null | "ok" | "no">(null);
  const [played, setPlayed] = useState(false);
  const target = ex.say || "";
  const accepted = [target, ...(ex.answers || [])].map(normalize);
  const lang = ex.lang || "en-US";

  const play = () => {
    speak(target, lang);
    setPlayed(true);
  };
  const check = () => {
    if (!val.trim()) return;
    setState(accepted.includes(normalize(val)) ? "ok" : "no");
  };

  if (!canSpeak()) {
    return (
      <div className="exc">
        <div className="exc-q">
          <span className="exc-n">{idx + 1}.</span>
          <span>Tinglash mashqi - brauzeringiz ovozni qo'llab-quvvatlamaydi.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={"exc" + (state ? " " + state : "")}>
      <div className="exc-q">
        <span className="exc-n">{idx + 1}.</span>
        <span>{ex.q || "Eshitganingni yoz:"}</span>
        <button type="button" className="exc-listen" onClick={play} aria-label="Eshitish">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a9 9 0 0 1 0 14" />
          </svg>
          {played ? "Yana" : "Tingla"}
        </button>
      </div>
      <input
        className="exc-input wide"
        value={val}
        placeholder="eshitganingni shu yerga yoz..."
        disabled={state === "ok"}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
      />
      <div className="exc-row">
        <button className="exc-btn" onClick={check} disabled={state === "ok"}>
          Tekshir
        </button>
        {state === "ok" && <span className="exc-fb ok">To'g'ri ✓</span>}
        {state === "no" && (
          <span className="exc-fb no">
            Xato - to'g'ri javob: <b>{target}</b>
          </span>
        )}
      </div>
      {state && <div className="exc-why">{ex.why}</div>}
    </div>
  );
}

function SpeakItem({ ex, idx }: { ex: Exercise; idx: number }) {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [state, setState] = useState<null | "ok" | "close" | "no">(null);
  const listenerRef = useRef<SpeechListener | null>(null);
  const target = ex.say || "";
  const lang = ex.lang || "en-US";
  const targets = [target, ...(ex.answers || [])];

  useEffect(() => () => listenerRef.current?.stop(), []);

  const evaluate = (spoken: string) => {
    const best = Math.max(...targets.map((t) => speechScore(t, spoken)));
    setState(best >= 0.8 ? "ok" : best >= 0.5 ? "close" : "no");
  };

  const start = () => {
    setHeard("");
    setState(null);
    const l = recognize(lang, {
      onResult: (text, isFinal) => {
        setHeard(text);
        if (isFinal) evaluate(text);
      },
      onEnd: () => setListening(false),
      onError: () => setListening(false),
    });
    if (l) {
      listenerRef.current = l;
      setListening(true);
    }
  };
  const stop = () => {
    listenerRef.current?.stop();
    setListening(false);
    if (heard) evaluate(heard);
  };

  if (!canRecognize()) {
    return (
      <div className="exc">
        <div className="exc-q">
          <span className="exc-n">{idx + 1}.</span>
          <span>
            Gapirish mashqi: <b>{target}</b>
            {canSpeak() && (
              <button type="button" className="exc-listen" onClick={() => speak(target, lang)} aria-label="Namuna">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                </svg>
                Namuna
              </button>
            )}
            <br />
            <span className="exc-hint">Brauzeringiz nutq tanishni qo'llamaydi - namunani tinglab, ovoz chiqarib takrorla.</span>
          </span>
        </div>
        {ex.why && <div className="exc-why">{ex.why}</div>}
      </div>
    );
  }

  return (
    <div className={"exc" + (state ? " " + (state === "no" ? "no" : "ok") : "")}>
      <div className="exc-q">
        <span className="exc-n">{idx + 1}.</span>
        <span>{ex.q || "Ovoz chiqarib ayt:"}</span>
        {canSpeak() && (
          <button type="button" className="exc-listen" onClick={() => speak(target, lang)} aria-label="Namuna">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            </svg>
            Namuna
          </button>
        )}
      </div>
      <div className="exc-target"><b>{target}</b></div>
      <div className="exc-row">
        <button className="exc-btn" onClick={listening ? stop : start}>
          {listening ? "To'xtat" : "🎤 Gapir"}
        </button>
        {listening && <span className="exc-hint">Tinglanmoqda... jumlani ayt</span>}
      </div>
      {heard && (
        <div className="exc-why">
          Eshitildi: <i>{heard}</i>
        </div>
      )}
      {state === "ok" && <div className="exc-fb ok">Zo'r talaffuz ✓</div>}
      {state === "close" && <div className="exc-fb no">Yaqin - so'zlarni aniqroq ayt, yana urin</div>}
      {state === "no" && <div className="exc-fb no">Mos kelmadi - namunani tinglab, sekin takrorla</div>}
      {state && ex.why && <div className="exc-why">{ex.why}</div>}
    </div>
  );
}

export function Exercises({ items }: { items: Exercise[] }) {
  return (
    <div className="excset">
      <p className="qintro">
        Yozib, tanlab, tinglab yoki ovoz chiqarib javob ber - har biri darhol tekshiriladi va izoh chiqaradi.
      </p>
      {items.map((ex, i) =>
        ex.type === "gap" ? (
          <GapItem key={i} ex={ex} idx={i} />
        ) : ex.type === "listen" ? (
          <ListenItem key={i} ex={ex} idx={i} />
        ) : ex.type === "speak" ? (
          <SpeakItem key={i} ex={ex} idx={i} />
        ) : (
          <ChoiceItem key={i} ex={ex} idx={i} />
        )
      )}
    </div>
  );
}
