import { applyEffects } from "./game-core.mjs?v=9";
import { createDaySnapshot, getDailyReport } from "./night-manager.mjs?v=2";
import { rollSharedFreeActionEvent } from "./event-compatibility.mjs?v=15";

export const STORY_FREE_ACTION_WINDOWS=Object.freeze({
  1:Object.freeze([Object.freeze({
    id:"day1-hospital-evening",storySceneId:"m30-day1-hospital-awakening",phase:"evening",phaseIndex:2,location:"hospital",locationLabel:"병원",maxActions:1,
    title:"EVENING · 병원",description:"긴 하루였다. 지금은 무리하지 않는 선에서 잠시 무엇을 할지 정할 수 있다.",nextSchedule:"오늘은 병원에서 휴식해야 한다.",
    eventContext:Object.freeze({phoneUnlocked:false,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false})
  })]),
  2:Object.freeze([Object.freeze({
    id:"day2-home-evening",storySceneId:"m30-day2-rehabilitation",phase:"evening",phaseIndex:2,location:"home",locationLabel:"처음 돌아온 집",maxActions:1,
    title:"EVENING · 집",description:"하은이 돌아간 뒤다. 몸에 부담을 주지 않는 한 가지 행동만 하고 오늘을 마무리한다.",nextSchedule:"안전 확인을 마치면 DAY 3 아침으로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:false,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false})
  })]),
  3:Object.freeze([Object.freeze({
    id:"day3-discharge-room-day",storySceneId:"m30-day3-discharge-phone",phase:"day",phaseIndex:1,location:"hospital",locationLabel:"퇴원 병실",maxActions:1,
    title:"DAY TIME · 퇴원 병실",description:"보관품 인계와 퇴원 설명이 끝났다. 병원을 나서기 전 한 가지 준비만 마친다.",nextSchedule:"준비를 마치면 DAY 4, 집으로 돌아간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false})
  })]),
  4:Object.freeze([Object.freeze({
    id:"day4-home-night",storySceneId:"m30-day4-arrive-home",phase:"night",phaseIndex:3,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"NIGHT TIME · 나의 집",description:"하은과 증언 장부를 정리한 뒤다. 오늘 확인한 범위 안에서 한 가지 행동만 하고 쉰다.",nextSchedule:"오늘을 마치면 DAY 5, 회사 복귀 확인으로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false})
  })]),
  5:Object.freeze([Object.freeze({
    id:"day5-office-evening",storySceneId:"m30-day5-work-return",phase:"evening",phaseIndex:2,location:"office",locationLabel:"회사 사무실",maxActions:1,
    title:"EVENING · 회사 사무실",description:"두 시간의 복귀 확인을 마쳤다. 업무를 늘리지 않고 퇴근 전 한 가지 정리만 한다.",nextSchedule:"정리를 마치면 DAY 6, 다시 시작한 생활로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:false,healthRiskAllowed:false})
  })]),
  6:Object.freeze([Object.freeze({
    id:"day6-home-evening",storySceneId:"m30-day6-neighborhood",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"EVENING · 나의 집",description:"동네 생활 반경과 첫 현재형 데이트 방식을 정한 뒤다. 오늘 만든 기준 안에서 한 가지 행동만 한다.",nextSchedule:"정리를 마치면 DAY 7, 첫 현재형 데이트로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  7:Object.freeze([Object.freeze({
    id:"day7-home-evening",storySceneId:"m30-day7-first-present-date",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"EVENING · 나의 집",description:"첫 현재형 데이트를 무리 없이 조정하고 돌아왔다. 오늘 남길 기록이나 내일 준비 중 하나만 고른다.",nextSchedule:"정리를 마치면 DAY 8, 첫 독립 심부름으로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  8:Object.freeze([Object.freeze({
    id:"day8-home-evening",storySceneId:"m30-day8-independent-errand",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"EVENING · 나의 집",description:"첫 독립 심부름과 귀가 보고를 마쳤다. 오늘 생긴 우편·구매 기록·내일 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 9, 제한된 두 번째 직장 적응 방문으로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  9:Object.freeze([Object.freeze({
    id:"day9-home-evening",storySceneId:"m30-day9-second-office-adaptation",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"EVENING · 나의 집",description:"90분의 두 번째 직장 적응과 귀가 보고를 마쳤다. 현재 업무 기록이나 다음 근무 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 10, 세 시간 근무 리듬과 현재 동료 점심으로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  10:Object.freeze([Object.freeze({
    id:"day10-home-evening",storySceneId:"m30-day10-three-hour-work-rhythm",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"EVENING · 나의 집",description:"세 시간 근무와 현재 동료 점심을 마치고 돌아왔다. 일·회복·관계 기록이나 다음 생활 계획 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 11, 현재 생활 계획을 이어 간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  11:Object.freeze([Object.freeze({
    id:"day11-home-evening",storySceneId:"m30-day11-current-life-plan",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"EVENING · 나의 집",description:"현재 생활표와 일정 충돌·공유 규칙을 완성했다. 오늘 만든 경계나 다음 확인 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 12, 현재 계정과 생활비 확인으로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  12:Object.freeze([Object.freeze({
    id:"day12-home-evening",storySceneId:"m30-day12-current-account-review",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"EVENING · 나의 집",description:"현재 계정과 생활비의 소유권을 확인했다. 읽기 전용 금융 기록이나 다음 예산 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 13, 현재 가계 예산 합의로 넘어간다.",
    eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  13:Object.freeze([Object.freeze({
    id:"day13-home-evening",storySceneId:"m30-day13-current-household-budget",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,
    title:"EVENING · 나의 집",description:"현재 가계 예산의 소유권·부담·검토 범위를 합의했다. 공동 장부나 다음 소비 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 14, 현재의 선택 소비로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  14:Object.freeze([Object.freeze({
    id:"day14-home-evening",storySceneId:"m30-day14-current-choice-spending",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"소액 선택 소비와 선물 동의 규칙을 확인했다. 구매 기록이나 다음 여가 계획 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 15, 현재의 여가 데이트로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  15:Object.freeze([Object.freeze({
    id:"day15-cafe-evening",storySceneId:"m30-day15-current-leisure-date",phase:"evening",phaseIndex:2,location:"cafe",locationLabel:"동네 카페",maxActions:1,title:"EVENING · 동네 카페",description:"현재형 여가 데이트를 마쳤다. 오늘의 선택·변경·공개 경계 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 16, 현재의 관계망 확인으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  16:Object.freeze([Object.freeze({
    id:"day16-home-evening",storySceneId:"m30-day16-current-social-circle",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"지훈과 현재 연락·만남·정보 공유 범위를 다시 합의했다. 한 사람의 관계 기록이나 다음 건강 루틴 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 17, 현재의 건강 루틴으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  17:Object.freeze([Object.freeze({
    id:"day17-home-evening",storySceneId:"m30-day17-current-health-routine",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"공식 현재 처방과 중단 기준으로 건강 루틴을 만들었다. 복약 기록·의료 연락·데이터 경계 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 18, 현재 집의 안전 확인으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  18:Object.freeze([Object.freeze({
    id:"day18-home-evening",storySceneId:"m30-day18-current-home-safety",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"현재 생활 동선과 약 보관, 비상 출입의 범위를 확인했다. 안전 기록이나 다음 공동 생활 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 19, 현재의 공동 집안일로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  19:Object.freeze([Object.freeze({
    id:"day19-home-evening",storySceneId:"m30-day19-current-shared-chore",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"현재 체력과 개인 구역 경계로 공동 집안일을 다시 나눴다. 역할 기록이나 다음 공동 식사 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 20, 현재형 공동 식사 준비로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  20:Object.freeze([Object.freeze({
    id:"day20-home-evening",storySceneId:"m30-day20-current-shared-meal",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"현재 건강·비용·조리 부담에 맞춘 공동 식사를 마쳤다. 식사 기록이나 다음 전일 근무 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 21, 현재형 전일 근무로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  21:Object.freeze([Object.freeze({
    id:"day21-office-evening",storySceneId:"m30-day21-current-full-workday",phase:"evening",phaseIndex:2,location:"office",locationLabel:"회사 사무실",maxActions:1,title:"EVENING · 회사 사무실",description:"현재 권한과 휴식·퇴근 기준을 지킨 첫 전일 근무를 마쳤다. 인계 기록이나 다음 회복일 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 22, 현재형 회복일로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  22:Object.freeze([Object.freeze({
    id:"day22-home-evening",storySceneId:"m30-day22-current-recovery-day",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"현재 몸의 신호와 연락하지 않을 시간을 지킨 회복일이다. 최소 기록이나 다음 가족 연락 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 23, 현재 가족 연락 확인으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  23:Object.freeze([Object.freeze({
    id:"day23-home-evening",storySceneId:"m30-day23-current-family-contact",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"확인된 한 사람과 현재형 가족 연락을 마쳤다. 연락 기록이나 다음 결혼 의사 확인 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 24, 현재의 결혼 의사 확인으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  24:Object.freeze([Object.freeze({
    id:"day24-home-evening",storySceneId:"m30-day24-current-commitment-check",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"현재의 이유와 권리로 결혼 의사를 다시 확인했다. 동의 기록이나 다음 예식 범위 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 25, 현재의 예식 범위 확인으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  25:Object.freeze([Object.freeze({
    id:"day25-home-evening",storySceneId:"m30-day25-current-wedding-scope",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"현재 동의한 예식 형식·비용·초대·공개 범위를 정했다. 범위 기록이나 다음 법적 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 26, 현재의 법적 준비 확인으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  26:Object.freeze([Object.freeze({
    id:"day26-home-evening",storySceneId:"m30-day26-current-legal-preparation",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"현재 서류·법적 효과·개별 권리·직접 서명과 중단권을 확인했다. 법적 준비 기록이나 다음 최종 점검 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 27, 현재의 최종 점검으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  27:Object.freeze([Object.freeze({
    id:"day27-home-evening",storySceneId:"m30-day27-current-final-check",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"현재 의사·몸과 감정·실행 항목·취소와 귀가 경로를 최종 점검했다. 기록이나 다음 리허설 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 28, 현재의 예식 리허설로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  28:Object.freeze([Object.freeze({
    id:"day28-home-evening",storySceneId:"m30-day28-current-ceremony-rehearsal",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"집에서 짧은 예식 동선과 실제 중단 신호를 시험했다. 리허설 기록이나 다음 전날 재확인 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 29, 예식 전날 현재 의사 재확인으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  29:Object.freeze([Object.freeze({
    id:"day29-home-evening",storySceneId:"m30-day29-current-eve-reconfirmation",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"예식 전날 각자의 현재 의사와 몸 상태, 진행·축소·연기 선택을 확인했다. 기록이나 당일 준비 중 하나만 정리한다.",nextSchedule:"정리를 마치면 DAY 30, 당일의 현재 결혼 선택으로 넘어간다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })]),
  30:Object.freeze([Object.freeze({
    id:"day30-home-evening",storySceneId:"m30-day30-current-wedding-decision",phase:"evening",phaseIndex:2,location:"home",locationLabel:"나의 집",maxActions:1,title:"EVENING · 나의 집",description:"DAY 30의 현재 결혼 선택을 마쳤다. 결과를 외부 평가와 분리해 기록하거나 회복하는 행동 하나만 고른다.",nextSchedule:"정리를 마치면 30일의 선택을 바탕으로 엔딩 리포트가 열린다.",eventContext:Object.freeze({phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false})
  })])
});

export const DAY1_HOSPITAL_ACTIONS=Object.freeze([
  Object.freeze({id:"talk-with-haeun",icon:"♥",title:"하은과 조금 더 이야기한다",description:"오늘 들은 이야기를 서두르지 않고 조금 더 나눈다.",effects:{affection:8,trust:10,energy:-4,stress:-2},scenarioEffects:{haeunAffection:2,haeunTrust:3},flag:"day1_free_talk_haeun",summary:"하은과 조금 가까워졌고, 서로의 속도를 확인했다."}),
  Object.freeze({id:"reflect-on-accident",icon:"◈",title:"사고에 대해 생각해본다",description:"들은 사실과 아직 기억나지 않는 부분을 조용히 구분한다.",effects:{stress:3,energy:-3},scenarioEffects:{investigation:2,accidentSearchCount:1},flag:"accident_interest",summary:"사고에 관한 의문을 잊지 않기로 했다."}),
  Object.freeze({id:"reflect-on-family",icon:"◇",title:"가족에 대해 생각해본다",description:"사진이나 새로운 단서 없이, 오늘 들은 말과 감정만 정리한다.",effects:{stress:4,energy:-3},scenarioEffects:{memoryRecovery:1},flag:"day1_family_reflection",summary:"가족에 관한 감정을 억지로 결론 내리지 않고 남겨 두었다."}),
  Object.freeze({id:"observe-hospital-room",icon:"⌕",title:"병실을 둘러본다",description:"침대 주변과 창문, 의료 장비를 무리하지 않는 선에서 살핀다.",effects:{energy:-3,stress:1},scenarioEffects:{investigation:1},flag:"day1_hospital_observed",summary:"병실의 익숙하지 않은 풍경을 차분히 관찰했다."}),
  Object.freeze({id:"rest-safely",icon:"☾",title:"그냥 쉰다",description:"지금의 몸에 가장 필요한 일을 선택한다.",effects:{energy:12,fatigue:-10,stress:-6,health:2},scenarioEffects:{},flag:"day1_recovery_rest",summary:"몸이 조금 회복됐고 숨이 한결 편안해졌다."})
]);

export const DAY2_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"review-three-columns",icon:"≡",title:"세 칸 메모를 정리한다",description:"확인한 것·들은 것·모르는 것을 더 늘리지 않고 정돈한다.",effects:{confidence:4,energy:-2,stress:-1},scenarioEffects:{investigation:2},flag:"day2_free_review_columns",summary:"오늘 얻은 사실과 아직 모르는 것을 섞지 않고 정리했다."}),
  Object.freeze({id:"check-medicine-and-water",icon:"＋",title:"약과 물을 확인한다",description:"복약 순서와 물만 챙기고 몸 상태를 다시 확인한다.",effects:{health:3,energy:-2,stress:-3},scenarioEffects:{},flag:"day2_free_medicine_check",summary:"첫 저녁의 복약과 안전 확인을 마쳤다."}),
  Object.freeze({id:"send-safe-arrival",icon:"□",title:"하은에게 도착 상태를 남긴다",description:"예비폰으로 현재 증상과 문 잠금 여부만 짧게 알린다.",effects:{trust:5,affection:2,energy:-2},scenarioEffects:{haeunTrust:2},flag:"day2_free_safe_arrival",requiresFlag:"haeun_contact_unlocked",summary:"필요한 사실만 짧게 공유해 연락의 경계를 지켰다."}),
  Object.freeze({id:"observe-home-quietly",icon:"⌕",title:"거실 동선만 확인한다",description:"새 서랍이나 문은 열지 않고 물·약·침대까지의 길만 익힌다.",effects:{confidence:3,energy:-3,stress:-1},scenarioEffects:{homeSearchCount:1},flag:"day2_free_home_route",summary:"오늘 밤 필요한 생활 동선만 안전하게 확인했다."}),
  Object.freeze({id:"rest-after-homecoming",icon:"☾",title:"오늘은 바로 쉰다",description:"더 확인하지 않고 회복을 우선한다.",effects:{energy:14,fatigue:-12,stress:-6,health:3},scenarioEffects:{},flag:"day2_recovery_rest",summary:"집에 돌아온 첫날은 더 무리하지 않고 쉬었다."})
]);

export const DAY3_DISCHARGE_ACTIONS=Object.freeze([
  Object.freeze({id:"review-discharge-checklist",icon:"✓",title:"퇴원 체크리스트를 대조한다",description:"약·외래 일정·비상 연락 순서만 서류와 맞춰 본다.",effects:{confidence:4,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day3_free_discharge_checklist",summary:"퇴원 뒤 지켜야 할 안전 기준을 빠뜨리지 않고 확인했다."}),
  Object.freeze({id:"set-medication-alarm",icon:"▣",title:"복약 알람만 설정한다",description:"돌아온 휴대폰에서 아침·저녁 복약 알람만 켠다.",effects:{health:3,confidence:3,energy:-2},scenarioEffects:{},flag:"day3_free_medication_alarm",requiresAction:"smartphone-basic",summary:"과거 기록은 열지 않고 지금 필요한 복약 알람만 설정했다."}),
  Object.freeze({id:"organize-returned-items",icon:"◇",title:"돌아온 물건을 다시 정리한다",description:"휴대폰·지갑·열쇠와 인계 영수증을 한 가방에 나눠 넣는다.",effects:{confidence:4,energy:-2,stress:-1},scenarioEffects:{investigation:2},flag:"day3_free_returned_items",summary:"돌아온 물건과 출처 기록을 섞이지 않게 정리했다."}),
  Object.freeze({id:"confirm-ride-boundary",icon:"♥",title:"하은과 귀가 순서를 확인한다",description:"이동 중 증상 확인과 휴식 요청 기준만 짧게 맞춘다.",effects:{trust:6,affection:2,energy:-2,stress:-2},scenarioEffects:{haeunTrust:2},flag:"day3_free_ride_boundary",summary:"하은과 귀가 중 도움의 범위와 중단 기준을 합의했다."}),
  Object.freeze({id:"rest-before-discharge",icon:"☾",title:"출발 전에 잠깐 쉰다",description:"추가 확인을 멈추고 이동할 체력을 남긴다.",effects:{energy:12,fatigue:-9,stress:-5,health:2},scenarioEffects:{},flag:"day3_recovery_rest",summary:"병원을 나서기 전 몸 상태를 안정시키고 체력을 아꼈다."})
]);

export const DAY4_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"finish-testimony-ledger",icon:"≡",title:"증언 장부를 마무리한다",description:"확인한 사실·출처가 붙은 증언·미확인 내용을 세 칸에 정리한다.",effects:{confidence:5,energy:-3,stress:-1},scenarioEffects:{investigation:3},flag:"day4_free_finish_ledger",requiresAction:"testimony-ledger",summary:"오늘 들은 말을 출처와 확인 상태에 따라 분리해 남겼다."}),
  Object.freeze({id:"archive-jihoon-followup",icon:"□",title:"지훈의 자료 요청을 저장한다",description:"다음에 받을 원본 사진 목록만 메모하고 추가 연락은 내일로 미룬다.",effects:{social:3,confidence:3,energy:-2},scenarioEffects:{investigation:2},flag:"day4_free_archive_jihoon",requiresAction:"friend-archive-followup",summary:"지훈에게 확인할 다음 자료의 범위를 명확히 남겼다."}),
  Object.freeze({id:"hold-work-message",icon:"▣",title:"회사 메시지를 내일 일정으로 보낸다",description:"민호의 메시지는 열어 둔 채 답변과 업무 확인은 DAY 5로 미룬다.",effects:{confidence:4,stress:-3,energy:-1},scenarioEffects:{},flag:"day4_free_hold_work_message",requiresFlag:"day4WorkContactPending",summary:"회사 연락을 섣불리 해석하지 않고 내일 확인할 일정으로 분리했다."}),
  Object.freeze({id:"check-in-with-haeun",icon:"♥",title:"하은과 오늘의 경계를 확인한다",description:"공유한 내용과 아직 말하지 않은 내용을 서로 한 문장씩 확인한다.",effects:{trust:7,affection:3,energy:-2,stress:-2},scenarioEffects:{haeunTrust:3},flag:"day4_free_haeun_boundary",summary:"서로 알고 있는 범위와 기다려야 할 부분을 다시 확인했다."}),
  Object.freeze({id:"rest-after-social-recovery",icon:"☾",title:"기록을 덮고 쉰다",description:"친구와 과거에 대한 추가 확인을 멈추고 회복을 우선한다.",effects:{energy:14,fatigue:-11,stress:-7,health:2},scenarioEffects:{},flag:"day4_recovery_rest",summary:"오늘의 자료를 더 해석하지 않고 몸과 머리를 쉬게 했다."})
]);

export const DAY5_OFFICE_ACTIONS=Object.freeze([
  Object.freeze({id:"archive-current-work-boundary",icon:"≡",title:"오늘의 업무 경계를 기록한다",description:"확인한 자료·보류한 판단·다음 방문 범위를 세 줄로 남긴다.",effects:{work:4,confidence:5,energy:-3,stress:-1},scenarioEffects:{investigation:2},flag:"day5_free_work_boundary",requiresAction:"day5-work-trial",summary:"성과가 아니라 오늘 지킨 업무 범위와 중단 기준을 기록했다."}),
  Object.freeze({id:"confirm-team-map",icon:"◇",title:"민호와 현재 팀 지도만 확인한다",description:"오늘 만난 사람의 현재 역할만 대조하고 과거 평가는 다음으로 미룬다.",effects:{social:4,work:2,energy:-2},scenarioEffects:{coworkerRelation:2},flag:"day5_free_team_map",requiresAction:"day5-team-map",summary:"민호와 현재 팀의 역할 관계만 짧게 확인했다."}),
  Object.freeze({id:"save-next-briefing",icon:"▣",title:"다음 방문 브리핑을 예약한다",description:"다음에 확인할 자료와 시간 제한을 일정에 저장한다.",effects:{work:4,confidence:4,energy:-2},scenarioEffects:{seojinStatusInterest:2},flag:"day5_free_next_briefing",requiresFlag:"day5ReturnPlanReady",summary:"다음 방문의 자료·시간·중단 조건을 일정으로 남겼다."}),
  Object.freeze({id:"message-haeun-after-work",icon:"♥",title:"하은에게 종료 상태만 알린다",description:"물과 약, 두 시간 종료 여부만 짧게 답하고 보고는 집에서 한다.",effects:{trust:6,affection:2,energy:-1,stress:-2},scenarioEffects:{haeunTrust:2},flag:"day5_free_haeun_update",requiresFlag:"haeun_contact_unlocked",summary:"하은에게 필요한 안전 정보만 공유하고 긴 설명은 미뤘다."}),
  Object.freeze({id:"leave-office-on-time",icon:"☾",title:"정한 시간에 바로 퇴근한다",description:"추가 자료를 열지 않고 회복을 위해 회사를 나선다.",effects:{energy:11,fatigue:-9,stress:-6,health:2},scenarioEffects:{},flag:"day5_recovery_leave_on_time",summary:"두 시간이라는 중단 기준을 지키고 제시간에 회사를 나섰다."})
]);

export const DAY6_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"update-current-life-map",icon:"⌖",title:"현재 생활 지도를 갱신한다",description:"약국·마트·카페·공원과 안전한 귀가 기준만 지도에 표시한다.",effects:{confidence:5,energy:-3,stress:-1},scenarioEffects:{investigation:2},flag:"day6_free_update_map",requiresAction:"current-life-map",summary:"기억이 아니라 오늘 직접 확인한 동네 경로로 생활 지도를 갱신했다."}),
  Object.freeze({id:"save-medication-routine",icon:"＋",title:"복약 동선을 저장한다",description:"약 보관 위치와 아침·저녁 복약 순서를 현재 생활 기준으로 남긴다.",effects:{health:4,confidence:3,energy:-2},scenarioEffects:{},flag:"day6_free_medication_routine",requiresFlag:"day6MedicationRoutineSaved",summary:"약국에서 확인한 복약 순서를 집의 현재 동선에 맞게 저장했다."}),
  Object.freeze({id:"file-temporary-payment",icon:"▣",title:"임시 결제 영수증을 분리한다",description:"하은의 예비 계정으로 결제한 금액과 소유권 미확인 상태를 기록한다.",effects:{confidence:4,stress:-2,energy:-2},scenarioEffects:{investigation:2},flag:"day6_free_temporary_payment",summary:"임시 결제를 빚이나 공동 자산으로 단정하지 않고 별도 기록했다."}),
  Object.freeze({id:"confirm-current-date-plan",icon:"♥",title:"첫 현재형 데이트 규칙을 확인한다",description:"장소보다 선택권·중단 기준·서로의 현재 취향을 다시 합의한다.",effects:{trust:6,affection:5,energy:-2,stress:-2},scenarioEffects:{haeunTrust:2,haeunAffection:2},flag:"day6_free_date_rule",requiresAction:"plan-current-date",summary:"하은과 첫 현재형 데이트의 선택권과 중단 기준을 확인했다."}),
  Object.freeze({id:"rest-after-neighborhood-walk",icon:"☾",title:"지도와 영수증을 덮고 쉰다",description:"오늘 확인한 생활 반경을 더 넓히지 않고 회복을 우선한다.",effects:{energy:14,fatigue:-11,stress:-7,health:3},scenarioEffects:{},flag:"day6_recovery_rest",summary:"동네 외출 뒤 추가 확인을 멈추고 충분히 쉬었다."})
]);

export const DAY7_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"review-present-date-memory",icon:"▧",title:"오늘의 데이트 기록을 확인한다",description:"사진·두 문장·공동 규칙 중 오늘 선택한 기록만 다시 확인한다.",effects:{affection:4,trust:4,confidence:3,energy:-2},scenarioEffects:{haeunAffection:2,haeunTrust:2},flag:"day7_free_review_date_memory",requiresAction:"review-present-date-memory",summary:"과거 재현이 아닌 오늘 함께 만든 데이트 기록을 확인했다."}),
  Object.freeze({id:"record-recovery-adjustment",icon:"＋",title:"일정 변경과 증상을 기록한다",description:"멈춘 시각·증상·줄인 활동과 회복 결과를 현재 기록으로 남긴다.",effects:{health:3,confidence:4,energy:-2,stress:-2},scenarioEffects:{},flag:"day7_free_recovery_adjustment",requiresFlag:"day7ChangeSharedNotFailed",summary:"계획을 줄인 일을 실패가 아닌 안전한 변경으로 기록했다."}),
  Object.freeze({id:"prepare-independent-errand",icon:"⌖",title:"내일 혼자 할 일을 준비한다",description:"우편함과 세제 구입 경로만 확인하고 약 관련 전화는 공동 확인으로 남긴다.",effects:{confidence:5,energy:-3,stress:1},scenarioEffects:{investigation:2},flag:"day7_free_prepare_errand",requiresAction:"plan-independent-errand",summary:"혼자 할 일과 함께 확인할 일을 분리해 DAY 8 준비를 마쳤다."}),
  Object.freeze({id:"confirm-change-rule-with-haeun",icon:"♥",title:"하은과 변경 규칙을 저장한다",description:"계획은 함께 세우고 변경은 실패로 세지 않는다는 규칙을 확인한다.",effects:{trust:7,affection:4,energy:-2,stress:-3},scenarioEffects:{haeunTrust:3,haeunAffection:2},flag:"day7_free_shared_change_rule",requiresAction:"shared-change-rule",summary:"하은과 계획 변경을 실패로 보지 않는 공동 규칙을 저장했다."}),
  Object.freeze({id:"rest-after-first-date",icon:"☾",title:"오늘 기록을 덮고 쉰다",description:"데이트를 더 평가하지 않고 체력과 회복을 우선한다.",effects:{energy:15,fatigue:-12,stress:-8,health:4},scenarioEffects:{},flag:"day7_recovery_rest",summary:"첫 데이트의 의미를 더 해석하지 않고 충분히 쉬었다."})
]);

export const DAY8_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"file-current-mail",icon:"▧",title:"현재 우편을 처리 목록에 넣는다",description:"발송일·기한·현재 주소만 확인하고 과거 수취인 관계는 추측하지 않는다.",effects:{confidence:4,energy:-2,stress:-1},scenarioEffects:{investigation:3},flag:"day8_free_file_current_mail",requiresAction:"review-current-mail",summary:"현재 우편의 처리 기한과 확인할 출처만 목록에 남겼다."}),
  Object.freeze({id:"record-household-test",icon:"▣",title:"오늘 고른 생활용품을 기록한다",description:"과거 구매 이력 대신 성분·용량·사용 뒤 확인할 기준을 저장한다.",effects:{confidence:4,energy:-2},scenarioEffects:{investigation:2},flag:"day8_free_household_test",requiresFlag:"day8CurrentHouseholdChoiceSaved",summary:"오늘 선택한 생활용품과 다음 판단 기준을 현재 기록으로 남겼다."}),
  Object.freeze({id:"save-independent-errand-rule",icon:"⌖",title:"다음 혼자 외출의 경계를 저장한다",description:"연락 조건·중단 기준·같이 확인할 일을 독립 심부름 계약에 반영한다.",effects:{confidence:5,trust:4,energy:-2,stress:-2},scenarioEffects:{haeunTrust:2},flag:"day8_free_independent_rule",requiresAction:"independent-neighborhood-errand",summary:"혼자 할 수 있는 일과 함께 확인할 일의 경계를 저장했다."}),
  Object.freeze({id:"prepare-limited-office-return",icon:"≡",title:"DAY 9 직장 방문 범위를 준비한다",description:"이동 경로·체력 중단선·현재 업무 확인 범위만 세 칸으로 정리한다.",effects:{work:3,confidence:4,energy:-3},scenarioEffects:{seojinStatusInterest:1},flag:"day8_free_prepare_office",requiresAction:"prepare-limited-office-return",summary:"다음 회사 방문의 시간과 자료 범위를 늘리지 않고 준비했다."}),
  Object.freeze({id:"rest-after-independent-errand",icon:"☾",title:"오늘은 여기서 쉰다",description:"혼자 다녀온 결과를 더 평가하지 않고 회복을 우선한다.",effects:{energy:15,fatigue:-12,stress:-7,health:4},scenarioEffects:{},flag:"day8_recovery_rest",summary:"첫 독립 심부름 뒤 추가 확인을 멈추고 충분히 쉬었다."})
]);

export const DAY8_V3_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-jihoon-present-boundary",icon:"◇",title:"지훈의 현재 이야기를 정리한다",description:"과거의 나를 단정하지 않고 오늘 직접 들은 일·취향·관계만 기록한다.",effects:{confidence:4,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day8_v3_free_present_boundary",summary:"지훈이 오늘 직접 말한 현재의 이야기와 아직 확인하지 못한 과거를 분리했다."}),
  Object.freeze({id:"save-public-credit-only",icon:"▣",title:"공개된 작업 크레딧만 남긴다",description:"함께 본 공개 영상의 크레딧만 저장하고 비공개 클라이언트 작업은 기록하지 않는다.",effects:{trust:4,confidence:3,energy:-2},scenarioEffects:{investigation:1},flag:"day8_v3_free_public_credit",summary:"공개된 작업과 지훈이 공개하지 않은 일을 분리해 기록했다."}),
  Object.freeze({id:"save-haeun-call-promise",icon:"♥",title:"하은과 나눈 저녁 연락을 남긴다",description:"서로 따로 보낸 오후와 직접 말한 약속 변경·귀가 연락만 현재의 기억으로 저장한다.",effects:{affection:4,trust:4,energy:-2,stress:-2},scenarioEffects:{haeunTrust:1},flag:"day8_v3_free_haeun_call",summary:"각자의 오후를 존중하며 나눈 저녁 연락을 현재의 관계 기록으로 남겼다."}),
  Object.freeze({id:"prepare-day9-color-reply",icon:"▤",title:"내일 답할 옷 색을 메모한다",description:"사진 속 두 색만 적어 두고 구매·선물·과거 취향은 아직 추측하지 않는다.",effects:{confidence:3,energy:-1},scenarioEffects:{investigation:1},flag:"day8_v3_free_color_reply",summary:"DAY 9에 직접 답할 두 색만 메모하고 의미 판단은 보류했다."}),
  Object.freeze({id:"rest-after-jihoon-afternoon",icon:"☾",title:"오늘 대화를 덮고 쉰다",description:"지훈과 하은의 말을 더 비교하지 않고 오늘 생긴 현재의 기억을 그대로 둔다.",effects:{energy:15,fatigue:-12,stress:-7,health:4},scenarioEffects:{},flag:"day8_v3_recovery_rest",summary:"서로 다른 오후를 결론 내리지 않고 충분히 쉬었다."})
]);

export const DAY9_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"archive-ninety-minute-boundary",icon:"≡",title:"90분 업무 경계를 기록한다",description:"오늘 열람한 범위·맡지 않은 승인·종료 시각을 현재 업무 기록으로 남긴다.",effects:{work:4,confidence:5,energy:-3,stress:-2},scenarioEffects:{investigation:2},flag:"day9_free_archive_boundary",requiresAction:"bounded-office-contribution",summary:"도움과 승인 권한을 분리한 90분 업무 경계를 기록했다."}),
  Object.freeze({id:"review-current-queue",icon:"▧",title:"현재 업무 지도를 다시 확인한다",description:"담당·마감·막힌 지점만 확인하고 닫힌 과거 자료는 열지 않는다.",effects:{work:4,confidence:4,energy:-3},scenarioEffects:{investigation:3},flag:"day9_free_review_queue",requiresAction:"review-current-queue",summary:"현재 담당과 막힌 지점만 업무 지도에 남겼다."}),
  Object.freeze({id:"separate-coworker-feedback",icon:"◇",title:"동료 피드백을 두 칸으로 나눈다",description:"업무 판단과 팀 상호작용을 분리해 한 문장을 전체 평판으로 확대하지 않는다.",effects:{social:4,work:3,confidence:3,energy:-2},scenarioEffects:{coworkerRelation:2,seojinStatusInterest:1},flag:"day9_free_separate_feedback",requiresAction:"current-coworker-lunch",summary:"업무와 관계 피드백을 서로 다른 기록으로 분리했다."}),
  Object.freeze({id:"prepare-three-hour-rhythm",icon:"⌛",title:"DAY 10 세 시간 리듬을 준비한다",description:"중간 휴식·승인 금지·점심 중단 기준만 일정에 저장한다.",effects:{work:3,health:2,confidence:4,energy:-3},scenarioEffects:{},flag:"day9_free_prepare_rhythm",requiresFlag:"day10ThreeHourWorkRhythmPending",summary:"다음 근무의 시간·휴식·책임 범위를 늘리지 않고 준비했다."}),
  Object.freeze({id:"rest-after-second-office",icon:"☾",title:"업무 기록을 덮고 쉰다",description:"두 번째 출근을 더 평가하지 않고 회복을 우선한다.",effects:{energy:15,fatigue:-12,stress:-8,health:4},scenarioEffects:{},flag:"day9_recovery_rest",summary:"두 번째 직장 적응 뒤 추가 판단을 멈추고 충분히 쉬었다."})
]);

export const DAY9_V3_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-day9-fit-memory",icon:"▣",title:"오늘의 피팅 사진을 정리한다",description:"하은이 편하다고 말한 옷과 직접 남긴 사진만 저장하고 과거 취향은 추측하지 않는다.",effects:{affection:3,confidence:4,energy:-2},scenarioEffects:{haeunAffection:1,investigation:1},flag:"day9_v3_free_fit_memory",summary:"오늘 직접 확인한 착용감과 피팅 사진을 현재의 기억으로 남겼다."}),
  Object.freeze({id:"record-day9-gift-boundary",icon:"♥",title:"선물의 거절권을 기록한다",description:"선물 의도·구매·수락·소유·착용은 서로 다른 선택이라는 오늘의 경계를 남긴다.",effects:{trust:5,affection:2,confidence:3,energy:-2,stress:-2},scenarioEffects:{haeunTrust:2},flag:"day9_v3_free_gift_boundary",summary:"선물하고 싶은 마음과 하은이 받거나 거절할 권리를 분리해 기록했다."}),
  Object.freeze({id:"save-day9-purchase-ownership",icon:"▧",title:"오늘 산 물건의 소유를 확인한다",description:"영수증과 실제 소유자만 확인하고 구매하지 않은 물건이나 착용 상태를 만들어 내지 않는다.",effects:{confidence:5,energy:-2,stress:-1},scenarioEffects:{investigation:1},flag:"day9_v3_free_purchase_ownership",summary:"오늘 결제된 물건의 영수증·소유자·미장착 상태를 현재 기록으로 확인했다."}),
  Object.freeze({id:"prepare-day10-contact-note",icon:"▤",title:"내일 연락할 시간을 메모한다",description:"장보기 전에 연락하겠다는 약속과 아직 정하지 않은 메뉴만 적어 둔다.",effects:{trust:3,confidence:4,energy:-1},scenarioEffects:{haeunTrust:1},flag:"day9_v3_free_day10_contact",summary:"DAY 10 장보기 전 연락 약속과 메뉴 미정 상태를 그대로 메모했다."}),
  Object.freeze({id:"rest-after-day9-shopping",icon:"☾",title:"쇼핑 기록을 닫고 쉰다",description:"오늘의 선택을 과거 취향의 정답으로 만들지 않고 현재의 기억으로 둔 채 쉰다.",effects:{energy:15,fatigue:-12,stress:-8,health:4},scenarioEffects:{},flag:"day9_v3_recovery_rest",summary:"오늘 함께 고른 것들을 더 해석하지 않고 충분히 쉬었다."})
]);

export const DAY10_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"file-three-hour-rhythm",icon:"⌛",title:"세 시간 근무 리듬을 저장한다",description:"업무 블록·휴식·종료 시각을 실제 실행 기록과 대조한다.",effects:{work:4,health:2,confidence:4,energy:-3},scenarioEffects:{investigation:2},flag:"day10_free_file_rhythm",requiresAction:"three-hour-work-rhythm",summary:"세 시간 근무의 업무와 휴식 리듬을 현재 기록으로 저장했다."}),
  Object.freeze({id:"archive-current-coworker-lunch",icon:"◇",title:"현재 동료 점심 기록을 남긴다",description:"과거 평판 대신 오늘 직접 들은 역할·변화·경계만 기록한다.",effects:{social:5,confidence:3,energy:-2},scenarioEffects:{coworkerRelation:2},flag:"day10_free_archive_lunch",requiresAction:"current-coworker-lunch-record",summary:"현재 동료에게 직접 확인한 정보만 점심 기록으로 남겼다."}),
  Object.freeze({id:"separate-three-daily-scores",icon:"≡",title:"일·몸·사람을 세 칸으로 나눈다",description:"업무 결과·회복 상태·동료 관계가 서로의 평가를 대신하지 않게 분리한다.",effects:{work:2,health:2,social:2,confidence:4,energy:-2,stress:-2},scenarioEffects:{},flag:"day10_free_separate_scores",requiresAction:"separate-work-recovery-social",summary:"같은 하루의 업무·몸·관계를 서로 다른 사실로 기록했다."}),
  Object.freeze({id:"prepare-current-life-plan",icon:"▧",title:"DAY 11 현재 생활 계획을 준비한다",description:"내일 확인할 생활 범위와 중단 조건만 한 장에 적는다.",effects:{confidence:4,energy:-2,stress:-1},scenarioEffects:{investigation:2},flag:"day10_free_prepare_day11",requiresFlag:"day11CurrentLifePlanPending",summary:"다음 날의 현재 생활 계획을 추측 없이 준비했다."}),
  Object.freeze({id:"rest-after-three-hour-work",icon:"☾",title:"세 칸 기록을 덮고 쉰다",description:"첫 세 시간 근무를 더 평가하지 않고 회복을 우선한다.",effects:{energy:16,fatigue:-13,stress:-8,health:4},scenarioEffects:{},flag:"day10_recovery_rest",summary:"세 시간 근무 뒤 추가 판단을 멈추고 충분히 쉬었다."})
]);

export const DAY11_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-week-anchor",icon:"▦",title:"한 주의 기준 일정을 저장한다",description:"회복·근무·공동 약속 중 오늘 선택한 첫 기준과 출처를 남긴다.",effects:{confidence:5,health:2,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day11_free_save_anchor",requiresAction:"current-week-anchor",summary:"출처와 소유권이 있는 한 주의 첫 기준을 저장했다."}),
  Object.freeze({id:"record-schedule-conflict-rule",icon:"⇄",title:"일정 충돌 규칙을 기록한다",description:"겹친 일정의 이동·축소·유지 권한과 우선순위를 한 문장으로 남긴다.",effects:{confidence:5,energy:-2,stress:-2},scenarioEffects:{},flag:"day11_free_conflict_rule",requiresAction:"schedule-conflict-rule",summary:"일정이 겹칠 때 선택권을 보존하는 공통 규칙을 기록했다."}),
  Object.freeze({id:"sync-shared-calendar-boundary",icon:"◇",title:"공동 달력의 공유 범위를 확인한다",description:"개인 일정은 열지 않고 공동 약속·변경 시간·필요한 도움만 동기화한다.",effects:{trust:6,affection:2,confidence:3,energy:-2},scenarioEffects:{haeunTrust:2},flag:"day11_free_calendar_boundary",requiresAction:"shared-calendar-boundary",summary:"하은과 공동 달력에서 공유할 정보의 범위를 확인했다."}),
  Object.freeze({id:"prepare-current-account-review",icon:"▧",title:"DAY 12 계정 확인 목록을 준비한다",description:"계좌에 접속하지 않고 현재 명의·공식 문의처·확인할 생활비 항목만 적는다.",effects:{confidence:4,energy:-2,stress:1},scenarioEffects:{investigation:3},flag:"day11_free_prepare_account",requiresFlag:"day12CurrentAccountReviewPending",summary:"금융 판단 없이 현재 계정의 소유권과 공식 확인 순서만 준비했다."}),
  Object.freeze({id:"rest-after-life-planning",icon:"☾",title:"생활표를 닫고 쉰다",description:"빈칸을 새 일정으로 채우지 않고 보호된 회복 시간으로 사용한다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day11_recovery_rest",summary:"생활표의 빈칸을 지키며 추가 계획 없이 충분히 쉬었다."})
]);

export const DAY12_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"file-verified-current-balance",icon:"▧",title:"확인된 현재 잔액을 기록한다",description:"명의·명세 발행일·읽기 전용 잔액만 출처와 함께 저장한다.",effects:{confidence:5,energy:-2,stress:-2},scenarioEffects:{investigation:3},flag:"day12_free_file_balance",requiresAction:"verified-current-account",summary:"현재 계정의 명의와 잔액을 공식 출처와 함께 기록했다."}),
  Object.freeze({id:"classify-verified-living-expenses",icon:"≡",title:"현재 생활비를 분류한다",description:"개인 책임·소유권 미확인·공동 합의 필요 항목을 서로 다른 칸에 둔다.",effects:{confidence:5,energy:-3,stress:-1},scenarioEffects:{investigation:2},flag:"day12_free_classify_expenses",requiresAction:"verified-living-expenses",summary:"현재 생활비를 소유권과 확인 상태에 따라 분리했다."}),
  Object.freeze({id:"save-account-ownership-boundary",icon:"◇",title:"금융 접근 경계를 저장한다",description:"읽기 기능만 허용하고 송금·저축 이동·투자 판단은 계속 잠근다.",effects:{confidence:5,trust:3,energy:-2,stress:-2},scenarioEffects:{haeunTrust:1},flag:"day12_free_account_boundary",requiresAction:"account-ownership-boundary",summary:"기본 금융 확인과 자산 이동·투자 권한의 경계를 저장했다."}),
  Object.freeze({id:"prepare-current-household-budget",icon:"▦",title:"DAY 13 현재 가계 예산을 준비한다",description:"확인된 고정 생활비와 합의가 필요한 항목만 예산 초안에 옮긴다.",effects:{confidence:4,energy:-3},scenarioEffects:{investigation:2},flag:"day12_free_prepare_budget",requiresFlag:"day13CurrentHouseholdBudgetPending",summary:"현재 출처가 확인된 항목만 다음 가계 예산 초안에 옮겼다."}),
  Object.freeze({id:"rest-after-account-review",icon:"☾",title:"계정 화면을 닫고 쉰다",description:"잔액을 확인했다는 이유로 추가 금융 판단을 하지 않고 회복한다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day12_recovery_rest",summary:"기본 계정 확인 뒤 추가 금융 행동 없이 충분히 쉬었다."})
]);

export const DAY13_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-budget-base",icon:"▦",title:"현재 예산의 첫 기준을 저장한다",description:"확인된 개인 고정비·합의된 공동 항목·보류 항목을 분리한다.",effects:{confidence:5,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day13_free_budget_base",requiresAction:"current-budget-base",summary:"현재 가계 예산의 첫 기준과 확인 상태를 저장했다."}),
  Object.freeze({id:"record-shared-expense-consent",icon:"◇",title:"공동 비용 동의를 기록한다",description:"항목별 목적·책임자·부담 범위와 아직 실행하지 않았다는 상태를 남긴다.",effects:{trust:5,confidence:4,energy:-2},scenarioEffects:{haeunTrust:2},flag:"day13_free_expense_consent",requiresAction:"shared-expense-consent",summary:"공동 비용의 항목별 동의와 실행 전 상태를 기록했다."}),
  Object.freeze({id:"lock-household-buffer",icon:"□",title:"가계 예비비를 보호한다",description:"회복·일정 변경용 예비비를 소비 가능한 잔액과 분리해 잠근다.",effects:{health:2,confidence:4,energy:-2,stress:-3},scenarioEffects:{},flag:"day13_free_lock_buffer",requiresAction:"household-buffer-boundary",summary:"가계 예비비를 일반 소비와 분리된 보호 항목으로 잠갔다."}),
  Object.freeze({id:"prepare-current-choice-spending",icon:"▧",title:"DAY 14 선택 소비 범위를 준비한다",description:"예산 안에서 각자 선택할 수 있는 소액 한도와 확인 기준만 적는다.",effects:{confidence:4,energy:-2},scenarioEffects:{investigation:2},flag:"day13_free_prepare_spending",requiresFlag:"day14CurrentChoiceSpendingPending",summary:"다음 날의 선택 소비 한도와 소유권 기준만 준비했다."}),
  Object.freeze({id:"rest-after-budget-agreement",icon:"☾",title:"장부를 닫고 쉰다",description:"예산을 만들었다는 이유로 결제나 추가 계정 연결을 하지 않는다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day13_recovery_rest",summary:"가계 예산 합의 뒤 돈을 움직이지 않고 충분히 쉬었다."})
]);
export const DAY14_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"file-current-choice-purchase",icon:"▧",title:"오늘의 선택 소비를 기록한다",description:"품목·현재 선택 이유·소유자·반품 기한을 한 건만 저장한다.",effects:{confidence:5,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day14_free_file_purchase",requiresAction:"current-choice-spending",summary:"오늘 직접 고른 한 품목의 현재 선택 근거를 기록했다."}),
  Object.freeze({id:"save-controlled-checkout",icon:"✓",title:"안전 결제 규칙을 저장한다",description:"한 품목·예산 칸 지정·자동결제 금지 조건을 쇼핑 설정에 적용한다.",effects:{confidence:5,energy:-2},scenarioEffects:{},flag:"day14_free_checkout_rule",requiresAction:"controlled-shopping-checkout",summary:"한도와 소유권을 확인하는 안전 결제 규칙을 저장했다."}),
  Object.freeze({id:"record-gift-consent-boundary",icon:"♥",title:"선물 동의 범위를 기록한다",description:"품목·가격 범위·거절권과 변경 가능한 위시리스트 규칙을 남긴다.",effects:{trust:6,affection:3,energy:-2,stress:-2},scenarioEffects:{haeunTrust:2,haeunAffection:1},flag:"day14_free_gift_boundary",requiresAction:"gift-consent-boundary",summary:"선물이 애정의 의무가 되지 않도록 동의 범위를 기록했다."}),
  Object.freeze({id:"prepare-current-leisure-date",icon:"◇",title:"DAY 15 여가 데이트 범위를 준비한다",description:"예산·이동·회복 시간 안에서 각자 고를 활동 후보만 적는다.",effects:{affection:2,confidence:4,energy:-2},scenarioEffects:{haeunAffection:1},flag:"day14_free_prepare_date",requiresFlag:"day15CurrentLeisureDatePending",summary:"다음 여가 데이트의 선택권·예산·중단 기준을 준비했다."}),
  Object.freeze({id:"rest-after-choice-spending",icon:"☾",title:"쇼핑 앱을 닫고 쉰다",description:"한도를 남은 구매 허가로 해석하지 않고 추가 소비 없이 쉰다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day14_recovery_rest",summary:"오늘의 한 품목에서 멈추고 추가 쇼핑 없이 충분히 쉬었다."})
]);
export const DAY15_CAFE_ACTIONS=Object.freeze([
  Object.freeze({id:"file-current-leisure-choice",icon:"◇",title:"오늘의 여가 선택을 기록한다",description:"각자 고른 활동과 선택 순서만 현재 기록으로 남긴다.",effects:{affection:3,confidence:5,energy:-2,stress:-2},scenarioEffects:{haeunAffection:1},flag:"day15_free_file_choice",requiresAction:"current-leisure-date",summary:"오늘 두 사람이 직접 고른 여가 활동과 선택권을 기록했다."}),
  Object.freeze({id:"save-date-change-boundary",icon:"⇄",title:"데이트 변경 규칙을 저장한다",description:"쉬기·축소·교체·종료를 실패나 빚으로 세지 않는 규칙을 남긴다.",effects:{trust:5,health:2,confidence:3,energy:-2,stress:-3},scenarioEffects:{haeunTrust:2},flag:"day15_free_change_rule",requiresAction:"date-change-boundary",summary:"데이트 계획을 현재 상태에 맞게 바꿀 권리를 저장했다."}),
  Object.freeze({id:"lock-private-date-record",icon:"□",title:"데이트 기록 공개 범위를 잠근다",description:"사진·위치·동행 태그는 항목별 새 동의 전까지 비공개로 둔다.",effects:{trust:6,confidence:3,energy:-2,stress:-2},scenarioEffects:{haeunTrust:2},flag:"day15_free_private_record",requiresAction:"private-date-record",summary:"데이트 사진과 위치 정보의 공개 범위를 비공개로 잠갔다."}),
  Object.freeze({id:"prepare-current-social-circle",icon:"▧",title:"DAY 16 관계망 확인 범위를 준비한다",description:"현재 연락 가능한 사람과 소개자·확인 목적만 적고 과거 친밀도는 추정하지 않는다.",effects:{social:2,confidence:4,energy:-2},scenarioEffects:{investigation:2},flag:"day15_free_prepare_social",requiresFlag:"day16CurrentSocialCirclePending",summary:"다음 날 현재 관계망을 확인할 최소 범위만 준비했다."}),
  Object.freeze({id:"rest-after-leisure-date",icon:"☾",title:"기록을 닫고 카페에서 쉰다",description:"남은 시간을 추가 활동으로 채우지 않고 천천히 귀가 준비를 한다.",effects:{energy:15,fatigue:-12,stress:-9,health:4},scenarioEffects:{},flag:"day15_recovery_rest",summary:"데이트의 남은 시간을 보상 일정으로 채우지 않고 충분히 쉬었다."})
]);
export const DAY16_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"file-current-social-circle",icon:"◎",title:"현재 관계망 한 칸을 저장한다",description:"지훈의 현재 소개·연락 목적·확인 상태만 관계망에 남긴다.",effects:{social:5,confidence:4,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day16_free_file_social",requiresAction:"current-social-circle",summary:"지훈을 현재 정보가 확인된 한 사람으로 관계망에 저장했다."}),
  Object.freeze({id:"save-best-friend-contact-boundary",icon:"◇",title:"지훈과의 연락 경계를 저장한다",description:"1:1 연락·응답 선택권·다음 만남의 새 동의를 현재 연락처에 기록한다.",effects:{social:4,trust:3,confidence:4,energy:-2},scenarioEffects:{},flag:"day16_free_contact_boundary",requiresAction:"best-friend-current-contact",summary:"지훈과의 현재 연락 및 다음 만남 경계를 저장했다."}),
  Object.freeze({id:"lock-friend-group-consent",icon:"□",title:"단체 연락과 소식 공유를 잠근다",description:"과거 단체방 초대와 내 상태 전달은 개별 동의 전까지 차단한다.",effects:{trust:5,confidence:4,energy:-2,stress:-3},scenarioEffects:{haeunTrust:1},flag:"day16_free_group_consent",requiresAction:"friend-group-consent",summary:"친구 단체방과 내 상태 공유 권한을 개별 동의 전까지 잠갔다."}),
  Object.freeze({id:"prepare-current-health-routine",icon:"+",title:"DAY 17 건강 루틴 확인을 준비한다",description:"현재 처방·수면·식사·움직임 중 공식 확인이 필요한 항목만 적는다.",effects:{health:3,confidence:4,energy:-2},scenarioEffects:{investigation:2},flag:"day16_free_prepare_health",requiresFlag:"day17CurrentHealthRoutinePending",summary:"다음 날 현재 건강 루틴에서 확인할 최소 항목만 준비했다."}),
  Object.freeze({id:"rest-after-social-check",icon:"☾",title:"연락처를 닫고 쉰다",description:"한 사람을 확인했다는 이유로 다른 연락처까지 열지 않고 회복한다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day16_recovery_rest",summary:"관계망을 한꺼번에 복원하지 않고 연락처를 닫은 채 충분히 쉬었다."})
]);
export const DAY17_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"file-verified-prescription",icon:"+",title:"현재 처방 근거를 저장한다",description:"발행일·복용량·누락 대응과 공식 확인처만 건강 기록에 남긴다.",effects:{health:4,confidence:5,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day17_free_file_prescription",requiresAction:"verified-current-prescription",summary:"현재 처방의 출처와 복용 지시를 공식 근거와 함께 저장했다."}),
  Object.freeze({id:"save-current-health-routine",icon:"▦",title:"일주일 건강 루틴을 저장한다",description:"기상·식사·취침·복약과 증상별 중단 기준을 시험 기간과 함께 남긴다.",effects:{health:5,confidence:4,energy:-2,stress:-2},scenarioEffects:{},flag:"day17_free_save_routine",requiresAction:"current-health-routine",summary:"공식 확인 전 임의 변경하지 않는 일주일 건강 루틴을 저장했다."}),
  Object.freeze({id:"lock-health-data-boundary",icon:"□",title:"건강 데이터 공유 범위를 잠근다",description:"필요한 도움 요약 외의 전체 기록·상시 위치·수치 공유를 닫는다.",effects:{trust:4,confidence:5,energy:-2,stress:-3},scenarioEffects:{haeunTrust:1},flag:"day17_free_data_boundary",requiresAction:"health-data-boundary",summary:"돌봄에 필요한 정보와 의료 데이터 접근 권한을 분리해 잠갔다."}),
  Object.freeze({id:"prepare-current-home-safety",icon:"⌂",title:"DAY 18 집 안전 확인을 준비한다",description:"현재 생활 동선에서 넘어짐·약 보관·비상 연락과 공식 점검이 필요한 곳만 적는다.",effects:{health:3,confidence:4,energy:-2},scenarioEffects:{investigation:2},flag:"day17_free_prepare_home",requiresFlag:"day18CurrentHomeSafetyPending",summary:"다음 날 현재 집에서 확인할 안전 항목만 준비했다."}),
  Object.freeze({id:"rest-after-health-routine",icon:"☾",title:"건강 기록을 닫고 쉰다",description:"루틴을 만들었다는 이유로 활동량을 늘리지 않고 현재 수면 시간을 지킨다.",effects:{energy:17,fatigue:-14,stress:-9,health:5},scenarioEffects:{},flag:"day17_recovery_rest",summary:"건강 루틴을 시험하기 전 추가 활동 없이 충분히 쉬었다."})
]);

export const DAY18_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"file-home-safety-route",icon:"⌂",title:"안전 이동 동선을 저장한다",description:"현관·침실·화장실의 장애물, 조명, 멈출 곳과 호출 수단만 기록한다.",effects:{health:4,confidence:5,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day18_free_safety_route",requiresAction:"current-home-safety-route",summary:"현재 집에서 넘어짐을 줄이는 이동 동선과 중단 지점을 저장했다."}),
  Object.freeze({id:"save-verified-home-storage",icon:"▦",title:"확인된 생활 물건의 자리를 정한다",description:"현재 처방 약과 소유자·용도·확인일이 분명한 물건만 생활 구역에 둔다.",effects:{health:4,confidence:4,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day18_free_verified_storage",requiresAction:"verified-home-storage",summary:"확인된 현재 물건과 열지 않을 과거 보관 구역을 분리했다."}),
  Object.freeze({id:"lock-bounded-emergency-access",icon:"□",title:"비상 출입 권한을 잠근다",description:"연락 우선, 목적·만료 시간이 있는 1회 코드, 사용 기록만 허용한다.",effects:{trust:4,confidence:5,energy:-2,stress:-3},scenarioEffects:{haeunTrust:1},flag:"day18_free_emergency_access",requiresAction:"bounded-emergency-access",summary:"영구 관리자 없이 필요한 때만 열리는 비상 출입 규칙을 저장했다."}),
  Object.freeze({id:"prepare-current-shared-chore",icon:"✓",title:"DAY 19 공동 집안일을 준비한다",description:"현재 함께 할 수 있는 집안일과 각자의 중단 기준, 소유 구역만 적는다.",effects:{confidence:4,social:3,energy:-2},scenarioEffects:{investigation:2},flag:"day18_free_prepare_chore",requiresFlag:"day19CurrentSharedChorePending",summary:"다음 날 공동 집안일에서 확인할 역할과 경계만 준비했다."}),
  Object.freeze({id:"rest-after-home-safety",icon:"☾",title:"안전 점검을 마치고 쉰다",description:"정리를 더 넓히거나 과거 물건을 열지 않고 현재 안전이 확보된 방에서 쉰다.",effects:{energy:17,fatigue:-14,stress:-9,health:5},scenarioEffects:{},flag:"day18_recovery_rest",summary:"현재 생활에 필요한 안전 점검만 마치고 충분히 쉬었다."})
]);

export const DAY19_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-shared-chore-plan",icon:"▦",title:"오늘의 역할표를 저장한다",description:"현재 체력·소요 시간·공동 구역 여부와 중단 기준만 남긴다.",effects:{confidence:5,social:3,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day19_free_chore_plan",requiresAction:"current-shared-chore-plan",summary:"과거 담당 대신 오늘 가능한 몫으로 만든 역할표를 저장했다."}),
  Object.freeze({id:"lock-private-home-zone",icon:"□",title:"개인 생활 구역을 잠근다",description:"개인 서랍·가방·기기는 매번 묻고 과거 물건은 열지 않는 규칙을 표시한다.",effects:{trust:4,confidence:5,energy:-2,stress:-3},scenarioEffects:{haeunTrust:1},flag:"day19_free_private_zone",requiresAction:"private-home-zone",summary:"공동 정리와 개인 물건 접근 권한을 분리해 저장했다."}),
  Object.freeze({id:"save-chore-renegotiation",icon:"↺",title:"집안일 재협상 규칙을 저장한다",description:"통증·피로 시 중단하고 못 한 몫을 빚이나 관계 점수로 남기지 않는다.",effects:{health:3,trust:4,confidence:4,energy:-2},scenarioEffects:{},flag:"day19_free_renegotiation",requiresAction:"chore-renegotiation",summary:"현재 상태에 따라 집안일을 멈추고 다시 나누는 규칙을 저장했다."}),
  Object.freeze({id:"prepare-current-shared-meal",icon:"+",title:"DAY 20 공동 식사를 준비한다",description:"현재 먹을 수 있는 음식·예산·조리 부담과 각자의 선택 범위만 적는다.",effects:{health:3,confidence:4,energy:-2},scenarioEffects:{investigation:2},flag:"day19_free_prepare_meal",requiresFlag:"day20CurrentSharedMealPending",summary:"다음 날 공동 식사에서 확인할 건강·비용·역할 범위만 준비했다."}),
  Object.freeze({id:"rest-after-shared-chore",icon:"☾",title:"남은 집안일을 두고 쉰다",description:"완료율을 높이려 무리하지 않고 오늘 정한 중단 기준을 실행한다.",effects:{energy:17,fatigue:-14,stress:-9,health:5},scenarioEffects:{},flag:"day19_recovery_rest",summary:"남은 집안일을 빚으로 만들지 않고 충분히 쉬었다."})
]);

export const DAY20_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-shared-meal-plan",icon:"▦",title:"현재형 식사 기록을 저장한다",description:"현재 메뉴 근거·먹을 수 있는 후보·소량 시험 결과만 남긴다.",effects:{health:4,confidence:4,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day20_free_meal_plan",requiresAction:"current-shared-meal-plan",summary:"과거 입맛 대신 현재 몸의 반응으로 공동 식사 기록을 저장했다."}),
  Object.freeze({id:"save-shared-meal-cost-boundary",icon:"₩",title:"공동 식사 비용 경계를 저장한다",description:"각자 항목·공동 재료·상한과 결제 동의를 분리해 남긴다.",effects:{confidence:5,trust:3,energy:-2,stress:-2},scenarioEffects:{},flag:"day20_free_meal_cost",requiresAction:"shared-meal-cost-boundary",summary:"공동 식사의 비용과 결제 소유권을 분리해 저장했다."}),
  Object.freeze({id:"lock-meal-stop-leftover-consent",icon:"□",title:"조리 중단과 남은 음식 규칙을 잠근다",description:"피로 시 중단하고 보관·처분은 소유자에게 먼저 묻는다.",effects:{health:4,trust:4,confidence:4,energy:-2},scenarioEffects:{haeunTrust:1},flag:"day20_free_meal_consent",requiresAction:"meal-stop-and-leftover-consent",summary:"조리 완성보다 안전한 중단과 남은 음식의 동의를 우선했다."}),
  Object.freeze({id:"prepare-current-full-workday",icon:"✓",title:"DAY 21 전일 근무를 준비한다",description:"현재 업무 범위·휴식·식사·퇴근 중단 기준만 일정에 적는다.",effects:{work:3,confidence:4,energy:-2},scenarioEffects:{investigation:2},flag:"day20_free_prepare_workday",requiresFlag:"day21CurrentFullWorkdayPending",summary:"다음 날 전일 근무에서 확인할 범위와 중단 기준만 준비했다."}),
  Object.freeze({id:"rest-after-shared-meal",icon:"☾",title:"식사 기록을 닫고 쉰다",description:"섭취량이나 조리 완성도를 다시 평가하지 않고 회복한다.",effects:{energy:17,fatigue:-14,stress:-9,health:5},scenarioEffects:{},flag:"day20_recovery_rest",summary:"식사를 평가표로 만들지 않고 충분히 쉬었다."})
]);

export const DAY21_OFFICE_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-full-workday-scope",icon:"▦",title:"전일 근무 범위를 저장한다",description:"현재 직무·승인 자료·필수 세 가지와 보류 목록만 남긴다.",effects:{work:5,confidence:5,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day21_free_work_scope",requiresAction:"current-full-workday-scope",summary:"과거 권한 없이 수행한 현재 전일 근무 범위를 저장했다."}),
  Object.freeze({id:"lock-workday-break-status-boundary",icon:"□",title:"휴식과 상태 공유 경계를 잠근다",description:"휴식·식사·증상 중단과 직접 보내는 최소 상태 요약만 기록한다.",effects:{health:4,trust:3,confidence:4,energy:-2},scenarioEffects:{haeunTrust:1},flag:"day21_free_break_boundary",requiresAction:"workday-break-and-status-boundary",summary:"일하는 동안의 몸과 건강 정보 공유 범위를 잠갔다."}),
  Object.freeze({id:"save-explicit-overtime-exit",icon:"↺",title:"퇴근·초과근무 승인 규칙을 저장한다",description:"미완료 인계, 정시 퇴근과 범위·시간·보상의 새 승인을 분리한다.",effects:{work:4,confidence:5,energy:-2,stress:-3},scenarioEffects:{},flag:"day21_free_exit_boundary",requiresAction:"explicit-overtime-and-exit-boundary",summary:"자동 연장 없이 퇴근하고 초과근무를 매번 새로 승인받게 했다."}),
  Object.freeze({id:"prepare-current-recovery-day",icon:"☾",title:"DAY 22 회복일을 준비한다",description:"수면·식사·가벼운 활동과 연락하지 않을 시간을 현재 상태로만 적는다.",effects:{health:3,confidence:4,energy:-1},scenarioEffects:{investigation:2},flag:"day21_free_prepare_recovery",requiresFlag:"day22CurrentRecoveryDayPending",summary:"다음 날 현재형 회복일에서 확인할 최소 기준만 준비했다."}),
  Object.freeze({id:"leave-office-after-full-workday",icon:"→",title:"남은 업무를 두고 퇴근한다",description:"업무를 집으로 가져가지 않고 인계 상태를 확인한 뒤 회사를 나간다.",effects:{energy:12,fatigue:-10,stress:-8,health:3},scenarioEffects:{},flag:"day21_recovery_leave",summary:"첫 전일 근무의 종료 기준을 지키고 정시에 퇴근했다."})
]);

export const DAY22_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-recovery-day-plan",icon:"▦",title:"현재 회복일 기준을 저장한다",description:"몸의 신호·최소 루틴·보충하지 않을 일만 짧게 남긴다.",effects:{health:5,confidence:4,energy:-1,stress:-3},scenarioEffects:{investigation:1},flag:"day22_free_recovery_plan",requiresAction:"current-recovery-day-plan",summary:"성과 없이도 지킬 수 있는 현재 회복일 기준을 저장했다."}),
  Object.freeze({id:"lock-protected-recovery-offline-time",icon:"□",title:"연락하지 않을 시간을 잠근다",description:"긴급 연락과 한 번의 직접 상태 요약 외의 자동 공유를 닫는다.",effects:{trust:4,confidence:5,energy:-1,stress:-4},scenarioEffects:{haeunTrust:1},flag:"day22_free_offline_time",requiresAction:"protected-recovery-offline-time",summary:"회복 중 침묵과 건강 정보의 공유 범위를 잠갔다."}),
  Object.freeze({id:"save-recovery-without-score",icon:"○",title:"점수 없는 회복 규칙을 저장한다",description:"걸음·수면·회복량의 연속 달성과 관계 평가 기능을 끈다.",effects:{health:4,confidence:5,energy:-1,stress:-3},scenarioEffects:{},flag:"day22_free_no_score",requiresAction:"recovery-without-score",summary:"회복 수치를 성과나 관계 점수로 계산하지 않게 했다."}),
  Object.freeze({id:"prepare-current-family-contact",icon:"◇",title:"DAY 23 가족 연락을 준비한다",description:"현재 연락 목적·확인할 사람·공유하지 않을 정보와 종료 기준만 적는다.",effects:{social:3,confidence:4,energy:-2},scenarioEffects:{investigation:2},flag:"day22_free_prepare_family",requiresFlag:"day23CurrentFamilyContactPending",summary:"다음 날 현재 가족 연락에서 확인할 범위와 경계만 준비했다."}),
  Object.freeze({id:"rest-after-recovery-day",icon:"☾",title:"기록 없이 조금 더 쉰다",description:"회복량을 측정하거나 보충 활동을 하지 않고 수면 시간을 지킨다.",effects:{energy:18,fatigue:-15,stress:-10,health:5},scenarioEffects:{},flag:"day22_recovery_rest",summary:"회복을 증명하지 않고 조금 더 쉬었다."})
]);

export const DAY23_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-verified-current-family-contact",icon:"◇",title:"확인된 가족 연락을 저장한다",description:"공식 확인처·현재 소개·연락 목적과 확인일만 남긴다.",effects:{social:4,confidence:5,energy:-2,stress:-2},scenarioEffects:{investigation:2},flag:"day23_free_verified_family",requiresAction:"verified-current-family-contact",summary:"이름이 아니라 공식 확인과 현재 소개를 가족 연락 기록에 저장했다."}),
  Object.freeze({id:"lock-family-information-boundary",icon:"□",title:"가족 정보 공유 범위를 잠근다",description:"현재 상태 요약 외의 의료·사고·연애 세부 정보와 대리 공유를 닫는다.",effects:{trust:4,confidence:5,energy:-2,stress:-3},scenarioEffects:{haeunTrust:1},flag:"day23_free_family_boundary",requiresAction:"family-information-boundary",summary:"가족에게 공유할 현재 정보와 비공개 정보를 분리했다."}),
  Object.freeze({id:"save-family-contact-consent-exit",icon:"↺",title:"다음 연락과 종료권을 저장한다",description:"다른 가족 연결의 개별 동의와 통화를 언제든 끝낼 권리를 남긴다.",effects:{social:4,confidence:4,energy:-2,stress:-2},scenarioEffects:{},flag:"day23_free_family_consent",requiresAction:"family-contact-consent-and-exit",summary:"가족 연락도 매번 새 동의로 시작하고 끝낼 수 있게 했다."}),
  Object.freeze({id:"prepare-current-commitment-check",icon:"♥",title:"DAY 24 결혼 의사 확인을 준비한다",description:"현재 결혼을 원하는 이유·조건·보류할 수 있는 항목과 철회권만 적는다.",effects:{trust:3,confidence:4,energy:-2},scenarioEffects:{haeunTrust:1},flag:"day23_free_prepare_commitment",requiresFlag:"day24CurrentCommitmentCheckPending",summary:"다음 날 현재의 결혼 의사를 확인할 질문과 경계만 준비했다."}),
  Object.freeze({id:"rest-after-family-contact",icon:"☾",title:"연락 기록을 닫고 쉰다",description:"다른 가족이나 과거 자료를 더 열지 않고 오늘 확인한 범위에서 멈춘다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day23_recovery_rest",summary:"가족 관계를 더 넓히지 않고 오늘 확인한 한 사람에서 멈췄다."})
]);

export const DAY24_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-mutual-commitment",icon:"♥",title:"현재의 결혼 의사를 저장한다",description:"각자가 말한 현재 이유와 상대의 대답을 대신하지 않는 범위만 남긴다.",effects:{trust:6,affection:4,confidence:4,energy:-2},scenarioEffects:{haeunTrust:2},flag:"day24_free_commitment",requiresAction:"current-mutual-commitment",summary:"과거 약속이 아닌 현재의 상호 결혼 의사를 저장했다."}),
  Object.freeze({id:"lock-marriage-separate-rights",icon:"□",title:"결혼 뒤의 개별 권리를 잠근다",description:"각자의 계정·공간·연락·건강·재산 선택권을 포괄 동의에서 분리한다.",effects:{trust:5,confidence:5,energy:-2,stress:-3},scenarioEffects:{haeunTrust:1},flag:"day24_free_separate_rights",requiresAction:"marriage-separate-rights-boundary",summary:"결혼 뒤에도 유지할 각자의 권리와 미확인 항목을 잠갔다."}),
  Object.freeze({id:"save-commitment-reconfirm-rights",icon:"↺",title:"재확인·연기·철회권을 저장한다",description:"예식 전 재확인과 이유 없는 연기·동의 철회가 가능한 규칙을 남긴다.",effects:{trust:5,confidence:5,energy:-2,stress:-2},scenarioEffects:{},flag:"day24_free_reconfirm_rights",requiresAction:"commitment-reconfirm-postpone-withdraw",summary:"결혼 동의를 계속 다시 묻고 바꿀 수 있게 했다."}),
  Object.freeze({id:"prepare-current-wedding-scope",icon:"✓",title:"DAY 25 예식 범위를 준비한다",description:"예식·법적 절차·비용·초대·공개 항목 중 현재 확인할 것만 적는다.",effects:{confidence:4,trust:3,energy:-2},scenarioEffects:{investigation:2},flag:"day24_free_prepare_wedding",requiresFlag:"day25CurrentWeddingScopePending",summary:"다음 날 현재의 예식 범위에서 확인할 항목과 보류 항목만 준비했다."}),
  Object.freeze({id:"rest-after-commitment-check",icon:"☾",title:"결혼 계획을 더 열지 않고 쉰다",description:"예약·가족 알림·과거 자료를 열지 않고 오늘의 대답에서 멈춘다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day24_recovery_rest",summary:"현재 결혼 의사를 확인한 뒤 실행 계획은 다음 날로 미뤘다."})
]);

export const DAY25_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-wedding-form-scope",icon:"◇",title:"현재 예식 형식 범위를 저장한다",description:"법적 절차·예식·날짜를 묶지 않고 지금 선택하거나 미정으로 둔 항목만 남긴다.",effects:{trust:5,affection:3,confidence:5,energy:-2},scenarioEffects:{haeunTrust:1},flag:"day25_free_form_scope",requiresAction:"current-wedding-form-scope",summary:"현재 선택한 결혼 형식과 미정 항목을 분리해 저장했다."}),
  Object.freeze({id:"lock-wedding-budget-contract-boundary",icon:"₩",title:"예식 예산·계약 경계를 잠근다",description:"생활 안전망을 보호하는 상한과 항목별 재승인, 과거 예약금의 비강제 원칙을 남긴다.",effects:{trust:4,confidence:6,energy:-2,stress:-3},scenarioEffects:{investigation:1},flag:"day25_free_budget_boundary",requiresAction:"wedding-budget-and-contract-boundary",summary:"예식 비용 상한과 계약별 재승인 규칙을 잠갔다."}),
  Object.freeze({id:"save-wedding-guest-disclosure-consent",icon:"✉",title:"초대·공개 동의를 저장한다",description:"초대 대상과 사고·기억·건강 정보 공개 범위를 분리하고 발송 전 변경권을 남긴다.",effects:{trust:5,social:3,confidence:4,energy:-2},scenarioEffects:{haeunTrust:1},flag:"day25_free_guest_consent",requiresAction:"wedding-guest-and-disclosure-consent",summary:"초대와 개인정보 공개 범위를 각자 다시 승인하게 했다."}),
  Object.freeze({id:"prepare-current-legal-wedding",icon:"✓",title:"DAY 26 법적 준비를 정리한다",description:"신분·서류·법적 효과 중 현재 확인할 수 있는 것과 전문가 확인이 필요한 것을 나눈다.",effects:{confidence:4,trust:3,energy:-2},scenarioEffects:{investigation:2},flag:"day25_free_prepare_legal",requiresFlag:"day26CurrentLegalPreparationPending",summary:"다음 날 법적 준비에서 직접 확인할 항목과 보류 항목을 나눴다."}),
  Object.freeze({id:"rest-after-wedding-scope",icon:"☾",title:"계약과 초대를 열지 않고 쉰다",description:"과거 견적·명단·업체 연락을 더 열지 않고 오늘 정한 범위에서 멈춘다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day25_recovery_rest",summary:"예식 범위를 정한 뒤 실제 실행은 다음 확인까지 미뤘다."})
]);

export const DAY26_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-legal-document-minimum",icon:"▤",title:"현재 최소 서류 목록을 저장한다",description:"유효한 발급본과 필수 제출물만 남기고 원본·신분 수단의 포괄 위임을 막는다.",effects:{confidence:5,trust:4,energy:-2},scenarioEffects:{investigation:2},flag:"day26_free_document_minimum",requiresAction:"current-legal-document-minimum",summary:"혼인 준비에 필요한 현재 최소 서류와 제출 전 보류선을 저장했다."}),
  Object.freeze({id:"lock-marriage-legal-effects-boundary",icon:"⚖",title:"법적 효과와 개별 권리를 잠근다",description:"결혼과 주소·계정·재산·채무·보험·통지 권한을 분리하고 미확인 효과를 보류한다.",effects:{trust:5,confidence:6,energy:-2,stress:-3},scenarioEffects:{investigation:2},flag:"day26_free_legal_boundary",requiresAction:"marriage-legal-effects-boundary",summary:"혼인의 법적 효과와 각자의 재산·정보 권한을 분리했다."}),
  Object.freeze({id:"save-individual-signature-stop-right",icon:"✎",title:"직접 서명·중단권을 저장한다",description:"각자가 문서를 읽고 따로 서명하며 제출 직전까지 멈추거나 전문가에게 확인할 권리를 남긴다.",effects:{trust:6,confidence:5,energy:-2},scenarioEffects:{haeunTrust:1},flag:"day26_free_signature_right",requiresAction:"individual-signature-and-stop-right",summary:"대리 승인 없이 각자의 직접 서명과 제출 중단권을 저장했다."}),
  Object.freeze({id:"prepare-current-final-check",icon:"✓",title:"DAY 27 최종 점검표를 준비한다",description:"결혼 의사·예식 범위·서류·비용·건강과 철회권 중 다시 확인할 항목만 적는다.",effects:{confidence:4,trust:3,energy:-2},scenarioEffects:{investigation:2},flag:"day26_free_prepare_final_check",requiresFlag:"day27CurrentFinalCheckPending",summary:"다음 날 서로의 현재 상태와 모든 중단권을 다시 확인할 점검표를 만들었다."}),
  Object.freeze({id:"rest-after-legal-preparation",icon:"☾",title:"전자서명과 제출을 열지 않고 쉰다",description:"포털·원본·과거 공동 문서를 더 열지 않고 준비와 실제 제출 사이에서 멈춘다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day26_recovery_rest",summary:"법적 준비를 마친 뒤 실제 서명과 제출은 다음 확인까지 보류했다."})
]);

export const DAY27_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-current-final-mutual-intent",icon:"♥",title:"오늘의 상호 의사를 저장한다",description:"오늘 각자가 직접 말한 결혼 의사와 내일 다시 물어야 한다는 조건을 함께 남긴다.",effects:{trust:6,affection:4,confidence:4,energy:-2},scenarioEffects:{haeunTrust:2},flag:"day27_free_mutual_intent",requiresAction:"current-final-mutual-intent",summary:"오늘의 결혼 의사와 다음 날 재확인 조건을 함께 저장했다."}),
  Object.freeze({id:"lock-body-emotion-stop-signal",icon:"■",title:"몸·감정 중단 신호를 잠근다",description:"통증·피로·불안과 둘만의 신호, 조용한 공간, 표정을 동의로 보지 않는 원칙을 남긴다.",effects:{trust:5,health:3,confidence:4,energy:-2,stress:-4},scenarioEffects:{haeunTrust:1},flag:"day27_free_stop_signal",requiresAction:"body-emotion-stop-signal",summary:"몸과 감정의 신호로 즉시 멈출 수 있는 규칙을 잠갔다."}),
  Object.freeze({id:"save-executable-cancel-return-path",icon:"↩",title:"취소·귀가 실행 경로를 저장한다",description:"연기·취소 연락, 환불, 담당과 승인 분리, 안전한 귀가 동선을 실제로 쓸 수 있게 남긴다.",effects:{confidence:6,trust:4,energy:-2,stress:-3},scenarioEffects:{investigation:2},flag:"day27_free_cancel_path",requiresAction:"executable-cancel-and-return-path",summary:"멈출 권리를 실행할 수 있는 취소 연락과 귀가 경로를 저장했다."}),
  Object.freeze({id:"prepare-current-ceremony-rehearsal",icon:"✓",title:"DAY 28 리허설 동선을 준비한다",description:"입장·대기·휴식·중단 신호·조용한 공간·귀가 동선을 짧게 시험할 순서만 적는다.",effects:{confidence:4,trust:3,energy:-2},scenarioEffects:{investigation:2},flag:"day27_free_prepare_rehearsal",requiresFlag:"day28CurrentCeremonyRehearsalPending",summary:"다음 날 실제 예식 동선과 중단 신호를 시험할 순서를 준비했다."}),
  Object.freeze({id:"rest-after-final-check",icon:"☾",title:"완료 알림을 끄고 쉰다",description:"준비율·마감 알림·과거 일정표를 더 확인하지 않고 현재 점검에서 멈춘다.",effects:{energy:16,fatigue:-13,stress:-9,health:4},scenarioEffects:{},flag:"day27_recovery_rest",summary:"최종 점검 뒤 남은 준비를 밀어붙이지 않고 쉬었다."})
]);

export const DAY28_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-rehearsed-short-rest-exit-route",icon:"↪",title:"짧은 동선·휴식·출구를 저장한다",description:"집에서 검증한 최소 이동과 대기·휴식·출구·귀가 위치만 리허설 기록에 남긴다.",effects:{confidence:5,health:3,energy:-2,stress:-3},scenarioEffects:{investigation:1},flag:"day28_free_route",requiresAction:"rehearsed-short-rest-exit-route",summary:"짧고 회복 가능하며 언제든 나올 수 있는 동선을 저장했다."}),
  Object.freeze({id:"save-tested-stop-signal",icon:"■",title:"실제로 작동한 중단 신호를 저장한다",description:"질문·설득 없이 진행이 멈추고 조용한 공간으로 이동한 결과를 남긴다.",effects:{trust:6,confidence:5,energy:-2,stress:-4},scenarioEffects:{haeunTrust:2},flag:"day28_free_tested_signal",requiresAction:"tested-no-question-stop-signal",summary:"리허설에서 실제로 작동한 중단 신호와 대응을 저장했다."}),
  Object.freeze({id:"save-rehearsal-reduction-buffer",icon:"−",title:"삭제 순서·여유 시간을 반영한다",description:"부담이 된 순서를 빼고 휴식과 지연 여유를 늘린 본식 계획만 남긴다.",effects:{trust:4,confidence:5,energy:-2,stress:-3},scenarioEffects:{investigation:2},flag:"day28_free_reduce_buffer",requiresAction:"rehearsal-reduce-and-buffer-plan",summary:"리허설 결과로 부담 순서를 삭제하고 회복 여유를 늘렸다."}),
  Object.freeze({id:"prepare-current-eve-reconfirmation",icon:"✓",title:"DAY 29 전날 재확인을 준비한다",description:"현재 결혼 의사·몸 상태·서명·예식 범위·중단권을 각자 답할 짧은 질문만 적는다.",effects:{confidence:4,trust:4,energy:-2},scenarioEffects:{haeunTrust:1},flag:"day28_free_prepare_eve",requiresFlag:"day29CurrentEveReconfirmationPending",summary:"예식 전날 서로의 현재 의사와 모든 중단권을 다시 물을 질문을 준비했다."}),
  Object.freeze({id:"rest-after-rehearsal",icon:"☾",title:"리허설을 반복하지 않고 쉰다",description:"동선·사진·진행 영상을 다시 돌리지 않고 실제 회복 시간을 확보한다.",effects:{energy:18,fatigue:-14,stress:-10,health:5},scenarioEffects:{},flag:"day28_recovery_rest",summary:"리허설을 성과 연습으로 반복하지 않고 몸을 충분히 쉬게 했다."})
]);

export const DAY29_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-independent-eve-intent",icon:"♥",title:"각자의 전날 의사를 저장한다",description:"서로 맞추지 않고 적은 현재 대답과 내일 다시 물어야 한다는 조건만 남긴다.",effects:{trust:7,affection:4,confidence:4,energy:-2},scenarioEffects:{haeunTrust:2},flag:"day29_free_intent",requiresAction:"independent-eve-mutual-intent",summary:"각자의 전날 결혼 의사를 독립적으로 저장했다."}),
  Object.freeze({id:"lock-wedding-morning-body-check",icon:"☀",title:"아침 몸 상태 확인을 잠근다",description:"수면·식사·복약·통증·피로·불안을 확인하기 전 이동과 진행을 확정하지 않는다.",effects:{health:4,confidence:5,energy:-1,stress:-4},scenarioEffects:{},flag:"day29_free_body_check",requiresAction:"wedding-morning-body-check",summary:"DAY 30 아침 몸 상태를 모든 진행보다 먼저 확인하게 했다."}),
  Object.freeze({id:"save-equal-proceed-simplify-postpone",icon:"↔",title:"진행·축소·연기를 같은 선택으로 저장한다",description:"어느 선택도 실패나 배신으로 기록하지 않고 단계마다 다시 결정할 수 있게 한다.",effects:{trust:6,confidence:5,energy:-2,stress:-3},scenarioEffects:{haeunTrust:1},flag:"day29_free_equal_options",requiresAction:"proceed-simplify-postpone-equal",summary:"진행·축소·연기를 동등하고 변경 가능한 당일 선택으로 저장했다."}),
  Object.freeze({id:"prepare-current-wedding-decision",icon:"✓",title:"DAY 30 당일 질문을 준비한다",description:"아침 상태와 출발·도착·서명 전 현재 의사를 각자 짧게 답할 질문만 남긴다.",effects:{confidence:4,trust:4,energy:-2},scenarioEffects:{haeunTrust:1},flag:"day29_free_prepare_day30",requiresFlag:"day30CurrentWeddingDecisionPending",summary:"DAY 30 당일 각 단계에서 현재 의사를 직접 확인할 질문을 준비했다."}),
  Object.freeze({id:"sleep-before-wedding-decision",icon:"☾",title:"모든 알림을 끄고 잔다",description:"자정 확정·준비율·업체 연락을 끄고 수면과 회복을 최우선으로 둔다.",effects:{energy:20,fatigue:-16,stress:-11,health:6},scenarioEffects:{},flag:"day29_recovery_sleep",summary:"당일 선택을 위해 모든 알림을 끄고 충분히 쉬었다."})
]);

export const DAY30_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"save-wedding-day-body-scope",icon:"☀",title:"당일 몸 상태와 가능 범위를 저장한다",description:"보이는 표정이 아니라 직접 말한 통증·피로·불안과 가능한 범위를 기록한다.",effects:{health:4,confidence:4,energy:-2,stress:-3},scenarioEffects:{},flag:"day30_free_body_scope",requiresAction:"wedding-day-current-body-scope",summary:"DAY 30 당일의 실제 몸 상태와 가능 범위를 저장했다."}),
  Object.freeze({id:"save-wedding-day-stepwise-consent",icon:"♥",title:"단계별 당일 동의를 저장한다",description:"출발·도착·서명의 각 대답과 어느 단계에서든 멈출 권리를 기록한다.",effects:{trust:7,affection:5,confidence:5,energy:-2},scenarioEffects:{haeunTrust:2},flag:"day30_free_stepwise_consent",requiresAction:"wedding-day-stepwise-consent",summary:"DAY 30 각 단계의 독립된 현재 동의와 중단권을 저장했다."}),
  Object.freeze({id:"save-wedding-outcome-without-penalty",icon:"◇",title:"오늘의 결말을 평가 없이 남긴다",description:"진행·연기·예식 없는 관계 중 선택한 결과를 성공·실패 점수 없이 남긴다.",effects:{trust:6,confidence:6,stress:-4},scenarioEffects:{haeunTrust:1},flag:"day30_free_outcome",requiresAction:"wedding-outcome-without-penalty",summary:"DAY 30의 결말을 외부 형식이나 성공 점수와 분리해 기록했다."}),
  Object.freeze({id:"write-marriage30-current-choice-report",icon:"▤",title:"30일 현재 선택 리포트를 작성한다",description:"기억 복원이 아니라 확인·경계·재협상·중단권으로 만든 30일의 변화를 요약한다.",effects:{confidence:5,trust:4,energy:-2},scenarioEffects:{investigation:2},flag:"day30_free_campaign_report",requiresFlag:"marriage30CampaignCompleted",summary:"30일 동안 현재의 선택으로 다시 만든 관계와 생활을 요약했다."}),
  Object.freeze({id:"rest-after-day30-decision",icon:"☾",title:"결말 뒤 함께 쉰다",description:"외부 반응과 사진·공지·점수를 열지 않고 오늘의 선택 뒤 회복한다.",effects:{energy:20,fatigue:-16,stress:-12,health:6},scenarioEffects:{},flag:"day30_recovery_rest",summary:"DAY 30의 선택을 마친 뒤 외부 평가 없이 함께 쉬었다."})
]);

export const STORY_FEATURES=Object.freeze([
  Object.freeze({id:"phone",label:"스마트폰",reason:"일반 스마트폰 기능은 아직 해금되지 않았습니다."}),
  Object.freeze({id:"shop",label:"온라인 쇼핑",reason:"스마트폰 기능이 아직 해금되지 않았습니다."}),
  Object.freeze({id:"investment",label:"투자",reason:"금융 정보와 계정이 아직 복구되지 않았습니다."}),
  Object.freeze({id:"map",label:"지도",reason:"아직 자유롭게 이동할 수 없습니다."}),
  Object.freeze({id:"contacts",label:"인맥",reason:"기억과 연락처가 아직 복구되지 않았습니다."}),
  Object.freeze({id:"job",label:"직장",reason:"단계적 복귀 범위가 아직 합의되지 않았습니다."})
]);

const ACTIONS_BY_DAY=Object.freeze({1:DAY1_HOSPITAL_ACTIONS,2:DAY2_HOME_ACTIONS,3:DAY3_DISCHARGE_ACTIONS,4:DAY4_HOME_ACTIONS,5:DAY5_OFFICE_ACTIONS,6:DAY6_HOME_ACTIONS,7:DAY7_HOME_ACTIONS,8:DAY8_HOME_ACTIONS,9:DAY9_HOME_ACTIONS,10:DAY10_HOME_ACTIONS,11:DAY11_HOME_ACTIONS,12:DAY12_HOME_ACTIONS,13:DAY13_HOME_ACTIONS,14:DAY14_HOME_ACTIONS,15:DAY15_CAFE_ACTIONS,16:DAY16_HOME_ACTIONS,17:DAY17_HOME_ACTIONS,18:DAY18_HOME_ACTIONS,19:DAY19_HOME_ACTIONS,20:DAY20_HOME_ACTIONS,21:DAY21_OFFICE_ACTIONS,22:DAY22_HOME_ACTIONS,23:DAY23_HOME_ACTIONS,24:DAY24_HOME_ACTIONS,25:DAY25_HOME_ACTIONS,26:DAY26_HOME_ACTIONS,27:DAY27_HOME_ACTIONS,28:DAY28_HOME_ACTIONS,29:DAY29_HOME_ACTIONS,30:DAY30_HOME_ACTIONS});

export function getStoryFreeActionWindow(day=1,id=""){
  return (STORY_FREE_ACTION_WINDOWS[day]??[]).find(window=>!id||window.id===id)??null;
}

export function getStoryFreeActions(state){const actions=state.day===8&&state.storyFlags?.day8V3Complete===true?DAY8_V3_HOME_ACTIONS:state.day===9&&state.storyFlags?.day9V3Complete===true?DAY9_V3_HOME_ACTIONS:(ACTIONS_BY_DAY[state.day]??[]);return actions.filter(action=>(!action.requiresFlag||state.storyFlags?.[action.requiresFlag])&&(!action.requiresAction||state.scenario?.unlockedActions?.includes(action.requiresAction)));}

export function ensureStoryFeatureUnlocks(state){
  state.scenario??={};
  state.scenario.featureUnlocks??={phone:false,messages:false,contacts:false,shop:false,investment:false,map:false,job:false};
  return state.scenario.featureUnlocks;
}

export function getStoryFeatureAvailability(state,featureId){
  const feature=STORY_FEATURES.find(item=>item.id===featureId);
  const storyPhone=featureId==="phone"&&state.scenario?.unlockedActions?.includes("smartphone-basic");
  const storyJob=featureId==="job"&&state.scenario?.unlockedActions?.includes("day5-work-trial");
  const storyMap=featureId==="map"&&state.scenario?.unlockedActions?.includes("current-life-map");
  const storyContacts=featureId==="contacts"&&state.scenario?.unlockedActions?.includes("past-contacts-index");
  const unlocked=Boolean(ensureStoryFeatureUnlocks(state)[featureId]||storyPhone||storyJob||storyMap||storyContacts);
  const day2PhoneReason=state.day===2&&featureId==="phone"&&state.storyFlags?.haeun_contact_unlocked?"예비폰은 하은·병원 연락만 가능하며 일반 앱은 잠겨 있습니다.":null;
  return {id:featureId,label:feature?.label??featureId,available:unlocked,reason:unlocked?"":day2PhoneReason??feature?.reason??"아직 해금되지 않았습니다."};
}

export function beginStoryFreeAction(state,windowId=""){
  const definition=getStoryFreeActionWindow(state.day,windowId);
  if(!definition)return null;
  ensureStoryFeatureUnlocks(state);state.currentLocation=definition.location;
  const current=state.storyFreeAction;
  if(current?.windowId===definition.id&&current.day===state.day)return current;
  state.phase=definition.phaseIndex;
  state.storyFreeAction={windowId:definition.id,storySceneId:definition.storySceneId,day:state.day,phase:definition.phase,location:definition.location,maxActions:definition.maxActions,used:0,status:"ACTIVE",snapshot:createDaySnapshot(state),chosenActionId:null,result:null,event:null,reportShown:false};
  return state.storyFreeAction;
}

function applyScenarioEffects(state,effects={}){state.scenario??={};for(const [key,value] of Object.entries(effects))state.scenario[key]=Math.max(0,Number(state.scenario[key]??0)+Number(value));}

export function rollStoryFreeActionEvent(state,random=Math.random){
  const progress=state.storyFreeAction,definition=getStoryFreeActionWindow(state.day,progress?.windowId);
  if(!progress||!definition)return null;
  return rollSharedFreeActionEvent(state,{random,overrides:{occurrence:"free-action-result",location:definition.location,phase:definition.phase,activeStoryId:definition.storySceneId,...definition.eventContext}});
}

export function resolveStoryFreeAction(state,actionId,{random=Math.random}={}){
  const progress=state.storyFreeAction;
  if(!progress||progress.status!=="ACTIVE"||progress.used>=progress.maxActions)return null;
  const action=getStoryFreeActions(state).find(item=>item.id===actionId);if(!action)return null;
  applyEffects(state,action.effects);applyScenarioEffects(state,action.scenarioEffects);
  state.storyFlags??={};state.storyFlags[action.flag]=true;state.storyFlags[`day${state.day}_free_action_choice`]=action.id;
  if(action.id.includes("rest"))state.storyFlags.recovery_focus=true;
  state.actionHistory??=[];state.actionHistory.push({day:state.day,phase:state.phase,id:action.id,actionId:action.id,title:action.title,tag:"스토리 자유행동",effects:{...action.effects}});
  progress.used+=1;progress.chosenActionId=action.id;progress.event=rollStoryFreeActionEvent(state,random);progress.status=progress.event?.scenes?.length?"EVENT":"REPORT";progress.result={title:action.title,summary:action.summary,effects:{...action.effects}};
  return progress;
}

export function getStoryFreeActionReport(state){
  const progress=state.storyFreeAction;if(!progress)return [];
  const original=state.dayStartSnapshot;state.dayStartSnapshot=progress.snapshot;const report=getDailyReport(state);state.dayStartSnapshot=original;return report;
}

export function markStoryFreeActionEventComplete(state,eventId){const progress=state.storyFreeAction;if(!progress||progress.status!=="EVENT"||progress.event?.id!==eventId)return false;progress.status="REPORT";return true;}

export function completeStoryFreeAction(state){
  const progress=state.storyFreeAction;if(!progress||progress.status!=="REPORT")return false;
  progress.status="COMPLETE";progress.reportShown=true;state.storyFlags??={};state.storyFlags[`day${progress.day}FreeActionComplete`]=true;return true;
}

export function validateStoryFreeActionData(){
  const groups=[DAY1_HOSPITAL_ACTIONS,DAY2_HOME_ACTIONS,DAY3_DISCHARGE_ACTIONS,DAY4_HOME_ACTIONS,DAY5_OFFICE_ACTIONS,DAY6_HOME_ACTIONS,DAY7_HOME_ACTIONS,DAY8_HOME_ACTIONS,DAY9_HOME_ACTIONS,DAY10_HOME_ACTIONS,DAY11_HOME_ACTIONS,DAY12_HOME_ACTIONS,DAY13_HOME_ACTIONS,DAY14_HOME_ACTIONS,DAY15_CAFE_ACTIONS,DAY16_HOME_ACTIONS,DAY17_HOME_ACTIONS,DAY18_HOME_ACTIONS,DAY19_HOME_ACTIONS,DAY20_HOME_ACTIONS,DAY21_OFFICE_ACTIONS,DAY22_HOME_ACTIONS,DAY23_HOME_ACTIONS,DAY24_HOME_ACTIONS,DAY25_HOME_ACTIONS,DAY26_HOME_ACTIONS,DAY27_HOME_ACTIONS,DAY28_HOME_ACTIONS,DAY29_HOME_ACTIONS,DAY30_HOME_ACTIONS],actions=[...groups.flat(),...DAY8_V3_HOME_ACTIONS,...DAY9_V3_HOME_ACTIONS];return Array.from({length:30},(_,i)=>i+1).every(day=>STORY_FREE_ACTION_WINDOWS[day].length===1)&&groups.every(items=>items.length===5)&&DAY8_V3_HOME_ACTIONS.length===5&&DAY9_V3_HOME_ACTIONS.length===5&&new Set(actions.map(action=>`${action.id}`)).size===actions.length&&STORY_FEATURES.length===6;
}
