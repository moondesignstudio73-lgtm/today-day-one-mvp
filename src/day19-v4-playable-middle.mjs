import {DAY19_V4_SOURCE_SCENES} from './day19-v4-source-registry.mjs';
import {day19V4SourceRef} from './day19-v4-source-selection.mjs';
import {getDay19V4Options, validateDay19V4} from './day19-v4-state-contract.mjs';

const ref=(scene,line)=>day19V4SourceRef(scene,line);
const mono=(scene,text)=>({type:'monologue',text,source:ref(scene,text)});
const directedMono=(scene,text,exact)=>({type:'monologue',text,origin:'source-directed',source:ref(scene,exact)});
const act=(scene,exact,status,actionLabel)=>({type:'stageAction',status,actionLabel,source:ref(scene,exact)});
const quoted=(scene,exact,device=null)=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY19_DIALOGUE_LINE_INVALID:${scene}:${exact}`);const speaker=match[1]==='주인공'?'나':match[1];return {type:device?'message':'dialogue',speaker,...(device?{sender:speaker,device}:{}),text:match[2],source:ref(scene,exact)}};
const directedDialogue=(scene,speaker,text,exact,device=null)=>({type:device?'message':'dialogue',speaker,...(device?{sender:speaker,device}:{}),text,origin:'source-directed',source:ref(scene,exact)});
const scene=(number,location,time,character=null)=>({type:'sceneDirection',number,title:DAY19_V4_SOURCE_SCENES[number-1].title,location,time,character});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,prompt:DAY19_V4_SOURCE_SCENES.flatMap(item=>item.choices).find(item=>item.number===number).title,options:getDay19V4Options(chapter)});
const last=chapter=>chapter.choices.at(-1)?.id??'';
const shared=chapter=>chapter.input.sharedPlanningEligible;

function scenes6To8(chapter){
  const steps=[scene(6,'home-afternoon','afternoon')];
  if(shared(chapter))steps.push(act(6,'점심 무렵, 하은이 답했다.','haeun-reply-arrive','점심 무렵 하은의 답장이 도착함'),
    quoted(6,'**하은** “나는 아침부터 너무 일찍 움직이지 않는 게 좋아. 그리고 중간에 아무것도 안 하는 시간이 있었으면 좋겠어.”','phone'),
    act(6,'나는 내 계획을 봤다.','travel-plan-review','작성한 여행 계획을 다시 봄'),
    mono(6,'아침 출발은 빨랐다. 아무것도 안 하는 시간에는 카페 이름이 적혀 있었다. 카페 뒤에는 다음 장소까지 걸리는 시간이 붙었다.'),
    quoted(6,'**주인공** “카페에서 쉬는 건?”','phone'),quoted(6,'**하은** “좋아. 그런데 시간 맞춰서 꼭 나와야 하는 카페 말고.”','phone'),
    act(6,'나는 웃었다.','haeun-rest-laugh','빽빽한 휴식 계획을 보고 웃음'),quoted(6,'**하은** “왜?”','phone'),quoted(6,'**주인공** “내가 방금 딱 그걸 써 놔서.”','phone'));
  else if(chapter.input.contactAllowed)steps.push(quoted(6,'**하은** “어제 얘기는 아직 생각 중이야. 여행 계획은 오늘 같이 못 보겠어.”','phone'),
    mono(6,'화면 속 방이 갑자기 쓸모없어진 것 같았다. 하지만 사진이 달라진 건 아니었다. 내가 그 사진으로 듣고 싶었던 답이 있었다.'),
    quoted(6,'**주인공** “알겠어. 네가 같이 간다고 생각하고 정하지 않을게.”','phone'),
    mono(6,'하은은 고맙다는 말 대신 “응”이라고 답했다. 오늘은 그 정도가 가능했다.'));
  else steps.push(mono(6,'나는 혼자 가는 하루를 생각했다. 누구의 취향도 맞히지 않아도 되니 쉬울 줄 알았는데, 이제 내가 뭘 하고 싶은지 물어야 했다. 그 질문도 저절로 답이 나오지는 않았다.'));

  steps.push(scene(7,shared(chapter)?'corner-cafe':'home-afternoon','afternoon',shared(chapter)?'girlfriend':null));
  if(shared(chapter))steps.push(act(7,'각자 화면을 보며 후보 하나씩만 공유했다. 하은이 “어느 사진?”이라고 세 번 묻자 나는 한 번에 여러 장 보내는 걸 그만뒀다.','call-share-one-candidate','통화에서 후보를 한 장씩 공유함'),
    quoted(7,'**하은** “사진 여행을 먼저 다녀왔어.”','call'),quoted(7,'**주인공** “짐 없이.”','call'),quoted(7,'**하은** “눈은 좀 바쁜데.”','call'));
  else steps.push(mono(7,'나는 음료를 골라 앉거나 집에서 물을 마셨다. 하은이 여기 있다면 할 말을 상상해서 그녀의 동의로 쓰지는 않았다. 화면 한쪽에 ‘나’라고 적었다. 오늘 계획을 보는 사람이 한 명이라는 뜻이었다.'));

  steps.push(scene(8,shared(chapter)?'corner-cafe':'home-afternoon','afternoon',shared(chapter)?'girlfriend':null));
  if(shared(chapter))steps.push(quoted(8,'**하은** “너 어느 정도까지 생각했어?”','call'),
    mono(8,'나는 쓸 수 있는 범위를 말했다. 숫자를 더 넉넉하게 부르지는 않았다.'),mono(8,'하은도 자기가 쓸 수 있는 범위를 말했다. 내 금액과 같을 필요는 없었다.'),
    quoted(8,'**주인공** “나는 내가 준비해 주고 싶었어.”','call'),quoted(8,'**하은** “그 마음은 좋아. 그런데 내 돈도 내가 정하고 싶어.”','call'),
    act(8,'그녀는 내 화면에 손을 대지 않고, 내가 적은 줄을 가리켰다.','budget-line-point','하은이 화면에 손대지 않고 예산 줄을 가리킴'),
    quoted(8,'**하은** “이거 네가 다 낸다고 하면, 나는 좋은지 말하기도 조금 어려울 것 같아.”','call'),quoted(8,'**주인공** “왜?”','call'),
    quoted(8,'**하은** “마음에 안 드는 부분이 있어도, 네가 다 준비하고 다 낸 거니까 고맙다고 해야 될 것 같잖아.”','call'));
  else steps.push(directedMono(8,'생활비, 내가 꼭 쓰고 싶은 한 가지, 지금의 내 범위를 따로 보았다.','생활비를 먼저 남긴다 / 내가 꼭 쓰고 싶은 한 가지를 정한다 / 일단 큰 금액부터 맞춰 보려 한다.'));
  return [...steps,choice(chapter,5)];
}

function choice5Reaction(chapter){
  const id=last(chapter);
  if(!shared(chapter)){
    if(id.includes('_solo_separate_ranges'))return [directedMono(8,'생활비를 먼저 남겼다.','생활비를 먼저 남긴다 / 내가 꼭 쓰고 싶은 한 가지를 정한다 / 일단 큰 금액부터 맞춰 보려 한다.')];
    if(id.includes('_solo_offer_more'))return [directedMono(8,'내가 꼭 쓰고 싶은 한 가지를 정했다.','생활비를 먼저 남긴다 / 내가 꼭 쓰고 싶은 한 가지를 정한다 / 일단 큰 금액부터 맞춰 보려 한다.')];
    return [act(8,'마지막을 고르면 나는 식비를 지우다가 멈췄다. 여행 뒤에 배고픈 내가 생기는 계획은 아직 완성된 게 아니었다. 생활비를 돌려놓거나 이번 여행을 미루었다.','living-cost-restored','지우려던 식비를 되돌리고 여행 범위를 다시 둠')];
  }
  if(id.endsWith('_separate_ranges'))return [quoted(8,'**하은** “응. 모자란다고 네가 내 몫까지 바로 채우지 말고.”','call'),quoted(8,'**주인공** “그럼 계획을 고치는 쪽도 같이.”','call'),quoted(8,'**하은** “그게 좋아.”','call')];
  if(id.endsWith('_offer_more'))return [quoted(8,'**하은** “말해도 돼. 내가 받겠다고 하는지는 듣고 정하고.”','call'),mono(8,'나는 내가 정말 고르고 싶은 한 끼나 숙소의 이유를 말했다. 하은은 받아들이거나 다른 쪽이 좋다고 했다. 선물하고 싶은 마음과 상대가 받아야 하는 의무 사이에 간격이 생겼다.')];
  return [act(8,'하은은 나를 봤다.','haeun-budget-look','하은이 화면에서 시선을 들어 바라봄'),quoted(8,'**하은** “나한테 생각하지 말라는 말처럼 들려.”','call'),quoted(8,'**주인공** “편하게 해 주고 싶었던 건데.”','call'),quoted(8,'**하은** “나는 같이 아는 게 더 편할 수도 있어.”','call'),act(8,'나는 화면을 하은 쪽으로 돌렸다. 돈을 숨겨야 멋진 사람일 것 같다는 마음까지 한 번에 없어지지는 않았다.','budget-screen-turn','예산 화면을 하은이 볼 수 있게 돌림'),directedMono(8,'돈을 숨겨야 멋진 사람일 것 같다는 마음까지 한 번에 없어지지는 않았다.','나는 화면을 하은 쪽으로 돌렸다. 돈을 숨겨야 멋진 사람일 것 같다는 마음까지 한 번에 없어지지는 않았다.')];
}

function scene9Opening(chapter){
  const steps=[scene(9,shared(chapter)?'corner-cafe':'home-afternoon','afternoon',shared(chapter)?'girlfriend':null)];
  if(shared(chapter))steps.push(act(9,'내가 만든 이동표를 보던 하은이 조용히 웃었다.','haeun-itinerary-laugh','하은이 이동표를 보며 조용히 웃음'),quoted(9,'**주인공** “왜?”'),quoted(9,'**하은** “우리 이거 다 하면 여행 후기 쓸 때 ‘성취했다’고 쓸 것 같아.”'),quoted(9,'**주인공** “좋은 말 아니야?”'),quoted(9,'**하은** “나는 쉬었다고 쓰고 싶은데.”'),
    act(9,'나는 출발 시간을 다시 봤다. 아침부터 다음 장소를 향해 움직이는 날이었다.','departure-time-review','이른 출발부터 이어진 이동표를 다시 봄'),act(9,'하은이 손가락으로 빈칸 하나를 짚었다.','empty-slot-point','하은이 일정의 빈칸을 짚음'),quoted(9,'**하은** “여기는 뭐야?”'),quoted(9,'**주인공** “자유 시간.”'),quoted(9,'**하은** “뒤에 왜 화살표가 있어?”'),quoted(9,'**주인공** “다음 장소로 가는…….”'),quoted(9,'**하은** “자유가 짧네.”'),mono(9,'나는 결국 웃었다. 내가 힘들게 만든 계획이라 놀리면 서운할 줄 알았는데, 하은이 같이 들여다보고 있어서 덜 서운했다.'));
  else steps.push(mono(9,'나는 계획을 소리 내어 읽었다. 식사 뒤에 바로 이동, 산책 뒤에 바로 이동. 읽기만 해도 목이 바빴다. 같은 세 선택 중 하나로 줄였다. 혼자 간다고 쉴 사람까지 없는 건 아니었다.'));
  return [...steps,choice(chapter,6)];
}

function choice6Reaction(chapter){
  const id=last(chapter);
  if(!shared(chapter))return [directedMono(9,id.endsWith('_drop_place')?'장소 하나를 뺐다.':id.endsWith('_later_departure')?'출발을 늦췄다.':'꼭 보고 싶은 하나만 남겼다.','나는 계획을 소리 내어 읽었다. 식사 뒤에 바로 이동, 산책 뒤에 바로 이동. 읽기만 해도 목이 바빴다. 같은 세 선택 중 하나로 줄였다. 혼자 간다고 쉴 사람까지 없는 건 아니었다.')];
  if(id.endsWith('_drop_place'))return [act(9,'지우자 빈칸이 생겼다. 하은은 그 칸에 다른 장소를 넣지 않았다.','itinerary-place-remove','일정에서 장소 하나를 지우고 빈칸으로 둠'),quoted(9,'**주인공** “그냥 비워 둬?”'),quoted(9,'**하은** “응. 그날 우리도 뭔가 생각하겠지.”')];
  if(id.endsWith('_later_departure'))return [mono(9,'밤의 일정도 함께 줄어들었다. 나는 아쉬워했지만 하은은 “아쉽다고 말해도 돼”라고 했다. 양보한 뒤에 아무렇지 않은 척까지 해야 하는 것은 아니었다.')];
  const exact='나는 바다를 보고 싶다고 했다. 하은은 “그럼 바다에 있을 시간을 먼저 남기자”라고 했다.';
  return [directedDialogue(9,'나','나는 바다를 보고 싶어.',exact),directedDialogue(9,'하은','그럼 바다에 있을 시간을 먼저 남기자.',exact)];
}

function scenes10And11(chapter){
  const steps=[scene(10,shared(chapter)?'corner-cafe':'home-afternoon','afternoon',shared(chapter)?'girlfriend':null),act(10,'창문이 큰 방 사진으로 돌아왔다.','window-room-photo-return','창문이 큰 방 후보로 돌아감')];
  if(shared(chapter))steps.push(mono(10,'하은은 오래 보고 있었다. 나는 이번에는 먼저 설명하지 않았다.'),quoted(10,'**하은** “여기서 늦잠 자면 좋겠다.”'),quoted(10,'**주인공** “바다 보려고 고른 건데.”'),quoted(10,'**하은** “눈 감으면 바다 안 보여?”'),quoted(10,'**주인공** “안 보이지.”'),quoted(10,'**하은** “그럼 눈 뜨고 나서 보면 되겠다.”'),act(10,'나는 웃었다.','late-sleep-laugh','하은의 늦잠 이야기에 웃음'),quoted(10,'**주인공** “아침 풍경도 좋을 것 같아서.”'),quoted(10,'**하은** “너는 일찍 보고 다시 와도 돼. 내가 안 일어난다고 같이 간 의미가 없어지는 건 아니니까.”'),mono(10,'나는 잠깐 사진 속 두 의자를 봤다. 내 상상 속 하은은 내가 바다를 볼 때 함께 보고, 내가 웃을 때 함께 웃었다.'),mono(10,'진짜 하은은 늦게 일어나고 싶다고 말했다.'),quoted(10,'**주인공** “같이 여행 가도 계속 같이 할 필요는 없구나.”'),quoted(10,'**하은** “같이 있고 싶어서 가는 건 맞는데, 내가 네 하루를 따라가려고 가는 건 아니야.”'),act(10,'그녀는 내 표정을 보고 말을 조금 누그러뜨렸다.','haeun-soften','하은이 표정을 보고 말투를 누그러뜨림'),quoted(10,'**하은** “너도 내 늦잠 옆에서 아침을 다 기다릴 필요 없고.”'));
  else steps.push(mono(10,'사진 속 두 의자를 보다가 나 혼자 한쪽에 앉는 모습을 떠올렸다. 남은 의자를 꼭 누군가로 채워야 하는 것은 아니었다. 혼자라면 방을 작게 고를 수도 있고, 같은 방을 고르고 넓게 쓸 수도 있었다. 예산이 허락하는지 다시 봤다. 감정이 허락한다고 가격이 줄지는 않았다.'));
  steps.push(scene(11,shared(chapter)?'corner-cafe':'home-afternoon','afternoon',shared(chapter)?'girlfriend':null));
  if(shared(chapter))steps.push(act(11,'하은은 내가 저장해 둔 후보 수를 보고 놀랐다.','haeun-candidate-count','하은이 저장된 후보 수를 확인함'),quoted(11,'**하은** “이거 언제 다 봤어?”'),quoted(11,'**주인공** “조금씩.”'),quoted(11,'**하은** “조금이 엄청 여러 번이네.”'));
  steps.push(mono(11,'나는 웃으려다 말았다. 사실 아침을 먹다가도 보고, 쉬다가도 보고, 민호에게 답한 뒤에도 다시 봤다. 여행을 가기 전에 여행을 잘 준비하는 사람이 되려고 바빴다.'),choice(chapter,7));return steps;
}

function choice7Reaction(chapter){
  const id=last(chapter);
  if(!shared(chapter))return [mono(11,'나는 같은 세 마음 중 무엇이 큰지 혼자 생각했다. 하은이 고마워할 거라고 답을 대신 쓰지는 않았다. 내 마음을 알게 된 것과 그녀의 동의를 얻은 것은 별개였다.')];
  if(id.endsWith('_good_day'))return [quoted(11,'**하은** “그 마음은 받았어.”'),mono(11,'나는 조금 안심했다.'),quoted(11,'**하은** “그런데 하루는 같이 만드는 게 좋겠어. 내가 거기에 늦잠도 넣고 싶으니까.”')];
  if(id.endsWith('_show_capacity'))return [act(11,'하은은 잠시 말이 없었다.','haeun-pause','하은이 잠시 말없이 생각함'),quoted(11,'**하은** “네가 나한테 해 주는 게 없다고 생각했어?”'),quoted(11,'**주인공** “늘 받는 기분이 들 때가 있어.”'),quoted(11,'**하은** “내가 고마운 게 생길 때마다 큰 걸로 돌려줘야 하면, 나도 너한테 작은 걸 해 주기 어려워.”'),act(11,'나는 손가락으로 컵을 조금 돌렸다. 그녀가 내 고마움을 거절하는 건 아니라는 걸 천천히 들었다.','cup-turn','컵을 천천히 돌리며 하은의 말을 들음'),directedMono(11,'그녀가 내 고마움을 거절하는 건 아니라는 걸 천천히 들었다.','나는 손가락으로 컵을 조금 돌렸다. 그녀가 내 고마움을 거절하는 건 아니라는 걸 천천히 들었다.')];
  return [directedDialogue(11,'하은','편한 기억이 하나 더 생길 수는 있겠지','평온한 사이라면 하은은 “편한 기억이 하나 더 생길 수는 있겠지”라고 했다.')];
}

function scene12(chapter){
  const steps=[scene(12,shared(chapter)?'corner-cafe':'home-afternoon','afternoon',shared(chapter)?'girlfriend':null)];
  if(!shared(chapter))return [...steps,mono(12,'나는 일정에 빈칸을 하나 남겼다. 그 시간에 외롭다면 외로울 수도 있고, 편하면 편할 수도 있었다. 둘 중 어느 쪽이어야 성공한 여행인지 미리 정하지 않았다.'),{type:'middleBoundary',nextScene:13}];
  return [...steps,quoted(12,'**하은** “나는 이 시간에 아무 계획도 없는 게 좋아.”'),quoted(12,'**주인공** “그게 제일 좋아?”'),quoted(12,'**하은** “지금은.”'),mono(12,'나는 조금 웃다가 솔직하게 말했다.'),quoted(12,'**주인공** “제일 오래 고른 건 다른 데인데.”'),quoted(12,'**하은** “알아. 그래서 조금 미안한데, 그래도 여기.”'),act(12,'그녀는 빈칸을 가리켰다.','empty-slot-point-again','하은이 남겨 둔 빈칸을 가리킴'),act(12,'나는 그 칸을 지우지 않았다.','empty-slot-keep','빈칸을 지우지 않고 남김'),quoted(12,'**주인공** “그럼 여기서 뭐 할지는?”'),quoted(12,'**하은** “그때 생각하자.”'),quoted(12,'**주인공** “아무것도 안 할 수도 있고.”'),quoted(12,'**하은** “응. 같이 멍하니 있을 수도 있고.”'),mono(12,'순간, 나는 사진 속 좋은 방보다 하은과 아무 계획도 없이 앉아 있는 모습을 더 오래 상상했다. 그녀가 휴대전화를 보다가 나를 보고, 내가 별말 없이 웃는 정도.'),quoted(12,'**주인공** “그거 좋다.”'),quoted(12,'**하은** “지금은 뭐 해야 하는지 안 물어보네.”'),quoted(12,'**주인공** “안 하는 게 뭔지 조금 알겠어서.”'),act(12,'나는 그녀 쪽으로 몸을 조금 기울였다. 화면을 보기 위해서만은 아니었다.','lean-toward-haeun','화면이 아니라 하은 쪽으로 조금 기울임'),act(12,'하은도 화면 대신 나를 봤다.','haeun-look-back','하은도 화면 대신 마주 봄'),quoted(12,'**하은** “왜?”'),quoted(12,'**주인공** “지금도 잠깐 아무것도 안 하려고.”'),act(12,'그녀는 웃었다. 나는 말을 더하지 않았다.','quiet-shared-smile','하은이 웃는 동안 말을 더하지 않음'),{type:'middleBoundary',nextScene:13}];
}

export function getDay19V4PlayableMiddle(chapter){
  if(!validateDay19V4(chapter))throw new Error('DAY19_INVALID_SAVE');
  if(chapter.phase==='budget')return scenes6To8(chapter);
  if(chapter.phase==='schedule_trim')return [...choice5Reaction(chapter),...scene9Opening(chapter)];
  if(chapter.phase==='motive')return [...choice6Reaction(chapter),...scenes10And11(chapter)];
  if(chapter.phase==='companion_wait')return [...choice7Reaction(chapter),...scene12(chapter)];
  return [{type:'middleBoundary',nextScene:13}];
}
