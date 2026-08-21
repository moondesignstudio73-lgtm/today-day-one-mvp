import { NPC_ACTION_RULES, NPC_ARCHETYPES, NPC_NAMES } from "./npcs-data.mjs";

const randomInt = (random, min, max) => min + Math.floor(random() * (max - min + 1));

export function generateNpcs(random = Math.random) {
  const names = [...NPC_NAMES];
  return NPC_ARCHETYPES.map((archetype, index) => {
    const nameIndex = Math.min(names.length - 1, Math.floor(random() * names.length));
    const [name] = names.splice(nameIndex, 1);
    const attraction = Math.max(0, Math.min(100, archetype.baseAttraction + randomInt(random, -12, 12)));
    return { ...structuredClone(archetype), instanceId:`npc-${index + 1}`, name, affection:randomInt(random, 25, 45), trust:randomInt(random, 25, 50), attraction, interestInPlayer:archetype.interestTarget === "player" ? attraction : randomInt(random, 0, 18), interestInGirlfriend:archetype.interestTarget === "girlfriend" ? attraction : randomInt(random, 0, 18) };
  });
}

export function validateNpcs(npcs) {
  if (!Array.isArray(npcs) || npcs.length !== NPC_ARCHETYPES.length) return false;
  const ids = new Set();
  return npcs.every(npc => typeof npc.instanceId === "string" && !ids.has(npc.instanceId) && ids.add(npc.instanceId) && typeof npc.name === "string" && typeof npc.role === "string" && ["affection","trust","attraction","interestInPlayer","interestInGirlfriend"].every(key => Number.isFinite(npc[key]) && npc[key] >= 0 && npc[key] <= 100));
}

export function applyNpcActionEffects(state, action) {
  const rule = NPC_ACTION_RULES.find(entry => entry.actionId === action.id);
  if (!rule) return null;
  const npc = (state.npcs ?? []).find(entry => entry.id === rule.npcId);
  if (!npc) return null;
  for (const [key, amount] of Object.entries(rule.effects)) npc[key] = Math.max(0, Math.min(100, (npc[key] ?? 0) + amount));
  state.npcHistory ??= [];
  const record = { day:state.day, phase:state.phase, actionId:action.id, npcId:npc.instanceId, effects:{ ...rule.effects } };
  state.npcHistory.push(record);
  return { npc, record };
}

export function getNpcRelationshipStatus(npc) {
  if (npc.relationshipType === "coworker") {
    if (npc.interestInPlayer >= 75) return { label:"비밀 만남 직전", tone:"danger" };
    if (npc.interestInPlayer >= 60) return { label:"술자리 제안", tone:"warning" };
    if (npc.interestInPlayer >= 45) return { label:"개인 연락", tone:"interest" };
  }
  if (npc.relationshipType === "rival") {
    if (npc.interestInGirlfriend >= 75) return { label:"적극적인 접근", tone:"danger" };
    if (npc.interestInGirlfriend >= 55) return { label:"경계할 관계", tone:"warning" };
  }
  if (npc.trust >= 60) return { label:"믿을 수 있는 사이", tone:"safe" };
  return { label:"아직 어색한 사이", tone:"neutral" };
}
