# DAY 5~30 순차 출시 진행표

운영 원칙: 한 DAY의 시나리오 작성·내러티브 QA·런타임 적용·저장 복원·전체 회귀·커밋·푸시·배포 확인이 모두 끝난 뒤에만 다음 DAY를 시작한다.

현재 대상: `DAY 6`

## DAY 5

- [x] 시나리오 계약·Voice Profile·지식 장부
- [x] 완전한 플레이 가능 시나리오 초안
- [x] 자체 내러티브 QA
- [x] 기존 에셋 감사·연출/오디오 매핑
- [x] 다단계 런타임·선택 상태·저장 복원 구현
- [x] 집중 테스트·전체 회귀
- [x] 실제 브라우저 연속 플레이 QA
- [x] 커밋·origin push·gh-pages 배포·공개 페이지 확인

기준 시나리오: `docs/day5/DAY5_SCENARIO_DRAFT_V1.md`

## DAY 6~30

- [ ] DAY 6
- [ ] DAY 7
- [ ] DAY 8
- [ ] DAY 9
- [ ] DAY 10
- [ ] DAY 11
- [ ] DAY 12
- [ ] DAY 13
- [ ] DAY 14
- [ ] DAY 15
- [ ] DAY 16
- [ ] DAY 17
- [ ] DAY 18
- [ ] DAY 19
- [ ] DAY 20
- [ ] DAY 21
- [ ] DAY 22
- [ ] DAY 23
- [ ] DAY 24
- [ ] DAY 25
- [ ] DAY 26
- [ ] DAY 27
- [ ] DAY 28
- [ ] DAY 29
- [ ] DAY 30

### DAY 6 세부 관문

- [x] 챕터 계약·Voice Profile·지식 장부
- [x] 완전한 플레이 가능 시나리오 초안
- [x] 자체 내러티브 QA·정적 계약 검사
- [x] 기존 에셋 감사·연출/오디오 매핑
- [x] 다단계 런타임·선택 상태·저장 복원 구현
- [x] 집중 테스트·전체 회귀
- [x] 실제 브라우저 연속 플레이 QA
- [ ] 커밋·origin push·gh-pages 배포·공개 페이지 확인

기준 시나리오: `docs/day6/DAY6_SCENARIO_DRAFT_V1.md`  
자체 QA: `docs/day6/DAY6_SCENARIO_QA_V1.md`

## 다음 작업

검증된 DAY 6 브라우저 QA 수정본을 커밋한 뒤, 원격 분기를 안전하게 병합하고 origin·gh-pages push와 공개 페이지를 확인한다.

### 2026-08-25 관문 기록

- 산출물: `docs/day5/DAY5_ASSET_DIRECTION_AUDIO_AUDIT.md`, `src/day5-presentation-data.mjs`, `tests/day5-presentation.test.mjs`.
- 기존 `home-morning`, `office-day`, 하은·서진·민호·팀장 스프라이트와 기존 SFX 5종을 비파괴 재사용한다.
- 검사: DAY 5 프레젠테이션 집중 테스트, `game.js` 문법 검사, 전체 `tests/simulation.test.mjs` PASS.
- 신규 이미지·후처리·아트 방향 결정은 필요하지 않다.
- 로컬 커밋: `369bd4b` (`Plan and map Day 5 workplace chapter`).
- 보호 중이던 DAY 3·4 변경을 별도 커밋한 뒤 원격 최신 변경을 일반 merge했다. `game.js`의 DAY 2 v3 캐시 갱신과 DAY 4 런타임 연결을 모두 보존했고 전체 회귀를 재통과했다.
- 기능 브랜치와 `gh-pages`를 검증 SHA `392f1f4`까지 fast-forward push했으며 캐시 우회 공개 페이지 로드와 콘솔 오류 0건을 확인했다.

### 2026-08-26 DAY 5 런타임 관문 기록

- `src/day5-campaign-runtime.mjs`에 승인된 8개 Scene과 회사 진입·서진 확인·업무 시험·복귀 계획의 4단계 전략 선택을 구현했다.
- 기존 최종 선택 ID `request-current-briefing`, `rebuild-social-context`, `set-return-boundary`를 그대로 최종 기록에 사용해 이전 저장과 DAY 6 연결 계약을 보존했다.
- DAY 4 공유 전략 콜백, 민호·팀장·서진의 구분된 반응, 임시 예비폰, `day6-life-restart` 훅을 실제 런타임 상태에 연결했다.
- 각 중간 선택 뒤 `day5RuntimeStage`와 개별 전략 플래그를 저장하며 재개 시 해당 배경·인물과 다음 세그먼트를 복원한다.
- `tests/day5-runtime.test.mjs`에서 12개 선택 ID, 4단계 저장 복원, 스포일러 차단, 후속 훅을 검증했다. `seojin_role_history`는 STATUS_INTEREST만, `seojin_current_intent`는 AFFECTION만 바꾸는 독립 계약도 고정했다.
- 검증: DAY 5 프레젠테이션·런타임 집중 테스트, `game.js`와 런타임 문법 검사, `tests/simulation.test.mjs` 전체 회귀 PASS. 첫 전체 회귀는 프로젝트 밖 작업 디렉터리 때문에 상대 에셋 경로가 실패했으며 프로젝트 루트에서 재실행해 통과했다.
- 남은 문제: 실제 브라우저 연속 플레이 QA 미실행. 다음 관문에서 DAY 4→DAY 5 진입, 선택별 화면 전환, 중간 저장 재개, 완료 후 DAY 6 상태를 확인한다.

### 2026-08-26 DAY 5 실제 브라우저 QA 기록

- 공개 커밋 `4bfca3a`에서 신규 캠페인을 시작해 DAY 1→DAY 5를 실제 선택 경로로 연속 진행했다. DAY 5 첫 선택 직후 새로고침·이어하기로 `day5RuntimeStage=1` 화면 복원을 확인했다.
- 빠른 진행 시 윤서진 선택 화면에 이전 장면의 민호 스프라이트가 남는 결함을 발견했다. 원인은 `skipImmersiveScene`이 선택까지 인덱스만 이동하고 중간 Scene 전환의 배경·인물을 적용하지 않는 것이었다.
- `applySkippedScenePresentation`을 추가해 선택 전 마지막 전환과 캐릭터 상태를 적용하도록 수정했다. 로컬 공개형 서버에서 서진 선택은 여성 동료, 최종 복귀 선택은 팀장으로 정상 표시됨을 스크린샷으로 확인했다.
- DAY 5의 네 선택을 완료한 뒤 DAY 6로 진행됐고 콘솔 경고·오류는 0건이었다. DAY 5 집중 테스트, 문법 검사, 전체 `tests/simulation.test.mjs` 회귀도 PASS했다.
- 로컬 수정 커밋: `cc6f8be` (`Fix skipped scene presentation state`).
- 배포 차단: push 전 fetch에서 원격 `f75f348`이 앞선 것을 확인했다. 해당 커밋은 `game.js`의 별도 구간과 유리 영상·스타일을 변경하며 기존 `yuri-ex-girlfriend-2d_transparent.webm`을 삭제한다. 자동 merge는 사용자 에셋 보존 규칙 때문에 안전 검토에서 거부됐다.
- 재개 조건: 원격의 유리 영상 삭제를 보존할지 되돌릴지 사용자가 확정하거나, 삭제 없이 새 영상 3종을 유지하는 병합 커밋이 원격에 준비될 것. 로컬 DAY 5 수정은 검증됐지만 아직 원격 push·공개 배포되지 않았다.

### 2026-08-26 DAY 5 배포 완료 기록

- 사용자의 배포 지시에 따라 원격 `f75f348`을 일반 merge하고, 신규 유리 영상 3종은 유지하면서 기존 `yuri-ex-girlfriend-2d_transparent.webm`도 복원해 비파괴 보존했다.
- 병합 상태에서 `game.js` 문법 검사, DAY 5 집중 테스트, `tests/simulation.test.mjs` 전체 회귀가 모두 PASS했다.
- 안전 병합 커밋 `c1ac70f`를 기능 브랜치와 `gh-pages`에 일반 fast-forward push했다. 두 GitHub Actions 실행이 동일 SHA로 성공했다.
- 캐시 우회 공개 페이지에서 `game.js`의 DAY 5 런타임과 SKIP 프레젠테이션 수정 반영, 콘솔 경고·오류 0건, 기존 영상과 신규 영상 3종 HTTP 200을 확인했다.
- DAY 5의 모든 관문을 완료했다. 다음 대상은 DAY 6 시나리오 계약·초안·내러티브 QA다.

### 2026-08-26 DAY 6 시나리오·QA 관문 기록

- `docs/day6/DAY6_SCENARIO_DRAFT_V1.md`에 8개 Scene, 경로·장보기·현재형 데이트의 3개 전략 선택, 10~14분 목표의 완전한 플레이 초안을 작성했다.
- DAY 5 최종 복귀 전략 3종을 회사 메시지의 발신자·자료 형식으로 콜백하되 휴식일에 새 업무를 부과하지 않는다. 서진의 두 관계 축은 기존 말투 차이에만 반영하고 자동 상승시키지 않는다.
- 원래 휴대폰/임시 예비폰, 임시 결제/본인 자산을 분리하고, 약국·마트·카페·공원 생활 반경과 DAY 7 첫 현재형 데이트 훅을 정의했다.
- `docs/day6/DAY6_SCENARIO_QA_V1.md`에서 27개 선택 조합, 캐릭터 Voice, 지식 장부, 일상 공개 예산, 저장 복원 계약을 PASS 판정했다.
- `tests/day6-scenario.test.mjs` 집중 검사와 `tests/simulation.test.mjs` 전체 회귀가 PASS했다.
- 다음 관문은 기존 에셋 감사와 Scene별 연출·오디오 매핑이다.

### 2026-08-26 DAY 6 기존 에셋·연출·오디오 관문 기록

- `docs/day6/DAY6_ASSET_DIRECTION_AUDIO_AUDIT.md`에서 집·거리·카페·공원 배경과 하은 calm/smile/phone 자산을 기존 파일로 확정했다.
- 백화점 식품관을 동네 마트로 오용하지 않고, 약국·마트는 거리 외관과 처방 봉투·장바구니 소품 클로즈업으로 표현하도록 고정했다.
- `src/day6-presentation-data.mjs`에 8개 Scene의 배경·표정·포즈·카메라·전환·BGM·SFX 계약을 추가했고 신규 이미지 제작 없이 기존 파일 별칭만 등록했다.
- 불안·위기 BGM과 하은의 tense/worried 표정을 금지해 DAY 6의 밝은 생활 확장 공개 예산을 유지했다.
- `tests/day6-presentation.test.mjs`, DAY 6 시나리오 검사, 문법 검사, 전체 `tests/simulation.test.mjs` 회귀가 PASS했다.
- 다음 관문은 DAY 6 다단계 런타임·선택 상태·중간 저장 복원 구현이다.

### 2026-08-26 DAY 6 다단계 런타임·저장 복원 관문 기록

- `src/day6-campaign-runtime.mjs`에 잠금 시나리오의 8개 Scene과 경로·장보기·첫 현재형 데이트의 3단계 전략 선택을 구현했다.
- DAY 5 최종 복귀 전략 3종을 휴식일 메시지로 콜백하고, 원래 휴대폰/임시 예비폰 및 본인 자산/임시 결제를 분리했다.
- 각 선택 뒤 `day6RuntimeStage`와 전략 플래그를 저장하며 집·거리·카페·공원 프레젠테이션으로 재개한다.
- 생활 반경·현재 취향·업무 경계·DAY 7 데이트 계획, 장소 해금과 경로별 후속 훅을 상태에 연결했다. DAY 6 전 경로에서 윤서진의 AFFECTION과 STATUS_INTEREST는 변경하지 않는다.
- `game.js`와 `src/story-data.mjs`에 DAY 6 진입·선택·완료·DAY 7 전환 계약을 연결하고 `tests/day6-runtime.test.mjs`를 추가했다.
- 문법 검사, DAY 6 시나리오·프레젠테이션·런타임 집중 검사, 전체 `tests/simulation.test.mjs` 회귀가 PASS했다. 장면 수 고정 기대값은 실제 계약인 전체 141개·캠페인 6개로 갱신했다.
- 다음 관문은 27개 조합과 저장 복원·효과 불변식을 별도 집중 회귀 관문으로 확정하는 것이다.

### 2026-08-26 DAY 6 집중 테스트·전체 회귀 관문 기록

- 경로 3종 × 장보기 3종 × 데이트 3종의 27개 전 조합을 각 단계에서 JSON 직렬화·복원하며 완주했다.
- 각 장보기 전략의 지출, 단계별 거리·카페·공원 재개 화면, DAY 7 공통/분기 훅, 장소·생활 기능 해금을 검사했다.
- DAY 5 최종 전략 3종이 각각 파란 파일·관계 지도·휴식일 회신 금지 메시지로 콜백되는지 확인했다.
- 27개 모든 경로에서 윤서진 AFFECTION=7, STATUS_INTEREST=11이 변하지 않고, 해금·후속 훅 배열에 중복이 생기지 않음을 고정했다.
- 문법 검사, DAY 6 시나리오·프레젠테이션·런타임 집중 검사, 전체 `tests/simulation.test.mjs` 회귀가 PASS했다.
- 다음 관문은 실제 브라우저 DAY 5→DAY 6 연속 플레이와 저장 재개·완료 상태 QA다.

### 2026-08-26 DAY 6 실제 브라우저 QA 기록

- DAY 5 완료 저장에서 DAY 6 진입, 경로·장보기·현재형 데이트 3단계 선택, SKIP, DAY 7 전환을 실제 브라우저로 연속 확인했다.
- 첫 선택 직후 저장한 뒤 다음 선택까지 진행하고 인페이지 불러오기를 실행했을 때 기존 타이머와 전역 이벤트 런타임이 남아 전환막이 고정되는 결함을 재현했다.
- `resetActiveRuntimeForLoad`를 추가해 장면·대사·AUTO 타이머, 전환막, 선택층, 전역 런타임을 정리한 뒤 저장된 Scene 시작점으로 복구하도록 수정했다.
- 상단 MENU 중복을 제거해 STORY MODE에는 동작이 검증된 MENU 하나만 노출하고, `game.js?v=113`으로 캐시를 갱신했다.
- 수정 빌드에서 전환막 정상 해제, 시스템 메뉴, 세 선택, DAY 7 · 일요일 / D-24 진입을 재검증했다.
- 문법 검사, DAY 6 집중 테스트, 전체 시뮬레이션 회귀가 PASS했다. 상세 결과는 `docs/day6/DAY6_PLAYTHROUGH_QA.md`에 기록했다.
- 다음 관문: 로컬 커밋 후 원격 분기 안전 병합, origin·gh-pages 배포 및 공개 페이지 확인.

### 2026-08-26 DAY 6 원격 통합 사전 검사

- `origin/feature/today-day-one-mvp`는 공통 기준 `b76ed31` 이후 5개, 로컬은 4개 커밋으로 분기됐다.
- 원격의 프롤로그 영상·온보딩·헤더 개선과 로컬 DAY 6 변경은 대부분 독립적이지만 `game.js`, `index.html`, `tests/simulation.test.mjs`에서 실제 3-way 충돌이 발생한다.
- `game.js` 충돌은 STORY MODE MENU 표시 방식이다. 원격 방식은 실제 브라우저에서 클릭 불능을 재현한 전용 MENU를 남기므로, 로컬의 검증된 일반 MENU 단일 노출 계약을 보존해야 한다.
- `index.html`은 원격 캐시 `v=114`와 로컬 `v=113`이 충돌하므로 통합 뒤 새 `v=115`로 올려야 한다. 시뮬레이션 검사는 원격 프롤로그 영상 존재 검사와 로컬 DAY 6 장면 수 계약을 모두 보존할 수 있다.
- 현재 자동화 규칙은 충돌 있는 자동 merge를 허용하지 않으므로 push·배포를 시작하지 않았다. 재개 조건은 위 3개 파일의 명시적 충돌 해소 병합 승인이다.

### 2026-08-26 DAY 6 승인 병합·재검증

- 사용자 승인 후 원격 기능 브랜치를 일반 merge했다. 원격의 전용 프롤로그 영상·온보딩·헤더 CSS를 유지하고 로컬 DAY 6 런타임·중간 저장 복구를 함께 보존했다.
- 병합된 헤더 CSS가 일반 메뉴 영역을 완전히 숨기므로 전용 STORY MENU를 단독 노출하는 원격 계약을 채택했다. 실제 브라우저에서 STORY MENU 클릭, 시스템 메뉴 표시, DAY 7 저장 복구, 전환막 해제와 콘솔 오류 0건을 확인했다.
- `index.html` 모듈 캐시는 통합 SHA용 `game.js?v=115`로 갱신했다.
- DAY 1 최종 QA, DAY 6 시나리오·프레젠테이션·런타임 검사, 문법 검사, 전체 시뮬레이션 회귀가 모두 PASS했다.
- 다음 관문: 병합 커밋을 origin과 gh-pages에 일반 push하고 Actions·공개 페이지를 확인한다.

### 2026-08-26 DAY 6 배포 완료 기록

- 승인 병합 뒤 도착한 원격 의상 자산 변경도 일반 merge로 통합해 DAY 3~5 하은 의상 자산과 DAY 6 런타임을 함께 보존했다.
- `game.js` 문법 검사, DAY 1·4·5·6 집중 검사, 신규 의상 품질 검사, 전체 `tests/simulation.test.mjs` 회귀가 모두 PASS했다.
- 병합 커밋 `6e956e7`을 기능 브랜치와 `gh-pages`에 일반 fast-forward push했으며, 동일 SHA의 GitHub Pages Actions 2건이 성공했다.
- 캐시 우회 공개 페이지와 DAY 6 런타임 모듈이 HTTP 200으로 제공되고 `game.js?v=115`, `m30-day6` 계약이 반영됐음을 확인했다.
- DAY 6의 출시 관문을 완료했다. 다음 대상은 DAY 7 시나리오 계약·초안·내러티브 QA다.

### 2026-08-26 DAY 7 시나리오·내러티브 QA 관문 기록

- 두 내러티브 스킬과 필수 참고자료를 적용해 `docs/day7/DAY7_SCENARIO_DRAFT_V1.md`에 첫 현재형 데이트를 다루는 8개 Scene·3개 전략 선택·9~13분 시나리오를 작성했다.
- DAY 6의 새 장소·조건부 재방문·교대 선택 3분기를 장소·역할·대사로 콜백하고, 체력 변수는 관계 실패가 아닌 계획 수정 전략으로 처리했다.
- `docs/day7/DAY7_SCENARIO_QA_V1.md`에서 총 81개 조합, Voice·지식 장부·정보 예산·저장 복원·DAY 8 독립 심부름 훅을 PASS 판정했다.
- `tests/day7-scenario.test.mjs`와 전체 `tests/simulation.test.mjs` 회귀가 PASS했다. 플레이 대사 범위에서 후반 반전·사고 정보·D-DAY 조기 노출을 차단한다.
- 다음 관문은 DAY 7 기존 에셋 감사와 Scene별 연출·오디오 매핑이다.
