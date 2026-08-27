import { STORY_OUTFIT_ASSETS } from "./story-outfit-assets.mjs";
import {applyDay4V3OpeningChoiceState,getDay4V3MorningSegment,getDay4V3PhotoSegment,getDay4V3FirstCallSegment,getDay4V3MeetingSetupSegment,getDay4V3CafeArrivalSegment,getDay4V3TasteReaction,getDay4V3PhotoMemoriesSegment,getDay4V3PreAccidentPreamble,getDay4V3BondAndPaymentSegment,getDay4V3FarewellSegment,getDay4V3EndingSegment} from "./day4-v3-campaign-data.mjs";

const ID="m30-day4-arrive-home";
const BG={entry:"day2-home-entry",room:"day4-bedroom-morning",day:"day4-bedroom-morning",cafe:"day4-station-cafe-afternoon",night:"day4-home-night"};
export const DAY4_VISUAL_ASSETS=Object.freeze({
  haeun:STORY_OUTFIT_ASSETS.day4,
  jihoonGreeting:"assets/characters/day4/jihoon-day4-cautious-greeting-v1.png",
  jihoonHugStop:"assets/characters/day4/jihoon-day4-hug-stop-v1.png",
  jihoonWarmTease:"assets/characters/day4/jihoon-day4-warm-tease-v1.png",
  jihoonSerious:"assets/characters/day4/jihoon-day4-serious-testimony-v1.png",
  morningMessageCg:"assets/events/day4/cg-day4-morning-message-pov-v1.png",
  groupPhotoBackCg:"assets/events/day4/cg-day4-group-photo-back-pov-v1.png",
  stoppedHugCg:"assets/events/day4/cg-day4-jihoon-stopped-hug-v1.png",
  phonePhotoCg:"assets/events/day4/cg-day4-table-phone-photo-pov-v1.png",
  paymentCg:"assets/events/day4/cg-day4-payment-card-receipt-pov-v1.png"
});

const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const tr=(label,backgroundId,characterId="girlfriend",characterAssetUrl=characterId==="girlfriend"?DAY4_VISUAL_ASSETS.haeun:undefined)=>({type:"transition",style:"fade",label,backgroundId,characterId,characterAssetUrl});
const enterJihoon=(assetUrl,expressionId="calm")=>({type:"characterEnter",characterId:"best-friend",assetUrl,expressionId,animationId:"idle-breathe"});
const choice=options=>({type:"choice",options});

export const LOCKED_DAY4_SCENE_ID=ID;
export const DAY4_HOME_CHOICES=Object.freeze([
  {id:"map-home-basics",label:"방별 용도와 위험한 곳부터 직접 표시한다"},
  {id:"cross-check-digital-address",label:"계정 주소와 현관 우편물을 먼저 대조한다",requiresDay3:"inspect-system-first"},
  {id:"restore-routine-together",label:"하은과 복약 자리와 저녁 동선만 다시 만든다",requiresDay3:"set-up-together"},
  {id:"open-phone-at-desk",label:"책상에서 최근 알림과 집 관련 기록만 확인한다",requiresDay3:"seal-until-home"}
]);
export const DAY4_CONTACT_CHOICES=Object.freeze([
  {id:"contact_direct_call",label:"저장된 번호로 직접 전화해 목소리와 반응부터 확인한다"},
  {id:"contact_written_proof",label:"단체사진의 날짜·위치·참석자를 먼저 문자로 요청한다"},
  {id:"contact_haeun_crosscheck",label:"하은에게 이름만 대조한 뒤 연락 여부는 내가 정한다"}
]);
export const DAY4_IDENTITY_CHOICES=Object.freeze([
  {id:"identity_balanced_character",label:"과거의 성격과 지금도 남은 습관을 함께 묻는다"},
  {id:"identity_evidence_first",label:"사진과 날짜처럼 출처가 남는 사실부터 확인한다"},
  {id:"identity_present_boundary",label:"과거의 나를 따라 하지 않겠다는 현재 기준부터 말한다"}
]);
export const DAY4_ACCIDENT_CHOICES=Object.freeze([
  {id:"accident_last_verified_contact",label:"사고 전 마지막으로 직접 확인한 연락만 묻는다"},
  {id:"accident_direct_knowledge_only",label:"직접 본 사실과 전해 들은 말을 나눠 달라고 한다"},
  {id:"accident_defer",label:"오늘은 사고 질문을 미루고 친구 관계부터 복원한다"}
]);
export const DAY4_SHARING_CHOICES=Object.freeze([
  {id:"sharing_transparent",label:"확인된 사실과 미확인 증언을 구분해 하은에게 바로 공유한다"},
  {id:"sharing_organize_first",label:"내가 증언 장부를 정리한 뒤 핵심만 하은에게 설명한다"},
  {id:"sharing_compare_then_disclose",label:"하은의 기억을 먼저 듣고 겹치는 부분만 함께 대조한다"}
]);

function hasDay3Choice(state,id){return (state.storyHistory??[]).some(record=>record.sceneId==="m30-day3-discharge-phone"&&record.choiceId===id);}
export function getAvailableDay4HomeChoices(state){return DAY4_HOME_CHOICES.filter(item=>!item.requiresDay3||hasDay3Choice(state,item.requiresDay3)).map(({id,label})=>({id,label}));}

const SEGMENT_0=[
  tr("DAY 4 · 현관 안의 생활",BG.entry),
  n("열쇠는 한 번에 돌아갔다. 손은 잠금장치를 기억하는데 나는 현관 너머를 몰랐다."),
  d("하은","들어가도 돼? 예전에는 비밀번호 누르고 들어왔지만, 오늘은 네가 정해."),
  d("나","예전에도 내 집이었잖아."),
  d("하은","그때는 나도 초대받은 사람인 줄 알았거든. 냉장고 반 칸을 차지한 뒤로 애매해졌지만.","smile"),
  d("나","반 칸이나?"),
  d("하은","야채 칸까지 치면 조금 더. 대신 유통기한 지난 건 내가 버렸어. 공정하지?","smile"),
  n("고개를 끄덕이자 하은이 들어왔다. 장바구니는 어디에 둘지 내가 말할 때까지 손에 남아 있었다."),
  d("나","주방에 둬. 먼저 약과 서류 둘 자리부터 만들자."),
  d("하은","좋아. 오늘은 집도 정답을 요구하지 않을 거야."),
  n("소파의 눌린 자리, 충전기 두 개, 책상 아래 슬리퍼. 생활의 흔적은 많았지만 내 것이라는 감각은 없었다."),
  d("하은","왼쪽 회색 슬리퍼가 네 거야. 오른쪽은 내가 자꾸 두고 가서 여기 살게 된 거고.","smile"),
  d("나","슬리퍼가 집주인보다 기억이 좋네."),
  d("하은","일 년 동안 자리 지킨 선배니까 대우해 줘.","smile"),
  n("냉장고 문에는 ‘하은—우유 사 오면 날짜 써 두기’라는 메모가 붙어 있었다. 내 글씨라고 해도 알아볼 수 없었다."),
  d("나","이게 내 글씨야?"),
  d("하은","응. 그런데 기억날 거라는 말은 안 할게. 오늘 날짜부터 새로 쓰면 되니까."),
  d("나","집도 휴대폰도 한꺼번에 보지는 않겠어. 먼저 순서를 정할게."),
  choice([])
];

function homeReaction(id){
  if(id==="cross-check-digital-address")return [n("계정 주소, 공과금 고지서, 현관 호수가 일치했다. 확인된 사실과 설명을 다른 줄에 적었다."),d("하은","추리는 네가. 날짜순 정리는 내가 해도 돼?"),d("나","봉투 바깥 날짜만. 내용은 내가 열게."),d("하은","접수 완료.","smile")];
  if(id==="restore-routine-together")return [n("약은 물컵 옆, 충전기는 소파 가까이에 두었다. 하은은 매번 위치를 물었다."),d("하은","예전 자리라는 말은 안 할게. 오늘 우리가 정한 자리가 새 기준."),d("나","좋아. 바꾸고 싶으면 둘 다 말하기."),d("하은","동거도 안 하는데 생활 협약부터 생겼네.","smile")];
  if(id==="open-phone-at-desk")return [n("알림 범위를 집 주소와 오늘 날짜로 제한했다. 하은은 화면을 등지고 죽을 데웠다."),d("나","필요한 기능은 열고, 과거 대화는 닫아 둔다."),d("하은","나도 안 볼게. 대신 배터리 삼 퍼센트는 현재의 위기야.","smile")];
  return [n("현관에서 침실까지 문을 하나씩 열고 약, 서류, 호출 번호를 둘 자리를 표시했다."),d("나","오늘은 구조와 위험한 곳까지만. 서랍은 나중에."),d("하은","응. 집 안내원은 질문받은 범위만 영업합니다.","smile")];
}

function segment1(state){return [
  ...homeReaction(state.storyFlags?.day4HomeStrategy),
  tr("SCENE 02 · 별명으로 남은 사람",BG.day),
  n("충전된 휴대폰에서 오래된 연락처 하나가 눈에 걸렸다. ‘지훈_마감지옥’. 마지막 대화는 사고 전에서 멈춰 있었다."),
  d("나","이 사람 알아? 이름만."),
  d("하은","박지훈. 네가 오래 만난 친구라고 들었어. 나는 두 번 봤고, 연락처 내용은 몰라."),
  d("나","아는 범위가 정확하네."),
  d("하은","요즘 내 장점 목록이 자꾸 감사 보고서 같아.","smile"),
  n("새 메시지가 도착했다. ‘번호 살아 있네. 혹시 진짜 너야?’ 친한 척하는 문장만으로는 관계를 확인할 수 없었다."),
  d("나","연락은 하겠다. 다만 순서는 내가 정할게."),
  choice(DAY4_CONTACT_CHOICES)
];}

function contactReaction(id){
  if(id==="contact_written_proof")return [d("나","우리가 함께 나온 사진의 날짜와 장소, 참석자를 먼저 보내 달라고 하자."),n("답장은 빨랐다. 원본 파일 정보가 남은 단체사진 세 장과 모르는 것은 모른다는 짧은 설명이 왔다."),d("하은","친구치고 제출 서류가 성실하네."),d("나","그건 가서 확인해야지.")];
  if(id==="contact_haeun_crosscheck")return [d("나","이름과 내가 알던 기간까지만 말해 줘."),d("하은","고등학교 때부터라고 들었어. 그 이상은 본인에게 확인해."),n("하은의 설명을 메모한 뒤 내가 직접 전화를 걸었다. 두 출처가 같은 사람을 가리키는지부터 대조했다.")];
  return [n("통화 버튼을 눌렀다. 상대는 이름을 반복해 묻지 않고 내가 끊을 때까지 기다렸다."),d("지훈","네가 기억 못 해도 괜찮아. 내가 아는 걸 전부 믿으라는 말은 안 할게. 얼굴 보고 확인하자."),d("나","장소는 사람 많은 곳. 한 시간만."),d("지훈","역 앞 카페. 네가 먼저 나가도 안 붙잡을게.")];
}

function segment2(state){return [
  ...contactReaction(state.storyFlags?.day4ContactStrategy),
  d("하은","휴대폰 충전, 약, 귀가 시간. 세 개 확인하고 가."),
  d("나","보호자 모드야?"),
  d("하은","여자친구 겸 생활 안전 앱. 광고는 없어.","smile"),
  tr("SCENE 03 · 친구라는 증거",BG.cafe,"best-friend",DAY4_VISUAL_ASSETS.jihoonGreeting),
  enterJihoon(DAY4_VISUAL_ASSETS.jihoonHugStop),
  n("카페 구석에 앉은 남자가 나를 보자 일어섰다가, 악수도 포옹도 하지 않고 다시 손을 내렸다."),
  d("지훈","박지훈. 네 연락처의 마감지옥. 가까이 앉아도 되냐?"),
  d("나","맞은편이면 돼."),
  d("지훈","예전보다 예의 바르네. 아니, 이건 지금의 너한테 실례인가."),
  d("나","과거와 비교하되 평가로 쓰지는 마."),
  d("지훈","알겠어. 내가 직접 겪은 것, 네가 말했던 것, 남에게 들은 것. 나눠서 말할게."),
  n("지훈은 내 앞에 따뜻한 라테를 놓았다. 나는 주문서를 확인했다."),
  d("나","나는 단 음료를 좋아했어?"),
  d("지훈","고등학생 때는 싫어했어. 그런데 마지막에 봤을 땐 이걸 마셨다. 취향이 바뀐 건지 그날만 그런지는 몰라."),
  d("나","좋아. 시점이 붙은 답이네."),
  n("사소한 차이는 거짓말의 증거가 아니라 시간이 흘렀다는 증거일 수 있었다."),
  choice(DAY4_IDENTITY_CHOICES)
];}

function identityReaction(id){
  if(id==="identity_evidence_first")return [d("나","사진과 날짜부터. 네 해석은 그다음에 듣겠어."),d("지훈","이건 졸업식, 이건 첫 회사 입사 날. 원본 날짜도 같이 볼래?"),n("사진 세 장의 촬영 정보와 당시 단체 대화의 날짜가 서로 맞았다.")];
  if(id==="identity_present_boundary")return [d("나","과거의 내가 그랬다고 지금도 따라 하지는 않을 거야."),d("지훈","당연하지. 친구였다는 이유로 옛날 역할을 시킬 생각 없어."),d("나","그 기준을 지키면 다음 이야기도 들을게.")];
  return [d("나","내가 사람을 대하던 방식과 지금도 남아 보이는 습관을 하나씩 말해 줘."),d("지훈","확인부터 하고 움직였어. 대신 가까운 사람 일에는 확인이 끝나기 전에 뛰어들 때가 있었고."),d("나","성격 해석과 행동 사례를 분리해서 적을게.")];
}

function segment3(state){return [
  ...identityReaction(state.storyFlags?.day4IdentityFocus),
  tr("SCENE 04 · 세 장의 시간",BG.cafe,"best-friend",DAY4_VISUAL_ASSETS.jihoonSerious),
  enterJihoon(DAY4_VISUAL_ASSETS.jihoonSerious),
  n("졸업식, 첫 입사 날, 야간 작업실. 세 사진 속 나는 같은 얼굴로 조금씩 다른 자세를 하고 있었다."),
  d("지훈","기억나는 척 안 해도 돼. 사진 속 네가 지금 너한테 낯선 건 당연하니까."),
  d("나","사진은 네 말을 확인해 주지만 내 감정까지 증명하지는 않아."),
  d("지훈","그 말도 예전 너답긴 하다. 지금 네 말로 기록해."),
  d("나","사고 전 마지막으로 연락한 때는?"),
  d("지훈","그건 질문 범위를 정해 줘. 내가 직접 받은 연락과 나중에 들은 이야기가 섞여 있어."),
  choice(DAY4_ACCIDENT_CHOICES)
];}

function accidentReaction(id){
  if(id==="accident_direct_knowledge_only")return [d("나","네가 직접 본 사실과 전해 들은 말을 나눠 줘."),d("지훈","직접 받은 건 사고 이틀 전 네 전화. 피곤하다고 했지만 누구와 어디 가는지는 안 말했어. 사고 장소와 동승자는 나중에 다른 사람에게 들었고 확인 못 했어."),d("나","두 번째 부분은 미확인 증언으로 둔다.")];
  if(id==="accident_defer")return [d("나","사고는 오늘 묻지 않겠어. 우리가 왜 연락이 끊겼는지부터 알고 싶어."),d("지훈","병원에 갔지만 가족 연락망 밖이라 자세한 소식은 못 들었어. 그 뒤로 번호만 남겨 뒀고."),d("나","그건 오늘 확인 가능한 관계 기록이네.")];
  return [d("나","사고 전 마지막으로 네가 직접 확인한 연락만 말해 줘."),d("지훈","이틀 전 밤에 네가 전화했어. 회사 일이 정리되면 만나자고 했고, 목소리는 피곤했어. 그 뒤는 직접 아는 게 없어."),d("나","시간과 직접성만 기록할게.")];
}

function segment4(state){return [
  ...accidentReaction(state.storyFlags?.day4AccidentQuestion),
  tr("SCENE 05 · 지금부터의 친구",BG.cafe,"best-friend",DAY4_VISUAL_ASSETS.jihoonWarmTease),
  enterJihoon(DAY4_VISUAL_ASSETS.jihoonWarmTease,"smile"),
  d("지훈","번호는 그대로 둘게. 답장 속도나 만나는 횟수는 지금 네가 정해."),
  d("나","다음에는 네가 가진 원본 사진 목록만 보내 줘. 설명은 내가 물을 때."),
  d("지훈","업무 지시 받는 기분인데, 네가 맞긴 맞네."),
  d("나","그 판단은 보류."),
  d("지훈","그래. 그래도 다시 연락해 줘서 고맙다."),
  n("친구였다는 결론보다, 다음 연락의 규칙이 먼저 생겼다."),
  tr("SCENE 06 · 증언 장부",BG.night),
  {type:"characterEnter",characterId:"girlfriend",expressionId:"calm"},
  n("집에 돌아와 노트를 세 칸으로 나눴다. 직접 확인한 사실, 출처가 붙은 증언, 아직 확인하지 못한 말."),
  d("하은","친구는 어땠어? 아니, 이 질문도 너무 넓나."),
  d("나","넓지만 괜찮아. 말하기 전에 공유 범위를 정할게."),
  d("하은","응. 내가 궁금한 것과 네가 말할 준비가 된 건 다를 수 있으니까."),
  choice(DAY4_SHARING_CHOICES)
];}

function sharingReaction(id){
  if(id==="sharing_organize_first")return [d("나","먼저 장부를 정리하고 핵심만 설명할게."),d("하은","좋아. 기다리는 동안 죽 데우기 담당하겠습니다.","smile"),n("나는 사실과 증언을 분리한 뒤, 지훈과 다시 연락하기로 했다는 결과부터 말했다.")];
  if(id==="sharing_compare_then_disclose")return [d("나","네가 기억하는 지훈을 먼저 말해 줘. 겹치는 부분만 같이 대조하자."),d("하은","두 번 봤고, 네 오래된 친구라고 소개받았어. 오늘 어디서 뭘 들었는지는 몰라."),n("두 설명이 겹치는 부분과 한쪽만 아는 부분을 다른 색으로 표시했다.")];
  return [d("나","확인된 사실과 미확인 증언을 나눠서 지금 공유할게."),d("하은","응. 내가 아는 걸 끼워 넣고 싶으면 먼저 물을게."),n("지훈의 마지막 직접 연락과 확인하지 못한 소문을 구분해 읽었다. 하은은 결론 대신 출처 표시만 확인했다.")];
}

function endingSegment(state){return [
  ...sharingReaction(state.storyFlags?.day4SharingStrategy),
  d("하은","오늘 알아낸 사람 중에 제일 괜찮은 사람은 누구였어?","smile"),
  d("나","현재 기준으로는 질문 범위를 지킨 사람들."),
  d("하은","복수형이라 다행이네. 나도 후보에 있지?","smile"),
  d("나","소액 적립."),
  n("그때 업무용으로 보이는 새 메시지가 도착했다. ‘민호입니다. 복귀 절차와 현재 팀 상황, 내일 직접 설명드리겠습니다.’"),
  d("나","친구 다음은 회사인가."),
  d("하은","오늘 만든 세 칸, 내일도 가져가. 회사 사람 말도 자동으로 정답은 아니니까."),
  d("나","너 말도 포함해서."),
  d("하은","당연하지. 대신 우유 날짜는 내가 맞았어.","smile"),
  n("내가 알던 사람들의 말은 기억을 대신하지 않았다. 하지만 출처와 시간을 붙이면, 지금의 내가 판단할 자료가 되었다."),
  tr("DAY 4 END",BG.night),
  {type:"sceneEnd"}
];}

function addMetric(state,key,amount){if(state.scenario?.enabled&&Number.isFinite(state.scenario[key]))state.scenario[key]=Math.max(0,state.scenario[key]+amount);}
function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
function remember(state,id){state.storyFlags??={};state.storyFlags[id]=true;}

function getLegacyDay4Segment(state,stage=state.storyFlags?.day4RuntimeStage??0){
  if(stage===0){const segment=structuredClone(SEGMENT_0);segment.at(-1).options=getAvailableDay4HomeChoices(state);return segment;}
  if(stage===1)return segment1(state);
  if(stage===2)return segment2(state);
  if(stage===3)return segment3(state);
  if(stage===4)return segment4(state);
  return endingSegment(state);
}

function getLegacyDay4ResumePresentation(state){const stage=state.storyFlags?.day4RuntimeStage??0;if(stage===2)return {backgroundId:BG.cafe,characterId:"best-friend",characterAssetUrl:DAY4_VISUAL_ASSETS.jihoonGreeting};if(stage===3)return {backgroundId:BG.cafe,characterId:"best-friend",characterAssetUrl:DAY4_VISUAL_ASSETS.jihoonSerious};if(stage===4)return {backgroundId:BG.cafe,characterId:"best-friend",characterAssetUrl:DAY4_VISUAL_ASSETS.jihoonWarmTease};if(stage>=5)return {backgroundId:BG.night,characterId:"girlfriend",characterAssetUrl:DAY4_VISUAL_ASSETS.haeun};return {backgroundId:stage===0?BG.entry:BG.day,characterId:"girlfriend",characterAssetUrl:DAY4_VISUAL_ASSETS.haeun};}

function applyLegacyDay4ChoiceState(state,id){state.storyFlags??={};
  if(getAvailableDay4HomeChoices(state).some(item=>item.id===id)){state.storyFlags.day4HomeStrategy=id;remember(state,id);state.storyFlags.day4RuntimeStage=1;return {stage:1};}
  if(DAY4_CONTACT_CHOICES.some(item=>item.id===id)){state.storyFlags.day4ContactStrategy=id;remember(state,id);state.storyFlags.day4RuntimeStage=2;addMetric(state,"investigation",id==="contact_written_proof"?2:1);addCollection(state,"unlockedActions",`day4-${id}`);return {stage:2};}
  if(DAY4_IDENTITY_CHOICES.some(item=>item.id===id)){state.storyFlags.day4IdentityFocus=id;remember(state,id);state.storyFlags.day4RuntimeStage=3;addMetric(state,id==="identity_evidence_first"?"investigation":"memoryRecovery",id==="identity_evidence_first"?2:1);return {stage:3};}
  if(DAY4_ACCIDENT_CHOICES.some(item=>item.id===id)){state.storyFlags.day4AccidentQuestion=id;remember(state,id);state.storyFlags.day4RuntimeStage=4;addMetric(state,"accidentSearchCount",id==="accident_defer"?0:1);addCollection(state,"unlockedActions","testimony-source-ledger");return {stage:4};}
  if(DAY4_SHARING_CHOICES.some(item=>item.id===id)){state.storyFlags.day4SharingStrategy=id;state.storyFlags.day4TestimonyLedgerUnlocked=true;state.storyFlags.day4WorkContactPending=true;remember(state,id);state.storyFlags.day4RuntimeStage=5;addMetric(state,"haeunTrust",id==="sharing_transparent"?2:1);if(id==="sharing_compare_then_disclose")addMetric(state,"investigation",1);addCollection(state,"unlockedActions","testimony-ledger","friend-archive-followup","past-contacts-index","day5-work-contact");addCollection(state,"followUpHooks","day5-work-return");return {stage:5};}
  return null;
}

export function getLockedDay4LegacyChoice(state){return state.storyFlags?.day4HomeStrategy??"map-home-basics";}

function isLegacyDay4Save(state){return state.storyFlags?.day4RuntimeVersion!==3&&Number(state.storyFlags?.day4RuntimeStage)>0;}
const V3_SEGMENTS=[getDay4V3MorningSegment,getDay4V3PhotoSegment,getDay4V3FirstCallSegment,getDay4V3MeetingSetupSegment,getDay4V3CafeArrivalSegment,getDay4V3TasteReaction,getDay4V3PhotoMemoriesSegment,getDay4V3PreAccidentPreamble,getDay4V3BondAndPaymentSegment,getDay4V3FarewellSegment,getDay4V3EndingSegment];

export function getLockedDay4Segment(state,stage=state.storyFlags?.day4RuntimeStage??0){
  if(isLegacyDay4Save(state))return getLegacyDay4Segment(state,stage);
  return V3_SEGMENTS[Math.max(0,Math.min(10,Number(stage)||0))](state);
}

export function applyLockedDay4ChoiceState(state,id){
  state.storyFlags??={};
  if(isLegacyDay4Save(state))return applyLegacyDay4ChoiceState(state,id);
  const legacyIds=[...DAY4_HOME_CHOICES,...DAY4_CONTACT_CHOICES,...DAY4_IDENTITY_CHOICES,...DAY4_ACCIDENT_CHOICES,...DAY4_SHARING_CHOICES].map(item=>item.id);
  if(state.storyFlags.day4RuntimeVersion!==3&&legacyIds.includes(id)){state.storyFlags.day4RuntimeVersion=2;return applyLegacyDay4ChoiceState(state,id);}
  const applied=state.storyFlags.day4V3AppliedChoiceIds??=[];
  if(applied.includes(id))return {stage:state.storyFlags.day4RuntimeStage??state.storyFlags.day4V3RuntimeStage??0};
  const result=applyDay4V3OpeningChoiceState(state,id);
  if(!result)return null;
  applied.push(id);state.storyFlags.day4RuntimeVersion=3;state.storyFlags.day4RuntimeStage=result.stage;
  if(result.stage===10){state.storyFlags.day4SharingStrategy??="sharing_transparent";state.storyFlags.day4TestimonyLedgerUnlocked=true;state.storyFlags.day4WorkContactPending=true;addCollection(state,"unlockedActions","past-contacts-index","day5-work-contact");addCollection(state,"followUpHooks","day5-work-return");}
  return result;
}

export function getLockedDay4ResumePresentation(state){
  if(isLegacyDay4Save(state))return getLegacyDay4ResumePresentation(state);
  const stage=state.storyFlags?.day4RuntimeStage??0;
  if(stage<=4)return {backgroundId:stage===0?BG.day:stage===4?BG.entry:BG.day,characterId:"girlfriend",characterAssetUrl:DAY4_VISUAL_ASSETS.haeun};
  if(stage<=9)return {backgroundId:BG.cafe,characterId:"best-friend",characterAssetUrl:stage===7||stage===8?DAY4_VISUAL_ASSETS.jihoonSerious:DAY4_VISUAL_ASSETS.jihoonWarmTease};
  return {backgroundId:BG.night,characterId:"girlfriend",characterAssetUrl:DAY4_VISUAL_ASSETS.haeun};
}

export function validateLockedDay4Runtime(){
  const sample={gameMode:"marriage-in-30-days",storyFlags:{day4HomeStrategy:"map-home-basics",day4ContactStrategy:"contact_direct_call",day4IdentityFocus:"identity_evidence_first",day4AccidentQuestion:"accident_direct_knowledge_only",day4SharingStrategy:"sharing_transparent"},storyHistory:[{sceneId:"m30-day3-discharge-phone",choiceId:"inspect-system-first"}]};
  const all=[...getLegacyDay4Segment(sample,0),...segment1(sample),...segment2(sample),...segment3(sample),...segment4(sample),...endingSegment(sample)];
  const text=JSON.stringify(all);
  return all.filter(step=>step.type==="transition").length>=7&&all.filter(step=>step.type==="dialogue").length>=55&&all.filter(step=>step.type==="choice").length===5&&!text.includes("가짜 하은")&&!text.includes("D-27")&&!text.includes("트럭");
}
