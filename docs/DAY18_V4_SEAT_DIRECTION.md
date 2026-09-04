# DAY18 옆자리 연출 계획 — 2026-09-04 20:38

SCENE14 입력은 기존 close_seat 선택과 하은의 명시 수락이다. 새 약속/접촉 플래그는 추가하지 않는다. 원문의 순서는 “와.” → 주인공 자리 이동 → 고개를 돌려 말함이다. 기존 런타임은 이동 설명이 대사 뒤에 있어 순서가 뒤집혔다.

계획: 기존 옷/인물과 식당 참조로 옆에 앉은 시점의 전용 장면 이미지를 제작한다. 수락 직후 crossfade로 옆자리 시점으로 전환하고 이후 대사 동안 유지한다. 겹치는 정면 스프라이트는 숨긴다. 다음 집 장면은 기존 전환으로 복원한다. 자리 이동을 설명하는 일반 독백은 제거한다. 가방 치우기/어깨 접촉 세부 애니메이션은 별도 미완료로 남긴다.

기존 스키마·선택 ID·장면 그래프 변경 없음. 이미지 생성은 imagegen built-in, 기존 파일 보존. 원본의 동의를 확대해 키스나 손잡기를 추가하지 않는다.

## 구현/실제 QA

- 자산 `assets/events/day18-v4/haeun-beside-seat-v1.png`를 프로젝트에 저장하고 `day18-haeun-beside` 배경으로 등록했다. 참조는 기존 day8 sage 복장과 005_alley-pub 배경이다.
- 수락 직후 전용 배경으로 전환한다. 정면 스프라이트를 추가로 겹치지 않으며 이후 대사까지 유지한다. 늦게 출력되던 자리 이동 독백을 제거했다.
- 실제 브라우저: 하은 약속 유지 → 점심 답장 → 나눠 먹기 → 좋은 마음 → 옆자리 요청. SKIP 없이 수락 “와.”를 본 뒤 가까운 자리 화면/“말하려면 이렇게 봐야 되네.” 연결을 시각 확인했다. 얼굴이 대화창에 가리지 않으며 동일 복장과 식당 맥락을 유지한다.
- 이 구간에서 새로고침·이어하기: 반응 시작의 “와.”부터 다시 재생, 옆자리 배경 재적용 후 밤 22:00 home-evening으로 복원 확인. 콘솔 오류/경고 없음. QA 전 저장 복원 성공.
- 정지 장면과 crossfade로 시점 이동을 표현했다. 가방을 실제로 움직이는 애니메이션, 어깨 접촉, 남은 음식의 시각적 연속성은 아직 미완료다. 전체 SCENE14/전체 DAY18 완료로 판정하지 않는다.
- 다음: 전화/문자 구분과 실제 통화 가능 여부 협의. 이후 물건 행동 누락 감사와 네 성향 전체 완주를 마친다.
- 전체 자동 테스트 434 PASS, 0 FAIL. 수락→전환→대사 순서, 다른 두 선택에서 미표시, 집 복귀, 직렬화 재생을 검사했다. `git diff --check` 통과.

최종 프롬프트, built-in imagegen:

> Use case: compositing. Asset type: Korean visual novel DAY18 beside-seat scene background, landscape 16:9. Image 1 is Haeun identity and exact outfit reference; image 2 is exact restaurant environment reference. Create a seated first-person view immediately beside Haeun at one round red table in this same humble evening alley pub. The viewer has just moved from opposite to an adjacent stool; Haeun remains seated facing the table and turns her head slightly sideways toward the viewer, natural small smile, quiet ordinary intimacy. Preserve her purple bob, eyes, earrings, sage overshirt over white tee, navy trousers, necklace and anime illustration identity. Her black bag is out of the adjacent seat, set near her own stool, not worn across her torso. Keep the pub's red round tables, plastic stools, warm bulbs, awning and nighttime surroundings. Half-full plain water glass on table. Viewer body/hands not visible. No embrace, kiss, handholding, other people, text, UI or watermark. Compose her face in upper-middle area so bottom quarter remains available for existing dialogue overlay. Do not add a sofa, booth, upscale restaurant or different clothes.
