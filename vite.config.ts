import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" — ildizда ham, subkatalogда ham (masalan GitHub Pages) ishlaydi.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
