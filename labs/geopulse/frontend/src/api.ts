import type { FeatureCollection } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export function formatBbox(values: [number, number, number, number]): string {
  return values.map((value) => value.toFixed(6)).join(",");
}

export async function fetchFeatures(
  bbox: [number, number, number, number],
  signal: AbortSignal,
): Promise<FeatureCollection> {
  const params = new URLSearchParams({ bbox: formatBbox(bbox), limit: "500" });
  const response = await fetch(`${API_URL}/features?${params}`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    const requestId = response.headers.get("X-Request-ID") || "unknown";
    throw new Error(`API ${response.status}; request ${requestId}`);
  }
  return (await response.json()) as FeatureCollection;
}
