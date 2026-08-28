const line=(speaker,text)=>Object.freeze({type:"dialogue",speaker,text});
const action=(text)=>Object.freeze({type:"action",text});
const narration=(text)=>Object.freeze({type:"narration",text});
const branch=(choiceId,steps)=>Object.freeze({choiceId,steps:Object.freeze(steps)});
const scene=(number,steps,branches=[])=>Object.freeze({id:`D6V3_S${String(number).padStart(2,"0")}`,number,steps:Object.freeze(steps),branches:Object.freeze(branches)});

export const DAY6_V3_PLAYABLE_SCRIPT_01_07=Object.freeze([
  scene(1,[
    action("휴대폰이 울린다."),line("하은","오늘 날씨 좋아."),line("하은","몸 괜찮으면 잠깐 나갈래?"),
    action("잠시 뒤 말풍선 하나가 더 붙는다."),line("하은","데이트."),action("그리고 곧바로 또 하나."),line("하은","부담스러우면 산책."),
    action("주인공의 손가락이 ‘데이트’에서 멈춘다.")
  ],[
    branch("date-call-it-date",[line("하은","그 말 캡처함")]),
    branch("date-name-later",[line("하은","그럼 판정은 밤에")]),
    branch("date-admit-uncertainty",[action("잠시 뒤 답장이 온다."),line("하은","잘하려고 만나는 거 아니야")])
  ]),
  scene(2,[
    action("옷장에는 입어 본 기억이 없는 옷들이 걸려 있다. 주인공은 밝은 셔츠를 꺼냈다가, 휴대폰 속 과거 사진을 연다."),
    action("사진 속 자신은 검은 셔츠에 얇은 재킷을 입고 있다. 하은과 카페 앞에 서 있다."),
    narration("이 남자는 데이트할 때 이렇게 입었다."),action("옷걸이에 손이 간다.")
  ],[
    branch("outfit-past-black",[action("사진과 같은 높이로 소매를 두 번 접는다.")]),
    branch("outfit-current-bright",[action("지금 마음에 드는 밝은 셔츠를 꺼낸다.")]),
    branch("outfit-ask-haeun",[line("하은","밝은 거."),line("하은","아니 검은 것도 괜찮은데."),line("하은","내가 고르니까 더 어렵다. 밝은 거 한 표."),action("밝은 셔츠를 꺼낸다.")])
  ]),
  scene(3,[
    action("하은이 주인공을 발견하고 손을 든다. 셔츠를 보며 아주 잠깐 멈칫한다."),line("하은","그 셔츠."),line("주인공","이상해?"),line("하은","아니. 잘 어울려."),
    line("주인공","우리 여기 자주 왔어?"),line("하은","응. 창가 두 번째 자리."),line("주인공","그럼 거기 앉자."),action("대답이 반 박자 늦다."),line("하은","그래.")
  ],[
    branch("outfit-past-black",[line("하은","소매도 그렇게 접었네")]),
    branch("outfit-current-bright",[line("하은","오늘은 환하다")]),
    branch("outfit-ask-haeun",[line("하은","오늘은 환하다")])
  ]),
  scene(4,[
    action("직원이 메뉴판을 건넨다. 주인공은 보지 않고 하은에게 묻는다."),line("주인공","나는 뭐 마셨어?"),line("하은","아이스 아메리카노. 시럽 없이."),line("하은","다른 것도 봐."),action("메뉴판을 주인공 쪽으로 돌려 준다.")
  ],[
    branch("drink-past-americano",[action("첫 모금이 지나치게 쓰다. 주인공은 아무렇지 않은 척 삼킨다."),line("하은","맛없지?"),line("주인공","원래는 좋아했다며."),action("하은은 자기 컵을 만지다 손을 멈춘다.")]),
    branch("drink-current-choice",[line("하은","그거 맛있어?"),action("주인공은 곧 창가로 눈을 돌린다.")]),
    branch("drink-match-haeun",[line("하은","내 건 달아."),action("하은이 웃는다. 주인공은 곧 창가로 눈을 돌린다.")])
  ]),
  scene(5,[
    action("사진 속 자리의 손님이 막 일어난다."),line("주인공","우리가 앉던 자리, 저기 맞지?"),line("하은","맞아."),action("직원이 테이블을 닦는 동안, 주인공은 사진 속 의자 방향을 확인한다."),line("주인공","너는 맞은편."),line("하은","응. 늘 그랬어."),action("가방을 내려놓던 하은이 의자를 다시 옮긴다.")
  ]),
  scene(6,[
    line("주인공","여기 오면 무슨 얘기 했어?"),line("하은","회사 욕도 하고, 저녁 뭐 먹을지도 정하고."),line("주인공","내가 많이 웃었어?"),line("하은","가끔."),line("주인공","나는 또 뭘 했어?"),action("하은이 컵을 내려놓는다."),line("하은","오늘 질문 몇 개 준비했어?"),action("농담처럼 들려 웃으려다 멈춘다. 하은은 웃고 있지 않다.")
  ]),
  scene(7,[
    action("주인공은 휴대폰을 컵 옆에 세운다. 과거 사진과 같은 구도를 맞춘다."),line("주인공","사진 한 장 찍자."),action("하은은 카메라를 보다가 묻는다."),line("하은","이 사진처럼?")
  ],[
    branch("photo-compare-past",[action("하은은 웃는 표정을 만들지만 셔터가 눌리는 순간 시선이 옆으로 흐른다.")]),
    branch("photo-haeun-place",[action("하은은 아직 대답하지 못한다.")]),
    branch("photo-lower-camera",[line("하은","사진이 싫은 게 아니라……"),action("하은이 말을 멈춘다.")])
  ].map(item=>Object.freeze({...item,after:Object.freeze([
    action("그때 직원이 빈 컵을 치우러 온다."),line("직원","오랜만에 오셨네요."),action("주인공은 반가워하며 몸을 돌린다."),line("주인공","제가 보통 여기서 뭘 했는지 기억하세요?"),action("하은이 가방을 든다."),line("하은","나 먼저 나가 있을게."),action("주인공의 휴대폰 화면에는 아직 옛 사진이 켜져 있다.")
  ])})))
]);

export function validateDay6V3PlayableScript0107(){
  const sceneIds=DAY6_V3_PLAYABLE_SCRIPT_01_07.map(item=>item.id);
  const branchIds=DAY6_V3_PLAYABLE_SCRIPT_01_07.flatMap(item=>item.branches.map(item=>item.choiceId));
  return sceneIds.join(",")==="D6V3_S01,D6V3_S02,D6V3_S03,D6V3_S04,D6V3_S05,D6V3_S06,D6V3_S07"
    && branchIds.length===15
    && new Set(branchIds).size===12
    && DAY6_V3_PLAYABLE_SCRIPT_01_07.every(item=>item.steps.length>0);
}

const s09Common=Object.freeze([
  line("하은","나도 그 자리 비니까 좋았어. 우리 자리네, 하고."),action("주인공이 고개를 든다."),
  line("하은","근데 앉고 나서는…… 계속 내가 시키는 것 같고."),action("가방끈을 쥔 손이 풀렸다가 다시 쥐어진다."),
  line("하은","나는 그 사람 흉내 내는 너랑 데이트하고 싶은 게 아니야."),action("말이 나오자 하은 자신도 놀란 듯 눈을 내린다."),
  line("하은","그 사람이라니. 너한테."),line("주인공","무슨 말인지 알아."),action("지나가는 사람 때문에 둘 사이가 좁아진다. 사람이 지나간 뒤에도 바로 말이 이어지지 않는다.")
]);
const s09Low=Object.freeze([
  line("하은","나도 겁났나 봐. 다 달라지면……."),action("하은은 끝을 잇지 못한다."),line("주인공","지금 다 말 안 해도 돼."),action("하은이 고개를 끄덕인다. 한참 뒤, 다시 주인공을 본다.")
]);
const s09MidHigh=Object.freeze([
  line("하은","너는 나 안 보고 사진만 보니까. 나 오늘 좀 서운했어."),line("주인공","미안."),line("하은","근데 나도 자꾸 옛날 얘기 했잖아. 그러면 덜 달라질 것 같아서."),
  action("하은이 숨을 고른다."),line("하은","좋아하는 게 다 달라지면, 나도……."),narration("그 뒤의 말은 묻지 않아도 알 것 같았다.")
]);
const s09Close=Object.freeze([
  line("하은","예전에 네가 좋아했던 거 말고, 지금 네가 좋아하는 것도 알고 싶어."),action("주인공은 주머니에 휴대폰을 넣는다. 이번에는 화면을 안쪽으로 돌리지 않아도 된다.")
]);

export const DAY6_V3_PLAYABLE_SCRIPT_08_14=Object.freeze([
  scene(8,[
    action("하은은 간판을 올려다보고 있다. 주인공이 나오자 가방끈을 고쳐 잡는다."),line("주인공","아까 사진 때문에 그래?"),line("하은","사진이…… 아니."),
    action("말을 고르던 하은이 고개를 젓는다."),line("하은","나도 네 기억 시험하려고 나온 거 아니야."),line("주인공","네가 시험한다고 생각한 적 없어."),line("하은","그럼 왜 자꾸."),
    action("주인공은 화면이 꺼진 휴대폰을 내려다본다."),line("주인공","그렇게 하면 네가 알던 사람에 좀 가까워질까 봐."),action("하은이 무언가 말하려다가 입술을 다문다. 주인공은 재촉하지 않는다.")
  ]),
  scene(9,[],[
    branch("drink-past-americano",[line("하은","아까 커피 마시는 거 보는데 이상했어."),line("주인공","뭐가."),line("하은","반가워야 할 것 같았거든. 예전이랑 똑같이 시켰으니까."),action("가게 안에서 컵을 내려놓는 소리가 난다."),line("하은","근데 하나도 안 반가웠어."),line("주인공","왜."),line("하은","맛없는데 참고 마시잖아."),action("주인공은 대답 대신 입안에 남은 쓴맛을 삼킨다.")]),
    branch("drink-current-choice",[line("하은","아까 네 음료 보고, 무슨 맛일까 궁금했거든."),line("주인공","한 모금 줄걸."),line("하은","응. 그런 얘기를 할 줄 알았어."),action("하은이 카페 창가를 돌아본다."),line("하은","근데 계속 자리만 보잖아. 내가 어디 앉았는지, 너는 어떻게 앉았는지.")]),
    branch("drink-match-haeun",[line("하은","아까 네 음료 보고, 무슨 맛일까 궁금했거든."),line("주인공","한 모금 줄걸."),line("하은","응. 그런 얘기를 할 줄 알았어."),action("하은이 카페 창가를 돌아본다."),line("하은","근데 계속 자리만 보잖아. 내가 어디 앉았는지, 너는 어떻게 앉았는지.")]),
    branch("relationship-LOW",[...s09Common,...s09Low,...s09Close]),
    branch("relationship-MID",[...s09Common,...s09MidHigh,...s09Close]),
    branch("relationship-HIGH",[...s09Common,...s09MidHigh,...s09Close]),
    branch("relationship-VERY_HIGH",[...s09Common,...s09MidHigh,...s09Close])
  ]),
  scene(10,[],[
    branch("repair-see-haeun",[action("하은이 소매 끝을 내려다본다."),line("하은","나 오늘 옷도 세 번 갈아입었어."),line("주인공","그 말을 이제 하네."),line("하은","네가 이제 보잖아."),action("주인공이 처음으로 하은의 옷을 제대로 본다. 하은은 어색해서 가방을 앞으로 당긴다.")]),
    branch("repair-share-fear",[line("하은","아까는 몰랐어. 네가 그렇게까지 겁나는 줄."),line("주인공","나도 네가 그런 줄 몰랐어."),action("둘은 잠시 말을 쉬었다. 하은이 먼저 주인공 쪽으로 몸을 돌린다.")]),
    branch("repair-restart-now",[line("하은","어떻게?"),action("대답이 바로 나오지 않는다."),line("주인공","그건 아직 생각 못 했어."),line("하은","그럴 줄 알았어."),action("이번에는 아주 조금 웃는다.")])
  ].map(item=>Object.freeze({...item,after:Object.freeze([
    line("하은","우리 오늘 망한 거야?"),line("주인공","아직 점심도 안 먹었는데 결론이 빨라."),action("하은이 결국 웃음을 흘린다."),line("하은","그 말은 처음 듣는다."),line("주인공","잘됐네. 벌써 하나 생겼다.")
  ])}))),
  scene(11,[
    action("하은은 휴대폰의 메모를 보여 준다."),line("하은","카페 모퉁이 → 연희 베이커리 → 기억의 공원"),line("하은","예전에 이렇게 다녔어. 빵 사서 공원 가고."),line("주인공","이거 그만 따라가자."),line("하은","그럼 어디로?"),line("주인공","배고픈 사람이 정하는 곳."),
    action("하은이 메모를 닫는다. 삭제하지는 않는다. 골목을 걷다가 김밥마을 간판 앞에서 둘 다 속도를 줄인다. 문틈으로 떡볶이 냄새가 난다.")
  ]),
  scene(12,[],[
    branch("lunch-spicy",[action("첫입은 괜찮았다. 두 번째를 집다가 주인공이 젓가락을 내려놓는다."),line("하은","매워?"),line("주인공","아직 판단 중이야."),action("하은이 한입 먹는다. 둘이 동시에 물병에 손을 뻗는다."),line("하은","판단 끝."),action("컵에 물을 따르는 동안 주인공의 귀가 빨개진다."),line("주인공","먹기 전에는 자신 있었는데."),line("하은","응. 표정은 전국 우승이었어.")]),
    branch("lunch-share-bites",[action("하은은 김밥, 주인공은 라면을 주문한다. 하은이 김밥 한 조각을 앞접시에 옮기다가 속을 떨어뜨린다."),line("하은","원래는 이만큼 꽉 차 있어."),line("주인공","설명 안 해도 돼. 현장에서 봤어."),action("하은이 떨어진 속까지 야무지게 올려 준다. 주인공이 한입에 넣으려다 멈추자, 하은도 접시를 보고 웃는다.")]),
    branch("lunch-carrot-gimbap",[action("주인공이 김밥을 집자 하은이 무심코 말한다."),line("하은","너 그거 싫어했는데. 당근."),action("둘 다 멈춘다."),line("하은","……아."),action("주인공이 먼저 웃는다."),line("주인공","또 예전 나 나왔다."),line("하은","미안."),line("주인공","먹어 보고 판단하지 뭐."),action("씹는 데 시간이 좀 걸린다."),line("하은","어때?"),line("주인공","좋아한다고 하기엔…… 내가 지금 열심히 먹고 있지?"),action("하은이 웃다가 자기 김밥의 당근도 본다."),line("하은","나도 사실 이 부분은 그냥 먹어.")])
  ].map(item=>Object.freeze({...item,after:Object.freeze([
    action("접시 가장자리에 김밥 한 조각이 풀어져 있다. 주인공이 메뉴 사진과 번갈아 본다."),line("사장","한입에 넣어야 안 터지지."),line("주인공","사진에서는 잘 서 있길래요."),line("사장","사진은 연출, 맛은 실전."),action("하은이 웃음을 참느라 물컵 뒤로 얼굴을 숨긴다. 주인공은 마지막 조각을 접시째 받쳐 먹는다. 하은이 말없이 휴지를 한 장 밀어 준다.")
  ])}))),
  scene(13,[
    action("가게를 나온다."),line("하은","이제 어디 가고 싶어?"),line("주인공","네가 안 가 본 데."),line("하은","내가 안 가 본 데를 내가 어떻게 알아."),action("주인공이 동전을 꺼낸다."),line("주인공","앞이면 네가 궁금한 곳. 뒤면 내가 지도에서 고르는 곳."),action("동전이 벤치 아래로 굴러간다. 둘은 몸을 낮추다 눈이 마주친다."),line("하은","옆면으로 섰으면 집에 갈 뻔했네."),line("주인공","그 규칙 지금 만든 거지."),action("하은이 동전을 주워 내민다."),line("하은","내가 구했으니까 네가 골라."),action("주인공의 지도 화면에 ‘오후의 레코드’가 보인다."),line("주인공","이름이 마음에 들어."),line("하은","연희동이네. 거기 있는 건 봤는데 들어가 보진 않았어."),
    action("둘은 동수역으로 향한다. 지하철에서 하은은 베이커리 메모 대신 레코드숍 위치를 연다. 연희역을 나와 하은이 자신 있게 골목으로 들어선다. 잠시 뒤 같은 간판이 또 보인다."),line("주인공","여기 방금 지나가지 않았어?"),line("하은","간판이 비슷해서…… 응. 지나갔네."),action("주인공이 웃음을 참자 하은이 휴대폰을 넘긴다."),line("하은","현재의 나는 길치인가 봐."),line("주인공","책임을 너무 멀리 미루는데."),action("이번에는 둘이 화면을 함께 본다. 길을 되짚는 동안 하은이 자꾸 뒤를 확인한다. 주인공은 방향 대신 그녀가 웃는 얼굴을 한 번 더 본다.")
  ]),
  scene(14,[
    action("문을 열자 노래가 대화보다 먼저 들린다. 하은은 진열된 앨범을 둘러본다."),line("하은","여기는 나도 설명 못 해."),line("주인공","좋네."),line("하은","그렇게 좋아?"),line("주인공","응. 나만 처음인 게 아니잖아."),action("하은이 그를 보다가 가까운 앨범 하나를 꺼낸다."),line("하은","그럼 나도 아무거나 물어봐도 되겠다."),line("주인공","대답은 못 할 수도 있는데."),line("하은","나도 그랬어, 아까."),action("말끝에 웃음이 묻어난다. 주인공도 따라 웃는다.")
  ])
]);

export function validateDay6V3PlayableScript0814(){
  const ids=DAY6_V3_PLAYABLE_SCRIPT_08_14.map(item=>item.id);
  const branches=DAY6_V3_PLAYABLE_SCRIPT_08_14.flatMap(item=>item.branches);
  const relationshipBranches=branches.filter(item=>item.choiceId.startsWith("relationship-"));
  return ids.join(",")==="D6V3_S08,D6V3_S09,D6V3_S10,D6V3_S11,D6V3_S12,D6V3_S13,D6V3_S14"
    && relationshipBranches.length===4
    && branches.filter(item=>item.choiceId.startsWith("repair-")).length===3
    && branches.filter(item=>item.choiceId.startsWith("lunch-")).length===3
    && DAY6_V3_PLAYABLE_SCRIPT_08_14.every(item=>item.steps.length>0||item.branches.length>0);
}
