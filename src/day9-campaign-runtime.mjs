import {DAY9_PRESENTATION_SCENES} from "./day9-presentation-data.mjs";

const ID="m30-day9-second-office-adaptation";
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,characterId,backgroundId="office-day",extra={})=>({type:"dialogue",speaker,text,backgroundId,characterId,expressionId:characterId==="girlfriend"?"smile":null,poseId:characterId==="girlfriend"?"standing":null,...extra});
const choice=options=>({type:"choice",options});
const scene=(key,label)=>{const view=DAY9_PRESENTATION_SCENES[key];return [{type:"transition",style:view.transition,label,backgroundId:view.backgroundId,characterId:view.characterId,expressionId:view.expressionId,poseId:view.poseId,bgmId:view.bgm.category},{type:"sfx",sfxId:view.sfx[0]}].filter(step=>step.type!=="sfx"||step.sfxId);};

export const LOCKED_DAY9_SCENE_ID=ID;
export const DAY9_SCOPE_CHOICES=Object.freeze([
  {id:"office9_scope_current_queue",label:"현재 진행 업무의 담당·마감·막힌 지점만 지도처럼 정리한다"},
  {id:"office9_scope_shadow_handoff",label:"민호와 서진의 실제 인수인계 한 건을 보고 질문만 기록한다"},
  {id:"office9_scope_compare_decisions",label:"현재 수치와 과거 실패 가설의 달라진 전제만 비교한다"}
]);
export const DAY9_PRESSURE_CHOICES=Object.freeze([
  {id:"office9_pressure_route_questions",label:"목적·근거·위험을 질문 목록으로 만들어 현재 책임자에게 넘긴다"},
  {id:"office9_pressure_observe_annotate",label:"책임자가 돌아올 때까지 참관하며 빠진 조건만 표시한다"},
  {id:"office9_pressure_reversible_task",label:"배포와 무관한 출처 확인만 맡고 문구 결정은 책임자에게 남긴다"}
]);
export const DAY9_DEBRIEF_CHOICES=Object.freeze([
  {id:"office9_debrief_name_limits",label:"막힌 지점과 불편했던 순간을 먼저 공개해 다음 제한을 조정한다"},
  {id:"office9_debrief_write_protocol",label:"책임 분리 절차와 다음 3시간 블록의 평가 기준을 문서화한다"},
  {id:"office9_debrief_targeted_feedback",label:"서진에게 업무 판단 하나, 민호에게 팀 상호작용 하나만 묻는다"}
]);

function day8Callbacks(state){
  const check=state.storyFlags?.day8CheckInStrategy;
  const purchase=state.storyFlags?.day8PurchaseStrategy;
  const share=state.storyFlags?.day8ShareStrategy;
  const lines=[];
  if(check==="errand8_change_only_checkin")lines.push(d("하은","경로·몸 상태·끝나는 시각이 바뀔 때만 연락. 오늘도 내가 먼저 위치 묻지 않기.","girlfriend","home-morning"));
  else if(check==="errand8_timed_checkin")lines.push(d("하은","도착하고 나올 때 상태와 다음 행동 한 줄. 그 사이에는 재촉 안 하기.","girlfriend","home-morning"));
  else lines.push(d("하은","예정 시각을 넘길 때만 연락. 그전에는 계획대로 움직이는 걸로.","girlfriend","home-morning"));
  if(purchase==="errand8_compare_labels")lines.push(n("어제 표시를 대조했던 순서대로 물병·약·출입증을 직접 확인했다."));
  else if(purchase==="errand8_ask_current_need")lines.push(d("나","오늘 필요한 건 90분 방문에 쓸 물건뿐이야. 가방 구성은 내가 정할게.","girlfriend","home-morning"));
  else lines.push(n("오늘도 90분만 시험하고, 다음 방문 확대는 귀가 뒤 판단하기로 했다."));
  if(share==="errand8_sort_receipt_together")lines.push(n("종이에는 완료·보류·같이 확인할 일의 세 칸이 남아 있었다."));
  else if(share==="errand8_explain_decision_log")lines.push(n("빈칸의 순서는 관찰·가능성·확인·선택이었다."));
  else lines.push(n("혼자 결정·승인 필요·즉시 중단의 세 경계를 문서 위에 다시 적었다."));
  return lines;
}

function day5ReturnCallback(state){
  const id=state.storyFlags?.day5ReturnStrategy;
  if(id==="request-current-briefing")return [d("윤서진","지난번처럼 현재 파일부터 열게요. 담당, 마감, 책임자 순서예요.","female-coworker")];
  if(id==="rebuild-social-context")return [d("윤서진","사람 이름 옆에 지금 맡은 일과 질문 가능한 시간을 붙였어요. 관계도 현재형으로 보죠.","female-coworker")];
  return [d("윤서진","15분마다 상태 확인, 90분에 종료, 승인 업무는 금지. 전에 합의한 경계를 문서 위에 고정했어요.","female-coworker")];
}

function day5SeojinCallback(state){
  const id=state.storyFlags?.day5SeojinStrategy;
  if(id==="seojin_role_history")return [d("윤서진","지난번엔 역할 변화를 먼저 물었죠. 오늘은 과거 역할이 아니라 현재 책임선만 답할게요.","female-coworker")];
  if(id==="seojin_current_intent")return [d("윤서진","제가 지금 무엇을 기대하는지 물었었죠. 오늘은 답을 대신하지 않고 확인 순서를 볼게요.","female-coworker")];
  return [d("윤서진","사람 얘기와 업무 얘기를 분리하기로 했죠. 오늘도 질문부터 나눌게요.","female-coworker")];
}

function scopeReaction(id){
  if(id==="office9_scope_current_queue")return [d("나","현재 담당·마감·막힌 지점만 정리하겠습니다. 결론은 내리지 않아요.","female-coworker"),d("윤서진","좋아요. 넓게 보되 판단 주인은 바꾸지 않는 방식.","female-coworker")];
  if(id==="office9_scope_shadow_handoff")return [d("나","인수인계 한 건을 옆에서 보고, 질문은 끝까지 기록만 하겠습니다.","female-coworker"),d("윤서진","그럼 제가 설명하고 민호 씨가 실제 인계를 해요. 끼어들 자리는 표시해 둘게요.","female-coworker")];
  return [d("나","현재 수치와 과거 실패 가설 하나를 나란히 놓고 달라진 전제만 찾겠습니다.","female-coworker"),d("윤서진","과거 결론을 복사하지 않는 조건이면 동의해요. 전제 출처부터 붙이죠.","female-coworker")];
}

function pressureReaction(id){
  if(id==="office9_pressure_route_questions")return [d("나","목적·근거·위험을 질문 목록으로 묶겠습니다. 답과 승인은 현재 책임자가 합니다.","office-rookie"),d("주니어","제가 급함이랑 역할을 같이 들고 왔네요. 질문 목록은 제가 연결할게요.","office-rookie")];
  if(id==="office9_pressure_observe_annotate")return [d("나","책임자가 올 때까지 회의를 듣고 빠진 조건만 표시하겠습니다. 문구는 건드리지 않아요.","office-rookie"),d("주니어","주석이면 바로 쓸 수 있어요. 결정은 담당자에게 남기겠습니다.","office-rookie")];
  return [d("나","배포와 무관한 출처 확인 한 건만 맡겠습니다. 문구와 승인은 책임자 몫입니다.","office-rookie"),d("주니어","출처만 확인해 주시면 충분해요. 승인란은 비워 둘게요.","office-rookie")];
}

function axisLine(state){
  const a=state.scenario?.seojinAffection??0,s=state.scenario?.seojinStatusInterest??0;
  if(a>=10&&s>=10)return [d("윤서진","먼저 상태. 안 괜찮은데 괜찮다고 말하는 습관까지 돌아온 건 아니죠?", "female-coworker","neighborhood-street-day"),d("윤서진","이제 업무. 권한을 거절하면서도 작업을 남긴 방식은 재현 가능해 보여요.","female-coworker","neighborhood-street-day")];
  if(a>s)return [d("윤서진","상태부터 물을게요. 피곤한데 괜찮다고 줄여 말한 건 아닌지.","female-coworker","neighborhood-street-day")];
  if(s>a)return [d("윤서진","업무부터 볼게요. 책임을 넘긴 게 아니라 책임자를 찾아 준 방식이었어요.","female-coworker","neighborhood-street-day")];
  return [d("윤서진","의료 제한과 다음 일정, 두 가지만 확인할게요.","female-coworker","neighborhood-street-day")];
}

function debriefReaction(id){
  if(id==="office9_debrief_name_limits")return [d("나","화면이 길어지면 문장 순서를 놓쳤고, 급한 부탁에서 거절이 늦었습니다.","female-coworker","neighborhood-street-day"),d("윤서진","좋아요. 다음엔 화면 하나, 요청 하나씩. 상태 질문의 답으로 남길게요.","female-coworker","neighborhood-street-day")];
  if(id==="office9_debrief_write_protocol")return [d("나","자료 주인 확인, 되돌릴 수 있는 기여 분리, 책임자 승인. 다음 3시간도 이 순서로 평가하죠.","female-coworker","neighborhood-street-day"),d("윤서진","재현 가능한 기준이네요. 업무 질문의 답으로 저장할게요.","female-coworker","neighborhood-street-day")];
  return [d("나","서진 씨는 업무 판단 하나, 민호 씨는 팀 상호작용 하나만 말해 주세요.","female-coworker","neighborhood-street-day"),d("윤서진","평가자를 분리하네요. 그럼 저는 책임선, 민호 씨는 질문 타이밍.","female-coworker","neighborhood-street-day")];
}

function segment0(state){return [
  ...scene("S01_HOME_PREP","DAY 9 · 넥타이보다 먼저 적을 것"),
  n("하은은 넥타이를 내려놓고 90분·승인 없음·중단 시 팀장에게 말하기가 적힌 종이를 밀었다."),
  d("하은","오늘도 오른쪽으로 손가락 한 마디. 다만 직접 만지는 서비스는 종료됐습니다.","girlfriend","home-morning"),d("나","위치 안내만 받겠습니다.","girlfriend","home-morning"),d("하은","고객님이 까다로워졌네. 좋은 방향으로.","girlfriend","home-morning"),
  ...day8Callbacks(state),d("하은","회사 도착했다고 말해 달라는 건 내가 정하면 안 되지?","girlfriend","home-morning"),d("나","어제 계약대로. 바뀌면 알리고, 안 바뀌면 계획대로 움직여.","girlfriend","home-morning"),d("하은","알겠어. 돌아오면 성과 말고 상태부터.","girlfriend","home-morning"),
  ...scene("S02_SOLO_COMMUTE","SCENE 02 · 혼자 가도 같은 계약"),n("지하철 입구에서 노선, 이동 시간, 현재 어지럼을 확인했다.",{backgroundId:"neighborhood-street-day",characterId:null}),n("팀장 메시지에는 09:30 시작, 11:00 종료, 승인·대외 발신 없음이 적혀 있었다.",{backgroundId:"neighborhood-street-day",characterId:null}),d("나","과거의 출근길은 기억나지 않는다. 오늘의 도착 시각과 돌아올 기준은 안다.",null,"neighborhood-street-day"),n("연락 계약에 맞춰 메시지를 보내거나 보내지 않았다. 하은은 추가 확인을 보내지 않았다.",{backgroundId:"neighborhood-street-day",characterId:null}),n("회사 건물 앞에서 숨을 고르고 회전문 옆 안내판의 층수부터 다시 읽었다.",{backgroundId:"neighborhood-street-day",characterId:null}),
  ...scene("S03_LOBBY_ORIENTATION","SCENE 03 · 아는 사람, 모르는 자리"),d("민호","하나는 네 거, 하나는 내 거. 기억 시험 아니고 사진 비교용.","office-best-male"),d("나","내 사진이 더 긴장했네요.","office-best-male"),d("민호","좋다. 농담 기능은 일부 복구.","office-best-male"),n("민호는 좌석표에 이름 대신 현재 역할을 적고 모르는 사람은 빈칸으로 뒀다.",{backgroundId:"office-day",characterId:"office-best-male"}),d("민호","네 자리는 그대로인데 업무 주인은 바뀌었어. 앉는다고 권한까지 돌아오는 건 아니고.","office-best-male"),d("나","현재 책임자부터 표시해 줘.","office-best-male"),d("민호","그 말 들으려고 빨간 펜 가져왔다.","office-best-male"),d("팀장","종료는 11시. 어지럼, 집중 저하, 책임 범위 혼동 중 하나가 오면 바로 멈춥니다.","team-lead"),d("나","승인과 대외 발신은 하지 않고, 현재 담당자와 보는 자료만 다룹니다.","team-lead"),
  ...scene("S04_SCOPE_SELECTION","SCENE 04 · 무엇을 배우고 나갈 것인가"),...day5ReturnCallback(state),...day5SeojinCallback(state),d("윤서진","현재 현황, 실제 인수인계, 과거 판단 비교. 셋 다 보면 제한을 어기는 거고 하나를 고르면 적응 방문이에요.","female-coworker"),d("나","자료 주인을 먼저 확인하죠.","female-coworker"),choice(DAY9_SCOPE_CHOICES)
];}

function segment1(state){return [
  ...scopeReaction(state.storyFlags?.day9ScopeStrategy),d("윤서진","과거보다 느린 게 아니라 비교 기준을 바꾸는 거예요. 오늘은 답의 속도보다 멈출 위치가 중요하고.","female-coworker"),n("선택한 자료의 담당·마감·책임자를 표 위에 먼저 적었다.",{backgroundId:"office-day",characterId:"female-coworker"}),
  ...scene("S05_AUTHORITY_PRESSURE","SCENE 05 · 예전의 당신이라면"),d("주니어","죄송합니다. 이 문구, 예전에는 선배님이 바로 정하셨다고 해서요. 오늘 오후 배포라 한 줄만 봐 주시면—","office-rookie"),n("문구보다 화면 상단의 담당자와 빈 승인란을 먼저 봤다.",{backgroundId:"office-day",characterId:"office-rookie"}),d("나","급한 건 사실입니다. 제가 책임자라는 근거는 없어요.","office-rookie"),n("민호는 대신 거절하려다 멈췄고 서진도 답을 주지 않았다.",{backgroundId:"office-day",characterId:"office-best-male"}),d("나","문제와 현재 책임자를 분리해서 말해 주세요. 제가 할 수 있는 범위를 확인하겠습니다.","office-rookie"),d("주니어","목적은 오늘 오후 공지, 현재 담당자는 회의 중이고 승인자는 팀장님입니다.","office-rookie"),
  ...scene("S06_BOUNDED_HELP","SCENE 06 · 책임을 떠안지 않는 도움"),d("팀장","결정권 없이도 남길 수 있는 도움이 무엇인지 고르세요. 승인란은 제가 확인합니다.","team-lead"),choice(DAY9_PRESSURE_CHOICES)
];}

function segment2(state){return [
  ...pressureReaction(state.storyFlags?.day9PressureStrategy),d("팀장","좋습니다. 도움과 승인 권한을 분리한 기록은 다음 방문에도 씁시다.","team-lead"),d("나","급한 문제일수록 책임자를 더 빨리 확인하겠습니다.","team-lead"),n("현재 책임자가 돌아와 질문 목록·주석·출처 확인 중 선택된 결과를 넘겨받았다.",{backgroundId:"office-day",characterId:"team-lead"}),
  ...scene("S07_BENCH_DEBRIEF","SCENE 07 · 평가와 관심을 섞지 않기"),n("종료 10분 전, 서진이 물 두 병을 들고 회사 앞 벤치로 나왔다.",{backgroundId:"neighborhood-street-day",characterId:"female-coworker"}),d("윤서진","상태 질문 하나, 업무 질문 하나. 순서는 고를 수 있어요.","female-coworker","neighborhood-street-day"),d("나","상태부터. 약간 피곤하지만 기준 안입니다.","female-coworker","neighborhood-street-day"),...axisLine(state),d("윤서진","다음 방문에 남길 피드백도 사람 얘기와 업무 얘기를 구분해 보죠.","female-coworker","neighborhood-street-day"),choice(DAY9_DEBRIEF_CHOICES)
];}

function segment3(state){return [
  ...debriefReaction(state.storyFlags?.day9DebriefStrategy),d("윤서진","제가 두 얘기를 섞으면 어느 쪽 답인지 다시 물어봐요.","female-coworker","neighborhood-street-day"),d("나","그 기준은 서로 적용하죠.","female-coworker","neighborhood-street-day"),d("윤서진","그럴 줄 알았어요. 그게 평가인지 감상인지는 아직 보류하고.","female-coworker","neighborhood-street-day"),
  ...scene("S08_STOP_AND_RETURN","SCENE 08 · 90분에 손을 떼는 일"),n("종료 알람이 울리자 미완성 메모 끝에 ‘다음 방문’을 적고 파일을 닫았다.",{backgroundId:"office-day",characterId:"office-best-male"}),d("민호","예전의 너라면 여기서 오 분만 했어.","office-best-male"),d("나","오늘의 나는 종료합니다.","office-best-male"),d("민호","좋네. 다음엔 기억 퀴즈 없는 현재형 점심까지.","office-best-male"),d("팀장","다음은 3시간. 중간 휴식과 승인 금지는 그대로 둡니다.","team-lead"),n("임시 예비폰에 종료 시각과 몸 상태, 다음 방문 때 할 일을 짧게 남겼다.",{backgroundId:"office-day",characterId:"team-lead"}),
  {type:"transition",style:"fade",label:"집 · 오전",backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",bgmId:"daily"},d("하은","성과 말고 상태부터.","girlfriend","home-morning"),d("나","피곤함은 기준 안. 권한 밖 질문이 왔고 책임자에게 연결했어.","girlfriend","home-morning"),d("하은","안 도망치고, 다 떠안지도 않았네.","girlfriend","home-morning"),d("나","다음은 세 시간. 중간 휴식하고 동료들과 점심까지.","girlfriend","home-morning"),d("하은","그럼 도시락은 안 싸 줄게. 점심 메뉴가 실패하면 저녁에 복구 회의.","girlfriend","home-morning"),n("익숙한 자리를 되찾은 대신 멈출 시각과 물을 사람을 정하고 돌아왔다.",{backgroundId:"home-morning",characterId:"girlfriend"}),{type:"transition",style:"fade",label:"DAY 9 END",backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];}

function addMetric(state,key,amount){if(state.scenario?.enabled&&Number.isFinite(state.scenario[key]))state.scenario[key]=Math.max(0,state.scenario[key]+amount);}
function addGameMetric(state,key,amount){if(Number.isFinite(state[key]))state[key]=Math.max(0,state[key]+amount);}
function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
function remember(state,id){state.storyFlags??={};state.storyFlags[id]=true;}

export function getLockedDay9Segment(state,stage=state.storyFlags?.day9RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay9ResumePresentation(state){const stage=state.storyFlags?.day9RuntimeStage??0;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing"};if(stage===1)return {backgroundId:"office-day",characterId:"female-coworker",expressionId:null,poseId:null};if(stage===2||stage===3)return {backgroundId:"neighborhood-street-day",characterId:"female-coworker",expressionId:null,poseId:null};return {backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing"};}

export function applyLockedDay9ChoiceState(state,id){
  state.storyFlags??={};
  if(DAY9_SCOPE_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day9ScopeStrategy=id;state.storyFlags.day9RuntimeStage=1;remember(state,id);
    state.storyFlags.current_scope_map=id==="office9_scope_current_queue"?"current_queue":id==="office9_scope_shadow_handoff"?"shadow_handoff":"bounded_comparison";
    if(id==="office9_scope_current_queue"){addGameMetric(state,"work",2);addMetric(state,"seojinStatusInterest",2);}
    if(id==="office9_scope_shadow_handoff"){addMetric(state,"coworkerRelation",2);addMetric(state,"seojinAffection",2);}
    if(id==="office9_scope_compare_decisions"){addGameMetric(state,"stress",1);addMetric(state,"seojinStatusInterest",3);}
    addCollection(state,"clues","current_scope_map");return {stage:1};
  }
  if(DAY9_PRESSURE_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day9PressureStrategy=id;state.storyFlags.day9RuntimeStage=2;remember(state,id);
    state.storyFlags.bounded_decision_protocol=id==="office9_pressure_route_questions"?"route_questions":id==="office9_pressure_observe_annotate"?"observe_annotate":"reversible_task";
    if(id==="office9_pressure_route_questions"){addGameMetric(state,"work",2);addMetric(state,"seojinStatusInterest",3);}
    if(id==="office9_pressure_observe_annotate"){addMetric(state,"coworkerRelation",2);addMetric(state,"seojinAffection",2);}
    if(id==="office9_pressure_reversible_task"){addGameMetric(state,"confidence",3);addMetric(state,"seojinAffection",1);addMetric(state,"seojinStatusInterest",1);}
    addCollection(state,"clues","bounded_decision_protocol");addCollection(state,"unlockedActions","bounded-office-contribution");return {stage:2};
  }
  if(DAY9_DEBRIEF_CHOICES.some(item=>item.id===id)){
    state.storyFlags.day9DebriefStrategy=id;state.storyFlags.day9RuntimeStage=3;remember(state,id);
    state.storyFlags.office_return_debrief=id==="office9_debrief_name_limits"?"named_limits":id==="office9_debrief_write_protocol"?"work_protocol":"targeted_feedback";
    state.storyFlags.day9SecondOfficeAdaptationPending=false;state.storyFlags.day9SecondOfficeAdaptationCompleted=true;state.storyFlags.day10ThreeHourWorkRhythmPending=true;
    if(id==="office9_debrief_name_limits")addMetric(state,"seojinAffection",3);
    if(id==="office9_debrief_write_protocol")addMetric(state,"seojinStatusInterest",3);
    if(id==="office9_debrief_targeted_feedback"){addMetric(state,"seojinAffection",1);addMetric(state,"seojinStatusInterest",1);addMetric(state,"coworkerRelation",2);}
    addCollection(state,"clues","office_return_debrief");addCollection(state,"unlockedActions","review-current-queue","current-coworker-lunch");addCollection(state,"followUpHooks","day10-three-hour-work-rhythm");return {stage:3};
  }
  return null;
}

export function getLockedDay9LegacyChoice(state){return state.storyFlags?.day9DebriefStrategy??"office9_debrief_write_protocol";}
export function validateLockedDay9Runtime(){const sample={storyFlags:{day5ReturnStrategy:"set-return-boundary",day5SeojinStrategy:"seojin_present_boundary",day8CheckInStrategy:"errand8_change_only_checkin",day8PurchaseStrategy:"errand8_compare_labels",day8ShareStrategy:"errand8_explain_decision_log",day9ScopeStrategy:"office9_scope_current_queue",day9PressureStrategy:"office9_pressure_route_questions",day9DebriefStrategy:"office9_debrief_write_protocol"},scenario:{seojinAffection:12,seojinStatusInterest:15}};const all=[...segment0(sample),...segment1(sample),...segment2(sample),...segment3(sample)];const text=JSON.stringify(all);return all.filter(step=>step.type==="transition").length>=9&&all.filter(step=>["dialogue","narration"].includes(step.type)).length>=65&&all.filter(step=>step.type==="choice").length===3&&!text.includes("가짜 하은")&&!text.includes("D-29")&&!text.includes("트럭 충돌")&&!text.includes("의미심장한 미소");}
