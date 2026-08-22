export const DEFAULT_GIRLFRIEND_VISUAL_ID = "intro-girlfriend";

export const GIRLFRIEND_VISUALS = Object.freeze([
  Object.freeze({
    id: DEFAULT_GIRLFRIEND_VISUAL_ID,
    name: "인트로 여자친구",
    previewImage: "assets/characters/girlfriend-standing-2d.png",
    expressions: Object.freeze({
      calm: "assets/characters/girlfriend-standing-2d.png",
      smile: "assets/characters/girlfriend-standing-smile-2d.png",
      worried: "assets/characters/girlfriend-standing-worried-2d.png",
      tense: "assets/characters/girlfriend-standing-tense-2d.png"
    }),
    poses: Object.freeze({ phone: "assets/characters/girlfriend-phone-calm-2d.png" }),
    outfits: Object.freeze({ date: "assets/characters/girlfriend-date-outfit-calm-2d.png" })
  })
]);

export function getGirlfriendVisual(visualId = DEFAULT_GIRLFRIEND_VISUAL_ID) {
  return GIRLFRIEND_VISUALS.find(visual => visual.id === visualId) ?? GIRLFRIEND_VISUALS[0];
}

export function getGirlfriendVisualAsset(visualId, expression = "calm", pose = "standing", outfit = "default") {
  const visual = getGirlfriendVisual(visualId);
  if (expression === "calm" && pose !== "standing" && visual.poses[pose]) return visual.poses[pose];
  if (expression === "calm" && outfit !== "default" && visual.outfits[outfit]) return visual.outfits[outfit];
  return visual.expressions[expression] ?? visual.expressions.calm;
}

export function selectGirlfriendVisual(partner, visualId) {
  if (!partner || typeof partner !== "object") return null;
  partner.visualId = getGirlfriendVisual(visualId).id;
  return partner.visualId;
}

export function lockGirlfriendToIntroVisual(partner) {
  return selectGirlfriendVisual(partner, DEFAULT_GIRLFRIEND_VISUAL_ID);
}
