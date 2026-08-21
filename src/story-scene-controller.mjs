const POSITIVE_PATTERN = /고마|좋아|충분|기억|믿|함께|안심|재밌|행복/;
const NEGATIVE_PATTERN = /화나|무서|부담|서운|의심|답답|거짓말|미안/;

export function inferReactionExpression(text = "") {
  if (NEGATIVE_PATTERN.test(text)) return "tense";
  if (/걱정|아쉬|시간|침묵|천천히/.test(text)) return "worried";
  if (POSITIVE_PATTERN.test(text)) return "smile";
  return "calm";
}

export function createStorySceneSequence(scene, presentation) {
  return [
    { type:"transition", style:"fade", label:`DAY ${scene.window?.[0] ?? ""} · ${scene.arc}` },
    { type:"narration", text:scene.message },
    { type:"characterEnter", characterId:presentation.characterId, animationId:presentation.animationId },
    { type:"dialogue", speaker:scene.speaker, text:scene.title, expressionId:presentation.expressionId },
    { type:"choice", options:scene.choices.map(choice => ({ id:choice.id, label:choice.label })) }
  ];
}

export function createStoryReactionSequence(result) {
  const expressionId = inferReactionExpression(result.response);
  return [
    { type:"narration", text:`나는 “${result.choice.label}”라고 답했다.` },
    { type:"expressionChange", expressionId },
    { type:"dialogue", speaker:result.scene.speaker, text:result.response, expressionId },
    { type:"transition", style:"fade", label:"시간은 다시 일상으로 흐른다." },
    { type:"sceneEnd" }
  ];
}

export function createEventSceneSequence(event) {
  return [
    { type:"transition", style:"blur", label:event.title },
    { type:"narration", text:event.message },
    { type:"sceneEnd" }
  ];
}

export function createTemptationSceneSequence(encounter, message) {
  return [
    { type:"transition", style:"slide", label:`${encounter.npc.role} · ${encounter.npc.name}` },
    { type:"narration", text:message },
    { type:"characterEnter", characterId:encounter.npc.id, animationId:"soft-sway" },
    { type:"dialogue", speaker:encounter.npc.name, text:"잠깐, 이야기 좀 할래?", expressionId:"calm" },
    { type:"choice", options:encounter.choices }
  ];
}

export function createTemptationReactionSequence(npc, choiceId) {
  const responses = {
    reject:"알겠어. 확실하게 말해 줘서 고마워.",
    friend:"그래, 부담 주지 않을게. 편한 동료로 지내자.",
    secret:"좋아. 이 이야기는 우리 둘만 아는 거야."
  };
  const expressionId = choiceId === "secret" ? "smile" : choiceId === "reject" ? "worried" : "calm";
  return [
    { type:"expressionChange", expressionId },
    { type:"dialogue", speaker:npc.name, text:responses[choiceId] ?? "알겠어.", expressionId },
    { type:"narration", text:"선택의 의미는 숫자가 아니라 앞으로의 관계에 남을 것이다." },
    { type:"sceneEnd" }
  ];
}

export function validateSceneSequence(sequence) {
  const allowed = new Set(["transition","narration","characterEnter","dialogue","expressionChange","animation","sfx","itemShow","choice","cgShow","sceneEnd"]);
  return Array.isArray(sequence) && sequence.length > 0 && sequence.every(step => step && allowed.has(step.type));
}
