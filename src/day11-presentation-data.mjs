export const DAY11_REQUIRED_NEW_ASSETS=Object.freeze({});

export const DAY11_PRESENTATION_SCENES=Object.freeze({
  S01_HOME_CARDS:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"table-cards-medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S02_TWO_DATES:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"calm",poseId:"standing",camera:"fridge-note-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S03_FIRST_ANCHOR:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"calendar-overhead-to-medium",transition:"cut",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S04_REAL_WALK_TIME:Object.freeze({backgroundId:"neighborhood-street-day",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"wide-walk-to-bench-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_FOOTSTEP_APPROACH","SFX_PHONE_SCREEN_OFF"],assetStatus:"ready"}),
  S05_OVERLAP_CAFE:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"calm",poseId:"standing",camera:"table-cards-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_CUP_SET_DOWN","SFX_SPARE_PHONE_KEY"],assetStatus:"ready"}),
  S06_BUFFER_PARK:Object.freeze({backgroundId:"neighborhood-park-day",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"wide-bench-to-note-close",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S07_SHARE_SCOPE:Object.freeze({backgroundId:"day2-home-entry",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"calm",poseId:"standing",camera:"two-phone-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF"],assetStatus:"ready"}),
  S08_UPDATEABLE_PLAN:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"calendar-close-to-two-shot",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY"],assetStatus:"ready"})
});

const AUDITED_BACKGROUNDS=new Set(["home-morning","day2-home-entry","neighborhood-street-day","neighborhood-cafe-day","neighborhood-park-day"]);
const ALLOWED_SFX=new Set(["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE","SFX_DOCUMENT_RECEIVE","SFX_FOOTSTEP_APPROACH","SFX_PHONE_SCREEN_OFF","SFX_SPARE_PHONE_KEY"]);

export function validateDay11PresentationData(scenes=DAY11_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>
    scene.assetStatus==="ready"&&AUDITED_BACKGROUNDS.has(scene.backgroundId)&&scene.characterId==="girlfriend"&&
    scene.characterAssetKey==="day8"&&["smile","calm"].includes(scene.expressionId)&&scene.poseId==="standing"&&
    scene.bgm?.category==="daily"&&scene.bgm.variant===0&&scene.bgm.volume>=0.055&&scene.bgm.volume<=0.065&&
    scene.sfx.length>=1&&scene.sfx.every(id=>ALLOWED_SFX.has(id))
  );
}
