# DAY18 SCENE11 지갑 동작 — 구현 계획

원문에서 주인공은 계산서를 보고 지갑을 꺼낸 뒤 유리의 질문을 듣는다. 마음 편하려고 모두 내겠다는 선택에서는 유리의 거절 뒤 지갑을 닫고 “……나눠요.”라고 한다.

DAY4 결제 CG를 시각 확인했지만 낮 카페/이미 카드 두 장을 내는 장면으로 시간·행동이 맞지 않는다. imagegen 스킬 built-in으로 저녁 식탁의 열린 지갑 CG와 같은 구도의 닫은 지갑 변형을 만든다. 기존 자산 보존, 새 버전 PNG 두 장 저장.

입력: 기존 payment phase 및 pay_debt 선택. 출력: CG만 추가, 금액·결제·관계·재만남 동의 facts 변경 없음.

그래프: SCENE11 식당/유리 → 열린 지갑 → “왜 벌써 다 내려 그래?” → 질문 대화 → 계산 선택. pay_debt만 유리 거절 → 닫힌 지갑 → “……나눠요.” → 기존 작별. 다른 결제 반응에 닫기 사건을 강제하지 않는다.

검증: 원문 앵커와 순서, 두 자산 존재, 상태 불변/재생, 실제 CG/유리 복귀/선택/저장 재개. 정지 CG이며 지갑 애니메이션·영수증 조작까지 구현했다고 세지 않는다. DAY18 PARTIAL.

## 결과

- imagegen built-in 신규 생성 → 동일 이미지 편집으로 열린/닫힌 지갑 2장 생성. 프로젝트 경로: `assets/events/day18-v4/wallet-open-v1.png`, `assets/events/day18-v4/wallet-closed-v1.png`. 원본 generated_images 및 DAY4 자산 보존.
- 손 화풍 재감사 후 런타임은 `wallet-open-v2.png`, `wallet-closed-v2.png`를 사용한다. 빈/닫힌 지갑과 구도는 유지하고 양손만 선화·평면 셀 채색으로 교체했다.
- 실제 game198: 열린 지갑 → 유리 “왜 벌써 다 내려 그래?” → 계산 선택 → pay_debt → 유리 거절 → 닫힌 지갑 → “……나눠요.” 순서 확인. 19:00/유리 스프라이트 복귀 확인. 새로고침/이어하기에서도 닫는 반응 재생.
- 콘솔 오류/경고 없음. 기존 사용자 저장 복원 확인. 집중 테스트 32 PASS, 전체 테스트 454 PASS / 0 FAIL. 구문/diff 검사 통과. 금전/관계/저장 스키마 변경 없음.
- 다음은 SCENE12 음식 나누기 행동. 최종 4경로/모바일과 나머지 행동은 미완료이며 DAY18 PARTIAL.

## 최종 프롬프트

신규 생성:

Use case: illustration-story. Asset type: Korean contemporary visual novel action CG, horizontal 16:9. First person tight view of an adult protagonist's two natural hands holding an OPEN plain dark brown bifold wallet just above a dark wood restaurant table at dinner time. He has taken his wallet out too quickly before discussing who pays. A small restaurant bill on a plain tray lies on the table but all print is illegible, no numbers or logos. Neutral shirt sleeve cuffs, warm evening indoor lighting, restrained semi-realistic painted visual novel illustration. Only the protagonist's hands and wallet, no other people or faces. Tight crop on tabletop without windows or room architecture. Cards remain inside wallet with no visible personal data, no cash changing hands, no payment terminal, no completed transaction. No speech bubbles, game UI, watermark or extra text. This is reaching for a wallet, not having paid.

닫기 편집(열린 지갑 이미지 참조):

Use case: precise-object-edit. Input image: edit target, the open-wallet visual novel CG. Create the next action shot: the same protagonist has CLOSED the same dark brown bifold wallet in both hands, folding it shut calmly after deciding not to pay to erase guilt. Change ONLY the wallet from open to fully closed and the hand grip necessary to close it. Preserve exact camera, tabletop, bill tray and illegible paper, dishes, warm evening light, sleeves, hand identity, painted style, horizontal framing. No cards or cash removed, no payment made, no new people, no text or UI, no logos or watermark. The clearly closed wallet must be readable.
