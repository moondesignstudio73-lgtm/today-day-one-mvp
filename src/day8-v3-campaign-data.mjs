export const DAY8_V3_VERSION=3;
export const DAY8_V3_SCENE_ID="m30-day8-jihoon-present-afternoon-v3";

export const DAY8_V3_CONTRACT=Object.freeze({
  day:8,title:"너 없는 오후",timeWindow:"morning-to-late-evening",chapterType:"friendship/romance/daily-life/amnesia-mystery-hybrid",
  targetPlaytimeMinutes:[8,12],participants:["protagonist","jihoon","haeun"],
  prerequisites:["day7V3Complete","day8JihoonInvitationPending"],
  dramaticPurpose:"지훈을 자신의 과거 자료가 아니라 현재를 사는 친구로 다시 듣는다.",
  wants:{protagonist:"과거를 묻는 습관에서 벗어나 지훈의 오늘을 듣는다.",jihoon:"증언자가 아니라 현재 친구로 인정받는다.",haeun:"허락과 감시 없이 소라와 자기 하루를 보내고 합의한 범위만 나눈다."},
  emotionalCurve:["각자의 약속","식사 농담","짧아진 대답","고치려는 습관","현재 이야기 듣기","각자 보낸 오후","일정·진실성 긴장","만나지 않은 날의 다정함","내일의 색"],
  informationBudget:{mustReveal:["지훈에게도 주인공이 몰랐던 현재 1년이 있다","사적 클라이언트 작업과 공개 크레딧 영상은 별개다","하은은 소라와 독립된 하루를 보낸다"],mayReveal:["선택한 경우 과거 사진 한 장","실제 이전 손잡기 기록이 있는 관계의 전화 콜백"],mustNotReveal:["fake-haeun-truth","locked-haeun-profile","accident-culprit","intentional-harm","vehicle-manipulation"]},
  relationshipBudget:{haeun:"독립 일정·연락 합의·개인정보 경계",jihoon:"듣기 전략·공개 깊이·다시 거는 전화",seojin:"AFFECTION과 STATUS_INTEREST 모두 변화 0"},
  nextHook:"day9-clothing-color-invitation"
});

export const DAY8_V3_VOICE_PROFILES=Object.freeze({
  protagonist:{rhythm:"짧은 관찰 뒤 구체 질문",humor:"상대의 생활 행동을 받아치는 건조한 농담",reasoning:["observe","possibilities","verify","judge","act"]},
  jihoon:{rhythm:"음식 농담 뒤 짧아지는 진심",humor:"과장된 식사 규칙과 친구식 받아치기",boundary:"사적 작업과 공개 크레딧을 섞지 않는다"},
  haeun:{rhythm:"짧은 생활어·장난 뒤 선택권을 남기는 문장",humor:"영화 제목·표정·색처럼 손에 잡히는 대상",boundary:"독립 일정을 허락 문제로 만들지 않고 지훈의 사생활을 캐묻지 않는다"}
});

export const DAY8_V3_KNOWLEDGE_LEDGER=Object.freeze({
  protagonist:{knows:["지훈의 DAY 7 초대","하은의 소라 영화 약속"],believes:["과거 질문도 친구 관계의 일부일 수 있다"],suspects:["지훈의 짧은 답에 현재 문제가 있다"],doesNotKnow:["지훈의 전체 업무 사정","사적 작업 내용"],hides:["선택에 따라 늦어진 실제 이유"],liesAbout:["실제 경로와 다른 이동 지연 설명만"],misremembers:["기억 공백을 사실 오류로 단정하지 않음"],wants:["지훈의 현재를 듣기"],fears:["중요한 단서를 놓치거나 친구를 다시 도구로 대하기"]},
  jihoon:{knows:["자신의 현재 일과 후회와 좋은 소식","직접 본 제한된 과거"],believes:["주인공은 듣기 전에 해결하려 들 때가 있다"],suspects:["오늘도 과거를 얻으려 만났을 수 있다"],doesNotKnow:["하은의 사적 생각","사고 진실"],hides:["부끄러운 현재 일의 맥락"],liesAbout:[],misremembers:["자기 관점은 객관적 전모가 아님"],wants:["현재 친구로 인정받기"],fears:["증거로만 유용한 사람이 되는 것"]},
  haeun:{knows:["소라와 자신의 일정","합의된 연락 범위"],believes:["각자의 시간이 관계를 해치지 않는다"],suspects:["늦은 연락은 계획 변경일 수 있다"],doesNotKnow:["지훈의 사적 업무 내용"],hides:[],liesAbout:[],misremembers:[],wants:["소유하지 않는 정직한 하루 교환"],fears:["연인의 허락 창구가 되는 것"]}
});

const sceneTitles=["오늘은 누구와","친구의 이름","가져갈 것과 두고 갈 것","한 사람분의 출발","둘이 먹는 세 가지 방법","어떤 사진을 가져왔냐면","대답이 짧아진 사람","물어보는 사람의 자리","잘린 장면","도움이 되려던 말","나 없는 동안","살아 있던 이야기","다르게 기억하는 오늘","오늘은 뭘 할까","친구와 남거나 혼자 돌아오거나","하은이 보내지 않은 사진","조금만 더","먼저 끝난 사람","늦은 이유","너는 어땠어?","친구의 이야기를 어디까지","만나지 않은 날의 다정함","해결하지 못해도","내일의 색"];
const choiceAt={1:1,3:2,5:3,8:4,10:5,14:6,16:7,17:8,19:9,21:10};
export const DAY8_V3_SCENES=Object.freeze(sceneTitles.map((title,index)=>Object.freeze({number:index+1,id:`D8V3_S${String(index+1).padStart(2,"0")}`,title,choiceNumber:choiceAt[index+1]??null,route:index+1===15?"exclusive-afternoon":"common"})));

const option=(id,label,effects={})=>Object.freeze({id,label,effects:Object.freeze(effects)});
export const DAY8_V3_CHOICES=Object.freeze([
  {number:1,key:"contactPlan",prompt:"하은에게 오늘을 말하기",options:[option("contact-evening-call","오늘 오후에 지훈 만나려고. 저녁에 통화할래?",{callAppointment:"19:00"}),option("contact-friend-then-rest","오늘은 친구 만나고 혼자 좀 쉬려고.",{restPlanned:true}),option("contact-ask-haeun-first","오늘 시간 있어? 지훈이 만나자는데.",{permissionMixAcknowledged:true})]},
  {number:2,key:"jihoonPreparation",prompt:"지훈에게 먼저 보내는 말",options:[option("prepare-one-photo","사진 있으면 한 장만 가져와.",{photoRequested:true}),option("prepare-your-present","오늘은 옛날 얘기 말고 네 얘기 듣자.",{presentFirst:true}),option("prepare-nothing","아무 준비 말고 밥이나 먹자.",{noPreparation:true})]},
  {number:3,key:"mealChoice",prompt:"점심을 고르기",options:[option("meal-jjajang","짜장면 먹을래. 네 짬뽕은 구경만.",{meal:"jjajang"}),option("meal-share-tangsuyuk","작은 탕수육 하나 나눠 먹자.",{meal:"shared-tangsuyuk"}),option("meal-jjamppong","네가 그렇게 빨리 고른 이유 좀 보자. 나도 짬뽕.",{meal:"jjamppong"})]},
  {number:4,key:"withdrawalResponse",prompt:"지훈의 짧은 대답 앞에서",options:[option("withdrawal-leave-space","일 얘기 하기 싫으면 안 해도 돼.",{response:"SPACE"}),option("withdrawal-check-now","너 지금 괜찮아?",{response:"CHECK"}),option("withdrawal-invite-unknown","내가 모르는 일이라도 말해 봐.",{response:"INVITE"})]},
  {number:5,key:"listeningStrategy",prompt:"친구에게 필요한 답",options:[option("listen-without-fixing","다시 말해 봐. 이번엔 고치려고 안 들을게.",{listening:"NO_FIX"}),option("listen-for-good-reason","그래도 네가 좋았던 이유는 궁금해.",{listening:"MEANING"}),option("offer-concrete-help","내가 도울 수 있는 게 있으면 같이 보자.",{listening:"HELP"})]},
  {number:6,key:"afternoonRoute",prompt:"남은 오후",options:[option("route-live-house","같이 가자. 네가 좋아하는 것도 보고 싶어.",{route:"LIVE_HOUSE"}),option("route-quiet-cafe","나는 조금 조용한 데서 더 얘기하고 싶어.",{route:"CAFE"}),option("route-home-rest","오늘은 여기까지. 다음에 공연 같이 보자.",{route:"HOME",restRoute:true})]},
  {number:7,key:"haeunContact",prompt:"보고 싶은 마음",options:[option("haeun-ask-film","영화 끝나면 어땠는지 알려 줘.",{contact:"ASK_FILM"}),option("haeun-no-pressure-thought","나 지금 네 생각 났어. 답은 나중에 해.",{contact:"NO_PRESSURE"}),option("haeun-stay-present","휴대폰을 넣고 하던 시간을 보낸다.",{contact:"NONE"})]},
  {number:8,key:"scheduleChange",prompt:"지금 바꾸려는 약속",options:[option("schedule-warn-early","조금 늦어질 것 같아. 먼저 말하자.",{schedule:"EARLY_NOTICE"}),option("schedule-keep-time","오늘은 여기까지. 내가 정한 시간은 지킬래.",{schedule:"KEEP_TIME"}),option("schedule-explain-later","괜찮겠지. 이유는 나중에 말하자.",{schedule:"LATE_NOTICE"})]},
  {number:9,key:"lateRecovery",prompt:"하은에게 답하기",options:[option("late-honest-long-talk","오늘 말이야, 생각보다 오래 얘기했어.",{truth:"HONEST"}),option("late-apologize-wanted-more","잠깐 더 있고 싶었어. 말 늦어서 미안해.",{truth:"HONEST_APOLOGY"}),option("late-false-transit","이동이 늦어졌어.",{truth:"FALSE_TRANSIT"}),option("late-rest-tomorrow","내일 이야기할까? 오늘은 좀 쉬고 싶어.",{truth:"REST_BOUNDARY"})]},
  {number:10,key:"privacyDebrief",prompt:"지훈의 오후를 전하기",options:[option("debrief-public-credit","지훈 이름이 나온 영상을 같이 봤어.",{privacy:"PUBLIC_CREDIT"}),option("debrief-private-boundary","친구도 힘든 일이 있더라. 자세한 건 그 친구 얘기니까.",{privacy:"PROTECTED"}),option("debrief-friend-again","나 오늘 친구로 좀 다시 시작한 것 같아.",{privacy:"EMOTIONAL_TRUTH"})]}
].map(choice=>Object.freeze({...choice,options:Object.freeze(choice.options)})));

export const DAY8_V3_SAVE_KEYS=Object.freeze(["day8ScenarioVersion","day8V3ChoiceIndex","day8V3SceneCheckpoint","day8V3ContactPlan","day8V3JihoonPreparation","day8V3MealChoice","day8V3WithdrawalResponse","day8V3ListeningStrategy","day8V3AfternoonRoute","day8V3HaeunContactChoice","day8V3ScheduleChangeChoice","day8V3LateRecoveryResponse","day8V3PrivacyDebriefChoice","day8V3CallAppointment","day8V3ActualLate","day8V3ExplanationTruth","day8V3RestRoute","day8V3JihoonDisclosureDepth","day8V3PrivateWorkProtected","day8V3PublicCreditSeen","day8V3Complete","day9ClothingColorInvitationPending"]);

export function validateDay8V3CampaignData(){
  const ids=DAY8_V3_CHOICES.flatMap(choice=>choice.options.map(item=>item.id));
  return DAY8_V3_SCENES.length===24&&DAY8_V3_SCENES.every((scene,index)=>scene.number===index+1)&&DAY8_V3_CHOICES.length===10&&DAY8_V3_CHOICES.every((choice,index)=>choice.number===index+1&&(choice.number===9?choice.options.length===4:choice.options.length===3))&&new Set(ids).size===ids.length&&DAY8_V3_SCENES.filter(scene=>scene.route!=="common").length===1&&DAY8_V3_SAVE_KEYS.length===22;
}
