const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const cg=assetUrl=>({type:"cg",assetUrl});
const choice=options=>({type:"choice",options});

export const DAY4_V3_MORNING_CHOICES=Object.freeze([
  {id:"morning_awake_plain",label:"일어났어."},
  {id:"morning_flirt",label:"보고 싶어서 연락했어?"},
  {id:"morning_who_are_you",label:"누구세요"}
]);

export const DAY4_V3_CONTACT_CHOICES=Object.freeze([
  {id:"contact_direct_call",label:"바로 전화한다."},
  {id:"contact_written_proof",label:"메시지를 보낸다."},
  {id:"contact_haeun_crosscheck",label:"하은에게 먼저 물어본다."}
]);

export const DAY4_V3_FIRST_QUESTION_CHOICES=Object.freeze([
  {id:"identity_self",label:"나 어떤 사람이었어?"},
  {id:"identity_haeun",label:"하은이도 알아?"},
  {id:"identity_accident",label:"사고 얘기 알아?"}
]);

export const DAY4_V3_DISCLOSURE_CHOICES=Object.freeze([
  {id:"disclose_tell",label:"하은에게 말한다."},
  {id:"disclose_ask_permission",label:"허락을 구한다."},
  {id:"disclose_silent",label:"말하지 않는다."}
]);

export const DAY4_V3_TASTE_CHOICES=Object.freeze([
  {id:"taste_current",label:"지금 먹고 싶은 걸 고른다."},
  {id:"taste_old_order",label:"내가 원래 먹던 걸로 시켜줘."},
  {id:"taste_new_menu",label:"처음 보는 메뉴를 고른다."}
]);
export const DAY4_V3_OLD_DRINK_CHOICES=Object.freeze([
  {id:"old_drink_good",label:"괜찮은데."},
  {id:"old_drink_bad",label:"별론데."},
  {id:"old_drink_unsure",label:"잘 모르겠어."}
]);
export const DAY4_V3_HAEUN_PAST_CHOICES=Object.freeze([
  {id:"haeun_past_love",label:"나 하은 많이 좋아했어?"},
  {id:"haeun_past_conflict",label:"둘이 많이 싸웠어?"},
  {id:"haeun_past_marriage",label:"결혼하는 것도 알고 있었어?"}
]);
export const DAY4_V3_PRE_ACCIDENT_CHOICES=Object.freeze([
  {id:"accident_last_contact",label:"마지막으로 연락한 게 언제야?"},
  {id:"accident_behavior",label:"그때 나 이상했어?"},
  {id:"accident_haeun_problem",label:"하은이랑 문제 있었어?"}
]);
export const DAY4_V3_PAYMENT_CHOICES=Object.freeze([
  {id:"payment_self",label:"내가 계산한다."},
  {id:"payment_jihoon",label:"지훈에게 얻어먹는다."},
  {id:"payment_split",label:"반반 낸다."}
]);
export const DAY4_V3_REFLECTION_CHOICES=Object.freeze([
  {id:"reflection_good",label:"좋았어."},
  {id:"reflection_strange",label:"조금 이상했어."},
  {id:"reflection_curious",label:"더 궁금해졌어."}
]);

export function getDay4RelationshipTier(state){
  const affection=Number(state?.affection??0),trust=Number(state?.trust??0);
  if(affection>=650&&trust>=550)return "HIGH";
  if(affection>=350&&trust>=300)return "MID";
  return "LOW";
}

function relationshipLines(tier){
  if(tier==="HIGH")return [d("하은","잘 잤어?"),d("나","응."),d("하은","다행이다"),d("나","뭐가."),d("하은","그냥\n아침에 네 답장 오는 거\n아직도 좀 신기해서","soft-vulnerable"),n("주인공은 한동안 화면을 바라본다.")];
  if(tier==="MID")return [d("하은","밥 꼭 먹어"),d("나","엄마야?"),d("하은","여자친구"),d("나","그 말 자꾸 써먹네."),d("하은","내가 1년 기다린 권리","warm-playful"),n("주인공의 손가락이 잠깐 멈춘다.")];
  return [d("하은","아침 먹고 약 챙겨.\n오늘은 너무 많이 돌아다니지 말고."),d("나","알았어."),d("하은","응. 이따 연락할게."),n("아직 서로 조심스럽다.")];
}

function morningReaction(id){
  if(id==="morning_flirt")return [d("나","보고 싶어서 연락했어?"),n("몇 초 동안 ‘읽음’만 남았다."),d("하은","기억 잃더니 뻔뻔해졌네","warm-playful"),d("나","원래는 아니었어?"),d("하은","원래도 그랬어"),n("주인공이 웃는다.")];
  if(id==="morning_who_are_you")return [d("나","누구세요"),n("읽자마자 전화가 걸려왔다."),d("나","여보세요."),d("하은","이하은."),d("나","아."),d("하은","스물세 살."),d("나","네."),d("하은","네 여자친구."),d("나","그건 아직 검증—"),d("하은","끊는다.","warm-playful"),d("나","잠깐."),n("전화기 너머로 하은이 웃는다.")];
  return [d("나","일어났어."),d("하은","몸은?"),d("나","괜찮아."),d("하은","그 말 이제 안믿음"),d("나","왜."),d("하은","괜찮다고 해놓고 어지럽다고 하잖아")];
}

export function getDay4V3MorningSegment(state){return [
  {type:"transition",style:"fade",label:"SCENE 01 · 내 방에서 맞는 아침",backgroundId:"day4-bedroom-morning"},
  n("새소리와 휴대폰 진동 사이로 눈을 떴다. 이번에는 안 놀랐다. 적어도 여기가 어디인지는 안다."),
  n("책상, 꺼져 있는 컴퓨터, 사진, 서랍. 오늘도 낯설지만 아주 조금 ‘내 방’이라는 말이 붙기 시작했다."),
  cg("assets/events/day4/cg-day4-morning-message-pov-v1.png"),
  n("08:17. 하은에게서 ‘일어났어?’ 그리고 7분 뒤 ‘설마 또 자’라는 메시지가 와 있었다."),
  choice(DAY4_V3_MORNING_CHOICES)
];}

function day3Callback(state){
  const history=state?.storyHistory??[];
  if(history.some(x=>x.sceneId==="m30-day3-discharge-phone"&&x.choiceId==="inspect-system-first"))return n("DAY 3에서 정한 대로 주소·날짜·연락처 이름을 교차 확인했다.",{callbackId:"inspect-system-first"});
  if(history.some(x=>x.sceneId==="m30-day3-discharge-phone"&&x.choiceId==="set-up-together"))return n("하은이 남긴 약 위치 메모를 확인하고 외출 전 복약 기준을 지켰다.",{callbackId:"set-up-together"});
  if(history.some(x=>x.sceneId==="m30-day3-discharge-phone"&&x.choiceId==="seal-until-home"))return n("집에서 열기로 한 약속대로 이 책상에서 처음 과거 기록을 열었다.",{callbackId:"seal-until-home"});
  return n("확인한 날짜와 이름을 기록하되, 아직 누구도 확정하지 않았다.");
}

export function getDay4V3PhotoSegment(state){return [
  ...morningReaction(state?.storyFlags?.day4MorningReply),
  {type:"transition",style:"fade",label:"SCENE 02 · 관계 단계 반영",backgroundId:"day4-bedroom-morning"},
  ...relationshipLines(getDay4RelationshipTier(state)),
  {type:"transition",style:"fade",label:"SCENE 03 · 사진 속 사람",backgroundId:"day4-bedroom-morning"},
  n("아침을 먹은 뒤 자신의 방으로 돌아왔다."),
  n("PC 전원을 눌러 비밀번호 화면과 오래된 메신저 알림의 이름만 확인하고 우회하지 않았다. 닳은 교통카드와 볼링장 영수증은 날짜만 본 뒤 원래 자리에 두었다."),
  day3Callback(state),
  cg("assets/events/day4/cg-day4-group-photo-back-pov-v1.png"),
  n("하은과 찍은 사진, 가족사진, 그리고 친구 다섯 명의 사진. 사진 속 나는 지금보다 훨씬 크게 웃고 있었다."),
  n("사진 뒤에는 날짜와 이름들이 있었고, 그중 하나는 ‘지훈’이었다."),
  d("나","찾았다."),
  n("프로필 사진은 사진 속 남자와 같았고 사고 이전에는 꽤 자주 연락했다. 내용은 남아 있지 않았다."),
  n("친구. 그것도 꽤 친했던 친구. 전화 버튼 위에서 손가락이 멈췄다."),
  choice(DAY4_V3_CONTACT_CHOICES)
];}

function contactReaction(id){
  if(id==="contact_written_proof")return [d("나","안녕하세요."),n("친구한테 안녕하세요가 맞나."),d("지훈","누구세요"),d("나","나."),d("지훈","누구"),d("나","이 번호 주인."),n("5초 뒤 전화가 걸려왔다."),d("지훈","야 이 미친놈아!"),d("나","목소리 크네.")];
  if(id==="contact_haeun_crosscheck")return [d("나","얘 누구야?"),d("하은","지훈"),d("나","친구?"),d("하은","응"),d("나","친했어?"),d("하은","꽤"),d("나","어떤 애야?"),d("하은","그건 직접 물어봐"),d("나","너 요즘 이것만 말하는 것 같은데"),d("하은","내가 다 말해주면 재미없잖아","warm-playful"),d("나","내 인생이거든"),d("하은","그러니까 직접 알아봐")];
  return [n("통화 연결음이 세 번 울렸지만 받지 않았다. 전화를 끊고 5초 뒤 지훈에게서 다시 전화가 왔다."),d("나","여보세요."),d("지훈","……야?"),d("나","응."),d("지훈","너야?"),d("나","아마."),d("지훈","미친. 너 진짜 깨어났어?")];
}

export function getDay4V3FirstCallSegment(state){return [
  ...contactReaction(state?.storyFlags?.day4ContactStrategy),
  {type:"transition",style:"fade",label:"SCENE 04 · 진짜 기억 안 나?",backgroundId:"day4-bedroom-morning"},
  d("지훈","진짜 하나도 기억 안 나?"),d("나","응."),d("지훈","나도?"),d("나","사진 보고 알았어."),d("지훈","와."),n("잠깐 침묵했다."),
  d("지훈","좀 서운한데."),d("나","미안."),d("지훈","야. 네가 왜 미안해."),n("지훈이 헛웃음을 쳤다."),
  d("지훈","근데 말투는 똑같네."),d("나","그래?"),d("지훈","응."),d("나","어땠는데."),d("지훈","재수 없었어."),d("나","끊는다."),d("지훈","봐. 이거."),
  n("둘 다 웃었다. 처음으로 하은이 아닌 과거의 사람이 자신을 보고 웃었다."),n("이 사람은 나를 알고 있다. 그게 이상하게 조금 안심됐다."),
  choice(DAY4_V3_FIRST_QUESTION_CHOICES)
];}

function firstQuestionReaction(id){
  if(id==="identity_haeun")return [d("지훈","하은?"),d("나","응."),d("지훈","알지."),d("나","친했어?"),d("지훈","나랑?"),d("나","응."),d("지훈","아니. 너 여자친구니까 알았던 거지."),d("나","그 정도?"),d("지훈","응."),n("하은과 지훈이 서로의 모든 정보를 공유한 것은 아니었다.")];
  if(id==="identity_accident")return [d("지훈","많이는 몰라."),d("나","뭐까지."),d("지훈","사고 났다는 거. 부모님 돌아가셨다는 거."),n("잠깐 멎은 뒤 목소리가 낮아졌다."),d("지훈","네가 안 깨어난다는 거."),d("나","하은이한테 들었어?"),d("지훈","응."),d("나","사고 전에는?"),d("지훈","그건 만나서 얘기하자.")];
  return [d("지훈","그걸 한마디로?"),d("나","응."),d("지훈","귀찮은 놈."),d("나","끊는다니까."),d("지훈","아니, 진짜로."),d("지훈","평소에는 대충대충 하는 것 같은데. 이상한 데 꽂히면 끝까지 하고. 약속 같은 건 또 이상하게 잘 지키고."),d("나","좋은 사람인데?"),d("지훈","본인이 말하니까 확 깨네.")];
}

export function getDay4V3MeetingSetupSegment(state){return [
  ...firstQuestionReaction(state?.storyFlags?.day4FirstQuestion),
  {type:"transition",style:"fade",label:"SCENE 05 · 만나자",backgroundId:"day4-bedroom-morning"},
  d("지훈","오늘 나올 수 있어?"),d("나","어디."),d("지훈","너희 집 근처."),d("나","왜."),d("지훈","얼굴 보려고."),d("나","영상통화 하면 되잖아."),d("지훈","야. 1년 만에 깨어난 친구를 영상통화로 보냐?"),
  d("지훈","근처 카페 알지?"),d("나","모르는데."),n("정적."),d("지훈","아."),d("나","기억상실."),d("지훈","아직 적응 안 된다."),
  n("지훈이 위치를 보냈다. 새로운 장소 ‘역 앞 카페’가 스토리 목적지로 등록됐다. 지도 전체 탐색은 DAY 6에서 시작한다.",{unlockId:"station-cafe-story-destination"}),
  {type:"transition",style:"fade",label:"SCENE 06 · 하은에게 말할까?",backgroundId:"day4-bedroom-morning"},
  n("옷을 갈아입고 현관 앞에서 휴대폰을 봤다. 하은에게 말할지 고민했다."),
  choice(DAY4_V3_DISCLOSURE_CHOICES)
];}

export function getDay4V3DisclosureReaction(state){
  const id=state?.storyFlags?.day4DisclosureStrategy;
  if(id==="disclose_ask_permission")return [d("나","지훈 만나도 돼?"),n("하은의 답장이 늦었다."),d("하은","왜 나한테 허락을 받아"),d("나","걱정하잖아."),d("하은","걱정하는 거랑\n네가 어디 가는 걸 내가 허락하는 건 다르지"),d("하은","몸만 조심해")];
  if(id==="disclose_silent")return [n("휴대폰을 주머니에 넣었다."),n("친구 만나는 것까지 보고할 필요는 없겠지."),n("하은이 알게 되면 이 선택을 기억한 조건부 대화가 열린다.",{callbackId:"day4HaeunDisclosurePending"})];
  return [d("나","지훈 만나고 올게."),d("하은","오늘?"),d("나","응."),d("하은","몸 괜찮겠어?"),d("나","집 근처 카페."),d("하은","알겠어\n힘들면 바로 들어가\n재밌게 놀다 와"),n("조금 의외라는 듯 화면을 바라봤다.")];
}

export function getDay4V3CafeArrivalSegment(state){return [
  ...getDay4V3DisclosureReaction(state),
  {type:"transition",style:"fade",label:"SCENE 07 · 다시 밖으로",backgroundId:"day2-home-entry"},
  {type:"sfx",cueId:"SFX_HOME_KEY_UNLOCK"},n("현관문을 나서 천천히 걸었다. DAY 3보다 몸은 조금 나았지만 빠르게 걷지는 않았다."),
  n("휴대폰 지도에 표시된 길을 따라 횡단보도, 편의점, 작은 골목과 사람들을 지나갔다."),n("예전에는 수도 없이 걸었을 길이다. 지금은 지도 없이는 집도 못 찾는다."),n("신호가 바뀌고 길을 건넜다."),
  {type:"transition",style:"fade",label:"SCENE 08 · 사진 속 사람이 걸어온다",backgroundId:"day4-station-cafe-afternoon",characterId:"best-friend",characterAssetUrl:"assets/characters/day4/jihoon-day4-cautious-greeting-v1.png"},
  n("카페 앞의 남자는 휴대폰을 보고 있었다. 사진과 얼굴을 번갈아 확인했다. 지훈이었다."),
  d("지훈","……."),n("눈이 마주치자 지훈이 한 걸음 다가왔다. 껴안으려 팔을 들었다가 접촉 전에 멈췄다."),
  cg("assets/events/day4/cg-day4-jihoon-stopped-hug-v1.png"),d("지훈","……진짜 기억 안 나지."),d("나","응."),n("지훈은 팔을 내리고 대신 어깨를 가볍게 쳤다."),d("지훈","일단 들어가자."),
  {type:"transition",style:"fade",label:"SCENE 09 · 뭐 마실래?",backgroundId:"day4-station-cafe-afternoon",characterId:"best-friend",characterAssetUrl:"assets/characters/day4/jihoon-day4-warm-tease-v1.png"},
  {type:"sfx",cueId:"AMB_CAFE_DAY"},n("두 사람이 앉자 직원이 다가왔다."),d("직원","주문 도와드릴까요?"),n("메뉴판을 보고 있는데 지훈이 무심코 입을 열었다."),d("지훈","얘는 아이스—"),n("지훈이 멈췄다. 눈이 마주치자 메뉴판을 내 쪽으로 돌렸다."),d("지훈","아. 네가 골라."),
  choice(DAY4_V3_TASTE_CHOICES)
];}

export function getDay4V3TasteReaction(state){
  const id=state?.storyFlags?.day4TasteStrategy;
  if(id==="taste_old_order")return [d("지훈","아이스 아메리카노."),d("나","바로 나오네."),d("지훈","맨날 먹었으니까."),n("음료가 나오자 한 모금 마셨다."),d("나","……."),d("지훈","어때."),choice(DAY4_V3_OLD_DRINK_CHOICES)];
  if(id==="taste_new_menu")return [d("나","예전에 뭘 먹었든. 오늘은 이거."),n("지훈이 웃었다."),d("나","왜."),d("지훈","그건 좀 너답다."),d("나","뭐가."),d("지훈","남이 정해주는 거 싫어하는 거."),d("나","그건 안 변했나 보네.")];
  return [n("지금 먹고 싶은 음료를 주문하자 지훈이 살짝 고개를 갸웃했다."),d("나","왜."),d("지훈","그거 잘 안 먹었는데."),d("나","그래?"),d("지훈","응."),d("나","하은이는 내가 이런 것도 좋아했다고 하던데."),d("지훈","하은이가? 걔랑 있을 때는 먹었나 보지."),d("나","너랑 있을 때는?"),d("지훈","넌 나 만나면 거의 맨날 똑같은 거 먹었어."),d("나","사람에 따라 취향도 달라지나."),d("지훈","취향이 달라진다기보다, 여자친구 만날 때랑 친구 만날 때랑 똑같이 행동하냐?"),n("하은이 기억하는 나와 지훈이 기억하는 나는 벌써 조금 달랐다. 그렇다고 누구 하나가 틀렸다고 할 정도는 아니었다.")];
}

export function getDay4V3OldDrinkReaction(state){
  const id=state?.storyFlags?.day4OldDrinkReaction;
  if(id==="old_drink_bad")return [d("나","별론데."),d("지훈","진짜?"),d("나","응."),d("지훈","와."),d("나","왜."),d("지훈","이건 좀 신기하다."),d("나","사람 입맛 변할 수도 있지. 기억 돌아온다고 이것까지 다시 좋아해야 되는 건 아니잖아."),d("지훈","그건 그렇네.")];
  if(id==="old_drink_unsure")return [d("나","맛은 아는데. 좋아하는지는 모르겠어."),d("지훈","그것도 다시 알아가야겠네.")];
  return [d("나","괜찮은데."),d("지훈","그치?"),d("나","이런 건 몸이 기억하나."),d("지훈","그럴 수도 있지.")];
}

function resolvedTasteReaction(state){return state?.storyFlags?.day4TasteStrategy==="taste_old_order"?[...getDay4V3OldDrinkReaction(state)]:[...getDay4V3TasteReaction(state)];}

export function getDay4V3PhotoMemoriesSegment(state){return [
  ...resolvedTasteReaction(state),
  {type:"transition",style:"fade",label:"SCENE 10 · 사진 속의 나",backgroundId:"day4-station-cafe-afternoon",characterId:"best-friend",characterAssetUrl:"assets/characters/day4/jihoon-day4-warm-tease-v1.png"},
  n("음료가 나오자 처음보다 분위기가 조금 편해졌다."),d("지훈","사진 볼래?"),d("나","내 사진?"),d("지훈","응."),d("나","많아?"),d("지훈","단톡방 뒤지면 엄청 많지."),
  cg("assets/events/day4/cg-day4-table-phone-photo-pov-v1.png"),n("볼링장, 노래방, PC방, 바닷가, 식당, 술집과 생일. 평범한 사진 속 나는 하나같이 지금보다 편해 보였다."),
  d("나","나 생각보다 잘 돌아다녔네."),d("지훈","잘? 너 맨날 어디 가자고 했어."),d("나","하은이는 내가 집에 있는 것도 좋아했다고 했는데."),d("지훈","그것도 맞아."),d("나","둘 다 어떻게 맞아."),d("지훈","하은이랑 있을 때는 집에 잘 있었고. 우리 만나면 네가 제일 먼저 나가자고 했고."),d("나","완전히 다른 사람인데."),d("지훈","사람이 누구 만나는지에 따라 좀 다르지."),
  n("연인 앞의 나와 친구 앞의 나. 둘 다 나였을 텐데 지금은 둘 다 남처럼 보였다."),
  {type:"transition",style:"fade",label:"SCENE 11 · 하은도 있었네",backgroundId:"day4-station-cafe-afternoon",characterId:"best-friend",characterAssetUrl:"assets/characters/day4/jihoon-day4-serious-testimony-v1.png"},
  n("다음 사진에는 하은이 내 바로 옆에 있었다."),d("나","하은이네."),d("지훈","응."),d("나","너희 별로 안 친했다며."),d("지훈","안 친했지."),d("나","같이 놀았는데?"),d("지훈","네가 데려온 거야."),d("나","자주?"),d("지훈","몇 번."),
  n("조금 어려 보이는 하은의 어깨에 사진 속 내가 팔을 올리고 있었다. 둘의 표정은 자연스러웠다."),d("지훈","왜."),d("나","아니."),n("사진만 보면 내가 하은을 좋아했다는 건 별로 의심이 안 됐다."),
  choice(DAY4_V3_HAEUN_PAST_CHOICES)
];}

export function getDay4V3HaeunPastReaction(state){
  const id=state?.storyFlags?.day4HaeunPastQuestion;
  if(id==="haeun_past_conflict")return [d("지훈","그걸 왜 나한테 물어."),d("나","친구잖아."),d("지훈","연애 상담은 잘 안 했어."),d("나","전혀?"),d("지훈","전혀는 아니고. 가끔 술 먹으면 한두 마디."),d("나","뭐라고 했는데."),d("지훈","그건 기억 안 나."),n("의심스럽게 보자 지훈이 곧바로 덧붙였다."),d("지훈","진짜야.")];
  if(id==="haeun_past_marriage")return [d("지훈","응."),d("나","내가 직접 말했어?"),d("지훈","어."),d("나","어땠는데."),d("지훈","뭐가."),d("나","말할 때."),d("지훈","좋아 보였어."),d("나","그 정도?"),d("지훈","아니. 존나 좋아 보였어."),d("나","표현이 왜 그래."),d("지훈","친구니까."),d("지훈","네가 먼저 결혼하고 싶다고 말할 줄은 몰랐는데. 말할 때는 진짜였어.","serious"),n("아무 말도 하지 못했다.")];
  return [d("지훈","어."),d("나","바로 대답하네."),d("지훈","그건 확실하니까."),d("나","어떻게 알아."),d("지훈","하은이 연락 오면 표정부터 달라졌거든."),d("나","내가?"),d("지훈","어."),d("나","티 많이 냈네."),d("지훈","엄청.")];
}

export function getDay4V3PreAccidentPreamble(state){return [
  ...getDay4V3HaeunPastReaction(state),
  {type:"transition",style:"fade",label:"SCENE 12 · 사고 전에는 어땠어?",backgroundId:"day4-station-cafe-afternoon",characterId:"best-friend",characterAssetUrl:"assets/characters/day4/jihoon-day4-serious-testimony-v1.png"},
  n("사진 이야기가 끝나고 잠시 조용해졌다. 컵을 만지작거렸다."),d("나","지훈아."),d("지훈","응."),d("나","사고 나기 전에는. 나 어땠어?"),d("지훈","언제쯤."),d("나","직전."),
  d("지훈","그때는 자주 못 봤어."),d("나","왜."),d("지훈","네가 바빴어."),d("나","회사?"),d("지훈","그런 줄 알았지."),d("나","그런 줄?"),d("지훈","내가 직접 본 게 아니니까. 회사 때문인지, 결혼 준비 때문인지, 다른 일이 있었는지는 몰라."),n("지훈은 추측과 사실을 구분하려는 듯 말을 골랐다."),d("지훈","확실한 건 전보다 연락이 좀 줄었다는 거."),choice(DAY4_V3_PRE_ACCIDENT_CHOICES)
];}

export function getDay4V3PreAccidentReaction(state){
  const id=state?.storyFlags?.day4AccidentQuestion;
  if(id==="accident_behavior")return [d("지훈","이상하다기보다는 정신없어 보였지."),d("나","어떻게."),d("지훈","약속 잡았다가 미루고. 연락 늦고. 그러다가 갑자기 만나자고 하고."),d("나","원래는 안 그랬어?"),d("지훈","가끔 그랬지."),d("나","그럼 평범한 거잖아."),d("지훈","그러니까 나도 모르겠다는 거야.")];
  if(id==="accident_haeun_problem")return [d("지훈","몰라."),d("나","전혀?"),d("지훈","네가 연애 얘기를 나한테 세세하게 하지는 않았어."),n("아쉬운 표정을 짓자 지훈이 말을 이었다."),d("지훈","야."),d("나","왜."),d("지훈","내가 아는 것만 말할게. 기억도 없는 사람한테 내 추측까지 얹으면 네가 뭐가 진짜인지 더 헷갈릴 거 아냐."),d("나","……고맙다.")];
  return [n("지훈이 메신저를 검색했다."),d("지훈","잠깐. 폰 바꾸면서 예전 거 많이 날아갔네."),d("나","백업은?"),d("지훈","집에 예전 폰 있을지도 몰라."),d("나","찾아줄 수 있어?"),d("지훈","어. 찾아볼게.")];
}

export function getDay4V3BondAndPaymentSegment(state){return [
  ...getDay4V3PreAccidentReaction(state),
  {type:"transition",style:"fade",label:"SCENE 13 · 오래된 농담",backgroundId:"day4-station-cafe-afternoon",characterId:"best-friend",characterAssetUrl:"assets/characters/day4/jihoon-day4-warm-tease-v1.png"},
  n("대화가 무거워지자 지훈이 일부러 휴대폰을 내려놓았다."),d("지훈","근데. 너 진짜 아무것도 기억 안 나면, 내가 예전에 너한테 빌려준 백만 원도 기억 안 나겠네."),d("나","계좌 내역 확인한다."),d("지훈","아."),d("나","왜."),d("지훈","기억은 잃었는데 머리는 안 잃었네."),d("나","아쉽냐?"),n("둘이 웃었다. 기억은 없는데 대화가 이상하게 편했다. 어쩌면 친했다는 건 이런 건가."),
  {type:"transition",style:"fade",label:"SCENE 14 · 계산",backgroundId:"day4-station-cafe-afternoon",characterId:"best-friend",characterAssetUrl:"assets/characters/day4/jihoon-day4-cautious-greeting-v1.png"},
  d("지훈","너 슬슬 들어가야 되는 거 아니야?"),d("나","왜."),d("지훈","얼굴 피곤해 보여."),n("그 말을 듣고 나니 몸의 피로가 느껴졌다."),d("나","조금."),d("지훈","가자."),n("둘은 계산대 앞에 섰다."),cg("assets/events/day4/cg-day4-payment-card-receipt-pov-v1.png"),choice(DAY4_V3_PAYMENT_CHOICES)
];}

export function getDay4V3PaymentReaction(state){
  const id=state?.storyFlags?.day4PaymentStrategy;
  if(id==="payment_jihoon")return [d("지훈","오늘은 내가 산다."),d("나","왜."),d("지훈","퇴원 축하."),d("나","좀 늦지 않았어?"),d("지훈","1년 기다렸는데. 며칠 늦은 게 뭐."),n("잠시 말이 나오지 않았다.")];
  if(id==="payment_split")return [d("나","각자 내자."),n("지훈이 이상하다는 듯 봤다."),d("나","왜."),d("지훈","전에는 이런 거 대충 한 명이 냈는데."),d("나","지금은 이게 편해."),d("지훈","그럼 그렇게 해.")];
  return [d("나","내가 낼게."),d("지훈","네가?"),d("나","왜."),d("지훈","기억 잃더니 부자 됐냐."),d("나","내 돈 내가 쓰겠다는데."),d("지훈","이상한 데서 고집부리는 건 그대로네.")];
}

export function getDay4V3FarewellSegment(state){return [
  ...getDay4V3PaymentReaction(state),
  {type:"transition",style:"fade",label:"SCENE 15 · 다시 친구가 되는 법",backgroundId:"day4-station-cafe-afternoon",characterId:"best-friend",characterAssetUrl:"assets/characters/day4/jihoon-day4-cautious-greeting-v1.png"},
  n("카페 밖에서 지훈이 나를 바라봤다."),d("지훈","오늘 어땠어."),d("나","뭐가."),d("지훈","나 만난 거."),choice(DAY4_V3_REFLECTION_CHOICES)
];}

export function getDay4V3EndingSegment(state){
  const id=state?.storyFlags?.day4ReflectionStrategy;
  const reaction=id==="reflection_strange"?[d("나","넌 나를 너무 잘 아는데, 나는 널 오늘 처음 본 것 같잖아."),d("지훈","그러면 다시 친해지면 되지."),d("나","쉽게 말하네."),d("지훈","친구끼리는 원래 좀 쉬워.")]:id==="reflection_curious"?[d("지훈","뭐가."),d("나","나."),d("지훈","나르시시스트였나."),d("나","진지하게. 네가 아는 나랑 하은이가 아는 내가 조금 다른 것 같아."),d("지훈","그게 이상해?"),d("나","안 이상해?"),d("지훈","너도 나 만날 때랑 하은 만날 때랑 다르겠지. 둘 다 너였을 거야.")]:[d("나","좋았어. 나를 아는 사람이 하은 말고도 있다는 게 조금 안심됐어."),n("지훈은 잠시 아무 말도 못 했다."),d("지훈","야."),d("나","왜."),d("지훈","원래도 있었어."),d("나","나한테는 오늘 생겼지."),d("지훈","그럼 다시 시작하면 되겠네.")];
  return [...reaction,{type:"transition",style:"fade",label:"SCENE 16 · 친구 시스템 해금",backgroundId:"day4-station-cafe-afternoon"},{type:"systemUnlock",systemId:"friend-system",title:"FRIEND SYSTEM UNLOCKED",text:"과거 인간관계가 복원되기 시작했습니다"},n("과거 연락처 인덱스와 지훈 연락이 열렸다.",{unlockId:"past-contacts-index"}),{type:"transition",style:"fade",label:"DAY 4 · 밤",backgroundId:"day4-home-night"},n("집에 돌아온 뒤 업무용으로 보이는 새 메시지가 도착했다."),d("민호","복귀 절차와 현재 팀 상황, 내일 직접 설명드리겠습니다."),n("친구의 기억은 답이 아니라 또 하나의 관점으로 남았다."),{type:"sceneEnd"}];
}

export function applyDay4V3OpeningChoiceState(state,id){
  state.storyFlags??={};
  if(DAY4_V3_MORNING_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4MorningReply=id; state.storyFlags.day4V3RuntimeStage=1;
    if(id==="morning_awake_plain")state.trust=(state.trust??0)+1;
    if(id==="morning_flirt"){state.affection=(state.affection??0)+2;state.storyFlags.relationship_interest=(state.storyFlags.relationship_interest??0)+1;}
    if(id==="morning_who_are_you"){state.affection=(state.affection??0)+1;state.storyFlags.protagonist_playful=(state.storyFlags.protagonist_playful??0)+1;}
    return {stage:1};
  }
  if(DAY4_V3_CONTACT_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4ContactStrategy=id;state.storyFlags.jihoon_contacted=true;state.storyFlags[id]=true;state.storyFlags.day4V3RuntimeStage=2;
    if(id==="contact_haeun_crosscheck")state.trust=(state.trust??0)+1;
    return {stage:2};
  }
  if(DAY4_V3_FIRST_QUESTION_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4FirstQuestion=id;state.storyFlags.day4IdentityFocus=id;state.storyFlags.day4V3RuntimeStage=3;
    if(id==="identity_self")state.storyFlags.self_identity_interest=(state.storyFlags.self_identity_interest??0)+2;
    if(id==="identity_accident")state.storyFlags.accident_interest=(state.storyFlags.accident_interest??0)+1;
    return {stage:3};
  }
  if(DAY4_V3_DISCLOSURE_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4DisclosureStrategy=id;state.storyFlags.day4V3RuntimeStage=4;
    if(id!=="disclose_silent")state.trust=(state.trust??0)+2;
    if(id!=="disclose_ask_permission")state.storyFlags.independence=(state.storyFlags.independence??0)+1;
    if(id==="disclose_ask_permission")state.storyFlags.relationship_respect=(state.storyFlags.relationship_respect??0)+1;
    if(id==="disclose_silent")state.storyFlags.day4HaeunDisclosurePending=true;
    return {stage:4};
  }
  if(DAY4_V3_TASTE_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4TasteStrategy=id;
    if(id==="taste_current"){state.storyFlags.memory_discrepancy_01=true;state.storyFlags.current_preference=(state.storyFlags.current_preference??0)+1;}
    if(id==="taste_new_menu"){state.storyFlags.new_identity=(state.storyFlags.new_identity??0)+1;state.storyFlags.old_personality_match=(state.storyFlags.old_personality_match??0)+1;}
    state.storyFlags.day4V3RuntimeStage=id==="taste_old_order"?5:6;return {stage:state.storyFlags.day4V3RuntimeStage};
  }
  if(DAY4_V3_OLD_DRINK_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4OldDrinkReaction=id;state.storyFlags.day4V3RuntimeStage=6;
    const key=id==="old_drink_good"?"old_preference_acceptance":id==="old_drink_bad"?"new_identity":"identity_uncertainty";
    state.storyFlags[key]=(state.storyFlags[key]??0)+1;return {stage:6};
  }
  if(DAY4_V3_HAEUN_PAST_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4HaeunPastQuestion=id;state.storyFlags.day4V3RuntimeStage=7;
    if(id==="haeun_past_love"){state.storyFlags.haeun_past_affection_hint=(state.storyFlags.haeun_past_affection_hint??0)+2;state.storyFlags.relationship_interest=(state.storyFlags.relationship_interest??0)+1;}
    if(id==="haeun_past_conflict")state.storyFlags.past_conflict_interest=(state.storyFlags.past_conflict_interest??0)+1;
    if(id==="haeun_past_marriage")state.storyFlags.marriage_past_commitment=(state.storyFlags.marriage_past_commitment??0)+2;
    state.storyFlags.identity_perspective_awareness=true;return {stage:7};
  }
  if(DAY4_V3_PRE_ACCIDENT_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4AccidentQuestion=id;state.storyFlags.day4V3RuntimeStage=8;
    if(id==="accident_last_contact")state.storyFlags.jihoon_old_phone_search=true;
    if(id==="accident_behavior")state.storyFlags.pre_accident_busy_hint=(state.storyFlags.pre_accident_busy_hint??0)+1;
    if(id==="accident_haeun_problem")state.storyFlags.jihoon_trust=(state.storyFlags.jihoon_trust??0)+2;
    return {stage:8};
  }
  if(DAY4_V3_PAYMENT_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4PaymentStrategy=id;state.storyFlags.day4V3RuntimeStage=9;state.storyFlags.jihoon_bond=(state.storyFlags.jihoon_bond??0)+1;
    if(id==="payment_self"){state.money=Math.max(0,(state.money??0)-6000);state.storyFlags.old_personality_match=(state.storyFlags.old_personality_match??0)+1;}
    if(id==="payment_jihoon")state.storyFlags.jihoon_bond+=2;
    if(id==="payment_split"){state.money=Math.max(0,(state.money??0)-3000);state.storyFlags.new_identity=(state.storyFlags.new_identity??0)+1;}
    return {stage:9};
  }
  if(DAY4_V3_REFLECTION_CHOICES.some(x=>x.id===id)){
    state.storyFlags.day4ReflectionStrategy=id;state.storyFlags.day4V3RuntimeStage=10;
    if(id==="reflection_good")state.storyFlags.jihoon_bond=(state.storyFlags.jihoon_bond??0)+3;
    if(id==="reflection_strange")state.storyFlags.jihoon_bond=(state.storyFlags.jihoon_bond??0)+2;
    if(id==="reflection_curious")state.storyFlags.identity_perspective_awareness=(state.storyFlags.identity_perspective_awareness===true?0:(state.storyFlags.identity_perspective_awareness??0))+2;
    state.storyFlags.friend_system_unlocked=true;state.storyFlags.past_contacts_index=true;state.storyFlags.jihoon_contact_unlocked=true;state.storyFlags.day5_minho_hook=true;
    return {stage:10};
  }
  return null;
}
