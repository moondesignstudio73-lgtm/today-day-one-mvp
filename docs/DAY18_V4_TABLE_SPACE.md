# DAY18 SCENE10 추가 접시를 위한 자리 — 구현 계약

원문: 유리의 “응. 그렇네.” 뒤 침묵이 있고 음식이 하나 더 나오자 두 사람이 컵을 옮겨 접시 자리를 만든다. 이전에 일반 독백에서 제거한 행동을 실제 식탁 CG와 컵 소리로 연결한다. imagegen 스킬 내장 생성 모드를 사용한다.

그래프: 유리 응답 → 기존 pause → 컵 소리/손이 컵을 옮기며 추가 접시가 놓이는 CG → 재만남 태도 선택. 입력은 dinner=YURI와 yuri_next 장면. 출력 flag/선택/수락/저장 스키마는 변하지 않는다. 하은·혼자 식사에 표시하지 않는다. 3초 정지 그림이므로 실제 프레임 애니메이션은 아니며 대화창에 행동 지시를 다시 넣지 않는다.

얼굴 없이 손/식탁/컵/접시만 사용해 다른 캐릭터나 관계 접촉을 만들지 않는다. 음식명·알코올·지갑·계산서는 추가하지 않는다. 표시와 자동 복귀, 상태 불변, 재생을 검증한다.

## 결과

- game203, bridge/playable15, source-beats2. 전체 자동 테스트 459 PASS, 0 FAIL. /1·/2·/3에서 앵커→pause→컵 SFX→CG 순서, 무텍스트, 에셋 존재, 상태 불변, 저장 직렬화 재생 확인. 하은·혼자 경로에 CG 누출 없음.
- 실제 브라우저 1721×927, 비-SKIP: 유리 관계 응답→SCENE10→“응. 그렇네.”→CG visible/source/화면 확인→자동 종료→재만남 세 선택 도달. 캡처는 초기 크로스페이드 시점으로 배경이 비쳐 보인다. 컵/손/중앙 접시는 화면 안에 들어온다. 19:00·유리 복귀 확인.
- 새로고침/이어하기로 같은 관계 선택 직후 Scene 시작점 재개 확인. 콘솔 error/warning 없음. 기존 사용자 저장 복원 확인. SFX 청취는 직접 검증하지 않아 코드/에셋 연결 검사 범위로만 기록한다.
- 최종 4경로/모바일 및 다른 물리 행동은 미완료. DAY18 PARTIAL 유지.

## 생성 기록

imagegen 스킬, 내장 generate 모드. 기존 적합한 추가 접시 에셋이 없어 생성했다. 손 화풍 재감사 뒤 런타임 승인본은 `C:/Users/aaa/OneDrive/Desktop/AI해커톤/game/assets/events/day18-v4/table-space-v2.png`이며 v1은 같은 안전 비트맵으로 격리했다. 원본 생성본 보존.

최종 프롬프트:

> Use case: illustration-story. Asset type: Korean slice-of-life visual novel event CG, landscape 16:9. A tight downward tabletop view in a quiet casual bistro in warm evening light. Two adult diners seated opposite each other make room for one additional plate during a serious conversation: two hands at opposite edges each move their own simple clear water tumbler outward, leaving a newly served small ceramic plate of ordinary unlabelled food in the middle. Two already-used individual dinner plates partly visible near frame edges. Show the practical act of moving cups, not a toast. Hands separate, no touching, each naturally holding a cup close to the table surface. Crop sleeves tightly with neutral cuffs, no faces or torsos. Delicate anime linework and soft painterly shading, muted warm wood and off-white ceramics, everyday imperfect tabletop, restrained mood. No alcohol, no rings, no hearts, no wallets, bills, phones, menus, text, logos, watermark, panels or UI. Main cups, hands and central plate readable within a contain-fit game frame.
