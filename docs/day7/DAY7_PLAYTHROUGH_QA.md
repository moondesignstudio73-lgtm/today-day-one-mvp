# DAY 7 실제 브라우저 연속 플레이 QA

- 검수일: 2026-08-26
- 최초 공개 기준: `a7654a4`
- 수정 공개 기준: `4763d1f`
- 브라우저: Codex in-app browser
- 결과: **PLAYTHROUGH QA PASS**

## 검수 경로

1. 공개 저장의 DAY 5 중간 지점부터 SKIP과 실제 선택 UI로 DAY 5를 완료했다.
2. DAY 6의 생활 경로·장보기·데이트 계획 세 선택을 완료했다.
3. `date_revisit_with_opt_out`을 선택해 DAY 7의 강변 재방문 분기를 실제 화면에서 검수했다.
4. DAY 7에서 `date7_confirm_together` → `date7_rest_and_shorten` → `date7_record_next_rule`을 선택했다.
5. 두 번째 선택 뒤 페이지를 새로 열고 타이틀의 이어하기를 사용해 같은 DAY 7 세그먼트 시작점으로 복원되는지 확인했다.
6. 마지막 선택 뒤 DAY 8로 전환되는지 확인했다.

## PASS 항목

- DAY 6 완료 직후 `DAY 7 · 일요일 / D-24`로 자동 전환된다.
- DAY 7의 세 선택은 서로 다른 행동 전략으로 표시되고 각 선택 뒤 전용 반응 대사가 재생된다.
- SKIP은 다음 선택 지점까지 이동하며 분기 배경과 인물 프레젠테이션을 함께 적용한다.
- 강변 산책로 신규 배경은 16:9 화면에서 확대 깨짐, 문자, 워터마크, 스프라이트 충돌 없이 표시된다.
- 중간 저장을 새로고침·이어하기로 복원했을 때 선택 결과와 런타임 단계가 유지된다.
- 마지막 선택 뒤 DAY 8 상태로 전환되고 콘솔 경고·오류는 0건이다.
- 하은의 밝고 생활적인 말투, 주인공의 체력 확인·계획 변경 판단, 후반 반전 비노출을 실제 플레이 대사에서 확인했다.

## 발견 결함과 수정

최초 공개 빌드는 DAY 7 완료 직후 캠페인 DAY 8에 자유 연애 전용 `ex-message` 장면을 선택해, 상단 날짜는 DAY 8인데 장면 전환에는 `DAY 7 · 전 여자친구에게 온 메시지`가 표시됐다.

- `STANDARD_STORY_SCENES`를 `free-romance` 모드 전용으로 제한했다.
- 캠페인 저장에 이미 남은 호환 불가 `activeEvent`와 `pendingStoryId`도 불러오기 시 다시 열지 않도록 모드 검사를 추가했다.
- `tests/day7-runtime.test.mjs`에 DAY 8 전환 시 `ex-message` 비선택과 저장 복구 모드 검사를 고정했다.
- 수정 공개 빌드에서 오염된 기존 저장을 그대로 이어해 DAY 8 행동 화면으로 안전 복구되고 레거시 장면이 사라진 것을 재검증했다.

## 최종 판정

- STORY: PASS
- VISUAL: PASS
- DIRECTION: PASS
- AUDIO: PASS
- GAMEPLAY: PASS
- UX: PASS
- BUG: PASS
- NEEDS FIX: 0

