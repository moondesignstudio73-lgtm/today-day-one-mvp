import { YUNA_STORY_EVENTS } from "./yuna-data.mjs";

const CATEGORY_CONFIG = {
  romance:{label:"연애·데이트",npcRole:"girlfriend",backgrounds:["home-morning","cafe-rain-evening","river-night","home-night"],bgm:"theme",baseEffects:{affection:4,excitement:3}},
  temptation:{label:"서브 히로인·유혹",npcRole:"female-coworker",backgrounds:["office-day","cafe-rain-evening","river-night","home-night"],bgm:"crisis",baseEffects:{trust:-2,excitement:5,relationshipStress:2}},
  conflict:{label:"갈등·질투",npcRole:"girlfriend",backgrounds:["home-morning","cafe-rain-evening","river-night","home-night"],bgm:"crisis",baseEffects:{conflict:3,relationshipStress:3}},
  work:{label:"직장",npcRole:"team-lead",backgrounds:["office-day","office-day","cafe-rain-evening","home-night"],bgm:"daily",baseEffects:{work:3,stress:2}},
  friends:{label:"친구·인간관계",npcRole:"best-friend",backgrounds:["cafe-rain-evening","river-night","cafe-rain-evening","home-night"],bgm:"daily",baseEffects:{social:4}},
  money:{label:"돈·쇼핑",npcRole:"girlfriend",backgrounds:["office-day","cafe-rain-evening","river-night","home-night"],bgm:"daily",baseEffects:{stress:2}},
  travel:{label:"여행·특별",npcRole:"girlfriend",backgrounds:["home-morning","river-night","cafe-rain-evening","home-night"],bgm:"theme",baseEffects:{affection:5,excitement:6,energy:-3}},
  mystery:{label:"미스터리·비밀",npcRole:"girlfriend",backgrounds:["office-day","cafe-rain-evening","river-night","home-night"],bgm:"crisis",baseEffects:{trust:-2,relationshipStress:3}}
};

const BLUEPRINTS = [
  ["midnight-drive","계획 없던 심야 드라이브","romance",2,12,"갑자기 바다가 보고 싶다는 메시지가 왔다.","내일 일정과 지금의 설렘 사이에서 망설였다.","연인은 목적지보다 함께 나선 사실이 좋았다고 말했다.","새벽의 편의점 불빛 아래 다음 즉흥 여행을 약속했다."],
  ["front-door-surprise","집 앞의 갑작스러운 방문","romance",3,13,"초인종 너머로 연인의 목소리가 들렸다.","정리되지 않은 방과 마음을 동시에 들킨 기분이었다.","연인은 얼굴을 보고 안심하고 싶었다고 털어놓았다.","짧은 방문은 평범한 집을 둘만의 장소로 바꿨다."],
  ["shared-umbrella","우산 하나로 걷는 귀갓길","romance",4,15,"퇴근길 폭우 속에 우산은 하나뿐이었다.","가까워진 거리만큼 말하지 못한 서운함도 선명해졌다.","연인은 비 오는 날 혼자 기다렸던 기억을 꺼냈다.","젖은 어깨를 닦아 주며 다음 비에는 먼저 연락하기로 했다."],
  ["drunk-pickup","취한 연인을 데리러 가는 밤","romance",6,18,"낯선 번호로 연인을 데리러 와 달라는 전화가 왔다.","술집 앞에서 웃는 얼굴 뒤의 지친 표정을 발견했다.","연인은 늘 괜찮은 척하는 것이 힘들었다고 고백했다.","집 앞에서 건넨 물 한 병과 짧은 포옹이 오래 남았다."],
  ["fine-dining-truth","고급 레스토랑의 솔직한 계산","romance",9,22,"예약하기 어려운 레스토랑의 창가 자리가 준비됐다.","화려한 코스와 부담스러운 가격 사이에 침묵이 길어졌다.","연인은 비싼 식사보다 감추지 않는 형편을 원한다고 말했다.","계산서보다 서로의 기준을 나눈 대화가 더 선명했다."],
  ["future-night-talk","DAY 후반의 미래 대화","romance",22,30,"잠들기 전 통화가 자연스럽게 미래 이야기로 흘렀다.","사는 곳과 일, 결혼의 속도가 서로 다를 수 있음을 알았다.","연인은 정답보다 함께 조정할 의지가 있는지 물었다.","통화를 끊은 뒤 둘만의 미래 목록이 휴대폰에 남았다."],

  ["coworker-private-drink","동료와 단둘이 마시는 술","temptation",8,24,"퇴근 직전 여성 동료가 조용히 한잔하자고 제안했다.","회사 농담은 연애와 외로움에 대한 질문으로 깊어졌다.","동료는 좋아하면 안 되는 사람을 좋아한 것 같다고 말했다.","귀가 뒤 비밀로 해 달라는 메시지가 도착했다."],
  ["team-dinner-spark","회식 자리의 가까운 거리","temptation",7,21,"회사 회식에서 우연히 여성 동료 옆자리에 앉았다.","취기가 오르자 서로의 이상형을 묻는 분위기가 됐다.","동료는 대답 대신 플레이어를 오래 바라봤다.","단체 사진 속 둘의 거리가 소문의 씨앗으로 남았다."],
  ["almost-confession","고백에 가까운 퇴근 메시지","temptation",11,26,"서브 히로인에게 오늘은 특별히 보고 싶었다는 메시지가 왔다.","농담으로 넘기려 할수록 상대의 말은 진지해졌다.","그녀는 대답을 요구하지 않겠다며 마음만 알아 달라고 했다.","읽음 표시 뒤 어떤 관계를 선택할지 질문이 남았다."],
  ["late-dinner-coworker","야근 뒤 둘만의 저녁","temptation",5,20,"마지막까지 남은 동료와 배달 저녁을 나눴다.","업무를 마친 안도감이 사적인 친밀감으로 바뀌었다.","동료는 연인이 기다리는데도 남아 있어도 되냐고 물었다.","엘리베이터 앞에서 다음 야근을 기대하는 표정을 봤다."],
  ["second-secret-meeting","두 번째 비밀 약속","temptation",14,29,"이전 만남을 기억하는 동료가 다시 장소를 보냈다.","이번에는 우연이라고 부를 수 없다는 사실이 무거웠다.","동료는 선을 넘을지 끝낼지 직접 선택해 달라고 했다.","삭제하지 못한 주소가 새로운 비밀의 증거가 됐다."],

  ["phone-notification-seen","연인이 본 휴대폰 알림","conflict",5,20,"테이블 위 휴대폰에 의미심장한 이름이 떠올랐다.","설명하려는 말보다 연인의 표정이 먼저 굳었다.","연인은 내용보다 숨기려 한 순간이 더 아프다고 말했다.","잠금 화면을 사이에 두고 신뢰의 기준을 다시 정했다."],
  ["girlfriend-with-stranger","낯선 남자와 함께 있는 연인","conflict",9,24,"거리 건너편에서 연인이 낯선 남자와 웃고 있었다.","다가가 묻고 싶은 마음과 믿고 싶은 마음이 충돌했다.","그 남자는 오래된 동료였지만 연인은 감시받는 기분을 말했다.","오해는 풀렸어도 서로의 질투 방식은 기억에 남았다."],
  ["caught-with-coworker","다른 여성과 있는 장면을 들키다","conflict",8,23,"카페에서 동료와 마주 앉은 순간 연인이 들어왔다.","설명할수록 준비한 변명처럼 들리는 분위기가 됐다.","연인은 만남보다 자신만 몰랐다는 사실에 상처받았다.","그날 밤 짧은 메시지 하나가 화해와 단절 사이를 갈랐다."],
  ["travel-big-fight","여행지에서 터진 큰 싸움","conflict",13,27,"기대하던 여행에서 작은 일정 착오가 생겼다.","피로와 돈 문제가 겹치며 오래된 불만까지 쏟아졌다.","연인은 혼자 참아 온 관계의 불균형을 처음 말했다.","낯선 숙소의 침묵 속에서 돌아갈지 다시 시작할지 정했다."],
  ["late-night-reconciliation","밤늦게 찾아간 화해","conflict",10,28,"싸움 뒤 답장이 없는 연인의 집 앞으로 향했다.","기다림은 사과가 상대를 위한지 자신을 위한지 묻게 했다.","연인은 문을 열고 같은 일이 반복되지 않을 이유를 물었다.","새벽이 오기 전 두 사람은 구체적인 약속 하나를 남겼다."],

  ["deadline-versus-date","중요 일정과 데이트의 충돌","work",6,19,"발표 일정이 오래 준비한 데이트와 정확히 겹쳤다.","상사와 연인 모두 오늘만은 선택해 달라고 말했다.","어느 쪽을 택해도 잃는 것이 있다는 현실이 드러났다.","선택의 이유를 솔직히 설명한 방식이 관계에 남았다."],
  ["overtime-team-dinner","야근 팀의 늦은 저녁","work",4,18,"긴급 업무 뒤 팀장이 저녁을 사겠다고 했다.","성과 이야기는 승진과 희생해야 할 시간으로 이어졌다.","팀장은 지금의 연애가 커리어를 버틸 수 있겠냐고 물었다.","택시 안에서 성공의 가격을 처음 구체적으로 계산했다."],
  ["office-rumor","회사에 번진 두 사람의 소문","work",10,25,"동료와 가깝다는 소문이 사내 메신저에 돌기 시작했다.","해명할수록 누가 시작했는지에 대한 의심이 커졌다.","가까운 동료가 소문 중 일부는 사실 아니냐고 물었다.","소문을 끊는 선택은 직장 관계와 연애 모두에 흔적을 남겼다."],
  ["promotion-relocation","승진과 지방 발령 제안","work",18,30,"승진 조건으로 몇 달간 다른 도시에서 일하라는 제안을 받았다.","기회와 장거리 연애의 불안이 같은 무게로 다가왔다.","연인은 자신 때문에 포기했다는 말을 듣고 싶지 않다고 했다.","결정 전날 각자의 두려움과 기대를 목록으로 적었다."],

  ["meet-her-friends","연인의 친구들을 처음 만난 날","friends",5,18,"연인의 가장 가까운 친구들이 기다리는 카페에 들어갔다.","가벼운 질문은 관계의 진지함을 확인하는 면접처럼 변했다.","한 친구가 연인을 울리지 않을 자신이 있냐고 물었다.","돌아오는 길 연인은 친구들 앞에서 편을 들어 줘 고맙다고 했다."],
  ["friends-evaluate-partner","내 친구들의 연인 평가","friends",6,20,"오랜 친구들이 연인을 처음 만나는 자리가 열렸다.","친구의 무심한 농담이 연인의 자존심을 건드렸다.","연인은 혼자 견디게 둘지 자신의 편이 될지 지켜봤다고 말했다.","만남 뒤 친구와 연인 사이에 새로운 경계가 생겼다."],
  ["parents-first-story","처음 듣는 부모님 이야기","friends",12,27,"평범한 저녁 중 연인이 가족 이야기를 조심스럽게 꺼냈다.","결혼과 돈을 바라보는 방식이 어린 시절 경험과 연결됐다.","연인은 자신의 가족까지 받아들일 수 있겠냐고 물었다.","당장 답하지 않아도 기억해 달라는 부탁이 남았다."],

  ["budget-date","돈이 부족한 날의 데이트","money",3,17,"약속 당일 예상보다 통장 잔액이 부족했다.","솔직히 말할지 무리해서 계획을 지킬지 고민했다.","연인은 편의점 음식과 공원 산책도 함께라면 괜찮다고 했다.","적게 쓴 날이 오히려 서로의 경제관을 많이 보여 줬다."],
  ["couple-item-shopping","커플 아이템을 고르는 오후","money",7,22,"쇼핑몰에서 우연히 커플 아이템 코너를 발견했다.","가격과 디자인, 관계를 드러내는 방식에서 취향이 갈렸다.","연인은 같은 물건보다 같은 의미를 원하는 것이라고 말했다.","각자 다른 색의 물건에 같은 날짜를 새겼다."],

  ["first-trip","둘만의 첫 여행","travel",10,24,"둘만의 첫 여행을 위해 이른 아침 역에서 만났다.","계획형과 즉흥형의 차이가 첫날부터 드러났다.","길을 잃은 순간 연인은 완벽하지 않아 더 기억난다고 웃었다.","여행 마지막 밤 둘만 아는 장소를 하나 만들었다."],
  ["birthday-preparation","들키지 않는 생일 준비","travel",8,25,"연인의 생일을 위해 친구와 몰래 계획을 세웠다.","비밀 연락이 오히려 연인의 의심을 키우기 시작했다.","서프라이즈 직전 연인은 잊힌 줄 알고 상처받았다고 말했다.","촛불이 켜진 뒤 기쁨과 미안함이 동시에 번졌다."],
  ["birthday-wrong-gift","취향과 어긋난 생일 선물","travel",9,26,"정성껏 고른 선물을 연인이 오래 바라보기만 했다.","좋아하는 척하는 표정이 서로를 더 불편하게 했다.","연인은 가격보다 자신의 말을 기억하지 못한 것이 서운했다.","교환하러 가는 길에 서로의 취향 목록을 새로 만들었다."],

  ["ex-girlfriend-reunion","전 연인과의 우연한 재회","mystery",7,23,"점심 카페에서 오래전 헤어진 사람이 이름을 불렀다.","안부는 과거의 미련과 현재 연애에 대한 질문으로 변했다.","전 연인은 마지막으로 묻고 싶었던 진실이 있다고 말했다.","현재 연인에게 이 만남을 말할지가 새로운 비밀이 됐다."],
  ["her-ex-returns","연인의 전 남자친구가 돌아오다","mystery",11,27,"연인의 휴대폰에 전 남자친구의 장문 메시지가 도착했다.","끝난 관계라는 말과 흔들리는 눈빛이 서로 달랐다.","연인은 과거를 정리할 기회를 믿어 줄 수 있냐고 물었다.","세 사람이 마주할 가능성이 라이벌 스레드에 남았다."]
  ,["haeun-home-outside-talk","집 앞에서 나누는 이야기","romance",2,30,"하은의 집에 도착했지만 아직 안으로 들어오라는 말은 없었다.","두 사람은 현관 앞에서 서로에게 편한 거리를 확인했다.","하은은 부담 없이 여기서 이야기해도 괜찮겠냐고 물었다.","강요하지 않은 대화가 다음 방문의 신뢰로 남았다."]
  ,["haeun-home-tea-talk","차를 마시며 나누는 이야기","romance",3,30,"하은이 현관문을 열고 거실로 안내했다.","테이블 위의 찻잔 두 개 사이로 조금 깊은 이야기가 시작됐다.","하은은 요즘 서로에게 숨기는 고민이 없는지 물었다.","따뜻한 차와 솔직한 대화가 집 안의 거리를 좁혔다."]
  ,["haeun-home-meal","하은의 집에서 함께 먹는 저녁","romance",5,30,"하은의 식탁에는 두 사람 몫의 저녁이 준비되어 있었다.","평범한 식사 안에서 함께 사는 미래가 자연스럽게 떠올랐다.","하은은 다음에는 무엇을 함께 만들어 먹고 싶은지 물었다.","식사가 끝난 뒤 두 사람은 다음 장보기 약속을 정했다."]
];

const MOODS = {
  romance:["설렘","진지함","따뜻한 긴장","잔잔한 확신"],temptation:["가벼운 농담","은밀한 호기심","위험한 솔직함","미완의 여운"],
  conflict:["불편한 예감","방어적인 긴장","감정 폭발","조심스러운 여운"],work:["업무적 긴장","현실적인 압박","선택의 부담","쓴 안도감"],
  friends:["사교적 기대","낯선 긴장","관계 검증","새로운 이해"],money:["가벼운 기대","현실적 부담","가치관 충돌","솔직한 안도"],
  travel:["들뜬 기대","예상 밖의 변수","감정의 절정","오래 남는 추억"],mystery:["낯선 기척","커지는 의심","숨겨진 진실","불완전한 결론"]
};

const PLAYER_LINES = ["갑작스럽긴 하지만 네 이야기를 듣고 싶어.","조금 천천히 말해도 괜찮아.","그 질문에는 솔직하게 답할게.","오늘의 선택을 나중에 변명하고 싶지는 않아."];

function makeTurns(event,sceneIndex) {
  const lead=event.category === "temptation" ? "서브 히로인" : event.category === "work" ? "직장 동료" : event.category === "friends" ? "친구" : "연인";
  const beats=[event.hook,event.pressure,event.reveal,event.echo];
  const line=beats[sceneIndex];
  return [
    {type:"narration",speaker:"내레이션",text:line},
    {type:"dialogue",speaker:lead,text:`“${line.replace(/\.$/,"")}… 너는 어떻게 생각해?”`,expressionId:sceneIndex===2?"tense":sceneIndex===3?"smile":"calm"},
    {type:"dialogue",speaker:"플레이어",text:PLAYER_LINES[sceneIndex]},
    {type:"dialogue",speaker:lead,text:sceneIndex===0?"처음엔 가볍게 말하려고 했는데, 막상 네 얼굴을 보니 어렵네.":sceneIndex===1?"아무렇지 않은 척하면 오히려 더 이상해질 것 같아.":sceneIndex===2?"지금은 듣기 좋은 대답보다 진짜 마음이 필요해.":"오늘 대화가 내일의 우리를 조금 바꾸겠지."},
    {type:"dialogue",speaker:"플레이어",text:sceneIndex===0?"피하지 않을게. 처음부터 이야기해 줘.":sceneIndex===1?"불편해도 여기서 멈추지는 말자.":sceneIndex===2?"내가 감당해야 할 부분도 분명히 말해 줘.":"기억할게. 그리고 다음에는 먼저 말할게."},
    {type:"narration",speaker:"내레이션",text:`${event.moods[sceneIndex]}의 공기가 두 사람 사이에 오래 머물렀다.`},
    {type:"dialogue",speaker:lead,text:sceneIndex<2?"그럼 한 가지만 더 물어봐도 돼?":"이제야 조금 네 대답을 믿을 수 있을 것 같아."},
    {type:"dialogue",speaker:"플레이어",text:sceneIndex<2?"응. 오늘은 숨기지 말고 끝까지 이야기하자.":"완벽한 답은 없어도 선택의 책임은 질게."}
  ];
}

function makeChoices(event) {
  return [
    {id:"honest",label:"불편하더라도 전부 솔직히 말한다",preferenceTags:["HONEST","EMOTIONAL","DIRECT"],effects:{trust:10,affection:3,conflict:-2},response:"솔직한 답은 당장의 긴장보다 앞으로의 신뢰를 선택한 말이 되었다.",flag:`${event.id}:HONEST`,memory:`${event.title}에서 솔직함을 선택했다.`,futureEventWeights:{reconciliation:1.25,suspicion:.75}},
    {id:"protect",label:"관계를 지키기 위한 선을 분명히 긋는다",preferenceTags:["BOUNDARY","PRACTICAL","PLANNED","LOGICAL"],effects:{trust:6,excitement:-2,relationshipStress:-2},response:"구체적인 경계가 두 사람이 다시 같은 문제를 겪지 않을 기준이 되었다.",flag:`${event.id}:BOUNDARY`,memory:`${event.title}에서 관계의 경계를 정했다.`,futureEventWeights:{loyalty:1.3,temptation:.7}},
    {id:"risk",label:"지금의 감정을 따라 위험을 감수한다",preferenceTags:["SPONTANEOUS","IMAGINATIVE","RISK"],effects:{excitement:10,trust:-7,conflict:4},response:"순간의 설렘은 커졌지만 선택의 책임과 불안도 함께 남았다.",flag:`${event.id}:RISK`,memory:`${event.title}에서 위험한 감정을 따랐다.`,futureEventWeights:{temptation:1.4,suspicion:1.35}}
  ];
}

function buildEvent([id,title,category,startDay,endDay,hook,pressure,reveal,echo],index) {
  const config=CATEGORY_CONFIG[category];
  const event={id:`situation-${id}`,title,category,categoryLabel:config.label,hook,pressure,reveal,echo,moods:MOODS[category]};
  event.scenes=config.backgrounds.map((backgroundId,sceneIndex)=>({
    id:`${event.id}-scene-${sceneIndex+1}`,title:["사건 시작","흔들리는 대화","감정의 절정","NIGHT 후속 반응"][sceneIndex],backgroundId,
    characterIds:[config.npcRole],expression:["calm","worried","tense","smile"][sceneIndex],pose:sceneIndex===3?"phone":"standing",animation:sceneIndex===2?"tense-shift":"soft-sway",
    outfit:sceneIndex===0?"default":"date",itemIds:sceneIndex===3?["aurora-phone"]:[],bgmId:config.bgm,sfxId:backgroundId.includes("rain")?"rain-window":"scene",
    transition:sceneIndex===0?"fade":sceneIndex===3?"blur":"slide",lighting:backgroundId.includes("night")?"night-neon":"soft",timeOfDay:sceneIndex===0?"day":sceneIndex===3?"night":"evening",weather:backgroundId.includes("rain")?"rain":"sunny",
    dialogueTurns:makeTurns(event,sceneIndex)
  }));
  return {
    ...event,message:hook,question:`${title}에서 나는 어떻게 답하고 행동할까?`,eventType:category==="friends"?"FRIEND":category==="work"||category==="temptation"?"COWORKER":"GIRLFRIEND",image:{intro:`assets/events/${category}/${id}-01.png`,result:`assets/events/${category}/${id}-result-01.png`,status:"planned"},conditions:[{stat:"day",operator:">=",value:startDay}],probability:.025+(index%4)*.008,priority:52+(index%7),cooldown:7+(index%5),effects:config.baseEffects,
    baseWeight:45+(index%6)*5,dayRange:[startDay,endDay],timeOfDay:index%3===0?"evening":"day",location:event.scenes[0].backgroundId,tensionLevel:category==="conflict"||category==="mystery"?"high":category==="temptation"?"medium-high":"medium",
    relationshipStates:category==="conflict"?["SUSPICIOUS","CONFLICT","RECOVERING"]:category==="romance"?["HONEYMOON","STABLE","PASSIONATE"]:["DISTANT","STABLE","SUSPICIOUS"],
    npcRequirements:config.npcRole==="girlfriend"?[]:[config.npcRole],requiredMemories:[],requiredEvents:[],forbiddenFlags:[`${event.id}:COMPLETED`],repeatable:false,maxTriggerCount:1,eventState:"LOCKED",
    startMood:event.moods[0],middleMood:event.moods[1],peakMood:event.moods[2],endMood:event.moods[3],choices:makeChoices(event),
    storyFlag:`${event.id}:COMPLETED`,futureEventWeights:{[category]:1.2},cgCandidate:["shared-umbrella","drunk-pickup","coworker-private-drink","travel-big-fight","late-night-reconciliation","first-trip"].includes(id)?`CG_${id.toUpperCase().replaceAll("-","_")}`:null
  };
}

const BASE_SITUATION_EVENTS=BLUEPRINTS.map(buildEvent);
const HAEUN_HOME_TIERS={
  "situation-haeun-home-outside-talk":{trust:[null,700],locationId:"haeun-home-outside",question:"집 앞에서 하은에게 어떻게 답할까?",image:"assets/events/locations/haeun-home-outside-talk-01.png"},
  "situation-haeun-home-tea-talk":{trust:[701,900],locationId:"haeun-home-living-room",question:"차를 마시며 하은과 어떤 이야기를 나눌까?",image:"assets/events/locations/haeun-home-tea-talk-01.png"},
  "situation-haeun-home-meal":{trust:[901,null],locationId:"haeun-home-dining-room",question:"하은이 준비한 식사에 어떻게 마음을 전할까?",image:"assets/events/locations/haeun-home-meal-01.png"}
};
for(const event of BASE_SITUATION_EVENTS){
  const tier=HAEUN_HOME_TIERS[event.id];
  if(!tier)continue;
  event.heroineIds=["haeun"];event.locationId=tier.locationId;event.question=tier.question;event.image.intro=tier.image;event.image.result=tier.image;event.image.status="ready";
  if(tier.trust[0]!==null)event.conditions.push({stat:"trust",operator:">=",value:tier.trust[0]});
  if(tier.trust[1]!==null)event.conditions.push({stat:"trust",operator:"<=",value:tier.trust[1]});
}
for(const event of BASE_SITUATION_EVENTS)event.excludedHeroineIds=["yuna"];
export const SITUATION_EVENTS=[...BASE_SITUATION_EVENTS,...YUNA_STORY_EVENTS];
const STORY_CHAINS={
  "situation-almost-confession":["situation-late-dinner-coworker"],
  "situation-second-secret-meeting":["situation-coworker-private-drink","situation-almost-confession"],
  "situation-office-rumor":["situation-team-dinner-spark"],
  "situation-late-night-reconciliation":["situation-phone-notification-seen"],
  "situation-future-night-talk":["situation-parents-first-story"]
};
for(const event of BASE_SITUATION_EVENTS){event.requiredEvents=STORY_CHAINS[event.id]??[];event.chainId=event.category;event.chainStage=event.requiredEvents.length+1;}
export const EVENT_STATE_VALUES=["LOCKED","AVAILABLE","ACTIVE","COMPLETED","FAILED","COOLDOWN","CHAIN_ACTIVE"];

export function validateSituationEvents(events=SITUATION_EVENTS) {
  const ids=new Set(events.map(event=>event.id));
  const categories=Object.fromEntries(Object.keys(CATEGORY_CONFIG).map(category=>[category,events.filter(event=>event.category===category).length]));
  return events.length>=30&&ids.size===events.length&&categories.romance>=6&&categories.temptation>=5&&categories.conflict>=5&&categories.work>=4&&categories.friends>=3&&categories.money>=2&&categories.travel>=3&&categories.mystery>=2&&events.every(event=>event.scenes.length>=3&&event.scenes.reduce((sum,scene)=>sum+scene.dialogueTurns.length,0)>=30&&event.choices.length>=1&&event.storyFlag&&event.scenes.every(scene=>scene.backgroundId&&scene.characterIds.length&&scene.bgmId&&scene.expression&&scene.pose&&scene.transition)&&event.choices.every(choice=>choice.memory&&choice.flag&&choice.futureEventWeights));
}
