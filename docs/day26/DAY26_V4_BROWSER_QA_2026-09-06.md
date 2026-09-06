# DAY26 V4 실제 브라우저 QA — 2026-09-06

## Friendly · 네 사람 식사 · 데스크톱

- 진입: 검증된 DAY25 V4 완료 fixture, `day25Route=MARRIAGE_PREPARATION`, 관계 지속, 지훈·소라의 현재 참석 가능 응답과 실제 인지 이력.
- 실행: 실제 게임 `index.html?qa=day26-v4&route=friendly`에서 AUTO OFF를 유지하고 SKIP을 누르지 않았다. 화면에 노출된 C1~C14를 순서대로 직접 선택해 DAY27까지 완주했다.
- 분기: 편한 옷, 합의한 범위, 친구들의 현재 말 듣기, 하은이 직접 말할 여지를 남기고 귀가 후 실제 정정을 선택했다. 지훈 단독·새 만남·혼자 생활 장면은 이 경로에 끼어들지 않았다.
- presentation: DAY26 `15:00 → 19:00 → 22:00`, SCENE01과 네 사람 식탁·귀갓길·하은 밤 연락·SCENE24를 거쳐 DAY27 `08:00`으로 전환되는 것을 실제 화면에서 확인했다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, 식비 settlement `route=GROUP_MEAL/cost=24000`, DAY26 food ledger 1건, `day=27`, `pendingStoryId=m30-day27-current-final-check`, `day27Hook=true`, `freeAction=null`.
- 브라우저 warning/error 0. QA 종료 뒤 세션 백업으로 사용자 저장을 복원했다.

판정: **PASS**. DAY26 전체 완료 판정은 Neutral/Distant/Mixed, 지훈 단독·새 만남·거짓말 정정/반복, 389×844 모바일 의미 경로가 끝날 때까지 보류한다.
