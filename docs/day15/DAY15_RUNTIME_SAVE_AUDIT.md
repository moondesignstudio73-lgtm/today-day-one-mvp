# DAY 15 런타임·선택 상태·저장 복원 구현 감사

판정: `RUNTIME / SAVE RESTORE PASS`
기준 Scene: `m30-day15-current-leisure-date`
기준 시나리오: `docs/day15/DAY15_SCENARIO_DRAFT_V1.md`
NEEDS FIX: 0

## 구현 범위

- `src/day15-campaign-runtime.mjs`를 잠금 시나리오와 `ready` 프레젠테이션 데이터에 연결했다.
- 8개 Scene의 배경 분기·카메라·BGM·19개 생활 SFX와 하은 DAY 7 외출복을 런타임 단계에 적용했다.
- 활동 배분·계획 변경·기록 공개의 3단계, 총 27개 선택 경로를 독립 상태로 저장한다.
- DAY 14 탐색·구매·선물 동의 9개 전략을 각각 고유 대사와 행동으로 회수한다.

## 작은 위화감·정보 예산

- 첫 선택 뒤 `day15LeisureReservationVisitLabel=unverified`와 `leisure-reservation-label-mismatch`를 저장한다.
- 현재 계정의 `첫 예약`과 업체 화면의 `재방문`만 관찰하고 사용자·시각·기기·방문일 출처 부재를 확인한다.
- 전화번호 업체 기록, 계정 병합, 과거 대리 예약, 업체 기본 라벨 가능성을 모두 남기며 현재 데이트 판단에는 사용하지 않는다.
- 사고 고의·범인·가짜 하은·잠금 프로필은 공개하거나 해금하지 않는다.

## 선택 효과

- 선택별 `affection`, `trust`, `health`, `energy`, `stress`, `confidence` 효과와 `haeunAffection`/`haeunTrust` 효과를 잠금 대본 그대로 한 번만 적용한다.
- 동일 선택 재적용은 성공한 기존 stage만 반환하고 효과·단서·행동·훅을 중복 적용하지 않는다.
- 다른 축을 건너뛰거나 이미 확정한 축을 다른 선택으로 바꾸는 요청은 상태 변경 없이 거부한다.
- 윤서진 `seojinAffection`과 `seojinStatusInterest`는 각 선택 전후에 독립 값을 보존한다.

## 저장·복원 체크포인트

| 체크포인트 | 저장 상태 | 재개 프레젠테이션 |
|---|---|---|
| A / stage 0 | DAY 14 세 축, DAY 15 미선택 | 집 아침·후보 카드 |
| B / stage 1 | 활동 전략, 예약 라벨 `unverified`, 라벨 불일치 단서 | 활동별 책방 또는 전시 |
| C / stage 2 | 활동·변경 전략, 선택별 수치 효과, 기존 미확인 단서 | 동네 카페 |
| 완료 / stage 3 | 세 선택 축, 두 현재 기억, 완료 플래그, DAY 16 훅 | 카페 기록 화면 |

- `SaveManager.save/load` JSON 왕복을 27개 모든 경로의 각 단계에서 수행했다.
- 레거시 저장의 stage 누락은 선택을 추정하지 않고 stage 0으로 복원한다.
- 완료 시 `day15CurrentLeisureDatePending=false`, `day15CurrentLeisureDateCompleted=true`, `day16CurrentSocialCirclePending=true`가 된다.
- `current-leisure-date`, `date-change-boundary`, `private-date-record`, `current-leisure-date-record`, `day16-current-social-circle`은 고유 컬렉션으로 저장한다.

## 불변·도달성

- `day11ScheduleNoteMismatch=unverified`, `day14PastPreferenceRecommendation=unverified`를 해결하거나 덮어쓰지 않는다.
- 기본 `finance`/`shop`만 보존하고 자동결제·고가 구매·투자를 해금하지 않는다.
- 프로필 해금은 0건이며 자유 연애 모드에는 DAY 15 Scene·플래그·단서가 유입되지 않는다.
- 완료 기록을 가진 DAY 16 상태는 `m30-day16-current-social-circle`에 도달한다.

## 검증 결과

- Node 문법: `src/day15-campaign-runtime.mjs`, `tests/day15-runtime.test.mjs`, `game.js` PASS.
- DAY 15 계약·초안·잠금 시나리오·프레젠테이션·런타임 집중 검사 PASS.
- DAY 14/16 인접 런타임 도달성 PASS.
- DAY 15 자유행동, DAY 2~30 자유행동 감사, 브라우저 엔트리 94개 PASS.
- `tests/simulation.test.mjs` 전체 회귀 PASS.

다음 관문은 DAY 15 전용 집중 회귀 파일로 레거시·무효 입력·스포일러·불변·인접 도달성을 별도 고정하고 전체 회귀를 재실행하는 것이다.
