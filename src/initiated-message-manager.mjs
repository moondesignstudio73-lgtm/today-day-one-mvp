const clampChance = value => Math.max(0.03, Math.min(0.75, value));

export function getInitiatedMessageChance(state) {
  const personality = state.partner.personality;
  const contactedToday = (state.actionHistory ?? []).some(entry => entry.day === state.day && entry.tag === "연락");
  return clampChance(0.08 + personality.contactImportance * 0.004 + (state.affection >= 700 ? 0.08 : 0) + (state.trust < 350 ? 0.12 : 0) - (contactedToday ? 0.14 : 0));
}

export function maybeGenerateInitiatedMessage(state, random = Math.random) {
  state.initiatedMessages ??= [];
  if (state.initiatedMessages.some(entry => entry.day === state.day) || random() > getInitiatedMessageChance(state)) return null;
  const personality = state.partner.personality;
  const text = state.trust < 350 ? "오늘 왜 연락이 없어? 무슨 일 있는 거 아니지?" : state.fatigue >= 70 ? "많이 피곤하지? 밥은 꼭 챙겨 먹어." : state.affection >= 700 ? "갑자기 네 생각나서 연락했어. 뭐 해?" : personality.contactImportance >= 65 ? "오늘 퇴근 언제 해? 끝나면 연락해 줘." : "점심은 먹었어? 오늘 하루도 잘 보내.";
  const message = { id:`message-${state.day}-${state.initiatedMessages.length + 1}`, day:state.day, phase:state.phase, text, chance:getInitiatedMessageChance(state) };
  state.initiatedMessages.push(message);
  return message;
}
