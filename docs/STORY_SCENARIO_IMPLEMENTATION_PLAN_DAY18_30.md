# 《오늘부터 1일》 DAY 18~30 시나리오 구현 개발 계획안

## 1. 목적

DAY 18부터 DAY 30까지의 스토리는 단순히 시나리오 문장을 순서대로 보여 주는 방식으로 구현하지 않는다.

각 DAY는 다음 네 층을 모두 갖춘 하나의 플레이 가능한 생활 단위로 만든다.

1. 전날의 실제 선택을 기억한다.
2. 오늘의 대사·행동·장소를 그 기억에 맞게 바꾼다.
3. 플레이어가 오늘의 선택과 행동을 직접 수행한다.
4. 오늘의 결과를 저장해 다음 DAY가 정확히 이어받는다.

기본 흐름은 다음과 같다.

```text
PREVIOUS DAY SNAPSHOT
→ DAY ENTRY
→ STORY SCENE
→ CHOICE / MOVE / EXPLORE / CONTACT
→ CONDITIONAL EVENT
→ OPTIONAL FREE ACTION
→ EVENING RESOLUTION
→ DAY RESULT
→ SAVE
→ NEXT DAY ELIGIBILITY CHECK
```

## 2. DAY 13~17 비교에서 확정한 구현 원칙

### 2.1 원문과 실행 코드를 분리한다

시나리오 원문을 바로 `game.js`나 하나의 브리지 파일 안에 요약해 넣지 않는다.

```text
Notion 원문
→ Source Lock
→ Exact Source Registry
→ Branch Resolver
→ Atomic State Runtime
→ Presentation Adapter
→ game.js
```

각 층의 책임은 섞지 않는다.

- Source Lock: 어느 원고를 구현하는지 고정한다.
- Exact Source Registry: 원문 대사·내레이션·선택 문구를 보존한다.
- Branch Resolver: 현재 저장 상태에서 재생할 대안 하나만 고른다.
- State Runtime: 선택의 허용 여부와 상태 변경만 담당한다.
- Presentation Adapter: 배경·인물·표정·BGM·SFX·CG를 결합한다.
- Game Bridge: 게임 UI에 진입·재개·선택·완료를 연결한다.

### 2.2 대표 문장만 남기는 압축 구현을 금지한다

다음 구현은 완료로 인정하지 않는다.

```text
원문 24 Scene
→ 실행 코드에서는 6개 묶음
→ 핵심 대사 몇 줄만 출력
```

Scene 수가 맞더라도 원문의 행동, 대화 리듬, 농담, 망설임, 선택 직후 반응이 빠지면 실패다.

### 2.3 경로 사실을 끝까지 보존한다

플레이어가 하지 않은 행동을 이후 대사가 했다고 말하면 안 된다.

예:

- 산책 경로에서 헬스장 담당자가 답하지 않는다.
- 집에서 쉰 경로에서 “운동하고 왔다”고 말하지 않는다.
- 만나지 않은 NPC가 메시지를 보내지 않는다.
- 보지 못한 장면을 다른 인물이 함께 기억하지 않는다.
- 동의하지 않은 접촉이나 약속을 자동 생성하지 않는다.

이를 `route truth` 불변식으로 정의하고 자동 테스트한다.

### 2.4 선택지는 현재 상태에서 가능한 것만 보여 준다

원문에 선택지 네 개가 있어도 현재 경로에서 가능한 것이 하나라면 하나만 출력한다. 불가능한 선택을 보여 준 뒤 내부에서 무시하는 방식은 사용하지 않는다.

### 2.5 완료와 다음 DAY 진입을 분리한다

마지막 대사를 봤다는 이유만으로 완료 처리하지 않는다.

```text
final scene reached
AND all required choices resolved
AND state validated
AND save succeeded
AND next DAY prerequisite exists
= DAY COMPLETE
```

## 3. 표준 파일 구조

새 DAY 작업 전에 `STORY RUNTIME CONTENT AUDIT`가 반드시 PASS여야 한다. FAIL이면 아래 표준 구조를 만들기 시작하지 않는다.

### 플레이어 출력 타입 계약

대화창 Renderer가 받을 수 있는 타입은 다음 네 개뿐이다.

```text
dialogue
message
monologue
narration (짧은 player-facing narration만)
```

다음 타입은 실행·상태·편집 계층에만 존재하며 대화창으로 보내지 않는다.

```text
stage / stageAction / stageDirection
section / metadata
designNote / devNote / continuityNote
implementationNote / testNote
flag / stateMutation
choiceCue / sceneBoundary
```

Markdown이나 플레이 대본을 변환할 때 알 수 없는 타입을 `narration`으로 폴백하지 않는다. 알 수 없는 타입은 `metadata`로 격리하고 테스트를 실패시킨다. 행동 문장은 `stageAction`으로 보존하며, 실제 연출이 연결되지 않았다면 화면에 글로 대신 출력하지 않는다.

DAY 18을 예로 들면 다음 구조를 기본으로 한다.

```text
docs/day18/
  DAY18_NOTION_SOURCE_LOCK_V4.md
  DAY18_IMPLEMENTATION_GAP_AUDIT.md
  DAY18_CHAPTER_CONTRACT_V4.md
  DAY18_SCENE_GRAPH_V4.md
  DAY18_ASSET_PRESENTATION_AUDIT.md
  DAY18_IMPLEMENTATION_REPORT.md

src/
  day18-v4-source-registry-01-12.mjs
  day18-v4-source-registry-13-24.mjs
  day18-v4-branch-resolver.mjs
  day18-v4-runtime.mjs
  day18-v4-choice-reactions.mjs
  day18-v4-immersive-adapter.mjs
  day18-v4-game-bridge.mjs

tests/
  day18-v4-source-registry.test.mjs
  day18-v4-branch-resolver.test.mjs
  day18-v4-runtime.test.mjs
  day18-v4-save-restore.test.mjs
  day18-v4-presentation.test.mjs
  day18-v4-game-integration.test.mjs
  day18-v4-browser-entry.html
```

Scene 수가 24가 아니면 원고의 실제 Scene 수에 맞춰 파일 구간을 조정한다. 숫자를 맞추기 위해 장면을 임의로 쪼개거나 합치지 않는다.

## 4. 단계별 개발 절차

각 단계는 독립된 관문이다. 앞 단계가 PASS하지 않으면 뒤 단계로 넘어가지 않는다.

### STEP 0 — 작업 범위 잠금

- 이번 사이클에서 구현할 DAY 하나만 선언한다.
- 다음 DAY 본문은 읽거나 구현하지 않는다.
- 현재 브랜치, 작업 트리, 대상 원격 저장소를 확인한다.
- 기존 사용자 변경과 해당 DAY 변경을 구분한다.
- 기존 DAY 1~현재 DAY의 `STORY RUNTIME CONTENT AUDIT`가 PASS인지 확인한다.
- 개발 문서형 문장이 하나라도 노출되면 신규 DAY 작업을 중단하고 기존 콘텐츠를 먼저 수정한다.

산출물:

```text
CURRENT TARGET: DAY 18
NEXT DAY: NOT STARTED
```

### STEP 1 — 권위 원문 재조회 및 Source Lock

- Notion 부모 페이지에서 해당 DAY 하위 페이지를 찾는다.
- 구현 직전에 전체 본문을 새로 조회한다.
- 제목, 페이지 ID, 마지막 수정 시각, 본문 길이, Scene 수, 선택 수를 기록한다.
- 첨부 파일, 이전 버전, 편집 메모를 현재 원문과 혼동하지 않는다.
- 원문을 정규화한 뒤 SHA-256을 기록한다.

PASS 조건:

- 전체 본문을 처음부터 끝까지 읽었다.
- Scene과 선택 개수가 원문과 일치한다.
- 최신 버전과 폐기된 버전이 구분됐다.
- Source Lock 문서가 생성됐다.

### STEP 2 — 직전 3개 DAY 연속성 감사

현재 DAY가 18이면 DAY 15, 16, 17과 DAY 18을 함께 비교한다.

확인 항목:

- 실제로 만난 NPC와 연락처 보유 여부
- 각 NPC가 알고 있는 정보
- 플레이어만 아는 정보
- 하은이 들은 설명과 실제 선택의 차이
- 전날 확정된 약속과 아직 제안 상태인 약속
- 장소 해금 여부
- 관계·접촉·연락 휴식 경계
- 미해결 복선과 다음 DAY 훅
- 최근 3일과 반복되는 장소·행동·농담·갈등 구조

산출물은 `INPUT MATRIX`로 작성한다.

```text
Previous flag | Possible values | DAY 18 effect | Forbidden assumption
```

### STEP 3 — 구현 격차 감사

현재 저장소의 기존 DAY 구현과 최신 원문을 비교한다.

각 항목을 다음 상태로 분류한다.

- `REUSE`: 그대로 재사용 가능
- `ADAPT`: 상태 조건을 추가해 재사용
- `REPLACE`: 축약·오류로 교체 필요
- `NEW`: 새 구현 필요
- `BLOCKED`: 외부 결정 또는 자산 필요

비교 대상:

- Scene
- 대사와 내레이션
- 선택 문구
- 선택 직후 반응
- 분기 진입·건너뛰기·합류
- 상태와 저장 키
- 배경·캐릭터·CG
- BGM·SFX·전환
- 자유행동과 상황 이벤트
- DAY 종료·다음 DAY 전환

### STEP 4 — Chapter Contract 작성

코드보다 먼저 해당 DAY의 계약을 고정한다.

필수 섹션:

```text
Metadata
Voice Profile
Knowledge Ledger
MUST REVEAL
MAY REVEAL
MUST NOT REVEAL
PLAYER MAY SUSPECT
Previous DAY callbacks
Choice contract
Scene beat contract
State budget
Save/restore contract
Next DAY hook
Completion predicate
```

관계 수치는 원문에 변화 근거가 있을 때만 수정한다. 대사가 다정하다는 이유만으로 호감·신뢰를 자동 증가시키지 않는다.

### STEP 5 — Scene Graph와 합류점 설계

모든 Scene을 다음 표로 만든다.

```text
Scene | Entry condition | Source section | Choice | Exit | Merge point | Checkpoint
```

반드시 표시할 것:

- 상호 배타 경로
- 조건부 생략 Scene
- 선택 직후 반응 Scene
- 다시 합쳐지는 Scene
- 합쳐지면 안 되는 경로
- 최종 Scene 도달 조건

`if` 문을 작성하기 전에 그래프만 읽고 모든 경로를 설명할 수 있어야 한다.

### STEP 6 — DAY State Contract와 지식 장부 구현

입력과 출력을 명시한다.

```text
DAY 18 INPUT
- DAY 17 route
- DAY 17 Haeun meeting
- DAY 17 Yuri tomorrow plan
- DAY 17 Haeun disclosure
- DAY 17 close rest

DAY 18 OUTPUT
- DAY 18 route
- DAY 18 decisions
- DAY 18 disclosures
- DAY 18 relationship boundary
- DAY 18 completion
- DAY 19 hook
```

플래그 이름은 의미를 드러내야 하며 `true/false`만으로 세 상태 이상을 표현하지 않는다.

예:

```javascript
day18YuriPlan: "MEET" | "DECLINED" | "NO_INVITE" | "UNSET"
```

### STEP 7 — 정확 원문 레지스트리 작성

- 원문 대사와 내레이션을 문장 단위로 보존한다.
- 선택 버튼 문구를 그대로 보존한다.
- 대체 경로는 모두 담되 어떤 경로가 활성인지는 여기서 결정하지 않는다.
- 원문에 없는 연결 대사를 편의상 만들지 않는다.
- 화자, Scene 번호, 장소, 원문 섹션 ID를 함께 저장한다.

레지스트리는 `verbatim route superset`이며 직접 재생하지 않는다.

PASS 조건:

- Scene 제목 누락 0
- 선택 문구 누락 0
- 핵심 대사 누락 0
- 화자 오인 0
- 원문 순서 변경 0
- Source Lock 해시와 대응 관계 기록

### STEP 8 — Branch Resolver 작성

Resolver는 저장 상태를 읽고 각 Scene에서 활성 원문 구간 하나만 반환한다.

책임:

- Scene 활성/비활성
- 경로별 대안 선택
- 현재 표시 가능한 선택지
- 진입 Scene과 다음 합류점
- NPC 지식과 연락 자격
- 접촉·약속·메시지 자격

금지:

- 상태 변경
- 관계 수치 변경
- 원문 재작성
- 없는 대사 생성

같은 저장 상태를 두 번 넣으면 항상 같은 결과가 나와야 한다.

### STEP 9 — 선택 Runtime 작성

각 선택은 원자적으로 처리한다.

```text
validate option
→ calculate patch
→ apply once
→ write choice history
→ advance checkpoint
→ expose next unresolved choice
```

검증 실패 시 상태는 한 글자도 바뀌면 안 된다.

필수 방어:

- 존재하지 않는 선택 ID
- 현재 경로에서 비활성인 선택
- 같은 선택 중복 적용
- 체크포인트 건너뛰기
- 완료 후 추가 선택
- 부분 저장에서 배열·플래그 불일치

### STEP 10 — 선택 직후 반응 연결

선택을 기록만 하고 다음 Scene으로 넘기지 않는다.

모든 선택에 대해 다음을 확인한다.

- 플레이어가 고른 말 또는 행동이 화면에 나타난다.
- 상대의 즉시 반응이 원문대로 나타난다.
- 단기 결과가 같은 DAY 안에서 회수된다.
- 장기 결과 플래그가 미래 DAY에 남는다.

반응형·단기 영향·장기 영향을 구분하되 하나의 선택이 복수 유형을 가질 수 있다.

### STEP 11 — 몰입형 Presentation Adapter 작성

원문과 상태가 완성된 뒤 연출을 붙인다.

Scene별 필수 매핑:

```text
background
character
outfit
expression
pose
character enter/exit
transition
bgm
ambient
sfx
cg
time slot
location
```

연출은 내용을 바꾸지 않는다. 조건부 접촉 Scene에 CG가 있다면 동일한 접촉 자격 조건을 사용한다.

### STEP 12 — 플레이 행동과 자유행동 연결

각 DAY에는 선택 버튼 외에 최소 하나의 실제 플레이 행동을 둔다.

가능한 행동:

- 장소 이동
- 휴대폰 문자·통화
- 물건 선택
- 탐색
- 일정 확인
- NPC 상호작용
- 제한된 자유행동

자유행동은 원문상 시간이 열린 구간에서만 허용한다. `STORY_DIALOGUE`, `STORY_CHOICE`, `CUTSCENE`, `DAY_RESULT` 중에는 일반 행동 메뉴를 숨긴다.

V4 챕터가 끝난 뒤 같은 DAY의 구버전 자유행동이 난입하지 않도록 버전과 완료 상태를 함께 검사한다.

### STEP 13 — Save/Load와 레거시 이행

저장 지점:

- DAY 진입 직후
- 각 선택 직전
- 선택 직후
- 분기 합류 직전
- 조건부 이벤트 직전
- 마지막 Scene 직전
- DAY 완료 직후

복원 시 이미 본 선택 반응을 다시 재생하지 않고, 정확히 다음 미해결 관문에서 시작한다.

구버전 저장은 다음 중 하나로 명시 처리한다.

- `V4_NEW`
- `V4`
- `V1_LEGACY`
- `BLOCKED_PREREQUISITE`

침묵 변환이나 추측성 마이그레이션은 금지한다.

### STEP 14 — 정적·단위·회귀 테스트

최소 테스트 묶음:

1. Source registry 완전성
2. 모든 경로 resolver
3. 모든 선택 ID 허용/거부
4. 선택 원자성·중복 방지
5. Scene 체크포인트
6. Save/Load JSON 왕복
7. 지식·연락·접촉·약속 경계
8. 자산 경로와 화면 매핑
9. 현재 DAY 완료와 다음 DAY 도달
10. 직전 3개 DAY 인접 회귀
11. DAY 1부터 현재 DAY까지 전체 회귀
12. 전체 30일 시뮬레이션

### STEP 15 — 실제 브라우저 플레이 QA

자동 테스트 통과만으로 완료하지 않는다.

필수 실제 플레이 경로:

- Friendly
- Neutral
- Negative 또는 Boundary
- Mixed
- 주요 NPC 만남 경로
- 주요 NPC 미만남 경로
- 연락처 있음/없음
- 핵심 약속 수락/거절/유보

원고 구조상 경로가 더 적으면 실제 상호 배타 경로를 전부 플레이한다.

각 경로에서 확인:

- 선택 문구와 즉시 반응
- 화자
- 장소·배경
- 캐릭터 등장/퇴장
- 겪지 않은 사건 언급 여부
- 저장 후 새로고침 복원
- 마지막 Scene과 DAY Result
- 다음 DAY 진입
- 브라우저 경고·오류

화면 크기:

- Desktop 1280×720 이상
- Mobile 390×844

모바일에서는 선택지 잘림, 대화창 스크롤, 안전 영역, 수평 오버플로를 검사한다.

### STEP 16 — 비교 냉독 QA

직전 3개 DAY와 현재 DAY를 다시 나란히 비교한다.

질문:

- 대사 밀도가 갑자기 낮아지지 않았는가?
- Scene을 몇 개의 요약 블록으로 압축하지 않았는가?
- 매일 같은 카페·전화·산책만 반복하지 않는가?
- 선택 후 상대 반응이 충분한가?
- 경로별 플레이 길이가 지나치게 차이 나지 않는가?
- 하은이 모든 문제를 해결하는 장치가 되지 않았는가?
- NPC가 플레이어보다 많은 정보를 아는가?
- 좋은 선택만 콘텐츠가 많고 거절·유보 경로는 비어 있지 않은가?
- 신규 CG 유무가 아니라 필요한 시각적 변화가 전달되는가?
- 다음 DAY 훅이 현재 DAY의 실제 선택에서 생겼는가?

이 단계에서 발견한 문제는 배포 전에 수정하고 자동 회귀 테스트로 고정한다.

### STEP 17 — 완료 판정

다음 항목이 모두 PASS일 때만 `DAY COMPLETE`로 표시한다.

```text
SOURCE LOCK COMPLETE
SCENARIO COVERAGE COMPLETE
CHOICE COMPLETE
BRANCH RESOLUTION COMPLETE
ROUTE TRUTH COMPLETE
STATE COMPLETE
RELATIONSHIP / KNOWLEDGE BOUNDARY COMPLETE
SAVE / LOAD COMPLETE
PRESENTATION COMPLETE
ACTUAL BROWSER PLAY COMPLETE
DAY TRANSITION COMPLETE
REGRESSION COMPLETE
```

하나라도 실패하면 다음 DAY를 시작하지 않는다.

### STEP 18 — 커밋·푸시·배포

완료 관문 통과 후에만 진행한다.

1. 변경 파일과 사용자 기존 변경을 구분한다.
2. 전체 테스트와 `diff --check`를 다시 실행한다.
3. 구현 커밋을 만든다.
4. 대상 저장소의 `main`과 배포 브랜치에 동일 SHA를 푸시한다.
5. 배포 작업의 head SHA와 성공 결론을 확인한다.
6. 공개 페이지에서 새 캐시 버전과 신규 모듈 HTTP 200을 확인한다.
7. 공개 화면에서 핵심 진입을 한 번 더 확인한다.

## 5. QA 경로 행렬

각 DAY는 원고에 맞춰 아래 표를 작성한 뒤 테스트한다.

| 축 | 경로 A | 경로 B | 경로 C |
|---|---|---|---|
| 관계 태도 | 친화 | 중립 | 경계/거리 |
| 주요 행동 | 참여 | 축소 참여 | 거절/휴식 |
| NPC | 만남 | 연락만 | 미접촉 |
| 공개 | 즉시 설명 | 일부 설명 | 유보 |
| 약속 | 수락 | 거절 | 미정이지만 일정은 해제 |
| 접촉 | 조건 충족 | 편한 거리 | 금지 |
| 저장 | 시작 | 선택 직후 | 분기 합류/종료 |

모든 조합을 무작정 곱하지 않는다. 상태 의미가 달라지는 최소 대표 조합과 경계 조합을 선택한다.

## 6. 자동 테스트에 반드시 고정할 불변식

```text
unknown NPC cannot contact player
unshared contact cannot send a message
unaccepted invitation is not an appointment
unheard information cannot be recalled
unvisited location cannot be reported as visited
unselected action cannot appear in dialogue
unconsented contact cannot render
inactive choice cannot mutate state
completed choice cannot apply twice
resume cannot replay settled reaction
final scene alone cannot complete the day
V4 completion cannot open V1 free action
next day cannot start without its prerequisite hook
```

## 7. 구현 금지 패턴

- 하나의 거대한 `sceneBlock()` 안에 원문을 요약해 모두 넣기
- 경로가 다른데 공통 대사 한 줄로 처리하기
- 선택지는 세 개지만 결과는 모두 같은 문장으로 처리하기
- `includes()`나 접미사만으로 의미가 다른 상태를 과도하게 판정하기
- 선택 적용 도중 일부 플래그를 먼저 변경하기
- 완료 플래그와 다음 DAY 훅을 마지막 대사 전에 기록하기
- 하은의 반응을 항상 정답·보상으로 만들기
- 거절·휴식·유보 경로를 실패 경로로 취급해 콘텐츠를 줄이기
- 원문에 없는 메시지·접촉·약속을 자연스러운 연결이라는 이유로 추가하기
- 신규 DAY 테스트만 통과하고 전체 캠페인 회귀를 생략하기
- 로컬 테스트만 통과한 상태를 공개 배포 완료로 표시하기

## 8. DAY별 완료 보고 형식

```text
[STORY IMPLEMENTATION CYCLE COMPLETE]

Completed DAY: DAY XX
Source: title / page id / snapshot / source hash
Scenes: implemented / total
Choices: implemented / total
Routes played: list
State contract: PASS
Route truth: PASS
Save/load: PASS
Presentation: PASS
Browser desktop/mobile: PASS
Regression: passed / total
Next DAY transition: PASS
Commit: SHA
Remote branches: SHA
Deployment run: id / success
Public verification: URL / cache version / module HTTP status
Next DAY: NOT STARTED
```

## 9. DAY 18부터의 반복 사이클

```text
DAY 18 Source Lock
→ DAY 15~17 continuity audit
→ gap audit
→ chapter/state contract
→ scene graph
→ exact registry
→ resolver
→ runtime
→ reactions
→ presentation
→ save/load
→ automated QA
→ actual browser QA
→ previous-three-day comparison
→ commit/push/deploy/public verify
→ DAY 18 COMPLETE
→ only then begin DAY 19
```

이 사이클을 DAY 30까지 반복한다. 후반부로 갈수록 새 시스템을 계속 추가하기보다 DAY 1~현재까지 쌓인 선택, 관계, 지식, 약속, 경계를 회수하는 데 집중한다.

## 10. 최종 개발 철학

좋은 구현은 원문 문장을 많이 넣는 것만으로 끝나지 않는다. 원문의 장면과 감정이 플레이어가 실제로 선택한 경로에서만 나타나고, 그 선택이 다음 날의 행동과 관계로 되돌아와야 한다.

```text
원문을 정확히 보존한다
→ 가능한 경로 하나만 해석한다
→ 플레이어가 직접 행동한다
→ 선택 결과를 원자적으로 저장한다
→ 다음 DAY가 그 사실만 기억한다
```

DAY 18~30은 이 연결이 끊기지 않는 생활형 스토리 게임으로 구현한다.
