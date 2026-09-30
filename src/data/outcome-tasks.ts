import protocol from './outcome-protocol.json';
export const OUTCOME_PROTOCOL = protocol.version;
export const OUTCOME_TASKS:Record<string,[string,string]>=Object.fromEntries(Object.entries(protocol.tasks).map(([course,forms])=>[course,[forms[0],forms[1]] as [string,string]]));
export const OUTCOME_RUBRIC={correctness:'Natija to‘g‘riligi',reasoning:'Sababni tushuntirish',transfer:'Yangi shart va xato holati',evidence:'Tekshiriladigan dalil'};
