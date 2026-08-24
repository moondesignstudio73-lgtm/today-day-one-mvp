import { applyEffects } from "./game-core.mjs";
import { recordMemory } from "./memory-manager.mjs";
import { isContentAvailableForMode } from "./scenario-state.mjs";

export const MICRO_EVENT_PROBABILITY=.24;

export const MICRO_EVENTS=[
  {id:"micro-good-morning",category:"message",text:"연인에게서 ‘오늘도 잘 다녀와’라는 짧은 메시지가 왔다.",phases:[0],cooldown:2,effects:{affection:1}},
  {id:"micro-weather-rain",category:"weather",text:"창문에 빗방울이 맺히며 오늘의 공기가 조금 차분해졌다.",phases:[0,1],cooldown:5,effects:{stress:-1}},
  {id:"micro-coworker-greeting",category:"npc",text:"복도에서 동료와 눈이 마주쳐 가볍게 인사를 나눴다.",phases:[1],cooldown:2,effects:{social:1}},
  {id:"micro-sns-like",category:"sns",text:"연인이 올린 사진에 낯익은 사람이 좋아요를 남겼다.",phases:[2,3],cooldown:4,effects:{excitement:1}},
  {id:"micro-lunch-photo",category:"message",text:"연인이 점심 사진과 함께 네 생각이 났다고 보냈다.",phases:[1],cooldown:3,effects:{affection:2}},
  {id:"micro-night-call",category:"call",text:"잠들기 전 짧은 통화가 하루의 긴장을 풀어 줬다.",phases:[3],cooldown:3,effects:{trust:1,stress:-1}},
  {id:"micro-manager-praise",category:"work",text:"상사가 오늘 처리한 업무가 깔끔했다고 짧게 칭찬했다.",phases:[1],cooldown:4,effects:{work:1,confidence:1}},
  {id:"micro-store-window",category:"shopping",text:"쇼윈도에서 연인이 좋아할 법한 물건을 발견했다.",phases:[2],cooldown:4,effects:{excitement:1}}
];

export function getEligibleMicroEvents(state,events=MICRO_EVENTS){const history=state.microEventHistory??[];return events.filter(event=>isContentAvailableForMode(state,event)&&event.phases.includes(state.phase)&&!history.some(record=>record.id===event.id&&state.day-record.day<event.cooldown));}
export function getMicroEventDiagnostics(state,events=MICRO_EVENTS){const history=state.microEventHistory??[];return events.map(event=>{const last=[...history].reverse().find(record=>record.id===event.id);const cooldownRemaining=last?Math.max(0,event.cooldown-(state.day-last.day)):0;const modeEligible=isContentAvailableForMode(state,event);const phaseEligible=event.phases.includes(state.phase);return {id:event.id,title:event.text,category:event.category,probability:MICRO_EVENT_PROBABILITY,cooldownRemaining,modeEligible,phaseEligible,eligible:modeEligible&&phaseEligible&&!cooldownRemaining,phases:event.phases};});}
export function rollMicroEvents(state,random=Math.random,events=MICRO_EVENTS,maxPerPhase=2){state.microEventHistory??=[];const eligible=getEligibleMicroEvents(state,events);const selected=[];for(const event of eligible){if(selected.length>=maxPerPhase)break;if(random()>MICRO_EVENT_PROBABILITY)continue;applyEffects(state,event.effects);const record={id:event.id,day:state.day,phase:state.phase,category:event.category,text:event.text};state.microEventHistory.push(record);selected.push(record);if(["message","call","npc"].includes(event.category))recordMemory(state,{type:"micro-event",summary:event.text,importance:1,tags:["MICRO",event.category]});}return selected;}
export function validateMicroEvents(events=MICRO_EVENTS){const ids=new Set(events.map(event=>event.id));return ids.size===events.length&&events.every(event=>event.id&&event.text&&event.category&&event.phases.length&&event.cooldown>=1&&Object.values(event.effects).every(Number.isFinite));}
