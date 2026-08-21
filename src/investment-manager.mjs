import { STOCKS } from "./stocks-data.mjs";

export function createInvestmentState() {
  return { market:STOCKS.map(stock => ({ id:stock.id, name:stock.name, price:stock.initialPrice, previousPrice:stock.initialPrice, changeRate:0, risk:stock.risk })), holdings:{}, history:[] };
}

export function advanceStockMarket(state, random = Math.random) {
  state.investment ??= createInvestmentState();
  const changes = state.investment.market.map(marketStock => {
    const stock = STOCKS.find(entry => entry.id === marketStock.id);
    const previousPrice = marketStock.price;
    const movement = stock.trend + (random() * 2 - 1) * stock.volatility;
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
