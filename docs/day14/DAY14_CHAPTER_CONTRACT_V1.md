# 《결혼까지 30일!》 DAY 14 — 지금 고르는 것 · 챕터 계약 V1

상태: `CHAPTER CONTRACT LOCK V1`

## 기본 계약

- `CHAPTER_ID`: `m30-day14-current-choice-spending`
- `DAY`: 14
- `TIME_WINDOW`: 아침~늦은 오후
- `LOCATION`: 집 식탁 → 생활용품점 → 동네 마트 계산대 → 동네 카페 → 집
- `PARTICIPANTS`: 주인공, 이하은(23세)
- `PREREQUISITES`: DAY 13 완료, `day14CurrentChoiceSpendingPending=true`, 현재 예산·기본 금융 해금, 자동결제·고가 구매·투자 잠금
- `PREVIOUS_CHOICE_REFERENCES`: `day13BaseStrategy`, `day13ContributionStrategy`, `day13ReviewStrategy`의 3×3×3 조합
- `CHAPTER_TYPE`: 일상/관계 경계/가벼운 미스터리 하이브리드
- `DRAMATIC_PURPOSE`: 현재 예산 안에서 개인·공동·선물 소비의 소유권과 동의를 실제 한 품목에 적용하고, 사지 않거나 미룰 권리를 포함한 안전한 일반 쇼핑 범위를 연다.
- `TARGET_PLAYTIME`: 보통 읽기 8~10분, 선택 반응·콜백 포함 상한 12분
- `TARGET_EMOTIONAL_CURVE`: 생활 농담의 기대 → 지금 취향을 고르는 어색함 → 할인 압박 속 침착한 검증 → 작은 추천 기록의 위화감 → 동의와 거절권을 확인한 안도
- `FOLLOW_UP_HOOK`: `day15-current-leisure-date`

## 장면의 즉시 욕구

- 주인공 `WANTS`: 지금 필요한 한 품목을 직접 선택하고, 소유자·예산 칸·반품 조건·선물 동의를 구매 전에 확정한다.
- 주인공 `FEARS`: 과거 취향 추천, 할인 문구, 연인 관계가 필요 수량이나 구매 권한을 대신 결정하는 것.
- 하은 `WANTS`: 주인공이 과거의 정답을 맞히는 시험 없이 현재 취향을 발견하고, 함께 쓰는 물건과 선물에도 거절권을 갖게 한다.
- 하은 `FEARS`: 자신의 기억이나 배려가 주인공 대신 고르는 권한, 전면 구매 기록 공개, 지출로 애정을 증명하는 의무로 바뀌는 것.

## Voice Profile

### 주인공

- 문장은 짧고 구체적이며 `필요한가`, `누가 쓰는가`, `누가 결제하는가`, `반품할 수 있는가`를 분리한다.
- 진열대와 앱 문구를 관찰하고 출처 가능성을 나눈 뒤 공식 가격·현재 사용감을 확인하고 판단한다.
- 과거 선호 추천이 떠도 하은을 추궁하지 않고 계정·기기·공동 장바구니 등 가능한 출처를 먼저 구분한다.
- 할인과 적립을 이익으로 단정하지 않고 필요한 수량과 총액으로 되묻는다.
- 하은의 농담에는 마른 한마디로 응답하며 선택을 바꾸거나 사지 않는 결정을 실패로 취급하지 않는다.

### 이하은

- 먼저 세 소비 칸을 펼치고 생활용품점 동선을 제안하며 대화를 조금 더 이끈다.
- 가벼운 생활 농담으로 취향을 고르는 어색함을 낮추되 과장된 감탄사는 쓰지 않는다.
- 과거의 주인공 취향을 정답처럼 알려 주거나 자신이 더 잘 안다는 우위를 행사하지 않는다.
- 출처 불명 추천에는 즉시 해명극을 만들지 않고 공동 장바구니·과거 기기 등 평범한 가능성을 함께 확인한다.
- 선물·공동품·개인품을 애정의 크기로 환산하지 않으며 거절·수정·보류를 자연스럽게 받아들인다.

## 지식 장부

### 주인공

- `KNOWS`: DAY 13의 현재 예산, 선택한 기준·부담·검토 범위, 기본 금융만 열렸고 자동결제·고가 구매·투자가 잠겨 있다는 사실.
- `BELIEVES`: 소비 가능성과 구매 필요, 공동 사용과 공동 소유, 선물 의도와 상대 동의는 각각 다른 판단이다.
- `SUSPECTS`: 과거 선호 추천은 오래된 계정·공동 장바구니·기기 이력 중 하나에서 왔을 수 있으나 출처는 확인되지 않았다.
- `DOES_NOT_KNOW`: 사고 전 자신의 정확한 브랜드 취향, 추천 데이터의 사용자·시점·기기 출처, 하은의 전체 구매 기록.
- `HIDES`: 없음. 추천 문구를 보았다는 사실을 필요한 범위에서 하은과 공유한다.
- `LIES_ABOUT`: 없음.
- `MISREMEMBERS`: 기억 공백을 현재 취향이나 구매 근거로 채우지 않는다.
- `WANTS`: 한 품목의 현재 선택 근거와 안전 결제 규칙.
- `FEARS`: 소비 기록이 기억 증명·관계 증명·전면 계정 공개로 확장되는 것.

### 이하은

- `KNOWS`: DAY 13의 현재 예산 규칙, 오늘 필요한 생활품 후보, 자신이 현재 받고 싶지 않거나 바꿀 수 있는 선물 범위.
- `BELIEVES`: 과거에 좋아했던 물건도 지금 다시 고를 수 있으며 선물에는 거절권이 포함돼야 한다.
- `SUSPECTS`: 과거 선호 추천은 자신이나 공동 구매 이력이 섞였을 수 있으나 정확한 출처는 모른다.
- `DOES_NOT_KNOW`: 추천 시스템의 계정 병합 방식, 주인공의 현재 개인 취향, 주인공의 전체 개인 거래.
- `HIDES`: 플레이 결정에 필요한 현재 구매 사실을 숨기지 않는다.
- `LIES_ABOUT`: 없음.
- `MISREMEMBERS`: 과거 취향 기억을 현재 선택의 증거로 제시하지 않는다.
- `WANTS`: 작은 쇼핑을 두 사람의 현재형 생활 경험으로 만들고 다음 여가의 현실적인 범위를 준비한다.
- `FEARS`: 친밀함이 구매 기록 접근권이나 선물 의무로 해석되는 것.

## 정보 공개 예산

### MUST REVEAL

- 개인 물건·공동 생활품·선물은 구매 전에 소유권과 예산 칸을 따로 정한다.
- 일반 쇼핑은 소액 한도·한 품목·현재 가격·반품 조건·자동결제 금지 안에서만 열린다.
- 선물은 품목·가격 범위·거절권·수정 가능한 위시리스트 중 선택한 동의 규칙을 따른다.
- DAY 13 예산의 남은 금액은 추가 구매 허가가 아니다.

### MAY REVEAL

- 생활용품점 추천 화면에 과거 선호처럼 보이는 브랜드 한 건이 뜨지만 사용자·시점·기기 출처는 비어 있다.
- 주인공은 오래된 본인 기록, 공동 장바구니, 하은의 구매가 섞였을 가능성을 열어 두고 현재 물건 선택과 분리한다.
- `day14PastPreferenceRecommendation=unverified`는 작은 위화감이며 하은의 진술이나 사고와 연결해 판단하지 않는다.

### MUST NOT REVEAL

- 후반 정체 정보, 사고 원인·고의성, 잠금 프로필, 후반 인물 연결.
- 출처 불명 추천을 하은의 기만·감시·범죄 증거로 단정하는 해석.
- 추천 브랜드를 주인공의 확정 과거 취향 또는 공동 소유 증거로 취급하는 판단.
- 윤서진의 `AFFECTION` 또는 `STATUS_INTEREST` 수치·변화.

### PLAYER MAY SUSPECT

- 과거의 소비 기록이 현재 계정이나 공동 장바구니에 일부 남아 있을 수 있다.
- 다만 추천 한 건에는 오래된 기기·계정 병합·공동 구매라는 충분한 일상적 설명이 있고, 결론은 `unverified`로 남는다.

## DAY 13 3×3 콜백 계약

### 예산 기준 → 소비 범위 선택

- `budget13_base_verified_personal`: 개인 물건 후보는 확인된 개인 소액 한도에서만 고른다.
- `budget13_base_shared_essentials`: 공동품 후보는 DAY 13에서 합의한 한 생활 항목으로 제한한다.
- `budget13_base_protected_buffer`: 보호 예비비를 잔액이나 추가 쇼핑 가능액으로 계산하지 않는다.

### 부담 방식 → 결제 전 소유권 확인

- `budget13_contribution_item_owner`: 품목마다 사용자·결제자·다음 구매 책임을 분리해 적는다.
- `budget13_contribution_equal_confirmed`: 공동 확인된 한 품목에만 합의 금액을 적용한다.
- `budget13_contribution_capacity_review`: 각자의 여유 범위를 평가나 비교 없이 이번 구매에만 적용한다.

### 검토 범위 → 구매 기록·선물 동의

- `budget13_review_totals_only`: 합계 확인을 이유로 개인 구매 내역 전체를 연결하지 않는다.
- `budget13_review_receipt_consent`: 오늘 산 한 품목의 영수증만 해당 동의 범위에서 연다.
- `budget13_review_weekly_changes`: 오늘 새로 생긴 구매 규칙과 변경점만 다음 검토 기록에 남긴다.

각 축은 최소 한 번의 행동 또는 대사로 회수하며 DAY 14 선택 결과나 관계 수치로 덮어쓰지 않는다.

## 8 Beat 구조 계약

1. `ENTRY`: 집에서 DAY 13 현재 예산의 소액 개인·공동 한 항목·선물 후보 칸을 펼친다.
2. `NORMAL INTERACTION`: 하은이 필요한 생활품과 각자의 작은 후보를 적고 과거 취향 맞히기를 오늘의 선택으로 바꾼다.
3. `CHOICE 1`: 개인 물건·합의된 공동품·사전 질문한 선물 중 오늘 시험할 소비 범위를 고른다.
4. `DEVELOPMENT`: 생활용품점에서 현재 가격·사용감·반품 조건을 확인하고 출처 불명 과거 선호 추천 한 건을 발견한다.
5. `EXPLORATION / CHOICE 2`: 추천 출처를 미확인으로 분리한 뒤 한 품목·대기 후 재확인·영수증 소유자 선지정 중 구매 전략을 고른다.
6. `CONSEQUENCE`: 카페에서 한 장의 영수증에 소유자·예산 칸·현재 선택 이유·반품 기한을 기록한다.
7. `CHOICE 3`: 선물 사전 질문·수정 가능한 위시리스트·오늘 선물 보류 중 동의 범위를 정한다.
8. `EXIT HOOK`: 집에서 안전한 일반 쇼핑을 열고 자동결제·고가 구매·투자를 잠근 채 DAY 15 현재형 여가 후보로 연결한다.

각 Beat는 30~90초마다 장소·물건·정보·선택·목표 중 하나를 바꾼다. 완전 대본은 추천 위화감의 발견→가능성 분리→현재 선택→기록 과정을 요약으로 생략하지 않는다.

## 선택·상태 계약

- 선택 1: `spend14_lane_personal` / `spend14_lane_shared` / `spend14_lane_gift` → `day14LaneStrategy`, stage 1, `current-choice-spending`.
- 선택 2: `spend14_purchase_one_item` / `spend14_purchase_wait_compare` / `spend14_purchase_receipt_owner` → `day14PurchaseStrategy`, stage 2, `controlled-shopping-checkout`.
- 선택 3: `spend14_consent_ask_first` / `spend14_consent_wishlist` / `spend14_consent_no_surprise` → `day14ConsentStrategy`, stage 3, `gift-consent-boundary`, `basic-online-shopping`.
- 완료: `day14CurrentChoiceSpendingCompleted=true`, `day15CurrentLeisureDatePending=true`, `shop=true`, `day15-current-leisure-date`.
- 불변: 하은 관계 수치, 윤서진 `AFFECTION`/`STATUS_INTEREST`, DAY 13 세 선택, `day11ScheduleNoteMismatch=unverified`, 자동결제·고가 구매·투자 잠금.

## 관계·단서 예산

- `RELATIONSHIP_CHANGES_ALLOWED`: 선택별 말투·구매 협업·선물 동의 기억. 수치 증감은 완전 대본 관문에서 명시하지 않는 한 0.
- `CLUE_CHANGES_ALLOWED`: 생활 기록 `current-choice-spending-record` 1개와 작은 위화감 `day14PastPreferenceRecommendation=unverified` 1개.
- `PROFILE_UNLOCKS_ALLOWED`: 0.
- `FEATURE_UNLOCKS_ALLOWED`: 안전한 일반 쇼핑만. 자동결제·고가 구매·투자 기능은 잠금.

## 저장 복원 계약

- stage 0: 집, 소비 범위 선택 전.
- stage 1: 첫 선택 반응 뒤, 생활용품점의 구매 전략 선택 전.
- stage 2: 구매 전략 반응 뒤, 집의 선물 동의 선택 전.
- stage 3: 완료 반응과 DAY 14 자유행동 진입 가능 상태.
- 각 선택 직후 전략 ID와 stage를 저장하고 동일 선택 재적용은 컬렉션을 중복 생성하지 않는다.
- 복원 시 DAY 13 3축, 하은 관계, 윤서진 두 축, 기존 미확인 단서, 금융·투자 잠금을 바꾸지 않는다.

## 계약 판정

- 챕터 계약·Voice Profile·지식 장부: PASS
- 8 Beat·3전략·DAY 13 3×3 콜백·정보 예산·저장 계약: PASS
- 완전 플레이 대본: PASS
- 자체 내러티브 QA·정적 계약 검사: PASS
- NEEDS FIX: 0
