# 《결혼까지 30일!》 DAY 2 — 이미지 일관성·품질 QA

상태: `PHASE 17 COMPLETE / NEEDS FIX 0 / RUNTIME CONNECTION DEFERRED TO PHASE 20`

기준:

- `docs/day2/DAY2_SCENARIO_REVISION_V1.md` (`DAY 2 — SCENARIO LOCK`)
- `docs/day2/DAY2_BACKGROUND_ASSET_SPEC.md`
- `docs/day2/DAY2_CHARACTER_EXPRESSION_SPEC.md`
- `docs/day2/DAY2_CHARACTER_POSE_SPEC.md`
- `docs/day2/DAY2_EVENT_CG_SPEC.md`
- `docs/day2/DAY2_ASSET_AUDIT.md`

검수에는 `$marriage-30-narrative-director`, `$marriage-30-chapter-story-writer`의 지식·감정·정보 공개 기준과 내장 ImageGen의 비파괴 편집 절차를 적용했다.

## 1. 최종 판정

- 배경 7종: PASS. 병원 → 차량 → 집의 낮·늦은 오후 광원과 장소 기능이 이어지고 읽을 수 있는 병원명·주소·브랜드가 없다.
- 이벤트 CG 4종: PASS. 큰 집 열쇠, 가족 3인, 하은과 주인공의 시선 차이, 세 칸 기록 원칙이 조기 반전 없이 읽힌다.
- 하은 신규 포즈 9종: PASS. 승인된 보라색 단발·눈·베이지 외출복을 유지하고 지원·보행·운전·열쇠·사진·대기·작별 동작을 투명 레이어로 분리했다.
- 1인칭 동작 10종: PASS. 손·난간·문서·큰 열쇠·사진·방 탐색·작은 열쇠 촬영·세 칸 메모·임시 예비폰이 투명 레이어로 분리됐다.
- DAY 1 재사용 후보: PASS. 하은 표정 5종, 기본 몸통 4종, 의사 2포즈, 간호사 1포즈는 DAY 1 승인본을 그대로 사용한다.
- 최종 NEEDS FIX: 0. 중간 실패 후보와 원본 시트는 출처·재처리용으로 남기며 PHASE 20 런타임 후보 목록에서는 제외한다.

## 2. 발견 결함과 비파괴 수정

| 결함 | 수정 | 최종 파일 |
|---|---|---|
| 주인공 방 배경에 숫자 1~5 핫스폿이 픽셀로 포함됨 | 방 구조·소품·광원을 유지하고 숫자와 점선만 제거 | `assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png` |
| 엔딩 CG의 가족사진이 4인 익명 가족이고 커플사진의 하은이 갈색 장발임 | 승인된 가족 3인과 보라색 단발 하은·3/4 후면 주인공으로 교정, 불필요한 검은 기기 제거 | `assets/events/day2/cg-day2-three-column-resolve-v2.png` |
| 현관 CG의 중앙 9:16 크롭에서 하은 얼굴이 절반 잘림 | 16:9를 유지한 채 하은·열린 손·큰 열쇠를 중앙 안전 폭에 재배치 | `assets/events/day2/cg-day2-home-threshold-v2.png` |
| 하은 소스 시트에 불투명 그라데이션과 셀 간 파편이 남음 | 실제 알파 시트로 교정하고 셀별 최대 연결 요소를 분리 | `assets/characters/day2/haeun/poses/` 9종 |
| 하은 팔 받침 후보가 팔짱 자세로 생성됨 | 주인공 팔꿈치 아래만 받치고 다른 손과 보행 동선을 비운 독립 포즈 제작 | `haeun-day2-pose-forearm-support-2d-v3.png` |
| 운전 포즈가 승객·카메라 쪽을 봄 | 안전벨트·양손 핸들·도로 방향 시선을 가진 독립 포즈 제작 | `haeun-day2-pose-safe-driving-2d-v3.png` |
| 1인칭 소스 시트에 불투명 그라데이션·셀 파편이 남음 | 체크 배경 제거, 셀별 연결 요소 정리, 10상태 분리 | `assets/props/day2/pov/` 10종 |
| 병상 준비 동작의 흰 침구 일부가 배경과 함께 투명해짐 | 침구·난간·호출 버튼이 온전히 연결된 독립 투명 레이어 제작 | `pov-day2-gesture-bed-edge-prep-2d-v3.png` |
| 가족사진 손 레이어가 부모+어린아이 구성이었음 | 이벤트 CG와 같은 부모 2인+성인 주인공 3인 구성으로 교정 | `pov-day2-gesture-family-photo-hold-2d-v2.png` |

## 3. 최종 런타임 후보

### 배경

- `day2-recovery-corridor-morning-v1.png`
- `day2-hospital-lobby-day-v1.png`
- `day2-hospital-exit-day-v1.png`
- `day2-car-interior-day-v1.png`
- `day2-home-exterior-afternoon-v1.png`
- `day2-home-entry-living-afternoon-v1.png`
- `day2-protagonist-bedroom-afternoon-v2.png`

Scene 01·03·04의 병실은 `assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png`를 재사용한다.

### 이벤트 CG

- `assets/events/day2/cg-day2-home-threshold-v2.png`
- `assets/events/day2/cg-day2-family-photo-v1.png`
- `assets/events/day2/cg-day2-couple-photo-v1.png`
- `assets/events/day2/cg-day2-three-column-resolve-v2.png`

### 하은 포즈

- `support-offer-open-palm`, `forearm-support-v3`, `paced-walk-beside`
- `pack-and-present`, `safe-driving-v3`, `key-handover-step-aside`
- `photo-side-inspection`, `doorframe-permission-wait`, `departing-open-wave`

DAY 1 기본 포즈가 담당하는 `P01`, `P06`, `P09` 계열은 PHASE 18 큐에서 조합한다. 신규 포즈가 하은의 초반 수상함을 만들지 않도록 경직·은폐·문막기·위험 운전 포즈는 최종 후보에서 제외했다.

### 주인공 1인칭 동작

- `bed-edge-prep-v3`, `rail-grip-release`, `document-receive`
- `key-inspect-unlock`, `family-photo-hold-v2`, `couple-photo-turn`
- `search-interactions`, `small-key-classify`, `three-column-note`, `spare-phone-contact`

큰 집 열쇠는 일반 현관 키 크기이고 작은 열쇠는 휴대폰 촬영 화면 안의 평범한 미분류 물건으로만 보인다. Scene 11 기기는 터치 스마트폰이 아니라 화면이 꺼진 임시 키패드 예비폰이다.

## 4. 전수 검사 결과

| 영역 | 결과 | 근거 |
|---|---|---|
| 얼굴·헤어·나이 인상 | PASS | 하은은 동일한 보라색 턱선 단발·보라색 눈·23세 인상을 유지한다 |
| 의상 연속성 | PASS | 병원부터 집까지 베이지 후드 외투·흰 상의·진청 바지·흰 운동화가 유지된다 |
| 손·관절·소품 | PASS | 주요 손은 5지와 잡는 방향이 읽히며 큰 열쇠·사진·문서·메모·예비폰이 구분된다 |
| 실제 알파 | PASS | 최종 캐릭터 9종과 1인칭 10종이 RGBA이며 알파 extrema `(0, 255)`를 통과했다 |
| 셀 분리 | PASS | 연결 요소 정리 뒤 이웃 셀의 발·소매·세로 파편이 합성 미리보기에서 제거됐다 |
| 공간·광원 | PASS | 병원은 낮, 집은 늦은 오후이며 현관·거실·방의 목재·문·광원 방향이 이어진다 |
| 텍스트·브랜드 | PASS | 이미지 내부에 대사·주소·병원명·브랜드·D-29·읽을 수 있는 메시지가 없다 |
| 미스터리 정보 | PASS | 사고 세부·하은 잠금 프로필·후반 정체·작은 열쇠 용도를 확정하지 않는다 |
| 모바일 중앙 크롭 | PASS | 9:16 접촉면에서 장소 기능, 가족 3인, 커플 시선, 큰 열쇠·하은, 세 칸 메모가 남는다 |
| 하단 UI 영역 | PASS | 배경·CG 하단의 핵심 얼굴·사진·메모가 대화 UI로 완전히 가려지지 않는다 |

검수 접촉면:

- `docs/day2/qa/day2-haeun-poses-composite.png`
- `docs/day2/qa/day2-pov-gestures-composite.png`
- `docs/day2/qa/day2-backgrounds-mobile-crop.png`
- `docs/day2/qa/day2-events-mobile-crop.png`

## 5. 생성·후처리 기록

- 내장 ImageGen 편집을 사용했다. 프롬프트는 `원본 구도·장면 정보 보존`, `지정 결함만 수정`, `하은의 승인 얼굴·의상`, `도로 주시`, `허락된 팔꿈치 지지`, `실제 투명 알파`, `중앙 9:16 안전 폭`, `조기 반전·텍스트·UI 금지`를 고정했다.
- 프로젝트에 반영한 원본 출력은 Codex 생성 폴더의 `exec-4eb1e7d7...`, `exec-37d2c0a1...`, `exec-9bbd0ab0...`, `exec-acddd589...`, `exec-916427d2...`, `exec-9ae5665b...`, `exec-0ab5f31e...`, `exec-914a3457...`, `exec-9ffa509b...`다.
- `scripts/process-day2-assets.py`가 실제 알파 정규화, 체크 배경 제거, 3×3·5×2 셀 분리, 연결 요소 정리, 합성 접촉면과 9:16 접촉면 생성을 재현한다.
- 세로형 현관 CG 시도 `exec-9498c678...`은 16:9 계약을 위반해 프로젝트에 복사하지 않고 폐기 후보로 남겼다.
- 기존 `-v1` 원본과 소스 시트는 덮어쓰거나 삭제하지 않았다. PHASE 20은 이 문서의 최종 런타임 후보만 사용한다.

## 6. 관문 결론

PHASE 17의 얼굴·의상·손·알파·공간 연속성·텍스트·모바일 안전 영역·정보 공개 검사를 모두 통과했다. 런타임 연결은 아직 하지 않았으며 다음 관문은 PHASE 18 Scene별 애니메이션·연출 명세다.

검증 결과:

- `python scripts/process-day2-assets.py`: PASS, 하은 9종·1인칭 10종 재처리와 접촉면 4종 재생성.
- Pillow 정적 검사: PASS, 배경 7종·CG 4종은 1672×941, 최종 스프라이트 19종은 RGBA·알파 `(0, 255)`.
- `node tests/day2-scenario-draft.test.mjs`: PASS, 12 Scene·27,216경로·5,362~5,678자.
- `node --check game.js`, `node --check src/story-data.mjs`: PASS.
- `node tests/simulation.test.mjs`: 전체 회귀 PASS.
