# DAY 18 V4 손 화풍 수정 기록

## 발견

DAY 18 손 포함 CG를 전수 육안 감사했다. `yuri-menu-wait-water-v1`, `haeun-menu-slide-v1`, `menu-open-v1`, `menu-closed-v1`, `washing-cup-night-v1`은 인물 또는 주변 셀 채색에 비해 피부가 사진처럼 보여 불합격 처리했다.

`morning-water-v1`, `morning-clothes-v1`, `fridge-open-morning-v1`, `leftover-rice-check-v1`, `haeun-menu-wait-water-v1`, `food-sharing-v2`, `haeun-tasting-v2`, `own-meals-v2`, `table-space-v1`은 외곽선과 단계식 명암이 유지되어 이번 교체 대상에서 제외했다.

2026-09-05 재감사에서 `morning-alarm-off-v1`, `wallet-open-v1`, `wallet-closed-v1`, `solo-bag-seat-move-v1`도 확대 화면에서 피부의 세부 명암과 사진식 질감이 주변 2D 인물보다 먼저 읽혀 추가 반려했다. 인물이 없는 POV 컷이나 회화식 배경이라는 이유로 손 화풍 기준을 낮추지 않는다.

## 교체 자산

| 반려 자산 | 런타임 자산 | 화풍 QA |
| --- | --- | --- |
| `yuri-menu-wait-water-v1.png` | `yuri-menu-wait-water-v2.png` | 캐릭터와 동일한 선화·평면 피부로 교체 PASS |
| `haeun-menu-slide-v1.png` | `haeun-menu-slide-v2.png` | 전경 손의 사진식 흐림 제거 PASS |
| `menu-open-v1.png` | `menu-open-v2.png` | 양손 셀 채색화 PASS |
| `menu-closed-v1.png` | `menu-closed-v2.png` | 양손 셀 채색화 PASS |
| `washing-cup-night-v1.png` | `washing-cup-night-v2.png` | 젖은 피부의 사진식 광택 제거 PASS |
| `morning-alarm-off-v1.png` | `morning-alarm-off-v2.png` | 손·팔의 사진식 피부 질감 제거, 셀 명암 PASS |
| `wallet-open-v1.png` | `wallet-open-v2.png` | 양손 외곽선·평면 피부, 빈 지갑 그립 PASS |
| `wallet-closed-v1.png` | `wallet-closed-v2.png` | 양손 외곽선·평면 피부, 닫힌 지갑 그립 PASS |
| `solo-bag-seat-move-v1.png` | `solo-bag-seat-move-v2.png` | 전경 손·소매 셀 채색, 가방 손잡이 그립 PASS |

2026-09-05 재노출 신고에서는 첨부 화면이 `yuri-menu-wait-water-v1.png`와 일치함을 확인했다. 소스가 이미 v2를 가리키더라도 캐시나 구버전 화면에서 혼동이 재발하지 않도록 전경 손의 외곽선과 2~3단계 셀 명암을 더 강제한 `yuri-menu-wait-water-v3.png`를 새 파일명으로 만들었다. 런타임·브리지·fixture·최상위 캐시 버전을 동시에 갱신하고 v1과 v2를 모두 런타임 금지 목록에 넣었다.

같은 화면이 다시 신고된 후 `yuri-menu-wait-water-v4.png`를 정밀 편집으로 제작했다. 전경 손·노출 손목만 굵고 선명한 애니메이션 외곽선과 분리된 셀 명암으로 재고정하고, 유리의 얼굴·의상·자세, 물잔의 위치·수위, 식탁·메뉴·배경 구도는 보존했다. 런타임은 v4만 참조하며 v1~v3는 모두 런타임 금지 및 v4와 바이트 동일한 안전 대체본으로 격리했다. 캐시 사슬은 `game.js?v=252` → bridge v57 → 새 v4 이미지 URL로 갱신했다.

2026-09-05 추가 신고의 첨부 화면은 v3 구도와 일치했다. 캐시된 구버전이 승인본으로 치환됐다는 문서 기록만 믿지 않고 새 `yuri-menu-wait-water-v5.png`를 다시 정밀 편집했다. 손·손목·소매 경계에 캐릭터와 같은 선화와 셀 명암을 재강제하고 v1~v4 파일 내용도 v5와 바이트 동일하게 격리했다. 런타임은 v5만 참조하며 캐시 사슬은 `game.js?v=254` → bridge v58 → playable v58 → v5 이미지 URL로 갱신했다.

2026-09-06 재신고 화면도 같은 장면의 배포 이력 비트맵과 일치했다. 새 `yuri-menu-wait-water-v6.png`는 전경 손·노출 손목·소매 경계만 다시 편집해 손가락 전체의 굵은 외곽선, 단순화한 관절, 평면 피부와 정확히 분리된 2단 셀 명암을 강화했다. 유리의 얼굴·의상·자세, 물잔·수위·반사, 식탁·메뉴·배경·크롭은 유지했다. 런타임은 v6만 참조하고 v1~v5의 파일 내용도 v6와 바이트 동일하게 격리한다. 캐시 사슬은 `game.js?v=255` → bridge v59 → playable v59 → v6 이미지 URL이다.

후속 재발 방지에서는 런타임 경로 차단만으로는 오래 열린 탭·이전 저장·중간 캐시가 반려 URL을 재요청할 수 있다고 판단했다. 위 표의 반려 v1 파일과 유리 물 장면 v2·v3 파일을 각각의 승인 v2/v4 비트맵과 바이트 단위로 동일하게 격리 교체했다. 현재 런타임은 여전히 새 버전 파일명만 참조하지만, 구버전 클라이언트가 과거 URL을 요청해도 실사 손 원본은 전달되지 않는다.

모든 수정은 기존 구도·행동·소품을 보존하는 정밀 편집으로 진행했다. 공통 최종 프롬프트 계약은 `clean 2D anime cel-shaded visual-novel line art`, 단순화한 관절과 2~3단계 넓은 명암, 사진식 피부·모공·혈관·체모·서브서피스·젖은 피부 하이라이트 금지다. imagegen 생성 원본은 Codex generated_images 보관 위치에 남겨 두고 프로젝트에는 승인된 버전 파일을 복사했다.

재감사 4자산은 built-in imagegen의 `precise-object-edit`로 편집했다. 배경·구도·소품·스토리 행동은 보존하고 손·손목·소매 경계만 변경했으며, 각 손의 다섯 손가락·관절·소품 접촉을 별도 확인했다. 생성 원본은 각각 `exec-3fae9045-575e-4d79-a880-2874bcb70cd8.png`, `exec-c5cb230a-c823-4a58-ab39-2bf7a4f885b5.png`, `exec-ebd0d2b9-032a-4799-bb00-4ad760edb960.png`, `exec-b3699c4a-6115-448c-a3b0-b8d4bb3d3332.png`이며 프로젝트에는 대응하는 v2 파일로 복사했다.

## 2026-09-06 같은 DAY 전수 재감사

- DAY18 실행 소스가 참조하는 이벤트 이미지 31개를 다시 추출해 4장 연락표에서 전경·모서리·소품 주변을 전수 확인했다.
- 혼합 화풍 위험이 상대적으로 큰 `food-sharing-v2`, `fridge-open-morning-v1`, `morning-feet-rest-v1`, `shoulder-water-glass-v1`과 신고 장면 v6는 원본 크기로 다시 확인했다.
- 손가락/발가락 수와 관절·소품 가림은 `해부학 PASS`, 외곽선·단순화한 관절·분리된 셀 명암은 `화풍 PASS`다. 신고 컷 외 신규 FAIL은 발견되지 않았다.
- 인체가 없는 `travel-window-sea-v1`, `jihoon-finished-bowl-v1`, `solo-phone-down-extra-food-v1`은 손 화풍 비대상으로 분리했다. 이 판정은 DAY18에만 적용하며 다른 DAY의 전수 감사 완료를 뜻하지 않는다.

## 런타임 계약

- 유리 물 장면은 v6, 나머지 교체 자산은 위 v2를 참조한다.
- 반려된 유리 물 v1·v2·v3·v4·v5와 나머지 v1 이름은 실행 소스에 다시 들어갈 수 없다.
- 자동 테스트는 모든 반려 파일명이 생성된 DAY18 세그먼트 어디에도 나타나지 않는지, 승인된 v6/v2 자산이 실제로 존재하는지 함께 검사한다.
- 자동 테스트는 이미 배포된 반려 URL 11개가 대응 승인본과 바이트 단위로 동일한지도 검사한다.
- 상세 재발 방지 규칙은 `docs/STORY_V4_IMAGE_STYLE_RULES.md`를 따른다.

## v4 원본 검증

- built-in imagegen `precise-object-edit`를 사용했다. 원본 생성 파일은 `exec-d585e3df-c673-44da-ab67-60594e2c23c9.png`, 프로젝트 최종본은 `assets/events/day18-v4/yuri-menu-wait-water-v4.png`다.
- 1672×941 원본에서 전경 손의 다섯 손가락·유리잔 그립과 선명한 외곽선·2~3단계 셀 명암을 확인했다. 사진식 모공·혈관·체모·연속 피부 그라데이션은 없다.

## v6 최종 검증

- built-in imagegen `precise-object-edit`를 사용했다. 최종 프롬프트는 손·노출 손목·소매 경계만 변경하고 유리의 얼굴·의상·자세, 물잔 위치·수위, 식탁·메뉴·배경·크롭을 보존하도록 고정했다.
- 생성 원본은 `exec-85b9db3b-cf84-4a00-9369-1e45c31ab120.png`, 프로젝트 최종본은 `assets/events/day18-v4/yuri-menu-wait-water-v5.png`다.
- 2026-09-06 재수정 생성 원본은 `exec-4ab83542-0d2c-48c3-bbaf-0b9213d8ae03.png`, 프로젝트 최종본은 `assets/events/day18-v4/yuri-menu-wait-water-v6.png`다. SHA-256은 `3b87a8f8a55bf2283d507f6eb4702864fea71de5cd059324c4755524cec7187d`이며 v1~v5도 동일하다.
- 1672×941 원본에서 다섯 손가락, 잔의 접촉·가림, 손목 연속성은 `해부학 PASS`; 캐릭터와 같은 외곽선, 단순화한 관절, 평면 피부와 분리된 명암은 `화풍 PASS`다.
- 배포 이력 v1~v5와 승인본 v6의 SHA-256은 모두 `3B87A8F8A55BF2283D507F6EB4702864FEA71DE5CD059324C4755524CEC7187D`로 동일하다.
- 로컬 실제 브라우저의 일반 fixture 진입에서 `http://127.0.0.1:8000/assets/events/day18-v4/yuri-menu-wait-water-v6.png`가 1672×941 원본으로 로드되는 것을 확인했다. 실제 `contain` 화면에서 전경 손의 외곽선·평면 피부·분리 명암이 유리 얼굴/손의 묘사 문법과 일치해 `화풍 PASS`다.
- CG 표시 중 새로고침 뒤 타이틀의 실제 이어하기로 Scene 시작점을 복구하고 같은 v6 URL이 다시 로드되는 것을 확인했다. 두 실행 모두 console warning/error 0이며 fixture가 백업한 사용자 저장을 복원했다.

## v3 실제 화면 재검증

- 390×844 모바일 실제 렌더링에서 `yuri-menu-wait-water-v3.png` URL, 1672×941 원본 로드, 전경 손의 선화·평면 명암을 확인했다.
- 유리의 얼굴·의상과 같은 프레임에서 손이 사진처럼 튀지 않았고, 다섯 손가락과 유리잔 그립이 유지되어 `해부학 PASS`, `화풍 PASS`로 판정했다.
- 집중 fixture가 덮어쓴 사용자 저장은 테스트 전 백업으로 복원했다.
