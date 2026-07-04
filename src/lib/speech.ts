// Talaffuz: brauzerning Web Speech API'sidan foydalanadi (o'rnatish shart emas).
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Ovozlar asinxron yuklanadi - birinchi chaqiriqda bo'sh bo'lishi mumkin,
// shuning uchun modul yuklanganda oldindan "isitib" qo'yamiz.
if (canSpeak()) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  } catch {
    /* ignore */
  }
}

export function speak(text: string, lang = "en-US"): void {
  if (!canSpeak() || !text) return;
  try {
    window.speechSynthesis.cancel(); // avvalgisini to'xtat
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.95;
    u.pitch = 1;
    // MUHIM: ovozni MATN TILIGA moslaymiz (avval har doim inglizcha tanlanardi -
    // shuning uchun ruscha matn jim qolardi).
    const prefix = lang.slice(0, 2).toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    const match =
      voices.find((v) => (v.lang || "").toLowerCase().replace("_", "-").startsWith(prefix));
    if (match) u.voice = match;
    // Mos ovoz topilmasa - u.lang bo'yicha brauzer o'zi tanlaydi.
    window.speechSynthesis.speak(u);
  } catch {
    /* ovoz mavjud emas - jim qolamiz */
  }
}

/* --------------------- Nutqni tanish (Speaking mashqi) --------------------- */
// Brauzerning Web Speech API'si (SpeechRecognition). Chrome/Edge/Safari qo'llaydi.
// Foydalanuvchi gapiradi -> brauzer matnga o'giradi -> talaffuz tekshiriladi.

/* eslint-disable @typescript-eslint/no-explicit-any */
function recognitionCtor(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export function canRecognize(): boolean {
  return recognitionCtor() !== null;
}

export interface SpeechListener {
  stop(): void;
}

export interface RecognizeHandlers {
  onResult: (text: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Bir marta tinglaydi (foydalanuvchi bir jumla aytadi). null = qo'llab-quvvatlanmaydi.
export function recognize(lang: string, handlers: RecognizeHandlers): SpeechListener | null {
  const Ctor = recognitionCtor();
  if (!Ctor) return null;
  try {
    const rec = new Ctor();
    rec.lang = lang || "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onresult = (ev: any) => {
      let text = "";
      let isFinal = false;
      for (let i = 0; i < ev.results.length; i++) {
        text += ev.results[i][0].transcript;
        if (ev.results[i].isFinal) isFinal = true;
      }
      handlers.onResult(text, isFinal);
    };
    rec.onerror = (ev: any) => handlers.onError?.(ev?.error || "error");
    rec.onend = () => handlers.onEnd?.();
    rec.start();
    return { stop: () => { try { rec.stop(); } catch { /* ignore */ } } };
  } catch {
    return null;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
