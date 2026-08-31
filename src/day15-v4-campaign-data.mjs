export const DAY15_V4_VERSION="NOTION_V4";
export const DAY15_V4_SCENARIO_ID="m30-day15-facing-the-light-v4";

const freeze=Object.freeze;
const scene=(number,title,act,location)=>freeze({number,id:`day15-v4-scene-${String(number).padStart(2,"0")}`,title,act,location});
const option=(id,label,effects)=>freeze({id,label,effects:freeze(effects)});
const choice=(number,sceneNumber,title,options,variants={})=>freeze({number,sceneNumber,title,options:freeze(options),variants:freeze(variants)});

export const DAY15_V4_CHAPTER_CONTRACT=freeze({
  id:DAY15_V4_SCENARIO_ID,day:15,title:"빛나는 쪽을 보다",chapterType:"현재 연애·사회적 기억 격차·질투와 경계 대화",
  windows:freeze(["아침","오전","오후","저녁","밤"]),locations:freeze(["나의 방","한강 갤러리","한강변 카페","귀갓길"]),participants:freeze(["주인공","하은","시우","지훈"]),
  prerequisites:freeze(["DAY14_V4_COMPLETE","DAY15_GALLERY_PLAN_PENDING","DAY14_EXHIBITION_INVITATION_RESOLVED"]),
  dramaticPurpose:"하은에게는 독립된 현재 관계와 취향이 있음을 마주하고, 비교와 통제 대신 서로의 감상과 불안을 말하는 방법을 고른다.",
  targetPlayMinutes:"25-35 Notion target; route-specific browser timing pending",
  followUpHook:"지훈이 내일 시간을 묻지만 답장과 만남은 확정되지 않는다."
});

export const DAY15_V4_VOICE_PROFILES=freeze({
  protagonist:freeze({reasoning:"관찰→가능성→확인→판단→행동",mustNot:"시우를 깎아 자기 자리를 만들거나 하은의 관계를 통제하지 않는다."}),
  haeun:freeze({rhythm:"생활적인 다정함과 짧은 장난 뒤에도 자기 취향과 경계를 구체적으로 말한다.",agency:"전시·휴식·대화·귀가 거리·자료 공유를 스스로 정한다."}),
  siwoo:freeze({rhythm:"전문 설명은 정확하고 빠르지만 좌우를 헷갈리는 인간적인 실수가 있다.",mustNot:"연애 악역이나 과거 진실의 해설자가 되지 않는다."}),
  jihoon:freeze({rhythm:"다음 날 시간을 짧게 묻는다.",mustNot:"DAY15 안에서 약속이나 만남을 확정하지 않는다."})
});

export const DAY15_V4_INFORMATION_BUDGET=freeze({
  mustReveal:freeze(["실제 초대 여부와 참석 선택","시우의 유능함과 인간적 실수","하은은 두 관계를 모두 즐길 수 있다","주인공의 현재 감상","지난번이 만든 사회적 기억 격차","지훈 메시지의 잠정성"]),
  mayReveal:freeze(["실제 발생한 윤서진의 회사 밖 제안","실제 발생한 아라의 개인 관심과 연락","DAY14의 정확한 관계 콜백","하은이 직접 건넨 공개 전시 자료"]),
  mustNotReveal:freeze(["하은 정체 진실","사고 원인 또는 범인","시우와 하은의 사적 관계 확정","누구의 거짓말 확정","실제 작품·작가·전시 규칙 발명","사적 메시지 열람","불참자의 현장 지식","DAY16 만남 확정","잠금 프로필"])
});

export const DAY15_V4_SCENES=freeze([
  scene(1,"안내보다 먼저 보이는 이름",1,"나의 방"),scene(2,"괜히 신경 쓰이는 소매",1,"옷장 앞"),scene(3,"조금 먼저 도착한 사람들",1,"한강 갤러리 또는 나의 방"),
  scene(4,"아는 말이 빠르게 오갈 때",1,"한강 갤러리"),scene(5,"왼쪽에 있는 오른쪽",1,"한강 갤러리"),scene(6,"그림 앞에서 할 수 있는 말",1,"한강 갤러리 또는 나의 방"),
  scene(7,"답을 빼앗는 질문",1,"한강 갤러리"),scene(8,"능숙한 사람의 다른 모습",1,"한강 갤러리"),scene(9,"하은은 돌아간다",1,"한강 갤러리"),scene(10,"밖에 먼저 나온 사람",1,"갤러리 앞"),
  scene(11,"카페를 고르는 두 사람",2,"한강변 카페"),scene(12,"하나만 말해 봐",2,"한강변 카페 또는 전화"),scene(13,"누가 더 좋은지 묻는 일",2,"한강변 카페 또는 전화"),
  scene(14,"오늘의 하은을 보는 일",2,"한강변 카페 또는 전화"),scene(15,"내 쪽에 남은 이름",2,"한강변 카페 또는 전화"),scene(16,"다시 고르는 말",2,"한강변 카페 또는 전화"),
  scene(17,"두 사람이 고른 한 점",2,"한강변 카페"),scene(18,"보지 않은 전시를 듣는 밤",3,"나의 방 또는 전화"),scene(19,"전화가 없는 저녁",3,"나의 방"),
  scene(20,"가까워져도 되는 걸음",3,"귀갓길"),scene(21,"헤어지기 전에 하나",3,"귀갓길 또는 전화"),scene(22,"시우의 자료",3,"나의 방·메시지"),
  scene(23,"내일은 익숙한 친구",3,"나의 방·메시지"),scene(24,"빛이 들어오는 쪽",3,"나의 방")
]);

export const DAY15_V4_CHOICES=freeze([
  choice(1,1,"전시 초대에 답하기",[
    option("day15_v4_invitation_attend","나도 보고 싶어. 두 시에 갈게.",{attendanceRoute:"ATTEND"}),
    option("day15_v4_invitation_own_time","오늘은 네 시간으로 보내. 나는 다른 일 좀 할게.",{attendanceRoute:"OWN_AFTERNOON"}),
    option("day15_v4_invitation_admit_tension","선배도 온다고 하니까 조금 긴장되네.",{admittedTension:true})],{notInvitedOptions:freeze([
      option("day15_v4_invitation_no_invite","재밌게 보고 와. 무슨 전시인지 궁금하네.",{attendanceRoute:"OWN_AFTERNOON"})
    ])}),
  choice(2,2,"오늘 입을 옷",[
    option("day15_v4_outfit_comfort","내가 편하게 움직일 수 있는 옷을 입는다.",{outfitStrategy:"COMFORT"}),
    option("day15_v4_outfit_for_haeun","하은에게 보여 주고 싶은 옷을 고른다.",{outfitStrategy:"FOR_HAEUN"}),
    option("day15_v4_outfit_admit_self_conscious","너무 신경 쓰인다고 하은에게 말한다.",{outfitStrategy:"ADMIT_SELF_CONSCIOUS"})]),
  choice(3,4,"전시를 이해하는 방법",[
    option("day15_v4_gallery_ask","빈 곳도 같이 보라는 게 무슨 뜻이에요?",{galleryUnderstandingStrategy:"ASK"}),
    option("day15_v4_gallery_observe","저는 먼저 조금 보고 물어볼게요.",{galleryUnderstandingStrategy:"OBSERVE"}),
    option("day15_v4_gallery_pretend","알아들은 것처럼 고개를 끄덕인다.",{galleryUnderstandingStrategy:"PRETEND"})],{ownAfternoonOptions:freeze([
      option("day15_v4_own_reread","한 번만 더 읽어 보자.",{ownAfternoonRead:"REREAD"}),
      option("day15_v4_own_skip","이 문장은 건너뛰고 다른 곳부터 보자.",{ownAfternoonRead:"SKIP"}),
      option("day15_v4_own_stop","오늘은 여기까지 읽자.",{ownAfternoonRead:"STOP"})
    ])}),
  choice(4,7,"하은의 감상을 듣는 방법",[
    option("day15_v4_view_ask_preference","너는 어떤 게 제일 마음에 들어?",{haeunViewingStrategy:"ASK_PREFERENCE"}),
    option("day15_v4_view_share_perception","이거는 나랑 조금 더 보자.",{haeunViewingStrategy:"SHARE_PERCEPTION"}),
    option("day15_v4_view_compare_with_siwoo","선배 설명 듣는 게 더 좋지?",{haeunViewingStrategy:"COMPARE_WITH_SIWOO"})],{ownAfternoonOptions:freeze([
      option("day15_v4_own_question","모르겠는 부분을 한 줄 적자.",{ownAfternoonReflection:"QUESTION"}),
      option("day15_v4_own_write","답이 없어도 내가 생각한 걸 적어 보자.",{ownAfternoonReflection:"WRITE"}),
      option("day15_v4_own_rest","오늘은 답을 찾는 것까지 쉬자.",{ownAfternoonReflection:"REST"})
    ])}),
  choice(5,9,"전시 뒤의 거리",[
    option("day15_v4_rest_separate","난 옆방을 조금 더 보고 올게.",{restDecision:"SEPARATE"}),
    option("day15_v4_rest_together","네가 보는 게 궁금해. 같이 있을래.",{restDecision:"TOGETHER"}),
    option("day15_v4_rest_leave","이제 우리끼리 다른 데 가면 안 돼?",{restDecision:"LEAVE"})],{ownAfternoonOptions:freeze([
      option("day15_v4_own_continue","조금 더 읽고 싶어.",{ownAfternoonClose:"CONTINUE"}),
      option("day15_v4_own_get_air","잠깐 바람을 쐬자.",{ownAfternoonClose:"GET_AIR"}),
      option("day15_v4_own_eat","이제 먹거나 쉬러 가자.",{ownAfternoonClose:"EAT"})
    ])}),
  choice(6,11,"카페 자리",[
    option("day15_v4_cafe_inner","조용한 안쪽이 좋겠어.",{cafeRoute:"INNER"}),
    option("day15_v4_cafe_window","창가. 오늘은 밖도 좀 보고 싶어.",{cafeRoute:"WINDOW"}),
    option("day15_v4_cafe_go_home","난 오늘은 먼저 쉬러 가야 할 것 같아.",{cafeRoute:"GO_HOME"})]),
  choice(7,12,"질투를 말하는 방법",[
    option("day15_v4_conflict_jealousy","조금 질투났어.",{conflictStrategy:"JEALOUSY"}),
    option("day15_v4_conflict_insecurity","나는 요즘 서툰데, 그 사람은 너무 편해 보여서.",{conflictStrategy:"INSECURITY"}),
    option("day15_v4_conflict_control","다음에는 그 선배랑 둘이 안 만났으면 좋겠어.",{conflictStrategy:"CONTROL"})]),
  choice(8,15,"내 쪽의 관계를 돌아보기",[
    option("day15_v4_reciprocity_own_double_standard","내가 너한테는 다르게 말하고 있었네.",{reciprocityStrategy:"OWN_DOUBLE_STANDARD"}),
    option("day15_v4_reciprocity_admit_fear","네가 더 편한 사람을 만나면 나랑 있기 싫어질까 봐 겁나.",{reciprocityStrategy:"ADMIT_FEAR"}),
    option("day15_v4_reciprocity_ask_time","지금은 정리해서 말하기가 어려워. 조금 생각해도 될까?",{reciprocityStrategy:"ASK_TIME"})],{withoutPersonalCallbackOptions:freeze([
      option("day15_v4_reciprocity_admit_fear","네가 더 편한 사람을 만나면 나랑 있기 싫어질까 봐 겁나.",{reciprocityStrategy:"ADMIT_FEAR"}),
      option("day15_v4_reciprocity_ask_time","지금은 정리해서 말하기가 어려워. 조금 생각해도 될까?",{reciprocityStrategy:"ASK_TIME"})
    ])}),
  choice(9,16,"통제 대신 경계를 말하기",[
    option("day15_v4_boundary_ask_haeun","가지 말라고 하기보다, 네가 뭘 좋아하는지 듣고 싶다고 했어야 했네.",{boundaryResolved:true,controlContinued:false}),
    option("day15_v4_boundary_admit_insecurity","나는 오늘 조금 불안했어. 그래도 네가 즐거웠던 건 듣고 싶어.",{boundaryResolved:true,controlContinued:false}),
    option("day15_v4_boundary_continue_control","내가 싫다는 것도 네가 좀 맞춰 주면 안 돼?",{boundaryResolved:false,controlContinued:true,haeunLeft:true})]),
  choice(10,17,"현재의 감상을 말하기",[
    option("day15_v4_perception_wavering_line","내가 멈췄던 선 이야기를 한다.",{currentPerception:"WAVERING_LINE"}),
    option("day15_v4_perception_not_sure","왜 좋았는지 아직 모르겠다고 말한다.",{currentPerception:"NOT_SURE"}),
    option("day15_v4_perception_revisit","다음에 다시 보고 말하고 싶다고 한다.",{currentPerception:"REVISIT"})]),
  choice(11,21,"오늘 대화를 닫기",[
    option("day15_v4_closing_listen","네가 좋아하는 걸 더 듣고 싶어졌어.",{closingStrategy:"LISTEN"}),
    option("day15_v4_closing_apologize","아까 급하게 말한 건 미안해.",{closingStrategy:"APOLOGIZE"}),
    option("day15_v4_closing_think_later","오늘은 조금 생각하고 다음에 얘기하자.",{closingStrategy:"THINK_LATER"})],{withoutApologyOptions:freeze([
      option("day15_v4_closing_listen","네가 좋아하는 걸 더 듣고 싶어졌어.",{closingStrategy:"LISTEN"}),
      option("day15_v4_closing_thanks","오늘 서툰 얘기도 들어줘서 고마워.",{closingStrategy:"THANKS"}),
      option("day15_v4_closing_think_later","오늘은 조금 생각하고 다음에 얘기하자.",{closingStrategy:"THINK_LATER"})
    ])}),
  choice(12,22,"공개 전시 자료",[
    option("day15_v4_material_request_public","보내 줄래? 오늘 얘기한 거 다시 보고 싶어.",{publicMaterialAccepted:true,publicMaterialRead:true}),
    option("day15_v4_material_haeun_thought_first","나는 네가 말한 걸 조금 더 생각해 볼게. 자료는 나중에.",{publicMaterialAccepted:false,publicMaterialRead:false}),
    option("day15_v4_material_read_tomorrow","오늘은 좀 피곤해. 내일 읽어도 돼?",{publicMaterialAccepted:true,publicMaterialRead:false})])
]);

export const DAY15_V4_CHOICE_IDS=freeze(new Map(DAY15_V4_CHOICES.flatMap(item=>[
  ...item.options.map(entry=>[entry.id,item.number]),
  ...Object.values(item.variants).flatMap(entries=>Array.isArray(entries)?entries.map(entry=>[entry.id,item.number]):[])
])));
