import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {DAY14_V4_CHAPTER_CONTRACT,DAY14_V4_CHOICES,DAY14_V4_KNOWLEDGE_LEDGER,DAY14_V4_SCENES,DAY14_V4_STATE_FIELDS,DAY14_V4_VERSION,DAY14_V4_VOICE_PROFILES} from "../src/day14-v4-campaign-data.mjs";
import {beginDay14V4,getDay14V4Compatibility,getDay14V4RestoreContract,isDay14V4HandContactEligible} from "../src/day14-v4-state-contract.mjs";

assert.equal(DAY14_V4_VERSION,"NOTION_V4");assert.equal(DAY14_V4_SCENES.length,22);assert.deepEqual(DAY14_V4_SCENES.map(scene=>scene.number),Array.from({length:22},(_,i)=>i+1));
assert.equal(DAY14_V4_CHOICES.length,10);assert.deepEqual(DAY14_V4_CHOICES.map(choice=>choice.number),Array.from({length:10},(_,i)=>i+1));assert.equal(DAY14_V4_CHOICES[1].options.length,4);
assert.ok(DAY14_V4_CHAPTER_CONTRACT.informationBudget.mustReveal.length>=5);assert.ok(DAY14_V4_CHAPTER_CONTRACT.informationBudget.mustNotReveal.includes("나리의 사적 호감 자동 생성"));assert.ok(DAY14_V4_VOICE_PROFILES.haeun.agency);assert.ok(DAY14_V4_KNOWLEDGE_LEDGER.nari.doesNotKnow.includes("하은의 실제 기분"));
for(const key of ["day14V4NariMet","day14V4PurchaseOutcome","day14V4InteractionRoute","day14V4HaeunWorkStoryHeard","day14V4HandContactEstablished","day14V4NariPrivateContact","day14V4ExhibitionInvitation","day14V4CanAffordFlower","day14V4HaeunMeetingAvailability"])assert.ok(key in DAY14_V4_STATE_FIELDS,key);

const newState={storyFlags:{day13ScenarioVersion:"NOTION_V3",day13V3Completed:true,day14FlowerDeskPlanPending:true}};
assert.equal(getDay14V4Compatibility(newState).mode,"V4_NEW");beginDay14V4(newState,{relationshipBand:"VERY_HIGH",priorHandContact:true,unresolvedContactBoundary:false,day13DeskPhotoReceived:false});
assert.equal(newState.storyFlags.day14V4RelationshipBand,"HIGH");assert.equal(newState.storyFlags.day14V4NariMet,null);assert.equal(newState.storyFlags.day14V4NariPrivateContact,false);assert.equal(getDay14V4RestoreContract(newState).checkpoint,1);
assert.equal(isDay14V4HandContactEligible({priorHandContact:true,unresolvedContactBoundary:false,haeunInitiatedHand:true}),true);assert.equal(isDay14V4HandContactEligible({priorHandContact:true,unresolvedContactBoundary:true,haeunInitiatedHand:true}),false);assert.equal(isDay14V4HandContactEligible({priorHandContact:false,unresolvedContactBoundary:false,haeunInitiatedHand:true}),false);
const legacy={storyFlags:{day14RuntimeStage:2,day14PurchaseStrategy:"buy-needed"}};assert.equal(getDay14V4Compatibility(legacy).mode,"V1_LEGACY");assert.equal(beginDay14V4(legacy).mode,"V1_LEGACY");
assert.equal(getDay14V4Compatibility({storyFlags:{}}).mode,"BLOCKED_PREREQUISITE");
const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
// Bump the game.js query whenever game.js changes; these new DAY 14 V4 modules use v=1 for their first public release and version independently afterward.
assert.match(html,/game\.js\?v=272/);
assert.match(gameSource,/import \{ beginDay14V4, getDay14V4Compatibility \} from "\.\/src\/day14-v4-state-contract\.mjs\?v=1";/);
assert.match(gameSource,/import \{ applyDay14V4Choice \} from "\.\/src\/day14-v4-runtime\.mjs\?v=1";/);
assert.match(gameSource,/function getLockedDay14ResumePresentation\(currentState\)\{return getDay14V4Compatibility\(currentState\)\.mode==="V1_LEGACY"\?getLegacyDay14ResumePresentation\(currentState\):getDay14V4ResumePresentation\(currentState\);\}/);
assert.match(gameSource,/layer\.style\.objectFit=step\.fit\?\?"contain";layer\.style\.objectPosition=step\.objectPosition\?\?"50% 50%";/);
console.log("day14-v4-contract.test: all assertions passed");
