export const DAY9_V3_VERSION="NOTION_V3";

const option=(id,label,effects={})=>Object.freeze({id,label,effects:Object.freeze(effects)});
const choice=(number,scene,title,options)=>Object.freeze({number,scene,title,options:Object.freeze(options)});

export const DAY9_V3_CHOICES=Object.freeze([
  choice(1,2,"오늘의 쇼핑 범위를 정한다",[
    option("shopping9_together_full","같이 천천히 보고 쉬는 곳까지 정한다",{route:"TOGETHER_FULL"}),
    option("shopping9_together_short","스타일 몰 한 곳만 짧게 같이 본다",{route:"TOGETHER_SHORT"}),
    option("shopping9_each_then_meet","각자 본 뒤 정한 곳에서 다시 만난다",{route:"EACH_THEN_MEET"})]),
  choice(2,4,"선물 의도를 다루는 방법",[
    option("gift9_say_intent_first","사기 전에 선물하고 싶은 마음부터 말한다",{giftIntent:"DISCLOSED"}),
    option("gift9_observe_before_offer","입는 사람의 반응을 본 뒤 제안한다",{giftIntent:"OBSERVE_FIRST"}),
    option("gift9_each_chooses_own","오늘은 각자 자기 물건을 고른다",{giftIntent:"EACH_OWN"})]),
  choice(3,7,"불편한 분홍 셔츠에 반응한다",[
    option("fit9_ask_move_shoulders","어깨와 팔을 움직여 보고 불편한 곳을 묻는다",{pinkResponse:"VERIFY_COMFORT"}),
    option("fit9_photo_then_compare","사진과 실제 움직임을 나란히 확인한다",{pinkResponse:"COMPARE_PHOTO"}),
    option("fit9_pretty_push_once","예쁘다는 이유로 한 번 더 입어 보라고 한다",{pinkResponse:"PUSHED_APPEARANCE",distance:true})]),
  choice(4,9,"녹색 셔츠의 현재 장점을 확인한다",[
    option("green9_ask_her_reasons","하은이 편한 이유를 직접 말하게 한다",{greenRead:"HER_REASONS"}),
    option("green9_notice_pockets_motion","주머니와 움직임을 관찰해 확인한다",{greenRead:"POCKETS_AND_MOTION"}),
    option("green9_compare_my_preference","내가 고른 색과 무엇이 다른지 비교한다",{greenRead:"COMPARE_PREFERENCE"})]),
  choice(5,10,"녹색 셔츠 사진을 남긴다",[
    option("photo9_take_when_asked","하은이 부탁한 사진만 찍는다",{greenPhoto:true,photoScope:"REQUESTED_ONLY"}),
    option("photo9_take_and_show","찍은 뒤 바로 보여 주고 보관을 묻는다",{greenPhoto:true,photoScope:"SHOW_AND_ASK"}),
    option("photo9_no_fitting_photo","피팅 사진은 남기지 않는다",{greenPhoto:false,photoScope:"NONE"})]),
  choice(6,12,"스카프를 실제로 구매할지 정한다",[
    option("scarf9_buy_as_gift","선물용으로 결제한다",{scarfPurchase:"PURCHASED_GIFT"}),
    option("scarf9_hold_before_buy","착용감을 다시 물으며 결제를 보류한다",{scarfPurchase:"UNPURCHASED"}),
    option("scarf9_do_not_buy","불편하다는 답을 듣고 사지 않는다",{scarfPurchase:"UNPURCHASED"})]),
  choice(7,14,"스카프 거절 뒤 행동한다",[
    option("scarf9_accept_no_wear","착용을 요구하지 않고 거절을 받아들인다",{scarfResponse:"ACCEPTED",distance:false}),
    option("scarf9_ask_exchange","택과 영수증을 유지해 교환을 묻는다",{scarfResponse:"EXCHANGE"}),
    option("scarf9_push_wear_once","내가 골랐다는 이유로 한 번만 착용을 요구한다",{scarfResponse:"PUSHED_WEAR",distance:true})]),
  choice(8,16,"역할을 바꾼 뒤 다음 행동을 고른다",[
    option("player9_try_top","하은이 고른 상의를 직접 입어 본다",{playerTryOn:"TOP"}),
    option("player9_try_socks","양말을 골라 직접 착용감을 확인한다",{playerTryOn:"SOCKS"}),
    option("player9_rest_bench","더 입지 않고 벤치에서 쉰다",{playerTryOn:"REST",rest:true})]),
  choice(9,19,"최종 구매와 소유자를 정한다",[
    option("checkout9_offer_green_gift","녹색 셔츠를 선물로 제안한다",{checkout:"OFFER_GREEN_GIFT"}),
    option("checkout9_each_buys_own","각자 입어 본 자기 물건만 구매 여부를 정한다",{checkout:"EACH_BUYS_OWN"}),
    option("checkout9_no_new_purchase","새 구매 없이 필요한 교환만 처리한다",{checkout:"NO_NEW_PURCHASE"})]),
  choice(10,21,"오늘의 기억을 남기는 범위를 정한다",[
    option("memory9_photo_together","동의한 오늘 사진 한 장을 함께 남긴다",{memory:"TOGETHER_PHOTO"}),
    option("memory9_keep_private_fitting","이미 찍은 피팅 사진만 사적으로 보관한다",{memory:"PRIVATE_FITTING"}),
    option("memory9_words_only","새 사진 없이 오늘의 농담만 기억한다",{memory:"WORDS_ONLY"})]),
  choice(11,23,"내일 저녁을 제안한다",[
    option("dinner9_set_time_together","시간과 메뉴를 같이 정하자고 제안한다",{dinner:"CONFIRMED_IF_COMFORTABLE"}),
    option("dinner9_contact_before_noon","준비한 뒤 낮 전에 연락하겠다고 한다",{dinner:"CONTACT_BEFORE_NOON"}),
    option("dinner9_defer_and_ask_again","오늘은 생각만 하고 내일 다시 묻는다",{dinner:"DEFERRED"})])
]);

export function validateDay9V3CampaignData(){
  const ids=DAY9_V3_CHOICES.flatMap(item=>item.options.map(entry=>entry.id));
  return DAY9_V3_CHOICES.length===11&&DAY9_V3_CHOICES.every((item,index)=>item.number===index+1&&item.options.length===3)&&new Set(ids).size===33;
}
