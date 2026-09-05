# DAY18 원본 대조 후속 — 2026-09-04

전체 판정은 여전히 PARTIAL이다. DAY30까지 구현 요청은 미완료다. DAY19 원문을 보존했지만 DAY19~30 요약 확대기는 아직 교체하지 않았다.

## 변경

- 원문 간접화법인 하은의 파일 이름 소동과 유리의 작업 후 일상을 실제 대화로 옮겼다. 명시적으로 작성한 앵커에만 연결하며, 일반 sourceNote 자동 독백 변환은 하지 않는다.
- 유리의 도착 전에는 인물을 숨긴다. 하은과 연락하지 않는 경로에도 유리와의 작별을 붙였다.
- 유리 저녁을 설명할 때 실제 선택한 만남 목적과 재만남 요청/유보를 전달한다. 요청을 수락으로 바꾸지 않는다.
- 하은과 함께 먹은 날에 유리 저녁에서 돌아온 듯한 대사, 혼자 저녁을 보낸 듯한 마지막 회고를 수정했다.
- 과거의 UNKNOWN 감정을 적극적인 관심으로 바꾸지 않는다. 새 진입의 컨텍스트만 수정하며 이미 저장된 입력/선택은 다시 쓰지 않는다.
- 문자 전용 말풍선과 발신/수신 구분을 추가했다. 기존 VN 색상/글꼴/진행 입력을 유지했다. 설계는 STORY_PHONE_PRESENTATION_PLAN.md.
- pointerdown에서 전체화면을 요청하면 누르기/떼기 사이 버튼 위치가 바뀔 수 있어 click 캡처 시점으로 옮겼다. 전체화면 재진입 요구는 유지한다.

## 검증 범위

- `node --test --test-reporter=dot tests/*.test.mjs`: 종료 코드 0. 총 418개 테스트. 이전 실행의 실패 두 건은 불확실함=관심이라는 잘못된 기대값과 pointerdown 강제 정규식이었다. 수정 의도에 맞게 반례를 강화했다.
- `npm run check`, `git diff --check`: 통과.
- 앵커 유효성, 파일 농담 순서, 도착 전 인물, 무연락 작별, 실제 목적 전달, 함께 먹은 날의 회고에 회귀 검사를 추가했다.
- 실제 앱 브라우저, 별도 QA 저장: 하은 약속 유지 → 함께 나눠 먹기 → 좋은 마음 → 짧은 산책 → 남은 생각 → 여행 의향 → 부산 시간/비용 후보 → DAY19 진입. SKIP 버튼을 사용하지 않았다. 클릭으로 타자 출력을 완료했으므로 자연 독서시간/25분 충족 증거는 아니다.
- 밤 대화 도중 새로고침 → 이어하기 → 같은 구간과 선택 재개 확인. 아침 문자는 작게, 식당 일반 대화는 기존 형태로 복원됨을 확인했다.
- 문자 데스크톱 화면을 시각 확인했다. 모바일, 모든 분기 및 모든 원문 행동 연출은 아직 전수 검증하지 않았다. 반복 출력 일부는 QA 읽기 도우미가 타자 중간 문자열과 완료 문자열을 각각 수집한 것이므로 대사 누락 여부의 단독 증거로 쓰지 않는다.
- 4성향 전체 완주와 NEW GAME→DAY30은 NOT RUN. 이 기록을 전체 시나리오 완료 증거로 사용하지 않는다.

## 동네 밤 배경

- 실행: built-in imagegen, 기존 이미지 편집. 원본 보존.
- 입력: assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png
- 저장: assets/backgrounds/street/BG_RELATIONSHIP_STREET_NIGHT_001.png
- 생성 결과 시각 확인: 같은 거리와 시점, 어두운 하늘, 따뜻한 조명, 빈 보행로. 강변 대체 배경 제거.

최종 프롬프트:

> Use case: lighting-weather. Asset type: visual novel neighborhood evening background. Edit target: attached existing daytime neighborhood street. Change only time and illumination to after sunset, dark blue sky, warm street and shop lamps lighting a safe clearly visible pedestrian path. Preserve exact camera perspective, street and buildings, benches, trees, empty foreground, existing illustration style and 16:9 composition. Keep the ground dry. No river, no people, no new objects, no text or UI. The scene must unmistakably be the same neighborhood at night.

## 종결 후속 — game248 / 2026-09-05

- 이 문서의 PARTIAL 표기는 2026-09-04 원본 대조 후속 당시 기록이다. 이후 원문 행동 대응과 분기 경계를 보완하고 동일 버전 네 성향 데스크톱·모바일 비-SKIP 완주를 완료했다.
- 모바일 유효 영역은 `389×844`, 모바일 미디어쿼리 활성, 가로 넘침 0이다. 네 경로 모두 DAY19 전환과 console warning/error 0을 확인했다.
- DAY15~17 재감사도 모두 닫혔으므로 DAY18 V4는 **PASS / COMPLETE**로 승격한다.
- DAY19~30과 NEW GAME→ENDING 네 경로는 아직 미완료이며 이 종결을 그 범위의 완료 증거로 사용하지 않는다.
