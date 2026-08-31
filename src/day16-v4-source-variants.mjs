const f=Object.freeze;
const scene10CurrentProtagonistLine="네가 내 이름 부른 게 낯설었어요";
const scene10CurrentYuriLine="나는 익숙해서 불렀어";

export const DAY16_V4_EXACT_SOURCE_VARIANTS=f({
  scene10CurrentConversation:f({
    source:"notion-child-internal-implementation-notes",
    notionPageId:"3c9c31f0-29a6-81a9-a067-d92edc10b353",
    notionSnapshot:"2026-08-27T19:49:09.165Z",
    condition:"day16V4ConversationDepth=CURRENT_ONLY",
    replaces:"scene-10-past-conversation-preamble",
    sourceExcerpt:`과거를 안 들은 길은 ‘${scene10CurrentProtagonistLine}’→유리 ‘${scene10CurrentYuriLine}’로 대체, 다른 출발점이라는 감정 유지.`,
    steps:f([
      f({type:"dialogue",speaker:"주인공",text:scene10CurrentProtagonistLine}),
      f({type:"dialogue",speaker:"유리",text:scene10CurrentYuriLine})
    ])
  })
});
