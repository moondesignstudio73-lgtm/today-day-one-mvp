# DAY 19~30 V4 상태 계약·장면 그래프·QA 기록

## Source Lock

2026-09-04에 Notion `AI해커톤` 하위 최신 페이지를 다시 조회했다. 전부 `SCENARIO V4`이며 편집 메모는 런타임에서 제외한다.

| DAY | Page ID | 제목 |
|---:|---|---|
| 19 | `3c9c31f0-29a6-8126-8d1d-dd90f6b6d7f4` | 돈으로 사려던 시간 |
| 20 | `3c9c31f0-29a6-81b3-b82a-c4fbc39173e4` | 같은 집, 다른 하루 |
| 21 | `3c9c31f0-29a6-8138-9d37-e5b6c8b74a32` | 남겨 둔 자리 |
| 22 | `3c9c31f0-29a6-81f3-ba7f-eb07c6979d27` | 떠날 수 있는 사람 |
| 23 | `3c9c31f0-29a6-814b-b599-e8b6ed6f23a6` | 돌아갈 곳 |
| 24 | `3c9c31f0-29a6-811e-9af0-cedccb66d1cf` | 끝내지 못한 문장 |
| 25 | `3c9c31f0-29a6-81c0-93a3-d109c07f6995` | 좋아한다는 말 다음 |
| 26 | `3c9c31f0-29a6-815a-bd8b-cbd60569e6bf` | 사람들 앞의 우리 |
| 27 | `3c9c31f0-29a6-81fe-b0e1-df8c541775c9` | 되돌릴 수 없는 말 |
| 28 | `3c9c31f0-29a6-81ab-aeb5-f17aaa4072d8` | 다시 만나자는 뜻 |
| 29 | `3c9c31f0-29a6-8111-b76b-edb7bbadf790` | 내일도 내가 고를게 |
| 30 | `3c9c31f0-29a6-81bb-bbc1-c80179590cdd` | 오늘부터, 그다음 |

## 공통 Scene Graph

기존 저장 호환을 위해 3개의 선택 체크포인트와 4개의 재개 구간을 유지한다. 각 구간 안의 V4 장면들은 실제 대화·독백·비출력 행동으로 재구성한다.

```text
DAY START / 이전 경험 확인
→ V4 ACT 1 → CHOICE 1 (즉시 대사 + 당일 상태)
→ V4 ACT 2 → CHOICE 2 (당일 분기 + 관계 태도)
→ V4 ACT 3 → CHOICE 3 (미래 회수 기록)
→ V4 ACT 4 / 감정 잔상
→ DAY END → FREE ACTION(별도 상태) → SAVE → NEXT DAY
```

## 회차별 상태 계약

기존 플래그 이름은 이미 배포된 저장과의 호환 키다. 표시되는 V4 내용과 다른 옛 이름도 삭제·초기화하지 않고 호환 별칭으로 보존한다.

| DAY | INPUT | OUTPUT / HISTORY | 다음 연결 |
|---:|---|---|---|
| 19 | DAY18 완료, 관계·집·돈·실제 연락 이력 | `day19V4Choices`, DAY19 완료, 여행 범위/동행 태도 | DAY20 집에서 만날 현재 약속 |
| 20 | DAY19 실제 완료/초대 여부 | `day20V4Choices`, 함께/각자 머문 저녁 | DAY21 하은의 이야기 |
| 21 | DAY18~20 실제 경험 | `day21V4Choices`, 기다림을 들은 범위 | DAY22 함께 고친 여행 |
| 22 | 여행 동행·보류·거리 상태 | `day22V4Choices`, 계획 변경과 각자 시간 | DAY23 귀가와 다음 관계 |
| 23 | DAY22 실제 여행/각자 경로 | `day23V4Choices`, 귀가·안부·다음 만남 | DAY24 남은 문장 |
| 24 | 실제 남은 상대/약속/관계 상태 | `day24V4Choices`, 전달·유보·종료한 말 | DAY25 미래 대화 가능성 |
| 25 | DAY24 대답과 현재 관계 | `day25V4Choices`, 집·시간·돈·거리의 생활 조건 | DAY26 공개 범위 |
| 26 | 실제 관계 이름과 만난 사람 | `day26V4Choices`, 타인 앞에서 각자의 발언권 | DAY27 정정·사과 |
| 27 | DAY26에서 실제로 앞선/삼킨 말 | `day27V4Choices`, 부탁·정정·대답의 속도 | DAY28 재회 여부 |
| 28 | DAY27의 이별/거리/계속 상태 | `day28V4Choices`, 새 거리와 다음 만남 | DAY29 현재 선택 |
| 29 | DAY1~28의 실제 기록 | `day29V4Choices`, 내일 재선택 약속 | DAY30 오늘의 답 |
| 30 | DAY1~29 `storyHistory`, 현재 관계·몸·미해결 말 | `day30V4Choices`, DAY30/캠페인 완료 | ENDING |

## 출력·저장 규칙

- V4의 대화는 `dialogue`, 주인공의 내면은 `monologue`로만 표시한다.
- 행동과 배경 설명은 `stageAction`이며 대화창에 표시하지 않는다.
- 기존 요약형 `narration`은 DAY 19~30 표시 시 제거한다.
- 화면 선택 문구는 Notion V4의 실제 선택 문구를 사용하되 기존 choice ID를 유지한다.
- 선택은 `dayNV4Choices`에 `{stage, choiceId}`로 중복 없이 누적되어 저장/복원된다.
- 이전 사건 회상은 해당 `storyHistory.sceneId`가 실제 존재할 때만 추가한다.

## QA Gate

자동 검사는 DAY 19~30 각 구간에 실제 대화 5개 이상, 요약 narration 0개, 비출력 연출 격리, 원본 제목·선택 문구, DAY END 순서, 선택 기록 직렬화를 확인한다. 브라우저 검사는 선택 UI와 Free Action의 배타성, 콘솔 오류, 대사 잘림, 다음 DAY 진입을 별도로 확인한다.

## 2026-09-04 실행 결과

```text
Scenario Fidelity       FAIL — 원본 다수 장면과 대체 경로 누락
Dialogue Quality        NOT VERIFIED — 대사 개수는 원본 충실도 증거가 아님
Gameplay                FAIL — 회차당 4구간·3선택 축약
Choices                 FAIL — 표시 문구와 기존 choice ID의 의미 불일치
Flags                   FAIL — 기존 집안일 등의 상태 변화가 새 문구에 연결됨
Story History           FAIL — 실제 경험에 따른 분기 검증 부족
Save                    PARTIAL — JSON 복원 검사만 수행
Load                    PARTIAL — 경로별 실제 UI 재개 검증 필요
UI                      PARTIAL — DAY19/30 일부 선택창만 확인
Day Transition          PARTIAL — 기존 골격 이동 검사만 수행
Regression              PARTIAL — 기존 자동 테스트 통과가 원본 완성을 증명하지 않음
Runtime Text Audit      PARTIAL — 출력 문자열 검사 범위에 한정
```

- Friendly / Neutral / Distant / Mixed DAY 19→30 자동 플레이 및 매 선택 JSON 저장·복원: PASS
- DAY 19 실제 브라우저: V4 첫 선택과 두 번째 선택 도달, 기존 집안일 체크리스트 문구 0, Free Action 난입 0, console warning/error 0
- DAY 30 실제 브라우저: V4 세 선택 도달, 마지막 대사 뒤 DAY END, 이후에만 Free Action 표시, console warning/error 0
- `npm test`: PASS
- `npm run check`: PASS
- `node --test tests/*.test.mjs`: 387/387 PASS
- `git diff --check`: 오류 없음(Windows 줄바꿈 안내만 존재)
