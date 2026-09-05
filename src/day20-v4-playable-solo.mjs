import {DAY20_V4_SOURCE_SCENES} from './day20-v4-source-registry.mjs';
import {day20V4SourceRef} from './day20-v4-source-selection.mjs';
import {getDay20V4Options,validateDay20V4} from './day20-v4-state-contract.mjs';

const ref=(scene,line)=>day20V4SourceRef(scene,line);
const mono=(scene,text)=>({type:'monologue',text,source:ref(scene,text)});
const quoted=(scene,exact,device=null)=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY20_DIALOGUE_LINE_INVALID:${scene}:${exact}`);const speaker=match[1]==='주인공'?'나':match[1];return {type:device?'message':'dialogue',speaker,...(device?{sender:speaker,device}:{}),text:match[2],source:ref(scene,exact)};};
const scene=number=>({type:'sceneDirection',number,title:DAY20_V4_SOURCE_SCENES[number-1].title,location:'home-night',time:'night',character:null});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,prompt:DAY20_V4_SOURCE_SCENES.flatMap(item=>item.choices).find(item=>item.number===number&&item.variant==='SOLO').title,options:getDay20V4Options(chapter)});
const last=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??'';

function reaction5(chapter){const id=last(chapter);if(id.endsWith('_tell_jihoon'))return [mono(23,'지훈에게는 의자 위 옷을 구분하던 이야기를 했다.'),quoted(23,'**지훈** “옷이 의자에 적응했네.”','phone'),quoted(23,'**주인공** “내가 빼앗았어.”','phone'),quoted(23,'**지훈** “주거 문제 심각하다.”','phone'),mono(23,'나는 웃었다. 지훈이 바빠 답하지 않으면 그 대화는 나중에 이어질 수 있었다.')];if(id.endsWith('_light_check_in'))return [mono(23,'하은에게 보낸다면 그녀의 답이 내 기대만큼 길지 않을 수도 있었다. 나는 길이를 재지 않았다. 내가 쉬고 싶을 때 짧게 답했던 날도 있었다.')];return [mono(23,'혼자 두기로 했다면 오늘의 음악을 들었다. 누군가에게 설명하지 않은 기분도 내 것이었다.')];}
function reaction6(chapter){const id=last(chapter);if(id.endsWith('_one_song'))return [mono(23,'음악을 고르면 곡이 끝날 때까지 다른 곡을 찾지 않았다.')];if(id.endsWith('_few_pages'))return [mono(23,'책을 고르면 정한 분량을 성취하려 하지 않고 읽히는 만큼 읽었다.')];return [mono(23,'누웠다면 휴대전화를 손이 닿지 않는 곳에 뒀다가 불편하면 다시 가져와도 됐다. 쉬는 방법을 잘못 골랐다고 혼내는 사람은 없었다.')];}
function reaction7(){return [mono(23,'나는 하나만 골랐다. 첫 선택에서 다 해놓았다면 다시 일을 만들지 않았다. 누군가 오지 않아도 내 방에 내일이 오는 건 같았다.')];}
function reaction8(chapter){const id=last(chapter),steps=[];if(id.endsWith('_rest_today'))steps.push(mono(23,'하은이 답하지 않았다고 자정을 넘겨 확인 문자를 쌓지 않았다.'));else steps.push(mono(23,'하은과 연락이 가능한 사이면 실제 메시지를 보냈다. 그녀가 거리를 요청한 상태에서는 보내지 않고 내일 합의한 연락만 남겼다.'));return [...steps,mono(23,'혼자였던 저녁에 포옹이나 숙박은 없었다.'),mono(23,'그렇다고 내가 오늘을 덜 산 것은 아니었다. 식사를 했고, 내 방에서 내 시간을 보냈다.')];}
function ending(chapter){return [...reaction8(chapter),scene(24),mono(24,'컵 하나를 엎어 두었다.'),mono(24,'오늘 함께한 사람이 없다고 방 안의 시간이 비어 있지는 않았다.'),{type:'chapterCompletionCue',day:20,finalSceneReached:true}];}

export function getDay20V4PlayableSolo(chapter){if(!validateDay20V4(chapter)||chapter.input.visitMode!=='SOLO')throw new Error('DAY20_INVALID_SOLO_SAVE');if(chapter.phase==='solo_time')return [...reaction5(chapter),choice(chapter,6)];if(chapter.phase==='solo_tomorrow')return [...reaction6(chapter),choice(chapter,7)];if(chapter.phase==='solo_contact')return [...reaction7(chapter),choice(chapter,8)];if(chapter.phase==='ending')return ending(chapter);return [{type:'soloBoundary',nextScene:23}];}
