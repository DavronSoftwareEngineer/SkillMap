import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuizQuestion } from "../types";
import { useStore } from "../store";

const LEVEL_LABEL: Record<NonNullable<QuizQuestion["level"]>, string> = {
  easy: "Oson",
  practical: "Amaliy",
  scenario: "Scenario",
};

export function Quiz({ zoom, questions }: { zoom: string; questions: QuizQuestion[] }) {
  const { recordQuiz } = useStore();
  const [picks, setPicks] = useState<Record<number, number>>({});

  // Yangi modul testiga o'tilganda tanlovlar tozalanadi.
  useEffect(() => setPicks({}), [zoom]);

  const answered = Object.keys(picks).length;
  const right = useMemo(
    () => Object.entries(picks).filter(([qi, oi]) => questions[+qi].c === oi).length,
    [picks, questions]
  );

  const pick = useCallback(
    (qi: number, oi: number) => {
      setPicks((prev) => {
        if (prev[qi] !== undefined || oi >= questions[qi].a.length) return prev;
        return { ...prev, [qi]: oi };
      });
    },
    [questions]
  );

  // Test natijasini render paytida emas, javoblar to'liq bo'lgach effektda yozamiz
  // (recordQuiz ota store'ni yangilaydi — render ichida chaqirib bo'lmaydi).
  useEffect(() => {
    if (questions.length > 0 && answered === questions.length) {
      recordQuiz(zoom, right, questions.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, questions.length, zoom]);

  // Klaviatura: raqam tugmasi birinchi javob berilmagan savolning variantini tanlaydi.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const n = parseInt(e.key, 10);
      if (!n || n < 1 || n > 9) return;
      const firstOpen = questions.findIndex((_, qi) => picks[qi] === undefined);
      if (firstOpen >= 0) pick(firstOpen, n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picks, questions, pick]);

  return (
    <div className="quiz">
      <p className="qintro">O'zingni tekshir — har savolga javob ber, izoh va ball darhol chiqadi.</p>
      <div className="qhead">
        <span className="qscore">
          Natija: {right} / {questions.length} &nbsp;·&nbsp; {answered} javob
        </span>
        <button className="qreset" onClick={() => setPicks({})}>
          Qayta boshlash
        </button>
      </div>
      {questions.map((item, qi) => {
        const locked = picks[qi] !== undefined;
        return (
          <div className="qcard" key={qi}>
            <div className="qq">
              <span>{qi + 1}. {item.q}</span>
              {item.level && <span className={"qlevel " + item.level}>{LEVEL_LABEL[item.level]}</span>}
            </div>
            <div className="qopts">
              {item.a.map((txt, oi) => {
                let cls = "qopt";
                let mk = "";
                if (locked) {
                  cls += " locked";
                  if (oi === item.c) {
                    cls += " correct";
                    mk = picks[qi] === oi ? "to'g'ri" : "to'g'ri javob";
                  } else if (picks[qi] === oi) {
                    cls += " wrong";
                    mk = "noto'g'ri";
                  }
                }
                return (
                  <button key={oi} className={cls} onClick={() => pick(qi, oi)}>
                    <span><span className="qk">{oi + 1}</span>{txt}</span>
                    <span className="mk">{mk}</span>
                  </button>
                );
              })}
            </div>
            <div className={"qwhy" + (locked ? " show" : "")}>{item.w}</div>
          </div>
        );
      })}
    </div>
  );
}
