export const DAY10_V3_VERSION="NOTION_V3";

const scene=(number,title,act)=>Object.freeze({number,id:`day10-v3-scene-${String(number).padStart(2,"0")}`,title,act});
const option=(id,label,effects={})=>Object.freeze({id,label,effects:Object.freeze(effects)});
const choice=(number,sceneNumber,title,options)=>Object.freeze({number,sceneNumber,title,options:Object.freeze(options)});

export const DAY10_V3_SCENES=Object.freeze([
  scene(1,"두 사람분이라고 적기 전에",1),scene(2,"하은의 하루도 시작됐다",1),scene(3,"잘하는 요리",1),scene(4,"오늘 할 수 있는 것",1),scene(5,"목록에 없는 물건",1),scene(6,"집에 들어온 봉투",1),
  scene(7,"접시 두 개의 거리",2),scene(8,"잘되고 있다는 말",2),scene(9,"말리지 않는 계란",2),scene(10,"생각한 모양이 아닌 것",2),scene(11,"도착 시간을 묻는 사람",2),scene(12,"지금 말하면 달라지는 것",2),
  scene(13,"초인종과 메시지",3),scene(14,"기다렸다는 말",3),scene(15,"마음을 설명하기 전에",3),scene(16,"의자를 당기는 소리",3),scene(17,"이름을 바꾸면 되는 음식",3),scene(18,"기대했던 얼굴",3),scene(19,"다음 숟가락",3),
  scene(20,"남은 것을 나누는 법",4),scene(21,"내일은 친구와",4),scene(22,"같이 가도 되는 자리",4),scene(23,"배웅하거나 보내는 말",4),scene(24,"한 자리의 이름",4)
]);

export const DAY10_V3_CHOICES=Object.freeze([
  choice(1,2,"오늘의 저녁을 정하기",[
    option("dinner10_share_at_seven","그럼 일곱 시에 같이 먹자. 오래 기다리게 하진 않을게.",{agreement:"SHARED_AT_SEVEN"}),
    option("dinner10_eat_separately","각자 먹고 저녁에 얘기하자. 나도 한 번 만들어 볼게.",{agreement:"SEPARATE_MEALS"}),
    option("dinner10_shop_then_defer","오늘은 장만 보고 내일 다시 정할까?",{agreement:"DEFERRED"})]),
  choice(2,4,"오늘의 메뉴",[
    option("menu10_egg_rice","계란 덮밥. 한 가지부터 제대로 해 보자.",{menu:"EGG_RICE",mealSource:"HOME_COOKED"}),
    option("menu10_fried_rice_and_soup","볶음밥에 국까지 있으면 좋겠어.",{menu:"FRIED_RICE_AND_SOUP",mealSource:"HOME_COOKED"}),
    option("menu10_takeout_and_side","따뜻한 음식은 사 오고, 간단한 반찬만 준비하자.",{menu:"TAKEOUT_AND_SIDE",mealSource:"TAKEOUT"})]),
  choice(3,5,"장바구니에 더 넣고 싶은 것",[
    option("spend10_food_first","접시 말고 음식부터. 오늘은 목록대로.",{spendIntent:"FOOD_FIRST"}),
    option("spend10_consider_one_plate","여유가 되면 작은 접시 하나는 사고 싶어.",{spendIntent:"ONE_PLATE_IF_AFFORDABLE"}),
    option("spend10_browse_presentation","완성된 것처럼 보이면 좋겠어. 다른 것도 더 보자.",{spendIntent:"BROWSE_PRESENTATION"})]),
  choice(4,6,"아직 열지 않은 폴더",[
    option("work10_defer_folder","알려 줘서 고마워요. 다음 방문 전에 볼게요.",{workBoundary:"DEFERRED_WITH_REPLY"}),
    option("work10_title_only","제목만 잠깐 확인해 볼까?",{workBoundary:"TITLE_ONLY"}),
    option("work10_rest_before_reply","지금은 쉬자. 답장도 잠깐 뒤에.",{workBoundary:"RESTED_BEFORE_REPLY"})]),
  choice(5,8,"하은에게 보여 주는 준비",[
    option("prep10_admit_not_started","아직 시작 전이야. 생각보다 준비할 게 많네.",{prepReport:"NOT_STARTED_TRUTH"}),
    option("prep10_report_menu_only","메뉴는 정했어. 해 보고 중간에 말해 줄게.",{prepReport:"MENU_ONLY_TRUTH"}),
    option("prep10_claim_nearly_done","거의 다 됐어.",{prepReport:"FALSE_NEARLY_DONE"})]),
  choice(6,10,"다시 만들고 싶은 마음",[
    option("remake10_serve_edible","먹을 수 있으면 됐어. 지금 상태부터 말하자.",{remake:"KEEP_CURRENT"}),
    option("remake10_fix_one_timed","하나만 고치자. 시간을 정해 두고.",{remake:"FIX_ONE_WITH_LIMIT"}),
    option("remake10_start_over","처음부터 다시 하면 더 잘할 수 있을 것 같아.",{remake:"START_OVER"})]),
  choice(7,12,"완성되지 않은 저녁을 말하기",[
    option("timing10_give_estimate","아직 좀 걸려. 기다리지 말고 먼저 먹어도 돼.",{timing:"TRUTHFUL_ESTIMATE"}),
    option("timing10_ask_help","같이 마무리할래? 혼자 하려니 좀 복잡하네.",{timing:"ASK_TO_FINISH_TOGETHER"}),
    option("timing10_say_soon","금방이야. 조금만 기다려.",{timing:"SAY_SOON"})]),
  choice(8,15,"어긋났을 때 먼저 할 말",[
    option("repair10_serve_available","지금 먹을 수 있는 것부터 내자.",{repair:"SERVE_AVAILABLE"}),
    option("repair10_acknowledge_her_time","내가 너무 잘하려고 했어. 네 시간은 놓쳤네.",{repair:"ACKNOWLEDGE_HER_TIME"}),
    option("repair10_seek_intent_validation","너 좋아하라고 한 건데, 그렇게 말하면 나도 힘들어.",{repair:"SEEK_INTENT_VALIDATION"})]),
  choice(9,19,"지금 남기고 싶은 말",[
    option("meaning10_time_before_taste","맛있는 것도 좋지만, 다음엔 같이 먹는 시간을 먼저 잡자.",{meaning:"TIME_BEFORE_TASTE"}),
    option("meaning10_wanted_to_give","나도 누군가한테 해 줄 수 있다는 걸 보여 주고 싶었어.",{meaning:"WANTED_TO_GIVE"}),
    option("meaning10_pause_and_think","오늘은 그냥 먹자. 나도 조금 생각해 보고 싶어.",{meaning:"PAUSE_AND_THINK"})]),
  choice(10,20,"식사 뒤",[
    option("cleanup10_i_wash_you_rest","그럼 나는 씻을게. 너는 잠깐 앉아 있어.",{cleanup:"PROTAGONIST_CLEANS"}),
    option("cleanup10_together_short","같이 조금만 정리하고 끝낼까?",{cleanup:"TOGETHER_SHORT"}),
    option("cleanup10_rest_first","정리는 나중에 하고, 지금은 좀 쉬자.",{cleanup:"REST_FIRST"})]),
  choice(11,22,"하은의 친구 약속을 듣고",[
    option("sora10_ask_to_greet_later","나중에 괜찮으면 나도 인사하고 싶어.",{sora:"ASK_RESPECTFULLY"}),
    option("sora10_respect_private_meeting","잘 만나고 와. 이번 영화 결말은 꼭 합의하고.",{sora:"RESPECT_PRIVATE_MEETING"}),
    option("sora10_ask_about_my_story","내 얘기도 할 거야?",{sora:"ASK_ABOUT_SELF"})])
]);

export const DAY10_V3_FOLLOW_UP_CHOICE=Object.freeze({
  id:"day10-v3-scene-16-follow-up",sceneNumber:16,title:"내 마음을 앞세운 뒤",
  options:Object.freeze([
    option("followup10_apologize_and_eat","내 마음부터 알아 달라고 했네. 미안해. 일단 먹자.",{departure:"STAYS_AWKWARDLY"}),
    option("followup10_keep_demanding_understanding","내가 왜 그랬는지도 좀 알아줬으면 해.",{departure:"HAEUN_LEAVES"})
  ])
});

export function validateDay10V3CampaignData(){
  const ids=[...DAY10_V3_CHOICES.flatMap(item=>item.options.map(entry=>entry.id)),...DAY10_V3_FOLLOW_UP_CHOICE.options.map(entry=>entry.id)];
  return DAY10_V3_SCENES.length===24&&DAY10_V3_SCENES.every((item,index)=>item.number===index+1)&&DAY10_V3_CHOICES.length===11&&DAY10_V3_CHOICES.every((item,index)=>item.number===index+1&&item.options.length===3)&&new Set(ids).size===35;
}
