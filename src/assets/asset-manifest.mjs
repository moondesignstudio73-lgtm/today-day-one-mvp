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
    }
  }
};

export function getCharacterSprite(character = "girlfriend", expression = "calm", pose = "standing", outfit = "default") {
  const assets = CHARACTER_ASSETS[character];
  if (expression === "calm" && pose !== "standing" && assets?.poses?.[pose]) return assets.poses[pose];
  if (expression === "calm" && outfit !== "default" && assets?.outfits?.[outfit]) return assets.outfits[outfit];
  const expressions = assets?.expressions;
  return expressions?.[expression] ?? expressions?.calm ?? "";
}
