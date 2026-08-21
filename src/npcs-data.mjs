export const NPC_ARCHETYPES = [
  { id:"female-coworker", role:"여성 직장 동료", relationshipType:"coworker", interestTarget:"player", baseAttraction:42 },
  { id:"male-rival", role:"여자친구의 남사친", relationshipType:"rival", interestTarget:"girlfriend", baseAttraction:48 },
  { id:"best-friend", role:"친한 친구", relationshipType:"friend", interestTarget:"none", baseAttraction:10 },
  { id:"team-lead", role:"직장 상사", relationshipType:"boss", interestTarget:"none", baseAttraction:8 }
];

export const NPC_NAMES = ["민서", "유진", "지훈", "도윤", "수아", "현우", "나연", "준호"];

export function validateNpcArchetypes(archetypes = NPC_ARCHETYPES) {
  const ids = new Set();
  return archetypes.every(npc => typeof npc.id === "string" && !ids.has(npc.id) && ids.add(npc.id) && typeof npc.role === "string" && typeof npc.relationshipType === "string" && ["player","girlfriend","none"].includes(npc.interestTarget) && Number.isFinite(npc.baseAttraction));
}
