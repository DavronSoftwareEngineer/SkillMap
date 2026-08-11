# SkillMap cloud-sync starter

This service boundary is intentionally optional: SkillMap remains local-first until a real
identity provider, database host, retention policy, and privacy terms are selected. It is not
connected to the browser app yet and must not be described as live cloud sync.

## Target contract

```text
Browser local state -> authenticated HTTPS API -> PostgreSQL encrypted backup record
```

- `PUT /v1/me/progress` accepts a versioned backup payload with an idempotency key.
- `GET /v1/me/progress` returns only the authenticated user's latest payload.
- The server validates payload size/schema, records audit metadata, and never logs the payload.
- Conflict policy is explicit: initial implementation is last-write-wins with server timestamp;
  per-item merge requires an ADR and tests before enabling it.

## Before implementation/deploy

1. Select OAuth/OIDC provider and define account deletion/export flow.
2. Add PostgreSQL migration, encrypted-at-rest storage, rate limits, and integration tests.
3. Add client opt-in UI. Local storage remains the source of truth until a successful sync.
4. Run a privacy/security review; learning progress is user data.

Secrets, database URL, OAuth keys, and a public host are external deployment inputs and are not
committed to this repository.
