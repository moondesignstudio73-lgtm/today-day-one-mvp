# DAY18 SCENE03 메뉴 펼침 행동

2026-09-05 game221. DAY18 PARTIAL.

## 원문과 상태 계약

유리 도착 전 메뉴를 펼쳐 읽고, 도착할 때 처음 보는 척 다시 펼치는 물리 행동을 닫힘→펼침→닫힘→펼침 네 컷으로 구현했다. 기존 행동 요약 독백에서 메뉴 읽기 부분을 제거하고, 유리 미도착과 기다리는 자세에 대한 생각만 남겼다. 메뉴의 글자는 흐릿하게 처리해 원문에 없는 음식명/가격을 확정하지 않는다.

입력은 기존 dinner=YURI, menu 단계다. 출력 flag/관계/주문 이력은 추가하지 않는다. 메뉴 4컷은 유리 인물 등장 전에만 나오고 하은/SOLO에는 나오지 않는다. 이는 제한 프레임 CG이며 메뉴 항목 직접 선택 기능이나 겉옷 행동 완료가 아니다.

## 자산과 생성

ImageGen 스킬의 built-in 생성/편집을 사용했다. 기존 비스트로의 나무 식탁·버건디 의자·조명을 기준으로 제작하고 생성 결과를 시각 확인했다. 원본은 보존했다.

- 기준: assets/backgrounds/map-locations/024_rose-bistro.png
- 생성 원본 폴더: C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137
- 펼침 원본: exec-c10f6389-843a-419a-a537-80f5129cc176.png
- 닫힘 원본: exec-d6c1912a-79b3-4ab2-9902-4c8a045c5264.png
- 프로젝트: assets/events/day18-v4/menu-open-v1.png, assets/events/day18-v4/menu-closed-v1.png

펼침 최종 프롬프트:

> Use case: illustration-story. Asset type: DAY18 visual novel POV menu-opening action CG, landscape 16:9. Image 1 is the exact Rose Bistro room, furniture, lighting and visual style reference. Tight first-person view looking down at one plain dark burgundy two-panel restaurant menu being opened by two natural adult hands over the same warm wooden table. Open cream pages have subtle out-of-focus typographic texture, NO legible words, prices or named dishes. The far edge shows only a small empty place setting and a blurred burgundy chair; the companion has not arrived. Keep warm evening amber light and painterly realistic Korean visual novel aesthetic. No food served, no people or faces, no receipt, phone, logo, readable text, watermark or UI. Anatomically correct hands. A single quiet mundane act, no romance symbols.

닫힘 최종 프롬프트:

> Use case: precise-object-edit. Asset type: matching DAY18 visual novel menu action frame, landscape 16:9. Image 1 is the edit target. Change ONLY the open two-panel burgundy menu to the SAME menu held CLOSED, plain unlettered burgundy front cover facing camera, lying at the same tabletop height. Reposition the same two hands naturally to close it, with identical black sleeve cuffs and anatomy. Preserve exact camera, wooden table, empty opposite burgundy chair, plate, glassware, candle, roses, background, warm lighting and rendering style. No readable text, logo, new objects, food or person. This is the closed frame between two openings, not paying a bill.

## 검증

- 전체 Node 테스트 477 PASS, 문법/공백 검사 통과. 초기 새 테스트에서 source 메타데이터를 문자열로 가정한 오류는 cgShow 문자열 자산만 검사하도록 고쳤다.
- 3schema×3상대 검사: YURI에만 네 컷, 모두 인물 도착 이전, 자산 존재, 행동 문장 미출력, 상태 무변경 및 JSON 재생 동일성 PASS.
- 실제 브라우저 아침부터 비-SKIP 약속 유지/하은 고지 뒤 네 컷의 src 순서를 관찰했다. 19:00 유지, 자동 종료 뒤 유리 “오래 기다렸어?”로 복귀했다. 콘솔 error/warning 없음. 테스트 전 사용자 저장 복원 완료.
- 브라우저 자동화의 CG hidden 대기 제한시간을 초과한 1회는 연속 CG 종료를 기다리는 도구 타임아웃이었다. 게임은 정상 자동 진행했고 짧은 표시 상태 관찰로 계속했다.
- 새 CG에서 실제 저장 재개, 모바일 및 전체 4경로 최종 QA는 아직 NOT RUN.

## 다음

유리 메뉴 CG 저장 재개를 확인하고, 원문 SCENE03 겉옷을 의자에 거는 행동을 실제 유리 의상/비스트로 자산과 대조해 구현한다. 하은/SOLO 가방, 메뉴 두드림·밀기, 알람 입력/소리와 최종 게이트는 남아 있다.

## 02:48 저장 재개 실제 QA

QA 페이지에 `유리 도착 전 메뉴 QA` 버튼을 추가했다. 기존 prepare/apply 함수로 약속 유지와 하은 고지 두 선택만 적용해 저장하며 런타임 내부 상태를 임의 변경하지 않는다. 기존 세션 백업/복원 방식을 공유한다. 이 집중 픽스처 진입은 아침부터 완주한 것으로 집계하지 않는다.

game221 실제 앱에서 첫 닫힌 메뉴 CG 표시 도중 새로고침했다. 이어하기 후 같은 반응 장면을 비-SKIP 진행해 닫힘→펼침→닫힘→펼침의 자산 순서, 19:00, 유리 “오래 기다렸어?” 복귀를 재확인했다. 중간 프레임에서 정확히 이어지는 것이 아니라 기존 계약대로 장면 시작에서 재생한다. 콘솔 error/warning 없음, 테스트 전 사용자 저장 복원 완료. 대상 playable 테스트 49 PASS, 공백 검사 PASS.

다음은 유리 겉옷 행동이며, 메뉴 CG 저장 재개는 더 이상 NOT RUN이 아니다. 모바일·최종 4경로·다른 잔여 게이트는 미완료다.
