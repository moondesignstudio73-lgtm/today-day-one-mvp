# DAY24 V4 브라우저 QA — 2026-09-06

## 판정

- Friendly · 대면 · 관계 지속 데스크톱 경로: PASS.
- Neutral · 통화 · 관계 유예 데스크톱 경로: PASS.
- Distant · 연락 불가 · 이미 종료된 관계 데스크톱 경로: PASS.
- Distant · 대면 · 활성 관계 명시적 종료 데스크톱 경로: PASS.
- Mixed · 서울 · 유리 연락 사실 공개 데스크톱 경로: PASS.
- Mixed · 서울 · 서진 연락 관계 상태 거짓말 데스크톱 경로: PASS.
- Mixed · 서울 · 아라 연락 조건부 새 만남 데스크톱 경로: PASS.
- DAY24 전체: PASS / COMPLETE. 데스크톱 의미 경로와 389×844 Friendly/Neutral/Distant/Mixed 검증을 모두 완료했다.

## 환경과 진입

- 로컬 HTTP 서버: `http://127.0.0.1:8018`.
- 실제 인앱 브라우저에서 검증된 DAY22 완료 `Friendly · 부산 공유 숙소` fixture로 진입했다.
- DAY23을 노출된 첫 선택지 18개로 SKIP 없이 완주해 `relationshipOutcome=CONTINUE`, `farewellContact=SHORT_HUG`, `nextConversation=MEET`인 실제 DAY24 입력을 만들었다.
- DAY24도 AUTO는 대사 진행에만 사용하고 SKIP은 누르지 않았으며, 노출된 첫 선택지 14개를 실제 화면에서 선택했다.

## 관찰 결과

- DAY24 시작 `09:00`, 낮 `15:00`, 저녁 `19:00` presentation과 DAY25 `08:00` 전환을 실제 화면에서 확인했다.
- 대면 흐름은 하은과의 현재 대화를 거쳐 관계 지속으로 닫혔고, 미래 대화는 별도 현재 응답 뒤에만 수락됐다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=MEET`, `relationship=CONTINUE`, `futureAccepted=true`, `day25Route=HAEUN_FUTURE`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- 브라우저 console warning/error 0. legacy DAY24 Free Action은 끼어들지 않았다.
- QA 전 사용자 저장은 같은 탭의 session backup에서 복원했고 화면에서 `테스트 전 저장을 복원했습니다.`를 확인했다.

## Neutral · 통화 · 관계 유예

- 부산 별실 DAY22 완료 fixture에서 DAY23의 노출 선택지 18개를 SKIP 없이 진행했다. C9는 `이번 시간은 좋았는데, 내 마음은 조금 더 이야기하고 싶어.`, C17은 `전화로 먼저 이야기하고 싶어.`를 선택해 DAY24 입력을 만들었다.
- DAY24에서는 C3 `좋아하는데 아직 대답 못 한 마음이 있어.`, C6 `나는 시간이 더 필요해. 네가 기다리지 않는 것도 받아들일게.`를 선택하고 나머지는 첫 노출 선택으로 진행했다.
- 대면 카페 장면 없이 통화 흐름으로 진행됐고 관계 유예 뒤 하은 미래 대화 수락을 만들지 않은 채 DAY25로 전환됐다. 실제 화면에서 DAY24 `15:00`과 DAY25 `08:00`을 확인했다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=PHONE`, `relationship=DEFER`, `futureAccepted=false`, `day25Route=DEFERRED_RELATIONSHIP`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- browser warning/error 0, 사용자 저장 복원 PASS.

## Mixed · 서울 · 아라 연락 조건부 새 만남

- DAY19에서 실제 아라 미완료 연락을 남긴 서울 당일 fixture를 DAY22→23→24로 전달했다. DAY23에서는 남은 연락을 지우지 않고 현재 흔들림을 숨기지 않는 선택으로 보존했다.
- DAY24 대면에서 하은과 명시적으로 이별한 뒤 C8은 실제 관계 종료를 공개하고, 아라 C9은 사진 외에도 아라를 더 알고 싶은 마음을 선택했다. runtime의 별도 현재 응답이 수락된 뒤에만 C13 새 만남 문장이 열렸다.
- 완료 저장: `relationship=END`, `contactRecipient=ARA`, `contactCleanup=RELATIONSHIP_ENDED`, `contactDirection=PERSONAL_INTEREST`, `relationshipStatusLie=null`, `newMeetingAccepted=true`, `futureAccepted=false`, `day25Route=RELATIONSHIP_ENDED`.
- 새 만남은 연애 확정이나 새 결말로 표시되지 않았고, 하은 미래 대화도 열리지 않았다.
- browser warning/error 0, 사용자 저장 복원 PASS.

## Mixed · 서울 · 유리 연락 사실 공개

- DAY19에서 실제 유리 연락을 미완료로 남긴 서울 당일 fixture를 추가하고 DAY22→23→24 이력으로 전달했다. DAY23에서는 남은 연락을 지우지 않고 현재 흔들림을 숨기지 않는 선택으로 DAY24까지 보존했다.
- DAY24 대면·관계 지속 뒤 C8 `아직 끝내지 않은 관계가 있어요. 더 만나자는 말은 지금 하지 않을게요.`를 직접 선택하고, 유리 C9에서는 오늘의 유리 이야기를 듣는 선택으로 진행했다.
- 완료 저장: `contactRecipient=YURI`, `contactCleanup=RELATIONSHIP_ACTIVE`, `contactDirection=LISTEN_TODAY`, `relationshipStatusLie=null`, `newMeetingAccepted=false`.
- 관계 결과는 `CONTINUE`, 미래 대화는 별도 수락되어 `day25Route=HAEUN_FUTURE`로 전환됐다. 유리 연락을 새 연애나 새 만남으로 승격하지 않았다.
- browser warning/error 0, 사용자 저장 복원 PASS. 확인 시점의 Free Action은 DAY25 전환 뒤의 `day25-home-evening`이었다.

## Mixed · 서울 · 서진 연락 관계 상태 거짓말

- DAY19에서 실제 서진 연락을 미완료로 남긴 서울 당일 fixture를 추가하고 DAY23에서 현재 흔들림을 숨기지 않는 선택으로 DAY24까지 보존했다.
- DAY24 대면·관계 지속 뒤 C8은 실제 관계가 남아 있음을 밝히는 경로, 서진 C9은 개인적으로 더 알고 싶은 마음, C10은 `지금은 혼자야.`를 실제 화면에서 선택했다.
- 현재 재질문에 자동 정정하지 않는 runtime 응답 뒤 완료 저장은 `contactRecipient=SEOJIN`, `contactCleanup=RELATIONSHIP_ACTIVE`, `contactDirection=PERSONAL_INTEREST`, `relationshipStatusLie={recipient:SEOJIN, statement:SINGLE, truth:RELATIONSHIP_NOT_ENDED, corrected:false}`였다.
- 거짓말은 하은에게 자동 폭로되거나 자동 용서되지 않았고, 현재 관계가 끝나지 않았으므로 `newMeetingAccepted=false`를 유지했다. 하은과의 실제 결과는 `CONTINUE`, `day25Route=HAEUN_FUTURE`였다.
- browser warning/error 0, 사용자 저장 복원 PASS.

## Distant · 대면 · 활성 관계 명시적 종료

- 연락 가능한 DIFFICULT 부산 별실 fixture에서 DAY23을 SKIP 없이 완주해 `relationshipOutcome=UNSURE`, `nextConversation=MEET`인 활성 관계 입력을 만들었다.
- DAY24 대면 대화에서 C6 `좋았던 날 때문에 미뤘지만, 여기서 헤어지고 싶어.`를 직접 선택하고 나머지 노출 선택을 진행해 DAY25까지 완주했다.
- 관계 종료 뒤 산책과 하은 미래 대화 수락은 열리지 않았고, 실제 다른 연락 상대가 없는 상태에서 새 만남을 보상처럼 확정하지 않았다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=MEET`, `relationship=END`, `futureAccepted=false`, `day25Route=RELATIONSHIP_ENDED`.
- 확인 시점에 존재한 Free Action은 DAY25 전환 뒤의 `day25-home-evening`이었으며 DAY24 legacy Free Action은 아니었다. `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`를 함께 확인했다.
- browser warning/error 0, 사용자 저장 복원 PASS.

## Distant · 연락 불가 · 이미 종료된 관계

- 관계·연락이 이미 끝난 DAY22 미여행 fixture에서 DAY23 C1~8과 DAY24의 실제 노출 선택 7개를 SKIP 없이 진행했다.
- DAY24는 하은의 메시지·대면·통화를 새로 만들지 않았고, 현재 관계 응답도 조작하지 않은 채 자기 생활과 남은 말만 정리했다. 실제 화면에서 DAY24 `11:30`과 DAY25 `08:00` 전환을 확인했다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=null`, `relationship=null`, `futureAccepted=false`, `day25Route=RELATIONSHIP_ENDED`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- browser warning/error 0, 사용자 저장 복원 PASS.

## Friendly · 대면 · 관계 지속 · 389×844 모바일

- 브라우저 외곽과 콘텐츠 viewport 차이를 보정해 실제 게임 콘텐츠를 `innerWidth=389`, `innerHeight=844`로 맞춘 뒤, 검증된 DAY23 완료 Friendly fixture에서 DAY24를 다시 시작했다.
- AUTO는 대사 진행에만 사용하고 SKIP은 누르지 않았다. 화면에 노출된 선택지를 직접 선택해 DAY25 `08:00`까지 완주했다.
- `15:00` 카페에는 실제 대면 상대인 하은만 등장했고, 통화 전용 presentation이나 유리·서진·아라, 부산 여행·숙박 장면이 섞이지 않았다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=MEET`, `relationship=CONTINUE`, `futureAccepted=true`, `contactRecipient=null`, `contactDirection=null`, `day25Route=HAEUN_FUTURE`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- 완료 화면에서 `document.documentElement.scrollWidth === document.documentElement.clientWidth === document.body.scrollWidth === 389`를 확인해 가로 오버플로가 없었다.
- QA 전 사용자 저장을 화면에서 복원했고 임시 viewport override도 해제했다.

## Neutral · 통화 · 관계 유예 · 389×844 모바일

- 실제 콘텐츠 `innerWidth=389`, `innerHeight=844`에서 부산 별실·DAY23 관계 불확실·통화 합의 fixture로 DAY24에 진입했다.
- AUTO는 대사에만 사용하고 SKIP은 누르지 않았다. 화면에 노출된 11개 선택지를 직접 진행하되 C3 `좋아하는데 아직 대답 못 한 마음이 있어.`, C6 `나는 시간이 더 필요해. 네가 기다리지 않는 것도 받아들일게.`를 선택했다.
- `15:00`은 통화 흐름으로만 진행됐고 카페 대면, 현장 하은 캐릭터, 유리·서진·아라 연락이나 부산 숙박 장면을 만들지 않았다. 관계 유예 뒤 하은 미래 대화도 열리지 않았다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=PHONE`, `relationship=DEFER`, `futureAccepted=false`, `contactRecipient=null`, `contactDirection=null`, `day25Route=DEFERRED_RELATIONSHIP`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- 완료 화면에서 `document.documentElement.scrollWidth === document.documentElement.clientWidth === document.body.scrollWidth === 389`를 확인해 가로 오버플로가 없었다.
- QA 전 사용자 저장을 화면에서 복원했고 임시 viewport override도 해제했다.

## Distant · 연락 불가 · 이미 종료된 관계 · 389×844 모바일

- 실제 콘텐츠 `innerWidth=389`, `innerHeight=844`에서 관계와 연락이 이미 끝난 미여행 fixture로 DAY24에 진입했다.
- 첫 시도에서 fixture의 과거 `breakup` 마커가 DAY20 이별 팝업을 재생하는 문제를 발견했다. DAY24 불변 입력을 먼저 동결한 다음 이미 처리된 팝업 마커만 제거하도록 모바일 harness를 수정하고 처음부터 재실행했다.
- AUTO는 대사에만 사용하고 SKIP은 누르지 않았다. 화면에 실제 노출된 6개 선택지를 직접 진행해 DAY25까지 완주했다.
- 하은의 메시지·대면·통화나 카페 현장 인물을 만들지 않았고, 부산 여행·숙박 및 유리·서진·아라 연락도 노출되지 않았다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=null`, `relationship=null`, `futureAccepted=false`, `contactRecipient=null`, `contactDirection=null`, `day25Route=RELATIONSHIP_ENDED`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- 완료 화면에서 `document.documentElement.scrollWidth === document.documentElement.clientWidth === document.body.scrollWidth === 389`를 확인해 가로 오버플로가 없었다. QA 전 사용자 저장과 viewport override도 복원했다.

## Mixed · 서울 당일 · 유리 연락 사실 공개 · 389×844 모바일

- 실제 콘텐츠 `innerWidth=389`, `innerHeight=844`에서 서울 당일·DAY23 관계 지속·대면 합의·유리 미완료 연락 fixture로 DAY24에 진입했다.
- AUTO는 대사에만 사용하고 SKIP은 누르지 않았다. C8 `아직 끝내지 않은 관계가 있어요. 더 만나자는 말은 지금 하지 않을게요.`, 유리 C9 `그날은 유리 씨 오늘 얘기를 듣고 싶어요.`를 포함한 노출 선택지를 직접 진행해 DAY25까지 완주했다.
- 유리는 DAY23에서 실제 남은 연락 상대일 때만 등장했고 서진·아라, 부산 여행·숙박 장면은 섞이지 않았다. 유리 연락은 새 연애나 새 만남으로 승격되지 않았고 하은과의 현재 관계 결과를 덮어쓰지 않았다.
- 완료 저장: `error=null`, `phase=ending`, `complete=true`, `conversation=MEET`, `relationship=CONTINUE`, `futureAccepted=true`, `contactRecipient=YURI`, `contactDirection=LISTEN_TODAY`, `day25Route=HAEUN_FUTURE`.
- 전환 저장: `day=25`, `pendingStoryId=m30-day25-current-wedding-scope`, `day25Hook=true`, `freeAction=null`.
- 완료 화면에서 `document.documentElement.scrollWidth === document.documentElement.clientWidth === document.body.scrollWidth === 389`, browser warning/error 0을 확인했다. QA 전 사용자 저장과 viewport override도 복원했다.

## 발견 및 조치

- DAY24 단독 fixture의 새 모듈 체인은 브라우저에서 불안정하게 로드될 수 있어, 이미 검증된 DAY23 브라우저 fixture에서 연속 플레이하는 harness로 바꿨다.
- 브라우저 fixture에서 사용되는 DAY22/23 helper는 `node:assert` 의존을 제거하고 동일한 fail-fast 검사를 브라우저 호환 `ensure`로 유지했다.
- 관계가 이미 종료된 모바일 fixture는 DAY24 입력을 만든 뒤 과거 `breakup` UI 마커를 제거해 DAY20 이별 팝업이 다시 재생되지 않도록 했다. 동결된 DAY24 입력의 `relationshipActive=false`와 `contactAllowed=false`는 유지된다.

## 다음 관문

DAY24는 source snapshot/registry, replay-locked state, SCENE01~24 playable, bridge·저장 재개·현재 응답, Story/Free 배타성, 데스크톱 의미 분기와 389×844 네 성향 모바일 관문을 모두 통과했다. 집중 회귀와 전체 시뮬레이션도 PASS이므로 **PASS / COMPLETE**로 승격한다. 다음은 DAY25 최종 원문 잠금과 DAY22~24 실제 이력 감사다.
