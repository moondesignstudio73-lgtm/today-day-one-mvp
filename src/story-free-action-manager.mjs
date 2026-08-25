import { applyEffects } from "./game-core.mjs?v=9";
import { createDaySnapshot, getDailyReport } from "./night-manager.mjs?v=2";

export const STORY_FREE_ACTION_WINDOWS=Object.freeze({
  1:Object.freeze([Object.freeze({
    id:"day1-hospital-evening",
    phase:"evening",
    phaseIndex:2,
    location:"hospital",
    locationLabel:"병원",
    maxActions:1,
    title:"EVENING · 병원",
    description:"긴 하루였다. 지금은 무리하지 않는 선에서 잠시 무엇을 할지 정할 수 있다.",
    nextSchedule:"오늘은 병원에서 휴식해야 한다."
  })])
});

export const DAY1_HOSPITAL_ACTIONS=Object.freeze([
  Object.freeze({id:"talk-with-haeun",icon:"♥",title:"하은과 조금 더 이야기한다",description:"오늘 들은 이야기를 서두르지 않고 조금 더 나눈다.",effects:{affection:8,trust:10,energy:-4,stress:-2},scenarioEffects:{haeunAffection:2,haeunTrust:3},flag:"day1_free_talk_haeun",summary:"하은과 조금 가까워졌고, 서로의 속도를 확인했다."}),
  Object.freeze({id:"reflect-on-accident",icon:"◈",title:"사고에 대해 생각해본다",description:"들은 사실과 아직 기억나지 않는 부분을 조용히 구분한다.",effects:{stress:3,energy:-3},scenarioEffects:{investigation:2,accidentSearchCount:1},flag:"accident_interest",summary:"사고에 관한 의문을 잊지 않기로 했다."}),
  Object.freeze({id:"reflect-on-family",icon:"◇",title:"가족에 대해 생각해본다",description:"사진이나 새로운 단서 없이, 오늘 들은 말과 감정만 정리한다.",effects:{stress:4,energy:-3},scenarioEffects:{memoryRecovery:1},flag:"day1_family_reflection",summary:"가족에 관한 감정을 억지로 결론 내리지 않고 남겨 두었다."}),
  Object.freeze({id:"observe-hospital-room",icon:"⌕",title:"병실을 둘러본다",description:"침대 주변과 창문, 의료 장비를 무리하지 않는 선에서 살핀다.",effects:{energy:-3,stress:1},scenarioEffects:{investigation:1},flag:"day1_hospital_observed",summary:"병실의 익숙하지 않은 풍경을 차분히 관찰했다."}),
  Object.freeze({id:"rest-safely",icon:"☾",title:"그냥 쉰다",description:"지금의 몸에 가장 필요한 일을 선택한다.",effects:{energy:12,fatigue:-10,stress:-6,health:2},scenarioEffects:{},flag:"day1_recovery_rest",summary:"몸이 조금 회복됐고 숨이 한결 편안해졌다."})
]);

export const STORY_FEATURES=Object.freeze([
  Object.freeze({id:"phone",label:"스마트폰",reason:"아직 사용할 수 있는 휴대폰이 없다."}),
  Object.freeze({id:"shop",label:"온라인 쇼핑",reason:"스마트폰 기능이 아직 해금되지 않았습니다."}),
  Object.freeze({id:"investment",label:"투자",reason:"금융 정보와 계정이 아직 복구되지 않았습니다."}),
  Object.freeze({id:"map",label:"지도",reason:"지금은 병원 밖으로 자유롭게 이동할 수 없습니다."}),
  Object.freeze({id:"contacts",label:"인맥",reason:"기억과 연락처가 아직 복구되지 않았습니다."})
]);

const MICRO_EVENTS=Object.freeze([
  Object.freeze({id:"haeun-water",text:"하은이 미지근한 물을 가져와 침대 옆에 두었다.",effects:{trust:2},flag:"day1_event_haeun_water"}),
  Object.freeze({id:"nurse-check",text:"간호사가 들어와 수치를 확인하고 무리하지 말라고 당부했다.",effects:{health:1},flag:"day1_event_nurse_check"}),
  Object.freeze({id:"corridor-familiarity",text:"복도에서 들린 카트 바퀴 소리가 잠깐 익숙하게 느껴졌다.",effects:{stress:1},scenarioEffects:{memoryRecovery:1},flag:"day1_event_corridor_familiarity"})
]);

export function getStoryFreeActionWindow(day=1,id=""){
  return (STORY_FREE_ACTION_WINDOWS[day]??[]).find(window=>!id||window.id===id)??null;
}

export function ensureStoryFeatureUnlocks(state){
  state.scenario??={};
  state.scenario.featureUnlocks??={phone:false,messages:false,contacts:false,shop:false,investment:false,map:false};
  return state.scenario.featureUnlocks;
}

export function getStoryFeatureAvailability(state,featureId){
  const feature=STORY_FEATURES.find(item=>item.id===featureId);
  const unlocked=Boolean(ensureStoryFeatureUnlocks(state)[featureId]);
  return {id:featureId,label:feature?.label??featureId,available:unlocked,reason:unlocked?"":feature?.reason??"아직 해금되지 않았습니다."};
}

export function beginStoryFreeAction(state,windowId="day1-hospital-evening"){
  const definition=getStoryFreeActionWindow(state.day,windowId);
  if(!definition)return null;
  ensureStoryFeatureUnlocks(state);
  const current=state.storyFreeAction;
  if(current?.windowId===windowId&&current.day===state.day&&current.status!=="COMPLETE")return current;
  state.phase=definition.phaseIndex;
  state.storyFreeAction={
    windowId,day:state.day,phase:definition.phase,location:definition.location,
    maxActions:definition.maxActions,used:0,status:"ACTIVE",snapshot:createDaySnapshot(state),
    chosenActionId:null,result:null,event:null,reportShown:false
  };
  return state.storyFreeAction;
}

function applyScenarioEffects(state,effects={}){
  state.scenario??={};
  for(const [key,value] of Object.entries(effects))state.scenario[key]=Math.max(0,Number(state.scenario[key]??0)+Number(value));
}

export function rollStoryFreeActionEvent(state,random=Math.random){
  if(Number(random())>=.35)return null;
  const candidates=MICRO_EVENTS.filter(event=>!state.storyFlags?.[event.flag]);
  if(!candidates.length)return null;
  const event=candidates[Math.min(candidates.length-1,Math.floor(Number(random())*candidates.length))];
  applyEffects(state,event.effects??{});
  applyScenarioEffects(state,event.scenarioEffects??{});
  state.storyFlags??={};state.storyFlags[event.flag]=true;
  state.eventHistory??=[];
  state.eventHistory.push({id:event.id,day:state.day,phase:state.phase,title:"병원의 짧은 순간",message:event.text,category:"story-free-action",tensionLevel:"low",npcIds:[],status:"COMPLETED"});
  return {id:event.id,text:event.text};
}

export function resolveStoryFreeAction(state,actionId,{random=Math.random}={}){
  const progress=state.storyFreeAction;
  if(!progress||progress.status!=="ACTIVE"||progress.used>=progress.maxActions)return null;
  const action=DAY1_HOSPITAL_ACTIONS.find(item=>item.id===actionId);
  if(!action)return null;
  applyEffects(state,action.effects);
  applyScenarioEffects(state,action.scenarioEffects);
  state.storyFlags??={};state.storyFlags[action.flag]=true;state.storyFlags.day1_free_action_choice=action.id;
  if(action.id==="rest-safely")state.storyFlags.recovery_focus=true;
  state.actionHistory??=[];
  state.actionHistory.push({day:state.day,phase:state.phase,id:action.id,title:action.title,tag:"스토리 자유행동",effects:{...action.effects}});
  progress.used+=1;progress.chosenActionId=action.id;progress.status="REPORT";
  progress.event=rollStoryFreeActionEvent(state,random);
  progress.result={title:action.title,summary:action.summary,effects:{...action.effects}};
  return progress;
}

export function getStoryFreeActionReport(state){
  const progress=state.storyFreeAction;if(!progress)return [];
  const original=state.dayStartSnapshot;state.dayStartSnapshot=progress.snapshot;
  const report=getDailyReport(state);
  state.dayStartSnapshot=original;
  return report;
}

export function completeStoryFreeAction(state){
  const progress=state.storyFreeAction;
  if(!progress||progress.status!=="REPORT")return false;
  progress.status="COMPLETE";progress.reportShown=true;
  state.storyFlags??={};state.storyFlags.day1FreeActionComplete=true;
  return true;
}

export function validateStoryFreeActionData(){
  return STORY_FREE_ACTION_WINDOWS[1].length===1&&DAY1_HOSPITAL_ACTIONS.length===5&&new Set(DAY1_HOSPITAL_ACTIONS.map(action=>action.id)).size===5&&STORY_FEATURES.length===5;
}
