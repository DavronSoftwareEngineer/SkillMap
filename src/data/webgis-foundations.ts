import type { Module } from "../types";

const DIAGNOSTIC_MODULE: Module = {
  zoom: "g0",
  title: "Diagnostika & O'quv shartnomasi",
  sub: "Boshlang'ich daraja va dalil",
  coord: "Foundation / diagnostika",
  eyebrow: "FOUNDATION / DIAGNOSTIC / EVIDENCE",
  mtitle: "Kursni taxmin bilan emas, aniq boshlang'ich daraja bilan boshlash",
  lede:
    "Bu bosqich sening GIS, JavaScript/TypeScript, Python, SQL va production bo'yicha real holatingni o'lchaydi. Natijada keraksiz mavzuni takrorlamaysan va bo'shliqni yashirmaysan.",
  doc: `
    <h3>Kim uchun va qanday natija uchun?</h3>
    <p>Kursning maqsadli roli: <strong>Geospatial Full-Stack Engineer</strong>. Yakunda o'quvchi React/MapLibre interfeysini, FastAPI/PostGIS API'ni, geoprocessing pipeline'ni va production infratuzilmani bitta ishlaydigan mahsulotga bog'laydi. Kurs senior unvonini va'da qilmaydi; seniorlik real ownership va production tajribasi bilan keladi.</p>
    <h3>Ikki kirish yo'li</h3>
    <div class="exlist">
      <div class="ex"><b>Developer track</b><span>JS/TS biladi, lekin Python va GIS fundamentali yangi. Python bridge va spatial fundamentals majburiy.</span></div>
      <div class="ex"><b>GIS track</b><span>QGIS/ArcGIS biladi, lekin software engineering yangi. Frontend, Git, testing va API foundation majburiy.</span></div>
    </div>
    <h3>Dalil qoidasi</h3>
    <p>"Tushundim" dalil emas. Har muhim kompetensiya repository commit, test natijasi, screenshot, benchmark, ADR yoki qisqa demo bilan yopiladi. AI kod yozishda ishlatilishi mumkin, lekin AI-use log va mustaqil izoh majburiy.</p>
    <div class="tree">Baseline -> shaxsiy yo'l -> mini-lablar -> milestone review -> GeoPulse -> tashqi himoya</div>
    <div class="callout"><div><p>Vaqt bo'yicha halol baho</p><p>Butun yo'l 3 oylik kurs emas. 3 oy faqat flagship capstone uchun. Tajribali JS/TS yoki GIS mutaxassisi uchun yo'l odatda 8-12 oy part-time, mutlaqo yangi boshlovchi uchun uzoqroq bo'ladi.</p></div></div>
  `,
  code: [
    {
      heading: { h: "Boshlang'ich kompetensiya matritsasi", p: "Har bandga 0-3 ball va dalil havolasi beriladi." },
      title: "docs/baseline.md",
      lang: "md",
      code: `# Baseline\n\n| Kompetensiya | Ball 0-3 | Dalil | Keyingi qadam |\n| --- | ---: | --- | --- |\n| React + TypeScript |  |  |  |\n| Python |  |  |  |\n| SQL + PostGIS |  |  |  |\n| CRS va geometriya |  |  |  |\n| Docker + Linux |  |  |  |\n| Test va CI |  |  |  |\n\n0 = bilmayman, 1 = yordam bilan, 2 = mustaqil, 3 = boshqalarga tushuntiraman`,
    },
    {
      heading: { h: "AI yordamidan shaffof foydalanish", p: "Promptni emas, tekshirish va ownershipni qayd qil." },
      title: "docs/ai-use.md",
      lang: "md",
      code: `## AI-use entry\n- Sana va vazifa:\n- AI bergan taklif:\n- Men o'zgartirgan qism:\n- Qanday test qildim:\n- Qaysi xatoni topdim:\n- Kodni mustaqil tushuntira olamanmi: ha/yo'q`,
    },
  ],
  tasks: [
    { id: "g0-1", html: "React/TS, Python, SQL, GIS va DevOps bo'yicha baseline matritsa to'ldirdim", crit: "Har bandda 0-3 ball va tekshiriladigan dalil yoki 'dalil yo'q' yozuvi bor" },
    { id: "g0-2", html: "Developer track yoki GIS track tanladim", crit: "Tanlov 3 ta kuchli va 3 ta zaif kompetensiya bilan asoslangan" },
    { id: "g0-3", html: "Git repository va evidence papkasini tayyorladim", crit: "docs/, reports/ va screenshots/ papkalari README'da izohlangan" },
    { id: "g0-4", html: "AI-use log shablonini qo'shdim", crit: "Birinchi yozuvda AI taklifi, mustaqil o'zgarish va test ko'rsatilgan" },
    { id: "g0-5", html: "Haftalik real o'quv reja va review sanalarini belgiladim", crit: "Kamida 8 hafta, buffer va qayta topshirish vaqti mavjud" },
  ],
  resources: [
    { type: "doc", url: "https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories", title: "GitHub repository quickstart", desc: "Dalil va portfolio repositorysini tartibli boshlash uchun.", host: "docs.github.com" },
    { type: "doc", url: "https://www.python.org/about/gettingstarted/", title: "Python getting started", desc: "Python muhiti va rasmiy boshlang'ich yo'l.", host: "python.org" },
    { type: "doc", url: "https://www.ogc.org/standards/", title: "OGC standards catalog", desc: "Geospatial professional standartlar xaritasi.", host: "ogc.org" },
  ],
  project: {
    tag: "Diagnostic / Evidence",
    title: "Personal Geospatial Competency Baseline",
    desc: "Kurs boshidagi real daraja, tanlangan yo'l va isbotlash tartibini hujjatlashtir.",
    features: ["kompetensiya matritsasi", "evidence papkasi", "AI-use log", "haftalik reja", "review checkpointlar"],
    rubric: [
      "Ballar dalil bilan asoslangan",
      "Zaif joylar yashirilmagan",
      "Yo'l foydalanuvchining tajribasiga mos",
      "AI ishlatish qoidasi aniq",
      "Reja vaqt va qayta topshirishni hisobga oladi",
    ],
  },
  quiz: [
    { q: "Kursdagi professional kompetensiyaning eng kuchli dalili qaysi?", a: ["Checkbox", "Ishlaydigan artefakt va himoya", "Texnologiya nomi", "Ko'p video ko'rish"], c: 1, w: "Ishlaydigan artefakt, test va mustaqil himoya real kompetensiyani ko'rsatadi.", level: "scenario" },
    { q: "AI yozgan kodni qachon o'z ishing sifatida ko'rsatish mumkin?", a: ["Har doim", "Tekshirib, tushunib, test qilib va yordamni qayd qilganda", "Test qilmasdan", "Promptni o'chirganda"], c: 1, w: "Ownership tekshirish, tushunish va shaffoflik bilan isbotlanadi.", level: "practical" },
  ],
  exercises: [
    { type: "choice", q: "Python yangi, React kuchli bo'lsa qaysi yo'l mos?", options: ["Developer track", "GIS track", "Faqat career modul", "Finaldan boshlash"], correct: 0, why: "Developer track mavjud dasturchilik tajribasini saqlab, Python va GIS bo'shlig'ini yopadi." },
  ],
};

const SPATIAL_FOUNDATIONS_MODULE: Module = {
  zoom: "s1",
  title: "Spatial Fundamentals",
  sub: "CRS / datum / topology",
  coord: "Foundation / spatial correctness",
  eyebrow: "FOUNDATION / GEODESY / GEOMETRY",
  mtitle: "Xarita chizishdan oldin fazoviy ma'lumotni to'g'ri tushunish",
  lede:
    "Professional WebGIS koordinatani ekranga chiqarishdan boshlanmaydi. CRS, datum, aniqlik, topologiya va o'lchov xatosini tushunmasdan yozilgan tez kod noto'g'ri qaror chiqarishi mumkin.",
  doc: `
    <h3>O'quv natijalari</h3>
    <p>Moduldan keyin sen dataset CRS'ini tekshirasan, maqsadga mos projected CRS tanlaysan, axis order xatosini topasan, geometry va geography trade-offini tushuntirasan hamda spatial predicate natijasini DE-9IM mantig'i bilan himoya qilasan.</p>
    <h3>Asosiy tushunchalar</h3>
    <div class="chips"><span class="chip t">datum va ellipsoid</span><span class="chip">EPSG / WKT</span><span class="chip t">4326 vs 3857</span><span class="chip">projected CRS</span><span class="chip">axis order</span><span class="chip t">precision</span><span class="chip">validity</span><span class="chip">topology</span></div>
    <h3>Qaysi masalani qaysi fazoda yechish kerak?</h3>
    <div class="exlist">
      <div class="ex"><b>Saqlash va almashish</b><span>Ko'p web API WGS84 lon/lat ishlatadi, lekin bu metrli o'lchov uchun universal yechim emas.</span></div>
      <div class="ex"><b>Mahalliy masofa va maydon</b><span>Hududga mos projected CRS tanlanadi; 3857 maydon o'lchash uchun ishlatilmaydi.</span></div>
      <div class="ex"><b>Global radius</b><span>PostGIS geography yoki geodezik hisob ishlatiladi; birlik va performance aniq yoziladi.</span></div>
    </div>
    <div class="tree">raw CRS -> inspect -> validate -> choose operation CRS -> transform -> calculate -> return documented CRS</div>
    <div class="callout"><div><p>Failure lab</p><p>Senga axis orderi almashgan nuqta, self-intersection polygon va noto'g'ri CRS bilan maydon hisoblangan dataset beriladi. Vazifa faqat tuzatish emas, xato sababini va downstream ta'sirini yozish.</p></div></div>
  `,
  code: [
    {
      heading: { h: "CRS qarorini tekshirish", p: "Transformatsiya doim input va output CRS bilan hujjatlashtiriladi." },
      title: "inspect_crs.py",
      lang: "py",
      code: `from pyproj import CRS, Transformer\n\nsource = CRS.from_epsg(4326)\ntarget = CRS.from_epsg(32642)\ntransform = Transformer.from_crs(source, target, always_xy=True)\nx, y = transform.transform(69.2401, 41.2995)\nprint({"input": [69.2401, 41.2995], "meters": [x, y]})`,
    },
    {
      heading: { h: "Geometry validity va predicate", p: "Natijani faqat ST_MakeValid bilan yopma; sababini top." },
      title: "spatial_correctness.sql",
      lang: "sql",
      code: `SELECT id, ST_IsValid(geom), ST_IsValidReason(geom)\nFROM parcels\nWHERE NOT ST_IsValid(geom);\n\nSELECT a.id, b.zone_id\nFROM assets a\nJOIN zones b ON ST_Covers(b.geom, a.geom);`,
    },
    {
      heading: { h: "Geometry va geography taqqoslash", p: "Bir xil savolni ikki yondashuvda o'lcha." },
      title: "distance_check.sql",
      lang: "sql",
      code: `SELECT\n  ST_Distance(a.geom::geography, b.geom::geography) AS geodesic_m,\n  ST_Distance(ST_Transform(a.geom, 32642), ST_Transform(b.geom, 32642)) AS projected_m\nFROM points a CROSS JOIN points b\nWHERE a.id = 1 AND b.id = 2;`,
    },
  ],
  tasks: [
    { id: "s1-1", html: "Dataset CRS, datum, axis order va birliklarini aniqladim", crit: "Hisobotda EPSG/WKT, birlik va tekshirish buyrug'i bor" },
    { id: "s1-2", html: "4326, 3857 va hududiy projected CRS natijalarini taqqosladim", crit: "Masofa yoki maydon xatosi raqam bilan ko'rsatilgan" },
    { id: "s1-3", html: "Axis orderi buzilgan nuqtalarni topib tuzatdim", crit: "Tuzatishdan oldin/keyin bbox va xarita screenshoti mavjud" },
    { id: "s1-4", html: "Invalid polygonlarni sabab bo'yicha tasnifladim", crit: "ST_IsValidReason natijasi va tuzatish siyosati yozilgan" },
    { id: "s1-5", html: "ST_Contains, ST_Covers va ST_Intersects farqini boundary misolida isbotladim", crit: "Kamida 4 test geometriya va kutilgan natija bor" },
    { id: "s1-6", html: "Geometry va geography querylarini aniqlik hamda performance bo'yicha solishtirdim", crit: "EXPLAIN va o'lchov farqi hisobotga qo'shilgan" },
    { id: "s1-7", html: "Spatial data contract yozdim", crit: "CRS, axis order, validity, precision va output format majburiyatlari aniq" },
  ],
  resources: [
    { type: "doc", url: "https://proj.org/en/stable/", title: "PROJ documentation", desc: "CRS va coordinate operation uchun rasmiy hujjat.", host: "proj.org" },
    { type: "doc", url: "https://epsg.org/home.html", title: "EPSG Geodetic Parameter Dataset", desc: "CRS va geodetik parametrlarni tekshirish uchun.", host: "epsg.org" },
    { type: "doc", url: "https://postgis.net/workshops/postgis-intro/projection.html", title: "PostGIS projections workshop", desc: "Geometry, geography va projection amaliyoti.", host: "postgis.net" },
    { type: "doc", url: "https://postgis.net/docs/using_postgis_dbmanagement.html", title: "PostGIS data management", desc: "Validity, SRID va spatial data boshqaruvi.", host: "postgis.net" },
  ],
  project: {
    tag: "Failure Lab / Spatial Correctness",
    title: "Broken Geodata Forensics",
    desc: "Ataylab buzilgan geodata to'plamidagi CRS, axis order, validity va predicate xatolarini topib, tekshiriladigan data contract bilan tuzat.",
    features: ["CRS audit", "axis-order repair", "geometry validity report", "predicate tests", "accuracy comparison", "data contract"],
    rubric: [
      "Har topilgan xatoning sababi tushuntirilgan",
      "Tuzatish qayta ishga tushiriladigan scriptda",
      "Aniqlik raqam bilan o'lchangan",
      "Regression testlar boundary holatlarni yopadi",
      "Output CRS va precision hujjatlashtirilgan",
    ],
  },
  quiz: [
    { q: "Nega EPSG:3857 da yer maydonini hisoblash xavfli?", a: ["SQL ishlamaydi", "Distorsiya hudud va kenglikka qarab o'zgaradi", "GeoJSON taqiqlaydi", "PostGIS index yo'q"], c: 1, w: "Web Mercator vizualizatsiya uchun qulay, lekin aniq maydon o'lchovi uchun mos emas.", level: "scenario" },
    { q: "Polygon boundary ustidagi nuqtani polygon ichida deb qabul qilish uchun qaysi predicate ko'pincha mos?", a: ["ST_Covers", "ST_Disjoint", "ST_Touches emas", "ST_Collect"], c: 0, w: "ST_Covers boundaryni ham qamrab oladi; biznes qoidasi bilan tanlanadi.", level: "practical" },
    { q: "always_xy=True nimani himoya qiladi?", a: ["SQL injection", "Longitude/x va latitude/y tartibini", "Invalid polygonni", "Tile cache'ni"], c: 1, w: "Kutubxona axis order qoidalari sabab koordinatalar almashib ketishining oldini oladi.", level: "practical" },
  ],
  exercises: [
    { type: "choice", q: "Toshkent hududida metr bilan lokal masofa o'lchash kerak. Eng to'g'ri qaror?", options: ["Har doim 3857", "Mos projected CRS yoki geography bilan tekshirilgan hisob", "CRSni olib tashlash", "Pixel masofa"], correct: 1, why: "O'lchovning aniqlik talabi va hududi asosida projected CRS yoki geodezik hisob tanlanadi." },
    { type: "gap", q: "Geometryning yaroqlilik sababini qaytaruvchi PostGIS funksiyasi: ___", answers: ["ST_IsValidReason", "st_isvalidreason"], why: "Funksiya faqat true/false emas, muammoning sababini beradi." },
  ],
};

const PROFESSIONAL_PYTHON_MODULE: Module = {
  zoom: "py1",
  title: "Professional Python",
  sub: "Packaging / errors / tests",
  coord: "Python bridge / engineering",
  eyebrow: "PYTHON / ENGINEERING / QUALITY",
  mtitle: "Python sintaksisidan production kodiga o'tish",
  lede:
    "FastAPI yoki GDAL kodini yozishdan oldin Python loyihasini paketlash, xatoni boshqarish, log yozish, resursni yopish va test qilishni o'rganasan.",
  doc: `
    <h3>Prerequisite</h3><p><code>z3 Python for JS/TS Devs</code> topshiriqlari bajarilgan bo'lishi kerak.</p>
    <h3>O'quv natijalari</h3>
    <div class="chips"><span class="chip t">pyproject.toml</span><span class="chip">modules/imports</span><span class="chip t">exceptions</span><span class="chip">logging</span><span class="chip">iterator/generator</span><span class="chip t">context manager</span><span class="chip">pytest</span><span class="chip">type checking</span></div>
    <p>JS'dagi rejected Promise va Python exception bir xil muammo emas. Python'da xatoni yutib yuborish, broad <code>except Exception</code> va mutable default argument kabi xatolar production pipeline'ni jim buzishi mumkin.</p>
    <h3>Professional qoida</h3>
    <div class="tree">input validation -> typed domain model -> service -> explicit errors -> structured log -> testable output</div>
    <div class="callout"><div><p>Failure lab</p><p>Memoryni ko'p yeyayotgan GeoJSON reader, yopilmay qolgan fayl va xatoni yutib yuborgan worker beriladi. Generator, context manager va typed exception bilan tuzatasan.</p></div></div>
  `,
  code: [
    {
      heading: { h: "Takrorlanuvchi loyiha", p: "Dependency va test sozlamasi bitta manifestda." },
      title: "pyproject.toml",
      lang: "toml",
      code: `[project]\nname = "geo-inspector"\nversion = "0.1.0"\nrequires-python = ">=3.12"\ndependencies = ["pydantic>=2.7"]\n\n[project.optional-dependencies]\ndev = ["pytest>=8", "mypy>=1.10", "ruff>=0.5"]\n\n[tool.pytest.ini_options]\ntestpaths = ["tests"]`,
    },
    {
      heading: { h: "Aniq xato va structured log", p: "Caller qaysi xatoni qanday boshqarishini biladi." },
      title: "errors.py",
      lang: "py",
      code: `import logging\n\nlog = logging.getLogger(__name__)\n\nclass InvalidGeoData(ValueError):\n    pass\n\ndef require_feature_collection(payload: dict) -> dict:\n    if payload.get("type") != "FeatureCollection":\n        raise InvalidGeoData("GeoJSON FeatureCollection kutilgan")\n    log.info("geojson_validated", extra={"feature_count": len(payload.get("features", []))})\n    return payload`,
    },
    {
      heading: { h: "Generator bilan streaming", p: "Katta faylni birdan memoryga yuklamaslik uchun." },
      title: "stream_features.py",
      lang: "py",
      code: `from collections.abc import Iterator\n\ndef feature_batches(features: list[dict], size: int = 500) -> Iterator[list[dict]]:\n    if size < 1:\n        raise ValueError("size musbat bo'lishi kerak")\n    for start in range(0, len(features), size):\n        yield features[start:start + size]`,
    },
    {
      heading: { h: "Boundary test", p: "Faqat happy path emas, noto'g'ri input ham test qilinadi." },
      title: "tests/test_errors.py",
      lang: "py",
      code: `import pytest\nfrom geo_inspector.errors import InvalidGeoData, require_feature_collection\n\ndef test_rejects_feature_instead_of_collection():\n    with pytest.raises(InvalidGeoData, match="FeatureCollection"):\n        require_feature_collection({"type": "Feature"})`,
    },
  ],
  tasks: [
    { id: "py1-1", html: "Python loyihasini pyproject.toml bilan paketladim", crit: "Fresh venv ichida install va CLI entry point ishlaydi" },
    { id: "py1-2", html: "Import va modul strukturasini circular importlarsiz tuzdim", crit: "src layout va kamida 3 modul mas'uliyati README'da yozilgan" },
    { id: "py1-3", html: "Domain exceptionlar va HTTP/worker error mapping yozdim", crit: "Kamida 3 xato turi va caller behavior testlangan" },
    { id: "py1-4", html: "Structured logging qo'shdim", crit: "Logda event, request/job id va muhim context bor; secret yo'q" },
    { id: "py1-5", html: "Katta inputni generator yoki batch bilan qayta ishladim", crit: "Oldin/keyin peak memory o'lchovi mavjud" },
    { id: "py1-6", html: "File/database resursini context manager bilan xavfsiz yopdim", crit: "Exception holatida ham cleanup ishlashini test isbotlaydi" },
    { id: "py1-7", html: "pytest, ruff va mypy quality gate qo'shdim", crit: "Bitta buyruq uchala tekshiruvni o'tkazadi" },
  ],
  resources: [
    { type: "doc", url: "https://packaging.python.org/en/latest/tutorials/packaging-projects/", title: "Python Packaging User Guide", desc: "pyproject.toml va paketlash uchun rasmiy yo'l.", host: "packaging.python.org" },
    { type: "doc", url: "https://docs.python.org/3/tutorial/errors.html", title: "Python errors and exceptions", desc: "Exception hierarchy va xato boshqaruvi.", host: "docs.python.org" },
    { type: "doc", url: "https://docs.python.org/3/howto/logging.html", title: "Python logging HOWTO", desc: "Production loglash asoslari.", host: "docs.python.org" },
    { type: "doc", url: "https://docs.pytest.org/en/stable/", title: "pytest documentation", desc: "Unit va parametrik testlar.", host: "docs.pytest.org" },
    { type: "doc", url: "https://mypy.readthedocs.io/en/stable/", title: "mypy documentation", desc: "Static type checking.", host: "mypy.readthedocs.io" },
  ],
  project: {
    tag: "Python / Failure Lab",
    title: "Production GeoJSON Inspector",
    desc: "Katta GeoJSONni batch bilan tekshiradigan, structured report va aniq exit code beradigan professional CLI yarat.",
    features: ["pyproject package", "typed domain errors", "stream/batch processing", "structured logs", "pytest", "mypy/ruff", "memory report"],
    rubric: [
      "Fresh environmentda takrorlanuvchi install",
      "Noto'g'ri input aniq exit code va xato beradi",
      "Katta faylda memory strategiyasi isbotlangan",
      "Testlar happy va failure pathni yopadi",
      "Loglarda maxfiy data yo'q",
    ],
  },
  quiz: [
    { q: "Nega broad except Exception xavfli?", a: ["Python sekinlashadi", "Kutilmagan xatoni yashirib, noto'g'ri natijani davom ettirishi mumkin", "TypeScript ishlamaydi", "GeoJSON kattalashadi"], c: 1, w: "Faqat boshqara oladigan xatoni tutish va qolganini kuzatiladigan qilish kerak.", level: "scenario" },
    { q: "Generatorning katta geodata uchun asosiy foydasi nima?", a: ["CRSni o'zgartiradi", "Elementlarni bosqichma-bosqich ishlab, peak memoryni kamaytiradi", "JWT yaratadi", "Tile chizadi"], c: 1, w: "Generator barcha elementni birdan ro'yxatga yig'masdan oqim bilan qayta ishlaydi.", level: "practical" },
    { q: "Context manager qaysi holatda ayniqsa muhim?", a: ["Rang tanlashda", "Fayl yoki DB resursini exception bo'lsa ham yopishda", "CSS yozishda", "CV yozishda"], c: 1, w: "with bloki cleanupni deterministik qiladi.", level: "easy" },
  ],
  exercises: [
    { type: "choice", q: "Worker noto'g'ri GeoJSON olganda eng yaxshi xulq qaysi?", options: ["Xatoni yutib done deyish", "Aniq domain error, failed status va kuzatiladigan log", "Processni abadiy kutish", "Barcha logni o'chirish"], correct: 1, why: "Xato foydalanuvchi va operatorga aniq ko'rinishi, job esa noto'g'ri muvaffaqiyat sifatida belgilanmasligi kerak." },
  ],
};

const GEOPYTHON_MODULE: Module = {
  zoom: "py2",
  title: "GeoPython & Numerical Data",
  sub: "NumPy / GeoPandas / chunks",
  coord: "Python bridge / geodata",
  eyebrow: "PYTHON / ARRAYS / GEOPROCESSING",
  mtitle: "Vector, raster va katta faylni Python'da ishonchli qayta ishlash",
  lede:
    "Bu modul oddiy Python kodini NumPy, GeoPandas, Shapely, Rasterio va PyProj bilan professional geoprocessing pipeline'ga aylantiradi.",
  doc: `
    <h3>O'quv natijalari</h3>
    <p>Sen vectorized hisob va Python loop farqini o'lchaysan, CRSni pipeline contractda saqlaysan, raster window bilan memoryni boshqarasan, nodata va dtype xatosini topasan hamda bir xil input uchun takrorlanuvchi output hosil qilasan.</p>
    <div class="chips"><span class="chip t">NumPy array/dtype</span><span class="chip">GeoPandas</span><span class="chip">Shapely 2</span><span class="chip t">PyProj</span><span class="chip">Rasterio window</span><span class="chip">nodata/mask</span><span class="chip t">chunking</span><span class="chip">provenance</span></div>
    <h3>Raster tuzoqlari</h3>
    <p>Pixel qiymati real dunyo koordinatasi emas. Transform, CRS, band, dtype, nodata va mask birga tekshiriladi. Float hisobni uint8 ga erta aylantirish yoki nodata'ni oddiy nol deb olish natijani buzadi.</p>
    <h3>Pipeline contract</h3>
    <div class="tree">manifest + checksum -> inspect -> validate -> transform -> quality report -> publish atomically</div>
    <div class="callout"><div><p>Reproducibility</p><p>Har output bilan source URI, checksum, tool version, CRS, command va timestamp saqlanadi. "Qaysi fayldan chiqqan?" savoliga javob bo'lmasa, pipeline professional emas.</p></div></div>
  `,
  code: [
    {
      heading: { h: "Vectorized geometry validation", p: "Shapely 2 va GeoPandas ustun bo'yicha ishlaydi." },
      title: "validate_vectors.py",
      lang: "py",
      code: `import geopandas as gpd\nfrom shapely import make_valid\n\ngdf = gpd.read_file("data/raw/assets.gpkg")\ninvalid = ~gdf.geometry.is_valid\ngdf.loc[invalid, "geometry"] = gdf.loc[invalid, "geometry"].map(make_valid)\ngdf.to_file("data/clean/assets.gpkg", driver="GPKG")`,
    },
    {
      heading: { h: "Raster window", p: "Butun raster o'rniga kerakli blok o'qiladi." },
      title: "window_stats.py",
      lang: "py",
      code: `import rasterio\nfrom rasterio.windows import Window\n\nwith rasterio.open("imagery.tif") as src:\n    block = src.read(1, window=Window(0, 0, 2048, 2048), masked=True)\n    print({"mean": float(block.mean()), "valid": int(block.count())})`,
    },
    {
      heading: { h: "Provenance manifest", p: "Output qayerdan va qanday yaratilgani mashina o'qiydigan bo'lsin." },
      title: "processing-report.json",
      lang: "json",
      code: `{"input":{"path":"assets.gpkg","sha256":"..."},"output":{"path":"assets-clean.gpkg","crs":"EPSG:4326"},"tool":{"name":"geo-clean","version":"0.1.0"},"checks":{"invalid_before":17,"invalid_after":0}}`,
    },
  ],
  tasks: [
    { id: "py2-1", html: "NumPy dtype va nodata xatosini tajribada ko'rsatdim", crit: "Noto'g'ri va to'g'ri natija raqam hamda test bilan solishtirilgan" },
    { id: "py2-2", html: "GeoPandas/Shapely bilan vector validation pipeline yozdim", crit: "Invalid before/after, geometry type va CRS report mavjud" },
    { id: "py2-3", html: "Projected CRSda metr/maydon hisobini bajardim", crit: "CRS tanlovi va accuracy cheklovi hujjatlashtirilgan" },
    { id: "py2-4", html: "Rasterio window bilan katta rasterdan statistik blok oldim", crit: "Peak memory full read bilan solishtirilgan" },
    { id: "py2-5", html: "Chunked processing va atomic output yozdim", crit: "Yarim yo'lda xato bo'lsa eski valid output buzilmaydi" },
    { id: "py2-6", html: "Har output uchun provenance manifest yaratdim", crit: "Checksum, tool version, CRS va command mavjud" },
    { id: "py2-7", html: "Golden fixture bilan regression test yozdim", crit: "Kichik deterministic dataset va kutilgan geometry/statistika mavjud" },
  ],
  resources: [
    { type: "doc", url: "https://numpy.org/doc/stable/user/absolute_beginners.html", title: "NumPy fundamentals", desc: "Array, dtype va vectorized hisob.", host: "numpy.org" },
    { type: "doc", url: "https://geopandas.org/en/stable/docs/user_guide.html", title: "GeoPandas user guide", desc: "Vector geodata processing.", host: "geopandas.org" },
    { type: "doc", url: "https://shapely.readthedocs.io/en/stable/", title: "Shapely documentation", desc: "Geometry operation va validity.", host: "shapely.readthedocs.io" },
    { type: "doc", url: "https://rasterio.readthedocs.io/en/stable/topics/windowed-rw.html", title: "Rasterio windowed reading", desc: "Katta raster uchun window va block amaliyoti.", host: "rasterio.readthedocs.io" },
    { type: "doc", url: "https://pyproj4.github.io/pyproj/stable/", title: "PyProj documentation", desc: "Python coordinate transforms.", host: "pyproj4.github.io" },
  ],
  project: {
    tag: "GeoPython / Reproducible Pipeline",
    title: "Geospatial Quality Gate CLI",
    desc: "Vector yoki raster inputni tekshiradigan, tuzatadigan va provenance bilan quality report chiqaradigan CLI qur.",
    features: ["vector/raster inspection", "CRS checks", "validity/nodata checks", "chunked processing", "atomic output", "provenance", "golden tests"],
    rubric: [
      "Katta input memoryga to'liq yuklanmaydi",
      "CRS va nodata qarorlari aniq",
      "Output deterministic va atomic",
      "Quality report mashina o'qiydigan formatda",
      "Golden regression testlar mavjud",
    ],
  },
  quiz: [
    { q: "Raster dtype'ni tekshirmasdan uint8 ga aylantirish nimaga olib kelishi mumkin?", a: ["CRS yaxshilanadi", "Qiymatlar kesilishi yoki overflow bo'lishi mumkin", "Index yaratiladi", "JPEG metadata ko'payadi"], c: 1, w: "Dtype diapazoni va scaling noto'g'ri bo'lsa ilmiy qiymat buziladi.", level: "scenario" },
    { q: "Window readning asosiy maqsadi nima?", a: ["JWT tekshirish", "Rasterdan kerakli blokni o'qib memory va I/Oni boshqarish", "Polygon tuzatish", "CSS yuklash"], c: 1, w: "Window katta rasterdan faqat kerakli bloklarni o'qishga imkon beradi.", level: "practical" },
    { q: "Provenance manifest nima uchun kerak?", a: ["UI rangini saqlash", "Output qaysi input va pipeline versiyasidan chiqqanini tiklash", "Parol saqlash", "Quizni qisqartirish"], c: 1, w: "Reproducibility va audit uchun input, versiya va command qayd qilinadi.", level: "easy" },
  ],
  exercises: [
    { type: "choice", q: "20 GB rasterdan kichik AOI statistikasi kerak. Birinchi strategiya?", options: ["Hammasini read() qilish", "Window/block bo'yicha o'qish", "PNG screenshot olish", "CRSni o'chirish"], correct: 1, why: "Window faqat kerakli bloklarni o'qib memory va I/Oni kamaytiradi." },
    { type: "gap", q: "Outputning manbasi va ishlov tarixini ifodalovchi tushuncha: ___", answers: ["provenance", "data provenance"], why: "Provenance artefaktning kelib chiqishi va qayta ishlash tarixini qayd qiladi." },
  ],
};

export const WEBGIS_FOUNDATION_MODULES_AFTER: Record<string, Module[]> = {
  z0: [DIAGNOSTIC_MODULE],
  z1: [SPATIAL_FOUNDATIONS_MODULE],
  z3: [PROFESSIONAL_PYTHON_MODULE, GEOPYTHON_MODULE],
};
