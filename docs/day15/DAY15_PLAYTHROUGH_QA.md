# 《결혼까지 30일!》 DAY 15 실제 브라우저 연속 플레이 QA

- 검사 일시: 2026-08-27
- 검사 기준 SHA: `7bdc11627b431e3edb4e70a306748ce9eec1bf9f`
- 검사 환경: Codex in-app browser, 격리된 `127.0.0.1:4175` 저장과 로컬 정적 서버
- 결과: `PLAYTHROUGH QA PASS`

## 일반 연속 플레이 경로

1. DAY 14 완료 기록과 소비 범위·구매 판단·선물 동의 콜백이 있는 격리 저장으로 DAY 15에 진입했다.
2. 활동 배분은 `leisure15_activity_low_sensory`를 선택했다.
3. 첫 선택 직후 페이지를 새로고침하고 `이어하기`로 돌아와 선택 반응, stage 1과 책방 재개 상태를 확인했다.
4. 계획 변경은 `leisure15_change_switch`, 기록 공개는 `leisure15_privacy_no_location`을 선택했다.
5. 자유행동 결과와 `SAVE · DAY 16` 뒤 DAY 16 헤더와 현재 연락처 목록 첫 장면까지 도달했다.

## SKIP 경로

1. 별도 격리 저장에서 각 선택 직전 `SKIP`으로 장면을 빠르게 진행했다.
2. `leisure15_activity_two_options` → `leisure15_change_end` → `leisure15_privacy_ask_each_photo`의 세 선택이 순서대로 정상 노출되고 각 반응 뒤 다음 단계로 이동했다.
3. 마지막 `SKIP`은 자유행동을 건너뛰지 않고 5개 행동 카드를 표시했다.
4. `DAY 16 관계망 확인 범위를 준비한다`를 선택하고 자유행동 결과를 확인했다.
5. `SAVE · DAY 16`을 거쳐 DAY 16 헤더와 첫 장면에 도달했다.

## 실제 화면·복원 확인

- 집 아침·DAY 7 책방·전시·강변·동네 카페 6개 재사용 배경과 하은 DAY 7 외출복이 분기별로 정상 로드됐다.
- 첫 선택 뒤 저장 복원은 선택을 다시 묻거나 효과를 중복 적용하지 않고 책방 stage 1 반응에서 재개됐다.
- 선택 카드, 자유행동 카드와 결과 패널은 배경·캐릭터 핵심 영역을 가리지 않았고 깨진 이미지·알파·잘못된 종횡비·장면 잔상이 없었다.
- 예약 표기 불일치는 생활적 가능성을 검토한 뒤 `unverified`로 유지됐고 조기 반전·범인 단정·잠금 프로필 공개는 없었다.
- DAY 14 콜백과 하은의 생활형 대화, 주인공의 현재 기준 확인·변경·공개 경계가 실제 화면에서 이어졌다.
- 윤서진 `seojinAffection`/`seojinStatusInterest`는 DAY 15 선택과 후속 화면에서 독립 값을 유지했다.
- 사운드가 켜진 사용자 제스처 상태에서 생활 BGM·SFX 요청으로 인한 브라우저 console warning/error는 0건이었다.

## 7영역 QA

| 영역 | 결과 | 확인 내용 |
|---|---|---|
| STORY | PASS | DAY 14의 9개 전략 콜백, 현재형 여가 선택·변경·공개 경계, 예약 표기 `unverified`와 DAY 16 관계망 훅이 자연스럽게 연결된다. |
| VISUAL | PASS | 6배경과 하은 DAY 7 외출복, 선택·자유행동·결과 UI가 선명하고 안전 여백을 지킨다. |
| DIRECTION | PASS | 작은 위화감을 공포로 과장하지 않고 집→활동→카페→귀가 준비의 생활 동선을 유지한다. |
| AUDIO | PASS | `dateShopping`에서 `daily`로 안착하는 BGM과 생활 SFX가 사용자 제스처 뒤 오류 없이 요청된다. |
| GAMEPLAY | PASS | 세 전략 선택, 첫 선택 뒤 stage 1 복원, 자유행동, DAY 16 전환이 모두 작동한다. |
| UX | PASS | 전략 차이가 읽히고 `SKIP`, `이어하기`, 자유행동 카드·결과, 다음 DAY 버튼이 정상 작동한다. |
| BUG | PASS | console warning/error 0건. 선택 누락·중복 효과·입력 잠금·빈 장면·완료 DAY 재진입을 재현하지 않았다. |

## 판정

- NEEDS FIX: 0
- DAY 15 실제 브라우저 연속 플레이 QA: PASS
- 다음 관문: QA 증적 커밋, origin PR 병합, `gh-pages` 동일 검증 SHA 공개 배포와 공개 확인
