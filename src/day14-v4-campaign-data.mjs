export const DAY14_V4_VERSION="NOTION_V4";
export const DAY14_V4_SCENARIO_ID="m30-day14-unreceived-flower-v4";

const freeze=Object.freeze;
const scene=(number,title,act,location)=>freeze({number,id:`day14-v4-scene-${String(number).padStart(2,"0")}`,title,act,location});
const option=(id,label,effects)=>freeze({id,label,effects:freeze(effects)});
const choice=(number,sceneNumber,title,options,variants={})=>freeze({number,sceneNumber,title,options:freeze(options),variants:freeze(variants)});

export const DAY14_V4_CHAPTER_CONTRACT=freeze({
  id:DAY14_V4_SCENARIO_ID,day:14,title:"받지 않은 꽃",chapterType:"현재 연애·거절 수용·새 인연의 생활 접점",
  windows:freeze(["아침","오전","오후","저녁","밤"]),locations:freeze(["나의 방","플로라 카페","연희역"]),participants:freeze(["주인공","하은","나리"]),
  prerequisites:freeze(["DAY13_V3_COMPLETE","DAY14_FLOWER_DESK_PLAN_PENDING","HAEUN_CONTACT_AVAILABLE"]),
  previousChoiceReferences:freeze(["DAY13_DESK_PHOTO_RECEIVED","DAY13_FLOWER_MESSAGE_RECEIVED","DAY13_HAEUN_NEEDS_SPACE","DAY13_DISCLOSURE_MISMATCH","PRIOR_HAND_CONTACT","UNRESOLVED_CONTACT_BOUNDARY"]),
  dramaticPurpose:"하은을 웃게 만들고 싶은 선의가 하은의 오늘 감정을 덮을 수 있음을 깨닫고, 꽃을 건네는 대신 함께 있거나 기다리는 현재의 행동을 선택하게 한다.",
  characterWants:freeze({
    protagonist:"예쁜 것으로 하은의 나쁜 하루를 바꾸고 싶지만, 하은이 받지 않거나 말하지 않을 자유까지 지키며 자기 방과 저녁도 돌본다.",
    haeun:"수정된 업무와 속상함을 자기 속도로 말하거나 쉬고, 위로의 대상이기 전에 오늘 무엇을 보고 누구와 있을지 스스로 정한다.",
    nari:"꽃의 가격·크기·포장·관리와 자기 실수를 솔직하게 다루며 손님이 실제로 원하는 범위까지만 돕는다."
  }),
  informationBudget:freeze({
    mustReveal:freeze(["DAY13의 책상 꽃은 하은의 자기 계획이지 선물 요청이 아니다","꽃 구매·사진·미구매와 꽃의 소유자는 서로 다른 사실이다","하은은 만남·통화·완전휴식을 선택할 수 있다","나리의 판매 친절과 주인공의 관심과 나리의 사적 호감은 별개다","과거의 좋은 반응을 재현하려는 기대와 오늘 하은의 감정은 다를 수 있다"]),
    mayReveal:freeze(["하은이 오늘 수정한 자료에서 자기 부분이 지워졌다","주인공은 DAY12의 한 줄 기여와 하은의 경험을 대비한다","나리는 꽃병을 찾던 엄마와의 통화를 이야기한다","하은은 내일 한강 갤러리 전시를 보려 한다"]),
    mustNotReveal:freeze(["하은의 정체 진실","사고 원인 또는 범인","나리를 운명적 정답으로 확정","판매 카드를 개인 연락처로 변경","나리의 사적 호감 자동 생성","꽃을 기억 회복 또는 치유 수단으로 확정","윤서진 AFFECTION 또는 STATUS_INTEREST 변경","DAY15 동행 자동 수락","잠금 프로필"]),
    playerMaySuspect:freeze(["주인공은 과거 하은의 좋은 반응을 복원하려 할 때 현재의 하은을 놓칠 수 있다","새 인연에 느끼는 편안함은 상대 개인과 과거를 모르는 상황이 함께 만든 것일 수 있다"])
  }),
  emotionalCurve:freeze(["어제 사진의 잔향","함께 가기로 하지 않은 계획","꽃으로 고치고 싶은 기대","나리와의 가벼운 생활 접점","하은의 거절 또는 조건부 만남","대면·통화·침묵에서 기다리는 법","조건부 친밀감과 비접촉 작별","자기 방·식사·관심의 정리","밤 인사 또는 연락 휴식","내일의 전시와 남아 있는 마음"]),
  targetPlayMinutes:"25-35 Notion target; route-specific browser timing not yet measured",
  followUpHook:"Haeun plans to see the Hangang Gallery exhibition tomorrow; accompaniment remains conditional and unaccepted."
});

export const DAY14_V4_VOICE_PROFILES=freeze({
  protagonist:freeze({rhythm:"관찰한 물건과 답장을 짧게 말하고 가능성을 열어 둔 뒤 확인한다.",humor:"침대로 간 물건·늦은 한숨·가격표와 빈 물컵을 건조하게 받아친다.",reasoning:"관찰→가능성→확인→판단→행동",mustNot:"꽃을 샀다는 이유로 만남·감사·접촉을 요구하지 않는다."}),
  haeun:freeze({rhythm:"짧은 메시지 뒤 침묵을 두고, 말할 때는 수정된 자료와 자기 감정을 구체적으로 고쳐 말한다.",humor:"꽃이 먼저 말할 줄 알았다는 장난과 너무 느린 걸음을 생활적으로 회수한다.",agency:"만남·통화·휴식·전시·손 내밀기를 스스로 정한다.",mustNot:"항상 다정하게 위로를 받아 주거나 주인공의 선의를 보상하지 않는다."}),
  nari:freeze({rhythm:"가격·크기·포장·손질을 짧은 존댓말로 설명하고 실수에는 크게 한숨 쉰다.",humor:"엄마가 꽃병을 세 번 묻던 대화와 돌아간 가격표를 생활 농담으로 쓴다.",agency:"손님 선택을 대신하지 않고 자기 일과 실수를 책임진다.",mustNot:"연애 상담가가 되거나 하은의 취향·기분을 진단하지 않는다."})
});

export const DAY14_V4_KNOWLEDGE_LEDGER=freeze({
  protagonist:freeze({knows:freeze(["하은이 자기 책상에 꽃을 두고 싶다고 말했다","하은의 오늘 답장과 자신이 실제로 산 것·찍은 것","DAY13에 자신이 하은에게 무엇을 보고했는지"]),believes:freeze(["예쁜 것은 기분을 조금 낫게 할 수 있다"]),suspects:freeze(["하은의 과거 좋은 반응을 다시 만들고 싶은 마음이 있다"]),doesNotKnow:freeze(["하은이 오늘 꽃이나 위로를 받을지","나리의 사적 관심","시우와 전시에서 무슨 일이 생길지"]),wants:"선의를 강요하지 않으면서 현재의 하은 곁에 있기",fears:"아무것도 하지 않으면 관계가 멀어질 것"}),
  haeun:freeze({knows:freeze(["자기 업무가 잘 끝나지 않았다","주인공이 직접 말한 꽃·만남 제안","자기가 원하는 휴식과 전시 계획"]),believes:freeze(["웃지 못하는 날에도 관계가 사라지는 것은 아니다"]),suspects:freeze(["주인공이 과거의 자기 반응을 복원하려 할 수 있다"]),doesNotKnow:freeze(["말하지 않은 나리 대화와 주인공 관심","주인공 방에서 실제로 한 정리와 식사"]),wants:"감정을 고치라는 압박 없이 말하거나 쉬기",fears:"받지 않으면 주인공의 선의를 거절한 사람으로만 남는 것"}),
  nari:freeze({knows:freeze(["손님이 직접 말한 꽃의 용도","실제 구매·사진 범위","자기 가게의 가격·포장·관리 정보"]),believes:freeze(["꽃은 놓일 자리와 돌보는 사람에 맞아야 한다"]),suspects:freeze([]),doesNotKnow:freeze(["주인공의 기억상실과 전체 관계","하은의 실제 기분","윤서진·아라 관련 상태"]),wants:"손님에게 맞는 범위의 꽃과 정확한 안내를 제공하기",fears:"자기 실수로 꽃이나 손님의 선택을 망치는 것"})
});

export const DAY14_V4_SCENES=freeze([
  scene(1,"어제의 사진",1,"나의 방"),scene(2,"함께 가기로 한 것은 아닌데",1,"나의 방"),scene(3,"예쁜 것을 보면 좀 낫지 않을까",1,"나의 방"),
  scene(4,"카페 앞의 작은 테이블",1,"플로라 카페 또는 나의 방"),scene(5,"한 송이라고 쉬운 것은 아니다",1,"플로라 카페"),scene(6,"오래가는 꽃",1,"플로라 카페"),scene(7,"나리가 놓친 한 송이",1,"플로라 카페"),scene(8,"선물이 할 수 없는 일",1,"플로라 카페"),
  scene(9,"오후의 답장",2,"플로라 카페 또는 나의 방"),scene(10,"들고 온 손을 내리는 일",2,"플로라 카페 또는 나의 방"),scene(11,"음료 두 잔",2,"플로라 카페 또는 나의 방"),scene(12,"잘 안 끝난 일",2,"플로라 카페 또는 전화"),scene(13,"위로가 늦게 오는 자리",2,"플로라 카페 또는 전화"),scene(14,"한 송이의 주인",2,"플로라 카페 또는 나의 방"),scene(15,"조금 틀어진 병",2,"플로라 카페"),scene(16,"네가 웃을 때",2,"플로라 카페"),scene(17,"꽃이 없는 두 손",2,"연희역 또는 나의 방"),
  scene(18,"혼자 있는 꽃",3,"나의 방"),scene(19,"나리의 카드",3,"나의 방"),scene(20,"꽃보다 먼저 보내는 말",3,"나의 방"),scene(21,"내일 보고 싶은 것",3,"나의 방"),scene(22,"받지 않아도 남는 마음",3,"나의 방")
]);

export const DAY14_V4_CHOICES=freeze([
  choice(1,2,"기다리는 동안",[
    option("day14_wait_own_work","나도 내 일 보다가 오후에 연락할게.",{waitingStrategy:"OWN_WORK"}),
    option("day14_wait_flower_solo","꽃은 나도 궁금해. 혼자 잠깐 보고 올까.",{waitingStrategy:"FLOWER_CURIOSITY"}),
    option("day14_wait_ask_need","지금 필요한 게 있으면 말해 줘.",{waitingStrategy:"ASK_NEED"})]),
  choice(2,3,"꽃을 고르는 이유",[
    option("day14_flower_for_room","오늘은 내 방에 둘 것을 보고 싶어.",{outingRoute:"FLORA",flowerPurpose:"SELF"}),
    option("day14_flower_discuss_later","하은이 나중에 고를 때 같이 얘기할 수 있게 봐 두자.",{outingRoute:"FLORA",flowerPurpose:"DISCUSS_LATER"}),
    option("day14_flower_cheer_haeun","작은 꽃 하나면 기분이 조금 나아질지도 몰라.",{outingRoute:"FLORA",flowerPurpose:"CHEER_HAEUN"}),
    option("day14_stay_home_clear_space","오늘은 집에 있고 싶어. 내 자리부터 좀 치워 보자.",{outingRoute:"HOME",flowerPurpose:"NO_FLOWER"})]),
  choice(3,5,"놓일 자리부터",[
    option("day14_place_my_room","제 방이요. 물컵 옆에 두려고요.",{statedOwner:"PROTAGONIST"}),
    option("day14_place_haeun_later","여자친구가 책상에 두고 싶다고 해서요. 아직 고르진 않았어요.",{statedOwner:"HAEUN_NOT_CHOSEN"}),
    option("day14_place_gift","선물하려고요. 오늘 좀 힘든가 봐서.",{statedOwner:"GIFT_INTENT"})],{requires:"outingRoute === FLORA"}),
  choice(4,8,"오늘은 무엇을 가져갈까",[
    option("day14_take_self_flower","제 방에 둘 한 송이만 주세요.",{purchaseOutcome:"SELF_FLOWER",flowerOwner:"PROTAGONIST"}),
    option("day14_take_photo_only","사진만 보고 갈게요. 나중에 같이 고르려고요.",{purchaseOutcome:"PHOTO_ONLY",flowerOwner:"SHOP"}),
    option("day14_take_gift_flower","그래도 선물 한 송이는 사고 싶어요.",{purchaseOutcome:"GIFT_FLOWER",flowerOwner:"PROTAGONIST_UNTIL_ACCEPTED"})],{requires:"outingRoute === FLORA",insufficientFundsOptions:freeze([
      option("day14_take_photo_only","사진만 보고 갈게요. 나중에 같이 고르려고요.",{purchaseOutcome:"PHOTO_ONLY",flowerOwner:"SHOP"}),
      option("day14_take_no_purchase","오늘은 사지 않고 돌아갈게요.",{purchaseOutcome:"NO_PURCHASE",flowerOwner:null})
    ])}),
  choice(5,9,"지금 만나고 싶은 마음",[
    option("day14_invite_sit_without_demand","잠깐 같이 앉아 있을래? 아무것도 안 골라도 돼.",{meetingProposal:"SIT_WITHOUT_DEMAND"}),
    option("day14_invite_rest_today","오늘은 쉬어. 꽃은 다음에 보자.",{meetingProposal:"REST_TODAY"}),
    option("day14_invite_show_prepared","내가 작은 걸 준비했는데, 잠깐만 보면 안 될까?",{meetingProposal:"SHOW_PREPARED",requiresGiftPurchase:true})],{withoutGiftOptions:freeze([
      option("day14_invite_sit_without_demand","잠깐 같이 앉아 있을래? 아무것도 안 골라도 돼.",{meetingProposal:"SIT_WITHOUT_DEMAND"}),
      option("day14_invite_rest_today","오늘은 쉬어. 꽃은 다음에 보자.",{meetingProposal:"REST_TODAY"}),
      option("day14_invite_direct_without_gift","나 사실 잠깐 보고 싶은데.",{meetingProposal:"DIRECT_WISH"})
    ])}),
  choice(6,12,"대답을 서두르지 않기",[
    option("day14_listen_ask_loss","어떤 부분이 제일 아쉬웠어?",{listeningStrategy:"ASK_LOSS"}),
    option("day14_listen_allow_upset","지금은 그냥 속상해해도 되지 않을까.",{listeningStrategy:"ALLOW_UPSET"}),
    option("day14_listen_ask_alternative","다른 방법은 없었어?",{listeningStrategy:"ASK_ALTERNATIVE"})],{fullRestOptions:freeze([
      option("day14_reflect_expected_words","어떤 말을 기다리고 있었을까.",{selfReflection:"EXPECTED_WORDS"}),
      option("day14_reflect_my_day","오늘 내 일은 어땠지.",{selfReflection:"MY_DAY"}),
      option("day14_reflect_stop_thinking","지금은 생각을 쉬자.",{selfReflection:"REST_THOUGHT"})
    ])}),
  choice(7,17,"이제 남은 시간",[
    option("day14_time_walk_station","역까지 같이 천천히 가자.",{remainingTime:"WALK_TO_STATION"}),
    option("day14_time_rest_home","오늘은 집에 가서 쉬어. 다음에 또 보자.",{remainingTime:"REST_HOME"}),
    option("day14_time_more_together","나도 너랑 조금만 더 있고 싶어.",{remainingTime:"MORE_TOGETHER"})],{noMeetingOptions:freeze([
      option("day14_time_eat_my_dinner","내 저녁을 먹자.",{remainingTime:"EAT_DINNER"}),
      option("day14_time_short_air","짧게 창밖 바람 쐬자.",{remainingTime:"SHORT_AIR"}),
      option("day14_time_sleep_early","오늘은 일찍 쉬자.",{remainingTime:"SLEEP_EARLY"})
    ])}),
  choice(8,18,"내 방에서 끝낼 일",[
    option("day14_room_make_flower_visible","꽃이 보이도록 물건을 조금 더 옮긴다.",{roomClosing:"FLOWER_VISIBLE"}),
    option("day14_room_make_seat_first","앉기 편한 자리를 먼저 만들고 사진은 나중에 찍는다.",{roomClosing:"SEAT_FIRST"}),
    option("day14_room_stop_and_eat","오늘은 여기까지만 정리하고 저녁을 먹는다.",{roomClosing:"STOP_AND_EAT"})]),
  choice(9,19,"오늘 받은 친절",[
    option("day14_nari_ask_flowers_again","다음에 꽃 볼 때 또 물어봐야겠다.",{nariInterest:"FLOWER_HELP"}),
    option("day14_nari_talk_more","나리 씨와도 조금 더 이야기해 보고 싶다.",{nariInterest:"PERSONAL_CURIOSITY"}),
    option("day14_nari_enough_today","오늘 도움받은 것으로 충분하다.",{nariInterest:"ENOUGH_TODAY"})],{noNariOptions:freeze([
      option("day14_no_nari_buy_someday","언젠가 꽃을 사 볼까.",{nariInterest:"NOT_MET",selfInterest:"BUY_SOMEDAY"}),
      option("day14_no_nari_desk_photo","오늘 책상 사진을 남길까.",{nariInterest:"NOT_MET",selfInterest:"DESK_PHOTO"}),
      option("day14_no_nari_cleanup_enough","오늘은 정리한 것으로 됐다.",{nariInterest:"NOT_MET",selfInterest:"CLEANUP_ENOUGH"})
    ])}),
  choice(10,20,"하은에게 밤 인사",[
    option("day14_night_thanks_for_talking","오늘 이야기해 줘서 고마워.",{nightMessage:"THANKS_FOR_TALKING",requiresConversation:true}),
    option("day14_night_flower_home","꽃은 잘 데려왔어. 네가 보고 싶으면 보여 줄게.",{nightMessage:"FLOWER_HOME",requiresPurchase:true}),
    option("day14_night_rest_no_reply","오늘은 푹 쉬어. 답 안 해도 돼.",{nightMessage:"REST_NO_REPLY"})],{contactRestOptions:freeze([
      option("day14_night_no_message","연락하지 않고 오늘의 휴식 요청을 지킨다.",{nightMessage:"NO_MESSAGE"})
    ])})
]);

export const DAY14_V4_STATE_FIELDS=freeze({
  day14V4Version:"string",day14V4ScenarioId:"string",day14V4RuntimeStage:"integer",day14V4SceneCheckpoint:"integer",day14V4ChoiceIndex:"integer",day14V4SelectedChoiceIds:"string[]",day14V4Completed:"boolean",
  day14V4RelationshipBand:"LOW|MID|HIGH",day14V4PriorHandContact:"boolean",day14V4UnresolvedContactBoundary:"boolean",
  day14V4Day13DeskPhotoReceived:"boolean|null",day14V4Day13FlowerMessageReceived:"boolean|null",day14V4WaitingStrategy:"string|null",day14V4OutingRoute:"FLORA|HOME|null",day14V4FlowerPurpose:"string|null",day14V4StatedOwner:"string|null",day14V4CanAffordFlower:"boolean",day14V4HaeunMeetingAvailability:"AVAILABLE|UNAVAILABLE",day14V4HaeunCallsLater:"boolean",day14V4ExhibitionInviteEligible:"boolean",day14V4ContactRestActive:"boolean",day14V4Choice5Reaction:"string|null",
  day14V4NariMet:"boolean|null",day14V4NariNameKnown:"boolean|null",day14V4NariCardObtained:"boolean|null",day14V4FlowerPhotoTaken:"boolean|null",day14V4PurchaseOutcome:"SELF_FLOWER|PHOTO_ONLY|GIFT_FLOWER|NO_PURCHASE|INSUFFICIENT_FUNDS|null",day14V4FlowerOwner:"PROTAGONIST|PROTAGONIST_UNTIL_ACCEPTED|SHOP|null",
  day14V4MeetingProposal:"string|null",day14V4MeetingConsent:"ACCEPTED|DECLINED|REST_REQUESTED|null",day14V4InteractionRoute:"IN_PERSON|PHONE|FULL_REST|null",day14V4HaeunWorkStoryHeard:"boolean|null",day14V4HaeunNariIntroduced:"boolean|null",
  day14V4HaeunInitiatedHand:"boolean|null",day14V4HandContactEstablished:"boolean|null",day14V4RoomClosing:"string|null",day14V4AteDinner:"boolean|null",day14V4RoomPhotoTaken:"boolean|null",day14V4NariInterest:"NOT_MET|FLOWER_HELP|PERSONAL_CURIOSITY|ENOUGH_TODAY|null",day14V4NariPrivateContact:"boolean",day14V4NightMessage:"string|null",day14V4ExhibitionInvitation:"INVITED|NOT_INVITED|null",day15GalleryPlanPending:"boolean"
});
