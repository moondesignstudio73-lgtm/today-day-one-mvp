# DAY 5 시나리오 재구축 V2 — 원문 보존 합성 계약

## 판정

- 상태: `SCENARIO REBUILD V2 COMPLETE`
- 최우선 원본: Notion `AI해커톤 > day 5` 하위 페이지 본문
- 조회 URL: `https://app.notion.com/p/3c9c31f029a680c59136fc1dde2d9429`
- 이번 재조회: `2026-08-28 11:26 KST`
- 원본 상태: `SCENARIO COMPLETE V1 — 기획·규칙·현재 구현 종합본`
- 원문 보존층: `docs/day5/DAY5_SCENARIO_DRAFT_V1.md`
- 상위 페이지 Markdown 첨부: 사용자 최신 지시에 따라 조회·대조·누락·충돌 관문에서 제외

이 문서는 V1을 요약하거나 대체하지 않는다. 런타임은 V1의 SCENE 01~08, 대사, 행동, 네 선택과 각 즉시 반응을 순서대로 전부 구현하고, 아래 V2 보강층만 지정 위치에 더한다. V1 문장을 삭제·축약·재배열하는 구현은 실패다.

## 챕터 계약

- 플레이타임: 12~16분.
- 감정 질문: 과거의 평판을 연기하지 않고도 현재의 내가 사람들과 다시 관계를 만들 수 있는가.
- 시작 상태: 하은의 실무적 돌봄을 받지만 주인공은 회사에서 자기 경계를 직접 세워야 한다.
- 종료 변화: 주인공은 하은에게 지시받지 않고 두 시간 방문을 끝내고, 스스로 결과를 보고한다. 하은은 확인을 재촉하지 않고 그 자율성을 믿는다.
- 미스터리 진전: DAY 4 증언 장부를 직장 증언의 출처 구분으로 확장한다. 사고 원인이나 하은의 정체는 공개하지 않는다.
- 다음 훅: `day6_life_restart_pending`; 회사 밖 생활권을 현재 기준으로 다시 걷는다.

## Voice Profile과 지식 장부

- 주인공: 관찰 → 가능성 → 확인 → 판단 → 행동. 짧고 실무적이되 상대의 감정을 자료로 취급하지 않는다.
- 하은: 생활감, 다정함, 작은 장난. 회사 관계를 통제하거나 서진의 이름에 질투하지 않는다.
- 윤서진: 사회적으로 능숙한 농담과 목적 있는 질문. `AFFECTION`과 `STATUS_INTEREST`는 독립한다.
- 민호: 직접 본 것과 전해 들은 것을 구분한다. 코미디 뒤에 신뢰 가능한 출처 태도가 있다.
- 팀장: 의료 경계와 업무 책임을 절차로 보호한다.

### MUST / MAY / MUST NOT REVEAL

- MUST: DAY 4 지훈·증언 장부·민호 메시지 회수, 현재/과거 자료 분리, 두 시간 제한, 네 전략 선택, 서진 양축 독립, 여섯 저장 지점.
- MAY: 관계 단계별 말투 차이, 사원증·물컵·오프라인 폴더·볶음밥 사진의 장면 행동성 강화.
- MUST NOT: 서진과 과거 친밀도의 확정, 누구의 증언이 절대 진실이라는 판정, 사고 원인, 하은 잠금 프로필·반전 조건.

## 감정 곡선과 Scene Beat

| Scene | 원문 필수 사건 | V2 보강 | 종료 변화 |
|---|---|---|---|
| 01 | 넥타이, 탄 토스트, 약·물·사원증·휴대폰, 접촉 경계 | 관계 단계별 온도 차이 | 하은의 돌봄을 받되 결정권은 주인공에게 남음 |
| 02 | 회사 문턱, 선택 1 | DAY 4 전략 콜백 | 입장 원칙 확정 |
| 03 | 민호·서진 첫 대면, 출처 구분 | 이름/접촉/호칭 경계 보존 | 현재 관계 지도 시작 |
| 04 | 방문 권한, 빈 명패, 오프라인 두 폴더 | 선택 1의 실물 결과 | 과거 평판과 현재 권한 분리 |
| 05 | 커피 증언 맥락화, 선택 2 | 서진 양축의 독립 반응 | 서진과 현재 관계의 질문 확정 |
| 06 | 실패 가설, 익명 자료, 선택 3 | 정확한 비용과 제한 종료 | 현재 업무 습관 하나 검증 |
| 07 | 다음 방문 계획, 선택 4 | 앞선 선택 두 개의 조합 콜백 | 복귀 범위 문서화 |
| 08 | 민호 감정 출처, 서진 콜백, 볶음밥 문자, 세 폴더, DAY REPORT | 관계 단계별 하은 답신과 자율성 신뢰 | 관계·업무·증언이 각기 저장됨 |

## 장면별 추가 플레이 대사

아래 블록은 원문 대사 뒤의 삽입문이다. 원문을 대체하지 않는다.

### SCENE 01 — 접촉 동의와 관계 단계

원문의 “위치만.” 이후 하은은 넥타이에 손대지 않는다. 친밀도는 동의 생략이 아니라 말의 온도로만 달라진다.

- LOW
  - **하은:** “알겠어. 거울 오른쪽 봐. 내가 말로만 맞춰 줄게.”
  - **주인공:** “그게 편합니다.”
  - **하은:** “편한 방식부터 기억하면 돼.”
- MID
  - **하은:** “오른쪽이 조금 길어. 오늘의 첫 업무는 넥타이 좌우 합의.”
  - **주인공:** “수정했습니다.”
  - **하은:** “합의안 통과.”
- HIGH
  - **하은:** “내가 고쳐 줘도 되는 날은 네가 먼저 말해. 오늘은 거울로.”
  - **주인공:** “고맙습니다.”
  - **하은:** “그 고맙다는 말도 천천히 줄여 가자.”

공통 행동: 하은은 약과 물을 가방 옆에 두고 한 걸음 물러난다. 주인공이 직접 넣는다. `day5_haeun_boundary_respected = true`.

### SCENE 04 — 선택 1의 플레이 가능한 결과

- `entry_current_facts`: 방문 권한 카드, 허용 폴더, 담당자 세 줄을 직접 체크하고 `day5_current_authority_verified = true`.
- `entry_social_map`: 조직도에서 팀장·서진·민호의 현재 역할을 연결하고 `day5_team_map_started = true`.
- `entry_recovery_boundary`: 계획표에 두통·어지럼·혼란 시 즉시 중단과 책임 제외 조항을 입력하고 `day5_medical_boundary_documented = true`.

### SCENE 05 — 선택 2의 즉시·후속 반응

- `seojin_role_history`: `seojinStatusInterest +3`, `seojinAffection +0`. 서진은 공동 프로젝트 책임표를 준비한다.
- `seojin_current_intent`: `seojinAffection +3`, `seojinStatusInterest +0`. 서진은 현재의 관계가 쌓인 뒤 개인 답을 다시 묻도록 남긴다.
- `seojin_present_boundary`: `seojinAffection +1`, `seojinStatusInterest +1`, `coworkerRelation +2`. 서진은 첫인상을 현재부터 다시 관리한다.

어떤 경로도 친밀했던 과거를 확정하지 않는다. `day5_seojin_basic_unlocked = true`만 공통 확정한다.

### SCENE 06 — 선택 3의 정확한 비용

- `work_observe_only`: `investigation +3`, `seojinStatusInterest +2`; 결론 없이 누락 항목만 기록.
- `work_bounded_review`: `work +3`, `seojinStatusInterest +4`, `energy -2`; 정확히 15분 뒤 화면 종료.
- `work_pair_check`: `coworkerRelation +3`, `seojinAffection +1`, `seojinStatusInterest +2`; 민호 설명과 서진 반례를 분리 기록.

공통으로 `day5_pre_accident_work_habit_verified = true`, `day5_minho_provenance_respected = true`. 성공 정답이나 과거 기억은 지급하지 않는다.

### SCENE 07 — 선택 4와 조합 콜백

레거시 ID를 그대로 사용한다.

- `request-current-briefing`: `review-current-work`, `office-briefing` 해금.
- `rebuild-social-context`: `coworker-lunch`, `ask-team-history` 해금.
- `set-return-boundary`: `planned-work-return`, `review-current-work` 해금.

계획표에는 선택 1 결과와 선택 3 결과가 함께 보인다. 예: `recovery_boundary + bounded_review`이면 중단 증상, 15분 검토 제한, 업무 책임 제외가 한 문서에 기록된다. `day5_work_return_plan_saved = true`.

### SCENE 08 — 하은 관계 변화와 문자 단계

원문의 볶음밥 사진, `생활 안전 앱 업데이트: 오늘은 성공.`, 주인공의 `살아 있음. 예정 시간보다 12분 일찍 끝남.`을 모두 먼저 재생한다.

- LOW
  - **하은 메시지:** “확인했어. 집에 도착하면 한 줄만 더 보내 줘. 회사 얘기는 네가 하고 싶을 때 듣고.”
- MID
  - **하은 메시지:** “한 글자보다 길어서 만족. 집에 오면 회사 얘기 말고 점심 메뉴부터 말해 줘.”
- HIGH
  - **하은 메시지:** “정한 시간에 나온 거, 잘했어. 오늘 네가 세운 기준은 내가 대신 묻지 않을게. 집에서는 점심 메뉴부터.”

주인공은 공통으로 `점심 먹고 말할게. 오늘은 내가 정한 시간에 나왔어.`라고 답한다. 하은은 추가 확인을 요구하지 않는다. `day5_haeun_autonomy_trust = true`. 이는 모든 경로의 실제 관계 변화이며 affection 보상과 별개다.

## 프리모드·장소·시스템 통합

- 실제 월드맵에는 `office` 노드가 없다. 회사 방문을 지도 개방으로 허위 기록하지 않는다.
- 캠페인 전용 회사 맥락과 `day5-office-evening` 자유 행동은 DAY REPORT 이후 선택적 후속으로 연다.
- 호환 이벤트 `context-day5-office-seojin-handoff`는 서진의 자료 전달과 선택 2 콜백을 이어야 하며, 새 과거 사실을 만들지 않는다.
- `review-current-work`, `office-briefing`, `coworker-lunch`, `ask-team-history`, `planned-work-return`은 기능 설명이 아니라 선택의 후속 관계·업무 행동이다.
- 사원증, 물컵, 빈 명패, 오프라인 폴더, 실패 가설 문서, 볶음밥 사진은 대사로만 언급하지 않고 화면의 손/소품 행동으로 제시한다.

## 상태·레거시 저장 호환 계약

V2는 기존 저장 키를 읽고 새 키로 정규화하되 원본을 지우지 않는다. 효과는 한 번만 적용한다.

| 레거시 키 | 정규 키 | 값 |
|---|---|---|
| `day5EntryStrategy` | `day5_entry_strategy` | `current_facts | social_map | recovery_boundary` |
| `day5SeojinStrategy` | `day5_seojin_strategy` | `role_history | current_intent | present_boundary` |
| `day5WorkTrial` | `day5_work_trial` | `observe_only | bounded_review | pair_check` |
| 기존 최종 선택 저장 | `day5_return_strategy` | 레거시 선택 ID 3종 |

- `day5ScenarioVersion = 2`.
- 기존 stage `0~4`는 그대로 복원한다. 세부 복원은 `day5SceneCheckpoint`를 추가해 원문 대사 중복 재생과 효과 중복 적용을 막는다.
- `seojinAffection`과 `seojinStatusInterest`는 마이그레이션·선택 효과·UI·테스트에서 합치지 않는다.
- `day5ChoiceEffectsApplied`에 선택 ID별 적용 여부를 저장한다.
- DAY REPORT 전에는 완료 플래그를 세우지 않는다.
- 최종 공통: `day6_life_restart_pending = true`.

### 여섯 저장 지점

1. 선택 1 직후: 입장 전략과 해당 실물 결과.
2. SCENE 03 직후: 민호·서진 기본 정보와 출처 구분.
3. 선택 2 직후: 서진 전략과 독립 양축 효과.
4. 선택 3 직후: 업무 전략, 비용, 제한 시간.
5. 선택 4 직후: 복귀 전략, 해금, 조합 계획표.
6. DAY REPORT 직전: 세 폴더, 하은 문자 단계, 후속 훅.

각 지점은 저장 → 새 런타임 인스턴스 → 복원 → 다음 한 단계 진행으로 검증한다.

## 연출·이미지·오디오 계약

- 회사는 생활 복귀 공간이다. 공포 BGM, 불길한 줌, 서진 등장 시 유혹 효과음을 금지한다.
- 기본 16:9. HUD·대화창 안전 영역 안에 얼굴, 손, 사원증, 물컵, 폴더 제목, 휴대폰 사진이 남아야 한다.
- 주요 CG 후보: 현관 거울 넥타이 POV, 사원증 게이트, 책상 두 폴더, 실패 가설/타이머, 벤치 휴대폰 볶음밥 사진.
- 하은은 보라색 단발과 기존 얼굴·체형·복장 정체성을 유지한다.
- 타이머 종료는 화면 흔들림 대신 손이 멈추고 문장을 다시 읽은 뒤 스스로 화면을 닫는 행동과 짧은 실내음 감쇠로 표현한다.

## 완전 구현 수용 기준

- Notion 본문 SCENE 01~08 사건·대사·선택 누락 `0`.
- 네 선택 모두 즉시 반응, 상태, 후속 대사, 저장 복원을 가진다.
- LOW/MID/HIGH 하은 반응은 접촉 동의와 자율성 신뢰를 훼손하지 않는다.
- 서진 양축은 서로 독립하며 `role_history`/`current_intent` 단축 효과가 없다.
- 여섯 저장 지점과 레거시 stage 0~4가 모두 복원된다.
- 회사 자유 행동은 서사 후속이고 실제 지도 방문으로 허위 집계되지 않는다.
- DAY 4에서 도달 가능하고 DAY 6 훅을 남기되 DAY 6 구현은 시작하지 않는다.

## 10문항 검수 — V2 설계

1. 연애 중심: `PASS` — 출근 전/퇴근 후 하은의 생활적 돌봄과 자율성 신뢰.
2. 관계 변화: `PASS` — 모든 경로에서 하은이 현재 주인공의 자기 결정과 자발적 보고를 신뢰.
3. 조건부 대사: `PASS` — SCENE 01·08 LOW/MID/HIGH.
4. 최근 경험 반복 방지: `PASS` — DAY 4 집/친구 증언에서 회사/업무 검증으로 이동.
5. 시스템 설명 비중: `PASS` — 권한·업무·해금은 행동 선택과 관계 반응에 결합, 20% 이내.
6. 하은의 주체성: `PASS` — 준비는 돕지만 회사 관계와 보고를 통제하지 않음.
7. 새 인간관계 필요성: `PASS` — 민호는 출처, 서진은 현재 호감/성장 평가의 독립 질문.
8. 설렘: `PASS` — 동의가 유지되는 익숙한 장난과 귀가 문자.
9. 미스터리 진전: `PASS` — 직장 증언의 출처·시점·장소 분리, 조기 진실 공개 없음.
10. 다음 훅: `PASS` — 현재 기준으로 생활권을 다시 걷는 DAY 6 연결.

결론: 설계 관문 `PASS`. 다음 관문은 이 합성 계약과 V1 전체를 전용 런타임·프레젠테이션·저장 마이그레이션에 손실 없이 구현하는 것이다.
