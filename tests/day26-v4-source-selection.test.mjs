import assert from 'node:assert/strict';
import test from 'node:test';
import {DAY26_V4_SOURCE_SCENES} from '../src/day26-v4-source-registry.mjs';
import {day26V4SourceRef,validateDay26V4SourceStep} from '../src/day26-v4-source-selection.mjs';

test('DAY26 exact source refs accept only registered whole lines',()=>{const line='오늘 해야 할 말을 옷이 대신해 주지는 않았다.';assert.deepEqual(day26V4SourceRef(1,line),{day:26,sceneNumber:1,exact:line});assert.equal(validateDay26V4SourceStep({source:day26V4SourceRef(1,line)}),true);assert.throws(()=>day26V4SourceRef(1,'오늘 해야 할 말을'),/DAY26_SOURCE_LINE_MISSING/);assert.equal(DAY26_V4_SOURCE_SCENES.length,24);});
