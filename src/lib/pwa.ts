// Service worker'ni ro'yxatdan o'tkazadi (faqat production'да, qo'llab-quvvatlansa).
export function registerSW(): void {
  if (!import.meta.env.PROD) return; // dev'да Vite HMR'га xalaqit bermaslik uchun
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    // base'ga nisbatan ("./sw.js") — subkatalogда deploy bo'lса ham ishlaydi.
    const url = new URL("sw.js", document.baseURI).toString();
    navigator.serviceWorker.register(url).catch(() => {
      /* offline rejimi mavjud emas — ilova baribir ishlaydi */
    });
  });

  // Yangi versiya faollashganда bir marta yangilab olish.
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}
