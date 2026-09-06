# DAY29 V4 실제 브라우저 QA

판정: **PASS / COMPLETE**. 실제 Chrome 152 렌더링 엔진에서 Friendly/Neutral/Distant/Mixed 데스크톱과 389×844 모바일을 AUTO OFF, SKIP 클릭 0회로 각각 DAY30까지 완주했다.

## 실행 조건

- 진입 하네스: `tests/day29-v4-browser-entry.html`
- 실제 브라우저 실행기: `tests/day29-v4-browser-qa.mjs`
- 브라우저: `Chrome/152.0.7977.76`, headless 렌더링, `127.0.0.1` 로컬 서버
- 진행: 실제 브라우저 DOM의 대화 영역과 노출 선택지를 순서대로 클릭했다. AUTO는 전 구간 `aria-pressed=false`, SKIP 버튼은 노출됐지만 클릭하지 않았다.
- 저장 안전: 별도 임시 Chrome 프로필의 기본/Story/Free 세 슬롯만 사용했고 종료 전에 테스트 전 값으로 복구했다. 사용자 브라우저 프로필과 저장은 열거나 변경하지 않았다.

## Friendly 결과

- DAY28에서 하은 대면·관계 지속·현재 접촉 수락·하은 집 초대 수락·다음 만남 수락·상호 동의 시 함께 쉬기 계획이 실제로 완료된 저장으로 DAY29에 진입했다.
- DAY29 C9 뒤 하은의 현재 만남 수락과 `HAEUN_HOME`, C13 미래 대화의 `CONTINUE`, C16 현재 `KISS`, C17 현재 숙박 수락을 각각 별도 응답으로 처리했다.
- 최종 상태는 `day=30`, DAY29 `phase=ending`, `complete=true`, `tomorrowRecipient=HAEUN`, `day29V4Day30HookPending=true`다.
- DAY29 Free Action은 끼어들지 않았고 Story 선택과 Free Action 선택의 동시 노출은 0건이다.

## Neutral / Distant / Mixed 데스크톱 결과

- Neutral: DAY28 CALL 이력 뒤 하은과 바깥 저녁을 보냈다. 미래 `CONTINUE`와 현재 `KISS`는 각각 성립했지만 집 초대·숙박·다음 만남은 없으므로 `tomorrowRecipient=null`을 유지했다.
- Distant: `eveningTarget/location/futureResponse/currentContact/newResponse/tomorrowRecipient`가 모두 `null`인 Solo 경로로 사람 응답을 만들지 않았다.
- Mixed: 실제 단일 상대 아라만 바깥 저녁에 등장했고 C18 현재 답 `ACCEPTED` 뒤에만 `tomorrowRecipient=ARA`가 됐다. 하은·유리·서진의 현재 응답은 만들지 않았다.
- 세 경로 모두 `day=30`, DAY29 `phase=ending`, `complete=true`, DAY30 hook이 켜졌고 Story/Free 선택 UI 동시 노출과 runtime exception은 0건이다.

## 389×844 모바일 네 경로

- Friendly/Neutral/Distant/Mixed를 동일 의미 선택으로 다시 완주했다.
- 모든 진행 프레임에서 `innerWidth=clientWidth=scrollWidth=389`, `innerHeight=844`, 최대 수평 넘침 0을 확인했다.
- Friendly SCENE15 저장 재개도 모바일에서 다시 통과했다.
- 네 경로 모두 데스크톱과 같은 최종 사실 및 DAY30 hook을 보존했고 조치 가능한 console error와 runtime exception은 0건이다.

## SCENE15 저장 재개

- 하은과 음악을 듣는 C15 노출 직전 `phase=haeun_music`, `choiceCount=13`, `19:00`, `girlfriend-home`, 하은 DAY12 의상 표시를 확인했다.
- 페이지 reload 후 이어하기로 같은 C15까지 복구했다. 전후 시간·배경·선택 수·하은 표시가 모두 동일했다.

## 콘솔 및 자동 회귀

- 조치 가능한 browser console error와 runtime exception: 0건.
- CDP 합성 클릭에 따른 fullscreen 사용자 제스처 warning 1종만 남았고 스토리 상태·분기·저장·렌더링에는 영향을 주지 않았다.
- `node --check tests/day29-v4-browser-qa.mjs`: PASS.
- DAY29 bridge 집중 검사 5/5 및 전체 Node·100회×30일 회귀는 본 브라우저 관문 직전에 PASS했다.

다음 시작점: DAY29을 **PASS / COMPLETE**로 닫고 DAY30 최종 Notion 원문 잠금과 DAY27~29 실제 이력 감사를 시작한다.
