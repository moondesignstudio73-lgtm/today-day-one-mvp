# DAY 12 V3 implementation gap and content coverage audit

Status: `AUDIT COMPLETE / NOTION AUTHORITY RESOLVED / REBUILD NEXT`

Source: `docs/day12/DAY12_NOTION_SOURCE_LOCK_V3.md`

## Current implementation baseline

The repository currently ships `m30-day12-current-account-review`: an eight-scene, three-choice home/cafe finance-boundary chapter titled `현재 계정의 주인`. It verifies account ownership and current living expenses, preserves Seojin's two metrics, and hands off to `day13CurrentHouseholdBudgetPending`.

Focused baseline tests all pass, but only for that obsolete contract:

- `tests/day12-scenario.test.mjs`
- `tests/day12-runtime.test.mjs`
- `tests/day12-presentation.test.mjs`
- `tests/day12-regression.test.mjs`
- `tests/story-free-action-day12.test.mjs`

Result on 2026-08-29: `5 PASS / 0 FAIL` with bundled Node. This is not a V3 narrative PASS.

## Gap matrix

| Gate | Current repository | Notion V3 source | Result |
|---|---|---|---|
| Scene density | 8 scenes | 24 scenes | FAIL |
| Meaningful choices | 3 finance choices | 13 choices + conditional intent choice | FAIL |
| Central event | current-account verification | office adaptation, training-screen observation, lunch | FAIL |
| Earlier event table | dinner/drinking absent | superseded by explicit Notion-first decision | RESOLVED |
| Haeun relationship | cooperative finance rules | tiered messaging, honesty/deferral/contradiction, emotional distance | FAIL |
| Seojin role | metrics frozen and off-screen | work expectation + independent personal-interest path | FAIL |
| Minho/team lead | absent | active agency and shared-credit choices | FAIL |
| Mystery/current identity | ownership boundary | present competence without false memory certainty | FAIL |
| Save contract | three legacy flags, stage 0–3 | 13 choices, conditional branch, stage resume, DAY 13 outing plan | FAIL |
| Playtime | 8–12 minutes | 25–35 minutes | FAIL |
| Presentation | home/cafe, Haeun-only outfit | office/training UI/vending/lunch/phone/home ensemble | FAIL |

## Content and system coverage

Existing systems can support office location, work trial, coworker lunch, messaging, fatigue boundary, free action, NPC continuity, and separate Seojin metrics. Existing DAY 5/9/10 office assets and NPC identities are reuse candidates, subject to DAY 2 visual-quality comparison and actual scene fit.

The fetched source naturally integrates:

- `system + current action + relationship`: bounded work practice, lunch choice, fatigue stop, phone disclosure;
- `past clue + uncertainty`: Seojin expected an old problem-solving style but does not establish a past romance or a single true account;
- `current identity`: the protagonist contributes through an observed misunderstanding rather than recovered expertise;
- callbacks to DAY 7 photo receipt/personal interest, DAY 10 folder, and DAY 11 question note/three-hour boundary;
- a DAY 13 outing-plan strategy hook.

The earlier dinner/drinking event is superseded by the user's 2026-08-29 Notion-first decision. It must not be appended to the bounded lunch chapter.

## Required rebuild once authority is resolved

1. Keep existing `day12VerifyStrategy`, `day12ExpenseStrategy`, `day12AccessStrategy`, completion flags, and old save resumes valid while new saves select V3.
2. Build the source-faithful campaign data, playable script, runtime, immersive adapter, and presentation modules.
3. Keep `seojinAffection` and `seojinStatusInterest` independent in effects, dialogue gates, persistence, and tests.
4. Test every choice, disclosure consistency, concealment versus deferral, conditional intent, health stop, DAY 11 callbacks, every-stage save, and DAY 13 handoff.
5. Audit/reuse or produce action CGs for the training-screen stop, paper-circle contribution, vending joke, lunch behavior, exit handoff, and phone disclosure against DAY 2 quality and safe-area standards.

## Decision

No product, scenario, asset, or test implementation was changed in this audit gate. The authority conflict is now resolved; the next action is the source-faithful DAY 12 V3 chapter contract and playable-data rebuild with legacy-save compatibility. DAY 11 stays released.
