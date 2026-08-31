# DAY 15 V4 몰입형 어댑터·기본 프레젠테이션 QA

상태: `ROUTE/CHOICE/SAVE ADAPTER + GAME ENTRY PASS · IMAGE PRODUCTION 5/6 · DIRECTION/AUDIO PENDING`

## 최신 Notion 원고 잠금

- `2026-08-31 07:47 KST` 직전 `AI해커톤 > DAY 15 — 빛나는 쪽을 보다 | SCENARIO V4` 하위 페이지를 새로 완전 조회했다.
- 페이지 ID는 `3c9c31f0-29a6-8138-ab56-ed8ee668526d`, URL은 `https://app.notion.com/p/3c9c31f029a68138ab56ed8ee668526d?pvs=204`, 조회 본문은 23,171자다.
- 스냅샷 `2026-08-27T21:19:12.202Z`, SHA-256 `c1b542d06e5d931aae5c70f45eb936ae1bdd23efa02d9c9b018282a70b5543ea`로 기존 잠금과 동일하다. 상위 페이지 Markdown 첨부와 `<file>` 블록은 사용하지 않았다.

## 구현 범위

- `src/day15-v4-immersive-adapter.mjs`가 SCENE 01~12와 SCENE 13~24의 정확 원문 경로 resolver를 하나의 transition/대사/메시지/선택 단계로 변환한다. 축약 전반 타입 데이터는 더 이상 어댑터의 실행 공급원이 아니다.
- 원고 순서를 참석 `01~17 → 20~24`, 불참+전화 `01~03/06 → 18 → 12~16 → 20~24`, 불참+무연락 `자기 오후 → 19 → 23~24`로 보존한다.
- 저장 체크포인트와 다른 임의 SCENE 시작은 fail-closed다. 자기 오후 SCENE 06의 선택 3·4 뒤 JSON 복원은 이미 본 공통 도입과 앞선 선택 반응을 다시 재생하지 않고 transition/SFX/character 또는 ambient scaffold와 다음 선택으로 복귀한다.
- 전반·후반 선택 반응은 저장된 선택 ID가 해당 선택 번호와 일치하고 실제 원문 분기가 존재할 때만 출력한다. 알 수 없는 단계 타입과 텍스트·화자·발신자 누락도 묵시적으로 내레이션 처리하지 않고 차단한다.
- SCENE 24 도달만으로 완료를 선언하지 않는다. 먼저 `chapterCompletionCue`를 내보내고 런타임의 `completeDay15V4(..., {finalSceneReached:true})`가 성공한 뒤에만 `sceneEnd complete:true`를 제공한다.

## 프레젠테이션 상태

- 24개 장면 모두 기존 감사 완료 배경과 DAY 7 하은 의상 자산에 연결돼 있으며 모바일 안전 영역과 transition/BGM/SFX 기본값이 있다.
- 기존 표면 감사 뒤 6종 제작 계획을 잠갔고 현재 `image-production-active`, `in-production-5-of-6`이다. SCENE 03 갤러리 입구, SCENE 05 방향 착각, SCENE 07 흔들리는 선, SCENE 12 카페 고백과 자격 있는 SCENE 20 어깨 접촉을 내장 ImageGen 채택본으로 `ready-new` 연결했으며 나머지 19장면은 `ready-background-only`다.
- 장면의 정적 `eventCgUrl`은 제작 메타데이터이며 실제 표면은 반드시 `getDay15V4EventCg`와 몰입형 어댑터의 상태 자격 판정을 거친다. 참석·조건부 접촉·활성 종결 경로를 정적 프레젠테이션 조회만으로 우회하지 않는다.
- 다섯 채택본은 모두 1672×941 RGB다. 갤러리 입구 SHA-256은 `1BB2E107194EE0955019714ED0FC54FFFBD41E29B0150CA61FE0AF798B52AE04`, 방향 착각은 `6E6595E2C113EFEC169BCD51790B07A544CC771A625904F7F814271DF1BD5212`, 흔들리는 선은 `CA397A7CFFF261EB4EE67EEC8CEA68FA998ED0FF929CC437E8D42CC73B07A4DA`, 카페 고백은 `BD3CE26F7E63F550550DF231A3061C3E42797921F8B9976852F307DF28E46A51`, 조건부 어깨 접촉은 `175226C121564BFE5C25D458063B2353A1D2CBF1B661FE981A489A760E682C6B`다. 런타임은 자격 있는 각 전환에서 기존 인물을 숨긴 뒤 정확히 한 번 `cgShow`하고, CG 종료 뒤에만 하은 `characterEnter`로 대사 표면을 복원한다.
- SFX는 현재 장면 시작 기본 큐일 뿐 원고 행동과의 프레임 단위 동기화가 끝난 상태가 아니다. 연출·오디오 관문도 `pending-day15-v4-direction-audio-audit`다.
- 따라서 현재 다섯 CG의 정적 규격·내용·안전영역과 SCENE 20 조건부 노출만 PASS이며, 6/6 전체 이미지 PASS와 실제 브라우저 PASS는 아직 주장하지 않는다.

## SIP 자체 검증과 수정

- 별도 무맥락 냉독이 다중 선택 장면의 재접속 재생, 임의 `startScene` 우회, 선택 반응 누락의 묵시적 빈 배열, 미완료 `sceneEnd`, 이미지 대기 상태를 완성된 프레젠테이션처럼 검증할 위험을 지적했다.
- JSON 복원 전용 다음 선택 축약, 체크포인트 일치 강제, 선택 반응 fail-closed, `chapterCompletionCue`, `baseline-only` 메타데이터와 대기 관문 검증으로 모두 교정했다.
- 정확 전반 공급원 교체 뒤 두 번째 무맥락 냉독이 선택 큐의 잠재적 재배치, SCENE 06 scaffold 유실, 우회 상태의 암묵성, 오래된 continuation 재호출과 후반 반응 검증 비대칭을 지적했다. 단일 terminal cue 불변식, scaffold 복원, 전화/무연락 우회 상태 검증, 최신 선택 cursor와 전후반 대칭 검증으로 교정했다.
- 허구 정본과 저장소 내부 동작만 검증했으므로 외부 사실 검증 `factchk`는 적용 대상이 아니다. 성능 지표나 외부 정답을 주장하지 않아 `mandela`도 적용하지 않았다.

## 검증 결과

- DAY 15 V4 어댑터·전후반 플레이 데이터/resolver·소스 레지스트리·런타임·상태 집중 테스트는 `67/67 PASS`다.
- 신규 회귀는 정확 원문에만 있던 전반 문장과 별도 오후 의상 마무리, JSON 직렬화 뒤 선택 4·5 scaffold 복귀, 전화/무연락 우회 상태, 오래된 continuation 거부, 미완료/완료 종료 신호 분리를 고정한다.
- 기존 자산 5종과 내장 ImageGen 채택 CG 5종을 참조한다. 신규 이미지는 Codex 내장 ImageGen만 사용했고 OpenAI API SDK/외부 API/`OPENAI_API_KEY` 경로는 사용하지 않았다.

## 미완료 관문과 다음 작업

- SCENE 01~12 정확 원문 레지스트리·resolver·몰입형 어댑터·`game.js` 연결은 완료했다. 기존 축약 타입 데이터는 감사 기준선으로만 남고 실행 공급원이 아니다. DAY 15 전체 `Notion 원고 장면/대사/선택 누락 0`의 최종 판정은 실제 브라우저 대표 경로까지 통과한 뒤로 보류한다.
- `game.js`의 실제 DAY 15 V4 신규 진입·선택·재접속·완료 연결은 PASS했다. 원문 선택 prompt, 메시지 발신자, 무대지시/섹션, 선택 결과 메타데이터도 게임 렌더러에서 손실 없이 소비한다.
- 기존 자산 커버리지 감사와 제작 계획 잠금, SCENE 03·05·07·12 및 조건부 20 이미지 5/6 제작·정적 통합은 완료했다. 집중 검증은 `16/16`, DAY 15·모듈 기동 확장 회귀는 `85/85 PASS`다. 연출·오디오, 전체 회귀, 실제 브라우저, 커밋·origin·동일 SHA gh-pages·공개 확인은 대기다.
- 다음 단일 관문은 SCENE 24의 유효 종결 도달 predicate와 음성 회귀를 먼저 고정한 뒤, 경로 중립 종이 위 선 종결 CG를 Codex 내장 ImageGen으로 제작하는 것이다. DAY 16은 시작하지 않는다.
