export const NIGHT_START_MINUTES = 23 * 60 + 10;
export const NIGHT_END_MINUTES = 26 * 60;

export const REPORT_KEYS = [
  ["money","총 자산"], ["energy","체력"], ["fatigue","피로"], ["stress","스트레스"],
  ["health","건강"], ["charm","매력"], ["fashion","패션"], ["confidence","자신감"],
  ["work","업무 능력"], ["social","사회성"], ["affection","호감도"], ["trust","신뢰"]
];

export function createDaySnapshot(state) {
  return Object.fromEntries(REPORT_KEYS.map(([key]) => [key, Math.round(Number(state[key]) || 0)]));
}

export function createNightState(state) {
  return {
    day: state.day,
    minutes: NIGHT_START_MINUTES,
    phoneChecked: false,
    messagesRead: false,
    activities: []
  };
}

export function ensureNightState(state) {
  state.dayStartSnapshot ??= createDaySnapshot(state);
  if (!state.nightState || state.nightState.day !== state.day) state.nightState = createNightState(state);
  return state.nightState;
}

export function formatNightTime(minutes = NIGHT_START_MINUTES) {
  const normalized = Math.max(0,Math.round(minutes));
  const hour = Math.floor(normalized / 60) % 24;
  const minute = normalized % 60;
  return `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
}

export function spendNightTime(state, minutes, activity) {
  const night = ensureNightState(state);
  const cost = Math.max(0,Math.round(Number(minutes) || 0));
  if (night.minutes + cost > NIGHT_END_MINUTES) return { ok:false, reason:"너무 늦어서 오늘은 더 할 수 없어요." };
  night.minutes += cost;
  if (activity) night.activities.push({ label:String(activity), minutes:cost });
  return { ok:true, minutes:night.minutes, time:formatNightTime(night.minutes) };
}

export function getLateSleepEffects(minutes = NIGHT_START_MINUTES) {
  if (minutes >= 26 * 60) return { fatigue:20, health:-2, energy:-8 };
  if (minutes >= 25 * 60) return { fatigue:10, energy:-4 };
  return {};
}

export function getDailyReport(state) {
  const start = state.dayStartSnapshot ?? createDaySnapshot(state);
  return REPORT_KEYS.map(([key,label]) => {
    const before = Math.round(Number(start[key]) || 0);
    const after = Math.round(Number(state[key]) || 0);
    return { key, label, before, after, delta:after-before };
  }).filter(row => row.delta !== 0 || ["money","affection","trust"].includes(row.key));
}

export function resetForNextDay(state) {
  state.dayStartSnapshot = createDaySnapshot(state);
  state.nightState = null;
  return state;
}
