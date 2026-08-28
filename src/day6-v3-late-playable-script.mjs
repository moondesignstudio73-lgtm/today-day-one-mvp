const line=(speaker,text)=>Object.freeze({type:"dialogue",speaker,text});
const action=(text)=>Object.freeze({type:"action",text});
const narration=(text)=>Object.freeze({type:"narration",text});
const branch=(key,steps)=>Object.freeze({key,steps:Object.freeze(steps)});
const scene=(number,steps,branches=[])=>Object.freeze({id:`D6V3_S${String(number).padStart(2,"0")}`,number,steps:Object.freeze(steps),branches:Object.freeze(branches)});

const songCard=Object.freeze([
  action("하은이 가방에서 메모용 작은 카드 두 장을 꺼낸다."),line("하은","이거라도 적어 갈까. 다시 찾으면 또 제목만 보고 고를 것 같아서."),action("각자 고른 곡의 제목을 한 장에 적어 바꿔 갖는다. 서로에게 잘 맞는 노래는 아니었지만, 고른 이유까지 같이 가져간다."),
  action("주인공이 건네받은 카드의 빈 뒷면을 본다."),line("하은","다른 곡으로 바꿔 줄까?"),line("주인공","왜?"),line("하은","마음에 꼭 드는 건 아닌 것 같아서."),line("주인공","네가 골랐다는 건 마음에 드는데."),action("하은의 손이 카드 끝에서 멈춘다."),line("주인공","노래는…… 한 번 더 들어 보고."),line("하은","뒤에 꼭 붙여야겠어?"),line("주인공","앞에만 말하면 또 참는 줄 알까 봐."),action("하은은 웃다가 조용해진다. 아침에는 테이블만 내려다보았는데, 지금은 그의 얼굴을 본다."),line("하은","그래. 그건 알겠다."),action("하은도 카드를 바꾸지 않고 챙긴다. 두 사람이 좋아하는 노래가 꼭 같아야 할 필요는 없었다.")
]);
const photoAfter=Object.freeze([
  action("휴대폰을 돌려받은 하은이 사진을 확대한다."),line("하은","다시 찍을까?"),action("주인공이 사진을 본다. 오전 사진에서는 보이지 않던 표정이다."),line("주인공","아니. 이게 오늘 같아."),line("하은","나 혼자 잘못 나온 건 아니니까."),action("그녀가 사진을 전송한다. 두 사람의 휴대폰에 같은 한 장이 남는다."),
  action("문밖에서 하은이 휴대폰을 다시 들여다본다."),line("주인공","그래도 다시 찍고 싶어?"),line("하은","아니. 너 여기."),action("그녀가 사진 속 주인공의 눈가를 확대한다."),line("하은","나 때문에 웃은 거잖아."),action("주인공이 화면을 보다가 하은을 본다."),line("주인공","응."),action("하은은 더 확대하지 않고 휴대폰을 넣는다."),line("하은","그럼 됐어."),action("문이 닫히며 가게의 음악이 작아진다. 하은이 먼저 걷기 시작하고 주인공이 따라붙는다. 오전처럼 뒤늦게 쫓아 나가는 걸음은 아니다.")
]);
const cardAfter=Object.freeze([
  action("하은은 자기 문장을 가리고 카드를 가방에 넣는다."),line("주인공","나는 보여 줬는데."),line("하은","내 건 아직 고치는 중."),line("주인공","얼마나 길게 썼길래."),line("하은","다음에 보여 줄게."),action("주인공이 그녀를 본다."),line("주인공","그럼 다음 데이트 확정이네."),line("하은","……걸렸다.")
]);

export const DAY6_V3_PLAYABLE_SCRIPT_15_23=Object.freeze([
  scene(15,[action("직원이 고른 곡을 잠깐씩 들려준다.")],[
    branch("music-title-only",[action("차분한 제목과 달리 첫 소리부터 기타가 거칠게 터진다. 하은의 눈이 커진다."),line("하은","이걸 왜 골랐어?"),line("주인공","제목 예뻐서."),line("하은","노래를 제목으로 골라?"),line("주인공","다른 정보가 없었어."),action("하은이 입술을 깨물고 웃다가 직원에게 작은 목소리로 부탁한다."),line("하은","조금만 줄여 주실 수 있어요?")]),
    branch("music-haeun-pick",[action("하은이 고른 곡은 전주가 길다. 주인공은 노래가 시작되는 줄 알고 두 번 고개를 들었다."),line("하은","지루해?"),line("주인공","아니. 가수를 기다리고 있어."),line("하은","연주곡인데."),action("주인공이 앨범을 다시 본다. 하은이 드디어 소리 내 웃는다.")]),
    branch("music-swap-reasons-later",[action("주인공의 빠른 곡이 끝나고 하은의 느린 곡이 이어진다."),line("하은","내가 이렇게 뛰어다닐 것 같았어?"),line("주인공","아까 길 찾을 때는."),line("하은","그래서 나는 좀 앉아 있으라고 골랐어."),action("둘은 서로 고른 앨범을 바꿔 본다. 어느 쪽도 자기 취향이라고 말하지 않는다.")]),
    branch("relationship-LOW",[action("하은이 앨범을 가운데 놓는다. 손이 겹칠 듯하자 둘 다 반대쪽 모서리를 잡는다."),line("하은","여기 글씨 작다."),line("주인공","내가 들고 있을게."),action("하은이 한 발 가까이 와 함께 읽는다. 어깨 사이에는 여전히 작은 틈이 있다."),...songCard]),
    branch("relationship-MID",[action("같은 글씨를 읽느라 어깨가 닿는다. 하은은 앨범을 조금 들어 올릴 뿐 옆으로 물러서지 않는다."),line("하은","너 아까 노래 들을 때 표정 웃겼어."),line("주인공","다 봤어?"),line("하은","응. 노래보다 재밌었어."),...songCard]),
    branch("relationship-HIGH",[action("같은 글씨를 읽느라 어깨가 닿는다. 하은은 옆으로 물러서지 않는다."),line("주인공","아까부터 웃는 거 예쁘다."),action("하은이 앨범을 거꾸로 꽂으려다 멈춘다."),line("하은","그런 말은 예고하고 해."),line("주인공","예고하면 안 이상해?"),action("하은이 제대로 꽂고 돌아선다."),line("하은","너도 오늘 잘 어울려. 셔츠."),action("잠시 눈을 마주치다가 둘이 다른 진열대를 보는 척한다."),...songCard]),
    branch("relationship-VERY_HIGH",[action("같은 글씨를 읽느라 어깨가 닿는다. 하은은 옆으로 물러서지 않는다."),line("주인공","아까부터 웃는 거 예쁘다."),line("하은","그런 말은 예고하고 해."),line("주인공","예고하면 안 이상해?"),line("하은","너도 오늘 잘 어울려. 셔츠."),...songCard])
  ]),
  scene(16,[line("하은","사진 찍을래?"),action("이번에는 과거 사진을 꺼내지 않는다. 주인공이 고개를 끄덕이자 하은이 직원에게 휴대폰을 건넨다.")],[
    branch("current-photo-formal",[action("주인공이 등을 곧게 편다."),line("하은","너무 제대로인데."),action("셔터 직전 주인공이 웃음을 터뜨린다. 하은은 그를 보느라 옆얼굴만 남는다."),...photoAfter]),
    branch("current-photo-funny",[action("주인공이 진지하게 턱을 괴자 하은이 더 과장된 포즈로 따라 한다. 둘 다 버티지 못하고 웃는다. 사진 속 손끝과 입가가 조금 흔들린다."),...photoAfter]),
    branch("current-photo-candid",[action("주인공은 웃고, 하은은 멋있는 표정을 지으려 한다. 찍힌 얼굴을 보니 하은만 억울해 보인다."),line("하은","이건 내가 의도한 게 아닌데."),line("주인공","무슨 억울한 일 있어 보여."),line("하은","방금 생겼어."),...photoAfter])
  ]),
  scene(17,[action("레코드숍에서 나와 연희동 골목을 더 걷는다. 쉬어 가자는 말에 둘은 공원으로 향한다. 이름 때문에 조금 망설였던 곳이다."),line("하은","여기도 예전에……."),action("주인공이 웃으며 손을 들어 보인다."),line("주인공","오늘은 안 물어볼게."),line("하은","아니, 공사해서 입구 옮겼었다고."),action("주인공이 손을 내린다."),line("하은","끝까지 듣기."),line("주인공","응. 그건 배웠네."),action("둘은 빈 벤치에 앉는다. 이번에는 어느 쪽에 앉았는지 묻지 않는다.")]),
  scene(18,[action("하은이 곡 제목을 적은 카드 뒷면을 손가락으로 두드린다."),line("하은","뒤에 한 줄 더 쓸까? 오늘 새로 알게 된 거."),line("주인공","너에 대해서?"),line("하은","응. 길 못 찾는다는 거 빼고.")],[
    branch("card-tease",[line("하은","나만 웃었어?"),line("주인공","제일이라고 했지."),action("하은이 ‘같이’라는 말을 작게 덧붙인다."),...cardAfter]),
    branch("card-shared-time",[action("하은이 카드를 잠깐 보고 답한다."),line("하은","망가져서 웃은 건 아닌데."),line("주인공","알아."),line("하은","알면 됐어."),...cardAfter]),
    branch("card-current-taste",[action("하은이 문장을 한 번 더 읽는다."),line("하은","나도 가끔 또 물어볼 거야. 예전 얘기."),line("주인공","나도 물어볼 것 같아."),line("하은","오늘처럼 거기만 있지는 말자."),...cardAfter])
  ]),
  scene(19,[action("하은이 점심 영수증을 꺼내다가 함께 접힌 휴지를 떨어뜨린다. 주인공이 주워 주자 그녀가 웃는다."),line("하은","오늘 뭘 제일 잘 골랐다고 생각해?")],[
    branch("lunch-spicy",[line("주인공","물."),line("하은","그건 주문도 안 했잖아."),line("주인공","제일 만족스러웠어."),action("하은이 물병에 동시에 손을 뻗던 모습을 흉내 낸다. 이번에는 주인공이 먼저 웃는다.")]),
    branch("lunch-share-bites",[line("주인공","라면. 적어도 안 터졌잖아."),line("하은","김밥도 원래 안 터져."),line("주인공","그건 내가 아직 못 봐서."),action("하은이 웃으며 영수증을 접는다.")]),
    branch("lunch-carrot-gimbap",[line("주인공","김밥. 당근에 대해서는 조금 더 생각해 보고."),line("하은","다음에도 속 안 빼게?"),line("주인공","그날 내가 정할게."),line("하은","그래. 나는 그때 물어볼게.")]),
    branch("common",[action("웃음이 가라앉은 뒤에도 바로 일어나지 않는다. 하은이 발끝으로 땅을 한 번 문지른다."),line("하은","나는 여기 온 거."),action("주인공이 공원을 둘러보자 하은이 덧붙인다."),line("하은","아니. 아침에 나온 거.")])
  ]),
  scene(20,[action("벤치에서 일어나 나란히 걷는다. 팔을 흔들다 손등이 가볍게 스친다.")],[
    branch("relationship-LOW",[action("하은이 잠깐 주인공을 본다. 둘은 걸음을 맞추되 조금 거리를 둔다."),line("하은","조금만 더 걸을까."),line("주인공","응."),action("말없이 걷는 시간이 아까 카페에서와는 다르다.")]),
    branch("relationship-MID_PLUS",[action("하은은 주머니에 손을 넣지 않는다. 주인공도 거리를 벌리지 않는다. 두 번째로 손이 스친다."),line("하은","이 정도면 우연 두 번."),line("주인공","세 번째부터는?"),line("하은","글쎄.")]),
    branch("hand-offer-CONTACT",[action("주인공이 하은의 손에 손가락을 가볍게 건다. 하은이 멈칫하다가 손바닥을 맞댄다.")]),
    branch("hand-ask-CONTACT",[line("하은","응."),action("하은이 먼저 손을 내민다. 주인공이 그 손을 잡는다.")]),
    branch("hand-offer-NO_CONTACT",[action("주인공이 손을 뻗다가 멈춘다. 하은도 걸음을 늦춘다."),line("하은","나 오늘은 조금 더 천천히 가고 싶어."),line("주인공","알았어."),action("내려놓은 손 사이로 바람이 지나간다. 하은은 자리를 뜨지 않고 기다린다.")]),
    branch("hand-ask-NO_CONTACT",[line("하은","오늘은 그냥 걷자."),line("주인공","응. 그러자."),action("하은이 짧게 웃는다. 둘은 같은 방향으로 몸을 돌린다.")]),
    branch("hand-keep-walking",[action("주인공은 손을 잡는 대신 그녀의 속도에 맞춘다."),line("주인공","한 바퀴 더?"),line("하은","응. 아직 얘기 남았어.")]),
    branch("contact-MID_HIGH",[action("손을 잡고 몇 걸음 걷는 동안 둘 다 말이 없다. 하은이 손 쪽을 내려다본다."),line("하은","……이건 기억났어?"),line("주인공","아니."),action("잠시."),line("주인공","내가 지금 잡고 싶어서."),action("하은의 손에 힘이 아주 조금 들어간다."),line("하은","그 대답, 반칙이다."),line("주인공","놓을까?"),line("하은","반칙이라고 했지, 싫다고는 안 했어."),action("하은이 앞을 보며 걷는다. 누구도 과거에 어떻게 잡았는지 묻지 않는다.")]),
    branch("contact-VERY_HIGH",[action("하은이 손을 조금 고쳐 잡는다. 주인공이 손가락을 펴자 그녀의 손가락이 사이로 들어온다."),line("하은","이렇게가 편해."),line("주인공","나도."),action("편하다는 말에 비해 둘 다 걸음이 조금 느리다.")])
  ]),
  scene(21,[],[
    branch("drink-past-americano",[line("하은","근데 너 아메리카노 진짜 맛없었지."),line("주인공","죽는 줄 알았어."),line("하은","왜 자꾸 마셨어."),line("주인공","네가 좋아했던 나 따라 하느라."),action("하은이 잠시 걷는 속도를 늦춘다."),line("하은","다음부터 그러지 마."),line("주인공","응.")]),
    branch("drink-current-choice",[line("하은","아까 네 음료 맛 물어봤을 때, 대답 못 들었네."),line("주인공","그러게. 자리만 봤구나."),line("하은","맛은 있었어?"),line("주인공","응. 다음에도 마실 것 같아."),line("하은","그럼 됐어.")]),
    branch("drink-match-haeun",[line("하은","내가 고른 음료는 어땠어?"),line("주인공","생각보다 달았어."),line("하은","달다고 했잖아."),line("주인공","응. 다음에는 한 모금 먼저 얻어먹을게."),action("하은이 웃는다.")]),
    branch("common",[action("잠깐 말을 쉬었다가 주인공이 입을 연다."),line("주인공","대신 네가 좋아하는 건 좀 알려 줘."),line("하은","왜?"),line("주인공","따라 해 보려고 그러는 거 아니고."),action("하은을 본다."),line("주인공","그냥 궁금해서."),line("하은","나는 노래, 끝나기 전에 끄는 거 싫어."),line("주인공","오늘 그 전주 긴 거?"),line("하은","그것도. 뒤에 가면 달라지거든."),line("주인공","다음에는 끝까지 들어 보자."),line("하은","싫으면 싫다고 해도 돼."),line("주인공","듣고 나서."),action("하은이 작게 고개를 끄덕인다. 역에 도착할 때까지 그녀가 노래의 뒷부분을 이야기한다. 주인공은 이번에는 자신이 예전에 알았는지 묻지 않는다.")])
  ]),
  scene(22,[action("집까지 함께 오는 동안 둘은 오늘 길을 헤맨 횟수를 서로 다르게 센다. 현관 앞에 와서야 말이 끊긴다."),line("하은","그래서 오늘은 뭐였어?")],[
    branch("name-first-date",[line("하은","그럼 오늘 사진은 첫 장이네."),action("주인공이 휴대폰 속 사진을 보여 준다."),line("주인공","표지부터 좀 흔들렸는데."),line("하은","알아볼 수 있으면 됐지.")]),
    branch("name-restarted-date",[line("하은","두 번째 시도는 괜찮았어?"),line("주인공","응. 점심 먹기 전에 집에 갔으면 큰일 날 뻔했어."),line("하은","나도.")]),
    branch("name-next-day",[line("하은","그럼 카드도 그때."),line("주인공","계속 다음으로 미루는 건 아니지?"),line("하은","한 번만. 약속.")]),
    branch("goodbye-LOW",[line("하은","오늘 같이 나와 줘서 고마워."),line("주인공","나도. 조심히 가."),action("하은은 카드를 넣어 둔 가방을 한 번 두드린 뒤 돌아선다.")]),
    branch("goodbye-MID",[line("하은","다음에는 지도 네가 봐."),line("주인공","내가 길 잃으면?"),line("하은","같이 찾지 뭐."),action("하은이 손을 흔든다.")]),
    branch("goodbye-HIGH-CONTACT",[line("하은","여기까지 왜 이렇게 금방이지."),line("주인공","중간에 한 바퀴 더 돌았는데."),line("하은","알아."),action("잡고 있던 손을 놓은 뒤, 하은이 손가락을 한 번 접었다 편다.")]),
    branch("goodbye-HIGH-NO_CONTACT",[line("하은","아까 물어본 거."),line("주인공","뭐?"),line("하은","내가 좋아하는 거. 다음에도 물어봐."),action("그녀는 바로 돌아서지 않는다. 주인공도 문을 열지 않는다.")]),
    branch("goodbye-VERY_HIGH-CONTACT",[action("하은이 손을 놓으려다 다시 아주 약하게 쥔다."),line("하은","내일은 내가 먼저 연락할게."),line("주인공","오늘도 네가 먼저 했는데."),line("하은","내일도 하고 싶어서."),action("마지막 손가락이 떨어진 뒤에야 그녀가 한 걸음 물러선다.")])
  ]),
  scene(23,[action("주인공이 오늘 사진을 연다. 확대하면 조금 흐리다. 작게 보면 둘 다 웃고 있다."),action("새 앨범의 이름을 입력한다: 오늘부터"),line("하은","집 도착."),line("하은","카드 내용은 아직 비밀."),line("하은","내일 야경 볼까? 놀이공원도 좋고."),line("하은","서점 갔다가 저녁 먹는 것도."),line("주인공","너는 어디가 제일 가고 싶은데?")],[
    branch("message-LOW",[line("하은","서점 쪽. 내일 얘기하자."),line("하은","오늘 고마웠어."),line("주인공","나도. 잘 자.")]),
    branch("message-MID",[line("하은","서점과 저녁에 한 표. 길은 네가 보고."),line("하은","오늘 재밌었어."),line("주인공","나도. 지도 미리 볼게.")]),
    branch("message-HIGH",[line("하은","서점과 저녁. 오늘 못 한 얘기 더 하고 싶어."),line("하은","오늘의 너, 좋았어."),action("주인공은 한참 뒤 답한다."),line("주인공","나도 오늘의 네가 좋았어.")]),
    branch("message-VERY_HIGH-CONTACT",[line("하은","서점과 저녁. 오래 같이 있고 싶어서."),line("하은","내일 손 시려우면 네 탓이야."),line("주인공","그럼 내일도 잡아야겠네."),line("하은","응. 오늘의 너, 좋았어."),line("주인공","나도 오늘의 네가 좋았어.")]),
    branch("message-VERY_HIGH-NO_CONTACT",[line("하은","서점과 저녁. 오래 같이 있고 싶어서."),line("하은","내일은 무슨 옷 입고 올지도 궁금해."),line("주인공","사진은 미리 안 보낼게."),line("하은","응. 보고 싶어. 오늘의 너, 좋았어."),line("주인공","나도 오늘의 네가 좋았어.")]),
    branch("ending",[action("주인공은 대화창 위의 사진을 다시 본다."),narration("기억해 낸 것은 없었다."),narration("그런데 잊고 싶지 않은 하루가 생겼다."),line("윤서진","사진 찾았어요."),action("알림은 열지 않는다. 그 아래, 오늘 하은과 찍은 사진이 그대로 남아 있다."),action("암전 / DAY 6 END")])
  ])
]);

export function validateDay6V3PlayableScript1523(){
  const ids=DAY6_V3_PLAYABLE_SCRIPT_15_23.map(item=>item.id);
  const keys=DAY6_V3_PLAYABLE_SCRIPT_15_23.flatMap(item=>item.branches.map(branch=>branch.key));
  return ids.join(",")==="D6V3_S15,D6V3_S16,D6V3_S17,D6V3_S18,D6V3_S19,D6V3_S20,D6V3_S21,D6V3_S22,D6V3_S23"
    && ["music-title-only","current-photo-formal","card-tease","hand-keep-walking","name-first-date","message-VERY_HIGH-NO_CONTACT","ending"].every(key=>keys.includes(key))
    && DAY6_V3_PLAYABLE_SCRIPT_15_23.every(item=>item.steps.length>0||item.branches.length>0);
}
