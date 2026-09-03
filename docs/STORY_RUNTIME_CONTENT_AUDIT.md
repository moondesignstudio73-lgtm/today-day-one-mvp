# STORY RUNTIME CONTENT AUDIT

## Root cause

- `story-data.mjs`의 `message`는 장면 설계 요약인데 범용 Scene 생성기가 이를 `narration`으로 자동 승격했다.
- DAY 6~14 원고 어댑터는 `dialogue`와 `message`가 아닌 원고 요소까지 `narration`으로 폴백해 연출 지시와 문서 메타데이터를 플레이어 큐에 넣을 수 있었다.
- 대화 렌더러가 `stageDirection`과 `section`도 내레이션처럼 표시했고, 플레이어 출력 타입을 허용 목록으로 제한하지 않았다.
- 일부 레거시 DAY 런타임에는 `DAY N에/에서/의…` 형태의 연속성 요약과 `DAY REPORT`가 직접 플레이어 텍스트로 작성돼 있었다.

## Incorrect player-facing texts found

- `DAY 17에 준비한 집 안전 목록은…` 원문.
- DAY 5~19 레거시 런타임의 번호 기반 이전 DAY 요약과 다음 DAY 예고.
- `DAY REPORT` 형식의 등장인물·상태 요약.
- 범용 Scene `message`에 저장된 장면 목적·상태 설명.
- MBTI·관계 수치 반영 설명과 선택 결과를 해설하는 메타 내레이션.
- 원고의 `action`, `stageDirection`, `section`, 알 수 없는 메타 타입을 내레이션으로 바꾸던 어댑터 폴백.

## DAYs affected

- 직접 데이터 수정: DAY 5~19 중 번호 기반 연속성 문구가 있었던 DAY 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19.
- 구조적 위험 범위: 범용 Scene 생성기를 사용하는 전체 DAY 및 DAY 6~14 원고 어댑터.

## Parser fixes

- 플레이어 출력 허용 타입을 `dialogue`, `message`, `narration`, `monologue`로 제한했다.
- `stage`, `stageAction`, `stageDirection`, `section`, `metadata`, `designNote`, `devNote`, `continuityNote`, `implementationNote`, `testNote`, `flag`, `stateMutation`, `choiceCue`, `sceneBoundary`는 내부 타입으로 분리했다.
- DAY 6~14 어댑터는 공용 typed projection을 사용하며, `action`/`stageDirection`은 `stageAction`, 알 수 없는 타입은 `metadata`로 투영한다.
- 개발 문서 스타일 내레이션을 감지하는 방어 규칙을 추가했다.

## Story data fixes

- 번호 기반 이전 DAY 요약을 실제 물건·화면·행동이 보이는 현재 장면 문장 또는 자연스러운 대사로 변경했다.
- DAY 5의 `DAY REPORT`를 플레이어 텍스트가 아닌 `continuityNote`로 변경했다.
- DAY 18의 네 개 세그먼트에서 문서 요약을 제거하고 약봉투, 충전선, 매트, 약 서랍, 비상 카드, 도어락 앱을 실제로 다루는 장면으로 교체했다.

## Scenes rewritten

- DAY 18 SCENE 01~08: 집 안전 목록 해설을 삭제하고 실제 대화·물건 상호작용·3개 선택·각 선택 후 반응으로 재작성했다.
- DAY 5~19의 레거시 연속성 도입·예고 문구를 현재 장면에 맞게 교정했다.

## Conditional-history fixes

- DAY 18은 DAY 17 완료 기록이 없으면 선택되지 않는다.
- DAY 18 시작부는 이전 선택을 경험했다고 가정하는 회상을 사용하지 않고, 약 보관을 지금 처음 논의하는 장면으로 시작한다.
- 원고 V3/V4 경로의 기존 호환성·체크포인트 검증은 유지하며, 경로에 없는 원고 요소는 fail-closed 상태로 남는다.

## Regression tests

- 콘텐츠 정책 전용 테스트 9개: 허용/금지 타입, 어댑터 투영, 개발 문구 차단, DAY 18 재작성, 조건부 진입, Story/Free Action 분리 계약.
- 전체 테스트: 373/373 PASS.
- `npm test`: PASS.
- `npm run check`: PASS.
- `git diff --check`: 오류 없음.
- 실제 제품 UI에서 현재 구현 감사 범위인 DAY 1~18을 각각 열어 첫 선택까지 플레이했다. 모든 DAY가 선택지에 도달했고 금지 문구는 0건이었으며, Story 진행 중 Free Action 레이어는 모두 숨겨져 있었다.
- DAY 18은 첫 선택을 누른 뒤 약 서랍 Scene과 두 번째 선택까지 추가 플레이해 선택별 반응·후속 Scene 연결을 확인했다.

## Remaining problematic DAYs

- 이번 감사에서 정의한 개발 문서/연속성 메모 노출 기준으로 남은 DAY 없음.
- DAY 18 이후의 장편 원고 확장 작업은 별도 구현 계획에 따라 진행하며, 이 감사 규칙을 선행 게이트로 유지한다.

## RESULT

PASS
