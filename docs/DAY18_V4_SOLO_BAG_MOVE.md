# DAY 18 V4 — SOLO 맞은편 가방 이동

## 원문 분류와 구현

- 원문: `나는 의자 하나에 앉았다. 맞은편에 가방을 올렸다가, 다른 손님이 들어오는 걸 보고 내 옆으로 옮겼다.`
- 분류: 대사나 내적 독백이 아닌 물리 행동이다.
- 적용 범위: 실제 저녁 상대가 `SOLO`인 경우만 표시한다. 유리·하은 경로에는 노출하지 않는다.
- 표시 위치: 직원의 허락 뒤 `처음부터 저녁 전체를 맞힐 필요는 없었다.`라는 내적 독백 직후, 메뉴 선택 직전이다.
- 상태 영향: 식사·관계·연락 flag를 추가하거나 바꾸지 않는다.

## 자산

- 게임 경로: `assets/events/day18-v4/solo-bag-seat-move-v1.png`
- 기준 배경: `assets/backgrounds/map-locations/002_gimbap-village-evening-v1.png`
- 생성 원본: `C:\Users\aaa\.codex\generated_images\01a06810-af54-7db0-a3f6-3764034ac137\exec-72fa6b1c-f0de-43ea-a128-c4353a5ea4a6.png`

최종 생성 프롬프트:

> Use case: illustration-story. Asset type: DAY18 silent visual novel physical-action CG, landscape 16:9. Use the provided image as the exact evening Korean gimbap restaurant reference and preserve its architecture, warm indoor lighting, dark exterior, and softly painted Korean visual-novel style. Show a first-person seated view at one small table. One natural adult hand lifts a plain unbranded dark-charcoal canvas shoulder bag from the chair directly opposite and moves it toward the empty adjacent chair beside the viewer, visibly making the opposite seat available. At the distant entrance, include only a softly blurred anonymous adult customer silhouette entering, with no face, clothing details, gender, or identity emphasized. No companion at the table, no conversation, no food being eaten, no phone, no labels, no readable text, no logos, no UI, no watermark. Natural hand and strap anatomy. The action is clearing a seat for another customer, not leaving and not offering the bag.

가방 재질과 색은 행동을 읽기 위한 중립적 시각 구체화이며, 주인공의 과거 소지품 정보나 새 상태로 사용하지 않는다. 입장 손님도 얼굴·성별·정체가 없는 원거리 실루엣으로 제한했다.

## 검증

- 자동: 3개 저장 스키마 × 유리/하은/SOLO에서 SOLO만 CG가 나타나고, 원문 행동 문장이 일반 독백으로 출력되지 않으며, 자산 존재·순수 재생을 검사했다.
- 전체 자동 회귀: 482 PASS, 0 FAIL.
- 실제 비-SKIP: 집중 fixture에서 점심 답장→남은 밥 CG→김밥집 원문→새 가방 이동 CG→세 메뉴 선택을 확인했다.
- 저장 재개: CG 표시 중 새로고침 후 Scene 시작점에서 다시 진행해 같은 가방 CG와 세 메뉴 선택을 확인했다.
- 브라우저 콘솔 오류: 없음.
- 사용자 저장: `테스트 전 저장 복원`으로 복원 완료.

## 판정

이 한 행동은 완료했다. 알람 입력·소리, 그 밖의 잔여 행동, 동일 버전 4경로·모바일·DAY15~17 감사가 남아 있으므로 DAY18 전체는 `PARTIAL`이다.
