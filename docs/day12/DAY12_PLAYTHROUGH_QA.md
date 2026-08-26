# 《결혼까지 30일!》 DAY 12 실제 브라우저 연속 플레이 QA

- 검사 일시: 2026-08-26
- 검사 기준: `ae53822` 원격 통합 기반 DAY 12 브라우저 QA 수정 작업트리
- 검사 환경: Codex in-app browser, 격리된 `localhost` 저장과 로컬 정적 서버
- 결과: `PLAYTHROUGH QA PASS`

## 연속 플레이 경로

1. DAY 11 완료 기록과 기준·충돌·공유 전략 3개가 있는 격리 저장으로 DAY 12에 진입했다.
2. 계정 확인은 `account12_verify_support_call`, 생활비 분류는 `account12_expense_source_labels`, 금융 접근은 `account12_access_separate_investment`를 선택했다.
3. 첫 선택 직후 페이지를 새로고침하고 `이어하기`로 돌아와 선택 반응과 stage 1이 복원되는지 확인했다.
4. 자유행동에서 `현재 생활비를 분류한다`를 실행하고 공용 마이크로 이벤트 완료 상태를 확인했다.
5. `SAVE · DAY 13` 직후 DAY 13 잠금 장면 `현재 가계 예산`의 첫 내레이션까지 연속 도달했다.

## 발견·수정한 결함

- 최초 검사에서 자유행동 완료 버튼이 현재 반응 시퀀스를 계속 재생하고, 다음 날짜에도 `pendingStoryId`가 DAY 12를 가리켜 DAY 13 잠금 장면 대신 일반 행동 화면으로 빠지는 현상을 재현했다.
- 자유행동 완료를 `finishImmersiveScene()`으로 직접 연결하고 `advanceCampaignChapter()`가 날짜 전환 전에 `pendingStoryId`를 비우도록 수정했다.
- 수정 뒤 동일 경로를 처음부터 다시 플레이해 DAY 13 첫 장면, 콘솔 warning/error 0건과 입력 잠금 해제를 확인했다.

## 7영역 QA

| 영역 | 결과 | 확인 내용 |
|---|---|---|
| STORY | PASS | 공식 명의·현재 명세·비용 소유권·투자 판단을 분리하며 DAY 11의 세 전략 콜백이 순서대로 회수된다. 하은은 밝고 생활적인 조력자 톤을 유지한다. |
| VISUAL | PASS | 집 아침·현관/거실·낮 카페 배경과 하은 세이지 외출복이 선명하게 로드됐다. 깨진 알파, 확대 흐림, 잘못된 크롭은 없었다. |
| DIRECTION | PASS | 계정 확인을 공포나 충격으로 과장하지 않고 생활형 전환·중경 구도·개인정보 비가독 표현을 유지했다. |
| AUDIO | PASS | `daily` BGM과 생활 SFX 계약을 유지하며 음소거 검사에서도 오디오 요청 오류가 없었다. |
| GAMEPLAY | PASS | 세 전략 선택, 첫 선택 뒤 새로고침 복원, 자유행동, 공용 이벤트, DAY 13 잠금 장면 전환이 작동했다. |
| UX | PASS | 세 선택의 행동 전략 차이가 읽히고 `SKIP`, `이어하기`, 자유행동 완료, 다음 DAY 버튼이 정상 작동했다. |
| BUG | PASS | 전환 결함 수정 뒤 console warning/error 0건. 선택 불능, 입력 잠금, 빈 장면, 완료 DAY 재진입을 재현하지 않았다. |

## 판정

- NEEDS FIX: 0
- DAY 12 실제 브라우저 연속 플레이 QA: PASS
- 다음 관문: QA 수정·증적 커밋, origin push, 동일 SHA `gh-pages` 배포와 공개 확인
