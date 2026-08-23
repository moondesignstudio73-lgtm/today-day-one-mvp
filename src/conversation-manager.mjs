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
    girlfriend:{ name:state.partner.name, bio:state.partner.bio, heroineId:state.partner.heroineId, age:state.partner.age, ageCategory:state.partner.ageCategory, studentSafe:Boolean(state.partner.studentSafe), archetype:state.partner.archetype, aiVoice:state.partner.aiVoice, messageVoice:state.partner.messageVoice??null, career:structuredClone(state.partner.career??null), personality:{ ...state.partner.personality }, currentOutfit:wornOutfit ? { outfitId:wornOutfit.outfitId,name:wornOutfit.name,styleTags:[...wornOutfit.styleTags],giftedByPlayer:Boolean(wornInstance.giftedByPlayer),lastWorn:wornInstance.lastWorn ?? wornInstance.givenDay } : null },
    relationship:{ affection:state.affection, trust:state.trust, excitement:state.excitement, attachment:state.attachment, conflict:state.conflict, stress:state.relationshipStress },
    player:{ name:state.player?.name??"나", archetype:state.player?.archetypeName??"기본 캐릭터", appearanceRating:state.player?.appearanceRating??"보통", money:state.money, health:state.health, energy:state.energy, fatigue:state.fatigue, stress:state.stress, charm:state.charm, fashion:state.fashion, confidence:state.confidence, job:state.job.name, jobLevel:state.jobLevel },
    recentActions, recentEvents, recentGifts, recentTemptations, recentConversation, recentInitiatedMessages:(state.initiatedMessages ?? []).slice(-3), importantMemories:getMemoryContext(state)
  };
}

const BLOCKED_PROFANITY=["시발","씨발","ㅅㅂ","병신","ㅂㅅ","개새끼","새끼야","좆","지랄","꺼져","닥쳐"];
const HOSTILE_PATTERNS=[/죽어/,/혐오/,/한심/,/쓸모없/,/멍청/,/재수없/,/보기\s*싫/,/입\s*닥/,/꺼\s*져/,/미친\s*(년|놈)?/,/개\s*같/,/싫어.*꺼져/];

export function normalizeConversationInput(message){return String(message??"").normalize("NFKC").toLowerCase().replace(/[\s._~!@#$%^&*()+=[\]{}|\\;:'",<>/?`·-]/g,"").replace(/(.)\1{2,}/g,"$1$1");}
export function analyzeConversationInput(message){
  const raw=String(message??"").trim(),normalized=normalizeConversationInput(raw);
  if(!raw)return {allowed:false,level:"empty",message:"메시지를 입력해 주세요."};
  if(BLOCKED_PROFANITY.some(word=>normalized.includes(normalizeConversationInput(word))))return {allowed:false,level:"blocked",message:"상대방에게 상처가 될 수 있는 표현이에요. 조금 부드럽게 바꿔 주세요."};
  if(HOSTILE_PATTERNS.some(pattern=>pattern.test(normalized)))return {allowed:true,level:"hostile",message:"공격적인 표현이 감지되었습니다."};
  return {allowed:true,level:"safe",message:""};
}

export function getHostileConversationResponse(state){
  const count=(state.conversationSafety?.hostileCount??0)+1;
  const heroine=state.partner?.heroineId;
  const text=heroine==="nari"?"그런 말을 들으니까 마음이 너무 아파. 정말 실망했어.":heroine==="sejin"?"그런 식의 말은 받아들일 수 없어. 솔직히 많이 실망했어.":"그런 말을 들을 줄은 몰랐어. 농담이어도 정말 실망했어.";
  const scale=Math.min(1.7,1+(count-1)*.35);
  return {text,effects:{affection:-Math.round(55*scale),trust:-Math.round(70*scale),conflict:Math.round(24*scale),relationshipStress:Math.round(22*scale),excitement:-Math.round(18*scale)},count,forceEnd:count>=2};
}

export function getSuggestedConversationReplies(context,turn=0){
  if(context.relationship.conflict>=45||context.relationship.trust<350)return ["미안해. 네 마음부터 제대로 듣고 싶어.","내가 서운하게 한 부분을 솔직히 말해 줄래?","변명하지 않고 행동으로 보여 줄게."];
  if(context.player.fatigue>=70)return ["오늘 조금 힘들었는데 네 목소리를 들으니 좋아.","걱정해 줘서 고마워. 너는 오늘 어땠어?","잠깐이라도 서로의 하루를 이야기하자."];
  return turn%3===0?["오늘 네 생각이 많이 났어.","오늘 하루는 어땠어? 천천히 말해 줘.","다음 데이트 때 하고 싶은 게 있어?"]:turn%3===1?["그랬구나. 네 마음을 더 듣고 싶어.","내가 곁에서 어떻게 해 주면 좋을까?","솔직하게 말해 줘서 고마워."]:["나도 너와 이야기하는 시간이 좋아.","우리 다음에는 함께 좋은 추억 만들자.","오늘 이야기 꼭 기억할게."];
}

export function getContextualOpening(context) {
  const name = context.girlfriend.name;
  const playerName = context.player.name ?? "자기";
  const initiated = context.recentInitiatedMessages?.at(-1);
  if (initiated?.day === context.day) return `${name}: ${initiated.text}`;
  const latestTemptation = context.recentTemptations.at(-1);
  if (latestTemptation?.choiceId === "secret") return `${name}: 요즘 나한테 숨기는 거 있어? 왠지 느낌이 이상해.`;
  if (context.recentGifts.length) return `${name}: 선물 고마워. 오늘도 그때 생각이 났어.`;
  if (context.relationship.trust < 350) return `${name}: 오늘은 왜 이렇게 연락이 늦었어? 솔직하게 말해 줘.`;
  if (context.player.fatigue >= 70) return `${name}: 많이 지쳐 보여. 오늘은 무리하지 않았으면 좋겠어.`;
  if (context.relationship.affection > 700) return `${name}: 오늘 네 목소리 듣고 싶었는데, 잘 지냈어?`;
  return `${name}: ${playerName}, 뭐 해? 오늘 하루는 어땠어?`;
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
  const voice=context.girlfriend.heroineId==="nari"?{listen:"응, 나도 네 이야기 더 듣고 싶어. 그리고 내 얘기도 해도 돼?",love:"나도 좋아해! 그렇게 말해 주니까 오늘 하루가 환해지는 것 같아."}:context.girlfriend.heroineId==="sejin"?{listen:"그래, 계속 말해 봐. 네 생각을 솔직하게 듣고 싶어.",love:"그 말은 가볍게 듣지 않을게. 나도 네가 많이 소중해."}:{listen:"응, 계속 말해 줘. 오늘 네 이야기를 더 듣고 싶어.",love:"나도 많이 좋아해. 오늘은 그 말이 더 듣고 싶었어."};
  if (/미안|사과/.test(text)) return { text:context.relationship.trust < 450 ? "말해 줘서 고마워. 행동으로도 보여 줬으면 좋겠어." : "괜찮아. 솔직하게 말해 줘서 고마워.", effects:{ affection:4, trust:8 } };
  if (/사랑|좋아해/.test(text)) return { text:context.relationship.affection >= 650 ? voice.love : "고마워. 우리 천천히 더 가까워지자.", effects:{ affection:9, trust:3 } };
  if (/힘들|피곤|지쳤/.test(text)) return { text:"많이 힘들었구나. 오늘은 내가 네 편이 되어 줄게.", effects:{ affection:5, trust:7, stress:-4 } };
  if (latestMemory?.type === "gift") return { text:`응, 듣고 있어. 그리고 ${latestMemory.summary}도 아직 고맙게 기억하고 있어.`, effects:{ affection:4, trust:2 } };
  if (context.relationship.trust < 350) return { text:"무슨 말인지 알겠어. 그래도 지금은 조금 더 솔직한 얘기가 필요해.", effects:{ affection:1, trust:2 } };
  if(/오늘|하루|어땠/.test(text))return {text:context.phase>=2?"오늘은 조금 바빴지만 네 연락을 기다렸어. 너는 어떤 하루였어?":"아직 하루가 남았지만, 지금 이렇게 이야기하니 마음이 놓여.",effects:{affection:3,trust:3}};
  if(/데이트|만나|보고\s*싶/.test(text))return {text:"나도 만나고 싶어. 이번에는 서두르지 말고 우리 둘 다 좋아할 곳을 골라 보자.",effects:{affection:5,excitement:5}};
  return { text:voice.listen, effects:{ affection:3, trust:3 } };
}

export function recordConversationTurn(state, userMessage, assistantMessage,details={}) {
  state.conversationHistory ??= [];
  const turn = { day:state.day, phase:state.phase, user:String(userMessage), assistant:String(assistantMessage),mode:details.mode??"message",tone:details.tone??"safe" };
  state.conversationHistory.push(turn);
  if (state.conversationHistory.length > 40) state.conversationHistory.splice(0, state.conversationHistory.length - 40);
  return turn;
}
