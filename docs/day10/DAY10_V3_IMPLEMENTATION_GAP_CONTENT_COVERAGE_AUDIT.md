# DAY 10 V3 implementation gap and content coverage audit

Status: `PASS FOR REBUILD — source complete, replacement scope identified, runtime implementation not started`

Canonical source: `DAY10_NOTION_SOURCE_LOCK_V3.md`

## Current implementation gap

| Area | Current V1 | Locked Notion V3 | Required rebuild |
|---|---|---|---|
| Main event | Three-hour office adaptation | Preparing dinner while respecting agreement, timing, hunger, and separate schedules | Route all new DAY 10 starts to V3; retain V1 only for legacy saves |
| Scale | 8 scenes, 3 choices, 27 combinations | 24 scenes, 11 three-strategy choices plus one conflict follow-up | Implement the complete scene and choice sequence without synopsis compression |
| Previous callback | Obsolete DAY 9 office scope/pressure/debrief | DAY 9 V3 dinner proposal, clothing ownership/try-on, relationship comfort, prior timing history | Replace new-start callbacks; never map office flags onto dinner state |
| Locations | Home, office, project room, neighborhood cafe | Home, Dongsu shopping interior, conditional `gimbap-village`; `flora-cafe` is next-day hook only | Add domestic/shop/takeout presentation; do not visit Flora Cafe during DAY 10 |
| Systems | Work rhythm, recovery, coworker lunch | Contact, groceries, spending, cooking/takeout, rest, work-message boundary, meal/cleanup | Integrate systems as relationship actions rather than tutorials |
| Ha-eun agency | Mostly checks recovery after work | May accept, decline, eat separately, change time, help, refuse emotional pressure, or leave | Implement exclusive branches and do not auto-reconcile |
| Save contract | `day10RuntimeStage` 0~3 and office strategies | Agreement/menu/spend/prep/timing/meal/departure/Sora/touch states | Add a version marker and granular checkpoints; preserve V1 state restoration |
| Presentation | Reused office and cafe backgrounds, DAY 8 standing sprite | Kitchen/table, phone, grocery bag, ingredients, egg/pan, plate, door arrival, two/one cup states | Audit existing assets first; produce action CG/POV only where no adequate asset exists |
| Follow-up | DAY 11 current-life-plan | Conditional Ha-eun/Sora meeting invitation and private-friend alternative | Replace new-start hook without editing DAY 11 yet |

## Story-data and controller gaps

- `src/story-data.mjs` still requires `m30-day9-second-office-adaptation` and describes the office chapter. New DAY 9 V3 completion must become the new-start prerequisite while legacy history remains recognized.
- `src/day10-campaign-runtime.mjs`, `src/day10-presentation-data.mjs`, `game.js` prompts/completion routing, and DAY 10 tests all encode V1 office stages. They require explicit `NOTION_V3` routing similar to DAY 9, not destructive replacement.
- Existing completion flags such as `day10DebriefStrategy` and `day10ThreeHourWorkRhythmCompleted` belong to V1. V3 must not reuse them for dinner semantics.
- Existing DAY 11 prerequisites depend on the V1 scene ID. Reachability must be preserved during V3 integration, but DAY 11 story content remains untouched until DAY 10 is fully deployed.

## Content and map integration

| Content | Classification | Narrative effect | Decision |
|---|---|---|---|
| Protagonist home/table/kitchen | Required | Turns competence anxiety into a real relationship event | Use throughout; key visual state is one place versus two places |
| Dongsu shopping interior | Required internal scene | Menu/spending/list discipline and fatigue | Present as a scene interior; do not claim it is a new map node |
| `gimbap-village` | Conditional | Takeout is a valid warm meal, not failure | Use only for the takeout menu route; existing map node and asset are available |
| Phone/messages | Required | Agreement, truthful status, work boundary, Sora hook | Preserve sender, time, and response availability by route |
| Cooking/meal/cleanup | Required | Shows action, consequence, warmth, conflict, and repair | Implement as playable scene state, not explanatory system text |
| Plate/decor spending | Optional | Tests whether appearance replaces actual preparation | Enforce balance and ownership; keep economic exposition under 20% |
| Min-ho work folder | Optional branch | Separates non-urgent work contact from today's home objective | Title-only view or deferral; no work completion or Seojin reward |
| `flora-cafe` | Follow-up only | Gives Ha-eun and Sora independent social space | Store conditional invitation; do not enter during DAY 10 |
| Free-mode home meal event | Reusable reference | Existing shared-meal vocabulary and next-grocery hook | Reinterpret for V3 state; do not copy generic event text |

## Recent-three-DAY repetition check

- DAY 7 centers attention and listening during a date.
- DAY 8 centers independent time and contact expectations.
- DAY 9 centers shopping preference, consent, and ownership.
- DAY 10 uses a small shopping beat only as setup; its center is domestic action, time coordination, hunger, truthfulness, and Ha-eun's independent schedule. Shopping must remain subordinate so DAY 9 is not repeated.

## Narrative-director and chapter-writer audit

- Playable density: source has 24 scenes and repeated changes of object, location, goal, participant, information, or relationship state. Do not compress to arrival → meal → choice → end.
- Voice: Ha-eun leads with practical messages, hunger, humor, and boundaries; the protagonist observes actual preparation, tests possibilities, states progress, judges, then acts. Ji-hoon's egg joke supplies warmth without an answer key.
- Knowledge budget: the only past-self signal is an ambiguous cooking habit. It supports present-versus-past identity without revealing the locked late mystery.
- Choice quality: all 11 choices are action strategies. Choice 5/6/7 must combine into actual timing rather than independently forcing conflict.
- Consequence: agreement, report truth, actual wait, departure, cleanup, Sora invitation, and farewell touch require observable reaction and persistence.
- Save compatibility: V1 office progress and V3 dinner progress must be versioned and restorable independently.

## 10-question preliminary QA

| Question | Result | Evidence / remaining gate |
|---|---|---|
| Romance | PASS | Invitation, shared cooking/meal, ordinary humor, farewell |
| Relationship change | PASS | Learns to value shared time and truthful coordination over a perfect reveal |
| Conditional dialogue | PASS IN SOURCE | Agreement, comfort, wait, departure, outfit, touch branches; runtime pending |
| Recent repetition | PASS | Domestic timing is central; shopping is subordinate |
| System/economy proportion | PASS IN SOURCE | Spending is one choice and tied to presentation anxiety; runtime timing pending |
| Ha-eun agency | PASS | Separate errands/home/friend, refusal, hunger, help, and departure |
| New relationship need | PASS | Sora is an independent next-day relationship, not a random cameo |
| Excitement/romantic payoff | PASS | Two-place setting, cup/meal humor, conditional brief touch |
| Mystery progression | PARTIAL PASS | Past cooking habit versus present improvisation; must not inflate into a solved clue |
| Next hook | PASS | Conditional Sora/Flora invitation or respected private meeting |

No three failures are present. This is not a completion verdict: runtime, assets, image QA, save restoration, focused/full tests, adjacent reachability, actual browser, commit, origin, same-SHA deployment, and public verification remain required.

## Actual browser gate — PASS (2026-08-29)

- Product entrypoint: PASS via saved DAY 9 completion → title continue → DAY 10 V3.
- Playable choices: PASS, 11 main choices plus the SCENE 16 conflict follow-up; source omission 0.
- Save restoration: PASS, reload after choice 1 resumed at choice 2 without replaying choice 1.
- Free-action integration: PASS, five domestic/relationship actions and zero V1 office/Seojin follow-ups.
- Adjacent reachability: PASS, the free-action completion reached the DAY 11 opening without changing DAY 11 content.
- Responsive UI: PASS at 1280×720 and 390×844; horizontal overflow 0, mobile choice layer 12px side clearance, console error/warning 0.
- Image/runtime defect corrected: V3 presentation now preserves its direct DAY 2-derived/home-night/market background URL instead of being overwritten by the legacy generic background resolver.
- Remaining gates: full regression, commit, origin, same-SHA gh-pages deployment, and public verification.

## Full regression gate — PASS (2026-08-29)

- Full suite: `tests/*.test.mjs` 164/164 PASS.
- Change hygiene: `git diff --check` PASS; no DAY 11 V3 implementation or content files changed.
- Compatibility: legacy DAY 10 V1 save/runtime tests and completed DAY 1~9 regressions remain green.
- Preservation: the two untracked DAY 1 source images remain untouched and excluded from the pending commit.
- Remaining gates: commit, origin, same-SHA gh-pages deployment, and public verification.

## Next implementation gate

Create V3 chapter/state data and focused source-fidelity tests for all 24 scenes, 11 choices plus the follow-up, exclusive agreement/meal/departure branches, DAY 9 callbacks, knowledge budget, and V1 save-version routing. Do not modify DAY 11 content.
