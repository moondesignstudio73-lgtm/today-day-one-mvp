# DAY23 V4 실제 브라우저 QA — 2026-09-06

## 환경과 보존

- 로컬 실제 게임: `http://127.0.0.1:8018/index.html?qa=day23-v4&route=busan-shared`
- 진입 fixture: `tests/day23-v4-browser-entry.html`
- 데스크톱 인앱 브라우저, AUTO 재생을 사용하되 SKIP 버튼은 사용하지 않았다.
- fixture 최초 진입 전에 Marriage/Free/공용 저장 키를 sessionStorage에 백업했고 검사 후 `테스트 전 저장을 복원했습니다.`를 확인했다.

## Friendly · 부산 · 공유 숙소 비-SKIP 완주

검증된 DAY21/22 상태 계약으로 부산 공유 숙소·CALM·관계 지속·사진 보관 입력을 만들고 DAY23 Story 화면에 진입했다. 실제 화면에서 SCENE01의 `하은이 커튼을 조금 열었다.`부터 시작해 다음 선택을 직접 눌렀다.

1. C1 `천천히 아침부터 먹자.`
2. C2 `어제보다 이 공간이 익숙하네.`
3. C3 `가까운 풍경 하나만 더 보자.`
4. C4 `너 웃었던 때.`
5. C5 `우리 얼굴도 같이 남기자.`
6. C6 `예산이 남으면 작은 것 하나만 고르자.`
7. C7 `어제 찍은 사진 한 장만 같이 볼까?`
8. C8 `그런 얘기도 계속 듣고 싶어.`
9. C9 `특별한 데 안 가도 너랑 계속 만나고 싶어.`
10. C10 `저녁에 둘 다 괜찮으면 잠깐 통화할까?`
11. C11 `가방을 열어 필요한 것부터 꺼내자.`
12. C12 `이런 얘기도 너한테 하고 싶어지네.`
13. C13 `나도 한 장만 고를게.`
14. C14 `나는 계속 너를 만나고 싶어.`
15. C15 `같이 각자 먹으면서 조금 이야기하자.`
16. C16 `네가 아무 생각 없이 웃는 얼굴.`
17. C17 `내일 만나서 이야기할 수 있을까?`

## 관찰 결과

- `오늘의 첫 속도`, `아침에 알아차린 작은 것`, `남은 시간을 쓰는 방법` 등 원문 선택 제목이 표시됐고 legacy 가족 연락 prompt는 노출되지 않았다.
- 아침 09:00 → 낮 15:00 → 저녁 19:00 → 밤 22:00의 clock/presentation 전환을 확인했다.
- 공동 얼굴 사진, 관계 지속, 작별 접촉, 다음 대화는 각각 별도 runtime response 뒤에만 진행됐다.
- 부산의 작은 기념품 비용만 3,000원 차감되어 최종 money는 240,000원에서 237,000원이 됐다.
- 완료 저장 검사: `error=null`, `route=BUSAN_TRIP`, `phase=ending`, `complete=true`, `day=24`, `pendingStoryId=m30-day24-current-commitment-check`, `day24Hook=true`, `freeAction=null`.
- DAY23 완료 뒤 legacy Free Action 없이 DAY24 Story 장면으로 전환됐다.
- 화면에서 개발 메모·조건문·분기 설명이 일반 대화로 노출되거나 존재하지 않은 연락·상호 동의가 생성되는 문제는 발견하지 않았다.

이 한 경로는 **PASS**다.

## Neutral · 부산 · 별실 비-SKIP 완주

- 최초 구현에서 C1 직전 `그녀의 커튼과 잠든 모습은 보지 못했다.`라는 분기 설명이 일반 독백으로 노출되는 것을 발견했다.
- 부재를 설명하는 문장을 제거하고 `나는 내 방에서 깼다. 물을 마시고 하은과 만나기로 한 시간을 확인했다.`라는 현재 행동으로 교체했다.
- 공유 숙소 전용 커튼·잠든 모습·공용 컵 대사가 나타나지 않는 상태로 C1~C17을 직접 진행했다.
- DAY23 종료 후 DAY24 Story 진입을 확인했다. **PASS**.

## Mixed · 서울 당일 비-SKIP 완주

- 내 방의 익숙한 천장에서 시작해 C1~C17을 직접 진행했다.
- 부산 숙소, 귀환 기차, 역 작별 장면을 재생하지 않았고 각자 집에서의 통화와 생활 장면으로 이어졌다.
- `기차에 함께 있는 것처럼 꾸미지 않았다`, `오늘은 역의 인사나 포옹을 다시 겪지 않았다` 같은 구현 설명을 실제 행동 문장으로 교체한 결과가 화면에 반영됐다.
- DAY23 종료 후 DAY24 Story 진입을 확인했다. **PASS**.
- 두 경로 종료 뒤 fixture의 `테스트 전 저장을 복원했습니다.`를 다시 확인했다.

## 미여행·거절·모바일 종결

- Neutral · 미여행 · 연락 가능: C1~C8을 SKIP 없이 진행했다. 여행·숙소·기차·역을 만들지 않고, 현재 가능한 연락과 실제로 합의한 다음 대화만 남긴 뒤 DAY24로 전환됐다.
- Distant · 미여행 · 연락 불가: 유효 `389×844`에서 C1~C8을 SKIP 없이 진행했다. 하은 대사·문자·통화·만남, 여행 기억, 합의하지 않은 내일 대화가 나타나지 않았고 DAY24로 전환됐다.
- Distant · 부산 별실 · 현재 응답 거절: `DIFFICULT`이지만 연락 가능한 검증 상태를 별도 fixture로 추가했다. 현재 사진 보관·작별 접촉은 거절되고 관계 답은 `UNSURE`로 남은 채 필요한 대화만 다음 날로 넘겼다. 공동 숙소 아침과 자동 접촉은 없었다.
- 거절 경로 완료 저장: `error=null`, `route=BUSAN_TRIP`, `tone=DIFFICULT`, `complete=true`, `photoKept=false`, `relationshipOutcome=UNSURE`, `farewellContact=NONE`, `nextConversation=MEET`, `day=24`, `day24Hook=true`, `freeAction=null`.
- 모바일 실측은 `innerWidth=389`, `innerHeight=844`, `scrollWidth=clientWidth=389`로 가로 넘침 0이다. 이 실행 전체의 console warning/error는 0이다.
- 모든 경로 뒤 사용자 저장을 복원하고 임시 viewport를 reset했다.

source/state/playable/bridge/저장/Story-Free 배타성/데스크톱·모바일 의미 경로가 모두 닫혔으므로 DAY23 V4는 **PASS / COMPLETE**다.

## 다음 시작점

DAY24 최종 원문을 잠그고 DAY21~23 실제 이력과 기존 DAY24 구현 차이를 감사한다.
