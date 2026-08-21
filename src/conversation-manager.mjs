export function buildConversationContext(state) {
  const recentActions = (state.actionHistory ?? []).slice(-6).map(entry => ({ day:entry.day, actionId:entry.actionId, tag:entry.tag }));
  const recentEvents = (state.eventHistory ?? []).slice(-4).map(entry => ({ day:entry.day, title:entry.title, message:entry.message }));
  const recentGifts = (state.inventory ?? []).filter(entry => entry.owner === "girlfriend").slice(-3).map(entry => ({ itemId:entry.itemId, givenDay:entry.givenDay, equipped:entry.equipped }));
  const recentTemptations = (state.temptationHistory ?? []).slice(-3).map(entry => ({ day:entry.day, choiceId:entry.choiceId, partnerTrust:entry.partnerTrust }));
  return {
    day:state.day, phase:state.phase,
    girlfriend:{ name:state.partner.name, bio:state.partner.bio, personality:{ ...state.partner.personality } },
    relationship:{ affection:state.affection, trust:state.trust, excitement:state.excitement, attachment:state.attachment, conflict:state.conflict, stress:state.relationshipStress },
    player:{ money:state.money, health:state.health, energy:state.energy, fatigue:state.fatigue, stress:state.stress, charm:state.charm, fashion:state.fashion, confidence:state.confidence, job:state.job.name, jobLevel:state.jobLevel },
    recentActions, recentEvents, recentGifts, recentTemptations
  };
}

export function getContextualOpening(context) {
  const name = context.girlfriend.name;
  const latestTemptation = context.recentTemptations.at(-1);
  if (latestTemptation?.choiceId === "secret") return `${name}: 요즘 나한테 숨기는 거 있어? 왠지 느낌이 이상해.`;
  if (context.recentGifts.length) return `${name}: 선물 고마워. 오늘도 그때 생각이 났어.`;
  if (context.relationship.trust < 350) return `${name}: 오늘은 왜 이렇게 연락이 늦었어? 솔직하게 말해 줘.`;
  if (context.player.fatigue >= 70) return `${name}: 많이 지쳐 보여. 오늘은 무리하지 않았으면 좋겠어.`;
  if (context.relationship.affection > 700) return `${name}: 오늘 네 목소리 듣고 싶었는데, 잘 지냈어?`;
  return `${name}: 뭐 해? 오늘 하루는 어땠어?`;
}
