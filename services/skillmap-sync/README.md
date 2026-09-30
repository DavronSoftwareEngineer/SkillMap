# SkillMap cloud sync

The implemented service is `server/api.ts`, deployed through
`netlify/functions/skillmap.ts`. PostgreSQL migrations live in
`netlify/database/migrations`. Netlify applies them before publishing a deploy.
The runtime uses `pg` and the deploy-specific URL resolved by `@netlify/database`.

See [local setup, Netlify deployment and limitations](../../docs/netlify-fullstack.md).

- `/sync/register`, `/sync/login`, `/sync/me`, `/sync/logout`: username/password accounts and cookie sessions.
- `/sync/progress`: encrypted complete snapshots with revision checks. Concurrent stale writes return 409.
- `/sync/password`, `/sync/account`: password change, session revocation and account deletion.
- The browser explicitly uploads/restores data. Local progress continues offline.
- AI keys and device preferences are excluded. Manually entered reviewer grades remain unverified.

Netlify Database provides the deployment's database URL; a stable `SYNC_ENCRYPTION_KEY`
must be configured for Functions. The code being deployed does not by itself confirm
that the database, migrations and encryption key are ready.
