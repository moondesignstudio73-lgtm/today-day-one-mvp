import { applyEffects } from "./game-core.mjs";
import { EVENT_DEFINITIONS } from "./events-data.mjs";

export const MAX_EVENTS_PER_DAY = 1;

const OPERATORS = {
  ">=": (left, right) => left >= right,
  "<=": (left, right) => left <= right,
  ">": (left, right) => left > right,
  "<": (left, right) => left < right,
  "==": (left, right) => left === right
};

export function meetsConditions(state, conditions = []) {
  return conditions.every(condition => {
    if (condition.recentTag) {
      const minimumDay = state.day - condition.withinDays;
      const count = (state.actionHistory ?? []).filter(entry => entry.tag === condition.recentTag && entry.day >= minimumDay).length;
      return count >= (condition.minCount ?? 1);
    }
    const { stat, operator, value } = condition;
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

export function getEventDiagnostics(state, definitions = EVENT_DEFINITIONS) {
  const history = state.eventHistory ?? [];
  const eventsToday = history.filter(entry => entry.day === state.day).length;
  const dailyLimitReached = eventsToday >= MAX_EVENTS_PER_DAY;
  return definitions.map(event => {
    const conditionsMet = meetsConditions(state, event.conditions);
    const previous = [...history].reverse().find(entry => entry.id === event.id);
    const cooldownRemaining = previous ? Math.max(0, event.cooldown - (state.day - previous.day)) : 0;
    return {
      id: event.id,
      title: event.title,
      conditionsMet,
      cooldownRemaining,
      probability: getEventProbability(state, event),
      priority: event.priority,
      dailyLimitReached,
      eligible: conditionsMet && cooldownRemaining === 0 && !dailyLimitReached
    };
  }).sort((a, b) => b.priority - a.priority);
}

export function rollEvent(state, random = Math.random, definitions = EVENT_DEFINITIONS) {
  const eventsToday = (state.eventHistory ?? []).filter(entry => entry.day === state.day).length;
  if (eventsToday >= MAX_EVENTS_PER_DAY) return null;
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
