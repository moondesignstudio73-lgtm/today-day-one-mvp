export const DAY6_V3_LATE_ACT_SOURCE_RANGE=Object.freeze({
  scenes:[15,16,17,18,19,20,21,22,23],
  choices:[8,9,10,11],
  source:"AI해커톤 > DAY 6 — 처음 가는 길 | SCENARIO V3",
  sourceUrl:"https://app.notion.com/p/3c9c31f029a681269f75fe01dbc4ab44"
});

export const DAY6_V3_LATE_ACT_REACTIONS=Object.freeze({
  musicDistance:Object.freeze({
    LOW:"두 사람 사이의 앨범",
    MID:"좁아진 틈",
    HIGH:"앨범 말고",
    callback:"서로 고른 곡의 카드를 교환하고 DAY 7 후보로 보존"
  }),
  currentPhoto:Object.freeze({
    "current-photo-formal":"과거 사진의 복제가 아닌, 지금 제대로 웃어 보겠다는 선택",
    "current-photo-funny":"사진의 연출성을 함께 인정하고 실패를 놀이로 바꾸는 선택",
    "current-photo-candid":"서로의 표정을 통제하지 않고 각자의 현재 모습을 남기는 선택"
  }),
  card:Object.freeze({
    "card-tease":"김밥 실패를 둘만의 웃음 콜백으로 전환",
    "card-shared-time":"망가진 계획 뒤의 공동 시간을 현재 기억으로 기록",
    "card-current-taste":"현재의 상대 취향을 알고 싶다는 관계 의지를 기록"
  }),
  hand:Object.freeze({
    "hand-offer":Object.freeze({LOW:"NO_CONTACT_NO_PENALTY",MID:"MUTUAL_CONTACT",HIGH:"MUTUAL_CONTACT",VERY_HIGH:"MUTUAL_CONTACT"}),
    "hand-ask":Object.freeze({LOW:"NO_CONTACT_NO_PENALTY",MID:"MUTUAL_CONTACT",HIGH:"MUTUAL_CONTACT",VERY_HIGH:"MUTUAL_CONTACT"}),
    "hand-keep-walking":Object.freeze({LOW:"NO_CONTACT",MID:"NO_CONTACT",HIGH:"NO_CONTACT",VERY_HIGH:"NO_CONTACT"})
  }),
  goodbye:Object.freeze({
    relationshipBands:["LOW","MID","HIGH","VERY_HIGH"],
    remembersHandContact:true,
    preservesConsentBoundary:true
  }),
  finalMessage:Object.freeze({
    relationshipBands:["LOW","MID","HIGH","VERY_HIGH"],
    remembersHandContact:true,
    newAlbumPlacement:"과거 사진 옆에 두지 않음",
    day7Hook:true,
    seojinHook:"사진 찾았어요.",
    seojinHookState:"UNOPENED"
  })
});

export function validateDay6V3LateActReactions(){
  const hand=DAY6_V3_LATE_ACT_REACTIONS.hand;
  return DAY6_V3_LATE_ACT_SOURCE_RANGE.scenes.join(",")==="15,16,17,18,19,20,21,22,23"
    && DAY6_V3_LATE_ACT_SOURCE_RANGE.choices.join(",")==="8,9,10,11"
    && Object.values(hand["hand-keep-walking"]).every(result=>result==="NO_CONTACT")
    && hand["hand-ask"].LOW==="NO_CONTACT_NO_PENALTY"
    && hand["hand-ask"].MID==="MUTUAL_CONTACT"
    && DAY6_V3_LATE_ACT_REACTIONS.finalMessage.seojinHookState==="UNOPENED";
}
