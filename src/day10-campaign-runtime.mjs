import { STORY_OUTFIT_ASSETS } from "./story-outfit-assets.mjs?v=2";
import { DAY10_PRESENTATION_SCENES } from "./day10-presentation-data.mjs";

const ID="m30-day10-three-hour-work-rhythm";
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const enter=(characterId,expressionId="calm")=>({type:"characterEnter",characterId,expressionId,animationId:"idle-breathe"});
const choice=options=>({type:"choice",options});
const scene=(key,label)=>{
  const view=DAY10_PRESENTATION_SCENES[key];
  return [
    {type:"transition",style:view.transition,label,backgroundId:view.backgroundId,characterId:view.characterId,characterAssetUrl:view.characterId==="girlfriend"?STORY_OUTFIT_ASSETS.day8:undefined,expressionId:view.expressionId,poseId:view.poseId,bgmId:view.bgm.category},
    ...view.sfx.map(sfxId=>({type:"sfx",sfxId}))
  ];
};
const speakerLine=(key,characterId,speaker,text,expressionId="calm")=>{
  const view=DAY10_PRESENTATION_SCENES[key];
  return d(speaker,text,expressionId,{backgroundId:view.backgroundId,characterId,characterAssetUrl:characterId==="girlfriend"?STORY_OUTFIT_ASSETS.day8:undefined,poseId:characterId==="girlfriend"?"standing":null,bgmId:view.bgm.category});
};

export const LOCKED_DAY10_SCENE_ID=ID;
export const DAY10_RHYTHM_CHOICES=Object.freeze([
  {id:"work10_rhythm_fixed_blocks",label:"45분 업무·10분 휴식·45분 업무로 시간을 먼저 고정한다"},
  {id:"work10_rhythm_symptom_check",label:"업무 묶음마다 증상과 집중도를 확인해 다음 블록을 연다"},
  {id:"work10_rhythm_task_milestones",label:"되돌릴 수 있는 작업 세 개를 마칠 때마다 반드시 멈춘다"}
]);
export const DAY10_LUNCH_CHOICES=Object.freeze([
  {id:"work10_lunch_current_roles",label:"각자의 현재 역할과 최근 바뀐 일만 묻는다"},
  {id:"work10_lunch_one_question_each",label:"서진과 민호에게 서로 다른 질문 하나씩만 한다"},
  {id:"work10_lunch_quiet_recovery",label:"업무 대화 없이 식사와 복약 후 조용히 쉰다"}
]);
export const DAY10_DEBRIEF_CHOICES=Object.freeze([
  {id:"work10_debrief_keep_rhythm",label:"오늘의 세 시간 리듬을 다음 방문에도 그대로 유지한다"},
  {id:"work10_debrief_adjust_one_block",label:"피로가 높았던 한 블록만 줄이고 나머지는 유지한다"},
  {id:"work10_debrief_separate_scores",label:"업무 결과·회복 상태·동료 관계를 서로 다른 점수로 남긴다"}
]);

function day9Callbacks(state){
  const scope=state.storyFlags?.day9ScopeStrategy;
  const pressure=state.storyFlags?.day9PressureStrategy;
  const debrief=state.storyFlags?.day9DebriefStrategy;
  const lines=[];
  if(scope==="office9_scope_shadow_handoff")lines.push(d("윤서진","어제처럼 실제 인계 한 건만 보고 질문을 남겨요. 오늘은 그 기록을 첫 블록에 쓰죠.","smile"));
  else if(scope==="office9_scope_compare_decisions")lines.push(d("윤서진","어제 비교한 건 결론이 아니라 달라진 전제였죠. 오늘도 출처가 바뀐 항목만 표시해 뒀어요.","calm"));
  else if(scope==="office9_scope_current_queue")lines.push(d("윤서진","어제 만든 현재 담당·마감·막힌 지점 지도를 첫 블록 위에 올려 뒀어요.","smile"));
  else lines.push(d("윤서진","현재 담당·마감·막힌 지점부터 확인하고 첫 블록을 열어요.","calm"));
  if(pressure==="office9_pressure_observe_annotate")lines.push(d("나","책임자가 오기 전에는 빠진 조건만 주석으로 남기겠습니다."));
  else if(pressure==="office9_pressure_reversible_task")lines.push(d("나","오늘도 되돌릴 수 있는 출처 확인까지만 맡고 문구와 승인은 넘기겠습니다."));
  else if(pressure==="office9_pressure_route_questions")lines.push(d("나","목적·근거·위험을 질문으로 묶고 답과 승인은 현재 책임자에게 넘기겠습니다."));
  else lines.push(d("나","현재 책임자와 되돌릴 수 있는 기여부터 다시 확인하겠습니다."));
  if(debrief==="office9_debrief_name_limits")lines.push(n("어제 적은 막힘과 불편을 기준으로 두 번째 블록의 화면 수를 하나로 제한했다."));
  else if(debrief==="office9_debrief_targeted_feedback")lines.push(n("서진의 업무 판단 한 가지와 민호의 팀 상호작용 한 가지가 서로 다른 메모로 놓였다."));
  else if(debrief==="office9_debrief_write_protocol")lines.push(n("자료 주인 확인, 되돌릴 수 있는 기여, 책임자 승인이라는 어제의 절차가 세 시간표의 첫 줄이 됐다."));
  else lines.push(n("어제 기록의 업무·몸·사람 세 칸을 오늘의 세 시간표에도 나눠 두었다."));
  return lines;
}

function rhythmReaction(id){
  if(id==="work10_rhythm_symptom_check")return [d("나","각 묶음이 끝날 때 증상과 집중도를 확인하고 다음 블록을 열겠습니다."),speakerLine("S03_RHYTHM_CONTRACT","team-lead","팀장","상태 확인이 업무 평가로 환산되지 않도록 별도 칸에 두죠."),n("다음 일을 시작하는 권한은 시계가 아니라 현재 몸 상태에 남았다.")];
  if(id==="work10_rhythm_task_milestones")return [d("나","출처 확인, 질문 정리, 인계 메모. 되돌릴 수 있는 세 작업 뒤에는 무조건 멈추겠습니다."),speakerLine("S03_RHYTHM_CONTRACT","female-coworker","윤서진","작업이 남아 있어도 네 번째는 자동으로 시작하지 않는 거네요.","smile"),n("완료 수가 범위를 몰래 늘리지 못하도록 중단선이 먼저 적혔다.")];
  return [d("나","45분, 10분 휴식, 다시 45분. 점심 전 두 블록을 고정하겠습니다."),speakerLine("S03_RHYTHM_CONTRACT","team-lead","팀장","남는 시간은 연장이 아니라 회복과 기록에 씁니다."),n("세 시간은 빈틈없이 채울 목표가 아니라 멈출 시각이 보이는 틀이 되었다.")];
}
function lunchReaction(id){
  if(id==="work10_lunch_one_question_each")return [d("나","서진 씨에게는 현재 판단 기준 하나, 민호에게는 팀이 바뀐 점 하나만 물을게요."),speakerLine("S05_CURRENT_LUNCH","office-best-male","민호","한 사람 말로 회사 전체를 복원하지 않는 방식, 찬성.","smile"),n("두 답은 서로의 영역을 침범하지 않는 현재 정보로 남았다.")];
  if(id==="work10_lunch_quiet_recovery")return [d("나","오늘 점심은 질문 없이 먹고 약을 챙긴 뒤 쉬겠습니다."),speakerLine("S05_CURRENT_LUNCH","female-coworker","윤서진","침묵을 불편함이나 평가로 해석하지 않을게요."),n("같이 먹되 대화를 의무로 만들지 않는 것도 현재 동료 관계의 한 방식이었다.")];
  return [d("나","예전 이야기보다 지금 맡은 일과 최근 바뀐 역할만 듣겠습니다."),speakerLine("S05_CURRENT_LUNCH","female-coworker","윤서진","그럼 제 얘기는 현재 프로젝트와 오늘 인계까지만.","smile"),n("점심은 잃어버린 평판을 수집하는 자리가 아니라 현재 팀을 배우는 시간이 되었다.")];
}
function debriefReaction(id){
  if(id==="work10_debrief_adjust_one_block")return [d("나","두 번째 블록의 피로만 높았습니다. 다음에는 그 구간을 30분으로 줄이겠습니다."),d("하은","하루 전체를 실패로 만들지 않고 바꿀 한 칸만 찾은 거네.","smile"),n("조정은 후퇴가 아니라 실제 기록에 따른 다음 실험으로 저장됐다.")];
  if(id==="work10_debrief_separate_scores")return [d("나","업무 결과, 회복 상태, 동료 관계를 각각 남길게. 하나가 다른 둘을 대신하지 않게."),d("하은","잘한 일 때문에 아픈 걸 숨기거나, 피곤해서 사람 관계까지 나빴다고 하지는 않는 거지.","calm"),n("세 개의 점수는 같은 하루를 서로 다른 사실로 보존했다.")];
  return [d("나","오늘 세 시간 리듬은 작동했어. 다음 방문에도 범위를 늘리지 않고 유지할게."),d("하은","익숙해졌다는 이유로 자동 연장하지 않는 것까지 포함해서.","smile"),n("성공한 일정은 곧바로 더 큰 부담이 아니라 반복 가능한 현재 기준이 되었다.")];
}

const segment0=()=>[
  ...scene("S01_HOME_PLAN","DAY 10 · 세 시간이라는 현재"),enter("girlfriend","smile"),
  n("식탁의 일정표에는 세 시간, 중간 휴식, 승인 금지, 현재 동료와의 점심이 서로 다른 줄에 적혀 있었다."),
  d("하은","어제 90분을 해냈다고 오늘 세 시간이 쉬워지는 건 아니야. 시작 조건부터 다시 고르자.","calm"),d("나","성과보다 반복 가능한 리듬을 확인하고 올게."),
  ...scene("S02_OFFICE_ENTRY","SCENE 02 · 자동 확대 없는 출입"),enter("office-best-male","smile"),
  d("민호","세 시간 방문자님. 오늘도 과거 직급과 현재 권한은 별개입니다.","smile"),d("나","점심도 업무 연장으로 세지 않고요."),
  d("민호","복약 시간은 서진이 이미 회의실 달력에서 보호해 놨어."),n("프로젝트룸에는 닫힌 과거 자료 대신 현재 업무 묶음 세 개와 휴식 타이머가 놓여 있었다."),
  ...scene("S03_RHYTHM_CONTRACT","SCENE 03 · 오늘의 리듬 계약"),enter("team-lead"),
  d("팀장","세 시간을 어떻게 나눌지 선택하세요. 선택한 리듬보다 일을 더 주지는 않겠습니다."),d("나","끝낸 양이 아니라 중단 기준을 지켰는지도 함께 기록해 주세요."),choice(DAY10_RHYTHM_CHOICES)
];
const segment1=state=>[
  ...rhythmReaction(state.storyFlags?.day10RhythmStrategy),...scene("S04_CURRENT_CONTRIBUTION","SCENE 04 · 되돌릴 수 있는 기여"),enter("female-coworker","smile"),
  n("서진은 현재 수치의 출처 확인과 질문표 정리를 분리해 놓고 승인란은 팀장 이름으로 남겼다."),...day9Callbacks(state),
  d("윤서진","답을 알아도 승인하지 않기. 세 시간이 길어져도 그 선은 같아요.","calm"),d("나","결론은 현재 담당자에게 넘길게요."),d("윤서진","기억보다 절차가 먼저 돌아오고 있네요.","smile"),
  ...scene("S05_CURRENT_LUNCH","SCENE 05 · 현재 동료와의 점심"),enter("office-best-male","smile"),
  n("점심 자리는 과거의 나를 증언하는 인터뷰가 되지 않도록 종료 시각과 질문 범위를 먼저 정했다."),d("민호","예전 무용담 금지. 서진 평가 떠보기 금지. 지금 궁금한 건 직접 묻기."),
  speakerLine("S05_CURRENT_LUNCH","female-coworker","윤서진","그리고 조용히 먹고 싶으면 그것도 현재 정보로 말하기."),d("나","좋아요. 오늘 점심 방식을 정하죠."),choice(DAY10_LUNCH_CHOICES)
];
const segment2=state=>[
  ...lunchReaction(state.storyFlags?.day10LunchStrategy),...scene("S06_FINAL_BLOCK","SCENE 06 · 마지막 블록"),enter("female-coworker"),
  n("점심 뒤 마지막 블록에서는 오전 질문표 한 장만 현재 담당자에게 인계했다."),d("윤서진","추가 자료를 열지 않아도 오늘 범위는 완료됐어요."),
  d("나","완료감 때문에 남은 시간을 채우지는 않겠습니다."),speakerLine("S06_FINAL_BLOCK","team-lead","팀장","세 시간 종료. 상태와 업무 결과는 따로 평가합니다."),
  ...scene("S07_THREE_COLUMN_DEBRIEF","SCENE 07 · 귀가 전 세 칸"),enter("office-best-male","smile"),
  d("민호","오늘 기록은 일, 몸, 사람. 셋 중 하나가 좋다고 나머지까지 좋았던 척하지 않기."),d("나","집에 가서 같은 세 칸으로 정리할게."),
  n("예비폰에는 예정 종료와 귀가 시각만 남기고, 하은에게 평가를 대신해 달라는 문장은 쓰지 않았다."),choice(DAY10_DEBRIEF_CHOICES)
];
const segment3=state=>[
  ...debriefReaction(state.storyFlags?.day10DebriefStrategy),...scene("S08_HOME_RETURN","SCENE 08 · 세 시간을 하루로 돌려놓기"),enter("girlfriend","smile"),
  n("하은은 현관에서 업무 결과보다 물과 약, 현재 피로부터 확인했다."),d("하은","회사에서 잘했는지는 네 기록을 보고, 지금 괜찮은지는 네 말을 들을게.","calm"),
  d("나","세 시간은 지켰고, 점심도 과거 확인 자리가 되지 않았어."),d("하은","그럼 오늘은 직장에 돌아간 날이 아니라 일과 생활을 같은 하루에 둔 첫날이네.","smile"),
  n("식탁의 세 칸 기록에는 업무 결과와 회복 상태, 현재 동료 관계가 서로를 덮지 않은 채 남았다."),
  {type:"transition",style:"fade",label:"DAY 10 END",backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing",bgmId:"daily"},{type:"sceneEnd"}
];

function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
export function getLockedDay10Segment(state,stage=state.storyFlags?.day10RuntimeStage??0){if(stage===0)return segment0(state);if(stage===1)return segment1(state);if(stage===2)return segment2(state);return segment3(state);}
export function getLockedDay10ResumePresentation(state){const stage=state.storyFlags?.day10RuntimeStage??0;if(stage===0)return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};if(stage===1)return {backgroundId:"day9-office-project-room-day",characterId:state.storyFlags?.day10RhythmStrategy==="work10_rhythm_task_milestones"?"female-coworker":"team-lead",expressionId:"smile",poseId:null};if(stage===2)return {backgroundId:"neighborhood-cafe-day",characterId:state.storyFlags?.day10LunchStrategy==="work10_lunch_one_question_each"?"office-best-male":"female-coworker",expressionId:"smile",poseId:null};return {backgroundId:"home-morning",characterId:"girlfriend",characterAssetUrl:STORY_OUTFIT_ASSETS.day8,expressionId:"smile",poseId:"standing"};}
export function applyLockedDay10ChoiceState(state,id){
  state.storyFlags??={};
  if(DAY10_RHYTHM_CHOICES.some(item=>item.id===id)){state.storyFlags.day10RhythmStrategy=id;state.storyFlags.day10RuntimeStage=1;state.storyFlags[id]=true;addCollection(state,"unlockedActions","three-hour-work-rhythm");return {stage:1};}
  if(DAY10_LUNCH_CHOICES.some(item=>item.id===id)){state.storyFlags.day10LunchStrategy=id;state.storyFlags.day10RuntimeStage=2;state.storyFlags[id]=true;addCollection(state,"unlockedActions","current-coworker-lunch-record");return {stage:2};}
  if(DAY10_DEBRIEF_CHOICES.some(item=>item.id===id)){state.storyFlags.day10DebriefStrategy=id;state.storyFlags.day10RuntimeStage=3;state.storyFlags.day10ThreeHourWorkRhythmPending=false;state.storyFlags.day10ThreeHourWorkRhythmCompleted=true;state.storyFlags.day11CurrentLifePlanPending=true;state.storyFlags[id]=true;addCollection(state,"clues","three-hour-work-rhythm-record");addCollection(state,"unlockedActions","separate-work-recovery-social");addCollection(state,"followUpHooks","day11-current-life-plan");return {stage:3};}
  return null;
}
export function getLockedDay10LegacyChoice(state){return state.storyFlags?.day10DebriefStrategy??"work10_debrief_separate_scores";}
export function validateLockedDay10Runtime(){const state={storyFlags:{day10RhythmStrategy:"work10_rhythm_fixed_blocks",day10LunchStrategy:"work10_lunch_current_roles",day10DebriefStrategy:"work10_debrief_separate_scores"}};const all=[...segment0(state),...segment1(state),...segment2(state),...segment3(state)];return all.filter(step=>step.type==="transition").length>=8&&all.filter(step=>step.type==="choice").length===3&&all.at(-1)?.type==="sceneEnd";}
