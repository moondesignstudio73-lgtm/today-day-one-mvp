# DAY21 V4 구현 계획 — 2026-09-06

## 판정과 원문

- 현재 상태: PARTIAL / SOURCE LOCKED.
- 최종 원문: Notion `DAY 21 — 남겨 둔 자리 | SCENARIO V4`.
- page id: `3c9c31f0-29a6-8138-9d37-e5b6c8b74a32`.
- last edited snapshot: `2026-08-27T20:23:21.832Z`.
- 플레이어 공개 본문: `docs/scenarios/DAY21_SCENARIO_V4_NOTION.md`, UTF-8 19,525자, 24 Scene, 주경로 선택 1~16, 비대화 대체 선택 4~8.
- SHA-256: `39797c3086e9e2f23c4fc4acc37c9fe1525816e74a21fd709b011a4fdbcb9589`.
- 내부 편집 메모는 source snapshot과 player renderer에서 제외한다.

## 한 문장 정의

하은의 기다림을 한결같은 희생으로만 읽던 주인공이 그녀가 실제로 살았던 평범하고 복잡한 하루를 듣고, 과거에 대한 고마움과 지금 함께하고 싶은 마음을 서로 다른 말과 선택으로 남기는 날.

## 기존 구현 감사

현재 `day21-campaign-runtime.mjs`는 `하루를 끝까지 일하는 법`이라는 5장면·3선택 전일 근무 요약이며 최종 V4의 제목, 사건, 장소, 선택, 후속과 일치하지 않는다. 일반 대화창에도 업무 범위·과거 권한·근태 시스템 같은 설계 요약을 `narration`으로 출력한다. 기존 저장은 legacy로 보존하되 신규 DAY21 진입은 별도 V4 schema와 bridge로 교체해야 한다.

## DAY21 INPUT

- 검증된 `day20V4.complete === true`와 `day20V4Day21HookPending === true`.
- 관계 활성 여부와 현재 연락 가능 여부.
- DAY20 `visitMode`, `stayedOver`, 합의된 `sleepingPlan`, `cupChoice`, `borrowedClothes` 실제값.
- DAY20 `firstHug`, `heldHands`, `satSideBySide`, `eveningExtension`, `nextInvitation`, `disclosureRoute`, `nightEnd`.
- DAY19 `travelCandidate`, `reservationStatus === CANDIDATE_ONLY`, `budgetMode`, `scheduleTrim`, `pendingContacts`, `contactHandling`, `minhoReply`.
- DAY18~20에서 실제 하은 대화·지훈 농담·미뤄 둔 연락을 경험했는지 여부.
- 관계 tone과 이야기 청취·접촉이 가능한 현재 경계.

## DAY21 OUTPUT

- 아침 형태: `STAYED_MORNING | MESSAGE_MORNING | SOLO_MORNING`.
- 이야기 자리: `PARK | PHONE | DEFERRED`와 실제 상호 수락.
- 하은의 점심·업무 집중·분노·양말 이야기를 각각 실제로 들었는지.
- 고마움과 현재 마음을 구분해 말한 방식.
- 접촉 요청과 하은의 별도 응답; 기존 포옹은 오늘 동의가 아니다.
- 저녁 형태와 여행 대화 가능 여부.
- 여행 결과: `BUSAN_CONFIRMED | SEOUL_DAY | DEFERRED | SOLO`, 실제 비용·날짜·이동·숙박 조건 확인.
- 숙박 공간 합의는 DAY20 숙박과 별개로 기록.
- 실제 예약·결제 여부, 각자 부담 범위, 짐 준비 여부.
- 비대화 경로의 자기 돌봄·연락·내일 계획과 `heardHaeunStory=false`.
- DAY22 후속 hook은 실제 확정된 여행 또는 각자 하루 결과를 함께 전달.

## Scene Graph

```text
SCENE01~03 아침
  ├─ DAY20 숙박 → 함께 아침
  ├─ 귀가 → 아침 메시지
  └─ 미방문/거리 → 혼자 아침
SCENE04 / C3 이야기 자리
  ├─ 공원 → SCENE05~17 대면
  ├─ 전화 → SCENE05~17 음성 전용 컷
  └─ 연기 → SCENE21 + 대체 C4~8
SCENE05~12 / C4~7 하은의 실제 하루 듣기
SCENE13~16 / C8~10 고마움·현재 마음·접촉 경계
SCENE17 / C11 저녁
SCENE18~20 / C12~14 여행 조건·숙박 공간·예약
  ├─ 모든 조건과 상호 동의 → 실제 확정
  ├─ 서울 당일
  └─ 보류/각자
SCENE22 / C15 실제 결과에 맞는 짐 또는 내일 준비
SCENE23 / C16 오늘 직접 들은 말만 회수
SCENE24 → DAY21 completion cue → DAY22
```

## 핵심 불변식

- 듣지 않은 하은의 점심·분노·양말 이야기는 flags, 회상, 마지막 농담에 존재하지 않는다.
- 공원은 서로 가능한 시간과 실제 수락이 있을 때만 방문한다. 전화에서 표정·손·포옹을 시각적으로 만들지 않는다.
- DAY20 숙박·컵·접촉은 오늘의 숙박 공간·접촉·영구 물건 동의가 아니다.
- DAY19 부산은 후보다. 날짜·돈·이동·방·변경 조건과 상호 동의가 모두 확인되어야 예약과 결제가 발생한다.
- 하은 몫을 주인공 자산으로 합산하지 않고 복권·수입·업무를 새로 만들지 않는다.
- 비대화 경로는 짧더라도 하은의 고백을 강제로 열지 않으며, 모르는 내용을 요약 narration으로 대체하지 않는다.
- Renderer에는 dialogue, monologue, 필요한 playerNarration만 전달하고 stage/design/continuity/flag/metadata는 출력하지 않는다.
- Story Choice 진행 중 Free Action을 열지 않는다.

## 구현 단계와 완료 관문

1. ~~Notion 최종 원문 플레이어 본문 잠금과 내부 메모 분리.~~ 완료.
2. ~~source registry에서 24 Scene, 주경로 C1~16, 비대화 C4~8의 정확 라벨·반응·variant를 생성한다.~~ 완료.
3. ~~DAY18~20 실제 이력을 동결하는 replay-locked 상태 계약과 legacy 진입 분리를 구현한다.~~ 완료.
4. 아침 / 이야기 / 감정·접촉 / 여행·예약 / 비대화·ending playable 모듈을 exact source ref로 구현한다.
5. game bridge, 저장 재개, 경제 원장, 시간·장소·인물·전화 presentation을 실제 루프에 연결한다.
6. source/state/bridge/Story-Free/저장/경제 회귀와 100×30일 시뮬레이션을 통과한다.
7. Friendly/Neutral/Distant/Mixed 및 park/phone/deferred, Busan/Seoul/solo를 데스크톱과 389×844에서 SKIP 없이 검증한다.
8. 원문·런타임 텍스트·콘솔·이미지·오디오·오버플로·DAY22 전환이 모두 PASS일 때만 DAY21 COMPLETE로 승격한다.

## 다음 시작점

exact source ref만 사용하는 아침 SCENE01~04와 이야기 SCENE05~12 playable부터 구현한다. `STAYED_MORNING`/`MESSAGE_MORNING`/`SOLO_MORNING`, `PARK`/`PHONE`/`DEFERRED` presentation을 분리하고 전화에서 시각 접촉을 만들지 않는다.

## 상태 계약 구현 기록

- schema: `day21-notion-v4/1`.
- 검증된 `day20V4.complete`와 `day20V4Day21HookPending`만 신규 진입으로 인정하며 기존 `day21Runtime*` 저장은 legacy로 유지한다.
- DAY20 숙박·별도 침구·컵·접촉·저녁 결과와 DAY19 여행 후보·미확정 예약·예산·연락을 entry input에 복제해 이후 원본 객체 변조와 분리했다.
- 연락 불가 상태의 C3은 `다른 때 들어도 될까?`만 허용하고, 대화 연기 C4~8은 `heardHaeunStory=false`와 예약·접촉 없음으로 종료한다.
- 공원 C10의 포옹/손잡기는 `haeunContactResponse`, 공유 숙박 의사는 `haeunLodgingResponse`, 부산 확정은 날짜·이동·예산·숙박·상호 동의를 모두 가진 `travelConfirmation` 뒤에만 사실화한다.
- 선택·resolution 전체를 처음부터 replay해 변조 저장을 거부한다. 상태/source 집중 검증 9/9 PASS.
