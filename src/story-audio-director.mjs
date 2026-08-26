export const STORY_AUDIO_PROFILES=Object.freeze({
  normal_daily:Object.freeze({category:"daily",volume:0.065,fadeInMs:1000,crossFadeMs:1200,choiceDuck:0.68}),
  romance_soft:Object.freeze({category:"dateShopping",volume:0.07,fadeInMs:1100,crossFadeMs:1500,choiceDuck:0.66}),
  romance_deep:Object.freeze({category:"theme",volume:0.072,fadeInMs:1200,crossFadeMs:1700,choiceDuck:0.62}),
  comedy:Object.freeze({category:"daily",volume:0.06,fadeInMs:800,crossFadeMs:1000,choiceDuck:0.72}),
  sad:Object.freeze({category:"theme",volume:0.052,fadeInMs:1400,crossFadeMs:1800,choiceDuck:0.58}),
  mystery_light:Object.freeze({category:"theme",volume:0.055,fadeInMs:1200,crossFadeMs:1600,choiceDuck:0.6}),
  mystery_dark:Object.freeze({category:"crisis",volume:0.05,fadeInMs:1400,crossFadeMs:1800,choiceDuck:0.55}),
  tension:Object.freeze({category:"crisis",volume:0.058,fadeInMs:900,crossFadeMs:1300,choiceDuck:0.55}),
  memory_minor:Object.freeze({category:"theme",volume:0.054,fadeInMs:1200,crossFadeMs:1500,choiceDuck:0.58}),
  memory_medium:Object.freeze({category:"theme",volume:0.047,fadeInMs:1400,crossFadeMs:1800,choiceDuck:0.52}),
  memory_major:Object.freeze({category:"crisis",volume:0.043,fadeInMs:1500,crossFadeMs:2000,choiceDuck:0.48}),
  climax:Object.freeze({category:"ending",volume:0.068,fadeInMs:1200,crossFadeMs:1800,choiceDuck:0.58}),
  ending_day:Object.freeze({category:"ending",volume:0.06,fadeInMs:1200,crossFadeMs:1700,choiceDuck:0.65})
});

const DAY_TITLES=[
  "눈을 뜨다","병원 밖으로","퇴원 뒤 첫 연락","사라진 1년의 흔적","회사 문턱","동네 생활 반경","첫 현재형 데이트","혼자 할 것, 같이 할 것","두 번째 출근","세 시간 업무 리듬",
  "현재 생활표","현재 계정의 주인","합의된 만큼만 공동","지금 고르는 것","오늘의 여가","한 명씩 다시","지금의 몸","안전하게 사는 집","같이 사는 연습","오늘 함께 먹는 것",
  "하루를 끝까지 일하는 법","아무것도 증명하지 않는 날","가족도 현재형으로 다시","약속을 다시 선택하는 날","우리에게 필요한 결혼의 범위","서명보다 먼저 확인할 것","멈출 수 있는 최종 점검","멈추는 연습도 리허설","내일을 확정하지 않는 전날","오늘의 우리가 고르는 결말"
];
const DAY_PROFILES=[
  "mystery_light","normal_daily","normal_daily","memory_medium","normal_daily","romance_soft","romance_deep","normal_daily","normal_daily","normal_daily",
  "normal_daily","normal_daily","normal_daily","comedy","romance_deep","normal_daily","normal_daily","normal_daily","comedy","romance_soft",
  "tension","sad","memory_minor","romance_deep","climax","tension","climax","romance_soft","climax","ending_day"
];

export const DAY_STORY_AUDIO=Object.freeze(Object.fromEntries(DAY_TITLES.map((title,index)=>[index+1,Object.freeze({day:index+1,title,profile:DAY_PROFILES[index],variant:(index+1)%2})])));

const BACKGROUND_AMBIENCE=Object.freeze({
  "day1-hospital-ceiling":"AMB_HOSPITAL_ROOM_DAY","day1-hospital-bedside":"AMB_HOSPITAL_ROOM_DAY","hospital-room":"AMB_HOSPITAL_ROOM_DAY",
  "day2-hospital-corridor":"AMB_HOSPITAL_CORRIDOR_DAY","day2-hospital-lobby":"AMB_HOSPITAL_LOBBY_DAY","day2-car-interior":"AMB_CAR_INTERIOR_DAY",
  "home-morning":"AMB_HOME_QUIET_AFTERNOON","day2-home-entry":"AMB_HOME_QUIET_AFTERNOON"
});

function profileFromContext({day,label="",bgmId=""}){
  const text=String(label).toLowerCase();
  if(/day\s*\d+\s*end|마무리|엔딩/.test(text))return "ending_day";
  if(/부모|장례|눈물|상실|아무것도 증명/.test(text))return "sad";
  if(/기억|사고|사진|과거|흔적|1년/.test(text))return day===1?"memory_major":day<=4?"memory_medium":"memory_minor";
  if(/데이트|결혼|약속|우리|여가|리허설/.test(text))return day>=24?"romance_deep":"romance_soft";
  if(/농담|장난|면접|고르는 것|같이 사는 연습/.test(text))return "comedy";
  if(/최종|서명|권한 밖|긴급|전일 근무/.test(text))return "tension";
  if(bgmId==="crisis")return "mystery_dark";
  if(bgmId==="dateShopping")return "romance_soft";
  return DAY_STORY_AUDIO[day]?.profile??"normal_daily";
}

export function getStoryAmbientId(backgroundId=""){
  if(BACKGROUND_AMBIENCE[backgroundId])return BACKGROUND_AMBIENCE[backgroundId];
  if(String(backgroundId).includes("hospital"))return "AMB_HOSPITAL_ROOM_DAY";
  if(String(backgroundId).includes("home"))return "AMB_HOME_QUIET_AFTERNOON";
  return null;
}

function getContextualSfx(day,label=""){
  if(day<13)return [];
  const text=String(label);
  if(/귀가|현관|집으로/.test(text))return ["SFX_HOME_KEY_UNLOCK"];
  if(/카페|점심|식사/.test(text))return ["SFX_CUP_SET_DOWN"];
  if(/산책|거리|공원|이동/.test(text))return ["SFX_FOOTSTEP_APPROACH"];
  if(/회사|출입|문턱|근무/.test(text))return ["SFX_AUTO_DOOR"];
  if(/연락|휴대폰|전화|공유/.test(text))return ["SFX_SPARE_PHONE_KEY"];
  if(/계정|명세|예산|서명|계획|기록|검토|표|확인/.test(text))return ["SFX_PENCIL_NOTE"];
  return [];
}

export function resolveStoryAudioCue({day=1,sceneId="",label="",backgroundId="",bgmId=""}={}){
  const profileId=profileFromContext({day,label,bgmId});
  const profile=STORY_AUDIO_PROFILES[profileId]??STORY_AUDIO_PROFILES.normal_daily;
  const dayCue=DAY_STORY_AUDIO[day]??DAY_STORY_AUDIO[1];
  return Object.freeze({sceneId,day,profileId,category:profile.category,variant:(dayCue.variant+(profileId.length%2))%2,volume:profile.volume,fadeInMs:profile.fadeInMs,crossFadeMs:profile.crossFadeMs,choiceDuck:profile.choiceDuck,ambientId:getStoryAmbientId(backgroundId),sfxIds:getContextualSfx(day,label)});
}

export function getDaySoundCueSheet(){return Object.values(DAY_STORY_AUDIO).map(cue=>({...cue,...STORY_AUDIO_PROFILES[cue.profile]}));}
export function validateStoryAudioDirector(){
  const days=Object.values(DAY_STORY_AUDIO);
  return days.length===30&&days.every((cue,index)=>cue.day===index+1&&typeof cue.title==="string"&&STORY_AUDIO_PROFILES[cue.profile])&&
    Object.values(STORY_AUDIO_PROFILES).every(profile=>["daily","theme","dateShopping","crisis","ending"].includes(profile.category)&&profile.volume>=0.04&&profile.volume<=0.08&&profile.fadeInMs>=800&&profile.crossFadeMs>=1000);
}
