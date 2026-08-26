# DAY 13 이미지 품질 QA

상태: `IMAGE QA PASS`

NEEDS FIX: 0

기준 매핑: `src/day13-presentation-data.mjs`

## 검사 범위와 결과

| 자산 | 규격·색상 | SHA-256 | 육안 판정 |
|---|---|---|---|
| `assets/backgrounds/morning-studio-2d.png` | 1672×941 RGB PNG | `1412af800eef65ebcb8aa35bc0e2d26394d12c216b3512d6d10c823aa2f83f42` | 따뜻한 아침광, 식탁·장부 연출과 우측 인물/UI 여백 PASS |
| `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` | 1672×941 RGB PNG | `4dc6554963c7e63f396558ec8c1724ba3bc470f4ab3be34c955c109cff7afd38` | 현관·거실 동선과 중경 구도, 확대 흐림·왜곡 없음 |
| `assets/backgrounds/day6/day6-neighborhood-market-day-v1.png` | 1672×941 RGB PNG | `3a5e2f7394dc54f189b23a0892e8f3b6bbda5bd3628307872c22ea87a81ffb9d` | 밝은 낮 마트, 쌀·달걀·두부·채소 식별성과 우측 캐릭터 여백 PASS |
| `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | 1672×941 RGB PNG | `fefb300b80d4172ac83ad9b9c59c65d1e4016a459e1f458887d89eb9d8b21661` | 두 잔이 놓인 테이블과 생활형 협상 구도, 무인·무워터마크 PASS |
| `assets/characters/story-outfits/haeun-day6-neighborhood-casual-2d-v1.png` | 887×1774 RGBA PNG | `c8e116a8d27f8278e5b6f7126624bb9032fc6f083f06a03ecc8b88b1c8c8b910` | 투명 배경·전신 크롭·윤곽선·얼굴·손·신발·가방 파손 없음 |

## 시각 적합성

- 네 배경은 모두 16:9에 가까운 1672×941 원본이며 캐릭터와 대화 UI를 놓을 안전 여백이 있다.
- 하은 스프라이트는 밝은 미소, 청회색 바람막이, 크림 니트·바지, 크로스백으로 집→마트→카페→집 동선을 자연스럽게 잇는다.
- 하은은 23세의 밝고 생활적인 동거 파트너로 보이며 회피·악역·공포 인상을 만들지 않는다.
- 마트 표찰과 휴대폰·장부 소품의 가격·계정·자동이체 정보는 플레이어가 읽어야 하는 고정 개인정보로 사용하지 않는다.
- 원본 확대 육안 검사에서 깨진 알파, 픽셀 파손, 과도한 블러, 비율 왜곡, 잘린 얼굴·손·발, 고정 인물, 로고, 워터마크를 발견하지 않았다.

## 비파괴 확인

- 신규 자산 제작: 0종.
- 기존 및 사용자 자산 수정·덮어쓰기·삭제·이동: 0건.
- 감사된 8개 Scene을 `assetStatus: ready`로 전환한다.

## 다음 관문

- 선반영 DAY 13 런타임이 8개 `ready` 프레젠테이션 장면과 DAY 6 생활형 외출복을 직접 사용하도록 연결한다.
- DAY 12 9콜백, DAY 13 세 단계 선택, 중간 저장 복원, 윤서진 두 축 불변을 구현 감사한다.
