# DAY 18 V4 SCENE20~24 방 행동·암전 구현

## 대조 결론

- SCENE20의 메모, 휴대전화 내려놓기, 컵 씻기와 SCENE21의 여행 사진은 이미 전용 UI·SFX·CG로 연결돼 있어 유지했다.
- 남은 행동은 SCENE21의 화면 끄기/내일 옷 확인, SCENE22의 화면 닫기, SCENE23의 컵·의자·옷·침대, SCENE24 혼자 경로의 알람/휴대전화와 공통 점진적 암전이었다.
- 이 행동은 새 인물이나 손이 필요한 사건이 아니다. 기존 방 배경의 시선 이동과 화면 소리로 표현해 불필요한 손 CG 생성을 피했다.

## 런타임 계약

- `roomActionCue`는 대사·LOG·이력에 문장을 쓰지 않는다. 빈 대화 표면의 접근성 라벨과 방 배경의 초점 이동만 사용한다.
- `phone-close`, `wardrobe-check`, `desk-reset`, `sleep-ready`, `alarm-set`은 각각 원문 행동 하나에만 대응한다.
- `finalFadeCue`는 마지막 두 독백 전에 방 배경을 1.4초에 걸쳐 어둡게 하고 그 상태를 독백 동안 유지한다.
- 다음 DAY 전환과 SKIP은 `roomAction`·`finalFade` 데이터를 모두 제거한다.
- `travel_life`의 행동 문장과 혼자 엔딩의 알람 문장은 narration에서 제거하고, 행동 뒤 남는 생각만 narration으로 보존한다.

## 검증

- 대상 테스트 63 PASS, 전체 시뮬레이션 PASS, 구문·diff 검사 PASS.
- 실제 브라우저 비-SKIP SOLO에서 화면 닫기·책상 정리·취침 준비·암전과 마지막 독백을 확인했다.
- DAY19 진입 화면에서 암전과 방 행동 상태가 남지 않았다.
- QA fixture로 덮은 저장은 즉시 복원했다.

## 다음 시작점

SCENE09·13·16·19와 SCENE11 겉옷의 오래된 미완료 표를 최신 런타임과 다시 대조한다. 실제 누락만 고친 뒤 동일 game241 기준 Friendly/Neutral/Distant/Mixed와 모바일을 최종 재생한다.
