# DAY18 SCENE12 음식 나누기 — 2026-09-04

## 구현 계약

SCENE12 원문에서 첫 음식 평가 전 주인공이 한 입 나눈다. 행동을 일반 대화창에 쓰지 않고 기존 `cgShow`로 보여 준다. 하은과 실제 식사하는 `haeun_topic`에서만 발생한다. `menu_each/share/wait` 모두 같은 행동을 하되 기존 선택별 농담은 유지한다. 유리/혼자/취소 경로에는 삽입하지 않는다.

입력: 기존 DAY18 dinner=HAEUN, menu 선택. 출력: 새 flag/보상/연락/동의 없음. 저장 재생은 기존 결정적 세그먼트 재생을 유지한다. 그래프는 메뉴 반응 → SCENE12 첫 세 대사 → 한 입 나누기 CG → “어때?” → 기존 대화/SCENE13이다.

에셋: 식당 테이블의 두 접시 사이에서 음식을 나누는 손 클로즈업. 얼굴·특정 메뉴명·먹여 주기·신체 접촉은 추가하지 않는다. 기존 에셋 검색에 맞는 식당 음식 나누기 그림이 없어 imagegen 스킬의 내장 생성 모드를 사용한다. 하은 음식 맛보기와 이후 각자 식사까지 이 한 컷이 모두 구현했다고 간주하지 않는다.

## 검증

- game200, bridge/playable12. `node --test tests/*.test.mjs`: 456 PASS, 0 FAIL.
- 세 메뉴 선택의 CG 1회/평가 전 순서/상태 무변경/직렬화 재생, 유리·혼자 미출현 자동 검사.
- 실제 앱 브라우저 1721×927, 집중 fixture(menu_share), SKIP 없이 메뉴 반응 → 첫 세 대사 → CG → “어때?” 확인. contain 화면에서 손과 두 접시가 잘리지 않는다. 자동 복귀 후 하은 표시와 19:00 유지.
- 새로고침/이어하기는 기존 정책대로 선택 직후 Scene 시작점에서 복구됨을 확인했다. CG 프레임 중간 재개를 의미하지 않는다. 콘솔 error/warning 없음. 같은 탭에서 사용자 원래 저장 복원 확인.
- 전체 4경로/모바일/후속 맛보기 행동은 이번에 검증하지 않았다. DAY18 PARTIAL 유지.

## 에셋 생성 기록

imagegen 스킬 / 내장 도구 generate → precise-object-edit. 첫 생성의 빈 상대 접시는 원문에 맞지 않아 기존 식사를 추가한 수정본을 채택했다. 얼굴·메뉴명·접촉을 새로 확정하지 않는다.

최종 저장 경로: `C:/Users/aaa/OneDrive/Desktop/AI해커톤/game/assets/events/day18-v4/food-sharing-v1.png`. 원본 생성 파일은 보존했다.

생성 프롬프트:

> Use case: illustration-story. Asset type: Korean slice-of-life visual novel event CG, landscape 16:9. Scene: tight tabletop close-up at a modest neighborhood restaurant in warm evening light. Subject: two simple ceramic dinner plates opposite each other. A young adult man's hand in a neutral sleeve uses chopsticks to place a single bite of food from his nearer plate onto the woman's plate across the table. Her relaxed hand and sage green sleeve appear at the far edge. Clear readable plate-to-plate sharing action, not feeding a mouth. Style: delicate clean anime linework, soft painterly everyday materials, restrained warm brown and sage palette. Small ordinary portions, unlabelled dishes, no feast. Faces and torsos outside crop; no kissing, handholding, rings, drinks, phones, text, logos, watermark, panels or UI. Natural anatomy and plausible chopstick grip. Main action centered for contain-fit game display.

최종 수정 프롬프트:

> Use case: precise-object-edit. Edit target: supplied tabletop food-sharing game CG. Change only the otherwise empty plate on the right: add a modest portion of a DIFFERENT ordinary cooked dinner dish (small pieces of vegetables and food), leaving a clear area where the chopsticks place the shared bite. Both people have already received their own meals in this story; her plate must not be empty. Preserve the shared bite, hands and anatomically plausible chopstick grip, sleeves, table, lighting, art style, framing and all other elements exactly. No text, logo, watermark, extra hands or extra plates.
