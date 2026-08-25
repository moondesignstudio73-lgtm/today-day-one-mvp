# DAY 7 기존 에셋·연출·오디오 감사

판정: `CONTRACT PASS / REQUIRED ART 2`

## 감사 원칙

- 시나리오 잠금본의 장소 의미와 시간대를 바꾸지 않는다.
- 비슷해 보인다는 이유로 학교 도서실을 작은 책방으로, 야간 놀이공원 수변을 낮 강변으로 표시하지 않는다.
- 하은은 밝고 생활적인 인상을 유지하며 `tense`, `worried`, 위기 BGM을 사용하지 않는다.
- 체력 저하 장면은 공포 연출이 아니라 카메라 거리·BGM 볼륨·물컵 SFX로 속도를 낮춘다.

## Scene별 자산 판정

| Scene | 배경 | 판정 | 연출·오디오 |
|---|---|---|---|
| S01 준비 | `home-morning` | 재사용 PASS | medium, fade, `dateShopping`, 가방 지퍼 |
| S02 거리 | `neighborhood-street-day` | 재사용 PASS | wide, crossfade, 자동문 |
| S03 책방 | `day7-bookshop-day` | **신규 필수** | 작은 독립 책방 낮, medium, 책을 집는 마른 소리 대신 기존 문서 SFX 임시 사용 |
| S04 활동 | `day7-gallery-day` / `day7-river-promenade-day` | 전시관 PASS / **강변 신규 필수** | 넓은 프레임, `dateShopping` variant 1 |
| S05 회복 | S04 분기 유지 | 전시관 PASS / **강변 신규 필수** | close, cut, `daily` 0.055, 컵 내려놓기 |
| S06 식사 | `neighborhood-cafe-day` | 재사용 PASS | 샌드위치 가게 전용 배경 대신 좌석 중심 카페로 표현, 음식 종류를 배경에 강요하지 않음 |
| S07 기록 | `home-morning` | 재사용 PASS | close-prop, 사진 프레임·연필 |
| S08 내일 | `home-morning` | 재사용 PASS | medium, fade, 예비폰 키 |

## 육안 감사에서 제외한 자산

- `assets/backgrounds/yuna/library.webp`: 학교 교실과 연결된 도서실 구조가 명확해 작은 독립 책방 대체 사용 금지.
- `assets/backgrounds/map-locations/042_lake-promenade.png`: 야간 조명·관람차가 중심이어서 일요일 낮 강변 대체 사용 금지.
- `assets/backgrounds/street/BG_RIVER_NIGHT_001.webp`: 시간대가 밤이라 DAY 7 오전~오후 장면에 사용 금지.

## 신규 배경 명세

1. `assets/backgrounds/day7/day7-small-bookshop-day-v1.png`
   - 16:9, 낮의 자연광, 낮은 책장과 작은 의자, 인물·문자·상표 없음, 대화창과 하은 스프라이트가 놓일 중앙/우측 여백.
2. `assets/backgrounds/day7/day7-river-promenade-day-v1.png`
   - 16:9, 맑은 낮, 평탄한 산책로와 벤치·난간·수면, 놀이공원·야간 조명 없음, 회복 장면용 앉을 위치가 명확할 것.

두 파일이 품질 검사를 통과하기 전 S03 및 재방문 분기 런타임 구현을 완료 처리하지 않는다.

## 캐릭터·카메라 계약

- 하은: `smile` 중심, 회복 선택에서는 `calm`; 불안 과장 표정 금지.
- 포즈: `standing`, 준비·DAY 8에서만 `phone`; 스킨십을 자동 연출하지 않는다.
- S04는 wide로 공동 경험, S05는 close로 체력 확인, S07은 close-prop로 사진·문장·규칙 선택을 강조한다.

## 오디오 계약

- BGM은 `dateShopping`과 `daily`만 사용한다. `crisis`, `theme`의 미스터리 강조, 갑작스러운 무음은 금지한다.
- 기존 SFX 7종을 비파괴 재사용한다. 같은 장면에서 두 효과음을 연속 재생할 때 최소 한 대사 이상의 간격을 둔다.
- 회복 선택에서 볼륨을 0.055로 낮추되 심장박동·이명 같은 공포 효과를 추가하지 않는다.

최종 판정: 기존 에셋 6개 Scene 재사용 PASS, 전시관 분기 PASS, 작은 책방·낮 강변 2종 제작 필요. 연출·오디오 데이터 계약 PASS.
