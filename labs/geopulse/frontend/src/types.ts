export type AssetCategory = "hospital" | "school" | "station" | "park";

export interface PointGeometry {
  type: "Point";
  coordinates: [number, number];
}

export interface AssetFeature {
  type: "Feature";
  id: number;
  geometry: PointGeometry;
  properties: {
    name: string;
    category: AssetCategory;
  };
}

export interface FeatureCollection {
  type: "FeatureCollection";
  features: AssetFeature[];
  meta: {
    returned: number;
    limit: number;
    bbox: number[];
  };
}

export type LoadState =
  | { status: "loading"; message: string }
  | { status: "ready"; message: string }
  | { status: "empty"; message: string }
  | { status: "error"; message: string };
