export function applyJobModifiers(state, action, effects) {
  if (action.tag !== "성공" || !state.job) return { ...effects };
  const modified = { ...effects };
  if ((modified.money ?? 0) > 0) modified.money *= state.job.incomeMultiplier;
  if ((modified.work ?? 0) > 0) modified.work *= 0.65 + state.job.growthPotential / 100;
  if ((modified.stress ?? 0) > 0) modified.stress *= state.job.stressRate;
  if ((modified.social ?? 0) > 0) modified.social *= 0.6 + state.job.socialOpportunity / 100;
  return modified;
}

export function addJobProgress(state, action, effects) {
  if (action.tag !== "성공") return null;
  state.jobProgress ??= 0;
  state.jobProgress += Math.max(1, Math.round((effects.work ?? 0) / 2));
  if (state.jobProgress < state.job.promotionThreshold) return null;
  state.jobProgress -= state.job.promotionThreshold;
  state.jobLevel = (state.jobLevel ?? 1) + 1;
  state.job.incomeMultiplier = Number((state.job.incomeMultiplier + 0.08).toFixed(2));
  return { level:state.jobLevel, incomeMultiplier:state.job.incomeMultiplier };
}
