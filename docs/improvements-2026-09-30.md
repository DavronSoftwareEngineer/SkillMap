# SkillMap frontend yaxshilanishlari — 2026-09-30

Dashboard va o‘quvchi qaydlari frontendda ishlaydi. Hisob va cloud saqlash uchun
Netlify Functions/PostgreSQL qo‘shilgan; [joriy full-stack qo‘llanma](netlify-fullstack.md)
ishga tushirish, deployment va tekshirishni tushuntiradi. GeoPulse laboratoriyasi
alohida loyiha bo‘lib qoladi.

## Qolgan imkoniyatlar

1. Dashboard foizi topshiriq bajarilishini bildiradi. Checkboxlardan “Tayyor” yoki
   malaka darajasi chiqarilmaydi. Quiz, amaliy dalil va qo‘lda qayd etilgan loyiha
   reviewer bahosi alohida ko‘rsatiladi.
2. Progress va o‘quvchi qaydlarini boshqa qurilmaga mavjud JSON zaxira orqali ko‘chirish
   tushuntirildi. Bunda faylni odamning o‘zi uzatadi; bu avtomatik cloud sync emas.
3. GeoPulse o‘zining avvalgi laboratoriya holatida. Serverdagi tenant, RBAC, migratsiya
   yoki production persistence’ni frontendning o‘zida amalga oshirib bo‘lmaydi.
4. 13 kurs uchun parallel boshlang‘ich/yakuniy topshiriqlar, ishtirokchi kodi,
   yordam, dalil, qiyinlik, feedback va 4 mezonli tashqi bahoni qo‘lda qayd etish bor.
   Bir xil kod/protokol uchun ikkala to‘liq bahoning farqi ko‘rsatiladi. Barcha baholar
   mahalliy va tasdiqlanmagan deb belgilanadi; haqiqiy natijalar oldindan to‘ldirilmagan.

Yozuvlar COURSE_outcomes kalitida saqlanadi va normal zaxiraga kiradi.
Natija eksportining o‘zi ham “Tiklash import” orqali boshqa qurilmada ochiladi.
Eksport reviewerga avtomatik yuborilmaydi. Buzilgan manba yoki boshqa tabdagi
raqobatli tahrir ustiga yozilmaydi; saqlanmagan yozuvni eksport qilish mumkin.
Import mavjud qaydni almashtiradi va avvalgi holat uchun recovery saqlaydi.

## Netlify

GitHub repo, build npm run build, publish dist. Hisob va cloud uchun tashqi
PostgreSQL URL va SYNC_ENCRYPTION_KEY sozlanadi. Cloudga tugma orqali saqlanmagan
mahalliy yozuvlar brauzer o‘chirilganda faqat JSON zaxira bilan tiklanadi.

## Dalil chegaralari

Mahalliy reviewer nomi/bahosi mustaqil shaxs tomonidan tasdiqlangan baho hisoblanmaydi.
Kurs samaradorligi uchun haqiqiy qatnashuvchilar va tashqi reviewer bilan
[pilot](learner-pilot-protocol.md) o‘tkazish kerak. Frontend identity tekshiruvi yoki
o‘zgarmas server yozuvi bor deb da’vo qilmaydi. Testlar sun’iy yozuvlardan foydalanadi.

## Tekshirish

- 226 Vitest test, TypeScript va production build o‘tdi.
- 13 browser sinovi o‘tdi: ikki browser orasida JSON transfer, mahalliy baho,
  boshqa ishtirokchilarni solishtirmaslik, saqlash xatosi/recovery, kurs navigatsiyasi,
  JSON rollback va mavjud mustaqil ish daftarining tablararo saqlanishi.
- Netlify CSP bilan frontend outcome eksporti, light/mobile layout va kitob
  havolalari sinovi o‘tdi; CSP buzilishi yoki browser xatosi kuzatilmadi.

    npm run build
    npm run test:e2e -- frontend-outcomes.spec.ts reliability.spec.ts learning-flow.spec.ts practice-notebook.spec.ts --workers=2
    npm run test:production
