# DAY 13 V3 chapter contract — 모르는 사람에게는

Status: `NOTION V3 STRUCTURE IMPLEMENTED / PLAYABLE SCRIPT NEXT`

Source: [Notion DAY 13](https://app.notion.com/p/3c9c31f029a68111b062c847639ec289?pvs=204), freshly and fully fetched `2026-08-29 23:46 KST`. Parent Markdown attachments were ignored.

## Contract

- ID: `m30-day13-to-someone-who-does-not-know-v3`
- Window: morning camera test → chosen outing → afternoon photo walk/solo time → Haeun debrief → night
- Participants: protagonist, Haeun, and Ara only on the actual Seoul Forest route
- Type: present identity + photo walk + relationship honesty
- Purpose: experience the relief of not having to explain the past while deciding whether that relief also permits erasing a current relationship.
- Emotional curve: residual fatigue → imperfect-photo comedy → ease with a stranger → consent and present-face awkwardness → realistic mismatch in contact style → relationship-description pressure → Haeun warmth or space → present self held beside present commitments.
- Playtime: source estimate 25–35 minutes. No-Ara and early-exit routes require separate reading/browser measurement.
- Hook: Haeun wants to look at flowers for her own desk. This is not a gift request and does not pre-author DAY 14.

## Voice and knowledge limits

- The protagonist uses observation → possibilities → verification → judgment → action. He distinguishes withholding a full history, a truthful partial description, minimization, and an explicit mismatch.
- Haeun stays lived-in, warm, and self-directed. She does not magically infer undisclosed contact details, and honest disclosure does not force instant comfort.
- Ara is concise, light, independent, and consent-aware. She never covertly photographs a declined portrait, forces a meal or future promise, or functions as a superior alternative to Haeun.
- Ara knows only what she directly sees or is told. Haeun knows only what the protagonist sends or says. DAY 12 Seojin affection, status interest, invitation, and Haeun disclosure state remain intact and independent.

## Route and consent invariants

- Ara exists only after `SEOUL_FOREST`; neighborhood and home routes never create her name, portrait, contact, or testimony.
- `EARLY_EXIT` blocks Ara reunion, portrait session, cafe continuation, and contact exchange. Solo replacements preserve the day's photo theme without pretending Ara stayed.
- Portrait consent controls whether a portrait exists. Decline remains a decline through the ending.
- Photo transfer consent, ongoing photo exchange, and public posting permission are three separate decisions. DAY 13 grants no public-post permission.
- The relationship-description choice appears only while Ara is physically present after seeing the protagonist smile at Haeun's message; she does not read the message.
- The Ara-report option appears only if Ara was actually met. Haeun's response uses the actual report and does not infer hidden facts.
- Personal curiosity is stored without automatically becoming romance or cheating. `passing meeting` becomes a mismatch only when the preceding behavior makes it one.

## Implementation shape

- `src/day13-v3-campaign-data.mjs`: 24 ordered scenes, 12 three-strategy choice definitions, conditional/variant route contracts, three voice profiles, three knowledge ledgers, and 40 V3 save keys.
- `tests/day13-v3-campaign-data.test.mjs`: structure, route conditions, portrait boundary, transfer/public permission separation, mystery budget, state preservation, and save-key coverage.
- Existing V1 `day13RuntimeStage`, budget strategies, and completion/pending flags are untouched. A later runtime gate must classify them as legacy and route new DAY 13 sessions to V3.
- Next bundle: full playable script for SCENE 01–12, including complete Seoul Forest, neighborhood, home, and early-exit variants.
