import { useState } from "react";
import { highlight } from "../lib/highlight";
import { copyText } from "../lib/storage";
import { useStore } from "../store";
import type { CodeBlock as CB } from "../types";

export function CodeBlock({ block }: { block: CB }) {
  const [done, setDone] = useState(false);
  const { toast } = useStore();

  const onCopy = async () => {
    await copyText(block.code);
    setDone(true);
    toast("Kod nusxalandi");
    setTimeout(() => setDone(false), 1600);
  };

  return (
    <>
      {block.heading && (block.heading.h || block.heading.p) && (
        <div className="prose">
          {block.heading.h && <h3>{block.heading.h}</h3>}
          {block.heading.p && <p>{block.heading.p}</p>}
        </div>
      )}
      <div className="codewrap">
        <div className="codehead">
          <span className="fn">{block.title}</span>
          <div className="codehead-right">
            <span className="lang">{block.lang}</span>
            <button className={"copybtn" + (done ? " done" : "")} onClick={onCopy}>
              {done ? "Nusxalandi" : "Nusxa"}
            </button>
          </div>
        </div>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlight(block.code, block.lang) }} />
        </pre>
      </div>
    </>
  );
}
