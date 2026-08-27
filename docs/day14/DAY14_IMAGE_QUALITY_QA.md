# DAY 14 이미지 품질 QA

상태: `IMAGE QA PASS`

NEEDS FIX: 0

기준 매핑: `src/day14-presentation-data.mjs`

## 검사 범위와 결과

| 자산 | 규격·색상 | SHA-256 | 육안 판정 |
|---|---|---|---|
| `assets/backgrounds/morning-studio-2d.png` | 1672×941 RGB PNG | `1412af800eef65ebcb8aa35bc0e2d26394d12c216b3512d6d10c823aa2f83f42` | 따뜻한 아침광과 카드 분류 구도, 우측 인물·UI 여백 PASS |
| `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` | 1672×941 RGB PNG | `4dc6554963c7e63f396558ec8c1724ba3bc470f4ab3be34c955c109cff7afd38` | 현관·거실 동선과 생활용품 확인 구도, 흐림·왜곡 없음 |
| `assets/backgrounds/day8/day8-household-store-day-v1.png` | 1672×941 RGB PNG | `fa1e01c4d550f36057e0c4a25327da007c926f6c6882a8adb7e0e9d0d557a315` | 밝은 생활용품점, 선반 탐색과 2인 대화 안전 여백 PASS |
| `assets/backgrounds/day6/day6-neighborhood-market-day-v1.png` | 1672×941 RGB PNG | `3a5e2f7394dc54f189b23a0892e8f3b6bbda5bd3628307872c22ea87a81ffb9d` | 밝은 낮 마트, 장바구니·가격표 연출과 중앙 여백 PASS |
| `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | 1672×941 RGB PNG | `fefb300b80d4172ac83ad9b9c59c65d1e4016a459e1f458887d89eb9d8b21661` | 두 잔이 놓인 테이블과 영수증 협의 구도, 무인·무워터마크 PASS |
| `assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png` | 887×1774 RGBA PNG | `7526406e31919c4a5f625f31e5577d6f0a6d9a6ccead4a5f17a54cd0e30496ae` | 투명 배경·전신 크롭·얼굴·손·신발·가방·윤곽선 파손 없음 |

## 기술·시각 적합성

- 다섯 배경은 16:9에 가까운 1672×941 RGB PNG이며, 하은 스프라이트는 1:2 비율의 887×1774 RGBA PNG다.
- PNG 서명·규격·색상 유형과 SHA-256을 원본 파일에서 읽어 고정했다.
- 확대 육안 검사에서 깨진 알파, 압축 얼룩, 과도한 블러, 비율 왜곡, 잘린 얼굴·손·발, 고정 인물, 로고, 워터마크를 발견하지 않았다.
- 하은은 밝은 미소, 세이지색 셔츠, 흰 상의, 남색 바지, 크로스백과 운동화로 23세의 생활형 외출 인상을 유지한다.
- 선반 라벨·가격표·영수증·휴대폰 추천 정보는 읽을 수 있는 개인정보나 서사 정답으로 고정되지 않는다.
- 작은 위화감 장면에도 붉은 색보정·글리치·비네트·공포 줌·하은 단독 감시 구도가 없어 DAY 14 정보 공개 예산을 지킨다.

## 비파괴 확인

- 신규 자산 제작: 0종.
- 기존 및 사용자 자산 수정·덮어쓰기·삭제·이동: 0건.
- 감사된 8개 Scene을 `assetStatus: ready`로 전환한다.

## 다음 관문

- 선반영 DAY 14 런타임이 8개 `ready` 프레젠테이션 장면, DAY 13 9개 콜백, 세 단계 전략 선택과 중간 저장 복원을 직접 사용하도록 구현 감사한다.
- 윤서진의 `seojinAffection`과 `seojinStatusInterest`, 기본 금융·투자 잠금, DAY 15 훅의 독립성을 확인한다.
