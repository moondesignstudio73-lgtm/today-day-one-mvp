# DAY18 하은 도착 가방 행동

2026-09-05 game224. DAY18 PARTIAL.

## 원문 분류와 구현

SCENE03 “그녀가 내 맞은편에 앉았다. 가방을 내려놓자 어깨도 조금 내려갔다.”는 대화가 아니라 물리 행동/자세 변화다. “의자 맡아 둔 사람이 더 좋아.” 직후 전용 CG로 연결하고 일반 대화창 문장으로 출력하지 않는다. 기존 하은 인물이 실제로 메고 있는 검은 크로스백과 세이지 셔츠, 포차의 빨간 테이블/의자를 그대로 기준으로 했다.

입력은 기존 dinner=HAEUN, menu 단계이고 출력 flag는 없다. 유리/SOLO에는 노출하지 않는다. 맞은편 착석과 가방 내려놓기를 나타내는 제한 프레임이며, 다음 원문 행동인 주인공의 메뉴 밀기까지 완료한 것으로 집계하지 않는다.

## 자산

ImageGen 스킬 built-in 모드, 기존 하은/포차를 참조했다. 생성 결과를 시각 확인하고 원본을 보존했다.

- 입력 인물: assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png
- 입력 배경: assets/backgrounds/map-locations/005_alley-pub.png
- 생성 원본: C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137\exec-b4432654-fb67-4a9f-a6cc-ce9d596dd435.png
- 프로젝트: assets/events/day18-v4/haeun-bag-down-v1.png

최종 프롬프트:

> Use case: illustration-story. Asset type: DAY18 silent visual novel arrival action CG, landscape 16:9. Image 1 is Haeun's exact outfit/identity reference; Image 2 is the exact Korean alley pub interior and lighting reference. Medium close crop across one red round metal table: Haeun is taking the seat opposite the first-person viewer while lowering the SAME small black crossbody bag from Image 1 onto the empty red stool beside her. Her shoulders visibly relax slightly. Preserve her sage overshirt, white top, navy trousers, necklace, short purple hair and small black bag exactly. Her face may be partially visible but identity and gentle neutral expression must match Image 1. Warm bare-bulb evening light and the same red tent pub materials. No menu in motion yet, no food, no alcohol being consumed, no extra people, no text, logos, UI or watermark. Natural hand and strap anatomy. This is arrival and setting down a bag, not leaving.

## 검증과 다음

- 3schema×3상대: HAEUN에만 1회, 정확한 대사 직후, 자산 존재, 원문 행동 문장 비출력, 상태 무변경/JSON 재생 동일성 PASS.
- 전체 Node 테스트 481 PASS, node --check/game diff PASS.
- game224 새 CG 실제 브라우저 표시/저장 재개: NOT RUN.

다음은 실제 비-SKIP 표시와 저장 재개를 확인하고, 같은 테이블에서 주인공이 메뉴를 하은 쪽으로 미는 후속 행동을 구현한다. SOLO 가방 이동, 알람 입력/소리, 모바일/최종 4경로/DAY15~17 감사도 남아 있다.

