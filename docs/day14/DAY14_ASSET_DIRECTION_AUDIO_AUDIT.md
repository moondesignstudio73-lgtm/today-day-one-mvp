# DAY 14 기존 에셋·연출·오디오 감사

상태: `ASSET / DIRECTION / AUDIO AUDIT PASS`

기준 시나리오: `docs/day14/DAY14_SCENARIO_DRAFT_V1.md`

## 결론

- 기존 배경 5종과 하은 DAY 8 생활형 외출복 1종으로 8개 Scene을 구성할 수 있다.
- 신규 최종 아트 필요: 0종. 기존·사용자 자산을 덮어쓰거나 삭제·이동하지 않는다.
- 이번 관문 상태: `assetStatus: audited`. 다음 이미지 QA 관문에서 기술 규격·선명도·크롭·알파·UI 안전 여백을 검사한 뒤 `ready`로 전환한다.
- 선반영 DAY 14 런타임도 DAY 8 의상을 사용하므로 의상 교체가 필요 없다. 구현 감사에서는 확정 프레젠테이션 데이터와 Scene 배경·카메라·오디오를 직접 연결한다.

## 기존 배경 감사

| ID | 파일 | Scene | 재사용 판정 |
|---|---|---|---|
| `home-morning` | `assets/backgrounds/morning-studio-2d.png` | S01·S08 | 밝은 집과 식탁, 예산 카드·빈 장바구니·DAY 15 후보 메모를 생활 정리로 보여 주기 적합 |
| `day2-home-entry` | `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` | S02·S07 | 현관/거실의 준비와 귀가 동선, 생활품·컵 사진·선물 동의 대화에 적합 |
| `day8-household-store-day` | `assets/backgrounds/day8/day8-household-store-day-v1.png` | S03·S04 | 낮 생활용품점 선반과 밝은 통로, 문구·수건·세제·추천 화면 확인을 한 장소에서 이어 갈 수 있음 |
| `neighborhood-market-day` | `assets/backgrounds/day6/day6-neighborhood-market-day-v1.png` | S05 | 생활품 진열과 계산 동선, 묶음 할인·수량 판단을 일상적 압박으로 표현하기 적합 |
| `neighborhood-cafe-day` | `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | S06 | 무인 테이블과 잔, 영수증 또는 가격 비교 메모를 함께 검토하는 평온한 후속 장면에 적합 |

추천 카드·가격표·영수증·위시리스트의 사용자명, 시각, 기기, 결제 정보는 개인정보 비가독 상태로 둔다. 대사가 확인한 `출처 필드가 비어 있음`만 전달하며 실제 계정 화면을 읽을 수 있는 별도 CG는 만들지 않는다.

## 하은 자산 감사

- 재사용 파일: `assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png`.
- 세이지 셔츠·크림 이너·밝은 팬츠의 가벼운 심부름 복장은 집→생활용품점→마트→카페→집의 당일 동선을 한 벌로 잇는다.
- 밝은 색과 편한 실루엣이 하은의 23세다운 생활감·다정함·장난기를 유지하며 쇼핑을 조사나 잠복처럼 보이게 하지 않는다.
- 농담·선택권 확인·DAY 15 제안은 `smile`, 가격·출처·동의 범위 확인은 `calm`을 쓴다. 불안·긴장·회피·악역 표정은 사용하지 않는다.

## Scene별 연출 계약

| Scene | 배경·화면·카메라 | 전환 | 오디오·안전 규칙 |
|---|---|---|---|
| S01 세 장의 카드 | `home-morning`, 카드 오버헤드→투샷 | fade | `daily` 0.065, 문서·연필. 돈 문제를 위기가 아닌 공동 실험으로 시작 |
| S02 필요한 것의 주어 | `day2-home-entry`, 수건·세제통 근접→중경 | crossfade | 가방 지퍼·연필. 제품 문구와 개인 정보는 비가독 |
| S03 탐색 기준 | `day8-household-store-day`, 갈라진 선반 와이드→중경 | crossfade | 가방 지퍼·연필. 세 선택을 감정이 아닌 이동·소유 범위로 제시 |
| S04 출처가 빠진 추천 | `day8-household-store-day`, 흐린 추천 메타데이터 근접→투샷 | cut | 예비폰 키·화면 종료·연필. 공포 줌 없이 출처 부재만 확인 |
| S05 할인 앞의 멈춤 | `neighborhood-market-day`, 장바구니·가격표 와이드→중경 | crossfade | 가방 지퍼·연필. 붉은 경고 색보정·카운트다운 과장 금지 |
| S06 영수증 검토 | `neighborhood-cafe-day`, 영수증/메모 근접→투샷 | crossfade | 컵 내려놓기·연필. 대립형 역숏 없이 협업 테이블 유지 |
| S07 선물 동의 | `day2-home-entry`, 흐린 컵 사진·위시리스트 근접→중경 | crossfade | 예비폰 키·화면 종료. 전체 구매 내역이나 계정 권한을 노출하지 않음 |
| S08 오늘의 선택 저장 | `home-morning`, 세 규칙·여가 후보 오버헤드→투샷 | fade | 연필·화면 종료. 안도와 DAY 15 기대만 남김 |

S04의 작은 위화감은 `추천 카드가 화면에 보임 → 상세 필드가 비어 있음 → 화면을 닫고 현재 샘플로 이동`하는 관찰 동선으로만 표현한다. 화면 흔들림, 비네트, 글리치, 충격 컷, 붉은 색보정, 심박 효과, 하은 단독 감시 구도는 전 Scene에서 금지한다.

## 오디오 계약

- 전 Scene BGM: 기존 `daily`, variant 0, volume 0.055~0.065. S04에서도 볼륨·카테고리를 위기 음악으로 바꾸지 않는다.
- 기존 생활 SFX만 재사용한다.
  - 카드·가격·영수증·후보 기록: `SFX_DOCUMENT_RECEIVE`, `SFX_PENCIL_NOTE`
  - 외출·장바구니 동선: `SFX_BAG_ZIPPER`
  - 카페 생활감: `SFX_CUP_SET_DOWN`
  - 추천·위시리스트 화면: `SFX_SPARE_PHONE_KEY`, `SFX_PHONE_SCREEN_OFF`
- 심장박동·전화벨·충돌·충격·위기·글리치 음향 금지. 추천 카드가 미스터리 정답처럼 들리는 sting도 사용하지 않는다.

## 다음 관문

- 기존 배경 5종과 하은 DAY 8 스프라이트의 파일 존재·PNG 규격·색상 유형·투명도·선명도·크롭·UI 안전 여백을 기술·육안 검사한다.
- `IMAGE QA PASS`, `NEEDS FIX: 0`을 확인한 뒤 8 Scene의 `assetStatus`를 `ready`로 전환한다.
