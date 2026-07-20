# Flagship loyiha: GeoPulse

## Maqsad

GeoPulse - hududiy obyektlar, hodisalar yoki infratuzilmani kuzatish uchun
geospatial platforma. U SkillMap kurslaridagi Frontend, Backend, Geospatial,
Telegram Bot va Production Engineering bilimlarini bitta deploy qilingan
portfolio loyihasida birlashtiradi.

## Foydalanuvchi vazifasi

Foydalanuvchi xaritada obyektlarni ko'radi, qidiradi va filtrlab kuzatadi.
U tanlangan hudud yoki hodisa uchun Telegram bildirishnomalariga obuna bo'la
oladi. Administrator esa obyektlarni boshqaradi va tizim holatini kuzatadi.

## Tavsiya etilgan arxitektura

```text
React + MapLibre UI
        |
Python / FastAPI API
        |
PostgreSQL + PostGIS
        |
Telegram Bot / background worker
        |
Docker Compose + Nginx + CI/CD
```

## Uch oylik yo'l xaritasi

### 1-oy: mahsulot poydevori

- React dashboard: login, obyektlar ro'yxati, qidiruv va filtrlash.
- FastAPI API: Pydantic contract bilan CRUD, pagination va input validation.
- PostgreSQL sxemasi, migrationlar va seed ma'lumotlar.
- Auth: foydalanuvchi, admin va moderator rollari.
- Git ishlash tartibi: feature branch, pull request, code review checklist.

**Natija:** auth bilan himoyalangan, deploy qilishga tayyor dashboard va API.

### 2-oy: GIS va yuqori unumdorlik

- GeoJSON, raster va vector data farqlari.
- Coordinate system va projection tanlovi.
- MapLibre xaritasi, markerlar, layerlar va viewport bo'yicha qidiruv.
- PostGIS geometry/geography, spatial query va GIST index.
- Geocoding, routing yoki spatial analysisdan bitta real use case.
- Katta data uchun clustering, server pagination yoki vector tiles.
- OpenStreetMap licensing, data quality va joylashuv maxfiyligi.

**Natija:** tez ishlaydigan interaktiv xarita va spatial qidiruv.

### 3-oy: production tayyorgarligi

- Telegram bot: hudud yoki hodisa bo'yicha subscription va bildirishnoma.
- Background job/queue va kerak bo'lsa WebSocket orqali jonli yangilanish.
- Docker Compose, Nginx reverse proxy va environment konfiguratsiyasi.
- CI/CD: lint, test, build va deploy bosqichlari.
- Structured logging, error tracking, health check va backup rejasi.
- README, demo video/screenshot va arxitektura sxemasi.

**Natija:** ommaga ko'rsatiladigan, deploy qilingan portfolio mahsuloti.

## Sifat talablari

### Xavfsizlik

- Secretlar faqat `.env` yoki deployment secretlarida saqlanadi.
- API barcha inputlarni validatsiya qiladi.
- Role-based access control yozish/o'chirish amallarini himoya qiladi.
- Rate limit va aniq xato javoblari mavjud.

### Testlar

- Unit: business logic, spatial helperlar va validation.
- Integration: API, database va migrationlar.
- User flow: login, filter, xarita qidiruvi va subscription.
- Failure scenario: noto'g'ri input, ruxsatsiz so'rov, database uzilishi,
  bo'sh natija va tashqi servis xatosi.

### System design savollari

- 10 ming foydalanuvchida qaysi querylar index talab qiladi?
- 1 million obyekt uchun markerlar o'rniga qaysi rendering strategiyasi kerak?
- Cache qayerda foydali, qayerda noto'g'ri ma'lumot qaytarishi mumkin?
- Queue qaysi og'ir ishlarni HTTP so'rovdan ajratadi?
- Backup va tiklash amalda qanday sinovdan o'tadi?

## Yakuniy rubric

- Ilova demo serverda ochiladi va README orqali lokal ishga tushadi.
- Foydalanuvchi xaritada obyektni qidirib, filtrlab va ko'rib chiqadi.
- API auth, role va validation bilan himoyalangan.
- PostGIS spatial index va kamida bitta spatial query ishlatilgan.
- Telegram bildirishnomasi ishlaydigan real flowga ega.
- Test, CI/CD, log va backup rejasi hujjatlashtirilgan.
- Arxitektura qarorlari, cheklovlar va keyingi qadamlar README'da tushuntirilgan.

## Kurslardagi bog'lanishlar

| Kurs | GeoPulse ichidagi qo'llanishi |
| --- | --- |
| Geospatial | PostGIS, MapLibre, GeoJSON, spatial index, vector tiles |
| Frontend | React dashboard, map UX, filter, user flow test |
| Backend | API, auth, roles, validation, database, queue |
| Telegram Bot | Subscription, notification, admin buyruqlari |
| English | README, issue, PR va texnik hujjatlarni Englishda yozish |
| AI Prompt | Support promptlari, data summarization yoki operator yordamchisi |
