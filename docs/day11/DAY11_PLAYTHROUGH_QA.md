# 《결혼까지 30일!》 DAY 11 실제 브라우저 연속 플레이 QA

- 검사 일시: 2026-08-26
- 검사 대상 SHA: `124f60a1922a02439ce82c3fcd4eb496a1f58f3a`
- 검사 환경: Codex in-app browser, 동일 SHA 로컬 정적 빌드의 격리된 `localhost` 저장
- 공개본 대조: `https://superstarman35.github.io/game/` 및 DAY 11 런타임·프레젠테이션 모듈 HTTP 200
- 결과: `PLAYTHROUGH QA PASS`

## 연속 플레이 경로

1. DAY 10 완료 기록과 DAY 11 대기 플래그가 있는 격리 저장으로 DAY 11에 진입했다.
2. 첫 기준은 `life11_anchor_recovery`를 선택했다.
3. 첫 선택 직후 페이지를 새로고침하고 `이어하기`로 돌아와 선택 반응과 stage 1이 복원되는지 확인했다.
4. 일정 충돌 규칙은 `life11_conflict_owner_decides`, 공유 범위는 `life11_share_separate_ownership`을 선택했다.
5. DAY 11 자유행동에서 `DAY 12 계정 확인 목록을 준비한다`를 실행했다.
6. `SAVE · DAY 12`로 DAY 12 헤더와 후속 일상 화면에 도달했다.

## 7영역 QA

| 영역 | 결과 | 확인 내용 |
|---|---|---|
| STORY | PASS | 목요일 재활 메모와 금요일 외래 안내의 차이를 알아차리되 거짓말·범죄로 단정하지 않는다. 하은은 검증 규칙에 동참하며 밝고 생활적인 말투를 유지한다. |
| VISUAL | PASS | 집 아침·낮 카페·공원·귀가 배경과 하은 세이지 외출복이 선명하게 로드됐다. 확대 깨짐, 잘못된 종횡비, 이전 화자 잔상은 없었다. |
| DIRECTION | PASS | 선택 카드와 하은이 UI를 가리지 않으며 생활 장면 전환이 자연스럽다. 날짜 차이에 공포 줌·글리치·위기 색보정이 없다. |
| AUDIO | PASS | 생활형 `daily` BGM 계약을 유지하며 재생 실패로 인한 콘솔 오류가 없다. 검사는 음소거 상태에서도 오디오 요청 오류를 포함해 확인했다. |
| GAMEPLAY | PASS | 세 전략 선택, 선택별 즉시 반응, 첫 선택 후 중간 저장 복원, 자유행동, DAY 12 도달이 모두 작동했다. |
| UX | PASS | 선택 질문과 세 전략의 차이가 읽히고, `SKIP`, `이어하기`, 자유행동 완료와 다음 DAY 버튼이 정상 작동했다. |
| BUG | PASS | 브라우저 console warning/error 0건. 선택 불능, 입력 잠금, 빈 장면, 잘못된 캠페인 장면 진입을 재현하지 않았다. |

## 공개 배포 대조

- 공개 `index.html`은 `game.js?v=157`을 제공한다.
- 공개 `src/day11-campaign-runtime.mjs`에서 `DAY11_SHARE_CHOICES`와 `day11ScheduleNoteMismatch = "unverified"` 계약을 확인했다.
- 공개 `src/day11-presentation-data.mjs`에서 8개 Scene의 `assetStatus: "ready"`를 확인했다.
- 최종 판정은 공개 도메인의 기존 저장과 분리된 `localhost` 격리 저장에서 수행했다. 격리 QA 진입 파일은 검사 종료 후 제거한다.

## 판정

- NEEDS FIX: 0
- DAY 11 실제 브라우저 연속 플레이 QA: PASS
- 다음 관문: QA 증적 커밋, origin push, 동일 SHA `gh-pages` 배포와 공개 문서 확인
