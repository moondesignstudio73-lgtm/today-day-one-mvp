# DAY26 V4 실제 브라우저 QA — 2026-09-06

## Friendly · 네 사람 식사 · 데스크톱

- 진입: 검증된 DAY25 V4 완료 fixture, `day25Route=MARRIAGE_PREPARATION`, 관계 지속, 지훈·소라의 현재 참석 가능 응답과 실제 인지 이력.
- 실행: 실제 게임 `index.html?qa=day26-v4&route=friendly`에서 AUTO OFF를 유지하고 SKIP을 누르지 않았다. 화면에 노출된 C1~C14를 순서대로 직접 선택해 DAY27까지 완주했다.
- 분기: 편한 옷, 합의한 범위, 친구들의 현재 말 듣기, 하은이 직접 말할 여지를 남기고 귀가 후 실제 정정을 선택했다. 지훈 단독·새 만남·혼자 생활 장면은 이 경로에 끼어들지 않았다.
- presentation: DAY26 `15:00 → 19:00 → 22:00`, SCENE01과 네 사람 식탁·귀갓길·하은 밤 연락·SCENE24를 거쳐 DAY27 `08:00`으로 전환되는 것을 실제 화면에서 확인했다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, 식비 settlement `route=GROUP_MEAL/cost=24000`, DAY26 food ledger 1건, `day=27`, `pendingStoryId=m30-day27-current-final-check`, `day27Hook=true`, `freeAction=null`.
- 브라우저 warning/error 0. QA 종료 뒤 세션 백업으로 사용자 저장을 복원했다.

판정: **PASS**. DAY26 전체 완료 판정은 Neutral/Distant/Mixed, 지훈 단독·새 만남·거짓말 정정/반복, 389×844 모바일 의미 경로가 끝날 때까지 보류한다.

## Neutral · 관계 재논의 · 혼자 · 데스크톱

- 진입: DAY25 `INDEPENDENT_LIFE`와 관계 유예를 보존한 검증 fixture. 오늘 확정된 모임·새 만남은 없다.
- 실행: 실제 Story 화면에서 AUTO OFF·SKIP 미사용으로 C1과 혼자 경로 C2~8, 공통 C14의 9개 선택을 직접 눌러 DAY27까지 완주했다.
- 결과: `route=SOLO_DAY`, `day27Route=INDEPENDENT_LIFE`. 하은·친구·새 상대를 현장에 만들지 않았고 식비 settlement와 DAY26 food ledger가 모두 없었다.
- 완료 저장: `error=null`, `complete=true`, `day=27`, `day27Hook=true`, `freeAction=null`. 브라우저 warning/error 0, 사용자 저장 복원 PASS.

판정: **PASS**.

## Distant · 기종료 관계 · 혼자 · 데스크톱

- 진입: DAY24부터 실제 관계가 종료되고 DAY25에도 새 만남이 없었던 검증 fixture.
- 실행: 노출된 C1, 혼자 C2~8, 공통 C14의 9개 선택을 AUTO OFF·SKIP 미사용으로 직접 진행했다.
- 결과: `route=SOLO_DAY`, `day27Route=INDEPENDENT_LIFE`, 식비 0건. 하은 연락·네 사람 식탁·새 상대를 만들지 않고 DAY27 `08:00`으로 전환했다.
- 완료 저장: `error=null`, `complete=true`, `day=27`, `day27Hook=true`, `freeAction=null`. 브라우저 warning/error 0, 사용자 저장 복원 PASS.

판정: **PASS**.

## Mixed · 관계 재논의 · 기존 서진 거짓말 · 네 사람 식사 · 데스크톱

- 진입: DAY24 서진에게 한 관계 상태 거짓말이 미정정으로 남고, DAY25 관계 재논의와 실제 지훈·소라 참석 응답이 있는 fixture.
- 실행: 실제 화면의 네 사람 식사와 하은 밤 연락, 공통 ending을 AUTO OFF·SKIP 미사용으로 완주했다.
- 결과: `route=GROUP_MEAL`, 합의 범위 공개, 공개 과장 없음. 기존 서진 거짓말을 친구 식탁의 새 사실처럼 폭로하거나 다른 인물에게 복제하지 않았고 미정정 사실은 `day27Route=NEW_MEETING_TRUTH`로 정확히 이월됐다.
- 완료 저장: 식비 `GROUP_MEAL/24000` 1건, `error=null`, `complete=true`, `day=27`, `day27Hook=true`, `freeAction=null`. 브라우저 warning/error 0, 사용자 저장 복원 PASS.

판정: **PASS**.

## Distant · 아라 새 만남 · 데스크톱

- 진입: DAY24 관계 종료 뒤 아라와 현재 만남이 상호 수락된 이력을 DAY25에서 `ACCEPTED`로 확정한 단일 상대 fixture.
- 실행: 실제 화면에서 C1과 새 만남 C4·C5·C7·C8, 공통 C14의 6개 선택을 AUTO OFF·SKIP 미사용으로 직접 눌렀다. 동일 수신자 거짓말이 없어 SCENE19/C6은 열리지 않았다.
- 결과: 현장 인물은 아라만 등장했고 `route=NEW_MEETING`, 관계 의미 응답 `RECIPROCATE`를 별도로 받은 뒤에도 새 연애나 다음 약속을 자동 확정하지 않았다. `newLieResponse=null`, `newNextResponse=null`이다.
- 완료 저장: 식비 `NEW_MEETING/22000` 1건, `error=null`, `complete=true`, `day=27`, `day27Hook=true`, `freeAction=null`. 브라우저 warning/error 0, 사용자 저장 복원 PASS.

판정: **PASS**. 남은 데스크톱 관문은 지훈 단독 식사와 실제 동일 수신자 거짓말 정정/반복이다. 전체 완료 판정은 이 경로들과 389×844 모바일 의미 경로가 끝날 때까지 보류한다.
