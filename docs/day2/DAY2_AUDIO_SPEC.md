# 《결혼까지 30일!》 DAY 2 BGM·SFX 명세 및 적용

상태: `PHASE 19 COMPLETE / IMPLEMENTATION READY / SCENE HOOKUP DEFERRED TO PHASE 20`

기준: `DAY2_SCENARIO_REVISION_V1.md`, `DAY2_DIRECTION_SPEC.md`  
구현 데이터: `src/day2-audio-data.mjs`  
재현 스크립트: `scripts/generate-day2-audio.py`

## 1. 오디오 방향과 정보 예산

- DAY 2는 병원에서 집으로 이동하며 공간이 열리고, 마지막에는 조용한 집에서 주인공의 판단 원칙이 생기는 하루다.
- 하은의 밝음은 가방 지퍼, 안전벨트, 방향지시등, 열쇠와 구형 예비폰 같은 생활 소리 안에서 유지한다.
- 결혼 판단, 가족·커플사진, 작은 열쇠에는 공포 스팅어·심박·역재생·저주파 충격·급격한 무음을 붙이지 않는다.
- 사고 차량·사고 장소·하은의 정체·잠금 프로필을 소리로 암시하지 않는다. 작은 열쇠는 별도 전용 효과 없이 평범한 서랍 소리만 사용한다.
- 청각 정보는 필수 사실을 대신하지 않으며 모든 안전 행동과 소품 변화는 화면·텍스트와 함께 제공한다.

## 2. BGM 계약

기존 `assets/audio/bgm/daily-1.mp3`를 `daily`, variant 0으로 재사용한다. Scene마다 재시작하지 않고 0.05~0.085 범위에서 대사와 공간에 맞춰 조절한다.

| Beat | 음량 | 의도 |
|---|---:|---|
| `S01_CHOICE` | 0.075 | 결혼 선택을 위협이 아닌 재판단으로 제시 |
| `S02_STAND` | 0.065 | 몸 상태와 중단 기준 우선 |
| `S05_EXIT` | 0.085 | 병원 밖으로 나오는 생활적 개방감 |
| `S06_ROAD_FEAR` | 0.060 | 도로 공포를 음악으로 과장하지 않음 |
| `S07_THRESHOLD` | 0.070 | 집의 낯섦과 주도권을 함께 유지 |
| `S08_FAMILY_PHOTO` | 0.050 | 사진 반응에 여백 제공 |
| `S08_PHOTO_RELEASE` | 0.075 | 하은과의 건조한 농담으로 온도 회복 |
| `S09_SMALL_KEY` | 0.060 | 작은 열쇠를 반전처럼 강조하지 않음 |
| `S10_THREE_COLUMNS` | 0.070 | 조사 원칙 획득 |
| `S12_RESOLVE` | 0.055 | 혼자 남은 집과 차분한 결심 |
| `S12_END` | 0 | DAY 2 END에서 정지, D-29 표시 없음 |

`crisis`, `ending`, 공포 장르 음원은 사용하지 않는다.

## 3. 공간 앰비언스와 SFX

고정 시드로 만든 22,050Hz mono PCM 16-bit WAV 17종을 `assets/audio/day2/`에 비파괴 추가한다.

| 구분 | ID | 적용 Beat |
|---|---|---|
| 루프 | `AMB_HOSPITAL_CORRIDOR_DAY` | `S02_CORRIDOR`~`S05_LOBBY` |
| 루프 | `AMB_HOSPITAL_LOBBY_DAY` | `S05_LOBBY`~`S06_ENTER` |
| 루프 | `AMB_CAR_INTERIOR_DAY` | `S06_ENTER`~`S07_ARRIVE` |
| 루프 | `AMB_HOME_QUIET_AFTERNOON` | `S07_LIGHT`~`S12_END` |
| 안전 행동 | `SFX_RAIL_GRIP_RELEASE`, `SFX_SEATBELT_CLICK`, `SFX_TURN_SIGNAL` | 기립·차량 안전 행동 |
| 병원/짐 | `SFX_DOCUMENT_RECEIVE`, `SFX_BAG_ZIPPER`, `SFX_AUTO_DOOR` | 서류·퇴원·병원 밖 전환 |
| 집 | `SFX_HOME_KEY_UNLOCK`, `SFX_LIGHT_SWITCH`, `SFX_PHOTO_FRAME`, `SFX_DRAWER_OPEN` | 문턱·사진·탐색 |
| 결말/연락 | `SFX_PENCIL_NOTE`, `SFX_SPARE_PHONE_KEY`, `SFX_FRONT_DOOR_CLOSE` | 세 칸 메모·임시 연락처·혼자 남은 집 |

큰 집 열쇠만 `SFX_HOME_KEY_UNLOCK`을 사용한다. 작은 열쇠 발견은 `SFX_DRAWER_OPEN` 이후 추가 표식 없이 진행한다. 원래 휴대폰 알림음은 재생하지 않고, Scene 11은 구형 예비폰 버튼음만 사용한다.

## 4. 믹싱·접근성·저장 복원

- BGM 최대 0.085, 앰비언스 최대 0.08, 단발 SFX 최대 0.17로 대사 가독성을 우선한다.
- 루프 교체는 이전 공간 루프를 먼저 정지한 뒤 다음 루프를 한 번만 시작한다. 두 공간 앰비언스를 겹치지 않는다.
- 자동 재생이 차단돼도 Scene 진행은 멈추지 않는다. 전체 음향 끄기는 BGM과 모든 루프를 즉시 정지한다.
- 스킵은 지나간 단발음을 몰아서 재생하지 않는다. 저장 복원은 이미 완료한 단발 큐를 반복하지 않고 현재 공간 루프만 한 번 재개한다.
- 감소 모션 설정은 오디오 시간축을 늘리지 않는다. 청각 과민 사용자를 위해 효과음은 기존 전체 음향 설정으로 즉시 끌 수 있다.

## 5. 적용 범위와 인수 조건

- `src/day2-audio-data.mjs`: Beat별 BGM·SFX·루프·볼륨 계약을 제공한다.
- `src/sound-manager.mjs`: 기존 DAY 1 계약을 보존하며 DAY 2 cue 조회를 지원한다.
- `assets/audio/day2/*.wav`: 재현 가능한 앰비언스 4종과 단발음 13종이다.
- `tests/day2-audio.test.mjs`: 데이터, WAV 헤더, 볼륨, 금지 BGM, 루프 중복·교체·음소거를 검증한다.
- PHASE 20에서 잠금된 Scene/Beat 큐 러너에 이 공개 계약을 연결한다. PHASE 19에서는 시나리오와 실제 Scene 흐름을 수정하지 않는다.

PHASE 19 판정: **PASS — NEEDS FIX 0 / PHASE 20 실제 게임 구현으로 이관 가능**
