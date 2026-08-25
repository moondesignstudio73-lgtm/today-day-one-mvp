export const DAY6_PRESENTATION_SCENES=Object.freeze({
  S01_HOME_PLAN:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"calm",poseId:"phone",camera:"medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.075},sfx:["SFX_SPARE_PHONE_KEY"]}),
  S02_FIRST_TURN:Object.freeze({backgroundId:"neighborhood-street-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"wide",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.07},sfx:["SFX_AUTO_DOOR"]}),
  S03_PHARMACY:Object.freeze({backgroundId:"neighborhood-pharmacy-day",characterId:"girlfriend",expressionId:"calm",poseId:"standing",camera:"medium",transition:"cut",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE"]}),
  S04_MARKET:Object.freeze({backgroundId:"neighborhood-market-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"close-prop",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.07},sfx:["SFX_BAG_ZIPPER"]}),
  S05_CAFE:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"medium",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.065},sfx:["SFX_CUP_SET_DOWN"]}),
  S06_WORK_MESSAGE:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"girlfriend",expressionId:"calm",poseId:"phone",camera:"close",transition:"cut",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_SPARE_PHONE_KEY"]}),
  S07_DATE_PLAN:Object.freeze({backgroundId:"neighborhood-park-day",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"wide",transition:"crossfade",bgm:{category:"dateShopping",variant:0,volume:0.075},sfx:[]}),
  S08_MAP_HOME:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"close-prop",transition:"fade",bgm:{category:"daily",variant:0,volume:0.07},sfx:["SFX_PENCIL_NOTE"]})
});

const ALLOWED_BACKGROUNDS=new Set(["home-morning","neighborhood-street-day","neighborhood-pharmacy-day","neighborhood-market-day","neighborhood-cafe-day","neighborhood-park-day"]);
const ALLOWED_EXPRESSIONS=new Set(["calm","smile"]);
const ALLOWED_POSES=new Set(["standing","phone"]);
const ALLOWED_BGM=new Set(["daily","dateShopping"]);
const ALLOWED_SFX=new Set(["SFX_SPARE_PHONE_KEY","SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE","SFX_BAG_ZIPPER","SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE"]);

export function validateDay6PresentationData(scenes=DAY6_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>
    ALLOWED_BACKGROUNDS.has(scene.backgroundId)&&scene.characterId==="girlfriend"&&
    ALLOWED_EXPRESSIONS.has(scene.expressionId)&&ALLOWED_POSES.has(scene.poseId)&&
    typeof scene.camera==="string"&&typeof scene.transition==="string"&&
    ALLOWED_BGM.has(scene.bgm?.category)&&Number.isInteger(scene.bgm.variant)&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.08&&
    Array.isArray(scene.sfx)&&scene.sfx.every(id=>ALLOWED_SFX.has(id))
  );
}
