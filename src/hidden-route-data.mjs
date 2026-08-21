const ACTIVE = [{stat:"hiddenRoute.active",operator:"==",value:true}];

export const HIDDEN_ROUTE_SCENES = [
  {
    id:"hidden-perfect-first-day",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[1,1],priority:400,bgm:"theme",conditions:ACTIVE,
    title:"우리 오늘부터 진짜 1일이다?",speaker:"여자친구",message:"첫 데이트는 완벽했다. 하지만 헤어진 지 한 시간도 되지 않아 답을 재촉하는 메시지가 연달아 도착했다.",
    choices:[
      {id:"answer-all",label:"하던 일을 멈추고 메시지에 계속 답한다",effects:{affection:16,stress:6},routeEffects:{dependency:70,burden:25},routeFlags:{started:true},response:"“역시 오빠밖에 없어.” 안도는 빨랐지만 연락은 더 잦아졌다.",memory:"연애 첫날 모든 연락 요구에 답함"},
      {id:"set-pace",label:"집에 도착하면 연락하겠다고 차분히 약속한다",effects:{trust:10},routeEffects:{boundary:65,stability:25},routeFlags:{started:true},response:"“알겠어. 조금 서운하지만 기다려 볼게.” 두 사람의 첫 경계가 만들어졌다.",memory:"첫날부터 가능한 연락 시간을 약속함"}
    ]
  },
  {
    id:"hidden-luxury-hint",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[3,4],priority:390,bgm:"dateShopping",conditions:ACTIVE,requires:{sceneId:"hidden-perfect-first-day"},
    title:"이 가방 예쁘지 않아?",speaker:"여자친구",message:"38만원짜리 가방 사진 뒤로 ‘전 남친은 이런 거 잘 사줬었는데’라는 문장이 나타났다가 곧 삭제됐다.",
    choices:[
      {id:"buy",label:"바로 사 주겠다고 한다",effects:{money:-380000,affection:28},routeEffects:{dependency:110,burden:90,stability:30},response:"“진짜? 너무 좋아!” 기쁨과 함께 다음 부탁의 문턱도 낮아졌다.",memory:"비교하는 말 뒤에 38만원 가방을 사 줌"},
      {id:"budget",label:"선물 예산과 비교하는 말에 대해 솔직히 이야기한다",effects:{trust:8,conflict:4},routeEffects:{boundary:90,change:25,stability:-20},response:"“그냥 보여준 건데 왜 그래.” 웃어넘겼지만 선을 분명히 들었다.",memory:"첫 고가 선물 요구에 예산 경계를 세움"},
      {id:"ignore",label:"삭제된 메시지를 못 본 척한다",effects:{stress:5},routeEffects:{burden:35,stability:-25},response:"대화는 넘어갔지만 비교당한 감정은 마음에 남았다.",memory:"삭제된 전 남친 비교를 모른 척함"}
    ]
  },
  {
    id:"hidden-night-call",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[4,5],priority:395,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-luxury-hint"},
    title:"새벽 두 시의 전화",speaker:"여자친구",message:"울먹이는 목소리가 갑자기 너무 우울하다고 말한다. 내일은 중요한 출근일이다.",
    choices:[
      {id:"all-night",label:"새벽까지 통화하며 달랜다",effects:{affection:30,fatigue:35,energy:-30,work:-10},routeEffects:{dependency:95,stability:120,burden:80},response:"여자친구는 안정을 찾았다. 알람이 울릴 때 플레이어는 거의 잠들지 못했다.",memory:"내일의 일상을 희생해 밤새 통화함"},
      {id:"visit",label:"지금 바로 만나러 간다",effects:{affection:35,fatigue:40,stress:12,work:-15,money:-25000},routeEffects:{dependency:130,stability:150,burden:110},response:"품에 안긴 그녀는 진정됐다. 내일의 일정은 무너지기 시작했다.",memory:"새벽에 직접 찾아가 모든 일정을 희생함"},
      {id:"safe-boundary",label:"이유를 듣고 내일 다시 이야기할 시간을 정한다",effects:{trust:8,fatigue:10},routeEffects:{boundary:90,change:35,stability:45},response:"쉽게 끊지는 못했지만, 도움과 자기 일상을 함께 지키는 첫 연습이 됐다.",memory:"감정을 듣되 다음 날의 일상도 지킴"},
      {id:"snap",label:"내일 출근해야 한다며 짜증낸다",effects:{affection:-18,conflict:12},routeEffects:{stability:-120,burden:15},response:"전화는 갑자기 끊겼다. 새벽은 조용해졌지만 갈등은 남았다.",memory:"새벽 전화에 짜증으로 대응함"}
    ]
  },
  {
    id:"hidden-card-debt",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[6,7],priority:400,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-night-call"},
    title:"카드값 32만원",speaker:"여자친구",message:"충동 쇼핑으로 결제일을 막을 수 없다며 ‘나 오빠밖에 없어’라고 도움을 청한다.",
    choices:[
      {id:"pay",label:"32만원을 바로 보내준다",effects:{money:-320000,affection:32},routeEffects:{dependency:160,burden:140,stability:80},response:"문제는 사라졌다. 스스로 해결해야 할 이유도 함께 사라졌다.",memory:"충동 소비 카드값을 대신 갚아 줌"},
      {id:"plan",label:"일부만 돕고 상환·예산 계획을 함께 만든다",effects:{money:-100000,trust:12,stress:6},routeEffects:{boundary:120,change:110,stability:30,burden:40},response:"“귀찮지만… 이번에는 적어 볼게.” 도움의 방식이 달라지기 시작했다.",memory:"카드값 대신 예산 계획과 제한된 도움을 제안함"},
      {id:"refuse",label:"이번 소비는 스스로 해결해야 한다고 말한다",effects:{affection:-18,conflict:10},routeEffects:{boundary:100,stability:-100},response:"그날 밤 연락이 끊겼다. 거절은 필요했지만 대화 방식도 상처를 남겼다.",memory:"충동 소비 해결을 단호하게 거절함"}
    ]
  },
  {
    id:"hidden-first-disappearance",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[8,9],priority:405,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-card-debt"},
    title:"온라인인데 답이 없다",speaker:"여자친구",message:"하루 종일 연락은 닿지 않지만 SNS 접속 기록은 남아 있다. 새벽 한 시, ‘오빠는 걱정도 안 되나 봐’라는 메시지가 온다.",
    choices:[
      {id:"chase",label:"계속 전화하고 집까지 찾아간다",effects:{affection:12,stress:18,fatigue:18},routeEffects:{dependency:120,burden:90,stability:35},response:"걱정받았다는 안도와 언제든 찾아올 거라는 기대가 함께 커졌다.",memory:"첫 잠수에 밤새 연락하고 찾아감"},
      {id:"one-message",label:"안전을 묻는 메시지 하나를 남기고 기다린다",effects:{trust:10,stress:8},routeEffects:{boundary:85,change:45,stability:25},response:"“걱정했지만 네가 말할 준비가 될 때 기다렸어.” 비난 없는 경계를 전했다.",memory:"첫 잠수에 안전을 확인하고 기다림"},
      {id:"mirror",label:"나도 똑같이 연락을 끊는다",effects:{trust:-14,conflict:14},routeEffects:{stability:-130,burden:45},response:"침묵과 침묵이 부딪쳤다. 아무도 무엇이 힘들었는지 말하지 못했다.",memory:"잠수에 잠수로 맞섬"}
    ]
  },
  {
    id:"hidden-strange-lie",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[10,11],priority:400,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-first-disappearance"},
    title:"그게 그렇게 중요해?",speaker:"여자친구",message:"하루 종일 집에 있었다는 말과 친구 SNS 속 사진이 맞지 않는다.",
    choices:[
      {id:"calm-proof",label:"증거를 보여주고 거짓말의 이유를 차분히 묻는다",effects:{trust:6,conflict:5},routeEffects:{boundary:80,change:70,stability:-30},response:"처음에는 피했지만 결국 친구를 잠깐 만났다고 인정했다.",memory:"첫 거짓말을 증거와 함께 차분히 확인함"},
      {id:"drop-it",label:"더 싸우기 싫어 넘어간다",effects:{trust:-10,stress:6},routeEffects:{dependency:55,burden:60,stability:-45},response:"갈등은 없었다. 진실을 말하지 않아도 된다는 기억이 남았다.",memory:"명백한 거짓말을 모른 척 넘김"},
      {id:"attack",label:"거짓말쟁이라며 몰아붙인다",effects:{trust:-18,conflict:18},routeEffects:{stability:-150,change:-25},response:"대화는 사실 확인보다 서로를 공격하는 싸움이 됐다.",memory:"거짓말 사건이 큰 비난으로 번짐"}
    ]
  },
  {
    id:"hidden-sweet-day",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[12,12],priority:410,bgm:"dateShopping",conditions:ACTIVE,requires:{sceneId:"hidden-strange-lie"},
    title:"그래도 좋은 애잖아",speaker:"여자친구",message:"도시락과 작은 선물, 먼저 낸 데이트 비용. 모든 문제가 사라진 것처럼 완벽하게 행복한 하루다.",
    choices:[
      {id:"enjoy",label:"분석하지 않고 행복한 하루를 함께 즐긴다",effects:{affection:45,excitement:35,stress:-18},routeEffects:{stability:130,burden:-45},response:"오랜만에 둘은 아무 걱정 없이 웃었다. 좋은 기억도 분명 진짜였다.",memory:"문제 사이에서 완벽하게 행복했던 하루"},
      {id:"appreciate-and-talk",label:"고마움을 표현하고 최근 문제도 나중에 함께 풀자고 한다",effects:{affection:30,trust:18,stress:-10},routeEffects:{boundary:65,change:85,stability:100,burden:-30},response:"“오늘은 즐기고, 우리 얘기도 피하지 말자.” 행복과 현실을 함께 놓지 않았다.",memory:"행복한 날에도 관계의 문제를 외면하지 않음"}
    ]
  },
  {
    id:"hidden-dependency",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[14,15],priority:400,bgm:"theme",conditions:ACTIVE,requires:{sceneId:"hidden-sweet-day"},
    title:"나보다 친구들이 좋아?",speaker:"여자친구",message:"운동, 회식, 친구 약속마다 애정을 확인한다. 모든 요구를 받아줄수록 그녀의 세계는 더 좁아진다.",
    choices:[
      {id:"cancel-all",label:"약속을 취소하고 계속 함께 있는다",effects:{affection:25,social:-18,work:-6},routeEffects:{dependency:160,burden:120,stability:60},response:"그녀는 웃었다. 플레이어의 다른 관계는 하나씩 멀어졌다.",memory:"연인의 불안을 달래기 위해 내 약속을 모두 취소함"},
      {id:"schedule",label:"함께할 시간과 각자의 시간을 구체적으로 정한다",effects:{trust:12,social:4},routeEffects:{boundary:140,change:105,stability:25},response:"처음에는 서운해했지만 약속된 시간을 확인하며 조금씩 기다렸다.",memory:"연애와 개인 생활의 시간을 함께 정함"},
      {id:"dismiss",label:"집착하지 말라며 대화를 끊는다",effects:{affection:-15,conflict:12},routeEffects:{stability:-110,boundary:25},response:"필요한 경계가 비난처럼 전달되며 불안은 더 커졌다.",memory:"의존 문제를 집착이라는 말로 밀어냄"}
    ]
  },
  {
    id:"hidden-police-station",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[16,17],priority:420,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-dependency"},
    title:"모르는 번호, 밤 10시",speaker:"경찰서",message:"술자리에서 물건을 망가뜨린 여자친구가 도움을 청한다. 내일은 중요한 회사 발표가 있다.",
    choices:[
      {id:"go",label:"회사 발표 준비를 포기하고 바로 간다",effects:{affection:30,work:-22,stress:22,fatigue:24,money:-120000},routeEffects:{dependency:160,burden:170,stability:100},response:"그녀는 무사히 돌아왔다. 플레이어의 발표와 평판은 대신 무너졌다.",memory:"경찰서 문제를 해결하느라 중요한 발표를 포기함"},
      {id:"family",label:"가족에게 연락하고 필요한 절차만 돕는다",effects:{trust:8,stress:10,money:-30000},routeEffects:{boundary:130,change:120,stability:50,burden:45},response:"혼자 떠맡지 않고 도움의 범위를 정했다. 그녀도 결과를 직접 마주했다.",memory:"경찰서 사건을 가족과 분담하고 경계를 지킴"},
      {id:"taxi-only",label:"택시비만 보내고 스스로 해결하게 한다",effects:{money:-30000,affection:-8},routeEffects:{boundary:80,change:70,stability:-25},response:"차갑게 느껴졌지만 이번 사건의 책임은 그녀에게 남았다.",memory:"경찰서 사건에 제한된 도움만 제공함"},
      {id:"abandon",label:"연락을 끊고 아무 도움도 주지 않는다",effects:{trust:-20,conflict:18},routeEffects:{stability:-180,boundary:55},response:"발표는 지켰지만 관계에는 깊은 단절이 남았다.",memory:"경찰서의 도움 요청을 완전히 외면함"}
    ]
  },
  {
    id:"hidden-cracks",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[18,19],priority:405,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-police-station"},
    title:"요즘 무슨 일 있어?",speaker:"상사",message:"수면 부족, 줄어든 잔고, 멀어진 친구. 플레이어의 세계가 연애 한 사람으로 좁아지고 있다.",
    choices:[
      {id:"ask-help",label:"내 상태를 인정하고 친구와 회사에 도움을 요청한다",effects:{stress:-12,health:8,social:10,confidence:8},routeEffects:{boundary:110,burden:-90,change:35},response:"혼자 버티지 않자 무너진 일상의 일부가 다시 자리를 찾았다.",memory:"관계 밖 사람들에게 내 어려움을 털어놓음"},
      {id:"hide-collapse",label:"아무 문제 없다고 숨기고 계속 버틴다",effects:{stress:18,health:-10,work:-12},routeEffects:{burden:130,dependency:55},response:"겉으로는 하루를 넘겼다. 몸과 일은 더 분명한 신호를 보내기 시작했다.",memory:"내가 무너지는 상황을 모두에게 숨김"}
    ]
  },
  {
    id:"hidden-happy-trip",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[20,20],priority:420,bgm:"dateShopping",conditions:ACTIVE,requires:{sceneId:"hidden-cracks"},
    title:"그래도 나 안 버릴 거지?",speaker:"여자친구",message:"아무 사고 없이 행복했던 여행의 밤, 여자친구가 처음으로 자신이 힘들게 한다는 사실을 인정한다.",
    choices:[
      {id:"promise-everything",label:"무슨 일이 있어도 내가 다 책임지겠다고 약속한다",effects:{affection:35},routeEffects:{dependency:180,stability:100,burden:120},response:"“정말 나한테는 오빠뿐이야.” 달콤한 약속이 더 무거운 책임이 됐다.",memory:"모든 문제를 책임지겠다고 영구적인 약속을 함"},
      {id:"love-with-boundary",label:"사랑하지만 우리 둘 다 바뀌어야 함께할 수 있다고 말한다",effects:{affection:24,trust:20},routeEffects:{boundary:150,change:180,stability:90,burden:-35},response:"긴 침묵 뒤 그녀가 고개를 끄덕였다. 처음으로 사랑과 변화가 같은 문장에 놓였다.",memory:"사랑과 건강한 경계를 함께 약속함"},
      {id:"uncertain",label:"지금은 확답할 수 없다고 솔직히 말한다",effects:{trust:10,affection:-10},routeEffects:{boundary:90,stability:-45,change:55},response:"상처는 있었지만 거짓 위로 대신 진짜 고민이 남았다.",memory:"버리지 않겠다는 확답 대신 솔직한 한계를 말함"}
    ]
  },
  {
    id:"hidden-boundary-plan",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[22,23],priority:410,bgm:"theme",conditions:ACTIVE,requires:{sceneId:"hidden-happy-trip"},
    title:"돕는 것과 대신 사는 것은 다르다",speaker:"나",message:"돈, 연락, 위기 상황을 어떻게 다룰지 두 사람이 구체적인 규칙을 만들 시간이다.",
    choices:[
      {id:"make-plan",label:"예산·연락 시간·위기 연락망을 함께 정한다",effects:{trust:20,confidence:10},routeEffects:{boundary:190,change:210,stability:130,dependency:-90,burden:-80},response:"규칙은 차갑지 않았다. 두 사람 모두 살아가기 위한 약속이었다.",memory:"예산과 연락, 위기 대처 경계를 함께 문서로 정함"},
      {id:"keep-rescuing",label:"계획보다 내가 계속 해결해 주는 편을 택한다",effects:{affection:18,stress:12},routeEffects:{dependency:170,boundary:-80,burden:130,stability:55},response:"당장은 편했다. 다음 위기에도 같은 역할이 기다리고 있었다.",memory:"변화 계획 대신 계속 문제를 해결해 주기로 함"}
    ]
  },
  {
    id:"hidden-biggest-incident",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[24,24],priority:430,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-boundary-plan"},
    title:"집에 가고 싶은데 돈이 없어",speaker:"여자친구",message:"충동적으로 큰돈을 쓰고 다른 지역까지 간 그녀가 다시 도움을 요청한다.",
    choices:[
      {id:"rescue-again",label:"돈을 보내고 직접 데리러 간다",effects:{money:-260000,stress:22,fatigue:20,affection:20},routeEffects:{dependency:190,boundary:-90,burden:180,stability:85},response:"그녀는 돌아왔다. 이번에도 해결은 플레이어의 몫이었다.",memory:"가장 큰 사고도 돈과 시간으로 대신 해결함"},
      {id:"guided-help",label:"안전한 귀가 방법을 찾되 비용과 절차는 직접 해결하게 한다",effects:{trust:12,stress:10},routeEffects:{boundary:170,change:170,stability:70,dependency:-55},response:"“미안해. 이번에는 내가 해볼게.” 처음으로 도움을 받되 해결은 스스로 했다.",memory:"큰 사고에서 안전만 돕고 해결 책임은 돌려줌"},
      {id:"leave-choice",label:"이 관계를 더는 감당할 수 없다고 말한다",effects:{affection:-28,trust:5},routeEffects:{boundary:180,stability:-140,burden:-80},routeFlags:{choseLeave:true},response:"긴 침묵 끝에 통화가 끝났다. 사랑과 생존이 같은 선택이 아닐 수 있었다.",memory:"반복된 사고 끝에 관계에서 나갈 뜻을 밝힘"}
    ]
  },
  {
    id:"hidden-role-reversal",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[25,26],priority:425,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-biggest-incident"},
    title:"이번에는 내가 옆에 있을게",speaker:"여자친구",message:"플레이어가 회사 실수와 건강 악화로 주저앉았다. 이제 여자친구의 변화가 시험받는다.",
    choices:[
      {id:"accept-support",label:"힘들다고 솔직히 말하고 도움을 받아들인다",effects:{health:10,stress:-15,trust:12},routeEffects:{burden:-80},routeFlags:{receivedSupport:true},response:"그녀는 처음으로 요구하지 않고 플레이어의 말을 끝까지 들었다.",outcomes:[{conditions:[{stat:"hiddenRoute.change",operator:">=",value:450}],effects:{affection:22,trust:18},routeEffects:{stability:160,change:90},response:"“오늘은 내가 갈게.” 초반 새벽 전화와 정확히 반대되는 장면이 시작됐다."}],memory:"무너진 순간 여자친구의 도움을 받아들임"},
      {id:"hide-pain",label:"괜찮다고 말하고 혼자 버틴다",effects:{health:-8,stress:15},routeEffects:{burden:90},response:"역할이 바뀔 기회는 오지 않았다. 플레이어는 다시 혼자 버텼다.",memory:"내가 무너진 사실도 연인에게 숨김"}
    ]
  },
  {
    id:"hidden-friend-question",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[27,27],priority:440,bgm:"theme",conditions:ACTIVE,requires:{sceneId:"hidden-role-reversal"},
    title:"너 행복해?",speaker:"친구",message:"대답 하나가 엔딩을 정하지는 않는다. 하지만 27일 동안 어떤 관계를 만들었는지는 숨길 수 없다.",
    choices:[
      {id:"love",label:"힘들어도 여전히 사랑한다고 말한다",effects:{affection:12},routeEffects:{burden:25},response:"사랑은 분명했다. 이제 그 사랑이 두 사람을 살리는지도 봐야 했다.",memory:"힘든 관계에서도 남아 있는 사랑을 인정함"},
      {id:"responsibility",label:"내가 책임져야 한다고 말한다",effects:{stress:10},routeEffects:{dependency:90,boundary:-55,burden:90},response:"친구는 사랑이 아니라 책임이라는 단어를 오래 바라봤다.",memory:"연애를 사랑보다 내 책임으로 정의함"},
      {id:"tired",label:"너무 지쳤고 이제 나도 살아야 한다고 말한다",effects:{confidence:12,stress:-8},routeEffects:{boundary:100,burden:-55},response:"처음으로 관계 밖에서 자신의 상태를 소리 내어 말했다.",memory:"친구에게 관계의 피로와 내 생존을 고백함"}
    ]
  },
  {
    id:"hidden-final-crisis",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[28,28],priority:450,bgm:"crisis",conditions:ACTIVE,requires:{sceneId:"hidden-friend-question"},
    title:"결국 오빠도 똑같네",speaker:"여자친구",message:"마지막 큰 갈등 앞에서 사랑, 한계, 이별, 함께 바뀌는 방법이 모두 다른 선택지로 놓였다.",
    choices:[
      {id:"do-everything",label:"내가 다 해줄게",effects:{affection:30,stress:18},routeEffects:{dependency:200,boundary:-130,burden:170,stability:80},response:"갈등은 멈췄다. 두 사람의 역할은 더 단단히 고정됐다.",memory:"마지막 위기에서도 모든 것을 대신하겠다고 약속함"},
      {id:"love-limit",label:"사랑하지만 내가 할 수 없는 것도 있어",effects:{trust:16,conflict:-6},routeEffects:{boundary:190,change:120,stability:60,burden:-50},response:"처음으로 한계가 버림이 아니라 관계의 조건으로 전달됐다.",memory:"마지막 위기에서 사랑과 한계를 함께 말함"},
      {id:"end",label:"우리 둘 다 이렇게 만나는 건 아닌 것 같아",effects:{affection:-25,trust:8},routeEffects:{boundary:170,burden:-90,stability:-120},routeFlags:{choseLeave:true},response:"둘은 좋아하는 마음과 계속 만나는 선택을 분리해 바라봤다.",memory:"서로를 망가뜨리는 관계를 끝내기로 함"},
      {id:"together-plan",label:"우리 둘 다 살아갈 방법을 같이 찾아보자",effects:{affection:18,trust:24,conflict:-10},routeEffects:{boundary:170,change:220,stability:170,dependency:-80,burden:-90},response:"완벽한 구원 대신 각자의 책임과 함께할 방법을 선택했다.",memory:"둘 모두의 삶을 지키는 변화 계획을 다시 선택함"}
    ]
  },
  {
    id:"hidden-quiet-day",arc:"사랑하면 감당할 수 있을 줄 알았다",window:[29,29],priority:460,bgm:"theme",conditions:ACTIVE,requires:{sceneId:"hidden-final-crisis"},
    title:"우리 처음 사귈 때 기억나?",speaker:"여자친구",message:"첫 연락, 가방, 새벽 전화, 카드값, 잠수, 거짓말, 경찰서, 여행과 마지막 싸움이 조용히 지나간다.",
    choices:[
      {id:"remember-us",label:"좋았던 순간과 힘들었던 순간을 모두 기억한다",effects:{trust:12,stress:-6},routeEffects:{change:55,stability:45},response:"어느 한 장면도 거짓은 아니었다. 이제 결과는 사랑만이 아니라 삶 전체로 결정된다.",memory:"29일의 좋은 기억과 상처를 함께 돌아봄"},
      {id:"remember-self",label:"그 관계 속에서 달라진 내 모습도 돌아본다",effects:{confidence:14,health:5},routeEffects:{boundary:75,burden:-35},response:"플레이어는 처음으로 ‘나는 행복했나’를 자기 자신에게 물었다.",memory:"관계 속에서 잃고 지킨 나의 삶을 돌아봄"}
    ]
  }
];
