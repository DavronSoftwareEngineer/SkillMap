import type { Module } from "../types";
import { WEBGIS_FOUNDATION_MODULES_AFTER } from "./webgis-foundations";
import { WEBGIS_MODERN_MODULES_AFTER } from "./webgis-modern";
import { GEOPULSE_OPTIONAL_INTEGRATION } from "./backend-enhancements";

export const WEBGIS_ENHANCEMENT_MODULES_AFTER: Record<string, Module[]> = {
  ...WEBGIS_FOUNDATION_MODULES_AFTER,
  ...WEBGIS_MODERN_MODULES_AFTER,
  z31: [GEOPULSE_OPTIONAL_INTEGRATION],
};
