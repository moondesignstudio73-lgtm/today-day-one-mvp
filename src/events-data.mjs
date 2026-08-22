import { SITUATION_EVENTS } from "./situation-events-data.mjs";

const BASE_EVENT_DEFINITIONS = [
  {
    id: "sudden-overtime",
    title: "퇴근 직전의 긴급 업무",
    message: "상사가 오늘 안에 끝내야 할 일이 생겼다며 갑작스러운 야근을 부탁했다.",
    conditions: [{ stat: "day", operator: ">=", value: 3 }, { stat: "energy", operator: ">=", value: 18 }],
    probability: 0.11,
    probabilityModifiers: [
      { conditions: [{ stat: "work", operator: ">=", value: 65 }], add: 0.08 },
      { conditions: [{ recentTag: "성공", withinDays: 3, minCount: 3 }], add: 0.12 }
    ],
    priority: 45,
    cooldown: 5,
    effects: { money: 50000, work: 6, energy: -12, stress: 10, affection: -7, relationshipStress: 4 }
  },
  {
    id: "ex-contact",
    title: "오랜만이야, 잘 지내?",
    message: "한동안 소식이 없던 전 연인에게서 짧은 메시지가 도착했다.",
    conditions: [{ stat: "day", operator: ">=", value: 6 }, { stat: "social", operator: ">=", value: 35 }],
    probability: 0.07,
    probabilityModifiers: [
      { conditions: [{ stat: "partner.personality.jealousy", operator: ">=", value: 70 }], add: 0.1 },
      { conditions: [{ recentTag: "유혹", withinDays: 4, minCount: 1 }], add: 0.12 }
    ],
    priority: 60,
    cooldown: 10,
    effects: { trust: -8, conflict: 7, relationshipStress: 9, excitement: 3 }
  },
  {
    id: "date-cancelled",
    title: "오늘은 만나기 어려울 것 같아",
    message: "기대하던 약속이 갑자기 취소됐다. 짧은 답장 뒤로 묘한 거리감이 남았다.",
    conditions: [{ stat: "day", operator: ">=", value: 4 }, { stat: "affection", operator: ">=", value: 380 }],
    probability: 0.08,
    probabilityModifiers: [
      { conditions: [{ stat: "relationshipStress", operator: ">=", value: 50 }], add: 0.15 },
      { conditions: [{ stat: "partner.personality.independence", operator: ">=", value: 75 }], add: 0.08 }
    ],
    priority: 50,
    cooldown: 6,
    effects: { affection: -9, excitement: -12, stress: 5, relationshipStress: 5 }
  },
  {
    id: "relationship-crisis",
    title: "우리, 잠깐 이야기할까?",
    message: "쌓여 온 감정이 터졌다. 연인이 관계를 계속해야 할지 모르겠다고 말했다.",
    conditions: [{ stat: "day", operator: ">=", value: 10 }, { stat: "affection", operator: "<=", value: 340 }, { stat: "relationshipStress", operator: ">=", value: 45 }],
    probability: 0.48,
    probabilityModifiers: [
      { conditions: [{ stat: "partner.personality.loyalty", operator: "<=", value: 35 }], add: 0.2 },
      { conditions: [{ stat: "conflict", operator: ">=", value: 70 }], add: 0.18 },
      { conditions: [{ recentTag: "유혹", withinDays: 5, minCount: 2 }], add: 0.2 }
    ],
    priority: 100,
    cooldown: 5,
    effects: { affection: -28, trust: -20, conflict: 18, relationshipStress: 15, excitement: -18 }
  },
  {
    id: "rival-approach",
    title: "낯선 이름의 알림",
    message: "연인에게 호감을 보이는 사람이 가까이 다가오기 시작했다.",
    conditions: [{ stat: "day", operator: ">=", value: 8 }, { stat: "trust", operator: "<=", value: 430 }, { stat: "relationshipStress", operator: ">=", value: 35 }],
    probability: 0.22,
    probabilityModifiers: [
      { conditions: [{ stat: "partner.personality.opportunism", operator: ">=", value: 70 }], add: 0.22 },
      { conditions: [{ stat: "partner.personality.loyalty", operator: "<=", value: 35 }], add: 0.18 },
      { conditions: [{ recentTag: "성공", withinDays: 3, minCount: 4 }], add: 0.12 }
    ],
    priority: 85,
    cooldown: 6,
    effects: { trust: -12, relationshipStress: 12, conflict: 6 }
  },
  {
    id: "work-mistake",
    title: "집중력이 흐려진 오후",
    message: "쌓인 스트레스 때문에 회사에서 작은 실수를 했다.",
    conditions: [{ stat: "stress", operator: ">=", value: 75 }, { stat: "day", operator: ">=", value: 3 }],
    probability: 0.38,
    probabilityModifiers: [
      { conditions: [{ stat: "energy", operator: "<=", value: 25 }], add: 0.2 },
      { conditions: [{ stat: "health", operator: "<=", value: 40 }], add: 0.12 },
      { conditions: [{ recentTag: "성공", withinDays: 2, minCount: 4 }], add: 0.18 }
    ],
    priority: 80,
    cooldown: 3,
    effects: { work: -7, stress: 6, money: -20000 }
  },
  {
    id: "relationship-suspicion",
    title: "짧고 차가운 답장",
    message: "최근의 거리감 때문에 연인이 당신의 마음을 의심하기 시작했다.",
    conditions: [{ stat: "trust", operator: "<=", value: 360 }, { stat: "day", operator: ">=", value: 4 }],
    probability: 0.42,
    probabilityModifiers: [
      { conditions: [{ stat: "partner.personality.jealousy", operator: ">=", value: 70 }], add: 0.18 },
      { conditions: [{ stat: "partner.personality.emotionalSensitivity", operator: ">=", value: 70 }], add: 0.12 },
      { conditions: [{ stat: "conflict", operator: ">=", value: 45 }], add: 0.15 },
      { conditions: [{ recentTag: "유혹", withinDays: 3, minCount: 1 }], add: 0.25 }
    ],
    priority: 90,
    cooldown: 3,
    effects: { affection: -14, trust: -9, relationshipStress: 10, conflict: 7 }
  },
  {
    id: "surprise-date",
    title: "갑작스러운 데이트 제안",
    message: "연인이 오늘 잠깐이라도 보고 싶다며 먼저 연락해 왔다.",
    conditions: [{ stat: "affection", operator: ">=", value: 650 }, { stat: "energy", operator: ">=", value: 25 }],
    probability: 0.18,
    probabilityModifiers: [
      { conditions: [{ stat: "partner.personality.romanticism", operator: ">=", value: 70 }], add: 0.16 },
      { conditions: [{ stat: "excitement", operator: ">=", value: 700 }], add: 0.1 },
      { conditions: [{ recentTag: "데이트", withinDays: 3, minCount: 2 }], add: 0.12 }
    ],
    priority: 55,
    cooldown: 4,
    effects: { affection: 12, excitement: 9, energy: -4 }
  },
  {
    id: "unexpected-expense",
    title: "예상 밖의 지출",
    message: "미뤄 두었던 생활비를 한꺼번에 결제해야 했다.",
    conditions: [{ stat: "money", operator: ">=", value: 120000 }],
    probability: 0.08,
    probabilityModifiers: [
      { conditions: [{ stat: "money", operator: ">=", value: 1500000 }], multiply: 1.5 }
    ],
    priority: 30,
    cooldown: 6,
    effects: { money: -65000, stress: 5 }
  },
  {
    id: "caught-cold",
    title: "몸살 기운",
    message: "무리한 일정 끝에 감기 기운이 찾아왔다. 당분간 휴식이 필요하다.",
    conditions: [{ stat: "health", operator: "<=", value: 38 }, { stat: "energy", operator: "<=", value: 35 }],
    probability: 0.5,
    probabilityModifiers: [
      { conditions: [{ stat: "stress", operator: ">=", value: 80 }], add: 0.25 }
    ],
    priority: 75,
    cooldown: 5,
    effects: { health: -6, energy: -12, stress: 8 }
  },
  {
    id: "small-windfall",
    title: "뜻밖의 행운",
    message: "잊고 있던 경품 이벤트에 당첨되어 작은 보너스를 받았다.",
    conditions: [{ stat: "day", operator: ">=", value: 5 }],
    probability: 0.035,
    probabilityModifiers: [
      { conditions: [{ stat: "money", operator: "<=", value: 150000 }], multiply: 1.8 }
    ],
    priority: 15,
    cooldown: 12,
    effects: { money: 180000, stress: -8 }
  }
];

export const EVENT_DEFINITIONS=[...BASE_EVENT_DEFINITIONS.map(event=>({...event,kind:"micro"})),...SITUATION_EVENTS.map(event=>({...event,kind:"story"}))];

const VALID_OPERATORS = new Set([">=", "<=", ">", "<", "=="]);

function validateCondition(condition) {
  if (condition.recentTag) return typeof condition.recentTag === "string" && Number.isInteger(condition.withinDays) && condition.withinDays >= 0 && Number.isInteger(condition.minCount ?? 1) && (condition.minCount ?? 1) > 0;
  return typeof condition.stat === "string" && VALID_OPERATORS.has(condition.operator) && Number.isFinite(condition.value);
}

export function validateEventData(definitions = EVENT_DEFINITIONS) {
  const ids = new Set();
  return definitions.every(event => {
    if (typeof event.id !== "string" || ids.has(event.id)) return false;
    ids.add(event.id);
    const modifiersValid = (event.probabilityModifiers ?? []).every(modifier =>
      Array.isArray(modifier.conditions) && modifier.conditions.every(validateCondition) &&
      (Number.isFinite(modifier.add) || Number.isFinite(modifier.multiply))
    );
    return typeof event.title === "string" && typeof event.message === "string" &&
      Array.isArray(event.conditions) && event.conditions.every(validateCondition) &&
      Number.isFinite(event.probability) && event.probability >= 0 && event.probability <= 1 &&
      Number.isFinite(event.priority) && Number.isInteger(event.cooldown) && event.cooldown >= 0 &&
      event.effects && Object.values(event.effects).every(Number.isFinite) && modifiersValid;
  });
}
