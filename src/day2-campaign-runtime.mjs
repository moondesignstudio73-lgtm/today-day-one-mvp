const ID="m30-day2-rehabilitation";
const BG={bed:"day2-hospital-bedside",corridor:"day2-recovery-corridor",lobby:"day2-hospital-lobby",exit:"day2-hospital-exit",car:"day2-car-interior",outside:"day2-home-exterior",home:"day2-home-entry",room:"day2-bedroom"};
const H="assets/characters/day2/haeun/poses/",P="assets/props/day2/pov/",CG="assets/events/day2/",NPC="assets/npcs/day1/hq/";
export const DAY2_RUNTIME_OVERLAYS=Object.freeze({
  haeun:Object.freeze({
    "support-offer-open-palm":`${H}haeun-day2-pose-support-offer-open-palm-2d-v3.png`,
    "forearm-support-2d-v3":`${H}haeun-day2-pose-forearm-support-2d-v3.png`,
    "paced-walk-beside":`${H}haeun-day2-pose-paced-walk-beside-2d-v3.png`,
    "pack-and-present":`${H}haeun-day2-pose-pack-and-present-2d-v3.png`,
    "safe-driving-2d-v3":`${H}haeun-day2-pose-safe-driving-2d-v3.png`,
    "key-handover-step-aside":`${H}haeun-day2-pose-key-handover-step-aside-2d-v3.png`,
    "photo-side-inspection":`${H}haeun-day2-pose-photo-side-inspection-2d-v3.png`,
    "doorframe-permission-wait":`${H}haeun-day2-pose-doorframe-permission-wait-2d-v3.png`,
    "departing-open-wave":`${H}haeun-day2-pose-departing-open-wave-2d-v3.png`
  }),
  pov:Object.freeze({
    "bed-edge-prep-2d-v3":`${P}pov-day2-gesture-bed-edge-prep-2d-v3.png`,
    "rail-grip-release":`${P}pov-day2-gesture-rail-grip-release-2d-v3.png`,
    "document-receive":`${P}pov-day2-gesture-document-receive-2d-v3.png`,
    "key-inspect-unlock":`${P}pov-day2-gesture-key-inspect-unlock-2d-v3.png`,
    "family-photo-hold-2d-v2":`${P}pov-day2-gesture-family-photo-hold-2d-v2.png`,
    "couple-photo-turn":`${P}pov-day2-gesture-couple-photo-turn-2d-v3.png`,
    "search-interactions":`${P}pov-day2-gesture-search-interactions-2d-v3.png`,
    "small-key-classify":`${P}pov-day2-gesture-small-key-classify-2d-v3.png`,
    "three-column-note":`${P}pov-day2-gesture-three-column-note-2d-v3.png`,
    "spare-phone-contact":`${P}pov-day2-gesture-spare-phone-contact-2d-v3.png`
  })
});
const n=(text,extra={})=>({type:"narration",text,...extra});
const d=(speaker,text,expressionId="calm-attentive",extra={})=>({type:"dialogue",speaker,text,expressionId,...extra});
const tr=(label,backgroundId,extra={})=>({type:"transition",style:"fade",label,backgroundId,...extra});
const sprite=(name,expressionId="calm-attentive")=>({type:"characterEnter",characterId:"girlfriend",assetUrl:DAY2_RUNTIME_OVERLAYS.haeun[name],expressionId,animationId:"idle-breathe"});
const pov=name=>({type:"itemShow",layer:"npcFront",source:DAY2_RUNTIME_OVERLAYS.pov[name]});
const clearPov=()=>({type:"itemShow",layer:"npcFront",source:""});
const sfx=id=>({type:"sfx",sfxId:id});
const stop=id=>({type:"sfx",stopCueId:id});
const bgm=id=>({type:"animation",bgmCue:id});
const cg=(name,duration)=>({type:"cgShow",source:`${CG}${name}`,duration});
const choice=options=>({type:"choice",options});

export const LOCKED_DAY2_SCENE_ID=ID;
export const DAY2_MARRIAGE_CHOICES=Object.freeze([
  {id:"marriage_pause",label:"예정일은 멈추고 지금의 내가 다시 판단한다"},
  {id:"relationship_verify",label:"과거의 내가 왜 결혼하려 했는지 직접 확인한다"},
  {id:"present_impression",label:"결혼과 별개로 지금 보이는 호감을 말한다"}
]);
export const DAY2_HOME_CHOICES=Object.freeze([
  {id:"thank_for_waiting",label:"집을 지키고 기다린 구체적인 일에 감사한다"},
  {id:"set_home_boundary",label:"관리 범위와 열쇠 출처부터 함께 확인한다"},
  {id:"ask_if_never_woke",label:"깨어나지 않았다면 어땠을지 대답을 강요하지 않고 묻는다"}
]);
export const DAY2_TRAVEL_CHOICES=Object.freeze([
  {id:"admit_road_fear",label:"낯선 도로가 조금 무섭다고 인정하고 속도를 요청한다"},
  {id:"ask_past_self",label:"과거의 생활 습관 하나만 묻고 나머지는 집에서 확인한다"},
  {id:"ask_record_boundary",label:"사고 내용이 아니라 기록 신청 경로만 확인한다",requires:"accident_interest"}
]);
export const DAY2_PHOTO_CHOICES=Object.freeze([
  {id:"photo_relationship_open",label:"우리 사이가 좋아 보인다고 현재의 인상을 말한다"},
  {id:"photo_observation",label:"사진 속 내가 카메라가 아니라 하은을 본다는 점을 확인한다"},
  {id:"photo_verify_later",label:"사진 하나로 결론 내리지 않고 방의 흔적과 대조한다"}
]);
export const DAY2_SEARCH_CHOICES=Object.freeze([
  {id:"room_desk_checked",label:"책상과 메모를 확인한다"},{id:"pc_interest",label:"전원이 빠진 컴퓨터를 확인한다"},{id:"wardrobe_checked",label:"옷장을 확인한다"},{id:"friends_interest",label:"벽의 사진들을 확인한다"},{id:"unclassified_key_found",label:"서랍 속 물건을 확인한다"}
]);
export const DAY2_KEY_CHOICES=Object.freeze([{id:"key_log_only",label:"사진과 발견 위치만 기록한다"},{id:"key_test_visible_only",label:"방 안의 보이는 잠금만 훼손 없이 대조한다"}]);
export const DAY2_CONTACT_CHOICES=Object.freeze([{id:"contact_formal",label:"이하은"},{id:"contact_familiar",label:"하은"},{id:"contact_verify_playful",label:"여자친구(?)"}]);

export function normalizeDay2StoryFlags(state){
  state.storyFlags??={};const flags=state.storyFlags;
  flags.day2RuntimeStage??=0;flags.day2RoomSearches=Array.isArray(flags.day2RoomSearches)?[...new Set(flags.day2RoomSearches.filter(id=>DAY2_SEARCH_CHOICES.some(choice=>choice.id===id)))]:[];
  for(const key of ["family_question_first","accident_interest","recovery_focus","haeun_contact_unlocked"])flags[key]??=false;
  for(const key of ["day2MarriageStrategy","day2HomeStrategy","day2TravelStrategy","day2PhotoStrategy","day2PendingPhotoReaction","day2LastSearch","day2KeyStrategy","day2ContactStrategy"])flags[key]??=null;
  return flags;
}

const SEGMENT_0=[
  tr("DAY 2 · 30일 뒤",BG.bed),bgm("S01_CHOICE"),d("나","그러니까, 우리가 결혼하기로 했다고."),d("하은","응."),d("나","30일 뒤에."),d("하은","응."),d("나","대답이 자꾸 짧아지는데."),d("하은","길게 말하면 더 수상해 보일 것 같아서.","warm-playful"),d("나","그 판단도 조금 수상하고."),n("하은이 입술을 눌렀다가 결국 웃었다."),d("하은","네 입장에서는 그렇겠다. 눈 떴더니 1년 지났고, 처음 보는 여자가 여자친구라고 하고, 달력에는 결혼 날짜까지 있으니까."),d("나","부모님 이야기도 들었고."),d("하은","응. 그래서 날짜가 있다고 네 대답까지 정해진 건 아니야.","soft-vulnerable"),choice(DAY2_MARRIAGE_CHOICES)
];

function marriageReaction(id){
  if(id==="marriage_pause")return [d("나","결혼 날짜는 일단 멈추자. 과거의 내가 약속했어도 지금의 내가 다시 판단해야 해."),d("하은","알겠어. 기다린 시간으로 네 대답을 재촉하지 않을게."),d("나","괜찮아?"),d("하은","안 괜찮은 부분은 내가 감당할게. 네가 미안해서 결혼하는 것보다는 낫지.","soft-vulnerable")];
  if(id==="relationship_verify")return [d("나","과거의 나는 왜 너랑 결혼하려 했지?"),d("하은","내가 예뻐서.","warm-playful"),d("나","확인 가능한 답으로."),d("하은","그건 네가 찾아봐. 내가 모범 답안을 먼저 말하면 네 기억이 아니라 내 자기소개가 되잖아."),d("나","피하는 건 아니고?"),d("하은","집에 가면 네 물건부터 봐. 그래도 모르겠으면 그때 한 항목씩 대답할게.")];
  return [d("나","결혼은 모르겠지만, 지금 보이는 너는 호감이 가."),d("하은","기억 잃더니 사람이 솔직해졌네.","warm-playful"),d("나","원래도 그랬다며."),d("하은","나한테만. 그 말은 반갑게 받을게. 결혼 승낙으로 접수는 안 하고.")];
}

function contactCallback(state){const f=state.storyFlags??{};if(f.contact_boundary)return [d("하은","팔꿈치 아래 받쳐도 돼? 당기지는 않을게."),d("나","받치기만 해 줘.")];if(f.contact_acceptance)return [d("하은","잡을래, 손잡이 쓸래?"),d("나","손잡이. 옆에만 있어 줘.")];return [d("하은","이하은, 오른쪽 대기 중. 필요하면 이름 불러."),d("나","설명은 정확하네. 오른쪽에서 받쳐 줘.")];}

function segment1(state){const recovery=state.storyFlags?.recovery_focus;return [
  ...marriageReaction(state.storyFlags?.day2MarriageStrategy),d("하은","오늘은 네가 서는 것부터. 30일은 달아나지 않아."),
  tr("SCENE 02 · 내 몸의 거리",BG.corridor),sfx("AMB_HOSPITAL_CORRIDOR_DAY"),bgm("S02_STAND"),pov("bed-edge-prep-2d-v3"),n("주인공은 침대 가장자리에 앉아 발바닥을 바닥에 붙였다. 일어서기 전 손잡이와 호출 버튼의 위치를 먼저 확인했다."),
  ...(recovery?[d("나","어지럼 다섯 이상이면 앉고, 새 통증이 있으면 중단. 어제 들은 기준 그대로지?"),d("하은","응. 오늘은 내가 먼저 외우고 왔어. 혼자 시험하지 않기까지 포함.")]:[d("하은","일어나기 전에 오늘 중단 기준부터 말해 볼래?"),d("나","어지럼, 호흡 곤란, 새 통증. 셋 중 하나면 멈춘다.")]),
  n("손잡이를 잡고 일어서자 무릎은 버텼지만 시야 가장자리가 좁아졌다."),d("나","잠깐. 어지럼이 올라온다."),sprite("support-offer-open-palm"),...contactCallback(state),sprite("forearm-support-2d-v3"),n("하은은 요청한 위치만 받쳤다. 다시 앉자 물병을 내밀지 않고 가까운 탁자 위에 놓았다."),d("하은","혼자 걷겠다는 첫 시도, 결과는?"),d("나","실패가 아니라 기준 확인. 지금은 혼자 세 걸음이 한계라는 뜻이야."),d("하은","그 말 재활 선생님이 들으면 좋아하겠다. 나는 조금 덜 놀라고.","warm-playful"),pov("rail-grip-release"),sfx("SFX_RAIL_GRIP_RELEASE"),n("둘은 복도 끝까지 천천히 걸었다. 하은은 걸음 수만 세고 속도를 재촉하지 않았다."),clearPov(),
  tr("SCENE 03 · 돌아가도 되는 조건",BG.bed),{type:"itemShow",layer:"npcFront",source:`${NPC}doctor-record-and-explain-2d-v2.png`},{type:"itemShow",layer:"npcRear",source:`${NPC}nurse-safety-guidance-2d-v2.png`},d("담당 의사","검사 결과만 보면 귀가 조건은 충족했습니다. 기억이나 몸이 완전히 회복됐다는 뜻은 아닙니다."),d("나","집에 가는 게 기억 회복에 실제로 도움이 됩니까?"),d("담당 의사","익숙한 환경이 단서가 될 수는 있지만 떠오른 느낌이 정확한 기억은 아닐 수 있습니다."),d("나","그러면 본 것, 들은 설명, 떠오른 장면을 구분해 적겠습니다."),d("담당 의사","좋습니다. 두통·새 어지럼·혼란이 심해지면 조사를 멈추세요."),
  ...(state.storyFlags?.accident_interest?[d("나","사고 경위 기록은 병원 기록과 별도로 신청하는 거죠?"),d("담당 의사","그렇습니다. 요청 경로만 퇴원 서류에 적어 두겠습니다.")]:[]),...(state.storyFlags?.family_question_first?[d("나","가족사진을 알아보지 못해도 이상한 반응은 아닙니까?"),d("담당 의사","사진을 알아보지 못하는 것과 가족을 사랑하지 않았던 것은 같은 말이 아닙니다.")]:[]),pov("document-receive"),sfx("SFX_DOCUMENT_RECEIVE"),d("간호사","휴대폰은 보안 해제 확인이 남아 다음 인계 때 돌려드립니다. 오늘은 이 서류만 보관해 주세요."),d("하은","서류 담당은 누가 할까요?"),d("나","내가 들고 갈게. 네가 필요할 때만 위치를 알려 줘."),clearPov(),{type:"itemShow",layer:"npcFront",source:""},{type:"itemShow",layer:"npcRear",source:""},
  tr("SCENE 04 · 돌아갈 집",BG.bed),sprite("pack-and-present"),sfx("SFX_BAG_ZIPPER"),d("나","내가 살던 곳은 어디야?"),d("하은","부모님과 살던 집. 지금은 비어 있어."),d("나","그동안은?"),d("하은","일주일에 한 번쯤 환기하고 우편물 모아 뒀어. 냉장고 음식은 버렸고, 네 물건은 가능한 그대로 뒀고."),d("나","열쇠는 왜 네가 가지고 있어?"),d("하은","사고 전부터 네가 맡겼어. 내가 그렇게 주장하는 거고, 집에 들어가면 여분 열쇠 둔 자리부터 네가 확인해."),choice(DAY2_HOME_CHOICES)
];}

function homeReaction(id){if(id==="thank_for_waiting")return [d("나","집을 지킨 것, 돌아올 자리를 남긴 것. 고마워."),d("하은","기억도 없는 사람이 그렇게 말하면 좀 반칙인데."),d("나","기억이 아니라 지금 확인한 일에 감사하는 거야."),d("하은","그럼 받을게. 그 말은 지금 네가 한 거니까.","warm-playful")];if(id==="set_home_boundary")return [d("나","버린 것, 옮긴 것, 들어온 범위를 집에서 같이 확인하자. 열쇠 출처도."),d("하은","좋아. 우편물 상자랑 버린 물건 목록부터 보여 줄게. 불편한 건 오늘 바로 돌려받고."),d("나","기분 나쁘지는 않아?"),d("하은","조금. 그래도 내 기분보다 네 집이 먼저지.")];return [d("나","내가 안 깨어났으면, 언제까지 관리하려고 했어?"),d("하은","그 질문에는 오늘 답하고 싶지 않아.","soft-vulnerable"),d("나","알겠어. 대답을 요구하는 건 아니야."),d("하은","……일어났잖아. 오늘은 그다음만 생각하자.")];}

function segment2(state){const travel=DAY2_TRAVEL_CHOICES.filter(c=>!c.requires||state.storyFlags?.[c.requires]);return [
  ...homeReaction(state.storyFlags?.day2HomeStrategy),sprite("key-handover-step-aside"),d("하은","문은 네가 열어. 나는 길만 안내할게."),
  tr("SCENE 05 · 병원 밖",BG.lobby),stop("AMB_HOSPITAL_CORRIDOR_DAY"),sfx("AMB_HOSPITAL_LOBBY_DAY"),bgm("S05_EXIT"),sfx("SFX_AUTO_DOOR"),n("자동문이 열리자 바람과 엔진 소리, 횡단보도 안내음이 한꺼번에 들어왔다. 주인공은 문턱 앞에서 멈췄다."),d("하은","어지러워?"),d("나","아니. 정보가 많아."),d("하은","차는 지하에 있어. 여기서 기다리면 내가 가져올게."),d("나","같이 갈게. 힘들면 말하겠어."),d("하은","좋아. 대신 속도는 내가 아니라 네가 정해."),sprite("paced-walk-beside"),n("첫걸음은 짧았고 두 번째부터 같은 간격을 찾았다. 처음 보는 세상이 아니라 내가 없는 동안 계속 움직였던 세상이었다."),
  tr("SCENE 06 · 차 안",BG.car),stop("AMB_HOSPITAL_LOBBY_DAY"),sfx("AMB_CAR_INTERIOR_DAY"),sfx("SFX_SEATBELT_CLICK"),sprite("safe-driving-2d-v3"),d("하은","온도 괜찮아? 멀미하면 바로 말하고."),d("나","내가 원래 멀미했어?"),d("하은","차에서는 안 했고, 내가 운전하면 잔소리는 했어.","warm-playful"),d("나","검증해 볼 기회가 왔네."),sfx("SFX_TURN_SIGNAL"),n("하은은 앞을 보며 천천히 차선을 바꿨다. 주인공은 교차로의 차량을 오래 보았다."),d("하은","무서워?"),choice(travel)
];}

function travelReaction(id){if(id==="admit_road_fear")return [d("나","조금. 도로가 아니라 내가 어떻게 반응할지 모르는 게."),d("하은","그럴 만하지. 다음 신호에서 잠깐 쉬어 갈까?"),d("나","속도만 지금처럼 유지해 줘. 상태는 내가 말할게."),d("하은","알겠습니다, 동승자님.","warm-playful")];if(id==="ask_record_boundary")return [d("나","사고 장소를 묻는 게 아니야. 기록 신청은 병원 서류에 적힌 곳으로 하면 돼?"),d("하은","응. 집에 도착하면 서류를 네 책상에 두자. 오늘 읽을지는 네가 정하고."),d("나","네가 아는 경위는 지금 말하지 마."),d("하은","알겠어. 네가 확인하기 전에는 내가 아는 순서로 채우지 않을게.")];return [d("나","나 원래 집에 가면 제일 먼저 뭘 했어?"),d("하은","열쇠를 아무 데나 두고 찾았어.","warm-playful"),d("나","그다음은?"),d("하은","그건 집에서 네가 먼저 해 봐. 내가 말하면 오늘도 따라 할 것 같아서."),d("나","설명 NPC 역할을 거부하는군."),d("하은","급여를 못 받았거든.","warm-playful")];}

function segment3(state){return [
  ...travelReaction(state.storyFlags?.day2TravelStrategy),d("하은","집이 기억 안 나도 너무 실망하지 마."),d("나","기억나는 척은 안 할게. 대신 확인할 건 확인하고."),
  tr("SCENE 07 · 문턱",BG.outside),stop("AMB_CAR_INTERIOR_DAY"),bgm("S07_THRESHOLD"),sprite("key-handover-step-aside"),d("하은","여기야."),d("나","내 집."),d("하은","응."),d("나","네가 열면 더 빠르지 않아?"),d("하은","빠른 게 목적 아니잖아."),pov("key-inspect-unlock"),sfx("SFX_HOME_KEY_UNLOCK"),n("열쇠의 흠집 방향을 살폈다. 세 번째 시도에 잠금이 풀렸다."),d("하은","그건 예전에도 두 번 틀렸어.","warm-playful"),d("나","위로가 안 되는데."),d("하은","기억보다 먼저 습관이 돌아온 걸 수도 있지."),d("나","아니면 열쇠가 불친절하거나."),cg("cg-day2-home-threshold-v2.png",3600),d("하은","네가 먼저 들어가. 나는 불만 켤게. 허락하면."),d("나","켜 줘."),sfx("AMB_HOME_QUIET_AFTERNOON"),sfx("SFX_LIGHT_SWITCH"),clearPov(),
  tr("SCENE 08 · 남아 있는 것들",BG.home),n("신발장, 소파, 식탁, 책장의 위치를 차례로 봤다. 익숙함은 오지 않았지만 무엇부터 확인할지는 정할 수 있었다."),d("하은","오늘 다 볼 필요 없어."),d("나","네 설명보다 내가 먼저 보고, 모르는 것만 묻겠어."),d("하은","좋아. 나는 부엌에 물 올려 둘게. 부르면 오고, 안 부르면 안 끼어들고."),bgm("S08_FAMILY_PHOTO"),sfx("SFX_PHOTO_FRAME"),cg("cg-day2-family-photo-v1.png",3000),pov("family-photo-hold-2d-v2"),n(state.storyFlags?.family_question_first?"죽었다는 사실은 이미 들었다. 이제 얼굴을 알았다. 기억난 것은 아직 없다.":"이 사람들이 부모님이라는 설명을 들었다. 사진은 설명과 맞아 보이지만 내 기억은 아니다."),d("나","이 사진, 어디서 찍었는지 알아?"),sprite("photo-side-inspection"),d("하은","정확히는 몰라. 네가 부모님 댁에서 가져왔다고만 했어."),d("나","모르면 모른다고 하는 건 좋네."),d("하은","여자친구 신뢰도 적립됐습니까?","warm-playful"),d("나","소액."),n("아무것도 떠오르지 않는다는 것도 기록해야 할 결과다."),d("하은","오늘 안 떠올라도 괜찮아. 내일도 있고 그다음 날도 있어."),d("나","30일밖에 없다며."),d("하은","그건 결혼까지고.","warm-playful"),d("나","그게 더 문제 아닌가."),d("하은","그러게. 그래서 날짜보다 네 속도가 먼저라고 했잖아."),clearPov(),sfx("SFX_PHOTO_FRAME"),cg("cg-day2-couple-photo-v1.png",2800),pov("couple-photo-turn"),d("나","이건 언제야?"),d("하은","여행 갔을 때."),d("나","어디로?"),d("하은","바다. 정확한 장소는 사진 뒷면부터 보자. 내가 틀리게 말하면 내 설명이 먼저 남을 테니까."),n("사진 뒤에는 날짜만 있었고 장소는 적혀 있지 않았다."),choice(DAY2_PHOTO_CHOICES)
];}

function photoReaction(id){if(id==="photo_relationship_open")return [d("나","우리 사이, 좋아 보이네."),d("하은","좋았지."),d("나","과거형?"),d("하은","현재진행형이라고 하면 부담스러울까 봐."),d("나","사진이 보여 주는 건 그날까지겠지. 오늘은 오늘대로 보고 있고."),d("하은","그 정도면 충분해.")];if(id==="photo_observation")return [d("나","사진 속 나는 카메라가 아니라 너를 보고 있어."),d("하은","그러네. 사진 찍을 때는 몰랐어."),d("나","관계의 증거 후보. 지금 감정의 증명은 아니고."),d("하은","채점 엄격하네. 그래도 후보에는 들어갔으니 됐다.","warm-playful")];return [d("나","이 사진 하나로 결론 내리지는 않을게. 내 방에 비슷한 흔적이 있는지 더 보자."),d("하은","좋아. 사진은 네 거니까 가져가도 되고 여기 둬도 돼."),d("나","일단 원래 자리에 둘게.")];}

const SEARCH_REACTIONS={
  room_desk_checked:[n("메모지에는 장보기 목록과 날짜, 병원 예약 번호가 적혀 있었다."),d("나","내 글씨겠지?"),d("하은","응. 알아보기 힘든 것도 그대로네."),d("나","내 글씨를 기억하는 사람한테 평가받으니 묘하네."),d("하은","이건 약국 선생님도 증언할걸.","warm-playful")],
  pc_interest:[n("전원 버튼은 반응하지 않았다. 멀티탭 플러그가 빠져 있었다."),d("나","전원을 뽑아 놨네."),d("하은","1년 동안 안 쓰는 걸 계속 꽂아 둘 이유는 없잖아. 파일은 손대지 않았어."),d("나","비밀번호도 모르고?"),d("하은","알아도 네 허락 없이 열지는 않았을 거야. 나중에 네가 직접 확인해.")],
  wardrobe_checked:[n("옷은 계절별로 정리돼 있었다. 무난한 셔츠 하나를 꺼냈다."),d("나","취향은 나쁘지 않았네."),d("하은","몇 벌은 내가 골랐거든.","warm-playful"),d("나","그럼 내 취향 증거에서는 제외."),d("하은","너무하네. 잘 어울린다는 증거로는 넣어 줘.")],
  friends_interest:[n("친구들과 찍은 사진, 하은과 찍은 사진, 장소를 알 수 없는 단체 사진이 섞여 있었다."),d("나","이 사람들은 누구야?"),d("하은","친구들. 모두와 지금도 연락하는지는 나도 정확히 몰라."),d("나","아는 사람부터 골라 말하지 마. 연락처가 돌아오면 대조할게."),d("하은","응. 그편이 정확해.")]
};

function searchChoice(state){const done=new Set(state.storyFlags?.day2RoomSearches??[]);return choice(DAY2_SEARCH_CHOICES.filter(c=>!done.has(c.id)));}
function segment4(state){const out=[];if(state.storyFlags?.day2PendingPhotoReaction){out.push(...photoReaction(state.storyFlags.day2PendingPhotoReaction),clearPov(),tr("SCENE 09 · 내 방",BG.room),sprite("doorframe-permission-wait"),d("나","어느 문인지 전혀 모르겠어."),d("하은","저기. 열어 볼지는 네가 정하고."),n("침대, 책상, 옷장, 전원이 빠진 컴퓨터, 벽의 사진이 차례로 드러났다."),d("나","생각보다 평범하네."),d("하은","비밀 연구실이라도 기대했어?","warm-playful"),d("나","조금."),d("하은","컴퓨터 앞에서 게임하다 밤새는 연구원이면 비슷하긴 하다."),d("나","나 게임 많이 했어?"),d("하은","조금."),d("나","조금?"),d("하은","많이.","warm-playful"),n("하은은 문 옆에 서서 안으로 먼저 들어오지 않았다."));}const last=state.storyFlags?.day2LastSearch;if(last==="unclassified_key_found"&&state.storyFlags?.day2KeyStrategy)out.push(...keyReaction(state.storyFlags.day2KeyStrategy));else if(last)out.push(...(SEARCH_REACTIONS[last]??[]));out.push(pov("search-interactions"),searchChoice(state));return out;}

function keySegment(){return [sfx("SFX_DRAWER_OPEN"),pov("small-key-classify"),n("영수증, 오래된 이어폰, 건전지 사이에 라벨 없는 작은 열쇠가 있었다."),d("나","이 열쇠 용도 알아?"),d("하은","모르겠어. 처음 봐."),d("나","그럼 단서가 아니라 미분류 물건으로 둔다."),choice(DAY2_KEY_CHOICES)];}
function keyReaction(id){return id==="key_log_only"?[n("작은 열쇠의 사진과 발견 위치만 기록했다. 용도는 미확인으로 남겼다.")]:[n("방 안에서 눈에 보이는 잠금만 훼손 없이 대조했다. 맞는 곳은 없었고 용도는 미확인으로 남았다.")];}

function segment5(state){const last=state.storyFlags?.day2LastSearch;const key=state.storyFlags?.day2KeyStrategy;return [
  ...(last==="unclassified_key_found"&&key?keyReaction(key):(SEARCH_REACTIONS[last]??[])),clearPov(),n("세 번째 탐색을 마쳤다. 나머지는 피로가 가신 뒤 다시 확인하기로 했다."),
  tr("SCENE 10 · 오늘은 여기까지",BG.room),n("침대 가장자리에 앉자 다리의 힘이 빠지고 호흡이 조금 빨라진 것을 스스로 확인했다."),d("나","별로 한 것도 없는데 지치네."),d("하은","집에 온 것, 방까지 걸은 것, 세 개 확인한 것. 오늘 기준으로는 많이 했어."),d("나","그 말로 자존심이 회복되지는 않는데."),d("하은","자존심은 내일 재활 목록에 추가해 둘게.","warm-playful"),pov("three-column-note"),sfx("SFX_PENCIL_NOTE"),bgm("S10_THREE_COLUMNS"),d("나","확인한 것. 네가 말한 것. 아직 모르는 것."),d("하은","내 이름은 어느 칸인데?"),d("나","확인한 것. 관계는 아직 네가 말한 것."),d("하은","좋아. 그 칸 옮기는 건 내가 재촉하지 않을게.","soft-vulnerable"),clearPov(),
  tr("SCENE 11 · 연락할 방법",BG.home),sprite("departing-open-wave"),d("나","오늘 어디서 자?"),d("하은","내 집. 왜, 같이 살았으면 좋겠어?","warm-playful"),d("나","생활 범위를 확인한 거야."),d("하은","아쉽네. 대답은 아니야. 우리는 같이 살지는 않았어."),d("나","무슨 일 있으면 어떻게 연락하지? 내 휴대폰은 아직 병원에 있고."),d("하은","임시 유심 넣은 예비 폰이야. 내 번호랑 병원 번호만 저장해 둘게. 네 휴대폰은 인계 확인 끝나면 네가 직접 받아."),pov("spare-phone-contact"),sfx("SFX_SPARE_PHONE_KEY"),choice(DAY2_CONTACT_CHOICES)
];}

function endingSegment(state){const id=state.storyFlags?.day2ContactStrategy;const reaction=id==="contact_formal"?[d("나","지금은 이하은으로 됐어."),d("하은","조금 딱딱하지만 확인된 이름이긴 하지.")]:id==="contact_familiar"?[n("성 한 글자를 지우자 하은이 화면을 보고 작게 웃었다."),d("하은","그게 좀 낫네.","warm-playful"),d("나","한 글자 줄인 것뿐이야."),d("하은","그 한 글자는 내가 알아서 좋아할게.")]:[d("하은","물음표 뭐야.","warm-playful"),d("나","아직 검증 중."),d("하은","좋아. 검증 끝날 때까지 내가 느낌표로 바꾸지는 않을게.")];return [
  ...reaction,clearPov(),d("하은","증상 생기면 먼저 병원. 심심하면 나. 순서 바꾸지 말고."),sprite("departing-open-wave"),sfx("SFX_FRONT_DOOR_CLOSE"),
  tr("SCENE 12 · DAY 2 END",BG.home),bgm("S12_RESOLVE"),n("현관문이 닫혔다. 꺼진 컴퓨터, 벽의 사진, 아직 열지 않은 서랍과 문들이 복도 너머로 이어졌다."),d("나","내 집인데 처음 와 본 집 같다."),n("그래도 기억이 돌아오기를 가만히 기다릴 필요는 없다."),n("가족사진, 두 사람의 사진, 병원 보관품 인계서를 차례로 보았다."),n("확인한 것과 들은 말을 나누고, 남아 있는 걸 하나씩 찾는다."),cg("cg-day2-three-column-resolve-v2.png",4600),bgm("S12_END"),stop("AMB_HOME_QUIET_AFTERNOON"),tr("DAY 2 END",BG.home),{type:"sceneEnd"}
];}

function addMetric(state,key,amount){if(state.scenario?.enabled&&Number.isFinite(state.scenario[key]))state.scenario[key]=Math.max(0,state.scenario[key]+amount);}
function remember(state,id){state.storyFlags??={};state.storyFlags[id]=true;}

export function getLockedDay2Segment(state,stage=normalizeDay2StoryFlags(state).day2RuntimeStage){normalizeDay2StoryFlags(state);if(stage===0)return structuredClone(SEGMENT_0);if(stage===1)return segment1(state);if(stage===2)return segment2(state);if(stage===3)return segment3(state);if(stage==="key")return keySegment();if(stage===4)return segment4(state);if(stage===5)return segment5(state);return endingSegment(state);}

export function getLockedDay2ResumePresentation(state){
  const stage=normalizeDay2StoryFlags(state).day2RuntimeStage;
  if(stage===1)return {backgroundId:BG.bed,characterAssetUrl:DAY2_RUNTIME_OVERLAYS.haeun["pack-and-present"]};
  if(stage===2)return {backgroundId:BG.bed,characterAssetUrl:DAY2_RUNTIME_OVERLAYS.haeun["pack-and-present"]};
  if(stage===3)return {backgroundId:BG.car,characterAssetUrl:DAY2_RUNTIME_OVERLAYS.haeun["safe-driving-2d-v3"]};
  if(stage===4&&state.storyFlags?.day2PendingPhotoReaction)return {backgroundId:BG.home,characterAssetUrl:DAY2_RUNTIME_OVERLAYS.haeun["photo-side-inspection"]};
  if(stage===4||stage==="key"||stage===5)return {backgroundId:BG.room,characterAssetUrl:DAY2_RUNTIME_OVERLAYS.haeun["doorframe-permission-wait"]};
  if(stage>=6)return {backgroundId:BG.home,characterAssetUrl:DAY2_RUNTIME_OVERLAYS.haeun["departing-open-wave"]};
  return {backgroundId:BG.bed,characterAssetUrl:DAY2_RUNTIME_OVERLAYS.haeun["pack-and-present"]};
}

export function applyLockedDay2ChoiceState(state,id){normalizeDay2StoryFlags(state);
  if(DAY2_MARRIAGE_CHOICES.some(c=>c.id===id)){state.storyFlags.day2MarriageStrategy=id;remember(state,id);state.storyFlags.day2RuntimeStage=1;addMetric(state,id==="relationship_verify"?"investigation":id==="present_impression"?"haeunAffection":"haeunTrust",id==="relationship_verify"?1:2);return {stage:1};}
  if(DAY2_HOME_CHOICES.some(c=>c.id===id)){state.storyFlags.day2HomeStrategy=id;remember(state,id);state.storyFlags.day2RuntimeStage=2;addMetric(state,id==="thank_for_waiting"?"haeunAffection":id==="set_home_boundary"?"investigation":"haeunTrust",id==="ask_if_never_woke"?1:2);return {stage:2};}
  if(DAY2_TRAVEL_CHOICES.some(c=>c.id===id)&&(!DAY2_TRAVEL_CHOICES.find(c=>c.id===id).requires||state.storyFlags.accident_interest)){state.storyFlags.day2TravelStrategy=id;remember(state,id);state.storyFlags.day2RuntimeStage=3;addMetric(state,id==="ask_record_boundary"?"investigation":"haeunTrust",2);return {stage:3};}
  if(DAY2_PHOTO_CHOICES.some(c=>c.id===id)){state.storyFlags.day2PhotoStrategy=id;state.storyFlags.day2PendingPhotoReaction=id;remember(state,id);state.storyFlags.day2RuntimeStage=4;return {stage:4};}
  if(DAY2_SEARCH_CHOICES.some(c=>c.id===id)){const list=state.storyFlags.day2RoomSearches??=[];if(list.includes(id))return null;state.storyFlags.day2RoomSearches=[...list,id];state.storyFlags.day2PendingPhotoReaction=null;state.storyFlags.day2LastSearch=id;remember(state,id);addMetric(state,"homeSearchCount",1);if(id==="unclassified_key_found"){state.storyFlags.day2RuntimeStage="key";return {stage:"key"};}state.storyFlags.day2RuntimeStage=state.storyFlags.day2RoomSearches.length>=3?5:4;return {stage:state.storyFlags.day2RuntimeStage};}
  if(DAY2_KEY_CHOICES.some(c=>c.id===id)){state.storyFlags.day2KeyStrategy=id;remember(state,id);addMetric(state,id==="key_log_only"?"investigation":"memoryRecovery",1);state.storyFlags.day2RuntimeStage=(state.storyFlags.day2RoomSearches?.length??0)>=3?5:4;return {stage:state.storyFlags.day2RuntimeStage};}
  if(DAY2_CONTACT_CHOICES.some(c=>c.id===id)){state.storyFlags.day2ContactStrategy=id;state.storyFlags.haeun_contact_unlocked=true;remember(state,id);addMetric(state,id==="contact_familiar"?"haeunAffection":"haeunTrust",1);state.storyFlags.day2RuntimeStage=6;return {stage:6};}
  return null;
}

export function getLockedDay2LegacyChoice(state){if(state.storyFlags?.contact_acceptance)return "take-her-hand";if(state.storyFlags?.contact_boundary)return "use-the-rail";return "review-the-plan";}
export function validateLockedDay2Runtime(){const sample={storyFlags:{contact_boundary:true,family_question_first:true,accident_interest:true,day2MarriageStrategy:"marriage_pause",day2HomeStrategy:"set_home_boundary",day2TravelStrategy:"ask_record_boundary",day2PhotoStrategy:"photo_observation",day2PendingPhotoReaction:"photo_observation",day2RoomSearches:["room_desk_checked","pc_interest","wardrobe_checked"],day2LastSearch:"wardrobe_checked",day2ContactStrategy:"contact_formal"}};const all=[...SEGMENT_0,...segment1(sample),...segment2(sample),...segment3(sample),...segment4(sample),...keySegment(),...segment5(sample),...endingSegment(sample)];return all.filter(x=>x.type==="transition").length>=13&&all.filter(x=>x.type==="dialogue").length>=90&&all.filter(x=>x.type==="cgShow").length===4&&!JSON.stringify(all).includes("D-29")&&!JSON.stringify(all).includes("가짜 하은")&&DAY2_SEARCH_CHOICES.length===5;}

export function validateLockedDay2StateMachine(){
  const allowed=new Set(["transition","narration","dialogue","characterEnter","itemShow","sfx","animation","cgShow","choice","sceneEnd"]),validSegment=segment=>segment.length>0&&segment.every(step=>allowed.has(step.type))&&["choice","sceneEnd"].includes(segment.at(-1).type);
  const state={storyFlags:{family_question_first:false,accident_interest:false,recovery_focus:false},scenario:{enabled:true,investigation:0,memoryRecovery:0,haeunAffection:0,haeunTrust:0,homeSearchCount:0}};normalizeDay2StoryFlags(state);
  const route=[DAY2_MARRIAGE_CHOICES[0].id,DAY2_HOME_CHOICES[0].id,DAY2_TRAVEL_CHOICES[0].id,DAY2_PHOTO_CHOICES[0].id,"room_desk_checked","pc_interest","wardrobe_checked",DAY2_CONTACT_CHOICES[0].id];
  if(!validSegment(getLockedDay2Segment(state)))return false;
  for(const id of route){const result=applyLockedDay2ChoiceState(state,id);if(!result||!validSegment(getLockedDay2Segment(state,result.stage)))return false;}
  if(state.storyFlags.day2RuntimeStage!==6||getLockedDay2Segment(state,6).at(-1)?.type!=="sceneEnd")return false;
  const keyState={storyFlags:{accident_interest:true},scenario:{enabled:true,investigation:0,memoryRecovery:0,haeunAffection:0,haeunTrust:0,homeSearchCount:0}};normalizeDay2StoryFlags(keyState);for(const id of [DAY2_MARRIAGE_CHOICES[1].id,DAY2_HOME_CHOICES[1].id,"ask_record_boundary",DAY2_PHOTO_CHOICES[1].id,"unclassified_key_found",DAY2_KEY_CHOICES[0].id,"friends_interest","wardrobe_checked",DAY2_CONTACT_CHOICES[1].id]){const result=applyLockedDay2ChoiceState(keyState,id);if(!result||!validSegment(getLockedDay2Segment(keyState,result.stage)))return false;}return keyState.storyFlags.day2RuntimeStage===6;
}
