# NPC 구성

이 문서는 자유연애 모드의 NPC 설정과 TIP 게임도구 연결 정보를 관리하기 위한 자료다.

## 전 여자친구 유리

| 항목 | 설정 |
| --- | --- |
| NPC ID | `player-ex` |
| 이름 | 유리 |
| 나이 | 28세 성인 |
| 성별 | 여성 |
| 직업 | 고서 복원가 |
| 역할 | 전 여자친구 |
| 관계 유형 | `ex` |
| 관심 대상 | 플레이어 |
| 성격 | 차분 · 미스터리 · 여운 |
| 스토리 태그 | `ex`, `temptation` |
| 기본 이미지 | `assets/heroines/yuri/outfits/02.webp` |

## 게임 연결

- 유리는 매 회차 활성 NPC로 생성된다.
- 기존 저장파일의 `가은` 프로필은 불러올 때 유리의 최신 프로필로 갱신된다.
- 기존 호감도·신뢰도·관심도 등 플레이 기록 수치는 유지된다.
- TIP 게임도구의 NPC 탭에서 유리를 선택할 수 있다.
- NPC 상세 카드에 이미지, 나이, 직업, 호감도, 신뢰도와 관련 이벤트가 표시된다.
- `전 여자친구 유리와의 우연한 재회` 이벤트 실행 버튼이 연결된다.

## 관련 소스

- NPC 원본 설정: `src/npcs-data.mjs`
- NPC 생성과 저장 데이터 갱신: `src/npc-manager.mjs`
- 캐릭터 이미지 연결: `src/assets/asset-manifest.mjs`
- 이벤트 데이터: `src/situation-events-data.mjs`
- 장면 캐릭터 판별: `src/scene-presentation.mjs`
- TIP 게임도구 화면: `game.js`, `styles.css`

