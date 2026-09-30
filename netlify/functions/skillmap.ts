import type { Config, Context } from '@netlify/functions';
import { handleRequest } from '../../server/api';
export default (request: Request, context: Context) => handleRequest(request, { ip: context.ip });
export const config: Config = { path: '/sync/*', rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: ['domain', 'ip'] } };
