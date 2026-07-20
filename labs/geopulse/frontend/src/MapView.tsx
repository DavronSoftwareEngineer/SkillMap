import { useEffect, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap } from "maplibre-gl";

import { fetchFeatures } from "./api";
import type { FeatureCollection, LoadState } from "./types";

const EMPTY_COLLECTION: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
  meta: { returned: 0, limit: 500, bbox: [] },
};

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestSequence = useRef(0);
  const [state, setState] = useState<LoadState>({
    status: "loading",
    message: "Xarita tayyorlanmoqda",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [69.2689, 41.3111],
      zoom: 11.5,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const loadViewport = async () => {
      const bounds = map.getBounds();
      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const sequence = ++requestSequence.current;
      setState({ status: "loading", message: "Ko'rinayotgan hudud yuklanmoqda" });

      try {
        const data = await fetchFeatures(bbox, controller.signal);
        if (sequence !== requestSequence.current) return;
        (map.getSource("assets") as GeoJSONSource | undefined)?.setData(data);
        setState(
          data.features.length
            ? { status: "ready", message: `${data.features.length} obyekt ko'rsatildi` }
            : { status: "empty", message: "Bu hududda demo obyekt yo'q" },
        );
      } catch (error) {
        if (controller.signal.aborted || sequence !== requestSequence.current) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Noma'lum API xatosi",
        });
      }
    };

    map.on("load", () => {
      map.addSource("assets", { type: "geojson", data: EMPTY_COLLECTION });
      map.addLayer({
        id: "assets-circle",
        type: "circle",
        source: "assets",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 5, 15, 10],
          "circle-color": [
            "match",
            ["get", "category"],
            "hospital",
            "#e65353",
            "school",
            "#f2b84b",
            "station",
            "#4d9de0",
            "park",
            "#49b675",
            "#ffffff",
          ],
          "circle-stroke-color": "#0b1014",
          "circle-stroke-width": 2,
        },
      });
      map.on("moveend", loadViewport);
      void loadViewport();
    });

    map.on("click", "assets-circle", (event) => {
      const feature = event.features?.[0];
      if (!feature || feature.geometry.type !== "Point") return;
      const coordinates = feature.geometry.coordinates as [number, number];
      const name = String(feature.properties?.name || "Nomsiz obyekt");
      const category = String(feature.properties?.category || "unknown");
      new maplibregl.Popup({ closeButton: true })
        .setLngLat(coordinates)
        .setHTML(`<strong>${escapeHtml(name)}</strong><br><span>${escapeHtml(category)}</span>`)
        .addTo(map);
    });
    map.on("mouseenter", "assets-circle", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "assets-circle", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      requestSequence.current += 1;
      abortRef.current?.abort();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="map-shell" aria-label="GeoPulse demo xaritasi">
      <div ref={containerRef} className="map" />
      <div className={`map-status ${state.status}`} role="status" aria-live="polite">
        <span />
        {state.message}
      </div>
    </section>
  );
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] || character,
  );
}
