# DAY 19 V4 구현 계획 — 돈으로 사려던 시간

## 원문 잠금

- Notion page id: `3c9c31f0-29a6-8126-8d1d-dd90f6b6d7f4`
- last edited: `2026-08-27T20:11:18.241Z`
- 공개 본문: 24 Scene, 16 Choice. `INTERNAL EDITORIAL NOTES`는 플레이어에게 출력하지 않는다.
- 로컬 source lock: `docs/scenarios/DAY19_SCENARIO_V4_NOTION.md`
- 기계 생성 registry: `src/day19-v4-source-registry.mjs`

기존 `day19-campaign-runtime.mjs`의 집안일 5장면·3선택과 `late-story-v4-expansion.mjs`의 4막 보충은 이 원문을 구현한 것으로 인정하지 않는다. 새 전용 V4 경로가 브라우저 QA를 통과할 때까지 DAY 19 상태는 `PARTIAL`이다.

## 입력 계약

DAY 19 시작 시 DAY 18의 실제 저장 결과만 읽는다.

- `day18V4.complete === true`와 `day18V4Day19HookPending === true`
- 관계 활성/연락 가능 여부
- DAY 18에서 하은과 여행을 함께 이야기했는지, 여행 후보가 무엇이었는지
- 대화가 평온했는지, 논의가 남았는지, 연락을 쉬기로 했는지
- DAY 18 follow-up의 `CONTACT_PROMISED`, `TIME_WINDOW_AGREED`, `DISCUSSION_PENDING`, `NONE`
- 유리 만남과 현재 관심을 하은에게 실제로 알렸는지
- 기존 자산, 거래, 복권 구매 기록. 받지 않은 상금·새 임금·새 업무는 만들지 않는다.

`후보`, `동행 관심`, `예산 의사`, `방문 조율`을 각각 `예약 완료`, `동행 수락`, `송금`, `유급 근무 확정`으로 승격하지 않는다.

## 16단계 상태 그래프

```text
SCENE 01~02 → C1 여행 다음에 볼 것 → C2 현재 범위
SCENE 03~04 → C3 기대에 쓸 돈
SCENE 05 → C4 민호에게 보낼 답
SCENE 06~08 → [실제 연락/동행 상태] → C5 함께 쓰는 돈 또는 solo 대체 선택
SCENE 09 → C6 일정에서 뺄 것
SCENE 10~11 → C7 준비한 이유
SCENE 12~13 → C8 동행을 기다리는 법
SCENE 14 → C9 돈을 쓰고 싶은 이유
SCENE 15 → C10 오늘 남길 계획
SCENE 16 → C11 예약 앞에서(오늘 결제 없음)
SCENE 17 → C12 아직 받지 않은 기대
SCENE 18 → C13 오늘 저녁
SCENE 19 → [내일 집 식사에 실제 수락] → C14 shared/solo 변형
SCENE 20 → [실제 남은 연락만] → C15 또는 선택 없이 진행
SCENE 21 → C16 먼저 남겨 둘 돈
SCENE 22~24 → 조건부 후속 대화 → DAY 19 END
```

## 선택별 핵심 출력

- C3 복권: 사전 오락비가 있고 실제 잔액이 충분할 때만 고정 티켓 비용을 지출한다. DAY 19 본문에서는 결과를 확정하거나 상금을 여행비에 더하지 않는다. 기존 즉석 당첨 API는 이 장면에 직접 호출하지 않는다.
- C4 민호: 날짜/시간/내일 회신 상태만 기록한다. 임금, 고용, 방문 확정은 기록하지 않는다.
- C5: 하은과 함께 계획을 볼 수 있는 실제 상태에서만 shared 문구를 쓴다. 그 외에는 원문의 solo 세 선택을 사용한다.
- C7: DAY 18의 어려운 관계를 좋은 방으로 해소하지 않는다. 평온한 경로에는 없던 의심을 새로 만들지 않는다.
- C11: 모든 경로에서 오늘은 후보와 조건만 남긴다. 결제·예약·짐 싸기 없음.
- C13~14: 내일 집 식사는 제안과 수락을 분리한다. 거절/휴식이면 solo 준비만 표시한다.
- C15: 유리·서진·아라 중 실제 미완료 연락이 있을 때만 표시하며 없는 NPC 연락을 생성하지 않는다.

## 저장·호환 계약

- 새 저장은 `storyFlags.day19V4`에 schema, 동결된 entry input, 순서가 있는 16단계 choice 기록, 사실과 완료 여부를 저장한다.
- 기존 `day19RoleStrategy`, `day19ZoneStrategy`, `day19RenegotiateStrategy`, `day19RuntimeStage`가 이미 시작된 저장은 legacy 런타임으로 유지한다.
- 새 V4 완료 뒤에도 캠페인 slot `m30-day19-current-shared-chore`는 DAY 20 구버전 저장 조회 호환용으로 유지하되, history facts/choices는 DAY 19 V4 실제 결과를 기록한다.
- Story 선택 전후 JSON 왕복 복원과 Scene-start 재개가 동일해야 한다. Free Action은 `sceneEnd` 이후에만 열린다.

## 구현 순서와 QA 게이트

1. source registry 24/16와 정확 선택 문구 자동 검사.
2. 전용 replay-locked state contract와 legacy 진입 판정.
3. 조건부 source selector: 대면/통화/solo, shared/solo C5·C14, C15 유무.
4. 24 Scene playable script: 대화=`dialogue`, 내면=`monologue`, 물리 행동=`stageAction`/CG/SFX. 개발 메모와 조건 설명은 출력하지 않는다.
5. game bridge 연결, 기존 축약 expansion의 DAY 19 적용 제거, 캐시 버전 상승.
6. 모든 선택의 저장/불러오기, 과거 3일 이력 경계, Story/Free 배타성 자동 검사.
7. Friendly/Neutral/Distant/Mixed 실제 브라우저 비-SKIP 완주, 대표 중간 저장 재개, 390×844 모바일, 콘솔 0, 사용자 저장 복원.
8. 전체 회귀와 시뮬레이션 통과 후에만 DAY 19 `COMPLETE` 및 DAY 20 진입.

## 현재 판정

`PARTIAL` — 1단계 source registry와 2단계 전용 replay-locked 상태 계약을 완료했다.

상태 계약은 DAY 18 완료본에서 관계 온도, 연락 가능 여부, 함께 여행을 실제로 이야기했는지, 실제 미완료 연락만 동결한다. 16개 선택을 순서대로 재생해 저장 변조를 거부하며, 연락이 없으면 C15를 건너뛴다. C5·C14는 shared/solo 문구를 분리한다. C11은 어떤 선택도 예약으로 기록하지 않고, C3은 사전 오락비가 없으면 구매를 중단하며 기존 즉석 당첨 API를 호출하지 않는다. 기존 DAY 19 진행 키가 있는 저장은 legacy로 유지한다.

집중 검사 8/8 PASS. 다음 작업은 **3단계 조건부 source selector와 첫 playable script 구간(SCENE 01~05/C1~C4)**이다.
