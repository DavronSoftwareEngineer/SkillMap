# SkillMap — frontend va Netlify

SkillMap React/TypeScript/Vite asosidagi statik ilova. Hisob, server funksiyalari,
PostgreSQL va cloud sync ishlatilmaydi. O‘quv laboratoriyalaridagi backend misollari
mustaqil mashqlar bo‘lib, saytni ishga tushirish uchun talab qilinmaydi.

## Lokal ishga tushirish

    npm ci
    npm run dev

Brauzerda terminal ko‘rsatgan localhost manzilini oching. Production yig‘ish:

    npm run build
    npm run preview

## Progress va qurilmalar orasida ko‘chirish

Progress, quiz, SRS, amaliy ish va natija qaydlari shu brauzerning localStorage’ida
saqlanadi. Avvalgi saqlash kalitlari o‘zgarmagan: mavjud progress saqlanadi.

Dashboard → “Zaxira eksport” barcha kurslarning JSON zaxirasini yuklab beradi.
Faylni ikkinchi qurilmaga o‘zingiz uzating, dashboard → “Tiklash import” bilan oching.
Importdan oldin ikkinchi qurilmaning mavjud yozuvlarini ham eksport qiling.
Ilova noto‘g‘ri zaxirani rad etadi va yozish xatosida oldingi holatni qaytarishga urinadi.

Brauzer ma’lumotlarini tozalashdan oldin JSON zaxira oling. Turli brauzerlar va
localhost/Netlify manzillarining xotirasi alohida; avtomatik cloud sync mavjud emas.

## Netlify

- Repository: DavronSoftwareEngineer/SkillMap, branch: master.
- Build: `npm run build`.
- Publish: `dist`.
- `netlify.toml` SPA yo‘llari va xavfsizlik headerlarini belgilaydi.
- Environment variable, Functions yoki Database sozlamasi frontend uchun kerak emas.

GitHub pushdan keyin yangi deploy `Published` holatiga o‘tishini tekshiring.
Oldingi hisob/cloud funksiyalari yangi deploy bilan sayt paketidan chiqadi.
Netlify’dagi avval yaratilgan bazani bu kod o‘zgartirmaydi; undagi ma’lumotlarni
o‘chirish alohida hosting boshqaruvi hisoblanadi.

## Tekshirish

    npm run build
    npm run test:production
    npm run test:e2e -- frontend-outcomes.spec.ts reliability.spec.ts learning-flow.spec.ts practice-notebook.spec.ts --workers=2
