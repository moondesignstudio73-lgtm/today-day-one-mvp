export const ACTION_RESULT_VIDEOS = Object.freeze({
  sad: Object.freeze(["assets/video/action-results/sad01.mp4"]),
  food: Object.freeze(["assets/video/action-results/food01.mp4"]),
  shopping: Object.freeze([
    "assets/video/action-results/shop01.mp4",
    "assets/video/action-results/shop02.mp4"
  ]),
  date: Object.freeze([
    "assets/video/action-results/date01.mp4",
    "assets/video/action-results/date02.mp4",
    "assets/video/action-results/date03.mp4"
  ])
});

const ACTION_VIDEO_CATEGORIES = Object.freeze({
  "lunch-date": "food",
  "yuna-after-school-snack": "food",
  "dinner-date": "date",
  "gift-shopping": "shopping",
  "online-shopping": "shopping"
});

export const ACTION_VIDEO_CHANCE = 0.4;

export function isGirlfriendSad(state = {}) {
  return ["tense", "worried", "sad", "crying"].includes(state.currentExpression)
    || Number(state.conflict) >= 55
    || Number(state.trust) < 320;
}

export function isGirlfriendHappy(state = {}) {
  return Number(state.affection) >= 500
    && Number(state.trust) >= 450
    && Number(state.conflict) < 40
    && Number(state.relationshipStress) < 55;
}

export function getActionResultVideo(actionId, state = {}, random = Math.random) {
  if (isGirlfriendSad(state)) return ACTION_RESULT_VIDEOS.sad[0];
  const category = ACTION_VIDEO_CATEGORIES[actionId];
  if (!category || !isGirlfriendHappy(state) || random() >= ACTION_VIDEO_CHANCE) return null;
  const candidates = ACTION_RESULT_VIDEOS[category];
  return candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))];
}
