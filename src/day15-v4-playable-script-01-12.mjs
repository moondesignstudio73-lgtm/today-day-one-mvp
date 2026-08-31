import {DAY15_V4_CHOICES} from "./day15-v4-campaign-data.mjs";

const f=Object.freeze,freezeSteps=steps=>f(steps.map(step=>f(step)));
const line=(type,text,extra={})=>f({type,text,...extra});
const n=text=>line("narration",text),d=(speaker,text)=>line("dialogue",text,{speaker}),m=(sender,text)=>line("message",text,{sender}),stage=text=>line("stageDirection",text);

const scenes=[
{number:1,title:"안내보다 먼저 보이는 이름",choiceNumber:1,routeBranches:{
 invited:[stage("나의 방 / 아침"),n("하은에게서 전시 안내가 온다. 주인공은 그림보다 아래의 시간을 먼저 보고, 그다음 시우라는 이름을 읽는다."),m("하은","두 시에 입구에서 볼까? 시우 선배는 잠깐만 설명해 줄 수 있대."),m("주인공","너는 몇 시에 가?"),m("하은","조금 먼저. 입구에서 기다릴게."),n("설명은 짧고 둘이 볼 시간은 길다. 그런데 머릿속에는 짧게 온다는 사람의 모습부터 생긴다.")],
 notInvited:[stage("나의 방 / 아침"),m("하은","나 오늘 두 시쯤 가 보려고. 다녀와서 얘기할게."),n("함께 오라는 말은 없다. 주인공은 ‘나도 그 근처 갈까’라고 쓰다가 지운다."),n("어제 그녀가 혼자 있고 싶었다면 오늘은 전시를 보고 싶을 수도 있다. 두 사실을 자기 몫의 시간표로 바꾸지 않는다.")]},branches:{
 day15_v4_invitation_attend:[m("주인공","나도 보고 싶어. 두 시에 갈게."),m("하은","전시가 아니라 면접 오는 표정으로 나오진 마."),n("웃는 얼굴 이모티콘 뒤에도 시우의 이름은 남아 있다.")],
 day15_v4_invitation_own_time:[m("주인공","오늘은 네 시간으로 보내. 나는 다른 일 좀 할게."),m("하은","응. 끝나고 연락할게."),n("주인공은 자기 오후에 할 일을 한 줄 적는다.")],
 day15_v4_invitation_admit_tension:[m("주인공","선배도 온다고 하니까 조금 긴장되네."),m("하은","어떤 사람이랑 일 얘기하는지 보여 주고 싶긴 했어. 너를 비교하려고 부른 건 아니야."),m("하은","지금 네가 뭘 걱정하는지는 나중에 얘기하자. 오늘 내 일정은 그대로 갈게."),n("긴장을 말했다고 그녀의 일정이 바뀌는 것은 아니다.")],
 day15_v4_invitation_no_invite:[m("주인공","재밌게 보고 와. 무슨 전시인지 궁금하네."),m("하은","응. 다녀와서 얘기할게."),n("초대가 없는 아침에 우연을 가장해 합류하지 않는다.")] }},
{number:2,title:"괜히 신경 쓰이는 소매",choiceNumber:2,steps:[stage("옷장 앞"),n("주인공은 셔츠 소매를 접었다가 펴고, 거울 속 모습이 과하다 싶어 첫 단추를 푼다."),d("주인공","전시 보러 가는데."),n("시우의 옷도 목소리도 모른다. 모르는 사람에게 지지 않는 옷을 고르기는 어렵다.")],branches:{
 day15_v4_outfit_comfort:[n("팔을 들어 본다. 어깨가 덜 당기는 편한 옷을 입는다.")],
 day15_v4_outfit_for_haeun:[n("하은에게 보여 주고 싶은 옷을 거울에 대고 한번 웃어 본다. 웃음이 더 어색해 얼굴을 풀고, 자기 몸이 편한 쪽으로 단추를 고친다.")],
 day15_v4_outfit_admit_self_conscious:[m("주인공","옷을 벌써 두 번 바꿨어."),m("하은","나는 아직 한 번. 내가 졌네."),m("주인공","이걸로 이겨도 돼?"),m("하은","옷장한테는 진 것 같은데."),n("그는 웃고 가장 편한 쪽을 입는다.")]}},
{number:3,title:"조금 먼저 도착한 사람들",routeBranches:{
 attend:[stage("한강 갤러리 입구"),n("하은이 한 남자와 나란히 서서 안내 책자를 본다. 주인공이 가까이 오자 하은이 먼저 손을 든다."),d("하은","여기."),d("시우","시우입니다. 하은 씨에게 말씀 들었습니다."),d("주인공","어떤 말씀인지 긴장되네요."),d("하은","전시 같이 보고 싶다는 말."),d("시우","아직 그 정도만 들었습니다. 제가 더 들어야 했나요?"),d("주인공","아니요. 그 정도가 좋네요."),n("시우는 기억을 묻지 않는다. 하은은 자연스럽게 주인공 옆으로 오고, 누구를 선택했다는 표시도 아닌 작은 움직임에 긴장이 조금 풀린다.")],
 own:[stage("카페 모퉁이 또는 나의 방"),n("주인공은 오늘 읽으려던 것을 펴 놓고 전시 안내를 다시 열까 망설인다."),m("주인공","도착했어?"),m("하은","응. 이제 들어가."),m("주인공","잘 보고 와."),n("시우의 얼굴을 찾아보려던 손을 내리고 자기 앞의 종이를 본다. 아직 한 줄도 읽지 않았다.")]}},
{number:4,title:"아는 말이 빠르게 오갈 때",conditional:"attend",choiceNumber:3,steps:[stage("한강 갤러리 첫 방"),n("시우가 작품과 맞은편 빈 벽을 번갈아 가리킨다."),d("시우","작품 하나보다 여기까지 같이 보시면 좋을 것 같아요."),d("하은","여기 비워 놓은 것도 처음부터 정한 거예요?"),d("시우","처음부터는 아니고요. 그쪽에 하나 더 있던 걸 뺐다고 들었어요."),n("‘간격’과 ‘시선’이라는 말이 빠르게 오간다. 하은이 고개를 끄덕이는 속도도 빨라 보인다.")],branches:{
 day15_v4_gallery_ask:[d("주인공","빈 곳도 같이 보라는 게 무슨 뜻이에요?"),d("시우","제가 너무 먼저 설명했네요. 여기서 보면 저 그림만 보이는데, 한 발 뒤로 오면 방이 같이 보이죠."),n("주인공은 한 발 뒤로 가 시야가 넓어지는 것을 확인한다."),d("주인공","그럼 지금은 그림이 작은 게 아니라 방이 큰 거네요."),d("시우","그렇게 보셔도 되죠.")],
 day15_v4_gallery_observe:[d("주인공","저는 먼저 조금 보고 물어볼게요."),n("시우는 설명을 멈춘다. 주인공은 자기 속도로 한쪽 끝까지 눈을 옮긴다.")],
 day15_v4_gallery_pretend:[n("알아들은 것처럼 고개를 끄덕인다. 대화가 다음으로 넘어가고 질문할 틈은 생기지 않는다. 고개만 한 번 더 끄덕이게 된다.")]}},
{number:5,title:"왼쪽에 있는 오른쪽",conditional:"attend",steps:[n("시우가 다른 작품 앞에서 말을 잇는다."),d("시우","이번에는 오른쪽을 보시면—"),n("하은과 주인공이 반대쪽을 보지만 작은 안내 표지만 있다."),d("시우","아니, 제가 보고 있는 쪽에서 오른쪽이 아니라."),d("하은","선배, 아까부터 오른쪽이 계속 왼쪽이에요."),d("시우","설명할 때만 이러네요."),d("하은","지난번에도 그러셨어요."),d("시우","그럼 오늘만 그런 건 아닌 걸로."),n("주인공도 웃지만 하은의 ‘지난번’이 늦게 남는다. 둘만 아는 대단하지 않은 시간이어서 더 구체적이다."),d("하은","왜?"),d("주인공","아니. 나도 왼쪽 보고 있었어."),n("거짓은 아니지만 지금 마음의 전부도 아니다.")]},
{number:6,title:"그림 앞에서 할 수 있는 말",choiceNumbers:f([3,4,5]),routeBranches:{
 attend:[stage("한강 갤러리"),n("넓은 바탕 한쪽의 가느다란 선은 멀리서는 반듯하지만 가까이 보면 조금씩 흔들린다."),d("하은","이게 좋아?"),d("주인공","아직 좋은지는 모르겠는데. 계속 보게 돼."),d("하은","어디가?"),n("주인공은 그림 가까이 손을 댈 필요가 없어 가리키던 손을 내린다."),d("주인공","이 선. 멀리서 보면 똑바른데."),d("하은","그러네. 나도 처음엔 몰랐어."),n("시우가 돌아오는지 확인하지 않고 작품을 다시 본다.")],
 own:[stage("카페 모퉁이 또는 나의 방"),n("종이에 작은 표시를 했지만 방금 읽은 문장이 무슨 뜻인지 잘 모르겠다. 하은에게 물으면 친절하게 답할 수도 있지만 지금 그녀는 다른 것을 보고 있다.")]},branches:{
 day15_v4_own_reread:[n("한 번 더 소리 내거나 입술만 움직여 읽는다. 아까 지나친 단어에 눈이 멈춘다. 전부 알지는 못해도 어느 부분이 안 읽히는지는 알게 된다."),d("주인공","아. 여기서 놓쳤네.")],
 day15_v4_own_skip:[n("다음 문장에는 지금 이해할 수 있는 내용이 있다. 책갈피 대신 손가락을 끼우고 앞뒤를 번갈아 보며 조금 우스운 자세가 된다.")],
 day15_v4_own_stop:[n("읽던 것을 덮자 손이 다시 휴대폰으로 간다. 읽기를 멈춘 일을 하은의 답을 기다리는 일로 바꾸려던 손을 멈추고 물을 마신다.")],
 day15_v4_own_question:[n("‘무슨 말이지?’ 대신 이해한 부분과 안 된 부분을 나눠 한 문장으로 적는다."),d("주인공","이 정도면 나중에 물어볼 수 있겠다."),n("지금 바로 누군가를 붙잡지 않아도 된다.")],
 day15_v4_own_write:[n("틀릴 수도 있는 말을 적고 지우지 않는다. 혼자 쓰는 종이에서는 조금 틀려도 된다.")],
 day15_v4_own_rest:[n("기대앉아 읽고 쉬는 일에도 잘한 표시를 붙이려던 마음을 놓는다. 하은이 좋은 것을 보는 시간과 자기 등이 쉬는 시간은 함께 성립한다.")],
 day15_v4_own_continue:[n("아까보다 적은 양만 더 읽기로 한다. 끝내고 싶은 마음이 몸보다 앞서 가지 않게 한다.")],
 day15_v4_own_get_air:[n("카페 밖이나 집 근처에 잠깐 선다. 전시장을 찾아가지 않고 따로 보내기로 한 시간을 우연한 만남으로 바꾸지 않는다.")],
 day15_v4_own_eat:[n("종이를 정리하고 먹을 것을 찾는다. 카페에서 두 걸음 가다 종이를 두고 온 것을 깨닫고 돌아온다."),d("주인공","제일 열심히 본 걸 놓고 가네."),n("혼자 웃고 오늘 읽은 한 줄을 자기 공간에 남긴다.")]}},
{number:7,title:"답을 빼앗는 질문",conditional:"attend",choiceNumber:4,branches:{
 day15_v4_view_ask_preference:[d("주인공","너는 어떤 게 제일 마음에 들어?"),d("하은","저거. 아직 왜 그런지는 모르겠어."),d("주인공","나도 가서 봐야겠다."),d("하은","좋다고 하라는 뜻은 아니야."),n("주인공은 웃고 고개를 끄덕인다.")],
 day15_v4_view_share_perception:[d("주인공","이거는 나랑 조금 더 보자."),n("하은은 옆에 남는다. 주인공은 선의 흐려지는 부분을, 하은은 바탕색을 말한다. 같은 그림에서 다른 곳을 본다.")],
 day15_v4_view_compare_with_siwoo:[d("주인공","선배 설명 듣는 게 더 좋지?"),d("하은","지금 내가 네 옆에 있는데?"),d("주인공","그냥 물어본 거야."),d("하은","그냥 묻는 말처럼 안 들렸어."),n("하은은 더 설명하지 않는다. 주인공이 먼저 고개를 든다."),d("주인공","내가 듣고 싶은 답이 있었나 봐."),d("하은","그럼 질문부터 다시 해.")]}},
{number:8,title:"능숙한 사람의 다른 모습",conditional:"attend",steps:[n("시우는 다른 사람에게 인사한 뒤 휴대폰을 확인하고 주머니에 넣는다. 주인공은 그가 자연스럽게 몸을 돌려 말하는 모습까지 본다."),d("시우","저는 조금 있다가 먼저 가 봐야 합니다."),d("하은","설명 감사합니다. 저희는 더 보고 갈게요."),d("주인공","이런 전시를 자주 보세요?"),d("시우","일 때문에도 보고, 보고 싶어서도 봅니다. 일을 핑계로 보면 좀 덜 미안하고요."),d("하은","누구한테요?"),d("시우","안 읽은 자료한테요."),n("하은과 주인공이 함께 웃는다. 시우가 모든 시간을 반듯하게 쓰지 않는다고 해서 못난 사람이어야 할 이유는 없다."),d("시우","천천히 보세요. 하은 씨, 나중에 어떤 게 남았는지 궁금하네요."),n("문이 닫힌 뒤 주인공은 승부가 시작된 적도 없었다는 것을 알아차린다.")]},
{number:9,title:"하은은 돌아간다",conditional:"attend",choiceNumber:5,steps:[n("하은은 첫 방 쪽으로 돌아간다."),d("주인공","거기 다시 가게?"),d("하은","응. 아까 말 듣느라 그림을 잘 못 봤어."),d("주인공","설명 들었는데?"),d("하은","그래서. 선배가 가리키는 데만 봤잖아."),n("하은은 아까보다 멀리 서서 자기 감상을 이어 간다. 주인공은 누구의 말을 듣는지보다 들은 다음 어디에 멈추는지를 보기 시작한다.")],branches:{
 day15_v4_rest_separate:[d("주인공","난 옆방을 조금 더 보고 올게."),d("하은","좋아. 나 여기 조금만 더 볼게."),n("뒤를 돌아봐도 하은은 벽을 본다. 돌아보지 않았다는 사실을 덜 좋아한다는 대답으로 만들지 않는다.")],
 day15_v4_rest_together:[d("주인공","네가 보는 게 궁금해. 같이 있을래."),d("하은","어제는 빈 데가 싫었는데, 오늘은 여기가 좋아."),n("주인공은 왜 다른지 서둘러 설명해 달라 하지 않고 옆에 선다.")],
 day15_v4_rest_leave:[d("주인공","이제 우리끼리 다른 데 가면 안 돼?"),d("하은","이것까지는 보고 싶어."),d("주인공","얼마나?"),d("하은","시간 재면서 보고 싶진 않은데."),n("그는 미안하다고 하고 기다리거나 먼저 쉬겠다고 말할 수 있지만 그녀의 걸음을 출구로 돌리지는 못한다.")]}},
{number:10,title:"밖에 먼저 나온 사람",conditional:"attend",routeBranches:{
 separate:[stage("갤러리 출구 의자"),n("주인공은 처음에는 하은이 언제 나오는지 보다가 꺼진 휴대폰 화면의 굳은 자기 얼굴을 본다. 다리가 피곤한 것도 사실이라 등을 기댄다."),d("하은","많이 피곤했어?"),d("주인공","응. 근데 그것만은 아니었어."),d("하은","앉아도 되지?"),d("주인공","응."),n("둘은 물을 마시며 잠깐 앞만 본다. ‘이제 다 봤어?’라고 묻지 않는다.")],
 leave:[stage("갤러리 출구 의자"),n("주인공은 먼저 나가자는 말을 거두고 하은이 보고 싶은 만큼 보게 둔다. 미안하다고 한 뒤 출구 의자에서 쉬며 자기 조급함과 다리의 피로를 구분해 본다."),d("하은","많이 피곤했어?"),d("주인공","응. 근데 그것만은 아니었어."),d("하은","앉아도 되지?"),d("주인공","응."),n("둘은 물을 마시며 잠깐 앞만 본다. 주인공은 기다린 시간을 하은에게 갚아야 할 빚으로 만들지 않는다.")],
 together:[n("둘은 마지막 작품을 보고 출구로 나온다. 하은은 작은 안내를 접으려다 다시 편다."),d("하은","저 선이 계속 생각나."),d("주인공","내가 본 거?"),d("하은","응. 네가 말해서 다시 보였어."),d("주인공","그건 좀 좋다."),d("하은","내가 네 거 좋아해서?"),d("주인공","내가 본 게 네 눈에도 들어가서."),n("하은은 안내를 가방에 넣고 그 말을 조금 오래 듣는다.")]}},
{number:11,title:"카페를 고르는 두 사람",conditional:"attend",choiceNumber:6,steps:[stage("리버뷰 카페"),n("하은은 창가를 보다가 주인공을 먼저 본다."),d("하은","너는 어디가 편해?")],branches:{
 day15_v4_cafe_inner:[d("주인공","조용한 안쪽이 좋겠어."),n("하은이 먼저 의자를 당긴다. 주인공은 가방을 내리고 어깨를 움직여 본다.")],
 day15_v4_cafe_window:[d("주인공","창가. 오늘은 밖도 좀 보고 싶어."),d("하은","커튼 그림자 얼굴에 나온다."),n("주인공이 비키자 그림자가 하은의 이마로 간다."),d("주인공","너한테 갔는데."),d("하은","돌려줄게."),n("의자를 조금 옮긴 뒤 둘이 웃고 자리를 잡는다.")],
 day15_v4_cafe_go_home:[d("주인공","난 오늘은 먼저 쉬러 가야 할 것 같아."),d("하은","알았어. 오늘 얘기는 나중에 해도 돼."),d("주인공","피하려는 건 아니야."),d("하은","그러면 나중에 네가 먼저 꺼내 줘."),n("카페에 앉지 않고 미뤄 둔 대화가 있는 채 각자의 방향으로 간다.")]}},
{number:12,title:"하나만 말해 봐",conditional:"conversation",choiceNumber:7,steps:[n("음료가 나오고 주인공은 빨대가 필요 없는 뚜껑 앞에서 멈춘다."),d("하은","오늘 다른 데 많이 가 있네."),d("주인공","응. 머리가."),d("하은","어디?"),d("주인공","말이 많아. 한꺼번에."),d("하은","그럼 하나만."),n("주인공은 컵을 놓고 하은의 얼굴을 본다.")],branches:{
 day15_v4_conflict_jealousy:[d("주인공","조금 질투났어."),d("하은","어느 순간에?"),d("주인공","네가 웃을 때."),d("하은","방향 틀렸다고?"),n("하은은 웃으려다 주인공의 얼굴을 보고 멈춘다."),d("하은","그게 네가 모르는 얘기라서?"),d("주인공","응. 나 없어도 네가 그렇게 웃는다는 걸 알아. 근데 눈앞에서 보니까 조금…."),n("하은은 말을 대신 완성하지 않고 기다린다.")],
 day15_v4_conflict_insecurity:[d("주인공","나는 요즘 서툰데, 그 사람은 너무 편해 보여서."),d("주인공","나는 문 열고 들어오는 것도 연습하는 기분인데. 그 사람은 어디서든 자기 자리 같더라."),d("하은","나도 일 얘기할 때는 네 앞에 있을 때랑 좀 다르지."),d("주인공","응. 그게 좋기도 했어."),d("하은","좋았는데 싫었어?"),d("주인공","내가 없어도 잘하는 게 좋고, 내가 있을 자리가 없는 것 같아서 싫었어."),d("하은","내가 잘하는 데 네가 꼭 필요해야, 네 자리가 생기는 건 아니잖아.")],
 day15_v4_conflict_control:[d("주인공","다음에는 그 선배랑 둘이 안 만났으면 좋겠어."),n("하은은 한동안 대답하지 않는다."),d("하은","내가 뭘 했는데?"),d("주인공","뭘 했다는 게 아니라. 신경 쓰이니까."),d("하은","그럼 신경 쓰인다고 말해. 누구를 만나지 말지는 네가 정하지 말고."),d("주인공","남자친구가 싫다고 해도?"),d("하은","들을 거야. 내가 뭐가 좋은지 말한 것도 네가 들어 줬으면 해."),n("주인공은 자기 불안을 하은이 좁아져서 해결해 주길 바랐음을 본다.")]} }
];

const allOptions=choice=>[...choice.options,...Object.values(choice.variants??{}).flatMap(value=>Array.isArray(value)?value:[])];
const choiceLabel=new Map(DAY15_V4_CHOICES.flatMap(choice=>allOptions(choice).map(option=>[option.id,option.label])));
const normalized=scenes.map(scene=>f({...scene,id:`D15V4_S${String(scene.number).padStart(2,"0")}`,steps:freezeSteps(scene.steps??[]),branches:f(Object.entries(scene.branches??{}).map(([key,steps])=>f({key,label:choiceLabel.get(key)??key,steps:freezeSteps(steps)}))),routeBranches:f(Object.entries(scene.routeBranches??{}).map(([key,steps])=>f({key,steps:freezeSteps(steps)})))}));
export const DAY15_V4_PLAYABLE_SCRIPT_01_12=f(normalized);

const flagsOf=state=>state?.storyFlags??{};
const attend=flags=>flags.day15V4AttendanceRoute==="ATTEND";
function routeKey(scene,flags){
  if(scene.number===1)return flags.day15V4GalleryInvitation==="INVITED"?"invited":"notInvited";
  if([3,6].includes(scene.number))return attend(flags)?"attend":"own";
  if(scene.number===10)return flags.day15V4RestDecision==="TOGETHER"?"together":flags.day15V4RestDecision==="LEAVE"?"leave":"separate";
  return null;
}
function selectedIds(scene,flags){
  const numbers=scene.choiceNumbers??(scene.choiceNumber?[scene.choiceNumber]:[]);
  return numbers.map(number=>flags[`day15V4Choice${number}`]).filter(Boolean);
}
export function getDay15V4PlayableScene01To12(state,sceneNumber){
  const scene=DAY15_V4_PLAYABLE_SCRIPT_01_12.find(item=>item.number===sceneNumber);if(!scene)throw new Error(`UNKNOWN_DAY15_V4_SCENE_${sceneNumber}`);
  const flags=flagsOf(state),isAttend=attend(flags);
  if(scene.conditional==="attend"&&!isAttend||scene.conditional==="conversation"&&!(["IN_PERSON","PHONE"].includes(flags.day15V4HaeunContactRoute)))return f({...scene,omitted:true,choiceAvailable:false,steps:f([]),selectedBranches:f([])});
  const steps=[],selected=[],route=scene.routeBranches.find(item=>item.key===routeKey(scene,flags));if(route){selected.push(route.key);steps.push(...route.steps);}steps.push(...scene.steps);
  const ids=scene.number===6&&isAttend?[]:selectedIds(scene,flags);for(const id of ids){const branch=scene.branches.find(item=>item.key===id);if(branch){selected.push(id);steps.push(...branch.steps);}}
  const activeChoiceNumbers=scene.choiceNumbers??(scene.choiceNumber?[scene.choiceNumber]:[]);const routeChoiceNumbers=scene.number===6&&!isAttend?[3,4,5]:scene.number===6?[]:activeChoiceNumbers;
  const unresolvedChoiceNumbers=routeChoiceNumbers.filter(choiceNumber=>!flags[`day15V4Choice${choiceNumber}`]);
  for(const choiceNumber of unresolvedChoiceNumbers)steps.push(f({type:"choiceCue",choiceNumber}));
  return f({...scene,omitted:false,choiceAvailable:unresolvedChoiceNumbers.length>0,selectedBranches:f(selected),steps:f(steps)});
}

export function validateDay15V4PlayableScript01To12(){
  return DAY15_V4_PLAYABLE_SCRIPT_01_12.length===12&&DAY15_V4_PLAYABLE_SCRIPT_01_12.every((scene,index)=>scene.number===index+1)&&[1,2,3,4,5,6,7].every(number=>DAY15_V4_PLAYABLE_SCRIPT_01_12.some(scene=>scene.choiceNumber===number||scene.choiceNumbers?.includes(number)));
}
