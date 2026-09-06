# DAY28 V4 실제 브라우저 QA

판정: **BLOCKED / NOT RUN**. 아래 하네스와 자동 계약은 준비됐지만 실제 브라우저 플레이 증거가 아니다.

## 안전한 진입 하네스

- 진입: `tests/day28-v4-browser-entry.html`
- Friendly: 검증된 DAY27 관계 지속 이력에서 하은 대면 경로
- Neutral: 같은 이력과 낮은 현재 체력에서 C1 `짧게`를 고르면 실제 runtime resolver가 CALL을 반환하는 경로
- Distant: 관계·만남 없는 Solo 경로
- Mixed: DAY25~27에서 실제 상호 관심과 만남 응답이 이어진 아라 단일 새 만남 경로
- 첫 경로 선택 전에 기본/Story/Free 저장 세 슬롯을 `sessionStorage`에 한 번만 백업하며 `테스트 전 저장 복원`이 null 슬롯 삭제까지 되돌린다.
- 하네스는 SKIP을 클릭하거나 자동 진행을 켜는 코드를 갖지 않는다. 본편의 `autoMode` 초기값은 OFF다.
- 상태 확인은 DAY28 phase/route/만남 방식/관계 응답/현재 접촉/집 초대/다음 만남/새 상대 응답/DAY29 hook/Free Action을 표시한다.

## 자동 계약

- 네 route 버튼, replay-locked fixture, DAY28 pending Story id, 세 저장 슬롯 백업·복원, SKIP 부재를 검사한다.
- Neutral fixture는 DAY28 입력의 현재 체력이 20으로 봉인되고 C1 `short` 뒤 실제 runtime response가 `ACCEPTED/CALL`인지 검사한다. Friendly fixture의 입력은 바뀌지 않는다.

## 실제 브라우저 시도

- 로컬 서버 `http://127.0.0.1:4174/`는 HTTP 200이었다.
- Codex 인앱 브라우저는 일반 URL, Codex 브라우저 패널 선행 열기, CUA 세션 초기화, visible/hidden 생성 모두에서 webview attach timeout이 발생했고 탭 목록은 계속 비어 있었다.
- 실제 UI에서 선택을 누르거나 저장을 주입하지 못했다. 사용자 저장 변경 없음, QA 서버 종료 확인.
- 따라서 AUTO OFF 표시, 비-SKIP 진행, SCENE14 저장·새로고침 재개, 콘솔, DAY29 도달은 모두 **NOT RUN**이다.

다음 시작점: 브라우저 도구가 연결되면 위 하네스에서 Friendly를 선택해 DAY29까지 완주한다. SCENE14 공원 저녁에서 새로고침→이어하기 후 `19:00`, 공원, 하은 표시, C12 선택 유지부터 우선 확인한다.
