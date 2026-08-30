# DAY 14 V4 asset and image audit

Status: `AUDIT PASS / IMAGE PRODUCTION 8/8 READY / STATIC IMAGE QA PASS / BROWSER QA PASS / POST-FIX REGRESSION PASS`

## Source authority

- Source: `AI해커톤 > DAY 14 — 받지 않은 꽃 | SCENARIO V4`
- URL: `https://app.notion.com/p/3c9c31f029a68102af32fd7f3e26e90f`
- Fresh complete read: 2026-08-31 02:02–02:05 KST (23,093-character child body re-fetched before the SCENE 18/20/22 closing desk package)
- Coverage: child body SCENE 01–22, choices 1–10, all outing, purchase, meeting, call, full-rest, contact, no-contact, and implementation-note branches
- Parent-page Markdown attachments: ignored

The latest Notion body is the authority for action, character presence, flower ownership, contact eligibility, and whether a phone photo exists. No image may show Nari, Haeun, a purchased flower, a received gift, or hand contact on a route where the corresponding event did not occur.

## Existing pipeline and immutable quality baseline

- Git history and DAY 1–13 production evidence confirm that new raster art is created with Codex built-in ImageGen. Deterministic local scripts may normalize dimensions or extract alpha, but they do not call an image API.
- No OpenAI SDK, Responses/Images API, external image API, or `OPENAI_API_KEY` path is introduced.
- DAY 2 remains the visual baseline: integrated scene action, coherent light and perspective, sharp wide framing, visible hands and story props, center-60 mobile safety, and clear upper-HUD/lower-dialogue safety.
- Existing user and project assets are not overwritten, moved, or deleted. Generated originals remain preserved in the Codex generation folder; accepted project assets use new versioned paths.
- A production package is one tracked story beat, not necessarily one raster. It is complete only when every required branch variant has a versioned project path, built-in ImageGen provenance, original-resolution inspection, presentation-data condition, focused test, and later desktop/mobile browser evidence. The eight-package count therefore includes two desk variants under one closing package.
- Every image batch must refetch and fully read the current Notion child body before generation. This audit is a reproducible map, not permission to rely on a stale cached script.
- Built-in originals are preserved under `C:/Users/user/.codex/generated_images/01a03321-c35b-7731-9f0b-f6a22351bee4/`; accepted copies are added under `assets/events/day14-v4/` without replacing the originals.

## Reuse audit

| Asset | Use | Original inspection | Decision |
|---|---|---|---|
| `assets/backgrounds/map-locations/020_flower-cafe.png` | SCENE 04–16 Flora routes | 1672×941 RGB; sharp daylight florist interior, clean central floor and UI margins | `ready-reuse` background only |
| `assets/backgrounds/map-locations/018_yeonhui-station.png` | SCENE 17 eligible walk | 1672×941 RGB; clear concourse and central walking space | `ready-reuse` background only |
| `assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png` | SCENE 01–03 and 18–22 home routes | 1672×941; DAY 2-approved room and safe-area behavior | `ready-reuse` |
| `assets/events/day13-v3/cg-day13-v3-haeun-desk-photo-phone-pov-v1.png` | SCENE 01 yesterday's desk photo | 1671×941 RGB; both hands, phone, unreadable note, empty cup and desk vacancy visible; no flower or hidden clue | `ready-reuse` action CG |
| `assets/heroines/nari/outfits/01.webp` and `outfit-sheet.png` | Nari identity reference | 307×512 RGBA individual and 1536×1024 RGB sheet; brown wavy hair and florist identity are useful, but the individual is too small for full-screen runtime | `reference-only` |
| `career-flower-delivery-01.png`, `career-bouquet-01.png` | possible flower-shop reuse | 1200×675 and visually polished, but they depict Haeun wrapping/receiving a large bouquet and contradict Nari identity, small-flower ownership, and non-receipt | rejected for DAY 14 V4 |

## Accepted new production

### SCENE 04 — Nari first meeting wide

- Project asset: `assets/events/day14-v4/cg-day14-v4-nari-first-meeting-wide-v1.png`
- Built-in ImageGen original: `exec-712102c1-255e-40ff-bd21-73e27e5e0c63.png`
- Format: 1672×941 RGB
- SHA-256: `6DF61DD9EEE6F1B632B6C3D4D4646132870BF6A44EC92010EC64738FDAB5C542`
- Original-resolution visual QA: Nari's locked brown wavy hair, brown eyes, white rolled-sleeve shirt, dusty-pink apron and mature florist proportions are consistent with the reference. One protagonist hand returns a blank paper while Nari accepts it and presses a blank card with her other hand. Both key hands, paper, card and clips are visible; there is no Haeun, bouquet handoff, readable text, watermark, opaque cutout rectangle, or sticker-like composite.
- DAY 2 comparison: the action is materially shown inside one coherent perspective and light field; hands and props carry the beat; the 16:9 frame is sharp and the face/action remain in the static center-60 horizontal target. Original-resolution inspection is `PASS`; lower dialogue-box clearance remains a real-browser gate and is not claimed from the raw image alone.
- A single-change UI-clearance correction `exec-5f8d4fb7-0c2c-4a53-964f-18c9b9366a83.png` moved the papers and clips farther down instead of creating the requested lower negative space. It was rejected and was not copied into the project. The accepted V1 remains subject to later desktop/mobile browser crop and dialogue-overlay QA.

### SCENE 07 — Nari broken-stem and bottle interaction

- Project asset: `assets/events/day14-v4/cg-day14-v4-nari-broken-stem-bottle-v1.png`
- Built-in ImageGen accepted original: `exec-4a5da2f8-e21d-4b26-884f-690bdb0335f3.png`
- Format: 1672×941 RGB
- SHA-256: `756740FDC96BD7FF2E1E9CF1FE60C0DB424EF8C40642BE2DE9ADECFF2784449E`
- Original-resolution visual QA: Nari retains the locked chestnut-brown hair, brown eyes, white rolled sleeves, dusty-pink apron and mature proportions. The CG captures the first half of the beat: she trims the sole pink-lilac flower while the empty water bottle waits directly below, and the protagonist holds the blank cream card with its attached dark clip ready for placement. The following script steps complete the bottle insertion and card placement rather than claiming one frozen frame shows the entire sequence. Scissors, both working hands, one flower, bottle, card and clip are sharp and physically legible. There is no Haeun, bouquet, gift transfer, readable price, logo, watermark, duplicated hand, floating sticker, or second flower.
- DAY 2 comparison: the decisive object action is shown in one coherent POV, lighting field and perspective rather than described over a standing sprite. Nari's face and every story object remain within the static center-60 target, with the action above the lower dialogue exclusion target. Original-resolution inspection is `PASS`; actual desktop/mobile cover crop and dialogue overlap remain deferred to the real-browser gate.
- The first built-in output `exec-cf7ec038-4a0f-475b-a053-483e9b009f7c.png` showed an unintended second flower already in the bottle. A precise edit removed the flower head but left a green stem remnant; the accepted second correction removed only that remnant. Both rejected intermediates remain outside the project and the accepted original remains preserved in the Codex generation folder.

### SCENE 08 — purchase-only flower and ribbon handoff POV

- Project asset: `assets/events/day14-v4/cg-day14-v4-flower-ribbon-handoff-pov-v1.png`
- Built-in ImageGen accepted original: `exec-9c7e8a17-9a69-4bcd-b146-88653b38d135.png`
- Format: 1672×941 RGB
- SHA-256: `E0C23AE0DC3C2186C86EB2DF39C635A6C2FF2D6CE4D83EFE0B781E9EB4A1937B`
- Original-resolution visual QA: Nari retains the locked chestnut-brown hair, brown eyes, white rolled sleeves, dusty-pink apron and mature proportions. Her two hands support and release the small cream wrapping while the protagonist's single POV hand receives its lower half; one dusty-pink ribbon end reaches the receiving hand. Exactly one pink-lilac bloom and one stem are present. Haeun, a large bouquet, readable price/card, gift-success reaction, romance pose, logo, watermark, malformed or duplicated hands, and sticker-like compositing are absent.
- DAY 2 comparison: the story action and prop ownership are visible in one coherent perspective and afternoon light field. Nari's face, all key hands, the flower and ribbon remain in the central mobile target and above the lower dialogue exclusion target. Original-resolution inspection is `PASS`; desktop/mobile browser crop remains deferred to the shared real-browser gate.
- Generation provenance: the first built-in prompt requested the exact `GIFT_FLOWER` transfer, one modest pink-lilac flower, cream wrap, dusty-pink ribbon brushing the protagonist's hand, Haeun absent, center-60 action, and no readable text/price/card, bouquet, second flower, gift-success or romance pose. Original `exec-e3c6d76a-a8bf-4f94-b10d-b2b4f5578f93.png` contained an unintended small secondary bloom. The precise edit prompt preserved composition, identity, outfit, lighting and handoff while retaining only the larger central bloom on one stem and keeping the loose ribbon against the receiving hand. The rejected first output remains outside the project; both originals remain preserved in the Codex generation folder.

### SCENE 10 — Haeun sees but does not receive the flower

- Project asset: `assets/events/day14-v4/cg-day14-v4-haeun-flower-not-received-wide-v1.png`
- Built-in ImageGen accepted original: `exec-3c90fc9b-0260-404c-8949-0cef3bcd33ef.png`
- Format: 1672×941 RGB
- SHA-256: `70EA28EEC5B8468337F7E831F709147D0314E44210785FC64022A732CCEB96E0`
- Original-resolution visual QA: Haeun preserves the locked purple bob, violet eyes, oatmeal cardigan, muted-lavender blouse, charcoal skirt, cream flats, pendant and adult proportions. She stands just inside the Flora entrance with tired shoulders and a restrained greeting; both hands remain empty and relaxed. The protagonist alone holds the same one-bloom, one-stem cream-wrapped flower with dusty-pink ribbon, raised enough for dialogue safety but still angled toward the protagonist's own side with a wide physical gap. Haeun neither reaches, touches, accepts, thanks for, nor holds the flower. Nari, a second flower, bouquet, hand contact, romantic reward pose, readable text, logo, watermark, malformed hands and sticker-like compositing are absent.
- DAY 2 comparison: the refusal/permission boundary is expressed as visible body action and object ownership rather than dialogue over a standing sprite. Haeun's face and empty hands plus the retained flower remain inside the center mobile target; the decisive hand and prop are above the dialogue exclusion line. Original-resolution inspection is `PASS`; actual browser overlays remain a later gate.
- Generation provenance: the first built-in prompt locked Haeun's identity/outfit, the Flora doorway, one lowered protagonist-owned flower, empty Haeun hands, physical separation, center-60 framing, and explicit non-receipt. Original `exec-c931fc2d-d049-4a37-82b1-274039da454c.png` placed the hand and wrapping too low for the dialogue zone. The single-change edit moved only the entire hand/flower group upward while preserving the non-offering angle, identity, pose, camera, lighting and separation. The first output remains outside the project and both originals remain preserved.

### SCENE 15 — Nari and Haeun with the tilted bottle

- Project asset: `assets/events/day14-v4/cg-day14-v4-nari-haeun-tilted-bottle-wide-v1.png`
- Built-in ImageGen accepted original: `exec-88c2d5f5-8a1c-441c-a5ed-2f036a2a6703.png`
- Format: 1672×941 RGB
- SHA-256: `6449A9F616CFB062EF36573158DFB98E0C5D690493CA0516D1D4EB70ABFEF54B`
- Original-resolution visual QA: Nari and Haeun retain their locked adult identities and the exact white-shirt/dusty-pink-apron and oatmeal-cardigan/muted-lavender/charcoal outfits. Nari's connected hands place the same small clear bottle back toward the sunlit window while its sole shortened pink-lilac flower remains visibly tilted; she does not force the stem straight. Haeun's hands remain empty and her eased shoulders and spontaneous laugh respond to the ordinary orientation mistake. No protagonist, wrapped gift, received flower, bouquet, second flower/bottle, hand contact, romantic-triangle reward pose, readable text, logo, watermark, malformed hands, or sticker compositing is present.
- DAY 2 comparison: the character introduction, object correction and emotional release are one visible action in a coherent perspective and light field. Both faces, Nari's working hands, Haeun's empty hands, bottle and tilted bloom remain in the central mobile target. The accepted second safe-area correction leaves the bottom quarter as quiet tabletop; original-resolution inspection is `PASS`, while actual desktop/mobile overlays remain a later browser gate.
- Generation provenance: the initial built-in generation used the accepted SCENE 07 and SCENE 10 images as Nari/bottle and Haeun/outfit references and correctly preserved the branch truth, but its bottle sat too close to the lower dialogue zone. The first safe-area edit increased table space but still left the bottle on the lower boundary. The accepted second single-purpose edit raised the connected tabletop/hand/bottle action and left a clean lower quarter without changing character identity, expression, prop count, flower tilt, lighting or camera direction. The two rejected results remain preserved only in the Codex generation folder; the transient first project copy was removed before integration.

### SCENE 17 — Haeun-initiated hand contact at Yeonhui Station

- Project asset: `assets/events/day14-v4/cg-day14-v4-yeonhui-hand-contact-wide-v1.png`
- Built-in ImageGen accepted original: `exec-6a09010a-a2c2-448b-9d68-496e94a4059f.png`
- Format: 1672×941 RGB
- SHA-256: `98819FCB30B75E5200D4432950CB13E8AF66E3BB539388C8602345495A7E05DD`
- Original-resolution visual QA: Haeun preserves the locked purple bob, violet eyes, oatmeal cardigan, muted-lavender blouse, charcoal skirt, cream flats, pendant and adult proportions. She offers and clasps the protagonist's empty hand while the protagonist's separate hand keeps ownership of the same one-bloom cream-wrapped flower. Haeun neither holds nor receives the flower. The clasp and flower sit above the lower dialogue zone; lateral sleeves may be covered by the future overlay without hiding the decisive action. Nari, extra figures, duplicate or fused hands, second flower, bouquet, readable text, logo, watermark and sticker-like compositing are absent.
- DAY 2 comparison: the consented contact, prop ownership and small step mismatch are materially visible in one coherent station perspective and light field rather than inferred from dialogue over standing sprites. Haeun's face, the clasp and the retained flower remain inside the center mobile target. Composition, aspect ratio, sharpness, character consistency and action legibility pass original-resolution comparison; exact desktop/mobile overlay and cover behavior remain honestly deferred to the shared browser gate.
- Generation provenance: the initial built-in output established correct identity, hand contact and flower ownership but placed the action too low. Three successive single-purpose safe-area edits attempted to raise the connected hand/flower group without changing identity, camera, lighting or ownership. The first two retained overlong lower-reaching sleeves; the accepted third correction moves the clasp and flower to mid-frame and brings sleeves in laterally. All four generated outputs remain preserved in the Codex generation folder; only the final accepted result was copied into the project.

### SCENE 18/20/22 — ownership-aware closing desk variants

- Flower project asset: `assets/events/day14-v4/cg-day14-v4-desk-flower-bottle-pov-v1.png`
- Flower built-in ImageGen original: `exec-ffa52c35-2d71-4d25-b637-1fafdd20a5cd.png`
- Flower format and SHA-256: 1672×941 RGB; `617C36B24D0E3F89879C99A52856BE6792668F652A910C6BD628C5F9E17F19C8`
- Empty-space project asset: `assets/events/day14-v4/cg-day14-v4-desk-empty-space-pov-v1.png`
- Empty-space built-in ImageGen original: `exec-20a6f5d6-a788-433c-9b5a-b2c19dac10c1.png`
- Empty-space format and SHA-256: 1672×941 RGB; `3B689A0A4574DBDB16E03DE8B077E748A5A04CFD9989FA90995FBB451D52B3CC`
- Original-resolution visual QA: both variants preserve the established protagonist bedroom, desk geometry, evening camera and lighting. The flower branch shows two natural POV hands moving an ordinary drinking cup safely inward and steadying one small clear bottle with exactly one shortened pink-lilac flower; the blank cream care card/clip contains no readable text. The non-purchase branch removes the flower, bottle and card completely, keeps the cup-moving action, uses the other hand to slide blank papers aside, and leaves the broad central desk area honestly empty. No Haeun, Nari, other person, handoff, phone message, receipt, price, logo, watermark, extra hand, fused fingers, bouquet or sticker composite appears in either variant.
- DAY 2 comparison: both images show the decisive room-and-object action in one coherent POV with sharp 16:9 perspective, consistent light and physically grounded hands/props. The paired camera makes the presence or absence of the flower legible as a state consequence rather than a quality downgrade. Key hands, cup, bottle/flower or empty space stay inside the central mobile target; lower sleeves enter the future dialogue band, but no story-critical object depends on that band. Static original-resolution QA passes; exact desktop/mobile overlays remain the next browser gate.
- Generation provenance: the flower image was generated from the immutable DAY 2 bedroom reference plus the accepted DAY 14 Nari bottle/flower continuity reference. The empty branch is a single precise edit of that accepted composition, changing only flower/bottle/card removal and the right-hand paper-clearing action while preserving camera, room and light. Both accepted originals remain preserved in the Codex generation folder and were copied non-destructively to new project paths.

## Production queue

| Key | Scene | Required visual truth | Status |
|---|---:|---|---|
| `haeunDeskPhonePov` | 01 | received desk photo, empty cup and open space; no flower yet | ready-reuse |
| `nariFirstMeetingWide` | 04 | wind-flipped card and returned blank paper | ready-new |
| `nariBrokenStemBottleInteraction` | 07 | Nari cuts the bent stem, uses the small bottle, protagonist clips the card; no gift claim | ready-new |
| `flowerRibbonHandoffPov` | 08 | actual purchase route only; small flower and ribbon move into protagonist's hand | ready-new |
| `haeunFlowerNotReceivedWide` | 10 | actual meeting route only; Haeun sees but does not receive the flower | ready-new |
| `nariHaeunTiltedBottleWide` | 15 | only when Nari was met and Haeun came to Flora; tilted bottle remains imperfect | ready-new |
| `yeonhuiHandContactWide` | 17 | only when prior contact, no unresolved boundary, and Haeun initiates; non-contact route must not render it | ready-new |
| `deskFlowerOrEmptyPov` | 18/20/22 | ownership-aware flower/bottle or honest empty desk; no invented purchase or message | ready-new |

### Branch and integration contract

| Package | Runtime predicate | Planned project output |
|---|---|---|
| `haeunDeskPhonePov` | `day14V4Day13DeskPhotoReceived === true`; otherwise no CG | existing DAY 13 path |
| `nariFirstMeetingWide` | `day14V4OutingRoute === "FLORA"`; HOME uses no Nari CG | `cg-day14-v4-nari-first-meeting-wide-v1.png` |
| `nariBrokenStemBottleInteraction` | `day14V4OutingRoute === "FLORA"` | `cg-day14-v4-nari-broken-stem-bottle-v1.png` |
| `flowerRibbonHandoffPov` | `day14V4OutingRoute === "FLORA"` and `day14V4PurchaseOutcome === "GIFT_FLOWER"`; HOME/self-flower/photo/no-purchase variants do not show a gift handoff | `cg-day14-v4-flower-ribbon-handoff-pov-v1.png` |
| `haeunFlowerNotReceivedWide` | `day14V4OutingRoute === "FLORA"`, `day14V4InteractionRoute === "IN_PERSON"`, and `day14V4PurchaseOutcome === "GIFT_FLOWER"`; the flower remains with the protagonist | `cg-day14-v4-haeun-flower-not-received-wide-v1.png` |
| `nariHaeunTiltedBottleWide` | `day14V4OutingRoute === "FLORA"`, `day14V4NariMet === true`, and `day14V4InteractionRoute === "IN_PERSON"` | `cg-day14-v4-nari-haeun-tilted-bottle-wide-v1.png` |
| `yeonhuiHandContactWide` | `day14V4InteractionRoute === "IN_PERSON"`, `day14V4RemainingTime` is `WALK_TO_STATION` or `MORE_TOGETHER`, `day14V4PriorHandContact === true`, `day14V4UnresolvedContactBoundary !== true`, `day14V4HaeunInitiatedHand === true`, and `day14V4HandContactEstablished === true`; purchase outcome is intentionally irrelevant and the non-contact branch uses the station background only | `cg-day14-v4-yeonhui-hand-contact-wide-v1.png` |
| `deskFlowerOrEmptyPov` | read `storyFlags.day14V4PurchaseOutcome`: flower variant for `SELF_FLOWER` or `GIFT_FLOWER`; empty-space variant for `PHOTO_ONLY`, `NO_PURCHASE`, or `INSUFFICIENT_FUNDS`; missing/unknown leaves the verified bedroom `ambientHold` unchanged | `cg-day14-v4-desk-flower-bottle-pov-v1.png` and `cg-day14-v4-desk-empty-space-pov-v1.png` |

The CG is a complete 16:9 scene, not a transparent sticker layered over the reusable background. Runtime selects the CG conditionally and otherwise retains the verified background. `center-60` means the key face, hands, and story object remain inside the middle 60% of frame width; it is metadata and must still be proven in real `390×844` browser cover/crop. The top HUD and bottom dialogue exclusion zones are likewise verified in the actual browser rather than claimed from static inspection alone.

`DAY14_V4_PRESENTATION_SCENES` is the static asset inventory, so SCENE 07, 08, 10, 15 and 17 keep their canonical CG URLs there and the presentation audit validates all five registrations. A public scene number is stored at zero-based audit index `scenes[sceneNumber - 1]`. The separate `src/day14-v4-immersive-adapter.mjs` route resolver exposes SCENE 07 only for exact `FLORA`, SCENE 08 only for exact `FLORA + GIFT_FLOWER`, SCENE 10 only for exact `FLORA + IN_PERSON + GIFT_FLOWER`, SCENE 15 only for exact `FLORA + NARI_MET + IN_PERSON`, and SCENE 17 only for the full contact predicate recorded above. HOME remains CG-free even if malformed saves inject downstream flags; missing, phone, full-rest and non-contact routes do not receive meeting-only CGs. Focused tests lock both layers, require exactly one `cgShow` immediately after `SFX_FOOTSTEP_APPROACH` is dispatched for SCENE 17, prove `ambientHold` replacement, verify the 2400 ms/contain/`50% 42%` contract, and hash each loaded project file against its accepted SHA-256. SCENE 17 additionally locks the PNG signature, 1672×941 dimensions and RGB color type; negative fixtures cover PHONE, missing prior contact, unresolved boundary, missing Haeun initiation and `HERE_GOODBYE`, while a `PHOTO_ONLY` fixture proves that contact is not a purchase reward. Here `ready-new` means asset production and conditional code integration are ready; browser, commit, and deployment readiness remain separate later gates.

SCENE 18, 20 and 22 use a dynamic closing selector rather than a static scene URL. It reads `storyFlags.day14V4PurchaseOutcome` at scene render/resume time, replaces the single `ambientHold` only when the outcome maps to one of the two accepted variants, and otherwise preserves the original bedroom hold and scene SFX. Focused fixtures exercise every declared outcome (`SELF_FLOWER`, `GIFT_FLOWER`, `PHOTO_ONLY`, `NO_PURCHASE`, `INSUFFICIENT_FUNDS`) plus missing-state fallback, both hashes, PNG signatures, dimensions and RGB color type. `ready-new` means the tracked bitmaps, exact selector integration and focused tests are ready; real browser, commit and deployment remain separate gates.

Nari identity references are `assets/heroines/nari/outfit-sheet.png` plus the florist-apron pose. Haeun identity reference is `assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png`: preserve the established purple bob, violet eyes, mature proportions, and neutral cream-cardigan continuity because Notion specifies no replacement DAY 14 outfit. The flower stays a modest single pink/lilac stem, with a plain small clear bottle, dusty-pink ribbon, blank cream card, and small dark metal clip across all packages; no large bouquet or readable price is introduced.

Dialogue-only and low-action scenes retain verified backgrounds. The closing package is complete: its ownership-aware flower/bottle and honest empty-desk variants carry the final object action and branch truth that repeated standing sprites would obscure.

## Gate result

Asset discovery, reuse/reject decisions, source-to-image mapping, all eight image packages, original-resolution inspection, branch-safe runtime selection, and DAY 2 comparison: **PASS**.

Image production is **8/8 READY**, static image QA is **PASS**, and actual desktop/mobile browser QA is **PASS**. The fresh desktop flower/meeting/contact route and 390×844 mobile full-rest/non-contact route verified branch-safe CG selection, undistorted `contain` rendering, `50% 42%` positioning, HUD/dialogue safety, choice fit, zero horizontal overflow, zero visible broken images, clean console output, and adjacent DAY 15 reach. Phone, insufficient-funds, photo-only, no-purchase and malformed/missing-state variants remain locked by focused runtime tests. Evidence is recorded in `docs/day14/DAY14_V4_BROWSER_QA.md`.

DAY 14 V4 is browser-ready and the post-fix regression bundle passes, but it is not yet commit-ready or deploy-ready. The next gate is the final working-tree review, followed by commit, origin update, identical verified SHA `gh-pages` deployment and public verification. DAY 15 remains untouched.
