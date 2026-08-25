import { pathToFileURL } from "node:url";
import {
  DAY2_CONTACT_CHOICES,
  DAY2_HOME_CHOICES,
  DAY2_KEY_CHOICES,
  DAY2_MARRIAGE_CHOICES,
  DAY2_PHOTO_CHOICES,
  DAY2_SEARCH_CHOICES,
  DAY2_TRAVEL_CHOICES,
  applyLockedDay2ChoiceState,
  getLockedDay2Segment
} from "../src/day2-campaign-runtime.mjs";

export const ORDINARY_READING_CPM=340;
export const TARGET_MINUTES={min:12,max:17};

const permutations=(items,length,prefix=[])=>prefix.length===length?[prefix]:items.flatMap((item,index)=>permutations([...items.slice(0,index),...items.slice(index+1)],length,[...prefix,item]));
export const DAY2_SEARCH_ROUTES=permutations(DAY2_SEARCH_CHOICES.map(choice=>choice.id),3);

const createState=({contactId="contact_boundary",questionId="accident_interest"}={})=>({
  storyFlags:{[contactId]:true,[questionId]:true},
  scenario:{enabled:true,investigation:0,memoryRecovery:0,haeunAffection:0,haeunTrust:0,homeSearchCount:0}
});

const appendChoice=(sequence,state,choiceId)=>{
  const result=applyLockedDay2ChoiceState(state,choiceId);
  if(!result)throw new Error(`Invalid DAY 2 route choice: ${choiceId}`);
  sequence.push(...getLockedDay2Segment(state,result.stage));
};

export function buildDay2Route(route){
  const state=createState(route);
  const sequence=[...getLockedDay2Segment(state,0)];
  appendChoice(sequence,state,route.marriageId);
  appendChoice(sequence,state,route.homeId);
  appendChoice(sequence,state,route.travelId);
  appendChoice(sequence,state,route.photoId);
  for(const searchId of route.searchIds){
    const result=applyLockedDay2ChoiceState(state,searchId);
    if(!result)throw new Error(`Invalid DAY 2 search: ${searchId}`);
    sequence.push(...getLockedDay2Segment(state,result.stage));
    if(result.stage==="key")appendChoice(sequence,state,route.keyId??DAY2_KEY_CHOICES[0].id);
  }
  appendChoice(sequence,state,route.contactChoiceId);
  return sequence;
}

export function estimateDay2Playtime(sequence,{charactersPerMinute=ORDINARY_READING_CPM,choiceSeconds=5}={}){
  const textSteps=sequence.filter(step=>typeof step.text==="string");
  const readingMs=textSteps.reduce((total,step)=>total+Math.max(1400,(step.text.length/charactersPerMinute)*60000+500),0);
  const presentationMs=sequence.reduce((total,step)=>{
    if(step.type==="transition")return total+1080;
    if(step.type==="cgShow")return total+(step.duration??1800);
    if(step.type==="characterEnter")return total+420;
    if(step.type==="itemShow")return total+120;
    if(step.type==="sfx"||step.type==="animation")return total+40;
    return total;
  },0);
  const choices=sequence.filter(step=>step.type==="choice").length;
  const totalMs=readingMs+presentationMs+(choices*choiceSeconds*1000);
  return {minutes:Number((totalMs/60000).toFixed(2)),textSteps:textSteps.length,characters:textSteps.reduce((sum,step)=>sum+step.text.length,0),choices,readingMs:Math.round(readingMs),presentationMs};
}

export function createRepresentativeDay2Routes(){
  return [
    {id:"boundary-investigation-key-last",contactId:"contact_boundary",questionId:"accident_interest",marriageId:"marriage_pause",homeId:"set_home_boundary",travelId:"ask_record_boundary",photoId:"photo_observation",searchIds:["room_desk_checked","pc_interest","unclassified_key_found"],keyId:"key_log_only",contactChoiceId:"contact_familiar"},
    {id:"acceptance-warm-key-first",contactId:"contact_acceptance",questionId:"family_question_first",marriageId:"present_impression",homeId:"thank_for_waiting",travelId:"admit_road_fear",photoId:"photo_relationship_open",searchIds:["unclassified_key_found","wardrobe_checked","friends_interest"],keyId:"key_test_visible_only",contactChoiceId:"contact_verify_playful"},
    {id:"identity-verification-no-key",contactId:"identity_first",questionId:"recovery_focus",marriageId:"relationship_verify",homeId:"ask_if_never_woke",travelId:"ask_past_self",photoId:"photo_verify_later",searchIds:["room_desk_checked","pc_interest","wardrobe_checked"],contactChoiceId:"contact_formal"}
  ];
}

export function measureRepresentativeDay2Routes(options){return createRepresentativeDay2Routes().map(route=>({...route,...estimateDay2Playtime(buildDay2Route(route),options)}));}

export function measureAllDay2SearchOrders(options){
  const base=createRepresentativeDay2Routes()[0];
  return DAY2_SEARCH_ROUTES.flatMap(searchIds=>{
    const hasKey=searchIds.includes("unclassified_key_found");
    const keyIds=hasKey?DAY2_KEY_CHOICES.map(choice=>choice.id):[undefined];
    return keyIds.map(keyId=>({searchIds,keyId,...estimateDay2Playtime(buildDay2Route({...base,searchIds,keyId}),options)}));
  });
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const results=measureRepresentativeDay2Routes();
  console.table(results.map(({id,minutes,textSteps,characters,choices})=>({id,minutes,textSteps,characters,choices})));
  const searchOrders=measureAllDay2SearchOrders();
  const minutes=searchOrders.map(result=>result.minutes);
  console.log(`DAY 2 ordinary-reading estimate: ${Math.min(...minutes).toFixed(2)}–${Math.max(...minutes).toFixed(2)} min across ${searchOrders.length} room-search routes (${ORDINARY_READING_CPM} Korean characters/min)`);
}
