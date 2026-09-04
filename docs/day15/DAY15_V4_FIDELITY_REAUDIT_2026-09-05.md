# DAY 15 V4 충실도 재감사 — 2026-09-05

## 판정

**PASS / DAY 15 충실도 감사 종료.** 현재 런타임은 Notion 원문 V4의 24개 Scene, 12개 선택, 출석·전화·무연락 경로와 지식 경계를 유지한다. DAY 15 구현을 다시 여는 코드 결함은 발견되지 않았다.

## 기준 원문

- Notion page id: `3c9c31f0-29a6-8138-ab56-ed8ee668526d`
- title: `DAY 15 — 빛나는 쪽을 보다 | SCENARIO V4`
- last edited snapshot: `2026-08-27T21:19:12.202Z`
- 구조: 24 Scene / 12 Choice
- 로컬 source lock: `DAY15_NOTION_SOURCE_LOCK_V4.md`

2026-09-05에 상위 Notion 페이지 안에서 DAY 15를 다시 검색하고 페이지 전체를 재수신했다. 페이지 id와 last-edited snapshot은 source lock과 같다. 커넥터 wrapper 길이는 과거 기록과 달라질 수 있으므로 길이만 동등성 근거로 쓰지 않았다. Scene/Choice 구조, 핵심 분기, 지식 경계, 결말 조건을 원문 본문과 다시 대조했다.

## 원문 계약 대조

| 계약 | 현재 구현 판정 |
| --- | --- |
| 주인공이 시우와 경쟁하는 대신 자기 관찰을 말한다 | PASS |
| 출석은 `SCENE 01~17 → 20~24` 흐름을 사용한다 | PASS |
| 불참은 전화 경로와 무연락·혼자 오후 경로를 구분한다 | PASS |
| 통제를 계속하면 하은이 떠나며 로맨스 보상을 만들지 않는다 | PASS |
| DAY 12 서진, DAY 13 아라의 실제 접촉 여부만 안다 | PASS |
| DAY 14 실제 상호작용만 callback으로 사용한다 | PASS |
| 전시 지식, 자동 만남, 강제 화해를 발명하지 않는다 | PASS |
| 어깨 접촉은 자격과 경계가 해소된 경우에만 허용한다 | PASS |
| 공개 자료는 실제 제안 뒤에만 전달하며 사적 대화는 알지 못한다 | PASS |
| DAY 23 지훈 연락은 잠정적이며 DAY 16 만남을 확정하지 않는다 | PASS |

## 코드·회귀 증거

- `src/day15-v4-source-registry-01-12.mjs`와 `src/day15-v4-playable-script-13-24.mjs`가 원문 전·후반을 소유한다.
- 원문 잠금 SHA-256은 전반 `cccf47e000930ff0e870536aa2773c75d198f33025840a05b2fcf77a56f443b1`, 후반 `ea39ac07f3e45fb61092b999720a1575c679c47791834e9d815ce4965cf02658`이다.
- 2026-09-05 현재 DAY 15 집중 테스트 81/81 PASS. 상태 계약, 두 원문 레지스트리, 두 playable resolver, runtime, immersive adapter, game integration을 포함한다.
- 이전 공개 릴리스 기록은 `218cd1fd78f01ac3ce85fcd56ac188e2ff56488e`와 `CAMPAIGN_DAY_RELEASE_PROGRESS.md`에 남아 있다. 당시 실제 제품 UI의 출석·무연락·전화/이탈 경로, 콘솔 0건, 390×844 레이아웃, 6/6 이미지 자산까지 통과했다.

## 문서 우선순위 정리

`DAY15_V4_IMMERSIVE_PRESENTATION_QA.md` 등 일부 중간 산출물의 `5/6`, `browser pending` 표기는 그 시점의 작업 중 상태다. 이후 공개 릴리스 및 실제 브라우저 완료 기록과 이번 81/81 재검증이 이를 대체한다. 앞으로 DAY 15 완료 여부는 이 문서와 `CAMPAIGN_DAY_RELEASE_PROGRESS.md`의 최종 DAY 15 항목을 기준으로 판단한다.

## 다음 작업

DAY 16 Notion 원문 전체를 같은 절차로 다시 잠그고, 현재 런타임의 Scene/Choice·경로·지식 경계·저장 재개 계약을 대조한다.
