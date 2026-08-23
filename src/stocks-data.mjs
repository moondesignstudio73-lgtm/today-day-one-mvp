export const STOCKS = [
  { id:"nova-tech", name:"노바테크", initialPrice:82000, volatility:0.12, trend:0.015, risk:"high" },
  { id:"green-life", name:"그린라이프", initialPrice:46500, volatility:0.07, trend:0.009, risk:"medium" },
  { id:"han-river", name:"한강금융", initialPrice:118000, volatility:0.04, trend:0.005, risk:"low" },
  { id:"pixel-games", name:"픽셀게임즈", initialPrice:14800, volatility:0.15, trend:0.012, risk:"high" },
  { id:"korea-holdings", name:"코리아홀딩스", initialPrice:2350000, volatility:0.025, trend:0.006, risk:"low" }
];

export function validateStockData(stocks = STOCKS) {
  const ids = new Set();
  return stocks.every(stock => typeof stock.id === "string" && !ids.has(stock.id) && ids.add(stock.id) && typeof stock.name === "string" && Number.isFinite(stock.initialPrice) && stock.initialPrice > 0 && Number.isFinite(stock.volatility) && stock.volatility >= 0 && Number.isFinite(stock.trend) && ["low","medium","high"].includes(stock.risk));
}
