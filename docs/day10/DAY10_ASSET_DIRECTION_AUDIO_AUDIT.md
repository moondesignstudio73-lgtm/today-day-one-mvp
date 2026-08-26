# DAY 10 기존 에셋·연출·오디오 감사

판정: `CONTRACT PASS / REQUIRED NEW ART 0`

## 감사 기준

- DAY 10은 DAY 6~10 생활 확장 구간의 마지막 날이다. 세 시간 업무 복귀를 위기·미스터리·추적 장면처럼 연출하지 않는다.
- DAY 9와 같은 회사이므로 열린 사무실과 프로젝트룸을 그대로 이어 쓴다. 점심은 오전~늦은 오후 시간대에 맞는 낮 카페만 사용한다.
- 하은은 집에서만 밝고 생활적인 표정으로 표시한다. 회사에서는 현재 발화자인 민호·윤서진·팀장을 교대하며 단체 스프라이트를 겹쳐 놓지 않는다.
- 서진 `AFFECTION`과 `STATUS_INTEREST`는 카메라 우열이나 선정적 확대가 아니라 대사 내용으로만 구분한다.

## 육안·기술 감사

| 자산 | 규격·상태 | 판정 |
|---|---|---|
| `home-morning` | 1672×941 RGB PNG, 밝은 오전 집, 우측 캐릭터 안전 여백 | S01·S08 재사용 PASS |
| `office-day` | 1599×900 WebP, 열린 데스크·유리 회의실·휴게 구역, 밝은 낮 | S02·S07 재사용 PASS |
| `day9-office-project-room-day` | 1672×941 RGB PNG, 소규모 회의실·시계·노트·물컵 | S03·S04·S06 재사용 PASS |
| `neighborhood-cafe-day` | 1672×941 RGB PNG, 맑은 낮의 소형 카페·식탁·컵 | S05 점심 재사용 PASS |
| 하은 DAY 8 생활복 | 887×1774 RGBA PNG, 네 모서리 alpha 0 | 출근 준비·귀가 생활 톤 PASS |
| 민호 `office-best-male` | 1024×1536 RGBA PNG, 네 모서리 alpha 0 | 회사 입장·점심·귀가 전 기록 PASS |
| 윤서진 `female-coworker` | 1024×1536 RGBA PNG, 네 모서리 alpha 0 | 현재 기여·점심·마지막 블록 PASS |
| 팀장 `team-lead` | 1024×1536 RGBA PNG, 네 모서리 alpha 0 | 리듬 계약·종료 확인 PASS |

배경에는 인물·워터마크·읽어야 하는 텍스트가 없으며 대화 UI와 인물 배치를 위한 여백이 있다. 인물 PNG의 검은색은 투명 영역의 RGB 값일 뿐 alpha가 0이라 실제 합성에서는 검은 판이 나타나지 않는다. 기존 사용자 원본이나 미추적 자산은 수정하지 않는다.

## Scene별 매핑

| Scene | 배경·인물 | 카메라·전환 | BGM·SFX |
|---|---|---|---|
| S01 세 줄의 일정표 | `home-morning`, 하은 DAY 8 생활복 `smile` | 일정표 medium-prop, fade | `daily` 0.065, 메모·예비폰 |
| S02 자동 확대 없는 출입 | `office-day`, 민호 | 출입구 wide→medium, crossfade | `daily` 0.06, 자동문 |
| S03 오늘의 리듬 계약 | `day9-office-project-room-day`, 팀장 | 시계·계획표 close→medium, cut | `daily` 0.055, 문서·메모 |
| S04 어제의 선택을 오늘의 절차로 | `day9-office-project-room-day`, 서진 | 자료 close→medium, cut | `daily` 0.055, 문서·메모 |
| S05 현재 동료와의 점심 | `neighborhood-cafe-day`, 민호↔서진 교대 | 식탁 two-shot, crossfade | `daily` 0.06, 컵 내려놓기 |
| S06 마지막 블록 | `day9-office-project-room-day`, 서진↔팀장 교대 | 질문표 close→medium, crossfade | `daily` 0.055, 메모·문서 전달 |
| S07 귀가 전 세 칸 | `office-day`, 민호 | 예비폰·세 칸 기록 medium-prop, crossfade | `daily` 0.06, 휴대폰 화면 끄기 |
| S08 세 시간을 하루로 | `home-morning`, 하은 DAY 8 생활복 `smile` | 현관→식탁 medium, fade | `daily` 0.065, 현관 열쇠·컵 |

## 화자 교대 계약

- S05는 민호 중심으로 시작하되 윤서진의 대사 직전에 `female-coworker`로 교대하고, 선택 후 반응 화자에 맞춰 다시 교대한다.
- S06은 윤서진에서 팀장으로 교대해 `세 시간 종료`의 권한 주체가 화면과 일치해야 한다.
- S01·S08 하은은 `STORY_OUTFIT_ASSETS.day8`을 사용한다. 회사 인물에게 하은 의상 URL을 전달하지 않는다.
- SKIP과 stage 복원에서도 선택 직전 마지막 화자·배경이 같아야 한다. S05 및 stage 2의 배경은 반드시 `neighborhood-cafe-day`다.

## 금지 연출

- `crisis`, `theme`, 심장박동, 이명, 색수차, 공포 무음, 급격한 암전, 비·야간 카페 금지.
- 서진을 수상하게 보이는 역광·눈 클로즈업·정지 표정과 하은의 불안한 현관 대기는 금지한다.
- 완료감을 과장하는 승진 팡파르나 성공 징글을 사용하지 않는다. 세 시간 종료는 생활 리듬의 확인이다.
- 같은 Scene에 여러 전신 스프라이트를 겹쳐 UI와 인물을 가리지 않는다. 발화자 중심 교대를 쓴다.

## 오디오 계약

- 전 Scene은 기존 `daily` BGM variant 0, volume 0.055~0.065를 유지한다.
- 기존 DAY 1·2의 `SFX_PENCIL_NOTE`, `SFX_SPARE_PHONE_KEY`, `SFX_AUTO_DOOR`, `SFX_DOCUMENT_RECEIVE`, `SFX_CUP_SET_DOWN`, `SFX_PHONE_SCREEN_OFF`, `SFX_HOME_KEY_UNLOCK`만 비파괴 재사용한다.
- S03·S04·S06의 문서·메모음은 소품 행동 한 번에 한 번만 재생한다. 반복 타이머음으로 업무 압박을 만들지 않는다.
- S05 컵 소리는 대화 범위 합의 전 한 번, S08 현관 열쇠와 컵은 귀가·생활 복귀를 구분하는 순서로 사용한다.

## 신규 자산 판정

기존 4개 배경과 4개 인물 자산이 장소·시간대·역할·품질 기준을 모두 충족한다. 신규 최종 아트, 후처리, 이미지 생성은 필요하지 않다. 다음 관문은 이 프레젠테이션 계약을 선반영 DAY 10 런타임의 실제 화자 교대·SFX·중간 저장 복원에 연결하는 구현 감사다.
