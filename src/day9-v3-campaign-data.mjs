export const DAY9_V3_VERSION="NOTION_V3";

const option=(id,label,effects={})=>Object.freeze({id,label,effects:Object.freeze(effects)});
const choice=(number,scene,title,options)=>Object.freeze({number,scene,title,options:Object.freeze(options)});

export const DAY9_V3_CHOICES=Object.freeze([
  choice(1,2,"오늘의 쇼핑 범위를 정한다",[
    option("shopping9_together_full","같이 천천히 보고 쉬는 곳까지 정한다",{route:"TOGETHER_FULL"}),
    option("shopping9_together_short","스타일 몰 한 곳만 짧게 같이 본다",{route:"TOGETHER_SHORT"}),
    option("shopping9_each_then_meet","각자 본 뒤 정한 곳에서 다시 만난다",{route:"EACH_THEN_MEET"})]),
  choice(2,3,"선물을 생각하는 마음",[
    option("gift9_say_intent_first","사기 전에 선물하고 싶은 마음부터 말한다",{giftIntent:"DISCLOSED"}),
    option("gift9_observe_before_offer","입는 사람의 반응을 본 뒤 제안한다",{giftIntent:"OBSERVE_FIRST"}),
    option("gift9_secret_after_looking","보고 나서 작은 선물을 몰래 고른다",{giftIntent:"SECRET_AFTER_LOOKING"})]),
  choice(3,5,"입어 보기 전 취향을 말한다",[
    option("fit9_say_my_preference","내 취향을 말하되 둘 다 보고 싶다고 한다",{preFit:"MY_PREFERENCE"}),
    option("fit9_ask_green_preference","하은이 고른 녹색이 마음에 드는지 묻는다",{preFit:"ASK_HER_PREFERENCE"}),
    option("fit9_confident_recommendation","무조건 어울린다고 자신 있게 추천한다",{preFit:"CONFIDENT_RECOMMENDATION"})]),
  choice(4,7,"사진과 다른 착용감을 확인한다",[
    option("fit9_ask_wearing_comfort","입고 있는 몸은 어떤지 묻는다",{pinkResponse:"VERIFY_COMFORT"}),
    option("fit9_push_special_day","특별한 날엔 조금 불편해도 괜찮지 않겠냐고 묻는다",{pinkResponse:"PUSHED_APPEARANCE",distance:true}),
    option("fit9_admit_not_listening","내 취향 때문에 하은의 말을 덜 들었다고 인정한다",{pinkResponse:"ACKNOWLEDGED_MISSED"})]),
  choice(5,9,"취향이 다르다는 것을 다룬다",[
    option("green9_like_her_smile","하은이 웃어서 그 옷도 좋아졌다고 말한다",{greenRead:"SMILE_CHANGED_VIEW"}),
    option("green9_keep_my_taste_understand","내 취향은 그대로지만 하은이 좋아하는 이유를 안다고 말한다",{greenRead:"DIFFERENT_BUT_UNDERSTOOD"}),
    option("green9_decide_buy_now","좋다는 말을 구매 결정으로 바꿔 바로 사 주겠다고 한다",{greenRead:"RUSHED_PURCHASE"})]),
  choice(6,11,"기다리는 동안 선물 욕구를 다룬다",[
    option("scarf9_ask_before_buy","하은이 나오면 스카프가 어떤지 먼저 묻는다",{scarfPurchase:"UNPURCHASED",scarfIntent:"ASK_FIRST"}),
    option("scarf9_buy_secret","작은 선물은 괜찮다고 판단해 먼저 산다",{scarfPurchase:"PURCHASED_GIFT",scarfIntent:"BOUGHT_SECRET"}),
    option("scarf9_wait_my_desire","내가 고르고 싶은 마음도 기다린다",{scarfPurchase:"UNPURCHASED",scarfIntent:"WAITED"})]),
  choice(7,13,"선물이 마음에 들지 않을 때 행동한다",[
    option("scarf9_exchange_or_put_down","바꾸거나 내려놓고 내 기분도 스스로 다룬다",{scarfResponse:"EXCHANGE_OR_PUT_DOWN"}),
    option("scarf9_admit_embarrassed","하은 탓 없이 내가 민망하다고 말한다",{scarfResponse:"ADMIT_EMBARRASSED"}),
    option("scarf9_push_wear_once","아쉬움을 이유로 한 번 써 보라고 요구한다",{scarfResponse:"PUSHED_WEAR",distance:true})]),
  choice(8,16,"역할을 바꾼 뒤 다음 행동을 고른다",[
    option("player9_choose_my_top","내가 고른 무늬 없는 상의를 입어 본다",{playerTryOn:"OWN_TOP"}),
    option("player9_try_her_top","하은이 고른 줄무늬 상의를 입어 본다",{playerTryOn:"HER_TOP"}),
    option("player9_rest_bench","더 입지 않고 벤치에서 쉰다",{playerTryOn:"REST",rest:true})]),
  choice(9,19,"최종 구매와 소유자를 정한다",[
    option("checkout9_offer_green_gift","사고 싶다면 선물하되 오늘 안 사도 된다고 제안한다",{checkout:"OFFER_GREEN_GIFT"}),
    option("checkout9_each_buys_own","각자 고르고 내 것도 한 번 더 생각한다",{checkout:"EACH_BUYS_OWN"}),
    option("checkout9_leave_then_decide","둘 다 안 사고 나가 본 뒤 결정한다",{checkout:"NO_NEW_PURCHASE"})]),
  choice(10,21,"오늘의 기억을 남기는 범위를 정한다",[
    option("memory9_haeun_picks_photo","하은이 가장 마음에 드는 피팅 사진을 남긴다",{memory:"HAEUN_PICKS"}),
    option("memory9_photo_together","옷 대신 지금의 둘을 함께 찍는다",{memory:"TOGETHER_PHOTO"}),
    option("memory9_words_only","오늘은 새 사진 없이 기억한다",{memory:"WORDS_ONLY"})]),
  choice(11,23,"내일 저녁을 제안한다",[
    option("dinner9_set_time_together","시간과 메뉴를 같이 정하자고 제안한다",{dinner:"CONFIRMED_IF_COMFORTABLE"}),
    option("dinner9_contact_before_noon","준비한 뒤 낮 전에 연락하겠다고 한다",{dinner:"CONTACT_BEFORE_NOON"}),
    option("dinner9_defer_and_ask_again","오늘은 생각만 하고 내일 다시 묻는다",{dinner:"DEFERRED"})])
]);

export function validateDay9V3CampaignData(){
  const ids=DAY9_V3_CHOICES.flatMap(item=>item.options.map(entry=>entry.id));
  return DAY9_V3_CHOICES.length===11&&DAY9_V3_CHOICES.every((item,index)=>item.number===index+1&&item.options.length===3)&&new Set(ids).size===33;
}
