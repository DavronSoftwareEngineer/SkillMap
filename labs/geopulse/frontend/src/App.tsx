import { MapView } from "./MapView";

export function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="product-mark" aria-hidden="true" />
          <strong>GeoPulse</strong>
          <small>Professional lab baseline</small>
        </div>
        <a href="/api/docs">API contract</a>
      </header>
      <MapView />
    </main>
  );
}
