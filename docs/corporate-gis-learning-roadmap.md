# MockAtlas: korporativ platforma amaliyoti

2026-09-10. Bu material boshidan sun’iy yaratilgan. Hech qanday tashqi
korxona loyihasining kodi, konfiguratsiyasi, fayli yoki ma’lumoti ishlatilmagan.
`mock-building-1`, `zone-a`, `zone-b`, `u1` va kvadrat koordinatalar o‘quv fixturelari.
Lab tarmoqqa chiqmaydi va credential talab qilmaydi. Real data import qilmang.

## Mavjud kurslarga joylashuvi

| Mavzu | Asosiy modul | Natija |
|---|---|---|
| Markaziy GIS va hududiy release | Geospatial / z14 | Snapshot, review, checksum, candidate va activation |
| React map SDK | Frontend / FE9 | Ikki consumer, event kontrakti, cleanup, package release |
| Tegola → MBTiles → PMTiles | Geospatial / z8 | Tile reyestri, XYZ/TMS, restart, metadata va vizual parity |
| Moslik va rollback | System Design / SD-DEL | Data/style/SDK bundle, canary, release gate |
| Durable worker | Backend / BX2 | Lease, fencing, idempotency va crash recovery |
| Token lifecycle | Backend / BE7 | Role downgrade, revocation, fail-closed va tenant scope |
| Golden record | Geospatial / z5 | Geometry/attribute fingerprint, provenance, review |

Git / GT10 release casega CI vazifasi bilan, Cybersecurity / CY3 token casega
negative security test bilan bog‘langan. Geospatial / FG finali markaziy release
dalilini talab qiladi. Yangi kurs yoki modul yaratilmagan; oldingi ID, task va
localStorage kalitlari o‘zgartirilmagan. Darsning to‘liq matni faqat egasi modulda;
bog‘langan kurslar uni takrorlamaydi.

## O‘rganish tartibi

Har case: oddiy o‘xshatish → aniq mock input → qadamli yechim → trade-off →
mustaqil variant → ataylab xato kiritish → qabul mezoni. Har ishga ADR va
modul ish daftarida test buyrug‘i, haqiqiy natija, xato hamda tuzatish dalili kerak.
Avval z5 va FE9, so‘ng BE7/BX2, keyin z8, z14 va SD-DELni bajaring.

## Ishga tushiriladigan reference modellar

Repository ildizida:

```sh
npm test -- src/labs/corporate-gis/reference.test.tsx src/data/learning/corporate-platform.test.ts
npm run build
npm run test:e2e
```

`src/labs/corporate-gis/reference.ts` quyidagi sof mantiqni modellashtiradi:
XYZ/TMS, complete archive gate, mos release activation/rollback, lease va eski
workerning completionini rad qilish, joriy userga nisbatan token authorization,
geometriyani ham qamragan canonical serialization. SHA-256 testda haqiqiy hisoblanadi.
`MapCanvas.tsx` injected fake adapter bilan React lifecycle namunasidir.
Test ikkita host va StrictMode cleanup, callback yangilanishini tekshiradi.
Bu testlarda tashqi xizmat, real xarita va maxfiy ma’lumot yo‘q.

## Modeldan production integratsiyasiga chegaralar

**Auditdan keyingi to‘ldirish:** [bajariladigan starterlar](../labs/corporate-gis/README.md)
qo‘shildi: local HTTP tile fixture, resumable SQLite MBTiles exporter, ikki haqiqiy
worker process sinovi, npm tarball va ikki mustaqil React consumer. React factory
identity muammosi tuzatildi; explicit reset uchun `instanceKey` mavjud.

- SQLite ikki process claim/recovery testi bor; haqiqiy Postgres transaction,
  broker, heartbeat va tarmoq bo‘linishi testi hali alohida integratsiya.
- Authorization model JWT imzosini tekshirmaydi; faqat trusted claimsdan keyingi
  policy. Productionda signature, algorithm, issuer, audience va session store kerak.
- Exporter faqat o‘z synthetic MVT fixturelarini qabul qiladi. HTTP status/type,
  gzip, metadata, checkpoint va checksum tekshiriladi. PMTiles conversion runneri
  bor, lekin rasmiy CLI bu muhitda o‘rnatilmagan: haqiqiy conversion/Range/visual
  parity bajarilgan deb ko‘rsatilmaydi.
- Npm pack, exports/types va ikki alohida consumer typecheck/build/browser testi
  bor. Adapter DOM fixture, haqiqiy MapLibre rendering/3D/FPS testi emas.
- Exact schema modeli backward compatibility matritsasining sodda ko‘rinishi.
  Productionda required layers/fields va qo‘llab-quvvatlanadigan versiyalar tekshiriladi.
- Canonical JSON topologik normalization yoki GIS validity tekshiruvi emas.
  PostGIS ST_IsValid/ST_Equals va geometriya normalizatsiyasi alohida bajariladi.

Qolgan real integratsiyalar bu yangilanishda bajarilgan deb hisoblanmaydi. Kurs ularni
mustaqil topshiriq va dalil mezoni sifatida beradi. Test o‘tishi professional
kompetensiya yoki production SLO tasdiqlangani degani emas.

## Shu o‘zgarish uchun tekshiruv natijasi

**Starterlar to‘ldirilgandan keyingi yakuniy tekshiruv:** 206 unit/kontent testi,
29 brauzer testi, 9 Python lab testi va production build o‘tdi. SDKning viewer
va editor consumerlari real local tarballni o‘rnatib typecheck/build va browser
selection/cleanupdan o‘tdi. CLI orqali MBTiles exportning partial → resume →
complete ketma-ketligi bajarildi. PMTiles binary mavjud emasligi sababli haqiqiy
PMTiles conversion bajarilmadi; runnerning incomplete/failure bloklash testlari o‘tdi.

Quyidagi 204/29 sonlari birinchi qo‘shilish auditi; keyingi starter testlari
`npm run test:corporate-sdk` va `python -m unittest discover -s labs/corporate-gis -p "test_*.py" -v`
bilan alohida bajariladi.

- `npm run build`: 31 faylda 204 unit/kontent testi, TypeScript va production build o‘tdi.
- `npm run test:e2e`: 29 brauzer testi o‘tdi.
- Oxirgi cross-course link va ochiladigan dars bo‘limlari tekshiruvi qo‘shilgach,
  `npm run test:e2e -- e2e/corporate-learning.spec.ts` qayta o‘tkazildi: 1/1 o‘tdi.
- Oldingi modul/task/code tartibi va identifikatorlarini saqlash test bilan tekshirildi.
- Haqiqiy tile export, DB race, npm publish va production deploy bajarilmadi.

## Rasmiy manbalar

- [React effect va cleanup](https://react.dev/reference/react/useEffect)
- [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [PMTiles CLI: convert va verify](https://docs.protomaps.com/pmtiles/cli)
- [MBTiles 1.3 spetsifikatsiyasi](https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md)
- [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [PostGIS ST_Equals](https://postgis.net/docs/ST_Equals.html)

Manbalardagi mexanizmlar o‘quv modeliga moslashtirilgan; real muhitingiz versiyasi
va cheklovlarini integration bosqichida qayta tekshiring.
