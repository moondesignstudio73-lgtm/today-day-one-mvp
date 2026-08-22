const createJob = (id, name, salary, startingMoney, statModifiers, incomeVariance, options = {}) => ({
  id,
  name,
  salary,
  startingMoney,
  statModifiers,
  incomeVariance,
  incomeMultiplier: options.incomeMultiplier ?? 1,
  stressRate: options.stressRate ?? 1,
  growthPotential: options.growthPotential ?? 60,
  socialOpportunity: options.socialOpportunity ?? 50,
  promotionThreshold: options.promotionThreshold ?? 100,
  selectionWeight: options.selectionWeight ?? 8,
  incomeType: options.incomeType ?? "급여",
  perkId: options.perkId ?? "steady-growth",
  perkName: options.perkName ?? "꾸준한 성장",
  perkDescription: options.perkDescription ?? "성공 행동으로 경력과 수입이 안정적으로 성장한다."
});

export const JOBS = [
  createJob("freelancer", "프리랜서", 2550000, 700000, { work: 10, social: 3, stress: 5 }, [0.35, 1.65], { stressRate: 1.08, growthPotential: 82, socialOpportunity: 68, promotionThreshold: 105, selectionWeight: 9, incomeType: "프로젝트 정산", perkId: "flexible-schedule", perkName: "유연한 일정", perkDescription: "프로젝트 수입의 폭이 크지만 성공 행동의 업무 성장이 빠르다." }),
  createJob("civil-servant", "공무원", 2850000, 1200000, { stress: -5, work: 5, confidence: 4 }, [0.98, 1.02], { stressRate: 0.88, growthPotential: 60, socialOpportunity: 58, promotionThreshold: 120, selectionWeight: 9, perkId: "public-stability", perkName: "안정적인 생활", perkDescription: "급여 변동이 거의 없고 업무 스트레스 증가량이 적다." }),
  createJob("writer", "작가", 1800000, 500000, { charm: 5, work: 8, social: -8, confidence: -2 }, [0.4, 1.7], { stressRate: 1.05, growthPotential: 88, socialOpportunity: 42, promotionThreshold: 95, selectionWeight: 7, incomeType: "원고료·인세", perkId: "royalty-chance", perkName: "인세의 가능성", perkDescription: "수입 편차가 크지만 창작 성과에 따라 높은 정산을 받을 수 있다." }),
  createJob("multi-job-worker", "N잡 알바생", 2550000, 550000, { health: -5, energy: -4, fatigue: 8, work: 5, social: 5 }, [0.75, 1.3], { stressRate: 1.16, growthPotential: 72, socialOpportunity: 72, promotionThreshold: 90, selectionWeight: 10, incomeType: "알바 정산", perkId: "multiple-paychecks", perkName: "여러 개의 급여", perkDescription: "수입원이 다양하지만 행동으로 피로가 더 쉽게 쌓인다." }),
  createJob("day-laborer", "일용직", 2400000, 400000, { health: 15, energy: 5, fashion: -8, fatigue: 6, work: 4 }, [0.65, 1.35], { stressRate: 1.12, growthPotential: 58, socialOpportunity: 48, promotionThreshold: 85, selectionWeight: 7, incomeType: "일당 정산", perkId: "physical-labor", perkName: "강한 체력", perkDescription: "높은 체력으로 시작하지만 수입과 근무 강도의 편차가 크다." }),
  createJob("designer", "디자이너", 2900000, 850000, { fashion: 18, charm: 8, work: 10, stress: 5 }, [0.88, 1.12], { incomeMultiplier: 1.04, stressRate: 1.05, growthPotential: 82, socialOpportunity: 55, promotionThreshold: 105, selectionWeight: 9, perkId: "visual-sense", perkName: "시각 감각", perkDescription: "패션과 매력이 높고 첫인상에서 좋은 출발을 한다." }),
  createJob("developer", "프로그래머", 3200000, 1000000, { work: 20, social: -8, stress: 10, confidence: 4 }, [0.95, 1.08], { incomeMultiplier: 1.12, stressRate: 1.15, growthPotential: 85, socialOpportunity: 40, promotionThreshold: 110, selectionWeight: 10, perkId: "technical-focus", perkName: "기술 집중", perkDescription: "업무 성장과 급여가 높지만 야근과 스트레스 관리가 어렵다." }),
  createJob("college-student", "대학생", 900000, 350000, { energy: 10, social: 15, confidence: 3, work: -5 }, [0.45, 1.5], { stressRate: 0.95, growthPotential: 92, socialOpportunity: 92, promotionThreshold: 80, selectionWeight: 10, incomeType: "알바·장학금", perkId: "campus-life", perkName: "캠퍼스 생활", perkDescription: "수입은 적지만 에너지와 사교 기회가 많다." }),
  createJob("landlord-heir", "건물주 아들", 2100000, 5000000, { confidence: 12, social: 8, work: -15, stress: -3 }, [1, 1.05], { stressRate: 0.82, growthPotential: 38, socialOpportunity: 78, promotionThreshold: 140, selectionWeight: 3, incomeType: "임대·용돈 수입", perkId: "family-assets", perkName: "가족 자산", perkDescription: "큰 시작 자금과 안정 수입이 있지만 직업 성장 속도가 느리다." }),
  createJob("visual-artist", "미술작가", 1800000, 450000, { charm: 10, fashion: 12, work: 6, social: -3 }, [0.15, 2.5], { stressRate: 1.04, growthPotential: 90, socialOpportunity: 56, promotionThreshold: 95, selectionWeight: 6, incomeType: "작품 판매", perkId: "masterpiece", perkName: "작품 판매", perkDescription: "판매가 없는 시기도 있지만 작품이 주목받으면 큰 수익이 생긴다." }),
  createJob("aspiring-singer", "가수 지망생", 1200000, 300000, { charm: 18, confidence: 8, social: 8, stress: 6 }, [0.25, 2], { stressRate: 1.14, growthPotential: 94, socialOpportunity: 88, promotionThreshold: 85, selectionWeight: 7, incomeType: "공연·행사비", perkId: "audition", perkName: "오디션 기회", perkDescription: "매력과 자신감이 높고 성공적인 무대가 수입을 크게 바꾼다." }),
  createJob("actor", "배우", 2400000, 900000, { charm: 15, social: 12, confidence: 8, stress: 8 }, [0.38, 2.25], { stressRate: 1.18, growthPotential: 86, socialOpportunity: 95, promotionThreshold: 100, selectionWeight: 5, incomeType: "출연료", perkId: "spotlight", perkName: "대중의 시선", perkDescription: "출연 성과에 따라 고수익을 얻지만 사교와 스캔들 위험이 높다." }),
  createJob("exam-retaker", "재수생", 450000, 250000, { work: 5, confidence: -5, stress: 10, social: -6 }, [0, 1.65], { stressRate: 1.2, growthPotential: 96, socialOpportunity: 32, promotionThreshold: 75, selectionWeight: 8, incomeType: "단기 알바", perkId: "second-chance", perkName: "다시 시작하는 힘", perkDescription: "수입은 거의 없지만 공부와 성장 행동의 잠재력이 높다." }),
  createJob("used-car-dealer", "중고차 딜러", 2800000, 1100000, { social: 18, confidence: 12, work: 8, stress: 5 }, [0.46, 1.63], { incomeMultiplier: 1.05, stressRate: 1.12, growthPotential: 76, socialOpportunity: 96, promotionThreshold: 95, selectionWeight: 7, incomeType: "기본급·판매 수당", perkId: "dealer-network", perkName: "딜러 네트워크", perkDescription: "여자친구에게 자동차를 선물할 때 차량 가격을 12% 할인받는다." }),
  createJob("professional-athlete", "프로 운동선수", 3900000, 1500000, { health: 25, energy: 8, confidence: 15, charm: 10, fatigue: 8, work: -5 }, [0.7, 1.7], { stressRate: 1.1, growthPotential: 84, socialOpportunity: 86, promotionThreshold: 110, selectionWeight: 5, incomeType: "연봉·출전 수당", perkId: "pro-conditioning", perkName: "프로의 자기관리", perkDescription: "운동과 회복 행동 효과가 30% 증가하지만 피로를 안고 시작한다." })
];

const LEGACY_JOB_DEFAULTS = {
  planner: { startingMoney: 850000, statModifiers: { work: 8, social: 5 }, incomeVariance: [0.95, 1.05], perkId: "steady-growth", perkName: "꾸준한 성장", perkDescription: "기획 경험을 바탕으로 안정적으로 경력을 쌓는다.", selectionWeight: 0, incomeType: "급여" },
  sales: { startingMoney: 900000, statModifiers: { social: 12, confidence: 8, stress: 5 }, incomeVariance: [0.75, 1.3], perkId: "sales-network", perkName: "영업 인맥", perkDescription: "넓은 인맥을 활용해 사회적 기회를 만든다.", selectionWeight: 0, incomeType: "급여·성과급" }
};

export function generateJob(random = Math.random) {
  const totalWeight = JOBS.reduce((sum, entry) => sum + entry.selectionWeight, 0);
  let roll = Math.max(0, Math.min(0.999999, Number(random()) || 0)) * totalWeight;
  for (const entry of JOBS) {
    roll -= entry.selectionWeight;
    if (roll < 0) return structuredClone(entry);
  }
  return structuredClone(JOBS.at(-1));
}

export function migrateJob(jobValue) {
  if (!jobValue || typeof jobValue !== "object") return structuredClone(JOBS[0]);
  const template = JOBS.find((entry) => entry.id === jobValue.id) ?? LEGACY_JOB_DEFAULTS[jobValue.id] ?? {};
  for (const key of ["salary", "startingMoney", "incomeMultiplier", "stressRate", "growthPotential", "socialOpportunity", "promotionThreshold", "selectionWeight"]) {
    if (!Number.isFinite(jobValue[key])) jobValue[key] = Number.isFinite(template[key]) ? template[key] : key === "startingMoney" ? 800000 : key === "selectionWeight" ? 0 : 1;
  }
  jobValue.statModifiers = { ...(template.statModifiers ?? {}), ...(jobValue.statModifiers ?? {}) };
  jobValue.incomeVariance = Array.isArray(jobValue.incomeVariance) ? jobValue.incomeVariance : [...(template.incomeVariance ?? [1, 1])];
  for (const key of ["incomeType", "perkId", "perkName", "perkDescription"]) {
    jobValue[key] ??= template[key] ?? { incomeType: "급여", perkId: "steady-growth", perkName: "꾸준한 성장", perkDescription: "성공 행동으로 경력이 높아진다." }[key];
  }
  return jobValue;
}

export function getJobStartingState(jobValue, random = Math.random) {
  const baseline = { health: 72, energy: 76, stress: 25, fatigue: 22, charm: 48, fashion: 40, confidence: 45, work: 42, social: 40 };
  const modifiers = jobValue?.statModifiers ?? {};
  const result = { money: jobValue?.startingMoney ?? 800000 };
  for (const [key, value] of Object.entries(baseline)) {
    const jitter = Math.floor((Math.max(0, Math.min(0.999999, Number(random()) || 0)) - 0.5) * 7);
    result[key] = Math.max(0, Math.min(100, value + jitter + (modifiers[key] ?? 0)));
  }
  return result;
}

export function validateJob(jobValue) {
  return Boolean(jobValue) && typeof jobValue.id === "string" && typeof jobValue.name === "string" &&
    ["salary", "startingMoney", "incomeMultiplier", "stressRate", "growthPotential", "socialOpportunity", "promotionThreshold", "selectionWeight"].every((key) => Number.isFinite(jobValue[key]) && jobValue[key] >= 0) &&
    Boolean(jobValue.statModifiers) && Object.values(jobValue.statModifiers).every(Number.isFinite) &&
    Array.isArray(jobValue.incomeVariance) && jobValue.incomeVariance.length === 2 && jobValue.incomeVariance.every((value) => Number.isFinite(value) && value >= 0) && jobValue.incomeVariance[0] <= jobValue.incomeVariance[1] &&
    ["incomeType", "perkId", "perkName", "perkDescription"].every((key) => typeof jobValue[key] === "string" && jobValue[key].length > 0);
}
