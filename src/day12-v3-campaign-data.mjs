export const DAY12_V3_VERSION="NOTION_V3";
export const DAY12_V3_SCENARIO_ID="m30-day12-lunchtime-other-face-v3";

const freeze=value=>Object.freeze(value);
const scene=(number,title,act,location)=>freeze({number,id:`day12-v3-scene-${String(number).padStart(2,"0")}`,title,act,location});
const option=(id,label,effects)=>freeze({id,label,effects:freeze(effects)});
const choice=(number,sceneNumber,title,options,extra={})=>freeze({number,sceneNumber,title,options:freeze(options),...extra});

export const DAY12_V3_CHAPTER_CONTRACT=freeze({
  id:DAY12_V3_SCENARIO_ID,day:12,title:"점심시간의 다른 얼굴",chapterType:"직장 적응·현재 정체성·관계 경계",
  windows:freeze(["아침","오전 10시 전","점심","오후","밤"]),
  locations:freeze(["나의 방","회사 로비","회의실","휴게 공간","건물 안 식사 공간","회사 건물 밖"]),
  participants:freeze(["주인공","하은","윤서진","민호","팀장"]),
  prerequisites:freeze(["DAY11_V3_COMPLETE","DAY11_WORK_VISIT_10AM","DAY11_WORK_MAX_3_HOURS","DAY11_WORK_INCLUDES_LUNCH"]),
  previousChoiceReferences:freeze(["DAY7_SEOJIN_PHOTO","DAY7_SEOJIN_PERSONAL_INTEREST","DAY10_WORK_FOLDER","DAY11_WORK_PREPARATION","DAY7_TO_DAY11_UNRESOLVED_DISCLOSURES"]),
  dramaticPurpose:"예전처럼 답을 내놓으려던 주인공이 모르는 것을 묻고 실제로 멈춘 지점을 설명해 작지만 자기 몫인 기여를 얻으며, 업무 기여와 개인적 관심을 분리해 책임 있게 말한다.",
  characterWants:freeze({
    protagonist:"과거 능력을 연기하지 않고 현재의 관찰로 도움이 되며, 서진에게 느끼는 관심과 하은에게 할 말을 스스로 구분한다.",
    haeun:"보고 수신자가 아니라 자기 하루를 사는 연인으로 남고, 듣기 어려운 사실에도 즉답을 강요받지 않는다.",
    seojin:"업무에 실제 도움이 되는 현재의 주인공을 보고 싶으며, 개인적 호기심은 업무 평가와 별도로 확인한다.",
    minho:"자료 혼선을 자기 말로 바로잡고 주인공에게 과잉 보호가 아닌 편한 안내를 제공한다.",
    teamLead:"3시간 적응 경계 안에서 사실과 각자의 기여만 확인한다."
  }),
  informationBudget:freeze({
    mustReveal:freeze(["훈련 화면의 확인 문구와 실제 완료 버튼이 분리돼 있다","주인공의 멈춘 행동이 유효한 관찰이 된다","민호가 구버전 문장을 덜 정리했다","서진은 과거 방식의 도움을 기대했지만 현재 기여도 인정한다","점심 뒤 서진의 개인적 질문 가능성","하은에게 말한 내용과 실제 대화의 일치 여부"]),
    mayReveal:freeze(["서진은 큰 파를 골라낸다","민호는 화분 관리와 자판기 선택에서 허술하다","하은은 미뤄 둔 자기 일을 끝낸다","주인공은 서진에게 회사 밖 대화를 제안할 수 있다"]),
    mustNotReveal:freeze(["하은의 정체 진실","사고 원인","서진과 과거 연애 확정","서진의 상호 연애 감정 확정","정식 복귀·직급·급여·권한 회복","DAY13 새 인연 사전 확정","잠금 프로필"])
  }),
  emotionalCurve:freeze(["출발 전 긴장","익숙한 척하고 싶은 충동","작은 화면 오해 발견","민호와 책임 분리","작은 기여의 안도","점심의 생활감","서진의 솔직한 기대와 개인적 호기심","하은에게 말할 책임","각자 하루를 인정하는 온기 또는 남은 거리","화면 밖으로 나갈 계획"]),
  targetPlayMinutes:"25-35 manuscript estimate; browser measurement required",
  followUpHook:"DAY13 outing plan: Seoul Forest photo / neighborhood walk / decide after rest"
});

export const DAY12_V3_VOICE_PROFILES=freeze({
  protagonist:freeze({rhythm:"짧고 구체적",humor:"민호의 길·자판기에서 건조하게 받음",reasoning:"관찰→가능성→확인→판단→행동",interest:"안전한 일반론 뒤에 숨지 않고 자기 의도를 구분",mustNot:"기억상실을 전문 능력으로 보상하거나 한 단서로 관계 확정"}),
  haeun:freeze({rhythm:"메시지는 짧고 통화에서는 주인공보다 조금 길다",humor:"점심·미룬 일·잘했어를 생활 장난으로 연결",agency:"자기 일을 보내고 불편한 고백에는 생각할 시간을 요구",mustNot:"회사 보고를 의무화하거나 솔직함을 즉시 보상"}),
  seojin:freeze({rhythm:"사회적으로 매끄럽고 빠른 관찰 뒤 목적 있는 질문",humor:"파·세탁·자기 기대를 숨기지 않는 현실형",work:"능력 기대와 현재 관찰을 구분",interest:"개인 호기심과 STATUS_INTEREST를 별도 처리",mustNot:"칭찬으로 연애를 확정하거나 하은을 경쟁자로 평가"}),
  minho:freeze({rhythm:"설명이 길어지면 스스로 정리하고 농담 때 풀림",agency:"자기 실수를 자기 말로 보고",mustNot:"주인공의 희생으로 책임을 덮음"}),
  teamLead:freeze({rhythm:"짧고 범위 중심",role:"결과보다 적응 시간과 각자 기여 확인"})
});

export const DAY12_V3_KNOWLEDGE_LEDGER=freeze({
  protagonist:freeze({knows:freeze(["오전 10시 방문","점심 포함 3시간 상한","DAY10 폴더 제목","DAY11 질문 메모"]),believes:freeze(["모르는 것을 말하는 것도 현재의 기여가 될 수 있다"]),suspects:freeze(["서진의 회사 밖 질문에는 업무 외 관심이 섞일 수 있다"]),doesNotKnow:freeze(["화면 수정안의 정답","다음 방문일","서진의 최종 의도","DAY13에 만날 사람"]),hides:freeze([]),liesAbout:freeze([]),misremembers:freeze([]),wants:"현재의 행동으로 자기 몫을 얻고 사실대로 관계 경계를 정하기",fears:"과거 능력을 연기하거나 솔직함을 면죄부로 쓰는 것"}),
  haeun:freeze({knows:freeze(["주인공의 회사 방문","자기가 오늘 끝낼 일","주인공이 자신에게 말한 내용만"]),believes:freeze(["모르는 마음도 다음 행동을 서두르지 않으면 말할 수 있다"]),suspects:freeze(["서진 이야기에 개인적 관심이 있을 수 있다"]),doesNotKnow:freeze(["말하지 않은 회사 대화","서진의 생각"]),hides:freeze([]),liesAbout:freeze([]),misremembers:freeze([]),wants:"자기 하루와 감정을 지키며 실제 사실을 듣기",fears:"정직을 이유로 즉시 괜찮아지라고 요구받는 것"}),
  seojin:freeze({knows:freeze(["과거 주인공의 업무 방식","오늘 훈련 화면","민호의 문서 혼선","주인공이 실제로 멈춘 지점"]),believes:freeze(["현재 방식의 기여도 실무에 쓸 수 있다"]),suspects:freeze(["주인공도 자신에게 개인적 호기심을 가질 수 있다"]),doesNotKnow:freeze(["주인공과 하은의 사적 대화","주인공의 최종 연애 의도"]),hides:freeze([]),liesAbout:freeze([]),misremembers:freeze([]),wants:"일이 나아지고 현재의 주인공을 더 정확히 알기",fears:"거짓 위로나 업무 친절로 개인 의도를 대신하는 것"}),
  minho:freeze({knows:freeze(["자료 버전 혼선","주인공의 방문 경계"]),doesNotKnow:freeze(["주인공과 서진의 개인 의도"]),wants:"자기 실수를 정리하고 편한 안내자가 되기",fears:"과잉 배려로 설명과 책임을 더 꼬이게 하는 것"})
});

export const DAY12_V3_SCENES=freeze([
  scene(1,"질문을 넣은 가방",1,"나의 방"),scene(2,"전에 한 번 열었던 문",1,"회사 로비"),scene(3,"서진의 두 번째 인사",1,"회의실 앞"),scene(4,"빈 의자가 아니라 오늘의 자리",1,"회의실"),
  scene(5,"한 장이 더 있다",2,"회의실"),scene(6,"익숙한 척하기 쉬운 말",2,"회의실"),scene(7,"내가 누른 버튼",2,"회의실"),scene(8,"메모 뒤에 남은 문장",2,"회의실"),scene(9,"작은 일이 남는 자리",2,"회의실"),scene(10,"여기까지라는 말",2,"회의실"),scene(11,"자판기 앞의 두 사람",2,"휴게 공간"),scene(12,"점심을 고르는 질문",2,"휴게 공간"),
  scene(13,"밥 먹을 때는 다른 사람",3,"건물 안 식사 공간"),scene(14,"점심에는 무슨 이야기를 하나",3,"건물 안 식사 공간"),scene(15,"다시 일하고 싶냐는 질문",3,"건물 안 식사 공간"),scene(16,"조금 남은 점심시간",3,"건물 안 식사 공간"),scene(17,"친절과 다른 마음",3,"건물 안 식사 공간"),scene(18,"팀장 앞의 한 문장",3,"회의실 앞"),
  scene(19,"한 시 전에 나가는 사람",4,"엘리베이터 앞"),scene(20,"점심 먹었다는 말",4,"회사 건물 밖"),scene(21,"말하지 않은 것과 다른 말",4,"나의 방"),scene(22,"오늘은 네 차례",4,"나의 방"),
  scene(23,"내일은 화면 밖으로",5,"나의 방"),scene(24,"정답이 아니어도 남는 것",5,"나의 방")
]);

export const DAY12_V3_CHOICES=freeze([
  choice(1,1,"출발하기 전에",[
    option("day12_promise_debrief","끝나면 어땠는지 얘기할게.",{departureDisclosure:"PROMISE_DEBRIEF"}),
    option("day12_admit_nerves","오늘은 좀 긴장돼. 그냥 다녀올게.",{departureDisclosure:"ADMIT_NERVES"}),
    option("day12_support_haeun_day","너도 오늘 네 일 잘 보내.",{departureDisclosure:"RECIPROCAL_DAY",haeunAgency:true})]),
  choice(2,4,"자료를 보기 전에",[
    option("day12_ask_scope_first","오늘 어떤 걸 보면 되는지 먼저 알려 주세요.",{workEntry:"ASK_SCOPE"}),
    option("day12_read_then_ask","제가 읽어 보고 모르는 걸 물어볼게요.",{workEntry:"READ_THEN_ASK"}),
    option("day12_settle_before_reading","잠깐 앉아서 익숙해진 다음 볼게요.",{workEntry:"SETTLE_FIRST",fatigueBoundary:true})]),
  choice(3,6,"빨리 말해 버린 답",[
    option("day12_restart_full_read","잠깐만요. 제가 끝까지 안 봤네요.",{answerCorrection:"RESTART_READING",seojinStatusInterestDelta:1}),
    option("day12_ask_user_reason","왜 완료했다고 생각하는지부터 듣고 싶어요.",{answerCorrection:"ASK_REASON",seojinStatusInterestDelta:1}),
    option("day12_hold_early_opinion","일단 제 생각은 그래요. 계속 설명해 주세요.",{answerCorrection:"HOLD_OPINION"})]),
  choice(4,8,"민호의 말 앞에서",[
    option("day12_trace_confusion_together","제가 헷갈린 데를 말해 드릴게요. 같이 보죠.",{minhoResponse:"SHARE_OBSERVATION"}),
    option("day12_name_next_use","지금 찾았으니까 다음에 덜 헷갈리겠네요.",{minhoResponse:"NAME_NEXT_USE"}),
    option("day12_offer_to_cover_minho","팀장님께는 제가 처음 봐서 헷갈린 걸로 말할까요?",{minhoResponse:"OFFER_COVER_REJECTED"})]),
  choice(5,10,"조금 알 것 같아졌을 때",[
    option("day12_stop_at_boundary","여기까지 적고 쉬죠.",{workStop:"STOP_NOW"}),
    option("day12_one_question_then_rest","하나만 더 물어보고 쉴게요.",{workStop:"ONE_QUESTION"}),
    option("day12_ask_to_continue","지금 감 잡힌 것 같은데 계속하면 안 될까요?",{workStop:"ASK_CONTINUE_BUT_STOP",fatigueBoundary:true})]),
  choice(6,12,"오늘의 점심",[
    option("day12_lunch_warm_quick","따뜻하고 빨리 나오는 쪽이 좋아요.",{lunchStrategy:"WARM_QUICK"}),
    option("day12_lunch_ask_current_habit","두 분 평소 먹는 걸로. 요즘 뭐 드세요?",{lunchStrategy:"ASK_CURRENT_HABIT"}),
    option("day12_lunch_quiet_seat","저는 조금 조용한 데서 먹고 싶어요.",{lunchStrategy:"QUIET_SEAT"})]),
  choice(7,15,"회사에 다시 온 마음",[
    option("day12_want_gradual_return","조금씩 더 해 보고 싶어요.",{workFeeling:"GRADUAL_RETURN"}),
    option("day12_name_fun_and_fatigue","재밌긴 했는데, 아직은 피곤해요.",{workFeeling:"FUN_AND_TIRED",fatigueNamed:true}),
    option("day12_fear_past_comparison","예전만큼 못할까 봐 그게 제일 신경 쓰여요.",{workFeeling:"FEAR_COMPARISON"})]),
  choice(8,16,"점심 뒤에 남는 이야기",[
    option("day12_name_haeun_and_friends","하은이랑 조금씩 다니고 있어요. 친구도 만나고.",{personalConversation:"NAME_PARTNER"}),
    option("day12_ask_seojin_day_off","생각보다 모르는 취향이 많더라고요. 서진 씨는 쉬는 날 뭐 하세요?",{personalConversation:"ASK_SEOJIN",seojinAffectionDelta:1}),
    option("day12_keep_personal_distance","아직은 일상 얘기까지 하기는 조금 어색해요.",{personalConversation:"KEEP_DISTANCE"})]),
  choice(9,17,"오늘의 거리를 남기기",[
    option("day12_thank_as_colleague","오늘 같이 봐 주셔서 고마워요. 다음에도 잘 부탁드려요.",{seojinDistance:"COLLEAGUE"}),
    option("day12_invite_outside_work","회사 밖에서도 얘기해 보고 싶네요. 괜찮으실 때.",{seojinDistance:"PERSONAL_INVITATION",seojinAffectionDelta:1}),
    option("day12_end_for_rest","오늘은 여기까지 할게요. 조금 쉬고 싶어서.",{seojinDistance:"REST_BOUNDARY"})]),
  choice(10,18,"오늘 내가 한 일",[
    option("day12_report_stop_point","끝난 줄 알고 멈췄어요. 그 지점을 같이 봤습니다.",{creditStrategy:"NAME_OWN_OBSERVATION"}),
    option("day12_report_team_roles","민호 씨가 설명해 주고 서진 씨가 정리해 주셨어요.",{creditStrategy:"NAME_TEAM_ROLES"}),
    option("day12_report_small_help","조금 도움이 된 것 같아서 좋았습니다.",{creditStrategy:"NAME_FEELING"})]),
  choice(11,20,"하은에게 전할 회사의 하루",[
    option("day12_tell_small_contribution","내가 헷갈린 게 도움이 됐어. 좀 신기해.",{haeunFirstDisclosure:"WORK_CONTRIBUTION"}),
    option("day12_tell_seojin_lunch","서진 씨랑 점심 먹고 일상 얘기도 했어.",{haeunFirstDisclosure:"SEOJIN_CONVERSATION"}),
    option("day12_ask_to_debrief_after_rest","지금은 머리가 좀 꽉 찼어. 쉬고 얘기해도 돼?",{haeunFirstDisclosure:"DEFER_FOR_REST"})]),
  choice(12,21,"아직 남은 마음을 어떻게 말할까",[
    option("day12_disclose_remaining_conversation","오늘 한 말 중에 너한테도 말하고 싶은 게 있어.",{haeunFinalDisclosure:"DISCLOSE"}),
    option("day12_name_uncertainty_and_pause","아직 내 마음을 잘 모르겠어. 조금 생각하고 얘기할게.",{haeunFinalDisclosure:"UNCERTAIN_DEFER"}),
    option("day12_claim_only_work","별일 없었어. 회사 얘기만 했어.",{haeunFinalDisclosure:"CLAIM_ONLY_WORK"})]),
  choice(13,21,"서진에게 한 제안의 뜻",[
    option("day12_intent_colleague","좋은 동료로 좀 더 알고 싶었어.",{seojinIntent:"COLLEAGUE"}),
    option("day12_intent_spark","조금 설렜던 건 맞아. 그걸 없다고 하고 싶진 않아.",{seojinIntent:"SPARK",haeunNeedsSpace:true}),
    option("day12_intent_unknown","아직 모르겠어. 다음 약속은 서두르지 않을게.",{seojinIntent:"UNKNOWN",pausePersonalPlan:true})],{conditional:"choice9 === day12_invite_outside_work && choice12 === day12_disclose_remaining_conversation"}),
  choice(14,23,"내일 잠깐 나가 본다면",[
    option("day12_plan_seoul_forest_photo","서울숲 쪽에서 사진을 조금 찍어 볼까.",{day13Plan:"SEOUL_FOREST_PHOTO"}),
    option("day12_plan_neighborhood_walk","동네에서 천천히 걷는 정도가 좋겠어.",{day13Plan:"NEIGHBORHOOD_WALK"}),
    option("day12_plan_decide_after_rest","오늘 쉬어 보고 내일 몸 상태로 정하자.",{day13Plan:"DECIDE_AFTER_REST"})])
]);

export const DAY12_V3_ROUTE_CONTRACT=freeze({
  personalConversation:"choice8 === day12_ask_seojin_day_off",
  personalInvitation:"choice9 === day12_invite_outside_work",
  seojinMayReciprocate:"priorPersonalInterest && personalConversation && personalInvitation",
  intentFollowUp:"personalInvitation && choice12 === day12_disclose_remaining_conversation",
  explicitContradiction:"choice11 === day12_tell_seojin_lunch && personalInvitation && choice12 === day12_claim_only_work",
  concealedMismatch:"personalInvitation && choice11 !== day12_tell_seojin_lunch && choice12 === day12_claim_only_work",
  comfortableNight:"!haeunNeedsSpace && !explicitContradiction && !concealedMismatch",
  nextDayEncounter:"UNSET; DAY13 plan is not an encounter"
});

export const DAY12_V3_SAVE_KEYS=freeze([
  "day12V3RuntimeStage","day12V3Completed","day12V3RelationshipBand","day12V3PriorSeojinPhoto","day12V3PriorSeojinPersonalInterest","day12V3UnresolvedConflict","day12V3WorkVisitTime","day12V3WorkVisitMaxHours","day12V3WorkIncludesLunch","day12V3ObservedCompletionGap","day12V3MinhoOwnedCorrection","day12V3ContributionRecorded","day12V3PersonalConversation","day12V3PersonalInvitation","day12V3SeojinReply","day12V3HaeunFirstDisclosure","day12V3HaeunFinalDisclosure","day12V3DisclosureMismatch","day12V3SeojinIntent","day12V3HaeunNeedsSpace","day12V3Day13Plan",
  ...Array.from({length:14},(_,index)=>`day12V3Choice${index+1}`)
]);

export function validateDay12V3CampaignData(){
  const sceneNumbers=DAY12_V3_SCENES.map(item=>item.number);
  const optionIds=DAY12_V3_CHOICES.flatMap(item=>item.options.map(entry=>entry.id));
  const axesIndependent=DAY12_V3_CHOICES.flatMap(item=>item.options).every(entry=>!("seojinAffectionDelta" in entry.effects&&"seojinStatusInterestDelta" in entry.effects));
  return DAY12_V3_SCENES.length===24&&sceneNumbers.every((number,index)=>number===index+1)&&DAY12_V3_CHOICES.length===14&&DAY12_V3_CHOICES.every((item,index)=>item.number===index+1&&item.options.length===3)&&new Set(optionIds).size===42&&axesIndependent&&DAY12_V3_SAVE_KEYS.length===35;
}
