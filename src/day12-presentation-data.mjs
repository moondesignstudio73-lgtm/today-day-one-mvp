export const DAY12_REQUIRED_NEW_ASSETS=Object.freeze({
  heroineOutfit:"assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png"
});

export const DAY12_PRESENTATION_SCENES=Object.freeze({
  S01_NO_MOVEMENT_DAY:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day12",expressionId:"smile",poseId:"standing",camera:"table-two-cards-medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S02_OFFICIAL_SOURCE:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day12",expressionId:"calm",poseId:"standing",camera:"statement-phone-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PHONE_SCREEN_OFF"],assetStatus:"ready"}),
  S03_FIRST_VERIFICATION:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day12",expressionId:"smile",poseId:"standing",camera:"verification-cards-overhead-to-medium",transition:"cut",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY"],assetStatus:"ready"}),
  S04_READ_NOT_SPEND:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day12",expressionId:"calm",poseId:"standing",camera:"phone-summary-obscured-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF"],assetStatus:"ready"}),
  S05_USED_VS_OWED:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",characterAssetKey:"day12",expressionId:"smile",poseId:"standing",camera:"receipts-table-close-to-two-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S06_BALANCE_AND_PAUSE:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day12",expressionId:"calm",poseId:"standing",camera:"ledger-columns-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S07_ACCESS_SCOPE:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day12",expressionId:"smile",poseId:"standing",camera:"phone-permission-obscured-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF"],assetStatus:"ready"}),
  S08_CURRENT_OWNER:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day12",expressionId:"smile",poseId:"standing",camera:"read-only-ledger-close-to-two-shot",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_PENCIL_NOTE","SFX_PHONE_SCREEN_OFF"],assetStatus:"ready"})
});

const AUDITED_BACKGROUNDS=new Set(["home-morning","day2-home-entry","neighborhood-cafe-day"]);
const ALLOWED_SFX=new Set(["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE","SFX_DOCUMENT_RECEIVE","SFX_PHONE_SCREEN_OFF","SFX_SPARE_PHONE_KEY"]);

export function validateDay12PresentationData(scenes=DAY12_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>
    scene.assetStatus==="ready"&&AUDITED_BACKGROUNDS.has(scene.backgroundId)&&scene.characterId==="girlfriend"&&
    scene.characterAssetKey==="day12"&&["smile","calm"].includes(scene.expressionId)&&scene.poseId==="standing"&&
    scene.bgm?.category==="daily"&&scene.bgm.variant===0&&scene.bgm.volume>=0.055&&scene.bgm.volume<=0.065&&
    scene.sfx.length>=1&&scene.sfx.every(id=>ALLOWED_SFX.has(id))
  );
}
