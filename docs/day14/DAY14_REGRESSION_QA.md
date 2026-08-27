# DAY 14 집중 테스트·전체 회귀 QA

상태: `FOCUSED / FULL REGRESSION PASS`

DAY 14 NEEDS FIX: 0

## 집중 검증 결과

- DAY 14 계약·초안·잠금 시나리오·프레젠테이션·이미지·런타임 6개 집중 테스트 PASS.
- 8개 `ready` Scene, 17개 생활 SFX, DAY 13 9콜백, DAY 14 27개 선택 경로와 stage 1·2·3 실제 저장 복원 PASS.
- DAY 13→14→15 도달, 최종 선택 단일 기록, 레거시 DAY 14 저장의 stage 0 복원 PASS.
- 하은 관계 수치, 윤서진 `seojinAffection`/`seojinStatusInterest`, DAY 11·13 선택 기억 불변 PASS.
- 자동결제·고가 구매·투자·하은 잠금 프로필·진실/최종 선택 잠금 PASS.
- 자유 연애 모드 격리, DAY 14 자유행동·저장 결제 경계 이벤트, DAY 2~30 자유행동 데이터 감사 PASS.

## 인접·전체 회귀 결과

- `tests/day13-runtime.test.mjs`, `tests/day13-regression.test.mjs`: DAY 13 저장·선택·DAY 14 도달성 PASS.
- `tests/day15-runtime.test.mjs`: DAY 15 잠금 Scene과 DAY 14 선택 후속 계약 PASS.
- `tests/module-entrypoint.test.mjs`: 브라우저 엔트리 모듈 90개 경로 PASS.
- `tests/simulation.test.mjs`: 100회×30일 자동 시뮬레이션, 상태 범위, 저장/불러오기, 엔딩·경제·이벤트·에셋 회귀 PASS.
- `git diff --check`와 `game.js`, DAY 14 런타임·프레젠테이션·회귀 테스트 Node 문법 검사 PASS.

## 스토리 안전 회귀

- 출처 없는 추천은 `unverified`이며 현재 구매 판단과 분리된다.
- DAY 14 플레이어 노출 텍스트에서 사고 고의성, 책임 주체, 하은 정체, 잠금 프로필을 조기 공개하지 않는다.
- 하은의 밝고 생활적인 23세 톤과 주인공의 관찰→가능성→확인→판단→행동을 보존한다.

## 추가 전체 테스트 파일 감사 관찰

- 필수 범위를 넘어 저장소의 모든 `*.test.mjs` 109개 순차 실행도 시도했다.
- DAY 14 및 앞서 실행된 테스트들은 PASS했으나 `tests/day1-hospital-night.test.mjs`가 현재 `index.html`의 `game.js?v=166`보다 오래된 `v=165`를 기대해 중단됐다.
- 이는 DAY 14 제품 동작 결함이 아닌 완료된 DAY 1 테스트의 정적 캐시 버전 불일치다. 현재 DAY 파일만 커밋한다는 보호 원칙에 따라 DAY 1 테스트나 `index.html`을 변경하지 않았다.
- 재개 조건: DAY 1 유지보수 범위에서 해당 기대값을 현재 캐시 버전과 맞춘 뒤 109개 일괄 실행을 재시도할 수 있다. DAY 14 필수 집중·인접·전체 시뮬레이션 결과에는 영향이 없다.

## 다음 관문

- 실제 브라우저에서 DAY 13→14 연속 진입, 세 선택, 첫 선택 뒤 새로고침·이어하기, SKIP, 자유행동, DAY 15 진입과 시각·오디오·콘솔 상태를 확인한다.
