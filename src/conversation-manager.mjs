import { getMemoryContext } from "./memory-manager.mjs";
import { getItem } from "./items-data.mjs";

export function buildConversationContext(state) {
  const recentActions = (state.actionHistory ?? []).slice(-6).map(entry => ({ day:entry.day, actionId:entry.actionId, tag:entry.tag }));
  const recentEvents = (state.eventHistory ?? []).slice(-4).map(entry => ({ day:entry.day, title:entry.title, message:entry.message }));
  const recentGifts = (state.inventory ?? []).filter(entry => entry.owner === "girlfriend").slice(-3).map(entry => ({ itemId:entry.itemId, givenDay:entry.givenDay, equipped:entry.equipped }));
  const recentTemptations = (state.temptationHistory ?? []).slice(-3).map(entry => ({ day:entry.day, choiceId:entry.choiceId, partnerTrust:entry.partnerTrust }));
  const recentConversation = (state.conversationHistory ?? []).slice(-4).map(turn => ({
    day:turn.day,
    phase:turn.phase,
    user:String(turn.user ?? "").slice(0, 120),
    assistant:String(turn.assistant ?? "").slice(0, 180)
  }));
  const wornInstance=(state.inventory ?? []).find(entry=>entry.owner === "girlfriend" && entry.equipped && getItem(entry.itemId)?.category === "heroine-outfit");
  const wornOutfit=wornInstance ? getItem(wornInstance.itemId) : null;
  return {
    day:state.day, phase:state.phase,
    girlfriend:{ name:state.partner.name, bio:state.partner.bio, heroineId:state.partner.heroineId, age:state.partner.age, ageCategory:state.partner.ageCategory, studentSafe:Boolean(state.partner.studentSafe), archetype:state.partner.archetype, aiVoice:state.partner.aiVoice, messageVoice:state.partner.messageVoice??null, personality:{ ...state.partner.personality }, currentOutfit:wornOutfit ? { outfitId:wornOutfit.outfitId,name:wornOutfit.name,styleTags:[...wornOutfit.styleTags],giftedByPlayer:Boolean(wornInstance.giftedByPlayer),lastWorn:wornInstance.lastWorn ?? wornInstance.givenDay } : null },
    relationship:{ affection:state.affection, trust:state.trust, excitement:state.excitement, attachment:state.attachment, conflict:state.conflict, stress:state.relationshipStress },
    player:{ money:state.money, health:state.health, energy:state.energy, fatigue:state.fatigue, stress:state.stress, charm:state.charm, fashion:state.fashion, confidence:state.confidence, job:state.job.name, jobLevel:state.jobLevel },
    recentActions, recentEvents, recentGifts, recentTemptations, recentConversation, recentInitiatedMessages:(state.initiatedMessages ?? []).slice(-3), importantMemories:getMemoryContext(state)
  };
}

export function getContextualOpening(context) {
  const name = context.girlfriend.name;
  const initiated = context.recentInitiatedMessages?.at(-1);
  if (initiated?.day === context.day) return `${name}: ${initiated.text}`;
  const latestTemptation = context.recentTemptations.at(-1);
  if (latestTemptation?.choiceId === "secret") return `${name}: 요즘 나한테 숨기는 거 있어? 왠지 느낌이 이상해.`;
  if (context.recentGifts.length) return `${name}: 선물 고마워. 오늘도 그때 생각이 났어.`;
  if (context.relationship.trust < 350) return `${name}: 오늘은 왜 이렇게 연락이 늦었어? 솔직하게 말해 줘.`;
  if (context.player.fatigue >= 70) return `${name}: 많이 지쳐 보여. 오늘은 무리하지 않았으면 좋겠어.`;
  if (context.relationship.affection > 700) return `${name}: 오늘 네 목소리 듣고 싶었는데, 잘 지냈어?`;
  return `${name}: 뭐 해? 오늘 하루는 어땠어?`;
}

export function generateContextualReply(context, message) {
  const text = String(message ?? "").trim();
  if (!text) return null;
  const latestMemory = context.importantMemories?.at(0);
  const previousTurn = context.recentConversation?.at(-1);
  if (previousTurn && /기억|아까|전에|방금/.test(text)) {
    const previousMessage = previousTurn.user.replace(/\s+/g, " ").slice(0, 42);
    return { text:`응, 기억해. 아까 네가 “${previousMessage}”라고 말해 줬잖아.`, effects:{ affection:3, trust:5 } };
  }
  if (/미안|사과/.test(text)) return { text:context.relationship.trust < 450 ? "말해 줘서 고마워. 행동으로도 보여 줬으면 좋겠어." : "괜찮아. 솔직하게 말해 줘서 고마워.", effects:{ affection:4, trust:8 } };
  if (/사랑|좋아해/.test(text)) return { text:context.relationship.affection >= 650 ? "나도 많이 좋아해. 오늘은 그 말이 더 듣고 싶었어." : "고마워. 우리 천천히 더 가까워지자.", effects:{ affection:9, trust:3 } };
  if (/힘들|피곤|지쳤/.test(text)) return { text:"많이 힘들었구나. 오늘은 내가 네 편이 되어 줄게.", effects:{ affection:5, trust:7, stress:-4 } };
  if (latestMemory?.type === "gift") return { text:`응, 듣고 있어. 그리고 ${latestMemory.summary}도 아직 고맙게 기억하고 있어.`, effects:{ affection:4, trust:2 } };
  if (context.relationship.trust < 350) return { text:"무슨 말인지 알겠어. 그래도 지금은 조금 더 솔직한 얘기가 필요해.", effects:{ affection:1, trust:2 } };
  return { text:"응, 계속 말해 줘. 오늘 네 이야기를 더 듣고 싶어.", effects:{ affection:3, trust:3 } };
}

export function recordConversationTurn(state, userMessage, assistantMessage) {
  state.conversationHistory ??= [];
  const turn = { day:state.day, phase:state.phase, user:String(userMessage), assistant:String(assistantMessage) };
  state.conversationHistory.push(turn);
  if (state.conversationHistory.length > 40) state.conversationHistory.splice(0, state.conversationHistory.length - 40);
  return turn;
}
