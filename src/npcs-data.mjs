export const NPC_ARCHETYPES = [
  { id:"female-coworker", role:"여성 직장 동료", relationshipType:"coworker", interestTarget:"player", baseAttraction:42 },
  { id:"male-rival", role:"여자친구의 남사친", relationshipType:"rival", interestTarget:"girlfriend", baseAttraction:48 },
  { id:"best-friend", role:"친한 친구", relationshipType:"friend", interestTarget:"none", baseAttraction:10 },
  { id:"team-lead", role:"직장 상사", relationshipType:"boss", interestTarget:"none", baseAttraction:8 }
];

export const NPC_NAMES = ["민서", "유진", "지훈", "도윤", "수아", "현우", "나연", "준호"];

export const NPC_ACTION_RULES = [
  { actionId:"coworker-lunch", npcId:"female-coworker", effects:{ affection:8, trust:5, interestInPlayer:3 } },
  { actionId:"coworker-drinks", npcId:"female-coworker", effects:{ affection:12, trust:3, interestInPlayer:10 } },
  { actionId:"focused-work", npcId:"team-lead", effects:{ affection:3, trust:7 } },
  { actionId:"early-work", npcId:"team-lead", effects:{ affection:2, trust:5 } },
  { actionId:"manager-feedback", npcId:"team-lead", effects:{ affection:5, trust:10 } }
];

export function validateNpcArchetypes(archetypes = NPC_ARCHETYPES) {
  const ids = new Set();
  return archetypes.every(npc => typeof npc.id === "string" && !ids.has(npc.id) && ids.add(npc.id) && typeof npc.role === "string" && typeof npc.relationshipType === "string" && ["player","girlfriend","none"].includes(npc.interestTarget) && Number.isFinite(npc.baseAttraction));
}
