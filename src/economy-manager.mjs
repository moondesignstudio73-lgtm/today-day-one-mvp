export const PAY_DAYS = [10, 20, 30];
export const DAILY_LIVING_COST = 18000;

export function recordTransaction(state, transaction) {
  state.economyLedger ??= [];
  const entry = { day:state.day, category:"etc", ...transaction };
  state.economyLedger.push(entry);
  state.money = Math.max(0, state.money + entry.amount);
  return entry;
}

export function calculatePaycheck(state) {
  const baseTenDayPay = state.job.salary / 3;
  const levelBonus = 1 + ((state.jobLevel ?? 1) - 1) * 0.08;
  return Math.round(baseTenDayPay * state.job.incomeMultiplier * levelBonus);
}

export function processDayEndEconomy(state, completedDay) {
  const entries = [];
  entries.push(recordTransaction(state, { day:completedDay, category:"living", label:"하루 생활비", amount:-Math.min(DAILY_LIVING_COST, state.money) }));
  if (PAY_DAYS.includes(completedDay)) entries.push(recordTransaction(state, { day:completedDay, category:"salary", label:`${state.job.name} 급여`, amount:calculatePaycheck(state) }));
  return entries;
}

export function getEconomySummary(state) {
  const ledger = state.economyLedger ?? [];
  const income = ledger.filter(entry => entry.amount > 0).reduce((sum, entry) => sum + entry.amount, 0);
  const expense = ledger.filter(entry => entry.amount < 0).reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  return { income, expense, net:income - expense, transactions:ledger.length };
}
