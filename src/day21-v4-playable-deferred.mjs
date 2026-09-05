import {DAY21_V4_SOURCE_SCENES} from './day21-v4-source-registry.mjs';
import {day21V4SourceRef} from './day21-v4-source-selection.mjs';
import {getDay21V4Options,validateDay21V4} from './day21-v4-state-contract.mjs';

const ref=(scene,line)=>day21V4SourceRef(scene,line);
const mono=(scene,text)=>({type:'monologue',text,source:ref(scene,text)});
const act=(scene,exact,status,actionLabel)=>({type:'stageAction',status,actionLabel,source:ref(scene,exact)});
const quotedMessage=(scene,exact)=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY21_MESSAGE_LINE_INVALID:${scene}:${exact}`);const sender=match[1]==='주인공'?'나':match[1];return {type:'message',speaker:sender,sender,device:'message',text:match[2],source:ref(scene,exact)};};
const scene=number=>({type:'sceneDirection',number,title:DAY21_V4_SOURCE_SCENES[number-1].title,location:'home',time:number===21?'evening':'night',character:null});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,variant:'DEFERRED',prompt:DAY21_V4_SOURCE_SCENES.flatMap(item=>item.choices).find(item=>item.number===number&&item.variant==='DEFERRED').title,options:getDay21V4Options(chapter)});
const last=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??'';
const selectedMessage=(chapter,number)=>{const option=DAY21_V4_SOURCE_SCENES[20].choices.find(item=>item.number===number&&item.variant==='DEFERRED').labels.find((label,index)=>last(chapter)===getDeferredIds(number)[index]);if(!option)return null;const exact=`- “${option}”`;return {type:'message',speaker:'나',sender:'나',device:'message',text:option,source:ref(21,exact)};};
const suffixes={4:['reflect_reason','check_minho_date','eat_first'],5:['fear_bad_listener','mind_too_busy','name_avoidance'],6:['defer_travel','solo_nearby','short_walk_if_mutual'],7:['put_one_thing_away','finish_promised_reply','rest_enough'],8:['rest_today','talk_when_possible','check_my_mind']};
const getDeferredIds=number=>suffixes[number].map(suffix=>`day21_v4_c${number}_deferred_${suffix}`);

function opening(chapter){const steps=[scene(21),mono(21,'나는 내 방에 앉았다. 하은이 하고 싶었던 이야기가 무엇이었을지 궁금했다.'),mono(21,'그렇다고 그녀의 하루를 내가 써 넣을 수는 없었다.')];if(chapter.input.contactAllowed)steps.push(quotedMessage(21,'**주인공** “오늘 이야기하자고 했던 거, 내가 바로 못 들어서 미안해.”'),quotedMessage(21,'**하은** “괜찮아. 나도 다음에 같은 얘기부터 할지는 모르겠어.”'),quotedMessage(21,'**주인공** “응. 그때 네가 하고 싶은 얘기를 듣고 싶어.”'));else steps.push(mono(21,'하은이 오늘 연락도 쉬고 싶다면 이 메시지도 나중으로 남겼다.'));return [...steps,choice(chapter,4)];}

function reaction4(chapter){const id=last(chapter);if(id.endsWith('_reflect_reason'))return [mono(21,'첫 선택을 하면 나는 두려웠는지 피곤했는지 생각했다. 상대의 이야기 내용 대신 내 마음을 보았다.')];if(id.endsWith('_check_minho_date'))return [act(21,'둘째는 실제 답하기로 했던 일이 있을 때만 연락했다. 새 업무가 생긴 것처럼 쓰지 않았다.','check-promised-date','실제로 답하기로 한 민호 연락 날짜만 확인함')];return [mono(21,'셋째는 간단히 식사했다. 어려운 대화를 못 했다고 생활까지 미룰 필요는 없었다.')];}

function reaction5(chapter){const steps=[];if(chapter.input.contactAllowed){const message=selectedMessage(chapter,5);if(message)steps.push(message);steps.push(mono(21,'하은이 연락에 응한다면 내 이유를 전했다. 그녀는 이해할 수도, 서운함을 말할 수도 있었다.'),quotedMessage(21,'**하은** “너한테 말하려고 마음먹은 게 오늘이었어서 조금 아쉽기는 해.”'),quotedMessage(21,'**주인공** “응. 네가 그랬다는 건 듣고 싶어.”'));}steps.push(mono(21,'나는 못 들은 이야기가 없던 일이 된 것처럼 내일 여행부터 제안하지 않았다.'));return steps;}

function reaction6(chapter){const id=last(chapter);if(id.endsWith('_short_walk_if_mutual')&&chapter.input.contactAllowed)return [mono(21,'하은이 실제로 응한 약속만 만들었다. 혼자 가는 하루에 다른 사람을 빈자리처럼 초대하지 않았다.')];return [mono(21,'하은이 실제로 응한 약속만 만들었다. 혼자 가는 하루에 다른 사람을 빈자리처럼 초대하지 않았다.')];}
function reaction7(){return [mono(21,'나는 하나를 골랐다. 미뤄 둔 대화가 있다고 나를 벌주는 시간을 만들지는 않았다.')];}

function ending(chapter){const steps=[];if(chapter.input.contactAllowed){const message=selectedMessage(chapter,8);if(message)steps.push(message);}else steps.push(mono(21,'연락하지 않기로 했다면 보내지 않았다. 내일 여행도 확정된 경우에만 이어졌다.'));steps.push(mono(21,'오늘 하지 않은 대화는 내일의 추억에 포함되지 않았다.'),scene(24),act(24,'불을 끄고 누웠다.','lights-out','불을 끄고 누움'),mono(24,'오늘 이야기를 듣지 않은 날이면 나는 모르는 부분을 그대로 남겼다.'),mono(24,'다음에 그녀가 말하고 싶을 때, 내가 들을 수 있었으면 했다.'),act(24,'화면이 천천히 어두워진다.','fade-out','화면이 천천히 어두워짐'),{type:'chapterCompletionCue',day:21,finalSceneReached:true});return steps;}

export function getDay21V4PlayableDeferred(chapter){if(!validateDay21V4(chapter))throw new Error('DAY21_INVALID_SAVE');if(chapter.facts.conversationMode!=='DEFERRED')return [{type:'deferredBoundary',nextScene:17,route:chapter.facts.conversationMode}];if(chapter.phase==='deferred_reflect')return opening(chapter);if(chapter.phase==='deferred_explain')return [...reaction4(chapter),...choiceArray(chapter,5)];if(chapter.phase==='deferred_tomorrow')return [...reaction5(chapter),...choiceArray(chapter,6)];if(chapter.phase==='deferred_task')return [...reaction6(chapter),...choiceArray(chapter,7)];if(chapter.phase==='deferred_goodnight')return [...reaction7(),...choiceArray(chapter,8)];if(chapter.phase==='ending')return ending(chapter);return [{type:'deferredBoundary',nextScene:21,route:'DEFERRED'}];}
function choiceArray(chapter,number){return [choice(chapter,number)];}
