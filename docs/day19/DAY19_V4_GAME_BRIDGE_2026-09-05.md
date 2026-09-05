# DAY 19 V4 본선 브리지 및 저장 QA

## 구현 범위

- `day19-v4-game-bridge.mjs`가 SCENE 01~24의 네 순수 플레이 구간을 본선 형식으로 변환한다.
- C4 뒤 SCENE 06, C7 뒤 SCENE 12~13, C12 뒤 SCENE 18을 한 선택 결과 시퀀스 안에서 이어 붙인다.
- `openingBoundary`, `middleBoundary`, `candidateBoundary`, `endingBoundary`는 내부 연결 표식으로만 사용하고 Renderer에 전달하지 않는다.
- `home-morning`, `home-afternoon`, `corner-cafe`, `home-evening`을 기존 검증된 배경에 연결하고, 장면 시간은 09:00/14:00/19:00/22:00으로 표시한다.
- 새 DAY 19 진입은 DAY 18 V4 완료와 `day18V4Day19HookPending`이 모두 있어야 한다. 이미 시작한 축약 DAY 19 저장은 legacy 런타임을 유지한다.

## 경제 원자성

- C3 복권 선택은 사전에 분리한 오락비와 현재 현금이 모두 충분할 때만 5,000원을 한 번 차감한다.
- 기존 `buyInstantLottery`는 호출하지 않는다. 당첨 등급과 상금을 만들지 않고 `UNOPENED`, `prizeCounted:false`만 저장한다.
- 선택 적용 중 오류가 나면 DAY 19 장, 현금, 경제 원장, 구매 표식을 모두 직전 상태로 되돌린다.
- 예약·여행 결제·파트너 송금은 계속 발생하지 않는다.

## 완료 및 호환

- SCENE 24의 `chapterCompletionCue`만 DAY 19를 완료할 수 있다.
- 완료 시 캠페인 slot `m30-day19-current-shared-chore`에는 `scenarioId: day19-notion-v4`, 실제 16단계 선택과 facts를 기록한다.
- legacy 집안일 선택 효과와 legacy Free Action은 새 V4 경로에서 실행하지 않는다.
- DAY 20 선택기는 기존과 같이 완료된 캠페인 slot 이력을 통해 다음 장면을 찾을 수 있다.

## 자동 QA

- 브리지 집중 검사 7/7 PASS.
- shared/solo 전 구간이 16단계 끝까지 도달하고 내부 경계 표식이 플레이어 시퀀스에 남지 않음.
- 실제 `SaveManager`로 C9 이후 중간 저장을 JSON 왕복한 뒤 다음 시퀀스가 동일함.
- 복권 비용 1회 차감, 미확정 결과/상금 0, 실패 시 원장과 잔액 롤백 확인.
- legacy DAY 19 저장 비변조와 V4/legacy 본선 라우팅 분리 확인.
- 전체 `node --test --test-reporter=dot tests/*.test.mjs`, `npm test` 100×30일 시뮬레이션, `npm run check` PASS.

## 판정

DAY 19는 아직 `PARTIAL`이다. 본선 코드 연결과 자동 저장/회귀 검사는 완료했지만, 실제 브라우저에서 Friendly/Neutral/Distant/Mixed 비-SKIP 완주, 중간 저장 재개, 390×844 모바일, 콘솔 오류 0과 사용자 저장 복원이 남아 있다.

다음 시작점: 로컬 서버의 실제 게임에서 DAY 18 완료 저장을 복제해 DAY 19 shared Friendly 경로를 비-SKIP 완주하고, 각 선택 뒤 저장·화면·시간·장소·인물·Story/Free 배타성을 기록한다.

## 실제 브라우저 후속

Friendly 데스크톱 경로를 SCENE01부터 DAY20까지 SKIP 없이 완주하고 C5 이후 새로고침 재개, C15 미노출, 시간·장소 전환, Story/Free 배타성, 가로 넘침 0, console warning/error 0, 사용자 저장 복원을 확인했다. 상세 선택과 증거는 `DAY19_V4_BROWSER_QA_2026-09-05.md`에 기록한다.

Distant 데스크톱 첫 실행에서 연락 불가/solo인데 공동 C8·C11·C16 선택 문구가 노출되는 결함을 발견했다. game249는 기존 replay state option을 삭제하지 않고 playable presentation만 원문상 가능한 선택으로 좁혀 저장 호환성과 지식 경계를 함께 지킨다. 수정 후 DAY20까지 비-SKIP 완주했고 하은 인물 노출 0, console warning/error 0, Story/Free 배타성, 가로 넘침 0, 사용자 저장 복원을 확인했다.

Mixed fixture의 DAY18 replay 누락을 합법 연락 가능/solo 이력으로 교정했다. 새 클린 탭에서 C3 복권 실제 1회 선택, C15 실제 서진 연락, solo C14/C16, 결과·상금 비노출과 DAY20 전환을 확인했다. 정확한 원장 차감은 자동 원자성 검사와 구분했으며 사용자 저장을 복원했다.

Neutral 첫 실행에서 C8 각자 여행 뒤 C11 공동 재확인과 SCENE22 편안한 공동 통화가 남는 결함을 발견했다. game250은 `SEPARATE_DAY_OK`의 playable C11을 후보 유지로 제한하고 SCENE22를 거리 두기 원문으로 연결하되 기존 replay 저장은 계속 유효하게 둔다. 수정본을 비-SKIP 완주해 solo C14, C15 생략, 합의 범위의 비송금, 거리 두기 엔딩, 콘솔 오류 0과 저장 복원을 확인했다.

DAY 19는 계속 `PARTIAL`. 다음은 390×844 모바일 네 경로다.

Mobile Friendly 후속에서 목표 390×844의 장치 배율 반올림값인 실제 `391×844` 모바일 미디어쿼리 영역을 확보했다. 15개 선택을 실제 버튼으로 눌러 DAY20 첫 Story 선택까지 SKIP 없이 완주했고, 수평 넘침 0, console warning/error 0, Free Action 비노출과 사용자 저장 복원을 확인했다. DAY19는 계속 `PARTIAL`이며 다음은 모바일 Distant다.
