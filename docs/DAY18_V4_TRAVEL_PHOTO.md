# DAY18 SCENE21 여행 사진 — 2026-09-04 21:58

## 구현 전 계획

원문: 침대에서 휴대전화로 파란 바다와 창가 테이블 사진을 보고, 하은과 이미 여행을 논의했을 때만 내일 함께 보자고 묻는다. 사진 자체는 모든 경로에서 보는 후보이며 실제 이동/예약/송신 사건이 아니다. 부산 선택은 사진을 조금 더 보는 반응이다.

기존 first-trip-01 이미지를 확인했으나 하은이 기차표와 여행가방을 든 출발 장면이어서 후보 사진으로 쓰지 않는다. imagegen 스킬을 적용해 원문에 맞는 인물 없는 창가 테이블/바다 사진 한 장을 built-in 방식으로 생성한다. 기존 자산은 보존하고 새 버전 파일로 프로젝트 안에 저장한다.

입력/출력: 기존 선택·facts·저장 스키마 그대로. SCENE21의 home-evening/22:00 위에서 기존 CG 표시 이벤트로 사진을 잠깐 보여주고 같은 방의 독백/선택으로 돌아온다. 부산 선택의 반응에서만 같은 사진을 다시 본다. 다른 경로에 전송/동행/돈 지출 이력은 생성하지 않는다.

Scene Graph: 밤 마무리 → 집/22:00 유지 → 여행 사진 CG → 사진 바깥의 비용·시간 독백 → 조건부 하은 문자 또는 혼자 생각 → 여행 후보 선택 → 부산만 사진 재열람 → 끝맺음.

검증: 파일 존재/순서/부산 반응 한정/기존 facts 불변/JSON 재생/전체 회귀. 실제 브라우저에서 사진 표시 및 자동 복귀, 방/NPC/시간 유지, 선택 및 저장 재개 확인. 자연 독서시간이나 DAY18 전체 충실도 완료로 세지 않는다.

## 구현 및 검증 결과

- 새 사진: `assets/events/day18-v4/travel-window-sea-v1.png` (1,731,057 bytes). built-in image generation, 신규 생성, 참조 이미지 없음. imagegen 스킬의 원본 보존/버전 파일 방식 적용.
- SCENE21 진입 및 부산 후보 선택 반응에만 기존 `cgShow` 이벤트를 연결했다. 3초 표시 후 자동 복귀하며 저장 스키마·동행·예약·송신 이력은 변경하지 않는다.
- game192 / DAY18 bridge·playable v5. 실제 브라우저에서 사진 표시 → 방/22:00/인물 없음 → 후보 선택 → 부산 사진 재열람을 확인했다.
- 부산 선택 후 새로고침/이어하기에서 같은 사진 반응을 재생하고 이동·시간 비용 독백으로 복귀했다. 콘솔 오류/경고 없음. 테스트 전 사용자 저장 복원 확인.
- 집중 테스트 29 PASS, 전체 자동 테스트 446 PASS / 0 FAIL. `node --check game.js`, `git diff --check` 통과(기존 CRLF 안내만 있음).
- 최종 4경로 재실행과 세부 행동 연출 완료는 별도다. DAY18 PARTIAL 유지.

### 최종 생성 프롬프트

Use case: photorealistic-natural. Asset type: an in-world travel photograph viewed on a phone in a Korean visual novel, NOT the phone or game UI. Primary request: a quiet empty wooden table beside a large seaside cafe window, with one unoccupied chair and clear blue sea visible beyond the glass. Natural daytime light, realistic wood grain and gentle reflections, calm inviting ordinary coastal cafe, horizontal 16:9 photograph. The table and blue sea must both read clearly. No people, no hands, no luggage, no tickets, no food or drinks, no city landmarks identifying a booked destination. No text, no logo, no watermark, no collage, no device frame, no UI. This is only a possible trip inspiration photo, not an actual trip with a character.
