export function recordMemory(state, memory) {
  state.memories ??= [];
  const entry = { id:`memory-${state.day}-${state.memories.length + 1}`, day:state.day, type:"event", importance:1, tags:[], ...memory };
  state.memories.push(entry);
  if (state.memories.length > 60) state.memories.splice(0, state.memories.length - 60);
  return entry;
}

export function getMemoryContext(state, limit = 8) {
  const memories = state.memories ?? [];
  return [...memories].sort((a,b) => b.importance - a.importance || b.day - a.day).slice(0, limit).map(memory => ({ day:memory.day, type:memory.type, summary:memory.summary, importance:memory.importance, tags:[...memory.tags] }));
}

export function validateMemories(memories) {
  return Array.isArray(memories) && memories.every(memory => typeof memory.id === "string" && Number.isFinite(memory.day) && typeof memory.type === "string" && typeof memory.summary === "string" && Number.isFinite(memory.importance) && memory.importance >= 1 && memory.importance <= 5 && Array.isArray(memory.tags));
}
