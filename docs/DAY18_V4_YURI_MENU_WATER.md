# DAY 18 V4 — 유리 메뉴 대기 분기의 물 마시기

## 원문과 연결

- 대상 원문: `나는 잘못 말한 단위를 고치며 물을 마셨다. 그녀가 웃는 동안...`
- 분류: 주인공의 물리 행동과 그 뒤 내적 반응이다. 물을 마신 행동 문장은 일반 독백으로 출력하지 않는다.
- 적용 범위: 실제 저녁 상대가 유리이고 선택이 `조금 더 본다(menu_wait)`일 때만 표시한다.
- 순서: 유리의 `메뉴 기다리는 사람이 둘이나 더 생긴 줄.` 직후 물 CG를 표시하고, 이어서 단위 실수와 현재 웃음에 관한 원문 내적 반응을 유지한다.
- 상태 영향: 유리의 감정, 관계 결과, 다음 약속을 새로 만들지 않는다.

## 자산

- 최초 자산: `assets/events/day18-v4/yuri-menu-wait-water-v1.png` (손 화풍 반려)
- 1차 수정본: `assets/events/day18-v4/yuri-menu-wait-water-v2.png` (재노출 신고 후 런타임 반려)
- 런타임 경로: `assets/events/day18-v4/yuri-menu-wait-water-v3.png` (굵은 선화와 2~3단계 셀 명암을 재강제)
- 참조: `menu-open-v1.png`, `yuri-ex-girlfriend-2d.png`, `yuri-jacket-chair-v1.png`
- 최신 생성 원본: `C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137\exec-2242954d-b3b6-4ad3-9046-340212a5d16f.png`
- 생성 방식: built-in imagegen.

최종 프롬프트:

> Use case: precise-object-edit. Asset type: DAY18 visual-novel event CG. Redraw only the foreground protagonist hand, wrist, and sleeve boundary as unmistakable clean 2D anime cel-shaded line art matching Yuri. Use crisp controlled outlines, simplified knuckles, smooth flat skin color, exactly 2–3 broad shadow steps, and five natural fingers around the unchanged glass. Preserve the glass, water, grip, composition, crop, restaurant, table, props, Yuri identity/pose/outfit, and lighting. No photorealistic skin, pores, veins, hair, photographic wrinkles or gradients, subsurface scattering, glossy wet skin, 3D flesh, mixed-media hand, extra fingers, text, UI, logo, or watermark.

## 검증

- 자동: 3개 저장 스키마 × 유리/하은 × 세 메뉴 선택에서 유리 `menu_wait`에만 CG가 나타남을 검사했다. 직전 유리 대사, 직후 내적 반응, 자산 존재, 상태 불변, 결정적 재생을 함께 검증했다.
- 전체 회귀: 483 PASS, 0 FAIL.
- 실제 비-SKIP: 집중 fixture로 유리의 단위 실수 대사→물 CG→두 내적 반응→SCENE05 목적 선택을 확인했다.
- 저장 재개: CG 표시 중 새로고침 후 Scene 시작점에서 동일 순서와 CG를 재확인했다.
- 콘솔: 오류·경고 없음.
- 사용자 저장: 테스트 전 저장으로 복원 완료.
- v3 재검증: 390×844 실제 브라우저에서 `yuri-menu-wait-water-v3.png`가 직접 요청되고 1672×941로 로드되는 것을 확인했다. 손 실루엣, 100% 원본, 같은 프레임의 유리 얼굴·의상 비교 모두 PASS.

## 판정

이 물 행동은 완료했다. 각자 메뉴의 두 번 닫힘 소리, 하은 `menu_wait` 물 행동, 알람 입력·소리, 동일 버전 4경로·모바일·DAY15~17 감사가 남아 DAY18은 `PARTIAL`이다.
