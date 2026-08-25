import { applyEffects } from "./game-core.mjs?v=9";
import { createDaySnapshot, getDailyReport } from "./night-manager.mjs?v=2";
import { rollSharedFreeActionEvent } from "./event-compatibility.mjs?v=5";

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
  })]),
  3:Object.freeze([Object.freeze({
    id:"day3-discharge-room-day",storySceneId:"m30-day3-discharge-phone",phase:"day",phaseIndex:1,location:"hospital",locationLabel:"퇴원 병실",maxActions:1,
    title:"DAY TIME · 퇴원 병실",description:"보관품 인계와 퇴원 설명이 끝났다. 병원을 나서기 전 한 가지 준비만 마친다.",nextSchedule:"준비를 마치면 DAY 4, 집으로 돌아간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false})
  })]),
  4:Object.freeze([Object.freeze({
    id:"day4-home-night",storySceneId:"m30-day4-arrive-home",phase:"night",phaseIndex:3,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"NIGHT TIME · 나의 집",description:"하은과 증언 장부를 정리한 뒤다. 오늘 확인한 범위 안에서 한 가지 행동만 하고 쉰다.",nextSchedule:"오늘을 마치면 DAY 5, 회사 복귀 확인으로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false})
  })]),
  5:Object.freeze([Object.freeze({
    id:"day5-office-evening",storySceneId:"m30-day5-work-return",phase:"evening",phaseIndex:2,location:"office",locationLabel:"회사 사무실",maxActions:1,
    title:"EVENING · 회사 사무실",description:"두 시간의 복귀 확인을 마쳤다. 업무를 늘리지 않고 퇴근 전 한 가지 정리만 한다.",nextSchedule:"정리를 마치면 DAY 6, 다시 시작한 생활로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:false,healthRiskAllowed:false})
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

export const DAY3_DISCHARGE_ACTIONS=Object.freeze([
  Object.freeze({id:"review-discharge-checklist",icon:"✓",title:"퇴원 체크리스트를 대조한다",description:"약·외래 일정·비상 연락 순서만 서류와 맞춰 본다.",effects:{confidence:4,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day3_free_discharge_checklist",summary:"퇴원 뒤 지켜야 할 안전 기준을 빠뜨리지 않고 확인했다."}),
  Object.freeze({id:"set-medication-alarm",icon:"▣",title:"복약 알람만 설정한다",description:"돌아온 휴대폰에서 아침·저녁 복약 알람만 켠다.",effects:{health:3,confidence:3,energy:-2},scenarioEffects:{},flag:"day3_free_medication_alarm",requiresAction:"smartphone-basic",summary:"과거 기록은 열지 않고 지금 필요한 복약 알람만 설정했다."}),
  Object.freeze({id:"organize-returned-items",icon:"◇",title:"돌아온 물건을 다시 정리한다",description:"휴대폰·지갑·열쇠와 인계 영수증을 한 가방에 나눠 넣는다.",effects:{confidence:4,energy:-2,stress:-1},scenarioEffects:{investigation:2},flag:"day3_free_returned_items",summary:"돌아온 물건과 출처 기록을 섞이지 않게 정리했다."}),
  Object.freeze({id:"confirm-ride-boundary",icon:"♥",title:"하은과 귀가 순서를 확인한다",description:"이동 중 증상 확인과 휴식 요청 기준만 짧게 맞춘다.",effects:{trust:6,affection:2,energy:-2,stress:-2},scenarioEffects:{haeunTrust:2},flag:"day3_free_ride_boundary",summary:"하은과 귀가 중 도움의 범위와 중단 기준을 합의했다."}),
  Object.freeze({id:"rest-before-discharge",icon:"☾",title:"출발 전에 잠깐 쉰다",description:"추가 확인을 멈추고 이동할 체력을 남긴다.",effects:{energy:12,fatigue:-9,stress:-5,health:2},scenarioEffects:{},flag:"day3_recovery_rest",summary:"병원을 나서기 전 몸 상태를 안정시키고 체력을 아꼈다."})
]);

export const DAY4_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"finish-testimony-ledger",icon:"≡",title:"증언 장부를 마무리한다",description:"확인한 사실·출처가 붙은 증언·미확인 내용을 세 칸에 정리한다.",effects:{confidence:5,energy:-3,stress:-1},scenarioEffects:{investigation:3},flag:"day4_free_finish_ledger",requiresAction:"testimony-ledger",summary:"오늘 들은 말을 출처와 확인 상태에 따라 분리해 남겼다."}),
  Object.freeze({id:"archive-jihoon-followup",icon:"□",title:"지훈의 자료 요청을 저장한다",description:"다음에 받을 원본 사진 목록만 메모하고 추가 연락은 내일로 미룬다.",effects:{social:3,confidence:3,energy:-2},scenarioEffects:{investigation:2},flag:"day4_free_archive_jihoon",requiresAction:"friend-archive-followup",summary:"지훈에게 확인할 다음 자료의 범위를 명확히 남겼다."}),
  Object.freeze({id:"hold-work-message",icon:"▣",title:"회사 메시지를 내일 일정으로 보낸다",description:"민호의 메시지는 열어 둔 채 답변과 업무 확인은 DAY 5로 미룬다.",effects:{confidence:4,stress:-3,energy:-1},scenarioEffects:{},flag:"day4_free_hold_work_message",requiresFlag:"day4WorkContactPending",summary:"회사 연락을 섣불리 해석하지 않고 내일 확인할 일정으로 분리했다."}),
  Object.freeze({id:"check-in-with-haeun",icon:"♥",title:"하은과 오늘의 경계를 확인한다",description:"공유한 내용과 아직 말하지 않은 내용을 서로 한 문장씩 확인한다.",effects:{trust:7,affection:3,energy:-2,stress:-2},scenarioEffects:{haeunTrust:3},flag:"day4_free_haeun_boundary",summary:"서로 알고 있는 범위와 기다려야 할 부분을 다시 확인했다."}),
  Object.freeze({id:"rest-after-social-recovery",icon:"☾",title:"기록을 덮고 쉰다",description:"친구와 과거에 대한 추가 확인을 멈추고 회복을 우선한다.",effects:{energy:14,fatigue:-11,stress:-7,health:2},scenarioEffects:{},flag:"day4_recovery_rest",summary:"오늘의 자료를 더 해석하지 않고 몸과 머리를 쉬게 했다."})
]);

export const DAY5_OFFICE_ACTIONS=Object.freeze([
  Object.freeze({id:"archive-current-work-boundary",icon:"≡",title:"오늘의 업무 경계를 기록한다",description:"확인한 자료·보류한 판단·다음 방문 범위를 세 줄로 남긴다.",effects:{work:4,confidence:5,energy:-3,stress:-1},scenarioEffects:{investigation:2},flag:"day5_free_work_boundary",requiresAction:"day5-work-trial",summary:"성과가 아니라 오늘 지킨 업무 범위와 중단 기준을 기록했다."}),
  Object.freeze({id:"confirm-team-map",icon:"◇",title:"민호와 현재 팀 지도만 확인한다",description:"오늘 만난 사람의 현재 역할만 대조하고 과거 평가는 다음으로 미룬다.",effects:{social:4,work:2,energy:-2},scenarioEffects:{coworkerRelation:2},flag:"day5_free_team_map",requiresAction:"day5-team-map",summary:"민호와 현재 팀의 역할 관계만 짧게 확인했다."}),
  Object.freeze({id:"save-next-briefing",icon:"▣",title:"다음 방문 브리핑을 예약한다",description:"다음에 확인할 자료와 시간 제한을 일정에 저장한다.",effects:{work:4,confidence:4,energy:-2},scenarioEffects:{seojinStatusInterest:2},flag:"day5_free_next_briefing",requiresFlag:"day5ReturnPlanReady",summary:"다음 방문의 자료·시간·중단 조건을 일정으로 남겼다."}),
  Object.freeze({id:"message-haeun-after-work",icon:"♥",title:"하은에게 종료 상태만 알린다",description:"물과 약, 두 시간 종료 여부만 짧게 답하고 보고는 집에서 한다.",effects:{trust:6,affection:2,energy:-1,stress:-2},scenarioEffects:{haeunTrust:2},flag:"day5_free_haeun_update",requiresFlag:"haeun_contact_unlocked",summary:"하은에게 필요한 안전 정보만 공유하고 긴 설명은 미뤘다."}),
  Object.freeze({id:"leave-office-on-time",icon:"☾",title:"정한 시간에 바로 퇴근한다",description:"추가 자료를 열지 않고 회복을 위해 회사를 나선다.",effects:{energy:11,fatigue:-9,stress:-6,health:2},scenarioEffects:{},flag:"day5_recovery_leave_on_time",summary:"두 시간이라는 중단 기준을 지키고 제시간에 회사를 나섰다."})
]);

export const STORY_FEATURES=Object.freeze([
  Object.freeze({id:"phone",label:"스마트폰",reason:"일반 스마트폰 기능은 아직 해금되지 않았습니다."}),
  Object.freeze({id:"shop",label:"온라인 쇼핑",reason:"스마트폰 기능이 아직 해금되지 않았습니다."}),
  Object.freeze({id:"investment",label:"투자",reason:"금융 정보와 계정이 아직 복구되지 않았습니다."}),
  Object.freeze({id:"map",label:"지도",reason:"아직 자유롭게 이동할 수 없습니다."}),
  Object.freeze({id:"contacts",label:"인맥",reason:"기억과 연락처가 아직 복구되지 않았습니다."}),
  Object.freeze({id:"job",label:"직장",reason:"단계적 복귀 범위가 아직 합의되지 않았습니다."})
]);

const ACTIONS_BY_DAY=Object.freeze({1:DAY1_HOSPITAL_ACTIONS,2:DAY2_HOME_ACTIONS,3:DAY3_DISCHARGE_ACTIONS,4:DAY4_HOME_ACTIONS,5:DAY5_OFFICE_ACTIONS});

export function getStoryFreeActionWindow(day=1,id=""){
  return (STORY_FREE_ACTION_WINDOWS[day]??[]).find(window=>!id||window.id===id)??null;
}

export function getStoryFreeActions(state){return (ACTIONS_BY_DAY[state.day]??[]).filter(action=>(!action.requiresFlag||state.storyFlags?.[action.requiresFlag])&&(!action.requiresAction||state.scenario?.unlockedActions?.includes(action.requiresAction)));}

export function ensureStoryFeatureUnlocks(state){
  state.scenario??={};
  state.scenario.featureUnlocks??={phone:false,messages:false,contacts:false,shop:false,investment:false,map:false,job:false};
  return state.scenario.featureUnlocks;
}

export function getStoryFeatureAvailability(state,featureId){
  const feature=STORY_FEATURES.find(item=>item.id===featureId);
  const storyPhone=featureId==="phone"&&state.scenario?.unlockedActions?.includes("smartphone-basic");
  const storyJob=featureId==="job"&&state.scenario?.unlockedActions?.includes("day5-work-trial");
  const unlocked=Boolean(ensureStoryFeatureUnlocks(state)[featureId]||storyPhone||storyJob);
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
  const actions=[...DAY1_HOSPITAL_ACTIONS,...DAY2_HOME_ACTIONS,...DAY3_DISCHARGE_ACTIONS,...DAY4_HOME_ACTIONS,...DAY5_OFFICE_ACTIONS];return [1,2,3,4,5].every(day=>STORY_FREE_ACTION_WINDOWS[day].length===1)&&[DAY1_HOSPITAL_ACTIONS,DAY2_HOME_ACTIONS,DAY3_DISCHARGE_ACTIONS,DAY4_HOME_ACTIONS,DAY5_OFFICE_ACTIONS].every(items=>items.length===5)&&new Set(actions.map(action=>`${action.id}`)).size===actions.length&&STORY_FEATURES.length===6;
}
