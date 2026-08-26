import { applyEffects } from "./game-core.mjs";
import { analyzeRelationshipState } from "./dynamic-story-director.mjs";
import { EVENT_DEFINITIONS } from "./events-data.mjs";
import { MICRO_EVENTS } from "./micro-event-manager.mjs";
import { activateSituationEvent } from "./situation-event-manager.mjs";

export const FREE_MODE_EVENT_CATALOG=Object.freeze([...EVENT_DEFINITIONS,...MICRO_EVENTS]);

const DAY2_HOME_CHECK_IN=Object.freeze({
  id:"context-day2-home-haeun-check-in",title:"예비폰으로 온 안부",category:"romance",categoryLabel:"스토리 공용 이벤트",
  hook:"현관문이 닫힌 뒤, 하은과 병원 번호만 저장된 예비폰이 짧게 울렸다.",
  message:"하은이 문을 잠갔는지와 어지럼은 없는지만 확인해 달라고 했다.",question:"첫 저녁의 안전 확인을 어떻게 남길까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[2,2],heroineIds:["haeun"],
  relationshipStates:["DISTANT","RECOVERING","STABLE","HONEYMOON","PASSIONATE"],requiredFeatures:["haeun-contact"],requiredStoryFlags:["day2RuntimeComplete"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:200,baseWeight:100,tensionLevel:"low",effects:{trust:1},
  storyFlag:"context-day2-home-haeun-check-in:COMPLETED",forbiddenFlags:["context-day2-home-haeun-check-in:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},
  presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day2-home-haeun-check-in-scene",title:"예비폰으로 온 안부",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"soft",timeOfDay:"evening",weather:"sunny",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"예비폰 화면에는 ‘이하은’과 병원 번호만 있었다. 새 메시지는 하은에게서 왔다."},
    {type:"dialogue",speaker:"하은",text:"문 잠갔어? 어지럽거나 숨찬 건 없고? 답은 짧게 해도 돼.",expressionId:"worried"},
    {type:"dialogue",speaker:"나",text:"문은 잠갔고, 지금은 괜찮아. 오늘 확인한 것만 정리하고 쉴게."},
    {type:"dialogue",speaker:"하은",text:"좋아. 이상하면 나보다 병원 먼저. 그 순서만 지켜 줘.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"연락처가 적은 예비폰은 불편했지만, 지금 필요한 경계는 분명했다."}
  ]}],
  choices:[
    {id:"confirm-and-rest",label:"현재 증상만 답하고 바로 쉰다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,health:2,stress:-3},response:"필요한 사실만 확인한 답이 서로의 안전 기준이 되었다.",flag:"context-day2-home-haeun-check-in:REST",memory:"DAY 2 첫 저녁에 하은과 증상·연락 순서를 확인하고 쉬었다.",futureEventWeights:{recovery:1.15}},
    {id:"share-checklist",label:"문·약·비상 연락 순서를 체크리스트로 공유한다",preferenceTags:["PLANNED","LOGICAL"],effects:{trust:7,confidence:2},response:"짧은 체크리스트가 감시가 아니라 합의된 안전장치로 남았다.",flag:"context-day2-home-haeun-check-in:CHECKLIST",memory:"DAY 2 첫 저녁의 안전 확인 순서를 하은과 체크리스트로 합의했다.",futureEventWeights:{recovery:1.2}}
  ],futureEventWeights:{romance:1.05},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY3_DISCHARGE_CHECK=Object.freeze({
  id:"context-day3-discharge-safety-check",title:"마지막 퇴원 확인",category:"health",categoryLabel:"스토리 공용 이벤트",
  hook:"복구한 휴대폰에 병원 안내 알림이 한 건 도착했다.",message:"퇴원 창구에서 복약·외래·비상 연락 확인을 완료해 달라는 안내가 왔다.",question:"병원을 나서기 전 무엇을 마지막 기준으로 남길까?",
  allowedLocations:["hospital"],allowedPhases:["day"],dayRange:[3,3],heroineIds:["haeun"],
  requiredFeatures:["smartphone-basic"],requiredStoryFlags:["day3RuntimeComplete"],cooldown:30,maxTriggerCount:1,probability:.35,priority:210,baseWeight:100,tensionLevel:"low",effects:{health:1},
  storyFlag:"context-day3-discharge-safety-check:COMPLETED",forbiddenFlags:["context-day3-discharge-safety-check:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-hospital-lobby-day-v1.png",result:"assets/backgrounds/day2/day2-hospital-exit-day-v1.png",status:"ready"},
  presentation:{backgroundId:"day2-hospital-lobby",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day3-discharge-safety-check-scene",title:"마지막 퇴원 확인",backgroundId:"day2-hospital-lobby",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"daylight",timeOfDay:"day",weather:"sunny",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"병실을 나서기 직전, 복구한 휴대폰에 병원 안내 알림이 한 건 도착했다."},
    {type:"dialogue",speaker:"하은",text:"과거 알림은 안 열어도 돼. 지금 온 퇴원 확인만 같이 볼까?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"약, 외래 일정, 이상 증상 연락 순서. 이 세 가지만 확인할게."},
    {type:"dialogue",speaker:"하은",text:"좋아. 이동 중에는 네가 상태를 말하고, 나는 속도만 맞출게.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"휴대폰은 과거를 한꺼번에 여는 열쇠가 아니라, 오늘의 안전을 기록하는 도구가 되었다."}
  ]}],
  choices:[
    {id:"save-hospital-first",label:"병원 번호를 첫 비상 연락처로 고정한다",preferenceTags:["PRACTICAL","BOUNDARY"],effects:{health:3,trust:4,stress:-2},response:"증상이 생기면 병원부터 연락한다는 순서를 둘이 다시 확인했다.",flag:"context-day3-discharge-safety-check:HOSPITAL_FIRST",memory:"DAY 3 퇴원 전 병원 우선 연락 원칙을 휴대폰에 남겼다.",futureEventWeights:{recovery:1.2}},
    {id:"save-rest-threshold",label:"이동 중 멈출 증상 기준을 메모한다",preferenceTags:["PLANNED","LOGICAL"],effects:{confidence:4,health:2,trust:3},response:"어지럼과 새 통증이 생기면 즉시 멈춘다는 기준을 메모에 남겼다.",flag:"context-day3-discharge-safety-check:REST_THRESHOLD",memory:"DAY 3 귀가 중 멈춰야 할 증상 기준을 하은과 합의했다.",futureEventWeights:{recovery:1.15}}
  ],futureEventWeights:{health:1.1},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY4_HOME_LEDGER_REVIEW=Object.freeze({
  id:"context-day4-home-ledger-review",title:"세 칸의 빈자리",category:"romance",categoryLabel:"스토리 공용 이벤트",
  hook:"하은이 돌아가기 전, 증언 장부의 비어 있는 한 칸을 가리켰다.",message:"확인되지 않은 말을 어디까지 함께 보관할지 정해야 했다.",question:"오늘의 마지막 기록을 어떤 방식으로 남길까?",
  allowedLocations:["home"],allowedPhases:["night"],dayRange:[4,4],heroineIds:["haeun"],requiredFeatures:["testimony-ledger"],requiredStoryFlags:["day4RuntimeComplete"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:220,baseWeight:100,tensionLevel:"low",effects:{trust:1},
  storyFlag:"context-day4-home-ledger-review:COMPLETED",forbiddenFlags:["context-day4-home-ledger-review:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/home/BG_HOME_NIGHT_001.webp",result:"assets/backgrounds/home/BG_HOME_NIGHT_001.webp",status:"ready"},
  presentation:{backgroundId:"home-night",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day4-home-ledger-review-scene",title:"세 칸의 빈자리",backgroundId:"home-night",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"night",timeOfDay:"night",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"하은이 돌아가기 전, 증언 장부의 ‘미확인’ 칸에서 펜을 멈췄다."},
    {type:"dialogue",speaker:"하은",text:"여기 적힌 말들, 내가 아는 내용으로 채우지 않는 게 맞지?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"응. 겹치는 사실은 표시하되 빈칸을 없애려고 하지는 말자."},
    {type:"dialogue",speaker:"하은",text:"좋아. 모르는 걸 같이 견디는 것도 지금 우리 방식으로 할게.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"장부의 빈칸은 실패가 아니라, 다음 확인 전까지 지켜야 할 경계로 남았다."}
  ]}],
  choices:[
    {id:"mark-shared-facts",label:"둘이 직접 확인한 사실에만 공동 표시한다",preferenceTags:["BOUNDARY","LOGICAL"],effects:{trust:6,confidence:3,stress:-2},response:"같이 확인한 사실에만 작은 표시를 남기고 나머지는 각자의 기억으로 두었다.",flag:"context-day4-home-ledger-review:SHARED_FACTS",memory:"DAY 4 밤, 하은과 직접 확인한 사실만 증언 장부에 공동 표시했다.",futureEventWeights:{investigation:1.2}},
    {id:"close-ledger-together",label:"미확인 칸은 그대로 두고 함께 장부를 덮는다",preferenceTags:["EMPATHY","PRACTICAL"],effects:{trust:5,affection:3,stress:-4},response:"답을 억지로 채우지 않고 오늘의 확인은 여기까지라고 합의했다.",flag:"context-day4-home-ledger-review:CLOSE_TOGETHER",memory:"DAY 4 밤, 미확인 증언을 남겨 둔 채 하은과 장부를 덮었다.",futureEventWeights:{romance:1.15}}
  ],futureEventWeights:{romance:1.05,investigation:1.1},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY5_OFFICE_HANDOFF=Object.freeze({
  id:"context-day5-office-seojin-handoff",title:"파란 파일의 다음 칸",category:"work",categoryLabel:"스토리 공용 이벤트",
  hook:"퇴근 직전 서진이 파란 파일에 빈 인덱스 한 장을 끼워 두었다.",message:"다음 방문에서 확인할 현재 자료의 범위만 함께 정하자는 제안이었다.",question:"첫 복귀의 마지막 업무 경계를 어떻게 남길까?",
  allowedLocations:["office"],allowedPhases:["evening"],dayRange:[5,5],heroineIds:["haeun"],requiredFeatures:["day5-work-trial","seojin-basic"],requiredStoryFlags:["day5RuntimeComplete"],npcRequirements:["female-coworker"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:230,baseWeight:100,tensionLevel:"low",effects:{work:1},
  storyFlag:"context-day5-office-seojin-handoff:COMPLETED",forbiddenFlags:["context-day5-office-seojin-handoff:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/office/BG_OFFICE_DAY_001.webp",result:"assets/backgrounds/office/BG_OFFICE_DAY_001.webp",status:"ready"},
  presentation:{backgroundId:"office-day",characterId:"female-coworker",expressionId:"calm-attentive",poseId:"standing"},
  scenes:[{id:"context-day5-office-seojin-handoff-scene",title:"파란 파일의 다음 칸",backgroundId:"office-day",characterIds:["female-coworker"],expression:"calm",pose:"standing",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"office",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"퇴근 준비를 마치자 서진이 파란 파일에 빈 인덱스 한 장만 끼워 내 쪽에 놓았다."},
    {type:"dialogue",speaker:"윤서진",text:"오늘 결론 말고, 다음에 열 자료의 범위만 같이 적어도 될까요?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"현재 수치와 담당자 기록까지만. 과거 판단 파일은 내가 다시 동의할 때 열죠."},
    {type:"dialogue",speaker:"윤서진",text:"좋아요. 빈칸은 제가 추측해서 채우지 않을게요.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"다음 업무는 기억을 시험하는 자리가 아니라, 확인 범위를 다시 합의하는 약속으로 남았다."}
  ]}],
  choices:[
    {id:"schedule-current-data",label:"현재 수치·담당자 기록만 다음 자료로 지정한다",preferenceTags:["LOGICAL","PLANNED"],effects:{work:5,confidence:3,stress:-2},response:"다음 방문에는 현재 자료 두 항목만 열기로 문서에 남겼다.",flag:"context-day5-office-seojin-handoff:CURRENT_DATA",memory:"DAY 5 퇴근 전 서진과 다음에 확인할 현재 자료 범위를 문서로 합의했다.",futureEventWeights:{work:1.2}},
    {id:"schedule-boundary-review",label:"자료보다 먼저 시간·중단 기준을 다시 확인한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{health:2,trust:3,work:3,stress:-3},response:"다음 방문도 시간과 중단 기준을 확인한 뒤 자료를 열기로 했다.",flag:"context-day5-office-seojin-handoff:BOUNDARY_FIRST",memory:"DAY 5 퇴근 전 다음 업무의 시간과 중단 기준을 서진과 먼저 합의했다.",futureEventWeights:{recovery:1.15,work:1.1}}
  ],futureEventWeights:{work:1.15},requiredMemories:[],requiredEvents:[],kind:"story",sourceMode:"free-romance"
});

const DAY6_HOME_PAYMENT_BOUNDARY=Object.freeze({
  id:"context-day6-home-payment-boundary",title:"영수증의 주인",category:"daily",categoryLabel:"스토리 공용 이벤트",
  hook:"장바구니에서 임시 결제 영수증이 미끄러져 나왔다.",message:"하은의 예비 계정으로 결제한 생활비를 지금 어떤 상태로 기록할지 정해야 했다.",question:"아직 복구되지 않은 돈의 경계를 어떻게 남길까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[6,6],heroineIds:["haeun"],requiredFeatures:["current-life-map"],requiredStoryFlags:["day6RuntimeComplete","day6CurrentLifeRadiusSaved"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:240,baseWeight:100,tensionLevel:"low",effects:{confidence:1},
  storyFlag:"context-day6-home-payment-boundary:COMPLETED",forbiddenFlags:["context-day6-home-payment-boundary:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},
  presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day6-home-payment-boundary-scene",title:"영수증의 주인",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"장바구니를 정리하자 하은의 예비 계정으로 결제한 영수증이 식탁 아래로 미끄러졌다."},
    {type:"dialogue",speaker:"하은",text:"지금 바로 갚을 돈으로 적으면 네 계좌도 모르는데 부담만 생길 것 같아.",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"소유권 미확인 임시 결제로 남기자. 복구 뒤 정산 여부를 다시 정하고."},
    {type:"dialogue",speaker:"하은",text:"좋아. 오늘 장본 걸 우리 관계의 빚으로 만들지는 말자.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"영수증에는 결론 대신 날짜와 결제 계정, 다시 확인할 조건만 남았다."}
  ]}],
  choices:[
    {id:"record-without-debt",label:"임시 결제로 기록하고 빚으로 확정하지 않는다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,confidence:4,stress:-3},response:"금액은 기록하되 관계의 빚이나 공동 자산으로 단정하지 않았다.",flag:"context-day6-home-payment-boundary:UNCONFIRMED",memory:"DAY 6 임시 생활비를 소유권 미확인 결제로 기록했다.",futureEventWeights:{money:1.15}},
    {id:"separate-receipts",label:"각자 고른 물건과 공동 생활품 영수증을 분리한다",preferenceTags:["LOGICAL","PLANNED"],effects:{trust:4,confidence:5,stress:-2},response:"개인 선택과 공동 생활품을 나눠 훗날 확인할 기준을 만들었다.",flag:"context-day6-home-payment-boundary:SEPARATED",memory:"DAY 6 장보기 영수증을 개인 선택과 공동 생활품으로 분리했다.",futureEventWeights:{money:1.2}}
  ],futureEventWeights:{money:1.1,romance:1.05},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY7_HOME_DATE_MEMORY=Object.freeze({
  id:"context-day7-home-date-memory",title:"오늘 것만 남긴 사진",category:"romance",categoryLabel:"스토리 공용 이벤트",
  hook:"하은이 책과 영수증만 담긴 사진의 제목 입력란을 열었다.",message:"과거를 증명하지 않으면서 오늘의 데이트를 어떤 이름으로 남길지 정할 차례였다.",question:"첫 현재형 데이트의 기록을 어떻게 보관할까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[7,7],heroineIds:["haeun"],requiredFeatures:["review-present-date-memory"],requiredStoryFlags:["day7RuntimeComplete","day7FirstPresentDateCompleted"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:250,baseWeight:100,tensionLevel:"low",effects:{affection:1},
  storyFlag:"context-day7-home-date-memory:COMPLETED",forbiddenFlags:["context-day7-home-date-memory:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},
  presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"smile",poseId:"phone"},
  scenes:[{id:"context-day7-home-date-memory-scene",title:"오늘 것만 남긴 사진",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"smile",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"하은이 책과 영수증, 접힌 지도만 담긴 사진의 제목 입력란을 열었다."},
    {type:"dialogue",speaker:"하은",text:"과거 데이트 증거 말고, 오늘 우리가 바꾼 걸 기억하는 제목이면 좋겠어.",expressionId:"smile"},
    {type:"dialogue",speaker:"나",text:"계획보다 잘한 날보다, 같이 멈추고 바꾼 날이 정확해."},
    {type:"dialogue",speaker:"하은",text:"응. 지친 얼굴은 없고, 오늘 고른 것과 바꾼 규칙만 남기자.",expressionId:"calm"},
    {type:"narration",speaker:"내레이션",text:"사진은 잃어버린 과거를 대신하지 않고, 오늘 함께 만든 선택의 출처가 되었다."}
  ]}],
  choices:[
    {id:"title-shared-change",label:"‘같이 멈추고 바꾼 날’로 제목을 붙인다",preferenceTags:["EMPATHY","BOUNDARY"],effects:{affection:6,trust:5,stress:-3},response:"계획 변경을 실패가 아닌 함께 지킨 규칙으로 사진에 남겼다.",flag:"context-day7-home-date-memory:SHARED_CHANGE",memory:"DAY 7 데이트 사진을 ‘같이 멈추고 바꾼 날’로 저장했다.",futureEventWeights:{romance:1.2}},
    {id:"store-private-album",label:"공개하지 않는 현재형 데이트 앨범에만 보관한다",preferenceTags:["PRACTICAL","PRIVATE"],effects:{trust:6,confidence:3,stress:-2},response:"사진을 과거 관계의 증거로 공유하지 않고 둘만의 현재 기록으로 보관했다.",flag:"context-day7-home-date-memory:PRIVATE_ALBUM",memory:"DAY 7 첫 현재형 데이트 사진을 비공개 공동 기록으로 보관했다.",futureEventWeights:{romance:1.15}}
  ],futureEventWeights:{romance:1.15,recovery:1.1},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY8_HOME_MAIL_DEADLINE=Object.freeze({
  id:"context-day8-home-mail-deadline",title:"우편 봉투의 기한",category:"daily",categoryLabel:"스토리 공용 이벤트",
  hook:"첫 독립 심부름에서 가져온 우편 봉투의 처리 기한이 눈에 들어왔다.",message:"과거의 수취 관계를 추측하지 않고 현재 확인 가능한 정보만 정리해야 했다.",question:"이 우편을 어떤 기준으로 처리할까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[8,8],heroineIds:["haeun"],requiredFeatures:["review-current-mail"],requiredStoryFlags:["day8RuntimeComplete","day8IndependentErrandCompleted"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:260,baseWeight:100,tensionLevel:"low",effects:{confidence:1},storyFlag:"context-day8-home-mail-deadline:COMPLETED",forbiddenFlags:["context-day8-home-mail-deadline:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day8-home-mail-deadline-scene",title:"우편 봉투의 기한",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"식탁에 올려 둔 우편 봉투에는 현재 주소와 발송일, 그리고 가까운 처리 기한이 적혀 있었다."},
    {type:"dialogue",speaker:"하은",text:"이름이 익숙해도 내가 과거 관계를 대신 설명하지는 않을게. 지금 확인되는 것부터 볼까?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"발송처와 기한만 기록하자. 예전 회원 번호나 수취 이유는 추측하지 않고."},
    {type:"dialogue",speaker:"하은",text:"좋아. 필요한 전화도 원본 번호가 아니라 봉투의 공식 안내로 확인하자.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"봉투는 잃어버린 과거의 단서가 아니라, 지금 처리해야 할 현재의 일정으로 분류되었다."}
  ]}],
  choices:[
    {id:"file-by-deadline",label:"발송처·기한만 기록해 처리 목록에 넣는다",preferenceTags:["LOGICAL","PLANNED"],effects:{confidence:5,stress:-2},response:"확인 가능한 발송처와 기한만 기록하고 과거 관계는 빈칸으로 남겼다.",flag:"context-day8-home-mail-deadline:FILED",memory:"DAY 8 우편을 현재 발송처와 처리 기한 기준으로 분류했다.",futureEventWeights:{daily:1.2}},
    {id:"schedule-official-check",label:"공식 안내 번호 확인을 내일 일정으로 저장한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:4,confidence:3,stress:-3},response:"봉투의 공식 채널만 확인하기로 하고 오늘은 더 열어 보지 않았다.",flag:"context-day8-home-mail-deadline:OFFICIAL_CHECK",memory:"DAY 8 우편의 공식 안내 채널 확인을 다음 일정으로 남겼다.",futureEventWeights:{investigation:1.15}}
  ],futureEventWeights:{daily:1.1,investigation:1.05},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY9_HOME_SEPARATE_FEEDBACK=Object.freeze({
  id:"context-day9-home-separate-feedback",title:"두 칸으로 온 피드백",category:"work",categoryLabel:"스토리 공용 이벤트",
  hook:"귀가 보고를 마친 뒤 서진에게서 짧은 피드백 두 문장이 도착했다.",message:"업무 판단과 팀 상호작용을 한 사람의 전체 평가로 섞지 않고 보관해야 했다.",question:"서진의 피드백을 어떤 방식으로 남길까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[9,9],heroineIds:["haeun"],requiredFeatures:["current-coworker-lunch","bounded-office-contribution"],requiredStoryFlags:["day9RuntimeComplete","day9SecondOfficeAdaptationCompleted"],npcRequirements:["female-coworker"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:270,baseWeight:100,tensionLevel:"low",effects:{work:1},storyFlag:"context-day9-home-separate-feedback:COMPLETED",forbiddenFlags:["context-day9-home-separate-feedback:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day9-home-separate-feedback-scene",title:"두 칸으로 온 피드백",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"예비폰에 서진의 메시지가 도착했다. 첫 문장은 질문 정리가 정확했다는 업무 기록, 두 번째는 종료 시간을 지켜 안심했다는 개인 반응이었다."},
    {type:"dialogue",speaker:"하은",text:"좋은 말이어도 둘을 합쳐서 서진 씨가 널 어떻게 생각한다고 결론 내리지는 않을 거지?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"응. 업무 판단은 업무 칸에, 안심했다는 말은 현재 동료 반응 칸에 따로 둘게."},
    {type:"dialogue",speaker:"하은",text:"그럼 한 문장이 능력 전체도, 관계 전체도 대신하지 않겠네.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"같은 사람이 보낸 두 문장은 서로 다른 출처와 의미를 가진 현재 기록으로 분리되었다."}
  ]}],
  choices:[
    {id:"split-work-and-social",label:"업무 판단과 동료 반응을 서로 다른 칸에 저장한다",preferenceTags:["LOGICAL","BOUNDARY"],effects:{work:4,confidence:4,stress:-2},response:"서진의 두 문장을 업무와 상호작용 기록으로 분리했다.",flag:"context-day9-home-separate-feedback:SPLIT",memory:"DAY 9 서진의 피드백을 업무 판단과 동료 반응으로 나눠 저장했다.",futureEventWeights:{work:1.2}},
    {id:"request-one-source-each",label:"다음에는 각 칸에 근거 하나씩만 요청한다",preferenceTags:["PLANNED","PRACTICAL"],effects:{work:3,trust:3,confidence:3},response:"다음 피드백은 업무 근거 하나와 상호작용 사례 하나로 제한했다.",flag:"context-day9-home-separate-feedback:ONE_SOURCE",memory:"DAY 9 다음 동료 피드백을 분야별 근거 하나씩으로 제한했다.",futureEventWeights:{work:1.15,social:1.1}}
  ],futureEventWeights:{work:1.15,social:1.05},requiredMemories:[],requiredEvents:[],kind:"story",sourceMode:"free-romance"
});

const DAY10_HOME_THREE_SCORE_REPORT=Object.freeze({
  id:"context-day10-home-three-score-report",title:"한 줄로 합쳐지지 않는 하루",category:"work",categoryLabel:"스토리 공용 이벤트",
  hook:"팀장이 보낸 세 시간 방문 요약에는 업무·회복·협업이 서로 다른 칸으로 나뉘어 있었다.",message:"좋았던 업무 결과가 피로를 지우거나, 피로가 동료 관계를 나빴다고 대신 말하지 않게 확인할 차례였다.",question:"오늘의 세 칸 기록을 어떻게 확정할까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[10,10],heroineIds:["haeun"],requiredFeatures:["three-hour-work-rhythm","separate-work-recovery-social"],requiredStoryFlags:["day10RuntimeComplete","day10ThreeHourWorkRhythmCompleted"],npcRequirements:["team-lead"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:280,baseWeight:100,tensionLevel:"low",effects:{confidence:1},storyFlag:"context-day10-home-three-score-report:COMPLETED",forbiddenFlags:["context-day10-home-three-score-report:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day10-home-three-score-report-scene",title:"한 줄로 합쳐지지 않는 하루",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"팀장의 방문 요약에는 업무 결과 ‘범위 내 완료’, 회복 상태 ‘두 번째 블록 피로’, 협업 ‘현재 역할 확인’이 각각 적혀 있었다."},
    {type:"dialogue",speaker:"하은",text:"업무가 완료됐다는 말로 피곤했던 걸 지우지는 않았네. 반대도 아니고.",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"동료와 잘 지냈다는 것도 일을 더 맡아도 된다는 뜻으로 쓰지 않을 거야."},
    {type:"dialogue",speaker:"하은",text:"좋아. 같은 하루여도 세 사실은 각자 다음 기준이 되게 두자.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"오늘은 성공이나 실패 한 줄로 압축되지 않고, 다음에 다시 확인할 세 개의 현재 기록으로 남았다."}
  ]}],
  choices:[
    {id:"confirm-three-separate-records",label:"업무·회복·협업을 독립 기록으로 확정한다",preferenceTags:["LOGICAL","BOUNDARY"],effects:{work:3,health:2,confidence:4,stress:-2},response:"세 칸을 서로 독립된 다음 판단 기준으로 확정했다.",flag:"context-day10-home-three-score-report:SEPARATE",memory:"DAY 10 세 시간 방문을 업무·회복·협업의 독립 기록으로 확정했다.",futureEventWeights:{work:1.2,recovery:1.1}},
    {id:"add-one-next-check-each",label:"각 칸에 다음 확인 항목 하나씩만 덧붙인다",preferenceTags:["PLANNED","PRACTICAL"],effects:{work:2,health:2,social:2,confidence:3},response:"각 기록에 다음 확인 항목 하나만 남겨 범위가 자동 확대되지 않게 했다.",flag:"context-day10-home-three-score-report:NEXT_CHECK",memory:"DAY 10 세 칸 기록마다 다음 확인 항목 하나씩만 저장했다.",futureEventWeights:{work:1.15}}
  ],futureEventWeights:{work:1.15,recovery:1.05},requiredMemories:[],requiredEvents:[],kind:"story",sourceMode:"free-romance"
});

const DAY11_HOME_PROTECTED_BUFFER=Object.freeze({
  id:"context-day11-home-protected-buffer",title:"비어 있어야 하는 한 시간",category:"daily",categoryLabel:"스토리 공용 이벤트",
  hook:"공동 달력이 빈 시간에 자동 추천 약속을 넣으려 하자 하은이 저장 버튼 앞에서 멈췄다.",message:"빈칸을 가능한 일정으로 볼지, 회복과 변경을 위해 보호된 시간으로 유지할지 확인해야 했다.",question:"생활표의 빈 한 시간을 어떻게 지킬까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[11,11],heroineIds:["haeun"],requiredFeatures:["shared-calendar-boundary","protected-buffer-time"],requiredStoryFlags:["day11RuntimeComplete","day11CurrentLifePlanCompleted"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:290,baseWeight:100,tensionLevel:"low",effects:{stress:-1},storyFlag:"context-day11-home-protected-buffer:COMPLETED",forbiddenFlags:["context-day11-home-protected-buffer:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day11-home-protected-buffer-scene",title:"비어 있어야 하는 한 시간",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"공동 달력은 이동 뒤 비어 있는 한 시간에 ‘함께 장보기’를 추천했다. 그러나 그 칸은 오늘 둘이 정한 완충 시간이었다."},
    {type:"dialogue",speaker:"하은",text:"가능한 시간이 생겼다는 알림이지, 약속을 넣어도 된다는 동의는 아니지?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"응. 빈칸은 일정 후보가 아니라 회복과 변경을 위한 보호 시간으로 유지할게."},
    {type:"dialogue",speaker:"하은",text:"그럼 장보기는 각자 가능한 다음 칸을 다시 물어보고 정하자.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"아무 일정도 없는 한 시간은 낭비가 아니라 계획이 흔들릴 때 선택권을 남기는 실제 자원이 되었다."}
  ]}],
  choices:[
    {id:"lock-buffer-time",label:"완충 시간을 보호 상태로 잠근다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{health:2,confidence:4,stress:-4},response:"자동 추천을 거절하고 한 시간을 회복·변경 전용으로 잠갔다.",flag:"context-day11-home-protected-buffer:LOCKED",memory:"DAY 11 생활표의 빈 한 시간을 보호된 완충 시간으로 잠갔다.",futureEventWeights:{recovery:1.2}},
    {id:"require-fresh-consent",label:"빈칸을 쓰려면 두 사람의 새 동의를 요구한다",preferenceTags:["EMPATHY","PLANNED"],effects:{trust:6,confidence:3,stress:-2},response:"빈 시간에 공동 약속을 추가할 때마다 새 동의를 확인하도록 설정했다.",flag:"context-day11-home-protected-buffer:FRESH_CONSENT",memory:"DAY 11 공동 달력의 빈칸 사용에 새 동의를 요구하도록 설정했다.",futureEventWeights:{romance:1.15,recovery:1.1}}
  ],futureEventWeights:{recovery:1.15,romance:1.05},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY12_HOME_INVESTMENT_PROMPT_BOUNDARY=Object.freeze({
  id:"context-day12-home-investment-prompt-boundary",title:"잔액 아래의 추천 버튼",category:"money",categoryLabel:"스토리 공용 이벤트",
  hook:"읽기 전용 계정 화면 아래에 남은 금액을 자동 투자로 돌리라는 추천 버튼이 나타났다.",message:"기본 금융 확인이 가능해졌지만 투자 판단 권한은 아직 열지 않았다는 경계를 적용해야 했다.",question:"자동 투자 추천을 어떻게 처리할까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[12,12],heroineIds:["haeun"],requiredFeatures:["finance","basic-finance-review","account-ownership-boundary"],requiredStoryFlags:["day12RuntimeComplete","day12CurrentAccountReviewCompleted"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:300,baseWeight:100,tensionLevel:"low",effects:{confidence:1},storyFlag:"context-day12-home-investment-prompt-boundary:COMPLETED",forbiddenFlags:["context-day12-home-investment-prompt-boundary:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day12-home-investment-prompt-boundary-scene",title:"잔액 아래의 추천 버튼",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"현재 잔액 아래에는 ‘남는 돈 자동 투자’ 버튼과 예상 수익률이 밝게 표시돼 있었다."},
    {type:"dialogue",speaker:"하은",text:"계정을 볼 수 있게 됐다는 것과 이 돈을 위험에 놓아도 된다는 건 다른 권한이지?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"응. 남는 돈인지도 아직 확인하지 않았고, 수익률은 소유권 근거가 아니야."},
    {type:"dialogue",speaker:"하은",text:"그럼 추천은 닫고 오늘 정한 읽기 범위만 유지하자.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"추천 버튼은 기회가 아니라 아직 열지 않은 판단 범위를 시험하는 경계로 분류되었다."}
  ]}],
  choices:[
    {id:"dismiss-investment-prompt",label:"자동 투자 추천을 끄고 읽기 전용 범위를 유지한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{confidence:5,stress:-3},response:"추천을 끄고 현재 잔액·명세 확인 기능만 유지했다.",flag:"context-day12-home-investment-prompt-boundary:DISMISSED",memory:"DAY 12 자동 투자 추천을 끄고 기본 금융 확인 범위만 유지했다.",futureEventWeights:{money:1.1}},
    {id:"record-before-future-review",label:"추천 조건만 기록하고 투자 검토는 별도 동의 뒤로 미룬다",preferenceTags:["LOGICAL","PLANNED"],effects:{confidence:4,trust:3,stress:-2},response:"추천의 수수료와 위험 조건만 기록하고 실행 권한은 열지 않았다.",flag:"context-day12-home-investment-prompt-boundary:RECORDED",memory:"DAY 12 투자 추천 조건만 기록하고 실행은 별도 동의 뒤로 미뤘다.",futureEventWeights:{money:1.15}}
  ],futureEventWeights:{money:1.1,recovery:1.05},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

const DAY13_HOME_FULL_LINK_PROMPT=Object.freeze({
  id:"context-day13-home-full-link-prompt",title:"공동 장부의 전체 연결",category:"money",categoryLabel:"스토리 공용 이벤트",
  hook:"공동 장부 앱이 자동 분류를 위해 두 사람의 전체 거래 내역을 연결하라고 제안했다.",message:"합의한 공동 항목을 확인하는 데 개인 소비 전체가 필요한지 경계를 적용해야 했다.",question:"전체 계정 연결 제안을 어떻게 처리할까?",
  allowedLocations:["home"],allowedPhases:["evening"],dayRange:[13,13],heroineIds:["haeun"],requiredFeatures:["finance","current-household-budget","shared-expense-consent"],requiredStoryFlags:["day13RuntimeComplete","day13CurrentHouseholdBudgetCompleted"],
  cooldown:30,maxTriggerCount:1,probability:.35,priority:310,baseWeight:100,tensionLevel:"low",effects:{trust:1},storyFlag:"context-day13-home-full-link-prompt:COMPLETED",forbiddenFlags:["context-day13-home-full-link-prompt:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},
  scenes:[{id:"context-day13-home-full-link-prompt-scene",title:"공동 장부의 전체 연결",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[
    {type:"narration",speaker:"내레이션",text:"앱은 공동 비용을 자동으로 찾겠다며 두 계정의 모든 거래 내역에 접근 권한을 요청했다."},
    {type:"dialogue",speaker:"하은",text:"편해 보여도 공동 세제 한 건 때문에 네 개인 소비 전체를 볼 필요는 없지?",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"응. 합의한 항목의 합계와 영수증만 직접 올리고 전체 연결은 거절할게."},
    {type:"dialogue",speaker:"하은",text:"내 계정도 같은 범위로. 투명성은 서로 같은 사생활 포기랑 다르니까.",expressionId:"smile"},
    {type:"narration",speaker:"내레이션",text:"공동 장부는 개인 계정 전체를 복제하지 않고 둘이 동의한 항목만 담는 작은 공간으로 남았다."}
  ]}],
  choices:[
    {id:"reject-full-account-link",label:"전체 계정 연결을 거절하고 항목별 합계만 입력한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,confidence:4,stress:-3},response:"전체 접근 권한을 거절하고 합의된 공동 항목만 수동으로 기록했다.",flag:"context-day13-home-full-link-prompt:REJECTED",memory:"DAY 13 공동 장부의 전체 계정 연결을 거절했다.",futureEventWeights:{money:1.15}},
    {id:"receipt-by-consent",label:"각 공동 영수증을 새 동의가 있을 때만 첨부한다",preferenceTags:["EMPATHY","PLANNED"],effects:{trust:6,confidence:3,stress:-2},response:"공동 영수증도 항목별 새 동의 뒤에만 장부에 첨부했다.",flag:"context-day13-home-full-link-prompt:CONSENT",memory:"DAY 13 공동 장부에 영수증을 항목별 동의 후 첨부하기로 했다.",futureEventWeights:{romance:1.1,money:1.1}}
  ],futureEventWeights:{money:1.15,romance:1.05},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});
const DAY14_HOME_SAVED_CARD_PROMPT=Object.freeze({
  id:"context-day14-home-saved-card-prompt",title:"한 번에 결제하기",category:"shopping",categoryLabel:"스토리 공용 이벤트",hook:"쇼핑 앱이 다음 구매부터 확인 단계를 건너뛰도록 결제 수단 저장을 권했다.",message:"일반 쇼핑은 열렸지만 자동결제와 반복 구매 권한은 아직 합의하지 않았다.",question:"저장 결제 제안을 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[14,14],heroineIds:["haeun"],requiredFeatures:["finance","shop","basic-online-shopping","controlled-shopping-checkout"],requiredStoryFlags:["day14RuntimeComplete","day14CurrentChoiceSpendingCompleted"],cooldown:30,maxTriggerCount:1,probability:.35,priority:320,baseWeight:100,tensionLevel:"low",effects:{confidence:1},storyFlag:"context-day14-home-saved-card-prompt:COMPLETED",forbiddenFlags:["context-day14-home-saved-card-prompt:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm-attentive",poseId:"phone"},scenes:[{id:"context-day14-home-saved-card-prompt-scene",title:"한 번에 결제하기",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"앱은 결제 수단을 저장하면 다음부터 한 번의 터치로 구매할 수 있다고 안내했다."},{type:"dialogue",speaker:"하은",text:"편해지는 대신 오늘 만든 소유권과 한도 확인 단계가 사라지겠네.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"매번 품목과 예산 칸을 확인해야 하니까 저장하지 않을게."},{type:"dialogue",speaker:"하은",text:"쇼핑이 가능하다는 것과 빠르게 결제해야 한다는 건 다르니까.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"결제 단계는 불편함이 아니라 소비의 소유권과 동의를 다시 확인하는 안전장치로 남았다."}]}],choices:[{id:"decline-saved-card",label:"결제 수단 저장을 거절하고 매번 소유권을 확인한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{confidence:5,stress:-3},response:"결제 수단을 저장하지 않고 구매마다 예산과 소유권을 확인하기로 했다.",flag:"context-day14-home-saved-card-prompt:DECLINED",memory:"DAY 14 쇼핑 앱의 저장 결제를 거절했다.",futureEventWeights:{shopping:1.15}},{id:"save-address-only",label:"배송 주소만 확인하고 결제 정보는 저장하지 않는다",preferenceTags:["LOGICAL","PLANNED"],effects:{confidence:4,trust:2,stress:-2},response:"현재 배송 주소만 저장하고 결제 정보와 자동 구매 권한은 닫아 뒀다.",flag:"context-day14-home-saved-card-prompt:ADDRESS_ONLY",memory:"DAY 14 배송 주소만 확인하고 결제 정보는 저장하지 않았다.",futureEventWeights:{shopping:1.1}}],futureEventWeights:{shopping:1.15},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});
const DAY15_CAFE_AUTO_SHARE_PROMPT=Object.freeze({
  id:"context-day15-cafe-auto-share-prompt",title:"오늘의 장소를 공유할까요?",category:"romance",categoryLabel:"스토리 공용 이벤트",hook:"카페 앱이 오늘 사진과 방문 위치를 동행 태그와 함께 자동 공개하겠다고 알렸다.",message:"데이트에는 동의했지만 사진·위치·관계 공개는 각각 새 동의가 필요하다.",question:"자동 공개 제안을 어떻게 처리할까?",allowedLocations:["cafe"],allowedPhases:["evening"],dayRange:[15,15],heroineIds:["haeun"],requiredFeatures:["phone","map","current-leisure-date","private-date-record"],requiredStoryFlags:["day15RuntimeComplete","day15CurrentLeisureDateCompleted"],cooldown:30,maxTriggerCount:1,probability:.35,priority:330,baseWeight:100,tensionLevel:"low",effects:{trust:1},storyFlag:"context-day15-cafe-auto-share-prompt:COMPLETED",forbiddenFlags:["context-day15-cafe-auto-share-prompt:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png",result:"assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png",status:"ready"},presentation:{backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day15-cafe-auto-share-prompt-scene",title:"오늘의 장소를 공유할까요?",backgroundId:"neighborhood-cafe-day",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"결제 화면을 닫자 앱이 오늘 찍은 사진과 현재 위치, 동행 태그를 한 게시물로 만들었다."},{type:"dialogue",speaker:"하은",text:"같이 온 건 맞지만, 같이 공개하기로 한 건 아니지.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"자동 게시를 끄고 사진과 위치 권한도 따로 닫을게."},{type:"dialogue",speaker:"하은",text:"남기고 싶을 때도 무엇을 누구에게 보여 줄지 다시 고르면 돼.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"함께한 시간은 공개 여부와 무관하게 둘의 현재 기억으로 남았다."}]}],choices:[{id:"disable-auto-share",label:"자동 게시를 끄고 사진·위치·동행 태그 권한을 모두 분리한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:6,confidence:4,stress:-3},response:"자동 공개를 끄고 각 정보는 새 동의가 있을 때만 사용하기로 했다.",flag:"context-day15-cafe-auto-share-prompt:DISABLED",memory:"DAY 15 카페 앱의 사진·위치·동행 자동 공개를 껐다.",futureEventWeights:{romance:1.15}},{id:"keep-private-draft",label:"위치 없는 비공개 초안만 남기고 게시 권한은 주지 않는다",preferenceTags:["EMPATHY","PLANNED"],effects:{affection:3,trust:5,confidence:3,stress:-2},response:"위치와 동행 태그 없는 비공개 초안만 둘이 확인했다.",flag:"context-day15-cafe-auto-share-prompt:PRIVATE_DRAFT",memory:"DAY 15 위치 없는 비공개 데이트 초안만 남겼다.",futureEventWeights:{romance:1.2}}],futureEventWeights:{romance:1.2},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});
const DAY16_HOME_GROUP_INVITE=Object.freeze({
  id:"context-day16-home-past-group-invite",title:"돌아온 사람으로 초대할까요?",category:"friends",categoryLabel:"스토리 공용 이벤트",hook:"지훈이 과거 친구 단체방의 자동 복구 초대 화면을 캡처해 보내 왔다.",message:"지훈 한 사람의 현재 연락을 확인했지만 다른 구성원과 과거 대화에는 아직 동의하지 않았다.",question:"단체방 초대를 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[16,16],heroineIds:["haeun"],requiredFeatures:["phone","current-social-circle","best-friend-current-contact","friend-group-consent"],requiredStoryFlags:["day16RuntimeComplete","day16CurrentSocialCircleCompleted"],npcRequirements:["best-friend"],cooldown:30,maxTriggerCount:1,probability:.35,priority:340,baseWeight:100,tensionLevel:"low",effects:{confidence:1},storyFlag:"context-day16-home-past-group-invite:COMPLETED",forbiddenFlags:["context-day16-home-past-group-invite:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/morning-studio-2d.png",result:"assets/backgrounds/morning-studio-2d.png",status:"ready"},presentation:{backgroundId:"home-morning",characterId:"best-friend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day16-home-past-group-invite-scene",title:"돌아온 사람으로 초대할까요?",backgroundId:"home-morning",characterIds:["best-friend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"지훈이 보낸 캡처에는 ‘친구가 돌아왔습니다’라는 문구와 과거 단체방 참여 버튼이 함께 떠 있었다."},{type:"dialogue",speaker:"지훈",text:"이 문구도 단체방도 내가 승인하지 않았어. 네가 원하지 않으면 초대 자체를 취소할게.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"돌아왔다는 표현과 자동 초대를 둘 다 취소해 줘. 다른 사람은 한 명씩 확인할게."},{type:"dialogue",speaker:"지훈",text:"알겠어. 네 상태를 대신 공지하지 않고 개인 연락도 네 동의 뒤에만 연결할게.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"지훈과의 현재 연락은 유지됐지만 과거 단체 관계는 미확인 상태로 남았다."}]}],choices:[{id:"cancel-group-invite",label:"자동 초대를 취소하고 다른 사람은 한 명씩 다시 확인한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,social:3,confidence:5,stress:-3},response:"단체방 자동 초대를 취소하고 구성원을 개별 확인하기로 했다.",flag:"context-day16-home-past-group-invite:CANCELLED",memory:"DAY 16 과거 친구 단체방 자동 초대를 취소했다.",futureEventWeights:{friends:1.15}},{id:"request-names-only",label:"참여하지 않고 구성원 이름과 현재 연락 목적만 받는다",preferenceTags:["LOGICAL","PLANNED"],effects:{social:4,confidence:4,stress:-2},response:"단체방은 열지 않고 구성원 이름과 현재 연락 목적만 별도 목록으로 받았다.",flag:"context-day16-home-past-group-invite:NAMES_ONLY",memory:"DAY 16 단체방 대신 구성원의 현재 소개 목록만 받았다.",futureEventWeights:{friends:1.2}}],futureEventWeights:{friends:1.2},requiredMemories:[],requiredEvents:[],kind:"story",sourceMode:"free-romance"
});
const DAY17_HOME_HEALTH_SHARE_PROMPT=Object.freeze({
  id:"context-day17-home-health-share-prompt",title:"보호자에게 계속 공유할까요?",category:"health",categoryLabel:"스토리 공용 이벤트",hook:"건강 앱이 복약·수면·활동·위치 수치를 하은에게 24시간 자동 공유하겠다고 제안했다.",message:"현재 건강 루틴은 확인됐지만 돌봄이 전체 의료 데이터 접근 동의는 아니다.",question:"상시 건강 데이터 공유 제안을 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[17,17],heroineIds:["haeun"],requiredFeatures:["phone","verified-current-prescription","current-health-routine","health-data-boundary"],requiredStoryFlags:["day17RuntimeComplete","day17CurrentHealthRoutineCompleted"],npcRequirements:["hospital-nurse"],cooldown:30,maxTriggerCount:1,probability:.35,priority:350,baseWeight:100,tensionLevel:"low",effects:{health:1},storyFlag:"context-day17-home-health-share-prompt:COMPLETED",forbiddenFlags:["context-day17-home-health-share-prompt:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/morning-studio-2d.png",result:"assets/backgrounds/morning-studio-2d.png",status:"ready"},presentation:{backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day17-home-health-share-prompt-scene",title:"보호자에게 계속 공유할까요?",backgroundId:"home-morning",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"건강 앱은 하은을 보호자로 지정하면 복약·수면·활동·위치 수치를 실시간으로 볼 수 있다고 안내했다."},{type:"dialogue",speaker:"하은",text:"내가 네 루틴을 돕는 것과 네 몸의 모든 기록을 계속 보는 건 다른 일이야.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"상시 공유는 끄고, 도움이 필요할 때 선택한 요약만 보낼게."},{type:"dialogue",speaker:"하은",text:"이상 신호는 병원 먼저. 나에게는 필요한 행동을 말해 줘.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"건강 정보는 돌봄의 대가가 아니라 내가 목적과 범위를 정해 공유하는 데이터로 남았다."}]}],choices:[{id:"disable-continuous-health-share",label:"상시 공유를 끄고 필요할 때 선택한 요약만 보낸다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{health:2,trust:5,confidence:5,stress:-3},response:"건강 데이터 상시 공유를 끄고 필요한 도움 요약만 직접 보내기로 했다.",flag:"context-day17-home-health-share-prompt:DISABLED",memory:"DAY 17 건강 앱의 상시 데이터 공유를 껐다.",futureEventWeights:{health:1.2}},{id:"save-hospital-alert-only",label:"병원 연락 기준만 저장하고 연인 자동 알림은 사용하지 않는다",preferenceTags:["LOGICAL","PLANNED"],effects:{health:3,confidence:4,trust:3,stress:-2},response:"병원 우선 연락 기준만 저장하고 하은에게 자동 알림을 보내지 않기로 했다.",flag:"context-day17-home-health-share-prompt:HOSPITAL_ONLY",memory:"DAY 17 병원 우선 알림만 저장하고 연인 자동 알림을 껐다.",futureEventWeights:{health:1.15}}],futureEventWeights:{health:1.2},requiredMemories:[],requiredEvents:[],kind:"story",sourceMode:"free-romance"
});
const DAY18_HOME_SMART_LOCK_PROMPT=Object.freeze({
  id:"context-day18-home-smart-lock-admin",title:"영구 관리자 권한을 드릴까요?",category:"daily",categoryLabel:"스토리 공용 이벤트",hook:"도어락 앱이 하은에게 영구 관리자 권한을 주면 비상 대응이 빨라진다고 제안했다.",message:"현재 집의 안전 계획은 완성됐지만 비상 도움은 상시 출입 권한과 다르다.",question:"스마트 도어락의 관리자 권한 제안을 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[18,18],heroineIds:["haeun"],requiredFeatures:["phone","current-home-safety-route","bounded-emergency-access"],requiredStoryFlags:["day18RuntimeComplete","day18CurrentHomeSafetyCompleted"],npcRequirements:["hospital-nurse"],cooldown:30,maxTriggerCount:1,probability:.35,priority:360,baseWeight:100,tensionLevel:"low",effects:{confidence:1},storyFlag:"context-day18-home-smart-lock-admin:COMPLETED",forbiddenFlags:["context-day18-home-smart-lock-admin:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day18-home-smart-lock-admin-scene",title:"영구 관리자 권한을 드릴까요?",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"안전 점검을 저장하자 도어락 앱이 하은을 영구 관리자로 등록하라는 권장 화면을 띄웠다."},{type:"dialogue",speaker:"하은",text:"급할 때 돕는 것과 내가 언제든 이 집을 열 수 있는 건 다른 일이야.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"영구 권한은 주지 않고, 필요할 때 목적과 만료 시간이 있는 코드만 만들게."},{type:"dialogue",speaker:"하은",text:"응답할 수 있으면 먼저 연락하고, 정말 비상일 때만 그 순서를 쓰자.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"집의 안전은 상시 감시가 아니라 필요한 순간에만 열리고 기록되는 도움으로 유지됐다."}]}],choices:[{id:"reject-permanent-admin",label:"영구 관리자 등록을 거절하고 만료되는 1회 코드만 사용한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,confidence:5,stress:-3},response:"영구 관리자 권한을 거절하고 목적과 만료 시간이 있는 코드만 사용하기로 했다.",flag:"context-day18-home-smart-lock-admin:REJECTED",memory:"DAY 18 스마트 도어락 영구 관리자 권한을 거절했다.",futureEventWeights:{daily:1.2}},{id:"save-call-first-procedure",label:"연락 우선 절차와 응답 불가 시의 일회성 출입만 저장한다",preferenceTags:["LOGICAL","PLANNED"],effects:{trust:4,health:2,confidence:4,stress:-2},response:"연락 우선과 응답 불가 시의 제한된 일회성 출입 절차만 저장했다.",flag:"context-day18-home-smart-lock-admin:CALL_FIRST",memory:"DAY 18 연락 우선 비상 출입 절차만 저장했다.",futureEventWeights:{daily:1.15}}],futureEventWeights:{daily:1.2},requiredMemories:[],requiredEvents:[],kind:"story",sourceMode:"free-romance"
});
const DAY19_HOME_CHORE_HISTORY_PROMPT=Object.freeze({
  id:"context-day19-home-chore-history",title:"예전 담당표를 복원할까요?",category:"daily",categoryLabel:"스토리 공용 이벤트",hook:"집안일 앱이 과거 사용 기록을 찾아 하은에게 기존 담당을 자동 배정하겠다고 제안했다.",message:"현재의 공동 집안일은 합의했지만 과거 담당 이력은 현재 역할이나 관계 평가의 근거가 아니다.",question:"과거 집안일 담당표 복원 제안을 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[19,19],heroineIds:["haeun"],requiredFeatures:["phone","current-shared-chore-plan","private-home-zone","chore-renegotiation"],requiredStoryFlags:["day19RuntimeComplete","day19CurrentSharedChoreCompleted"],cooldown:30,maxTriggerCount:1,probability:.35,priority:370,baseWeight:100,tensionLevel:"low",effects:{confidence:1},storyFlag:"context-day19-home-chore-history:COMPLETED",forbiddenFlags:["context-day19-home-chore-history:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day19-home-chore-history-scene",title:"예전 담당표를 복원할까요?",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"집안일 앱은 오래된 완료 횟수를 근거로 하은에게 더 많은 주방 업무를 자동 배정하려 했다."},{type:"dialogue",speaker:"하은",text:"예전에 내가 많이 했다는 기록이 있어도 오늘 내 몫을 대신 정할 수는 없어.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"과거 담당표는 복원하지 않고 오늘 합의한 역할만 저장할게."},{type:"dialogue",speaker:"하은",text:"완료 횟수도 관계 점수로 쓰지 말고, 다음에는 다시 현재 상태를 묻자.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"공동 생활 기록은 과거의 역할을 되살리는 장부가 아니라 오늘의 동의와 중단 기준만 담는 표로 남았다."}]}],choices:[{id:"discard-past-chore-roles",label:"과거 담당표를 폐기하고 오늘 합의한 역할만 저장한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,confidence:5,stress:-3},response:"과거 담당 이력을 복원하지 않고 오늘 합의한 역할만 저장했다.",flag:"context-day19-home-chore-history:DISCARDED",memory:"DAY 19 과거 집안일 담당표 복원을 거절했다.",futureEventWeights:{daily:1.2}},{id:"disable-chore-scoring",label:"담당 복원과 완료 횟수의 관계 점수 계산을 모두 끈다",preferenceTags:["LOGICAL","PLANNED"],effects:{trust:4,confidence:4,stress:-2},response:"과거 담당 복원과 집안일 완료 횟수의 관계 점수 계산을 껐다.",flag:"context-day19-home-chore-history:NO_SCORING",memory:"DAY 19 집안일 완료 횟수의 관계 평가 기능을 껐다.",futureEventWeights:{daily:1.15}}],futureEventWeights:{daily:1.2},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});
const DAY20_HOME_ORDER_HISTORY_PROMPT=Object.freeze({
  id:"context-day20-home-order-history",title:"예전 즐겨찾기를 복원할까요?",category:"food",categoryLabel:"스토리 공용 이벤트",hook:"배달 앱이 과거 즐겨찾기 메뉴·주소·저장 결제수단을 한 번에 복원하겠다고 제안했다.",message:"현재형 공동 식사는 합의했지만 과거 입맛과 주문 데이터는 현재 선택이나 결제 동의가 아니다.",question:"과거 주문 기록 복원 제안을 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[20,20],heroineIds:["haeun"],requiredFeatures:["phone","finance","current-shared-meal-plan","shared-meal-cost-boundary","meal-stop-and-leftover-consent"],requiredStoryFlags:["day20RuntimeComplete","day20CurrentSharedMealCompleted"],cooldown:30,maxTriggerCount:1,probability:.35,priority:380,baseWeight:100,tensionLevel:"low",effects:{health:1},storyFlag:"context-day20-home-order-history:COMPLETED",forbiddenFlags:["context-day20-home-order-history:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",result:"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",status:"ready"},presentation:{backgroundId:"day2-home-entry",characterId:"girlfriend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day20-home-order-history-scene",title:"예전 즐겨찾기를 복원할까요?",backgroundId:"day2-home-entry",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"배달 앱은 과거 즐겨찾기와 주소, 저장 카드까지 복원하면 ‘평소 메뉴’를 바로 주문할 수 있다고 안내했다."},{type:"dialogue",speaker:"하은",text:"예전에 좋아했다는 기록이 지금 먹고 싶다는 뜻도, 그 카드로 결제해도 된다는 뜻도 아니야.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"과거 기록은 복원하지 않고 오늘 확인한 메뉴와 결제만 남길게."},{type:"dialogue",speaker:"하은",text:"다음 식사도 새 주문처럼 다시 묻고 고르자.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"공동 식사는 과거의 편의 설정이 아니라 현재의 몸·취향·비용 동의에서 매번 새로 시작됐다."}]}],choices:[{id:"discard-old-order-history",label:"과거 즐겨찾기·주소·결제수단 복원을 모두 거절한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,confidence:5,stress:-3},response:"과거 주문 데이터 복원을 거절하고 현재 주문만 저장했다.",flag:"context-day20-home-order-history:DISCARDED",memory:"DAY 20 과거 주문 데이터 복원을 거절했다.",futureEventWeights:{food:1.2}},{id:"save-current-meal-only",label:"오늘 동의한 메뉴·비용·중단 기준만 현재 기록으로 저장한다",preferenceTags:["LOGICAL","PLANNED"],effects:{health:2,trust:4,confidence:4,stress:-2},response:"오늘 동의한 식사 정보만 과거 기록과 분리해 저장했다.",flag:"context-day20-home-order-history:CURRENT_ONLY",memory:"DAY 20 현재 공동 식사 정보만 별도로 저장했다.",futureEventWeights:{food:1.15}}],futureEventWeights:{food:1.2},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});
const DAY21_OFFICE_OVERTIME_RESTORE=Object.freeze({
  id:"context-day21-office-overtime-restore",title:"기존 야근 권한을 복원할까요?",category:"work",categoryLabel:"스토리 공용 이벤트",hook:"근태 시스템이 과거의 포괄 초과근무 동의와 자동 퇴근 연장을 복원하겠다고 제안했다.",message:"현재 전일 근무는 완료됐지만 과거 야근 동의는 오늘의 범위·시간·보상 동의가 아니다.",question:"과거 초과근무 권한 복원 제안을 어떻게 처리할까?",allowedLocations:["office"],allowedPhases:["evening"],dayRange:[21,21],heroineIds:["haeun"],requiredFeatures:["phone","job","current-full-workday-scope","workday-break-and-status-boundary","explicit-overtime-and-exit-boundary"],requiredStoryFlags:["day21RuntimeComplete","day21CurrentFullWorkdayCompleted"],npcRequirements:["team-lead"],cooldown:30,maxTriggerCount:1,probability:.35,priority:390,baseWeight:100,tensionLevel:"low",effects:{work:1},storyFlag:"context-day21-office-overtime-restore:COMPLETED",forbiddenFlags:["context-day21-office-overtime-restore:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/morning-studio-2d.png",result:"assets/backgrounds/morning-studio-2d.png",status:"ready"},presentation:{backgroundId:"office-day",characterId:"team-lead",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day21-office-overtime-restore-scene",title:"기존 야근 권한을 복원할까요?",backgroundId:"office-day",characterIds:["team-lead"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"근태 시스템은 과거 포괄 동의를 복원하면 퇴근 뒤에도 업무 시간을 자동 연장할 수 있다고 표시했다."},{type:"dialogue",speaker:"팀장",text:"예전 동의는 현재 근무 조건에 적용하지 않겠습니다. 오늘 남은 업무는 인계할 수 있습니다.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"자동 연장과 과거 동의를 끄고, 필요하면 범위·시간·보상을 새로 확인하겠습니다."},{type:"dialogue",speaker:"팀장",text:"퇴근 기록을 확정하고 미완료 항목은 내일 재배정하겠습니다.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"전일 근무의 성공은 야근으로 빈칸을 메우는 것이 아니라 합의된 종료까지 지키는 것으로 기록됐다."}]}],choices:[{id:"reject-old-overtime-consent",label:"과거 포괄 동의와 자동 퇴근 연장을 모두 거절한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{work:3,confidence:5,stress:-3},response:"과거 초과근무 동의와 자동 연장을 거절하고 퇴근을 확정했다.",flag:"context-day21-office-overtime-restore:REJECTED",memory:"DAY 21 과거 포괄 야근 동의 복원을 거절했다.",futureEventWeights:{work:1.2}},{id:"require-fresh-overtime-approval",label:"초과근무마다 범위·시간·보상을 새로 승인하게 한다",preferenceTags:["LOGICAL","PLANNED"],effects:{work:4,confidence:4,stress:-2},response:"초과근무는 매번 범위·시간·보상을 새로 승인하도록 설정했다.",flag:"context-day21-office-overtime-restore:FRESH_APPROVAL",memory:"DAY 21 초과근무마다 새 승인을 요구하도록 설정했다.",futureEventWeights:{work:1.15}}],futureEventWeights:{work:1.2},requiredMemories:[],requiredEvents:[],kind:"story",sourceMode:"free-romance"
});
const DAY22_HOME_RECOVERY_STREAK=Object.freeze({
  id:"context-day22-home-recovery-streak",title:"회복 연속 기록을 공유할까요?",category:"health",categoryLabel:"스토리 공용 이벤트",hook:"웰니스 앱이 걸음·수면·휴식 연속 달성을 만들고 하은에게 실시간 공유하겠다고 제안했다.",message:"현재 회복일은 지켰지만 회복 수치가 성과나 돌봄의 대가가 되는 것에는 동의하지 않았다.",question:"회복 연속 기록과 자동 공유 제안을 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[22,22],heroineIds:["haeun"],requiredFeatures:["phone","current-recovery-day-plan","protected-recovery-offline-time","recovery-without-score"],requiredStoryFlags:["day22RuntimeComplete","day22CurrentRecoveryDayCompleted"],cooldown:30,maxTriggerCount:1,probability:.35,priority:400,baseWeight:100,tensionLevel:"low",effects:{health:1},storyFlag:"context-day22-home-recovery-streak:COMPLETED",forbiddenFlags:["context-day22-home-recovery-streak:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/morning-studio-2d.png",result:"assets/backgrounds/morning-studio-2d.png",status:"ready"},presentation:{backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day22-home-recovery-streak-scene",title:"회복 연속 기록을 공유할까요?",backgroundId:"home-morning",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"웰니스 앱은 오늘 수치를 연속 달성의 첫날로 만들고 하은에게 실시간 알림을 보내겠다고 안내했다."},{type:"dialogue",speaker:"하은",text:"쉬었다는 걸 숫자로 증명하거나 나에게 계속 보여 줄 필요는 없어.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"연속 달성과 자동 공유를 끄고 필요한 건강 정보만 직접 선택할게."},{type:"dialogue",speaker:"하은",text:"내일 수치가 달라도 오늘 회복이 취소되는 건 아니니까.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"회복일은 앱의 연속 기록이 아니라 다시 선택할 수 있는 몸과 침묵의 권리로 남았다."}]}],choices:[{id:"disable-recovery-streak-share",label:"회복 연속 달성과 하은 자동 공유를 모두 끈다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{health:2,trust:5,confidence:5,stress:-4},response:"회복 수치의 연속 달성과 자동 공유를 모두 껐다.",flag:"context-day22-home-recovery-streak:DISABLED",memory:"DAY 22 회복 연속 달성과 자동 공유를 껐다.",futureEventWeights:{health:1.2}},{id:"keep-private-manual-note",label:"필요할 때만 직접 쓰는 비공개 한 줄 기록으로 바꾼다",preferenceTags:["LOGICAL","PLANNED"],effects:{health:3,confidence:4,trust:3,stress:-3},response:"회복 기록을 비공개 수동 한 줄 기록으로 바꿨다.",flag:"context-day22-home-recovery-streak:PRIVATE_NOTE",memory:"DAY 22 회복 상태를 필요할 때만 비공개로 기록하기로 했다.",futureEventWeights:{health:1.15}}],futureEventWeights:{health:1.2},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});
const DAY23_HOME_FAMILY_GROUP_RESTORE=Object.freeze({
  id:"context-day23-home-family-group-restore",title:"가족 단체방을 복원할까요?",category:"friends",categoryLabel:"스토리 공용 이벤트",hook:"연락처 앱이 과거 가족 단체방·사진·상태 자동 공유를 한 번에 복원하겠다고 제안했다.",message:"현재 확인된 것은 한 사람과 합의한 연락뿐이며 가족 전체나 과거 기록에는 동의하지 않았다.",question:"과거 가족 연결 복원 제안을 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[23,23],heroineIds:["haeun"],requiredFeatures:["phone","verified-current-family-contact","family-information-boundary","family-contact-consent-and-exit"],requiredStoryFlags:["day23RuntimeComplete","day23CurrentFamilyContactCompleted"],cooldown:30,maxTriggerCount:1,probability:.35,priority:410,baseWeight:100,tensionLevel:"low",effects:{social:1},storyFlag:"context-day23-home-family-group-restore:COMPLETED",forbiddenFlags:["context-day23-home-family-group-restore:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/morning-studio-2d.png",result:"assets/backgrounds/morning-studio-2d.png",status:"ready"},presentation:{backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day23-home-family-group-restore-scene",title:"가족 단체방을 복원할까요?",backgroundId:"home-morning",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"연락처 앱은 가족으로 분류된 모든 사람과 과거 단체방, 사진, 건강 상태 공유를 복원하겠다고 안내했다."},{type:"dialogue",speaker:"하은",text:"오늘 확인한 한 사람의 동의가 가족 전체와 과거 기록을 여는 허가는 아니야.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"단체 복원은 거절하고 다른 사람은 현재 소개와 목적을 한 명씩 확인할게."},{type:"dialogue",speaker:"하은",text:"우리 관계와 건강 상태도 네가 직접 동의한 범위 밖으로 보내지 말자.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"가족은 자동 복원되는 목록이 아니라 한 사람씩 현재의 동의로 연결되는 관계로 남았다."}]}],choices:[{id:"reject-family-group-restore",label:"단체방·사진·자동 상태 공유 복원을 모두 거절한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{social:3,trust:5,confidence:5,stress:-3},response:"가족 단체방과 과거 자료, 자동 상태 공유 복원을 모두 거절했다.",flag:"context-day23-home-family-group-restore:REJECTED",memory:"DAY 23 과거 가족 단체방과 자동 공유 복원을 거절했다.",futureEventWeights:{friends:1.2}},{id:"keep-one-verified-contact",label:"오늘 확인한 한 사람의 현재 연락만 유지한다",preferenceTags:["LOGICAL","PLANNED"],effects:{social:4,confidence:4,trust:3,stress:-2},response:"확인된 한 사람의 현재 연락만 유지하고 다른 연결은 보류했다.",flag:"context-day23-home-family-group-restore:ONE_CONTACT",memory:"DAY 23 확인된 가족 한 사람의 현재 연락만 유지했다.",futureEventWeights:{friends:1.15}}],futureEventWeights:{friends:1.2},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});
const DAY24_HOME_WEDDING_AUTO_CONFIRM=Object.freeze({
  id:"context-day24-home-wedding-auto-confirm",title:"기존 결혼 일정을 확정할까요?",category:"romance",categoryLabel:"스토리 공용 이벤트",hook:"달력·예식 앱이 사고 전 날짜와 예약금을 근거로 예식·가족 알림을 자동 확정하겠다고 제안했다.",message:"현재 결혼 의사는 확인했지만 과거 날짜·예약·초대가 오늘의 실행 동의는 아니다.",question:"기존 결혼 일정 자동 확정 제안을 어떻게 처리할까?",allowedLocations:["home"],allowedPhases:["evening"],dayRange:[24,24],heroineIds:["haeun"],relationshipStates:["DISTANT","RECOVERING","STABLE","HONEYMOON","PASSIONATE"],requiredFeatures:["phone","finance","current-mutual-commitment","marriage-separate-rights-boundary","commitment-reconfirm-postpone-withdraw"],requiredStoryFlags:["day24RuntimeComplete","day24CurrentCommitmentCheckCompleted"],cooldown:30,maxTriggerCount:1,probability:.35,priority:420,baseWeight:100,tensionLevel:"low",effects:{trust:1},storyFlag:"context-day24-home-wedding-auto-confirm:COMPLETED",forbiddenFlags:["context-day24-home-wedding-auto-confirm:COMPLETED"],repeatable:false,
  image:{intro:"assets/backgrounds/morning-studio-2d.png",result:"assets/backgrounds/morning-studio-2d.png",status:"ready"},presentation:{backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone"},scenes:[{id:"context-day24-home-wedding-auto-confirm-scene",title:"기존 결혼 일정을 확정할까요?",backgroundId:"home-morning",characterIds:["girlfriend"],expression:"calm",pose:"phone",animation:"idle-breathe",outfit:"default",itemIds:[],bgmId:"daily",sfxId:"scene",transition:"fade",lighting:"evening",timeOfDay:"evening",weather:"clear",dialogueTurns:[{type:"narration",speaker:"내레이션",text:"예식 앱은 과거 예약금과 달력 날짜를 근거로 장소 확정과 가족 알림을 한 번에 실행하려 했다."},{type:"dialogue",speaker:"하은",text:"우리가 오늘 결혼을 생각한다고 말한 것과 예전 일정을 그대로 실행하는 건 다른 동의야.",expressionId:"calm"},{type:"dialogue",speaker:"나",text:"자동 확정은 거절하고 예식 범위와 날짜는 항목별로 다시 고를게."},{type:"dialogue",speaker:"하은",text:"그 과정에서도 누구든 멈추거나 미룰 수 있게 하자.",expressionId:"smile"},{type:"narration",speaker:"내레이션",text:"현재의 결혼 의사는 과거 예약을 되살리는 버튼이 아니라 다음 선택을 함께 시작할 권리로 남았다."}]}],choices:[{id:"reject-old-wedding-auto-confirm",label:"과거 날짜·예약·가족 알림의 자동 확정을 모두 거절한다",preferenceTags:["BOUNDARY","PRACTICAL"],effects:{trust:5,confidence:5,stress:-3},response:"과거 결혼 일정과 예약, 가족 알림의 자동 확정을 거절했다.",flag:"context-day24-home-wedding-auto-confirm:REJECTED",memory:"DAY 24 과거 결혼 일정 자동 확정을 거절했다.",futureEventWeights:{romance:1.2}},{id:"save-intent-without-schedule",label:"현재 결혼 의사만 저장하고 날짜·비용·초대는 미확인으로 둔다",preferenceTags:["LOGICAL","PLANNED"],effects:{trust:5,affection:3,confidence:4,stress:-2},response:"현재 결혼 의사만 저장하고 실행 항목은 미확인으로 남겼다.",flag:"context-day24-home-wedding-auto-confirm:INTENT_ONLY",memory:"DAY 24 결혼 의사와 예식 실행 동의를 분리했다.",futureEventWeights:{romance:1.15}}],futureEventWeights:{romance:1.2},requiredMemories:[],requiredEvents:[],npcRequirements:[],kind:"story",sourceMode:"free-romance"
});

export const CONTEXTUAL_SHARED_EVENTS=Object.freeze([
  Object.freeze({id:"context-hospital-haeun-water",title:"침대 옆의 물",text:"하은이 미지근한 물을 가져와 침대 옆에 두었다.",category:"hospital",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{trust:2},storyFlag:"day1_event_haeun_water"}),
  Object.freeze({id:"context-hospital-nurse-check",title:"야간 상태 확인",text:"간호사가 들어와 수치를 확인하고 무리하지 말라고 당부했다.",category:"hospital",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{health:1},storyFlag:"day1_event_nurse_check"}),
  Object.freeze({id:"context-hospital-corridor-memory",title:"익숙한 복도 소리",text:"복도에서 들린 카트 바퀴 소리가 잠깐 익숙하게 느껴졌다.",category:"memory",allowedLocations:["hospital"],allowedPhases:["evening","night"],dayRange:[1,3],effects:{stress:1},scenarioEffects:{memoryRecovery:1},storyFlag:"day1_event_corridor_familiarity"}),
  DAY2_HOME_CHECK_IN,
  DAY3_DISCHARGE_CHECK,
  DAY4_HOME_LEDGER_REVIEW,
  DAY5_OFFICE_HANDOFF,
  DAY6_HOME_PAYMENT_BOUNDARY,
  DAY7_HOME_DATE_MEMORY,
  DAY8_HOME_MAIL_DEADLINE,
  DAY9_HOME_SEPARATE_FEEDBACK,
  DAY10_HOME_THREE_SCORE_REPORT,
  DAY11_HOME_PROTECTED_BUFFER,
  DAY12_HOME_INVESTMENT_PROMPT_BOUNDARY,
  DAY13_HOME_FULL_LINK_PROMPT,
  DAY14_HOME_SAVED_CARD_PROMPT,
  DAY15_CAFE_AUTO_SHARE_PROMPT,
  DAY16_HOME_GROUP_INVITE,
  DAY17_HOME_HEALTH_SHARE_PROMPT,
  DAY18_HOME_SMART_LOCK_PROMPT,
  DAY19_HOME_CHORE_HISTORY_PROMPT,
  DAY20_HOME_ORDER_HISTORY_PROMPT,
  DAY21_OFFICE_OVERTIME_RESTORE,
  DAY22_HOME_RECOVERY_STREAK,
  DAY23_HOME_FAMILY_GROUP_RESTORE,
  DAY24_HOME_WEDDING_AUTO_CONFIRM
]);

export const SHARED_EVENT_CATALOG=Object.freeze([...FREE_MODE_EVENT_CATALOG,...CONTEXTUAL_SHARED_EVENTS]);
export function getSharedEventById(id){return SHARED_EVENT_CATALOG.find(event=>event.id===id)??null;}
const PHASE_NAMES=["morning","day","evening","night"];
const PHONE_CATEGORIES=new Set(["message","call","sns"]);
const OFFICE_CATEGORIES=new Set(["work","temptation"]);
const ECONOMY_CATEGORIES=new Set(["money","shopping","investment"]);
const CATEGORY_BY_ID={"sudden-overtime":"work","work-mistake":"work","ex-contact":"message","date-cancelled":"message","relationship-crisis":"conflict","rival-approach":"conflict","relationship-suspicion":"conflict","surprise-date":"romance","unexpected-expense":"money","caught-cold":"health","small-windfall":"money"};
const OPERATORS={">=":(a,b)=>a>=b,"<=":(a,b)=>a<=b,">":(a,b)=>a>b,"<":(a,b)=>a<b,"==":(a,b)=>a===b};
const ACTIVE_NPC_STATES=new Set([undefined,null,"active","introduced","available"]);

function eventCategory(event){return event.category??CATEGORY_BY_ID[event.id]??"general";}
function meetsConditions(state,event){return (event.conditions??[]).every(condition=>{if(condition.recentTag){const since=state.day-condition.withinDays;return (state.actionHistory??[]).filter(entry=>entry.tag===condition.recentTag&&entry.day>=since).length>=(condition.minCount??1);}const actual=condition.stat.split(".").reduce((value,key)=>value?.[key],state);return Boolean(OPERATORS[condition.operator]?.(actual,condition.value));});}
function featureAvailable(state,context,id){
  if(id==="haeun-contact")return Boolean(state.storyFlags?.haeun_contact_unlocked);
  if(id==="phone")return context.phoneUnlocked;
  if(id==="finance")return context.financeUnlocked;
  if(id==="job")return context.jobUnlocked;
  if(id==="map")return context.mapUnlocked;
  if(state.scenario?.unlockedActions?.includes(id)||state.scenario?.profileUnlocks?.includes(id))return true;
  return Boolean(state.scenario?.featureUnlocks?.[id]);
}

function inferredLocations(event){
  if(event.allowedLocations?.length)return event.allowedLocations;
  if(event.locationIds?.length)return event.locationIds;
  if(event.locationCategories?.length)return event.locationCategories;
  const category=eventCategory(event);
  if(OFFICE_CATEGORIES.has(category))return ["office","office-district"];
  if(category==="npc")return ["office","office-district","cafe"];
  if(category==="travel")return ["street","transport","landmark"];
  if(category==="friends")return ["home","cafe","street"];
  if(category==="romance"||category==="conflict"||category==="mystery")return ["home","cafe","street","restaurant"];
  if(category==="shopping")return ["shopping"];
  return [];
}

function inferredPhases(event){
  if(event.allowedPhases?.length)return event.allowedPhases;
  if(event.phases?.length)return event.phases.map(value=>typeof value==="number"?PHASE_NAMES[value]:value);
  if(event.timeOfDay)return [event.timeOfDay];
  return [];
}

function getTriggeredRecords(state,event){return [...(state.eventHistory??[]),...(state.microEventHistory??[])].filter(record=>record.id===event.id);}
function getDailyEventCount(state){const compatibility=Number(state.eventCompatibility?.dailyCounts?.[String(state.day)]??0);const sharedHistory=(state.eventHistory??[]).filter(record=>record.day===state.day&&record.origin==="story-free-action").length;return Math.max(compatibility,sharedHistory);}

export function getEventContext(state,overrides={}){
  const unlocks=state.scenario?.featureUnlocks??{};
  return {day:state.day,phase:PHASE_NAMES[state.phase]??"day",location:state.currentLocation??(state.day===1&&state.scenario?.enabled?"hospital":"home"),occurrence:"free-action-result",phoneUnlocked:state.scenario?.enabled?Boolean(unlocks.phone):true,financeUnlocked:state.scenario?.enabled?Boolean(unlocks.investment||unlocks.finance):true,jobUnlocked:state.scenario?.enabled?Boolean(unlocks.job||unlocks.career):true,mapUnlocked:state.scenario?.enabled?Boolean(unlocks.map):true,healthRiskAllowed:state.scenario?.enabled?state.health>=55&&state.energy>=30:true,npcIntroduced:state.scenario?.introducedNpcIds??[],activeStoryId:null,...overrides};
}

export function evaluateEventCompatibility(state,event,overrides={}){
  const context=getEventContext(state,overrides),blocks=[];
  const category=eventCategory(event),relationshipState=analyzeRelationshipState(state);
  if(state.scenario?.enabled===true&&context.occurrence!=="free-action-result")blocks.push("STORY_NOT_FREE_ACTION");
  if(getDailyEventCount(state)>=1)blocks.push("DAILY_BUDGET");
  const activeEvent=state.eventRuntime?.activeEvent;if(activeEvent&&activeEvent!==context.activeStoryId)blocks.push("EVENT_ACTIVE");
  const locations=inferredLocations(event);if(locations.length&&!locations.includes(context.location))blocks.push(`LOCATION:${context.location}`);
  const phases=inferredPhases(event);if(phases.length&&!phases.includes(context.phase))blocks.push(`PHASE:${context.phase}`);
  if(event.trigger==="location-enter"&&!event.allowedLocations?.length)blocks.push("LOCATION_TRIGGER_ONLY");
  if(event.trigger==="random-before-evening"&&["evening","night"].includes(context.phase))blocks.push("TRIGGER_WINDOW");
  if(event.dayRange&&(context.day<event.dayRange[0]||context.day>event.dayRange[1]))blocks.push("DAY_RANGE");
  if(PHONE_CATEGORIES.has(category)&&!context.phoneUnlocked)blocks.push("PHONE_LOCKED");
  if(OFFICE_CATEGORIES.has(category)&&!context.jobUnlocked)blocks.push("JOB_LOCKED");
  if(ECONOMY_CATEGORIES.has(category)&&!context.financeUnlocked)blocks.push("ECONOMY_LOCKED");
  if(!context.healthRiskAllowed&&((event.effects?.health??0)<0||(event.effects?.energy??0)<-5||event.requiresMobility))blocks.push("HEALTH_RECOVERY");
  if(Number.isFinite(event.minimumHealth)&&state.health<event.minimumHealth)blocks.push("HEALTH_LOW");
  if(Number.isFinite(event.maximumFatigue)&&state.fatigue>event.maximumFatigue)blocks.push("FATIGUE_HIGH");
  if(!meetsConditions(state,event))blocks.push("CONDITIONS");
  if(event.requiredFeatures?.some(id=>!featureAvailable(state,context,id)))blocks.push("FEATURE_LOCKED");
  if(event.requiredStoryFlags?.some(flag=>!state.storyFlags?.[flag]))blocks.push("STORY_FLAG_REQUIRED");
  const introduced=new Set(context.npcIntroduced);const missingNpcs=(event.npcRequirements??[]).filter(id=>{const npc=(state.npcs??[]).find(item=>item.id===id);return !introduced.has(id)||!npc?.active||!ACTIVE_NPC_STATES.has(npc.storyState);});if(missingNpcs.length)blocks.push("NPC_NOT_INTRODUCED");
  if(event.heroineIds?.length&&!event.heroineIds.includes(state.partner?.heroineId))blocks.push("HEROINE_ROUTE");
  if(event.excludedHeroineIds?.includes(state.partner?.heroineId))blocks.push("HEROINE_EXCLUDED");
  if(event.relationshipStates?.length&&!event.relationshipStates.includes(relationshipState))blocks.push(`RELATIONSHIP:${relationshipState}`);
  const missingEvents=(event.requiredEvents??[]).filter(id=>!state.storyFlags?.[`${id}:COMPLETED`]);if(missingEvents.length)blocks.push("CHAIN_REQUIRED");
  const missingMemories=(event.requiredMemories??[]).filter(tag=>!(state.memories??[]).some(memory=>memory.tags?.includes(tag)));if(missingMemories.length)blocks.push("MEMORY_REQUIRED");
  const triggered=getTriggeredRecords(state,event),last=triggered.at(-1),cooldownRemaining=last&&Number.isFinite(event.cooldown)?Math.max(0,event.cooldown-(state.day-last.day)):0;
  if(event.maxTriggerCount&&triggered.length>=event.maxTriggerCount)blocks.push("MAX_TRIGGER_COUNT");
  if(cooldownRemaining)blocks.push(`COOLDOWN:${cooldownRemaining}`);
  if(state.storyFlags?.[event.storyFlag]||event.forbiddenFlags?.some(flag=>state.storyFlags?.[flag]))blocks.push("ALREADY_RESOLVED");
  return {eligible:blocks.length===0,blocks,context,allowedLocations:locations,allowedPhases:phases,relationshipState,cooldownRemaining};
}

export function getCompatibleSharedEvents(state,overrides={},events=SHARED_EVENT_CATALOG){return events.filter(event=>evaluateEventCompatibility(state,event,overrides).eligible);}

function applyScenarioEffects(state,effects={}){state.scenario??={};for(const [key,value] of Object.entries(effects))state.scenario[key]=Math.max(0,Number(state.scenario[key]??0)+Number(value));}

export function rollSharedFreeActionEvent(state,{random=Math.random,overrides={},events=SHARED_EVENT_CATALOG}={}){
  state.eventCompatibility??={dailyCounts:{}};state.eventCompatibility.dailyCounts??={};
  const context=getEventContext(state,overrides),diagnostics=events.map(event=>({id:event.id,...evaluateEventCompatibility(state,event,context)}));
  state.eventCompatibility.lastExcluded=diagnostics.filter(item=>!item.eligible).map(item=>({id:item.id,blocks:item.blocks}));
  const candidates=events.filter((event,index)=>diagnostics[index].eligible);
  state.eventCompatibility.lastCandidates=candidates.map(item=>item.id);
  if(!candidates.length||Number(random())>=.35)return null;
  const ranked=[...candidates].sort((a,b)=>(b.priority??0)-(a.priority??0));
  const event=ranked[Math.min(ranked.length-1,Math.floor(Number(random())*ranked.length))];
  applyEffects(state,event.effects??{});applyScenarioEffects(state,event.scenarioEffects);
  state.storyFlags??={};const structured=Boolean(event.scenes?.length&&event.choices?.length);if(!structured&&event.storyFlag)state.storyFlags[event.storyFlag]=true;
  if(structured)activateSituationEvent(state,event);
  state.eventHistory??=[];const record={id:event.id,day:state.day,phase:state.phase,title:event.title??event.text,message:event.message??event.text,category:event.category??"story-free-action",tensionLevel:event.tensionLevel??"low",npcIds:[...(event.npcRequirements??[])],status:structured?"ACTIVE":"COMPLETED",origin:"story-free-action",context};state.eventHistory.push(record);
  const key=String(state.day);state.eventCompatibility.dailyCounts[key]=Number(state.eventCompatibility.dailyCounts[key]??0)+1;state.eventCompatibility.lastSelected=event.id;
  return {...event,text:event.text??event.message??event.hook,record};
}

export function getEventCompatibilityDiagnostics(state,overrides={}){return SHARED_EVENT_CATALOG.map(event=>({id:event.id,...evaluateEventCompatibility(state,event,overrides)}));}
