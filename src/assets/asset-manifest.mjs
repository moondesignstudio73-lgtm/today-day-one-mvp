import { YUNA_BACKGROUNDS } from "../yuna-data.mjs";

export const CHARACTER_ASSETS = {
  girlfriend:{
    expressions:{
      calm:"assets/characters/girlfriend-standing-2d.png",
      smile:"assets/characters/girlfriend-standing-smile-2d.png",
      worried:"assets/characters/girlfriend-standing-worried-2d.png",
      tense:"assets/characters/girlfriend-standing-tense-2d.png"
    },
    poses:{
      phone:"assets/characters/girlfriend-phone-calm-2d.png"
    },
    outfits:{
      date:"assets/characters/girlfriend-date-outfit-calm-2d.png"
    },
    accessories:{
      "ribbon-pin":"assets/accessories/lavender-ribbon-star-pin.png"
    }
  }
};

export const NPC_ASSETS = {
  "female-coworker":"assets/npcs/female-coworker-clean.png",
  "office-rookie":"assets/npcs/office-rookie-clean.png",
  "male-rival":"assets/npcs/male-rival-clean.png"
};

export const GIFT_VISUAL_ASSETS = Object.freeze({
  "mini-bag":"assets/items/visual-gifts/mini-bag.png",
  "silver-necklace":"assets/items/visual-gifts/silver-necklace.png",
  "aurora-phone":"assets/items/visual-gifts/aurora-phone.png",
  "rose-parfum":"assets/items/visual-gifts/rose-parfum.png"
});

export const GIFT_VEHICLE_ASSETS = Object.freeze({
  "solstice-ev":"assets/items/visual-gifts/solstice-ev.png"
});

const FEMALE_NPC_IDS = new Set([
  "female-coworker","office-rookie","client-manager","office-gossip",
  "heroine-best-friend","female-friend","investor-friend","love-advisor",
  "player-ex","ambitious-admirer","cafe-staff","edit-shop-staff",
  "hospital-nurse","asset-advisor"
]);

const MALE_NPC_IDS = new Set([
  "team-lead","office-best-male","office-rival","office-partner","office-party",
  "executive-director","best-friend","male-friend","college-friend","drinking-friend",
  "male-rival","heroine-senior","heroine-ex","gentle-admirer","gym-trainer",
  "real-estate-agent"
]);

const FEMALE_NPC_FALLBACK = "assets/npcs/female-coworker-clean.png";
const MALE_NPC_FALLBACK = "assets/npcs/male-support-clean.png";

export const BACKGROUND_ASSETS = {
  "day1-hospital-ceiling":"assets/backgrounds/hospital/day1-hospital-pov-ceiling-v1.png",
  "day1-hospital-bedside":"assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png",
  "day2-hospital-bedside":"assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png",
  "day2-recovery-corridor":"assets/backgrounds/day2/day2-recovery-corridor-morning-v1.png",
  "day2-hospital-lobby":"assets/backgrounds/day2/day2-hospital-lobby-day-v1.png",
  "day2-hospital-exit":"assets/backgrounds/day2/day2-hospital-exit-day-v1.png",
  "day2-car-interior":"assets/backgrounds/day2/day2-car-interior-day-v1.png",
  "day2-home-exterior":"assets/backgrounds/day2/day2-home-exterior-afternoon-v1.png",
  "day2-home-entry":"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",
  "day2-bedroom":"assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png",
  "home-morning":"assets/backgrounds/morning-studio-2d.png",
  "home-night":"assets/backgrounds/home/BG_HOME_NIGHT_001.webp",
  "office-day":"assets/backgrounds/office/BG_OFFICE_DAY_001.webp",
  "cafe-rain-evening":"assets/backgrounds/cafe/BG_CAFE_RAIN_EVENING_001.webp",
  "river-night":"assets/backgrounds/street/BG_RIVER_NIGHT_001.webp",
  ...YUNA_BACKGROUNDS
};

export function getCharacterSprite(character = "girlfriend", expression = "calm", pose = "standing", outfit = "default") {
  const assets = CHARACTER_ASSETS[character];
  if (expression === "calm" && pose !== "standing" && assets?.poses?.[pose]) return assets.poses[pose];
  if (expression === "calm" && outfit !== "default" && assets?.outfits?.[outfit]) return assets.outfits[outfit];
  const expressions = assets?.expressions;
  return expressions?.[expression] ?? expressions?.calm ?? "";
}

export function getCharacterAccessory(character = "girlfriend", accessory = "none") {
  return CHARACTER_ASSETS[character]?.accessories?.[accessory] ?? "";
}

export function getNpcSprite(npcId = "") {
  if (NPC_ASSETS[npcId]) return NPC_ASSETS[npcId];
  if (FEMALE_NPC_IDS.has(npcId)) return FEMALE_NPC_FALLBACK;
  if (MALE_NPC_IDS.has(npcId)) return MALE_NPC_FALLBACK;
  return MALE_NPC_FALLBACK;
}

export function getGiftVisualAsset(itemId = "") {
  return GIFT_VISUAL_ASSETS[itemId] ?? "";
}

export function getGiftVehicleAsset(itemId = "") {
  return GIFT_VEHICLE_ASSETS[itemId] ?? "";
}

export function getBackgroundAsset(backgroundId = "home-morning") {
  return BACKGROUND_ASSETS[backgroundId] ?? BACKGROUND_ASSETS["home-morning"];
}
