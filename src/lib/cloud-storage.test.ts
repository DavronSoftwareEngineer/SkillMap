import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readCloudData, restoreCloudData } from './cloud-storage';
import { RECOVERY_KEY } from './backup';
import { validCloudData } from './cloud-data';
import { COURSES } from '../data/courses';
import protocol from '../data/outcome-protocol.json';
describe('cloud snapshots', () => {
  beforeEach(() => localStorage.clear());
  it('shares the complete course registry and excludes device preferences and secrets', () => {
    expect(Object.keys(protocol.tasks).sort()).toEqual(COURSES.map(c => c.id).sort());
    localStorage.setItem('english_progress', '{"t1":true}');
    localStorage.setItem('ai_api_key', 'secret'); localStorage.setItem('active_course', '"english"');
    expect(readCloudData()).toEqual({ english_progress: { t1: true } });
    expect(validCloudData({ ai_api_key: 'secret' })).toBe(false);
  });
  it('restores a complete snapshot, removes stale keys and records recovery', () => {
    localStorage.setItem('frontend_progress', '{"stale":true}');
    localStorage.setItem('english_progress', '{"old":true}');
    restoreCloudData({ english_progress: { remote: true } });
    expect(localStorage.getItem('frontend_progress')).toBeNull();
    expect(readCloudData()).toEqual({ english_progress: { remote: true } });
    const recovery = JSON.parse(localStorage.getItem(RECOVERY_KEY)!);
    expect(recovery.entries).toContainEqual(['english_progress', '{"old":true}']);
  });
  it('refuses invalid data and never mutates before recovery is saved', () => {
    localStorage.setItem('english_progress', '{"old":true}');
    expect(() => restoreCloudData({ english_progress: { invalid: 'yes' } })).toThrow();
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    try { expect(() => restoreCloudData({ english_progress: {} })).toThrow(); }
    finally { spy.mockRestore(); }
    expect(readCloudData()).toEqual({ english_progress: { old: true } });
  });
  it('rolls back partial writes after quota failure', () => {
    localStorage.setItem('english_progress', '{"old":true}');
    localStorage.setItem('frontend_progress', '{"existing":true}');
    const original = Storage.prototype.setItem; let failed = false;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, key, value) {
      if (key === 'frontend_progress' && !failed) { failed = true; throw new Error('quota'); }
      return original.call(this, key, value);
    });
    try { expect(() => restoreCloudData({ english_progress: { remote: true }, frontend_progress: { new: true } })).toThrow('Mahalliy nusxa qaytarildi'); }
    finally { spy.mockRestore(); }
    expect(readCloudData()).toEqual({ english_progress: { old: true }, frontend_progress: { existing: true } });
  });
});
