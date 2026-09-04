# DAY18 V4 SCENE15 혼자 식사 후 행동 구현/QA

2026-09-05 실행. 원본 SCENE15의 휴대전화 뒤집기, 작은 식사 추가 주문, 직원의 봉투 흔들기와 주인공의 손 모방을 상태/행동/내적 반응으로 다시 분류했다. 기존 런타임은 앞의 두 행동을 일반 독백창에 합쳐 출력하고 봉투 문단 전체를 누락했다. DAY18 전체 판정은 PARTIAL이다.

## 구현 순서

1. 연락을 먼저 확인하고 있음을 내적 반응으로 보존한다.
2. `SFX_PHONE_SCREEN_OFF`와 정지 뒤, 뒤집힌 휴대전화·빈 첫 접시·작은 추가 음식 CG를 표시한다.
3. 다른 사람의 속도에 맞춰 배부른 척했을 가능성은 원문 내적 반응으로 보존한다.
4. 종이 봉투를 두 번 흔드는 환경 행동을 `SFX_DOCUMENT_RECEIVE` 두 번과 180ms 간격으로 표현한다.
5. 주인공이 봉투 펴는 모양을 따라 했다 멈추는 셀 채색 손 CG를 표시한다.
6. “누가 보면 바쁜 사람의 손 연습 같았을 것이다.”를 보존한 뒤 원본 세 선택으로 복귀한다.

새 사실 flag나 주문 금액은 만들지 않았다. 세 연락 선택 전에 공통으로 한 번만 실행되며 저장 스키마의 결정적 재생을 유지한다.

## 신규 자산과 프롬프트

- `assets/events/day18-v4/solo-phone-down-extra-food-v1.png`
- `assets/events/day18-v4/solo-bag-mimic-v1.png`

built-in imagegen을 사용했다. 첫 자산은 `002_gimbap-village-evening-v1.png`를 공간/조명 참조로 삼아 손 없이 뒤집힌 휴대전화·빈 첫 접시·소량 추가 음식만 보여 준다. 둘째는 첫 자산을 정밀 편집해 다른 물건과 구도를 보존하고 베이지 소매의 두 손만 추가했다.

최종 프롬프트의 핵심 계약:

- 첫 CG: 같은 김밥집 저녁, face-down smartphone, empty plate from one finished roll, one modest additional small dish, no people/hands/text/messages.
- 둘째 CG: 두 손이 실제 봉투 없이 서로 마주 보고 봉투 입구를 펴는 동작만 잠깐 모방, 기존 식탁·휴대전화·접시·음식 보존.
- 손 공통: `clean 2D anime cel-shaded visual-novel art`, `controlled inked contours`, `smooth flat skin color`, `2–3 broad shadow/value steps`, 양손 각각 정확히 다섯 손가락, `no photorealistic skin, pores, veins, hairs, detailed nails, photographic gradients, subsurface scattering, oily or wet photographic highlights, pasted live-action hands`.

## 실제 게임 QA

- 비-SKIP 순서와 SFX 간격, 두 CG 자동 복귀, 원본 내적 반응, 선택지 복귀: PASS
- 행동 문장 `휴대전화를 뒤집었다`, `봉투를 펴다가`의 일반 대화창 미출력: PASS
- 해부학 PASS: 두 손 각각 다섯 손가락, 손목/소매 경계와 좌우 간격 정상
- 화풍 PASS: 손은 선명한 2D 셀 외곽선/단순 명암이며 사진식 피부 질감 없음
- 휴대전화 화면이 보이지 않아 가짜 메시지/연락을 만들지 않음: PASS
- 테스트 전 사용자 저장 복원: PASS

다음은 SCENE17~18의 폰 화면 보기/손 바꾸기를 현재 메시지·통화 UI와 대조해 중복 없이 구현한다.
