import { createInitialState } from "../src/game-core.mjs";
import { pathToFileURL } from "node:url";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import {
  DAY1_CONTACT_CHOICES,
  DAY1_QUESTION_CHOICES,
  applyLockedDay1ChoiceState,
  getLockedDay1Segment
} from "../src/day1-campaign-runtime.mjs";

export const ORDINARY_READING_CPM=340;
export const TARGET_MINUTES={min:7,max:10};

const createState=()=>createInitialState(createGirlfriendFromProfile("haeun",()=>0.5),()=>0.5,{mode:GAME_MODES.MARRIAGE_30});

export function buildDay1Route(contactId,questionId){
  const state=createState();
  const opening=getLockedDay1Segment(state,0);
  applyLockedDay1ChoiceState(state,contactId);
  const middle=getLockedDay1Segment(state,1);
  applyLockedDay1ChoiceState(state,questionId);
  return [...opening,...middle,...getLockedDay1Segment(state,2)];
}

export function estimateDay1Playtime(sequence,{charactersPerMinute=ORDINARY_READING_CPM,choiceSeconds=5}={}){
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
  return {
    minutes:Number((totalMs/60000).toFixed(2)),
    textSteps:textSteps.length,
    characters:textSteps.reduce((total,step)=>total+step.text.length,0),
    choices,
    readingMs:Math.round(readingMs),
    presentationMs
  };
}

export function measureAllDay1Routes(options){
  return DAY1_CONTACT_CHOICES.flatMap(contact=>DAY1_QUESTION_CHOICES.map(question=>({
    contactId:contact.id,
    questionId:question.id,
    ...estimateDay1Playtime(buildDay1Route(contact.id,question.id),options)
  })));
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const results=measureAllDay1Routes();
  console.table(results.map(({contactId,questionId,minutes,textSteps,characters})=>({contactId,questionId,minutes,textSteps,characters})));
  const minutes=results.map(result=>result.minutes);
  console.log(`DAY 1 ordinary-reading estimate: ${Math.min(...minutes).toFixed(2)}–${Math.max(...minutes).toFixed(2)} min (median model ${ORDINARY_READING_CPM} Korean characters/min)`);
}
