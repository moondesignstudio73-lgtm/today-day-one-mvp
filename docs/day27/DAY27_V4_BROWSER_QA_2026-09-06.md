# DAY27 V4 실제 브라우저 QA — 2026-09-06

## 환경

- 실제 `index.html` Story 루프, 데스크톱 viewport
- `AUTO OFF`, `SKIP` 미사용
- 진입 harness: `tests/day27-v4-browser-entry.html`
- 검증 전 사용자 저장을 session backup으로 보관하고 종료 후 원상 복원

## 결과

| 경로 | 실제 확인 내용 | 결과 |
| --- | --- | --- |
| Friendly | 관계 지속 이력, 정직한 자기억제 대화, 저녁·밤 연락, 별도 다음 만남 응답 | DAY28 전환 PASS |
| Neutral | DAY26 공개 발언 미정정 이력, SCENE15/C11 정정, 관계 지속 후 밤 경로 | DAY28 전환 PASS |
| Distant | 이미 종료된 관계, 상대 인물·듣지 못한 응답 없이 SCENE23 대체 C3~8 | DAY28 전환 PASS |
| Mixed | 서진에게 한 실제 관계 상태 거짓말, 실제 수신자 정정·하은 고지·독립 응답 | DAY28 전환 PASS |

Mixed 경로는 C4 직후 `SCENE 06 · 하은에게 말하는 선택`에서 페이지를 다시 불러왔다. 타이틀의 DAY27 저장 미리보기와 `이어하기`를 거쳐 동일 Scene 시작점으로 복구한 뒤 끝까지 진행했다. 네 경로 모두 DAY27 종료 후 `DAY 28 · 일요일 / STORY · D-3`가 실제 화면에 나타났고, DAY27 Free Action은 삽입되지 않았다.

브라우저 warning/error는 0건이었다. QA 종료 후 harness의 `테스트 전 저장 복원`으로 사용자 저장을 복원했다.

## 남은 관문

- Friendly/Neutral/Distant/Mixed를 실제 콘텐츠 389×844에서 SKIP 없이 재검증
- 각 경로의 가로 overflow, 선택지 터치 영역, 인물/배경 자산, 콘솔 로그 확인
- 모바일 관문까지 통과한 뒤 DAY27을 COMPLETE로 승격
