import { useEffect, useRef, useState } from "react";

interface EmbeddedViewer {
  load(
    identifier: string | string[],
    notFoundCallback?: (() => void) | null,
    successCallback?: (() => void) | null,
  ): void;
}

interface GoogleBooksApi {
  load(options?: { language?: string }): void;
  setOnLoadCallback(callback: () => void): void;
  DefaultViewer: new (container: HTMLElement) => EmbeddedViewer;
}

declare global {
  interface Window {
    google?: { books?: GoogleBooksApi };
  }
}

let googleBooksReady: Promise<GoogleBooksApi> | null = null;

function loadGoogleBooksApi(): Promise<GoogleBooksApi> {
  if (googleBooksReady) return googleBooksReady;

  googleBooksReady = new Promise((resolve, reject) => {
    const initialize = () => {
      const api = window.google?.books;
      if (!api) {
        reject(new Error("Google Books API yuklanmadi"));
        return;
      }

      api.load({ language: "en" });
      api.setOnLoadCallback(() => resolve(api));
    };

    if (window.google?.books) {
      initialize();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>("script[data-google-books-api]");
    if (existing) {
      existing.addEventListener("load", initialize, { once: true });
      existing.addEventListener("error", () => reject(new Error("Google Books script xatosi")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/books/jsapi.js";
    script.async = true;
    script.dataset.googleBooksApi = "true";
    script.addEventListener("load", initialize, { once: true });
    script.addEventListener("error", () => reject(new Error("Google Books script xatosi")), { once: true });
    document.head.appendChild(script);
  });

  return googleBooksReady;
}

export function GoogleBookViewer({ isbn, title }: { isbn: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    let active = true;
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    setStatus("loading");
    const timeout = window.setTimeout(() => {
      if (active) setStatus((current) => current === "loading" ? "unavailable" : current);
    }, 15000);

    loadGoogleBooksApi()
      .then((api) => {
        if (!active) return;
        const viewer = new api.DefaultViewer(container);
        viewer.load(
          `ISBN:${isbn}`,
          () => active && setStatus("unavailable"),
          () => active && setStatus("ready"),
        );
      })
      .catch(() => active && setStatus("unavailable"));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      container.innerHTML = "";
    };
  }, [isbn]);

  return (
    <div className="google-book-stage" aria-label={`${title} Google Books preview`}>
      <div ref={containerRef} className="google-book-canvas" />
      {status === "loading" && (
        <div className="reader-state" role="status">
          <span className="reader-loader" aria-hidden="true" />
          <b>Google Books preview yuklanmoqda</b>
        </div>
      )}
      {status === "unavailable" && (
        <div className="reader-state unavailable" role="status">
          <b>Bu nashr uchun ichki preview mavjud emas</b>
          <span>Hudud yoki publisher cheklovi bo'lishi mumkin. Rasmiy manba rejimini sinab ko'ring.</span>
        </div>
      )}
      <span className="google-attribution">Google Books Preview</span>
    </div>
  );
}

