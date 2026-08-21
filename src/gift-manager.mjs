import { applyEffects } from "./game-core.mjs";
import { getItem } from "./items-data.mjs";

export function calculateGiftReaction(state, item) {
  const personality = state.partner.personality;
  const materialScore = item.luxuryLevel * 6 * (personality.materialism / 100);
  const preferenceScore = personality.giftPreference * 0.25;
  const romanticScore = item.preferenceTags.includes("로맨틱") ? personality.romanticism * 0.15 : 0;
  const totalScore = materialScore + preferenceScore + romanticScore;
  return {
    score:Math.round(totalScore),
    affection:Math.round(8 + totalScore * 0.8),
    trust:Math.round(2 + personality.romanticism * 0.04),
    excitement:Math.round(3 + totalScore * 0.35),
    willEquip:totalScore >= 24,
    reaction:totalScore >= 42 ? "정말 마음에 들어!" : totalScore >= 24 ? "내 취향을 기억해 줬네." : "고마워. 잘 간직할게."
  };
}

export function giveGift(state, instanceId) {
  const instance = (state.inventory ?? []).find(entry => entry.instanceId === instanceId && entry.owner === "gift");
  if (!instance) return null;
  const item = getItem(instance.itemId);
  if (!item) return null;
  const reaction = calculateGiftReaction(state, item);
  instance.owner = "girlfriend";
  instance.givenDay = state.day;
  instance.equipped = reaction.willEquip;
  state.girlfriendEquipment ??= {};
  if (reaction.willEquip) {
    for (const entry of state.inventory) {
      const ownedItem = getItem(entry.itemId);
      if (entry !== instance && entry.owner === "girlfriend" && entry.equipped && ownedItem?.category === item.category) entry.equipped = false;
    }
    state.girlfriendEquipment[item.category] = instance.instanceId;
  }
  applyEffects(state, { affection:reaction.affection, trust:reaction.trust, excitement:reaction.excitement });
  return { instance, item, reaction };
}
