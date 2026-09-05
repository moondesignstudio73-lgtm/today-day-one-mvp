import {DAY23_V4_SOURCE_SCENES} from './day23-v4-source-registry.mjs';
import {day23V4SourceRef} from './day23-v4-source-selection.mjs';
import {getDay23V4Options,validateDay23V4} from './day23-v4-state-contract.mjs';

const ref=(scene,line)=>day23V4SourceRef(scene,line);
const mono=(scene,text)=>({type:'monologue',text,source:ref(scene,text)});
const grounded=(scene,text,exact)=>({type:'playerNarration',text,source:ref(scene,exact)});
const quoted=(scene,exact,channel='dialogue',recipient)=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY23_DIALOGUE_LINE_INVALID:${scene}:${exact}`);if(channel==='message')return {type:'message',sender:match[1]==='주인공'?'나':match[1],recipient,text:match[2],source:ref(scene,exact)};return {type:'dialogue',speaker:match[1]==='주인공'?'나':match[1],text:match[2],source:ref(scene,exact)};};
const action=(scene,exact,actionId,description)=>({type:'stageAction',action:actionId,description,source:ref(scene,exact)});
const title=number=>DAY23_V4_SOURCE_SCENES.find(item=>item.number===number)?.title??`SCENE ${number}`;
const scene=(number,character=null,time='night')=>({type:'sceneDirection',number,title:title(number),location:'home',time,character});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,options:getDay23V4Options(chapter)});
const lastChoice=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??'';
const choseNumber=(chapter,number)=>chapter.choices.some(record=>record.kind==='choice'&&record.number===number);

function scene18(chapter){
  const planned=chapter.input.contactAllowed&&chapter.facts.farewellPlan==='EVENING_CALL',steps=[scene(18,planned?'girlfriend':null,'evening'),mono(18,'나는 저녁을 준비하거나 사 온 것을 꺼냈다.'),mono(18,'휴대전화를 식탁에 놓으려다 음식에서 조금 떨어뜨렸다. 관계에 대해 생각한다고 저녁까지 건너뛰고 싶지는 않았다.')];
  if(planned)steps.push(mono(18,'하은과 통화하기로 한 날이면 시간을 확인했다.'),quoted(18,'**주인공** “지금 통화 괜찮아?”'),quoted(18,'**하은** “응. 나 밥 먹고 있어.”'),quoted(18,'**주인공** “그럼 다 먹고 할까?”'),quoted(18,'**하은** “짧게는 괜찮아. 너도 먹어.”'));
  return [...steps,choice(chapter,15)];
}

function reaction15(chapter){
  const id=lastChoice(chapter);
  if(id.endsWith('_eat_call'))return [mono(18,'하은이 먹는 소리가 잠깐 들렸다. 나는 내 음식도 먹었다.'),quoted(18,'**하은** “잠깐, 뜨거워.”'),mono(18,'나는 대답하려다가 웃었다.'),quoted(18,'**주인공** “그건 기다릴게.”'),mono(18,'같은 식탁은 아니었다. 그래도 서로 자기 저녁을 먹고 있다는 걸 알았다.')];
  if(id.endsWith('_after_meal'))return [mono(18,'우리는 전화를 잠깐 미뤘다. 나는 식사를 마치고 그릇을 정리했다. 하은도 자기 일을 마친 뒤 연락했다.'),mono(18,'내가 먼저 끝났다고 그녀의 속도를 재촉하지 않았다.')];
  return chapter.input.contactAllowed?[quoted(18,'**하은** “좋아. 잘 먹어.”'),quoted(18,'**주인공** “너도.”'),mono(18,'짧은 인사 뒤에 음식에 집중했다. 통화가 짧다고 마음까지 짧아지는 것은 아니었다.')]:[mono(18,'하은과 연락을 쉬는 날이면 나는 내 저녁을 혼자 마쳤다. 통화하지 않은 상대의 목소리를 추억처럼 쓰지 않았다.')];
}

function scene19(chapter){
  const metToday=chapter.input.route==='BUSAN_TRIP',steps=[scene(19,'girlfriend')];
  if(metToday)steps.push(quoted(19,'**하은** “아까까지 봤는데 벌써 보고 싶어?”'),quoted(19,'**주인공** “응.”'));
  else steps.push(grounded(19,'오늘은 만나지 않았으므로 하은은 오늘 못 봤다는 사실로 답했다. 아까까지 함께 있었다는 말은 하지 않았다.','오늘 실제로 만나지 않았다면 그녀는 “오늘은 못 봤으니까”라고 말하거나 웃었다. 아까까지 함께 있었다는 대사가 따라오지는 않았다.'));
  steps.push(mono(19,'하은은 잠깐 조용했다.'),mono(19,'나는 휴대전화를 조금 더 편하게 들었다.'),quoted(19,'**하은** “나 지금 집에서 엄청 대충 앉아 있는데.”'),quoted(19,'**주인공** “그럴 것 같아서 더 궁금해.”'),quoted(19,'**하은** “아름다운 상상은 아닐 텐데.”'),quoted(19,'**주인공** “편한 상상.”'),mono(19,'그녀가 웃었다. 낮은 목소리로 들려서 웃음이 더 가까운 것 같았다.'));
  return [...steps,choice(chapter,16)];
}

function reaction16(chapter){
  const id=lastChoice(chapter);
  if(id.endsWith('_smiling_face'))return [quoted(19,'**하은** “그건 나도 무슨 생각 없이 웃었는지 모르는데.”'),quoted(19,'**주인공** “설명 안 해도 돼.”'),mono(19,'그녀가 다시 웃었다.'),quoted(19,'**주인공** “지금도 좋네.”')];
  if(id.endsWith('_beside_separate_tasks'))return [mono(19,'하은이 말했다.'),quoted(19,'**하은** “오늘은 각자 있는 게 좋고, 다음에는 그런 것도 좋겠다.”'),quoted(19,'**주인공** “응. 오늘 당장 오라는 말은 아니야.”'),quoted(19,'**하은** “알아.”'),mono(19,'그 두 글자가 편했다. 내 마음을 말해도 바로 행동해야 하는 요구로 들리지 않는 관계이고 싶었다.')];
  return [quoted(19,'**하은** “왜?”'),quoted(19,'**주인공** “그냥 보고 있게 될 것 같아서.”'),mono(19,'잠깐 정적이 있었다.'),quoted(19,'**하은** “그럼 다음에 너무 오래 보지만 마.”'),quoted(19,'**주인공** “불편해?”'),quoted(19,'**하은** “아니. 나도 할 말 잊을 것 같아서.”'),mono(19,'나는 웃었다. 같은 방에 있지 않았는데도 잠깐 시선을 마주친 것 같았다.'),mono(19,'실제로 만나러 나가지는 않았다. 오늘은 각자 쉬는 밤이었다.')];
}

function scene20(chapter){
  const comfortable=chapter.facts.haeunRelationshipOutcome==='CONTINUE'&&chapter.input.relationshipTone==='CALM',steps=[scene(20,'girlfriend')];
  if(comfortable)steps.push(grounded(20,'좋은 관계에서도 앞으로 어떻게 만나고 싶은지 서로의 답을 듣기 위한 시간을 정하기로 했다.','좋은 관계에서 미래를 이야기하고 싶은 경로라면 하은은 다른 답을 했다.'),quoted(20,'**하은** “나도 우리 앞으로 어떻게 만나고 싶은지 말해 보고 싶었어.”'),mono(20,'나는 조금 안심했지만, 같은 미래를 이미 원한다고 결론 내리지는 않았다.'));
  else steps.push(mono(20,'하은이 통화할 수 있다면 나는 내일 이야기하고 싶은 것이 있다고 말했다.'),quoted(20,'**주인공** “좋았던 시간은 좋았어. 그런데 그 말로 미뤄 둔 대답까지 덮고 싶지는 않아.”'),mono(20,'하은은 조용히 들었다.'),quoted(20,'**하은** “내일 무슨 답을 들을지 미리 겁날 것 같아.”'),quoted(20,'**주인공** “그럴 것 같아.”'),quoted(20,'**하은** “그래도 아무 얘기 없다고 해 놓고 갑자기 말하는 것보다는 나아.”'),mono(20,'나는 그녀가 바로 고마워할 것이라고 기대하지 않았다.'),mono(20,'내 마음이 흔들리거나 끝내고 싶다는 쪽이면, 좋아한다는 말을 덧붙여 상황을 부드럽게 만들려 하지 않았다. 말할 수 있는 만큼만 말했다.'));
  return [...steps,choice(chapter,17)];
}

function reaction17(chapter){
  const id=lastChoice(chapter),accepted=chapter.facts.nextConversation!=='NOT_AGREED';
  if(!accepted)return [grounded(20,'하은이 제안한 방식은 원하지 않아 집 앞에서 기다리지 않고 다른 방법을 다음에 묻기로 했다.','하은이 수락하면 조용히 말할 수 있는 기존 장소와 시간을 정했다. 집 앞에서 먼저 기다리는 일은 하지 않았다. 그녀가 원하지 않으면 다른 방법을 물었다.')];
  if(id.endsWith('_meet'))return [grounded(20,'하은이 수락해 조용히 말할 수 있는 기존 장소와 시간을 정했다. 집 앞에서 먼저 기다리지는 않았다.','하은이 수락하면 조용히 말할 수 있는 기존 장소와 시간을 정했다. 집 앞에서 먼저 기다리는 일은 하지 않았다. 그녀가 원하지 않으면 다른 방법을 물었다.')];
  if(id.endsWith('_phone'))return [mono(20,'하은은 자신도 들을 준비가 필요하다고 했다. 지금 바로 이야기하지 않아도, 시간을 정할 수 있었다.')];
  return [mono(20,'나는 내가 가능한 때를 먼저 말하고 하은의 답을 들었다. ‘네가 편할 때 아무 때나’라는 말로 내 책임까지 상대에게 맡기지 않았다.'),mono(20,'내일 서로 듣기로 했다.')];
}

function conversationResolution(chapter){
  return [{type:'conversationConsentCue',prompt:'제안한 DAY24 대화 방식과 시간을 하은이 현재 수락하는지 확인한다.',source:ref(20,'내일 서로 듣기로 했다.')}];
}

function scene22(chapter){
  const pending=chapter.input.pendingContacts.length>0,contact=chapter.input.contactAllowed,steps=[scene(22,null)];
  if(contact&&chapter.input.route!=='NO_TRAVEL')steps.push(mono(22,'하은과의 통화를 마쳤다.'),mono(22,'휴대전화를 내려놓고 잠깐 의자에 앉았다.'),mono(22,'나는 오늘 잘 말했다고 생각한 문장을 다시 떠올렸다. 그 문장 뒤에서 상대가 무엇을 들었는지는 내가 다 알 수 없었다.'),mono(22,'그래도 내 말이 어떤 뜻이었는지 내일 다시 말할 수는 있었다.'));
  else steps.push(grounded(22,'나는 내 하루를 마치며 내일 말할 수 있는 것만 생각했다. 방은 조용했다.','그래도 내 말이 어떤 뜻이었는지 내일 다시 말할 수는 있었다.'));
  if(pending)steps.push(mono(22,'다른 사람과의 연락을 흐리게 남긴 경로라면 나는 그 창을 열었다.'),mono(22,'아직 하은과 만나면서 혼자라고 말했거나, 끝내지 않은 관계를 끝났다고 들리게 했다면 문장이 남아 있었다.'),grounded(22,'실제로 남아 있는 설명은 사진과 섞어 지우지 않고, 고쳐 말하거나 아직 못 하겠다고 미룬 사실 그대로 두었다.','나는 불편하다고 사진을 지우지 않았다. 사진은 실제로 좋은 시간이었고, 다른 설명은 내가 한 것이었다.'),mono(22,'고쳐 말할 수 있었다.'),mono(22,'지금은 못 하겠다고 미룰 수도 있었다.'),mono(22,'하지만 미룬 뒤에 상대가 어떻게 알아들었을지까지 내 편한 쪽으로 정할 수는 없었다.'));
  else if(contact)steps.push(mono(22,'숨긴 말이 없는 경로에서는 이런 죄책감을 만들지 않았다. 나는 오늘 하은의 웃음을 떠올리고, 내일 어떤 대화를 할지 생각했다. 서로를 계속 만나고 싶다는 마음이 있다고 미래까지 전부 같은 것은 아닐 수 있었다.'),mono(22,'그 다른 점도 듣고 싶었다.'));
  else steps.push(grounded(22,'숨긴 말도 이어 갈 대화도 없었다. 나는 내일 내 생활을 생각했다.','숨긴 말이 없는 경로에서는 이런 죄책감을 만들지 않았다. 나는 오늘 하은의 웃음을 떠올리고, 내일 어떤 대화를 할지 생각했다. 서로를 계속 만나고 싶다는 마음이 있다고 미래까지 전부 같은 것은 아닐 수 있었다.'));
  return steps;
}

function scene23(chapter){
  const busan=chapter.input.route==='BUSAN_TRIP',steps=[scene(23,null)];
  if(busan)steps.push(mono(23,'가방을 거의 비웠다.'),mono(23,'작은 물건 하나가 바닥에 남아 있었다. 챙겨 온 실제 물건이면 제자리에 두고, 영수증이면 필요한지 보고 정리했다.'));
  else steps.push(grounded(23,'이미 집에 있던 작은 물건을 제자리에 두었다.','작은 물건 하나가 바닥에 남아 있었다. 챙겨 온 실제 물건이면 제자리에 두고, 영수증이면 필요한지 보고 정리했다.'));
  if(chapter.facts.souvenirPurchase)steps.push(mono(23,'기념품을 샀다면 내가 쓰고 싶은 곳에 두었다. 안 샀다면 빈자리를 채우려고 다른 것을 사지는 않았다.'));
  else steps.push(grounded(23,'기념품을 사지 않았으므로 빈자리를 채우려고 다른 것을 사지 않았다.','기념품을 샀다면 내가 쓰고 싶은 곳에 두었다. 안 샀다면 빈자리를 채우려고 다른 것을 사지는 않았다.'));
  if(chapter.input.contactAllowed&&chapter.facts.farewellPlan!=='REST_LATER')steps.push(grounded(23,'오늘 잘 자라는 인사를 보냈고 실제 짧은 답을 받았다.','하은에게 오늘 잘 자라는 인사를 보냈다면 짧게 답이 왔다.'));
  else steps.push(mono(23,'오늘 연락을 쉬기로 했다면 조용한 화면이 약속을 어긴 것이 아니었다.'));
  steps.push(mono(23,'나는 내일 입을 옷을 걸어 두었다. 특별한 곳에 가는 옷일 필요는 없었다.'));
  if(chapter.input.contactAllowed)steps.push(mono(23,'내일은 내 마음을 말할 수도, 상대의 마음을 들을 수도 있는 날이었다. 옷을 잘 골라 그 대화를 대신할 수는 없었다.'),mono(23,'침대에 앉아 방을 봤다.'),mono(23,'여행 전과 같은 방이었다. 그런데 이곳에 돌아온 내가 하은을 어떻게 보고 싶은지는 조금 더 알게 된 것 같았다.'),mono(23,'사진 속 웃는 사람만 보고 싶은 게 아니었다.'),mono(23,'빨래를 놓쳤다고 말하는 사람.'),mono(23,'배고프면 먹고, 피곤하면 혼자 쉬고 싶다고 하는 사람.'),mono(23,'내가 모르는 생각을 하다가 자기 말로 들려주는 사람.'),mono(23,'그 사람을 계속 만나고 싶은지, 내일은 더 정확하게 말하고 싶었다.'));
  else steps.push(grounded(23,'나는 침대에 앉아 방을 보고 내일 내 생활을 이어 갈 준비를 했다.','침대에 앉아 방을 봤다.'));
  return steps;
}

function scene24(chapter){
  const agreed=chapter.facts.nextConversation&&chapter.facts.nextConversation!=='NOT_AGREED',comfortable=chapter.input.contactAllowed&&chapter.facts.haeunRelationshipOutcome==='CONTINUE'&&chapter.input.relationshipTone==='CALM',steps=[scene(24,comfortable?'girlfriend':null)];
  if(comfortable){steps.push(mono(24,'하은에게 마지막 메시지가 왔다.'),quoted(24,'**하은** “빨래 끝.”','message','나'),mono(24,'나는 웃으며 답했다.'),quoted(24,'**주인공** “여행 마무리했네.”','message','하은'),quoted(24,'**하은** “아직 널어야 해.”','message','나'),quoted(24,'**주인공** “후속 일정이 있네.”','message','하은'));if(agreed)steps.push(quoted(24,'**하은** “내일 얘기하자.”','message','나'),quoted(24,'**주인공** “응. 잘 자.”','message','하은'));}
  else if(agreed)steps.push(mono(24,'하은과 실제로 정한 대화 시간이 남았다. 다정한 농담을 했다고 그 시간이 없어지는 것은 아니었다.'),mono(24,'나는 내일 상대가 듣고 싶은 말만 고르지 않기로 했다.'));
  else steps.push(mono(24,'나는 내일의 일정을 확인했다. 함께할 사람이 아직 정해지지 않아도 내일 아침을 살 일은 있었다.'),mono(24,'관계를 끝내고 싶다면 현재의 상대에게 먼저 말해야 한다는 생각도 남았다.'));
  steps.push(action(24,'불을 껐다.','lights-out','DAY23 밤 종료'),mono(24,'돌아갈 곳은 같은 주소일 필요가 없었다.'),mono(24,'각자의 집에 돌아와도, 서로의 하루가 궁금할 수 있었다.'),mono(24,'나는 오늘 그 마음이 있는지 조금 더 알았다.'),mono(24,'내일은 그것을 말할 차례였다.'));
  return [...steps,{type:'chapterCompletionCue',day:23,finalSceneReached:true,nextDay:24,source:ref(24,'\\[DAY 23 END\\]')}];
}

function ending(chapter){
  const steps=[];
  if(choseNumber(chapter,17))steps.push(...reaction17(chapter));
  steps.push(...scene22(chapter),...scene23(chapter),...scene24(chapter));
  return steps;
}

export function getDay23V4PlayableEnding(chapter){
  if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');
  if(chapter.phase==='dinner_call')return scene18(chapter);
  if(chapter.phase==='wanted_presence')return [...reaction15(chapter),...scene19(chapter)];
  if(chapter.phase==='conversation_method')return [...(!choseNumber(chapter,16)?reaction15(chapter):reaction16(chapter)),...scene20(chapter)];
  if(chapter.phase==='conversation_resolution')return conversationResolution(chapter);
  if(chapter.phase==='ending')return ending(chapter);
  return [{type:'endingBoundary',nextScene:18,route:chapter.input.route}];
}
