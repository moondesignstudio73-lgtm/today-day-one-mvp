# DAY 7 V3 Implementation Gap Audit

## Verdict

`REBUILD REQUIRED` — 현재 구현은 8개 압축 Scene·3개 선택이며, 최신 Notion V3의 24개 문서 Scene·11개 선택·3개 완전 경로를 충족하지 않는다. 기존 DAY 7을 COMPLETE로 취급하지 않는다.

## Source-to-runtime comparison

| 항목 | 최신 Notion V3 | 현재 구현 | 판정 |
|---|---:|---:|---|
| 문서 Scene | 24 | 8 | FAIL |
| 실제 단일 경로 Scene | 22 | 8 | FAIL |
| 주요 선택 | 11 | 3 | FAIL |
| 데이트 경로 | 야경/놀이공원/서점+저녁 | DAY 6 계획에 따른 책방/전시관/강변 | FAIL |
| 서진 사진 수신/보류/거절 | 선택 1 및 후속 지식 분기 | 없음 | FAIL |
| 하은에게 연락 공개/보류/얼버무림 | 선택 4·10과 신뢰 결과 | 없음 | FAIL |
| 취향 속도 사건 | 경로별 S08/S09/S10 | 요약된 활동 장면 | FAIL |
| 카드 공개·서진 관심·현재 접촉 | 선택 8~11 | 없음 | FAIL |
| DAY 8 지훈 훅 | 통화 여부별 초대 | 독립 심부름 훅 | FAIL |
| 저장 복원 | 11선택 및 조건부 선택 6 | 3단계 | FAIL |

## Preserve during rebuild

- 기존 scene ID `m30-day7-first-present-date`와 DAY 6 완료 이력 요구조건.
- 기존 저장의 `day7OpeningStrategy`, `day7RecoveryStrategy`, `day7MemoryStrategy`, 완료 플래그는 레거시 호환층으로 유지한다.
- DAY 1~6 저장, 자유 연애 모드, 사용자 에셋, 윤서진 AFFECTION/STATUS_INTEREST 독립.
- 현재 사용 가능한 DAY 7 배경과 의상은 품질 감사 후 재사용하되, 원고의 세 경로·핵심 행동을 단순 배경 반복으로 축약하지 않는다.

## Required next implementation gate

1. V3 chapter contract, Voice Profiles, knowledge ledger, information budget, emotion curve 고정.
2. 24 Scene/11 choices 데이터와 선택별 즉시 반응 구현.
3. 세 데이트 경로, 관계/신뢰/접촉, 사진 수신·공개 상태 런타임 구현.
4. 레거시 3선택 저장 이행, 체크포인트·새로고침 복원 테스트.
5. DAY 2 기준 에셋·행동 CG·모바일/데스크톱 안전 영역 감사.

DAY 8은 시작하지 않는다.
