import { afterEach, describe, expect, it, vi } from 'vitest';
import { updateLearningState } from './learning-storage';

afterEach(() => vi.restoreAllMocks());
describe('learning storage writes', () => {
  it('reads latest persisted values instead of overwriting another tab', () => {
    localStorage.setItem('webgis_progress', '{"a":true}');
    const saved = vi.fn();
    updateLearningState<Record<string, boolean>>('webgis_progress', {}, current => ({...current, b:true}), saved);
    expect(saved).toHaveBeenCalledWith({a:true,b:true});
  });
  it.each(['null','[true]','{"a":"wrong"}','{broken'])('preserves malformed source: %s', raw => {
    localStorage.setItem('webgis_progress', raw);
    const saved = vi.fn();
    updateLearningState('webgis_progress', {}, () => ({b:true}), saved);
    expect(localStorage.getItem('webgis_progress')).toBe(raw);
    expect(saved).not.toHaveBeenCalled();
  });
  it('does not report success after a failed write', () => {
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(() => {throw new Error('quota');});
    const saved = vi.fn();
    updateLearningState('webgis_progress', {}, () => ({b:true}), saved);
    expect(saved).not.toHaveBeenCalled();
  });
  it('reads only after acquiring the cross-tab lock', async () => {
    const request = vi.fn(async (_name:string, callback:()=>void) => {
      localStorage.setItem('webgis_progress','{"newer":true}'); callback();
    });
    Object.defineProperty(navigator,'locks',{configurable:true,value:{request}});
    try {
      const saved=vi.fn();
      updateLearningState('webgis_progress', {}, current => ({...current, mine:true}), saved);
      expect(request).toHaveBeenCalledWith('skillmap:webgis_progress',expect.any(Function));
      expect(saved).toHaveBeenCalledWith({newer:true,mine:true});
    } finally { Object.defineProperty(navigator,'locks',{configurable:true,value:undefined}); }
  });
});
