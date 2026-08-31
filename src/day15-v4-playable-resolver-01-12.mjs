import {DAY15_V4_CHOICE_IDS} from "./day15-v4-campaign-data.mjs";
import {DAY15_V4_SOURCE_REGISTRY_01_12} from "./day15-v4-source-registry-01-12.mjs";
import {parseDay15V4SourceSteps} from "./day15-v4-playable-script-13-24.mjs";

const f=Object.freeze;
const flagsOf=state=>state?.storyFlags??{};
const bodyOf=scene=>{const source=scene.sourceMarkdown.replace(/\r\n/g,"\n"),index=source.indexOf("\n");if(index<0)throw new Error(`DAY15_V4_FRONT_BODY_MISSING:${scene.number}`);return source.slice(index+1);};
function markerIndex(text,marker,after=0){
  const first=text.indexOf(marker),last=text.lastIndexOf(marker);
  if(first<0)throw new Error(`DAY15_V4_FRONT_SOURCE_MARKER_MISSING:${marker}`);
  if(first!==last)throw new Error(`DAY15_V4_FRONT_SOURCE_MARKER_DUPLICATE:${marker}`);
  if(first<after)throw new Error(`DAY15_V4_FRONT_SOURCE_MARKER_ORDER:${marker}`);
  return first;
}
const before=(text,marker)=>text.slice(0,markerIndex(text,marker)).trim();
const from=(text,marker)=>text.slice(markerIndex(text,marker)).trim();
const between=(text,start,end)=>{const startIndex=markerIndex(text,start),endIndex=end==null?text.length:markerIndex(text,end,startIndex+start.length);if(endIndex<=startIndex)throw new Error(`DAY15_V4_FRONT_SOURCE_MARKER_ORDER:${start}:${end}`);return text.slice(startIndex,endIndex).trim();};
// Resolver slices never include the canonical option-list block. Only remove the
// source-facing choice heading; a legitimate narrative line beginning with "- "
// must survive unchanged.
const removeChoiceSyntax=text=>text.split("\n").filter(line=>!/^### (?:자기 오후 )?선택 \d+(?:\s|$)/.test(line)).join("\n").trim();

const ALLOWED=f({
  1:f({INVITED:f(["day15_v4_invitation_attend","day15_v4_invitation_own_time","day15_v4_invitation_admit_tension"]),NOT_INVITED:f(["day15_v4_invitation_no_invite"])}),
  2:f(["day15_v4_outfit_comfort","day15_v4_outfit_for_haeun","day15_v4_outfit_admit_self_conscious"]),
  3:f({ATTEND:f(["day15_v4_gallery_ask","day15_v4_gallery_observe","day15_v4_gallery_pretend"]),OWN_AFTERNOON:f(["day15_v4_own_reread","day15_v4_own_skip","day15_v4_own_stop"])}),
  4:f({ATTEND:f(["day15_v4_view_ask_preference","day15_v4_view_share_perception","day15_v4_view_compare_with_siwoo"]),OWN_AFTERNOON:f(["day15_v4_own_question","day15_v4_own_write","day15_v4_own_rest"])}),
  5:f({ATTEND:f(["day15_v4_rest_separate","day15_v4_rest_together","day15_v4_rest_leave"]),OWN_AFTERNOON:f(["day15_v4_own_continue","day15_v4_own_get_air","day15_v4_own_eat"])}),
  6:f(["day15_v4_cafe_inner","day15_v4_cafe_window","day15_v4_cafe_go_home"]),
  7:f(["day15_v4_conflict_jealousy","day15_v4_conflict_insecurity","day15_v4_conflict_control"])
});

function route(flags){
  const value=flags.day15V4AttendanceRoute;
  if(!["ATTEND","OWN_AFTERNOON",null,undefined].includes(value))throw new Error(`DAY15_V4_FRONT_ATTENDANCE_ROUTE_INVALID:${value}`);
  return value;
}
function allowedIds(flags,number){
  if(number===1){const invitation=flags.day15V4GalleryInvitation;if(!["INVITED","NOT_INVITED"].includes(invitation))throw new Error(`DAY15_V4_FRONT_INVITATION_INVALID:${invitation}`);return ALLOWED[1][invitation];}
  if(number>=3&&number<=5){const attendance=route(flags);if(!["ATTEND","OWN_AFTERNOON"].includes(attendance))throw new Error(`DAY15_V4_FRONT_ROUTE_UNRESOLVED:${number}`);return ALLOWED[number][attendance];}
  return ALLOWED[number];
}
function selectedId(flags,number){
  const direct=flags[`day15V4Choice${number}`]??null,history=(flags.day15V4SelectedChoiceIds??[]).find(id=>DAY15_V4_CHOICE_IDS.get(id)===number)??null,id=direct??history;
  if(id!=null&&DAY15_V4_CHOICE_IDS.get(id)!==number)throw new Error(`DAY15_V4_FRONT_CHOICE_INVALID:${number}:${id}`);
  if(direct!=null&&history!=null&&direct!==history)throw new Error(`DAY15_V4_FRONT_CHOICE_MIRROR:${number}`);
  if(id!=null&&!allowedIds(flags,number).includes(id))throw new Error(`DAY15_V4_FRONT_CHOICE_ROUTE_INVALID:${number}:${id}`);
  return id;
}
function selectedResponse(common,reactions,id,number){
  const reaction=id==null?"":reactions[id];if(id!=null&&reaction==null)throw new Error(`DAY15_V4_FRONT_REACTION_MISSING:${number}:${id}`);
  return {markdown:[common,reaction].filter(Boolean).join("\n"),reactionMarkdown:reaction,branches:[id].filter(Boolean)};
}

function resolve1(body,flags,id){
  const invite="### 함께 보자는 초대",notice="### 다녀오겠다는 연락",choice="### 선택 1 — 오늘의 초대 앞에서";
  const common=before(body,invite),routeText=flags.day15V4GalleryInvitation==="INVITED"?between(body,invite,notice):between(body,notice,choice),responses=from(body,choice);
  const reactions={
    day15_v4_invitation_attend:between(responses,"함께 가겠다는 답에", "두 번째 답에는"),
    day15_v4_invitation_own_time:between(responses,"두 번째 답에는", "세 번째에는"),
    day15_v4_invitation_admit_tension:[between(responses,"세 번째에는", "초대가 없는 아침에는"),from(responses,"긴장된 마음을 말하면")].join("\n"),
    day15_v4_invitation_no_invite:between(responses,"초대가 없는 아침에는", "긴장된 마음을 말하면")
  };
  return selectedResponse([common,routeText].join("\n"),reactions,id,1);
}
function resolve2(body,flags,id){
  const marker="### 선택 2 — 오늘 거울 앞에서",common=before(body,marker),responses=from(body,marker),routeClose=from(responses,"따로 보내는 날에는");
  const reactions={
    day15_v4_outfit_comfort:between(responses,"편한 옷을 고르면", "하은에게 보여 주고 싶은 옷을 고르면"),
    day15_v4_outfit_for_haeun:between(responses,"하은에게 보여 주고 싶은 옷을 고르면", "세 번째에는"),
    day15_v4_outfit_admit_self_conscious:between(responses,"세 번째에는", "따로 보내는 날에는")
  };
  const resolved=selectedResponse(common,reactions,id,2);
  const ownClose=id!=null&&route(flags)==="OWN_AFTERNOON"?routeClose:"";
  return {...resolved,markdown:[resolved.markdown,ownClose].filter(Boolean).join("\n"),reactionMarkdown:[resolved.reactionMarkdown,ownClose].filter(Boolean).join("\n"),branches:[...resolved.branches,...(ownClose?["OWN_AFTERNOON_OUTFIT_CLOSE"]:[])]};
}
function resolve3(body,flags){
  const own="### 자기 오후의 입구",attendance=route(flags);if(!attendance)throw new Error("DAY15_V4_FRONT_ROUTE_UNRESOLVED:3");
  return {markdown:attendance==="ATTEND"?before(body,own):from(body,own),reactionMarkdown:"",branches:[attendance]};
}
function resolve4(body,id){
  const marker="### 선택 3 — 아직 잘 모르겠을 때",common=before(body,marker),responses=from(body,marker),reactions={
    day15_v4_gallery_ask:between(responses,"질문을 하면", "먼저 보겠다고 하면"),
    day15_v4_gallery_observe:between(responses,"먼저 보겠다고 하면", "아는 척하면"),
    day15_v4_gallery_pretend:from(responses,"아는 척하면")
  };return selectedResponse(common,reactions,id,3);
}
function resolve6(body,flags){
  const attendance=route(flags),own="### 자기 자리의 한 줄 — 전시에 가지 않은 오후";if(!attendance)throw new Error("DAY15_V4_FRONT_ROUTE_UNRESOLVED:6");
  if(attendance==="ATTEND")return {markdown:before(body,own),reactionMarkdown:"",reactionMarkdownByChoice:f({}),branches:["ATTEND"],nextChoiceNumber:null};
  const c3="### 자기 오후 선택 3 — 잘 모르겠는 문장 앞에서",c4="### 자기 오후 선택 4 — 내가 궁금한 것",c5="### 자기 오후 선택 5 — 이제 어디로";
  const prelude=between(body,own,c3),block3=between(body,c3,c4),block4=between(body,c4,c5),block5=from(body,c5),ids=[selectedId(flags,3),selectedId(flags,4),selectedId(flags,5)];
  if(ids.some((id,index)=>id!=null&&ids.slice(0,index).some(previous=>previous==null)))throw new Error("DAY15_V4_FRONT_OWN_CHOICES_OUT_OF_ORDER");
  const reactions=f({
    3:f({day15_v4_own_reread:between(block3,"**다시 읽는다**","**건너뛴다**"),day15_v4_own_skip:between(block3,"**건너뛴다**","**덮는다**"),day15_v4_own_stop:from(block3,"**덮는다**")}),
    4:f({day15_v4_own_question:between(block4,"**질문을 적는다**","**내 생각을 적는다**"),day15_v4_own_write:between(block4,"**내 생각을 적는다**","**쉰다**"),day15_v4_own_rest:from(block4,"**쉰다**")}),
    5:f({day15_v4_own_continue:between(block5,"더 읽으면", "바람을 쐬면"),day15_v4_own_get_air:between(block5,"바람을 쐬면", "먹거나 쉬려면"),day15_v4_own_eat:from(block5,"먹거나 쉬려면")})
  });
  const reactionByChoice={},parts=[prelude],branches=["OWN_AFTERNOON"];
  for(let index=0;index<ids.length;index++){const number=index+3,id=ids[index];if(id==null)break;const reaction=reactions[number][id];if(reaction==null)throw new Error(`DAY15_V4_FRONT_REACTION_MISSING:${number}:${id}`);reactionByChoice[number]=reaction;parts.push(reaction);branches.push(id);}
  return {markdown:parts.join("\n"),reactionMarkdown:"",reactionMarkdownByChoice:f(reactionByChoice),branches,nextChoiceNumber:ids.findIndex(id=>id==null)<0?null:ids.findIndex(id=>id==null)+3};
}
function resolve7(body,id){
  const marker="### 선택 4 — 하은이 보는 쪽",responses=from(body,marker),reactions={
    day15_v4_view_ask_preference:between(responses,"첫 질문에", "함께 보자고 하면"),
    day15_v4_view_share_perception:between(responses,"함께 보자고 하면", "마지막 질문에는"),
    day15_v4_view_compare_with_siwoo:from(responses,"마지막 질문에는")
  };return selectedResponse("",reactions,id,4);
}
function resolve9(body,id){
  const marker="### 선택 5 — 남은 전시를 보는 방법",common=before(body,marker),responses=from(body,marker),reactions={
    day15_v4_rest_separate:between(responses,"첫 답에", "두 번째에는"),
    day15_v4_rest_together:between(responses,"두 번째에는", "세 번째에는"),
    day15_v4_rest_leave:from(responses,"세 번째에는")
  };return selectedResponse(common,reactions,id,5);
}
function resolve10(body,flags){
  const together="### 끝까지 함께 본 자리",decision=flags.day15V4RestDecision;
  if(!["SEPARATE","TOGETHER","LEAVE"].includes(decision))throw new Error(`DAY15_V4_FRONT_REST_DECISION_INVALID:${decision}`);
  return {markdown:decision==="TOGETHER"?from(body,together):before(body,together),reactionMarkdown:"",branches:[decision==="TOGETHER"?"TOGETHER":"FIRST_REST",decision]};
}
function resolve11(body,id){
  const marker="### 선택 6 — 잠깐 앉을 자리",common=before(body,marker),responses=from(body,marker),reactions={
    day15_v4_cafe_inner:between(responses,"안쪽을 고르면", "창가를 고르면"),
    day15_v4_cafe_window:between(responses,"창가를 고르면", "귀가를 고르면"),
    day15_v4_cafe_go_home:from(responses,"귀가를 고르면")
  };return selectedResponse(common,reactions,id,6);
}
function resolve12(body,id){
  const marker="### 선택 7 — 남아 있던 마음",common=before(body,marker),map={
    day15_v4_conflict_jealousy:between(body,"### 질투라고 말한 사람", "### 서투른 사람"),
    day15_v4_conflict_insecurity:between(body,"### 서투른 사람", "### 못 만나게 하고 싶은 사람"),
    day15_v4_conflict_control:from(body,"### 못 만나게 하고 싶은 사람")
  };return selectedResponse(common,map,id,7);
}

function isActive(flags,number){
  const attendance=route(flags),contact=flags.day15V4HaeunContactRoute;
  if([1,2,3,6].includes(number))return true;
  if(number>=4&&number<=11)return attendance==="ATTEND";
  if(number===12){if(!["IN_PERSON","PHONE","NO_CONTACT",null,undefined].includes(contact))throw new Error(`DAY15_V4_FRONT_CONTACT_ROUTE_INVALID:${contact}`);return ["IN_PERSON","PHONE"].includes(contact);}
  return false;
}
function resolved(scene,flags){
  const body=bodyOf(scene),number=scene.number;
  if(number===1)return resolve1(body,flags,selectedId(flags,1));
  if(number===2)return resolve2(body,flags,selectedId(flags,2));
  if(number===3)return resolve3(body,flags);
  if(number===4)return resolve4(body,selectedId(flags,3));
  if(number===6)return resolve6(body,flags);
  if(number===7)return resolve7(body,selectedId(flags,4));
  if(number===9)return resolve9(body,selectedId(flags,5));
  if(number===10)return resolve10(body,flags);
  if(number===11)return resolve11(body,selectedId(flags,6));
  if(number===12)return resolve12(body,selectedId(flags,7));
  return {markdown:body,reactionMarkdown:"",branches:[]};
}

export function getDay15V4ResolvedScene01To12(state,sceneNumber){
  const scene=DAY15_V4_SOURCE_REGISTRY_01_12.find(item=>item.number===sceneNumber);if(!scene)throw new Error(`UNKNOWN_DAY15_V4_FRONT_SOURCE_SCENE_${sceneNumber}`);
  const flags=flagsOf(state),active=isActive(flags,sceneNumber);
  if(!active)return f({...scene,active:false,omitted:true,resolutionRole:"route-resolved-exact-source",selectedChoiceId:null,selectedChoiceIds:f([]),selectedBranches:f([]),steps:f([]),choiceReactionSteps:f([]),choiceReactionStepsByNumber:f({})});
  const value=resolved(scene,flags),choiceNumber=scene.choiceNumber,id=choiceNumber==null?null:selectedId(flags,choiceNumber),steps=[...parseDay15V4SourceSteps(removeChoiceSyntax(value.markdown))],reactionSteps=value.reactionMarkdown?[...parseDay15V4SourceSteps(removeChoiceSyntax(value.reactionMarkdown))]:[];
  const byNumber=Object.fromEntries(Object.entries(value.reactionMarkdownByChoice??{}).map(([number,markdown])=>[number,f([...parseDay15V4SourceSteps(removeChoiceSyntax(markdown))]) ]));
  const nextChoiceNumber=value.nextChoiceNumber??(choiceNumber!=null&&id==null?choiceNumber:null);
  if(nextChoiceNumber!=null)steps.push(f({type:"choiceCue",choiceNumber:nextChoiceNumber}));
  if(choiceNumber!=null&&id!=null&&reactionSteps.length===0)reactionSteps.push(f({type:"choiceSelection",choiceNumber,choiceId:id}));
  const selectedChoiceIds=value.branches.filter(branch=>DAY15_V4_CHOICE_IDS.has(branch));
  return f({...scene,active:true,omitted:false,resolutionRole:"route-resolved-exact-source",selectedChoiceId:id,selectedChoiceIds:f(selectedChoiceIds),selectedBranches:f(value.branches.filter(Boolean)),choiceAvailable:nextChoiceNumber!=null,choiceReactionSteps:f(reactionSteps),choiceReactionStepsByNumber:f(byNumber),steps:f(steps)});
}

export const DAY15_V4_RESOLVER_01_12_META=f({source:"RAW_DAY15_V4_SCRIPT_01_12",sourceMutation:false,routeResolvedScenes:f([1,2,3,4,6,7,9,10,11,12]),attendanceCommonScenes:f([5,8]),multiChoiceScene:6,status:"route-resolved"});
