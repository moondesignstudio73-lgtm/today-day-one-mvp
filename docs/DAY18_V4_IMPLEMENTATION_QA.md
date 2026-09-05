# DAY18 V4 구현 및 검증 기록 — 2026-09-04

## 판정

PARTIAL. 「말하지 않은 저녁」의 새 런타임을 연결했다. DAY18 전체 원본 구현 완료나 DAY30 완성으로 간주하지 않는다. DAY19~30의 기존 요약 확대기는 이번 변경에서 교체하지 않았다.

## 구현 범위

- 원본 24개 장면을 원문 레지스트리로 잠그고, 화자가 명시된 대사만 승인 경로에서 선택한다. 나머지 원문은 비렌더링 sourceNote이며 자동 독백 변환하지 않는다.
- 유리/하은/혼자 식사, 아침 취소, 상대별 실제 발언/거짓말/정정, 서로 다른 밤 대화, 다음 날 여행 후보를 별도 스키마에 기록한다.
- DAY17의 하은 수락/거절과 인사만 한 유리 회상을 수정했다. 과거 저장의 누락된 수락은 생성하지 않는다.
- 연락 가능성을 연애 감정으로 바꾸지 않는다. 유리의 개인 독서 이야기를 들은 이력과 하은에게 유리를 말한 이력을 따로 확인한다.
- 실제 식당 배경과 인물, 아침/낮/저녁/밤 시간, 저장 재개, 완료 이력과 다음 날 이동을 연결한다. 기존 집 안전 점검 선택/보상은 적용하지 않는다.
- SKIP 도중 전환 타이머가 취소되며 검은 전환막이 남던 문제와 이전 장면 대사가 남던 문제를 수정했다. 다음 날에 전날 밤 시간이 남던 문제도 수정했다.

## 실행 증거

자동 테스트:

- `npm run check`: PASS.
- `node --test tests/*.test.mjs`: 415 PASS, 0 FAIL.
- DAY18 경로 540회: 유효 선택, 원본 인용 대사, 배타적 NPC, 결정적 재생과 완료 cue 검사. 실제 브라우저 완주 횟수가 아니다.
- 실제 SaveManager: 3식사 × 4선택 패턴에서 선택마다 저장/로드, 완료 중복 방지, DAY19 한 번 이동, 기존 안전 점검 효과 비적용 검사.
- 별도 반례: 미대면 유리, 수락 없는 약속, 관계 거짓말/정정, 무연락, 통화 종료, 손상 저장, 취소한 약속 회고, 개인 독서 회상.

실제 앱 브라우저 (`127.0.0.1:4174`, 별도 QA 저장):

| 경로 | 실제 관찰 | 결과 범위 |
| --- | --- | --- |
| 유리 | 첫 독백 일부 수동 진행, 약속 유지, 식당의 유리/19:00, 중간 저장 재개, 첫 선택 위주로 DAY19 이동 | 선택·SKIP 흐름 PASS |
| 하은 | 약속 유지, 술집의 하은/19:00, 좋은 마음/옆자리/여행 대화, DAY19 08:00 | 선택·SKIP 흐름 PASS |
| 혼자 | 식당 NPC 없음, 밤 김밥집/19:00, 식사 집중/냉장고/혼자 먹은 사실/생활 후보, DAY19 08:00 | 선택·SKIP 흐름 PASS |

세 경로 콘솔 오류/경고 조회 결과는 비어 있었다. 검은 전환막은 실제 재현 후 수정했고, 저장 재개 후 같은 SKIP 조작으로 식당 화면을 다시 확인했다. 스크린샷은 대화 도구 결과에 있다.

## 남은 게이트 — 완료 전에 필수

1. 원본 모든 문단을 플레이어 대사/독백/물건 행동/표정/환경음/조건/편집 메모에 대응시키고 누락을 해소한다. 현재 sourceNote를 숨기는 것만으로 원문 연출을 구현했다고 볼 수 없다.
2. Friendly/Neutral/Distant/Mixed 네 경로를 SKIP 없이 읽고 조작하며 DAY18 끝까지 검증한다. 위 SKIP 시험으로 대사 리듬·연출 품질을 입증하지 않는다.
3. 유리/하은/혼자 분기마다 아침·저녁·밤의 실제 브라우저 저장 재개, 거짓말/정정 화면을 검증한다.
4. 동네 산책 배경은 기존 동네의 밤 변형으로 교체했다. 분기별 실제 화면 최종 검토는 남았다.
5. DAY15~17의 남은 원본 충실도 및 입력 계약을 감사한다. 마지막 완전 구현 DAY 경계는 아직 확정하지 않는다.
6. DAY18 게이트 통과 후 DAY19 원본 전체를 같은 방식으로 구현한다. DAY30 이후 NEW GAME→ENDING 4경로가 필요하다.

## game241 후속 — SCENE20~24 방 행동과 암전

- 기존 개인 메모·컵 씻기·여행 사진을 중복 제작하지 않고, 화면 닫기·옷장 확인·책상 정리·취침 준비·알람 설정을 일반 대화 밖 `roomActionCue`로 연결했다.
- 새 손 CG 없이 기존 방 배경의 시선 이동과 전화 화면 소리로 처리해 손 화풍 회귀 범위를 늘리지 않았다.
- 마지막 두 독백 동안 1.4초 암전을 유지하고 장면 완료·SKIP에서 cue 상태를 정리한다.
- 대상 63 PASS, `npm test`, `node --check game.js`, `git diff --check` PASS.
- 실제 SOLO 비-SKIP: 선택 13 `지금 생활` → 화면 닫기 → 책상 정리 → 취침 준비 → 암전 → 마지막 독백 → DAY19 전환. DAY19에서 암전 잔류 없음, 사용자 저장 복원 PASS.
- DAY18 전체는 PARTIAL. 남은 SCENE09·13·16·19와 SCENE11 겉옷 감사, 동일 game241의 4경로·모바일 최종 QA가 필요하다.

## 신규 자산

- 실행 모드: built-in imagegen 편집, 기존 배경 참조.
- 입력: `assets/backgrounds/map-locations/002_gimbap-village.png`
- 저장: `assets/backgrounds/map-locations/002_gimbap-village-evening-v1.png`
- 용도: DAY18 혼자 저녁. 기존 파일은 변경하지 않았다. 생성 결과와 실제 게임 화면을 시각 확인했다.

최종 프롬프트:

> Use case: lighting-weather. Edit target: attached existing Korean gimbap restaurant game background. Create one evening/night lighting variant for DAY18 story dinner. Change ONLY time of day and illumination: outside windows dark blue after sunset, no daylight beams; warm practical ceiling lights illuminate the restaurant naturally. Preserve exact restaurant architecture, camera composition, furniture, gimbap display, materials, illustration/render style, empty room without people, landscape 16:9 framing. No new objects, signage, lettering, UI or watermark. It must still be recognizably the same existing restaurant.

## game248 종결 판정 — 2026-09-05

- 이 문서 상단의 PARTIAL은 2026-09-04 최초 구현 시점 기록이다. 이후 SCENE01~24 행동 연출, 손 화풍 교정, 알람 입력·전용 소리, 겉옷 연속성, 네 성향 데스크톱 비-SKIP 완주와 세 대표 저장 재개를 완료했다.
- DAY15·16·17 원문 충실도 재감사를 각각 PASS/COMPLETE로 닫았다.
- 전용 viewport로 유효 `389×844`(목표 390×844의 1px 렌더링 반올림) 모바일 미디어쿼리를 활성화하고 Friendly/Neutral/Distant/Mixed를 각각 비-SKIP으로 DAY19까지 완주했다. 네 경로 가로 넘침 0, console warning/error 0이다.
- 경로별 QA 저장은 매번 사용자 저장으로 복원했고 마지막에 임시 viewport도 reset했다.
- 세부 증거: `DAY18_V4_ROUTE_FINAL_QA.md`.

따라서 DAY18 V4는 **PASS / COMPLETE**다. 이 판정은 DAY19~30 완료를 뜻하지 않으며 다음 구현은 DAY19 원문 잠금·직전 3일 입력 감사부터 시작한다.
