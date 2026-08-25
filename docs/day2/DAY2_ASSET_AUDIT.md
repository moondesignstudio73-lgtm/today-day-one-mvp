# 《결혼까지 30일!》 DAY 2 — 기존 에셋 감사 및 후보 수급 기록

상태: `PHASE 16 COMPLETE / PHASE 17 QUALITY REVIEW REQUIRED`

감사 기준:

- `docs/day2/DAY2_BACKGROUND_ASSET_SPEC.md`
- `docs/day2/DAY2_CHARACTER_EXPRESSION_SPEC.md`
- `docs/day2/DAY2_CHARACTER_POSE_SPEC.md`
- `docs/day2/DAY2_EVENT_CG_SPEC.md`
- `assets/ART_DIRECTION.md`

감사일: 2026-08-25  
생성 방식: Codex 내장 `image_gen` (`illustration-story`, 프로젝트용 후보 자산)

## 1. 감사 결론

- DAY 1의 병실 배경, 하은 승인 얼굴·의상·표정 일부, 담당 의사·간호사는 DAY 2 병원 Scene에 직접 또는 제한 재사용할 수 있다.
- 기존 저장소에는 DAY 2의 회복 복도, 병원 로비·출입구, 낮 자동차 내부, 연결된 집 외관·거실·주인공 방을 모두 만족하는 배경이 없다.
- 기존 야간 집 배경과 하은 집 이벤트 이미지는 시간대·공간·주인공 집 소유 관계가 달라 직접 재사용하지 않는다. 화풍·구도 참고로만 보존한다.
- 이하은 DAY 2 표정 7상태 중 5상태는 DAY 1 승인 표정을 직접 재사용하고, `QUIETLY_PROUD`와 `SHYLY_PLEASED`는 `GENTLE_RESOLVE`와 `WARM_PLAYFUL`의 저강도 전환으로 우선 충족한다.
- 의료진 4표정·3포즈는 DAY 1 승인 파일을 재사용하고 Scene 03의 인계 서류만 별도 소품 레이어로 만든다.
- DAY 1 하은 포즈로 병상 대기·열린 거리·생활 대화는 충족할 수 있으나 보행·안전 운전·큰 열쇠 인계·사진 동행·현관 작별은 부족하다.
- 기존 렌더러는 DAY 2 배경·CG·포즈·플레이어 초상 합성을 아직 지원하지 않는다. 연결은 PHASE 20까지 금지한다.
- 감사 결과 배경 7, 이벤트 CG 4, 하은 포즈 소스 1, 1인칭 동작 소스 1의 총 13후보를 새 경로에 수급했다.
- 후보는 PHASE 17의 얼굴·손·알파·텍스트·공간 연속성·모바일 크롭 검사를 통과하기 전까지 최종 자산이 아니다.

## 2. 기존 배경 감사

| 파일/그룹 | 판정 | 근거 | 조치 |
|---|---|---|---|
| `assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png` | 직접 재사용 후보 | 1672×941, 병실 문·창·탁자·낮 광원이 Scene 01·03·04와 연속된다 | `day2-hospital-room-morning` 후보로 유지 |
| `day1-hospital-pov-ceiling-v1.png` | DAY 2 기본 배경 탈락 | 누운 환자 천장 시점이며 기립·귀가 준비 구도와 맞지 않는다 | DAY 1 전용 유지 |
| `assets/backgrounds/morning-studio-2d.png` | 주인공 방 탈락 | 원룸 구조와 생활 배치가 잠금본의 부모 집·복도·별도 방과 다르다 | 화풍 참고만 사용 |
| `assets/backgrounds/home/*` | 탈락 | NIGHT HOME이고 계층·공간이 DAY 2 오후 집과 다르다 | 자유 연애 모드 유지 |
| `assets/events/locations/haeun-home-*` | 탈락 | 하은의 집·야간·완성 이벤트 구도이며 인물이 이미지에 고정된다 | 참조만 사용, 런타임 미사용 |
| `assets/backgrounds/yuna/*`, `office/*`, `cafe/*`, `street/*` | 탈락 | 학교·회사·데이트 장소로 DAY 2 공간 계약을 충족하지 않는다 | 기존 모드 유지 |

## 3. 기존 하은·의료진 감사

### 하은 표정

| DAY 2 상태 | 기존 후보 | 판정 |
|---|---|---|
| `E01_CALM_ATTENTIVE` | `assets/characters/day1/haeun/expressions/haeun-expression-calm-attentive-2d.png` | 직접 재사용 |
| `E02_WARM_PLAYFUL` | `haeun-expression-warm-playful-2d.png` | 직접 재사용 |
| `E03_SOFT_VULNERABLE` | `haeun-expression-soft-vulnerable-2d.png` | 직접 재사용 |
| `E04_GENTLE_RESOLVE` | `haeun-expression-gentle-resolve-2d.png` | 직접 재사용 |
| `E05_APOLOGETIC_WORRIED` | `haeun-expression-apologetic-worried-2d.png` | 직접 재사용 |
| `E06_QUIETLY_PROUD` | `gentle-resolve`의 짧은 눈·입 강도 전환 | 신규 생성 보류, PHASE 18 전환으로 우선 해결 |
| `E07_SHYLY_PLEASED` | `warm-playful` 저강도·짧은 시선 이동 | 신규 생성 보류, 과한 홍조 없이 전환으로 해결 |

`girlfriend-standing-tense-2d.png`와 전화 포즈는 작은 열쇠·임시 예비폰을 수상하게 코딩하므로 DAY 2에서도 사용하지 않는다.

### 하은 포즈

- DAY 1의 `step-back-open`, `standing-bedside-restraint`, `light-banter`, `calendar-resolve`는 병실 열린 대기·생활 농담·거리 존중의 몸통 후보로 재사용한다.
- DAY 1 `cup-assist-open-palm`은 Scene 02의 허락 전 열린 손 참고로만 사용한다. 팔꿈치 지지는 신규 포즈 소스에서 판단한다.
- 안전 운전은 기존 하은 파일에 없고 자동차 배경과 별도 레이어가 필요하므로 신규 소스에 포함했다.
- 큰 열쇠 인계, 사진 옆 관찰, 방문 대기, 현관 작별은 신규 소스와 DAY 1 기본 몸통의 조합 가능성을 PHASE 17에서 판정한다.

### 의료진

- `assets/npcs/day1/doctor-record-and-explain-2d.png`, `doctor-bedside-assessment-2d.png`를 귀가 조건·기록 경로 설명에 재사용한다.
- `assets/npcs/day1/nurse-safety-guidance-2d.png`를 복약·보관품 인계 몸통에 재사용하고 약 봉투·비상 연락표·인계서만 별도 소품으로 처리한다.
- 회사원 NPC 폴백과 자유 연애 모드의 `hospital-nurse` 폴백은 의료 역할·복장이 잘못 읽히므로 사용하지 않는다.

## 4. 플레이어 초상·런타임 감사

- 온보딩에서 선택한 `state.player.image`가 프로필에 표시되지만 현재 이벤트 CG 내부에 합성하는 캔버스·마스크 파이프라인은 없다.
- `src/scene-presentation.mjs`는 `eventCgId`를 만들 수 있으나 DAY 2 CG URL·조건부 레이어·플레이어 초상 슬롯을 해석하지 않는다.
- `src/assets/asset-manifest.mjs`에는 DAY 2 배경 ID가 없고 `game.js`의 전용 세그먼트 연결은 DAY 1에만 존재한다.
- 사진 컷인은 고정 정면 남성 얼굴 대신 3/4 후면·옆얼굴 후보로 수급했다. PHASE 17에서 관찰 가능성이 충분하면 합성 없이 사용하고, 부족하면 PHASE 20의 플레이어 초상 합성을 구현하기 전에 별도 검증한다.
- 캠페인 하은 프로필 잠금과 자유 연애 `referenceImage`는 분리한다. DAY 2 CG가 자유 연애 프로필·직업·MBTI를 노출하면 불합격이다.

## 5. 신규 수급 후보

### 배경 7종

| 파일 | 규격 | 대상 ID | PHASE 16 판정 |
|---|---:|---|---|
| `assets/backgrounds/day2/day2-recovery-corridor-morning-v1.png` | 1672×941 RGB | `day2-recovery-corridor-morning` | 수급 완료, 복도·난간·휴식 지점 QA 대기 |
| `day2-hospital-lobby-day-v1.png` | 1672×941 RGB | `day2-hospital-lobby-day` | 수급 완료, 자동문·출구 연속성 QA 대기 |
| `day2-hospital-exit-day-v1.png` | 1672×941 RGB | `day2-hospital-exit-day` | 수급 완료, 로비·캐노피·승하차 동선 QA 대기 |
| `day2-car-interior-day-v1.png` | 1672×941 RGB | `day2-car-interior-day` | 수급 완료, 좌측 운전석·하은 스프라이트 공간 QA 대기 |
| `day2-home-exterior-afternoon-v1.png` | 1672×941 RGB | `day2-home-exterior-afternoon` | 수급 완료, 현관·우편함·블라인드 QA 대기 |
| `day2-home-entry-living-afternoon-v1.png` | 1672×941 RGB | `day2-home-entry-living-afternoon` | 수급 완료, 외관→현관→거실→복도 연속성 QA 대기 |
| `day2-protagonist-bedroom-afternoon-v1.png` | 1672×941 RGB | `day2-protagonist-bedroom-afternoon` | 수급 완료. 숫자형 핫스폿이 이미지에 포함돼 PHASE 17 `NEEDS FIX` 예상 |

### 이벤트 CG 4종

| 파일 | 규격 | 대상 ID | PHASE 16 판정 |
|---|---:|---|---|
| `assets/events/day2/cg-day2-home-threshold-v1.png` | 1672×941 RGB | `CG_DAY2_HOME_THRESHOLD` | 수급 완료, 큰 열쇠·하은 동일성·문 옆 거리 QA 대기 |
| `cg-day2-family-photo-v1.png` | 1672×941 RGB | `CG_DAY2_FAMILY_PHOTO_CUTIN` | 수급 완료, 부모 2명·3/4 후면 주인공·손 QA 대기 |
| `cg-day2-couple-photo-v1.png` | 1672×941 RGB | `CG_DAY2_COUPLE_PHOTO_CUTIN` | 수급 완료, 하은 카메라 시선·남성의 하은 시선 QA 대기 |
| `cg-day2-three-column-resolve-v1.png` | 1672×941 RGB | `CG_DAY2_THREE_COLUMN_RESOLVE` | 수급 완료, 무문자 세 칸·예비폰·조건부 열쇠 슬롯 QA 대기 |

### 소스 시트 2종

| 파일 | 규격 | 대상 | PHASE 16 판정 |
|---|---:|---|---|
| `assets/source-sheets/day2/haeun-day2-poses-v1.png` | 1024×1536 ARGB | 보행·지원·정리·운전·큰 열쇠·사진·대기·작별 9포즈 | 수급 완료. 시각상 불투명 그라데이션이 있어 알파·셀 수·손 QA 필수 |
| `assets/source-sheets/day2/pov-day2-gestures-v1.png` | 1536×1024 ARGB | 1인칭 손·난간·서류·열쇠·사진·메모·예비폰 10상태 | 수급 완료. 시각상 불투명 그라데이션이 있어 알파·셀 경계·손 QA 필수 |

## 6. 생성 출처 기록

| 프로젝트 파일 | 내장 생성 원본 |
|---|---|
| `day2-recovery-corridor-morning-v1.png` | `exec-71247e09-b7d8-477e-9186-0c731bda817a.png` |
| `day2-hospital-lobby-day-v1.png` | `exec-d4af708a-0568-4e6a-9048-e1e6f0a62569.png` |
| `day2-hospital-exit-day-v1.png` | `exec-04397424-b354-4ce5-b42a-5d35013d2921.png` |
| `day2-car-interior-day-v1.png` | `exec-a484f724-8f1a-4ef5-845d-9cd445ba25b1.png` |
| `day2-home-exterior-afternoon-v1.png` | `exec-2209655e-88b0-4e49-8e4d-22d92a7d84ca.png` |
| `day2-home-entry-living-afternoon-v1.png` | `exec-81f49fa4-2643-426b-bde4-6e625a2479ac.png` |
| `day2-protagonist-bedroom-afternoon-v1.png` | `exec-8f369045-3380-438a-826d-8ae314cb1017.png` |
| `cg-day2-home-threshold-v1.png` | `exec-e5ba15f9-5306-4835-98bc-5ca7566fe422.png` |
| `cg-day2-family-photo-v1.png` | `exec-e4513543-6a60-4810-98f5-250ec01b2623.png` |
| `cg-day2-couple-photo-v1.png` | `exec-cca810bb-2a51-4269-b485-a06758f8b971.png` |
| `cg-day2-three-column-resolve-v1.png` | `exec-f9824f5a-ef75-4f75-b321-51faa0d75deb.png` |
| `haeun-day2-poses-v1.png` | `exec-835d3bff-9980-4c7b-804c-0c0daa10a8f9.png` |
| `pov-day2-gestures-v1.png` | `exec-336f418b-4328-4cfb-b30e-5e86f40b602c.png` |

내장 생성 원본은 `C:\Users\user\.codex\generated_images\01a03321-c35b-7731-9f0b-f6a22351bee4`에 남겨 두고 프로젝트에는 복사본만 추가했다.

## 7. 재사용·수정·신규 확정

### 직접 재사용 후보

- DAY 1 병실 배경 1종.
- 하은 DAY 1 승인 표정 5종과 기본 몸통 포즈 4종.
- DAY 1 담당 의사 2포즈, 간호사 1포즈.

### 신규 후보

- DAY 2 배경 7종, 이벤트 CG 4종, 하은 부족 포즈 소스 1종, 1인칭 동작 소스 1종.

### PHASE 17 수정 예상

- 주인공 방 배경의 숫자형 핫스폿 제거 또는 무표식 버전 재생성.
- 두 소스 시트의 실제 알파 extrema 확인 후 불투명 그라데이션 제거·셀 분리.
- 하은 포즈 시트의 9개 요청 셀 존재, 안전 운전 양손·시선, 보행 발·지원 손, 열쇠 종류를 전수 검사.
- POV 시트의 손가락 수·소품 소유권·큰/작은 열쇠 구분·원래 휴대폰 미노출을 전수 검사.
- 사진 CG의 인물 수·시선 방향·고정 플레이어 얼굴 회피, 엔딩 CG의 읽을 수 있는 생성 문자가 없는지 확인.

## 8. 보호·연결 규칙

- 기존 사용자 이미지·영상·음악·ZIP과 미추적 에셋을 삭제·이동·덮어쓰지 않았다.
- 후보는 모두 새 `assets/backgrounds/day2`, `assets/events/day2`, `assets/source-sheets/day2` 경로와 `-v1` 이름으로 추가했다.
- PHASE 17 PASS 전에는 매니페스트·스토리·UI·배포 런타임에 연결하지 않는다.
- PHASE 17에서 NEEDS FIX가 하나라도 있으면 해당 파일을 최종 승인하지 않고 비파괴 `-v2` 또는 분리 파일로 수정한다.

## 9. 완료 기준

- 기존 배경·하은·의료진·손·사진·플레이어 초상·렌더러를 감사했다.
- 재사용·제한 재사용·탈락·신규 후보를 구분했다.
- 명세 필수 범주를 덮는 신규 후보 13파일을 프로젝트 새 경로에 수급하고 출처를 기록했다.
- 이미 보이는 품질 위험을 PHASE 17 NEEDS FIX 예상 항목으로 이관했다.
- 품질 검사 전 연결 금지와 비파괴 수정 규칙을 남겼다.

따라서 PHASE 16 기존 에셋 감사 및 후보 수급은 완료다. 다음 관문은 PHASE 17 이미지 일관성·품질 검사다.
