export const PHASES = [
  { key:"morning", label:"MORNING · 아침", time:"08:00", icon:"☀", title:"새로운 하루의 시작", text:"연인의 메시지와 함께 아침이 밝았다. 오늘의 첫 선택은?" },
  { key:"day", label:"DAYTIME · 낮", time:"12:30", icon:"◐", title:"바쁜 하루의 한가운데", text:"업무도 관계도 놓칠 수 없다. 점심시간을 어떻게 보낼까?" },
  { key:"evening", label:"EVENING · 저녁", time:"19:00", icon:"◇", title:"퇴근 후의 선택", text:"하루 중 가장 자유로운 시간. 누구와 무엇을 할지 선택하자." },
  { key:"night", label:"NIGHT · 밤", time:"23:20", icon:"☾", title:"하루가 끝나기 전에", text:"잠들기 전, 오늘을 마무리할 마지막 시간이 남았다." }
];

export const ACTIONS = {
  morning: [
    { id:"morning-contact", icon:"💬", title:"다정하게 연락하기", desc:"좋은 아침 인사로 서로의 하루를 시작한다.", costLabel:"시간 1", timeCost:1, effects:{ affection:16, trust:10, energy:-3 }, tag:"연락" },
    { id:"morning-gym", icon:"🏃", title:"아침 운동", desc:"가볍게 뛰며 몸과 자신감을 관리한다.", costLabel:"시간 1", timeCost:1, requirements:[{ stat:"energy", operator:">=", value:12, message:"체력 12 이상 필요" }], effects:{ health:8, charm:5, confidence:5, fatigue:4, energy:-7, stress:-4 }, tag:"자기관리" },
    { id:"sleep-in", icon:"🛌", title:"조금 더 자기", desc:"피로를 풀지만 출근 준비는 아슬아슬하다.", costLabel:"시간 1", timeCost:1, effects:{ energy:15, fatigue:-14, work:-4, stress:-5 }, tag:"휴식" },
    { id:"early-work", icon:"☕", title:"일찍 출근하기", desc:"커피 한 잔과 함께 업무를 먼저 시작한다.", costLabel:"수입 +₩25,000", timeCost:1, effects:{ money:25000, work:8, energy:-8, fatigue:7, stress:5 }, tag:"성공" },
    { id:"manager-feedback", icon:"🗣️", title:"상사와 1:1 피드백", desc:"업무 조언을 얻어 성장 방향을 다듬는다.", costLabel:"스트레스 +2", timeCost:1, effects:{ work:7, confidence:4, stress:2, energy:-4 }, tag:"성장" }
  ],
  day: [
    { id:"focused-work", icon:"💼", title:"업무에 집중하기", desc:"성과를 내고 수입과 능력을 높인다.", costLabel:"수입 +₩45,000", timeCost:1, effects:{ money:45000, work:10, energy:-10, fatigue:9, stress:8, affection:-4 }, tag:"성공" },
    { id:"lunch-date", icon:"🍝", title:"연인과 점심", desc:"잠깐이라도 얼굴을 보며 함께 식사한다.", costLabel:"₩38,000", timeCost:1, requirements:[{ stat:"money", operator:">=", value:38000, message:"자산 ₩38,000 이상 필요" }], effects:{ money:-38000, affection:22, trust:8, stress:-7 }, tag:"데이트" },
    { id:"coworker-lunch", icon:"👥", title:"동료와 점심", desc:"회사 사람들과 가까워지고 정보를 얻는다.", costLabel:"₩14,000", timeCost:1, effects:{ money:-14000, social:9, work:4, affection:-2 }, tag:"인간관계" },
    { id:"stock-check", icon:"📈", title:"주식 확인하기", desc:"변동성 있는 시장에 작은 승부를 건다.", costLabel:"위험", timeCost:1, random:true, effects:{ stress:5 }, tag:"투자" }
  ],
  evening: [
    { id:"dinner-date", icon:"🌙", title:"근사한 데이트", desc:"예약해 둔 레스토랑에서 특별한 저녁을 보낸다.", costLabel:"₩120,000", timeCost:1, requirements:[{ stat:"money", operator:">=", value:120000, message:"자산 ₩120,000 이상 필요" },{ stat:"energy", operator:">=", value:10, message:"체력 10 이상 필요" }], effects:{ money:-120000, affection:42, trust:12, stress:-12, energy:-8 }, tag:"데이트" },
    { id:"gift-shopping", icon:"🛍️", title:"선물 쇼핑", desc:"그녀가 좋아할 만한 작은 선물을 고른다.", costLabel:"₩75,000", timeCost:1, itemId:"rose-parfum", itemOwner:"gift", autoGift:true, effects:{ money:-75000, charm:3, confidence:2 }, tag:"쇼핑" },
    { id:"overtime", icon:"🌃", title:"야근하기", desc:"관계보다 오늘의 성과를 선택한다.", costLabel:"수입 +₩70,000", timeCost:1, effects:{ money:70000, work:12, affection:-12, energy:-16, fatigue:16, stress:12 }, tag:"성공" },
    { id:"coworker-drinks", icon:"🍻", title:"동료의 술자리", desc:"새로운 인맥, 혹은 위험한 인연이 시작될 수 있다.", costLabel:"₩45,000 · 위험", timeCost:1, effects:{ money:-45000, social:12, trust:-8, stress:-8 }, tag:"유혹" }
  ],
  night: [
    { id:"night-call", icon:"♥", title:"통화하며 하루 마무리", desc:"오늘 있었던 일을 솔직하게 나눈다.", costLabel:"시간 1", timeCost:1, effects:{ affection:20, trust:18, energy:-5 }, tag:"연락" },
    { id:"short-message", icon:"📱", title:"짧게 메시지만", desc:"바쁘다는 핑계로 간단한 인사만 남긴다.", costLabel:"시간 0", timeCost:0, effects:{ affection:3, trust:1 }, tag:"연락" },
    { id:"online-shopping", icon:"🛒", title:"온라인 쇼핑", desc:"새 옷으로 패션과 기분을 챙긴다.", costLabel:"₩55,000", timeCost:1, itemId:"linen-shirt", itemOwner:"player", requirements:[{ stat:"money", operator:">=", value:55000, message:"자산 ₩55,000 이상 필요" }], effects:{ money:-55000, charm:8, fashion:8, confidence:4, stress:-5 }, tag:"쇼핑" },
    { id:"early-sleep", icon:"💤", title:"일찍 잠들기", desc:"내일을 위해 충분히 휴식한다.", costLabel:"시간 1", timeCost:1, effects:{ energy:20, health:5, fatigue:-18, stress:-8, affection:-5 }, tag:"휴식" }
  ]
};

Object.assign(ACTIONS.evening.find(action=>action.id==="dinner-date"),{excludedHeroineIds:["yuna"]});
Object.assign(ACTIONS.evening.find(action=>action.id==="coworker-drinks"),{excludedHeroineIds:["yuna"]});
ACTIONS.day.push({id:"yuna-library-study",icon:"📚",title:"유나와 도서관 공부",desc:"시험과 진로 이야기를 나누며 함께 문제를 푼다.",costLabel:"₩8,000",timeCost:1,heroineIds:["yuna"],requirements:[{stat:"money",operator:">=",value:8000,message:"자산 ₩8,000 이상 필요"}],effects:{money:-8000,affection:14,trust:14,stress:-4,energy:-4},tag:"데이트"});
ACTIONS.evening.push({id:"yuna-after-school-snack",icon:"🍢",title:"유나와 방과 후 분식",desc:"분식집에서 오늘 학교에서 있었던 일을 듣는다.",costLabel:"₩16,000",timeCost:1,heroineIds:["yuna"],requirements:[{stat:"money",operator:">=",value:16000,message:"자산 ₩16,000 이상 필요"}],effects:{money:-16000,affection:20,trust:9,excitement:8,stress:-7},tag:"데이트"});

export function validateActionData(actions = ACTIONS, phases = PHASES) {
  const ids = new Set();
  return phases.every(phase => Array.isArray(actions[phase.key]) && actions[phase.key].every(action => {
    const requirementsValid = (action.requirements ?? []).every(item => typeof item.stat === "string" && typeof item.operator === "string" && Number.isFinite(item.value) && typeof item.message === "string");
    const valid = typeof action.id === "string" && !ids.has(action.id) && typeof action.title === "string" && typeof action.desc === "string" && typeof action.costLabel === "string" && Number.isFinite(action.timeCost) && typeof action.tag === "string" && action.effects && Object.values(action.effects).every(Number.isFinite) && requirementsValid;
    ids.add(action.id);
    return valid;
  }));
}
