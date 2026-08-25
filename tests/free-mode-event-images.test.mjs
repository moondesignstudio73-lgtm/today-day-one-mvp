import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { SITUATION_EVENTS } from "../src/situation-events-data.mjs";
import { createEventSceneSequence } from "../src/story-scene-controller.mjs";

function pngSize(source){
  const data=readFileSync(source);
  assert.equal(data.toString("ascii",1,4),"PNG",`${source}: PNG signature`);
  return {width:data.readUInt32BE(16),height:data.readUInt32BE(20)};
}

assert.equal(SITUATION_EVENTS.length,44,"all free-mode and Yuna events are covered");
for(const event of SITUATION_EVENTS){
  assert.equal(event.image?.status,"ready",`${event.id}: image ready`);
  assert.ok(event.image?.intro,`${event.id}: intro image declared`);
  assert.equal(event.image.result,event.image.intro,`${event.id}: one consistent CG for intro and result`);
  assert.equal(existsSync(event.image.intro),true,`${event.id}: image exists`);
  const {width,height}=pngSize(event.image.intro);
  assert.ok(width>=1200&&height>=675,`${event.id}: high-resolution CG (${width}x${height})`);
  const cg=createEventSceneSequence(event).find(step=>step.type==="cgShow");
  assert.equal(cg?.source,event.image.intro,`${event.id}: runtime CG is wired`);
}

const byId=Object.fromEntries(SITUATION_EVENTS.map(event=>[event.id,event]));
assert.equal(byId["situation-meet-her-friends"].npcId,"heroine-best-friend");
assert.equal(byId["situation-meet-her-friends"].npcName,"소라");
assert.equal(byId["situation-friends-evaluate-partner"].npcId,"best-friend");
assert.equal(byId["situation-parents-first-story"].npcId,"girlfriend");
assert.ok(SITUATION_EVENTS.filter(event=>event.heroineIds?.includes("yuna")).every(event=>event.image.intro.includes("/school-romance/")));

const gameSource=readFileSync("game.js","utf8");
assert.match(gameSource,/resultPopup\.imageAsset\?\?null/);
assert.match(gameSource,/imageAsset:event\.image\?\.result\?\?event\.image\?\.intro/);

console.log("Free-mode event image checks passed.");
