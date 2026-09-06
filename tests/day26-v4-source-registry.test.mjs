import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {DAY26_V4_SOURCE_LAST_EDITED,DAY26_V4_SOURCE_PAGE_ID,DAY26_V4_SOURCE_SCENES,DAY26_V4_SOURCE_SHA256,DAY26_V4_SOURCE_URL} from '../src/day26-v4-source-registry.mjs';

const raw=readFileSync(new URL('../docs/scenarios/DAY26_SCENARIO_V4_NOTION.md',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const choices=()=>DAY26_V4_SOURCE_SCENES.flatMap(scene=>scene.choices);

test('DAY26 source snapshot and Notion provenance remain locked',()=>{assert.equal(DAY26_V4_SOURCE_PAGE_ID,'3c9c31f0-29a6-815a-bd8b-cbd60569e6bf');assert.equal(DAY26_V4_SOURCE_URL,'https://app.notion.com/p/3c9c31f029a6815abd8bcbd60569e6bf');assert.equal(DAY26_V4_SOURCE_LAST_EDITED,'2026-08-27T20:51:27.362Z');assert.equal(createHash('sha256').update(raw).digest('hex'),DAY26_V4_SOURCE_SHA256);assert.equal(DAY26_V4_SOURCE_SHA256,'9b9d73d8372f6c89d34f9612660d92ba262b9e2a003b5f5a8b17d3c3f02007b5');});

test('DAY26 source registry preserves 24 scenes and every authored choice block',()=>{assert.deepEqual(DAY26_V4_SOURCE_SCENES.map(scene=>scene.number),Array.from({length:24},(_,index)=>index+1));assert.equal(choices().length,28);assert.equal(choices().every(choice=>choice.labels.length===3),true);const expected={COMMON_START:[1],HAEUN_FRIEND_MEAL:[2,3,4,5,6,7,8,9,10,11,12],JIHOON_MEAL:[2,3],NEW_MEETING:[4,5,6,7,8],SOLO_DAY:[2,3,4,5,6,7,8],HAEUN_NIGHT:[13],COMMON_ENDING:[14]};for(const [variant,numbers] of Object.entries(expected))assert.deepEqual(choices().filter(choice=>choice.variant===variant).map(choice=>choice.number),numbers);});

test('DAY26 player source excludes internal editorial notes and legacy V3',()=>{assert.doesNotMatch(raw,/INTERNAL EDITORIAL NOTES|이전 원고 보관|DAY26_SCENARIO_V3/);assert.match(raw,/\\\[DAY 26 END\\\]/);});
