# 비주얼 에셋 요구 목록

`src/scene-presentation.mjs`의 `getAssetRequirementList()`가 모든 메인·히든 스토리와 조건 이벤트를 검사해 현재 사용 배경과 누락 여부를 산출한다.

## 적용 완료

- `home-morning`: 기존 아침 원룸
- `home-night`: NIGHT HOME 야간 원룸
- `office-day`: 직장·업무·발표·출근 장면
- `cafe-rain-evening`: 대화·회상·갈등 장면
- `river-night`: 데이트·여행·약속·고백 장면
- 여자친구 기본·미소·걱정·긴장 표정
- 여자친구 전화 포즈와 데이트 의상
- 여성 직장 동료와 남성 라이벌

## 다음 생성 우선순위

1. 배경: 식당, 고급 레스토랑·술집, 터미널, 병원, 경찰서, 해외·여행 장소.
2. 여자친구: 웃음·설렘·부끄러움·대성통곡·화남·무표정·수상함 표정.
3. 포즈: 안기·커피·식사·손 흔들기·생각하기·고개 돌리기.
4. 의상: Office, Casual, Homewear, Sporty, Elegant, Resort, Party.
5. 전용 CG: 첫 데이트, 비 오는 날 우산, 첫 위기, 여행, 화해, 라이벌, 기념일, DAY 30 엔딩.
6. 상품 이미지: 현재 10개 상점 아이템과 음식·데이트 오브젝트.

새 에셋은 `assets/ART_DIRECTION.md`를 그대로 적용하고 `BG_`, `CHAR_`, `OUTFIT_`, `ITEM_`, `CG_` ID 규칙을 사용한다.
