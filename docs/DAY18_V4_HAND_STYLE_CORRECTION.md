# DAY 18 V4 손 화풍 수정 기록

## 발견

DAY 18 손 포함 CG를 전수 육안 감사했다. `yuri-menu-wait-water-v1`, `haeun-menu-slide-v1`, `menu-open-v1`, `menu-closed-v1`, `washing-cup-night-v1`은 인물 또는 주변 셀 채색에 비해 피부가 사진처럼 보여 불합격 처리했다.

`morning-alarm-off-v1`, `morning-water-v1`, `morning-clothes-v1`, `fridge-open-morning-v1`, `leftover-rice-check-v1`, `haeun-menu-wait-water-v1`, `food-sharing-v2`, `haeun-tasting-v2`, `own-meals-v2`, `table-space-v1`은 외곽선과 단계식 명암이 유지되어 이번 교체 대상에서 제외했다. `wallet-open-v1`은 인물이 없는 소품 중심의 회화식 컷이며 사진식 피부 질감이 없어 유지한다.

## 교체 자산

| 반려 자산 | 런타임 자산 | 화풍 QA |
| --- | --- | --- |
| `yuri-menu-wait-water-v1.png` | `yuri-menu-wait-water-v2.png` | 캐릭터와 동일한 선화·평면 피부로 교체 PASS |
| `haeun-menu-slide-v1.png` | `haeun-menu-slide-v2.png` | 전경 손의 사진식 흐림 제거 PASS |
| `menu-open-v1.png` | `menu-open-v2.png` | 양손 셀 채색화 PASS |
| `menu-closed-v1.png` | `menu-closed-v2.png` | 양손 셀 채색화 PASS |
| `washing-cup-night-v1.png` | `washing-cup-night-v2.png` | 젖은 피부의 사진식 광택 제거 PASS |

모든 수정은 기존 구도·행동·소품을 보존하는 정밀 편집으로 진행했다. 공통 최종 프롬프트 계약은 `clean 2D anime cel-shaded visual-novel line art`, 단순화한 관절과 2~3단계 넓은 명암, 사진식 피부·모공·혈관·체모·서브서피스·젖은 피부 하이라이트 금지다. imagegen 생성 원본은 Codex generated_images 보관 위치에 남겨 두고 프로젝트에는 v2 파일을 복사했다.

## 런타임 계약

- 런타임과 소스 비트는 위 5개 v2만 참조한다.
- 반려된 v1 이름은 실행 소스에 다시 들어갈 수 없다.
- 상세 재발 방지 규칙은 `docs/STORY_V4_IMAGE_STYLE_RULES.md`를 따른다.

