import { clamp } from "./game-core.mjs";

export function calculateBreakupRisk(state) {
  const personality = state.partner.personality;
  const affectionRisk = clamp((400 - state.affection) / 4);
  const trustRisk = clamp((400 - state.trust) / 4);
  const personalityRisk = ((100 - personality.loyalty) + personality.emotionalSensitivity) / 2;
  const score = Math.round(clamp(affectionRisk * 0.25 + trustRisk * 0.25 + state.conflict * 0.2 + state.relationshipStress * 0.2 + personalityRisk * 0.1));
  return { score, label:score >= 75 ? "이별 임박" : score >= 55 ? "관계 위기" : score >= 35 ? "갈등 주의" : "관계 안정", tone:score >= 75 ? "danger" : score >= 55 ? "warning" : score >= 35 ? "interest" : "safe" };
}

export function evaluateBreakup(state) {
  if (state.breakup) return state.breakup;
  const risk = calculateBreakupRisk(state);
  if (risk.score < 75 || (state.affection >= 300 && state.trust >= 250)) return null;
  const reason = state.trust < state.affection ? "무너진 신뢰" : state.conflict >= 75 ? "반복된 갈등" : "식어 버린 마음";
  state.breakup = { day:state.day, reason, risk:risk.score, affection:Math.round(state.affection), trust:Math.round(state.trust) };
  state.ended = true;
  return state.breakup;
}
