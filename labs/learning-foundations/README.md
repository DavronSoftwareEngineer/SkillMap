# Kichik natijani tekshirish laboratoriyasi

Python 3 standart kutubxonasi yetarli. Repository ildizidan:

```sh
python -m unittest discover -s labs/learning-foundations -p "test_*.py" -v
```

Avval test nomini o‘qing va natijani taxmin qiling. Keyin `reference.py`ni o‘qing,
testni bajaring va bir shartni o‘zgartiring. Test chiqishini moduldagi **Mustaqil ish**
daftarining dalil maydoniga qo‘ying. To‘g‘ri chiqishni nusxalashdan oldin sababini yozing.

| Kurs/modul | Kichik misol | Mustaqil o‘zgarish |
| --- | --- | --- |
| Geospatial s1 | AOI koordinata almashishini aniqlaydi | Hudud chegarasidagi pointlar; antimeridian uchun nima o‘zgaradi? |
| Geospatial py2/z7 | Mean 0.4, coverage 0.75 | Ikki bandda boshqa nodata masklari |
| Geospatial z18/ai1 | Train/validation field guruhlari kesishishi | Guruh IDlari alohida, ammo qo‘shni patchlarda leakage qolishi |
| Moliya F1/F10/F12 | Profit 5, closing cash 12 | Xarajat to‘lanmagan yoki invoice keyin kelgan holat |
| Backend BE3/BE7, Cybersecurity CY3 | Active identity + tenant + role | Object owner va readonly mutation siyosati |
| AI Prompt P3/P7 | JSON shakli valid, ammo deadline uydirilgan | Qarama-qarshi manba va unknown owner |

Bu kichik funksiyalar o‘rgatish uchun. Floating-point pul uchun production accounting
yechimi emas; Decimal yoki minor units kerak. AOI tekshiruvi umumiy CRS transform
emas. Group overlap to‘liq spatial leakage auditi emas. Permission misoli real
authentication emas. Summary testi haqiqiy AI modeliga request yubormaydi.

Frontend/Backend uchun ishlaydigan race va payment reference’lar
`src/data/learning/viewport-reference.ts` va `payment-reference.ts`da;
System Design uchun `labs/system-design`da concurrency/outbox modeli mavjud.
Haqiqiy integratsiyada ushbu kichik invariantni saqlab, platformaga xos test qo‘shing.
