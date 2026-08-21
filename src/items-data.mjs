export const ITEMS = [
  { id:"linen-shirt", name:"루미에르 린넨 셔츠", brand:"Lumière", category:"clothes", price:55000, luxuryLevel:1, attractivenessBonus:3, fashionBonus:8, preferenceTags:["미니멀","데일리"] },
  { id:"rose-parfum", name:"로지에 블룸 향수", brand:"Rosier", category:"perfume", price:75000, luxuryLevel:2, attractivenessBonus:4, fashionBonus:2, preferenceTags:["로맨틱","향수"] },
  { id:"urban-sneakers", name:"노바 어반 스니커즈", brand:"Nova", category:"shoes", price:89000, luxuryLevel:2, attractivenessBonus:3, fashionBonus:7, preferenceTags:["캐주얼"] },
  { id:"classic-watch", name:"오르빗 클래식 워치", brand:"Orbit", category:"watch", price:180000, luxuryLevel:3, attractivenessBonus:5, fashionBonus:9, preferenceTags:["클래식","럭셔리"] },
  { id:"mini-bag", name:"벨르 미니백", brand:"Belle", category:"bag", price:240000, luxuryLevel:4, attractivenessBonus:6, fashionBonus:10, preferenceTags:["로맨틱","럭셔리"] },
  { id:"silver-necklace", name:"셀레네 실버 네크리스", brand:"Selene", category:"accessory", price:120000, luxuryLevel:3, attractivenessBonus:5, fashionBonus:6, preferenceTags:["의미","로맨틱"] }
];

export function getItem(itemId) {
  return ITEMS.find(item => item.id === itemId) ?? null;
}

export function validateItemData(items = ITEMS) {
  const ids = new Set();
  return items.every(item => {
    if (typeof item.id !== "string" || ids.has(item.id)) return false;
    ids.add(item.id);
    return typeof item.name === "string" && typeof item.brand === "string" && typeof item.category === "string" && Number.isFinite(item.price) && item.price >= 0 && Number.isFinite(item.luxuryLevel) && Number.isFinite(item.attractivenessBonus) && Number.isFinite(item.fashionBonus) && Array.isArray(item.preferenceTags);
  });
}
