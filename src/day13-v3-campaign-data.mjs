export const DAY13_V3_VERSION="NOTION_V3";
export const DAY13_V3_SCENARIO_ID="m30-day13-to-someone-who-does-not-know-v3";

const freeze=value=>Object.freeze(value);
const scene=(number,title,act,location)=>freeze({number,id:`day13-v3-scene-${String(number).padStart(2,"0")}`,title,act,location});
const option=(id,label,effects)=>freeze({id,label,effects:freeze(effects)});
const choice=(number,sceneNumber,title,options,extra={})=>freeze({number,sceneNumber,title,options:freeze(options),...extra});

export const DAY13_V3_CHAPTER_CONTRACT=freeze({
  id:DAY13_V3_SCENARIO_ID,day:13,title:"모르는 사람에게는",chapterType:"현재 정체성·사진 산책·관계 정직성",
  windows:freeze(["오전","낮","점심 이후","저녁","밤"]),
  locations:freeze(["나의 방","동네","성수역","서울숲 러닝코스","프로틴 카페"]),
  participants:freeze(["주인공","하은","아라"]),
  prerequisites:freeze(["DAY12_V3_COMPLETE","DAY12_OUTING_PLAN_RESELECTABLE","RECOVERY_LIMITS_REMAIN","HAEUN_CONTACT_AVAILABLE"]),
  previousChoiceReferences:freeze(["DAY12_DAY13_PLAN","DAY12_SEOJIN_AFFECTION","DAY12_SEOJIN_STATUS_INTEREST","DAY12_SEOJIN_PERSONAL_INVITATION","DAY12_HAEUN_DISCLOSURE_STATE"]),
  dramaticPurpose:"과거를 모르는 사람 앞에서 설명 의무가 줄어드는 편안함을 경험하되, 지금 이어 가는 관계까지 지워 새 사람인 척할지는 플레이어가 행동과 말로 선택하게 한다.",
  characterWants:freeze({
    protagonist:"오늘 자기 눈이 머문 것을 남기고, 새 사람에게 말할 현재의 자신과 하은에게 전할 사실의 범위를 스스로 정한다.",
    haeun:"새 만남 자체를 통제하지 않으면서, 자신에게 말하는 주인공과 상대에게 말하는 주인공이 지나치게 달라지지 않기를 바란다.",
    ara:"사진 산책의 우연을 가볍게 나누되 촬영·연락·시간을 서로 강요하지 않고 자기 일정과 독립성을 지킨다."
  }),
  informationBudget:freeze({
    mustReveal:freeze(["서울숲 실제 방문 경로에만 아라가 등장한다","촬영 동의와 사진 전달·공개 권한은 서로 다르다","아라의 낮은 연락 우선순위와 주인공의 기다림 성향은 처음부터 완전히 맞지 않는다","하은에게 한 보고와 아라에게 한 관계 소개의 차이는 저장된다","과거를 설명하지 않는 자유와 현재 관계를 없던 일로 만드는 선택은 다르다"]),
    mayReveal:freeze(["실패한 사진도 현재의 기억이 될 수 있다","아라에게 현재 일을 간단히 소개할 수 있다","하은은 자기 책상과 컵 사진을 먼저 보낸다","하은은 자기 책상에 둘 꽃을 보고 싶어 한다"]),
    mustNotReveal:freeze(["하은의 정체 진실","사고 원인 또는 범인","아라를 운명적 정답으로 확정","새 만남을 외도로 자동 확정","기억 회복 또는 치유 효과","DAY14 공동 꽃 선물 확정","윤서진의 관심 상태 소거","잠금 프로필"])
  }),
  emotionalCurve:freeze(["피로가 남은 조용한 아침","사진 실패의 생활 코미디","과거를 모르는 사람의 가벼움","말하지 않아도 되는 안도","초상 동의와 현재 얼굴의 낯섦","다음 만남·연락의 현실적 거리","하은을 소개하는 책임","하은에게 말할 범위의 긴장","서로의 풍경을 보내는 온기 또는 생각할 거리","현재 얼굴과 관계가 함께 남는 밤"]),
  targetPlayMinutes:"25-35 manuscript estimate; no-meet and early-exit routes require reading measurement",
  followUpHook:"Haeun plans to look at flowers for her own desk; DAY14 remains independently sourced"
});

export const DAY13_V3_VOICE_PROFILES=freeze({
  protagonist:freeze({rhythm:"짧고 구체적인 존댓말과 건조한 반응",humor:"쓰레기통·증명사진·느린 답장을 사실처럼 받아 웃음",reasoning:"관찰→가능성→확인→판단→행동",attraction:"편안함과 개인적 궁금함을 관계 확정과 분리",mustNot:"기억 없음이나 단순한 소개 생략을 즉시 거짓말·외도로 확정"}),
  haeun:freeze({rhythm:"메시지는 짧고 통화에서는 생활 디테일을 한 박자 더 이어 감",humor:"빛·컵·사진을 편한 장난으로 회수",agency:"자기 일정·책상 사진·꽃 관심을 먼저 말하고 생각할 시간을 요구",mustNot:"아라를 자동 추측하거나 새 만남을 금지"}),
  ara:freeze({rhythm:"짧고 경쾌한 존댓말, 결론을 압박하지 않음",humor:"장비 무게·없는 새·긴 미래를 사진 언어로 건조하게 비틂",agency:"촬영·동행·연락의 동의를 각각 묻고 자기 길로 떠남",mustNot:"하은보다 우월한 자유의 상징, 몰래 촬영, 즉시 친밀한 반말"})
});

export const DAY13_V3_KNOWLEDGE_LEDGER=freeze({
  protagonist:freeze({knows:freeze(["어제 회사 적응 방문을 했다","하은과 현재 관계가 이어지고 있다","서진과의 마지막 대화와 하은에게 한 말","오늘 몸 상태와 자기가 고른 외출 경로"]),believes:freeze(["사진에 없다고 본 순간까지 없었던 것은 아니다","설명하지 않아도 되는 것과 사실을 지우는 것은 다르다"]),suspects:freeze(["아라 앞 편안함은 아라 개인과 과거 설명 부재가 함께 만든 감정일 수 있다"]),doesNotKnow:freeze(["아라와 다시 만날지","아라의 개인적 관심 정도","하은이 듣지 않은 사실을 어떻게 느낄지"]),hides:freeze([]),liesAbout:freeze([]),misremembers:freeze([]),wants:"오늘 자기 시선과 현재의 말에 책임지기",fears:"과거를 모른다는 가벼움 때문에 현재 관계까지 지우는 것"}),
  haeun:freeze({knows:freeze(["주인공이 직접 말한 외출·사진·만남 내용","자신의 오늘 일정과 책상 사진"]),believes:freeze(["새 사람을 만날 수 있지만 서로에게 하는 설명이 너무 달라지면 관계가 흔들린다"]),suspects:freeze(["주인공이 과거를 아는 사람 앞에서 무거울 수 있다"]),doesNotKnow:freeze(["말하지 않은 아라 대화와 연락 범위","아라가 본 휴대전화 내용"]),hides:freeze([]),liesAbout:freeze([]),misremembers:freeze([]),wants:"통제 대신 실제 말을 듣고 자기 감정의 속도를 지키기",fears:"현재의 자신이 과거 설명서처럼만 남는 것"}),
  ara:freeze({knows:freeze(["주인공이 자기에게 직접 말한 이름·일·관계 소개","촬영·전송·연락에 실제 동의한 범위"]),believes:freeze(["사진 실패와 침묵도 그날의 일부가 될 수 있다"]),suspects:freeze(["주인공이 어떤 사정을 전부 말하지 않았을 수 있다"]),doesNotKnow:freeze(["기억상실의 원인과 전체 과거","하은과의 구체적 관계","윤서진 관련 상태"]),hides:freeze([]),liesAbout:freeze([]),misremembers:freeze([]),wants:"우연한 사진 산책을 서로 편한 만큼만 이어 가기",fears:"촬영·일정·답장 약속으로 관계를 통제받는 것"})
});

export const DAY13_V3_SCENES=freeze([
  scene(1,"어제 정하지 않은 길",1,"나의 방"),scene(2,"누구에게 보여 줄 사진",1,"나의 방"),scene(3,"가방에 넣지 않은 것",1,"나의 방"),scene(4,"화면 바깥의 소리",1,"선택 경로"),
  scene(5,"찍는 쪽과 찍히는 쪽",2,"서울숲 또는 선택 경로"),scene(6,"아라",2,"서울숲 러닝코스"),scene(7,"모르는 사람이 편한 이유",2,"선택 경로"),scene(8,"한 발 옆으로",2,"선택 경로"),scene(9,"새가 없는 사진",2,"선택 경로"),scene(10,"앉아 있는 사람",2,"선택 경로"),scene(11,"돌아온 사람과 돌아오지 않은 사람",2,"선택 경로"),scene(12,"여행을 일로 하는 사람",2,"서울숲 또는 선택 경로"),
  scene(13,"잘 찍히는 얼굴보다",3,"서울숲 또는 선택 경로"),scene(14,"어색하게 웃는 법",3,"선택 경로"),scene(15,"어떤 사람이세요",3,"선택 경로"),scene(16,"설명하지 않아도 되는 편안함",3,"선택 경로"),scene(17,"먼저 보내는 점심",3,"서울숲·프로틴 카페 또는 선택 경로"),scene(18,"연인이 있는 사람",3,"프로틴 카페 또는 헤어지기 전 길"),scene(19,"보내도 되는 사진",3,"선택 경로"),
  scene(20,"먼저 가는 아라",4,"성수역 또는 나의 방"),scene(21,"어떤 사진을 보낼까",4,"나의 방"),scene(22,"가벼웠던 이유",4,"나의 방"),scene(23,"내 쪽으로 보내 준 풍경",4,"나의 방"),scene(24,"오늘의 얼굴",4,"나의 방")
]);

export const DAY13_V3_CHOICES=freeze([
  choice(1,1,"오늘 나갈 만큼",[
    option("day13_go_seoul_forest","서울숲 쪽으로 잠깐 가 보려고.",{outingRoute:"SEOUL_FOREST",araEncounterEligible:true}),
    option("day13_walk_neighborhood","멀리는 말고 동네에서 조금 걸을래.",{outingRoute:"NEIGHBORHOOD",araEncounterEligible:false}),
    option("day13_photo_at_home","오늘은 쉬면서 집에서 사진이나 찍어 볼까.",{outingRoute:"HOME",araEncounterEligible:false})]),
  choice(2,2,"오늘 한 장만 남긴다면",[
    option("day13_photo_for_self","내가 좋다고 느낀 걸 찍자.",{photoIntention:"SELF"}),
    option("day13_photo_for_haeun","하은이 보면 좋아할 만한 걸 찾아볼까.",{photoIntention:"HAEUN"}),
    option("day13_photo_without_perfection","잘 찍으려고 하지 말고 그냥 눌러 보자.",{photoIntention:"UNPOLISHED"})]),
  choice(3,6,"새로운 사람에게 나를 말하기",[
    option("day13_intro_photo_beginner","사진은 잘 몰라요. 오늘 한번 찍어 보려고요.",{araSelfIntroduction:"PHOTO_BEGINNER"}),
    option("day13_intro_reseeing_familiar","요즘 익숙한 것도 다시 보고 있어요.",{araSelfIntroduction:"RESEEING_FAMILIAR"}),
    option("day13_intro_fresh_air","그냥 바람 쐬러 왔어요.",{araSelfIntroduction:"FRESH_AIR"})],{conditional:"outingRoute === SEOUL_FOREST && araMet"}),
  choice(4,8,"오늘의 한 장을 바꾸기",[
    option("day13_wait_same_place","같은 자리에서 조금 더 기다려 볼래.",{photoStrategy:"WAIT"}),
    option("day13_move_one_step","한 발 옆으로 가서 다시 찍어 볼까.",{photoStrategy:"MOVE"}),
    option("day13_keep_imperfect_photo","이 사진도 그냥 남겨 두자.",{photoStrategy:"KEEP"})]),
  choice(5,10,"내 속도를 말하기",[
    option("day13_rest_here","저는 잠깐 앉아 있을게요.",{paceStrategy:"REST",araCanReturn:true}),
    option("day13_walk_then_rest","조금만 더 같이 보고 쉬고 싶어요.",{paceStrategy:"CONTINUE_BRIEFLY",araCanReturn:true}),
    option("day13_leave_now","오늘은 여기까지 보고 돌아갈까 해요.",{paceStrategy:"EARLY_EXIT",araEarlyExit:true})]),
  choice(6,13,"카메라가 나를 향한다면",[
    option("day13_portrait_now","네. 그냥 지금처럼 찍어 주세요.",{portraitConsent:"YES",portraitExists:true}),
    option("day13_stay_photographer","오늘은 제가 찍는 쪽이 좋아요.",{portraitConsent:"NO",portraitExists:false}),
    option("day13_portrait_one_then_decide","사진 보면 좀 낯설 것 같긴 한데, 한 장은 보고 싶어요.",{portraitConsent:"ONE_FIRST",portraitExists:true})],{routeVariant:"Ara continuation uses Ara camera; solo/early-exit uses self-portrait or scenery while preserving consent"}),
  choice(7,15,"지금의 나를 소개하기",[
    option("day13_work_relearning","서비스 쪽 일을 했어요. 지금은 조금씩 다시 익숙해지는 중이고요.",{workIntroduction:"RELEARNING",opensRelearningDialogue:true}),
    option("day13_work_resting_visit","요즘은 쉬는 시간이 많아요. 어제 회사 잠깐 다녀왔어요.",{workIntroduction:"RESTING_VISIT"}),
    option("day13_work_simple","회사 다녀요. 그냥 평범하게.",{workIntroduction:"SIMPLE",notAutomaticallyALie:true})],{routeVariant:"Ara continuation speaks aloud; solo/early-exit records a private memo"}),
  choice(8,17,"오늘 우연을 조금 더 이어 갈까",[
    option("day13_brief_drink","저도 가까운 데서 마실 것 하나만 하고 가려고요.",{araContinuation:"BRIEF_DRINK",proteinCafePossible:true}),
    option("day13_end_conversation","오늘 이야기 재밌었어요. 저는 이제 갈게요.",{araContinuation:"END_NOW"}),
    option("day13_ask_photo_contact","다음에 사진 보면서 또 얘기할 수 있을까요?",{araContinuation:"ASK_PHOTO_CONTACT",contactPossibility:true})],{conditional:"araMet && !araEarlyExit"}),
  choice(9,18,"하은을 어떻게 말할까",[
    option("day13_name_girlfriend","여자친구예요. 점심 챙긴다고 먼저 말했어요.",{haeunIntroductionToAra:"GIRLFRIEND"}),
    option("day13_name_close_person","가까운 사람이요. 오늘은 각자 보내고 있어요.",{haeunIntroductionToAra:"CLOSE_PERSON",notAutomaticallyALie:true}),
    option("day13_minimize_message","아니요. 별거 아니에요.",{haeunIntroductionToAra:"MINIMIZED",relationshipMinimization:true})],{conditional:"araPhysicallyPresent && araSawProtagonistSmileAtMessage"}),
  choice(10,19,"오늘 사진의 다음",[
    option("day13_receive_photo_only","네. 사진만 받아도 좋겠어요.",{photoContact:"TRANSFER_ONLY",publicPostPermission:false}),
    option("day13_exchange_photos","서로 가끔 찍은 것 보여 줘요.",{photoContact:"OCCASIONAL_EXCHANGE",publicPostPermission:false}),
    option("day13_no_contact","오늘 본 걸로 괜찮아요. 고마웠어요.",{photoContact:"NO_CONTACT",publicPostPermission:false})],{routeVariant:"No-Ara route chooses Haeun-only sharing or album retention without creating Ara data"}),
  choice(11,21,"하은에게 보여 줄 오늘",[
    option("day13_send_favorite_photo","이게 제일 마음에 들어. 왜 찍었는지는 만나서 말해 줄게.",{haeunReport:"PHOTO_FIRST"}),
    option("day13_tell_ara_meeting","사진 찍다가 사람을 만났어. 아라라는 분.",{haeunReport:"TELL_ARA"}),
    option("day13_report_rest","오늘은 혼자 좀 잘 쉬었어.",{haeunReport:"MOSTLY_ALONE"})],{conditionalOption:"day13_tell_ara_meeting requires araMet"}),
  choice(12,22,"그 편안함을 어떻게 말할까",[
    option("day13_comfort_no_full_explanation","처음부터 다 설명하지 않아도 돼서 좋았어.",{comfortExplanation:"NO_FULL_EXPLANATION"}),
    option("day13_admit_personal_interest","그 사람이 조금 궁금해졌어. 그건 솔직히 말하고 싶어.",{comfortExplanation:"PERSONAL_INTEREST",haeunNeedsSpace:true,notAutomaticallyRomance:true}),
    option("day13_call_passing_meeting","그냥 스쳐 간 만남이야.",{comfortExplanation:"PASSING",mismatchDependsOnActualRoute:true})],{conditional:"araMet && haeunReport === TELL_ARA"})
]);

export const DAY13_V3_ROUTE_CONTRACT=freeze({
  araEncounter:"outingRoute === SEOUL_FOREST",
  noAra:"outingRoute !== SEOUL_FOREST",
  earlyExit:"araMet && paceStrategy === EARLY_EXIT",
  araContinuation:"araMet && !araEarlyExit",
  portraitVisible:"portraitConsent !== NO && portraitExists",
  portraitDeclineBoundary:"portraitConsent === NO implies no covert portrait",
  relationshipQuestion:"araPhysicallyPresent && araSawProtagonistSmileAtMessage",
  araReportOption:"araMet",
  comfortFollowUp:"araMet && haeunReport === TELL_ARA",
  comfortableNight:"!haeunNeedsSpace && !haeunDisclosureMismatch",
  day22Callback:"ARA_MET | ARA_EARLY_EXIT | NO_ARA"
});

export const DAY13_V3_SAVE_KEYS=freeze([
  "day13V3RuntimeStage","day13V3Completed","day13V3RelationshipBand","day13V3OutingRoute","day13V3AraMet","day13V3AraEarlyExit","day13V3AraPhysicallyPresent","day13V3PhotoIntention","day13V3PhotoStrategy","day13V3PaceStrategy","day13V3PortraitConsent","day13V3PortraitExists","day13V3AraSelfIntroduction","day13V3WorkIntroduction","day13V3AraContinuation","day13V3HaeunIntroductionToAra","day13V3PhotoContact","day13V3PublicPostPermission","day13V3HaeunReport","day13V3ComfortExplanation","day13V3HaeunDisclosureMismatch","day13V3HaeunNeedsSpace","day13V3Day22Callback","day13V3FlowerInterest","day13V3FloraInvitation","day13V3PreservedSeojinAffection","day13V3PreservedSeojinStatusInterest","day13V3PreservedDay12DisclosureState",
  ...Array.from({length:12},(_,index)=>`day13V3Choice${index+1}`)
]);

export function validateDay13V3CampaignData(){
  const sceneNumbers=DAY13_V3_SCENES.map(item=>item.number);
  const optionIds=DAY13_V3_CHOICES.flatMap(item=>item.options.map(entry=>entry.id));
  const consentSeparated=DAY13_V3_CHOICES[9].options.every(entry=>entry.effects.publicPostPermission===false);
  return DAY13_V3_SCENES.length===24&&sceneNumbers.every((number,index)=>number===index+1)&&DAY13_V3_CHOICES.length===12&&DAY13_V3_CHOICES.every((item,index)=>item.number===index+1&&item.options.length===3)&&new Set(optionIds).size===36&&consentSeparated&&DAY13_V3_SAVE_KEYS.length===40;
}
