export const PAY_DAYS = [10, 20, 30];
export const DAILY_LIVING_COST = 18000;
export const SAVINGS_TRANSFER_AMOUNT = 100000;
export const DAILY_SAVINGS_RATE = 0.001;
export const BOND_PURCHASE_AMOUNT = 200000;
export const BOND_TERM_DAYS = 7;
export const BOND_RETURN_RATE = 0.04;

export function createAdvancedEconomyState() {
  return { savings:0, interestEarned:0, bonds:[], bondInterestEarned:0 };
}

export function validateAdvancedEconomyState(finance) {
  return Boolean(finance) && Number.isFinite(finance.savings) && finance.savings >= 0 && Number.isFinite(finance.interestEarned) && finance.interestEarned >= 0 && Array.isArray(finance.bonds) && finance.bonds.every(bond => Number.isFinite(bond.principal) && bond.principal > 0 && Number.isInteger(bond.maturityDay) && bond.maturityDay >= 1) && Number.isFinite(finance.bondInterestEarned) && finance.bondInterestEarned >= 0;
}

export function ensureFinanceState(state) {
  state.finance ??= createAdvancedEconomyState();
  state.finance.bonds ??= [];
  state.finance.bondInterestEarned ??= 0;
  return state.finance;
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

export function getJobIncomeFactor(state, payday = state.day) {
  const [minimum = 1, maximum = 1] = state.job?.incomeVariance ?? [1, 1];
  if (minimum === maximum) return minimum;
  const seed = `${state.appearanceSeed ?? 0}:${state.job?.id ?? "job"}:${payday}`;
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const ratio = (hash >>> 0) / 4294967295;
  return minimum + (maximum - minimum) * ratio;
}

export function calculatePaycheck(state, payday = state.day) {
  const baseTenDayPay = state.job.salary / 3;
  const levelBonus = 1 + ((state.jobLevel ?? 1) - 1) * 0.08;
  return Math.round(baseTenDayPay * state.job.incomeMultiplier * levelBonus * getJobIncomeFactor(state, payday));
}

export function getPaycheckRange(state) {
  const baseTenDayPay = state.job.salary / 3;
  const levelBonus = 1 + ((state.jobLevel ?? 1) - 1) * 0.08;
  const [minimum = 1, maximum = 1] = state.job?.incomeVariance ?? [1, 1];
  const multiplier = state.job.incomeMultiplier * levelBonus;
  return { minimum: Math.round(baseTenDayPay * multiplier * minimum), maximum: Math.round(baseTenDayPay * multiplier * maximum) };
}

export function processDayEndEconomy(state, completedDay) {
  const entries = [];
  entries.push(recordTransaction(state, { day:completedDay, category:"living", label:"하루 생활비", amount:-Math.min(DAILY_LIVING_COST, state.money) }));
  if (PAY_DAYS.includes(completedDay)) entries.push(recordTransaction(state, { day:completedDay, category:"salary", label:`${state.job.name} 급여`, amount:calculatePaycheck(state, completedDay) }));
  const finance = ensureFinanceState(state);
  if (finance.savings > 0) {
    const interest = Math.max(1, Math.round(finance.savings * DAILY_SAVINGS_RATE));
    finance.savings += interest;
    finance.interestEarned += interest;
    entries.push(appendTransaction(state,{day:completedDay,category:"savings-interest",label:"저축 이자",amount:interest}));
  }
  const maturedBonds = finance.bonds.filter(bond => bond.maturityDay <= completedDay);
  finance.bonds = finance.bonds.filter(bond => bond.maturityDay > completedDay);
  maturedBonds.forEach(bond => {
    const interest = Math.round(bond.principal * BOND_RETURN_RATE);
    finance.bondInterestEarned += interest;
    entries.push(recordTransaction(state,{day:completedDay,category:"bond-maturity",label:"국채 만기 상환",amount:bond.principal + interest}));
  });
  return entries;
}

export function getEconomySummary(state) {
  const ledger = (state.economyLedger ?? []).filter(entry => entry.category !== "transfer");
  const income = ledger.filter(entry => entry.amount > 0).reduce((sum, entry) => sum + entry.amount, 0);
  const expense = ledger.filter(entry => entry.amount < 0).reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
  return { income, expense, net:income - expense, transactions:ledger.length };
}

export function depositSavings(state, amount = SAVINGS_TRANSFER_AMOUNT) {
  const finance = ensureFinanceState(state);
  if (!Number.isFinite(amount) || amount <= 0) return { ok:false, reason:"유효하지 않은 입금액입니다." };
  if (state.money < amount) return { ok:false, reason:"입금할 현금이 부족합니다." };
  recordTransaction(state,{category:"transfer",label:"저축 계좌 입금",amount:-amount});
  finance.savings += amount;
  return { ok:true, amount, balance:finance.savings };
}

export function withdrawSavings(state, amount = SAVINGS_TRANSFER_AMOUNT) {
  const finance = ensureFinanceState(state);
  if (!Number.isFinite(amount) || amount <= 0) return { ok:false, reason:"유효하지 않은 출금액입니다." };
  if (finance.savings < amount) return { ok:false, reason:"출금할 저축 잔액이 부족합니다." };
  finance.savings -= amount;
  recordTransaction(state,{category:"transfer",label:"저축 계좌 출금",amount});
  return { ok:true, amount, balance:finance.savings };
}

export function purchaseBond(state, principal = BOND_PURCHASE_AMOUNT) {
  const finance = ensureFinanceState(state);
  if (!Number.isFinite(principal) || principal <= 0) return { ok:false, reason:"유효하지 않은 매수 금액입니다." };
  if (state.money < principal) return { ok:false, reason:"국채를 매수할 현금이 부족합니다." };
  const bond = { principal, purchasedDay:state.day, maturityDay:state.day + BOND_TERM_DAYS };
  recordTransaction(state,{category:"bond-purchase",label:"7일 만기 국채 매수",amount:-principal});
  finance.bonds.push(bond);
  return { ok:true, bond };
}

export function getAssetSummary(state) {
  const stockValue = Object.entries(state.investment?.holdings ?? {}).reduce((sum,[stockId,holding]) => {
    const stock = state.investment.market.find(entry => entry.id === stockId);
    return sum + (stock ? stock.price * holding.quantity : 0);
  },0);
  const cash = state.money ?? 0;
  const savings = state.finance?.savings ?? 0;
  const bondValue = (state.finance?.bonds ?? []).reduce((sum, bond) => sum + bond.principal, 0);
  return { cash, savings, stockValue, bondValue, netWorth:cash+savings+stockValue+bondValue };
}

export function getNextPayday(day) {
  return PAY_DAYS.find(payday => payday >= day) ?? null;
}
