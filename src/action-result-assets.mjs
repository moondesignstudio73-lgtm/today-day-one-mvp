export const ACTION_RESULT_ASSETS = Object.freeze({
  "morning-contact": "assets/action-results/morning-contact.png",
  "morning-gym": "assets/action-results/morning-gym.png",
  "sleep-in": "assets/action-results/sleep-in.png",
  "focused-work": "assets/action-results/focus-work.png",
  "lunch-date": "assets/action-results/lunch-girlfriend.png",
  "dinner-date": "assets/action-results/dinner-date.png",
  "coworker-lunch": "assets/action-results/lunch-coworkers-02.png",
  "stock-check": "assets/action-results/check-stocks.png",
  "manager-feedback": "assets/action-results/manager-feedback.png",
  "early-sleep": "assets/action-results/early-sleep.png",
  "temptation-secret": "assets/action-results/coworker-drinks.png",
  "job-freelancer-pitch": "assets/action-results/generated/job-freelancer-pitch-01.png",
  "job-freelancer-cowork": "assets/action-results/generated/job-freelancer-cowork-01.png",
  "job-civil-complaint": "assets/action-results/generated/job-civil-complaint-01.png",
  "job-civil-emergency": "assets/action-results/generated/job-civil-emergency-01.png",
  "job-writer-manuscript": "assets/action-results/generated/job-writer-manuscript-01.png",
  "job-writer-talk": "assets/action-results/generated/job-writer-talk-01.png",
  "job-multi-extra": "assets/action-results/generated/job-multi-extra-01.png",
  "job-multi-swap": "assets/action-results/generated/job-multi-swap-01.png",
  "job-labor-skilled": "assets/action-results/generated/job-labor-skilled-01.png",
  "job-labor-safety": "assets/action-results/generated/job-labor-safety-01.png",
  "job-designer-portfolio": "assets/action-results/generated/job-designer-portfolio-01.png",
  "job-designer-presentation": "assets/action-results/generated/job-designer-presentation-01.png",
  "job-developer-deploy": "assets/action-results/generated/job-developer-deploy-01.png",
  "job-developer-refactor": "assets/action-results/generated/job-developer-refactor-01.png",
  "job-student-project": "assets/action-results/generated/job-student-project-01.png",
  "job-student-club": "assets/action-results/generated/job-student-club-01.png",
  "job-landlord-inspection": "assets/action-results/generated/job-landlord-inspection-01.png",
  "job-landlord-support": "assets/action-results/generated/job-landlord-support-01.png",
  "job-artist-masterpiece": "assets/action-results/generated/job-artist-masterpiece-01.png",
  "job-artist-gallery": "assets/action-results/generated/job-artist-gallery-01.png",
  "job-singer-audition": "assets/action-results/generated/job-singer-audition-01.png",
  "job-singer-busking": "assets/action-results/generated/job-singer-busking-01.png",
  "job-actor-audition": "assets/action-results/generated/job-actor-audition-01.png",
  "job-actor-rehearsal": "assets/action-results/generated/job-actor-rehearsal-01.png",
  "job-retaker-mock": "assets/action-results/generated/job-retaker-mock-01.png",
  "job-retaker-study": "assets/action-results/generated/job-retaker-study-01.png",
  "job-dealer-buy-car": "assets/action-results/generated/job-dealer-buy-car-01.png",
  "job-dealer-gift-car": "assets/action-results/generated/job-dealer-gift-car-01.png",
  "job-athlete-training": "assets/action-results/generated/job-athlete-training-01.png",
  "job-athlete-match": "assets/action-results/generated/job-athlete-match-01.png"
});

export const ONE_TIME_ACTION_RESULT_ASSETS = Object.freeze({
  "morning-idle": "assets/action-results/generated/morning-idle-01.png",
  "morning-contact": "assets/action-results/generated/morning-contact-01.png",
  "morning-gym": "assets/action-results/generated/morning-gym-01.png",
  "sleep-in": "assets/action-results/generated/sleep-in-01.png"
});

export const ACTION_EFFECT_LABELS = Object.freeze({
  money: "자산",
  affection: "호감도",
  trust: "신뢰도",
  work: "업무 능력",
  confidence: "자신감",
  social: "사회성",
  stress: "스트레스",
  fatigue: "피로",
  energy: "에너지",
  health: "건강",
  charm: "매력",
  fashion: "패션",
  npcInterest: "상대 관심도",
  npcTrust: "상대 신뢰",
  conflict: "갈등"
});

export function getActionResultAsset(actionId) {
  return ACTION_RESULT_ASSETS[actionId] ?? null;
}

export function getOneTimeActionResultAsset(actionId, seenActionIds = []) {
  if (seenActionIds.includes(actionId)) return null;
  return ONE_TIME_ACTION_RESULT_ASSETS[actionId] ?? null;
}

export function getVisibleActionEffects(effects = {}) {
  return Object.entries(effects)
    .filter(([key, value]) => ACTION_EFFECT_LABELS[key] && Number.isFinite(value) && value !== 0)
    .map(([key, value]) => ({ key, label: ACTION_EFFECT_LABELS[key], value: Math.round(value) }));
}
