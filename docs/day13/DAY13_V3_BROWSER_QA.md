# DAY 13 V3 actual browser QA

- Status: PASS
- Authoritative source: `AI해커톤` child page `DAY 13 — 모르는 사람에게는 | SCENARIO V3`
- Fresh lock: 2026-08-30 03:03 KST, 24 scenes, 12 choices
- Parent-page Markdown attachments: ignored

## Environment

- Fresh local server: `http://127.0.0.1:4173/`
- Browser: Codex in-app browser, new tabs only; no prior DAY 11 session was awaited or reused.
- A localhost-only `?qa=day13-v3` bootstrap was temporarily injected solely to place a normal Story Mode save at DAY 13. It altered only the test entry point, was removed immediately after QA, and never changed DAY 13 scene, choice, presentation, runtime, or save modules.

## Desktop complete route

- Viewport: `1920×1080`
- Route: Seoul Forest → unpolished photo → reseeing familiar things → move one step → rest → one portrait then decide → work relearning → ask for later photo talk → name Haeun as girlfriend → occasional photo exchange → tell Haeun about Ara → no-full-explanation comfort.
- All 12 choices appeared in manuscript order and their immediate continuations rendered without a dead end.
- Completion advanced to DAY 14, proving DAY 13 scene-end, completion flag, pending-story release, and adjacent-day reachability.
- Console warnings/errors: `0`.
- Horizontal overflow: `0` (`scrollWidth === innerWidth`).

## Mobile complete route

- Viewport: `390×844`
- Route: stay home → unpolished photo → move one step → leave early → remain photographer → resting/work-visit memo → no contact → report a quiet solo day.
- No-Ara route correctly omitted choice 3, choices 8–9, the Ara report option in choice 11, and choice 12. It did not dead-end and advanced to DAY 14.
- The title/HUD, three-line choice layer, background, and dialogue panel remained inside the viewport. The inspected choice screen had no face/hand/action-critical crop and no horizontal overflow.
- Visible broken images: `0`; console warnings/errors: `0`; `scrollWidth 390 === innerWidth 390`, `scrollHeight 844 === innerHeight 844`.

## 2026-08-30 02:42 KST — connected Ara sprite revalidation

- 기존 DAY 1~12 경로를 재감사한 뒤 내장 ImageGen 승인 원본과 DAY 2 결정적 로컬 알파 추출을 재사용해 만든 `887×1774 RGBA` 아라 스프라이트를 실제 런타임 SCENE 06에 연결했다. OpenAI API SDK나 `OPENAI_API_KEY`는 사용하지 않았다.
- 새 로컬 서버와 새 인앱 브라우저 탭에서 localhost 전용 임시 진입점으로 서울숲·SCENE 06을 열었다. 임시 진입 코드는 확인 직후 완전히 제거했다.
- 데스크톱 `1920×1080`: 원본 `887×1774` 로드, 깨진 가시 이미지 0, 수평·수직 오버플로 0. 아라의 얼굴·양손·검은 카메라가 HUD와 대화창 위 안전 영역에 남고, 서울숲 배경의 광원·눈높이·스케일과 자연스럽게 결합됐다. 육안 PASS.
- 모바일 `390×844`: 원본 `887×1774` 로드, 깨진 가시 이미지 0, 수평 오버플로 0(`390 === 390`). 얼굴·손·카메라는 계산된 표시 영역 안에 남았다. 문서 전체 높이는 브라우저 셸 여백 12px을 포함해 856px이었다.
- 인앱 브라우저가 작은 뷰포트의 스크린샷 파일을 반환하지 않았지만, 실제 `390×844` 브라우저 렌더에서 원본 크기·깨진 이미지·표시 경계·스테이지 경계·가로 오버플로를 직접 검사했다. 스크린샷 파일 부재는 증적 형식의 제한으로 기록하되 실제 브라우저 품질 관문을 막는 런타임 실패로 취급하지 않는다.
- `game.js` 구문 검사, DAY 13 V3 집중 6개, 전체 저장소 테스트 `183/183 PASS`를 재확인했다.

## Result

- Actual desktop/mobile progression, conditional choice omission, scene transition, adjacent DAY reachability, console, and responsive layout: PASS.
- 최초 전체 경로 QA와 연결 후 데스크톱 스프라이트 육안 QA는 PASS다. 모바일 연결 상태도 실제 `390×844` 브라우저의 DOM·원본 자산 로드·표시 경계·가로 안전 영역 검사로 PASS다.
- 작은 뷰포트 스크린샷 파일은 도구가 반환하지 않아 별도 증적 제한으로 남겼다. 이는 이미 수행한 실제 브라우저 렌더 검사를 무효화하지 않으며 DAY 13 브라우저 관문에는 남은 실패가 없다.
