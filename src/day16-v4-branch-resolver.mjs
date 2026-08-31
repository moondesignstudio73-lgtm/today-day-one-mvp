import {DAY16_V4_SOURCE_REGISTRY_01_12} from "./day16-v4-source-registry-01-12.mjs";
import {DAY16_V4_SOURCE_REGISTRY_13_24} from "./day16-v4-source-registry-13-24.mjs";

const f=Object.freeze;
const SCENES=f([...DAY16_V4_SOURCE_REGISTRY_01_12,...DAY16_V4_SOURCE_REGISTRY_13_24]);
const SCENE_BY_NUMBER=new Map(SCENES.map(scene=>[scene.number,scene]));
const option=(id,label)=>f({id,label});
const flagsOf=value=>value?.storyFlags??value??{};
const cafe=route=>route==="JIHOON_CAFE"||route==="SOLO_CAFE";
const conversation=depth=>depth==="PRESENT_ONLY"||depth==="PAST_LIMITED";

const STATIC_CHOICES=f({
  1:f([
    option("day16_v4_time_jihoon_short","잠깐 보자. 오래 있지는 않을게."),
    option("day16_v4_time_solo_cafe","오늘은 혼자 들렀다 올래."),
    option("day16_v4_time_home_rest","오늘은 집에서 쉬고 싶어.")
  ]),
  3:f([
    option("day16_v4_greeting_apologize","기억하지 못해서 미안해요."),
    option("day16_v4_greeting_talk","잠깐 이야기해도 될까요?"),
    option("day16_v4_greeting_overwhelmed","지금은 조금 당황스러워요.")
  ]),
  4:f([
    option("day16_v4_past_as_much_as_yuri","오늘 말하고 싶은 만큼만 듣고 싶어요."),
    option("day16_v4_past_why_ended","왜 끝났는지부터 알고 싶어요."),
    option("day16_v4_past_not_today","과거 얘기는 오늘 안 해도 돼요.")
  ]),
  5:f([
    option("day16_v4_starting_points_acknowledge","내가 처음 듣는다고, 너한테 처음인 건 아니네."),
    option("day16_v4_starting_points_difficult","나도 지금 조금 어렵네요."),
    option("day16_v4_starting_points_restart","그럼 처음부터 다시 알면 안 될까요?")
  ]),
  7:f([
    option("day16_v4_contact_ask_next","다음에 조금 더 이야기할 수 있을까요?"),
    option("day16_v4_contact_end_here","오늘 여기서 인사해도 괜찮겠어요."),
    option("day16_v4_contact_not_sure","오늘은 아직 잘 모르겠어요. 인사만 할게요.")
  ]),
  10:f([
    option("day16_v4_intent_curious_not_restart","궁금하지만, 연애를 다시 시작하고 싶은 건 아니야."),
    option("day16_v4_intent_unknown","내 마음을 아직 모르겠어."),
    option("day16_v4_intent_end_here","오늘 인사한 걸로 끝내고 싶어.")
  ]),
  11:f([
    option("day16_v4_invite_accept_intent","나도 더 듣고 싶어요. 시간과 장소를 같이 정할까요?"),
    option("day16_v4_invite_decline","오늘 이야기로 충분할 것 같아요. 고마웠어요."),
    option("day16_v4_invite_answer_tomorrow","내일 생각하고 답해도 될까요?")
  ]),
  12:f([
    option("day16_v4_final_tell_update","아까 말한 뒤에 연락이 왔어. 내가 정한 것도 말하고 싶어."),
    option("day16_v4_final_tell_tomorrow","아직 답을 안 했어. 내일 정하고 말할게."),
    option("day16_v4_final_silent","오늘은 아무 말도 더 하지 않는다.")
  ])
});

function activeSceneNumbers(flags){
  const route=flags.day16V4DayRoute;
  if(route==null)return [1];
  if(route==="HOME")return [1,2,18,19,21,22,23,24];
  if(!cafe(route))return [];
  const numbers=[1,2,3,4,5];
  if(conversation(flags.day16V4ConversationDepth))numbers.push(6,7,8,9,10,11,12,13,14,15);
  numbers.push(16,17,19);
  if(flags.day16V4EveningDisclosure==="DISCLOSED_YURI"&&new Set(["ENCOUNTER_ONLY","LIMITED_CONVERSATION","CONTACT_SHARED"]).has(flags.day16V4HaeunYuriKnowledge))numbers.push(20);
  if(route==="HOME"||flags.day16V4EveningDisclosure==="DISCLOSED_YURI")numbers.push(21);
  numbers.push(22,23,24);
  return numbers;
}

function choice2(flags,context){
  const route=flags.day16V4DayRoute;
  const first=route==="JIHOON_CAFE"
    ? option("day16_v4_morning_tell_jihoon","오늘 지훈이랑 잠깐 보려고.")
    : route==="SOLO_CAFE"
      ? option("day16_v4_morning_tell_jihoon","오늘 카페 잠깐 다녀오려고.")
      : option("day16_v4_morning_tell_jihoon","오늘은 집에 있을래.");
  const result=[first,option("day16_v4_morning_own_time","오늘은 내 시간 좀 보내고 저녁에 연락할게.")];
  if(context.allowMorningNoContact===true)result.push(option("day16_v4_morning_no_contact","어제 더 생각하기로 했다면 오늘은 먼저 연락하지 않는다."));
  return f(result);
}

function choice6(context){
  const first=context.haeunRelationshipActive===true
    ? option("day16_v4_current_name_haeun","지금 만나는 사람이 있어요. 하은이라고.")
    : option("day16_v4_current_name_haeun","지금은 연애를 다시 생각하는 중");
  return f([first,option("day16_v4_current_someone_close","지금 가까운 사람이 있어요."),option("day16_v4_current_return_to_book","휴대폰을 넣고 책 이야기로 돌아간다.")]);
}

function choice8(route){
  return route==="HOME"?f([
    option("day16_v4_photo_mark_one","궁금한 사진 한 장만 표시하고 닫는다."),
    option("day16_v4_photo_current_first","오늘 찍은 사진부터 따로 모아 본다."),
    option("day16_v4_photo_other_task","오늘은 사진 대신 다른 일을 한다.")
  ]):f([
    option("day16_v4_reflection_record_words","오늘 들은 말만 짧게 적어 둔다."),
    option("day16_v4_reflection_today_self","‘나는 어떤 사람이었을까’ 대신 ‘오늘은 어떻게 말했을까’를 생각한다."),
    option("day16_v4_reflection_eat_first","지금은 더 생각하지 않고 밥부터 먹는다.")
  ]);
}

function choice9(route){
  const third=route==="JIHOON_CAFE"
    ? option("day16_v4_evening_jihoon_only","지훈만 잠깐 만났어.")
    : route==="SOLO_CAFE"
      ? option("day16_v4_evening_solo_cafe","혼자 카페 다녀왔어.")
      : option("day16_v4_evening_home_rest","오늘 집에서 쉬었어.");
  if(route==="HOME")return f([third]);
  return f([option("day16_v4_evening_disclose_yuri","오늘 예전에 만나던 사람과 우연히 마주쳤어."),option("day16_v4_evening_organize_then_tell","오늘 좀 생각할 일이 생겼어. 정리해서 말할게."),third]);
}

export function getDay16V4ActiveSceneNumbers(stateOrFlags){return f(activeSceneNumbers(flagsOf(stateOrFlags)));}

export function resolveDay16V4Scene(stateOrFlags,sceneNumber,{allowMorningNoContact=false,haeunRelationshipActive=false}={}){
  const flags=flagsOf(stateOrFlags),source=SCENE_BY_NUMBER.get(sceneNumber);
  if(!source)return f({status:"BLOCKED_UNKNOWN_SCENE",sceneNumber});
  if(!activeSceneNumbers(flags).includes(sceneNumber))return f({status:"SKIPPED",sceneNumber});
  const route=flags.day16V4DayRoute,depth=flags.day16V4ConversationDepth;
  let variant="BASE";
  if(sceneNumber===3||sceneNumber===4||sceneNumber===16||sceneNumber===17)variant=route;
  if(sceneNumber===8||sceneNumber===9||sceneNumber===10)variant=depth==="PAST_LIMITED"?"PAST":"CURRENT";
  if(sceneNumber===18)variant="HOME";
  if(sceneNumber>=19)variant=route;
  const choiceNumber=source.choiceNumber;
  let options=null;
  if(choiceNumber===1)options=STATIC_CHOICES[1];
  else if(choiceNumber===2)options=choice2(flags,{allowMorningNoContact});
  else if(choiceNumber===3&&cafe(route))options=STATIC_CHOICES[3];
  else if(choiceNumber===4&&conversation(depth))options=STATIC_CHOICES[4];
  else if(choiceNumber===5&&conversation(depth))options=STATIC_CHOICES[5];
  else if(choiceNumber===6&&conversation(depth))options=choice6({haeunRelationshipActive});
  else if(choiceNumber===7&&conversation(depth))options=STATIC_CHOICES[7];
  else if(choiceNumber===8)options=choice8(route);
  else if(choiceNumber===9)options=choice9(route);
  else if(choiceNumber===10&&flags.day16V4EveningDisclosure==="DISCLOSED_YURI")options=STATIC_CHOICES[10];
  else if(choiceNumber===11&&flags.day16V4YuriContact==="SHARED")options=STATIC_CHOICES[11];
  else if(choiceNumber===12&&(flags.day16V4YuriInvitation==="ACCEPT_INTENT"||flags.day16V4YuriInvitation==="ANSWER_TOMORROW"))options=STATIC_CHOICES[12];
  return f({status:"ACTIVE",sceneNumber,variant,source,choice:options?f({number:choiceNumber,options}):null});
}

export function getDay16V4ResolvedScenes(stateOrFlags,context){
  return f(activeSceneNumbers(flagsOf(stateOrFlags)).map(number=>resolveDay16V4Scene(stateOrFlags,number,context)));
}
