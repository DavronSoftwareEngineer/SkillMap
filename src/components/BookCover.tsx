import { useState } from "react";
import type { Book } from "../types";

// Avval haqiqiy muqova, yuklanmasa kurs rangidagi fallback ko'rinadi.
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

