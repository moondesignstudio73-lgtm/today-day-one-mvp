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

export const CONTEXTUAL_SHARED_EVENTS=Object.freeze([
  Object.freeze({id:"context-hospital-haeun-water",title:"침대 옆의 물",text:"하은이 미지근한 물을 가져와 침대 옆에 두었다.",category:"hospital",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{trust:2},storyFlag:"day1_event_haeun_water"}),
  Object.freeze({id:"context-hospital-nurse-check",title:"야간 상태 확인",text:"간호사가 들어와 수치를 확인하고 무리하지 말라고 당부했다.",category:"hospital",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{health:1},storyFlag:"day1_event_nurse_check"}),
  Object.freeze({id:"context-hospital-corridor-memory",title:"익숙한 복도 소리",text:"복도에서 들린 카트 바퀴 소리가 잠깐 익숙하게 느껴졌다.",category:"memory",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{stress:1},scenarioEffects:{memoryRecovery:1},storyFlag:"day1_event_corridor_familiarity"}),
  DAY2_HOME_CHECK_IN
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
  return Boolean(state.scenario?.featureUnlocks?.[id]);
}

function inferredLocations(event){
  if(event.allowedLocations?.length)return event.allowedLocations;
  if(event.locationIds?.length)return event.locationIds;
  if(event.locationCategories?.length)return event.locationCategories;
  const category=eventCategory(event);
  if(OFFICE_CATEGORIES.has(category))return ["office","office-district"];
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
