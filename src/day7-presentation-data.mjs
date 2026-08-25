const missing=(id,path)=>Object.freeze({requiredBackgroundId:id,requiredAssetPath:path,assetStatus:"missing-required"});

export const DAY7_REQUIRED_BACKGROUND_ASSETS=Object.freeze({
  "day7-bookshop-day":"assets/backgrounds/day7/day7-small-bookshop-day-v1.png",
  "day7-river-promenade-day":"assets/backgrounds/day7/day7-river-promenade-day-v1.png"
});

export const DAY7_PRESENTATION_SCENES=Object.freeze({
  S01_HOME_PREP:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"medium",transition:"fade",bgm:{category:"dateShopping",variant:0,volume:0.07},sfx:["SFX_BAG_ZIPPER"],assetStatus:"ready"}),
  S02_DATE_WALK:Object.freeze({backgroundId:"neighborhood-street-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"wide",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.07},sfx:["SFX_AUTO_DOOR"],assetStatus:"ready"}),
  S03_BOOKSHOP:Object.freeze({...missing("day7-bookshop-day",DAY7_REQUIRED_BACKGROUND_ASSETS["day7-bookshop-day"]),characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"medium",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE"]}),
  S04_PRESENT_ACTIVITY:Object.freeze({backgroundId:"day7-gallery-day",branchBackgrounds:Object.freeze({date_new_place:"day7-gallery-day",date_revisit_with_opt_out:"day7-river-promenade-day",date_alternate_choices:"day7-gallery-day"}),requiredBranchAssets:Object.freeze({date_revisit_with_opt_out:DAY7_REQUIRED_BACKGROUND_ASSETS["day7-river-promenade-day"]}),characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"wide",transition:"crossfade",bgm:{category:"dateShopping",variant:1,volume:0.075},sfx:[],assetStatus:"partial"}),
  S05_RECOVERY_ADJUST:Object.freeze({backgroundId:"day7-gallery-day",branchBackgrounds:Object.freeze({date_new_place:"day7-gallery-day",date_revisit_with_opt_out:"day7-river-promenade-day",date_alternate_choices:"day7-gallery-day"}),requiredBranchAssets:Object.freeze({date_revisit_with_opt_out:DAY7_REQUIRED_BACKGROUND_ASSETS["day7-river-promenade-day"]}),characterId:"girlfriend",expressionId:"calm",poseId:"standing",camera:"close",transition:"cut",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_CUP_SET_DOWN"],assetStatus:"partial"}),
  S06_LATE_MEAL:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_CUP_SET_DOWN"],assetStatus:"ready"}),
  S07_MEMORY_RECORD:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"close-prop",transition:"fade",bgm:{category:"dateShopping",variant:0,volume:0.065},sfx:["SFX_PHOTO_FRAME","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S08_DAY8_PLAN:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone",camera:"medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY"],assetStatus:"ready"})
});

const READY_BACKGROUNDS=new Set(["home-morning","neighborhood-street-day","neighborhood-cafe-day","day7-gallery-day"]);
const ALLOWED_SFX=new Set(["SFX_BAG_ZIPPER","SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE","SFX_CUP_SET_DOWN","SFX_PHOTO_FRAME","SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY"]);
export function validateDay7PresentationData(scenes=DAY7_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>{
    const assetOk=scene.assetStatus==="missing-required"?typeof scene.requiredAssetPath==="string":READY_BACKGROUNDS.has(scene.backgroundId);
    return assetOk&&scene.characterId==="girlfriend"&&["calm","smile"].includes(scene.expressionId)&&["standing","phone"].includes(scene.poseId)&&["daily","dateShopping"].includes(scene.bgm?.category)&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.08&&scene.sfx.every(id=>ALLOWED_SFX.has(id));
  });
}
