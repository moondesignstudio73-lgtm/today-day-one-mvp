import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {DAY29_V4_SOURCE_LAST_EDITED,DAY29_V4_SOURCE_PAGE_ID,DAY29_V4_SOURCE_SCENES,DAY29_V4_SOURCE_SHA256,DAY29_V4_SOURCE_URL} from '../src/day29-v4-source-registry.mjs';

const raw=readFileSync(new URL('../docs/scenarios/DAY29_SCENARIO_V4_NOTION.md',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const choices=()=>DAY29_V4_SOURCE_SCENES.flatMap(scene=>scene.choices);

test('DAY29 source snapshot and Notion provenance remain locked',()=>{assert.equal(DAY29_V4_SOURCE_PAGE_ID,'3c9c31f0-29a6-8111-b76b-edb7bbadf790');assert.equal(DAY29_V4_SOURCE_URL,'https://app.notion.com/p/3c9c31f029a68111b76bedb7bbadf790');assert.equal(DAY29_V4_SOURCE_LAST_EDITED,'2026-08-27T21:11:30.663Z');assert.equal(createHash('sha256').update(raw).digest('hex'),DAY29_V4_SOURCE_SHA256);assert.equal(DAY29_V4_SOURCE_SHA256,'7346cee0f4f0ae27e22c174fdd9db3a07221117e4641e238d41cac61dc3ae186');});

test('DAY29 registry preserves 24 scenes and all 23 authored choices',()=>{assert.deepEqual(DAY29_V4_SOURCE_SCENES.map(scene=>scene.number),Array.from({length:24},(_,index)=>index+1));assert.deepEqual(choices().map(choice=>choice.number),Array.from({length:23},(_,index)=>index+1));assert.equal(choices().every(choice=>[3,4].includes(choice.labels.length)),true);assert.deepEqual(choices().filter(choice=>choice.labels.length===4).map(choice=>choice.number),[13,21]);});

test('DAY29 source variants preserve mutually exclusive evening routes',()=>{const variants=Object.fromEntries(['COMMON_DAY','HAEUN_EVENING','NEW_RELATIONSHIP','SOLO_EVENING','UNRESOLVED_TRUTH','COMMON_CLOSE'].map(name=>[name,choices().filter(choice=>choice.variant===name).map(choice=>choice.number)]));assert.deepEqual(variants,{COMMON_DAY:[1,2,3,4,5,6,7,8,9],HAEUN_EVENING:[10,11,12,13,14,15,16,17],NEW_RELATIONSHIP:[18],SOLO_EVENING:[19],UNRESOLVED_TRUTH:[20],COMMON_CLOSE:[21,22,23]});});

test('DAY29 player source excludes internal notes and replaced V3 prose',()=>{assert.doesNotMatch(raw,/INTERNAL EDITORIAL NOTES|이전 원고 보관|DAY29_SCENARIO_V3/);assert.match(raw,/\*\*DAY 29 END\*\*/);});
