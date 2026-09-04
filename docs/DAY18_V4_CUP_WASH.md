# DAY18 SCENE20 컵 씻기 — 구현 전 계획

원문: 더 연락하지 않기로 하고 휴대전화를 내려놓은 다음 컵을 씻는다. 물소리로 방의 조용함이 줄지만 씻는 행동이 관계를 해결하지는 않는다.

입력은 기존 `alone_stop` 선택, 출력은 폰 내려놓기 SFX와 컵 씻기 CG다. 관계·연락·약속 facts 및 저장 스키마를 변경하지 않는다. 다른 선택에 컵 씻기를 강제하지 않는다.

그래프: 혼자 마무리에서 더 연락하지 않기 선택 → 폰 내려놓기 소리 → 손으로 컵을 헹구는 CG → 오늘 대화를 지우는 행동은 아니라는 독백 → 여행 후보 장면. 기존 CG 입력 잠금/자동 복귀/재개 규칙을 따른다.

imagegen 스킬의 built-in 신규 생성으로 `assets/events/day18-v4/washing-cup-night-v1.png`를 만든다. 컵 보조를 하는 하은의 병실 자산은 혼자 하는 생활 행동과 맞지 않으므로 쓰지 않는다. 얼굴이나 동행 인물, 새 메시지를 생성하지 않는다. 새 PNG로 보존한다.

검증: 경로 한정·SFX 존재·CG 순서·facts 불변·저장 재생, 실제 표시/자동 복귀. 물 흐름 애니메이션이나 새 물소리 녹음까지 구현했다고 세지 않는다. DAY18 PARTIAL 유지.

## 결과

- imagegen built-in 신규 생성, 참조 없음. 원본은 기본 generated_images 위치에 보존했고 프로젝트 자산은 `assets/events/day18-v4/washing-cup-night-v1.png`에 복사했다. 한 사람의 손/컵/뒤집힌 폰/야간 실내빛을 시각 확인했다.
- `alone_stop`만 `SFX_PHONE_SOFT_DROP` → 3.2초 CG → 독백을 재생한다. 조용한 무연락 밤에는 갈등 대화를 전제하는 독백을 붙이지 않는다. 연락 연기/미해결 경로만 원문의 대화 독백을 사용한다.
- 실제 game195: 혼자/무연락 선택 반응에서 CG 표시 → 방/22:00/조용한 독백 복귀, 새로고침/이어하기에서 같은 CG 재생 확인. 콘솔 오류/경고 없음. 기존 사용자 저장 복원 완료. SFX 파일/이벤트 연결은 자동 검사했고 청취 품질 평가는 별도다.
- 집중 테스트 29 PASS, 전체 테스트 451 PASS / 0 FAIL. 구문·diff 검사 통과(CRLF 안내만 있음). 기존 저장 facts 불변 및 다른 두 선택에서 CG 부재 확인.
- 이것은 정지 행동 CG이며 물 흐름 애니메이션/실제 물소리를 구현한 것은 아니다. 남은 식사·컵·지갑·옷 등 행동과 최종 4경로/모바일 QA가 있어 DAY18 PARTIAL 유지.

## 최종 생성 프롬프트

Use case: illustration-story. Asset type: Korean contemporary visual novel action CG. Primary request: first-person close view of one adult protagonist's two natural hands rinsing a plain everyday drinking cup under a small stream of water in a modest apartment sink at night. Only forearms and hands of ONE person visible, no face or body, no other people. A smartphone lies face down on the dry countertop away from the water, already put aside. Warm indoor lamplight, intimate ordinary daily life, restrained semi-realistic painted visual novel style with soft clean shading, not a photograph. Horizontal 16:9 composition, hands and cup clearly readable, anatomically correct grip, no ornate rings or jewelry, neutral sleeve cuffs. Tight sink/counter crop so no invented room layout. No text, phone screen content, speech bubbles, interface, logos, watermark, collage, extra hands, food, medicine or romance. The action is solitary washing after an unfinished conversation, not an act that resolves a relationship.
