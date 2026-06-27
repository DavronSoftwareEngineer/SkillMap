import { useState } from "react";
import { useStore } from "../store";
import type { Book } from "../types";

// Bitta muqova: avval haqiqiy foto (Open Library), yuklanmasa dizayn-karta.
export function BookCover({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false);
  const src = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg?default=false`
    : null;
  return (
    <span className="bookcover">
      <span className="bc-num">{book.n}</span>
      <span className="bc-art">
        <span className="t">{book.title}</span>
        <span className="a">{book.author}</span>
      </span>
      {src && !failed && (
        <img
          src={src}
          alt={`${book.title} - ${book.author}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export function Books() {
  const { course } = useStore();
  const books = course.books || [];

  if (books.length === 0) {
    return (
      <div className="dash">
        <div className="eyebrow">Kitoblar</div>
        <h2 className="mtitle">Kitoblar</h2>
        <p className="mlede">Bu kurs uchun tavsiya etilgan kitoblar hozircha yo'q.</p>
      </div>
    );
  }

  return (
    <div className="dash">
      <div className="eyebrow">Kitoblar / O'qish ro'yxati</div>
      <h2 className="mtitle">{course.name} - tavsiya etilgan kitoblar</h2>
      <p className="mlede">
        Quyidagi tartibda o'qish tavsiya etiladi - har biri oldingisining ustiga quriladi. Kitob
        o'qish bilan birga kursdagi amaliy mashqlarni ham bajar.
      </p>
      <div className="booklist">
        {books.map((b) => (
          <div className="bookcard" key={b.n} style={{ ["--bc" as string]: b.accent }}>
            <BookCover book={b} />
            <span className="bookmeta">
              <b>{b.title}</b>
              <span className="author">{b.author}</span>
              <span className="note">{b.note}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
