import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Flashcards } from "./Flashcards";
import { StoreProvider } from "../store";

// Flashcards faol kursning lug'atini ko'rsatadi — English'da vocab bor.
// active_course localStorage'dan o'qiladi (saveJSON формати = JSON.stringify).
beforeEach(() => {
  localStorage.setItem("active_course", JSON.stringify("english"));
});

function renderFlashcards() {
  return render(
    <StoreProvider>
      <Flashcards />
    </StoreProvider>
  );
}

describe("Flashcards — SRS oqimi", () => {
  it("birinchi karta va o'zlashtirilgan hisobi ko'rinadi", async () => {
    renderFlashcards();
    // SRS bo'sh — barcha so'z navbatda, birinchisi 'hello'.
    expect(await screen.findByText("hello")).toBeInTheDocument();
    expect(screen.getByText(/O'zlashtirilgan: 0 \//)).toBeInTheDocument();
  });

  it("kartani bosish ma'noni ko'rsatadi (ag'darish)", async () => {
    const user = userEvent.setup();
    const { container } = renderFlashcards();
    await screen.findByText("hello");
    const card = container.querySelector<HTMLButtonElement>(".flashcard")!;
    await user.click(card);
    expect(screen.getByText("salom")).toBeInTheDocument(); // hello → salom
  });

  it("'Bilaman' baholansa keyingi kartaga o'tadi va SRS saqlanadi", async () => {
    const user = userEvent.setup();
    renderFlashcards();
    await screen.findByText("hello");

    await user.click(screen.getByRole("button", { name: /Bilaman/ }));

    // Navbatdagi keyingi so'z ('please') ko'rinadi, 'hello' yo'qoladi.
    expect(screen.getByText("please")).toBeInTheDocument();
    expect(screen.queryByText("hello")).not.toBeInTheDocument();

    // SRS holati localStorage'ga yozildi: 'hello' box 1 ('good').
    const srs = JSON.parse(localStorage.getItem("english_srs") || "{}");
    expect(srs.hello?.box).toBe(1);
  });

  it("navbatdagi so'zlar soni baholashdan keyin kamayadi", async () => {
    const user = userEvent.setup();
    const { container } = renderFlashcards();
    await screen.findByText("hello");

    const queueCount = () => {
      const m = container.querySelector(".qscore")!.textContent!.match(/navbat\S*:\s*(\d+)/);
      return Number(m![1]);
    };
    const before = queueCount();
    await user.click(screen.getByRole("button", { name: /Oson/ }));
    expect(queueCount()).toBe(before - 1);
  });
});
