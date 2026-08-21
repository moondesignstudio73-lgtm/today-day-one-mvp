export const PAY_DAYS = [10, 20, 30];
export const DAILY_LIVING_COST = 18000;
export const SAVINGS_TRANSFER_AMOUNT = 100000;
export const DAILY_SAVINGS_RATE = 0.001;

export function createAdvancedEconomyState() {
  return { savings:0, interestEarned:0 };
}

export function validateAdvancedEconomyState(finance) {
  return Boolean(finance) && Number.isFinite(finance.savings) && finance.savings >= 0 && Number.isFinite(finance.interestEarned) && finance.interestEarned >= 0;
}

export function appendTransaction(state, transaction) {
  state.economyLedger ??= [];
  const entry = { day:state.day, category:"etc", ...transaction };
  state.economyLedger.push(entry);
  return entry;
}

export function recordTransaction(state, transaction) {
  const entry = appendTransaction(state, transaction);
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
  state.finance ??= createAdvancedEconomyState();
  if (state.finance.savings > 0) {
    const interest = Math.max(1, Math.round(state.finance.savings * DAILY_SAVINGS_RATE));
    state.finance.savings += interest;
    state.finance.interestEarned += interest;
    entries.push(appendTransaction(state,{day:completedDay,category:"savings-interest",label:"저축 이자",amount:interest}));
  }
  return entries;
}

export function getEconomySummary(state) {
  const ledger = (state.economyLedger ?? []).filter(entry => entry.category !== "transfer");
  const income = ledger.filter(entry => entry.amount > 0).reduce((sum, entry) => sum + entry.amount, 0);
  const expense = ledger.filter(entry => entry.amount < 0).reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  return { income, expense, net:income - expense, transactions:ledger.length };
}

export function depositSavings(state, amount = SAVINGS_TRANSFER_AMOUNT) {
  state.finance ??= createAdvancedEconomyState();
  if (!Number.isFinite(amount) || amount <= 0) return { ok:false, reason:"유효하지 않은 입금액입니다." };
  if (state.money < amount) return { ok:false, reason:"입금할 현금이 부족합니다." };
  recordTransaction(state,{category:"transfer",label:"저축 계좌 입금",amount:-amount});
  state.finance.savings += amount;
  return { ok:true, amount, balance:state.finance.savings };
}

export function withdrawSavings(state, amount = SAVINGS_TRANSFER_AMOUNT) {
  state.finance ??= createAdvancedEconomyState();
  if (!Number.isFinite(amount) || amount <= 0) return { ok:false, reason:"유효하지 않은 출금액입니다." };
  if (state.finance.savings < amount) return { ok:false, reason:"출금할 저축 잔액이 부족합니다." };
  state.finance.savings -= amount;
  recordTransaction(state,{category:"transfer",label:"저축 계좌 출금",amount});
  return { ok:true, amount, balance:state.finance.savings };
}

export function getAssetSummary(state) {
  const stockValue = Object.entries(state.investment?.holdings ?? {}).reduce((sum,[stockId,holding]) => {
    const stock = state.investment.market.find(entry => entry.id === stockId);
    return sum + (stock ? stock.price * holding.quantity : 0);
  },0);
  const cash = state.money ?? 0;
  const savings = state.finance?.savings ?? 0;
  return { cash, savings, stockValue, netWorth:cash+savings+stockValue };
}

export function getNextPayday(day) {
  return PAY_DAYS.find(payday => payday >= day) ?? null;
}
