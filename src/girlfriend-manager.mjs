const NAMES = ["서연", "하린", "지우", "다은", "소민", "유나"];
const JOBS = ["회사원", "대학생", "디자이너", "마케터", "프리랜서"];
const IMPRESSIONS = ["차분한 인상", "솔직한 성격", "자유로운 영혼", "따뜻한 미소", "도도한 분위기"];

export const PERSONALITY_KEYS = [
  "contactImportance", "jealousy", "materialism", "romanticism", "independence",
  "marriageDesire", "economicPreference", "vanity", "loyalty", "opportunism",
  "emotionalSensitivity", "giftPreference", "socialPreference"
];

export const VISIBLE_TRAITS = [
  ["contactImportance", "연락 중요도"],
  ["jealousy", "질투"],
  ["materialism", "물질성향"],
  ["opportunism", "기회주의"],
  ["marriageDesire", "결혼 의향"]
];

const ACTION_CLUES = {
  연락: ["contactImportance"],
  데이트: ["marriageDesire", "contactImportance"],
  쇼핑: ["materialism"],
  유혹: ["jealousy", "opportunism"],
  성공: ["materialism", "opportunism"],
  휴식: ["contactImportance"],
  자기관리: ["materialism", "jealousy"]
};

const randomInt = (random, min, max) => min + Math.floor(random() * (max - min + 1));

export function traitLabel(value) {
  if (value < 20) return "매우 낮음";
  if (value < 40) return "낮음";
  if (value < 60) return "보통";
  if (value < 80) return "높음";
  return "매우 높음";
}

export function generateGirlfriend(random = Math.random) {
  const personality = Object.fromEntries(PERSONALITY_KEYS.map(key => [key, randomInt(random, 8, 92)]));
  return {
    id: `girlfriend-${randomInt(random, 100000, 999999)}`,
    name: NAMES[randomInt(random, 0, NAMES.length - 1)],
    bio: `${JOBS[randomInt(random, 0, JOBS.length - 1)]} · ${IMPRESSIONS[randomInt(random, 0, IMPRESSIONS.length - 1)]}`,
    personality,
    weights: {
      contact: .65 + personality.contactImportance / 100,
      money: .55 + personality.materialism / 100,
      trust: .7 + personality.loyalty / 125
    }
  };
}

export function observePersonality(state, actionTag, random = Math.random) {
  const candidates = ACTION_CLUES[actionTag];
  if (!candidates?.length) return null;
  const key = candidates[randomInt(random, 0, candidates.length - 1)];
  const observations = state.observations ?? (state.observations = {});
  const current = observations[key] ?? { confidence: 0, samples: 0, estimate: 50 };
  const actual = state.partner.personality[key];
  const noisySample = Math.max(0, Math.min(100, actual + randomInt(random, -18, 18)));
  current.estimate = current.samples === 0 ? noisySample : (current.estimate * current.samples + noisySample) / (current.samples + 1);
  current.samples += 1;
  current.confidence = Math.min(100, current.confidence + randomInt(random, 22, 38));
  observations[key] = current;
  if (current.confidence >= 60 && !state.revealedTraits.includes(key)) state.revealedTraits.push(key);
  return { key, confidence: current.confidence, estimate: current.estimate, hint: estimateHint(current.estimate), revealed: state.revealedTraits.includes(key) };
}

export function estimateHint(estimate) {
  if (estimate < 35) return "낮은 편?";
  if (estimate > 65) return "높은 편?";
  return "보통에 가까움?";
}

export function getVisibleTraitRows(state) {
  return VISIBLE_TRAITS.map(([key, name]) => {
    const observation = state.observations?.[key];
    const revealed = state.revealedTraits?.includes(key);
    return { key, name, value: revealed ? traitLabel(state.partner.personality[key]) : "???", confidence: observation?.confidence ?? 0, hint: observation ? estimateHint(observation.estimate ?? 50) : "", revealed };
  });
}
