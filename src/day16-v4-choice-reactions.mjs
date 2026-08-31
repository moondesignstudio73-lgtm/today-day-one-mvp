import {DAY16_V4_SOURCE_REGISTRY_01_12} from "./day16-v4-source-registry-01-12.mjs";
import {DAY16_V4_SOURCE_REGISTRY_13_24} from "./day16-v4-source-registry-13-24.mjs";
import {DAY16_V4_CHOICE_IDS,getDay16V4Compatibility} from "./day16-v4-state-contract.mjs";

const f=Object.freeze;
const SCENES=new Map([...DAY16_V4_SOURCE_REGISTRY_01_12,...DAY16_V4_SOURCE_REGISTRY_13_24].map(scene=>[scene.number,scene]));
const CHOICE_SCENE={1:1,2:2,3:5,4:7,5:10,6:13,7:15,8:null,9:19,10:20,11:22,12:23};
const FIELD=number=>`day16V4Choice${number}`;

function flagsOf(state){return state?.storyFlags??{};}
function assertV4(state){
  const compatibility=getDay16V4Compatibility(state);
  if(compatibility.mode!=="V4")throw new Error(`DAY16_V4_REACTION_REQUIRES_V4:${compatibility.mode}`);
  return flagsOf(state);
}
function sceneFor(flags,number){return SCENES.get(number===8?(flags.day16V4DayRoute==="HOME"?18:17):CHOICE_SCENE[number]);}
function indexOf(steps,predicate,label){const index=steps.findIndex(predicate);if(index<0)throw new Error(`DAY16_V4_REACTION_SOURCE_MISSING:${label}`);return index;}
function textIndex(steps,text){return indexOf(steps,step=>step.text===text,text);}
function sectionIndex(steps,text){return indexOf(steps,step=>step.type==="section"&&step.text===text,text);}
function withoutSections(steps){return f(steps.filter(step=>step.type!=="section"));}
function section(steps,title){
  const start=sectionIndex(steps,title)+1;
  let end=steps.findIndex((step,index)=>index>=start&&step.type==="section");
  if(end<0)end=steps.length;
  return withoutSections(steps.slice(start,end));
}
function exact(steps,...texts){return f(texts.map(text=>steps[textIndex(steps,text)]));}
function join(...groups){return f(groups.flat());}

function reaction1(steps,id){
  const line=id.endsWith("jihoon_short")?"첫 답에 지훈은 “나도 오래는 안 돼. 밥은 먹고 와”라고 한다.":id.endsWith("solo_cafe")?"두 번째에는 “알았어. 마주쳐도 내 몫 주문 안 해 놔”라는 답이 온다.":"세 번째에는 “그럼 쉬어. 다음에 보자”라고 한다.";
  return exact(steps,line,"주인공은 약속을 줄였다고 대단한 설명을 요구받지 않은 것이 편하다.","지훈에게 어떻게 보일지보다 오늘 실제로 할 수 있는 시간을 먼저 정한다.");
}
function reaction2(steps,id,flags){
  const routeEnd=flags.day16V4DayRoute==="HOME"?"집에 남는 날에는 가방을 의자 옆에 놓고 어제 읽다 만 것을 꺼낸다.":"가방에 물을 넣고 지퍼를 잠근다.";
  if(id.endsWith("no_contact"))return exact(steps,"연락을 쉬는 쪽을 고르면 주인공은 대화창을 닫는다. 오늘 아무 일도 없을 거라는 안심을 미리 약속하지는 않는다. 아직 오늘을 살지 않았으니까.",routeEnd);
  return exact(steps,"하은은 자기 오전 이야기를 짧게 답한다. 일이 있는 날은 답이 늦다.",routeEnd);
}
function reaction3(steps,id){
  return section(steps,id.endsWith("apologize")?"사과":id.endsWith("talk")?"잠깐의 대화":"지금은 어렵다는 말");
}
function reaction4(steps,id){
  if(id.endsWith("as_much_as_yuri"))return exact(steps,"첫 답에 유리는 한참 생각한다.","좋았던 날도 있었다는 말부터 할까. 왜인지 헤어진 사람은 마지막 얘기만 남는 것 같아서.");
  if(id.endsWith("why_ended"))return exact(steps,"두 번째에는 그녀가 고개를 젓는다.","지금 여기서는 말하고 싶지 않아.","주인공은 바로 다시 묻지 않는다. 그녀는 물을 한 모금 마신다.");
  return exact(steps,"세 번째에는 유리가 책 표지를 쓸어 본다.","그러면 내 얘기부터 할 수 있겠네. 예전의 우리 말고.");
}
function reaction5(steps,id){
  const commonStart=textIndex(steps,"유리는 가방 끈을 만지다가 내려놓는다.");
  const common=steps.slice(commonStart);
  if(id.endsWith("acknowledge"))return join(exact(steps,"첫 답에 유리가 컵에서 손을 뗀다.","응. 그 말이 하고 싶었나 봐."),common);
  if(id.endsWith("difficult"))return join(exact(steps,"두 번째에는 그녀가 고개를 끄덕인다.","그럼 잠깐 쉬자. 말하는 것도.","주인공은 물을 마신다. 빨리 대답하지 않아도 대화가 끝나지는 않는다."),common);
  return join(exact(steps,"세 번째에는 유리가 천천히 고개를 젓는다.","나는 모든 걸 처음으로 돌리고 싶지는 않아.","주인공은 그 말을 듣고 시선을 내린다.","자기가 기억하지 못한다는 이유로 그녀에게도 지워 달라고 말한 것 같았다."),common);
}
function reaction6(steps,id,flags){
  if(id.endsWith("current_name_haeun")){
    if(flags.day16V4HaeunRelationshipDisclosure!=="NAMED_GIRLFRIEND")throw new Error("DAY16_V4_REACTION_SOURCE_VARIANT_UNAVAILABLE:CHOICE6_ENDED_RELATIONSHIP");
    return section(steps,"연인의 이름");
  }
  return section(steps,id.endsWith("someone_close")?"가까운 사람":"넣어 둔 휴대폰");
}
function reaction7(steps,id,flags){
  if(!id.endsWith("ask_next"))return section(steps,id.endsWith("end_here")?"오늘의 인사":"아직 모르는 사람");
  const block=section(steps,"다음을 묻는 사람");
  if(flags.day16V4YuriContact==="SHARED")return f(block.slice(0,textIndex(block,"둘은 연락 방법을 나눈다.")+1));
  return exact(block,"유리가 거절하는 길에서는 “나는 오늘은 여기까지만 하고 싶어”라고 말한다. 주인공은 고개를 끄덕이고 같은 인사로 끝낸다.");
}
function reaction8(steps,id,flags){
  if(flags.day16V4DayRoute==="HOME")return exact(steps,id.endsWith("mark_one")?"표시만 남기면 누구인지 짐작해서 이름을 붙이지 않는다.":id.endsWith("current_first")?"오늘 사진을 모으면 익숙한 얼굴이 아니라 자기가 본 장소가 먼저 눈에 들어온다.":"다른 일을 고르면 간단히 음식을 준비한다. 손이 바빠지자 사진 속 사람을 억지로 알아보려던 마음이 조금 조용해진다.");
  return exact(steps,id.endsWith("record_words")?"첫 선택에는 이름과 대화 한두 줄만 남긴다. ‘이래서 헤어졌다’는 결론은 적지 않는다.":id.endsWith("today_self")?"두 번째에는 유리의 답을 기다리지 못하고 끝부터 물었던 자신이 떠오른다. 다음에 만날 기회가 없어도 기억할 수 있는 부분이다.":"세 번째에는 배가 고팠다는 걸 뒤늦게 느낀다. 카페에서 마신 음료만으로는 점심이 되지 않았다.");
}
function reaction9(steps,id,flags){
  if(id.endsWith("disclose_yuri"))return section(steps,"만남을 말하는 길");
  if(id.endsWith("organize_then_tell"))return section(steps,"생각을 정리하는 길");
  if(flags.day16V4DayRoute==="HOME")return section(steps,"유리를 만나지 않은 저녁");
  const block=section(steps,"짧아진 설명");
  return flags.day16V4DayRoute==="JIHOON_CAFE"?block:f(block.slice(1));
}
function reaction10(steps,id){return section(steps,id.endsWith("curious_not_restart")?"궁금한 마음":id.endsWith("unknown")?"아직 모르는 마음":"오늘로 끝내는 마음");}
function reaction11(steps,id){
  return exact(steps,id.endsWith("accept_intent")?"첫 답에 유리는 가능한 시간을 말한다. 주인공도 자기 몸 상태와 일정을 보고 가능한 범위를 말한다.":id.endsWith("decline")?"두 번째에는 “응. 잘 지내”라는 답이 온다.":"세 번째에는 “그래. 내일까지만 알려 줘. 나도 일정을 잡아야 해서”라고 한다.");
}
function reaction12(steps,id){
  if(id.endsWith("tell_update"))return f(steps.slice(textIndex(steps,"첫 선택은 하은이 대화를 더 할 수 있는 때에만 통화로 이어진다. 지금은 쉬고 싶다고 하면 짧은 사실과 다음에 이야기하고 싶다는 말만 남긴다."),textIndex(steps,"두 번째에는 하은의 답이 조금 늦게 온다.")));
  if(id.endsWith("tell_tomorrow"))return f(steps.slice(textIndex(steps,"두 번째에는 하은의 답이 조금 늦게 온다."),textIndex(steps,"마지막 선택에서는 새 메시지를 보내지 않는다.")));
  return f(steps.slice(textIndex(steps,"마지막 선택에서는 새 메시지를 보내지 않는다."),textIndex(steps,"새 약속이 없는 밤에는 주인공이 내일 운동 상담이나 짧은 산책을 생각한다고 말한다.")));
}

const PROJECTORS={1:reaction1,2:reaction2,3:reaction3,4:reaction4,5:reaction5,6:reaction6,7:reaction7,8:reaction8,9:reaction9,10:reaction10,11:reaction11,12:reaction12};

export function getDay16V4ChoiceReaction(state,choiceNumber){
  if(!Number.isInteger(choiceNumber)||choiceNumber<1||choiceNumber>12)throw new Error("DAY16_V4_REACTION_CHOICE_INVALID");
  const flags=assertV4(state),id=flags[FIELD(choiceNumber)];
  if(typeof id!=="string")throw new Error(`DAY16_V4_REACTION_CHOICE_UNRESOLVED:${choiceNumber}`);
  if(DAY16_V4_CHOICE_IDS.get(id)!==choiceNumber)throw new Error(`DAY16_V4_REACTION_OPTION_INVALID:${choiceNumber}:${id}`);
  const source=sceneFor(flags,choiceNumber),steps=PROJECTORS[choiceNumber](source.steps,id,flags);
  if(steps.length===0||steps.some(step=>step.type==="section"))throw new Error(`DAY16_V4_REACTION_EMPTY_OR_LEAKED:${choiceNumber}`);
  return f({choiceNumber,optionId:id,sourceSceneNumber:source.number,sourceRole:"exact-selected-branch",steps});
}
