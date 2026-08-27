# DAY 15 집중 테스트·전체 회귀 QA

상태: **PASS**
DAY 15 NEEDS FIX: **0**

## 검증 범위

- DAY 15 계약·초안·잠금 시나리오·프레젠테이션·런타임 집중 테스트
- 활동 배분 3 × 계획 변경 3 × 기록 공개 3의 27개 경로와 각 단계 실제 `SaveManager` 왕복
- DAY 14 → DAY 15 → DAY 16 순차 도달과 DAY 15 최종 선택의 단일 기록
- 선택 상태가 없는 레거시 DAY 15 저장의 stage 0 안전 복원
- 예약 `첫 예약`/`재방문` 표기 불일치의 `unverified` 보류와 중복 없는 단서·행동·후속 훅
- DAY 11·14 미확인 단서, DAY 14 전략, 윤서진 `AFFECTION`/`STATUS_INTEREST`, 금융·프로필·반전 잠금 보존
- 자유 연애 모드 격리, DAY 15 자유행동, DAY 14/16 인접 런타임
- 브라우저 엔트리 94개 경로, 자유 모드 `gh-pages` 통합, 전체 시뮬레이션

## 실행 결과

- Node 문법 검사: PASS (`day15-campaign-runtime`, `day15-presentation-data`, DAY 15 런타임/회귀 테스트, `game.js`)
- DAY 15 집중 테스트 7종: PASS
- DAY 14/16 인접 테스트 3종: PASS
- DAY 2~30 자유행동 감사: PASS
- 브라우저 엔트리 94개 경로: PASS
- 자유 모드 `gh-pages` 통합 회귀: PASS
- `tests/simulation.test.mjs`: PASS

## 독립 회귀 고정

`tests/day15-regression.test.mjs`는 저감각 활동 → 강변 변경 → 위치 비저장 경로를 각 stage에서 저장·복원하고, 완료 뒤 최종 선택이 한 번만 기록되는지 확인한다. DAY 16 진입, 레거시 stage 0, 자유 모드 격리, 조기 반전·범인 단정·상투적 공포 문구 차단도 함께 고정한다.

## 다음 관문

실제 브라우저에서 DAY 14 완료 상태부터 DAY 15 세 선택, stage 1 새로고침·이어하기, 별도 SKIP 경로, 자유행동, DAY 16 진입, 이미지·오디오·콘솔을 연속 검수한다.
