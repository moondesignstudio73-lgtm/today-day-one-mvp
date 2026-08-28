# DAY 8 V3 Implementation Gap Audit

## Audit basis

- Authoritative source: `AI해커톤 > DAY 8 — 너 없는 오후 | SCENARIO V3`
- Page ID: `3c9c31f0-29a6-8146-84f6-d4e16dd4786b`
- Fresh lookup: 2026-08-28 21:30 KST
- Notion page snapshot reported by connector: 2026-08-27T17:59:45.559Z
- Authority: child-page body only; parent Markdown attachment ignored.
- User precedence decision: `노션이 우선`.

## Authoritative V3 contract

- Five acts, SCENE 01~24, ten authored choices.
- Normal route: 24 scenes / 10 choices.
- Rest route: 21 scenes / 9 choices.
- SCENE 15 is mutually exclusive among live house, cafe, and home.
- Core dramatic change: the protagonist stops treating Jihoon only as a source about his own past and listens to Jihoon's current work, regret, and good news.
- Haeun spends the day independently with Sora. Contact is an agreement, not permission or surveillance; the two do not meet face to face.
- The private cut client work and separate public-credit video remain distinct knowledge objects.
- DAY 9 hook: Haeun suggests looking at different clothing colors; no purchase or appointment is forced in DAY 8.

## Scene and choice coverage comparison

| Area | Current implementation | Authoritative V3 | Verdict |
|---|---|---|---|
| Main event | Solo pharmacy/mailbox/household-store errand | Jihoon lunch and current-life listening day | Replace |
| Scene count | 8 | 24 | Rebuild |
| Choice count | 3 axes / 9 strategies / 27 combinations | 10 authored choices with route conditions | Rebuild |
| Participants | Protagonist, Haeun, pharmacy/store staff | Protagonist, Jihoon, Haeun by message/call, Sora by reference, venue staff | Rebuild |
| Locations | Home, street, pharmacy/mailbox, household store | Home, Hongdeung restaurant, route-dependent afternoon spaces, separate evening contact | Rebuild |
| Emotional center | Independent errand competence | Listening to a friend's present rather than extracting one's past | Replace |
| Haeun agency | Contact contract around protagonist's errand | Independent film outing and privacy-aware debrief | Replace |
| Ending hook | Second office adaptation | Clothing-color invitation/deferral | Replace |
| Save contract | `day8RuntimeStage` 0~3 and three legacy strategy keys | Ten choice memories, route/rest, appointment/change/late/truth and listening/privacy state | Migrate compatibly |

## Existing files requiring V3 rebuild

- `docs/day8/DAY8_SCENARIO_DRAFT_V1.md`: old 8-scene errand chapter; not authoritative for player-facing DAY 8.
- `docs/day8/DAY8_SCENARIO_QA_V1.md`: validates the superseded chapter and cannot certify V3.
- `src/day8-campaign-runtime.mjs`: old three-axis runtime and completion hook; requires V3 data/runtime split with legacy-save routing.
- `src/day8-presentation-data.mjs`: old household-store presentation map; requires 24-scene route-aware presentation.
- `game.js`: prompts, completion, free-action, resume, and DAY 9 handoff target old flags.
- `tests/day8-*.test.mjs`: currently pass the old contract; passing is only a legacy baseline, not V3 acceptance.
- `tests/story-free-action-day8.test.mjs` and DAY 9 callback tests depend on old completion flags and must be preserved through explicit migration or revised only when the V3 contract supplies replacements.

## Preservation and migration constraints

- Keep existing `m30-day8-independent-errand` saves playable; do not reinterpret their three choices as V3 choices.
- New DAY 8 starts use a distinct V3 version marker and ten-choice checkpoint contract.
- Completed legacy DAY 8 saves remain completed and continue to DAY 9 without replay.
- Preserve DAY 7 V3 callbacks, including Jihoon's invitation and valid relationship/contact history.
- Preserve free-romance mode, DAY 1~7, user assets, and all unrelated save fields.
- Do not mutate Seojin affection/status-interest axes from DAY 8 V3.
- Do not expose locked Haeun profile fields, the late fake-Haeun truth, accident culprit, or intentional-harm conclusions.

## Gate result

- Notion source access: PASS.
- Source precedence: PASS.
- Existing implementation parity: FAIL — `REBUILD REQUIRED`.
- Legacy baseline tests: PASS (4/4), but they certify only the superseded V1 implementation.
- Next gate: create the DAY 8 V3 chapter contract, Voice Profiles, full knowledge ledger, information/relationship budgets, 24-scene/10-choice data contract, and explicit legacy migration map before changing the runtime.
- DAY 9 must not start.
