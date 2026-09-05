# DAY18 하은 식사 CG 장소 연속성 수정

2026-09-05. DAY18 PARTIAL, game206 / bridge18 / playable18.

## 발견 및 범위

기존 술집 배경 `005_alley-pub.png`와 옆자리 CG는 빨간 테이블인데 SCENE12 세 컷은 갈색 나무 식탁이었다. 새 행동 추가 전에 이 장소 연속성 오류를 수정했다. imagegen 스킬의 built-in 편집 모드로 테이블 재질/색만 수정하고 v1 원본은 보존했다. 음식·손·소매·동작·기존 시점은 유지했다. 새 대사, 선택, 관계/연락 사실, 저장 스키마 변경 없음. 전체 술집 가구의 원근/형태까지 완전 일치 판정은 아니다.

저장 위치 (저장소 루트 `C:/Users/aaa/OneDrive/Desktop/AI해커톤/game`):

- `assets/events/day18-v4/food-sharing-v3.png`
- `assets/events/day18-v4/haeun-tasting-v3.png`
- `assets/events/day18-v4/own-meals-v3.png`

## 프롬프트 세트 / 입력

1. food-sharing-v1 + 005_alley-pub:

> Use case: precise-object-edit. Image 1 edit target, Image 2 table material reference only. For this visual novel food-sharing CG change ONLY the brown wood tabletop to the worn warm red laminate pub tabletop from Image 2. Remove wood grain/plank seams; subtle worn red smooth surface and warm lamp reflections. Keep exact hands, chopsticks, food, plates, beige and sage sleeves, action, shadows, camera crop, illustration style and wide composition unchanged. Do not import the wide room or add objects, text, people. Preserve everything except tabletop material/color.

2. haeun-tasting-v1 + 위 공유 v2:

> Use case: precise-object-edit. Image 1 edit target, Image 2 tabletop material reference only. Change ONLY Image 1 brown wood tabletop to exactly the worn warm red laminate tabletop from Image 2. No wood grain/plank seams. Keep Image 1 hands, carrot held in raised chopsticks, food portions, plates, beige and sage sleeves, shadows, camera crop, illustration style and wide composition unchanged. No text, no new objects, no people, no new actions. Preserve the tasting action of Image 1, NOT the sharing action of Image 2.

3. own-meals-v1 + 위 공유 v2:

> Use case: precise-object-edit. Image 1 edit target, Image 2 tabletop material reference only. Change ONLY Image 1 brown wood tabletop to exactly the worn warm red laminate tabletop from Image 2. No wood grain/plank seams. Keep Image 1 TWO hands holding their own chopsticks over their own plates, greens on left chopsticks and carrot on right chopsticks, food portions, plates, beige and sage sleeves, shadows, camera crop, illustration style and wide composition unchanged. No text, new objects, people or new actions. Preserve own-meals action of Image 1, NOT sharing action of Image 2.

## 검증

- 입력 네 이미지와 출력 세 이미지를 직접 시각 대조했다. 테이블 색/재질 수정, 세 컷의 서로 다른 손동작 유지 확인.
- 자동 회귀 462 PASS, `node --check game.js`, `git diff --check` PASS (줄바꿈 경고만).
- 실제 앱 브라우저 127.0.0.1:4174, 별도 QA 저장의 음식 나누기 경로. SKIP 없이 대화 클릭 진행 → 공유 v2 → 맛보기 v2 → 각자 식사 v2 표시를 각 스크린샷과 DOM src로 확인했다. 자동 종료 후 원문 독백 복귀, 19:00/DAY18 유지, 콘솔 오류/경고 없음.
- 테스트 전 사용자 저장 복원 완료. 새 세 컷의 별도 중간 reload 및 나머지 메뉴 실제 플레이는 이번 실행에서 재수행하지 않았다. 자동 분기·저장 회귀와 구분한다.
- 동일 최종 버전 4경로, 모바일, DAY15~17 감사, 남은 원문 행동은 미완료. 이번 수정으로 DAY18을 COMPLETE로 승격하지 않는다.

다음: SCENE14 옆자리 어깨 접촉. 빨간 테이블/하은 의상/접촉 전후 위치를 먼저 고정하고, 이후 남은 행동 우선순위 재정리 및 최종 게이트 검증.
