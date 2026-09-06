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
