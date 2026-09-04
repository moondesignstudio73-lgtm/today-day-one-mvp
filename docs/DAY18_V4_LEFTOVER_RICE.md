# DAY18 V4 남은 밥 확인 행동 구현

- 실행 시각: 2026-09-05 02:20 KST
- 런타임 캐시: `game.js?v=219`
- 판정: DAY18 PARTIAL

## 원문 분류와 구현 범위

SCENE02의 “나는 남은 밥이 있는지 다시 확인했다.”는 대사나 독백이 아니라 실제 물리 행동이다. 따라서 일반 대화창 텍스트로 출력하지 않고, 하은의 “따뜻한 거 먹어.” 직후 냉장고 안 남은 밥을 확인하는 POV 정지 CG로 구현했다.

이 행동은 아침에 저녁을 실제로 `SOLO`로 확정한 경로에만 나온다. 유리와 저녁을 먹기로 해 놓고 하은에게 혼자 먹는다고 말한 경로는 기존 거짓말 내적 반응을 유지하며 밥 확인 CG를 내보내지 않는다. 하은과 저녁을 먹는 경로에는 `disclose_solo` 선택 자체가 유효하지 않다.

새 플래그나 관계 이력은 만들지 않았다. 기존 저장 상태의 `dinner === "SOLO"`만 읽고, 원문에 명시된 남은 밥 확인을 한 개 용기에 소량의 흰밥이 보이는 행동 컷으로 표현한다.

## 자산

- 기준 이미지: `assets/events/day18-v4/fridge-open-morning-v1.png`
- ImageGen 생성 원본: `C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137\exec-1e79e8b2-9fc1-49ad-9d10-2ded887ccb0f.png`
- 프로젝트 자산: `assets/events/day18-v4/leftover-rice-check-v1.png`

최종 생성 프롬프트:

> Use case: illustration-story. Asset type: DAY18 visual novel silent household action CG, landscape 16:9. Image 1 is the exact refrigerator/kitchen/style reference. Create a tight first-person close-up inside the same open lower refrigerator. One bare adult hand lifts the plain translucent lid slightly from ONE existing small neutral food container, revealing a modest amount of plain cooked white rice inside. Other closed neutral containers remain out of focus behind it; preserve the same warm refrigerator light, pale blue-gray appliance, adjacent morning light and softly painted Korean visual novel style. This is only checking whether leftover rice remains after receiving 'eat something warm'; not cooking, eating, discarding, shopping, or meal prep. No people/faces, labels, dates, text, UI, logos, utensils, new groceries, branded packages or watermark. Natural single-hand anatomy. Tight crop, no new room layout.

## 검증

- 자동 회귀: 전체 `npm test` 통과(475 PASS), `node --check game.js` 통과, `git diff --check` 통과.
- 3개 저장 스키마에서 `YURI`/`SOLO`를 대조했다. CG는 진짜 `SOLO`에만 있으며 “따뜻한 거 먹어.” 바로 뒤에 온다.
- 행동 원문이 독백 텍스트로 출력되지 않고, 자산 경로가 존재하며, 동일 상태 재생 결과가 순수하게 반복되는지 검사했다.
- 실제 브라우저 비-SKIP SOLO 경로에서 미전송 초안 삭제 → 혼자 먹는다고 답장 → 하은 답장 → 새 CG → 저녁 장면 복귀를 확인했다.
- 새로고침 후 이어하기에서도 반응 장면과 새 CG가 다시 재생되고 19:00 저녁 장면으로 복귀했다.
- 브라우저 콘솔 오류/경고는 관찰되지 않았고, QA 종료 뒤 `테스트 전 저장 복원`으로 사용자 저장을 복원했다.

## 남은 작업

유리 거짓말 경로의 CG 제외를 실제 브라우저에서도 확인하고, SCENE03 이후 메뉴·코트·가방 등 남은 행동 연출과 알람 입력/소리를 구현해야 한다. 이후 동일 버전 4경로, 모바일, DAY15~17 연속성 감사를 모두 통과하기 전까지 DAY18은 COMPLETE로 승격하지 않는다.
