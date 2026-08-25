# DAY 6 실제 브라우저 연속 플레이 QA

검수일: 2026-08-26  
대상: 로컬 최신 빌드, STORY MODE DAY 5 완료 저장 → DAY 6 → DAY 7

## 결과

- PASS — DAY 5 완료 상태에서 DAY 6 토요일 및 첫 경로 선택으로 진입한다.
- PASS — 경로·장보기·현재형 데이트의 3개 전략 선택 화면과 문구가 순서대로 표시된다.
- PASS — 각 선택에서 SKIP이 다음 선택 직전의 배경·인물 프레젠테이션을 적용한다.
- PASS — 첫 선택 직후 저장하고 장보기 선택 화면까지 진행한 뒤 불러오면 저장된 Scene 시작점에서 재개된다.
- PASS — 인페이지 불러오기 뒤 전환막이 2초 이내 사라지고 입력 잠금이 남지 않는다.
- PASS — 상단 MENU가 하나만 표시되고 저장·불러오기 시스템 메뉴를 연다.
- PASS — 세 선택을 완료하면 DAY 7 · 일요일, D-24로 진행한다.

## 발견 및 수정

1. 진행 중인 장면에서 불러오면 기존 `sceneAdvanceTimer`와 전역 `eventRuntime`이 남아 `DAY 6 · 우리가 사는 동네` 전환막이 고정됐다.
   - `resetActiveRuntimeForLoad`에서 장면·대사·AUTO 타이머, 전환막, 선택층과 전역 런타임을 정리한 후 저장 상태를 복구하도록 수정했다.
2. 일반 MENU와 스토리 MENU가 같은 상단 영역에 중복 노출됐고 스토리 MENU 클릭 경로가 불안정했다.
   - STORY MODE에서는 동작이 검증된 일반 MENU 하나만 노출하고 전용 툴바의 중복 MENU를 숨겼다. AUTO·SKIP·LOG·전체화면은 전용 툴바에 유지한다.
3. 브라우저가 이전 `game.js` 모듈을 보관하지 않도록 모듈 캐시 버전을 `v=113`으로 갱신했다.

## 자동 검증

- `node --check game.js` — PASS
- `node tests/day6-runtime.test.mjs` — PASS
- `node tests/simulation.test.mjs` — PASS

결론: DAY 6 실제 브라우저 연속 플레이 관문 PASS. 다음 관문은 검증 변경 커밋과 원격 병합·push·gh-pages 배포다.
