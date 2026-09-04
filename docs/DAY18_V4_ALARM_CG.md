# DAY18 아침 알람 끄기 정지 CG

2026-09-05 01:31 실행, game215. DAY18 PARTIAL.

원문 SCENE01 알람 끄기 행동을 기존 침실 기준의 POV 정지 CG로 옮겼다. 기존 “알람을 끄고 나서도 잠깐 누워 있었다” 행동 문장은 일반 독백에서 제거하고 몸 상태에 관한 내적 생각은 보존했다. 흐름은 침실 → 알람 CG 2.8초 → 내적 생각 → 거실 → 물 CG다. 모든 약속 분기의 최초 아침에만 나오며 아침 선택 이후 반응에는 재삽입하지 않는다. 입력/출력/저장 schema 및 과거 연락 사실은 변경하지 않는다.

이는 알람을 끄는 손동작의 **정지 화면 표현**이다. 클릭 가능한 알람 버튼/소리의 시작과 정지/발끝 움직임은 아직 미구현이며 완료로 집계하지 않는다. 다른 알림 소리를 알람으로 재활용하지 않았다.

## 자산

imagegen 스킬의 built-in 생성 사용. 기존 침실은 스타일/침구/협탁 참조이며 편집 대상이 아니다. 생성 결과에서 08:00/끄기, 손/침구/협탁을 확인했다.

- 참조: `assets/backgrounds/day4/day4-bedroom-morning-v1.png`
- 생성 원본: `C:/Users/aaa/.codex/generated_images/01a06810-af54-7db0-a3f6-3764034ac137/exec-77688551-d45d-4dd0-94e8-002fd6f7f959.png`
- 저장: `assets/events/day18-v4/morning-alarm-off-v1.png` (기존 자산 덮어쓰기 없음)
- 화풍 재수정본: `assets/events/day18-v4/morning-alarm-off-v2.png` (런타임 사용; 손·팔만 2D 셀 채색으로 정밀 편집)

최종 프롬프트:

> Use case: illustration-story. Asset type: visual novel DAY18 morning waking action CG, 16:9 landscape. Image 1 is room, bedding and style reference. Tight first-person view while lying in this bed, blue blanket foreground. A single adult bare right hand reaches toward a black smartphone on the small wooden bedside table immediately beside the bed, index finger pressing its large stop button. Phone screen clearly shows only 08:00, a small simple alarm clock icon, and Korean button text '끄기'. No messages, contacts, date or other screen text. Match reference blue-gray duvet, white sheet, bedside wood and cool gentle morning light from window on left. Tight crop omits overall room geometry. Soft polished 2D Korean visual novel illustration, not photorealism. No extra people, faces, jewelry, medicine, new furniture, UI outside phone, captions or watermark. This is switching off an ordinary wake-up alarm, not a medicine alarm or message. Natural hand anatomy and reachable phone.

## 검증

전체 자동 470 PASS, 0 FAIL. 기존 아침 3개 schema × 3약속 검사를 확장해 알람 CG/파일/행동 문장 제외/선택 후 재삽입 금지 및 결정적 재생을 확인했다. 실제 SOLO 비-SKIP 시작 시 새 CG 표시와 이후 몸 상태 독백/08:00을 확인했다. 캡처는 CG 페이드인 도중이므로 완전히 불투명해진 최종 프레임 증거는 아니다. 새로고침/이어하기에서 같은 CG 재생 확인, 콘솔 오류/경고 없음, 사용자 저장 복원 완료.

다음: 같은 침구 기준 누운 자세/발끝 움직임 및 알람 입력·소리의 필요 범위를 구현한다. 모든 행동을 사진으로 대체했다고 전체 완료 처리하지 않는다. 동일 최종 버전 4경로/모바일·DAY15~17 감사 및 DAY19~30 원본 구현은 남았다.

## 01:37 저장/연속 재생 후속

기존 생산 SaveManager 경로 검사는 주로 선택 이후를 저장했다. 선택 전 아침도 별도 검사하여 유리/하은/혼자 각각 실제 SaveManager 저장→로드→진입에서 선택 0개, morning phase, 침실/08:00, 알람→물 CG 순서와 전체 시퀀스를 보존하는지 고정했다. 대상 저장 통합 테스트 5 PASS. 전체 테스트를 이번 실행에서 다시 수행한 것으로 집계하지 않는다.

실제 하은 경로를 SKIP 없이 시작해 알람 CG→몸 상태 독백→물 CG→약속 회고→아침 3선택을 확인했다. 콘솔 오류/경고 없음, 같은 QA 탭의 원래 사용자 저장 복원 확인. 이 실행은 연속 재생 검증이며 발끝/알람 입력·소리를 구현한 것은 아니다. game215 유지.

## 01:41 유리 확인 및 다음 구현 계약

유리 경로의 새 알람→물 CG→약속 회고→3선택도 실제 비-SKIP으로 확인했다. 08:00, 콘솔 오류/경고 없음, 원래 저장 복원 완료. 이로써 새 알람의 약속 3유형 진입은 확인했지만 최종 4성향 전체 검증은 아니다.

알람 입력/소리 사전 코드 조사: 현재 cgShow는 Scene 소유 입력 잠금과 자동 종료 타이머만 제공하며 버튼 입력을 받지 않는다. SoundManager의 일반 preset는 UI 합성음이고, playCue는 파일 기반 day1/day2 목록만 받는다. 따라서 단순히 알람 ID를 전달하거나 기존 alert음을 호출해서 소리가 구현됐다고 하지 않는다.

다음 구현은 우선 **발끝 움직임**에 집중한다. 기존 푸른 침구와 같은 누운 POV에서 발끝 움직임을 시각적으로 표현하고 알람 직후/몸 상태 독백 직전에 배치한다. 물/옷/약속 선택에 새 사실을 추가하지 않는다. 재생은 3개 schema×3약속에서 결정적이어야 한다. 알람 입력을 추가한다면 별도 일회성 행동 컨트롤로 처리하고 대화/관계 선택 이력에 넣지 않는다. 클릭·Enter/Space·SKIP·재개·음소거 모두 해제/정리가 되어야 하며 무한 소리나 입력 잠금이 남지 않아야 한다. 이는 아직 설계 조건이며 구현 완료가 아니다.

## 알람 입력·전용 소리 구현 후속 — 2026-09-05

기존 2.8초 자동 `cgShow`를 일회성 `alarmAction`으로 교체했다. 아침 알람 화면은 사용자가 화면을 누르거나 Enter/Space를 입력할 때까지 유지되고, 입력 직후 전용 알람 루프를 정지한 뒤 발끝 rest→flex→rest로 진행한다. 이 행동은 관계 선택·대화 이력에 기록하지 않는다.

- 전용 소리: `assets/audio/day18/phone-alarm-loop.wav`, 1.2초 두 번 울리는 자체 생성 루프
- 재현 스크립트: `scripts/generate-day18-alarm.mjs`
- 소리 계약: `src/day18-audio-data.mjs`의 `SFX_DAY18_PHONE_ALARM`; 다른 알림·경고음을 재사용하지 않음
- 정리 계약: 일반 입력과 SKIP 모두 cue·CG·`data-alarm-action`을 제거한다. 사운드 OFF는 SoundManager의 전체 cue 정리 계약을 따른다.

자동 검사는 알람이 발끝보다 앞에서 입력을 기다리는지, 전용 WAV가 실제 존재하고 loop 채널로 재생·정지되는지, 일반 입력과 SKIP 양쪽에 정리 코드가 있는지를 분리해 확인한다. 실제 브라우저의 클릭·키보드·음소거·새로고침 재개 QA는 다음 게이트다.

실제 브라우저 후속: SOLO 집중 저장으로 알람 화면이 자동 종료되지 않고 `data-alarm-action=active`와 `눌러서 알람 끄기`를 유지하는지 확인했다. 화면 클릭과 Space 입력 각각에서 즉시 marker가 제거되고 `morning-feet-rest-v1.png`로 전환됐다. 알람 대기 중 새로고침→이어하기 뒤 동일 알람 입력 상태와 CG가 다시 열렸고, QA 종료 후 테스트 전 사용자 저장을 복원했다. 사운드 버튼은 STORY 전체화면에서 숨김 상태라 UI를 통한 음소거 토글은 이번 실제 QA에서 수행하지 못했다. SoundManager OFF의 cue 전체 정리는 자동 계약만 통과했으며 실제 음소거는 남은 게이트다.

## 스토리 사운드 접근성·SKIP 실제 QA — game233

STORY 상단 툴바에 기존 SoundManager와 동일한 `SND ON/OFF` 컨트롤을 노출했다. 일반 화면과 스토리 화면은 하나의 토글 함수를 공유하며, 알람 입력 대기 중 OFF는 전체 cue를 정리하고 다시 ON으로 바꾸면 현재 `alarmAction`의 전용 루프만 명시적으로 재개한다. 새 관계 선택이나 저장 schema는 만들지 않았다.

실제 SOLO 알람 대기 화면에서 버튼이 보이는지, ON→OFF→ON의 `aria-pressed`와 안내 문구가 바뀌는지 확인했다. 이어서 알람이 남아 있는 상태에서 SKIP하여 알람 전용 안내/CG가 제거되고 첫 아침 선택으로 이동하는지 확인했다. 이 과정에서 SKIP 뒤 스테이지에 `눌러서 알람 끄기` 접근성 이름이 남는 문제를 발견해 일반 입력과 SKIP 양쪽 정리 시 `aria-label`도 제거하도록 수정한 뒤 재검증했다. 청감 파형 측정 결과로 집계하지 않으며, QA 종료 후 테스트 전 사용자 저장을 복원했다.

대상 자동 6 PASS, 시뮬레이션 전체 PASS. 다음은 최신 행동 감사표의 잔여 SCENE 우선순위를 따라 진행하고, 최종 동일 버전 4경로·모바일 및 DAY15~17 감사를 별도 수행한다. DAY18 PARTIAL 유지.
