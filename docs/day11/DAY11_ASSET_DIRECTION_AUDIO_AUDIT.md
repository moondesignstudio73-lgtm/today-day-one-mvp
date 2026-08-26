# DAY 11 기존 에셋·연출·오디오 감사

상태: `ASSET / DIRECTION / AUDIO AUDIT PASS`  
기준 시나리오: `docs/day11/DAY11_SCENARIO_DRAFT_V1.md`

## 결론

- 기존 배경 5종과 하은 스프라이트 1종으로 8개 Scene을 구성할 수 있다.
- 신규 최종 아트 필요: 0종.
- 기존 파일 덮어쓰기·삭제·이동: 없음.
- 이번 관문에서는 재사용 자산을 `audited`로 고정한다. 최종 이미지 QA와 `ready` 전환은 다음 관문에서 수행한다.

## 기존 배경 감사

| ID | 파일 | 규격 | Scene | 판정 |
|---|---|---:|---|---|
| `home-morning` | `assets/backgrounds/morning-studio-2d.png` | 1672×941 | S01·S03·S08 | 아침 햇빛, 식탁/거실 생활감, 우측 UI·인물 안전 여백 PASS |
| `day2-home-entry` | `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` | 1672×941 | S02·S07 | 현관·수납·주거 동선, 오후 톤, 메모/휴대폰 대화 PASS |
| `neighborhood-street-day` | `assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png` | 1672×941 | S04 | 무인 주거 거리·벤치·보행 동선, 낮 시간 PASS |
| `neighborhood-cafe-day` | `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | 1672×941 | S05 | 무인 낮 카페·테이블·두 잔, 일정 카드 협상 PASS |
| `neighborhood-park-day` | `assets/backgrounds/map-locations/035_running-park.png` | 1672×941 | S06 | 무인 낮 공원·벤치·산책로, 완충 시간 대화 PASS |

모든 배경은 16:9이며 인물·로고·읽어야 하는 글자가 없다. DAY 11의 작은 날짜 불일치는 배경에 고정 텍스트로 넣지 않고 대사·소품 서술로 처리해 언어·크롭·스포일러 위험을 피한다.

## 하은 자산 감사

- 파일: `assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png`
- 규격: 887×1774, RGBA PNG.
- 밝은 표정, 세이지 셔츠·크로스백·운동화가 집→동네 걷기→카페→공원 동선에 자연스럽다.
- DAY 11의 생활형 일정 협상에 적합하며 악역·미스터리 인상을 만들지 않는다.
- S02 날짜 차이 장면도 표정은 `calm`만 사용하고 놀람·경직·회피 컷을 금지한다.

## Scene별 연출 계약

| Scene | 화면·카메라 | 전환 | 서사 안전 규칙 |
|---|---|---|---|
| S01 카드가 먼저인 아침 | 식탁 카드 중경 | fade | 색연필 농담과 DAY 10 콜백을 따뜻하게 시작 |
| S02 두 날짜 | 메모 근접→하은 중경 | crossfade | 공포 줌·비네트·글리치 없이 사실 차이만 보여 줌 |
| S03 첫 기준 | 달력 오버헤드→중경 | cut | 선택 UI 전에 카드 소유권을 명확히 함 |
| S04 실제 이동 시간 | 거리 와이드→벤치 중경 | crossfade | 회복 속도를 실패나 위기로 연출하지 않음 |
| S05 겹친 오후 | 카페 테이블 카드 근접 | crossfade | 대립 구도 대신 같은 테이블 협상 |
| S06 빈칸의 용도 | 공원 와이드→메모 근접 | crossfade | 밝은 생활 톤 유지, 완충 시간을 성과로 과장하지 않음 |
| S07 공유의 범위 | 두 휴대폰 근접→중경 | crossfade | 화면 내용·개인 정보는 읽히지 않게 함 |
| S08 업데이트 가능한 우리 | 달력 근접→투샷 | fade | 계정 알림은 범위 확인 훅일 뿐 금융 정보 미공개 |

## 오디오 계약

- 전 Scene BGM: 기존 `daily`, variant 0, volume 0.055~0.065.
- 날짜 불일치에서도 위기·공포·관계 위기 BGM으로 전환하지 않는다.
- 기존 SFX만 재사용한다.
  - 카드·표 작성: `SFX_PENCIL_NOTE`, `SFX_DOCUMENT_RECEIVE`
  - 생활 소품: `SFX_CUP_SET_DOWN`, `SFX_SPARE_PHONE_KEY`, `SFX_PHONE_SCREEN_OFF`
  - 동네 걷기: `SFX_FOOTSTEP_APPROACH`
- 심장박동·충돌·전화벨·글리치·충격음 금지.

## 다음 관문

- 기존 5개 배경과 하은 스프라이트를 기술·육안 이미지 QA하고 `assetStatus`를 `ready`로 전환한다.

