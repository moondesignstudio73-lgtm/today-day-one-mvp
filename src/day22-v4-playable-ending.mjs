import {DAY22_V4_SOURCE_SCENES} from './day22-v4-source-registry.mjs';
import {day22V4SourceRef} from './day22-v4-source-selection.mjs';
import {getDay22V4Options,validateDay22V4} from './day22-v4-state-contract.mjs';

const ref=(scene,line)=>day22V4SourceRef(scene,line);
const mono=(scene,text)=>({type:'monologue',text,source:ref(scene,text)});
const groundedMono=(scene,text,exact)=>({type:'monologue',text,source:ref(scene,exact)});
const act=(scene,exact,status,actionLabel)=>({type:'stageAction',status,actionLabel,source:ref(scene,exact)});
const quoted=(scene,exact)=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY22_DIALOGUE_LINE_INVALID:${scene}:${exact}`);return {type:'dialogue',speaker:match[1]==='주인공'?'나':match[1],text:match[2],source:ref(scene,exact)};};
const scene=(number,chapter)=>({type:'sceneDirection',number,title:DAY22_V4_SOURCE_SCENES[number-1].title,location:number===22?'seoul-return':chapter.input.route==='BUSAN_TRIP'?'busan-night':'home',time:'night',character:number===22?'girlfriend':null});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,variant:'TRAVEL',prompt:DAY22_V4_SOURCE_SCENES.flatMap(item=>item.choices).find(item=>item.number===number&&item.variant==='TRAVEL').title,options:getDay22V4Options(chapter)});
const lastChoiceNumber=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.number??0;
const last=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??'';

function scene22(chapter){return [scene(22,chapter),mono(22,'헤어지는 길이 가까워졌다.'),act(22,'하은이 가방끈을 고쳐 잡았다. 나는 오늘 찍은 사진을 다시 보다가 휴대전화를 넣었다.','phone-away-return','귀가 전에 사진을 닫고 휴대전화를 넣음'),quoted(22,'**하은** “멀리 안 갔는데 좀 멀리 다녀온 것 같아.”'),quoted(22,'**주인공** “계획에서는 많이 벗어났지.”'),quoted(22,'**하은** “그러네. 길은 가까운데.”'),mono(22,'나는 웃었다.'),choice(chapter,17)];}

function reaction17(chapter){const id=last(chapter),steps=[];if(id.endsWith('_choose_photo_tomorrow')){const exact='사진을 실제로 찍었고 하은도 원하면 내일 각자 마음에 드는 것을 하나 고르기로 했다. 함께 사진이 없다면 풍경이나 기억에 남은 순간을 이야기하기로 했다.';steps.push(groundedMono(22,chapter.facts.sharedPhotoKept?'내일 각자 마음에 드는 사진을 하나 고르기로 했다.':'내일 풍경이나 기억에 남은 순간을 하나씩 이야기하기로 했다.',exact),mono(22,'모든 사진을 검토하는 숙제는 아니었다.'));}else if(id.endsWith('_rest_separately'))steps.push(quoted(22,'**하은** “응. 나 도착하면 알려 줄게.”'),quoted(22,'**주인공** “나도.”'),mono(22,'오늘 충분히 함께했으니 지금부터 각자 쉬고 싶다는 말이 자연스러웠다.'));else steps.push(mono(22,'나는 오늘 고마웠던 일이나 좋았던 순간을 말했다.'),quoted(22,'**주인공** “피곤하다고 말해 줘서 좋았어.”'),quoted(22,'**하은** “고마웠다는 말이 좀 신기하다.”'),quoted(22,'**주인공** “네가 참고 있으면 나는 잘된 줄 알았을 것 같아서.”'),mono(22,'하은이 고개를 끄덕였다.'),quoted(22,'**하은** “다음에도 말할게.”'));steps.push(groundedMono(22,'서로 귀가했다. 내일 각자 집에서 오늘을 떠올릴 것이다.','서로 귀가했다. 이 경로에는 낯선 숙소의 아침이 없었다. 내일 각자 집에서 오늘을 떠올릴 것이다.'));return steps;}

function scene24(chapter){const route=chapter.input.route,steps=[scene(24,chapter)];if(route==='BUSAN_TRIP')steps.push(groundedMono(24,'나는 실제 예약한 부산 숙소에 있었다.','부산의 밤이라면 나는 실제 예약한 공간에 있었다.'));else if(route==='SEOUL_DAY')steps.push(groundedMono(24,'나는 서울의 내 집에 돌아와 있었다.','서울의 밤이라면 내 집에 돌아와 있었다.'));else steps.push(groundedMono(24,'익숙한 방에서 오늘의 작은 일을 떠올렸다.','떠나지 않은 날이면 익숙한 방에서 오늘의 작은 일을 떠올렸다.'));
  if(route==='NO_TRAVEL')steps.push(groundedMono(24,'나는 내 속도를 조금 더 알았다. 누군가 옆에 없을 때 좋은 것이 있다는 사실이 누군가와 만나고 싶다는 마음을 지우지는 않았다.','혼자 지낸 날이면 나는 내 속도를 조금 더 알았다. 누군가 옆에 없을 때 좋은 것이 있다는 사실이 누군가와 만나고 싶다는 마음을 지우지는 않았다.'));
  else steps.push(mono(24,'함께 여행한 하은이 오늘 무엇을 가장 좋아했는지는 내 예상과 달랐다.'),mono(24,'그것들을 전부 계획을 방해하는 일로 보았다면 오늘은 계속 고쳐야 하는 하루였을 것이다.'),mono(24,'하지만 같이 고른 하루라면, 고치는 일도 함께할 수 있었다.'),mono(24,'나는 처음 보고 싶었던 장소를 여전히 좋아했다. 못 간 곳이 아쉬웠다.'),mono(24,'동시에 하은과 보낸 시간이 좋았다.'),mono(24,'서로 다른 마음이 하루 안에 같이 남아 있어도 됐다.'));
  if(route==='BUSAN_TRIP')steps.push(mono(24,'내일 돌아오면 빨래가 있을 것이다. 먹을 것도 다시 골라야 한다.'));
  if(route!=='NO_TRAVEL')steps.push(mono(24,'여행이 끝난 뒤에도 하은에게 하고 싶은 말이 남아 있으면 좋겠다고 생각했다.'));
  steps.push(act(24,'화면이 천천히 어두워진다.','fade-out','화면이 천천히 어두워짐'),mono(24,'계획한 곳을 모두 보지는 못했다.'));if(route!=='NO_TRAVEL')steps.push(mono(24,'대신 같이 온 사람을 조금 더 보았다.'));steps.push({type:'chapterCompletionCue',day:22,finalSceneReached:true});return steps;}

export function getDay22V4PlayableEnding(chapter){if(!validateDay22V4(chapter))throw new Error('DAY22_INVALID_SAVE');if(chapter.phase==='seoul_return')return scene22(chapter);if(chapter.phase!=='ending')return [{type:'endingBoundary',nextScene:chapter.input.route==='NO_TRAVEL'?23:chapter.input.route==='SEOUL_DAY'?22:21,route:chapter.input.route}];return [...(lastChoiceNumber(chapter)===17?reaction17(chapter):[]),...scene24(chapter)];}
