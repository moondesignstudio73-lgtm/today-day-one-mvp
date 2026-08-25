# 《결혼까지 30일!》 DAY 1 Scene별 애니메이션·연출 명세

상태: `PHASE 18 — IMPLEMENTATION READY`

기준 시나리오: `docs/day1/DAY1_SCENARIO_REVISION_V1.md`  
이미지 기준: `docs/day1/DAY1_IMAGE_QUALITY_QA.md`  
적용 범위: DAY 1의 잠금된 6개 Scene과 2개 선택 시점. 대사, Scene 순서, 정보 공개 순서와 결말 훅은 변경하지 않는다.

## 1. 연출 목표와 금지선

- 플레이어가 1년 만에 의식을 되찾은 몸의 한계와 낯선 관계를 차분히 확인하는 흐름을 만든다.
- 하은은 먼저 밝고 다정하며 생활적인 사람으로 보인다. 불안은 관계를 잃을 수 있다는 두려움으로만 표현하고, 공포물의 가해자처럼 코딩하지 않는다.
- 주인공의 시선은 `관찰 → 가능성 → 확인 → 판단 → 행동` 순서를 따른다. 모순을 보았는데도 넘기는 연출을 넣지 않는다.
- 접촉과 거리는 첫 선택의 행동 전략을 시각적으로 기억한다. 같은 대사에 도달해도 하은의 접근 속도와 손의 위치가 달라진다.
- 트럭 충돌, 하은의 사고 동승, 주인공의 보호 행동, 하은의 잠금 프로필과 후반 반전은 이미지·카메라·효과로도 암시하거나 확정하지 않는다.
- 붉은 플래시, CCTV 노이즈, 뒤틀린 미소, 눈만 확대하는 공포 줌, 비정상적인 그림자, 과도한 심장 박동 가속을 사용하지 않는다.
- 긴 정지로 분량을 채우지 않는다. 1.5초를 넘는 정지는 호흡 회복, 의료 확인, CG 감상처럼 의미가 명확한 경우에만 허용한다.

## 2. 런타임 연출 계약

### 2.1 좌표와 안전 영역

- 기준 화면은 16:9, 1920×1080 논리 좌표다. 실제 렌더링은 비율을 유지하고 중앙을 기준으로 확대·축소한다.
- 모바일 세로 화면은 배경을 중앙 68% 영역에서 안전 크롭하며 인물의 눈·손·의료 도구가 잘리지 않아야 한다.
- 대화창 상단을 `y=760`으로 가정한다. 중요한 손동작과 컵은 `y=700` 위에 둔다.
- 하은 기본 위치: 화면 오른쪽 58~86%. 의료진은 왼쪽 8~38%, 보조 인물은 중앙 38~58%를 사용한다.
- 선택 UI가 열린 동안 캐릭터 얼굴, 손, 침대 난간을 가리지 않는다. 선택지는 화면 하단 대화창을 대체하고 배경 위에 별도 중앙 팝업으로 띄우지 않는다.

### 2.2 논리 레이어

뒤에서 앞으로 다음 순서를 고정한다.

1. `BG`: 병실 배경
2. `BG_FX`: 초점 흐림, 밝기, 중립 색조
3. `NPC_REAR`: 간호사 또는 보조 인물
4. `CHAR_MAIN`: 하은
5. `NPC_FRONT`: 담당 의사 또는 전경 의료 도구
6. `PROP`: 휴대폰, 종이컵, 물병, 티슈 상자, 달력 포인터
7. `CG`: 이벤트 CG/디테일 컷인
8. `SCREEN_FX`: 암전, 흰색이 아닌 중립 페이드
9. `DIALOGUE_UI`: 화자·대사·계속 표시
10. `CHOICE_UI`: 선택지와 포커스

현재 공용 렌더러는 단일 캐릭터와 배경 중심이므로 PHASE 20에서 최소한 `NPC_REAR`, `NPC_FRONT`, `PROP`, `CG`, `SCREEN_FX`를 독립 레이어로 추가해야 한다. 레이어가 없다는 이유로 의료진을 하은 스프라이트와 교체 표시하거나 CG를 배경으로 영구 덮어쓰지 않는다.

### 2.3 공통 전환 ID

| ID | 기본 동작 | 시간 | 입력 규칙 | 감소 모션 |
|---|---|---:|---|---|
| `DIR_FADE_NEUTRAL` | 검정 100%↔0%, 감마 변화 없음 | 500ms | 전환 중 진행 입력 잠금 | 즉시 120ms 교체 |
| `DIR_EYE_FOCUS` | 배경 blur 12px→0px, 밝기 72%→100% | 1400ms | 첫 실행만 잠금, 재생 시 스킵 가능 | blur 없이 300ms 페이드 |
| `DIR_ENTER_SOFT` | 20px 이동+opacity 0→1 | 320ms | 잠금 없음 | opacity 160ms |
| `DIR_EXIT_SOFT` | 12px 이동+opacity 1→0 | 260ms | 잠금 없음 | opacity 140ms |
| `DIR_POSE_CROSSFADE` | 동일 인물 자산 교차 페이드 | 220ms | 연속 탭 시 최종 상태 우선 | 100ms 교체 |
| `DIR_MICRO_PUSH` | 카메라 scale 1.00→1.025 | 700ms | 대사 진행 허용 | 정적 프레이밍 |
| `DIR_BREATH_RECOVER` | 시야 1~2px 수직 흔들림 후 안정 | 800ms | 첫 350ms 잠금 | 정적 밝기 변화 |
| `DIR_CG_CUTIN` | CG opacity 0→1, 100% 유지, 1→0 | Scene별 | 첫 500ms만 잠금 | 160ms 페이드 |
| `DIR_CHOICE_HOLD` | 현재 화면 정지, 선택 UI 진입 | 무기한 | 선택만 허용 | 동일 |

- 스킵은 대사 단위로 동작하며 전환을 완료 상태로 보낸다. 중간 좌표나 반투명 레이어를 남기지 않는다.
- 빠른 진행은 `DIR_EYE_FOCUS`와 CG의 최소 감상 시간을 각각 300ms, 500ms로 줄일 수 있다.
- 선택 UI와 의료 안전 확인 대사는 자동 진행으로 건너뛰지 않는다.
- 브라우저 `prefers-reduced-motion: reduce` 또는 게임 내 감소 모션 설정을 함께 존중한다.

### 2.4 상태와 선택 기억

PHASE 20은 다음 논리 상태를 저장·복원해야 한다.

- `day1.sceneId`, `day1.beatId`, `day1.lineIndex`
- `day1.contactStrategy`: `boundary | acceptance | identity_first`
- `day1.questionStrategy`: `family | accident | recovery`
- `day1.haeunDistance`: `close | rail | chair | foot_of_bed`
- `day1.activePoseId`, `day1.activeExpressionId`, `day1.activeCgId`
- `day1.completedDirectionCues`: 이미 재생한 일회성 CG와 초점 회복 큐

저장 복원 시 일회성 효과를 처음부터 중복 재생하지 않는다. 선택 직전 저장은 선택 UI와 포커스를 복원하고, 선택 직후 저장은 이미 적용된 거리·표정·관계 효과를 재적용하지 않는다.

## 3. 승인 에셋 매핑

### 3.1 배경과 CG

| 논리 ID | 파일 |
|---|---|
| `BG_DAY1_CEILING_POV` | `assets/backgrounds/hospital/day1-hospital-pov-ceiling-v1.png` |
| `BG_DAY1_BEDSIDE_DAY` | `assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png` |
| `BG_DAY1_WINDOW_CROP` | `BG_DAY1_BEDSIDE_DAY`의 승인된 안전 크롭. 별도 원본으로 오인하지 않는다. |
| `CG_DAY1_FIRST_EYE_CONTACT` | `assets/events/day1/cg-day1-first-eye-contact-v2.png` |
| `CG_DAY1_CUP_SUPPORT_CUTIN` | `assets/events/day1/cg-day1-cup-support-v1.png` |
| `CG_DAY1_THIRTY_DAY_RESOLVE` | `assets/events/day1/cg-day1-thirty-day-resolve-v2.png` |

### 3.2 하은 표정·포즈

표정 파일은 `assets/characters/day1/haeun/expressions/haeun-expression-{id}-2d.png`, 포즈 파일은 `assets/characters/day1/haeun/poses/haeun-pose-{id}-2d.png` 규칙을 사용한다.

- 표정 ID: `resting-tired`, `startled-relief`, `teary-relief`, `apologetic-worried`, `calm-attentive`, `warm-playful`, `soft-vulnerable`, `gentle-resolve`
- 포즈 ID: `seated-dozing`, `rise-and-pause`, `careful-embrace`, `step-back-open`, `seated-no-contact`, `standing-bedside-restraint`, `cup-assist-open-palm`, `light-banter`, `calendar-resolve`

표정과 포즈 자산은 서로 다른 완성형 스프라이트다. 얼굴만 별도 합성하지 않고, 명세의 표정+포즈 조합에 가장 가까운 승인 파일 하나를 주 자산으로 표시한다. 표정 변화가 필요한 경우 220ms 교차 페이드로 해당 표정 스프라이트를 짧게 보여준 뒤 지정 포즈로 복귀한다.

### 3.3 의료진

- 담당 의사: `doctor-bedside-assessment-2d.png`, `doctor-record-and-explain-2d.png`, `doctor-explain-open-hands-2d.png`
- 간호사: `nurse-vitals-check-2d.png`, `nurse-safety-guidance-2d.png`, `nurse-swallow-assessment-2d.png`
- 모든 파일 경로 기준: `assets/npcs/day1/`

## 4. Scene별 큐시트

## SCENE 01 — 눈을 뜨다

목표 시간: 90~125초. 감정 곡선은 `감각 혼란 → 관찰 → 눈맞춤 → 하은의 안도 → 접촉 전략 선택 → 안전한 거리에서 합류`다.

| Beat | 화면·카메라 | 인물·소품 | 입력·분기 |
|---|---|---|---|
| `S01-B01_BLACK` | 완전 암전. 화면 효과는 호흡 리듬에 맞춰 밝아지지 않는다. | 인물 없음. PHASE 19의 카트/병실 소리만 준비한다. | 첫 텍스트 후 진행 가능. |
| `S01-B02_FOCUS` | `BG_DAY1_CEILING_POV`, `DIR_EYE_FOCUS`. 초점은 천장→침대 옆 실루엣 순으로 회복한다. | `resting-tired`/`seated-dozing`, 화면 오른쪽. 휴대폰은 손 근처의 비가독 소품. | 첫 실행 1.4초 후 진행. |
| `S01-B03_EYE_CONTACT` | 하은이 고개를 들 때 `DIR_MICRO_PUSH`, 이어 `CG_DAY1_FIRST_EYE_CONTACT` 2.5~3.5초. | `startled-relief`/`rise-and-pause`. 휴대폰이 손에서 낮게 떨어지되 과장된 회전 금지. | CG 첫 0.5초 잠금, 이후 탭으로 닫기. |
| `S01-B04_APPROACH` | 병상 옆 중경. 카메라는 흔들리지 않는다. | `teary-relief`→`careful-embrace`. 난간을 넘는 순간은 보여주지 않고 상체 접근만 사용한다. | 호흡 불편 신호 전 선택을 띄우지 않는다. |
| `S01-B05_CHOICE_1` | `DIR_CHOICE_HOLD`, 배경 8% 어둡게. 공포 색조 금지. | 포즈를 `rise-and-pause`로 고정해 선택 전 접촉 상태를 중립화한다. | `boundary`, `acceptance`, `identity_first`; 키보드·터치 포커스 제공. |
| `S01-B06_BRANCH` | 아래 분기표 적용. | 즉시 반응 후 모두 병상 바깥 난간 위치로 합류한다. | 선택 적용 완료 전 다음 대사 입력 잠금. |
| `S01-B07_MERGE` | 침대 옆 중경. 호출 버튼이 있는 쪽으로 시선 유도. | `calm-attentive`/`standing-bedside-restraint`, 거리 `rail`. | Scene 02 전환 시 상태 저장 체크포인트. |

### 첫 접촉 선택 연출

| 전략 | 즉시 동작 | 표정/포즈 | 거리 콜백 |
|---|---|---|---|
| `boundary` | 하은이 즉시 손을 풀고 28px 물러난다. | `apologetic-worried`→`step-back-open` | 이후 먼저 손을 뻗지 않고 허락을 묻는다. |
| `acceptance` | 0.8~1.2초 포옹 유지 후 주인공 호흡 신호에 맞춰 놓는다. | `teary-relief`→`warm-playful` | 이후 컵 보조 제안 때 가장 가까운 난간 위치까지 접근 가능. |
| `identity_first` | 몸이 멈춘 뒤 즉시 놓고 호출 버튼 방향으로 반걸음 이동한다. | `soft-vulnerable`→`step-back-open` | 이후 실무적 확인을 먼저 제시하고 접촉은 가장 늦게 한다. |

## SCENE 02 — “여자친구야”

목표 시간: 65~90초. 감정 곡선은 `거리 재설정 → 관계 주장 → 합리적 검증 → 작은 생활 행동 → 의료진 도착`이다.

| Beat | 화면·카메라 | 인물·소품 | 입력·분기 |
|---|---|---|---|
| `S02-B01_RESET` | `BG_DAY1_BEDSIDE_DAY`, 정적 중경. | 하은이 의자를 20px 뒤로 옮기고 `seated-no-contact`. 선택별 속도만 240/320/400ms로 다르게 한다. | 접촉 선택 상태 복원. |
| `S02-B02_CLAIM` | 하은과 병상 사이 빈 공간을 보존한 투샷. | `calm-attentive`, 손은 무릎 위. “여자친구” 주장에 영웅샷·로맨틱 줌 금지. | 대사 진행 가능. |
| `S02-B03_VERIFY` | 주인공 질문 때 하은이 아니라 호출 버튼/병실 문 쪽으로 2% 프레이밍 이동. | 하은은 기다리며 `soft-vulnerable`. | 질문과 답변의 순서를 자동 진행으로 합치지 않는다. |
| `S02-B04_CUP` | 종이컵이 있던 낮은 영역을 0.4초 강조하고 원래 프레이밍으로 복귀. | 하은이 사용한 컵을 안전하게 치우는 생활 동작. 얼굴을 가리지 않는다. | 접촉 없음. |
| `S02-B05_FOOTSTEP` | 문 쪽으로 18px 팬. | 하은이 일어나 `standing-bedside-restraint`. | PHASE 19 발소리 큐 종료 후 Scene 03. |

## SCENE 03 — 1년

목표 시간: 100~135초. 감정 곡선은 `의료 절차 → 객관적 확인 → 1년의 충격 → 질문 전략 선택 → 회복 계획`이다.

| Beat | 화면·카메라 | 인물·소품 | 입력·분기 |
|---|---|---|---|
| `S03-B01_ENTER` | 문 쪽에서 `DIR_ENTER_SOFT`, 병상 투샷으로 정착. | 의사 `doctor-bedside-assessment`, 간호사 `nurse-vitals-check`; 하은은 발치 `standing-bedside-restraint`. | 입장 완료 후 대사. |
| `S03-B02_EXAM` | 펜라이트 시점에서 화면 전체 백색 플래시 대신 중앙 밝기 +6%를 160ms 사용. | 손 확인→활력징후→차트 순서. 의료진이 서로 겹치지 않는다. | 각 검사 결과 대사를 스킵해도 최종 자세 복원. |
| `S03-B03_ONE_YEAR` | `doctor-record-and-explain` 중경, 말 뒤 0.8~1.2초 정지. 줌·비네트·공포 효과 없음. | 하은은 발치에서 움직이지 않고 `soft-vulnerable`. | 정지 뒤 진행 표시 노출. |
| `S03-B04_CHOICE_2` | `DIR_CHOICE_HOLD`. 의사는 차트를 낮추고 중립 시선. | 간호사 정적, 하은은 반응을 선점하지 않는다. | `family`, `accident`, `recovery`. |
| `S03-B05_BRANCH` | 아래 분기표 적용. | 질문에 맞는 의사 포즈와 하은의 미세 반응. | 플래그 적용 완료 후 합류. |
| `S03-B06_PLAN_EXIT` | 회복 계획은 `doctor-explain-open-hands`, 이후 의료진 `DIR_EXIT_SOFT`. | 간호사 `nurse-safety-guidance`; 하은은 문이 닫힐 때까지 발치 유지. | Scene 04 체크포인트. |

### 첫 질문 선택 연출

| 전략 | 의사 | 하은 | 정보 제한 |
|---|---|---|---|
| `family` | 차트를 양손으로 낮추고 0.6초 숙고 | 손가락을 모으지만 접근하지 않음 | 잠금 시나리오의 가족 사실만 전달 |
| `accident` | `doctor-record-and-explain`, 중립적 설명 | 시선은 의사에게, 기억을 대신 말하지 않음 | 충돌 차종·동승·보호 행동 이미지 금지 |
| `recovery` | `doctor-explain-open-hands`, 단계적 계획 | 작게 숨을 내쉬고 `calm-attentive` | 완치 보장 표현 금지 |

## SCENE 04 — 남겨진 사람

목표 시간: 65~95초. 감정 곡선은 `의료진 퇴장 → 정적 여백 → 상실 확인 → 하은의 절제된 돌봄 → 다시 움직일 준비`다.

| Beat | 화면·카메라 | 인물·소품 | 입력·분기 |
|---|---|---|---|
| `S04-B01_DOOR_CLOSE` | 문 닫힘 후 0.7초 정적. `BG_DAY1_BEDSIDE_DAY`. | 하은 `standing-bedside-restraint`, 발치. | 자동 진행 정지는 최대 0.7초. |
| `S04-B02_CONDITION` | `family` 선택이면 창가 안전 크롭을 1.0초 사용 후 복귀. 그 외에는 투샷 유지. | `soft-vulnerable`. | 선택2의 사실 콜백만 허용. |
| `S04-B03_TISSUE` | 손과 티슈 상자가 함께 보이는 낮은 중경. | 하은이 티슈 상자를 난간 바깥에 놓되 손에 쥐여주지 않는다. | 선택1과 무관하게 접촉 없음. |
| `S04-B04_ATTEND` | 카메라 이동 없이 하은이 주인공의 반응을 기다린다. | `calm-attentive`/`seated-no-contact`. 눈물 강조 클로즈업 금지. | 1.2초를 넘는 침묵 금지. |
| `S04-B05_HOOK` | 문 쪽에 작은 움직임 여백을 만든다. | 하은이 컵/물병 상태를 확인하고 손을 거둔다. | 간호사 재입장 준비. |

## SCENE 05 — 물 한 모금

목표 시간: 75~105초. 감정 곡선은 `안전 확인 → 허락 협상 → 제한된 접촉 → 안도 → 생활적인 장난`이다.

| Beat | 화면·카메라 | 인물·소품 | 입력·분기 |
|---|---|---|---|
| `S05-B01_NURSE` | `DIR_ENTER_SOFT`, 병상 왼쪽 중경. | `nurse-swallow-assessment`, 하은은 의자 옆. | 삼킴 평가 완료 전 컵 동작 금지. |
| `S05-B02_GUIDE_EXIT` | 간호사 설명 후 문 쪽으로 퇴장. | `nurse-safety-guidance`; 하은 `calm-attentive`. | 안전 지침 대사는 자동 스킵 제외. |
| `S05-B03_PERMISSION` | 컵과 하은의 열린 손바닥이 함께 보이는 프레이밍. | `cup-assist-open-palm`; 컵은 절반 이하. 선택1별 허락 문구와 접근 속도 적용. | 플레이어 허락 전 손이 컵 아래로 들어가지 않는다. |
| `S05-B04_SUPPORT` | “컵 아래만” 합의 뒤 `CG_DAY1_CUP_SUPPORT_CUTIN` 1.5~2.5초. | CG 내 손 위치는 컵 아래 지지로 제한. | 첫 0.5초 잠금, 이후 스킵 가능. |
| `S05-B05_RELEASE` | 병실 중경 복귀, `DIR_BREATH_RECOVER`. | 하은은 컵을 내려놓고 즉시 손을 뗀다. | 호흡 안정 후 대사 진행. |
| `S05-B06_PLAYFUL` | 미세한 2% 풀백으로 공간을 편안하게 만든다. | `warm-playful`/`light-banter`, 짧은 웃음. | 선택1 콜백은 말투·거리만 변경. |

선택1별 컵 보조 거리:

- `boundary`: 의자 옆에서 열린 손을 보여 준 뒤 명시적 허락 후 한 걸음 접근한다.
- `acceptance`: 난간 가까이에서 제안하되 컵에 먼저 닿지 않는다.
- `identity_first`: 간호사 지침을 다시 확인하고 역할을 설명한 뒤 접근한다.

## SCENE 06 — 결혼까지 30일

목표 시간: 85~120초. 감정 곡선은 `일상적 농담 → 관계의 취약함 → 달력 확인 → 30일 공개 → 주인공의 재판단 → 하은의 절제된 결심 → DAY 1 훅`이다.

| Beat | 화면·카메라 | 인물·소품 | 입력·분기 |
|---|---|---|---|
| `S06-B01_BANTER` | 컵이 내려간 병상 중경. | `warm-playful`/`light-banter`; 손가락으로 수를 세는 동작은 화면 상단에서 작게. | 대사 진행 가능. |
| `S06-B02_SHIFT` | 카메라는 고정하고 배경 밝기만 3% 낮춘다. | `soft-vulnerable`; 웃음이 사라진 뒤 달력을 본다. | 감정 전환 교차 페이드 220ms. |
| `S06-B03_CALENDAR` | 달력 방향으로 14px 팬. 글자는 날짜 격자와 30일 표식만 식별 가능. | `calendar-resolve`; 달력을 가져오거나 플레이어 얼굴 앞으로 들이밀지 않는다. | 프로필·직업 메모 등 추가 텍스트 금지. |
| `S06-B04_REVEAL` | 결혼 예정 사실 공개 후 0.8~1.2초 정적. 붉은 플래시·심박 가속·충격 줌 금지. | 하은은 `soft-vulnerable`, 주인공 반응을 기다린다. | 다음 대사 표시를 정지 뒤 노출. |
| `S06-B05_REFRAME` | 달력과 병상 다리가 한 프레임에 들어오는 2% 풀백. | 하은은 말 끊지 않고 의자를 24px 뒤로 이동한다. | 주인공의 현재 판단 대사 순서 보존. |
| `S06-B06_RESOLVE` | “나부터” 뒤 `CG_DAY1_THIRTY_DAY_RESOLVE` 4~6초. | `gentle-resolve`/`calendar-resolve`; 휴대폰 화면을 끄고 테이블에 엎어 두지 않고 평평하게 둔다. | 첫 0.5초 잠금, 이후 탭/스킵 가능. |
| `S06-B07_END` | 병상 다리→달력 순으로 시선 이동 후 `DIR_FADE_NEUTRAL` 700ms. | 인물은 움직이지 않는다. | `DAY 1 END` 표시 후 저장 체크포인트. |

결말은 공포 반전이 아니라 “기억이 없는 상태에서 이 관계와 30일을 어떻게 확인할 것인가”라는 플레이 목표를 남긴다. 선택2의 후속 상태는 저장만 하고 DAY 2 콘텐츠를 새로 작성하지 않는다.

## 5. PHASE 19 오디오 이관 큐

PHASE 18에서는 음원을 선정하거나 런타임에 연결하지 않는다. 다음 ID와 발생 위치만 PHASE 19 계약으로 넘긴다.

- `AMB_HOSPITAL_ROOM_DAY`: SCENE 01 초점 회복 이후 SCENE 06 종료 전까지 저강도 루프
- `SFX_CART_DISTANT`: `S01-B01_BLACK`
- `SFX_PHONE_SOFT_DROP`: `S01-B03_EYE_CONTACT`, 충격음처럼 크지 않음
- `SFX_FOOTSTEP_APPROACH`: `S02-B05_FOOTSTEP`
- `SFX_DOOR_OPEN`, `SFX_DOOR_CLOSE`: SCENE 03 입장/SCENE 04 시작
- `SFX_MEDICAL_LIGHT`: `S03-B02_EXAM`, 전자 경고음 금지
- `SFX_CUP_SET_DOWN`: `S05-B05_RELEASE`
- `SFX_PHONE_SCREEN_OFF`: `S06-B06_RESOLVE`
- BGM은 30일 공개 전후에도 공포 장르로 전환하지 않고 감정의 온도만 낮춘다.

## 6. PHASE 20 구현 요구사항

현재 코드 감사 결과 `src/scene-presentation.mjs`와 `src/ui/character-renderer.mjs`는 DAY 1 전용 다중 인물, CG, 큐 타임라인을 제공하지 않는다. PHASE 20은 다음을 구현해야 한다.

1. DAY 1 전용 presentation manifest: 위 ID를 파일 경로와 연결한다.
2. 큐 러너: `sceneId + beatId` 단위로 전환, 입력 잠금, 스킵 완료 상태를 보장한다.
3. 다중 레이어 렌더러: 하은과 의사·간호사를 동시에 표시한다.
4. CG 오버레이: 대화 UI를 유지하거나 명세대로 숨긴 뒤 복원하며 포커스를 잃지 않는다.
5. 선택 메모리: 두 선택의 즉시 연출과 이후 거리 콜백을 저장·복원한다.
6. 접근성: 감소 모션, 키보드 선택, 스크린리더 선택 라벨, 자동 진행 예외를 제공한다.
7. 기존 자유 연애 모드 격리: DAY 1 전용 매니페스트와 큐 러너는 캠페인 모드에서만 활성화한다.
8. 오류 대체: 에셋 로드 실패 시 배경은 병실 기본, 인물은 직전 정상 스프라이트, CG는 텍스트 진행으로 안전하게 폴백한다.

## 7. PHASE 18 합격 기준

- [x] 잠금된 6개 Scene 모두에 목적 시간, 감정 곡선과 세부 Beat가 있다.
- [x] 첫 접촉 3분기와 첫 질문 3분기의 즉시 반응·합류·후속 시각 콜백이 구분된다.
- [x] 배경 2종, 하은 표정 8종·포즈 9종, 의료진 6종, CG 3종의 승인 파일이 명시된다.
- [x] CG 3개의 삽입 위치, 최소 표시, 스킵과 입력 잠금 규칙이 있다.
- [x] 모바일 안전 영역, 빠른 진행, 감소 모션, 저장 복원과 에셋 실패 폴백이 있다.
- [x] 하은의 초기 악역 코딩, 주인공 지능 저하, 미확정 사고 세부와 후반 반전 조기 노출을 금지한다.
- [x] 기존 렌더러의 한계와 PHASE 20 최소 구현 범위를 분리했다.
- [x] PHASE 19에는 오디오 발생 위치만 넘기고 음원 선정·적용을 선행하지 않았다.

PHASE 18 판정: `PASS — PHASE 19 BGM·SFX 명세 및 적용으로 이관 가능`
