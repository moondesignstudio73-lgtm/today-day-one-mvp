import { HIDDEN_ROUTE_SCENES } from "./hidden-route-data.mjs";

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

export const STORY_SCENES = [...STANDARD_STORY_SCENES,...HIDDEN_ROUTE_SCENES];

export function validateStoryData(scenes = STORY_SCENES) {
  const ids = new Set();
  return scenes.every(scene => {
    if (typeof scene.id !== "string" || ids.has(scene.id)) return false;
    ids.add(scene.id);
    return typeof scene.arc === "string" && Array.isArray(scene.window) && scene.window.length === 2 && scene.window.every(Number.isInteger) && scene.window[0] <= scene.window[1] && typeof scene.title === "string" && typeof scene.message === "string" && Array.isArray(scene.choices) && scene.choices.length >= 2 && scene.choices.every(choice => typeof choice.id === "string" && typeof choice.label === "string" && typeof choice.response === "string" && Object.values(choice.effects ?? {}).every(Number.isFinite) && Object.values(choice.routeEffects ?? {}).every(Number.isFinite));
  });
}
