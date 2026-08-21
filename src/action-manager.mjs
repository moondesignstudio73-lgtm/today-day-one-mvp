const OPERATORS = {
  ">=": (left, right) => left >= right,
  "<=": (left, right) => left <= right,
  ">": (left, right) => left > right,
  "<": (left, right) => left < right,
  "==": (left, right) => left === right
};

export function getActionAvailability(state, action) {
  for (const requirement of action.requirements ?? []) {
    const actual = requirement.stat.split(".").reduce((current, key) => current?.[key], state);
    const compare = OPERATORS[requirement.operator];
    if (!compare || !compare(actual, requirement.value)) return { available:false, reason:requirement.message, requirement, actual };
  }
  return { available:true, reason:"" };
}

export function getAvailableActions(state, actions) {
  return actions.filter(action => getActionAvailability(state, action).available);
}
