# DAY 1 출시 완성도 진행표

현재 상태: `PHASE 14 포즈 명세 완료 / 이벤트 CG 선정 대기`

DAY 1이 모든 관문을 통과하고 사용자 최종 승인을 받기 전에는 DAY 2 이후의 신규 스토리·콘텐츠를 구현하지 않는다. 이미 존재하는 DAY 2~5 코드와 미커밋 DAY 3 변경은 삭제하거나 확장하지 않고 동결한다.

## 시나리오 관문

- [x] PHASE 1 — 원본 전체 분석
- [x] PHASE 2 — 개연성 검사
- [x] PHASE 3 — 정보 공개 속도 검사
- [x] PHASE 4 — 캐릭터 일관성 검사
- [x] PHASE 5 — 감정선 검사
- [x] PHASE 6 — 선택지 전수 검사
- [x] PHASE 7 — 복선 검사
- [x] PHASE 8 — 플레이타임 구조 검사
- [x] PHASE 9 — 시나리오 수정본 작성
- [x] PHASE 10 — 수정본 연속 플레이 재검수
- [x] PHASE 11 — 사용자 승인 후 `DAY 1 — SCENARIO LOCK`

## 제작 관문

- [x] PHASE 12 — 배경 에셋 명세
- [x] PHASE 13 — 캐릭터 표정 명세
- [x] PHASE 14 — 포즈 명세
- [ ] PHASE 15 — 이벤트 CG 선정 및 프롬프트
- [ ] PHASE 16 — 기존 에셋 감사 후 생성·수급
- [ ] PHASE 17 — 이미지 일관성·품질 검사
- [ ] PHASE 18 — Scene별 애니메이션·연출 명세
- [ ] PHASE 19 — BGM·SFX 명세 및 적용
- [ ] PHASE 20 — 실제 게임 구현

## 최종 검수 관문

- [ ] PHASE 21 — 처음부터 끝까지 실제 플레이 QA
- [ ] PHASE 22 — 일반 읽기 속도 플레이타임 측정
- [ ] PHASE 23 — STORY/VISUAL/DIRECTION/AUDIO/GAMEPLAY/UX/BUG 전 항목 PASS
- [ ] PHASE 24 — 사용자 최종 승인 후 `DAY 1 — COMPLETE`

## 현재 산출물

- `docs/day1/DAY1_SCENARIO_AUDIT.md`
- `docs/day1/DAY1_SCENARIO_REVISION_V1.md`
- `docs/day1/DAY1_SCENARIO_QA_V1.md`
- `docs/day1/DAY1_BACKGROUND_ASSET_SPEC.md`
- `docs/day1/DAY1_CHARACTER_EXPRESSION_SPEC.md`
- `docs/day1/DAY1_CHARACTER_POSE_SPEC.md`

## 최근 검증

- PHASE 10에서 3×3 선택 조합의 정보 연속성과 공통 합류를 전수 검수했다.
- 가족 정보를 먼저 묻지 않은 분기의 선행 지식 오류를 수정하고 양쪽 조건 도입이 모두 존재함을 확인했다.
- 근거 없는 병원 고유명사를 제거했다.
- 수정본에 6개 Scene, 실제 스크립트 내 2개 선택 시점, 6개 전략 분기와 `DAY 1 END`가 존재하는지 확인했다.
- 플레이어 대사에 미확정 트럭 충돌·하은 동승·주인공 보호 행동, 가짜 하은 정체, 잠금 프로필 정보가 노출되지 않음을 확인했다.
- `node --check game.js`: 통과.
- `node --check src/story-data.mjs`: 통과.
- `tests/simulation.test.mjs` 전체 회귀: 통과.
- PHASE 14에서 6개 Scene의 거리·접촉·의료 안전 행동을 하은 9포즈, 담당 의사 2포즈, 간호사 3포즈와 주인공 1인칭 손 3상태에 매핑했다.
- 첫 접촉 선택 3종이 SCENE 01의 물러나는 거리와 SCENE 05의 컵 보조 허락 방식에서 시각적으로 구분되도록 했다.
- PHASE 14 필수 ID·선택 상태·6개 Scene·하은 9포즈 정적 검사: 통과.
- `node --check game.js`, `node --check src/story-data.mjs`: 통과.
- `tests/simulation.test.mjs` 전체 회귀: 통과.
- PHASE 13에서 잠금된 6개 Scene의 감정 전환을 하은 8종, 담당 의사 3종, 간호사 2종의 표정 큐에 매핑했다.
- 첫 접촉 선택 3종이 서로 다른 즉시 표정과 공통 합류 표정을 가지며, 초기 악역 코딩·과장된 의료진 감정·얼굴 일관성 붕괴를 막는 규칙을 명시했다.
- PHASE 13 필수 ID·선택 상태·6개 Scene 매핑 정적 검사: 통과.
- `node --check game.js`, `node --check src/story-data.mjs`: 통과.
- `tests/simulation.test.mjs` 전체 회귀: 통과.

## 다음 작업

잠금된 시나리오와 PHASE 12~14 명세를 기준으로 PHASE 15 이벤트 CG 필요 장면을 선정하고 제작 프롬프트를 작성한다. 기존 에셋 감사나 신규 생성은 PHASE 16에서 진행한다.
