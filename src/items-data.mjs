import { HEROINE_OUTFITS } from "./heroine-data.mjs";
import { YUNA_GIFT_ITEMS } from "./yuna-data.mjs";

const SHOP_PRODUCT_IMAGE_ROOT = "assets/items/shop-products";
const withShopProductImage = item => ({...item, productImage:`${SHOP_PRODUCT_IMAGE_ROOT}/${item.id}.png`});

const BASE_ITEMS = [
  { id:"linen-shirt", icon:"👔", name:"루미에르 린넨 셔츠", brand:"Lumière", category:"clothes", price:55000, luxuryLevel:1, attractivenessBonus:3, fashionBonus:8, preferenceTags:["미니멀","데일리"] },
  { id:"rose-parfum", icon:"🌹", name:"로지에 블룸 향수", brand:"Rosier", category:"perfume", price:75000, luxuryLevel:2, attractivenessBonus:4, fashionBonus:2, preferenceTags:["로맨틱","향수"] },
  { id:"urban-sneakers", icon:"👟", name:"노바 어반 스니커즈", brand:"Nova", category:"shoes", price:89000, luxuryLevel:2, attractivenessBonus:3, fashionBonus:7, preferenceTags:["캐주얼"] },
  { id:"classic-watch", icon:"⌚", name:"오르빗 클래식 워치", brand:"Orbit", category:"watch", price:180000, luxuryLevel:3, attractivenessBonus:5, fashionBonus:9, preferenceTags:["클래식","럭셔리"] },
  { id:"mini-bag", icon:"👜", name:"벨르 미니백", brand:"Belle", category:"bag", price:240000, luxuryLevel:4, attractivenessBonus:6, fashionBonus:10, preferenceTags:["로맨틱","럭셔리"] },
  { id:"silver-necklace", icon:"📿", name:"셀레네 실버 네크리스", brand:"Selene", category:"accessory", price:120000, luxuryLevel:3, attractivenessBonus:5, fashionBonus:6, preferenceTags:["의미","로맨틱"] },
  { id:"velvet-lip-kit", icon:"💄", name:"벨벳 데일리 립 키트", brand:"Mellow", category:"cosmetics", price:68000, luxuryLevel:2, attractivenessBonus:6, fashionBonus:4, preferenceTags:["뷰티","로맨틱"] },
  { id:"aurora-phone", icon:"📱", name:"오로라 프로 스마트폰", brand:"Aurora", category:"smartphone", price:1350000, luxuryLevel:5, attractivenessBonus:4, fashionBonus:5, preferenceTags:["테크","럭셔리"] },
  { id:"solstice-ev", icon:"🚗", name:"솔스티스 전기 세단", brand:"Solstice", category:"car", price:20000000, luxuryLevel:6, attractivenessBonus:10, fashionBonus:8, preferenceTags:["드라이브","테크","럭셔리"] },
  { id:"skyline-studio", icon:"🏙️", name:"스카이라인 리버뷰 스튜디오", brand:"Skyline Living", category:"home", price:24000000, luxuryLevel:7, attractivenessBonus:12, fashionBonus:10, preferenceTags:["주거","안정","럭셔리"] }
].map(withShopProductImage);

const DAY9_CAMPAIGN_ITEMS = [
  { id:"day9-green-pocket-shirt", icon:"👚", name:"넉넉한 녹색 포켓 셔츠", brand:"명동 스타일 몰", category:"campaign-clothes", price:55000, luxuryLevel:1, attractivenessBonus:0, fashionBonus:0, preferenceTags:["녹색","큰 주머니","편안한 착용감"] },
  { id:"day9-pink-scarf", icon:"🧣", name:"옅은 분홍빛 스카프", brand:"명동 스타일 몰", category:"campaign-accessory", price:25000, luxuryLevel:1, attractivenessBonus:0, fashionBonus:0, preferenceTags:["분홍빛","목 장식"] },
  { id:"day9-player-top", icon:"👕", name:"스타일 몰 상의", brand:"명동 스타일 몰", category:"campaign-player-clothes", price:55000, luxuryLevel:1, attractivenessBonus:0, fashionBonus:0, preferenceTags:["피팅","현재 취향"] },
  { id:"day9-basic-socks", icon:"🧦", name:"교환한 기본 양말", brand:"명동 스타일 몰", category:"campaign-clothes", price:25000, luxuryLevel:1, attractivenessBonus:0, fashionBonus:0, preferenceTags:["기본","교환품"] }
];

export const ITEMS = [...BASE_ITEMS,...DAY9_CAMPAIGN_ITEMS,...YUNA_GIFT_ITEMS.map(withShopProductImage),...HEROINE_OUTFITS];

export function getItem(itemId) {
  return ITEMS.find(item => item.id === itemId) ?? null;
}

export function validateItemData(items = ITEMS) {
  const ids = new Set();
  return items.every(item => {
    if (typeof item.id !== "string" || ids.has(item.id)) return false;
    ids.add(item.id);
    return typeof item.icon === "string" && item.icon.length > 0 && typeof item.name === "string" && typeof item.brand === "string" && typeof item.category === "string" && Number.isFinite(item.price) && item.price >= 0 && Number.isFinite(item.luxuryLevel) && Number.isFinite(item.attractivenessBonus) && Number.isFinite(item.fashionBonus) && Array.isArray(item.preferenceTags) && (item.category !== "heroine-outfit" || (typeof item.heroineId === "string" && typeof item.outfitId === "string" && typeof item.productImage === "string" && typeof item.characterWearingImage === "string"));
  });
}
