# DAY 1 출시 완성도 진행표

현재 상태: `PHASE 9 수정본 작성 완료 / 연속 플레이 재검수 대기`

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
- [ ] PHASE 10 — 수정본 연속 플레이 재검수
- [ ] PHASE 11 — 사용자 승인 후 `DAY 1 — SCENARIO LOCK`

## 제작 관문

- [ ] PHASE 12 — 배경 에셋 명세
- [ ] PHASE 13 — 캐릭터 표정 명세
- [ ] PHASE 14 — 포즈 명세
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

## 최근 검증

- 수정본에 6개 Scene, 실제 스크립트 내 2개 선택 시점, 6개 전략 분기와 `DAY 1 END`가 존재하는지 확인했다.
- 플레이어 대사에 미확정 트럭 충돌·하은 동승·주인공 보호 행동, 가짜 하은 정체, 잠금 프로필 정보가 노출되지 않음을 확인했다.
- `node --check game.js`: 통과.
- `node --check src/story-data.mjs`: 통과.
- `tests/simulation.test.mjs` 전체 회귀: 통과.

## 다음 작업

`docs/day1/DAY1_SCENARIO_REVISION_V1.md`를 실제 플레이어가 처음부터 연속해서 읽는 관점으로 재검수한다. 아직 게임 데이터에 연결하거나 `SCENARIO LOCK`으로 지정하지 않는다.
