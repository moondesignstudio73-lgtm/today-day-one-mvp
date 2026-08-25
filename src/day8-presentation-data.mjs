export const DAY8_REQUIRED_BACKGROUND_ASSETS=Object.freeze({
  "day8-household-store-day":"assets/backgrounds/day8/day8-household-store-day-v1.png"
});

export const DAY8_PRESENTATION_SCENES=Object.freeze({
  S01_HOME_SCOPE:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_BAG_ZIPPER","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S02_CONTACT_CONTRACT:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone",camera:"close-prop",transition:"cut",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY"],assetStatus:"ready"}),
  S03_PHARMACY_CONFIRM:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"phone",camera:"medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_SPARE_PHONE_KEY","SFX_FRONT_DOOR_CLOSE"],assetStatus:"ready"}),
  S04_MAILBOX:Object.freeze({backgroundId:"neighborhood-street-day",characterId:null,expressionId:null,poseId:null,camera:"close-prop",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_DOCUMENT_RECEIVE"],assetStatus:"ready"}),
  S05_STORE_MEMBER:Object.freeze({backgroundId:"day8-household-store-day",characterId:null,expressionId:null,poseId:null,camera:"medium",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.065},sfx:["SFX_AUTO_DOOR"],assetStatus:"ready"}),
  S06_CURRENT_PURCHASE:Object.freeze({backgroundId:"day8-household-store-day",branchBackgrounds:Object.freeze({errand8_change_only_checkin:"day8-household-store-day",errand8_timed_checkin:"day8-household-store-day",errand8_return_only_report:"neighborhood-cafe-day"}),characterId:null,expressionId:null,poseId:null,camera:"close-prop",transition:"cut",bgm:{category:"dateShopping",variant:0,volume:0.06},sfx:["SFX_BAG_ZIPPER","SFX_CUP_SET_DOWN"],assetStatus:"ready"}),
  S07_HOME_DEBRIEF:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"close-prop",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_HOME_KEY_UNLOCK","SFX_CUP_SET_DOWN","SFX_DOCUMENT_RECEIVE"],assetStatus:"ready"}),
  S08_DAY9_PLAN:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone",camera:"medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY"],assetStatus:"ready"})
});

const READY_BACKGROUNDS=new Set(["home-morning","neighborhood-street-day","neighborhood-cafe-day","day8-household-store-day"]);
const ALLOWED_SFX=new Set(["SFX_BAG_ZIPPER","SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY","SFX_FRONT_DOOR_CLOSE","SFX_DOCUMENT_RECEIVE","SFX_AUTO_DOOR","SFX_CUP_SET_DOWN","SFX_HOME_KEY_UNLOCK"]);

export function validateDay8PresentationData(scenes=DAY8_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>{
    const backgrounds=[scene.backgroundId,...Object.values(scene.branchBackgrounds??{})];
    const statusOk=scene.assetStatus==="ready"&&backgrounds.every(id=>READY_BACKGROUNDS.has(id));
    const characterOk=scene.characterId===null
      ? scene.expressionId===null&&scene.poseId===null
      : scene.characterId==="girlfriend"&&["calm","smile"].includes(scene.expressionId)&&["standing","phone"].includes(scene.poseId);
    return statusOk&&characterOk&&["daily","dateShopping"].includes(scene.bgm?.category)&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.08&&scene.sfx.every(id=>ALLOWED_SFX.has(id));
  });
}
