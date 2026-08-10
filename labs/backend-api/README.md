# Backend Reliability Lab

Executable companion for the Backend supporting-skill course. It is deliberately
a small Node.js/TypeScript-oriented baseline: an HTTP API starts beside
PostgreSQL and Redis, checks readiness, and exposes an in-memory idempotency
example. It does **not** claim to have a durable Redis queue, auth, telemetry,
or migrations yet; those are milestones with evidence requirements.

## Run

```bash
cp .env.example .env
docker compose up --build --wait
curl http://localhost:8090/health/live
curl http://localhost:8090/health/ready
docker compose down --volumes
```

## Milestones

1. Replace the in-memory job map with a Redis-backed queue and durable job table.
2. Implement idempotency persistence, bounded retry/backoff, failed state, and
   recovery tests.
3. Add authentication, rate limits, secret redaction, OpenTelemetry traces, and
   backup/restore evidence.
4. Integrate a selected adapter or worker with GeoPulse through a versioned,
   typed contract and ADR.

Do not call a milestone complete until its command, test, or operational
evidence is present and reproducible.
