import { getAssetSummary } from "./economy-manager.mjs";
import { getPortfolioSummary } from "./investment-manager.mjs";

const secretChoiceCount = state => (state.temptationHistory ?? []).filter(entry => ["secret","affair"].includes(entry.choiceId)).length;
const rivalInterest = state => (state.npcs ?? []).find(npc => npc.relationshipType === "rival")?.interestInGirlfriend ?? 0;
const hasFutureTalk = state => (state.storyHistory ?? []).some(entry => entry.sceneId === "future-talk");
const futureReady = (state, minimum) => !hasFutureTalk(state) || (state.futureScore ?? 0) >= minimum;
export const ENDING_BALANCE_THRESHOLDS = Object.freeze({
  wealthyNetWorth: 3000000,
  loveAffection: 820,
  loveTrust: 780
});

export const ENDING_DEFINITIONS = [
  { id:"betrayal-revealed", title:"바람 발각", description:"숨겨 온 선택이 드러나며 두 사람의 신뢰는 돌이킬 수 없이 무너졌다.", matches:state => secretChoiceCount(state) > 0 && state.trust < 400 },
  { id:"rival-chosen", title:"그녀의 다른 선택", description:"멀어진 마음 사이로 들어온 새로운 인연을 그녀는 외면하지 않았다.", matches:state => rivalInterest(state) >= 75 && state.affection < 500 && state.trust < 500 },
  { id:"economic-breakup", title:"경제 문제 이별", description:"계속되는 생활의 압박은 사랑만으로 견디기 어려운 벽이 되었다.", matches:state => getAssetSummary(state).netWorth < 200000 && state.conflict >= 50 },
  { id:"love-breakup", title:"사랑하지만 이별", description:"좋아하는 마음은 남았지만 함께 살아갈 방법을 끝내 찾지 못했다.", matches:state => state.storyFlags?.choseSeparation === true || state.affection < 350 || state.trust < 250 },
  { id:"investment-failure", title:"투자 실패", description:"큰 손실 뒤에 남은 것은 다시 시작할 용기와 값비싼 경험이었다.", matches:state => getPortfolioSummary(state).profitLoss <= -200000 },
  { id:"lottery-reversal", title:"복권 인생 역전", description:"작은 행운을 향한 한 장의 선택이 두 사람의 내일을 완전히 바꾸었다.", matches:state => (state.lottery?.totalWon ?? 0) >= 500000 },
  { id:"investment-success", title:"투자 성공", description:"위험을 읽고 기다린 선택이 눈부신 자산과 새로운 가능성으로 돌아왔다.", matches:state => getPortfolioSummary(state).profitLoss >= 200000 },
  { id:"wealthy-marriage", title:"경제적으로 성공한 결혼", description:"사랑과 경제적 안정을 함께 쌓은 두 사람은 든든한 미래를 약속했다.", matches:state => getAssetSummary(state).netWorth >= ENDING_BALANCE_THRESHOLDS.wealthyNetWorth && state.affection >= 650 && state.trust >= 600 && futureReady(state,8) },
  { id:"happy-marriage", title:"행복한 결혼", description:"수많은 선택 끝에 서로를 가장 잘 아는 두 사람은 평생을 약속했다.", matches:state => state.affection >= 850 && state.trust >= 800 && state.conflict < 45 && futureReady(state,12) },
  { id:"love-marriage", title:"사랑으로 결혼", description:"완벽하지 않아도 서로의 편이 되어 온 시간은 한 번뿐인 약속이 되었다.", matches:state => state.affection >= ENDING_BALANCE_THRESHOLDS.loveAffection && state.trust >= ENDING_BALANCE_THRESHOLDS.loveTrust && futureReady(state,8) },
  { id:"marriage-postponed", title:"결혼 연기", description:"사랑은 충분하지만 지금은 각자의 성장을 조금 더 기다리기로 했다.", matches:state => state.affection >= 550 && state.trust >= 550 && (state.partner.personality.marriageDesire < 45 || (hasFutureTalk(state) && !futureReady(state,8))) },
  { id:"long-romance", title:"장기 연애", description:"서두르지 않아도 좋았다. 두 사람은 익숙하고 단단한 사랑을 이어 갔다.", matches:state => state.affection >= 600 && state.trust >= 600 },
  { id:"ennui", title:"권태기", description:"헤어질 이유도 붙잡을 확신도 없는 채, 두 사람은 관계를 다시 바라보기로 했다.", matches:state => state.conflict >= 55 || state.relationshipStress >= 65 },
  { id:"new-beginning", title:"새로운 시작", description:"30일의 선택은 끝났지만, 자신의 삶을 이해하는 새로운 여정이 시작됐다.", matches:() => true }
];

export function validateEndingDefinitions(definitions = ENDING_DEFINITIONS) {
  const ids = new Set();
  return definitions.length === 14 && definitions.every(ending => typeof ending.id === "string" && !ids.has(ending.id) && ids.add(ending.id) && typeof ending.title === "string" && typeof ending.description === "string" && typeof ending.matches === "function");
}

export function selectEnding(state, definitions = ENDING_DEFINITIONS) {
  return definitions.find(ending => ending.matches(state)) ?? definitions.at(-1);
}

function countValues(values = []) {
  return values.reduce((counts,value) => ({ ...counts, [value]:(counts[value] ?? 0)+1 }),{});
}

function getDominantChoice(counts) {
  const entries = Object.entries(counts);
  if (!entries.length) return { tag:"없음", count:0 };
  const [tag,count] = entries.sort((left,right) => right[1]-left[1] || left[0].localeCompare(right[0],"ko"))[0];
  return { tag, count };
}

function getRelationshipLabel(score) {
  if (score >= 800) return "서로의 확신";
  if (score >= 650) return "단단해진 사랑";
  if (score >= 450) return "계속 알아가는 사이";
  if (score >= 300) return "흔들리는 관계";
  return "멀어진 두 사람";
}

export function analyzePlayHistory(state) {
  const choiceCounts = countValues(state.choices);
  const dominantChoice = getDominantChoice(choiceCounts);
  const relationshipScore = Math.round((state.affection + state.trust) / 2);
  const assets = getAssetSummary(state);
  const secretChoices = secretChoiceCount(state);
  const highlights = [
    `${dominantChoice.tag} 선택을 ${dominantChoice.count}번 하며 가장 중요하게 여겼습니다.`,
    `${state.partner.name}와의 관계는 ‘${getRelationshipLabel(relationshipScore)}’로 기록됐습니다.`,
    `커리어 Lv.${state.jobLevel}, 총자산 ${Math.round(assets.netWorth).toLocaleString("ko-KR")}원으로 30일을 마쳤습니다.`
  ];
  if (secretChoices > 0) highlights.push(`숨긴 유혹의 선택 ${secretChoices}번이 관계의 위험으로 남았습니다.`);
  else if ((state.temptationHistory ?? []).length > 0) highlights.push("유혹 앞에서 관계를 지키는 선택을 했습니다.");
  else highlights.push(`예상 밖의 사건 ${(state.eventHistory ?? []).length}개를 지나왔습니다.`);
  if (hasFutureTalk(state)) highlights.push(`미래에 대한 선택은 ${state.futureScore >= 8 ? "함께할 준비" : "조금 더 필요한 준비"}로 이어졌습니다.`);
  return {
    daysPlayed:Math.min(30,Math.max(0,state.day > 30 ? 30 : state.day)),
    totalChoices:state.choices.length,
    choiceCounts,
    dominantChoice,
    relationshipScore,
    relationshipLabel:getRelationshipLabel(relationshipScore),
    netWorth:assets.netWorth,
    careerLevel:state.jobLevel,
    events:(state.eventHistory ?? []).length,
    secretChoices,
    highlights
  };
}
