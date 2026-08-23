import { STOCKS } from "./stocks-data.mjs";
import { recordTransaction } from "./economy-manager.mjs";

export function createInvestmentState() {
  return { market:STOCKS.map(stock => ({ id:stock.id, name:stock.name, price:stock.initialPrice, previousPrice:stock.initialPrice, changeRate:0, risk:stock.risk })), holdings:{}, history:[] };
}

export function migrateInvestmentState(investment) {
  if (!investment || !Array.isArray(investment.market)) return createInvestmentState();
  const existingMarket = new Map(investment.market.map(stock => [stock.id, stock]));
  const validIds = new Set(STOCKS.map(stock => stock.id));
  const market = STOCKS.map(stock => {
    const saved = existingMarket.get(stock.id);
    if (!saved || !Number.isFinite(saved.price) || saved.price < 1000) {
      return { id:stock.id, name:stock.name, price:stock.initialPrice, previousPrice:stock.initialPrice, changeRate:0, risk:stock.risk };
    }
    return {
      id:stock.id,
      name:stock.name,
      price:saved.price,
      previousPrice:Number.isFinite(saved.previousPrice) ? saved.previousPrice : saved.price,
      changeRate:Number.isFinite(saved.changeRate) ? saved.changeRate : 0,
      risk:stock.risk
    };
  });
  const holdings = Object.fromEntries(Object.entries(investment.holdings ?? {}).filter(([stockId]) => validIds.has(stockId)));
  return { ...investment, market, holdings, history:Array.isArray(investment.history) ? investment.history : [] };
}

export function advanceStockMarket(state, random = Math.random) {
  state.investment ??= createInvestmentState();
  const changes = state.investment.market.map(marketStock => {
    const stock = STOCKS.find(entry => entry.id === marketStock.id);
    const previousPrice = marketStock.price;
    const baseMovement = stock.trend + (random() * 2 - 1) * stock.volatility;
    const movement = baseMovement * (state.player?.archetypeId === "wealthy" ? 10 : 1);
    marketStock.previousPrice = previousPrice;
    marketStock.price = Math.max(1000, Math.round(previousPrice * (1 + movement)));
    marketStock.changeRate = Number(((marketStock.price - previousPrice) / previousPrice * 100).toFixed(2));
    return { id:stock.id, previousPrice, price:marketStock.price, changeRate:marketStock.changeRate };
  });
  state.investment.history.push({ day:state.day, changes });
  if (state.investment.history.length > 30) state.investment.history.shift();
  return changes;
}

export function validateInvestmentState(investment) {
  return Boolean(investment) && Array.isArray(investment.market) && investment.market.length === STOCKS.length && investment.market.every(stock => typeof stock.id === "string" && Number.isFinite(stock.price) && stock.price >= 1000 && Number.isFinite(stock.changeRate)) && investment.holdings && typeof investment.holdings === "object" && Array.isArray(investment.history);
}

export function buyStock(state, stockId, quantity = 1) {
  const stock = state.investment?.market.find(entry => entry.id === stockId);
  if (!stock || !Number.isInteger(quantity) || quantity < 1) return { ok:false, reason:"유효하지 않은 주문입니다." };
  const cost = stock.price * quantity;
  if (state.money < cost) return { ok:false, reason:"매수할 자산이 부족합니다." };
  const holding = state.investment.holdings[stockId] ?? { quantity:0, averageCost:0 };
  holding.averageCost = Math.round((holding.averageCost * holding.quantity + cost) / (holding.quantity + quantity));
  holding.quantity += quantity;
  state.investment.holdings[stockId] = holding;
  recordTransaction(state,{category:"investment",label:`${stock.name} ${quantity}주 매수`,amount:-cost});
  return { ok:true, stock, holding, amount:cost };
}

export function sellStock(state, stockId, quantity = 1) {
  const stock = state.investment?.market.find(entry => entry.id === stockId);
  const holding = state.investment?.holdings?.[stockId];
  if (!stock || !holding || !Number.isInteger(quantity) || quantity < 1 || holding.quantity < quantity) return { ok:false, reason:"매도할 주식이 부족합니다." };
  const proceeds = stock.price * quantity;
  holding.quantity -= quantity;
  if (holding.quantity === 0) delete state.investment.holdings[stockId];
  recordTransaction(state,{category:"investment",label:`${stock.name} ${quantity}주 매도`,amount:proceeds});
  return { ok:true, stock, quantity:holding.quantity, amount:proceeds };
}

export function getPortfolioSummary(state) {
  return Object.entries(state.investment?.holdings ?? {}).reduce((summary,[stockId,holding]) => {
    const stock = state.investment.market.find(entry => entry.id === stockId);
    if (!stock) return summary;
    summary.costBasis += holding.averageCost * holding.quantity;
    summary.marketValue += stock.price * holding.quantity;
    summary.positions += 1;
    summary.profitLoss = summary.marketValue - summary.costBasis;
    return summary;
  },{costBasis:0,marketValue:0,profitLoss:0,positions:0});
}
