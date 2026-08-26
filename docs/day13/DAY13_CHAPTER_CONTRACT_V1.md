# 《결혼까지 30일!》 DAY 13 — 합의된 만큼만 공동 · 챕터 계약 V1

상태: `CHAPTER CONTRACT LOCK V1`

## 기본 계약

- `CHAPTER_ID`: `m30-day13-current-household-budget`
- `DAY`: 13
- `TIME_WINDOW`: 아침~늦은 오후
- `LOCATION`: 집 식탁 → 동네 마트 → 동네 카페 → 집 식탁
- `PARTICIPANTS`: 주인공, 이하은(23세)
- `PREREQUISITES`: DAY 12 완료, `day13CurrentHouseholdBudgetPending=true`, 기본 금융 확인 해금, 투자 잠금 유지
- `PREVIOUS_CHOICE_REFERENCES`: `day12VerifyStrategy`, `day12ExpenseStrategy`, `day12AccessStrategy`의 3×3×3 조합
- `CHAPTER_TYPE`: 일상/금융/관계 경계 하이브리드
- `DRAMATIC_PURPOSE`: 과거의 분담 비율을 복원하지 않고 확인된 개인 책임, 새로 동의한 공동 항목, 보호된 예비비와 보류 항목으로 현재 가계 예산을 만든다.
- `TARGET_PLAYTIME`: 보통 읽기 8~10분, 선택 반응과 콜백 포함 상한 12분
- `TARGET_EMOTIONAL_CURVE`: 생활 농담의 가벼움 → 숫자를 나누는 조심스러움 → 부담 방식의 작은 마찰 → 사생활 경계 확인 → 합의된 안도
- `FOLLOW_UP_HOOK`: `day14-current-choice-spending`

## 장면의 즉시 욕구

- 주인공 `WANTS`: 확인된 현재 정보만으로 실행 가능한 주간 예산과 중단 가능한 검토 규칙을 만든다.
- 주인공 `FEARS`: 연인 관계, 과거 관행, 보이는 잔액을 근거로 미확인 비용·자동이체·투자 권한까지 묶는 것.
- 하은 `WANTS`: 같이 사는 생활의 실용성을 확보하되 각자의 소유권·사생활·변경권을 지킨다.
- 하은 `FEARS`: 돌봄이나 친밀함이 전면 계정 공개, 자동 균등 부담, 상대 대신 결정하는 권한으로 바뀌는 것.

## Voice Profile

### 주인공

- 문장은 짧고 구체적이다. `누가 냈는가`, `무엇에 쓰는가`, `지금 동의했는가`를 분리해 묻는다.
- 관찰 → 가능한 분류 → 현재 가격·명의 확인 → 판단 → 기록 순서를 지킨다.
- 감정은 잔액 전체를 열지 않거나 자동이체 버튼을 누르지 않는 행동으로 드러낸다.
- 농담을 길게 받지 않지만 하은의 가벼운 말에 마른 한마디로 응답한다.
- 하은을 심문하지 않고 과거 기억을 현재 책임의 증거로 쓰지 않는다.

### 이하은

- 먼저 장바구니 카드와 색 라벨을 꺼내며 대화를 연다. 주인공보다 조금 더 말한다.
- 실용적인 비유와 한 번의 가벼운 농담으로 무거운 숫자를 생활 언어로 바꾼다.
- `우리 원래 반씩 냈어`를 주장하지 않는다. 과거 기억이 떠올라도 현재 동의와 구분한다.
- 전면 공개·균등 부담·자동 결제를 친밀함의 증명으로 요구하지 않는다.
- 숨김·거짓말·수상한 정지 표정 없이 밝고 다정한 생활 파트너로 행동한다.

## 지식 장부

### 주인공

- `KNOWS`: DAY 12에서 공식 확인한 현재 계정, 명세, 고정 생활비, 선택한 접근 범위와 투자 잠금.
- `BELIEVES`: 함께 사용하는 항목과 공동 소유·공동 부담은 서로 다른 판단이다.
- `SUSPECTS`: 일부 비용은 과거에 함께 썼을 수 있으나 현재 책임 비율은 새로 정해야 한다.
- `DOES_NOT_KNOW`: 사고 전 분담 합의의 정확한 내용, 오래된 비용의 최종 소유권, 하은의 전체 개인 지출.
- `HIDES`: 없음.
- `LIES_ABOUT`: 없음.
- `MISREMEMBERS`: 기억이 없는 영역을 추정으로 채우지 않는다.
- `WANTS`: 현재 주간 예산, 항목별 책임, 검토 주기와 사생활 경계.
- `FEARS`: 예산 합의가 송금·자동이체·투자 실행으로 자동 확대되는 것.

### 이하은

- `KNOWS`: 자신이 현재 부담하는 비용, 이번 주 필요한 식재료·생활품, DAY 12에서 합의한 확인·분류·접근 규칙.
- `BELIEVES`: 공동생활은 공동 항목을 만들 수 있지만 모든 돈을 공동으로 만들지는 않는다.
- `SUSPECTS`: 과거에는 다른 분담 방식이 있었을 수 있으나 지금 그대로 적용하면 안 된다.
- `DOES_NOT_KNOW`: 주인공의 전체 개인 거래, 공식 확인되지 않은 과거 비용의 법적 의미, 투자 판단 권한.
- `HIDES`: 플레이 결정에 필요한 현재 사실을 숨기지 않는다.
- `LIES_ABOUT`: 없음.
- `MISREMEMBERS`: 과거 분담 기억을 현재 증거로 제시하지 않는다.
- `WANTS`: 실제 장보기와 생활 운영에 쓸 수 있는 작은 공동 예산.
- `FEARS`: 자신의 돌봄이 감시나 경제적 대리권으로 해석되는 것.

## 정보 공개 예산

### MUST REVEAL

- DAY 12에서 확인된 개인 고정비와 이번 주 새로 동의한 공동 항목만 현재 예산에 들어간다.
- `개인 고정비`, `공동 합의 후보`, `확인 보류`, `보호 예비비`는 다른 권한의 칸이다.
- 예산 합의와 결제·송금·자동이체 실행은 분리된다.
- 공동 장부의 합계·증빙·검토 주기와 개인 거래 공개 범위는 별도로 합의한다.

### MAY REVEAL

- 같은 금액 부담, 항목별 책임, 현재 여유 범위 제안은 각각 장단점이 있는 전략이다.
- 마트의 현재 가격과 실제 필요 목록은 예산 범위를 좁히는 검증 자료가 된다.
- 공동 항목을 투명하게 관리하면서도 개인 거래는 닫아 둘 수 있다.

### MUST NOT REVEAL

- 하은의 잠금 프로필, 정체 반전, 사고 원인, 후반 인물 연결.
- DAY 11 일정 차이를 거짓말·범죄·고의 사고의 근거로 확정하는 해석.
- 미확인 과거 비용을 공동 자산이나 채무로 확정하는 법적 판단.
- 윤서진의 `AFFECTION` 또는 `STATUS_INTEREST` 수치·변화.

### PLAYER MAY SUSPECT

- 과거에 둘의 분담 방식이 지금과 달랐을 수 있다.
- 단, DAY 13에는 새 미스터리 단서를 추가하지 않고 `day11ScheduleNoteMismatch=unverified`를 그대로 보존한다.

## DAY 12 3×3 콜백 계약

### 확인 전략 → 예산 초안의 출처

- `account12_verify_owner_statement`: 공식 명의가 확인된 개인 고정비를 첫 줄에 둔다.
- `account12_verify_support_call`: 접근 가능한 정보와 변경 권한을 구분한 채 문의 결과를 예산 메모에 붙인다.
- `account12_verify_living_entries`: 직접 대조한 생활비 세 건만 공동 후보 카드로 옮긴다.

### 생활비 분류 전략 → 마트·카페 분류 방식

- `account12_expense_personal_only`: 개인 책임이 확인된 비용을 기준선으로 삼고 공동 항목은 새로 만든다.
- `account12_expense_shared_unconfirmed`: 공동처럼 보이는 과거 비용은 `확인 보류`에 남긴다.
- `account12_expense_source_labels`: 결제 계정·사용 목적·확인자를 항목별 라벨로 이어 쓴다.

### 접근 전략 → 실행·검토 경계

- `account12_access_read_only`: 읽기 전용 자료로 계획만 만들고 결제 실행은 잠근다.
- `account12_access_monthly_review`: 월 1회 계정 검토와 주간 예산 변경 검토를 서로 다른 주기로 기록한다.
- `account12_access_separate_investment`: 생활 예산에서 투자·저축 이동 항목을 완전히 제외한다.

각 축은 최소 한 번의 행동 또는 대사로 회수하며 DAY 13 선택 결과나 관계 수치로 덮어쓰지 않는다.

## 8 Beat 구조 계약

1. `ENTRY`: DAY 12 읽기 전용 장부와 네 종류의 빈 예산 칸을 식탁에 펼친다.
2. `NORMAL INTERACTION`: 하은이 장바구니 카드에 필요한 식재료·세제를 적고 생활 농담으로 긴장을 낮춘다.
3. `CHOICE 1`: 개인 기준선·필수 공동품·보호 예비비 중 예산의 첫 기준을 고른다.
4. `DEVELOPMENT`: 동네 마트에서 현재 가격과 실제 필요 수량을 확인하고 불필요 항목을 직접 뺀다.
5. `CHOICE 2 / COMPLICATION`: 예상 합계가 나온 뒤 항목 책임·확인된 균등 부담·현재 여유 제안 중 부담 방식을 정한다.
6. `EXPLORATION`: 카페에서 과거 비율 대신 이번 주 책임을 장부에 적고, 예산과 실행 권한을 분리한다.
7. `CHOICE 3 / CONSEQUENCE`: 합계만 공유·항목별 영수증 동의·주간 변경 검토 중 공동 장부의 사생활 경계를 정한다.
8. `EXIT HOOK`: 집에서 실행하지 않은 예산을 저장하고 DAY 14의 안전한 실제 소비 시험으로 연결한다.

각 Beat는 30~90초마다 장소·물건·정보·선택·목표 중 하나를 바꾼다. 다음 관문의 완전 대본은 이 구조를 요약으로 대체하지 않는다.

## 선택·상태 계약

- 선택 1: `budget13_base_verified_personal` / `budget13_base_shared_essentials` / `budget13_base_protected_buffer` → `day13BaseStrategy`, stage 1, `current-budget-base`.
- 선택 2: `budget13_contribution_item_owner` / `budget13_contribution_equal_confirmed` / `budget13_contribution_capacity_review` → `day13ContributionStrategy`, stage 2, `shared-expense-consent`.
- 선택 3: `budget13_review_totals_only` / `budget13_review_receipt_consent` / `budget13_review_weekly_changes` → `day13ReviewStrategy`, stage 3, `current-household-budget`, `household-buffer-boundary`.
- 완료: `day13CurrentHouseholdBudgetCompleted=true`, `day14CurrentChoiceSpendingPending=true`, `day14-current-choice-spending`.
- 불변: 하은 관계 수치, 윤서진 `AFFECTION`/`STATUS_INTEREST`, DAY 12 세 선택, 투자 잠금, 기존 단서.

## 관계·단서 예산

- `RELATIONSHIP_CHANGES_ALLOWED`: 선택에 따른 말투·협업 방식·생활 기억. 수치 증감은 완전 대본 관문에서 명시하지 않는 한 0.
- `CLUE_CHANGES_ALLOWED`: `current-household-budget-record` 생활 기록 1개. 미스터리 단서 신규 0.
- `PROFILE_UNLOCKS_ALLOWED`: 0.
- `FINANCE_UNLOCKS_ALLOWED`: 현재 예산·공동 항목 동의 기능만. 송금·자동이체·투자 기능은 잠금.

## 저장 복원 계약

- stage 0: 집 식탁, 예산 기준 선택 전.
- stage 1: 첫 기준 반응 뒤, 마트의 부담 방식 선택 전.
- stage 2: 부담 방식 반응 뒤, 카페의 장부 공개 범위 선택 전.
- stage 3: 집 식탁의 완료 반응과 자유행동 진입 가능 상태.
- 복원 시 DAY 12 3축과 DAY 11 미확인 일정 단서, 하은 관계, 윤서진 두 축, 금융·투자 잠금을 바꾸지 않는다.

## 계약 판정

- 챕터 계약·Voice Profile·지식 장부: PASS
- 8 Beat·3전략·3×3 콜백·정보 예산·저장 계약: PASS
- 완전 플레이 대본: PASS
- 자체 내러티브 QA·정적 계약 검사: PASS
- NEEDS FIX: 0
