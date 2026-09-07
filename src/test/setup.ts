// Vitest + Testing Library uchun umumiy sozlash.
// jest-dom matcherlari (toBeInTheDocument, ...) va har testdan keyin tozalash.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  // Har test mustaqil bo'lsin: store/backup localStorage'ga yozadi.
  if (typeof localStorage !== 'undefined') localStorage.clear();
});
