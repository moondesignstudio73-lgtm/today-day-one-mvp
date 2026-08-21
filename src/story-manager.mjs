import { applyEffects, clamp } from "./game-core.mjs";
import { appendTransaction } from "./economy-manager.mjs";
import { meetsConditions } from "./event-manager.mjs";
import { recordMemory } from "./memory-manager.mjs";
import { STORY_SCENES } from "./story-data.mjs";

function hasStoryChoice(state, requirement) {
  return (state.storyHistory ?? []).some(record => record.sceneId === requirement.sceneId && (!requirement.choiceIds || requirement.choiceIds.includes(record.choiceId)));
}

export function meetsStoryConditions(state, conditions = []) {
  return conditions.every(condition => condition.storyChoice ? hasStoryChoice(state,condition.storyChoice) : meetsConditions(state,[condition]));
}

export function getStoryScene(sceneId, scenes = STORY_SCENES) {
  return scenes.find(scene => scene.id === sceneId) ?? null;
}

export function getEligibleStoryScenes(state, scenes = STORY_SCENES) {
  const history = state.storyHistory ?? [];
  if (history.some(record => record.day === state.day)) return [];
  return scenes.filter(scene => {
    if (history.some(record => record.sceneId === scene.id)) return false;
    if (state.day < scene.window[0] || state.day > scene.window[1]) return false;
    if (scene.requires && !hasStoryChoice(state,scene.requires)) return false;
    return meetsStoryConditions(state,scene.conditions);
  }).sort((a,b) => b.priority - a.priority || a.window[0] - b.window[0]);
}

export function selectNextStoryScene(state, scenes = STORY_SCENES) {
  if (state.pendingStoryId) return getStoryScene(state.pendingStoryId,scenes);
  return getEligibleStoryScenes(state,scenes)[0] ?? null;
}

function selectOutcome(state, choice) {
  return (choice.outcomes ?? []).find(outcome => meetsStoryConditions(state,outcome.conditions)) ?? null;
}

export function resolveStoryChoice(state, sceneId, choiceId, scenes = STORY_SCENES) {
  const scene = getStoryScene(sceneId,scenes);
  const choice = scene?.choices.find(item => item.id === choiceId);
  if (!scene || !choice || (state.storyHistory ?? []).some(record => record.sceneId === sceneId)) return null;
  const outcome = selectOutcome(state,choice);
  const effects = { ...(choice.effects ?? {}), ...(outcome?.effects ?? {}) };
  applyEffects(state,effects);
  if (effects.money) appendTransaction(state,{category:"story",label:scene.title,amount:Math.round(effects.money)});
  state.storyFlags ??= {};
  Object.assign(state.storyFlags,choice.flags ?? {},outcome?.flags ?? {});
  state.futureScore = clamp((state.futureScore ?? 0) + (choice.futureScore ?? 0) + (outcome?.futureScore ?? 0),-100,100);
  const response = outcome?.response ?? choice.response;
  const record = {sceneId:scene.id,arc:scene.arc,choiceId:choice.id,day:state.day,response};
  state.storyHistory ??= [];
  state.storyHistory.push(record);
  state.pendingStoryId = null;
  const memory = recordMemory(state,{type:"story",summary:choice.memory ?? `${scene.title}: ${choice.label}`,importance:4,tags:["스토리",scene.arc,scene.id,choice.id]});
  return {scene,choice,outcome,effects,response,record,memory};
}

export function validateStoryState(state) {
  return Array.isArray(state.storyHistory) && state.storyHistory.every(record => typeof record.sceneId === "string" && typeof record.choiceId === "string" && Number.isFinite(record.day) && typeof record.response === "string") && state.storyFlags && typeof state.storyFlags === "object" && Number.isFinite(state.futureScore) && (state.pendingStoryId === null || typeof state.pendingStoryId === "string");
}
