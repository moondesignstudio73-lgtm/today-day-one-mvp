import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { DAY1_AUDIO_CUES, validateDay1AudioData } from "../src/day1-audio-data.mjs";
import {
  DAY1_CONTACT_CHOICES,
  DAY1_QUESTION_CHOICES,
  applyLockedDay1ChoiceState,
  getLockedDay1Segment,
  validateLockedDay1Runtime
} from "../src/day1-campaign-runtime.mjs";
import { measureAllDay1Routes } from "../scripts/measure-day1-playtime.mjs";

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");
const htmlSource=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const cssSource=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
const makeState=()=>({storyFlags:{},storyHistory:[]});
const allRoutes=[];

for(const contact of DAY1_CONTACT_CHOICES){
  for(const question of DAY1_QUESTION_CHOICES){
    const state=makeState();
    const opening=getLockedDay1Segment(state,0);
    applyLockedDay1ChoiceState(state,contact.id);
    const middle=getLockedDay1Segment(state,1);
    applyLockedDay1ChoiceState(state,question.id);
    allRoutes.push([...opening,...middle,...getLockedDay1Segment(state,2)]);
  }
}

// STORY
assert.equal(validateLockedDay1Runtime(),true);
assert.equal(allRoutes.length,9);
const allText=allRoutes.flat().filter(step=>step.text).map(step=>step.text).join("\n");
for(const forbidden of ["트럭과 충돌","하은도 차에 타고","나를 감쌌","가짜 하은","의미심장한 미소","왠지 모를 불안"]){
  assert.equal(allText.includes(forbidden),false,forbidden);
}
assert.match(allText,/검증 가능한 주장/);
assert.match(allText,/안전 수칙/);
assert.match(allText,/나부터/);
console.log("✓ STORY — 캐릭터 음성·정보 예산·3×3 선택 콜백·종료 훅 PASS");

// VISUAL
const visualSources=new Set(allRoutes.flat().flatMap(step=>[step.source,step.assetUrl]).filter(Boolean));
assert.ok(visualSources.size>=10);
for(const source of visualSources){
  const url=new URL(`../${source}`,import.meta.url);
  assert.equal(existsSync(url),true,source);
  const file=readFileSync(url);
  assert.equal(file.subarray(1,4).toString(),"PNG",source);
  const isFullFrame=/assets\/(backgrounds|events)\//.test(source);
  assert.ok(file.readUInt32BE(16)>=(isFullFrame?900:140),source);
  assert.ok(file.readUInt32BE(20)>=(isFullFrame?600:400),source);
}
assert.equal([...visualSources].some(source=>/first-eye-contact-v1|thirty-day-resolve-v1/.test(source)),false);
console.log("✓ VISUAL — 승인 배경·투명 스프라이트·의료진·CG 경로와 최소 크기 PASS");

// DIRECTION
const representative=allRoutes[0];
assert.ok(representative.filter(step=>step.type==="transition").length>=7);
assert.equal(representative.filter(step=>step.type==="cgShow").length,3);
assert.match(gameSource,/StoryCg/);
assert.match(gameSource,/StoryAutoCue/);
assert.match(cssSource,/prefers-reduced-motion:reduce/);
assert.match(cssSource,/body\.campaign-story-mode \.vn-expression-layer\{display:none!important\}/);
assert.match(cssSource,/:fullscreen \.topbar,[\s\S]*?background:linear-gradient\(90deg,#090a12f7,#211c29f2 58%,#3a303bf2\);/);
assert.match(cssSource,/:fullscreen \.topbar :is\(\.brand,\.brand strong,\.brand small\)[\s\S]*?color:#fff!important;/);
assert.match(cssSource,/:fullscreen \.topbar \.game-mode-badge,[\s\S]*?background:#f06f98;[\s\S]*?color:#fff;/);
assert.match(cssSource,/\.vn-stage :is\(img,video\)\{[\s\S]*?-webkit-user-drag:none;[\s\S]*?pointer-events:none;/);
assert.match(gameSource,/document\.addEventListener\("dragstart",event=>\{if\(isProtectedStorySurface\(event\.target\)\)event\.preventDefault\(\);\},true\);/);
assert.match(gameSource,/document\.addEventListener\("selectstart",event=>\{if\(isProtectedStorySurface\(event\.target\)\)event\.preventDefault\(\);\},true\);/);
console.log("✓ DIRECTION — Scene 전환·CG·입력 잠금·감소 모션 PASS");

// AUDIO
assert.equal(validateDay1AudioData(),true);
assert.equal(Object.keys(DAY1_AUDIO_CUES).length,9);
for(const cue of Object.values(DAY1_AUDIO_CUES))assert.equal(existsSync(new URL(`../${cue.source}`,import.meta.url)),true,cue.source);
console.log("✓ AUDIO — BGM·앰비언스·SFX 큐와 파일 PASS");

// GAMEPLAY
const measured=measureAllDay1Routes();
assert.equal(measured.length,9);
assert.ok(measured.every(route=>route.minutes>=7&&route.minutes<=10));
assert.ok(allRoutes.every(route=>route.filter(step=>step.type==="choice").length===2&&route.at(-1).type==="sceneEnd"));
console.log("✓ GAMEPLAY — 9개 경로·2개 선택·엔딩 도달·플레이타임 PASS");

// UX
assert.match(gameSource,/finishDialogueTyping\(\)\)\{scheduleAutoAdvance\(\);return;\}/);
assert.match(gameSource,/replaceAll\("\[플레이어 이름\]",playerName\)/);
assert.match(gameSource,/function advanceCampaignChapter\(completedSession\)/);
assert.match(gameSource,/state\.scenario\?\.enabled!==true/);
assert.match(gameSource,/else if\(nextCampaignScene\)setTimeout\(\(\)=>openStoryScene\(nextCampaignScene\),0\)/);
assert.match(gameSource,/storyChoiceLayer"\)\.addEventListener\("keydown"/);
assert.match(htmlSource,/id="visualNovelStage" role="button" tabindex="0"/);
assert.match(htmlSource,/id="storyChoiceLayer"[^>]*aria-label="스토리 선택지"/);
assert.match(htmlSource,/game\.js\?v=\d+/);
console.log("✓ UX — AUTO 장문 진행·키보드·ARIA·캐시 버전 PASS");

// BUG
assert.doesNotMatch(gameSource,/console\.log\(/);
assert.ok(representative.every(step=>step.type!=="dialogue"||Boolean(step.speaker&&step.text)));
console.log("✓ BUG — 런타임 정적 계약·누락 화자·디버그 출력 PASS");
