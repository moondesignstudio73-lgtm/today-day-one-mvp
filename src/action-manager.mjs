const OPERATORS = {
  ">=": (left, right) => left >= right,
  "<=": (left, right) => left <= right,
  ">": (left, right) => left > right,
  "<": (left, right) => left < right,
  "==": (left, right) => left === right
};

export const WEEKDAYS = ["월요일","화요일","수요일","목요일","금요일","토요일","일요일"];
export const getWeekdayIndex = day => Math.abs((Math.max(1,Math.round(Number(day)||1))-1)%7);
export const getWeekdayName = day => WEEKDAYS[getWeekdayIndex(day)];
export const isWeekend = day => getWeekdayIndex(day)>=5;

export function getActionAvailability(state, action) {
  if (!isActionVisible(state,action)) return { available:false, reason:"현재 히로인 루트와 맞지 않는 행동입니다." };
  if(action.weekendOnlyUnlessCareerIds?.length&&!isWeekend(state.day)&&!action.weekendOnlyUnlessCareerIds.includes(state.partner?.career?.id))return {available:false,reason:"주말 또는 일정이 자유로운 여자친구만 가능"};
  for (const requirement of action.requirements ?? []) {
    const actual = requirement.stat.split(".").reduce((current, key) => current?.[key], state);
    const compare = OPERATORS[requirement.operator];
    if (!compare || !compare(actual, requirement.value)) return { available:false, reason:requirement.message, requirement, actual };
  }
  return { available:true, reason:"" };
}

export function isActionVisible(state,action) {
  if (action.heroineIds?.length && !action.heroineIds.includes(state.partner?.heroineId)) return false;
  if (action.excludedHeroineIds?.includes(state.partner?.heroineId)) return false;
  if (action.careerIds?.length&&!action.careerIds.includes(state.partner?.career?.id)) return false;
  if (action.jobIds?.length&&!action.jobIds.includes(state.job?.id)) return false;
  if (action.excludedJobIds?.includes(state.job?.id)) return false;
  if (action.archetypeIds?.length&&!action.archetypeIds.includes(state.player?.archetypeId)) return false;
  if (action.weekdayOnly&&isWeekend(state.day)) return false;
  return true;
}

export function getAvailableActions(state, actions) {
  return actions.filter(action => getActionAvailability(state, action).available);
}
