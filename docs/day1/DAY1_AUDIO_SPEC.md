# 《결혼까지 30일!》 DAY 1 BGM·SFX 명세 및 적용

상태: `PHASE 19 — IMPLEMENTATION READY`

기준: `DAY1_SCENARIO_REVISION_V1.md`, `DAY1_DIRECTION_SPEC.md`  
구현 데이터: `src/day1-audio-data.mjs`  
재현 스크립트: `scripts/generate-day1-audio.py`

## 1. 오디오 방향

- DAY 1은 공포가 아니라 회복실의 현실감, 하은의 생활적인 온기, 기억이 없는 주인공의 신중함을 들려준다.
- 30일 공개는 위협음으로 표시하지 않는다. 같은 테마의 음량을 낮춰 대사와 판단에 공간을 준다.
- 하은의 접근·눈물·휴대폰에 불길한 음향 표식을 붙이지 않는다.
- 의료 기기 경고음, 과장된 심박, 붉은 플래시와 결합되는 충격음, 점프 스케어, 역재생 속삭임은 금지한다.
- 음향은 정보를 대신 말하지 않는다. 미확정 사고 세부, 하은의 잠금 프로필과 후반 반전을 암시하는 모티프를 사용하지 않는다.

## 2. BGM 계약

기존 승인 에셋 `assets/audio/bgm/theme-1.mp3` 한 곡을 DAY 1 전체의 연속 테마로 재사용한다. Scene 전환마다 곡을 교체하지 않고 음량만 조절해 감정 연결을 유지한다.

| Beat | 동작 | 음량 | 의도 |
|---|---|---:|---|
| `S01_B01_BLACK` | 무음 | 0 | 첫 감각은 병실 환경음만 제공 |
| `S01_B02_FOCUS` | `theme`, variant 0 시작 | 0.100 | 낯섦보다 회복과 사람의 온도 |
| `S03_B03_ONE_YEAR` | 동일 곡 조절 | 0.065 | 충격을 음악이 규정하지 않음 |
| `S04_B01_DOOR_CLOSE` | 동일 곡 조절 | 0.055 | 상실 대사에 여백 확보 |
| `S05_B03_PERMISSION` | 동일 곡 조절 | 0.085 | 안전한 접촉과 생활감 회복 |
| `S06_B02_SHIFT` | 동일 곡 조절 | 0.065 | 농담에서 취약함으로 이동 |
| `S06_B04_REVEAL` | 동일 곡 조절 | 0.045 | 결혼 공개를 공포 반전으로 만들지 않음 |
| `S06_B06_RESOLVE` | 동일 곡 조절 | 0.085 | 하은의 절제된 결심과 다음 목표 |
| `S06_B07_END` | 정지 | 0 | `DAY 1 END` 뒤 잔향을 강제하지 않음 |

공용 `SoundManager.playBgm`은 동일 곡 재호출 시 재시작하지 않고 볼륨만 갱신하도록 확장했다. PHASE 20 큐 러너는 `DAY1_BGM_CUES`를 Beat 진입 시 호출한다.

## 3. 병실 앰비언스와 SFX

모든 신규 WAV는 22,050Hz, mono, PCM 16-bit이며 고정 시드로 재생성된다. 원본 BGM이나 사용자 에셋을 수정하지 않는다.

| ID | 파일 | 기본 음량 | 위치·용도 |
|---|---|---:|---|
| `AMB_HOSPITAL_ROOM_DAY` | `amb-hospital-room-day.wav` | 0.09 | `S01_B02_FOCUS`~`S06_B07_END`, HVAC와 먼 카트의 저강도 루프 |
| `SFX_CART_DISTANT` | `cart-distant.wav` | 0.18 | `S01_B01_BLACK`, 공간 방향만 제시 |
| `SFX_PHONE_SOFT_DROP` | `phone-soft-drop.wav` | 0.24 | `S01_B03_EYE_CONTACT`, 놀람을 과장하지 않는 낮은 충격 |
| `SFX_FOOTSTEP_APPROACH` | `footsteps-approach.wav` | 0.20 | `S02_B05_FOOTSTEP`, 의료진 진입 예고 |
| `SFX_DOOR_OPEN` | `door-open.wav` | 0.20 | `S03_B01_ENTER` |
| `SFX_MEDICAL_LIGHT` | `medical-light.wav` | 0.16 | `S03_B02_EXAM`, 펜라이트 스위치 |
| `SFX_DOOR_CLOSE` | `door-close.wav` | 0.18 | `S04_B01_DOOR_CLOSE` |
| `SFX_CUP_SET_DOWN` | `cup-set-down.wav` | 0.17 | `S05_B05_RELEASE` |
| `SFX_PHONE_SCREEN_OFF` | `phone-screen-off.wav` | 0.12 | `S06_B06_RESOLVE` |

## 4. 믹싱·접근성 규칙

- BGM 최대 0.10, 앰비언스 0.09, 단발 SFX 최대 0.24다. 대사 가독성이 항상 우선한다.
- 브라우저 자동 재생 제한으로 재생이 거부되면 장면 진행을 막지 않는다.
- 전체 음향 끄기는 BGM과 루프 큐를 모두 즉시 정지한다. 음향 설정은 기존 키 `today-day-one.sound.v1`을 유지한다.
- 대사 스킵 시 지나간 단발 SFX를 몰아서 재생하지 않는다. 현재 Beat에 진입할 때만 재생한다.
- 저장 복원 시 앰비언스는 필요하면 한 번만 재개하고 단발 SFX는 `completedDirectionCues`에 기록된 경우 반복하지 않는다.
- 청각 정보만으로 필수 사실을 전달하지 않는다. 발소리·문소리는 화면 행동과 함께 제공한다.

## 5. 런타임 적용 범위

- `src/day1-audio-data.mjs`: Beat→BGM/SFX, 파일, 음량, 루프 계약.
- `src/sound-manager.mjs`: DAY 1 큐 재생·정지, 전체 음소거 시 루프 정리, 동일 BGM 볼륨 갱신.
- `assets/audio/day1/*.wav`: 앰비언스 1종과 단발 SFX 8종.
- `tests/day1-audio.test.mjs`: 데이터, 파일 헤더, 최대 음량, 루프 중복 방지, 정지, BGM 볼륨 갱신 검증.
- PHASE 20은 장면 데이터와 큐 러너에서 이 공개 계약을 호출한다. PHASE 19에서는 잠금된 대사나 Scene 구조를 수정하지 않는다.

## 6. 합격 기준

- [x] PHASE 18에서 넘긴 오디오 ID 9종이 실제 파일과 데이터에 연결됐다.
- [x] 30일 공개 전후에 `crisis` BGM이나 공포 SFX를 사용하지 않는다.
- [x] 모든 WAV가 재현 가능하고 기존 BGM·사용자 에셋을 덮어쓰지 않는다.
- [x] 전체 음향 끄기, 루프 중복 방지, 저장 복원 이관 규칙과 자동 재생 실패 폴백이 있다.
- [x] 기존 모드는 기본 BGM 볼륨 0.22와 기존 UI 효과음을 그대로 유지한다.

PHASE 19 판정: `PASS — PHASE 20 실제 게임 구현으로 이관 가능`
