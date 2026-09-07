# System Design: oddiy misoldan production fikrlashigacha

Bu kichik laboratoriya kursdagi 15 modulga tayanch beradi. Python 3.11+ va standart
`sqlite3` kutubxonasi yetadi. GeoPulse/FastAPI/PostGIS laboratoriyasi keyingi transfer
bosqichi; ushbu SQLite sinovi PostgreSQL locking/performance dalili emas.

## Boshlash

Repository ildizidan:

```powershell
cd labs/system-design
python -m unittest -v
```

Har test vaqtinchalik database yaratadi va yakunda o‘zinikini tozalaydi. Real
database, account yoki API token kerak emas. Kutish: 11 test `OK`. Natijaga
ishonishdan oldin testdagi assertionlarni o‘qing.

Frontend race reference uchun repository ildizida:

```powershell
npm test -- src/data/learning/viewport-reference.test.ts
```

Ikki test kech A success/errori B natijasini bosmasligi, dispose va current errorni
tekshiradi. Bu brauzer/map FPS benchmarki emas.

## Tizimni o‘qish tartibi

1. `Actor` — adapter tasdiqlagan user/tenant. Lab authentication qilmaydi.
2. `reserve` — validate → transaction → replay check → booking + outbox → commit.
3. `cancel` — user/tenant + expected version + valid state bilan conditional update.
4. `deliver` — durable outboxni o‘qiydi; local unique effect key takrorni cheklaydi.
5. `snapshot` va `read_booking` — boshqa databasega restore va app-level read.

```text
Browser/Telegram adapter       (bu labda implementatsiya qilinmagan)
        | trusted Actor + validated command
        v
Domain: reserve/cancel
        | transaction
        +--> booking
        +--> outbox --> deliver --> local effect
                            crash after effect, before ack
                            retry -> same event ID -> no extra local effect
```

Bookingdagi `UNIQUE(tenant,event,seat)` bir seatga ikkita tasdiqni cheklaydi.
`UNIQUE(tenant,user,operation)` retry IDni foydalanuvchi doirasida saqlaydi.
Bir operationga boshqa payload kelsa konflikt. Lab siyosati: cancelled seat staff
reconciliationgacha bo‘shatilmaydi. Bu biznes siyosatini o‘zgartirsangiz uniqueness
va state invariantlarini ham qayta loyihalash kerak.

## Modulma-modul bajarish

| Modul | Kuzatish / expected | Mustaqil o‘zgartirish va dalil |
|---|---|---|
| SD0 | Bir seat ikki userga tasdiqlanmasin — invariant | Kutubxona briefi: input/output,3 constraint,5 unknown, acceptance |
| sd1 | `test_request_retry`: bir operation ikki marta, booking1 | Response commitdan keyin yo‘qolgan diagram; payload almashtirish konflikti |
| SD-FE | Viewport test: A kech keldi, B qoladi | React effect cleanup + response.ok + loading/empty/error uchun komponent testi |
| SD-BE | `test_stale_transition`: v1→v2; eski v1 rad | Staff reopen policy, allowed/denied transition jadvali |
| SD-DB | `test_parallel_seat`: barrier+ikki connection;1 created,1 conflict | Boshqa event/tenant seatlari ham sinov; keyin Postgres ikki connection bilan takrorlash |
| SD2 | `test_atomic_rollback`, `test_outbox_replay`: ikkala yozuv yoki hech biri; effect1 | Crash nuqtalari jadvali, external provider duplicate cheklovi |
| SD-DIST | Stale version testi konfliktni aniqlaydi | Offline operation/base version, name/geometry uchun merge va review UX |
| SD-PERF | `test_capacity`:40/80 req/s,4 MB/s payload | 400 user/10s/peak3:40/120 req/s,6 MB/s; cold/warm test protokoli |
| SD3 | `test_slo`:99.3%, remaining-20 | 20k/99.9%/15bad → remaining5; eligible/good va alert owner |
| SD-SEC | `test_tenant_boundary`: cross-tenant read/cancel rad | Private cache, revocation va IDOR negative test |
| SD-DEL | `test_additive_migration`: note qo‘shildi, eski reader ishlaydi | Expand/backfill/contract; old worker + live writer davri |
| SD-REC | `test_backup_restore`: restored confirmed, live cancelled | Timed restore drill; target va observed RPO/RTO alohida |
| SD-STYLE | Hujjat/ADR vazifasi | Compose worker isolation vs service extraction; ops/data cost va trigger |
| SD-GEO | Layer policy vazifasi | Public base snapshot, private/editable layer, CRS/zoom/version/rollback |
| SDF | Butun evidence pack review | Notanish domain, reviewer constrainti va qaror revisioni |

## Bitta testni chuqur ishlash

```powershell
python -m unittest test_core.ArchitectureLab.test_parallel_seat -v
```

Avval natijani ayting: ikkita requestdan faqat bittasi seatni band qiladi. Testdagi
barrier requestlarni bir vaqtda boshlatadi; har request o‘z connectionini ochadi.
SQLite `BEGIN IMMEDIATE` writerlarni seriallashtiradi, unique constraint invariantni
saqlaydi. Bu Postgres READ COMMITTED yoki SERIALIZABLE bilan bir xil mexanizm emas.

Mustaqil tajriba: vaqtinchalik nusxada UNIQUE seat constraintini olib tashlang.
Test yiqilishi kerak, chunki ikki booking paydo bo‘ladi. Keyin constraintni qaytaring.
Testning nima sababdan yiqilganini yozing; yangi xatoni shunchaki expected qilib
o‘zgartirmang. Kursdagi tayyor labni almashtirmaslik uchun tajribani alohida branchda
yoki o‘z nusxangizda bajaring.

## Production transfer: GeoPulse

1. SQLite booking o‘rniga PostGIS field inspection task tanlang. Event/seat invariantini
   field/date/operation kontekstiga moslang; eski nomlarni shunchaki rename qilmang.
2. FastAPI adapterda Pydantic runtime input validation va trusted identity dependency
   qo‘shing. Tenantni client bodydan ishonchli deb olmang.
3. Postgres transaction, unique constraint, outbox va worker yozing. Ikki real connection
   bilan race test qiling. External effect uchun provider idempotency yoki reconciliation
   cheklovini hujjatlashtiring.
4. React/MapLibre’da mutation result, pending/failed va stale response holatlarini sinang.
5. Backup/restore, metrics va fault drillni stagingda bajaring.

Bu beshta integratsiya ushbu kichik labda tayyor deb ko‘rsatilmaydi. Mavjud
`../geopulse/docs/system-design-labs.md` production milestone’lari shu bosqichni beradi.

## Reviewerga topshirish

Har modul uchun bitta review yozuvi:

```markdown
# Modul va sana
- Oldin kutgan natijam:
- Command / environment:
- Haqiqiy output va assertion:
- Shartni qanday o‘zgartirdim:
- Qaysi test nima uchun yiqildi:
- Tuzatish va qayta tekshiruv:
- Boshqa domain/geospatialga o‘tkazishdagi farq:
- Bilmayotgan joyim va tekshirish usuli:
```

Qabul: natijani tushuntira oladi; variantni mustaqil o‘zgartiradi; negative testni
yozadi; yangi domain cheklovini hisobga oladi. Faqat `OK` screenshot yetarli emas.
Bir va yetti kundan keyin misolni yopib invariant va crash oqimini qayta chizing.

## Manbalar

- [Python sqlite3](https://docs.python.org/3/library/sqlite3.html): transaction va backup API.
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html): keyingi DB transferi.
- [Google SRE SLO](https://sre.google/sre-book/service-level-objectives/): indikator, maqsad va o‘lchov.
