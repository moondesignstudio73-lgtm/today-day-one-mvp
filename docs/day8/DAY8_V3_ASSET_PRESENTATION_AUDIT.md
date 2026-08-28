# DAY 8 V3 Asset / Presentation Audit

## 기준과 범위

- 원고: Notion 하위 페이지 `DAY 8 — 너 없는 오후 | SCENARIO V3`, SCENE 01~24.
- 비교 기준: DAY 2 현관 열쇠·사진·운전 행동 CG, `DAY2_IMAGE_QUALITY_QA.md`, `DAY2_LIVE_VISUAL_QA_2026-08-26.md`.
- 화면 계약: 1672×941 이상, 약 16:9, 원본 비율 유지, desktop center-80 / mobile center-60 안전 영역, 배경은 `cover`, 행동 CG는 핵심 소품 보존을 위해 `contain` 우선.
- 하은은 오늘 대면하지 않는다. 기존 DAY 8 세이지 외출 의상·스탠딩 스프라이트를 억지로 노출하지 않고 메시지/통화 UI로만 등장시킨다.

## 실제 지도·프리모드 통합

| 콘텐츠 | 실제 구현 근거 | DAY 8 서사 역할 | 판정 |
|---|---|---|---|
| 집/혼자 쉬기 | `dongsu-home`, `morning-idle`, `night-idle`, `early-sleep` | 독립 일정, 공개 영상 시청, 휴식 경계 | 필수·PASS |
| 친구 만남 | `best-friend` 지훈, `handsome-meet-friends` | 과거 증언자가 아닌 현재 친구의 작업을 듣기 | 필수·PASS |
| 홍등반점 | `china-diner`, `007_china-diner.png` | 식사 선택+물컵 행동+지훈의 짧아진 대답 | 필수·PASS |
| 카페 모퉁이 | `small-cafe`, `004_small-cafe.png` | 조용한 대화와 냅킨 그림 | 선택·PASS |
| 라이브 하우스 | `live-house`, `027_live-house.png` | 지훈 취향을 실제 관람하고 일정 선택 발생 | 선택·PASS |
| 메시지/통화 | `short-message`, `night-call` | 허락 아닌 일정 공유, 지각·진실성·프라이버시 | 필수·PASS |
| 음악/문화생활 | `live-house`, 지훈 영상 편집 직업 | 공연과 공개 크레딧을 현재 관계 사건으로 전환 | 선택·PASS |

단순 기능 소개는 없다. 모든 장소·시스템은 지훈의 현재 삶, 하은과의 독립 일정, 행동 선택, 후속 신뢰 중 하나 이상을 실제로 바꾼다. 최근 DAY 5 직장, DAY 6 동네 탐방, DAY 7 하은 데이트와 중심 경험이 겹치지 않는다.

## 배경 재사용 감사

| 자산 | 원본 | 용도 | 판정 |
|---|---:|---|---|
| `assets/backgrounds/day4/day4-bedroom-morning-v1.png` | 1672×941 RGB | S01~03 아침 방 | REUSE PASS |
| `assets/backgrounds/day2/day2-home-exterior-afternoon-v1.png` | 1672×941 RGB | S04 혼자 출발 | REUSE PASS |
| `assets/backgrounds/map-locations/007_china-diner.png` | 1672×941 RGB | S04~10 홍등반점 | REUSE PASS — 2인 원형 테이블과 중앙 행동 여백 |
| `assets/backgrounds/map-locations/004_small-cafe.png` | 1672×941 RGB | S15 카페 경로 | REUSE PASS — 별도 CG 합성 없이 배경으로 사용 |
| `assets/backgrounds/map-locations/027_live-house.png` | 1672×941 RGB | S15 공연 경로 | REUSE PASS — 좌석 공연은 전경 좌석/인물 CG로 보강 필요 |
| `assets/backgrounds/day4/day4-home-night-consistent-v1.png` | 1672×941 RGB | S15 귀가·S18~24 밤 | REUSE PASS |
| `assets/events/day4/cg-day4-table-phone-photo-pov-v1.png` | 1672×941 RGB | 지훈 동일성/휴대전화 행동 참고 | REFERENCE ONLY — 사진 내용과 장소가 V3와 다름 |
| `assets/characters/day4/jihoon-day4-*.png` | RGBA | 지훈 표정·복장 동일성 | REUSE CANDIDATE — 실제 배경 합성·스케일 QA 전 PASS 금지 |

## DAY 2 대비 핵심 행동 이미지 관문

| Scene | 화면 안 행동 | 기존 자산 충분성 | 결정 |
|---|---|---|---|
| S05 | 넘치게 따른 물컵과 둘의 손, 선택 음식 | 신규 1672×941 행동 CG 제작·육안 QA | READY — `cg-day8-v3-overfilled-water-glass-v1.png` |
| S06 | 이사 상자 앞 과거 사진 한 장 | 신규 1672×941 휴대전화 POV 제작·육안 QA | READY — 사진 요청 경로 한정 |
| S12 | 별도 공개 영상의 끝 크레딧에서 지훈 이름 확인 | 신규 1672×941 휴대전화 POV 제작·육안 QA | READY — 실제 이름은 UI 오버레이 |
| S15 | 공연 엇박수 / 카페 냅킨 그림 / 집 공개 영상 | 공연 CG 제작·육안 QA, 카페는 미완료 | LIVE HOUSE READY; CAFE ACTION CG REQUIRED; 귀가는 S12 CG 재사용 |
| S24 | 하은이 이미 가진 다른 색 옷 두 벌 사진 | 구 세이지 의상은 ‘오늘 외출’로 오해됨 | NEW CLOTHING PHOTO POV REQUIRED |

신규 6종은 모두 1672×941 이상 16:9, 텍스트/브랜드 없는 원본으로 제작한다. 휴대전화의 크레딧 이름·메시지는 HTML UI가 담당한다. 지훈 얼굴·손·컵·휴대전화·냅킨·옷 두 벌은 중앙 mobile center-60 안에 남겨야 한다. 현재 S05·S06·S12·S15 공연 4/6 제작·원본 육안 QA·조건부 자산 연결 PASS이며 나머지 2종은 미완료다.

## DAY 2 품질 비교

| 항목 | DAY 2 기준 | DAY 8 결정 |
|---|---|---|
| 구도 | 행동 주체·손·핵심 소품이 같은 원근 | 물컵/사진/크레딧/엇박수/냅킨/옷을 각각 행동 CG로 분리 |
| 비율 | 1672×941, 약 16:9 | 모든 배경 PASS, 신규 CG 동일 이상 |
| 선명도 | 저해상도 확대 없음 | 지도/집 배경 원본 PASS; 신규 원본 QA 필수 |
| 캐릭터 일관성 | 동일 얼굴·체형·복장·광원 | 지훈 DAY 4 식별성 계승; 하은은 대면 스프라이트 미노출 |
| 장면 행동성 | 중요한 소품을 대사로만 처리하지 않음 | 핵심 6종 신규 제작 전 IMAGE GATE 미완료 |
| UI 안전 영역 | HUD/대화창과 얼굴·손·소품 비가림 | CG `contain`, 배경 `cover`, desktop center-80/mobile center-60 |

## 오디오·연출 초안

- BGM: S01~06 `daily`, S07~14 낮은 `daily`, 공연 S15 `dateShopping` 또는 문화생활 계열, S18~24 `daily` 저음량.
- SFX: 휴대전화 진동/화면 끄기, 문 잠금, 컵 놓기, 식기, 거리, 박수, 카페 컵, 귀가 열쇠.
- 공연 음악은 대사보다 작고 저작권 안전한 기존 게임 BGM만 사용한다. 지훈의 비공개 영상 음성·파일은 재생하지 않는다.

## 결론

- 지도·프리모드·배경 커버리지: PASS.
- 기존 자산 재사용 판정: PASS.
- 신규 핵심 행동 CG 명세: PASS.
- 원본 이미지 QA/실제 브라우저 QA: NOT STARTED — 신규 6종 제작 후 진행.
- 다음 관문: 핵심 행동 CG를 순차 제작하고 원본 해상도·내용·안전 영역을 육안 QA한다. DAY 9는 시작하지 않는다.
