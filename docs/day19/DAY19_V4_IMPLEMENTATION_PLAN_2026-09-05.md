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

집중 검사 8/8 PASS.

### SCENE 01~05 구현 후속

- source line selector가 원문 장면·행 번호·정확 문장을 확인하며 없는 문장은 fail-closed 한다.
- SCENE 01~05와 C1~C4의 모든 반응을 `dialogue`/`message`/`monologue`/비출력 `stageAction`으로 분리했다. `narration`과 원문 조건 설명의 자동 출력은 없다.
- 연락 휴식 입력에서는 C1의 하은 연락 선택을 제거한다. C13에서도 연락 불가 입력은 각자 식사만 남기도록 상태 계약을 보강했다.
- C3는 사전 오락비가 없으면 구매 중단 장면만 재생하고, 자격이 있어도 결과 미확정 상태만 표시한다. 이 순수 플레이 구간은 잔액·당첨금을 직접 변조하지 않는다.
- C4는 날짜 확인/소요 시간 질문/내일 회신만 표시하며 새 업무·보수·정규 근무를 만들지 않는다.
- 5개 장면 구간은 아직 게임 본선 브리지에 연결하지 않았다. 실제 브라우저 QA 증거가 아니며 DAY19는 계속 `PARTIAL`이다.

source/state/opening 집중 검사 13/13 PASS. 다음 작업은 **SCENE 06~12/C5~C7 조건부 source selector와 playable script**다.

### SCENE 06~12 구현 후속

- DAY18에서 하은과 여행을 실제로 이야기했고 관계가 평온하며 연락 가능한 입력만 `CALL_SHARED`로 재생한다. 새 당일 대면 약속은 만들지 않고 통화로 후보를 한 장씩 본다.
- 그 외 입력은 SCENE06~12의 solo/아직 동행 미정 원문만 사용한다. 하은의 대사, 예산, 승인, 컵 반응을 생성하지 않는다.
- C5는 shared 예산 3선택과 solo 생활비 3선택을 분리한다. 어느 쪽도 하은 돈을 합산하거나 송금으로 기록하지 않는다.
- C6은 장소 제거/늦은 출발/한 가지 우선순위를 원문 반응으로 재생하며, solo 경로에서는 하은이 함께 고친 것처럼 말하지 않는다.
- C7의 좋은 하루/능력 증명/관계 회복 동기를 실제 관계 온도에 맞춰 처리한다. solo·불편한 경로에는 하은의 안심이나 수락을 만들지 않는다.
- SCENE12까지 exact source line ownership과 순수 재생을 검증했다. 아직 본선 브리지 및 실제 브라우저에는 연결하지 않았다.

middle/state 집중 검사 9/9 PASS. 다음 작업은 **SCENE 13~17/C8~C12 playable script와 후보≠예약 계약**이다.

### SCENE 13~17 구현 후속

- C8의 조건만 저장/각자 하루/원하는 것 공유를 shared·solo로 분리했다. shared에서도 하은의 일정 확인 전에는 관심만 남고 동행 수락은 기록하지 않는다.
- C9는 편한 이동/풍경/남길 돈의 이유만 기록한다. solo 경로는 하은의 몸·예산·답을 끌어오지 않는다.
- C10 부산/서울/미루기 후보는 실제 이동과 귀가 범위를 포함하지만 예약·출발·짐 싸기로 승격하지 않는다.
- C11 세 선택은 모두 `CANDIDATE_ONLY`로 귀결된다. 먼저 잡고 싶다는 선택도 하은 반응 뒤 결제 버튼에서 손을 떼며 잔액과 지출은 변하지 않는다.
- C12는 실제 지출만 보며 미확정 복권 결과나 오지 않은 수입을 합산하지 않는다. 지훈은 복권 구매를 듣지 않았으므로 복권을 아는 대사를 하지 않는다.
- exact source ownership, solo 하은 비노출, 순수 재생과 후보≠예약 반례를 검증했다. 본선 브리지/브라우저는 아직 미연결이다.

candidates/state 집중 검사 9/9 PASS. 다음 작업은 **SCENE 18~24/C13~C16 ending playable script**다.

### SCENE 18~24 구현 후속

- 통화로 계획한 경로는 같이 앉아 컵을 챙긴 것처럼 만들지 않고 각자 저녁으로 전환한다. 연락 불가 경로에서는 C13을 각자 식사 하나로 제한한다.
- 내일 집 식사는 제안과 응답을 분리한다. 평온한 shared 입력에서 하은이 가능한 시간을 명시한 경우만 `ACCEPTED`가 되고 shared C14가 열린다. 그 외에는 solo 식탁 준비만 표시한다.
- C15는 유리·서진·아라 중 실제 이어 온 연락이 entry input에 있을 때만 나타난다. 조건 설명이나 존재하지 않는 NPC 이름은 화면에 출력하지 않는다.
- C16과 SCENE22~24는 하은 돈을 합산하지 않고, shared/거리 두기/solo 및 내일 식사 약속을 실제 facts로 분기한다.
- 마지막 출력은 SCENE24 원문 독백 뒤 `chapterCompletionCue`이며 아직 상태 완료나 DAY20 이동을 직접 수행하지 않는다.
- ending/state 집중 검사 9/9 PASS. SCENE01~24 순수 플레이 계층은 준비됐으나 본선 브리지, 경제 원장의 원자적 복권 처리, 저장/로드와 실제 브라우저 QA는 남아 있다.

DAY19는 `PARTIAL`. 다음 작업은 **네 playable 구간을 통합하는 game bridge와 본선 교체, 저장/로드 자동 QA**다.

### 본선 브리지 및 자동 저장 QA 후속

- 네 playable 구간을 `day19-v4-game-bridge.mjs`에서 연결했다. C4/C7/C12 반응 뒤 내부 boundary를 화면에 보내지 않고 각각 다음 원본 장면까지 연속 재생한다.
- 본선 `game.js`는 DAY 18 V4 완료·DAY 19 hook을 확인한 새 저장만 DAY 19 V4로 시작한다. 기존 DAY 19 축약 진행 키가 있는 저장은 계속 legacy로 재개한다.
- C3 복권은 사전 오락비와 실제 잔액이 모두 있을 때만 5,000원을 경제 원장에 한 번 차감한다. 기존 즉석복권 API를 호출하지 않아 등급·결과·상금을 만들지 않으며 적용 실패 시 장/잔액/원장을 원자적으로 복구한다.
- SCENE24 완료 cue는 실제 choices/facts와 미확정 복권 구매만 캠페인 history에 기록한다. legacy 집안일 선택 효과와 legacy DAY 19 Free Action은 실행하지 않는다.
- 실제 `SaveManager` 중간 저장 왕복과 다음 segment 동일성, shared/solo 16단계 도달, legacy 비변조, 본선 라우팅, 전체 자동 회귀와 100×30일 시뮬레이션을 통과했다. 상세 증거는 `DAY19_V4_GAME_BRIDGE_2026-09-05.md`에 있다.

DAY19는 계속 `PARTIAL`. 다음 작업은 **실제 브라우저 Friendly 비-SKIP 완주와 대표 중간 저장 재개**, 이후 Neutral/Distant/Mixed 및 390×844 모바일 QA다.

### 실제 브라우저 Friendly 후속

- 전용 fixture로 모든 저장 슬롯을 한 번 백업한 뒤 DAY18 평온한 하은 여행 대화 완료 상태에서 본선 DAY19를 시작했다.
- 15개 실제 선택(C15 조건부 생략)과 SCENE01~24를 SKIP 없이 진행해 DAY20 선택 화면에 도달했다.
- C5 직후 새로고침/이어하기가 반응 구간부터 재생되어 C6 선택으로 복귀했다. 네 구간 경계, 시간·장소, 후보≠예약, 미완료 연락 없음, Story/Free 배타성을 실제 화면에서 확인했다.
- 데스크톱 1484×799에서 가로 넘침 0, console warning/error 0, 사용자 저장 복원 PASS. 상세 증거는 `DAY19_V4_BROWSER_QA_2026-09-05.md`에 있다.

DAY19는 계속 `PARTIAL`. 다음 작업은 **Mixed 데스크톱 비-SKIP 완주**다.

### game249 Distant 경계 보강

- 실제 Distant 플레이로만 드러난 공동 C8, 두 사람 C11, 합의 범위 C16 노출을 원문 조건 위반으로 판정했다.
- 기존 저장 검증에 쓰는 replay option은 그대로 두고, 신규 화면에 그리는 playable option만 연락 가능/공동 계획 입력에 맞춰 좁혔다. 이미 선택된 구버전 저장은 유효하지만 새 Distant 플레이는 존재하지 않는 공동 의사나 합의를 선택할 수 없다.
- 수정 후 DAY20까지 실제 비-SKIP 완주 및 저장 복원 PASS. DAY19 전체는 아직 `PARTIAL`이다.

### Mixed 실제 QA 후속

- 연락 가능/solo DAY18 fixture에 필수 `disclose_solo`, `night_defer`, `alone_stop`을 연결해 검증 가능한 실제 이력으로 교정했다.
- 새 클린 탭에서 16개 선택을 비-SKIP 완주했다. C3 실제 복권 선택 1회, C15 서진 미완료 연락 노출, 내일 식사 비수락 뒤 solo C14, 합의 금액 없는 solo C16, DAY20 전환과 사용자 저장 복원 PASS다.
- console warning/error 0, 대면 인물 오노출 0, 데스크톱 가로 넘침 0. 다음은 Neutral 데스크톱이다.

### game250 Neutral 경계 보강

- 실제 C8 각자 여행 뒤 C11 공동 재확인과 SCENE22 편안한 공동 통화가 남는 문제를 발견했다.
- 상태 replay 호환성은 보존하고 presentation에서만 각자 여행 C11을 후보 유지로 좁혔으며, SCENE22를 `거리를 두고 있는 밤` 원문 분기로 연결했다.
- 수정 후 15개 선택을 비-SKIP 완주했다. 각자 저녁→solo C14, C15 생략, C16 실제 합의 범위만 기록, 거리 두기 SCENE22/24, DAY20 전환, console warning/error 0, 사용자 저장 복원 PASS.
- 데스크톱 네 경로가 모두 닫혔다. 다음은 유효 390×844 모바일 Friendly부터 순차 완주한다.

### 모바일 Friendly 실제 QA 후속

- 목표 390×844의 장치 배율 반올림값인 실제 `391×844`에서 모바일 미디어쿼리가 활성화된 상태로 SCENE01부터 DAY20 첫 선택까지 진행했다.
- Friendly 15개 선택을 실제 버튼으로 눌렀고 C15는 실제 미완료 연락이 없어 나타나지 않았다. SKIP은 사용하지 않았다.
- 선택 경계의 최대 수평 넘침 0, 최종 `scrollWidth=clientWidth=391`, console warning/error 0, DAY20 Story 선택 표시와 Free Action 비노출을 확인했다.
- fixture의 사용자 저장을 복원하고 viewport를 reset했다. DAY19는 `PARTIAL`이며 다음은 모바일 Distant다.
