import { STORY_OUTFIT_ASSETS } from "./story-outfit-assets.mjs?v=3";
import { DAY12_PRESENTATION_SCENES } from "./day12-presentation-data.mjs";

const ID="m30-day12-current-account-review";
const n=text=>({type:"narration",text});
const d=(speaker,text,expressionId="calm")=>({type:"dialogue",speaker,text,expressionId});
const enter=(characterId,expressionId="calm")=>({type:"characterEnter",characterId,expressionId,animationId:"idle-breathe"});
const choice=options=>({type:"choice",options});
const scene=(key,label)=>{const view=DAY12_PRESENTATION_SCENES[key];return [{type:"transition",style:view.transition,label,backgroundId:view.backgroundId,characterId:view.characterId,characterAssetUrl:STORY_OUTFIT_ASSETS[view.characterAssetKey],expressionId:view.expressionId,poseId:view.poseId,bgmId:view.bgm.category,camera:view.camera},...view.sfx.map(sfxId=>({type:"sfx",sfxId}))];};

export const LOCKED_DAY12_SCENE_ID=ID;
export const DAY12_VERIFY_CHOICES=Object.freeze([
  {id:"account12_verify_owner_statement",label:"명의와 최근 명세서 발행일만 공식 앱에서 대조한다"},
  {id:"account12_verify_support_call",label:"명세서의 공식 번호로 현재 접근 권한부터 문의한다"},
  {id:"account12_verify_living_entries",label:"이번 달 생활비 항목 세 건만 영수증과 대조한다"}
]);
export const DAY12_EXPENSE_CHOICES=Object.freeze([
  {id:"account12_expense_personal_only",label:"내 명의의 고정 생활비만 현재 예산표에 넣는다"},
  {id:"account12_expense_shared_unconfirmed",label:"공동으로 보이는 비용은 소유권 미확인 칸에 둔다"},
  {id:"account12_expense_source_labels",label:"각 비용에 결제 계정·사용 목적·확인자를 따로 표시한다"}
]);
export const DAY12_ACCESS_CHOICES=Object.freeze([
  {id:"account12_access_read_only",label:"잔액·명세·고정 생활비만 읽기 전용으로 연다"},
  {id:"account12_access_monthly_review",label:"월 1회 현재 생활비 검토만 일정에 저장한다"},
  {id:"account12_access_separate_investment",label:"생활 계정 확인과 투자·저축 판단을 완전히 분리한다"}
]);

function verifyReaction(id){
  if(id==="account12_verify_support_call")return [d("나","명세서에 적힌 공식 번호로 현재 접근 권한과 제한부터 물을게."),d("하은","내가 아는 비밀번호나 과거 사용법은 말하지 않을게.","calm"),n("과거 기억 대신 공식 채널이 현재 계정의 입구가 되었다.")];
  if(id==="account12_verify_living_entries")return [d("나","이번 달 전기, 통신, 관리비 세 건만 영수증과 대조하자."),d("하은","금액이 같아도 누가 부담하기로 했는지는 별도 확인으로.","calm"),n("거래의 존재와 관계 안의 의미가 서로 다른 칸에 남았다.")];
  return [d("나","명의와 최근 명세서 발행일만 확인하고 과거 내역은 닫아 둘게."),d("하은","숫자를 봤다는 이유로 오늘 판단까지 해야 하는 건 아니니까.","smile"),n("현재 소유권을 확인하는 일과 돈을 움직이는 결정이 분리됐다.")];
}
function expenseReaction(id){
  if(id==="account12_expense_shared_unconfirmed")return [d("나","공동으로 보이는 비용은 소유권 미확인으로 둘게."),d("하은","우리 관계를 근거로 절반씩이라고 정하지 않는 거지.","calm"),n("함께 사용한 흔적은 곧바로 공동 채무나 공동 자산이 되지 않았다.")];
  if(id==="account12_expense_source_labels")return [d("나","결제 계정, 사용 목적, 확인자를 각각 붙이자."),d("하은","그러면 내 설명도 출처 하나일 뿐 결론은 아니겠네.","smile"),n("같은 비용을 둘러싼 사실과 증언이 섞이지 않게 표시됐다.")];
  return [d("나","우선 내 명의로 공식 확인된 고정 생활비만 예산표에 넣을게."),d("하은","내 비용은 내가 관리하고 필요한 공동 항목만 새로 합의하자.","calm"),n("현재 예산은 기억 속 공동생활이 아니라 확인된 개인 책임에서 시작됐다.")];
}
function accessReaction(id){
  if(id==="account12_access_monthly_review")return [d("나","매일 잔액을 확인하지 않고 월 1회 현재 생활비만 검토하자."),d("하은","불안을 줄이려고 감시 습관을 만드는 대신 주기를 정하는 거네.","smile"),n("계정 접근은 상시 확인이 아니라 목적과 주기가 있는 생활 도구가 되었다.")];
  if(id==="account12_access_separate_investment")return [d("나","생활 계정은 확인하되 투자와 저축 이동은 별도 동의 전까지 잠글게."),d("하은","잔액을 찾았다고 위험을 감수할 권한까지 복구된 건 아니니까.","calm"),n("돈을 볼 수 있는 권한과 돈을 위험에 놓는 판단 권한이 분리됐다.")];
  return [d("나","잔액, 현재 명세, 고정 생활비만 읽기 전용으로 열게."),d("하은","송금과 투자 버튼은 계속 닫아 두고.","smile"),n("기본 금융 확인은 가능해졌지만 자산을 움직이는 기능은 잠긴 채 남았다.")];
}

function day11AnchorCallback(state){const id=state.storyFlags?.day11AnchorStrategy;if(id==="life11_anchor_work")return [n("합의한 근무 블록 뒤에만 계정 확인 시간을 붙였다.")];if(id==="life11_anchor_shared")return [n("개인 확인 카드의 함께 볼 항목에 현재 명의와 명세만 추가했다.")];return [n("복약·휴식 사이에 짧은 계정 확인 시간을 배치했다.")];}
function day11ConflictCallback(state){const id=state.storyFlags?.day11ConflictStrategy;if(id==="life11_conflict_owner_decides")return [n("일정이 겹치면 계정의 주인인 내가 유지·축소·이동 중 하나를 고르기로 한 규칙을 다시 확인했다.")];if(id==="life11_conflict_buffer")return [n("보호 시간 안에서는 공식 문의 한 건만 처리하기로 범위를 줄였다.")];return [n("증상이나 외래 일정과 겹치면 금융 확인을 옮기는 건강 우선 규칙을 적용했다.")];}
function day11ShareCallback(state){const id=state.storyFlags?.day11ShareStrategy;if(id==="life11_share_weekly_review")return [n("오늘 결과를 저장한 뒤 주말 검토 전까지 반복 확인하지 않기로 했다.")];if(id==="life11_share_separate_ownership")return [n("개인 명세는 닫고 공동 후보 항목만 서로 확인하는 소유권 분리 규칙을 유지했다.")];return [n("현재 생활에 영향을 주는 변경만 공유하고 나머지 잔액 정보는 개인 기록에 남겼다.")];}

const segment0=state=>[
  ...scene("S01_NO_MOVEMENT_DAY","DAY 12 · 현재 계정의 주인"),enter("girlfriend","smile"),n("식탁에는 어제 만든 확인 목록, 최근 공과금 세 장, 봉인된 계정 안내서와 임시 결제 영수증이 놓여 있었다."),...day11AnchorCallback(state),
  d("하은","잔액을 알게 돼도 오늘은 돈을 움직이지 않는 날로 하자."),d("나","명의, 공식 접근, 현재 생활비까지만. 투자와 과거 소비는 닫아 두고."),
  ...scene("S02_OFFICIAL_SOURCE","SCENE 02 · 공식 출처만 남기기"),enter("girlfriend","calm"),n("휴대폰의 검색 결과 대신 명세서에 적힌 공식 앱 주소와 문의 번호를 종이에 옮겼다."),...day11ConflictCallback(state),d("하은","내가 기억하는 비밀번호는 확인된 출처가 아니야."),d("나","복구도 공식 본인 확인으로만 진행할게."),
  ...scene("S03_FIRST_VERIFICATION","SCENE 03 · 첫 확인 범위"),enter("girlfriend","smile"),d("하은","어디서 시작하든 확인과 판단을 같은 버튼으로 누르지는 말자."),choice(DAY12_VERIFY_CHOICES)
];
const segment1=state=>[
  ...verifyReaction(state.storyFlags?.day12VerifyStrategy),...scene("S04_READ_NOT_SPEND","SCENE 04 · 읽기 전용 화면"),enter("girlfriend","calm"),n("본인 확인 뒤 열린 화면에는 현재 잔액과 이번 달 명세 요약이 보였지만 송금·투자 기능은 별도 잠금 상태였다."),
  d("나","금액은 현재 사실이지만 사용 가능 예산이라는 결론은 아니야."),d("하은","보류된 비용과 소유권이 확인되지 않은 항목부터 빼야겠네."),
  ...scene("S05_USED_VS_OWED","SCENE 05 · 생활비의 소유권"),enter("girlfriend","smile"),n("둘은 공식 명세와 영수증을 들고 집 근처 카페에서 현재 생활비 항목만 분류했다."),
  d("하은","같이 쓴 전기와 인터넷도 누가 내기로 했는지는 내가 대신 정할 수 없어."),d("나","관계보다 출처와 현재 합의로 분류하자."),choice(DAY12_EXPENSE_CHOICES)
];
const segment2=state=>[
  ...expenseReaction(state.storyFlags?.day12ExpenseStrategy),...scene("S06_BALANCE_AND_PAUSE","SCENE 06 · 잔액과 선택 사이"),enter("girlfriend","calm"),n("확인된 잔액 옆에는 사용할 수 있는 돈, 보류할 돈, 아직 소유권을 확인할 돈이 서로 다른 색으로 표시됐다."),
  d("하은","숫자가 보이니까 안심되면서도 뭔가 해야 할 것 같은 기분이 들어."),d("나","그 기분도 판단 근거가 되지는 않게 기록만 할게."),
  ...scene("S07_ACCESS_SCOPE","SCENE 07 · 어디까지 열 것인가"),enter("girlfriend","smile"),...day11ShareCallback(state),n("기본 계정 접근이 복구되자 앱은 저축과 투자 메뉴도 함께 활성화할지 물었다."),
  d("하은","확인 기능과 자산 판단을 한꺼번에 열지 않아도 돼."),d("나","오늘 허용할 금융 범위를 따로 정하자."),choice(DAY12_ACCESS_CHOICES)
];
const segment3=state=>[
  ...accessReaction(state.storyFlags?.day12AccessStrategy),...scene("S08_CURRENT_OWNER","SCENE 08 · 현재 생활비 장부"),enter("girlfriend","smile"),n("현재 잔액과 공식 명세, 확인된 고정 생활비가 읽기 전용 장부에 저장됐다. 송금·투자·공동 자산 메뉴는 계속 잠겨 있었다."),
  d("하은","돈을 찾은 날이 아니라 돈을 확인하는 규칙을 만든 날이네.","smile"),d("나","다음 판단도 소유권과 출처를 확인한 뒤에만 열 거야."),
  n("기본 금융 확인은 현재 생활을 운영하는 도구로 복구됐지만, 위험을 감수하거나 관계의 자산을 정하는 권한까지 자동으로 따라오지는 않았다."),
  {type:"transition",style:"fade",label:"DAY 12 END",backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day12,expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];

function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
export function getLockedDay12Segment(state,stage=state.storyFlags?.day12RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay12ResumePresentation(state){const stage=state.storyFlags?.day12RuntimeStage??0;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day12,expressionId:"calm",poseId:"standing"};if(stage===1)return {backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day12,expressionId:"calm",poseId:"phone"};if(stage===2)return {backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day12,expressionId:"calm",poseId:"standing"};return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day12,expressionId:"smile",poseId:"standing"};}
export function applyLockedDay12ChoiceState(state,id){state.storyFlags??={};
  if(DAY12_VERIFY_CHOICES.some(item=>item.id===id)){state.storyFlags.day12VerifyStrategy=id;state.storyFlags.day12RuntimeStage=1;state.storyFlags[id]=true;addCollection(state,"unlockedActions","verified-current-account");return {stage:1};}
  if(DAY12_EXPENSE_CHOICES.some(item=>item.id===id)){state.storyFlags.day12ExpenseStrategy=id;state.storyFlags.day12RuntimeStage=2;state.storyFlags[id]=true;addCollection(state,"unlockedActions","verified-living-expenses");return {stage:2};}
  if(DAY12_ACCESS_CHOICES.some(item=>item.id===id)){state.storyFlags.day12AccessStrategy=id;state.storyFlags.day12RuntimeStage=3;state.storyFlags.day12CurrentAccountReviewPending=false;state.storyFlags.day12CurrentAccountReviewCompleted=true;state.storyFlags.day13CurrentHouseholdBudgetPending=true;state.storyFlags[id]=true;state.scenario??={};state.scenario.featureUnlocks??={};state.scenario.featureUnlocks.finance=true;addCollection(state,"clues","verified-current-account-record");addCollection(state,"unlockedActions","basic-finance-review","account-ownership-boundary");addCollection(state,"followUpHooks","day13-current-household-budget");return {stage:3};}
  return null;}
export function getLockedDay12LegacyChoice(state){return state.storyFlags?.day12AccessStrategy??"account12_access_separate_investment";}
export function validateLockedDay12Runtime(){const state={storyFlags:{day11AnchorStrategy:"life11_anchor_recovery",day11ConflictStrategy:"life11_conflict_owner_decides",day11ShareStrategy:"life11_share_changes_only",day12VerifyStrategy:"account12_verify_owner_statement",day12ExpenseStrategy:"account12_expense_source_labels",day12AccessStrategy:"account12_access_separate_investment"}};const all=[...segment0(state),...segment1(state),...segment2(state),...segment3(state)];const transitions=all.filter(step=>step.type==="transition");return transitions.length===9&&transitions.slice(0,8).every(step=>step.camera&&step.bgmId==="daily")&&all.filter(step=>step.type==="sfx").length===16&&all.filter(step=>step.type==="choice").length===3&&all.at(-1)?.type==="sceneEnd";}
