import { applyEffects } from "./game-core.mjs";
import { recordMemory } from "./memory-manager.mjs";
import { SITUATION_EVENTS } from "./situation-events-data.mjs";
import { combineChoiceEffects, getMbtiChoiceAdjustment } from "./event-choice-modifier.mjs";

export function getSituationEvent(id){return SITUATION_EVENTS.find(event=>event.id===id)??null;}

export function getSituationEventState(state,event) {
  const saved=state.situationEventStates?.[event.id];
  if(saved?.status)return saved.status;
  if(state.storyFlags?.[event.storyFlag])return "COMPLETED";
  if(state.day<event.dayRange[0]||state.day>event.dayRange[1])return "LOCKED";
  if(event.forbiddenFlags.some(flag=>state.storyFlags?.[flag]))return "LOCKED";
  if(event.npcRequirements.length&&!event.npcRequirements.every(id=>state.npcs?.some(npc=>npc.id===id&&npc.active)))return "LOCKED";
  return "AVAILABLE";
}

export function activateSituationEvent(state,event) {
  state.situationEventStates??={};
  state.situationEventStates[event.id]={status:"ACTIVE",startedDay:state.day,sceneIndex:0,choiceId:null};
  return state.situationEventStates[event.id];
}

export function resolveSituationEventChoice(state,event,choiceId) {
  const choice=event.choices.find(item=>item.id===choiceId);
  if(!choice)return null;
  const mbtiAdjustment=getMbtiChoiceAdjustment(state,choice);
  const effects=combineChoiceEffects(choice.effects,mbtiAdjustment.effects);
  applyEffects(state,effects);
  state.storyFlags??={};state.storyFlags[event.storyFlag]=true;state.storyFlags[choice.flag]=true;
  state.situationEventStates??={};state.situationEventStates[event.id]={status:"COMPLETED",startedDay:state.situationEventStates[event.id]?.startedDay??state.day,completedDay:state.day,sceneIndex:event.scenes.length-1,choiceId};
  state.futureEventWeights??={};
  for(const [key,value] of Object.entries({...event.futureEventWeights,...choice.futureEventWeights}))state.futureEventWeights[key]=(state.futureEventWeights[key]??1)*value;
  const memory=recordMemory(state,{type:"situation-event",summary:choice.memory,importance:event.cgCandidate?5:4,tags:[event.category,event.id,choiceId]});
  const record=[...(state.eventHistory??[])].reverse().find(entry=>entry.id===event.id&&entry.day===state.day);if(record){record.choiceId=choiceId;record.status="COMPLETED";record.memoryId=memory.id;}
  return {event,choice,effects,mbtiAdjustment,memory,status:"COMPLETED"};
}

export function validateSituationEventState(state) {
  return !state.situationEventStates||Object.entries(state.situationEventStates).every(([id,value])=>getSituationEvent(id)&&value&&typeof value.status==="string"&&Number.isInteger(value.sceneIndex));
}
