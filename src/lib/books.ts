import type { Book } from "../types";

export type BookAccess = "free" | "library" | "official";
export type BookReaderMode = "source" | "google";

export interface BookLink {
  url: string;
  access: BookAccess;
  label: string;
  source: string;
  reader?: BookReaderMode;
}

const FREE = (url: string, source: string): BookLink => ({
  url,
  access: "free",
  label: "Bepul o'qish",
  source,
});

const OFFICIAL = (url: string, source: string): BookLink => ({
  url,
  access: "official",
  label: "Rasmiy e-kitob",
  source,
});

const LIBRARY = (url: string, source: string): BookLink => ({
  url,
  access: "library",
  label: "Kutubxona / preview",
  source,
});

const LINKS_BY_ISBN: Record<string, BookLink> = {
  "9781593279509": FREE("https://eloquentjavascript.net/", "Muallif sayti"),
  "9781091210099": {
    ...FREE("https://github.com/getify/You-Dont-Know-JS", "Muallif GitHub'i"),
    reader: "google",
  },
  "9781484200773": FREE("https://git-scm.com/book/en/v2", "Git rasmiy sayti"),
  "9781119642787": FREE("https://www.cl.cam.ac.uk/archive/rja14/book.html", "Cambridge / muallif"),
};

const LINKS_BY_TITLE: Record<string, BookLink> = {
  "Geographic Data Science with Python": FREE(
    "https://geographicdata.science/book/index.html",
    "Open textbook",
  ),
  "The Road to React": OFFICIAL("https://www.roadtoreact.com/", "Muallif sayti"),
  "Refactoring UI": OFFICIAL("https://www.refactoringui.com/", "Mualliflar sayti"),
  "Telegram Bot API": FREE("https://core.telegram.org/bots/api", "Telegram Docs"),
  "grammY Guide": FREE("https://grammy.dev/guide/", "grammY Docs"),
  "Blue Team Handbook: SOC, SIEM and Threat Hunting": OFFICIAL(
    "https://www.blueteamhandbook.com/home.html",
    "Muallif sayti",
  ),
  "Поехали!": LIBRARY(
    "https://rusneb.ru/catalog/000199_000009_009908568/",
    "Rossiya Milliy elektron kutubxonasi",
  ),
  "Русский язык в упражнениях": FREE(
    "https://search.rsl.ru/ru/record/01007051412",
    "Rossiya Davlat kutubxonasi",
  ),
  "Madinah Arabic Reader (Durus al-lug'a)": FREE(
    "https://www.lqtoronto.com/downloads.html",
    "LQ Toronto",
  ),
  "85% of Qur'anic Words": FREE(
    "https://download.understandquran.com/fileadmin/user_upload/free_trial/85_of_Quranic_Word_English_Book.pdf",
    "Understand Quran Academy",
  ),
};

export function getBookLink(book: Book): BookLink | null {
  const byTitle = LINKS_BY_TITLE[book.title];
  if (byTitle) return byTitle;

  if (!book.isbn) return null;

  const byIsbn = LINKS_BY_ISBN[book.isbn];
  if (byIsbn) return byIsbn;

  return LIBRARY(`https://openlibrary.org/isbn/${encodeURIComponent(book.isbn)}`, "Open Library");
}

export function getDefaultBookReaderMode(book: Book, link: BookLink): BookReaderMode {
  if (link.reader) return link.reader;
  if (book.isbn && link.access !== "free") return "google";
  return "source";
}
