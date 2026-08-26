import { applyEffects } from "./game-core.mjs?v=9";
import { createDaySnapshot, getDailyReport } from "./night-manager.mjs?v=2";
import { rollSharedFreeActionEvent } from "./event-compatibility.mjs?v=14";

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

export const DAY9_HOME_ACTIONS=Object.freeze([
  Object.freeze({id:"archive-ninety-minute-boundary",icon:"≡",title:"90분 업무 경계를 기록한다",description:"오늘 열람한 범위·맡지 않은 승인·종료 시각을 현재 업무 기록으로 남긴다.",effects:{work:4,confidence:5,energy:-3,stress:-2},scenarioEffects:{investigation:2},flag:"day9_free_archive_boundary",requiresAction:"bounded-office-contribution",summary:"도움과 승인 권한을 분리한 90분 업무 경계를 기록했다."}),
  Object.freeze({id:"review-current-queue",icon:"▧",title:"현재 업무 지도를 다시 확인한다",description:"담당·마감·막힌 지점만 확인하고 닫힌 과거 자료는 열지 않는다.",effects:{work:4,confidence:4,energy:-3},scenarioEffects:{investigation:3},flag:"day9_free_review_queue",requiresAction:"review-current-queue",summary:"현재 담당과 막힌 지점만 업무 지도에 남겼다."}),
  Object.freeze({id:"separate-coworker-feedback",icon:"◇",title:"동료 피드백을 두 칸으로 나눈다",description:"업무 판단과 팀 상호작용을 분리해 한 문장을 전체 평판으로 확대하지 않는다.",effects:{social:4,work:3,confidence:3,energy:-2},scenarioEffects:{coworkerRelation:2,seojinStatusInterest:1},flag:"day9_free_separate_feedback",requiresAction:"current-coworker-lunch",summary:"업무와 관계 피드백을 서로 다른 기록으로 분리했다."}),
  Object.freeze({id:"prepare-three-hour-rhythm",icon:"⌛",title:"DAY 10 세 시간 리듬을 준비한다",description:"중간 휴식·승인 금지·점심 중단 기준만 일정에 저장한다.",effects:{work:3,health:2,confidence:4,energy:-3},scenarioEffects:{},flag:"day9_free_prepare_rhythm",requiresFlag:"day10ThreeHourWorkRhythmPending",summary:"다음 근무의 시간·휴식·책임 범위를 늘리지 않고 준비했다."}),
  Object.freeze({id:"rest-after-second-office",icon:"☾",title:"업무 기록을 덮고 쉰다",description:"두 번째 출근을 더 평가하지 않고 회복을 우선한다.",effects:{energy:15,fatigue:-12,stress:-8,health:4},scenarioEffects:{},flag:"day9_recovery_rest",summary:"두 번째 직장 적응 뒤 추가 판단을 멈추고 충분히 쉬었다."})
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

export const STORY_FEATURES=Object.freeze([
  Object.freeze({id:"phone",label:"스마트폰",reason:"일반 스마트폰 기능은 아직 해금되지 않았습니다."}),
  Object.freeze({id:"shop",label:"온라인 쇼핑",reason:"스마트폰 기능이 아직 해금되지 않았습니다."}),
  Object.freeze({id:"investment",label:"투자",reason:"금융 정보와 계정이 아직 복구되지 않았습니다."}),
  Object.freeze({id:"map",label:"지도",reason:"아직 자유롭게 이동할 수 없습니다."}),
  Object.freeze({id:"contacts",label:"인맥",reason:"기억과 연락처가 아직 복구되지 않았습니다."}),
  Object.freeze({id:"job",label:"직장",reason:"단계적 복귀 범위가 아직 합의되지 않았습니다."})
]);

const ACTIONS_BY_DAY=Object.freeze({1:DAY1_HOSPITAL_ACTIONS,2:DAY2_HOME_ACTIONS,3:DAY3_DISCHARGE_ACTIONS,4:DAY4_HOME_ACTIONS,5:DAY5_OFFICE_ACTIONS,6:DAY6_HOME_ACTIONS,7:DAY7_HOME_ACTIONS,8:DAY8_HOME_ACTIONS,9:DAY9_HOME_ACTIONS,10:DAY10_HOME_ACTIONS,11:DAY11_HOME_ACTIONS,12:DAY12_HOME_ACTIONS,13:DAY13_HOME_ACTIONS,14:DAY14_HOME_ACTIONS});

export function getStoryFreeActionWindow(day=1,id=""){
  return (STORY_FREE_ACTION_WINDOWS[day]??[]).find(window=>!id||window.id===id)??null;
}

export function getStoryFreeActions(state){return (ACTIONS_BY_DAY[state.day]??[]).filter(action=>(!action.requiresFlag||state.storyFlags?.[action.requiresFlag])&&(!action.requiresAction||state.scenario?.unlockedActions?.includes(action.requiresAction)));}

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
  if(current?.windowId===definition.id&&current.day===state.day&&current.status!=="COMPLETE")return current;
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
  const actions=[...DAY1_HOSPITAL_ACTIONS,...DAY2_HOME_ACTIONS,...DAY3_DISCHARGE_ACTIONS,...DAY4_HOME_ACTIONS,...DAY5_OFFICE_ACTIONS,...DAY6_HOME_ACTIONS,...DAY7_HOME_ACTIONS,...DAY8_HOME_ACTIONS,...DAY9_HOME_ACTIONS,...DAY10_HOME_ACTIONS,...DAY11_HOME_ACTIONS,...DAY12_HOME_ACTIONS,...DAY13_HOME_ACTIONS,...DAY14_HOME_ACTIONS];return [1,2,3,4,5,6,7,8,9,10,11,12,13,14].every(day=>STORY_FREE_ACTION_WINDOWS[day].length===1)&&[DAY1_HOSPITAL_ACTIONS,DAY2_HOME_ACTIONS,DAY3_DISCHARGE_ACTIONS,DAY4_HOME_ACTIONS,DAY5_OFFICE_ACTIONS,DAY6_HOME_ACTIONS,DAY7_HOME_ACTIONS,DAY8_HOME_ACTIONS,DAY9_HOME_ACTIONS,DAY10_HOME_ACTIONS,DAY11_HOME_ACTIONS,DAY12_HOME_ACTIONS,DAY13_HOME_ACTIONS,DAY14_HOME_ACTIONS].every(items=>items.length===5)&&new Set(actions.map(action=>`${action.id}`)).size===actions.length&&STORY_FEATURES.length===6;
}
