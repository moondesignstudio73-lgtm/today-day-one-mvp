# DAY 16 V4 상태·지식·V1 레거시 라우팅 계약

상태: `CONTRACT PASS · FAIL-CLOSED`

## 라우팅 진리표

| 저장 상태 | 판정 | 동작 |
|---|---|---|
| 유효한 `day16V4*`만 존재 | `V4` | 체크포인트와 선택 이력을 그대로 복원 |
| 의미 있는 V1 흔적만 존재 | `V1_LEGACY` | 기존 V1을 수정 없이 복원 |
| V1과 V4 흔적이 함께 존재 | `BLOCKED_CORRUPT` | 추정 병합·이주 없이 중단 |
| 일부 `day16V4*`만 존재하거나 enum/함의가 깨짐 | `BLOCKED_CORRUPT` | 기본값으로 덮지 않고 중단 |
| 흔적 없음 + DAY 15 V4 완료 + 지훈 훅 대기 | `V4_NEW` | V4 초기 상태를 한 번만 생성 |
| 그 외 | `BLOCKED_PREREQUISITE` | 진입하지 않음 |

V1 흔적은 `day16RuntimeStage > 0`, `day16ContactStrategy`, `day16MeetingStrategy`, `day16SharingStrategy`, `day16CurrentSocialCirclePending === true`, `day16CurrentSocialCircleCompleted === true` 중 하나다. 이 값에서 V4 선택을 역산하지 않는다.

## V4 저장 축

- 정체성·진행: `day16V4Version`, `day16V4ScenarioId`, `day16V4RuntimeStage`, `day16V4SceneCheckpoint`(1~24), `day16V4ChoiceIndex`(0~12), `day16V4SelectedChoiceIds`, `day16V4Completed`.
- 경로: `day16V4DayRoute` = `JIHOON_CAFE | SOLO_CAFE | HOME`, `day16V4MorningContact`, `day16V4JihoonPresent`.
- 유리 대면: `day16V4YuriEncountered`, `day16V4YuriNameKnown`, `day16V4ConversationDepth`, `day16V4DifferentStartingPointAcknowledged`.
- 현재 관계·동의: `day16V4HaeunRelationshipDisclosure`, `day16V4YuriContact`, `day16V4YuriInvitation`, `day16V4FinalHaeunUpdate`.
- 저녁·지식: `day16V4EveningDisclosure`, `day16V4HaeunYuriKnowledge`, `day16V4IntentToYuri`.
- 출처: `day16V4YuriIdentitySource`, `day16V4YuriWorkSource`, `day16V4JihoonYuriKnowledgeSource`, `day16V4BreakupCauseStatus`.
- 안전·연속성: `day16V4GenericYuriEventSuppressed`, `day16V4Day17BodyHookPending`.

초기값은 `runtimeStage=0`, `sceneCheckpoint=1`, `choiceIndex=0`, 빈 선택 이력, `completed=false`다. 아직 고르지 않은 경로·아침 연락은 `null`; 발생 여부는 `false`; 대화 깊이는 `NONE`; 비적용 동의/설명 축은 `NOT_APPLICABLE`; 미확인 지식은 `UNKNOWN`; 초대는 `NONE`이다. enum의 실행 정본은 `src/day16-v4-state-contract.mjs`이며 이 문서는 의미 계약이다. 알 수 없는 추가 `day16V4*` 키는 보존하되 정본 필드를 대신하지 못하고, 정본 필드 일부만 있는 저장은 corrupt다.

## 불변식

1. `HOME`이면 유리 대면·이름·직업·연락·초대는 모두 발생하지 않고 관련 지식 출처는 `UNKNOWN`이다.
2. `JIHOON_CAFE`일 때만 `day16V4JihoonPresent === true`; 그때도 지훈 지식은 원고 범위를 넘지 않는다.
3. 유리 이름/직업 지식은 유리가 직접 말한 경우에만 `DIRECTLY_TOLD_BY_YURI`다.
4. 대화 거절 경로는 선택 4~7을 기록하지 않고 깊이를 `GREETING_ONLY`로 고정한다.
5. `day16V4YuriContact === SHARED`가 아니면 유리 초대는 `NONE`이며 선택 11~12가 없다.
6. `day16V4YuriInvitation`의 `ACCEPT_INTENT | ANSWER_TOMORROW`만 선택 12를 열 수 있다. 선택 10의 `day16V4IntentToYuri`와 다른 축이며, DAY 18 확정이 아니다.
7. 하은의 지식은 주인공이 실제 공개한 범위를 넘지 않는다. `OMITTED_YURI`는 유리 지식을 생성하지 않는다.
8. 이별 원인 상태는 항상 `UNKNOWN`이다.
9. V4가 진행되는 동안 공용 전 연인 재회 이벤트 억제는 true다.
10. 완료 상태는 장면 24, DAY 17 몸 훅 true, DAY 15 지훈 훅 소비를 요구한다.

유리 대면 전에는 이름·직업 출처, 대화 깊이, 연락·초대, 서로 다른 출발점 인식이 모두 초기값이어야 한다. 유리 대면은 카페 두 경로에서만 가능하다. 하은의 유리 지식은 `DISCLOSED_YURI`에서만 `UNKNOWN`보다 높아질 수 있고, 지훈에게 들은 유리 지식 출처는 지훈 동석 경로에서만 기록한다.

## 선택 활성화

- 항상: 1, 2, 8, 9.
- 카페: 3. 대화 수락 뒤: 4~7.
- 하은에게 유리 만남을 공개: 10.
- 연락 동의 성립: 11.
- 모레 제안 수락 의향/내일 답: 12.

선택 이력은 실제 활성 선택만 오름차순으로 저장한다. 비활성 번호의 mirror 필드는 없어야 하며, 선택 8의 외출/집 변형은 같은 번호로 서로 배타적이다.

## 쓰기 권한과 인접 DAY

- DAY 16 V4만 `day16V4*`를 쓴다. V1은 기존 필드만 쓴다.
- DAY 16 시작은 DAY 15의 `day16JihoonContactHookPending`을 즉시 지우지 않는다. V4 완료 때 소비한다.
- DAY 16 완료는 `day16V4Day17BodyHookPending = true`만 보장한다. DAY 17 구현은 이번 범위에서 시작하지 않는다.
- DAY 18 식사 확정 플래그는 DAY 16이 쓰지 않는다. 제안/응답만 저장한다.
- 서진 관련 기존 수치·상태는 읽거나 변경하지 않는다.

미완료 V4는 `day16JihoonContactHookPending=true`, `day16V4Day17BodyHookPending=false`를 유지한다. 완료 전 훅 소비나 DAY 17 훅 조기 생성은 corrupt다. 완료 상태는 해당 경로에서 활성인 모든 필수 선택을 갖춰야 한다. 집은 1·2·8·9, 카페는 1·2·3·8·9에 실제 대화·공개·연락·초대 상태가 활성화한 4~7·10~12를 정확히 더한다.

이 파일과 상태 모듈은 저장 골격만 잠근다. 정확한 체크포인트별 선택 시점, 건너뛰기 전이, DAY 15 상태별 아침 문장 자격은 다음 원문 레지스트리·resolver 관문 전에는 플레이 코드로 연결하지 않는다.
