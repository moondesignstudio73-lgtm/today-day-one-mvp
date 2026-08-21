export const JOBS = [
  { id:"planner", name:"주니어 기획자", salary:2800000, incomeMultiplier:1, stressRate:1, growthPotential:78, socialOpportunity:65, promotionThreshold:100 },
  { id:"developer", name:"주니어 개발자", salary:3200000, incomeMultiplier:1.12, stressRate:1.15, growthPotential:85, socialOpportunity:40, promotionThreshold:110 },
  { id:"designer", name:"주니어 디자이너", salary:2900000, incomeMultiplier:1.04, stressRate:1.05, growthPotential:82, socialOpportunity:55, promotionThreshold:105 },
  { id:"sales", name:"영업 사원", salary:3000000, incomeMultiplier:1.08, stressRate:1.2, growthPotential:70, socialOpportunity:90, promotionThreshold:100 }
];

export function generateJob(random = Math.random) {
  return structuredClone(JOBS[Math.floor(random() * JOBS.length)]);
}

export function validateJob(job) {
  return Boolean(job) && typeof job.id === "string" && typeof job.name === "string" &&
    ["salary","incomeMultiplier","stressRate","growthPotential","socialOpportunity","promotionThreshold"].every(key => Number.isFinite(job[key]) && job[key] >= 0);
}
