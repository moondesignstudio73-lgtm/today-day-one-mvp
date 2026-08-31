import {resolveDay16V4Scene} from "./day16-v4-branch-resolver.mjs";
import {getDay16V4Compatibility} from "./day16-v4-state-contract.mjs";
import {DAY16_V4_EXACT_SOURCE_VARIANTS} from "./day16-v4-source-variants.mjs";

const f=Object.freeze;
const flagsOf=state=>state?.storyFlags??{};
const clean=steps=>f(steps.filter(step=>step.type!=="section"));
const beforeChoice=steps=>{
  const index=steps.findIndex(step=>step.type==="section"&&/^선택 \d+ — /.test(step.text));
  if(index<0)throw new Error("DAY16_V4_SCENE_STEP_SOURCE_MISSING:CHOICE_HEADING");
  return clean(steps.slice(0,index));
};
const section=(steps,title)=>{
  const start=steps.findIndex(step=>step.type==="section"&&step.text===title);
  if(start<0)throw new Error(`DAY16_V4_SCENE_STEP_SOURCE_MISSING:${title}`);
  let end=steps.findIndex((step,index)=>index>start&&step.type==="section");
  if(end<0)end=steps.length;
  return clean(steps.slice(start+1,end));
};
const join=(...groups)=>f(groups.flat());

function assertV4(state){
  const compatibility=getDay16V4Compatibility(state);
  if(compatibility.mode!=="V4")throw new Error(`DAY16_V4_SCENE_STEPS_REQUIRES_V4:${compatibility.mode}`);
  return flagsOf(state);
}

function project(flags,scene,context){
  const steps=scene.steps,number=scene.number,route=flags.day16V4DayRoute;
  if(number===3)return route==="JIHOON_CAFE"?f([...steps.slice(0,7),...steps.slice(8)]):f([steps[0],...steps.slice(7)]);
  if(number===4)return route==="JIHOON_CAFE"?f([...steps]):f([...steps.slice(0,12),...steps.slice(13)]);
  if(number===8)return section(steps,flags.day16V4ConversationDepth==="PAST_LIMITED"?"옛날을 조금 말하는 사람":"지금의 책을 말하는 사람");
  if(number===9)return section(steps,flags.day16V4ConversationDepth==="PAST_LIMITED"?"과거 이야기가 이어지는 자리":"과거를 쉬는 자리");
  if(number===10){
    if(flags.day16V4ConversationDepth==="PAST_LIMITED")return beforeChoice(steps);
    if(flags.day16V4ConversationDepth==="PRESENT_ONLY")return DAY16_V4_EXACT_SOURCE_VARIANTS.scene10CurrentConversation.steps;
    throw new Error(`DAY16_V4_SCENE_STEPS_INVALID_DEPTH:${flags.day16V4ConversationDepth}`);
  }
  if(number===13){
    const contacted=flags.day16V4MorningContact!=="NO_CONTACT",activeRelationship=context.haeunRelationshipActive===true;
    if(contacted&&activeRelationship)return beforeChoice(steps);
    if(contacted)return f(steps.slice(0,5));
    if(activeRelationship)return f([steps[5]]);
    return f([]);
  }
  if(number===16)return section(steps,route==="JIHOON_CAFE"?"친구와 함께 있던 사람":"혼자 남은 사람");
  if(number===17)return join(section(steps,route==="JIHOON_CAFE"?"지훈의 옆":"혼자 걷는 길"));
  if(number===19)return route==="HOME"?f(steps.slice(0,2)):beforeChoice(steps);
  if(number===21){
    if(route==="HOME")return section(steps,"사진 이야기만 나눈 밤");
    if(flags.day16V4EveningDisclosure!=="DISCLOSED_YURI")throw new Error("DAY16_V4_SCENE_SOURCE_VARIANT_UNAVAILABLE:SCENE21_UNDISCLOSED");
    return section(steps,flags.day16V4IntentToYuri==="UNKNOWN"?"마음이 어려운 밤":"편안하게 조금 더 말하는 밤");
  }
  if(number===22){
    if(flags.day16V4YuriContact==="SHARED")return beforeChoice(steps);
    return section(steps,route==="HOME"?"유리를 만나지 않은 밤":"연락을 나누지 않은 밤");
  }
  if(number===23){
    const pending=flags.day16V4YuriInvitation==="ACCEPT_INTENT"||flags.day16V4YuriInvitation==="ANSWER_TOMORROW";
    return pending?beforeChoice(steps):f(steps.slice(15));
  }
  if(number===24)return route==="HOME"?f([steps[0],...steps.slice(5)]):f([...steps.slice(0,5),...steps.slice(6)]);
  return scene.choiceNumber==null?clean(steps):beforeChoice(steps);
}

export function getDay16V4PlayerFacingSceneSteps(state,sceneNumber,context={}){
  context??={};
  const flags=assertV4(state),resolved=resolveDay16V4Scene(state,sceneNumber,context);
  if(resolved.status!=="ACTIVE")return f({status:resolved.status,sceneNumber});
  const steps=project(flags,resolved.source,context);
  if(steps.length===0&&resolved.choice==null)throw new Error(`DAY16_V4_SCENE_STEPS_EMPTY:${sceneNumber}`);
  if(steps.some(step=>step.type==="section"))throw new Error(`DAY16_V4_SCENE_SECTION_LEAK:${sceneNumber}`);
  return f({status:"ACTIVE",sceneNumber,sourceRole:"exact-route-player-facing-steps",steps});
}
