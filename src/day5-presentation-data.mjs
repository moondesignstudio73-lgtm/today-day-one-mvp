export const DAY5_PRESENTATION_SCENES=Object.freeze({
  S01_HOME_PREP:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",bgm:{category:"daily",variant:0,volume:0.075},sfx:["SFX_CUP_SET_DOWN"]}),
  S02_OFFICE_THRESHOLD:Object.freeze({backgroundId:"office-day",characterId:"girlfriend",bgm:{category:"daily",variant:0,volume:0.07},sfx:["SFX_AUTO_DOOR"]}),
  S03_COWORKER_REUNION:Object.freeze({backgroundId:"office-day",characterId:"office-best-male",bgm:{category:"daily",variant:0,volume:0.065},sfx:[]}),
  S04_DESK_RETURN:Object.freeze({backgroundId:"office-day",characterId:"team-lead",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_DOCUMENT_RECEIVE"]}),
  S05_SEOJIN_CONTEXT:Object.freeze({backgroundId:"office-day",characterId:"female-coworker",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_CUP_SET_DOWN"]}),
  S06_WORK_TRIAL:Object.freeze({backgroundId:"office-day",characterId:"female-coworker",bgm:{category:"daily",variant:0,volume:0.05},sfx:["SFX_PENCIL_NOTE"]}),
  S07_RETURN_PLAN:Object.freeze({backgroundId:"office-day",characterId:"team-lead",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE"]}),
  S08_DAY_END:Object.freeze({backgroundId:"office-day",characterId:"office-best-male",bgm:{category:"daily",variant:0,volume:0.075},sfx:["SFX_SPARE_PHONE_KEY"]})
});

const ALLOWED_BACKGROUNDS=new Set(["home-morning","office-day"]);
const ALLOWED_CHARACTERS=new Set(["girlfriend","female-coworker","office-best-male","team-lead"]);
const ALLOWED_SFX=new Set(["SFX_CUP_SET_DOWN","SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY"]);

export function validateDay5PresentationData(scenes=DAY5_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>
    ALLOWED_BACKGROUNDS.has(scene.backgroundId)&&
    ALLOWED_CHARACTERS.has(scene.characterId)&&
    scene.bgm?.category==="daily"&&Number.isInteger(scene.bgm.variant)&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.08&&
    Array.isArray(scene.sfx)&&scene.sfx.every(id=>ALLOWED_SFX.has(id))
  );
}
