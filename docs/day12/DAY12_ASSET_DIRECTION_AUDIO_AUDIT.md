# DAY 12 기존 에셋·연출·오디오 감사

상태: `ASSET / DIRECTION / AUDIO AUDIT PASS`

기준 시나리오: `docs/day12/DAY12_SCENARIO_DRAFT_V1.md`

## 결론

- 기존 배경 3종과 하은 스프라이트 1종으로 8개 Scene을 구성할 수 있다.
- 신규 최종 아트 필요: 1종. DAY 8 외출복의 연속 반복을 줄이기 위해 DAY 12 전용 생활복을 추가했다.
- 기존 파일 덮어쓰기·삭제·이동: 없음.
- 이번 관문 상태: `assetStatus: audited`. 원본 기술·화질 검사를 통과한 뒤 다음 관문에서 `ready`로 전환한다.

## 기존 배경 감사

| ID | 파일 | Scene | 육안 판정 |
|---|---|---|---|
| `home-morning` | `assets/backgrounds/morning-studio-2d.png` | S01·S03·S06·S08 | 밝은 아침 집, 식탁·휴대폰·장부 소품 서술과 우측 인물/UI 여백 PASS |
| `day2-home-entry` | `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` | S02·S04·S07 | 현관·거실의 오후 생활 동선, 공식 문서·휴대폰 확인 장면 PASS |
| `neighborhood-cafe-day` | `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | S05 | 밝은 낮 카페, 빈 테이블과 두 잔, 영수증 분류 대화 PASS |

세 배경은 무인 공간이며 읽어야 할 금융 정보·로고·고정 인물·스포일러 요소가 없다. 계정 화면과 명세는 별도 CG로 만들지 않고 휴대폰/문서 소품 근접을 사용한다. 실제 잔액·계정번호·거래처는 개인정보 비가독 상태로 유지한다.

## 하은 자산 감사

- 파일: `assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png`.
- 오트밀 니트 카디건·뮤트 라벤더 블라우스·차콜 롱스커트와 부드러운 미소가 집→카페→집의 차분한 금융 확인 동선에 적합하다.
- S02·S04의 공식 확인 장면은 `calm`, 일상 농담·합의·마무리는 `smile`을 사용한다.
- 돈이나 권한 확인을 의심·위협으로 보이게 하는 경직·회피·악역 표정은 사용하지 않는다.

## Scene별 연출 계약

| Scene | 카메라·화면 | 전환 | 안전 규칙 |
|---|---|---|---|
| S01 숫자를 움직이지 않는 날 | 식탁의 확인/결정 카드→중경 | fade | 따뜻한 아침, DAY 11 콜백을 생활 행동으로 시작 |
| S02 기억보다 공식 번호 | 명세·휴대폰 근접→중경 | crossfade | 공식 출처만 보이고 비밀번호·계정번호는 읽히지 않음 |
| S03 어디서 시작할까 | 확인 카드 오버헤드→중경 | cut | 선택 전에 확인과 결정의 분리를 시각화 |
| S04 읽을 수 있음과 쓸 수 있음 | 흐린 요약 화면→중경 | crossfade | 잔액 숫자 대신 열람/잠금 상태만 전달 |
| S05 같이 쓴 것과 같이 낼 것 | 카페 영수증 근접→투샷 | crossfade | 대립 구도 없이 같은 테이블에서 분류 |
| S06 잔액 옆의 빈칸 | 장부 열 근접→중경 | crossfade | 빈칸을 실패나 손실처럼 과장하지 않음 |
| S07 함께 볼 수 있는 만큼 | 흐린 권한 화면→중경 | crossfade | 개인 소비 내역·계정 정보 노출 금지 |
| S08 현재 계정의 주인 | 읽기 전용 장부→투샷 | fade | 기본 금융만 열린 안도, DAY 13 훅을 조용히 남김 |

전 Scene에서 공포 줌·비네트·글리치 금지. 숫자 공개에 충격 컷, 화면 흔들림, 붉은 색보정도 사용하지 않는다.

## 오디오 계약

- 전 Scene BGM: 기존 `daily`, variant 0, volume 0.055~0.065.
- 공식 확인과 잔액 공개에서도 위기·미스터리·관계 위기 BGM으로 전환하지 않는다.
- 기존 생활 SFX만 재사용한다.
  - 종이·장부: `SFX_DOCUMENT_RECEIVE`, `SFX_PENCIL_NOTE`
  - 휴대폰 확인: `SFX_SPARE_PHONE_KEY`, `SFX_PHONE_SCREEN_OFF`
  - 카페 생활감: `SFX_CUP_SET_DOWN`
- 심장박동·전화벨·충돌·충격·글리치 음향 금지.

## 다음 관문

- 기존 배경 3종과 하은 스프라이트의 PNG 규격·투명도·선명도·크롭 여백을 기술·육안 재검사하고 `IMAGE QA PASS` 뒤 8개 Scene을 `ready`로 전환한다.
