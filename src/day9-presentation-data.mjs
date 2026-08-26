export const DAY9_REQUIRED_BACKGROUND_ASSETS=Object.freeze({
  "day9-office-project-room-day":"assets/backgrounds/day9/day9-office-project-room-day-v1.png"
});

export const DAY9_PRESENTATION_SCENES=Object.freeze({
  S01_HOME_PREP:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",supportingCharacterIds:[],expressionId:"smile",poseId:"standing",camera:"medium-prop",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_PENCIL_NOTE","SFX_BAG_ZIPPER"],assetStatus:"ready"}),
  S02_SOLO_COMMUTE:Object.freeze({backgroundId:"neighborhood-street-day",characterId:null,supportingCharacterIds:[],expressionId:null,poseId:null,camera:"wide-to-signage",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY","SFX_AUTO_DOOR"],assetStatus:"ready"}),
  S03_LOBBY_ORIENTATION:Object.freeze({backgroundId:"office-day",characterId:"office-best-male",supportingCharacterIds:["team-lead","female-coworker"],expressionId:null,poseId:null,camera:"medium-to-desk-map",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE"],assetStatus:"ready"}),
  S04_SCOPE_SELECTION:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"female-coworker",supportingCharacterIds:["office-best-male"],expressionId:null,poseId:null,camera:"medium-to-file-close",transition:"cut",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S05_AUTHORITY_PRESSURE:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"office-rookie",supportingCharacterIds:["office-best-male","female-coworker"],expressionId:null,poseId:null,camera:"tablet-close-to-medium",transition:"cut",bgm:{category:"daily",variant:0,volume:0.05},sfx:["SFX_DOOR_OPEN"],assetStatus:"ready"}),
  S06_BOUNDED_HELP:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"team-lead",supportingCharacterIds:["office-rookie","female-coworker"],expressionId:null,poseId:null,camera:"document-close-to-medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_PENCIL_NOTE","SFX_DOCUMENT_RECEIVE"],assetStatus:"ready"}),
  S07_BENCH_DEBRIEF:Object.freeze({backgroundId:"neighborhood-street-day",characterId:"female-coworker",supportingCharacterIds:[],expressionId:null,poseId:null,camera:"two-shot-water-prop",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_CUP_SET_DOWN"],assetStatus:"ready"}),
  S08_STOP_AND_RETURN:Object.freeze({backgroundId:"office-day",sequenceBackgroundIds:["office-day","home-morning"],characterId:"office-best-male",sequenceCharacterIds:["office-best-male","team-lead","girlfriend"],supportingCharacterIds:["team-lead","girlfriend"],expressionId:null,poseId:null,camera:"clock-close-to-home-medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_PHONE_SCREEN_OFF","SFX_HOME_KEY_UNLOCK"],assetStatus:"ready"})
});

const READY_BACKGROUNDS=new Set(["home-morning","neighborhood-street-day","office-day","day9-office-project-room-day"]);
const READY_CHARACTERS=new Set(["girlfriend","female-coworker","office-rookie","team-lead","office-best-male"]);
const ALLOWED_SFX=new Set(["SFX_PENCIL_NOTE","SFX_BAG_ZIPPER","SFX_SPARE_PHONE_KEY","SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE","SFX_DOOR_OPEN","SFX_CUP_SET_DOWN","SFX_PHONE_SCREEN_OFF","SFX_HOME_KEY_UNLOCK"]);
export function validateDay9PresentationData(scenes=DAY9_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>{
    const backgrounds=[scene.backgroundId,...(scene.sequenceBackgroundIds??[])];
    const characters=[scene.characterId,...scene.supportingCharacterIds,...(scene.sequenceCharacterIds??[])].filter(Boolean);
    const protagonistSolo=scene.characterId===null&&scene.expressionId===null&&scene.poseId===null;
    const heroineOk=scene.characterId!=="girlfriend"||(scene.expressionId==="smile"&&scene.poseId==="standing");
    const npcOk=scene.characterId===null||scene.characterId==="girlfriend"||(scene.expressionId===null&&scene.poseId===null);
    return scene.assetStatus==="ready"&&backgrounds.every(id=>READY_BACKGROUNDS.has(id))&&
      characters.every(id=>READY_CHARACTERS.has(id))&&(scene.characterId!==null||protagonistSolo)&&heroineOk&&npcOk&&
      scene.bgm?.category==="daily"&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.07&&
      scene.sfx.every(id=>ALLOWED_SFX.has(id));
  });
}
