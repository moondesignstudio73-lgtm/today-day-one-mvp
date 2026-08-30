# DAY 14 V4 controller, save re-entry, and presentation QA

## Source authority

- Source: `AI해커톤 > DAY 14 — 받지 않은 꽃 | SCENARIO V4`
- Notion page ID: `3c9c31f0-29a6-8102-af32-fd7f3e26e90f`
- Fresh read: 2026-08-30 23:37 KST
- Coverage: complete child-page body, ACT 1–3, SCENE 01–22, choices 1–10, and all outing, purchase, meeting, call, full-rest, contact, and no-contact alternatives
- Parent-page Markdown attachments: ignored

## Implemented contract

- New V4 starts only after DAY 13 V3 completion and the flower-desk hook. Existing DAY 14 V1 saves remain on the legacy controller; incomplete prerequisites cannot fall through into legacy gameplay.
- Each applied choice is saved before the continuation is returned. The checkpoint always names the first scene that still needs to be shown, including SCENE 20 for automatic no-message and SCENE 21 for an explicit night-message choice.
- JSON round-trip restore preserves the route background, selected choices, meeting knowledge, hand-contact eligibility, night-message outcome, and conditional DAY 15 gallery hook.
- Completed-choice saves deliberately resume at SCENE 20 or 21 so the ending and `sceneEnd` are still consumed after interruption. `pendingStoryId` remains the controller barrier until the ending finishes.
- The immersive adapter omits unavailable scenes without creating their dialogue or characters. Full-rest does not create Haeun work detail, physical presence, hand contact, Nari/Haeun introduction, or an outgoing night message.

## Presentation status

- Reused verified map and home backgrounds: protagonist bedroom, Flora Cafe, and Yeonhui Station.
- Desktop and mobile safe-area metadata is present on every scene; audio cues use existing IDs only.
- Scene-specific CGs and character composites are intentionally not marked complete. Every V4 presentation entry carries `pending-day14-v4-scene-specific-cg-audit`; the next gate must audit and produce required images with built-in ImageGen plus deterministic local processing only.
- No OpenAI API SDK, Responses/Images API, external image API, or `OPENAI_API_KEY` path was added.

## Verification

- `node --check`: `game.js`, V4 runtime, presentation data, and immersive adapter PASS
- Focused: `day14-v4-contract`, `day14-v4-playable-runtime`, and `day14-v4-immersive-adapter` PASS
- Save/re-entry: in-person route and full-rest automatic no-message route PASS after JSON round trip
- Adjacent regression: DAY 13 V3 runtime save and immersive adapter PASS
- Full regression: `tests/simulation.test.mjs` PASS
- `git diff --check`: PASS

## SIP findings

- Cold read found a blocked-prerequisite fallback risk. The controller now stops before selecting a legacy segment when neither V4 prerequisites nor a V1 save are present.
- The cold read also challenged completion-before-ending persistence. The save contract was retained because completed-choice restores restart at SCENE 20/21, still emit SCENE 22 and `sceneEnd`, and the pending story prevents adjacent-day consumption; a restore assertion locks this behavior.
- Omitted SCENE 22, stale option, unknown option, and branch-order concerns are already prevented by the source scene registry, runtime availability check, explicit unknown-option error, and focused tests.
- External `factchk` does not apply to deliberate fictional canon. The read-only SSOT audit found that checkpoints remain canonical in `day14-v4-runtime.mjs` and presentation paths remain canonical in `day14-v4-presentation-data.mjs`. The temporary affordability threshold is sourced from the existing `career-bouquet` action but is not yet a DAY 14 transaction; transaction settlement and price authority remain a required next-gate audit rather than a completed claim.

## Gate result

Controller, save re-entry, reusable-background presentation, focused regression, and full simulation: **PASS**.

DAY 14 V4 is not release-complete. Next gate: asset/image audit and scene-specific ImageGen production, followed by original-resolution and browser visual QA. DAY 15 remains out of scope.
