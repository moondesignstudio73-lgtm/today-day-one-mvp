# DAY 8 기존 에셋·연출·오디오 감사

판정: `CONTRACT PASS / REQUIRED ART 1`

## 감사 원칙

- 승인된 DAY 8의 장소·시간대·독립 심부름 의미를 비슷한 이미지로 바꾸지 않는다.
- 하은이 없는 단독 외출 구간에는 다른 인물 스프라이트를 대신 세우지 않는다. 생활용품점 직원은 화면 밖 음성으로 처리한다.
- 생활 업무의 작은 마찰을 미스터리로 과장하지 않는다. `tense`, `worried`, 위기 BGM, 심장박동·이명 효과는 금지한다.
- 연락 선택은 감시 여부가 아니라 합의한 행동 전략이다. 휴대폰 SFX와 카메라만으로 정보를 전달하고 하은을 수상하게 연출하지 않는다.

## Scene별 자산 판정

| Scene | 배경 | 판정 | 연출·오디오 |
|---|---|---|---|
| S01 범위 정하기 | `home-morning` | 재사용 PASS | medium, fade, `daily`, 가방·메모 |
| S02 연락 계약 | `home-morning` | 재사용 PASS | close-prop, cut, 예비폰 키 |
| S03 약국 확인 | `home-morning` | 재사용 PASS | medium, crossfade, 예비폰·현관문 |
| S04 우편함 | `neighborhood-street-day` | 조건부 재사용 PASS | 아파트 로비라고 속이지 않고 건물 앞 동네와 우편물 close-prop로 표현, 인물 없음 |
| S05 회원 번호 | `day8-household-store-day` | **신규 필수** | 생활용품점 낮, medium, 자동문, 직원은 화면 밖 음성 |
| S06 현재 구매 | `day8-household-store-day` / `neighborhood-cafe-day` | **점포 신규 필수** / 벤치 선택 조건부 재사용 PASS | 상품표 close-prop, `dateShopping`; `return_only_report`만 카페 좌석과 컵 SFX |
| S07 귀가 공유 | `home-morning` | 재사용 PASS | close-prop, 열쇠·물컵·우편물 |
| S08 출근 준비 | `home-morning` | 재사용 PASS | medium, fade, 메모·예비폰 키 |

## 육안 감사에서 제외한 자산

- `assets/backgrounds/yuna/convenience-store.webp`: 편의점 외관이며 낮은 해상도·흰 테두리·흐림이 있어 생활용품점 세제 진열대 대체 사용 금지.
- `assets/backgrounds/map-locations/029_street-fashion.png`: 야간 패션 매장이고 의류·신발이 중심이라 생활용품점 대체 사용 금지.
- `assets/backgrounds/map-locations/014_department.png`: 대형 고급 백화점의 규모와 상품 구성이 동네 심부름의 생활 밀도와 맞지 않아 대체 사용 금지.
- `assets/backgrounds/map-locations/004_small-cafe.png`: 카페 휴식 분기에는 쓸 수 있지만 세제 선택·결제 장면 대체 사용 금지.
- `assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png`: 건물 앞 동네를 보여 주는 용도로만 사용한다. 화면을 아파트 로비나 실제 우편함 내부라고 설명하지 않는다.

## 신규 배경 명세

`assets/backgrounds/day8/day8-household-store-day-v1.png`

- 16:9, 최소 1600×900, 밝은 월요일 오전의 소규모 동네 생활용품점 내부.
- 세제·수건·청소용품이 정돈된 진열대와 작은 용량 상품을 비교할 수 있는 전경.
- 고급 백화점·패션숍·편의점처럼 보이지 않는 생활 가격대와 규모.
- 인물·읽을 수 있는 상표·가격 문자·워터마크 없음. 상품 라벨은 추상 도형만 사용한다.
- 중앙 계산·상품 비교 공간과 우측 대화 UI/소품 클로즈업 여백을 확보한다.
- 이 파일의 이미지 QA가 끝나기 전 S05·S06을 `ready`로 전환하거나 실제 런타임 구현 완료로 판정하지 않는다.

## 캐릭터·카메라 계약

- 하은은 집 장면에서만 `smile` 또는 `calm`, `standing` 또는 `phone`을 사용한다.
- S04~S06은 주인공 1인칭 생활 판단 구간이므로 캐릭터 스프라이트를 비운다. 직원용 패션 매장 캐릭터를 오용하지 않는다.
- S04·S06·S07은 close-prop으로 우편물, 상품표, 영수증과 판단 순서를 보여 준다. 추적 화면·불안 줌·색수차는 금지한다.
- `haeunTrust` 차이는 S07 대사 직접성으로만 표현하고 배경·표정으로 불신을 암시하지 않는다.

## 오디오 계약

- BGM은 `daily`와 `dateShopping`만 0.055~0.065 범위로 사용한다. `crisis`, `theme`, 갑작스러운 무음은 금지한다.
- 기존 DAY 1·2 SFX 8종을 비파괴 재사용한다. 두 개 이상은 실제 대사·행동 사이에 나누어 재생한다.
- S06의 컵 내려놓기는 `errand8_return_only_report`의 카페 휴식 분기에만 사용한다. 다른 연락 전략에서는 장바구니·결제 소리만 사용한다.
- 약국 확인은 전화 통화의 내용을 대사로 전달하며 의료 경보음이나 병원 앰비언스를 추가하지 않는다.

최종 판정: 기존 배경 6개 Scene 재사용 PASS, 카페 휴식 분기 PASS, 생활용품점 낮 배경 1종 제작 필요. 연출·오디오 데이터 계약 PASS.
