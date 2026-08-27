import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { getVisibleActionEffects } from "../src/action-result-assets.mjs";
import { ACTIONS } from "../src/actions-data.mjs";
import { getNpcSprite } from "../src/assets/asset-manifest.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { createInitialState } from "../src/game-core.mjs";
import { applyNpcActionEffects } from "../src/npc-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import {
  EXTORTION_ENCOUNTER_CHANCE,
  JAEMIN_QUIZZES,
  resolveRepeatWorldEncounter,
  rollRepeatWorldEncounter
} from "../src/world-encounter-manager.mjs";
import { WORLD_MAPS } from "../src/world-map-manager.mjs";

const createFreeState=()=>createInitialState(
  createGirlfriendFromProfile("haeun",()=>0.5),
  ()=>0.5,
  {mode:GAME_MODES.FREE_ROMANCE}
);

assert.equal(EXTORTION_ENCOUNTER_CHANCE,0.2);
assert.equal(getNpcSprite("anonymous-extortionist"),"assets/npcs/anonymous-extortionist-2d.png");
assert.equal(existsSync(getNpcSprite("anonymous-extortionist")),true);

const fightState=createFreeState();
Object.assign(fightState,{health:80,energy:80,trust:500,affection:500,stress:20,money:1_000_000});
const jamsilStation=WORLD_MAPS.jamsil.locations.find(location=>location.id==="jamsil-station");
const fightEncounter=rollRepeatWorldEncounter(fightState,jamsilStation,19*60,()=>0);
assert.equal(fightEncounter.routeType,"extortion");
assert.deepEqual(fightEncounter.choices.map(choice=>choice.id),["take-beating","pay-quietly"]);
const fightResult=resolveRepeatWorldEncounter(fightState,fightEncounter,"take-beating");
assert.deepEqual(fightResult.playerEffects,{health:-20,energy:-20,trust:-20,affection:-20,stress:30});
assert.deepEqual([fightState.health,fightState.energy,fightState.trust,fightState.affection,fightState.stress],[60,60,480,480,50]);
assert.equal(fightState.npcHistory.length,0);

const payState=createFreeState();
Object.assign(payState,{trust:500,affection:500,stress:20,money:1_000_000});
const myeongdongStation=WORLD_MAPS.myeongdong.locations.find(location=>location.id==="myeongdong-station");
const payEncounter=rollRepeatWorldEncounter(payState,myeongdongStation,19*60,()=>0);
const payResult=resolveRepeatWorldEncounter(payState,payEncounter,"pay-quietly");
assert.equal(payResult.moneyLoss,100_000);
assert.deepEqual([payState.trust,payState.affection,payState.stress,payState.money],[470,470,10,900_000]);
assert.deepEqual(payState.economyLedger.at(-1),{day:payState.day,category:"extortion",label:"명동역 협박 피해",amount:-100_000});

assert.deepEqual(Object.keys(JAEMIN_QUIZZES),["prime-gym","boxing-studio","protein-cafe","running-park","climbing-lab"]);
assert.ok(Object.values(JAEMIN_QUIZZES).every(questions=>questions.length===5));

const coworkerState=createFreeState();
const lunch=ACTIONS.day.find(action=>action.id==="coworker-lunch");
const minho=coworkerState.npcs.find(npc=>npc.id==="office-best-male");
const dohyun=coworkerState.npcs.find(npc=>npc.id==="office-partner");
const before=[minho.affection,dohyun.affection];
const coworkerResult=applyNpcActionEffects(coworkerState,lunch);
assert.deepEqual(coworkerResult.npcs.map(npc=>npc.name),["민호","도현"]);
assert.deepEqual(coworkerResult.displayEffects,{minhoAffection:1,dohyunAffection:1});
assert.deepEqual([minho.affection,dohyun.affection],[before[0]+1,before[1]+1]);
assert.deepEqual(getVisibleActionEffects(coworkerResult.displayEffects),[
  {key:"minhoAffection",label:"민호 호감도",value:1},
  {key:"dohyunAffection",label:"도현 호감도",value:1}
]);

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");
for(const marker of ["EXTORTION_ENCOUNTER_CHANCE","routeType===\"extortion\"","npcResult?.displayEffects","running-park","climbing-lab"]){
  assert.ok(gameSource.includes(marker),`브라우저 연결 누락: ${marker}`);
}

console.log("✓ gh-pages 자유 모드 기능·협박 조우·재민 25문항·민호/도현 점심 효과 비파괴 통합 PASS");
