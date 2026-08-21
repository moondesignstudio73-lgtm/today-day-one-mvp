import { getCharacterSprite } from "../assets/asset-manifest.mjs";

export function resolveCharacterExpression(state) {
  if (state.conflict >= 55 || state.trust < 320) return { tone:"tense", icon:"…", label:"긴장한 눈빛" };
  if (state.stress >= 72) return { tone:"worried", icon:"?", label:"걱정스러운 표정" };
  if (state.affection >= 700) return { tone:"smile", icon:"♡", label:"다정한 미소" };
  return { tone:"calm", icon:"✦", label:"차분한 표정" };
}

export function renderCharacter(image, state) {
  const expression = resolveCharacterExpression(state);
  const source = getCharacterSprite("girlfriend",expression.tone);
  state.currentExpression = expression.tone;
  if (image && image.getAttribute("src") !== source) image.setAttribute("src",source);
  if (image) image.dataset.expression = expression.tone;
  return expression;
}
