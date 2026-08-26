# DAY 12 이미지 품질 QA

상태: `IMAGE QA PASS`

기준: `docs/day12/DAY12_ASSET_DIRECTION_AUDIO_AUDIT.md`

## 검사 결과

| 자산 | 규격·채널 | 육안 검사 | 판정 |
|---|---|---|---|
| `assets/backgrounds/morning-studio-2d.png` | 1672×941, RGB PNG | 아침 채광·식탁·우측 인물/UI 여백, 확대 선명도 정상 | PASS |
| `assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png` | 1672×941, RGB PNG | 현관/거실 동선·중앙 인물 배치·하단 대화 UI 여백 정상 | PASS |
| `assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png` | 1672×941, RGB PNG | 무인 낮 카페·전경 테이블·두 잔·인물 안전 영역 정상 | PASS |
| `assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png` | 887×1774, RGBA PNG | 머리·손·발 외곽 손실 없음, 실제 투명 배경·부드러운 미소·니트와 롱스커트 선명도 정상 | PASS |

## 기술 검사

- 배경 3종: 동일 1672×941, 16:9 오차 0.01 미만, PNG color type 2(RGB).
- 하은 스프라이트: 887×1774, PNG color type 6(RGBA), 네 모서리 alpha 0, SHA-256 `6cc4baa8aea4572107bac09017bee07bd53e3d65c200d141de642982574a08f0`.
- 파일 누락·0바이트·잘못된 확장자·크롭 손실: 0건.
- 기존 자산 수정·덮어쓰기·후처리: 0건.

## 장면 적합성

- S01·S03·S06·S08 집 아침 배경은 확인 카드·장부 서술과 하은 중경을 동시에 수용한다.
- S02·S04·S07 현관/거실 배경은 휴대폰 근접 뒤 중경 전환 시 피사체 잔상이나 중요 구조물 가림이 없다.
- S05 카페는 영수증 근접 뒤 투샷에 충분한 테이블·인물 여백을 제공한다.
- 하은은 23세의 밝고 생활적인 인상을 유지하며 금융 확인 장면을 의심·위협으로 보이게 하지 않는다.
- 계정·명세의 실제 숫자와 개인정보는 배경/스프라이트에 포함되지 않는다.

## 결론

- 신규 자산 필요: 1종(DAY 12 전용 하은 생활복).
- 후처리 필요: 0종.
- 8개 Scene `assetStatus=ready` 전환: PASS.
- NEEDS FIX: 0
