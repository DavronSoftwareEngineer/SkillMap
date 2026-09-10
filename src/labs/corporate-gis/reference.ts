/** Synthetic teaching models, NOT a DB, JWT verifier, exporter or deployment service. */
export function xyzToTms(z: number, y: number): number {
  if (!Number.isInteger(z) || z < 0 || z > 30 || !Number.isInteger(y) || y < 0 || y >= 2 ** z) throw Error('invalid tile');
  return 2 ** z - 1 - y;
}

export type TileStatus = 'ok' | 'empty' | 'error';
export function archiveReady(expected: readonly string[], received: ReadonlyMap<string, TileStatus>): boolean {
  return expected.length > 0 && new Set(expected).size === expected.length && received.size === expected.length
    && expected.every(id => received.get(id) === 'ok' || received.get(id) === 'empty');
}

export interface Bundle {
  id: string; dataSchema: number; styleSchema: number; sdkSchema: number;
  approved: boolean; complete: boolean;
}
export function activate(current: Bundle, candidate: Bundle): Bundle {
  if (!candidate.approved || !candidate.complete || candidate.dataSchema !== candidate.styleSchema || candidate.dataSchema !== candidate.sdkSchema) return current;
  return candidate;
}

export interface Job { status: 'pending' | 'running' | 'succeeded'; owner: string; fence: number; until: number }
// Pure in-memory transitions only. Real claims need an atomic database transaction.
export function claim(job: Job, owner: string, now: number, ttl: number): Job | null {
  if (!owner || !Number.isFinite(now) || !Number.isFinite(ttl) || ttl <= 0) throw Error('invalid lease');
  if (job.status === 'succeeded' || (job.status === 'running' && job.until > now)) return null;
  return { status: 'running', owner, fence: job.fence + 1, until: now + ttl };
}
export function finish(job: Job, owner: string, fence: number, now: number): Job | null {
  if (!Number.isFinite(now) || job.status !== 'running' || job.owner !== owner || job.fence !== fence || job.until <= now) return null;
  return { ...job, status: 'succeeded' };
}

export interface User { id: string; tenant: string; version: number; active: boolean; role: 'viewer' | 'admin' }
export interface Claims { subject: string; tenant: string; version: number; expires: number }
// Preconditions: trusted claims AFTER signature/issuer/audience verification.
export function mayPublish(user: User | null, claims: Claims, objectTenant: string, now: number): boolean {
  return !!user && Number.isFinite(now) && Number.isFinite(claims.expires) && claims.expires > now
    && user.active && user.id === claims.subject && user.version === claims.version && user.role === 'admin'
    && user.tenant === claims.tenant && user.tenant === objectTenant;
}

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export function canonical(value: Json): string {
  if (typeof value === 'number' && !Number.isFinite(value)) throw Error('nonfinite coordinate/attribute');
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
// Local synthetic geometry; not a real building, city, customer or dataset.
export const MOCK_FEATURE = {
  id: 'mock-building-1', source: 'synthetic-a',
  geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] },
  properties: { height: 10, region: 'zone-a' },
};
