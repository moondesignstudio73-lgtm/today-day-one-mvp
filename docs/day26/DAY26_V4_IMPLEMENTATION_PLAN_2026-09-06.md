# DAY26 V4 구현 계획 — 2026-09-06

## 판정과 원문

- 현재 상태: **PARTIAL / SOURCE LOCKED**.
- 최종 원문: Notion `DAY 26 — 사람들 앞의 우리 | SCENARIO V4`.
- page id: `3c9c31f0-29a6-815a-bd8b-cbd60569e6bf`.
- last edited snapshot: `2026-08-27T20:51:27.362Z`.
- 플레이어 공개 snapshot: `docs/scenarios/DAY26_SCENARIO_V4_NOTION.md`, UTF-8 17,245자(마지막 LF 포함), 24 Scene, 28 choice block, SHA-256 `9b9d73d8372f6c89d34f9612660d92ba262b9e2a003b5f5a8b17d3c3f02007b5`.
- source registry variant: `COMMON_START`, `HAEUN_FRIEND_MEAL`, `JIHOON_MEAL`, `NEW_MEETING`, `SOLO_DAY`, `HAEUN_NIGHT`, `COMMON_ENDING`.
- `INTERNAL EDITORIAL NOTES`, 대체된 V3, 구현 설명은 플레이어 공개 source와 renderer에서 제외한다.

## 한 문장 정의

사람들 앞에서 관계의 이름을 설명하더라도 축하받고 싶은 마음으로 상대의 대답을 대신하지 않고, 실제로 함께 정한 범위와 각자의 현재 목소리를 다시 확인하는 날.

## 기존 구현 감사

현재 `m30-day26-current-legal-preparation`은 최소 법적 서류·권리·서명 중단권을 정하는 4단계 요약이다. 최종 V4의 친구 모임, 공개 범위, 하은의 독립 발화, 새 만남, 관계 상태 거짓말 정정, 혼자 보내는 하루와 맞지 않는다. 기존 진행 저장은 legacy로 보존하고 검증된 DAY25 V4 완료 저장만 신규 schema로 진입시킨다.

## DAY26 INPUT — DAY23~25 실제 이력 감사

- `day23V4`, `day24V4`, `day25V4`가 모두 유효하고 완료되었으며 `day25V4Day26HookPending === true`인 경우만 신규 DAY26 V4를 연다.
- DAY25의 `relationshipContinues`, `haeunFutureOutcome`, `day26Route`, `friendMealPlan`, `friendMealScheduled`, 친구별 현재 가능 응답, `socialScope`, `publicBoundary`를 그대로 동결한다. 친구 식사가 실제 확정되지 않았으면 SCENE02~14 네 사람 식탁을 만들지 않는다.
- DAY24~25의 단일 새 만남 대상, 현재 메시지와 독립 응답을 전달한다. DAY25 응답이 `ACCEPTED`이고 오늘 가능한 약속이 명시된 경우에만 SCENE16~20을 열며 `RESCHEDULED`·`CANCELLED`를 오늘 식사로 바꾸지 않는다.
- DAY24의 `relationshipStatusLie`는 실제 수신자·발화·진실·정정 여부를 유지한다. 그 수신자가 오늘 실제 맞은편에 있을 때만 SCENE19 질문을 연다. 다른 인물에게 거짓을 복제하거나 하은에게 자동 유출하지 않는다.
- 하은과 관계 지속·재논의·결혼 준비·종료를 구별하고, DAY25 입맞춤 여부나 결혼 준비를 친구 모임 참석권으로 사용하지 않는다.
- 지훈·소라의 실제 인지/소개 이력과 DAY19 숙소 농담 이력을 보존한다. 모르는 소라는 오늘 처음 소개하고, 실제 없던 숙소 농담·여행·사진·옷 구매를 회상하지 않는다.
- 현재 에너지·스트레스·보유 의상·잔액을 동결한다. 피로를 말한 선택은 실패가 아니며, 모임 식비와 새 만남 식비를 이중 지출하지 않는다.

## DAY26 OUTPUT

- 실제 착용한 보유 의상 또는 외출 축소 요청과 상대의 현재 일정 응답.
- 네 사람 식탁의 실제 참석자, 공개한 관계 범위, 하은이 직접 말한 내용, 주인공의 선행 발언·중단·정정 여부.
- 현재 피로 공개/휴식/추가 체류와 실제 귀가 시점.
- 지훈 단독 식사, 새 만남, 혼자 생활 중 실제 발생한 단일 경로와 해당 인물의 독립 응답.
- 새 만남의 현재 관계 의도, 실제 거짓말 질문·정정/반복 여부, 다음 만남 제안과 상대 응답. 주인공 제안만으로 연인·약속을 확정하지 않는다.
- 하은 밤 연락 가능 여부와 그녀의 `괜찮다` 자기 억제 발화, 다음 대화 시점·정정 대상·거리 존중을 DAY27 hook으로 전달한다.

## Scene Graph

```text
DAY25 완료 이력 → SCENE01 / C1 공통
  ├─ 실제 네 사람 식사 확정
  │    → SCENE02~14 / C2~12
  │    → 관계·연락 가능 시 SCENE22 / C13
  │    → SCENE23~24 / C14 → ending
  ├─ 지훈 단독 식사 실제 합의
  │    → SCENE15 / 대체 C2~3
  │    → 관계·연락 가능 시 SCENE22 / C13
  │    → SCENE23~24 / C14 → ending
  ├─ DAY25에서 오늘 새 만남 실제 수락
  │    → SCENE16~20 / 대체 C4~8
  │    → 실제 동일 수신자 거짓말이 있을 때만 SCENE19
  │    → SCENE23~24 / C14 → ending
  └─ 모임·새 만남 없음
       → SCENE21 / 대체 C2~8
       → 관계·연락 가능 시 SCENE22 / C13
       → SCENE23~24 / C14 → ending
```

## 핵심 불변식

- 관계 이름은 상대의 현재 생각 전체를 대신하지 않는다.
- 축하·친구 반응·침묵은 하은의 결혼 속도나 동의가 아니다.
- 소라는 하은의 속마음을 통역하지 않고 지훈은 기다림의 채무를 만들지 않는다.
- 피로·휴식·조기 귀가는 관계 실패가 아니며 한번 괜찮다고 말해도 바꿀 수 있다.
- 새 상대는 단일 실제 약속에서만 등장하고 주인공의 호감 고백만으로 연인이 되지 않는다.
- 거짓말 질문은 실제 수신자가 실제 들은 말에 대해서만 한다. 자동 폭로·증거 유출·초능력 의심을 만들지 않는다.
- 선택 분기 설명과 편집 메모를 일반 대화창에 출력하지 않는다.
- 신규 CG는 `docs/STORY_V4_IMAGE_STYLE_RULES.md`를 통과해야 하며 큰 POV 손이나 실사형 손을 만들지 않는다.

## 구현 단계와 완료 관문

1. ~~Notion 최종 원문을 플레이어 공개 snapshot으로 잠그고 내부 편집 메모·V3를 분리한다.~~ 완료.
2. ~~24 Scene·28 choice block·7개 variant와 모든 3개 라벨을 기계 생성 source registry와 SHA 검증으로 고정한다.~~ 완료.
3. DAY23~25 실제 이력을 동결하는 `day26-notion-v4/1` replay-locked 상태 계약과 legacy 진입 분리를 구현한다.
4. SCENE01~14/C1~12 네 사람 식탁 경로를 exact source ref로 구현한다. 선행 발언·하은 발화 중단·정정·피로·귀가를 상태로 구분한다.
5. SCENE15 대체 C2~3 지훈 단독 식사와 SCENE16~20 대체 C4~8 새 만남을 구현한다. 현재 응답과 약속 수락을 별도 resolution으로 둔다.
6. SCENE21 대체 C2~8 혼자 생활, SCENE22/C13 조건부 하은 밤 연락, SCENE23~24/C14 ending과 DAY27 hook을 구현한다.
7. game bridge, 저장 재개, 시간·장소·인물 presentation, Story/Free 배타성, 실제 단일 식비를 연결한다.
8. source/state/playable/bridge/저장/경제/전체 30일 시뮬레이션 회귀를 통과한다.
9. Friendly/Neutral/Distant/Mixed의 네 사람 식사·재논의·혼자·지훈 단독·새 만남·거짓말 정정/반복을 데스크톱과 389×844에서 SKIP 없이 검증한다.
10. 원문·런타임 텍스트·콘솔·이미지·오디오·오버플로·DAY27 전환이 모두 PASS일 때만 DAY26 COMPLETE로 승격한다.

## 명확화/안전 결정

- DAY25 `newMeetingResponse=RESCHEDULED`는 오늘 식사로 간주하지 않는다. 실제 오늘 약속이 별도 확인되지 않으면 혼자 생활로 닫는다.
- 지훈 단독 식사는 DAY25에서 실제 별도 합의가 없으면 자동 생성하지 않는다. 지훈이 알려져 있거나 연락 가능하다는 사실만으로 오늘 약속을 만들지 않는다.
- SCENE05의 `빨리 한다` 뒤 정정/버팀은 runtime에서 하은의 현재 정정 발화와 주인공의 후속 선택 기록을 분리해야 한다. 침묵을 동의로 처리하지 않는다.

## 다음 시작점

`day26-notion-v4/1` 상태 계약에서 DAY25 완료 input seal과 네 사람/지훈/새 만남/혼자 경로를 분리한다. 이 관문 전까지 DAY26는 **PARTIAL**이다.
