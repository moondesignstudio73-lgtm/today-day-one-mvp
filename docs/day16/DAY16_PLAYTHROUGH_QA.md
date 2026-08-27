# DAY 16 실제 브라우저 연속 플레이 QA

상태: **PLAYTHROUGH QA PASS**
DAY 16 NEEDS FIX: **0**

검사 환경: 로컬 기능 브랜치 `ea5625583ca963b3550e69a4a75a6cff1d108803`, Codex 인앱 브라우저, 데스크톱 전체화면

## 일반 경로

1. DAY 15 완료 저장에서 DAY 16 · D-15로 이어하기
2. `social16_contact_written_intro` 선택
3. 새로고침 뒤 이어하기로 stage 1 복원
4. `social16_meeting_exit_anytime` 선택
5. `social16_sharing_ask_each_person` 선택
6. 자유행동 `지훈과의 연락 경계를 저장한다` 완료
7. `SAVE · DAY 17 →`로 DAY 17 · D-14 첫 장면 도달

stage 1 복원은 지훈의 선택 반응부터 재개되고, 밝은 낮 카페 배경·지훈 스프라이트·대사 UI가 선명하게 표시됐다. 이전 선택을 다시 묻거나 효과를 중복 적용하지 않았다.

## SKIP 경로

1. DAY 16 stage 0을 별도 저장으로 다시 시작
2. SKIP이 첫 선택에서 정지하는지 확인
3. `social16_contact_one_to_one` 선택 후 SKIP
4. `social16_meeting_topics_current` 선택 후 SKIP
5. `social16_sharing_old_media_closed` 선택 후 SKIP
6. 다섯 개 자유행동 카드가 생략되지 않는지 확인
7. `DAY 17 건강 루틴 확인을 준비한다` 결과와 DAY 17 저장 버튼 확인

SKIP은 장면 대사만 빠르게 진행하고 세 전략 선택과 자유행동을 건너뛰지 않았다.

## 판정

| 영역 | 결과 |
|---|---|
| DAY 15→16 진입 | PASS |
| 3단계 선택과 선택별 즉시 반응 | PASS |
| stage 1 새로고침·이어하기 | PASS |
| SKIP 선택·자유행동 보존 | PASS |
| DAY 16 자유행동 결과 | PASS |
| DAY 17 첫 장면 도달 | PASS |
| 배경·지훈/하은 자산·UI·console warning/error 0건 | PASS |

하은의 생활적 온기, 주인공의 현재 경계 판단, 지훈의 직접 지식 한계, 윤서진 두 축 독립성, 기존 미확인 단서와 잠금 프로필·후반 반전 비공개가 유지됐다.

## 다음 관문

QA 증적을 origin 기능 브랜치에 반영하고 동일한 검증 계보를 `gh-pages`에 배포한 뒤 Actions와 캐시 우회 공개 페이지를 확인한다.
