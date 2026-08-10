# Professional Backend yo'li

Backend kursi mustaqil Node.js/TypeScript production-backend yo'lidir. GeoPulse
integratsiyasi optional portfolio kengaytmasi; kurs finalini almashtirmaydi.

## Maqsadli arxitektura

```text
Client / Nginx
      |
Node.js + TypeScript modular monolith
      |-- PostgreSQL: transactional data, migrations, audit
      `-- Redis: cache, rate limit, background-job broker
                `-- worker: retry, idempotency, failure state
```

## Bosqichlar

1. API va data: HTTP contract, validation, PostgreSQL, migration, transaction,
   pagination, query plan va index.
2. Security: auth, RBAC/ownership, tenant boundary, rate limit, secret handling
   va audit.
3. Reliability: Redis job, idempotency, bounded retry/backoff, error format,
   health/readiness, structured logs va OpenTelemetry.
4. Delivery: Docker Compose, CI/CD, metrics/alerts, backup/restore, ADR va
   external reviewerli final defense.

## Mustaqil final

Multi-tenant order yoki service API: user/admin rollari, PostgreSQL migration,
Redis-backed job, negative security tests, integration tests, Docker deploy,
observability va recovery evidence bilan. Faqat endpoint ishlashi yetarli emas;
concurrency, duplicate request va dependency outage ham sinaladi.

## GeoPulse bilan munosabat

GeoPulse FastAPI/Python + PostGIS + Celery stackida qoladi. Backend kursidan
olingan modular-monolith, API contract, Redis, reliability, observability va
operational usullar Geospatial kursining yakunidagi optional `GI1` modulida shu mahsulotga qo'llanadi.
