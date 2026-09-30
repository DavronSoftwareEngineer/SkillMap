import protocol from '../data/outcome-protocol.json';
import { isObject, validBackupValue } from './backup-validation';

export type CloudData = Record<string, unknown>;
const courses = Object.keys(protocol.tasks);
const suffixes = ['_progress', '_quiz', '_vocab', '_srs', '_assessment', '_worklabs', '_practice', '_outcomes'];
export const CLOUD_KEYS = ['myacademy_streak', ...courses.flatMap(id => suffixes.map(s => id + s))];
export const MAX_CLOUD_BYTES = 2 * 1024 * 1024;
export function validCloudData(data: unknown): data is CloudData {
  return isObject(data) && Object.entries(data).every(([key, value]) =>
    CLOUD_KEYS.includes(key) && validBackupValue(key, value, courses));
}
