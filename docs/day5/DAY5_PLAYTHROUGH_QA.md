# 《결혼까지 30일!》 DAY 5 실제 브라우저 연속 플레이 QA

- 검사 일시: 2026-08-28
- 검사 대상 SHA: `cd4b189`
- 검사 환경: Codex in-app browser, 격리된 `localhost` 저장과 로컬 정적 서버
- 결과: `PLAYTHROUGH QA PASS`

## 연속 플레이 경로

1. DAY 4 완료 기록과 높은 하은 관계 상태가 있는 격리 저장으로 DAY 5에 진입했다.
2. `entry_current_facts` 선택 직후 새로고침·이어하기로 선택 반응과 stage 1 복원을 확인했다.
3. `seojin_current_intent`, `work_pair_check`, `set-return-boundary`를 차례로 선택했다.
4. 회사 자유행동에서 `leave-office-on-time`을 실행하고 `SAVE · DAY 6`으로 DAY 6 헤더에 도달했다.

## 7영역 QA

| 영역 | 결과 | 확인 내용 |
|---|---|---|
| STORY | PASS | 하은의 생활형 농담과 자율성 존중, 주인공의 사실→관계→검토→경계 전략, 서진의 현재 기대 질문이 원고의 화자·정보 예산을 지켰다. |
| VISUAL | PASS | 데스크톱 첫 화면의 집·하은·대화창이 선명하고 얼굴·손·의상이 HUD/대화창에 부당하게 잘리지 않았다. DAY 5 CG는 1672×941, 하은은 887×1774 원본으로 로드됐다. |
| DIRECTION | PASS | 4개 선택 질문과 3전략 카드, CG·배경 전환, 자유행동 진입이 끊기지 않았다. DAY 2 기준의 16:9 행동 구도와 UI 안전 영역을 유지했다. |
| AUDIO | PASS | 음소거 상태에서도 장면 오디오 요청 실패나 콘솔 오류가 없었다. |
| GAMEPLAY | PASS | 4선택, 선택별 즉시 반응, 첫 선택 저장 복원, 자유행동, DAY 6 단일 도달이 모두 작동했다. |
| UX | PASS | 데스크톱과 390×844 모바일에서 선택이 읽히고 클릭 가능했다. 모바일 선택 레이어는 x=12, width=366이며 문서 폭 390/뷰포트 390으로 가로 넘침이 없다. |
| BUG | PASS | 브라우저 console warning/error 0건. 입력 잠금, 빈 장면, 중복 선택, 잘못된 DAY 전환을 재현하지 않았다. |

## 판정

- NEEDS FIX: 0
- DAY 5 실제 브라우저 연속 플레이 QA: PASS
- DAY 6 콘텐츠 변경: 0
- 다음 관문: QA 증적 커밋, origin 반영, 동일 검증 SHA `gh-pages` 배포와 공개 확인
