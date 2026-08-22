import { getItem } from "./items-data.mjs";
import { recordTransaction } from "./economy-manager.mjs";
import { isOutfitUnlocked } from "./heroine-data.mjs";

export const USED_CAR_GIFT_DISCOUNT = 0.12;

export function getPurchaseQuote(state, itemOrId, owner = "player") {
  const item = typeof itemOrId === "string" ? getItem(itemOrId) : itemOrId;
  if (!item) return null;
  const dealerDiscount = state.job?.id === "used-car-dealer" && item.category === "car" && owner === "gift";
  const discountRate = dealerDiscount ? USED_CAR_GIFT_DISCOUNT : 0;
  const price = Math.round(item.price * (1 - discountRate));
  return { basePrice:item.price, price, discountRate, discountAmount:item.price - price, reason:dealerDiscount ? "딜러 네트워크" : null };
}

export function addItem(state, itemId, owner = "player", source = "shopping") {
  const item = getItem(itemId);
  if (!item) return null;
  state.inventory ??= [];
  const instance = { instanceId:`${itemId}-${state.day}-${state.inventory.length + 1}`, itemId, owner, source, acquiredDay:state.day, equipped:false };
  state.inventory.push(instance);
  return instance;
}

export function equipItem(state, instanceId) {
  const instance = (state.inventory ?? []).find(entry => entry.instanceId === instanceId && entry.owner === "player");
  if (!instance) return null;
  const item = getItem(instance.itemId);
  for (const entry of state.inventory) {
    const equippedItem = getItem(entry.itemId);
    if (entry.owner === "player" && entry.equipped && equippedItem?.category === item.category) entry.equipped = false;
  }
  instance.equipped = true;
  state.equipment ??= {};
  state.equipment[item.category] = instance.instanceId;
  return instance;
}

export function getEquipmentBonuses(state) {
  return (state.inventory ?? []).filter(entry => entry.owner === "player" && entry.equipped).reduce((total, entry) => {
    const item = getItem(entry.itemId);
    total.attractiveness += item?.attractivenessBonus ?? 0;
    total.fashion += item?.fashionBonus ?? 0;
    return total;
  }, { attractiveness:0, fashion:0 });
}

export function getEffectiveAppearance(state) {
  const bonuses = getEquipmentBonuses(state);
  return { charm:Math.min(100, state.charm + bonuses.attractiveness), fashion:Math.min(100, state.fashion + bonuses.fashion), bonuses };
}

export function acquireActionItem(state, action) {
  if (!action.itemId) return null;
  const instance = addItem(state, action.itemId, action.itemOwner ?? "player", "action");
  if (instance?.owner === "player") equipItem(state, instance.instanceId);
  return instance;
}

export function purchaseItem(state, itemId, owner = "player") {
  const item = getItem(itemId);
  if (!item) return { ok:false, reason:"존재하지 않는 아이템입니다." };
  if (item.category === "heroine-outfit" && owner !== "gift") return {ok:false,reason:"히로인 의상은 선물용으로 구매해 주세요."};
  if (item.category === "heroine-outfit" && item.heroineId !== state.partner.heroineId) return {ok:false,reason:`${state.partner.name}의 체형과 취향에 맞는 의상이 아닙니다.`};
  if (item.category === "heroine-outfit" && !isOutfitUnlocked(state,item)) return {ok:false,reason:"아직 잠겨 있는 특별 의상입니다."};
  const quote = getPurchaseQuote(state, item, owner);
  if (state.money < quote.price) return { ok:false, reason:"구매할 돈이 부족합니다." };
  recordTransaction(state, { category:"shopping", label:`${item.name} 구매`, amount:-quote.price });
  const instance = addItem(state, itemId, owner, "store");
  instance.purchasePrice = quote.price;
  instance.discountRate = quote.discountRate;
  instance.discountReason = quote.reason;
  if (owner === "player") equipItem(state, instance.instanceId);
  return { ok:true, item, instance, quote };
}
