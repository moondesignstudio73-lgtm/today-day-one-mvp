# DAY25 V4 실제 브라우저 QA — 2026-09-06

## Friendly · 대면 · 관계 지속 · 데스크톱

- 진입: 검증된 DAY24 V4 완료 fixture, `day25Route=HAEUN_FUTURE`, `relationshipTone=CALM`, 지훈·소라 실제 인지 상태.
- 실행: 실제 게임 `index.html?qa=day25-v4&route=friendly`에서 AUTO OFF 상태를 유지하고 SKIP을 누르지 않았다.
- 선택: 화면에 노출된 C1~C16 16개를 순서대로 직접 선택했다. 기본 의미 경로는 편한 식당, 결혼 의사, 함께 준비, 더 머무르기, 현재 입맞춤, 실제 합의한 관계 이름, 친구 식사, 미정은 미정으로 말하기다.
- 현재 응답: 하은의 미래 응답, 입맞춤 동의, 지훈·소라 가능 응답이 각각 별도 cue 뒤 처리되는 것을 확인했다.
- presentation: DAY25 `15:00 → 19:00 → 22:00`, SCENE01·05·12·22를 포함한 전환과 DAY26 `08:00` 진입을 실제 화면에서 확인했다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `location=COMFORTABLE`, `future=PREPARE_MARRIAGE`, `contact=KISS`, `kiss=true`, `friends=true`, `day26Route=MARRIAGE_PREPARATION`, `day=26`, `day26Hook=true`, `freeAction=null`.
- 보존: fixture 최초 준비에서 테스트용 shell의 `settings` 누락을 발견해 harness만 수정했다. 수정 후 처음부터 재진입해 DAY26까지 완주했고 새 오류·경고는 없었다. QA 종료 뒤 세션 백업으로 사용자 저장을 복원했다.

판정: **PASS**. DAY25 전체 완료 판정은 Neutral/Distant/Mixed 데스크톱 및 389×844 모바일 의미 경로가 끝날 때까지 보류한다.

## Neutral · 통화 유예 · 독립 생활 · 데스크톱

- 진입: 검증된 DAY24 V4 `day25Route=DEFERRED_RELATIONSHIP`, `haeunRelationshipOutcome=DEFER`, 통화 대화 fixture.
- 실행: 실제 게임에서 AUTO OFF를 유지하고 SKIP 없이 C1~6, C14, C16의 8개 노출 선택을 직접 눌러 DAY26까지 완주했다.
- 결과: 하은의 결혼·접촉 동의를 만들지 않고 혼자 할 일·작은 일정·휴식·공개 경계를 완결했다.
- 완료 저장: `error=null`, `complete=true`, `location=OWN_DINNER`, `future=null`, `contact=null`, `kiss=false`, `friends=false`, `day26Route=INDEPENDENT_LIFE`, `day=26`, `day26Hook=true`, `freeAction=null`.

판정: **PASS**.

## Distant · 관계 종료 · 새 만남 · 데스크톱

- 진입: DAY24에서 관계를 명시적으로 끝내고 실제 아라 연락과 현재 만남 수락을 받은 fixture.
- 실행: 실제 게임에서 AUTO OFF를 유지하고 SKIP 없이 C1~7, C14, C16의 9개 노출 선택을 직접 눌러 DAY26까지 완주했다.
- 결과: 하은 대화·접촉·친구 식사를 만들지 않았고, 아라에게 천천히 가겠다는 현재 메시지 뒤 독립 응답 `RESCHEDULED`를 별도 처리했다. 새 연애로 확정하지 않았다.
- 완료 저장: `error=null`, `complete=true`, `newMeetingRecipient=ARA`, `newMeetingMessage=SLOW_DOWN`, `newMeetingResponse=RESCHEDULED`, `kiss=false`, `friends=false`, `day26Route=INDEPENDENT_LIFE`, `day=26`, `day26Hook=true`, `freeAction=null`.

판정: **PASS**.

## Distant · 기종료 관계 · 혼자 · 데스크톱

- 최초 불러오기에서 유효한 DAY25 pending Story보다 전역 `breakup` 엔딩을 먼저 띄워 `새로운 30일 시작하기`만 노출하는 HIGH 결함을 발견했다.
- `loadGame()`이 현재 DAY와 일치하고 콘텐츠가 실제 존재하는 `m30-dayN-*` pending Story를 검증한 경우에만 그 Story를 이별 엔딩보다 우선 재개하도록 수정했다. 잘못된 DAY, 없는 콘텐츠, Free Mode, 활성 이벤트는 우회하지 않는다.
- 수정 후 동일 fixture를 처음부터 다시 불러오자 SCENE01로 정상 진입했다. AUTO OFF·SKIP 미사용으로 C1~6, C14, C16의 8개 선택을 직접 눌러 DAY26까지 완주했다.
- 완료 저장: `error=null`, `route=RELATIONSHIP_ENDED`, `tone=DIFFICULT`, `complete=true`, `location=OWN_DINNER`, `future=null`, `contact=null`, `kiss=false`, `newMeetingRecipient=null`, `friends=false`, `day26Route=INDEPENDENT_LIFE`, `day=26`, `day26Hook=true`, `freeAction=null`.
- QA 종료 뒤 세션 백업으로 사용자 저장을 복원했다.

판정: **PASS**. DAY25 전체 완료 판정은 Mixed 데스크톱과 `389×844` 모바일 의미 경로가 끝날 때까지 보류한다.

## Mixed · 관계 지속 · DAY24 거짓말 책임 · 데스크톱

- 진입: DAY24에서 하은과 관계는 지속했지만 서진에게 `지금은 혼자야`라고 말하고 정정하지 않은 실제 이력을 DAY25 input seal로 전달한 fixture다.
- 실행: 실제 게임에서 AUTO OFF를 유지하고 SKIP 없이 C1~11, C14~16의 14개 노출 선택을 직접 눌러 DAY26까지 완주했다. 신뢰 조건이 충족되지 않아 C12~13 접촉·입맞춤 선택은 열리지 않았다.
- 최초 실행에서 C10 `다시 이야기할 때를 정하고, 지금은 연인으로 지내고 싶어` 뒤 SCENE12의 축약 독백이 exact source line으로 등록되지 않아 `DAY25_SOURCE_LINE_MISSING:12`로 안전 중단되는 HIGH 결함을 발견했다. 전체 원문 문장을 source로 보존하는 grounded projection으로 교정하고 동일 fixture를 처음부터 다시 완주했다.
- 완료 저장: `error=null`, `route=HAEUN_FUTURE`, `tone=CALM`, `complete=true`, `location=COMFORTABLE`, `future=REDISCUSS`, `contact=null`, `kiss=false`, `friends=false`, `day26Route=RELATIONSHIP_REDISCUSSION`, `day=26`, `day26Hook=true`, `freeAction=null`.

판정: **PASS**.

## Friendly · 현재 입맞춤 거절 · 데스크톱

- 기존 runtime이 신뢰 조건만 충족하면 C12 `키스하고 싶어`를 항상 수락해 원문의 명시적 거절 경로가 실제 플레이에서 도달 불가능한 것을 확인했다.
- 활성 관계와 신뢰는 유지하되 현재 신체 상태가 불편한 fixture(`energy=20`, `stress=85`)에서는 하은의 별도 현재 응답이 입맞춤을 거절하도록 resolution을 보강했다. 이는 관계 종료나 미래 합의 취소로 승격하지 않는다.
- 실제 게임에서 AUTO OFF를 유지하고 SKIP 없이 C1~12, C14~16의 15개 노출 선택을 직접 눌렀다. C12 뒤 C13 키스 반응 선택을 열지 않고 C14로 이동하는 것을 확인했다.
- 완료 저장: `error=null`, `route=HAEUN_FUTURE`, `tone=CALM`, `complete=true`, `location=COMFORTABLE`, `future=PREPARE_MARRIAGE`, `contact=NONE`, `kiss=false`, `friends=false`, `day26Route=MARRIAGE_PREPARATION`, `day=26`, `day26Hook=true`, `freeAction=null`.
- Mixed 교정 재실행과 거절 경로 모두 브라우저 warning/error 0이었다. 종료 뒤 세션 백업으로 사용자 저장을 복원했다.

판정: **PASS**. DAY25 데스크톱 의미 경로는 모두 닫혔다. 전체 완료 판정은 Friendly/Neutral/Distant/Mixed `389×844` 모바일 경로가 끝날 때까지 보류한다.

## 389×844 모바일 의미 경로

- 브라우저 외곽 보정을 거쳐 실제 게임 콘텐츠 `innerWidth=389`, `innerHeight=844`에서 각 경로를 처음부터 실행했다. AUTO OFF를 유지하고 SKIP을 사용하지 않았다.
- Friendly: C1~16 16개 선택을 완주했다. `PREPARE_MARRIAGE`, 현재 `KISS`, 지훈·소라 가능 응답 뒤 친구 식사, DAY26 `MARRIAGE_PREPARATION`을 확인했다.
- Neutral: C1~6/C14/C16 8개 선택을 완주했다. 통화 유예를 결혼·접촉으로 바꾸지 않고 DAY26 `INDEPENDENT_LIFE`로 이었다.
- Distant: 기종료 관계·혼자 경로 C1~6/C14/C16 8개 선택을 완주했다. 하은 대면·접촉·새 만남을 만들지 않고 DAY26 `INDEPENDENT_LIFE`로 이었다.
- Mixed: DAY24 서진 관계 상태 거짓말 미정정 이력에서 C1~11/C14~16 14개 선택을 완주했다. C12~13을 열지 않고 `REDISCUSS`, DAY26 `RELATIONSHIP_REDISCUSSION`을 유지했다.
- 네 경로 모두 완료 저장 `error=null`, `complete=true`, `day=26`, `day26Hook=true`, `freeAction=null`이었다. 각 완주 시점 `scrollWidth=clientWidth=389`, browser warning/error 0을 확인했다.
- QA 종료 뒤 세션 백업으로 사용자 저장을 복원하고 임시 viewport override를 reset했다.

판정: **PASS**. source/state/playable/bridge·저장·Story/Free·전체 자동 회귀·데스크톱 및 네 모바일 의미 경로가 모두 닫혀 DAY25를 **PASS / COMPLETE**로 승격한다.
