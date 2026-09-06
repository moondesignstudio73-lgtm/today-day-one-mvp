# DAY27 V4 구현 계획 — 2026-09-06

## 판정과 원문

- 현재 상태: **PARTIAL / SOURCE LOCKED**.
- 최종 원문: Notion `DAY 27 — 되돌릴 수 없는 말 | SCENARIO V4`.
- page id: `3c9c31f0-29a6-81fe-b0e1-df8c541775c9`.
- last edited snapshot: `2026-08-27T20:56:48.044Z`.
- 플레이어 공개 snapshot: `docs/scenarios/DAY27_SCENARIO_V4_NOTION.md`, UTF-8 16,953자(마지막 LF 포함), 24 Scene, 23 choice block, SHA-256 `61aa989b03f52252ab1a017f6d7b1c564a4aa9e7f2cbb045bd6ee91a2455e595`.
- source registry variant: `COMMON_MORNING`, `CONVERSATION_START`, `RELATIONSHIP_TRUTH`, `HONEST_LISTENING`, `PUBLIC_CORRECTION`, `CONVERSATION_END`, `JIHOON_SUPPORT`, `COMMON_EVENING`, `CONTINUING_NIGHT`, `SEPARATION_NIGHT`, `NO_CONVERSATION`.
- 내부 편집 메모와 구현 설명은 snapshot과 renderer에서 제외한다.

## 한 문장 정의

관계를 잃지 않으려고 흐리거나 삼킨 말을 두 사람이 입 밖으로 꺼내고, 사과의 보상을 요구하지 않은 채 상대의 실제 대답을 듣는 날.

## 기존 구현 감사

현재 `src/day27-campaign-runtime.mjs`는 다섯 장면과 세 선택으로 구성된 요약형 legacy 구현이다. 최종 V4의 24 Scene, 실제 관계 상태 거짓말 수신자, 하은의 자기억제 대화, 공개 발언 정정, 이별·비대화 대체 경로와 맞지 않는다. 기존 DAY27 진행 저장은 legacy로 보존하고, 검증된 DAY26 V4 완료 저장만 신규 schema로 진입시킨다.

## DAY27 INPUT — DAY24~26 실제 이력 감사

- `day24V4`, `day25V4`, `day26V4`가 모두 유효·완료되고 DAY26의 DAY27 hook이 있을 때만 신규 DAY27을 연다.
- DAY24 관계 상태 발언은 실제 단일 수신자, 실제 문장, 당시 관계의 진실, 정정 여부를 그대로 동결한다. 다른 사람이 알아냈거나 하은에게 자동 전달된 것으로 만들지 않는다.
- DAY25의 하은 관계 결과(지속·재논의·종료), 새 만남의 독립 응답, 다음 대화/거리 요청을 유지한다. 주인공의 제안만으로 약속이나 관계를 만들지 않는다.
- DAY26에서 실제로 앞서 말한 공개 문장과 실제 정정 대상·완료 여부를 분리한다. 축하나 침묵을 합의로 바꾸지 않는다.
- DAY26 `day27Handoff`의 실제 청취 대상, 다음 대화 시간, 연락 허용, 거리 요청을 고정한다. 오늘 대화에 응하지 않았거나 몸 상태로 미뤘다면 SCENE23만 열고 듣지 못한 대답을 만들지 않는다.
- 현재 에너지·스트레스·잔액과 지훈 연락 가능성을 보존한다. 어려운 대화를 이유로 새 식사비나 만남을 자동 생성하지 않는다.

## DAY27 OUTPUT

- 실제 대화 상대와 방식, 시작/연기 여부 및 상대의 현재 응답.
- 관계 상태 거짓말의 정정·반복·미정정, 수신자별 인지 상태와 요청한 거리.
- 하은에게 실제로 밝힌 사실, 하은의 독립 답변, 관계 지속·유예·종료 결과.
- 숨긴 관계가 없는 경로의 양쪽 자기억제 발화와 각자 고른 한 가지 부탁.
- DAY26 공개 선행 발언의 실제 정정 여부와 대상.
- 지훈에게 실제로 공유한 범위, 저녁 행동, 연락 제한 준수.
- 다음 대화는 상대의 현재 수락이 있을 때만 일정으로 만들고, 관계 종료 뒤에는 정리할 실제 물건만 기록한다.
- DAY28에는 상호 확인된 만남·거리·정정 대상만 전달한다.

## Scene Graph

```text
DAY26 완료 이력 → SCENE01 / C1
  ├─ 오늘 대화가 실제 가능 → SCENE02 / C2
  │    ├─ 실제 관계 상태 거짓말 있음 → SCENE03~09 / C3~7
  │    └─ 거짓 없음·자기억제 대화 → SCENE10~14 / C8~10
  │         └─ DAY26 실제 선행 발언 있음 → SCENE15 / C11
  │    → SCENE16~17 / C12
  │    → 지훈 가능 시 SCENE18 / C13
  │    → SCENE19 / C14
  │    ├─ 정직·관계 지속·연락 허용 → SCENE20~21 / C15~16
  │    └─ 이별·연락 중지 → SCENE21 / 대체 C15
  │    → SCENE22 → SCENE24
  └─ 대화 미성립·연기 → SCENE23 / 대체 C3~8 → SCENE24
```

## 핵심 불변식

- 실제 수신자가 들은 실제 말만 정정하며, 발각·스크린샷·휴대전화 열람·추적을 만들지 않는다.
- 한 사람에게 사과해도 다른 사람의 인지 상태는 자동 변경되지 않는다.
- 사과는 용서·포옹·재결합·결혼의 보상이 아니다.
- 하은과 다른 상대는 주인공과 독립된 현재 응답과 대화 종료권을 가진다.
- 관계 종료는 한 사람의 명확한 의사로 유효하며, 상대가 동의하지 않아도 연인 행동을 계속하지 않는다.
- 연락 휴식·거리 요청·대화 연기는 실패가 아니고, 듣지 못한 답을 추론하지 않는다.
- 선택 분기 설명과 편집 메모를 일반 대화창에 출력하지 않는다.
- 신규 CG는 `docs/STORY_V4_IMAGE_STYLE_RULES.md`를 통과해야 하며 큰 POV 손이나 실사형 손을 만들지 않는다.

## 구현 단계와 완료 관문

1. ~~Notion 최종 원문을 플레이어 공개 snapshot으로 잠그고 내부 편집 메모를 분리한다.~~ 완료.
2. ~~24 Scene·23 choice block·11개 variant와 모든 라벨을 기계 생성 registry 및 SHA 검증으로 고정한다.~~ 완료.
3. DAY24~26 실제 이력을 동결하는 `day27-notion-v4/1` replay-locked 상태 계약과 legacy 진입 분리를 구현한다.
4. SCENE01~09/C1~7 대화 시작·실제 수신자 관계 진실 경로를 exact-source ref로 구현한다.
5. SCENE10~17/C8~12 정직한 자기억제·공개 정정·관계 종료/지속 경로를 구현한다.
6. SCENE18~24/C13~16 및 이별·비대화 대체 C3~8을 구현한다.
7. game bridge, 저장 재개, 현재 응답, presentation, Story/Free 배타성을 연결한다.
8. source/state/playable/bridge/저장/전체 30일 회귀를 통과한다.
9. Friendly/Neutral/Distant/Mixed의 거짓 정정·정직 대화·관계 종료·비대화를 데스크톱과 389×844에서 SKIP 없이 검증한다.
10. 원문·런타임 텍스트·콘솔·이미지·오디오·오버플로·DAY28 전환이 모두 PASS일 때만 DAY27 COMPLETE로 승격한다.

## 다음 시작점

`day27-notion-v4/1` 상태 계약에서 DAY24의 실제 발화/수신자, DAY25 관계 결과, DAY26의 공개 정정·청취 대상·연락/거리 요청을 input seal로 먼저 고정한다.
