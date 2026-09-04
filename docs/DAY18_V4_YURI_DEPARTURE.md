# DAY18 SCENE11 유리 결제·작별 이동

2026-09-05, game236. DAY18 PARTIAL.

## 원문 대조와 구현

원문 SCENE11의 결제 선택 뒤에는 식당 밖 이동, 서로 다른 귀가 방향, 짧은 작별이 있다. 기존 런타임은 지갑 CG 뒤 `잘 들어가` 두 줄과 집 전환만 출력해 실제 장소 이동을 보여 주지 않았고, 나눠 내기 경로의 영수증 행동을 일반 독백으로 출력했다.

- `pay_split`은 일반 대화창의 행동 요약을 제거하고 기존 종이 수령 cue로 영수증 취급을 표현한다. 누가 영수증을 가져갔는지는 원문도 확정하지 않으므로 새 flag를 만들지 않는다.
- 모든 유리 결제 선택은 식당에서 동네 밤길로 전환한 뒤 원문 작별 두 줄을 재생한다.
- 작별 뒤 발걸음 cue와 유리 인물 제거를 거쳐 집 22:00으로 이동한다. 다른 약속·수락·관계 상태를 만들지 않는다.
- 유리의 기존 기본 스프라이트를 사용한다. 검은 직사각형 matte가 포함된 재킷 자산을 야외에 재사용하지 않는다.

## 이미지 자산 게이트

imagegen built-in 편집으로 기존 `yuri-arrival-jacket-v1.png`의 배경 제거를 두 번 시도했다. 두 결과 모두 요청한 alpha PNG가 아니라 체크무늬가 화상에 합쳐진 24-bit RGB였고 모서리 alpha가 전부 255였다. 실패 결과는 프로젝트에서 제거했으며 코드에 연결하거나 커밋하지 않았다. 따라서 원문의 `겉옷을 여민다`는 시각 행동은 **미완료**로 남긴다.

최종 시도 프롬프트:

> Use case: background-extraction. Asset type: production PNG character sprite. Remove the entire black/gray background from Image 1 and output ONLY the unchanged Yuri character pixels on a TRUE ALPHA-TRANSPARENT canvas. Critical correction: do NOT draw any checkerboard, white field, gray field, glow panel, rectangle, matte, drop shadow, or replacement background. Every pixel outside the character silhouette must have alpha 0. Preserve the exact adult character identity, face, long dark hair, charcoal jacket, white blouse and brooch, black skirt, belt, tights, heels, book, pose, proportions, hand anatomy, 2D cel-shaded visual-novel style, full-body composition and 1024x1536 canvas. Keep hair edges clean and semi-transparent only where naturally needed. No photorealistic skin, no anatomy changes, no text, no watermark.

## 검증

- 대상 61 PASS, 전체 490 PASS, `node --check game.js` PASS.
- 세 결제 선택 모두 결정적으로 `야외 유리 → 작별 → 발걸음 → 인물 없는 야외 → 집` 순서를 유지한다.
- 실제 `pay_split` 집중 QA에서 결제 선택을 비-SKIP으로 진행하고, 동네 밤 배경의 유리 → 작별 두 줄 → 22:00 집 전환을 확인했다. matte 없는 기본 스프라이트를 시각 확인했으며 사용자 저장을 최초 QA 탭의 백업으로 복원했다.
- 첫 전체 회귀에서 알람 SKIP 테스트용 최소 DOM의 `removeAttribute` 미구현 때문에 1건이 실패했다. 실제 DOM 동작은 유지하면서 메서드 존재를 확인하도록 정리 코드를 보강했고, 해당 5 PASS 및 전체 490 PASS로 재검증했다.

다음은 SCENE14 가방 이동·물잔 들기·산책 손동작을 실제 상태별로 대조한다. 겉옷 여밈은 적합한 투명 자산을 확보하기 전까지 완료로 집계하지 않는다.
