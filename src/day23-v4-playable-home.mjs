import {DAY23_V4_SOURCE_SCENES} from './day23-v4-source-registry.mjs';
import {day23V4SourceRef} from './day23-v4-source-selection.mjs';
import {getDay23V4Options,validateDay23V4} from './day23-v4-state-contract.mjs';

const ref=(scene,line)=>day23V4SourceRef(scene,line);
const mono=(scene,text)=>({type:'monologue',text,source:ref(scene,text)});
const grounded=(scene,text,exact)=>({type:'playerNarration',text,source:ref(scene,exact)});
const quoted=(scene,exact,channel='dialogue',recipient)=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY23_DIALOGUE_LINE_INVALID:${scene}:${exact}`);if(channel==='message')return {type:'message',sender:match[1]==='주인공'?'나':match[1],recipient,text:match[2],source:ref(scene,exact)};return {type:'dialogue',speaker:match[1]==='주인공'?'나':match[1],text:match[2],source:ref(scene,exact)};};
const action=(scene,exact,actionId,description,data={})=>({type:'stageAction',action:actionId,description,...data,source:ref(scene,exact)});
const title=number=>DAY23_V4_SOURCE_SCENES.find(item=>item.number===number)?.title??`SCENE ${number}`;
const scene=(number,character=null,time='evening')=>({type:'sceneDirection',number,title:title(number),location:'home',time,character});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,options:getDay23V4Options(chapter)});
const lastChoice=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??'';
const photoAvailable=chapter=>chapter.input.landscapePhotoExists||chapter.input.sharedPhotoKept||chapter.facts.sharedPhotoToday;

function scene13(chapter){
  const steps=[scene(13,null,'afternoon')];
  if(chapter.input.route==='BUSAN_TRIP')steps.push(mono(13,'문을 열자 익숙한 공기가 들어왔다.'),mono(13,'가방을 내려놓고 잠깐 서 있었다. 방은 내가 떠날 때의 모습으로 기다리고 있었다. 내가 닦아 놓은 곳도, 미뤄 둔 것도 그대로였다.'),mono(13,'신발을 벗고 손을 씻었다.'),mono(13,'여행에서 돌아왔다고 바로 다른 사람이 된 것은 아니었다. 수건을 찾는 손은 익숙한 곳으로 갔다.'));
  else steps.push(grounded(13,'어제 이미 돌아온 내 방에서 평소 물건을 정리하고 오늘의 생활을 이어 갔다.','어제 서울에서 돌아왔거나 여행하지 않은 사람도 자기 방의 하루를 살았다. 가방이 없다면 가방을 푸는 대신 평소 물건을 정리했다.'));
  return [...steps,choice(chapter,11)];
}

function reaction11(chapter){
  const id=lastChoice(chapter),busan=chapter.input.route==='BUSAN_TRIP';
  if(id.endsWith('_unpack'))return busan?[mono(13,'입은 옷과 안 입은 옷을 나눴다. 한 번에 다 끝내려고 하지 않았다.'),mono(13,'쓸 물건을 제자리에 놓자 가방 안에 빈자리가 생겼다.')]:[grounded(13,'가방 대신 평소 물건을 필요한 자리부터 정리했다.','어제 서울에서 돌아왔거나 여행하지 않은 사람도 자기 방의 하루를 살았다. 가방이 없다면 가방을 푸는 대신 평소 물건을 정리했다.')];
  if(id.endsWith('_water'))return [mono(13,'물 한 잔을 마셨다. 앉자마자 다시 일어나야 할 것 같았지만 잠깐 그대로 있었다.'),mono(13,'몸이 이동을 끝냈다는 것을 마음보다 먼저 알게 해 주고 싶었다.')];
  return [mono(13,'냉장고를 열었다. 먹을 수 있는 것과 오늘 새로 필요한 것을 봤다.'),mono(13,'여행에서 좋은 것을 먹었어도 지금 배가 고프면 또 먹어야 했다. 그 평범한 사실이 이상하게 안심됐다.')];
}

function scene14(chapter){
  const steps=[scene(14,chapter.input.contactAllowed?'girlfriend':null,'afternoon')];
  if(chapter.input.route==='BUSAN_TRIP')steps.push(mono(14,'빨랫감을 모으다가 양말 한 짝이 보이지 않았다.'),mono(14,'나는 가방 안을 다시 봤다. 분명 같이 넣은 것 같았는데 없었다.'),mono(14,'조금 뒤 바지 안에서 나왔다.'));
  else steps.push(grounded(14,'빨랫감을 정리하다 양말 한 짝이 바지 안에서 나왔다. 이미 푼 여행 가방을 다시 찾지는 않았다.','조금 뒤 바지 안에서 나왔다.'));
  steps.push(mono(14,'나는 혼자 웃었다.'));
  if(chapter.input.contactAllowed&&chapter.facts.farewellPlan!=='REST_LATER')steps.push(quoted(14,'**주인공** “양말 한 짝이 바지 안에서 여행 연장하고 있었어.”','message','하은'),quoted(14,'**하은** “발견했네.”','message','나'),quoted(14,'**주인공** “무사 귀환.”','message','하은'),quoted(14,'**하은** “나는 빨래 넣고 나서 수건 하나 찾았어.”','message','나'),mono(14,'나는 웃었다.'));
  return [...steps,choice(chapter,12)];
}

function reaction12(chapter){
  const id=lastChoice(chapter);
  if(id.endsWith('_share_haeun'))return [quoted(14,'**하은** “나도. 지금 손이 좀 바빠서 답은 느릴 수 있어.”','message','나'),quoted(14,'**주인공** “응. 빨래가 먼저.”','message','하은'),quoted(14,'**하은** “경쟁 상대가 특이하네.”','message','나'),mono(14,'나는 웃고 휴대전화를 내려놓았다. 그녀가 자기 일을 마칠 시간을 가져도 됐다.')];
  if(id.endsWith('_tell_jihoon'))return [quoted(14,'**주인공** “집 왔어.”','message','지훈'),grounded(14,'지훈은 고생했다며 쉬라고 답했다. 모든 연애 대화를 보고하지는 않았다.','그 농담을 실제로 나눴다면 나는 웃었다. 아니면 지훈은 “고생했다. 좀 쉬어”라고 했다.'),mono(14,'그에게 모든 연애 대화를 보고하지 않았다. 잘 다녀왔다는 내 말이면 오늘 안부로 충분했다.')];
  return [mono(14,'나는 양말을 빨랫감 쪽에 넣었다. 누군가에게 보내지 않아도 재미있었던 일은 사라지지 않았다.'),mono(14,'내 생활의 작은 장면이 모두 관계를 증명하는 재료가 될 필요는 없었다.')];
}

function scene15(chapter){
  const available=photoAvailable(chapter),steps=[scene(15,chapter.input.contactAllowed&&available?'girlfriend':null,'afternoon')];
  if(chapter.input.contactAllowed&&available&&chapter.facts.returnRide==='ONE_PHOTO')steps.push(mono(15,'하은과 사진을 보기로 했다면 연락이 왔다.'),quoted(15,'**하은** “나는 한 장 골랐어.”','message','나'),quoted(15,'**주인공** “벌써?”','message','하은'),quoted(15,'**하은** “고르다가 빨래 생각나서 빨리 골랐어.”','message','나'),mono(15,'나는 웃었다.'),grounded(15,'하은은 실제로 남겨 둔 사진 중 하나를 보냈다.','그녀가 보낸 것은 실제로 남겨 둔 사진 중 하나였다. 풍경이 크게 나온 사진일 수도, 우리가 웃던 사진일 수도 있었다.'));
  else if(available)steps.push(grounded(15,'나는 실제로 남아 있는 사진을 열었다. 하은에게서 새 사진이 왔다고 만들지는 않았다.','나는 다른 사진을 더 좋아할 수 있었다.'));
  else steps.push(grounded(15,'오늘 기억에 남는 장면 하나를 혼자 떠올렸다.','사진이 없거나 같이 보기로 하지 않은 날에는 오늘 기억에 남는 장면을 혼자 떠올리거나 다음에 말할 수 있었다. 없던 사진이 도착하지 않았다.'));
  return [...steps,choice(chapter,13)];
}

function reaction13(chapter){
  const id=lastChoice(chapter),available=photoAvailable(chapter),contact=chapter.input.contactAllowed;
  if(id.endsWith('_one_photo')&&available){const kind=chapter.facts.sharedPhotoToday?'DAY23_SHARED_PHOTO':chapter.input.landscapePhotoExists?'DAY22_LANDSCAPE_PHOTO':'DAY22_SHARED_PHOTO';const steps=[action(15,'내가 고른 사진을 보냈다.','send-selected-photo',`실제로 보존한 ${kind} 한 장을 선택`,{recipient:contact?'하은':null})];if(contact){if(chapter.input.sharedPhotoKept||chapter.facts.sharedPhotoToday)steps.push(quoted(15,'**하은** “나는 그 사진에서 뒤쪽을 보고 있었는데.”','message','나'),quoted(15,'**주인공** “나는 네가 웃는 걸 봤어.”','message','하은'));else steps.push(grounded(15,'나는 사진에서 실제로 좋았던 빛이나 작은 풍경을 말했다. 얼굴이 있는 것처럼 바꾸지 않았다.','그녀의 얼굴이 없는 사진이면 나는 실제로 좋았던 빛이나 작은 풍경을 말했다. 얼굴이 있는 것처럼 대사를 바꾸지는 않았다.'));steps.push(quoted(15,'**하은** “같은 사진에도 다른 걸 보네.”','message','나'),quoted(15,'**주인공** “그래서 한 장씩 고르길 잘했다.”','message','하은'));}return steps;}
  if(id.endsWith('_next_time'))return [grounded(15,'사진은 실제로 만날 수 있을 때 함께 보기로 했다. 곧 내일 만난다는 약속은 만들지 않았다.','하은은 좋다고 했다. 다음 만남이 아직 정해지지 않았으면 사진을 볼 약속이 곧 내일 데이트가 되지는 않았다. 만날 수 있을 때 같이 보면 됐다.')];
  return contact&&available?[quoted(15,'**하은** “좋아. 오늘 다 정리해야 하는 건 아니니까.”','message','나'),mono(15,'나는 앨범을 닫았다. 사진을 분류하지 않았다고 여행이 끝나지 못한 것은 아니었다.')]:[grounded(15,'오늘은 사진을 새로 만들거나 정리하지 않고 기억에 남는 장면만 두었다.','사진이 없거나 같이 보기로 하지 않은 날에는 오늘 기억에 남는 장면을 혼자 떠올리거나 다음에 말할 수 있었다. 없던 사진이 도착하지 않았다.')];
}

function scene16or17(chapter){
  if(chapter.phase==='pending_contact'){
    const contacts=[...chapter.input.pendingContacts],steps=[scene(16,null,'evening'),mono(16,'휴대전화의 다른 대화창을 보았다.'),action(16,'유리 씨와 실제로 남겨 둔 말이 있다면 그 이름이 있었다. 서진이나 아라와 대화가 이어진 경우에는 아직 답하지 않은 문장이 있을 수 있었다.','show-pending-contacts','실제로 미완료인 대화만 표시',{contacts}),mono(16,'나는 오늘 사진을 고른 뒤의 기분으로 그 대화들을 덮어 두고 싶어졌다. 하은과 좋았으니 다른 일도 정리된 것 같은 마음이었다.'),mono(16,'하지만 내가 하지 않은 말은 여전히 하지 않은 말이었다.')];
    return [...steps,choice(chapter,14)];
  }
  return [scene(17,null,'evening'),mono(17,'휴대전화를 내려놓았다.'),mono(17,'내가 누군가에게 답을 남겨 둔 사람이 아니라는 사실을 확인하기 위해, 새로운 대화창을 찾을 필요는 없었다.'),mono(17,'그런데 내 안에 남겨 둔 말은 있었다.'),mono(17,'기억이 더 돌아오면 더 잘할 수 있을 텐데.'),mono(17,'몸이 더 좋아지면 더 근사한 데를 갈 수 있을 텐데.'),mono(17,'돈이 조금 더 있으면 덜 걱정할 텐데.'),mono(17,'틀린 말은 아니었다. 미래에 달라질 수 있는 것은 있었다.'),mono(17,'다만 지금 하은이 보고 싶은 마음까지 그때 말할 이유는 없었다.'),choice(chapter,14)];
}

function reaction14(chapter){
  const id=lastChoice(chapter),pending=chapter.input.pendingContacts,recipient=pending[0];
  if(id.includes('_main_')){
    if(id.endsWith('_align_relationship'))return [grounded(16,`${recipient}에게 전에 애매하게 말한 내용을 정정했다.`,'실제 애매하게 말한 내용이 있는 사람에게만 그렇게 시작했다. 상대의 답이 바로 오지 않아도 여행 사진을 다시 열어 기다림을 피하지 않았다.'),quoted(16,'**주인공** “내가 전에 애매하게 말한 게 있어서 정정하고 싶어요.”','message',recipient)];
    if(id.endsWith('_name_uncertainty'))return [grounded(16,'하은에게 이야기할 시간을 먼저 물었다. 지금 긴 설명을 강요하거나 기다림을 무기한으로 만들지 않았다.','나는 하은에게 이야기할 시간을 물어야 했다. 지금 바로 긴 설명을 읽으라고 보내기 전에, 오늘 그런 대화를 할 여유가 있는지 생각했다.')];
    return [mono(16,'나는 다른 사람에게 먼저 만나자고 보내려던 손을 멈췄다.'),mono(16,'하은이 여행에서 웃었다는 사실이 내가 계속 만날 마음을 대신 만들어 주지는 않았다. 그렇다고 새로운 사람이 나를 받아 줄 때까지 하은에게 모르는 척할 수는 없었다.'),mono(16,'나는 그녀에게 관계에 대해 말하고 싶다고 전할 준비를 했다.'),mono(16,'좋은 여행을 했다는 것과 지금 마음을 말해야 한다는 것은 같이 있었다.')];
  }
  if(id.endsWith('_keep_meeting'))return [mono(17,'나는 그 마음을 하은에게 전했다. 그녀가 같은 마음인지 듣는 일도 남겼다.'),mono(17,'오늘 좋은 시간을 보냈으니 당연히 같을 거라고 쓰지 않았다.')];
  if(id.endsWith('_future_talk'))return [mono(17,'하은이 지금은 피곤하다고 하면 가능한 때를 물었다. 미래 이야기가 곧 결혼 날짜를 정하는 회의는 아니었다.'),mono(17,'같이 살고 싶은지, 어떤 관계가 편한지, 아직 모르는 게 무엇인지 이야기할 수 있었다.')];
  return [mono(17,'나는 짧게 적었다.'),quoted(17,'**주인공** “집에 왔는데 네가 조금 보고 싶어.”','message','하은'),mono(17,'문장을 보내고 나서 방을 둘러봤다. 집이 싫어진 것은 아니었다. 혼자 쉬는 것도 좋았다.'),mono(17,'그런데 하은의 목소리를 듣고 싶었다.')];
}

export function getDay23V4PlayableHome(chapter){
  if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');
  if(chapter.input.route==='NO_TRAVEL')return [{type:'homeBoundary',nextScene:21,route:'NO_TRAVEL'}];
  if(chapter.phase==='home_arrival')return scene13(chapter);
  if(chapter.phase==='small_share')return [...reaction11(chapter),...scene14(chapter)];
  if(chapter.phase==='photo_review')return [...reaction12(chapter),...scene15(chapter)];
  if(chapter.phase==='pending_contact'||chapter.phase==='self_intent')return [...reaction13(chapter),...scene16or17(chapter)];
  if(chapter.phase==='dinner_call')return [...reaction14(chapter),{type:'homeBoundary',nextScene:18,route:chapter.input.route}];
  return [{type:'homeBoundary',nextScene:13,route:chapter.input.route}];
}
