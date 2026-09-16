// Third-party frames/scripts are intentionally not embedded. Publishers and CSP
// can forbid them; a top-level link does not require weakening our policy.
export function GoogleBookViewer({ isbn, title }: { isbn: string; title: string }) {
  return <div className="source-book-stage" aria-label={`${title} Google Books preview`}>
    <div className="reader-frame-note">
      <p>Google Books yangi tabda ochiladi. Preview mavjudligi nashriyot va hududga bog'liq; to'liq kitob kafolatlanmaydi.</p>
      <a href={`https://books.google.com/books?vid=ISBN${encodeURIComponent(isbn)}`}
        target="_blank" rel="noopener noreferrer">Google Books’da ochish (yangi tab)</a>
    </div>
  </div>;
}
