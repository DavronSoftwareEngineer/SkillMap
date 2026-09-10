import { createHash } from 'node:crypto';
import { StrictMode } from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MapCanvas, type MapAdapter } from './MapCanvas';
import { activate, archiveReady, canonical, claim, finish, mayPublish, MOCK_FEATURE, xyzToTms, type Bundle, type Job } from './reference';

afterEach(cleanup);
describe('corporate GIS: synthetic reference contracts', () => {
  it('does not recreate for inline factories; instanceKey explicitly resets with latest factory', () => {
    let creates = 0, removes = 0;
    const adapter = () => { creates++; return { onSelect() {}, offSelect() {}, remove() { removes++; } }; };
    const view = render(<MapCanvas createMap={() => adapter()} onSelect={() => {}} />);
    view.rerender(<MapCanvas createMap={() => adapter()} onSelect={() => {}} />);
    expect([creates, removes]).toEqual([1, 0]);
    view.rerender(<MapCanvas instanceKey="new" createMap={() => adapter()} onSelect={() => {}} />);
    expect([creates, removes]).toEqual([2, 1]);
    view.unmount();
    expect(removes).toBe(2);
  });
  it('converts XYZ rows to TMS including limits', () => {
    expect(xyzToTms(0, 0)).toBe(0);
    expect(xyzToTms(2, 0)).toBe(3);
    expect(xyzToTms(2, 3)).toBe(0);
    for (const pair of [[-1, 0], [2, 4], [2, -1], [1.5, 0], [31, 0]]) expect(() => xyzToTms(...pair as [number, number])).toThrow();
  });
  it('blocks missing/error tiles and allows explicit empty tiles only', () => {
    const expected = ['1/0/0', '1/1/0'];
    expect(archiveReady(expected, new Map([['1/0/0', 'ok']]))).toBe(false);
    expect(archiveReady(expected, new Map([['1/0/0', 'ok'], ['1/1/0', 'error']]))).toBe(false);
    expect(archiveReady(expected, new Map([['1/0/0', 'ok'], ['1/1/0', 'empty']]))).toBe(true);
    expect(archiveReady([], new Map())).toBe(false);
    expect(archiveReady(['a', 'a'], new Map([['a', 'ok']]))).toBe(false);
  });
  it('retains the previous release on partial upload, missing approval or schema mismatch', () => {
    const old: Bundle = { id: 'r1', dataSchema: 1, styleSchema: 1, sdkSchema: 1, approved: true, complete: true };
    for (const patch of [{ complete: false }, { approved: false }, { dataSchema: 2 }, { sdkSchema: 2 }]) {
      expect(activate(old, { ...old, id: 'r2', ...patch })).toBe(old);
    }
    const next = { ...old, id: 'r2' };
    expect(activate(old, next)).toBe(next);
    expect(activate(next, old)).toBe(old); // explicit compatible rollback
  });
  it('rejects stale worker after reclaim and duplicate completion', () => {
    const pending: Job = { status: 'pending', owner: '', fence: 0, until: 0 };
    const a = claim(pending, 'a', 0, 10)!;
    expect(claim(a, 'b', 9, 10)).toBeNull();
    const b = claim(a, 'b', 10, 10)!;
    expect(finish(b, 'a', a.fence, 11)).toBeNull();
    expect(finish(b, 'b', b.fence - 1, 11)).toBeNull();
    const done = finish(b, 'b', b.fence, 11)!;
    expect(done.status).toBe('succeeded');
    expect(claim(done, 'c', 30, 10)).toBeNull();
    expect(finish(done, 'b', b.fence, 12)).toBeNull();
    expect(finish(b, 'b', b.fence, 20)).toBeNull();
    expect(() => claim(pending, 'a', 0, 0)).toThrow();
  });
  it('fails closed on stale sessions, revoked accounts and wrong tenant', () => {
    const user = { id: 'u1', tenant: 'mock-t1', version: 4, active: true, role: 'admin' as const };
    const token = { subject: 'u1', tenant: 'mock-t1', version: 4, expires: 100 };
    expect(mayPublish(user, token, 'mock-t1', 0)).toBe(true);
    expect(mayPublish({ ...user, version: 5 }, token, 'mock-t1', 0)).toBe(false);
    expect(mayPublish({ ...user, role: 'viewer' }, token, 'mock-t1', 0)).toBe(false);
    expect(mayPublish({ ...user, active: false }, token, 'mock-t1', 0)).toBe(false);
    expect(mayPublish(null, token, 'mock-t1', 0)).toBe(false);
    expect(mayPublish(user, token, 'mock-t2', 0)).toBe(false);
    expect(mayPublish(user, token, 'mock-t1', 100)).toBe(false);
    expect(mayPublish(user, { ...token, subject: 'u2' }, 'mock-t1', 0)).toBe(false);
  });
  it('fingerprints geometry as well as attributes, without object-key order noise', () => {
    const hash = (value: Parameters<typeof canonical>[0]) => createHash('sha256').update(canonical(value)).digest('hex');
    const changed = structuredClone(MOCK_FEATURE);
    changed.geometry.coordinates[0][1][0] = 2;
    expect(hash(changed)).not.toBe(hash(MOCK_FEATURE));
    expect(hash({ a: 1, b: 2 })).toBe(hash({ b: 2, a: 1 }));
    expect(() => canonical({ x: NaN })).toThrow();
  });
  it('isolates two React consumers and cleans resources even in StrictMode', () => {
    const adapters: Array<MapAdapter & { listeners: Set<(id: string) => void>; removed: boolean }> = [];
    const factory = vi.fn(() => {
      const listeners = new Set<(id: string) => void>();
      const adapter = { listeners, removed: false, onSelect: (fn: (id: string) => void) => { listeners.add(fn); }, offSelect: (fn: (id: string) => void) => { listeners.delete(fn); }, remove: () => { adapter.removed = true; } };
      adapters.push(adapter); return adapter;
    });
    const first = vi.fn(), second = vi.fn(), replacement = vi.fn();
    const a = render(<StrictMode><MapCanvas createMap={factory} onSelect={first} /></StrictMode>);
    const b = render(<MapCanvas createMap={factory} onSelect={second} />);
    expect(adapters.filter(x => !x.removed)).toHaveLength(2);
    a.rerender(<StrictMode><MapCanvas createMap={factory} onSelect={replacement} /></StrictMode>);
    for (const fn of adapters.filter(x => !x.removed)[0].listeners) fn('mock-1');
    expect(replacement).toHaveBeenCalledExactlyOnceWith('mock-1');
    expect(first).not.toHaveBeenCalled(); expect(second).not.toHaveBeenCalled();
    a.unmount(); b.unmount();
    expect(adapters.every(x => x.removed && x.listeners.size === 0)).toBe(true);
  });
});
