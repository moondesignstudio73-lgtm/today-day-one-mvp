import { getCharacterSprite } from "../assets/asset-manifest.mjs";

export function resolveCharacterExpression(state) {
  if (state.conflict >= 55 || state.trust < 320) return { tone:"tense", icon:"…", label:"긴장한 눈빛" };
  if (state.stress >= 72) return { tone:"worried", icon:"?", label:"걱정스러운 표정" };
  if (state.affection >= 700) return { tone:"smile", icon:"♡", label:"다정한 미소" };
  return { tone:"calm", icon:"✦", label:"차분한 표정" };
}

export function resolveCharacterPose(state, expression = resolveCharacterExpression(state)) {
  return state.phase === 3 && expression.tone === "calm" ? "phone" : "standing";
}

export function resolveCharacterOutfit(state, expression = resolveCharacterExpression(state)) {
  return state.phase === 2 && expression.tone === "calm" ? "date" : "default";
}

export function renderCharacter(image, state) {
  const expression = resolveCharacterExpression(state);
  const pose = resolveCharacterPose(state,expression);
  const outfit = resolveCharacterOutfit(state,expression);
  const source = getCharacterSprite("girlfriend",expression.tone,pose,outfit);
  state.currentExpression = expression.tone;
  state.currentPose = pose;
  state.currentOutfit = outfit;
  if (image && image.getAttribute("src") !== source) image.setAttribute("src",source);
  if (image) image.dataset.expression = expression.tone;
  if (image) image.dataset.pose = pose;
  if (image) image.dataset.outfit = outfit;
  return expression;
}
