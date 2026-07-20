import type { Module } from "../types";

const CLOUD_NATIVE_VECTOR_MODULE: Module = {
  zoom: "cn1",
  title: "OGC API & Cloud-native Vector",
  sub: "Standards / GeoParquet / PMTiles",
  coord: "Modern geospatial / vector",
  eyebrow: "OGC API / INTEROPERABILITY / CLOUD-NATIVE",
  mtitle: "Tegola bilan cheklanmaydigan zamonaviy vector data arxitekturasi",
  lede:
    "Professional muhandis bitta tile serverni yodlamaydi. U transactional API, analytical file, dynamic tile va static archive orasida data hajmi, yangilanish tezligi, narx va access-control bo'yicha tanlov qiladi.",
  doc: `
    <h3>Prerequisite</h3><p><code>z5 PostGIS</code> va <code>z8 Vector Tiles</code> bajarilgan bo'lishi kerak.</p>
    <h3>To'rtta xizmat shakli</h3>
    <div class="exlist">
      <div class="ex"><b>OGC API - Features</b><span>Feature-level query, collection metadata, bbox va filter uchun interoperable REST API.</span></div>
      <div class="ex"><b>Dynamic MVT</b><span>Tez-tez yangilanadigan yoki userga qarab filtrlanadigan data uchun PostGIS + Martin/Tegola/pg_tileserv.</span></div>
      <div class="ex"><b>PMTiles</b><span>O'zgarmaydigan tile pyramidni object storage va CDN orqali range request bilan tarqatish.</span></div>
      <div class="ex"><b>GeoParquet</b><span>Katta analytical datasetni columnar formatda saqlash va DuckDB/GeoPandas bilan skan qilish.</span></div>
    </div>
    <h3>Standart va contract</h3>
    <p>OGC API - Features, Tiles va Processes endpointlarini OpenAPI contract bilan bog'la. CRS, bbox axis order, pagination, CQL2 filter, content negotiation, attribution va cache-control test bilan tekshiriladi.</p>
    <div class="tree">PostGIS transactional -> OGC API / dynamic MVT\nobject storage analytical -> GeoParquet\nobject storage visualization -> PMTiles + CDN</div>
    <div class="callout"><div><p>Architecture decision</p><p>"PMTiles zamonaviy" degani hamma joyda ishlatish degani emas. Per-user security yoki tez-tez update bo'lsa dynamic service kerak; read-only public layer bo'lsa static archive ancha sodda bo'lishi mumkin.</p></div></div>
  `,
  code: [
    {
      heading: { h: "OGC API minimal surface", p: "Collection discovery va bbox query contracti." },
      title: "ogc-api-routes.txt",
      lang: "http",
      code: `GET /collections\nGET /collections/assets\nGET /collections/assets/items?bbox=69.1,41.2,69.4,41.4&limit=100\nGET /collections/assets/tiles/WebMercatorQuad/{tileMatrix}/{tileRow}/{tileCol}\nGET /conformance\nGET /openapi`,
    },
    {
      heading: { h: "GeoParquet analytical query", p: "Datasetni databasega import qilmasdan column pruning bilan o'qish." },
      title: "analytics.sql",
      lang: "sql",
      code: `INSTALL spatial;\nLOAD spatial;\n\nSELECT category, count(*) AS total\nFROM read_parquet('s3://geo-data/assets/*.parquet')\nWHERE ST_Intersects(geometry, ST_GeomFromText(?))\nGROUP BY category\nORDER BY total DESC;`,
    },
    {
      heading: { h: "PMTiles + MapLibre", p: "Static archive browserdan range request bilan o'qiladi." },
      title: "pmtiles-source.ts",
      lang: "ts",
      code: `import { Protocol } from "pmtiles";\n\nconst protocol = new Protocol();\nmaplibregl.addProtocol("pmtiles", protocol.tile);\nmap.addSource("basemap", {\n  type: "vector",\n  url: "pmtiles://https://cdn.example.com/uzbekistan.pmtiles",\n});`,
    },
    {
      heading: { h: "Architecture decision record", p: "Tanlov benchmark va constraint bilan himoya qilinadi." },
      title: "docs/adr-004-vector-delivery.md",
      lang: "md",
      code: `# ADR-004 Vector delivery\n\n## Context\n- 12M public features\n- daily refresh\n- no per-user filtering\n- p95 target: 300 ms\n\n## Decision\nPMTiles on object storage + CDN.\n\n## Rejected\nDynamic MVT: unnecessary database load for read-only public data.\n\n## Revisit when\nRefresh becomes near-real-time or access control becomes per feature.`,
    },
  ],
  tasks: [
    { id: "cn1-1", html: "OGC API - Features collection va items endpointlarini yozdim", crit: "Conformance, OpenAPI, bbox, limit va error contract testlari o'tadi" },
    { id: "cn1-2", html: "CQL2 yoki ekvivalent typed filter qo'shdim", crit: "Allowed fields/operations ro'yxati va injection testlari bor" },
    { id: "cn1-3", html: "Bitta layerni GeoParquet formatga eksport qildim", crit: "CRS metadata, bbox va row count qayta o'qib tekshirilgan" },
    { id: "cn1-4", html: "DuckDB spatial bilan GeoParquet query benchmark qildim", crit: "Data hajmi, warm/cold vaqt va query yozilgan" },
    { id: "cn1-5", html: "Vector tilesetni PMTiles archivega aylantirdim", crit: "pmtiles verify o'tadi, attribution va min/max zoom mavjud" },
    { id: "cn1-6", html: "MapLibre'da PMTiles source ko'rsatdim", crit: "Network panel faqat kerakli range requestlarni ko'rsatadi" },
    { id: "cn1-7", html: "Dynamic MVT va PMTiles uchun performance/cost taqqoslash yozdim", crit: "Update frequency, access-control, p95 va monthly cost assumptionlari bor" },
    { id: "cn1-8", html: "Vector delivery ADR yozdim", crit: "Tanlangan, rad etilgan va qayta ko'rish shartlari aniq" },
  ],
  resources: [
    { type: "doc", url: "https://www.ogc.org/standards/ogcapi-features/", title: "OGC API - Features", desc: "Feature data uchun rasmiy interoperable API standard.", host: "ogc.org" },
    { type: "doc", url: "https://tiles.developer.ogc.org/", title: "OGC API - Tiles", desc: "Tile metadata va retrieval standardi.", host: "ogc.org" },
    { type: "doc", url: "https://www.ogc.org/standards/ogcapi-processes/", title: "OGC API - Processes", desc: "Geoprocessing joblarini REST API orqali berish.", host: "ogc.org" },
    { type: "doc", url: "https://geoparquet.org/releases/v1.1.0/", title: "GeoParquet specification", desc: "Columnar spatial data format va metadata talablari.", host: "geoparquet.org" },
    { type: "doc", url: "https://docs.protomaps.com/pmtiles/", title: "PMTiles concepts", desc: "Single-file tile archive va range requests.", host: "docs.protomaps.com" },
    { type: "doc", url: "https://duckdb.org/docs/stable/core_extensions/spatial/overview.html", title: "DuckDB spatial extension", desc: "Local va object-storage analytics.", host: "duckdb.org" },
  ],
  project: {
    tag: "Architecture / Benchmark",
    title: "Vector Delivery Decision Lab",
    desc: "Bir xil datasetni OGC API, dynamic MVT, GeoParquet va PMTiles orqali berib, aniq use-case uchun arxitektura tanla.",
    features: ["OGC API contract", "dynamic MVT", "GeoParquet", "DuckDB query", "PMTiles", "benchmark", "cost model", "ADR"],
    rubric: [
      "Har variant real ishlaydi yoki rad etish sababi isbotlangan",
      "Benchmark bir xil dataset va sharoitda",
      "Security va update frequency hisobga olingan",
      "Attribution va metadata to'g'ri",
      "ADR trade-offni halol ko'rsatadi",
    ],
  },
  quiz: [
    { q: "Per-user access-control bilan tez-tez yangilanadigan layer uchun qaysi variant odatda mos?", a: ["Public PMTiles archive", "Dynamic API/MVT service", "PNG screenshot", "README"], c: 1, w: "Per-user filter va tez update server-side dynamic queryni talab qiladi.", level: "scenario" },
    { q: "GeoParquetning asosiy roli nima?", a: ["Transactional CRUD", "Columnar analytical spatial storage", "JWT", "CSS style"], c: 1, w: "GeoParquet katta analytical datasetni interoperable columnar formatda saqlaydi.", level: "practical" },
    { q: "PMTiles range request nima beradi?", a: ["Butun archive har safar yuklanadi", "Faqat kerakli tile va metadata qismlari olinadi", "Database yozuvi", "CRS avtomatik tuzatiladi"], c: 1, w: "HTTP range request katta archive ichidan kerakli byte oralig'ini oladi.", level: "easy" },
  ],
  exercises: [
    { type: "choice", q: "Haftada bir yangilanadigan public viloyat layeri uchun sodda va arzon variant?", options: ["Har user uchun PostGIS query", "PMTiles + object storage/CDN", "WebSocket", "Celery result backend"], correct: 1, why: "Read-only public tileset static archive orqali database va serverni talab qilmasligi mumkin." },
  ],
};

const RASTER_CLOUD_MODULE: Module = {
  zoom: "rs1",
  title: "STAC / TiTiler / Raster Cloud",
  sub: "Catalog / range reads / tiles",
  coord: "Modern geospatial / raster",
  eyebrow: "STAC / COG / TITILER / OBJECT STORAGE",
  mtitle: "Raster fayllar to'plamidan qidiriladigan cloud-native platformaga",
  lede:
    "COG yaratish boshlanishi, yakuni emas. Professional raster platforma assetlarni STAC bilan kataloglaydi, object storage'da saqlaydi, range requestni tekshiradi va TiTiler/rio-tiler orqali dinamik tasvir beradi.",
  doc: `
    <h3>O'quv natijalari</h3>
    <p>Sen valid COG hosil qilasan, STAC Item/Collection yozasan, spatial-temporal search qo'shasan, TiTiler orqali tile/preview/statistics olasan va cache, signed URL hamda egress narxini hisobga olasan.</p>
    <div class="chips"><span class="chip t">COG internals</span><span class="chip">HTTP range</span><span class="chip t">STAC Item/Collection</span><span class="chip">STAC API</span><span class="chip">pgSTAC</span><span class="chip t">TiTiler/rio-tiler</span><span class="chip">S3-compatible</span><span class="chip">cache</span></div>
    <h3>Data flow</h3>
    <div class="tree">raw GeoTIFF -> validate -> reproject/overview/compress -> COG -> object storage\n                                           -> STAC metadata -> search API\nCOG URL + style -> TiTiler -> raster tile/preview/statistics -> MapLibre</div>
    <h3>Sifat nazorati</h3>
    <p>CRS, bounds, transform, nodata, dtype, band metadata, overview va compression avtomatik tekshiriladi. COG fayli mavjudligi yetmaydi; server byte-range requestni to'g'ri qo'llashi va cache headerlar kuzatilishi kerak.</p>
    <div class="callout"><div><p>Security</p><p>Private imagery URL'ini frontendga abadiy credential bilan bermaysan. Qisqa muddatli signed URL, service role, audit va metadata redaction siyosati yoziladi.</p></div></div>
  `,
  code: [
    {
      heading: { h: "STAC Item", p: "Asset spatial-temporal metadata bilan qidiriladigan bo'ladi." },
      title: "stac/item.json",
      lang: "json",
      code: `{"type":"Feature","stac_version":"1.1.0","id":"tashkent-2026-07","bbox":[69.1,41.2,69.4,41.4],"geometry":{"type":"Polygon","coordinates":[]},"properties":{"datetime":"2026-07-01T00:00:00Z"},"assets":{"visual":{"href":"s3://imagery/tashkent.tif","type":"image/tiff; application=geotiff; profile=cloud-optimized","roles":["data"]}},"links":[]}`,
    },
    {
      heading: { h: "COG smoke test", p: "Metadata va remote range behavior ikkalasi tekshiriladi." },
      title: "scripts/verify-cog.sh",
      lang: "bash",
      code: `set -euo pipefail\ngdalinfo --config GDAL_DISABLE_READDIR_ON_OPEN EMPTY_DIR \"$COG_URL\"\ncurl -fsSI -H 'Range: bytes=0-16383' \"$COG_URL\" | grep -E '206|Content-Range'`,
    },
    {
      heading: { h: "TiTiler request", p: "Dynamic visualization parametrlari API contract bo'ladi." },
      title: "raster-client.ts",
      lang: "ts",
      code: `const tileUrl = new URL("/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png", apiBase);\ntileUrl.searchParams.set("url", signedCogUrl);\ntileUrl.searchParams.set("bidx", "1");\ntileUrl.searchParams.set("rescale", "0,3000");`,
    },
  ],
  tasks: [
    { id: "rs1-1", html: "Raster uchun deterministic COG build script yozdim", crit: "Compression, block size, overview, CRS va nodata parametrlari version control'da" },
    { id: "rs1-2", html: "COGni local va remote range request bilan tekshirdim", crit: "gdalinfo va HTTP 206/Content-Range dalili saqlangan" },
    { id: "rs1-3", html: "STAC Collection va kamida 3 Item yaratdim", crit: "Schema validation, license, extent, datetime va asset roles to'g'ri" },
    { id: "rs1-4", html: "STAC API yoki pgSTAC bilan bbox/time search yozdim", crit: "Happy, empty, invalid bbox va pagination testlari bor" },
    { id: "rs1-5", html: "TiTiler orqali tile, preview va statistics ko'rsatdim", crit: "MapLibre layer, color scale va nodata transparency ishlaydi" },
    { id: "rs1-6", html: "Private asset uchun signed URL yoki proxy strategiyasini yozdim", crit: "TTL, audit, cache va credential boundary aniq" },
    { id: "rs1-7", html: "Raster p95 va egress/cache benchmark qildim", crit: "Cold/warm p95, bytes transferred va cache-hit rate bor" },
    { id: "rs1-8", html: "Broken COG yoki noto'g'ri metadata incidentini tuzatdim", crit: "Root cause, detection, fix va regression test reportda" },
  ],
  resources: [
    { type: "doc", url: "https://stacspec.org/en", title: "STAC specification", desc: "Spatiotemporal asset katalogi uchun ochiq standard.", host: "stacspec.org" },
    { type: "doc", url: "https://api.stacspec.org/v1.0.0/core/", title: "STAC API specification", desc: "Search va catalog API contracti.", host: "stacspec.org" },
    { type: "doc", url: "https://developmentseed.org/titiler/", title: "TiTiler documentation", desc: "FastAPI va rio-tiler asosidagi dynamic raster service.", host: "developmentseed.org" },
    { type: "doc", url: "https://cogeo.org/", title: "Cloud Optimized GeoTIFF", desc: "COG tuzilishi va ekotizimi.", host: "cogeo.org" },
    { type: "doc", url: "https://gdal.org/en/stable/programs/gdal_translate.html", title: "GDAL translate", desc: "COG build parametrlari va formatlar.", host: "gdal.org" },
  ],
  project: {
    tag: "Raster Platform / Cloud-native",
    title: "Searchable Imagery Service",
    desc: "COG assetlarni STAC orqali qidirib, TiTiler orqali MapLibre'da ko'rsatadigan xavfsiz raster platforma qur.",
    features: ["deterministic COG", "STAC catalog/API", "bbox-time search", "TiTiler", "MapLibre raster UX", "signed access", "cache/egress report", "failure test"],
    rubric: [
      "COG local va remote validatsiyadan o'tadi",
      "STAC metadata qidirish va audit uchun yetarli",
      "Private asset credentiali frontendga chiqmaydi",
      "Nodata/color scale foydalanuvchini chalg'itmaydi",
      "Performance va xarajat o'lchangan",
    ],
  },
  quiz: [
    { q: "STACning asosiy vazifasi nima?", a: ["Raster pixelini o'zgartirish", "Spatiotemporal assetlarni standart metadata bilan kataloglash va qidirish", "JWT yaratish", "Vector tile chizish"], c: 1, w: "STAC assetlarni common metadata va linklar bilan qidiriladigan qiladi.", level: "easy" },
    { q: "COG remote o'qish uchun serverning qaysi xususiyati muhim?", a: ["FTP", "HTTP byte-range request", "WebSocket", "SMTP"], c: 1, w: "COG ichidagi kerakli bloklar HTTP range request bilan olinadi.", level: "practical" },
    { q: "Private imagery uchun abadiy public URL berishning asosiy xavfi nima?", a: ["Tile rangsiz bo'ladi", "Access-control va data exposure buziladi", "CRS 3857 bo'ladi", "SQL sekinlashadi"], c: 1, w: "Private assetga vaqtli va audit qilinadigan kirish kerak.", level: "scenario" },
  ],
  exercises: [
    { type: "choice", q: "Map faqat AOI ichidagi COG bloklarini o'qishi uchun nima kerak?", options: ["Butun TIFF download", "COG internal tiling/overviews va HTTP range support", "CSV export", "JWT ichida raster"], correct: 1, why: "COG layout va range request kerakli bloklarni masofadan o'qishga imkon beradi." },
  ],
};

const GEOAI_FOUNDATION_MODULE: Module = {
  zoom: "ai1",
  title: "GeoAI Foundation Models",
  sub: "Detection / segmentation / leakage",
  coord: "GeoAI / future-ready",
  eyebrow: "GEOAI / FOUNDATION MODELS / VALIDATION",
  mtitle: "YOLO nomidan yuqoriga: halol va geografik barqaror GeoAI",
  lede:
    "Kurs endi bitta detection modeliga bog'lanmaydi. Sen detection, segmentation va geospatial foundation modelni use-case, label hajmi, latency va xato narxi bo'yicha tanlaysan.",
  doc: `
    <h3>Model emas, qaror tizimi</h3>
    <div class="exlist">
      <div class="ex"><b>Detection</b><span>Obyekt bbox kerak bo'lsa. Small-object tiling, overlap va NMS xatolari alohida tekshiriladi.</span></div>
      <div class="ex"><b>Segmentation</b><span>Maydon, bino izi, suv yoki yo'l maskasi kerak bo'lsa IoU/Dice va boundary sifati o'lchanadi.</span></div>
      <div class="ex"><b>Foundation embeddings</b><span>Label kam bo'lganda pretrained geospatial representation ustida klassifikatsiya yoki retrieval quriladi.</span></div>
    </div>
    <h3>Geographic leakage</h3>
    <p>Yonma-yon tile'larni random train/testga bo'lish modelga deyarli bir xil hududni ko'rsatishi mumkin. Split AOI, vaqt, sensor yoki region bo'yicha group qilinadi. Test hududi train hududidan fazoviy mustaqil bo'lishi kerak.</p>
    <h3>Evaluation contract</h3>
    <div class="tree">dataset card -> spatial split -> baseline -> per-region metrics -> threshold cost -> human review -> model card -> monitor drift</div>
    <p>Global mAP yagona javob emas. Precision/recall, IoU, per-class va per-region natija, calibration, latency, empty rate va operator workload birga ko'riladi.</p>
    <div class="callout"><div><p>Safety va halollik</p><p>Model noaniqligini yashirma. Inson hayoti, infratuzilma yoki huquqiy qarorga ta'sir qiladigan use-case'da human review, audit trail va abstain/unknown holati majburiy.</p></div></div>
  `,
  code: [
    {
      heading: { h: "Spatial group split", p: "Bir AOI tile'lari train va testga aralashmaydi." },
      title: "spatial_split.py",
      lang: "py",
      code: `from sklearn.model_selection import GroupShuffleSplit\n\nsplitter = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)\ntrain_idx, test_idx = next(splitter.split(samples, groups=samples["aoi_id"]))\ntrain = samples.iloc[train_idx]\ntest = samples.iloc[test_idx]\nassert set(train.aoi_id).isdisjoint(set(test.aoi_id))`,
    },
    {
      heading: { h: "Pixel detectionni georeference qilish", p: "Affine transform va tile offset birga hisoblanadi." },
      title: "detections_to_geojson.py",
      lang: "py",
      code: `from rasterio.transform import xy\n\ndef pixel_box_to_ring(transform, row0, col0, row1, col1):\n    left, top = xy(transform, row0, col0, offset="ul")\n    right, bottom = xy(transform, row1, col1, offset="lr")\n    return [[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]`,
    },
    {
      heading: { h: "Threshold qarori", p: "Metric biznes xato narxi bilan bog'lanadi." },
      title: "threshold-report.md",
      lang: "md",
      code: `| threshold | precision | recall | misses/100 | reviews/100 |\n| ---: | ---: | ---: | ---: | ---: |\n| 0.25 | 0.61 | 0.93 | 7 | 152 |\n| 0.50 | 0.82 | 0.78 | 22 | 95 |\n\nDecision: 0.25 + mandatory operator review, because a miss costs more than an extra review.`,
    },
  ],
  tasks: [
    { id: "ai1-1", html: "Use-case uchun detection, segmentation yoki embedding yondashuvini tanladim", crit: "Output turi, label hajmi, latency va xato narxi bilan ADR yozilgan" },
    { id: "ai1-2", html: "Dataset card va label QA report tayyorladim", crit: "Source, license, sensor, GSD, class distribution va known bias mavjud" },
    { id: "ai1-3", html: "Random emas, spatial/temporal group split qildim", crit: "Train/test AOI overlap testi va xarita dalili bor" },
    { id: "ai1-4", html: "Baseline va kamida bitta pretrained/foundation yondashuvni taqqosladim", crit: "Bir xil test set, compute budget va metriclar ishlatilgan" },
    { id: "ai1-5", html: "Per-region/per-class metric va error gallery yaratdim", crit: "Global metric yashirgan kamida bitta muammo topilgan" },
    { id: "ai1-6", html: "Thresholdni operator workload va xato narxi bilan tanladim", crit: "Decision table, abstain holati va review siyosati mavjud" },
    { id: "ai1-7", html: "Inference outputni georeference qilib MapLibre'da ko'rsatdim", crit: "Pixel/tile offset va CRS regression testi o'tadi" },
    { id: "ai1-8", html: "Model card va monitoring triggerlarini yozdim", crit: "Limitation, drift signal, rollback va retrain condition bor" },
  ],
  resources: [
    { type: "doc", url: "https://deepmind.google/blog/alphaearth-foundations-helps-map-our-planet-in-unprecedented-detail/", title: "AlphaEarth Foundations", desc: "Multi-source geospatial embeddings va mapping use-caselari.", host: "deepmind.google" },
    { type: "doc", url: "https://research.ibm.com/blog/prithvi2-geospatial", title: "IBM/NASA Prithvi-EO 2.0", desc: "Open geospatial foundation model va Earth observation vazifalari.", host: "research.ibm.com" },
    { type: "doc", url: "https://docs.ogc.org/is/23-024r3/23-024r3.html", title: "OGC Training Data Markup Language for AI", desc: "Geospatial ML training data metadata standardi.", host: "docs.ogc.org" },
    { type: "doc", url: "https://docs.ultralytics.com/guides/model-evaluation-insights/", title: "Model evaluation insights", desc: "Detection metriclari va error analysis.", host: "docs.ultralytics.com" },
    { type: "doc", url: "https://scikit-learn.org/stable/modules/cross_validation.html", title: "Cross-validation strategies", desc: "Group split va leakage nazorati.", host: "scikit-learn.org" },
  ],
  project: {
    tag: "GeoAI / Independent Evaluation",
    title: "Geographically Robust Detection or Segmentation Study",
    desc: "Bir use-case uchun modelni spatially independent test setda baholab, human review va production threshold bilan yakunla.",
    features: ["dataset card", "spatial split", "baseline comparison", "per-region metrics", "error gallery", "threshold cost", "georeferenced layer", "model card"],
    rubric: [
      "Train/test geografik overlap yo'q",
      "Metriclar use-case va xato narxiga bog'langan",
      "Model limitationlari yashirilmagan",
      "Georeference regression test bilan yopilgan",
      "Human review va monitoring ishlaydigan flowga ega",
    ],
  },
  quiz: [
    { q: "Yonma-yon raster tile'larni random split qilishning xavfi nima?", a: ["GPU soviydi", "Spatial leakage sabab test natijasi sun'iy yuqori chiqishi mumkin", "CRS o'zgaradi", "Docker image kattalashadi"], c: 1, w: "Qo'shni tile'lar bir hududning o'xshash signalini train va testga olib kiradi.", level: "scenario" },
    { q: "Segmentation uchun qaysi metric ko'proq mos?", a: ["IoU/Dice", "HTTP 200", "Bundle size", "SQL rows"], c: 0, w: "IoU/Dice prediction mask va ground-truth overlapini o'lchaydi.", level: "practical" },
    { q: "Foundation modeldan foydalanish nimani bekor qilmaydi?", a: ["Dataset va domain validationni", "Pretrained weightni", "Inference kodini", "GPU driverini"], c: 0, w: "Pretraining bo'lsa ham lokal sensor, geografiya va use-case bo'yicha mustaqil baholash zarur.", level: "scenario" },
  ],
  exercises: [
    { type: "choice", q: "Missed detection juda qimmat, false positive esa operator ko'rib chiqishi mumkin. Threshold strategiyasi?", options: ["Faqat precisionni maksimal qilish", "Recallni ustun qo'yib, human review workloadini o'lchash", "Metricni yashirish", "Random threshold"], correct: 1, why: "Threshold xato narxi va operator quvvatiga bog'lanadi." },
  ],
};

const PRODUCTION_DECISIONS_MODULE: Module = {
  zoom: "ops1",
  title: "Production Engineering Decisions",
  sub: "IaC / traces / cost / threat model",
  coord: "Production / architecture evidence",
  eyebrow: "PRODUCTION / IAC / OTEL / COST",
  mtitle: "Deploy borligidan boshqariladigan production tizimiga",
  lede:
    "Bu modul Kubernetes nomini sanashni emas, deploy variantini asoslash, infratuzilmani kod bilan tiklash, requestni trace qilish, xarajatni cheklash va threat model orqali xavfni kamaytirishni talab qiladi.",
  doc: `
    <h3>Deployment ladder</h3>
    <div class="exlist">
      <div class="ex"><b>VPS + Compose</b><span>Kichik trafik va kam servis uchun arzon, tushunarli va boshqariladigan boshlanish.</span></div>
      <div class="ex"><b>Managed containers</b><span>ECS/Fargate yoki o'xshash servis operatsion yukni kamaytiradi.</span></div>
      <div class="ex"><b>Kubernetes</b><span>Ko'p servis, autoscale va platforma talabi bo'lsa foydali; kichik loyiha uchun avtomatik ravishda eng yaxshi emas.</span></div>
    </div>
    <h3>To'liq kuzatuv</h3>
    <p>Metric "nima bo'lyapti", log "qanday event", trace esa request qayerda vaqt yo'qotganini ko'rsatadi. Frontend request-id API, PostGIS, queue va worker bo'ylab saqlanadi.</p>
    <h3>Threat boundary</h3>
    <div class="tree">Internet -> Nginx/WAF -> API -> PostGIS\n                         -> Queue -> Worker -> Object storage\nTrust boundaries: user input, upload, admin action, signed asset, CI secret</div>
    <div class="callout"><div><p>Cost guardrail</p><p>EKSni portfolio uchun majburiy qilma. Avval workload va SLO yoz, keyin eng sodda yetarli platformani tanla. Budget alert, egress va storage lifecycle ham acceptance criteria bo'ladi.</p></div></div>
  `,
  code: [
    {
      heading: { h: "Infrastructure as code", p: "Misol object storage guardrail bilan." },
      title: "infra/main.tf",
      lang: "hcl",
      code: `resource "aws_s3_bucket" "imagery" {\n  bucket = var.imagery_bucket\n}\n\nresource "aws_s3_bucket_versioning" "imagery" {\n  bucket = aws_s3_bucket.imagery.id\n  versioning_configuration { status = "Enabled" }\n}`,
    },
    {
      heading: { h: "Trace propagation", p: "FastAPI request va downstream call bir tracega ulanadi." },
      title: "observability.py",
      lang: "py",
      code: `from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor\nfrom opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor\n\nFastAPIInstrumentor.instrument_app(app)\nSQLAlchemyInstrumentor().instrument(engine=engine.sync_engine)`,
    },
    {
      heading: { h: "SLO va alert", p: "Har alert aniq user impactga bog'lanadi." },
      title: "docs/slo.md",
      lang: "md",
      code: `# API SLO\n- Availability: 99.5% / 30 days\n- BBox p95: < 400 ms\n- Tile error rate: < 1%\n- Processing completion: 95% within 10 minutes\n\nPage when error-budget burn predicts SLO exhaustion in 24 hours.`,
    },
  ],
  tasks: [
    { id: "ops1-1", html: "VPS, managed container va Kubernetes variantlarini ADRda taqqosladim", crit: "Traffic, team size, SLO, cost va operational burden mavjud" },
    { id: "ops1-2", html: "Tanlangan infratuzilmani Terraform/OpenTofu bilan yozdim", crit: "Fresh environment plan/apply va destroy hujjati bor; secret state'da ochiq emas" },
    { id: "ops1-3", html: "OpenTelemetry trace'ni API -> DB -> worker oqimida ko'rsatdim", crit: "Bitta trace screenshotida spanlar va latency ko'rinadi" },
    { id: "ops1-4", html: "SLO va error-budget alert yozdim", crit: "Alert user impact, threshold va runbookga bog'langan" },
    { id: "ops1-5", html: "Threat model va abuse case tuzdim", crit: "Upload, RBAC, signed URL, queue va CI secret boundarylari bor" },
    { id: "ops1-6", html: "Monthly cost model va budget alert qo'shdim", crit: "Compute, DB, storage, egress va idle cost assumptionlari mavjud" },
    { id: "ops1-7", html: "Failure injection drill bajardim", crit: "DB unavailable yoki worker crash uchun detection, user behavior va recovery dalili bor" },
  ],
  resources: [
    { type: "doc", url: "https://opentelemetry.io/docs/", title: "OpenTelemetry documentation", desc: "Trace, metric va log telemetry standardi.", host: "opentelemetry.io" },
    { type: "doc", url: "https://opentofu.org/docs/", title: "OpenTofu documentation", desc: "Open-source infrastructure as code.", host: "opentofu.org" },
    { type: "doc", url: "https://developer.hashicorp.com/terraform/docs", title: "Terraform documentation", desc: "Infrastructure as code workflow.", host: "developer.hashicorp.com" },
    { type: "doc", url: "https://owasp.org/www-project-api-security/", title: "OWASP API Security", desc: "API threat va abuse case checklist.", host: "owasp.org" },
    { type: "doc", url: "https://sre.google/sre-book/service-level-objectives/", title: "Google SRE: Service Level Objectives", desc: "SLO va error budget asoslari.", host: "sre.google" },
  ],
  project: {
    tag: "Production / Architecture Review",
    title: "GeoPulse Production Decision Pack",
    desc: "GeoPulse uchun eng sodda yetarli deploy platformasi, IaC, tracing, SLO, threat model va cost guardrail tayyorla.",
    features: ["deployment ADR", "IaC", "OpenTelemetry trace", "SLO/error budget", "threat model", "cost model", "failure drill"],
    rubric: [
      "Platforma hype emas, requirement bilan tanlangan",
      "Infratuzilma takrorlanuvchi va secret-safe",
      "Trace real bottleneckni ko'rsatadi",
      "Threat model mitigation va testga ulangan",
      "Cost va failure drill dalil bilan yopilgan",
    ],
  },
  quiz: [
    { q: "Kichik portfolio loyihasi uchun EKS qachon noto'g'ri tanlov bo'lishi mumkin?", a: ["Har doim", "Operational murakkablik va cost talabdan katta bo'lsa", "PostGIS ishlatsa", "React bo'lsa"], c: 1, w: "Platforma workload va jamoa ehtiyojidan kelib chiqib tanlanadi.", level: "scenario" },
    { q: "Distributed trace nimani ko'rsatadi?", a: ["Faqat CSS", "Requestning servis va dependencylar bo'ylab vaqt yo'lini", "Faqat disk hajmi", "CV holati"], c: 1, w: "Trace request spanlarini bog'lab bottleneckni aniqlaydi.", level: "practical" },
    { q: "Error budgetning vazifasi nima?", a: ["Cheksiz xatoga ruxsat", "Reliability maqsadi va release tezligi orasida boshqariladigan qaror", "Database paroli", "Tile ranglari"], c: 1, w: "Error budget SLOdan kelib chiqib reliability va change riskni muvozanatlaydi.", level: "scenario" },
  ],
  exercises: [
    { type: "choice", q: "2 servis, 200 user va kichik jamoa uchun birinchi production variant?", options: ["Majburiy multi-region EKS", "VPS/managed containerni SLO va cost bilan baholash", "Serverni hujjatsiz qo'yish", "Faqat localhost"], correct: 1, why: "Eng sodda yetarli platforma avval requirement bilan baholanadi." },
  ],
};

const DIGITAL_TWIN_MODULE: Module = {
  zoom: "d3",
  title: "3D Tiles & Digital Twins",
  sub: "Accuracy / point cloud / viewer",
  coord: "3D / digital twin",
  eyebrow: "3D / PHOTOGRAMMETRY / DIGITAL TWIN",
  mtitle: "Chiroyli 3D sahnadan o'lchanadigan geospatial digital twinga",
  lede:
    "3D reconstruction faqat mesh hosil qilish emas. Kamera va ground control sifati, point-cloud klassifikatsiyasi, coordinate frame, level of detail va 3D delivery birga tekshiriladi.",
  doc: `
    <h3>O'quv natijalari</h3>
    <p>Sen GSD, overlap, GCP/RTK va RMSE tushunchalarini amalda ishlatasan; OpenDroneMap outputini PDAL bilan tekshirasan; point cloud/meshni tiled formatga tayyorlaysan; CesiumJS yoki mos viewerda spatial reference bilan ko'rsatasan.</p>
    <div class="chips"><span class="chip t">SfM/MVS</span><span class="chip">GSD/overlap</span><span class="chip t">GCP/RTK</span><span class="chip">RMSE</span><span class="chip">LAS/LAZ</span><span class="chip t">PDAL</span><span class="chip">3D Tiles</span><span class="chip">CesiumJS</span><span class="chip">LOD</span></div>
    <h3>Quality chain</h3>
    <div class="tree">flight/source QA -> camera alignment -> sparse/dense cloud -> GCP check -> classify -> DSM/DTM/mesh -> tile/LOD -> viewer -> field validation</div>
    <p>Absolute accuracy va relative visual quality boshqa narsalar. Chiroyli mesh noto'g'ri koordinatada bo'lishi mumkin. Checkpointlar train/control sifatida emas, mustaqil validation sifatida saqlanadi.</p>
    <div class="callout"><div><p>Digital twin talabi</p><p>Digital twin real tizim bilan bog'lanishi, vaqt bo'yicha yangilanishi va provenancega ega bo'lishi kerak. Bir martalik 3D modelni avtomatik ravishda digital twin deb atama.</p></div></div>
  `,
  code: [
    {
      heading: { h: "PDAL quality pipeline", p: "Noise va ground classification bosqichlari version control'da." },
      title: "pdal/pipeline.json",
      lang: "json",
      code: `{"pipeline":["input.laz",{"type":"filters.outlier","method":"statistical","mean_k":12,"multiplier":2.2},{"type":"filters.smrf","scalar":1.2,"slope":0.2,"threshold":0.45,"window":16.0},{"type":"writers.las","filename":"classified.laz","compression":"laszip"}]}`,
    },
    {
      heading: { h: "Accuracy report", p: "Mustaqil checkpoint residuallari saqlanadi." },
      title: "reports/3d-accuracy.md",
      lang: "md",
      code: `| checkpoint | horizontal error m | vertical error m |\n| --- | ---: | ---: |\n| CP-01 | 0.07 | 0.11 |\n| CP-02 | 0.09 | 0.14 |\n\nHorizontal RMSE: 0.081 m\nVertical RMSE: 0.126 m\nAcceptance: H <= 0.15 m, V <= 0.20 m`,
    },
    {
      heading: { h: "3D viewer layer", p: "3D asset metadata va attribution bilan qo'shiladi." },
      title: "viewer.ts",
      lang: "ts",
      code: `const tileset = await Cesium.Cesium3DTileset.fromUrl(tilesetUrl);\nviewer.scene.primitives.add(tileset);\nawait viewer.zoomTo(tileset);\nconsole.info({ asset: "site-2026-07", crs: "EPSG:4978", source: "ODM" });`,
    },
  ],
  tasks: [
    { id: "d3-1", html: "Image/flight quality manifest yozdim", crit: "Camera, GSD, overlap, blur, timestamp va coordinate source mavjud" },
    { id: "d3-2", html: "OpenDroneMap yoki COLMAP reconstructionni takrorlanuvchi config bilan ishlatdim", crit: "Command/config, compute va processing duration reportda" },
    { id: "d3-3", html: "GCP va mustaqil checkpoint bilan accuracy baholadim", crit: "Horizontal/vertical RMSE acceptance threshold bilan solishtirilgan" },
    { id: "d3-4", html: "PDAL bilan point-cloud QA va classification qildim", crit: "Point count/class distribution oldin-keyin ko'rsatilgan" },
    { id: "d3-5", html: "DSM, DTM, orthophoto va mesh farqini artefakt bilan ko'rsatdim", crit: "Har outputning use-case va limitationi yozilgan" },
    { id: "d3-6", html: "3D assetni tiled/LOD formatda viewerga berdim", crit: "Initial load, memory va frame-rate budget o'lchangan" },
    { id: "d3-7", html: "3D asset provenance va update siyosatini yozdim", crit: "Source, CRS, date, version, license va next survey trigger mavjud" },
  ],
  resources: [
    { type: "doc", url: "https://docs.opendronemap.org/", title: "OpenDroneMap documentation", desc: "Photogrammetry va reconstruction pipeline.", host: "docs.opendronemap.org" },
    { type: "doc", url: "https://pdal.io/en/stable/", title: "PDAL documentation", desc: "Point-cloud processing va pipeline.", host: "pdal.io" },
    { type: "doc", url: "https://github.com/CesiumGS/3d-tiles", title: "3D Tiles specification", desc: "Massive heterogeneous 3D geospatial content delivery.", host: "github.com" },
    { type: "doc", url: "https://cesium.com/learn/cesiumjs-learn/", title: "CesiumJS learning center", desc: "3D geospatial viewer va tileset ishlatish.", host: "cesium.com" },
    { type: "doc", url: "https://www.ogc.org/standards/3dtiles/", title: "OGC 3D Tiles", desc: "3D Tiles rasmiy standard sahifasi.", host: "ogc.org" },
  ],
  project: {
    tag: "3D / Accuracy / Delivery",
    title: "Measured Site Twin",
    desc: "Kichik real yoki ochiq drone datasetdan accuracy reportli 3D site model yaratib, tiled viewerda provenance bilan ko'rsat.",
    features: ["source manifest", "reconstruction config", "GCP/checkpoint RMSE", "PDAL QA", "DSM/DTM/mesh", "3D Tiles viewer", "performance budget", "provenance"],
    rubric: [
      "3D modelning absolute accuracy si mustaqil tekshirilgan",
      "Pipeline qayta ishga tushiriladi",
      "Point-cloud va raster outputlar farqi tushuntirilgan",
      "Viewer katta assetni LOD bilan boshqaradi",
      "Digital twin atamasi update/provenance bilan asoslangan",
    ],
  },
  quiz: [
    { q: "GCP va independent checkpointning farqi nima?", a: ["Farqi yo'q", "GCP modelni bog'laydi, checkpoint esa mustaqil aniqlikni tekshiradi", "Checkpoint faqat rang beradi", "GCP tile yaratadi"], c: 1, w: "Validation checkpoint reconstruction nazoratidan mustaqil saqlanadi.", level: "practical" },
    { q: "Chiroyli mesh nimani kafolatlamaydi?", a: ["Absolute spatial accuracyni", "Triangle mavjudligini", "Rang borligini", "Browser ochilishini"], c: 0, w: "Visual sifat va geodezik aniqlik alohida tekshiriladi.", level: "scenario" },
    { q: "LOD nima uchun kerak?", a: ["Parol saqlash", "Masofa va qurilma quvvatiga qarab kerakli 3D detalni yuklash", "CRSni yashirish", "SQL migration"], c: 1, w: "LOD katta 3D assetni bosqichma-bosqich render qilishga yordam beradi.", level: "easy" },
  ],
  exercises: [
    { type: "choice", q: "Model yaxshi ko'rinadi, lekin checkpoint RMSE talabdan katta. Hukm?", options: ["Productionga chiqarish", "Accuracy muammosini tuzatish yoki limitation bilan rad etish", "Checkpointni o'chirish", "Rangni almashtirish"], correct: 1, why: "Visual ko'rinish acceptance accuracy o'rnini bosmaydi." },
  ],
};

const FIELD_OFFLINE_MODULE: Module = {
  zoom: "f1",
  title: "Field Offline Reliability",
  sub: "Region packs / sync / privacy",
  coord: "Field engineering / offline",
  eyebrow: "OFFLINE / SYNC / FIELD UX",
  mtitle: "Internet yo'q, qurilma kuchsiz va data ziddiyatli bo'lganda ham ishlaydigan xarita",
  lede:
    "Offline-first PWA faqat service worker cache emas. Region pack, local database, sync state machine, conflict policy, idempotency, GPS permission, battery va location privacy birga loyihalanadi.",
  doc: `
    <h3>Field constraints</h3>
    <div class="chips"><span class="chip t">no network</span><span class="chip">slow device</span><span class="chip">limited storage</span><span class="chip t">GPS uncertainty</span><span class="chip">battery</span><span class="chip">shared device</span><span class="chip t">sensitive location</span></div>
    <h3>Offline architecture</h3>
    <div class="tree">region manifest -> PMTiles/COG/data download -> checksum -> IndexedDB\nfield edits -> local outbox -> sync token -> idempotent API -> conflict policy -> audit</div>
    <p>Basemap, operational layer va user edit bir xil cache siyosatiga ega emas. Versioned region pack yangilanadi, local edit esa outboxda server ACK olguncha saqlanadi.</p>
    <h3>Conflict policy</h3>
    <p>Last-write-wins default javob emas. Field status, geometry va admin correction uchun alohida qoida bo'lishi mumkin. Har conflict foydalanuvchiga tushunarli ko'rsatiladi va auditga yoziladi.</p>
    <div class="callout"><div><p>Privacy</p><p>Precise location minimum muddat saqlanadi, qurilmada encryption va logout wipe siyosati bo'ladi. Demo datasetda haqiqiy xavfli yoki shaxsiy koordinata ishlatma.</p></div></div>
  `,
  code: [
    {
      heading: { h: "Outbox record", p: "Har mutation idempotency key va base version bilan saqlanadi." },
      title: "offline-types.ts",
      lang: "ts",
      code: `type PendingMutation = {\n  id: string;\n  entityId: string;\n  baseVersion: number;\n  operation: "create" | "update" | "delete";\n  payload: unknown;\n  createdAt: string;\n  attempts: number;\n};`,
    },
    {
      heading: { h: "Idempotent sync endpoint", p: "Retry duplicate entity yaratmaydi." },
      title: "sync.py",
      lang: "py",
      code: `@router.post("/sync/mutations")\nasync def apply_mutation(item: Mutation, idempotency_key: str = Header()):\n    previous = await repo.find_result(idempotency_key)\n    if previous:\n        return previous\n    result = await service.apply(item)\n    await repo.save_result(idempotency_key, result)\n    return result`,
    },
    {
      heading: { h: "Region manifest", p: "Download completeness va version tekshiriladi." },
      title: "region-manifest.json",
      lang: "json",
      code: `{"region":"tashkent-demo","version":"2026-07-01","expiresAt":"2026-08-01T00:00:00Z","assets":[{"path":"basemap.pmtiles","bytes":18392044,"sha256":"..."},{"path":"assets.json","bytes":98211,"sha256":"..."}]}`,
    },
  ],
  tasks: [
    { id: "f1-1", html: "Versioned offline region manifest va downloader yozdim", crit: "Size, checksum, storage quota va partial download recovery testlangan" },
    { id: "f1-2", html: "Basemap/data/edit uchun alohida cache siyosati yozdim", crit: "Expiry, eviction va stale UI behavior aniq" },
    { id: "f1-3", html: "IndexedDB outbox va sync state machine yozdim", crit: "queued/sending/conflict/done/failed holatlari UI'da ko'rinadi" },
    { id: "f1-4", html: "Sync API'ni idempotent qildim", crit: "Bir mutation 3 marta yuborilganda bitta natija va bitta audit action hosil bo'ladi" },
    { id: "f1-5", html: "Version conflict siyosati va operator UI yozdim", crit: "Geometry/status conflictlari uchun merge, reject yoki manual review qarori mavjud" },
    { id: "f1-6", html: "GPS accuracy va permission failure holatlarini ko'rsatdim", crit: "Accuracy radiusi, denied/unavailable va manual location fallback ishlaydi" },
    { id: "f1-7", html: "Low-end device va airplane-mode test matritsasini bajardim", crit: "Cold start, pan FPS, storage, battery proxy va sync recovery natijalari bor" },
    { id: "f1-8", html: "Location privacy va device-loss runbook yozdim", crit: "Retention, encryption, logout wipe va revoke flow testlangan" },
  ],
  resources: [
    { type: "doc", url: "https://web.dev/learn/pwa/offline-data", title: "web.dev offline data", desc: "PWA offline storage va data strategiyasi.", host: "web.dev" },
    { type: "doc", url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API", title: "IndexedDB API", desc: "Browser local structured data store.", host: "developer.mozilla.org" },
    { type: "doc", url: "https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API", title: "Geolocation API", desc: "Permission, accuracy va location acquisition.", host: "developer.mozilla.org" },
    { type: "doc", url: "https://docs.protomaps.com/pmtiles/", title: "PMTiles", desc: "Offline yoki static region tile archive konsepti.", host: "docs.protomaps.com" },
    { type: "doc", url: "https://owasp.org/www-project-mobile-top-10/", title: "OWASP Mobile Top 10", desc: "Field qurilma va local data xavflari.", host: "owasp.org" },
  ],
  project: {
    tag: "Field / Offline / Reliability",
    title: "Offline Inspection Region",
    desc: "Region pack yuklaydigan, field editlarni offline saqlaydigan va network qaytganda conflict-safe sync qiladigan map workflow qur.",
    features: ["region manifest", "offline tiles/data", "IndexedDB outbox", "idempotent sync", "conflict UI", "GPS accuracy", "low-end test", "privacy runbook"],
    rubric: [
      "Airplane mode'da asosiy field flow ishlaydi",
      "Partial download va storage shortage boshqarilgan",
      "Retry duplicate data yaratmaydi",
      "Conflict yashirilmaydi va audit qilinadi",
      "Sensitive location retention va device loss rejasi mavjud",
    ],
  },
  quiz: [
    { q: "Offline editni faqat cachega yozish nega yetarli emas?", a: ["Rang o'zgaradi", "Durable outbox, ACK va retry state bo'lmasa edit yo'qolishi yoki takrorlanishi mumkin", "PostGIS o'chadi", "MapLibre taqiqlaydi"], c: 1, w: "Mutation server tomonidan qabul qilinmaguncha durable state va idempotency bilan saqlanadi.", level: "scenario" },
    { q: "Last-write-wins qachon xavfli?", a: ["Har doim xavfsiz", "Muhim geometry/status o'zgarishini jim bosib yuborsa", "Tile static bo'lsa", "CSSda"], c: 1, w: "Muhim conflict manual review yoki domain-specific merge talab qilishi mumkin.", level: "scenario" },
    { q: "GPS accuracy radiusi nimani bildiradi?", a: ["Taxminiy joylashuv noaniqligini", "Database hajmini", "Tile zoomni", "API tokenni"], c: 0, w: "Field operator nuqta aniqligini radius bilan ko'rishi kerak.", level: "easy" },
  ],
  exercises: [
    { type: "choice", q: "Sync request timeout bo'ldi, server qabul qilgan-qilmagani noma'lum. Eng muhim himoya?", options: ["Yangi entity id har retryda", "Idempotency key va natija lookup", "Cache clear", "GPSni o'chirish"], correct: 1, why: "Bir xil idempotency key retryni xavfsiz va aniqlanadigan qiladi." },
  ],
};

export const WEBGIS_MODERN_MODULES_AFTER: Record<string, Module[]> = {
  z8: [CLOUD_NATIVE_VECTOR_MODULE],
  z15: [RASTER_CLOUD_MODULE],
  z18: [GEOAI_FOUNDATION_MODULE],
  z25: [PRODUCTION_DECISIONS_MODULE],
  z29: [DIGITAL_TWIN_MODULE],
  z30: [FIELD_OFFLINE_MODULE],
};
