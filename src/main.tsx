import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./store";
import { registerSW } from "./lib/pwa";
import { runMigrations } from "./lib/migrate";
import "./styles.css";

// Store o'qishidan OLDIN - eski localStorage kalitlarini yangi sxemaga ko'chiramiz.
runMigrations();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>
);

registerSW();
