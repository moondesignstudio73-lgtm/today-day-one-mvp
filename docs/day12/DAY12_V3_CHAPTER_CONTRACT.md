# DAY 12 V3 chapter contract — 점심시간의 다른 얼굴

Status: `NOTION V3 STRUCTURE IMPLEMENTED / PLAYABLE SCRIPT NEXT`

Source: [Notion DAY 12](https://app.notion.com/p/3c9c31f029a68113b6e3da2549b6ef91), freshly fetched 2026-08-29 21:35 KST. Parent Markdown attachments were ignored.

## Contract

- ID: `m30-day12-lunchtime-other-face-v3`
- Window: morning preparation → 10:00 office visit → lunch → before 13:00 exit → afternoon/night debrief
- Participants: protagonist, Haeun, Yoon Seojin, Minho, team lead
- Type: workplace adaptation + present identity + relationship boundary
- Purpose: the protagonist stops performing past competence, contributes through a truthful observation, shares credit, and separates work usefulness from personal attraction and disclosure responsibility.
- Emotional curve: anxiety → premature answer → precise misunderstanding → shared correction → small ownership → lived-in lunch → personal curiosity → disclosure pressure → warmth or distance → DAY 13 plan.
- Playtime: source estimate 25–35 minutes; runtime/browser measurement required.
- Hook: `SEOUL_FOREST_PHOTO`, `NEIGHBORHOOD_WALK`, or `DECIDE_AFTER_REST`; none pre-creates a DAY 13 encounter.

## Information and relationship limits

- MUST: preserve the misleading completion UI, Minho's version mix-up, the protagonist's stop-point contribution, Seojin's honest work expectation, personal conversation gate, Haeun disclosure consistency, and the three DAY 13 plans.
- MAY: Seojin's green-onion preference, Minho's plant/vending jokes, Haeun's delayed task, a conditional outside-work invitation.
- MUST NOT: prove the accident cause, fake-Haeun truth, a past Seojin romance, mutual attraction, restored rank/pay/authority, or a DAY 13 encounter.
- `seojinAffection` changes only on personal-interest actions. `seojinStatusInterest` changes only on demonstrated work judgment. No choice changes both axes.
- Haeun's response distinguishes disclosure, honest uncertainty, direct contradiction, and concealed mismatch. Honesty never buys instant comfort.

## Implementation shape

- `src/day12-v3-campaign-data.mjs`: 24 ordered scenes, 14 three-way choices including the conditional intent follow-up, voice profiles, knowledge ledgers, route contract, and 35 save keys.
- Legacy V1 account-review flags remain untouched. A later runtime gate must select V3 for new saves while preserving old V1 resume behavior.
- Next bundle: full playable script split around SCENE 12/13, followed by runtime/save state application and focused tests.
