import { describe, expect, it } from "vitest";
import type { Book } from "../types";
import { getBookLink, getDefaultBookReaderMode } from "./books";

const book = (overrides: Partial<Book>): Book => ({
  n: 1,
  title: "Test book",
  author: "Test author",
  accent: "#fff",
  note: "Test note",
  ...overrides,
});

describe("kitob elektron manbalari", () => {
  it("ochiq litsenziyali ISBN uchun rasmiy bepul manbani tanlaydi", () => {
    expect(getBookLink(book({ isbn: "9781593279509" }))).toEqual({
      url: "https://eloquentjavascript.net/",
      access: "free",
      label: "Bepul o'qish",
      source: "Muallif sayti",
    });
  });

  it("ISBN bor kitob uchun Open Library fallback beradi", () => {
    expect(getBookLink(book({ isbn: "9780000000000" }))).toEqual({
      url: "https://openlibrary.org/isbn/9780000000000",
      access: "library",
      label: "Kutubxona / preview",
      source: "Open Library",
    });
  });

  it("ISBNsiz rasmiy qo'llanmani title orqali topadi", () => {
    expect(getBookLink(book({ title: "Telegram Bot API" }))).toMatchObject({
      url: "https://core.telegram.org/bots/api",
      access: "free",
    });
  });

  it("ISBNsiz va katalogda yo'q yozuvni link deb ko'rsatmaydi", () => {
    expect(getBookLink(book({}))).toBeNull();
  });

  it("copyright ISBN uchun Google preview'ni default qiladi", () => {
    const item = book({ isbn: "9780000000000" });
    const link = getBookLink(item);
    expect(link && getDefaultBookReaderMode(item, link)).toBe("google");
  });

  it("ochiq HTML kitob uchun rasmiy source readerni tanlaydi", () => {
    const item = book({ isbn: "9781593279509" });
    const link = getBookLink(item);
    expect(link && getDefaultBookReaderMode(item, link)).toBe("source");
  });
});
