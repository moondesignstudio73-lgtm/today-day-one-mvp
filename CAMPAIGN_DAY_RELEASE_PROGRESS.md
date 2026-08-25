# DAY 5~30 순차 출시 진행표

운영 원칙: 한 DAY의 시나리오 작성·내러티브 QA·런타임 적용·저장 복원·전체 회귀·커밋·푸시·배포 확인이 모두 끝난 뒤에만 다음 DAY를 시작한다.

현재 대상: `DAY 5`

## DAY 5

- [x] 시나리오 계약·Voice Profile·지식 장부
- [x] 완전한 플레이 가능 시나리오 초안
- [x] 자체 내러티브 QA
- [x] 기존 에셋 감사·연출/오디오 매핑
- [x] 다단계 런타임·선택 상태·저장 복원 구현
- [x] 집중 테스트·전체 회귀
- [ ] 실제 브라우저 연속 플레이 QA
- [ ] 커밋·origin push·gh-pages 배포·공개 페이지 확인

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

## 다음 작업

실제 브라우저에서 DAY 4 완료 상태부터 DAY 5의 4개 선택 단계와 저장 재개, 인물·배경·SFX 전환, 최종 DAY 6 훅까지 연속 플레이 QA한다.

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
