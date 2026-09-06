# DAY24 V4 브라우저 QA — 2026-09-06

## 판정

- Friendly · 대면 · 관계 지속 데스크톱 경로: PASS.
- DAY24 전체: PARTIAL. Neutral/Distant/Mixed, 통화/오늘 거절, 유예/종료, 연락 대상·거짓말·새 만남, 389×844 검증이 남아 있다.

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

## 발견 및 조치

- DAY24 단독 fixture의 새 모듈 체인은 브라우저에서 불안정하게 로드될 수 있어, 이미 검증된 DAY23 브라우저 fixture에서 연속 플레이하는 harness로 바꿨다.
- 브라우저 fixture에서 사용되는 DAY22/23 helper는 `node:assert` 의존을 제거하고 동일한 fail-fast 검사를 브라우저 호환 `ensure`로 유지했다.

## 다음 관문

1. Neutral · 통화 · 유예와 Distant · 오늘 거절/종료를 데스크톱에서 SKIP 없이 완주한다.
2. 유리·서진·아라·연락 없음, 관계 상태 거짓말 정정/지속, 조건부 새 만남을 의미 경로별로 검증한다.
3. Friendly/Neutral/Distant/Mixed 대표 경로를 실제 `389×844`에서 재실행하고 가로 넘침·인물/장소 누출을 확인한다.
4. 모든 관문과 집중/전체 회귀가 PASS일 때만 DAY24를 COMPLETE로 승격한다.
