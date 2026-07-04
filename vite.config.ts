/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" - ildizda ham, subkatalogda ham (masalan GitHub Pages) ishlaydi.
export default defineConfig({
  base: "./",
  plugins: [react()],
  // host: true - localhost'dan tashqari tarmoq IP'sida ham ochiladi
  // (telefon / boshqa qurilmalar bir Wi-Fi'da turib kira oladi).
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
  // Testlar: sof mantiq node'da, komponentlar jsdom'da ishlaydi.
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.claude/**",
      "**/.agents/**",
      "**/.git/**",
    ],
  },
});
