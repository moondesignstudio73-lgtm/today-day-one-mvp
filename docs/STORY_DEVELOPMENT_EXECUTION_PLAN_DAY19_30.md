# 《오늘부터 1일》 DAY 19~30 실행 개발 계획서

## 1. 기준과 현재 판정

- 권위 원본: Notion `AI해커톤` 하위 DAY별 최신 `SCENARIO V4`
- 현재 브랜치: `feature/today-day-one-mvp`
- 품질 게이트를 통과한 마지막 회차: **DAY 18**
- 다음 작업 대상: **DAY 19 — 돈으로 사려던 시간**
- DAY 19~30의 기존 `dayN-campaign-runtime.mjs`는 연결·선택·저장 골격으로만 재사용한다. 현재의 짧은 요약형 장면은 완성본으로 인정하지 않는다.
- DAY 1~18에서 발견된 개발 메모/연속성 요약의 대화창 노출은 플레이어 출력 정책과 런타임 감사를 통해 차단·수정한 상태에서 다음 회차를 시작한다.

## 2. 완료 목표

DAY 19부터 DAY 30까지 매일 다음을 실제 플레이 가능한 사건으로 구현한다.

```text
전날 선택 회수 → 실제 상황 시작 → 대화/행동 → 태도 선택
→ 당일 분기 반영 → 다음 날용 역사 기록 → 저녁 잔상 → 저장 → 다음 DAY
```

파일이나 플래그가 존재하는 것만으로 완료 처리하지 않는다. 원본의 사건, 대화 리듬, 선택 직후 반응, 분기 합류, 전날 회수와 다음 날 훅이 게임 화면에서 경험되어야 한다.

## 3. 회차별 반복 관문

각 DAY는 아래 관문을 순서대로 통과한다. 하나라도 실패하면 다음 DAY로 넘어가지 않는다.

1. 최신 Notion V4 전체 본문 Source Lock
2. DAY N-3~N 및 직접 연결된 과거 DAY 연속성 비교
3. 한 문장 감정 목표 정의
4. `INPUT / OUTPUT / STORY HISTORY` 상태 계약 작성
5. Scene Graph와 분기·합류점 작성
6. 원문을 `dialogue`, `monologue`, 짧은 `playerNarration`, 비출력 연출로 분류
7. 런타임·선택 반응·상태 변경·표현 계층 구현
8. 즉시 반응 / 같은 날 반영 / 미래 회수 연결
9. Friendly / Neutral / Distant / Mixed 경로 검사
10. 저장·불러오기·DAY 전환·Story/Free Action 배타성 검사
11. 브라우저 실제 플레이와 콘솔·UI·문자열 감사
12. 전체 자동 테스트 후 `DAY N = COMPLETE` 판정

## 4. 상태 및 출력 계약

### 플레이어 출력 허용

- `dialogue`
- `monologue`
- `playerNarration` 또는 플레이에 꼭 필요한 짧은 `narration`
- `message`

### 대화창 출력 금지

- `stage`, `stageAction`, `stageDirection`
- `designNote`, `continuityNote`, `metadata`, `debug`
- 플래그명, 구현 지시, 장면 목적, 다음 DAY 연결 설명

모든 새 플래그는 기존 저장에서 누락될 수 있음을 전제로 기본값을 사용한다. 미래 대사는 `storyHistory` 또는 명시적 경험 플래그가 참일 때만 과거 사건을 회상한다.

## 5. 회차별 원본 목표

| DAY | Notion V4 | 구현 초점 |
|---:|---|---|
| 19 | 돈으로 사려던 시간 | DAY 16~18의 관계·집·돈 선택 회수, 돈과 시간의 의미 |
| 20 | 같은 집, 다른 하루 | 공동생활 속 서로 다른 리듬과 현재 선택 |
| 21 | 남겨 둔 자리 | 직장/관계 사이에서 비워 둔 자리의 의미 |
| 22 | 떠날 수 있는 사람 | 붙잡음이 아닌 선택 가능한 관계 |
| 23 | 돌아갈 곳 | 가족·집·현재의 귀환 지점 |
| 24 | 끝내지 못한 문장 | 과거의 미완성 대화와 현재의 답 |
| 25 | 좋아한다는 말 다음 | 고백 뒤에 필요한 구체적인 생활 선택 |
| 26 | 사람들 앞의 우리 | 타인의 시선 속에서도 둘이 고르는 관계 |
| 27 | 되돌릴 수 없는 말 | 상처·책임·재협상의 실제 결과 |
| 28 | 다시 만나자는 뜻 | 재회와 계속의 조건을 행동으로 확인 |
| 29 | 내일도 내가 고를게 | 결말 전날의 독립된 현재 동의 |
| 30 | 오늘부터, 그다음 | 지난 29일의 실제 선택을 회수한 플레이어 주도 결말 |

세부 장면 수·선택 수·입출력 플래그는 각 Notion 원문을 잠근 뒤 원본 그대로 확정한다.

## 6. DAY COMPLETE 체크리스트

```text
Scenario Fidelity       PASS
Dialogue Quality        PASS
Gameplay                PASS
Choices                 PASS
Flags                   PASS
Story History           PASS
Save                    PASS
Load                    PASS
UI                      PASS
Day Transition          PASS
Regression              PASS
Runtime Text Audit      PASS
```

## 7. 최종 통합 게이트

- NEW GAME에서 DAY 30/ENDING까지 Friendly 전체 경로
- Neutral 전체 경로
- Distant 전체 경로
- Mixed 전체 경로
- 존재하지 않은 회상, 선택 무시, 문서 문장 노출, UI 난입, 저장 실패, Dead End, 무한 루프, 도달 불가 장면 전수 검사
- `npm test`, `npm run check`, 전체 `node --test tests/*.test.mjs`, 브라우저 플레이 QA 통과
- 관련 변경만 하나의 완결된 커밋으로 기록하고 `publish` 저장소에 푸시

## 8. 중단 조건

필수 원본 부재, 최종 원본 간 해소 불가능한 모순, 장면 의미를 훼손하는 핵심 에셋 부재, 데이터 손실 위험, 자체 수정할 수 없는 실행 불능만 사용자 확인 대상으로 삼는다.
