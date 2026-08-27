# 《결혼까지 30일!》 DAY 14 실제 브라우저 연속 플레이 QA

- 검사 일시: 2026-08-27
- 검사 기준 SHA: `e58ac16f810e09c84abafc3181ec8be712538453`
- 검사 환경: Codex in-app browser, 격리된 `127.0.0.1:4174` 저장과 로컬 정적 서버
- 결과: `PLAYTHROUGH QA PASS`

## 일반 연속 플레이 경로

1. DAY 13 완료 기록과 예산 기준·부담·검토 전략이 있는 격리 저장으로 DAY 14에 진입했다.
2. 탐색 범위는 `spend14_lane_shared`를 선택했다.
3. 첫 선택 직후 페이지를 새로고침하고 `이어하기`로 돌아와 공동 생활품 반응, stage 1과 생활용품점 재개 배경을 확인했다.
4. 구매 전략은 `spend14_purchase_wait_compare`, 선물 동의는 `spend14_consent_wishlist`를 선택했다.
5. 자유행동과 공용 생활 이벤트를 완료하고 `SAVE · DAY 15` 뒤 DAY 15 헤더와 첫 내레이션까지 도달했다.

## SKIP 경로

1. 별도 격리 저장에서 각 선택 직전 `SKIP`으로 장면을 빠르게 진행했다.
2. `spend14_lane_personal` → `spend14_purchase_one_item` → `spend14_consent_ask_first`의 세 선택이 순서대로 정상 노출되고 반응 뒤 다음 단계로 이동했다.
3. 마지막 `SKIP`은 자유행동을 건너뛰지 않고 5개 행동 카드를 표시했다.
4. `prepare-current-leisure-date`를 선택하고 `context-day14-home-saved-card-prompt`에서 결제 수단 저장 거절을 선택했다.
5. 자유행동 결과와 `SAVE · DAY 15`를 거쳐 DAY 15 첫 장면에 도달했다.

## 실제 화면·복원 확인

- DAY 14 선택 화면은 `day8-household-store-day-v1.png`와 하은 DAY 8 생활복을 사용했다. 하은 원본은 `887×1774`, 실제 표시 크기는 약 `510×1018`이며 알파·종횡비가 보존됐다.
- 첫 선택 뒤 새로고침 복원 배경은 같은 생활용품점, 두 번째 선택 뒤 카페, 세 번째 선택은 현관/거실 배경으로 전환됐다.
- 선택 카드와 대화창은 하은의 얼굴과 핵심 상품 동선을 가리지 않았다. 확대 흐림·깨진 알파·잘못된 종횡비·화자 잔상·이전 장면 잔상은 없었다.
- DAY 15 진입 화면은 집 아침 배경과 DAY 15 의상을 선명하게 표시했다.
- 사운드가 켜진 사용자 제스처 상태에서 `daily` BGM·생활 SFX 재생 요청으로 인한 콘솔 경고·오류가 없었다.
- 브라우저 console warning/error: 0건.

## 7영역 QA

| 영역 | 결과 | 확인 내용 |
|---|---|---|
| STORY | PASS | DAY 13의 예산 전략이 소비 범위·구매 판단·선물 동의로 회수된다. 출처 없는 추천은 복수 가능성을 검토한 뒤 `unverified`로 분리된다. |
| VISUAL | PASS | 집·생활용품점·카페·현관/거실 배경과 하은 DAY 8 생활복이 선명하게 로드되고 UI 안전 여백을 지켰다. |
| DIRECTION | PASS | 작은 위화감을 공포로 과장하지 않고 현재 가격·필요·소유권 확인의 생활 동선을 유지했다. |
| AUDIO | PASS | `daily` BGM과 생활 SFX 계약을 유지하며 사용자 제스처 뒤 오디오 요청 오류가 없다. |
| GAMEPLAY | PASS | 세 전략 선택, 첫 선택 뒤 저장 복원, 자유행동·공용 이벤트, DAY 15 전환이 모두 작동했다. |
| UX | PASS | 전략 차이가 읽히고 `SKIP`, `이어하기`, 자유행동 결과, 다음 DAY 버튼이 정상 작동했다. |
| BUG | PASS | console warning/error 0건. 선택 불능, 입력 잠금, 빈 장면, 완료 DAY 재진입을 재현하지 않았다. |

## 판정

- NEEDS FIX: 0
- DAY 14 실제 브라우저 연속 플레이 QA: PASS
- 다음 관문: QA 증적 커밋, origin push, `gh-pages` 안전 통합·동일 검증 SHA 공개 배포와 공개 확인
