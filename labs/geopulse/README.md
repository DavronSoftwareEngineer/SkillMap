# GeoPulse Professional Lab

This starter is the executable companion for SkillMap's Geospatial Full-Stack
Academy. It is intentionally small, but it is not pseudocode: the baseline
starts PostgreSQL/PostGIS, a typed FastAPI service, a React/MapLibre client, and
an Nginx gateway.

The learner extends the same repository through every milestone. Evidence is
kept beside the code so that the final assessment can verify more than checked
tasks.

## Baseline architecture

```text
Browser
  |
  v
Nginx gateway :8080
  |-- /api/* --> FastAPI :8000 --> PostgreSQL/PostGIS :5432
  `-- /*     --> React + MapLibre static app
```

## Requirements

- Docker Desktop with Compose v2
- Git
- 4 GB free RAM for the baseline
- Internet access for the demo basemap on first load

Python 3.11+ and Node.js 20+ are only required when running services outside
Docker.

The starter uses the OpenFreeMap Liberty style with OpenStreetMap attribution.
For a real production or offline deployment, record the provider/SLA decision
in an ADR and either pin an approved provider contract or self-host the style,
fonts, sprites, and tiles. Do not assume a public demo service is an SLA.

## Start

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost:8080`. The API contract is available at
`http://localhost:8080/api/docs`.

Run the smoke test from another terminal:

```bash
bash scripts/smoke-test.sh
```

PowerShell:

```powershell
./scripts/smoke-test.ps1
```

Stop without deleting the database:

```bash
docker compose down
```

Delete the lab database only when you intentionally want a clean seed:

```bash
docker compose down --volumes
```

## Local development

Backend:

```bash
cd api
python -m venv .venv
.venv/Scripts/activate
pip install -e ".[dev]"
pytest
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run typecheck
npm test
npm run dev
```

## Milestones and gates

### M0: baseline and spatial correctness

- Start the clean stack and run smoke tests.
- Inspect the seed CRS, axis order, validity, and GIST index.
- Add one deliberately broken geometry fixture and a regression test.

Gate: another developer can clone, start, and verify the stack using only this
README.

### M1: production API and map UX

- Add Alembic migrations; do not keep evolving the schema in init SQL.
- Add typed pagination, consistent errors, request IDs, cancellation, loading,
  empty, and degraded states.
- Add backend unit/integration tests and frontend user-flow tests.

Gate: CI rejects schema drift, type errors, failed tests, and a broken image
build.

### M2: auth, RBAC, audit, and uploads

- Add a real user table, password hashing, short-lived access tokens, refresh
  rotation, and role guards.
- Add audit events for privileged mutations.
- Validate upload size, media type, extension, and parsed content.

Gate: integration tests prove that a normal user cannot execute an admin
operation or read another tenant's data.

### M3: scalable vector delivery

- Compare GeoJSON, dynamic MVT, and PMTiles on the same dataset.
- Add an OGC API Features-compatible collection/items surface.
- Publish a GeoParquet analytical copy and document the data contract.

Gate: an ADR selects a delivery mode using update frequency, security, p95,
and monthly cost.

### M4: raster and processing

- Build and validate a COG deterministically.
- Add STAC Item/Collection metadata and bbox/time search.
- Add queue-backed processing with retries, idempotency, and job status.

Gate: a remote range-read check, processing report, and failure recovery test
all pass.

### M5: GeoAI or 3D specialization

Choose one primary track; the other may remain an elective.

- GeoAI: spatial split, baseline, per-region metrics, error gallery, threshold
  decision, georeferenced output, and model card.
- 3D: source manifest, reproducible reconstruction, independent checkpoint
  RMSE, PDAL QA, tiled viewer, and provenance.

Gate: the result is independently evaluated, not described only as "works".

### M6: operations and field reliability

- Add metrics, logs, OpenTelemetry traces, SLOs, alerts, and a runbook.
- Perform backup/restore and one injected dependency failure.
- Add an offline region pack, durable outbox, idempotent sync, and conflict UI.

Gate: evidence shows detection, user behavior, recovery, and post-incident
learning.

### M7: professional defense

- Deploy an HTTPS demo.
- Complete the evidence checklist in `docs/evidence-checklist.md`.
- Rehearse a 45-minute review and a random 15-minute change request.

Gate: an external reviewer awards at least 80/100 with no critical failure.

## Evidence rules

- Never invent benchmark, model, or test results.
- Record dataset source, license, checksum, and version.
- Keep an AI-use log for generated code or analysis.
- A screenshot supports evidence but does not replace a reproducible command.
- Secrets and private location data must never enter Git history.

## Current baseline scope

The starter deliberately includes only the first vertical slice: read-only
spatial data, viewport loading, health checks, request IDs, seed data, and
tests. Authentication, queueing, raster, AI, cloud, and offline sync are course
milestones, not hidden finished solutions.
