import {DAY15_V4_CHOICE_IDS,DAY15_V4_SCENARIO_ID,DAY15_V4_VERSION} from "./day15-v4-campaign-data.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const SOURCES=new Set(["DIRECTLY_OBSERVED","TOLD_BY_HAEUN","PRIOR_DAY11","UNKNOWN"]);
const SOURCE_FIELDS=["day15V4SiwooNameSource","day15V4SiwooAppearanceSource","day15V4SiwooRoleSource","day15V4SiwooProfessionalBehaviorSource","day15V4SiwooDirectionMistakeSource","day15V4ArtworkDiscussionSource","day15V4LastTimePhraseSource"];
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>(Number.isInteger(flags.day15RuntimeStage)&&flags.day15RuntimeStage>0)||flags.day15ActivityStrategy!=null||flags.day15ChangeStrategy!=null||flags.day15PrivacyStrategy!=null||flags.day15CurrentLeisureDatePending===true||flags.day15CurrentLeisureDateCompleted===true;
const hasV4Progress=flags=>Object.keys(flags).some(key=>key.startsWith("day15V4"));
const v4Prerequisite=flags=>flags.day14V4Version==="NOTION_V4"&&flags.day14V4Completed===true&&flags.day15GalleryPlanPending===true&&new Set(["INVITED","NOT_INVITED"]).has(flags.day14V4ExhibitionInvitation);

function day14Callback(flags){
  if(flags.day14V4MeetingProposal==="SHOW_PREPARED"||flags.day14V4UnresolvedContactBoundary===true)return "PRESSURED";
  if(flags.day14V4InteractionRoute==="IN_PERSON"||flags.day14V4InteractionRoute==="PHONE")return "TALKED_TOGETHER";
  if(flags.day14V4InteractionRoute==="FULL_REST")return "RESTED_SEPARATELY";
  return null;
}

function validateV4(flags){
  if(flags.day15V4Version!==DAY15_V4_VERSION||flags.day15V4ScenarioId!==DAY15_V4_SCENARIO_ID)return false;
  if(!Number.isInteger(flags.day15V4RuntimeStage)||flags.day15V4RuntimeStage<0)return false;
  if(!Number.isInteger(flags.day15V4SceneCheckpoint)||flags.day15V4SceneCheckpoint<1||flags.day15V4SceneCheckpoint>24)return false;
  if(!Number.isInteger(flags.day15V4ChoiceIndex)||flags.day15V4ChoiceIndex<0||flags.day15V4ChoiceIndex>12)return false;
  if(!Array.isArray(flags.day15V4SelectedChoiceIds)||new Set(flags.day15V4SelectedChoiceIds).size!==flags.day15V4SelectedChoiceIds.length)return false;
  const numbers=flags.day15V4SelectedChoiceIds.map(id=>DAY15_V4_CHOICE_IDS.get(id));
  if(numbers.some(number=>number==null)||new Set(numbers).size!==numbers.length||numbers.some((number,index)=>index>0&&number<numbers[index-1]))return false;
  if((numbers.at(-1)??0)!==flags.day15V4ChoiceIndex)return false;
  for(let number=1;number<=12;number++){
    const mirror=flags[`day15V4Choice${number}`],history=flags.day15V4SelectedChoiceIds.find(id=>DAY15_V4_CHOICE_IDS.get(id)===number);
    if((mirror==null)!=(history==null)||mirror!=null&&mirror!==history)return false;
  }
  if(!new Set(["INVITED","NOT_INVITED"]).has(flags.day15V4GalleryInvitation))return false;
  if(flags.day15V4AttendanceRoute!=null&&!new Set(["ATTEND","OWN_AFTERNOON"]).has(flags.day15V4AttendanceRoute))return false;
  if(flags.day15V4GalleryInvitation==="NOT_INVITED"&&flags.day15V4AttendanceRoute==="ATTEND")return false;
  if(flags.day15V4HaeunContactRoute!=null&&!new Set(["IN_PERSON","PHONE","NO_CONTACT"]).has(flags.day15V4HaeunContactRoute))return false;
  if(SOURCE_FIELDS.some(key=>!SOURCES.has(flags[key])))return false;
  if(flags.day15V4AttendanceRoute==="OWN_AFTERNOON"&&flags.day15V4HaeunContactRoute==="NO_CONTACT"&&SOURCE_FIELDS.some(key=>flags[key]==="DIRECTLY_OBSERVED"))return false;
  if(flags.day15V4PublicMaterialRead===true&&flags.day15V4PublicMaterialAccepted!==true)return false;
  if(flags.day15V4PublicMaterialAccepted===true&&flags.day15V4PublicMaterialOffered!==true)return false;
  if(flags.day15V4ControlContinued===true&&flags.day15V4BoundaryResolved!==false)return false;
  if(flags.day15V4HaeunLeft===true&&flags.day15V4ShoulderContactOccurred===true)return false;
  if(flags.day15V4ShoulderContactOccurred===true&&!isDay15V4ShoulderContactEligible(flags))return false;
  if(flags.day15V4Completed===true&&(flags.day15V4SceneCheckpoint!==24||flags.day15V4JihoonMessagePending!==true||flags.day16JihoonContactHookPending!==true||flags.day15GalleryPlanPending!==false))return false;
  return true;
}

export function getDay15V4Compatibility(state){
  const flags=flagsOf(state),legacy=hasLegacy(flags),v4=hasV4Progress(flags);
  if(legacy&&v4)return Object.freeze({mode:"BLOCKED_CORRUPT",complete:false,checkpoint:null});
  if(v4){
    if(!validateV4(flags))return Object.freeze({mode:"BLOCKED_CORRUPT",complete:false,checkpoint:null});
    return Object.freeze({mode:"V4",complete:flags.day15V4Completed===true,checkpoint:flags.day15V4SceneCheckpoint});
  }
  if(legacy)return Object.freeze({mode:"V1_LEGACY",complete:flags.day15CurrentLeisureDateCompleted===true,checkpoint:flags.day15RuntimeStage??0});
  if(v4Prerequisite(flags)&&day14Callback(flags))return Object.freeze({mode:"V4_NEW",complete:false,checkpoint:1});
  return Object.freeze({mode:"BLOCKED_PREREQUISITE",complete:false,checkpoint:null});
}

export function beginDay15V4(state,{relationshipBand="LOW",haeunCallsTonight=false}={}){
  state.storyFlags??={};
  const compatibility=getDay15V4Compatibility(state);
  if(compatibility.mode==="V4")return compatibility;
  if(compatibility.mode!=="V4_NEW")return compatibility;
  if(!BANDS.has(relationshipBand))throw new Error("DAY15_V4_RELATIONSHIP_BAND_REQUIRED");
  const flags=state.storyFlags,callback=day14Callback(flags);
  if(!callback)return Object.freeze({mode:"BLOCKED_PREREQUISITE",complete:false,checkpoint:null});
  flags.day15V4Version=DAY15_V4_VERSION;flags.day15V4ScenarioId=DAY15_V4_SCENARIO_ID;flags.day15V4RuntimeStage??=0;flags.day15V4SceneCheckpoint??=1;flags.day15V4ChoiceIndex??=0;flags.day15V4SelectedChoiceIds??=[];flags.day15V4Completed??=false;
  flags.day15V4RelationshipBand=relationshipBand==="VERY_HIGH"?"HIGH":relationshipBand;
  flags.day15V4GalleryInvitation=flags.day14V4ExhibitionInvitation;
  flags.day15V4Day14CallbackRoute=callback;
  flags.day15V4SeojinCallbackAvailable=flags.day12V3PersonalInvitation===true;
  flags.day15V4AraCallbackAvailable=flags.day13V3AraMet===true&&(flags.day13V3AraContinuation==="ASK_PHOTO_CONTACT"||flags.day13V3PhotoContact==="OCCASIONAL_EXCHANGE");
  flags.day15V4HaeunCallsTonight=haeunCallsTonight===true;
  for(const key of ["day15V4AttendanceRoute","day15V4OwnAfternoonRead","day15V4OwnAfternoonReflection","day15V4OwnAfternoonClose","day15V4HaeunContactRoute","day15V4RestDecision","day15V4CafeRoute","day15V4ConflictStrategy","day15V4GalleryUnderstandingStrategy","day15V4HaeunViewingStrategy","day15V4OutfitStrategy","day15V4ReciprocityStrategy","day15V4ControlContinued","day15V4HaeunLeft","day15V4BoundaryResolved","day15V4CurrentPerception","day15V4ClosingStrategy","day15V4ReturnWalk"]){if(!(key in flags))flags[key]=null;}
  for(const key of SOURCE_FIELDS){if(!(key in flags))flags[key]=key==="day15V4SiwooNameSource"&&flags.day11V3SiwooNameKnown===true?"PRIOR_DAY11":"UNKNOWN";}
  flags.day15V4ShoulderContactOccurred??=false;flags.day15V4PublicMaterialOffered??=false;flags.day15V4PublicMaterialAccepted??=false;flags.day15V4PublicMaterialRead??=false;flags.day15V4JihoonMessagePending??=false;flags.day16JihoonContactHookPending??=false;
  return getDay15V4Compatibility(state);
}

export function isDay15V4ShoulderContactEligible(flags={}){
  return (flags.day14V4HandContactEstablished===true||flags.day7V3HandContactEstablished===true)&&flags.day13V3HaeunDisclosureMismatch!==true&&flags.day13V3HaeunNeedsSpace!==true&&flags.day15V4BoundaryResolved===true&&flags.day15V4HaeunLeft!==true&&flags.day15V4ReturnWalk==="CLOSE_PACE";
}

function endingChoiceFrontier(flags){
  const selectedCount=flags.day15V4SelectedChoiceIds.length,ownAfternoon=flags.day15V4AttendanceRoute==="OWN_AFTERNOON";
  const choice=number=>flags[`day15V4Choice${number}`],prefixed=(number,prefix)=>choice(number)?.startsWith(prefix)===true;
  const openingValid=flags.day15V4GalleryInvitation==="NOT_INVITED"?choice(1)==="day15_v4_invitation_no_invite":ownAfternoon?choice(1)==="day15_v4_invitation_own_time":["day15_v4_invitation_attend","day15_v4_invitation_admit_tension"].includes(choice(1));
  if(!openingValid||!prefixed(2,"day15_v4_outfit_"))return false;
  if(ownAfternoon){if(![3,4,5].every(number=>prefixed(number,"day15_v4_own_"))||choice(6)!=null)return false;}
  else if(!prefixed(3,"day15_v4_gallery_")||!prefixed(4,"day15_v4_view_")||!prefixed(5,"day15_v4_rest_")||!prefixed(6,"day15_v4_cafe_"))return false;
  if(flags.day15V4HaeunContactRoute==="NO_CONTACT")return ownAfternoon&&flags.day15V4ChoiceIndex===5&&selectedCount===5&&[7,8,9,10,11,12].every(number=>choice(number)==null);
  if(!prefixed(7,"day15_v4_conflict_")||!prefixed(8,"day15_v4_reciprocity_")||!prefixed(9,"day15_v4_boundary_"))return false;
  if(flags.day15V4HaeunLeft===true)return choice(9)==="day15_v4_boundary_continue_control"&&flags.day15V4ChoiceIndex===9&&selectedCount===(ownAfternoon?8:9)&&[10,11,12].every(number=>choice(number)==null);
  if(choice(9)==="day15_v4_boundary_continue_control"||ownAfternoon&&choice(10)!=null||!ownAfternoon&&!prefixed(10,"day15_v4_perception_")||!prefixed(11,"day15_v4_closing_"))return false;
  if(flags.day15V4PublicMaterialOffered===true)return prefixed(12,"day15_v4_material_")&&flags.day15V4ChoiceIndex===12&&selectedCount===(ownAfternoon?11:12);
  return choice(12)==null&&flags.day15V4ChoiceIndex===11&&selectedCount===(ownAfternoon?10:11);
}

export function isDay15V4EndingSceneEligible(state){
  const flags=flagsOf(state),compatibility=getDay15V4Compatibility(state);
  if(compatibility.mode!=="V4")return false;
  if(!new Set(["ATTEND","OWN_AFTERNOON"]).has(flags.day15V4AttendanceRoute)||!new Set(["IN_PERSON","PHONE","NO_CONTACT"]).has(flags.day15V4HaeunContactRoute))return false;
  if(flags.day15V4AttendanceRoute==="OWN_AFTERNOON"&&flags.day15V4HaeunContactRoute==="IN_PERSON")return false;
  if(!endingChoiceFrontier(flags))return false;
  if(flags.day15V4Completed===true)return flags.day15V4SceneCheckpoint===24;
  if(flags.day15V4HaeunContactRoute==="NO_CONTACT"||flags.day15V4HaeunLeft===true)return flags.day15V4SceneCheckpoint===19;
  if(flags.day15V4PublicMaterialOffered===true)return flags.day15V4SceneCheckpoint===23;
  return flags.day15V4SceneCheckpoint===22;
}

export function getDay15V4RestoreContract(state){
  const flags=flagsOf(state),compatibility=getDay15V4Compatibility(state);
  if(compatibility.mode!=="V4")return compatibility;
  return Object.freeze({mode:"V4",complete:flags.day15V4Completed===true,checkpoint:flags.day15V4SceneCheckpoint,choiceIndex:flags.day15V4ChoiceIndex,selectedChoiceIds:Object.freeze([...flags.day15V4SelectedChoiceIds]),galleryInvitation:flags.day15V4GalleryInvitation,attendanceRoute:flags.day15V4AttendanceRoute,haeunContactRoute:flags.day15V4HaeunContactRoute,day14CallbackRoute:flags.day15V4Day14CallbackRoute,seojinCallbackAvailable:flags.day15V4SeojinCallbackAvailable,araCallbackAvailable:flags.day15V4AraCallbackAvailable,shoulderContactEligible:isDay15V4ShoulderContactEligible(flags),publicMaterialOffered:flags.day15V4PublicMaterialOffered,publicMaterialAccepted:flags.day15V4PublicMaterialAccepted,publicMaterialRead:flags.day15V4PublicMaterialRead,knowledgeSources:Object.freeze(Object.fromEntries(SOURCE_FIELDS.map(key=>[key,flags[key]])))});
}
