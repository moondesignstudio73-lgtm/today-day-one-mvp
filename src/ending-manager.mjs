import { getAssetSummary } from "./economy-manager.mjs";

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
  const secretChoices = (state.temptationHistory ?? []).filter(entry => ["secret","affair"].includes(entry.choiceId)).length;
  const highlights = [
    `${dominantChoice.tag} 선택을 ${dominantChoice.count}번 하며 가장 중요하게 여겼습니다.`,
    `${state.partner.name}와의 관계는 ‘${getRelationshipLabel(relationshipScore)}’로 기록됐습니다.`,
    `커리어 Lv.${state.jobLevel}, 총자산 ${Math.round(assets.netWorth).toLocaleString("ko-KR")}원으로 30일을 마쳤습니다.`
  ];
  if (secretChoices > 0) highlights.push(`숨긴 유혹의 선택 ${secretChoices}번이 관계의 위험으로 남았습니다.`);
  else if ((state.temptationHistory ?? []).length > 0) highlights.push("유혹 앞에서 관계를 지키는 선택을 했습니다.");
  else highlights.push(`예상 밖의 사건 ${(state.eventHistory ?? []).length}개를 지나왔습니다.`);
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
