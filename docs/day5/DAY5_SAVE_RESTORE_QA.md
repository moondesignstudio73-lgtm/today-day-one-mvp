# DAY 5 여섯 저장 지점 복원 QA

상태: **PASS — 6/6 저장·복원·다음 단계 진행**

## 체크포인트

1. 선택 1 직후 `after-entry-choice`: stage 1의 SCENE 03부터 복원.
2. SCENE 03 직후 `after-introductions`: 저장 마커 이전을 건너뛰고 SCENE 04부터 복원.
3. 선택 2 직후 `after-seojin-choice`: stage 2의 SCENE 06부터 복원.
4. 선택 3 직후 `after-work-choice`: stage 3의 SCENE 07부터 복원.
5. 선택 4 직후 `after-return-choice`: stage 4의 선택 반응과 SCENE 08부터 복원.
6. DAY REPORT 직전 `before-day-report`: 볶음밥 문자와 선택 콜백을 중복 재생하지 않고 DAY REPORT부터 복원.

선택 체크포인트는 기존 stage 0~4 및 레거시 선택 ID를 유지한다. 비선택 체크포인트는 런타임 `checkpoint` 단계에서 즉시 저장되며, 새 런타임 인스턴스가 해당 마커 뒤부터 시퀀스를 구성한다. 선택 효과는 `day5ChoiceEffectsApplied`로 중복 적용되지 않는다.

집중 검증: `tests/day5-runtime.test.mjs`  
다음 관문: DAY 4→DAY 5→DAY 6 인접 도달성과 전체 런타임 통합 QA.
