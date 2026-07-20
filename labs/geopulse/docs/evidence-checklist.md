# Professional evidence checklist

## Product and UX

- [ ] Live HTTPS demo
- [ ] Main user flow and acceptance criteria
- [ ] Loading, empty, error, degraded, mobile, and offline behavior
- [ ] Accessibility and field-use review

## Engineering

- [ ] Repository with meaningful commit history
- [ ] OpenAPI contract and data contract
- [ ] Backend unit/integration and spatial query tests
- [ ] Frontend user-flow tests
- [ ] CI run that gates typecheck, tests, migrations, and image build

## Performance and data

- [ ] Realistic seed/data manifest with source, license, and checksum
- [ ] PostGIS `EXPLAIN (ANALYZE, BUFFERS)` before/after report
- [ ] Browser/tile/raster performance budget
- [ ] COG remote range-read evidence when raster is in scope

## Security and operations

- [ ] Threat model, RBAC tests, audit trail, and secret scan
- [ ] Structured logs, metrics, traces, SLO, and alert
- [ ] Deployment, rollback, incident, and restore runbook
- [ ] Clean-environment backup restore evidence with RPO/RTO

## AI or 3D specialization

- [ ] Dataset/source card and independent evaluation
- [ ] Error analysis and limitations
- [ ] Model card or 3D accuracy report
- [ ] Human review, provenance, and monitoring/update policy

## Ownership

- [ ] Architecture diagram and ADRs
- [ ] AI-use log
- [ ] Five-to-eight minute demo video
- [ ] Forty-five minute external defense
- [ ] Fifteen minute random change request
