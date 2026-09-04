# DAY18 Neutral QA 중 인물 전환 오류 — 2026-09-04 21:40

실제 Neutral 전체 플레이를 아침부터 시작했다. 19:00 식당에서 유리 이름과 대사는 나오지만 스프라이트가 전혀 보이지 않았다. DOM의 `#vnCharacter`는 hidden이며 src는 초기 하은 이미지였다. 콘솔 에러가 없다는 사실은 인물 정상 표시의 증거가 아니었다.

## 원인·수정 계약

DAY18 bridge는 유리 등장 transition에 characterId/player-ex와 올바른 에셋을 전달한다. 엔진은 presentation만 바꾼 뒤 characterId:null 때 숨기지만, 다시 등장할 때 updateImmersiveCharacter를 호출하지 않는다. DAY18 대사는 expressionId가 없어 이후 대사에서도 갱신되지 않는다. 초기 null 장면의 숨김이 유지된다.

입력: DAY18의 배경 포함 명시적 characterId 전환. 출력: null은 이미지/영상 숨김, 인물 ID는 기존 캐릭터 렌더러로 표시/교체. characterId 생략 시 현 상태 유지. 옆자리 인물이 포함된 배경은 null이므로 별도 스프라이트를 겹치지 않는다. 기존 다른 DAY/Free 렌더러는 이번 수정 범위에서 바꾸지 않는다.

저장/선택 스키마 불변. 같은 선택 위치를 새로고침해 인물 표시를 재검증한 뒤 Neutral 경로를 계속한다. 자동 검사는 실제 엔진의 해당 블록을 실행하여 숨김→등장→숨김 및 타 DAY 비영향을 확인한다. Friendly에서 이전에 확인한 인물 배경 합성은 이 스프라이트 오류를 찾지 못했으므로 전체 인물 QA 완료 주장을 하지 않는다.

## 검증 결과

- DAY18의 명시적 non-null 인물 전환에서 기존 렌더러를 호출하도록 수정했다. null 전환의 숨김은 유지한다.
- 실제 유리 경로의 같은 저장을 새로고침/이어하기: 지정된 유리 src와 visible:true를 확인하고 스크린샷에서 얼굴/몸/선택지가 겹치지 않음을 확인했다. 귀가 뒤 visible:false. 밤 저장 재개에도 인물이 나타나지 않는다.
- 별도로 하은 경로 아침부터 식당 입장까지 진행: 세이지 의상 src, visible:true와 실제 화면 표시를 확인했다. 원래 사용자 저장 복원 성공.
- 콘솔 오류·경고 없음. 전체 자동 테스트 445 PASS, 0 FAIL. 신규 테스트는 game.js의 실제 배경/인물 전환 블록을 VM에서 실행한다. `node --check game.js`, `git diff --check` 통과. game191.
- Neutral 경로를 수정 후 이어서 DAY19 08:00까지 진행했지만 전체 연출 충실도 PASS는 아니다. 다음 Distant/Mixed에서도 배경이나 state 값뿐 아니라 실제 이미지 표시/숨김을 검사한다.
