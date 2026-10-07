import type { Module, QuizQuestion, Exercise } from '../types';

const q = (question: string, answers: string[], correct: number, why: string): QuizQuestion =>
  ({ q: question, a: answers, c: correct, w: why, level: 'scenario' });
const choice = (question: string, options: string[], correct: number, why: string): Exercise =>
  ({ type: 'choice', q: question, options, correct, why });
const source = (title: string, url: string) => ({ type: 'doc' as const, title, url, host: 'developers.openai.com', desc: 'Rasmiy manba. Mahsulot imkoniyatlari va hisob limiti ishlatayotgan versiyangizda tekshiriladi.' });
function lesson(id: string, title: string, lede: string, sections: [string,string][], template: string, tasks: string[], quiz: QuizQuestion[], exercises: Exercise[], sources: Module['resources'], vocabulary: [string,string,string][]): Module {
  return {
    zoom:id, title, mtitle:title, lede, sub:'Agentlar va samaradorlik', coord:'AI Prompt / '+id, eyebrow:'Amaliy yo‘l / Agentlar',
    doc:'<div class="prose">'+sections.map(([h,p])=>`<h3>${h}</h3><p>${p}</p>`).join('')+'<h3>Mustaqil dalil</h3><p>Shablonni Promptlar bo‘limidan oling. Mashqni tashqi agentda yoki qog‘ozdagi simulyatsiyada bajaring; qaysi biri ekanini yozing. Mustaqil ish daftarida birinchi urinish, xato, tuzatish va yangi vazifaga ko‘chirishni saqlang. Ertasi kuni shablonsiz qaytaring. SkillMap agentni ishga tushirmaydi va hisobingiz limitini o‘qimaydi.</p></div>',
    code:[{heading:{h:'Nusxalab moslashtiriladigan shablon',p:'Qavs ichidagi joylarni o‘z vazifangizga moslang; o‘lchanmagan natijani noma’lum belgilang.'},title:id+' — ish shabloni',lang:'text',code:template}],
    tasks:tasks.map((html,i)=>({id:`${id.toLowerCase()}-${i+1}`,html,crit:'Vazifa, kuzatilgan natija, dalil va cheklovni ish daftariga yozing. '+html})),
    quiz,exercises,resources:sources,
    project:{tag:'Agent amaliyoti',title,desc:lede,features:tasks,rubric:['Qabul mezoni ish boshlanishidan oldin yozilgan.','Kuzatilgan natija va taxmin alohida.','Tekshiruv dalili, qolgan ish va to‘xtash sababi ko‘rinadi.','Sifat, jami sarf va vaqt birgalikda solishtirilgan.']},
    vocab:vocabulary.map(([w,uz,ex])=>({w,uz,ex})),
  };
}

export const PROMPTING_AGENT_MODULES: Module[] = [
  lesson('P-Agent','Agentga vazifa topshirish va ishni yakunlatish',
    'Maqsad, kerakli kontekst, vakolat va qabul mezoni bilan agentga bajariladigan ish bering.',[
      ['Agent qanday ishlaydi?','Agent vositalar bilan ko‘p bosqichli ish bajaradi: maqsadni tushunadi, kerakli ma’lumotni topadi, amal qiladi va natijani tekshiradi. Oddiy suhbatdagi maslahat bilan faylni haqiqatan tahrirlash yoki testni ishga tushirishni ajrating. Avval vositalari va ish muhiti borligini tekshiring. Vosita mavjud bo‘lmasa, “bajardim” degan jumla ijro dalili emas.'],
      ['Yaxshi topshiriqning besh qismi','1) Kuzatiladigan yakun: nima ishlashi kerak. 2) Kerakli manba: tegishli fayl, ekran, xato yoki namunalar. 3) Chegara: qaysi qismlar o‘zgaradi va nima saqlanadi. 4) Vakolat: qaysi amallarni bajarish mumkin. 5) Qabul mezoni: yakunni qanday sinaymiz. “Loyihani zo‘r qil” o‘rniga “qidiruvda bo‘sh natija ko‘rsatilsin, klaviaturada ishlasin, eski filtrlar saqlansin” yozing.'],
      ['Ishlangan misol: frontend qidiruvi','Sun’iy topshiriq: kurslar ro‘yxatida harf kattaligiga bog‘liq bo‘lmagan qidiruv va bo‘sh natija holati. Uch qabul misoli yozing: “GIS” tegishli kursni topadi; mavjud bo‘lmagan so‘rov izoh chiqaradi; qidiruvni tozalash ro‘yxatni qaytaradi. Agentga tegishli komponent va ishga tushirish buyrug‘ini bering. U avval mavjud xulqni ko‘radi, kichik o‘zgarish qiladi, uch holatni tekshiradi va qolgan cheklovni aytadi. Repository bo‘lmasa shu oqimni matnli simulyatsiyada tahlil qiling.'],
      ['Reja, ijro, tekshiruv','Murakkab ishga qisqa bosqichlar foydali; bitta matn xatosiga katta reja shart emas. Har qadamni qo‘lda buyurish o‘rniga yakuniy shartni aniqlang. Agentning “test o‘tdi” xabarida qaysi test va natija borligini ko‘ring. Bitta muvaffaqiyatli ekran hamma holatni qamramaydi. Cheksiz qayta urinish o‘rniga bir xil xato yangi dalilsiz takrorlansa, sabab, qilingan urinish va keyingi zarur ma’lumotni qayd etsin.'],
      ['Kontekstni topshirish','Faqat ishga tegishli fayl va xato bo‘lagini bering; butun repository yoki uzun eski chatni qayta ko‘chirmang. Qarorlar, muhim cheklovlar va fayl manzillarini qisqa saqlang. Uzoq ishda checkpoint: bajarilgan qism, dalil, qolgan ish, keyingi qadam. Summary’da yo‘q faktni o‘ylab to‘ldirish o‘rniga asl manbani qayta tekshirish kerak.'],
      ['Ruxsat va topshirish','Lokal qaytariladigan tahrir uchun aniq vakolat agentning keraksiz to‘xtashini kamaytiradi. Publish, xabar yuborish yoki ma’lumot o‘chirish kabi tashqi ta’sirli qadamlarni scope’da belgilang. Skill, plugin yoki AGENTS.md ko‘rsatmalari qisqa va shu ishga mos bo‘lsin; ular haqiqiy vosita ruxsati o‘rnini bosmaydi. Yakunda o‘zgargan fayl, tekshiruv va ochiq masalani so‘rang, yashirin fikrlash jarayonini talab qilish shart emas.'],
    ],`Maqsad: [foydalanuvchiga ko‘rinadigan aniq natija].
Kontekst: [tegishli fayl/havola, xato va qayta yaratish qadamlari].
Scope: [o‘zgaradigan qism]; saqlansin: [muhim mavjud xulq].
Vakolat: lokal tahrir va kerakli tekshiruvlarni bajarish mumkin.
Tashqi amal: [publish/xabar/o‘chirish uchun berilgan yoki berilmagan vakolat].
Qabul misollari:
1. [odatiy input → expected]
2. [bo‘sh yoki xato input → expected]
3. [eski xulq saqlanishi]
Kerakli ma’lumotni topib ishni yakunla, tegishli tekshiruvni bajar.
Bir xil urinish yangi dalilsiz takrorlansa sabab va yetishmayotgan ma’lumotni ko‘rsat.
Yakun: o‘zgargan fayllar, test natijasi, cheklov va keyingi zarur qadam.`,
    ['Noaniq talabni besh qismli agent briefga aylantirdim','Uchta kuzatiladigan qabul misoli yozdim','Agent ijrosi yoki simulyatsiyasini aniq belgiladim','Natijani manba va tekshiruv bilan baholadim','Bajarilgan va qolgan ish uchun checkpoint tayyorladim'],[
      q('Agent “tayyor” dedi, lekin test yoki fayl o‘zgarishi ko‘rsatilmagan. Nima yetishmaydi?',['Ko‘proq ishonchli ohang','Qabul mezoniga mos ijro dalili','Boshqa persona','Uzunroq yakun'],1,'Bajarilgan ish kuzatiladigan natija bilan tasdiqlanadi.'),
      q('Bitta yorliq xatosini tuzatishga qanday kontekst yetarli?',['Barcha eski suhbatlar','Butun fayl tizimi','Tegishli joy, kerakli matn va tekshiruv','Hech qanday maqsad kerak emas'],2,'Kontekst hajmi vazifaga mos bo‘lsin.'),
      q('Agent testni bajara olmayapti: muhitda kerakli dastur yo‘q. To‘g‘ri yakun?',['Test o‘tdi deb yozish','Xatoni yashirish','Cheksiz qayta urinish','Bajarilgan qism, tekshirilmagan holat va kerakli muhitni aytish'],3,'Muhit cheklovi muvaffaqiyatli tekshiruv deb ko‘rsatilmaydi.'),
      q('Checkpoint nimani saqlaydi?',['Maqsad, qaror, dalil, qolgan ish va keyingi qadam','Faqat salomlashuv','Barcha oraliq log nusxasi','Faqat model nomi'],0,'Qisqa davom ettirish yozuvi qayta boshlash xarajatini kamaytiradi.'),
    ],[
      choice('“Dashboardni tuzat”ni tekshiriladigan topshiriqqa aylantiring.',['Yashil rangni ko‘paytir','Bo‘sh ro‘yxatda izoh chiqsin; 0 va 3 yozuv holatida tekshir','Ko‘proq agent chaqir'],1,'Expected xulq va tekshiruv inputlari aniq.'),
      choice('Agent lokal tahrirga vakolatli, publish haqida kelishilmagan. Qaysi yakun scope’ga mos?',['Tahrir va tekshiruvni tayyorlab, publish vakolatini aniqlash','Darhol public chiqarish','Hech qanday lokal ishni bajarmaslik'],0,'Tayyorlanishi mumkin bo‘lgan ishni yakunlang; tashqi amal vakolati alohida.'),
      {type:'gap',q:'Ishni boshqa sessiyada davom ettirish uchun qisqa holat yozuvi ___ deyiladi.',answers:['checkpoint'],why:'Maqsad, tekshirilgan holat va keyingi qadamni qoldiradi.'},
    ],[source('OpenAI: Agents','https://developers.openai.com/api/docs/guides/agents'),source('Kontekstga mos skills va topshiriqlar','https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra')],
    [['acceptance criteria','qabul mezonlari','Check the empty and normal states.'],['checkpoint','davom ettirish uchun holat yozuvi','Keep the decision and remaining work.'],['scope','ish chegarasi','Limit the change to the search component.']]),

  lesson('P-Budget','Limit ichida ko‘proq foydali ish qilish',
    'Kontekst, qayta urinish va ortiqcha chiqishni kamaytiring; sifatni saqlagan holda jami sarfni o‘lchang.',[
      ['Avval limit birligini aniqlang','Chatdagi xabar limiti, vaqt oynasidagi usage, API token/dollar va hosting krediti turli o‘lchovlar. Birini ikkinchisiga aniq aylantirib bo‘lmaydi. Hisobingizda qaysi birlik va reset vaqti ko‘rsatilishini tekshiring; kurs qat’iy tarif yoki “har prompt falon kredit” deb va’da bermaydi. Kontekst oynasi ham davriy foydalanish limiti bilan bir narsa emas.'],
      ['Eng foydali tejash — qayta ishlashni kamaytirish','Ish boshida aniq brief va qabul misoli berish noto‘g‘ri yo‘nalishga ketgan takrorlarni kamaytiradi. Xato logining tegishli qismini, kerakli fayl va avvalgi qarorni ko‘rsating. Agentdan har javobda butun faylni yoki oldingi rejasini takror chiqarishni talab qilmang; diff, tekshiruv va qolgan muammoning qisqa natijasi yetadi.'],
      ['Vazifaga mos vosita va model','Aniq arifmetikani kalkulyator yoki kod bilan, bir xil format o‘zgarishini oddiy skript bilan bajarish mumkin. Modelni uslub nomi yoki maksimal sozlama bo‘yicha emas, ayni vazifadagi qabul sinovi bo‘yicha tanlang. Oddiy ishga yengilroq variantni tekshirib ko‘ring; murakkab xatoda sifat yetishmasa kuchliroq variantga o‘ting. Qisqa javobning o‘zi kam jami token sarflanganini isbotlamaydi: vosita chaqiruvlari, qayta urinishlar va agentlar ishi ham bor.'],
      ['Kontekst va qayta foydalanish','Bir vazifada muhim qarorlarni saqlab davom eting; aloqasiz yangi ishga zarur checkpoint bilan toza kontekst ajratish mumkin. Har safar yangi chat ochish ham oldingi dalilni qayta o‘qitish xarajatini tug‘diradi. API caching’da qayta ishlatiladigan boshlang‘ich qism va modelga mos sozlama talab qilinadi; cache hitni usage dalilidan tekshiring. Cache xarajat/tezlikka yordam berishi mumkin, lekin rate limitni bekor qilmaydi. SkillMap ustaxonasida API cache boshqarilmaydi.'],
      ['Ishlangan hisob: sun’iy o‘quv natijasi','Bir xil 12 case: A oqimi jami 15 000 token, 20 daqiqa, 9/12 qabul; B oqimi 8 000 token, 15 daqiqa, 10/12 qabul. Token kamayishi (15000−8000)/15000 ≈ 46.7%. Qabul qilingan natija boshiga A: 15000/9 ≈ 1667 token; B: 8000/10 = 800. B shu sun’iy tajribada yaxshiroq. Bu real o‘quvchi natijasi yoki barcha ishlar uchun kafolat emas. Turli token turlarining narxi farq qilishi mumkin, shuning uchun token yig‘indisini to‘g‘ridan-to‘g‘ri pul tejash foizi deb yozmang.'],
      ['Budjet va to‘xtash qoidasi','Reja, bajarish, tekshirish va kutilmagan tuzatishga budjet qoldiring. Masalan o‘quv rejasida 20% aniqlash, 50% ijro, 20% tekshirish, 10% zaxira; bu universal optimal nisbat emas. Promptdagi “10 000 tokendan oshma” qattiq hisoblagich emas. Runtime qo‘llasa hard limit sozlang, aks holda kuzatilgan usage va vaqtni qayd eting. Qayta urinish bir xil xatoni takrorlasa sababni tahlil qiling; tekshiruvni o‘chirib muvaffaqiyat e’lon qilmang.'],
      ['Samaradorlikni isbotlash','Bir xil qabul mezoni va yangi mustaqil misollarda baseline/revisionni taqqoslang. Jadvalga barcha urinishlar, jami sarf, vaqt, qabul soni va jiddiy xatolarni kiriting. Usage ko‘rinmasa “noma’lum” yozing; xabar soni yoki matn uzunligidan token o‘ylab topmang. Kamroq sarf bilan ko‘proq xato chiqsa, bu sifatni saqlagan optimizatsiya emas.'],
    ],`Vazifa va qabul mezoni: [...]
Limit turi va manbasi: [token / vaqt / dollar / ilova usage / noma’lum]
Budjet: [...]; tekshiruv uchun ajratma: [...]
Faqat tegishli manba va fayllarni ko‘r. Mustaqil o‘qishlarni imkon bo‘lsa birlashtir.
O‘zgarishdan keyin kerakli tekshiruvlarni bajar; yangi sabab bo‘lmasa bir xil tekshiruvni takrorlama.
Yakun: qisqa natija, dalil, jami urinish, ochiq cheklov.

TAQQOSLASH JADVALI (o‘lchanmagan maydon = noma’lum)
variant | model/sozlama | case IDs | jami input/output/other usage | vaqt | qabul/jami | critical fail
A       |              |          |                              |      |            |
B       |              |          |                              |      |            |
Tejash = (A sarf - B sarf) / A sarf; A=0 bo‘lsa aniqlanmagan.
Bir qabul natijaga sarf = jami sarf / qabul soni; qabul=0 bo‘lsa aniqlanmagan.
Qaror: sifat mezoni bajarildimi, qaysi cheklov qoldi?`,
    ['Hisobimdagi limit birligi va manbasini aniqladim','Ortiqcha kontekst va qayta urinish sababini topdim','Qisqa brief va checkpoint bilan ikkinchi oqimni sinadim','Jami sarf, vaqt va sifatni bir xil mezonda solishtirdim','Tejash hisobini va to‘xtash qoidasini dalil bilan yozdim'],[
      q('B javobi ikki baravar qisqa. Usage’ni o‘lchamay “50% token tejadim” deyish mumkinmi?',['Ha, satrlar soni teng','Faqat shrift bir xil bo‘lsa','Yo‘q, jami hisoblangan sarf kerak','Har doim 50%'],2,'Chiqish uzunligi barcha input, reasoning, vosita va urinish sarfini ko‘rsatmaydi.'),
      q('10 000 dan 7 500 tokenga tushdi, sifat mezoni saqlandi. Token kamayishi?',['25%','75%','250%','Aniqlanmaydi'],0,'(10000−7500)/10000 = 0.25; bu avtomatik pul tejash foizi emas.'),
      q('Sarf kamaydi, critical fail paydo bo‘ldi. Qaror?',['Eng arzonini chiqarish','Xatoni o‘rtacha ball bilan yopish','Faqat tezlikka qarash','Sifat chegarasi buzilgan; tuzatish va qayta sinov'],3,'Samaradorlik talab qilingan sifat chegarasida o‘lchanadi.'),
      q('API cache ishladi. Endi barcha limit bekor bo‘ladimi?',['Ha, cache cheksiz','Yo‘q; tarif va rate limit qoidalari saqlanadi','Faqat kechasi','Faqat qisqa promptda'],1,'Caching quota yoki rate limitni olib tashlamaydi.'),
    ],[
      choice('Jami 6 000 token sarflandi, 3 natija qabul qilindi. Bir qabul natijaga sarf?',['500','18000','2000'],2,'6000/3=2000. Barcha urinish sarfi hisobga kirgan bo‘lsin.'),
      choice('Budjet tugashiga yaqin test yiqildi. Nima topshiriladi?',['Tayyor deb belgilanadi','Checkpoint, yiqilgan test va qolgan ish','Dalil o‘chiriladi'],1,'Tugallanmagan holat va keyingi qadam halol saqlanadi.'),
      {type:'gap',q:'8 000 tokendan 6 000 ga kamayish ___ foiz.',answers:['25','25%'],why:'(8000−6000)/8000×100=25%; sifat alohida tekshiriladi.'},
    ],[source('Kontekstni vazifaga mos saqlash','https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra'),source('Prompt caching: moslik va cheklovlar','https://developers.openai.com/api/docs/guides/prompt-caching')],
    [['budget','ajratilgan resurs chegarasi','Reserve time for verification.'],['retry','qayta urinish','Count failed retries in total usage.'],['cost per accepted result','qabul qilingan natija boshiga sarf','Divide total usage by accepted results.']]),

  lesson('P-Team','Bir nechta agent: taqsimlash, handoff va birlashtirish',
    'Mustaqil ishlarni ajrating; umumiy fayllardagi to‘qnashuv va ortiqcha sarfni nazorat qiling.',[
      ['Bir agent qachon yetarli?','Kichik, ketma-ket bog‘langan yoki bitta faylda bajariladigan ishni bitta agentga bering. Masalan schema tanlanmasdan integratsiyani boshlash qayta ishlash keltirishi mumkin. Ko‘p agent faqat soni uchun sifat bermaydi. Har agentning konteksti, takroriy o‘qishi va natijani birlashtirish sarfi bor.'],
      ['Mustaqillikni tekshirish','Parallel ish uchun savol: birining natijasini kutmasdan ikkinchisi foydali ish qila oladimi? Tayyor contract bo‘lsa turli komponentlarga mas’ul agentlar ajralishi mumkin. Bir xil faylni tahrirlashga yubormang; alohida scope yoki izolyatsiya, so‘ng birlashtirish egasi belgilang. Tahlil va manba tekshirishni parallel qilish ba’zan yozuvchi agentlarni ko‘paytirishdan osonroq.'],
      ['Ishlangan misol: kurs qidiruvi','Koordinator qabul mezonini belgilaydi. Agent A faqat qidiruv xulqidagi edge case’larni o‘qib tahlil qiladi. Agent B faqat accessibility tekshiruvini o‘qib bajaradi. Ikkalasi ham bir xil komponentga yozmaydi. Koordinator topilmalarni dalil bilan saralab tahrir qiladi va birlashtirilgan holatni sinaydi. 1 daqiqalik yorliq tahriri uchun bunday taqsimotning o‘zi ortiqcha bo‘lishi mumkin.'],
      ['Handoff — natijani topshirish','Har topshiriqda maqsad, kirish, scope, chiqish formati va stop condition bo‘lsin. Javobda xulosa, fayl/qator yoki manba, bajarilgan tekshiruv, noaniqlik va qolgan ishni so‘rang. Koordinator subagentning “pass” xabarini avtomatik tasdiq deb olmaydi. Ikki agent rozi bo‘lishi mustaqil dalil bo‘lmasligi mumkin: ikkalasi bir xato manbadan foydalangan bo‘lishi ehtimol.'],
      ['Birlashtirish va to‘qnashuv','Integratsiya uchun bitta mas’ul bo‘lsin. Natijalarni qabul mezoniga solishtiring, ziddiyatli taxminlarni aniqlang, keyin umumiy regression testni bajaring. A va B alohida o‘tgan test ularning birga ishlashini isbotlamaydi. Scope o‘zgarsa boshqa agentga xabar va aniq yangi chegara kerak; qayta-qayta bir ishni ikki agentga berishdan saqlaning.'],
      ['Vaqt va jami sarf boshqa metrika','Sun’iy o‘quv misoli: bitta agent 18 daqiqa, 10 000 token; parallel oqim 12 daqiqa, koordinator bilan jami 16 000 token. Vaqt 33.3% kamaygan, token esa 60% oshgan. Deadline muhim bo‘lsa foydali bo‘lishi mumkin; qattiq token budjetida bitta agent yaxshi tanlov. Yakuniy sifat bir xil mezonda tekshirilmaguncha bu oqimlar teng deb olinmaydi.'],
      ['Frontendda amaliyot','Agent vositasi bo‘lsa bir agentli va bo‘lingan oqimni alohida nusxalarda sinang. Bo‘lmasa uch rolni matnda simulyatsiya qiling va real multi-agent run deb ko‘rsatmang. Brief, A/B handoff, integratsiya qarori, qabul natijasi va jami sarfni Mustaqil ish daftarida saqlang. SkillMap ichida yangi agent, hisob yoki server ishga tushirish talab qilinmaydi.'],
    ],`KOORDINATOR
Yakuniy natija va qabul mezoni: [...]
Mustaqil ishlar: [...]; bog‘liqliklar: [...]
Birlashtirish egasi: [...]
Jami budjet: [...]; agentlar va integratsiya sarfi ham hisoblansin.

AGENT A / AGENT B TOPSHIRIG‘I
Maqsad: [...]
Kirish manbalari: [...]
Faqat shu scope: [...]
O‘qish/tahrirlash vakolati: [...]; boshqa agent egaligidagi faylga yozmang.
To‘xtash: qabul mezoni bajarildi yoki yangi dalilsiz blocker takrorlandi.
Handoff: xulosa | dalil | tekshiruv | noaniqlik | qolgan ish.

BIRLASHTIRISH
Ziddiyatlar va qaror: [...]
Birlashtirilgan holatdagi test: [...]
Jami sarf va elapsed vaqt: [... yoki noma’lum]
Bir agentli baseline bilan farq: [sifat, vaqt, sarf].`,
    ['Vazifalarni mustaqil va bog‘liq qismlarga ajratdim','Har agent uchun takrorlanmaydigan scope yozdim','Dalilli handoff va integratsiya egasini belgiladim','Birlashtirilgan natijada regressionni tekshirdim','Bir agentli va parallel oqimning jami sarfini taqqosladim'],[
      q('Ikki agent bir faylning bir xil qismini tahrirlamoqchi. Eng yaxshi boshlanish?',['Scope va bitta integratsiya egasini belgilash','Kim tez tugatsa shuni olish','Ikkalasiga to‘liq vakolat berish','Tekshiruvni olib tashlash'],0,'Parallelizm konflikt va noto‘g‘ri birlashtirish xarajatini oshirmasin.'),
      q('Parallel oqim tezroq, lekin 60% ko‘proq token ishlatdi. Bu nima?',['Har doim yomon','Har doim tejamkor','Vaqt va sarf o‘rtasidagi tanlov; sifat va budjet bilan baholanadi','Token o‘lchovi bekor'],2,'Elapsed vaqt qisqarishi jami sarf kamayganini bildirmaydi.'),
      q('Ikki agent bir xil dalilsiz faktga rozi. To‘g‘ri qaror?',['Ovoz ko‘pligi haqiqat','Uchinchi rozilik yetarli','Manbani tekshirish shart emas','Asl manba yoki mustaqil test bilan tekshirish'],3,'Agentlar kelishuvi fakt tekshiruvi o‘rnini bosmaydi.'),
      q('A va B alohida testdan o‘tdi. Merge’dan keyin nima kerak?',['Hech narsa','Umumiy qabul va integratsiya tekshiruvi','Faqat nomlarni almashtirish','Yangi agentlarni cheksiz chaqirish'],1,'Mustaqil qismlar umumiy holatda bir-biriga ta’sir qilishi mumkin.'),
    ],[
      choice('Qaysi juftlik parallel o‘qish tahliliga mos?',['Schema qarori → o‘sha schema implementatsiyasi','Bitta fayldagi bir xil satrni ikki marta tahrirlash','Tayyor ekran uchun accessibility va alohida edge-case tahlili'],2,'Kirish tayyor va scope ajralgan; natijalar keyin birlashtiriladi.'),
      choice('A 5000, B 4000, koordinator 3000 token sarfladi. Jami?',['12000','5000','9000'],0,'Koordinator sarfi ham budjetga kiradi.'),
      {type:'gap',q:'Agentdan keyingi ijrochiga dalilli natija topshirish ___ deyiladi.',answers:['handoff','hand-off'],why:'Xulosa bilan birga dalil, test va qolgan ishni topshiring.'},
    ],[source('OpenAI: multi-agent va umumiy sarf','https://developers.openai.com/api/docs/guides/deployment-checklist')],
    [['handoff','natija va holatni topshirish','Include evidence and unresolved questions.'],['dependency','boshqa natijaga bog‘liqlik','Wait for the contract before implementation.'],['integration','alohida natijalarni birlashtirish','Test the combined result.']]),
];
