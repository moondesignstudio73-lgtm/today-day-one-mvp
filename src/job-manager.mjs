export function applyJobModifiers(state, action, effects) {
  if (!state.job) return { ...effects };
  const modified = { ...effects };
  if (action.tag === "성공") {
    if ((modified.money ?? 0) > 0) modified.money *= state.job.incomeMultiplier;
    if ((modified.work ?? 0) > 0) modified.work *= 0.65 + state.job.growthPotential / 100;
    if ((modified.stress ?? 0) > 0) modified.stress *= state.job.stressRate;
    if ((modified.social ?? 0) > 0) modified.social *= 0.6 + state.job.socialOpportunity / 100;
  }
  if (state.job.id === "professional-athlete" && (action.tag === "자기관리" || /exercise|rest|health/.test(action.id ?? ""))) {
    for (const key of ["health", "energy"]) if ((modified[key] ?? 0) > 0) modified[key] *= 1.3;
    for (const key of ["stress", "fatigue"]) if ((modified[key] ?? 0) < 0) modified[key] *= 1.3;
  }
  if (["multi-job-worker", "day-laborer"].includes(state.job.id) && (modified.fatigue ?? 0) > 0) modified.fatigue *= 1.15;
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

export function getCareerSummary(state) {
  const progress = Math.max(0, state.jobProgress ?? 0);
  const threshold = Math.max(1, state.job?.promotionThreshold ?? 1);
  return { progress, threshold, percent:Math.min(100, Math.round(progress / threshold * 100)), remaining:Math.max(0, threshold - progress) };
}
