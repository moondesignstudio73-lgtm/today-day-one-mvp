import { applyEffects } from "./game-core.mjs";
import { analyzeRelationshipState } from "./dynamic-story-director.mjs";
import { EVENT_DEFINITIONS } from "./events-data.mjs";
import { MICRO_EVENTS } from "./micro-event-manager.mjs";
import { activateSituationEvent } from "./situation-event-manager.mjs";

export const FREE_MODE_EVENT_CATALOG=Object.freeze([...EVENT_DEFINITIONS,...MICRO_EVENTS]);

const DAY2_HOME_CHECK_IN=Object.freeze({
  id:"context-day2-home-haeun-check-in",title:"예비폰으로 온 안부",category:"romance",categoryLabel:"스토리 공용 이벤트",
  hook:"현관문이 닫힌 뒤, 하은과 병원 번호만 저장된 예비폰이 짧게 울렸다.",
  message:"하은이 문을 잠갔는지와 어지럼은 없는지만 확인해 달라고 했다.",question:"첫 저녁의 안전 확인을 어떻게 남길까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[2,2],heroineIds:["haeun"],
  relationshipStates:["DISTANT","RECOVERING","STABLE","HONEYMOON","PASSIONATE"],requiredFeatures:["haeun-contact"],requiredStoryFlags:["day2RuntimeComplete"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:200,baseWeight:100,tensionLevel:"low",effects:{trust:1},
  storyFlag:"context-day2-home-haeun-check-in:COMPLETED",forbiddenFlags:["context-day2-home-haeun-check-in:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},
  presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day2-home-haeun-check-in-scene",title:"예비폰으로 온 안부",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"soft",timeOfDay:"evening",weather:"sunny",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"예비폰 화면에는 ‘이하은’과 병원 번호만 있었다. 새 메시지는 하은에게서 왔다."},
    {type:"dialogue",speaker:"하은",text:"문 잠갔어? 어지럽거나 숨찬 건 없고? 답은 짧게 해도 돼.",expressionId:"worried"},
    {type:"dialogue",speaker:"나",text:"문은 잠갔고, 지금은 괜찮아. 오늘 확인한 것만 정리하고 쉴게."},
    {type:"dialogue",speaker:"하은",text:"좋아. 이상하면 나보다 병원 먼저. 그 순서만 지켜 줘.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"연락처가 적은 예비폰은 불편했지만, 지금 필요한 경계는 분명했다."}
  ]}],
  choices:[
    {id:"confirm-and-rest",label:"현재 증상만 답하고 바로 쉰다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,health:2,stress:-3},response:"필요한 사실만 확인한 답이 서로의 안전 기준이 되었다.",flag:"context-day2-home-haeun-check-in:REST",memory:"DAY 2 첫 저녁에 하은과 증상·연락 순서를 확인하고 쉬었다.",futureEventWeights:{recovery:1.15}},
    {id:"share-checklist",label:"문·약·비상 연락 순서를 체크리스트로 공유한다",preferenceTags:["PLANNED","LOGICAL"],effects:{trust:7,confidence:2},response:"짧은 체크리스트가 감시가 아니라 합의된 안전장치로 남았다.",flag:"context-day2-home-haeun-check-in:CHECKLIST",memory:"DAY 2 첫 저녁의 안전 확인 순서를 하은과 체크리스트로 합의했다.",futureEventWeights:{recovery:1.2}}
  ],futureEventWeights:{romance:1.05},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY3_DISCHARGE_CHECK=Object.freeze({
  id:"context-day3-discharge-safety-check",title:"마지막 퇴원 확인",category:"health",categoryLabel:"스토리 공용 이벤트",
  hook:"복구한 휴대폰에 병원 안내 알림이 한 건 도착했다.",message:"퇴원 창구에서 복약·외래·비상 연락 확인을 완료해 달라는 안내가 왔다.",question:"병원을 나서기 전 무엇을 마지막 기준으로 남길까?",
  allowedLocations:["hospital"],allowedPhases:["day"],dayRange:[3,3],heroineIds:["haeun"],
  requiredFeatures:["smartphone-basic"],requiredStoryFlags:["day3RuntimeComplete"],cooldown:30,maxTriggerCount:1,probability:.35,priority:210,baseWeight:100,tensionLevel:"low",effects:{health:1},
  storyFlag:"context-day3-discharge-safety-check:COMPLETED",forbiddenFlags:["context-day3-discharge-safety-check:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-hospital-lobby-day-v1.png",result:"assets/backgrounds/day2/day2-hospital-exit-day-v1.png",status:"ready"},
  presentation:{backgroundId:"day2-hospital-lobby",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day3-discharge-safety-check-scene",title:"마지막 퇴원 확인",backgroundId:"day2-hospital-lobby",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"daylight",timeOfDay:"day",weather:"sunny",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"병실을 나서기 직전, 복구한 휴대폰에 병원 안내 알림이 한 건 도착했다."},
    {type:"dialogue",speaker:"하은",text:"과거 알림은 안 열어도 돼. 지금 온 퇴원 확인만 같이 볼까?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"약, 외래 일정, 이상 증상 연락 순서. 이 세 가지만 확인할게."},
    {type:"dialogue",speaker:"하은",text:"좋아. 이동 중에는 네가 상태를 말하고, 나는 속도만 맞출게.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"휴대폰은 과거를 한꺼번에 여는 열쇠가 아니라, 오늘의 안전을 기록하는 도구가 되었다."}
  ]}],
  choices:[
    {id:"save-hospital-first",label:"병원 번호를 첫 비상 연락처로 고정한다",preferenceTags:["PRACTICAL","BOUNDARY"],effects:{health:3,trust:4,stress:-2},response:"증상이 생기면 병원부터 연락한다는 순서를 둘이 다시 확인했다.",flag:"context-day3-discharge-safety-check:HOSPITAL_FIRST",memory:"DAY 3 퇴원 전 병원 우선 연락 원칙을 휴대폰에 남겼다.",futureEventWeights:{recovery:1.2}},
    {id:"save-rest-threshold",label:"이동 중 멈출 증상 기준을 메모한다",preferenceTags:["PLANNED","LOGICAL"],effects:{confidence:4,health:2,trust:3},response:"어지럼과 새 통증이 생기면 즉시 멈춘다는 기준을 메모에 남겼다.",flag:"context-day3-discharge-safety-check:REST_THRESHOLD",memory:"DAY 3 귀가 중 멈춰야 할 증상 기준을 하은과 합의했다.",futureEventWeights:{recovery:1.15}}
  ],futureEventWeights:{health:1.1},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY4_HOME_LEDGER_REVIEW=Object.freeze({
  id:"context-day4-home-ledger-review",title:"세 칸의 빈자리",category:"romance",categoryLabel:"스토리 공용 이벤트",
  hook:"하은이 돌아가기 전, 증언 장부의 비어 있는 한 칸을 가리켰다.",message:"확인되지 않은 말을 어디까지 함께 보관할지 정해야 했다.",question:"오늘의 마지막 기록을 어떤 방식으로 남길까?",
  allowedLocations:["home"],allowedPhases:["night"],dayRange:[4,4],heroineIds:["haeun"],requiredFeatures:["testimony-ledger"],requiredStoryFlags:["day4RuntimeComplete"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:220,baseWeight:100,tensionLevel:"low",effects:{trust:1},
  storyFlag:"context-day4-home-ledger-review:COMPLETED",forbiddenFlags:["context-day4-home-ledger-review:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/home/BG_HOME_NIGHT_001.webp",result:"assets/backgrounds/home/BG_HOME_NIGHT_001.webp",status:"ready"},
  presentation:{backgroundId:"home-night",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day4-home-ledger-review-scene",title:"세 칸의 빈자리",backgroundId:"home-night",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"night",timeOfDay:"night",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"하은이 돌아가기 전, 증언 장부의 ‘미확인’ 칸에서 펜을 멈췄다."},
    {type:"dialogue",speaker:"하은",text:"여기 적힌 말들, 내가 아는 내용으로 채우지 않는 게 맞지?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"응. 겹치는 사실은 표시하되 빈칸을 없애려고 하지는 말자."},
    {type:"dialogue",speaker:"하은",text:"좋아. 모르는 걸 같이 견디는 것도 지금 우리 방식으로 할게.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"장부의 빈칸은 실패가 아니라, 다음 확인 전까지 지켜야 할 경계로 남았다."}
  ]}],
  choices:[
    {id:"mark-shared-facts",label:"둘이 직접 확인한 사실에만 공동 표시한다",preferenceTags:["BOUNDARY","LOGICAL"],effects:{trust:6,confidence:3,stress:-2},response:"같이 확인한 사실에만 작은 표시를 남기고 나머지는 각자의 기억으로 두었다.",flag:"context-day4-home-ledger-review:SHARED_FACTS",memory:"DAY 4 밤, 하은과 직접 확인한 사실만 증언 장부에 공동 표시했다.",futureEventWeights:{investigation:1.2}},
    {id:"close-ledger-together",label:"미확인 칸은 그대로 두고 함께 장부를 덮는다",preferenceTags:["EMPATHY","PRACTICAL"],effects:{trust:5,affection:3,stress:-4},response:"답을 억지로 채우지 않고 오늘의 확인은 여기까지라고 합의했다.",flag:"context-day4-home-ledger-review:CLOSE_TOGETHER",memory:"DAY 4 밤, 미확인 증언을 남겨 둔 채 하은과 장부를 덮었다.",futureEventWeights:{romance:1.15}}
  ],futureEventWeights:{romance:1.05,investigation:1.1},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY5_OFFICE_HANDOFF=Object.freeze({
  id:"context-day5-office-seojin-handoff",title:"파란 파일의 다음 칸",category:"work",categoryLabel:"스토리 공용 이벤트",
  hook:"퇴근 직전 서진이 파란 파일에 빈 인덱스 한 장을 끼워 두었다.",message:"다음 방문에서 확인할 현재 자료의 범위만 함께 정하자는 제안이었다.",question:"첫 복귀의 마지막 업무 경계를 어떻게 남길까?",
  allowedLocations:["office"],allowedPhases:["evening"],dayRange:[5,5],heroineIds:["haeun"],requiredFeatures:["day5-work-trial","seojin-basic"],requiredStoryFlags:["day5RuntimeComplete"],npcRequirements:["female-coworker"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:230,baseWeight:100,tensionLevel:"low",effects:{work:1},
  storyFlag:"context-day5-office-seojin-handoff:COMPLETED",forbiddenFlags:["context-day5-office-seojin-handoff:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/office/BG_OFFICE_DAY_001.webp",result:"assets/backgrounds/office/BG_OFFICE_DAY_001.webp",status:"ready"},
  presentation:{backgroundId:"office-day",characterId:"female-coworker",expressionId:"calm-attentive",poseId:"standing"},
  scenes:[{id:"context-day5-office-seojin-handoff-scene",title:"파란 파일의 다음 칸",backgroundId:"office-day",characterIds:["female-coworker"],expression:"calm",pose:"standing",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"office",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"퇴근 준비를 마치자 서진이 파란 파일에 빈 인덱스 한 장만 끼워 내 쪽에 놓았다."},
    {type:"dialogue",speaker:"윤서진",text:"오늘 결론 말고, 다음에 열 자료의 범위만 같이 적어도 될까요?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"현재 수치와 담당자 기록까지만. 과거 판단 파일은 내가 다시 동의할 때 열죠."},
    {type:"dialogue",speaker:"윤서진",text:"좋아요. 빈칸은 제가 추측해서 채우지 않을게요.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"다음 업무는 기억을 시험하는 자리가 아니라, 확인 범위를 다시 합의하는 약속으로 남았다."}
  ]}],
  choices:[
    {id:"schedule-current-data",label:"현재 수치·담당자 기록만 다음 자료로 지정한다",preferenceTags:["LOGICAL","PLANNED"],effects:{work:5,confidence:3,stress:-2},response:"다음 방문에는 현재 자료 두 항목만 열기로 문서에 남겼다.",flag:"context-day5-office-seojin-handoff:CURRENT_DATA",memory:"DAY 5 퇴근 전 서진과 다음에 확인할 현재 자료 범위를 문서로 합의했다.",futureEventWeights:{work:1.2}},
    {id:"schedule-boundary-review",label:"자료보다 먼저 시간·중단 기준을 다시 확인한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{health:2,trust:3,work:3,stress:-3},response:"다음 방문도 시간과 중단 기준을 확인한 뒤 자료를 열기로 했다.",flag:"context-day5-office-seojin-handoff:BOUNDARY_FIRST",memory:"DAY 5 퇴근 전 다음 업무의 시간과 중단 기준을 서진과 먼저 합의했다.",futureEventWeights:{recovery:1.15,work:1.1}}
  ],futureEventWeights:{work:1.15},requiredMemories:[],requiredEvents:[],kind:"story",sourceMode:"free-romance"
});

export const CONTEXTUAL_SHARED_EVENTS=Object.freeze([
  Object.freeze({id:"context-hospital-haeun-water",title:"침대 옆의 물",text:"하은이 미지근한 물을 가져와 침대 옆에 두었다.",category:"hospital",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{trust:2},storyFlag:"day1_event_haeun_water"}),
  Object.freeze({id:"context-hospital-nurse-check",title:"야간 상태 확인",text:"간호사가 들어와 수치를 확인하고 무리하지 말라고 당부했다.",category:"hospital",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{health:1},storyFlag:"day1_event_nurse_check"}),
  Object.freeze({id:"context-hospital-corridor-memory",title:"익숙한 복도 소리",text:"복도에서 들린 카트 바퀴 소리가 잠깐 익숙하게 느껴졌다.",category:"memory",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{stress:1},scenarioEffects:{memoryRecovery:1},storyFlag:"day1_event_corridor_familiarity"}),
  DAY2_HOME_CHECK_IN,
  DAY3_DISCHARGE_CHECK,
  DAY4_HOME_LEDGER_REVIEW,
  DAY5_OFFICE_HANDOFF
]);

export const SHARED_EVENT_CATALOG=Object.freeze([...FREE_MODE_EVENT_CATALOG,...CONTEXTUAL_SHARED_EVENTS]);
export function getSharedEventById(id){return SHARED_EVENT_CATALOG.find(event=>event.id===id)??null;}
const PHASE_NAMES=["morning","day","evening","night"];
const PHONE_CATEGORIES=new Set(["message","call","sns"]);
const OFFICE_CATEGORIES=new Set(["work","temptation"]);
const ECONOMY_CATEGORIES=new Set(["money","shopping","investment"]);
const CATEGORY_BY_ID={"sudden-overtime":"work","work-mistake":"work","ex-contact":"message","date-cancelled":"message","relationship-crisis":"conflict","rival-approach":"conflict","relationship-suspicion":"conflict","surprise-date":"romance","unexpected-expense":"money","caught-cold":"health","small-windfall":"money"};
const OPERATORS={">=":(a,b)=>a>=b,"<=":(a,b)=>a<=b,">":(a,b)=>a>b,"<":(a,b)=>a<b,"==":(a,b)=>a===b};
const ACTIVE_NPC_STATES=new Set([undefined,null,"active","introduced","available"]);

function eventCategory(event){return event.category??CATEGORY_BY_ID[event.id]??"general";}
function meetsConditions(state,event){return (event.conditions??[]).every(condition=>{if(condition.recentTag){const since=state.day-condition.withinDays;return (state.actionHistory??[]).filter(entry=>entry.tag===condition.recentTag&&entry.day>=since).length>=(condition.minCount??1);}const actual=condition.stat.split(".").reduce((value,key)=>value?.[key],state);return Boolean(OPERATORS[condition.operator]?.(actual,condition.value));});}
function featureAvailable(state,context,id){
  if(id==="haeun-contact")return Boolean(state.storyFlags?.haeun_contact_unlocked);
  if(id==="phone")return context.phoneUnlocked;
  if(id==="finance")return context.financeUnlocked;
  if(id==="job")return context.jobUnlocked;
  if(id==="map")return context.mapUnlocked;
  if(state.scenario?.unlockedActions?.includes(id)||state.scenario?.profileUnlocks?.includes(id))return true;
  return Boolean(state.scenario?.featureUnlocks?.[id]);
}

function inferredLocations(event){
  if(event.allowedLocations?.length)return event.allowedLocations;
  if(event.locationIds?.length)return event.locationIds;
  if(event.locationCategories?.length)return event.locationCategories;
  const category=eventCategory(event);
  if(OFFICE_CATEGORIES.has(category))return ["office","office-district"];
  if(category==="npc")return ["office","office-district","cafe"];
  if(category==="travel")return ["street","transport","landmark"];
  if(category==="friends")return ["home","cafe","street"];
  if(category==="romance"||category==="conflict"||category==="mystery")return ["home","cafe","street","restaurant"];
  if(category==="shopping")return ["shopping"];
  return [];
}

function inferredPhases(event){
  if(event.allowedPhases?.length)return event.allowedPhases;
  if(event.phases?.length)return event.phases.map(value=>typeof value==="number"?PHASE_NAMES[value]:value);
  if(event.timeOfDay)return [event.timeOfDay];
  return [];
}

function getTriggeredRecords(state,event){return [...(state.eventHistory??[]),...(state.microEventHistory??[])].filter(record=>record.id===event.id);}
function getDailyEventCount(state){const compatibility=Number(state.eventCompatibility?.dailyCounts?.[String(state.day)]??0);const sharedHistory=(state.eventHistory??[]).filter(record=>record.day===state.day&&record.origin==="story-free-action").length;return Math.max(compatibility,sharedHistory);}

export function getEventContext(state,overrides={}){
  const unlocks=state.scenario?.featureUnlocks??{};
  return {day:state.day,phase:PHASE_NAMES[state.phase]??"day",location:state.currentLocation??(state.day===1&&state.scenario?.enabled?"hospital":"home"),occurrence:"free-action-result",phoneUnlocked:state.scenario?.enabled?Boolean(unlocks.phone):true,financeUnlocked:state.scenario?.enabled?Boolean(unlocks.investment||unlocks.finance):true,jobUnlocked:state.scenario?.enabled?Boolean(unlocks.job||unlocks.career):true,mapUnlocked:state.scenario?.enabled?Boolean(unlocks.map):true,healthRiskAllowed:state.scenario?.enabled?state.health>=55&&state.energy>=30:true,npcIntroduced:state.scenario?.introducedNpcIds??[],activeStoryId:null,...overrides};
}

export function evaluateEventCompatibility(state,event,overrides={}){
  const context=getEventContext(state,overrides),blocks=[];
  const category=eventCategory(event),relationshipState=analyzeRelationshipState(state);
  if(state.scenario?.enabled===true&&context.occurrence!=="free-action-result")blocks.push("STORY_NOT_FREE_ACTION");
  if(getDailyEventCount(state)>=1)blocks.push("DAILY_BUDGET");
  const activeEvent=state.eventRuntime?.activeEvent;if(activeEvent&&activeEvent!==context.activeStoryId)blocks.push("EVENT_ACTIVE");
  const locations=inferredLocations(event);if(locations.length&&!locations.includes(context.location))blocks.push(`LOCATION:${context.location}`);
  const phases=inferredPhases(event);if(phases.length&&!phases.includes(context.phase))blocks.push(`PHASE:${context.phase}`);
  if(event.trigger==="location-enter"&&!event.allowedLocations?.length)blocks.push("LOCATION_TRIGGER_ONLY");
  if(event.trigger==="random-before-evening"&&["evening","night"].includes(context.phase))blocks.push("TRIGGER_WINDOW");
  if(event.dayRange&&(context.day<event.dayRange[0]||context.day>event.dayRange[1]))blocks.push("DAY_RANGE");
  if(PHONE_CATEGORIES.has(category)&&!context.phoneUnlocked)blocks.push("PHONE_LOCKED");
  if(OFFICE_CATEGORIES.has(category)&&!context.jobUnlocked)blocks.push("JOB_LOCKED");
  if(ECONOMY_CATEGORIES.has(category)&&!context.financeUnlocked)blocks.push("ECONOMY_LOCKED");
  if(!context.healthRiskAllowed&&((event.effects?.health??0)<0||(event.effects?.energy??0)<-5||event.requiresMobility))blocks.push("HEALTH_RECOVERY");
  if(Number.isFinite(event.minimumHealth)&&state.health<event.minimumHealth)blocks.push("HEALTH_LOW");
  if(Number.isFinite(event.maximumFatigue)&&state.fatigue>event.maximumFatigue)blocks.push("FATIGUE_HIGH");
  if(!meetsConditions(state,event))blocks.push("CONDITIONS");
  if(event.requiredFeatures?.some(id=>!featureAvailable(state,context,id)))blocks.push("FEATURE_LOCKED");
  if(event.requiredStoryFlags?.some(flag=>!state.storyFlags?.[flag]))blocks.push("STORY_FLAG_REQUIRED");
  const introduced=new Set(context.npcIntroduced);const missingNpcs=(event.npcRequirements??[]).filter(id=>{const npc=(state.npcs??[]).find(item=>item.id===id);return !introduced.has(id)||!npc?.active||!ACTIVE_NPC_STATES.has(npc.storyState);});if(missingNpcs.length)blocks.push("NPC_NOT_INTRODUCED");
  if(event.heroineIds?.length&&!event.heroineIds.includes(state.partner?.heroineId))blocks.push("HEROINE_ROUTE");
  if(event.excludedHeroineIds?.includes(state.partner?.heroineId))blocks.push("HEROINE_EXCLUDED");
  if(event.relationshipStates?.length&&!event.relationshipStates.includes(relationshipState))blocks.push(`RELATIONSHIP:${relationshipState}`);
  const missingEvents=(event.requiredEvents??[]).filter(id=>!state.storyFlags?.[`${id}:COMPLETED`]);if(missingEvents.length)blocks.push("CHAIN_REQUIRED");
  const missingMemories=(event.requiredMemories??[]).filter(tag=>!(state.memories??[]).some(memory=>memory.tags?.includes(tag)));if(missingMemories.length)blocks.push("MEMORY_REQUIRED");
  const triggered=getTriggeredRecords(state,event),last=triggered.at(-1),cooldownRemaining=last&&Number.isFinite(event.cooldown)?Math.max(0,event.cooldown-(state.day-last.day)):0;
  if(event.maxTriggerCount&&triggered.length>=event.maxTriggerCount)blocks.push("MAX_TRIGGER_COUNT");
  if(cooldownRemaining)blocks.push(`COOLDOWN:${cooldownRemaining}`);
  if(state.storyFlags?.[event.storyFlag]||event.forbiddenFlags?.some(flag=>state.storyFlags?.[flag]))blocks.push("ALREADY_RESOLVED");
  return {eligible:blocks.length===0,blocks,context,allowedLocations:locations,allowedPhases:phases,relationshipState,cooldownRemaining};
}

export function getCompatibleSharedEvents(state,overrides={},events=SHARED_EVENT_CATALOG){return events.filter(event=>evaluateEventCompatibility(state,event,overrides).eligible);}

function applyScenarioEffects(state,effects={}){state.scenario??={};for(const [key,value] of Object.entries(effects))state.scenario[key]=Math.max(0,Number(state.scenario[key]??0)+Number(value));}

export function rollSharedFreeActionEvent(state,{random=Math.random,overrides={},events=SHARED_EVENT_CATALOG}={}){
  state.eventCompatibility??={dailyCounts:{}};state.eventCompatibility.dailyCounts??={};
  const context=getEventContext(state,overrides),diagnostics=events.map(event=>({id:event.id,...evaluateEventCompatibility(state,event,context)}));
  state.eventCompatibility.lastExcluded=diagnostics.filter(item=>!item.eligible).map(item=>({id:item.id,blocks:item.blocks}));
  const candidates=events.filter((event,index)=>diagnostics[index].eligible);
  state.eventCompatibility.lastCandidates=candidates.map(item=>item.id);
  if(!candidates.length||Number(random())>=.35)return null;
  const ranked=[...candidates].sort((a,b)=>(b.priority??0)-(a.priority??0));
  const event=ranked[Math.min(ranked.length-1,Math.floor(Number(random())*ranked.length))];
  applyEffects(state,event.effects??{});applyScenarioEffects(state,event.scenarioEffects);
  state.storyFlags??={};const structured=Boolean(event.scenes?.length&&event.choices?.length);if(!structured&&event.storyFlag)state.storyFlags[event.storyFlag]=true;
  if(structured)activateSituationEvent(state,event);
  state.eventHistory??=[];const record={id:event.id,day:state.day,phase:state.phase,title:event.title??event.text,message:event.message??event.text,category:event.category??"story-free-action",tensionLevel:event.tensionLevel??"low",npcIds:[...(event.npcRequirements??[])],status:structured?"ACTIVE":"COMPLETED",origin:"story-free-action",context};state.eventHistory.push(record);
  const key=String(state.day);state.eventCompatibility.dailyCounts[key]=Number(state.eventCompatibility.dailyCounts[key]??0)+1;state.eventCompatibility.lastSelected=event.id;
  return {...event,text:event.text??event.message??event.hook,record};
}

export function getEventCompatibilityDiagnostics(state,overrides={}){return SHARED_EVENT_CATALOG.map(event=>({id:event.id,...evaluateEventCompatibility(state,event,overrides)}));}
