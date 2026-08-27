export const DAY14_REQUIRED_NEW_ASSETS=Object.freeze([]);

export const DAY14_PRESENTATION_SCENES=Object.freeze({
  S01_THREE_CARDS:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"three-budget-cards-overhead-to-two-shot",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S02_NEEDED_SUBJECT:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"towel-detergent-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_BAG_ZIPPER","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S03_SEARCH_LANE:Object.freeze({backgroundId:"day8-household-store-day",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"split-shelves-wide-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_BAG_ZIPPER","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S04_UNSOURCED_RECOMMENDATION:Object.freeze({backgroundId:"day8-household-store-day",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"calm",poseId:"standing",camera:"obscured-recommendation-metadata-close-to-two-shot",transition:"cut",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S05_DISCOUNT_PAUSE:Object.freeze({backgroundId:"neighborhood-market-day",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"calm",poseId:"standing",camera:"basket-price-tag-wide-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_BAG_ZIPPER","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S06_RECEIPT_LIMITS:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"receipt-or-note-close-to-two-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S07_GIFT_CONSENT:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"calm",poseId:"standing",camera:"obscured-cup-wishlist-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF"],assetStatus:"audited"}),
  S08_SAVE_CURRENT_CHOICE:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"three-rules-leisure-candidates-overhead-to-two-shot",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_PENCIL_NOTE","SFX_PHONE_SCREEN_OFF"],assetStatus:"audited"})
});

const AUDITED_BACKGROUNDS=new Set(["home-morning","day2-home-entry","day8-household-store-day","neighborhood-market-day","neighborhood-cafe-day"]);
const ALLOWED_SFX=new Set(["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE","SFX_DOCUMENT_RECEIVE","SFX_PHONE_SCREEN_OFF","SFX_SPARE_PHONE_KEY","SFX_BAG_ZIPPER"]);

export function validateDay14PresentationData(scenes=DAY14_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>
    scene.assetStatus==="audited"&&AUDITED_BACKGROUNDS.has(scene.backgroundId)&&scene.characterId==="girlfriend"&&
    scene.characterAssetKey==="day8"&&["smile","calm"].includes(scene.expressionId)&&scene.poseId==="standing"&&
    ["fade","crossfade","cut"].includes(scene.transition)&&scene.bgm?.category==="daily"&&scene.bgm.variant===0&&
    scene.bgm.volume>=0.055&&scene.bgm.volume<=0.065&&scene.sfx.length>=1&&scene.sfx.every(id=>ALLOWED_SFX.has(id))
  );
}
