# DAY 14 V4 actual browser QA

## Gate

- Date: 2026-08-31 02:06–02:40 KST
- Source under test: current DAY 14 V4 working tree after the 8/8 image gate
- Browser: Codex in-app browser, fresh local server and fresh route state
- Desktop route: flower outing → gift flower → in-person meeting → Haeun-initiated hand contact
- Mobile route: stay home → full rest → no meeting → no hand contact → no night message
- Result: **PASS**

The temporary query bootstrap and local server are QA harnesses only. The bootstrap was removed from `game.js` after the routes passed; neither harness is a release artifact.

### Reproduction identity

- Branch: `feature/today-day-one-mvp`
- Base HEAD before the pending DAY 14 commit: `54998ad2a102d2bc8c262e0a40bc94f1e77c069b`
- Tree state: dirty by design; the browser exercised the uncommitted DAY 14 V4 source, tests, docs and eight-image directory plus the four browser fixes listed below. Unrelated user-owned untracked DAY 1 and DAY 11 images were outside the test manifest.
- Host: Windows NT build 10.0.26200.0
- Browser surface: Codex in-app browser; the runtime does not expose a user-facing browser build number
- Local URL: `http://127.0.0.1:4173/?qa=day14-v4&route=<flower|full-rest>`
- Desktop CSS viewport observed after fullscreen: 1936×1048
- Mobile CSS viewport: explicit 390×844 after leaving fullscreen

The removed bootstrap created a fresh marriage-30 save at DAY 14 with the V4 prerequisite (`day13ScenarioVersion=NOTION_V3`, `day13V3Completed=true`, `day14FlowerDeskPlanPending=true`). The flower preset used 50,000 won, high relationship values, prior hand contact, no unresolved boundary, and available Haeun contact. The full-rest preset used the same story prerequisite with lower relationship values, no prior hand contact, and `day13V3HaeunNeedsSpace=true`. This setup never entered release code.

### PASS checklist

- requested route choices are visible and actionable;
- eligible CGs render once with intrinsic 1672×941 assets, `object-fit: contain`, and `object-position: 50% 42%`;
- ineligible route CGs do not render;
- key faces, hands and props remain legible around HUD/dialogue safe areas;
- no console warning/error, horizontal overflow, or visible broken image occurs;
- DAY 14 completes and the DAY 15 header plus first choices render.

### Exact route choices

Desktop choice IDs, in order: `day14_wait_own_work`, `day14_flower_for_room`, `day14_place_my_room`, `day14_take_gift_flower`, `day14_invite_sit_without_demand`, `day14_listen_allow_upset`, `day14_time_walk_station`, `day14_room_make_flower_visible`, `day14_nari_talk_more`, `day14_night_thanks_for_talking`.

Mobile choice IDs, in order: `day14_wait_ask_need`, `day14_stay_home_clear_space`, `day14_invite_rest_today`, `day14_reflect_my_day`, `day14_time_eat_my_dinner`, `day14_room_stop_and_eat`, `day14_no_nari_cleanup_enough`. The runtime correctly skipped outing-only choices 3–4 and converted the contact-rest ending to the no-message closure without inventing a tenth visible choice.

## Defects found and fixed by the real browser

1. `game.js` imported `beginDay14V4` from `day14-v4-runtime.mjs`, which does not export it. The browser failed while loading the module graph. The function and compatibility selector now come from `day14-v4-state-contract.mjs`; only `applyDay14V4Choice` comes from the runtime module.
2. the DAY 14 controller called `getLockedDay14ResumePresentation` without defining it. A compatibility router now selects the legacy V1 resume presentation only for legacy saves and the V4 resume presentation for new V4 state.
3. SCENE 08 and SCENE 17 CGs were present in the scene segment but unreachable after their own choices because continuation started at the following scene. Choice continuation now carries the eligible post-choice CG before the reaction and next segment. Focused tests lock one handoff CG after choice 4 and one contact CG after choice 7.
4. `cgShow.fit` and `cgShow.objectPosition` existed in presentation data and tests but the UI ignored them. The event image layer now applies both fields with safe defaults.

## Desktop evidence

The fresh flower route reached DAY 15 without console warnings or errors.

| Evidence | Browser result |
|---|---|
| SCENE 04 first meeting | intrinsic 1672×941, `contain`, `50% 42%`; face, card and hands remain visible under the HUD |
| SCENE 07 broken stem and bottle | intrinsic 1672×941, `contain`, `50% 42%`; working hands and single-flower action remain legible |
| SCENE 08 florist handoff to protagonist | intrinsic 1672×941, `contain`, `50% 42%`; the newly fixed post-choice CG renders exactly once; Nari transfers the purchased gift-intended flower to the protagonist |
| SCENE 10 Haeun does not receive it | intrinsic 1672×941, `contain`, `50% 42%`; Haeun's empty hands remain distinct and ownership stays with the protagonist |
| SCENE 15 tilted bottle | intrinsic 1672×941, `contain`, `50% 42%`; Nari/Haeun and the one-bottle correction remain in the safe area |
| SCENE 17 hand contact | intrinsic 1672×941, `contain`, `50% 42%`; the newly fixed post-choice CG renders exactly once while the protagonist's other hand still owns the flower |
| SCENE 18/20/22 flower desk | flower variant renders only for the purchased route; prior and current browser passes keep the cup, bottle and bloom inside the action-safe center |
| Adjacent-day reach | DAY 15 header and first three DAY 15 choices rendered |

Final desktop document width matched the viewport, horizontal overflow was absent, and visible broken images were zero. The broken-image predicate was `!img.hidden && img.offsetParent !== null && (!img.complete || img.naturalWidth === 0)`; empty hidden image placeholders were excluded.

## Mobile evidence

The fresh full-rest route was tested at an explicit 390×844 CSS viewport after leaving fullscreen. The first DAY 14 choice layer measured 366 px wide at x=12 and remained wholly inside the viewport. Text remained readable, all three buttons were reachable, document width stayed 390 px, and horizontal overflow was absent.

SCENE 18 and SCENE 20 rendered `cg-day14-v4-desk-empty-space-pov-v1.png` at 1672×941 with `contain` and `50% 42%`. The 390×844 cropped browser view showed the empty central desk, cup and paper-clearing hands without inventing a flower, message or person. Letterboxing is intentional for an undistorted 16:9 complete-scene CG. The route did not render Nari meeting, gift handoff, Haeun meeting, tilted bottle, or contact CGs. It reached the DAY 15 header and choices with zero console warnings/errors, zero horizontal overflow, and zero visible broken images.

## Route and save conclusions

- Gift ownership and the SCENE 08 handoff survive real controller progression.
- Prior contact plus no unresolved boundary plus Haeun initiation is required for the SCENE 17 contact image; full rest remains non-contact.
- Full rest does not invent meeting, work disclosure, Nari introduction, flower ownership, or a night message.
- Both representative routes complete DAY 14 and reach the adjacent DAY 15 controller.
- Static focused tests retain phone, insufficient-funds, photo-only, no-purchase, missing-state fallback, save/restore and negative contact coverage that is not duplicated as a third visual route here.

## Automated regression evidence

After removing the temporary query bootstrap, the following release-tree commands passed:

- `node --check game.js`
- `node tests/day14-v4-contract.test.mjs`
- `node tests/day14-v4-playable-runtime.test.mjs`
- `node tests/day14-v4-immersive-adapter.test.mjs`
- `node tests/day13-v3-runtime-save.test.mjs`
- `node tests/day13-v3-immersive-adapter.test.mjs`
- `node tests/day14-regression.test.mjs`
- `node tests/day14-presentation.test.mjs`
- `node tests/simulation.test.mjs`

The browser screenshots were inspected at execution time but are not release assets and are not checked into the repository. The measurable layout, intrinsic image, console and route results needed for the gate are recorded above.

## Remaining release work

Actual browser QA and the post-fix regression bundle are closed. DAY 14 V4 still requires the final working-tree review, commit, origin update, identical verified SHA deployment to `gh-pages`, and public verification before DAY 15 work may begin.
