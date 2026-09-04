# DAY18 SCENE08 채소 한 입 — 구현 계약

원문 “지금은 진짜예요.” 다음 주인공이 자기 접시에 남긴 채소를 바로 먹는다. 이전에 제거한 행동 독백 대신 1인칭 식사 CG를 연결한다. 얼굴을 고정하지 않아 플레이어 외형 선택을 바꾸지 않는다. imagegen 스킬 내장 생성으로 식당/자기 접시/채소/식기만 표현한다.

그래프: 유리 “진짜?” → 나 “지금은 진짜예요.” → 자기 접시에서 든 채소 CG → SCENE09 관계 질문. 입력/flag/선택/저장 변경 없음. 유리와 실제 식사 경로에만 표시. 하은에게 먹여 주기나 새 음식 동의를 만들지 않는다. 두 사람이 웃는 표정까지 이 컷 하나로 완료했다고 기록하지 않는다.

## 검증

- game204, bridge/playable16, source-beats3. 자동 테스트 460 PASS, 0 FAIL. 대답 직후/경로별 1회/하은·혼자 0회, 파일 존재, 무텍스트, 상태 불변·직렬화 재생 확인.
- 실제 브라우저 1721×927에서 비-SKIP으로 채소 질문→답→CG visible/source 및 전체 화면→SCENE09 관계 질문 복귀 확인. 포크와 채소가 화면 안에 들어오고 빈 상대 자리가 보이지 않는다. 19:00·유리 표시 유지, 콘솔 error/warning 없음. 사용자 원래 저장 복원 확인.
- 이번 별도 브라우저 저장 중간 재개/전체4경로/모바일 NOT RUN. 정지 CG의 입으로 드는 순간이며 씹기/웃음 애니메이션 완성이 아니다. DAY18 PARTIAL 유지.

## 생성 기록

imagegen 내장 generate 후 precise-object-edit. 초안의 빈 맞은편 의자는 유리가 떠난 듯 보일 수 있어 식탁 클로즈업으로 수정했다. 최종 `C:/Users/aaa/OneDrive/Desktop/AI해커톤/game/assets/events/day18-v4/vegetable-bite-v1.png`, 원본 생성본은 보존했다.

생성 프롬프트:

> Use case: illustration-story. Asset type: Korean slice-of-life visual novel eating event CG, landscape 16:9. First-person view of an adult diner eating the vegetables left on HIS OWN dinner plate at a quiet casual bistro in warm evening light. His hand enters from the lower right with a naturally held dinner fork, lifting a small bite of cooked green vegetable toward the viewer's unseen mouth. The forkful is the clear foreground focal point; the partly eaten ceramic plate immediately below has a few remaining cooked vegetables and sauce traces. Intimate everyday framing, not romantic. No other person, no face, no torso, no feeding someone else, no sharing across table. Soft painterly anime illustration with clean delicate linework, warm wooden table, muted off-white plate, gentle depth of field. No new full meal, no alcohol, phone, text, logos, watermark or UI. Keep entire forkful readable within contain-fit screen. No exaggerated speed lines.

최종 수정 프롬프트:

> Use case: precise-object-edit. Edit target is the provided first-person vegetable tasting image. Keep the foreground hand, fork, vegetable bite, partly eaten plate, warm wood and illustration style unchanged. Replace only the upper background containing the empty chair, wall, window and flower vase with a continuation of the same wooden tabletop, as a tighter downward-looking tabletop crop. There must be no empty opposite seat: another diner is present outside the crop in this story. Do not add the other diner, any face, new food, objects or text. Preserve landscape framing and central forkful.
