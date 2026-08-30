import {DAY14_V4_CHOICES} from "./day14-v4-campaign-data.mjs";

const f=Object.freeze,freezeSteps=steps=>f(steps.map(step=>f(step)));
const line=(type,text,extra={})=>f({type,text,...extra});
const n=text=>line("narration",text),d=(speaker,text)=>line("dialogue",text,{speaker}),m=(sender,text)=>line("message",text,{sender}),stage=text=>line("stageDirection",text);

const scenes=[
{number:12,title:"잘 안 끝난 일",choiceNumber:6,routeBranches:{conversation:[n("하은은 준비한 자료에 수정이 생겼고 오래 붙잡은 부분을 빼야 했다고 말한다. 회사 이름이나 수치는 말하지 않는다."),d("하은","틀렸다는 건 아는데. 알면서도 속상하더라."),n("주인공은 여러 사람이 비슷한 말을 해도 오늘 하은의 목소리는 다르다는 것을 듣는다."),d("하은","나도 어른스럽게 ‘알겠습니다’ 하고 싶었는데 속으로는 아니었어.")],phone:[stage("나의 방 / 밤 / 통화"),d("하은","지금 뭐 해?"),d("주인공","책상 보고 있어."),d("하은","왜?"),d("주인공","치웠거든. 오래 보고 싶어서."),n("하은이 작게 웃고 컵을 내려놓는 생활 소리가 들린다."),d("하은","이제야 좀 앉았어."),d("주인공","오늘 길었네."),d("하은","응. 너는 꽃 봤어?"),n("카페에 갔다면 포장과 작은 병, 집에 있었다면 의자와 서랍 이야기를 한다."),d("하은","난 오늘 만든 거 빼고 왔는데, 너는 자리 만들었네."),d("주인공","네 얘기 들을까?"),d("하은","응. 지금은 조금."),n("하은은 자료에서 오래 붙잡은 부분을 빼야 했다고 말한다. 회사 이름과 수치는 말하지 않는다.")],fullRest:[m("하은","나 오늘은 일찍 누울게. 아직 얘기하면 더 속상할 것 같아."),n("‘얘기하면 괜찮아질 수도 있잖아’를 보내지 않는다. 시작하면 끝까지 해야 할 것 같아 시작하기 싫은 일도 있다는 걸 자기 책상에서 본다."),m("주인공","알았어. 잘 자. 내일 얘기해도 되고."),n("답은 오지 않는다. 꽃이 있는 자리 또는 빈 창가를 보고 자기 밤의 조명을 켠다.")]},branches:{
day14_listen_ask_loss:[d("주인공","어떤 부분이 제일 아쉬웠어?"),d("하은","처음 보는 사람도 따라올 수 있게 순서를 바꿨거든. 그거 고민하는 데 오래 걸렸어."),d("주인공","아예 없어졌어?"),d("하은","일부는 남았어. 그런데 내가 왜 그렇게 했는지 설명하기 전에 다음으로 넘어가니까."),n("보여 달라고 하지 않는다. 아쉬운 것은 숫자보다 자기 설명을 끝내지 못한 순간 같았다."),d("주인공","오늘은 네 말이 남았네."),d("하은","응. 그게 맞는 것 같아.")],
day14_listen_allow_upset:[d("주인공","지금은 그냥 속상해해도 되지 않을까."),d("하은","그럼 조금만."),n("하은은 한동안 말하지 않는다."),d("하은","왜 사람들은 맞는 말을 그렇게 안 반갑게 하지?"),d("주인공","맞는 말이라 더 그럴 수도 있고."),d("하은","너도 지금 조금 그래."),n("주인공이 입을 다물자 하은이 짧게 웃는다."),d("하은","미안. 너한테 화풀이했네."),d("주인공","한 번은 넘어갈게."),d("하은","횟수 세지 마."),n("오늘 처음으로 웃음을 따라 기다리지 않은 순간이다.")],
day14_listen_ask_alternative:[d("주인공","다른 방법은 없었어?"),d("하은","지금 그걸 다시 풀어야 할까?"),d("주인공","아니. 내가 너무 빨리 갔네."),n("다음에는 말을 끊지 않고 듣는다.")],
day14_reflect_expected_words:[n("주인공은 자기가 어떤 말을 기다리고 있었는지 생각한다. 하은의 답을 대신 만들지 않는다.")],day14_reflect_my_day:[n("주인공은 오늘 자기 일과 만든 자리를 돌아본다. 하은이 말하지 않은 업무 원인은 모른 채 둔다.")],day14_reflect_stop_thinking:[n("지금은 생각을 쉬기로 한다. 하은에게 추가 답을 요구하지 않는다.")] }},
{number:13,title:"위로가 늦게 오는 자리",conditional:"conversation",steps:[d("하은","오늘은 네가 무슨 말 해야 할지 계속 생각하는 것 같아."),d("주인공","티 나?"),d("하은","응."),d("주인공","좋아졌으면 좋겠어서."),d("하은","안 좋아져도 같이 있을 수 있잖아."),n("주인공은 다른 말을 찾지 않고 컵을 든다. 대화하지 않는 시간이 전보다 덜 불안하다."),n("밖에서 의자를 옮기는 소리와 말해야 할 것 같은 순간이 두 번쯤 지나간다."),d("주인공","나 지금 안 웃겨."),d("하은","응?"),d("주인공","뭐라도 웃긴 말을 해야 할 것 같은데 안 생각나."),d("하은","그걸 꼭 발표해야 돼?"),d("주인공","조용한 이유가 너 때문은 아니라고."),d("하은","나도 아까 웃지 못한 게 너 싫어서 그런 건 아니었어."),n("주인공이 어깨를 내리자 의자 등받이가 등에 닿는다. 둘은 같은 창밖을 보고 바로 감상을 말하지 않는다.")]},
{number:14,title:"한 송이의 주인",routeBranches:{meetingFlower:[d("하은","네 방에 둘 거야?"),d("주인공","응. 내 책상에 놓으려고. 오늘 자리를 만들었어."),d("하은","좋네. 네가 고른 거잖아.")],meetingGift:[d("하은","네 방에 둘 거야?"),d("주인공","처음엔 네 거였어. 내 마음속에서는. 근데 오늘은 내가 가져가려고."),d("하은","싫어져서?"),d("주인공","아니. 네가 안 받으면 버려야 하는 것도 아니니까."),n("하은이 작게 웃는다. 꽃은 주인공 소유로 돌아간다.")],meetingPhoto:[n("주인공이 꽃 사진을 띄운다. 하은은 잠깐 보다가 눈을 내린다."),d("하은","나중에 봐도 되지?"),d("주인공","응."),n("새로운 설득을 붙이지 않는다.")],noMeeting:[n("꽃을 건네지 않은 사람은 자기 꽃·사진·빈자리를 들고 SCENE 18의 자기 방으로 돌아간다.")]}},
{number:15,title:"조금 틀어진 병",conditional:"haeunNari",steps:[n("나리가 꽃 테이블을 정리하다 인사하고 주인공이 소개한다. 하은도 자기 이름을 말한다."),n("나리가 줄기를 잘라 꽂은 작은 병을 옮기자 꽃이 한쪽으로 기운다."),d("나리","얘는 오늘 계속 저쪽만 보네."),d("하은","햇빛이 저기 있어서요?"),n("나리가 창밖을 보고 웃는다."),d("나리","아. 제가 사진 잘 나오게 반대로 돌려놨네요."),n("나리는 병을 원래대로 놓고 꽃을 억지로 세우지 않는다."),n("하은의 웃음은 주인공이나 선물의 보상이 아니다. 주인공은 그제야 조금 놓인다.")]},
{number:16,title:"네가 웃을 때",conditional:"meeting",steps:[d("하은","좀 나아졌어."),n("주인공은 기쁜 표정을 숨기지 못한다."),d("하은","네가 해결한 건 아니고."),d("주인공","알아. 그래도 좋네."),d("하은","그 대답 좋다.")]},
{number:17,title:"꽃이 없는 두 손",choiceNumber:7,routeBranches:{meeting:[n("카페 밖에서 남은 시간을 정한다.")],noMeeting:[n("주인공은 자기 방에서 남은 시간을 정한다.")]},branches:{
day14_time_walk_station:[d("주인공","역까지 같이 천천히 가자."),d("하은","응. 천천히면 좋겠어."),n("주인공이 지나치게 늦추자 하은이 웃는다."),d("하은","그 정도면 내일 도착하겠는데."),d("주인공","천천히 기준이 어려워."),d("하은","내 옆에 있으면 돼."),n("앞서 가지도 일부러 뒤에 남지도 않고 자기 보폭으로 걷는다.")],
day14_time_rest_home:[d("주인공","오늘은 집에 가서 쉬어. 다음에 또 보자."),d("하은","응. 나 아직 고르고 싶긴 해. 오늘이 아니었을 뿐이지."),d("하은","다음에 만날 때 오늘 얘기 처음부터 또 안 해도 되지?"),d("주인공","네가 하고 싶으면 듣고. 아니면 밥 얘기하자."),n("하은이 웃으며 손을 흔든다.")],
day14_time_more_together:[d("주인공","나도 너랑 조금만 더 있고 싶어."),d("하은","나랑? 아니면 나 기분 좋아진 거 확인하려고?"),d("주인공","둘 다 있었는데. 지금은 너랑."),d("하은","그럼 조금만. 역 앞까지만 더 걷자."),n("몸이 남지 못하는 경로에서는 하은이 집에 가고 싶다고 말하고, 주인공은 다른 제안 없이 잘 들어가라고 끝낸다.")],
day14_time_eat_my_dinner:[n("주인공은 연락을 더 기다리기 전에 자기 저녁을 먹기로 한다.")],day14_time_short_air:[n("창밖 바람을 짧게 쐰다. 하은의 시간을 열지 않는다.")],day14_time_sleep_early:[n("오늘은 일찍 쉬기로 하고 추가 메시지를 보내지 않는다.")] }},
{number:17.1,title:"익숙해지는 손 또는 나란히 있는 사람",routeBranches:{hand:[n("함께 걷는 날, 꽃을 한 손으로 옮기자 하은이 빈손을 보고 자기 손을 내민다. 주인공은 그 손을 잡는다. 걸음이 어긋나 둘 다 웃는다."),d("하은","이쪽도 조심해."),d("주인공","이쪽은 말해 주네."),d("하은","그러니까 잘 들어."),n("역에 가까워질수록 손을 놓아야 한다는 생각에 말이 줄어든다."),d("주인공","기분 안 좋은 날에도 네가 예쁘다고 말하면 이상해?"),d("하은","내 표정 보고 하는 말이면 좀 이상할 것 같은데."),d("주인공","그냥 지금 네가 가까이 있어서."),n("하은이 손을 한 번 쥔다."),d("하은","그건 들어도 되겠다.")],beside:[n("하은은 가방 끈을 양손으로 잡고 걷고 주인공은 꽃 쪽 손을 낮춘다."),d("하은","꽃 안 샀어도 오늘 나왔을 거야?"),d("주인공","응. 너 보고 싶어서."),d("하은","그 말을 아까 했으면 좋았을 것 같아."),d("주인공","그러게. 꽃이 먼저 말해 줄 줄 알았나 봐."),d("하은","이제 네가 해."),n("오늘 손을 잡지 않았지만 다음에 건넬 말을 하나 알아 온다.")],noMeeting:[n("미대면 경로에는 하은의 손·웃음·귀가 동행을 생성하지 않는다.")]}},
{number:18,title:"혼자 있는 꽃",choiceNumber:8,steps:[stage("나의 방 / 저녁"),n("자기 꽃을 작은 빈병이나 안정적인 컵에 옮긴다. 꽃을 사지 않았다면 책상 빈자리를 그대로 둔다. 공간이 비어 있다고 오늘을 덜 보낸 것은 아니다."),n("집에서 쉬었던 사람은 창가를 정리한다. 하은의 작은 꽃 계획도 나중으로 미룰 수 있었다."),n("꽃병 때문에 컵이 책상 끝으로 밀린 것을 보고 안전한 쪽으로 옮긴다.")],branches:{
day14_room_make_flower_visible:[n("꽃이 보이도록 물건을 옮겨 병을 가운데 놓는다. 손을 뻗을 때마다 조심해야 해서 사진의 중심이 아니어도 계속 볼 수 있는 옆자리로 옮긴다."),n("한 장 찍고 남에게 보내기 전에 자기 화면에서 더 본다.")],
day14_room_make_seat_first:[n("꽃이나 빈 컵을 창가로 밀고 팔을 책상에 놓는다. 알림 없는 조용한 방을 듣는다."),n("하은이 필요하다고 한 시간이 이런 것인지 확정하지 않는다. 지금은 자신도 조금 편하다.")],
day14_room_stop_and_eat:[n("정리하던 물건을 한쪽에 모으고 음식을 준비한다. 꽃에 물 주는 법을 찾기 전에 빈 자기 물컵부터 채운다."),n("휴대폰을 엎어 두고 잘 먹었다고 알리기 전에 식사를 끝낸다.")] }},
{number:19,title:"나리의 카드",choiceNumber:9,routeBranches:{nari:[n("꽃을 산 날에는 가게 안내와 ‘너무 잘하려고 물을 계속 주지는 마세요’라는 관리 카드가 있다. 사진만 남긴 날에는 가격표를 바로 돌리던 나리를 떠올린다.")],noNari:[n("창가에 컵을 놓고 언젠가 꽃을 사 볼까 생각한다. 어제 빨래가 있던 사진과 오늘 넓어진 책상 사진을 번갈아 본다."),n("누군가에게 보여 주지 않아도 자기가 무엇을 했는지는 알아볼 수 있다.")]},branches:{
day14_nari_ask_flowers_again:[n("다음에 들르면 꽃이 잘 지내는지, 자신이 잘 지내는지 물어볼 수 있을 것 같아 웃는다. 카드는 병 옆에 둔다.")],
day14_nari_talk_more:[n("나리의 과장된 한숨을 떠올리고 조금 더 이야기해 보고 싶은 자기 관심을 인정한다. 나리 이름의 대화방은 없고, 나리도 이야기하고 싶을지는 모른다.")],
day14_nari_enough_today:[n("오늘 도움받은 인사로 충분하다. 카드는 병 아래에 둔다.")],
day14_no_nari_buy_someday:[n("작은 꽃을 언젠가 사 보고 싶은 마음만 남긴다.")],day14_no_nari_desk_photo:[n("넓어진 책상 사진을 자기 앨범에 남긴다.")],day14_no_nari_cleanup_enough:[n("오늘은 정리한 것으로 충분하다고 정한다.")] }},
{number:20,title:"꽃보다 먼저 보내는 말",choiceNumber:10,branches:{
day14_night_thanks_for_talking:[m("주인공","오늘 이야기해 줘서 고마워."),m("하은","들어줘서 고마워."),m("주인공","다음에는 내가 속상한 얘기 할 수도 있어"),m("하은","응. 꽃으로 대신하지 말고."),n("둘의 대화는 꽃보다 먼저 남는다.")],
day14_night_flower_home:[m("주인공","꽃은 잘 데려왔어. 네가 보고 싶으면 보여 줄게."),m("하은","네 방에는 어디 뒀어?"),n("실제로 찍은 사진만 보낸다."),m("하은","좋네. 네 것도 들어갈 자리가 있었네."),m("주인공","만들었어. 다른 물건은 아직 갈 데 찾는 중이고."),n("꽃을 사지 않은 날 하은이 사진을 내일 보겠다고 하면 보내지 않고 앨범에 둔다.")],
day14_night_rest_no_reply:[m("주인공","오늘은 푹 쉬어. 답 안 해도 돼."),n("휴대폰을 충전기에 연결하고 물을 마시러 간다. 돌아와도 알림은 없지만 다시 보내지 않는다.")],
day14_night_no_message:[n("연락 휴식 요청이 남아 있어 밤인사를 보내지 않는다. 자기 쪽의 멈춤도 선택으로 남긴다.")] }},
{number:21,title:"내일 보고 싶은 것",routeBranches:{invited:[m("하은","내일 가 보려고. 한강 갤러리."),m("하은","선배가 잠깐 설명해 준대. 같이 보고 싶으면 와도 돼."),n("동행은 초대이며 아직 수락하지 않는다.")],notInvited:[m("하은","나는 내일 다녀오려고. 너랑 할 얘기는 조금 더 생각할게."),m("주인공","응. 전시는 잘 보고 와."),n("주인공은 같이 가도 되느냐고 묻지 않는다. 하은은 누구와 무엇을 볼지와 전시가 기대된다는 마음을 먼저 말한다.")]},steps:[n("오늘 꽃을 고르고 싶지 않았던 사람이 내일은 무언가를 보고 싶다고 말한다. 오늘과 내일의 마음이 달라도 이상하지 않다.")]},
{number:22,title:"받지 않아도 남는 마음",steps:[n("책상 옆에 앉는다. 꽃을 샀다면 조금 기울어진 꽃을 보고, 사지 않았다면 빈자리를 본다. 오늘 고르지 않은 것이 모두 놓친 기회는 아니다."),m("하은","오늘 기분 좋아지라고 서두르지 않아서 좋았어."),n("만남이나 통화가 없었다면 ‘기다려 줘서 고마워’라는 더 짧은 말이 온다."),m("주인공","내일은 좀 다른 하루였으면 좋겠다."),n("꽃이 그 약속을 해 주지는 않는다. 그래도 오늘 책상에 두고 바라볼 수는 있다."),stage("DAY 14 END")]}
];

const choiceLabel=new Map(DAY14_V4_CHOICES.flatMap(c=>[...c.options,...Object.values(c.variants??{}).flatMap(v=>Array.isArray(v)?v:[])].filter(Boolean).map(o=>[o.id,o.label])));
const normalized=scenes.map(scene=>f({...scene,id:`D14V4_S${String(scene.number).replace(".","_").padStart(2,"0")}`,steps:freezeSteps(scene.steps??[]),branches:f(Object.entries(scene.branches??{}).map(([key,steps])=>f({key,label:choiceLabel.get(key)??key,steps:freezeSteps(steps)}))),routeBranches:f(Object.entries(scene.routeBranches??{}).map(([key,steps])=>f({key,steps:freezeSteps(steps)})))}));
export const DAY14_V4_PLAYABLE_SCRIPT_12_22=f(normalized);

const flagsOf=state=>state?.storyFlags??{};
const meeting=flags=>flags.day14V4InteractionRoute==="IN_PERSON",conversation=flags=>["IN_PERSON","PHONE"].includes(flags.day14V4InteractionRoute),nari=flags=>flags.day14V4NariMet===true;
function routeKey(scene,flags){
 if(scene.number===12)return flags.day14V4InteractionRoute==="IN_PERSON"?"conversation":flags.day14V4InteractionRoute==="PHONE"?"phone":"fullRest";
 if(scene.number===14)return !meeting(flags)?"noMeeting":flags.day14V4PurchaseOutcome==="PHOTO_ONLY"?"meetingPhoto":flags.day14V4PurchaseOutcome==="GIFT_FLOWER"?"meetingGift":"meetingFlower";
 if(scene.number===17)return meeting(flags)?"meeting":"noMeeting";
 if(scene.number===17.1)return !meeting(flags)?"noMeeting":flags.day14V4HandContactEstablished===true?"hand":"beside";
 if(scene.number===19)return nari(flags)?"nari":"noNari";
 if(scene.number===21)return flags.day14V4ExhibitionInvitation==="INVITED"?"invited":"notInvited";
 return null;
}
export function getDay14V4PlayableScene12To22(state,sceneNumber){
 const scene=DAY14_V4_PLAYABLE_SCRIPT_12_22.find(x=>x.number===sceneNumber);if(!scene)throw new Error(`UNKNOWN_DAY14_V4_SCENE_${sceneNumber}`);const flags=flagsOf(state);
 if(scene.conditional==="conversation"&&!conversation(flags)||scene.conditional==="meeting"&&!meeting(flags)||scene.conditional==="haeunNari"&&!(meeting(flags)&&nari(flags)))return f({...scene,omitted:true,choiceAvailable:false,steps:f([]),selectedBranches:f([])});
 const steps=[],selected=[],key=routeKey(scene,flags),route=scene.routeBranches.find(x=>x.key===key);if(route){selected.push(key);steps.push(...route.steps);}steps.push(...scene.steps);
 const choiceAvailable=Boolean(scene.choiceNumber)&&!(scene.choiceNumber===10&&flags.day14V4ContactRestActive===true);
 if(choiceAvailable){steps.push(f({type:"choiceCue",choiceNumber:scene.choiceNumber}));const id=flags[`day14V4Choice${scene.choiceNumber}`];const branch=scene.branches.find(x=>x.key===id);if(branch){selected.push(id);steps.push(...branch.steps);}}
 if(scene.number===20&&flags.day14V4ContactRestActive===true){const branch=scene.branches.find(x=>x.key==="day14_night_no_message");selected.push(branch.key);steps.push(...branch.steps);}
 return f({...scene,omitted:false,choiceAvailable,selectedBranches:f(selected),steps:f(steps)});
}
export function validateDay14V4PlayableScript12To22(){const numbered=DAY14_V4_PLAYABLE_SCRIPT_12_22.filter(s=>Number.isInteger(s.number));return numbered.length===11&&numbered.every((s,i)=>s.number===i+12)&&[6,7,8,9,10].every(n=>DAY14_V4_PLAYABLE_SCRIPT_12_22.some(s=>s.choiceNumber===n));}
