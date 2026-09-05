# DAY20 V4 브라우저 QA — 2026-09-05

## 판정

PASS / COMPLETE. 자동 route matrix와 별개로 실제 게임 UI에서 선택지를 눌러 데스크톱과 실제 `innerWidth=389` 모바일의 여섯 의미 경로를 DAY21까지 확인했다. 대표 대면 저장 재개, 표시 이미지, Story/Free 배타성, 콘솔과 가로 오버플로 관문도 통과했다.

## 실행 환경

- 로컬 서버: `http://127.0.0.1:8000`
- 진입 fixture: `tests/day20-v4-browser-entry.html`
- 플레이 규칙: 실제 `이어하기` 진입, SKIP 미사용, 화면에 노출된 선택지만 클릭
- 종료 기준: DAY21 · 일요일 / D-10 화면 진입
- 저장 보호: fixture가 백업한 세 게임 저장 키를 QA 종료 뒤 `테스트 전 저장 복원`으로 복구

## 데스크톱 결과

| 경로 | 실제 선택 핵심 | 결과 |
| --- | --- | --- |
| face | 일반 대면 흐름 + 현재 거리 유지 + 귀가 | SCENE21 귀가 후 DAY21 진입 |
| short | C1 `먼저 각자 먹고, 잠깐 쉬었다 가는 건 어떤지 물어보자.` | 친밀 SCENE12~18 없이 C13 단일 귀가 선택 후 DAY21 진입 |
| solo | 방문 없음 상태에서 solo C5~8 | 하은 현장 등장·접촉·숙박 선택 없이 DAY21 진입 |
| conflict | C5 `아직 마음에 남은 이야기를 하고 싶어.` | 전용 conflict C10만 노출, 친밀 장면 없이 귀가 후 DAY21 진입 |
| stay | C8 `오늘 조금 더 같이 있고 싶어.` + C11 `이런 저녁이 또 있었으면 좋겠어.` + C13 숙박 제안 | 준비 조건 충족 뒤 숙박 수락, 별도 침구 SCENE22와 C14 노출 후 DAY21 진입 |
| leave | C10 현재 거리 유지 + C13 `오늘은 여기까지 하자.` | SCENE21 귀가 후 DAY21 진입 |

모든 경로에서 상단은 `STORY · D-11`, 메뉴는 MENU/AUTO/SKIP/LOG/SND/FULLSCREEN만 노출됐으며 Free Action UI가 섞이지 않았다. 플레이 종료 뒤 수집한 브라우저 warning/error 로그는 0건이었다. 개발 메모·조건명·Boundary 문자열은 대화창에 나타나지 않았다.

## 모바일 결과

- viewport capability를 보정해 실제 게임의 `innerWidth=389`와 모바일 미디어쿼리 활성 상태를 확인했다.
- face/leave 13개 선택, short 4개, solo 4개, conflict 6개, stay 14개 선택을 각각 SKIP 없이 DAY21까지 완주했다.
- short와 conflict는 친밀 장면을 건너뛰었고, solo는 하은 현장 등장 없이 닫혔다. stay만 준비 조건 뒤 C14와 별도 침구 결말을 노출했다.
- 각 선택 경계와 종료 화면에서 `scrollWidth - innerWidth`의 최대값은 0이었다.
- 각 경로의 console warning/error는 0건이었다. DAY/시간/대화/선택 UI가 접근성 트리에 유지되고 선택 입력이 막히지 않았다.

## 저장 재개와 미디어

- 대표 대면 경로에서 C5까지 진행하고 SCENE07 도중 새로고침했다. 실제 타이틀의 `이어하기`를 거쳐 저장된 다섯 선택을 유지한 채 해당 장면 시작점의 C5 반응부터 재생됐다.
- 현재 표시되는 하은·주인공 이미지는 `complete=true`, `naturalWidth>0`이었다. 자연 폭 0인 항목은 `hidden`이고 `src`가 없는 범용 NPC/선물/액세서리/이벤트 CG 재사용 레이어뿐이었다.
- SND ON 상태로 전체 경로를 진행했고 브라우저 미디어 warning/error는 없었다. 현재 DAY20 장면은 독립 `<audio>` 요소를 만들지 않는다.
- fixture의 `테스트 전 저장 복원` 성공 문구를 확인한 뒤 임시 viewport override를 reset했다.

## 종결

DAY20 V4는 source/state/playable/bridge/저장/Story-Free/데스크톱·모바일 경로 검증을 모두 통과해 PASS / COMPLETE다. 다음 작업은 DAY21 최종 원문 잠금과 DAY18~20 입력 이력 감사다.
