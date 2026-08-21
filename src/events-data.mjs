export const EVENT_DEFINITIONS = [
  {
    id: "work-mistake",
    title: "집중력이 흐려진 오후",
    message: "쌓인 스트레스 때문에 회사에서 작은 실수를 했다.",
    conditions: [{ stat: "stress", operator: ">=", value: 75 }, { stat: "day", operator: ">=", value: 3 }],
    probability: 0.38,
    probabilityModifiers: [
      { conditions: [{ stat: "energy", operator: "<=", value: 25 }], add: 0.2 },
      { conditions: [{ stat: "health", operator: "<=", value: 40 }], add: 0.12 }
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
      { conditions: [{ stat: "conflict", operator: ">=", value: 45 }], add: 0.15 }
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
      { conditions: [{ stat: "excitement", operator: ">=", value: 700 }], add: 0.1 }
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
