# DAY21 V4 실제 브라우저 QA — 2026-09-06

## 판정

- DAY21 전체: **PARTIAL**.
- 데스크톱 Friendly · park · Busan · shared lodging: PASS.
- 데스크톱 Mixed · Phone · Seoul day trip: PASS.
- 데스크톱 Distant · no-contact · Deferred: PASS.
- 나머지 데스크톱 의미 경로와 389×844 모바일: NOT RUN.

## 실행 환경과 보존

- 로컬 HTTP: `http://127.0.0.1:8000/tests/day21-v4-browser-entry.html`.
- fixture가 실제 DAY18→19→20 reducer와 완료 bridge를 완주해 DAY21 시작 저장을 만들었다.
- SKIP/AUTO를 사용하지 않고 화면의 실제 선택 버튼과 장면 진행 입력만 사용했다.
- 최초 fixture 실행 전 Story/Free 포함 저장 키 3개를 sessionStorage에 백업했고 시험 종료 후 `테스트 전 저장을 복원했습니다.`를 화면에서 확인했다.

## 데스크톱 Friendly · Busan

- 함께 잔 다음 아침에서 C1 `천천히 먹고 시작하자.`, C2 `오늘은 내가 물 가져올게.`를 선택했다.
- C3 `공원에서 만나자.` 뒤 SCENE05~12를 실제 진행했고 C4~7은 적극적으로 듣는 첫 선택을 사용했다.
- C8 `고마워. 그리고 지금 너를 좋아해.`, C9 `오늘 한 말이 내일도 내 말이도록 행동하고 싶어.`를 선택했다.
- C10 `안고 싶어.`는 하은의 별도 현재 응답 뒤에만 진행됐다.
- C11 `먹으면서 여행 얘기를 조금 해도 괜찮을까?`, C12 부산 후보, C13 공유 숙박 의사를 선택했다. 공유 숙박 역시 하은의 별도 현재 응답 뒤에 진행됐다.
- fixture가 명시한 검증 견적을 사용해 C14~16 준비·짐·마지막 메시지를 완료했고 DAY22 `떠날 수 있는 사람` 진입을 화면에서 확인했다.
- 완료 화면 기준 Story Free Action 비노출, `scrollWidth - clientWidth = 0`, console warning/error 0.

## 데스크톱 Mixed · Phone · Seoul

- 귀가한 다음 아침에서 C1·2 중간 선택, C3 `나는 오늘 집에서 통화하는 게 더 편해.`를 사용했다.
- SCENE05~16 통화 진행 중 `#vnCharacter`와 `#vnEventCg`가 모두 실제 비노출임을 확인했다. 음성 대화 선택 C4~9는 정상 진행됐다.
- C10 `안고 싶어.`를 골라도 현재 접촉 resolution을 열거나 포옹 사실을 만들지 않고 C11로 진행했다.
- C11 여행 재논의, C12 서울, C13 당일 변경을 선택했다. 숙박 응답·예약·결제 없이 C14~16을 거쳐 DAY22로 전환했다.
- Story Free Action 비노출, 데스크톱 `scrollWidth = clientWidth = 1484`, console warning/error 0, 사용자 저장 복원 PASS.

## 데스크톱 Distant · Deferred

- 연락 불가·관계 비활성·혼자 아침 fixture에서 C3은 `오늘은 마음이 너무 복잡해. 다른 때 들어도 될까?` 하나만 노출됐다.
- SCENE05~16 대신 SCENE21 대체 선택으로 이동했다. C4에는 실제 미완료 민호 연락이 없어 민호 선택이 없었고 자기 점검/식사 두 선택만 표시됐다.
- 이유 점검, 여행 보류, 충분히 쉬기, 다음 연락 의사까지 화면 선택으로 진행했다. 마지막에는 `연락하지 않기로 했...` 독백이 표시되며 하은에게 실제 메시지를 보내지 않았다.
- 대체 경로 화면 DOM에는 하은 현장 캐릭터가 없었고, 미청취 하루 이야기·접촉·예약·결제를 여는 선택도 없었다.
- DAY22 전환, Story Free Action 비노출, 데스크톱 `scrollWidth = clientWidth = 1484`, console warning/error 0, 사용자 저장 복원 PASS.

## 다음 시작점

동일 fixture에서 데스크톱 Rest+separate와 Neutral park를 SKIP 없이 완주한다. 이후 브라우저 viewport를 389×844로 고정해 Friendly/Neutral/Distant/Mixed 대표 경로와 경계 경로를 반복하고 이미지 로드·가로 넘침·콘솔·DAY22 전환을 기록한다.
