import {DAY22_V4_SOURCE_SCENES} from './day22-v4-source-registry.mjs';
import {day22V4SourceRef} from './day22-v4-source-selection.mjs';
import {getDay22V4Options,validateDay22V4} from './day22-v4-state-contract.mjs';

const ref=(scene,line)=>day22V4SourceRef(scene,line);
const mono=(scene,text)=>({type:'monologue',text,source:ref(scene,text)});
const groundedMono=(scene,text,exact)=>({type:'monologue',text,source:ref(scene,exact)});
const act=(scene,exact,status,actionLabel)=>({type:'stageAction',status,actionLabel,source:ref(scene,exact)});
const quoted=(scene,exact)=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY22_DIALOGUE_LINE_INVALID:${scene}:${exact}`);return {type:'dialogue',speaker:match[1]==='주인공'?'나':match[1],text:match[2],source:ref(scene,exact)};};
const location=(number,route)=>route==='BUSAN_TRIP'?(number===1?'travel-meeting':number<4?'train':'busan-station'):(number===1?'seoul-meeting':number<4?'seoul-transit':'seoul-start');
const scene=(number,chapter)=>({type:'sceneDirection',number,title:DAY22_V4_SOURCE_SCENES[number-1].title,location:location(number,chapter.input.route),time:'morning',character:'girlfriend'});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,variant:'TRAVEL',prompt:DAY22_V4_SOURCE_SCENES.flatMap(item=>item.choices).find(item=>item.number===number&&item.variant==='TRAVEL').title,options:getDay22V4Options(chapter)});
const last=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??'';

function scene1(chapter){
  const steps=[scene(1,chapter)];
  if(chapter.input.route==='BUSAN_TRIP')steps.push(
    mono(1,'출발할 시간을 다시 확인했다.'),
    mono(1,'가방을 들어 보니 어제 닫았을 때보다 무거운 것 같았다. 밤사이 물건이 늘었을 리는 없었다.'),
    mono(1,'하은은 만나기로 한 곳에서 나를 보고, 내 가방을 봤다.'),
    quoted(1,'**하은** “혹시 안에 사람 있어?”'),quoted(1,'**주인공** “없어.”'),quoted(1,'**하은** “그럼 왜 그렇게 많아?”'),quoted(1,'**주인공** “혹시 필요할까 봐.”'),quoted(1,'**하은** “혹시가 몇 명이야?”'),
    act(1,'나는 웃다가 가방을 내려놓았다.','set-bag-down','가방을 내려놓고 무게를 다시 확인함'));
  else {const exact='가방은 작거나 없었다. 하은과 만났다면 그녀가 “오늘은 혹시가 한 명도 안 왔네”라고 농담할 수 있었다. 짐 농담을 나눈 적이 없다면 그냥 가볍게 왔다고 했다.';steps.push(groundedMono(1,'가방은 가벼웠다.',exact));}
  return [...steps,choice(chapter,1)];
}

function reaction1(chapter){const id=last(chapter);
  if(id.endsWith('_remove_now'))return [act(1,'아직 집에서 출발하기 전이면 필요 없는 것을 내려놓았다. 이미 만남 장소라면 물건을 길에 두고 가지 않았다. 가방을 다시 정리해 들기 편하게 하고, 남길 수 있는 것은 안전하게 처리할 수 있을 때만 줄였다.','trim-baggage-safely','버릴 수 없는 물건은 두지 않고 가방을 안전하게 다시 정리함'),mono(1,'하은이 자기 짐을 보며 말했다.'),quoted(1,'**하은** “나도 하나는 빼도 됐을 것 같아.”'),quoted(1,'**주인공** “혹시 한 명?”'),quoted(1,'**하은** “응. 조용히 데려왔어.”')];
  if(id.endsWith('_carry_own'))return [quoted(1,'**하은** “혼자 끝까지 버티겠다는 뜻이면 싫고.”'),quoted(1,'**주인공** “힘들면 말할게.”'),quoted(1,'**하은** “그럼 됐어.”')];
  return [mono(1,'우리는 오늘 꼭 보고 싶은 하나를 다시 확인했다. 가방이 무겁다는 이유로 이미 편한 하은에게 대신 들게 하지는 않았다.')];
}

function scenes2And3(chapter){const busan=chapter.input.route==='BUSAN_TRIP',steps=[scene(2,chapter)];
  if(busan)steps.push(mono(2,'우리는 각자 확인한 이동편을 다시 봤다. 내가 표를 모두 들고 지시하는 사람이 되지 않으려고 하은에게도 시간을 물었다.'),quoted(2,'**주인공** “우리가 지금 보는 시간이 같은 거지?”'),quoted(2,'**하은** “응. 지금은 같은 여행 중이야.”'),mono(2,'나는 웃었다. 긴장해서 확인한 티가 났다.'),mono(2,'급하게 뛰어야 할 상황이 생기면 그대로 뛰어가는 계획은 세우지 않았다. 여유를 두고 움직였고, 몸이 불편해지면 멈추고 가능한 대안을 봐야 했다. 내가 멀쩡한 여행 동반자임을 출발 전부터 증명할 필요는 없었다.'),act(2,'자리에 앉고 가방을 정리하자 어깨가 조금 가벼워졌다.','settle-train-seat','자리에 앉아 가방을 정리함'),mono(2,'하은은 자기 자리에서 창밖을 봤다.'),quoted(2,'**하은** “이제 진짜 가네.”'),quoted(2,'**주인공** “응.”'),quoted(2,'**하은** “표까지 샀는데도 방금까지 안 믿겼어.”'),quoted(2,'**주인공** “나만 그런 줄.”'));
  else steps.push(mono(2,'우리는 정한 만남 장소로 향했다. 멀리 가는 표 대신 돌아올 수 있는 길을 확인했다. 같은 도시에 있다고 이동이 없는 것은 아니었다.'));
  steps.push(scene(3,chapter),mono(3,'하은이 창밖을 보다가 말했다.'),quoted(3,'**하은** “방금 저거 봤어?”'),quoted(3,'**주인공** “뭐?”'),quoted(3,'**하은** “지나갔어.”'),quoted(3,'**주인공** “무슨 모양이었는데?”'),quoted(3,'**하은** “지금 설명하면 다음 것도 지나가겠네.”'),act(3,'나는 웃고 창밖을 봤다.','look-out-window','웃으며 창밖을 봄'),mono(3,'같은 방향을 보고 있어도 같은 순간을 전부 볼 수는 없었다.'));
  return [...steps,choice(chapter,2)];
}

function reaction2(chapter){const id=last(chapter);if(id.endsWith('_watch_together'))return [mono(3,'하은은 풍경에 이름을 붙이지 않았다. 나도 뭘 보고 있는지 계속 묻지 않았다.'),mono(3,'나무와 건물이 바뀌었다. 무엇이 가장 예뻤는지 고르지 않아도 시간이 지나갔다.')];if(id.endsWith('_separate_music'))return [mono(3,'우리는 각자 소리를 들었다. 하은이 내 쪽을 보고 말을 꺼내려 하면 한쪽을 뺐다. 같이 여행 온 사람이 잠깐 자기 음악을 듣는 것이 혼자 여행하는 신호는 아니었다.')];return [quoted(3,'**하은** “응. 도착 가까워지면 말해 줄게.”'),quoted(3,'**주인공** “너도 자고 싶으면 같이 알림 보자.”'),mono(3,'그녀가 고개를 끄덕였다.'),mono(3,'나는 하은에게 나를 계속 지켜봐 달라는 역할을 맡기지 않고 쉬었다.')];}

function scenes4And5(chapter){const busan=chapter.input.route==='BUSAN_TRIP',steps=[scene(4,chapter)];
  if(busan)steps.push(mono(4,'도착하자 사진과 다른 소리가 먼저 들렸다.'),mono(4,'사람들이 움직였고, 안내 소리가 겹쳤고, 내가 생각한 바다는 여기 보이지 않았다.'),act(4,'나는 가방을 들고 잠깐 멈췄다.','arrival-pause','부산역에서 가방을 들고 잠깐 멈춤'),mono(4,'하은도 주위를 둘러봤다.'),quoted(4,'**하은** “생각보다 사람들이 많네.”'),quoted(4,'**주인공** “응.”'),mono(4,'나는 휴대전화를 꺼내 다음 이동을 보았다. 빨리 바다에 도착하면 여행이 제자리로 돌아올 것 같았다.'),mono(4,'하은이 내 팔을 가볍게 불렀다.'),quoted(4,'**하은** “먼저 조금 앉을까?”'),quoted(4,'**주인공** “바로 가면…….”'),mono(4,'말을 하다가 그녀의 얼굴을 봤다. 지친 표정이 조금 있었다.'),quoted(4,'**주인공** “응. 앉자.”'));
  else steps.push(mono(4,'익숙할 줄 알았던 길에도 사람이 많았다. 생각보다 바람이 세거나, 걷는 길이 길게 느껴졌다.'),mono(4,'하은은 같은 말을 했다. 먼저 앉자고.'),mono(4,'가까운 곳이라고 피곤하지 않아야 하는 것은 아니었다.'));
  steps.push(scene(5,chapter),mono(5,'앉자마자 시간표를 봤다.'),mono(5,'이미 첫 줄보다 조금 늦었다.'),mono(5,'나는 화면을 내렸다가 다시 올렸다. 하은은 물을 마시고 있었다.'),quoted(5,'**하은** “지금 늦었어?”'),quoted(5,'**주인공** “조금.”'),quoted(5,'**하은** “누구랑 약속한 거야?”'),quoted(5,'**주인공** “우리.”'),quoted(5,'**하은** “그럼 우리한테 바꾸자고 하면 되겠네.”'),mono(5,'나는 그녀를 봤다.'),mono(5,'말이 너무 쉬워서 오히려 웃음이 났다.'));
  return [...steps,choice(chapter,3)];
}

function reaction3(chapter){const id=last(chapter),steps=[];if(id.endsWith('_eat_first'))steps.push(mono(5,'하은이 고개를 끄덕였다.'),mono(5,'나는 아직 찍지 않은 사진보다 지금 배고픈 사람을 먼저 봤다. 배고픈 사람에는 나도 있었다.'));else if(id.endsWith('_one_nearby'))steps.push(mono(5,'하은이 지금 움직일 수 있다고 하면 가까운 곳 하나만 골랐다. 다 보고 나서 또 하나를 붙이겠다는 속셈은 접었다.'),mono(5,'그녀가 더 쉬고 싶다고 하면 혼자 잠깐 보고 올지, 같이 기다릴지 따로 정했다.'));else steps.push(act(5,'시간표를 닫았다. 하은도 자기 물을 내려놓았다.','close-schedule','시간표를 닫고 함께 조금 더 쉼'),quoted(5,'**주인공** “여기서 쉬는 건 계획에 없었는데.”'),quoted(5,'**하은** “이제 있네.”'),mono(5,'나는 웃었다. 시간표를 고치는 소리가 생각보다 작았다. 내가 실패했다고 발표할 필요도 없었다.'));return [...steps,{type:'openingBoundary',nextScene:6,route:chapter.input.route}];}

export function getDay22V4PlayableOpening(chapter){if(!validateDay22V4(chapter))throw new Error('DAY22_INVALID_SAVE');if(chapter.input.route==='NO_TRAVEL')return [{type:'openingBoundary',nextScene:23,route:'NO_TRAVEL'}];if(chapter.phase==='baggage')return scene1(chapter);if(chapter.phase==='movement')return [...reaction1(chapter),...scenes2And3(chapter)];if(chapter.phase==='first_plan')return [...reaction2(chapter),...scenes4And5(chapter)];if(chapter.phase==='meal_record')return reaction3(chapter);return [{type:'openingBoundary',nextScene:6,route:chapter.input.route}];}
