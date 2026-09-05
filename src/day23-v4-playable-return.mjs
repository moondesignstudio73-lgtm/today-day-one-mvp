import {DAY23_V4_SOURCE_SCENES} from './day23-v4-source-registry.mjs';
import {day23V4SourceRef} from './day23-v4-source-selection.mjs';
import {getDay23V4Options,validateDay23V4} from './day23-v4-state-contract.mjs';

const ref=(scene,line)=>day23V4SourceRef(scene,line);
const mono=(scene,text)=>({type:'monologue',text,source:ref(scene,text)});
const grounded=(scene,text,exact)=>({type:'playerNarration',text,source:ref(scene,exact)});
const quoted=(scene,exact)=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY23_DIALOGUE_LINE_INVALID:${scene}:${exact}`);return {type:'dialogue',speaker:match[1]==='주인공'?'나':match[1],text:match[2],source:ref(scene,exact)};};
const action=(scene,exact,actionId,description)=>({type:'stageAction',action:actionId,description,source:ref(scene,exact)});
const title=number=>DAY23_V4_SOURCE_SCENES.find(item=>item.number===number)?.title??`SCENE ${number}`;
const scene=(number,chapter,location,time)=>({type:'sceneDirection',number,title:title(number),location,time,character:chapter.input.contactAllowed?'girlfriend':null});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,options:getDay23V4Options(chapter)});
const lastChoice=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??'';
const hasResolution=(chapter,resolution)=>chapter.choices.some(record=>record.kind==='resolution'&&record.resolution===resolution);

function scene8(chapter){
  const busan=chapter.input.route==='BUSAN_TRIP';
  const steps=[scene(8,chapter,busan?'train':'home',busan?'afternoon':'morning')];
  if(busan)steps.push(mono(8,'이동편에 앉자 몸이 먼저 편한 자세를 찾았다.'),mono(8,'하은은 창밖을 봤다가 나를 봤다.'),quoted(8,'**하은** “올 때보다 조용하네.”'),quoted(8,'**주인공** “많이 봐서 그런가.”'),quoted(8,'**하은** “많이 말하기도 했고.”'),mono(8,'나는 고개를 끄덕였다.'));
  else if(chapter.input.contactAllowed)steps.push(grounded(8,'각자 집에서 통화가 이어졌다. 기차에 함께 있는 것처럼 꾸미지 않았다.','서울에서 이미 돌아온 경로라면 이 대화는 각자 집에서 가능한 통화로 나눴다. 돌아가는 기차에 있는 것처럼 배경을 만들지 않았다.'),quoted(8,'**하은** “올 때보다 조용하네.”'),quoted(8,'**주인공** “많이 봐서 그런가.”'),quoted(8,'**하은** “많이 말하기도 했고.”'));
  else steps.push(grounded(8,'나는 이미 돌아온 집에서 조용히 쉬었다. 돌아가는 기차나 하은과의 통화를 만들지 않았다.','서울에서 이미 돌아온 경로라면 이 대화는 각자 집에서 가능한 통화로 나눴다. 돌아가는 기차에 있는 것처럼 배경을 만들지 않았다.'));
  return [...steps,choice(chapter,7)];
}

function reaction7(chapter){
  const id=lastChoice(chapter),busan=chapter.input.route==='BUSAN_TRIP';
  if(id.endsWith('_rest')){
    if(busan)return [grounded(8,'우리는 각자 편한 자세로 조금 쉬었다. 잠든 얼굴을 찍지 않았고, 기대는 일도 현재 서로 편할 때만 했다.','하은이 눈을 감으면 나는 잠든 얼굴을 찍지 않았다.')];
    return [grounded(8,'나는 집에서 조금 쉬었다. 하은이 쉬는 모습을 보았다고 만들지 않았다.','하은이 눈을 감으면 나는 잠든 얼굴을 찍지 않았다.')];
  }
  if(id.endsWith('_one_photo')){
    const kind=chapter.facts.sharedPhotoToday?'DAY23_SHARED_PHOTO':chapter.input.landscapePhotoExists?'DAY22_LANDSCAPE_PHOTO':'DAY22_SHARED_PHOTO';
    return [action(8,'우리는 실제로 남긴 사진 한 장을 봤다. 삭제한 사진은 다시 꺼내지 않았다.','review-photo',`실제로 남아 있는 ${kind} 한 장만 확인`),quoted(8,'**하은** “나머지는 집에 가서 봐도 되겠다.”')];
  }
  return [quoted(8,'**하은** “빨래.”'),quoted(8,'**주인공** “여행의 마지막 일정?”'),quoted(8,'**하은** “응. 이건 예약 없어도 시작돼.”')];
}

function scene9(chapter){
  const steps=[scene(9,chapter,chapter.input.route==='BUSAN_TRIP'?'train':'home','afternoon')];
  if(chapter.input.contactAllowed)steps.push(quoted(9,'**주인공** “빨래라고 하니까 갑자기 현실이네.”'),quoted(9,'**하은** “좋은 데 다녀와도 빨래는 생기니까.”'),mono(9,'나는 고개를 끄덕였다. 생각해 보니 여행 중에도 밥을 먹고, 씻고, 피곤했고, 물건을 챙겼다. 현실을 떠난 적은 없었다.'),mono(9,'조금 다른 곳에서 같은 두 사람이 하루를 보냈을 뿐이었다.'),quoted(9,'**하은** “집에 가면 먹을 것도 봐야겠다.”'),quoted(9,'**주인공** “냉장고가 기다리겠네.”'),quoted(9,'**하은** “안 기다리는 게 문제야. 그냥 제 할 일 해서 상할 수도 있고.”'),mono(9,'나는 웃었다.'),mono(9,'그녀가 어제 좋은 숙소에 앉아 있던 사람과 같은 사람이라는 게 좋았다.'));
  else steps.push(grounded(9,'나는 집에서 먹을 것과 빨랫감을 확인했다. 특별한 곳에 다녀왔어도 평범한 생활은 계속됐다.','생각해 보니 여행 중에도 밥을 먹고, 씻고, 피곤했고, 물건을 챙겼다. 현실을 떠난 적은 없었다.'));
  return [...steps,choice(chapter,8)];
}

function reaction8(chapter){
  const id=lastChoice(chapter),contact=chapter.input.contactAllowed;
  if(id.endsWith('_ordinary_story'))return contact?[quoted(9,'**하은** “빨래 이야기?”'),quoted(9,'**주인공** “응. 네가 지금 뭘 하는지.”'),quoted(9,'**하은** “그건 특별한 얘기 준비 안 해도 되네.”')]:[grounded(9,'특별하지 않은 내 생활도 그대로 듣고 싶다는 마음을 인정했다.','**하은** “그건 특별한 얘기 준비 안 해도 되네.”')];
  if(id.endsWith('_unpack'))return [grounded(9,contact?'하은은 자기도 바로 풀어야 덜 미룬다고 말했다.':'나는 가방이나 평소 물건을 미루지 않고 정리하기로 했다.','그 이야기를 실제로 한 적이 없다면 그녀는 “나도 바로 풀어야 덜 미루더라”고 했다.')];
  return contact?[quoted(9,'**하은** “나도 조금. 그래도 오늘은 혼자 쉬고 싶어.”'),quoted(9,'**하은** “같이 있는 게 싫어서가 아니라.”'),quoted(9,'**주인공** “응. 둘 다 있을 수 있지.”'),mono(9,'나는 어제 우리가 자주 했던 말을 내 쪽에서도 해 보았다.')]:[grounded(9,'조금 허전했지만 오늘 혼자 쉬고 싶은 마음도 함께 인정했다.','**하은** “나도 조금. 그래도 오늘은 혼자 쉬고 싶어.”')];
}

function scene10(chapter){
  const steps=[scene(10,chapter,chapter.input.route==='BUSAN_TRIP'?'train':'home','afternoon')];
  if(chapter.input.contactAllowed)steps.push(mono(10,'하은은 한동안 창밖을 보았다. 나는 그 옆에서 생각했다.'),mono(10,'여행이 좋았다는 말은 이미 했다. 그 말만으로 앞으로 어떻게 만나고 싶은지 다 말한 것일까.'));
  else steps.push(grounded(10,'나는 혼자 앞으로 하은과 어떻게 지내고 싶은지 생각했다. 답을 들을 수 없는 상태에서 그녀의 마음을 대신 정하지 않았다.','관계에 아직 큰 불편함이 있으면 하은은 “그 마음은 들었어. 내 마음도 조금 더 봐야겠어”라고 했다. 내가 원한다고 바로 둘의 대답이 완성되지는 않았다.'));
  return [...steps,choice(chapter,9)];
}

function relationshipResolution(chapter){
  return [{type:'relationshipConsentCue',prompt:'앞으로의 관계 의사를 들은 하은의 현재 독립 응답을 확인한다.',source:ref(10,'관계에 아직 큰 불편함이 있으면 하은은 “그 마음은 들었어. 내 마음도 조금 더 봐야겠어”라고 했다. 내가 원한다고 바로 둘의 대답이 완성되지는 않았다.')}];
}

function reaction9(chapter){
  const id=lastChoice(chapter),outcome=chapter.facts.haeunRelationshipOutcome;
  if(outcome==='NOT_CONTACTED')return [grounded(10,'나는 내 마음만 정리했다. 연락할 수 없는 하은의 대답은 만들지 않았다.','관계에 아직 큰 불편함이 있으면 하은은 “그 마음은 들었어. 내 마음도 조금 더 봐야겠어”라고 했다. 내가 원한다고 바로 둘의 대답이 완성되지는 않았다.')];
  if(id.endsWith('_keep_meeting')&&outcome==='CONTINUE')return [quoted(10,'**하은** “나도 그런 마음이 있어.”'),quoted(10,'**하은** “같은 곳에 살아야 한다는 뜻은 아니고.”'),quoted(10,'**주인공** “응. 각자 집에서 살다가도 서로 궁금한 거.”'),quoted(10,'**하은** “그거 좋네.”')];
  if(id.endsWith('_discuss_more'))return [quoted(10,'**하은** “오늘 좋았다는 게 그 대답을 미루는 말은 아니었으면 해.”'),quoted(10,'**주인공** “응. 내일 이야기할 수 있는지 묻고 싶어.”'),grounded(10,outcome==='DISCUSS'?'하은은 가능한 때를 말했고, 이동 중에 긴 대화를 시작하지 않았다.':'하은은 아직 어렵다고 말했다. 나는 이동 중에 긴 대화를 강요하지 않았다.','그녀는 가능할 때를 말하거나 아직은 어렵다고 했다. 나는 이동 중에 긴 대화를 강요하지 않았다.')];
  if(id.endsWith('_home_comfort')&&outcome==='CONTINUE')return [quoted(10,'**하은** “각자 다른 것 해도 되는 거?”'),quoted(10,'**주인공** “응. 내가 네가 심심할까 봐 계속 움직이지 않아도 되는 거.”'),quoted(10,'**하은** “그건 나도 좋아.”'),mono(10,'나는 집에 도착하자마자 같이 가자고 하지 않았다. 오늘 각자 쉬고 싶은 마음과 앞으로 함께하고 싶은 마음은 같이 있을 수 있었다.')];
  return [grounded(10,'하은은 내 마음을 들었지만 자기 마음은 조금 더 보겠다고 했다. 나는 내 선택만으로 둘의 대답을 완성하지 않았다.','관계에 아직 큰 불편함이 있으면 하은은 “그 마음은 들었어. 내 마음도 조금 더 봐야겠어”라고 했다. 내가 원한다고 바로 둘의 대답이 완성되지는 않았다.')];
}

function scene11(chapter){
  const busan=chapter.input.route==='BUSAN_TRIP',steps=[scene(11,chapter,busan?'station':'home',busan?'evening':'afternoon')];
  if(busan)steps.push(mono(11,'도착한 곳에서 길이 갈렸다.'),mono(11,'나는 하은의 가방을 보고 같이 가야 하는지 물으려 했다.'),quoted(11,'**하은** “난 오늘 혼자 집에 가서 정리 좀 할게.”'),quoted(11,'**주인공** “응.”'),mono(11,'대답은 쉽게 했는데 발걸음은 조금 늦어졌다. 하은이 그걸 보고 웃었다.'),quoted(11,'**하은** “아쉬워?”'),quoted(11,'**주인공** “응. 같이 가는 게 당연한 줄 알았나 봐.”'),quoted(11,'**하은** “같이 돌아왔잖아.”'),quoted(11,'**주인공** “그러네. 여기까지는.”'),mono(11,'나는 웃었다. 그녀의 집까지 가야만 끝나는 여행은 아니었다.'));
  else steps.push(grounded(12,'어제 이미 나눈 작별을 오늘 다시 만들지 않았다. 나는 내 집에서 오늘의 남은 시간을 정했다.','서울 당일을 어제 마쳤다면 오늘 이 작별을 다시 겪지는 않았다. 대신 어제 나눈 인사를 떠올리거나 오늘 자기 집으로 돌아오는 짧은 길을 걸었다.'));
  return [...steps,choice(chapter,10)];
}

function reaction10(chapter){
  const id=lastChoice(chapter);
  if(id.endsWith('_arrival_line'))return [grounded(11,'서로 집에 도착하면 한 줄만 보내기로 했다. 몇 분 안에 답해야 하는 규칙은 만들지 않았다.','하은은 그러겠다고 했다. 나도 내 집에 도착하면 알리기로 했다. 몇 분 안에 답해야 하는 규칙을 만들지는 않았다.')];
  if(id.endsWith('_evening_call'))return [grounded(11,'서로 가능한 통화 시간을 대략 맞췄다. 너무 피곤하면 미리 말하고 쉬기로 했다.','서로 가능한 시간을 대략 맞췄다. 너무 피곤하면 미리 말하고 쉬기로 했다.'),mono(11,'오늘 있었던 모든 일을 다시 확인할 통화는 아니었다. 각자 돌아간 집에서 목소리를 듣고 싶었다.')];
  return chapter.input.contactAllowed?[quoted(11,'**하은** “좋아. 너도 쉬어.”'),quoted(11,'**주인공** “응.”'),mono(11,'그 말을 했다고 그날 밤 연락이 안 오면 서운해할 약속을 몰래 남기지 않았다.')]:[grounded(11,'나는 오늘 푹 쉬고, 합의되지 않은 연락 약속을 만들지 않았다.','그 말을 했다고 그날 밤 연락이 안 오면 서운해할 약속을 몰래 남기지 않았다.')];
}

function scene12(chapter){
  const busan=chapter.input.route==='BUSAN_TRIP',steps=[scene(12,chapter,busan?'station':'home',busan?'evening':'afternoon')];
  if(!busan){steps.push(grounded(12,'오늘은 역의 인사나 포옹을 다시 겪지 않았다.','서울 당일을 어제 마쳤다면 오늘 이 작별을 다시 겪지는 않았다. 대신 어제 나눈 인사를 떠올리거나 오늘 자기 집으로 돌아오는 짧은 길을 걸었다.'));return steps;}
  steps.push(quoted(12,'**주인공** “잘 가라는 말이 오늘은 좀 아쉽네.”'),quoted(12,'**하은** “그럼 다음에 잘 왔다고 해.”'),mono(12,'나는 고개를 끄덕였다.'),mono(12,'그 말이 예뻐서 지금 당장 다음 날짜를 붙이고 싶어졌지만, 오늘 쉬자는 말을 먼저 지켰다.'),mono(12,'하은이 자기 방향으로 걸어갔다. 나는 내 방향으로 갔다.'),mono(12,'뒤돌아보았을 때 그녀가 꼭 나를 보고 있어야 하는 것은 아니었다.'),mono(12,'내 가방은 내가 들고 있었다.'),mono(12,'올 때보다 조금 가벼워진 것 같았다. 실제 물건은 거의 같았는데, 둘의 하루를 전부 내가 들고 가야 한다는 마음이 조금 줄어 있었다.'));
  return steps;
}

function farewellResult(chapter){
  if(chapter.input.route!=='BUSAN_TRIP')return [];
  if(chapter.facts.farewellContact==='SHORT_HUG')return [action(12,'관계가 편안하고 서로 원하면 짧게 포옹했다.','short-farewell-hug','현재 서로 동의한 짧은 작별 포옹')];
  return [grounded(12,'우리는 손을 흔들거나 잠깐 시선을 마주치고 각자 걸어갔다.','이전 포옹이 없는 관계라면 무조건 안지 않았다. 손을 흔들거나 잠깐 시선을 마주쳤다.')];
}

const boundary=chapter=>({type:'returnBoundary',nextScene:13,route:chapter.input.route});

export function getDay23V4PlayableReturn(chapter){
  if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');
  if(chapter.input.route==='NO_TRAVEL')return [{type:'returnBoundary',nextScene:21,route:'NO_TRAVEL'}];
  if(chapter.phase==='return_ride')return scene8(chapter);
  if(chapter.phase==='home_imagination')return [...reaction7(chapter),...scene9(chapter)];
  if(chapter.phase==='relationship_intent')return [...reaction8(chapter),...scene10(chapter)];
  if(chapter.phase==='relationship_resolution')return relationshipResolution(chapter);
  if(chapter.phase==='farewell_plan')return [...reaction9(chapter),...scene11(chapter)];
  if(chapter.phase==='farewell_resolution')return [...reaction10(chapter),...scene12(chapter),{type:'farewellContactConsentCue',prompt:'지금 짧게 포옹해도 서로 편한지 확인한다.',source:ref(12,'관계가 편안하고 서로 원하면 짧게 포옹했다.')}];
  if(chapter.phase==='home_arrival')return hasResolution(chapter,'FAREWELL_CONTACT')?[...farewellResult(chapter),boundary(chapter)]:[...reaction10(chapter),...scene12(chapter),...farewellResult(chapter),boundary(chapter)];
  return [boundary(chapter)];
}
