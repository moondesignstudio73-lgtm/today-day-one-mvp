# 《결혼까지 30일!》 DAY 2 Scene별 애니메이션·연출 명세

상태: `PHASE 18 COMPLETE / IMPLEMENTATION READY / RUNTIME CONNECTION DEFERRED TO PHASE 20`

기준 시나리오: `docs/day2/DAY2_SCENARIO_REVISION_V1.md`  
이미지 기준: `docs/day2/DAY2_IMAGE_QUALITY_QA.md`  
적용 범위: 잠금된 12개 Scene, 정식 선택 5회, 방 탐색 5개 중 3개. Scene 구조·대사·정보 공개 순서·결말 훅은 변경하지 않는다.

## 1. 연출 목표와 금지선

- DAY 1의 병실 정적에서 `몸의 거리 확인 → 퇴원 절차 → 외부 자극 → 집의 경계 → 자기 주도 조사 원칙`으로 공간과 주도권이 확장되는 하루를 만든다.
- 하은은 밝고 생활적이며 다정하다. 결혼·집 열쇠·사진·작은 열쇠·예비폰을 공포 줌, 비대칭 그림자, 눈 확대, 붉은 플래시, 노이즈, 급격한 음향으로 수상하게 코딩하지 않는다.
- 주인공의 행동은 `관찰 → 가능성 → 확인 → 판단 → 행동`을 따른다. 기립·보행·차량·문 열기·탐색은 안전 확인과 중단 기준을 먼저 보여 준다.
- 선택은 감정 버튼이 아니라 행동 전략이다. 같은 Scene으로 합류해도 하은의 거리, 손의 위치, 대기 방식과 다음 콜백이 달라진다.
- 작은 열쇠는 평범한 `미분류 물건`이다. 용도·소유자·복선 지위를 시각적으로 확정하지 않는다.
- 원래 휴대폰은 병원 보관 중이다. Scene 11에는 오래된 임시 예비폰만 보이며 현대 스마트폰 UI나 원래 휴대폰 알림을 합성하지 않는다.
- `D-29`는 전역 시간축 확정 전까지 화면, 달력, 저장 UI, 엔드 카드 어디에도 표시하지 않는다.
- 긴 정지로 분량을 채우지 않는다. 1.5초를 넘는 정지는 CG 감상, 신체 안정, 선택 대기처럼 목적이 명확할 때만 허용한다.

## 2. 공통 런타임 계약

### 2.1 레이어와 안전 영역

뒤에서 앞으로 `BG → BG_FX → NPC_REAR → CHAR_MAIN → NPC_FRONT → POV_PROP → CG → SCREEN_FX → DIALOGUE_UI → CHOICE_UI` 순서를 사용한다. 기준은 1920×1080이며, 세로 화면은 중앙 68% 안전 크롭에서 얼굴·손·열쇠·사진·예비폰이 잘리지 않아야 한다. 선택 UI는 대화창 영역을 대체하고 핵심 손동작 위에 팝업되지 않는다.

현재 공용 표현 계층은 정적 배경·단일 캐릭터 중심이다. PHASE 20에서 다중 인물, POV 소품, CG 오버레이, 입력 잠금 큐를 DAY 2 전용 manifest와 큐 러너로 연결한다. PHASE 18에서는 런타임 코드를 수정하지 않는다.

### 2.2 공통 전환 ID

| ID | 동작 | 기본 시간 | 입력 | 감소 모션 |
|---|---|---:|---|---|
| `D2_FADE_NEUTRAL` | 검정 100%↔0%, 색조 변화 없음 | 500ms | 진행 잠금 | 120ms 교체 |
| `D2_ENTER_SOFT` | 20px 이동+opacity | 300ms | 잠금 없음 | opacity 140ms |
| `D2_EXIT_SOFT` | 12px 이동+opacity | 240ms | 잠금 없음 | opacity 120ms |
| `D2_POSE_CROSSFADE` | 동일 인물 포즈 교차 페이드 | 220ms | 진행 허용 | 100ms 교체 |
| `D2_MICRO_PUSH` | scale 1.00→1.025 | 650ms | 진행 허용 | 정적 프레임 |
| `D2_SAFE_SWAY` | 기립 시 2px 이하 시야 흔들림 후 안정 | 700ms | 첫 300ms 잠금 | 밝기 2% 변화 |
| `D2_LOCATION_DISSOLVE` | 공간 전환 중립 디졸브 | 600ms | 잠금 | 140ms 교체 |
| `D2_CG_CUTIN` | CG 160ms 진입·유지·160ms 복귀 | Scene별 | 첫 500ms 잠금 | 100ms 페이드 |
| `D2_CHOICE_HOLD` | 현재 자세 고정 후 선택 UI | 무기한 | 선택만 허용 | 동일 |
| `D2_SEARCH_FOCUS` | 오브젝트 영역 2% 확대, 배경 6% 감광 | 350ms | 탐색 입력 허용 | 정적 강조선 |

- 빠른 진행·스킵은 전환을 최종 상태로 즉시 완료한다. 반투명 인물, 중간 좌표, 열린 CG가 남지 않는다.
- 자동 진행은 선택, 신체 중단 기준, 탐색 오브젝트 선택을 넘기지 않는다.
- `prefers-reduced-motion: reduce`와 게임 내 감소 모션 설정을 모두 존중한다. 화면 흔들림과 이동 줌은 정적 교체로 대체한다.
- 저장 복원은 `sceneId`, `beatId`, `lineIndex`, 선택 UI 포커스, 탐색 횟수, 활성 배경·포즈·CG, 이미 본 일회성 큐를 복원한다. 효과·관계 수치·탐색 카운트를 중복 적용하지 않는다.

## 3. 승인 에셋 ID

### 배경

| ID | 파일 |
|---|---|
| `BG_D2_HOSPITAL_BEDSIDE` | `assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png` |
| `BG_D2_RECOVERY_CORRIDOR` | `assets/backgrounds/day2/day2-recovery-corridor-morning-v1.png` |
| `BG_D2_HOSPITAL_LOBBY` | `assets/backgrounds/day2/day2-hospital-lobby-day-v1.png` |
| `BG_D2_HOSPITAL_EXIT` | `assets/backgrounds/day2/day2-hospital-exit-day-v1.png` |
| `BG_D2_CAR_INTERIOR` | `assets/backgrounds/day2/day2-car-interior-day-v1.png` |
| `BG_D2_HOME_EXTERIOR` | `assets/backgrounds/day2/day2-home-exterior-afternoon-v1.png` |
| `BG_D2_HOME_ENTRY` | `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` |
| `BG_D2_BEDROOM` | `assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png` |

### 이벤트 CG와 POV

- `CG_D2_HOME_THRESHOLD`: `assets/events/day2/cg-day2-home-threshold-v2.png`
- `CG_D2_FAMILY_PHOTO`: `assets/events/day2/cg-day2-family-photo-v1.png`
- `CG_D2_COUPLE_PHOTO`: `assets/events/day2/cg-day2-couple-photo-v1.png`
- `CG_D2_THREE_COLUMN_RESOLVE`: `assets/events/day2/cg-day2-three-column-resolve-v2.png`
- POV는 `assets/props/day2/pov/`의 `bed-edge-prep-v3`, `rail-grip-release`, `document-receive`, `key-inspect-unlock`, `family-photo-hold-v2`, `couple-photo-turn`, `search-interactions`, `small-key-classify`, `three-column-note`, `spare-phone-contact`를 사용한다.
- 하은 신규 포즈는 `assets/characters/day2/haeun/poses/`의 승인된 9개 투명 파일만 사용하며, DAY 1 재사용 기본 포즈는 PHASE 17 승인 범위 안에서만 조합한다.

## 4. 12개 Scene 큐시트

| Scene / 감정 변화 | 입장·배경 | 핵심 인물·카메라·소품 | 입력 시점과 퇴장 |
|---|---|---|---|
| `S01 30일 뒤` / 긴장→전략 합의 | `BG_D2_HOSPITAL_BEDSIDE`, DAY 1 마지막 구도에서 300ms 연속 진입 | 하은은 DAY 1 `calendar-resolve`→중립 대기. 결혼 선택 직전 달력보다 두 사람 사이 빈 공간을 프레이밍 | `D2_CHOICE_HOLD`; 선택 적용 뒤 달력을 내리고 중경 합류, Scene 02 체크포인트 |
| `S02 내 몸의 거리` / 준비→증상→안정 | 병실에서 `BG_D2_RECOVERY_CORRIDOR`로 600ms 디졸브 | `bed-edge-prep-v3`→`support-offer-open-palm`/`forearm-support-v3`→`rail-grip-release`. `D2_SAFE_SWAY`는 2px 이하 | 중단 기준 확인 뒤 기립 입력; 접촉 콜백 적용 완료 후 진행, 복도 끝 도달 시 저장 |
| `S03 돌아가도 되는 조건` / 객관화→귀가 허용 | `BG_D2_HOSPITAL_BEDSIDE`, 의료진 `D2_ENTER_SOFT` | 의사·간호사 동시 표시, `document-receive`; 하은은 뒤에서 서류를 대신 받지 않음 | 안전 지침은 자동 스킵 제외. 인계서 수령 뒤 의료진 퇴장 |
| `S04 돌아갈 집` / 생활적 준비→집 경계 협상 | 동일 병실 정적 중경 | 하은 `pack-and-present`, 큰 집 열쇠는 탁자 위에 공개. 선택별 표정 뒤 `key-handover-step-aside` | 집 대응 선택 직전 저장; 열쇠가 주인공 쪽에 놓인 뒤 합류 |
| `S05 병원 밖` / 감각 과부하→자기 속도 | `BG_D2_HOSPITAL_LOBBY`→`BG_D2_HOSPITAL_EXIT` | 하은 `paced-walk-beside`; 자동문·도로는 8px 이하 느린 팬, 난간 `rail-grip-release` | 문턱 정지 0.8초 후 입력. 주인공의 재출발 대사 뒤 이동 가능 |
| `S06 차 안` / 생활 농담→이동 전략 | `BG_D2_CAR_INTERIOR`, 안전벨트 확인 전 정지 | 하은 `safe-driving-v3`, 시선은 도로. 차선 변경은 배경 12px 슬라이드뿐이며 카메라 흔들림 금지 | 선택 중 차량은 신호 대기 상태. 답변 종료 뒤 출발하고 Scene 07로 디졸브 |
| `S07 문턱` / 낯섦→통제권 회복 | `BG_D2_HOME_EXTERIOR`, 이어 `CG_D2_HOME_THRESHOLD` | `key-inspect-unlock`과 `key-handover-step-aside`; 세 번의 열쇠 시도는 0.25초씩, 실패음 과장 금지 | CG 3~5초, 첫 0.5초 잠금 후 단축 가능. 주인공 입장 뒤 하은이 허락받고 불을 켬 |
| `S08 남아 있는 것들` / 무감각→검증→온기 | `BG_D2_HOME_ENTRY`, 생활감 없는 정적을 중립 조명으로 표현 | 가족사진 `CG_D2_FAMILY_PHOTO` 2~4초와 `family-photo-hold-v2`; 커플사진 `CG_D2_COUPLE_PHOTO` 2~4초와 `couple-photo-turn`; 하은 `photo-side-inspection` | 가족사진은 필수, 커플사진 뒤 선택. 각 CG 첫 0.5초 이후 닫기 가능; 원래 위치 복귀 뒤 저장 |
| `S09 내 방` / 낯섦→선택 조사 | `BG_D2_BEDROOM`, 문 바깥 하은 `doorframe-permission-wait` | `D2_SEARCH_FOCUS`; 책상·PC·옷장·벽사진·서랍을 순환 포커스. 작은 열쇠는 `small-key-classify`로 평범하게 표시 | 5개 중 3개 선택, 완료/미완료 표시. 열쇠 대응 2전략은 발견 시에만 노출; 세 번째 완료 뒤 자동 종료 금지, 확인 후 진행 |
| `S10 오늘은 여기까지` / 피로→원칙 획득 | 침대 가장자리 중경 | `three-column-note`; 하은은 문틀을 넘지 않고 기다림. 숨 가쁨은 `D2_SAFE_SWAY` 대신 정적 호흡 표시 | 세 칸 작성 완료 후 진행. 관계를 `주장`에 두는 문장을 감정 줌 없이 유지 |
| `S11 연락할 방법` / 경계 확인→생활 연결 | 현관 쪽으로 느린 16px 팬 | 하은 `departing-open-wave`; `spare-phone-contact`에는 구형 예비폰·병원 번호·하은 번호만 표시 | 연락처 선택 직전 저장. 선택 반응 뒤 `haeun_contact_unlocked`; 현관문 닫기 전 체크포인트 |
| `S12 DAY 2 END` / 고립→주도적 결심 | 빈 집 중경에서 `CG_D2_THREE_COLUMN_RESOLVE` | 가족사진→커플사진→인계서를 0.5초씩 차분히 보여 주고 세 칸 메모로 합류. 작은 열쇠는 발견 경로에서만 `용도 미확인` | CG 4~6초, 첫 0.5초 뒤 단축 가능. `D2_FADE_NEUTRAL` 후 `DAY 2 END`만 표시하고 D-29 금지 |

## 5. 선택·콜백 연출 계약

### DAY 1 접촉 3×질문 3 콜백

- `contact_boundary`: Scene 02에서 하은은 열린 손바닥을 먼저 보이고 허락 뒤 팔꿈치 아래만 받친다.
- `contact_acceptance`: 먼저 잡지 않고 손잡이와 손 중 선택하게 하며, 선택한 난간 거리에서 나란히 걷는다.
- `identity_first`: 이름·방향·행동을 말한 뒤 요청이 있을 때만 오른쪽에서 받친다.
- `recovery_focus`: 중단 기준을 주인공이 먼저 회수한다. 그 외에는 하은이 질문하고 주인공이 기준을 답한다.
- `accident_interest`: Scene 03과 조건부 `ask_record_boundary`에서 기록 신청 경로만 시각화한다. 사고 장소·차량·동승 이미지는 금지한다.
- `family_question_first`: 가족사진에서 이미 들은 사망 사실과 새로 확인한 얼굴을 분리한다. 기억 플래시를 사용하지 않는다.

### DAY 2 선택별 차이

| 선택군 | 시각적 즉시 반응 | 공통 합류 |
|---|---|---|
| `marriage_pause / relationship_verify / present_impression` | 달력을 내려놓는 속도, 확인 가능한 물건을 가리키는 손, 짧은 생활적 미소로 구분 | 하은이 날짜보다 기립을 먼저 제시 |
| `thank_for_waiting / set_home_boundary / ask_if_never_woke` | 지퍼 정지, 목록을 플레이어 쪽으로 돌림, 닫힌 지퍼 뒤 0.8초 거리 유지 | 큰 열쇠를 주인공 쪽에 공개하고 문을 직접 열게 함 |
| `admit_road_fear / ask_past_self / ask_record_boundary` | 감속 유지, 생활 농담, 서류 위치를 말로만 확인 | 대화가 끝난 뒤 신호에 맞춰 출발 |
| `photo_relationship_open / photo_observation / photo_verify_later` | 하은의 온기, 두 시선의 방향 확인, 액자 원위치 확인으로 구분 | 사진을 원래 자리에 세우고 방 탐색으로 이동 |
| `key_log_only / key_test_visible_only` | 발견 위치 촬영 또는 보이는 잠금과 비접촉 대조 | 작은 열쇠를 라벨 없는 미분류 보관 위치에 둠 |
| `contact_formal / contact_familiar / contact_verify_playful` | 텍스트 입력 결과와 미세한 미소만 변화 | 팔 접촉 없이 열린 손 인사 후 퇴장 |

하은의 선택 반응은 표정 교차 페이드 220ms와 거리 12~28px 차이만 사용한다. 어느 선택도 호러 조명, 경직, 출입문 차단, 물건 은폐, 운전 중 눈맞춤으로 표현하지 않는다.

## 6. 탐색·입력·접근성·복원

- Scene 09 오브젝트 포커스 순서는 플레이어가 선택한다. 이미 조사한 대상은 완료 아이콘과 접근성 텍스트를 제공하되 다시 선택해 카운트를 늘릴 수 없다.
- 키보드 방향키/Tab으로 오브젝트와 선택지를 이동하고 Enter/Space로 확정하며, 터치 대상은 최소 44×44 CSS px다.
- 선택 직전에는 Scene·Beat·분기·탐색 횟수를 저장한다. 선택 직후에는 선택 플래그, 관계 효과, 활성 포즈, 다음 Beat를 원자적으로 저장한다.
- CG 위에서도 대화 로그, 자동·스킵 상태, 접근성 라벨을 유지한다. 스킵 뒤에는 반드시 CG가 닫히고 올바른 배경·포즈로 돌아온다.
- 저장 복원 시 Scene 08 필수 가족사진, Scene 09 세 번째 탐색, Scene 11 연락처 해금을 중복 적용하지 않는다.
- 감소 모션에서는 팬·줌·흔들림을 제거하지만 정보 순서, 최소 CG 인지 시간 0.5초, 선택 반응과 거리 상태는 유지한다.

## 7. PHASE 19 오디오 이관 큐

PHASE 18은 음원을 선정하거나 적용하지 않는다. 다음 위치만 PHASE 19에 넘긴다.

- 병실·회복 복도·로비·병원 밖·차량·집 내부의 환경 루프를 공간별로 분리한다.
- 기립 난간, 자동문, 안전벨트, 신호 대기, 큰 집 열쇠, 전등 스위치, 액자, 서랍, 메모 필기, 구형 예비폰 버튼, 현관문 큐가 필요하다.
- 작은 열쇠에는 미스터리 스팅어·심박·금속 충격음을 사용하지 않는다.
- 결혼 선택과 엔딩은 공포 전환이 아니라 판단과 결심의 온도 변화로 처리한다.

## 8. PHASE 20 구현 인수 조건

- [ ] 12개 Scene 모두 지정 배경·포즈·POV·CG·입력 잠금·퇴장 큐가 실제 플레이에 연결된다.
- [ ] DAY 1 접촉 3종과 질문 3종이 Scene 02·03·08에 올바르게 반영된다.
- [ ] 5개 정식 선택군과 작은 열쇠 대응이 즉시 반응·플래그·관계·후속 콜백·저장 복원을 갖는다.
- [ ] Scene 09는 5개 중 정확히 3개를 중복 없이 조사하며 나머지는 이후 미완료로 남는다.
- [ ] 스킵·자동·키보드·터치·감소 모션·중간 저장 복원에서 반투명/중간 상태가 남지 않는다.
- [ ] 원래 휴대폰과 예비폰, 큰 집 열쇠와 작은 열쇠가 혼동되지 않는다.
- [ ] `D-29`, 사고 진실, 잠금 프로필, 후반 반전이 조기 노출되지 않는다.
- [ ] 자유 연애 모드와 기존 저장 데이터 회귀가 통과한다.

PHASE 18 판정: **PASS — NEEDS FIX 0**. 다음 관문은 PHASE 19 BGM·SFX 명세 및 적용이다.
