# SkillMap: o‘quvchini yechimdan mustaqil natijaga olib borish

## Keyingi auditdagi saqlash tuzatishlari

- Notebook buzilgan manbani bo‘sh obyekt bilan almashtirmaydi. Sog‘lom yozuvlar
  ko‘rsatiladi, asl raw ma’lumot o‘zgarmaydi, yangi draft eksport uchun saqlanadi.
- Boshqa tabda o‘zgargan boshqa maydon eng yangi yozuvdan olinadi. Tahrirlanayotgan
  maydonning o‘zi o‘zgargan bo‘lsa, avtomatik yozish to‘xtaydi va konflikt xabari chiqadi.
  Bu real-time hamkorlik yoki server transaction kafolati emas.
- Saqlanmagan draft bo‘lsa, sahifani yopish/yangilashda brauzer ogohlantirishi so‘raladi.
  Draftni eksport qilib, sahifani qayta ochib, saqlangan versiya bilan solishtiring.
- Assessment `null`, noto‘g‘ri JSON yoki noto‘g‘ri maydon turlari sabab qulamaydi;
  buzilgan manba borligida tahrir saqlanmaydi va recovery xabari ko‘rsatiladi.
- Asosiy GitHub Actions workflow ikkala Python laboratoriyasini ham ishga tushiradi.
  Hosted CI bajarilishi keyingi pushdan keyin tekshiriladi.

## Nima o‘zgardi

Bu bosqichning maqsadi ball yozib qo‘yish emas: qisqa tushuntirishdan katta
topshiriqqa keskin sakrashni kamaytirish va o‘quvchining o‘z fikri hamda tekshiruv
dalilini yo‘qotmay saqlash. 13 kurs va 224 modulning mavjud IDlari saqlandi.
Mavjud progress o‘chirilmaydi; kurslar takror yaratilmagan.

Har kurs boshida tayyorgarlik, konkret input, ishlangan natija, natijaning sababi,
ketma-ket qadamlar, ataylab yaratiladigan xato, mustaqil transfer va topshiriladigan
artefaktlar bor. Bu barcha modullarning to‘liq darsligini almashtirmaydi:
modulga xos workshop va chuqur case’lar o‘z joyida qoladi.

| Kurs | Qo‘shilgan kichikdan professionalga yo‘l |
| --- | --- |
| Geospatial | Nodata bilan mean/coverage → koordinata nazorati → API/worker → GeoPulse dalillari |
| Frontend | Stable key va draft → async xato/stale response → accessible product UI |
| Backend | Oxirgi bitta mahsulot → transaction/idempotency → durable outbox va real DB testi |
| Git | Working tree/index/HEAD farqi → ikki clone → conflict va tekshirilgan release |
| Telegram | Takror update → bitta domain job → webhook, permission va payment dalillari |
| Cybersecurity | Tenantlararo ruxsat xatosi → lokal reproducer → fix va negative retest |
| English | CRS noma’lumligi haqida aniq update → recording/follow-up → ish muloqoti portfoliosi |
| Russian | Amal jarayoni/natijasi va kelishik → mijoz bilan dialog → mustaqil professional matn |
| Arabic | Harakatli gap tahlili → boshqaruv va gap tuzilishi → mustaqil yangi gap |
| Finance | Foyda 5, yakuniy cash 12, debitorlik 3 → timing o‘zgarishi → cash modeli |
| AI Prompting | Manbada yo‘q deadline = null → schema va faktni ajratish → held-out eval |
| Founder | O‘tgan real ish jarayoni → muammo intervyusi → mezonli paid pilot |
| System Design | Bitta joy/ikki request → invariant va transaction → failure/restore/ADR |

## Mustaqil ish daftari

Har modulda 6 alohida maydon: birinchi urinish, xato sababi va tuzatish,
yangi shartdagi natija, tekshirish dalili, review va qayta ishlash, keyingi qayta urinish.
Yechim eslatmasi yopiq holda turadi. Qabul mezoni va oldingi tayanch modulga havola bor.

- Har kurs uchun yangi `<courseId>_practice` kaliti; avvalgi storage kalitlari o‘zgarmadi.
- JSON backup/restore va modulning Markdown eksporti qo‘llanadi.
- Noto‘g‘ri turdagi yoki noma’lum maydonli notebook importi butun importdan oldin rad etiladi.
- Saqlash xatosi ko‘rinadi; joriy sahifa sessiyasida modulga qaytilganda draft qoladi.
  Brauzer yopilishidan oldin eksport zarur. Bu cloud-sync yoki cheksiz storage emas.
- Yozuv saqlangani, self-review yoki checkbox ekspert tomonidan tasdiqlangan natija emas.

## Kontentdagi aniqlik

Workshoplardagi `1 fr` CSS xatosi `1fr`ga tuzatildi. `E 2 E`, `p 95` kabi
buzilgan atamalar, yopishib qolgan so‘zlar va noaniq cash-flow iboralari tahrirlandi.
Modul/task IDlar almashtirilmadi. Bu tahrir barcha fanlar bo‘yicha tashqi ekspert
tekshiruvi o‘tkazilganini anglatmaydi.

## Ishlatib tekshirilgan natija

| Tekshiruv | Natija |
| --- | --- |
| `npm run build` ichidagi Vitest | 28 fayl, 184 test o‘tdi |
| TypeScript va Vite production build | O‘tdi; main JS taxminan 438 kB (gzip 146 kB) |
| `npm run test:e2e` | 26 Chromium test o‘tdi; 224 modulning mavjud panellari ochildi |
| `labs/learning-foundations` unittest | 8 test o‘tdi |
| `labs/system-design` unittest | 11 test o‘tdi |
| Mobil notebook | 390 px viewport overflow testi o‘tdi; screenshot ko‘rib chiqildi |

Notebook testlari: birinchi javobni tuzatishdan alohida saqlash, boshqa modul yozuvini
saqlab qolish, backup/restore, quota xatosi, navigation/reload va Markdown download.
13 kursning har birida practicum ko‘rinishi brauzerda tekshirildi.

Python misollari nazorat qilinadigan o‘quv modellari: ular production PostGIS,
haqiqiy bot to‘lovi, sun’iy yo‘ldosh pipeline’i yoki tashqi AI provider testlari emas.

## Qachon ta’lim natijasini tasdiqlash mumkin

Har kurs uchun baho qo‘yishdan oldin o‘quvchi: kichik misolni sababi bilan tushuntirishi,
namunadan farqli vazifani bajarishi, xato holatini tekshirishi, final artefaktni
ishga tushirishi yoki namoyish qilishi va review kamchiliklarini tuzatishi kerak.
Til kurslarida matndan tashqari tushunish va gapirish yozuvi, Founder’da real intervyu
dalili talab etiladi; ularni yozilgan kontent yoki avtomatik UI testi yaratib bermaydi.

Shuning uchun bu hisobot amalga oshirilgan o‘quv vositalari va tekshiruvni tasdiqlaydi,
har bir kurs mustaqil ravishda 10/10 deb sertifikatlanganini emas. Keyingi baholashda
aynan o‘quvchi qaysi qadamda to‘xtagani qayd etilib, shu dars chuqurlashtiriladi.
