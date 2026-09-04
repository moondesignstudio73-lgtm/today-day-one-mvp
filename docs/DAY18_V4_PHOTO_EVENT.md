# DAY18 지훈 사진 이벤트 계획

2026-09-04 20:31 KST. 원문 SCENE15: 지훈이 거의 빈 그릇 사진을 보낸 뒤 주인공이 “리뷰가 아니라 증거네”라고 말한다. 현재 사진이 빠져 농담의 원인이 보이지 않는다.

- 입력: 기존 SOLO → solo_jihoon 선택. 출력/저장 계약 변경 없음.
- 순서: 지훈 “내가 지금 입이 바빠.” → 사진 CG → 주인공 “리뷰가 아니라 증거네.” → 지훈 응답.
- 기존 cgShow 엔진을 사용하며 다른 선택에 사진을 삽입하지 않는다. 렌더링 메모를 대사로 대체하지 않는다.
- imagegen 스킬의 built-in 방식으로 사진 자산 한 장을 만든다. 지훈의 인물/집/동행/메뉴를 확정하지 않는 그릇 클로즈업이다.
- 저장 후 같은 선택 반응 재개 시 사진도 재생된다. 별도 이력 플래그를 만들거나 사진을 새 약속으로 기록하지 않는다.
- 다음은 에셋 확인, 앵커/파일/분기 테스트와 실제 브라우저 사진 재생 확인이다.

## 구현 및 검증

- 신규 자산: `assets/events/day18-v4/jihoon-finished-bowl-v1.png` (프로젝트에 복사, 원본 보존). imagegen built-in 생성 결과를 시각 확인했다. 거의 빈 그릇, 불특정 상판, 인물/동행/문자 없음.
- 원문 “리뷰가 아니라 증거네.” 앞의 명시 앵커에 cgShow 3초를 연결했다. 다른 연락 선택에는 표시하지 않는다.
- 원문 인용 검사에서 `source`가 대사 위치 객체인지 이미지 URL 문자열인지 구분하도록 수정했다. 대사 원문 검증은 유지한다.
- 실제 브라우저: 혼자 → 점심 고지 → 익숙한 김밥 → 지훈 안부. SKIP 없이 진행, 사진 전체 표시 스크린샷 확인, 이후 “리뷰가 아니라 증거네.” 문자로 정상 복귀. 콘솔 오류/경고 없음. 테스트 전 저장 복원 성공.
- 사진은 기존 전체 CG 뷰어를 사용한다. 문자 내 첨부 썸네일/수동 확대·닫기 UX는 구현하지 않았다. 이 변경으로 DAY18 전체 연출 PASS를 주장하지 않는다.
- 전체 자동 테스트 433 PASS, 0 FAIL. 사진 분기 배타성·앵커 순서·파일 존재·직렬화 재생을 검사했다. `git diff --check` 통과.
- 다음 우선 작업: SCENE14 자리 이동 순서/실제 연출, 전화·문자 구분. DAY18 PARTIAL 유지.

최종 생성 프롬프트 (built-in imagegen):

> Use case: photorealistic-natural. Asset type: in-story photo sent by a friend in a Korean visual novel, not a UI mockup. Create a candid smartphone photograph of one almost empty plain white ceramic dinner bowl on an unidentifiable plain tabletop. Only a few tiny indistinct food remnants remain; clearly someone has nearly finished eating. Close overhead slightly tilted framing, bowl fills most of square image, ordinary warm indoor evening lighting, natural ceramic texture. No people, hands, faces, extra place settings, room interior, phone frame, interface, letters, captions, logos or watermark. This is the photo itself, not a photo of a phone. Do not imply any particular meal, household, or dining companion.
