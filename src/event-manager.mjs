import { applyEffects } from "./game-core.mjs";
import { EVENT_DEFINITIONS } from "./events-data.mjs";

const OPERATORS = {
  ">=": (left, right) => left >= right,
  "<=": (left, right) => left <= right,
  ">": (left, right) => left > right,
  "<": (left, right) => left < right,
  "==": (left, right) => left === right
};

export function meetsConditions(state, conditions = []) {
  return conditions.every(({ stat, operator, value }) => {
    const compare = OPERATORS[operator];
    return Boolean(compare) && compare(state[stat], value);
  });
}

export function getEligibleEvents(state, definitions = EVENT_DEFINITIONS) {
  const history = state.eventHistory ?? [];
  return definitions.filter(event => {
    if (!meetsConditions(state, event.conditions)) return false;
    const previous = [...history].reverse().find(entry => entry.id === event.id);
    return !previous || state.day - previous.day >= event.cooldown;
  }).sort((a, b) => b.priority - a.priority);
}

export function rollEvent(state, random = Math.random, definitions = EVENT_DEFINITIONS) {
  const eligible = getEligibleEvents(state, definitions);
  for (const event of eligible) {
    if (random() <= event.probability) return triggerEvent(state, event);
  }
  return null;
}

export function triggerEvent(state, event) {
  applyEffects(state, event.effects);
  state.eventHistory ??= [];
  const record = { id: event.id, day: state.day, phase: state.phase, title: event.title, message: event.message };
  state.eventHistory.push(record);
  return { ...event, record };
}
