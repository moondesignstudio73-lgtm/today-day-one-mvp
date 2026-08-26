export const DAY10_REQUIRED_NEW_ASSETS=Object.freeze({});

export const DAY10_PRESENTATION_SCENES=Object.freeze({
  S01_HOME_PLAN:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",supportingCharacterIds:[],expressionId:"smile",poseId:"standing",camera:"medium-plan-prop",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY"],assetStatus:"ready"}),
  S02_OFFICE_ENTRY:Object.freeze({backgroundId:"office-day",characterId:"office-best-male",supportingCharacterIds:[],expressionId:null,poseId:null,camera:"wide-to-medium-entry",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_AUTO_DOOR"],assetStatus:"ready"}),
  S03_RHYTHM_CONTRACT:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"team-lead",supportingCharacterIds:[],expressionId:null,poseId:null,camera:"clock-plan-close-to-medium",transition:"cut",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S04_CURRENT_CONTRIBUTION:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"female-coworker",supportingCharacterIds:[],expressionId:null,poseId:null,camera:"document-close-to-medium",transition:"cut",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S05_CURRENT_LUNCH:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"office-best-male",sequenceCharacterIds:["office-best-male","female-coworker"],supportingCharacterIds:["female-coworker"],expressionId:null,poseId:null,camera:"table-two-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_CUP_SET_DOWN"],assetStatus:"ready"}),
  S06_FINAL_BLOCK:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"female-coworker",sequenceCharacterIds:["female-coworker","team-lead"],supportingCharacterIds:["team-lead"],expressionId:null,poseId:null,camera:"question-sheet-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_PENCIL_NOTE","SFX_DOCUMENT_RECEIVE"],assetStatus:"ready"}),
  S07_THREE_COLUMN_DEBRIEF:Object.freeze({backgroundId:"office-day",characterId:"office-best-male",supportingCharacterIds:[],expressionId:null,poseId:null,camera:"medium-phone-prop",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_PHONE_SCREEN_OFF"],assetStatus:"ready"}),
  S08_HOME_RETURN:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",supportingCharacterIds:[],expressionId:"smile",poseId:"standing",camera:"entry-to-table-medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_HOME_KEY_UNLOCK","SFX_CUP_SET_DOWN"],assetStatus:"ready"})
});

const READY_BACKGROUNDS=new Set(["home-morning","office-day","day9-office-project-room-day","neighborhood-cafe-day"]);
const READY_CHARACTERS=new Set(["girlfriend","office-best-male","female-coworker","team-lead"]);
const ALLOWED_SFX=new Set(["SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY","SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE","SFX_CUP_SET_DOWN","SFX_PHONE_SCREEN_OFF","SFX_HOME_KEY_UNLOCK"]);

export function validateDay10PresentationData(scenes=DAY10_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>{
    const characters=[scene.characterId,...scene.supportingCharacterIds,...(scene.sequenceCharacterIds??[])].filter(Boolean);
    const heroineOk=scene.characterId!=="girlfriend"||(scene.characterAssetKey==="day8"&&scene.expressionId==="smile"&&scene.poseId==="standing");
    const npcOk=scene.characterId==="girlfriend"||(scene.expressionId===null&&scene.poseId===null);
    return scene.assetStatus==="ready"&&READY_BACKGROUNDS.has(scene.backgroundId)&&characters.every(id=>READY_CHARACTERS.has(id))&&
      heroineOk&&npcOk&&scene.bgm?.category==="daily"&&scene.bgm.variant===0&&scene.bgm.volume>=0.055&&scene.bgm.volume<=0.065&&
      scene.sfx.every(id=>ALLOWED_SFX.has(id));
  });
}
