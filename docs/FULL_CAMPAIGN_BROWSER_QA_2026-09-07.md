# NEW GAME → ENDING 전 구간 브라우저 QA (2026-09-07)

## 검증 범위

- Chrome 152 격리 프로필에서 실제 `NEW GAME` 버튼으로 시작했다.
- Story Mode 선택, 플레이어 설정, 프롤로그 종료 이벤트를 거쳐 DAY 1부터 DAY 30 결말까지 진행했다.
- AUTO는 전 구간 OFF로 유지했고 SKIP은 한 번도 누르지 않았다.
- Story 선택과 Free Action이 동시에 활성화되지 않는지 매 프레임 검사했다.
- 각 실행은 별도 브라우저 프로필과 저장소를 사용해 경로 간 저장을 격리했다.
- QA 대기 시간만 단축하는 `--timecap=1`을 사용했으며 선택·응답·분기 판정은 실제 게임 코드를 그대로 실행했다.

## 최종 결과

| 선택 전략 | DAY 30 결말 | Free Action | SKIP | History | 완료 |
| --- | --- | ---: | ---: | ---: | --- |
| Friendly | `HAEUN_PREPARE_MARRIAGE` | 11 | 0 | DAY 1–30 | PASS |
| Neutral | `SOLO` | 11 | 0 | DAY 1–30 | PASS |
| Distant | `SOLO` | 11 | 0 | DAY 1–30 | PASS |
| Mixed | `SOLO` | 11 | 0 | DAY 1–30 | PASS |

네 실행 모두 `day=30`, `day30Complete=true`, `runtimeComplete=true`, AUTO OFF, browser warning/error 0건으로 종료했다. Neutral과 Mixed의 SOLO는 현재 선택을 기계적으로 섞었을 때 상대의 독립 응답을 임의로 승낙시키지 않는 게임 규칙의 결과다. DAY 30 자체의 고정 시드 QA는 `HAEUN_PREPARE_MARRIAGE`, `HAEUN_REDISCUSS`, `SOLO`, `ARA_RELATIONSHIP` 네 상호 배타 결말을 별도로 모두 통과한다.

## 전 구간 실행에서 발견하고 수정한 결함

1. DAY 29 SCENE02의 보유 의상 분기에서 원문 일부만 source ref로 사용해 `DAY29_SOURCE_LINE_MISSING:2`가 발생했다. 전체 원문 행을 참조하도록 수정했다.
2. DAY 29 SCENE03의 사진 미소와 회고 분기에서 부분 문자열을 참조해 `DAY29_SOURCE_LINE_MISSING:3`가 발생했다. 각각 완전한 원문 행으로 교정했다.
3. DAY 28 SCENE21의 간단한 식사 분기에서 부분 문자열을 참조해 `DAY28_SOURCE_LINE_MISSING:21`이 발생했다. 전체 원문 행으로 교정했다.
4. DAY 28 SCENE20의 연락을 기다리는 분기에서 부분 문자열을 참조해 `DAY28_SOURCE_LINE_MISSING:20`이 발생했다. 전체 원문 행으로 교정했다.
5. Friendly의 단순 첫 선택 전략이 DAY 16 유리 분기와 DAY 28 다음 만남 미확정으로 흐르는 문제를 확인했다. QA 전략을 `집에서 쉰다`, `하은과의 삶`, `다른 사람 때문은 아니다`, `가능하면 다음에 보자`처럼 실제 관계 의도를 보존하는 선택 ID 우선 방식으로 바꿨다.

## 재현 명령

```powershell
node tests/full-campaign-browser-qa.mjs --routes=friendly,neutral,distant,mixed --timecap=1
```

이 하네스는 실제 UI 이벤트만 사용하며 DAY 1–30 누락, Story/Free 중첩, AUTO 활성화, SKIP 클릭, 런타임 오류 또는 DAY 30 미완료가 있으면 실패한다.
