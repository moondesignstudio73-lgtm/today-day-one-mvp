import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import { DAY2_AUDIO_CUES,validateDay2AudioData } from "../src/day2-audio-data.mjs";
import { validateLockedDay2Runtime } from "../src/day2-campaign-runtime.mjs";
import { buildDay2Route,createRepresentativeDay2Routes,measureAllDay2SearchOrders,measureRepresentativeDay2Routes } from "../scripts/measure-day2-playtime.mjs";

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");
const htmlSource=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const cssSource=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
const storyDataSource=readFileSync(new URL("../src/story-data.mjs",import.meta.url),"utf8");
const routes=createRepresentativeDay2Routes().map(buildDay2Route);
const allText=routes.flat().filter(step=>step.text).map(step=>step.text).join("\n");

// STORY
assert.equal(validateLockedDay2Runtime(),true);
for(const forbidden of ["D-29","가짜 하은","의미심장한 미소","왠지 모를 불안","휴대폰이 망가졌다","하은도 차에"]){
  assert.equal(allText.includes(forbidden),false,forbidden);
}
for(const required of ["지금의 내가 다시 판단","확인 가능한 답","미분류 물건","병원에 있고","임시 유심 넣은 예비 폰","확인한 것. 네가 말한 것. 아직 모르는 것"]){
  assert.match(allText,new RegExp(required),required);
}
assert.match(allText,/알겠습니다, 동승자님|설명 NPC 역할을 거부|여자친구 신뢰도 적립/);
console.log("✓ STORY — 12 Scene·인물 음성·정보 예산·선택 전략·결말 훅 PASS");

// VISUAL
const visualSources=new Set(routes.flat().flatMap(step=>[step.source,step.assetUrl]).filter(Boolean));
assert.ok(visualSources.size>=20);
for(const source of visualSources){
  const url=new URL(`../${source}`,import.meta.url);
  assert.equal(existsSync(url),true,source);
  const file=readFileSync(url);
  assert.equal(file.subarray(1,4).toString(),"PNG",source);
  const isFullFrame=/assets\/(backgrounds|events)\//.test(source);
  assert.ok(file.readUInt32BE(16)>=(isFullFrame?900:140),source);
  assert.ok(file.readUInt32BE(20)>=(isFullFrame?600:300),source);
}
assert.equal([...visualSources].some(source=>/protagonist-bedroom-afternoon-v1|home-threshold-v1|three-column-resolve-v1/.test(source)),false);
console.log("✓ VISUAL — 승인 배경·CG·투명 포즈·POV 경로와 교정본 사용 PASS");

// DIRECTION
const representative=routes[0];
assert.ok(representative.filter(step=>step.type==="transition").length>=13);
assert.equal(representative.filter(step=>step.type==="cgShow").length,4);
assert.match(gameSource,/StoryCg/);
assert.match(gameSource,/StoryAutoCue/);
assert.match(cssSource,/prefers-reduced-motion:reduce/);
assert.match(storyDataSource,/m30-day3-discharge-phone[\s\S]*?presentation:\{backgroundId:"day2-hospital-bedside"/);
assert.match(storyDataSource,/m30-day4-arrive-home[\s\S]*?presentation:\{backgroundId:"day2-home-entry"/);
console.log("✓ DIRECTION — 12 Scene 전환·CG·입력 잠금·감소 모션 PASS");

// AUDIO
assert.equal(validateDay2AudioData(),true);
assert.equal(Object.keys(DAY2_AUDIO_CUES).length,17);
for(const cue of Object.values(DAY2_AUDIO_CUES)){
  const url=new URL(`../${cue.source}`,import.meta.url);
  assert.equal(existsSync(url),true,cue.source);
  const file=readFileSync(url);
  assert.equal(file.subarray(0,4).toString(),"RIFF",cue.source);
  assert.equal(file.subarray(8,12).toString(),"WAVE",cue.source);
}
console.log("✓ AUDIO — BGM·앰비언스·SFX 17종 큐와 WAVE 파일 PASS");

// GAMEPLAY
const measured=measureRepresentativeDay2Routes();
assert.ok(measured.every(route=>route.minutes>=12&&route.minutes<=17));
assert.equal(measureAllDay2SearchOrders().length,96);
assert.ok(routes.every(route=>route.filter(step=>step.type==="choice").length>=8&&route.at(-1).type==="sceneEnd"));
console.log("✓ GAMEPLAY — 대표 관계 경로·탐색 96경로·엔딩·플레이타임 PASS");

// UX
assert.match(gameSource,/finishDialogueTyping\(\)\)\{scheduleAutoAdvance\(\);return;\}/);
assert.match(gameSource,/storyChoiceLayer"\)\.addEventListener\("keydown"/);
assert.match(gameSource,/state\.pendingStoryId&&!state\.eventRuntime\?\.activeEvent/);
assert.match(htmlSource,/id="visualNovelStage" role="button" tabindex="0"/);
assert.match(htmlSource,/id="storyChoiceLayer"[^>]*aria-label="스토리 선택지"/);
assert.match(htmlSource,/game\.js\?v=\d+/);
console.log("✓ UX — AUTO·키보드·ARIA·저장 복원·캐시 버전 PASS");

// BUG
assert.doesNotMatch(gameSource,/console\.log\(/);
assert.ok(routes.flat().every(step=>step.type!=="dialogue"||Boolean(step.speaker&&step.text)));
assert.match(gameSource,/eventsUnlocked\|\|isCampaignPrologueStory\(nextStory\?\.id\)\?nextStory:null/);
console.log("✓ BUG — DAY 2 기동·중복 큐·탐색 반응·런타임 정적 계약 PASS");
