export const DAY16_REQUIRED_NEW_ASSETS=Object.freeze([]);

export const DAY16_PRESENTATION_SCENES=Object.freeze({
  S01_CONTACT_STATUS:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"contact-status-list-close-to-kitchen-two-shot",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_SPARE_PHONE_KEY","SFX_CUP_SET_DOWN"],assetStatus:"audited"}),
  S02_REPLY_SENTENCE:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"calm",poseId:"phone",camera:"obscured-reply-draft-close-to-two-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S03_CURRENT_CONTACT_RANGE:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"best-friend",characterAssetKey:"best-friend",expressionId:"smile",poseId:"standing",camera:"public-cafe-entrance-wide-to-three-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_AUTO_DOOR","SFX_CUP_SET_DOWN"],assetStatus:"audited"}),
  S04_UNEDITED_INTRO:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"best-friend",characterAssetKey:"best-friend",expressionId:"calm",poseId:"standing",camera:"business-card-and-portfolio-close-to-table-two-shot",transition:"cut",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE"],assetStatus:"audited"}),
  S05_SCOPE_OF_FRIEND:Object.freeze({backgroundId:"neighborhood-cafe-day",characterId:"best-friend",characterAssetKey:"best-friend",expressionId:"calm",poseId:"standing",camera:"obscured-group-notification-close-to-opposed-two-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.055},sfx:["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF"],assetStatus:"audited"}),
  S06_RIGHT_TO_END:Object.freeze({backgroundId:"neighborhood-cafe-day",branchBackgrounds:Object.freeze({social16_meeting_public_45:"neighborhood-street-day",social16_meeting_topics_current:"neighborhood-street-day",social16_meeting_exit_anytime:"neighborhood-street-day"}),characterId:"best-friend",characterAssetKey:"best-friend",expressionId:"smile",poseId:"standing",camera:"cafe-exit-to-day-street-wide",transition:"cut",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_BAG_ZIPPER","SFX_AUTO_DOOR"],assetStatus:"audited"}),
  S07_OWNER_OF_MY_NEWS:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"calm",poseId:"phone",camera:"dinner-and-obscured-relationship-note-close-to-two-shot",transition:"crossfade",bgm:{category:"daily",variant:0,volume:0.06},sfx:["SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY"],assetStatus:"audited"}),
  S08_ONE_PERSON_AT_A_TIME:Object.freeze({backgroundId:"home-morning",characterId:"girlfriend",characterAssetKey:"day8",expressionId:"smile",poseId:"standing",camera:"relationship-map-empty-slots-close-to-evening-two-shot",transition:"fade",bgm:{category:"daily",variant:0,volume:0.065},sfx:["SFX_DOCUMENT_RECEIVE","SFX_PHONE_SCREEN_OFF"],assetStatus:"audited"})
});

const AUDITED_BACKGROUNDS=new Set(["home-morning","neighborhood-cafe-day","neighborhood-street-day"]);
const ALLOWED_SFX=new Set(["SFX_BAG_ZIPPER","SFX_AUTO_DOOR","SFX_DOCUMENT_RECEIVE","SFX_CUP_SET_DOWN","SFX_PENCIL_NOTE","SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF"]);

export function validateDay16PresentationData(scenes=DAY16_PRESENTATION_SCENES){
  const values=Object.values(scenes);
  return values.length===8&&values.every(scene=>{
    const backgrounds=[scene.backgroundId,...Object.values(scene.branchBackgrounds??{})];
    const characterOk=scene.characterId==="girlfriend"
      ? scene.characterAssetKey==="day8"&&["calm","smile"].includes(scene.expressionId)&&["standing","phone"].includes(scene.poseId)
      : scene.characterId==="best-friend"&&scene.characterAssetKey==="best-friend"&&["calm","smile"].includes(scene.expressionId)&&scene.poseId==="standing";
    return scene.assetStatus==="audited"&&backgrounds.every(id=>AUDITED_BACKGROUNDS.has(id))&&characterOk&&
      ["fade","crossfade","cut"].includes(scene.transition)&&scene.bgm?.category==="daily"&&scene.bgm.variant===0&&
      scene.bgm.volume>=0.055&&scene.bgm.volume<=0.065&&scene.sfx.length>=1&&scene.sfx.every(id=>ALLOWED_SFX.has(id));
  });
}
