import {DAY13_V3_CHOICES} from "./day13-v3-campaign-data.mjs";

const freezeSteps=steps=>Object.freeze(steps.map(step=>Object.freeze(step)));
const line=(type,text,extra={})=>Object.freeze({type,text,...extra});
const narration=text=>line("narration",text);
const dialogue=(speaker,text)=>line("dialogue",text,{speaker});
const message=(sender,text)=>line("message",text,{sender});
const stage=text=>line("stageDirection",text);

const scenes=[
  {number:1,title:"어제 정하지 않은 길",choiceNumber:1,steps:[stage("나의 방 / 오전"),narration("주인공은 침대에서 일어나 잠깐 앉아 있다. 어제 회사를 다녀온 피로가 조금 남아 있다."),narration("창밖으로 햇빛이 들어온다. 휴대폰 카메라를 켜 보니 실제로 보는 것보다 방이 어둡다."),narration("화면을 손가락으로 누르자 밝기가 바뀐다. 한 번 더 누르니 방이 조금 밝아지는 것이 어쩐지 재미있다."),message("하은","오늘은 좀 어때?"),message("주인공","어제보다 덜 바빠. 머리가."),narration("하은이 작은 웃는 얼굴을 보낸다.")],branches:{
    day13_go_seoul_forest:[message("주인공","서울숲 쪽으로 잠깐 가 보려고."),message("하은","나는 오늘 내 일정 때문에 같이 못 나가. 대신 무리하면 바로 앉기."),message("하은","좋은 거 보면 나중에 보여 줘."),narration("이미 알고 있던 말인데도 조금 아쉽다.")],
    day13_walk_neighborhood:[message("주인공","멀리는 말고 동네에서 조금 걸을래."),message("하은","좋아. 나는 오늘 내 일정 끝내고 연락할게."),message("하은","좋은 거 보면 나중에 보여 줘."),narration("같이 나가지는 못한다는 말에 작은 아쉬움이 남는다.")],
    day13_photo_at_home:[message("주인공","오늘은 쉬면서 집에서 사진이나 찍어 볼까."),message("하은","집도 잘 보면 찍을 거 많아. 빨래는 모델료 안 받아."),message("하은","좋은 거 보면 나중에 보여 줘."),narration("그녀는 함께 있지 않아도 자기 일정을 취소하지 않는다.")] }},
  {number:2,title:"누구에게 보여 줄 사진",choiceNumber:2,steps:[narration("주인공은 예전에 찍힌 자기 사진을 찾으려다 카메라를 켠다. 오늘 찍은 것은 아직 없다."),narration("거울 앞에서 휴대폰을 들면 자기 얼굴이 화면을 가린다. 조금 옆으로 비키면 방의 어지러운 부분이 나온다."),narration("그는 웃으며 카메라를 내린다.")],branches:{
    day13_photo_for_self:[narration("주인공은 창가의 빛을 한 번 찍는다. 누구의 반응보다 자기 눈이 먼저 머문 곳이다.")],
    day13_photo_for_haeun:[narration("주인공은 하은이 좋아할 표정이나 색을 떠올린다. 아직 보내기로 정한 것은 아니다.")],
    day13_photo_without_perfection:[narration("물병과 메모가 같이 나온 사진을 찍는다. 구도가 어수선하지만 바로 지우지 않는다.")]
  }},
  {number:3,title:"가방에 넣지 않은 것",steps:[narration("사진을 잘 찍는 사람이었는지 오늘 확인할 필요는 없을 것 같다."),narration("주인공은 물과 필요한 물건을 챙긴다. 서울숲으로 가는 날에는 돌아올 시간을 대략 정하고, 동네라면 작은 가방만 든다."),narration("집에 머무르는 날에는 가방을 다시 내려놓고 창가 의자를 옮긴다."),narration("서랍 안에 회사에서 받은 예시 화면이 있다. 종이를 들었다가 다시 놓는다. 오늘 본 것을 설명할 때 회사의 말투까지 가져갈 필요는 없다."),narration("휴대폰에는 서진과의 마지막 대화도 남아 있다. 개인적인 만남을 제안했다면 아직 일정이 정해지지 않은 말이다."),narration("주인공은 그 대화방을 열어 보고 카메라로 돌아온다. 하은에게 말하지 않은 내용은 오늘 다른 곳에 간다고 사라지지 않는다."),narration("나가는 날에는 문을 잠그고, 집에 머무르는 날에는 창문을 조금 연다.")]},
  {number:4,title:"화면 바깥의 소리",routeBranches:{
    seoul:[stage("서울숲 러닝코스 / 낮"),narration("주인공은 달리는 사람들을 피해 천천히 걷는다. 휴대폰을 들고 멈추면 뒤에서 오는 발소리가 먼저 들린다."),narration("길에서 조금 비켜 선다. 나무 사이로 빛이 내려오지만 화면에는 생각보다 복잡하게 나온다."),narration("사진을 찍고 보니 쓰레기통이 가운데 있다."),narration("나무를 찍은 건데."),narration("조금 옆으로 이동하자 이번에는 나무가 반쯤 잘린다.")],
    neighborhood:[stage("동네 / 낮"),narration("주인공은 익숙한 길에서 처음 보는 그림자를 찾는다. 간판보다 가게 앞의 의자가 눈에 들어온다."),narration("다른 사람의 얼굴이 들어오자 휴대폰을 내린다. 사람이 지나간 뒤 다시 찍자 빈 의자 하나만 남는다.")],
    home:[stage("나의 방 / 낮"),narration("주인공은 물컵을 창가에 놓는다. 사진을 찍고 나니 컵보다 뒤의 빨래가 더 잘 보인다."),narration("빨래를 치우려다 웃음이 난다. 오늘 자신이 사는 방에는 빨래도 있었다."),narration("그는 컵만 찍은 사진과 방이 같이 나온 사진을 둘 다 남긴다.")]
  }},
  {number:5,title:"찍는 쪽과 찍히는 쪽",routeBranches:{
    seoul:[narration("카메라를 든 여자가 낮은 각도에서 나뭇잎을 보며 주인공에게 말을 건다."),dialogue("여자","저기요. 조금만 옆으로 지나가도 될까요?"),narration("주인공이 길을 비킨 뒤에야 자신이 피사체 앞에 서 있었다는 걸 안다."),dialogue("주인공","제가 가리고 있었네요."),dialogue("여자","아니요. 방금은 사람이 들어와도 괜찮았어요. 근데 얼굴 나오면 먼저 물어봐야 하니까."),narration("여자는 주인공을 몰래 찍어 놓고 괜찮냐고 묻지 않는다."),dialogue("주인공","저는 쓰레기통만 계속 나오는데."),dialogue("여자","그럼 쓰레기통을 좋아하는 척하면 돼요."),narration("주인공도 웃는다.")],
    solo:[narration("주인공은 자기가 찍은 사진을 조금 작게 줄여 본다. 마음에 들지 않던 사진도 멀리서 보니 나쁘지 않다."),narration("누구에게 설명하려고 찍지 않은 사진을 혼자 보는 일이 생각보다 편하다."),narration("오늘 새로운 사람이 말을 걸지는 않는다.")]
  }},
  {number:6,title:"아라",choiceNumber:3,conditional:"ara",steps:[narration("여자는 카메라 끈을 고쳐 멘다."),dialogue("여자","저는 아라예요. 사진 찍으러 왔어요."),dialogue("주인공","아라 씨."),narration("그는 자기 이름을 말한다. 아라는 고개를 끄덕인다."),dialogue("아라","오늘 처음 와요?"),dialogue("주인공","오늘은 처음이에요."),dialogue("아라","그럼 저도 오늘은 처음이네요."),narration("주인공은 사고나 기억 이야기를 먼저 말해야 할지 잠깐 생각한다."),narration("아라는 대답을 기다리지 않고 나무 쪽을 본다."),dialogue("아라","아까보다 빛이 조금 바뀌었어요."),narration("그녀는 주인공이 어떤 사람이었는지 모른다. 지금 여기서 무엇을 보고 있는지만 안다.")],branches:{
    day13_intro_photo_beginner:[dialogue("주인공","사진은 잘 몰라요. 오늘 한번 찍어 보려고요."),dialogue("아라","저도 못 건질 때 많아요.")],
    day13_intro_reseeing_familiar:[dialogue("주인공","요즘 익숙한 것도 다시 보고 있어요."),dialogue("아라","그럼 볼 게 많겠네요.")],
    day13_intro_fresh_air:[dialogue("주인공","그냥 바람 쐬러 왔어요."),narration("아라는 더 자세한 사정을 요구하지 않고 빛이 드는 길을 가리킨다.")]
  }},
  {number:7,title:"모르는 사람이 편한 이유",routeBranches:{
    ara:[dialogue("아라","휴대폰으로 찍어요?"),narration("주인공이 휴대폰을 보이자 아라는 그걸로 충분하다고 한다."),dialogue("주인공","좋은 걸 쓰면 더 잘 찍히지 않아요?"),dialogue("아라","더 무거워지긴 해요."),narration("아라가 자기 카메라를 조금 들어 보인다."),dialogue("아라","이거 들고도 망한 거 많아요."),narration("아라는 장비를 주인공 손에 억지로 쥐여 주지 않는다."),dialogue("아라","어디를 찍고 싶어요?"),dialogue("주인공","저 빛이요."),dialogue("아라","그럼 제가 아니라 빛을 보세요."),narration("주인공은 설명을 기다리며 그녀를 보고 있었다는 걸 알아차리고 웃는다.")],
    solo:[narration("주인공은 자기가 찍은 사진 세 장을 나란히 본다. 설명이 없으면 무엇을 찍으려 했는지 자기도 잘 모르겠다."),narration("제목 대신 눈이 먼저 갔던 곳을 다시 찾는다. 그늘의 끝, 컵에 생긴 반짝임, 옷걸이에 걸린 소매."),narration("아직 잘 찍지는 못해도 무엇을 보았는지는 말할 수 있다.")]
  }},
  {number:8,title:"한 발 옆으로",choiceNumber:4,steps:[narration("주인공은 같은 장면을 다시 본다. 기다릴지, 자리를 바꿀지, 지금 사진을 남길지 정할 수 있다.")],branches:{
    day13_wait_same_place:[narration("같은 자리에서 기다린다. 지나가는 사람이 화면에서 빠지고 그림자가 옮겨 간다."),dialogue("아라","기다리니까 달라지네요.")],
    day13_move_one_step:[narration("한 발 옆으로 가자 나무 사이의 빈틈이 보인다."),dialogue("아라","그쪽은 못 봤네요."),narration("주인공은 칭찬인지 사실인지 생각하다가 셔터를 누른다.")],
    day13_keep_imperfect_photo:[narration("주인공은 고치지 않고 사진을 그대로 남긴다."),dialogue("아라","나중에 왜 찍었지 싶으면 오늘이 생각날 수도 있고."),narration("누가 좋아한다고 말하지 않아도 사진은 휴대폰 안에 남는다.")]
  },soloBranches:{
    day13_wait_same_place:[narration("같은 자리에서 기다리자 그늘의 끝이나 컵의 반짝임이 조금 움직인다.")],
    day13_move_one_step:[narration("한 발 옆으로 가거나 의자를 옮겨 보자 방금 보이지 않던 빈틈이 생긴다.")],
    day13_keep_imperfect_photo:[narration("고치지 않은 사진도 그대로 남긴다. 누가 좋아한다고 말하지 않아도 사진은 휴대폰 안에 있다.")]
  }},
  {number:9,title:"새가 없는 사진",routeBranches:{
    ara:[narration("서울숲 길 위로 작은 새가 내려앉는다. 주인공이 급히 휴대폰을 들지만 셔터 전에 새가 날아간다."),narration("사진에는 빈 길만 있다."),dialogue("아라","있었죠?"),dialogue("주인공","네."),dialogue("아라","그럼 됐네요."),dialogue("주인공","사진에는 없는데요."),dialogue("아라","저도 봤어요. 두 명이면 새가 있었다고 해도 되지 않을까요."),narration("주인공이 웃는다.")],
    neighborhood:[narration("동네 길에 내려앉은 새는 셔터 전에 날아간다. 주인공은 혼자 빈 길을 본다."),narration("없어진 것을 다시 찍으려 한참 카메라를 들고 있다가 내린다. 사진에 없다고 그 순간까지 없었던 것은 아니다.")],
    home:[narration("햇빛이 옮겨 가 컵의 반짝임이 사라진다."),narration("주인공은 다시 찍으려 카메라를 들고 있다가 내린다. 사진에 없다고 그 순간까지 없었던 것은 아니다.")]
  }},
  {number:10,title:"앉아 있는 사람",choiceNumber:5,routeBranches:{
    ara:[narration("주인공은 잠깐 쉬고 싶어진다. 가까운 벤치가 보이고, 아라는 조금 더 안쪽을 보고 오려는 것 같다.")],
    neighborhood:[narration("주인공은 동네 벤치 앞에서 쉬거나 조금 더 걷거나 귀가할 때를 정한다.")],
    home:[narration("주인공은 창가 의자에서 쉬거나 다른 자리를 찍거나 오늘 촬영을 끝낼 수 있다.")]
  },branches:{
    day13_rest_here:[dialogue("주인공","저는 잠깐 앉아 있을게요."),dialogue("아라","좋아요. 저는 저쪽만 보고 올게요."),narration("아라는 허락받듯 기다리지 않고 자기 길을 잠깐 간다.")],
    day13_walk_then_rest:[dialogue("주인공","조금만 더 같이 보고 쉬고 싶어요."),narration("아라는 멀리 가지 않는 쪽을 가리킨다. 둘은 주인공이 편한 거리까지만 걷고 멈춘다.")],
    day13_leave_now:[dialogue("주인공","오늘은 여기까지 보고 돌아갈까 해요."),dialogue("아라","사진 잘 남겨요."),narration("짧은 인사 뒤 아라가 떠난다. 그녀가 떠났다고 오늘 사진이 실패한 것은 아니다.")]
  },soloBranches:{
    day13_rest_here:[narration("주인공은 자기가 정한 자리에서 잠깐 쉰다.")],
    day13_walk_then_rest:[narration("조금 더 걷거나 다른 자리를 찍고, 편한 거리에서 멈춘다.")],
    day13_leave_now:[narration("오늘은 여기까지로 정한다. 사진이 적다고 하루가 실패한 것은 아니다.")]
  }},
  {number:11,title:"돌아온 사람과 돌아오지 않은 사람",routeBranches:{
    araContinue:[narration("아라가 다른 길을 보고 돌아온다. 주인공을 보자 손을 가볍게 든다."),dialogue("아라","아직 계시네요."),dialogue("주인공","기다린 건 아니고요."),narration("말하고 나니 급히 설명한 것 같아 주인공이 웃는다. 아라도 웃는다."),dialogue("아라","저도 다시 만나려고 온 건 아니었어요. 길이 이쪽이라."),narration("서로의 말이 조금 닮았다. 아라는 벤치 반대편 빈자리에 앉고 카메라는 무릎 위에 놓는다."),narration("처음보다 말하지 않는 시간이 편해진다.")],
    earlyExit:[stage("나의 방 / 오후"),narration("주인공은 집에 도착해 가방을 내려놓는다. 아라의 이름은 기억하지만 연락처는 없다."),narration("그 짧은 만남을 꼭 이어야 한다고 생각하지 않으니 조금 가벼워진다.")],
    noAra:[narration("주인공은 자기가 정한 만큼 쉬고 사진을 본다. 오늘 만난 새 사람의 이름은 없다."),narration("그 대신 자기 눈이 오래 머문 것이 조금 더 분명해졌다.")]
  }},
  {number:12,title:"여행을 일로 하는 사람",routeBranches:{
    araContinue:[dialogue("아라","여행 사진을 찍어요."),dialogue("주인공","좋은 데 많이 가시겠네요."),dialogue("아라","좋은 데 가서 일해요."),dialogue("주인공","아."),dialogue("아라","재밌긴 한데, 놀러 간 사람이 제일 부러울 때도 있어요."),dialogue("주인공","오늘도 일이에요?"),dialogue("아라","오늘은 아니에요. 그래서 새 없는 사진 찍어도 돼요."),narration("둘이 웃는다."),narration("아라는 지난 촬영에서 일출을 기다리다 구름만 보고 돌아온 이야기를 한다. 머릿속에서 정한 장면은 없었다."),dialogue("주인공","그럼 속상하지 않아요?"),dialogue("아라","속상하죠. 그래서 아침을 맛있게 먹었어요.")],
    solo:[narration("주인공은 사진 설명을 검색하다가 휴대폰을 내려놓는다. 더 잘 찍는 법을 읽기 시작하면 오늘 본 것보다 못한 이유만 많이 알게 될 것 같다."),narration("사진 중 하나를 고르고 제목을 붙인다."),line("note","오늘 여기."),narration("그 정도면 지금은 충분할 것 같다.")]
  }}
];

const CHOICE_LABELS=new Map(DAY13_V3_CHOICES.slice(0,5).flatMap(choice=>choice.options.map(option=>[option.id,option.label])));

export const DAY13_V3_PLAYABLE_SCRIPT_01_12=Object.freeze(scenes.map(scene=>Object.freeze({
  ...scene,id:`D13V3_S${String(scene.number).padStart(2,"0")}`,
  steps:freezeSteps(scene.steps??[]),
  branches:Object.freeze(Object.entries(scene.branches??{}).map(([key,steps])=>Object.freeze({key,label:CHOICE_LABELS.get(key)??key,steps:freezeSteps(steps)}))),
  soloBranches:Object.freeze(Object.entries(scene.soloBranches??{}).map(([key,steps])=>Object.freeze({key,label:CHOICE_LABELS.get(key)??key,steps:freezeSteps(steps)}))),
  routeBranches:Object.freeze(Object.entries(scene.routeBranches??{}).map(([key,steps])=>Object.freeze({key,steps:freezeSteps(steps)})))
})));

const flagsOf=state=>state?.storyFlags??{};
const routeOf=flags=>flags.day13V3OutingRoute??(flags.day13V3Choice1==="day13_go_seoul_forest"?"SEOUL_FOREST":flags.day13V3Choice1==="day13_walk_neighborhood"?"NEIGHBORHOOD":"HOME");
const araMet=flags=>flags.day13V3AraMet??routeOf(flags)==="SEOUL_FOREST";
const earlyExit=flags=>flags.day13V3AraEarlyExit??flags.day13V3Choice5==="day13_leave_now";

function routeKey(scene,flags){
  const route=routeOf(flags),met=araMet(flags),left=earlyExit(flags);
  if(scene.number===4)return route==="SEOUL_FOREST"?"seoul":route==="NEIGHBORHOOD"?"neighborhood":"home";
  if(scene.number===5)return met?"seoul":"solo";
  if(scene.number===7)return met?"ara":"solo";
  if(scene.number===9)return met?"ara":route==="NEIGHBORHOOD"?"neighborhood":"home";
  if(scene.number===10)return met?"ara":route==="NEIGHBORHOOD"?"neighborhood":"home";
  if(scene.number===11)return !met?"noAra":left?"earlyExit":"araContinue";
  if(scene.number===12)return met&&!left?"araContinue":"solo";
  return null;
}

export function getDay13V3PlayableScene01To12(state,sceneNumber){
  const scene=DAY13_V3_PLAYABLE_SCRIPT_01_12.find(item=>item.number===sceneNumber);
  if(!scene)throw new Error(`UNKNOWN_DAY13_V3_SCENE_${sceneNumber}`);
  const flags=flagsOf(state),met=araMet(flags);
  if(scene.conditional==="ara"&&!met)return Object.freeze({...scene,omitted:true,selectedBranches:Object.freeze([]),steps:Object.freeze([])});
  const steps=[...scene.steps],selected=[];
  const routeKeyValue=routeKey(scene,flags),routeBranch=scene.routeBranches.find(branch=>branch.key===routeKeyValue);
  if(routeBranch){selected.push(routeKeyValue);steps.push(...routeBranch.steps);}
  if(scene.choiceNumber){
    const choiceId=flags[`day13V3Choice${scene.choiceNumber}`];
    steps.push(Object.freeze({type:"choiceCue",choiceNumber:scene.choiceNumber}));
    const source=!met&&scene.soloBranches.length?scene.soloBranches:scene.branches;
    const branch=source.find(item=>item.key===choiceId);
    if(branch){selected.push(choiceId);steps.push(...branch.steps);}
  }
  return Object.freeze({...scene,omitted:false,selectedBranches:Object.freeze(selected),steps:Object.freeze(steps)});
}

export function validateDay13V3PlayableScript01To12(){
  const expectedChoiceIds=DAY13_V3_CHOICES.slice(0,5).flatMap(choice=>choice.options.map(option=>option.id));
  const branchKeys=new Set(DAY13_V3_PLAYABLE_SCRIPT_01_12.flatMap(scene=>[...scene.branches,...scene.soloBranches].map(branch=>branch.key)));
  return DAY13_V3_PLAYABLE_SCRIPT_01_12.length===12&&DAY13_V3_PLAYABLE_SCRIPT_01_12.every((scene,index)=>scene.number===index+1)&&(DAY13_V3_PLAYABLE_SCRIPT_01_12[5].conditional==="ara")&&expectedChoiceIds.every(id=>branchKeys.has(id));
}
