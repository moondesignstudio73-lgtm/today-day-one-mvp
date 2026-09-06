# 원본 전체 구현 재개 계획 — 2026-09-04

## 판정 정정

DAY18의 현재 집 안전 점검은 Notion 「말하지 않은 저녁」과 다른 사건이다. DAY19~30의 4구간·3선택 확대기는 원본 전체 구현이 아니다. 과거 COMPLETE/PASS 주장을 철회한다. 기존 테스트 통과와 원본 충실도는 별도로 관리한다. DAY15~17 역시 원본 전체 대사·연출을 재감사하며, 완료 경계는 아직 확정하지 않는다.

현재 단계: DAY18 원본 잠금, 상태 계약, 경로별 대사 및 실제 게임 연결 완료. 선택·저장·전환 테스트 진행. 원본 전체 대사/행동/연출의 대응 감사와 비-SKIP 4성향 완주는 미완료이며 DAY18 COMPLETE로 판정하지 않는다. 상세 증거는 `DAY18_V4_IMPLEMENTATION_QA.md`에 기록한다.

## 원본

- DAY15: https://app.notion.com/p/3c9c31f029a68138ab56ed8ee668526d
- DAY16: https://app.notion.com/p/3c9c31f029a681a9a067d92edc10b353
- DAY17: https://app.notion.com/p/3c9c31f029a681718bedcde4e91dbac3
- DAY18: `scenarios/DAY18_SCENARIO_V4_NOTION.md` (Notion 원문 전체, 편집 메모 포함; 런타임으로 직접 렌더링 금지)

## 진행 순서

1. 원본과 현재 런타임의 장면·선택·이력 차이를 근거와 함께 기록한다.
2. DAY18 입력/출력 및 배타적인 장면 그래프를 구현하고 반례 테스트를 먼저 만든다.
3. 원본 각 장면을 대사, 독백, 플레이어 상황, 연출, 조건, 편집 메모로 명시적으로 분류한다. 알 수 없는 문장은 자동 narration으로 변환하지 않는다.
4. 원본 대사와 분기별 반응을 연결한다. 기존 home18 선택 ID를 저녁 선택으로 재사용하지 않는다.
5. 게임 엔진의 이동·메시지·물건·시간·배경·NPC 표현과 연결한다. 연출을 숨겼다는 이유로 구현 완료로 보지 않는다.
6. 기존 진행 저장은 legacy, 새 V4는 별도 스키마로 유지한다. 부분 손상된 V4 저장은 legacy로 재해석하거나 초기화하지 않는다.
7. 원본 대조, Friendly/Neutral/Distant/Mixed, 무연락, 미대면, 거짓말/정정, 중간 저장 및 재개, Story/Free 배타성, 브라우저 UI·에셋·콘솔을 검증한다.
8. DAY18의 모든 게이트가 통과한 뒤 DAY19를 같은 방식으로 교체한다. DAY30 이후 전체 4경로를 NEW GAME부터 재검사한다.
9. 검증된 변경만 커밋·푸시한다. 이번 재개 요청에는 배포를 포함하지 않는다.

## DAY18 감정 목적

같은 저녁을 먹는 뜻이 서로 다를 수 있음을 알고, 자신이 오늘의 만남에 붙인 뜻을 실제 상대에게 말한다.

## DAY18 INPUT

- DAY17 V4 완료와 DAY18 후속 훅. legacy 안전 점검 플래그는 근거로 쓰지 않는다.
- DAY16 유리 실제 대면, 연락 교환, 초대 상태.
- DAY17 내일 계획 `YURI_MEET / HAEUN / SOLO / YURI_DECLINED / YURI_UNSET`.
- 하은의 수락과 실제 약속 시간·장소. 제안만으로 약속 확정 금지.
- 하은에게 유리 만남을 실제 알렸는지, 유리에게 현재 연인을 실제 말했는지.
- 현재 관계 및 연락 휴식, 실제 다른 사람에 대한 관심. 관계 수치만으로 경험을 발명하지 않는다.

## DAY18 OUTPUT / HISTORY

- 아침 유지·취소 요청·혼자 선택과 실제 저녁 상대 (단일값).
- 식사 장소, 메뉴 태도, 만난 이유, 들은 이야기, 관계 설명, 다시 만남 요청과 유리의 유보, 실제 결제 방식.
- 수신자별 실제 발화 기록, 진실 여부, 정정 대상. 거짓말을 NPC의 지식으로 즉시 공유하지 않는다.
- 하은과 식사/산책/옆자리 동의 여부. 혼자나 유리 식사를 하은과의 식사로 기록하지 않는다.
- 밤 통화/연기/종료, 계속 만날 의사와 미해결 갈등, 다음 연락 약속.
- 가까운 하루/부산/현재 생활이라는 DAY19 후보. 예약·지출·여행 성사·집 초대는 생성하지 않는다.

## DAY18 Scene Graph

S01 약속 확인 → S02 실제 연락 → S03 장소 입장 → S04 메뉴

- YURI: S05 목적 → S06 식던 음식 → S07 쉬운 사과 → S08 그녀의 현재 → S09 현재 관계 (+필요할 때 정정/거짓말) → S10 다음의 뜻 → S11 결제
- HAEUN: S12 음식·회사 일상 → S13 말하고 싶은 마음 → 편안한 경우만 S14 옆자리/산책/귀가
- SOLO: S15 지훈/하은 메시지 또는 식사 집중 → S16 짧은 산책/바로 귀가/냉장고

합류 S16 귀가 → S17 실제 저녁에 맞는 인사 (+이미 알린 약속을 거짓 취소했다고 할 때 정정 선택)

- S18 관계 대화 / S19 평온한 다음 / S20 혼자 마무리 중 해당 경로만 재생.
- S18 대화종료 후에는 S19를 붙이지 않는다. 필요하면 S20의 후속 행동으로 이동하되 선택12를 중복 처리하지 않는다.

→ S21 여행 사진·후보 → S22 실제 연락만 회수 → S23 실제 발화의 의미 → S24 함께 이야기한 다음 / 연기 / 혼자 중 하나 → 완료.

## 현재 HIGH 항목

- DAY18 저녁 사건의 분기·저장·게임 연결은 구현했으나 원본 행동/연출 전체 대응과 비-SKIP 완주 검증은 남았다.
- DAY19~30 표시 선택과 기존 상태 변경 불일치, 선택별 대화·분기 누락.
- 해결: DAY17 하은 저녁 제안에 수락/거절 대사와 독립된 수락 이력을 추가했다. 이전 저장의 제안을 자동 확정하지 않는다.
- 해결: DAY17 미대면 경로의 편집 조건 문장을 제거하고 실제 독백으로 바꿨다. 인사만 나눈 이력에 함께 앉았다는 회상을 하지 않는다.

## 완료 증거

각 게이트는 PASS / FAIL / NOT RUN으로 기록하고, 명령과 경로별 재생 결과를 남긴다. 장면 수·문자 수·테스트 총개수만으로 충실도 또는 UI 검증을 대체하지 않는다.

## 다음 시작점 — 2026-09-04 20:19

SCENE01~08 및 09~24 누락 감사는 `DAY18_V4_SOURCE_AUDIT_01_08.md`, `DAY18_V4_SOURCE_AUDIT_09_24.md`에 있다. 다음은 SCENE15 빈 그릇 사진 없이 나오는 농담을 실제 사진 이벤트로 연결하고, SCENE14 자리 이동의 실제 연출/대사 순서를 바로잡는다. 전화와 문자의 구분도 남았다. 전체 자동 테스트 430 PASS는 DAY18 충실도 COMPLETE를 뜻하지 않는다.

20:31 후속: SCENE15 빈 그릇 사진을 생성해 기존 CG 이벤트로 연결하고 브라우저 사진→농담 복귀를 확인했다(`DAY18_V4_PHOTO_EVENT.md`). LOG 시간 수정도 확인했다(`DAY18_V4_CYCLE_20260904_2024.md`). 다음은 **SCENE14 자리 이동 연출/순서**, 이후 전화·문자 구분이다. 최신 자동 테스트 433 PASS, DAY18은 PARTIAL이다.

20:38 후속: 옆자리 수락 후 전용 시점으로 전환하고 저장 재개/집 복귀를 실제 확인했다(`DAY18_V4_SEAT_DIRECTION.md`). 다음은 **전화·문자 구분 및 통화 가능 여부 협의**. 가방/어깨/음식 등 세부 물건 연출은 남아 있다. 최신 자동 테스트 434 PASS, DAY18 PARTIAL 유지.

20:46 후속: SCENE18의 통화 가능 요청/응답 후 통화 자막을 구별했다(`DAY18_V4_CALL_PRESENTATION.md`). 실제 문자→통화→일반창 복원 확인, 자동 테스트 436 PASS. 다음은 **통화 불가 시 분기/합의할 시간의 상태 계약**, 이후 물건 연출과 전체 경로 QA다. 불가 분기 추가는 기존 저장의 선택 재생을 바꾸지 않도록 호환 계획부터 작성한다. DAY18 PARTIAL 유지.

21:00 후속: 기존 `/1`을 바꾸지 않는 읽기 전용 후속 연락 계약과 새 완료 이력 저장을 구현했다(`DAY18_V4_FOLLOWUP_CONTRACT.md`). 연락하겠다는 약속과 통화 시간의 상호 합의를 분리한다. 현재 경로에는 합의된 시간이 없으며 DAY19 예약으로 회수하면 안 된다. 다음은 **하은의 통화 불가 응답 및 시간 제안/수락의 버전 호환 분기**. DAY18 PARTIAL 유지.

21:16 후속: 새 `/2` 진입에서 하은 식사 후 `night_thought`의 당일 대화 연기와 다음 연락 시간창 수락/미합의 선택을 구현했다(`DAY18_V4_CALL_DEFERRAL.md`). `/1` 저장은 원래 그래프 유지. 실제 두 응답 및 수락 후 저장 재개, DAY19 진입 확인. 캐시된 하위 모듈 오류를 발견·수정했고 자동 테스트 441 PASS. 다음은 **유리 저녁 후 통화 불가/짧은 보고 경로**, 이후 세부 연출과 전체 QA. DAY18 PARTIAL 유지.

21:25 후속: 새 `/3`의 유리 약속 미고지 경로에 불가 응답→짧은 보고→시간 협의를 추가했다(`DAY18_V4_YURI_CALL_DEFERRAL.md`). 사전 공유 경로는 통화 가능 응답 후 상세 발언을 통화 자막으로 전달한다. `/1`·`/2` 그래프 유지. 실제 불가 경로와 저장 재개 확인, 자동 테스트 443 PASS. 다음은 **새 `/3`의 4성향 전체 실제 플레이 및 누락 연출 정리**, DAY18 PARTIAL 유지.

21:36 후속: Friendly를 DAY18 아침부터 DAY19까지 비-SKIP 완주하고 저녁 저장 재개를 확인했다(`DAY18_V4_FULL_ROUTE_QA.md`). 나눠 먹기에도 얼굴 흉내 농담을 회수하는 오류를 발견하여 menu_wait 전용으로 수정하고 실제 재생 확인했다. 물건 연출 미완료로 전체 Fidelity PASS는 아니다. 다음은 **문서에 정한 Neutral 전체 경로**, 이후 Distant/Mixed다. DAY18 PARTIAL 유지.

21:46 후속: Neutral을 아침부터 진행하며 식당의 유리 스프라이트 미표시 HIGH 오류를 발견했다. DAY18 명시적 인물 전환에 렌더 호출을 추가하고 유리/하은 실제 표시·귀가 후 숨김을 확인했다(`DAY18_V4_CHARACTER_TRANSITION_FIX.md`). 같은 저장에서 Neutral을 DAY19까지 완료, 저녁/밤 재개 확인. 자동 테스트 445 PASS, game191. 다음은 **Distant 전체 경로**, 이후 Mixed 및 남은 행동 연출. DAY18 PARTIAL.

21:54 후속: game191에서 Distant(무연락/혼자)와 Mixed(미고지/현재 관심/통화 연기)를 각각 아침부터 DAY19까지 실제 완주, 밤 저장 재개와 사용자 저장 복원 확인(`DAY18_V4_FULL_ROUTE_QA.md`). 새 코드 오류는 관찰되지 않았다. 네 성향 첫 실행은 모였지만 최종 동일 버전 클린 완주/행동 연출은 아직 미완료다. 다음은 **SCENE21 여행 사진 실제 이벤트**, 이후 전화 종료·물건 행동과 최종 QA. DAY18 PARTIAL 유지.

22:06 후속: SCENE21에 원문과 맞는 빈 창가 테이블/바다 사진을 실제 CG로 연결했다(`DAY18_V4_TRAVEL_PHOTO.md`). 부산 후보만 재열람하며 실제 여행/동행 이력을 만들지 않는다. 실제 표시·방 복귀·부산 선택·저장 재개 확인, 자동 테스트 446 PASS. 다음은 **전화 종료·물건 행동 연출 감사 및 구현**, 이후 동일 최종 버전 4경로/모바일 QA와 DAY15~17 충실도 감사. DAY18 PARTIAL, DAY19~30 원본 구현은 미완료다.

22:08 실행 후속: SCENE18 수락된 통화의 침묵과 명시적 종료를 대사/LOG가 아닌 런타임 상태 cue로 연결했다(`DAY18_V4_CALL_END_CUE.md`). 실제 침묵→응답/종료→독백 및 저장 재개 확인. game193, 자동 테스트 448 PASS. 다음은 **생활 물건 행동(폰 내려놓기·컵 씻기·메모) 연출 계획과 구현**, 이후 남은 화면 확인/손 바꾸기 및 최종 QA. DAY18 PARTIAL 유지. DAY19로 아직 넘어가지 않는다.

22:16 실행 후속: SCENE20 메모 선택을 실제 개인 문서 패널로 연결했다(`DAY18_V4_PRIVATE_NOTE.md`). 직전 실제 주인공 발언만 표시하고 새 메시지 이력을 만들지 않는다. 실제 표시/저장 복구/키보드 닫기 확인, game194/styles99, 자동 테스트 450 PASS. 다음은 **컵 씻기·폰 내려놓기 물건 연출**, 이후 미완료 행동과 동일 최종 버전 4경로/모바일 QA. DAY18 PARTIAL, DAY19~30 미완료.

22:26 실행 후속: SCENE20 더 연락하지 않기 선택에 폰 내려놓기 SFX와 혼자 컵 헹구는 CG를 연결했다(`DAY18_V4_CUP_WASH.md`). 무연락 경로에 갈등을 발명하지 않는 독백 분리. 실제 표시/자동 복귀/저장 재개 확인, game195, 자동 테스트 451 PASS. 다음은 **식사·컵·지갑 등 남은 원문 물건 행동을 감사표와 대조하여 구현**, 이후 동일 최종 버전 4경로/모바일 및 DAY15~17 충실도 감사. DAY18 PARTIAL 유지.

22:33 실행 후속: 미검증 하은 약속 취소 경로를 아침부터 DAY19까지 실제 완주하고 아침 저장 재개를 확인했다(`DAY18_V4_CANCELLATION_QA.md`). 냉장고 정리 후 현관에 다시 들어오는 순서 오류를 발견해 이미 귀가한 두 선택에서 수정했다. game196에서 아침→수정 구간 재검증, 자동 테스트 452 PASS. 다음은 **SCENE11 지갑/계산 또는 SCENE12 식사 행동 연출**, 기존 감사표 미완료 유지. DAY18 PARTIAL.

22:41 실행 후속: 유리 이별 거짓말→재만남 미수락→마음값 결제 거절→하은에게 취소 거짓말 경로를 실제 플레이했다(`DAY18_V4_LIE_PATH_QA.md`). 선택으로 한 말이 개인 메모에서 누락되는 오류와 하지 않은 음식 대화 회고를 수정했다. 기존 저장에서 메모 복구 후 DAY19까지 완료. game197, 자동 테스트 453 PASS. 다음은 **SCENE11 지갑/계산 연출**, 전체 행동·동일 버전 4경로/모바일·DAY15~17 감사는 남아 DAY18 PARTIAL 유지.

22:50 실행 후속: SCENE11 열린 지갑과 pay_debt 거절 뒤 닫힌 지갑 CG를 원문 대사 사이에 연결했다(`DAY18_V4_WALLET_DIRECTION.md`). 실제 순서/19:00/유리 복귀/저장 재개 확인. game198, 자동 테스트 454 PASS. 다음은 **SCENE12 음식 나누기 행동**, 이후 남은 행동과 최종 검증. DAY18 PARTIAL 유지.

22:59 실행 후속: 새 메모 UI에서 SKIP하면 패널이 남아 여행 선택을 덮는 HIGH 회귀를 실제 재현·수정했다(`DAY18_V4_NOTE_SKIP_FIX.md`). 일반 진행/SKIP/종료 정리 통합, 기존 저장에서 재검증. game199, 자동 테스트 455 PASS. 이 시험은 비-SKIP 원문 QA와 별도다. 다음은 **SCENE12 음식 나누기 행동**. DAY18 PARTIAL 유지.

23:18 실행 후속: SCENE12 첫 평가 전에 한 입 나누는 CG를 연결했다(`DAY18_V4_FOOD_SHARING.md`). 세 메뉴별 대사는 유지하며 식사/연락 flag 추가 없음. 실제 비-SKIP 표시/자동 복귀/저장 Scene 재개/원래 저장 복원, 자동 테스트 456 PASS. game200. 다음은 **SCENE12 상대 음식 맛보기·각자 식사와 남은 원문 행동 대조**, 이후 최종 동일 버전 4경로/모바일·DAY15~17 감사. DAY18 PARTIAL, DAY19~30 미완료.

23:23 후속 QA: 각자 메뉴/메뉴 고민을 실제 비-SKIP으로 SCENE13 선택까지 진행해 공유 제안·응답과 얼굴 농담의 조건을 확인했다(`DAY18_V4_FOOD_SHARING.md`). 취소 경로 /1·/2·/3에 공유 행동 누출 방지 회귀 검사를 추가. 게임 변경 없이 game200 유지. 다음은 **상대 음식 맛보기/각자 먹기 행동과 식사 교훈을 붙이지 않는 원문 독백**, 이후 기존 잔여 감사. DAY18 PARTIAL 유지.

23:28 후속: SCENE12 누락된 “관계에 대한 교훈을 붙이지는 않았다” 내적 독백을 평가와 파일 대화 사이에 복구하고 실제 비-SKIP 재생 확인(`DAY18_V4_MEAL_MONOLOGUE.md`). game201, 457 PASS. 다음은 **SCENE08/10/14에 남은 물리 행동 독백 오염 분리 및 SCENE12 맛보기/각자 먹기 연출**, 이후 최종 QA. DAY18 PARTIAL 유지, 이 작은 복구를 DAY 완료로 집계하지 않는다.

23:34 후속: SCENE08 먹기/웃기, SCENE10 접시·컵, SCENE14 어깨 접촉의 물리 행동 문장을 일반 독백에서 분리했다(`DAY18_V4_ACTION_TEXT_CLEANUP.md`). 원문과 내적 반응 보존, game202, 458 PASS. 실제 유리 SCENE08→10 비-SKIP 연결 확인. 행동 구현 완료가 아니라 오염 제거이며 에셋 필요 목록에 유지했다. 다음은 **SCENE12/08 맛보기 및 SCENE10 컵·접시 시각 이벤트**, 이후 어깨/다른 행동 감사와 최종 QA. DAY18 PARTIAL.

23:41 후속: SCENE10 침묵 뒤 추가 접시를 위한 컵 이동 CG/SFX를 연결했다(`DAY18_V4_TABLE_SPACE.md`). 실제 표시/선택 복귀/저장 Scene 재개, 459 PASS, game203. 정지 CG이며 애니메이션 완료를 뜻하지 않는다. 다음은 **SCENE12/08 맛보기 및 SCENE14 어깨 접촉**, 그 외 행동 감사와 최종 QA. DAY18 PARTIAL 유지.

23:48 후속: SCENE08 “지금은 진짜예요” 직후 자기 접시의 채소를 드는 POV CG를 연결했다(`DAY18_V4_YURI_VEGETABLE.md`). 실제 비-SKIP 표시/유리 관계 질문 복귀, 460 PASS, game204. 빈 상대 의자가 보인 초안은 식탁 클로즈업으로 수정했다. 다음은 **SCENE12 상대 음식 맛보기/각자 식사와 SCENE14 어깨 접촉**, 남은 행동·최종 QA. DAY18 PARTIAL 유지.

23:52 회귀: CG 표시 중 SKIP의 타이머 취소/입력 잠금 해제/다음 선택과 자동 종료의 장면 소유권을 실제 코드 테스트 및 브라우저로 확인했다(`DAY18_V4_CG_SKIP_QA.md`). 오류 미관찰, game204 유지. 이 SKIP 시험은 비-SKIP 원문 QA에 합산하지 않는다. 다음은 **SCENE12 상대 음식 맛보기/각자 식사**, 이후 어깨/남은 행동. DAY18 PARTIAL.

00:01 후속(9/5): SCENE12 상대 음식 맛보기와 각자 다음 한 입을 기존 공유 컷과 연속적인 두 CG로 연결했다(`DAY18_V4_HAEUN_TASTING.md`). 실제 비-SKIP 세 컷/독백 순서·저장 재개, 462 PASS, game205. 다음은 **SCENE14 옆자리 어깨 접촉 및 남은 행동 우선순위 재정리**, 최종 동일 버전4경로/모바일·DAY15~17 감사. DAY18 PARTIAL 유지.

00:07 실행 후속(9/5): 기존 술집의 빨간 테이블과 하은 식사 세 CG의 갈색 나무 식탁 불일치를 수정했다(`DAY18_V4_PUB_TABLE_CONTINUITY.md`). imagegen 편집 v2 세 파일로 동작 보존, 실제 비-SKIP 연속 표시/원문 독백 복귀/사용자 저장 복원, 462 PASS, game206. 다음은 **SCENE14 옆자리 어깨 접촉**, 이후 남은 행동 우선순위 및 최종 QA. DAY18 PARTIAL, DAY19~30 미완료 유지.

00:16 실행 후속(9/5): SCENE14 어깨 연출 전 동의/옆자리/손잡기 계약을 원문 대조하고 3개 저장 스키마의 분기·재생·잘못된 선택 거부 회귀를 추가했다(`DAY18_V4_SHOULDER_CONTRACT_QA.md`). 464 PASS, 런타임 game206 유지. **어깨 CG는 아직 미생성/미연결**이며 다음 실행은 명시한 시각 조건으로 생성·연결·실제 QA다. DAY18 PARTIAL 유지.

00:20 실행 후속(9/5): SCENE14 옆자리 동의·거리 대화 뒤 어깨 접촉 정지 CG를 연결했다(`DAY18_V4_SHOULDER_CG.md`). 실제 비-SKIP 선택/표시/독백 복귀/저장 재개 및 사용자 저장 복원, 자동 464 PASS. game207. 다음은 **행동 감사표 최신화 및 SCENE01 아침 생활 행동**, 이후 남은 연출과 최종 동일 버전4경로/모바일·DAY15~17 감사. DAY18 PARTIAL 유지.

00:28 실행 후속(9/5): 옛 감사표의 이미 연결된 연출과 잔여 범위를 분리했다(`DAY18_V4_ACTION_AUDIT_REFRESH.md`). SCENE03 바람 설명의 문서상 주체 오류를 바로잡고 올바른 실제 코드의 화자를 회귀로 고정했다. SCENE01 알람/물/냉장고의 행동 독백 문제를 재분류. 다음은 **아침 물 마시는 POV 구현 및 행동/내적 반응 분리**, 이후 알람과 옷/냉장고. game207, DAY18 PARTIAL 유지.

00:32 실행 후속(9/5): SCENE01 물 마시기 행동 문장을 POV 정지 CG로 분리했다(`DAY18_V4_MORNING_WATER.md`). 실제 비-SKIP 아침 표시/약속 회고/선택 연결과 사용자 저장 복원, 465 PASS, game208. 다음은 **알람/냉장고 행동 및 SOLO 어제 답 이력 대조**, 이후 나머지 행동과 최종 QA. DAY18 PARTIAL 유지.

00:39 실행 후속(9/5): SOLO 아침에 전일 식사 답장을 일괄 회상하던 표현을 확정 약속에만 제한했다(`DAY18_V4_SOLO_MORNING_RECAP.md`). DAY17 실제 개인 결정과 대조, 실제 비-SKIP 빈칸→독백→선택 확인/사용자 저장 복원, 465 PASS. game209. 다음은 **알람/누워 있기와 혼자 선택 후 냉장고 행동**. DAY18 PARTIAL 유지.

00:45 실행 후속(9/5): 아침 재검토에서 누락된 하은 취소 후 내적 반응을 복구했다(`DAY18_V4_CANCEL_REFLECTION.md`). 3개 스키마의 상대별 분기 검사 포함 466 PASS, game210. 추가 문장 실제 재생은 NOT RUN. 다음은 **취소 독백 실제 확인 및 알람/냉장고 연출**, 잔여 게이트 그대로 DAY18 PARTIAL.

00:50 QA 후속(9/5): game210의 하은 취소 독백을 실제 비-SKIP으로 순서/화자 패널/08:00 표시 확인하고 새로고침 재개 후 12:30 혼자 식사 고지 선택까지 검증했다(`DAY18_V4_CANCEL_REFLECTION.md`). 콘솔 오류 없음/사용자 저장 복원, 코드 변경 없음. 다음은 **아침 알람/냉장고 행동**. DAY18 PARTIAL 유지.

00:55 실행 후속(9/5): 혼자 저녁 결정 뒤 냉장고 행동을 정지 CG로 분리했다(`DAY18_V4_MORNING_FRIDGE.md`). 취소 문자 조건 유지, 실제 SOLO 비-SKIP 선택/표시/독백 복귀/저장 복원, 467 PASS, game211. 다음은 **알람/누워 있기 및 약속 유지 뒤 옷 꺼내기**, 기존 약속 취소→새 냉장고 연출 실제 QA도 남음. DAY18 PARTIAL 유지.

01:01 QA 후속(9/5): 유리/하은 약속의 혼자 선택에서 취소 문자→냉장고→독백 실제 비-SKIP 확인, 유리 저장 재개 및 사용자 저장 복원(`DAY18_V4_MORNING_FRIDGE.md`). 유지/변경 선택의 CG 제외 회귀 추가. 코드 연출은 game211 유지. 다음은 **알람/누워 있기 및 옷 꺼내기**. DAY18 PARTIAL 유지.

01:09 실행 후속(9/5): SCENE01 재대조에서 약속 없는 혼자 선택의 누락된 내적 반응을 복구했다(`DAY18_V4_SOLO_DECLARATION.md`). 실제 비-SKIP 독백→냉장고→독백/저장 재개/사용자 저장 복원, 자동 468 PASS. game212. 다음은 **알람/누워 있기/발끝 및 옷 꺼내기 행동 자산과 구현**. 텍스트 복구를 행동 완료로 간주하지 않으며 DAY18 PARTIAL 유지.

01:15 실행 후속(9/5): 약속 유지 뒤 옷 꺼내기를 전용 POV 정지 CG로 연결했다(`DAY18_V4_MORNING_CLOTHES.md`). 하은 실제 비-SKIP 문자→CG→독백과 저장 재개/사용자 저장 복원, 자동 469 PASS. game213. 다음은 **알람/누워 있기/발끝 시작 연출**, 유리 유지 새 CG 실제 확인도 남는다. DAY18 PARTIAL 유지, DAY19~30 원본 미완료.

01:22 QA 후속(9/5): 유리 유지의 문자→옷 CG→독백을 아침부터 실제 비-SKIP 확인하고 저장 재개/동일 CG/사용자 저장 복원을 검증했다(`DAY18_V4_MORNING_CLOTHES.md`). 코드 변경 없음, game213. 다음은 **알람/누워 있기/발끝 시작 연출**. DAY18 PARTIAL 유지.

01:26 실행 후속(9/5): 침대 시작 구간을 실제 기존 침실 배경으로 분리하고 물 CG 전에 거실로 이동하도록 수정했다(`DAY18_V4_BEDROOM_OPENING.md`). 실제 SOLO 침실→거실/08:00/저장 복원, 자동 470 PASS. game214. 다음은 **침실 기준 알람/발끝 POV와 행동 문장 분리**. 장소 수정만으로 행동 완료를 주장하지 않으며 DAY18 PARTIAL 유지.

01:31 실행 후속(9/5): 알람 끄기 정지 POV CG를 연결하고 해당 행동 문장을 독백에서 분리했다(`DAY18_V4_ALARM_CG.md`). 실제 SOLO 표시/내적 생각/저장 재개/사용자 저장 복원, 자동 470 PASS. game215. 다음은 **누운 자세·발끝 움직임 및 알람 입력/소리 검토·구현**. 정지 CG를 상호작용 완료로 집계하지 않으며 DAY18 PARTIAL 유지.

01:37 QA 후속(9/5): 선택 전 아침의 실제 SaveManager 저장/로드 검사를 추가하고 하은 아침 알람→물→약속 선택을 비-SKIP 검증했다(`DAY18_V4_ALARM_CG.md`). 대상 5 PASS, 사용자 저장 복원, game215 유지. 다음은 **누운 자세·발끝 움직임 및 알람 입력/소리**이며 아직 미구현이다. DAY18 PARTIAL 유지.

01:41 QA 후속(9/5): 유리 아침의 새 알람→물→약속 선택 비-SKIP 확인/사용자 저장 복원. 기존 CG/소리 엔진을 조사해 알람 상호작용의 추가 조건을 기록했다(`DAY18_V4_ALARM_CG.md`). 다음 실행은 **푸른 침구 기준 발끝 움직임 POV를 알람과 몸 상태 독백 사이에 구현**한다. game215, DAY18 PARTIAL 유지.

01:45 실행 후속(9/5): 알람 뒤 발끝 편 자세→굽힘→복귀를 2자산/3컷으로 구현했다(`DAY18_V4_TOE_MOVEMENT.md`). 실제 SOLO 세 프레임/독백 복귀/저장 재개/사용자 저장 복원, 자동 471 PASS. game216. 다음은 **알람 입력·소리와 SCENE02 문자 작성/지연 행동**. 제한 프레임 연출이며 DAY18 PARTIAL 유지.

01:52 실행 후속(9/5): SCENE02 처음 유리 약속을 알릴 때만 하은 첫 답장 전 pause를 연결했다(`DAY18_V4_FIRST_DISCLOSURE_PAUSE.md`). 3schema×고지 여부 회귀 검사 추가, game217. 새 pause 실제 브라우저 확인은 NOT RUN. 다음은 **새 답장 간격 실제 QA와 문자 작성/삭제 행동**, 알람 입력/소리 및 기존 잔여 게이트. DAY18 PARTIAL 유지.

01:56 QA 후속(9/5): 미고지 유리 경로를 아침부터 비-SKIP 진행해 첫 답장 전 대기→하은 응답/12:30/저장 재개를 확인했다(`DAY18_V4_FIRST_DISCLOSURE_PAUSE.md`). 사용자 저장 복원, 코드 변경 없이 game217. 다음은 **SCENE02 전송되지 않은 ‘저녁’ 초안 작성/삭제 연출**. 알람 입력/소리와 다른 게이트는 남아 DAY18 PARTIAL 유지.

02:01 실행 후속(9/5): 미전송 ‘저녁’ 초안→입력으로 삭제→답장 선택 이벤트를 연결했다(`DAY18_V4_UNSENT_DRAFT.md`). 실제 SOLO/Enter/저장 재개/사용자 저장 복원, 종료 후 문자 스타일 문제 수정·재검증. game218. 다음은 **초안 SKIP/다른 분기 QA 및 SCENE02 잔여 행동**. DAY18 PARTIAL 유지.

02:09 QA 후속(9/5): 하은 약속의 초안/빈 초안 각각 SKIP해 패널 제거·문자 스타일·정확한 단일 선택을 검증하고 사용자 저장을 복원했다(`DAY18_V4_UNSENT_DRAFT.md`). 게임 변경 없이 game218. 다음은 **유리 초안 확인 및 SCENE02 밥 확인 등 잔여 행동**. SKIP 시험을 원문 완주로 합산하지 않으며 DAY18 PARTIAL 유지.

02:20 실행 후속(9/5): SCENE02의 “남은 밥 확인”을 일반 독백이 아닌 실제 SOLO 전용 POV 정지 CG로 구현했다(`DAY18_V4_LEFTOVER_RICE.md`). 유리 약속을 숨긴 거짓말 경로에는 노출하지 않고 기존 불편한 내적 반응을 유지한다. 실제 비-SKIP 초안 삭제→답장→CG→저녁 복귀와 저장 재개/동일 CG/사용자 저장 복원, 자동 475 PASS. game219. 다음은 **유리 거짓말 제외 실제 QA 및 SCENE03 이후 메뉴·코트·가방 잔여 행동**, 알람 입력/소리와 최종 게이트. DAY18 PARTIAL 유지.

02:27 QA 후속(9/5): 유리 약속을 아침부터 비-SKIP 유지하고 미전송 초안 삭제/문자 스타일 복귀, 혼자 먹는다는 거짓말→하은 답장→불편한 내적 반응→19:00 전환을 확인했다(`DAY18_V4_LEFTOVER_RICE.md`). SOLO 밥 CG는 제외됐고 콘솔 오류 없음/사용자 저장 복원. game219 유지. 다음은 **SCENE03 이후 메뉴·코트·가방 잔여 행동 원문 대조와 구현**, 알람 입력/소리 및 최종 게이트. DAY18 PARTIAL 유지.

02:33 구현 후속(9/5): SCENE03~04 행동을 재대조하고 유리의 나눠 먹기 제안 후 생각하는 시간을 명시적 pause로 연결했다(`DAY18_V4_MENU_CONSIDERATION.md`). 3schema×2상대×3선택 회귀/순수 재생 포함 476 PASS, game220. 새 대기 실제 QA는 NOT RUN. 다음은 **메뉴 나누기 응답 실제 QA 및 유리 메뉴 펼침/겉옷 행동 자산 대조·구현**, 하은/SOLO 가방 행동과 기존 최종 게이트. DAY18 PARTIAL 유지.

02:36 QA 후속(9/5): game220 유리 메뉴 나누기 응답을 아침부터 비-SKIP 진행해 대기 뒤 수락→절반 계약 대화→SCENE05 선택, 새로고침 후 같은 응답 재개를 확인했다(`DAY18_V4_MENU_CONSIDERATION.md`). 장면 전환 포함 시간과 600ms 정밀 측정을 구분했다. 콘솔 오류 없음/사용자 저장 복원. 다음은 **SCENE03 유리 메뉴 펼침/겉옷 행동 자산 대조·구현**. DAY18 PARTIAL 유지.

02:43 구현 후속(9/5): 비스트로 기준 메뉴 닫힘/펼침 2자산을 만들어 도착 전 두 번 펼침을 네 컷으로 연결하고 행동 요약 독백을 분리했다(`DAY18_V4_MENU_OPENING.md`). 실제 비-SKIP 4컷→유리 도착/19:00/사용자 저장 복원, 자동 477 PASS, game221. 다음은 **새 메뉴 CG 저장 재개 및 유리 겉옷 행동**, 하은/SOLO 가방과 기존 최종 게이트. DAY18 PARTIAL 유지.

02:48 QA 후속(9/5): 도착 직전 집중 QA 진입점을 추가하고 메뉴 CG 표시 중 새로고침→이어하기→동일 네 컷→유리 도착을 비-SKIP 확인했다(`DAY18_V4_MENU_OPENING.md`). 장면 시작 재생 계약 유지, 콘솔 오류 없음/사용자 저장 복원, 대상 49 PASS. game221 유지. 다음은 **SCENE03 유리 겉옷을 의자에 거는 행동**, 하은/SOLO 가방과 기존 잔여 게이트. DAY18 PARTIAL 유지.

02:53 구현 후속(9/5): 현재 유리 인물이 겉옷 없는 블라우스 차림임을 시각 확인해 도착/제거 자산을 함께 맞춰야 함을 기록했다(`DAY18_V4_COAT_CONTINUITY_AUDIT.md`). 인접 각자 메뉴 분기의 원문 내적 반응 누락을 복구, 478 PASS, game222. 새 독백 실제 QA 및 겉옷 생성은 NOT RUN. 다음은 **각자 메뉴 독백 실제 확인과 도착용 겉옷/제거 CG 연속성 구현**. DAY18 PARTIAL 유지.

02:56 QA 후속(9/5): game222 각자 메뉴의 새 독백을 실제 비-SKIP으로 확인하고 새로고침 후 동일 독백→만남 목적 세 선택을 재검증했다(`DAY18_V4_COAT_CONTINUITY_AUDIT.md`). 콘솔 오류 없음/사용자 저장 복원. 다음은 **도착용 겉옷 인물과 같은 겉옷을 의자에 거는 CG 생성·연결**. DAY18 PARTIAL 유지.

03:05 구현 후속(9/5): 유리 도착 재킷 인물과 의자에 거는 동일 재킷 CG를 연결했다(`DAY18_V4_YURI_JACKET.md`). 실제 QA에서 NPC 렌더러가 명시 자산을 무시하던 문제를 발견해 DAY18에 한정 수정·재검증했다. 재킷→CG→기본 의상/독백, 사용자 저장 복원, 전체 480 PASS, game223. 다음은 **재킷 CG 저장 재개/후속 의상 QA와 하은 가방·메뉴 밀기 행동**. DAY18 PARTIAL 유지.

03:09 QA 후속(9/5): 재킷 CG 도중 새로고침하고 장면 시작 재생→재킷 도착→제거 CG→기본 의상, 후속 각자 메뉴/독백에서도 기본 의상과 숨겨진 CG를 실제 확인했다(`DAY18_V4_YURI_JACKET.md`). 콘솔 오류 없음/사용자 저장 복원. game223. 다음은 **하은 도착의 가방 내려놓기와 메뉴 밀기 행동 구현**. DAY18 PARTIAL 유지.

03:17 구현 후속(9/5): 기존 하은 크로스백/세이지 셔츠와 포차 테이블을 기준으로 맞은편 착석·가방 내려놓기 CG를 원문 대사 뒤 연결했다(`DAY18_V4_HAEUN_BAG.md`). 3schema×3상대 범위/순수 재생 포함 전체 481 PASS, game224. 실제 브라우저 QA는 NOT RUN. 다음은 **새 가방 CG 실제 표시/저장 재개와 주인공 메뉴 밀기 행동 구현**. DAY18 PARTIAL 유지.

03:20 QA 후속(9/5): 하은 도착 집중 픽스처를 추가해 가방 CG 표시 중 새로고침→동일 CG→메뉴 세 선택 복귀를 실제 비-SKIP 확인했다(`DAY18_V4_HAEUN_BAG.md`). 콘솔 오류 없음/사용자 저장 복원. game224. 다음은 **주인공이 메뉴를 하은 쪽으로 미는 행동 구현**. DAY18 PARTIAL 유지.

03:26 구현 후속(9/5): 하은 가방 컷을 기준으로 가방을 유지하고 주인공 손이 메뉴를 하은 쪽으로 미는 후속 CG를 연결했다(`DAY18_V4_HAEUN_MENU_SLIDE.md`). 실제 비-SKIP bag→menu→세 선택, 콘솔 오류 없음/사용자 저장 복원, 자동 481 PASS, game225. 다음은 **메뉴 CG 저장 재개와 SOLO 맞은편 가방 이동 행동**. DAY18 PARTIAL 유지.

03:30 QA 후속(9/5): 하은 메뉴 밀기 CG 도중 새로고침→이어하기→가방 CG→메뉴 CG→세 선택 복귀를 실제 비-SKIP 검증했다(`DAY18_V4_HAEUN_MENU_SLIDE.md`). 콘솔 오류 없음/사용자 저장 복원. game225. 다음은 **SOLO 맞은편 가방을 다른 손님 때문에 옆으로 옮기는 행동 구현**. DAY18 PARTIAL 유지.

03:36 구현 후속(9/5): SOLO 김밥집에서 다른 손님이 들어오자 맞은편 가방을 옆으로 옮기는 물리 행동을 전용 POV CG로 연결했다(`DAY18_V4_SOLO_BAG_MOVE.md`). 원문 행동 문장을 독백으로 출력하지 않고 SOLO에만 한정했으며, 실제 비-SKIP 표시→메뉴 선택·Scene 저장 재개·콘솔 오류 없음·사용자 저장 복원을 확인했다. 전체 482 PASS, game226. 다음은 **SCENE04 메뉴 닫기/물 마시기 등 잔여 행동과 알람 입력·소리 구현**, 이후 동일 버전 4경로/모바일·DAY15~17 감사. DAY18 PARTIAL 유지.

03:49 구현 후속(9/5): 유리 `조금 더 본다` 분기의 단위 실수 뒤 물 마시기를 전용 POV CG로 연결했다(`DAY18_V4_YURI_MENU_WATER.md`). 유리의 웃음·벗어 둔 재킷·닫힌 메뉴 연속성을 유지하고 행동 문장은 독백으로 출력하지 않았다. 실제 비-SKIP 대사→CG→내적 반응→목적 선택, Scene 저장 재개, 콘솔 오류 없음, 사용자 저장 복원 및 전체 483 PASS를 확인했다. game227. 다음은 **하은 menu_wait 물 행동과 각자 메뉴 두 번 닫힘 소리/알람 입력·소리**, 이후 동일 버전 4경로·모바일·DAY15~17 감사. DAY18 PARTIAL 유지.

03:56 구현 후속(9/5): 하은 `조금 더 본다` 분기의 선택 직후 물 마시기 행동을 전용 CG로 연결했다(`DAY18_V4_HAEUN_MENU_WATER.md`). 포차/의상/가방/닫힌 메뉴 연속성을 유지하고 행동 문장은 대화창에 출력하지 않았다. 실제 비-SKIP CG→얼굴 농담→SCENE12, Scene 저장 재개, 콘솔 오류 없음, 사용자 저장 복원과 전체 484 PASS를 확인했다. game228. 다음은 **유리 각자 메뉴 두 번 닫힘 소리와 알람 입력·소리 구현**, 이후 동일 버전 4경로·모바일·DAY15~17 감사. DAY18 PARTIAL 유지.

04:04 구현 후속(9/5): 유리 `각자 고른다`에서 두 사람이 메뉴를 닫는 원문 행동을 기존 종이·표지 취급 SFX 두 번과 180ms 간격으로 연결했다(`DAY18_V4_YURI_MENU_CLOSE_AUDIO.md`). 실제 사운드 활성 집중 fixture에서 두 메뉴 대사→cue 구간→원문 내적 반응을 비-SKIP 진행했고, 콘솔 오류 없음/사용자 저장 복원 및 전체 485 PASS를 확인했다. 청감 파형 측정과는 구분한다. game229. 다음은 **알람 입력·소리 구현과 잔여 행동 감사표 재점검**, 이후 동일 버전 4경로·모바일·DAY15~17 감사. DAY18 PARTIAL 유지.

손 화풍 수정 후속(9/5): DAY18 손 포함 CG를 전수 육안 감사하고 실사 피부가 섞인 5자산을 셀 채색 v2로 교체했다(`DAY18_V4_HAND_STYLE_CORRECTION.md`). 이후 모든 V4 CG에 `STORY_V4_IMAGE_STYLE_RULES.md`의 손 화풍 강제 계약을 적용한다. 해부학과 화풍을 별도 검사하며 사진 합성처럼 보이는 손은 해부학이 맞아도 반려한다. game230.

알람 구현 후속(9/5): SCENE01 알람 정지 CG를 자동 타이머에서 실제 `alarmAction` 입력으로 교체하고 다른 알림을 재활용하지 않은 전용 1.2초 WAV 루프를 추가했다(`DAY18_V4_ALARM_CG.md`). 화면/Enter/Space 입력 뒤 cue·CG를 정리하고 발끝 연출로 진행하며 SKIP도 같은 정리를 수행한다. 자동 회귀 후 실제 클릭·키보드·음소거·재개 QA가 다음 게이트다. game231, DAY18 PARTIAL 유지.

알람 실제 QA 후속(9/5): SOLO 집중 저장에서 자동 종료 없는 알람 대기, 화면 클릭·Space 각각의 즉시 정리와 첫 발끝 프레임 전환, 알람 대기 중 새로고침→이어하기→동일 입력 상태 복원을 확인했다. 사용자 저장 복원 완료. STORY 전체화면에서 사운드 버튼이 숨겨져 실제 음소거 토글은 미검증으로 남겼다. 다음은 **음소거 접근성 경로 및 알람 SKIP 실제 QA, 잔여 행동 감사표 재점검**이다. DAY18 PARTIAL 유지.

알람 음소거·SKIP 후속(9/5): STORY 툴바에 공용 `SND ON/OFF`를 노출하고 알람 중 OFF→ON 시 전용 cue가 재개되도록 연결했다. 실제 SOLO에서 가시성·토글 상태·알람 대기 유지·SKIP의 첫 아침 선택 이동을 확인했고, SKIP 뒤 남던 알람 접근성 이름도 제거해 재검증했다. 대상 6 PASS와 전체 시뮬레이션 PASS, 사용자 저장 복원. 행동 감사표는 SCENE01 완료 범위를 제외하도록 최신화했다. game233, DAY18 PARTIAL. 다음은 **SCENE11/14 잔여 물리 행동 원문 대조**, 이후 SCENE15/17~18/20~24와 동일 버전 4경로·모바일·DAY15~17 감사다.

SCENE11 결제·작별 후속(9/5): 나눠 내기 영수증을 대화창 행동 요약에서 종이 cue로 옮기고, 세 결제 경로에 식당→동네 밤길→작별→발걸음/인물 제거→22:00 집의 실제 이동을 연결했다(`DAY18_V4_YURI_DEPARTURE.md`). 실제 pay_split 비-SKIP 화면과 사용자 저장 복원. 첫 전체 회귀에서 알람 SKIP 최소 DOM 실패 1건을 발견·수정한 뒤 490/490 PASS. 기존 재킷 matte 및 alpha 없는 built-in 배경 제거 결과는 반려해 겉옷 여밈만 미완료로 남겼다. game236, DAY18 PARTIAL. 다음은 **SCENE14 가방 이동·물잔·산책 손동작 대조·구현**이다.

SCENE14 물잔 행동 후속(9/5): 어깨 접촉 뒤 조심스럽게 물잔을 드는 행동을 동일 장면 기반 2D 셀 채색 CG로 연결하고 행동 문장을 대화창에서 제거했다(`DAY18_V4_SHOULDER_WATER.md`). imagegen 정밀 편집과 실제 비-SKIP `contain` 화면에서 해부학·화풍을 별도 PASS로 판정하고 사용자 저장을 복원했다. 이미지 규칙에는 전경/가장자리 손의 예외 없는 검사와 얼굴-손 혼합 화풍 금지를 추가했다. game237, DAY18 PARTIAL. 다음은 **SCENE14 가방 이동 재판정과 산책 손동작 구현**이다.

SCENE14 가방·산책 후속(9/5): 옆자리 가방을 치운 결과 화면만 있던 누락을 `가방 치우기 CG→“와.”→자리 이동`으로 보완하고, 산책의 거리 좁힘/선행 이력이 있는 손잡기를 서로 다른 2D 셀 채색 CG로 연결했다(`DAY18_V4_SCENE14_ACTIONS.md`). 행동 문장은 대화창에서 제거하고 기존 `heldHands` 계약만 사용했다. 실제 비-SKIP 세 경로, 해부학/화풍 별도 PASS, 사용자 저장 복원. game238, DAY18 PARTIAL. 다음은 **SCENE15 휴대전화 뒤집기·추가 주문·봉투 동작 구현**이다.

SCENE15 행동 후속(9/5): 혼자 저녁의 휴대전화 뒤집기·작은 추가 식사를 결과 CG/화면 OFF cue로 옮기고, 누락된 봉투 흔들기와 손 모방을 종이 SFX 두 번/2D 셀 채색 손 CG로 연결했다(`DAY18_V4_SCENE15_ACTIONS.md`). 행동 문장을 대화창에서 제거하고 내적 반응 및 세 연락 선택은 보존했다. 실제 비-SKIP CG/SFX/선택 복귀, 해부학/화풍 별도 PASS, 사용자 저장 복원. game239, DAY18 PARTIAL. 다음은 **SCENE17~18 폰 화면 보기·손 바꾸기 구현**이다.

SCENE09·13 행동 후속(9/5): 유리의 냅킨→관계 질문→컵, 시선/손 멈춤과 하은의 냅킨·표정·식사 지속 판단을 일반 대화가 아닌 `storyActionCue`로 복구했다(`DAY18_V4_SCENE09_13_ACTIONS.md`). 유리가 하은을 이미 아는 입력에서만 이름을 쓰며 새 관계 사실은 만들지 않는다. game244, DAY18 PARTIAL. 다음은 **실제 비-SKIP 두 집중 경로 확인 후 SCENE19 감사**, 이후 SCENE11 겉옷 자산과 동일 버전 4경로·모바일 최종 QA다.

SCENE19 평온한 밤 후속(9/5): 두 웃음을 문자 텍스트가 아닌 배경 기반 행동 cue로 분리하고, 같은 저녁 선택 뒤 누락됐던 설렘 독백을 복구했다(`DAY18_V4_SCENE19_CALM_ACTION.md`). 실제 비-SKIP 첫 cue→선택지→같은 저녁 반응→두 번째 cue→독백, 접근성 cue 정리, 사용자 저장 복원을 확인했다. game245, DAY18 PARTIAL. 다음은 **SCENE11 겉옷 자산 재판정**, 이후 동일 버전 4경로·모바일 최종 QA다.

SCENE11 겉옷 최종 후속(9/5): 기본 유리 투명 스프라이트를 기준으로 닫힌 차콜 재킷을 추가하고, 첫 가짜 체크무늬 RGB를 반려한 뒤 실제 RGBA/모서리 alpha 0 버전을 연결했다(`DAY18_V4_YURI_OUTERWEAR_FINAL.md`). 도착/야외의 같은 겉옷, 식당 제거 뒤 기본 의상, 야외 여밈 cue→작별 순서를 고정했다. 실제 야외 합성·손 2D 화풍·사용자 저장 복원 확인. game246, DAY18 PARTIAL. 다음은 **동일 버전 Friendly/Neutral/Distant/Mixed 및 모바일 최종 QA**다.

손 화풍 재노출 방지 후속(9/5): 신고 화면과 일치한 유리 물 v1을 기준으로 전경 손을 더 명확한 2D 셀 선화로 다시 편집해 v3 새 파일명으로 연결했다. v1·v2를 런타임 금지 목록에 추가하고, 손 실루엣→100% 확대→같은 프레임 얼굴 비교의 3단계 승인 규칙 및 자산/브리지/fixture/최상위 캐시 동시 상승 규칙을 문서·테스트에 고정했다. game247. DAY18 PARTIAL 유지.

4성향 최종 QA 시작(9/5): game247 Friendly를 DAY17 완료 fixture의 하은 저녁에서 실제 `불러오기`로 시작해 SKIP 없이 DAY19까지 완주했다(`DAY18_V4_ROUTE_FINAL_QA.md`). 좋은 마음→옆자리 동의→좋았다는 밤 문자→하루 외출→가까운 하루 후보 순서를 확인했고 콘솔 error/warn 0, 사용자 저장 복원 PASS. DAY18 PARTIAL 유지. 다음은 **Neutral 실제 비-SKIP 완주와 저장 복원**이다.

4성향 최종 QA Neutral(9/5): game247 유리 경로의 11선택을 SKIP 없이 DAY19까지 완주했다. 사전 고지→각자 메뉴→과거/고마움→현재 관계 명시→시간 두기→각자 결제→사실 보고→확신 유보→생활 후보를 확인했고, 존재하지 않는 재만남 수락·여행 동의를 만들지 않았다. 콘솔 error/warn 0, 사용자 저장 복원 PASS. DAY18 PARTIAL 유지. 다음은 **Distant 실제 비-SKIP 완주와 저장 복원**이다.

4성향 최종 QA Distant(9/5): game247 연락 휴식/혼자 저녁의 6선택을 SKIP 없이 DAY19까지 완주했다. 하은 낮·밤 연락 선택 미표시, 식당/귀가 중 인물 비노출, 혼자 식사→휴대전화 없이 완료→바로 귀가→추가 연락 중단→생활 후보를 확인했다. 콘솔 error/warn 0, 사용자 저장 복원 PASS. DAY18 PARTIAL 유지. 다음은 **Mixed 실제 비-SKIP 완주와 저장 복원**이다.

4성향 최종 QA Mixed(9/5): game247 미고지 유리 경로의 12선택을 SKIP 없이 DAY19까지 완주했다. 현재 관심→외로움 공감→현재 관계 명시→재만남 요청(미수락)→각자 결제→사실 보고→가능한 시간 재질문→미전송 개인 메모→부산 후보를 확인했다. 존재하지 않는 재만남 수락·통화 시각 합의·여행 동의를 만들지 않았고 콘솔 error/warn 0, 사용자 저장 복원 PASS. 동일 버전 네 경로 클린 완주는 모였으나 DAY18 PARTIAL 유지. 다음은 **유리/하은/혼자 저장 재개와 모바일 최종 비교**다.

저장 재개 유리(9/5): game247 결제 후 야외 작별에서 겉옷 여밈→두 작별 대사→인물 숨김을 실제 비-SKIP 확인하고, 진행 중 새로고침→실제 `불러오기` 뒤 같은 Scene 시작부터 동일 순서로 복구되는 계약을 검증했다. 콘솔 error/warn 0, 사용자 저장 복원 PASS. 정확한 대사 오프셋 재개가 아닌 Scene-start 복구 판정이며 DAY18 PARTIAL 유지. 다음은 **하은 밤 저장 재개와 사용자 저장 복원**이다.

저장 재개 하은(9/5): game247 연락 가능한 밤 통화 집중 저장에서 사실 보고 문자→통화 가능 응답→통화 전환→관계 보고→침묵과 하은 응답을 실제 비-SKIP 확인했다. 하은 응답 진행 중 새로고침→실제 `불러오기` 뒤 같은 Scene 시작부터 사실 보고, 현재의 유리에 대한 설명과 `당분간 각자 지내 보자고 했어.`가 동일 순서로 복구됐다. 콘솔 error/warn 0, 사용자 저장 복원 PASS. Scene-start 복구 판정이며 DAY18 PARTIAL 유지. 다음은 **혼자 밤 저장 재개와 사용자 저장 복원**이다.

저장 재개 혼자(9/5): game247 연락 휴식/여행 사진 집중 저장에서 컵 정리→여행 사진 장면→미래를 정하지 않는 내적 반응→세 여행 후보를 실제 비-SKIP 확인했다. 선택 중 새로고침→실제 `불러오기` 뒤 같은 Scene 시작부터 동일 순서와 세 후보가 복구됐고 연락·여행 합의도 새로 만들지 않았다. 콘솔 error/warn 0, 사용자 저장 복원 PASS. 유리/하은/혼자 대표 Scene-start 저장 재개 게이트를 모두 닫았지만 DAY18 PARTIAL 유지. 다음은 **네 경로 모바일 대표 화면과 DAY19 종료 전환 비교**다.

모바일 최종 QA 시도(9/5): `390×844` viewport override 뒤 새 탭을 열었지만 실제 페이지는 `1103×620`, 보정 뒤에도 `951×534`로 남아 모바일 미디어쿼리 증거로 인정하지 않았다. 인앱 브라우저의 탭 CDP emulation capability와 연결된 Chrome도 없어 모바일 관문은 BLOCKED다. 잘못된 폭의 Friendly 시험 저장과 임시 viewport를 모두 복원했다. DAY18 PARTIAL 유지. 환경이 열릴 때까지 같은 실패를 반복하지 않고 다음은 **DAY15~17 잔여 충실도 감사**다.

DAY15 충실도 재감사(9/5): Notion 원문 페이지를 다시 검색·전체 수신해 page id와 last-edited snapshot, 24 Scene/12 Choice, 출석·전화·무연락 경로, DAY12~14 지식 경계와 조건부 접촉/공개 자료/잠정적 DAY23 hook을 현재 구현과 대조했다(`day15/DAY15_V4_FIDELITY_REAUDIT_2026-09-05.md`). DAY15 집중 회귀 81/81 PASS이며, 과거 중간 문서의 `5/6`·`browser pending` 표기는 후속 공개 릴리스/실제 브라우저 완료 기록이 대체한다. DAY15 감사는 PASS로 닫고 다음은 **DAY16 Notion 원문 전체 재감사**다.

DAY16 충실도 재감사(9/5): Notion 원문 전체를 다시 수신해 동일 page id/snapshot, 선언 본문 16,646자, 24 Scene/12 Choice와 지훈 동석·혼자 카페·집, 연락휴식, 하은 공개, 유리 연락/모레 제안 경계를 현재 구현과 대조했다(`day16/DAY16_V4_FIDELITY_REAUDIT_2026-09-05.md`). V4 및 Story/Free 배타성 집중 회귀 67/67 PASS다. 끝난 관계 선택 6의 원문 반응 공백은 승인된 대로 한 옵션만 fail-closed UI 잠금하며 새 반응을 만들지 않는다. 과거 중간 문서의 미착수/릴리스 대기 표기는 후속 공개 릴리스 기록이 대체한다. DAY16 감사는 PASS로 닫고 다음은 **DAY17 Notion 원문 전체 재감사**다.

DAY17 충실도 재감사 시작(9/5): 동일 Notion page id/snapshot과 24 Scene/12 Choice를 확인했지만 단일 플레이 브리지에서 원문 고유 따옴표 문자열 185개 중 42개가 정확 문장으로 존재하지 않는 축약을 발견했다(`day17/DAY17_V4_FIDELITY_REAUDIT_2026-09-05.md`). 새 맛·피로·가방·좋아서 하는 말·미대면 통화·유리 약속 대사를 원문 경로별로 복구했다. 수정 후 184/185가 존재하며 남은 1개는 원문이 명시한 금지 반례라 의도적으로 미노출이다. DAY17/인접/Story-Free 32/32와 100회×30일 시뮬레이션 PASS, game248. DAY17은 PARTIAL 유지하며 다음은 **변경본의 대면/유리 초대 및 집/비대면/미초대 실제 비-SKIP QA와 사용자 저장 복원**이다.

DAY17 충실도 재감사 종결(9/5): game248 대면·유리 초대 12선택과 집 휴식·비대면·유리 미초대 9선택을 실제 UI에서 각각 SKIP 없이 DAY18까지 완주했다(`day17/DAY17_V4_FIDELITY_REAUDIT_2026-09-05.md`). 조건부 선택과 유리 연락 경계를 보존했고 두 경로 console warning/error 0, QA 전 사용자 저장 복원 PASS다. QA 픽스처 자체에도 전체 localStorage 1회 백업/명시적 복원 계약을 추가했고 종결 변경 후 집중 회귀 21/21을 통과했다. DAY17은 PASS/COMPLETE로 닫는다. 다음은 **DAY18의 미해결 390×844 모바일 최종 비교**이며, 유효한 모바일 viewport 환경이 열리기 전에는 DAY18 COMPLETE를 선언하지 않는다.

DAY18 모바일 최종 QA 및 종결(9/5): 전용 viewport capability로 모바일 미디어쿼리가 활성화된 유효 `389×844` 영역(목표 390×844의 1px 렌더링 반올림)을 확보했다. game248 Friendly 8선택, Neutral 11선택, Distant 6선택, Mixed 12선택을 실제 선택지가 나타난 뒤 직접 눌러 각각 SKIP 없이 DAY19까지 완주했다(`DAY18_V4_ROUTE_FINAL_QA.md`). 네 경로 모두 가로 넘침 0, stage 전체 폭 사용, console warning/error 0이며 존재하지 않는 인물·연락·재만남 수락·통화 시각 합의·여행 동의를 만들지 않았다. 경로 사이와 종료 뒤 사용자 저장을 복원하고 임시 viewport를 reset했다. DAY15~17 재감사도 모두 닫혔으므로 DAY18은 PASS/COMPLETE다. 다음은 **DAY19 Notion 최종 원문 잠금과 DAY16~18 입력/실제 이력 감사 후 구현**이다.

DAY19 원문 구현 시작(9/5): 최종 Notion page id/snapshot을 고정하고 공개 본문을 24 Scene/16 Choice로 기계 추출하는 source registry와 정확 문구 회귀 검사를 추가했다(`day19/DAY19_V4_IMPLEMENTATION_PLAN_2026-09-05.md`). 내부 편집 메모는 registry에서 제외했고, 기존 집안일 5장면·3선택 및 4막 expansion은 원문 구현이 아니라는 판정을 유지한다. DAY19는 PARTIAL이며 다음은 **전용 replay-locked 상태 계약과 legacy 진입 분리**다.

DAY19 상태 계약(9/5): DAY18의 검증된 완료 chapter에서만 새 V4를 시작하고 관계 온도·연락·여행 대화·미완료 연락·오락비 자격을 entry input으로 동결하는 16단계 replay 계약을 추가했다. C5/C14 shared·solo 변형과 실제 연락이 없을 때 C15 생략을 저장 구조에 반영했다. 후보를 예약으로, 관심을 수락으로, 예산 의사를 송금으로, 민호 조율을 유급 업무로, 미확정 복권을 당첨금으로 승격하지 않으며 변조 저장은 거부한다. 기존 DAY19 키가 시작된 저장은 legacy를 유지한다. 집중 8/8 PASS. DAY19는 PARTIAL이며 다음은 **조건부 source selector와 SCENE01~05/C1~C4 playable script**다.

DAY19 SCENE01~05 구현(9/5): exact source line selector와 C1~C4 전용 playable opening을 추가했다. 원문 행동은 비출력 `stageAction`, 직접 말은 대화/문자, 내면은 독백으로 나누고 일반 `narration` 및 조건 메모 출력을 금지했다. 연락 휴식 입력의 하은 연락 선택과 연락 불가 입력의 동반 식사를 fail-closed 했다. 복권은 오락비 자격에 따라 미확정 구매/중단만 표시하고 당첨금은 만들지 않으며, 민호 연락은 방문 조율 이상으로 승격하지 않는다. source/state/opening 집중 13/13 PASS. 아직 본선 미연결이므로 DAY19는 PARTIAL이며 다음은 **SCENE06~12/C5~C7 조건부 구현**이다.

DAY19 SCENE06~12 구현(9/5): DAY18의 평온한 실제 여행 대화·연락 가능 입력만 `CALL_SHARED`로 선택해 하은과 후보/각자 예산/늦잠/빈칸을 이야기하고, 나머지는 solo·동행 미정 원문만 재생하는 중간 playable 구간을 추가했다. 새 대면 약속이나 하은의 승인·돈을 만들지 않으며 C5 shared/solo, C6 일정 축소, C7 준비 동기의 모든 반응을 exact source line에 연결했다. middle/state 집중 9/9 PASS. 본선 미연결이므로 DAY19는 PARTIAL이며 다음은 **SCENE13~17/C8~C12 구현**이다.

DAY19 SCENE13~17 구현(9/5): 동행 태도·돈을 쓰는 이유·부산/서울/미루기 후보·예약 앞 반응·미확정 기대를 전용 candidates playable 구간으로 구현했다. shared/solo 출력을 분리하고, C11의 세 선택 모두 결제 없이 `CANDIDATE_ONLY`로 끝나며 먼저 잡고 싶은 경로도 손을 떼도록 했다. 미확정 복권/오지 않은 수입을 세지 않고 지훈에게 말하지 않은 복권 사실도 만들지 않는다. candidates/state 집중 9/9 PASS. 본선 미연결이므로 DAY19는 PARTIAL이며 다음은 **SCENE18~24/C13~C16 ending 구현**이다.

DAY19 SCENE18~24 구현(9/5): 실제 C13 저녁, 명시적으로 수락된 내일 집 식사만 여는 shared C14, 실제 남은 연락이 있을 때만 여는 C15, 돈을 남기는 C16과 세 ending 경로를 구현했다. 통화 경로를 카페 동석으로 바꾸지 않고, 연락 불가 경로의 하은 대사·존재하지 않는 NPC 이름을 제거했다. 마지막은 SCENE24 원문 뒤 completion cue로 끝난다. ending/state 집중 9/9 PASS. 24 Scene/16 Choice 순수 스크립트는 준비됐지만 본선·경제·저장/로드·브라우저 미검증이므로 DAY19는 PARTIAL이며 다음은 **통합 game bridge와 본선 교체**다.
01:17 후속(9/5): DAY19 SCENE18~24/C13~C16 순수 플레이를 완료하고 원격 `379c97d`까지 동기화했다. DAY19는 PARTIAL이며 다음은 본선 브리지/경제 원장/저장·브라우저 QA다.

01:40 후속(9/5): DAY19 SCENE01~24 네 구간을 새 V4 본선 브리지로 연결하고 기존 축약 저장과 분리했다(`day19/DAY19_V4_GAME_BRIDGE_2026-09-05.md`). C3 복권은 결과·상금 없이 사전 오락비 5,000원만 원자적으로 기록하며 오류 시 장/잔액/원장을 롤백한다. 실제 SaveManager 중간 저장 왕복, shared/solo 16단계, 전체 자동 회귀와 100×30일 시뮬레이션 PASS. 다음은 **실제 브라우저 Friendly 비-SKIP 완주/저장 재개**, 이후 나머지 3경로와 모바일. DAY19 PARTIAL 유지.

10:42 브라우저 후속(9/5): DAY19 Friendly shared를 SCENE01부터 DAY20까지 15개 실제 선택(C15 조건부 생략)으로 SKIP 없이 완주했다(`day19/DAY19_V4_BROWSER_QA_2026-09-05.md`). C5 뒤 새로고침 재개, 09/14/19/22시 전환, 후보≠예약, Story 선택/Free Action 배타성, 데스크톱 가로 넘침 0, console warning/error 0, 사용자 저장 복원 PASS. 다음은 **Distant 데스크톱 비-SKIP 완주**이며 DAY19 PARTIAL 유지.

10:58 브라우저·수정 후속(9/5): DAY19 Distant 연락 휴식/solo를 실제 진행하다 공동 C8, 두 사람 C11, 합의 범위 C16 선택 노출을 발견했다. 기존 replay 저장은 유효하게 유지하면서 신규 playable presentation만 원문 조건에 맞춰 fail-closed 한 game249로 수정했다. 재시작 후 15개 선택을 SKIP 없이 DAY20까지 완주했고 하은 인물 노출 0, Story/Free 배타성, 데스크톱 가로 넘침 0, console warning/error 0, 사용자 저장 복원 PASS(`day19/DAY19_V4_BROWSER_QA_2026-09-05.md`). 다음은 **Mixed 데스크톱 비-SKIP 완주**이며 DAY19 PARTIAL 유지.

11:17 브라우저 후속(9/5): DAY19 Mixed fixture의 연락 가능/solo DAY18 replay에서 disclosure/night 선택 누락을 발견해 합법 `disclose_solo → night_defer → alone_stop` 이력으로 교정했다. 새 클린 탭에서 C3 복권 실제 1회, C15 실제 서진 연락을 포함한 16개 선택을 SKIP 없이 DAY20까지 완주했다. 내일 식사 비수락→solo C14, 후보≠예약, 결과·상금 0 표현, solo C16, 대면 인물 오노출 0, Story/Free 배타성, 데스크톱 가로 넘침 0, console warning/error 0, 사용자 저장 복원 PASS(`day19/DAY19_V4_BROWSER_QA_2026-09-05.md`). 정확한 5,000원 원장 1회는 자동 원자성 검사로 별도 유지한다. 다음은 **Neutral 데스크톱 비-SKIP 완주**이며 DAY19 PARTIAL 유지.

11:38 브라우저·수정 후속(9/5): DAY19 Neutral에서 C8 각자 여행 뒤 C11 공동 재확인과 SCENE22 편안한 공동 통화가 남는 원문 경계 결함을 발견했다. 기존 replay 저장은 유효하게 유지하고 game250 presentation의 C11을 후보 유지 하나로 제한, SCENE22를 거리 두기 원문으로 연결했다. 재실행 15개 선택을 SKIP 없이 DAY20까지 완주했고 각자 저녁→solo C14, C15 생략, 합의 범위 비송금, 상상 공동 통화 비노출, Story/Free 배타성, 데스크톱 가로 넘침 0, console warning/error 0, 사용자 저장 복원 PASS(`day19/DAY19_V4_BROWSER_QA_2026-09-05.md`). 데스크톱 네 경로가 닫혔고 다음은 **390×844 모바일 Friendly 비-SKIP 완주**다. DAY19 PARTIAL 유지.

11:58 모바일 브라우저 후속(9/5): DAY19 Friendly를 목표 390×844의 장치 배율 반올림값인 실제 `391×844` 모바일 미디어쿼리 영역에서 SCENE01부터 DAY20 첫 Story 선택까지 15개 실제 선택(C15 생략)으로 SKIP 없이 완주했다. 선택 경계 최대 수평 넘침 0, 최종 `scrollWidth=clientWidth=391`, console warning/error 0, Free Action 비노출, 사용자 저장 복원과 viewport reset을 확인했다(`day19/DAY19_V4_BROWSER_QA_2026-09-05.md`). 다음은 **모바일 Distant 비-SKIP 완주**이며 DAY19 PARTIAL 유지.

12:24 모바일 브라우저·경계 수정 후속(9/5): DAY19 Distant를 실제 `389×844`에서 15개 선택(C15 생략)으로 SKIP 없이 완주했다. 첫 실행에서 내일 식사 비수락인데도 완료 slot만으로 기존 DAY20 공동 식사가 열려 하은 방문을 만드는 결함을 발견했다. game251은 DAY19의 `tomorrowMeal === 'ACCEPTED'`일 때만 `day20CurrentSharedMealPending`을 세우고 기존 DAY20 장면이 이 표식을 요구하도록 수정했다. 재완주에서 하은 방문 대사·공동 식사 질문/선택은 비노출되고 exact DAY20 V4 전 placeholder로 fail-closed 했다. 하은 DAY19 노출 0, 최대 수평 넘침 0, console warning/error 0, 사용자 저장 복원과 viewport reset PASS. 다음은 **모바일 Mixed 비-SKIP 완주**이며 DAY19 PARTIAL 유지.

12:26 모바일 브라우저 후속(9/5): DAY19 Mixed를 실제 `389×844`에서 조건부 C15를 포함한 16개 선택으로 SKIP 없이 완주했다. 연락 가능/solo/서진 미완료 연락/오락비 입력에서 복권 결과·상금, 예약·결제, 존재하지 않는 NPC 연락, 내일 식사 수락을 만들지 않았고 비수락 DAY20은 공동 식사 대신 placeholder로 fail-closed 했다. 대면 인물 스프라이트 0, 최대 수평 넘침 0, console warning/error 0, 사용자 저장 복원과 viewport reset PASS(`day19/DAY19_V4_BROWSER_QA_2026-09-05.md`). 다음은 **모바일 Neutral 비-SKIP 완주**이며 DAY19 PARTIAL 유지.

12:36 모바일 Neutral 및 DAY19 종결(9/5): DAY19 Neutral을 실제 `389×844`에서 15개 선택(C15 생략)으로 SKIP 없이 완주했다. 각자 여행 뒤 후보 유지 하나, 각자 저녁 뒤 solo C14, 합의 범위 비송금, 거리 두기 SCENE22를 확인했고 금지된 공동 통화·비수락 DAY20 공동 식사는 비노출됐다. 대면 인물 스프라이트 0, 최대 수평 넘침 0, console warning/error 0, 사용자 저장 복원과 viewport reset PASS. source/상태/본선/경제/저장/Story-Free/데스크톱·모바일 네 경로가 모두 닫혀 DAY19를 **PASS / COMPLETE**로 승격한다(`day19/DAY19_V4_BROWSER_QA_2026-09-05.md`). 다음은 **DAY20 최종 Notion 원문 잠금과 DAY17~19 실제 이력 감사**다.

13:28 DAY20 착수(9/5): Notion 최종 V4 `3c9c31f0-29a6-81b3-b82a-c4fbc39173e4`의 24장면·대면 14선택·solo/conflict 대체 경로를 확인했다. DAY17~19 실제 이력을 대조해 `tomorrowMeal === ACCEPTED`와 현재 연락 가능일 때만 대면, 나머지는 solo로 시작하는 `day20-notion-v4/1` 상태 계약 foundation과 반례 테스트를 추가했다. 컵 대화·공동 여행 대화·첫 포옹·나란히 앉기·손잡기·숙박을 독립 사실로 고정하고 legacy/손상 저장은 fail-closed 한다. Notion fetch 크기 제한으로 SCENE12~18 본문 일부가 아직 완전 잠금되지 않았으므로 DAY20은 **PARTIAL**, 다음은 첨부 Markdown 또는 검색 조각으로 해당 원문을 복원하는 것이다. 상세는 `docs/day20/DAY20_V4_IMPLEMENTATION_PLAN_2026-09-05.md`.

13:52 DAY20 원문 잠금 완료(9/5): Notion connector 전체 응답에서 플레이어 본문 경계를 직접 추출해 이전에 잘렸던 SCENE12~18을 포함한 SCENE01~24·선택1~14를 `docs/scenarios/DAY20_SCENARIO_V4_NOTION.md`에 저장했다. 마지막 개행 포함 19,242자, SHA-256 `9db072f65fd3b0e0bf930628bbcb9e1601153413377baced59b0ae43ceeb3c1e`; 장면/선택 연속 번호, 내부 편집 메모 비포함, 포옹·숙박·solo 동의 경계를 자동 검사한다. DAY20은 여전히 **PARTIAL**이며 다음은 정확 라벨·반응 source registry와 경로별 reducer다.

14:12 DAY20 source registry 완료(9/5): 잠근 Markdown에서 24개 장면과 선택 블록 19개를 기계 생성하는 `generate-day20-v4-source-registry.mjs`를 추가했다. 대면 선택1~14, solo 대체5~8, 갈등 대체10을 같은 번호라도 variant로 분리하고 모든 라벨 3개를 원문 그대로 검증한다. 플레이어 대사·독백·연출은 exact source line reference로만 허용하는 검증기도 추가했다. DAY20은 **PARTIAL**, 다음은 이 registry를 소비하는 replay-locked reducer다.

14:28 DAY20 replay-locked reducer 완료(9/5): 대면 C1~14, solo 생활 대체 SCENE01/02/04→solo C5~8, 짧은 차 C1~3→C13 귀가, 남은 관계 공개 C5→conflict C10→귀가 진행표를 상태 계약에 구현했다. 포옹/손잡기 요청은 하은의 별도 접촉 응답 전에는 사실화하지 않고, 숙박 제안도 별도 수락·준비·잠자리 합의 전에는 `stayedOver`가 되지 않는다. 공개·짧은 차·solo는 친밀/숙박 단계에 진입하지 못하며 완료는 DAY19 hook만 소비하고 DAY21 hook을 연다. DAY20은 **PARTIAL**, 다음은 exact source 기반 opening/domestic playable과 bridge다.

14:41 DAY20 opening playable 완료(9/5): exact source ref만 사용해 SCENE01~04의 준비·부탁·도착·컵 선택과 선택별 반응을 구현했다. 실제 DAY19 `CUPS_TOGETHER` 이력이 있을 때만 `가장 다양한 분야`를 말하고, 없으면 일반 컵 질문을 사용한다. solo는 하은 도착/대사와 공동 컵을 만들지 않으며 원문의 SCENE01/02/04 생활 대체 후 바로 SCENE23 solo C5로 들어간다. 짧은 차는 C3 뒤 친밀 장면이 아니라 약속된 짧은 귀가 경계로 간다. DAY20은 **PARTIAL**, 다음은 domestic SCENE05~11과 solo C5~8다.

14:55 DAY20 domestic/solo playable 완료(9/5): exact source ref로 SCENE05~11의 주방 역할·포장·식사·정리·가만히 있기·각자 화면·남은 시간을 구현했다. 숙소 포장 농담은 실제 DAY19 여행 대화에만 나오고, 공개 C5는 SCENE08~18 없이 SCENE19로 간다. solo SCENE23~24와 C5~8도 구현해 연락 불가면 휴식 선택만 노출하고 하은 대사/메시지·공동 컵·포옹·숙박을 생성하지 않는다. DAY20은 **PARTIAL**, 다음은 intimacy/conflict/ending과 game bridge다.

15:08 DAY20 intimacy playable 완료(9/5): exact source ref로 SCENE12~18의 편한 옷·졸린 얼굴·접촉 요청·경로별 SCENE15·자리/다음 저녁·노래를 구현했다. 실제 대여 이력이 없어 옷을 바꾸지 않는 원문만 사용하고, C10 포옹/손잡기는 하은 응답 단계에서 멈춘다. 수락 기록 전 `firstHug`/`heldHands`와 접촉 반응은 비노출이며 현재 거리 선택도 완전한 장면으로 SCENE17에 이어진다. DAY20은 **PARTIAL**, 다음은 conflict/ending과 game bridge다.

15:20 DAY20 conflict/ending playable 완료(9/5): exact source ref로 SCENE19 갈등, SCENE20 밤 선택, SCENE21 귀가, SCENE22 준비된 숙박, SCENE24 후일담을 구현했다. 갈등 공개는 19→21→24로 닫히며, 숙박 제안은 하은 응답 전에 멈춘다. 거절은 21 귀가, 실제 준비와 잠자리 합의가 포함된 수락만 22/C14로 간다. 작별 포옹·다음 초대는 별도 현재 의사 기록이 없어 자동 생성하지 않는다. DAY20 플레이 원고 SCENE01~24는 구현됐지만 bridge/저장/브라우저 QA 전이므로 **PARTIAL**이다.

15:31 DAY20 game bridge core 완료(9/5): opening/domestic/intimacy/conflict/ending/solo 모듈을 현재 phase에 맞춰 이어 붙이고 내부 boundary를 모두 제거하는 독립 브리지를 구현했다. 선택과 접촉·숙박 응답은 실패 시 chapter 전체를 원자 복구하며, 중간 저장/로드 뒤 같은 다음 segment를 재현한다. 완료 history는 V4 facts/choices를 한 번만 저장하고 DAY19 hook을 소비해 DAY21 hook을 연다. `game.js` 입력/완료/스킵 연결과 실제 브라우저 QA 전이므로 DAY20은 **PARTIAL**이다.

20:30 DAY20 실제 게임 루프 연결(9/5): `day20-v4-game-bridge`를 `game.js`의 진입·재개·선택·하은의 접촉/숙박 응답·완료·SKIP 처리에 연결했다. SKIP도 별도 응답 단계를 건너뛰지 않는다. DAY19의 식사 비수락도 DAY20 slot에는 진입하되 `visitMode: SOLO`가 되어 하은 방문을 만들지 않는다. 숙박 수락은 앞선 `MUTUAL_MORE_TIME`과 `MUTUAL_SIMILAR_EVENING` 기록이 모두 있을 때만 별도 침구로 성립하고, V4 완료 뒤 legacy Free Action은 열리지 않는다. DAY19/20 집중 35개 테스트와 전체 100×30일 시뮬레이션 PASS. DAY20은 **PARTIAL**, 다음은 browser fixture와 데스크톱/389×844 비-SKIP 6경로 QA다.

20:47 DAY20 browser fixture 추가(9/5): 실제 DAY18·19 reducer와 완료 bridge로 face/short/solo/conflict/stay/leave 6개 DAY20 시작 상태를 만들고 사용자 저장 3개 키를 세션 단위로 백업·복원하는 `tests/day20-v4-browser-entry.html`을 추가했다. fixture 정적 검증과 DAY20 bridge 8개 테스트 PASS, 로컬 HTTP 200 확인. 다만 Codex 인앱 브라우저 webview가 숨김/표시 모드 모두 연결 제한시간을 넘겨 실제 비-SKIP 플레이는 이번 실행에서 시작하지 못했다. DAY20은 **PARTIAL**, 다음은 새 브라우저 세션에서 동일 fixture로 6경로 실제 QA다.

21:02 DAY20 6경로 bridge 행렬 QA(9/5): 브라우저 webview 새 세션 연결이 두 번째 실행에서도 실패해 실제 플레이는 보류하되, 동일 face/short/solo/conflict/stay/leave 경로를 DAY18→19→20 reducer와 실제 bridge·하은 응답 정책·완료 처리로 끝까지 재생하는 테스트를 추가했다. 6경로 장면 포함/배제, solo 하은 노출 0, short/conflict 친밀 장면 차단, 준비된 stay만 SCENE22 진입, history 1회 기록과 내부 문구 비노출을 포함한 DAY19/20 집중 42개 및 전체 100×30일 회귀 PASS. DAY20은 **PARTIAL**, 다음은 세 번째 새 브라우저 세션 재시도 후 가능 여부를 확정한다.

21:11 DAY20 실제 브라우저 QA 환경 차단 확정(9/5): 로컬 서버와 fixture는 세 실행 모두 HTTP 200이었으나 완전 초기화한 Codex 인앱 브라우저 세션도 세 번째로 webview 연결 제한시간을 넘겼다. 동일 자동 재시도는 중단한다. 사용자 측 Codex 앱 재시작 또는 fixture URL의 인앱 브라우저 1회 수동 열기가 필요하며, 탭 연결이 복구되면 준비된 6경로 비-SKIP QA부터 재개한다. 원본 관문을 우회하지 않으므로 DAY20은 **PARTIAL**, DAY21 착수는 보류한다.

00:01 DAY20 브라우저 QA 종결(9/6): 새 브라우저 런타임에서 연결이 복구되어 데스크톱과 실제 `innerWidth=389` 모바일의 face/short/solo/conflict/stay/leave 의미 경로를 실제 선택으로 SKIP 없이 DAY21까지 완주했다(`day20/DAY20_V4_BROWSER_QA_2026-09-05.md`). short/conflict 친밀 장면 차단, solo 하은 현장 노출 0, 준비된 stay만 SCENE22·별도 침구 진입, 일반 leave의 SCENE21 귀가를 확인했다. 모바일 모든 경로 최대 가로 넘침 0, console warning/error 0, 대표 C5 이후 새로고침·실제 이어하기의 Scene-start 복구, 표시 이미지 정상 로드, Story/Free 배타성, 사용자 저장 복원과 viewport reset PASS다. source/state/playable/bridge/저장/실제 브라우저 관문이 닫혀 DAY20을 **PASS / COMPLETE**로 승격한다. 다음은 **DAY21 최종 Notion 원문 잠금과 DAY18~20 실제 이력 감사**다.

00:14 DAY21 원문 잠금 시작(9/6): 최종 Notion V4 `3c9c31f0-29a6-8138-9d37-e5b6c8b74a32`의 플레이어 본문을 내부 편집 메모와 분리해 `docs/scenarios/DAY21_SCENARIO_V4_NOTION.md`에 잠갔다. 현재 fetch 기준 UTF-8 19,525자, 24 Scene, 주경로 16선택과 비대화 대체 5선택, SHA-256 `39797c3086e9e2f23c4fc4acc37c9fe1525816e74a21fd709b011a4fdbcb9589`다. 기존 `하루를 끝까지 일하는 법` 5장면·3선택 runtime은 최종 V4가 아니므로 legacy 보존 후 교체 대상으로 판정했다. DAY18~20 실제 숙박·접촉·컵·여행 후보·미완료 연락을 입력으로 삼는 계획을 작성했다(`day21/DAY21_V4_IMPLEMENTATION_PLAN_2026-09-06.md`). DAY21은 **PARTIAL**, 다음은 **source registry와 replay-locked entry contract**다.

00:20 DAY21 source registry 완료(9/6): 잠근 Markdown에서 24 Scene과 21개 선택 블록을 기계 생성하는 `generate-day21-v4-source-registry.mjs`를 추가했다. 주경로 C1~16과 이야기 연기 경로 C4~8을 `FACE_TO_FACE`/`DEFERRED` variant로 분리하고 모든 선택의 원문 라벨 3개와 exact source line을 검증한다. source lock/registry 6/6 PASS다. DAY21은 **PARTIAL**, 다음은 **DAY20 완료 이력과 DAY19 여행 후보를 고정하는 replay-locked state contract**다. 오늘 접촉·부산 실제 확정·공유 숙박 공간은 각각 별도 resolution 없이는 사실화하지 않는다.

00:25 DAY21 replay-locked 상태 계약 완료(9/6): 신규 `day21-notion-v4/1`은 검증된 DAY20 V4 완료 hook에서만 시작하고 기존 전일 근무 저장은 legacy로 보존한다. DAY20 실제 숙박/침구/컵/접촉/저녁과 DAY19 후보/미확정 예약/예산/연락을 input으로 동결했다. 연락 불가 C3은 대화 연기만 허용하고 대체 C4~8은 하은 이야기를 배우거나 여행·접촉을 만들지 않는다. 공원 C10 접촉, C13 공유 숙박 의사, 부산 확정은 각각 하은 응답과 날짜·이동·예산·숙박·상호 동의 resolution 전에는 사실화하지 않는다. 전체 선택·응답 replay 및 변조 롤백을 포함한 source/state 9/9 PASS다. DAY21은 **PARTIAL**, 다음은 **아침 SCENE01~04와 이야기 SCENE05~12 exact-source playable**이다.

00:42 DAY21 SCENE01~12 playable 완료(9/6): exact source ref만 사용하는 아침 SCENE01~04와 하은의 실제 하루를 듣는 SCENE05~12를 구현했다. 함께 숙박/귀가 메시지/혼자 아침 및 공원/전화/대화 연기를 분리했으며, 빌리지 않은 옷 반환·없던 숙박·영구 컵을 만들지 않는다. 전화는 음성 dialogue만 노출하고 하은 캐릭터 비주얼과 표정·손·공원 동작·접촉 stage를 차단한다. 연기 경로는 듣지 않은 점심·업무·분노·양말 이야기를 열지 않는다. source/state/인접 DAY19~20 포함 집중 회귀 18/18 PASS다. DAY21은 **PARTIAL**, 다음은 **SCENE13~24와 비대화 대체 playable**이다.

00:50 DAY21 SCENE13~16 playable 완료(9/6): C8 고마움과 현재 마음, C9 서로에게 남길 여지, C10 접촉 방식을 exact source ref로 구현했다. 공원 포옹/손잡기는 하은의 오늘 별도 응답을 기다리고 수락 뒤에만 사실화하며, 거절·거리 두기에는 접촉이 없다. 전화는 하은 현장 캐릭터·공원·표정·손 연출과 상상 포옹을 차단하고 음성 대화와 각자 창밖을 보는 원문 경로로 닫는다. DAY21 source/state/playable 집중 회귀 16/16 PASS다. DAY21은 **PARTIAL**, 다음은 **SCENE17~24 저녁·여행·ending과 비대화 대체 playable**이다.

01:02 DAY21 SCENE17~24 및 비대화 playable 완료(9/6): C11~16 저녁·여행·숙박·예약·준비·마지막 메시지·회상과 SCENE21 대화 연기 C4~8을 exact source ref로 구현했다. 부산은 별도 숙박 응답과 날짜·이동·예산·숙박·상호 동의 확인 뒤에만 예약·결제가 성립하고, 서울·미논의 경로는 가짜 예약 화면을 만들지 않는다. 실제 미룬 민호/미완료 연락이 없으면 해당 자기돌봄 선택을 숨기며, 무연락 경로는 하은 메시지와 듣지 않은 점심·분노·양말 회상을 생성하지 않는다. DAY21 및 인접 DAY19~20 집중 회귀 42/42 PASS다. DAY21 playable 원문 범위는 완료했으나 전체는 **PARTIAL**, 다음은 **V4 game bridge·저장·경제·실제 게임 루프 연결**이다.

01:12 DAY21 독립 game bridge 완료(9/6): 다섯 playable 모듈을 현재 phase에 맞춰 연결하고 내부 boundary를 실제 transition으로 변환했다. 아침·공원·통화·계획 화면·밤 presentation과 중간 SaveManager 복원을 지원한다. 부산 확정은 명시적 quote id·본인 부담액과 모든 확인 조건이 있어야 하며 본인 부담만 원장에 1회 기록한다. 실패는 chapter·돈·원장·구매 기록을 원자 롤백한다. 브리지 행렬 중 무연락 C3 이후 하은 메시지 누출도 발견해 차단했다. DAY21 bridge/playable/state/Story-Free 집중 회귀 31/31 PASS다. DAY21은 **PARTIAL**, 다음은 **runtime resolution과 `game.js` 진입·선택·응답·완료 연결**이다.

01:20 DAY21 실제 게임 루프 연결(9/6): runtime resolution과 `game.js`의 V4 진입·재개·선택·접촉/숙박/여행 응답·완료·SKIP·시계 처리를 연결했다. 관계 tone에 따른 하은의 별도 응답을 저장하고, 검증된 여행 quote가 없으면 부산 예약은 실패 폐쇄한다. quote가 있어도 본인 부담액만 차감한다. V4 선택은 legacy late expansion과 중복 기록하지 않고 V4 완료 뒤 전일 근무 Free Action을 열지 않으며, legacy 저장은 기존 경로를 유지한다. 관련 정적·동적 회귀 36/36 PASS다. DAY21은 **PARTIAL**, 다음은 **의미 경로 bridge 행렬과 실제 브라우저 fixture·비-SKIP QA**다.

01:33 DAY21 의미 경로 행렬·브라우저 fixture 완료(9/6): Friendly Busan, Neutral park, Mixed phone+Seoul, Distant deferred, rest+separate를 실제 bridge와 runtime resolution으로 끝까지 재생해 장면·인물·메시지·접촉·결제·회상 경계를 검증했다. 실제 DAY18→19→20 reducer/완료 bridge로 DAY21 시작 상태를 만들고 사용자 저장 3개 키를 세션 단위로 백업·복원하는 park/phone/deferred/Busan/Seoul/rest 6경로 브라우저 fixture도 추가했다. 부산 fixture는 명시적 QA 검증 견적의 본인 부담액만 포함한다. DAY21 집중 검증 41/41 PASS다. 실제 데스크톱·389×844 비-SKIP 플레이 전이므로 DAY21은 **PARTIAL**, 다음은 **동일 fixture의 실제 브라우저 6경로 QA**다.

01:48 DAY21 데스크톱 Friendly·Busan 브라우저 QA(9/6): 실제 DAY18→20 이력으로 만든 함께 잔 아침부터 공원 대화, 현재 포옹의 별도 응답, 여행 재논의, 부산 검증 견적, 공유 숙박의 별도 응답, 준비·짐·마지막 메시지를 16개 화면 선택으로 SKIP 없이 DAY22까지 완주했다(`day21/DAY21_V4_BROWSER_QA_2026-09-06.md`). Story/Free 배타성, 데스크톱 가로 넘침 0, console warning/error 0, 사용자 저장 복원 PASS다. 나머지 데스크톱 의미 경로와 389×844 모바일은 NOT RUN이므로 DAY21은 **PARTIAL**, 다음은 **Phone+Seoul 및 Deferred 데스크톱 비-SKIP 완주**다.

02:03 DAY21 데스크톱 Phone+Seoul·Deferred 브라우저 QA(9/6): Mixed 통화 경로에서 하은 현장 캐릭터와 이벤트 CG 비노출, C10 포옹 문장의 비접촉 처리, 서울 당일의 숙박·예약·결제 비생성을 확인하며 DAY22까지 완주했다. Distant 무연락 경로는 C3 연기 하나만 노출되고, 민호 미완료 연락 선택·하은 메시지·미청취 하루 이야기·접촉·예약 없이 SCENE21 대체 흐름으로 DAY22까지 완주했다(`day21/DAY21_V4_BROWSER_QA_2026-09-06.md`). 두 경로 모두 Story/Free 배타성, 1484px 데스크톱 가로 넘침 0, console warning/error 0, 사용자 저장 복원 PASS다. DAY21은 **PARTIAL**, 다음은 **Rest+separate와 Neutral park 데스크톱 비-SKIP 완주**다.

02:18 사용자 손 화풍 재신고 대응(9/6): 첨부 화면과 일치하는 DAY18 유리 물 장면의 전경 손·손목·소매 경계를 더 강한 애니메이션 외곽선과 분리된 2단 셀 명암으로 다시 편집한 v6를 만들었다. 런타임과 fixture 캐시 사슬을 `game.js?v=255` → bridge/playable v59 → v6로 갱신하고 배포 이력 v1~v5도 v6와 동일한 안전 비트맵으로 격리했다. DAY18 런타임 참조 이미지 31개를 재감사해 추가 혼합 화풍 FAIL은 발견하지 않았다. 사용자 재신고 시 같은 DAY 손 포함 자산 전수 감사를 다시 여는 규칙과 애니메이션 얼굴/실사형 손 혼합을 운영 차단 HIGH로 보는 규칙을 추가했다. 관련 회귀 67/67 PASS. 실제 배포 URL 확인 전이므로 이 수정은 브라우저 QA가 남아 있다.

02:27 DAY18 유리 물 v6 실제 브라우저 QA(9/6): 일반 fixture 진입과 CG 표시 중 새로고침→실제 이어하기 양쪽에서 승인 URL `yuri-menu-wait-water-v6.png`가 1672×941로 로드됐다. 실제 `contain` 화면에서 전경 손의 굵은 외곽선·평면 피부·분리 셀 명암을 유리 얼굴/손과 나란히 확인해 해부학/화풍 PASS, console warning/error 0, 사용자 저장 복원 PASS다. 로컬 런타임 재노출 관문은 닫혔다. 다음은 **DAY21 Rest+separate와 Neutral park 데스크톱 비-SKIP QA**다.

02:45 DAY21 데스크톱 의미 경로 QA 종결(9/6): Rest · separate에서 접촉 없이 여행 대화를 거쳐 별도 공간·준비 중단·휴식으로 닫아 공유 숙박·예약·결제가 생기지 않음을 확인했다. Neutral · park에서는 상대의 말할 범위와 현재 의사를 존중하고 접촉·여행 논의를 열지 않은 채 준비 원칙으로 DAY22까지 완주했다(`day21/DAY21_V4_BROWSER_QA_2026-09-06.md`). 두 경로 모두 실제 화면 선택으로 SKIP 없이 진행했고 Story/Free 배타성, `1484px` 가로 넘침 0, console warning/error 0, 사용자 저장 복원 PASS다. 데스크톱 의미 경로는 모두 닫혔다. DAY21은 모바일 관문이 남아 **PARTIAL**, 다음은 **389×844 Friendly/Neutral/Distant/Mixed 비-SKIP QA**다.

03:00 DAY21 모바일 Friendly·Distant 브라우저 QA(9/6): 브라우저 외곽 크기와 콘텐츠 viewport 차이를 보정해 실제 `innerWidth=389`, `innerHeight=844`에서 Friendly · Busan 16선택과 Distant · Deferred 대체 흐름을 각각 SKIP 없이 DAY22까지 완주했다(`day21/DAY21_V4_BROWSER_QA_2026-09-06.md`). 보정 전 Friendly 실행은 증거에서 제외하고 정확한 크기로 처음부터 재검증했다. 현재 접촉/공유 숙박 응답과 부산 검증 견적, 무연락 단일 C3 및 민호·미청취 이야기·가짜 메시지/예약/결제 비노출을 확인했다. 두 경로 모두 가로 넘침 0, Story/Free 배타성, console warning/error 0, 사용자 저장 복원과 viewport reset PASS다. DAY21은 **PARTIAL**, 다음은 **389×844 Neutral park와 Mixed Phone+Seoul 비-SKIP QA**다.

03:20 DAY21 모바일 QA 종결 및 완료 승격(9/6): 실제 `389×844`에서 Neutral · park와 Mixed · Phone · Seoul을 처음부터 DAY22까지 SKIP 없이 완주했다(`day21/DAY21_V4_BROWSER_QA_2026-09-06.md`). viewport가 풀린 Neutral 첫 실행은 증거에서 제외하고 정확한 크기로 다시 플레이했다. Neutral은 접촉·여행·숙박·결제를 만들지 않았고, Mixed 통화는 하은 현장 캐릭터/CG가 `hidden`·`display:none`·크기 0이며 서울 당일에 숙박 응답·예약·결제가 없음을 확인했다. 두 경로 모두 가로 넘침 0, Story/Free 배타성, console warning/error 0, 사용자 저장 복원과 viewport reset PASS다. DAY21 집중 회귀 40/40 및 전체 100회×30일 시뮬레이션 PASS. source/state/playable/bridge/저장/경제/실제 데스크톱·모바일 관문이 모두 닫혀 DAY21을 **PASS / COMPLETE**로 승격한다. 다음은 **DAY22 최종 Notion 원문 잠금과 DAY19~21 실제 이력 감사**다.

03:35 DAY22 원문 잠금 시작(9/6): Notion 최종 V4 `3c9c31f0-29a6-81f3-ba7f-eb07c6979d27`의 전체 응답 22,223자에서 플레이어 공개 본문과 내부 편집 메모를 분리해 `docs/scenarios/DAY22_SCENARIO_V4_NOTION.md`에 잠갔다. 로컬 snapshot은 마지막 빈 줄 포함 UTF-8 19,020자, 24 Scene, 대면 C1~17과 미여행 대체 C3~8, SHA-256 `9b63b8194229ef8ed290a51b45949cf5138175815a3d2f6e7d2a82b58f539383`다. 기존 `아무것도 증명하지 않는 날` 5장면·3선택 runtime은 최종 V4가 아니므로 legacy 보존 후 교체 대상으로 판정했다. DAY19~21 실제 여행 확정·예약·결제·숙박 공간·접촉·사진 교류를 입력으로 삼는 계획을 작성했다(`day22/DAY22_V4_IMPLEMENTATION_PLAN_2026-09-06.md`). DAY22는 **PARTIAL**, 다음은 **source registry와 exact-source validator**다.

03:42 DAY22 source registry 완료(9/6): 잠근 Markdown에서 24 Scene과 23개 선택 블록을 기계 생성하는 `generate-day22-v4-source-registry.mjs`를 추가했다. 대면 C1~17과 SCENE23 미여행 C3~8을 `TRAVEL`/`NO_TRAVEL` variant로 분리하고 모든 원문 라벨 3개, 연속 번호, snapshot SHA-256, exact source line을 검증한다. source 회귀 3/3 PASS다. DAY22는 **PARTIAL**, 다음은 **DAY19~21 실제 이력을 동결하는 replay-locked 상태 계약**이다.

03:55 DAY22 replay-locked 상태 계약 완료(9/6): 신규 `day22-notion-v4/1`을 검증된 DAY21 완료 hook에 연결하고, 기존 DAY22 진행 저장은 legacy로 보존했다. 부산은 실제 확정·5개 check·예약·결제·검증 견적이 모두 있어야 열리며 손상되면 미여행으로 닫힌다. 서울 당일과 미여행은 각각 숙박/부산 결제와 부산 장소·동행을 만들지 않는다. 사진 보관·삭제, 당일 접촉 응답, 잠깐 분리 후 실제 재회, DAY13 아라 사진 교류 자격을 독립 사실로 replay하며 변조 저장을 거부한다. DAY21 인접 회귀 포함 source/state 19/19 PASS다. DAY22는 **PARTIAL**, 다음은 **SCENE01~05/C1~3 및 SCENE23 미여행 C3~8 exact-source playable**이다.

04:12 DAY22 opening·미여행 playable 완료(9/6): SCENE01~05/C1~3을 부산·서울 exact-source 분기로 구현했다. 부산만 검증된 표·열차·부산역을 말하고 서울은 만남 장소·시내 이동·귀환 가능한 길만 사용한다. SCENE23/C3~8은 연락 불가 시 C6/하은 대사를 건너뛰며, 연락 가능 C6과 DAY13 실제 사진 교류가 있는 아라 선택만 각각 연다. 미여행에는 부산 표·음식·숙소·역의 하은을 만들지 않고 공통 SCENE24 경계로 넘긴다. source/state/opening/no-travel 14/14 PASS다. DAY22는 **PARTIAL**, 다음은 **SCENE06~10/C4~6 식사·속도·풍경 사진 playable**이다.

04:25 DAY22 식사·속도·풍경 사진 playable 완료(9/6): SCENE06~10/C4~6을 exact-source로 구현했다. 부산/서울의 실제 식당과 풍경 위치를 분리하고, 식사 사진에 하은 얼굴을 자동 포함하지 않는다. C5 잠깐 따로 보기는 찾기 쉬운 장소·시간·연락 상태만 기록하며 C6 완료 뒤 SCENE10에서만 실제 재회한다. 함께 쉬는 경로는 하은을 유지하고 따로 보는 풍경에서는 제거했으며, DAY13 실제 사진 교류가 없으면 아라 전송 선택을 노출하지 않는다. DAY22 source/state/playable 17/17 PASS다. DAY22는 **PARTIAL**, 다음은 **SCENE11~14/C7~10 카페·공동 사진·기대 조정 playable**이다.

04:38 DAY22 카페·공동 사진·기대 조정 playable 완료(9/6): SCENE11~14/C7~10을 exact-source로 구현했다. 부산 마린뷰 카페와 서울의 실제 카페 차이를 분리하고, C7 대기에는 상한을 둔다. SCENE12 촬영 동의와 C8 보관 동의를 분리해 남기기/재촬영은 별도 응답 후에만 보관하며 거절·중단은 삭제로 고정했다. SCENE13은 삭제 사진을 재표시하지 않고, 서울 경로의 부산 바다 회상을 source-directed 산책으로 제한했다. DAY22 source/state/playable 20/20 PASS다. DAY22는 **PARTIAL**, 다음은 **SCENE15~21/C11~16 숙소·사생활·현재 접촉·밤 식사 playable**이다.

04:54 DAY22 숙소·사생활·현재 접촉·밤 식사 playable 완료(9/6): SCENE15~21/C11~16을 exact-source로 구현했다. DAY21 실제 공유 숙소 합의가 있는 부산에서만 공유 공간·보이는 편한 차림·C14 물리 접촉을 열고, 부산 별실과 서울은 얼굴 칭찬·포옹·손잡기를 제거했다. 공유 공간도 현재 `contactConsentCue` 응답 전에는 접촉하지 않으며 거절은 `NONE`으로 남긴다. 별실은 각자 방 인사로, 서울은 숙소와 SCENE21 없이 SCENE22 귀가로 연결된다. source/state/playable 24/24 PASS다. DAY22는 **PARTIAL**, 다음은 **SCENE22/C17 서울 귀가와 SCENE24 공통 ending playable**이다.

05:08 DAY22 서울 귀가·공통 ending playable 완료(9/6): SCENE22/C17과 SCENE24를 구현해 24 Scene 및 여행 C1~17·미여행 C3~8의 exact-source playable을 모두 닫았다. 서울만 C17 뒤 각자 집으로 돌아가고, 부산은 실제 예약 공간, 미여행은 익숙한 방·자기 속도만 회수한다. 삭제된 공동 사진은 C17에서 되살리지 않고 풍경/실제 기억으로 대체하며, 미완료 phase에는 completion cue가 없다. DAY22 source/state/playable 28/28 PASS다. DAY22는 **PARTIAL**, 다음은 **V4 game bridge·저장 재개·resolution·Story/Free·presentation·경제 회귀 연결**이다.

05:25 DAY22 V4 game bridge 연결(9/6): 여섯 playable 모듈을 실제 Story 루프에 연결하고 DAY22 선택·사진 보관·현재 접촉 응답·SCENE24 완료·시계·재개 presentation을 `game.js`에 추가했다. 부산 지도 배경 4종과 숙소 대체 자산을 manifest에 등록했다. 신규 V4/legacy 진입을 분리하고 V4 완료 뒤 legacy Free Action을 차단했다. 선택·응답 실패는 원자 복원되며 SaveManager 중간 저장 왕복 뒤 동일 segment/presentation을 재생한다. DAY21 여행비는 읽기 전용으로 이어받아 DAY22 돈·원장을 바꾸지 않는다. source/state/playable/bridge 36/36 PASS다. DAY22는 **PARTIAL**, 다음은 **실제 브라우저 fixture와 데스크톱 Friendly 부산 공유 숙소 비-SKIP 완주**다.

05:46 손 화풍 재신고 수정(9/6): DAY18 유리 물 장면을 v7로 다시 편집해 손바닥의 과대 원근과 평면 벡터 스티커감을 함께 줄였다. 같은 DAY 고위험 POV를 원본 크기로 재감사해 음식 나누기·맛보기·각자 식사·자리 만들기·채소 한입 5장도 새 애니메이션 손 승인본으로 교체하고 모든 과거 URL을 최신 비트맵과 바이트 동일하게 격리했다. 이미지 지침에는 평면 벡터도 FAIL, 불필요한 POV 손 금지, 과대 원근 FAIL, 2회 재신고 시 손 제거 대안 비교를 추가했다. DAY18 집중 74/74와 전체 30일 시뮬레이션 PASS, 실제 브라우저 SKIP 없는 집중 경로 및 사용자 저장 복원 PASS다. 캐시 사슬은 game257/bridge61/playable61이다. DAY22는 기존 **PARTIAL** 상태를 유지하고 다음 작업은 DAY22 실제 브라우저 완주다.

06:12 DAY22 Friendly·부산·공유 숙소 데스크톱 QA(9/6): 실제 DAY18→21 production 이력을 완주해 DAY22를 시작했고, 짐·동선·식사·속도·풍경 사진·공동 사진·기대 조정·공유 숙소·현재 포옹·밤 식사를 실제 선택으로 DAY23까지 SKIP 없이 완주했다(`day22/DAY22_V4_BROWSER_QA_2026-09-06.md`). 첫 실행에서 manifest 캐시 불일치로 `DAY22_BACKGROUND_MISSING:day22-busan-station` HIGH를 발견해 game/bridge를 동일한 asset manifest v24로 고정하고 재실행 PASS했다. 사용자 저장 복원과 Story/Free 배타성도 PASS다. DAY22는 나머지 데스크톱·모바일 의미 경로가 남아 **PARTIAL**, 다음은 **부산 별실과 서울 당일 데스크톱 비-SKIP QA**다.

06:35 DAY22 부산 별실·서울 당일 데스크톱 QA(9/6): 실제 DAY18→21 이력으로 만든 Neutral 부산 별실과 Mixed 서울 당일을 각각 실제 화면에서 DAY23까지 SKIP 없이 완주했다(`day22/DAY22_V4_BROWSER_QA_2026-09-06.md`). 별실의 인물·침대·얼굴 칭찬·물리 접촉 차단과 서울의 부산 장소·숙박·결제·접촉 차단을 확인했다. 플레이 중 원문에 포함된 `~라면`, `~경로에서는`, `장면이 생기지 않았다`, `묘사하지 않았다` 같은 분기 설명이 일반 독백에 노출되는 HIGH를 발견해, 경로를 먼저 결정하고 실제 일어난 사실만 source-grounded projection으로 출력하도록 opening/meal/cafe/evening/ending을 수정했다. 서울 C16 직전 새로고침→이어하기와 사용자 저장 복원 PASS다. DAY22는 미여행·거절·모바일 관문이 남아 **PARTIAL**, 다음은 **연락 가능/불가 미여행 데스크톱 비-SKIP QA**다.

06:55 DAY22 연락 가능/불가 미여행 데스크톱 QA(9/6): 실제 DAY18→21 production 이력으로 만든 두 미여행 경로를 실제 화면에서 DAY23까지 SKIP 없이 완주했다(`day22/DAY22_V4_BROWSER_QA_2026-09-06.md`). 연락 가능 경로는 C5 하은 전송 뒤에만 전송 사실과 C6·하은 대화를 열었고, 연락 불가 경로는 C5 앨범 단일 선택 뒤 C6을 생략해 하은 인물·대사를 만들지 않았다. 미여행 C3~8에 남은 `~고르면`, `~라면`, `상대가 없는 경우` 식 분기 설명을 확정된 선택 사실형 source-grounded projection으로 교체했다. 실제 전송도 항상 `photoMessageSent=false`였던 replay 오류를 함께 수정해 앨범만 false, 하은/교류 상대 전송은 true로 고정했다. 두 경로의 DAY23 진입과 사용자 저장 복원 PASS다. DAY22는 **PARTIAL**, 다음은 **사진 보관 거절·공유 숙소 접촉 거절 데스크톱 QA와 389×844 의미 경로 QA**다.

07:20 DAY22 사진·접촉 거절 데스크톱 QA(9/6): Difficult 서울 공동 사진 보관 거절과 Friendly 부산 공유 숙소 손잡기 거절을 실제 DAY18→21 이력에서 시작해 DAY23까지 SKIP 없이 완주했다(`day22/DAY22_V4_BROWSER_QA_2026-09-06.md`). 삭제 사진은 C9~17/SCENE24에서 되살아나지 않았고 손잡기는 동일 접촉의 실제 이전 동의가 없어 `todayContact=NONE`으로 닫혔다. 실행 중 공유 숙소의 양쪽 방 설명과 C14 전 조건부 접촉, 식사 전 가능성 설명이 일반 독백으로 노출되는 HIGH를 발견해 확정 사실형 projection으로 수정했다. 재실행 대화 로그에서 접촉 전 비접촉 선언과 거절 존중 반응, 완료 저장의 `error=null/complete=true/day=23`을 확인하고 사용자 저장을 복원했다. DAY22는 **PARTIAL**, 다음은 **389×844 Friendly/Neutral/Distant/Mixed 모바일 의미 경로 QA**다.

07:50 DAY22 모바일 QA 종결 및 완료 승격(9/6): 브라우저 외곽과 콘텐츠 viewport 차이를 보정해 실제 `innerWidth=389`, `innerHeight=844`에서 Friendly 부산 공유 숙소, Neutral 부산 별실, Distant 미여행 연락 불가, Mixed 서울 당일을 노출 선택지로 각각 DAY23까지 SKIP 없이 완주했다(`day22/DAY22_V4_BROWSER_QA_2026-09-06.md`). 경로별 공유/별실 숙박, 연락 불가 미여행의 C6·하은 비노출, 서울 당일의 부산·숙박·접촉 비생성을 확인했다. 네 경로 모두 `scrollWidth=clientWidth=389`, Story/Free 배타성, console warning/error 0, 사용자 저장 복원과 viewport reset PASS다. DAY22를 **PASS / COMPLETE**로 승격한다. 다음은 **DAY23 최종 Notion 원문 잠금과 DAY20~22 실제 이력 감사**다.

08:05 DAY23 원문 잠금·이력 감사 시작(9/6): Notion 최종 V4 `3c9c31f0-29a6-814b-b599-e8b6ed6f23a6`에서 플레이어 공개 본문만 `docs/scenarios/DAY23_SCENARIO_V4_NOTION.md`로 잠갔다. snapshot은 UTF-8 18,452자, 24 Scene, 대면 C1~17·미여행 C3~8과 C14 두 variant, SHA-256 `d0abf2a4f1ead70b38eb6429ca12df49def0ecc699e499cb35e6dd0327641055`다. 기존 가족 연락 5장면·3선택 runtime은 최종 V4가 아니므로 legacy 보존 후 교체 대상으로 판정했다. DAY20~22의 실제 숙박 공간·여행/귀환·사진 보관/삭제·접촉·연락·관계 tone과 미완료 연락만 입력으로 사용하는 구현 계획을 작성했다(`day23/DAY23_V4_IMPLEMENTATION_PLAN_2026-09-06.md`). DAY23은 **PARTIAL**, 다음은 **source registry와 exact-source validator**다.

08:15 DAY23 source registry 완료(9/6): 잠근 Notion snapshot에서 24 Scene과 24 선택 블록을 기계 생성했다. 공통 MAIN C1~17, 실제 정리할 연락이 없는 SCENE17 C14, 미여행 SCENE21 C3~8을 별도 variant로 분리하고 각 선택의 원문 라벨 3개, 연속 번호, snapshot SHA-256, exact player-facing source line을 검증한다. DAY23 source 회귀를 추가했으며 DAY23은 **PARTIAL**, 다음은 **DAY20~22 실제 이력 replay-locked 상태 계약**이다.

08:30 DAY23 replay-locked 상태 계약 완료(9/6): 검증된 DAY21/22 V4 완료와 DAY23 hook에서만 신규 schema를 시작하고 기존 가족 연락 저장은 legacy로 보존했다. DAY22 경로로부터 부산 공유/별실·서울 귀가 후·미여행 아침을 구분하고, DAY20 접촉/숙박, DAY21 미완료 연락, DAY22 이동·사진 보관/삭제·연락·관계 tone을 immutable input으로 동결했다. 공동 얼굴 사진, 기념품 구매, 하은의 현재 관계 응답, 미여행 만남, DAY24 대화 합의는 각각 별도 resolution 전에는 사실화하지 않는다. MAIN C1~17, 미완료 연락 없음 C14, 미여행 C3~8을 전체 replay해 변조 저장을 거부하고 완료 때만 DAY24 hook을 연다. DAY23 state 회귀 6/6 PASS이며 DAY23은 **PARTIAL**, 다음은 **SCENE01~07/C1~6 및 SCENE21 미여행 playable**이다.

08:45 DAY23 첫 playable 구간 완료(9/6): SCENE01~07/C1~6 아침·남은 일정·사진·기념과 SCENE21/C3~8 미여행 경로를 exact source ref로 구현했다. 부산 공유 숙소의 커튼·잠든 모습·컵은 실제 공유 이력에서만 나오며 별실은 별실 사실만, 서울 귀가 후에는 숙소·부산·귀환 이동을 만들지 않는다. 공동 얼굴 사진, 기념품 구매, 미여행 만남은 별도 현재 응답 뒤에만 확정하고, 연락 불가 미여행은 하은 대화·여행 추억·가짜 관계 정리를 만들지 않는다. 집중 playable 9/9 PASS이며 DAY23은 **PARTIAL**, 다음은 **SCENE08~12/C7~10 귀환·집 상상·관계 의사·역 작별 playable**이다.

09:05 DAY23 귀환·작별 playable 완료(9/6): SCENE08~12/C7~10을 부산 귀환과 서울 이미 귀가 경로로 분리해 exact source ref로 구현했다. 실제 보존 사진과 오늘 현재 동의된 공동 사진만 C7에서 열 수 있고 삭제 사진은 되살리지 않는다. C9 주인공 의사 뒤 하은의 현재 독립 응답을 별도 resolution으로 받으며, 부산의 짧은 작별 포옹은 CALM·실제 이전 포옹·현재 관계 지속 응답이 있어도 다시 현재 상호 동의를 받아야 한다. 거절은 손 인사로 닫고 서울은 기차·역·작별·접촉을 재생하지 않는다. DAY23 source/state/playable 23/23 PASS이며 DAY23은 **PARTIAL**, 다음은 **SCENE13~17/C11~14 집 생활·작은 연락·사진·남은 관계 playable**이다.

09:20 DAY23 집 생활·남은 관계 playable 완료(9/6): SCENE13~17/C11~14를 exact source ref로 구현했다. 부산 귀환만 가방을 풀고 서울은 이미 귀가한 방의 평소 물건을 정리한다. C12 하은/지훈은 실제 연락 가능성으로 필터링하며 지훈에게 연애 전체를 자동 보고하지 않는다. C13은 보존된 풍경·공동 사진만 사용하고 얼굴 없는 사진에 하은 얼굴 대사를 붙이지 않는다. C14는 DAY21에서 이월된 실제 유리·서진·아라 대화만 목록과 수신자로 사용하고, 아무 연락도 남지 않았으면 SCENE17 자기 마음 variant로 이동해 새 유혹이나 이별 문자를 만들지 않는다. 집중 home/state 11/11 PASS이며 DAY23은 **PARTIAL**, 다음은 **SCENE18~24/C15~17 저녁 통화·DAY24 대화 합의·ending playable**이다.

09:35 DAY23 playable 전체 완료(9/6): SCENE18~24/C15~17 저녁 통화·DAY24 대화 합의·ending을 exact source ref로 구현해 SCENE01~24, MAIN C1~17, 미여행 C3~8 전체 playable을 닫았다. SCENE19는 CALM·관계 지속 응답에서만 열고, 어려운 관계·추가 대화 필요 경로는 SCENE20으로 직행한다. 서울은 오늘 대면하지 않은 사실을 말하고 부산 전용 “아까까지 봤는데”를 쓰지 않는다. C17의 만남/전화/가능한 때는 별도 현재 수락 뒤에만 DAY24 hook으로 남는다. 미여행 연락 불가 ending은 하은 통화·여행 가방·기념품을 출력하지 않는다. 집중 ending/state 11/11 PASS이며 DAY23은 **PARTIAL**, 다음은 **game bridge·저장 재개·현재 응답·선택 지출·시간/장소/인물 presentation 연결**이다.

09:50 DAY23 game bridge 기반 완료(9/6): 다섯 playable 모듈을 하나의 브리지로 연결하고 사진·기념품·관계·작별 접촉·미여행 만남·DAY24 대화의 runtime resolution을 구현했다. 부산의 실제 작은 기념품만 3,000원 결제하며 chapter·money·ledger·구매 기록은 실패 시 함께 원자 복원되고 중복 결제되지 않는다. 부산·서울·미여행의 시간·장소·인물 presentation과 SaveManager 중간 저장 왕복, 완료 이력 단일 기록과 DAY24 hook을 검증했다. 브리지 경로 테스트에서 미여행 일반 독백에 남은 “하은이 쓰지 않은 컵”, “합의하지 않은 하은” 부재 설명을 발견해 실제 컵·휴식·내 일정 사실형 문장으로 교체했다. DAY23 bridge/source/state/playable 40/40 PASS이며 DAY23은 **PARTIAL**, 다음은 **`game.js` 실제 Story 루프 연결과 Story/Free 배타성**이다.

10:05 DAY23 실제 Story 루프 연결 완료(9/6): 검증된 DAY22 V4 완료만 신규 DAY23 V4로 진입하도록 `game.js`에 bridge를 연결하고 legacy DAY23 저장은 기존 경로로 보존했다. 원문 선택 제목·선택별 segment·여섯 현재 응답·저장 재개 presentation·시계·장소·인물·SCENE24 완료·DAY24 hook을 실제 진행 경로에 반영했다. V4 진행·완료 중에는 legacy Free Action과 오래된 Free Resume가 끼어들지 않으며 선택·응답·완료 실패의 원자 복원 규칙을 유지한다. 로더 캐시는 `game.js?v=265`로 갱신했다. DAY22~23 집중 회귀 78/78 PASS이며 DAY23은 **PARTIAL**, 다음은 **전체 회귀와 실제 브라우저 fixture·데스크톱 Friendly 부산 공유 숙소 비-SKIP 완주**다.

10:40 DAY18 유리 물잔 손 v8 재교정(9/6): 사용자 재신고 원본을 직접 편집해 전경 주인공 손·손목·소매만 유리의 손·얼굴과 같은 애니메이션 선화·단순 관절·2~3단 셀 명암으로 교체했다. 새 v8을 런타임에 연결하고 배포 이력 v1~v7도 동일 비트맵으로 격리했으며 캐시 사슬을 `game.js?v=266` → bridge/playable v62로 올렸다. 큰 POV 손과 애니메이션 캐릭터가 함께 보이는 구도를 기본 불합격으로 시작하는 규칙 23도 추가했다. DAY18 집중 회귀 102/102 PASS, 실제 브라우저 fixture 비-SKIP cue 통과·v8 원본 렌더·사용자 저장 복원 PASS다. 다음 스토리 시작점은 그대로 **DAY23 Friendly 부산 공유 숙소 데스크톱 비-SKIP QA**다.

11:05 DAY23 Friendly 부산 공유 숙소 데스크톱 QA(9/6): 실제 브라우저에서 아침 SCENE01부터 C1~C17을 모두 노출 선택지로 직접 선택해 SKIP 없이 DAY24까지 완주했다(`day23/DAY23_V4_BROWSER_QA_2026-09-06.md`). 원문 선택 제목, 09:00/15:00/19:00/22:00 presentation, 공동 얼굴 사진·관계 지속·작별 접촉·다음 대화 별도 현재 응답, 기념품 3,000원 단일 결제를 확인했다. 완료 저장은 `error=null/complete=true/day=24/day24Hook=true/freeAction=null`이며 사용자 저장을 복원했다. DAY23은 **PARTIAL**, 다음은 **Neutral 부산 별실과 Mixed 서울 당일 데스크톱 비-SKIP QA**다.

11:31 DAY23 분기 서술 교정 및 데스크톱 추가 QA(9/6): 부산 별실 첫 장면에서 `그녀의 커튼과 잠든 모습은 보지 못했다.`라는 분기 설명이 일반 독백으로 노출되는 HIGH를 발견했다. 부재 설명과 서울 경로의 `기차처럼 꾸미지 않았다`류 구현 문장을 현재 행동·관찰로 교체하고 cache를 game267/bridge·playable v2로 올렸다. Neutral 부산 별실과 Mixed 서울 당일을 C1~C17 직접 선택으로 SKIP 없이 DAY24까지 완주했고 사용자 저장을 복원했다. DAY22/23 집중 79/79와 전체 시뮬레이션 PASS. DAY23은 **PARTIAL**, 다음은 미여행·거절·모바일 QA다.

11:48 DAY23 최종 브라우저 QA 및 종결(9/6): 미여행 연락 가능/불가를 C1~C8로 SKIP 없이 DAY24까지 완주했다. Distant 미여행과 별도 DIFFICULT 부산 별실 거절 fixture를 유효 `389×844`에서 검증했다. 거절 경로는 `photoKept=false`, `relationshipOutcome=UNSURE`, `farewellContact=NONE`, `nextConversation=MEET`로 완료되어 거절을 수락·접촉으로 바꾸지 않았다. 모바일 가로 넘침 0, console warning/error 0, 사용자 저장과 viewport 복원 PASS(`day23/DAY23_V4_BROWSER_QA_2026-09-06.md`). source/state/playable/bridge/저장/Story-Free/데스크톱·모바일 의미 경로가 닫혀 DAY23을 **PASS / COMPLETE**로 승격한다. 다음은 **DAY24 최종 원문 잠금과 DAY21~23 실제 이력 감사**다.

12:05 DAY24 최종 원문 검증·구현 계획(9/6): Notion 최종 V4 `3c9c31f0-29a6-811e-9af0-cedccb66d1cf`의 17,546자 응답에서 24 Scene, 공통 C1~15와 유리·서진·아라/연락 없음 대체 선택을 확인했다. 현재 `약속을 다시 선택하는 날` 1장면·3선택 runtime은 최종 V4가 아니므로 legacy 보존 후 교체 대상으로 판정했다. 검증된 DAY23 대화 합의, 주인공 관계 의사와 하은의 독립 응답, 실제 미완료 연락·거짓말·지훈 가능성만 입력으로 삼고 지속/유예/종료, 조건부 새 만남, DAY25 후속 대화를 분리하는 구현 계획을 작성했다(`day24/DAY24_V4_IMPLEMENTATION_PLAN_2026-09-06.md`). DAY24는 **PARTIAL**, 다음은 **플레이어 공개 원문 snapshot 잠금과 source registry/exact-source validator**다.

12:20 DAY24 원문 잠금·source registry 완료(9/6): Notion 최종 V4에서 내부 편집 메모와 대체 V3를 제외한 플레이어 공개 본문을 `docs/scenarios/DAY24_SCENARIO_V4_NOTION.md`로 잠갔다. snapshot은 UTF-8 17,656자, 24 Scene, 20 choice block, SHA-256 `c0a59b11ceffa729a15b07da81a1ee7604035698406bba31ddf263a6debb2032`다. 기계 생성 registry는 공통 C1~8/C15, 유리·서진·아라 C9, 관계 미종료 C10, 연락 없음 C9~10, 지속/유예·종료 C11, 지훈 C12, 새 만남 C13, 지속 C14를 별도 variant로 고정하고 모든 원문 라벨 3개와 exact source line을 검증한다. source 회귀 3/3 PASS. DAY24는 **PARTIAL**, 다음은 **DAY21~23 실제 이력 replay-locked 상태 계약**이다.

12:40 DAY24 replay-locked 상태 계약 완료(9/6): 검증된 DAY21~23 V4 완료와 DAY24 hook에서만 신규 `day24-notion-v4/1`을 시작하고 기존 결혼 동의 저장은 legacy로 보존했다. DAY23의 실제 대화 합의·관계 의사와 하은 응답·미완료 유리/서진/아라 연락·사진/접촉·지훈 가능성을 immutable input으로 동결했다. 오늘 대화 성사, C6 하은의 독립 관계 응답, 수신자별 연락, 관계 상태 거짓말의 발화/정정, 상대의 새 만남 수락, 지훈 통화, C14 하은의 다음 대화 수락을 별도 resolution으로 두었다. 관계가 실제 끝나고 상대가 현재 수락한 경우에만 C13 새 만남을 열며 거짓말은 하은에게 자동 폭로하지 않는다. source/state 9/9 PASS. DAY24는 **PARTIAL**, 다음은 **SCENE01~10/C1~7 exact-source playable**이다.

13:05 DAY24 관계 대화 playable 완료(9/6): SCENE01~10/C1~7의 시작 문장·기다림·현재 마음·이유·기다림 경계·최종 관계 제안·대화 뒤 짧은 시간을 exact source로 구현했다. C2 뒤 실제 현재 응답을 받아 대면/통화/오늘 거절을 분리하고, 대면만 카페 인물·컵·의자 동작을 사용한다. 통화는 하은 현장 인물·카페·물리 컵 동작을 만들지 않으며 오늘 거절과 이미 끝난 관계는 집 앞 방문이나 가짜 대화를 만들지 않는다. C6의 하은 독립 응답 전에는 관계 결과를 확정하지 않고, 유예·종료 및 통화에서는 산책을 노출하지 않는다. opening/relationship/state 13/13 PASS. DAY24는 **PARTIAL**, 다음은 **SCENE11~17 수신자별 연락·truth/lie·연락 없음 playable**이다.

13:25 DAY24 실제 연락 playable 완료(9/6): SCENE11~17/C8~10을 exact source로 구현했다. DAY23에서 실제 남은 첫 수신자만 열고 유리·서진·아라 C9를 서로 배타적으로 출력하며, 단순 업무/사진 교류를 새 고백으로 만들지 않는다. 관계 미종료 상태의 개인 관심만 SCENE16 C10으로 보내고 `지금은 혼자야` 뒤 직접 재질문에는 사실 정정/거짓 지속을 별도 cue로 받아 수신자·발화·정정 여부를 남긴다. 거짓은 하은에게 자동 폭로하지 않는다. 관계 실제 종료+C8 종료 공개+적격 관심+상대 현재 수락을 모두 만족해야만 새 만남을 열며, 연락 없음은 나리의 업무 명함을 로맨스로 바꾸지 않고 SCENE17 대체 C9~10을 사용한다. contacts/state 11/11 PASS. DAY24는 **PARTIAL**, 다음은 **SCENE18~24 ending playable**이다.

13:45 DAY24 ending playable 완료(9/6): SCENE18~24/C11~15를 exact source로 구현했다. 상호 지속은 하은과의 국 대화와 C14 미래 대화 제안·별도 현재 응답으로 이어지고, 유예·종료는 혼자 저녁에서 실제 가능할 때만 지훈에게 연락한다. 새 만남은 관계 실제 종료와 기존 연락 상대의 현재 수락이 모두 있어야 C13을 열며 새 연애 보상으로 확정하지 않는다. SCENE23 자기 밤 과제와 SCENE24는 실제 지속·유예·종료·거짓말 결과 하나만 투영하고, 거짓은 하은에게 자동 폭로하지 않는다. ending/state 11/11 PASS. DAY24는 **PARTIAL**, 다음은 **game bridge·저장 재개·현재 응답·presentation·Story/Free 배타성 연결**이다.

14:00 DAY24 game bridge 기반 완료(9/6): 네 playable 모듈을 하나의 브리지로 연결하고 대화 성사·하은 관계 응답·관계 상태 거짓 정정·실제 타인 연락·하은 미래 대화의 runtime resolution을 각각 분리했다. 선택·응답 실패는 DAY24 chapter 전체를 원자 복원하며, 김밥마을 낮 원본 배경을 manifest에 추가해 저녁 변형을 오전 식사에 재사용하지 않는다. 시간·장소·인물 presentation, SaveManager 중간 저장 왕복, 완료 이력 단일 기록과 DAY25 hook을 검증했다. bridge 6/6 PASS. DAY24는 **PARTIAL**, 다음은 **`game.js` 실제 Story 루프 연결과 Story/Free 배타성**이다.

14:15 DAY24 실제 Story 루프 연결 완료(9/6): 검증된 DAY23 V4 완료만 신규 DAY24 V4로 진입하도록 `game.js`에 bridge를 연결하고 legacy DAY24 저장은 기존 경로로 보존했다. 원문 선택·다섯 현재 응답·완료 cue·저장 재개 presentation·시계·장소·인물을 실제 진행에 반영했다. V4 진행·완료 중에는 legacy DAY24 Free Action과 과거 Free Resume가 끼어들지 않으며 최상위 캐시는 `game.js?v=268`로 갱신했다. bridge/runtime 연결 7/7 PASS. DAY24는 **PARTIAL**, 다음은 **DAY21~24 집중 회귀와 실제 브라우저 Friendly 대면 지속 비-SKIP QA**다.

15:20 DAY18 유리 물잔 반복 손 재신고 구조 교정(9/6): 큰 POV 손을 재스타일링하는 방식이 반복 실패했으므로 전경 손·손목·소매를 완전히 제거한 v9으로 교체했다. 물을 마신 직전 행동은 테이블 위 물잔과 잔잔한 물결로 전달하고 유리·식당·메뉴·조명은 보존했다. 배포 이력 v1~v8도 v9과 바이트 동일하게 격리했으며 캐시 사슬을 `game.js?v=269` → bridge/playable v63으로 갱신했다. 이미지 지침에는 반복 재신고이면서 손이 비필수인 장면은 `전경 인체 부위 0개`로 전환하는 규칙 24를 추가했다. 집중/전체 자동 회귀 PASS, 실제 브라우저 일반 진입·새로고침 후 이어하기에서 v9 1672×941 직접 로드와 사용자 저장 복원 PASS다.

14:30 DAY24 Friendly 대면·지속 데스크톱 QA(9/6): 검증된 DAY22 Friendly 부산 공유 숙소 fixture에서 DAY23의 18개 선택과 DAY24의 14개 선택을 실제 화면 첫 선택으로 이어서 눌러 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). DAY24 `09:00/15:00/19:00`과 DAY25 `08:00` 전환, 대면·관계 지속·미래 대화 별도 수락을 확인했다. 완료 저장은 `error=null/complete=true/conversation=MEET/relationship=CONTINUE/futureAccepted=true/day25Route=HAEUN_FUTURE/day=25/day25Hook=true/freeAction=null`, console warning/error 0, 사용자 저장 복원 PASS다. 브라우저 fixture helper의 `node:assert` 의존도 제거했다. DAY24는 **PARTIAL**, 다음은 **Neutral 통화 유예·Distant 오늘 거절/종료·연락/거짓말/새 만남 및 389×844 QA**다.

14:45 DAY24 Neutral 통화·유예 데스크톱 QA(9/6): 부산 별실 fixture에서 DAY23 C9 `마음을 조금 더 이야기`, C17 `전화로 먼저`를 포함한 18개 선택을 실제 화면에서 진행하고, DAY24 C3 `아직 대답 못 한 마음`, C6 `시간이 더 필요`를 선택해 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). 카페 대면을 만들지 않은 통화 흐름과 유예 결말을 확인했다. 완료 저장은 `error=null/complete=true/conversation=PHONE/relationship=DEFER/futureAccepted=false/day25Route=DEFERRED_RELATIONSHIP/day=25/day25Hook=true/freeAction=null`, browser warning/error 0, 사용자 저장 복원 PASS다. DAY24는 **PARTIAL**, 다음은 **Distant 오늘 거절/종료·연락/거짓말/새 만남 및 389×844 QA**다.

15:00 DAY24 Distant 연락 불가·기종료 데스크톱 QA(9/6): 관계와 연락이 이미 끝난 미여행 fixture에서 DAY23 C1~8과 DAY24의 실제 노출 선택 7개를 실제 화면으로 눌러 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). 하은의 메시지·대면·통화나 새 현재 관계 응답을 만들지 않았고, 완료 저장은 `error=null/complete=true/conversation=null/relationship=null/futureAccepted=false/day25Route=RELATIONSHIP_ENDED/day=25/day25Hook=true/freeAction=null`, browser warning/error 0, 사용자 저장 복원 PASS다. DAY24는 **PARTIAL**, 다음은 **활성 관계의 명시적 종료·연락/거짓말/새 만남 및 389×844 QA**다.

15:15 DAY24 Distant 활성 관계 명시적 종료 데스크톱 QA(9/6): 연락 가능한 DIFFICULT 부산 별실 이력에서 DAY23을 완주해 `relationshipOutcome=UNSURE/nextConversation=MEET`를 만들고, DAY24 C6 `여기서 헤어지고 싶어`를 실제 화면에서 선택해 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). 이별 뒤 산책·하은 미래 대화·가짜 새 만남이 열리지 않았고 완료 저장은 `error=null/complete=true/conversation=MEET/relationship=END/futureAccepted=false/day25Route=RELATIONSHIP_ENDED`, browser warning/error 0, 사용자 저장 복원 PASS다. 확인된 Free Action은 전환 후 DAY25의 것이며 DAY24 legacy Free Action이 아니었다. DAY24는 **PARTIAL**, 다음은 **실제 연락/거짓말/새 만남 의미 경로와 Mixed/389×844 QA**다.

15:30 DAY24 Mixed 서울·유리 연락 사실 공개 데스크톱 QA(9/6): DAY19의 실제 유리 미완료 연락을 서울 당일 이력에 추가해 DAY23에서 지우지 않고 DAY24까지 전달했다. 실제 화면에서 대면·관계 지속 뒤 C8 `아직 끝내지 않은 관계가 있어요`와 유리 C9의 오늘 이야기 듣기를 선택해 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). 완료 저장은 `contactRecipient=YURI/contactCleanup=RELATIONSHIP_ACTIVE/contactDirection=LISTEN_TODAY/relationshipStatusLie=null/newMeetingAccepted=false/relationship=CONTINUE/day25Route=HAEUN_FUTURE`, browser warning/error 0, 사용자 저장 복원 PASS다. 유리 연락을 새 연애·새 만남으로 승격하지 않았다. DAY24는 **PARTIAL**, 다음은 **서진/아라 연락·거짓말·새 만남과 389×844 QA**다.

15:45 DAY24 Mixed 서울·서진 관계 상태 거짓말 데스크톱 QA(9/6): DAY19의 실제 서진 미완료 연락을 DAY23에서 보존해 DAY24로 전달하고, 대면·관계 지속 뒤 C8 관계 있음 공개, 서진 C9 개인 관심, C10 `지금은 혼자야`를 실제 화면에서 선택해 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). 완료 저장은 `contactRecipient=SEOJIN/contactCleanup=RELATIONSHIP_ACTIVE/contactDirection=PERSONAL_INTEREST/relationshipStatusLie={recipient:SEOJIN,statement:SINGLE,truth:RELATIONSHIP_NOT_ENDED,corrected:false}/newMeetingAccepted=false`, 하은 자동 폭로·용서와 새 만남 비생성, browser warning/error 0, 사용자 저장 복원 PASS다. DAY24는 **PARTIAL**, 다음은 **아라 연락·관계 종료 뒤 조건부 새 만남과 389×844 QA**다.

16:00 DAY24 Mixed 서울·아라 조건부 새 만남 데스크톱 QA(9/6): 실제 아라 미완료 연락을 DAY23에서 보존해 DAY24로 전달하고, 하은과 명시적으로 이별한 뒤 C8 관계 종료 공개·아라 C9 개인 관심을 실제 화면에서 선택했다. 아라의 별도 현재 응답 수락 뒤에만 C13이 열리는 경로를 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). 완료 저장은 `relationship=END/contactRecipient=ARA/contactCleanup=RELATIONSHIP_ENDED/contactDirection=PERSONAL_INTEREST/relationshipStatusLie=null/newMeetingAccepted=true/futureAccepted=false/day25Route=RELATIONSHIP_ENDED`, 새 연애 확정·하은 미래 대화 비생성, browser warning/error 0, 사용자 저장 복원 PASS다. DAY24 데스크톱 의미 경로는 닫혔고 **PARTIAL**, 다음은 **389×844 Friendly/Neutral/Distant/Mixed 모바일 QA**다.

DAY24 Friendly 389×844 모바일 QA(9/6): 브라우저 외곽을 보정해 실제 콘텐츠 `innerWidth=389/innerHeight=844`에서 Friendly 대면·관계 지속 경로를 노출 선택지로 다시 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). SKIP 없이 DAY25 `08:00`까지 도달했고 완료 저장은 `error=null/complete=true/conversation=MEET/relationship=CONTINUE/futureAccepted=true/day25Route=HAEUN_FUTURE/day=25/day25Hook=true/freeAction=null`이다. 카페의 하은 외 원격 인물·타 경로 장소 누출이 없었고 `scrollWidth=clientWidth=389`, 사용자 저장 복원, viewport reset PASS다. DAY24는 **PARTIAL**, 다음은 **Neutral 통화·유예 389×844 모바일 QA**다.

DAY24 Neutral 389×844 모바일 QA(9/6): 부산 별실·관계 불확실·통화 합의 fixture에서 DAY24의 노출 선택 11개를 직접 진행하고 C3의 미결 마음과 C6의 시간 필요를 선택해 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). 대면 카페·현장 하은·다른 연락 상대·부산 숙박 장면을 만들지 않은 통화 전용 흐름이며 완료 저장은 `error=null/complete=true/conversation=PHONE/relationship=DEFER/futureAccepted=false/day25Route=DEFERRED_RELATIONSHIP/day=25/day25Hook=true/freeAction=null`이다. `scrollWidth=clientWidth=389`, 사용자 저장 복원, viewport reset PASS. DAY24는 **PARTIAL**, 다음은 **Distant 연락 불가·기종료 389×844 모바일 QA**다.

DAY24 Distant 389×844 모바일 QA(9/6): 관계·연락이 이미 끝난 미여행 fixture의 과거 `breakup` UI 마커가 DAY20 이별 팝업을 재생하는 문제를 발견했다. DAY24 불변 입력을 먼저 동결한 뒤 처리 완료된 팝업 마커만 제거하도록 모바일 harness를 수정하고 처음부터 다시 실행했다. 실제 노출 선택 6개를 SKIP 없이 진행했으며 하은 메시지·대면·통화, 부산 여행·숙박, 타 연락 상대를 만들지 않았다. 완료 저장은 `error=null/complete=true/conversation=null/relationship=null/futureAccepted=false/day25Route=RELATIONSHIP_ENDED/day=25/day25Hook=true/freeAction=null`, `scrollWidth=clientWidth=389`, 사용자 저장 복원, viewport reset PASS다. DAY24는 **PARTIAL**, 다음은 **Mixed 서울·유리 연락 389×844 모바일 QA**다.

DAY24 Mixed 389×844 모바일 QA 및 종결(9/6): 서울 당일·관계 지속·대면 합의·실제 유리 미완료 연락 fixture에서 C8 관계 사실 공개와 유리 C9 오늘 이야기 듣기를 포함한 노출 선택지를 직접 진행해 SKIP 없이 DAY25까지 완주했다(`day24/DAY24_V4_BROWSER_QA_2026-09-06.md`). 완료 저장은 `error=null/complete=true/conversation=MEET/relationship=CONTINUE/contactRecipient=YURI/contactDirection=LISTEN_TODAY/futureAccepted=true/day25Route=HAEUN_FUTURE/day=25/day25Hook=true/freeAction=null`이다. 유리 연락을 새 연애로 바꾸지 않았고 타 연락 상대·부산 장면 누출도 없었다. `scrollWidth=clientWidth=389`, browser warning/error 0, 사용자 저장 복원, viewport reset PASS. source/state/playable/bridge·저장·Story-Free·데스크톱 및 네 모바일 의미 경로가 닫혀 DAY24를 **PASS / COMPLETE**로 승격한다. 다음은 **DAY25 최종 원문 잠금과 DAY22~24 실제 이력 감사**다.

DAY25 최종 원문 잠금·선행 이력 감사(9/6): Notion `DAY 25 — 좋아한다는 말 다음 | SCENARIO V4`를 다시 조회해 내부 편집 메모를 제외한 17,818자·24 Scene·20 choice block 플레이어 공개 snapshot을 잠갔다. source registry는 공통 C1~3, 하은 미래 C4~13, 혼자 대체 C4~6, 새 만남 대체 C7, 하은 사회 공개 C14~16을 분리하고 선택 10의 4개 및 나머지 각 3개 라벨과 SHA를 검증한다. DAY22~24 감사에서는 DAY24의 실제 `day25Route`, 관계 결과, 미래 대화 별도 수락, 새 만남 별도 수락, 연락·거짓말/정정과 친구 가능 상태만 DAY25 입력으로 동결해야 함을 확정했다. 기존 4단계 결혼 범위 요약은 legacy로 보존한다. DAY25는 **PARTIAL**, 다음은 **`day25-notion-v4/1` replay-locked 상태 계약**이다.

DAY25 replay-locked 상태 계약 완료(9/6): `day25-notion-v4/1`을 검증된 DAY22~24 완료 이력과 DAY24→25 hook에만 연결하고 기존 DAY25 진행 저장은 legacy로 보존했다. DAY24의 확정 route·관계 결과·미래 대화 별도 수락·새 만남 대상/수락·관계 상태 거짓말, 지훈/소라 인지, 현재 잔액·DAY22~24 실제 지출과 source schema를 input seal로 동결한다. 공통/하은/혼자/새 만남/사회 공개의 20개 선택 상태 머신을 만들고 미래 제안과 하은 응답, 손잡기·포옹·입맞춤 현재 동의, 새 사람 현재 응답, 지훈·소라 실제 가능 응답을 각각 분리했다. 결혼 준비는 실제 제안 없이 수락될 수 없고, 첫 키스는 관계 지속·CALM 신뢰·거짓말 없음·현재 상호 동의가 모두 있어야 기록된다. source/state/인접 DAY24 집중 회귀 13/13 PASS. DAY25는 **PARTIAL**, 다음은 **공통 SCENE01~03과 하은 SCENE04~10 exact-source playable**이다.

DAY25 SCENE01~10/C1~9 playable 완료(9/6): 공통 도입과 하은 미래 대화의 식사 장소·질문·식사 속도·결혼 의미·원하는 집·힘든 말 듣기·현재 돈·일·결정 속도를 exact source ref로 투영했다. 특별식당과 집은 하은의 별도 현재 장소 응답을 기다리며 특별식당은 비용·시간 적합 조건이 없으면 수락할 수 없고 어느 선택도 예약·결제를 자동 생성하지 않는다. 돈 장면은 동결한 현재 잔액과 DAY22~24 실제 지출을 표시만 하며 미래 소득·공동 통장·대출을 만들지 않는다. 장면 경계에서 선택 반응이 중복 출력되는 결함도 제거하고 단일 투영 테스트를 추가했다. 종료 이력에서는 하은 메시지·현장 인물·공동 식사를 만들지 않고 SCENE17로 건너간다. DAY25 source/state/playable 집중 회귀 14/14 PASS. DAY25는 **PARTIAL**, 다음은 **SCENE11~16/C10~13 하은 응답·현재 접촉 playable**이다.

DAY25 SCENE11~16/C10~13 playable 완료(9/6): 결혼 준비·재논의·결혼 없는 장기연애·미래 차이의 네 제안을 하은의 독립 현재 응답과 분리했다. 관계가 계속될 때만 C11~13을 열고, 손잡기·포옹·입맞춤은 각각 별도 현재 동의를 받은 뒤에만 동작을 출력한다. 첫 입맞춤은 활성 관계·CALM 신뢰·DAY24 관계 상태 거짓말 없음·양쪽 현재 동의가 모두 충족될 때만 SCENE15/C13으로 이어지며, 거절·포옹·바라보기·작별을 키스로 승격하지 않는다. 관계 종료는 SCENE17, 지속은 SCENE20으로 교차하고 손잡기 거절 반응도 누락 없이 투영한다. DAY25 source/state/playable 집중 회귀 18/18 PASS. DAY25는 **PARTIAL**, 다음은 **SCENE17~19/C4~7 혼자/새 사람 대체 경로**다.

DAY25 SCENE17~19/C4~7 playable 완료(9/6): 관계 종료·오늘 미대면 경로에서 하은의 메시지나 현장 인물을 만들지 않고 자기 저녁, 독립 생활 목표, 내일의 작은 일과 휴식을 exact source ref로 구현했다. 지훈은 실제 연락 가능 이력에서만 통화에 등장한다. 새 사람 장면은 DAY24에서 실제로 상호 수락된 유리·서진·아라 중 단일 대상에게만 열리고, C7 뒤에도 상대의 현재 일정 응답을 별도로 기다린다. 수락은 새 연애로 읽지 않으며 일정 변경·취소는 다른 사람에게 같은 메시지를 보내는 흐름으로 대체하지 않는다. 집중 source/state/playable 11/11 PASS. DAY25는 **PARTIAL**, 다음은 **SCENE20~24/C14~16 친구 공개 범위·공통 ending**이다.

DAY25 playable 전체 완료(9/6): SCENE20~24/C14~16 친구 공개 범위와 공통 ending을 exact source ref로 구현해 24 Scene 및 공통 C1~3·하은 C4~16·혼자 C4~6·새 만남 C7 playable을 모두 닫았다. 네 사람 식사는 관계 지속과 지훈·소라 각각의 현재 가능 응답이 모두 있을 때만 확정한다. 한 명이라도 불가하면 모임을 만들지 않고, 비공개·다른 날·혼자 경로는 하은이나 친구를 새로 만들지 않은 채 공개 범위를 정리한다. 키스 회상은 실제 현재 입맞춤이 있었을 때만 나오고, 관계 종료 ending은 새 사람의 호감을 요구하지 않는다. 집중 source/state/playable 11/11 PASS. DAY25는 **PARTIAL**, 다음은 **V4 game bridge·저장 재개·현재 응답·presentation·Story/Free 연결**이다.

DAY25 V4 game bridge 기반 완료(9/6): 다섯 playable 모듈을 단일 bridge로 결합하고 장소·하은 미래·현재 접촉·새 만남·친구 가능 응답을 각각 runtime resolution으로 분리했다. 특별식당은 동결한 현재 잔액이 맞지 않으면 수락하지 않으며 예약·결제는 만들지 않는다. 선택·응답 실패는 DAY25 chapter 전체를 원자 복원하고 SaveManager 중간 저장 왕복 뒤 동일 segment와 시간·장소·인물 presentation을 재생한다. 완료는 단일 DAY25 이력과 DAY26 hook만 기록하며 legacy Free Action 완료를 만들지 않는다. bridge/playable/state 집중 31/31 PASS. DAY25는 **PARTIAL**, 다음은 **`game.js` 실제 Story 루프와 Story/Free 배타성 연결**이다.

DAY25 실제 Story 루프 연결 완료(9/6): `game.js`에서 검증된 DAY24 V4 완료 저장만 DAY25 V4로 진입시키고 legacy 저장은 기존 4단계 경로로 보존했다. 원문 선택, 장소·하은 미래·접촉·새 만남·친구 가능 응답, completion, 저장 재개 배경과 `15:00/17:30/19:00/22:00` 시계를 실제 진행에 연결했다. V4 진행·완료 중에는 legacy DAY25 choice 기록과 Free Action이 끼어들지 않으며 특수 식당 resume도 bridge가 검증한 배경 URL을 유지한다. 최상위 캐시는 `game.js?v=270`이다. runtime/bridge/Story-Free 집중 16/16 PASS 및 전체 30일 시뮬레이션 PASS. DAY25는 **PARTIAL**, 다음은 **DAY22~25 집중 회귀와 Friendly 데스크톱 비-SKIP QA**다.

DAY25 Friendly 데스크톱 QA(9/6): 검증된 DAY24 CALM·관계 지속 fixture에서 실제 Story 화면의 C1~16 16개를 직접 눌러 DAY26까지 SKIP 없이 완주했다(`day25/DAY25_V4_BROWSER_QA_2026-09-06.md`). `15:00→19:00→22:00→DAY26 08:00`, 결혼 준비에 대한 하은의 독립 응답, 현재 입맞춤 동의, 지훈·소라의 현재 가능 응답을 확인했다. 완료 저장은 `error=null/complete=true/location=COMFORTABLE/future=PREPARE_MARRIAGE/contact=KISS/kiss=true/friends=true/day26Route=MARRIAGE_PREPARATION/day26Hook=true/freeAction=null`이며 사용자 저장을 복원했다. fixture shell 설정 누락은 harness에서 수정 후 처음부터 재실행했다. DAY25는 **PARTIAL**, 다음은 **Neutral 재논의·입맞춤 거절과 Distant 혼자·새 만남 데스크톱 QA**다.

DAY25 Neutral·Distant 데스크톱 QA 및 이별 저장 재개 교정(9/6): Neutral 통화 유예는 8개, Distant DAY24 실제 새 만남은 9개, 기종료 혼자는 8개 선택을 실제 화면에서 SKIP 없이 눌러 모두 DAY26 `INDEPENDENT_LIFE`까지 완주했다(`day25/DAY25_V4_BROWSER_QA_2026-09-06.md`). 새 만남은 아라 `SLOW_DOWN→RESCHEDULED`만 기록하고 연애로 만들지 않았다. 기종료 저장을 불러올 때 DAY25 pending Story보다 전역 이별 엔딩을 먼저 띄우는 HIGH를 발견해, 현재 DAY와 일치하고 실제 콘텐츠가 있는 Campaign Story만 이별 엔딩보다 우선 재개하도록 수정했다. 동일 DIFFICULT fixture 재실행 PASS, 사용자 저장 복원 PASS. DAY25는 **PARTIAL**, 다음은 **Mixed 데스크톱·입맞춤 거절 및 네 성향 389×844 QA**다.

DAY25 Mixed·입맞춤 거절 데스크톱 QA(9/6): DAY24 서진 관계 상태 거짓말 미정정 이력을 가진 Mixed 경로 14개 선택과 현재 신체 상태가 불편한 Friendly 입맞춤 거절 경로 15개 선택을 실제 화면에서 SKIP 없이 눌러 DAY26까지 완주했다(`day25/DAY25_V4_BROWSER_QA_2026-09-06.md`). Mixed C10 REDISCUSS 직후 축약 독백의 exact-source 누락이 `DAY25_SOURCE_LINE_MISSING:12`로 안전 중단되는 HIGH를 발견해 전체 원문 source를 보존하는 projection으로 교정하고 처음부터 재검증했다. 또한 신뢰 조건만 맞으면 키스를 항상 수락하던 runtime을 현재 에너지·스트레스에 따라 별도 거절할 수 있게 보강했다. 완료 저장은 각각 `REDISCUSS/contact=null/kiss=false/day26Route=RELATIONSHIP_REDISCUSSION`, `PREPARE_MARRIAGE/contact=NONE/kiss=false/day26Route=MARRIAGE_PREPARATION`이며 browser warning/error 0, 사용자 저장 복원 PASS다. DAY25 데스크톱 의미 경로는 닫혔고 **PARTIAL**, 다음은 **Friendly/Neutral/Distant/Mixed 389×844 모바일 QA**다.

DAY25 389×844 모바일 QA 및 종결(9/6): 브라우저 외곽을 보정해 실제 콘텐츠 `innerWidth=389/innerHeight=844`에서 Friendly 16개, Neutral 8개, Distant 기종료·혼자 8개, Mixed 거짓말 책임 14개 선택을 실제 화면으로 눌러 SKIP 없이 DAY26까지 완주했다(`day25/DAY25_V4_BROWSER_QA_2026-09-06.md`). Friendly는 현재 입맞춤과 친구 식사 뒤 `MARRIAGE_PREPARATION`, Neutral/Distant는 하은 동의·접촉·새 만남을 만들지 않고 `INDEPENDENT_LIFE`, Mixed는 C12~13 없이 `RELATIONSHIP_REDISCUSSION`을 기록했다. 네 경로 모두 `error=null/complete=true/day=26/day26Hook=true/freeAction=null`, `scrollWidth=clientWidth=389`, browser warning/error 0이며 사용자 저장 복원과 viewport reset PASS다. source/state/playable/bridge·저장·Story-Free·전체 회귀·데스크톱 및 모바일 관문이 모두 닫혀 DAY25를 **PASS / COMPLETE**로 승격한다. 다음은 **DAY26 최종 Notion 원문 잠금과 DAY23~25 실제 이력 감사**다.

DAY26 최종 원문 잠금·선행 이력 감사(9/6): Notion `DAY 26 — 사람들 앞의 우리 | SCENARIO V4`의 플레이어 공개 원문을 내부 편집 메모·대체 V3와 분리해 `docs/scenarios/DAY26_SCENARIO_V4_NOTION.md`에 잠갔다. snapshot은 마지막 LF 포함 UTF-8 17,245자, 24 Scene, 28 choice block, SHA-256 `9b9d73d8372f6c89d34f9612660d92ba262b9e2a003b5f5a8b17d3c3f02007b5`다. source registry는 공통 C1, 하은·친구 모임 C2~12, 지훈 단독 대체 C2~3, 새 만남 대체 C4~8, 혼자 대체 C2~8, 하은 밤 C13, 공통 ending C14의 7개 variant로 분리했다. DAY23~25 감사에서는 실제 친구 식사 확정·관계/공개 범위·단일 새 만남 응답·동일 수신자의 거짓말·현재 피로와 보유 옷만 입력으로 동결하며, `RESCHEDULED`나 단순 연락 가능성을 오늘 약속으로 만들지 않도록 정했다(`day26/DAY26_V4_IMPLEMENTATION_PLAN_2026-09-06.md`). 기존 법적 준비 4단계는 legacy로 보존한다. DAY26는 **PARTIAL**, 다음은 **`day26-notion-v4/1` replay-locked 상태 계약**이다.

DAY26 replay-locked 상태 계약 완료(9/6): 검증된 DAY23~25 완료와 DAY25→26 hook에만 `day26-notion-v4/1`을 열고 기존 DAY26 진행 저장은 legacy로 보존했다. 실제 네 사람 식사, 단일 새 만남 `ACCEPTED`, 하은 관계/밤 연락, 동일 수신자 거짓말, 지훈·소라 인지, 보유 옷과 현재 에너지·스트레스·잔액을 input seal로 동결한다. C1 외출 축소는 기존 약속 상대의 현재 변경 수락을 기다리며, 별도 지훈 식사도 현재 응답 전에는 만들지 않는다. 새 상대의 관계 뜻과 다음 만남 제안도 각각 독립 응답으로 분리했고 `RESCHEDULED`는 혼자 생활로 닫는다. 네 사람/지훈/새 만남/혼자/하은 밤/ending 선택 상태와 선행 발언·발화 중단·피로 숨김·정정/거짓 반복·DAY27 후속을 replay 검증한다. source/state 집중 9/9 PASS. DAY26는 **PARTIAL**, 다음은 **SCENE01~14/C1~12 네 사람 식탁 exact-source playable**이다.

DAY26 SCENE01~14 네 사람 식탁 playable 완료(9/6): 공통 C1에서 실제 옷만 고르고 외출 축소는 기존 참석자의 현재 변경 응답 전까지 확정하지 않는다. 확정된 네 사람 식탁에만 C2~12를 열어 공개 범위, 각자의 근황, 하은의 독립 발화, 마지막 음식, 피로·휴식, 친구들의 비통역 원칙, 둘만의 확인, 귀갓길과 메시지를 exact-source projection으로 연결했다. 빠른 결혼 속도 발언과 하은 말 중단은 서로 독립적으로 남고, 친구 앞·둘만의 대화·귀갓길·귀가 메시지에서 실제 정정을 고를 수 있다. 숙소 농담은 기존 이력이 있을 때만 나오며, 저에너지에서 괜찮다고 버틴 경우만 `fatigueHidden`이 된다. source/state/playable 집중 11/11 PASS. DAY26는 **PARTIAL**, 다음은 **SCENE15 지훈 단독 식사와 SCENE16~20 새 만남 exact-source playable**이다.

DAY26 SCENE15~20 대체 경로 playable 완료(9/6): 지훈과의 단독 식사는 현재 수락 응답 뒤에만 열어 C2~3에서 관계 공개 범위와 친구의 독립 일정을 지킨다. 새 만남은 DAY25에서 오늘 `ACCEPTED`된 단일 실제 상대만 등장하며 유리·서진·아라의 원문 대사를 섞지 않는다. C5 관계 의도, 실제 동일 수신자 거짓말 C6, C7 다음 만남은 제안만으로 관계·약속을 만들지 않고 각각 상대의 현재 응답을 기다린다. 특히 거짓말을 밝힌 뒤 상대가 대화를 계속할지 오늘 끝낼지 묻는 `NEW_LIE` resolution을 추가해, `END_TODAY`이면 다음 약속 C7을 건너뛰고 귀가 C8로 이동한다. 실제 거짓말이 없으면 SCENE19/C6은 생성하지 않는다. source/state/playable 집중 16/16 PASS. DAY26는 **PARTIAL**, 다음은 **SCENE21 혼자 생활과 SCENE22~24 밤 연락·ending exact-source playable**이다.

DAY26 SCENE21~24 혼자·밤 연락·ending playable 완료(9/6): 혼자 경로 C2~8은 생활 선택, 지훈의 미래 식사 응답, 실제 관계 공개, 실제 상대에게만 하는 정정, 내일 계획을 exact-source projection으로 닫는다. `solo_friend_resolution`에서 phase를 잃어 응답이 거부되던 wrapper 결함을 교정했다. 네 사람 식탁에서는 둘만의 인정, 정정 약속, 친구들에게 실제 정정을 하나의 값으로 취급하던 오류를 분리해 C12 실제 정정에서만 완료되도록 했다. C12 연락 휴식은 SCENE22/C13을 만들지 않으며, 연락 가능한 관계 지속 경로만 하은의 `괜찮다` 자기 억제 발화를 듣는다. C14는 실제 청취·정정 대상과 다음 대화, 시간 존중을 `day27Handoff`로 남기고 SCENE24 뒤에만 completion cue를 낸다. DAY26 집중 23/23 PASS. DAY26는 **PARTIAL**, 다음은 **세 playable 모듈의 game bridge·저장·presentation·Story/Free·경제 연결**이다.

DAY26 game bridge·실제 Story 루프 연결 완료(9/6): 세 playable 모듈을 현재 phase로 결합하고 검증된 DAY25 V4 완료 저장만 신규 DAY26 V4로 진입시켰다. 참석 변경·지훈 식사·새 만남 관계 의도·동일 수신자 거짓말 확인·다음 약속을 별도 runtime 응답으로 처리하며, 선택·응답 실패는 chapter와 잔액·ledger·식비 settlement를 함께 원자 복원한다. 실제 경로별 식비는 네 사람 24,000원·지훈 16,000원·새 만남 22,000원 중 하나만 한 번 기록하고 혼자 경로는 결제하지 않는다. SaveManager 중간 저장 왕복은 동일 segment와 시간·장소·인물을 복원하고 V4 진행·완료에는 legacy Free Action이 끼어들지 않는다. 완료는 단일 DAY26 이력과 DAY27 hook만 열며 로더 캐시는 `game.js?v=273`이다. DAY25~26 집중 37/37, 전체 Node 회귀 801/801, `npm test` 100회×30일 시뮬레이션 PASS. DAY26는 **PARTIAL**, 다음은 **Friendly/Neutral/Distant/Mixed 데스크톱·389×844 비-SKIP QA**다.

DAY26 Friendly 네 사람 식사 데스크톱 QA(9/6): 검증된 DAY25 결혼 준비·관계 지속·지훈/소라 참석 fixture에서 실제 Story 화면의 C1~C14를 AUTO OFF·SKIP 미사용으로 직접 진행해 DAY27까지 완주했다(`day26/DAY26_V4_BROWSER_QA_2026-09-06.md`). `15:00→19:00→22:00→DAY27 08:00`, 네 사람 식탁과 하은의 독립 발화·귀가 후 정정·밤 연락을 확인했고 지훈 단독·새 만남·혼자 장면은 섞이지 않았다. 완료 저장은 `error=null/complete=true/GROUP_MEAL 24000원/food ledger 1건/day=27/day27Hook=true/freeAction=null`, browser warning/error 0, 사용자 저장 복원 PASS다. DAY26는 **PARTIAL**, 다음은 **Neutral 재논의·Distant 혼자·Mixed 거짓말·지훈 단독·새 만남 데스크톱 QA**다.

DAY26 Neutral·Distant·Mixed·아라 새 만남 데스크톱 QA(9/6): Neutral 관계 유예와 Distant 기종료는 각각 C1·혼자 C2~8·C14의 9개 선택을 실제 화면에서 AUTO OFF·SKIP 없이 진행해 식비와 현장 인물을 만들지 않고 `SOLO_DAY→INDEPENDENT_LIFE`로 DAY27까지 완주했다. Mixed는 DAY24의 실제 서진 관계 상태 거짓말을 다른 인물에게 복제하지 않은 채 네 사람 식사를 진행하고 미정정 사실을 `NEW_MEETING_TRUTH`로 이월했다. 아라 새 만남은 C1/C4/C5/C7/C8/C14 6개 선택으로 실제 단일 상대만 등장했으며 별도 `RECIPROCATE` 응답을 새 연애로 승격하지 않았고 거짓말 없는 SCENE19/C6과 선택하지 않은 다음 약속을 만들지 않았다. 식비는 Mixed `GROUP_MEAL 24000원`·아라 `NEW_MEETING 22000원` 각각 1건, 모든 경로 `error=null/complete=true/day=27/day27Hook=true/freeAction=null`, browser warning/error 0, 사용자 저장 복원 PASS(`day26/DAY26_V4_BROWSER_QA_2026-09-06.md`). DAY26는 **PARTIAL**, 다음은 **지훈 단독 식사와 동일 수신자 거짓말 정정/반복 데스크톱 QA 후 389×844 네 성향 QA**다.

DAY26 실제 이력 교정·데스크톱 잔여·389×844 모바일 종결(9/6): DAY24에서 서진에게 관계 상태를 숨기고 `THINK` 응답을 받은 실제 후보가 DAY25 관계 종료 뒤에도 현재 `ACCEPTED` 응답을 받을 수 있도록 DAY24→25 계약을 교정하고, DAY25에서 실제로 만나지 않은 후보는 DAY26으로 승격하지 않게 했다. 지훈 단독 식사(`JIHOON_MEAL/16000`)와 동일 수신자 서진 정정(`NEW_MEETING/22000`, `END_TODAY`)을 데스크톱에서 SKIP 없이 DAY27까지 완주했다. 이어 실제 콘텐츠 `innerWidth=389/innerHeight=844`에서 Friendly·Neutral·Distant·Mixed와 동일 수신자 정정을 각각 완주했다. Friendly/Mixed만 `GROUP_MEAL/24000` 1건, Neutral/Distant는 식비 0건이며 모든 경로가 `error=null/complete=true/day=27/day27Hook=true/freeAction=null`, 신규 browser warning/error 0, 사용자 저장·viewport reset PASS다. 정상 실제 이력에서 관계 종료 뒤의 “정리됐어요”는 반복 거짓말이 아니므로 조작 이력을 브라우저 관문으로 만들지 않았다. 전체 Node 804/804와 100회×30일 시뮬레이션 PASS. DAY26는 **PASS / COMPLETE**, 다음은 **DAY27 최종 Notion 원문 잠금과 DAY24~26 실제 이력 감사**다.

DAY27 최종 원문 잠금·선행 이력 감사(9/6): Notion `DAY 27 — 되돌릴 수 없는 말 | SCENARIO V4`의 플레이어 공개 원문을 내부 편집 메모와 분리해 `docs/scenarios/DAY27_SCENARIO_V4_NOTION.md`에 잠갔다. snapshot은 마지막 LF 포함 UTF-8 16,953자, 24 Scene, 23 choice block, SHA-256 `61aa989b03f52252ab1a017f6d7b1c564a4aa9e7f2cbb045bd6ee91a2455e595`다. source registry는 공통 아침·대화 시작·실제 관계 진실·정직한 자기억제·공개 정정·대화 끝·지훈·저녁·관계 지속 밤·이별 밤·비대화의 11개 variant로 분리했다. DAY24~26 감사에서는 실제 수신자의 관계 상태 발언, 하은 관계 결과, DAY26 선행 공개 발언·정정, 실제 청취 대상·다음 대화·연락/거리 요청만 입력으로 동결하고 자동 폭로·자동 용서·미확정 약속을 금지했다(`day27/DAY27_V4_IMPLEMENTATION_PLAN_2026-09-06.md`). 기존 다섯 장면 요약형 DAY27은 legacy로 보존한다. DAY27은 **PARTIAL**, 다음은 **`day27-notion-v4/1` replay-locked 상태 계약**이다.

DAY27 replay-locked 상태 계약 완료(9/6): 검증된 DAY24~26 V4 완료와 DAY26→27 hook에만 `day27-notion-v4/1`을 열고 기존 DAY27 진행 저장은 legacy로 보존했다. DAY24의 실제 관계 상태 발언·단일 수신자·현재 정정 여부, DAY25 관계 결과, DAY26의 공개 선행 발언·정정과 청취 대상·연락/거리 요청·현재 자원을 input seal로 동결한다. 대화 성립, 실제 거짓말 수신자의 대화 지속, 하은의 청취, 관계 지속/유예/종료, 지훈 가능 여부, 다음 약속을 별도 현재 응답으로 두고, 비대화 C3~8은 듣지 못한 상대 반응 없이 완주한다. 정직 대화·서진 실제 정정·이별 비대화 및 입력 변조 replay 검증을 포함한 DAY27 source/state 집중 7/7 PASS. DAY27은 **PARTIAL**, 다음은 **SCENE01~09/C1~7 exact-source playable**이다.

DAY27 SCENE01~09 관계 진실 playable 완료(9/6): C1 뒤 실제 대화 대상의 현재 `ACCEPTED` 응답 전에는 상대 대사·인물을 출력하지 않고, 대화가 없는 이력은 바로 SCENE23으로 교차한다. 대화가 성립하면 input seal의 단일 실제 수신자만 SCENE03에 등장하며 유리·서진·아라 대사를 섞지 않는다. C3 네 답변과 실제 종료 여부, 상대의 `CONTINUE/END_TODAY/DISTANCE`, C4 사과, C5 하은 고지와 별도 청취 응답, C6 기억·C7 관계 바람 뒤 하은의 관계 결과를 각각 분리했다. 실제 수신자가 대화를 끝내면 SCENE05~09나 하은 반응을 만들지 않는다. 모든 플레이어 텍스트는 whole-line source ref를 통과하며 SCENE01 대기·SCENE02~09 서진 경로·즉시 종료 집중 3/3 PASS. DAY27은 **PARTIAL**, 다음은 **SCENE10~17/C8~12 정직한 자기억제·공개 정정·관계 종료/지속 playable**이다.

DAY27 SCENE10~17 정직 대화 playable 완료(9/6): 숨긴 관계가 없는 입력에만 하은의 자기억제와 주인공의 삼킨 말을 열고 C8~10의 양쪽 발화·부탁과 SCENE13 물병 장면을 whole-line source ref로 구현했다. DAY26에 실제 공개 선행 발언이 있고 아직 정정되지 않은 경우만 SCENE15/C11을 노출하며, 깨끗한 이력에는 사과할 사건을 만들지 않는다. C12의 지속·유예는 하은의 별도 현재 응답을 기다리고, 주인공의 명확한 관계 종료는 상대의 동의를 요구하지 않은 채 연락을 닫는다. SCENE17은 실제 대면이면 잡지 않는 작별, 통화면 보지 못한 표정을 만들지 않는 종료를 출력한다. 정직 C8~12·조건부 공개 정정·명시적 종료 집중 3/3 PASS. DAY27은 **PARTIAL**, 다음은 **SCENE18~24/C13~16 및 이별·비대화 대체 C3~8 playable**이다.

DAY27 SCENE18~24 ending playable 완료(9/6): 지훈은 현재 가능 응답 뒤에만 SCENE18/C13으로 등장하고, 불가 응답에는 대사를 만들지 않는다. C14 저녁 뒤 정직 대화 또는 실제 진실 고지, 관계 지속, 연락 허용을 모두 만족한 경우만 하은 밤 메시지와 C15~16을 열며 새 약속은 별도 현재 응답 전에는 확정하지 않는다. 실제 수신자가 진실 대화를 종료한 경로에는 하은의 다정한 밤 문자를 만들지 않는다. 이별·연락 중지는 대체 C15, 대화 미성립은 SCENE23 대체 C3~8만 거쳐 듣지 못한 반응을 생성하지 않는다. 미수행 정정을 완료했다고 말하는 선택은 숨기고 SCENE22에는 실제 남은 대상만 유지하며 SCENE24 뒤에만 completion cue를 낸다. continuing·비대화·진실 미고지·정정 가용성 집중 3/3 PASS. DAY27은 **PARTIAL**, 다음은 **V4 game bridge·저장·현재 응답·presentation·Story/Free·DAY28 전환 연결**이다.

DAY27 game bridge·실제 Story 루프 연결 완료(9/6): opening·middle·ending playable을 현재 phase로 결합하고 검증된 DAY26 V4 완료 저장만 신규 DAY27 V4로 진입시켰다. 대화 성립, 실제 거짓말 수신자의 대화 지속, 하은 청취, 관계 지속/유예/종료, 지훈 가능 여부, 다음 약속을 각각 runtime resolution으로 처리한다. 선택·응답 실패는 chapter와 history/pending을 원자 복원하고, SaveManager 중간 저장 왕복은 동일 segment와 시간·장소·인물 presentation을 재현한다. completion은 단일 DAY27 이력과 DAY28 hook만 기록하며 V4 진행·완료에는 legacy late-story 선택이나 Free Action이 끼어들지 않는다. 브리지·저장·완료·실제 game wiring 집중 6/6 PASS, 캐시는 `game.js?v=277`이다. DAY27은 **PARTIAL**, 다음은 **DAY24~27 집중·전체 회귀 후 Friendly 데스크톱 비-SKIP QA**다.

DAY27 데스크톱 네 성향 QA·중간 저장 재개(9/6): 실제 Story 화면에서 AUTO OFF·SKIP 미사용으로 Friendly 정직 대화, Neutral 공개 발언 정정, Distant 비대화, Mixed 실제 서진 관계 상태 거짓말 책임 경로를 각각 DAY28까지 완주했다(`day27/DAY27_V4_BROWSER_QA_2026-09-06.md`). Mixed는 C4 뒤 `SCENE 06 · 하은에게 말하는 선택`에서 페이지를 다시 불러와 DAY27 저장 미리보기와 이어하기를 거쳐 동일 Scene 시작점으로 복구했다. 모든 경로가 DAY28 `08:00 / STORY · D-3`로 전환되고 DAY27 Free Action은 끼어들지 않았으며 browser warning/error 0, 사용자 저장 복원 PASS다. 전체 Node 827/827와 100회×30일 시뮬레이션도 통과했다. DAY27은 **PARTIAL**, 다음은 **Friendly/Neutral/Distant/Mixed 389×844 모바일 QA**다.

DAY27 389×844 모바일 QA 및 종결(9/6): 브라우저 외곽을 보정한 실제 콘텐츠 `innerWidth=389/innerHeight=844`에서 Friendly·Neutral·Distant·Mixed를 AUTO OFF·SKIP 없이 각각 DAY28까지 완주했다(`day27/DAY27_V4_BROWSER_QA_2026-09-06.md`). Friendly/Neutral은 관계 지속 밤 장면, Distant는 상대와 듣지 못한 응답 없는 SCENE23, Mixed는 실제 서진 거짓말 정정 경로만 표시됐다. 네 경로 모두 `scrollWidth=clientWidth=389`, DAY28 `08:00 / STORY · D-3`, browser warning/error 0이며 사용자 저장 복원과 viewport reset PASS다. 원문·상태·플레이어블·브리지·전체 회귀·데스크톱/모바일 관문이 모두 닫혀 DAY27을 **PASS / COMPLETE**로 승격한다. 다음은 **DAY28 최종 Notion 원문 잠금과 DAY25~27 실제 이력 감사**다.

DAY28 최종 원문 잠금·선행 이력 감사(9/6): Notion `DAY 28 — 다시 만나자는 뜻 | SCENARIO V4`의 플레이어 공개 원문을 내부 편집 메모·대체 V3와 분리해 `docs/scenarios/DAY28_SCENARIO_V4_NOTION.md`에 잠갔다. snapshot은 마지막 LF 포함 UTF-8 16,541자, 24 Scene, 26 choice block, SHA-256 `7e108834a0aa31361f5c22a2d2a69e7127e3b3ff8cd622727438ecbfe94b6d5b`다. source registry는 공통 아침, 하은 재회, 이별 정리, 관계 지속, 새 만남, 공개 범위, 혼자 생활, 관계 지속 밤의 8개 variant로 분리했다. DAY25~27 감사에서는 실제 관계/미래 합의·키스, 단일 새 만남 상대와 독립 응답, DAY27의 만남·정정·연락·거리·다음 대화만 입력으로 동결하고, 산책이나 사과로 관계·결혼·새 연애를 자동 복원하지 않도록 정했다(`day28/DAY28_V4_IMPLEMENTATION_PLAN_2026-09-06.md`). 기존 예식 리허설 5장면은 legacy로 보존한다. DAY28은 **PARTIAL**, 다음은 **`day28-notion-v4/1` replay-locked 상태 계약**이다.

DAY28 replay-locked 상태 계약 완료(9/6): 검증된 DAY25~27 V4 완료와 DAY27→28 hook만 `day28-notion-v4/1` 신규 저장으로 열고 기존 예식 리허설 진행 저장은 legacy로 보존했다. DAY25의 미래 합의·실제 접촉/키스, DAY26의 단일 새 만남 상대·의도/다음 응답, DAY27의 실제 대화 대상·방법·결과와 다음 대화 응답, 현재 관계·연락·거리·정정을 서로 분리해 input seal에 동결한다. 과거 키스·재회 표현은 오늘 접촉/집 초대 응답을 만들지 않으며 `RECIPROCATE`와 `ACCEPTED`, 거짓말 정정이 모두 없는 새 만남도 연애 경로로 승격하지 않는다. 맡긴 물건·집 초대·공개 범위는 근거가 없어 빈 값으로 잠갔다. 관계 지속 재회·완전 혼자·입력 변조와 legacy 분리를 포함한 DAY28 source/state 집중 검증을 통과했다. DAY28은 **PARTIAL**, 다음은 **SCENE01~08/C1~8 actual-meeting playable**이다.

DAY28 SCENE01~08 재회 playable 완료(9/6): C1 뒤 하은과 오늘 만남/통화의 현재 `ACCEPTED` 응답 전에는 하은 대사·인물을 출력하지 않으며, 약속이 없거나 `DEFERRED/DECLINED`이면 곧바로 혼자 생활로 교차한다. 실제 만남에서만 C2~8과 `왔네`, 고쳐 듣기, `보고 싶다`와 아직 괜찮지 않음의 병존, 작은 행동 약속, 짧은 길, 웃음, 관계 제안을 whole-line source ref로 재생한다. C3은 실제 선행 이력에 맞는 자기억제·공개된 거짓·미래 차이 중 하나만 제공하고 없는 잘못을 고르게 하지 않는다. C8 주인공 선택 뒤에도 하은의 지속·다시 알아가기·종료는 별도 현재 응답을 기다리며 접촉은 생성하지 않는다. 수락 재회·완전 혼자·현재 만남 유예 집중 검증을 통과했다. DAY28은 **PARTIAL**, 다음은 **SCENE09~16 이별/지속·현재 접촉·집 초대 playable**이다.

DAY28 SCENE09~16 이별·지속 playable 완료(9/6): 하은의 현재 관계 응답이 `END`일 때만 SCENE09~10을 열고, 맡긴 물건 증거가 없는 현재 이력에는 C10의 `돌려줄 게 없다`만 제공해 재회 구실을 만들지 않는다. 지속·다시 알아가기 응답은 SCENE11~16으로 분기하되 C10 손/포옹, 신뢰가 실제 남은 경로의 C11 키스, 집 초대, C14 다음 만남을 각각 독립 현재 응답으로 기다린다. 거절된 접촉은 `NONE`, 포옹의 `HAND_ONLY`는 손만 기록하며 과거 키스가 현재 키스를 허가하지 않는다. 집 초대가 쌍방 수락되지 않으면 SCENE15의 집 기억을 만들지 않고 실제 머문 곳에서 귀가한다. 이별·손 수락/키스 거절/집 수락·포옹 거절/외부 종료 집중 검증을 통과했다. DAY28은 **PARTIAL**, 다음은 **SCENE17~24 새 만남·공개·혼자·밤·ending playable**이다.

DAY28 SCENE17~24 ending playable 완료(9/6): DAY26의 단일 상대가 `RECIPROCATE`와 다음 만남 `ACCEPTED`, 거짓말 정정, DAY27 실제 대화 수락을 모두 가진 경우에만 SCENE17~18을 열며 유리·서진·아라 중 실제 한 사람만 표시한다. C8의 연애 희망 뒤에도 상대의 현재 `RECIPROCATE/NEED_TIME/DECLINED`를 따로 기다려 `NEED_TIME`을 새 연애로 바꾸지 않는다. 실제 공유 가능한 지훈이 있을 때만 C15를 열고, 만남 없음·정리 후에는 SCENE20~21 C2~8로 자기 식사·휴식·필요 연락·내일을 고른다. 연락 가능한 지속 관계만 SCENE22/C16을 열고 새 상대 경로에는 하은의 의자 대화를 이름만 바꿔 쓰지 않는다. SCENE23~24는 실제 관계·접촉·집 초대·다음 약속·공개·거리만 DAY29 handoff로 남기며 completion이 DAY27 hook을 닫고 DAY29 hook만 연다. solo·단일 아라/시간 필요·하은 지속/외부 종료 집중 검증을 통과했다. DAY28은 **PARTIAL**, 다음은 **V4 game bridge·저장·presentation·Story/Free 연결**이다.

DAY28 game bridge·실제 Story 루프 연결 완료(9/6): opening·middle·ending playable을 phase별로 결합하고 검증된 DAY27 V4 완료 저장만 신규 DAY28에 진입시켰다. 만남, 관계, 접촉, 집 초대, 다음 만남, 새 관계의 현재 응답을 runtime resolution으로 각각 처리하며 선택·응답 실패는 chapter/history/pending을 원자 복원한다. SaveManager 중간 저장 왕복은 동일 segment와 시간·장소·인물 presentation을 재현하고 completion은 단일 DAY28 이력과 DAY29 hook만 기록한다. V4 진행·완료에는 legacy 리허설 선택이나 DAY28 Free Action이 끼어들지 않으며 캐시는 `game.js?v=278`이다. DAY28은 **PARTIAL**, 다음은 **DAY25~28 집중·전체 회귀 후 Friendly 데스크톱 비-SKIP QA**다.

DAY28 종료 경계 보강 및 손 이미지 재노출 방지(9/6): C8의 명시적 END_WELL 뒤 새 CONTINUE/KNOW_AGAIN 응답을 거부하고 SCENE08~09 원문 이별 대사를 복원했다. 기존 replay 검증은 보존한다. 직전 사용자 요청의 손 이미지 정책은 프리로드·CG 표시 직전에 승인 URL/검수 캐시 키로 정규화하며 기존 저장을 변경하지 않는다. 전체 Node 854/854, 문법·diff 검사 PASS. 실제 브라우저 검증은 이번 작업에서 NOT RUN이다. 캐시는 game280 → DAY28 bridge v2 → state/middle v2. DAY28은 **PARTIAL**이며 다음은 **C11 GOODBYE 뒤 일상/집 장면 우회와 기존 저장 호환성**, 이후 CALL·고지/청취·독립 NPC 응답·원문 누락 보완이다.

DAY28 C11 직접 작별 보강(9/6): 새 GOODBYE 선택은 `DIRECT_FAREWELL` 기록과 함께 SCENE14 양말 일상·C12·집 초대·SCENE15를 건너뛰고 SCENE16 작별로 이동한다. 수정 전 표식 없는 중간 저장은 기존 replay 전이를 유지해 유효성을 보존한다. 집중 12/12 PASS. 실제 브라우저는 NOT RUN이다. 캐시는 game281 → DAY28 bridge v3 → state/middle v3. DAY28은 **PARTIAL**, 다음은 **CALL 전용 장면·선택·presentation 분리**다.

DAY28 CALL 전용 흐름 보강(9/6): 새 수락 CALL에 `CALL_CONVERSATION`을 기록하고 C2 통화 질문·C3~5·C8만 진행한다. 걸음 선택과 SCENE06~07, SCENE11~16의 벤치·접촉·집 초대를 제거하고 스프라이트 없는 통화 cue/종료로 분리했다. 일반 대면 약속이 낮은 체력만으로 CALL로 바뀌지 않는다. 수정 전 표식 없는 CALL 저장은 기존 replay 유지, 전체 Node 859/859 PASS. 실제 브라우저는 NOT RUN이다. 캐시는 game282 → DAY28 bridge v4. DAY28은 **PARTIAL**, 다음은 **C3 거짓 존재·수신자·하은 고지·청취 근거 감사**다.

DAY28 C3 고지·청취 근거 보강(9/6): `lieCorrected`만으로 하은이 거짓을 들었다고 간주하지 않는다. 신규 입력에 실제 거짓 수신자·정정·하은 고지·LISTEN proof를 봉인하고 모두 충족할 때만 `hidden_fact`를 연다. proof 모순은 재계산된 seal로도 거부하며 수정 전 proof 없는 저장은 기존 replay를 유지한다. 전체 Node 861/861 PASS, 실제 브라우저 NOT RUN. 캐시는 game283 → DAY28 bridge/state v5. DAY28은 **PARTIAL**, 다음은 **선행 사실 기반 독립 NPC 현재 응답과 원문 응답 대사**다.

DAY28 독립 NPC 응답 보강(9/6): 관계 지속 선택은 신뢰·거리 사실에 따라 CONTINUE/KNOW_AGAIN/END로 독립 판정한다. 손·포옹·키스는 각각 현재 동의 조건을 두고 부분 수락과 거절을 실제 하은 대사로 표시한다. 집 초대·다음 만남·새 관계도 선행 사실 기반으로 분리하고 실제 새 상대별 응답 및 SCENE19 공개 문맥을 연결했다. 새 분기가 드러낸 SCENE15 source ref 두 곳도 교정했다. 전체 Node 866/866 PASS, 실제 브라우저 NOT RUN. 캐시는 game284 → DAY28 bridge v6. DAY28은 **PARTIAL**, 다음은 **SCENE03~16·20~21 요약 narration의 원문 대사·행동 확장과 문자열 감사**다.

DAY28 원문 대화·행동 확장 1차(9/6): SCENE03~16에서 선택 뒤 숨은 요약만 남던 하은의 정정·작은 약속·길/벤치 대화·양말 농담·업무 답장·집 머무름·작별을 실제 dialogue/action cue로 복원했다. SCENE20~21의 혼자 경로도 일곱 선택마다 산책·식사·컵 씻기·연락 경계·내일 준비와 1인칭 생각이 실제로 재생된다. CALL은 대면 몸짓을 만들지 않고 큰 상처용 대사는 실제 거짓/거리 근거가 있을 때만 사용한다. 전체 Node 869/869 PASS, 실제 브라우저 NOT RUN. 캐시는 game285 → DAY28 bridge v7. DAY28은 **PARTIAL**, 다음은 **SCENE17~19·22~24 대사·행동 확장과 전체 문자열 감사**다.

DAY28 원문 대화·행동 확장 2차 및 문자열 감사(9/6): SCENE17~19의 실제 유리/서진/아라 전체 대화와 지훈 공개 범위 응답, SCENE22~24의 밤 계획·관계별 회고·불 끄기를 복원했다. 새 관계가 하은 전용 `의자를 되찾는 계획`, 옷 정리 선택, SCENE24 대사를 재사용하던 HIGH 문제를 실제 상대의 내일·일반 조율·새 관계 결말로 분리했다. 세 대표 경로 player-facing 자동 감사와 전체 Node 872/872 PASS, 실제 브라우저 NOT RUN. 캐시는 game286 → DAY28 bridge v8. DAY28은 **PARTIAL**, 다음은 **Friendly 데스크톱 비-SKIP 완주·중간 저장 재개 QA**다.

DAY28 저장 재개 presentation 교정(9/6): Friendly 중후반 저장이 공원 저녁/선택한 집 저녁/집 밤의 실제 장면 대신 집 밤·인물 없음으로 복원되던 결함을 교정했다. 공원 대화·집 초대 대기·수락/거절 장소·작별/다음 만남·대면/CALL·Solo 카페/집 checkpoint를 phase와 사실에 맞게 분리하고 Friendly 6개+Solo 3개 지점을 실제 SaveManager 왕복으로 고정했다. 전체 Node 874/874 PASS. 인앱 브라우저는 초기화 후에도 attach timeout이라 실제 UI는 NOT RUN이며 이를 PASS로 대체하지 않는다. 캐시는 game287 → DAY28 bridge v9. DAY28은 **PARTIAL**, 다음은 **브라우저가 연결될 때 Friendly 데스크톱 AUTO OFF·비-SKIP 완주 및 SCENE14 저장·새로고침 재개**다.

DAY28 브라우저 QA 하네스 준비(9/6): replay-locked Friendly 대면, Neutral 저체력 짧은 CALL, Distant Solo, Mixed 아라 새 만남을 각각 시작하는 `tests/day28-v4-browser-entry.html`을 추가했다. 기본/Story/Free 세 저장 슬롯을 최초 한 번 백업·복원하고 SKIP 조작 없이 본편 AUTO 기본 OFF로 진입한다. Neutral fixture의 C1 short→실제 `ACCEPTED/CALL`과 Friendly 비변경을 포함해 집중 11/11 PASS. 인앱 브라우저는 세션 초기화와 hidden 재시도 뒤에도 attach timeout이라 실제 플레이는 NOT RUN이고 사용자 저장은 변경하지 않았다. DAY28은 **PARTIAL**, 다음은 **도구 복구 후 하네스 Friendly 완주·SCENE14 저장 재개**다.

DAY28 실제 Chrome 네 경로 QA 및 종결(9/7): 격리된 Chrome 152 렌더링 엔진을 CDP로 구동해 Friendly 대면, Neutral C1 short→실제 CALL, Distant Solo, Mixed 아라 새 만남을 AUTO OFF·SKIP 클릭 0회로 각각 DAY29까지 완주했다(`day28/DAY28_V4_BROWSER_QA_2026-09-06.md`). Friendly SCENE14/C12 reload→이어하기 전후 `19:00 / neighborhood-park-day / 하은 / 선행 선택 11개`를 확인했다. 첫 실행에서 transition 뒤 하은이 숨는 HIGH와 provenance 객체 `step.source`를 이미지 URL처럼 preload하는 `/[object Object]` 404를 발견해, DAY18~28 V4 명시 캐릭터 재표시와 문자열 asset 전용 preload로 수정 후 재실행 PASS했다. 네 경로 모두 `complete=true/day=29/day29Hook=true`, Story/Free 배타성, 조치 가능한 console error·runtime exception 0건이며 격리 QA 저장 복원 PASS다. 전체 Node 회귀와 100회×30일 시뮬레이션·문법 검사도 PASS했다. DAY28을 **PASS / COMPLETE**로 승격한다. 다음은 **DAY29 최종 Notion 원문 잠금과 DAY26~28 실제 이력 감사**다.

DAY29 최종 원문 잠금 및 구현 계획(9/7): Notion `DAY 29 — 내일도 내가 고를게 | SCENARIO V4`의 플레이어 공개 원문을 내부 편집 메모·대체 V3와 분리해 `docs/scenarios/DAY29_SCENARIO_V4_NOTION.md`에 잠갔다. snapshot은 24 Scene, 23 choice block, SHA-256 `7346cee0f4f0ae27e22c174fdd9db3a07221117e4641e238d41cac61dc3ae186`이며 C13·C21의 4지 선택을 포함한 번호·라벨·상호 배타 저녁 variant를 기계 생성 registry로 고정했다. 기존 결혼 전날 5장면·3선택은 legacy로 보존하고, DAY28 V4의 실제 관계·만남 방식·접촉·집 초대·새 관계·공개 범위와 DAY26~27 소유물·거짓말·업무·지출만 입력으로 봉인하는 계획을 `day29/DAY29_V4_IMPLEMENTATION_PLAN_2026-09-07.md`에 기록했다. DAY29은 **PARTIAL / SOURCE LOCKED**, 다음은 **`day29-notion-v4/1` replay-locked 상태 계약**이다.

DAY29 replay-locked 상태 계약 완료(9/7): 검증·완료된 DAY26~28 V4와 DAY28→29 hook만 `day29-notion-v4/1` 신규 저장으로 열고, 기존 결혼 전날 5장면·3선택 저장은 legacy로 보존했다. DAY28의 관계·연락·접촉·집 초대·다음 만남·새 관계·공개·거리 handoff와 실제 옷·카드·사진·꽃·업무 메모 증거를 input seal에 동결한다. C9 저녁, C13 미래, C16 접촉, C17 숙박, C18 새 상대 답, C20 거짓말 정정은 각각 별도 현재 응답 전에는 성립하지 않는다. Friendly 집 저녁의 키스 수락/숙박 거절, 완전 Solo, 실제 아라 `NEED_TIME`, 입력 변조·legacy 분리 집중 검증을 통과했다. DAY29은 **PARTIAL**, 다음은 **SCENE01~09/C1~9 actual-history playable**이다.

DAY29 SCENE01~09 공통 생활 playable 완료(9/7): 의자 정리, 실제 옷·사진·카드·꽃, 업무 메모, 지출, 지훈 일정, 저녁 범위의 C1~9를 원문 순서와 whole-line source ref로 구현했다. 미구매 옷·미촬영 사진·미수령 카드·미구매 꽃·없는 회사 메모를 만들지 않고 해당 선택/장면을 보수적으로 축소·우회한다. 지훈을 모르면 SCENE08/C8을 건너뛰며 그의 편집 완료를 확정하지 않는다. C9 뒤에는 봉인된 하은/실제 새 상대의 현재 응답을 따로 기다리고, 수락 하은→SCENE10, 수락 새 상대→SCENE18, 혼자·거절·상대 없음→SCENE19로 교차한다. Friendly C1~9, 무소유 Solo, 실제 아라, 대상 변조와 source ref 집중 검증을 통과했다. DAY29은 **PARTIAL**, 다음은 **SCENE10~17/C10~17 하은 저녁 playable**이다.

DAY29 SCENE10~17 하은 저녁 playable 완료(9/7): 실제 하은 저녁 수락 뒤 집 초대 이력이 있으면 집 내부, 없으면 바깥 장면으로 C10~17을 분리했다. 바깥에서는 옷 갈아입기·방 안·냉장고·숙박을 만들지 않는다. C13의 선행 미래 합의 일치/변경과 하은의 현재 `CONTINUE/NEED_TIME/END`, C16 키스·포옹의 현재 동의, C17 숙박의 현재 동의를 독립 resolution으로 유지한다. 미래 변경은 생각할 시간을 보존하며 이후 다정한 밤을 중단하고, `KNOW_AGAIN` 또는 미정정 사실이 남은 경로는 SCENE16 친밀감으로 자동 승격하지 않는다. 숙박 수락은 실제 하은 집과 선행 `TOGETHER_IF_MUTUAL` 계획이 모두 있어야 한다. 집/바깥·대체 선택·미래 변경·친밀감 우회 source/state 집중 검증 PASS, game bridge 전이므로 실제 브라우저는 NOT RUN이다. DAY29은 **PARTIAL**, 다음은 **SCENE18~20/C18~20 새 관계·혼자·미정정 거짓말 playable**이다.

DAY29 SCENE18~20 새 관계·혼자·미정정 사실 playable 완료(9/7): SCENE18은 DAY28 handoff의 실제 유리·서진·아라 한 사람만 표시하고 C18 뒤 현재 응답 전에는 다음 만남이나 연애 이름을 확정하지 않는다. SCENE19는 혼자 저녁을 사람 응답 없이 완결하며, 지훈을 모르면 연락 선택을 숨기고 알아도 바쁘면 메시지만 남긴다. SCENE20은 실제 남은 거짓말의 수신자만 대상으로 대화 가능 여부와 `LISTEN/NEED_TIME/END`를 분리한다. 생각할 시간은 용서·다음 약속으로 바꾸지 않고, 새 약속 중지·회피도 정정 완료로 기록하지 않는다. 실제 아라·완전 Solo·바쁜 지훈·실제 서진 수신자 source/state 집중 검증 PASS, game bridge 전이라 실제 브라우저는 NOT RUN이다. DAY29은 **PARTIAL**, 다음은 **SCENE21~24/C21~23 공통 마무리·DAY30 handoff playable**이다.

DAY29 SCENE21~24 공통 마무리·DAY30 handoff playable 완료(9/7): C21은 확정 약속과 응답 대기 빈칸을 나누고 한 가지 우선순위만 남긴다. C22는 실제 가진 옷·사진·카드·꽃만 준비한다. C23은 하은의 현재 미래 답이 계속이고 실제 다음 약속/함께 머무름이 있거나, 새 상대의 C18 다음 만남 제안이 현재 수락된 경우에만 연다. Solo·거절·`NEED_TIME/END`는 상대용 선택을 건너뛰고 알람만 확인한다. SCENE24 원문 뒤에만 completion cue와 `tomorrowRecipient` DAY30 handoff를 만든다. 하은 숙박·Solo·아라 약속·하은 `NEED_TIME` source/state/완료 경계 집중 검증 PASS, game bridge 전이라 실제 브라우저는 NOT RUN이다. DAY29은 **PARTIAL**, 다음은 **game bridge·저장·presentation·Story/Free 연결**이다.

DAY29 game bridge·실제 Story 루프 연결 완료(9/7): opening·하은 저녁·새 관계/혼자/정정·공통 마무리를 phase별로 결합하고 검증된 DAY28 V4 완료 저장만 신규 DAY29에 진입시켰다. 저녁, 미래, 접촉, 숙박, 새 상대, 진실의 현재 응답을 runtime resolution으로 분리하며 실패는 chapter/history/pending을 원자 복원한다. 중간 SaveManager 왕복은 동일 segment와 시간·장소·인물 presentation을 재현하고 completion은 단일 DAY29 이력과 DAY30 hook만 기록한다. V4에는 legacy late-story 기록과 Free Action이 끼어들지 않는다. Friendly/Solo/실제 아라·실패·저장·완료·game wiring 집중 5/5 및 전체 Node·100회×30일 회귀 PASS, 캐시는 `game.js?v=290`이다. 실제 브라우저는 NOT RUN이므로 DAY29은 **PARTIAL**, 다음은 **Friendly 데스크톱 비-SKIP 완주·대표 중간 저장 재개**다.

DAY29 Friendly 실제 Chrome QA(9/7): 격리된 Chrome 152에서 AUTO OFF·SKIP 클릭 0회로 하은 집 저녁을 DAY30까지 완주했다(`day29/DAY29_V4_BROWSER_QA_2026-09-07.md`). 하은의 현재 저녁 수락·미래 `CONTINUE`·`KISS`·숙박 수락이 독립 반영됐고 `complete=true/day=30/day30Hook=true/tomorrowRecipient=HAEUN`을 확인했다. SCENE15/C15 reload 전후 `19:00 / girlfriend-home / 선택 13개 / 하은 표시`가 동일했으며 Story/Free 중첩·조치 가능한 console error/runtime exception 0, 격리 저장 복원 PASS다. DAY29은 **PARTIAL**, 다음은 **Neutral/Distant/Mixed 데스크톱 비-SKIP QA**다.

DAY29 데스크톱·389×844 모바일 종결(9/7): 같은 `game.js?v=290`에서 Neutral 하은 바깥 저녁, Distant Solo, Mixed 실제 아라를 데스크톱으로 완주하고 모바일에서는 Friendly를 포함한 네 경로를 다시 완주했다(`day29/DAY29_V4_BROWSER_QA_2026-09-07.md`). Neutral은 현재 키스가 있어도 다음 만남·숙박이 없어 `tomorrowRecipient=null`, Distant는 사람 응답 없음, Mixed는 아라의 현재 `ACCEPTED` 뒤에만 DAY30 수신자를 남겼다. 전 경로 AUTO OFF·SKIP 클릭 0회, Story/Free 중첩 0, 조치 가능한 console error/runtime exception 0건이며 모바일은 모든 프레임 `scrollWidth=clientWidth=389`, 저장 복원 PASS다. 원문·상태·플레이어블·브리지·전체 회귀·데스크톱/모바일 관문이 모두 닫혀 DAY29을 **PASS / COMPLETE**로 승격한다. 다음은 **DAY30 최종 Notion 원문 잠금과 DAY27~29 실제 이력 감사**다.

DAY30 최종 원문 잠금 및 구현 계획(9/7): Notion `DAY 30 — 오늘부터, 그다음 | SCENARIO V4`를 다시 조회해 내부 편집 메모·대체 V3와 분리한 플레이어 공개 snapshot을 `docs/scenarios/DAY30_SCENARIO_V4_NOTION.md`에 잠갔다. snapshot은 30 Scene, 28 choice block, SHA-256 `356623534957cd8a0d7393d3f79210c855145fd55a225d8b408689740e1c31f6`이며 하은의 준비/유예/장기 연애/이별, 유리·서진·아라, 알아가는 중, 혼자, 미정정 사실, 공통 생활·종결 variant를 source registry로 고정했다. 기존 예식 당일 5장면·3선택은 legacy로 보존하고 DAY27~29의 실제 관계·현재 응답·숙박·다음 약속·거짓말·일·돈·몸만 봉인하는 계획을 `day30/DAY30_V4_IMPLEMENTATION_PLAN_2026-09-07.md`에 기록했다. DAY30은 **PARTIAL / SOURCE LOCKED**, 다음은 **`day30-notion-v4/1` replay-locked 상태 계약**이다.

DAY30 replay-locked 상태 계약 완료(9/7): 검증·완료된 DAY29 V4와 DAY29→30 hook만 `day30-notion-v4/1` 신규 저장으로 열고 예식 당일 legacy 3선택 저장은 보존했다. DAY29의 실제 관계·접촉·숙박·다음 약속 상대·미래 합의·새 관계·미정정 사실·일·돈·몸을 input seal에 동결하고, 현재 만남·하은 미래·다음 약속·사실 정정·사진 동의를 각각 별도 resolution으로 분리했다. 실제 약속이 없으면 인물·공동 지출·연애 자기정의·함께 사진·달력 약속을 만들지 않으며 하은 준비/유예/장기 연애/이별, 실제 새 상대 한 사람, 알아가는 중, 혼자, 미정정 사실을 상호 배타 phase로 유지한다. Friendly·Solo·실제 아라·미정정 서진·입력 변조·legacy 집중 검증을 통과했다. DAY30은 **PARTIAL**, 다음은 **SCENE01~04/C1~4 공통 opening playable**이다.
