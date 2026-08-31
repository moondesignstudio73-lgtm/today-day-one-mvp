import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {
  RAW_DAY16_V4_SCRIPT_01_12,
  DAY16_V4_SOURCE_REGISTRY_01_12,
  DAY16_V4_SOURCE_REGISTRY_01_12_META
} from "../src/day16-v4-source-registry-01-12.mjs";
import {
  RAW_DAY16_V4_SCRIPT_13_24,
  DAY16_V4_SOURCE_REGISTRY_13_24,
  DAY16_V4_SOURCE_REGISTRY_13_24_META
} from "../src/day16-v4-source-registry-13-24.mjs";

const hash=value=>createHash("sha256").update(value).digest("hex");
const all=[...DAY16_V4_SOURCE_REGISTRY_01_12,...DAY16_V4_SOURCE_REGISTRY_13_24];
const raw=`${RAW_DAY16_V4_SCRIPT_01_12}\n${RAW_DAY16_V4_SCRIPT_13_24}`;

assert.equal(RAW_DAY16_V4_SCRIPT_01_12.length,7057);
assert.equal(RAW_DAY16_V4_SCRIPT_13_24.length,9056);
assert.equal(hash(RAW_DAY16_V4_SCRIPT_01_12),DAY16_V4_SOURCE_REGISTRY_01_12_META.sourceSha256);
assert.equal(hash(RAW_DAY16_V4_SCRIPT_13_24),DAY16_V4_SOURCE_REGISTRY_13_24_META.sourceSha256);
assert.equal(DAY16_V4_SOURCE_REGISTRY_01_12_META.sourceMutation,false);
assert.equal(DAY16_V4_SOURCE_REGISTRY_13_24_META.sourceMutation,false);
assert.match(DAY16_V4_SOURCE_REGISTRY_01_12_META.stepsRole,/sourceMarkdown-is-verbatim-authority/);
assert.match(DAY16_V4_SOURCE_REGISTRY_13_24_META.choiceAlternativeContract,/exclusive-scene-17-outdoor-or-scene-18-home/);
assert.equal(DAY16_V4_SOURCE_REGISTRY_01_12_META.notionSnapshot,"2026-08-27T19:49:09.165Z");

assert.deepEqual(all.map(scene=>scene.number),Array.from({length:24},(_,index)=>index+1));
assert.equal(new Set(all.map(scene=>scene.id)).size,24);
assert.ok(all.every(scene=>Object.isFrozen(scene.routeContract)));
assert.deepEqual(
  all.filter(scene=>scene.choiceNumber!=null).map(scene=>[scene.number,scene.choiceNumber]),
  [[1,1],[2,2],[5,3],[7,4],[10,5],[13,6],[15,7],[17,8],[18,8],[19,9],[20,10],[22,11],[23,12]]
);
assert.deepEqual(
  [...new Set(all.map(scene=>scene.choiceNumber).filter(Number.isInteger))],
  Array.from({length:12},(_,index)=>index+1)
);

assert.match(raw,/## SCENE 01 — 아직 정하지 않은 약속/);
assert.match(raw,/## SCENE 24 — 남의 과거가 된 나/);
assert.match(raw,/\\\[DAY 16 END\\\]$/);
assert.doesNotMatch(raw,/INTERNAL IMPLEMENTATION NOTES/);
assert.doesNotMatch(raw,/<file/);
assert.doesNotMatch(raw,/V3 요약 대본/);

for(const option of [
  "잠깐 보자. 오래 있지는 않을게.",
  "오늘은 혼자 들렀다 올래.",
  "오늘은 집에서 쉬고 싶어.",
  "기억하지 못해서 미안해요.",
  "잠깐 이야기해도 될까요?",
  "지금은 조금 당황스러워요.",
  "내가 처음 듣는다고, 너한테 처음인 건 아니네.",
  "그럼 처음부터 다시 알면 안 될까요?",
  "지금 만나는 사람이 있어요. 하은이라고.",
  "지금은 조금 당황스러워요.",
  "다음에 조금 더 이야기할 수 있을까요?",
  "오늘 여기서 인사해도 괜찮겠어요.",
  "오늘은 아직 잘 모르겠어요. 인사만 할게요."
])assert.ok(raw.includes(option),`missing exact source option: ${option}`);

const scene5=all.find(scene=>scene.number===5);
assert.equal(scene5.choiceNumber,3);
assert.match(scene5.sourceMarkdown,/그가 뒤따라 나가지 않는다/);
assert.ok(scene5.steps.some(step=>step.type==="dialogue"&&step.speaker==="유리"&&step.text==="그런 뜻으로 안 들을게."));

const scene12=all.find(scene=>scene.number===12);
assert.ok(scene12.steps.some(step=>step.type==="dialogue"&&step.speaker==="유리"&&step.text==="이건 그냥 내 책이 닳은 거고. 너무 의미 있게 보지는 마."));

const scene18=all.find(scene=>scene.number===18);
assert.equal(scene18.routeContract.alternativeChoice,8);
assert.match(scene18.sourceMarkdown,/처음부터 집에 있던 오후/);

const scene22=all.find(scene=>scene.number===22);
assert.equal(scene22.routeContract.variantBy,"contact-shared|message-arrived");
assert.match(scene22.sourceMarkdown,/### 연락을 나눈 유리/);
assert.match(scene22.sourceMarkdown,/### 연락을 나누지 않은 밤/);

console.log("DAY16 V4 exact source registry: PASS");
