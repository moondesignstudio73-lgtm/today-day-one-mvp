import {DAY6_PRESENTATION_SCENES} from "./day6-presentation-data.mjs";
import {STORY_OUTFIT_ASSETS} from "./story-outfit-assets.mjs?v=2";

const ID="m30-day6-neighborhood";
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const choice=options=>({type:"choice",options});
const enter=(expressionId="calm")=>({type:"characterEnter",characterId:"girlfriend",expressionId,animationId:"idle-breathe"});
const scene=(key,label)=>{const view=DAY6_PRESENTATION_SCENES[key];return [{type:"transition",style:view.transition,label,backgroundId:view.backgroundId,characterId:view.characterId,expressionId:view.expressionId,poseId:view.poseId,bgmId:view.bgm.category},{type:"sfx",sfxId:view.sfx[0]}].filter(step=>step.type!=="sfx"||step.sfxId);};

export const LOCKED_DAY6_SCENE_ID=ID;
export const DAY6_ROUTE_CHOICES=Object.freeze([
  {id:"route_essentials_first",label:"약국과 귀가 경로부터 확인하고 상태가 괜찮으면 장소를 추가한다"},
  {id:"route_shared_landmarks",label:"하은은 랜드마크만 설명하고 갈림길의 방향은 내가 결정한다"},
  {id:"route_solo_segment",label:"첫 블록은 혼자 확인하고 십 분 뒤 약국 앞에서 다시 만난다"}
]);
export const DAY6_ERRAND_CHOICES=Object.freeze([
  {id:"errand_fixed_budget",label:"예산 상한과 필수 목록을 정한 뒤 남은 금액으로 각자 하나씩 고른다"},
  {id:"errand_compare_together",label:"가격·양·먹는 속도를 함께 비교해 다음에도 쓸 기준을 만든다"},
  {id:"errand_split_roles",label:"나는 목록·결제를, 하은은 조리 계획·무게 조절을 맡는다"}
]);
export const DAY6_DATE_CHOICES=Object.freeze([
  {id:"date_new_place",label:"둘 다 가 본 적 없는 장소에서 같은 출발선으로 시작한다"},
  {id:"date_revisit_with_opt_out",label:"과거 장소를 다시 가되 불편하면 즉시 다른 곳으로 바꾼다"},
  {id:"date_alternate_choices",label:"이동·식사·활동을 번갈아 골라 현재 취향을 비교한다"}
]);

function day5Message(state){
  const plan=state.storyFlags?.day5ReturnStrategy;
  if(plan==="request-current-briefing")return [n("서진에게서 현재 일정·담당자·확인 출처만 담긴 알림이 왔다."),d("윤서진","파란 파일 갱신했습니다. 답장은 다음 방문 전까지 없어도 돼요."),d("나","긴급 표시 없고 회신은 내일. 지금 열 이유는 없어.")];
  if(plan==="rebuild-social-context")return [n("민호가 직접 함께 일한 사람은 실선, 전달받은 정보는 점선으로 표시한 팀 지도를 보냈다."),d("윤서진","민호 씨가 점선을 열두 번 설명하려 해서 줄였습니다. 오늘 보실 필요는 없어요."),d("나","내일 확인할 알림만 설정할게.")];
  return [n("팀장이 다음 적응 방문을 세 시간·책임 업무 없음·증상 시 즉시 종료로 기록했다."),d("윤서진","모르면 확인. 기억나는 척 금지. 그리고 휴식일 회신 금지."),d("나","어제 정한 경계는 오늘도 유효해.")];
}

function routeReaction(id){
  if(id==="route_solo_segment")return [n("하은은 맞은편에서 시야만 확보했고, 나는 주소판과 신호 위치를 비교해 약국을 찾았다."),d("하은","칠 분 사십 초. 전화 안 했고, 뛰어오지도 않았고."),d("나","간판 색은 중복됐어. 주소판과 신호가 더 정확해."),d("하은","좋아. 지도에 ‘간판 색만 믿지 않기’ 추가.","smile")];
  if(id==="route_shared_landmarks")return [d("하은","빨간 세탁소, 낮은 담장, 큰 은행나무. 힌트는 여기까지.","smile"),d("나","빨간 간판이 둘이야. 횡단보도 위치를 붙이면 왼쪽."),d("하은","정답. 그리고 내 설명도 수정. ‘빨간 세탁소, 횡단보도 전.’","smile")];
  return [d("나","약국과 돌아오는 길부터. 상태를 보고 마트와 카페를 붙이자."),d("하은","필수 경로 먼저. 좋아. 공원은 보너스 스테이지로 남겨 둘게.","smile"),n("약국 간판과 귀가 방향만 먼저 지도에 표시했다.")];
}

function segment0(){return [
  ...scene("S01_HOME_PLAN","DAY 6 · 우리가 사는 동네"),enter("calm"),
  n("식탁 위에 약 목록, 임시 예비폰, 빈 동네 지도를 펼쳤다."),
  d("하은","오늘 목표는 길 완벽하게 외우기 아니고, 돌아올 기준 만들기. 그리고 아이스크림.","smile"),
  d("나","아이스크림은 의료 계획에 없는데."),d("하은","생활 계획에는 있어. 내가 강력하게 권고해.","smile"),
  d("나","목적지는 약국, 마트, 카페. 공원은 상태를 보고."),
  d("하은","좋아. 내가 다 안내하면 산책이 아니라 견학이니까 방식은 네가 정해."),
  choice(DAY6_ROUTE_CHOICES)
];}

function segment1(state){return [
  ...routeReaction(state.storyFlags?.day6RouteStrategy),
  ...scene("S02_FIRST_TURN","SCENE 02 · 로비 밖 첫 갈림길"),enter("smile"),
  n("자동문이 열리자 배달 오토바이와 횡단보도 안내음이 겹쳤다. 지도보다 건물 번호와 신호를 먼저 확인했다."),
  d("나","기억 대신 다시 찾을 수 있는 기준을 남기면 돼."),d("하은","같이 있어도 대신 고르지 않기. 오늘 첫 규칙 후보네.","smile"),
  ...scene("S03_PHARMACY","SCENE 03 · 내 이름으로 받는 약"),enter("calm"),
  d("약사","성함과 생년월일 확인할게요."),n("내가 직접 답하고 아침·저녁 약과 필요 시 복용 약을 세 줄로 적었다."),
  d("하은","내 메모보다 짧네."),d("나","네 메모는 색이 네 개야."),
  d("하은","노랑은 중요, 분홍은 진짜 중요, 파랑은 잊으면 안 됨—"),d("나","전부 중요하군."),
  d("하은","그래서 냉장고에는 내 색, 폰에는 네 세 줄. 둘 다 쓰자.","smile"),
  d("나","이 폰은 임시니까 일정만. 원본 기록은 병원 문서로 두고."),
  n("하은은 대신 결론 내리지 않고 약봉투를 장바구니 안쪽에 넣어 지퍼만 닫았다."),
  ...scene("S04_MARKET","SCENE 04 · 장바구니의 절반"),enter("smile"),
  d("하은","쌀, 계란, 두부, 양파, 바나나. 그리고 목록에 없지만 반드시 있어야 하는 것."),d("나","휴지?"),d("하은","아이스크림.","smile"),
  d("나","큰 계란이 단가는 싸도 유통기한 안에 다 먹을 수 있어?"),d("하은","계란말이 두 번, 볶음밥, 실패한 프렌치토스트 재도전. 가능."),
  d("나","실패 예산까지 포함했군."),choice(DAY6_ERRAND_CHOICES)
];}

function errandReaction(id){
  if(id==="errand_compare_together")return [d("나","가격뿐 아니라 먹는 속도와 보관 기간도 적자."),d("하은","장보기 표준 운영 절차. 낭만은 없는데 이상하게 든든하네.","smile")];
  if(id==="errand_split_roles")return [d("나","나는 목록과 결제. 너는 며칠 안에 먹는지와 무게 구분."),d("하은","생수는 배달. 네가 들겠다고 하면 바로 반려.","smile")];
  return [d("나","삼만 원 안에서 필수품 먼저. 남으면 각자 하나씩."),d("하은","내 하나는 아이스크림으로 공개됐고, 네 하나는 천천히 골라.","smile")];
}

function segment2(state){return [
  ...errandReaction(state.storyFlags?.day6ErrandStrategy),
  n("임시 예비폰의 결제 앱을 열다가 계정 이름을 확인하고 멈췄다."),d("나","이 결제 수단은 누구 계정이지?"),
  d("하은","내 예비 계정. 네 원래 계좌는 본인 확인 복구 중이고, 네가 쓴 금액만 따로 기록돼."),
  d("나","오늘은 네가 결제하고 내가 금액을 기록할게. 복구 뒤 정산 여부는 다시 정하고."),
  d("하은","응. 지금 당장 빚처럼 만들지는 말자. 영수증은 네가 가져."),
  n("영수증에 ‘임시 결제—소유권 확인 전’이라고 적었다."),
  ...scene("S05_CAFE","SCENE 05 · 예전 것과 오늘 것"),enter("smile"),
  d("직원","오랜만이에요. 늘 드시던 걸로 드릴까요?"),d("하은","나는 자몽차. 이 사람은 오늘 다시 고를 거예요.","smile"),
  d("나","예전에는 뭘 마셨지?"),d("하은","여기서는 라테를 더 자주. ‘항상’은 아니고 내가 같이 온 날 기준."),
  d("나","기억에 출처를 붙였네."),d("하은","어제 네가 하는 걸 봤잖아. 나도 배웠지.","smile"),
  n("두 시음 컵을 번갈아 마시고 물을 마신 뒤 다시 확인했다."),d("하은","시험처럼 안 해도 돼."),
  d("나","시험은 정답이 있고, 이건 현재값 확인이야. 라테, 단맛 절반."),d("하은","오늘의 카페, 라테, 단맛 절반. 최종 저장은 네가 눌러.","smile"),
  d("하은","예전에 여기서 데이트 많이 했다는 말, 듣기 부담스러워?"),d("나","사실이면 들을 수 있어. 대신 재현해야 한다는 뜻으로는 듣지 않을게."),
  d("하은","우리는 주문하고 늘 창가부터 찾았어. 오늘은 네가 먼저 골랐고."),d("나","결과는 같아도 이유는 새로 생겼네."),
  ...scene("S06_WORK_MESSAGE","SCENE 06 · 휴식일의 메시지"),enter("calm"),...day5Message(state),
  d("하은","회사에서 배운 걸 회사 안 볼 때 쓰네."),d("나","경계는 바깥에서 지킬 때 의미가 있지."),
  ...scene("S07_DATE_PLAN","SCENE 07 · 처음 가는 데이트"),enter("smile"),
  d("하은","영화관, 강변, 책방. 과거의 네가 한 표, 오늘의 네가 한 표, 나는 한 표. 방식부터 정하자.","smile"),
  d("나","기억을 맞히는 데이트는 하지 않겠어."),choice(DAY6_DATE_CHOICES)
];}

function dateReaction(id){
  if(id==="date_revisit_with_opt_out")return [d("나","예전 장소 하나. 불편하면 이유 설명 없이 바꾸는 조건으로."),d("하은","강변부터. 아무것도 안 떠올라도 실패 처리 안 하기. 동의.","smile")];
  if(id==="date_alternate_choices")return [d("나","이동은 내가, 음식은 네가, 활동은 다시 내가. 다음엔 순서를 바꾸고."),d("하은","서로 정답 맞히기 말고 직접 고르기. 승인.","smile")];
  return [d("나","둘 다 처음인 곳. 네가 안내자도, 내가 따라가는 사람도 아닌 장소로."),d("하은","책방 옆 새 전시관. 나도 아직 안 갔어. 길은 같이 틀리자.","smile")];
}

function segment3(state){return [
  ...dateReaction(state.storyFlags?.day6DatePlan),
  d("하은","우리 데이트 많이 했는데 처음 약속 잡는 기분이야."),d("나","나한테는 실제로 처음이니까."),
  d("하은","전에는 그 말이 슬펐는데, 지금은 처음을 다시 받을 수 있어서 조금 좋기도 해.","smile"),
  ...scene("S08_MAP_HOME","SCENE 08 · 지도에 남은 색"),enter("smile"),
  n("약봉투, 영수증, 카페 메모, DAY 5 계획표를 식탁 위에서 서로 겹치지 않게 놓았다."),
  d("하은","아이스크림 어디 갔지?"),d("나","공원에서 먹었어."),d("하은","장보기 핵심 목표를 현장에서 소진했네.","smile"),
  d("나","다음 예산에 다시 넣으면 돼."),d("하은","다음이 자연스럽게 들어가는 말, 좋다.","smile"),
  n("생활 지도 아래에 ‘익숙한 곳도 내 기준으로 다시 확인할 수 있다’고 적었다."),
  d("하은","같이 가도 대신 결정하지 않기. 우리 규칙 후보. 싫으면 지워."),d("나","지우지 않을게. 공동 규칙으로 옮기자."),
  n("현재 생활 반경과 오늘의 취향, 임시 결제 기록, 첫 현재형 데이트 방식이 저장됐다."),
  n("길은 기억나지 않았다. 그래도 돌아오는 기준은 만들었다. 내일은 오늘 정한 방식으로 간다."),
  {type:"transition",style:"fade",label:"DAY 6 END",backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];}

function addMetric(state,key,amount){if(state.scenario?.enabled&&Number.isFinite(state.scenario[key]))state.scenario[key]=Math.max(0,state.scenario[key]+amount);}
function addGameMetric(state,key,amount){if(Number.isFinite(state[key]))state[key]=Math.max(0,state[key]+amount);}
function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
function remember(state,id){state.storyFlags??={};state.storyFlags[id]=true;}

export function getLockedDay6Segment(state,stage=state.storyFlags?.day6RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay6ResumePresentation(state){const stage=state.storyFlags?.day6RuntimeStage??0;const characterAssetUrl=STORY_OUTFIT_ASSETS.day6;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone",characterAssetUrl};if(stage===1)return {backgroundId:"neighborhood-street-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",characterAssetUrl};if(stage===2)return {backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",characterAssetUrl};return {backgroundId:"neighborhood-park-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",characterAssetUrl};}

export function applyLockedDay6ChoiceState(state,id){
  state.storyFlags??={};
  if(DAY6_ROUTE_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day6RouteStrategy=id;state.storyFlags.day6RuntimeStage=1;remember(state,id);
    if(id==="route_essentials_first"){addGameMetric(state,"confidence",3);addGameMetric(state,"health",2);}
    if(id==="route_shared_landmarks"){addMetric(state,"haeunTrust",2);addGameMetric(state,"confidence",2);}
    if(id==="route_solo_segment"){addGameMetric(state,"confidence",4);addMetric(state,"haeunTrust",1);addGameMetric(state,"stress",1);}
    addCollection(state,"unlockedActions","neighborhood-pharmacy");return {stage:1};
  }
  if(DAY6_ERRAND_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day6ErrandStrategy=id;state.storyFlags.day6RuntimeStage=2;state.storyFlags.day6MedicationRoutineSaved=true;remember(state,id);
    if(id==="errand_fixed_budget"){addGameMetric(state,"money",-30000);addGameMetric(state,"confidence",2);addMetric(state,"haeunTrust",2);}
    if(id==="errand_compare_together"){addGameMetric(state,"money",-27000);addMetric(state,"haeunAffection",2);addGameMetric(state,"confidence",1);}
    if(id==="errand_split_roles"){addGameMetric(state,"money",-29000);addMetric(state,"haeunAffection",1);addMetric(state,"haeunTrust",1);addGameMetric(state,"energy",1);}
    addCollection(state,"unlockedActions","neighborhood-market","neighborhood-cafe");return {stage:2};
  }
  if(DAY6_DATE_CHOICES.some(item=>item.id===id)){
    const seojinBefore=[state.scenario?.seojinAffection,state.scenario?.seojinStatusInterest];
    state.storyFlags.day6DatePlan=id;state.storyFlags.day6RuntimeStage=3;state.storyFlags.day6CurrentLifeRadiusSaved=true;state.storyFlags.day6CurrentTasteSaved=true;state.storyFlags.day6WorkBoundaryKept=true;state.storyFlags.day6FirstPresentDatePlanned=true;state.storyFlags.day7FirstPresentDatePending=true;remember(state,id);
    if(id==="date_new_place"){addMetric(state,"haeunAffection",4);addGameMetric(state,"confidence",2);addCollection(state,"followUpHooks","day7-new-place-date");}
    if(id==="date_revisit_with_opt_out"){addMetric(state,"haeunTrust",4);addMetric(state,"memoryRecovery",1);addCollection(state,"followUpHooks","day7-revisit-date");}
    if(id==="date_alternate_choices"){addMetric(state,"haeunAffection",2);addMetric(state,"haeunTrust",2);addCollection(state,"followUpHooks","day7-alternating-date");}
    addCollection(state,"unlockedActions","neighborhood-pharmacy","neighborhood-market","neighborhood-cafe","neighborhood-park","current-life-map","plan-current-date");addCollection(state,"followUpHooks","day7-first-present-date");
    if(state.scenario){state.scenario.seojinAffection=seojinBefore[0];state.scenario.seojinStatusInterest=seojinBefore[1];}
    return {stage:3};
  }
  return null;
}

export function getLockedDay6LegacyChoice(state){return state.storyFlags?.day6DatePlan??"date_alternate_choices";}
export function validateLockedDay6Runtime(){const sample={storyFlags:{day5ReturnStrategy:"set-return-boundary",day6RouteStrategy:"route_shared_landmarks",day6ErrandStrategy:"errand_compare_together",day6DatePlan:"date_alternate_choices"}};const all=[...segment0(sample),...segment1(sample),...segment2(sample),...segment3(sample)];const text=JSON.stringify(all);return all.filter(step=>step.type==="transition").length>=8&&all.filter(step=>["dialogue","narration"].includes(step.type)).length>=70&&all.filter(step=>step.type==="choice").length===3&&!text.includes("가짜 하은")&&!text.includes("D-29")&&!text.includes("트럭 충돌");}
