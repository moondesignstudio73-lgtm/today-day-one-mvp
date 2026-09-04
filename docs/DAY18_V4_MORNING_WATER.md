# DAY18 아침 물잔 행동

2026-09-05 00:32 실행. game208 / bridge20 / playable20. DAY18 PARTIAL.

## 계획과 구현

`DAY18_V4_ACTION_AUDIT_REFRESH.md` 및 원문 SCENE01의 몸 상태 생각 → 물 마시기 → 어제 답 확인 순서를 따른다. 모든 저녁 상대의 아침에 동일한 생활 행동이다. 선택/입력/출력 상태는 바꾸지 않으며 건강 회복이나 새 약속 사실을 생성하지 않는다.

`식탁에 놓인 물을 마셨다.` 행동 문장을 일반 독백에서 제거하고 물잔을 입 쪽으로 드는 POV 정지 CG 2.8초로 바꿨다. 어제 답에 대한 화면 정보와 상대별 약속 회고, 몸 상태의 내적 반응은 보존했다. 알람/발끝/옷/냉장고 행동은 아직 별도 미완료다. 물을 삼키는 애니메이션/음향 전체 완료를 주장하지 않는다.

## 자산 및 프롬프트

imagegen 스킬의 built-in 생성, 기존 `assets/backgrounds/morning-studio-2d.png` 환경/화풍 참조. 실제 홈 배경 매핑을 확인하고 크림색 밝은 테이블과 아침 광원을 맞췄다. 폰 화면은 검게 유지하여 가짜 메시지/날짜를 넣지 않았다. 출력 시각 확인: 손 하나/투명 물/넘침 없음/약·술 없음.

저장: `C:/Users/aaa/OneDrive/Desktop/AI해커톤/game/assets/events/day18-v4/morning-water-v1.png`.

최종 프롬프트:

> Use case: illustration-story. Reference image: existing game's morning studio, environment and drawing style only. Make a quiet 16:9 first-person close-up game CG for a man drinking plain water from a clear simple glass at home in morning. One natural adult hand raises the glass near the camera, rim approaching off-screen mouth, slight drinking tilt, clean transparent water safely below rim. No visible face/body or invented clothes. Below is a close crop of the reference cream light-wood rounded table; his phone lies flat with DARK blank screen nearby. Warm morning sunlight from left. Background is very soft and cropped to avoid redesigning the room or showing other people. Same gentle anime illustration style. No food, medicines, alcohol, spill, extra hands, message text, labels, UI or watermark. The action is an ordinary sip of water, no medical claim or relationship event.

## QA

- 3개 저장 스키마 × 3개 저녁 상대의 CG 순서/1회 표시/자산 존재/행동 문장 제외/JSON 재생/상태 무변경과 아침 선택 후 반복되지 않음을 검사했다.
- 전체 자동 테스트 465 PASS. game.js 문법, diff 검사 PASS (줄바꿈 경고만).
- 실제 브라우저 별도 하은 약속 아침 fixture, 비-SKIP 클릭 진행으로 물잔 CG 표시 → 어제 답 정보 → 08:00 아침 선택 3개를 확인했다. CG 화면 시각 확인, 콘솔 오류/경고 없음. 테스트 전 사용자 저장 복원 완료.
- 이번 실행에서 새 CG의 중간 새로고침 재개와 모든 상대 실제 플레이는 재수행하지 않았다. 자동 재생 검사와 구분한다. 최종 동일 버전 4경로/모바일 및 DAY15~17 감사는 남아 있다.

다음: 알람 끄기/누워 있기 행동과 `morning_solo` 냉장고 동작을 일반 독백에서 분리하며 실제 연출로 연결. 아침 SOLO의 '어제 보낸 답' 정보가 실제 전일 이력에 맞는지도 별도 대조한다. 그 밖의 미해결 행동은 최신 감사표를 따른다.
