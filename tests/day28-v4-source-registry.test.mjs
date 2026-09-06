import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {DAY28_V4_SOURCE_LAST_EDITED,DAY28_V4_SOURCE_PAGE_ID,DAY28_V4_SOURCE_SCENES,DAY28_V4_SOURCE_SHA256,DAY28_V4_SOURCE_URL} from '../src/day28-v4-source-registry.mjs';

const raw=readFileSync(new URL('../docs/scenarios/DAY28_SCENARIO_V4_NOTION.md',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const choices=()=>DAY28_V4_SOURCE_SCENES.flatMap(scene=>scene.choices);

test('DAY28 source snapshot and Notion provenance remain locked',()=>{assert.equal(DAY28_V4_SOURCE_PAGE_ID,'3c9c31f0-29a6-81ab-aeb5-f17aaa4072d8');assert.equal(DAY28_V4_SOURCE_URL,'https://app.notion.com/p/3c9c31f029a681abaeb5f17aaa4072d8');assert.equal(DAY28_V4_SOURCE_LAST_EDITED,'2026-08-27T21:01:47.079Z');assert.equal(createHash('sha256').update(raw).digest('hex'),DAY28_V4_SOURCE_SHA256);assert.equal(DAY28_V4_SOURCE_SHA256,'7e108834a0aa31361f5c22a2d2a69e7127e3b3ff8cd622727438ecbfe94b6d5b');});

test('DAY28 source registry preserves 24 scenes and all authored choice blocks',()=>{assert.deepEqual(DAY28_V4_SOURCE_SCENES.map(scene=>scene.number),Array.from({length:24},(_,index)=>index+1));assert.equal(choices().length,26);assert.equal(choices().every(choice=>choice.labels.length===3),true);const expected={COMMON_MORNING:[1],HAEUN_MEETING:[2,3,4,5,6,7,8],BREAKUP_CLOSE:[9,10],HAEUN_CONTINUING:[9,10,11,12,13,14],NEW_MEETING:[8],SOCIAL_SCOPE:[15],SOLO_LIFE:[2,3,4,5,6,7,8],CONTINUING_NIGHT:[16]};for(const [variant,numbers] of Object.entries(expected))assert.deepEqual(choices().filter(choice=>choice.variant===variant).map(choice=>choice.number),numbers);});

test('DAY28 player source excludes internal notes and replaced V3 prose',()=>{assert.doesNotMatch(raw,/INTERNAL EDITORIAL NOTES|이전 원고 보관|DAY28_SCENARIO_V3/);assert.match(raw,/\\\[DAY 28 END\\\]/);});
