# DAY18 SCENE01 — 약속 유지 후 옷 꺼내기

2026-09-05 01:15 실행, game213. DAY18 PARTIAL.

## 원문·계약·흐름

원문 “나는 웃으며 옷을 꺼냈다”의 옷 꺼내기를 정지 CG로 연결한다. 유리/하은의 약속 유지 답장 → 옷걸이를 들어 옷을 꺼내는 POV CG 2.8초 → 기존 “약속을 지킨다는 건…” 내적 독백. 원문의 물리 행동 문장을 일반 대화창에 추가하지 않는다.

`morning_keep`만 적용하며 변경/혼자 선택에는 제외한다. 입력/출력, 저장 스키마, 약속 동의 및 식사 사실은 변경하지 않는다. 옷을 구입했다거나 이 옷을 실제 입고 저녁에 갔다는 이력을 만들지 않는다. 웃음/전신 애니메이션까지 구현했다고 집계하지 않는다. 알람/발끝/누워 있기 연출도 여전히 남는다.

## 자산과 생성 기록

- imagegen 스킬, built-in 생성 모드. 집 아침 배경은 스타일/광원 참고이며 같은 화면 편집이 아니다.
- 참조: `assets/backgrounds/morning-studio-2d.png`.
- 원본 생성: `C:/Users/aaa/.codex/generated_images/01a06810-af54-7db0-a3f6-3764034ac137/exec-f6bc3059-a2c5-4710-9beb-235cc7fa5097.png`.
- 프로젝트 저장: `assets/events/day18-v4/morning-clothes-v1.png`. 원본/기존 자산을 덮어쓰지 않았다.
- 단일 손과 평범한 옷/옷걸이, 아침빛, 새 방 배치를 확정하지 않는 클로즈업을 생성 결과 및 실제 게임에서 확인했다.

최종 프롬프트:

> Use case: illustration-story. Asset type: DAY18 visual novel silent action CG, landscape 16:9. Reference image 1 is style and morning lighting reference, not a composition to copy. Create a tight first-person close-up of taking an ordinary plain neutral beige shirt on a hanger out of a small clothing rail. One bare adult hand naturally holds the hanger near its neck and lifts the shirt forward; a few muted everyday clothes remain behind. Crop tightly to clothes and hand, do not establish a new room layout. Same clean softly painted 2D Korean visual novel style, gentle warm morning light from left, cream/light wood details. This is simply taking clothes out after confirming an evening appointment, not shopping, dressing, a gift or a special outfit. No face, other people, jewelry, bags, phone, text, labels, UI, logos or watermark. Anatomically natural single hand. No novelty props.

## QA

- 전체 자동 테스트 469 PASS, 0 FAIL. 3개 저장 스키마 × 약속/선택 조합에서 유지 전용 CG, 직전 상대별 문자/직후 독백, 파일 존재, 상태 순수성 및 JSON 재생 검사.
- 실제 브라우저 HAEUN 아침 비-SKIP: 약속 유지 → 하은/나/하은 문자 → 옷 CG → 내적 독백. 08:00 유지, NPC/문자 패널이 CG를 덮지 않음, 실제 스크린샷 확인.
- 새로고침/이어하기 후 같은 문자 반응에서 같은 CG 재생. 콘솔 오류/경고 없음. 같은 QA 탭에서 테스트 전 사용자 저장 복원 완료.
- 유리 유지의 새 CG 실제 브라우저 검증은 NOT RUN. 자동 조건 검증과 구분한다. 동일 최종 버전 4경로/모바일 및 DAY15~17 감사는 여전히 미완료.

다음은 알람/누워 있기/발끝 행동을 대화 텍스트와 분리하고 적합한 시작 연출을 구현하는 것이다. DAY19로 넘어가지 않는다.

## 01:22 후속 — 유리 유지 실제 검증

game213에서 유리 약속 저장으로 아침부터 SKIP 없이 진행했다. 유리의 “응. 늦으면 먼저 말해 줘. 나도 그러고.” 문자 → 옷 CG → 약속에 대한 내적 독백의 순서를 확인했다. 실제 화면에서 CG를 가리는 문자 패널/NPC가 없고 08:00으로 복귀했다. 콘솔 오류/경고 조회는 비어 있었다.

새로고침/이어하기 후 같은 유리 문자와 옷 CG를 다시 확인했다. 같은 QA 탭에서 테스트 전 저장 복원을 확인했다. 이에 따라 위 유리 유지 새 CG의 NOT RUN 항목은 이 후속 범위에 한해 해소됐다. 전체 유리 경로/모바일/동일 최종 버전 4경로의 PASS를 의미하지 않는다. 런타임 및 자산 변경 없음, 기존 자동 469 PASS 결과를 재실행 결과로 표기하지 않는다.
