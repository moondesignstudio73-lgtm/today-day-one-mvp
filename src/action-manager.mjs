const OPERATORS = {
  ">=": (left, right) => left >= right,
  "<=": (left, right) => left <= right,
  ">": (left, right) => left > right,
  "<": (left, right) => left < right,
  "==": (left, right) => left === right
};

export function getActionAvailability(state, action) {
  if (!isActionVisible(state,action)) return { available:false, reason:"현재 히로인 루트와 맞지 않는 행동입니다." };
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
  return true;
}

export function getAvailableActions(state, actions) {
  return actions.filter(action => getActionAvailability(state, action).available);
}
