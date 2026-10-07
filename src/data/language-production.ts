import type { Exercise, Module } from '../types';
const gap=(q:string,answers:string[],why:string):Exercise=>({type:'gap',q,answers,why});
const speak=(q:string,say:string,lang:string):Exercise=>({type:'speak',q,say,lang,why:'Brauzer transkripti talaffuz yoki til darajasi bahosi emas. Recordingni ustoz bilan solishtiring, keyin boshqa gapni yordamsiz tuzing.'});
const RU:Record<string,Exercise[]>={
  'А1':[
    gap('Я ___ в Ташкенте. (жить, hozirgi zamon)',['живу'],'Я bilan жить → живу. Siz yashamaydigan joyni o‘zingiz haqingizda fakt deb aytmang.'),
    gap('Она ___ инженером. (работать)',['работает'],'Она работает; я работаю. Shaxs va fe’l oxiri mos.'),
    speak('Gapni ayting; keyin o‘zingiz haqingizda ikkita yangi gap tuzing.','Меня зовут Али. Я работаю с картами.','ru-RU'),
  ],
  'А2':[
    gap('Я работаю в ___. (офис, qayerda?)',['офисе'],'Где? в офисе — предложный.'),
    gap('Я иду в ___. (школа, qayerga?)',['школу'],'Куда? в школу — винительный.'),
    gap('Я возвращаюсь из ___. (школа)',['школы'],'Из + родительный: из школы.'),
    speak('Uch yo‘nalish savolini ayting, keyin магазин bilan javob bering.','Где вы работаете? Куда вы идёте? Откуда вы возвращаетесь?','ru-RU'),
  ],
  'Время':[
    gap('Вчера она ___ отчёт. (читать)',['читала'],'O‘tgan zamonda ayol birlik читала; bu gap tugaganlikni o‘zi tasdiqlamaydi.'),
    gap('Завтра мы ___ работать. (kelasi zamon yordamchisi)',['будем'],'Мы будем работать — davom etadigan ish rejasi.'),
    speak('Bugungi va kechagi ishni ayting; keyin o‘z misolingizni qo‘shing.','Сегодня я проверяю файл. Вчера я проверял карту.','ru-RU'),
  ],
  'Вид':[
    gap('Я ___ отчёт за два часа. (написать, erkak, tugatdim)',['написал'],'За два часа bilan ushbu kontekstda tugagan natija: написал.'),
    gap('Я ___ отчёт два часа, но не закончил. (писать, erkak)',['писал'],'Tugamagan jarayon: писал. Два часа davomiylikni bildiradi.'),
    gap('Завтра я ___ отчёт до конца. (прочитать)',['прочитаю'],'Прочитаю — kelajakda tugatish niyati, allaqachon bajarilgan fakt emas.'),
    speak('Savolga avval yo‘q, keyin ha javob bering; namunadan keyin yangi obyekt ishlating.','Вы уже прочитали отчёт? Пока нет, я ещё читаю.','ru-RU'),
  ],
  'Раб':[
    gap('Слой не ___. (загружаться, hozir)',['загружается'],'Не загружается — layer yuklanmayapti; “hammasi buzildi”dan aniqroq.'),
    gap('Мы ___ только слой дорог. (проверить, o‘tgan)',['проверили'],'Проверили — bajarilgan tekshiruv. Tekshirilmagan qatlamga umumlashtirmang.'),
    speak('Aniq clarification so‘rang, keyin fayl nomini o‘zgartirib ayting.','Уточните, пожалуйста, систему координат исходного файла.','ru-RU'),
  ],
  'RU12':[
    gap('Остальные слои ещё не ___. (проверить, tekshirilmagan)',['проверены'],'Проверены — qisqa majhul sifatdosh; hali tekshirilmaganlik chegarasi.'),
    gap('Пожалуйста, ___ публикацию слоя. (проверить, hurmatli buyruq)',['проверьте'],'Проверьте — aniq va muloyim action request.'),
    speak('Statusni ayting, keyin hamkorning yangi savoliga namunasiz javob bering.','Слой дорог возвращает ошибку. Остальные слои ещё не проверены.','ru-RU'),
  ],
};
const EN:Record<string,Exercise[]>={
  A1:[gap('She ___ maps every day. (check)',['checks'],'She/he/it + checks; odat.'),gap('Does she ___ maps? (check)',['check'],'Doesdan keyin asosiy fe’l o‘zgarmaydi.'),speak('Odat va hozirgi ishni farqlang; keyin o‘z misolingizni ayting.','I work on maps. Today I am checking a file.','en-US')],
  A2:[gap('Yesterday we ___ the map. (check)',['checked'],'Yesterday — tugagan o‘tgan vaqt; checked.'),gap('We have not ___ the deadline yet. (confirm)',['confirmed'],'Have not + participle; hali tasdiqlanmagan.'),speak('Bajarilgan ish va rejani ajrating.','We checked the file yesterday. We will review the results tomorrow.','en-US')],
  B1:[gap('The import is blocked ___ the source CRS is unknown.',['because'],'Because sababni bog‘laydi.'),speak('Fakt va unknownni ayting, keyin yangi blocker tanlang.','The import is blocked. We do not know the source CRS yet.','en-US')],
  B2:[gap('Friday is a proposal, not a ___ deadline. (confirm)',['confirmed'],'Taklif tasdiqlangan kelishuv emas.'),speak('Noaniqlikni muloyim aniqlashtiring; keyin kutilmagan savolga javob bering.','Could you clarify whether Friday is the agreed deadline?','en-US')],
};
export function addLanguageProduction(id:string,modules:Module[]):Module[]{
  const bank=id==='russian'?RU:id==='english'?EN:undefined;
  return bank?modules.map(m=>({...m,exercises:[...(m.exercises||[]),...(bank[m.zoom]||[])]})):modules;
}
