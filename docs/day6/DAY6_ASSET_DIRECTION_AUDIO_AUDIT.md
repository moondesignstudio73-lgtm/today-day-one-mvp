# DAY 6 기존 에셋·연출·오디오 감사

기준 시나리오: `DAY6_SCENARIO_DRAFT_V1.md`  
목표: 신규 자산을 만들지 않고 기존 자산으로 밝고 생활적인 동네 외출을 구성하되, 장소를 잘못 표현하는 재사용은 피한다.

## 감사 결론

- **재사용 확정:** 집 아침, 주거 상가 거리, 작은 카페, 도심 공원, 하은 기본/미소/휴대폰 스프라이트.
- **재사용 제외:** `048_department-food.png`는 백화점 식품관이라 소박한 동네 마트와 규모·가격대가 다르다. 마트 내부로 위장해 쓰지 않는다.
- **약국·마트 처리:** 현재 장면은 `neighborhood-street-day`에서 외관과 출입을 보여 주고, 처방 봉투·장바구니·영수증을 대사와 소품 클로즈업으로 전달한다. 존재하지 않는 내부 배경을 암시하는 와이드 숏은 금지한다.
- **향후 선택 자산:** 전용 제작이 승인되면 작은 동네 약국 카운터와 중형 생활 마트 통로를 추가할 수 있다. DAY 6 런타임 연결에는 필수가 아니다.
- **톤:** `daily`와 `dateShopping`만 사용한다. 불안·위기·미스터리 BGM, 의심을 유도하는 하은 표정, 급격한 줌과 글리치는 금지한다.

## 기존 파일 판정

| 용도 | 등록 ID | 파일 | 판정 |
|---|---|---|---|
| 집 출발·귀가 지도 | `home-morning` | `assets/backgrounds/morning-studio-2d.png` | 재사용 |
| 동네 길·약국/마트 외관 | `neighborhood-street-day` | `assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png` | 재사용 |
| 동네 카페 | `neighborhood-cafe-day` | `assets/backgrounds/map-locations/004_small-cafe.png` | 재사용 |
| 작은 공원 산책 | `neighborhood-park-day` | `assets/backgrounds/map-locations/035_running-park.png` | 재사용 |
| 하은 생활 표정 | `girlfriend` calm/smile | 기존 캐릭터 매니페스트 | 재사용 |
| 하은 예비폰 확인 | `girlfriend` calm + phone | 기존 캐릭터 매니페스트 | 재사용 |
| 백화점 식품관 | 미등록 | `assets/backgrounds/map-locations/048_department-food.png` | 마트 대체 사용 금지 |

모든 재사용 파일은 원본을 덮어쓰거나 이동하지 않는다. 새 ID 세 개는 기존 파일을 가리키는 읽기 전용 별칭이다.

## Scene별 연출 계약

| Scene | 화면·카메라 | 하은 | 전환 | BGM | SFX | 목적 |
|---|---|---|---|---|---|---|
| S01 집에서 동선 짜기 | 집, medium | calm/phone | fade | daily 0.075 | 예비폰 키 | 함께 계획하되 주도권 선택 준비 |
| S02 첫 갈림길 | 거리, wide | smile/standing | crossfade | daily 0.070 | 자동문 | 세 경로 전략의 실제 거리감 제시 |
| S03 약국 | 거리 외관→봉투 medium | calm/standing | cut | daily 0.065 | 서류 수령 | 회복 루틴을 생활 행동으로 처리 |
| S04 마트 | 거리 외관→장바구니 close | smile/standing | crossfade | dateShopping 0.070 | 가방 지퍼 | 장보기 전략 차이를 소품과 반응으로 표시 |
| S05 카페 | 카페, medium | smile/standing | crossfade | dateShopping 0.065 | 컵 내려놓기 | 과거 회상 대신 지금의 합의 형성 |
| S06 업무 메시지 | 같은 카페, phone close | calm/phone | cut | daily 0.055 | 예비폰 키 | DAY 5 업무 경계를 현재 행동으로 콜백 |
| S07 공원·데이트 계획 | 공원, wide | smile/standing | crossfade | dateShopping 0.075 | 없음 | 서로 다른 데이트 전략을 안전하게 합의 |
| S08 집 지도 완성 | 집, 지도 close | smile/standing | fade | daily 0.070 | 연필 메모 | 선택 결과를 지도와 DAY 7 훅으로 고정 |

## 선택·콜백 연출

- 경로 선택은 카메라 공포 연출이 아니라 동선과 물리적 거리 변화로 구분한다.
- 장보기 선택은 동일한 `close-prop` 구도에서 예산표, 비교 메모, 역할 분담 목록 중 무엇을 강조하는지로 구분한다.
- 데이트 선택은 하은의 미소를 유지하되, `revisit_with_opt_out`은 한 걸음 여유를 둔 구도, `alternate_choices`는 지도 위 두 표식을 번갈아 잡는 구도로 반응시킨다.
- DAY 5의 `request-current-briefing`, `rebuild-social-context`, `set-return-boundary`는 S06의 휴대폰 거리와 주인공의 응답 문장으로만 콜백한다. 윤서진의 두 수치를 화면 효과로 결합하지 않는다.
- 선택 직후와 중간 저장 재개 시 같은 Scene ID의 배경·표정·포즈·BGM이 복원되어야 한다.

## 품질·스포일러 금지선

- 약국과 마트의 미보유 내부를 백화점·편의점 등 다른 업종 이미지로 대체하지 않는다.
- 하은에게 tense/worried 표정을 배정하거나 숨은 진실을 암시하는 조명·음향을 넣지 않는다.
- 원래 휴대폰이 돌아온 것처럼 보이는 연출은 금지한다. S01·S06의 phone 포즈는 임시 예비폰이다.
- 공원 Scene은 첫 현재형 데이트 계획의 온도만 올리며 사고·결혼식 반전·잠금 프로필을 공개하지 않는다.

결론: **PASS**. 기존 자산만으로 8개 Scene의 의미와 톤을 보존할 수 있으며, 전용 약국·마트 내부는 필수가 아닌 후속 개선 후보로 분리한다.
