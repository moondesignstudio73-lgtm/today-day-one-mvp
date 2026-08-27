# DAY 15 기존 에셋·연출·오디오 감사

상태: `ASSET / DIRECTION / AUDIO AUDIT PASS`

기준 시나리오: `docs/day15/DAY15_SCENARIO_DRAFT_V1.md`

## 결론

- 기존 배경 6종과 하은 DAY 7 데이트 외출복 1종으로 8개 Scene과 책방·전시·강변 분기를 구성할 수 있다.
- 신규 최종 아트 필요: 0종. 기존·사용자 자산을 덮어쓰거나 삭제·이동하지 않는다.
- 이번 관문 상태: `assetStatus: audited`. 다음 이미지 QA 관문에서 파일 규격·선명도·크롭·알파·UI 안전 여백을 기술·육안 검사한 뒤 `ready`로 전환한다.
- 선반영 DAY 15 런타임도 동일한 DAY 7 외출복과 배경 ID를 사용한다. 구현 감사에서는 확정 프레젠테이션 데이터의 분기 배경·카메라·오디오를 직접 연결한다.

## 기존 배경 감사

| ID | 파일 | Scene | 재사용 판정 |
|---|---|---|---|
| `home-morning` | `assets/backgrounds/morning-studio-2d.png` | S01 | 밝은 식탁과 후보 카드, 비용·거리·혼잡·중단 지점 확인을 생활 계획으로 보여 주기 적합 |
| `neighborhood-street-day` | `assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png` | S02 | 실제 이동 시간·벤치·귀가 동선을 확인하는 낮 산책에 적합 |
| `day7-bookshop-day` | `assets/backgrounds/day7/day7-small-bookshop-day-v1.png` | S03·S04·S05 책방 분기 | 후보 카드 선택, 예약 화면 확인, 표지 놀이와 책장 이동을 한 장소에서 자연스럽게 잇는다 |
| `day7-gallery-day` | `assets/backgrounds/map-locations/016_gallery.png` | S04·S05 전시 분기, S06 시작 | 작은 전시 입구·작품 관찰·혼잡도 확인에 재사용하며 작품 설명은 비가독 소품으로 처리한다 |
| `day7-river-promenade-day` | `assets/backgrounds/day7/day7-river-promenade-day-v1.png` | S06 교체 분기 | 혼잡한 전시를 벗어나 벤치와 바람을 확인하는 계획 변경의 행동 공간으로 적합 |
| `neighborhood-cafe-day` | `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | S07·S08 | 변경 뒤 휴식, 컵·메모·사진 동의와 DAY 16 메시지를 평온하게 마무리하기 적합 |

예약 화면의 `첫 예약`·`재방문`, 사진·위치·동행 태그는 실제 계정명·전화번호·시각·기기 정보가 읽히지 않는 흐린 소품으로 둔다. 대사가 확인한 라벨 차이와 메타데이터 부재만 전달하며 별도 계정 CG는 만들지 않는다.

## 하은 자산 감사

- 재사용 파일: `assets/characters/story-outfits/haeun-day7-date-dusty-rose-2d-v1.png`.
- 더스티 로즈 상의와 밝은 스커트의 데이트 외출복은 집→거리→책방/전시/강변→카페의 당일 동선을 한 벌로 잇는다.
- DAY 7 첫 현재형 데이트에서 이미 검증된 복장을 다시 사용해 두 데이트의 생활 연속성을 만들되, DAY 15를 과거 취향 재현처럼 보이게 하지는 않는다.
- 후보 농담·책/작품 놀이·현재 기억은 `smile`, 예약 출처·피로·공개 범위 확인은 `calm`을 사용한다. 긴장·회피·공포·악역 표정은 사용하지 않는다.

## Scene별 연출 계약

| Scene | 배경·화면·카메라 | 전환 | 오디오·안전 규칙 |
|---|---|---|---|
| S01 시간을 쓰는 연습 | `home-morning`, 후보 카드 오버헤드→투샷 | fade | `dateShopping` 0.07, 문서·연필·컵. 계획을 시험이 아닌 생활 놀이로 시작 |
| S02 서로의 차례 | `neighborhood-street-day`, 노선·벤치 와이드→중경 | crossfade | 가방 지퍼·자동문. 회복 이동을 위기 연출 없이 실제 동선으로 확인 |
| S03 첫 활동 선택 | `day7-bookshop-day`, 후보 카드/입구 중경→선택 UI | crossfade | 문서·연필. 세 선택을 상호 차례·결정 피로·감각 부담으로 제시 |
| S04 첫 예약과 재방문 | 책방 기본, 전시 분기, 흐린 예약 상세 근접→투샷 | cut | 예비폰 키·화면 종료·연필. 공포 줌·sting 없이 출처 부재만 확인 |
| S05 오늘 좋아한 것 | 책방 기본, 전시 분기, 책/작품 디테일→서로 다른 시선의 투샷 | crossfade | 문서·연필. 작품을 정답이나 기억 시험으로 강조하지 않음 |
| S06 바꿀 수 있는 계획 | 전시 입구 기본, 강변 교체 분기, 출구/벤치 와이드→중경 | cut | 자동문·컵 내려놓기. 화면 흔들림 없이 피로·혼잡과 종료권을 행동으로 표현 |
| S07 남은 시간의 주인 | `neighborhood-cafe-day`, 컵·후보 메모 근접→투샷 | crossfade | 컵 내려놓기·연필. 못 한 활동을 빚이나 실패로 색보정하지 않음 |
| S08 사진보다 먼저 | `neighborhood-cafe-day`, 흐린 공개 토글/컵 사진 근접→투샷 | fade | 예비폰 키·화면 종료·사진 프레임. 위치·동행 정보는 비가독, DAY 16 메시지는 조용한 훅 |

S04의 작은 위화감은 `두 라벨 관찰 → 상세 열기 → 출처 필드 부재 확인 → 화면을 함께 보기 → 문의만 남기고 닫기`의 화면 동선으로 표현한다. 비네트, 글리치, 충격 컷, 붉은 색보정, 심박 효과, 하은 단독 감시 구도는 전 Scene에서 금지한다.

## 오디오 계약

- S01~S05 전 Scene BGM은 기존 `dateShopping`, variant 0, volume 0.06~0.07을 사용한다. S04에서 미스터리·위기 음악으로 전환하지 않는다.
- S06~S08은 계획 변경과 카페 안착에 맞춰 기존 `daily`, variant 0, volume 0.055~0.065로 낮춘다.
- 기존 생활 SFX만 재사용한다.
  - 후보 카드·노선·작품/책·메모: `SFX_DOCUMENT_RECEIVE`, `SFX_PENCIL_NOTE`
  - 외출·입구·계획 변경: `SFX_BAG_ZIPPER`, `SFX_AUTO_DOOR`
  - 예약·공개 화면: `SFX_SPARE_PHONE_KEY`, `SFX_PHONE_SCREEN_OFF`
  - 카페·사진 기록: `SFX_CUP_SET_DOWN`, `SFX_PHOTO_FRAME`
- 심장박동·전화벨·충돌·충격·위기·글리치 음향 금지. 예약 라벨을 미스터리 정답처럼 들리게 하는 sting도 사용하지 않는다.

## 다음 관문

- 기존 배경 6종과 하은 DAY 7 스프라이트의 파일 존재·PNG 규격·색상 유형·투명도·선명도·크롭·UI 안전 여백을 기술·육안 검사한다.
- `IMAGE QA PASS`, `NEEDS FIX: 0`을 확인한 뒤 8 Scene의 `assetStatus`를 `ready`로 전환한다.
