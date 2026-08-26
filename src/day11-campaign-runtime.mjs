import { STORY_OUTFIT_ASSETS } from "./story-outfit-assets.mjs?v=2";

const ID="m30-day11-current-life-plan";
const n=text=>({type:"narration",text});
const d=(speaker,text,expressionId="calm")=>({type:"dialogue",speaker,text,expressionId});
const enter=(characterId,expressionId="calm")=>({type:"characterEnter",characterId,expressionId,animationId:"idle-breathe"});
const transition=(label,backgroundId,characterId,expressionId="calm")=>({type:"transition",style:"crossfade",label,backgroundId,characterId,characterAssetUrl:characterId==="girlfriend"?STORY_OUTFIT_ASSETS.day8:undefined,expressionId,poseId:"standing",bgmId:"daily"});
const choice=options=>({type:"choice",options});

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

const segment0=()=>[
  transition("DAY 11 · 현재 생활표", "home-morning", "girlfriend", "smile"),enter("girlfriend","smile"),n("식탁에는 병원 일정, 다음 근무 블록, 장보기와 둘의 약속이 적힌 카드가 서로 겹치지 않은 채 놓여 있었다."),
  d("하은","예전 생활을 복원하는 달력 말고 지금 확인한 것만 놓자.","calm"),d("나","누가 기억하는 일정이 아니라 출처와 주인이 있는 일정만."),
  transition("SCENE 02 · 출처가 있는 시간", "day2-home-entry", "girlfriend", "calm"),enter("girlfriend","calm"),n("병원 문자는 진료 카드 옆에, 회사 일정은 팀장 확인서 옆에, 공동 약속은 둘이 보낸 메시지 옆에 놓였다."),
  d("하은","내 기억만 근거인 약속은 미확인 칸에 둘게."),d("나","빈칸을 없애려고 새 약속으로 덮지 말자."),
  transition("SCENE 03 · 한 주의 첫 기준", "home-morning", "girlfriend", "smile"),enter("girlfriend","smile"),d("하은","무엇을 먼저 고정할지 정하면 나머지 카드의 자리가 보일 것 같아."),choice(DAY11_ANCHOR_CHOICES)
];
const segment1=state=>[
  ...anchorReaction(state.storyFlags?.day11AnchorStrategy),transition("SCENE 04 · 직접 확인하는 생활 반경", "neighborhood-street-day", null),
  n("둘은 달력에 적을 실제 이동 시간을 확인하려 집에서 약국과 정류장, 작은 마트까지 걸었다."),n("지도상의 거리와 회복 중인 몸이 쓰는 시간은 달랐다. 신호 대기와 쉬는 벤치까지 포함하자 일정 사이에는 예상보다 큰 간격이 필요했다."),
  transition("SCENE 05 · 겹친 두 카드", "neighborhood-cafe-day", "girlfriend", "calm"),enter("girlfriend","calm"),n("카페에서 정리하던 중 다음 외래 예약과 회사의 선택 가능한 방문 시간이 같은 오후에 겹친 것을 발견했다."),
  d("하은","내가 회사 시간을 옮기라고 정하면 네 선택을 대신하는 거고, 둘 다 둬도 결국 무리야."),d("나","겹친 일정에 적용할 공통 규칙을 먼저 정하자."),choice(DAY11_CONFLICT_CHOICES)
];
const segment2=state=>[
  ...conflictReaction(state.storyFlags?.day11ConflictStrategy),transition("SCENE 06 · 빈칸의 용도", "neighborhood-park-day", "girlfriend", "smile"),enter("girlfriend","smile"),
  n("공원 벤치에서 이동 시간과 휴식 시간을 달력의 빈칸으로 옮겼다."),d("하은","비어 있다고 약속을 넣어도 되는 시간이 아니네.","calm"),d("나","회복과 변경을 위한 예약된 빈칸으로 표시할게."),
  transition("SCENE 07 · 공유의 범위", "day2-home-entry", "girlfriend", "calm"),enter("girlfriend","calm"),n("집에 돌아와 두 휴대폰에 같은 달력 전체를 복사하려다 손을 멈췄다."),
  d("나","같은 계획을 쓴다고 서로의 모든 일정을 볼 필요는 없어."),d("하은","공동 약속과 필요한 도움만 어디까지 공유할지 정하자."),choice(DAY11_SHARE_CHOICES)
];
const segment3=state=>[
  ...shareReaction(state.storyFlags?.day11ShareStrategy),transition("SCENE 08 · 오늘부터 쓰는 달력", "home-morning", "girlfriend", "smile"),enter("girlfriend","smile"),
  n("달력에는 회복 일정, 근무 블록, 개인 시간, 공동 약속과 보호된 빈칸이 서로 다른 권한으로 저장됐다."),d("하은","이건 우리가 예전에 어떻게 살았는지 보여 주는 달력이 아니야.","calm"),
  d("나","지금부터 어떤 정보를 함께 쓰고 어디서 멈출지 보여 주는 달력이야."),d("하은","그럼 바뀌어도 실패가 아니라 업데이트네.","smile"),
  n("한 주 생활표는 기억을 대신하는 정답이 아니라 현재의 몸과 일, 관계를 함께 운영하는 첫 계획이 되었다."),
  {type:"transition",style:"fade",label:"DAY 11 END",backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];

function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
export function getLockedDay11Segment(state,stage=state.storyFlags?.day11RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay11ResumePresentation(state){const stage=state.storyFlags?.day11RuntimeStage??0;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};if(stage===1)return {backgroundId:"neighborhood-street-day",characterId:null};if(stage===2)return {backgroundId:"neighborhood-park-day",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};}
export function applyLockedDay11ChoiceState(state,id){state.storyFlags??={};
  if(DAY11_ANCHOR_CHOICES.some(item=>item.id===id)){state.storyFlags.day11AnchorStrategy=id;state.storyFlags.day11RuntimeStage=1;state.storyFlags[id]=true;addCollection(state,"unlockedActions","current-week-anchor");return {stage:1};}
  if(DAY11_CONFLICT_CHOICES.some(item=>item.id===id)){state.storyFlags.day11ConflictStrategy=id;state.storyFlags.day11RuntimeStage=2;state.storyFlags[id]=true;addCollection(state,"unlockedActions","schedule-conflict-rule");return {stage:2};}
  if(DAY11_SHARE_CHOICES.some(item=>item.id===id)){state.storyFlags.day11ShareStrategy=id;state.storyFlags.day11RuntimeStage=3;state.storyFlags.day11CurrentLifePlanPending=false;state.storyFlags.day11CurrentLifePlanCompleted=true;state.storyFlags.day12CurrentAccountReviewPending=true;state.storyFlags[id]=true;addCollection(state,"clues","current-week-plan-record");addCollection(state,"unlockedActions","shared-calendar-boundary","protected-buffer-time");addCollection(state,"followUpHooks","day12-current-account-review");return {stage:3};}
  return null;}
export function getLockedDay11LegacyChoice(state){return state.storyFlags?.day11ShareStrategy??"life11_share_changes_only";}
export function validateLockedDay11Runtime(){const state={storyFlags:{day11AnchorStrategy:"life11_anchor_recovery",day11ConflictStrategy:"life11_conflict_owner_decides",day11ShareStrategy:"life11_share_changes_only"}};const all=[...segment0(state),...segment1(state),...segment2(state),...segment3(state)];return all.filter(step=>step.type==="transition").length>=8&&all.filter(step=>step.type==="choice").length===3&&all.at(-1)?.type==="sceneEnd";}
