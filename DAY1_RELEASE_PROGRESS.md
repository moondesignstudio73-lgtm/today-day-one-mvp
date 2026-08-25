# DAY 1 출시 완성도 진행표

현재 상태: `PHASE 19 BGM·SFX 명세 및 적용 완료 / PHASE 20 대기`

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
- [x] PHASE 15 — 이벤트 CG 선정 및 프롬프트
- [x] PHASE 16 — 기존 에셋 감사 후 생성·수급
- [x] PHASE 17 — 이미지 일관성·품질 검사
- [x] PHASE 18 — Scene별 애니메이션·연출 명세
- [x] PHASE 19 — BGM·SFX 명세 및 적용
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
- `docs/day1/DAY1_EVENT_CG_SPEC.md`
- `docs/day1/DAY1_ASSET_AUDIT.md`
- `docs/day1/DAY1_IMAGE_QUALITY_QA.md`
- `docs/day1/DAY1_DIRECTION_SPEC.md`
- `docs/day1/DAY1_AUDIO_SPEC.md`

## 최근 검증

- PHASE 10에서 3×3 선택 조합의 정보 연속성과 공통 합류를 전수 검수했다.
- 가족 정보를 먼저 묻지 않은 분기의 선행 지식 오류를 수정하고 양쪽 조건 도입이 모두 존재함을 확인했다.
- 근거 없는 병원 고유명사를 제거했다.
- 수정본에 6개 Scene, 실제 스크립트 내 2개 선택 시점, 6개 전략 분기와 `DAY 1 END`가 존재하는지 확인했다.
- 플레이어 대사에 미확정 트럭 충돌·하은 동승·주인공 보호 행동, 가짜 하은 정체, 잠금 프로필 정보가 노출되지 않음을 확인했다.
- `node --check game.js`: 통과.
- `node --check src/story-data.mjs`: 통과.
- `tests/simulation.test.mjs` 전체 회귀: 통과.
- PHASE 17 QA 문서 필수 판정·교체 CG 2파일 존재·최소 크기 정적 검사: 통과.
- PHASE 17 진행 기록 후 `node --check game.js`, `node --check src/story-data.mjs`, `tests/simulation.test.mjs` 전체 회귀: 통과.
- PHASE 17 최종 파생 PNG 26파일의 RGBA·alpha extrema·최소 크기, 표정 8·포즈 9·의료진 6 파일 수, 병실 합성 QA 3장 검사: 통과.
- PHASE 18에서 잠금된 6개 Scene을 36개 의미 단위 Beat로 나누고 카메라, 입퇴장, 거리, 표정·포즈 전환, CG 삽입과 입력 규칙을 명세했다.
- 첫 접촉 3전략과 첫 질문 3전략의 즉시 연출·공통 합류·거리 콜백, 선택 직전/직후 저장 복원 계약을 정의했다.
- 기존 단일 캐릭터 렌더러와 DAY 1 명세의 차이를 감사하고 PHASE 20의 다중 레이어·큐 러너·CG·감소 모션 최소 구현 범위를 분리했다.
- PHASE 18 명세의 6개 Scene, 선택 6분기, 승인 에셋·CG 3종, 스킵·입력 잠금·감소 모션·저장 복원·폴백 규칙 정적 검사: 통과.
- PHASE 19에서 기존 `theme-1`을 연속 테마로 선정하고 30일 공개 전후에도 공포 BGM으로 전환하지 않는 9개 BGM Beat 계약을 정의했다.
- 병실 앰비언스 1종과 생활·의료 SFX 8종을 22,050Hz mono PCM WAV로 비파괴 생성하고 10개 Beat에 매핑했다.
- DAY 1 큐 재생·정지, 루프 중복 방지, 전체 음소거 정리와 동일 BGM의 무재시작 볼륨 조절을 음향 관리자에 적용했다.
- WAV 9종 SHA-256 재생성 일치, 오디오 집중 검사, `node --check game.js`, `node --check src/story-data.mjs`, 전체 시뮬레이션 회귀: 통과.
- `scripts/process-day1-sprites.py` 재실행 재현성·문법 검사, `node --check game.js`, `node --check src/story-data.mjs`, `tests/simulation.test.mjs` 전체 회귀: 통과.
- PHASE 16에서 기존 배경·하은·의료진·CG·렌더러를 감사하고 재사용·제한 재사용·탈락을 구분했다.
- 병실 배경 2종, 하은 표정·포즈 소스 2종, 의료진 소스 1종, 이벤트 CG 3종의 신규 후보 8파일을 프로젝트에 수급했다.
- 신규 후보는 기존 자산을 덮어쓰지 않았으며 PHASE 17 품질 검사 전에는 런타임에 연결하지 않는다.
- 후보 8파일의 존재·최소 파일 크기와 감사 문서의 재사용·배제·품질 검사 이관 규칙 정적 검사: 통과.
- `node --check game.js`, `node --check src/story-data.mjs`: 통과.
- `tests/simulation.test.mjs` 전체 회귀: 통과.
- PHASE 15에서 첫 눈맞춤·컵 보조·30일 재판단의 2개 핵심 CG와 1개 디테일 컷인을 선정했다.
- 각 이미지의 공통 참조 기준, 정보 공개 제한, 생성·네거티브 프롬프트와 합격 기준을 정의하고 PHASE 16 감사 전 신규 생성을 금지했다.
- PHASE 15 CG ID 3종·생성/네거티브/합격 기준 각 3세트·PHASE 16 이관 규칙 정적 검사: 통과.
- `node --check game.js`, `node --check src/story-data.mjs`: 통과.
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

PHASE 20에서 잠금된 DAY 1 전체 대사·선택·상태를 6개 Scene과 36개 연출 Beat, 승인 이미지 및 PHASE 19 오디오 큐에 실제 연결한다.
