import { useState } from "react";

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

  const send = async () => {
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
    try {
      let text = "";
      if (provider === "anthropic") {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
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
      setAnswer(text || "(bo'sh javob)");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        "Xatolik: " +
          msg +
          "  -  Kalit, model nomi yoki internet aloqasini tekshiring. (CORS/401 bo'lsa kalit noto'g'ri bo'lishi mumkin.)"
      );
    } finally {
      setLoading(false);
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
        <b>Maxfiylik:</b> API kalit faqat joriy brauzer sessiyasida turadi va sahifa yopilganda
        o'chadi. Prompt va kalit faqat tanlangan AI provayderiga yuboriladi. Ommaviy kompyuterda
        ishlatmang. Kalitni {provider === "anthropic" ? "console.anthropic.com" : "platform.openai.com"} dan olasiz.
      </div>

      <div className="pg-row">
        <div className="pg-seg">
          <button className={provider === "anthropic" ? "active" : ""} onClick={() => switchProvider("anthropic")}>
            Anthropic (Claude)
          </button>
          <button className={provider === "openai" ? "active" : ""} onClick={() => switchProvider("openai")}>
            OpenAI (GPT)
          </button>
        </div>
      </div>

      <div className="pg-grid2">
        <label className="pg-field">
          <span>API kalit</span>
          <input
            type="password"
            placeholder={provider === "anthropic" ? "sk-ant-..." : "sk-..."}
            value={key}
            onChange={(e) => onKeyChange(e.target.value)}
          />
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

      {error && <div className="pg-error">{error}</div>}

      {answer && (
        <div className="pg-answer">
          <div className="pg-answer-head">Javob</div>
          <pre>{answer}</pre>
        </div>
      )}
    </div>
  );
}
