import {DAY14_V4_CHOICES} from "./day14-v4-campaign-data.mjs";

const f=Object.freeze,freezeSteps=steps=>f(steps.map(step=>f(step)));
const line=(type,text,extra={})=>f({type,text,...extra});
const n=text=>line("narration",text),d=(speaker,text)=>line("dialogue",text,{speaker}),m=(sender,text)=>line("message",text,{sender}),stage=text=>line("stageDirection",text);

const scenes=[
{number:1,title:"어제의 사진",steps:[stage("나의 방 / 아침"),n("주인공은 하은이 어제 보낸 책상 사진을 다시 본다. 사진을 받지 않은 날에는 꽃을 하나 두고 싶다던 메시지를 읽는다."),n("컵 하나 옆에 작은 꽃이 놓인 모습을 상상한다."),m("주인공","오늘 꽃 보러 가?"),m("하은","아직 모르겠어. 아침부터 일이 좀 꼬여서."),n("주인공은 ‘무슨 일?’을 쓰지만 하은의 ‘나중에 말할게’를 보고 지운다."),n("사진 속 컵 손잡이와 빈자리를 보다가 꽃을 들고 가면 하은이 웃을 것이라고 기대한 자기 얼굴을 꺼진 화면에서 본다."),d("주인공","내가 들고 가면, 웃을 줄 알았네."),n("그는 아침 그릇과 컵 자국부터 치운다. 하은의 빈자리보다 자기 책상에 컵 놓을 자리부터 부족했다.")]},
{number:2,title:"함께 가기로 한 것은 아닌데",choiceNumber:1,routeBranches:{invited:[m("주인공","오늘 만나기로 한 건 어떻게 할까?"),m("하은","조금 미루자. 오후에 다시 연락할게."),n("주인공은 이미 입은 옷을 다시 갈아입을지 망설인다.")],notInvited:[m("주인공","응. 네 일 먼저 해."),n("할 수 있는 일이 없다는 느낌이 조금 불편하다.")]},branches:{
day14_wait_own_work:[m("주인공","나도 내 일 보다가 오후에 연락할게."),m("하은","응. 오후에 내가 연락할게."),n("주인공은 ‘뭐 할 건데?’라는 질문을 기다리다 웃는다. 회사 종이와 지훈에게 보여 줄 메모를 서로 다른 묶음으로 나눈다.")],
day14_wait_flower_solo:[m("주인공","꽃은 나도 궁금해. 혼자 잠깐 보고 올까."),m("하은","보고 와도 돼. 내 건 내가 나중에 고를게."),m("주인공","어떤 거 좋아하는지 물어보려고 했는데."),m("하은","나도 가서 보고 싶어. 어제는 작은 거면 될 줄 알았는데 지금은 모르겠네."),n("그는 ‘내가 골라 줄게’ 대신 ‘응’이라고 보낸다.")],
day14_wait_ask_need:[m("주인공","지금 필요한 게 있으면 말해 줘."),m("하은","지금은 조금 조용한 시간이 필요해."),n("전화 아이콘 근처에서 손가락을 내린다."),m("주인공","알았어. 네가 말하고 싶을 때 듣고 있을게."),n("‘기다리고 있을게’로 바꾸지 않는다. 오늘 하루를 통째로 전화기 앞에 놓고 싶지는 않았다.")] }},
{number:3,title:"예쁜 것을 보면 좀 낫지 않을까",choiceNumber:2,steps:[n("주인공은 회사 종이와 사진 메모를 한쪽으로 옮기며 자기 책상을 정리한다."),n("꽃을 하은에게 주지 않아도 자기 방에 둘 수 있다는 생각이 우스워 혼자 웃는다."),n("작은 가방을 들었다가 몸이 무거운 것을 느끼고 내려놓는다. 갈지 말지부터 자기 마음을 묻는다.")],branches:{
day14_flower_for_room:[n("오늘은 자기 방에 둘 꽃을 직접 보고 싶다. 자기 자리를 만드는 일이 먼저다.")],
day14_flower_discuss_later:[n("하은이 나중에 직접 고를 때 같이 이야기할 수 있도록 사진과 이름만 알아 두려 한다.")],
day14_flower_cheer_haeun:[n("작은 꽃으로 하은의 기분을 바꾸고 싶다는 마음을 인정한다. 동시에 ‘내 건 내가 고를게’라는 말을 건너뛰고 싶은 마음도 모른 척하지 않는다.")],
day14_stay_home_clear_space:[n("가방을 내려놓고 창가 의자를 옮긴다. 오늘은 자기 자리를 먼저 치우기로 한다.")] }},
{number:4,title:"카페 앞의 작은 테이블",routeBranches:{flora:[stage("플로라 카페 앞 / 낮"),n("카페 앞 작은 꽃 판매 테이블에서 여자가 바람에 뒤집힌 가격표를 누른다. 주인공은 떨어진 빈 종이를 주워 건넨다."),d("여자","감사해요. 오늘 제일 말을 안 듣는 건 꽃이 아니라 종이네요."),d("주인공","꽃은 말을 잘 들어요?"),d("여자","걔네는 말이 없어서 제가 잘 듣는다고 착각할 수 있어요."),n("주인공이 웃자 여자는 앞치마 이름표를 가리킨다."),d("나리","나리예요. 꽃 다듬는 사람."),n("나리는 짧게 웃고 물통 쪽으로 돌아선다.")],home:[stage("나의 방 / 낮"),n("주인공은 카페 안내 사진 속 작은 꽃과 포장지를 보다가 휴대폰을 내려놓는다. 지금 나가면 피곤할 것 같다."),n("물을 마시고 창가로 의자를 끌자 바닥에서 긴 소리가 난다. 하은이 한가했다면 ‘이것도 이사냐’고 물었을 것 같아 혼자 웃는다."),n("컵 자리에 남은 먼지를 닦다가 정리 범위가 넓어진다. 사진을 보내기보다 앉을 자리가 넓어지는 일 자체가 좋다."),n("하은의 답장을 확인하지 않고 다음 칸을 연다.")]}},
{number:5,title:"한 송이라고 쉬운 것은 아니다",choiceNumber:3,conditional:"flora",steps:[d("나리","어떤 꽃을 찾으세요?"),d("주인공","작은 걸 보고 있어요."),d("나리","작은 꽃, 작은 다발, 작은 가격. 어느 쪽이에요?"),d("주인공","일단 마지막이요."),n("나리는 부끄럽게 만들지 않고 작은 범위의 꽃을 보여 준다."),d("나리","여기서는 마음에 드는 걸로 고르면 돼요. 많이 안 사도 되고요."),d("나리","어디에 둘 거예요?"),n("주인공은 자기 책상과 하은의 책상을 동시에 떠올린다.")],branches:{
day14_place_my_room:[d("주인공","제 방이요. 물컵 옆에 두려고요."),d("나리","꽃 놓을 자리는 있어요?"),d("주인공","아까 만들었어요."),d("나리","빠르네요."),d("주인공","다른 물건이 침대로 갔지만."),d("나리","그러면 꽃 사 가면 오늘 밤에 또 이사해야겠네."),n("길이가 다른 두 송이 중 자기 책상에 들어갈 작은 쪽을 가리킨다.")],
day14_place_haeun_later:[d("주인공","여자친구가 책상에 두고 싶다고 해서요. 아직 고르진 않았어요."),d("나리","같이 오시기로 했어요?"),d("주인공","아직은요. 오늘 일이 좀 생겨서."),d("나리","그럼 사진으로 먼저 보셔도 돼요. 꽃 이름도 같이 나오게요."),n("나리가 꽃을 옆으로 옮기자 자기 손밖에 안 나온다며 웃는다. 주인공은 한 장 찍고 곧바로 보내지 않고 앨범에 남긴다.")],
day14_place_gift:[d("주인공","선물하려고요. 오늘 좀 힘든가 봐서."),d("나리","무슨 색 좋아하세요?"),d("주인공","오늘 좋아할 색은 모르겠네요."),d("나리","그러면 꽃 사진 보낸 다음에 골라도 되고요."),d("주인공","깜짝 선물로 하고 싶었거든요."),n("나리는 세 가지를 내놓고 물을 갈러 간다. 대신 정해 줄 사람이 사라지자, 주인공은 깜짝 놀랄 얼굴은 알아도 오늘 기분은 모른다는 걸 본다.")] }},
{number:6,title:"오래가는 꽃",conditional:"flora",steps:[d("주인공","어떤 게 오래 가요?"),d("나리","오래 두고 싶어요?"),d("주인공","금방 시들면 좀 아쉬울 것 같아서요."),d("나리","저도요. 그래서 손질을 해요. 그래도 끝까지 안 시드는 꽃은 아니고요."),n("나리는 상한 잎 하나를 정리한다."),d("주인공","버리는 것도 일이네요."),d("나리","남길 것만 보는 일 같지만, 안 남는 것도 많이 보죠."),d("나리","처음 사는 꽃 앞에서 너무 진지했네요."),n("둘이 웃는다. 꽃을 고르는 일은 영원히 예쁠 것을 고르는 일이 아니었다.")]},
{number:7,title:"나리가 놓친 한 송이",conditional:"flora",steps:[n("바람에 빈 포장지가 날리고 나리가 옆 꽃대를 건드린다."),d("나리","이건 제가 실수했네."),n("주인공은 괜찮다고 끼어들지 않고 나리가 상태를 살피는 것을 기다린다. 나리는 꺾인 부분 아래를 잘라 작은 병에 꽂는다."),d("주인공","그렇게 두는 것도 예쁘네요."),d("나리","판매는 못 해요. 오늘 제 자리에 둘 거예요."),d("나리","짧아졌다고 괜찮아졌다는 건 아니고요. 아까 좀 아깝긴 했어요."),d("주인공","표정 안 그러셨는데."),d("나리","손님 앞이라."),n("나리가 한숨을 과장해 내쉰다."),d("나리","지금 하면 너무 늦었죠?"),d("주인공","아니요. 전달됐어요."),n("나리는 빈 집게 하나만 건네고 주인공은 가격표에 끼운다. 종이가 멈추자 둘은 어색하게 엄지를 들어 보인다."),d("나리","오늘 제 책상이 생겼네요.")]},
{number:8,title:"선물이 할 수 없는 일",choiceNumber:4,conditional:"flora",branches:{
day14_take_self_flower:[d("주인공","제 방에 둘 한 송이만 주세요."),n("나리는 가격을 다시 말한다. 주인공은 지갑 안을 확인한 뒤 결제한다."),d("주인공","제가 들고 가기 편한 정도면 돼요."),d("나리","그럼 꽃은 크게, 포장은 작게."),d("주인공","제 방에는 크게 보일 거예요."),n("꽃 한 송이가 손에 놓이자 머리 쪽이 사람에게 부딪치지 않게 방향을 바꿔 본다.")],
day14_take_photo_only:[d("주인공","사진만 보고 갈게요. 나중에 같이 고르려고요."),d("나리","이름도 같이 찍혔어요?"),n("화면의 글씨가 거꾸로여서 나리가 가격표를 바로 돌린다."),d("나리","아까 제가 바람 때문에 뒤집어 놨네요."),d("주인공","저도 이상하다고만 생각했어요."),n("둘이 웃는다. 그는 다시 찍고 오늘은 사지 않겠다고 말한다. 나리는 천천히 보라며 다른 꽃 포장을 시작한다.")],
day14_take_gift_flower:[d("주인공","그래도 선물 한 송이는 사고 싶어요."),d("나리","포장은 선물용으로 할까요?"),n("나리가 리본 길이를 다시 맞추자 주인공은 그렇게 하지 않아도 괜찮다고 한다."),d("나리","제가 걸려서요. 받는 분은 모를 수도 있는데."),d("주인공","모르면 좀 서운하겠네요."),d("나리","저는 집에서 그랬어요. 엄마한테 꽃 가져갔는데 꽃병 어디 있냐고만 하셔서. 예쁘냐고 세 번 물어봤어요."),d("주인공","뭐라고 하셨어요?"),d("나리","예쁘니까 꽂을 데 찾는 중이라고."),d("나리","제가 대답을 너무 빨리 듣고 싶었나 봐요."),n("포장이 주인공 손으로 넘어오고 리본 끝이 손등을 간질인다.")],
day14_take_no_purchase:[n("현재 지출 가능한 범위를 넘겨 결제하지 않는다. 금액을 만들어 내지 않고 사진만 남기거나 미구매로 카페에 들어간다.")] }},
{number:9,title:"오후의 답장",choiceNumber:5,steps:[m("하은","아까 일은 끝났어. 잘 끝난 건 아니고."),m("주인공","힘들었겠다."),m("하은","응. 오늘은 뭘 더 고르고 싶지가 않네."),n("꽃을 샀다면 손에 포장이 있고, 사지 않았다면 사진이나 자기 방의 빈자리만 남아 있다.")],branches:{
day14_invite_sit_without_demand:[m("주인공","잠깐 같이 앉아 있을래? 아무것도 안 골라도 돼."),m("하은","나 지금 사람 많은 데는 좀 싫어."),m("주인공","안쪽은 조용해. 잠깐만 앉아 있어도 되고."),m("하은","그럼 삼십 분 정도. 가서 또 웃는 척은 못 할 것 같아."),m("주인공","그거 하려고 부른 건 아니야."),n("보내고 나서 그 말을 진짜로 지킬 수 있을지 꽃을 내려다본다.")],
day14_invite_sit_declined:[m("주인공","잠깐 같이 앉아 있을래? 아무것도 안 골라도 돼."),m("하은","오늘은 집에 바로 가고 싶어."),n("빈 의자 사진을 보내려다가 멈춘다."),m("주인공","알았어. 잘 들어가."),n("의자 하나가 비어 있다는 것이 그녀가 앉아야 할 이유는 아니었다.")],
day14_invite_rest_today:[m("주인공","오늘은 쉬어. 꽃은 다음에 보자."),m("하은","고마워. 나중에 얘기할게."),n("주인공은 자기가 쉬라고 말했으면서도 보고 싶다는 답을 기다렸다는 작은 서운함을 안고 자기 음료를 마신다.")],
day14_invite_show_prepared:[m("주인공","내가 작은 걸 준비했는데, 잠깐만 보면 안 될까?"),n("답이 늦는 동안 포장 가장자리를 다시 접는다."),m("하은","오늘은 그걸 보고 기뻐해야 할 것 같아서 조금 부담돼."),n("‘내가 언제’까지 썼다가 지운다."),m("주인공","알았어. 오늘 건네려고 하지 않을게."),m("하은","응"),n("오늘은 만나지 않는다. 꽃을 의자 옆에 세우고 자기 컵을 다시 당긴다.")],
day14_invite_direct_without_gift:[m("주인공","나 사실 잠깐 보고 싶은데."),m("하은","오늘은 집에 바로 가고 싶어."),m("주인공","알았어. 잘 들어가."),n("준비물이 있다고 꾸미지 않고 보고 싶은 마음만 말한다.")] }},
{number:10,title:"들고 온 손을 내리는 일",routeBranches:{meeting:[n("하은은 카페 문 앞에서 주인공을 찾는다. 웃으려다 작은 인사만 한다."),d("하은","많이 기다렸어?"),d("주인공","아니. 나도 보고 있었어."),n("꽃이 있다면 하은이 잠깐 본다."),d("주인공","이건…… 오늘 안 받아도 돼."),n("하은은 바로 고맙다고 말하지 않는다."),d("하은","응. 고마워."),n("꽃이 아니라 지금 받지 않아도 된다는 말에 대한 감사다.")],noMeeting:[n("주인공은 다시 만나자고 쓰려다가 휴대폰을 넣는다. 꽃이 있다면 자기 가방을 조심히 들고, 사진만 있다면 화면을 끈다."),n("마음이 준비됐다는 이유로 상대의 시간을 열 수는 없는 날이었다.")]}},
{number:11,title:"음료 두 잔",routeBranches:{meeting:[n("각자 음료를 고른다. 하은은 새로운 메뉴 대신 아는 것을 고른다."),d("하은","오늘은 이거 맛이 어떤지 알고 싶어."),d("주인공","새로운 게 너무 많았어?"),d("하은","그냥, 오늘은 고르면 결과가 좋을지 생각하는 것도 싫어."),n("주인공은 꽃을 테이블 가운데가 아니라 자기 옆에 둔다.")],noMeeting:[n("집에서 자기 꽃을 물컵에 꽂거나 사진을 정리한다. 하은이 오늘 새것을 고르고 싶지 않다고 한 말을 떠올린다."),n("새 메시지를 여러 개 보내지 않는다.")]}}
];

const choiceLabel=new Map(DAY14_V4_CHOICES.flatMap(c=>[...c.options,...Object.values(c.variants??{}).flatMap(v=>Array.isArray(v)?v:[])].filter(Boolean).map(o=>[o.id,o.label])));
const normalized=scenes.map(scene=>f({...scene,id:`D14V4_S${String(scene.number).padStart(2,"0")}`,steps:freezeSteps(scene.steps??[]),branches:f(Object.entries(scene.branches??{}).map(([key,steps])=>f({key,label:choiceLabel.get(key)??key,steps:freezeSteps(steps)}))),routeBranches:f(Object.entries(scene.routeBranches??{}).map(([key,steps])=>f({key,steps:freezeSteps(steps)})))}));
export const DAY14_V4_PLAYABLE_SCRIPT_01_11=f(normalized);

const flagsOf=state=>state?.storyFlags??{};
const flora=flags=>flags.day14V4OutingRoute==="FLORA";
const meeting=flags=>flags.day14V4InteractionRoute==="IN_PERSON";
export function getDay14V4PlayableScene01To11(state,sceneNumber){
  const scene=DAY14_V4_PLAYABLE_SCRIPT_01_11.find(x=>x.number===sceneNumber);if(!scene)throw new Error(`UNKNOWN_DAY14_V4_SCENE_${sceneNumber}`);
  const flags=flagsOf(state);if(scene.conditional==="flora"&&!flora(flags))return f({...scene,omitted:true,choiceAvailable:false,steps:f([]),selectedBranches:f([])});
  const steps=[...scene.steps],selected=[];
  let routeKey=null;if(scene.number===2)routeKey=flags.day13V3FloraInvitation===true?"invited":"notInvited";if(scene.number===4)routeKey=flora(flags)?"flora":"home";if([10,11].includes(scene.number))routeKey=meeting(flags)?"meeting":"noMeeting";
  const route=scene.routeBranches.find(x=>x.key===routeKey);if(route){selected.push(routeKey);steps.push(...route.steps);}
  const choiceAvailable=Boolean(scene.choiceNumber);
  if(choiceAvailable){steps.push(f({type:"choiceCue",choiceNumber:scene.choiceNumber}));const id=scene.choiceNumber===5?(flags.day14V4Choice5Reaction??flags.day14V4Choice5):flags[`day14V4Choice${scene.choiceNumber}`];const branch=scene.branches.find(x=>x.key===id);if(branch){selected.push(id);steps.push(...branch.steps);}}
  return f({...scene,omitted:false,choiceAvailable,selectedBranches:f(selected),steps:f(steps)});
}

export function validateDay14V4PlayableScript01To11(){return DAY14_V4_PLAYABLE_SCRIPT_01_11.length===11&&DAY14_V4_PLAYABLE_SCRIPT_01_11.every((s,i)=>s.number===i+1)&&[1,2,3,4,5].every(n=>DAY14_V4_PLAYABLE_SCRIPT_01_11.some(s=>s.choiceNumber===n));}
