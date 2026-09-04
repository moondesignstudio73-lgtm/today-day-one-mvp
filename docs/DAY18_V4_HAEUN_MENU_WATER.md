# DAY 18 V4 — 하은 메뉴 고민 분기의 물 마시기

## 원문과 연결

- 대상 원문: `더 보겠다고 하면 그녀는 물을 마셨다.`
- 분류: 하은의 물리 행동이다. 행동 문장을 일반 대화창의 독백으로 출력하지 않는다.
- 적용 범위: 실제 저녁 상대가 하은이고 선택이 `조금 더 본다(menu_wait)`일 때만 표시한다.
- 순서: 선택 직후 물 CG를 표시한 뒤 `나도 고민 중이야. 빨리 고르는 얼굴만 하고 있었어.`로 이어진다.
- 상태 영향: 하은의 생각을 메뉴 고민 이상으로 해석하거나 관계 flag를 바꾸지 않는다.

## 자산

- 게임 경로: `assets/events/day18-v4/haeun-menu-wait-water-v1.png`
- 참조: `assets/events/day18-v4/haeun-menu-slide-v1.png`
- 생성 원본: `C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137\exec-58e2f196-7757-4934-811c-fdb51d77d8e1.png`
- 생성 방식: built-in imagegen.

최종 프롬프트:

> Use case: precise-object-edit. Asset type: DAY18 silent visual-novel physical-action CG, landscape 16:9. Edit the provided alley-pub scene while preserving the exact warm red metal table, rainy night alley, lighting, camera position, Haeun's identity, short dark-purple bob, sage overshirt, white top, black trousers, necklace, and the same black crossbody bag resting on the adjacent red stool. Change the action only: the menu now rests flat and closed on the table; remove the protagonist's foreground hand; Haeun is seated in the same place and naturally lifts a small plain stainless-steel water cup to her lips for one quiet sip while she is still considering the menu. Her expression is thoughtful and relaxed, not romantic or upset. Preserve natural hand, cup, and mouth anatomy. No food yet, no alcohol, no speech bubble, no readable menu text, no label, logo, UI, watermark, extra people, extra hands, or duplicated cups. This is only the original physical direction that Haeun drinks water before saying she is also still deciding.

## 검증

- 자동: 3개 저장 스키마 × 유리/하은 × 세 메뉴 선택에서 하은 `menu_wait`에만 CG가 나타남을 검사했다. 다음 대사, 자산 존재, 상태 불변, 결정적 재생도 검증했다.
- 전체 회귀: 484 PASS, 0 FAIL.
- 실제 비-SKIP: 기존 하은 메뉴 고민 집중 fixture에서 물 CG→`나도 고민 중이야`→얼굴 농담→SCENE12 전환을 확인했다.
- 저장 재개: 새로고침 후 Scene 시작점에서 같은 물 CG를 다시 확인했다.
- 콘솔: 오류·경고 없음.
- 사용자 저장: 테스트 전 저장으로 복원 완료.

## 판정

하은의 이 물 행동은 완료했다. 유리 각자 메뉴 두 번 닫힘 소리, 알람 입력·소리, 동일 버전 4경로·모바일·DAY15~17 감사가 남아 DAY18은 `PARTIAL`이다.
