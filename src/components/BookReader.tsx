import { useState } from "react";
import type { Book } from "../types";
import { getBookLink, getDefaultBookReaderMode } from "../lib/books";
import type { BookReaderMode } from "../lib/books";
import { BookCover } from "./BookCover";
import { GoogleBookViewer } from "./GoogleBookViewer";

export function BookReader({ book, onBack }: { book: Book; onBack: () => void }) {
  const link = getBookLink(book);
  const [mode, setMode] = useState<BookReaderMode>(() =>
    link ? getDefaultBookReaderMode(book, link) : "source",
  );

  if (!link) return null;

  return (
    <div className="bookreader">
      <button className="reader-back" type="button" onClick={onBack}>
        <span aria-hidden="true">&#8592;</span>
        Kitoblar
      </button>

      <header className="reader-head" style={{ ["--bc" as string]: book.accent }}>
        <BookCover book={book} />
        <span className="reader-bookmeta">
          <span className={`bookaccess ${link.access}`}>{link.label}</span>
          <h2>{book.title}</h2>
          <b>{book.author}</b>
          <p>{book.note}</p>
        </span>
      </header>

      <div className="reader-toolbar">
        <div className="reader-modes" role="tablist" aria-label="O'qish manbasi">
          {book.isbn && (
            <button
              type="button"
              role="tab"
              aria-selected={mode === "google"}
              className={mode === "google" ? "active" : ""}
              onClick={() => setMode("google")}
            >
              Google Preview
            </button>
          )}
          <button
            type="button"
            role="tab"
            aria-selected={mode === "source"}
            className={mode === "source" ? "active" : ""}
            onClick={() => setMode("source")}
          >
            Rasmiy manba
          </button>
        </div>
        <span className="reader-source">{link.source}</span>
      </div>

      {mode === "google" && book.isbn ? (
        <GoogleBookViewer isbn={book.isbn} title={book.title} />
      ) : (
        <div className="source-book-stage">
          <iframe
            src={link.url}
            title={`${book.title} ichki reader`}
            className="source-book-frame"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-downloads allow-forms allow-modals allow-same-origin allow-scripts"
          />
          <div className="reader-frame-note">
            Kontent rasmiy manbadan yuklanadi. Publisher embedni bloklasa, ISBN mavjud kitobda Google Preview rejimini tanlang.
          </div>
        </div>
      )}
    </div>
  );
}
