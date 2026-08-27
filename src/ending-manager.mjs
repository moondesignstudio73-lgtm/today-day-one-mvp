import { getAssetSummary } from "./economy-manager.mjs";

const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const stat = value => Math.round(number(value));
const npcById = (state,id) => (state.npcs ?? []).find(npc => npc.id === id);
const npcRelationship = npc => Math.round((number(npc?.affection) + number(npc?.trust)) / 2);
const isFreeMode = state => state.gameMode === "free-romance";
const secretChoiceCount = state => (state.temptationHistory ?? []).filter(entry => ["secret","affair"].includes(entry.choiceId)).length;
const rivalInterest = state => (state.npcs ?? []).find(npc => npc.relationshipType === "rival")?.interestInGirlfriend ?? 0;
const hasFutureTalk = state => (state.storyHistory ?? []).some(entry => entry.sceneId === "future-talk");
const futureReady = (state,minimum) => !hasFutureTalk(state) || number(state.futureScore) >= minimum;
const hiddenRouteStarted = state => state.hiddenRoute?.active === true && state.hiddenRoute?.started === true;
const yuriReunionComplete = state => state.situationEventStates?.["situation-ex-girlfriend-reunion"]?.status === "COMPLETED" || Boolean(state.storyFlags?.["situation-ex-girlfriend-reunion:COMPLETED"]);
const yuriRepeatMeetings = state => (state.worldEncounterHistory ?? []).filter(entry => entry.id === "repeat-yuri-cafe").length;
const yujinRouteComplete = state => state.yujinSecretRoute?.invitation?.status === "completed" || (state.yujinSecretRoute?.completedDays?.length ?? 0) > 0;

const CAREER_ACTION_IDS = new Set([
  "early-work","focused-work","manager-feedback","overtime","night-work","late-work","coworker-lunch",
  "self-development","skill-study","career-study","work-hard","extra-work","job-training"
]);
const careerActionCount = state => (state.actionHistory ?? []).filter(entry => {
  const id = String(entry.actionId ?? entry.id ?? "");
  return CAREER_ACTION_IDS.has(id) || id.startsWith("job-") || id.startsWith("career-") || id.includes("work");
}).length;

export const ENDING_BALANCE_THRESHOLDS = Object.freeze({
  loveAffection:830,
  loveTrust:790,
  longAffection:600,
  longTrust:600
});

const ending = ({id,title,description,narrative,currentState,reason,speaker,focusNpcId=null,matches}) => Object.freeze({
  id,title,description,narrative,currentState,reason,speaker,focusNpcId,matches
});

export const ENDING_DEFINITIONS = Object.freeze([
  ending({
    id:"yuri-reunion",title:"다시 만난 우리",
    description:"끝난 줄 알았던 유리와의 인연은 반복된 만남 끝에 새로운 관계로 이어졌다.",
    currentState:state=>{const yuri=npcById(state,"player-ex");return [`유리 호감도 ${stat(yuri?.affection)}`,`카페 재회 ${yuriRepeatMeetings(state)}회`,`첫 재회 ${yuriReunionComplete(state)?"완료":"미완료"}`];},
    reason:state=>`첫 재회를 마친 뒤 카페 모퉁이에서 ${yuriRepeatMeetings(state)}번 다시 만났고, 유리의 호감도가 ${stat(npcById(state,"player-ex")?.affection)}까지 올랐습니다.`,
    narrative:()=>[
      "처음에는 우연이라고 생각했다. 하지만 같은 카페, 비슷한 시간, 피하지 않는 눈빛이 반복되면서 두 사람은 과거를 덮는 대신 왜 헤어졌는지 처음부터 다시 이야기하기 시작했다.",
      "유리는 예전으로 돌아가자는 말 대신 지금의 서로를 다시 알아 가자고 했다. 플레이어도 그 제안을 받아들였고, 두 사람은 미련이 아니라 달라진 선택으로 관계를 다시 시작했다."
    ],speaker:()=>"유리",focusNpcId:"player-ex",
    matches:state=>isFreeMode(state)&&yuriReunionComplete(state)&&yuriRepeatMeetings(state)>=3&&number(npcById(state,"player-ex")?.affection)>=95
  }),
  ending({
    id:"yujin-secret-romance",title:"회사 밖에서 시작된 관계",
    description:"직장 동료 유진과의 비밀스러운 만남은 더 이상 동료라는 말로 숨길 수 없는 관계가 되었다.",
    currentState:state=>{const npc=npcById(state,"female-coworker");return [`유진 관계 ${npcRelationship(npc)}`,`호감 ${stat(npc?.affection)} · 신뢰 ${stat(npc?.trust)}`,`나에 대한 관심 ${stat(npc?.interestInPlayer)}`];},
    reason:state=>{const npc=npcById(state,"female-coworker");return `유진과의 관계·호감·신뢰가 모두 최고 단계에 도달했고, 문라이트 루프탑 약속까지 완료했습니다. 현재 관계 ${npcRelationship(npc)}, 호감 ${stat(npc?.affection)}, 신뢰 ${stat(npc?.trust)}입니다.`;},
    narrative:()=>[
      "늦은 업무와 짧은 메시지로 시작된 감정은 문라이트 루프탑에서 더 이상 숨길 수 없는 말이 되었다. 유진은 회사 안에서는 동료로 남더라도, 회사 밖에서는 서로를 선택하고 싶다고 말했다.",
      "두 사람의 시작은 누구에게도 가볍지 않았다. 기존 관계가 무너진 책임과 비밀의 무게를 외면할 수 없었지만, 플레이어는 이미 만들어진 선택의 결과를 받아들이며 유진과 새로운 관계를 시작했다."
    ],speaker:()=>"유진",focusNpcId:"female-coworker",
    matches:state=>{const npc=npcById(state,"female-coworker");return isFreeMode(state)&&npcRelationship(npc)>=100&&number(npc?.affection)>=100&&number(npc?.trust)>=100&&number(npc?.interestInPlayer)>=100&&yujinRouteComplete(state);}
  }),
  ending({
    id:"jaemin-gym-career",title:"새로운 커리어 파트너",
    description:"재민과 쌓은 신뢰는 운동 조언을 넘어 새로운 직업의 기회로 이어졌다.",
    currentState:state=>{const npc=npcById(state,"gym-trainer");return [`재민 관계 ${npcRelationship(npc)}`,`호감 ${stat(npc?.affection)} · 신뢰 ${stat(npc?.trust)}`,`운동 퀴즈 정답 ${stat(state.worldEncounterRoutes?.jaemin?.correctCount)}개`];},
    reason:()=>"다섯 운동 장소에서 재민과 꾸준히 교류해 관계·호감·신뢰가 모두 90 이상이 되었고, 재민의 취업 제안을 받았습니다.",
    narrative:()=>[
      "처음에는 운동 자세를 묻는 사이였다. 정답을 맞히고, 틀린 이유를 다시 배우고, 다음 만남에도 약속한 루틴을 이어 가는 모습을 보며 재민은 플레이어를 단순한 회원이 아닌 함께 일할 사람으로 보기 시작했다.",
      "30일이 끝나는 날 재민은 헬스장 운영과 회원 관리를 함께 배워 보지 않겠느냐고 제안했다. 플레이어는 익숙한 직장을 떠나 새로운 현장으로 향했고, 재민과 동료이자 커리어 파트너로 다음 달을 시작했다."
    ],speaker:()=>"재민",focusNpcId:"gym-trainer",
    matches:state=>{const npc=npcById(state,"gym-trainer");return isFreeMode(state)&&npcRelationship(npc)>=90&&number(npc?.affection)>=90&&number(npc?.trust)>=90&&state.worldEncounterRoutes?.jaemin?.helpOffered===true;}
  }),
  ending({
    id:"hidden-escape",title:"도망",
    description:"사랑을 붙드는 동안 삶 전체가 무너지고 있다는 사실을 인정하고 관계에서 빠져나왔다.",
    currentState:state=>[`스트레스 ${stat(state.stress)}`,`건강 ${stat(state.health)}`,`관계 부담 ${stat(state.hiddenRoute?.burden)}`],
    reason:()=>"히든 관계에서 떠나기를 선택했고, 스트레스·건강·관계 부담 중 하나가 위험 기준을 넘었습니다.",
    narrative:()=>[
      "좋아하는 마음이 사라져서 떠난 것은 아니었다. 모든 연락과 부탁에 답하다 보니 자기 생활과 건강을 지킬 힘이 남지 않았고, 사랑이라는 말이 계속 버텨야 할 이유가 되어 버렸다.",
      "플레이어는 마지막 메시지에 짧은 작별을 남기고 연락을 끊었다. 상실감은 컸지만, 처음으로 누구의 문제도 대신 해결하지 않는 아침을 맞으며 살아남기 위한 회복을 시작했다."
    ],speaker:()=>"플레이어",
    matches:state=>hiddenRouteStarted(state)&&state.hiddenRoute.choseLeave&&(number(state.stress)>=80||number(state.health)<=30||number(state.hiddenRoute.burden)>=700)
  }),
  ending({
    id:"hidden-mutual-life",title:"우리 둘 다 살아가는 연애",
    description:"서로를 돕되 각자의 삶까지 대신 책임지지는 않는 관계의 경계를 만들었다.",
    currentState:state=>[`변화 ${stat(state.hiddenRoute?.change)}`,`경계 ${stat(state.hiddenRoute?.boundary)}`,`안정 ${stat(state.hiddenRoute?.stability)}`],
    reason:()=>"떠나지 않은 채 변화와 경계를 충분히 높였고, 의존은 위험 수준 아래로 낮추며 관계 안정을 만들었습니다.",
    narrative:()=>[
      "두 사람은 도움과 희생을 같은 말로 사용해 왔다는 사실을 인정했다. 힘든 날에는 부탁하되 상대가 거절할 수 있게 하고, 돈과 시간의 문제는 각자가 먼저 책임진 뒤 필요한 만큼만 나누기로 했다.",
      "관계는 이전보다 화려하지 않았지만 훨씬 오래 숨을 쉴 수 있게 되었다. 사랑을 증명하기 위해 무너지지 않아도 된다는 합의가 두 사람을 비로소 같은 높이에 세웠다."
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>hiddenRouteStarted(state)&&!state.hiddenRoute.choseLeave&&number(state.hiddenRoute.change)>=500&&number(state.hiddenRoute.boundary)>=550&&number(state.hiddenRoute.dependency)<700&&number(state.hiddenRoute.stability)>=350
  }),
  ending({
    id:"hidden-dependent-love",title:"나 없으면 안 되잖아",
    description:"넘치는 호감과 반복된 대신 해결 끝에 사랑은 벗어나기 어려운 의존 관계가 되었다.",
    currentState:state=>[`의존 ${stat(state.hiddenRoute?.dependency)}`,`경계 ${stat(state.hiddenRoute?.boundary)}`,`관계 부담 ${stat(state.hiddenRoute?.burden)}`],
    reason:()=>"관계를 유지했지만 의존이 700 이상이거나 경계가 300 미만으로 남아, 서로의 문제와 책임이 분리되지 않았습니다.",
    narrative:()=>[
      "플레이어가 한 번 더 대신 해결할수록 상대는 더 자주 플레이어를 찾았다. 고맙다는 말과 미안하다는 말은 늘어났지만, 혼자 결정하고 감당하는 힘은 조금씩 줄어들었다.",
      "두 사람은 여전히 서로를 사랑한다고 말했다. 그러나 그 말 뒤에는 떠나면 상대가 무너질 것이라는 두려움이 붙어 있었고, 관계는 선택이 아니라 역할처럼 굳어졌다."
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>hiddenRouteStarted(state)&&!state.hiddenRoute.choseLeave&&(number(state.hiddenRoute.dependency)>=700||number(state.hiddenRoute.boundary)<300)
  }),
  ending({
    id:"ruined-life",title:"모든 것을 잃은 30일",
    description:"일을 외면하고 관계도 돌보지 않은 30일 끝에 직장과 연인을 모두 잃었다.",
    currentState:state=>[`업무 능력 ${stat(state.work)}`,`업무 행동 ${careerActionCount(state)}회`,`호감 ${stat(state.affection)} · 신뢰 ${stat(state.trust)}`],
    reason:state=>`업무 능력이 20 이하이고 업무 관련 행동이 ${careerActionCount(state)}회에 그쳤으며, 연인의 호감도와 신뢰도도 모두 250 미만입니다.`,
    narrative:state=>[
      "미룬 업무와 반복된 결근은 결국 인사 면담으로 돌아왔다. 회사는 더 이상 기회를 줄 수 없다고 통보했고, 책상 위의 물건은 생각보다 작은 상자 하나에 모두 들어갔다.",
      `${state.partner?.name??"연인"} 역시 오래 기다렸지만 달라지는 모습을 보지 못했다. 사랑만으로 생활과 약속을 대신할 수 없다는 말을 남기고 떠났고, 플레이어는 빈 방에서 직장도 관계도 잃은 이유를 처음부터 마주하게 되었다.`
    ],speaker:()=>"플레이어",
    matches:state=>number(state.work)<=20&&careerActionCount(state)<=3&&number(state.affection)<250&&number(state.trust)<250
  }),
  ending({
    id:"betrayal-revealed",title:"바람 발각",
    description:"숨겨 온 만남과 선택이 드러나며 두 사람의 신뢰는 돌이킬 수 없이 무너졌다.",
    currentState:state=>[`숨긴 선택 ${secretChoiceCount(state)}회`,`신뢰도 ${stat(state.trust)}`,`갈등 ${stat(state.conflict)}`],
    reason:state=>`비밀 만남 또는 바람 선택이 ${secretChoiceCount(state)}번 기록되었고, 최종 신뢰도가 400 미만입니다.`,
    narrative:state=>[
      "한 번의 거짓말은 다음 설명을 필요로 했고, 숨긴 기록들은 결국 같은 날 서로 연결되었다. 중요한 것은 누구를 만났느냐보다 사실을 알고도 계속 감추었다는 점이었다.",
      `${state.partner?.name??"연인"}은 변명을 끝까지 듣지 않았다. 플레이어가 선택하지 않은 정직의 순간들이 한꺼번에 관계를 무너뜨렸고, 두 사람은 다시 믿을 방법을 찾지 못한 채 헤어졌다.`
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>secretChoiceCount(state)>0&&number(state.trust)<400
  }),
  ending({
    id:"rival-chosen",title:"그녀의 다른 선택",
    description:"멀어진 관계 사이로 들어온 새로운 인연을 연인은 더 이상 외면하지 않았다.",
    currentState:state=>[`라이벌 관심 ${stat(rivalInterest(state))}`,`호감 ${stat(state.affection)}`,`신뢰 ${stat(state.trust)}`],
    reason:()=>"라이벌의 관심이 75 이상인 동안 연인과의 호감도와 신뢰도가 모두 500 미만으로 떨어졌습니다.",
    narrative:state=>[
      "처음에는 단순한 지인이라고 생각했다. 하지만 플레이어가 관계를 뒤로 미루는 동안 다른 사람은 연인의 말과 시간을 꾸준히 기억했고, 비교하지 않으려던 마음에도 분명한 차이가 남았다.",
      `${state.partner?.name??"연인"}은 누군가에게 빼앗긴 것이 아니라 자신이 더 이상 외면할 수 없는 방향을 선택했다고 말했다. 플레이어는 관계가 멀어지는 순간들을 뒤늦게 이해했다.`
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>number(rivalInterest(state))>=75&&number(state.affection)<500&&number(state.trust)<500
  }),
  ending({
    id:"realistic-breakup",title:"현실적인 이별",
    description:"좋아하는 마음만으로는 해결되지 않는 생활과 신뢰의 차이를 인정하고 헤어졌다.",
    currentState:state=>[`호감 ${stat(state.affection)}`,`신뢰 ${stat(state.trust)}`,`이별 선택 ${state.storyFlags?.choseSeparation===true?"있음":"없음"}`],
    reason:state=>state.storyFlags?.choseSeparation===true?"미래에 관한 대화에서 이별을 직접 선택했습니다.":`호감도 ${stat(state.affection)}, 신뢰도 ${stat(state.trust)}로 관계 유지 기준을 충족하지 못했습니다.`,
    narrative:state=>[
      "두 사람은 누가 더 나빴는지를 정하는 대신, 반복해서 어긋났던 생활과 약속을 하나씩 이야기했다. 좋아했던 기억은 분명했지만 같은 문제를 다시 겪지 않을 방법에는 끝내 동의하지 못했다.",
      `${state.partner?.name??"연인"}과 플레이어는 서로를 미워하기 전에 관계를 끝내기로 했다. 마지막 인사는 차분했지만, 현실을 인정한 결정이어서 오랫동안 마음에 남았다.`
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>state.storyFlags?.choseSeparation===true||number(state.affection)<350||number(state.trust)<250
  }),
  ending({
    id:"happy-marriage",title:"행복한 결혼",
    description:"충분한 애정과 신뢰, 미래에 대한 합의를 쌓은 두 사람은 평생을 약속했다.",
    currentState:state=>[`호감 ${stat(state.affection)}`,`신뢰 ${stat(state.trust)}`,`갈등 ${stat(state.conflict)} · 미래 점수 ${stat(state.futureScore)}`],
    reason:()=>"호감도 830 이상, 신뢰도 790 이상, 갈등 45 미만을 유지했고 미래 계획도 함께할 준비가 되었습니다.",
    narrative:state=>[
      "결혼은 30일 동안 갑자기 생긴 결론이 아니었다. 연락이 어긋난 날 다시 대화하고, 서로의 일과 친구를 존중하며, 미래의 생활 방식까지 현실적으로 나눈 시간이 약속의 근거가 되었다.",
      `${state.partner?.name??"연인"}과 플레이어는 완벽해서가 아니라 문제가 생겨도 함께 풀 수 있다는 확신으로 결혼을 선택했다. 두 사람은 거창한 끝이 아니라 같은 집에서 이어질 평범한 아침을 기대했다.`
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>number(state.affection)>=ENDING_BALANCE_THRESHOLDS.loveAffection&&number(state.trust)>=ENDING_BALANCE_THRESHOLDS.loveTrust&&number(state.conflict)<45&&futureReady(state,8)
  }),
  ending({
    id:"marriage-postponed",title:"결혼 연기",
    description:"사랑은 충분하지만 준비되지 않은 약속을 서두르지 않고 각자의 성장을 기다리기로 했다.",
    currentState:state=>[`호감 ${stat(state.affection)} · 신뢰 ${stat(state.trust)}`,`결혼 의향 ${stat(state.partner?.personality?.marriageDesire)}`,`미래 점수 ${stat(state.futureScore)}`],
    reason:()=>"관계는 안정적이지만 결혼 의향이 낮거나 미래 대화의 준비 점수가 8 미만이라 결혼을 미루었습니다.",
    narrative:state=>[
      "두 사람은 결혼 이야기를 피하지 않았지만, 날짜를 정하는 일이 불안을 덮는 방법이 되어서는 안 된다는 데 동의했다. 일과 주거, 가족에게 전할 시점처럼 아직 정리하지 못한 현실도 솔직히 남겨 두었다.",
      `${state.partner?.name??"연인"}과 플레이어는 헤어지는 대신 준비할 시간을 선택했다. 약속을 미룬 것은 마음이 부족해서가 아니라, 약속 이후의 생활까지 책임지고 싶었기 때문이다.`
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>number(state.affection)>=550&&number(state.trust)>=550&&(number(state.partner?.personality?.marriageDesire)<45||(hasFutureTalk(state)&&!futureReady(state,8)))
  }),
  ending({
    id:"long-romance",title:"장기 연애",
    description:"서두르지 않아도 괜찮다는 확신 속에서 두 사람은 익숙하고 단단한 사랑을 이어 갔다.",
    currentState:state=>[`호감 ${stat(state.affection)}`,`신뢰 ${stat(state.trust)}`,`함께한 이벤트 ${(state.eventHistory??[]).length}개`],
    reason:()=>"호감도와 신뢰도가 모두 600 이상으로 안정적이지만 결혼 엔딩의 미래 조건에는 아직 도달하지 않았습니다.",
    narrative:state=>[
      "두 사람에게 지금 필요한 것은 관계의 이름을 바꾸는 일이 아니었다. 바쁜 날의 연락 방식과 쉬는 날의 약속이 자연스러워졌고, 서로의 생활 안에 무리 없이 자리를 잡았다.",
      `${state.partner?.name??"연인"}과 플레이어는 서두르지 않기로 했다. 결혼을 미룬 것도 이별을 고민한 것도 아닌 채, 다음 계절에도 함께할 가능성이 당연한 장기 연애를 이어 갔다.`
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>number(state.affection)>=ENDING_BALANCE_THRESHOLDS.longAffection&&number(state.trust)>=ENDING_BALANCE_THRESHOLDS.longTrust
  }),
  ending({
    id:"ennui",title:"권태기",
    description:"헤어질 이유도 붙잡을 확신도 없는 채, 두 사람은 익숙함 속에서 관계를 다시 바라보게 됐다.",
    currentState:state=>[`갈등 ${stat(state.conflict)}`,`관계 스트레스 ${stat(state.relationshipStress)}`,`호감 ${stat(state.affection)} · 신뢰 ${stat(state.trust)}`],
    reason:()=>"갈등이 55 이상이거나 관계 스트레스가 65 이상으로 누적되어 관계의 피로가 회복되지 않았습니다.",
    narrative:state=>[
      "대화가 크게 싸움으로 번지지는 않았지만, 같은 질문과 같은 대답이 반복되었다. 연락도 만남도 습관처럼 이어졌고, 서로를 보고 싶은 마음보다 약속을 지켜야 한다는 생각이 먼저 들기 시작했다.",
      `${state.partner?.name??"연인"}과 플레이어는 당장 헤어지지 않았다. 대신 지금의 관계를 그대로 두면 결국 아무 감정도 남지 않을 수 있다는 사실을 인정하고, 거리와 시간을 다시 조정하기로 했다.`
    ],speaker:state=>state.partner?.name??"연인",
    matches:state=>number(state.conflict)>=55||number(state.relationshipStress)>=65
  }),
  ending({
    id:"new-beginning",title:"새로운 시작",
    description:"뚜렷한 결론에 도달하지 못한 30일은 실패가 아니라 자신의 삶을 다시 고르는 출발점이 됐다.",
    currentState:state=>[`직업 Lv.${stat(state.jobLevel)}`,`호감 ${stat(state.affection)} · 신뢰 ${stat(state.trust)}`,`총 선택 ${(state.choices??[]).length}회`],
    reason:()=>"특별 인물·히든 관계·이별·결혼·장기 연애·권태기 엔딩의 확정 조건에 해당하지 않아 기본 엔딩이 선택되었습니다.",
    narrative:()=>[
      "30일 동안 모든 문제가 해결되지는 않았다. 관계는 아직 이름을 정하기 어려웠고, 일과 생활에도 남은 숙제가 있었지만 플레이어는 어떤 선택이 자신을 지치게 하고 무엇을 지키고 싶은지 알게 되었다.",
      "끝이라고 부를 만한 장면 대신 다음 달의 첫날이 찾아왔다. 플레이어는 이전과 같은 아침을 맞았지만, 이번에는 남의 기대가 아니라 자신의 기준으로 하루를 시작했다."
    ],speaker:()=>"플레이어",matches:()=>true
  })
]);

const endingPlan=(category,conditionLabel,relatedEventIds=[],systemEvents=[])=>Object.freeze({category,conditionLabel,relatedEventIds:Object.freeze(relatedEventIds),systemEvents:Object.freeze(systemEvents)});

export const ENDING_TOOL_PLANS = Object.freeze({
  "yuri-reunion":endingPlan("특별 인물","자유모드 · 유리 첫 재회 완료 + 카페 모퉁이 반복 만남 3회 이상 + 유리 호감도 95 이상",["situation-ex-girlfriend-reunion"],["카페 모퉁이 · 유리 반복 조우"]),
  "yujin-secret-romance":endingPlan("특별 인물","자유모드 · 유진 관계·호감·신뢰·나에 대한 관심 모두 100 + 문라이트 루프탑 약속 완료",["situation-coworker-private-drink","situation-second-secret-meeting","situation-caught-with-coworker"],["유진 메시지","문라이트 루프탑"]),
  "jaemin-gym-career":endingPlan("특별 인물","자유모드 · 재민 관계·호감·신뢰 모두 90 이상 + 운동 도움 제안 완료",[],["재민 운동 퀴즈","헬스장 취업 제안"]),
  "hidden-escape":endingPlan("히든 루트","히든 루트 시작 + 떠나기 선택 + 스트레스 80 이상 / 건강 30 이하 / 부담 700 이상 중 하나",[],["히든 루트 시작","떠나기 선택","생활 붕괴 판정"]),
  "hidden-mutual-life":endingPlan("히든 루트","떠나지 않음 + 변화 500 이상 + 경계 550 이상 + 의존 700 미만 + 안정 350 이상",[],["히든 루트 상호 회복","생활 경계 합의"]),
  "hidden-dependent-love":endingPlan("히든 루트","떠나지 않음 + 의존 700 이상 또는 경계 300 미만",[],["히든 루트 대신 해결","의존 관계 누적"]),
  "ruined-life":endingPlan("관계·직장 파국","업무 능력 20 이하 + 업무 행동 3회 이하 + 호감·신뢰 모두 250 미만",[],["DAY 30 직장 평가","연인 관계 결산"]),
  "betrayal-revealed":endingPlan("관계 파국","비밀 만남 또는 바람 선택 1회 이상 + 신뢰도 400 미만",["situation-coworker-private-drink","situation-second-secret-meeting","situation-phone-notification-seen","situation-caught-with-coworker"],["유혹 행동 · 비밀 선택"]),
  "rival-chosen":endingPlan("관계 파국","라이벌의 여자친구 관심 75 이상 + 호감도·신뢰도 모두 500 미만",["situation-girlfriend-with-stranger","situation-her-ex-returns","situation-minho-reports-minjun-date-invitation"],["라이벌 압박 누적"]),
  "realistic-breakup":endingPlan("관계 파국","이별 선택 또는 호감도 350 미만 또는 신뢰도 250 미만",["situation-future-night-talk","situation-travel-big-fight"],["이별 선택","관계 수치 하락"]),
  "happy-marriage":endingPlan("결혼","호감도 830 이상 + 신뢰도 790 이상 + 갈등 45 미만 + 미래 대화 미발생 또는 미래 점수 8 이상",["situation-future-night-talk","situation-first-trip","situation-parents-first-story"],["관계 수치 결산","미래 점수"]),
  "marriage-postponed":endingPlan("연애 지속","호감도·신뢰도 550 이상 + 결혼 의향 45 미만 또는 미래 대화 후 미래 점수 8 미만",["situation-future-night-talk","situation-promotion-relocation"],["여자친구 결혼 의향","미래 점수"]),
  "long-romance":endingPlan("연애 지속","호감도·신뢰도 모두 600 이상",["situation-first-trip","situation-couple-item-shopping"],["관계 수치 결산"]),
  "ennui":endingPlan("연애 지속","갈등 55 이상 또는 관계 스트레스 65 이상",["situation-travel-big-fight","situation-friend-advice-partner-contact-drop","situation-late-night-reconciliation"],["갈등 누적","관계 스트레스"]),
  "new-beginning":endingPlan("기본","다른 엔딩이 선택되지 않았을 때 적용되는 기본 엔딩",[],["DAY 30 최종 결산"])
});

export const ENDING_VIDEO_SPEC = Object.freeze({format:"WebM",resolution:"1920×1080",duration:"8–20초",playback:"1회 재생 · 음성 및 엔딩 BGM 사용 가능",directory:"assets/endings/videos",posterDirectory:"assets/endings/posters"});

export const ENDING_IMAGE_DIRECTORY = "assets/endings/images";

export function getEndingImagePath(endingId){
  return `${ENDING_IMAGE_DIRECTORY}/${endingId}.png`;
}

export function getEndingVideoPlan(endingId){
  return Object.freeze({status:"planned",assetPath:`${ENDING_VIDEO_SPEC.directory}/${endingId}.webm`,posterPath:`${ENDING_VIDEO_SPEC.posterDirectory}/${endingId}.webp`,...ENDING_VIDEO_SPEC});
}

const resolveEndingCopy = (value,state) => typeof value === "function" ? value(state) : value;

export function getEndingResult(state,definition=selectEnding(state)){
  const currentState=resolveEndingCopy(definition.currentState,state)??[];
  const narrative=resolveEndingCopy(definition.narrative,state)??[];
  return {...definition,imagePath:getEndingImagePath(definition.id),currentState:Array.isArray(currentState)?currentState:[String(currentState)],reason:String(resolveEndingCopy(definition.reason,state)??""),narrative:Array.isArray(narrative)?narrative:[String(narrative)],speaker:String(resolveEndingCopy(definition.speaker,state)??state.partner?.name??"연인")};
}

export function getEndingToolEntries(state){
  const selectedId=selectEnding(state).id;
  return ENDING_DEFINITIONS.map((definition,index)=>{
    let eligible=false;try{eligible=Boolean(definition.matches(state));}catch{eligible=false;}
    const plan=ENDING_TOOL_PLANS[definition.id];
    return {...getEndingResult(state,definition),...plan,priority:index+1,eligible,selected:definition.id===selectedId,video:getEndingVideoPlan(definition.id)};
  });
}

export function validateEndingToolPlans(plans=ENDING_TOOL_PLANS){
  const ids=ENDING_DEFINITIONS.map(item=>item.id),videoPaths=ids.map(id=>getEndingVideoPlan(id).assetPath);
  return Object.keys(plans).length===ids.length&&ids.every(id=>{const plan=plans[id];return plan&&typeof plan.category==="string"&&typeof plan.conditionLabel==="string"&&Array.isArray(plan.relatedEventIds)&&Array.isArray(plan.systemEvents);})&&new Set(videoPaths).size===ids.length;
}

export function validateEndingDefinitions(definitions=ENDING_DEFINITIONS){
  const ids=new Set();
  return definitions.length===15&&definitions.every(item=>typeof item.id==="string"&&!ids.has(item.id)&&ids.add(item.id)&&typeof item.title==="string"&&typeof item.description==="string"&&typeof item.matches==="function"&&typeof item.currentState==="function"&&typeof item.reason==="function"&&typeof item.narrative==="function");
}

export function selectEnding(state,definitions=ENDING_DEFINITIONS){
  return definitions.find(item=>item.matches(state))??definitions.at(-1);
}

function countValues(values=[]){return values.reduce((counts,value)=>({...counts,[value]:(counts[value]??0)+1}),{});}
function getDominantChoice(counts){const entries=Object.entries(counts);if(!entries.length)return {tag:"없음",count:0};const [tag,count]=entries.sort((left,right)=>right[1]-left[1]||left[0].localeCompare(right[0],"ko"))[0];return {tag,count};}
function getRelationshipLabel(score){if(score>=800)return "서로의 확신";if(score>=650)return "단단해진 사랑";if(score>=450)return "계속 알아가는 사이";if(score>=300)return "흔들리는 관계";return "멀어진 두 사람";}

export function analyzePlayHistory(state){
  const choiceCounts=countValues(state.choices),dominantChoice=getDominantChoice(choiceCounts);
  const relationshipScore=Math.round((number(state.affection)+number(state.trust))/2),assets=getAssetSummary(state),secretChoices=secretChoiceCount(state);
  const highlights=[`${dominantChoice.tag} 선택을 ${dominantChoice.count}번 하며 가장 중요하게 여겼습니다.`,`${state.partner.name}와의 관계는 ‘${getRelationshipLabel(relationshipScore)}’로 기록됐습니다.`,`커리어 Lv.${state.jobLevel}, 총자산 ${Math.round(assets.netWorth).toLocaleString("ko-KR")}원으로 30일을 마쳤습니다.`];
  if(secretChoices>0)highlights.push(`숨긴 유혹의 선택 ${secretChoices}번이 관계의 위험으로 남았습니다.`);else if((state.temptationHistory??[]).length>0)highlights.push("유혹 앞에서 관계를 지키는 선택을 했습니다.");else highlights.push(`예상 밖의 사건 ${(state.eventHistory??[]).length}개를 지나왔습니다.`);
  if(hasFutureTalk(state))highlights.push(`미래에 대한 선택은 ${number(state.futureScore)>=8?"함께할 준비":"조금 더 필요한 준비"}로 이어졌습니다.`);
  if(hiddenRouteStarted(state))highlights.push(`히든 루트에서 경계 ${state.hiddenRoute.boundary}, 변화 ${state.hiddenRoute.change}, 의존 ${state.hiddenRoute.dependency}을 기록했습니다.`);
  return {daysPlayed:Math.min(30,Math.max(0,state.day>30?30:state.day)),totalChoices:state.choices.length,choiceCounts,dominantChoice,relationshipScore,relationshipLabel:getRelationshipLabel(relationshipScore),netWorth:assets.netWorth,careerLevel:state.jobLevel,events:(state.eventHistory??[]).length,secretChoices,highlights};
}
