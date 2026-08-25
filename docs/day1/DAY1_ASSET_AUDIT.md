# DAY 1 — 기존 에셋 감사 및 신규 후보 수급 기록

상태: `PHASE 16 COMPLETE / PHASE 17 QUALITY REVIEW REQUIRED`

감사 기준:

- `docs/day1/DAY1_BACKGROUND_ASSET_SPEC.md`
- `docs/day1/DAY1_CHARACTER_EXPRESSION_SPEC.md`
- `docs/day1/DAY1_CHARACTER_POSE_SPEC.md`
- `docs/day1/DAY1_EVENT_CG_SPEC.md`
- `assets/ART_DIRECTION.md`

감사일: 2026-08-25  
생성 방식: Codex 내장 `image_gen` (`illustration-story`, 프로젝트용 후보 자산)

## 감사 결론

- 기존 배경에는 DAY 1 병원 입원실로 재사용할 수 있는 파일이 없다.
- 기존 하은 파일은 얼굴·머리·눈 색의 동일 인물 기준으로는 유효하지만, DAY 1의 병원 보호자 복장·앉기·물러서기·컵 보조 포즈를 충족하지 않는다.
- 기존 `tense` 표정과 전화 포즈는 DAY 1에서 악역 코딩이나 수상한 휴대폰 신호를 만들 수 있어 사용하지 않는다.
- 기존 NPC 폴백은 회사원 복장이라 담당 의사·간호사로 재사용할 수 없다.
- 기존 이벤트 이미지는 집 식사·차·야외 대화뿐이며 잠금된 DAY 1 병원 장면과 무관하다.
- 렌더러는 병원 배경 ID, DAY 1 표정·포즈, 의사·간호사, 이벤트 CG 실제 파일 해석을 아직 지원하지 않는다. 연결은 PHASE 20에서 진행한다.
- 감사 결과 필요한 후보 자산 8파일을 내장 이미지 생성으로 프로젝트에 수급했다. 이 파일들은 PHASE 17 품질 검사를 통과하기 전까지 최종 자산으로 간주하지 않는다.

## 기존 배경 감사

| 파일/그룹 | 판정 | 근거 | 조치 |
|---|---|---|---|
| `assets/backgrounds/morning-studio-2d.png` | 탈락 | 가정집이며 병상·의자·의료진 동선이 없다. | 자유 연애 모드에서만 유지한다. |
| `assets/backgrounds/home/*` | 탈락 | 가정집 야간 배경이다. | 유지, DAY 1 미사용. |
| `assets/backgrounds/office/*` | 탈락 | 사무실이며 의료 공간으로 오인 가능성이 없다. | 유지, DAY 1 미사용. |
| `assets/backgrounds/yuna/*` | 탈락 | 학교·카페·거리 전용이며 화풍·장소가 맞지 않는다. | 유지, DAY 1 미사용. |
| `assets/backgrounds/cafe/*`, `street/*` | 탈락 | 장소와 조명이 잠금 시나리오와 다르다. | 유지, DAY 1 미사용. |

병실 창문 보조 앵글은 신규 파일을 추가하지 않고 기본 병실 후보의 창가 부분을 카메라 크롭으로 재사용할 수 있다. 최종 크롭 가능 여부는 PHASE 17과 PHASE 18에서 확인한다.

## 기존 하은 에셋 감사

| 파일 | 규격 | 판정 | 근거 |
|---|---:|---|---|
| `assets/characters/girlfriend-standing-2d.png` | 887×1774 RGBA | 참조 재사용 | 얼굴·보라색 단발·보라색 눈·체형의 최상위 동일성 기준. 회사형 치마 복장은 DAY 1 최종용으로 부적합. |
| `girlfriend-standing-smile-2d.png` | 887×1774 RGBA | 제한적 재사용 | `E06_WARM_PLAYFUL` 표정 참조로 적합하나 복장·기본 서기 포즈가 고정된다. |
| `girlfriend-standing-worried-2d.png` | 887×1774 RGBA | 제한적 재사용 | `E04`·`E07` 감정 강도 참조로 사용 가능. 눈물·망설임 세분화는 부족하다. |
| `girlfriend-standing-tense-2d.png` | 898×1751 RGBA | DAY 1 탈락 | 미간과 시선이 적대·의심으로 읽혀 초기 악역 코딩 위험이 있다. |
| `girlfriend-phone-calm-2d.png` | 887×1774 RGBA | DAY 1 탈락 | 전화를 귀에 댄 자세가 잠금 시나리오에 없고 비밀 통화 오해를 만든다. |
| `girlfriend-date-outfit-calm-2d.png` | 887×1774 RGBA | DAY 1 탈락 | 병원 보호자 장면보다 외출 데이트에 맞는다. |
| `assets/heroines/haeun/outfits/04.png` | 329×811 RGBA | 의상 참조 재사용 | 베이지 카디건·흰 상의·편안한 바지가 병원 보호자 복장에 적합하나 최종 스프라이트로는 해상도가 낮다. |
| `assets/heroines/haeun/videos/*` | WebM | DAY 1 보류 | 자유 연애 의상 동영상이며 잠금 장면의 포즈·표정과 일치하지 않는다. 삭제하지 않는다. |

## 기존 의료진·CG 감사

| 파일/그룹 | 판정 | 근거 |
|---|---|---|
| `assets/npcs/female-coworker-clean.png` | 탈락 | 회사원 재킷·사원증이며 간호사로 재사용하면 역할이 잘못 읽힌다. |
| `assets/npcs/male-support-clean.png` | 탈락 | 셔츠·사원증의 회사원이며 의사 가운·검사 도구가 없다. |
| `assets/action-results/generated/career-nurse-*` | 탈락 | 행동 결과 완성 장면이며 투명 의료진 스프라이트가 아니다. |
| `assets/events/locations/haeun-home-*` | 탈락 | 집 식사·차·야외 대화 장면이라 병원·DAY 1 정보 예산과 맞지 않는다. |

## 런타임 규격 감사

- `src/assets/asset-manifest.mjs`에는 병원 배경 ID, 담당 의사, 병원 간호사 전용 파일, DAY 1 CG 테이블이 없다.
- `getNpcSprite("hospital-nurse")`는 현재 여성 동료 폴백을 반환하므로 그대로 사용하면 안 된다.
- `src/ui/character-renderer.mjs`는 하은에게 `calm`, `smile`, `worried`, `tense`와 일부 공용 포즈만 해석한다.
- `src/scene-presentation.mjs`는 `eventCgId` 문자열을 만들 수 있으나 실제 CG 파일 URL을 반환하거나 프리로드하지 않는다.
- 기존 배경은 주로 1599×900 또는 1672×941이며, 신규 1672×941 후보는 현재 화면비와 호환된다.
- PHASE 20에서는 자유 연애 모드의 기존 키를 유지하면서 캠페인 전용 ID를 별도 추가해야 한다.

## 신규 수급 후보

| 파일 | 규격 | 대상 명세 | PHASE 16 판정 |
|---|---:|---|---|
| `assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png` | 1672×941 RGB | `BG_DAY1_HOSPITAL_BEDSIDE_DAY`, 창문 보조 크롭 | 수급 완료, PHASE 17 검사 대기 |
| `assets/backgrounds/hospital/day1-hospital-pov-ceiling-v1.png` | 1672×941 RGB | `BG_DAY1_HOSPITAL_POV_CEILING` | 수급 완료, PHASE 17 검사 대기 |
| `assets/source-sheets/day1/haeun-day1-expressions-v1.png` | 1659×948 RGB | 하은 8표정 소스 | 수급 완료. 알파가 없고 체크무늬가 이미지에 포함됐는지 PHASE 17에서 반드시 판정 |
| `assets/source-sheets/day1/haeun-day1-poses-v1.png` | 1024×1536 RGB | 하은 9포즈 소스 | 수급 완료. 알파가 없고 손·포옹·컵 포즈 정확성 검사 필요 |
| `assets/source-sheets/day1/medical-staff-day1-poses-v1.png` | 1536×1024 RGBA | 의사 3상태·간호사 3상태 소스 | 수급 완료. 알파 범위 0~254, 역할·손·도구 검사 필요 |
| `assets/events/day1/cg-day1-first-eye-contact-v1.png` | 1672×941 RGB | `CG_DAY1_FIRST_EYE_CONTACT` | 수급 완료, 손·접촉 전 거리·첫인상 검사 대기 |
| `assets/events/day1/cg-day1-cup-support-v1.png` | 1672×941 RGB | `CG_DAY1_CUP_SUPPORT_CUTIN` | 수급 완료, 두 손·컵·비접촉 검사 대기 |
| `assets/events/day1/cg-day1-thirty-day-resolve-v1.png` | 1672×941 RGB | `CG_DAY1_THIRTY_DAY_RESOLVE` | 수급 완료, 의자 거리·달력 훅·하은 동일성 검사 대기 |

## 생성 출처 기록

| 프로젝트 파일 | 내장 생성 원본 |
|---|---|
| `day1-hospital-bedside-day-v1.png` | `exec-0eee048d-09bc-4a56-a2c1-71f2b8b41f9a.png` |
| `day1-hospital-pov-ceiling-v1.png` | `exec-673d64ce-ea38-459a-894b-48812766b4d8.png` |
| `haeun-day1-expressions-v1.png` | `exec-b63e1f09-19bc-403e-9f10-a9bd3a05d38e.png` |
| `haeun-day1-poses-v1.png` | `exec-ff538edd-8e4a-4f82-8773-c76b319e3a4e.png` |
| `medical-staff-day1-poses-v1.png` | `exec-efed74ad-31c7-439b-9502-7c431720f94b.png` |
| `cg-day1-first-eye-contact-v1.png` | `exec-b0c72dad-c184-48a6-a904-f05a75c14693.png` |
| `cg-day1-cup-support-v1.png` | `exec-9ec851d7-4f1e-4316-b1b9-1afc34fde194.png` |
| `cg-day1-thirty-day-resolve-v1.png` | `exec-be04f583-1937-4b80-aaca-7ba3640d32e3.png` |

내장 생성 원본은 `C:\Users\user\.codex\generated_images\01a03321-c35b-7731-9f0b-f6a22351bee4`에 보존하고 프로젝트에는 복사본만 추가했다.

## 재사용·수정·신규 생성 확정

### 재사용

- 하은 얼굴 기준: `girlfriend-standing-2d.png`.
- 감정 참고: `girlfriend-standing-smile-2d.png`, `girlfriend-standing-worried-2d.png`.
- DAY 1 의상 참고: `assets/heroines/haeun/outfits/04.png`.
- 병실 창가 보조 구도: 신규 기본 병실 후보의 크롭 가능성을 우선 검토.

### 수정 또는 분리 필요

- 하은 표정·포즈 소스 시트는 PHASE 17 합격 후에만 개별 셀 분리·알파 정리 대상으로 삼는다.
- 의료진 소스 시트도 PHASE 17 합격 셀만 개별 스프라이트로 분리한다.
- 배경·CG는 품질 합격 후 배포용 WebP 변환 후보로 삼는다.

### 현재 추가 생성 없음

- PHASE 16에서 명세된 필수 범주의 후보가 모두 존재하므로 추가 생성은 PHASE 17 불합격 사유가 확정될 때만 수행한다.
- 선택적 창문 배경은 기본 병실의 크롭으로 충족 가능한지 먼저 검사한다.

## 보호 규칙

- 기존 사용자 이미지·영상·음악·ZIP과 미추적 에셋을 삭제하거나 이동하지 않았다.
- 기존 자유 연애 하은 에셋을 덮어쓰지 않고 DAY 1 후보를 새 경로와 `-v1` 이름으로 추가했다.
- 신규 후보는 아직 매니페스트·스토리·UI에 연결하지 않았다.
- PHASE 17에서 NEEDS FIX가 하나라도 있으면 해당 파일을 최종 승인하거나 PHASE 18로 넘기지 않는다.

## 완료 기준

- 기존 배경·하은·의료진·CG·런타임 규격을 감사했다.
- 각 기존 파일을 재사용·제한 재사용·탈락으로 구분했다.
- 필수 범주의 신규 후보를 프로젝트 경로에 수급하고 출처를 기록했다.
- 품질 검사 전 연결 금지와 다음 단계의 수정 기준을 남겼다.

따라서 PHASE 16 기존 에셋 감사 및 후보 수급은 완료다. 다음 관문은 PHASE 17 이미지 일관성·품질 검사다.
