import { useEffect, useRef } from "react";
import { highlight } from "../lib/highlight";
import { copyText } from "../lib/storage";
import { speak, canSpeak } from "../lib/speech";
import { useStore } from "../store";

export function RichHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { toast, courseId } = useStore();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Kod bloklarini ranglash
    root.querySelectorAll<HTMLElement>("pre code").forEach((code) => {
      const lang = code.dataset.lang || "";
      code.innerHTML = highlight(code.textContent || "", lang);
    });

    // Kodga "Nusxa" tugmasi
    root.querySelectorAll<HTMLElement>(".codehead").forEach((head) => {
      if (head.querySelector(".copybtn")) return;
      const btn = document.createElement("button");
      btn.className = "copybtn";
      btn.textContent = "Nusxa";
      btn.addEventListener("click", () => {
        const code = head.parentElement?.querySelector("code");
        if (code) {
          copyText(code.textContent || "");
          toast("Kod nusxalandi");
        }
      });
      head.appendChild(btn);
    });

    // Til darslaridagi misol gaplarga talaffuz tugmasi
    if ((courseId === "english" || courseId === "russian" || courseId === "arabic") && canSpeak()) {
      const sLang =
        courseId === "russian" ? "ru-RU" : courseId === "arabic" ? "ar-SA" : "en-US";
      root.querySelectorAll<HTMLElement>(".ex b").forEach((b) => {
        if (b.querySelector(".speakbtn-mini")) return;
        const text = b.textContent || "";
        if (!text) return;
        const btn = document.createElement("button");
        btn.className = "speakbtn-mini";
        btn.type = "button";
        btn.title = "Eshitish";
        btn.setAttribute("aria-label", "Eshitish");
        btn.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          speak(text, sLang);
        });
        b.appendChild(btn);
      });
    }
  }, [html, toast, courseId]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
