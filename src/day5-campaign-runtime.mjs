import { DAY5_PRESENTATION_SCENES } from "./day5-presentation-data.mjs";
import { STORY_OUTFIT_ASSETS } from "./story-outfit-assets.mjs";

const ID="m30-day5-work-return";
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const choice=options=>({type:"choice",options});
const enter=(characterId,expressionId="calm")=>({type:"characterEnter",characterId,expressionId,animationId:"idle-breathe"});
const checkpoint=checkpointId=>({type:"checkpoint",checkpointId});
const scene=(key,label)=>{const view=DAY5_PRESENTATION_SCENES[key];return [
  {type:"transition",style:"fade",label,backgroundId:view.backgroundId,characterId:view.characterId,bgmId:view.bgm.category,bgmVariant:view.bgm.variant,bgmVolume:view.bgm.volume},
  ...(view.shotMode==="event-cg"&&view.assetPath?[{type:"cgShow",source:view.assetPath,duration:3600}]:[]),
  ...view.sfx.map(sfxId=>({type:"sfx",sfxId}))
];};
const haeunTier=state=>{const score=(state.scenario?.haeunAffection??0)+(state.scenario?.haeunTrust??0);return score>=16?"HIGH":score>=7?"MID":"LOW";};
function haeunBoundaryDialogue(state){
  if(haeunTier(state)==="HIGH")return [d("하은","내가 고쳐 줘도 되는 날은 네가 먼저 말해. 오늘은 거울로."),d("나","고마워."),d("하은","그 고맙다는 말도 천천히 줄여 가자.","smile")];
  if(haeunTier(state)==="MID")return [d("하은","오른쪽이 조금 길어. 오늘의 첫 업무는 넥타이 좌우 합의."),d("나","수정했습니다."),d("하은","합의안 통과.","smile")];
  return [d("하은","알겠어. 거울 오른쪽 봐. 내가 말로만 맞춰 줄게."),d("나","그게 편해."),d("하은","편한 방식부터 기억하면 돼.")];
}

export const LOCKED_DAY5_SCENE_ID=ID;
export const DAY5_ENTRY_CHOICES=Object.freeze([
  {id:"entry_current_facts",label:"현재 출입 권한과 오늘 확인할 사실부터 정한다"},
  {id:"entry_social_map",label:"민호에게 지금의 팀 사람과 관계 지도를 먼저 묻는다"},
  {id:"entry_recovery_boundary",label:"의료 제한과 중단 기준을 먼저 모두에게 알린다"}
]);
export const DAY5_SEOJIN_CHOICES=Object.freeze([
  {id:"seojin_role_history",label:"서진과 맡았던 역할·결정 기록부터 확인한다"},
  {id:"seojin_current_intent",label:"서진이 지금 나에게 기대하는 것을 직접 묻는다"},
  {id:"seojin_present_boundary",label:"과거 관계보다 현재의 협업 기준부터 합의한다"}
]);
export const DAY5_WORK_CHOICES=Object.freeze([
  {id:"work_observe_only",label:"두 자료의 출처와 차이만 관찰하고 판단은 보류한다"},
  {id:"work_bounded_review",label:"한 가설만 골라 제한 시간 안에 검토한다"},
  {id:"work_pair_check",label:"서진과 서로의 판단 근거를 한 항목씩 교차 확인한다"}
]);
export const DAY5_RETURN_CHOICES=Object.freeze([
  {id:"request-current-briefing",label:"현재 팀의 사실·일정·책임 범위부터 브리핑받는다"},
  {id:"rebuild-social-context",label:"업무 전에 놓친 관계와 최근 변화를 직접 묻는다"},
  {id:"set-return-boundary",label:"기억 공백과 의료 제한을 공개하고 업무 범위를 문서로 합의한다"}
]);

function day4Callback(state){
  const id=state.storyFlags?.day4SharingStrategy;
  if(id==="sharing_transparent")return [d("하은","어제처럼 확인된 것과 아직 모르는 걸 나눠 말하면 돼. 회사 사람 말도 자동으로 정답은 아니고."),d("나","확인된 사실부터 기록할게.")];
  if(id==="sharing_compare_then_disclose")return [d("하은","회사에서 들은 말도 겹치는 부분부터 대조해. 한쪽 기억만으로 결론 내리지 말고."),d("나","출처가 둘 이상일 때만 범위를 넓힐게.")];
  return [d("하은","어제 만든 장부 가져가. 정리한 뒤 말해도 되니까 오늘 안에 다 설명하려고 하지 마."),d("나","내가 확인한 순서대로만 공유할게.")];
}

function segment0(state){return [
  ...scene("S01_HOME_PREP","DAY 5 · 다시 만난 자리"),
  enter("girlfriend","smile"),
  n("식탁 위에는 약봉투, 물, 회사 출입증, 충전된 휴대폰이 한 줄로 놓여 있었다. 하은은 태운 식빵의 검은 부분을 긁어 내다 나와 눈이 마주쳤다."),
  d("하은","보지 마. 출근 첫날 아침을 망친 여자친구 기록은 아직 잠금이야.","smile"),
  d("나","연기가 먼저 증거를 제출했는데."),
  d("하은","토스트는 실패했고 계란은 살아 있어. 실패 보고서와 대체안까지 완벽하지?","smile"),
  n("증언을 적어 둔 노트 옆에 출입증을 놓았다. 사진 속 남자는 낯설지만 사번과 이름은 현재 자료와 일치했다."),
  d("하은","넥타이 조금 비뚤어졌어. 고쳐 줘도 돼, 아니면 위치만 말할까?","smile"),
  d("나","위치만."),
  d("하은","오른쪽으로 손가락 한 마디. 조금 아래. 됐다."),
  ...haeunBoundaryDialogue(state),
  n("하은은 약과 물을 가방 옆에 두고 한 걸음 물러났다. 출입증과 휴대폰까지 직접 챙겼다."),
  d("나","어제 회사에서 누가 연락했다고 말했지?"),
  d("하은","민호. 네가 메모에 ‘회사? 직접 확인 필요’라고 쓴 사람. 나는 이름도 처음 봤어."),
  ...day4Callback(state),
  d("하은","점심은 네가 정하고, 힘들면 병원 먼저. 나한테 보고서는 필요 없어."),
  d("나","연락도 안 해도 돼?"),
  d("하은","안전하게 돌아오면 돼. 그래도 ‘살아 있음’ 한 글자쯤 보내면 생활 안전 앱이 조용해지고.","smile"),
  d("나","한 글자가 아닌데."),
  d("하은","기억 잃어도 계산은 빠르네.","smile"),
  ...scene("S02_OFFICE_THRESHOLD","SCENE 02 · 회사의 문턱"),
  enter("girlfriend","calm"),
  n("회전문 너머로 출근 인파가 이어졌다. 게이트, 안내 데스크, 비상구를 차례로 확인했다."),
  d("하은","회사 안까지 갈까?"),
  d("나","아니. 여기서부터는 내가 확인할게."),
  d("하은","응. 두 시간 뒤에도 여기서 기다리지는 않을 거야. 기다리는 사람 생각 때문에 시계만 보게 되면 손해잖아."),
  d("나","그럼 어디 있어?"),
  d("하은","장 보고 집. 오늘 저녁은 태우지 않는 쪽으로 복구할 예정.","smile"),
  d("하은","그리고 서진 씨든 민호 씨든, 기억 안 나면 모른다고 해. 예전의 네가 친했다고 지금도 바로 친할 의무는 없어."),
  choice(DAY5_ENTRY_CHOICES)
];}

function entryReaction(id){
  if(id==="entry_social_map")return [d("나","사람부터 볼게. 누가 지금 무슨 일을 하는지 알아야 질문할 수 있으니까."),d("하은","어제는 친구, 오늘은 동료. 연락처 인덱스가 바빠지겠네.","smile"),n("민호에게 이름, 현재 역할, 마지막 직접 접촉 시점을 나눠 말해 달라고 했다.")];
  if(id==="entry_recovery_boundary")return [d("나","내 상태부터 말할게. 기대치를 낮추는 게 아니라 오늘 가능한 범위를 맞추는 거야."),d("하은","그 말이면 됐다. 다녀와."),n("두 시간 제한과 두통·방향 감각 이상 시 즉시 중단한다는 기준을 문서에 넣었다.")];
  return [d("나","현재 일정과 권한부터 볼게. 내가 어떤 사람이었는지는 그다음."),d("하은","좋아. 오늘도 확인한 것, 들은 것, 모르는 것. 회사 버전이네.","smile"),n("출입 권한이 방문자 등급으로 낮아진 것과 오늘 승인된 공간을 먼저 확인했다.")];
}

function segment1(state){return [
  ...entryReaction(state.storyFlags?.day5EntryStrategy),
  ...scene("S03_COWORKER_REUNION","SCENE 03 · 이름을 다시 배우는 방식"),
  enter("office-best-male","smile"),
  n("출입증을 대자 게이트가 열렸다. 엘리베이터의 14층 버튼은 다른 숫자보다 표면이 닳아 있었다."),
  d("민호","선배."),
  d("민호","아, 죄송합니다. 민호입니다. 어제 메시지 보낸 사람. 악수는… 괜찮으시면."),
  d("나","지금은 말로 하죠. 어떤 관계였습니까?"),
  d("민호","같은 팀 후배였습니다. 프로젝트 두 개 같이 했고요. 제가 직접 본 건 거기까지. 다들 선배가 제 멘토였다고 했는데, 그건 제가 붙인 말도 섞여 있습니다."),
  d("나","구분해 줘서 고맙습니다."),
  d("민호","지훈 선배한테 배운 방식이랑 비슷하다고 들었— 아, 그 사람은 전 모릅니다. 서진 선배가 어제 전달해 줬어요. 연락처 복원 중이라고."),
  d("윤서진","민호 씨, 첫 설명부터 정보 출처 시험을 통과했네요.","smile"),
  d("민호","어제 세 번 연습했습니다."),
  d("윤서진","연습한 것까지 말하면 자연스러움 점수는 깎이고요.","smile"),
  d("나","윤서진 씨?"),
  d("윤서진","맞아요. 스물일곱, 같은 팀 서비스 전략. 기억 안 난다고 먼저 말해도 괜찮아요. 서운한 표정은 퇴근 뒤에 따로 연습할게요.","smile"),
  d("나","민호 씨보다 자연스럽네요."),
  d("윤서진","저는 연습했다는 말을 안 하니까요.","smile"),
  checkpoint("after-introductions"),
  ...scene("S04_DESK_RETURN","SCENE 04 · 비어 있지 않은 자리"),
  enter("team-lead","calm"),
  d("팀장","오신 것만으로 충분합니다. 오늘은 두 시간, 자리 확인과 팀 변경 사항 설명까지만 하겠습니다."),
  d("나","업무 판단을 요구하는 일은 없습니까?"),
  d("팀장","없습니다. 원하셔도 오늘은 승인하지 않겠습니다. 복귀는 성과가 아니라 절차입니다."),
  n("책상에는 먼지가 없고 개인 물건은 상자에 정리되어 있었다. 모니터 옆에는 비어 있는 명패만 남아 있었다."),
  d("민호","매주 닦았습니다. 제가 한 건 아니고 청소 담당이요. 제가 했다고 하면 너무 티 나죠."),
  d("나","솔직해서 좋네요."),
  d("윤서진","민호 씨의 장점이자 보고서가 길어지는 이유예요.","smile"),
  n("읽지 않은 알림은 세 자리를 넘었다. 서진은 네트워크 케이블을 연결하지 않은 채 로컬 폴더만 열었다."),
  d("나","왜 오프라인이죠?"),
  d("윤서진","새 알림이 계속 들어오면 과거 자료와 현재 요청이 섞이니까요. 오늘 볼 수 있는 것만 따로 복사했어요."),
  n("화면에는 ‘현재 팀—확인된 사실·일정·담당자’와 ‘과거 기록—본인이 남긴 판단·가설·실패’ 두 파일이 나타났다."),
  d("윤서진","기억 말고 판단부터 빌리죠. 어느 쪽도 먼저 열 필요는 없고요."),
  ...scene("S05_SEOJIN_CONTEXT","SCENE 05 · 윤서진이라는 동료"),
  enter("female-coworker","smile"),
  d("윤서진","예전엔 아메리카노. 오늘은 물부터 드세요. 취향 정보와 의료 조언 중 하나만 고르라면 후자가 안전하니까."),
  d("나","지훈은 내가 단 음료를 마셨다고 했습니다."),
  d("윤서진","언제요?"),
  d("나","사고 전 마지막으로 만났을 때."),
  d("윤서진","그럼 둘 다 맞을 수 있겠네요. 회사에서는 잠 깨려고 아메리카노, 친구 앞에서는 다른 걸 마셨을 수도 있고."),
  d("민호","회의 전에는 무조건 아메리카노였습니다. 직접 산 걸 여러 번 봤습니다."),
  d("나","좋아요. 회사에서, 회의 전, 직접 봄."),
  d("윤서진","사람을 기억하는 방식이 데이터베이스 같아졌네요.","smile"),
  d("나","사람 말을 틀렸다고 몰지 않으려면 필요합니다."),
  d("윤서진","그 기준은 예전보다 나을 수도 있겠네요."),
  choice(DAY5_SEOJIN_CHOICES)
];}

function seojinReaction(id){
  if(id==="seojin_current_intent")return [d("나","병원 소식을 공식 공지보다 더 물었다고 했죠. 지금 나에게 원하는 건 뭡니까?"),d("윤서진","동료가 돌아왔는지 궁금했고, 돌아왔다면 다시 이야기할 수 있는지도 궁금했어요. 그 이상은 지금 답을 만들어 말하고 싶지 않고요.")];
  if(id==="seojin_present_boundary")return [d("나","우리가 얼마나 친했는지는 나중에 확인하죠. 오늘은 처음 만난 동료로 시작하겠습니다."),d("윤서진","조금 아쉽지만 공정하네요. 그럼 첫인상 관리부터 다시 해야겠어요.","smile")];
  return [d("나","우리가 함께한 일과 각자 책임부터 알려 주세요. 개인적인 평가는 뒤로 미루고."),d("윤서진","좋아요. 책임 범위부터 묻는 건 여전하네요. 그 말을 칭찬으로 받을지는 현재 자료를 본 뒤 정하고요.")];
}

function segment2(state){return [
  ...seojinReaction(state.storyFlags?.day5SeojinStrategy),
  ...scene("S06_WORK_TRIAL","SCENE 06 · 판단을 빌리는 연습"),
  enter("female-coworker","calm"),
  d("나","잘된 게 아니라 틀린 이유를 고정해 뒀네요."),
  d("윤서진","잘된 건 다들 기억하니까요. 본인은 틀린 이유를 안 잊으려고 했어요. 꽤 피곤한 사람이었죠."),
  d("민호","저희한테도 피곤했습니다. 대신 본인 가설이 틀리면 제일 먼저 이름 지우고 다시 썼고요."),
  d("나","직접 봤습니까?"),
  d("민호","네. 제가 낸 반대 자료 때문에 회의가 뒤집힌 적이 있습니다."),
  n("현재 팀 파일에서 익명화된 결제 화면 이탈률 문제 한 장을 열었다. 답이 아니라 질문 순서를 보는 연습이었다."),
  d("팀장","원하시면 읽기만 하십시오. 결과는 평가하지 않습니다."),
  d("나","평가하지 않는다고 말해도 사람들은 반응을 보겠죠."),
  d("윤서진","맞아요. 저도 볼 겁니다. 대신 기억을 시험하지 않고 지금 어떤 확인 순서를 만드는지만 볼게요."),
  choice(DAY5_WORK_CHOICES)
];}

function workReaction(id){
  if(id==="work_bounded_review")return [d("나","15분. 원인 확정은 하지 않고 다음 확인 순서만 만들겠습니다."),d("윤서진","시간 제한까지 먼저 거는군요. 능력을 증명하려다 회복 계획을 망치는 사람보다는 같이 일하기 쉽겠어요."),n("정확히 15분 뒤 미완성 문장에서도 손을 떼고 화면을 닫았다.")];
  if(id==="work_pair_check")return [d("나","민호 씨가 현재 사정을 설명하고, 서진 씨가 빠진 반례를 지적해 주세요. 저는 질문만 정리하겠습니다."),d("민호","네. 이건 연습 안 했지만 해 보겠습니다."),d("윤서진","사람을 쓰는 방식도 확인 대상이네요. 좋아요."),n("민호의 설명과 서진의 반례를 서로 다른 칸에 기록했다.")];
  return [d("나","표본 기간, 기기 분류, 변경 배포 시점이 없습니다. 오늘은 누락만 표시하겠습니다."),d("윤서진","정답을 서두르지 않는 건 좋네요. 예전보다 보고서가 짧아질 가능성도 있고."),n("과거 결론은 끝까지 닫아 두었다.")];
}

function segment3(state){return [
  ...workReaction(state.storyFlags?.day5WorkTrial),
  ...scene("S07_RETURN_PLAN","SCENE 07 · 돌아오는 방식"),
  enter("team-lead","calm"),
  d("팀장","오늘 상태를 기준으로 다음 주 한 번, 최대 세 시간까지 제안합니다. 업무 책임은 부여하지 않습니다."),
  d("나","중단 기준과 접근 권한도 문서에 넣어 주세요."),
  d("윤서진","제가 현재 자료 묶음을 갱신하겠습니다. 과거 파일은 요청할 때만 열고요."),
  d("민호","사람 목록은 제가 정리하겠습니다. 제가 직접 함께 일한 범위도 표시해서."),
  d("나","두 사람 역할을 제가 고른 건 아닙니다."),
  d("윤서진","맞아요. 그래서 제안입니다. 거절해도 서운한 표정은 퇴근 뒤 연습하고.","smile"),
  d("민호","저도 연습해야 합니까?"),
  d("윤서진","민호 씨는 이미 자연스럽게 서운해 보여요.","smile"),
  choice(DAY5_RETURN_CHOICES)
];}

function returnReaction(id){
  if(id==="request-current-briefing")return [d("나","과거 자료는 닫고 현재 팀의 사실, 일정, 책임 범위부터 브리핑받겠습니다."),d("윤서진","파란 파일만 열죠. 과거의 정답보다 현재의 책임부터.","smile")];
  if(id==="rebuild-social-context")return [d("나","업무 전에 팀원들의 현재 역할과 최근 변화를 직접 묻겠습니다."),d("윤서진","관계를 업무 부록으로 안 보는 건 의외네요. 점심 가능한 시간부터 보낼게요.","smile")];
  return [d("나","기억 공백과 의료 제한을 공개하고 다음 방문의 업무 범위를 문서로 합의하겠습니다."),d("팀장","시간, 중단 조건, 승인 범위를 함께 적겠습니다."),d("윤서진","마지막 줄은 ‘모르면 확인, 기억나는 척 금지’로 하죠.")];
}

function planCallback(state){
  const entry={entry_current_facts:"현재 권한·담당자·출처 목록",entry_social_map:"팀장·서진·민호의 현재 역할",entry_recovery_boundary:"중단 증상·책임 제외 조항"}[state.storyFlags?.day5EntryStrategy]??"현재 권한 목록";
  const work={work_observe_only:"누락 항목만 기록하고 판단 보류",work_bounded_review:"15분 검토 제한",work_pair_check:"민호 설명과 서진 반례 분리"}[state.storyFlags?.day5WorkTrial]??"업무 판단 보류";
  return [n(`다음 방문 계획표에는 ${entry}, ${work}가 한 문서에 함께 기록됐다.`)];
}
function seojinExitCallback(id){
  if(id==="seojin_role_history")return [d("윤서진","다음에는 공동 프로젝트 두 개의 책임표부터 준비할게요.")];
  if(id==="seojin_current_intent")return [d("윤서진","개인적인 답은 오늘 만든 관계가 더 쌓이면 다시 물어봐요.")];
  return [d("윤서진","처음 만난 동료 기준 첫인상은 나쁘지 않았어요.","smile")];
}
function haeunExitDialogue(state){
  if(haeunTier(state)==="HIGH")return [d("하은 메시지","정한 시간에 나온 거, 잘했어. 오늘 네가 세운 기준은 내가 대신 묻지 않을게. 집에서는 점심 메뉴부터.","smile")];
  if(haeunTier(state)==="MID")return [d("하은 메시지","`한 글자보다 길어서 만족.`","smile"),d("하은 메시지","집에 오면 회사 얘기 말고 점심 메뉴부터 말해 줘.","smile")];
  return [d("하은 메시지","확인했어. 집에 도착하면 한 줄만 더 보내 줘. 회사 얘기는 네가 하고 싶을 때 듣고.")];
}

function segment4(state){return [
  ...returnReaction(state.storyFlags?.day5ReturnStrategy),
  ...planCallback(state),
  ...scene("S08_DAY_END","SCENE 08 · 퇴근이 아니라 첫 귀환"),
  enter("office-best-male","smile"),
  n("두 시간이 지나기 전에 사무실을 나왔다. 민호는 엘리베이터 앞까지 따라왔지만 로비 밖으로는 나오지 않았다."),
  d("민호","선배. 다음에는 제가 아는 사람 목록부터 드리겠습니다. 모르는 사람은 모른다고 쓰고요."),
  d("나","오늘처럼 직접 본 범위만 적어 주세요."),
  d("민호","네. 그리고… 돌아와서 다행입니다. 이건 출처 없이 제 감정입니다."),
  d("나","그건 그대로 받겠습니다."),
  d("윤서진","제가 알고 싶은 건 예전의 답이 아니라 지금 정한 기준이에요. 오늘은 충분히 봤고요."),
  ...seojinExitCallback(state.storyFlags?.day5SeojinStrategy),
  n("임시 예비폰에 하은이 보낸 태우지 않은 볶음밥 사진과 ‘생활 안전 앱 업데이트: 오늘은 성공.’이라는 문장이 와 있었다."),
  d("나","살아 있음. 예정 시간보다 12분 일찍 끝남."),
  ...haeunExitDialogue(state),
  d("나","점심 먹고 말할게. 오늘은 내가 정한 시간에 나왔어."),
  n("계획표, 동료 관계 지도, DAY 4 증언 장부를 서로 다른 세 폴더에 저장했다."),
  checkpoint("before-day-report"),
  {type:"continuityNote",text:"윤서진—현재 동료/과거 관계 미확인 · 민호—직접 경험 범위를 구분하는 후배 · 새 원칙—과거 평판과 현재 능력을 분리한다."},
  n("회사에서 돌아온 것은 과거의 직함이 아니었다. 확인하고 멈추고 다시 약속할 수 있는 현재의 판단이었다."),
  d("나","내일은 오늘 기록부터 다시 확인하자."),
  n("내일부터는 병원과 집과 회사 사이에, 지금의 생활을 다시 놓아 보기로 했다."),
  {type:"transition",style:"fade",label:"DAY 5 END",backgroundId:DAY5_PRESENTATION_SCENES.S08_DAY_END.backgroundId,characterId:DAY5_PRESENTATION_SCENES.S08_DAY_END.characterId,bgmId:"daily"},
  {type:"sceneEnd"}
];}

function addMetric(state,key,amount){if(state.scenario?.enabled&&Number.isFinite(state.scenario[key]))state.scenario[key]=Math.max(0,state.scenario[key]+amount);}
function addPlayerMetric(state,key,amount){if(Number.isFinite(state[key]))state[key]=Math.max(0,state[key]+amount);}
function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
function remember(state,id){state.storyFlags??={};state.storyFlags[id]=true;}

export function getLockedDay5Segment(state,stage=state.storyFlags?.day5RuntimeStage??0){
  const segment=stage===0?segment0(state):stage===1?segment1(state):stage===2?segment2(state):stage===3?segment3(state):segment4(state);
  const checkpointId=state.storyFlags?.day5SceneCheckpoint;
  if((stage===1&&checkpointId==="after-introductions")||(stage===4&&checkpointId==="before-day-report")){
    const index=segment.findIndex(step=>step.type==="checkpoint"&&step.checkpointId===checkpointId);
    if(index>=0)return segment.slice(index+1);
  }
  return segment;
}

export function applyLockedDay5CheckpointState(state,checkpointId){
  if(!["after-introductions","before-day-report"].includes(checkpointId))return false;
  state.storyFlags??={};state.storyFlags.day5SceneCheckpoint=checkpointId;
  if(checkpointId==="after-introductions"){state.storyFlags.day5_current_team_map=true;state.storyFlags.day5_minho_provenance_respected=true;}
  if(checkpointId==="before-day-report"){state.storyFlags.day5_haeun_autonomy_trust=true;state.storyFlags.day6_life_restart_pending=true;}
  return true;
}

export function getLockedDay5ResumePresentation(state){
  const stage=state.storyFlags?.day5RuntimeStage??0;
  const key=["S01_HOME_PREP","S03_COWORKER_REUNION","S06_WORK_TRIAL","S07_RETURN_PLAN","S08_DAY_END"][Math.min(4,Math.max(0,stage))];
  const view=DAY5_PRESENTATION_SCENES[key];
  return {
    backgroundId:view.backgroundId,
    characterId:view.characterId,
    ...(view.characterId==="girlfriend"?{characterAssetUrl:STORY_OUTFIT_ASSETS.day5}:{}),
    ...(view.shotMode==="event-cg"?{cgAssetPath:view.assetPath}:{}),
    sceneKey:key
  };
}

export function applyLockedDay5ChoiceState(state,id){
  state.storyFlags??={};
  state.storyFlags.day5ScenarioVersion=2;
  state.storyFlags.day5ChoiceEffectsApplied??={};
  const applyOnce=callback=>{if(state.storyFlags.day5ChoiceEffectsApplied[id])return;callback();state.storyFlags.day5ChoiceEffectsApplied[id]=true;};
  if(DAY5_ENTRY_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day5EntryStrategy=id;state.storyFlags.day5_entry_strategy=id.replace("entry_","");state.storyFlags.day5RuntimeStage=1;state.storyFlags.day5SceneCheckpoint="after-entry-choice";remember(state,id);
    applyOnce(()=>{if(id==="entry_current_facts"){addMetric(state,"investigation",2);addMetric(state,"seojinStatusInterest",2);state.storyFlags.day5_current_authority_verified=true;}if(id==="entry_social_map"){addMetric(state,"coworkerRelation",2);addMetric(state,"seojinAffection",1);state.storyFlags.day5_team_map_started=true;}if(id==="entry_recovery_boundary"){addMetric(state,"haeunTrust",2);addMetric(state,"seojinStatusInterest",1);state.storyFlags.day5_medical_boundary_documented=true;}});
    state.storyFlags.day5_haeun_boundary_respected=true;
    addCollection(state,"unlockedActions",`day5-${id}`);return {stage:1};
  }
  if(DAY5_SEOJIN_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day5SeojinStrategy=id;state.storyFlags.day5_seojin_strategy=id.replace("seojin_","");state.storyFlags.day5RuntimeStage=2;state.storyFlags.day5SceneCheckpoint="after-seojin-choice";remember(state,id);
    applyOnce(()=>{if(id==="seojin_role_history")addMetric(state,"seojinStatusInterest",3);if(id==="seojin_current_intent")addMetric(state,"seojinAffection",3);if(id==="seojin_present_boundary"){addMetric(state,"seojinAffection",1);addMetric(state,"seojinStatusInterest",1);addMetric(state,"coworkerRelation",2);}});
    state.storyFlags.day5_seojin_basic_unlocked=true;addCollection(state,"profileUnlocks","seojin-basic");
    return {stage:2};
  }
  if(DAY5_WORK_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day5WorkTrial=id;state.storyFlags.day5_work_trial=id.replace("work_","");state.storyFlags.day5RuntimeStage=3;state.storyFlags.day5SceneCheckpoint="after-work-choice";remember(state,id);
    applyOnce(()=>{if(id==="work_observe_only"){addMetric(state,"investigation",3);addMetric(state,"seojinStatusInterest",2);}if(id==="work_bounded_review"){addMetric(state,"seojinStatusInterest",4);addPlayerMetric(state,"work",3);addPlayerMetric(state,"energy",-2);}if(id==="work_pair_check"){addMetric(state,"coworkerRelation",3);addMetric(state,"seojinAffection",1);addMetric(state,"seojinStatusInterest",2);}});
    state.storyFlags.day5_pre_accident_work_habit_verified=true;state.storyFlags.day5_minho_provenance_respected=true;
    addCollection(state,"unlockedActions","day5-work-trial");return {stage:3};
  }
  if(DAY5_RETURN_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day5ReturnStrategy=id;state.storyFlags.day5_return_strategy=id;state.storyFlags.day5RuntimeStage=4;state.storyFlags.day5SceneCheckpoint="after-return-choice";state.storyFlags.day5ReturnPlanReady=true;state.storyFlags.day5_work_return_plan_saved=true;remember(state,id);
    const unlocks=id==="request-current-briefing"?["review-current-work","office-briefing"]:id==="rebuild-social-context"?["coworker-lunch","ask-team-history"]:["planned-work-return","review-current-work"];
    applyOnce(()=>{if(id==="request-current-briefing")addMetric(state,"seojinStatusInterest",2);if(id==="rebuild-social-context"){addMetric(state,"seojinAffection",2);addMetric(state,"coworkerRelation",2);}if(id==="set-return-boundary"){addMetric(state,"seojinAffection",1);addMetric(state,"seojinStatusInterest",1);}});
    addCollection(state,"profileUnlocks","seojin-basic");addCollection(state,"unlockedActions","day5-team-map","day5-work-trial",...unlocks,"day6-life-restart");addCollection(state,"followUpHooks","day6-life-restart");addCollection(state,"introducedNpcIds","female-coworker","team-lead","office-best-male");
    return {stage:4};
  }
  return null;
}

export function getLockedDay5LegacyChoice(state){return state.storyFlags?.day5ReturnStrategy??"set-return-boundary";}

export function validateLockedDay5Runtime(){
  const sample={gameMode:"marriage-in-30-days",storyFlags:{day4SharingStrategy:"sharing_transparent",day5EntryStrategy:"entry_current_facts",day5SeojinStrategy:"seojin_role_history",day5WorkTrial:"work_bounded_review",day5ReturnStrategy:"set-return-boundary"}};
  const all=[...segment0(sample),...segment1(sample),...segment2(sample),...segment3(sample),...segment4(sample)];
  const text=JSON.stringify(all);
  return all.filter(step=>step.type==="transition").length>=9&&all.filter(step=>["dialogue","narration"].includes(step.type)).length>=70&&all.filter(step=>step.type==="choice").length===4&&all.filter(step=>step.type==="cgShow").length===4&&!text.includes("가짜 하은")&&!text.includes("D-29")&&!text.includes("트럭");
}
