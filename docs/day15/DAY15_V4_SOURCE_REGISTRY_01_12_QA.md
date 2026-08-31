# DAY 15 V4 SCENE 01~12 정확 원문 레지스트리·누락 감사

상태: `EXACT SOURCE REGISTRY 12/12 PASS · ROUTE RESOLVER + IMMERSIVE ADAPTER CONNECTED · CONDENSED COPY REJECTED AS EXACT`

## 이해 잠금

- Understood as: 최신 Notion 하위 페이지의 SCENE 01~12를 문장·대사·선택·분기 순서 그대로 재현 가능한 정본으로 잠그고, 기존 타입 데이터가 의미를 보존했다는 이유만으로 원문 누락 0을 선언하지 않는다. 정확 원문 경로 resolver가 준비되기 전에는 기존 축약본을 최종 플레이 원고로 인증하지 않는다.

## 최신 원고

- `2026-08-31 05:34 KST`에 `AI해커톤 > DAY 15 — 빛나는 쪽을 보다 | SCENARIO V4` 하위 페이지 본문을 새로 완전 조회했다.
- 페이지 ID `3c9c31f0-29a6-8138-ab56-ed8ee668526d`, URL `https://app.notion.com/p/3c9c31f029a68138ab56ed8ee668526d?pvs=204`, 스냅샷 `2026-08-27T21:19:12.202Z`다.
- 연결기 응답 25,204자 전체를 3개 구간으로 완독했다. 페이지 본문은 기존 잠금과 동일하며 상위 Markdown 첨부와 `<file>` 블록은 원고로 사용하지 않았다.
- SCENE 01 표제부터 SCENE 13 직전까지 LF로 정규화한 정확 원문을 `RAW_DAY15_V4_SCRIPT_01_12`에 보존했다. 길이는 JavaScript UTF-16 코드 단위 9,711개, UTF-8 바이트 21,979개이며 UTF-8 SHA-256은 `cccf47e000930ff0e870536aa2773c75d198f33025840a05b2fcf77a56f443b1`다.

## 구현과 감사 결과

- `src/day15-v4-source-registry-01-12.mjs`가 페이지 ID·스냅샷·추출 경계·정규화·인코딩을 메타데이터로 고정하고, 12개 장면의 안정 ID, 제목, 원문 Markdown, 비필터 source steps, 선택 1~7 위치와 참석/자기 오후 경로 계약을 제공한다.
- 원문은 초대/미초대, 참석/자기 오후, 자기 오후 선택 3~5, 먼저 쉼/끝까지 관람, 선택 7의 질투/서투름/통제 세 분기를 모두 보존한다.
- 이 레지스트리는 모든 대체 문단을 함께 보관하는 `verbatim-route-superset`이다. 직접 렌더링하지 않으며 `exact-route-resolved-adapter-connected` 상태로 정확 resolver와 몰입형 어댑터가 저장 상태별 projection만 사용한다.
- 기존 `day15-v4-playable-script-01-12.mjs`는 핵심 사건과 선택 반응을 구현했지만 원문 문장 일부를 합치거나 생략했다. 예: 초대 없는 아침의 감정 연결, 별도 오후 의상 처리, 전시장 첫 방 감각, SCENE 06의 자기 오후 내면 진행, 출구에서 자기 얼굴을 확인하는 행동, SCENE 12의 공간·신체 반응이다.
- 따라서 기존 타입 데이터의 `원고 장면/대사/선택 누락 0` 판정은 REJECT다. 정본 9,711자 보존, route-resolved playable과 몰입형 어댑터 연결은 PASS다.

## 검증

- Node 테스트가 UTF-16 코드 단위 길이·UTF-8 바이트 길이·UTF-8 SHA-256으로 원문 동일성을 검증한다. 브라우저 호환 구조 validator는 별도로 장면 `12/12`, 정확한 선택-장면 대응, 전체 경로 계약, 핵심 반응 마커와 SCENE 13 미포함을 검증하며 해시 동일성을 주장하지 않는다.
- 공유 원문 파서는 278개의 대화·내레이션·섹션·무대 단계 projection을 만든다. 이 projection 자체를 무손실 정본이라고 주장하지 않으며, 선택 목록과 분기 표제를 포함한 `sourceMarkdown` 원문이 동일성 정본이다.
- 축약본에 없고 정본에는 있는 대표 문장 8개를 회귀 테스트로 고정해 축약본이 다시 exact로 오인되지 않게 했다.

## 후속 상태와 남은 관문

- SCENE 01~12 정확 resolver와 몰입형 어댑터 연결은 현재 저장 상태와 선택 ID를 fail-closed로 해석하는 집중 검증을 통과했다.
- `game.js` 실제 V4 진입 연결 뒤 DAY 15 전체 `Notion 원고 누락 0`을 재판정한다.
- `game.js` 연결, 이미지·연출/오디오·전체 회귀·브라우저·커밋·push·배포는 그 이후다. DAY 16은 시작하지 않는다.
