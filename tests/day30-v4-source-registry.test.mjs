import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {DAY30_V4_SOURCE_LAST_EDITED,DAY30_V4_SOURCE_PAGE_ID,DAY30_V4_SOURCE_SCENES,DAY30_V4_SOURCE_SHA256,DAY30_V4_SOURCE_URL} from '../src/day30-v4-source-registry.mjs';

const raw=readFileSync(new URL('../docs/scenarios/DAY30_SCENARIO_V4_NOTION.md',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const choices=()=>DAY30_V4_SOURCE_SCENES.flatMap(scene=>scene.choices);

test('DAY30 source snapshot and Notion provenance remain locked',()=>{assert.equal(DAY30_V4_SOURCE_PAGE_ID,'3c9c31f0-29a6-81bb-bbc1-c80179590cdd');assert.equal(DAY30_V4_SOURCE_URL,'https://app.notion.com/p/3c9c31f029a681bbbbc1c80179590cdd');assert.equal(DAY30_V4_SOURCE_LAST_EDITED,'2026-08-27T21:17:38.535Z');assert.equal(createHash('sha256').update(raw).digest('hex'),DAY30_V4_SOURCE_SHA256);assert.equal(DAY30_V4_SOURCE_SHA256,'356623534957cd8a0d7393d3f79210c855145fd55a225d8b408689740e1c31f6');});

test('DAY30 registry preserves 30 scenes and all 28 authored choices',()=>{assert.deepEqual(DAY30_V4_SOURCE_SCENES.map(scene=>scene.number),Array.from({length:30},(_,index)=>index+1));assert.deepEqual(choices().map(choice=>choice.number),Array.from({length:28},(_,index)=>index+1));assert.equal(choices().every(choice=>[3,4,5].includes(choice.labels.length)),true);assert.deepEqual(choices().filter(choice=>choice.labels.length===4).map(choice=>choice.number),[6,27,28]);assert.deepEqual(choices().filter(choice=>choice.labels.length===5).map(choice=>choice.number),[26]);});

test('DAY30 source variants keep mutually exclusive endings separate',()=>{const variants=Object.fromEntries([...new Set(choices().map(choice=>choice.variant))].map(name=>[name,choices().filter(choice=>choice.variant===name).map(choice=>choice.number)]));assert.deepEqual(variants,{COMMON_OPENING:[1,2,3,4],HAEUN_PREPARATION:[5,6,7,8,9],HAEUN_DEFERRED:[10,11],HAEUN_LONG_TERM:[12],HAEUN_CONTINUING:[13],HAEUN_BREAKUP:[14],SOLO_AFTER_BREAKUP:[15],YURI_RELATIONSHIP:[16],SEOJIN_RELATIONSHIP:[17],ARA_RELATIONSHIP:[18],GETTING_TO_KNOW:[19],SOLO:[20],UNRESOLVED_TRUTH:[21],COMMON_LIFE:[22,23,24],ROUTE_CLOSE:[25],COMMON_CLOSE:[26,27,28]});});

test('DAY30 player source excludes editorial notes and replaced V3 prose',()=>{assert.doesNotMatch(raw,/INTERNAL EDITORIAL NOTES|이전 원고 보관|DAY30_SCENARIO_V3/);assert.match(raw,/\*\*DAY 30 END\*\*/);assert.match(raw,/## AFTER STORY — 선택한 삶의 짧은 다음 장면/);});
