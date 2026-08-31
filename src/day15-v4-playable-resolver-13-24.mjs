import {DAY15_V4_CHOICE_IDS} from "./day15-v4-campaign-data.mjs";
import {DAY15_V4_PLAYABLE_SCRIPT_13_24,getDay15V4SourceScene13To24,parseDay15V4SourceSteps} from "./day15-v4-playable-script-13-24.mjs";

const f=Object.freeze;
const flagsOf=state=>state?.storyFlags??{};
const bodyOf=scene=>{const normalized=scene.sourceMarkdown.replace(/\r\n/g,"\n"),index=normalized.indexOf("\n");if(index<0)throw new Error(`DAY15_V4_SCENE_BODY_MISSING:${scene.number}`);return normalized.slice(index+1);};
function markerIndex(text,marker,after=0){const index=text.indexOf(marker,after);if(index<0)throw new Error(`DAY15_V4_SOURCE_MARKER_MISSING:${marker}`);return index;}
const before=(text,marker)=>text.slice(0,markerIndex(text,marker)).trim();
const from=(text,marker)=>text.slice(markerIndex(text,marker)).trim();
const between=(text,start,end)=>{const startIndex=markerIndex(text,start),endIndex=end==null?text.length:markerIndex(text,end,startIndex+start.length);if(endIndex<=startIndex)throw new Error(`DAY15_V4_SOURCE_MARKER_ORDER:${start}:${end}`);return text.slice(startIndex,endIndex).trim();};
const withoutChoiceList=text=>text.split("\n").filter(line=>!/^### 선택 \d+/.test(line)&&!/^-[ ]+\*\*/.test(line)).join("\n").trim();

function sections(text){
  const matches=[...text.matchAll(/^### (.+)$/gm)],result=new Map();
  for(let index=0;index<matches.length;index++){
    const match=matches[index],start=match.index+match[0].length,end=matches[index+1]?.index??text.length;
    const heading=match[1].trim();if(result.has(heading))throw new Error(`DAY15_V4_DUPLICATE_SOURCE_HEADING:${heading}`);result.set(heading,text.slice(start,end).trim());
  }
  return result;
}

function selectedId(flags,choiceNumber){
  const direct=flags[`day15V4Choice${choiceNumber}`]??null,history=(flags.day15V4SelectedChoiceIds??[]).find(id=>DAY15_V4_CHOICE_IDS.get(id)===choiceNumber)??null,id=direct??history;
  if(id!=null&&DAY15_V4_CHOICE_IDS.get(id)!==choiceNumber)throw new Error(`DAY15_V4_RESOLVER_CHOICE_INVALID:${choiceNumber}:${id}`);
  if(direct!=null&&history!=null&&direct!==history)throw new Error(`DAY15_V4_RESOLVER_CHOICE_MIRROR:${choiceNumber}`);
  return id;
}

function resolve14(body,flags){
  const first="### 어제 함께 이야기한 사람",common=before(body,first),map=sections(from(body,first));
  const heading={TALKED_TOGETHER:"어제 함께 이야기한 사람",RESTED_SEPARATELY:"어제 각자 쉰 사람",PRESSURED:"어제 압박을 받았던 사람"}[flags.day15V4Day14CallbackRoute];
  if(!heading)throw new Error(`DAY15_V4_CALLBACK_ROUTE_INVALID:${flags.day15V4Day14CallbackRoute}`);
  return {markdown:[common,map.get(heading)].filter(Boolean).join("\n"),branches:[heading]};
}

function resolve15(body,flags,id){
  const choiceMarker="### 선택 8 — 한 번 더 솔직하게",pre=before(body,choiceMarker),preSections=sections(pre),callback=flags.day15V4SeojinCallbackAvailable===true||flags.day15V4AraCallbackAvailable===true;
  const preHeading=callback?"다른 사람을 궁금해했던 날":"그런 약속이 없었던 날";
  const responses=from(body,choiceMarker),reaction={
    day15_v4_reciprocity_own_double_standard:between(responses,"첫 말에 하은이 묻는다.","두 번째에는 그녀가 잠깐 생각한다."),
    day15_v4_reciprocity_admit_fear:between(responses,"두 번째에는 그녀가 잠깐 생각한다.","세 번째에는 하은이 고개를 끄덕인다."),
    day15_v4_reciprocity_ask_time:from(responses,"세 번째에는 하은이 고개를 끄덕인다.")
  }[id];
  return {markdown:[preSections.get(preHeading),reaction].filter(Boolean).join("\n"),reactionMarkdown:reaction??"",branches:[preHeading,id].filter(Boolean)};
}

function resolve16(body,id){
  const marker="### 선택 9 — 다음 문장",common=before(body,marker),map=sections(from(body,marker)),heading={
    day15_v4_boundary_ask_haeun:"질문을 돌려주는 말",
    day15_v4_boundary_admit_insecurity:"불안한 채로 듣는 말",
    day15_v4_boundary_continue_control:"맞춰 달라는 말"
  }[id];
  const reaction=map.get(heading)??"";return {markdown:[common,reaction].filter(Boolean).join("\n"),reactionMarkdown:reaction,branches:[heading,id].filter(Boolean)};
}

function resolve17(body,id){
  const marker="### 선택 10 — 내가 본 것",common=before(body,marker),responses=from(body,marker),reaction={
    day15_v4_perception_wavering_line:between(responses,"선 이야기를 꺼내면", "아직 모르겠다고 하면"),
    day15_v4_perception_not_sure:between(responses,"아직 모르겠다고 하면", "다시 보고 싶다고 하면"),
    day15_v4_perception_revisit:from(responses,"다시 보고 싶다고 하면")
  }[id];
  return {markdown:[common,reaction].filter(Boolean).join("\n"),reactionMarkdown:reaction??"",branches:[id].filter(Boolean)};
}

function resolve18(body,flags){
  const distant=flags.day13V3HaeunDisclosureMismatch===true||flags.day13V3HaeunNeedsSpace===true||flags.day15V4GalleryInvitation!=="INVITED";
  let markdown=body;
  if(distant){
    if(!markdown.includes("**하은**\n“그럼 다음에는 같이 볼까?”\n오늘 초대가 있었던 길의 답이다.\n거리를 두는 중이라면 그녀는 “전시 자체는 네가 봐도 좋을 것 같아”라고 한다. 주인공은 둘이 보기로 한 약속으로 바꿔 듣지 않는다."))throw new Error("DAY15_V4_SOURCE_MARKER_MISSING:SCENE18_DISTANCE_VARIANT");
    markdown=markdown.replace("**하은**\n“그럼 다음에는 같이 볼까?”\n오늘 초대가 있었던 길의 답이다.\n거리를 두는 중이라면 그녀는 “전시 자체는 네가 봐도 좋을 것 같아”라고 한다. 주인공은 둘이 보기로 한 약속으로 바꿔 듣지 않는다.","**하은**\n“전시 자체는 네가 봐도 좋을 것 같아.”\n주인공은 둘이 보기로 한 약속으로 바꿔 듣지 않는다.");
  }else{
    if(!markdown.includes("거리를 두는 중이라면 그녀는 “전시 자체는 네가 봐도 좋을 것 같아”라고 한다. 주인공은 둘이 보기로 한 약속으로 바꿔 듣지 않는다."))throw new Error("DAY15_V4_SOURCE_MARKER_MISSING:SCENE18_INVITATION_VARIANT");
    markdown=markdown.replace("거리를 두는 중이라면 그녀는 “전시 자체는 네가 봐도 좋을 것 같아”라고 한다. 주인공은 둘이 보기로 한 약속으로 바꿔 듣지 않는다.","");
  }
  return {markdown,branches:[distant?"DISTANCE_PRESERVED":"NEXT_VIEWING_INVITATION"]};
}

function resolve20(body,flags){
  const map=sections(body),heading={CLOSE_PACE:"같은 역으로 가는 두 사람",DISTANT_PACE:"조금 떨어진 걸음",SEPARATE_HOMES:"각자의 집에서"}[flags.day15V4ReturnWalk];
  if(!heading)throw new Error(`DAY15_V4_RETURN_WALK_INVALID:${flags.day15V4ReturnWalk}`);
  let markdown=map.get(heading)??"";
  if(heading==="같은 역으로 가는 두 사람"&&flags.day15V4ShoulderContactOccurred!==true){
    const contact="걸음 중에 어깨가 잠깐 닿는다. 그녀가 멀어지지 않고 같은 속도로 걷는다.\n그는 어깨를 감싸 끌어당기지 않는다. 지금 나란히 있는 느낌이 좋아 그대로 걷는다.";
    if(!markdown.includes(contact))throw new Error("DAY15_V4_SOURCE_MARKER_MISSING:SCENE20_SHOULDER_CONTACT");
    markdown=markdown.replace(contact,"");
  }
  return {markdown,branches:[heading]};
}

function resolve21(body,id){
  const marker="### 선택 11 — 오늘의 마지막 말",responses=from(body,marker),reaction={
    day15_v4_closing_listen:between(responses,"첫 답에 하은은", "두 번째에는 그녀가"),
    day15_v4_closing_apologize:between(responses,"두 번째에는 그녀가", "세 번째에는 서로"),
    day15_v4_closing_thanks:"",
    day15_v4_closing_think_later:from(responses,"세 번째에는 서로")
  }[id];
  return {markdown:reaction??"",reactionMarkdown:reaction??"",branches:[id].filter(Boolean)};
}

function resolve22(body,id){
  const marker="### 선택 12 — 아직 모르는 것이 있을 때",common=before(body,marker),responses=from(body,marker),reaction={
    day15_v4_material_request_public:between(responses,"첫 답이면", "두 번째에는 하은이"),
    day15_v4_material_haeun_thought_first:between(responses,"두 번째에는 하은이", "세 번째에는"),
    day15_v4_material_read_tomorrow:between(responses,"세 번째에는", "하은과 연락을 쉬는 밤에는")
  }[id];
  return {markdown:[common,reaction].filter(Boolean).join("\n"),reactionMarkdown:reaction??"",branches:[id].filter(Boolean)};
}

function resolve24(body,flags){
  if(!["ATTEND","OWN_AFTERNOON"].includes(flags.day15V4AttendanceRoute))throw new Error(`DAY15_V4_ATTENDANCE_ROUTE_INVALID:${flags.day15V4AttendanceRoute}`);
  if(!["IN_PERSON","PHONE","NO_CONTACT"].includes(flags.day15V4HaeunContactRoute))throw new Error(`DAY15_V4_CONTACT_ROUTE_INVALID:${flags.day15V4HaeunContactRoute}`);
  if(flags.day15V4AttendanceRoute==="OWN_AFTERNOON"&&flags.day15V4HaeunContactRoute==="IN_PERSON")throw new Error("DAY15_V4_ENDING_ROUTE_CONTRADICTION");
  const comfortable=flags.day15V4AttendanceRoute==="ATTEND"&&flags.day15V4ReturnWalk==="CLOSE_PACE"&&flags.day15V4HaeunLeft!==true;
  const attended=flags.day15V4AttendanceRoute==="ATTEND";
  const phone=!attended&&flags.day15V4HaeunContactRoute==="PHONE"&&flags.day15V4HaeunLeft!==true;
  const noContact=flags.day15V4HaeunContactRoute==="NO_CONTACT"||flags.day15V4HaeunLeft===true;
  const commonStart=before(body,"하은과 편하게 하루를 마친 밤에는 문자가 온다."),commonEnd=from(body,"그는 불을 끈다.");
  const comfortableBlock=between(body,"하은과 편하게 하루를 마친 밤에는 문자가 온다.","전시에 가지 않은 밤에는 그녀가 말한 작품 이름을 적는다.");
  const phoneBlock=between(body,"전시에 가지 않은 밤에는 그녀가 말한 작품 이름을 적는다.","연락을 쉬는 밤에는 자기 메모의 빈 다음 줄을 그대로 둔다.");
  const noContactBlock=between(body,"연락을 쉬는 밤에는 자기 메모의 빈 다음 줄을 그대로 둔다.","전시를 직접 본 날에는 능숙한 시우와 서툰 자신이 떠올랐다.");
  const attendBlock=between(body,"전시를 직접 본 날에는 능숙한 시우와 서툰 자신이 떠올랐다.","전시에 가지 않고 이야기도 듣지 않은 밤에는 그가 어떤 사람이었는지 알 수 없었다.");
  const unknownBlock=between(body,"전시에 가지 않고 이야기도 듣지 않은 밤에는 그가 어떤 사람이었는지 알 수 없었다.","그는 불을 끈다.");
  return {markdown:[commonStart,comfortable&&comfortableBlock,phone&&phoneBlock,noContact&&noContactBlock,attended&&attendBlock,!attended&&!phone&&unknownBlock,commonEnd].filter(Boolean).join("\n"),branches:[comfortable&&"COMFORTABLE_MESSAGE",phone&&"PHONE_MEMORY",noContact&&"CONTACT_REST",attended&&"ATTENDED_REFLECTION",!attended&&!phone&&"UNKNOWN_SIWOO"].filter(Boolean)};
}

function resolvedMarkdown(scene,flags,id){
  const body=bodyOf(scene);
  if(scene.number===14)return resolve14(body,flags);
  if(scene.number===15)return resolve15(body,flags,id);
  if(scene.number===16)return resolve16(body,id);
  if(scene.number===17)return resolve17(body,id);
  if(scene.number===18)return resolve18(body,flags);
  if(scene.number===20)return resolve20(body,flags);
  if(scene.number===21)return resolve21(body,id);
  if(scene.number===22)return resolve22(body,id);
  if(scene.number===24)return resolve24(body,flags);
  return {markdown:body,branches:[]};
}

export function getDay15V4ResolvedScene13To24(state,sceneNumber){
  const source=getDay15V4SourceScene13To24(state,sceneNumber),flags=flagsOf(state);
  if(!source.active)return f({...source,omitted:true,resolutionRole:"route-resolved-exact-source",selectedBranches:f([]),steps:f([])});
  const id=source.choiceNumber==null?null:selectedId(flags,source.choiceNumber),resolved=resolvedMarkdown(source,flags,id),steps=[...parseDay15V4SourceSteps(withoutChoiceList(resolved.markdown))],reactionSteps=resolved.reactionMarkdown==null?[]:[...parseDay15V4SourceSteps(withoutChoiceList(resolved.reactionMarkdown))];
  if(source.choiceNumber!=null&&id==null)steps.push(f({type:"choiceCue",choiceNumber:source.choiceNumber}));
  if(source.choiceNumber!=null&&id!=null&&steps.length===0)steps.push(f({type:"choiceSelection",choiceNumber:source.choiceNumber,choiceId:id}));
  if(source.choiceNumber!=null&&id!=null&&reactionSteps.length===0)reactionSteps.push(f({type:"choiceSelection",choiceNumber:source.choiceNumber,choiceId:id}));
  return f({...source,omitted:false,resolutionRole:"route-resolved-exact-source",selectedChoiceId:id,selectedBranches:f(resolved.branches.filter(Boolean)),choiceAvailable:source.choiceNumber!=null&&id==null,choiceReactionSteps:f(reactionSteps),steps:f(steps)});
}

export const DAY15_V4_RESOLVER_13_24_META=f({source:"RAW_DAY15_V4_SCRIPT_13_24",sourceMutation:false,routeResolvedScenes:f([14,15,16,17,18,20,21,22,24]),commonScenes:f([13,19,23]),status:"route-resolved"});
