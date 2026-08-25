import {DAY9_PRESENTATION_SCENES} from "./day9-presentation-data.mjs";
import {STORY_OUTFIT_ASSETS} from "./story-outfit-assets.mjs?v=2";

const ID="m30-day9-second-office-adaptation";
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const choice=options=>({type:"choice",options});
const enter=(characterId,expressionId="calm")=>({type:"characterEnter",characterId,expressionId,animationId:"idle-breathe"});
const scene=(key,label)=>{const view=DAY9_PRESENTATION_SCENES[key];return [{type:"transition",style:view.transition,label,backgroundId:view.backgroundId,characterId:view.characterId,characterAssetUrl:view.characterId==="girlfriend"?STORY_OUTFIT_ASSETS.day8:undefined,expressionId:view.expressionId,poseId:view.poseId,bgmId:view.bgm.category},{type:"sfx",sfxId:view.sfx[0]}].filter(step=>step.type!=="sfx"||step.sfxId);};

export const LOCKED_DAY9_SCENE_ID=ID;
export const DAY9_SCOPE_CHOICES=Object.freeze([
  {id:"office9_scope_current_queue",label:"현재 업무의 담당·마감·막힌 지점만 지도처럼 정리한다"},
  {id:"office9_scope_shadow_handoff",label:"실제 인수인계 한 건을 옆에서 보고 질문만 기록한다"},
  {id:"office9_scope_compare_decisions",label:"현재 수치와 과거 실패 가설의 달라진 전제만 찾는다"}
]);
export const DAY9_PRESSURE_CHOICES=Object.freeze([
  {id:"office9_pressure_route_questions",label:"목적·근거·위험을 질문 목록으로 만들어 현재 책임자에게 넘긴다"},
  {id:"office9_pressure_observe_annotate",label:"책임자가 돌아올 때까지 참관하고 빠진 조건만 표시한다"},
  {id:"office9_pressure_reversible_task",label:"배포와 무관한 출처 확인만 맡고 결정은 책임자에게 남긴다"}
]);
export const DAY9_DEBRIEF_CHOICES=Object.freeze([
  {id:"office9_debrief_name_limits",label:"막힌 지점과 불편했던 순간을 먼저 공개하고 제한을 조정한다"},
  {id:"office9_debrief_write_protocol",label:"책임 분리 절차와 다음 3시간 블록의 평가 기준을 문서화한다"},
  {id:"office9_debrief_targeted_feedback",label:"서진에게 업무 판단 하나, 민호에게 상호작용 하나만 묻는다"}
]);

function day5ReturnCallback(state){
  const id=state.storyFlags?.day5ReturnStrategy;
  if(id==="request-current-briefing")return [n("DAY 5에 고른 현재 사실 우선 원칙에 따라 파란 파일만 오늘 테이블에 놓였다."),d("윤서진","과거 결론은 계속 닫아 둘게요. 오늘 숫자의 출처부터.","calm")];
  if(id==="rebuild-social-context")return [n("업무표 옆에는 현재 담당자와 부재 시 인계 순서가 먼저 적혀 있었다."),d("민호","사람부터 다시 배우기로 했으니 담당자 바뀐 것부터 업데이트할게.","smile")];
  return [n("DAY 5에 합의한 두 시간 제한과 중단 조건이 출입 승인서 첫 줄에 다시 표시돼 있었다."),d("팀장","오늘도 범위는 자동으로 늘어나지 않습니다.","calm")];
}
function day8Callback(state){
  const id=state.storyFlags?.day8ShareStrategy;
  if(id==="errand8_sort_receipt_together")return [d("하은","오늘도 끝나면 결과물부터 같이 분류하자. 다 설명할 필요는 없어.","smile")];
  if(id==="errand8_explain_decision_log")return [d("하은","관찰, 가능성, 확인, 선택. 어제 설명한 순서 그대로 가져가.","smile")];
  return [d("하은","연락은 중단 조건이나 귀가 시각이 바뀔 때만. 나도 그전엔 기다릴게.","calm")];
}
function scopeReaction(id){
  if(id==="office9_scope_shadow_handoff")return [d("나","민호 씨와 서진 씨의 실제 인수인계 한 건을 보고 질문만 기록하겠습니다."),d("팀장","관찰 중에는 결정과 승인을 요구하지 않겠습니다."),n("친분이나 과거 직급 대신 현재 일이 누구에게 어떻게 넘어가는지가 남았다.")];
  if(id==="office9_scope_compare_decisions")return [d("나","현재 수치와 과거 실패 가설 하나를 나란히 두고 달라진 전제만 찾겠습니다."),d("윤서진","과거 결론은 닫은 채 기준일과 자료 주인만 비교하죠.","calm"),n("답을 재현하는 대신 판단 조건의 변화를 확인했다.")];
  return [d("나","현재 진행 중인 업무의 담당, 마감, 막힌 지점만 지도처럼 정리하겠습니다."),d("팀장","결론과 평가는 하지 않고 현재 책임선까지만 봅니다."),n("할 수 있는 것과 아직 하지 않을 것이 같은 문서에 적혔다.")];
}
function pressureReaction(id){
  if(id==="office9_pressure_observe_annotate")return [d("나","책임자가 돌아올 때까지 회의를 참관하고 빠진 조건만 표시하겠습니다."),d("윤서진","급함은 무시하지 않되 결정권도 가져오지 않는 방식이네요.","smile"),n("주석에는 승인 대신 확인할 조건만 남았다.")];
  if(id==="office9_pressure_reversible_task")return [d("나","배포와 무관한 출처 확인 한 건만 맡겠습니다. 문구 결정은 현재 책임자에게 남기죠."),d("팀장","되돌릴 수 있는 기여와 승인 권한을 분리한 것으로 기록합니다."),n("도움을 주되 결과 책임을 가로채지 않았다.")];
  return [d("나","문구의 목적, 근거, 위험을 질문 목록으로 정리해 현재 책임자에게 넘기겠습니다."),d("윤서진","즉답 대신 판단 재료를 만드는 쪽이군요.","calm"),n("급한 질문은 책임자를 더 빨리 찾기 위한 목록으로 바뀌었다.")];
}
function debriefReaction(id){
  if(id==="office9_debrief_write_protocol")return [d("나","오늘의 책임 분리 절차와 다음 세 시간 블록의 평가 기준을 문서로 남기겠습니다."),d("윤서진","사람에 대한 감상은 빼고 재현 가능한 기준만 적을게요.","calm"),n("업무 가능성의 평가는 관계 감정과 분리돼 저장됐다.")];
  if(id==="office9_debrief_targeted_feedback")return [d("나","서진 씨에게는 업무 판단 하나, 민호 씨에게는 팀 상호작용 하나만 묻겠습니다."),d("윤서진","평가자를 나누면 한 문장을 전체 평판으로 착각하지 않겠네요.","smile"),n("업무와 관계의 피드백이 서로 다른 칸에 들어갔다.")];
  return [d("나","막힌 지점과 불편했던 순간부터 말하고 다음 제한을 조정하겠습니다."),d("윤서진","취약함을 업무 평가로 바꾸지 않을게요. 상태 얘기부터.","calm"),n("개인 상태를 공개한 선택은 업무 가능성 점수로 환산되지 않았다.")];
}

function segment0(state){return [
  ...scene("S01_HOME_BRIEF","DAY 9 · 두 번째 출근, 현재의 방식"),enter("girlfriend","smile"),
  n("식탁에는 출입증, 물, 약, DAY 5 복귀 합의서와 어제의 혼자 외출 기록이 놓여 있었다. 종이 첫 줄에는 90분, 승인 없음, 중단 시 보고가 적혀 있었다."),
  d("하은","도시락은 가볍게 승인받았고, 응원은 무게 측정 불가라서 몰래 넣었어.","smile"),d("나","응원 때문에 가방이 무거우면 반납할게."),
  ...day8Callback(state),d("나","오늘 목표는 잘하는 걸 증명하는 게 아니라 합의한 범위가 실제로 작동하는지 확인하는 것."),
  d("하은","회사에서 널 아는 사람들이 많아도 오늘 결정권은 네 거야.","calm"),
  ...scene("S02_OFFICE_REENTRY","SCENE 02 · 익숙함보다 출입 범위"),enter("office-best-male","smile"),
  d("민호","두 번째 방문자님. 오늘도 안기 금지, 연장 금지, 예전처럼 해 보라는 말 금지.","smile"),d("나","금지 항목이 늘었네요."),
  d("민호","대신 물 위치랑 조용한 방은 확인해 뒀어. 현재 정보만 제공."),n("게이트는 같은 소리를 냈지만 이번에는 승인된 프로젝트룸으로 곧장 이동했다."),
  ...day5ReturnCallback(state),...scene("S03_SCOPE_CONFIRM","SCENE 03 · 자동으로 늘어나지 않는 범위"),enter("team-lead","calm"),
  d("팀장","오늘은 90분입니다. 열람, 질문, 제한 검토 중 어디에 적응 범위를 둘지 정하세요."),d("나","증상이 없더라도 범위는 자동 확대하지 않습니다."),
  d("팀장","동의합니다. 오늘의 시작 조건을 선택해 문서에 남기죠."),choice(DAY9_SCOPE_CHOICES)
];}

function segment1(state){return [
  ...scopeReaction(state.storyFlags?.day9ScopeStrategy),...scene("S04_SEOJIN_HANDOFF","SCENE 04 · 두 묶음 사이의 현재"),enter("female-coworker","smile"),
  n("프로젝트룸 테이블 양쪽에는 파란 현재 자료와 닫힌 회색 과거 자료가 떨어져 놓여 있었다."),
  d("윤서진","지난번 규칙 유지. 회색은 요청하지 않으면 열지 않아요.","calm"),d("나","오늘 자료는 누가 언제 갱신했죠?"),
  d("윤서진","어제 분석 담당이 갱신했고 팀장이 범위를 승인했어요. 제가 만든 건 비교용 질문표뿐."),
  d("나","당신의 해석과 현재 사실도 분리돼 있군요."),d("윤서진","당신이 제 말을 기억처럼 빌리지 않게 하려고요.","smile"),
  ...scene("S05_BOUNDED_REVIEW","SCENE 05 · 예전의 당신이라면"),enter("female-coworker","calm"),
  n("선택한 자료를 절반쯤 보았을 때 주니어 팀원이 오후 배포 예정 문구가 열린 태블릿을 들고 들어왔다."),
  d("주니어 팀원","죄송합니다. 예전에는 선배님이 바로 정하셨다고 해서요. 한 줄만 봐 주시면—"),
  n("화면 상단의 현재 담당자는 따로 있었고 승인란은 비어 있었다. 과거에 했다는 말은 현재 권한이 아니었다."),
  d("나","문제와 현재 책임자를 분리해서 말해 주세요. 제가 할 수 있는 범위를 확인하겠습니다."),
  d("윤서진","급한 건 사실이지만 책임까지 같이 받을 필요는 없어요. 어떻게 처리할까요?","calm"),choice(DAY9_PRESSURE_CHOICES)
];}

function segment2(state){return [
  ...pressureReaction(state.storyFlags?.day9PressureStrategy),
  ...scene("S06_FATIGUE_CHECK","SCENE 06 · 책임을 떠안지 않는 도움"),enter("team-lead","calm"),
  d("주니어 팀원","제가 급해서 역할까지 같이 들고 왔네요. 이건 담당자에게 연결하겠습니다."),
  d("나","급한 건 맞았어요. 그래서 책임자를 더 빨리 확인한 겁니다."),
  d("팀장","도움과 승인 권한을 분리한 기록은 다음 방문에도 씁시다."),
  n("종료 10분 전, 서진이 물을 건네고 상태 질문 하나와 업무 질문 하나를 서로 분리했다."),
  d("윤서진","다음 방문을 위한 피드백도 사람 얘기와 업무 얘기를 섞지 않죠. 어떤 계약으로 남길까요?","calm"),choice(DAY9_DEBRIEF_CHOICES)
];}

function segment3(state){return [
  ...debriefReaction(state.storyFlags?.day9DebriefStrategy),...scene("S07_EXIT_RECORD","SCENE 07 · 평가와 관심을 섞지 않기"),enter("office-best-male","smile"),
  n("90분 종료 알람이 울리자 미완성 메모 끝에 ‘다음 방문’을 적고 파일을 닫았다."),
  d("민호","예전의 너라면 여기서 오 분만 더 했어.","smile"),d("나","오늘의 나는 종료합니다."),
  n("임시 예비폰에는 ‘예정대로 종료’와 귀가 시각만 적었다. 하은은 위치를 묻지 않고 물을 마셨는지만 답장했다."),
  d("윤서진","다음 방문 전에 오늘 문장을 제가 완성하지 않을게요.","calm"),d("나","대신 출처가 바뀌면 표시해 주세요."),
  d("윤서진","현재의 당신과 일하는 규칙 하나 추가됐네요.","smile"),
  ...scene("S08_HOME_DEBRIEF","SCENE 08 · 돌아온 판단을 함께 정리하기"),enter("girlfriend","smile"),
  n("현관에서 하은은 가방을 받지 않고 내가 먼저 내려놓을 때까지 기다렸다."),d("하은","어서 와. 결과, 판단 순서, 그냥 쉬기 중에 뭐부터 할래?","smile"),
  d("나","물부터. 그다음 오늘 멈춘 조건과 남은 질문만 분류하자."),d("하은","좋아. 회사 이야기를 다 듣는 게 아니라 돌아온 네 상태부터.","calm"),
  n("식탁에는 완료한 사실, 미확인 질문, 다음 방문 경계 세 칸이 만들어졌다."),d("나","혼자 확인하고, 필요한 부분은 같이 비교하고, 90분에 끝냈어."),
  d("하은","어제 심부름이 오늘 출근 규칙이 됐네.","smile"),d("나","장소가 달라도 현재 정보와 중단 조건을 먼저 두는 건 같아."),
  d("하은","그러면 오늘은 기억을 찾은 날보다, 네 방식을 하나 더 만든 날이네.","smile"),
  d("나","다음은 세 시간. 중간 휴식과 승인 금지를 유지하고 동료들과 점심까지."),
  n("두 번째 직장 적응 방문은 과거의 능력을 재현하는 시험이 아니라 현재의 협업과 회복 경계를 검증한 기록으로 남았다."),
  {type:"transition",style:"fade",label:"DAY 9 END",backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];}

function addMetric(state,key,amount){if(state.scenario?.enabled&&Number.isFinite(state.scenario[key]))state.scenario[key]=Math.max(0,state.scenario[key]+amount);}
function addGameMetric(state,key,amount){if(Number.isFinite(state[key]))state[key]=Math.max(0,state[key]+amount);}
function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
function remember(state,id){state.storyFlags??={};state.storyFlags[id]=true;}
export function getLockedDay9Segment(state,stage=state.storyFlags?.day9RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay9ResumePresentation(state){const stage=state.storyFlags?.day9RuntimeStage??0;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};if(stage===1)return {backgroundId:"day9-office-project-room-day",characterId:"female-coworker",expressionId:"smile",poseId:"standing"};if(stage===2)return {backgroundId:"day9-office-project-room-day",characterId:"team-lead",expressionId:"calm",poseId:"standing"};return {backgroundId:"office-day",characterId:"office-best-male",expressionId:"smile",poseId:"standing"};}
export function applyLockedDay9ChoiceState(state,id){
  state.storyFlags??={};
  if(DAY9_SCOPE_CHOICES.some(item=>item.id===id)){state.storyFlags.day9ScopeStrategy=id;state.storyFlags.day9RuntimeStage=1;remember(state,id);if(id==="office9_scope_current_queue"){state.storyFlags.current_scope_map="current_queue";addMetric(state,"investigation",2);addMetric(state,"seojinStatusInterest",1);}if(id==="office9_scope_shadow_handoff"){state.storyFlags.current_scope_map="shadow_handoff";addGameMetric(state,"social",2);addMetric(state,"coworkerRelation",2);addMetric(state,"seojinAffection",1);}if(id==="office9_scope_compare_decisions"){state.storyFlags.current_scope_map="bounded_comparison";addGameMetric(state,"stress",1);addMetric(state,"seojinStatusInterest",2);}addCollection(state,"unlockedActions","review-current-queue");return {stage:1};}
  if(DAY9_PRESSURE_CHOICES.some(item=>item.id===id)){state.storyFlags.day9PressureStrategy=id;state.storyFlags.day9RuntimeStage=2;remember(state,id);if(id==="office9_pressure_route_questions"){state.storyFlags.bounded_decision_protocol="route_questions";addGameMetric(state,"work",2);addMetric(state,"seojinStatusInterest",2);}if(id==="office9_pressure_observe_annotate"){state.storyFlags.bounded_decision_protocol="observe_annotate";addMetric(state,"coworkerRelation",2);addMetric(state,"seojinAffection",2);}if(id==="office9_pressure_reversible_task"){state.storyFlags.bounded_decision_protocol="reversible_task";addGameMetric(state,"confidence",2);addMetric(state,"seojinAffection",1);addMetric(state,"seojinStatusInterest",1);}addCollection(state,"unlockedActions","bounded-office-contribution");return {stage:2};}
  if(DAY9_DEBRIEF_CHOICES.some(item=>item.id===id)){state.storyFlags.day9DebriefStrategy=id;state.storyFlags.day9RuntimeStage=3;state.storyFlags.day9SecondOfficeAdaptationPending=false;state.storyFlags.day9SecondOfficeAdaptationCompleted=true;state.storyFlags.day10ThreeHourWorkRhythmPending=true;remember(state,id);if(id==="office9_debrief_name_limits"){state.storyFlags.office_return_debrief="named_limits";addGameMetric(state,"health",2);addMetric(state,"haeunTrust",1);addMetric(state,"seojinAffection",3);}if(id==="office9_debrief_write_protocol"){state.storyFlags.office_return_debrief="work_protocol";addGameMetric(state,"confidence",2);addMetric(state,"seojinStatusInterest",3);}if(id==="office9_debrief_targeted_feedback"){state.storyFlags.office_return_debrief="targeted_feedback";addMetric(state,"coworkerRelation",2);addMetric(state,"seojinAffection",1);addMetric(state,"seojinStatusInterest",1);}addCollection(state,"clues","second-office-adaptation-record");addCollection(state,"unlockedActions","current-coworker-lunch");addCollection(state,"followUpHooks","day10-three-hour-work-rhythm");return {stage:3};}
  return null;
}
export function getLockedDay9LegacyChoice(state){return state.storyFlags?.day9DebriefStrategy??"office9_debrief_write_protocol";}
export function validateLockedDay9Runtime(){const sample={storyFlags:{day5ReturnStrategy:"set-return-boundary",day8ShareStrategy:"errand8_explain_decision_log",day9ScopeStrategy:"office9_scope_current_queue",day9PressureStrategy:"office9_pressure_route_questions",day9DebriefStrategy:"office9_debrief_write_protocol"},scenario:{enabled:true,haeunTrust:30,seojinAffection:4,seojinStatusInterest:8,coworkerRelation:5,investigation:6,clues:[],unlockedActions:[],followUpHooks:[]}};const all=[...segment0(sample),...segment1(sample),...segment2(sample),...segment3(sample)];const text=JSON.stringify(all);return all.filter(step=>step.type==="transition").length>=8&&all.filter(step=>["dialogue","narration"].includes(step.type)).length>=55&&all.filter(step=>step.type==="choice").length===3&&!text.includes("가짜 하은")&&!text.includes("D-29")&&!text.includes("트럭 충돌")&&!text.includes("의미심장한 미소");}
