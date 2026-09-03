import { STORY_OUTFIT_ASSETS } from "./story-outfit-assets.mjs?v=2";
import { DAY11_PRESENTATION_SCENES } from "./day11-presentation-data.mjs";

const ID="m30-day11-current-life-plan";
const n=text=>({type:"narration",text});
const d=(speaker,text,expressionId="calm")=>({type:"dialogue",speaker,text,expressionId});
const enter=(characterId,expressionId="calm")=>({type:"characterEnter",characterId,expressionId,animationId:"idle-breathe"});
const choice=options=>({type:"choice",options});
const scene=(key,label)=>{
  const view=DAY11_PRESENTATION_SCENES[key];
  return [
    {type:"transition",style:view.transition,label,backgroundId:view.backgroundId,characterId:view.characterId,characterAssetUrl:view.characterId==="girlfriend"?STORY_OUTFIT_ASSETS.day8:undefined,expressionId:view.expressionId,poseId:view.poseId,bgmId:view.bgm.category,camera:view.camera},
    ...view.sfx.map(sfxId=>({type:"sfx",sfxId}))
  ];
};

export const LOCKED_DAY11_SCENE_ID=ID;
export const DAY11_ANCHOR_CHOICES=Object.freeze([
  {id:"life11_anchor_recovery",label:"복약·외래·수면을 고정하고 나머지 일정을 그 사이에 둔다"},
  {id:"life11_anchor_work",label:"합의된 근무 블록을 먼저 두고 앞뒤에 회복 시간을 확보한다"},
  {id:"life11_anchor_shared",label:"혼자 할 일과 함께할 약속을 서로 다른 색으로 먼저 표시한다"}
]);
export const DAY11_CONFLICT_CHOICES=Object.freeze([
  {id:"life11_conflict_health_first",label:"증상이나 진료 일정과 겹치면 다른 약속을 자동 이동한다"},
  {id:"life11_conflict_owner_decides",label:"겹친 일정의 주인이 유지·축소·이동 중 하나를 직접 고른다"},
  {id:"life11_conflict_buffer",label:"중요 일정 사이에 비워 둔 완충 시간을 먼저 사용한다"}
]);
export const DAY11_SHARE_CHOICES=Object.freeze([
  {id:"life11_share_changes_only",label:"하은과는 변경된 시간과 필요한 도움만 공유한다"},
  {id:"life11_share_weekly_review",label:"주말에 한 번만 함께 생활표를 검토한다"},
  {id:"life11_share_separate_ownership",label:"개인 일정은 각자 관리하고 공동 약속만 함께 수정한다"}
]);

function day10RhythmCallback(state){
  const id=state.storyFlags?.day10RhythmStrategy;
  if(id==="work10_rhythm_symptom_check")return n("증상·집중도 확인표를 펼치고, 생활표의 근무 카드에도 다음 블록을 여는 조건을 적었다.");
  if(id==="work10_rhythm_task_milestones")return n("어제 정한 되돌릴 수 있는 세 작업과 강제 중단선을 근무 카드의 완료 기준으로 옮겼다.");
  return n("어제 지킨 45분 업무·10분 휴식·45분 업무 틀을 늘리지 않은 채 근무 카드에 옮겼다.");
}
function day10LunchCallback(state){
  const id=state.storyFlags?.day10LunchStrategy;
  if(id==="work10_lunch_one_question_each")return n("업무일 점심에는 서진과 민호에게 서로 다른 질문 하나씩만 남기고 종료 시각을 함께 적었다.");
  if(id==="work10_lunch_quiet_recovery")return n("업무일 점심은 질문 없이 식사·복약·조용한 휴식을 보장하는 칸으로 표시됐다.");
  return n("업무일 점심에는 각자의 현재 역할과 최근 바뀐 일만 확인한다는 범위를 적었다.");
}
function day10DebriefCallback(state){
  const id=state.storyFlags?.day10DebriefStrategy;
  if(id==="work10_debrief_adjust_one_block")return n("마지막 검토에는 피로가 높았던 한 블록만 줄이고 나머지 조건은 유지한다고 적었다.");
  if(id==="work10_debrief_keep_rhythm")return n("마지막 검토에는 어제의 시간 틀을 늘리지 않은 채 다음 주 후보로 남겼다.");
  return n("마지막 검토에는 업무 결과·회복 상태·동료 관계를 서로 다른 열로 남겼다.");
}

function anchorReaction(id){
  if(id==="life11_anchor_work")return [d("나","합의된 근무 블록을 먼저 놓되 앞뒤 한 시간은 회복으로 비우자."),d("하은","일이 늘면 회복 칸을 줄이는 게 아니라 다시 합의하는 거야.","calm"),n("근무는 하루의 주인이 아니라 보호된 여러 일정 중 하나가 되었다.")];
  if(id==="life11_anchor_shared")return [d("나","혼자 할 일은 파랑, 같이할 약속은 분홍으로 먼저 나눌게."),d("하은","색이 같다고 내가 네 일정 관리자가 되는 건 아니고.","smile"),n("함께하는 시간과 대신 관리하는 일의 경계가 달력 위에서도 분리됐다.")];
  return [d("나","약, 외래, 수면부터 고정하고 회사와 약속은 그 사이에 놓자."),d("하은","회복을 남는 시간에 하는 일이 아니게 만드는 거네.","smile"),n("몸의 기준이 일정 실패의 핑계가 아니라 계획의 첫 조건으로 기록됐다.")];
}
function conflictReaction(id){
  if(id==="life11_conflict_owner_decides")return [d("나","겹친 일정의 주인이 유지, 축소, 이동 중 하나를 직접 고르게 하자."),d("하은","서로 좋은 뜻으로 대신 취소하지 않기.","calm"),n("배려는 상대의 선택권을 가져가는 일이 아니라 선택지를 보존하는 규칙이 됐다.")];
  if(id==="life11_conflict_buffer")return [d("나","일정 사이에 비워 둔 완충 시간을 먼저 쓰고, 부족하면 그때 이동하자."),d("하은","빈칸도 약속처럼 지켜야 작동하겠네.","smile"),n("아무것도 적히지 않은 시간이 생활을 지키는 실제 자원으로 남았다.")];
  return [d("나","증상이나 진료와 겹치면 다른 약속은 자동으로 옮기자."),d("하은","건강 우선은 허락을 다시 받을 필요 없는 공통 규칙으로.","calm"),n("급한 순간에 관계나 업무 성과를 증명하지 않아도 되는 우선순위가 생겼다.")];
}
function shareReaction(id){
  if(id==="life11_share_weekly_review")return [d("나","주중에는 각자 관리하고 주말에 한 번만 같이 검토하자."),d("하은","매일 확인하지 않아도 기다릴 수 있는 약속이네.","smile"),n("공유는 감시가 아니라 정해진 주기의 공동 점검이 되었다.")];
  if(id==="life11_share_separate_ownership")return [d("나","개인 일정은 각자 수정하고 공동 약속만 함께 바꾸자."),d("하은","연인이라는 이유로 모든 시간을 공동 소유하지 않기.","calm"),n("같이 사는 계획과 각자의 시간은 한 달력 안에서 다른 권한을 가졌다.")];
  return [d("나","변경된 시간과 필요한 도움만 공유할게. 그대로인 일정은 다시 보고하지 않고."),d("하은","정보가 없다는 걸 문제로 만들지 않고 필요한 변화만 믿는 거네.","smile"),n("연락은 하루 전체의 보고서가 아니라 합의가 달라질 때 쓰는 도구가 됐다.")];
}

const segment0=state=>[
  ...scene("S01_HOME_CARDS","DAY 11 · 카드가 먼저인 아침"),enter("girlfriend","smile"),n("식탁에는 병원 문자, 회사 확인서, 장보기 메모와 빈 카드가 놓여 있었다."),
  d("하은","분홍은 공동 약속. 네가 싫으면 오늘부로 분홍 실직.","smile"),d("나","색은 죄가 없지. 누가 수정할 수 있는지가 문제고."),d("하은","좋아. 색연필은 무죄, 무단 수정은 유죄.","smile"),day10RhythmCallback(state),
  ...scene("S02_TWO_DATES","SCENE 02 · 두 날짜"),enter("girlfriend","calm"),n("병원 안내 카드 옆에서 냉장고 자석 아래 오래된 손글씨 메모가 나왔다. 메모에는 목요일 재활·하은 동행, 현재 안내에는 금요일 외래·보호자 동행 선택이라고 적혀 있었다."),
  d("나","목요일과 금요일. 진료 종류도 다르네."),d("하은","중간에 바뀐 것 같아. 그런데 내가 언제 적었는지는 자신 없어.","calm"),d("나","변경됐을 수도 있고 다른 주 메모일 수도 있어. 지금 확정되는 건 금요일 안내뿐이야."),d("하은","내 기억도 출처 없으면 미확인. 규칙이 사람 봐주면 규칙이 아니지.","calm"),
  ...scene("S03_FIRST_ANCHOR","SCENE 03 · 한 주의 첫 기준"),enter("girlfriend","smile"),d("하은","병원, 회사, 우리 약속. 셋 다 중요하다고만 쓰면 겹치는 순간 다시 싸우게 돼.","calm"),d("나","먼저 고정할 기준 하나와 움직일 때 적용할 규칙을 따로 정하자."),choice(DAY11_ANCHOR_CHOICES)
];
const segment1=state=>[
  ...anchorReaction(state.storyFlags?.day11AnchorStrategy),...scene("S04_REAL_WALK_TIME","SCENE 04 · 지도보다 긴 십 분"),enter("girlfriend","smile"),
  n("둘은 달력에 적을 실제 이동 시간을 확인하려 집에서 약국과 정류장, 작은 마트까지 걸었다."),n("지도에는 십 분이었지만 신호를 기다리고 벤치에서 쉬자 십칠 분이 걸렸다."),d("하은","지도 앱한테 네 회복 속도 업데이트 요청할까?","smile"),d("나","앱을 고치는 것보다 달력에 칠 분 더 쓰는 게 빠르지."),day10LunchCallback(state),
  ...scene("S05_OVERLAP_CAFE","SCENE 05 · 겹친 오후"),enter("girlfriend","calm"),n("카페에서 정리하던 중 다음 외래 예약과 회사의 선택 가능한 방문 시간이 같은 오후에 겹친 것을 발견했다."),
  d("하은","내가 회사 시간을 옮기라고 정하면 네 선택을 대신하는 거고, 둘 다 둬도 결국 무리야."),d("나","겹친 일정에 적용할 공통 규칙을 먼저 정하자."),choice(DAY11_CONFLICT_CHOICES)
];
const segment2=state=>[
  ...conflictReaction(state.storyFlags?.day11ConflictStrategy),...scene("S06_BUFFER_PARK","SCENE 06 · 비어 있어서 쓰는 시간"),enter("girlfriend","smile"),
  n("공원 벤치에서 이동 시간과 휴식 시간을 달력의 빈칸으로 옮겼다."),d("하은","빈칸이면 약속을 넣는 게 아니라, 비어 있는 역할을 하는 거네.","calm"),d("나","이동이 늦어지거나 몸이 먼저 멈출 때 쓰는 시간."),d("하은","그럼 이름 붙이자. 아무것도 안 해서 제일 바쁜 칸.","smile"),
  ...scene("S07_SHARE_SCOPE","SCENE 07 · 같은 달력, 다른 열쇠"),enter("girlfriend","calm"),n("집에 돌아와 두 휴대폰에 같은 달력 전체를 복사하려다 공유 범위 화면에서 멈췄다."),
  d("나","같은 계획을 쓴다고 서로의 모든 일정을 볼 필요는 없어."),d("하은","공동 약속과 필요한 도움만 어디까지 공유할지 정하자."),choice(DAY11_SHARE_CHOICES)
];
const segment3=state=>[
  ...shareReaction(state.storyFlags?.day11ShareStrategy),...scene("S08_UPDATEABLE_PLAN","SCENE 08 · 업데이트 가능한 우리"),enter("girlfriend","smile"),
  n("달력에는 회복 일정, 근무 블록, 개인 시간, 공동 약속과 보호된 빈칸이 서로 다른 권한으로 저장됐다."),d("하은","이건 우리가 예전에 어떻게 살았는지 보여 주는 달력이 아니야.","calm"),
  d("나","지금부터 어떤 정보를 함께 쓰고 어디서 멈출지 보여 주는 달력이야."),day10DebriefCallback(state),d("하은","그럼 바뀌어도 실패가 아니라 업데이트네. 우리 둘 다 업데이트 알림은 선택으로.","smile"),
  n("예비폰에 현재 계정 확인 필요라는 시스템 알림이 떴다. 잔액·명의·비밀번호는 보이지 않았다."),d("나","내일 확인할 건 계정의 주인과 읽을 범위까지."),d("하은","좋아. 숫자랑 싸우기 전에 오늘 저녁이랑 먼저 화해하자.","smile"),
  n("한 주 생활표는 기억을 대신하는 정답이 아니라 현재의 몸과 일, 관계를 함께 운영하는 첫 계획이 되었다."),
  {type:"transition",style:"fade",label:"DAY 11 END",backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];

function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
export function getLockedDay11Segment(state,stage=state.storyFlags?.day11RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay11ResumePresentation(state){const stage=state.storyFlags?.day11RuntimeStage??0;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};if(stage===1)return {backgroundId:"neighborhood-street-day",characterId:null};if(stage===2)return {backgroundId:"neighborhood-park-day",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};}
export function applyLockedDay11ChoiceState(state,id){state.storyFlags??={};
  if(DAY11_ANCHOR_CHOICES.some(item=>item.id===id)){state.storyFlags.day11AnchorStrategy=id;state.storyFlags.day11RuntimeStage=1;state.storyFlags.day11ScheduleNoteMismatch="unverified";state.storyFlags[id]=true;addCollection(state,"clues","day11-schedule-note-mismatch");addCollection(state,"unlockedActions","current-week-anchor");return {stage:1};}
  if(DAY11_CONFLICT_CHOICES.some(item=>item.id===id)){state.storyFlags.day11ConflictStrategy=id;state.storyFlags.day11RuntimeStage=2;state.storyFlags[id]=true;addCollection(state,"unlockedActions","schedule-conflict-rule");return {stage:2};}
  if(DAY11_SHARE_CHOICES.some(item=>item.id===id)){state.storyFlags.day11ShareStrategy=id;state.storyFlags.day11RuntimeStage=3;state.storyFlags.day11CurrentLifePlanPending=false;state.storyFlags.day11CurrentLifePlanCompleted=true;state.storyFlags.day12CurrentAccountReviewPending=true;state.storyFlags[id]=true;addCollection(state,"clues","current-week-plan-record");addCollection(state,"unlockedActions","shared-calendar-boundary","protected-buffer-time");addCollection(state,"followUpHooks","day12-current-account-review");return {stage:3};}
  return null;}
export function getLockedDay11LegacyChoice(state){return state.storyFlags?.day11ShareStrategy??"life11_share_changes_only";}
export function validateLockedDay11Runtime(){const state={storyFlags:{day11AnchorStrategy:"life11_anchor_recovery",day11ConflictStrategy:"life11_conflict_owner_decides",day11ShareStrategy:"life11_share_changes_only"}};const all=[...segment0(state),...segment1(state),...segment2(state),...segment3(state)];return all.filter(step=>step.type==="transition").length>=8&&all.filter(step=>step.type==="choice").length===3&&all.at(-1)?.type==="sceneEnd";}
