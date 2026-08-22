export const GIRLFRIEND_JOBS = [
  {
    heroineId:"haeun", id:"financial-planner", name:"재무기획자", workplace:"여의도 자산관리사", incomeRange:[4200000,5600000],
    workPattern:"평일 09:00~18:00 · 월말 결산", busyPhases:[1], busyDays:[10,20,30], availabilityMultiplier:0.72,
    careerGoal:"고객의 삶까지 지키는 장기 자산 전략가", workTags:["재무","계획","안정","숫자"],
    perkName:"계획적인 연애", perkDescription:"비싼 데이트보다 예산과 약속이 분명한 계획을 선호한다.",
    messageLine:"오늘 결산이 길어질 것 같아. 끝나면 내가 먼저 연락할게."
  },
  {
    heroineId:"nari", id:"florist", name:"플로리스트", workplace:"연남동 플라워 스튜디오", incomeRange:[2400000,3600000],
    workPattern:"오전 작업 · 주말 예약 집중", busyPhases:[0,1], busyDays:[6,7,13,14,20,21,27,28], availabilityMultiplier:0.8,
    careerGoal:"자신의 이름을 건 작은 꽃 작업실 운영", workTags:["꽃","공방","기념일","감성"],
    perkName:"기념일 감각", perkDescription:"기념일과 작은 선물에 민감하며 정성 어린 표현에 크게 반응한다.",
    messageLine:"오늘 작업한 꽃이 네 생각이 나서 사진 찍어 뒀어. 이따 보여 줄게."
  },
  {
    heroineId:"sejin", id:"strategy-consultant", name:"전략 컨설턴트", workplace:"글로벌 컨설팅 펌", incomeRange:[6800000,9200000],
    workPattern:"프로젝트제 · 야근과 출장이 잦음", busyPhases:[1,2], busyDays:[5,10,15,20,25,30], availabilityMultiplier:0.62,
    careerGoal:"파트너 승진과 독립 컨설팅 브랜드 설립", workTags:["전략","프레젠테이션","출장","성과"],
    perkName:"성과 중심", perkDescription:"바쁜 일정에서도 약속의 이유와 상대의 성장 의지를 중요하게 본다.",
    messageLine:"클라이언트 미팅이 길어지고 있어. 애매하게 기다리게 하진 않을게."
  },
  {
    heroineId:"ara", id:"travel-photographer", name:"여행 사진가", workplace:"프리랜스 · 국내외 로케이션", incomeRange:[1800000,7800000],
    workPattern:"촬영 일정에 따라 유동적", busyPhases:[0,1], busyDays:[4,9,14,19,24,29], availabilityMultiplier:0.68,
    careerGoal:"사라지는 풍경과 사람을 기록하는 사진집 출간", workTags:["여행","사진","로케이션","자유"],
    perkName:"유동적인 일정", perkDescription:"갑작스러운 촬영이 생기지만 즉흥 데이트와 새로운 장소에 강하다.",
    messageLine:"빛이 좋아서 촬영이 조금 길어졌어. 끝나고 멋진 곳 하나 알려 줄게."
  },
  {
    heroineId:"yuri", id:"book-conservator", name:"고서 복원가", workplace:"시립 기록문화 보존소", incomeRange:[3300000,4700000],
    workPattern:"평일 09:30~18:30 · 집중 복원 작업", busyPhases:[1], busyDays:[8,16,24], availabilityMultiplier:0.76,
    careerGoal:"훼손된 개인 기록을 되살리는 독립 복원실 설립", workTags:["고서","복원","기록","집중"],
    perkName:"기록의 가치", perkDescription:"말보다 오래 남는 기억과 약속을 소중히 여긴다.",
    messageLine:"오늘은 손을 뗄 수 없는 복원 작업이 있어. 끝나면 천천히 이야기하자."
  },
  {
    heroineId:"yuna", id:"high-school-senior", name:"고등학교 3학년", workplace:"한빛고등학교 · 입시 학원", incomeRange:[0,0],
    workPattern:"수업 · 방과 후 자습 · 학원", busyPhases:[0,1], busyDays:[7,14,21,28], availabilityMultiplier:0.7,
    careerGoal:"좋아하는 일을 찾고 스스로 진로를 선택하기", workTags:["학교","시험","진로","방과 후"],
    perkName:"풋풋한 성장", perkDescription:"비싼 소비보다 방과 후의 짧은 만남과 응원을 중요하게 여긴다.",
    messageLine:"지금 자습 중이야. 끝나면 답장할게! 너무 늦게까지 기다리진 마."
  }
];

export function getGirlfriendJob(heroineId) {
  return GIRLFRIEND_JOBS.find((career)=>career.heroineId===heroineId) ?? null;
}

export function createGirlfriendCareer(heroineId) {
  const career=getGirlfriendJob(heroineId);
  return career ? structuredClone(career) : null;
}

export function migrateGirlfriendCareer(partner) {
  const template=createGirlfriendCareer(partner?.heroineId);
  if (!template) return null;
  partner.career={...template,...(partner.career??{}),incomeRange:[...(partner.career?.incomeRange??template.incomeRange)],busyPhases:[...(partner.career?.busyPhases??template.busyPhases)],busyDays:[...(partner.career?.busyDays??template.busyDays)],workTags:[...(partner.career?.workTags??template.workTags)]};
  partner.job=partner.career.name;
  return partner.career;
}

export function getGirlfriendCareerAvailability(state) {
  const career=state.partner?.career ?? createGirlfriendCareer(state.partner?.heroineId);
  if (!career) return {available:true,multiplier:1,busy:false,reason:""};
  const busy=career.busyPhases.includes(state.phase) || career.busyDays.includes(state.day);
  return {available:!busy,multiplier:busy?career.availabilityMultiplier:1,busy,reason:busy?career.workPattern:"일정 여유"};
}

export function validateGirlfriendCareer(career) {
  return Boolean(career) && ["heroineId","id","name","workplace","workPattern","careerGoal","perkName","perkDescription","messageLine"].every((key)=>typeof career[key]==="string"&&career[key].length>0) &&
    Array.isArray(career.incomeRange) && career.incomeRange.length===2 && career.incomeRange.every((value)=>Number.isFinite(value)&&value>=0) && career.incomeRange[0]<=career.incomeRange[1] &&
    Array.isArray(career.busyPhases) && career.busyPhases.every((value)=>Number.isInteger(value)&&value>=0&&value<=3) && Array.isArray(career.busyDays) && career.busyDays.every((value)=>Number.isInteger(value)&&value>=1&&value<=30) &&
    Number.isFinite(career.availabilityMultiplier) && career.availabilityMultiplier>0 && career.availabilityMultiplier<=1 && Array.isArray(career.workTags) && career.workTags.length>=3;
}
