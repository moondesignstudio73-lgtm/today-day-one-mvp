import { applyEffects } from "./game-core.mjs?v=9";
import { createDaySnapshot, getDailyReport } from "./night-manager.mjs?v=2";
import { rollSharedFreeActionEvent } from "./event-compatibility.mjs?v=2";

export const STORY_FREE_ACTION_WINDOWS=Object.freeze({
  1:Object.freeze([Object.freeze({
    id:"day1-hospital-evening",storySceneId:"m30-day1-hospital-awakening",phase:"evening",phaseIndex:2,location:"hospital",locationLabel:"병원",maxActions:1,
    title:"EVENING · 병원",description:"긴 하루였다. 지금은 무리하지 않는 선에서 잠시 무엇을 할지 정할 수 있다.",nextSchedule:"오늘은 병원에서 휴식해야 한다.",
    eventContext:Object.freeze({phoneUnlocked:false,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false})
  })]),
  2:Object.freeze([Object.freeze({
    id:"day2-home-evening",storySceneId:"m30-day2-rehabilitation",phase:"evening",phaseIndex:2,location:"home",locationLabel:"처음 돌아온 집",maxActions:1,
    title:"EVENING · 집",description:"하은이 돌아간 뒤다. 몸에 부담을 주지 않는 한 가지 행동만 하고 오늘을 마무리한다.",nextSchedule:"안전 확인을 마치면 DAY 3 아침으로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:false,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false})
  })])
});

export const DAY1_HOSPITAL_ACTIONS=Object.freeze([
  Object.freeze({id:"talk-with-haeun",icon:"♥",title:"하은과 조금 더 이야기한다",description:"오늘 들은 이야기를 서두르지 않고 조금 더 나눈다.",effects:{affection:8,trust:10,energy:-4,stress:-2},scenarioEffects:{haeunAffection:2,haeunTrust:3},flag:"day1_free_talk_haeun",summary:"하은과 조금 가까워졌고, 서로의 속도를 확인했다."}),
  Object.freeze({id:"reflect-on-accident",icon:"◈",title:"사고에 대해 생각해본다",description:"들은 사실과 아직 기억나지 않는 부분을 조용히 구분한다.",effects:{stress:3,energy:-3},scenarioEffects:{investigation:2,accidentSearchCount:1},flag:"accident_interest",summary:"사고에 관한 의문을 잊지 않기로 했다."}),
  Object.freeze({id:"reflect-on-family",icon:"◇",title:"가족에 대해 생각해본다",description:"사진이나 새로운 단서 없이, 오늘 들은 말과 감정만 정리한다.",effects:{stress:4,energy:-3},scenarioEffects:{memoryRecovery:1},flag:"day1_family_reflection",summary:"가족에 관한 감정을 억지로 결론 내리지 않고 남겨 두었다."}),
  Object.freeze({id:"observe-hospital-room",icon:"⌕",title:"병실을 둘러본다",description:"침대 주변과 창문, 의료 장비를 무리하지 않는 선에서 살핀다.",effects:{energy:-3,stress:1},scenarioEffects:{investigation:1},flag:"day1_hospital_observed",summary:"병실의 익숙하지 않은 풍경을 차분히 관찰했다."}),
  Object.freeze({id:"rest-safely",icon:"☾",title:"그냥 쉰다",description:"지금의 몸에 가장 필요한 일을 선택한다.",effects:{energy:12,fatigue:-10,stress:-6,health:2},scenarioEffects:{},flag:"day1_recovery_rest",summary:"몸이 조금 회복됐고 숨이 한결 편안해졌다."})
]);

export const DAY2_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"review-three-columns",icon:"≡",title:"세 칸 메모를 정리한다",description:"확인한 것·들은 것·모르는 것을 더 늘리지 않고 정돈한다.",effects:{confidence:4,energy:-2,stress:-1},scenarioEffects:{investigation:2},flag:"day2_free_review_columns",summary:"오늘 얻은 사실과 아직 모르는 것을 섞지 않고 정리했다."}),
  Object.freeze({id:"check-medicine-and-water",icon:"＋",title:"약과 물을 확인한다",description:"복약 순서와 물만 챙기고 몸 상태를 다시 확인한다.",effects:{health:3,energy:-2,stress:-3},scenarioEffects:{},flag:"day2_free_medicine_check",summary:"첫 저녁의 복약과 안전 확인을 마쳤다."}),
  Object.freeze({id:"send-safe-arrival",icon:"□",title:"하은에게 도착 상태를 남긴다",description:"예비폰으로 현재 증상과 문 잠금 여부만 짧게 알린다.",effects:{trust:5,affection:2,energy:-2},scenarioEffects:{haeunTrust:2},flag:"day2_free_safe_arrival",requiresFlag:"haeun_contact_unlocked",summary:"필요한 사실만 짧게 공유해 연락의 경계를 지켰다."}),
  Object.freeze({id:"observe-home-quietly",icon:"⌕",title:"거실 동선만 확인한다",description:"새 서랍이나 문은 열지 않고 물·약·침대까지의 길만 익힌다.",effects:{confidence:3,energy:-3,stress:-1},scenarioEffects:{homeSearchCount:1},flag:"day2_free_home_route",summary:"오늘 밤 필요한 생활 동선만 안전하게 확인했다."}),
  Object.freeze({id:"rest-after-homecoming",icon:"☾",title:"오늘은 바로 쉰다",description:"더 확인하지 않고 회복을 우선한다.",effects:{energy:14,fatigue:-12,stress:-6,health:3},scenarioEffects:{},flag:"day2_recovery_rest",summary:"집에 돌아온 첫날은 더 무리하지 않고 쉬었다."})
]);

export const STORY_FEATURES=Object.freeze([
  Object.freeze({id:"phone",label:"스마트폰",reason:"일반 스마트폰 기능은 아직 해금되지 않았습니다."}),
  Object.freeze({id:"shop",label:"온라인 쇼핑",reason:"스마트폰 기능이 아직 해금되지 않았습니다."}),
  Object.freeze({id:"investment",label:"투자",reason:"금융 정보와 계정이 아직 복구되지 않았습니다."}),
  Object.freeze({id:"map",label:"지도",reason:"아직 자유롭게 이동할 수 없습니다."}),
  Object.freeze({id:"contacts",label:"인맥",reason:"기억과 연락처가 아직 복구되지 않았습니다."})
]);

const ACTIONS_BY_DAY=Object.freeze({1:DAY1_HOSPITAL_ACTIONS,2:DAY2_HOME_ACTIONS});

export function getStoryFreeActionWindow(day=1,id=""){
  return (STORY_FREE_ACTION_WINDOWS[day]??[]).find(window=>!id||window.id===id)??null;
}

export function getStoryFreeActions(state){return (ACTIONS_BY_DAY[state.day]??[]).filter(action=>!action.requiresFlag||state.storyFlags?.[action.requiresFlag]);}

export function ensureStoryFeatureUnlocks(state){
  state.scenario??={};
  state.scenario.featureUnlocks??={phone:false,messages:false,contacts:false,shop:false,investment:false,map:false};
  return state.scenario.featureUnlocks;
}

export function getStoryFeatureAvailability(state,featureId){
  const feature=STORY_FEATURES.find(item=>item.id===featureId);
  const unlocked=Boolean(ensureStoryFeatureUnlocks(state)[featureId]);
  const day2PhoneReason=state.day===2&&featureId==="phone"&&state.storyFlags?.haeun_contact_unlocked?"예비폰은 하은·병원 연락만 가능하며 일반 앱은 잠겨 있습니다.":null;
  return {id:featureId,label:feature?.label??featureId,available:unlocked,reason:unlocked?"":day2PhoneReason??feature?.reason??"아직 해금되지 않았습니다."};
}

export function beginStoryFreeAction(state,windowId=""){
  const definition=getStoryFreeActionWindow(state.day,windowId);
  if(!definition)return null;
  ensureStoryFeatureUnlocks(state);state.currentLocation=definition.location;
  const current=state.storyFreeAction;
  if(current?.windowId===definition.id&&current.day===state.day&&current.status!=="COMPLETE")return current;
  state.phase=definition.phaseIndex;
  state.storyFreeAction={windowId:definition.id,storySceneId:definition.storySceneId,day:state.day,phase:definition.phase,location:definition.location,maxActions:definition.maxActions,used:0,status:"ACTIVE",snapshot:createDaySnapshot(state),chosenActionId:null,result:null,event:null,reportShown:false};
  return state.storyFreeAction;
}

function applyScenarioEffects(state,effects={}){state.scenario??={};for(const [key,value] of Object.entries(effects))state.scenario[key]=Math.max(0,Number(state.scenario[key]??0)+Number(value));}

export function rollStoryFreeActionEvent(state,random=Math.random){
  const progress=state.storyFreeAction,definition=getStoryFreeActionWindow(state.day,progress?.windowId);
  if(!progress||!definition)return null;
  return rollSharedFreeActionEvent(state,{random,overrides:{occurrence:"free-action-result",location:definition.location,phase:definition.phase,activeStoryId:definition.storySceneId,...definition.eventContext}});
}

export function resolveStoryFreeAction(state,actionId,{random=Math.random}={}){
  const progress=state.storyFreeAction;
  if(!progress||progress.status!=="ACTIVE"||progress.used>=progress.maxActions)return null;
  const action=getStoryFreeActions(state).find(item=>item.id===actionId);if(!action)return null;
  applyEffects(state,action.effects);applyScenarioEffects(state,action.scenarioEffects);
  state.storyFlags??={};state.storyFlags[action.flag]=true;state.storyFlags[`day${state.day}_free_action_choice`]=action.id;
  if(action.id.includes("rest"))state.storyFlags.recovery_focus=true;
  state.actionHistory??=[];state.actionHistory.push({day:state.day,phase:state.phase,id:action.id,actionId:action.id,title:action.title,tag:"스토리 자유행동",effects:{...action.effects}});
  progress.used+=1;progress.chosenActionId=action.id;progress.event=rollStoryFreeActionEvent(state,random);progress.status=progress.event?.scenes?.length?"EVENT":"REPORT";progress.result={title:action.title,summary:action.summary,effects:{...action.effects}};
  return progress;
}

export function getStoryFreeActionReport(state){
  const progress=state.storyFreeAction;if(!progress)return [];
  const original=state.dayStartSnapshot;state.dayStartSnapshot=progress.snapshot;const report=getDailyReport(state);state.dayStartSnapshot=original;return report;
}

export function markStoryFreeActionEventComplete(state,eventId){const progress=state.storyFreeAction;if(!progress||progress.status!=="EVENT"||progress.event?.id!==eventId)return false;progress.status="REPORT";return true;}

export function completeStoryFreeAction(state){
  const progress=state.storyFreeAction;if(!progress||progress.status!=="REPORT")return false;
  progress.status="COMPLETE";progress.reportShown=true;state.storyFlags??={};state.storyFlags[`day${progress.day}FreeActionComplete`]=true;return true;
}

export function validateStoryFreeActionData(){
  const actions=[...DAY1_HOSPITAL_ACTIONS,...DAY2_HOME_ACTIONS];return STORY_FREE_ACTION_WINDOWS[1].length===1&&STORY_FREE_ACTION_WINDOWS[2].length===1&&DAY1_HOSPITAL_ACTIONS.length===5&&DAY2_HOME_ACTIONS.length===5&&new Set(actions.map(action=>`${action.id}`)).size===actions.length&&STORY_FEATURES.length===5;
}
