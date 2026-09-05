import {DAY22_V4_SOURCE_SCENES} from './day22-v4-source-registry.mjs';
import {day22V4SourceRef} from './day22-v4-source-selection.mjs';
import {getDay22V4Options,validateDay22V4} from './day22-v4-state-contract.mjs';

const ref=(line)=>day22V4SourceRef(23,line);
const mono=text=>({type:'monologue',text,source:ref(text)});
const quoted=exact=>{const match=exact.match(/^\*\*([^*]+)\*\* “(.*)”$/);if(!match)throw new Error(`DAY22_DIALOGUE_LINE_INVALID:23:${exact}`);return {type:'dialogue',speaker:match[1]==='주인공'?'나':match[1],text:match[2],source:ref(exact)};};
const scene=()=>({type:'sceneDirection',number:23,title:DAY22_V4_SOURCE_SCENES[22].title,location:'home',time:'day',character:null});
const choice=(chapter,number)=>({type:'choice',choiceNumber:number,variant:'NO_TRAVEL',prompt:DAY22_V4_SOURCE_SCENES[22].choices.find(item=>item.number===number).title,options:getDay22V4Options(chapter)});
const last=chapter=>chapter.choices.filter(record=>record.kind==='choice').at(-1)?.id??'';

function opening(chapter){return [scene(),mono('나는 늦게 일어나거나 평소처럼 일어났다. 여행가방은 필요하지 않았다.'),mono('창문을 열고 물을 마셨다. 멀리 간 사람들의 하루가 휴대전화에 보였지만, 내가 오늘 해야 할 일의 정답은 아니었다.'),choice(chapter,3)];}
function reaction3(chapter){const id=last(chapter);if(id.endsWith('_walk_nearby'))return [mono('산책을 고르면 가까운 길을 걸었다. 이미 아는 간판을 지나고, 돌아올 수 있을 만큼만 갔다.')];if(id.endsWith('_small_home_task'))return [mono('집의 일을 고르면 책상 한쪽이나 옷 한 묶음을 정리했다. 집 전체를 바꾸어야 여행만큼 의미 있는 것은 아니었다.')];return [mono('쉼을 고르면 편하게 앉았다. 휴식을 했다는 증명을 찍지 않았다.')];}
function reaction4(){return [mono('나는 실제 가능한 한 끼를 골랐다. 부산에 가지 않았으니 부산 음식을 먹은 기억은 없었다. 그래도 오늘 내가 먹은 맛은 있었다.')];}
function reaction5(){return [mono('사진을 안 찍었으면 그냥 본 것을 기억했다. 연락을 쉬기로 했다면 메시지는 보내지 않았다. 아라와 연락이 없는 사람에게 아라가 답을 주는 일도 없었다.')];}
function reaction6(){return [mono('하은은 자기 하루를 말했다. 그녀도 집에서 쉬었을 수 있고 자기 일이 있었을 수 있었다. 나는 동행하지 않았으니 무엇을 했는지 전부 알려 달라고 하지 않았다.'),mono('아쉽다고 하면 하은은 자기 아쉬움을 말하거나 오늘은 이 선택이 좋았다고 했다.'),quoted('**주인공** “다른 마음이어도 되네.”'),quoted('**하은** “응. 그래도 오늘 못 간 건 같으니까.”'),mono('둘은 조금 웃을 수 있었다.')];}
function reaction7(){return [mono('나는 실제 필요한 것만 했다. 다른 사람과 여행을 안 갔다고 새 연인을 찾아야 하는 하루는 아니었다.')];}
function reaction8(chapter){return [mono('상대가 없는 경우에는 내 하루에 대한 선택이었다. 하은과 연락을 나눴다면 서로 가능한 만큼만 약속했다.'),mono('멀리 떠나지 않은 하루도 끝이 왔다. 오늘을 버렸다는 생각은 들지 않았다.'),{type:'noTravelBoundary',nextScene:24,route:chapter.input.contactAllowed?'CONTACT_AVAILABLE':'SOLO'}];}

export function getDay22V4PlayableNoTravel(chapter){if(!validateDay22V4(chapter))throw new Error('DAY22_INVALID_SAVE');if(chapter.input.route!=='NO_TRAVEL')return [{type:'noTravelBoundary',nextScene:1,route:chapter.input.route}];if(chapter.phase==='no_travel_day')return opening(chapter);if(chapter.phase==='no_travel_meal')return [...reaction3(chapter),choice(chapter,4)];if(chapter.phase==='no_travel_photo')return [...reaction4(),choice(chapter,5)];if(chapter.phase==='no_travel_contact')return [...reaction5(),choice(chapter,6)];if(chapter.phase==='no_travel_evening')return [...(chapter.input.contactAllowed?reaction6():reaction5()),choice(chapter,7)];if(chapter.phase==='no_travel_tomorrow')return [...reaction7(),choice(chapter,8)];if(chapter.phase==='ending')return reaction8(chapter);return [{type:'noTravelBoundary',nextScene:23,route:'NO_TRAVEL'}];}
