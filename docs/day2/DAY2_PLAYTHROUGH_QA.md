# DAY 2 실제 플레이 QA

검수일: 2026-08-25  
대상: `docs/day2/DAY2_SCENARIO_REVISION_V1.md` 잠금본의 실제 브라우저 런타임

## 대표 경로

- DAY 1 접촉: `contact_boundary`
- DAY 1 질문: `accident_interest`
- DAY 2 결혼: `marriage_pause`
- 집 경계: `set_home_boundary`
- 이동 중 확인: `ask_record_boundary`
- 관계 사진: `photo_observation`
- 방 탐색: `room_desk_checked` → `pc_interest` → `unclassified_key_found`
- 작은 열쇠: `key_log_only`
- 임시 연락처: `contact_familiar`

## 검수 결과

| 항목 | 결과 | 확인 내용 |
| --- | --- | --- |
| DAY 1 → DAY 2 진입 | PASS | DAY 1 완료·취침 뒤 DAY 2가 열리고 `DAY 2 · 30일 뒤`가 표시됨 |
| 잠금 프로필 | PASS | 하은 23세, MBTI·직업 잠금 유지 |
| DAY 1 콜백 | PASS | `accident_interest` 경로에서 기록 신청 경로 선택지가 조건부 노출됨 |
| 선택·탐색 | PASS | 결혼·집·차량·사진·방 3회·작은 열쇠·연락처 선택이 순서대로 진행됨 |
| 작은 열쇠 정보선 | PASS | 용도를 확정하지 않고 미분류 물건으로 기록함 |
| 저장·불러오기 | PASS | 첫 결혼 선택 직전 저장 후 동일 선택 지점으로 복원됨 |
| 중간 재개 | PASS | 연락처 선택 이후 저장 상태를 Scene 12 시작점으로 복원하고 정상 완료함 |
| SKIP | PASS | 각 구간의 다음 선택으로 이동하고 선택 없는 결말 구간을 완료함 |
| 키보드 | PASS | DAY 1 접촉과 DAY 2 첫 전략 선택을 Enter로 확정함 |
| 오디오 | PASS | 사용자 제스처로 사운드를 켠 상태에서 DAY 2 진행, 브라우저 오류 없음 |
| 모바일 | PASS | 390×844 뷰포트에서 메뉴·상태·행동 컨트롤의 접근성 트리와 입력 가능 상태 유지 |
| 콘솔 | PASS | 전체 대표 경로 종료 뒤 error/warn 0건 |

## 실제 플레이에서 발견해 수정한 결함

1. 정규 이벤트 해금일 전에는 일반 행동 결과 흐름이 캠페인 프롤로그를 선택하지 않아 DAY 2가 화면에 열리지 않았다. 다음 스토리를 먼저 판정한 뒤 캠페인 프롤로그만 예외적으로 허용하도록 연결했다.
2. 진행 중인 장면을 불러올 때 `showGame()`의 체크포인트 복원과 `loadGame()`의 직접 열기가 동시에 실행되어 동일 장면이 큐에 중복 등록될 수 있었다. 활성 이벤트가 있는 저장은 체크포인트 복원 한 경로만 사용하도록 수정했다.

두 결함은 `tests/day2-runtime.test.mjs`에 회귀 조건을 추가했다.

## 결론

PHASE 21 대표 실제 플레이 경로는 PASS다. 다음 관문은 PHASE 22 일반 읽기 속도 플레이타임 측정이다.
