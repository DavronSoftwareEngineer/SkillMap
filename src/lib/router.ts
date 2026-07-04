// Hash-router: URL orqali kurs va modulga to'g'ridan-to'g'ri kirish/ulashish.
// Format: #kursId            -> kursning 1-moduli
//         #kursId/zoomId     -> aniq modul (masalan #webgis/z5)
//         #kursId/dash       -> nomlangan ko'rinish (dash/flash/ref/search/play/books)
// Zoom kirillcha bo'lishi mumkin (#russian/Алф) - encodeURIComponent bilan yoziladi.

export const VIEW_NAMES = ["dash", "flash", "ref", "search", "play", "books"] as const;
export type ViewName = (typeof VIEW_NAMES)[number];

export interface Route {
  courseId: string | null; // yaroqsiz hash bo'lsa null
  view: ViewName | null; // nomlangan ko'rinish
  zoom: string | null; // modul zoom identifikatori
}

const EMPTY: Route = { courseId: null, view: null, zoom: null };

function isViewName(s: string): s is ViewName {
  return (VIEW_NAMES as readonly string[]).includes(s);
}

function decode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function parseHash(hash: string, validCourseIds: readonly string[]): Route {
  const clean = hash.replace(/^#\/?/, "").trim();
  if (!clean) return EMPTY;
  const [rawCourse, ...rest] = clean.split("/");
  const courseId = decode(rawCourse);
  if (!validCourseIds.includes(courseId)) return EMPTY;
  const target = decode(rest.join("/"));
  if (!target) return { courseId, view: null, zoom: null };
  if (isViewName(target)) return { courseId, view: target, zoom: null };
  return { courseId, view: null, zoom: target };
}

export function buildHash(courseId: string, target: ViewName | string | null): string {
  if (!target) return "#" + encodeURIComponent(courseId);
  return "#" + encodeURIComponent(courseId) + "/" + encodeURIComponent(target);
}
