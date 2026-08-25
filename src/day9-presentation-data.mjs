export const DAY9_REQUIRED_BACKGROUND_ASSETS=Object.freeze({
  "day9-office-project-room-day":"assets/backgrounds/day9/day9-office-project-room-day-v1.png"
});

export const DAY9_PRESENTATION_SCENES=Object.freeze({
  S01_HOME_BRIEF:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_BAG_ZIPPER","SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S02_OFFICE_REENTRY:Object.freeze({backgroundId:"office-day",characterId:"office-best-male",expressionId:"smile",poseId:"standing",camera:"wide",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_AUTO_DOOR"],assetStatus:"ready"}),
  S03_SCOPE_CONFIRM:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"team-lead",expressionId:"calm",poseId:"standing",camera:"medium",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_DOCUMENT_RECEIVE"],assetStatus:"ready"}),
  S04_SEOJIN_HANDOFF:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"female-coworker",expressionId:"smile",poseId:"standing",camera:"medium",transition:"cut",bgm:{category:"daily",variant:1,volume:0.06},sfx:["SFX_CUP_SET_DOWN"],assetStatus:"ready"}),
  S05_BOUNDED_REVIEW:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"female-coworker",expressionId:"calm",poseId:"standing",camera:"close-prop",transition:"cut",bgm:{category:"daily",variant:0,volume:0.05},sfx:["SFX_PENCIL_NOTE"],assetStatus:"ready"}),
  S06_FATIGUE_CHECK:Object.freeze({backgroundId:"day9-office-project-room-day",characterId:"team-lead",expressionId:"calm",poseId:"standing",camera:"close",transition:"cut",bgm:{category:"daily",variant:0,volume:0.05},sfx:["SFX_CUP_SET_DOWN"],assetStatus:"ready"}),
  S07_EXIT_RECORD:Object.freeze({backgroundId:"office-day",characterId:"office-best-male",expressionId:"smile",poseId:"standing",camera:"wide",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE","SFX_SPARE_PHONE_KEY"],assetStatus:"ready"}),
  S08_HOME_DEBRIEF:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",expressionId:"smile",poseId:"standing",camera:"medium",transition:"fade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_HOME_KEY_UNLOCK","SFX_CUP_SET_DOWN"],assetStatus:"ready"})
});

const READY_BACKGROUNDS=new Set(["home-morning","office-day","day9-office-project-room-day"]);
const READY_CHARACTERS=new Set(["girlfriend","office-best-male","team-lead","female-coworker"]);
const ALLOWED_SFX=new Set(["SFX_BAG_ZIPPER","SFX_PENCIL_NOTE","SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE","SFX_CUP_SET_DOWN","SFX_SPARE_PHONE_KEY","SFX_HOME_KEY_UNLOCK"]);
export function validateDay9PresentationData(scenes=DAY9_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>scene.assetStatus==="ready"&&READY_BACKGROUNDS.has(scene.backgroundId)&&READY_CHARACTERS.has(scene.characterId)&&["calm","smile"].includes(scene.expressionId)&&scene.bgm.category==="daily"&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.08&&scene.sfx.every(id=>ALLOWED_SFX.has(id)));
}
