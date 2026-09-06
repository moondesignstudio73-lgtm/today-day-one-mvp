import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {DAY27_V4_SOURCE_LAST_EDITED,DAY27_V4_SOURCE_PAGE_ID,DAY27_V4_SOURCE_SCENES,DAY27_V4_SOURCE_SHA256,DAY27_V4_SOURCE_URL} from '../src/day27-v4-source-registry.mjs';

const raw=readFileSync(new URL('../docs/scenarios/DAY27_SCENARIO_V4_NOTION.md',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const choices=()=>DAY27_V4_SOURCE_SCENES.flatMap(scene=>scene.choices);

test('DAY27 source snapshot and Notion provenance remain locked',()=>{assert.equal(DAY27_V4_SOURCE_PAGE_ID,'3c9c31f0-29a6-81fe-b0e1-df8c541775c9');assert.equal(DAY27_V4_SOURCE_URL,'https://app.notion.com/p/3c9c31f029a681feb0e1df8c541775c9');assert.equal(DAY27_V4_SOURCE_LAST_EDITED,'2026-08-27T20:56:48.044Z');assert.equal(createHash('sha256').update(raw).digest('hex'),DAY27_V4_SOURCE_SHA256);assert.equal(DAY27_V4_SOURCE_SHA256,'61aa989b03f52252ab1a017f6d7b1c564a4aa9e7f2cbb045bd6ee91a2455e595');});

test('DAY27 source registry preserves 24 scenes and every authored choice block',()=>{assert.deepEqual(DAY27_V4_SOURCE_SCENES.map(scene=>scene.number),Array.from({length:24},(_,index)=>index+1));assert.equal(choices().length,23);assert.equal(choices().every(choice=>choice.labels.length>=3&&choice.labels.length<=4),true);assert.equal(choices().find(choice=>choice.variant==='RELATIONSHIP_TRUTH'&&choice.number===3).labels.length,4);const expected={COMMON_MORNING:[1],CONVERSATION_START:[2],RELATIONSHIP_TRUTH:[3,4,5,6,7],HONEST_LISTENING:[8,9,10],PUBLIC_CORRECTION:[11],CONVERSATION_END:[12],JIHOON_SUPPORT:[13],COMMON_EVENING:[14],CONTINUING_NIGHT:[15,16],SEPARATION_NIGHT:[15],NO_CONVERSATION:[3,4,5,6,7,8]};for(const [variant,numbers] of Object.entries(expected))assert.deepEqual(choices().filter(choice=>choice.variant===variant).map(choice=>choice.number),numbers);});

test('DAY27 player source excludes internal editorial notes and legacy prose',()=>{assert.doesNotMatch(raw,/INTERNAL EDITORIAL NOTES|이전 원고 보관|DAY27_SCENARIO_V3/);assert.match(raw,/\\\[DAY 27 END\\\]/);});
