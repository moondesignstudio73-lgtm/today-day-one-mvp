# DAY 16 V4 충실도 재감사 — 2026-09-05

## 판정

**PASS / DAY 16 충실도 감사 종료.** 현재 신규 진행은 Notion V4의 24개 Scene, 12개 선택과 지훈 동석·혼자 카페·집 경로를 사용한다. 기존 V1은 저장 복원 전용으로 격리되어 있고 현재 코드에서 회귀는 발견되지 않았다.

## 기준 원문

- Notion page id: `3c9c31f0-29a6-81a9-a067-d92edc10b353`
- title: `DAY 16 — 잊힌 사람의 이름 | SCENARIO V4`
- last edited snapshot: `2026-08-27T19:49:09.165Z`
- 선언 본문: 16,646자
- 구조: 24 Scene / 12 Choice
- 로컬 source lock: `DAY16_NOTION_SOURCE_LOCK_V4.md`

2026-09-05에 상위 Notion 페이지 안에서 DAY 16을 다시 검색하고 페이지 전체를 재수신했다. page id와 snapshot, 선언 본문 길이, Scene/Choice 구조는 source lock과 같다. 커넥터의 page wrapper 길이는 조회 시점에 따라 달라질 수 있으므로 동일성 근거로 쓰지 않았다.

## 원문 계약 대조

| 계약 | 현재 구현 판정 |
| --- | --- |
| 외출 지훈 동석·외출 혼자·집을 선택 1에서 분리한다 | PASS |
| 카페 경로만 유리를 만나고 집 경로는 이름·연락·초대를 만들지 않는다 | PASS |
| 대화 거절은 SCENE 06~15를 건너뛰고 실제 인사만 보존한다 | PASS |
| 유리의 개인 기억을 이별·사고의 객관적 진상으로 확정하지 않는다 | PASS |
| 선택 8은 카페/집의 배타적 대체 선택이며 두 번 재생하지 않는다 | PASS |
| 하은 연락 휴식과 현재 관계 종료를 거짓 안부·연인 발화로 덮지 않는다 | PASS |
| 지훈은 실제 동석 때만 등장하고 이름 외 관계 세부를 대신 설명하지 않는다 | PASS |
| 연락·다음 대화·모레 식사 제안을 별도 동의로 보존한다 | PASS |
| 하은은 만남 허가권자가 아니며 실제 공개 범위만 안다 | PASS |
| DAY 17에는 조건부 모레 제안과 몸의 피로만 넘기고 DAY 18 약속을 확정하지 않는다 | PASS |
| 신규 로맨스·스킨십·전 연인 자동 복원을 만들지 않는다 | PASS |

## 코드·회귀 증거

- 전반 exact source SHA-256: `7774f81fb69330297e71ad40538ad4d8d973be953c2e92f021e0337f07f6a991`
- 후반 exact source SHA-256: `c4dffb6019684618ce2ad7d9e5dd3de82616210fa2f9a3cb2869499e16aba141`
- 2026-09-05 현재 DAY 16 V4 + Story/Free 배타성 집중 테스트: **67/67 PASS**.
- 상태·지식·V1 레거시, exact registry, resolver, 선택 반응, continuation, scene step, runtime, presentation, game bridge, 실제 `game.js` 진입을 포함한다.
- 공개 릴리스 기록상 solo-cafe와 home 실제 UI 완주, warning/error 0건, 당시 집중 66/66·전체 358/358, 동일 SHA 배포와 공개 검증이 PASS했다. 기준 릴리스 SHA는 `e509936f81eb76485b5ef390e58643c09e2e84d9`다.

## 권위 원문 공백의 처리

현재 관계가 이미 끝난 경로에서 선택 6 첫 버튼의 대체 표기는 구현 메모에 있으나, 유리의 완전한 반응 대본은 원문에 없다. 기존 현재 연인 반응을 재사용하거나 새 반응을 발명하지 않고 그 한 옵션만 게임 표면에서 숨기며 직접 선택도 거부한다. exact registry는 이 공백을 계속 노출한다. 이는 공개 릴리스 때 승인된 fail-closed 처리이며 이번 재감사에서도 그대로 유지한다.

## 문서 우선순위 정리

`DAY16_NOTION_SOURCE_LOCK_V4.md`의 `PLAYABLE V4 IMPLEMENTATION NOT STARTED`, `DAY16_V4_IMPLEMENTATION_GAP_CONTENT_COVERAGE_AUDIT.md`의 `RELEASE PENDING`은 중간 관문 기록이다. 이후 `CAMPAIGN_DAY_RELEASE_PROGRESS.md`의 `DAY 16 V4 PUBLIC RELEASE COMPLETE`와 이번 재검증이 완료 상태의 최신 근거다.

## 다음 작업

DAY 17 Notion 원문 전체를 같은 절차로 다시 대조하고, 현재 24 Scene/12 Choice 구현·대면/미대면·유리 초대/미초대·저장 및 Story/Free 배타성 계약의 회귀 여부를 확인한다.
