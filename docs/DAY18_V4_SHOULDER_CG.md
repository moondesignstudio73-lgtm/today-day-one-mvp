# DAY18 SCENE14 어깨 접촉 CG

2026-09-05 00:20 실행. game207 / bridge19 / playable19. DAY18 PARTIAL 유지.

## 구현

앞선 `DAY18_V4_SHOULDER_CONTRACT_QA.md`의 상태/장면 계획을 따른다. `close_seat` 응답의 “아니. 괜히 작은 소리로 말하게 돼.” 직후 3초 정지 CG → 기존 짧은 정적 → 물잔을 조심스럽게 드는 내적 반응으로 연결했다. 접촉 행동을 일반 독백으로 다시 넣지 않았다. 옆자리 허락과 이동 대화보다 먼저 표시하지 않는다.

기존 `sharedSeat`/`walkTogether`/`heldHands` 상태 및 저장 스키마는 변경하지 않았다. 산책/귀가와 실제 다른 사람 관심으로 친밀 선택이 닫힌 경우에는 CG를 표시하지 않는다. 정지 CG이며 가방 이동·접촉 접근 애니메이션까지 완료한 것은 아니다.

## 자산

imagegen 스킬, built-in 도구의 기존 이미지 참조 편집. 입력 `assets/events/day18-v4/haeun-beside-seat-v1.png`를 직접 확인했다. 하은 의상/보라색 단발, 베이지색 주인공 어깨, 빨간 테이블/물잔, 저녁 술집 조명 유지. 얼굴을 새로 만들지 않도록 주인공은 어깨만 표현하고 포옹/키스/손잡기는 넣지 않았다. 출력과 실제 게임 화면을 시각 확인했다.

저장: `C:/Users/aaa/OneDrive/Desktop/AI해커톤/game/assets/events/day18-v4/shoulder-contact-v1.png`. 기존 옆자리 이미지 보존.

최종 프롬프트:

> Use case: identity-preserve. Edit target/reference: existing visual novel beside-seat illustration. Create a follow-on close-up CG of the SAME woman and SAME warm alley pub at evening. Camera tightly frames two adjacent shoulders lightly touching as they sit side by side, a brief ordinary affectionate moment, NOT leaning head on shoulder. Woman retains exact purple bob, sage overshirt, white tee and necklace; her relaxed small smile may appear at top but preserve identity. Male protagonist beside her is shown ONLY as cropped beige shirt shoulder/upper arm, no invented face. Their upper outer shoulders barely meet at center; arms relaxed, no reaching, embracing, kissing or hand holding. Small portion of existing RED round laminate tabletop and clear water glass at lower edge, same warm bulbs and alley setting softly out of focus. Wide 16:9 anime game illustration, restrained natural mood. No text, UI, hearts, extra characters, extra limbs, new clothing or different location. This is a quiet shoulder-touch cut after permission to sit beside her, not a dramatic romantic pose.

## QA

- 전체 자동 테스트 464 PASS, game.js 문법 검사와 diff 공백 검사 통과. /1·/2·/3 × 이전 손잡기 편안함 × 친밀 선택의 기존 검사에 CG 조건/앵커/정적/독백 순서와 자산 존재 확인을 추가했다. JSON 재생 및 상태 불변성도 통과.
- 실제 앱 브라우저, 별도 저장 fixture: SCENE14 도입을 비-SKIP 진행 → 직접 “옆으로 가도 돼?” 선택 → “와.”/거리 대화 → CG 표시 → 물잔 내적 반응 정상 복귀. DAY18/19:00 유지. 자유행동 메뉴 미노출. 스크린샷으로 접촉/의상/테이블 확인.
- 새로고침/이어하기 후 옆자리 선택 응답 “와.”부터 복구되어 같은 CG를 다시 표시했다. 콘솔 오류/경고 없음. 동일 탭에서 테스트 전 사용자 저장 복원 완료.
- 이는 집중 QA로 전체 4경로/모바일 검증을 대신하지 않는다.

다음: 기존 행동 감사표를 최신 수정과 대조해 미해결 항목을 다시 정리하고 SCENE01 아침 생활 행동부터 구현한다. 가방 이동·표정/먹기·영수증·귀가 물건·밤 마무리 등 남은 항목 및 최종 동일 버전 4경로/모바일, DAY15~17 충실도 감사 후에만 DAY19로 넘어간다.
