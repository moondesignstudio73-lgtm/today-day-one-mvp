export const DAY15_REQUIRED_NEW_ASSETS=Object.freeze([]);

export const DAY15_PRESENTATION_SCENES=Object.freeze({
  S01_TIME_USE_PRACTICE:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day7",expressionId:"smile",poseId:"standing",camera:"leisure-candidate-cards-overhead-to-two-shot",transition:"fade",bgm:{category:"dateShopping",variant:0,volume:0.07},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE","SFX_CUP_SET_DOWN"],assetStatus:"audited"}),
  S02_EACH_TURN:Object.freeze({backgroundId:"neighborhood-street-day",characterId:"girlfriend",characterAssetKey:"day7",expressionId:"smile",poseId:"standing",camera:"route-bench-wide-to-medium",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.07},sfx:["SFX_BAG_ZIPPER","SFX_AUTO_DOOR"],assetStatus:"audited"}),
  S03_FIRST_ACTIVITY:Object.freeze({backgroundId:"day7-bookshop-day",characterId:"girlfriend",characterAssetKey:"day7",expressionId:"smile",poseId:"standing",camera:"candidate-card-and-entry-medium-to-choice",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S04_FIRST_OR_RETURN:Object.freeze({backgroundId:"day7-bookshop-day",branchBackgrounds:Object.freeze({leisure15_activity_each_pick:"day7-gallery-day",leisure15_activity_two_options:"day7-gallery-day",leisure15_activity_low_sensory:"day7-bookshop-day"}),characterId:"girlfriend",characterAssetKey:"day7",expressionId:"calm",poseId:"phone",camera:"obscured-reservation-label-metadata-close-to-two-shot",transition:"cut",bgm:{category:"dateShopping",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S05_LIKED_TODAY:Object.freeze({backgroundId:"day7-bookshop-day",branchBackgrounds:Object.freeze({leisure15_activity_each_pick:"day7-gallery-day",leisure15_activity_two_options:"day7-gallery-day",leisure15_activity_low_sensory:"day7-bookshop-day"}),characterId:"girlfriend",characterAssetKey:"day7",expressionId:"smile",poseId:"standing",camera:"book-or-art-detail-to-opposed-gaze-two-shot",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S06_CHANGEABLE_PLAN:Object.freeze({backgroundId:"day7-gallery-day",branchBackgrounds:Object.freeze({leisure15_change_shorten:"day7-gallery-day",leisure15_change_switch:"day7-river-promenade-day",leisure15_change_end:"neighborhood-cafe-day"}),characterId:"girlfriend",characterAssetKey:"day7",expressionId:"calm",poseId:"standing",camera:"exit-or-bench-wide-to-medium",transition:"cut",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_AUTO_DOOR","SFX_CUP_SET_DOWN"],assetStatus:"audited"}),
  S07_OWNER_OF_REMAINING_TIME:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",characterAssetKey:"day7",expressionId:"smile",poseId:"standing",camera:"cup-candidate-note-close-to-two-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S08_BEFORE_PHOTO:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",characterAssetKey:"day7",expressionId:"smile",poseId:"phone",camera:"obscured-sharing-toggle-or-cup-photo-close-to-two-shot",transition:"fade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF","SFX_PHOTO_FRAME"],assetStatus:"audited"})
});

const AUDITED_BACKGROUNDS=new Set(["home-morning","neighborhood-street-day","day7-bookshop-day","day7-gallery-day","day7-river-promenade-day","neighborhood-cafe-day"]);
const ALLOWED_SFX=new Set(["SFX_BAG_ZIPPER","SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE","SFX_CUP_SET_DOWN","SFX_PHOTO_FRAME","SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF"]);

export function validateDay15PresentationData(scenes=DAY15_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>{
    const backgrounds=[scene.backgroundId,...Object.values(scene.branchBackgrounds??{})];
    return scene.assetStatus==="audited"&&backgrounds.every(id=>AUDITED_BACKGROUNDS.has(id))&&
      scene.characterId==="girlfriend"&&scene.characterAssetKey==="day7"&&["calm","smile"].includes(scene.expressionId)&&
      ["standing","phone"].includes(scene.poseId)&&["fade","crossfade","cut"].includes(scene.transition)&&
      ["daily","dateShopping"].includes(scene.bgm?.category)&&scene.bgm.variant===0&&scene.bgm.volume>=0.055&&
      scene.bgm.volume<=0.07&&scene.sfx.length>=1&&scene.sfx.every(id=>ALLOWED_SFX.has(id));
  });
}
