# DAY28 V4 실제 브라우저 QA

판정: **PASS / COMPLETE**. Chrome 152 실제 렌더링 엔진을 CDP로 구동해 네 의미 경로를 AUTO OFF, SKIP 클릭 0회로 DAY29까지 완주했다. Node 단위·회귀 검증과 별개의 브라우저 관문이다.

## 실행 조건

- 진입 하네스: `tests/day28-v4-browser-entry.html`
- 실제 브라우저 실행기: `tests/day28-v4-browser-qa.mjs`
- 브라우저: `Chrome/152.0.7977.76`, headless 렌더링, 127.0.0.1 로컬 서버
- 진행: 화면의 대화 영역과 노출 선택지를 순서대로 클릭했다. AUTO는 전 구간 `aria-pressed=false`, SKIP은 보였지만 클릭하지 않았다.
- 저장 안전: 격리된 QA 프로필에서 기본/Story/Free 세 슬롯을 최초 진입 전에 백업하고 마지막에 null 슬롯까지 원상 복구했다. 사용자의 실제 브라우저 프로필과 저장은 열거나 변경하지 않았다.

## 경로 결과

- Friendly: 하은 대면 `IN_PERSON`, 관계 `CONTINUE`, 현재 키스 `KISS`, 집 초대 `ACCEPTED`, DAY29 hook과 DAY29 진입 PASS.
- Neutral: C1 `짧게`를 실제 선택해 `CALL`을 실행했다. 현재 물리 접촉과 집 초대는 모두 `null`, 관계 `CONTINUE`, DAY29 hook과 DAY29 진입 PASS.
- Distant: 만남·상대 대사 없는 Solo 생활, `SINGLE`, 접촉·집 초대·새 관계 없음, DAY29 hook과 DAY29 진입 PASS.
- Mixed: 실제 단일 상대 아라 `NEW_MEETING / IN_PERSON`, 현재 응답 `NEED_TIME`, 새 연애를 만들지 않고 `SINGLE`, DAY29 hook과 DAY29 진입 PASS.
- 네 경로 모두 DAY28 chapter `complete=true`, `day=29`, Story/Free 선택 UI 동시 노출 0건, runtime exception과 조치 가능한 console error 0건이다.

## SCENE14 / C12 저장 재개

- Friendly C12 노출 직전 저장은 `phase=daily_listening`, `choiceCount=11`, `19:00`, `neighborhood-park-day`, 하은 캐릭터 표시였다.
- 페이지 reload 후 이어하기로 같은 C12까지 다시 진행했으며 시간·공원·하은·선행 선택 11개가 모두 동일했다.
- 첫 실행에서 공원 전환 뒤 하은이 숨은 채 남는 결함을 발견했다. DAY18~28 V4 전환이 명시한 캐릭터를 즉시 다시 표시하도록 `game.js`를 수정했고 재실행에서 전후 모두 PASS했다.

## 실행 중 교정

- 원문 provenance 객체인 `step.source`를 이미지 URL처럼 preload해 `/[object Object]` 404를 만들던 결함을 발견했다. preload 대상은 비어 있지 않은 문자열 asset URL로 제한했다.
- 수정 후 `/[object Object]` 요청과 runtime exception은 0건이다. favicon 404는 앱 실행과 무관해 관문에서 제외했다.
- CDP 합성 클릭 때문에 발생한 fullscreen 사용자 제스처 경고와 사용되지 않은 정적 preload 경고만 남았다. 실제 플레이 상태·분기·저장·렌더링에는 영향을 주지 않는다.

## 자동 회귀

- `npm test`: PASS (기존 전체 Node 회귀와 100회×30일 시뮬레이션 포함)
- `node --check game.js`: PASS
- `node --check tests/day28-v4-browser-qa.mjs`: PASS
- 브라우저 실행기는 Friendly 재개, Neutral 실제 CALL, Distant Solo, Mixed 아라를 의미 단언하므로 첫 선택만 반복해 다른 경로를 잘못 통과시키지 않는다.

다음 시작점: DAY28을 **PASS / COMPLETE**로 닫고 DAY29 최종 Notion 원문 잠금과 DAY26~28 실제 이력 감사를 시작한다.
