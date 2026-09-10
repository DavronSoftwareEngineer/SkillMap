import type { Module } from '../../types';
import mapCanvasSource from '../../labs/corporate-gis/MapCanvas.tsx?raw';

// Original synthetic teaching material. No customer code, files or datasets.
export const CORPORATE_CASES = [
  {
    id: 'central-release', course: 'webgis', module: 'z14',
    title: 'MockAtlas: markaziy GIS va hududiy tarqatish',
    simple: 'Kutubxonachi kitobning tekshirilgan nashrini tarqatadi. Xuddi shunday, tahrirlanayotgan GIS bazasi bilan foydalanuvchiga chiqarilgan xarita nashri bir narsa emas.',
    input: 'Sun’iy zone-a va zone-b; har birida 2 ta kvadrat obyekt. Release r1 ishlayapti. r2 ichida zone-b geometriyasi yaroqsiz. Bu koordinatalar real hududni tasvirlamaydi.',
    steps: [
      'Ishchi PostGIS → immutable snapshot → sifat tekshiruvi → reviewer tasdig‘i → artifact → hududiy consumer oqimini chizing. Ishchi bazaga consumerlardan yozish huquqi bermang.',
      'Snapshot ID, source revision, qatlam sxemasi, bbox/CRS, obyektlar soni va artifact SHA-256 qiymatini manifestga yozing. Export davomida data o‘zgarmas snapshotdan o‘qiladi.',
      'r2 zone-b tekshiruvdan o‘tmagani uchun umumiy r2 manifestni aktivlashtirmang. Hududlar mustaqil release qilinsa, har hududning aniq versiyasini ko‘rsating; yashirin aralash versiya yaratmang.',
      'Avval vaqtinchalik manzilga yuklang, checksumni consumerda tekshiring, keyin current pointerini atomik almashtiring. Aloqa uzilsa avvalgi to‘liq release xizmat qilishda davom etadi.',
    ],
    decision: 'Bitta markaziy yozish manbai boshqarishni yengillashtiradi; offline nusxalar eskirishi mumkin. Har ekranda data sanasi bo‘lsin. Hududni frontendda yashirish xavfsizlik emas: maxfiy qatlam uchun alohida ruxsatli paket yoki server filtri kerak.',
    exercise: 'Yangi zone-c qo‘shing. Yuklashni yarmida uzing, so‘ng takrorlang. current faqat barcha zarur artifactlar tekshirilgach o‘zgarsin.',
    acceptance: 'r1 uzilish davomida ochiladi; incomplete r2 rad etiladi; hududlar manifestda aniq; yozish huquqi faqat markazda. Review protokoli va qayta yuklash dalilini saqlang.',
    code: 'const manifest = {\n  release: "r2", snapshot: "synthetic-s2",\n  regions: ["zone-a", "zone-b"],\n  schema: 1, status: "candidate",\n  // sha256 exportdan keyin haqiqiy fayldan hisoblanadi\n};\n// validate -> approve -> upload -> verify -> activate\n// Ushbu obyekt publish serveri emas, manifest namunasi.',
    source: 'https://www.postgresql.org/docs/current/transaction-iso.html',
  },
  {
    id: 'react-map-sdk', course: 'frontend', module: 'FE9',
    title: 'Bitta React xarita paketi, ikkita mustaqil ilova',
    simple: 'Rozetka turli qurilmalarga bir xil ulanish beradi. Map SDK ham loyihalarga umumiy xarita lifecycle va event shartnomasini beradi; har loyiha biznes qoidalarini o‘zi saqlaydi.',
    input: 'Sun’iy AtlasViewer tanlangan obyektni panelda ochadi; AtlasEditor esa tanlangan obyekt uchun tahrirlash formasini ochadi. Ikkalasi ham bir xil MapCanvas komponentidan foydalanadi.',
    steps: [
      'Paketning public API sini yozing: styleUrl, initialView, layers va onFeatureSelect({id, sourceLayer}). Invoice, xodim yoki buyurtma logikasini paketga kiritmang.',
      'Map instance effect ichida yaratiladi va cleanupda yopiladi. createMap identitysi oddiy renderda instance’ni almashtirmaydi; qayta yaratish uchun instanceKeyni o‘zgartiring. Unmountda listenerlar va map.remove chaqirilsin.',
      'Callback o‘zgarganda eski closure ishlamasin; style/source yangilanishi bilan mapni to‘liq yaratish orasidagi farqni ajrating. StrictMode mount-cleanup-mount siklini test qiling.',
      'Reactni peerDependency qiling; package exports va type declarationlarni belgilang. npm pack natijasini ikkita alohida fixture ilovaga o‘rnating. Monorepo ichidagi import bilan cheklanmang.',
    ],
    decision: 'SDK takror kodni kamaytiradi, ammo bir xato ko‘p consumerga tarqaladi. Versiyani pin qiling, SemVer va changelog ishlating. Paketni yangilash consumerning tekshirilgan yangi build/deployini talab qiladi; avtomatik hot-update emas.',
    exercise: 'Bir consumerda callbackni almashtiring, ikkinchisida unmount qiling. Qayta mount qiling va eventlar sonini o‘lchang. Yangi major versiya oldingi API bilan mos kelmasin — migration yozing.',
    acceptance: 'Har active hostda bitta map; unmountdan keyin 0 listener; event aynan bir marta; yangi callback ishlaydi. Ikki npm tarball consumer testi, typecheck va migration dalili kerak.',
    code: mapCanvasSource,
    source: 'https://react.dev/reference/react/useEffect',
  },
  {
    id: 'tile-archive', course: 'webgis', module: 'z8',
    title: 'Tegola tilelarini MBTiles orqali PMTilesga paketlash',
    simple: 'Tegola tayyorlagan sahifalarni bir kitobga yig‘amiz. SQL qoidalarini boshqa generatorga qayta yozish o‘rniga, belgilangan hudud va zoomdagi tayyor MVT baytlarini olamiz.',
    input: 'Faqat sun’iy qatlamli local tile endpoint. Sinov uchun z=0–2 va kichik bbox. Haqiqiy davlat yoki korxona endpointlari, cache fayllari va style fayllari bu labga olinmaydi.',
    steps: [
      'Data snapshot va Tegola config versiyasini muzlating. bbox/zoom asosida kutiladigan tile koordinatalarini hisoblang. z=15gacha butun dunyoni ko‘r-ko‘rona yuklamang.',
      'Har XYZ tile uchun HTTP status, body turi va gzip holatini tekshiring. Retry faqat vaqtinchalik xatolarga, limit/backoff bilan. 204/bo‘sh tile siyosati alohida: 404 yoki timeoutni jim bo‘sh tile deb qabul qilmang.',
      'MBTiles SQLite tiles jadvaliga zoom_level, tile_column, tile_row, tile_data yoziladi. XYZ y → TMS y = 2^z - 1 - y. Unique koordinata, transaction va checkpoint bilan qayta boshlashni ta’minlang.',
      'metadata jadvalida format=pbf, bounds, minzoom/maxzoom hamda json.vector_layers maydonlari haqiqiy layer/field sxemasiga mos bo‘lsin. MVT payloadini qayta kodlamang; gzipni ikki marta qo‘llamang.',
      'Kutilgan tilelarning barchasi muvaffaqiyatli yoki kelishilgan empty holatda ekanini tekshiring. Keyin pmtiles convert va pmtiles verify bajaring. Verify vizual tenglikni isbotlamaydi.',
      'Bir xil style, sprite, glyph, source-layer, feature ID va kamera bilan asl tile hamda arxivni solishtiring. PMTiles protokoli va HTTP Range/CORS ishlashi alohida integration testdir.',
    ],
    decision: 'MBTiles bu yo‘lda resumable oraliq arxiv; PMTiles uchun universal majburiyat emas. Paket snapshot beradi, jonli SQL/query API emas. Stilgina o‘zgarsa data sxemasi mos bo‘lganida tile rebuild shart emas.',
    exercise: 'Bitta tilega 503, boshqasiga HTML 200 javob yuboradigan fake server yarating. Yarim jarayonda to‘xtating va checkpointdan davom ettiring. Bitta source-layer nomini atay o‘zgartiring.',
    acceptance: 'Koordinata va bayt checksumlari mos; missing/error bo‘lsa publish bloklanadi; restart dublikat yaratmaydi; layer/style mismatch aniqlanadi. 3 zoomdagi tasvirlar va hover/select tekshiruvi kerak.',
    code: 'function xyzToTms(z: number, y: number) {\n  if (!Number.isInteger(z) || z < 0 || z > 30 ||\n      !Number.isInteger(y) || y < 0 || y >= 2 ** z) throw Error("tile");\n  return 2 ** z - 1 - y;\n}\n// Tilelarni yig‘ib, metadata tekshirilganidan KEYIN:\n// pmtiles convert synthetic.mbtiles synthetic.pmtiles\n// pmtiles verify synthetic.pmtiles',
    source: 'https://docs.protomaps.com/pmtiles/cli',
  },
  {
    id: 'compatible-release', course: 'systemdesign', module: 'SD-DEL',
    title: 'Data + style + SDK: tekshiriladigan release va rollback',
    simple: 'Kalit va qulf alohida-alohida yaxshi bo‘lsa ham bir-biriga mos bo‘lmasa eshik ochilmaydi. Data qatlamlari, style va SDK ham bitta moslik shartnomasidan o‘tishi kerak.',
    input: 'r1: schema=1, buildings.height. r2: schema=2, structures.height_m. Eski style buildings.height kutmoqda. Barcha ma’lumot sun’iy.',
    steps: [
      'Release manifestga data hash, style hash, SDK aniq versiyasi, schema, source-layer va required fieldlarni yozing. CI tested artifactni deploy qilsin; latest tagdan yangi build olmasin.',
      'Static contract gate eski style r2ga mos emasligini topsin. So‘ng browser test real rendering, glyph/sprite va selectionni tekshirsin. Faqat JSON mosligi yetmaydi.',
      'Avval bitta synthetic canary consumerga candidate bering. Oldindan belgilangan error rate, tile latency va bo‘sh layer mezonlari bilan kuzating; natijalarni amalda o‘lchang.',
      'Data, style va SDK uchun mos oldingi bundle saqlansin. Pointer almashtirishdan avval rollback target ham tekshirilsin. DB migration bo‘lsa destructive down migration o‘rniga expand-contract va moslik davrini rejalang.',
    ],
    decision: 'Bitta release manifest izchillik beradi, lekin barcha ilovani bir vaqtda deploy qilish shart emas. Har consumer o‘z tasdiqlangan bundle versiyasini ishlatadi. Offline consumer kechikishi qo‘llab-quvvatlash oynasiga kiradi.',
    exercise: 'Canaryda missing glyph va eski SDK holatini kiriting. r2ni rad etib r1ga qayting. Ikkinchi urinishda to‘g‘ri bundle bilan publish qiling.',
    acceptance: 'Mos kelmaydigan candidate aktivlashmaydi; rollback eski data/style/SDK kombinatsiyasini tiklaydi; CI SHA mos; faktik rollback vaqti va ADR mavjud. Soxta SLO natijasi yozilmang.',
    code: 'const candidate = { dataSchema: 2, styleSchema: 1, sdkSchema: 1 };\nconst compatible = candidate.dataSchema === candidate.styleSchema\n  && candidate.dataSchema === candidate.sdkSchema;\nif (!compatible) throw Error("release blocked");\n// Bu sodda exact-version model. Productionda field/layer contracts\n// va qo‘llab-quvvatlanadigan version range ham tekshiriladi.',
    source: 'https://docs.npmjs.com/about-semantic-versioning',
  },
  {
    id: 'durable-worker', course: 'backend', module: 'BX2',
    title: 'Ikki worker, bitta job: lease, fencing va qayta tiklanish',
    simple: 'Ombordagi buyurtmani ikki odam bir vaqtda jo‘natmasligi kerak. Navbat xabarni qayta berishi mumkin, shuning uchun takror bajarish xavfsiz bo‘lishi kerak.',
    input: 'synthetic-export-r2 jobini worker A oldi, keyin to‘xtab qoldi. Lease tugagach B oldi. A yana uyg‘ondi. Broker xabarni yana bir marta yetkazdi.',
    steps: [
      'Jobni DBda unique idempotency key bilan yarating. pending → running → succeeded/failed holatlari, attempt, lease_until, owner va fencing token saqlansin.',
      'Qisqa DB transactionda claim qiling; mos row lock yoki atomik UPDATE ... RETURNING ishlating. Render davomida uzoq ochiq transaction yoki lock ushlab turmang.',
      'Lease tugaganda yangi claim fencing tokenni oshiradi. Finish/publish UPDATE owner, token va amaldagi lease sharti bilan bajarilsin; eski A natijasi rad etiladi.',
      'Tashqi artifact attempt-specific temporary nomga yoziladi. Current pointer faqat tasdiqlangan owner tomonidan almashtiriladi. Provider side-effectlari ham idempotent bo‘lishi kerak; DB fencingning o‘zi tashqi jo‘natishni to‘xtatmaydi.',
      'Bounded retry, heartbeat, stuck-job reaper va manual replay auditini belgilang. succeeded job takror xabarda qayta bajarilmasin.',
    ],
    decision: 'At-least-once + idempotency odatda tushunarliroq. Exactly-once deb va’da bermang. Memorydagi test algoritmni ko‘rsatadi, haqiqiy ikki process DB race sini isbotlamaydi.',
    exercise: 'A claimdan keyin crash; B reclaim; A finish; B finish; duplicate delivery ketma-ketligini sinang. Keyin ikkita haqiqiy worker va test Postgres bilan takrorlang.',
    acceptance: 'Eski A publish qila olmaydi; B bir marta commit qiladi; succeeded job qayta claim qilinmaydi; poison job boshqalarni to‘xtatmaydi. DB integration loglari alohida dalil.',
    code: '-- Faqat completionning muhim sharti, to‘liq queue emas:\nUPDATE jobs SET status = \'succeeded\'\nWHERE id = :id AND owner = :owner AND fence = :fence\n  AND status = \'running\' AND lease_until > now()\nRETURNING id;\n-- 0 row: lease/ownership yo‘q; artifactni publish QILMANG.',
    source: 'https://www.postgresql.org/docs/current/explicit-locking.html',
  },
  {
    id: 'token-lifecycle', course: 'backend', module: 'BE7',
    title: 'Eski admin token: rol pasayganda huquq ham pasaysin',
    simple: 'Xodimdan kalitni qaytarib olish faqat uning roli qog‘ozda o‘zgargani bilan bajarilmaydi. Oldin berilgan token ham yangi holatga nisbatan tekshirilishi kerak.',
    input: 'Sun’iy user-u1 admin, authVersion=4. Rol viewerga o‘zgardi va authVersion=5 bo‘ldi. Eski token hali expire bo‘lmagan.',
    steps: [
      'Token imzosi, algoritm allowlisti, issuer/audience va exp tekshiruvi authentication bosqichi. Bu darsdagi mock token kriptografik JWT verifikatori emas.',
      'Har himoyalangan operatsiyada active user va joriy authVersion/session holatini tekshiring. Admin→viewer, password reset va account disable session revocation siyosatini ishlatsin.',
      'Server permissionni joriy role/membershipdan hisoblasin. Tenant va obyektga ruxsat query chegarasida ham tekshirilsin; client yuborgan role yoki regionga ishonmang.',
      'Auth store ishlamasa boshqaruv/yozish amali fail-closed bo‘lsin. Qisqa TTL cache revocationni kechiktirishi mumkin: shu oynani aniq hujjatlang. Public xarita uchun alohida public endpoint ishlating.',
    ],
    decision: 'Stateless JWT qulay, ammo darhol revocation uchun server holati yoki boshqa revocation mexanizmi kerak. Short-lived tokenning o‘zi expiry vaqtigacha eski huquqni saqlashi mumkin.',
    exercise: 'Valid old admin token bilan rol pasayganidan keyin publish so‘rovi yuboring. Password reset, disabled user, cross-tenant object va auth store timeout holatlarini ham test qiling.',
    acceptance: 'Eski admin token rad; yangi viewer publish qila olmaydi; timeout ruxsatga aylanmaydi; token/parol logda yo‘q. Negative integration matrix va revocation oynasi dalili bor.',
    code: '// JWT tekshiruvidan KEYINGI qo‘shimcha authorization modeli:\nif (!user.active || claims.authVersion !== user.authVersion)\n  throw Error("session revoked");\nif (user.role !== "admin") throw Error("forbidden");\n// Auth DB unavailable: privileged operationni ruxsat etmaslik.',
    source: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html',
  },
  {
    id: 'golden-record', course: 'webgis', module: 'z5',
    title: 'Golden record: geometriya, atribut va provenance birga',
    simple: 'Ikki daftar bir obyekt haqida turli ma’lumot beradi. Ishonchli yakuniy yozuvni tanlash — faqat oxirgi yozuvni ko‘chirib qo‘yish emas.',
    input: 'Source A: mock-building-1, square [[0,0],[1,0],[1,1],[0,1],[0,0]], height=10. Source B: shu ID, siljigan square, height=12. Ikkalasi ham sun’iy; koordinatalar real bino emas.',
    steps: [
      'Avval CRS, coordinate order, geometry validity, units va required atributlarni tekshiring. Invalid geometriyani jim tuzatish o‘rniga raw yozuv va repair reasonni saqlang.',
      'Source ID, observed_at, import batch, litsenziya/provenance va har fieldning kelib chiqishini saqlang. Canonical ID source-local IDdan alohida bo‘lsin.',
      'Business qoida: atributning yangiligi geometriyaning to‘g‘riligini isbotlamaydi. Synthetic siljish reviewga tushsin. Duplicate va matching confidence ham review protokoliga kiradi.',
      'Checksum geometriya bilan atributlarni ham qamrasin. Canonical serialization/version belgilang; object key tartibi tasodifan hashni o‘zgartirmasin. Geometrik tenglik bilan byte tengligi boshqa tushunchalar.',
      'Approved record + provenance atomik yozilsin. Reviewdan o‘tmagan o‘zgarish published snapshotga kirmasin. Raw → candidate → approved qatlamlarini ajrating.',
    ],
    decision: 'Avtomatik merge tez, ammo noto‘g‘ri moslashtirish tarqaladi. High-confidence va conflict-free holatlargagina avtomatlashtiring; boshqa holatlar inson reviewiga o‘tsin. Checksum sifat yoki geografik to‘g‘rilik isboti emas.',
    exercise: 'Heightni o‘zgartirmay bitta koordinatani siljiting. So‘ng JSON property tartibini almashtiring. Birinchi holatda fingerprint o‘zgarsin, ikkinchisida canonical output o‘zgarmasin.',
    acceptance: 'Geometriya o‘zgarishi aniqlanadi; raw yo‘qolmaydi; har approved field provenancega ega; review required candidate publish qilinmaydi. Invalid/self-intersecting polygon uchun PostGIS integration testi ham kerak.',
    code: '-- Geometry-only o‘zgarishni ham solishtiring (valid CRS bilan):\nSELECT NOT ST_Equals(old.geom, candidate.geom) AS geometry_changed;\n-- Byte fingerprint boshqa maqsad: canonical attributes + normalized\n-- geometry + serialization version ustidan SHA-256 hisoblash.\n-- ST_Equals, checksum va ST_IsValid bir-birini almashtirmaydi.',
    source: 'https://postgis.net/docs/ST_Equals.html',
  },
] as const;

export const CORPORATE_LINKS = [
  { course: 'git', module: 'GT10', target: 'compatible-release', text: 'CI mashqi: tested artifact digestni deploygacha o‘zgartirmang; candidate gate yiqilganda deploy job ishga tushmasin.' },
  { course: 'cybersecurity', module: 'CY3', target: 'token-lifecycle', text: 'Security review: eski token, rol pasayishi, auth-store outage va logdagi maxfiy qiymatlar uchun negative test matrix tuzing.' },
  { course: 'webgis', module: 'FG', target: 'central-release', text: 'Flagshipga transfer: faqat sun’iy regionlar bilan tekshirilgan release va rollback dalilini yakuniy portfolioga bog‘lang.' },
] as const;
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const STARTERS: Record<string, string> = {
  'react-map-sdk': 'Repository ildizida npm run test:corporate-sdk bajaring. Haqiqiy tarball ikki alohida synthetic consumerga offline o‘rnatiladi, typecheck/build va Chromium selection/cleanup testi o‘tadi. Terminaldagi node_modules/.tmp/mock-sdk-* papkasida consumerlar bor. MapLibre o‘rniga mock DOM adapter ishlatilgan. instanceKey — faqat ataylab qayta yaratish uchun.',
  'tile-archive': 'python -m unittest discover -s labs/corporate-gis -p "test_*.py" -v bilan boshlang. python labs/corporate-gis/lab.py --output node_modules/.tmp/synthetic.mbtiles --limit 2 jarayonni yarimda to‘xtatadi; shu buyruqni --limit 2siz va --fault retry bilan qaytaring. Gzip MVT, XYZ/TMS, checkpoint, HTML 200 va 503 sinovlari bor. --pmtiles-bin pmtiles faqat rasmiy CLI o‘rnatilganida ishlaydi.',
  'durable-worker': 'python -m unittest discover -s labs/corporate-gis -p "test_*.py" -v ikki haqiqiy Python process bilan claim va restart/fencing sinovlarini bajaradi. Vaqt synthetic, DB — SQLite. Bu Postgres integration testi emas. labs/corporate-gis/lab.py dagi claim/finish va test_lab.py dagi process testlarini yangi holat bilan kengaytiring.',
};

export function applyCorporateLearning(course: string, module: Module): Module {
  const owned = CORPORATE_CASES.filter(c => c.course === course && c.module === module.zoom);
  const related = CORPORATE_LINKS.filter(c => c.course === course && c.module === module.zoom);
  if (!owned.length && !related.length) return module;
  const doc = owned.map(c => `<h3>${esc(c.title)}</h3><p><strong>Mock-only laboratoriya:</strong> barcha obyekt, koordinata, identifikator va holatlar sun’iy. Tashqi loyiha kodi yoki ma’lumoti ishlatilmaydi.</p><p>${esc(c.simple)}</p><h4>Kirish vaziyati</h4><p>${esc(c.input)}</p><h4>Qadamli yechim</h4><ol>${c.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><h4>Qaror va trade-off</h4><p>${esc(c.decision)}</p><h4>Mustaqil ish va xato kiritish</h4><p>${esc(c.exercise)}</p><h4>Qabul mezoni va dalil</h4><p>${esc(c.acceptance)}</p><p>ADR yozing: kontekst → 2 variant → tanlov → cheklov → qayta ko‘rish sharti. Ish daftaringizga birinchi urinish, test buyrug‘i, haqiqiy natija va tuzatishni yozing. Kod panelidagi misolni tekshiring; mock unit testi production integratsiya bajarildi degani emas.</p>`).join('');
  const relatedDoc = related.map(link => {
    const c = CORPORATE_CASES.find(c => c.id === link.target)!;
    return `<h3>Kurslararo amaliy bog‘lanish</h3><p>${esc(link.text)} To‘liq case: <a href="#${c.course}/${c.module}">${esc(c.title)}</a>. Bu yerda alohida takror modul yaratilmagan.</p>`;
  }).join('');
  return {
    ...module, doc: module.doc + doc + owned.filter(c => STARTERS[c.id]).map(c => `<h3>Ishga tushiriladigan starter</h3><p>${esc(STARTERS[c.id])}</p><p>To‘liq yo‘riqnoma: repositorydagi labs/corporate-gis/README.md. Avval tayyor testni bajaring, keyin bitta xato kiritib yangi test qo‘shing. Faqat synthetic data bilan ishlang.</p>`).join('') + relatedDoc,
    code: [...module.code, ...owned.map(c => ({ heading: null, title: c.title + ' — o‘quv namunasi', lang: c.code.startsWith('--') ? 'sql' : 'typescript', code: c.code }))],
    tasks: [...module.tasks, ...owned.map(c => ({ id: `corporate-${c.id}`, html: esc(c.title) + ': mock laboratoriya va ADR', crit: c.exercise + ' ' + c.acceptance })), ...related.map(c => ({ id: `corporate-link-${c.target}`, html: esc(c.text), crit: 'Bog‘langan casega tayangan kursga xos dalil va kamida bitta salbiy testni ish daftarida saqlang.' }))],
    resources: [...module.resources, ...owned.filter(c => !module.resources.some(r => r.url === c.source)).map(c => ({ type: 'doc' as const, url: c.source, title: c.title + ' — rasmiy manba', desc: 'O‘quv modelini ishlab chiqarish muhitiga o‘tkazishda rasmiy kontraktni tekshiring.', host: new URL(c.source).hostname }))],
  };
}
