import {DAY8_PRESENTATION_SCENES} from "./day8-presentation-data.mjs";
import {STORY_OUTFIT_ASSETS} from "./story-outfit-assets.mjs?v=2";

const ID="m30-day8-independent-errand";
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const choice=options=>({type:"choice",options});
const enter=(expressionId="calm",poseId="standing")=>({type:"characterEnter",characterId:"girlfriend",expressionId,poseId,animationId:"idle-breathe"});
const branchBackground=(view,state)=>view.branchBackgrounds?.[state.storyFlags?.day8CheckInStrategy]??view.backgroundId;
const scene=(key,label,state={})=>{const view=DAY8_PRESENTATION_SCENES[key];return [{type:"transition",style:view.transition,label,backgroundId:branchBackground(view,state),characterId:view.characterId,characterAssetUrl:view.characterId==="girlfriend"?STORY_OUTFIT_ASSETS.day8:undefined,expressionId:view.expressionId,poseId:view.poseId,bgmId:view.bgm.category},{type:"sfx",sfxId:view.sfx[0]}].filter(step=>step.type!=="sfx"||step.sfxId);};

export const LOCKED_DAY8_SCENE_ID=ID;
export const DAY8_CHECKIN_CHOICES=Object.freeze([
  {id:"errand8_change_only_checkin",label:"경로·몸 상태·귀가 시각이 바뀔 때만 먼저 연락한다"},
  {id:"errand8_timed_checkin",label:"생활용품점에 도착한 뒤 정한 시각에 한 번 상태를 알린다"},
  {id:"errand8_return_only_report",label:"중간 보고는 생략하고 정한 귀가 시각을 넘길 때만 연락한다"}
]);
export const DAY8_PURCHASE_CHOICES=Object.freeze([
  {id:"errand8_compare_labels",label:"성분과 용량을 비교해 현재 생활에 맞는 제품을 고른다"},
  {id:"errand8_ask_current_need",label:"하은에게 지금 필요한 조건 하나만 묻고 내가 최종 결정한다"},
  {id:"errand8_buy_small_test",label:"가장 작은 용량을 시험 구매하고 사용 뒤 다음 선택을 남긴다"}
]);
export const DAY8_SHARE_CHOICES=Object.freeze([
  {id:"errand8_sort_receipt_together",label:"영수증과 우편물을 함께 분류하며 처리 결과를 공유한다"},
  {id:"errand8_explain_decision_log",label:"관찰·가능성·확인·선택 순서로 판단 기록을 설명한다"},
  {id:"errand8_set_next_solo_boundary",label:"오늘의 예외를 정리하고 다음 혼자 외출의 경계를 합의한다"}
]);

function day7OpeningCallback(state){
  const id=state.storyFlags?.day7OpeningStrategy;
  if(id==="date7_lead_first_leg")return [n("어제 첫 이동을 맡았던 표 아래 오늘의 혼자 처리 칸이 이어졌다."),d("하은","어제 첫 길은 네가 정했지. 오늘은 우편함부터 네 순서야.","smile")];
  if(id==="date7_follow_then_switch")return [n("어제 목적지와 지도 역할을 바꿨던 표를 오늘은 ‘같이 확인’과 ‘혼자 처리’ 두 칸으로 나눴다."),d("하은","약은 같이 확인하고, 현관 밖부터는 역할 교대. 오늘은 네가 지도 담당.","smile")];
  return [n("어제처럼 거리와 체력을 비교하려고 우편함·생활용품점·귀가 대안을 나란히 적었다."),d("하은","후보 비교부터 하는 사람답게, 세제보다 귀가 대안이 먼저네.","smile")];
}

function day7RecoveryCallback(state){
  const id=state.storyFlags?.day7RecoveryStrategy;
  if(id==="date7_return_now_reschedule")return [d("나","어제처럼 상태가 바뀌면 바로 돌아오고 남은 일은 미룬다."),d("하은","미룬 건 실패가 아니었지. 오늘도 같은 규칙.","calm")];
  if(id==="date7_end_activity_keep_meal")return [d("나","증상이 생기면 필수 구매만 남기고 나머지는 끝낸다."),d("하은","생활용품점 구경을 새 활동으로 늘리지 않기. 확인.","calm")];
  return [d("나","어지러우면 십 분 쉬고 동선을 줄인다. 호전되지 않으면 귀가."),d("하은","시간하고 상태를 둘 다 확인한 다음 결정하기.","calm")];
}

function day7MemoryCallback(state){
  const id=state.storyFlags?.day7MemoryStrategy;
  if(id==="date7_record_shared_photo")return [n("어제 책과 영수증을 찍은 사진 옆에 오늘 가져갈 봉투와 장바구니를 놓았다."),d("하은","오늘 사진은 출발 전 물건만. 돌아오면 네가 고른 걸로 바뀌겠네.","smile")];
  if(id==="date7_record_two_sentences")return [n("임시 예비폰 메모 첫 줄에는 ‘멈춘 건 실패가 아니었다’가 남아 있었다."),d("하은","오늘 두 번째 문장은 네가 돌아와서 정해.","smile")];
  return [n("‘계획은 함께, 변경은 실패 아님’ 아래에 오늘의 연락 조건을 적을 빈칸이 있었다."),d("하은","규칙을 만들었으니까 오늘은 진짜로 써 보자.","smile")];
}

function checkinReaction(id){
  if(id==="errand8_change_only_checkin")return [d("나","경로, 몸 상태, 귀가 시각 중 하나가 바뀔 때만 먼저 연락할게."),d("하은","그 전에는 내가 ‘어디야?’ 금지. 변경 연락이 오면 바로 확인.","calm")];
  if(id==="errand8_timed_checkin")return [d("나","생활용품점 도착 뒤 열한 시 사십 분에 한 번 상태를 알릴게."),d("하은","시간 전에는 재촉 안 하고, 한 번 확인하면 다음은 귀가 때.","calm")];
  return [d("나","중간 보고는 생략하고 열두 시 십 분을 넘길 때만 연락할게."),d("하은","알겠어. 정한 시각 전에는 연락하고 싶은 쪽이 참는 규칙.","calm")];
}

function purchaseReaction(id){
  if(id==="errand8_compare_labels")return [n("향보다 성분과 세탁 횟수당 용량을 비교해 무향에 가까운 제품을 골랐다."),d("나","과거 구매 기록 없이도 지금 필요한 조건으로 결정할 수 있다.")];
  if(id==="errand8_ask_current_need")return [n("임시 예비폰으로 ‘향과 세정력 중 지금 더 필요한 것?’이라고 한 번만 물었다."),d("하은","세정력. 최종 선택은 네가 해. 이건 위치 확인 아니니까 계약 위반 아님.","smile"),n("답을 참고해 작은 중성 세제를 골랐고 결정 주체는 바꾸지 않았다.")];
  return [n("두 후보 중 가장 작은 용량 하나를 골라 사용 뒤 다시 판단할 여지를 남겼다."),d("나","모르는 과거 취향을 한 번에 복원하려 하지 않고 현재 사용 결과를 확인한다.")];
}

function shareReaction(id){
  if(id==="errand8_sort_receipt_together")return [n("식탁을 우편물·영수증·보관 세 칸으로 나누고 한 장씩 함께 옮겼다."),d("하은","같이 정리하니까 내가 안 따라가도 오늘이 보여.","smile"),d("나","처리하지 않은 건 따로 두고 내일 다시 확인하자.")];
  if(id==="errand8_explain_decision_log")return [d("나","회원 번호는 모름. 과거 내역 없이 현재 제품을 비교할 수 있음. 조건을 확인하고 작은 단위로 결정했어."),d("하은","결과보다 왜 그렇게 골랐는지가 더 잘 보인다.","smile"),n("하은은 설명 순서를 바꾸지 않고 다음 행동만 마지막 줄에 적었다.")];
  return [d("나","다음에도 우편함과 생활 구매는 혼자. 약과 일정 변경은 같이 확인하자."),d("하은","연락 조건도 출발 전에 네가 고르고, 나는 그 시각까지 기다리기.","smile"),n("두 사람은 보호와 보고를 애정 시험이 아닌 생활 계약으로 저장했다.")];
}

function segment0(state){return [
  ...scene("S01_HOME_SCOPE","DAY 8 · 혼자 할 것, 같이 할 것",state),enter("smile"),
  n("식탁에는 처방 확인 메모, 빈 장바구니, 우편함 열쇠와 임시 예비폰이 놓여 있었다."),
  d("하은","혼자 나가는 날 기념품이 세제면 너무 생활형 로맨스인가?","smile"),d("나","필요한 걸 사 오는 게 목적이면 정확한 장르야."),
  d("하은","좋아. 약은 같이 확인, 우편함과 세제는 혼자."),...day7OpeningCallback(state),...day7RecoveryCallback(state),...day7MemoryCallback(state),
  d("나","원래 휴대폰은 병원 보관 중이고 이건 임시 예비폰. 결제와 기록도 현재 가능한 수단만 쓴다."),
  d("하은","충전량이랑 비상 연락처만 볼게. 화면은 네가 가지고 가.","calm"),
  ...scene("S02_CONTACT_CONTRACT","SCENE 02 · 연락을 사랑의 시험으로 만들지 않기",state),enter("calm","phone"),
  n("하은은 위치 공유 화면을 열지 않고 충전량만 확인한 뒤 휴대폰을 돌려주었다."),
  d("하은","안 궁금한 척은 못 해. 대신 내가 횟수를 정하면 네 심부름이 내 숙제가 되잖아."),d("나","연락 조건은 내가 정하고, 너는 그 조건을 지켜 줘."),
  d("하은","응. 내 규칙도 말할게. 네가 정한 시각 전에는 ‘어디야?’ 금지."),choice(DAY8_CHECKIN_CHOICES)
];}

function segment1(state){return [
  ...checkinReaction(state.storyFlags?.day8CheckInStrategy),...scene("S03_PHARMACY_CONFIRM","SCENE 03 · 같이 확인한 뒤 혼자 나가기",state),enter("smile","phone"),
  n("약국에 전화해 복약 시간과 외출 중단 기준을 스피커폰으로 함께 확인했다."),d("하은","같이 확인할 일은 끝. 이제부터는 네 심부름.","smile"),
  d("나","예정은 우편함, 생활용품점, 귀가. 바뀌면 계약대로 연락할게."),d("하은","잘 다녀와. 세제 향은 과거 정답 말고 오늘 코로 골라.","smile"),
  ...scene("S04_MAILBOX","SCENE 04 · 이름보다 날짜부터",state),
  n("우편함 앞에서 수취인 이름보다 발송일과 처리 기한을 먼저 확인했다."),n("광고지는 분리하고 현재 주소 확인이 필요한 공문 한 장만 투명 파일에 넣었다."),
  d("나","이름이 익숙하다는 느낌보다 날짜와 필요한 행동이 먼저다."),n("확인하지 못한 과거 관계를 추측하지 않고 ‘현재 우편 확인 필요’라고 메모했다."),
  ...scene("S05_STORE_MEMBER","SCENE 05 · 모르는 번호를 억지로 맞히지 않기",state),
  d("직원","회원이면 이전 구매 내역도 볼 수 있어요. 전화번호 뒤 네 자리 기억하세요?"),d("나","기억하지 못합니다. 회원 조회 없이 오늘 결제로 진행할게요."),
  n("모르는 번호를 찍는 것보다 모른다고 말하는 편이 빨랐다."),d("직원","그럼 현재 할인만 적용할게요. 영수증은 종이로 드릴까요?"),
  d("나","종이로 주세요. 상품명과 결제 수단을 확인하겠습니다."),n("필요한 건 과거 구매 기록이 아니라 오늘 쓸 수 있는 세제였다."),
  ...scene("S06_CURRENT_PURCHASE","SCENE 06 · 오늘의 기준으로 고르기",state),
  n("선반에는 향, 성분, 용량이 다른 세 제품이 놓여 있었다. 과거 구매 이력은 비어 있었다."),d("나","현재 생활에 맞는 기준을 하나 정하고, 확인 가능한 정보로 고른다."),choice(DAY8_PURCHASE_CHOICES)
];}

function segment2(state){return [
  ...purchaseReaction(state.storyFlags?.day8PurchaseStrategy),...scene("S06_CURRENT_PURCHASE","SCENE 06 · 계획보다 늦어진 십오 분",state),
  n("계산대 대기와 영수증 확인으로 예정 시간보다 십오 분이 늘어났다."),
  ...(state.storyFlags?.day8CheckInStrategy==="errand8_change_only_checkin"?[d("나","귀가 시각이 십오 분 바뀌었어. 상태는 괜찮고 계산만 늦었어."),d("하은","변경 확인. 서두르지 말고 원래 속도로 와.","calm")]:state.storyFlags?.day8CheckInStrategy==="errand8_timed_checkin"?[d("나","정한 시각 보고. 구매 끝, 상태 괜찮고 귀가만 남았어."),d("하은","확인. 다음 연락은 귀가 때만.","calm")]:[n("정한 귀가 시각 전이라 휴대폰을 넣고 카페 앞 벤치에서 오 분 쉬었다."),d("나","상태와 남은 시간을 확인했다. 계약을 바꿀 조건은 아직 없다.")]),
  n("영수증에서 상품명과 현재 결제 수단을 확인했다. 과거 회원 번호와 원래 휴대폰은 쓰지 않았다."),
  ...scene("S07_HOME_DEBRIEF","SCENE 07 · 결과보다 판단을 가져오기",state),enter("smile"),
  n("현관문이 열리자 하은은 가방보다 먼저 얼굴과 걸음 속도를 보고 물을 건넸다."),d("하은","어서 와. 질문은 네가 준비되면 시작할게.","smile"),
  d("나","상태 괜찮아. 우편 한 장은 내일 확인, 세제는 현재 기준으로 샀어."),d("하은","좋아. 결과만 말해도 되고, 같이 정리해도 돼."),
  n("식탁에는 출발 전 비어 있던 세 칸과 오늘 생긴 영수증·공문·구매품이 놓였다."),d("하은","오늘을 어떤 방식으로 남길까?","smile"),choice(DAY8_SHARE_CHOICES)
];}

function segment3(state){const high=(state.scenario?.haeunTrust??0)>=35;return [
  ...shareReaction(state.storyFlags?.day8ShareStrategy),
  ...(high?[d("하은","응, 다음 질문 순서도 네가 정해. 오늘 계약 잘 작동했어.","smile")]:[d("하은","사실 연락하고 싶었지만 계약대로 기다렸어. 다음에도 같은 규칙을 써도 괜찮을까?","calm"),d("나","출발 전에 조건을 다시 확인하면 괜찮아. 오늘처럼 변경만 공유하자.")]),
  ...scene("S08_DAY9_PLAN","SCENE 08 · 다음 길은 출근 방향",state),enter("calm","phone"),
  n("임시 예비폰에 두 번째 직장 적응 방문 계획을 열었다. 방문 시간과 접근 범위는 아직 빈칸이었다."),d("하은","내일은 회사 방향이네. 오늘 혼자 다녀온 방식 중 뭘 가져갈래?"),
  n("이동 경로, 체력 중단선, 팀장에게 확인할 현재 업무 범위를 세 칸으로 나눴다."),
  d("나","현재 정보부터 확인하고, 모르는 건 추측하지 않고, 중단 조건은 먼저 공유한다."),d("하은","이동은 혼자, 중단 조건은 같이. 오늘 표랑 같은 구조네.","smile"),
  d("나","전에 팀장과 정한 업무 범위는 다시 확인하고, 내 마음대로 늘리지 않는다."),d("하은","그럼 도시락은 범위 밖이야?","smile"),
  d("나","생활 지원이라 허용. 단, 너무 무겁지 않게."),d("하은","승인 받았습니다. 생활형 로맨스 계속.","smile"),
  n("혼자 처리한 생활 업무와 귀가 뒤 함께 정리한 판단, 다음 출근의 확인 순서가 저장됐다."),
  {type:"transition",style:"fade",label:"DAY 8 END",backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];}

function addMetric(state,key,amount){if(state.scenario?.enabled&&Number.isFinite(state.scenario[key]))state.scenario[key]=Math.max(0,state.scenario[key]+amount);}
function addGameMetric(state,key,amount){if(Number.isFinite(state[key]))state[key]=Math.max(0,state[key]+amount);}
function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
function remember(state,id){state.storyFlags??={};state.storyFlags[id]=true;}
function preserveSeojin(state,before){if(state.scenario){state.scenario.seojinAffection=before[0];state.scenario.seojinStatusInterest=before[1];}}

export function getLockedDay8Segment(state,stage=state.storyFlags?.day8RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay8ResumePresentation(state){const stage=state.storyFlags?.day8RuntimeStage??0;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};if(stage===1)return {backgroundId:"neighborhood-street-day",characterId:null,expressionId:null,poseId:null};if(stage===2)return {backgroundId:"day8-household-store-day",characterId:null,expressionId:null,poseId:null};return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};}

export function applyLockedDay8ChoiceState(state,id){
  state.storyFlags??={};const seojinBefore=[state.scenario?.seojinAffection,state.scenario?.seojinStatusInterest];
  if(DAY8_CHECKIN_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day8CheckInStrategy=id;state.storyFlags.day8RuntimeStage=1;remember(state,id);
    state.storyFlags.independent_errand_contract=id==="errand8_change_only_checkin"?"change_only":id==="errand8_timed_checkin"?"timed":"return_only";
    if(id==="errand8_change_only_checkin"){addGameMetric(state,"confidence",2);addMetric(state,"haeunTrust",2);}
    if(id==="errand8_timed_checkin"){addGameMetric(state,"stress",-1);addMetric(state,"haeunTrust",3);}
    if(id==="errand8_return_only_report"){addGameMetric(state,"confidence",3);addMetric(state,"haeunTrust",1);}
    addCollection(state,"unlockedActions","independent-neighborhood-errand");addCollection(state,"clues","independent-errand-contract");preserveSeojin(state,seojinBefore);return {stage:1};
  }
  if(DAY8_PURCHASE_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day8PurchaseStrategy=id;state.storyFlags.day8RuntimeStage=2;remember(state,id);state.storyFlags.day8OriginalPhoneUntouched=true;state.storyFlags.day8PastMemberNumberNotGuessed=true;
    state.storyFlags.current_household_choice=id==="errand8_compare_labels"?"label_comparison":id==="errand8_ask_current_need"?"current_need":"small_test";
    if(id==="errand8_compare_labels"){addGameMetric(state,"money",-9000);addGameMetric(state,"confidence",3);}
    if(id==="errand8_ask_current_need"){addGameMetric(state,"money",-10000);addMetric(state,"haeunAffection",1);addMetric(state,"haeunTrust",2);state.storyFlags.day8NeedQuestionNotContractBreach=true;}
    if(id==="errand8_buy_small_test"){addGameMetric(state,"money",-6000);addGameMetric(state,"confidence",2);addGameMetric(state,"stress",-1);}
    addCollection(state,"unlockedActions","review-current-mail");addCollection(state,"clues","current-household-choice");preserveSeojin(state,seojinBefore);return {stage:2};
  }
  if(DAY8_SHARE_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day8ShareStrategy=id;state.storyFlags.day8RuntimeStage=3;remember(state,id);state.storyFlags.day8IndependentErrandPending=false;state.storyFlags.day8IndependentErrandCompleted=true;state.storyFlags.day9SecondOfficeAdaptationPending=true;state.storyFlags.day8CurrentHouseholdChoiceSaved=true;state.storyFlags.day8ReturnDebriefSaved=true;state.storyFlags.day8OriginalPhoneAtHospital=true;
    state.storyFlags.return_debrief_rule=id==="errand8_sort_receipt_together"?"shared_sort":id==="errand8_explain_decision_log"?"decision_log":"next_boundary";
    if(id==="errand8_sort_receipt_together"){addMetric(state,"haeunAffection",1);addMetric(state,"haeunTrust",3);}
    if(id==="errand8_explain_decision_log"){addGameMetric(state,"confidence",2);addMetric(state,"haeunTrust",3);}
    if(id==="errand8_set_next_solo_boundary"){addGameMetric(state,"confidence",3);addMetric(state,"haeunTrust",2);}
    addCollection(state,"clues","return-debrief-rule");addCollection(state,"unlockedActions","prepare-limited-office-return");addCollection(state,"followUpHooks","day9-second-office-adaptation");preserveSeojin(state,seojinBefore);return {stage:3};
  }
  return null;
}

export function getLockedDay8LegacyChoice(state){return state.storyFlags?.day8ShareStrategy??"errand8_set_next_solo_boundary";}
export function validateLockedDay8Runtime(){const sample={storyFlags:{day7OpeningStrategy:"date7_confirm_together",day7RecoveryStrategy:"date7_rest_and_shorten",day7MemoryStrategy:"date7_record_next_rule",day8CheckInStrategy:"errand8_change_only_checkin",day8PurchaseStrategy:"errand8_compare_labels",day8ShareStrategy:"errand8_explain_decision_log"},scenario:{haeunTrust:36}};const all=[...segment0(sample),...segment1(sample),...segment2(sample),...segment3(sample)];const text=JSON.stringify(all);return all.filter(step=>step.type==="transition").length>=8&&all.filter(step=>["dialogue","narration"].includes(step.type)).length>=60&&all.filter(step=>step.type==="choice").length===3&&!text.includes("가짜 하은")&&!text.includes("D-29")&&!text.includes("트럭 충돌")&&!text.includes("의미심장한 미소");}
