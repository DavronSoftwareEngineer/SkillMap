# TeamRelease: ishlaydigan ikki-clone mashqi

Node.js va Git kerak. Repository ildizidan:

```sh
node labs/git-team/run.mjs
```

Script yangi vaqtinchalik papkada local bare remote, Alice va Bob clone’larini
yaratadi. GitHubga ulanmaydi. SkillMap tarixini o‘zgartirmaydi. Faqat shu yangi
repositorylarda synthetic ism/email sozlaydi va hook/signingni o‘chiradi.

U A/B/C orqali working tree, index va HEADni tekshiradi; ikki clone bir satrni
o‘zgartiradi; haqiqiy merge conflictni hosil qilib base/ours/theirsni chiqaradi;
`Map Atlas` yechimini commit qiladi. Yakunda ikkala clone bir SHAga yetishi assert
qilinadi. `evidence.json` va graph terminaldagi papkada qoladi, avtomatik o‘chmaydi.

Avval har assertion natijasini ayting, keyin scriptni ishga tushiring. Mustaqil
variant: yangi alohida clone’da conflictni noto‘g‘ri ma’no bilan yeching; shared
commitni revert va yangi commit orqali to‘g‘rilang. `rescue` branch mavjud commitga
ref yaratishni ko‘rsatadi; o‘chirilgan commitni reflogdan topish alohida mashq.

Bu local Git dalili. GitHub branch protection, reviewer approval, hosted CI va
production rollback bajarildi degani emas. GT14da o‘zingizning o‘quv repongizda
failed test merge/deployni to‘xtatishini alohida tekshiring.
