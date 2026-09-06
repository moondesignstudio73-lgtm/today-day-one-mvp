# DAY29 V4 구현 계획 — 2026-09-07

## 판정과 원문

- 현재 상태: **PARTIAL / SOURCE LOCKED**.
- 최종 원문: Notion `DAY 29 — 내일도 내가 고를게 | SCENARIO V4`.
- page id: `3c9c31f0-29a6-8111-b76b-edb7bbadf790`.
- last edited snapshot: `2026-08-27T21:11:30.663Z`.
- 플레이어 공개 snapshot: `docs/scenarios/DAY29_SCENARIO_V4_NOTION.md`, 24 Scene, 23 choice block, SHA-256 `7346cee0f4f0ae27e22c174fdd9db3a07221117e4641e238d41cac61dc3ae186`.
- 내부 편집 메모와 대체 V3는 snapshot과 renderer에서 제외한다.

## 한 문장 정의

지난 물건을 정리하며 과거의 정답을 찾는 대신, 오늘 좋아하는 것과 앞으로 지킬 약속을 실제 이력과 현재 상대의 답 안에서 다시 고르는 날.

## 기존 구현 감사

현재 `src/day29-campaign-runtime.mjs`는 결혼 전날 재확인을 다루는 5장면·3선택 legacy 구현이다. 최종 V4의 방 정리, 실제 소유물, 업무·지출, 하은/새 상대/혼자 저녁, 미래 재논의, 접촉·숙박 분리, 남은 거짓말과 DAY30 한 가지 약속을 구현하지 않는다. 검증된 DAY28 V4 완료 저장만 신규 schema로 진입시키고 legacy DAY29 저장은 보존한다.

## DAY29 INPUT — DAY26~28 실제 이력 감사

- DAY28 V4의 실제 route, meeting target/method, relationship state, 현재 접촉, 집 초대 응답, 다음 만남, 새 관계 응답, 공개 범위를 replay-lock 한다.
- DAY26 친구 식사·새 만남·업무·지출과 DAY27 거짓말·거리·연락 결과를 실제 기록이 있을 때만 사용한다.
- 구매하지 않은 옷, 받지 않은 카드, 찍지 않은 사진, 사지 않은 꽃, 맡기지 않은 물건, 합의하지 않은 약속을 만들지 않는다.
- `NEED_TIME`, `GOODBYE`, 연락 중지, 관계 종료는 저녁 방문·연애·키스·숙박으로 승격하지 않는다.
- DAY28의 키스와 오늘 접촉은 별도다. 집 방문과 숙박도 각각 현재의 독립 동의를 기다린다.
- 미확정 업무 일정·수입·친구 편집 완료를 확정 사실로 바꾸지 않는다.

## Scene Graph

```text
DAY28 V4 완료 → SCENE01~09 / C1~9 공통 생활·저녁 범위
  ├─ 하은과 실제 약속 및 관계 지속 → SCENE10~17 / C10~17
  │    ├─ 미래 대화 합의 유효 → SCENE13 / C13
  │    ├─ 상호 가까움·신뢰·진실 유효 → SCENE14~16 / C14~16
  │    └─ 실제 집 초대·현재 숙박 동의 → SCENE17 / C17
  ├─ 하은 관계 종료 + 실제 새 관계/알아가기 → SCENE18 / C18
  └─ 혼자 저녁 → SCENE19 / C19
실제 미정정 거짓말이 남음 → SCENE20 / C20
→ SCENE21~23 / C21~23 → SCENE24 → DAY30 handoff
```

## 핵심 불변식

- 물건은 정답 엔딩 점수가 아니며 소유·수령·촬영 이력에만 존재한다.
- 상대의 오늘 답 없이 만남, 접촉, 키스, 집 방문, 숙박, 다음 약속, 연애 이름을 만들지 않는다.
- 달라진 미래 의사는 다정한 장면으로 덮지 않고 상대의 생각할 시간을 보존한다.
- 숨긴 사실은 저절로 발각·용서되지 않으며 회피도 그대로 DAY30에 넘긴다.
- 상호 배타 경로 설명과 편집 메모를 일반 대화창에 출력하지 않는다.
- 손 포함 CG는 `docs/STORY_V4_IMAGE_STYLE_RULES.md`와 배포 커밋 일치 관문을 통과해야 한다.

## 구현 단계와 완료 관문

1. ~~Notion 최종 원문을 플레이어 공개 snapshot으로 잠그고 24 Scene·23 choice registry와 SHA 검증을 고정한다.~~ 완료.
2. ~~DAY26~28 실제 이력을 동결하는 `day29-notion-v4/1` 상태 계약과 legacy 진입 분리를 구현한다.~~ 완료.
3. ~~SCENE01~09 공통 생활·실제 소유물·업무·지출·저녁 범위 C1~9를 구현한다.~~ 완료.
4. ~~SCENE10~17 하은 집/바깥 분기, 미래 대화, 접촉·키스·귀가·숙박 C10~17을 구현한다.~~ 완료.
5. ~~SCENE18 새 관계, SCENE19 혼자, SCENE20 미정정 거짓말 C18~20을 구현한다.~~ 완료.
6. ~~SCENE21~24 내일의 한 가지·준비·인사·DAY30 handoff C21~23을 구현한다.~~ 완료.
7. ~~game bridge, 저장 재개, 현재 NPC 응답, Story/Free 배타성, 화면 presentation을 연결한다.~~ 완료.
8. ~~source/state/playable/bridge/저장/전체 30일 회귀를 통과한다.~~ 완료.
9. Friendly/Neutral/Distant/Mixed를 실제 브라우저에서 AUTO OFF·SKIP 없이 DAY30까지 검증한다.
10. 원문·런타임 텍스트·콘솔·자산·오버플로·DAY30 전환이 모두 PASS일 때만 DAY29 COMPLETE로 승격한다.

## 다음 시작점

실제 브라우저에서 Friendly/Neutral/Distant/Mixed를 AUTO OFF·SKIP 없이 DAY30까지 검증한다. 우선 Friendly 데스크톱 완주와 대표 중간 저장 재개부터 시작한다.

## 상태 계약 완료 기록

`day29-notion-v4/1`은 검증·완료된 DAY26~28 V4와 DAY28→29 hook만 신규 진입으로 허용한다. DAY28의 관계·연락·접촉·집 초대·다음 만남·새 관계·공개·거리 handoff를 그대로 봉인하며, 과거 DAY29 결혼 전날 3선택 진행 저장은 legacy로 유지한다. 옷·카드·사진·꽃·업무 메모는 실제 플래그에서 보수적으로 파생하고, 없는 사진은 C3 닫기만, 없는 구매 옷은 C2의 구매 회상 선택을 노출하지 않는다.

하은/새 상대 저녁은 C9 뒤 별도 현재 응답을 기다리고, 미래 대화·키스/포옹·숙박·새 상대 다음 답·거짓말 정정도 각각 독립 resolution으로 기록한다. Friendly 집 저녁에서 키스 수락·숙박 거절, 완전 Solo, 실제 아라 새 관계의 `NEED_TIME`, 입력 변조와 legacy 분리를 replay 검증했다. 상태 계약 집중 검증을 통과했다.

## SCENE01~09 playable 완료 기록

SCENE01 의자 정리부터 SCENE09 저녁 범위까지 원문 순서와 C1~9를 whole-line source ref로 구현했다. 실제 구매 옷이 없으면 구매 회상을 숨기고, 실제 사진이 없으면 C3 닫기만 제공하며, 카드를 받지 않았으면 SCENE04/C4를 건너뛰고 없는 봉투를 만들지 않는다. 꽃·회사 메모도 실제 플래그가 없으면 창가와 자기 계획으로 대체한다. 지훈을 모르면 SCENE08/C8을 건너뛰며, 알고 있어도 그의 편집 일정을 주인공 일정으로 확정하지 않는다.

C9의 식사·짧은 만남은 봉인된 상대에게 현재 응답 cue를 내고, 수락된 하은만 SCENE10, 수락된 실제 새 상대만 SCENE18, 혼자 선택·거절·상대 없음은 SCENE19로 교차한다. Friendly C1~9, 무소유 Solo, 실제 아라, 상대 이름 변조와 모든 플레이어 공개 source ref를 집중 검증했다. DAY29은 **PARTIAL**, 다음은 **SCENE10~17/C10~17 하은 저녁 playable**이다.

## SCENE10~17 playable 완료 기록

실제 하은 저녁 수락 뒤 SCENE10~17/C10~17을 원문 순서와 whole-line source ref로 구현했다. DAY28에서 하은의 집 초대가 수락된 이력이 있을 때만 집 내부로 들어가며, 바깥 만남에서는 옷 갈아입기·방 안·냉장고·숙박을 노출하지 않는다. C13은 선행 미래 합의와 일치하는 답 또는 달라진 마음만 고를 수 있고, 달라진 마음에는 하은의 `NEED_TIME`을 현재 응답으로 보존해 SCENE14 이후의 다정한 밤을 중단한다.

SCENE16은 관계가 실제 `CONTINUE/CONTINUING`이고 거리 두기·미정정 사실이 없을 때만 연다. 키스·포옹은 C16 선택과 하은의 별도 현재 동의를 분리했으며, C17 숙박도 하은의 집과 선행 `TOGETHER_IF_MUTUAL` 계획을 모두 만족한 경우에만 수락될 수 있다. 집 수락·키스 수락·숙박 수락, 바깥 만남, 대체 C10~17, 미래 변경 조기 종료, `KNOW_AGAIN` 친밀감 우회를 집중 검증했다. 자동 source/state 집중 검증은 PASS, 실제 브라우저는 game bridge 전이라 **NOT RUN**이다. DAY29은 **PARTIAL**, 다음은 **SCENE18~20/C18~20 새 관계·혼자·미정정 거짓말 playable**이다.

## SCENE18~20 playable 완료 기록

SCENE18은 DAY28 handoff에 봉인된 유리·서진·아라 중 실제 새 상대 한 사람만 렌더하고 C18의 다음 만남·느린 속도·오늘의 인사를 각각 상대의 별도 현재 응답과 연결했다. 연락처만 있거나 사업상 관계인 인물은 등장하지 않는다. SCENE19는 사람 응답 없이 자기 저녁을 완결하며, 지훈을 모르면 연락 선택을 숨기고 알고 있어도 오늘 바쁘면 메시지만 남겨 지훈 대사를 만들지 않는다.

SCENE20은 실제 미정정 거짓말이 있을 때만 열고 실제 수신자만 cue 대상으로 삼는다. 정정 선택은 먼저 대화 가능 여부를 묻고 `LISTEN/NEED_TIME/END`를 기다리며, `NEED_TIME`을 용서나 다음 약속으로 바꾸지 않는다. 새 약속 중지와 계속 회피는 정정 완료로 기록하지 않는다. 실제 아라, 완전 Solo, 바쁜 지훈, 실제 서진 거짓말 수신자 경로의 whole-line source와 state replay 집중 검증을 통과했다. 실제 브라우저는 game bridge 전이라 **NOT RUN**이다. DAY29은 **PARTIAL**, 다음은 **SCENE21~24/C21~23 공통 마무리·DAY30 handoff playable**이다.

## SCENE21~24 playable 완료 기록

SCENE21은 확정 약속의 시간·장소와 아직 답을 기다리는 빈칸을 구분하고 C21의 한 가지 우선순위만 DAY30 handoff에 남긴다. 하은과 실제 함께 머무는 경우에만 그녀의 내일 우선순위 대사를 출력하며, 다른 상대의 일정과 혼자 경로는 각각 별도 서술로 유지한다. SCENE22는 실제 가진 옷과 실제 존재하는 사진·카드·꽃만 준비하며, 없는 물건은 빈 창가와 다른 물건으로 남긴다.

SCENE23은 하은의 현재 미래 답이 `CONTINUE`이고 실제 다음 약속 또는 함께 머무름이 있을 때만, 새 상대는 C18 다음 만남 제안이 현재 `ACCEPTED`일 때만 연다. 혼자·거절·`NEED_TIME/END`는 사람에게 보내는 C23을 건너뛰고 알람을 확인한다. SCENE24 원문 뒤에만 completion cue를 내며 `tomorrowRecipient`를 DAY30 handoff에 봉인한다. 하은 숙박·Solo·아라 다음 약속·하은 `NEED_TIME`의 source/state/완료 경계를 집중 검증했다. 실제 브라우저는 game bridge 전이라 **NOT RUN**이다. DAY29은 **PARTIAL**, 다음은 **game bridge·저장·presentation·Story/Free 연결**이다.

## game bridge 및 저장 연결 완료 기록

네 playable 구간을 현재 phase에 따라 단일 Story 루프로 결합하고 검증된 DAY28 V4 완료 저장에서만 신규 DAY29 V4를 시작한다. 저녁 만남, 미래 재논의, 접촉, 숙박, 새 상대 답, 거짓말 정정의 현재 응답을 각각 runtime resolution으로 처리하며 실패 시 chapter/history/pending을 원자 복원한다. SaveManager 중간 저장 왕복은 동일 segment와 시간·장소·인물 presentation을 재현한다.

completion은 단일 `day29-notion-v4` 이력과 DAY30 hook만 기록하고 DAY28 hook을 닫는다. V4 진행·완료에는 legacy DAY29 선택 기록이나 Free Action이 끼어들지 않으며, 하은 미래 응답 직후 전이 누락과 함께 머물지 않은 SCENE21의 하은 오표시도 교정했다. Friendly/Solo/실제 아라 경로, 원자적 실패, 저장 재개, 완료 중복 방지, 실제 `game.js` wiring 집중 검사 5/5와 전체 Node·100회×30일 회귀를 통과했다. 캐시는 `game.js?v=290`이다. 실제 브라우저는 아직 **NOT RUN**이므로 DAY29은 **PARTIAL**이며, 다음은 **Friendly 데스크톱 비-SKIP 완주·대표 중간 저장 재개**다.
