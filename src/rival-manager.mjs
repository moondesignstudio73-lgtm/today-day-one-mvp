import { clamp } from "./game-core.mjs";

export function calculateRivalRisk(state, rival = (state.npcs ?? []).find(npc => npc.relationshipType === "rival")) {
  if (!rival) return { score:0, label:"라이벌 없음", tone:"safe" };
  const personality = state.partner.personality;
  const relationshipVulnerability = ((1000 - state.affection) / 10 + (1000 - state.trust) / 10 + state.conflict + state.relationshipStress) / 4;
  const personalityRisk = ((100 - personality.loyalty) + personality.opportunism) / 2;
  const rivalAppeal = (rival.attraction + rival.interestInGirlfriend) / 2;
  const economicRisk = state.money < 500000 ? personality.economicPreference : 0;
  const score = Math.round(clamp(relationshipVulnerability * 0.4 + personalityRisk * 0.25 + rivalAppeal * 0.25 + economicRisk * 0.1));
  return { score, label:score >= 70 ? "매우 위험" : score >= 50 ? "주의 필요" : score >= 30 ? "관찰 중" : "안정", tone:score >= 70 ? "danger" : score >= 50 ? "warning" : score >= 30 ? "interest" : "safe" };
}

export function applyRivalPressure(state, action) {
  const rival = (state.npcs ?? []).find(npc => npc.relationshipType === "rival");
  if (!rival) return null;
  const risk = calculateRivalRisk(state, rival);
  let delta = 0;
  if (action.tag === "유혹") delta = 5 + Math.round(risk.score / 20);
  else if (action.tag === "성공" && (action.effects.affection ?? 0) < 0) delta = 2 + Math.round(risk.score / 30);
  else if (["데이트","연락"].includes(action.tag)) delta = -4;
  if (!delta) return null;
  rival.interestInGirlfriend = clamp(rival.interestInGirlfriend + delta);
  state.rivalHistory ??= [];
  const record = { day:state.day, actionId:action.id, rivalId:rival.instanceId, delta, risk:risk.score };
  state.rivalHistory.push(record);
  return { rival, risk, record };
}
