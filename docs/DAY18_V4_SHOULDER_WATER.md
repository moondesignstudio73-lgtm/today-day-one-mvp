# DAY18 V4 SCENE14 옆자리 물잔 행동 구현·QA

2026-09-05 실행. 원본 SCENE14의 `큰 사건은 아니었는데, 물잔을 드는 손이 조금 조심스러워졌다.`는 대사가 아니라 물리 행동이다. 기존 런타임은 이를 일반 독백창에 출력했으므로 제거하고, 어깨 접촉 정지 뒤 전용 행동 CG로 치환했다. DAY18 전체 판정은 여전히 PARTIAL이다.

## 자산과 연속성

- 기준 자산: `assets/events/day18-v4/shoulder-contact-v1.png`
- 신규 자산: `assets/events/day18-v4/shoulder-water-glass-v1.png`
- 기존 포차, 빨간 테이블, 하은의 세이지색 셔츠·목걸이, 주인공의 베이지 셔츠, 닿은 어깨와 카메라 크롭을 유지했다.
- 변경 범위는 주인공이 기존 물잔을 조심스럽게 들어 올리는 손·소매·잔으로 제한했다.

생성 편집 프롬프트에는 `precise-object-edit`, `2D cel-shaded anime/visual-novel art`, `clean inked contours`, `simplified painted skin`, `exactly five natural fingers`, `no photographic skin texture, pores, nails detail, or pasted live-action appearance`를 명시했다. 이 작업부터 `STORY_V4_IMAGE_STYLE_RULES.md`에 화면 가장자리·전경·일부만 보이는 손까지 전수 검사하는 혼합 화풍 금지 규칙을 추가했다.

## 런타임 계약

1. `close_seat`에서 거리 대화 뒤 기존 어깨 CG를 3초 표시한다.
2. `storyPause` 뒤 물잔 행동 CG를 2.8초 표시한다.
3. 원본 행동 문장은 대화/독백 텍스트로 출력하지 않는다.
4. `close_walk`, `close_home` 및 다른 저장 스키마에는 물잔 CG가 나타나지 않는다.

## 실제 게임 QA

`옆자리 물잔 연출 QA` 진입점으로 비-SKIP 재생했다.

- 어깨 접촉 → 물잔 들기 → 다음 원문 장면 복귀: PASS
- 행동 문장의 일반 대화창 미출력: PASS
- 해부학 PASS: 한 손, 다섯 손가락, 잔과 손가락의 접촉·가림 및 관절 방향 정상
- 화풍 PASS: 손·손목이 얼굴·의상과 같은 2D 셀 채색과 외곽선을 유지하며 모공·혈관·사진식 피부 질감 없음
- 실제 `contain` 화면에서 전경 손과 하은 얼굴의 혼합 화풍 없음: PASS
- 테스트 전 사용자 저장 복원: PASS

다음 SCENE14 대상은 가방 이동의 현재 배경 포함 여부 재판정과 산책 분기의 손 스침/손잡기 물리 연출이다.
