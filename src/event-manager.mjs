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
    const actual = stat.split(".").reduce((current, key) => current?.[key], state);
    return Boolean(compare) && compare(actual, value);
  });
}

export function getEventProbability(state, event) {
  let probability = event.probability;
  for (const modifier of event.probabilityModifiers ?? []) {
    if (!meetsConditions(state, modifier.conditions)) continue;
    if (Number.isFinite(modifier.multiply)) probability *= modifier.multiply;
    if (Number.isFinite(modifier.add)) probability += modifier.add;
  }
  return Math.max(0, Math.min(1, probability));
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
    if (random() <= getEventProbability(state, event)) return triggerEvent(state, event);
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
