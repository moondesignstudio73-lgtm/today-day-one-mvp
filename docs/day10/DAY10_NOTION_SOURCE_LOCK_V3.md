# DAY 10 Notion source lock V3

- Status: `PASS — AI해커톤 child-page body read completely; parent attachments ignored`
- Queried at: `2026-08-29T04:49:37.492Z` (`2026-08-29 13:49:37 KST`)
- Revalidated before campaign-data implementation: `2026-08-29T04:56:37.643Z` (`2026-08-29 13:56:37 KST`) — child body still contains ACT 1~4, SCENE 01~24, 11 main choices, and the SCENE 16 follow-up.
- Revalidated before SCENE 01~12 playable-script implementation: `2026-08-29T05:04:07.729Z` (`2026-08-29 14:04:07 KST`) — no child-body structure change; parent and child attachment blocks remained ignored.
- Revalidated before SCENE 13~24 playable-script implementation: `2026-08-29T05:11:07.875Z` (`2026-08-29 14:11:07 KST`) — SCENE 13~24, the SCENE 16 follow-up, and the DAY 10 ending hook were unchanged.
- Parent: `AI해커톤` — https://app.notion.com/p/3c7c31f029a680e3ac06c5e2373ce199
- Canonical child page: `DAY 10 — 기다린 사람의 저녁 | SCENARIO V3`
- Child page: https://app.notion.com/p/3c9c31f029a681498d65c95bc8aaaaa7
- Notion page id: `3c9c31f0-29a6-8149-8d65-c95bc8aaaaa7`
- Notion last-edited timestamp returned by workspace search: `2026-08-27T18:15:00.000Z`
- Locked body range: `ACT 1~4, SCENE 01~24, 주요 선택 1~11, SCENE 16 후속 선택 1개, INTERNAL IMPLEMENTATION NOTES, 직전 DAY 7~9 대조 분석`
- Declared scale: about 16,500 Korean characters including alternate branches; 25~35 minute target is author estimate and requires runtime measurement.

## Source handling

The child-page body is the primary manuscript. The parent-page Markdown attachments and the child page's `Markdown 원본` file block were deliberately ignored for lookup, comparison, split-file, missing-content, conflict, and access-wait gates under the user's latest rule. The full body was accessible; the connector's single-output middle truncation was completed by extracting SCENE 16~19 directly from the fetched page payload. No scene-range gap remains.

## Locked chapter contract

- Core event: the protagonist tries to present a perfect dinner, then learns to coordinate the time of the person who may sit at the table before perfecting the food.
- Locations and windows: protagonist home from morning to night; a Dongsu-dong shopping interior at midday; `gimbap-village` only for the takeout route; `flora-cafe` is a conditional DAY 11 invitation hook, not a DAY 10 visit.
- Participants: protagonist, Ha-eun, Ji-hoon by message, Min-ho by non-urgent work message, and Sora only as the owner of tomorrow's independent appointment.
- Playable scale: 24 scenes, 11 three-strategy choices, and one conflict follow-up choice. Agreement, menu, spending, work-message boundary, preparation truthfulness, actual timing, together/apart meal, mid-conflict departure, cleanup, Sora invitation, and farewell must be stored independently.
- Emotional curve: anticipation → competence anxiety → cooking complication → timing truth/avoidance → ordinary shared meal or justified distance → repair without forced reconciliation → respect for Ha-eun's separate friendship and tomorrow's conditional hook.
- Relationship contract: Ha-eun has hunger, outside errands, rest needs, her own home, and a Sora appointment. A successful preparation remains genuinely warm; conflict occurs only when an actual agreement and misleading timing create waiting. She may decline, eat separately, or leave. No forced visit, forced forgiveness, first hand-hold, hug, or kiss.
- Mystery/identity budget: Ji-hoon's egg joke contrasts remembered past habits with the protagonist's present improvisation without supplying a true old recipe. No ex-girlfriend disclosure, fake-Ha-eun truth, accident culprit, hidden occupation/MBTI, or new Seojin event may be added.
- Economy contract: menu choice and plate/decor spending only succeed within actual balance. Buying a plate does not guarantee affection; declining it does not award automatic frugality. Food taste, spending, and relationship outcome remain separate.
- Follow-up: DAY 11 Sora meeting invitation exists only when the protagonist asked respectfully, the relationship is comfortable, Ha-eun agrees, and Sora separately consents. Other routes preserve Ha-eun and Sora's private meeting.

## Required state handoff

1. Read DAY 9 V3 dinner status as `confirmed / contact-before-noon / deferred`; menu remains undecided.
2. Store final dinner agreement, Ha-eun refusal where applicable, menu route, shopping spend, work-message handling, preparation report, remake decision, actual completion estimate, timing correction or false reassurance, actual wait, face-to-face/apart meal, departure, emotional statement, cleanup, Sora request/consent, and conditional touch.
3. Require both DAY 9 green-shirt ownership and current-day wear before the green-shirt callback. Use the zipper callback when the DAY 9 sleeve fitting did not occur.
4. A prior hand-hold history plus current comfort is required for the brief farewell touch. Otherwise use a wave; this chapter cannot create first contact.
5. Preserve legacy DAY 10 saves from `m30-day10-three-hour-work-rhythm`. New starts route to `NOTION_V3`; existing V1 progress remains restorable and is never silently reinterpreted as dinner choices.

## Precedence resolution

`RESOLVED — the user's latest rule makes the fresh Notion child body authoritative for all scenario decisions.`

1. The Notion body is a domestic cooking, timing, honesty, and relationship-agency chapter.
2. The older locked event table describes partial past-relationship verification and conflicting testimony for DAY 10.
3. The current runtime is an 8-scene, 3-choice second office-adaptation chapter based on an obsolete DAY 9 office route.

The Notion V3 body supersedes both conflicting scenario outlines for new DAY 10 starts. The old office chapter is retained only for legacy-save compatibility. No DAY 11 content is modified during DAY 10 work.
## 2026-08-29T05:17:38.006Z 재검증

- 최신 하위 페이지 본문 SCENE 01~24, 선택 1~11, SCENE 16 후속 선택과 종료 훅을 기준으로 프레젠테이션·장면 런타임 계약을 연결했다.
- 상위 페이지 및 Markdown 첨부는 사용자 최신 확정에 따라 조회·충돌·접근 대기 판단에서 제외했다.
- 원문 사건 순서와 감정선을 바꾸지 않았으며, DAY 11 콘텐츠는 수정하지 않았다.
## 2026-08-29T05:23:08.134Z 런타임 연결 재검증

- 잠긴 하위 페이지 본문 SCENE 01~24와 11개 선택·SCENE 16 후속 선택의 순서를 게임 컨트롤러에 그대로 연결했다.
- 상위 페이지 및 Markdown 첨부는 사용자 최신 확정에 따라 사용하지 않았다.
- 신규 V3와 기존 V1 저장을 분리했으며 DAY 11 콘텐츠는 수정하지 않았다.
## 2026-08-29T05:29:38.249Z 자유행동 연결 재검증

- 잠긴 하위 페이지의 저녁 시간·요리·하은 독립 일정·소라 동의 훅만 자유행동으로 확장했다.
- 원고의 사건 순서·감정선을 바꾸지 않았고 상위/첨부 Markdown 및 DAY 11 콘텐츠는 사용하지 않았다.

## 2026-08-29T05:40:08.505Z 실제 브라우저 재검증

- 잠긴 하위 페이지의 선택 1~11과 SCENE 16 갈등 후속 선택을 실제 제품 UI에서 순서대로 완주하고, 선택 1 저장 체크포인트의 새로고침 복원을 확인했다.
- 직접 배경 URL 보존 결함만 수정했으며 원문 장면·대사·선택·감정선과 DAY 11 콘텐츠는 변경하지 않았다.
- 상위 페이지와 Markdown 첨부는 사용자 최신 확정에 따라 사용하지 않았다.
