# System Design Academy — GeoPulse executable labs

Bu hujjat `System Design & Production Academy`ning 15 modulini bitta ishlaydigan
GeoPulse repositorysi bilan bog'laydi. Maqsad 15 ta alohida demo yaratish emas:
har milestone oldingisini buzmasdan, bitta productionga yaqin vertical slice'ni
kuchaytiradi.

Har lab yakunida quyidagi dalil majburiy:

1. qayta bajariladigan command yoki test;
2. architecture decision record (ADR) yoki yangilangan contract;
3. bitta failure scenario va uning recovery dalili;
4. o'lchov: query plan, latency, log/trace, metric yoki restore vaqti.

"Tayyor" degan yozuv dalil emas. Test, output, metric yoki reviewer ishlata
oladigan qadam bo'lishi kerak.

## Ishga tushirish

```powershell
cd labs/geopulse
Copy-Item .env.example .env
docker compose up --build --wait
./scripts/smoke-test.ps1
```

Toza boshlashdan oldin muhim data bo'lmasa, faqat shunda:

```powershell
docker compose down --volumes
```

## 15 milestone

| Modul | Lab natijasi | Failure drill | Dalil |
| --- | --- | --- | --- |
| SD0 | `docs/brief.md`: user, acceptance criteria, scope, data owner | noaniq talabni discovery savollariga qaytarish | brief + review notes |
| sd1 | Task yaratish vertical slice: React → FastAPI → PostGIS → worker | Telegram timeout, task saqlanib qolishi | API integration test + job log |
| SD-FE | Viewport loader, cancellation, loading/empty/error/degraded UX | eski bbox response qaytishi | component/E2E test + Network screenshot |
| SD-BE | Task state-machine, RBAC va audit | boshqa user taskni yopishga urinish | integration test + audit row |
| SD-DB | Alembic migration, CRS/validity guard, GiST query | invalid geometry yoki lock-risk migration | migration test + `EXPLAIN ANALYZE` |
| SD2 | Import/notification job, retry, idempotency | duplicate job yoki Redis restart | job state report + duplicate test |
| SD-DIST | Offline sync operation id, WebSocket reconnect/fallback | double-submit va network cut | sync test + UX video |
| SD-PERF | p95 budget, cold/warm cache benchmark, tile/API profiling | cache missdagi sekin hudud | benchmark report + query plan |
| SD3 | health, logs, traces, SLI/SLO va alert | database temporary outage | alert evidence + postmortem |
| SD-SEC | tenant scope, file policy, secret scan, privacy retention | cross-tenant API/file URI | security test + threat model |
| SD-DEL | CI gate, image build, staged config, rollback plan | migration/deploy mismatch | CI run + rollback rehearsal |
| SD-REC | RPO/RTO, encrypted backup, isolated restore | bad import yoki database loss | timed restore + smoke result |
| SD-STYLE | modular-monolith boundaries va service extraction ADR | unnecessary microservice proposal | context diagram + ADR |
| SD-GEO | base/operational/live layer policy, license checklist | private data public cache/packagega tushishi | layer policy + access test |
| SDF | external architecture defense | reviewer tanlagan random change request | scorecard + demo + evidence pack |

## Per-lab review format

Har milestone uchun `docs/evidence/<module>-review.md` yarating:

```md
# SD-... review

## User impact
- Kimga ta'sir qiladi?
- Success qanday o'lchanadi?

## Decision
- Context va constraint:
- Tanlangan variant:
- Rad etilgan variant:
- Trade-off:
- Revisit trigger:

## Failure drill
- Qanday qayta yaratildi:
- Symptom va log/metric:
- Recovery:
- Regression test:

## Evidence
- Command / CI URL:
- Screenshot/trace/query-plan:
- Reviewer note:
```

## Quality gates

Milestone keyingisiga o'tishdan oldin:

- `docker compose up --build --wait` va smoke-test ishlaydi;
- yangi API/domain qoidasi test bilan yopilgan;
- secret yoki private location data Gitga kirmagan;
- performance da'vosi measured yoki "hali o'lchanmagan" deb yozilgan;
- failure drill va ADR mavjud;
- README oldingi start qadamlarini buzmagan.

## Qasddan qo'shilmagan murakkablik

Kubernetes, Kafka, ko'p microservice va global multi-region deploy bu labning
defaulti emas. Ular faqat real traffic, mustaqil ownership/release yoki
o'lchangan resource bottleneck buni talab qilsa ADR bilan qo'shiladi.
