# DAY 4 에셋·이미지 품질 감사 및 장면별 자산 명세

상태: `ASSET AUDIT PASS / IMAGE ACQUISITION 12/12 COMPLETE`

검수 시각: `2026-08-28 03:02 KST`

## 감사 범위와 기준점

- 시나리오 잠금본: `DAY4_SCENARIO_REBUILD_V3.md`
- 내러티브 QA: `DAY4_SCENARIO_REBUILD_V3_QA.md`
- 화면 기준: DAY 2 실제 런타임의 현관 열쇠 POV, 사진 POV, 차량 행동 CG와 `DAY2_IMAGE_QUALITY_QA.md`, `DAY2_LIVE_VISUAL_QA_2026-08-26.md`
- 품질 명세: 선명한 와이드 16:9, 배경·인물·손·소품의 동일 원근/광원, 하은 정체성 유지, 핵심 행동의 화면 내 제시, 데스크톱·모바일 안전 영역
- 정보 예산: 지훈의 증언은 과거의 한 출처일 뿐이며 사고 고의성·후반 반전·하은 잠금 프로필을 이미지로 암시하지 않는다.

DAY 2 기준 원본은 `1672×941`(1.777:1)이고, 핵심 얼굴·손·열쇠·사진이 한 화면의 조명과 원근 안에 있다. 모바일 중앙 9:16 접촉면에서도 행동 주체와 핵심 소품이 남는다. DAY 4는 이 연출 문법을 계승하되 DAY 2 장면 내용을 복제하지 않는다.

## 현재 런타임 시각 상태

현재 `src/day4-campaign-runtime.mjs`는 6개 장면 묶음과 5단계 선택을 대상으로 다음 자산만 연결한다.

- 배경: `day2-home-entry`, `day2-bedroom`, `home-morning`, `cafe-rain-evening`, `home-night`
- 하은: `assets/characters/story-outfits/haeun-day4-weekend-casual-2d-v1.png`
- 지훈: `assets/npcs/best-friend.png`
- 이벤트 CG/POV: `0`

따라서 V3의 SCENE 01~16, 9개 선택과 휴대폰·사진·멈춘 포옹·음료·결제 행동은 아직 시각적으로 구현되지 않았다. 이 감사의 PASS는 현 화면 완성도가 아니라 기존 에셋을 전수 분류하고 다음 제작 대상을 잠갔다는 뜻이다.

## 기존 자산 전수 판정

| 자산 | 규격/상태 | 판정 | 사용 범위 또는 결함 |
| --- | --- | --- | --- |
| `assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png` | 1672×941 RGB | `REUSE PASS` | SCENE 03의 사진·PC·서랍 탐색 배경. DAY 2와 같은 방 구조를 보존한다. 아침 SCENE 01에는 광원 시간이 맞지 않는다. |
| `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` | 1672×941 RGB | `REUSE PASS` | 하은 통지 뒤 외출 준비 또는 귀가 연결. 집 구조 연속성을 보존한다. |
| `assets/backgrounds/morning-studio-2d.png` | 1672×941 RGB | `REJECT FOR DAY 4` | 선명도는 충분하지만 DAY 2에서 확정된 주인공 방·거실과 구조가 달라 같은 집으로 보이지 않는다. |
| `assets/backgrounds/cafe/BG_CAFE_RAIN_EVENING_001.webp` | 1599×900 RGB | `REJECT FOR DAY 4` | V3은 낮의 역 앞 카페인데 비 오는 야간 도심이다. 장소·시간·감정 온도를 바꾼다. |
| `assets/backgrounds/home/BG_HOME_NIGHT_001.webp` | 1599×900 RGB | `REJECT FOR DAY 4` | DAY 2의 싱글룸과 다른 더블베드·도시 전망 구조라 저장 복원 시 공간 연속성이 깨진다. |
| `assets/backgrounds/map-locations/004_small-cafe.png` | 1672×941 RGB | `REFERENCE ONLY` | 실제 `small-cafe` 위치의 따뜻한 소형 카페 방향은 적합하지만 사진풍 질감이 DAY 2 애니메이션 CG와 바로 합성되면 이질감이 남는다. |
| `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | 1672×941 RGB | `STYLE REFERENCE ONLY` | 낮 조명·테이블·두 잔·UI 여백은 우수하다. DAY 6 고유 장소이므로 DAY 4 역 앞 카페로 직접 재사용하지 않는다. |
| `assets/characters/story-outfits/haeun-day4-weekend-casual-2d-v1.png` | 887×1774 RGBA, alpha 0~255 | `REUSE PASS` | 보라색 단발·보라색 눈·베이지 외투·흰 상의·진청 바지·흰 운동화가 DAY 2 정체성과 일치한다. 원본 크기도 확대 안전하다. |
| `assets/npcs/best-friend.png` | 1024×1536 RGBA, alpha 0~254 | `REFERENCE ONLY` | 지훈의 얼굴·헤어·남색 셔츠·가방 방향은 유지 가능하다. 그러나 검은 후광과 반실사 선화가 하은·DAY 2 CG와 분리되어 보이고, 표정·동작이 하나뿐이다. |
| `assets/npcs/male-friend.png`, `college-friend.png` | 각 1024×1536 RGBA, alpha 0~254 | `REJECT` | 지훈의 기존 시각 정체성과 다른 인물이며 소품·직업 인상이 V3 장면과 맞지 않는다. |
| `assets/action-results/generated/handsome-meet-friends-01.png` | 1672×941 RGB | `REJECT` | 네 명의 술자리·야간 장면이라 지훈과의 낮 카페 첫 재회 및 1:1 관계를 왜곡한다. |
| `assets/action-results/generated/short-message-01.png` | 1200×675 RGB | `REFERENCE ONLY` | 휴대폰 행동 구도는 참고 가능하지만 하은의 빨간 카디건·야간 거실이 DAY 4 의상/시간과 다르다. |
| DAY 2 사진·열쇠 CG 3종 | 각 1672×941 RGB | `QUALITY BENCHMARK` | 손과 핵심 소품의 원근·광원·중앙 안전 폭 기준으로만 사용하며 내용은 재사용하지 않는다. |

기존 자산을 삭제·이동·덮어쓰지 않는다. `REFERENCE ONLY`와 `REJECT` 파일은 런타임 후보에서 제외하되 다른 모드와 DAY의 사용을 보존한다.

## 장면별 최종 자산 맵

| V3 장면 | 핵심 행동 | 최종 시각 자산 | 상태 |
| --- | --- | --- | --- |
| SCENE 01~02 | 침대에서 아침 문자를 보고 관계 단계별 답장 | `day4-bedroom-morning-v1` + `cg-day4-morning-message-pov-v1` | `NEW REQUIRED` |
| SCENE 03 | PC 잠금 화면, 교통카드·영수증, 벽의 단체사진 발견 | DAY 2 방 배경 재사용 + `cg-day4-group-photo-back-pov-v1` + 코드형 사물 핫스폿 | `MIXED` |
| SCENE 04~05 | 지훈과 통화/문자, 질문 범위 합의, 위치 수신 | 휴대폰 UI 오버레이 + 방 배경 | `UI BUILD` |
| SCENE 06 | 하은에게 통지·허락·비공유 전략 | 휴대폰 UI, 하은 원형 아바타는 승인 스프라이트에서 비파괴 파생 | `REUSE/DERIVE` |
| SCENE 07 | 실제 `small-cafe` 제한 목적지로 이동 | 지도 UI의 제한 목적지 핀 + `day4-station-cafe-afternoon-v1` | `NEW REQUIRED` |
| SCENE 08 | 지훈이 포옹하려다 접촉 전에 멈춤 | `cg-day4-jihoon-stopped-hug-v1` | `NEW REQUIRED` |
| SCENE 09 | 메뉴판 회전, 현재/과거/새 취향 주문 | 역 앞 카페 배경 + 컵/메뉴 소품 오버레이 | `NEW/DERIVE` |
| SCENE 10~12 | 지훈 휴대폰의 과거 사진을 함께 보고 직접 지식과 전언을 나눔 | `cg-day4-table-phone-photo-pov-v1` + 지훈 표정 포즈 | `NEW REQUIRED` |
| SCENE 13 | 오래된 농담으로 현재의 우정 온도 회복 | 역 앞 카페 배경 + 지훈 `warm` 포즈 | `NEW REQUIRED` |
| SCENE 14 | 계산 주체와 결제 방식 선택 | `cg-day4-payment-card-receipt-pov-v1` | `NEW REQUIRED` |
| SCENE 15 | 만남 감상, 다음 연락 규칙 합의 | 카페 출구/테이블 배경 + 지훈 `quiet` 포즈 | `NEW REQUIRED` |
| SCENE 16 | 친구 시스템 해금과 감정 잔상, DAY 5 민호 알림 | `day4-home-night-consistent-v1` + 코드형 친구/알림 UI | `NEW REQUIRED` |

## 신규 제작 잠금 명세

### 배경 3종

1. `assets/backgrounds/day4/day4-bedroom-morning-v1.png`
   - DAY 2 방의 문·싱글베드·PC·옷장·서랍·창문 위치를 그대로 유지한 아침 광원 변형.
   - 읽을 수 있는 메시지·날짜·브랜드를 래스터에 넣지 않는다.
2. `assets/backgrounds/day4/day4-station-cafe-afternoon-v1.png`
   - `004_small-cafe`의 아늑한 규모와 `day6-neighborhood-cafe-day-v1`의 애니메이션 질감·두 잔 테이블 안전 여백을 결합한다.
   - 역 간판·브랜드·비·야경은 넣지 않는다. 출입구와 맞은편 좌석이 보여 SCENE 08의 접근 동선을 지원한다.
3. `assets/backgrounds/day4/day4-home-night-consistent-v1.png`
   - DAY 2 확정 집 구조의 야간 변형. 더블베드·새 전망·새 가구로 다른 집처럼 만들지 않는다.

### 사건 CG 5종

모두 1672×941 RGB 또는 RGBA 원본, 16:9, 텍스트 없는 이미지로 제작한다. 메시지·날짜·선택 문구는 HTML UI가 담당한다.

1. `cg-day4-morning-message-pov-v1.png`: 이불 가장자리와 한 손의 휴대폰, 화면은 비어 있는 안전 UI 영역. 침실과 같은 아침 광원.
2. `cg-day4-group-photo-back-pov-v1.png`: 손에 든 오래된 단체사진 뒷면/모서리와 지훈 식별 단서. 주인공 얼굴을 새 정답처럼 확정하지 않는다.
3. `cg-day4-jihoon-stopped-hug-v1.png`: 카페 입구 1인칭 또는 어깨 너머 구도. 지훈의 두 팔이 접촉 전에 멈추고 당황과 배려가 함께 읽힌다.
4. `cg-day4-table-phone-photo-pov-v1.png`: 같은 테이블의 지훈 손·휴대폰·사진, 두 잔. 화면의 사진은 과거 친분만 보여 주며 사고 정보를 넣지 않는다.
5. `cg-day4-payment-card-receipt-pov-v1.png`: 카드/분할 결제/영수증 선택을 한 손과 카운터 행동으로 보여 준다. 금액·브랜드는 UI가 담당한다.

### 지훈 포즈 4종

기존 `best-friend.png`의 얼굴·헝클어진 갈색 머리·남색 오버셔츠·밝은 티·가방을 시각 기준으로 유지하되 DAY 2 하은 스프라이트와 맞는 애니메이션 선화/채도/광원으로 통일한다.

- `jihoon-day4-cautious-greeting-v1.png`
- `jihoon-day4-hug-stop-v1.png`
- `jihoon-day4-warm-tease-v1.png`
- `jihoon-day4-serious-testimony-v1.png`

각 파일은 최소 높이 1536px RGBA, 실제 alpha `(0,255)`, 검은 후광·불투명 사각형·알파 프린지 없음, 손가락·팔 방향 정상, 대화창 위 얼굴 안전 영역을 통과해야 한다.

## DAY 2 대비 화면 안전 계약

- 마스터: `1672×941` 또는 그 이상의 정확한 16:9. 종횡비 스트레치 금지.
- 데스크톱: 얼굴·손·핵심 소품을 가급적 `x 12~88%`, `y 8~68%`에 둔다. 하단 `y 70%` 아래는 대화창이 가릴 수 있다.
- 모바일 중앙 9:16: 핵심 정보는 원본의 중앙 `x 34~66%`에서도 하나의 행동으로 읽혀야 한다. 주변 배경이 잘려도 인물 얼굴과 소품의 관계가 남아야 한다.
- 상단 HUD: 얼굴·텍스트 합성 위치를 `y 8%` 아래로 둔다. 이미지 안에 게임 HUD·대사·읽을 수 있는 메시지를 굽지 않는다.
- 하은: 보라색 턱선 단발, 보라색 눈, 23세 인상, DAY 4 베이지 외투 정체성을 고정한다.
- 지훈: 포옹은 접촉 전 정지로 표현하며 과도한 눈물·공포 조명·불길한 줌을 금지한다.
- 사진·휴대폰·음료·카드/영수증은 대사로만 언급하지 않고 손동작과 같은 원근 안에서 보인다.

## 최종 판정

| 필수 항목 | 판정 |
| --- | --- |
| 기존 에셋 전수 감사 | `PASS` |
| DAY 2 대비 구도·비율·선명도 기준 고정 | `PASS` |
| 캐릭터 정체성·미스터리 정보 예산 | `PASS` |
| 장면 행동성 및 UI 안전 영역 명세 | `PASS` |
| 현 DAY 4 런타임 이미지 완성도 | `PASS — V3 확정 자산 12/12 연결` |
| 신규 자산 원본 육안 QA | `PASS — 12/12` |
| 데스크톱·모바일 실제 화면 QA | `PASS — 1440×900 / 390×844` |

## 제작 진행 갱신 — 2026-08-28 03:04 KST

- 첫 P0 자산 `assets/backgrounds/day4/day4-bedroom-morning-v1.png`을 DAY 2 확정 방의 조명 전용 편집으로 비파괴 제작했다.
- `1672×941` RGB PNG, 1.776833:1, 구조 엣지 상관계수 `0.8846`이며 문·창문·싱글베드·책상/PC·옷장·서랍·선반의 공간 배치가 유지된다.
- 맑은 08:00 아침광, 선명도, 텍스트/브랜드 부재, 데스크톱 및 모바일 중앙 안전 영역을 원본 해상도로 `PASS` 판정했다.
- 상세 증적은 `DAY4_IMAGE_ASSET_ACQUISITION_QA.md`에 기록했다. 남은 신규 자산 11종이 모두 통과하기 전에는 이미지 관문을 완료 처리하지 않는다.

### 2차 제작 갱신

- `assets/backgrounds/day4/day4-station-cafe-afternoon-v1.png`을 소형 카페 규모와 DAY 2형 선명한 애니메이션 화면 기준으로 비파괴 신규 제작했다.
- `1672×941` RGB PNG이며 열린 출입문·접근 동선·맞은편 의자가 중앙 모바일 크롭에 함께 남아 SCENE 08의 접촉 전 정지 행동을 지원한다.
- DAY 6 카페와 다른 공간 정체성, 맑은 오후광, 두 잔·무문자 메뉴 카드, 텍스트/브랜드/미스터리 단서 부재를 원본 해상도로 `PASS` 판정했다.
- 신규 자산 진행은 `2/12`; 남은 10종이 모두 통과하기 전에는 이미지 관문을 완료 처리하지 않는다.

### 3차 제작 갱신

- DAY 2 현관·거실 원본의 조명만 밤으로 편집한 `assets/backgrounds/day4/day4-home-night-consistent-v1.png`을 비파괴 신규 제작했다.
- `1672×941` RGB PNG, 구조 엣지 상관계수 `0.9254`이며 현관·식탁·소파·주방 경계·복도·침실의 위치와 카메라가 유지된다.
- 창밖만 푸른 밤으로 바꾸고 실내등은 따뜻한 생활광으로 유지해 공포·감시 코딩을 차단했다. 텍스트/알림/후반 단서 부재와 데스크톱·모바일 안전 영역을 `PASS` 판정했다.
- 신규 배경 3종은 모두 원본 QA를 통과했다. 전체 진행은 `3/12`; 다음은 첫 행동 CG다.

### 4차 제작 갱신

- `assets/events/day4/cg-day4-morning-message-pov-v1.png`을 아침 침실과 같은 광원·공간 정체성의 1인칭 행동 CG로 비파괴 신규 제작했다.
- 한 손·다섯 손가락·현대형 휴대전화 전체가 중앙 안전 영역에 남고, 화면은 관계별 메시지 UI를 위한 무문자 암회색 면이다.
- 1672×941 RGB PNG, 손/소품 원근·선명도·모바일 중앙 크롭·텍스트/브랜드/단서 부재를 `PASS` 판정했다.
- 전체 진행은 `4/12`; 다음은 단체사진 뒷면 POV다.

### 5차 제작 갱신

- `assets/events/day4/cg-day4-group-photo-back-pov-v1.png`을 같은 아침 침실에서 오래된 사진을 두 손으로 뒤집는 1인칭 행동 CG로 비파괴 신규 제작했다.
- 1672×941 RGB PNG이며 사진 뒷면은 무문자, 좁은 앞면 노출부에는 지훈의 갈색 머리·남색 겉옷·흰 티 식별색만 남겼다.
- 양손 해부·사진 접촉 원근·선명도·데스크톱/모바일 안전 영역을 `PASS` 판정했고, 주인공 얼굴·완전한 단체 구성·사고/결혼/날짜 정보는 노출하지 않았다.
- 전체 진행은 `5/12`; 다음은 지훈의 멈춘 포옹 CG다.

### 6차 제작 갱신

- `assets/events/day4/cg-day4-jihoon-stopped-hug-v1.png`을 같은 역 앞 카페의 열린 출입문과 오후광 안에서 비파괴 신규 제작했다.
- 지훈의 헝클어진 갈색 머리·남색 오버셔츠·밝은 티·가방끈을 유지하고, 양팔과 열린 손이 주인공에게 닿기 전에 스스로 멈춘 순간을 중앙에 배치했다.
- 1672×941 RGB PNG, 얼굴/양손 해부·접촉 전 빈 공간·선명도·데스크톱/모바일 안전 영역을 `PASS` 판정했다. 공포·위협·과도한 눈물·사고/결혼/후반 단서는 없다.
- 전체 진행은 `6/12`; 다음은 테이블 휴대폰 사진 POV다.

### 7차 제작 갱신

- `assets/events/day4/cg-day4-table-phone-photo-pov-v1.png`을 같은 카페 테이블에서 지훈이 휴대폰을 양손으로 건네는 1인칭 행동 CG로 비파괴 신규 제작했다.
- 휴대폰 화면은 볼링장에 함께 있던 지훈과 뒷모습 남성만 보여 주어 평범한 과거 친분을 확인하되 주인공 얼굴·하은·사고·날짜를 고정하지 않는다.
- 1672×941 RGB PNG, 양손/전경 손·기기 원근·두 잔·선명도·데스크톱/모바일 안전 영역을 `PASS` 판정했다.
- 전체 진행은 `7/12`; 다음은 카드·영수증 결제 POV다.

### 8차 제작 갱신

- `assets/events/day4/cg-day4-payment-card-receipt-pov-v1.png`을 같은 카페 계산대의 중립적 결제 직전 행동 CG로 비파괴 신규 제작했다.
- 주인공과 지훈의 카드 두 장을 무문자 영수증·꺼진 단말기 앞에 함께 멈춰 세 결제 전략을 어느 하나로 선확정하지 않았다.
- 첫 후보 2종은 모바일 중앙 크롭 결함으로 기각했고, 최종 1672×941 RGB PNG는 두 손·두 카드·영수증·단말기·텍스트/브랜드 부재와 데스크톱/모바일 안전 영역을 `PASS` 판정했다.
- 전체 진행은 `12/12 COMPLETE`; 지훈의 네 투명 포즈 모두 실제 강색 합성에서 후광 없는 RGBA로 PASS했다. 다음 관문은 V3 시나리오와 확정 자산의 런타임 연결이다.

다음 관문은 위 잠금 명세의 P0 배경 3종·CG 5종·지훈 포즈 4종을 비파괴 신규 파일로 제작/수급하고, 원본 해상도 육안 QA를 수행하는 것이다. 최종 후보가 DAY 2 기준보다 낮으면 런타임 연결로 넘어가지 않는다.

## 실제 런타임 화면 QA 갱신 — 2026-08-28

- 데스크톱 실제 브라우저에서 16:9 무대, 하단 대화창, DAY 4 하은 전신 스프라이트의 종횡비·가림·`object-fit: contain`을 확인했다.
- 390×844 실제 Edge 최초 실행에서 상단 DAY 배지와 스토리 도구가 한 행에 강제돼 문서 폭이 `864px`까지 넘는 결함을 재현했다.
- 모바일 캠페인 헤더를 DAY 배지/도구 2행으로 재배치하고 무대 높이를 `100dvh - 92px`로 맞췄다. 재검증 결과 `clientWidth=390`, `scrollWidth=390`, `scrollHeight=844`로 수평·수직 오버플로가 모두 제거됐다.
- 선택지 `366×199`는 좌우 12px 안에, 대화창 `370×152`는 좌우·하단 10px 안에 유지됐다. 하은 스프라이트는 `object-fit: contain`과 중앙 행동축을 보존했고 선택 프롬프트와 겹치지 않았다.
- DAY 2 기준 대비 구도·비율·선명도·캐릭터 일관성·행동성·UI 안전 영역을 모두 PASS 판정한다.
