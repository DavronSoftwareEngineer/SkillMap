import webgis from "./webgis.json";
import english from "./english.json";
import finance from "./finance.json";
import russian from "./russian.json";
import prompting from "./prompting.json";
import type { Module } from "../types";

export interface Course {
  id: string;
  name: string;
  brandTitle: string;
  brandSub: string;
  labels: Record<string, string>;
  modules: Module[];
  playground?: boolean;
}

export const COURSES: Course[] = [
  {
    id: "webgis",
    name: "Geospatial",
    brandTitle: "Geospatial Full-Stack Academy",
    brandSub: "WebGIS · React TS · PostGIS · Tegola · Docker",
    labels: {
      doc: "Hujjat",
      code: "Kod misollari",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Loyiha",
    },
    modules: webgis as Module[],
  },
  {
    id: "english",
    name: "English",
    brandTitle: "English Academy",
    brandSub: "0 → IELTS · Listening · Reading · Writing · Speaking",
    labels: {
      doc: "Dars",
      code: "Namunalar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    modules: english as Module[],
  },
  {
    id: "finance",
    name: "Moliya",
    brandTitle: "Moliyaviy Savodxonlik",
    brandSub: "Byudjet · Jamg'arma · Qarz · Xavfsizlik · Investitsiya",
    labels: {
      doc: "Dars",
      code: "Misollar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    modules: finance as Module[],
  },
  {
    id: "russian",
    name: "Rus tili",
    brandTitle: "Rus tili Akademiyasi",
    brandSub: "0 → B1 · Alifbo · Kelishiklar · Fe'l aspekti · Suhbat",
    labels: {
      doc: "Dars",
      code: "Namunalar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    modules: russian as Module[],
  },
  {
    id: "prompting",
    name: "AI Prompt",
    brandTitle: "AI bilan ishlash",
    brandSub: "Prompting · Aniqlik · Rol · Few-shot · Xavfsizlik",
    labels: {
      doc: "Dars",
      code: "Promptlar",
      ex: "Mashq",
      task: "Topshiriqlar",
      quiz: "Test",
      vid: "Manbalar",
      proj: "Amaliyot",
    },
    modules: prompting as Module[],
    playground: true,
  },
];

export const COURSE_BY_ID: Record<string, Course> = Object.fromEntries(
  COURSES.map((c) => [c.id, c])
);
