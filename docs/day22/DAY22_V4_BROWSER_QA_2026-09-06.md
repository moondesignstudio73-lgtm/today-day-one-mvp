# DAY22 V4 실제 브라우저 QA — 2026-09-06

## 이번 검증 범위

- 경로: Friendly · 부산 확정 · 공유 숙소
- 시작 상태: 실제 DAY18→21 production reducer와 game bridge를 순서대로 완주해 생성
- 진행 방식: 실제 게임 화면의 선택지를 처음부터 DAY23 전환까지 플레이
- AUTO: 사용
- SKIP: 사용하지 않음
- 저장 보호: 실행 전 3개 SaveManager 키를 sessionStorage에 백업하고 종료 뒤 원상 복원

## 발견한 HIGH 오류와 수정

첫 실행은 DAY22 첫 선택 직후 `DAY22_BACKGROUND_MISSING:day22-busan-station`으로 안전 종료됐다. manifest 원본에는 배경이 있었지만 `game.js`와 DAY22 bridge가 서로 다른 캐시 세대의 asset manifest를 읽어 브라우저에서만 누락된 문제였다.

- `game.js`와 `day22-v4-game-bridge.mjs`가 동일한 `asset-manifest.mjs?v=24`를 사용하도록 고정
- DAY22 bridge를 `v=2`, 최상위 game script를 `v=258`로 올려 배포 캐시 사슬 갱신
- bridge 정적 회귀에 양쪽 manifest 버전 일치 검사를 추가

수정 후 같은 fixture를 처음부터 다시 실행했고 부산역 배경 누락과 안전 종료가 재발하지 않았다.

## 실제 경로 결과

- 짐 분담, 함께 이동, 가까운 동선, 식사, 같은 속도, 풍경 사진 공유를 순서대로 진행
- 공동 사진은 별도 보관 선택 뒤에만 유지
- DAY21의 실제 `SHARED_ROOM_AGREED` 이력이 있는 상태에서만 공유 숙소 장면 진입
- 휴식 순서와 현재 함께 있고 싶은 방식을 고른 뒤, 포옹은 현재 접촉 선택을 거쳐 처리
- DAY21 교통·숙박비의 중복 차감 없이 부산 밤 장면 종료
- DAY22 완료 후 화면이 `DAY 23 · 화요일 / STORY · D-8`로 전환
- legacy DAY22 Free Action은 노출되지 않음
- 테스트 종료 후 `테스트 전 저장을 복원했습니다.` 상태 확인

## 판정

Friendly·부산·공유 숙소 데스크톱 의미 경로는 PASS다. 다만 Neutral/Distant/Mixed, 부산 별실, 서울 당일, 미여행, 389×844 모바일 경로는 아직 실제 브라우저 검증 전이므로 DAY22 전체 상태는 **PARTIAL**을 유지한다.

다음 시작점은 부산 별실과 서울 당일 데스크톱 경로를 같은 fixture 방식으로 추가하고, 사진 삭제·접촉 거절·비연락 미여행의 fail-closed 결과를 실제 화면에서 검증하는 것이다.
