# DAY 1 최종 7영역 QA

검수일: 2026-08-25  
대상 커밋 후보: PHASE 23  
최종 판정: **7개 영역 전부 PASS / NEEDS FIX 0개**

## 최종 판정표

| 영역 | 판정 | 핵심 근거 |
|---|---|---|
| STORY | PASS | 잠금된 6개 Scene, 3×3 전략 분기, 지식 순서, 캐릭터 음성, 결말 훅 유지. 금지된 사고 세부사항·후반 반전·잠금 프로필 미노출. |
| VISUAL | PASS | 승인 배경·하은 투명 스프라이트·의료진·CG 실제 경로와 최소 크기 검사 통과. v1 교체 CG 런타임 미사용. 모바일 실제 화면 확인. |
| DIRECTION | PASS | 7개 이상 Scene 전환, CG 3종, 캐릭터·NPC 큐, CG·자동 큐 입력 잠금, 감소 모션 CSS 통과. |
| AUDIO | PASS | BGM, 병실 앰비언스, SFX 8종의 큐·RIFF/WAVE·루프·중복 방지·정지·음소거 계약 통과. 실제 사운드 토글 확인. |
| GAMEPLAY | PASS | 9개 경로 모두 두 선택과 DAY 1 END 도달. 첫 선택 저장 복원, 기존 DAY 2 콜백, 9.25~9.60분 목표 통과. |
| UX | PASS | 키보드 Enter/Space, SKIP 선택 정지, AUTO 장문 진행, ARIA, 390×844 선택 화면, 캐시 버전 통과. |
| BUG | PASS | 집중 테스트·문법 검사·전체 시뮬레이션 회귀·브라우저 콘솔 error 0건. 남은 재현 결함 없음. |

## 서사 최종 확인

- 하은은 첫 포옹 실수를 인정하고 이후 접촉 허락을 구하며, 안전 수칙·물컵·생활 농담을 통해 밝고 다정한 생활감이 먼저 읽힌다.
- 주인공은 들은 사실과 기억을 구분하고, 관계·사고·가족 정보를 검증 가능한 범위로 나눈다. 하은을 근거 없이 신뢰하거나 범인으로 단정하지 않는다.
- 의사는 의료 기록과 사고 경위 기록을 구분하고 예후를 단정하지 않는다. 간호사는 즉시 안전 행동에 집중한다.
- `30일 뒤 결혼`은 과거 약속의 강제가 아니라 현재의 주인공이 다시 판단할 목표로 남고, `나부터`와 다음 날 재활 선택이 후속 훅을 만든다.
- 감각 혼란 → 접촉 경계 → 관계 주장 → 의료 확인 → 가족 상실 → 물 한 모금 → 생활 농담 → 결혼 재판단의 감정 곡선이 유지된다.

## PHASE 23에서 발견·수정한 결함

### AUTO 장문 진행 정지

- 현상: AUTO ON에서 1.6초보다 긴 대사는 첫 타이머가 타이핑만 완료하고 다음 진행 타이머를 예약하지 않아 멈출 수 있었다.
- 수정: 타이핑 완료가 먼저 필요한 경우 `scheduleAutoAdvance()`를 다시 예약해 전체 표시 후 1.6초 뒤 다음 스텝으로 진행하도록 했다.
- 실제 화면 재검증: 긴 첫 내레이션이 AUTO ON에서 다음 스텝으로 진행했고 첫 선택에서는 자동 진행이 멈췄다. 콘솔 error 0건.

### 최종 VISUAL 검사 기준

- 최초 집중 검사에서 배경·CG용 최소 너비를 투명 전신 스프라이트에도 적용해 거짓 실패가 발생했다.
- 런타임 결함이 아니므로 배경·CG는 900×600 이상, 투명 스프라이트는 140×400 이상으로 승인 명세에 맞춰 구분했다.
- 후처리 스크립트 재실행 뒤 RGBA 스프라이트와 합성 산출물이 재현됐고 Git 차이는 발생하지 않았다.

## 실제 화면 최종 검사

- AUTO OFF → ON 상태 전환: PASS.
- 긴 첫 내레이션 전체 표시 후 다음 스텝 진행: PASS.
- AUTO ON 상태에서 첫 선택 화면 유지: PASS.
- 390×844에서 상단 메뉴·3개 선택·캐릭터·대사창 표시: PASS.
- 사운드 켜기 → 끄기 버튼 상태 전환: PASS.
- 브라우저 콘솔 error: 0건.

## 자동 검증

- `tests/day1-final-qa.test.mjs`: STORY/VISUAL/DIRECTION/AUDIO/GAMEPLAY/UX/BUG 전부 PASS.
- `tests/day1-audio.test.mjs`: PASS.
- `tests/day1-runtime.test.mjs`: PASS.
- `tests/day1-playthrough-qa.test.mjs`: PASS.
- `tests/day1-playtime.test.mjs`: PASS.
- `tests/simulation.test.mjs`: 전체 PASS.
- `node --check game.js`, `node --check src/day1-campaign-runtime.mjs`: PASS.
- `scripts/process-day1-sprites.py`: 재현 실행 PASS.

## 사용자 최종 승인

2026-08-25 사용자가 실제 배포본을 최종 승인했다. PHASE 24와 `DAY 1 — COMPLETE`를 확정한다. 다음 DAY는 사용자가 명시적으로 시작할 때까지 진행하지 않는다.
