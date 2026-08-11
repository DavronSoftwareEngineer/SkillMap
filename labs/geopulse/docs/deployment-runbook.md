# GeoPulse deployment runbook

This is a deploy-ready checklist, not evidence that GeoPulse is publicly deployed.

## Required external inputs

- HTTPS hostname and DNS ownership
- managed PostgreSQL/PostGIS with private network access and backup retention
- S3-compatible object storage for raster/model assets
- secret manager values for database, object storage, allowed origins, and API credentials
- monitoring destination and an on-call contact

## Release gate

1. Run API/frontend checks and `docker compose config --quiet`.
2. Build immutable images; record image digests and migration version.
3. Apply migrations once, then deploy API/worker/frontend with health checks.
4. Smoke test `/api/health/live`, `/api/health/ready`, a bbox request, and the map UI over HTTPS.
5. Verify logs/metrics/traces, then capture backup/restore and rollback evidence.

## Rollback

Do not roll back database schema blindly. Stop rollout, restore the previous compatible image,
assess migration compatibility, and use a tested restore procedure if data recovery is required.
