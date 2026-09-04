# DAY 18 V4 — 유리 메뉴 대기 분기의 물 마시기

## 원문과 연결

- 대상 원문: `나는 잘못 말한 단위를 고치며 물을 마셨다. 그녀가 웃는 동안...`
- 분류: 주인공의 물리 행동과 그 뒤 내적 반응이다. 물을 마신 행동 문장은 일반 독백으로 출력하지 않는다.
- 적용 범위: 실제 저녁 상대가 유리이고 선택이 `조금 더 본다(menu_wait)`일 때만 표시한다.
- 순서: 유리의 `메뉴 기다리는 사람이 둘이나 더 생긴 줄.` 직후 물 CG를 표시하고, 이어서 단위 실수와 현재 웃음에 관한 원문 내적 반응을 유지한다.
- 상태 영향: 유리의 감정, 관계 결과, 다음 약속을 새로 만들지 않는다.

## 자산

- 최초 자산: `assets/events/day18-v4/yuri-menu-wait-water-v1.png` (손 화풍 반려)
- 런타임 경로: `assets/events/day18-v4/yuri-menu-wait-water-v2.png` (전경 손을 2D 셀 채색으로 교체)
- 참조: `menu-open-v1.png`, `yuri-ex-girlfriend-2d.png`, `yuri-jacket-chair-v1.png`
- 생성 원본: `C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137\exec-b27cfcc1-720d-480d-ab82-05cbf7957dc2.png`
- 생성 방식: built-in imagegen.

최종 프롬프트:

> Use case: illustration-story. Asset type: DAY18 silent visual-novel physical-action CG, landscape 16:9. Image 1 is the exact warm evening rose-bistro table and lighting reference. Image 2 is Yuri's exact identity and outfit reference: long straight blue-black hair, white blouse, black belted skirt. Image 3 establishes that her dark charcoal jacket has already been hung on her chair. Show a first-person seated viewpoint: the protagonist's one natural adult hand lifts the short clear water tumbler from the table toward the camera as he takes a sip after correcting a mistaken Korean counting unit. Across the table Yuri is seated in her white blouse and black skirt, gently laughing at the just-spoken joke; preserve her face, hair, and outfit, and keep the charcoal jacket visibly draped over her chair rather than worn. The menu is closed on the table. Warm intimate restaurant lighting, clean polished Korean visual-novel illustration. The protagonist is not fully visible; only the hand holding the glass. No speech bubble, no written joke, no readable menu text, no labels, logo, UI, watermark, extra people, duplicated hands, or malformed glass. This image communicates the silent action of drinking water while Yuri laughs, without inventing dialogue or a relationship outcome.

## 검증

- 자동: 3개 저장 스키마 × 유리/하은 × 세 메뉴 선택에서 유리 `menu_wait`에만 CG가 나타남을 검사했다. 직전 유리 대사, 직후 내적 반응, 자산 존재, 상태 불변, 결정적 재생을 함께 검증했다.
- 전체 회귀: 483 PASS, 0 FAIL.
- 실제 비-SKIP: 집중 fixture로 유리의 단위 실수 대사→물 CG→두 내적 반응→SCENE05 목적 선택을 확인했다.
- 저장 재개: CG 표시 중 새로고침 후 Scene 시작점에서 동일 순서와 CG를 재확인했다.
- 콘솔: 오류·경고 없음.
- 사용자 저장: 테스트 전 저장으로 복원 완료.

## 판정

이 물 행동은 완료했다. 각자 메뉴의 두 번 닫힘 소리, 하은 `menu_wait` 물 행동, 알람 입력·소리, 동일 버전 4경로·모바일·DAY15~17 감사가 남아 DAY18은 `PARTIAL`이다.
