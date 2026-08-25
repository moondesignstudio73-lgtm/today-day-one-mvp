import {DAY7_PRESENTATION_SCENES} from "./day7-presentation-data.mjs";

const ID="m30-day7-first-present-date";
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const choice=options=>({type:"choice",options});
const enter=(expressionId="calm",poseId="standing")=>({type:"characterEnter",characterId:"girlfriend",expressionId,poseId,animationId:"idle-breathe"});
const branchBackground=(view,state)=>view.branchBackgrounds?.[state.storyFlags?.day6DatePlan]??view.backgroundId;
const scene=(key,label,state={})=>{const view=DAY7_PRESENTATION_SCENES[key];const backgroundId=branchBackground(view,state);return [{type:"transition",style:view.transition,label,backgroundId,characterId:view.characterId,expressionId:view.expressionId,poseId:view.poseId,bgmId:view.bgm.category},{type:"sfx",sfxId:view.sfx[0]}].filter(step=>step.type!=="sfx"||step.sfxId);};

export const LOCKED_DAY7_SCENE_ID=ID;
export const DAY7_OPENING_CHOICES=Object.freeze([
  {id:"date7_lead_first_leg",label:"첫 이동은 내가 정하고 다음 활동은 하은이 고르게 한다"},
  {id:"date7_confirm_together",label:"후보 두 곳의 거리와 체력을 비교한 뒤 함께 순서를 정한다"},
  {id:"date7_follow_then_switch",label:"첫 목적지는 하은의 선택을 따르고 도착 후 역할을 바꾼다"}
]);
export const DAY7_RECOVERY_CHOICES=Object.freeze([
  {id:"date7_rest_and_shorten",label:"십 분 쉬고 가까운 곳에서 식사한 뒤 바로 귀가한다"},
  {id:"date7_end_activity_keep_meal",label:"활동은 끝내고 앉아서 먹는 시간만 남긴다"},
  {id:"date7_return_now_reschedule",label:"지금 귀가하고 남은 선택권을 다음 데이트로 넘긴다"}
]);
export const DAY7_MEMORY_CHOICES=Object.freeze([
  {id:"date7_record_shared_photo",label:"고른 물건과 손만 나오게 사진을 남기고 함께 제목을 붙인다"},
  {id:"date7_record_two_sentences",label:"각자 기억하고 싶은 한 문장을 써서 서로 바꿔 읽는다"},
  {id:"date7_record_next_rule",label:"오늘 잘된 변경 규칙을 다음 데이트의 공동 규칙으로 저장한다"}
]);

function day6PlanOpening(state){
  const id=state.storyFlags?.day6DatePlan;
  if(id==="date_new_place")return [n("DAY 6에 정한 ‘둘 다 처음인 장소’ 계획 아래 책방과 신설 전시관이 나란히 저장돼 있었다."),d("하은","나도 처음이니까 오늘은 길 안내 잘하는 척 금지. 같이 틀리기.","smile")];
  if(id==="date_revisit_with_opt_out")return [n("강변 계획 옆에는 ‘기억이 없어도 실패 아님, 불편하면 설명 없이 변경’이 굵게 표시돼 있었다."),d("하은","계속 갈지 네가 먼저 정하고, 바꾸면 이유는 나중에 말해도 돼.","smile")];
  return [n("이동·식사·활동을 번갈아 고르는 표에서 오늘 첫 선택권만 비어 있었다."),d("하은","먼저 고른 사람은 다음 차례에 참견 금지. 표정으로도 금지.","smile")];
}

function openingReaction(id){
  if(id==="date7_lead_first_leg")return [d("나","그늘 많은 골목으로 갈게. 책방 다음 활동은 네가 정해."),d("하은","첫 선택 접수. 다음 차례에 내가 너무 신나도 이의 제기 금지.","smile")];
  if(id==="date7_confirm_together")return [d("나","거리, 벤치, 화장실 위치부터 비교하자. 책방을 먼저 가면 둘 다 여유가 있어."),d("하은","데이트 계획표에 화장실까지 있는 건 처음인데, 설득력은 제일 세다.","smile")];
  return [d("나","첫 목적지는 네가 골라. 도착하면 지도와 다음 선택은 내가 맡고."),d("하은","그럼 버스보다 천천히 걷기. 도착하면 역할 교대.","smile")];
}

function activitySequence(state){
  const id=state.storyFlags?.day6DatePlan;
  if(id==="date_revisit_with_opt_out")return [
    ...scene("S04_PRESENT_ACTIVITY","SCENE 04 · 기억을 시험하지 않는 강변",state),enter("smile"),
    n("강변 입구에서 물과 가장 가까운 벤치, 택시 승강장 방향을 먼저 확인했다."),d("하은","여기, 예전에 몇 번 왔어. 몇 번인지는 확실하지 않아."),
    d("나","기억은 안 떠올라. 그래도 계속 걷는 건 괜찮아."),d("하은","조금 아쉽긴 해. 하지만 네 잘못은 아니야. 오늘 길은 오늘 걸으면 돼.","calm"),
    n("하은은 과거 이야기를 더 보태지 않고 다음 그늘까지의 거리만 가리켰다.")
  ];
  if(id==="date_alternate_choices")return [
    ...scene("S04_PRESENT_ACTIVITY","SCENE 04 · 선택권을 번갈아 쓰는 전시관",state),enter("smile"),
    n("이동을 고른 사람이 입장권을 받고, 다른 사람이 첫 작품을 정했다. 휴식 의자는 다시 역할을 바꿨다."),
    d("하은","내 차례. 유리 작품. 여기 서면 네 얼굴이 세 개 보여.","smile"),d("나","하나도 기억 못 하는데 셋은 과하네."),
    d("하은","그중 오늘 것 하나만 데려가자.","smile"),d("나","다음 휴식 위치는 내가 고를게. 출구 가까운 쪽.")
  ];
  return [
    ...scene("S04_PRESENT_ACTIVITY","SCENE 04 · 둘 다 처음인 전시관",state),enter("smile"),
    n("안내 지도를 함께 읽고 서로 마음에 든 작품을 하나씩 고르기로 했다."),d("하은","나도 정답 몰라. 그래서 네 표정 보고 설명 바꾸는 반칙도 못 해.","smile"),
    d("나","처음인 사람 둘이면 질문도 공평하네."),d("하은","나는 유리 작품. 빛이 움직일 때 모양이 바뀌는 게 좋아.","smile"),
    d("나","나는 창가 사진. 같은 장소도 찍는 시간이 다르면 다른 장면이 돼.")
  ];
}

function recoveryReaction(id){
  if(id==="date7_return_now_reschedule")return [d("나","지금 돌아가자. 남은 선택권은 다음 데이트로 넘기고."),d("하은","좋아. 미룬 거지 잃은 거 아니야. 포장은 내가 주문하고 주소 확인은 네가 해.","calm"),n("변경 시각과 증상, 귀가 결정을 임시 예비폰에 직접 적었다.")];
  if(id==="date7_end_activity_keep_meal")return [d("나","활동은 여기까지. 가까운 곳에서 앉아서 먹는 시간만 남기자."),d("하은","산책 추가 없음, 구경 추가 없음. 밥 먹고 바로 귀가.","calm"),n("하은은 남은 표에서 활동 칸만 접고 식사 칸은 그대로 두었다.")];
  return [d("나","십 분 쉬고 가장 가까운 곳에서 먹고 돌아가자."),d("하은","타이머는 내가, 상태 기록은 네가. 괜찮아졌다는 말보다 확인 먼저.","calm"),n("물과 호흡, 시간과 맥박을 확인한 뒤 남은 이동 거리를 줄였다.")];
}

function memoryReaction(id){
  if(id==="date7_record_shared_photo")return [n("책 두 권과 영수증, 지도 모서리와 두 사람의 손만 프레임에 담았다."),d("하은","제목은 ‘계획보다 잘 바꾼 날’ 어때?"),d("나","‘처음 같이 바꾼 날’. 오늘 기준으로 더 정확해."),d("하은","그걸로 저장.","smile")];
  if(id==="date7_record_two_sentences")return [n("서로 등을 돌리고 한 문장씩 쓴 뒤 종이를 바꿨다."),d("하은","네 문장은 짧은데 빠진 게 없네. ‘멈춘 건 실패가 아니었다.’"),d("나","너는 ‘오늘은 같이 고른 게 많았다.’"),d("하은","과거 얘기 없이도 한 줄이 생겼네.","smile")];
  return [n("지도 아래의 변경 조건을 다음 데이트 공동 규칙 칸으로 옮겼다."),d("나","계획은 함께 세우고, 변경은 실패로 세지 않는다."),d("하은","다음이 있다는 규칙이 제일 마음에 들어.","smile"),d("나","다음에도 상태와 선택권을 같이 확인하자.")];
}

function segment0(state){return [
  ...scene("S01_HOME_PREP","DAY 7 · 오늘부터 우리의 데이트",state),enter("smile"),
  n("하은은 현관 앞에서 운동화 끈을 묶다가 다시 풀었다. 식탁에는 임시 예비폰, 물, 약, 접힌 지도와 작은 카메라가 놓여 있었다."),
  d("하은","나 지금 두 번째로 끈 묶는 중이야. 첫 번째는 너무 데이트에 진심 같아서.","smile"),d("나","두 번째는 덜 진심이야?"),
  d("하은","아니. 더 안 풀리게 묶었어.","smile"),...day6PlanOpening(state),
  d("나","계획보다 먼저 변경 조건. 어지럼이 오면 가까운 곳에서 쉬고 남은 일정은 줄인다."),d("하은","좋아. 그리고 재미없으면?"),
  d("나","재미없는 것도 말하고 바꾼다."),d("하은","그게 더 어렵겠네. 그래도 동의.","smile"),choice(DAY7_OPENING_CHOICES)
];}

function segment1(state){return [
  ...openingReaction(state.storyFlags?.day7OpeningStrategy),...scene("S02_DATE_WALK","SCENE 02 · 데이트처럼 걷는 법",state),enter("smile"),
  d("하은","우리 지금 너무 계획적으로 걷는 거 아니야?","smile"),d("나","계획표 들고 나온 사람이 할 말은 아닌데."),
  d("하은","데이트는 원래 우연처럼 보이게 준비하는 거야.","smile"),n("빵집 환풍구에서 단 냄새가 나자 두 사람이 동시에 고개를 돌렸다."),
  d("나","저건 계획에 없지."),d("하은","우연 발견. 돌아올 때 살아 있으면 하나 사자.","smile"),
  ...scene("S03_BOOKSHOP","SCENE 03 · 서로 한 권씩",state),enter("smile"),
  n("책방 주인은 음료 반입 금지와 의자 위치만 안내했다. 하은은 소설 코너로 가다가 내가 지도·건축 책의 모서리를 확인하는 모습을 봤다."),
  d("하은","그건 예전에도 했어. 책 모서리 눌린 거 싫어했거든. 정답 발표 아니고 관찰 보고.","smile"),d("나","오늘도 싫어. 이건 현재값과 일치."),
  d("하은","하나 찾았네. 기억 말고 취향.","smile"),n("서로 오늘 읽을 만한 책을 한 권씩 고르되 살지는 받은 사람이 결정했다."),
  d("하은","나한테 요리 실패담 에세이? 나 실패 많이 한다는 뜻이야?","smile"),d("나","실패를 메뉴에 넣는 사람이라는 뜻."),d("하은","좋게 말했으니 산다.","smile"),
  ...activitySequence(state),...scene("S05_RECOVERY_ADJUST","SCENE 05 · 계획을 줄이는 선택",state),enter("calm"),
  n("계단을 지난 뒤 시야가 잠깐 좁아졌다. 바로 앉아 물을 마시고 시간·맥박·증상을 확인했다."),
  d("하은","십 분 쉬고 가까운 곳에서 먹기. 활동은 끝내고 식사만 남기기. 지금 집에 가기. 셋 중에 고르자.","calm"),
  d("나","숨기고 버티는 선택은 제외."),d("하은","응. 변경은 실패로 세지 않기로 했으니까.","calm"),choice(DAY7_RECOVERY_CHOICES)
];}

function segment2(state){return [
  ...recoveryReaction(state.storyFlags?.day7RecoveryStrategy),...scene("S06_LATE_MEAL","SCENE 06 · 늦은 점심의 현재값",state),enter("smile"),
  n(state.storyFlags?.day7RecoveryStrategy==="date7_return_now_reschedule"?"집 식탁에 포장 샌드위치와 물을 놓았다.":"가장 가까운 조용한 좌석에 앉아 물부터 마셨다."),
  n("하은은 반으로 자른 샌드위치의 큰 쪽을 내 앞으로 밀었다가 다시 크기를 비교했다."),
  d("하은","이것도 예전 습관이라고 말하려다 멈췄어. 그냥 오늘은 네가 더 먹어.","smile"),d("나","오늘 이유가 있으면 충분해."),
  d("하은","오늘 이유는 회복 중이라서, 그리고 내가 감자도 먹을 거라서.","smile"),n("하은이 고른 에세이 영수증을 접어 책갈피로 넣어 줬다."),
  d("하은","남겨도 돼? 네가 지친 얼굴 말고 책이랑 영수증만."),d("나","그건 남겨."),
  d("하은","오늘 계획, 많이 줄었는데도 괜찮았어?"),d("나","줄인 이유를 같이 확인했고 남길 것도 생겼어. 충분해."),
  ...scene("S07_MEMORY_RECORD","SCENE 07 · 무엇을 기억으로 남길까",state),enter("smile"),
  n("식탁 위에 책, 영수증, 지도와 물건만 담은 사진 한 장을 놓았다."),d("하은","사진, 한 문장씩, 다음 규칙. 오늘은 뭘로 기억할까?","smile"),choice(DAY7_MEMORY_CHOICES)
];}

function segment3(state){return [
  ...memoryReaction(state.storyFlags?.day7MemoryStrategy),...scene("S08_DAY8_PLAN","SCENE 08 · 혼자 다녀올 한 곳",state),enter("calm","phone"),
  n("하은은 내일 필요한 세탁 세제, 처방 확인 전화, 우편함 점검을 임시 예비폰에 적었다."),
  d("하은","내일은 내가 안 따라가도 되는 걸 하나 골라 볼래? 결과만 알려 줘도 되고."),d("나","우편함과 세제. 약 관련 전화는 같이 확인하자."),
  d("하은","생활 업무도 난이도 분류하는구나.","smile"),d("나","오늘 계획을 줄인 것과 같은 방식이야. 혼자 할 것과 같이 할 것 구분."),
  n("하은은 지도에서 내일 갈 곳을 지우지 않고 회색으로 바꿨다."),d("하은","완료 표시 말고 예정 표시. 네가 다녀오면 네 색으로 바꿔.","smile"),
  d("나","계획은 함께 세우고, 변경은 실패로 세지 않는다."),n("첫 현재형 데이트의 기록과 내일 혼자 처리할 작은 생활 업무가 저장됐다."),
  {type:"transition",style:"fade",label:"DAY 7 END",backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];}

function addMetric(state,key,amount){if(state.scenario?.enabled&&Number.isFinite(state.scenario[key]))state.scenario[key]=Math.max(0,state.scenario[key]+amount);}
function addGameMetric(state,key,amount){if(Number.isFinite(state[key]))state[key]=Math.max(0,state[key]+amount);}
function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
function remember(state,id){state.storyFlags??={};state.storyFlags[id]=true;}
function preserveSeojin(state,before){if(state.scenario){state.scenario.seojinAffection=before[0];state.scenario.seojinStatusInterest=before[1];}}

export function getLockedDay7Segment(state,stage=state.storyFlags?.day7RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay7ResumePresentation(state){const stage=state.storyFlags?.day7RuntimeStage??0;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing"};if(stage===1)return {backgroundId:"day7-bookshop-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing"};if(stage===2){const view=DAY7_PRESENTATION_SCENES.S05_RECOVERY_ADJUST;return {backgroundId:branchBackground(view,state),characterId:"girlfriend",expressionId:"calm",poseId:"standing"};}return {backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"phone"};}

export function applyLockedDay7ChoiceState(state,id){
  state.storyFlags??={};const seojinBefore=[state.scenario?.seojinAffection,state.scenario?.seojinStatusInterest];
  if(DAY7_OPENING_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day7OpeningStrategy=id;state.storyFlags.day7RuntimeStage=1;remember(state,id);
    if(id==="date7_lead_first_leg"){addGameMetric(state,"confidence",2);addMetric(state,"haeunTrust",1);}
    if(id==="date7_confirm_together"){addGameMetric(state,"confidence",1);addMetric(state,"haeunTrust",2);}
    if(id==="date7_follow_then_switch"){addMetric(state,"haeunAffection",2);addMetric(state,"haeunTrust",1);}
    addCollection(state,"unlockedActions","day7-bookshop-visit");preserveSeojin(state,seojinBefore);return {stage:1};
  }
  if(DAY7_RECOVERY_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day7RecoveryStrategy=id;state.storyFlags.day7RuntimeStage=2;state.storyFlags.day7ChangeSharedNotFailed=true;remember(state,id);
    if(id==="date7_rest_and_shorten"){addGameMetric(state,"health",2);addGameMetric(state,"stress",-1);addMetric(state,"haeunAffection",1);addMetric(state,"haeunTrust",2);}
    if(id==="date7_end_activity_keep_meal"){addGameMetric(state,"health",1);addGameMetric(state,"stress",-2);addMetric(state,"haeunTrust",3);}
    if(id==="date7_return_now_reschedule"){addGameMetric(state,"health",3);addGameMetric(state,"stress",-3);addMetric(state,"haeunTrust",3);addCollection(state,"followUpHooks","day7-rescheduled-choice");}
    addCollection(state,"unlockedActions","shared-change-rule");preserveSeojin(state,seojinBefore);return {stage:2};
  }
  if(DAY7_MEMORY_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day7MemoryStrategy=id;state.storyFlags.day7RuntimeStage=3;state.storyFlags.first_present_date_memory=true;state.storyFlags.shared_change_rule=true;state.storyFlags.day7FirstPresentDatePending=false;state.storyFlags.day7FirstPresentDateCompleted=true;state.storyFlags.day8IndependentErrandPending=true;remember(state,id);
    if(id==="date7_record_shared_photo")addMetric(state,"haeunAffection",3);
    if(id==="date7_record_two_sentences"){addMetric(state,"haeunTrust",3);addMetric(state,"memoryRecovery",1);}
    if(id==="date7_record_next_rule"){addMetric(state,"haeunAffection",1);addMetric(state,"haeunTrust",3);}
    addCollection(state,"clues","first-present-date-memory","shared-change-rule");addCollection(state,"unlockedActions","review-present-date-memory","plan-independent-errand");addCollection(state,"followUpHooks","day8-independent-errand");preserveSeojin(state,seojinBefore);return {stage:3};
  }
  return null;
}

export function getLockedDay7LegacyChoice(state){return state.storyFlags?.day7MemoryStrategy??"date7_record_next_rule";}
export function validateLockedDay7Runtime(){const sample={storyFlags:{day6DatePlan:"date_alternate_choices",day7OpeningStrategy:"date7_confirm_together",day7RecoveryStrategy:"date7_rest_and_shorten",day7MemoryStrategy:"date7_record_next_rule"}};const all=[...segment0(sample),...segment1(sample),...segment2(sample),...segment3(sample)];const text=JSON.stringify(all);return all.filter(step=>step.type==="transition").length>=8&&all.filter(step=>["dialogue","narration"].includes(step.type)).length>=60&&all.filter(step=>step.type==="choice").length===3&&!text.includes("가짜 하은")&&!text.includes("D-29")&&!text.includes("트럭 충돌")&&!text.includes("의미심장한 미소");}
