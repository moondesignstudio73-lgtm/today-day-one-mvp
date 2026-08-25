# DAY 5~30 순차 출시 진행표

운영 원칙: 한 DAY의 시나리오 작성·내러티브 QA·런타임 적용·저장 복원·전체 회귀·커밋·푸시·배포 확인이 모두 끝난 뒤에만 다음 DAY를 시작한다.

현재 대상: `DAY 5`

## DAY 5

- [x] 시나리오 계약·Voice Profile·지식 장부
- [x] 완전한 플레이 가능 시나리오 초안
- [x] 자체 내러티브 QA
- [x] 기존 에셋 감사·연출/오디오 매핑
- [ ] 다단계 런타임·선택 상태·저장 복원 구현
- [ ] 집중 테스트·전체 회귀
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

`src/day5-presentation-data.mjs`의 검증된 8개 Scene 매핑을 사용해 DAY 5 기준 시나리오를 기존 `m30-day5-work-return` 호환 ID에 다단계 런타임으로 적용한다. 기존 레거시 최종 선택 3종을 보존하고, 윤서진의 `seojinAffection`과 `seojinStatusInterest`를 독립 검증한다.

### 2026-08-25 관문 기록

- 산출물: `docs/day5/DAY5_ASSET_DIRECTION_AUDIO_AUDIT.md`, `src/day5-presentation-data.mjs`, `tests/day5-presentation.test.mjs`.
- 기존 `home-morning`, `office-day`, 하은·서진·민호·팀장 스프라이트와 기존 SFX 5종을 비파괴 재사용한다.
- 검사: DAY 5 프레젠테이션 집중 테스트, `game.js` 문법 검사, 전체 `tests/simulation.test.mjs` PASS.
- 신규 이미지·후처리·아트 방향 결정은 필요하지 않다.
