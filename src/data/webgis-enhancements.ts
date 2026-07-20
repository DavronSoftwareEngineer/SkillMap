import type { Module } from "../types";
import { WEBGIS_FOUNDATION_MODULES_AFTER } from "./webgis-foundations";
import { WEBGIS_MODERN_MODULES_AFTER } from "./webgis-modern";

export const WEBGIS_ENHANCEMENT_MODULES_AFTER: Record<string, Module[]> = {
  ...WEBGIS_FOUNDATION_MODULES_AFTER,
  ...WEBGIS_MODERN_MODULES_AFTER,
};
