import { useEffect, useRef, useState } from "react";

type Provider = "anthropic" | "openai";

function lsGet(k: string): string {
  try {
    return sessionStorage.getItem(k) || "";
  } catch {
    return "";
  }
}
function lsSet(k: string, v: string) {
  try {
    sessionStorage.setItem(k, v);
  } catch {
    /* ignore */
  }
}
function lsRemove(k: string) {
  try {
    sessionStorage.removeItem(k);
  } catch {
    /* ignore */
  }
}

const DEFAULT_MODEL: Record<Provider, string> = {
  anthropic: "claude-sonnet-4-6",
  openai: "gpt-4o-mini",
};

const STARTERS = [
  {
    label: "Aniq prompt (4 element)",
    sys: "You are a helpful, concise assistant.",
    user:
      "Task: Summarize the text below.\nContext: For a busy manager with 30 seconds.\nFormat: 3 bullet points.\nConstraints: Max 15 words per bullet, plain English.\n\nText: \"\"\"<matningizni shu yerga qo'ying>\"\"\"",
  },
  {
    label: "Rol + ton + format",
    sys: "You are a friendly nutrition coach.",
    user:
      "Explain a balanced breakfast to a busy student.\nTone: encouraging, simple.\nFormat: 5 bullet points, each under 12 words.\nDo not recommend supplements.",
  },
  {
    label: "Few-shot tasnif",
    sys: "",
    user:
      'Classify the sentiment as Positive / Negative / Neutral.\n\nText: "I love this!" -> Positive\nText: "It\'s okay." -> Neutral\n\nNow classify:\nText: "This is the worst." ->',
  },
];

export function Playground() {
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [key, setKey] = useState(() => lsGet("ai_key_anthropic"));
  const [model, setModel] = useState(DEFAULT_MODEL.anthropic);
  const [sys, setSys] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const request = useRef<AbortController | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => { request.current?.abort(); request.current = null; window.clearTimeout(timer.current); }, []);

  const switchProvider = (p: Provider) => {
    setProvider(p);
    setModel(DEFAULT_MODEL[p]);
    setKey(lsGet(p === "anthropic" ? "ai_key_anthropic" : "ai_key_openai"));
    setError("");
  };

  const onKeyChange = (v: string) => {
    setKey(v);
    lsSet(provider === "anthropic" ? "ai_key_anthropic" : "ai_key_openai", v);
  };

  const clearKey = () => {
    setKey("");
    lsRemove(provider === "anthropic" ? "ai_key_anthropic" : "ai_key_openai");
  };

  const send = async () => {
    if (request.current) return;
    setError("");
    setAnswer("");
    if (!key.trim()) {
      setError("Avval API kalitingizni kiriting.");
      return;
    }
    if (!prompt.trim()) {
      setError("Prompt bo'sh - biror narsa yozing.");
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 60_000);
    timer.current = timeout;
    try {
      let text = "";
      if (provider === "anthropic") {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "content-type": "application/json",
            "x-api-key": key.trim(),
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: model.trim(),
            max_tokens: 1024,
            ...(sys.trim() ? { system: sys.trim() } : {}),
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error?.message || JSON.stringify(data));
        text = (data.content || [])
          .map((b: { type: string; text?: string }) => (b.type === "text" ? b.text : ""))
          .join("\n");
      } else {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + key.trim(),
          },
          body: JSON.stringify({
            model: model.trim(),
            max_tokens: 1024,
            messages: [
              ...(sys.trim() ? [{ role: "system", content: sys.trim() }] : []),
              { role: "user", content: prompt },
            ],
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error?.message || JSON.stringify(data));
        text = data?.choices?.[0]?.message?.content || "";
      }
      if (request.current === controller && !controller.signal.aborted) setAnswer(text || "(bo'sh javob)");
    } catch (e) {
      if (request.current !== controller) return;
      if (controller.signal.aborted) {
        setError("So‘rov bekor qilindi yoki 60 soniyalik kutish vaqti tugadi. Qayta urinishingiz mumkin.");
        return;
      }
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        "Xatolik: " +
          msg +
          "  -  Kalit, model nomi yoki internet aloqasini tekshiring. (CORS/401 bo'lsa kalit noto'g'ri bo'lishi mumkin.)"
      );
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <div className="dash">
      <div className="eyebrow">Playground / Jonli AI</div>
      <h2 className="mtitle">Prompt Playground</h2>
      <p className="mlede">
        Promptni shu yerda yozib, <strong>haqiqiy AI</strong>'ga yubor va javobni ko'r. Darslardagi
        texnikalarni amalda sina.
      </p>

      <div className="pg-warn">
        <b>BYOK maxfiyligi:</b> SkillMap serveriga kalit yuborilmaydi. Kalit ushbu tabning
        sessionStorage xotirasida saqlanadi va shu origin skriptlariga ochiq. Umumiy qurilmada
        tabni yopishga tayanmay, kalitni o‘chirish tugmasidan foydalaning. Prompt va kalit bevosita tanlangan AI
        provayderiga yuboriladi. Ommaviy kompyuterda ishlatmang va kalitga usage limit qo'ying.
      </div>

      <div className="pg-row">
        <div className="pg-seg">
          <button disabled={loading} className={provider === "anthropic" ? "active" : ""} onClick={() => switchProvider("anthropic")}>
            Anthropic (Claude)
          </button>
          <button disabled={loading} className={provider === "openai" ? "active" : ""} onClick={() => switchProvider("openai")}>
            OpenAI (GPT)
          </button>
        </div>
      </div>

      <div className="pg-grid2">
        <label className="pg-field">
          <span>Shaxsiy API kalit (BYOK)</span>
          <input
            type="password"
            placeholder={provider === "anthropic" ? "sk-ant-..." : "sk-..."}
            value={key}
            onChange={(e) => onKeyChange(e.target.value)}
          />
          <button type="button" className="pg-chip" onClick={clearKey}>
            Shu provayder kalitini o'chirish
          </button>
        </label>
        <label className="pg-field">
          <span>Model</span>
          <input value={model} onChange={(e) => setModel(e.target.value)} />
        </label>
      </div>

      <label className="pg-field">
        <span>System prompt (ixtiyoriy - rol/yo'riqnoma)</span>
        <textarea
          rows={2}
          placeholder="You are a helpful, concise assistant."
          value={sys}
          onChange={(e) => setSys(e.target.value)}
        />
      </label>

      <label className="pg-field">
        <span>Prompt</span>
        <textarea
          rows={7}
          placeholder="Promptingizni shu yerga yozing..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </label>

      <div className="pg-starters">
        <span className="pg-starters-lab">Tayyor namunalar:</span>
        {STARTERS.map((s, i) => (
          <button
            key={i}
            className="pg-chip"
            onClick={() => {
              setSys(s.sys);
              setPrompt(s.user);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button className="pg-send" onClick={send} disabled={loading}>
        {loading ? "Yuborilmoqda..." : "Yubor ->"}
      </button>

      {loading && <button onClick={() => request.current?.abort()}>So‘rovni bekor qilish</button>}
      {error && <div role="alert" className="pg-error">{error}</div>}

      {answer && (
        <div className="pg-answer">
          <div className="pg-answer-head">Javob</div>
          <pre>{answer}</pre>
        </div>
      )}
    </div>
  );
}
