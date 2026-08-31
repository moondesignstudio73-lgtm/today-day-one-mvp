import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import test from "node:test";
import {DAY15_V4_PLAYABLE_SCRIPT_01_12} from "../src/day15-v4-playable-script-01-12.mjs";
import {DAY15_V4_SOURCE_REGISTRY_01_12,DAY15_V4_SOURCE_REGISTRY_01_12_META,RAW_DAY15_V4_SCRIPT_01_12,validateDay15V4SourceRegistry01To12Structure} from "../src/day15-v4-source-registry-01-12.mjs";

test("SCENE 01-12 exact source registry matches the fresh Notion slice",()=>{
  assert.equal(validateDay15V4SourceRegistry01To12Structure(),true);
  assert.equal(RAW_DAY15_V4_SCRIPT_01_12.length,9711);
  assert.equal(Buffer.byteLength(RAW_DAY15_V4_SCRIPT_01_12,"utf8"),21979);
  assert.equal(createHash("sha256").update(RAW_DAY15_V4_SCRIPT_01_12).digest("hex"),"cccf47e000930ff0e870536aa2773c75d198f33025840a05b2fcf77a56f443b1");
  assert.deepEqual(DAY15_V4_SOURCE_REGISTRY_01_12_META,{role:"verbatim-route-superset",sourcePageId:"3c9c31f0-29a6-8138-ab56-ed8ee668526d",sourceSnapshot:"2026-08-27T21:19:12.202Z",extractionStart:"## SCENE 01",extractionEndExclusive:"## SCENE 13",newlineNormalization:"LF",hashEncoding:"UTF-8",sourceLengthUtf16CodeUnits:9711,sourceLengthUtf8Bytes:21979,sourceSha256:"cccf47e000930ff0e870536aa2773c75d198f33025840a05b2fcf77a56f443b1",stepsRole:"unfiltered-source-steps",choiceOptionsAuthority:"day15-v4-campaign-data.mjs",runtimeStatus:"exact-route-resolved-adapter-connected"});
  assert.deepEqual(DAY15_V4_SOURCE_REGISTRY_01_12.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+1));
});

test("exact source retains every first-half route and choice marker",()=>{
  for(const marker of ["함께 보자는 초대","다녀오겠다는 연락","자기 오후의 입구","선택 3 — 아직 잘 모르겠을 때","자기 오후 선택 3","자기 오후 선택 4","자기 오후 선택 5","먼저 쉬는 자리","끝까지 함께 본 자리","선택 7 — 남아 있던 마음","질투라고 말한 사람","서투른 사람","못 만나게 하고 싶은 사람"]){assert.match(RAW_DAY15_V4_SCRIPT_01_12,new RegExp(marker));}
  assert.doesNotMatch(RAW_DAY15_V4_SCRIPT_01_12,/## SCENE 13|# INTERNAL IMPLEMENTATION NOTES|가짜 하은|사고 원인/);
});

test("parsed registry is dense but remains explicitly unfiltered",()=>{
  const stepCount=DAY15_V4_SOURCE_REGISTRY_01_12.reduce((total,scene)=>total+scene.steps.length,0);
  assert.ok(stepCount>=275,`expected >=275 parsed source steps, received ${stepCount}`);
  assert.equal(DAY15_V4_SOURCE_REGISTRY_01_12.find(scene=>scene.number===6).routeContract.ownAfternoonChoices.length,3);
  assert.equal(DAY15_V4_SOURCE_REGISTRY_01_12_META.runtimeStatus,"exact-route-resolved-adapter-connected");
});

test("omission audit keeps the condensed playable copy from being certified exact",()=>{
  const condensed=JSON.stringify(DAY15_V4_PLAYABLE_SCRIPT_01_12);
  const omittedMarkers=[
    "그 두 가지가 자기에게는 쉽게 나란히 놓이지 않는다",
    "따로 보내는 날에는 누군가에게 보여 주려고 옷을 고르지 않아도",
    "전시장 첫 방은 생각보다 조용하다",
    "그 말이 뜻밖에 좋다",
    "그녀가 지금 무엇을 하고 있는지 모르면서도 내 오후를 보낼 수 있었으면 했다",
    "표정이 생각보다 굳어 있다",
    "누구도 두 사람의 대답을 기다리고 있지 않다",
    "자기 불안을 그녀가 좁아져서 해결해 주길 바랐다는 생각이 든다"
  ];
  for(const marker of omittedMarkers)assert.doesNotMatch(condensed,new RegExp(marker));
  for(const marker of omittedMarkers)assert.match(RAW_DAY15_V4_SCRIPT_01_12,new RegExp(marker));
});
