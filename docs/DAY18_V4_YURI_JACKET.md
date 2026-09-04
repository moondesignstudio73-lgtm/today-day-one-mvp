# DAY18 유리 겉옷 연속성 구현

2026-09-05 game223. DAY18 PARTIAL.

## 구현 및 상태 계약

도착 직전 메뉴 펼침 뒤 유리는 차콜색 겉재킷을 입고 나타난다. “지금 제목을 다 아는 단계예요.” 다음에 같은 재킷을 비스트로 의자에 거는 CG를 표시한 뒤 기존 흰 블라우스 인물로 돌아와 원문 내적 반응을 이어 간다. 입지도 않은 겉옷이 갑자기 생기지 않도록 도착/제거 자산을 함께 연결했다.

outerwear는 sceneDirection의 표시 전용 값이다. 관계/소유/동의/과거 이력이나 저장 스키마를 추가하지 않았다. 유리 SCENE03 도착에만 적용하며 이후 장면은 기본 의상이다. 저장 재개는 기존 선택 단계에서 장면을 재생해 같은 순서를 만든다. 다른 DAY NPC 렌더링은 변경하지 않는다.

## 발견 및 수정한 실제 문제

첫 브라우저 QA에서 bridge가 재킷 자산을 지정했는데도 기본 인물이 표시됐다. updateImmersiveCharacter가 NPC의 activeCharacterAssetUrl을 무시하고 전역 기본 sprite를 우선하고 있었다. DAY18 NPC에 한해 명시된 activeCharacterAssetUrl을 우선하도록 수정하고 VM 회귀 테스트를 추가했다. 수정 후 재로드/이어하기에서 재킷 인물→재킷 CG→기본 인물의 실제 src 및 표시를 확인했다.

## 자산

ImageGen 스킬의 built-in 편집/생성을 사용했다. 얼굴·머리·블라우스·치마·신발은 기존 유리 기준, 가구·조명은 기존 Rose Bistro 기준이며 생성 이미지를 시각 확인했다. 원본은 보존했다.

- 기준 인물: assets/heroines/yuri/yuri-ex-girlfriend-2d.png
- 기준 배경: assets/backgrounds/map-locations/024_rose-bistro.png
- 생성 원본 폴더: C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137
- 도착 원본: exec-2af602d2-2568-4cbe-876a-f6f6db648154.png
- 행동 원본: exec-987adbdf-d062-4255-8335-33bdd09f3033.png
- 프로젝트: assets/events/day18-v4/yuri-arrival-jacket-v1.png
- 프로젝트: assets/events/day18-v4/yuri-jacket-chair-v1.png

도착 최종 프롬프트:

> Use case: identity-preserve. Asset type: DAY18 arrival-only visual novel character portrait. Image 1 is the edit target. Add only a plain charcoal-gray hip-length tailored outer jacket worn OPEN over the existing white blouse. Preserve exactly Yuri's face, long dark hair, earrings, blouse bow and brooch, black skirt, belt, tights, heels, book, pose, hands, body proportions, full-body framing, lighting, painted anime style and dark background. Her hands stay in the same positions. This is ordinary outdoor outerwear she will remove in the next scene, not a redesign or a new outfit underneath. No new jewelry, no handbag, no logos, text or watermark.

행동 최종 프롬프트:

> Use case: illustration-story. Asset type: DAY18 silent visual novel action CG, landscape 16:9. Image 1 is the exact Yuri clothing/identity reference; Image 2 is the Rose Bistro furniture and lighting reference. Close crop on Yuri's white-blouse-sleeved hands gently draping the SAME plain charcoal-gray tailored jacket from Image 1 over the back of one burgundy upholstered chair from Image 2 beside the wooden dining table. She has just removed the jacket; her white blouse is unchanged. Crop above her shoulders and below hip level so no new face or body pose redesign is needed. Show the jacket's notch lapels, charcoal fabric and simple buttons consistently, no coat hanger. Warm amber evening light, same painted anime/visual novel aesthetic. No additional person, no food, no text, no UI, no watermark or logos. Natural two-hand anatomy. This is hanging her outerwear on a chair before dinner, not getting dressed or leaving.

## 검증과 다음

- 전체 480 PASS, node --check game.js PASS.
- 3schema×3상대의 도착/행동/기본 복귀, 앵커 순서, 자산 존재, JSON 재생/상태 무변경 검사.
- 실제 NPC 렌더러의 DAY18 자산 우선순위 및 다른 DAY 불변 검사.
- 실제 비-SKIP 집중 경로에서 재킷 착용, 의자에 거는 CG, 기본 의상과 독백 복귀, 19:00 확인. 콘솔 error/warning 없음. 사용자 저장 복원 완료.
- 재킷 CG 도중 저장 재개/후속 메뉴 선택 후 기본 의상 유지의 별도 실제 QA는 남았다. 전체 모바일/4경로 완료로 집계하지 않는다.

다음은 이 후속 의상 QA와 하은 도착의 가방 내려놓기/메뉴 밀기다. 실제 겉옷 벗는 연속 애니메이션은 아니며 정지 행동 컷으로 구현했다. DAY18 최종 게이트와 DAY19~30은 미완료다.

