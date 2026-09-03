const VISIBLE_TEXT_TYPES=Object.freeze(new Set(["dialogue","message","narration","monologue"]));
const INTERNAL_TYPES=Object.freeze(new Set([
  "stage","stageAction","stageDirection","section","metadata","designNote","devNote",
  "continuityNote","implementationNote","testNote","flag","stateMutation","choiceCue","sceneBoundary"
]));

const DEVELOPMENT_NARRATION_PATTERNS=Object.freeze([
  /\bDAY\s*\d+\s*(?:에|에서|의|대로|에서\s*준비한)/i,
  /\bDAY\s*REPORT\b/i,
  /(?:이\s*장면|이\s*선택|오늘의\s*핵심).*(?:목적|의도|영향|발생|변화)/,
  /(?:haeun_affection|relationship_interest|storyFlags?|플래그|상태\s*설명|연결\s*목표)/i,
  /(?:다음|이전)\s*DAY.*(?:연결|분기|이벤트|준비|회수)/i,
  /(?:관계|신뢰|호감).*수치.*(?:반영|증가|감소)/,
  /두\s*사람은\s*이런저런\s*이야기를\s*나눴다/
]);

export function isDevelopmentStyleNarration(text=""){
  return DEVELOPMENT_NARRATION_PATTERNS.some(pattern=>pattern.test(text));
}

export function isInternalStoryStep(step){
  return Boolean(step&&INTERNAL_TYPES.has(step.type));
}

export function isPlayerFacingStoryStep(step){
  if(!step||!VISIBLE_TEXT_TYPES.has(step.type)||typeof step.text!=="string"||step.text.trim()==="")return false;
  return step.type!=="narration"||!isDevelopmentStyleNarration(step.text);
}

export function projectAuthoredStoryStep(step,{expressionId}={}){
  if(!step||typeof step.type!=="string")return Object.freeze({type:"metadata",sourceType:"invalid"});
  if(step.type==="dialogue")return Object.freeze({type:"dialogue",speaker:step.speaker,text:step.text,expressionId:step.expressionId??expressionId});
  if(step.type==="message")return Object.freeze({type:"message",sender:step.sender,text:step.text,device:step.device??"phone"});
  if(step.type==="note")return Object.freeze({type:"message",sender:step.sender??"메모",text:step.text,device:"note"});
  if(step.type==="narration"||step.type==="monologue")return Object.freeze({type:step.type,text:step.text});
  if(step.type==="choiceCue")return Object.freeze({type:"choiceCue",choiceId:step.choiceId,choiceNumber:step.choiceNumber});
  if(step.type==="sceneEnd")return Object.freeze({type:"sceneBoundary"});
  if(step.type==="action"||step.type==="stageDirection")return Object.freeze({type:"stageAction",action:step.text??step.action??"",sourceType:step.type});
  return Object.freeze({type:"metadata",sourceType:step.type});
}
