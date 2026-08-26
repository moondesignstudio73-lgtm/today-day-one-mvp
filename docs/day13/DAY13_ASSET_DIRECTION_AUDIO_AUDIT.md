# DAY 13 기존 에셋·연출·오디오 감사

상태: `ASSET / DIRECTION / AUDIO AUDIT PASS`

기준 시나리오: `docs/day13/DAY13_SCENARIO_DRAFT_V1.md`

## 결론

- 기존 배경 4종과 하은 DAY 6 생활형 외출복 1종으로 8개 Scene을 구성할 수 있다.
- 신규 최종 아트 필요: 0종. 기존 자산을 덮어쓰거나 삭제·이동하지 않는다.
- 이번 관문 상태: `assetStatus: audited`. 다음 관문에서 원본 기술·화질 검사를 통과한 뒤 `ready`로 전환한다.
- 선반영 런타임은 아직 DAY 8 외출복을 참조한다. 구현 감사 관문에서 이 확정 매핑의 DAY 6 생활형 외출복으로 연결하되 시나리오·선택 계약은 변경하지 않는다.

## 기존 배경 감사

| ID | 파일 | Scene | 육안 판정 |
|---|---|---|---|
| `home-morning` | `assets/backgrounds/morning-studio-2d.png` | S01·S03·S07·S08 | 밝은 집과 넓은 식탁, 네 예산 카드·장부·폴더 연출 및 우측 인물/UI 여백 PASS |
| `day2-home-entry` | `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` | S02·S06 | 집 현관/거실 동선, 출처 라벨 확인과 송금 전 계획 정리에 적합 |
| `neighborhood-market-day` | `assets/backgrounds/day6/day6-neighborhood-market-day-v1.png` | S04 | 쌀·달걀·두부 등 생활 물품과 밝은 낮 시간대가 실제 가격·수량 검증에 적합 |
| `neighborhood-cafe-day` | `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | S05 | 무인 테이블과 두 잔, 영수증·간식비 분담 대화를 평온하게 담을 수 있음 |

시장 표찰·휴대폰·문서의 가격, 계정, 자동이체 정보는 개인정보 비가독 상태로 둔다. 실제 숫자를 읽혀야만 이해되는 별도 CG는 만들지 않는다.

## 하은 자산 감사

- 재사용 파일: `assets/characters/story-outfits/haeun-day6-neighborhood-casual-2d-v1.png`.
- 청회색 후드형 바람막이·크림 니트·밝은 바지·크로스백은 집→마트→카페→집의 당일 심부름 동선을 한 벌로 자연스럽게 잇는다.
- DAY 8 세이지 셔츠 반복을 피하면서도 하은의 23세다운 밝고 생활적인 인상을 유지한다.
- 생활 농담·합의는 `smile`, 출처와 실행 권한을 확인하는 순간은 `calm`을 사용한다. 의심·회피·공포·악역 표정은 사용하지 않는다.

## Scene별 연출 계약

| Scene | 화면·카메라 | 전환 | 안전 규칙 |
|---|---|---|---|
| S01 네 장의 카드 | 네 예산 카드 오버헤드→중경 | fade | 돈 문제를 위기로 시작하지 않고 생활 정리로 제시 |
| S02 확인된 출처 | 출처 라벨 근접→중경 | crossfade | 출처 종류만 식별, 실제 계정·금액은 비가독 |
| S03 첫 예산선 | 네 카드 오버헤드→중경 | cut | 세 전략을 감정 버튼이 아닌 작업 순서로 보이게 함 |
| S04 가격과 수량 | 가격표·장바구니 와이드→중경 | crossfade | 시장 표찰은 분위기 소품이며 특정 가격을 강제하지 않음 |
| S05 분담 규칙 | 영수증·간식 테이블 근접→투샷 | crossfade | 같은 테이블의 협상, 대립형 역숏 금지 |
| S06 계획과 결제 분리 | 흐린 자동이체 화면→중경 | crossfade | 계획 합의가 송금 권한이 아님을 시각적으로 분리 |
| S07 검토 범위 | 흐린 장부 권한 근접→중경 | crossfade | 개인 소비 내역·계정 정보 노출 금지 |
| S08 합의된 공유 | 네 카드·폴더 근접→투샷 | fade | 생활 합의의 안도와 DAY 14 시험 훅만 남김 |

전 Scene에서 공포 줌·비네트·글리치 금지. 화면 흔들림, 붉은 색보정, 충격 컷, 하은을 감시 대상으로 만드는 카메라도 금지한다.

## 오디오 계약

- 전 Scene BGM: 기존 `daily`, variant 0, volume 0.055~0.065.
- 기존 생활 SFX만 재사용한다.
  - 문서·장부: `SFX_DOCUMENT_RECEIVE`, `SFX_PENCIL_NOTE`
  - 가방·외출 동선: `SFX_BAG_ZIPPER`
  - 카페 생활감: `SFX_CUP_SET_DOWN`
  - 임시 예비폰·화면 종료: `SFX_SPARE_PHONE_KEY`, `SFX_PHONE_SCREEN_OFF`
- 심장박동·전화벨·충돌·충격·위기·글리치 음향 금지. 원래 휴대폰과 임시 예비폰을 혼동시키는 효과음을 쓰지 않는다.

## 다음 관문

- 기존 배경 4종과 하은 DAY 6 스프라이트의 PNG 규격·색상 유형·투명도·선명도·크롭 여백을 기술·육안 재검사한다.
- `IMAGE QA PASS`와 `NEEDS FIX: 0`을 확인한 뒤 8개 Scene을 `ready`로 전환한다.
