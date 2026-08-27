# DAY 14 런타임·저장 복원 구현 감사

상태: `RUNTIME / SAVE RESTORE PASS`

NEEDS FIX: 0

기준 Scene ID: `m30-day14-current-choice-spending`

## 구현 감사 결과

- 잠금 대본의 8개 Scene을 `DAY14_PRESENTATION_SCENES`의 `ready` 배경·카메라·표정·전환·생활 SFX에 직접 연결했다.
- DAY 13의 예산 기준·분담·검토 3×3 선택을 각각 고유 행동·대사로 회수했다.
- DAY 14 탐색·구매·선물 동의 3×3×3, 총 27경로를 독립 선택 필드와 선택 ID 플래그로 저장한다.
- 첫 선택 뒤 `day14PastPreferenceRecommendation=unverified`를 저장하고, 사용자·시간·기기 출처 부재와 복수의 생활적 설명을 플레이어 대사에서 확인한다.
- 추천 보류는 현재 구매 판단과 분리되며 사고·정체·책임 주체로 확대하지 않는다.

## 상태·효과 계약

| 단계 | 저장 필드 | 해금·후속 |
|---|---|---|
| 탐색 | `day14LaneStrategy`, `day14RuntimeStage=1` | `current-choice-spending`, 추천 `unverified` |
| 구매 | `day14PurchaseStrategy`, `day14RuntimeStage=2` | `controlled-shopping-checkout` |
| 선물 동의 | `day14ConsentStrategy`, `day14RuntimeStage=3` | `shop`, `gift-consent-boundary`, `basic-online-shopping` |
| 완료 | `day14CurrentChoiceSpendingCompleted=true` | `current-choice-spending-record`, `day15-current-leisure-date` |

- 자동결제·고가 구매·투자 기능은 잠긴 상태를 유지한다.
- 하은 관계 수치와 윤서진 `seojinAffection`/`seojinStatusInterest`는 변하지 않으며 두 축은 독립적으로 보존한다.
- DAY 11의 `day11ScheduleNoteMismatch=unverified`와 DAY 13 세 선택 기억도 변경하지 않는다.
- 잘못된 선택과 순서가 맞지 않는 선택은 상태를 바꾸지 않으며 같은 선택 재적용은 중복 컬렉션을 만들지 않는다.

## 저장·복원과 도달성

- 체크포인트 A/B/C를 실제 `SaveManager.save`/`load`로 왕복해 stage 1·2·3과 재개 배경을 검증했다.
- 누락된 `day14RuntimeStage`는 stage 0과 집 아침 장면으로 안전하게 복원하며 과거 선택을 추정하지 않는다.
- `unlockedActions`, `clues`, `followUpHooks`는 저장 왕복과 재적용 뒤에도 중복이 없다.
- 완료 저장은 DAY 15 `m30-day15-current-leisure-date`에 도달하고 자유 연애 모드에서는 DAY 14 캠페인 Scene이 선택되지 않는다.

## 검증 범위

- `tests/day14-runtime.test.mjs`: 8 Scene, 17 SFX, DAY 13 9콜백, 27경로, 실저장 복원, 무효·순서 오류, 중복 적용, 금융·관계 불변, DAY 15 도달성.
- `game.js`는 DAY 14 런타임 캐시 버전 `v=2`를 사용한다.
- 신규·기존·사용자 이미지·영상·음악 자산 변경: 0건.

## 다음 관문

- DAY 14 계약·시나리오·프레젠테이션·런타임·자유행동의 집중 테스트와 DAY 13/15 인접 도달성, 전체 회귀를 독립 관문으로 최종 실행한다.
