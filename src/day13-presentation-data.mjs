export const DAY13_REQUIRED_NEW_ASSETS=Object.freeze([]);

export const DAY13_PRESENTATION_SCENES=Object.freeze({
  S01_FOUR_CARD_TABLE:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day6",expressionId:"smile",poseId:"standing",camera:"four-budget-cards-overhead-to-medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S02_VERIFIED_SOURCE:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day6",expressionId:"calm",poseId:"standing",camera:"source-labels-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_DOCUMENT_RECEIVE","SFX_BAG_ZIPPER"],assetStatus:"audited"}),
  S03_FIRST_BUDGET_LINE:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day6",expressionId:"smile",poseId:"standing",camera:"four-cards-overhead-to-medium",transition:"cut",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S04_PRICES_AND_QUANTITY:Object.freeze({backgroundId:"neighborhood-market-day",characterId:"girlfriend",characterAssetKey:"day6",expressionId:"smile",poseId:"standing",camera:"price-tags-basket-wide-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_BAG_ZIPPER","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S05_CONTRIBUTION_RULE:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",characterAssetKey:"day6",expressionId:"calm",poseId:"standing",camera:"receipt-snack-table-close-to-two-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S06_PLAN_NOT_PAYMENT:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day6",expressionId:"calm",poseId:"standing",camera:"obscured-auto-transfer-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF"],assetStatus:"audited"}),
  S07_REVIEW_SCOPE:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day6",expressionId:"smile",poseId:"standing",camera:"obscured-ledger-permission-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S08_AGREED_SHARED:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day6",expressionId:"smile",poseId:"standing",camera:"four-cards-folder-close-to-two-shot",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_PENCIL_NOTE","SFX_PHONE_SCREEN_OFF"],assetStatus:"audited"})
});

const AUDITED_BACKGROUNDS=new Set(["home-morning","day2-home-entry","neighborhood-market-day","neighborhood-cafe-day"]);
const ALLOWED_SFX=new Set(["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE","SFX_DOCUMENT_RECEIVE","SFX_PHONE_SCREEN_OFF","SFX_SPARE_PHONE_KEY","SFX_BAG_ZIPPER"]);

export function validateDay13PresentationData(scenes=DAY13_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>
    scene.assetStatus==="audited"&&AUDITED_BACKGROUNDS.has(scene.backgroundId)&&scene.characterId==="girlfriend"&&
    scene.characterAssetKey==="day6"&&["smile","calm"].includes(scene.expressionId)&&scene.poseId==="standing"&&
    scene.bgm?.category==="daily"&&scene.bgm.variant===0&&scene.bgm.volume>=0.055&&scene.bgm.volume<=0.065&&
    scene.sfx.length>=1&&scene.sfx.every(id=>ALLOWED_SFX.has(id))
  );
}
