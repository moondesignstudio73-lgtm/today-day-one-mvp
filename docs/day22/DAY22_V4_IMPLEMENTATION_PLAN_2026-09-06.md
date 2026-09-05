# DAY22 V4 구현 계획 — 2026-09-06

## 판정과 원문

- 현재 상태: PARTIAL / SOURCE + STATE LOCKED.
- 최종 원문: Notion `DAY 22 — 떠날 수 있는 사람 | SCENARIO V4`.
- page id: `3c9c31f0-29a6-81f3-ba7f-eb07c6979d27`.
- last edited snapshot: `2026-08-27T20:30:21.198Z`.
- 플레이어 공개 본문: `docs/scenarios/DAY22_SCENARIO_V4_NOTION.md`, UTF-8 19,020자, 24 Scene, 대면 선택 1~17, 미여행 대체 선택 3~8.
- SHA-256: `9b63b8194229ef8ed290a51b45949cf5138175815a3d2f6e7d2a82b58f539383`.
- 내부 편집 메모는 source snapshot과 player renderer에서 제외한다.

## 한 문장 정의

실제로 확정한 부산 여행, 서울 당일, 떠나지 않은 하루의 결과를 구분하고, 계획과 다른 피로·자리·사진·속도를 실패로 만들지 않으면서 함께 또는 혼자 선택한 하루를 끝까지 살아 보는 날.

## 기존 구현 감사

현재 `day22-campaign-runtime.mjs`는 `아무것도 증명하지 않는 날`이라는 회복일 5장면·3선택 요약이다. 최종 V4의 제목, 여행 결과별 장소, 24개 장면, 17개 대면 선택, 미여행 생활 대체와 일치하지 않는다. 일반 대화창에도 회복 설정·웰니스 앱·자동 공유 등 최종 원문에 없는 설계 요약이 출력된다. 기존 저장은 legacy로 보존하되 신규 DAY22 진입은 별도 V4 schema와 bridge로 교체한다.

## DAY22 INPUT

- 검증된 `day21V4.complete === true`와 `day21V4Day22HookPending === true`.
- DAY21 `travelResult`: `BUSAN_CONFIRMED | SEOUL_DAY | REST_SEPARATELY | SOLO` 및 실제 `travelDiscussion`.
- 부산의 `travelChecks`, `bookingConfirmed`, `travelPaymentMade`, 검증 견적 id와 본인 부담액.
- DAY21 `lodgingAgreement`와 실제 공유/별도 공간 합의. DAY20의 숙박은 오늘 숙소 합의를 대신하지 않는다.
- DAY21 `todayContact`, `contactIntent`, 관계 활성·연락 가능 여부·현재 tone.
- DAY20 `firstHug`, `heldHands`, `stayedOver`, `sleepingPlan`의 실제값. 과거 접촉은 오늘 접촉의 자동 동의가 아니다.
- DAY19의 실제 여행 후보·예산·일정 축소·사진 교류 연락처와 DAY21까지 이어진 연락 가능 상태.
- DAY13 아라와 실제 만남·사진 교류 약속·현재 연락처가 모두 존재하는지.
- 실제 사진 촬영 여부, 하은의 촬영·보관 동의, 삭제 여부를 오늘 선택에서 새로 기록한다.

## DAY22 OUTPUT

- 하루 경로: `BUSAN_TRIP | SEOUL_DAY | NO_TRAVEL`.
- 실제 이동·식사·휴식·카페·풍경·숙소·귀가 장면의 방문 여부.
- 짐 줄이기, 이동 중 휴식, 첫 계획 변경, 첫 식사, 서로 다른 속도의 선택.
- 따로 보기의 장소·재회 시간·연락 가능 여부와 실제 재회 여부.
- 사진의 존재, 대상, 하은 포함 동의, 보관 동의, 삭제 여부, 실제 수신자.
- 카페 방문·창가 상황·기다림과 아쉬움의 실제 결과.
- 숙소 공간·쉬는 순서·사생활 경계·밤 식사와 실제 지출.
- 현재 접촉 요청과 하은의 별도 응답. 키스·성적 동의는 생성하지 않는다.
- 서울 C17 귀가 말 또는 미여행 C3~8 생활 선택.
- DAY23에는 실제 숙소 밤, 서울 귀가, 미여행 하루 중 하나만 전달한다.

## Scene Graph

```text
DAY21 완료 이력
  ├─ BUSAN_CONFIRMED + booking/payment/checks 유효
  │    → SCENE01~05 / C1~3 출발·이동·도착·계획 변경
  │    → SCENE06~14 / C4~10 식사·속도·사진·카페·기대 조정
  │    → SCENE15~21 / C11~16 숙소·사생활·접촉·밤
  │    → SCENE24
  ├─ SEOUL_DAY
  │    → SCENE01~14의 서울 대체 / C1~10
  │    → 숙소 장면 없이 귀가 준비
  │    → SCENE22 / C17
  │    → SCENE24
  └─ REST_SEPARATELY | SOLO | 미확정/손상 여행
       → SCENE01~02 생활 대체
       → SCENE23 / 대체 C3~8
       → SCENE24
```

## 핵심 불변식

- 부산 도착·표·밀면·해운대·마린뷰 카페·숙소는 DAY21의 실제 부산 확정, 모든 travel checks, 예약과 결제가 함께 유효할 때만 열린다.
- 서울 당일에는 부산 표·바다·밀면·숙소·낯선 숙소 아침을 만들지 않는다.
- 미여행 경로에는 역에서 기다리는 하은, 취소할 표, 동행 대사, 부산 음식·사진·숙박을 만들지 않는다.
- 잠깐 따로 보기는 재회 장소·시간과 연락 가능 상태를 먼저 기록한다. 늦으면 실제 연락하며 자동 재회를 만들지 않는다.
- 아라 사진 전송은 DAY13의 실제 교류 약속과 현재 연락처가 모두 있을 때만 선택지로 노출한다. 존재하지 않는 친구·답장·호감은 만들지 않는다.
- 하은이 포함된 사진은 촬영 동의와 보관 동의를 분리한다. 삭제한 사진은 SCENE13, C17, DAY23 회상에 재사용하지 않는다.
- SCENE18의 포옹·손잡기는 과거 접촉과 현재 하은의 접근/응답을 구분한다. 숙박·공유방은 접촉이나 성적 동의가 아니다.
- 카페 고유 농담은 실제 카페 방문과 해당 자리 상황이 있을 때만 회수한다.
- 실제 먹은 음식과 실제 지출만 경제 원장에 남긴다. 이미 DAY21에서 결제한 교통·숙박을 중복 차감하지 않는다.
- Renderer에는 dialogue, monologue, 필요한 playerNarration만 전달한다. stage/design/continuity/flag/metadata와 내부 편집 메모는 일반 대화창에 출력하지 않는다.
- Story Choice 진행 중 legacy DAY22 Free Action을 열지 않는다.

## 구현 단계와 완료 관문

1. ~~Notion 최종 원문 플레이어 본문 잠금과 내부 메모 분리.~~ 완료.
2. ~~source registry에서 24 Scene, 대면 C1~17, 미여행 C3~8의 정확 라벨·반응·variant를 생성한다.~~ 완료.
3. ~~DAY19~21 실제 이력을 동결하는 replay-locked 상태 계약과 legacy 진입 분리를 구현한다.~~ 완료.
4. ~~출발/이동, 식사/속도, 사진/카페, 숙소/접촉/밤, 서울 귀가, 미여행/ending playable 모듈을 exact source ref로 구현한다.~~ 완료.
5. ~~game bridge, 저장 재개, 현재 접촉 응답, 사진 동의, 경제 중복 차감 방지, 시간·장소·인물 presentation을 실제 루프에 연결한다.~~ 완료.
6. source/state/bridge/Story-Free/저장/경제 회귀와 100×30일 시뮬레이션을 통과한다.
7. Friendly/Neutral/Distant/Mixed 및 Busan/Seoul/no-travel 의미 경로를 데스크톱과 389×844에서 SKIP 없이 검증한다.
8. 원문·런타임 텍스트·콘솔·이미지·오디오·오버플로·DAY23 전환이 모두 PASS일 때만 DAY22 COMPLETE로 승격한다.

## 다음 시작점

Friendly 부산 공유 숙소 데스크톱 경로는 실제 브라우저에서 DAY23 전환까지 SKIP 없이 PASS했다. 첫 실행에서 발견한 `DAY22_BACKGROUND_MISSING:day22-busan-station`은 game/bridge asset manifest 캐시 세대를 `v=24`로 통일해 수정했고 같은 fixture 재실행으로 재발하지 않음을 확인했다. 상세 증거는 `DAY22_V4_BROWSER_QA_2026-09-06.md`에 기록했다.

다음은 부산 별실·서울·연락 가능/불가 미여행 데스크톱 경로를 추가하고, 이어 389×844 Friendly/Neutral/Distant/Mixed 의미 경로를 같은 배포본에서 검증한다. 이 관문 전까지 DAY22는 **PARTIAL**이다.

## Source registry 구현 기록

- `generate-day22-v4-source-registry.mjs`가 잠근 Markdown에서 24개 Scene과 23개 선택 블록을 기계 생성한다.
- 대면 C1~17은 `TRAVEL`, SCENE23의 미여행 C3~8은 `NO_TRAVEL` variant로 분리한다.
- 모든 선택은 원문 라벨 3개를 가져야 하며 Scene 번호와 각 variant의 선택 번호가 연속인지 검사한다.
- source selection validator는 dialogue/message/monologue/stageAction의 exact source line만 허용한다.
- snapshot SHA-256 재계산을 포함한 source 회귀 3/3 PASS.

## 상태 계약 구현 기록

- 신규 `day22-notion-v4/1`은 검증된 DAY21 V4 완료 hook에서만 시작하며, 기존 DAY22 진행 키가 있는 저장은 legacy 경로로 유지한다.
- `BUSAN_TRIP`은 DAY21의 `BUSAN_CONFIRMED`, 날짜·이동·예산·숙박·상호 동의 check, 예약·결제, 검증 견적 id와 양수인 본인 부담액이 모두 있을 때만 연다. 어느 하나라도 손상되면 `NO_TRAVEL`로 닫는다.
- `SEOUL_DAY`는 숙박·부산 결제 기록을 만들지 않고 C17 귀가 선택까지 진행한다. `NO_TRAVEL`은 대체 C3~8만 사용하며 부산 장소·음식·표·숙소·하은 대기를 만들지 않는다.
- 사진 촬영, 전송 대상, 공동 사진 보관·삭제와 오늘의 포옹·손잡기 응답을 각각 독립 사실로 기록한다. 삭제 또는 거절 결과는 replay 뒤에도 되살아나지 않는다.
- 잠깐 따로 보기에는 찾기 쉬운 장소·시간·연락 가능 여부와 실제 재회를 기록한다. 아라 전송 선택은 DAY13 실제 만남과 사진 교류가 모두 있을 때만 노출한다.
- 17개 여행 선택, 6개 미여행 선택, 사진·접촉 resolution을 처음부터 재생해 중간 저장 변조를 거부한다. DAY22 완료 cue만 DAY21 hook을 소비하고 DAY23 hook을 한 번 연다.
- DAY21 인접 회귀를 포함한 source/state 집중 검사 19/19 PASS.

## Opening · no-travel playable 구현 기록

- `day22-v4-playable-opening.mjs`가 부산·서울의 SCENE01~05/C1~3을 원문 줄 참조로 재생한다. 부산만 표·열차·부산역을 사용하고 서울은 정한 만남 장소와 돌아올 수 있는 시내 이동만 사용한다.
- 짐 줄이기는 만남 장소에서 물건을 버리지 않고 안전하게 다시 정리하며, 직접 들기는 힘들 때 말하겠다는 합의를 남기고, 동선 축소는 하은에게 짐을 전가하지 않는다.
- C2 이후 같은 풍경을 보거나 각자 음악을 듣거나 눈을 쉬는 반응을 구분하고, C3 이후 SCENE06 경계로만 넘긴다.
- `day22-v4-playable-no-travel.mjs`가 SCENE23/C3~8을 독립 재생한다. 연락 불가이면 C6과 하은 대사를 건너뛰고, 연락 가능이면 실제 C6 선택 뒤에만 하은 반응을 연다. 아라 선택은 실제 DAY13 사진 교류 입력에만 노출한다.
- 미여행 본문은 부산 표·음식·숙소·역에서 기다리는 하은을 만들지 않으며 SCENE24 공통 결말 경계까지만 전달한다.
- source/state/opening/no-travel 집중 검사 14/14 PASS.

## Meal · pace · landscape photo playable 구현 기록

- `day22-v4-playable-meal-photo.mjs`가 SCENE06~10/C4~6을 exact source ref로 재생한다. 부산은 실제 부산 식당·해운대 위치를, 서울은 가까운 식당·실제 산책로만 사용한다.
- C4는 먹는 중인 식탁만 촬영하거나 휴대전화를 넣거나 실제 맛을 묻는 결과를 각각 분리한다. 하은 얼굴은 동의 없이 식사 사진에 추가하지 않는다.
- C5의 잠깐 따로 보기 선택은 찾기 쉬운 재회 장소·시간·연락 가능 상태를 기록하되 곧바로 재회로 만들지 않는다. C6을 실제 완료한 뒤 SCENE10에 들어갈 때만 재회를 표시한다.
- 함께 쉰 경로는 SCENE08에 하은을 유지하고, 따로 본 경로는 실제 풍경 구간에서 하은을 제거한다. 서울은 부산 바다를 본 것처럼 말하지 않는다.
- C6은 앨범·하은·실제 사진 교류 연락처를 구분하며, DAY13 교류가 없으면 아라/교류 상대 선택을 playable 진입 전에 제거한다.
- DAY22 source/state/playable 집중 검사 17/17 PASS.

## Cafe · shared photo · expectations playable 구현 기록

- `day22-v4-playable-cafe.mjs`가 SCENE11~14/C7~10을 exact source ref로 재생한다. 부산은 실제 마린뷰 카페의 찬 창가를, 서울은 선택한 카페의 실제 풍경 크기·혼잡 차이만 말한다.
- C7은 있는 자리, 합의한 제한 시간 대기, 아쉬움 표현을 구분하고 오래 기다렸다는 이유로 하은에게 만족을 요구하지 않는다.
- SCENE12 촬영 동의와 C8 보관 동의를 분리했다. 남기기·한 번 다시 찍기는 `photoConsentCue` 뒤의 현재 응답으로만 보관되며, 거절 또는 사진 중단은 삭제 상태로 고정된다.
- 삭제된 공동 사진은 SCENE13에서 다시 표시하지 않는다. 다른 실제 풍경 사진만 볼 수 있으며 저장 replay가 삭제 결과를 검증한다.
- SCENE13의 부산 회상은 실제 부산에서만 바다를 말한다. 서울은 source-directed 산책 문장으로 제한해 존재하지 않은 부산 경험을 만들지 않는다.
- source/state/opening/meal/cafe/no-travel 집중 검사 20/20 PASS.

## Lodging · privacy · current contact · night meal playable 구현 기록

- `day22-v4-playable-evening.mjs`가 SCENE15~21/C11~16을 exact source ref로 재생한다. 부산은 실제 예약한 숙소만, 서울은 귀가 전 휴식과 각자 공간만 사용하며 숙소 화면과 SCENE21을 열지 않는다.
- 상태 입력에 `sharedLodgingSpace`를 추가해 DAY21의 실제 `SHARED_ROOM_AGREED`가 있는 부산에서만 공유 공간을 연다. 부산 별실과 서울에서는 보이지 않는 하은의 편한 차림·얼굴 칭찬 선택을 제거한다.
- C13 이후 C14 포옹·손잡기는 공유 공간에서만 선택할 수 있고 `contactConsentCue`의 현재 응답 뒤에만 발생한다. 거절은 `todayContact=NONE`으로 replay되며 키스나 성적 동의를 이어 붙이지 않는다.
- 별실은 침대 동석·손 내밀기·접촉을 만들지 않고 자기 방 인사로 끝낸다. 서울은 숙소 도착·숙박 야식을 말하지 않고 C16 뒤 SCENE22로 이동한다.
- 저녁 식사는 실제 배고픔과 선택한 양만 기록하며 DAY21에 결제한 교통·숙박을 다시 차감하지 않는다.
- DAY22 source/state/playable 집중 검사 24/24 PASS.

## Seoul return · common ending playable 구현 기록

- `day22-v4-playable-ending.mjs`가 SCENE22/C17과 SCENE24를 경로별로 재생한다. 서울만 C17을 거쳐 각자 집으로 돌아가며 부산은 C17 없이 실제 예약 공간의 밤에서 끝난다.
- 사진 고르기는 공동 사진이 없거나 삭제됐을 때 풍경 또는 실제 기억만 사용한다. 삭제 사진을 복원하거나 모든 사진 검토를 숙제로 만들지 않는다.
- 미여행 결말은 익숙한 방과 혼자 보낸 실제 속도만 회수하고 부산·서울 밤, 함께 여행한 하은, 같이 온 사람 문장을 출력하지 않는다.
- 부산에서만 다음 날 귀환·빨래를 말하며 서울에는 낯선 숙소 아침이 없다.
- SCENE24의 fade-out 뒤에만 `chapterCompletionCue(day=22)`를 내보낸다. 미완료 phase는 경계만 반환하고 DAY23 hook을 열 수 없다.
- 24 Scene, 여행 C1~17, 미여행 C3~8의 source/state/playable 집중 검사 28/28 PASS. 실제 게임 bridge와 브라우저 QA 전이므로 DAY22는 계속 PARTIAL이다.

## Game bridge · save · presentation 구현 기록

- `day22-v4-game-bridge.mjs`가 여섯 playable 모듈의 내부 경계를 제거하고 scene direction을 실제 transition·배경·인물·시계로 변환한다. 부산역·해운대·밀면집·마린뷰 카페의 기존 지도 자산을 manifest에 명시적으로 등록했다.
- `game.js`가 DAY22 V4 신규 진입/재개, 선택, 사진·접촉 resolution, SCENE24 completion, 시계와 legacy fallback을 실제 Story 루프에 연결한다.
- `day22-v4-runtime-resolution.mjs`가 사진 보관과 현재 접촉 응답을 별도 처리한다. 공유 부산 숙소가 아닌 상태에서는 물리 접촉 응답이 수락될 수 없다.
- 선택·resolution 실패는 chapter snapshot으로 원자 복원한다. SaveManager 왕복 뒤 중간 선택, 다음 segment, resume presentation이 동일하다.
- DAY21에서 결제한 여행 purchase를 완료 이력에 읽기 전용으로 남기며 DAY22 bridge는 돈·경제 원장을 변경하지 않는다.
- V4 완료 이력은 한 번만 기록하고 DAY23 hook을 한 번 연다. V4 Story 완료 뒤 legacy DAY22 Free Action은 열리지 않는다.
- DAY22 source/state/playable/bridge 집중 검사 36/36 PASS. 실제 브라우저 QA 전이므로 DAY22는 계속 PARTIAL이다.
