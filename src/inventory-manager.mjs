import { getItem } from "./items-data.mjs";

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

export function acquireActionItem(state, action) {
  if (!action.itemId) return null;
  const instance = addItem(state, action.itemId, action.itemOwner ?? "player", "action");
  if (instance?.owner === "player") equipItem(state, instance.instanceId);
  return instance;
}
