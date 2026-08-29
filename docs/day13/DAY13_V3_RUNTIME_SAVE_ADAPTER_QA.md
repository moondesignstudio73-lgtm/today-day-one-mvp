# DAY 13 V3 런타임·저장·어댑터 QA

상태: `PASS`  
검증 시각: `2026-08-30 01:09 KST`

## 원고 잠금

- 작업 직전 Notion `DAY 13 — 모르는 사람에게는 | SCENARIO V3` 하위 페이지 본문 전체 22,074자를 새로 완전 조회했다.
- SCENE 01~24, 선택 1~12, 아라의 독립성·촬영 동의·연락 범위·하은 보고 차이를 최우선으로 사용했다.
- 상위 `AI해커톤` 페이지의 Markdown 첨부는 무시했다.

## 런타임

- `src/day13-v3-runtime.mjs`는 V3 신규 진행과 DAY 13 가계 예산 V1 레거시 저장을 자동 구분한다.
- 서울숲만 선택 3과 아라 만남을 열고, 조기 이탈은 선택 8~9를 건너뛴다.
- 아라 미대면 경로에서는 선택 3·8·9·12와 `아라를 만났다` 보고 선택을 만들지 않는다.
- 선택 6의 초상 동의, 선택 10의 사진 전달과 공개 권한, 선택 11~12의 하은 보고·설명 차이를 별도 저장한다.
- 윤서진 `AFFECTION`과 `STATUS_INTEREST`는 시작 시 각각 보존값으로 기록되며 DAY 13 선택으로 변하지 않는다.

## 저장 복원

- 매 선택 직후 SaveManager 왕복 복원을 수행해 다음 선택 번호, 장면 체크포인트, 아라 대면·조기 이탈·초상·연락·하은 보고 상태를 확인했다.
- 서울숲 전체 경로는 선택 12 뒤 SCENE 24에서 완료되며 `ARA_MET` 콜백과 조건부 플로라 초대를 남긴다.
- 동네/집 미대면 경로는 실제 존재하는 8개 선택만 완료하고 `NO_ARA` 콜백을 남긴다.
- 기존 V1 `day13RuntimeStage`·가계 예산 선택은 변환하거나 덮어쓰지 않는다.

## 몰입형 어댑터

- `src/day13-v3-immersive-adapter.mjs`는 24개 장면의 분기 배경, CG, BGM/SFX, 대사·메시지·선택을 런타임 단계로 변환한다.
- 미대면의 SCENE 06은 완전히 생략하며 아라 전용 CG를 표시하지 않는다.
- SCENE 24는 실제 초상 존재 여부에 따라 현재 얼굴/빈 풍경 CG를 분리한다.
- 보류 중인 아라 스프라이트는 `ready-new`가 되기 전에는 `characterEnter`로 삽입하지 않아 불투명 참고 이미지나 실패 후보가 런타임에 노출되지 않는다.

## 검증

- 신규 구문 검사: `PASS`.
- DAY 13 V3 데이터·전후반 대본·프레젠테이션·런타임 저장·몰입형 어댑터: `6 PASS / 0 FAIL`.
- 기존 DAY 13 V1 계약·프레젠테이션·런타임·저장·대본·내러티브 회귀 포함 집중 검사: `12 PASS / 0 FAIL`.
- `git diff --check`: `PASS`.

## 남은 관문

- 본 감사 당시 아라 투명 전신 스프라이트는 보류 상태였다. 이후 기존 DAY 1~2의 결정적 체크무늬 제거 경로로 `887×1774 RGBA` 결과를 확보해 `ready-new`로 전환했다.
- 다음 관문은 실제 브라우저 데스크톱·모바일 전체 진행과 장면 전환·크롭·콘솔 QA다. DAY 14는 시작하지 않는다.

## 게임 컨트롤러·실제 재진입 연결 — 2026-08-30 01:17 KST

- `game.js`가 DAY 13 진입 시 `getDay13V3Compatibility`로 V3 신규/진행 중/V1 레거시를 구분한다.
- 신규 저장은 관계 밴드와 함께 `beginDay13V3`를 호출하고, 저장 체크포인트에서는 `getDay13V3ResumePresentation`과 `getDay13V3ImmersiveSegment`로 재진입한다.
- 선택 직후 `applyDay13V3Choice` → SaveManager 저장 → `getDay13V3ChoiceContinuation` 순서로 다음 장면을 이어 간다.
- V1 가계 예산 저장은 기존 `applyLockedDay13ChoiceState`·`getLegacyDay13Segment` 경로만 사용한다.
- V3 완료도 기존 스토리 완료 기록과 pending 해제를 수행하지만, V1 전용 `day13-home-evening` 자유행동은 V3에 붙지 않는다.
- `game.js` 구문 검사와 DAY 13 V3/V1 집중 검사 `12 PASS / 0 FAIL`, `git diff --check` PASS다.
