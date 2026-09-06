# DAY24 V4 브라우저 QA — 2026-09-06

## 판정

- Friendly · 대면 · 관계 지속 데스크톱 경로: PASS.
- Neutral · 통화 · 관계 유예 데스크톱 경로: PASS.
- Distant · 연락 불가 · 이미 종료된 관계 데스크톱 경로: PASS.
- Distant · 대면 · 활성 관계 명시적 종료 데스크톱 경로: PASS.
- DAY24 전체: PARTIAL. Mixed, 연락 대상·거짓말·새 만남, 389×844 검증이 남아 있다.

## 환경과 진입

- 로컬 HTTP 서버: `http://127.0.0.1:8018`.
- 실제 인앱 브라우저에서 검증된 DAY22 완료 `Friendly · 부산 공유 숙소` fixture로 진입했다.
- DAY23을 노출된 첫 선택지 18개로 SKIP 없이 완주해 `relationshipOutcome=CONTINUE`, `farewellContact=SHORT_HUG`, `nextConversation=MEET`인 실제 DAY24 입력을 만들었다.
- DAY24도 AUTO는 대사 진행에만 사용하고 SKIP은 누르지 않았으며, 노출된 첫 선택지 14개를 실제 화면에서 선택했다.

## 관찰 결과

- DAY24 시작 `09:00`, 낮 `15:00`, 저녁 `19:00` presentation과 DAY25 `08:00` 전환을 실제 화면에서 확인했다.
- 대면 흐름은 하은과의 현재 대화를 거쳐 관계 지속으로 닫혔고, 미래 대화는 별도 현재 응답 뒤에만 수락됐다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=MEET`, `relationship=CONTINUE`, `futureAccepted=true`, `day25Route=HAEUN_FUTURE`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- 브라우저 console warning/error 0. legacy DAY24 Free Action은 끼어들지 않았다.
- QA 전 사용자 저장은 같은 탭의 session backup에서 복원했고 화면에서 `테스트 전 저장을 복원했습니다.`를 확인했다.

## Neutral · 통화 · 관계 유예

- 부산 별실 DAY22 완료 fixture에서 DAY23의 노출 선택지 18개를 SKIP 없이 진행했다. C9는 `이번 시간은 좋았는데, 내 마음은 조금 더 이야기하고 싶어.`, C17은 `전화로 먼저 이야기하고 싶어.`를 선택해 DAY24 입력을 만들었다.
- DAY24에서는 C3 `좋아하는데 아직 대답 못 한 마음이 있어.`, C6 `나는 시간이 더 필요해. 네가 기다리지 않는 것도 받아들일게.`를 선택하고 나머지는 첫 노출 선택으로 진행했다.
- 대면 카페 장면 없이 통화 흐름으로 진행됐고 관계 유예 뒤 하은 미래 대화 수락을 만들지 않은 채 DAY25로 전환됐다. 실제 화면에서 DAY24 `15:00`과 DAY25 `08:00`을 확인했다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=PHONE`, `relationship=DEFER`, `futureAccepted=false`, `day25Route=DEFERRED_RELATIONSHIP`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- browser warning/error 0, 사용자 저장 복원 PASS.

## Distant · 대면 · 활성 관계 명시적 종료

- 연락 가능한 DIFFICULT 부산 별실 fixture에서 DAY23을 SKIP 없이 완주해 `relationshipOutcome=UNSURE`, `nextConversation=MEET`인 활성 관계 입력을 만들었다.
- DAY24 대면 대화에서 C6 `좋았던 날 때문에 미뤘지만, 여기서 헤어지고 싶어.`를 직접 선택하고 나머지 노출 선택을 진행해 DAY25까지 완주했다.
- 관계 종료 뒤 산책과 하은 미래 대화 수락은 열리지 않았고, 실제 다른 연락 상대가 없는 상태에서 새 만남을 보상처럼 확정하지 않았다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=MEET`, `relationship=END`, `futureAccepted=false`, `day25Route=RELATIONSHIP_ENDED`.
- 확인 시점에 존재한 Free Action은 DAY25 전환 뒤의 `day25-home-evening`이었으며 DAY24 legacy Free Action은 아니었다. `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`를 함께 확인했다.
- browser warning/error 0, 사용자 저장 복원 PASS.

## Distant · 연락 불가 · 이미 종료된 관계

- 관계·연락이 이미 끝난 DAY22 미여행 fixture에서 DAY23 C1~8과 DAY24의 실제 노출 선택 7개를 SKIP 없이 진행했다.
- DAY24는 하은의 메시지·대면·통화를 새로 만들지 않았고, 현재 관계 응답도 조작하지 않은 채 자기 생활과 남은 말만 정리했다. 실제 화면에서 DAY24 `11:30`과 DAY25 `08:00` 전환을 확인했다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=null`, `relationship=null`, `futureAccepted=false`, `day25Route=RELATIONSHIP_ENDED`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- browser warning/error 0, 사용자 저장 복원 PASS.

## 발견 및 조치

- DAY24 단독 fixture의 새 모듈 체인은 브라우저에서 불안정하게 로드될 수 있어, 이미 검증된 DAY23 브라우저 fixture에서 연속 플레이하는 harness로 바꿨다.
- 브라우저 fixture에서 사용되는 DAY22/23 helper는 `node:assert` 의존을 제거하고 동일한 fail-fast 검사를 브라우저 호환 `ensure`로 유지했다.

## 다음 관문

1. 유리·서진·아라·연락 없음, 관계 상태 거짓말 정정/지속, 조건부 새 만남을 의미 경로별로 검증한다.
2. Mixed 대표 경로와 Friendly/Neutral/Distant를 실제 `389×844`에서 재실행하고 가로 넘침·인물/장소 누출을 확인한다.
3. 모든 관문과 집중/전체 회귀가 PASS일 때만 DAY24를 COMPLETE로 승격한다.
