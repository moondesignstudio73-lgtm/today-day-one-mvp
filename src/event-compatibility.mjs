import { applyEffects } from "./game-core.mjs";
import { EVENT_DEFINITIONS } from "./events-data.mjs";
import { MICRO_EVENTS } from "./micro-event-manager.mjs";

export const FREE_MODE_EVENT_CATALOG=Object.freeze([...EVENT_DEFINITIONS,...MICRO_EVENTS]);

export const CONTEXTUAL_SHARED_EVENTS=Object.freeze([
  Object.freeze({id:"context-hospital-haeun-water",title:"침대 옆의 물",text:"하은이 미지근한 물을 가져와 침대 옆에 두었다.",category:"hospital",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{trust:2},storyFlag:"day1_event_haeun_water"}),
  Object.freeze({id:"context-hospital-nurse-check",title:"야간 상태 확인",text:"간호사가 들어와 수치를 확인하고 무리하지 말라고 당부했다.",category:"hospital",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{health:1},storyFlag:"day1_event_nurse_check"}),
  Object.freeze({id:"context-hospital-corridor-memory",title:"익숙한 복도 소리",text:"복도에서 들린 카트 바퀴 소리가 잠깐 익숙하게 느껴졌다.",category:"memory",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{stress:1},scenarioEffects:{memoryRecovery:1},storyFlag:"day1_event_corridor_familiarity"})
]);

export const SHARED_EVENT_CATALOG=Object.freeze([...FREE_MODE_EVENT_CATALOG,...CONTEXTUAL_SHARED_EVENTS]);
const PHASE_NAMES=["morning","day","evening","night"];
const PHONE_CATEGORIES=new Set(["message","call","sns","shopping"]);
const OFFICE_CATEGORIES=new Set(["work","temptation"]);
const CATEGORY_BY_ID={"sudden-overtime":"work","work-mistake":"work","ex-contact":"message","date-cancelled":"message","relationship-crisis":"conflict","rival-approach":"conflict","relationship-suspicion":"conflict","surprise-date":"romance","unexpected-expense":"money","caught-cold":"health","small-windfall":"money"};
const OPERATORS={">=":(a,b)=>a>=b,"<=":(a,b)=>a<=b,">":(a,b)=>a>b,"<":(a,b)=>a<b,"==":(a,b)=>a===b};

function eventCategory(event){return event.category??CATEGORY_BY_ID[event.id]??"general";}
function meetsConditions(state,event){return (event.conditions??[]).every(condition=>{if(condition.recentTag){const since=state.day-condition.withinDays;return (state.actionHistory??[]).filter(entry=>entry.tag===condition.recentTag&&entry.day>=since).length>=(condition.minCount??1);}const actual=condition.stat.split(".").reduce((value,key)=>value?.[key],state);return Boolean(OPERATORS[condition.operator]?.(actual,condition.value));});}

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

export function getEventContext(state,overrides={}){
  const unlocks=state.scenario?.featureUnlocks??{};
  return {day:state.day,phase:PHASE_NAMES[state.phase]??"day",location:state.currentLocation??(state.day===1&&state.scenario?.enabled?"hospital":"home"),occurrence:"free-action-result",phoneUnlocked:state.scenario?.enabled?Boolean(unlocks.phone):true,financeUnlocked:state.scenario?.enabled?Boolean(unlocks.investment):true,npcIntroduced:state.scenario?.introducedNpcIds??[],...overrides};
}

export function evaluateEventCompatibility(state,event,overrides={}){
  const context=getEventContext(state,overrides),blocks=[];
  const category=eventCategory(event);
  if(state.scenario?.enabled===true&&context.occurrence!=="free-action-result")blocks.push("STORY_NOT_FREE_ACTION");
  const locations=inferredLocations(event);if(locations.length&&!locations.includes(context.location))blocks.push(`LOCATION:${context.location}`);
  const phases=inferredPhases(event);if(phases.length&&!phases.includes(context.phase))blocks.push(`PHASE:${context.phase}`);
  if(event.dayRange&&(context.day<event.dayRange[0]||context.day>event.dayRange[1]))blocks.push("DAY_RANGE");
  if(PHONE_CATEGORIES.has(category)&&!context.phoneUnlocked)blocks.push("PHONE_LOCKED");
  if(category==="money"&&!context.financeUnlocked)blocks.push("FINANCE_LOCKED");
  if(!meetsConditions(state,event))blocks.push("CONDITIONS");
  if(event.npcRequirements?.length&&!event.npcRequirements.every(id=>context.npcIntroduced.includes(id)))blocks.push("NPC_NOT_INTRODUCED");
  if(event.heroineIds?.length&&!event.heroineIds.includes(state.partner?.heroineId))blocks.push("HEROINE_ROUTE");
  if(event.excludedHeroineIds?.includes(state.partner?.heroineId))blocks.push("HEROINE_EXCLUDED");
  if(state.storyFlags?.[event.storyFlag]||event.forbiddenFlags?.some(flag=>state.storyFlags?.[flag]))blocks.push("ALREADY_RESOLVED");
  return {eligible:blocks.length===0,blocks,context,allowedLocations:locations,allowedPhases:phases};
}

export function getCompatibleSharedEvents(state,overrides={},events=SHARED_EVENT_CATALOG){return events.filter(event=>evaluateEventCompatibility(state,event,overrides).eligible);}

function applyScenarioEffects(state,effects={}){state.scenario??={};for(const [key,value] of Object.entries(effects))state.scenario[key]=Math.max(0,Number(state.scenario[key]??0)+Number(value));}

export function rollSharedFreeActionEvent(state,{random=Math.random,overrides={},events=SHARED_EVENT_CATALOG}={}){
  state.eventCompatibility??={dailyCounts:{}};const key=String(state.day),count=Number(state.eventCompatibility.dailyCounts[key]??0);
  if(count>=1||state.eventRuntime?.activeEvent)return null;
  const candidates=getCompatibleSharedEvents(state,overrides,events).filter(event=>CONTEXTUAL_SHARED_EVENTS.some(shared=>shared.id===event.id));
  if(!candidates.length||Number(random())>=.35)return null;
  const event=candidates[Math.min(candidates.length-1,Math.floor(Number(random())*candidates.length))];
  applyEffects(state,event.effects??{});applyScenarioEffects(state,event.scenarioEffects);state.storyFlags??={};if(event.storyFlag)state.storyFlags[event.storyFlag]=true;
  state.eventHistory??=[];state.eventHistory.push({id:event.id,day:state.day,phase:state.phase,title:event.title,message:event.text,category:"story-free-action",tensionLevel:"low",npcIds:[],status:"COMPLETED",context:getEventContext(state,overrides)});
  state.eventCompatibility.dailyCounts[key]=count+1;state.eventCompatibility.lastCandidates=candidates.map(item=>item.id);state.eventCompatibility.lastSelected=event.id;
  return {id:event.id,text:event.text};
}

export function getEventCompatibilityDiagnostics(state,overrides={}){return SHARED_EVENT_CATALOG.map(event=>({id:event.id,...evaluateEventCompatibility(state,event,overrides)}));}
