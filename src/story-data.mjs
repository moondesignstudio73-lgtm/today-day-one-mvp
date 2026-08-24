import { HIDDEN_ROUTE_SCENES } from "./hidden-route-data.mjs";
import { HEROINE_STORY_SCENES } from "./heroine-data.mjs";

export const MARRIAGE_30_STORY_SCENES = [{
  id:"m30-day1-hospital-awakening",arc:"잃어버린 1년",window:[1,1],priority:1000,bgm:"theme",modes:["marriage-in-30-days"],heroineIds:["haeun"],
  title:"눈을 뜨다",speaker:"하은",message:"어둠이 걷힌 자리에는 병원의 하얀 천장과 일정한 기계음이 있었다. 고개를 돌리자 보라색 머리의 여자가 침대 곁에서 잠들어 있었다.",
  dramaticPurpose:"자기 정체성까지 잃은 공포를 체감시키고, 하은의 애정과 30일 뒤 결혼 약속, 사고로 잃은 부모님, 망가진 몸을 차례로 받아들이게 한다.",
  emotionalCurve:["혼란 2","안도 4","낯섦 5","경계 6","생활적 온기 4","결혼 통보 7","부모의 죽음 9","기립 실패 8","회복 의지 5"],
  knowledgeLedger:{
    protagonist:{KNOWS:["병원에서 깨어났다","자신의 이름과 최근 기억이 비어 있다"],BELIEVES:[],SUSPECTS:["부상과 기억 손실이 연결돼 있다"],DOES_NOT_KNOW:["하은과의 과거","사고 경위","부모님의 생사","결혼 약속"],HIDES:["낯선 사람의 포옹이 두렵다"],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["현재 상태를 사실부터 확인한다","몸을 스스로 움직인다"],FEARS:["자신이 누구인지 끝내 기억하지 못하는 것"]},
    haeun:{KNOWS:["주인공이 1년 만에 깨어났다","자신은 23세다","두 사람은 30일 뒤 결혼하기로 했다","사고로 주인공의 부모가 사망했다","의사가 자극적인 기억 확인을 피하라고 했다"],BELIEVES:["일상부터 되찾는 것이 회복에 도움이 된다"],SUSPECTS:[],DOES_NOT_KNOW:["주인공이 무엇을 언제 떠올릴지"],HIDES:["지금 말하면 부담이 될 과거의 세부사항"],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["주인공을 안심시키고 곁에 머문다"],FEARS:["주인공이 자신을 완전히 낯선 사람으로 밀어내는 것"]},
    doctor:{KNOWS:["혼수 기간","기억 검사 결과","현재 활력징후"],BELIEVES:["회복 속도를 단정할 수 없다"],SUSPECTS:[],DOES_NOT_KNOW:["사고 전 사적 관계"],HIDES:[],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["환자가 무리하지 않고 기본 검사를 받는다"],FEARS:["과도한 자극으로 환자가 불안정해지는 것"]}
  },
  dialogueTurns:[
    {type:"narration",text:"눈꺼풀을 올리는 일부터 힘이 들었다. 천장 모서리의 물자국, 왼손의 수액, 목 안쪽의 마른 통증이 하나씩 형태를 얻었다."},
    {type:"narration",text:"침대 곁의 여자가 고개를 들었다. 보라색 머리카락 사이로 눈이 마주친 순간, 그녀의 손에서 종이컵이 찌그러졌다."},
    {type:"dialogue",speaker:"하은",text:"드… 드디어. 잠깐만. 선생님부터— 아니, 나 한 번만 봐 줘. 진짜 깨어난 거 맞지?",expressionId:"worried"},
    {type:"narration",text:"그녀가 내 어깨를 감싸 안았다. 따뜻한 체온과 떨리는 숨이 먼저 닿았다. 얼굴은 아름다웠지만, 이름도 관계도 떠오르지 않았다."},
    {type:"dialogue",speaker:"나",text:"저기… 미안한데. 누구지?",expressionId:"calm"},
    {type:"dialogue",speaker:"하은",text:"……나?",expressionId:"worried"},
    {type:"dialogue",speaker:"나",text:"당신도 모르겠고, 여기가 어딘지도 모르겠어. 내 이름도.",expressionId:"calm"},
    {type:"narration",text:"하은은 팔을 풀고 반 걸음 물러났다. 울음을 닦는 대신 호출 버튼을 눌렀다. 내 손이 닿을 자리는 비워 두었다."},
    {type:"dialogue",speaker:"담당 의사",text:"교통사고 후 정확히 1년입니다. 이름과 과거 기억에 손상이 있지만, 지금 대화를 이해하고 판단하는 능력은 유지되고 있습니다. 질문은 한 번에 하나씩 하겠습니다.",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"먼저 저 사람부터. 내가 아는 사람이 맞습니까?",expressionId:"calm"},
    {type:"dialogue",speaker:"하은",text:"이하은. 스물세 살. 네 여자친구야. 지금은 그것만 믿으라는 말 안 할게. 확인하고 싶은 건 확인해.",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"여자친구라고?",expressionId:"calm"},
    {type:"dialogue",speaker:"하은",text:"응. 그리고 이건 더 천천히 말해야 하는데… 우리, 30일 뒤에 결혼하기로 했어. 날짜도 네가 골랐고.",expressionId:"worried"},
    {type:"narration",text:"모르는 사람과의 결혼식이 달력 어딘가에 잡혀 있었다. 하은은 대답을 재촉하지 않고 구겨진 종이컵을 새 컵으로 바꿨다."},
    {type:"dialogue",speaker:"나",text:"사고는 어떻게 났지? 부모님은?",expressionId:"calm"},
    {type:"narration",text:"하은의 손이 물병 뚜껑 위에서 멈췄다. 담당 의사가 의자를 당겨 침대 가까이 앉았다."},
    {type:"dialogue",speaker:"담당 의사",text:"가족 여행 중 트럭과 충돌했습니다. 하은 씨는 비교적 가벼운 부상이었고, 환자분이 몸으로 감싼 정황이 있습니다. 부모님 두 분은… 현장에서 돌아가셨습니다.",expressionId:"worried"},
    {type:"narration",text:"슬퍼해야 할 얼굴조차 떠오르지 않았다. 그 사실이 죽음 자체보다 먼저 숨을 막았다."},
    {type:"dialogue",speaker:"하은",text:"사진은 있어. 지금 보자고 안 할게. 네가 준비되면, 한 장씩 같이 보자.",expressionId:"worried"},
    {type:"narration",text:"침대 난간을 잡고 몸을 일으켰다. 다리는 내 것이 아닌 것처럼 떨렸고, 발바닥이 바닥을 찾기도 전에 무릎이 접혔다."},
    {type:"dialogue",speaker:"하은",text:"잡을게. 싫으면 바로 놓을게. 하나만 말해 줘.",expressionId:"worried"},
    {type:"dialogue",speaker:"나",text:"…잠깐. 내가 정할게.",expressionId:"calm"}
  ],
  presentation:{backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing"},
  choices:[
    {id:"set-boundary",label:"하은에게 한 걸음 물러나 달라고 하고 의료 기록부터 확인한다",effects:{trust:2,confidence:7},scenarioEffects:{investigation:10,suspicion:3,memoryRecovery:2},clues:["coma-one-year","parents-died-in-collision"],profileUnlocks:["haeun-basic"],followUpHooks:["day2-rehabilitation"],response:"“알겠어. 네가 먼저 부를 때까지 여기 있을게.” 하은은 침대 끝에서 한 걸음 물러났다. 의사는 사고 날짜와 검사 순서를 적은 종이를 내 손에 건넸다.",memory:"하은과 거리를 두고 사고의 확인 가능한 사실부터 정리함"},
    {id:"accept-support",label:"지금은 하은의 팔을 잡고 다시 침대에 앉는다",effects:{affection:12,trust:10,health:2},scenarioEffects:{haeunAffection:14,haeunTrust:10,haeunDependency:5,memoryRecovery:2},clues:["coma-one-year","parents-died-in-collision"],profileUnlocks:["haeun-basic"],unlockedActions:["ask-daily-routine"],followUpHooks:["day2-rehabilitation"],response:"하은은 겨드랑이를 들지 않고 팔꿈치만 받쳤다. 내가 침대에 앉자 그제야 숨을 내쉬었다. “오늘은 여기까지. 결혼 얘기도, 기억 얘기도 네 속도로 하자.”",memory:"깨어난 날 하은의 도움을 받아 다시 침대에 앉음"},
    {id:"controlled-help",label:"간호사를 부르고 하은에게는 옆에서 상태만 말해 달라고 한다",effects:{trust:6,confidence:8,health:3},scenarioEffects:{investigation:6,haeunTrust:7,memoryRecovery:3},clues:["coma-one-year","parents-died-in-collision"],profileUnlocks:["haeun-basic"],unlockedActions:["review-medical-plan"],followUpHooks:["day2-rehabilitation"],response:"간호사가 자세를 바로잡는 동안 하은은 어지럼 여부와 통증 위치만 물었다. 내가 고개를 들자 “지시 잘하네. 그건 그대로야.”라며 처음으로 작게 웃었다.",memory:"도움의 범위를 직접 정하고 첫 기립 실패를 수습함"}
  ]
},{
  id:"m30-day2-rehabilitation",arc:"다시 걷는 연습",window:[2,2],priority:1000,bgm:"theme",modes:["marriage-in-30-days"],heroineIds:["haeun"],requires:{sceneId:"m30-day1-hospital-awakening"},
  title:"세 걸음의 거리",speaker:"하은",message:"재활실 평행봉 끝에 하은이 운동화를 든 채 기다렸다. 끈은 이미 느슨하게 풀려 있었다.",
  dramaticPurpose:"하은의 돌봄을 통제보다 실용적인 배려로 보여 주고, 주인공이 회복 방식을 스스로 선택하게 한다.",
  knowledgeLedger:{
    protagonist:{KNOWS:["1년 동안 근력이 크게 줄었다","하은이 병실 물품과 일정을 챙겼다"],BELIEVES:["회복에는 반복 훈련이 필요하다"],SUSPECTS:[],DOES_NOT_KNOW:["사고 전 자신의 재활 경험","하은과의 생활 방식"],HIDES:["서 있는 것만으로 겁이 난다"],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["스스로 움직일 수 있음을 확인한다"],FEARS:["하은에게 전적으로 의존하게 되는 것"]},
    haeun:{KNOWS:["주인공이 도움받는 것을 답답해한다","물리치료사의 안전 지침"],BELIEVES:["선택권을 주는 편이 주인공을 안심시킨다"],SUSPECTS:[],DOES_NOT_KNOW:["주인공이 느끼는 공포의 크기"],HIDES:["밤새 병실 의자에서 잤다"],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["주인공이 안전하게 첫 걸음을 끝낸다"],FEARS:["넘어져 회복이 늦어지는 것"]},
    therapist:{KNOWS:["오늘 가능한 운동 범위","낙상 위험"],BELIEVES:["환자가 속도를 선택해야 훈련이 지속된다"],SUSPECTS:[],DOES_NOT_KNOW:["두 사람의 관계 세부"],HIDES:[],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["보조 하에 세 걸음을 완수한다"],FEARS:["환자가 무리해 다치는 것"]}
  },
  dialogueTurns:[
    {type:"dialogue",speaker:"하은",text:"운동화 끈은 풀어 놨어. 신겨 주면 자존심 상할 것 같아서 여기까지만 서비스.",expressionId:"smile"},
    {type:"dialogue",speaker:"나",text:"내가 그런 걸 싫어했어?",expressionId:"calm"},
    {type:"dialogue",speaker:"하은",text:"도움 자체보다, 묻지도 않고 도와주는 걸 싫어했지. 오늘도 같으면 네가 정해.",expressionId:"smile"},
    {type:"dialogue",speaker:"물리치료사",text:"목표는 세 걸음입니다. 손을 잡을지, 난간만 잡을지 먼저 선택하세요. 중간에 바꿔도 실패가 아닙니다.",expressionId:"calm"}
  ],
  presentation:{backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing"},
  choices:[
    {id:"take-her-hand",label:"하은의 손을 잡고 세 걸음을 완주한다",effects:{affection:9,trust:10,health:4,energy:-5},scenarioEffects:{haeunAffection:10,haeunTrust:8,memoryRecovery:2},unlockedActions:["rehab-with-haeun"],followUpHooks:["day3-discharge-phone"],response:"하은은 힘을 주어 끌지 않고 손바닥만 받쳤다. 세 번째 걸음 뒤에야 “봤지? 내 역할 별로 없었어.” 하고 웃었다.",memory:"하은의 손을 잡고 재활 첫 세 걸음을 걸음"},
    {id:"use-the-rail",label:"난간만 잡고 걷되 하은에게 걸음 수를 세어 달라고 한다",effects:{confidence:9,health:5,energy:-7,trust:5},scenarioEffects:{investigation:2,memoryRecovery:4,haeunTrust:5},unlockedActions:["solo-rehabilitation"],followUpHooks:["day3-discharge-phone"],response:"“하나. 둘.” 하은은 손을 내밀지 않았다. 마지막 숫자는 내가 선 뒤 한 박자 늦게 말했다. “셋. 됐다.”",memory:"스스로 걷고 하은에게 걸음 수만 부탁함"},
    {id:"review-the-plan",label:"오늘 무리하지 않고 치료사와 일주일 계획부터 세운다",effects:{confidence:6,health:3,work:2},scenarioEffects:{investigation:4,haeunTrust:3},clues:["rehabilitation-schedule"],unlockedActions:["review-medical-plan"],followUpHooks:["day3-discharge-phone"],response:"치료사는 운동 횟수와 중단 기준을 적었다. 하은은 일정표 사진을 찍고 “감독은 안 하고 알람만 맡을게.”라고 말했다.",memory:"재활 속도와 중단 기준을 직접 정함"}
  ]
},{
  id:"m30-day3-discharge-phone",arc:"병원 밖으로",window:[3,3],priority:1000,bgm:"theme",modes:["marriage-in-30-days"],heroineIds:["haeun"],requires:{sceneId:"m30-day2-rehabilitation"},
  title:"돌아온 휴대폰",speaker:"하은",message:"퇴원 서류 위에 오래된 휴대폰과 병원 보관 봉투가 놓였다. 액정 한쪽에는 사고 때 생긴 금이 남아 있었다.",
  dramaticPurpose:"퇴원을 생활 회복의 전환점으로 만들고 스마트폰을 조사와 관계 회복의 공용 도구로 해금한다.",
  knowledgeLedger:{
    protagonist:{KNOWS:["오늘 퇴원한다","휴대폰은 사고 뒤 병원이 보관했다"],BELIEVES:["기록은 기억과 별개로 확인할 수 있다"],SUSPECTS:["휴대폰에 사고 전 생활 정보가 남아 있을 수 있다"],DOES_NOT_KNOW:["잠금 암호","최근 백업 상태"],HIDES:["알림을 보는 일이 두렵다"],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["기기를 자신의 기준으로 확인한다"],FEARS:["기록 속 자신이 낯설게 느껴지는 것"]},
    haeun:{KNOWS:["휴대폰 잠금 암호의 단서","퇴원 뒤 복약 일정"],BELIEVES:["휴대폰을 돌려주는 것이 주인공의 선택권을 회복시킨다"],SUSPECTS:[],DOES_NOT_KNOW:["어떤 기록이 남아 있는지"],HIDES:["알림을 대신 확인하고 싶은 충동"],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["퇴원 준비를 실수 없이 끝낸다"],FEARS:["기록이 주인공을 한꺼번에 압도하는 것"]},
    nurse:{KNOWS:["보관 봉투 인계 절차","복약과 외래 일정"],BELIEVES:["기기 확인은 환자가 직접 해야 한다"],SUSPECTS:[],DOES_NOT_KNOW:["휴대폰 내용과 두 사람의 과거"],HIDES:[],LIES_ABOUT:[],MISREMEMBERS:[],WANTS:["인계 확인과 퇴원 교육을 마친다"],FEARS:["분실 또는 복약 누락"]}
  },
  dialogueTurns:[
    {type:"dialogue",speaker:"간호사",text:"보관 봉투는 본인이 개봉해 주세요. 휴대폰, 지갑, 열쇠 세 가지입니다. 확인 뒤 서명하시면 됩니다.",expressionId:"calm"},
    {type:"dialogue",speaker:"나",text:"암호가 기억나지 않으면?",expressionId:"calm"},
    {type:"dialogue",speaker:"하은",text:"힌트까지만 줄게. 네가 매일 보는 숫자였어. 틀리면 내 탓 말고 과거의 네 탓.",expressionId:"smile"},
    {type:"dialogue",speaker:"나",text:"열어 보고 싶은데, 뭐가 나올지는 겁나네.",expressionId:"worried"},
    {type:"dialogue",speaker:"하은",text:"그럼 순서를 정하자. 오늘 필요한 것부터. 약 알람, 집 주소, 그리고… 배달 앱 단골 메뉴 정도.",expressionId:"smile"}
  ],
  presentation:{backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"phone"},
  choices:[
    {id:"inspect-system-first",label:"계정·날짜·백업 상태부터 직접 확인한다",effects:{confidence:7,trust:3},scenarioEffects:{investigation:8,memoryRecovery:3},clues:["phone-return-receipt"],unlockedActions:["smartphone-basic","inspect-phone-system"],profileUnlocks:["haeun-contact"],followUpHooks:["day4-arrive-home"],response:"잠금 화면의 날짜와 계정 이름부터 적었다. 사진과 메시지는 닫아 둔 채, 확인한 사실과 아직 보지 않은 영역을 구분했다.",outcomes:[{conditions:[{storyChoice:{sceneId:"m30-day1-hospital-awakening",choiceIds:["set-boundary"]}}],effects:{confidence:3},scenarioEffects:{investigation:3},response:"병원에서 받은 사고 날짜와 기기 백업 날짜를 나란히 적었다. 아직 결론은 없지만 확인 순서는 분명해졌다."}],memory:"돌아온 휴대폰의 시스템 정보부터 확인함"},
    {id:"set-up-together",label:"하은과 복약 알람과 필수 연락처만 함께 설정한다",effects:{affection:8,trust:10},scenarioEffects:{haeunAffection:8,haeunTrust:10,memoryRecovery:2},clues:["phone-return-receipt"],unlockedActions:["smartphone-basic","call-haeun"],profileUnlocks:["haeun-contact"],followUpHooks:["day4-arrive-home"],response:"하은은 자신의 번호를 ‘하은’이라고만 저장했다. 하트를 붙였다가 내 얼굴을 보고 지운 뒤, “이건 네가 기억나면 직접.”이라고 말했다.",outcomes:[{conditions:[{storyChoice:{sceneId:"m30-day2-rehabilitation",choiceIds:["take-her-hand"]}}],effects:{affection:4},scenarioEffects:{haeunAffection:4},response:"알람 설정을 마친 하은이 손을 내밀었다. 어제처럼 이번에도 잡을지는 내 쪽에서 정할 수 있게, 손바닥만 펴 둔 채였다."}],memory:"하은과 휴대폰의 필수 기능만 다시 설정함"},
    {id:"seal-until-home",label:"인계 목록만 대조하고 내용 확인은 집에서 하기로 한다",effects:{confidence:8,stress:-4,trust:4},scenarioEffects:{investigation:4,haeunTrust:4},clues:["phone-return-receipt"],unlockedActions:["smartphone-basic","inspect-phone-at-home"],profileUnlocks:["haeun-contact"],followUpHooks:["day4-arrive-home"],response:"휴대폰, 지갑, 열쇠를 목록과 대조한 뒤 다시 봉투에 넣었다. 하은은 재촉하지 않고 봉투를 내 가방 맨 위에 놓았다.",memory:"휴대폰 기록 확인을 집에 도착한 뒤로 미룸"}
  ]
}];

const STANDARD_STORY_SCENES = [
  {
    id:"unread-message", arc:"읽지 않은 메시지", window:[2,3], priority:100, bgm:"theme",
    title:"오늘 좀 힘들었어", speaker:"여자친구", message:"바쁜 오후, 짧지만 평소와 다른 메시지가 도착했다.",
    choices:[
      {id:"reply-now",label:"하던 일을 멈추고 바로 답장한다",effects:{trust:12,affection:8,work:-3},response:"“바쁜데도 들어줘서 고마워. 오늘은 그 말이 꼭 필요했어.”",memory:"힘든 날 바로 답해 준 메시지"},
      {id:"reply-later",label:"일을 끝낸 뒤 제대로 답장한다",effects:{trust:3,work:3},response:"“응, 일 끝났구나. 사실 아까는 조금 서운했어.”",memory:"늦었지만 차분히 이어 간 대화"},
      {id:"ignore",label:"별일 아니라고 생각하고 넘긴다",effects:{trust:-12,relationshipStress:8},response:"읽음 표시만 남은 화면 뒤로 대화가 조용히 끊겼다.",flags:{ignoredHardDay:true},memory:"답하지 못한 힘든 날의 메시지"}
    ]
  },
  {
    id:"contact-boundary", arc:"우리 정말 잘 맞는 걸까?", window:[4,6], priority:95, bgm:"theme",
    title:"연락, 어느 정도가 좋아?", speaker:"여자친구", message:"서로의 하루를 공유하는 방식이 조금씩 다르다는 걸 느끼기 시작했다.",
    choices:[
      {id:"frequent",label:"틈날 때마다 자주 연락하자",effects:{},response:"우리에게 맞는 연락 속도를 찾아보기로 했다.",outcomes:[
        {conditions:[{stat:"partner.personality.contactImportance",operator:">=",value:60}],effects:{affection:15,trust:10},response:"“나도 그래. 짧게라도 네 소식을 알면 안심돼.”"},
        {conditions:[{stat:"partner.personality.independence",operator:">=",value:65}],effects:{affection:-5,relationshipStress:6},response:"“마음은 고마운데, 각자 집중할 시간도 있었으면 좋겠어.”"}
      ],memory:"서로의 연락 빈도를 맞춘 대화"},
      {id:"balanced",label:"바쁠 땐 미리 말하고 저녁에 이야기하자",effects:{trust:10,relationshipStress:-5},response:"“그 정도면 나도 편할 것 같아. 말없이 사라지는 것만 아니면 돼.”",memory:"연락 규칙을 함께 정한 날"},
      {id:"independent",label:"연락 횟수로 사랑을 확인하지 말자",effects:{trust:2,excitement:-3},response:"“맞는 말이지만… 내 마음도 가볍게 보지는 않았으면 해.”",outcomes:[{conditions:[{stat:"partner.personality.independence",operator:">=",value:65}],effects:{trust:10,affection:8},response:"“나도 동의해. 대신 필요할 때는 솔직하게 말하자.”"}],memory:"각자의 시간을 존중하기로 한 약속"}
    ]
  },
  {
    id:"coworker-introduction", arc:"흔들리는 마음", window:[5,7], priority:90, bgm:"theme",
    title:"여자친구 있으시다고 했죠?", speaker:"여성 동료", message:"야근 중 동료가 커피를 건네며 장난스럽게 웃었다. 아직은 평범한 직장 관계다.",
    choices:[
      {id:"clear-boundary",label:"그렇다고 말하며 자연스럽게 선을 긋는다",effects:{trust:8,work:2},response:"“알겠어요. 그래도 커피는 동료끼리 마시는 거니까요.”",flags:{coworkerBoundary:true},memory:"새 동료에게 연애 사실을 분명히 밝힘"},
      {id:"friendly",label:"웃으며 커피를 받고 친하게 지낸다",effects:{social:7,excitement:3},response:"가벼운 농담이 오갔다. 아직 문제는 없지만 새로운 관계가 시작됐다.",memory:"여성 동료와 가까워진 첫 야근"},
      {id:"hide-status",label:"대답을 흐리고 다른 이야기로 넘긴다",effects:{social:5,trust:-8,relationshipStress:6},response:"동료는 더 묻지 않았지만, 애매한 침묵이 가능성을 남겼다.",flags:{hidRelationship:true},memory:"연애 사실을 흐린 첫 대화"}
    ]
  },
  {
    id:"unread-followup", arc:"읽지 않은 메시지", window:[6,8], priority:100, bgm:"crisis",
    requires:{sceneId:"unread-message"}, title:"그날 왜 힘들었는지 기억해?", speaker:"여자친구", message:"며칠 전의 짧은 메시지가 다시 대화 위로 떠올랐다.",
    choices:[
      {id:"remember",label:"기억나는 내용을 차분히 말한다",effects:{trust:12,affection:8},response:"“기억하고 있었구나. 그것만으로도 마음이 좀 풀려.”",memory:"지나간 힘든 날을 기억해 준 대화"},
      {id:"apologize",label:"솔직히 놓쳤다고 인정하고 사과한다",effects:{trust:6,conflict:-5},response:"“다음에는 내 말이 평소와 다르면 한 번만 더 물어봐 줘.”",memory:"놓친 신호를 인정하고 사과함"},
      {id:"deflect",label:"지난 일을 왜 다시 꺼내냐고 되묻는다",effects:{trust:-15,conflict:12,relationshipStress:10},response:"“역시 그날 내 기분은 중요하지 않았던 거네.”",flags:{dismissedHardDay:true},memory:"읽지 않은 메시지가 갈등으로 번짐"}
    ]
  },
  {
    id:"ex-message", arc:"전 여자친구에게 온 메시지", window:[7,9], priority:88, bgm:"crisis",
    title:"23:42 · 잘 지내?", speaker:"전 여자친구", message:"잠들기 직전, 오래된 이름으로부터 짧은 알림이 떴다.",
    choices:[
      {id:"tell-partner",label:"답장하지 않고 여자친구에게 먼저 말한다",effects:{trust:15,conflict:-3},response:"“말해 줘서 고마워. 조금 놀랐지만 네가 더 믿음직해졌어.”",flags:{transparentExContact:true},memory:"전 연인의 연락을 먼저 공유함"},
      {id:"delete",label:"조용히 삭제하고 답하지 않는다",effects:{trust:3},response:"알림은 사라졌다. 아무 일도 일어나지 않았지만 기록은 마음 한구석에 남았다.",memory:"답하지 않고 지운 전 연인의 메시지"},
      {id:"secret-reply",label:"몰래 안부 정도만 답한다",effects:{trust:-14,excitement:7,relationshipStress:9},response:"짧은 답장이 오갔다. 당장은 들키지 않았지만 숨겨야 할 대화가 생겼다.",flags:{secretExReply:true},memory:"몰래 이어진 전 연인과의 안부"}
    ]
  },
  {
    id:"project-opportunity", arc:"사랑만으로 살 수 있을까", window:[9,11], priority:86, bgm:"theme",
    title:"중요 프로젝트 제안", speaker:"팀장", message:"성과급과 승진 가능성이 걸린 프로젝트다. 대신 한동안 야근이 늘어난다.",
    choices:[
      {id:"accept",label:"기회를 잡고 프로젝트에 집중한다",effects:{work:15,money:80000,stress:12,affection:-8},response:"기회는 잡았다. 달력에는 야근 일정이 빼곡해졌다.",flags:{projectAccepted:true},memory:"연애 시간을 걸고 잡은 프로젝트 기회"},
      {id:"discuss",label:"여자친구와 먼저 상의한 뒤 참여한다",effects:{work:9,trust:12,stress:5},response:"“바빠져도 미리 말해 주면 같이 방법을 찾아볼 수 있어.”",flags:{projectAccepted:true,projectDiscussed:true},memory:"프로젝트 참여를 함께 상의함"},
      {id:"decline",label:"지금은 관계와 건강을 우선한다",effects:{affection:8,health:5,work:-4},response:"큰 기회는 지나갔지만, 오늘 저녁은 지킬 수 있었다.",flags:{projectDeclined:true},memory:"일보다 현재의 삶을 선택함"}
    ]
  },
  {
    id:"cheap-date", arc:"만원짜리 데이트", window:[10,13], priority:84, bgm:"dateShopping",
    conditions:[{stat:"money",operator:"<=",value:900000}], title:"주머니 속 만 원", speaker:"나", message:"월급날 전 약속. 비싼 식당 대신 작은 선택으로 오늘을 채워야 한다.",
    choices:[
      {id:"walk",label:"편의점 음식과 야간 산책을 준비한다",effects:{money:-10000},response:"둘은 강변 벤치에서 컵라면을 나눠 먹었다.",outcomes:[
        {conditions:[{stat:"partner.personality.romanticism",operator:">=",value:60}],effects:{affection:18,trust:10},response:"“이상하게 오늘이 제일 재밌었다. 다음에도 이렇게 걷자.”",flags:{cheapDateMemory:true}},
        {conditions:[{stat:"partner.personality.materialism",operator:">=",value:70}],effects:{affection:-5,relationshipStress:5},response:"“좋긴 한데… 다음에는 제대로 계획해 줬으면 좋겠어.”"}
      ],memory:"만원으로 만든 편의점 산책 데이트"},
      {id:"cancel",label:"돈이 없다는 말을 숨기고 약속을 미룬다",effects:{trust:-10,affection:-8},response:"이유를 모르는 취소 통보에 기대가 서운함으로 바뀌었다.",flags:{hidMoneyProblem:true},memory:"경제 사정을 숨기고 미룬 약속"},
      {id:"honest",label:"사정을 솔직히 말하고 함께 정한다",effects:{trust:12,confidence:5},response:"“그걸 왜 혼자 고민해? 돈 적게 드는 걸 같이 찾으면 되지.”",memory:"돈 문제를 솔직히 공유한 데이트"}
    ]
  },
  {
    id:"rival-dinner", arc:"흔들리는 마음", window:[12,15], priority:82, bgm:"crisis",
    title:"오늘 회사 사람이 밥 사줬어", speaker:"여자친구", message:"별 의미 없는 이야기처럼 들리지만 낯선 이름이 자꾸 마음에 걸린다.",
    choices:[
      {id:"trust",label:"누구인지 묻고 솔직하게 믿는다고 말한다",effects:{trust:12,conflict:-5},response:"“응, 그냥 선배야. 괜히 숨기고 싶지 않았어.”",flags:{trustedRivalSituation:true},memory:"라이벌의 존재 앞에서 믿음을 선택함"},
      {id:"jealous",label:"왜 단둘이 밥을 먹었냐고 따진다",effects:{trust:-8,conflict:12,relationshipStress:8},response:"“미리 말했어도 화냈을 거잖아. 그래서 더 답답해.”",memory:"낯선 사람 때문에 처음 크게 질투함"},
      {id:"pretend",label:"괜찮은 척하며 속으로만 의심한다",effects:{stress:8,relationshipStress:5},response:"대화는 평온하게 끝났지만 의심은 사라지지 않았다.",flags:{silentRivalSuspicion:true},memory:"말하지 못한 라이벌에 대한 의심"}
    ]
  },
  {
    id:"birthday-gift", arc:"생일 선물", window:[13,15], priority:92, bgm:"dateShopping",
    title:"다가오는 생일", speaker:"나", message:"가격보다 지금까지 알아 온 취향을 얼마나 이해했는지가 중요한 순간이다.",
    choices:[
      {id:"expensive",label:"비싼 브랜드 선물을 준비한다",effects:{money:-180000},response:"선물 상자가 조심스럽게 열렸다.",outcomes:[
        {conditions:[{stat:"partner.personality.materialism",operator:">=",value:60}],effects:{affection:20,excitement:12},response:"“진짜 갖고 싶었던 건데… 어떻게 알았어?”"},
        {conditions:[{stat:"partner.personality.materialism",operator:"<=",value:35}],effects:{affection:5,trust:-3},response:"“고맙긴 한데, 이런 데 너무 무리하지 않아도 돼.”"}
      ],memory:"생일에 준비한 고가의 선물"},
      {id:"handmade",label:"둘의 기억을 담은 손편지와 작은 선물을 만든다",effects:{money:-25000,affection:12},response:"“가격은 모르겠고, 이 편지는 오래 간직하고 싶어.”",outcomes:[{conditions:[{stat:"partner.personality.romanticism",operator:">=",value:55}],effects:{affection:14,trust:10},response:"“내가 했던 말을 다 기억하고 있었네. 정말 고마워.”",flags:{understoodBirthday:true}}],memory:"취향과 추억을 담은 생일 선물"},
      {id:"forgot",label:"바쁜 일정 탓에 준비하지 못한다",effects:{affection:-22,trust:-15,relationshipStress:12},response:"“괜찮아.” 짧은 대답이 괜찮지 않다는 걸 알려 줬다.",flags:{forgotBirthday:true},memory:"준비하지 못한 첫 생일"}
    ]
  },
  {
    id:"friend-warning", arc:"친구의 한마디", window:[15,17], priority:76, bgm:"theme",
    title:"너희 둘 진짜 괜찮은 거 맞아?", speaker:"친구", message:"친구의 판단이 항상 옳지는 않다. 하지만 듣고 나니 지나칠 수 없는 말이 됐다.",
    choices:[
      {id:"reflect",label:"구체적으로 무엇을 느꼈는지 묻는다",effects:{confidence:4,trust:3},response:"친구의 말과 내 경험을 분리해서 생각해 보기로 했다.",memory:"관계를 객관적으로 돌아보게 한 친구의 조언"},
      {id:"defend",label:"우리 관계는 우리가 안다고 선을 긋는다",effects:{confidence:7,stress:-3},response:"친구는 더 말하지 않았다. 결국 선택은 두 사람의 몫이다.",memory:"다른 사람의 평가보다 관계를 믿음"},
      {id:"doubt",label:"친구의 말만 믿고 여자친구를 의심한다",effects:{trust:-10,relationshipStress:8},response:"확인되지 않은 말이 평범한 행동까지 의심스럽게 만들었다.",flags:{friendPlantedDoubt:true},memory:"친구의 한마디에서 시작된 의심"}
    ]
  },
  {
    id:"missing-partner", arc:"갑자기 사라진 여자친구", window:[17,19], priority:91, bgm:"crisis",
    title:"연락이 닿지 않는 세 시간", speaker:"나", message:"평소라면 답이 왔을 시간. 전화도 메시지도 아무 반응이 없다.",
    choices:[
      {id:"wait",label:"메시지 하나를 남기고 기다린다",effects:{stress:4,trust:7},response:"몇 시간 뒤 휴대폰이 고장 났다는 연락이 왔다. 기다림은 믿음으로 남았다.",memory:"연락 두절 상황에서 기다려 준 시간"},
      {id:"call",label:"걱정된다고 말하며 한 번 전화한다",effects:{affection:7,stress:2},response:"연결되진 않았지만 과하지 않은 걱정은 진심으로 전해졌다.",memory:"사라진 연인을 걱정해 남긴 전화"},
      {id:"chase",label:"계속 연락하고 친구들에게까지 확인한다",effects:{conflict:10,relationshipStress:9},response:"“걱정한 건 알겠는데, 모두에게 연락한 건 너무 부담스러워.”",outcomes:[{conditions:[{stat:"partner.personality.contactImportance",operator:">=",value:75}],effects:{affection:8,conflict:-5},response:"“정신없었는데 네가 끝까지 찾고 있어서 안심되기도 했어.”"}],memory:"연락이 끊긴 동안 주변까지 수소문함"},
      {id:"suspect",label:"다른 사람과 있는 것 아니냐고 의심한다",effects:{trust:-16,conflict:14,relationshipStress:12},response:"“연락이 안 됐다는 이유로 바로 그런 생각부터 한 거야?”",flags:{accusedDuringMissing:true},memory:"연락 두절을 배신으로 의심함"}
    ]
  },
  {
    id:"windfall-500", arc:"50만원", window:[18,20], priority:74, bgm:"theme",
    title:"예상하지 못한 50만원", speaker:"나", message:"작은 행운은 무엇을 중요하게 생각하는지 선명하게 보여 준다.",
    choices:[
      {id:"save",label:"전액 저축한다",effects:{money:500000,confidence:8},response:"통장 잔액이 든든해졌다. 미래를 위한 선택이었다.",flags:{windfallSaved:true},memory:"뜻밖의 50만원을 미래를 위해 남김"},
      {id:"date",label:"일부로 특별한 데이트를 준비한다",effects:{money:380000,affection:18,excitement:15},response:"“갑자기 왜 이렇게 근사하게 준비했어?” 둘만의 기억이 하나 늘었다.",flags:{windfallShared:true},memory:"행운을 함께 나눈 특별한 데이트"},
      {id:"invest",label:"전액 투자 자금으로 남긴다",effects:{money:500000,confidence:5,stress:4},response:"기회가 올 때 움직일 수 있는 자금이 생겼다.",flags:{windfallInvested:true},memory:"50만원을 투자 기회로 바꿈"}
    ]
  },
  {
    id:"trip-together", arc:"둘만의 여행", window:[19,21], priority:80, bgm:"dateShopping",
    title:"우리, 1박 2일로 어디 갈까?", speaker:"여자친구", message:"비용과 일정 조정이 필요하지만 평소와 다른 서로의 모습을 볼 기회다.",
    choices:[
      {id:"plan-together",label:"예산과 일정을 함께 짠다",effects:{money:-120000,affection:16,trust:14,stress:-8},response:"계획을 나누는 과정부터 여행이 시작됐다. 서로의 생활 습관도 조금 더 이해했다.",flags:{tripCompleted:true},memory:"함께 계획해 다녀온 첫 여행"},
      {id:"surprise-trip",label:"내가 전부 준비해 깜짝 여행을 만든다",effects:{money:-180000,excitement:20,stress:5},response:"놀라움은 컸지만 취향이 맞지 않는 일정도 있었다.",outcomes:[{conditions:[{stat:"partner.personality.romanticism",operator:">=",value:65}],effects:{affection:15,stress:-8},response:"“이런 걸 언제 다 준비했어? 오래 기억날 것 같아.”"}],memory:"혼자 준비한 깜짝 1박 2일 여행"},
      {id:"postpone",label:"회사와 돈 사정을 설명하고 미룬다",effects:{trust:7,affection:-4},response:"아쉬움은 남았지만 솔직한 이유 덕분에 큰 갈등은 피했다.",memory:"현실적인 사정으로 미룬 첫 여행"}
    ]
  },
  {
    id:"small-lie", arc:"거짓말 하나", window:[20,22], priority:89, bgm:"crisis",
    title:"어제 누구랑 있었어?", speaker:"여자친구", message:"작은 실수를 사실대로 말하면 잠깐 서운해할 것이다. 거짓말하면 지금은 넘어갈 수 있다.",
    choices:[
      {id:"truth",label:"실수까지 모두 사실대로 말한다",effects:{affection:-5,trust:12,conflict:3},response:"“서운하긴 한데, 네가 먼저 말해 줘서 더 화내지는 않을게.”",flags:{toldTruth:true},memory:"불리한 사실도 숨기지 않은 대화"},
      {id:"hide",label:"회사 사람들과 있었다고 둘러댄다",effects:{trust:-3,stress:5},response:"대화는 무사히 끝났다. 대신 기억해야 할 거짓말이 하나 생겼다.",flags:{smallLie:true},memory:"회사 핑계로 숨긴 작은 거짓말"}
    ]
  },
  {
    id:"promise-clash", arc:"사랑만으로 살 수 있을까", window:[22,24], priority:87, bgm:"crisis",
    title:"약속과 중요한 회사 일정", speaker:"나", message:"오늘은 오래전부터 약속한 날이지만 프로젝트 발표가 같은 시간에 잡혔다.",
    choices:[
      {id:"work",label:"회사로 가고 솔직하게 사과한다",effects:{work:18,money:120000,affection:-15,trust:2},response:"성과는 얻었지만 빈자리의 무게도 분명히 남았다.",flags:{choseWorkAtClash:true},memory:"약속보다 중요한 회사 일정을 선택함"},
      {id:"date",label:"약속을 지키고 회사 기회를 포기한다",effects:{affection:20,trust:12,work:-8},response:"“오늘 와 줘서 고마워. 네가 어떤 걸 포기했는지도 알아.”",flags:{choseLoveAtClash:true},memory:"회사 기회보다 오래된 약속을 지킴"},
      {id:"alternative",label:"상사와 여자친구 모두에게 사정을 말하고 시간을 조정한다",effects:{work:8,trust:14,stress:10,confidence:8},response:"완벽하진 않았지만 거짓말 없이 두 약속의 일부를 지켜 냈다.",flags:{foundThirdWay:true},memory:"일과 사랑 사이에서 제3의 방법을 찾음"},
      {id:"lie",label:"양쪽에 다른 핑계를 대고 넘긴다",effects:{work:10,trust:-15,stress:14,relationshipStress:12},response:"당장은 일정이 정리됐다. 하지만 서로 맞지 않는 두 이야기가 남았다.",flags:{smallLie:true,clashLie:true},memory:"회사와 연인 모두에게 다른 거짓말을 함"}
    ]
  },
  {
    id:"lie-revealed", arc:"거짓말 하나", window:[24,27], priority:110, bgm:"crisis",
    requires:{sceneId:"small-lie",choiceIds:["hide"]}, title:"잠깐만, 그때 회사 사람들이랑 있었다며?", speaker:"여자친구", message:"작은 거짓말과 다른 날의 정보가 연결됐다. 이제 설명할 기회가 한 번 남았다.",
    choices:[
      {id:"confess",label:"변명하지 않고 전부 인정한다",effects:{trust:-8,conflict:6,relationshipStress:-4},response:"“거짓말한 건 화나. 그래도 지금이라도 인정한 건 기억할게.”",flags:{lieConfessed:true},memory:"들킨 거짓말을 끝까지 인정하고 사과함"},
      {id:"explain",label:"왜 숨겼는지 차분히 설명한다",effects:{trust:-4,conflict:4},response:"설명은 끝났지만 신뢰가 회복되려면 시간이 더 필요하다.",outcomes:[{conditions:[{stat:"trust",operator:">=",value:600}],effects:{trust:8,conflict:-6},response:"“이번 한 번은 믿을게. 다음에는 처음부터 말해 줘.”"}],memory:"거짓말의 이유를 설명하고 기회를 얻음"},
      {id:"double-down",label:"끝까지 기억이 잘못됐다고 우긴다",effects:{trust:-25,conflict:18,relationshipStress:18},response:"“사실보다 지금도 나를 속이려는 게 더 무서워.”",flags:{lieEscalated:true},memory:"드러난 거짓말을 다시 거짓말로 덮음"}
    ]
  },
  {
    id:"future-talk", arc:"우리 결혼하면 어떨까?", window:[26,28], priority:96, bgm:"dateShopping",
    title:"우리 결혼하면 어디서 살고 싶어?", speaker:"여자친구", message:"가벼운 질문처럼 들리지만, 두 사람의 미래를 처음 구체적으로 상상하는 순간이다.",
    choices:[
      {id:"together",label:"형편에 맞춰 둘이 함께 시작하고 싶다",effects:{affection:14,trust:16},futureScore:18,response:"“나도 집 크기보다 우리가 같이 정하는 게 더 중요해.”",memory:"함께 만들어 갈 결혼 생활을 이야기함"},
      {id:"prepare-first",label:"경제적 기반을 충분히 만든 뒤 생각하자",effects:{trust:8,work:5},futureScore:9,response:"“현실적인 말인 건 알아. 그 준비에 나도 포함돼 있으면 좋겠어.”",outcomes:[{conditions:[{stat:"partner.personality.materialism",operator:">=",value:60}],effects:{affection:10},futureScore:7,response:"“응, 나도 안정적인 시작이 중요해. 같이 계획해 보자.”"}],memory:"경제적 준비를 전제로 미래를 약속함"},
      {id:"avoid",label:"아직 그런 이야기는 부담스럽다고 피한다",effects:{affection:-10,trust:-8},futureScore:-12,response:"“알겠어. 그냥 네 생각이 궁금했던 건데….”",flags:{avoidedFutureTalk:true},memory:"처음 나온 결혼 이야기를 피함"}
    ]
  },
  {
    id:"final-question", arc:"우리 정말 잘 맞는 걸까?", window:[29,30], priority:120, bgm:"theme",
    title:"그래도 앞으로도 나랑 만나고 싶어?", speaker:"여자친구", message:"평범한 일상과 흔들림, 돈과 일의 선택을 지나 두 사람은 서로를 얼마나 이해하게 됐을까.",
    choices:[
      {id:"continue",label:"좋은 날뿐 아니라 어려운 날도 함께하고 싶어",effects:{affection:18,trust:18,conflict:-10},futureScore:15,response:"“그 말이면 충분해. 우리 다음 달도 같이 배워 가자.”",memory:"30일 뒤에도 관계를 이어 가겠다는 약속"},
      {id:"rebuild",label:"상처 준 부분부터 천천히 다시 맞춰 가자",effects:{trust:14,relationshipStress:-14,conflict:-12},futureScore:8,response:"“완벽한 척하는 것보다 그 말이 더 믿음이 가.”",memory:"관계를 회복하며 다시 시작하기로 함"},
      {id:"separate",label:"좋아하지만 각자의 삶을 선택하자",effects:{affection:-30,trust:5},futureScore:-25,response:"둘은 서로를 탓하지 않고 마지막 인사를 오래 나눴다.",flags:{choseSeparation:true},memory:"좋아하지만 각자의 삶을 선택한 마지막 대화"}
    ]
  }
];

export const STORY_SCENES = [...MARRIAGE_30_STORY_SCENES,...STANDARD_STORY_SCENES,...HIDDEN_ROUTE_SCENES,...HEROINE_STORY_SCENES];

const FRIEND_SCENE_IDS=new Set(["friend-warning","hidden-friend-question"]);
const COWORKER_SCENE_IDS=new Set(["coworker-introduction","project-opportunity","promise-clash","hidden-cracks"]);
const inferPreferenceTags=choice=>{
  const text=`${choice.id} ${choice.label}`;
  const tags=[];
  if(/솔직|사과|인정|말한다|상의|설명/.test(text))tags.push("HONEST","DIRECT");
  if(/계획|예산|일정|조정|준비|저축/.test(text))tags.push("PRACTICAL","PLANNED");
  if(/마음|들어|위로|함께|고마|사랑/.test(text))tags.push("EMOTIONAL","CARING");
  if(/깜짝|산책|여행|즐긴|재밌/.test(text))tags.push("SPONTANEOUS","IMAGINATIVE","ROMANTIC");
  if(/기다|시간|존중|선|거절/.test(text))tags.push("PRIVATE","BOUNDARY");
  return [...new Set(tags)];
};
for(const scene of STORY_SCENES){
  scene.eventType=FRIEND_SCENE_IDS.has(scene.id)?"FRIEND":COWORKER_SCENE_IDS.has(scene.id)?"COWORKER":scene.speaker==="나"?"INNER_CHOICE":"GIRLFRIEND";
  scene.question??=scene.eventType==="INNER_CHOICE"?`${scene.title}에서 나는 어떤 결정을 내릴까?`:`${scene.speaker}에게 어떻게 답할까?`;
  scene.locationId??="story-location";
  scene.image??={intro:`assets/events/${scene.eventType.toLowerCase()}/${scene.id}-01.png`,result:`assets/events/${scene.eventType.toLowerCase()}/${scene.id}-result-01.png`,status:"planned"};
  for(const choice of scene.choices)choice.preferenceTags??=inferPreferenceTags(choice);
}

export function validateStoryData(scenes = STORY_SCENES) {
  const ids = new Set();
  return scenes.every(scene => {
    if (typeof scene.id !== "string" || ids.has(scene.id)) return false;
    ids.add(scene.id);
    return typeof scene.arc === "string" && Array.isArray(scene.window) && scene.window.length === 2 && scene.window.every(Number.isInteger) && scene.window[0] <= scene.window[1] && typeof scene.title === "string" && typeof scene.message === "string" && Array.isArray(scene.choices) && scene.choices.length >= 2 && scene.choices.every(choice => typeof choice.id === "string" && typeof choice.label === "string" && typeof choice.response === "string" && Object.values(choice.effects ?? {}).every(Number.isFinite) && Object.values(choice.routeEffects ?? {}).every(Number.isFinite));
  });
}
