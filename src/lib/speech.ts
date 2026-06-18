// Talaffuz: brauzerning Web Speech API'sidan foydalanadi (o'rnatish shart emas).
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Ovozlar asinxron yuklanadi — birinchi chaqiriqda bo'sh bo'lishi mumkin,
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
    // MUHIM: ovozni MATN TILIGA moslaymiz (avval har doim inglizcha tanlanardi —
    // shuning uchun ruscha matn jim qolardi).
    const prefix = lang.slice(0, 2).toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    const match =
      voices.find((v) => (v.lang || "").toLowerCase().replace("_", "-").startsWith(prefix));
    if (match) u.voice = match;
    // Mos ovoz topilmasa — u.lang bo'yicha brauzer o'zi tanlaydi.
    window.speechSynthesis.speak(u);
  } catch {
    /* ovoz mavjud emas — jim qolamiz */
  }
}
