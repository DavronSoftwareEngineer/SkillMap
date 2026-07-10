import { useEffect, useState } from "react";
import { useStore } from "../store";
import { getBookLink } from "../lib/books";
import { BookCover } from "./BookCover";
import { BookReader } from "./BookReader";

export function Books() {
  const { course } = useStore();
  const books = course.books || [];
  const [selectedBookN, setSelectedBookN] = useState<number | null>(null);
  const linkedBooks = books.map((book) => ({ book, link: getBookLink(book) }));
  const freeCount = linkedBooks.filter(({ link }) => link?.access === "free").length;
  const libraryCount = linkedBooks.filter(({ link }) => link?.access === "library").length;
  const officialCount = linkedBooks.filter(({ link }) => link?.access === "official").length;
  const selectedBook = selectedBookN === null ? null : books.find((book) => book.n === selectedBookN);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [selectedBookN]);

  if (books.length === 0) {
    return (
      <div className="dash">
        <div className="eyebrow">Kitoblar</div>
        <h2 className="mtitle">Kitoblar</h2>
        <p className="mlede">Bu kurs uchun tavsiya etilgan kitoblar hozircha yo'q.</p>
      </div>
    );
  }

  if (selectedBook) {
    return (
      <BookReader
        book={selectedBook}
        onBack={() => setSelectedBookN(null)}
      />
    );
  }

  return (
    <div className="dash">
      <div className="eyebrow">Kitoblar / O'qish ro'yxati</div>
      <h2 className="mtitle">{course.name} - tavsiya etilgan kitoblar</h2>
      <p className="mlede">
        Har bir karta SkillMap ichki readerida ochiladi. Ochiq kitoblar to'liq o'qiladi;
        mualliflik huquqi bilan himoyalangan nashrlarda kutubxona, Google Preview yoki rasmiy manba ko'rsatiladi.
      </p>
      <div className="booklegend" aria-label="Elektron kitob access turlari">
        {freeCount > 0 && <span className="free">{freeCount} bepul</span>}
        {libraryCount > 0 && <span className="library">{libraryCount} kutubxona / preview</span>}
        {officialCount > 0 && <span className="official">{officialCount} rasmiy e-kitob</span>}
      </div>
      <div className="booklist">
        {linkedBooks.map(({ book: b, link }) => {
          const content = (
            <>
              <BookCover book={b} />
              <span className="bookmeta">
                <b>{b.title}</b>
                <span className="author">{b.author}</span>
                <span className="note">{b.note}</span>
              </span>
              <span className="bookaction">
                {link ? (
                  <>
                    <span className={`bookaccess ${link.access}`}>{link.label}</span>
                    <span className="booksource">{link.source}</span>
                    <span className="bookopen" aria-hidden="true">&#8594;</span>
                  </>
                ) : (
                  <span className="bookaccess unavailable">Manba topilmadi</span>
                )}
              </span>
            </>
          );

          return link ? (
            <button
              type="button"
              className="bookcard"
              key={b.n}
              style={{ ["--bc" as string]: b.accent }}
              aria-label={`${b.title}: SkillMap ichida ochish, ${link.label}`}
              onClick={() => setSelectedBookN(b.n)}
            >
              {content}
            </button>
          ) : (
            <div className="bookcard unavailable" key={b.n} style={{ ["--bc" as string]: b.accent }}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
