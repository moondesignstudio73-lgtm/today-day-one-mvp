# DAY 9 Notion source lock V3

- Status: `PASS — child-page body read completely; Notion precedence confirmed by user`
- Queried at: `2026-08-28T14:43:15.449Z` (`2026-08-28 23:43:15 KST`)
- Parent: `AI해커톤` — https://app.notion.com/p/3c7c31f029a680e3ac06c5e2373ce199
- Canonical child page: `DAY 9 — 네가 고른 색 | SCENARIO V3`
- Child page: https://app.notion.com/p/3c9c31f029a681ca8a0ff579009b478e
- Notion page id: `3c9c31f0-29a6-81ca-8a0f-f579009b478e`
- Notion last-edited timestamp returned by search: `2026-08-27T18:32:00.000Z`
- Locked body range: `ACT 1~5, SCENE 01~24, 주요 선택 1~11, INTERNAL IMPLEMENTATION NOTES, 직전 3개 시나리오 대조 분석`
- Declared scale: body about 18,000 Korean characters, target 25~35 minutes, runtime measurement pending.

## Source handling

The child-page body above is the primary manuscript. The parent-page Markdown attachment and the child page's `Markdown 원본` file block were deliberately ignored for lookup, comparison, missing-content, conflict, and access-wait gates, per the user's latest rule. The complete child body was accessible, so attachment access is not a pause condition.

## Locked narrative and state contract

- Core event: a Myeongdong style-mall shopping date where the protagonist distinguishes what he wants to see from what Ha-eun wants to wear.
- Locations: `myeongdong-station`, `fashion-mall`, and `department-food` only on the relaxed route.
- Material beats: pink shirt discomfort, green shirt comfort and pockets, scarf preference mismatch, optional exchange, player clothing/stockings, photos, and a not-yet-finalized DAY 10 dinner proposal.
- Persistence: green shirt ownership must distinguish unpurchased / Ha-eun self-purchase / accepted gift; scarf must distinguish unpurchased / exchanged / protagonist-owned; player try-on and purchase are separate; Ha-eun's scarf aversion is not a global color preference; DAY 10 dinner is confirmed / contact-before-noon / deferred with menu still undecided.
- Consent and relationship: no forced wearing, no automatic affection repair through spending, no new hand-hold/hug/kiss, and sleeve contact only when prior relationship state permits it.
- Economy: intention, purchase, acceptance, exchange, ownership, and equipping are separate; insufficient funds cannot create a purchase.

## Precedence resolution

`RESOLVED — the user confirmed on 2026-08-29 KST that all scenario-related decisions follow Notion first.`

1. This fresh Notion child body is a 24-scene shopping/choice-respect chapter.
2. The user's locked DAY event table says DAY 9 must be the ex-girlfriend reunion ending with “결혼한다고? …너 진짜 아무것도 기억 안 나는구나.”
3. The current runtime `src/day9-campaign-runtime.mjs` is a second office-adaptation chapter centered on Seojin, Minho, responsibility boundaries, and a 90-minute work return.

The fresh Notion child body supersedes the older event table and current runtime wherever scenario content conflicts. The office adaptation must not be preserved as DAY 9 merely because it is already implemented, and the ex-girlfriend reunion must not be inserted unless a later Notion child body includes it. DAY 9 may proceed to implementation-gap and content-coverage audit against this locked V3 body. DAY 10 remains prohibited until DAY 9 passes every gate.
