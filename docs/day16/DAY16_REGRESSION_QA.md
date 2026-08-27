# DAY 16 집중 테스트·전체 회귀 QA

상태: **PASS**
DAY 16 NEEDS FIX: **0**

## 검증 범위

- DAY 16 계약·초안·잠금 시나리오·프레젠테이션·런타임 집중 테스트
- 연락 3 × 만남 3 × 공유 3의 27개 경로와 각 단계 실제 `SaveManager` 왕복
- DAY 15 → DAY 16 → DAY 17 순차 도달과 DAY 16 최종 선택의 단일 기록
- 선택 상태가 없는 레거시 DAY 16 저장의 stage 0 안전 복원
- DAY 15의 9개 선택과 DAY 4 지훈 12개 선택의 고유 후속 대사
- 연락 범위·종료권·과거 미디어·제3자 공유 동의의 독립 저장과 컬렉션 중복 방지
- DAY 11·14·15 미확인 단서, 윤서진 `AFFECTION`/`STATUS_INTEREST`, 금융·프로필·반전 잠금 보존
- 자유 연애 모드 격리, DAY 16 자유행동, DAY 15/17 인접 런타임, 브라우저 엔트리와 전체 시뮬레이션

## 실행 결과

- Node 문법 검사: PASS (`day16-campaign-runtime`, `day16-presentation-data`, DAY 16 런타임/회귀 테스트, `game.js`)
- DAY 16 집중 테스트 6종: PASS
- DAY 15/17 인접 테스트와 DAY 16 자유행동: PASS
- 브라우저 엔트리 모듈 95개 경로: PASS
- `tests/simulation.test.mjs`: PASS

## 독립 회귀 고정

`tests/day16-regression.test.mjs`는 글 소개 → 즉시 종료권 → 사람별 공유 동의 경로를 각 stage에서 저장·복원한다. 완료 뒤 최종 선택 단일 기록, DAY 17 진입, 레거시 stage 0, 자유 연애 격리, 조기 반전·범인 단정·상투적 공포 문구 차단도 함께 고정한다.

## 다음 관문

실제 브라우저에서 DAY 15 완료 상태부터 DAY 16 세 선택, stage 1 새로고침·이어하기, 별도 SKIP 경로, 자유행동, DAY 17 진입, 이미지·오디오·콘솔을 연속 검수한다.
