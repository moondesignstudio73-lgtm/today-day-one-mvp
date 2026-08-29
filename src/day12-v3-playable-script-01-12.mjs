import {DAY12_V3_CHOICES} from "./day12-v3-campaign-data.mjs";

const freezeSteps=steps=>Object.freeze(steps.map(step=>Object.freeze(step)));
const line=(type,text,extra={})=>Object.freeze({type,text,...extra});
const narration=text=>line("narration",text);
const dialogue=(speaker,text)=>line("dialogue",text,{speaker});
const message=(sender,text)=>line("message",text,{sender});
const stage=text=>line("stageDirection",text);

const scenes=[
  {number:1,title:"질문을 넣은 가방",choiceNumber:1,steps:[stage("나의 방 / 오전"),narration("가방 안에는 물병과 작은 메모가 있다. 어젯밤 적어 둔 말은 사람마다 다르다."),narration("모르는 건 물어보자. 작은 일 하나만. 오늘은 여기까지 읽고 쉬자."),narration("주인공은 마지막 문장을 다시 보고 웃는다. 어제 쉬기로 했다면 오늘은 정말 모르는 것이 조금 더 많다."),narration("하은에게 출발한다는 말을 보낸다."),message("하은","다녀와. 점심도 먹고."),message("하은","질문은 가방에만 두고 오지 마."),narration("주인공은 메모를 꺼내 앞주머니로 옮긴다. 하은이 그걸 볼 수 없는데도 조금 들킨 기분이다.")],branches:{
    day12_promise_debrief:[message("하은","응, 듣고 싶어")],
    day12_admit_nerves:[message("하은","응. 다녀와서 쉬어도 돼")],
    day12_support_haeun_day:[narration("마지막 말에는 답이 조금 늦게 온다."),message("하은","고마워. 나도 오늘 미뤄 둔 일 하나 끝내려고."),narration("주인공은 자기 방문 시간이 적힌 메모를 본다. 오늘 하은도 자기 할 일이 있다.")]
  }},
  {number:2,title:"전에 한 번 열었던 문",steps:[stage("회사 건물 / 오전 열 시 전"),narration("민호가 로비에 서 있다. 이번에는 자기 이름을 말하려다가 멈춘다."),dialogue("민호","민호입니다. 아, 아시죠."),dialogue("주인공","네. 오늘도 맞으시네요."),narration("민호가 웃는다. 지난번보다 어깨가 조금 내려간다."),narration("방문증을 받고 엘리베이터에 탄다. 숫자가 올라가는 동안 민호는 일정 이야기를 한다."),dialogue("민호","오전에는 자료 조금 보고, 쉬고, 점심 먹고 끝입니다."),dialogue("주인공","점심까지가 일정이군요."),dialogue("민호","그건 제가 제일 확실하게 잡았습니다."),narration("엘리베이터 문이 열린다. 주인공은 무조건 익숙한 척 걸어가지 않고 민호가 가리킨 방향으로 간다.")]},
  {number:3,title:"서진의 두 번째 인사",steps:[narration("윤서진은 회의실 앞에서 종이 몇 장을 정리하고 있다. 주인공을 보자 손에 든 것을 내려놓는다."),dialogue("서진","오늘은 길 찾는 데 덜 힘드셨어요?"),dialogue("주인공","민호 씨가 길이었어요."),dialogue("민호","제가요?"),dialogue("서진","오늘은 안내 잘했다는 뜻 같아요."),narration("민호가 웃는다.")],branches:{
    priorPhoto:[narration("서진이 잠깐 주인공을 본다."),dialogue("서진","사진은 잘 받으셨죠?"),dialogue("주인공","네. 고마웠어요."),narration("그 사진의 행사 장면이 기억났다는 말은 하지 않는다.")],
    noPriorPhoto:[dialogue("서진","지난번 사진 얘기는 여기서 또 안 꺼낼게요."),dialogue("주인공","고마워요."),narration("그녀는 더 설득하지 않고 오늘 자료를 가리킨다.")],
    priorPersonalInterest:[narration("서진의 시선이 조금 더 오래 머문다."),dialogue("서진","회사 밖 얘기도 궁금하다고 하셨는데, 오늘은 회사부터네요."),dialogue("주인공","그러게요."),narration("서진은 웃고 종이를 든다."),dialogue("서진","일단 앉으세요.")]
  }},
  {number:4,title:"빈 의자가 아니라 오늘의 자리",choiceNumber:2,steps:[narration("회의실 의자는 여러 개다. 민호가 한 자리를 빼 두었다."),narration("주인공은 그 자리가 예전에 앉던 자리인지 묻고 싶다가 참는다. 민호가 물을 놓기 편한 쪽이라고 먼저 설명한다."),narration("팀장이 잠깐 들어온다."),dialogue("팀장","오늘도 적응 방문입니다. 답을 내고 가야 하는 날은 아니고요."),narration("주인공은 고개를 끄덕인다."),dialogue("팀장","중간에 그만 보고 싶으면 말씀하세요. 점심은 그거랑 상관없이 같이 드셔도 됩니다."),narration("팀장이 나가고 문이 닫힌다. 주인공은 종이를 앞으로 당긴다.")],branches:{
    day12_ask_scope_first:[narration("민호는 한 장짜리 화면 예시만 먼저 보여 준다.")],
    day12_read_then_ask:[narration("주인공이 읽을 동안 민호는 말을 멈춘다.")],
    day12_settle_before_reading:[narration("민호는 자료를 덮어 놓고 물을 마실 시간을 준다."),narration("그 짧은 침묵이 일을 못한다는 판정처럼 느껴지지 않기까지 조금 시간이 걸린다.")]
  }},
  {number:5,title:"한 장이 더 있다",steps:[narration("민호가 꺼낸 종이에는 서비스 예약을 바꾸는 화면이 있다. 이름과 번호는 실제 이용자의 것이 아니라 예시다."),dialogue("민호","변경 버튼을 누르고 다음 화면으로 가는 부분입니다."),narration("주인공은 작은 글씨를 읽는다. 날짜를 고르고, 확인을 누르고, 다음으로 간다."),narration("그 아래에는 비슷하게 생긴 화면이 하나 더 있다."),dialogue("주인공","이 두 개는 뭐가 달라요?"),narration("민호가 입을 열려는데 서진이 종이 한쪽을 본다."),dialogue("서진","민호 씨, 이거 어제 보낸 거 맞아요?"),narration("민호가 종이를 다시 가져간다."),dialogue("민호","네. 아, 잠깐만요."),narration("그는 노트북을 열고 파일 이름을 확인한다. 손이 조금 빨라진다."),dialogue("서진","천천히 봐요."),narration("주인공은 자기가 아직 질문 하나밖에 안 했는데 방 안의 속도가 바뀌었다는 걸 느낀다.")]},
  {number:6,title:"익숙한 척하기 쉬운 말",choiceNumber:3,steps:[narration("서진이 오늘 볼 화면을 다시 놓는다."),dialogue("서진","두 번째가 현재 검토 중인 쪽이에요. 먼저 건 예전 안이고요."),narration("주인공은 고개를 끄덕이지만 아직 어떤 차이인지 잘 모르겠다. 버튼 위치와 문장이 조금 다르다."),narration("민호가 설명을 시작한다."),dialogue("민호","여기서 완료했다고 생각하는 분들이 계셔서……"),dialogue("주인공","그럼 마지막 버튼을 더 크게 하면……"),narration("말이 먼저 나왔다."),narration("서진은 대답하지 않고 주인공을 본다. 민호도 설명하던 손을 멈춘다."),narration("주인공은 자기가 화면을 다 읽지 않았다는 걸 깨닫는다.")],branches:{
    day12_restart_full_read:[dialogue("서진","네. 여기부터 보시면 돼요."),narration("그녀는 틀렸다는 표시를 하지 않는다. 주인공은 말한 답을 지키려고 화면을 읽는 대신 정말 처음부터 읽는다.")],
    day12_ask_user_reason:[narration("민호가 고개를 끄덕인다."),dialogue("민호","이 화면에 ‘확인했습니다’가 크게 보여서요."),dialogue("주인공","그럼 확인은 했는데 변경은 아직인 거예요?"),narration("민호가 작게 “네”라고 답한다.")],
    day12_hold_early_opinion:[narration("서진이 종이를 손끝으로 누른다."),dialogue("서진","그 방법도 있을 수 있어요. 그런데 이 단계가 마지막은 아니어서요."),narration("주인공은 조금 민망해진다. 그 민망함을 빨리 없애려고 더 아는 말을 붙이지는 않는다.")]
  }},
  {number:7,title:"내가 누른 버튼",steps:[narration("서진이 노트북을 주인공 쪽으로 돌린다. 실제 고객 정보와 연결되지 않은 예시 화면이다."),dialogue("서진","한 번 해 보실래요? 예약 시간을 바꾼다고 생각하고."),narration("주인공은 화면을 누른다. 날짜를 바꾸고 확인한다. 큰 글씨가 뜬다."),line("note","확인했습니다."),narration("그는 손을 뗀다."),dialogue("민호","그다음에……"),narration("민호가 말을 멈춘다. 서진도 잠깐 조용하다."),narration("주인공이 두 사람을 본다."),dialogue("주인공","끝난 거 아니에요?"),narration("서진이 화면 아래를 가리킨다. 작은 버튼이 있다."),dialogue("서진","여기까지 눌러야 바뀌어요."),narration("주인공은 화면을 다시 본다."),dialogue("주인공","아. 저는 방금…… 끝났다고 들었어요."),narration("그 말 뒤에 세 사람이 잠깐 같은 화면을 본다. 큰 아이디어보다 작은 오해가 더 정확하게 보이는 순간이었다.")]},
  {number:8,title:"메모 뒤에 남은 문장",choiceNumber:4,steps:[narration("민호는 화면 아래 메모를 펼친다. 예전 안에서 남은 설명과 지금 설명이 섞여 있다."),dialogue("민호","제가 옮기면서 여기 문장을 안 바꿨네요."),narration("그는 종이를 한 장씩 정리한다."),dialogue("민호","어제 폴더도 이름 표시해 뒀다고 말씀드렸는데, 안쪽을 덜 봤습니다."),narration("주인공은 민호가 자기를 보지 않는다는 걸 느낀다."),dialogue("서진","오늘 찾았으니까 고치면 돼요."),narration("민호가 고개를 끄덕이지만 표정은 바로 풀리지 않는다."),dialogue("민호","설명도 제가 이상하게 했네요."),narration("주인공은 ‘괜찮아요’라고 말하려다가 멈춘다. 실제로 어떤 부분이 괜찮은지 아직 모르겠다.")],branches:{
    day12_trace_confusion_together:[narration("민호가 노트를 앞으로 당긴다."),dialogue("민호","처음부터 말씀해 주실 수 있어요?"),narration("주인공은 다시 화면을 본다. 이번에는 정답을 말하기보다 어디서 손을 뗐는지 설명한다.")],
    day12_name_next_use:[dialogue("민호","네. 제가 정리해 놓겠습니다."),narration("주인공은 혼자 다 책임지겠다는 말처럼 들려 덧붙인다."),dialogue("주인공","제가 한 행동도 적어 주세요. 그건 제가 말할 수 있으니까."),narration("민호가 고개를 든다.")],
    day12_offer_to_cover_minho:[narration("서진이 먼저 말한다."),dialogue("서진","그럴 필요는 없어요. 누가 이상해서 틀린 게 아니니까."),narration("민호도 고개를 젓는다."),dialogue("민호","제 쪽은 제가 말씀드릴게요. 괜찮습니다."),narration("주인공은 좋은 일을 해 주려다 민호가 할 말을 가져갈 뻔했다는 걸 안다.")]
  }},
  {number:9,title:"작은 일이 남는 자리",steps:[narration("서진은 주인공이 한 말을 메모한다."),dialogue("서진","‘확인했다’고 하니까 끝난 줄 알았다."),narration("그녀가 문장을 읽어 본다."),dialogue("서진","이건 그대로 적어 둘게요."),narration("주인공은 조금 놀란다."),dialogue("주인공","별말 아닌데요."),dialogue("서진","우리는 이 화면을 너무 많이 봐서 별말을 못 할 때가 있거든요."),narration("그녀는 주인공을 과거의 능력과 비교하지 않는다."),dialogue("서진","오늘 방금 그렇게 느끼셨잖아요. 그게 필요했어요."),narration("민호가 작은 종이를 앞으로 민다."),dialogue("민호","어디서 끝난 줄 알았는지 동그라미만 해 주실래요?"),narration("주인공은 펜을 든다. 처음부터 화면을 다시 설계하라는 부탁은 아니다. 자신이 실제로 멈춘 곳 하나를 가리키는 일이다."),narration("주인공은 동그라미를 그리다가 선이 삐뚤어져 한 번 더 긋는다."),dialogue("민호","알아볼 수 있습니다."),dialogue("주인공","이것도 잘하고 싶어서."),narration("민호가 웃는다. 주인공도 펜을 내려놓는다."),narration("서진은 그 종이를 다른 종이 아래로 넣지 않고 옆에 둔다."),dialogue("주인공","그럼 이걸 바꾸면 되는 건가요?"),dialogue("서진","어떻게 바꿀지는 저희가 더 봐야 해요. 다른 데서 또 헷갈릴 수도 있어서."),narration("주인공은 조금 아쉬운 표정이 된다."),dialogue("주인공","찾으면 끝나는 줄 알았어요."),dialogue("서진","저도 그랬으면 좋겠어요."),narration("그녀가 웃는다."),dialogue("서진","그래도 어디를 볼지는 알았죠."),narration("민호는 노트에 주인공이 멈춘 지점을 적는다. 주인공은 자신의 말이 곧바로 제품의 답이 되지 않아도 버려진 것이 아니라는 걸 본다."),narration("그는 자기 앞의 종이를 다시 본다. 고친 흔적보다, 처음 멈췄던 흔적이 오늘은 더 쓸모 있었다.")]},
  {number:10,title:"여기까지라는 말",choiceNumber:5,steps:[narration("시계가 움직인다. 서진이 잠깐 쉬자고 한다."),narration("주인공은 이제 조금 알 것 같아 더 보고 싶다. 처음에는 자료가 많아 부담스러웠는데, 한 군데를 알고 나니 다음 것도 보고 싶어진다.")],branches:{
    day12_stop_at_boundary:[narration("서진이 노트북을 덮는다.")],
    day12_one_question_then_rest:[narration("주인공이 아직 이해하지 못한 한 문장을 묻고 멈춘다.")],
    day12_ask_to_continue:[narration("서진이 시계를 본다."),dialogue("서진","잘되고 있을 때 끝내는 것도 연습이죠."),narration("주인공은 웃으려다 멈춘다."),dialogue("주인공","재밌어졌는데요."),narration("서진이 그 말을 듣고 조금 웃는다."),dialogue("서진","그건 다음에 또 오고 싶은 이유로 남겨 두세요."),narration("그녀는 더 잘하면 오늘 시간을 늘려 주겠다는 말을 하지 않는다.")]
  }},
  {number:11,title:"자판기 앞의 두 사람",steps:[stage("휴게 공간"),narration("민호가 음료를 고르다가 버튼을 잘못 누른다. 자신이 원한 것과 다른 캔이 나온다."),narration("그는 캔을 들고 한참 본다."),dialogue("주인공","확인하셨나요."),narration("민호가 웃음을 터뜨린다."),dialogue("민호","여기도 버튼을 고쳐야겠네요."),dialogue("주인공","이건 제 의견 아닙니다."),narration("민호가 웃으며 캔을 딴다. 서진은 조금 떨어진 곳에서 물을 마신다."),narration("민호가 목소리를 낮춘다."),dialogue("민호","오늘 좀 긴장했어요."),dialogue("주인공","저도요."),dialogue("민호","잘 모시고 싶어서. 지난번에 설명 길게 했다고 생각해서요."),narration("주인공은 방금 자기 얼굴을 다른 사람에게서 본 것 같다."),dialogue("주인공","오늘은 제가 많이 물었잖아요."),narration("민호가 고개를 끄덕인다."),dialogue("민호","네. 그건 편했어요.")]},
  {number:12,title:"점심을 고르는 질문",choiceNumber:6,steps:[narration("서진이 다가와 점심을 묻는다."),dialogue("서진","멀리 안 가고 건물 안에서 먹을까요?"),narration("민호는 메뉴를 두 가지 말한다. 주인공은 어느 쪽이 자신의 옛 단골인지 묻지 않는다.")],branches:{
    day12_lunch_warm_quick:[narration("서진은 부담 없는 식사를 고른다.")],
    day12_lunch_ask_current_habit:[narration("민호가 자기가 자주 먹는 메뉴를 너무 자세하게 설명한다."),dialogue("서진","민호 씨는 메뉴 고르는 데가 제일 길어요."),dialogue("민호","아까 일정은 확실하게 잡았다고 했는데."),dialogue("주인공","시간은 잡았고 메뉴가 남았네요."),narration("세 사람이 웃는다.")],
    day12_lunch_quiet_seat:[narration("사람이 덜 찬 안쪽 자리를 찾는다. 주인공이 피곤하다고 했다고 점심을 빼고 돌려보내지는 않는다.")]
  }}
];

const CHOICE_LABELS=new Map(DAY12_V3_CHOICES.slice(0,6).flatMap(choice=>choice.options.map(option=>[option.id,option.label])));

export const DAY12_V3_PLAYABLE_SCRIPT_01_12=Object.freeze(scenes.map(scene=>Object.freeze({
  ...scene,id:`D12V3_S${String(scene.number).padStart(2,"0")}`,
  steps:freezeSteps(scene.steps),
  branches:Object.freeze(Object.entries(scene.branches??{}).map(([key,steps])=>Object.freeze({key,label:CHOICE_LABELS.get(key)??key,steps:freezeSteps(steps)})))
})));

const flagsOf=state=>state?.storyFlags??{};

function branchKeysFor(flags,scene){
  const keys=[];
  if(scene.number===3){
    keys.push(flags.day12V3PriorSeojinPhoto?"priorPhoto":"noPriorPhoto");
    if(flags.day12V3PriorSeojinPersonalInterest)keys.push("priorPersonalInterest");
  }
  if(scene.choiceNumber){
    const choiceId=flags[`day12V3Choice${scene.choiceNumber}`];
    if(choiceId)keys.push(choiceId);
  }
  return keys;
}

export function getDay12V3PlayableScene01To12(state,sceneNumber){
  const scene=DAY12_V3_PLAYABLE_SCRIPT_01_12.find(item=>item.number===sceneNumber);
  if(!scene)throw new Error(`UNKNOWN_DAY12_V3_SCENE_${sceneNumber}`);
  const keys=branchKeysFor(flagsOf(state),scene);
  const selectedSteps=keys.flatMap(key=>scene.branches.find(branch=>branch.key===key)?.steps??[]);
  const choiceCue=scene.choiceNumber?[Object.freeze({type:"choiceCue",choiceNumber:scene.choiceNumber})]:[];
  return Object.freeze({...scene,selectedBranches:Object.freeze(keys),steps:Object.freeze([...scene.steps,...choiceCue,...selectedSteps])});
}

export function validateDay12V3PlayableScript01To12(){
  const expectedChoiceIds=DAY12_V3_CHOICES.slice(0,6).flatMap(choice=>choice.options.map(option=>option.id));
  const branchKeys=new Set(DAY12_V3_PLAYABLE_SCRIPT_01_12.flatMap(scene=>scene.branches.map(branch=>branch.key)));
  return DAY12_V3_PLAYABLE_SCRIPT_01_12.length===12&&DAY12_V3_PLAYABLE_SCRIPT_01_12.every((scene,index)=>scene.number===index+1&&scene.steps.length>0)&&expectedChoiceIds.every(id=>branchKeys.has(id));
}
