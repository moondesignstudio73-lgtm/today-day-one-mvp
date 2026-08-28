export const DAY7_V3_VERSION=3;
export const DAY7_V3_SCENE_ID="m30-day7-first-present-date";

export const DAY7_V3_CONTRACT=Object.freeze({
  day:7,title:"끝까지 듣는 사람",timeWindow:"morning-to-night",chapterType:"romance/daily-life/amnesia-mystery-hybrid",
  targetPlaytimeMinutes:[25,35],participants:["protagonist","haeun","seojin","jihoon"],
  prerequisites:["m30-day6-neighborhood","day6V3Complete"],
  dramaticPurpose:"같은 것을 좋아하는 대신 서로 다른 관심과 속도를 끝까지 견디는 현재형 데이트를 만든다.",
  wants:{protagonist:"과거 사진에 대한 호기심과 오늘 하은에게 집중하려는 마음을 동시에 정직하게 다룬다.",haeun:"자기 취향과 카드의 마음을 설명할 공간을 얻고 기억 관리자 역할 밖에서 데이트를 즐긴다.",seojin:"사진을 보낼 동의를 구하고 업무 기억과 개인 관심의 거리를 상대가 정하게 둔다.",jihoon:"이유 없는 연락도 가능한 현재 친구 관계를 확인한다."},
  emotionalCurve:["기대","과거 사진의 작은 흔들림","서로 다른 취향의 발견","카드의 설렘","사생활과 정직의 긴장","현재 접촉의 재확인","각자의 다음 날"],
  relationshipBudget:{haeun:"관심 속도·정직·접촉 동의",seojin:"업무 사진 수신과 개인 관심을 분리",jihoon:"DAY 8 독립 시간 훅"},
  clueBudget:{mustReveal:["회사 단체 행사 사진은 평범한 종이 왕관 수선 장면일 수 있다","하은은 같은 대상을 같은 속도로 보지 않아도 함께 있을 수 있다고 말한다"],mayReveal:["주인공은 보지 않은 사진을 그럴듯하게 상상한다"],mustNotReveal:["fake-haeun-truth","accident-cause","small-key","new-secret-person"]}
});

export const DAY7_V3_VOICE_PROFILES=Object.freeze({
  protagonist:{rhythm:"짧은 관찰 뒤 확인 질문",humor:"상대의 구체적 행동을 받아치는 건조한 농담",reasoning:["observe","possibilities","verify","judge","act"]},
  haeun:{rhythm:"짧은 생활어와 한 박자 늦은 진심",humor:"가방·책·인형·카드 같은 손에 잡히는 대상",boundary:"궁금해도 상대가 보류하면 질문을 바꾼다"},
  seojin:{rhythm:"정확한 사실 뒤 짧은 개인 문장",boundary:"사진 전송 전 동의를 구하고 거절 뒤 추가 전송하지 않는다",axes:["AFFECTION","STATUS_INTEREST"]},
  jihoon:{rhythm:"거친 농담 뒤 작아지는 진심",role:"연애 상대가 아닌 현재 친구 관계의 독립 축"}
});

export const DAY7_V3_KNOWLEDGE_LEDGER=Object.freeze({
  protagonist:{knows:["DAY 6 카드·노래·사진 알림","오늘의 세 후보"],suspects:["과거 회사 사진이 현재 자신을 설명할 수도 있다"],doesNotKnow:["사진 내용은 수신 전 모름","하은 카드의 최종 문장"],wants:["오늘 하은의 취향을 직접 보기"]},
  haeun:{knows:["DAY 6에서 정한 세 후보","자신이 쓴 카드 문장"],doesNotKnow:["선택 4 공개 전 서진 사진 연락","주인공의 미수신 사진 상상"],wants:["자기 속도로 좋아하는 것을 보기"],fears:["현재 데이트가 과거 확인 시험이 되는 것"]},
  seojin:{knows:["사진이 회사 단체 행사 사진임","주인공이 왕관을 고치던 이유"],doesNotKnow:["하은에게 공개한 범위"],wants:["전송 동의와 다음 대화 거리 확인"]},
  jihoon:{knows:["주인공과 하은이 DAY 6에 만남"],doesNotKnow:["서진 사진 연락","오늘 데이트 경로"],wants:["이유 없이도 전화 가능한 친구 관계"]}
});

const sceneTitles=["먼저 온 두 사람","부탁한 적 없는 사진","세 가지 내일 중 하나","만나기 전의 두 시간","남겨 둔 말","무슨 연락이었어?","입구에서 고르는 것","야경: 아직 안 켜진 도시","놀이공원: 지나가는 것을 기다리기","서점: 두꺼운 책을 고르는 이유","속도를 맞춘다는 말","손안의 작은 행사","함께 보는 쪽","듣기 좋은 답 아닌 것","저녁을 고르는 일","잘 고른 사람과 맛있게 먹는 사람","고치다 남은 문장","남겨 두지 않는 말","사진을 받을 시간","같은 화면, 다른 마음","오늘의 손","들고 돌아가는 것","오늘 네가 고른 속도","내일 비어 있는 오후"];
const choiceAt={2:1,3:2,4:3,6:4,7:5,13:6,15:7,18:8,19:9,20:10,21:11};
const routeOnly={8:"night-view",9:"theme-park",10:"book-and-dinner"};
export const DAY7_V3_SCENES=Object.freeze(sceneTitles.map((title,index)=>Object.freeze({number:index+1,id:`D7V3_S${String(index+1).padStart(2,"0")}`,title,choiceNumber:choiceAt[index+1]??null,route:routeOnly[index+1]??"common"})));

const option=(id,label,effects={})=>Object.freeze({id,label,effects:Object.freeze(effects)});
export const DAY7_V3_CHOICES=Object.freeze([
  {number:1,key:"photoReceipt",prompt:"서진에게 답장",options:[option("photo-send-now","궁금해요. 보내 주세요.",{photoState:"RECEIVED_NOW"}),option("photo-send-evening","오늘 약속이 있어서요. 저녁에 볼게요.",{photoState:"DEFERRED"}),option("photo-decline","지금은 보고 싶지 않아요.",{photoState:"DECLINED"})]},
  {number:2,key:"dateRoute",prompt:"오늘 가고 싶은 곳",options:[option("route-night-view","야경 보자. 불 켜지는 시간부터 같이.",{route:"night-view"}),option("route-theme-park","놀이공원 가고 싶어. 천천히 구경하면서.",{route:"theme-park"}),option("route-book-dinner","서점과 저녁. 네가 고르는 책이 궁금해.",{route:"book-and-dinner"})]},
  {number:3,key:"morningTime",prompt:"남은 시간",options:[option("morning-rest","잠깐 누워서 쉬고 나간다.",{energy:"PRESERVED"}),option("morning-song","어제 적은 노래를 끝까지 들어 본다.",{songFinished:true}),option("morning-call-jihoon","지훈에게 먼저 전화를 건다.",{jihoonCalled:true})]},
  {number:4,key:"photoDisclosure",prompt:"아침의 이야기를 꺼내는 방식",options:[option("disclose-photo","서진 씨가 옛날 사진을 찾았대.",{disclosure:"PHOTO_FACT"}),option("disclose-company-boundary","회사 사람이랑. 내용은 나도 좀 생각하고 싶어.",{disclosure:"COMPANY_ONLY"}),option("disclose-dismiss","별일 아니었어.",{disclosure:"FALSE_DISMISSAL"})]},
  {number:5,key:"attentionPace",prompt:"하은의 시간을 함께 보내는 방법",options:[option("pace-haeun-first","네가 보고 싶은 걸 먼저 보자.",{pace:"HAEUN_FIRST"}),option("pace-separate-return","나는 다른 쪽이 궁금해. 잠깐 따로 보고 만날까?",{pace:"SEPARATE_RETURN"}),option("pace-alternate","같이 하나씩 골라 보자.",{pace:"ALTERNATE"})]},
  {number:6,key:"conversationLead",prompt:"지금 하고 싶은 이야기",options:[option("talk-my-confusion","조금만 얘기해도 돼? 나도 정리가 안 돼서.",{lead:"PROTAGONIST"}),option("listen-to-haeun","오늘은 네 얘기를 더 듣고 싶어.",{lead:"HAEUN"}),option("admit-earlier-evasion","아까 별일 아니라고 한 건, 사실 피한 거야.",{lead:"REPAIR",requires:{choiceId:"disclose-dismiss"}})]},
  {number:7,key:"dinnerScale",prompt:"저녁의 크기",options:[option("dinner-full","오늘은 제대로 먹고 싶어.",{scale:"FULL"}),option("dinner-light","나는 좀 가볍게 먹고 싶어. 돈도 아끼고.",{scale:"LIGHT"}),option("dinner-independent","우리 각자 먹고 싶은 걸 고르자.",{scale:"INDEPENDENT"})]},
  {number:8,key:"cardResponse",prompt:"하은의 문장에 답하기",options:[option("card-tease-smile","나는 지금도 웃고 있는데.",{response:"PLAYFUL"}),option("card-mutual-next","나도 내일 네 얼굴 보고 싶어.",{response:"MUTUAL"}),option("card-admit-fear","이거 받으니까 조금 무섭기도 해.",{response:"VULNERABLE"})]},
  {number:9,key:"seojinDistance",prompt:"서진에게 남기는 거리",options:[option("seojin-work-next","챙겨 줘서 고마워요. 다음 회사 방문 때 이야기해요.",{distance:"WORK_ONLY"}),option("seojin-personal-interest","회사 얘기 말고 서진 씨 얘기도 듣고 싶어요.",{distance:"PERSONAL_INTEREST"}),option("seojin-close-today","오늘은 여기까지 할게요. 좋은 저녁 보내세요.",{distance:"CLOSE_TODAY"})]},
  {number:10,key:"conversationExplanation",prompt:"방금 대화에 대해",options:[option("explain-honestly","응. 어떤 얘기였는지 말해 줄게.",{explanation:"HONEST"}),option("keep-private-now","응. 오늘은 내 안에 조금 두고 싶어.",{explanation:"PRIVATE_BOUNDARY"}),option("claim-work-only","회사 얘기만 했어.",{explanation:"WORK_ONLY_CLAIM"})]},
  {number:11,key:"currentContact",prompt:"곁에 있는 방법",options:[option("contact-offer-hand","손을 내민다.",{contact:"OFFER_HAND"}),option("contact-walk-beside","오늘은 그냥 옆에서 걸을게.",{contact:"WALK_BESIDE"}),option("contact-talk-more","나 지금 무슨 생각 하는지 더 말해도 돼?",{contact:"TALK_MORE"})]}
].map(choice=>Object.freeze({...choice,options:Object.freeze(choice.options)})));

export const DAY7_V3_SAVE_KEYS=Object.freeze(["day7V3Version","day7V3ChoiceIndex","day7V3SceneCheckpoint","day7V3PhotoState","day7V3DateRoute","day7V3MorningTime","day7V3PhotoDisclosure","day7V3AttentionPace","day7V3ConversationLead","day7V3DinnerScale","day7V3CardResponse","day7V3SeojinDistance","day7V3ConversationExplanation","day7V3CurrentContact","day7V3LieRecorded","day7V3HandOutcome","day7V3Complete","day8JihoonInvitationPending"]);

export function validateDay7V3CampaignData(){
  const numbers=DAY7_V3_SCENES.map(scene=>scene.number),choiceNumbers=DAY7_V3_CHOICES.map(choice=>choice.number);
  const ids=DAY7_V3_CHOICES.flatMap(choice=>choice.options.map(item=>item.id));
  return numbers.length===24&&numbers.every((n,i)=>n===i+1)&&choiceNumbers.length===11&&choiceNumbers.every((n,i)=>n===i+1)&&DAY7_V3_CHOICES.every(choice=>choice.options.length===3)&&new Set(ids).size===ids.length&&DAY7_V3_SCENES.filter(scene=>scene.route!=="common").length===3&&DAY7_V3_SAVE_KEYS.length===18;
}
