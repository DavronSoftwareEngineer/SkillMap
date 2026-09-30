# SkillMap cloud sync

The implemented service is `server/api.ts`, deployed through
`netlify/functions/skillmap.ts`. PostgreSQL migrations live in
`netlify/database/migrations`.

See [local setup, Netlify deployment and limitations](../../docs/netlify-fullstack.md).

- `/sync/register`, `/sync/login`, `/sync/me`, `/sync/logout`: username/password accounts and cookie sessions.
- `/sync/progress`: encrypted complete snapshots with revision checks. Concurrent stale writes return 409.
- `/sync/password`, `/sync/account`: password change, session revocation and account deletion.
- The browser explicitly uploads/restores data. Local progress continues offline.
- AI keys and device preferences are excluded. Manually entered reviewer grades remain unverified.

The production database and stable `SYNC_ENCRYPTION_KEY` are external deployment inputs.
The code being deployed does not by itself confirm that those inputs are configured.
