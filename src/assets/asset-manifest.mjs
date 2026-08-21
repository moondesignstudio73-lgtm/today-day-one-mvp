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
  "female-coworker":"assets/npcs/female-coworker-2d.png",
  "male-rival":"assets/npcs/male-rival-2d.png"
};

export const BACKGROUND_ASSETS = {
  "home-morning":"assets/backgrounds/morning-studio-2d.png",
  "home-night":"assets/backgrounds/home/BG_HOME_NIGHT_001.webp",
  "office-day":"assets/backgrounds/office/BG_OFFICE_DAY_001.webp",
  "cafe-rain-evening":"assets/backgrounds/cafe/BG_CAFE_RAIN_EVENING_001.webp",
  "river-night":"assets/backgrounds/street/BG_RIVER_NIGHT_001.webp"
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
  return NPC_ASSETS[npcId] ?? "";
}

export function getBackgroundAsset(backgroundId = "home-morning") {
  return BACKGROUND_ASSETS[backgroundId] ?? BACKGROUND_ASSETS["home-morning"];
}
