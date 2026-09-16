# Geospatial ta’limi va bozor talablari auditi

Tekshiruv: 2026-09-16. Scope: SkillMap Geospatial Full-Stack Academy mazmuni,
uning supporting kurslari bilan bog‘lanishi va foydalanuvchi bergan
[GEO CAREERS salary results](https://www.geo-careers.com/salary-survey/results/).

## Xulosa: qaysi kasbga va qaysi darajaga?

React/TypeScript, MapLibre, FastAPI, PostGIS, GDAL va Docker asosidagi yo‘l eng
avvalo **GIS Developer / Geospatial Software Engineer** profiliga mos.
Data Engineer va GeoAI yo‘llari qo‘shimcha ixtisos; GIS Manager esa alohida
odamlar, byudjet va strategiya mas’uliyati. Bir kurs barcha GIS kasblarining
professional tayyorgarligini birday qoplashi shart emas.

**Mazmun bo‘yicha:** poydevordan mustaqil full-stack loyiha qurishgacha keng yo‘l,
undan keyin production va senior qarorlariga oid mashqlar mavjud.
**Ta’lim natijasi bo‘yicha:** modulni o‘qish senior tajribasiga teng emas.
Avtomatik testlar kontent/UI/reference kontraktini tekshiradi; o‘quvchining
mustaqil integratsiya, real operatsion ish va muloqot qobiliyatini isbotlamaydi.
Shu sabab bu audit “hamma o‘quvchi 10/10 yoki senior bo‘ladi” degan baho bermaydi.

Kuchli jihatlar: prerequisite, ishlangan misol, xato ssenariysi, mustaqil transfer,
rubric, qayta eslash va portfolio dalili birga berilgan. Chegara: professional
bo‘limlar uchun asoslar kerak; ayrim real integratsiyalarni o‘quvchi alohida
muhitda bajarishi va boshqa mutaxassisga himoya qilishi zarur.

## Maosh jadvalini qanday talqin qildik?

[Geospatial Engineer](https://www.geo-careers.com/salary-data/geospatial-engineer/)
sahifasida 15 ish, 7 maoshli e’lon; senior $197,400 uchun **n=1** ko‘rsatilgan.
Sahifa “Updated Feb 2026” deb turibdi. Bu e’lonlar namunasi, to‘liq bozor
statistikasi yoki O‘zbekistondan remote ishlovchining kutiladigan oyligi emas.
Maosh saytini kurs sertifikatsiyasi o‘rnida ishlatmadik.

Kasbiy talablarni ajratish uchun
[GIS Developer](https://www.geo-careers.com/salary-data/gis-developer/) va
[Data Engineer](https://www.geo-careers.com/salary-data/data-engineer/)
profillari ham solishtirildi. Uchalasidagi barcha vositalarni bitta odam uchun
majburiy ro‘yxatga aylantirmadik.

Asosiy ish beruvchi manbasi:
[Planet Software Engineer](https://job-boards.greenhouse.io/planetlabs/jobs/8190766)
production tajribasi, API/imagery tizimlari, cloud, test, observability va
yozma texnik muloqotni talab qiladi. U Yevropadagi ofislardan haftasiga 3 kunlik
hybrid rol: worldwide remote deb taqdim etilmadi.
[Esri enterprise data engineer](https://www.esri.com/careers/system-engineer-enterprise-data-engineer-5096369007)
esa enterprise ma’lumot va operatsion integratsiya yo‘lining boshqa misoli.
Bu e’lonlar butun bozorni ifodalamaydi va keyinchalik yopilishi mumkin.

Agregatorda ko‘ringan ORNL misoli
[asl ish beruvchi sahifasida](https://jobs.ornl.gov/job/Oak-Ridge-Geospatial-Software-Engineer-II-TN-37830/1402228800/)
yopilgan edi. Shuning uchun “current openings” yozuvi o‘zi yetarli dalil emas.

## Mavjud qamrov va kiritilgan aniq yaxshilanishlar

| Ko‘nikma | Avvalgi holat | Bu ishda qo‘shilgan qism | Tekshiriladigan natija |
| --- | --- | --- | --- |
| Spatial backend va map UI | PostGIS, query plan, API, MapLibre, tile/performance bor | Asosiy stack o‘zgartirilmadi | Mavjud API/tile/lab dalillari |
| Enterprise interoperability | OGC API va formatlar bor; ArcGIS adapter chuqurligi kam | `cn1`: service metadata, pagination, conflict, CRS, export huquqi | Mock importda dedup va salbiy testlar |
| Katta raster hisoblash | NumPy, raster, COG/STAC bor; chunk qarorining hisobi yetarli emas | `py2`: xarray/Dask/Zarr farqi, 22.8125 GiB misol, nodata | Memory arifmetikasi va masked mean reference |
| Analytical data engineering | GeoParquet va data quality bor; lineage va retry birlashmagan | `z19`: snapshot identity, manifest, late data, quarantine | Canonical identity va revision o‘zgarganida yangi ID |
| Cloud ownership | Deploy, Docker, security, optional cloud mavjud | `z26`: reader/worker/publisher, IAM, private cache, cost/restore | Synthetic allow/deny; real sandbox keyingi bosqich |
| Ishga tayyor portfolio | Career, English va final evidence mavjud | `z32`: requirement matrix, 0–3 evidence holati, live-change himoya | Uch e’lon → aniq talab → repo/test/review dalili |
| GeoAI | Spatial split, leakage, model baholash va uncertainty mavjud | Takroriy model ro‘yxati qo‘shilmadi | Mavjud `ai1` va FG orqali amaliy baholash |

Yangi kurs ochilmadi. 5 mashq faqat o‘zining mavjud Geospatial modulida beriladi;
boshqa 12 kursga ArcGIS/cloud mavzulari tarqatilmadi. Mavjud module/task ID,
oldingi progress va assessmentlar saqlandi. Yangi topshiriqlar umumiy bajarilish
foizini kamaytirishi mumkin, lekin eski bajarilgan belgilarni o‘chirmaydi.

## O‘qish tartibi: hammasini birdan emas

1. **Asosiy professional yo‘l:** Python/TS, spatial data, PostGIS, API, map UI,
   test, xavfsizlik, deploy va observability. Mavjud FG loyihasini mustaqil
   ko‘tarish va ishlashini dalillash birinchi maqsad.
2. **Vakansiyaga qarab chuqurlik:** enterprise integratsiya uchun `cn1`;
   raster/time-series roliga `py2`; analytical pipeline uchun `z19`.
   Bitta oddiy loyihaga barcha vendor yoki distributed vositani tiqish shart emas.
3. **Cloud kerak bo‘lsa:** `z26` sandbox yo‘li. Offline/on-prem loyihada asosiy
   ruxsat, tiklash va xarajat tamoyillari qoladi; AWS hisob ochish majburiy emas.
4. **Dalil va muloqot:** `z32` → English GeoEN → FG. Har da’voga bajarilgan
   natija, cheklov va mustaqil tushuntirish biriktiriladi.

## Laboratoriya va halol tekshiruv chegarasi

[labs/market-readiness](../labs/market-readiness/README.md) Python standart
kutubxonasi bilan ishlaydi. Barcha data sun’iy; haqiqiy korxona bazasi,
loyiha nomi, credential yoki maxfiy geometriya ishlatilmadi.

Reference testlar ArcGIS live query, GeoParquet writer, Dask cluster yoki AWS
IAM ishlaganini bildirmaydi. Bularning integratsiya va operatsion testlari
tegishli ruxsatli muhitda alohida bajarilishi kerak. Hozirgi vazifada pulli
resurs yaratilmadi, tashqi bazaga ulanilmadi, real mijoz ma’lumoti yuborilmadi.

Rasmiy texnik manbalar:

- [ArcGIS Feature Service query](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer/)
- [xarray va Dask](https://docs.xarray.dev/en/stable/user-guide/dask.html)
- [GeoParquet 1.1 specification](https://geoparquet.org/releases/v1.1.0/)
- [Amazon S3 security best practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)

## Tekshiruv natijalari

- Python synthetic reference: **16/16** test o‘tdi.
- Ilova unit/content regressiya: **224/224** test o‘tdi; barcha kurslarda
  identifier saqlanishi va yangi mashqlar boshqa kurslarga tarqalmasligi tekshirildi.
- TypeScript + Vite production build: **o‘tdi**.
- Brauzer regressiya: **36/36** test o‘tdi, jumladan barcha kurs modullari
  va 5 yangi darsdagi yashirin javob/tezkor savol ishlashi.
- Production build + Netlify CSP smoke: **o‘tdi**; bu Netlifyga yangi deploy
  amalga oshirildi degani emas.

## Kursdan keyingi real malaka tekshiruvi

Mock testdan keyin mustaqil, ruxsatli muhitda bitta real adapter, kichik data
pipeline va restore mashqini bajaring. Reviewer yangi talab qo‘shsin va siz
arxitektura, test, xavfsizlik hamda xarajat qaroringizni yangilang. Shundan
keyingina CVda “namuna bilan bajardim”dan “mustaqil bajardim”ga o‘ting.
Bu bosqichlar uchun fake benchmark, reviewer bahosi yoki production tajribasi
yaratish mumkin emas. Maqsad ko‘proq nom bilish emas, tekshiriladigan ish natijasi.
