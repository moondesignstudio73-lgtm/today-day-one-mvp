# DAY 20 V4 구현 계획 — 같은 집, 다른 하루

## 원문 잠금

- Notion page: `3c9c31f0-29a6-81b3-b82a-c4fbc39173e4`
- title: `DAY 20 — 같은 집, 다른 하루 | SCENARIO V4`
- last edited: `2026-08-27T20:17:26.218Z`
- 규모: 번호 장면 24개, 대면 선택 14개, 혼자 선택 4개, 갈등 경로 대체 선택 1개. 25~35분은 미측정 목표이며 경로별 동일 분량을 주장하지 않는다.
- 상태: **SOURCE LOCK COMPLETE / IMPLEMENTATION FOUNDATION**. Notion connector의 전체 응답에서 플레이어 본문 경계를 다시 추출해 SCENE 01~24와 선택 1~14를 `docs/scenarios/DAY20_SCENARIO_V4_NOTION.md`에 잠갔다. 저장된 UTF-8 본문은 19,242자(마지막 개행 포함), SHA-256 `9db072f65fd3b0e0bf930628bbcb9e1601153413377baced59b0ae43ceeb3c1e`이며 내부 편집 메모는 제외했다.

감정 목적: 하은을 잘 대접해야 한다는 긴장을 내려놓고, 아무것도 해 주지 않는 시간에도 서로 곁에 있고 싶어 하는 저녁을 선택한다.

## DAY 17~19 실제 이력 감사

- DAY17은 `day17V4Meeting`, `day17V4MutualRest`, `day17V4CloseRest`, 실제 DAY18 약속과 하은 공개 여부를 저장한다. 휴식·나란히 앉기는 포옹이나 완전 회복이 아니다.
- DAY18은 `day18V4`의 실제 저녁 상대, 수신자별 발화와 정정, 하은 식사/자리/산책/손잡기, 밤 경로, 여행 후보를 저장한다. 여행 후보는 예약·지출이 아니다.
- DAY19는 `day19V4`의 실제 준비·예산·후보·미예약·저녁·내일 식사·내일 식탁 선택을 저장한다. `tomorrowMeal === ACCEPTED`일 때만 DAY20 대면이 가능하다.
- 기존 `day20CurrentSharedMealPending`은 legacy 선택기의 임시 호환 표식이다. DAY20 V4의 사실 원천은 검증된 `day19V4` 스냅샷이며 완료 slot만 보고 방문을 만들지 않는다.

## INPUT 계약

- 검증되고 완료된 `day19-notion-v4/1`과 `day19V4Day20HookPending === true`.
- `visitMode`: 실제 내일 식사 수락과 현재 연락 가능을 모두 만족할 때만 `FACE_TO_FACE`, 나머지는 `SOLO`.
- `invitation.status/sourceChoiceId`: 수락 여부와 선택 13 근거를 분리 저장.
- `cupConversationExperienced`: DAY19의 실제 `CUPS_TOGETHER` 선택만 true.
- `sharedTravelConversationExperienced`: DAY18~19의 실제 공동 계획 가능 경로만 true. 부산 후보·숙박·지출 완료로 확대 금지.
- 관계 활성/연락 가능/관계 톤/DAY18 후속 대화 미해결 여부.

## OUTPUT 계약

- 실제 방문/혼자, 준비 방식, 실제 가져온 물건과 부탁 물건.
- 컵 선택, 주방 역할, 식사 대화, 남은 관계 공개와 갈등 우회.
- 가만히 있기/각자 화면/공유된 화면 부분/저녁 연장.
- 빌린 옷은 실제 제공·수락 때만. 영구 아이템이나 다음 초대 의무로 만들지 않는다.
- 첫 포옹·나란히 앉기·손잡기는 각각 실제 경험만 독립 저장.
- 다음 초대, 노래 뒤의 말, 귀가/연장/머무름, 잠자리·거리·아침 합의.
- `stayedOver`는 숙박 제안이 아니라 하은의 실제 수락과 준비 가능까지 만족할 때만 true. 다른 접촉 동의를 포함하지 않는다.

## Scene Graph

```text
ENTRY
├─ FACE_TO_FACE: 01 준비 → 02 부탁 → 03 도착 → 04 컵 → 05~08 식사
│  ├─ 남은 관계 공개: 07 → 19 갈등 대화 → 21 귀가 → 24
│  ├─ 짧은 차 약속: 식사 문구 대체 → 13 이전 또는 20 → 21 → 24
│  └─ 편안한 저녁: 09~18 → 20
│     ├─ 귀가/짧은 연장 → 21 → 24
│     └─ 실제 숙박 합의 → 22 → 24
└─ SOLO: 01/02/04 생활 대체 → 23(선택 5~8) → 24
```

SCENE 12~18 친밀 장면은 갈등 경로에 붙이지 않는다. SCENE14의 첫 포옹은 쌍방 희망일 때만, SCENE21 작별 포옹은 이미 포옹을 실제 경험했고 지금도 원할 때만 가능하다. 키스는 DAY20 범위 밖이다.

## 플레이어 노출 타입

- 허용: 실제 대사, 주인공 독백, 꼭 필요한 짧은 상황 설명.
- 연출 전환: 씻기, 가방 내려놓기, 컵 들기, 요리·설거지, 화면 보여 주기, 옷 갈아입기 대기, 자리 이동, 포옹, 귀가, 조명 끄기.
- 금지: `DAY19에서`, `이 경로`, `선택 회수`, `조건`, `내부 메모`, 감정 목적·플래그·예상 시간.

## 구현 단계와 관문

1. ~~누락된 SCENE12~18 원문을 완전히 복원하고 해시/문자 수를 기록한다.~~ 완료.
2. ~~14개 대면 선택과 solo/conflict 대체 선택의 ID·정확한 라벨·반응을 source registry에 잠근다.~~ 완료. 14개 대면 + solo 4개 + conflict 1개를 서로 다른 variant로 보존한다.
3. ~~현재 `day20-v4-state-contract.mjs`의 foundation을 replay-locked 선택 reducer로 확장한다.~~ 완료. 대면/짧은 차/갈등/solo 진행표와 접촉·숙박 명시 응답을 포함한다.
4. opening / domestic / intimacy / ending playable 모듈과 game bridge를 구현한다. **진행 중:** opening SCENE01~04, domestic SCENE05~11, intimacy SCENE12~18, solo SCENE23~24 구현. legacy DAY20 저장은 자동 변환하지 않는다.
5. 원문 대조, Friendly/Neutral/Distant/Mixed, face/short/solo/conflict/stay/leave, 저장 재개, Story/Free 배타성, DAY21 후속을 검증한다.
6. 실제 데스크톱·389×844 모바일 비-SKIP 완주와 콘솔·이미지·오디오·오버플로를 확인한 뒤에만 COMPLETE로 승격한다.

## 현재 판정과 다음 시작점

- 상태 계약 foundation 및 반례 테스트: 구현.
- 원문 전체 잠금: COMPLETE. 24개 장면과 14개 선택의 연속 번호·해시·금지 메모 비포함 검사를 추가했다.
- source registry: COMPLETE. 생성기는 잠근 Markdown만 읽어 24개 장면과 19개 선택 블록을 만들며, 중복 번호 C5~8/C10은 `FACE_TO_FACE`/`SOLO`/`CONFLICT`로 분리한다. 실제 대사·독백·연출 단계는 exact source ref 없이는 통과하지 않는다.
- replay-locked reducer: COMPLETE. 대면 C1~14, solo 생활 대체 SCENE01/02/04→solo C5~8, 짧은 차 C1~3→C13 귀가, 공개 C5→conflict C10→귀가를 각각 재생 검증한다. 포옹/손잡기와 숙박은 플레이어 선택만으로 사실화하지 않고 `haeunContactResponse`/`haeunStayResponse`를 별도 기록하며, 숙박 수락은 준비와 잠자리 합의가 없으면 거부한다.
- playable: opening SCENE01~04 PASS. 초대 없는 날은 선택 C1~3을 억지로 제시하지 않고 생활 대체 원문 뒤 solo C5로 진입한다. 대면은 실제 DAY19 컵 대화 이력이 있을 때만 `가장 다양한 분야`를 회수한다.
- playable: domestic SCENE05~11 PASS. 실제 DAY19 여행 대화가 있을 때만 숙소 포장 농담을 회수하며, 공개 C5는 SCENE08~18을 붙이지 않고 SCENE19 경계로 간다. 각자 화면은 하은이 공유한 부분만 보여 준다.
- playable: solo SCENE23~24 PASS. solo C5~8의 실제 반응을 구현했고 연락 불가에서는 `오늘은 푹 쉬자`만 허용한다. 하은 대사·메시지·공동 컵·포옹·숙박은 생성하지 않는다.
- playable: intimacy SCENE12~18 PASS. 실제 대여 사실이 없으므로 옷을 바꾸지 않는 원문 분기를 사용한다. C10 포옹/손잡기 요청은 `haeunContactResolution` 단계로 멈추며, 수락 기록 뒤에만 해당 SCENE14~15 반응과 `firstHug`/`heldHands`를 노출한다. 현재 거리 선택은 접촉 없이도 완전한 경로다.
- runtime/game bridge/browser QA: NOT STARTED.
- DAY20 COMPLETE: **아님**.
- 다음 시작점: conflict SCENE19와 ending SCENE20~22/24를 구현하고 접촉·숙박 명시 응답 단계를 game bridge에 연결한다.
