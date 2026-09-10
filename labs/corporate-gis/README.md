# MockAtlas — ishga tushiriladigan starterlar

Faqat original sun’iy fixture. Real korxona bazasi, Tegola konfiguratsiyasi,
endpointi, style fayli, tokeni yoki xarita ma’lumotini qo‘shmang.
Python 3.11+ va SkillMapning o‘rnatilgan npm dependencylari kerak.

## 1. Tile server → resumable MBTiles

Repository ildizida (Windows PowerShell va Ubuntu uchun bir xil):

```sh
python -m unittest discover -s labs/corporate-gis -p "test_*.py" -v
python labs/corporate-gis/lab.py --output node_modules/.tmp/synthetic.mbtiles --limit 2
python labs/corporate-gis/lab.py --output node_modules/.tmp/synthetic.mbtiles --fault retry
```

Birinchi buyruq testlarni bajaradi. Exportning birinchi yurishi `complete: false`
chiqaradi: beshta kutilgan tile ichidan ikkitasi yozildi. Ikkinchi yurish ulardan
davom etadi; 503 javobini cheklangan retry bilan qayta oladi. Yakunda `complete: true`.
`--fault html`ni YANGI archive nomi bilan ishlating: 200 HTML tile emas, jarayon
xato bilan tugashi kerak. Oldingi release avtomatik o‘chirilmaydi.

Server faqat loopbackda vaqtinchalik port ochadi va o‘zi yopiladi. U z0 va z1dagi
5 ta tile uchun minimal valid MVT point qatlamini beradi. MBTiles tile_row TMSga
aylantiriladi; payload gzip bir marta; metadata layer `mock_points`. SQLite tile
va checkpointni bitta transactionda yozadi. SHA-256 buzilgan faylni aniqlaydi.
Fixture validator faqat o‘zimiz yaratgan MVTni qabul qiladi, universal MVT parser emas.

Rasmiy `pmtiles` CLI o‘rnatilgan bo‘lsa, yangi nomdan boshlang:

```sh
python labs/corporate-gis/lab.py --output node_modules/.tmp/synthetic-convert.mbtiles --pmtiles-bin pmtiles
```

Complete archive avval tekshiriladi, so‘ng `convert` va `verify` bajariladi.
Candidate faqat muvaffaqiyatdan keyin yakuniy nomga o‘tadi; mavjud release ustiga
yozilmaydi. CLI bo‘lmasa MBTiles va barcha local testlar mustaqil ishlaydi.
`pmtiles verify` vizual parity testi emas. Bu sinov hozir real Tegola xizmatiga ulanmaydi.

Mustaqil o‘zgartirish: yangi synthetic point layer/version yarating, eski manifest
bilan resumeni bloklang. Invalid gzip, timeout va 429 holatlariga test yozing.
Archive nomini almashtirish snapshot almashganini ochiq ko‘rsatsin.

## 2. Ikki worker va restart

Yuqoridagi unittest ikki haqiqiy OS processni `spawn` qilib ishga tushiradi.
Ular barrier orqali bir vaqtning o‘zida SQLite `BEGIN IMMEDIATE` bilan jobni olishga
urinadi. Faqat bittasi claim qiladi. Boshqa testda A claimdan so‘ng tugaydi,
simulyatsiya qilingan vaqt lease tugashiga o‘tadi, B reclaim qiladi. Eski fence
bilan completion va duplicate completion rad etiladi.

`claim`, `finish` funksiyalarini `lab.py`dan o‘qing. Bu test SQLitega tegishli;
PostgreSQL row-level concurrency, broker, real clock drift, heartbeat yoki tashqi
side-effect exactly-once kafolati emas. Keyingi mustaqil ish: shu invariantlarni
mock datasetli Postgres containerda saqlab, storage adapterni almashtirish.

## 3. Real npm tarball va ikki consumer

```sh
npm run test:corporate-sdk
```

Script hozirgi `MapCanvas.tsx`dan JS va declarationlarni build qiladi, `npm pack`
bilan `@mockatlas/react-map` tarballini yaratadi, `viewer` va `editor` nomli ikki
alohida consumerga offline o‘rnatadi. Har biri typecheck, Vite build va Chromium
sinovidan o‘tadi: synthetic point tanlash, parent render va unmount cleanup.
Hech narsa npm registryga publish qilinmaydi. React lokal o‘rnatilgan nusxadan olinadi.
Chromium oldin o‘rnatilmagan bo‘lsa `npx playwright install chromium` kerak.

Yaratilgan `package/`, `viewer/`, `editor/` va tarball manzili terminalda chiqadi
(`node_modules/.tmp/mock-sdk-*`). Ularni ochib kodni o‘zgartirish mumkin. Maplibre
adapterining o‘rniga DOM button adapteri bor — rendering performance testi emas.

`createMap`ning yangi function identitysi xaritani qayta yaratmaydi. Haqiqiy
renderer/configni almashtirish kerak bo‘lsa `instanceKey`ni o‘zgartiring; bu eski
instance cleanupini bajarib, eng so‘nggi factory bilan yangisini yaratadi.
`onSelect` esa remountsiz yangilanadi. Keyingi vazifa: style/layer update uchun
adapter metodlari, keyin haqiqiy MapLibre adapteri va kamera holatini saqlash.

## Dalil va baholash

Saqlang: buyruq, haqiqiy natija, birinchi xato, tuzatish, mustaqil variant va ADR.
MVT fixture va SQL state-machine natijasi production tizim tayyor degani emas.
CI bu Python lab va npm tarball/consumer sinovlarini alohida ishga tushiradi.
