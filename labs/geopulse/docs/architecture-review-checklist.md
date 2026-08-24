# GeoPulse architecture review checklist

Bu checklist pull request, milestone review yoki final defenseda ishlatiladi.
Har "ha" javobi test, diagram, log, metric yoki runbook havolasi bilan
isbotlanadi.

## Product va user flow

- [ ] Birinchi user flow va acceptance criteria aniq.
- [ ] Loading, empty, error va degraded holatlar belgilangan.
- [ ] Userga ta'sir qiladigan failurelar ro'yxati mavjud.

## Boundary va data

- [ ] Frontend databasega bevosita ulanmaydi.
- [ ] API request/response contract hujjatlashtirilgan.
- [ ] Tenant scope server identitydan olinadi.
- [ ] PostGIS, object storage, Redis va cache ownershipi ajratilgan.
- [ ] CRS, coordinate order, geometry validity va license/provenance contracti yozilgan.

## Reliability va operations

- [ ] HTTP ichidagi ish va worker jobi ajratilgan.
- [ ] Retry/idempotency/xato siyosati bor.
- [ ] Health, structured log, metric va trace orqali diagnosis mumkin.
- [ ] SLI/SLO user impact bilan bog'langan.
- [ ] Backup restore mashqi o'tgan; RPO/RTO yozilgan.

## Security va delivery

- [ ] Object-level authorization va cross-tenant test mavjud.
- [ ] Secretlar source/log/browser bundle ichida yo'q.
- [ ] Upload, rate limit, audit va retention siyosati mavjud.
- [ ] CI test/build/smoke gate'i deploydan oldin o'tadi.
- [ ] Migration/rollback va incident runbook bor.

## Decision quality

- [ ] ADR context, alternative, trade-off va revisit trigger bilan yozilgan.
- [ ] Performance yoki scale qarori metricga tayangan.
- [ ] Keraksiz Kubernetes/Kafka/microservice qo'shilmagan.
- [ ] AI yordamidan foydalanish va mustaqil tekshiruv qayd qilingan.
