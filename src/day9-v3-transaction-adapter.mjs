import {appendTransaction,recordTransaction} from "./economy-manager.mjs";
import {getItem} from "./items-data.mjs";
import {DAY9_V3_VERSION} from "./day9-v3-campaign-data.mjs";

export const DAY9_V3_ITEM_IDS=Object.freeze({green:"day9-green-pocket-shirt",scarf:"day9-pink-scarf",playerTop:"day9-player-top",socks:"day9-basic-socks"});
const flagsOf=state=>state?.storyFlags??{};
const owned=(state,itemId)=>state.inventory?.find(entry=>entry.itemId===itemId)??null;
const addCampaignItem=(state,itemId,owner,source,purchasePrice=0)=>{
  state.inventory??=[];const existing=owned(state,itemId);if(existing)return existing;
  const item=getItem(itemId);if(!item)throw new Error("DAY9_V3_ITEM_MISSING");
  const instance={instanceId:`${itemId}-${state.day??9}-${state.inventory.length+1}`,itemId,owner,source,acquiredDay:state.day??9,equipped:false,purchasePrice};
  state.inventory.push(instance);return instance;
};
const charge=(state,itemId,label)=>{
  const item=getItem(itemId);if(!item)throw new Error("DAY9_V3_ITEM_MISSING");
  if((Number(state.money)||0)<item.price)return {ok:false,reason:"INSUFFICIENT_FUNDS",price:item.price};
  recordTransaction(state,{category:"campaign-shopping",label,amount:-item.price});return {ok:true,price:item.price};
};

export function settleDay9V3Transactions(state,{greenGiftAccepted=false,haeunSelfPurchase=false,playerPurchase=false,exchangeAvailable=true}={}){
  const flags=flagsOf(state);if(flags.day9ScenarioVersion!==DAY9_V3_VERSION)throw new Error("DAY9_V3_NOT_STARTED");
  const result={scarf:"UNCHANGED",green:"UNCHANGED",playerTop:"UNCHANGED"};
  if(flags.day9V3ScarfPurchase==="PURCHASED_GIFT"&&!owned(state,DAY9_V3_ITEM_IDS.scarf)&&!owned(state,DAY9_V3_ITEM_IDS.socks)){
    const payment=charge(state,DAY9_V3_ITEM_IDS.scarf,"DAY 9 분홍빛 스카프 구매");
    if(payment.ok)addCampaignItem(state,DAY9_V3_ITEM_IDS.scarf,"player","campaign-day9",payment.price);
    else {flags.day9V3ScarfState="UNPURCHASED";flags.day9V3ScarfPurchaseFailed=true;result.scarf="INSUFFICIENT_FUNDS";}
  }
  const scarf=owned(state,DAY9_V3_ITEM_IDS.scarf);
  if(scarf&&flags.day9V3ScarfState==="EXCHANGED"){
    if(exchangeAvailable){scarf.itemId=DAY9_V3_ITEM_IDS.socks;scarf.exchangeFrom=DAY9_V3_ITEM_IDS.scarf;scarf.source="campaign-day9-exchange";result.scarf="EXCHANGED_NO_NEW_CHARGE";appendTransaction(state,{category:"campaign-exchange",label:"DAY 9 스카프를 기본 양말로 교환",amount:0});}
    else {flags.day9V3ScarfState="PROTAGONIST_OWNED";result.scarf="KEPT_BY_PROTAGONIST";}
  }else if(scarf){flags.day9V3ScarfState="PROTAGONIST_OWNED";result.scarf="KEPT_BY_PROTAGONIST";}
  if(flags.day9V3GreenShirtState==="GIFT_OFFER_PENDING"){
    if(greenGiftAccepted&&!flags.day9V3DistanceRemaining){const payment=charge(state,DAY9_V3_ITEM_IDS.green,"DAY 9 녹색 포켓 셔츠 선물");if(payment.ok){addCampaignItem(state,DAY9_V3_ITEM_IDS.green,"girlfriend","campaign-day9-gift",payment.price);flags.day9V3GreenShirtState="GIFT_ACCEPTED";flags.day9V3GreenGiftAccepted=true;result.green="GIFT_ACCEPTED";}else{flags.day9V3GreenShirtState="UNPURCHASED";flags.day9V3InsufficientFunds=true;result.green="INSUFFICIENT_FUNDS";}}else{flags.day9V3GreenShirtState="UNPURCHASED";flags.day9V3GreenGiftAccepted=false;result.green="DECLINED_OR_DISTANCE";}
  }else if(flags.day9V3GreenShirtState==="HAEUN_SELF_PURCHASE_PENDING"){
    if(haeunSelfPurchase){addCampaignItem(state,DAY9_V3_ITEM_IDS.green,"girlfriend","campaign-day9-self",getItem(DAY9_V3_ITEM_IDS.green).price);flags.day9V3GreenShirtState="HAEUN_SELF_PURCHASED";result.green="HAEUN_SELF_PURCHASED";}else{flags.day9V3GreenShirtState="UNPURCHASED";result.green="NOT_PURCHASED";}
  }
  if(flags.day9V3PlayerClothingState==="PURCHASE_CONFIRM_PENDING"){
    if(playerPurchase&&!flags.day9V3RestRoute){const payment=charge(state,DAY9_V3_ITEM_IDS.playerTop,"DAY 9 플레이어 상의 구매");if(payment.ok){addCampaignItem(state,DAY9_V3_ITEM_IDS.playerTop,"player","campaign-day9",payment.price);flags.day9V3PlayerClothingState="BOUGHT";result.playerTop="BOUGHT_NOT_EQUIPPED";}else{flags.day9V3PlayerClothingState="TRIED_NOT_BOUGHT";flags.day9V3InsufficientFunds=true;result.playerTop="INSUFFICIENT_FUNDS";}}else{flags.day9V3PlayerClothingState="TRIED_NOT_BOUGHT";result.playerTop="NOT_PURCHASED";}
  }
  flags.day9V3TransactionsSettled=true;return Object.freeze(result);
}

export function equipDay9V3GreenShirt(state,{equipped=true}={}){
  const instance=owned(state,DAY9_V3_ITEM_IDS.green);if(!instance||instance.owner!=="girlfriend")return false;
  instance.equipped=equipped===true;instance.lastWorn=equipped?state.day??9:instance.lastWorn;
  state.girlfriendEquipment??={};if(equipped)state.girlfriendEquipment["day9-campaign-clothes"]=instance.instanceId;else if(state.girlfriendEquipment["day9-campaign-clothes"]===instance.instanceId)delete state.girlfriendEquipment["day9-campaign-clothes"];
  return true;
}
