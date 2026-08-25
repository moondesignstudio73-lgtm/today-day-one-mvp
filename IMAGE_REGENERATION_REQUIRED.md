# DAY 1 MEDICAL IMAGE QUALITY — RESOLVED

검사일: 2026-08-26

## 결론

하은 DAY 1 포즈 9종(약 997–1024 × 1535–1577), 병원 배경·CG(1672 × 941)는 현재 최대 표시 크기를 감당한다. 저해상도였던 의료진 6종은 850×1700 이상 RGBA로 전면 재생성해 `assets/npcs/day1/hq/*-v2.png`로 연결했다. DAY 2에서 확대본을 사용하던 하은 7종과 POV 손동작 8종도 모두 940px 이상 폭의 RGBA `*-v3.png`로 전면 재생성했다.

기존 파일과 과거 확대본은 비교·원본 보존을 위해 유지하되 런타임에서는 사용하지 않는다. 내장 이미지 생성으로 인물과 손동작을 새로 렌더링한 뒤, 단색 크로마 배경만 `scripts/extract-chroma-sprite.py`로 실제 알파에 분리했다. DAY 1·2 실제 플레이 화면에서 크롭, 계단 현상, 배경 누출을 다시 확인했다.

## 공통 생성 규격

- 1600×2400 이상, 세로형 전신 PNG
- 실제 RGBA 투명 배경(alpha 0과 255 모두 존재)
- 하은 DAY 1과 동일한 고품질 2D 비주얼노벨 화풍
- 깔끔한 애니 셀 라인, 부드러운 셀 셰이딩, 자연스러운 성인 비율
- 좌측에서 들어오는 밝은 병실 주간광, 중간 채도
- 머리·손가락·소품·신발을 포함한 전신과 충분한 투명 여백
- 체크무늬, 단색 배경, 후광, 바닥 그림자판, 글자, 로고 금지

## 파일별 목록

| 파일 | 사용 장면 | 현재 해상도 | 문제 | 권장 포즈·표정 |
|---|---|---:|---|---|
| `doctor-bedside-assessment-2d.png` | SCENE 03 동공·기본 검사 | 260×506 | 실제 표시 크기와 거의 같아 고해상도에서 선명도 부족 | 펜라이트를 든 전신 3/4, 침착한 검사 표정 |
| `doctor-explain-open-hands-2d.png` | 향후 설명 연출 후보 | 222×512 | 1.5배 원본 기준 미달 | 양손을 가볍게 연 설명 자세, 중립 표정 |
| `doctor-record-and-explain-2d.png` | 향후 기록 설명 후보 | 183×512 | 폭·얼굴 디테일 부족 | 차트를 든 전신, 진지한 표정 |
| `nurse-vitals-check-2d.png` | SCENE 03 활력징후 검사 | 171×503 | 확대 여유 없음 | 혈압계를 확인하는 전신, 집중 표정 |
| `nurse-swallow-assessment-2d.png` | SCENE 05 삼킴 검사 | 145×511 | 폭과 손·소품 디테일 부족 | 물컵/검사 도구를 든 전신, 친절한 중립 표정 |
| `nurse-safety-guidance-2d.png` | 향후 안전 안내 후보 | 209×512 | 1.5배 원본 기준 미달 | 손바닥을 가볍게 든 안내 자세, 차분한 표정 |

## 공통 프롬프트

```text
high quality 2D visual novel character illustration, modern Korean/Japanese romance game art style, clean anime linework, soft cel shading, semi-realistic adult body proportions, sharp facial and hand details, consistent neutral hospital daylight from the left, restrained saturation, full body front three-quarter view, genuine transparent RGBA background, clean alpha edges, 1600x2400 or larger, generous transparent margin, no text, no logo, no watermark, no checkerboard, no gradient backdrop, no glow, no cropped limbs
```

## 캐릭터별 프롬프트 추가문

### 담당 의사

```text
Korean male attending physician in his early thirties, neat black side-parted hair, rectangular glasses, white lab coat, pale blue shirt, navy tie, charcoal trousers and black dress shoes; preserve the same face, outfit and mature calm identity across every pose.
```

### 간호사

```text
Korean female nurse in her late twenties, dark brown hair in a neat low bun, light blue scrub top and trousers, white clinical shoes; preserve the same face, hair, outfit and composed professional identity across every pose.
```

