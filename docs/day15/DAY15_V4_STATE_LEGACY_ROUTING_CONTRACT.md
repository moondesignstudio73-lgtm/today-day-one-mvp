# DAY 15 V4 상태·V1 레거시 라우팅 계약

상태: `STATE/ROUTING CONTRACT PASS · EXECUTABLE BASE VALIDATOR PASS · ROUTE RUNTIME PENDING`

이 문서는 DAY15 신규 V4 진행과 기존 V1 저장을 한 세션으로 섞지 않기 위한 구현 계약이다. 실제 상수·기본값·검증 함수는 다음 코드 관문에서 `src/day15-v4-state-contract.mjs`와 `src/day15-v4-campaign-data.mjs`에 한 번만 선언한다.

## 호환 모드 진리표

판정 우선순위는 V4 명시 버전 → V1의 의미 있는 진행 흔적 → V4 신규 선행 조건 → 차단이다. V1과 V4가 모두 실제 진행된 모순 저장은 어느 쪽도 덮어쓰지 않는다.

| 저장 상태 | 모드 | 동작 |
|---|---|---|
| `day15V4Version === "NOTION_V4"`, V1 실제 선택·완료 흔적 없음 | `V4` | V4 체크포인트와 선택 ID로 복원 |
| V4 버전과 V1 실제 선택·완료 흔적이 함께 있음 | `BLOCKED_CORRUPT` | 자동 병합·추정 변환 금지, 원본 저장 보존 |
| `day15RuntimeStage > 0`, V1 전략 하나 이상, `day15CurrentLeisureDateCompleted === true`, 또는 `day15CurrentLeisureDatePending === true` | `V1_LEGACY` | 기존 `m30-day15-current-leisure-date` 런타임으로 복원 |
| DAY15 흔적 없음 + DAY14 V4 완료 + `day15GalleryPlanPending === true` | `V4_NEW` | DAY14 실제 초대 상태를 복사하지 않고 입력으로 읽어 V4 초기화 |
| DAY15 흔적 없음 + DAY14 V4 미완료 또는 갤러리 계획 없음 | `BLOCKED_PREREQUISITE` | DAY14 결과를 추정하지 않고 진입 차단 |
| V4 버전은 있으나 필수 배열·체크포인트·함의 관계가 깨짐 | `BLOCKED_CORRUPT` | 자동 보간·초기화 금지 |

버전 없는 V1이라도 `day15CurrentLeisureDatePending === true`이면 과거 DAY14에서 이미 열린 V1 경로로 복원한다. V1 완료 저장은 나중에 DAY14 V4 필드가 추가되어도 V4로 재해석하지 않는다. 단순 기본값 `day15RuntimeStage === 0` 하나만으로는 V1 진입 흔적으로 보지 않는다.

## V4 식별·체크포인트

| 필드 | 타입·기본값 | 계약 |
|---|---|---|
| `day15V4Version` | `"NOTION_V4"` | 신규 V4 시작 시 한 번 설정 |
| `day15V4ScenarioId` | `"m30-day15-facing-the-light-v4"` | 다른 DAY15 세션과 구분 |
| `day15V4RuntimeStage` | integer `0` | UI 구간 표시용 파생 값 |
| `day15V4SceneCheckpoint` | integer `1` | 다음 재생 장면, `1..24` 또는 완료 뒤 `24` |
| `day15V4ChoiceIndex` | integer `0` | 처리한 마지막 선택 번호, `0..12` |
| `day15V4SelectedChoiceIds` | `string[]` 빈 배열 | 선택 이력 정본. 같은 번호의 참석/불참 대체 선택 중 정확히 하나만 허용 |
| `day15V4Completed` | boolean `false` | 모든 활성 선택과 마감 상태가 유효할 때만 true |

복원은 `selectedChoiceIds`를 번호별 허용 ID 집합에 대조한다. `choiceIndex`는 배열에서 처리된 가장 높은 선택 번호와 같아야 하고 체크포인트는 그 선택의 합류 장면과 일치해야 한다. 세 값이 어긋나면 자동으로 누락 선택을 추가하거나 장면을 건너뛰지 않고 `BLOCKED_CORRUPT`로 반환한다.

## 경로 상태

미경험·미결정은 `null`, 확인된 부정은 `false`, 확인된 긍정은 `true`다. enum의 `UNKNOWN`은 등장인물이 실제로 모름을 확인한 지식 상태이며 단순 필드 누락을 대신하지 않는다.

| 필드 | 허용 값 |
|---|---|
| `day15V4GalleryInvitation` | `INVITED | NOT_INVITED` |
| `day15V4AttendanceRoute` | `ATTEND | OWN_AFTERNOON` |
| `day15V4OwnAfternoonRead` | `REREAD | SKIP | STOP | null` |
| `day15V4OwnAfternoonReflection` | `QUESTION | WRITE | REST | null` |
| `day15V4OwnAfternoonClose` | `CONTINUE | GET_AIR | EAT | null` |
| `day15V4HaeunContactRoute` | `IN_PERSON | PHONE | NO_CONTACT` |
| `day15V4RestDecision` | `SEPARATE | TOGETHER | LEAVE | null` |
| `day15V4CafeRoute` | `INNER | WINDOW | GO_HOME | NOT_APPLICABLE | null` |
| `day15V4ConflictStrategy` | `JEALOUSY | INSECURITY | CONTROL | NOT_APPLICABLE | null` |
| `day15V4GalleryUnderstandingStrategy` | `ASK | OBSERVE | PRETEND | NOT_APPLICABLE | null` |
| `day15V4HaeunViewingStrategy` | `ASK_PREFERENCE | SHARE_PERCEPTION | COMPARE_WITH_SIWOO | NOT_APPLICABLE | null` |
| `day15V4OutfitStrategy` | `COMFORT | FOR_HAEUN | ADMIT_SELF_CONSCIOUS | null` |
| `day15V4ReciprocityStrategy` | `OWN_DOUBLE_STANDARD | ADMIT_FEAR | ASK_TIME | NOT_APPLICABLE | null` |
| `day15V4ControlContinued` | `boolean|null` |
| `day15V4HaeunLeft` | `boolean|null` |
| `day15V4BoundaryResolved` | `boolean|null` |
| `day15V4CurrentPerception` | `WAVERING_LINE | NOT_SURE | REVISIT | null` |
| `day15V4ClosingStrategy` | `LISTEN | APOLOGIZE | THINK_LATER | null` |
| `day15V4ReturnWalk` | `CLOSE_PACE | DISTANT_PACE | SEPARATE_HOMES | NOT_APPLICABLE | null` |

`INVITED`만 `ATTEND`를 허용한다. `NOT_INVITED`는 `OWN_AFTERNOON`으로 고정하며 주인공이 갤러리에 우연히 나타나는 전이는 없다. `OWN_AFTERNOON`에서는 선택 3~5의 세 자기 오후 필드가 필수이고 갤러리 감상·카페 갈등 필드는 `NOT_APPLICABLE` 또는 `null` 계약에 맞아야 한다.

## 선택 활성화·전이 정본

`selectedChoiceIds`에는 실제로 화면에 노출되어 처리된 선택만 들어간다. 모든 경로에서 12개를 억지로 채우지 않는다. `activeChoiceNumbers`는 아래 술어로 다시 계산하며 저장하지 않는다. 완료는 이 계산 결과와 선택 이력의 번호 집합이 정확히 같을 때만 가능하다.

| 번호 | 활성화 술어 | 허용 ID → 핵심 쓰기 | 처리 뒤 체크포인트 | 완료 집계 |
|---:|---|---|---:|---|
| 1 | 모든 V4 경로 | `day15_v4_invitation_attend` → `ATTEND`(초대 있을 때만), `day15_v4_invitation_own_time` → `OWN_AFTERNOON`, `day15_v4_invitation_admit_tension` → 초대에 따라 경로 결정·긴장 true, `day15_v4_invitation_no_invite` → `OWN_AFTERNOON` | 2 | 항상 |
| 2 | 모든 V4 경로 | `day15_v4_outfit_comfort|for_haeun|admit_self_conscious` → `day15V4OutfitStrategy`. 불참·재택도 편한 외출복 또는 셔츠를 다시 거는 원고 반응을 실행 | 3 | 항상 |
| 3 | `ATTEND` 또는 `OWN_AFTERNOON` 대체 | 참석 `ask|observe|pretend` → `day15V4GalleryUnderstandingStrategy`; 불참 `reread|skip|stop` → `day15V4OwnAfternoonRead` | 참석 5, 불참 6 | 항상, 경로별 정확히 하나 |
| 4 | `ATTEND` 또는 `OWN_AFTERNOON` 대체 | 참석 `ask_preference|share_perception|compare_with_siwoo` → `day15V4HaeunViewingStrategy`; 불참 `question|write|rest` → `day15V4OwnAfternoonReflection` | 참석 8, 불참 6 | 항상, 경로별 정확히 하나 |
| 5 | `ATTEND` 또는 `OWN_AFTERNOON` 대체 | 참석 `separate|together|leave` → `day15V4RestDecision`; 불참 `continue|get_air|eat` → `day15V4OwnAfternoonClose` | 참석 10, 불참 18 | 항상, 경로별 정확히 하나 |
| 6 | `ATTEND`이고 하은과 현장 뒤 대화 가능 | `inner|window|go_home` → `day15V4CafeRoute`; `go_home`은 합의된 통화가 있으면 PHONE, 아니면 NO_CONTACT | 12 또는 18/19 | 조건부 |
| 7 | 하은과 갈등 대화가 실제 시작됨: `IN_PERSON` 또는 `PHONE` | `jealousy|insecurity|control` → `day15V4ConflictStrategy`; control은 요구를 기록하되 아직 지속 확정 아님 | 13 | 조건부 |
| 8 | 선택 7 처리 및 대화 지속 | `own_double_standard|admit_fear|ask_time` → `day15V4ReciprocityStrategy`; 실제 선행이 없으면 첫 ID를 숨기고 `admit_fear|ask_time`만 허용 | 16 | 조건부 |
| 9 | 선택 7이 `CONTROL`이거나 경계 대화가 계속됨 | `ask_haeun|admit_insecurity|continue_control` → 경계 해결 또는 통제 지속·하은 이탈 | 17 또는 19 | 조건부 |
| 10 | `ATTEND && !HaeunLeft`이고 두 사람이 작품 감상을 다시 나눔 | `wavering_line|not_sure|revisit` → `day15V4CurrentPerception` | 20 | 조건부 |
| 11 | 대면·통화의 실제 마감 대화가 있음 | `listen|apologize|think_later` → `day15V4ClosingStrategy`; `apologize`는 실제 급한 말·통제 행동이 있을 때만 노출 | 22 | 조건부 |
| 12 | `day15V4PublicMaterialOffered === true` | `request_public|haeun_thought_first|read_tomorrow` → 수락·열람 상태. 하은의 "공개 설명 링크가 있다"는 자발적 메시지가 먼저 offered를 참으로 만들며, 첫 선택은 그 제안을 수락해 공개 자료를 요청한다 | 23 | 조건부 |

번호를 건너뛴 경우 `choiceIndex`는 마지막으로 처리한 번호이며, 다음 활성 선택 번호는 정본 표로 계산한다. 무연락 자기 오후는 선택 1~5만 처리하고 SCENE 19→23→24로 완료한다. 불참+통화는 1~5, 7~9, 11과 하은의 실제 자료 제안이 있을 때만 12를 처리한다. 참석+정상 대화는 1~11과 실제 자료 제안 시 12를 처리한다. 하은 이탈은 선택 10과 접촉을 생략하며 이후 실제 연락이 없으면 11~12도 생략한다.

SCENE 24를 재생하기 전 체크포인트 24는 `completed=false`일 수 있고, SCENE 24와 마감 훅을 모두 적용한 뒤 같은 체크포인트에서 `completed=true`가 된다. 복원기는 이 boolean으로 장면 재생 전·완료를 구분한다.

## 선행 콜백과 사실 출처

DAY14 콜백은 다음 우선순위로 계산해 한 값만 저장한다.

1. `day14V4MeetingProposal === "SHOW_PREPARED"` 또는 `day14V4UnresolvedContactBoundary === true`면 `PRESSURED`.
2. `day14V4InteractionRoute === "IN_PERSON"` 또는 `"PHONE"`이고 압박이 아니면 `TALKED_TOGETHER`.
3. `day14V4InteractionRoute === "FULL_REST"`면 `RESTED_SEPARATELY`.
4. 그 밖은 선행 상태 손상으로 차단한다.

`day15V4Day14CallbackRoute` 허용 값은 `TALKED_TOGETHER | RESTED_SEPARATELY | PRESSURED`다. 꽃 구매·소유·나리 만남을 이 콜백에서 새로 추정하지 않는다.

윤서진 콜백 자격은 `day12V3PersonalInvitation === true`일 때만 참이다. 공개 내용은 `day12V3HaeunFinalDisclosure`와 `day12V3DisclosureMismatch`를 함께 읽어 이미 말한 사실·남은 사실을 구분한다. `seojinAffection`과 `seojinStatusInterest`는 스냅샷 비교로 불변을 검증하며 합산하지 않는다.

아라 콜백 자격은 `day13V3AraMet === true`이고, 개인 관심/이어짐은 `day13V3AraContinuation === "ASK_PHOTO_CONTACT"` 또는 `day13V3PhotoContact === "OCCASIONAL_EXCHANGE"`가 실제일 때만 참이다. `day13V3HaeunReport`, `day13V3HaeunDisclosureMismatch`, `day13V3HaeunNeedsSpace`를 함께 읽어 공개 상태를 발명하지 않는다.

## 지식 장부

각 사실은 다음 출처 enum을 독립 저장한다.

`DIRECTLY_OBSERVED | TOLD_BY_HAEUN | PRIOR_DAY11 | UNKNOWN`

| 필드 | 참석 | 불참+통화 | 불참+무연락 |
|---|---|---|---|
| `day15V4SiwooNameSource` | `PRIOR_DAY11` 또는 `DIRECTLY_OBSERVED` | 하은이 말한 경우만 `TOLD_BY_HAEUN`, 아니면 `PRIOR_DAY11`/`UNKNOWN` | `PRIOR_DAY11` 또는 `UNKNOWN` |
| `day15V4SiwooAppearanceSource` | `DIRECTLY_OBSERVED` | 하은이 자발적으로 말해도 외모 세부는 생성하지 않고 `UNKNOWN` | `UNKNOWN` |
| `day15V4SiwooRoleSource` | `DIRECTLY_OBSERVED` | 하은이 말한 경우만 `TOLD_BY_HAEUN` | `UNKNOWN` |
| `day15V4SiwooProfessionalBehaviorSource` | `DIRECTLY_OBSERVED` | 하은이 말한 범위만 `TOLD_BY_HAEUN` | `UNKNOWN` |
| `day15V4SiwooDirectionMistakeSource` | `DIRECTLY_OBSERVED` | 하은이 실제로 말한 경우만 `TOLD_BY_HAEUN` | `UNKNOWN` |
| `day15V4ArtworkDiscussionSource` | `DIRECTLY_OBSERVED` | 하은이 공유한 자기 감상만 `TOLD_BY_HAEUN` | `UNKNOWN` |
| `day15V4LastTimePhraseSource` | `DIRECTLY_OBSERVED` | 하은이 실제로 전한 경우만 `TOLD_BY_HAEUN` | `UNKNOWN` |

`OWN_AFTERNOON + NO_CONTACT`이면 직접 관찰 출처가 하나라도 존재할 수 없다. 참석 뒤 카페·전화 대화 없이 귀가한 `ATTEND + NO_CONTACT`는 갤러리에서 직접 본 사실을 보존한다. 불참 경로의 `TOLD_BY_HAEUN`은 전화 장면에서 실제로 말한 항목만 쓴다. 사적 메시지·작품 세부는 장부 항목이 아니다.

## 관계·접촉·자료 상태

| 필드 | 타입·규칙 |
|---|---|
| `day15V4ShoulderContactEligible` | 저장하지 않고 복원 시 계산: (`day14V4HandContactEstablished === true` 또는 `day7V3HandContactEstablished === true`) && `day13V3HaeunDisclosureMismatch !== true` && `day13V3HaeunNeedsSpace !== true` && `day15V4BoundaryResolved === true` && `day15V4HaeunLeft !== true` && `day15V4ReturnWalk === "CLOSE_PACE"` |
| `day15V4ShoulderContactOccurred` | boolean `false`; 계산된 자격이 참이고 실제 접촉 장면을 지난 경우만 true |
| `day15V4PublicMaterialOffered` | boolean `false`; 하은이 직접 제안한 경우만 true |
| `day15V4PublicMaterialAccepted` | boolean `false`; offered가 true인 상태에서만 true |
| `day15V4PublicMaterialRead` | boolean `false`; accepted가 true인 상태에서만 true. 내일 읽기는 accepted true/read false이며 패널티 없음 |
| `day15V4JihoonMessagePending` | boolean `false`; 마지막 메시지를 받은 완료 경로에서 true |
| `day16JihoonContactHookPending` | boolean `false`; 메시지 수신 뒤 답장·연락 가능성만 저장, 약속이나 만남 확정 의미 아님 |

필수 함의는 `shoulderContactOccurred → eligible`, `publicMaterialRead → accepted → offered`, `haeunLeft → !shoulderContactOccurred`, `controlContinued → !boundaryResolved`, `OWN_AFTERNOON + NO_CONTACT → 직접 관찰 출처 없음`이다. 위반은 `BLOCKED_CORRUPT`다.

## 완료와 후속 훅

V4 완료는 위 표로 계산한 활성 선택을 모두 처리하고, 선택하지 않은 경로의 사실이 생성되지 않았으며, 마지막 메시지의 잠정성을 보존할 때만 설정한다. 완료 시 `day15GalleryPlanPending=false`, `day15V4Completed=true`, `day15V4SceneCheckpoint=24`, `day15V4JihoonMessagePending=true`, `day16JihoonContactHookPending=true`로 전환한다. 기존 V1의 `day16CurrentSocialCirclePending`은 V4에서 읽거나 덮어쓰지 않는다.

V1 런타임은 기존 필드와 기존 장면 ID를 그대로 사용한다. V4 초기화·복원은 V1 전략, V1 완료, 기존 DAY16 훅을 삭제·변환하지 않는다. V1/V4 모순 저장은 사용자 데이터 보존을 우선해 차단 결과만 반환한다.

## 구현·테스트 필수 사례

1. 초대 참석 신규 저장이 V4로 시작하고 직접 관찰 장부를 쓴다.
2. 초대 없음 신규 저장이 자기 오후로 시작하며 갤러리 직접 지식이 0이다.
3. 불참+통화는 하은이 실제로 말한 항목만 `TOLD_BY_HAEUN`으로 복원한다.
4. 불참+무연락은 시우 외모·역할·전문 행동·현장 대화가 `UNKNOWN`이다.
5. 통제 지속은 하은 이탈·경계 미해결·접촉 false로 복원된다.
6. 경계 해결 고관계라도 선행 접촉이나 하은의 가까운 귀가 선택이 없으면 접촉하지 않는다.
7. 공개 자료 미제안·제안 후 미수락·수락 후 미열람·열람 완료가 각각 복원된다.
8. 윤서진 제안과 아라 이어짐이 없으면 선택 8의 관련 콜백이 노출되지 않는다.
9. `seojinAffection`과 `seojinStatusInterest`가 모든 DAY15 선택 전후 동일하다.
10. V1 진행·완료 저장은 기존 V1로 복원되고 V4 필드가 생성되지 않는다.
11. V1/V4 동시 진행 흔적과 선택 ID/인덱스/체크포인트 불일치는 차단되며 원본 저장이 바뀌지 않는다.
12. 모든 정상 완료 경로는 지훈 메시지를 잠정 훅으로 저장하고 DAY16 만남을 확정하지 않는다.

다음 관문은 이 계약을 실행 가능한 데이터·상태 해석기·집중 테스트로 옮기고, Notion SCENE 01~24와 선택 1~12를 플레이 데이터에 완전 구현하는 일이다.
