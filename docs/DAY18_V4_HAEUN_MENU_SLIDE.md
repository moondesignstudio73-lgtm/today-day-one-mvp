# DAY18 하은에게 메뉴 밀기 행동

2026-09-05 game225. DAY18 PARTIAL.

SCENE03 원문 “나는 메뉴를 하은 쪽으로 밀었다.”를 가방 내려놓기 CG 바로 다음의 POV 행동 CG로 연결했다. 기존 가방 컷을 edit target으로 삼아 가방은 옆 의자에 그대로 두고, 주인공 손 하나가 읽을 수 없는 중립적인 포차 메뉴를 하은 방향으로 미는 변화만 만들었다. 음식명/가격은 확정하지 않는다.

입력은 dinner=HAEUN이고 출력 flag는 없다. 가방 내려놓기는 하은 행동, 메뉴 밀기는 주인공 행동으로 순서를 분리했다. 유리/SOLO에는 두 컷 모두 노출하지 않는다. 일반 대화창에 행동 문장을 출력하지 않는다.

## 자산

ImageGen 스킬 built-in edit. 생성 결과 시각 확인, 원본 보존.

- edit target: assets/events/day18-v4/haeun-bag-down-v1.png
- generated: C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137\exec-a8946bb4-3c41-4650-9b8d-ee1e9dd51169.png
- project: assets/events/day18-v4/haeun-menu-slide-v1.png

최종 프롬프트:

> Use case: precise-object-edit. Asset type: matching DAY18 silent visual novel action CG, landscape 16:9. Image 1 is the edit target. Preserve the same Haeun, expression, seated pose, sage overshirt, white top, navy trousers, necklace, short purple hair, black crossbody bag resting on the red stool, alley pub, table, perspective and warm lighting. Add ONLY a plain single-sheet laminated off-white Korean pub menu with tiny completely unreadable neutral line marks on the red table, being slid from the first-person viewer toward Haeun by ONE natural adult hand entering from the bottom foreground. Haeun is no longer holding the bag strap; both of her hands rest naturally near her side/table and do not touch the menu. The bag remains stationary on the stool. No legible words, prices, named dishes, food, alcohol consumption, extra people, logos, UI or watermark. This is the protagonist pushing the menu toward Haeun immediately after she sets down her bag.

## 검증

- 3schema×3상대에서 HAEUN에만 bag→menu 순서, 대사 앵커, 자산 존재, 행동 문장 미출력, 순수 재생 PASS.
- 전체 Node 481 PASS, node --check/game diff PASS.
- 실제 집중 경로 비-SKIP에서 haeun-bag-down-v1.png → haeun-menu-slide-v1.png → 메뉴 세 선택, 19:00을 확인했다. 콘솔 error/warning 없음, 사용자 저장 복원 완료.
- 새 메뉴 CG 도중 별도 새로고침은 NOT RUN. 앞선 가방 재개 QA를 메뉴 재개 증거로 재사용하지 않는다.

다음은 메뉴 CG 저장 재개와 SOLO 맞은편 가방을 옆으로 옮기는 행동이다. 하은의 메뉴 선택 반응은 기존 선택 후 장면에서 이어진다. 알람 입력/소리와 최종 게이트도 남아 있어 DAY18은 완료가 아니다.

