export const CHARACTER_ASSETS = {
  girlfriend:{
    expressions:{
      calm:"assets/characters/girlfriend-standing-2d.png",
      smile:"assets/characters/girlfriend-standing-smile-2d.png",
      worried:"assets/characters/girlfriend-standing-worried-2d.png",
      tense:"assets/characters/girlfriend-standing-tense-2d.png"
    }
  }
};

export function getCharacterSprite(character = "girlfriend", expression = "calm") {
  const expressions = CHARACTER_ASSETS[character]?.expressions;
  return expressions?.[expression] ?? expressions?.calm ?? "";
}
