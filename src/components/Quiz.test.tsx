import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Quiz } from "./Quiz";
import { StoreProvider, useStore } from "../store";
import type { QuizQuestion } from "../types";

const QUESTIONS: QuizQuestion[] = [
  { q: "2 + 2 = ?", a: ["3", "4", "5"], c: 1, w: "To'rt." },
  { q: "Osmon rangi?", a: ["yashil", "ko'k"], c: 1, w: "Ko'k." },
];

// Quiz recordQuiz orqali store'ga yozadi — natijani o'qish uchun probe.
function ScoreProbe() {
  const { quizScores } = useStore();
  const s = quizScores.z1;
  return <div data-testid="score">{s ? `${s.best}/${s.total}` : "yo'q"}</div>;
}

function renderQuiz() {
  const { container } = render(
    <StoreProvider>
      <Quiz zoom="z1" questions={QUESTIONS} />
      <ScoreProbe />
    </StoreProvider>
  );
  // Variant tugmalari .qopt; tartibi: Q1[0..2], Q2[0..1].
  const opts = () => Array.from(container.querySelectorAll<HTMLButtonElement>(".qopt"));
  return { opts };
}

describe("Quiz komponenti", () => {
  it("boshlang'ich natija 0 va barcha savol ko'rinadi", () => {
    renderQuiz();
    expect(screen.getByText(/Natija: 0 \/ 2/)).toBeInTheDocument();
    expect(screen.getByText(/2 \+ 2/)).toBeInTheDocument();
    expect(screen.getByText(/Osmon rangi/)).toBeInTheDocument();
  });

  it("to'g'ri variant tanlansa natija oshadi", async () => {
    const user = userEvent.setup();
    const { opts } = renderQuiz();
    await user.click(opts()[1]); // Q1 to'g'ri javob ("4")
    expect(screen.getByText(/Natija: 1 \/ 2/)).toBeInTheDocument();
  });

  it("hammasiga javob berilganda eng yaxshi natija store'ga yoziladi", async () => {
    const user = userEvent.setup();
    const { opts } = renderQuiz();
    expect(screen.getByTestId("score")).toHaveTextContent("yo'q");

    await user.click(opts()[1]); // Q1 to'g'ri
    await user.click(opts()[4]); // Q2 to'g'ri ("ko'k")

    expect(screen.getByTestId("score")).toHaveTextContent("2/2");
  });

  it("javob berilgach o'sha savol qulflanadi (qayta tanlab bo'lmaydi)", async () => {
    const user = userEvent.setup();
    const { opts } = renderQuiz();
    await user.click(opts()[0]); // Q1 noto'g'ri tanlov ("3")
    await user.click(opts()[1]); // qulflangani uchun e'tiborga olinmaydi
    expect(screen.getByText(/Natija: 0 \/ 2/)).toBeInTheDocument();
  });
});
