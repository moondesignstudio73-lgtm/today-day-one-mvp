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

모든 수정은 기존 구도·행동·소품을 보존하는 정밀 편집으로 진행했다. 공통 최종 프롬프트 계약은 `clean 2D anime cel-shaded visual-novel line art`, 단순화한 관절과 2~3단계 넓은 명암, 사진식 피부·모공·혈관·체모·서브서피스·젖은 피부 하이라이트 금지다. imagegen 생성 원본은 Codex generated_images 보관 위치에 남겨 두고 프로젝트에는 v2 파일을 복사했다.

재감사 4자산은 built-in imagegen의 `precise-object-edit`로 편집했다. 배경·구도·소품·스토리 행동은 보존하고 손·손목·소매 경계만 변경했으며, 각 손의 다섯 손가락·관절·소품 접촉을 별도 확인했다. 생성 원본은 각각 `exec-3fae9045-575e-4d79-a880-2874bcb70cd8.png`, `exec-c5cb230a-c823-4a58-ab39-2bf7a4f885b5.png`, `exec-ebd0d2b9-032a-4799-bb00-4ad760edb960.png`, `exec-b3699c4a-6115-448c-a3b0-b8d4bb3d3332.png`이며 프로젝트에는 대응하는 v2 파일로 복사했다.

## 런타임 계약

- 런타임과 소스 비트는 위 9개 v2만 참조한다.
- 반려된 v1 이름은 실행 소스에 다시 들어갈 수 없다.
- 자동 테스트는 9개 반려 파일명이 생성된 DAY18 세그먼트 어디에도 나타나지 않는지, 9개 v2 자산이 실제로 존재하는지 함께 검사한다.
- 상세 재발 방지 규칙은 `docs/STORY_V4_IMAGE_STYLE_RULES.md`를 따른다.
