import { DAY5_PRESENTATION_SCENES } from "./day5-presentation-data.mjs";
import { STORY_OUTFIT_ASSETS } from "./story-outfit-assets.mjs";

const ID="m30-day5-work-return";
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const choice=options=>({type:"choice",options});
const enter=(characterId,expressionId="calm")=>({type:"characterEnter",characterId,expressionId,animationId:"idle-breathe"});
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
  n("식탁 위에는 약, 출입증, 어제 만든 증언 장부가 나란히 놓여 있었다."),
  d("하은","넥타이 조금 비뚤어졌어. 고쳐 줘도 돼, 아니면 오늘의 자율 과제야?","smile"),
  d("나","위치만 말해 줘."),
  ...haeunBoundaryDialogue(state),
  n("하은은 약과 물을 가방 옆에 두고 한 걸음 물러났다. 출입증과 휴대폰까지 직접 챙겼다."),
  d("하은","보지 마. 출근 첫날 아침을 망친 여자친구 기록은 아직 잠금이야.","smile"),
  d("나","연기가 먼저 증거를 제출했는데."),
  d("하은","토스트는 실패했고 계란은 살아 있어. 실패 보고서와 대체안까지 완벽하지?","smile"),
  d("나","출입증 사진은 내가 아닌 것 같은데."),
  d("하은","사진은 원래 본인보다 자신감이 많아. 점심은 네가 정하고, 힘들면 연락. 보고서는 필요 없어.","smile"),
  ...day4Callback(state),
  n("오늘의 목표를 적었다. 두 시간, 현재 권한 확인, 사람과 기록의 출처 구분, 증상이 오면 중단."),
  d("하은","오늘 기억해야 할 건 성과 말고 네가 정한 순서야."),
  ...scene("S02_OFFICE_THRESHOLD","SCENE 02 · 회사의 문턱"),
  enter("girlfriend","calm"),
  n("하은은 회전문 앞에서 멈췄다. 회사 안까지 따라오지 않았다."),
  d("하은","들어가는 건 네가 정해. 나는 여기서 손만 흔들게."),
  d("나","두 시간 뒤에 내가 먼저 연락할게."),
  d("하은","좋아. 늦으면 추궁 대신 물부터 마셨는지 물어볼게.","smile"),
  d("하은","서진 씨든 민호 씨든, 기억 안 나면 모른다고 해. 예전의 네가 친했다고 지금도 바로 친할 의무는 없어."),
  n("출입증을 대자 게이트가 열렸다. 익숙하게 반응한 기계와 낯선 복도 사이에서 확인 순서를 정했다."),
  choice(DAY5_ENTRY_CHOICES)
];}

function entryReaction(id){
  if(id==="entry_social_map")return [n("민호에게 이름, 현재 역할, 마지막 직접 접촉 시점을 나눠 말해 달라고 했다."),d("민호","좋아. 친했다는 말부터 믿으라고 안 할게. 지금 팀부터 지도처럼 그려 줄게."),d("나","평가는 빼고 현재 역할부터.")];
  if(id==="entry_recovery_boundary")return [d("나","기억 공백이 있고 두 시간 제한입니다. 두통이나 방향 감각 이상이 오면 설명 중이라도 멈춥니다."),d("팀장","그 기준을 오늘 일정의 최우선 조건으로 기록하겠습니다."),n("사람들의 표정이 아니라 문서에 남은 중단 조건을 먼저 확인했다.")];
  return [n("출입 권한이 방문자 등급으로 낮아진 것과 오늘 승인된 공간을 먼저 확인했다."),d("나","예전 권한은 사용하지 않겠습니다. 오늘 접근 가능한 자료와 담당자를 알려 주세요."),d("팀장","현재 사실만 정리해 두었습니다. 과거 업무 판단은 별도 보관했습니다.")];
}

function segment1(state){return [
  ...entryReaction(state.storyFlags?.day5EntryStrategy),
  ...scene("S03_COWORKER_REUNION","SCENE 03 · 이름을 다시 배우는 방식"),
  enter("office-best-male","smile"),
  d("민호","민호. 메시지 보낸 사람. 반가워서 안고 싶지만 오늘은 사원증만 보여 줄게.","smile"),
  d("나","내가 당신을 뭐라고 불렀죠?"),
  d("민호","회사에서는 민호 씨. 야근 끝나면 그냥 민호. 어느 쪽을 쓸지는 지금 네가 정해."),
  d("나","당분간 민호 씨로 하죠."),
  d("민호","접수. 서운함은 기억 돌아오면 소급 청구할게.","smile"),
  n("민호는 동료 이름 옆에 현재 업무와 정보 출처를 적었다. 친밀도 대신 확인 가능한 관계가 생겼다."),
  d("민호","모르는 이름은 빈칸으로 둬. 내가 대신 채우면 네 지도가 아니니까."),
  d("민호","다들 선배가 제 멘토였다고 했는데, 그건 제가 붙인 말도 섞여 있습니다."),
  d("나","직접 본 것과 평가는 계속 나눠 주세요."),
  ...scene("S04_DESK_RETURN","SCENE 04 · 비어 있지 않은 자리"),
  enter("team-lead","calm"),
  d("팀장","오늘은 자리 확인과 팀 변경 사항 설명까지만 합니다. 업무 판단은 요구하지 않겠습니다."),
  d("나","제가 원해도 승인하지 않습니까?"),
  d("팀장","네. 복귀는 성과가 아니라 절차입니다."),
  n("모니터 옆 메모에는 ‘실패 가설—다음 검증 순서’라고 적혀 있었다. 글씨는 내 것이었지만 결론은 남의 것처럼 보였다."),
  d("나","과거 자료와 현재 자료를 섞지 말아 주세요."),
  d("팀장","서진 씨가 두 묶음으로 나눴습니다."),
  n("읽지 않은 알림은 세 자리를 넘었지만 네트워크 케이블은 뽑혀 있었다. 현재 요청이 과거 기록과 섞이지 않게 만든 오프라인 자리였다."),
  ...scene("S05_SEOJIN_CONTEXT","SCENE 05 · 윤서진이라는 동료"),
  enter("female-coworker","smile"),
  d("윤서진","윤서진. 같은 팀 서비스 전략. 기억 안 난다고 먼저 말해도 괜찮아요. 서운한 표정은 퇴근 뒤에 연습할게요.","smile"),
  d("나","반응이 익숙하네요."),
  d("윤서진","낯선 상황에서 질문 순서 정하는 것도 그대로고요. 다만 그게 예전의 당신과 같다는 증거는 아니죠."),
  n("서진은 파란 파일과 회색 파일을 책상 양쪽 끝에 놓았다. 어느 쪽도 내 앞으로 밀지 않았다."),
  d("윤서진","파란 쪽은 지금 팀이 아는 사실. 회색은 예전의 당신이 남긴 판단이에요. 섞으면 따라 쓰게 되니까."),
  d("나","병원 소식도 계속 확인했어요?"),
  d("윤서진","팀 공지는 봤고, 개인적으로 몇 번 더 물은 것도 맞아요. 동료가 일 년째 안 돌아오는데 프로젝트만 궁금했다고 하면 더 이상하잖아요."),
  d("나","지훈은 사고 전 마지막 만남에서 내가 단 음료를 마셨다고 했습니다."),
  d("윤서진","회사에서는 잠 깨려고 아메리카노, 친구 앞에서는 다른 걸 마셨을 수도 있죠. 시점과 장소를 붙이면 둘 다 맞을 수 있어요."),
  d("민호","회의 전 아메리카노는 직접 여러 번 봤습니다."),
  choice(DAY5_SEOJIN_CHOICES)
];}

function seojinReaction(id){
  if(id==="seojin_current_intent")return [d("나","과거의 내가 아니라 지금의 나에게 무엇을 기대하죠?"),d("윤서진","기억나는 척하지 않는 것. 그리고 모르는 걸 숨기지 않고 같이 확인하는 것."),n("업무 평가보다 사람을 향한 답이 먼저 돌아왔다.")];
  if(id==="seojin_present_boundary")return [d("나","과거 관계는 자료로만 두고, 지금의 협업 기준부터 정하죠."),d("윤서진","좋아요. 질문은 직접, 추측은 표시, 개인적인 건 거절해도 이유를 요구하지 않기."),d("나","그 기준으로 시작하겠습니다.")];
  return [d("나","우리가 맡았던 역할과 결정 기록부터 보여 주세요. 해석은 나중에 듣겠습니다."),d("윤서진","저는 시장 가설, 당신은 손익과 중단 기준. 공동 문서의 수정 기록도 같이 열죠."),n("서진은 친분을 증명하려 하지 않고 변경 이력을 시간순으로 정렬했다.")];
}

function segment2(state){return [
  ...seojinReaction(state.storyFlags?.day5SeojinStrategy),
  ...scene("S06_WORK_TRIAL","SCENE 06 · 판단을 빌리는 연습"),
  enter("female-coworker","calm"),
  d("윤서진","기억 말고 판단부터 빌리죠. 같은 실패 가설을 과거 결론과 현재 수치로 따로 만들었어요."),
  d("나","정답을 맞히는 검사가 되면 중단하겠습니다."),
  d("윤서진","동의해요. 오늘 확인할 건 결론이 아니라 근거를 다루는 방식."),
  d("민호","선배 가설이 틀렸을 때 제 반대 자료를 보고 본인 이름부터 지운 건 직접 봤습니다."),
  n("파란 파일에는 현재 고객 이탈률, 회색 파일에는 사고 전 내가 적은 원인이 있었다."),
  d("나","표본 기간이 다릅니다. 같은 숫자처럼 비교하면 안 돼요."),
  d("윤서진","첫 번째 확인 통과. 그다음은 어떻게 볼래요?"),
  n("머릿속에 답이 떠오르지는 않았지만, 틀릴 수 있는 지점을 찾는 습관은 남아 있었다."),
  d("나","익숙한 느낌은 증거로 쓰지 않겠습니다."),
  choice(DAY5_WORK_CHOICES)
];}

function workReaction(id){
  if(id==="work_bounded_review")return [d("나","한 가설만, 십오 분. 자료 출처와 반례까지만 확인하죠."),d("윤서진","타이머 시작. 결론은 다음 방문까지 금지."),n("시간이 끝나자 미완성 문장에서도 손을 뗐다. 중단 기준을 지키는 것도 업무 능력이었다.")];
  if(id==="work_pair_check")return [d("나","서로 근거를 하나씩 설명하고 상대가 빠진 조건만 표시합시다."),d("윤서진","좋아요. 제가 설득하려 들면 바로 멈춰요."),n("같은 결론에 도착하는 대신 서로 다른 전제를 발견했다. 협업은 기억보다 현재의 규칙에서 시작됐다.")];
  return [d("나","오늘은 출처와 차이만 표시하겠습니다. 판단은 보류하죠."),d("윤서진","보류도 근거가 있으면 결정이에요."),n("두 파일 사이에 날짜, 표본, 담당자 차이만 적었다. 과거 결론은 끝까지 닫아 두었다.")];
}

function segment3(state){return [
  ...workReaction(state.storyFlags?.day5WorkTrial),
  ...scene("S07_RETURN_PLAN","SCENE 07 · 돌아오는 방식"),
  enter("team-lead","calm"),
  d("팀장","두 시간 중 남은 시간은 십팔 분입니다. 다음 방문 방식을 정하고 종료하죠."),
  d("나","오늘 확인한 능력을 바로 업무 배정 근거로 쓰지는 말아 주세요."),
  d("팀장","의료 확인과 별개로 단계적 합의를 거치겠습니다."),
  d("윤서진","제가 알고 싶은 건 예전의 답이 아니라, 지금 어떤 기준으로 돌아올지예요."),
  n("현재 업무, 사람 관계, 회복 경계. 세 방향 모두 필요했지만 다음 방문의 우선순위는 하나로 정해야 했다."),
  d("팀장","오늘 정한 우선순위는 다음 방문 전에 다시 바꿀 수 있습니다."),
  d("민호","사람 목록은 제가 정리하되, 직접 함께 일한 범위를 따로 표시하겠습니다."),
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
  if(haeunTier(state)==="MID")return [d("하은 메시지","한 글자보다 길어서 만족. 집에 오면 회사 얘기 말고 점심 메뉴부터 말해 줘.","smile")];
  return [d("하은 메시지","확인했어. 집에 도착하면 한 줄만 더 보내 줘. 회사 얘기는 네가 하고 싶을 때 듣고.")];
}

function segment4(state){return [
  ...returnReaction(state.storyFlags?.day5ReturnStrategy),
  ...planCallback(state),
  ...scene("S08_DAY_END","SCENE 08 · 퇴근이 아니라 첫 귀환"),
  enter("office-best-male","smile"),
  d("민호","두 시간 채웠다. 예전 같으면 삼십 분 더 우겼을 텐데 오늘은 어때?","smile"),
  d("나","예전의 나보다 오늘 정한 기준을 지킨 쪽이 중요해요."),
  d("민호","그 답이면 다음에도 민호 씨로 불려도 참지.","smile"),
  d("민호","그리고… 돌아와서 다행입니다. 이건 출처 없이 제 감정입니다."),
  d("나","그건 그대로 받겠습니다."),
  ...seojinExitCallback(state.storyFlags?.day5SeojinStrategy),
  n("임시 예비폰에 하은이 보낸 태우지 않은 볶음밥 사진과 ‘생활 안전 앱 업데이트: 오늘은 성공.’이라는 문장이 와 있었다."),
  d("나","살아 있음. 예정 시간보다 12분 일찍 끝남."),
  ...haeunExitDialogue(state),
  d("나","점심 먹고 말할게. 오늘은 내가 정한 시간에 나왔어."),
  n("계획표, 동료 관계 지도, DAY 4 증언 장부를 서로 다른 세 폴더에 저장했다."),
  n("DAY REPORT · 윤서진—현재 동료/과거 관계 미확인 · 민호—직접 경험 범위를 구분하는 후배 · 새 원칙—과거 평판과 현재 능력을 분리한다."),
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
  if(stage===0)return segment0(state);
  if(stage===1)return segment1(state);
  if(stage===2)return segment2(state);
  if(stage===3)return segment3(state);
  return segment4(state);
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
    state.storyFlags.day5ReturnStrategy=id;state.storyFlags.day5_return_strategy=id;state.storyFlags.day5RuntimeStage=4;state.storyFlags.day5SceneCheckpoint="before-day-report";state.storyFlags.day5ReturnPlanReady=true;state.storyFlags.day5_work_return_plan_saved=true;remember(state,id);
    const unlocks=id==="request-current-briefing"?["review-current-work","office-briefing"]:id==="rebuild-social-context"?["coworker-lunch","ask-team-history"]:["planned-work-return","review-current-work"];
    applyOnce(()=>{if(id==="request-current-briefing")addMetric(state,"seojinStatusInterest",2);if(id==="rebuild-social-context"){addMetric(state,"seojinAffection",2);addMetric(state,"coworkerRelation",2);}if(id==="set-return-boundary"){addMetric(state,"seojinAffection",1);addMetric(state,"seojinStatusInterest",1);}});
    addCollection(state,"profileUnlocks","seojin-basic");addCollection(state,"unlockedActions","day5-team-map","day5-work-trial",...unlocks,"day6-life-restart");addCollection(state,"followUpHooks","day6-life-restart");addCollection(state,"introducedNpcIds","female-coworker","team-lead","office-best-male");
    state.storyFlags.day5_haeun_autonomy_trust=true;state.storyFlags.day6_life_restart_pending=true;
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
