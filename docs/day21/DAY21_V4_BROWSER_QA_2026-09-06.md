# DAY21 V4 실제 브라우저 QA — 2026-09-06

## 판정

- DAY21 전체: **PARTIAL**.
- 데스크톱 Friendly · park · Busan · shared lodging: PASS.
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

## 다음 시작점

동일 fixture에서 데스크톱 Phone+Seoul, Deferred, Rest+separate, Neutral park 경로를 SKIP 없이 완주한다. 이후 브라우저 viewport를 389×844로 고정해 대표 경로와 경계 경로를 반복하고 이미지 로드·가로 넘침·콘솔·DAY22 전환을 기록한다.
