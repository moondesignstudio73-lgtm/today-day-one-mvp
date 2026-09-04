# DAY18 V4 SCENE14 가방·산책 행동 구현/QA

2026-09-05 실행. 원본 SCENE14의 옆자리 가방 이동과 산책 후 손동작을 현재 코드·자산과 재대조했다. 기존 옆자리 배경에는 치운 뒤의 가방만 있었고 행동 순서는 없었으며, 산책 결과는 물리 행동 문장이 일반 독백창에 출력되고 있었다. 두 항목을 실제 CG로 교체했다. DAY18 전체 판정은 PARTIAL이다.

## 입력·분기 계약

- `close_seat`: 하은이 비어 있는 자리를 보고 가방을 치움 → “와.” → 주인공이 옆자리로 이동.
- `close_walk` + `handHoldingComfortable=false`: 밝은 길에서 나란히 걷는 거리만 좁아지고 손은 닿지 않음.
- `close_walk` + `handHoldingComfortable=true`: 손이 스친 뒤 자연스럽게 손을 잡음.
- 손잡기 이력은 기존 `day7V3HandContactEstablished` 입력과 `heldHands` 결과만 사용한다. 새 접촉·동의 사실을 만들지 않는다.

## 신규 자산

- `assets/events/day18-v4/haeun-bag-cleared-v1.png`
- `assets/events/day18-v4/haeun-walk-close-v1.png`
- `assets/events/day18-v4/haeun-walk-holding-hands-v1.png`

모두 built-in imagegen으로 만들었다. 가방 자산은 기존 `haeun-bag-down-v1.png` 정밀 편집, 산책 자산은 기존 하은 복장/인물 자산과 `BG_RELATIONSHIP_STREET_NIGHT_001.png`를 참조한 생성 및 손 접촉 정밀 편집이다.

최종 프롬프트의 고정 조건:

1. 가방: 원본 포차·복장·얼굴·구도를 보존하고 같은 검은 가방을 빈 빨간 의자에서 바닥으로 내리며 의자를 완전히 비운다.
2. 비접촉 산책: 밝고 안전한 주거지 밤길, 동일 하은/가방/베이지 셔츠의 두 성인만 배치하고 안쪽 손 사이에 명확한 작은 간격을 둔다.
3. 손잡기 산책: 비접촉 산책 프레임 전체를 보존하고 두 안쪽 손만 자연스럽고 느슨한 손잡기로 바꾼다.
4. 공통: `clean 2D anime cel-shaded visual-novel`, `2–3 broad shadow/value steps`, `smooth flat skin color`, 손마다 정확히 다섯 손가락과 올바른 접촉·가림, `no photorealistic skin, pores, veins, hairs, photographic gradients, subsurface scattering, oily or wet photographic highlights`, 추가 손·손가락·인물 금지.

## 런타임/실제 QA

- 가방 CG → “와.” → 옆자리 화면 순서: PASS
- 산책 대사 → 밤길 → 조건별 CG → 다음 원문 장면 복귀: PASS
- 가방/손 스침/거리 좁힘 행동 문장의 일반 대화창 미출력: PASS
- 비접촉과 손잡기 상태 격리 및 세 저장 스키마 결정 재생: PASS
- 해부학 PASS: 각 인물의 한 쌍 손, 자연스러운 보행 자세, 손잡기 접촉·가림 정상
- 화풍 PASS: 모든 손·손목이 얼굴·의상과 같은 2D 셀 채색/외곽선이며 사진식 피부 질감 없음
- 실제 게임 `contain` 화면과 비-SKIP 자동 복귀: PASS
- 테스트 전 사용자 저장 복원: PASS

SCENE14 감사표의 가방·물잔·산책 행동 범위는 완료했다. 다음 우선순위는 SCENE15 휴대전화 뒤집기, 작은 식사 추가 주문, 봉투 동작을 상태 변화와 단순 환경 연출로 나눠 구현하는 것이다.
