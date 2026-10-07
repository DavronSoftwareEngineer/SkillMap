import { useState } from "react";
import type { Book } from "../types";

// Muqovasi mavjud bo'lmagan kitoblar darhol kurs rangidagi kartadan foydalanadi.
export function BookCover({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false);
  const src = book.isbn && book.cover !== "text"
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
