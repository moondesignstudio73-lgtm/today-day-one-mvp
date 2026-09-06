# DAY26 V4 실제 브라우저 QA — 2026-09-06

## Friendly · 네 사람 식사 · 데스크톱

- 진입: 검증된 DAY25 V4 완료 fixture, `day25Route=MARRIAGE_PREPARATION`, 관계 지속, 지훈·소라의 현재 참석 가능 응답과 실제 인지 이력.
- 실행: 실제 게임 `index.html?qa=day26-v4&route=friendly`에서 AUTO OFF를 유지하고 SKIP을 누르지 않았다. 화면에 노출된 C1~C14를 순서대로 직접 선택해 DAY27까지 완주했다.
- 분기: 편한 옷, 합의한 범위, 친구들의 현재 말 듣기, 하은이 직접 말할 여지를 남기고 귀가 후 실제 정정을 선택했다. 지훈 단독·새 만남·혼자 생활 장면은 이 경로에 끼어들지 않았다.
- presentation: DAY26 `15:00 → 19:00 → 22:00`, SCENE01과 네 사람 식탁·귀갓길·하은 밤 연락·SCENE24를 거쳐 DAY27 `08:00`으로 전환되는 것을 실제 화면에서 확인했다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, 식비 settlement `route=GROUP_MEAL/cost=24000`, DAY26 food ledger 1건, `day=27`, `pendingStoryId=m30-day27-current-final-check`, `day27Hook=true`, `freeAction=null`.
- 브라우저 warning/error 0. QA 종료 뒤 세션 백업으로 사용자 저장을 복원했다.

판정: **PASS**. DAY26 전체 완료 판정은 아래 대체 경로와 389×844 모바일 의미 경로가 끝날 때까지 보류한다.

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

판정: **PASS**.

## Mixed · 지훈 단독 식사 · 데스크톱

- 진입: DAY24의 서진 관련 미정정 이력과 DAY25 관계 재논의를 보존하되, 지훈·소라 단체 식사는 잡지 않은 검증 fixture.
- 실행: 실제 화면에서 C1과 지훈 현재 응답을 받은 뒤 단독 식사 경로, 공통 C14까지 AUTO OFF·SKIP 미사용으로 완주했다.
- 결과: `route=JIHOON_MEAL`, 기존 거짓말을 식사 자리의 새 폭로로 만들지 않았고 `day27Route=NEW_MEETING_TRUTH`로 이월했다.
- 완료 저장: 식비 `JIHOON_MEAL/16000` 1건, `error=null`, `complete=true`, `day=27`, `pendingStoryId=m30-day27-current-final-check`, `day27Hook=true`, `freeAction=null`. 사용자 저장 복원 PASS.

판정: **PASS**.

## Mixed · 동일 수신자 서진 거짓말 정정 · 데스크톱

- 발견·수정: 실제 DAY24→25 replay에서는 관계가 유지되는 동안 새 만남 후보를 버려, DAY25에 관계를 끝내도 같은 수신자 정정 장면에 도달할 수 없었다. DAY24에서 서진에게 관계 상태를 숨겼고 서진이 `THINK`로 답한 경우에만 후보를 보존하고, DAY25에서 관계 종료와 서진의 현재 `ACCEPTED` 응답이 모두 확인되어야 DAY26으로 전달하도록 상태 계약을 고쳤다. 반대로 DAY25에서 만나지 않은 후보는 DAY26 입력으로 승격하지 않는다.
- 실행: 실제 화면에서 C1·C4·C5·C6·C8·C14를 AUTO OFF·SKIP 미사용으로 직접 선택했다. C6에서 “그렇게 들리게 말했어요”를 골라 같은 수신자 서진에게 정정했다.
- 결과: `route=NEW_MEETING`, `newMeetingRecipient=SEOJIN`, `newMeaningResponse=RECIPROCATE`, `newLieResponse=END_TODAY`, `newNextResponse=null`, `day27Route=INDEPENDENT_LIFE`.
- 완료 저장: 식비 `NEW_MEETING/22000` 1건, `error=null`, `complete=true`, `day=27`, `pendingStoryId=m30-day27-current-final-check`, `day27Hook=true`, `freeAction=null`. 사용자 저장 복원 PASS.
- 반복 선택은 정상 실제 이력에서는 별도 관문이 아니다. DAY26의 오늘 새 만남은 기존 관계가 DAY25에 종료된 경우에만 유효하므로, C6의 “정리됐어요”는 그 시점에는 사실이며 반복 거짓말이 될 수 없다. 조작된 상태를 실제 브라우저 이력처럼 만들지 않는다.

판정: **PASS**.

## Friendly · Neutral · Distant · Mixed · 389×844 모바일

- 환경: 브라우저 viewport override를 보정해 실제 콘텐츠 `innerWidth=389`, `innerHeight=844`를 확인했다. 테스트 종료 후 override를 reset했다.
- 실행: Friendly 네 사람 식사, Neutral 관계 재논의·혼자, Distant 기종료·혼자, Mixed 기존 거짓말 책임의 네 대표 경로를 AUTO OFF·SKIP 미사용으로 각각 DAY27까지 완주했다. 동일 수신자 서진 정정 의미 경로도 같은 크기에서 별도로 완주했다.
- Friendly: `GROUP_MEAL/24000` 1건, `day27Route=HAEUN_VOICE`, `error=null`, `freeAction=null`.
- Neutral·Distant: 모두 `SOLO_DAY`, 식비 0건, 현장에 하은·친구·새 상대를 만들지 않고 `day27Route=INDEPENDENT_LIFE`.
- Mixed: `GROUP_MEAL/24000` 1건, 기존 미정정 사실을 새 폭로로 복제하지 않고 `day27Route=NEW_MEETING_TRUTH`.
- 동일 수신자 정정: `NEW_MEETING/22000` 1건, `newMeetingRecipient=SEOJIN`, `newMeaningResponse=RECIPROCATE`, `newLieResponse=END_TODAY`, `newNextResponse=null`, `day27Route=INDEPENDENT_LIFE`.
- 모든 직접 모바일 실행은 `complete=true`, `day=27`, `pendingStoryId=m30-day27-current-final-check`, `day27Hook=true`; 기준 시각 이후 신규 browser warning/error 0. 각 실행 뒤 세션 백업으로 사용자 저장을 복원했다.

판정: **PASS / COMPLETE**. 원문·상태·playable·bridge·저장·경제·Story/Free·데스크톱 및 모바일 관문이 모두 닫혔다.

## 자동 회귀

- `node --test tests/*.test.mjs`: **804/804 PASS**.
- `npm test`: **100회 × 30일 자동 시뮬레이션 PASS**.
- 신규 회귀는 실제 DAY25에서 사용하지 않은 연락 후보가 DAY26 새 만남으로 승격되지 않는지, 동일 수신자 후보가 관계 종료와 현재 수락 응답 뒤에만 전달되는지를 검증한다.
